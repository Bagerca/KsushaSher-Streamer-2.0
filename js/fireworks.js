// Система фейерверков
class Fireworks {
    constructor() {
        this.canvas = document.getElementById('fireworksCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isActive = false;
        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        console.log('🎆 Система фейерверков инициализирована');
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    launchFireworks(count = 1) {
        this.isActive = true;
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createFirework();
            }, i * 300);
        }

        // Автоматическое отключение через 5 секунд
        setTimeout(() => {
            this.isActive = false;
        }, 5000);
    }

    createFirework() {
        const x = Math.random() * this.canvas.width;
        const y = this.canvas.height;
        const targetY = Math.random() * this.canvas.height * 0.5;
        
        // Создаем снаряд
        const rocket = {
            x: x,
            y: y,
            targetY: targetY,
            velocity: 0,
            speed: 8 + Math.random() * 4,
            color: this.getRandomColor(),
            trail: []
        };

        // Анимация полета снаряда
        const rocketInterval = setInterval(() => {
            rocket.velocity += 0.1;
            rocket.y -= rocket.speed - rocket.velocity;
            
            // Добавляем точку в след
            rocket.trail.push({ x: rocket.x, y: rocket.y });
            if (rocket.trail.length > 10) {
                rocket.trail.shift();
            }

            // Взрыв при достижении цели
            if (rocket.y <= rocket.targetY) {
                clearInterval(rocketInterval);
                this.explode(rocket.x, rocket.y, rocket.color);
            }
        }, 30);
    }

    explode(x, y, color) {
        const particleCount = 100 + Math.random() * 50;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: x,
                y: y,
                velocity: {
                    x: (Math.random() - 0.5) * 8,
                    y: (Math.random() - 0.5) * 8
                },
                gravity: 0.1,
                life: 100 + Math.random() * 50,
                color: color,
                size: 2 + Math.random() * 3
            });
        }

        // Запускаем анимацию если она еще не запущена
        if (!this.animationFrame) {
            this.animate();
        }
    }

    animate() {
        this.animationFrame = requestAnimationFrame(() => this.animate());
        
        // Очищаем канвас с полупрозрачным фоном для эффекта шлейфа
        this.ctx.fillStyle = 'rgba(7, 7, 17, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Обновляем и рисуем частицы
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Обновляем позицию
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.velocity.y += particle.gravity;
            particle.life--;

            // Рисуем частицу
            this.ctx.globalAlpha = particle.life / 100;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Удаляем мертвые частицы
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        this.ctx.globalAlpha = 1;

        // Останавливаем анимацию когда частиц не осталось и фейерверк не активен
        if (this.particles.length === 0 && !this.isActive) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
            
            // Полностью очищаем канвас
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    getRandomColor() {
        const colors = [
            '#39ff14', '#ff2d95', '#00e5ff', '#b967ff',
            '#ff8c00', '#ffff00', '#ff00ff', '#00ffff'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Метод для запуска фейерверка в конкретной точке
    launchAt(x, y, color = null) {
        this.isActive = true;
        this.explode(x, y, color || this.getRandomColor());
        
        setTimeout(() => {
            this.isActive = false;
        }, 3000);
    }

    // Метод для остановки всех фейерверков
    stop() {
        this.isActive = false;
        this.particles = [];
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.fireworks = new Fireworks();
});
