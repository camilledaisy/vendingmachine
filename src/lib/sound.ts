// Tiny WebAudio sound effects. Muted unless the visitor switches sound on.
let ctx: AudioContext | null = null
let enabled = false
let hum: { o: OscillatorNode; g: GainNode } | null = null

function ac() {
  try {
    ctx ??= new (window.AudioContext || (window as any).webkitAudioContext)()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(f: number, dur: number, type: OscillatorType = 'sine', vol = 0.06, delay = 0, to?: number) {
  const c = enabled && ac()
  if (!c) return
  const t = c.currentTime + delay
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(f, t)
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur)
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(c.destination)
  o.start(t)
  o.stop(t + dur + 0.02)
}

export function setSoundEnabled(on: boolean) {
  enabled = on
  const c = on ? ac() : ctx
  if (on && c && !hum) {
    const o = c.createOscillator()
    const g = c.createGain()
    const f = c.createBiquadFilter()
    o.type = 'sawtooth'
    o.frequency.value = 55
    f.type = 'lowpass'
    f.frequency.value = 140
    g.gain.value = 0.012
    o.connect(f).connect(g).connect(c.destination)
    o.start()
    hum = { o, g }
  } else if (!on && hum) {
    hum.o.stop()
    hum = null
  }
}

// A bubble-wrap pop: a sharp burst of filtered noise, a tiny plastic crackle, and a short body "thock".
function bubblePop() {
  const c = enabled && ac()
  if (!c) return
  const t = c.currentTime
  const len = Math.floor(c.sampleRate * 0.09)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) {
    const x = i / len
    // sharp attack, fast decay, with a few random spikes for the crackle
    d[i] = (Math.random() * 2 - 1) * Math.pow(1 - x, 5) * (Math.random() < 0.06 ? 1.8 : 1)
  }
  const src = c.createBufferSource()
  src.buffer = buf
  src.playbackRate.value = 0.85 + Math.random() * 0.4
  const band = c.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 2200 + Math.random() * 2200
  band.Q.value = 0.9
  const g = c.createGain()
  g.gain.value = 0.9
  src.connect(band).connect(g).connect(c.destination)
  src.start(t)
  tone(260 + Math.random() * 120, 0.05, 'sine', 0.09, 0, 70) // the body of the pop
}

export const sfx = {
  click: () => tone(720, 0.05, 'square', 0.035),
  pop: () => bubblePop(),
  note: (f: number) => tone(f, 0.45, 'sine', 0.07),
  tile: () => tone(260, 0.06, 'triangle', 0.05),
  whirr: () => tone(120, 0.9, 'sawtooth', 0.04, 0, 260),
  drop: () => tone(300, 0.25, 'triangle', 0.06, 0, 90),
  clunk: () => {
    tone(90, 0.18, 'square', 0.07)
    tone(60, 0.25, 'sine', 0.1, 0.03)
  },
  chime: () => [660, 880, 1320].forEach((f, i) => tone(f, 0.5, 'sine', 0.05, i * 0.09)),
}
