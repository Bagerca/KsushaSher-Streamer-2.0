const btns = document.querySelectorAll('.lib-btn');
const grids = document.querySelectorAll('.lib-grid');

btns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Убираем активность у всех кнопок
        btns.forEach(b => b.classList.remove('active'));
        // Добавляем активность нажатой
        btn.classList.add('active');

        // Скрываем все сетки
        grids.forEach(g => {
            g.classList.add('hidden');
            g.classList.remove('active');
        });

        // Показываем нужную
        const targetId = btn.getAttribute('data-target');
        const targetGrid = document.getElementById(targetId);
        targetGrid.classList.remove('hidden');
        targetGrid.classList.add('active');
    });
});
