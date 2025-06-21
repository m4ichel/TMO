// Element creation and manipulation functions
function createElement(title, typeId) {
    console.log(`Creating element: ${title} with typeId: ${typeId}`); // Debug log
    
    // Get random position within the main content area
    const container = document.getElementById('elements-container');
    const maxX = container.offsetWidth - 200;
    const maxY = container.offsetHeight - 200;
    const posX = Math.floor(Math.random() * maxX) + 50;
    const posY = Math.floor(Math.random() * maxY) + 50;
    
    // Get area ID from the current URL
    const areaId = window.location.pathname.split('/').pop();
    console.log(`Area ID: ${areaId}`); // Debug log
    
    // Create element via API
    fetch(`/api/element/area/${areaId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            type_id: typeId,
            area_id: areaId,
            title: `New ${title}`,
            details: `This is a new ${title} element`,
            position_x: posX,
            position_y: posY
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Element created successfully:', data); // Debug log
        // Add the new element to the page without refreshing
        addElementToPage(data, title);
    })
    .catch((error) => {
        console.error('Error creating element:', error);
        // Log the error but don't create a fallback element
        // This will prevent the "wrong" element from appearing
        
        // Uncomment the following if you want to create a fallback element
        // but only for development/testing purposes
        /*
        const fallbackElement = {
            id: 'temp-' + Date.now(),
            title: `New ${title}`,
            details: `This is a new ${title} element`,
            position_x: posX,
            position_y: posY
        };
        addElementToPage(fallbackElement, title);
        */
    });
}

function addElementToPage(element, elementType) {
    console.log(`Adding element to page: ${elementType}`, element); // Debug log
    
    const container = document.getElementById('elements-container');
    if (!container) {
        console.error('Elements container not found!');
        return;
    }
    
    // Set initial z-index based on element type
    let zIndex;
    if (elementType === 'post-it' || elementType === 'shapes') {
        zIndex = 100; // Foreground layer
    } else {
        zIndex = 10;  // Background layer
    }
    
    let elementHTML = '';
    
    switch(elementType) {
        case 'post-it':
            // Format the deadline date if it exists
            const deadlineDisplay = element.deadline ? 
                `<div class="card-deadline" style="position: absolute; bottom: 3px; right: 5px; font-size: 12px; color: rgba(255,255,255,0.9);">
                    Due: ${new Date(element.deadline).toLocaleDateString()}
                </div>` : '';
            
            elementHTML = `
                <div class="card" data-id="${element.id}" data-has-click-handler="false" data-deadline="${element.deadline || ''}" style="width: 180px; height: 180px; left: ${element.position_x}px; top: ${element.position_y}px; position: absolute; background-color: var(--color-primary); box-shadow: 2px 2px 5px rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; z-index: ${zIndex};">
                    <div class="card-content" style="display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative;">
                        <div class="card-title" style="font-weight: bold; margin-bottom: 5px; text-align: center;">${element.title}</div>
                        <div class="card-details" style="font-size: 12px; text-align: center;">${element.details}</div>
                        ${deadlineDisplay}
                    </div>
                </div>
            `;
            break;
        case 'shapes':
            elementHTML = `
                <div data-id="${element.id}" style="width: 150px; height: 150px; left: ${element.position_x}px; top: ${element.position_y}px; position: absolute; border-radius: 9999px; border: 5px white solid; background-color: rgba(255,255,255,0.1); z-index: ${zIndex};">
                </div>
            `;
            break;
        case 'tier list':
            elementHTML = `
                <div class="tier-container" data-id="${element.id}" style="left: ${element.position_x}px; top: ${element.position_y}px; position: absolute; width: 400px; background-color: rgba(0,0,0,0.2); border-radius: 10px; padding: 10px; z-index: ${zIndex};">
                    <div class="tier-row" style="height: 180px; margin-bottom: 12px;">
                        <div class="tier-box tier-s" style="height: 180px;">
                            <div class="tier-letter">S</div>
                        </div>
                        <div class="tier-content"></div>
                    </div>
                    <div class="tier-row" style="height: 180px; margin-bottom: 12px;">
                        <div class="tier-box tier-a" style="height: 180px;">
                            <div class="tier-letter">A</div>
                        </div>
                        <div class="tier-content"></div>
                    </div>
                    <div class="tier-row" style="height: 180px; margin-bottom: 12px;">
                        <div class="tier-box tier-b" style="height: 180px;">
                            <div class="tier-letter">B</div>
                        </div>
                        <div class="tier-content"></div>
                    </div>
                    <div class="tier-row" style="height: 180px;">
                        <div class="tier-box tier-c" style="height: 180px;">
                            <div class="tier-letter">C</div>
                        </div>
                        <div class="tier-content"></div>
                    </div>
                </div>
            `;
            break;
        case 'calendar':
            elementHTML = `
                <div class="calendar" data-id="${element.id}" style="width: 200px; height: 200px; left: ${element.position_x}px; top: ${element.position_y}px; position: absolute; background: var(--color-brown-dark); padding: 10px; border-radius: 10px; box-shadow: 2px 2px 5px rgba(0,0,0,0.3); z-index: ${zIndex};">
                    <div class="calendar-title" style="font-weight: bold; margin-bottom: 10px; color: white;">${element.title}</div>
                    <div class="calendar-content" style="color: white; font-size: 14px;">${element.details}</div>
                </div>
            `;
            break;
    }
    
    container.insertAdjacentHTML('beforeend', elementHTML);
    console.log('Element added to DOM'); // Debug log
    
    // Add click handlers for post-its after adding to DOM
    if (elementType === 'post-it') {
        addPostItClickHandlers();
    }
}

// Load existing elements when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded'); // Debug log
    
    // Load existing elements
    const areaId = window.location.pathname.split('/').pop();
    
    fetch(`/api/element/area/${areaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(elements => {
            console.log('Loaded elements:', elements); // Debug log
            elements.forEach(element => {
                // Determine element type based on type_id
                let elementType;
                switch(element.type_id) {
                    case 0: elementType = 'post-it'; break;
                    case 1: elementType = 'tier list'; break;
                    case 2: elementType = 'calendar'; break;
                    case 3: elementType = 'shapes'; break;
                    default: elementType = 'post-it';
                }
                
                addElementToPage(element, elementType);
            });
            
            // Add click handlers to all post-its after they're loaded
            addPostItClickHandlers();
        })
        .catch(error => {
            console.error('Error loading elements:', error);
        });
    
    // Add direct click handlers to buttons
    const postItButton = document.querySelector('.nav-item[onclick*="post-it"]');
    const shapesButton = document.querySelector('.nav-item[onclick*="shapes"]');
    const tierListButton = document.querySelector('.nav-item[onclick*="tier list"]');
    const calendarButton = document.querySelector('.nav-item[onclick*="calendar"]');
    
    if (postItButton) {
        postItButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Post-it button clicked'); // Debug log
            createElement('post-it', 0);
        });
    }
    
    if (shapesButton) {
        shapesButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Shapes button clicked'); // Debug log
            createElement('shapes', 3);
        });
    }
    
    if (tierListButton) {
        tierListButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Tier list button clicked'); // Debug log
            createElement('tier list', 1);
        });
    }
    
    if (calendarButton) {
        calendarButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Calendar button clicked'); // Debug log
            createElement('calendar', 2);
        });
    }
});

// Add this function to update existing tier lists
function updateExistingTierLists() {
    const existingTierLists = document.querySelectorAll('.tier-container');
    
    existingTierLists.forEach(tierList => {
        // Skip if already updated
        if (tierList.getAttribute('data-updated') === 'true') return;
        
        // Mark as updated
        tierList.setAttribute('data-updated', 'true');
        
        // Update the tier list structure
        const rows = tierList.querySelectorAll('.tier-row');
        
        rows.forEach(row => {
            // Set the height to match card elements
            row.style.height = '180px';
            row.style.marginBottom = '12px';
            row.style.borderRadius = '5px';
            row.style.overflow = 'hidden';
            
            // Update the tier box
            const tierBox = row.querySelector('.tier-box');
            if (tierBox) {
                tierBox.style.width = '60px';
                tierBox.style.height = '180px'; // Match the row height
                tierBox.style.minWidth = '60px';
                
                // Add border radius
                if (tierBox.classList.contains('tier-s') || 
                    tierBox.classList.contains('tier-a') || 
                    tierBox.classList.contains('tier-b') || 
                    tierBox.classList.contains('tier-c')) {
                    tierBox.style.borderTopLeftRadius = '5px';
                    tierBox.style.borderBottomLeftRadius = '5px';
                }
                
                // Update the letter
                const tierLetter = tierBox.querySelector('.tier-letter');
                if (tierLetter) {
                    tierLetter.style.fontSize = '32px';
                    tierLetter.style.fontFamily = 'Oxanium';
                    tierLetter.style.fontWeight = '700';
                    tierLetter.style.color = 'var(--color-text-light)'; // Update to use palette color
                }
            }
            
            // Update or create the content area
            let tierContent = row.querySelector('div:not(.tier-box)');
            if (!tierContent || !tierContent.classList.contains('tier-content')) {
                // Create a new content div if it doesn't exist or isn't properly classed
                if (tierContent) {
                    // Update existing div
                    tierContent.className = 'tier-content';
                } else {
                    // Create new div
                    tierContent = document.createElement('div');
                    tierContent.className = 'tier-content';
                    row.appendChild(tierContent);
                }
            }
            
            // Style the content area
            tierContent.style.flexGrow = '1';
            tierContent.style.height = '100%';
            tierContent.style.backgroundColor = 'rgba(223, 219, 216, 0.1)'; // Using text-light with transparency
            tierContent.style.borderTopRightRadius = '5px';
            tierContent.style.borderBottomRightRadius = '5px';
        });
    });
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Existing code...
    
    // Update existing tier lists
    updateExistingTierLists();
    
    // Also call this after elements are loaded from the server
    if (typeof loadElements === 'function') {
        const originalLoadElements = loadElements;
        loadElements = function() {
            originalLoadElements.apply(this, arguments);
            setTimeout(updateExistingTierLists, 100); // Short delay to ensure DOM is updated
        };
    }
});

// Update the addPostItClickHandlers function to check if element moved
function addPostItClickHandlers() {
    const postIts = document.querySelectorAll('.card[data-id]');
    
    postIts.forEach(postIt => {
        // Skip if this post-it already has a click handler
        if (postIt.getAttribute('data-has-click-handler') === 'true') return;
        
        postIt.addEventListener('click', function(e) {
            // Don't trigger when dragging
            if (document.querySelector('.dragging')) return;
            
            // Check if the element was moved during this interaction
            const wasMoved = postIt.getAttribute('data-was-moved') === 'true';
            
            // Reset the moved flag for next interaction
            postIt.setAttribute('data-was-moved', 'false');
            
            // Only show popup if element wasn't moved
            if (!wasMoved) {
                const id = this.getAttribute('data-id');
                const title = this.querySelector('.card-title').textContent;
                const details = this.querySelector('.card-details').textContent;
                const deadline = this.getAttribute('data-deadline') || null;
                
                displayPostItEditor(id, title, details, deadline);
            }
        });
        
        // Mark this post-it as having a click handler
        postIt.setAttribute('data-has-click-handler', 'true');
        
        // Initialize the moved flag
        postIt.setAttribute('data-was-moved', 'false');
    });
}

// Create a new function with a different name
function displayPostItEditor(id, title, details, deadline) {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    
    // Create popup content with a new design
    const popup = document.createElement('div');
    popup.className = 'popup-content';
    popup.style.backgroundColor = 'var(--color-primary-dark)';
    popup.style.padding = '25px';
    popup.style.borderRadius = '15px';
    popup.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4)';
    popup.style.width = '350px';
    popup.style.maxWidth = '90%';
    popup.style.position = 'relative';
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '15px';
    closeButton.style.right = '15px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.fontSize = '28px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = 'var(--color-text-light)';
    closeButton.style.lineHeight = '1';
    
    // Create popup header
    const popupHeader = document.createElement('div');
    popupHeader.style.marginBottom = '20px';
    popupHeader.style.borderBottom = '2px solid var(--color-primary-light)';
    popupHeader.style.paddingBottom = '10px';
    
    const popupTitle = document.createElement('h3');
    popupTitle.textContent = 'Edit Post-it';
    popupTitle.style.color = 'var(--color-text-light)';
    popupTitle.style.margin = '0';
    popupTitle.style.fontSize = '22px';
    
    popupHeader.appendChild(popupTitle);
    
    // Create editable title field
    const titleContainer = document.createElement('div');
    titleContainer.className = 'editable-field';
    titleContainer.style.marginBottom = '20px';
    
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Title';
    titleLabel.style.display = 'block';
    titleLabel.style.marginBottom = '5px';
    titleLabel.style.color = 'var(--color-text-light)';
    titleLabel.style.fontSize = '14px';
    titleLabel.style.fontWeight = 'bold';
    
    const titleField = document.createElement('div');
    titleField.className = 'editable-content';
    titleField.textContent = title;
    titleField.style.padding = '10px';
    titleField.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    titleField.style.borderRadius = '8px';
    titleField.style.color = 'var(--color-text-light)';
    titleField.style.cursor = 'pointer';
    titleField.style.transition = 'background-color 0.2s';
    titleField.style.position = 'relative';
    
    // Add edit icon to indicate it's editable
    const titleEditIcon = document.createElement('span');
    titleEditIcon.innerHTML = '✎';
    titleEditIcon.style.position = 'absolute';
    titleEditIcon.style.right = '10px';
    titleEditIcon.style.top = '50%';
    titleEditIcon.style.transform = 'translateY(-50%)';
    titleEditIcon.style.opacity = '0.5';
    
    titleField.appendChild(titleEditIcon);
    titleContainer.appendChild(titleLabel);
    titleContainer.appendChild(titleField);
    
    // Create editable details field
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'editable-field';
    detailsContainer.style.marginBottom = '20px';
    
    const detailsLabel = document.createElement('label');
    detailsLabel.textContent = 'Description';
    detailsLabel.style.display = 'block';
    detailsLabel.style.marginBottom = '5px';
    detailsLabel.style.color = 'var(--color-text-light)';
    detailsLabel.style.fontSize = '14px';
    detailsLabel.style.fontWeight = 'bold';
    
    const detailsField = document.createElement('div');
    detailsField.className = 'editable-content';
    detailsField.textContent = details;
    detailsField.style.padding = '10px';
    detailsField.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    detailsField.style.borderRadius = '8px';
    detailsField.style.color = 'var(--color-text-light)';
    detailsField.style.cursor = 'pointer';
    detailsField.style.minHeight = '80px';
    detailsField.style.transition = 'background-color 0.2s';
    detailsField.style.position = 'relative';
    
    // Add edit icon
    const detailsEditIcon = document.createElement('span');
    detailsEditIcon.innerHTML = '✎';
    detailsEditIcon.style.position = 'absolute';
    detailsEditIcon.style.right = '10px';
    detailsEditIcon.style.top = '10px';
    detailsEditIcon.style.opacity = '0.5';
    
    detailsField.appendChild(detailsEditIcon);
    detailsContainer.appendChild(detailsLabel);
    detailsContainer.appendChild(detailsField);
    
    // Create editable deadline field
    const deadlineContainer = document.createElement('div');
    deadlineContainer.className = 'editable-field';
    deadlineContainer.style.marginBottom = '20px';
    
    const deadlineLabel = document.createElement('label');
    deadlineLabel.textContent = 'Due Date';
    deadlineLabel.style.display = 'block';
    deadlineLabel.style.marginBottom = '5px';
    deadlineLabel.style.color = 'var(--color-text-light)';
    deadlineLabel.style.fontSize = '14px';
    deadlineLabel.style.fontWeight = 'bold';
    
    const deadlineField = document.createElement('div');
    deadlineField.className = 'editable-content';
    deadlineField.textContent = deadline ? new Date(deadline).toLocaleDateString() : 'Click to set a due date';
    deadlineField.style.padding = '10px';
    deadlineField.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    deadlineField.style.borderRadius = '8px';
    deadlineField.style.color = 'var(--color-text-light)';
    deadlineField.style.cursor = 'pointer';
    deadlineField.style.fontStyle = deadline ? 'normal' : 'italic';
    deadlineField.style.opacity = deadline ? '1' : '0.7';
    deadlineField.style.transition = 'background-color 0.2s';
    deadlineField.style.position = 'relative';
    
    // Add edit icon
    const deadlineEditIcon = document.createElement('span');
    deadlineEditIcon.innerHTML = '✎';
    deadlineEditIcon.style.position = 'absolute';
    deadlineEditIcon.style.right = '10px';
    deadlineEditIcon.style.top = '50%';
    deadlineEditIcon.style.transform = 'translateY(-50%)';
    deadlineEditIcon.style.opacity = '0.5';
    
    deadlineField.appendChild(deadlineEditIcon);
    deadlineContainer.appendChild(deadlineLabel);
    deadlineContainer.appendChild(deadlineField);
    
    // Add hover effects to editable fields
    const editableFields = [titleField, detailsField, deadlineField];
    editableFields.forEach(field => {
        field.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
        
        field.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
    });
    
    // Make title editable on click
    titleField.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = titleField.textContent.replace('✎', '').trim();
        input.style.width = '100%';
        input.style.padding = '10px';
        input.style.backgroundColor = 'var(--color-text-light)';
        input.style.border = 'none';
        input.style.borderRadius = '8px';
        input.style.fontSize = '16px';
        input.style.fontFamily = 'Oxanium, cursive';
        
        titleField.innerHTML = '';
        titleField.appendChild(input);
        input.focus();
        
        input.addEventListener('blur', function() {
            titleField.textContent = input.value;
            titleField.appendChild(titleEditIcon);
            
            // Save changes to the server
            updatePostIt(id, { title: input.value });
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    });
    
    // Make details editable on click
    detailsField.addEventListener('click', function() {
        const textarea = document.createElement('textarea');
        textarea.value = detailsField.textContent.replace('✎', '').trim();
        textarea.style.width = '100%';
        textarea.style.padding = '10px';
        textarea.style.backgroundColor = 'var(--color-text-light)';
        textarea.style.border = 'none';
        textarea.style.borderRadius = '8px';
        textarea.style.fontSize = '14px';
        textarea.style.fontFamily = 'Oxanium, cursive';
        textarea.style.minHeight = '80px';
        textarea.style.resize = 'vertical';
        
        detailsField.innerHTML = '';
        detailsField.appendChild(textarea);
        textarea.focus();
        
        textarea.addEventListener('blur', function() {
            detailsField.textContent = textarea.value;
            detailsField.appendChild(detailsEditIcon);
            
            // Save changes to the server
            updatePostIt(id, { details: textarea.value });
        });
    });
    
    // Make deadline editable on click
    deadlineField.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'date';
        if (deadline) {
            input.value = deadline.split('T')[0]; // Format YYYY-MM-DD
        }
        input.style.width = '100%';
        input.style.padding = '10px';
        input.style.backgroundColor = 'var(--color-text-light)';
        input.style.border = 'none';
        input.style.borderRadius = '8px';
        input.style.fontSize = '14px';
        input.style.fontFamily = 'Oxanium, cursive';
        
        deadlineField.innerHTML = '';
        deadlineField.appendChild(input);
        input.focus();
        
        input.addEventListener('blur', function() {
            let newDeadline = null;
            if (input.value) {
                newDeadline = input.value;
                deadlineField.textContent = new Date(input.value).toLocaleDateString();
                deadlineField.style.fontStyle = 'normal';
                deadlineField.style.opacity = '1';
            } else {
                deadlineField.textContent = 'Click to set a due date';
                deadlineField.style.fontStyle = 'italic';
                deadlineField.style.opacity = '0.7';
            }
            deadlineField.appendChild(deadlineEditIcon);
            
            // Save changes to the server
            updatePostIt(id, { deadline: newDeadline });
            
            // Update the post-it element's data-deadline attribute
            const postIt = document.querySelector(`.card[data-id="${id}"]`);
            if (postIt) {
                postIt.setAttribute('data-deadline', newDeadline || '');
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    });
    
    // Create save/close button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Close';
    saveButton.style.width = '100%';
    saveButton.style.padding = '12px';
    saveButton.style.backgroundColor = 'var(--color-text-light)';
    saveButton.style.color = 'var(--color-primary-dark)';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '8px';
    saveButton.style.fontSize = '16px';
    saveButton.style.fontWeight = 'bold';
    saveButton.style.cursor = 'pointer';
    saveButton.style.transition = 'transform 0.2s, background-color 0.2s';
    
    saveButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = 'white';
        this.style.transform = 'translateY(-2px)';
    });
    
    saveButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = 'var(--color-text-light)';
        this.style.transform = 'translateY(0)';
    });
    
    // Add close button event
    closeButton.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    // Add save button event
    saveButton.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    // Add click outside to close
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
    
    // Assemble popup
    popup.appendChild(closeButton);
    popup.appendChild(popupHeader);
    popup.appendChild(titleContainer);
    popup.appendChild(detailsContainer);
    popup.appendChild(deadlineContainer);
    popup.appendChild(saveButton);
    overlay.appendChild(popup);
    
    // Add to body
    document.body.appendChild(overlay);
}

// Function to update post-it data on the server
function updatePostIt(id, data) {
    console.log(`Updating post-it ${id} with data:`, data);
    
    fetch(`/api/element/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Post-it updated successfully:', data);
        
        // Update the post-it on the page
        const postIt = document.querySelector(`.card[data-id="${id}"]`);
        if (postIt) {
            if (data.title) {
                const titleElement = postIt.querySelector('.card-title');
                if (titleElement) titleElement.textContent = data.title;
            }
            if (data.details) {
                const detailsElement = postIt.querySelector('.card-details');
                if (detailsElement) detailsElement.textContent = data.details;
            }
            if (data.hasOwnProperty('deadline')) {
                // Update or add the deadline display
                let deadlineElement = postIt.querySelector('.card-deadline');
                
                if (data.deadline) {
                    const formattedDate = new Date(data.deadline).toLocaleDateString();
                    if (deadlineElement) {
                        deadlineElement.textContent = `Due: ${formattedDate}`;
                        deadlineElement.style.display = 'block';
                    } else {
                        // Create deadline element if it doesn't exist
                        const cardContent = postIt.querySelector('.card-content');
                        if (cardContent) {
                            deadlineElement = document.createElement('div');
                            deadlineElement.className = 'card-deadline';
                            deadlineElement.style.position = 'absolute';
                            deadlineElement.style.bottom = '3px';
                            deadlineElement.style.right = '5px';
                            deadlineElement.style.fontSize = '12px';
                            deadlineElement.style.color = 'rgba(255,255,255,0.9)';
                            deadlineElement.textContent = `Due: ${formattedDate}`;
                            cardContent.appendChild(deadlineElement);
                        }
                    }
                } else if (deadlineElement) {
                    // Hide deadline element if deadline is removed
                    deadlineElement.style.display = 'none';
                }
            }
        }
    })
    .catch((error) => {
        console.error('Error updating post-it:', error);
    });
}

// Update the addPostItClickHandlers function to pass deadline to showPostItPopup
function addPostItClickHandlers() {
    const postIts = document.querySelectorAll('.card[data-id]');
    
    postIts.forEach(postIt => {
        // Skip if this post-it already has a click handler
        if (postIt.getAttribute('data-has-click-handler') === 'true') return;
        
        postIt.addEventListener('click', function(e) {
            // Don't trigger when dragging
            if (document.querySelector('.dragging')) return;
            
            // Check if the element was moved during this interaction
            const wasMoved = postIt.getAttribute('data-was-moved') === 'true';
            
            // Reset the moved flag for next interaction
            postIt.setAttribute('data-was-moved', 'false');
            
            // Only show popup if element wasn't moved
            if (!wasMoved) {
                const id = this.getAttribute('data-id');
                const title = this.querySelector('.card-title').textContent;
                const details = this.querySelector('.card-details').textContent;
                const deadline = this.getAttribute('data-deadline') || null;
                
                displayPostItEditor(id, title, details, deadline);
            }
        });
        
        // Mark this post-it as having a click handler
        postIt.setAttribute('data-has-click-handler', 'true');
        
        // Initialize the moved flag
        postIt.setAttribute('data-was-moved', 'false');
    });
}

// Update the showPostItPopup function if needed
function showPostItPopup(id, title, details) {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    
    // Create popup content
    const popup = document.createElement('div');
    popup.className = 'popup-content';
    popup.style.backgroundColor = 'var(--color-primary)';
    popup.style.padding = '20px';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    popup.style.width = '300px';
    popup.style.maxWidth = '90%';
    popup.style.position = 'relative'; // For absolute positioning of close button
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = 'var(--color-text-light)';
    
    // Add title and details
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.style.marginBottom = '15px';
    titleElement.style.color = 'var(--color-text-light)';
    
    const detailsElement = document.createElement('p');
    detailsElement.textContent = details;
    detailsElement.style.marginBottom = '20px';
    detailsElement.style.color = 'var(--color-text-light)';
    
    // Add close button event
    closeButton.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    // Add click outside to close
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
    
    // Assemble popup
    popup.appendChild(closeButton);
    popup.appendChild(titleElement);
    popup.appendChild(detailsElement);
    overlay.appendChild(popup);
    
    // Add to body
    document.body.appendChild(overlay);
}















