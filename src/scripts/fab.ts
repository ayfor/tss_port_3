/**
 * Mobile floating action button — expandable Contact / Resume panel.
 */

const fab = document.getElementById('mobile-fab');
const fabToggle = document.getElementById('fab-toggle');
const fabPanel = document.getElementById('fab-panel');
const fabLabel = document.getElementById('fab-label');
const iconMail = document.getElementById('fab-icon-mail');
const iconClose = document.getElementById('fab-icon-close');

function setFab(open: boolean) {
  fabPanel?.classList.toggle('opacity-0', !open);
  fabPanel?.classList.toggle('scale-90', !open);
  fabPanel?.classList.toggle('pointer-events-none', !open);
  fabPanel?.classList.toggle('opacity-100', open);
  fabPanel?.classList.toggle('scale-100', open);
  fabPanel?.classList.toggle('pointer-events-auto', open);
  iconMail?.classList.toggle('opacity-0', open);
  iconClose?.classList.toggle('opacity-0', !open);
  fabLabel?.classList.toggle('opacity-0', open);
  fabLabel?.classList.toggle('pointer-events-none', open);
}

fabToggle?.addEventListener('click', () => {
  const isOpen = fabPanel?.classList.contains('opacity-100');
  setFab(!isOpen);
});

fabLabel?.addEventListener('click', () => {
  const isOpen = fabPanel?.classList.contains('opacity-100');
  setFab(!isOpen);
});

document.addEventListener('click', (e) => {
  if (fab && !fab.contains(e.target as Node)) setFab(false);
});
