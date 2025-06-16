import { showAlert } from './alerts.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginButton = document.getElementById('loginButton');
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const usernameInput = document.getElementById('username');

  const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://qvslv-site.onrender.com/api';

  // Affichage ou masquage du mot de passe
  togglePassword?.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
  });

  // Soumission du formulaire
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const remember = document.getElementById('remember').checked;

    if (!username || !password) {
      showAlert('Veuillez remplir tous les champs', 'error');
      return;
    }

    loginButton.disabled = true;
    loginButton.querySelector('.button-text').textContent = 'Authentification...';

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (!response.ok) {
        showAlert(result.error || 'Échec de la connexion', 'error');
        return;
      }

      // Stockage du token
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('qvslv_token', result.token);
      storage.setItem('qvslv_user', JSON.stringify(result.user));

      showAlert(`Bienvenue ${result.user.username} !`, 'success');
      setTimeout(() => window.location.href = '/index.html', 1500);

    } catch (err) {
      console.error('Erreur lors de la connexion', err);
      showAlert('Erreur réseau ou serveur', 'error');
    } finally {
      loginButton.disabled = false;
      loginButton.querySelector('.button-text').textContent = 'Authentifier';
    }
  });
});
