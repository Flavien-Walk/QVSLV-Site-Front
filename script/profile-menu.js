/**
 * MENU PROFIL AMÉLIORÉ - QVSLV
 * Gestionnaire pour le menu déroulant du profil utilisateur
 */

class ProfileMenuManager {
    constructor() {
        this.userProfileBtn = document.getElementById('userProfileBtn');
        this.userMenu = document.getElementById('userMenu');
        this.menuOverlay = document.getElementById('menuOverlay');
        this.isMenuOpen = false;
        this.currentUser = null;
        
        // Vérifier que les éléments existent
        if (!this.userProfileBtn || !this.userMenu) {
            console.warn('⚠️ Éléments du menu profil non trouvés');
            return;
        }
        
        this.initEventListeners();
        console.log('✅ ProfileMenuManager initialisé');
    }

    /**
     * Initialiser tous les event listeners
     */
    initEventListeners() {
        // Ouvrir/fermer le menu en cliquant sur le bouton profil
        this.userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Fermer le menu en cliquant sur l'overlay (si il existe)
        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }

        // Fermer le menu en cliquant ailleurs
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.userMenu.contains(e.target) && 
                !this.userProfileBtn.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Fermer le menu avec la touche Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Empêcher la fermeture en cliquant dans le menu
        this.userMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Actions du menu
        this.initMenuActions();
    }

    /**
     * Initialiser les actions du menu
     */
    initMenuActions() {
        const actions = [
            { id: 'profileAction', name: 'Profil', url: '/html/profile.html' },
            { id: 'settingsAction', name: 'Paramètres', url: '/html/settings.html' },
            { id: 'bookmarksAction', name: 'Signets', url: '/html/bookmarks.html' },
            { id: 'activityAction', name: 'Activité', url: '/html/activity.html' },
            { id: 'securityAction', name: 'Sécurité', url: '/html/security.html' }
        ];

        actions.forEach(action => {
            const element = document.getElementById(action.id);
            if (element) {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleMenuAction(action.name, action.url);
                });
            }
        });

        // Action spéciale pour la déconnexion
        const logoutAction = document.getElementById('logoutAction');
        if (logoutAction) {
            logoutAction.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
    }

    /**
     * Basculer l'état du menu (ouvrir/fermer)
     */
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    /**
     * Ouvrir le menu avec positionnement intelligent
     */
    openMenu() {
        console.log('📋 Ouverture du menu profil');
        
        // Calculer la position optimale du menu
        const position = this.calculateMenuPosition();
        
        // Appliquer la position
        this.userMenu.style.left = `${position.left}px`;
        this.userMenu.style.top = `${position.top}px`;

        // Ajuster la position de la flèche
        this.adjustArrowPosition(position);

        // Afficher le menu avec animations
        if (this.menuOverlay) {
            this.menuOverlay.classList.add('show');
        }
        
        this.userMenu.classList.add('show');
        this.userProfileBtn.classList.add('active');
        this.isMenuOpen = true;

        // Mettre à jour les informations utilisateur
        this.updateMenuUserInfo();

        // Focus sur le premier élément du menu pour l'accessibilité
        setTimeout(() => {
            const firstAction = this.userMenu.querySelector('.menu-action');
            if (firstAction) {
                firstAction.focus();
            }
        }, 300);
    }

    /**
     * Fermer le menu
     */
    closeMenu() {
        console.log('📋 Fermeture du menu profil');
        
        if (this.menuOverlay) {
            this.menuOverlay.classList.remove('show');
        }
        
        this.userMenu.classList.remove('show');
        this.userProfileBtn.classList.remove('active');
        this.isMenuOpen = false;

        // Remettre le focus sur le bouton profil
        this.userProfileBtn.focus();
    }

    /**
     * Calculer la position optimale du menu
     */
    calculateMenuPosition() {
        const btnRect = this.userProfileBtn.getBoundingClientRect();
        const menuWidth = 280;
        const menuHeight = 400; // Estimation
        const padding = 10;
        const arrowHeight = 10;

        let left, top;

        // Position horizontale - Aligné à droite du bouton par défaut
        left = btnRect.right - menuWidth;
        
        // Vérifier les débordements horizontaux
        if (left < padding) {
            // Si déborde à gauche, aligner à gauche du bouton
            left = btnRect.left;
        }
        
        if (left + menuWidth > window.innerWidth - padding) {
            // Si déborde à droite, positionner au maximum possible
            left = window.innerWidth - menuWidth - padding;
        }

        // Position verticale - Sous le bouton par défaut
        top = btnRect.bottom + arrowHeight;
        
        // Vérifier si le menu dépasse en bas
        if (top + menuHeight > window.innerHeight - padding) {
            // Positionner au-dessus du bouton
            top = btnRect.top - menuHeight - arrowHeight;
            
            // Si ça dépasse encore en haut, centrer verticalement
            if (top < padding) {
                top = Math.max(padding, (window.innerHeight - menuHeight) / 2);
            }
        }

        return {
            left: Math.max(padding, left),
            top: Math.max(padding, top),
            isAbove: top < btnRect.top
        };
    }

    /**
     * Ajuster la position de la flèche du menu
     */
    adjustArrowPosition(position) {
        const btnRect = this.userProfileBtn.getBoundingClientRect();
        const menuWidth = 280;
        
        // Calculer la position de la flèche par rapport au bouton
        const buttonCenter = btnRect.left + (btnRect.width / 2);
        const menuLeft = position.left;
        const arrowPosition = buttonCenter - menuLeft;
        
        // Limiter la position de la flèche dans les bornes du menu
        const clampedPosition = Math.max(20, Math.min(arrowPosition, menuWidth - 40));
        
        // Appliquer la position via une variable CSS personnalisée
        this.userMenu.style.setProperty('--arrow-position', `${clampedPosition}px`);
        
        // Modifier la position de la flèche via le pseudo-élément
        const style = document.createElement('style');
        style.textContent = `
            .user-menu::after {
                right: ${menuWidth - clampedPosition - 10}px !important;
            }
        `;
        
        // Supprimer l'ancien style si il existe
        const oldStyle = document.getElementById('menu-arrow-style');
        if (oldStyle) {
            oldStyle.remove();
        }
        
        style.id = 'menu-arrow-style';
        document.head.appendChild(style);
    }

    /**
     * Mettre à jour les informations utilisateur dans le menu
     */
    updateMenuUserInfo() {
        // Récupérer les informations depuis le bouton ou les variables globales
        const userName = this.userProfileBtn.querySelector('.user-name-small')?.textContent || 
                        window.currentUser?.username || 
                        'Agent';
        
        const userRole = window.currentUser?.role || 'VÉRIFIÉ';

        // Mettre à jour les éléments du menu
        const menuUserName = document.getElementById('userName');
        const menuUserRole = document.getElementById('userRole');
        
        if (menuUserName) {
            menuUserName.textContent = userName;
        }
        
        if (menuUserRole) {
            menuUserRole.textContent = userRole;
        }
    }

    /**
     * Gérer les actions du menu
     */
    handleMenuAction(actionName, url) {
        console.log(`🔄 Action sélectionnée: ${actionName}`);
        
        this.showNotification(`Redirection vers ${actionName}...`, 'info');
        this.closeMenu();
        
        // Vérifier si la page existe avant de rediriger
        this.checkPageExists(url).then(exists => {
            if (exists) {
                setTimeout(() => {
                    window.location.href = url;
                }, 500);
            } else {
                this.showNotification(`Page ${actionName} en cours de développement`, 'warning');
            }
        }).catch(() => {
            this.showNotification(`Page ${actionName} temporairement indisponible`, 'error');
        });
    }

    /**
     * Gérer la déconnexion
     */
    handleLogout() {
        console.log('🚪 Déconnexion demandée');
        
        this.showNotification('Déconnexion en cours...', 'warning');
        this.closeMenu();
        
        // Appeler la fonction de déconnexion globale si elle existe
        if (typeof window.logout === 'function') {
            setTimeout(() => {
                window.logout();
            }, 1000);
        } else if (typeof window.authManager?.logout === 'function') {
            setTimeout(() => {
                window.authManager.logout();
            }, 1000);
        } else {
            // Simulation de déconnexion
            setTimeout(() => {
                this.showNotification('Déconnexion réussie', 'success');
                // Redirection vers la page de connexion
                setTimeout(() => {
                    window.location.href = '/html/login.html';
                }, 1000);
            }, 1500);
        }
    }

    /**
     * Vérifier si une page existe
     */
    async checkPageExists(url) {
        try {
            // En production, vous pourriez faire une vraie vérification HTTP
            // Pour la démo, on simule que certaines pages existent
            const existingPages = [
                '/html/profile.html',
                '/html/login.html',
                '/html/register.html'
            ];
            
            // Simulation d'une vérification asynchrone
            await new Promise(resolve => setTimeout(resolve, 100));
            
            return existingPages.includes(url);
        } catch (error) {
            console.error('Erreur lors de la vérification de la page:', error);
            return false;
        }
    }

    /**
     * Afficher une notification
     */
    showNotification(message, type = 'info', duration = 3000) {
        console.log(`🔔 Notification: ${message} (${type})`);
        
        // Utiliser le système de notification global s'il existe
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
            return;
        }
        
        // Créer notre propre notification
        const notification = document.createElement('div');
        notification.className = `profile-menu-notification notification-${type}`;
        
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
        
        document.body.appendChild(notification);
        
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
        }, duration);
    }

    /**
     * Mettre à jour les informations utilisateur
     */
    updateUser(userData) {
        this.currentUser = userData;
        console.log('👤 Mise à jour des données utilisateur:', userData);
        
        // Mettre à jour le bouton profil
        const userNameElement = this.userProfileBtn.querySelector('.user-name-small');
        if (userNameElement && userData.username) {
            userNameElement.textContent = userData.username;
        }
        
        // Mettre à jour les informations dans le menu si il est ouvert
        if (this.isMenuOpen) {
            this.updateMenuUserInfo();
        }
    }

    /**
     * Activer/désactiver le menu
     */
    setEnabled(enabled) {
        if (enabled) {
            this.userProfileBtn.style.pointerEvents = 'auto';
            this.userProfileBtn.style.opacity = '1';
        } else {
            this.userProfileBtn.style.pointerEvents = 'none';
            this.userProfileBtn.style.opacity = '0.5';
            this.closeMenu();
        }
    }

    /**
     * Redimensionnement de la fenêtre
     */
    handleResize() {
        if (this.isMenuOpen) {
            // Recalculer la position du menu lors du redimensionnement
            const position = this.calculateMenuPosition();
            this.userMenu.style.left = `${position.left}px`;
            this.userMenu.style.top = `${position.top}px`;
            this.adjustArrowPosition(position);
        }
    }

    /**
     * Détruire l'instance (cleanup)
     */
    destroy() {
        // Fermer le menu s'il est ouvert
        this.closeMenu();
        
        // Supprimer les event listeners
        // Note: Dans un vrai projet, il faudrait stocker les références aux fonctions
        // pour pouvoir les supprimer proprement
        
        console.log('🗑️ ProfileMenuManager détruit');
    }
}

/**
 * FONCTIONS UTILITAIRES
 */

/**
 * Initialiser le gestionnaire de menu profil
 */
function initProfileMenu() {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.profileMenuManager = new ProfileMenuManager();
        });
    } else {
        window.profileMenuManager = new ProfileMenuManager();
    }
}

/**
 * Intégration avec le système d'authentification existant
 */
function integrateWithAuthSystem() {
    // Écouter les changements d'état d'authentification
    document.addEventListener('userLogin', (event) => {
        if (window.profileMenuManager) {
            window.profileMenuManager.updateUser(event.detail.user);
            window.profileMenuManager.setEnabled(true);
        }
    });
    
    document.addEventListener('userLogout', () => {
        if (window.profileMenuManager) {
            window.profileMenuManager.setEnabled(false);
        }
    });
}

/**
 * Gestion du redimensionnement
 */
function handleWindowResize() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.profileMenuManager) {
                window.profileMenuManager.handleResize();
            }
        }, 100);
    });
}

/**
 * INITIALISATION AUTOMATIQUE
 */
(function() {
    'use strict';
    
    // Initialiser le menu profil
    initProfileMenu();
    
    // Intégrer avec le système d'auth
    integrateWithAuthSystem();
    
    // Gérer le redimensionnement
    handleWindowResize();
    
    console.log('🚀 Module ProfileMenu initialisé');
})();

/**
 * EXPORT POUR UTILISATION EXTERNE
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfileMenuManager;
}
