// Эффекты при скролле
import { Utils } from '../../core/utils.js';

export function initScrollEffects() {
    if (Utils.prefersReducedMotion()) return;

    // Параллакс эффект для hero секции
    initParallax();
    
    // Появление элементов при скролле
    initScrollAnimations();
    
    // Прогресс бар для страницы
    initProgressBar();
}

function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами с атрибутом data-scroll
    document.querySelectorAll('[data-scroll]').forEach(el => {
        observer.observe(el);
    });
}

function initProgressBar() {
    // Создаем прогресс бар
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--neon-green);
        z-index: 10000;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px var(--neon-green);
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset;
        const progress = (scrollTop / (docHeight - winHeight)) * 100;
        
        progressBar.style.width = `${progress}%`;
    });
}

// Анимация чисел (для статистики)
export function animateNumber(element, target, duration = 2000) {
    const start = parseInt(element.textContent.replace(/\D/g, '') || 0);
    const increment = (target - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString() + '+';
    }, 16);
}
