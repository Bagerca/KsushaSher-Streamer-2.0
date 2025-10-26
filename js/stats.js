// Менеджер статистики и радар-чарта
class StatsManager {
    constructor() {
        this.statsData = {};
        this.radarChart = null;
        this.init();
    }

    async init() {
        await this.loadStats();
        this.createRadarChart();
        this.updateStatsCards();
        
        console.log('📊 Статистика инициализирована');
    }

    async loadStats() {
        try {
            const response = await fetch('data/stats.json');
            if (!response.ok) throw new Error('Stats not found');
            
            const data = await response.json();
            this.statsData = data;
        } catch (error) {
            console.warn('❌ Не удалось загрузить статистику, используем демо-данные');
            this.statsData = this.getDemoStats();
        }
    }

    getDemoStats() {
        return {
            followers: 5200,
            streams: 154,
            hours: 1000,
            years: 3,
            chatActivity: 280,
            loyalty: 95,
            gamesVariety: 25,
            metrics: {
                growthRate: 12,
                streamsPerWeek: 3.2,
                hoursPerYear: 250,
                engagementLevel: "high",
                contentDiversity: "excellent"
            }
        };
    }

    createRadarChart() {
        const ctx = document.getElementById('radarChart');
        if (!ctx) return;

        // Уничтожаем предыдущий график если существует
        if (this.radarChart) {
            this.radarChart.destroy();
        }

        const config = {
            type: 'radar',
            data: {
                labels: [
                    'Рост аудитории',
                    'Активность стримов', 
                    'Объем контента',
                    'Вовлеченность чата',
                    'Лояльность',
                    'Разнообразие игр'
                ],
                datasets: [{
                    label: 'Текущие показатели',
                    data: [
                        Math.min((this.statsData.followers / 10000) * 100, 100),
                        Math.min((this.statsData.streams / 500) * 100, 100),
                        Math.min((this.statsData.hours / 2000) * 100, 100),
                        Math.min((this.statsData.chatActivity / 500) * 100, 100),
                        Math.min((this.statsData.loyalty / 100) * 100, 100),
                        Math.min((this.statsData.gamesVariety / 50) * 100, 100)
                    ],
                    backgroundColor: 'rgba(57, 255, 20, 0.1)',
                    borderColor: '#39ff14',
                    borderWidth: 3,
                    pointBackgroundColor: '#39ff14',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }, {
                    label: 'Целевые показатели',
                    data: [100, 100, 100, 100, 100, 100],
                    backgroundColor: 'rgba(255, 45, 149, 0.05)',
                    borderColor: '#ff2d95',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointBackgroundColor: 'transparent',
                    pointBorderColor: 'transparent'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        min: 0,
                        ticks: {
                            display: false,
                            stepSize: 20
                        },
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.15)'
                        },
                        grid: {
                            color: 'rgba(255, 45, 149, 0.1)'
                        },
                        pointLabels: {
                            color: '#ffffff',
                            font: {
                                size: 11,
                                weight: '600'
                            },
                            backdropColor: 'rgba(7, 7, 17, 0.8)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 15, 25, 0.95)',
                        titleColor: '#39ff14',
                        bodyColor: '#ffffff',
                        borderColor: '#ff2d95',
                        callbacks: {
                            label: (context) => {
                                const labels = [
                                    `Подписчики: ${this.statsData.followers.toLocaleString()} (+${this.statsData.metrics.growthRate}%)`,
                                    `Стримы: ${this.statsData.streams} (${this.statsData.metrics.streamsPerWeek}/нед)`,
                                    `Контент: ${this.statsData.hours}+ часов`,
                                    `Чат: ${this.statsData.chatActivity} сообщ/час`,
                                    `Лояльность: ${this.statsData.loyalty}%`,
                                    `Игры: ${this.statsData.gamesVariety}+ проектов`
                                ];
                                return labels[context.dataIndex];
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        };

        this.radarChart = new Chart(ctx, config);
        
        // Обновляем центральное значение
        this.updateCenterValue();
    }

    updateStatsCards() {
        // Обновляем счетчики подписчиков
        const followersCount = document.getElementById('followersCount');
        if (followersCount) {
            this.animateCounter(followersCount, this.statsData.followers, 5.2);
        }

        // Обновляем счетчик стримов
        const streamsCount = document.getElementById('streamsCount');
        if (streamsCount) {
            streamsCount.textContent = this.statsData.streams;
        }

        // Обновляем счетчик часов
        const hoursCount = document.getElementById('hoursCount');
        if (hoursCount) {
            hoursCount.textContent = this.statsData.hours.toLocaleString() + '+';
        }
    }

    updateCenterValue() {
        const centerValue = document.getElementById('centerValue');
        if (centerValue) {
            centerValue.textContent = `${this.statsData.years}+`;
        }
    }

    animateCounter(element, target, duration = 2) {
        const start = 0;
        const increment = target / (duration * 60); // 60 FPS
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                current = target;
            }
            element.textContent = Math.floor(current).toLocaleString() + '+';
        }, 1000 / 60);
    }

    // Метод для обновления статистики
    async refreshStats() {
        await this.loadStats();
        this.createRadarChart();
        this.updateStatsCards();
    }

    // Метод для добавления новых данных
    updateStats(newData) {
        this.statsData = { ...this.statsData, ...newData };
        this.createRadarChart();
        this.updateStatsCards();
    }

    // Метод для получения текущей статистики
    getStats() {
        return this.statsData;
    }

    // Метод для сброса к демо-данным
    resetToDemo() {
        this.statsData = this.getDemoStats();
        this.createRadarChart();
        this.updateStatsCards();
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.statsManager = new StatsManager();
});
