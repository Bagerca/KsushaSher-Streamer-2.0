// Игра Ghost Hunt для Хэллоуин темы
class GhostHunt {
    constructor() {
        this.canvas = document.getElementById('ghostCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ghosts = [];
        this.isActive = false;
        this.score = 0;
        this.ghostsCaught = 0;
        this.totalGhosts = 10;
        this.laser = {
            active: false,
            start: { x: 0, y: 0 },
            end: { x: 0, y: 0 }
        };
        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Слушаем движение мыши для лазера
        document.addEventListener('mousemove', (e) => {
            if (this.isActive) {
                this.laser.end.x = e.clientX;
                this.laser.end.y = e.clientY;
            }
        });

        // Слушаем клики для поимки призраков
        document.addEventListener('mousedown', (e) => {
            if (this.isActive) {
                this.laser.active = true;
                this.laser.start.x = e.clientX;
                this.laser.start.y = this.canvas.height;
                this.laser.end.x = e.clientX;
                this.laser.end.y = e.clientY;
            }
        });

        document.addEventListener('mouseup', () => {
            this.laser.active = false;
        });

        console.log('👻 Ghost Hunt инициализирован');
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    startGame() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.score = 0;
        this.ghostsCaught = 0;
        this.ghosts = [];
        
        // Создаем призраков
        for (let i = 0; i < this.totalGhosts; i++) {
            setTimeout(() => {
                this.createGhost();
            }, i * 2000);
        }

        this.animate();
        console.log('👻 Ghost Hunt начался!');
    }

    stopGame() {
        this.isActive = false;
        this.ghosts = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        console.log('👻 Ghost Hunt окончен');
    }

    createGhost() {
        if (!this.isActive || this.ghostsCaught >= this.totalGhosts) return;

        const ghost = {
            x: Math.random() * this.canvas.width,
            y: -50,
            size: 30 + Math.random() * 20,
            speed: 1 + Math.random() * 2,
            scared: false,
            opacity: 0.8,
            caught: false
        };

        this.ghosts.push(ghost);
    }

    animate() {
        if (!this.isActive) return;

        // Очищаем канвас
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Рисуем лазер если активен
        if (this.laser.active) {
            this.drawLaser();
            this.checkGhostCollisions();
        }

        // Обновляем и рисуем призраков
        for (let i = this.ghosts.length - 1; i >= 0; i--) {
            const ghost = this.ghosts[i];
            
            if (ghost.caught) {
                // Анимация исчезновения пойманного призрака
                ghost.opacity -= 0.05;
                if (ghost.opacity <= 0) {
                    this.ghosts.splice(i, 1);
                    continue;
                }
            } else {
                // Движение призрака
                ghost.y += ghost.speed;
                
                // Удаляем призраков вышедших за экран
                if (ghost.y > this.canvas.height + 100) {
                    this.ghosts.splice(i, 1);
                    continue;
                }
            }

            this.drawGhost(ghost);
        }

        // Проверяем условие победы
        if (this.ghostsCaught >= this.totalGhosts && this.ghosts.length === 0) {
            this.winGame();
        }

        requestAnimationFrame(() => this.animate());
    }

    drawLaser() {
        this.ctx.strokeStyle = '#39ff14';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.laser.start.x, this.laser.start.y);
        this.ctx.lineTo(this.laser.end.x, this.laser.end.y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Свечение лазера
        this.ctx.shadowColor = '#39ff14';
        this.ctx.shadowBlur = 10;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }

    drawGhost(ghost) {
        this.ctx.save();
        this.ctx.globalAlpha = ghost.opacity;

        // Тело призрака
        this.ctx.fillStyle = ghost.scared ? '#ff4444' : '#ffffff';
        
        // Рисуем призрака как серию кругов
        const bodyRadius = ghost.size / 2;
        this.ctx.beginPath();
        this.ctx.arc(ghost.x, ghost.y, bodyRadius, Math.PI, 0, false); // Верхняя половина
        
        // Волнистый низ
        const waveCount = 3;
        const waveHeight = bodyRadius * 0.3;
        
        for (let i = 0; i <= waveCount; i++) {
            const angle = Math.PI + (i * Math.PI) / waveCount;
            const x = ghost.x + Math.cos(angle) * bodyRadius;
            const y = ghost.y + Math.sin(angle) * bodyRadius + waveHeight * (i % 2 ? 1 : -1);
            
            if (i === 0) {
                this.ctx.lineTo(x, y);
            } else {
                this.ctx.quadraticCurveTo(
                    ghost.x + Math.cos(angle - Math.PI / waveCount / 2) * bodyRadius,
                    ghost.y + Math.sin(angle - Math.PI / waveCount / 2) * bodyRadius,
                    x, y
                );
            }
        }
        
        this.ctx.closePath();
        this.ctx.fill();

        // Глаза
        this.ctx.fillStyle = ghost.scared ? '#ffffff' : '#000000';
        const eyeSpacing = bodyRadius * 0.4;
        const eyeSize = bodyRadius * 0.2;
        
        // Левый глаз
        this.ctx.beginPath();
        this.ctx.arc(ghost.x - eyeSpacing, ghost.y - bodyRadius * 0.1, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Правый глаз
        this.ctx.beginPath();
        this.ctx.arc(ghost.x + eyeSpacing, ghost.y - bodyRadius * 0.1, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    checkGhostCollisions() {
        for (let i = 0; i < this.ghosts.length; i++) {
            const ghost = this.ghosts[i];
            
            if (ghost.caught) continue;

            // Проверяем пересечение лазера с призраком
            if (this.isPointNearLine(ghost.x, ghost.y, this.laser.start, this.laser.end, ghost.size)) {
                this.catchGhost(ghost);
            }
        }
    }

    isPointNearLine(px, py, lineStart, lineEnd, threshold) {
        // Вычисляем расстояние от точки до линии
        const A = px - lineStart.x;
        const B = py - lineStart.y;
        const C = lineEnd.x - lineStart.x;
        const D = lineEnd.y - lineStart.y;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        
        if (lenSq !== 0) {
            param = dot / lenSq;
        }

        let xx, yy;

        if (param < 0) {
            xx = lineStart.x;
            yy = lineStart.y;
        } else if (param > 1) {
            xx = lineEnd.x;
            yy = lineEnd.y;
        } else {
            xx = lineStart.x + param * C;
            yy = lineStart.y + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        
        return Math.sqrt(dx * dx + dy * dy) < threshold;
    }

    catchGhost(ghost) {
        ghost.scared = true;
        ghost.caught = true;
        this.ghostsCaught++;
        this.score += 100;

        // Создаем эффект частиц
        this.createCatchParticles(ghost.x, ghost.y);

        console.log(`👻 Пойман призрак! Всего: ${this.ghostsCaught}/${this.totalGhosts}`);
    }

    createCatchParticles(x, y) {
        // Создаем частицы при поимке призрака
        if (window.particles) {
            window.particles.createExplosion(x, y, 10, '#39ff14');
        }
    }

    winGame() {
        this.stopGame();
        console.log('🎉 Победа! Все призраки пойманы!');

        // Активируем секрет - рептилию
        this.activateSecret();
    }

    activateSecret() {
        // Здесь можно активировать секретную функцию
        // Например, показать сообщение или запустить особый эффект
        const secretMessage = document.createElement('div');
        secretMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #39ff14;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #39ff14;
            font-size: 1.5rem;
            z-index: 10000;
            text-align: center;
        `;
        secretMessage.innerHTML = '🎉 Секрет открыт!<br>Режим рептилии активирован!';
        document.body.appendChild(secretMessage);

        setTimeout(() => {
            document.body.removeChild(secretMessage);
        }, 3000);

        // Можно добавить активацию рептилии из предоставленного кода
        // setupLizard(...);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.ghostHunt = new GhostHunt();
});
