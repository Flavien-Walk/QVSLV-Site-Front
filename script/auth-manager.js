// auth-manager.js - Gestion de l'authentification et du profil utilisateur

class AuthManager {
  constructor() {
    this.user = null;
    this.token = null;
    this.init();
  }

  init() {
    // Vérifier si l'utilisateur est connecté au chargement de la page
    this.checkAuthStatus();
    this.setupEventListeners();
  }

  // Vérifier le statut d'authentification
  checkAuthStatus() {
    // Vérifier dans localStorage et sessionStorage
    const token = localStorage.getItem('qvslv_token') || sessionStorage.getItem('qvslv_token');
    const userData = localStorage.getItem('qvslv_user') || sessionStorage.getItem('qvslv_user');

    if (token && userData) {
      try {
        this.token = token;
        this.user = JSON.parse(userData);
        this.updateUIForLoggedUser();
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        this.logout();
      }
    } else {
      this.updateUIForAnonymousUser();
    }
  }

  // Mettre à jour l'interface pour un utilisateur connecté
  updateUIForLoggedUser() {
    const authSection = document.getElementById('authSection');
    const accessLevel = document.getElementById('accessLevel');
    const levelBadge = document.getElementById('levelBadge');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const welcomeUsername = document.getElementById('welcomeUsername');
    const welcomeLevel = document.getElementById('welcomeLevel');
    const userProfileBlock = document.getElementById('userProfileBlock');

    if (authSection) {
      // Remplacer le bouton connexion par le profil utilisateur
      authSection.innerHTML = this.createUserProfileHTML();
    }

    // Mettre à jour le niveau d'accès
    if (levelBadge) {
      levelBadge.textContent = this.getUserLevelText();
      levelBadge.className = `level-badge ${this.getUserLevelClass()}`;
    }

    // Afficher le message de bienvenue
    if (welcomeMessage) {
      welcomeMessage.style.display = 'block';
      if (welcomeUsername) welcomeUsername.textContent = this.user.username;
      if (welcomeLevel) welcomeLevel.textContent = this.getUserLevelText();
    }

    // Mettre à jour le profil dans la sidebar
    if (userProfileBlock) {
      userProfileBlock.style.display = 'block';
      this.updateSidebarProfile();
    }

    // Activer les fonctionnalités de chat
    this.enableChatFeatures();

    // Réattacher les événements après la mise à jour du DOM
    this.attachProfileEvents();
  }

  // Mettre à jour l'interface pour un utilisateur anonyme
  updateUIForAnonymousUser() {
    const authSection = document.getElementById('authSection');
    const levelBadge = document.getElementById('levelBadge');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userProfileBlock = document.getElementById('userProfileBlock');

    if (authSection) {
      authSection.innerHTML = '<a href="/html/login.html" class="nav-link login-btn">Connexion</a>';
    }

    if (levelBadge) {
      levelBadge.textContent = 'ANONYME';
      levelBadge.className = 'level-badge anonymous';
    }

    if (welcomeMessage) {
      welcomeMessage.style.display = 'none';
    }

    if (userProfileBlock) {
      userProfileBlock.style.display = 'none';
    }

    // Désactiver les fonctionnalités de chat
    this.disableChatFeatures();
  }

  // Créer le HTML du profil utilisateur
  createUserProfileHTML() {
    return `
      <div class="user-profile-container">
        <button class="user-profile-btn" id="userProfileBtn">
          <div class="user-avatar">${this.getUserAvatar()}</div>
          <div class="user-info">
            <span class="user-name">${this.user.username}</span>
            <span class="user-level">${this.getUserLevelText()}</span>
          </div>
          <div class="dropdown-arrow">▼</div>
        </button>
        
        <div class="user-dropdown-menu" id="userDropdownMenu">
          <div class="dropdown-header">
            <div class="dropdown-avatar">${this.getUserAvatar()}</div>
            <div class="dropdown-user-info">
              <span class="dropdown-username">${this.user.username}</span>
              <span class="dropdown-level">${this.getUserLevelText()}</span>
              <span class="dropdown-email">${this.user.email || 'email@confidentiel.qv'}</span>
            </div>
          </div>
          
          <div class="dropdown-separator"></div>
          
          <div class="dropdown-menu-items">
            <a href="/html/profile.html" class="dropdown-item">
              <span class="item-icon">👤</span>
              <span class="item-text">Mon Profil</span>
            </a>
            
            <a href="/html/settings.html" class="dropdown-item">
              <span class="item-icon">⚙️</span>
              <span class="item-text">Paramètres</span>
            </a>
            
            <a href="/html/bookmarks.html" class="dropdown-item">
              <span class="item-icon">⭐</span>
              <span class="item-text">Mes Signets</span>
            </a>
            
            <a href="/html/activity.html" class="dropdown-item">
              <span class="item-icon">📊</span>
              <span class="item-text">Mon Activité</span>
            </a>
            
            <a href="/html/security.html" class="dropdown-item">
              <span class="item-icon">🔐</span>
              <span class="item-text">Sécurité</span>
            </a>
            
            <div class="dropdown-separator"></div>
            
            <a href="/html/help.html" class="dropdown-item">
              <span class="item-icon">❓</span>
              <span class="item-text">Aide</span>
            </a>
            
            <button class="dropdown-item logout-item" id="logoutBtn">
              <span class="item-icon">🚪</span>
              <span class="item-text">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Obtenir l'avatar de l'utilisateur
  getUserAvatar() {
    if (this.user?.avatar) {
      return this.user.avatar;
    }
    
    // Avatar basé sur le niveau d'accès
    const levelAvatars = {
      'admin': '👑',
      'moderator': '🛡️',
      'verified': '✅',
      'contributor': '📝',
      'member': '👤'
    };
    
    return levelAvatars[this.user?.level] || '👤';
  }

  // Obtenir le texte du niveau d'accès
  getUserLevelText() {
    const levels = {
      'admin': 'ADMINISTRATEUR',
      'moderator': 'MODÉRATEUR',
      'verified': 'VÉRIFIÉ',
      'contributor': 'CONTRIBUTEUR',
      'member': 'MEMBRE'
    };
    
    return levels[this.user?.level] || 'MEMBRE';
  }

  // Obtenir la classe CSS du niveau d'accès
  getUserLevelClass() {
    const levelClasses = {
      'admin': 'admin',
      'moderator': 'moderator',
      'verified': 'verified',
      'contributor': 'contributor',
      'member': 'member'
    };
    
    return levelClasses[this.user?.level] || 'member';
  }

  // Mettre à jour le profil dans la sidebar
  updateSidebarProfile() {
    const profileName = document.getElementById('profileName');
    const profileRole = document.getElementById('profileRole');
    const profileSpecialty = document.getElementById('profileSpecialty');

    if (profileName) profileName.textContent = this.user.username;
    if (profileRole) profileRole.textContent = this.getUserLevelText();
    if (profileSpecialty) profileSpecialty.textContent = this.user.specialty || 'Généraliste';
  }

  // Activer les fonctionnalités de chat
  enableChatFeatures() {
    const messageInput = document.getElementById('messageInput');
    const emojiButton = document.getElementById('emojiButton');
    const sendButton = document.getElementById('sendButton');

    if (messageInput) {
      messageInput.disabled = false;
      messageInput.placeholder = 'Tapez votre message...';
    }

    if (emojiButton) emojiButton.disabled = false;
    if (sendButton) sendButton.disabled = false;
  }

  // Désactiver les fonctionnalités de chat
  disableChatFeatures() {
    const messageInput = document.getElementById('messageInput');
    const emojiButton = document.getElementById('emojiButton');
    const sendButton = document.getElementById('sendButton');

    if (messageInput) {
      messageInput.disabled = true;
      messageInput.placeholder = 'Connectez-vous pour participer...';
    }

    if (emojiButton) emojiButton.disabled = true;
    if (sendButton) sendButton.disabled = true;
  }

  // Attacher les événements du profil utilisateur
  attachProfileEvents() {
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    const logoutBtn = document.getElementById('logoutBtn');

    // Toggle du menu déroulant
    if (userProfileBtn) {
      userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdownMenu();
      });
    }

    // Bouton de déconnexion
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }

    // Fermer le menu en cliquant ailleurs
    document.addEventListener('click', (e) => {
      if (userDropdownMenu && !userDropdownMenu.contains(e.target) && !userProfileBtn?.contains(e.target)) {
        this.closeDropdownMenu();
      }
    });
  }

  // Basculer l'affichage du menu déroulant
  toggleDropdownMenu() {
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    if (userDropdownMenu) {
      userDropdownMenu.classList.toggle('active');
    }
  }

  // Fermer le menu déroulant
  closeDropdownMenu() {
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    if (userDropdownMenu) {
      userDropdownMenu.classList.remove('active');
    }
  }

  // Configurer les événements généraux
  setupEventListeners() {
    // Écouter les changements dans le stockage (connexion depuis un autre onglet)
    window.addEventListener('storage', (e) => {
      if (e.key === 'qvslv_token' || e.key === 'qvslv_user') {
        this.checkAuthStatus();
      }
    });
  }

  // Déconnexion
  logout() {
    // Supprimer les données de stockage
    localStorage.removeItem('qvslv_token');
    localStorage.removeItem('qvslv_user');
    sessionStorage.removeItem('qvslv_token');
    sessionStorage.removeItem('qvslv_user');

    // Réinitialiser les variables
    this.user = null;
    this.token = null;

    // Fermer le menu s'il est ouvert
    this.closeDropdownMenu();

    // Mettre à jour l'interface
    this.updateUIForAnonymousUser();

    // Afficher un message de confirmation
    if (window.showAlert) {
      window.showAlert('Déconnexion réussie', 'success');
    }

    // Optionnel : rediriger vers la page de connexion après un délai
    // setTimeout(() => window.location.href = '/html/login.html', 1500);
  }

  // Méthodes publiques pour accéder aux informations utilisateur
  isLoggedIn() {
    return this.user !== null && this.token !== null;
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  getUserLevel() {
    return this.user?.level || 'anonymous';
  }
}

// Initialiser le gestionnaire d'authentification
const authManager = new AuthManager();

// Exporter pour utilisation dans d'autres scripts
window.authManager = authManager;