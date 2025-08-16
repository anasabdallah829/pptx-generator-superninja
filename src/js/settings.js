/**
 * Settings JavaScript
 * Handles saving and loading template settings
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize settings functionality
    initSettings();
});

/**
 * Initialize settings functionality
 */
function initSettings() {
    // Check for previous settings
    checkPreviousSettings();
    
    // Add event listener to the previous settings button
    const usePreviousSettingsButton = document.getElementById('use-previous-settings');
    if (usePreviousSettingsButton) {
        usePreviousSettingsButton.addEventListener('click', usePreviousSettings);
    }
}

/**
 * Check if there are previous settings saved
 */
function checkPreviousSettings() {
    const hasPreviousSettings = localStorage.getItem('presentationSettings') !== null;
    
    // Show or hide the previous settings button
    const previousSettingsContainer = document.querySelector('.previous-settings-container');
    if (previousSettingsContainer) {
        previousSettingsContainer.style.display = hasPreviousSettings ? 'block' : 'none';
    }
}

/**
 * Save settings to local storage
 * @param {Object} settings - The settings to save
 */
function saveSettings(settings) {
    try {
        localStorage.setItem('presentationSettings', JSON.stringify(settings));
        console.log('Settings saved successfully');
        
        // Show the previous settings button
        const previousSettingsContainer = document.querySelector('.previous-settings-container');
        if (previousSettingsContainer) {
            previousSettingsContainer.style.display = 'block';
        }
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

/**
 * Load settings from local storage
 * @returns {Object|null} The loaded settings or null if not found
 */
function loadSettings() {
    try {
        const settingsJson = localStorage.getItem('presentationSettings');
        if (!settingsJson) return null;
        
        return JSON.parse(settingsJson);
    } catch (error) {
        console.error('Error loading settings:', error);
        return null;
    }
}

/**
 * Use previous settings to generate the final output
 */
function usePreviousSettings() {
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

/**
 * Collect all settings from the application
 * @returns {Object} The collected settings
 */
function collectAllSettings() {
    const appState = window.appState || {};
    const slideData = appState.slideData || {};
    
    // Get interactive slide settings
    const interactiveSlideElements = document.querySelectorAll('#interactive-slide .slide-element');
    const interactiveSlideSettings = [];
    
    interactiveSlideElements.forEach(element => {
        const elementId = element.id;
        const elementType = element.dataset.type;
        
        // Find the element data in the slide data
        const elementData = slideData.slides?.[0]?.elements?.find(e => e.id === elementId) || {};
        
        // Get element settings
        const settings = {
            id: elementId,
            type: elementType,
            position: {
                top: element.style.top,
                left: element.style.left,
                width: element.style.width,
                height: element.style.height
            },
            style: {
                fontSize: element.style.fontSize,
                fontWeight: element.style.fontWeight,
                textAlign: element.style.textAlign,
                color: element.style.color
            },
            keepOriginal: elementData.keepOriginal || false
        };
        
        // Add type-specific settings
        switch (elementType) {
            case 'title':
            case 'text':
                settings.content = element.innerHTML;
                break;
                
            case 'image':
                const img = element.querySelector('img');
                settings.src = img ? img.src : '';
                settings.style.objectFit = img ? img.style.objectFit : 'cover';
                break;
                
            case 'list':
                const listItems = Array.from(element.querySelectorAll('li')).map(li => li.textContent);
                settings.content = listItems;
                break;
                
            case 'chart':
                settings.chartType = elementData.chartType || 'bar';
                settings.data = elementData.data || { labels: [], values: [] };
                break;
                
            case 'date':
                settings.format = elementData.format || 'DD/MM/YYYY';
                break;
        }
        
        interactiveSlideSettings.push(settings);
    });
    
    // Collect all settings
    return {
        uploadedFile: appState.uploadedFile ? appState.uploadedFile.name : null,
        slideData: slideData,
        interactiveSlideSettings: interactiveSlideSettings,
        timestamp: new Date().toISOString()
    };
}

/**
 * Generate the final output file
 * @param {Object} settings - The settings to use for generation
 */
function generateFinalOutput(settings) {
    console.log('Generating final output with settings:', settings);
    
    // In a real implementation, this would create the actual output file
    // For this demo, we'll simulate the process
    
    // Create a download link for the simulated output
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'presentation_output.json';
    downloadLink.style.display = 'none';
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    setTimeout(() => {
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    }, 100);
}