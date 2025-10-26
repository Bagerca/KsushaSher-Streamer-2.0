// Конфигурация приложения
export const Config = {
    // Настройки сайта
    siteName: 'Ksusha Sher',
    siteUrl: 'https://ksusha-sher.ru',
    
    // Настройки данных
    dataBaseUrl: './data/',
    cacheTimeout: 5 * 60 * 1000, // 5 минут
    
    // Настройки анимаций
    animationsEnabled: true,
    particlesEnabled: true,
    
    // Настройки звука
    defaultVolume: 0.5,
    musicEnabled: false,
    
    // Настройки темы
    defaultTheme: 'default',
    
    // API ключи (если понадобятся)
    // apiKeys: {}
};

// Константы
export const Constants = {
    // Статусы игр/фильмов
    STATUS: {
        COMPLETED: 'completed',
        PLAYING: 'playing',
        WATCHING: 'watching',
        DROPPED: 'dropped',
        ON_HOLD: 'on-hold',
        WATCHED: 'watched'
    },
    
    // Типы контента
    CONTENT_TYPES: {
        GAMES: 'games',
        MOVIES: 'movies'
    },
    
    // Локальное хранилище
    STORAGE_KEYS: {
        THEME: 'ksusha_theme',
        MUSIC: 'ksusha_music',
        VOLUME: 'ksusha_volume'
    }
};
