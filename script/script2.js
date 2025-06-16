/**
 * SCRIPT PRINCIPAL QVSLV
 * Gestionnaire d'authentification et fonctionnalités principales
 */

// Configuration API
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://qvslv-site.onrender.com/api';

console.log('🌐 API Base URL:', API_BASE_URL);

// Variables globales pour l'authentification
let currentUser = null;
let authToken = null;

/**
 * GESTIONNAIRE D'AUTHENTIFICATION
 */
class AuthManager {
    constructor() {
        this.checkAuthStatus();
        this.initAuthEventListeners();
    }

    /**
     * Vérifier le statut d'authentification
     */
    async checkAuthStatus() {
        console.log('🔍 Vérification du statut d\'authentification...');
        
        // Vérifier le token stocké
        authToken = localStorage.getItem('qvslv_token') || sessionStorage.getItem('qvslv_token');
        
        if (authToken) {
            console.log('🎫 Token trouvé, vérification auprès du serveur...');
            try {
                const response = await fetch(`${API_BASE_URL}/auth/verify`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    currentUser = data.user;
                    console.log('✅ Utilisateur authentifié:', currentUser.username);
                    this.updateUI(true);
                    this.showSystemMessage(`Agent ${currentUser.username} connecté au réseau`);
                } else {
                    console.log('❌ Token invalide, nettoyage...');
                    this.logout();
                }
            } catch (error) {
                console.error('❌ Erreur vérification auth:', error);
                this.logout();
            }
        } else {
            console.log('👤 Aucun token trouvé, utilisateur anonyme');
            this.updateUI(false);
        }
    }

    /**
     * Mettre à jour l'interface utilisateur
     */
    updateUI(isAuthenticated) {
        console.log('🎨 Mise à jour de l\'interface, connecté:', isAuthenticated);
        
        const authSection = document.getElementById('authSection');
        const levelBadge = document.getElementById('levelBadge');
        const messageInput = document.getElementById('messageInput');
        const emojiButton = document.getElementById('emojiButton');
        const sendButton = document.getElementById('sendButton');
        const welcomeMessage = document.getElementById('welcomeMessage');
        const userProfileBlock = document.getElementById('userProfileBlock');

        if (isAuthenticated && currentUser) {
            console.log('🔄 Configuration interface utilisateur connecté');
            
            // Utilisateur connecté - BOUTON PROFIL
            authSection.innerHTML = `
                <div class="user-profile-btn" id="userProfileBtn">
                    <span class="user-avatar-small">👤</span>
                    <span class="user-name-small">${currentUser.username}</span>
                    <span class="dropdown-arrow">▼</span>
                </div>
            `;

            // Mettre à jour le niveau d'accès
            levelBadge.textContent = currentUser.role || 'VÉRIFIÉ';
            levelBadge.className = `level-badge ${(currentUser.role || 'verified').toLowerCase()}`;

            // Afficher le message de bienvenue
            if (welcomeMessage) {
                document.getElementById('welcomeUsername').textContent = currentUser.username;
                document.getElementById('welcomeLevel').textContent = currentUser.role || 'VÉRIFIÉ';
                if (currentUser.lastLogin) {
                    const lastLoginDate = new Date(currentUser.lastLogin);
                    document.getElementById('lastLogin').textContent = lastLoginDate.toLocaleString('fr-FR');
                }
                welcomeMessage.style.display = 'block';
            }

            // Afficher le profil utilisateur dans la sidebar
            if (userProfileBlock) {
                document.getElementById('profileName').textContent = currentUser.username;
                document.getElementById('profileRole').textContent = currentUser.role || 'VÉRIFIÉ';
                document.getElementById('profileSpecialty').textContent = this.getSpecializationName(currentUser.specialization);
                userProfileBlock.style.display = 'block';
            }

            // Activer la shoutbox
            if (messageInput) {
                messageInput.placeholder = `Tapez votre message, ${currentUser.username}...`;
                messageInput.disabled = false;
            }
            if (emojiButton) emojiButton.disabled = false;
            if (sendButton) sendButton.disabled = false;

            // Ajouter l'utilisateur à la liste des membres en ligne
            this.addUserToOnlineList();

            // Intégration avec le ProfileMenuManager
            setTimeout(() => {
                if (window.profileMenuManager) {
                    window.profileMenuManager.updateUser(currentUser);
                    window.profileMenuManager.setEnabled(true);
                }
            }, 100);

        } else {
            console.log('🔄 Configuration interface utilisateur anonyme');
            
            // Utilisateur non connecté - BOUTON CONNEXION
            authSection.innerHTML = `
                <a href="/html/login.html" class="nav-link login-btn">Connexion</a>
            `;

            levelBadge.textContent = 'ANONYME';
            levelBadge.className = 'level-badge anonymous';

            // Masquer le message de bienvenue et le profil
            if (welcomeMessage) welcomeMessage.style.display = 'none';
            if (userProfileBlock) userProfileBlock.style.display = 'none';

            // Désactiver la shoutbox
            if (messageInput) {
                messageInput.placeholder = 'Connectez-vous pour participer...';
                messageInput.disabled = true;
            }
            if (emojiButton) emojiButton.disabled = true;
            if (sendButton) sendButton.disabled = true;

            // Désactiver le ProfileMenuManager
            if (window.profileMenuManager) {
                window.profileMenuManager.setEnabled(false);
            }
        }
    }

    /**
     * Obtenir le nom de spécialisation
     */
    getSpecializationName(specialization) {
        const specializations = {
            'archives': 'Archives & Documentation',
            'ancient': 'Civilisations Anciennes',
            'social': 'Ingénierie Sociale',
            'tech': 'Technologies Oubliées',
            'consciousness': 'Physique & Conscience',
            'symbols': 'Symbolisme & Langage',
            'crypto': 'Cryptomonnaies',
            'research': 'Recherche Générale'
        };
        return specializations[specialization] || 'Non spécifié';
    }

    /**
     * Ajouter l'utilisateur à la liste en ligne
     */
    addUserToOnlineList() {
        if (!currentUser) return;

        const onlineMembers = document.getElementById('onlineMembers');
        if (!onlineMembers) return;

        // Vérifier si l'utilisateur n'est pas déjà dans la liste
        const existingMember = onlineMembers.querySelector(`[data-username="${currentUser.username}"]`);
        if (existingMember) return;

        console.log('👥 Ajout de l\'utilisateur à la liste en ligne');
        const memberElement = document.createElement('div');
        memberElement.className = `member ${(currentUser.role || 'verified').toLowerCase()}`;
        memberElement.setAttribute('data-username', currentUser.username);
        memberElement.innerHTML = `
            <span class="status-dot"></span>
            <span class="member-name">${currentUser.username}</span>
            <span class="member-badge">${(currentUser.role || 'VÉRIFIÉ').toUpperCase()}</span>
        `;

        // Insérer en première position
        onlineMembers.insertBefore(memberElement, onlineMembers.firstChild);

        // Mettre à jour le compteur
        this.updateOnlineCount();
    }

    /**
     * Mettre à jour le compteur en ligne
     */
    updateOnlineCount() {
        const onlineCount = document.getElementById('onlineCount');
        const members = document.querySelectorAll('#onlineMembers .member');
        if (onlineCount) {
            onlineCount.textContent = `${members.length} connectés`;
        }
    }

    /**
     * Afficher un message système
     */
    showSystemMessage(message) {
        console.log('💬 Message système:', message);
        const systemMessage = document.getElementById('systemMessage');
        const systemTime = document.getElementById('systemTime');
        const systemText = document.getElementById('systemText');

        if (systemMessage && systemTime && systemText) {
            const now = new Date();
            systemTime.textContent = now.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            systemText.textContent = message;
            systemMessage.style.display = 'block';

            // Faire défiler vers le bas
            const messagesContainer = document.getElementById('messagesContainer');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            // Masquer après 5 secondes
            setTimeout(() => {
                systemMessage.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Initialiser les event listeners d'authentification
     */
    initAuthEventListeners() {
        console.log('🎧 Initialisation des event listeners d\'authentification');
        
        // Gestion de la shoutbox
        this.initShoutboxListeners();

        // Émission d'événements pour l'intégration avec d'autres modules
        if (currentUser) {
            document.dispatchEvent(new CustomEvent('userLogin', { 
                detail: { user: currentUser } 
            }));
        }
    }

    /**
     * Initialiser les listeners de la shoutbox
     */
    initShoutboxListeners() {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const emojiButton = document.getElementById('emojiButton');
        const emojiPicker = document.getElementById('emojiPicker');

        // Envoyer message avec Entrée
        messageInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !messageInput.disabled) {
                this.sendMessage();
            }
        });

        // Bouton envoyer
        sendButton?.addEventListener('click', () => {
            if (!sendButton.disabled) {
                this.sendMessage();
            }
        });

        // Bouton emoji
        emojiButton?.addEventListener('click', (e) => {
            if (!emojiButton.disabled) {
                e.stopPropagation();
                const isVisible = emojiPicker.style.display !== 'none';
                emojiPicker.style.display = isVisible ? 'none' : 'block';
                
                if (!isVisible) {
                    const rect = emojiButton.getBoundingClientRect();
                    emojiPicker.style.position = 'fixed';
                    emojiPicker.style.top = (rect.top - emojiPicker.offsetHeight - 5) + 'px';
                    emojiPicker.style.left = rect.left + 'px';
                    emojiPicker.style.zIndex = '10000';
                }
            }
        });

        // Sélection d'emoji
        emojiPicker?.addEventListener('click', (e) => {
            if (e.target.classList.contains('emoji')) {
                const emoji = e.target.getAttribute('data-emoji');
                messageInput.value += emoji;
                emojiPicker.style.display = 'none';
                messageInput.focus();
            }
        });

        // Fermer emoji picker en cliquant ailleurs
        document.addEventListener('click', (e) => {
            if (!emojiButton?.contains(e.target) && !emojiPicker?.contains(e.target)) {
                emojiPicker.style.display = 'none';
            }
        });

        // Minimiser shoutbox
        document.getElementById('minimizeShoutbox')?.addEventListener('click', () => {
            const shoutboxBody = document.getElementById('shoutboxBody');
            const minimizeBtn = document.getElementById('minimizeShoutbox');
            
            if (shoutboxBody.style.display === 'none') {
                shoutboxBody.style.display = 'block';
                minimizeBtn.textContent = '−';
            } else {
                shoutboxBody.style.display = 'none';
                minimizeBtn.textContent = '+';
            }
        });
    }

    /**
     * Envoyer un message dans la shoutbox
     */
    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message || !currentUser) return;

        console.log('💬 Envoi message:', message);

        // Créer l'élément message
        const messagesContainer = document.getElementById('messagesContainer');
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageElement.innerHTML = `
            <span class="message-user ${(currentUser.role || 'verified').toLowerCase()}">${currentUser.username}</span>
            <span class="message-time">${timeString}</span>
            <span class="message-text">${this.escapeHtml(message)}</span>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Vider le champ de saisie
        messageInput.value = '';
    }

    /**
     * Échapper le HTML pour éviter les injections
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    /**
     * Déconnexion
     */
    async logout() {
        console.log('🚪 Déconnexion en cours...');
        
        try {
            if (authToken) {
                await fetch(`${API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
            }
        } catch (error) {
            console.error('❌ Erreur lors de la déconnexion:', error);
        } finally {
            // Supprimer l'utilisateur de la liste en ligne
            if (currentUser) {
                const userElement = document.querySelector(`[data-username="${currentUser.username}"]`);
                if (userElement) {
                    userElement.remove();
                    this.updateOnlineCount();
                }
                this.showSystemMessage(`Agent ${currentUser.username} s'est déconnecté`);
            }

            // Nettoyer le stockage local
            localStorage.removeItem('qvslv_token');
            localStorage.removeItem('qvslv_user');
            sessionStorage.removeItem('qvslv_token');
            sessionStorage.removeItem('qvslv_user');
            
            currentUser = null;
            authToken = null;
            
            console.log('✅ Déconnexion terminée');
            this.updateUI(false);
            this.showNotification('Déconnexion réussie', 'success');

            // Émettre l'événement de déconnexion
            document.dispatchEvent(new CustomEvent('userLogout'));
        }
    }

    /**
     * Afficher une notification
     */
    showNotification(message, type = 'info') {
        console.log('🔔 Notification:', message, type);
        
        // Utiliser le système global de notifications s'il existe
        if (window.profileMenuManager && typeof window.profileMenuManager.showNotification === 'function') {
            window.profileMenuManager.showNotification(message, type);
            return;
        }

        // Système de notification simple par défaut
        const container = document.getElementById('notificationContainer') || document.body;
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--bg-card), #2a1f4d);
            border: 1px solid var(--border-glow);
            border-radius: 12px;
            padding: 15px 20px;
            color: var(--text-light);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            transform: translateX(100%);
            transition: transform 0.5s ease;
            z-index: 10005;
            min-width: 250px;
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        
        notification.innerHTML = `
            <span style="font-size: 1.2rem; flex-shrink: 0;">${icons[type] || icons.info}</span>
            <span style="flex: 1;">${message}</span>
        `;
        
        container.appendChild(notification);
        
        // Animation d'apparition
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Suppression automatique
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }
}

/**
 * SYSTÈME DE PARTICULES
 */
class ParticleSystem {
    constructor() {
        this.initParticles();
    }

    initParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            this.createParticle(particlesContainer, true);
        }

        setInterval(() => {
            this.createParticle(particlesContainer);
        }, 3000);
    }

    createParticle(container, isInitial = false) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * 100 + '%';
        
        if (isInitial) {
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
        } else {
            particle.style.animationDelay = Math.random() * 3 + 's';
        }
        
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        const duration = Math.random() * 8 + 8;
        particle.style.animationDuration = duration + 's';
        
        container.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration * 1000 + 3000);
    }
}

/**
 * FONCTIONNALITÉS DE BASE
 */
function initBasicFeatures() {
    console.log('⚙️ Initialisation des fonctionnalités de base');
    
    // Gestion du thème
    const themeToggle = document.getElementById('themeToggle');
    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    });

    // Boutons de filtre
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Boutons de vue
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const view = btn.getAttribute('data-view');
            const grid = document.querySelector('.categories-grid');
            if (grid) {
                grid.className = `categories-grid ${view}-view`;
            }
        });
    });

    // Recherche globale
    const searchInput = document.getElementById('globalSearch');
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                console.log('🔍 Recherche:', query);
                // Ici vous pourriez implémenter la recherche réelle
                performSearch(query);
            }
        }
    });

    // Cartes de catégories cliquables
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            console.log('📁 Catégorie sélectionnée:', category);
            // Ici vous pourriez rediriger vers la page de catégorie
            navigateToCategory(category);
        });
    });

    // Actions de la barre d'outils
    document.getElementById('randomDocument')?.addEventListener('click', () => {
        console.log('🎲 Document aléatoire sélectionné');
        getRandomDocument();
    });

    document.getElementById('bookmarks')?.addEventListener('click', () => {
        console.log('⭐ Signets affichés');
        showBookmarks();
    });

    document.getElementById('downloadMode')?.addEventListener('click', () => {
        console.log('📥 Mode téléchargement activé');
        toggleDownloadMode();
    });

    // Notifications
    const notificationBtn = document.getElementById('notificationBtn');
    notificationBtn?.addEventListener('click', () => {
        console.log('🔔 Notifications affichées');
        showNotifications();
    });
}

/**
 * FONCTIONS UTILITAIRES
 */

/**
 * Effectuer une recherche
 */
function performSearch(query) {
    // Simulation de recherche
    console.log(`🔍 Recherche en cours pour: "${query}"`);
    
    // Ici vous pourriez intégrer avec votre API de recherche
    // Exemple d'implémentation :
    /*
    fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ query })
    })
    .then(response => response.json())
    .then(results => {
        displaySearchResults(results);
    })
    .catch(error => {
        console.error('Erreur de recherche:', error);
    });
    */
}

/**
 * Naviguer vers une catégorie
 */
function navigateToCategory(category) {
    console.log(`📁 Navigation vers la catégorie: ${category}`);
    // Ici vous pourriez rediriger vers la page correspondante
    // window.location.href = `/categories/${category}`;
}

/**
 * Obtenir un document aléatoire
 */
function getRandomDocument() {
    console.log('🎲 Génération d\'un document aléatoire...');
    // Simulation de sélection aléatoire
    const categories = ['archives', 'ancient', 'social', 'tech', 'consciousness', 'symbols'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    console.log(`📄 Document aléatoire trouvé dans: ${randomCategory}`);
}

/**
 * Afficher les signets
 */
function showBookmarks() {
    console.log('⭐ Affichage des signets...');
    // Ici vous pourriez ouvrir un modal avec les signets de l'utilisateur
}

/**
 * Basculer le mode téléchargement
 */
function toggleDownloadMode() {
    const downloadBtn = document.getElementById('downloadMode');
    const isActive = downloadBtn.classList.contains('active');
    
    if (isActive) {
        downloadBtn.classList.remove('active');
        console.log('📥 Mode téléchargement désactivé');
    } else {
        downloadBtn.classList.add('active');
        console.log('📥 Mode téléchargement activé');
    }
}

/**
 * Afficher les notifications
 */
function showNotifications() {
    console.log('🔔 Affichage du panneau de notifications...');
    // Ici vous pourriez ouvrir un panneau de notifications
}

/**
 * INITIALISATION PRINCIPALE
 */
function initializeApp() {
    console.log('🚀 Initialisation de l\'application QVSLV');
    
    // Initialiser les systèmes principaux
    window.authManager = new AuthManager();
    window.particleSystem = new ParticleSystem();
    
    // Initialiser les fonctionnalités de base
    initBasicFeatures();
    
    // Charger le ProfileMenuManager s'il est disponible
    if (typeof ProfileMenuManager !== 'undefined') {
        window.profileMenuManager = new ProfileMenuManager();
    }
    
    console.log('✅ Application QVSLV initialisée avec succès');
}

/**
 * POINT D'ENTRÉE
 */
document.addEventListener('DOMContentLoaded', initializeApp);

/**
 * EXPORTS POUR UTILISATION EXTERNE
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AuthManager,
        ParticleSystem,
        API_BASE_URL
    };
}

// Exposition globale pour compatibilité
window.QVSLV = {
    AuthManager,
    ParticleSystem,
    currentUser: () => currentUser,
    authToken: () => authToken,
    logout: () => window.authManager?.logout()
};