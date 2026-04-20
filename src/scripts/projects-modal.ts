const MODAL_BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');

const STACK: Record<string, { l: string; c: string }> = {
  ts:       { l: 'TypeScript',  c: '#3e92cc' },
  go:       { l: 'Go',          c: '#0891b2' },
  rails:    { l: 'Rails',       c: '#db315b' },
  react:    { l: 'React',       c: '#0891b2' },
  next:     { l: 'Next.js',     c: '#fffaff' },
  three:    { l: 'Three.js',    c: '#7c3aed' },
  astro:    { l: 'Astro',       c: '#ea580c' },
  sup:      { l: 'Supabase',    c: '#059669' },
  pg:       { l: 'PostgreSQL',  c: '#3e92cc' },
  redis:    { l: 'Redis',       c: '#db315b' },
  tail:     { l: 'Tailwind',    c: '#0891b2' },
  ai:       { l: 'OpenAI',      c: '#059669' },
  ng:       { l: 'Angular',     c: '#db315b' },
  cpp:      { l: 'C++',         c: '#7c3aed' },
  jenkins:  { l: 'Jenkins',     c: '#ea580c' },
  docker:   { l: 'Docker',      c: '#0891b2' },
  vercel:   { l: 'Vercel',      c: '#fffaff' },
  js:       { l: 'JavaScript',  c: '#eab308' },
  cs:       { l: 'C#',          c: '#a855f7' },
  swx:      { l: 'Solidworks API', c: '#dc2626' },
  faktory:  { l: 'Faktory',     c: '#ef4444' },
  electron: { l: 'Electron',    c: '#47848f' },
};

type StatusKey = 'todo' | 'design' | 'dev' | 'done';
const STATUS: Record<StatusKey, { l: string; sc: string; sb: string; sbg: string; dot: string; live?: boolean }> = {
  todo:   { l: 'To Do',       sc: '#fca5a5', sb: 'rgba(219,49,91,.4)',  sbg: 'rgba(219,49,91,.08)',  dot: '#db315b' },
  design: { l: 'Design',      sc: '#fdba74', sb: 'rgba(234,88,12,.4)',  sbg: 'rgba(234,88,12,.08)',  dot: '#ea580c' },
  dev:    { l: 'Development', sc: '#93c5fd', sb: 'rgba(62,146,204,.45)', sbg: 'rgba(62,146,204,.08)', dot: '#3e92cc', live: true },
  done:   { l: 'Complete',    sc: '#6ee7b7', sb: 'rgba(16,185,129,.4)', sbg: 'rgba(16,185,129,.08)', dot: '#10b981' },
};

type LogoDef = { type: 'img'; src: string } | { type: 'svg'; c: string; path: string };
const logos: Record<string, LogoDef> = {
  mox:       { type: 'img', src: `${MODAL_BASE}mox-logo.png` },
  tss:       { type: 'img', src: `${MODAL_BASE}tss-logo.svg` },
  leftovers: { type: 'svg', c: '#ea580c', path: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z' },
  geo:       { type: 'svg', c: '#059669', path: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z' },
  defence:   { type: 'svg', c: '#3e92cc', path: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z' },
  enc:       { type: 'svg', c: '#ea580c', path: 'M21 7.5l-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9' },
  grimoire:  { type: 'svg', c: '#7c3aed', path: 'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25' },
  wishclaw:  { type: 'svg', c: '#23ce6b', path: 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.898 20.572 16.5 21.75l-.398-1.178a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.179-.398a2.25 2.25 0 0 0 1.423-1.423l.398-1.178.398 1.178a2.25 2.25 0 0 0 1.423 1.423l1.178.398-1.178.398a2.25 2.25 0 0 0-1.423 1.423Z' },
  orrery:    { type: 'svg', c: '#0891b2', path: 'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418' },
};

type LinkKind = 'repo' | 'live' | 'figma' | 'company' | 'docs' | 'article';
type ProjectLink = { kind: LinkKind; url: string; label: string };

type Project = {
  id: string; name: string; sub: string; desc: string; stack: string[];
  status: StatusKey; prog: number; due: string; logo: string;
  dir: string; bf: string; bt: string; updated: string;
  links?: ProjectLink[];
  ongoing?: boolean;  // full bar with "Ongoing" label — for released + continuously developed
};

const LINK_ICONS: Record<LinkKind, string> = {
  repo:    '<svg viewBox="0 0 24 24" class="fill"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12Z"/></svg>',
  figma:   '<svg viewBox="0 0 24 24" class="fill"><path d="M8.5 2A3.5 3.5 0 0 0 8.5 9H12V2H8.5Zm5.5 0v7h3.5a3.5 3.5 0 1 0 0-7H14Zm0 8.5V16a3.5 3.5 0 1 0 3.5-3.5H14Zm-2 0H8.5a3.5 3.5 0 1 0 3.5 3.5v-3.5Zm-3.5 5A3.5 3.5 0 1 0 12 19v-3.5H8.5Z"/></svg>',
  live:    '<svg viewBox="0 0 24 24" class="stroke"><path d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>',
  company: '<svg viewBox="0 0 24 24" class="stroke"><path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/></svg>',
  docs:    '<svg viewBox="0 0 24 24" class="stroke"><path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>',
  article: '<svg viewBox="0 0 24 24" class="stroke"><path d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"/></svg>',
};

const PROJECTS: Project[] = [
  { id: 'mox',       name: 'Mox Market V2',       sub: 'MTG · Decision engine',  desc: 'Purchase decision engine for Magic: The Gathering — price evaluation, verdict scoring, and market intelligence across 12 vendors.', stack: ['next','ts','pg','redis','vercel'], status: 'dev',    prog: 33, due: 'May',     logo: 'mox',       dir: 'to bottom right', bf: 'rgba(219,49,91,.4)',   bt: 'rgba(124,58,237,.45)', updated: '2d ago',
    links: [{ kind: 'repo', url: 'https://github.com/ayfor/mox-market', label: 'Repo' }] },
  { id: 'leftovers', name: 'Leftovers',           sub: 'Pantry · Mobile web',    desc: 'Smart recipe and pantry management — reduce food waste with ingredient tracking and meal planning.',                                                        stack: ['react','sup','ai','tail'],         status: 'dev',    prog: 40, due: 'Jun',     logo: 'leftovers', dir: 'to right',        bf: 'rgba(234,88,12,.35)',  bt: 'rgba(5,150,105,.35)',  updated: '5d ago',
    links: [{ kind: 'repo', url: 'https://github.com/ayfor/leftovers', label: 'Repo' }] },
  { id: 'wishclaw',  name: 'Wishclaw',            sub: 'MTG · LGS price comparison', desc: 'Magic: The Gathering card availability tool — bring-your-own-store scraping for local inventory. Gothic Cathedral design locked; feature pages in progress.', stack: ['next','ts','tail'],            status: 'design', prog: 45, due: 'Jun',     logo: 'wishclaw',  dir: 'to right',        bf: 'rgba(35,206,107,.35)', bt: 'rgba(124,58,237,.3)',  updated: '2w ago',
    links: [{ kind: 'figma', url: 'https://www.figma.com/design/xdWkxF2Xd6ZwTAWmgQEZal/Wishclaw-%E2%80%93-Style-Guide---Design-System?node-id=162-2', label: 'Figma' }] },
  { id: 'grimoire',  name: 'Grimoire',            sub: 'MTG · NLP trend analysis',   desc: 'Natural language trend analysis across MTG communities — card hype detection, meta shifts, and deck-archetype surfacing from social and tournament data.',  stack: ['next','ts','sup','ai'],        status: 'design', prog: 25, due: 'Jul',     logo: 'grimoire',  dir: 'to bottom',       bf: 'rgba(124,58,237,.35)', bt: 'rgba(219,49,91,.4)',   updated: '3w ago',
    links: [] },
  { id: 'orrery',    name: 'Orrery',              sub: 'MTG · Deck-tech visualizer', desc: 'AI-powered MTG deck-tech visualizer — surface card interactions, archetypes, and gameplay patterns from deck data.',                                       stack: ['next','ts','ai'],              status: 'todo',   prog: 5,  due: 'Fall',    logo: 'orrery',    dir: 'to top right',    bf: 'rgba(8,145,178,.35)',  bt: 'rgba(124,58,237,.3)',  updated: '2w ago',
    links: [] },
  { id: 'tss',       name: 'TSS Portfolio',       sub: 'This site',              desc: 'Single-page portfolio — Astro, Tailwind 4, Three.js morphing geometry driven by simplex noise.',                                                             stack: ['astro','tail','three'],            status: 'done',   prog: 100, due: 'Shipped', logo: 'tss',       dir: 'to bottom left',  bf: 'rgba(124,58,237,.45)', bt: 'rgba(8,145,178,.4)',   updated: 'Apr 12',
    links: [
      { kind: 'live', url: 'https://ayfor.github.io/tss_port_3/', label: 'Live' },
      { kind: 'repo', url: 'https://github.com/ayfor/tss_port_3', label: 'Repo' },
    ] },
  { id: 'geo',       name: 'Geospatial Platform', sub: 'Leonardo Canada',        desc: 'Real-time vessel tracking and track fusion over PostGIS. Server-side tile rendering, WebGL overlays. Released and actively extended.',                    stack: ['rails','faktory','go','docker','jenkins','tail'], status: 'dev', prog: 100, due: 'Ongoing', logo: 'geo', dir: 'to bottom right', bf: 'rgba(5,150,105,.45)', bt: 'rgba(8,145,178,.4)', updated: '1w ago', ongoing: true,
    links: [{ kind: 'company', url: 'https://leonardocompany.ca/', label: 'Leonardo' }] },
  { id: 'newton',    name: 'TESS (aka Newton)',   sub: 'Leonardo Canada',        desc: 'Multi-domain electronic warfare simulation platform — distributed message bus, operator consoles, hardened deployment pipeline.',                              stack: ['electron','cpp','pg','jenkins'],   status: 'done',   prog: 100, due: 'Shipped', logo: 'defence',   dir: 'to right',        bf: 'rgba(62,146,204,.5)',  bt: 'rgba(113,124,137,.4)', updated: 'Mar 2026',
    links: [
      { kind: 'company', url: 'https://leonardocompany.ca/', label: 'Leonardo' },
      { kind: 'article', url: 'https://www.leonardo.com/en/press-release-detail/-/detail/01-06-2022-leonardo-first-to-market-with-multi-domain-electronic-warfare-simulation', label: 'Article' },
    ] },
  { id: 'enc',       name: 'Product Configurator', sub: 'Enclosures Direct',     desc: '3D product configurator with per-panel pricing, cutout validation, and PDF spec generation.',                                                                stack: ['ng','js','cs','three','swx'],              status: 'done',   prog: 100, due: 'Shipped', logo: 'enc',       dir: 'to bottom',       bf: 'rgba(234,88,12,.5)',   bt: 'rgba(124,58,237,.35)', updated: 'Jan 2026',
    links: [{ kind: 'live', url: 'https://buyedi.com/configurator/Q4', label: 'Product page' }] },
];

const escHTML = (s: string) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

function linkButtonsHTML(p: Project): string {
  if (!p.links || p.links.length === 0) return '';
  return p.links.map(l => {
    const icon = LINK_ICONS[l.kind] || LINK_ICONS.live;
    let host = '';
    try { host = new URL(l.url).host.replace(/^www\./, ''); } catch { /* noop */ }
    const title = host || l.url;
    return `<a class="p-link" href="${l.url}" target="_blank" rel="noopener noreferrer" title="${title}" data-kind="${l.kind}">${icon}<span>${escHTML(l.label)}</span></a>`;
  }).join('');
}

function logoHTML(key: string): string {
  const l = logos[key];
  if (!l) return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>';
  if (l.type === 'img') return `<img src="${l.src}" alt="">`;
  return `<svg viewBox="0 0 24 24" style="--ic:${l.c};stroke:${l.c}"><path d="${l.path}"/></svg>`;
}

function stackPillsHTML(ids: string[], cap = 99): string {
  const items = ids.slice(0, cap).map(id => {
    const s = STACK[id];
    if (!s) return '';
    return `<span class="p-pill" style="--pc:${s.c}"><span class="sw"></span>${escHTML(s.l)}</span>`;
  }).join('');
  if (ids.length <= cap) return items;
  const hidden = ids.slice(cap);
  const hiddenPillsHTML = hidden.map(id => {
    const s = STACK[id];
    if (!s) return '';
    return `<span class="p-pill" style="--pc:${s.c}"><span class="sw"></span>${escHTML(s.l)}</span>`;
  }).join('');
  const extra = `<button type="button" class="p-pill p-pill-more" aria-label="Show ${hidden.length} more tech" aria-expanded="false" data-pills="${escHTML(hiddenPillsHTML)}" style="--pc:rgba(255,255,255,.3);color:rgba(255,250,255,.55)">+${hidden.length}</button>`;
  return items + extra;
}

function statusPillHTML(key: StatusKey): string {
  const s = STATUS[key];
  return `<span class="p-status ${s.live ? 'live' : ''}" style="--sc:${s.sc};--sb:${s.sb};--sbg:${s.sbg}"><span class="dot"></span>${s.l}</span>`;
}

function cardHTML(p: Project): string {
  const s = STATUS[p.status];
  const linksRow = (p.links && p.links.length) ? `<div class="p-links">${linkButtonsHTML(p)}</div>` : '';
  return `
    <article class="p-card" data-status="${p.status}" style="--dir:${p.dir};--bf:${p.bf};--bt:${p.bt}">
      <div class="p-head">
        <div class="p-logo">${logoHTML(p.logo)}</div>
        <div class="p-name">
          <h3>${escHTML(p.name)}</h3>
          <p class="sub">${escHTML(p.sub)}</p>
        </div>
      </div>
      ${statusPillHTML(p.status)}
      <p class="p-desc">${escHTML(p.desc)}</p>
      <div class="p-stack">${stackPillsHTML(p.stack, 5)}</div>
      ${linksRow}
      <div class="p-meta">
        <span>Updated ${escHTML(p.updated)}</span>
        ${p.status === 'todo' ? '' : `
        <span class="prog" style="--pc:${s.dot}">
          <span class="bar"><span style="width:${p.ongoing ? 100 : p.prog}%"></span></span>
          <span style="color:rgba(255,250,255,.7);font-weight:600">${p.ongoing ? 'Ongoing' : `${p.prog}%`}</span>
        </span>`}
      </div>
    </article>`;
}

function kanbanCardHTML(p: Project): string {
  const s = STATUS[p.status];
  return `
    <article class="kcard" data-status="${p.status}" style="--bf:${p.bf};--bt:${p.bt}">
      <div class="kc-head">
        <div class="kc-logo">${logoHTML(p.logo)}</div>
        <h5 class="kc-name">${escHTML(p.name)}</h5>
      </div>
      <p class="kc-desc">${escHTML(p.desc)}</p>
      <div class="kc-stack">${stackPillsHTML(p.stack, 3)}</div>
      ${(p.links && p.links.length) ? `<div class="kc-links">${linkButtonsHTML(p)}</div>` : ''}
      <div class="kc-foot">
        ${p.status === 'todo' ? '<span class="prog"></span>' : `
        <span class="prog" style="--pc:${s.dot}">
          <span class="bar"><span style="width:${p.ongoing ? 100 : p.prog}%"></span></span>
          <span class="pct">${p.ongoing ? 'Ongoing' : `${p.prog}%`}</span>
        </span>`}
        <span class="due"><svg viewBox="0 0 24 24"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/></svg><span>${escHTML(p.due)}</span></span>
      </div>
    </article>`;
}

const listGrid = document.getElementById('projects-list-grid');
const kanbanRoot = document.getElementById('projects-kanban-view');
const listView = document.getElementById('projects-list-view');

function renderList(filter = 'all') {
  if (!listGrid) return;
  const items = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.status === filter);
  listGrid.innerHTML = items.map(cardHTML).join('');
}

function renderKanban(filter = 'all') {
  if (!kanbanRoot) return;
  const cols: { key: StatusKey; c: string }[] = [
    { key: 'todo',   c: '#db315b' },
    { key: 'design', c: '#ea580c' },
    { key: 'dev',    c: '#3e92cc' },
    { key: 'done',   c: '#10b981' },
  ];
  kanbanRoot.innerHTML = cols.map(col => {
    const allItems = PROJECTS
      .filter(p => p.status === col.key)
      .sort((a, b) => Number(!!b.ongoing) - Number(!!a.ongoing)); // pin ongoing to top
    const isExcluded = filter !== 'all' && filter !== col.key;
    const countLabel = isExcluded ? 'N/A' : String(allItems.length);
    const s = STATUS[col.key];
    return `
      <div class="kcol${isExcluded ? ' excluded' : ''}" data-col="${col.key}">
        <div class="khead">
          <span class="cdot" style="--c:${col.c}"></span>
          <h4>${s.l}</h4>
          <span class="n">${countLabel}</span>
        </div>
        ${isExcluded ? '' : `<div class="klist">${allItems.map(kanbanCardHTML).join('')}</div>`}
      </div>`;
  }).join('');
}

// Open / close
const scrim = document.getElementById('projects-scrim');
const openBtn = document.getElementById('open-projects-modal');
const closeBtn = document.getElementById('close-projects-modal');

function openModal() {
  document.body.classList.add('projects-modal-open');
  scrim?.removeAttribute('inert');
  // Move focus into the modal so keyboard users land somewhere meaningful
  closeBtn?.focus();
}
function closeModal() {
  document.body.classList.remove('projects-modal-open');
  scrim?.setAttribute('inert', '');
  // Return focus to the trigger so tab order is preserved
  openBtn?.focus();
}

openBtn?.addEventListener('click', e => { e.preventDefault(); openModal(); });
closeBtn?.addEventListener('click', closeModal);
scrim?.addEventListener('click', e => { if (e.target === scrim) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('projects-modal-open')) closeModal(); });

// View toggle
const seg = document.querySelector<HTMLElement>('.projects-seg');
function setView(v: 'list' | 'kanban') {
  if (!seg) return;
  seg.dataset.view = v;
  seg.querySelectorAll<HTMLButtonElement>('button').forEach(b => {
    const on = b.dataset.v === v;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', String(on));
  });
  listView?.classList.toggle('on', v === 'list');
  kanbanRoot?.classList.toggle('on', v === 'kanban');
  const body = document.querySelector<HTMLElement>('.projects-mbody');
  if (body) body.scrollTop = 0;
}
seg?.querySelectorAll<HTMLButtonElement>('button').forEach(b => {
  b.addEventListener('click', () => setView(b.dataset.v as 'list' | 'kanban'));
});

// Filters
let currentFilter = 'all';
document.querySelectorAll<HTMLButtonElement>('.projects-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.projects-filter').forEach(x => x.classList.remove('on'));
    btn.classList.add('on');
    currentFilter = btn.dataset.f ?? 'all';
    renderList(currentFilter);
    renderKanban(currentFilter);
  });
});

// Keep the "All N" filter count in sync with PROJECTS length
const allFilterCount = document.getElementById('projects-count-all');
if (allFilterCount) allFilterCount.textContent = String(PROJECTS.length);

// Stack-overflow tooltip: click the "+N" pill to reveal hidden tech
const pillTooltip = document.getElementById('pill-tooltip');
let pillTooltipAnchor: HTMLElement | null = null;

function hidePillTooltip() {
  pillTooltip?.classList.remove('on');
  if (pillTooltipAnchor) {
    pillTooltipAnchor.setAttribute('aria-expanded', 'false');
    pillTooltipAnchor = null;
  }
}

function showPillTooltip(btn: HTMLElement) {
  if (!pillTooltip) return;
  const pillsHTML = btn.dataset.pills ?? '';
  pillTooltip.innerHTML = pillsHTML;
  pillTooltip.classList.add('on');
  btn.setAttribute('aria-expanded', 'true');
  pillTooltipAnchor = btn;
  // Position above the pill
  const rect = btn.getBoundingClientRect();
  const ttRect = pillTooltip.getBoundingClientRect();
  let left = rect.left + rect.width / 2 - ttRect.width / 2;
  let top = rect.top - ttRect.height - 8;
  // Clamp to viewport
  const margin = 8;
  left = Math.max(margin, Math.min(window.innerWidth - ttRect.width - margin, left));
  if (top < margin) top = rect.bottom + 8; // flip below if no room above
  pillTooltip.style.left = `${left}px`;
  pillTooltip.style.top = `${top}px`;
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const moreBtn = target.closest<HTMLElement>('.p-pill-more');
  if (moreBtn) {
    e.preventDefault();
    e.stopPropagation();
    if (pillTooltipAnchor === moreBtn) { hidePillTooltip(); return; }
    hidePillTooltip();
    showPillTooltip(moreBtn);
    return;
  }
  if (pillTooltipAnchor && !pillTooltip?.contains(target)) hidePillTooltip();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hidePillTooltip(); });
window.addEventListener('scroll', hidePillTooltip, true);
window.addEventListener('resize', hidePillTooltip);

// Initial render
renderList();
renderKanban();
