// --- 1. ПЕЧАТНАЯ МАШИНКА (СТАТИСТИКА) ---
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
document.addEventListener('DOMContentLoaded', typeEffect);


// --- 2. ЛОГИКА ПРАВОЙ ПАНЕЛИ (ОТРЯД) ---
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

const panelBox = document.getElementById('right-panel-box'); 
const defaultHeader = document.getElementById('default-header'); 
const backHeader = document.getElementById('back-header'); 

const listView = document.getElementById('sub-list-view');
const detailView = document.getElementById('sub-detail-view');

const dImg = document.getElementById('d-img');
const dName = document.getElementById('d-name');
const dDesc = document.getElementById('d-desc');

let descInterval; // Таймер для описания

// Функция печати описания
function typeWriterDesc(text) {
    dDesc.textContent = '';
    let i = 0;
    clearInterval(descInterval);
    descInterval = setInterval(() => {
        dDesc.textContent += text.charAt(i);
        i++;
        if (i >= text.length) clearInterval(descInterval);
    }, 30);
}

// ОТКРЫТЬ ПРОФИЛЬ (ВКЛЮЧИТЬ РОЗОВЫЙ РЕЖИМ)
function showSubscriber(id) {
    const data = subscribersData[id];
    if (data) {
        // 1. Меняем стиль панели на розовый
        panelBox.classList.add('pink-mode');

        // 2. Меняем заголовок
        defaultHeader.style.display = 'none';
        backHeader.style.display = 'flex';

        // 3. Заполняем данные
        dImg.src = data.img;
        dName.textContent = data.name;

        // 4. Скрываем список
        listView.style.display = 'none';
        
        // 5. Перезапускаем блок деталей (для CSS-анимаций)
        detailView.style.display = 'none';
        setTimeout(() => {
            detailView.style.display = 'block';
            // Запускаем печать описания
            setTimeout(() => typeWriterDesc(data.desc), 300);
        }, 10);
    }
}

// ВЕРНУТЬСЯ К СПИСКУ (ВКЛЮЧИТЬ ЗЕЛЕНЫЙ РЕЖИМ)
function showList() {
    // 1. Убираем розовый режим
    panelBox.classList.remove('pink-mode');

    // 2. Возвращаем заголовок
    backHeader.style.display = 'none';
    defaultHeader.style.display = 'flex';

    // Останавливаем печать
    clearInterval(descInterval);
    
    // 3. Скрываем детали
    detailView.style.display = 'none';
    listView.style.display = 'none';
    
    // 4. Показываем список с анимацией
    setTimeout(() => {
        listView.style.display = 'block';
        listView.style.animation = 'fadeInText 0.4s ease forwards';
    }, 10);
}
