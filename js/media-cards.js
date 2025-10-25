const MediaCards = {
    init() {
        this.gamesData = [
            {
                title: "Hollow Knight",
                rating: "9/10",
                description: "Приключение в загадочном мире насекомых",
                videoUrl: "https://www.youtube.com/embed/UAO2urG23S4"
            },
            {
                title: "Stardew Valley",
                rating: "10/10",
                description: "Уютная ферма и жизнь в деревне",
                videoUrl: "https://www.youtube.com/embed/ot7uXNQskhs"
            },
            {
                title: "Celeste",
                rating: "8/10",
                description: "Сложная платформер-история о преодолении",
                videoUrl: "https://www.youtube.com/embed/iof5gjgGj20"
            },
            {
                title: "Undertale",
                rating: "9/10",
                description: "РПГ где можно не убивать врагов",
                videoUrl: "https://www.youtube.com/embed/1Hojv0m3TqA"
            },
            {
                title: "The Witcher 3",
                rating: "10/10",
                description: "Эпическое фэнтези-приключение",
                videoUrl: "https://www.youtube.com/embed/c0i88t0Kacs"
            },
            {
                title: "Portal 2",
                rating: "9/10",
                description: "Головоломки с порталами и юмор",
                videoUrl: "https://www.youtube.com/embed/tax4e4hBBZc"
            }
        ];

        this.moviesData = [
            {
                title: "Начало",
                rating: "9/10",
                description: "Сны внутри снов, Кристофер Нолан",
                videoUrl: "https://www.youtube.com/embed/YoHD9XEInc0"
            },
            {
                title: "Интерстеллар",
                rating: "10/10",
                description: "Космическое путешествие и время",
                videoUrl: "https://www.youtube.com/embed/zSWdZVtXT7E"
            }
        ];

        this.createMediaCards(this.gamesData, 'gamesGrid');
        this.createMediaCards(this.moviesData, 'moviesGrid');
        this.bindEvents();
    },

    createMediaCards(data, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'media-card';
            card.setAttribute('data-video', item.videoUrl);
            
            card.innerHTML = `
                <div class="card-image">
                    ${item.title.substring(0, 2)}
                    <div class="rating">${item.rating}</div>
                </div>
                <div class="card-content">
                    <h3>${item.title}</h3>
                    <p class="description">${item.description}</p>
                </div>
            `;
            
            card.addEventListener('click', () => {
                document.getElementById('videoPlayer').src = item.videoUrl;
                document.getElementById('videoModal').style.display = 'flex';
            });
            
            container.appendChild(card);
        });
    },

    bindEvents() {
        // Tab Switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.getAttribute('data-tab');
                
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                document.getElementById('gamesGrid').style.display = tab === 'games' ? 'grid' : 'none';
                document.getElementById('moviesGrid').style.display = tab === 'movies' ? 'grid' : 'none';
            });
        });

        // Expand/Collapse
        const expandButton = document.getElementById('expandButton');
        const mediaContainer = document.getElementById('mediaContainer');

        expandButton.addEventListener('click', () => {
            mediaContainer.classList.toggle('expanded');
            const arrow = expandButton.querySelector('.arrow');
            arrow.style.transform = mediaContainer.classList.contains('expanded') ? 'rotate(180deg)' : 'rotate(0deg)';
            expandButton.innerHTML = mediaContainer.classList.contains('expanded') ? 
                'Скрыть <span class="arrow">▼</span>' : 'Показать все <span class="arrow">▼</span>';
        });

        // Close Modal
        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('videoModal').style.display = 'none';
            document.getElementById('videoPlayer').src = '';
        });
    }
};
