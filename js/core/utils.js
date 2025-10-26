// Утилиты для приложения
import { Config, Constants } from './config.js';

export class Utils {
    // Форматирование чисел
    static formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    // Генерация звезд рейтинга
    static generateStars(rating) {
        let starsHtml = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        
        return starsHtml;
    }

    // Задержка
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Проверка на мобильное устройство
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Предпочтения пользователя (prefers-reduced-motion)
    static prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Загрузка данных с кешированием
    static async fetchWithCache(url, options = {}) {
        const cacheKey = `ksusha_cache_${btoa(url)}`;
        const cacheTimeKey = `${cacheKey}_time`;
        
        // Проверяем кеш
        const cached = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(cacheTimeKey);
        
        if (cached && cacheTime) {
            const age = Date.now() - parseInt(cacheTime);
            if (age < Config.cacheTimeout) {
                return JSON.parse(cached);
            }
        }
        
        // Загружаем данные
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            // Сохраняем в кеш
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(cacheTimeKey, Date.now().toString());
            
            return data;
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            
            // Пробуем вернуть кешированные данные, даже если они устарели
            if (cached) {
                console.warn('Используются устаревшие кешированные данные');
                return JSON.parse(cached);
            }
            
            throw error;
        }
    }

    // Случайное число в диапазоне
    static random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Ограничение числа в диапазоне
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Плавное появление элемента при скролле
    static initScrollAnimations() {
        const elements = document.querySelectorAll('.fade-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => observer.observe(element));
    }

    // Копирование текста в буфер обмена
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    }

    // Форматирование даты
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Экранирование HTML
    static escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}
