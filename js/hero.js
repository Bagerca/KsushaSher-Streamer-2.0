// Hero секция с инь-янь и подписчиками
class HeroSection {
    constructor() {
        this.container = document.querySelector('.yin-yang-container');
        this.subscriberInfo = document.getElementById('subscriberInfo');
        this.subscribers = {
            bager: {
                name: 'BAGERca',
                role: 'Главный модератор',
                avatar: 'assets/images/bager.jpg',
                description: 'Основатель комьюнити, помогает с техническими вопросами и поддерживает порядок в чате. Всегда готов помочь новичкам.',
                stats: {
                    months: '24+',
                    messages: '8.7K',
                    streams: '156'
                }
            },
            tobeangle: {
                name: 'To Be Angle',
                role: 'Активный саппорт',
                avatar: 'assets/images/tobeangle.jpg',
                description: 'Постоянный зритель с первых дней. Активно участвует в чате и всегда поддерживает теплую атмосферу.',
                stats: {
                    months: '18+',
                    messages: '5.2K',
                    streams: '120'
                }
            },
            kiriki: {
                name: 'Kiriki',
                role: 'Легенда комьюнити',
                avatar: 'assets/images/kiriki.jpg',
                description: 'Душа компании. Организатор конкурсов и ивентов. Всегда приносит хорошее настроение на стримы.',
                stats: {
                    months: '28+',
                    messages: '10.3K',
                    streams: '210'
                }
            }
        };
        
        this.init();
    }

    init() {
        this.createOrbitalSubscribers();
        this.initSubscriberInteractions();
        this.startAnimations();
        
        console.log('🌌 Hero секция инициализирована');
    }

    createOrbitalSubscribers() {
        const orbits = document.querySelectorAll('.orbit');
        
        // Распределяем подписчиков по орбитам
        Object.keys(this.subscribers).forEach((subscriberId, index) => {
            const orbit = orbits[Math.min(index, orbits.length - 1)];
            const subscriberElement = orbit.querySelector(`[data-user="${subscriberId}"]`);
            
            if (subscriberElement) {
                this.setupSubscriberElement(subscriberElement, subscriberId);
            }
        });
    }

    setupSubscriberElement(element, subscriberId) {
        const subscriber = this.subscribers[subscriberId];
        
        // Устанавливаем аватар
        const img = element.querySelector('img');
        if (img && subscriber.avatar) {
            img.src = subscriber.avatar;
            img.alt = subscriber.name;
        }
        
        // Добавляем атрибуты для информации
        element.setAttribute('data-subscriber-info', JSON.stringify({
            name: subscriber.name,
            role: subscriber.role,
            avatar: subscriber.avatar,
            description: subscriber.description,
            stats: subscriber.stats
        }));
    }

    initSubscriberInteractions() {
        const subscribers = document.querySelectorAll('.subscriber');
        
        subscribers.forEach(subscriber => {
            subscriber.addEventListener('mouseenter', (e) => {
                this.showSubscriberInfo(e.target);
            });
            
            subscriber.addEventListener('mouseleave', () => {
                this.hideSubscriberInfo();
            });
            
            // Добавляем магнитный эффект
            subscriber.setAttribute('data-cursor-magnetic', 'true');
        });
        
        // Останавливаем анимацию при наведении на контейнер
        this.container.addEventListener('mouseenter', () => {
            this.pauseAnimations();
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.resumeAnimations();
        });
    }

    showSubscriberInfo(element) {
        const infoData = element.getAttribute('data-subscriber-info');
        
        if (!infoData) return;
        
        const subscriber = JSON.parse(infoData);
        
        // Заполняем информацию
        document.getElementById('subscriberName').textContent = subscriber.name;
        document.getElementById('subscriberRole').textContent = subscriber.role;
        document.getElementById('subscriberAvatar').src = subscriber.avatar;
        document.getElementById('subscriberDescription').textContent = subscriber.description;
        document.getElementById('statMonths').textContent = subscriber.stats.months;
        document.getElementById('statMessages').textContent = subscriber.stats.messages;
        document.getElementById('statStreams').textContent = subscriber.stats.streams;
        
        // Показываем панель
        this.subscriberInfo.classList.add('show');
    }

    hideSubscriberInfo() {
        this.subscriberInfo.classList.remove('show');
    }

    startAnimations() {
        // Запускаем вращение инь-янь
        const yinYang = document.querySelector('.yin-yang');
        if (yinYang) {
            yinYang.style.animation = 'rotate 20s linear infinite';
        }
        
        // Запускаем вращение орбит
        const orbits = document.querySelectorAll('.orbit');
        orbits.forEach((orbit, index) => {
            const duration = 30 + (index * 5); // Разная скорость для каждой орбиты
            orbit.style.animation = `orbit-rotate ${duration}s linear infinite`;
        });
    }

    pauseAnimations() {
        const animatedElements = document.querySelectorAll('.yin-yang, .orbit');
        
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }

    resumeAnimations() {
        const animatedElements = document.querySelectorAll('.yin-yang, .orbit');
        
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }

    // Метод для добавления нового подписчика
    addSubscriber(id, data) {
        this.subscribers[id] = data;
        
        // Находим свободную орбиту и создаем элемент
        this.createSubscriberElement(id, data);
    }

    createSubscriberElement(id, data) {
        // Находим орбиту с наименьшим количеством подписчиков
        const orbits = document.querySelectorAll('.orbit');
        let targetOrbit = orbits[0];
        let minSubscribers = Infinity;
        
        orbits.forEach(orbit => {
            const subscribersCount = orbit.querySelectorAll('.subscriber').length;
            if (subscribersCount < minSubscribers) {
                minSubscribers = subscribersCount;
                targetOrbit = orbit;
            }
        });
        
        // Создаем элемент подписчика
        const subscriberElement = document.createElement('div');
        subscriberElement.className = 'subscriber';
        subscriberElement.setAttribute('data-user', id);
        
        const angle = (Math.PI * 2 * Math.random()); // Случайный угол
        const radius = parseInt(targetOrbit.style.width) / 2 || 200;
        
        subscriberElement.style.left = `${50 + Math.cos(angle) * 50}%`;
        subscriberElement.style.top = `${50 + Math.sin(angle) * 50}%`;
        
        subscriberElement.innerHTML = `
            <img src="${data.avatar}" alt="${data.name}">
            <div class="subscriber-glow"></div>
        `;
        
        targetOrbit.appendChild(subscriberElement);
        this.setupSubscriberElement(subscriberElement, id);
    }

    // Метод для обновления информации о подписчике
    updateSubscriber(id, newData) {
        if (this.subscribers[id]) {
            this.subscribers[id] = { ...this.subscribers[id], ...newData };
            
            // Обновляем элемент если он существует
            const element = document.querySelector(`[data-user="${id}"]`);
            if (element) {
                this.setupSubscriberElement(element, id);
            }
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.heroSection = new HeroSection();
});
