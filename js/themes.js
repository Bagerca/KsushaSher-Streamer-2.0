// Система управления темами
class ThemeSystem {
    constructor() {
        this.currentTheme = 'default';
        this.themes = {
            default: {
                name: 'Основная',
                colors: {
                    '--neon-green': '#39ff14',
                    '--neon-pink': '#ff2d95',
                    '--neon-blue': '#00e5ff',
                    '--neon-purple': '#b967ff',
                    '--dark-bg': '#070711',
                    '--medium-bg': '#0f0f1b',
                    '--light-bg': '#1a1a2e',
                    '--light-text': '#cccccc'
                },
                effects: []
            },
            halloween: {
                name: 'Хэллоуин',
                colors: {
                    '--neon-green': '#ff8c00',
                    '--neon-pink': '#ff4500',
                    '--neon-blue': '#ff6347',
                    '--neon-purple': '#8b4513',
                    '--dark-bg': '#1a0f0f',
                    '--medium-bg': '#2d1b1b',
                    '--light-bg': '#3d2c2c',
                    '--light-text': '#ffd700'
                },
                effects: ['bats', 'ghosts', 'decode-text']
            },
            newyear: {
                name: 'Новый год',
                colors: {
                    '--neon-green': '#00ffff',
                    '--neon-pink': '#ff00ff',
                    '--neon-blue': '#00ff00',
                    '--neon-purple': '#ff0000',
                    '--dark-bg': '#0a0f2d',
                    '--medium-bg': '#1a1f3d',
                    '--light-bg': '#2a2f4d',
                    '--light-text': '#e6f7ff'
                },
                effects: ['snow', 'particles']
            }
        };
        
        this.init();
    }

    init() {
        // Загружаем сохраненную тему из localStorage
        const savedTheme = localStorage.getItem('ksusha-theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.switchTheme(savedTheme, false);
        }
        
        console.log('🎨 Система тем инициализирована');
    }

    switchTheme(themeName, animate = true) {
        if (!this.themes[themeName] || this.currentTheme === themeName) return;
        
        const previousTheme = this.currentTheme;
        this.currentTheme = themeName;
        const theme = this.themes[themeName];
        
        // Сохраняем в localStorage
        localStorage.setItem('ksusha-theme', themeName);
        
        // Применяем цвета темы
        this.applyThemeColors(theme.colors);
        
        // Обновляем класс body
        document.body.className = `theme-${themeName}`;
        
        // Управляем эффектами
        this.manageThemeEffects(previousTheme, themeName, animate);
        
        // Обновляем музыку если нужно
        if (window.musicManager) {
            window.musicManager.handleThemeChange(themeName);
        }
        
        console.log(`🎨 Тема изменена: ${theme.name}`);
    }

    applyThemeColors(colors) {
        const root = document.documentElement;
        
        Object.entries(colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    }

    manageThemeEffects(previousTheme, newTheme, animate) {
        // Убираем эффекты предыдущей темы
        this.removeThemeEffects(previousTheme);
        
        // Добавляем эффекты новой темы
        this.addThemeEffects(newTheme, animate);
    }

    removeThemeEffects(theme) {
        switch (theme) {
            case 'halloween':
                // Убираем летучих мышей
                document.querySelectorAll('.bat').forEach(bat => bat.remove());
                // Убираем приведения
                if (window.ghostHunt) {
                    window.ghostHunt.stopGame();
                }
                break;
                
            case 'newyear':
                // Останавливаем снег
                if (window.snowEffect) {
                    window.snowEffect.stop();
                }
                break;
        }
    }

    addThemeEffects(theme, animate) {
        switch (theme) {
            case 'halloween':
                // Добавляем летучих мышей
                this.createBats();
                // Запускаем Ghost Hunt
                if (window.ghostHunt) {
                    setTimeout(() => {
                        window.ghostHunt.startGame();
                    }, 1000);
                }
                break;
                
            case 'newyear':
                // Запускаем снег
                if (window.snowEffect) {
                    window.snowEffect.start();
                }
                break;
        }
        
        // Эффект перехода для заголовков
        if (animate) {
            this.animateThemeTransition();
        }
    }

    createBats() {
        const batCount = 8;
        
        for (let i = 0; i < batCount; i++) {
            setTimeout(() => {
                this.createBat();
            }, i * 500);
        }
    }

    createBat() {
        const bat = document.createElement('div');
        bat.className = 'bat';
        
        // Случайная позиция и анимация
        const startX = -50;
        const startY = Math.random() * window.innerHeight;
        
        bat.style.left = `${startX}px`;
        bat.style.top = `${startY}px`;
        
        document.body.appendChild(bat);
        
        // Удаляем после завершения анимации
        setTimeout(() => {
            if (bat.parentNode) {
                bat.parentNode.removeChild(bat);
            }
        }, 15000);
        
        // Создаем новую летучую мышь через случайный интервал
        setTimeout(() => {
            if (this.currentTheme === 'halloween') {
                this.createBat();
            }
        }, 5000 + Math.random() * 10000);
    }

    animateThemeTransition() {
        // Анимация для заголовков секций
        const titles = document.querySelectorAll('.section-title');
        
        titles.forEach((title, index) => {
            setTimeout(() => {
                title.classList.add('glitch-text');
                
                setTimeout(() => {
                    title.classList.remove('glitch-text');
                }, 500);
            }, index * 200);
        });
        
        // Анимация для карточек
        const cards = document.querySelectorAll('.game-card, .stat-card');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 300);
            }, index * 50);
        });
    }

    // Методы для управления конкретными эффектами
    startHalloweenEffects() {
        if (this.currentTheme === 'halloween') {
            this.createBats();
        }
    }

    stopHalloweenEffects() {
        document.querySelectorAll('.bat').forEach(bat => bat.remove());
    }

    // Получение текущей темы
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Получение информации о теме
    getThemeInfo(themeName) {
        return this.themes[themeName];
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.themeSystem = new ThemeSystem();
});
