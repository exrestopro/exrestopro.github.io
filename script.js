// Screenshot Gallery Interactivity
document.addEventListener('DOMContentLoaded', function () {
  // --- Screenshot Gallery Logic ---
  // Grouping files
  const allFiles = [
    "266ffca0-c740-4cc6-9615-5df374787e8a.png",
    "IMG_1768.PNG","IMG_1769.PNG","IMG_1770.PNG","IMG_1771.PNG","IMG_1772.PNG","IMG_1773.PNG","IMG_1774.PNG","IMG_1775.PNG","IMG_1776.PNG","IMG_1777.PNG","IMG_1778.PNG","IMG_1779.PNG","IMG_1780.PNG","IMG_1781.PNG","IMG_1782.PNG","IMG_1783.PNG","IMG_1784.PNG","IMG_1785.PNG","IMG_1786.PNG","IMG_1787.PNG","IMG_1788.PNG","IMG_1789.PNG","IMG_1790.PNG","IMG_1791.PNG","IMG_1792.PNG",
    "IMG_6716.PNG","IMG_6717.PNG","IMG_6718.PNG","IMG_6719.PNG","IMG_6720.PNG","IMG_6721.PNG","IMG_6722.PNG","IMG_6723.PNG","IMG_6724.PNG","IMG_6725.PNG","IMG_6726.PNG","IMG_6727.PNG","IMG_6728.PNG","IMG_6729.PNG","IMG_6730.PNG","IMG_6731.PNG","IMG_6732.PNG","IMG_6733.PNG","IMG_6734.PNG","IMG_6735.PNG","IMG_6736.PNG","IMG_6737.PNG","IMG_6738.PNG","IMG_6739.PNG","IMG_6740.PNG","IMG_6741.PNG","IMG_6742.PNG","IMG_6743.PNG","IMG_6744.PNG","IMG_6745.PNG","IMG_6746.PNG","IMG_6747.PNG","IMG_6748.PNG","IMG_6749.PNG"
  ];
  // Tablet: IMG_17XX, Phone: IMG_67XX
  const tabletFiles = allFiles.filter(f => /^IMG_17\d{2}\.PNG$/i.test(f));
  const phoneFiles = allFiles.filter(f => /^IMG_67\d{2}\.PNG$/i.test(f));
  // Gabungkan urutan: tablet lalu phone
  const screenshotFiles = [...tabletFiles, ...phoneFiles];
  // Untuk modal/slider: mapping file ke index global
  const galleryTablet = document.getElementById('gallery-tablet');
  const galleryPhone = document.getElementById('gallery-phone');
  const template = document.getElementById('screenshot-template');
  let currentIdx = 0;
  // Render thumbnails Tablet
  tabletFiles.forEach((file, idx) => {
    const clone = template.content.cloneNode(true);
    const img = clone.querySelector('img');
    img.src = `assets/screenshoot/${file}`;
    img.alt = `Screenshot Tablet ${idx+1}`;
    img.dataset.idx = idx;
    img.addEventListener('click', () => openGalleryModal(idx));
    galleryTablet.appendChild(clone);
  });
  // Render thumbnails Phone
  phoneFiles.forEach((file, idx) => {
    const clone = template.content.cloneNode(true);
    const img = clone.querySelector('img');
    img.src = `assets/screenshoot/${file}`;
    img.alt = `Screenshot iPhone ${idx+1}`;
    // Index di screenshotFiles: tablet.length + idx
    const globalIdx = tabletFiles.length + idx;
    img.dataset.idx = globalIdx;
    img.addEventListener('click', () => openGalleryModal(globalIdx));
    galleryPhone.appendChild(clone);
  });
  // Modal logic
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('gallery-modal-img');
  const btnClose = document.getElementById('gallery-modal-close');
  const btnPrev = document.getElementById('gallery-modal-prev');
  const btnNext = document.getElementById('gallery-modal-next');
  // --- Modal/Slider logic ---
  const indicator = document.getElementById('gallery-modal-indicator');
  let lastIdx = -1;
  function openGalleryModal(idx) {
    currentIdx = idx;
    modalImg.classList.remove('fadein-img');
    // Animate image fade
    setTimeout(() => modalImg.classList.add('fadein-img'), 10);
    modalImg.src = `assets/screenshoot/${screenshotFiles[idx]}`;
    modal.classList.remove('hidden');
    updateSliderUI();
    document.body.classList.add('gallery-modal-open');
  }
  function closeGalleryModal() {
    modal.classList.add('hidden');
    modalImg.src = '';
    document.body.classList.remove('gallery-modal-open');
  }
  function showPrev() {
    if (currentIdx > 0) openGalleryModal(currentIdx-1);
  }
  function showNext() {
    if (currentIdx < screenshotFiles.length-1) openGalleryModal(currentIdx+1);
  }
  function updateSliderUI() {
    // Always show prev/next unless di ujung
    btnPrev.classList.toggle('opacity-40', currentIdx === 0);
    btnNext.classList.toggle('opacity-40', currentIdx === screenshotFiles.length-1);
    // Indicator dots
    if (indicator) {
      indicator.innerHTML = '';
      screenshotFiles.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = i === currentIdx ? 'active' : '';
        dot.addEventListener('click', () => openGalleryModal(i));
        indicator.appendChild(dot);
      });
    }
  }
  btnClose && btnClose.addEventListener('click', closeGalleryModal);
  btnPrev && btnPrev.addEventListener('click', showPrev);
  btnNext && btnNext.addEventListener('click', showNext);
  // Close modal on overlay click
  modal && modal.addEventListener('click', function(e) {
    if (e.target === modal) closeGalleryModal();
  });
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!modal.classList.contains('hidden')) {
      if (e.key === 'Escape') closeGalleryModal();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    }
  });
  // Touch swipe support (mobile)
  let touchStartX = 0;
  let touchEndX = 0;
  modal && modal.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) touchStartX = e.touches[0].clientX;
  });
  modal && modal.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].clientX;
    if (touchEndX - touchStartX > 60) showPrev();
    if (touchStartX - touchEndX > 60) showNext();
  });
  // Animasi fadein untuk gambar modal
  const style = document.createElement('style');
  style.innerHTML = `.fadein-img { animation: fadeinimg 0.3s; } @keyframes fadeinimg { from { opacity:0; transform:scale(0.98);} to { opacity:1; transform:scale(1);} }`;
  document.head.appendChild(style);
});
// Custom JavaScript for ExRestoPro landing page

// Mobile menu toggle (if needed in the future)
// document.getElementById('menu-toggle').addEventListener('click', function() {
//   document.getElementById('mobile-menu').classList.toggle('hidden');
// });

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', function () {
  const accordions = document.querySelectorAll('.faq-accordion');
  accordions.forEach(acc => {
    const header = acc.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', function () {
        acc.classList.toggle('active');
        const content = acc.querySelector('.faq-content');
        if (content) {
          if (acc.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            content.style.maxHeight = null;
          }
        }
      });
    }
  });

  // Feature Modal logic
  window.showFeatureModal = function(key) {
    const modal = document.getElementById('feature-modal');
    const content = document.getElementById('feature-modal-content');
    const features = {
      unlimited_produk: {
        title: 'Unlimited Produk',
        img: 'https://img.icons8.com/color/96/000000/plus-math.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Tambah produk tanpa batas, cocok untuk menu yang terus berkembang.</li>
        </ul>`
      },
      varian_produk: {
        title: 'Varian Produk',
        img: 'https://img.icons8.com/color/96/000000/ingredients-list.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Setiap produk bisa punya varian (ukuran, rasa, topping).</li>
        </ul>`
      },
      modifier: {
        title: 'Modifier',
        img: 'https://img.icons8.com/color/96/000000/add-property.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Opsi tambahan pada produk (extra cheese, less sugar, dll).</li>
        </ul>`
      },
      harga_tipe: {
        title: 'Harga Berdasarkan Tipe Pembelian',
        img: 'https://img.icons8.com/color/96/000000/price-tag-euro.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Atur harga berbeda untuk dine-in, takeaway, GoFood, Grab, dll.</li>
        </ul>`
      },
      meja_shift_kas: {
        title: 'Manajemen Meja, Shift, Kas',
        img: 'https://img.icons8.com/color/96/000000/table.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Pantau status meja, shift karyawan, dan kas harian.</li>
        </ul>`
      },
      struk_bluetooth: {
        title: 'Cetak Struk via Bluetooth',
        img: 'https://img.icons8.com/color/96/000000/bluetooth.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Print struk transaksi & laporan shift ke printer thermal Bluetooth 58mm.</li>
        </ul>`
      },
      laporan: {
        title: 'Laporan Lengkap',
        img: 'https://img.icons8.com/color/96/000000/combo-chart--v1.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Laporan harian, mingguan, bulanan, filter sesuai kebutuhan.</li>
        </ul>`
      },
      offline_drive: {
        title: 'Mode Offline & Google Drive',
        img: 'https://img.icons8.com/color/96/000000/google-drive--v2.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Aplikasi tetap berjalan tanpa internet, data backup ke Google Drive.</li>
        </ul>`
      },
      user_pajak_tips: {
        title: 'User, Pajak, Tips',
        img: 'https://img.icons8.com/color/96/000000/user-group-man-man.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Manajemen user, hak akses, pajak, tips/gratuity.</li>
        </ul>`
      },
      pembayaran_excel: {
        title: 'Pembayaran & Import/Export Excel',
        img: 'https://img.icons8.com/color/96/000000/microsoft-excel-2019--v2.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Metode pembayaran beragam, import/export data Excel.</li>
        </ul>`
      },
      support_ios: {
        title: 'iOS & Support',
        img: 'https://img.icons8.com/color/96/000000/apple-logo.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Aplikasi iOS, support via WhatsApp/email, data aman.</li>
        </ul>`
      },
      device_compatibility: {
        title: 'Siap untuk Tablet & HP Biasa',
        img: 'https://img.icons8.com/color/96/000000/tablet-mac.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>ExRestoPro dapat digunakan di berbagai perangkat: tablet Android, iPad, maupun HP biasa (Android/iOS).</li>
          <li>Tidak perlu investasi perangkat mahal—cukup gunakan device yang sudah Anda miliki.</li>
          <li>Tampilan otomatis menyesuaikan layar, tetap nyaman digunakan oleh kasir, pelayan, maupun owner.</li>
          <li>Cocok untuk operasional di resto/cafe kecil hingga besar.</li>
        </ul>`
      }
    };
    if (features[key]) {
      content.innerHTML = `
        <div class="flex flex-col items-center text-center">
          <img src="${features[key].img}" alt="${features[key].title}" class="mb-4 w-20 h-20">
          <h3 class="text-2xl font-bold mb-2 text-blue-800">${features[key].title}</h3>
          <div class="text-gray-700 text-base mb-2">${features[key].desc}</div>
        </div>
      `;
      modal.classList.remove('hidden');
    }
  };
  window.closeFeatureModal = function() {
    document.getElementById('feature-modal').classList.add('hidden');
  };
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

console.log('ExRestoPro landing page script loaded.');
