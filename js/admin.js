// ════════════════════════════════════════
// ADMIN PANEL - CATALOG MANAGEMENT
// ════════════════════════════════════════

// CONFIGURATION
const CONFIG = {
  ADMIN_PASSWORD: 'fixsarts2026', // Ganti dengan password yang kuat!
  GITHUB_TOKEN: localStorage.getItem('githubToken') || '',
  GITHUB_REPO: 'fixsarts/fixsarts.github.io',
  GITHUB_OWNER: 'fixsarts',
  CATALOG_FILE: 'data/catalog.json',
  CATALOG_IMAGES_PATH: 'assets/catalog/',
};

// Check if user is logged in
window.addEventListener('load', () => {
  const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
  if (isLoggedIn) {
    showDashboard();
  }
});

// ════════════════════════════════════════
// LOGIN HANDLER
// ════════════════════════════════════════

document.getElementById('loginForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const password = document.getElementById('adminPassword').value;
  const errorEl = document.getElementById('loginError');

  if (password === CONFIG.ADMIN_PASSWORD) {
    sessionStorage.setItem('adminLoggedIn', 'true');
    showDashboard();
  } else {
    errorEl.textContent = '❌ Password salah!';
    document.getElementById('adminPassword').value = '';
    setTimeout(() => errorEl.textContent = '', 3000);
  }
});

function logout() {
  sessionStorage.removeItem('adminLoggedIn');
  location.reload();
}

function showDashboard() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminDashboard').classList.add('active');
  loadCatalogList();
  setupUploadHandlers();
  setupFormHandler();
}

// ════════════════════════════════════════
// IMAGE UPLOAD HANDLER
// ════════════════════════════════════════

let selectedImageFile = null;
let selectedImageBase64 = null;

function setupUploadHandlers() {
  const uploadArea = document.getElementById('uploadArea');
  const imageInput = document.getElementById('imageInput');

  uploadArea.addEventListener('click', () => imageInput.click());

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageSelect(files[0]);
    }
  });

  imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleImageSelect(e.target.files[0]);
    }
  });
}

function handleImageSelect(file) {
  if (!file.type.startsWith('image/')) {
    showStatus('❌ File harus berupa gambar!', 'error');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showStatus('❌ File terlalu besar (max 5MB)', 'error');
    return;
  }

  selectedImageFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    selectedImageBase64 = e.target.result;
    document.getElementById('previewImg').src = selectedImageBase64;
    document.getElementById('imagePreview').style.display = 'block';
  };
  reader.readAsDataURL(file);
}

// ════════════════════════════════════════
// FORM HANDLER
// ════════════════════════════════════════

function setupFormHandler() {
  document.getElementById('catalogForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedImageBase64) {
      showStatus('❌ Silakan pilih gambar terlebih dahulu!', 'error');
      return;
    }

    const title = document.getElementById('itemTitle').value;
    const desc = document.getElementById('itemDesc').value;
    const year = document.getElementById('itemYear').value;
    const type = document.getElementById('itemType').value;
    const badge = document.getElementById('itemBadge').value;

    showStatus('⏳ Mengunggah gambar...', 'loading');

    try {
      // Convert base64 to blob
      const blob = base64ToBlob(selectedImageBase64);
      const fileName = `${Date.now()}-${selectedImageFile.name}`;

      // Upload image to GitHub
      await uploadImageToGitHub(fileName, selectedImageBase64);

      // Add item to catalog
      await addItemToCatalog({
        id: Date.now(),
        title,
        desc,
        year,
        type,
        badge,
        image: `${CONFIG.CATALOG_IMAGES_PATH}${fileName}`
      });

      showStatus('✓ Item berhasil ditambahkan!', 'success');
      document.getElementById('catalogForm').reset();
      document.getElementById('imagePreview').style.display = 'none';
      selectedImageFile = null;
      selectedImageBase64 = null;
      loadCatalogList();

    } catch (error) {
      showStatus(`❌ Error: ${error.message}`, 'error');
    }
  });
}

// ════════════════════════════════════════
// GITHUB API HANDLERS
// ════════════════════════════════════════

async function uploadImageToGitHub(fileName, base64Data) {
  // Untuk implementasi gratis, kami akan menggunakan GitHub API
  // File akan disimpan di folder assets/catalog/
  
  const content = base64Data.split(',')[1]; // Remove data:image/... prefix
  const path = `${CONFIG.CATALOG_IMAGES_PATH}${fileName}`;

  // Note: Untuk implementasi penuh, Anda perlu GitHub token
  // Untuk sekarang, kita akan menyimpan di localStorage sebagai fallback
  console.log(`Image akan disimpan di: ${path}`);
  
  // Simpan referensi gambar di localStorage
  const images = JSON.parse(localStorage.getItem('catalogImages') || '{}');
  images[fileName] = base64Data;
  localStorage.setItem('catalogImages', JSON.stringify(images));
}

async function addItemToCatalog(item) {
  // Simpan ke localStorage (untuk gratis, tanpa perlu GitHub API token)
  const catalog = JSON.parse(localStorage.getItem('catalogData') || '[]');
  catalog.push(item);
  localStorage.setItem('catalogData', JSON.stringify(catalog));
  
  console.log('Item ditambahkan:', item);
}

async function deleteFromCatalog(itemId) {
  const catalog = JSON.parse(localStorage.getItem('catalogData') || '[]');
  const filtered = catalog.filter(item => item.id !== itemId);
  localStorage.setItem('catalogData', JSON.stringify(filtered));
  loadCatalogList();
  showStatus('✓ Item berhasil dihapus!', 'success');
}

// ════════════════════════════════════════
// LOAD CATALOG LIST
// ════════════════════════════════════════

function loadCatalogList() {
  const catalog = JSON.parse(localStorage.getItem('catalogData') || '[]');
  const listEl = document.getElementById('catalogList');

  if (catalog.length === 0) {
    listEl.innerHTML = `<p style="color: var(--muted); text-align: center; padding: 20px;">Belum ada item katalog</p>`;
    return;
  }

  listEl.innerHTML = catalog.map(item => `
    <div class="catalog-item-admin">
      <img src="${item.image}" alt="${item.title}">
      <div class="catalog-item-admin-content">
        <h3>${item.title}</h3>
        <p>${item.desc.substring(0, 60)}...</p>
        <div style="font-size: 11px; color: var(--accent);">${item.badge} • ${item.year}</div>
      </div>
      <div class="catalog-item-admin-actions">
        <button class="btn-small delete" onclick="deleteItem(${item.id})">Hapus</button>
      </div>
    </div>
  `).join('');
}

function deleteItem(id) {
  if (confirm('Yakin ingin menghapus item ini?')) {
    deleteFromCatalog(id);
  }
}

// ════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════

function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('uploadStatus');
  statusEl.innerHTML = `<div class="status-message ${type}">${message}</div>`;
  
  if (type !== 'loading') {
    setTimeout(() => {
      statusEl.innerHTML = '';
    }, 4000);
  }
}

function base64ToBlob(base64) {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while(n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

// Make functions accessible globally
window.deleteItem = deleteItem;
window.logout = logout;