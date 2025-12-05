// --- 1. ЭФФЕКТ ПЕЧАТНОЙ МАШИНКИ ---
const typingText = document.getElementById('typing-text');

const phrases = [
    "ПОДПИСЧИКОВ: 5.2K+",
    "ЛОЯЛЬНОСТЬ АУДИТОРИИ: 95%",
    "АТМОСФЕРА: УЮТНЫЙ ХАОС",
    "NEXT STREAM: ЗАВТРА 19:00"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000; 
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', typeEffect);


// --- 2. ПЕРЕКЛЮЧЕНИЕ ИНТЕРФЕЙСА ОТРЯДА ---
const subscribersData = {
    'bager': {
        name: 'BAGERca',
        img: 'assets/images/bager.jpg',
        desc: 'Технический гений и создатель этого сайта. Решает нерешаемые задачи и превращает код в магию. Всегда на страже стабильности.'
    },
    'kiriki': {
        name: 'Kiriki',
        img: 'assets/images/kiriki.jpg',
        desc: 'Главный поставщик мемов и хорошего настроения в чате. Знает лор всех игр лучше, чем сами разработчики.'
    }
};

const listView = document.getElementById('sub-list-view');
const detailView = document.getElementById('sub-detail-view');

const dImg = document.getElementById('d-img');
const dName = document.getElementById('d-name');
const dDesc = document.getElementById('d-desc');

// Функция: Открыть профиль подписчика с анимацией
function showSubscriber(id) {
    const data = subscribersData[id];
    if (data) {
        // 1. Заполняем данные
        dImg.src = data.img;
        dName.textContent = data.name;
        dDesc.textContent = data.desc;

        // 2. Скрываем список
        listView.style.display = 'none';

        // 3. Сбрасываем дисплей, чтобы перезапустить анимацию
        detailView.style.display = 'none';
        
        // Небольшая задержка для перезапуска CSS-анимаций
        setTimeout(() => {
            detailView.style.display = 'block';
        }, 10);
    }
}

// Функция: Вернуться к списку
function showList() {
    // Скрываем детали
    detailView.style.display = 'none';
    
    // Показываем список с легкой задержкой
    listView.style.display = 'none';
    setTimeout(() => {
        listView.style.display = 'block';
        // Добавляем простую анимацию появления списка
        listView.style.animation = 'fadeInText 0.3s ease forwards';
    }, 10);
}
