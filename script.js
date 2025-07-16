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
  
  // Get DOM elements
  const galleryTablet = document.getElementById('gallery-tablet');
  const galleryPhone = document.getElementById('gallery-phone');
  const template = document.getElementById('screenshot-template');
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('gallery-modal-img');
  const btnClose = document.getElementById('gallery-modal-close');
  const btnPrev = document.getElementById('gallery-modal-prev');
  const btnNext = document.getElementById('gallery-modal-next');
  const indicator = document.getElementById('gallery-modal-indicator');
  
  let currentIdx = 0;
  
  // Check if all required elements exist
  if (!galleryTablet || !galleryPhone || !template || !modal || !modalImg) {
    console.error('Required gallery elements not found');
    return;
  }
  
  // Render thumbnails Tablet (pakai thumbs JPG)
  tabletFiles.forEach((file, idx) => {
    const clone = template.content.cloneNode(true);
    const img = clone.querySelector('img');
    const thumb = `assets/screenshoot/thumbs/${file.replace(/\.PNG$/i, '.jpg')}`;
    img.src = thumb;
    img.alt = `Screenshot Tablet ${idx+1}`;
    img.dataset.idx = idx;
    img.addEventListener('click', function(e) {
      e.preventDefault();
      window.open(`gallery.html?img=${encodeURIComponent(file)}`, '_blank');
    });
    galleryTablet.appendChild(clone);
  });

  // Render thumbnails Phone (pakai thumbs JPG)
  phoneFiles.forEach((file, idx) => {
    const clone = template.content.cloneNode(true);
    const img = clone.querySelector('img');
    const thumb = `assets/screenshoot/thumbs/${file.replace(/\.PNG$/i, '.jpg')}`;
    img.src = thumb;
    img.alt = `Screenshot iPhone ${idx+1}`;
    const globalIdx = tabletFiles.length + idx;
    img.dataset.idx = globalIdx;
    img.addEventListener('click', function(e) {
      e.preventDefault();
      window.open(`gallery.html?img=${encodeURIComponent(file)}`, '_blank');
    });
    galleryPhone.appendChild(clone);
  });
  
  // Modal functions
  function openGalleryModal(idx) {
    currentIdx = idx;
    // Tampilkan spinner loading
    modalImg.style.opacity = 0;
    modalImg.src = '';
    modal.classList.remove('hidden');
    modal.style.display = 'flex'; // Ensure modal is visible
    updateSliderUI();
    document.body.classList.add('gallery-modal-open');
    // Load gambar besar
    const fullImg = `assets/screenshoot/${screenshotFiles[idx]}`;
    // Spinner element
    let spinner = document.getElementById('gallery-modal-spinner');
    if (!spinner) {
      spinner = document.createElement('div');
      spinner.id = 'gallery-modal-spinner';
      spinner.innerHTML = '<div class="loader"></div>';
      spinner.style.position = 'fixed';
      spinner.style.top = '50%';
      spinner.style.left = '50%';
      spinner.style.transform = 'translate(-50%, -50%)';
      spinner.style.zIndex = '100000';
      modal.appendChild(spinner);
    } else {
      spinner.style.display = 'block';
    }
    // Load image
    modalImg.onload = function() {
      spinner.style.display = 'none';
      modalImg.style.opacity = 1;
      modalImg.classList.add('fadein-img');
    };
    modalImg.onerror = function() {
      spinner.style.display = 'none';
      modalImg.style.opacity = 1;
      modalImg.classList.remove('fadein-img');
      modalImg.alt = 'Gagal memuat gambar';
    };
    modalImg.classList.remove('fadein-img');
    modalImg.src = fullImg;
  }
// Tambah CSS spinner loader
if (!document.getElementById('gallery-modal-spinner-style')) {
  const style = document.createElement('style');
  style.id = 'gallery-modal-spinner-style';
  style.innerHTML = `
    .loader {
      border: 6px solid #f3f3f3;
      border-top: 6px solid #22c55e;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
  
  function closeGalleryModal() {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    modalImg.src = '';
    modalImg.classList.remove('fadein-img');
    document.body.classList.remove('gallery-modal-open');
  }
  
  function showPrev() {
    if (currentIdx > 0) {
      modalImg.classList.remove('fadein-img');
      setTimeout(() => openGalleryModal(currentIdx - 1), 100);
    }
  }
  
  function showNext() {
    if (currentIdx < screenshotFiles.length - 1) {
      modalImg.classList.remove('fadein-img');
      setTimeout(() => openGalleryModal(currentIdx + 1), 100);
    }
  }
  
  function updateSliderUI() {
    // Update prev/next button opacity
    if (btnPrev) btnPrev.classList.toggle('opacity-40', currentIdx === 0);
    if (btnNext) btnNext.classList.toggle('opacity-40', currentIdx === screenshotFiles.length - 1);
    
    // Update indicator dots
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
  
  // Event listeners
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
  
  // Add CSS for fade animation
  const style = document.createElement('style');
  style.innerHTML = `
    .fadein-img { 
      animation: fadeinimg 0.3s ease-out; 
    } 
    @keyframes fadeinimg { 
      from { opacity: 0; transform: scale(0.95); } 
      to { opacity: 1; transform: scale(1); } 
    }
  `;
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
      device_compatibility: {
        title: 'Siap untuk Tablet & HP Biasa',
        img: 'assets/tabletphone.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Tidak perlu beli device baru! ExRestoPro bisa langsung dipakai di iPad atau HP (iOS).</li>
          <li><span class='text-xs text-gray-500'>*Support Android menyusul</span></li>
        </ul>`
      },
      produk_varian_modifier: {
        title: 'Produk, Varian, Modifier',
        img: 'https://img.icons8.com/color/96/000000/plus-math.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Tambah produk tanpa batas, setiap produk bisa punya varian (ukuran, rasa, topping) dan modifier (opsi tambahan seperti extra cheese, less sugar, dll).</li>
        </ul>`
      },
      harga_tipe: {
        title: 'Harga Berdasarkan Tipe Pembelian',
        img: 'https://img.icons8.com/color/96/000000/price-tag-euro.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Atur harga berbeda untuk dine-in, takeaway, GoFood, Grab, dll.</li>
          <li>Kalkulasi otomatis untuk setiap produk baru atau setiap penjualan.</li>
        </ul>`
      },
      meja: {
        title: 'Manajemen Meja',
        img: 'https://img.icons8.com/color/96/000000/table.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Pantau status meja, pindah/melebur meja, dan pengaturan layout meja secara fleksibel.</li>
        </ul>`
      },
      shift: {
        title: 'Manajemen Shift Kasir',
        img: 'https://img.icons8.com/color/96/000000/clock--v1.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Shift kasir: mulai shift (opening balance), tutup shift (closing), pencocokan kas, dan histori shift kasir secara detail.</li>
        </ul>`
      },
      kas: {
        title: 'Manajemen Kas',
        img: 'https://img.icons8.com/color/96/000000/cash-register.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Pantau kas harian, mutasi kas, dan laporan kas masuk/keluar secara real-time.</li>
        </ul>`
      },
      struk_bluetooth: {
        title: 'Cetak Struk Bluetooth',
        img: 'https://img.icons8.com/color/96/000000/bluetooth.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Print struk transaksi & laporan shift ke printer thermal Bluetooth 58mm.</li>
        </ul>`
      },
      laporan: {
        title: 'Analisa & Laporan Detail',
        img: 'https://img.icons8.com/color/96/000000/combo-chart--v1.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Laporan harian, mingguan, bulanan, filter sesuai kebutuhan, dan analisa penjualan yang detail.</li>
        </ul>`
      },
      offline_drive: {
        title: 'Mode Offline & Google Drive',
        img: 'https://img.icons8.com/color/96/000000/google-drive--v2.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Aplikasi tetap berjalan tanpa internet, data backup ke Google Drive.</li>
          <li>Support schedule backup ke Google Drive pribadi.</li>
        </ul>`
      },
      user_pajak: {
        title: 'Manajemen User & Pajak',
        img: 'https://img.icons8.com/color/96/000000/user-group-man-man.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Manajemen user (multi user, hak akses, log aktivitas), pengaturan pajak otomatis, dan keamanan data.</li>
          <li><span class='text-xs text-gray-500'>(Tips/gratuity sementara tidak tersedia)</span></li>
        </ul>`
      },
      pembayaran: {
        title: 'Metode Pembayaran',
        img: 'https://img.icons8.com/color/96/000000/money.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Mendukung berbagai metode pembayaran, split bill, split pembayaran, dan pembayaran digital/cash.</li>
        </ul>`
      },
      excel: {
        title: 'Import/Export Excel',
        img: 'https://img.icons8.com/color/96/000000/microsoft-excel-2019--v2.png',
        desc: `<ul class="list-disc pl-5 space-y-2 text-left">
          <li>Export/import produk termasuk detail kategori, harga, dan modifier.</li>
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

// Tambahkan di script.js
document.addEventListener('DOMContentLoaded', function() {
  // Android Beta Modal
  window.showAndroidBetaModal = function() {
    document.getElementById('android-beta-modal').classList.remove('hidden');
  };
  
  window.closeAndroidBetaModal = function() {
    document.getElementById('android-beta-modal').classList.add('hidden');
  };
  
  // Handle beta form submission
  const betaForm = document.getElementById('android-beta-form');
  if (betaForm) {
    betaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('android-beta-email').value;
      
      // Kirim email ke server atau service
      handleBetaSignup(email);
    });
  }
  
  // Handle beta signup
  function handleBetaSignup(email) {
    // Opsi 1: Kirim ke Google Forms
    // window.open(`https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse?usp=pp_url&entry.EMAIL_FIELD=${encodeURIComponent(email)}`, '_blank');
    
    // Opsi 2: Kirim ke server Anda
    // fetch('/api/beta-signup', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email })
    // });
    
    // Opsi 3: Mailto (sementara)
    window.location.href = `mailto:exrestopro@gmail.com?subject=Beta Test Android - ${email}&body=Halo, saya ingin mendaftar beta test ExRestoPro Android.%0D%0A%0D%0AEmail: ${email}`;
    
    // Show success message
    alert('Terima kasih! Kami akan mengirim link download ke email Anda dalam 1-2 hari kerja.');
    closeAndroidBetaModal();
  }
});

console.log('ExRestoPro landing page script loaded.');
