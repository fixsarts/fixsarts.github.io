// ══════════════════════════════════════
//  TAB SWITCHER
// ══════════════════════════════════════

/**
 * Mengganti tab aktif antara "Links" dan "Shop"
 * @param {string} name  - ID section target ('links' atau 'shop')
 * @param {HTMLElement} btn - Tombol tab yang diklik
 */
function switchTab(name, btn) {
  // Hapus class active dari semua tab & section
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  // Aktifkan tab & section yang dipilih
  btn.classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');
}

// ══════════════════════════════════════
//  MUSIC TOGGLE
// ══════════════════════════════════════

const audio = document.getElementById('bgMusic');
const btn = document.getElementById('toggleMusic');


if (btn && audio) {
  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = '❚❚ Hentikan Musik';
    } else {
      audio.pause();
      btn.textContent = '▶ Putar Musik';
    }
  });
}

const previewModal = document.getElementById('previewModal');
const openPreviewBtn = document.getElementById('openPdfPreview');
const closePreviewBtn = document.getElementById('closePreview');
const pdfPreviewFrame = document.getElementById('pdfPreviewFrame');
const examplePdfUrl = 'assets/pdf/ESJ%20Project.pdf';

function openPdfPreview(event) {
  event.preventDefault();
  if (!previewModal || !pdfPreviewFrame) return;

  pdfPreviewFrame.src = examplePdfUrl;
  previewModal.classList.add('active');
  document.body.classList.add('modal-open');
  previewModal.setAttribute('aria-hidden', 'false');
}

function closePdfPreview() {
  if (!previewModal || !pdfPreviewFrame) return;

  previewModal.classList.remove('active');
  document.body.classList.remove('modal-open');
  previewModal.setAttribute('aria-hidden', 'true');
  pdfPreviewFrame.src = '';
}

openPreviewBtn?.addEventListener('click', openPdfPreview);
closePreviewBtn?.addEventListener('click', closePdfPreview);
previewModal?.addEventListener('click', (event) => {
  if (event.target === previewModal) {
    closePdfPreview();
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && previewModal?.classList.contains('active')) {
    closePdfPreview();
  }
});
