document.addEventListener('DOMContentLoaded', function() {
    console.log('Drag elements script loaded');
    
    // Initialize the container for tracking draggable elements
    const container = document.getElementById('elements-container');
    
    // Variables to track dragging state
    let isDragging = false;
    let currentElement = null;
    let initialX, initialY;
    let offsetX, offsetY;
    
    // Z-index management
    const Z_INDEX = {
        BACKGROUND_BASE: 10,  // Base z-index for calendars and tier lists
        FOREGROUND_BASE: 100, // Base z-index for post-its and shapes
        current: {
            background: 0,    // Current highest z-index in background layer
            foreground: 0     // Current highest z-index in foreground layer
        }
    };
    
    // Function to determine if an element belongs to the foreground layer
    function isForegroundElement(element) {
        return element.classList.contains('card') || 
               element.hasAttribute('style') && element.getAttribute('style').includes('border-radius: 9999px');
    }
    
    // Function to update z-index of an element
    function updateZIndex(element) {
        if (isForegroundElement(element)) {
            // Increment foreground counter and set z-index
            Z_INDEX.current.foreground++;
            element.style.zIndex = Z_INDEX.FOREGROUND_BASE + Z_INDEX.current.foreground;
        } else {
            // Increment background counter and set z-index
            Z_INDEX.current.background++;
            element.style.zIndex = Z_INDEX.BACKGROUND_BASE + Z_INDEX.current.background;
        }
    }
    
    // Function to initialize z-indices for all elements
    function initializeZIndices() {
        // Reset counters
        Z_INDEX.current.background = 0;
        Z_INDEX.current.foreground = 0;
        
        // Get all elements
        const elements = container.querySelectorAll('.card, .tier-container, .calendar, [style*="border-radius: 9999px"]');
        
        // First pass: set base z-indices for each group
        elements.forEach(element => {
            if (isForegroundElement(element)) {
                element.style.zIndex = Z_INDEX.FOREGROUND_BASE;
            } else {
                element.style.zIndex = Z_INDEX.BACKGROUND_BASE;
            }
        });
    }
    
    // Function to make all elements draggable
    function makeElementsDraggable() {
        // Get all potential draggable elements
        const draggableElements = container.querySelectorAll('.card, .tier-container, .calendar, [style*="border-radius: 9999px"]');
        
        draggableElements.forEach(element => {
            // Skip if already initialized
            if (element.getAttribute('data-draggable') === 'true') return;
            
            // Mark as initialized
            element.setAttribute('data-draggable', 'true');
            
            // Set initial z-index based on element type
            if (isForegroundElement(element)) {
                element.style.zIndex = Z_INDEX.FOREGROUND_BASE;
            } else {
                element.style.zIndex = Z_INDEX.BACKGROUND_BASE;
            }
            
            // Add mousedown event listener
            element.addEventListener('mousedown', startDrag);
            
            // Add touch events for mobile
            element.addEventListener('touchstart', handleTouchStart, { passive: false });
            element.addEventListener('touchmove', handleTouchMove, { passive: false });
            element.addEventListener('touchend', endDrag);
        });
    }
    
    // Function to start dragging
    function startDrag(e) {
        // Prevent default behavior
        e.preventDefault();
        
        // Set current element
        currentElement = this;
        isDragging = true;
        
        // Initialize the moved flag
        currentElement.setAttribute('data-was-moved', 'false');
        
        // Update z-index to bring element to front of its layer
        updateZIndex(currentElement);
        
        // Get initial mouse position
        initialX = e.clientX;
        initialY = e.clientY;
        
        // Get current element position
        const elementRect = currentElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Store initial position for comparison later
        const initialPosX = elementRect.left - containerRect.left;
        const initialPosY = elementRect.top - containerRect.top;
        currentElement.setAttribute('data-initial-x', initialPosX);
        currentElement.setAttribute('data-initial-y', initialPosY);
        
        // Calculate offset (where in the element the mouse clicked)
        offsetX = initialX - elementRect.left;
        offsetY = initialY - elementRect.top;
        
        // Add event listeners for dragging
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        
        // Add active class for visual feedback
        currentElement.classList.add('dragging');
    }
    
    // Function to handle dragging
    function drag(e) {
        if (!isDragging) return;
        
        // Prevent default behavior
        e.preventDefault();
        
        // Calculate new position
        const containerRect = container.getBoundingClientRect();
        const x = e.clientX - containerRect.left - offsetX;
        const y = e.clientY - containerRect.top - offsetY;
        
        // Update element position
        currentElement.style.left = `${x}px`;
        currentElement.style.top = `${y}px`;
    }
    
    // Function to end dragging
    function endDrag() {
        if (!isDragging || !currentElement) return;
        
        // Remove event listeners
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);
        
        // Get initial and final positions
        const elementRect = currentElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const finalX = elementRect.left - containerRect.left;
        const finalY = elementRect.top - containerRect.top;
        
        // Calculate the distance moved
        const deltaX = Math.abs(finalX - parseFloat(currentElement.getAttribute('data-initial-x') || 0));
        const deltaY = Math.abs(finalY - parseFloat(currentElement.getAttribute('data-initial-y') || 0));
        
        // Only update position if moved more than 8px in any direction
        if (deltaX > 8 || deltaY > 8) {
            // Update position in database
            updateElementPosition(currentElement, finalX, finalY);
            
            // Set the moved flag to prevent popup from showing
            currentElement.setAttribute('data-was-moved', 'true');
        } else {
            // Reset to original position if movement was too small
            currentElement.style.left = `${currentElement.getAttribute('data-initial-x')}px`;
            currentElement.style.top = `${currentElement.getAttribute('data-initial-y')}px`;
        }
        
        // Remove active class
        currentElement.classList.remove('dragging');
        
        // Reset variables
        isDragging = false;
        currentElement = null;
    }
    
    // Touch event handlers
    function handleTouchStart(e) {
        const touch = e.touches[0];
        
        // Create a simulated mouse event
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        
        startDrag.call(this, mouseEvent);
        e.preventDefault(); // Prevent scrolling while dragging
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        
        const touch = e.touches[0];
        
        // Create a simulated mouse event
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        
        drag(mouseEvent);
        e.preventDefault(); // Prevent scrolling while dragging
    }
    
    function handleTouchEnd(e) {
        endDrag();
        e.preventDefault(); // Prevent any default behavior
    }
    
    // Function to update element position in the database
    function updateElementPosition(element, x, y) {
        // Extract element ID from the element
        let elementId = element.getAttribute('data-id');
        
        // If no ID is found, we can't update the database
        if (!elementId) {
            console.error('Element has no ID, position will not be saved');
            return;
        }
        
        // Get area ID from the URL
        const areaId = window.location.pathname.split('/').pop();
        
        // Send update to server
        fetch(`/api/element/${elementId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                position_x: Math.round(x),
                position_y: Math.round(y)
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Element position updated:', data);
        })
        .catch(error => {
            console.error('Error updating element position:', error);
        });
    }
    
    // Set up a mutation observer to make new elements draggable
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                makeElementsDraggable();
            }
        });
    });
    
    // Start observing the container for added elements
    observer.observe(container, { childList: true, subtree: true });
    
    // Initialize z-indices for existing elements
    initializeZIndices();
    
    // Initial call to make existing elements draggable
    makeElementsDraggable();
    
    // Add window resize handler to ensure elements stay within bounds
    window.addEventListener('resize', function() {
        const draggableElements = container.querySelectorAll('[data-draggable="true"]');
        
        draggableElements.forEach(element => {
            const elementRect = element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            // Check if element is outside container bounds
            if (elementRect.right > containerRect.right) {
                element.style.left = `${containerRect.width - elementRect.width}px`;
            }
            
            if (elementRect.bottom > containerRect.bottom) {
                element.style.top = `${containerRect.height - elementRect.height}px`;
            }
        });
    });
});

