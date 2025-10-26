// Менеджер фоновой музыки
class MusicManager {
    constructor() {
        this.audioElements = {
            default: document.getElementById('backgroundMusic'),
            halloween: document.getElementById('halloweenMusic'),
            newyear: document.getElementById('newyearMusic')
        };
        this.currentTheme = 'default';
        this.isPlaying = false;
        this.volume = 0.3;
        this.init();
    }

    init() {
        // Устанавливаем громкость
        this.setVolume(this.volume);
        
        // Загружаем состояние из localStorage
        const savedState = localStorage.getItem('ksusha-music-state');
        if (savedState === 'playing') {
            this.play();
        }

        console.log('🎵 Музыкальный менеджер инициализирован');
    }

    play() {
        if (this.isPlaying) return;

        const audio = this.audioElements[this.currentTheme];
        if (audio) {
            audio.play().catch(error => {
                console.warn('Автовоспроизведение заблокировано:', error);
            });
            this.isPlaying = true;
            localStorage.setItem('ksusha-music-state', 'playing');
        }
    }

    pause() {
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
        this.isPlaying = false;
        localStorage.setItem('ksusha-music-state', 'paused');
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
        return this.isPlaying;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.volume = this.volume;
            }
        });
    }

    handleThemeChange(theme) {
        const previousTheme = this.currentTheme;
        this.currentTheme = theme;

        if (this.isPlaying) {
            // Плавный переход между темами
            this.crossFade(previousTheme, theme);
        }
    }

    crossFade(fromTheme, toTheme) {
        const fromAudio = this.audioElements[fromTheme];
        const toAudio = this.audioElements[toTheme];

        if (!fromAudio || !toAudio) return;

        const fadeDuration = 1000; // 1 секунда
        const steps = 20;
        const stepTime = fadeDuration / steps;
        let step = 0;

        toAudio.volume = 0;
        toAudio.currentTime = fromAudio.currentTime % toAudio.duration;
        toAudio.play();

        const fadeInterval = setInterval(() => {
            step++;
            const progress = step / steps;

            fromAudio.volume = this.volume * (1 - progress);
            toAudio.volume = this.volume * progress;

            if (step >= steps) {
                clearInterval(fadeInterval);
                fromAudio.pause();
                fromAudio.currentTime = 0;
            }
        }, stepTime);
    }

    // Метод для создания визуализации
    createVisualizer() {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 20;
        canvas.style.position = 'fixed';
        canvas.style.bottom = '80px';
        canvas.style.left = '30px';
        canvas.style.zIndex = '1000';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(this.audioElements[this.currentTheme]);

        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyser.fftSize = 64;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!this.isPlaying) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#39ff14';

            const barWidth = canvas.width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height;
                
                ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
                x += barWidth;
            }
        };

        draw();
    }

    // Метод для получения текущего состояния
    getState() {
        return {
            isPlaying: this.isPlaying,
            currentTheme: this.currentTheme,
            volume: this.volume
        };
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.musicManager = new MusicManager();
});
