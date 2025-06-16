// auth-manager.js - Gestionnaire d'authentification pour la page d'accueil

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        // Vérifier si l'utilisateur est connecté au chargement de la page
        this.checkAuthStatus();
        
        // Ajouter les event listeners
        this.addEventListeners();
        
        // Vérifier périodiquement le statut d'authentification
        setInterval(() => this.checkAuthStatus(), 30000); // Vérification toutes les 30 secondes
    }

    addEventListeners() {
        // Event listener pour le bouton profil
        const userProfileBtn = document.getElementById('userProfileBtn');
        if (userProfileBtn) {
            userProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleUserMenu();
            });
        }

        // Event listener pour la déconnexion
        const logoutAction = document.getElementById('logoutAction');
        if (logoutAction) {
            logoutAction.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Event listener pour fermer le menu avec l'overlay
        const menuOverlay = document.getElementById('menuOverlay');
        if (menuOverlay) {
            menuOverlay.addEventListener('click', () => {
                this.closeUserMenu();
            });
        }

        // Fermer le menu avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeUserMenu();
            }
        });

        // Fermer le menu en cliquant ailleurs
        document.addEventListener('click', (e) => {
            const userMenu = document.getElementById('userMenu');
            const userProfileBtn = document.getElementById('userProfileBtn');
            
            if (userMenu && userProfileBtn && 
                !userMenu.contains(e.target) && 
                !userProfileBtn.contains(e.target)) {
                this.closeUserMenu();
            }
        });
    }

    checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                
                // Vérifier si le token n'est pas expiré
                if (this.isTokenValid(token)) {
                    this.currentUser = user;
                    this.isLoggedIn = true;
                    this.updateUIForLoggedInUser(user);
                } else {
                    // Token expiré, déconnecter l'utilisateur
                    this.logout();
                }
            } catch (error) {
                console.error('Erreur lors de la lecture des données utilisateur:', error);
                this.logout();
            }
        } else {
            this.isLoggedIn = false;
            this.updateUIForAnonymousUser();
        }
    }

    isTokenValid(token) {
        try {
            // Décoder le JWT pour vérifier la date d'expiration
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch (error) {
            return false;
        }
    }

    updateUIForLoggedInUser(user) {
        // Masquer le bouton de connexion
        const loginLink = document.getElementById('loginLink');
        if (loginLink) {
            loginLink.style.display = 'none';
        }

        // Afficher le bouton profil
        const userProfileBtn = document.getElementById('userProfileBtn');
        if (userProfileBtn) {
            userProfileBtn.style.display = 'flex';
            userProfileBtn.classList.add('fade-in');
        }

        // Mettre à jour le niveau d'accès
        this.updateAccessLevel(user.role);

        // Mettre à jour les informations du profil
        this.updateProfileInfo(user);

        // Afficher le message de bienvenue
        this.showWelcomeMessage(user);

        // Afficher le bloc profil dans la sidebar
        this.showUserProfileBlock(user);

        // Activer la shoutbox
        this.enableShoutbox();

        // Afficher une notification de connexion
        this.showNotification('Connexion réussie !', 'success');
    }

    updateUIForAnonymousUser() {
        // Afficher le bouton de connexion
        const loginLink = document.getElementById('loginLink');
        if (loginLink) {
            loginLink.style.display = 'flex';
        }

        // Masquer le bouton profil
        const userProfileBtn = document.getElementById('userProfileBtn');
        if (userProfileBtn) {
            userProfileBtn.style.display = 'none';
        }

        // Réinitialiser le niveau d'accès
        this.updateAccessLevel('ANONYME');

        // Masquer le message de bienvenue
        this.hideWelcomeMessage();

        // Masquer le bloc profil dans la sidebar
        this.hideUserProfileBlock();

        // Désactiver la shoutbox
        this.disableShoutbox();
    }

    updateAccessLevel(role) {
        const levelBadge = document.getElementById('levelBadge');
        if (levelBadge) {
            levelBadge.textContent = role;
            levelBadge.className = `level-badge ${role.toLowerCase()}`;
        }
    }

    updateProfileInfo(user) {
        // Mettre à jour l'avatar et le nom dans le bouton profil
        const userAvatarSmall = document.getElementById('userAvatarSmall');
        const userNameSmall = document.getElementById('userNameSmall');
        
        if (userAvatarSmall) {
            userAvatarSmall.textContent = user.username.charAt(0).toUpperCase();
        }
        
        if (userNameSmall) {
            userNameSmall.textContent = user.username;
        }

        // Mettre à jour le menu profil
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        
        if (userName) {
            userName.textContent = user.username;
        }
        
        if (userRole) {
            userRole.textContent = user.role;
        }
    }

    showWelcomeMessage(user) {
        const welcomeMessage = document.getElementById('welcomeMessage');
        const welcomeUsername = document.getElementById('welcomeUsername');
        const welcomeLevel = document.getElementById('welcomeLevel');
        const lastLogin = document.getElementById('lastLogin');

        if (welcomeMessage) {
            if (welcomeUsername) {
                welcomeUsername.textContent = user.username;
            }
            
            if (welcomeLevel) {
                welcomeLevel.textContent = user.role;
            }
            
            if (lastLogin && user.lastLogin) {
                const loginDate = new Date(user.lastLogin);
                lastLogin.textContent = loginDate.toLocaleDateString('fr-FR') + ' à ' + 
                                       loginDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            }

            welcomeMessage.style.display = 'block';
            welcomeMessage.classList.add('show');
        }
    }

    hideWelcomeMessage() {
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
            welcomeMessage.classList.remove('show');
        }
    }

    showUserProfileBlock(user) {
        const userProfileBlock = document.getElementById('userProfileBlock');
        const profileName = document.getElementById('profileName');
        const profileRole = document.getElementById('profileRole');
        const profileSpecialty = document.getElementById('profileSpecialty');

        if (userProfileBlock) {
            if (profileName) {
                profileName.textContent = user.username;
            }
            
            if (profileRole) {
                profileRole.textContent = user.role;
            }
            
            if (profileSpecialty && user.specialization) {
                const specializations = {
                    'archives': 'Archiviste',
                    'ancient': 'Civilisations Anciennes',
                    'social': 'Ingénierie Sociale',
                    'tech': 'Technologies',
                    'consciousness': 'Physique & Conscience',
                    'symbols': 'Symbolisme',
                    'crypto': 'Cryptographie',
                    'research': 'Recherche'
                };
                profileSpecialty.textContent = specializations[user.specialization] || user.specialization;
            }

            userProfileBlock.style.display = 'block';
            userProfileBlock.classList.add('fade-in');
        }
    }

    hideUserProfileBlock() {
        const userProfileBlock = document.getElementById('userProfileBlock');
        if (userProfileBlock) {
            userProfileBlock.style.display = 'none';
            userProfileBlock.classList.remove('fade-in');
        }
    }

    enableShoutbox() {
        const messageInput = document.getElementById('messageInput');
        const emojiButton = document.getElementById('emojiButton');
        const sendButton = document.getElementById('sendButton');

        if (messageInput) {
            messageInput.disabled = false;
            messageInput.placeholder = 'Tapez votre message...';
        }
        
        if (emojiButton) {
            emojiButton.disabled = false;
        }
        
        if (sendButton) {
            sendButton.disabled = false;
        }
    }

    disableShoutbox() {
        const messageInput = document.getElementById('messageInput');
        const emojiButton = document.getElementById('emojiButton');
        const sendButton = document.getElementById('sendButton');

        if (messageInput) {
            messageInput.disabled = true;
            messageInput.placeholder = 'Connectez-vous pour participer...';
        }
        
        if (emojiButton) {
            emojiButton.disabled = true;
        }
        
        if (sendButton) {
            sendButton.disabled = true;
        }
    }

    toggleUserMenu() {
        const userMenu = document.getElementById('userMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const userProfileBtn = document.getElementById('userProfileBtn');

        if (userMenu && menuOverlay && userProfileBtn) {
            const isMenuOpen = userMenu.classList.contains('show');
            
            if (isMenuOpen) {
                this.closeUserMenu();
            } else {
                this.openUserMenu();
            }
        }
    }

    openUserMenu() {
        const userMenu = document.getElementById('userMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const userProfileBtn = document.getElementById('userProfileBtn');

        if (userMenu && menuOverlay && userProfileBtn) {
            // Positionner le menu par rapport au bouton
            const btnRect = userProfileBtn.getBoundingClientRect();
            userMenu.style.top = (btnRect.bottom + 10) + 'px';
            userMenu.style.left = (btnRect.left) + 'px';

            // Afficher le menu et l'overlay
            userMenu.classList.add('show');
            menuOverlay.classList.add('show');
            
            // Ajouter la classe d'état ouvert au bouton
            userProfileBtn.classList.add('menu-open');
        }
    }

    closeUserMenu() {
        const userMenu = document.getElementById('userMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const userProfileBtn = document.getElementById('userProfileBtn');

        if (userMenu && menuOverlay && userProfileBtn) {
            userMenu.classList.remove('show');
            menuOverlay.classList.remove('show');
            userProfileBtn.classList.remove('menu-open');
        }
    }

    logout() {
        // Afficher une notification de déconnexion
        this.showNotification('Déconnexion en cours...', 'info');

        // Supprimer les données d'authentification
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');

        // Réinitialiser l'état
        this.currentUser = null;
        this.isLoggedIn = false;

        // Fermer le menu utilisateur
        this.closeUserMenu();

        // Mettre à jour l'interface
        this.updateUIForAnonymousUser();

        // Afficher une notification de confirmation
        setTimeout(() => {
            this.showNotification('Déconnexion réussie', 'success');
        }, 500);
    }

    showNotification(message, type = 'info') {
        const notificationContainer = document.getElementById('notificationContainer');
        if (!notificationContainer) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notification.innerHTML = `
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-message">${message}</span>
        `;

        notificationContainer.appendChild(notification);

        // Afficher la notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Supprimer la notification après 3 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 500);
        }, 3000);
    }
}

// Initialiser le gestionnaire d'authentification quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

// Écouter les changements de localStorage (pour la synchronisation entre onglets)
window.addEventListener('storage', (e) => {
    if (e.key === 'authToken' || e.key === 'userData') {
        if (window.authManager) {
            window.authManager.checkAuthStatus();
        }
    }
});

// Fonction globale pour déclencher la connexion (utilisable depuis d'autres scripts)
window.onUserLogin = function(userData, token) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    if (window.authManager) {
        window.authManager.checkAuthStatus();
    }
};

// auth-manager.js - Gestionnaire d'authentification simplifié

class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.addEventListeners();
        
        // Écouter les changements de localStorage
        window.addEventListener('storage', () => this.checkAuthStatus());
        
        // Vérifier périodiquement
        setInterval(() => this.checkAuthStatus(), 5000);
    }

    checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                if (this.isTokenValid(token)) {
                    this.showLoggedInState(user);
                } else {
                    this.logout();
                }
            } catch (error) {
                this.logout();
            }
        } else {
            this.showLoggedOutState();
        }
    }

    isTokenValid(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > (Date.now() / 1000);
        } catch {
            return false;
        }
    }

    showLoggedInState(user) {
        // Masquer bouton connexion
        const loginLink = document.getElementById('loginLink');
        if (loginLink) loginLink.style.display = 'none';

        // Afficher bouton profil
        const userProfileBtn = document.getElementById('userProfileBtn');
        if (userProfileBtn) {
            userProfileBtn.style.display = 'flex';
            
            // Mettre à jour les infos
            const avatar = document.getElementById('userAvatarSmall');
            const name = document.getElementById('userNameSmall');
            if (avatar) avatar.textContent = user.username.charAt(0).toUpperCase();
            if (name) name.textContent = user.username;
        }

        // Mettre à jour niveau d'accès
        const levelBadge = document.getElementById('levelBadge');
        if (levelBadge) {
            levelBadge.textContent = user.role;
            levelBadge.className = `level-badge ${user.role.toLowerCase()}`;
        }

        // Afficher message de bienvenue
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'block';
            const username = document.getElementById('welcomeUsername');
            const level = document.getElementById('welcomeLevel');
            if (username) username.textContent = user.username;
            if (level) level.textContent = user.role;
        }

        // Afficher profil sidebar
        const profileBlock = document.getElementById('userProfileBlock');
        if (profileBlock) {
            profileBlock.style.display = 'block';
            const profileName = document.getElementById('profileName');
            const profileRole = document.getElementById('profileRole');
            if (profileName) profileName.textContent = user.username;
            if (profileRole) profileRole.textContent = user.role;
        }

        // Activer shoutbox
        const messageInput = document.getElementById('messageInput');
        const emojiButton = document.getElementById('emojiButton');
        const sendButton = document.getElementById('sendButton');
        if (messageInput) {
            messageInput.disabled = false;
            messageInput.placeholder = 'Tapez votre message...';
        }
        if (emojiButton) emojiButton.disabled = false;
        if (sendButton) sendButton.disabled = false;

        // Mettre à jour menu utilisateur
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        if (userName) userName.textContent = user.username;
        if (userRole) userRole.textContent = user.role;
    }

    showLoggedOutState() {
        // Afficher bouton connexion
        const loginLink = document.getElementById('loginLink');
        if (loginLink) loginLink.style.display = 'flex';

        // Masquer bouton profil
        const userProfileBtn = document.getElementById('userProfileBtn');
        if (userProfileBtn) userProfileBtn.style.display = 'none';

        // Réinitialiser niveau d'accès
        const levelBadge = document.getElementById('levelBadge');
        if (levelBadge) {
            levelBadge.textContent = 'ANONYME';
            levelBadge.className = 'level-badge anonymous';
        }

        // Masquer message de bienvenue
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) welcomeMessage.style.display = 'none';

        // Masquer profil sidebar
        const profileBlock = document.getElementById('userProfileBlock');
        if (profileBlock) profileBlock.style.display = 'none';

        // Désactiver shoutbox
        const messageInput = document.getElementById('messageInput');
        const emojiButton = document.getElementById('emojiButton');
        const sendButton = document.getElementById('sendButton');
        if (messageInput) {
            messageInput.disabled = true;
            messageInput.placeholder = 'Connectez-vous pour participer...';
        }
        if (emojiButton) emojiButton.disabled = true;
        if (sendButton) sendButton.disabled = true;

        this.closeUserMenu();
    }

    addEventListeners() {
        // Clic sur bouton profil
        const userProfileBtn = document.getElementById('userProfileBtn');
        if (userProfileBtn) {
            userProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleUserMenu();
            });
        }

        // Clic sur déconnexion
        const logoutAction = document.getElementById('logoutAction');
        if (logoutAction) {
            logoutAction.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Fermer menu avec overlay
        const menuOverlay = document.getElementById('menuOverlay');
        if (menuOverlay) {
            menuOverlay.addEventListener('click', () => this.closeUserMenu());
        }

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeUserMenu();
        });

        // Fermer en cliquant ailleurs
        document.addEventListener('click', (e) => {
            const userMenu = document.getElementById('userMenu');
            const userProfileBtn = document.getElementById('userProfileBtn');
            
            if (userMenu && userProfileBtn && 
                !userMenu.contains(e.target) && 
                !userProfileBtn.contains(e.target)) {
                this.closeUserMenu();
            }
        });
    }

    toggleUserMenu() {
        const userMenu = document.getElementById('userMenu');
        const isOpen = userMenu && userMenu.classList.contains('show');
        
        if (isOpen) {
            this.closeUserMenu();
        } else {
            this.openUserMenu();
        }
    }

    openUserMenu() {
        const userMenu = document.getElementById('userMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const userProfileBtn = document.getElementById('userProfileBtn');

        if (userMenu && menuOverlay && userProfileBtn) {
            const btnRect = userProfileBtn.getBoundingClientRect();
            userMenu.style.top = (btnRect.bottom + 10) + 'px';
            userMenu.style.left = (btnRect.left) + 'px';

            userMenu.classList.add('show');
            menuOverlay.classList.add('show');
        }
    }

    closeUserMenu() {
        const userMenu = document.getElementById('userMenu');
        const menuOverlay = document.getElementById('menuOverlay');

        if (userMenu) userMenu.classList.remove('show');
        if (menuOverlay) menuOverlay.classList.remove('show');
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        this.closeUserMenu();
        this.showLoggedOutState();
        this.showNotification('Déconnexion réussie', 'success');
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        notification.innerHTML = `
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-message">${message}</span>
        `;

        container.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => container.removeChild(notification), 500);
        }, 3000);
    }
}

// Initialiser
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

// Fonction globale pour connexion
window.onUserLogin = function(userData, token) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    if (window.authManager) window.authManager.checkAuthStatus();
};