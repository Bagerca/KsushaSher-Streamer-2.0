// Главный файл приложения
import { Config, Constants } from './config.js';
import { Utils } from './utils.js';
import { initCursor } from '../modules/ui/cursor.js';
import { initSettings, toggleSettings } from '../modules/ui/settings.js';
import { initModal, showModal, closeModal } from '../modules/ui/modal.js';
import { initHeroOrbit } from '../modules/animations/cosmic.js';
import { initParticles } from '../modules/animations/particles.js';
import { initFireworks } from '../modules/animations/fireworks.js';
import { initGhosts } from '../modules/features/ghosts.js';
import { initSnow } from '../modules/features/snow.js';
import { loadSchedule } from '../modules/data/schedule-loader.js';
import { loadGames, loadMovies } from '../modules/data/media-loader.js';
import { loadStats } from '../modules/data/stats-loader.js';
import { initFilters } from '../modules/data/filters.js';

class App {
    constructor() {
        this.config = Config;
        this.constants = Constants;
        this.utils = Utils;
        
        this.currentTheme = 'default';
        this.isMusicPlaying = false;
        this.isSettingsOpen = false;
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Инициализация приложения Ksusha Sher...');
            
            // Загружаем настройки пользователя
            this.loadUserPreferences();
            
            // Инициализация основных модулей
            await this.initializeModules();
            
            // Загрузка данных
            await this.loadData();
            
            // Запуск анимаций
            this.startAnimations();
            
            // Инициализация слушателей событий
            this.initEventListeners();
            
            console.log('✅ Приложение успешно инициализировано');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации приложения:', error);
        }
    }

    loadUserPreferences() {
        // Загрузка темы
        const savedTheme = localStorage.getItem(Constants.STORAGE_KEYS.THEME);
        if (savedTheme) {
            this.setTheme(savedTheme);
        }
        
        // Загрузка настроек музыки
        const savedMusic = localStorage.getItem(Constants.STORAGE_KEYS.MUSIC);
        if (savedMusic === 'true') {
            this.toggleMusic();
        }
        
        // Загрузка громкости
        const savedVolume = localStorage.getItem(Constants.STORAGE_KEYS.VOLUME);
        if (savedVolume) {
            this.setVolume(parseFloat(savedVolume));
        }
    }

    async initializeModules() {
        // UI модули
        initCursor();
        initSettings(this);
        initModal();
        
        // Анимации
        if (this.config.animationsEnabled && !Utils.prefersReducedMotion()) {
            initHeroOrbit();
            if (this.config.particlesEnabled) {
                initParticles();
            }
        }
        
        // Инициализация фильтров
        initFilters();
        
        // Инициализация тематических эффектов
        initFireworks();
        initGhosts();
        initSnow();
    }

    async loadData() {
        try {
            await Promise.all([
                loadSchedule(),
                loadGames(),
                loadMovies(), 
                loadStats()
            ]);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }

    startAnimations() {
        // Инициализация анимаций при скролле
        Utils.initScrollAnimations();
        
        // Запуск фоновых анимаций
        if (this.config.animationsEnabled) {
            // Дополнительные анимации могут быть добавлены здесь
        }
    }

    initEventListeners() {
        // Глобальные слушатели событий
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Слушатель для закрытия модальных окон при клике вне их
        document.addEventListener('click', this.handleOutsideClick.bind(this));
    }

    handleKeyPress(event) {
        // ESC для закрытия модальных окон
        if (event.key === 'Escape') {
            closeModal();
            if (this.isSettingsOpen) {
                toggleSettings();
            }
        }
        
        // Space для управления музыкой (только если не в поле ввода)
        if (event.key === ' ' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            this.toggleMusic();
        }
    }

    handleResize() {
        // Обновление при изменении размера окна
        this.debounce(() => {
            // Можно добавить логику пересчета размеров элементов
        }, 250)();
    }

    handleOutsideClick(event) {
        // Закрытие настроек при клике вне
        const settings = document.getElementById('settings-dots');
        if (this.isSettingsOpen && settings && !settings.contains(event.target)) {
            toggleSettings();
        }
    }

    // Смена темы
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(Constants.STORAGE_KEYS.THEME, theme);
        
        // Обновляем музыку в соответствии с темой
        this.updateThemeMusic();
        
        // Запускаем тематические эффекты
        this.startThemeEffects();
    }

    updateThemeMusic() {
        const defaultMusic = document.getElementById('background-music');
        const halloweenMusic = document.getElementById('halloween-music');
        const christmasMusic = document.getElementById('christmas-music');
        
        // Пауза всей музыки
        [defaultMusic, halloweenMusic, christmasMusic].forEach(music => {
            if (music) {
                music.pause();
                music.currentTime = 0;
            }
        });
        
        // Воспроизведение соответствующей музыки
        if (this.isMusicPlaying) {
            let currentMusic;
            switch (this.currentTheme) {
                case 'halloween':
                    currentMusic = halloweenMusic;
                    break;
                case 'christmas':
                    currentMusic = christmasMusic;
                    break;
                default:
                    currentMusic = defaultMusic;
            }
            
            if (currentMusic) {
                currentMusic.play().catch(console.error);
            }
        }
    }

    startThemeEffects() {
        // Запуск эффектов в зависимости от темы
        switch (this.currentTheme) {
            case 'halloween':
                // Приведения уже инициализированы, можно добавить дополнительные эффекты
                break;
            case 'christmas':
                // Снег уже инициализирован, можно добавить дополнительные эффекты
                break;
            default:
                // Базовые эффекты
                break;
        }
    }

    // Управление музыкой
    toggleMusic() {
        this.isMusicPlaying = !this.isMusicPlaying;
        
        const defaultMusic = document.getElementById('background-music');
        const halloweenMusic = document.getElementById('halloween-music');
        const christmasMusic = document.getElementById('christmas-music');
        
        let currentMusic;
        switch (this.currentTheme) {
            case 'halloween':
                currentMusic = halloweenMusic;
                break;
            case 'christmas':
                currentMusic = christmasMusic;
                break;
            default:
                currentMusic = defaultMusic;
        }
        
        if (currentMusic) {
            if (this.isMusicPlaying) {
                currentMusic.volume = this.config.defaultVolume;
                currentMusic.play().catch(error => {
                    console.warn('Автовоспроизведение заблокировано:', error);
                    this.isMusicPlaying = false;
                });
            } else {
                currentMusic.pause();
            }
        }
        
        localStorage.setItem(Constants.STORAGE_KEYS.MUSIC, this.isMusicPlaying.toString());
    }

    setVolume(volume) {
        const newVolume = Utils.clamp(volume, 0, 1);
        this.config.defaultVolume = newVolume;
        
        const musics = [
            document.getElementById('background-music'),
            document.getElementById('halloween-music'),
            document.getElementById('christmas-music')
        ];
        
        musics.forEach(music => {
            if (music) {
                music.volume = newVolume;
            }
        });
        
        localStorage.setItem(Constants.STORAGE_KEYS.VOLUME, newVolume.toString());
    }

    // Вспомогательные методы
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Публичные методы для глобального доступа
    showMediaModal(item) {
        showModal(item);
    }

    toggleSettingsMenu() {
        this.isSettingsOpen = toggleSettings();
    }
}

// Создаем глобальный экземпляр приложения
let appInstance;

document.addEventListener('DOMContentLoaded', () => {
    appInstance = new App();
    window.app = appInstance;
});

// Экспортируем для использования в других модулях
export default App;
