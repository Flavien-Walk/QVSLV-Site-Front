// alerts.js
// Gère les messages d'alerte animés pour la page de connexion QVSLV

export function showAlert(message, type = 'info') {
  const alertContainer = document.getElementById('alertContainer');
  if (!alertContainer) return;

  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `
    <span class="alert-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
    <span class="alert-message">${message}</span>
  `;

  alertContainer.appendChild(alert);

  setTimeout(() => {
    alert.classList.add('show');
  }, 100);

  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => {
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert);
      }
    }, 300);
  }, 4000);
}