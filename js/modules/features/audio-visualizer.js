// Визуализатор аудио для фоновой музыки
import { Utils } from '../../core/utils.js';

let audioContext;
let analyser;
let dataArray;
let bufferLength;
let canvas;
let ctx;
let isVisualizerActive = false;

export function initAudioVisualizer() {
    canvas = document.createElement('canvas');
    canvas.className = 'audio-visualizer';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.1;
    `;
    document.body.appendChild(canvas);
    
    ctx = canvas.getContext('2d');
    resizeCanvas();
    
    window.addEventListener('resize', resizeCanvas);
}

export function connectAudioSource(audioElement) {
    if (!audioElement) return;
    
    try {
        // Создаем аудиоконтекст
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        
        // Подключаем источник
        const source = audioContext.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        // Настройки анализатора
        analyser.fftSize = 256;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        isVisualizerActive = true;
        animateVisualizer();
        
    } catch (error) {
        console.warn('Аудио визуализатор не доступен:', error);
    }
}

export function disconnectAudioSource() {
    isVisualizerActive = false;
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function resizeCanvas() {
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function animateVisualizer() {
    if (!isVisualizerActive || !analyser || !ctx) return;
    
    // Получаем данные частот
    analyser.getByteFrequencyData(dataArray);
    
    // Очищаем канвас
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем визуализацию
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        
        // Градиентный цвет
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, '#39ff14');
        gradient.addColorStop(0.5, '#ff2d95');
        gradient.addColorStop(1, '#14c3ff');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
    }
    
    requestAnimationFrame(animateVisualizer);
}
