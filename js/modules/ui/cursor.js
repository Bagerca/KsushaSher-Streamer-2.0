// Магнитный курсор
import { Utils } from '../../core/utils.js';

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let isCursorHidden = false;

export function initCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    // Скрываем стандартный курсор
    document.body.style.cursor = 'none';

    // Обновление позиции курсора
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (isCursorHidden) {
            cursor.classList.remove('hidden');
            isCursorHidden = false;
        }
    });

    // Скрытие курсора при выходе за пределы окна
    document.addEventListener('mouseleave', () => {
        cursor.classList.add('hidden');
        isCursorHidden = true;
    });

    // Анимация курсора
    function animateCursor() {
        // Плавное движение с запаздыванием
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }

    // Обработчики состояний курсора
    initCursorStates();
    
    // Магнитный эффект для элементов
    initMagneticElements();

    animateCursor();
}

function initCursorStates() {
    const cursor = document.getElementById('custom-cursor');
    
    // Обработка кликабельных элементов
    document.addEventListener('mouseover', (e) => {
        const target = e.target;
        
        if (target.closest('a, button, [role="button"], .cta-button, .tab-button, .setting-option')) {
            cursor.classList.add('pointer');
        } else if (target.closest('p, span, h1, h2, h3, h4, h5, h6, .hero-title, .section-title')) {
            cursor.classList.add('text');
        } else {
            cursor.classList.remove('pointer', 'text');
        }
    });

    // Эффект при клике
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });

    // Скрытие курсора при вводе текста
    document.addEventListener('focusin', (e) => {
        if (e.target.matches('input, textarea, select')) {
            cursor.classList.add('hidden');
        }
    });

    document.addEventListener('focusout', (e) => {
        if (e.target.matches('input, textarea, select')) {
            cursor.classList.remove('hidden');
        }
    });
}

function initMagneticElements() {
    const magneticElements = document.querySelectorAll('[data-cursor-magnetic]');
    const cursor = document.getElementById('custom-cursor');
    
    magneticElements.forEach(element => {
        element.addEventListener('mouseenter', handleMagneticEnter);
        element.addEventListener('mouseleave', handleMagneticLeave);
        element.addEventListener('mousemove', handleMagneticMove);
    });

    function handleMagneticEnter(e) {
        const element = e.currentTarget;
        cursor.classList.add('magnetic');
        element.setAttribute('data-magnetic-active', 'true');
    }

    function handleMagneticMove(e) {
        const element = e.currentTarget;
        if (!element.getAttribute('data-magnetic-active')) return;
        
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const strength = 0.3;
        const deltaX = (centerX - e.clientX) * strength;
        const deltaY = (centerY - e.clientY) * strength;
        
        cursor.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }

    function handleMagneticLeave(e) {
        const element = e.currentTarget;
        cursor.classList.remove('magnetic');
        cursor.style.transform = 'none';
        element.removeAttribute('data-magnetic-active');
    }
}

// Функция для принудительного скрытия курсора (для модальных окон и т.д.)
export function hideCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        cursor.classList.add('hidden');
    }
}

export function showCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        cursor.classList.remove('hidden');
    }
}
