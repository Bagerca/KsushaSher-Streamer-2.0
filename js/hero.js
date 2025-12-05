// --- 1. ЭФФЕКТ ПЕЧАТНОЙ МАШИНКИ (НИЖНИЙ ЗАГОЛОВОК) ---
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


// --- 2. ПЕРЕКЛЮЧЕНИЕ ПРОФИЛЕЙ (С ПЕЧАТАНИЕМ ОПИСАНИЯ) ---
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

let descInterval; // Переменная для таймера печатания описания

// Функция печатания текста описания
function typeWriterDesc(text) {
    dDesc.textContent = ''; // Очищаем
    let i = 0;
    
    // Останавливаем предыдущую печать, если она была
    clearInterval(descInterval);
    
    // Начинаем новую
    descInterval = setInterval(() => {
        dDesc.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(descInterval);
        }
    }, 30); // Скорость печати (чем меньше, тем быстрее)
}

// Открыть профиль
function showSubscriber(id) {
    const data = subscribersData[id];
    if (data) {
        // Заполняем картинку и имя
        dImg.src = data.img;
        dName.textContent = data.name;
        
        // Описание не заполняем сразу, а запускаем машинку
        // Но делаем небольшую задержку (400мс), чтобы имя успело выехать
        setTimeout(() => {
            typeWriterDesc(data.desc);
        }, 400);

        // Переключение видов
        listView.style.display = 'none';
        
        // Перезапуск анимации блока
        detailView.style.display = 'none';
        setTimeout(() => {
            detailView.style.display = 'block';
        }, 10);
    }
}

// Вернуться назад
function showList() {
    clearInterval(descInterval); // Остановить печать, если не допечатало
    detailView.style.display = 'none';
    
    listView.style.display = 'none';
    setTimeout(() => {
        listView.style.display = 'block';
        listView.style.animation = 'fadeInText 0.3s ease forwards';
    }, 10);
}
