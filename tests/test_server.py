"""Tests for the WebSocket note server.

CI has no microphone, so these inject a fake session in place of
``MicSession``. The fake exposes ``emit`` so a test can make a note
arrive the way the audio thread would, which is the part worth testing:
that a detected note reaches a connected browser as JSON, and that the
microphone is only held open while someone is listening.
"""

import asyncio

import pytest
from fastapi.testclient import TestClient

from backend.server import NoteHub, create_app


class FakeSession:
    """Stands in for MicSession -- records start/stop, emits on demand."""

    instances = []

    def __init__(self, hub):
        self.hub = hub
        self.started = False
        self.stopped = False
        FakeSession.instances.append(self)

    def start(self):
        self.started = True

    def stop(self):
        self.stopped = True

    def emit(self, note_name, hz, cents):
        self.hub.publish_threadsafe({
            "type": "note",
            "note": note_name,
            "hz": hz,
            "cents": cents,
        })


@pytest.fixture
def client():
    FakeSession.instances = []
    return TestClient(create_app(session_factory=FakeSession))


class TestHealth:
    def test_reports_ok_with_no_listeners(self, client):
        # Act
        response = client.get("/health")
        # Assert
        assert response.status_code == 200
        assert response.json() == {"status": "ok", "listeners": 0}


class TestNoteStream:
    def test_a_detected_note_reaches_the_client(self, client):
        # Arrange / Act
        with client.websocket_connect("/ws/notes") as ws:
            FakeSession.instances[0].emit("A4", 440.1, -2)
            message = ws.receive_json()
        # Assert
        assert message == {"type": "note", "note": "A4", "hz": 440.1, "cents": -2}

    def test_consecutive_notes_arrive_in_order(self, client):
        # Arrange / Act
        with client.websocket_connect("/ws/notes") as ws:
            session = FakeSession.instances[0]
            session.emit("A4", 440.0, 0)
            session.emit("G4", 392.0, 1)
            # Assert
            assert ws.receive_json()["note"] == "A4"
            assert ws.receive_json()["note"] == "G4"


class TestMicrophoneLifecycle:
    def test_microphone_starts_on_the_first_listener(self, client):
        # Act
        with client.websocket_connect("/ws/notes"):
            # Assert
            assert len(FakeSession.instances) == 1
            assert FakeSession.instances[0].started

    def test_microphone_is_released_when_the_last_listener_leaves(self, client):
        # Act
        with client.websocket_connect("/ws/notes"):
            pass
        # Assert
        assert FakeSession.instances[0].stopped

    def test_a_second_listener_does_not_open_a_second_microphone(self, client):
        # Act
        with client.websocket_connect("/ws/notes"), \
             client.websocket_connect("/ws/notes"):
            # Assert: one session shared, not one per client
            assert len(FakeSession.instances) == 1


class TestNoteHub:
    def test_publishing_before_the_loop_is_bound_is_a_no_op(self):
        # Arrange: a hub that has not seen startup yet
        hub = NoteHub()
        # Act / Assert: must not raise
        hub.publish_threadsafe({"type": "note", "note": "C4"})

    def test_broadcast_reaches_every_client(self):
        # Arrange: two stand-in sockets, no transport involved
        class StubClient:
            def __init__(self):
                self.sent = []

            async def send_json(self, message):
                self.sent.append(message)

        hub = NoteHub()
        first, second = StubClient(), StubClient()
        hub._clients.update({first, second})
        # Act
        asyncio.run(hub.broadcast({"type": "note", "note": "G4"}))
        # Assert: fan-out, not just the first client
        assert first.sent == [{"type": "note", "note": "G4"}]
        assert second.sent == [{"type": "note", "note": "G4"}]

    def test_a_client_that_has_gone_away_is_dropped(self):
        # Arrange
        class DeadClient:
            async def send_json(self, message):
                raise RuntimeError("socket closed")

        hub = NoteHub()
        hub._clients.add(DeadClient())
        # Act
        asyncio.run(hub.broadcast({"type": "note", "note": "C4"}))
        # Assert: broadcast survives it and forgets the client
        assert hub.client_count == 0
