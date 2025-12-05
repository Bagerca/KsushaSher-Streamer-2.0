// Эффект печатающегося текста для заголовка
const title = document.getElementById('hero-title');
const text = "KSUSHA__SHER";
let index = 0;

title.innerText = ""; // Очищаем

function typeWriter() {
    if (index < text.length) {
        title.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeWriter, 150);
    }
}

// Запуск при загрузке
window.addEventListener('load', typeWriter);
