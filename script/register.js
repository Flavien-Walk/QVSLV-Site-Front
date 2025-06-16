// scripts/register.js

const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://qvslv-site.onrender.com/api';

class RegisterParticles {
    constructor() {
        this.initParticles();
    }

    initParticles() {
        const container = document.getElementById('particles');
        const particleCount = 60;

        for (let i = 0; i < particleCount; i++) {
            this.createParticle(container, true);
        }

        setInterval(() => {
            this.createParticle(container);
        }, 2000);
    }

    createParticle(container, isInitial = false) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        particle.style.left = Math.random() * 100 + '%';
        if (isInitial) {
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
        } else {
            particle.style.animationDelay = Math.random() * 2 + 's';
        }

        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        const duration = Math.random() * 6 + 6;
        particle.style.animationDuration = duration + 's';

        container.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration * 1000 + 2000);
    }
}

function showAlert(message, type = 'info') {
    const container = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span class="alert-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
        <span class="alert-message">${message}</span>
    `;

    container.appendChild(alert);
    setTimeout(() => alert.classList.add('show'), 100);
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    new RegisterParticles();

    const form = document.getElementById('registerForm');
    const password = document.getElementById('password');
    const confirm = document.getElementById('confirmPassword');
    const indicator = document.getElementById('matchIndicator');
    const strength = document.getElementById('passwordStrength');
    const bar = strength.querySelector('.strength-bar');
    const text = strength.querySelector('.strength-text');
    const toggle = document.getElementById('togglePassword');
    const generate = document.getElementById('generateUsername');
    const username = document.getElementById('username');
    const submit = document.getElementById('registerButton');

    toggle?.addEventListener('click', () => {
        const type = password.type === 'password' ? 'text' : 'password';
        password.type = type;
        toggle.textContent = type === 'password' ? '👁️' : '🙈';
    });

    function updateStrength() {
        const val = password.value;
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        const levels = ['Faible', 'Moyen', 'Fort'];
        const colors = ['#ff4444', '#ffa500', '#00ff00'];
        const idx = score >= 4 ? 2 : score >= 3 ? 1 : 0;

        bar.style.width = (score * 20) + '%';
        bar.style.background = colors[idx];
        text.textContent = levels[idx];
        text.style.color = colors[idx];
    }

    function checkMatch() {
        if (confirm.value.length === 0) {
            indicator.textContent = '❌';
            indicator.style.color = '#ff4444';
        } else if (password.value === confirm.value) {
            indicator.textContent = '✅';
            indicator.style.color = '#00ff00';
        } else {
            indicator.textContent = '❌';
            indicator.style.color = '#ff4444';
        }
    }

    password.addEventListener('input', () => {
        updateStrength();
        checkMatch();
    });
    confirm.addEventListener('input', checkMatch);

    generate?.addEventListener('click', () => {
        const p = ['Agent', 'Cipher', 'Shadow', 'Quantum'];
        const s = ['Seeker', 'Walker', 'Breaker', 'Sight'];
        const n = Math.floor(Math.random() * 999) + 1;
        username.value = `${p[Math.floor(Math.random()*p.length)]}${s[Math.floor(Math.random()*s.length)]}${n}`;
        generate.style.transform = 'rotate(360deg)';
        setTimeout(() => generate.style.transform = 'rotate(0)', 300);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());

        if (data.password !== data.confirmPassword) {
            showAlert('Les mots de passe ne correspondent pas', 'error');
            return;
        }
        if (!form.terms.checked) {
            showAlert('Vous devez accepter les conditions d\'utilisation', 'error');
            return;
        }

        submit.disabled = true;
        submit.querySelector('.button-text').textContent = 'Création en cours...';

        try {
            showAlert('Demande d\'accréditation en cours...', 'info');
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    specialization: data.specialization,
                    motivation: data.motivation || ''
                })
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Erreur serveur');

            showAlert('Compte créé avec succès ! Redirection...', 'success');
            setTimeout(() => window.location.href = 'login.html', 2000);
        } catch (err) {
            showAlert(err.message, 'error');
        } finally {
            submit.disabled = false;
            submit.querySelector('.button-text').textContent = 'Demander l\'Accréditation';
        }
    });

    // Animation des étapes visuelles
    setTimeout(() => {
        document.querySelectorAll('.step').forEach((step, i) => {
            setTimeout(() => {
                step.style.transform = 'scale(1.1)';
                setTimeout(() => step.style.transform = 'scale(1)', 200);
            }, i * 300);
        });
    }, 1000);
});