# Playful acoustic-style bed (Karplus-Strong plucks, claps, glock) + paper/tape/stamp SFX. Royalty-free, generated.
import numpy as np, wave
SR = 44100; DUR = 64.0; N = int(SR * DUR)
rng = np.random.default_rng(5)
t_ = lambda d: np.arange(int(SR * d)) / SR
note = lambda m: 440 * 2 ** ((m - 69) / 12)
def lp(x, a):
    y = np.empty_like(x); acc = 0.
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y
def add(buf, sig, t0, g=1.):
    i = int(t0 * SR); j = min(len(buf), i + len(sig))
    if i < len(buf) and i >= 0: buf[i:j] += sig[:j - i] * g
def pluck(f, d=.7, damp=.996):
    n = int(SR * d); P = max(2, int(SR / f)); buf = rng.uniform(-1, 1, P); out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % P]; buf[i % P] = damp * .5 * (buf[i % P] + buf[(i + 1) % P])
    return out
def glock(f, d=.8): tt = t_(d); return (np.sin(2*np.pi*f*tt) + .3*np.sin(2*np.pi*f*4.07*tt)*np.exp(-tt*12)) * np.exp(-tt*4)
def clap():
    n = int(.16 * SR); x = rng.standard_normal(n); x = x - lp(x, .08)
    e = np.exp(-np.arange(n) / SR * 26); e[:int(.012*SR)] *= 1.6; return x * e
def kick(): tt = t_(.22); f = 100*np.exp(-tt*35) + 48; return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-tt*16)
def shaker(): n = int(.06*SR); x = rng.standard_normal(n); x = x - lp(x, .5); return x * np.sin(np.linspace(0, np.pi, n))
music = np.zeros(N); sfx = np.zeros(N)
BPM = 112; b = 60 / BPM; bar = 4 * b
prog = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]]   # C Am F G
CL, KK, SH = clap(), kick(), shaker()
pat = [0, 2, 1, 2, 0, 2, 1, 2]
t = 0.; bi = 0
while t < DUR:
    ch = prog[bi % 4]
    add(music, pluck(note(ch[0] - 12), 1.4), t, .5)
    add(music, pluck(note(ch[0] - 12), 1.0), t + 2 * b, .4)
    for k in range(8):
        m = ch[pat[k]] + (12 if k in (3, 7) else 0)
        add(music, pluck(note(m), .55), t + k * b / 2 + (0.012 if k % 2 else 0), .32)
    if bi % 2 == 1:
        for k, m in enumerate([ch[2] + 12, ch[1] + 24, ch[2] + 24]): add(music, glock(note(m)), t + (2.5 + k * .5) * b, .14)
    if t > 1.0 and t < 61:
        for k in range(4):
            add(music, KK, t + k * b, .45 if k in (0, 2) else .0)
            if k in (1, 3): add(music, CL, t + k * b, .32)
            add(music, SH, t + k * b + b / 2, .08); add(music, SH, t + k * b + b * .75, .05)
    t += bar; bi += 1
music = lp(music, .55)
fi = int(.5 * SR); music[:fi] *= np.linspace(0, 1, fi)
fo = int(3 * SR); music[-fo:] *= np.linspace(1, 0, fo) ** 1.4

def paper(d=.32):  # paper slide
    n = int(d*SR); x = rng.standard_normal(n); x = lp(x, .35) - lp(x, .04)
    return x * np.sin(np.linspace(0, np.pi, n)) ** 1.5 * 1.4
def tape():  # tape rip: crackly noise burst
    n = int(.22*SR); x = rng.standard_normal(n) * (rng.random(n) < .35); x = x - lp(x, .2)
    return x * np.exp(-np.linspace(0, 4, n)) * 1.6
def stamp():
    tt = t_(.18); b_ = np.sin(2*np.pi*np.cumsum(140*np.exp(-tt*30)+60)/SR) * np.exp(-tt*22)
    n = rng.standard_normal(len(tt)) * np.exp(-tt*60) * .6; return b_ + n
def pop(f=520): tt = t_(.1); return np.sin(2*np.pi*np.cumsum(f*np.exp(-tt*25)+f*.5)/SR) * np.exp(-tt*35)
def swoosh(d=.45):
    n = int(d*SR); x = rng.standard_normal(n); a = np.linspace(.03, .3, n); y = np.empty(n); acc = 0.
    for i in range(n): acc += a[i]*(x[i]-acc); y[i] = acc
    return y * np.sin(np.linspace(0, np.pi, n)) ** 2 * 1.8
def ding(m): return glock(note(m), 1.2)
E = []
for T in [5.0, 11.0, 18.0, 25.0, 31.6, 40.0, 47.2, 54.2, 60.0]: E.append((T, swoosh(), .55))
E += [(.05, pop(300), .4), (.35, paper(), .7), (.95, tape(), .55), (.9, swoosh(.6), .4), (1.5, stamp(), .5), (2.3, pop(900), .35), (2.5, paper(.25), .5)]
E += [(5.6, stamp(), .4), (5.9, pop(400), .4), (6.2, paper(), .6), (7.0, swoosh(.35), .4), (7.4, paper(.2), .3)]
E += [(11.6, stamp(), .4), (11.8, paper(), .6), (12.3, pop(500), .5), (12.7, paper(.25), .5), (12.8, paper(.25), .5), (13.2, paper(), .5),
      (14.6, stamp(), .7), (15.0, stamp(), .7), (15.4, stamp(), .8)]
E += [(18.6, stamp(), .4), (18.9, paper(), .7)] + [(19.4 + i * .12, pop(700 + i * 40), .2) for i in range(6)] + [(20.3, pop(450), .5), (23.4, paper(.3), .5)]
E += [(25.6, stamp(), .4), (25.9, pop(500), .5)] + [(26.3 + i * .4, paper(.3), .55) for i in range(4)] + [(26.75, tape(), .5), (27.95, tape(), .5)]
E += [(32.2, stamp(), .4), (32.5, pop(600), .5)] + sum([[(33.0 + i * 1.5, paper(.3), .6), (33.45 + i * 1.5, tape(), .55)] for i in range(4)], [])
E += [(40.6, pop(300), .4), (40.9, paper(), .6), (41.5, stamp(), .4), (42.2, paper(.25), .5), (42.9, swoosh(.3), .4), (43.1, swoosh(.3), .4)] + [(T, stamp(), .6) for T in [43.8, 44.2, 44.8, 45.2]]
E += [(47.8, stamp(), .4), (48.4, pop(500), .5), (49.4, pop(900), .4), (49.8, ding(84), .4)] + [(50.4 + i * .35, stamp(), .55) for i in range(6)] + [(52.6, pop(600), .5)]
E += [(54.8, stamp(), .4), (55.3, paper(), .6), (55.55, paper(), .6), (55.8, paper(), .6), (56.25, tape(), .55), (56.5, swoosh(.4), .5), (57.2, paper(.25), .5)]
E += [(60.5, paper(), .6), (61.0, pop(500), .5), (61.0, ding(79), .45), (61.3, stamp(), .5), (61.9, paper(.25), .5), (62.0, ding(84), .35), (62.2, ding(88), .3)]
for T, s, g in E: add(sfx, s, T, g)
norm = lambda x, p: x / (np.max(np.abs(x)) + 1e-9) * p
mix = norm(music, .4) + norm(sfx, .5)
mix = norm(np.tanh(mix * 1.15) / np.tanh(1.15), .89)
st = np.stack([mix, np.roll(mix, 70) * .98], 1)
with wave.open('build/audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())
print('ok')
