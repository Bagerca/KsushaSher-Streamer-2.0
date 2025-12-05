// Подсветка текущего дня недели
const days = document.querySelectorAll('.day');
const today = new Date().getDay(); // 0 - воскресенье, 1 - понедельник и т.д.

days.forEach(day => {
    // Получаем номер дня из data-day
    const dayIndex = parseInt(day.getAttribute('data-day'));
    
    if (dayIndex === today) {
        day.classList.add('active-day');
    }
});
