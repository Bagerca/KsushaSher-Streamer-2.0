const AudioVisualizer = {
    init() {
        this.audioEnabled = false;
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.bindEvents();
    },

    bindEvents() {
        const audioControl = document.getElementById('audioControl');
        
        audioControl.addEventListener('click', () => {
            this.audioEnabled = !this.audioEnabled;
            
            if (this.audioEnabled) {
                this.backgroundMusic.play().catch(e => {
                    console.log('Audio play failed:', e);
                });
                audioControl.innerHTML = '<i class="fas fa-volume-up"></i> Музыка';
                this.createAudioVisualizer();
            } else {
                this.backgroundMusic.pause();
                audioControl.innerHTML = '<i class="fas fa-volume-mute"></i> Музыка';
                document.getElementById('audioVisualizer').innerHTML = '';
            }
        });
    },

    createAudioVisualizer() {
        const visualizer = document.getElementById('audioVisualizer');
        visualizer.innerHTML = '';
        
        for (let i = 0; i < 40; i++) {
            const bar = document.createElement('div');
            bar.className = 'visualizer-bar';
            bar.style.height = `${Math.random() * 40 + 10}px`;
            visualizer.appendChild(bar);
        }
        
        this.animateBars();
    },

    animateBars() {
        if (!this.audioEnabled) return;
        
        const bars = document.querySelectorAll('.visualizer-bar');
        bars.forEach(bar => {
            bar.style.height = `${Math.random() * 40 + 10}px`;
        });
        
        setTimeout(() => this.animateBars(), 100);
    }
};
