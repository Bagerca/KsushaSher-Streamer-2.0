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
                    this.activateComplexReptileCursor();
                }
                
                setTimeout(() => {
                    element.style.display = 'none';
                }, 1000);
            });
        });
    },

    activateComplexReptileCursor() {
        // Activate the complex reptile cursor
        if (typeof ComplexReptileCursor !== 'undefined') {
            ComplexReptileCursor.init();
        }
        
        // Show success message
        this.showActivationMessage();
    },

    showActivationMessage() {
        const message = document.createElement('div');
        message.innerHTML = '🎉 Поздравляем! Вы нашли все секреты! Активен сложный курсор-рептилия! 🦎';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 255, 0, 0.9);
            color: black;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: bold;
            z-index: 10000;
            text-align: center;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
            animation: float 2s ease-in-out infinite;
        `;
        
        document.body.appendChild(message);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 5000);
    }
};
