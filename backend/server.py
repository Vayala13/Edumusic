"""
EduMusic note server
--------------------
Serves detected notes to the frontend over a WebSocket, so the Practice
page can show what the player actually played instead of faking it.

Run it from the repo root:

    uvicorn backend.server:app --reload --port 8000

The browser connects to ws://localhost:8000/ws/notes and receives one
JSON message per settled note:

    {"type": "note", "note": "A4", "hz": 440.1, "cents": -2}

Why the microphone lives here and not in the browser: the pitch
detection, the trumpet frequency bounds, and the attack-transient
debounce are all Python (see common/pitch_utils.py and
instruments/trumpet/detector.py), and they are covered by tests. Reusing
them means the note the page shows is the note the CLI would print.

The tradeoff is that the server has to run on the same machine as the
player, since it opens *its* microphone. That is fine for local use; if
this is ever deployed, the browser would capture audio and stream frames
here instead, and only `MicSession` below would need replacing.
"""

import asyncio
import queue
import threading

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

from instruments.trumpet.detector import (
    FRAME_LENGTH,
    HOP_SIZE,
    SAMPLE_RATE,
    NoteDetector,
)


class NoteHub:
    """Fans notes out to every connected client.

    Notes arrive on the audio thread and have to reach clients on the
    asyncio loop, so `publish_threadsafe` hands them across rather than
    touching the socket directly.
    """

    def __init__(self):
        self._clients = set()
        self._loop = None

    def bind_loop(self, loop):
        self._loop = loop

    @property
    def client_count(self):
        return len(self._clients)

    async def add(self, websocket):
        await websocket.accept()
        self._clients.add(websocket)
        return len(self._clients)

    def remove(self, websocket):
        self._clients.discard(websocket)
        return len(self._clients)

    async def broadcast(self, message):
        """Send to every client, dropping any that have gone away."""
        for client in list(self._clients):
            try:
                await client.send_json(message)
            except (WebSocketDisconnect, RuntimeError):
                self._clients.discard(client)

    def publish_threadsafe(self, message):
        """Called from the audio thread; schedules the send on the loop."""
        if self._loop is None:
            return
        asyncio.run_coroutine_threadsafe(self.broadcast(message), self._loop)


class MicSession:
    """Owns the microphone stream and the detector that reads it.

    Started when the first client connects and stopped when the last one
    leaves, so the mic is not held open while nobody is listening.
    """

    def __init__(self, hub, samplerate=SAMPLE_RATE, blocksize=HOP_SIZE):
        self._hub = hub
        self._samplerate = samplerate
        self._blocksize = blocksize
        self._audio_q = queue.Queue()
        self._stop = threading.Event()
        self._thread = None
        self._stream = None

    def _report(self, note_name, pitch_hz, cents_off):
        self._hub.publish_threadsafe({
            "type": "note",
            "note": note_name,
            "hz": round(float(pitch_hz), 1),
            "cents": int(round(cents_off)),
        })

    def _consume(self):
        detector = NoteDetector(samplerate=self._samplerate,
                                frame_length=FRAME_LENGTH,
                                on_note=self._report)
        while not self._stop.is_set():
            try:
                chunk = self._audio_q.get(timeout=0.1)
            except queue.Empty:
                continue
            detector.process(chunk)

    def start(self):
        # Imported here, not at module scope, so the server can be imported
        # (and tested) on a machine with no audio device or PortAudio.
        import sounddevice as sd

        self._stop.clear()
        self._thread = threading.Thread(target=self._consume, daemon=True)
        self._thread.start()

        def audio_callback(indata, frames, time_info, status):
            self._audio_q.put(indata[:, 0].copy())

        self._stream = sd.InputStream(channels=1,
                                      samplerate=self._samplerate,
                                      blocksize=self._blocksize,
                                      callback=audio_callback)
        self._stream.start()

    def stop(self):
        self._stop.set()
        if self._stream is not None:
            self._stream.stop()
            self._stream.close()
            self._stream = None
        if self._thread is not None:
            self._thread.join(timeout=1.0)
            self._thread = None


def create_app(session_factory=MicSession):
    """Build the app.

    `session_factory` is injectable so tests can drive the socket without
    a microphone -- CI has no audio device.
    """
    app = FastAPI(title="EduMusic note server")
    hub = NoteHub()
    state = {"session": None}

    app.state.hub = hub
    app.state.session_state = state

    @app.get("/health")
    async def health():
        return {"status": "ok", "listeners": hub.client_count}

    @app.websocket("/ws/notes")
    async def notes(websocket: WebSocket):
        # Bound here rather than on startup: the audio thread needs the
        # loop that is actually serving sockets, and a test client may
        # never run startup events.
        hub.bind_loop(asyncio.get_running_loop())
        count = await hub.add(websocket)
        if count == 1:
            state["session"] = session_factory(hub)
            state["session"].start()
        try:
            # The client sends nothing; this waits for the disconnect.
            while True:
                await websocket.receive_text()
        except WebSocketDisconnect:
            pass
        finally:
            remaining = hub.remove(websocket)
            if remaining == 0 and state["session"] is not None:
                state["session"].stop()
                state["session"] = None

    return app


app = create_app()
