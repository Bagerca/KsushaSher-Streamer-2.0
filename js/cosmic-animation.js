// Cosmic animation with planets and orbits
const CosmicAnimation = {
    init() {
        this.loadSubscribers();
        this.arrangeSubscribers();
    },
    
    loadSubscribers() {
        // In real implementation, this would fetch from JSON
        this.subscribers = [
            { name: 'Sub1', avatar: 'assets/images/subscribers/avatar1.jpg' },
            { name: 'Sub2', avatar: 'assets/images/subscribers/avatar2.jpg' },
            // ... more subscribers
        ];
    },
    
    arrangeSubscribers() {
        const container = document.getElementById('subscriberAvatars');
        const radius = 200;
        const angleStep = (2 * Math.PI) / this.subscribers.length;
        
        this.subscribers.forEach((subscriber, index) => {
            const angle = index * angleStep;
            const x = radius * Math.cos(angle) + radius;
            const y = radius * Math.sin(angle) + radius;
            
            const avatarElement = document.createElement('img');
            avatarElement.className = 'subscriber-avatar';
            avatarElement.src = subscriber.avatar;
            avatarElement.alt = subscriber.name;
            avatarElement.style.left = `${x}px`;
            avatarElement.style.top = `${y}px`;
            
            container.appendChild(avatarElement);
        });
    }
};
