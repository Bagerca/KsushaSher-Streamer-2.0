const ThemeManager = {
    init() {
        this.bindEvents();
        this.loadSavedTheme();
    },
    
    bindEvents() {
        document.querySelectorAll('.theme-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTheme(e.target.getAttribute('data-theme'));
            });
        });
    },
    
    switchTheme(theme) {
        document.body.classList.remove('theme-halloween', 'theme-christmas');
        
        if (theme !== 'main') {
            document.body.classList.add(`theme-${theme}`);
        }
        
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
        
        localStorage.setItem('selectedTheme', theme);
    },
    
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('selectedTheme') || 'main';
        this.switchTheme(savedTheme);
    }
};
