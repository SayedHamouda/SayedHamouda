"""Original, license-free lo-fi track for the Intilaqah video.

120 BPM → one bar = 2.0 s, so every scene boundary (all even seconds) lands on a bar start.
Mixes in the SFX from the script: a soft whoosh on every yellow wipe and pops on the counters.
Output: public/audio/music.mp3 (needs numpy + ffmpeg).
"""
import subprocess
import wave
from pathlib import Path

import numpy as np

SR = 44100
DUR = 240.0
BPM = 120
BEAT = 60 / BPM
BAR = BEAT * 4
N = int(SR * DUR)
rng = np.random.default_rng(7)

L = np.zeros(N)
R = np.zeros(N)

# Scene table comes from src/timeline.json so cuts stay in sync with the video.
import json
_tl = json.load(open(Path(__file__).resolve().parent.parent / 'src' / 'timeline.json'))
CUTS = [sc['from'] for sc in _tl['scenes'][1:]]
_at = {sc['id']: sc['from'] for sc in _tl['scenes']}
# counter pops: DS component counters, the stat grid (stagger 4f) and the 2,700 tokens line
POPS = [_at['designSystem'] + 3 * 5 + 6 / 30 + 1.2, _at['designSystem'] + 3 * 5 + 10 / 30 + 1.2]
POPS += [_at['numbers'] + (10 + i * 4) / 30 + 1.2 for i in range(6)]
POPS += [_at['fixes'] + 170 / 30 + 1.2]
# tour chapter changes (seconds within the tour) get a lighter tick
TOUR = [8, 8, 10, 14, 10, 6, 6, 8, 6, 8, 4]
TICKS = []
_acc = _at['tour']
for d in TOUR[:-1]:
    _acc += d
    TICKS.append(_acc)

def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def add(buf, start, sig, gain=1.0):
    i = int(start * SR)
    if i >= N:
        return
    j = min(N, i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def addst(start, sig, gain=1.0, pan=0.0):
    add(L, start, sig, gain * (1 - max(0, pan)))
    add(R, start, sig, gain * (1 + min(0, pan)))


def env(n, a=0.005, d=0.4):
    t = np.arange(n) / SR
    e = np.minimum(1, t / a) * np.exp(-t / d)
    return e


# ── instruments ───────────────────────────────────────────────
def epiano(freq, dur, vel=1.0):
    n = int(SR * dur)
    t = np.arange(n) / SR
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.5 * t)
    s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t / 0.25)
    s += 0.12 * np.sin(2 * np.pi * freq * 3.01 * t) * np.exp(-t / 0.12)
    e = np.minimum(1, t / 0.01) * np.exp(-t / 1.1)
    e[-int(0.05 * SR):] *= np.linspace(1, 0, int(0.05 * SR))
    return s * e * trem * vel


def pad(freq, dur):
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * freq * (1 + d) * t + p) for d, p in [(-0.004, 0), (0, 1.3), (0.004, 2.1)]) / 3
    e = np.minimum(1, t / 0.6) * np.minimum(1, (dur - t) / 0.6)
    return s * np.clip(e, 0, 1)


def bass(freq, dur):
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * freq * 2 * t)
    e = np.minimum(1, t / 0.01) * np.exp(-t / 0.6)
    e[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))
    return s * e


def kick():
    n = int(SR * 0.35)
    t = np.arange(n) / SR
    f = 45 + 85 * np.exp(-t / 0.04)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / 0.12)


def snare():
    n = int(SR * 0.25)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    noise = np.diff(noise, prepend=0) * 0.5 + noise * 0.3
    return (noise * np.exp(-t / 0.07) * 0.6 + np.sin(2 * np.pi * 185 * t) * np.exp(-t / 0.05) * 0.5)


def hat(open_=False):
    n = int(SR * (0.18 if open_ else 0.05))
    t = np.arange(n) / SR
    noise = np.diff(rng.standard_normal(n + 1))
    return noise * np.exp(-t / (0.06 if open_ else 0.015)) * 0.35


def bell(freq, dur=0.8):
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t / 0.1)
    return s * np.minimum(1, t / 0.003) * np.exp(-t / 0.35)


def whoosh(dur=0.5):
    n = int(SR * dur)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    cut = 400 + 5000 * np.sin(np.pi * t / dur) ** 2
    y = np.empty(n)
    acc = 0.0
    for k in range(n):
        a = np.exp(-2 * np.pi * cut[k] / SR)
        acc = (1 - a) * noise[k] + a * acc
        y[k] = acc
    return y * np.sin(np.pi * t / dur) ** 2 * 2.2


def pop():
    n = int(SR * 0.12)
    t = np.arange(n) / SR
    f = 900 * np.exp(-t / 0.03) + 300
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.035)


# ── harmony: Cmaj7 · Am7 · Fmaj7 · G6 (optimistic loop) ────────
CHORDS = [
    ([48, 52, 55, 59, 64], 36),  # Cmaj7
    ([45, 52, 55, 60, 64], 33),  # Am7
    ([41, 52, 57, 60, 64], 29),  # Fmaj7
    ([43, 52, 55, 59, 62], 31),  # G6/add
]
PENTA = [72, 74, 76, 79, 81, 84]


def section(t):
    """Arrangement intensity by time: 0 intro, 1 light, 2 full, 3 outro."""
    if t < 10:
        return 0
    if t < 22:
        return 1
    if t < 234:
        return 2
    return 3


bars = int(DUR / BAR)
for b in range(bars):
    t0 = b * BAR
    sec = section(t0)
    notes, root = CHORDS[b % 4]
    # pads everywhere
    for n in notes[1:4]:
        addst(t0, pad(midi(n), BAR + 0.3), 0.045, pan=0.0)
    if sec == 0:
        # intro: rising shimmer + single EP stabs
        for n in notes:
            addst(t0, epiano(midi(n), 1.9, 0.5), 0.05, pan=-0.2)
        continue
    if sec == 3:
        for n in notes:
            addst(t0, epiano(midi(n), 3.0, 0.6), 0.06, pan=-0.2)
        addst(t0, bass(midi(root), 1.9), 0.18)
        continue
    # EP comping: beat 1 and the "and" of 2
    for st, vel in [(0, 0.9), (BEAT * 1.5, 0.6)]:
        for n in notes:
            addst(t0 + st, epiano(midi(n), 1.2, vel), 0.05, pan=-0.25)
    # bass
    addst(t0, bass(midi(root), BEAT * 1.4), 0.26)
    addst(t0 + BEAT * 2.5, bass(midi(root + 7), BEAT * 0.9), 0.18)
    addst(t0 + BEAT * 3, bass(midi(root), BEAT * 0.9), 0.2)
    # drums
    for k in range(8):
        sw = 0.03 if k % 2 else 0.0  # lazy swing
        addst(t0 + k * BEAT / 2 + sw, hat(open_=(k == 7)), 0.11 if sec == 2 else 0.07, pan=0.3)
    if sec == 2:
        addst(t0, kick(), 0.55)
        addst(t0 + BEAT * 1.75, kick(), 0.35)
        addst(t0 + BEAT * 2, kick(), 0.5)
        addst(t0 + BEAT, snare(), 0.32, pan=-0.05)
        addst(t0 + BEAT * 3, snare(), 0.32, pan=-0.05)
        # sparse bell melody on chord tones every other bar
        if b % 2 == 1:
            for k in range(3):
                n = PENTA[(b * 3 + k * 2) % len(PENTA)]
                addst(t0 + BEAT * (k + 0.5), bell(midi(n)), 0.06, pan=0.35)

# SFX
for c in CUTS:
    addst(c - 0.3, whoosh(0.6), 0.10)
for p in POPS:
    addst(p, pop(), 0.12)
for tk in TICKS:
    addst(tk - 0.2, whoosh(0.35), 0.06)
# opening launch whoosh
addst(0.2, whoosh(1.6), 0.12)

# soft vinyl crackle bed
cr = np.zeros(N)
idx = rng.integers(0, N, size=int(DUR * 25))
cr[idx] = rng.standard_normal(len(idx)) * 0.03
L += cr
R += np.roll(cr, 137)

# master fade in/out + normalise
fade = np.ones(N)
fi, fo = int(1.5 * SR), int(4 * SR)
fade[:fi] = np.linspace(0, 1, fi)
fade[-fo:] = np.linspace(1, 0, fo)
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
L = np.tanh(L / peak * 1.1) * 0.85
R = np.tanh(R / peak * 1.1) * 0.85

out = Path(__file__).resolve().parent.parent / 'public' / 'audio'
out.mkdir(parents=True, exist_ok=True)
wav = out / 'music.wav'
pcm = (np.stack([L, R], axis=1) * 32767).astype(np.int16)
with wave.open(str(wav), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-af', 'lowpass=f=8500,highpass=f=30', '-b:a', '192k', str(out / 'music.mp3')], check=True)
wav.unlink()
print('wrote', out / 'music.mp3')
