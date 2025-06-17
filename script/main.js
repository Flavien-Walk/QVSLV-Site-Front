// main.js - Script d'initialisation principal

document.addEventListener('DOMContentLoaded', () => {
  // Initialiser le gestionnaire d'authentification
  if (typeof AuthManager !== 'undefined') {
    window.authManager = new AuthManager();
  }
  
  // Autres initialisations...
  initializeSearch();
  initializeToolbar();
  initializeChat();
  initializeNotifications();
});

// Fonction pour la recherche globale
function initializeSearch() {
  const searchInput = document.getElementById('globalSearch');
  const searchBtn = document.querySelector('.search-btn');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Recherche en temps réel
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performSearch(e.target.value);
      }, 300);
    });
  }

  // Bouton de recherche
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      if (searchInput) {
        performSearch(searchInput.value);
      }
    });
  }

  // Filtres de recherche
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      applySearchFilter(filter);
    });
  });
}

// Fonction de recherche
function performSearch(query) {
  if (!query.trim()) return;
  
  console.log('Recherche:', query);
  // Implémenter la logique de recherche ici
  
  // Simulation d'une recherche
  showSearchResults(query);
}

// Appliquer les filtres de recherche
function applySearchFilter(filter) {
  console.log('Filtre appliqué:', filter);
  // Implémenter la logique de filtrage ici
}

// Afficher les résultats de recherche
function showSearchResults(query) {
  // Simulation d'affichage de résultats
  if (window.showAlert) {
    window.showAlert(`Recherche effectuée: "${query}"`, 'info');
  }
}

// Initialiser la barre d'outils
function initializeToolbar() {
  const randomBtn = document.getElementById('randomDocument');
  const bookmarksBtn = document.getElementById('bookmarks');
  const downloadBtn = document.getElementById('downloadMode');
  const viewBtns = document.querySelectorAll('.view-btn');

  // Document aléatoire
  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      showRandomDocument();
    });
  }

  // Signets
  if (bookmarksBtn) {
    bookmarksBtn.addEventListener('click', () => {
      toggleBookmarks();
    });
  }

  // Mode téléchargement
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      toggleDownloadMode();
    });
  }

  // Boutons de vue
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const view = btn.dataset.view;
      changeView(view);
    });
  });
}

// Fonctions de la barre d'outils
function showRandomDocument() {
  console.log('Document aléatoire sélectionné');
  if (window.showAlert) {
    window.showAlert('Document aléatoire sélectionné', 'info');
  }
}

function toggleBookmarks() {
  console.log('Signets basculés');
  if (window.showAlert) {
    window.showAlert('Signets ouverts', 'info');
  }
}

function toggleDownloadMode() {
  console.log('Mode téléchargement basculé');
  if (window.showAlert) {
    window.showAlert('Mode téléchargement activé', 'info');
  }
}

function changeView(view) {
  console.log('Vue changée:', view);
  const categoriesGrid = document.querySelector('.categories-grid');
  
  if (categoriesGrid) {
    categoriesGrid.className = `categories-grid view-${view}`;
  }
}

// Initialiser le chat
function initializeChat() {
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');
  const emojiButton = document.getElementById('emojiButton');
  const emojiPicker = document.getElementById('emojiPicker');
  const minimizeBtn = document.getElementById('minimizeShoutbox');
  const shoutboxBody = document.getElementById('shoutboxBody');

  // Envoyer un message
  if (sendButton) {
    sendButton.addEventListener('click', () => {
      sendMessage();
    });
  }

  // Envoyer avec Entrée
  if (messageInput) {
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // Bouton emoji
  if (emojiButton) {
    emojiButton.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleEmojiPicker();
    });
  }

  // Sélection d'emoji
  if (emojiPicker) {
    emojiPicker.addEventListener('click', (e) => {
      if (e.target.classList.contains('emoji')) {
        insertEmoji(e.target.dataset.emoji);
      }
    });
  }

  // Réduire/agrandir la shoutbox
  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', () => {
      toggleShoutbox();
    });
  }

  // Fermer le picker d'emoji en cliquant ailleurs
  document.addEventListener('click', (e) => {
    if (emojiPicker && !emojiPicker.contains(e.target) && !emojiButton?.contains(e.target)) {
      emojiPicker.style.display = 'none';
    }
  });
}

// Fonctions du chat
function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  if (!messageInput || !messageInput.value.trim()) return;

  const message = messageInput.value.trim();
  
  // Vérifier si l'utilisateur est connecté
  if (!window.authManager?.isLoggedIn()) {
    if (window.showAlert) {
      window.showAlert('Vous devez être connecté pour envoyer un message', 'error');
    }
    return;
  }

  // Ajouter le message à la shoutbox
  addMessageToShoutbox(message);
  
  // Vider le champ de saisie
  messageInput.value = '';
  
  console.log('Message envoyé:', message);
}

function addMessageToShoutbox(message) {
  const messagesContainer = document.getElementById('messagesContainer');
  if (!messagesContainer) return;

  const user = window.authManager?.getUser();
  const now = new Date();
  const timeString = now.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const messageElement = document.createElement('div');
  messageElement.className = 'message';
  
  const userClass = getUserChatClass(user?.level);
  
  messageElement.innerHTML = `
    <span class="message-user ${userClass}">${user?.username || 'Anonyme'}</span>
    <span class="message-time">${timeString}</span>
    <span class="message-text">${escapeHtml(message)}</span>
  `;

  messagesContainer.appendChild(messageElement);
  
  // Faire défiler vers le bas
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Limiter le nombre de messages affichés
  const messages = messagesContainer.querySelectorAll('.message');
  if (messages.length > 50) {
    messages[0].remove();
  }
}

function getUserChatClass(level) {
  const classes = {
    'admin': 'admin',
    'moderator': 'moderator',
    'verified': 'verified',
    'contributor': 'contributor',
    'member': 'member'
  };
  return classes[level] || 'member';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function toggleEmojiPicker() {
  const emojiPicker = document.getElementById('emojiPicker');
  if (!emojiPicker) return;

  const isVisible = emojiPicker.style.display === 'block';
  emojiPicker.style.display = isVisible ? 'none' : 'block';
}

function insertEmoji(emoji) {
  const messageInput = document.getElementById('messageInput');
  if (!messageInput) return;

  const cursorPos = messageInput.selectionStart;
  const textBefore = messageInput.value.substring(0, cursorPos);
  const textAfter = messageInput.value.substring(messageInput.selectionEnd);
  
  messageInput.value = textBefore + emoji + textAfter;
  messageInput.focus();
  
  // Repositionner le curseur
  const newPos = cursorPos + emoji.length;
  messageInput.setSelectionRange(newPos, newPos);
  
  // Fermer le picker
  const emojiPicker = document.getElementById('emojiPicker');
  if (emojiPicker) {
    emojiPicker.style.display = 'none';
  }
}

function toggleShoutbox() {
  const shoutboxBody = document.getElementById('shoutboxBody');
  const minimizeBtn = document.getElementById('minimizeShoutbox');
  
  if (!shoutboxBody || !minimizeBtn) return;

  const isMinimized = shoutboxBody.style.display === 'none';
  
  if (isMinimized) {
    shoutboxBody.style.display = 'block';
    minimizeBtn.textContent = '−';
  } else {
    shoutboxBody.style.display = 'none';
    minimizeBtn.textContent = '+';
  }
}

// Initialiser les notifications
function initializeNotifications() {
  const notificationBtn = document.getElementById('notificationBtn');
  const themeToggle = document.getElementById('themeToggle');

  // Bouton de notifications
  if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
      toggleNotifications();
    });
  }

  // Bouton de thème
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      toggleTheme();
    });
  }

  // Vérifier les notifications périodiquement
  setInterval(checkNotifications, 30000); // Toutes les 30 secondes
}

function toggleNotifications() {
  console.log('Notifications basculées');
  if (window.showAlert) {
    window.showAlert('Notifications ouvertes', 'info');
  }
}

function toggleTheme() {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  
  const isDark = body.classList.contains('dark-theme');
  
  if (isDark) {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    if (themeToggle) themeToggle.textContent = '🌙';
    localStorage.setItem('qvslv_theme', 'light');
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    if (themeToggle) themeToggle.textContent = '☀️';
    localStorage.setItem('qvslv_theme', 'dark');
  }
}

function checkNotifications() {
  // Vérifier s'il y a de nouvelles notifications
  if (window.authManager?.isLoggedIn()) {
    // Logique pour vérifier les notifications
    console.log('Vérification des notifications...');
  }
}

// Initialiser les cartes de catégories
function initializeCategories() {
  const categoryCards = document.querySelectorAll('.category-card');
  
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      navigateToCategory(category);
    });
    
    // Effet hover amélioré
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
}

function navigateToCategory(category) {
  console.log('Navigation vers la catégorie:', category);
  
  // Vérifier le niveau d'accès requis
  const accessRequired = getCategoryAccessLevel(category);
  const userLevel = window.authManager?.getUserLevel() || 'anonymous';
  
  if (!hasAccess(userLevel, accessRequired)) {
    if (window.showAlert) {
      window.showAlert('Accès refusé - Niveau d\'autorisation insuffisant', 'error');
    }
    return;
  }
  
  // Navigation vers la catégorie
  window.location.href = `/html/category.html?cat=${category}`;
}

function getCategoryAccessLevel(category) {
  const accessLevels = {
    'archives': 'verified',
    'ancient': 'member',
    'social': 'verified',
    'tech': 'member',
    'consciousness': 'anonymous',
    'symbols': 'verified'
  };
  
  return accessLevels[category] || 'member';
}

function hasAccess(userLevel, requiredLevel) {
  const hierarchy = {
    'anonymous': 0,
    'member': 1,
    'contributor': 2,
    'verified': 3,
    'moderator': 4,
    'admin': 5
  };
  
  return hierarchy[userLevel] >= hierarchy[requiredLevel];
}

// Fonctions utilitaires
function showAlert(message, type = 'info') {
  const container = document.getElementById('notificationContainer') || document.body;
  
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `
    <div class="alert-content">
      <span class="alert-icon">${getAlertIcon(type)}</span>
      <span class="alert-message">${message}</span>
      <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  container.appendChild(alert);
  
  // Animation d'entrée
  setTimeout(() => alert.classList.add('show'), 100);
  
  // Suppression automatique
  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => alert.remove(), 300);
  }, 4000);
}

function getAlertIcon(type) {
  const icons = {
    'success': '✅',
    'error': '❌',
    'warning': '⚠️',
    'info': 'ℹ️'
  };
  return icons[type] || 'ℹ️';
}

// Initialiser le thème au chargement
function initializeTheme() {
  const savedTheme = localStorage.getItem('qvslv_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  document.body.classList.add(`${theme}-theme`);
  
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// Fonction d'initialisation principale étendue
function initializeApp() {
  initializeTheme();
  initializeCategories();
  
  // Autres initialisations...
  console.log('Application QVSLV initialisée');
}

// Ajouter l'initialisation de l'app au DOMContentLoaded existant
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser le gestionnaire d'authentification
  if (typeof AuthManager !== 'undefined') {
    window.authManager = new AuthManager();
  }
  
  // Autres initialisations...
  initializeSearch();
  initializeToolbar();
  initializeChat();
  initializeNotifications();
  initializeApp();
});

// Exposer showAlert globalement
window.showAlert = showAlert;