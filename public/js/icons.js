document.addEventListener('DOMContentLoaded', function() {
  // Initialize all Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  } else {
    console.error('Lucide library not loaded');
  }
});

