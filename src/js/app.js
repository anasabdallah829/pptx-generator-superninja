/**
 * Main Application JavaScript
 * Handles navigation between steps and overall application flow
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize application
    initApp();
    
    // Check for previous settings
    checkPreviousSettings();
});

/**
 * Initialize the application
 */
function initApp() {
    // Step navigation buttons
    const nextToStep2Button = document.getElementById('next-to-step-2');
    const backToStep1Button = document.getElementById('back-to-step-1');
    const nextToStep3Button = document.getElementById('next-to-step-3');
    const backToStep2Button = document.getElementById('back-to-step-2');
    const applyChangesButton = document.getElementById('apply-changes');
    
    // Add event listeners for navigation
    nextToStep2Button.addEventListener('click', () => navigateToStep(2));
    backToStep1Button.addEventListener('click', () => navigateToStep(1));
    nextToStep3Button.addEventListener('click', () => navigateToStep(3));
    backToStep2Button.addEventListener('click', () => navigateToStep(2));
    applyChangesButton.addEventListener('click', applyChanges);
    
    // Modal close buttons
    const closeModalButtons = document.querySelectorAll('.close-modal, .close-fullscreen');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('element-options-modal').style.display = 'none';
            document.getElementById('fullscreen-slideshow').style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        const elementModal = document.getElementById('element-options-modal');
        const fullscreenModal = document.getElementById('fullscreen-slideshow');
        
        if (event.target === elementModal) {
            elementModal.style.display = 'none';
        }
        
        if (event.target === fullscreenModal) {
            fullscreenModal.style.display = 'none';
        }
    });
    
    // Initialize fullscreen button
    document.getElementById('fullscreen-btn').addEventListener('click', openFullscreenSlideshow);
}

/**
 * Navigate to a specific step
 * @param {number} stepNumber - The step number to navigate to
 */
function navigateToStep(stepNumber) {
    // Hide all step content
    const stepContents = document.querySelectorAll('.step-content');
    stepContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Show the selected step content
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    
    // Update step indicators
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');
        
        if (stepNum === stepNumber) {
            step.classList.add('active');
        } else if (stepNum < stepNumber) {
            step.classList.add('completed');
        }
    });
    
    // Special actions for specific steps
    if (stepNumber === 2) {
        // When entering step 2, initialize the interactive slide
        initializeInteractiveSlide();
    } else if (stepNumber === 3) {
        // When entering step 3, initialize the slideshow preview
        initializeSlidePreview();
    }
}

/**
 * Apply changes and generate the final file
 */
function applyChanges() {
    // Get all settings and configurations
    const settings = collectAllSettings();
    
    // Save settings for future use
    saveSettings(settings);
    
    // Generate final output
    generateFinalOutput(settings);
    
    // Show success message
    alert('تم تطبيق التغييرات وإنتاج الملف النهائي بنجاح!');
}

/**
 * Collect all settings from the application
 * @returns {Object} The collected settings
 */
function collectAllSettings() {
    // This will be implemented in settings.js
    return {};
}

/**
 * Generate the final output file
 * @param {Object} settings - The settings to use for generation
 */
function generateFinalOutput(settings) {
    // This will be implemented in settings.js
    console.log('Generating final output with settings:', settings);
    
    // For now, we'll just simulate the process
    // In a real implementation, this would create the actual output file
    
    // Simulate processing time
    setTimeout(() => {
        console.log('Final output generated successfully');
    }, 1000);
}

/**
 * Open the fullscreen slideshow
 */
function openFullscreenSlideshow() {
    const fullscreenSlideshow = document.getElementById('fullscreen-slideshow');
    fullscreenSlideshow.style.display = 'block';
    
    // Copy current slide to fullscreen view
    const currentSlide = document.querySelector('#slideshow .slide.active');
    if (currentSlide) {
        const fullscreenSlide = document.getElementById('fullscreen-slide');
        fullscreenSlide.innerHTML = currentSlide.innerHTML;
    }
    
    // Update counter
    updateFullscreenCounter();
}

/**
 * Update the fullscreen slide counter
 */
function updateFullscreenCounter() {
    const counter = document.getElementById('slide-counter');
    const fullscreenCounter = document.getElementById('fullscreen-counter');
    
    if (counter && fullscreenCounter) {
        fullscreenCounter.textContent = counter.textContent;
    }
}

/**
 * Check if there are previous settings saved
 */
function checkPreviousSettings() {
    // This will be implemented in settings.js
    const hasPreviousSettings = localStorage.getItem('presentationSettings') !== null;
    
    // Show or hide the previous settings button
    const previousSettingsContainer = document.querySelector('.previous-settings-container');
    if (previousSettingsContainer) {
        previousSettingsContainer.style.display = hasPreviousSettings ? 'block' : 'none';
    }
    
    // Add event listener to the previous settings button
    const usePreviousSettingsButton = document.getElementById('use-previous-settings');
    if (usePreviousSettingsButton) {
        usePreviousSettingsButton.addEventListener('click', usePreviousSettings);
    }
}

/**
 * Use previous settings to generate the final output
 */
function usePreviousSettings() {
    // This will be implemented in settings.js
    const settings = loadSettings();
    
    if (settings) {
        // Generate final output using previous settings
        generateFinalOutput(settings);
        
        // Show success message
        alert('تم استخدام الإعدادات السابقة وإنتاج الملف النهائي بنجاح!');
    } else {
        alert('لا يمكن العثور على إعدادات سابقة!');
    }
}