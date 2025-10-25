const ScheduleManager = {
    init() {
        this.loadSchedule();
        this.highlightToday();
    },

    loadSchedule() {
        const scheduleData = [
            { day: 'monday', displayName: 'Понедельник', time: '19:00', activity: 'Прохождение Hollow Knight' },
            { day: 'tuesday', displayName: 'Вторник', time: '20:00', activity: 'Обзор инди-игр' },
            { day: 'wednesday', displayName: 'Среда', time: '18:00', activity: 'Коллаб с подписчиками' },
            { day: 'thursday', displayName: 'Четверг', time: '19:30', activity: 'Новая игра дня' },
            { day: 'friday', displayName: 'Пятница', time: '21:00', activity: 'Кино-вечер с обсуждением' },
            { day: 'saturday', displayName: 'Суббота', time: '17:00', activity: 'Марафон игр' },
            { day: 'sunday', displayName: 'Воскресенье', time: '15:00', activity: 'Вопрос-ответ и планы на неделю' }
        ];

        const container = document.getElementById('scheduleTable');
        let html = `
            <div class="schedule-row header">
                <div class="day">День</div>
                <div class="time">Время</div>
                <div class="activity">Активность</div>
                <div class="status">Статус</div>
            </div>
        `;

        scheduleData.forEach(item => {
            html += `
                <div class="schedule-row ${item.day}" data-day="${this.getDayNumber(item.day)}">
                    <div class="day">${item.displayName}</div>
                    <div class="time">${item.time}</div>
                    <div class="activity">${item.activity}</div>
                    <div class="status">
                        <div class="status-dot"></div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    getDayNumber(day) {
        const days = {
            'sunday': 0,
            'monday': 1,
            'tuesday': 2,
            'wednesday': 3,
            'thursday': 4,
            'friday': 5,
            'saturday': 6
        };
        return days[day];
    },

    highlightToday() {
        const today = new Date().getDay();
        document.querySelectorAll('.schedule-row').forEach(row => {
            row.classList.remove('today');
        });

        const todayRow = document.querySelector(`.schedule-row[data-day="${today}"]`);
        if (todayRow) {
            todayRow.classList.add('today');
        }
    }
};
