// QVSLV - Script JavaScript simplifié (particules seulement)
class QVSLVApp {
    constructor() {
        this.init();
    }

    init() {
        this.initParticles();
        
        // Démarrer les animations après chargement
        window.addEventListener('load', () => {
            this.startAnimations();
        });
    }

    // Système de particules amélioré
    initParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 80;

        // Créer les particules initiales
        for (let i = 0; i < particleCount; i++) {
            this.createParticle(particlesContainer, true);
        }

        // Créer une nouvelle particule toutes les 1.5 secondes
        setInterval(() => {
            this.createParticle(particlesContainer);
        }, 1500);
    }

    createParticle(container, isInitial = false) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Position aléatoire
        particle.style.left = Math.random() * 100 + '%';
        
        // Si c'est une particule initiale, commencer à une position aléatoire
        if (isInitial) {
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
        } else {
            particle.style.animationDelay = Math.random() * 2 + 's';
        }
        
        // Variations de taille et de vitesse
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Durée d'animation variable
        const duration = Math.random() * 6 + 6;
        particle.style.animationDuration = duration + 's';
        
        container.appendChild(particle);

        // Supprimer la particule après l'animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration * 1000 + 2000);
    }

    // Animations de démarrage
    startAnimations() {
        this.animateStats();
        this.animateCards();
        this.animateFrameElements();
        this.animateOnlineMembers();
    }

    animateFrameElements() {
        const corners = document.querySelectorAll('.frame-corner');
        const borders = document.querySelectorAll('.frame-border');
        
        corners.forEach((corner, index) => {
            corner.style.opacity = '0';
            corner.style.transform = 'scale(0)';
            setTimeout(() => {
                corner.style.transition = 'all 0.5s ease';
                corner.style.opacity = '1';
                corner.style.transform = 'scale(1)';
            }, index * 200);
        });
        
        borders.forEach((border, index) => {
            border.style.opacity = '0';
            setTimeout(() => {
                border.style.transition = 'opacity 1s ease';
                border.style.opacity = '0.3';
            }, 800 + index * 100);
        });
    }

    animateOnlineMembers() {
        const members = document.querySelectorAll('.member');
        
        members.forEach((member, index) => {
            member.style.opacity = '0';
            member.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                member.style.transition = 'all 0.4s ease';
                member.style.opacity = '1';
                member.style.transform = 'translateX(0)';
            }, 1000 + index * 100);
        });
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const finalValue = stat.textContent;
            const isNumeric = !isNaN(finalValue.replace(/[^\d]/g, ''));
            
            if (isNumeric) {
                const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                this.animateNumber(stat, 0, numericValue, finalValue);
            }
        });
    }

    animateNumber(element, start, end, originalText) {
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            const formattedValue = originalText.replace(/\d+/, current.toLocaleString());
            element.textContent = formattedValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    animateCards() {
        const cards = document.querySelectorAll('.category-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// Initialiser l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new QVSLVApp();
});

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('Erreur QVSLV:', e.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`QVSLV chargé en ${Math.round(loadTime)}ms`);
    });
}