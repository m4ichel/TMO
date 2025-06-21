// This is the only place where button event listeners should be defined
document.addEventListener('DOMContentLoaded', function() {
    console.log('Area buttons script loaded');
    
    // Get all the buttons
    const postItButton = document.getElementById('post-it-button');
    const shapesButton = document.getElementById('shapes-button');
    const tierListButton = document.getElementById('tier-list-button');
    const calendarButton = document.getElementById('calendar-button');
    
    // Add click event listeners
    if (postItButton) {
        postItButton.addEventListener('click', function() {
            console.log('Post-it button clicked'); // Debug log
            createElement('post-it', 0);
        });
    } else {
        console.error('Post-it button not found');
    }
    
    if (shapesButton) {
        shapesButton.addEventListener('click', function() {
            console.log('Shapes button clicked'); // Debug log
            createElement('shapes', 3);
        });
    } else {
        console.error('Shapes button not found');
    }
    
    if (tierListButton) {
        tierListButton.addEventListener('click', function() {
            console.log('Tier list button clicked'); // Debug log
            createElement('tier list', 1);
        });
    } else {
        console.error('Tier list button not found');
    }
    
    if (calendarButton) {
        calendarButton.addEventListener('click', function() {
            console.log('Calendar button clicked'); // Debug log
            createElement('calendar', 2);
        });
    } else {
        console.error('Calendar button not found');
    }
});




