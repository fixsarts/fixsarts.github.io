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
      btn.textContent = '🔇 Hentikan Musik';
    } else {
      audio.pause();
      btn.textContent = '🎵 Putar Musik';
    }
  });
}
