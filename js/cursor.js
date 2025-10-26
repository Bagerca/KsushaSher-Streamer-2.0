// Кастомный магнитный курсор
class MagneticCursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        this.follower = document.getElementById('cursorFollower');
        this.pos = { x: 0, y: 0 };
        this.followerPos = { x: 0, y: 0 };
        this.magneticElements = [];
        this.isPointer = false;
        this.isPressed = false;
        this.isText = false;
        
        this.init();
    }
    
    init() {
        // Скрываем стандартный курсор
        document.body.style.cursor = 'none';
        
        // Слушаем движение мыши
        document.addEventListener('mousemove', (e) => {
            this.pos.x = e.clientX;
            this.pos.y = e.clientY;
        });
        
        // Слушаем нажатия мыши
        document.addEventListener('mousedown', () => {
            this.isPressed = true;
            this.updateCursorState();
        });
        
        document.addEventListener('mouseup', () => {
            this.isPressed = false;
            this.updateCursorState();
        });
        
        // Находим магнитные элементы
        this.findMagneticElements();
        
        // Запускаем анимацию
        this.animate();
    }
    
    findMagneticElements() {
        // Элементы с атрибутом data-cursor-magnetic
        this.magneticElements = document.querySelectorAll('[data-cursor-magnetic]');
        
        // Автоматически находим кликабельные элементы
        const clickable = document.querySelectorAll(
            'a, button, .tab, .game-card, .subscriber, .dot-option, .main-dot, .toggle-expand, .filter-group select'
        );
        this.magneticElements = [...this.magneticElements, ...clickable];
        
        // Добавляем обработчики для магнитных элементов
        this.magneticElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.isPointer = true;
                this.updateCursorState();
                
                // Добавляем магнитный эффект для специальных элементов
                if (el.hasAttribute('data-cursor-magnetic')) {
                    this.cursor.classList.add('magnetic');
                    this.follower.classList.add('magnetic');
                }
            });
            
            el.addEventListener('mouseleave', () => {
                this.isPointer = false;
                this.updateCursorState();
                
                if (el.hasAttribute('data-cursor-magnetic')) {
                    this.cursor.classList.remove('magnetic');
                    this.follower.classList.remove('magnetic');
                }
            });
        });
        
        // Текстовые элементы
        const textElements = document.querySelectorAll(
            'p, h1, h2, h3, h4, h5, h6, span, li, .section-title, .game-title, .subscriber-name'
        );
        textElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.isText = true;
                this.updateCursorState();
            });
            
            el.addEventListener('mouseleave', () => {
                this.isText = false;
                this.updateCursorState();
            });
        });
    }
    
    updateCursorState() {
        // Убираем все классы состояний
        this.cursor.classList.remove('pointer', 'pressed', 'text', 'magnetic');
        this.follower.classList.remove('pointer', 'pressed', 'text', 'magnetic');
        
        // Добавляем соответствующие классы
        if (this.isPressed) {
            this.cursor.classList.add('pressed');
            this.follower.classList.add('pressed');
        } else if (this.isText) {
            this.cursor.classList.add('text');
            this.follower.classList.add('text');
        } else if (this.isPointer) {
            this.cursor.classList.add('pointer');
            this.follower.classList.add('pointer');
        }
    }
    
    animate() {
        // Плавное следование для курсора-фолловера
        this.followerPos.x += (this.pos.x - this.followerPos.x) * 0.1;
        this.followerPos.y += (this.pos.y - this.followerPos.y) * 0.1;
        
        // Обновляем позиции
        this.cursor.style.transform = `translate3d(${this.pos.x - 10}px, ${this.pos.y - 10}px, 0)`;
        this.follower.style.transform = `translate3d(${this.followerPos.x - 20}px, ${this.followerPos.y - 20}px, 0)`;
        
        // Магнитный эффект для специальных элементов
        this.magneticElements.forEach(el => {
            if (this.isElementHovered(el)) {
                this.applyMagneticEffect(el);
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    isElementHovered(el) {
        const rect = el.getBoundingClientRect();
        return (
            this.pos.x >= rect.left &&
            this.pos.x <= rect.right &&
            this.pos.y >= rect.top &&
            this.pos.y <= rect.bottom
        );
    }
    
    applyMagneticEffect(el) {
        if (!el.hasAttribute('data-cursor-magnetic')) return;
        
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distanceX = centerX - this.pos.x;
        const distanceY = centerY - this.pos.y;
        
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const maxDistance = 100;
        
        if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            const moveX = distanceX * force * 0.3;
            const moveY = distanceY * force * 0.3;
            
            this.cursor.style.transform = `translate3d(${this.pos.x - 10 + moveX}px, ${this.pos.y - 10 + moveY}px, 0)`;
            this.follower.style.transform = `translate3d(${this.followerPos.x - 20 + moveX}px, ${this.followerPos.y - 20 + moveY}px, 0)`;
        }
    }
    
    // Метод для принудительного обновления состояния
    update() {
        this.updateCursorState();
    }
    
    // Метод для уничтожения курсора (на мобильных)
    destroy() {
        document.body.style.cursor = 'auto';
        this.cursor.style.display = 'none';
        this.follower.style.display = 'none';
    }
}

// Инициализация курсора
let magneticCursor;

document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, не мобильное ли устройство
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        magneticCursor = new MagneticCursor();
        window.magneticCursor = magneticCursor;
    }
});

// Адаптация для мобильных устройств
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768 && magneticCursor) {
        magneticCursor.destroy();
    }
});
