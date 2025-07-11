// gallery.js
// Galeri fullscreen ExRestoPro: ambil gambar dari query string, navigasi next/prev, loader, dan indikator

// Daftar gambar (harus sama urutannya dengan galeri utama)
const screenshots = [
  // Tablet
  "IMG_6716.PNG","IMG_6717.PNG","IMG_6718.PNG","IMG_6719.PNG","IMG_6720.PNG","IMG_6721.PNG","IMG_6722.PNG","IMG_6723.PNG","IMG_6724.PNG","IMG_6725.PNG","IMG_6726.PNG","IMG_6727.PNG","IMG_6728.PNG","IMG_6729.PNG","IMG_6730.PNG","IMG_6731.PNG","IMG_6732.PNG","IMG_6733.PNG","IMG_6734.PNG","IMG_6735.PNG","IMG_6736.PNG","IMG_6737.PNG","IMG_6738.PNG","IMG_6739.PNG","IMG_6740.PNG","IMG_6741.PNG","IMG_6742.PNG","IMG_6743.PNG","IMG_6744.PNG","IMG_6745.PNG","IMG_6746.PNG","IMG_6747.PNG","IMG_6748.PNG","IMG_6749.PNG",
  // Phone
  "266ffca0-c740-4cc6-9615-5df374787e8a.png","IMG_1768.PNG","IMG_1769.PNG","IMG_1770.PNG","IMG_1771.PNG","IMG_1772.PNG","IMG_1773.PNG","IMG_1774.PNG","IMG_1775.PNG","IMG_1776.PNG","IMG_1777.PNG","IMG_1778.PNG","IMG_1779.PNG","IMG_1780.PNG","IMG_1781.PNG","IMG_1782.PNG","IMG_1783.PNG","IMG_1784.PNG","IMG_1785.PNG","IMG_1786.PNG","IMG_1787.PNG","IMG_1788.PNG","IMG_1789.PNG","IMG_1790.PNG","IMG_1791.PNG","IMG_1792.PNG"
];

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

let currentIdx = 0;

function showImage(idx) {
  const img = document.getElementById('gallery-img');
  const loader = document.getElementById('gallery-loader');
  if (idx < 0) idx = screenshots.length - 1;
  if (idx >= screenshots.length) idx = 0;
  currentIdx = idx;
  img.classList.add('hidden');
  loader.style.display = 'block';
  img.onload = () => {
    loader.style.display = 'none';
    img.classList.remove('hidden');
  };
  img.onerror = () => {
    loader.style.display = 'none';
    img.classList.remove('hidden');
    img.alt = 'Gagal memuat gambar';
  };
  img.src = 'assets/screenshoot/' + screenshots[idx];
  updateIndicator();
}

function updateIndicator() {
  const indicator = document.getElementById('gallery-indicator');
  indicator.innerHTML = screenshots.map((_, i) =>
    `<span style="width:12px;height:12px;border-radius:50%;display:inline-block;margin:0 2px;${i===currentIdx?'background:#22c55e;':'background:#fff3;border:2px solid #22c55e;'}"></span>`
  ).join('');
}

document.getElementById('prev-btn').onclick = () => showImage(currentIdx - 1);
document.getElementById('next-btn').onclick = () => showImage(currentIdx + 1);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') showImage(currentIdx - 1);
  if (e.key === 'ArrowRight') showImage(currentIdx + 1);
  if (e.key === 'Escape') window.location = 'index.html#screenshot-gallery';
});

document.querySelector('.close-btn').onclick = () => window.location = 'index.html#screenshot-gallery';
document.querySelector('.back-btn').onclick = () => window.location = 'index.html#screenshot-gallery';

// Mulai: ambil dari query string
window.onload = function() {
  let imgParam = getQueryParam('img');
  let idx = screenshots.findIndex(f => f.toLowerCase() === (imgParam||'').toLowerCase());
  if (idx === -1) idx = 0;
  showImage(idx);
};

// --- Zoom & Pan functionality ---
let scale = 1, lastScale = 1, startX = 0, startY = 0, lastX = 0, lastY = 0, isPanning = false;
const img = document.getElementById('gallery-img');

function resetZoom() {
  scale = 1; lastScale = 1; startX = 0; startY = 0; lastX = 0; lastY = 0; isPanning = false;
  setTransform();
}

function setTransform() {
  img.style.transform = `scale(${scale}) translate(${lastX/scale}px,${lastY/scale}px)`;
  img.style.transition = scale === 1 ? 'transform 0.2s' : 'none';
}

// Mouse wheel zoom
img.addEventListener('wheel', function(e) {
  e.preventDefault();
  let delta = e.deltaY < 0 ? 0.15 : -0.15;
  let newScale = Math.min(3, Math.max(1, scale + delta));
  if (newScale !== scale) {
    scale = newScale;
    setTransform();
  }
});

// Double click/tap zoom
let lastTap = 0;
img.addEventListener('click', function(e) {
  let now = Date.now();
  if (now - lastTap < 350) {
    scale = scale === 1 ? 2 : 1;
    lastX = 0; lastY = 0;
    setTransform();
  }
  lastTap = now;
});

// Touch pinch zoom
let initialDistance = 0, initialScale = 1;
img.addEventListener('touchstart', function(e) {
  if (e.touches.length === 2) {
    initialDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    initialScale = scale;
  } else if (e.touches.length === 1 && scale > 1) {
    isPanning = true;
    startX = e.touches[0].clientX - lastX;
    startY = e.touches[0].clientY - lastY;
  }
});
img.addEventListener('touchmove', function(e) {
  if (e.touches.length === 2) {
    let newDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    let newScale = Math.min(3, Math.max(1, initialScale * (newDistance / initialDistance)));
    scale = newScale;
    setTransform();
  } else if (e.touches.length === 1 && isPanning && scale > 1) {
    lastX = e.touches[0].clientX - startX;
    lastY = e.touches[0].clientY - startY;
    setTransform();
  }
});
img.addEventListener('touchend', function(e) {
  if (e.touches.length < 2) initialDistance = 0;
  if (e.touches.length === 0) isPanning = false;
});

// Mouse drag pan
img.addEventListener('mousedown', function(e) {
  if (scale === 1) return;
  isPanning = true;
  startX = e.clientX - lastX;
  startY = e.clientY - lastY;
  img.style.cursor = 'grabbing';
});
window.addEventListener('mousemove', function(e) {
  if (!isPanning) return;
  lastX = e.clientX - startX;
  lastY = e.clientY - startY;
  setTransform();
});
window.addEventListener('mouseup', function() {
  isPanning = false;
  img.style.cursor = '';
});

// Reset zoom on image change
const origShowImage = showImage;
showImage = function(idx) {
  resetZoom();
  origShowImage(idx);
};
