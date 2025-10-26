// Expanding Dots - система управления в левом нижнем углу
class ExpandingDots {
    constructor() {
        this.container = document.getElementById('expandingDots');
        this.mainDot = document.getElementById('mainDot');
        this.dotOptions = document.querySelectorAll('.dot-option');
        this.isExpanded = false;
        this.init();
    }

    init() {
        // Обработчик для главной точки
        this.mainDot.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleExpansion();
        });

        // Обработчики для опций
        this.dotOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleOptionClick(option);
            });
        });

        // Закрытие при клике вне области
        document.addEventListener('click', () => {
            if (this.isExpanded) {
                this.collapse();
            }
        });

        // Предотвращение закрытия при клике на контейнер
        this.container.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        console.log('⚙️ Expanding Dots инициализированы');
    }

    toggleExpansion() {
        if (this.isExpanded) {
            this.collapse();
        } else {
            this.expand();
        }
    }

    expand() {
        this.container.classList.add('expanded');
        this.isExpanded = true;
        
        // Анимация главной точки
        this.mainDot.style.transform = 'translateX(20px) scale(1.1)';
        this.mainDot.style.background = 'linear-gradient(45deg, var(--neon-green), var(--neon-blue))';
    }

    collapse() {
        this.container.classList.remove('expanded');
        this.isExpanded = false;
        
        // Возвращаем главную точку в исходное состояние
        this.mainDot.style.transform = 'translateX(0) scale(1)';
        this.mainDot.style.background = 'linear-gradient(45deg, var(--neon-pink), var(--neon-green))';
    }

    handleOptionClick(option) {
        const optionType = Array.from(option.classList).find(cls => 
            cls.includes('theme-option') || 
            cls.includes('music-option') || 
            cls.includes('fireworks-option')
        );

        switch (optionType) {
            case 'theme-option':
                this.handleThemeChange(option);
                break;
            case 'music-option':
                this.handleMusicToggle();
                break;
            case 'fireworks-option':
                this.handleFireworks();
                break;
        }

        // Анимация клика
        this.animateClick(option);
        
        // Автоматическое закрытие после выбора
        setTimeout(() => {
            this.collapse();
        }, 300);
    }

    handleThemeChange(option) {
        const theme = option.getAttribute('data-theme');
        
        // Убираем активный класс со всех theme-option
        document.querySelectorAll('.theme-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        // Добавляем активный класс выбранной опции
        option.classList.add('active');
        
        // Переключаем тему
        if (window.themeSystem) {
            window.themeSystem.switchTheme(theme);
        }
        
        console.log(`🎨 Переключение темы: ${theme}`);
    }

    handleMusicToggle() {
        if (window.musicManager) {
            window.musicManager.toggleMusic();
            
            // Обновляем иконку
            const icon = document.querySelector('.music-option i');
            if (window.musicManager.isPlaying) {
                icon.className = 'fas fa-volume-up';
            } else {
                icon.className = 'fas fa-volume-mute';
            }
        }
    }

    handleFireworks() {
        if (window.fireworks) {
            window.fireworks.launchFireworks(5); // Запуск 5 фейерверков
            
            // Анимация кнопки
            const option = document.querySelector('.fireworks-option');
            option.style.background = 'var(--neon-pink)';
            option.style.color = 'var(--dark-bg)';
            
            setTimeout(() => {
                option.style.background = '';
                option.style.color = '';
            }, 1000);
        }
    }

    animateClick(element) {
        // Анимация нажатия
        element.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            element.style.transform = 'scale(1.1)';
        }, 100);
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }

    // Метод для принудительного открытия/закрытия
    setExpanded(state) {
        if (state) {
            this.expand();
        } else {
            this.collapse();
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.expandingDots = new ExpandingDots();
});
