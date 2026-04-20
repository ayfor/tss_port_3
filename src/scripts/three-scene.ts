import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const noise3D = createNoise3D();
const container = document.getElementById('three-canvas');
const containerMobile = document.getElementById('three-canvas-mobile');

if (!container) {
  throw new Error('[three-scene] #three-canvas not found');
}

// ── Renderer (primary — xl left column, interactive) ──────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;';
container.appendChild(renderer.domElement);

// ── Renderer (mobile/tablet badge — decorative, non-interactive) ──────
let rendererMobile: THREE.WebGLRenderer | null = null;
if (containerMobile) {
  rendererMobile = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  rendererMobile.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  rendererMobile.setClearColor(0x000000, 0);
  rendererMobile.domElement.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none;';
  containerMobile.appendChild(rendererMobile.domElement);
}

// ── Scene & Camera ────────────────────────────────────────────────────
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 50);
camera.position.z = 5.0;

// ── Palette (matches lava blobs) ──────────────────────────────────────
const PALETTE = [
  new THREE.Color(0x7c3aed), // purple
  new THREE.Color(0x0891b2), // cyan
  new THREE.Color(0xdb315b), // pink
  new THREE.Color(0x059669), // green
  new THREE.Color(0xea580c), // orange
];

// ── Geometry ──────────────────────────────────────────────────────────
const geo = new THREE.IcosahedronGeometry(1, 4);
const posAttr = geo.attributes.position;
const N = posAttr.count;

// Snapshot original unit-sphere positions
const basePos = new Float32Array(N * 3);
for (let i = 0; i < N; i++) {
  basePos[i * 3]     = posAttr.getX(i);
  basePos[i * 3 + 1] = posAttr.getY(i);
  basePos[i * 3 + 2] = posAttr.getZ(i);
}

// ── Pine tree target shape ─────────────────────────────────────────────
// Maps each unit-sphere vertex to a point on a pine tree surface using
// its azimuthal angle (theta) and latitude (oy) as the guide.
function pineTreePos(ox: number, oy: number, oz: number): [number, number, number] {
  const theta = Math.atan2(oz, ox);
  let tr: number;

  if (oy > 0.80) {
    // Pointed tip — converges to zero at the top pole
    tr = (1.0 - oy) * 0.12;
  } else if (oy > -0.28) {
    // Crown: three tiered cones
    const h = (oy + 0.28) / 1.08;
    const cone = (1 - h) * 0.58;
    const withinTier = (h * 3.0) % 1.0;
    const skirt = Math.pow(1 - withinTier, 2) * 0.14;
    tr = cone + skirt;
  } else if (oy > -0.65) {
    tr = 0.05;
  } else {
    tr = Math.max(0, 0.05 * (1.0 + oy) / 0.35);
  }

  return [Math.cos(theta) * tr, oy, Math.sin(theta) * tr];
}

// Precompute tree targets so we avoid trig in the hot loop
const treeTarget = new Float32Array(N * 3);
for (let i = 0; i < N; i++) {
  const [tx, ty, tz] = pineTreePos(basePos[i * 3], basePos[i * 3 + 1], basePos[i * 3 + 2]);
  treeTarget[i * 3]     = tx;
  treeTarget[i * 3 + 1] = ty;
  treeTarget[i * 3 + 2] = tz;
}

// ── Mirror tree target shape ───────────────────────────────────────────
function mirrorTreePos(ox: number, oy: number, oz: number): [number, number, number] {
  const [tx, ty, tz] = pineTreePos(ox, -oy, oz);
  return [tx, -ty, tz];
}

const mirrorTarget = new Float32Array(N * 3);
for (let i = 0; i < N; i++) {
  const [tx, ty, tz] = mirrorTreePos(basePos[i * 3], basePos[i * 3 + 1], basePos[i * 3 + 2]);
  mirrorTarget[i * 3]     = tx;
  mirrorTarget[i * 3 + 1] = ty;
  mirrorTarget[i * 3 + 2] = tz;
}

// ── Morph timing ──────────────────────────────────────────────────────
const T_CYCLE = 50;
function smoothstep(x: number): number { return x * x * (3 - 2 * x); }

function getMorphT(t: number): number {
  const p = t % T_CYCLE;
  if (p < 14) return 0;
  if (p < 17) return smoothstep((p - 14) / 3);
  if (p < 33) return 1;
  if (p < 36) return 1 - smoothstep((p - 33) / 3);
  return 0;
}

function getMirrorMorphT(t: number): number {
  const p = t % T_CYCLE;
  if (p < 20) return 0;
  if (p < 23) return smoothstep((p - 20) / 3);
  if (p < 33) return 1;
  if (p < 36) return 1 - smoothstep((p - 33) / 3);
  return 0;
}

// ── Vertex colour attribute ────────────────────────────────────────────
const colAttr = new THREE.BufferAttribute(new Float32Array(N * 3), 3);
geo.setAttribute('color', colAttr);

// ── Solid mesh ────────────────────────────────────────────────────────
const solidMat = new THREE.MeshPhongMaterial({
  vertexColors: true,
  shininess: 110,
  specular: new THREE.Color(0xffffff).multiplyScalar(0.35),
  transparent: true,
  opacity: 0.90,
});
const solid = new THREE.Mesh(geo, solidMat);
solid.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
  wireframe: true, color: 0xffffff, transparent: true, opacity: 0.05,
})));

// ── Mirror geometry (upside-down twin tree) ───────────────────────────
const geoMirror = new THREE.IcosahedronGeometry(1, 4);
const mirrorPosAttr = geoMirror.attributes.position;
const mirrorColAttr = new THREE.BufferAttribute(new Float32Array(N * 3), 3);
geoMirror.setAttribute('color', mirrorColAttr);

for (let i = 0; i < N; i++) {
  mirrorPosAttr.setXYZ(i, 0, basePos[i * 3 + 1], 0);
}
mirrorPosAttr.needsUpdate = true;

const solidMirror = new THREE.Mesh(geoMirror, solidMat);
solidMirror.visible = false;
solidMirror.add(new THREE.Mesh(geoMirror, new THREE.MeshBasicMaterial({
  wireframe: true, color: 0xffffff, transparent: true, opacity: 0.05,
})));

// ── Lighting ──────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xffffff, 0.35));
const orbitLights = [
  new THREE.PointLight(0x7c3aed, 4, 10),
  new THREE.PointLight(0x0891b2, 4, 10),
  new THREE.PointLight(0xea580c, 3, 10),
];
orbitLights.forEach(l => scene.add(l));

// ── Scene group (both trees rotate together) ──────────────────────────
const group = new THREE.Group();
scene.add(group);
group.add(solid);
group.add(solidMirror);

// ── Drag-to-rotate controls ────────────────────────────────────────────
let isDragging = false;
let prevMouse = { x: 0, y: 0 };
let autoRotate = true;
let dragTimeout: number | undefined;

renderer.domElement.style.cursor = 'grab';

renderer.domElement.addEventListener('mousedown', e => {
  isDragging = true;
  autoRotate = false;
  if (dragTimeout) clearTimeout(dragTimeout);
  prevMouse = { x: e.clientX, y: e.clientY };
  renderer.domElement.style.cursor = 'grabbing';
});
window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const dx = e.clientX - prevMouse.x;
  const dy = e.clientY - prevMouse.y;
  group.rotation.y += dx * 0.008;
  group.rotation.x += dy * 0.008;
  group.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, group.rotation.x));
  prevMouse = { x: e.clientX, y: e.clientY };
});
window.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  renderer.domElement.style.cursor = 'grab';
  dragTimeout = window.setTimeout(() => { autoRotate = true; }, 2000);
});

renderer.domElement.addEventListener('touchstart', e => {
  e.preventDefault();
  isDragging = true;
  autoRotate = false;
  if (dragTimeout) clearTimeout(dragTimeout);
  prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: false });
window.addEventListener('touchmove', e => {
  if (!isDragging) return;
  const dx = e.touches[0].clientX - prevMouse.x;
  const dy = e.touches[0].clientY - prevMouse.y;
  group.rotation.y += dx * 0.008;
  group.rotation.x += dy * 0.008;
  group.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, group.rotation.x));
  prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: false });
window.addEventListener('touchend', () => {
  isDragging = false;
  dragTimeout = window.setTimeout(() => { autoRotate = true; }, 2000);
});

// ── Helpers ───────────────────────────────────────────────────────────
const tempCol = new THREE.Color();
function lerpColor(a: THREE.Color, b: THREE.Color, f: number) {
  tempCol.r = a.r + (b.r - a.r) * f;
  tempCol.g = a.g + (b.g - a.g) * f;
  tempCol.b = a.b + (b.b - a.b) * f;
}

function sizeRenderer() {
  const w = container!.clientWidth;
  const h = container!.clientHeight;
  if (w && h) renderer.setSize(w, h);
  if (rendererMobile && containerMobile) {
    const wm = containerMobile.clientWidth;
    const hm = containerMobile.clientHeight;
    if (wm && hm) rendererMobile.setSize(wm, hm);
  }
}

// ── Animation loop ────────────────────────────────────────────────────
const clock = new THREE.Clock();

(function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const morphT = getMorphT(t);

  const amp = (0.30 + Math.sin(t * 0.16) * 0.20) * (1 - morphT);

  for (let i = 0; i < N; i++) {
    const ox = basePos[i * 3], oy = basePos[i * 3 + 1], oz = basePos[i * 3 + 2];

    const n1 = noise3D(ox * 1.6 + t * 0.22, oy * 1.6 - t * 0.10, oz * 1.6);
    const n2 = noise3D(ox * 3.2 - t * 0.18, oy * 3.2, oz * 3.2 + t * 0.14);
    const n3 = noise3D(ox * 6.4, oy * 6.4 + t * 0.12, oz * 6.4 - t * 0.09);
    const s  = 1 + n1 * amp + n2 * (amp * 0.5) + n3 * (amp * 0.25);
    const bx = ox * s, by = oy * s, bz = oz * s;

    const treeFuzz = noise3D(ox * 5 + t * 0.04, oy * 5, oz * 5) * 0.025 * morphT;
    const tx = treeTarget[i * 3]     * (1 + treeFuzz);
    const ty = treeTarget[i * 3 + 1] * (1 + treeFuzz * 0.1);
    const tz = treeTarget[i * 3 + 2] * (1 + treeFuzz);

    posAttr.setXYZ(i,
      bx + (tx - bx) * morphT,
      by + (ty - by) * morphT,
      bz + (tz - bz) * morphT,
    );

    const cn  = (noise3D(ox * 0.7 + t * 0.10, oy * 0.7, oz * 0.7 - t * 0.07) + 1) * 0.5;
    const ci  = cn * (PALETTE.length - 1);
    const ci0 = Math.floor(ci);
    const ci1 = Math.min(ci0 + 1, PALETTE.length - 1);
    lerpColor(PALETTE[ci0], PALETTE[ci1], ci - ci0);
    colAttr.setXYZ(i, tempCol.r, tempCol.g, tempCol.b);
  }

  posAttr.needsUpdate = true;
  colAttr.needsUpdate = true;
  geo.computeVertexNormals();

  const mirrorMorphT = getMirrorMorphT(t);
  solidMirror.visible = mirrorMorphT > 0.001;

  if (solidMirror.visible) {
    for (let i = 0; i < N; i++) {
      const ox = basePos[i * 3], oy = basePos[i * 3 + 1], oz = basePos[i * 3 + 2];

      const mFuzz = noise3D(ox * 5 - t * 0.04, oy * 5 + 2.3, oz * 5) * 0.025 * mirrorMorphT;
      mirrorPosAttr.setXYZ(i,
        mirrorTarget[i * 3]     * mirrorMorphT * (1 + mFuzz),
        mirrorTarget[i * 3 + 1],
        mirrorTarget[i * 3 + 2] * mirrorMorphT * (1 + mFuzz),
      );

      const cn = (noise3D(ox * 0.7 + t * 0.10 + 1.7, oy * 0.7, oz * 0.7 - t * 0.07) + 1) * 0.5;
      const ci = cn * (PALETTE.length - 1);
      const ci0 = Math.floor(ci);
      const ci1 = Math.min(ci0 + 1, PALETTE.length - 1);
      lerpColor(PALETTE[ci0], PALETTE[ci1], ci - ci0);
      mirrorColAttr.setXYZ(i, tempCol.r, tempCol.g, tempCol.b);
    }
    mirrorPosAttr.needsUpdate = true;
    mirrorColAttr.needsUpdate = true;
    geoMirror.computeVertexNormals();
  }

  solid.position.y       =  0.65 * morphT;
  solidMirror.position.y = -0.65 * mirrorMorphT;

  orbitLights.forEach((light, idx) => {
    const speed = (0.28 + idx * 0.12) * (1 - morphT * 0.7);
    const phase = (idx * Math.PI * 2) / orbitLights.length;
    const a = t * speed + phase;
    light.position.set(
      Math.cos(a) * 2.2,
      Math.sin(a * 0.8 + idx) * 1.8,
      Math.sin(a) * 2.2 + 0.5,
    );
  });

  if (autoRotate) {
    group.rotation.y += 0.004;
    group.rotation.x += (0 - group.rotation.x) * 0.02;
  }

  if (container.clientWidth && container.clientHeight) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }

  if (rendererMobile && containerMobile && containerMobile.clientWidth && containerMobile.clientHeight) {
    camera.aspect = containerMobile.clientWidth / containerMobile.clientHeight;
    camera.updateProjectionMatrix();
    rendererMobile.render(scene, camera);
  }
}());

requestAnimationFrame(sizeRenderer);
const ro = new ResizeObserver(sizeRenderer);
ro.observe(container);
if (containerMobile) ro.observe(containerMobile);
