// Main initialization file
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    if (typeof ThemeManager !== 'undefined') ThemeManager.init();
    if (typeof CosmicAnimation !== 'undefined') CosmicAnimation.init();
    if (typeof ScheduleManager !== 'undefined') ScheduleManager.init();
    if (typeof MediaCards !== 'undefined') MediaCards.init();
    if (typeof StatsRadar !== 'undefined') StatsRadar.init();
    if (typeof AudioVisualizer !== 'undefined') AudioVisualizer.init();
    if (typeof ReptileCursor !== 'undefined') ReptileCursor.init();
    
    console.log('Ksusha Sher website initialized!');
});
