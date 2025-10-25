const StatsRadar = {
    init() {
        this.createRadarChart();
    },

    createRadarChart() {
        const radarCtx = document.getElementById('radarChart').getContext('2d');
        
        // Check if Chart is defined
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded');
            return;
        }

        new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: ['Подписчики', 'Кол-во стримов', 'Новые игры', 'Просмотры', 'Активность чата', 'Донаты'],
                datasets: [{
                    label: 'Текущая статистика',
                    data: [85, 70, 90, 65, 80, 60],
                    backgroundColor: 'rgba(255, 0, 255, 0.2)',
                    borderColor: 'rgba(255, 0, 255, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 0, 255, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: '#fff' },
                        ticks: { 
                            backdropColor: 'transparent',
                            color: '#fff',
                            maxTicksLimit: 5
                        },
                        min: 0,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#fff' }
                    }
                }
            }
        });
    }
};
