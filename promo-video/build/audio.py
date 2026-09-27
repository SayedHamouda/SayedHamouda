# Synthesizes a royalty-free light game-style music bed + SFX synced to the timeline.
import numpy as np, wave
SR = 44100; DUR = 37.0; N = int(SR * DUR)
rng = np.random.default_rng(7)
def t_(d): return np.arange(int(SR * d)) / SR
def env(n, a=.005, r=.1, sus=None):
    e = np.ones(n); A = max(1, int(a * SR)); e[:A] = np.linspace(0, 1, A)
    R = min(n, int(r * SR)); e[-R:] *= np.linspace(1, 0, R) ** 2
    return e
def adsr_exp(n, decay): return np.exp(-np.arange(n) / SR / decay)
def note(f): return 440 * 2 ** ((f - 69) / 12)
def lp(x, a):  # one-pole lowpass
    y = np.empty_like(x); acc = 0.
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y
def add(buf, sig, t0, g=1.):
    i = int(t0 * SR); j = min(len(buf), i + len(sig))
    if i < len(buf): buf[i:j] += sig[:j - i] * g

music = np.zeros(N); sfx = np.zeros(N)
BPM = 116; beat = 60 / BPM; bar = beat * 4
# progression in C major-ish: C  G  Am  F  (I V vi IV)
prog = [(60, [60, 64, 67]), (55, [59, 62, 67]), (57, [57, 60, 64]), (53, [57, 60, 65])]
def pluck(f, d, bright=1.):
    tt = t_(d); x = (np.sign(np.sin(2 * np.pi * f * tt)) * .35 + np.sin(2 * np.pi * f * tt) * .65)
    x += .25 * np.sin(2 * np.pi * 2 * f * tt) * bright
    return x * adsr_exp(len(tt), .16) * env(len(tt), .003, .03)
def pad(freqs, d):
    tt = t_(d); x = sum(np.sin(2 * np.pi * f * tt) + .5 * np.sin(2 * np.pi * f * 1.003 * tt) for f in freqs) / len(freqs)
    return x * env(len(tt), .35, .5)
def kick():
    tt = t_(.25); f = 110 * np.exp(-tt * 28) + 45
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 14)
def hat():
    n = int(.05 * SR); x = rng.standard_normal(n); x = x - lp(x, .5)
    return x * np.exp(-np.arange(n) / SR * 90)
def clap():
    n = int(.18 * SR); x = rng.standard_normal(n); x = lp(x, .35) - lp(x, .06)
    e = np.exp(-np.arange(n) / SR * 22); return x * e
KICK, HAT, CLAP = kick(), hat(), clap()

t = 0.; bi = 0
start_drums = 3.4   # drums enter with the launch
while t < DUR:
    root, ch = prog[bi % 4]
    add(music, pad([note(m) for m in ch], bar + .4), t, .10)
    add(music, np.sin(2 * np.pi * note(root - 24) * t_(bar)) * env(int(bar * SR), .02, .2) * .9, t, .16)  # bass
    arp = ch + [ch[0] + 12, ch[1] + 12, ch[2], ch[1]]
    for k in range(8):  # 8th-note arpeggio
        add(music, pluck(note(arp[k % len(arp)] + 12), beat / 2 + .2), t + k * beat / 2, .07 if t < start_drums else .09)
    if t >= start_drums - .01:
        for k in range(4):
            add(music, KICK, t + k * beat, .5)
            add(music, HAT, t + k * beat + beat / 2, .10)
            if k in (1, 3): add(music, CLAP, t + k * beat, .14)
    t += bar; bi += 1
# gentle filter on music + fades
music = lp(music, .35)
fi = int(.6 * SR); music[:fi] *= np.linspace(0, 1, fi)
fo = int(2.2 * SR); music[-fo:] *= np.linspace(1, 0, fo) ** 1.5

# ---------- SFX ----------
def blip(f, d=.08, g=1.):
    tt = t_(d); return np.sign(np.sin(2 * np.pi * f * tt)) * .5 * adsr_exp(len(tt), d / 3) * g
def coin():
    return np.concatenate([blip(988, .07), blip(1319, .22)])
def chime(notes, step=.07, d=.5):
    out = np.zeros(int(SR * (step * len(notes) + d)))
    for i, m in enumerate(notes):
        tt = t_(d); x = (np.sin(2 * np.pi * note(m) * tt) + .3 * np.sin(2 * np.pi * note(m) * 2 * tt)) * adsr_exp(len(tt), .18)
        s = int(i * step * SR); out[s:s + len(x)] += x
    return out * .6
def whoosh(d=.45, up=True):
    n = int(d * SR); x = rng.standard_normal(n)
    a = np.linspace(.03, .35, n) if up else np.linspace(.35, .03, n)
    y = np.empty(n); acc = 0.
    for i in range(n): acc += a[i] * (x[i] - acc); y[i] = acc
    e = np.sin(np.linspace(0, np.pi, n)) ** 1.5
    return y * e * 1.4
def pop(f=600):
    tt = t_(.12); fr = f * np.exp(-tt * 18) + f * .5
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt * 30)
def click():
    tt = t_(.04); return np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 160) * .8
def impact():
    tt = t_(.9); f = 70 * np.exp(-tt * 6) + 38
    b = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 5)
    n = rng.standard_normal(len(tt)); n = lp(n, .12) * np.exp(-tt * 9)
    return b + n * .6
def sparkle_s():
    out = np.zeros(int(SR * .6))
    for i, m in enumerate([96, 100, 103, 108, 103, 108]):
        tt = t_(.25); x = np.sin(2 * np.pi * note(m) * tt) * adsr_exp(len(tt), .06)
        s = int(i * .05 * SR); out[s:s + len(x)] += x
    return out * .35
def rumble(d=1.1):
    n = int(d * SR); x = lp(rng.standard_normal(n), .05)
    e = np.minimum(1, np.linspace(0, 4, n)) * np.linspace(1, 0, n) ** 1.2
    return x * e * 3
def buzz():
    tt = t_(.28); return np.sign(np.sin(2 * np.pi * 110 * tt)) * .35 * env(len(tt), .005, .08)

E_ = [
  # S1 hook
  (.18, pop(700), .5), (.34, pop(760), .5), (.55, pop(820), .5), (.72, pop(880), .5),
  (1.58, buzz(), .45), (1.95, impact(), .9), (1.98, sparkle_s(), .8),
  (2.3, blip(1319, .06), .18), (2.6, blip(1319, .06), .18), (2.9, blip(1319, .06), .18),
  # S2 launch
  (3.1, whoosh(.5), .8), (3.4, rumble(1.2), .8), (4.5, chime([72, 76, 79, 84]), .7), (4.62, sparkle_s(), .5),
  (6.4, whoosh(.55), .9),
  # S3 map
  (7.0, whoosh(.5, False), .5), (7.1, pop(500), .4), (8.0, sparkle_s(), .5),
  (9.12, coin(), .7), (9.15, sparkle_s(), .4), (10.45, pop(900), .5), (11.0, blip(1047, .05), .15), (11.6, blip(1047, .05), .15),
  (12.0, whoosh(.7), 1.), (12.6, impact(), .35),
  # S4 quiz
  (12.8, whoosh(.45, False), .5), (14.7, click(), .9), (15.45, click(), .9),
  (15.6, chime([76, 79, 84]), .9), (15.8, coin(), .7), (17.2, chime([72, 76, 79, 84, 88, 91], .08, .7), 1.), (17.35, sparkle_s(), .6),
  # S5 streak
  (19.2, whoosh(.45), .7), (19.9, chime([64, 67], .1), .4), (21.0, impact(), .45), (21.05, chime([79, 83, 86, 91], .06), .9),
  # S6 leaderboard
  (23.1, whoosh(.45), .7),
  *[(23.7 + i * .1, pop(500 + i * 80), .35) for i in range(5)],
  *[(25.0 + i * .09, blip(880 + i * 20, .03), .10) for i in range(16)],
  (25.45, whoosh(.35), .5), (26.05, whoosh(.35), .5),
  (26.4, chime([72, 76, 79, 84, 88], .06, .7), 1.), (26.45, sparkle_s(), .6),
  # S7 community
  (28.3, whoosh(.45), .7), (29.05, pop(600), .5), (29.85, blip(740, .05), .2), (30.05, blip(740, .05), .2), (30.25, blip(740, .05), .2),
  (30.6, chime([79, 84], .07), .8),
  # S8 CTA
  (31.65, whoosh(.5), .8), (32.4, impact(), .8), (32.55, chime([72, 79, 84, 88, 91, 96], .07, .9), .9), (32.6, sparkle_s(), .7),
  (33.7, pop(700), .6), (35.4, click(), .9), (35.42, sparkle_s(), .7), (35.45, coin(), .5),
]
for t0, sig, g in E_: add(sfx, sig, t0, g)

def norm(x, peak): return x / (np.max(np.abs(x)) + 1e-9) * peak
mix = norm(music, .33) + norm(sfx, .62)
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
mix = norm(mix, .89)
st = np.stack([mix, np.roll(mix, 80) * .98], 1)  # slight stereo width
with wave.open('build/audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes())
print('ok', len(mix) / SR)
