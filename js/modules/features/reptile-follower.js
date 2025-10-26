// Рептилия, которая следует за курсором (секретный эффект)
import { Utils } from '../../core/utils.js';

let reptileCanvas;
let reptileCtx;
let reptile = null;
let isReptileActive = false;

export function initReptileFollower() {
    // Создаем канвас для рептилии
    reptileCanvas = document.createElement('canvas');
    reptileCanvas.className = 'reptile-canvas';
    reptileCanvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
    `;
    document.body.appendChild(reptileCanvas);
    
    reptileCtx = reptileCanvas.getContext('2d');
    resizeReptileCanvas();
    
    window.addEventListener('resize', resizeReptileCanvas);
}

export function activateReptile() {
    if (isReptileActive) return;
    
    isReptileActive = true;
    reptileCanvas.style.display = 'block';
    
    // Создаем рептилию
    reptile = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        segments: [],
        targetX: window.innerWidth / 2,
        targetY: window.innerHeight / 2
    };
    
    // Создаем сегменты тела
    for (let i = 0; i < 20; i++) {
        reptile.segments.push({
            x: reptile.x,
            y: reptile.y,
            size: Math.max(5, 10 - i * 0.3)
        });
    }
    
    // Запускаем анимацию
    animateReptile();
    
    console.log('🦎 Рептилия активирована!');
}

export function deactivateReptile() {
    isReptileActive = false;
    reptileCanvas.style.display = 'none';
    
    if (reptileCtx) {
        reptileCtx.clearRect(0, 0, reptileCanvas.width, reptileCanvas.height);
    }
}

function resizeReptileCanvas() {
    if (!reptileCanvas) return;
    
    reptileCanvas.width = window.innerWidth;
    reptileCanvas.height = window.innerHeight;
}

function animateReptile() {
    if (!isReptileActive || !reptile) return;
    
    // Очищаем канвас
    reptileCtx.clearRect(0, 0, reptileCanvas.width, reptileCanvas.height);
    
    // Обновляем позицию цели (следим за курсором)
    reptile.targetX += (mouseX - reptile.targetX) * 0.1;
    reptile.targetY += (mouseY - reptile.targetY) * 0.1;
    
    // Обновляем сегменты
    for (let i = 0; i < reptile.segments.length; i++) {
        const segment = reptile.segments[i];
        const target = i === 0 ? reptile : reptile.segments[i - 1];
        
        // Плавное движение к цели
        segment.x += (target.x - segment.x) * 0.2;
        segment.y += (target.y - segment.y) * 0.2;
        
        // Рисуем сегмент
        reptileCtx.fillStyle = i === 0 ? '#39ff14' : `hsl(${120 + i * 2}, 100%, 50%)`;
        reptileCtx.beginPath();
        reptileCtx.arc(segment.x, segment.y, segment.size, 0, Math.PI * 2);
        reptileCtx.fill();
        
        // Добавляем свечение для головы
        if (i === 0) {
            reptileCtx.shadowColor = '#39ff14';
            reptileCtx.shadowBlur = 15;
            reptileCtx.fill();
            reptileCtx.shadowBlur = 0;
        }
    }
    
    requestAnimationFrame(animateReptile);
}

// Глобальные переменные для позиции мыши
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (isReptileActive && reptile) {
        reptile.targetX = e.clientX;
        reptile.targetY = e.clientY;
    }
});
