document.addEventListener('DOMContentLoaded', function() {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  
  // Default state
  let sidebarExpanded = false;
  
  sidebarToggle.addEventListener('click', function(e) {
    e.preventDefault();
    
    if (sidebarExpanded) {
      // Collapse sidebar
      sidebar.classList.remove('expanded');
      mainContent.classList.remove('sidebar-expanded');
    } else {
      // Expand sidebar
      sidebar.classList.add('expanded');
      mainContent.classList.add('sidebar-expanded');
    }
    
    sidebarExpanded = !sidebarExpanded;
  });
});
