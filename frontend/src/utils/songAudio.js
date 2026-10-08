// Synthesized playback for the song screen, built on the Web Audio API so it
// needs no recordings: a brass-like voice for the melody, and an "oom-pah"
// backing of bass notes and piano chords.
//
// Everything is scheduled up front against the AudioContext clock, which is
// sample-accurate; the song screen reads the same clock to move its
// highlight, so the picture and the sound stay in step.

const LETTER_MIDI = { C: 60, D: 62, E: 64, F: 65, G: 67, A: 69, B: 71 }; // octave 4

// Chord tones as semitones above the root.
const CHORDS = {
  C: [0, 4, 7],
  F: [5, 9, 12],
  G: [7, 11, 14],
  D7: [2, 6, 9, 12],
  C7: [0, 4, 7, 10],
};

function midiToHz(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

// A soft tick for the count-in.
function click(ctx, out, time, accent) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = accent ? 1600 : 1100;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(accent ? 0.35 : 0.22, time + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
  osc.connect(gain).connect(out);
  osc.start(time);
  osc.stop(time + 0.06);
}

// Brass-like melody voice: a sawtooth whose brightness swells on the attack,
// with a little vibrato on longer notes.
function brass(ctx, out, time, midi, duration) {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.value = midiToHz(midi);

  if (duration > 0.35) {
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = 5.5;
    depth.gain.setValueAtTime(0, time);
    depth.gain.linearRampToValueAtTime(osc.frequency.value * 0.004, time + 0.3);
    lfo.connect(depth).connect(osc.frequency);
    lfo.start(time);
    lfo.stop(time + duration + 0.1);
  }

  filter.type = "lowpass";
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(700, time);
  filter.frequency.linearRampToValueAtTime(2600, time + 0.05);
  filter.frequency.linearRampToValueAtTime(1700, time + 0.2);

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(0.36, time + 0.04);
  gain.gain.linearRampToValueAtTime(0.28, time + 0.15);
  gain.gain.setValueAtTime(0.28, time + Math.max(duration - 0.05, 0.16));
  gain.gain.linearRampToValueAtTime(0.0001, time + duration);

  osc.connect(filter).connect(gain).connect(out);
  osc.start(time);
  osc.stop(time + duration + 0.05);
}

// Bowed-string melody voice: two slightly detuned sawtooths (a bowed string
// is close to a sawtooth wave) shaped by a violin-like body resonance, with a
// soft bow attack, a touch of bow noise, and vibrato that eases in.
function violin(ctx, out, time, midi, duration) {
  const hz = midiToHz(midi);
  const gain = ctx.createGain();

  // Body: cut the boom below the strings, lift the bright "singing" region,
  // and roll off the fizz at the top.
  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 190;
  const body = ctx.createBiquadFilter();
  body.type = "peaking";
  body.frequency.value = 2800;
  body.Q.value = 1.1;
  body.gain.value = 7;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 5200;
  highpass.connect(body).connect(lowpass).connect(gain).connect(out);

  const lfo = ctx.createOscillator();
  const depth = ctx.createGain();
  lfo.frequency.value = 5.8;
  depth.gain.setValueAtTime(0, time);
  depth.gain.linearRampToValueAtTime(0, time + 0.15);
  depth.gain.linearRampToValueAtTime(hz * 0.006, time + 0.45);
  lfo.connect(depth);
  lfo.start(time);
  lfo.stop(time + duration + 0.1);

  [0, 4].forEach((cents) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = hz;
    osc.detune.value = cents;
    depth.connect(osc.frequency);
    osc.connect(highpass);
    osc.start(time);
    osc.stop(time + duration + 0.1);
  });

  // Bow noise: a short, quiet burst of filtered noise as the bow bites.
  const noise = ctx.createBufferSource();
  const samples = Math.floor(ctx.sampleRate * 0.08);
  const buffer = ctx.createBuffer(1, samples, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < samples; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / samples);
  }
  noise.buffer = buffer;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 3200;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.05;
  noise.connect(noiseFilter).connect(noiseGain).connect(out);
  noise.start(time);

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(0.18, time + 0.07);
  gain.gain.linearRampToValueAtTime(0.15, time + 0.2);
  gain.gain.setValueAtTime(0.15, time + Math.max(duration - 0.08, 0.2));
  gain.gain.linearRampToValueAtTime(0.0001, time + duration);
}

// Plucked/piano-ish tone that dies away, used for bass and chords.
function pluck(ctx, out, time, midi, duration, level) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = midiToHz(midi);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(level, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(level * 0.2, time + duration * 0.8);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  osc.connect(gain).connect(out);
  osc.start(time);
  osc.stop(time + duration + 0.02);
}

// Bass on beats 1 and 3, chord on beats 2 and 4, following `song.chords`.
// Kept well under the melody (about 10 dB) so the tune stays in front.
function backing(ctx, out, song, startTime, beatSec, transpose) {
  song.chords.forEach((entry, measure) => {
    const halves = Array.isArray(entry) ? entry : [entry, entry];
    halves.forEach((name, half) => {
      const tones = CHORDS[name];
      const t = startTime + (measure * 4 + half * 2) * beatSec;
      // Bass in octave 2, chord voiced in octave 3.
      pluck(ctx, out, t, 36 + (tones[0] % 12) + transpose, beatSec * 0.95, 0.12);
      tones.forEach((tone) => {
        pluck(ctx, out, t + beatSec, 48 + (tone % 12) + transpose, beatSec * 0.8, 0.03);
      });
    });
  });
}

// The melody plays on the instrument the student picked in their closet.
const VOICES = { trumpet: brass, violin };

function melody(ctx, out, song, startTime, beatSec, transpose, instrument) {
  const voice = VOICES[instrument] || brass;
  let beat = 0;
  song.notes.forEach((note, i) => {
    const length = song.beats[i] * beatSec;
    if (note !== "R") {
      // A short gap between notes so repeated notes are heard separately.
      voice(ctx, out, startTime + beat * beatSec, LETTER_MIDI[note] + transpose, length * 0.9);
    }
    beat += song.beats[i];
  });
}

/**
 * Starts playback and returns { ctx, songStart, stop }.
 * `songStart` is the AudioContext time of the first note, after the count-in.
 * `transpose` is in semitones (-2 for a B♭ trumpet, so the audio sounds at the
 * same pitch a real trumpet makes when it plays the written notes).
 * `instrument` ("violin" or "trumpet") picks the melody's sound.
 */
export function playSong(song, { tempo, countIn, transpose, withMelody, instrument }) {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0.8;
  master.connect(ctx.destination);

  const beatSec = 60 / tempo;
  const countStart = ctx.currentTime + 0.15;
  const songStart = countStart + countIn * beatSec;

  for (let i = 0; i < countIn; i += 1) {
    click(ctx, master, countStart + i * beatSec, i === 0);
  }
  backing(ctx, master, song, songStart, beatSec, transpose);
  if (withMelody) {
    melody(ctx, master, song, songStart, beatSec, transpose, instrument);
  }

  return {
    ctx,
    songStart,
    stop() {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.02);
      setTimeout(() => ctx.close(), 150);
    },
  };
}
