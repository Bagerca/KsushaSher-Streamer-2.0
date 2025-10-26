// Основной файл приложения
class KsushaSherWebsite {
    constructor() {
        this.currentTheme = 'default';
        this.isMusicPlaying = false;
        this.isExpanded = false;
        this.currentTab = 'games';
        this.init();
    }

    init() {
        console.log('🚀 Инициализация сайта Ksusha Sher...');
        
        // Инициализация всех модулей
        this.initCursor();
        this.initThemes();
        this.initExpandingDots();
        this.initHeroSection();
        this.initSchedule();
        this.initGames();
        this.initStats();
        this.initMusic();
        this.initFireworks();
        this.initGhostHunt();
        this.initSnow();
        this.initParticles();
        
        // Инициализация общих обработчиков
        this.initCommonHandlers();
        
        console.log('✅ Сайт Ksusha Sher инициализирован!');
    }

    initCursor() {
        if (window.magneticCursor) {
            console.log('🎯 Кастомный курсор инициализирован');
        }
    }

    initThemes() {
        if (window.themeSystem) {
            console.log('🎨 Система тем инициализирована');
        }
    }

    initExpandingDots() {
        if (window.expandingDots) {
            console.log('⚙️ Expanding Dots инициализированы');
        }
    }

    initHeroSection() {
        if (window.heroSection) {
            console.log('🌌 Hero секция инициализирована');
        }
    }

    initSchedule() {
        if (window.scheduleManager) {
            console.log('📅 Расписание инициализировано');
        }
    }

    initGames() {
        if (window.gamesManager) {
            console.log('🎮 Игры и фильмы инициализированы');
        }
    }

    initStats() {
        if (window.statsManager) {
            console.log('📊 Статистика инициализирована');
        }
    }

    initMusic() {
        if (window.musicManager) {
            console.log('🎵 Музыка инициализирована');
        }
    }

    initFireworks() {
        if (window.fireworks) {
            console.log('🎆 Фейерверк инициализирован');
        }
    }

    initGhostHunt() {
        if (window.ghostHunt) {
            console.log('👻 Ghost Hunt инициализирован');
        }
    }

    initSnow() {
        if (window.snowEffect) {
            console.log('❄️ Снег инициализирован');
        }
    }

    initParticles() {
        if (window.particles) {
            console.log('✨ Система частиц инициализирована');
        }
    }

    initCommonHandlers() {
        // Обработчик для модальных окон
        this.initModalHandlers();
        
        // Обработчик для кнопки развернуть/свернуть
        this.initExpandHandler();
        
        // Обработчик изменения размера окна
        this.initResizeHandler();
        
        // Предотвращение контекстного меню
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    initModalHandlers() {
        const modal = document.getElementById('gameModal');
        const closeBtn = document.querySelector('.close-modal');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    initExpandHandler() {
        const toggleBtn = document.getElementById('toggleExpand');
        const cardsGrid = document.querySelector('.cards-grid');

        if (toggleBtn && cardsGrid) {
            toggleBtn.addEventListener('click', () => {
                this.isExpanded = !this.isExpanded;
                
                if (this.isExpanded) {
                    cardsGrid.classList.add('expanded');
                    toggleBtn.innerHTML = '<span>Свернуть</span><i class="fas fa-chevron-up"></i>';
                } else {
                    cardsGrid.classList.remove('expanded');
                    toggleBtn.innerHTML = '<span>Развернуть</span><i class="fas fa-chevron-down"></i>';
                    
                    // Плавная прокрутка к секции
                    document.getElementById('games').scrollIntoView({ 
                        behavior: 'smooth' 
                    });
                }
            });
        }
    }

    initResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Переинициализация адаптивных компонентов
                if (window.statsManager && window.statsManager.radarChart) {
                    window.statsManager.radarChart.resize();
                }
            }, 250);
        });
    }

    // Метод для отладки
    debug() {
        console.log('🐛 Отладочная информация:', {
            theme: this.currentTheme,
            music: this.isMusicPlaying,
            expanded: this.isExpanded,
            currentTab: this.currentTab
        });
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.ksushaSherApp = new KsushaSherWebsite();
});

// Глобальные функции для отладки
window.debugApp = () => {
    if (window.ksushaSherApp) {
        window.ksushaSherApp.debug();
    }
};

window.reloadData = () => {
    if (window.scheduleManager) window.scheduleManager.loadSchedule();
    if (window.gamesManager) window.gamesManager.loadGames();
    if (window.statsManager) window.statsManager.loadStats();
};
