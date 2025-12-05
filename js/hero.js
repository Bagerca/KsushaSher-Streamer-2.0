const typingText = document.getElementById('typing-text');

// СПИСОК ФРАЗ (Можешь менять на свои)
const phrases = [
    "ПОДПИСЧИКОВ: 5.2K+",
    "ЛОЯЛЬНОСТЬ АУДИТОРИИ: 95%",
    "АТМОСФЕРА: УЮТНЫЙ ХАОС",
    "NEXT STREAM: ЗАВТРА 19:00"
];

let phraseIndex = 0; // Какую фразу печатаем
let charIndex = 0;   // Какую букву печатаем
let isDeleting = false; // Режим стирания

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        // СТИРАЕМ
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // ПЕЧАТАЕМ
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    // Скорость печати
    let typeSpeed = isDeleting ? 50 : 100; // Стираем быстрее, чем пишем

    // Если слово напечатано полностью
    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000; // Ждем 2 секунды перед тем как стереть
        isDeleting = true;
    } 
    // Если слово стерто полностью
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length; // Переход к следующей фразе
        typeSpeed = 500; // Пауза перед началом нового слова
    }

    setTimeout(typeEffect, typeSpeed);
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', typeEffect);
