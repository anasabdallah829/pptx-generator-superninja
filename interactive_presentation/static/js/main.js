/**
 * Main JavaScript file for the Interactive Presentation System
 * Contains shared functionality used across all pages
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initCollapsibles();
});

/**
 * Initialize collapsible sections
 */
function initCollapsibles() {
    const collapsibles = document.querySelectorAll('.collapsible');
    
    collapsibles.forEach(collapsible => {
        collapsible.addEventListener('click', function() {
            // Toggle the active class on the content
            const content = this.nextElementSibling;
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                this.querySelector('i.fas').classList.remove('fa-chevron-up');
                this.querySelector('i.fas').classList.add('fa-chevron-down');
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                this.querySelector('i.fas').classList.remove('fa-chevron-down');
                this.querySelector('i.fas').classList.add('fa-chevron-up');
            }
        });
    });
}

/**
 * Format a date according to the specified format
 * @param {Date} date - The date to format
 * @param {string} format - The format to use
 * @returns {string} The formatted date
 */
function formatDate(date, format) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    const monthNames = [
        'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    switch (format) {
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        case 'MM/DD/YYYY':
            return `${month}/${day}/${year}`;
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        case 'DD MMMM YYYY':
            return `${day} ${monthNames[date.getMonth()]} ${year}`;
        default:
            return `${day}/${month}/${year}`;
    }
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of message (success, error, info, warning)
 * @param {number} duration - How long to show the message in milliseconds
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Check if notification container exists, if not create it
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.left = '50%';
        notificationContainer.style.transform = 'translateX(-50%)';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.padding = '12px 20px';
    notification.style.margin = '10px 0';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 3px 6px rgba(0,0,0,0.16)';
    notification.style.animation = 'fadeIn 0.3s ease';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#2ecc71';
            notification.style.color = 'white';
            notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
            break;
        case 'error':
            notification.style.backgroundColor = '#e74c3c';
            notification.style.color = 'white';
            notification.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            break;
        case 'warning':
            notification.style.backgroundColor = '#f39c12';
            notification.style.color = 'white';
            notification.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
            break;
        default:
            notification.style.backgroundColor = '#3498db';
            notification.style.color = 'white';
            notification.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    }
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    }, duration);
}

/**
 * Check if there are previous settings saved in localStorage
 * @returns {boolean} Whether previous settings exist
 */
function hasPreviousSettings() {
    return localStorage.getItem('presentationSettings') !== null;
}

/**
 * Save settings to localStorage
 * @param {Object} settings - The settings to save
 */
function saveSettings(settings) {
    try {
        localStorage.setItem('presentationSettings', JSON.stringify(settings));
        console.log('Settings saved successfully');
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

/**
 * Load settings from localStorage
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
 * Navigate to a different page
 * @param {string} url - The URL to navigate to
 */
function navigateTo(url) {
    window.location.href = url;
}

/**
 * Get the Arabic name for an element type
 * @param {string} type - The element type
 * @returns {string} The Arabic name
 */
function getElementTypeName(type) {
    const typeNames = {
        'title': 'العنوان',
        'text': 'النص',
        'image': 'الصورة',
        'list': 'القائمة',
        'chart': 'المخطط البياني',
        'date': 'التاريخ',
        'regular_image': 'الصورة'
    };
    
    return typeNames[type] || 'العنصر';
}

/**
 * Get the icon for an element type
 * @param {string} type - The element type
 * @returns {string} The icon class
 */
function getElementTypeIcon(type) {
    const typeIcons = {
        'title': 'fa-heading',
        'text': 'fa-align-left',
        'image': 'fa-image',
        'list': 'fa-list',
        'chart': 'fa-chart-bar',
        'date': 'fa-calendar',
        'regular_image': 'fa-image'
    };
    
    return typeIcons[type] || 'fa-object-group';
}

/**
 * Update statistics display
 * @param {Object} statistics - The statistics data
 * @param {string} containerId - The ID of the container to update
 */
function updateStatistics(statistics, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create statistics items
    if (statistics) {
        Object.keys(statistics).forEach(key => {
            if (key === 'slide_dimensions') return;
            
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            
            let icon = '';
            let color = '';
            
            switch (key) {
                case 'image_placeholders':
                    icon = 'fa-image';
                    color = '#ff6b6b';
                    break;
                case 'text_placeholders':
                    icon = 'fa-align-left';
                    color = '#4ecdc4';
                    break;
                case 'title_placeholders':
                    icon = 'fa-heading';
                    color = '#45b7d1';
                    break;
                default:
                    icon = 'fa-info-circle';
                    color = '#3498db';
            }
            
            statItem.innerHTML = `
                <span class="stat-icon"><i class="fas ${icon}" style="color: ${color};"></i></span>
                <span class="stat-label">${getStatisticLabel(key)}:</span>
                <span class="stat-value">${Array.isArray(statistics[key]) ? statistics[key].length : statistics[key]}</span>
            `;
            
            container.appendChild(statItem);
        });
    }
}

/**
 * Get the Arabic label for a statistic
 * @param {string} key - The statistic key
 * @returns {string} The Arabic label
 */
function getStatisticLabel(key) {
    const labels = {
        'image_placeholders': 'مواضع الصور',
        'text_placeholders': 'مواضع النصوص',
        'title_placeholders': 'العناوين',
        'totalSlides': 'إجمالي الشرائح',
        'totalElements': 'إجمالي العناصر',
        'totalImages': 'إجمالي الصور',
        'totalCharts': 'إجمالي المخططات'
    };
    
    return labels[key] || key;
}