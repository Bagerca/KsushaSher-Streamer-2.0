const CosmicAnimation = {
    init() {
        this.arrangeSubscribers();
    },
    
    arrangeSubscribers() {
        const avatars = [
            'linear-gradient(45deg, #ff0000, #ff9900)',
            'linear-gradient(45deg, #00ff00, #00ccff)',
            'linear-gradient(45deg, #9900ff, #ff00cc)',
            'linear-gradient(45deg, #ffff00, #ff6600)',
            'linear-gradient(45deg, #00ffff, #0066ff)',
            'linear-gradient(45deg, #ff00ff, #cc00ff)'
        ];
        
        const container = document.getElementById('subscriberAvatars');
        container.innerHTML = '';
        
        const radius = 200;
        const angleStep = (2 * Math.PI) / avatars.length;
        
        avatars.forEach((avatarColor, index) => {
            const angle = index * angleStep;
            const x = radius * Math.cos(angle) + radius;
            const y = radius * Math.sin(angle) + radius;
            
            const avatarElement = document.createElement('div');
            avatarElement.className = 'subscriber-avatar';
            avatarElement.style.left = `${x}px`;
            avatarElement.style.top = `${y}px`;
            avatarElement.style.background = avatarColor;
            
            container.appendChild(avatarElement);
        });
    }
};
