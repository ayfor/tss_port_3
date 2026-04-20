/**
 * Optimized bokeh background
 *
 * Key optimizations:
 * 1. Render at 1/2 resolution on offscreen canvas, scale up (4× fewer pixels)
 * 2. No ctx.filter blur — soft radial gradients replace expensive CSS blur
 * 3. 28 blobs (larger/softer) instead of 55 small ones
 * 4. ~20fps frame cap (50ms interval)
 * 5. Pauses when tab hidden (visibilitychange)
 * 6. Debounced resize handler
 */
import { createNoise3D } from 'simplex-noise';

const display = document.getElementById('bg-canvas') as HTMLCanvasElement | null;
if (!display) {
  throw new Error('[bokeh] #bg-canvas not found');
}
const displayCtx = display.getContext('2d')!;

const SCALE = 0.5;
const offscreen = document.createElement('canvas');
const ctx = offscreen.getContext('2d')!;

const noise3D = createNoise3D();
const FRAME_INTERVAL = 50;

let resizeTimer: number;
function resize() {
  display.width  = window.innerWidth;
  display.height = window.innerHeight;
  offscreen.width  = Math.ceil(window.innerWidth * SCALE);
  offscreen.height = Math.ceil(window.innerHeight * SCALE);
}
resize();
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(resize, 150);
});

const PALETTE: [number, number, number][] = [
  [124,  58, 237],  // purple
  [  8, 145, 178],  // cyan
  [219,  49,  91],  // pink
  [  5, 150, 105],  // green
  [234,  88,  12],  // orange
];

const VORTEX = [
  { nzx:  0.0, nzy: 20.0, sp: 0.010 },
  { nzx:  7.3, nzy: 27.3, sp: 0.008 },
  { nzx: 14.6, nzy: 34.6, sp: 0.012 },
  { nzx: 21.9, nzy: 41.9, sp: 0.007 },
];

const blobs = Array.from({ length: 28 }, (_, i) => {
  const s = (seed: number) => (Math.sin(seed) * 0.5 + 0.5);
  return {
    ci:       i % 5,
    vi:       i % VORTEX.length,
    orbitR:   0.12 + s(i * 127.1) * 0.42,
    orbitSpd: (0.04 + s(i * 311.7) * 0.10) * (i % 2 ? 1 : -1),
    phase:    s(i * 74.3) * Math.PI * 2,
    blobR:    0.18 + s(i * 198.5) * 0.24,
    op:       0.50 + s(i * 453.9) * 0.30,
    driftSpd: 0.005 + s(i * 89.2) * 0.008,
    driftNzx: i * 3.7,
    driftNzy: i * 3.7 + 100,
  };
});

const t0 = performance.now();
let lastFrame = 0;
let paused = false;

document.addEventListener('visibilitychange', () => {
  paused = document.hidden;
  if (!paused) {
    lastFrame = 0;
    requestAnimationFrame(tick);
  }
});

function tick(now: number) {
  if (paused) return;
  requestAnimationFrame(tick);

  if (now - lastFrame < FRAME_INTERVAL) return;
  lastFrame = now;

  const t  = (now - t0) / 1000;
  const W  = offscreen.width;
  const H  = offscreen.height;
  const md = Math.min(W, H);

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#1c1a2e';
  ctx.fillRect(0, 0, W, H);

  const vc = VORTEX.map(v => ({
    x: W * (0.5 + noise3D(t * v.sp, v.nzx, 0) * 0.48),
    y: H * (0.5 + noise3D(t * v.sp, v.nzy, 0) * 0.48),
  }));

  for (const b of blobs) {
    const [r, g, bl] = PALETTE[b.ci];
    const { x: vx, y: vy } = vc[b.vi];

    const angle = t * b.orbitSpd + b.phase;
    const rx    = b.orbitR * md;
    const ry    = b.orbitR * md * 0.62;

    const dx = noise3D(t * b.driftSpd, b.driftNzx, 0) * md * 0.18;
    const dy = noise3D(t * b.driftSpd, b.driftNzy, 0) * md * 0.18;

    const x = vx + Math.cos(angle) * rx + dx;
    const y = vy + Math.sin(angle) * ry + dy;

    const radius = b.blobR * md;

    const grd = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grd.addColorStop(0,    `rgba(${r},${g},${bl},${b.op})`);
    grd.addColorStop(0.3,  `rgba(${r},${g},${bl},${b.op * 0.6})`);
    grd.addColorStop(0.6,  `rgba(${r},${g},${bl},${b.op * 0.25})`);
    grd.addColorStop(1,    `rgba(${r},${g},${bl},0)`);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  displayCtx.imageSmoothingEnabled = true;
  displayCtx.imageSmoothingQuality = 'medium';
  displayCtx.drawImage(offscreen, 0, 0, display.width, display.height);
}

requestAnimationFrame(tick);
