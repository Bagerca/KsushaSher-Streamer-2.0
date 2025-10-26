// Расширяющиеся точки настроек
import { Utils } from '../../core/utils.js';

let isSettingsOpen = false;
let appInstance = null;

export function initSettings(app) {
    appInstance = app;
    
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsDots = document.getElementById('settings-dots');
    
    if (!settingsToggle || !settingsDots) return;

    // Обработчик клика по шестеренке
    settingsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSettings();
    });

    // Обработчики для опций настроек
    initSettingOptions();
    
    // Закрытие настроек при клике вне
    document.addEventListener('click', (e) => {
        if (isSettingsOpen && !settingsDots.contains(e.target)) {
            toggleSettings();
        }
    });
}

export function toggleSettings() {
    const settingsDots = document.getElementById('settings-dots');
    if (!settingsDots) return;

    isSettingsOpen = !isSettingsOpen;
    settingsDots.classList.toggle('active', isSettingsOpen);
    
    return isSettingsOpen;
}

function initSettingOptions() {
    // Смена темы
    document.querySelectorAll('.setting-option[data-theme]').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const theme = option.getAttribute('data-theme');
            if (appInstance) {
                appInstance.setTheme(theme);
            }
            toggleSettings();
        });
    });

    // Управление музыкой
    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (appInstance) {
                appInstance.toggleMusic();
                updateMusicIcon();
            }
        });
    }

    // Запуск фейерверка
    const fireworksToggle = document.getElementById('fireworks-toggle');
    if (fireworksToggle) {
        fireworksToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            launchFireworks();
            toggleSettings();
        });
    }
}

function updateMusicIcon() {
    const musicToggle = document.getElementById('music-toggle');
    if (!musicToggle || !appInstance) return;

    const icon = musicToggle.querySelector('i');
    if (appInstance.isMusicPlaying) {
        icon.className = 'fas fa-volume-up';
    } else {
        icon.className = 'fas fa-music';
    }
}

function launchFireworks() {
    // Создаем временный канвас для фейерверка
    const canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Массив частиц фейерверка
    const particles = [];
    const colors = ['#ff2d95', '#39ff14', '#14c3ff', '#b967ff', '#ff6b00'];

    // Создаем несколько запусков фейерверка
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createFirework(
                Utils.random(100, canvas.width - 100),
                Utils.random(100, canvas.height / 2)
            );
        }, i * 300);
    }

    function createFirework(x, y) {
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: x,
                y: y,
                size: Utils.random(2, 4),
                speedX: Utils.random(-5, 5),
                speedY: Utils.random(-5, 5),
                color: colors[Math.floor(Utils.random(0, colors.length))],
                life: 1,
                decay: Utils.random(0.01, 0.03)
            });
        }
    }

    function animateFireworks() {
        ctx.fillStyle = 'rgba(7, 7, 17, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            p.x += p.speedX;
            p.y += p.speedY;
            p.speedY += 0.1; // гравитация
            p.life -= p.decay;

            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            if (p.life <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }

        if (particles.length > 0) {
            requestAnimationFrame(animateFireworks);
        } else {
            // Очищаем канвас
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animateFireworks();
}
