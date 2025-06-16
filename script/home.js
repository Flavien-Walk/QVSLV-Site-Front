document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('qvslv_user')) || JSON.parse(sessionStorage.getItem('qvslv_user'));
  const token = localStorage.getItem('qvslv_token') || sessionStorage.getItem('qvslv_token');

  if (user && token) {
    document.getElementById('welcomeMessage').style.display = 'block';
    document.getElementById('welcomeUsername').textContent = user.username || 'Agent';
    document.getElementById('welcomeLevel').textContent = user.role || 'VÉRIFIÉ';
    document.getElementById('lastLogin').textContent = user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Inconnue';
    document.getElementById('accessLevel').querySelector('#levelBadge').textContent = user.role;
    document.getElementById('authSection').innerHTML = `<a href="#" class="nav-link login-btn" id="logoutLink">Déconnexion</a>`;
    
    document.getElementById('logoutLink').addEventListener('click', () => {
      localStorage.clear(); sessionStorage.clear(); window.location.reload();
    });

    // Activation shoutbox
    const msgInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendButton');
    msgInput.disabled = false;
    sendBtn.disabled = false;

    sendBtn.addEventListener('click', () => {
      const message = msgInput.value.trim();
      if (!message) return;
      const container = document.getElementById('messagesContainer');
      const div = document.createElement('div');
      div.className = 'message';
      div.innerHTML = `<strong>${user.username}</strong> : ${message}`;
      container.appendChild(div);
      msgInput.value = '';
    });
  }
});
