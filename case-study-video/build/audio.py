# Royalty-free ambient-tech bed + subtle UI SFX, synced to the case-study timeline.
import numpy as np, wave
SR = 44100; DUR = 57.0; N = int(SR * DUR)
rng = np.random.default_rng(11)
t_ = lambda d: np.arange(int(SR * d)) / SR
note = lambda m: 440 * 2 ** ((m - 69) / 12)
def lp(x, a):
    y = np.empty_like(x); acc = 0.
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y
def env(n, a, r):
    e = np.ones(n); A = max(1, int(a * SR)); R = min(n, int(r * SR))
    e[:A] = np.linspace(0, 1, A); e[-R:] *= np.linspace(1, 0, R) ** 2; return e
def add(buf, sig, t0, g=1.):
    i = int(t0 * SR); j = min(len(buf), i + len(sig))
    if i < len(buf): buf[i:j] += sig[:j - i] * g

music = np.zeros(N); sfx = np.zeros(N)
BPM = 96; beat = 60 / BPM; bar = 4 * beat
prog = [(57, [57, 60, 64, 67]), (53, [53, 57, 60, 64]), (48, [55, 60, 64, 67]), (55, [55, 59, 62, 66])]  # Am9 Fmaj7 C G
def pad(fs, d):
    tt = t_(d); x = sum(np.sin(2*np.pi*f*tt) + .4*np.sin(2*np.pi*f*1.004*tt) + .2*np.sin(2*np.pi*2*f*tt) for f in fs) / len(fs)
    return x * env(len(tt), .8, .9)
def bell(f, d=.9):
    tt = t_(d); return (np.sin(2*np.pi*f*tt) + .35*np.sin(2*np.pi*f*2.76*tt)*np.exp(-tt*8)) * np.exp(-tt*3.2) * env(len(tt), .002, .05)
def kick():
    tt = t_(.3); f = 90*np.exp(-tt*30) + 42; return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-tt*11)
def hat():
    n = int(.04*SR); x = rng.standard_normal(n); x = x - lp(x, .6); return x * np.exp(-np.arange(n)/SR*110)
def rim():
    tt = t_(.06); return (np.sin(2*np.pi*1700*tt) + rng.standard_normal(len(tt))*.4) * np.exp(-tt*70)
K, H, RIM = kick(), hat(), rim()
t = 0.; bi = 0
while t < DUR:
    root, ch = prog[bi % 4]
    add(music, pad([note(m) for m in ch], bar + 1.2), t, .12)
    add(music, np.sin(2*np.pi*note(root-12)*t_(bar)) * env(int(bar*SR), .05, .3), t, .20)
    arp = [ch[0]+12, ch[2]+12, ch[1]+12, ch[3]+12, ch[2]+12, ch[1]+24, ch[3], ch[2]+12]
    for k in range(8): add(music, bell(note(arp[k])), t + k*beat/2, .045)
    if t > 4.5 and t < 54:
        for k in range(4):
            add(music, K, t + k*beat, .45 if k % 2 == 0 else .2)
            for s in range(2): add(music, H, t + k*beat + s*beat/2 + beat/4, .06)
            if k in (1, 3): add(music, RIM, t + k*beat, .10)
    t += bar; bi += 1
music = lp(music, .3)
fi = int(1.2*SR); music[:fi] *= np.linspace(0, 1, fi)
fo = int(3.0*SR); music[-fo:] *= np.linspace(1, 0, fo) ** 1.5

# ---- SFX ----
def click():
    tt = t_(.03); return np.sin(2*np.pi*2400*tt) * np.exp(-tt*200)
def snap(f=900):
    tt = t_(.09); return np.sin(2*np.pi*np.cumsum(f*np.exp(-tt*20)+f*.6)/SR) * np.exp(-tt*40)
def whoosh(d=.5):
    n = int(d*SR); x = rng.standard_normal(n); a = np.linspace(.02, .25, n); y = np.empty(n); acc = 0.
    for i in range(n): acc += a[i]*(x[i]-acc); y[i] = acc
    return y * np.sin(np.linspace(0, np.pi, n))**2 * 1.6
def tick(): tt = t_(.02); return np.sin(2*np.pi*3200*tt) * np.exp(-tt*300)
def strike():
    n = int(.22*SR); x = lp(rng.standard_normal(n), .25); return x * np.linspace(1, 0, n) * 1.2
def ding(m): return bell(note(m), 1.2)
def boom():
    tt = t_(1.4); f = 55*np.exp(-tt*3) + 32; return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-tt*2.5)

E = [(0.72, click(), .8), (0.8, whoosh(.8), .45), (1.6, boom(), .55), (1.65, ding(81), .35), (1.9, snap(700), .4), (2.0, snap(800), .35)]
E += [(2.6 + i*.07, snap(900 + i*60), .25) for i in range(5)] + [(3.0, snap(600), .35)]
for T in [5.0, 12.4, 19.6, 27.0, 35.4, 43.4, 49.6, 54.7]: E.append((T - .2, whoosh(.55), .5))
E += [(5.9 + i*.12, snap(700 + i*50), .3) for i in range(4)]
for i in range(4): t0 = 7.9 + i*.55; E += [(t0, strike(), .35), (t0 + .2, ding(76 + [0, 3, 5, 7][i]), .4)]
E += [(13.2 + i*.08, snap(800 + i*40), .22) for i in range(6)] + [(14.1 + i*.08, snap(1000 + i*40), .22) for i in range(5)]
E += [(14.8, snap(500), .35), (15.0, snap(550), .35), (17.45, click(), .8)] + [(16.4 + i*.07, tick(), .3) for i in range(5)]
E += [(20.4, snap(600), .45), (20.7, whoosh(.4), .25)] + [(21.55 + i*.1, tick(), .3) for i in range(6)] + [(21.75 + i*.12, tick(), .3) for i in range(5)]
E += [(23.1, ding(84), .35)] + [(23.7 + i*.12, snap(700 + i*60), .3) for i in range(5)]
E += [(27.7 + i*.08, snap(600 + i*70), .28) for i in range(6)] + [(28.5, snap(400), .45)]
for k in range(3): t0 = 31.9 + k*.9; E += [(t0, click(), .9), (t0 + .08, ding([74, 79, 70][k]), .35)]
E += [(32.0 + i*.12, snap(800), .25) for i in range(3)]
E += [(35.7, whoosh(.7), .4)] + sum([[(36.8 + i*.75, tick(), .35), (37.2 + i*.75, snap(900), .25)] for i in range(5)], [])
E += [(44.1 + i*.08, snap(600 + i*40), .25) for i in range(8)] + [(45.35 + k*.55, click(), .7) for k in range(5)]
E += [(50.5 + i*.06, tick(), .18) for i in range(22)] + [(51.9, ding(88), .4), (54.75, boom(), .6), (54.8, ding(81), .4), (55.0, ding(88), .3)]
for T, sig, g in E: add(sfx, sig, T, g)

norm = lambda x, p: x / (np.max(np.abs(x)) + 1e-9) * p
mix = norm(music, .36) + norm(sfx, .55)
mix = norm(np.tanh(mix*1.1) / np.tanh(1.1), .89)
st = np.stack([mix, np.roll(mix, 90) * .98], 1)
with wave.open('build/audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())
print('ok')
