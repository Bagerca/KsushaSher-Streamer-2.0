// Настройка радара через Chart.js
const ctx = document.getElementById('radarChart').getContext('2d');

new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['AIM', 'IQ', 'Luck', 'Tilt', 'Charisma', 'Skill'],
        datasets: [{
            label: 'Ksusha',
            data: [70, 90, 100, 20, 95, 60],
            backgroundColor: 'rgba(255, 0, 255, 0.2)',
            borderColor: '#ff00ff',
            borderWidth: 2
        },
        {
            label: 'Boyfriend',
            data: [95, 80, 40, 60, 50, 90],
            backgroundColor: 'rgba(0, 255, 65, 0.2)',
            borderColor: '#00ff41',
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            r: {
                angleLines: { color: 'rgba(255,255,255,0.1)' },
                grid: { color: 'rgba(255,255,255,0.1)' },
                pointLabels: { color: 'white', font: { size: 14 } },
                ticks: { display: false, backdropColor: 'transparent' }
            }
        },
        plugins: {
            legend: { labels: { color: 'white' } }
        }
    }
});
