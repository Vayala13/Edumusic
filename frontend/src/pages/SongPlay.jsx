import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Staff from "../components/Staff";
import { useInstrument } from "../context/useInstrument";
import { playableNotes, songs } from "../data/songs";
import { NOTES_WS_URL, isMatch, playedNote } from "../utils/notes";
import { playSong } from "../utils/songAudio";
import "./SongPlay.css";

const COUNT_IN_BEATS = 4;
const MIN_TEMPO = 40;
const MAX_TEMPO = 160;
const DEFAULT_TEMPO = 80;
// A note played up to this many beats before its turn still counts, since
// players tend to come in a little early.
const EARLY_BEATS = 0.25;

function SongPlay() {
  const { songId } = useParams();
  const song = songs.find((s) => s.id === songId);
  const { instrument } = useInstrument();

  const [tempoInput, setTempoInput] = useState(String(DEFAULT_TEMPO));
  // "listen": the whole song plays, mic off.
  // "play": backing only (your part taken out), mic on and notes scored.
  const [mode, setMode] = useState(null);
  // "ready" | "counting" | "playing" | "done" | "error"
  const [status, setStatus] = useState("ready");
  const [countdown, setCountdown] = useState(null);
  const [current, setCurrent] = useState(null);
  const [hits, setHits] = useState([]);

  const socketRef = useRef(null);
  const playbackRef = useRef(null);
  const frameRef = useRef(null);
  const beatSecRef = useRef(1);
  const hitsRef = useRef([]);

  // When each note starts, in beats from the top of the song.
  const starts = useMemo(() => {
    if (!song) {
      return [];
    }
    let total = 0;
    return song.beats.map((b) => {
      const start = total;
      total += b;
      return start;
    });
  }, [song]);

  const tempo = Number(tempoInput);
  const tempoValid = Number.isInteger(tempo) && tempo >= MIN_TEMPO && tempo <= MAX_TEMPO;

  // Stop the sound, the mic and the clock if the player leaves the page.
  useEffect(() => {
    return () => {
      cancelAnimationFrame(frameRef.current);
      playbackRef.current?.stop();
      playbackRef.current = null;
      const socket = socketRef.current;
      socketRef.current = null;
      if (socket) {
        socket.close();
      }
    };
  }, []);

  if (!song) {
    return <Navigate to="/songs" replace />;
  }

  const instrumentIcon = instrument === "violin" ? "🎻" : "🎺";
  const totalBeats = starts[starts.length - 1] + song.beats[song.beats.length - 1];
  const playable = playableNotes(song).length;
  const hitCount = hits.filter(Boolean).length;
  const running = status === "counting" || status === "playing";

  // Clears the ref first, so the socket's onclose can tell a deliberate close
  // from a dropped connection.
  const closeSocket = () => {
    const socket = socketRef.current;
    socketRef.current = null;
    if (socket) {
      socket.close();
    }
  };

  const finish = (nextStatus) => {
    cancelAnimationFrame(frameRef.current);
    playbackRef.current?.stop();
    playbackRef.current = null;
    closeSocket();
    setCurrent(null);
    setCountdown(null);
    setStatus(nextStatus);
  };

  // Beats since the first note (negative during the count-in), read from the
  // audio clock so the highlight matches what you hear. currentTime is when
  // sound is handed to the speakers; the output latency (large on Bluetooth
  // headphones) is how much later it is actually heard.
  const beatNow = () => {
    const playback = playbackRef.current;
    if (!playback) {
      return -Infinity;
    }
    const { ctx } = playback;
    const heardTime = ctx.currentTime - (ctx.outputLatency || 0) - (ctx.baseLatency || 0);
    return (heardTime - playback.songStart) / beatSecRef.current;
  };

  const onDetectedNote = (detected) => {
    const beat = beatNow();
    const played = playedNote(detected, instrument);

    // The note being played now, or the next one if the player is early.
    const index = song.notes.findIndex(
      (note, i) =>
        note !== "R" &&
        !hitsRef.current[i] &&
        beat >= starts[i] - EARLY_BEATS &&
        beat < starts[i] + song.beats[i] &&
        isMatch(played, note)
    );

    if (index !== -1) {
      hitsRef.current = hitsRef.current.map((hit, i) => hit || i === index);
      setHits(hitsRef.current);
    }
  };

  const tick = () => {
    const beat = beatNow();

    if (beat < 0) {
      setCountdown(Math.min(COUNT_IN_BEATS, Math.ceil(-beat)));
    } else if (beat >= totalBeats) {
      finish("done");
      return;
    } else {
      setCountdown(null);
      setStatus("playing");
      let index = 0;
      while (index + 1 < starts.length && starts[index + 1] <= beat) {
        index += 1;
      }
      setCurrent(index);
    }

    frameRef.current = requestAnimationFrame(tick);
  };

  const listenToMic = () => {
    const socket = new WebSocket(NOTES_WS_URL);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      let message;
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }
      if (message.type === "note") {
        onDetectedNote(message.note);
      }
    };

    socket.onclose = () => {
      // closeSocket() clears the ref before closing, so only a dropped
      // connection gets here with the ref still pointing at this socket.
      if (socketRef.current === socket) {
        socketRef.current = null;
        finish("error");
      }
    };
  };

  const start = (nextMode) => {
    if (!tempoValid) {
      return;
    }

    hitsRef.current = song.notes.map(() => false);
    setHits(hitsRef.current);
    setCurrent(null);
    setMode(nextMode);
    setStatus("counting");
    setCountdown(COUNT_IN_BEATS);

    if (nextMode === "play") {
      listenToMic();
    }

    beatSecRef.current = 60 / tempo;
    playbackRef.current = playSong(song, {
      tempo,
      countIn: COUNT_IN_BEATS,
      // A B♭ trumpet sounds a whole step below the written note, so the
      // audio does too; otherwise the backing would clash with a real trumpet.
      transpose: instrument === "trumpet" ? -2 : 0,
      withMelody: nextMode === "listen",
      instrument,
    });

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(tick);
  };

  let statusText = "";
  if (!tempoValid) {
    statusText = `Pick a tempo from ${MIN_TEMPO} to ${MAX_TEMPO} BPM.`;
  } else if (status === "counting" && countdown !== null) {
    statusText = `Get ready… ${countdown}`;
  } else if (status === "playing") {
    statusText = mode === "play" ? `${hitCount} of ${playable} notes` : "Listen to how it goes";
  } else if (status === "done") {
    statusText =
      mode === "play"
        ? `You played ${hitCount} of ${playable} notes.`
        : "Now try it: press My Turn and play the melody yourself.";
  } else if (status === "error") {
    statusText = "Lost the connection to the pitch detector. Start the server, then try again.";
  }

  return (
    <div className="song-play">
      <header className="song-play-header">
        <Link to="/songs" className="song-play-back">
          ← Songs
        </Link>
        <h1>{song.title}</h1>
      </header>

      <Staff
        notes={song.notes}
        beats={song.beats}
        hits={mode === "play" ? hits : []}
        current={current}
      />

      <div className="song-play-controls">
        <label className="song-play-tempo">
          Tempo
          <input
            type="number"
            min={MIN_TEMPO}
            max={MAX_TEMPO}
            value={tempoInput}
            disabled={running}
            onChange={(e) => setTempoInput(e.target.value)}
            aria-invalid={!tempoValid}
          />
          BPM
        </label>

        {running ? (
          <button className="song-play-button stop" onClick={() => finish("ready")}>
            Stop
          </button>
        ) : (
          <>
            <button
              className="song-play-button secondary"
              onClick={() => start("listen")}
              disabled={!tempoValid}
            >
              ▶ Listen
            </button>
            <button
              className="song-play-button"
              onClick={() => start("play")}
              disabled={!tempoValid}
            >
              {instrumentIcon} My Turn
            </button>
          </>
        )}
      </div>

      <p className="song-play-status" aria-live="polite">
        {statusText}
      </p>

      {!running && (
        <p className="song-play-hint">
          <strong>Listen</strong> plays the whole song. <strong>My Turn</strong>{" "}
          plays the backing with your part taken out, so you play the melody. 🎧 Use headphones so the
          mic only hears you.
        </p>
      )}
    </div>
  );
}

export default SongPlay;
