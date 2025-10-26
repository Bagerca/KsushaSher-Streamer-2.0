// Модальное окно для игр/фильмов
import { Utils } from '../../core/utils.js';

let currentModalItem = null;

export function initModal() {
    const modal = document.getElementById('media-modal');
    const closeBtn = document.getElementById('close-modal');
    
    if (!modal || !closeBtn) return;

    // Закрытие модального окна
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

export function showModal(item) {
    const modal = document.getElementById('media-modal');
    if (!modal || !item) return;

    currentModalItem = item;

    // Заполняем данные
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-image').src = item.image;
    document.getElementById('modal-image').alt = item.title;
    document.getElementById('modal-description').textContent = item.description;
    
    // Рейтинг
    const ratingElement = document.getElementById('modal-rating');
    if (ratingElement) {
        ratingElement.innerHTML = Utils.generateStars(item.rating) + 
                                `<span>${item.rating}/5</span>`;
    }
    
    // Статус
    const statusElement = document.getElementById('modal-status');
    const statusTextElement = document.getElementById('modal-status-text');
    if (statusElement && statusTextElement) {
        const statusConfig = getStatusConfig(item.status);
        statusElement.className = `status-badge ${statusConfig.class}`;
        statusTextElement.textContent = statusConfig.text;
    }
    
    // Жанры
    const genresElement = document.getElementById('modal-genres');
    if (genresElement && item.genres) {
        genresElement.innerHTML = item.genres.map(genre => 
            `<span class="genre-tag">${genre}</span>`
        ).join('');
    }
    
    // Видео
    const videoElement = document.getElementById('modal-video');
    if (videoElement && item.videoId) {
        videoElement.src = `https://www.youtube.com/embed/${item.videoId}?autoplay=1&mute=1`;
    }

    // Показываем модальное окно
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Добавляем анимацию
    setTimeout(() => {
        modal.classList.add('show');
    }, 50);
}

export function closeModal() {
    const modal = document.getElementById('media-modal');
    if (!modal) return;

    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Останавливаем видео
        const videoElement = document.getElementById('modal-video');
        if (videoElement) {
            videoElement.src = '';
        }
        
        currentModalItem = null;
    }, 300);
}

function getStatusConfig(status) {
    const statusMap = {
        'completed': { class: 'completed', text: 'Пройдено' },
        'playing': { class: 'playing', text: 'Проходим' },
        'watching': { class: 'watching', text: 'Смотрим' },
        'watched': { class: 'watched', text: 'Посмотрено' },
        'dropped': { class: 'dropped', text: 'Брошено' },
        'on-hold': { class: 'on-hold', text: 'Под вопросом' }
    };
    
    return statusMap[status] || { class: '', text: status };
}

// Получение текущего элемента в модальном окне
export function getCurrentModalItem() {
    return currentModalItem;
}
