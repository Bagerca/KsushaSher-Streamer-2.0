// --- 1. ЭФФЕКТ ПЕЧАТНОЙ МАШИНКИ ---
const typingText = document.getElementById('typing-text');

// Фразы для перебора
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
        typeSpeed = 2000; // Пауза после написания
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500; // Пауза перед новой фразой
    }

    setTimeout(typeEffect, typeSpeed);
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', typeEffect);


// --- 2. МОДАЛЬНОЕ ОКНО (POPUP) ---
// Данные подписчиков
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

const modal = document.getElementById('sub-modal');
const mImg = document.getElementById('m-img');
const mName = document.getElementById('m-name');
const mDesc = document.getElementById('m-desc');

// Открыть окно
function openModal(id) {
    const data = subscribersData[id];
    if (data) {
        mImg.src = data.img;
        mName.textContent = data.name;
        mDesc.textContent = data.desc;
        modal.classList.add('active');
    }
}

// Закрыть окно
function closeModal(event) {
    if (event.target === modal || event.target.classList.contains('close-btn')) {
        modal.classList.remove('active');
    }
}
