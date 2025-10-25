const ReptileCursor = {
    init() {
        this.foundSecrets = 0;
        this.totalSecrets = document.querySelectorAll('.secret-element').length;
        this.bindSecretEvents();
    },

    bindSecretEvents() {
        document.querySelectorAll('.secret-element').forEach(element => {
            element.addEventListener('click', () => {
                element.style.opacity = '0.8';
                element.style.transform = 'scale(1.5)';
                this.foundSecrets++;
                
                if (this.foundSecrets === this.totalSecrets) {
                    this.activateReptileCursor();
                }
                
                setTimeout(() => {
                    element.style.display = 'none';
                }, 1000);
            });
        });
    },

    activateReptileCursor() {
        document.body.style.cursor = 'none';
        alert('Поздравляем! Вы нашли все секреты! Активен курсор-рептилия!');
        
        // Здесь можно добавить более сложную логику для курсора-рептилии
        const reptile = document.createElement('div');
        reptile.innerHTML = '🦎';
        reptile.style.position = 'fixed';
        reptile.style.fontSize = '24px';
        reptile.style.pointerEvents = 'none';
        reptile.style.zIndex = '10000';
        document.body.appendChild(reptile);
        
        document.addEventListener('mousemove', (e) => {
            reptile.style.left = (e.clientX + 10) + 'px';
            reptile.style.top = (e.clientY + 10) + 'px';
        });
    }
};
