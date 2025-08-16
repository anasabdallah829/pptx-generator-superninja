/**
 * Upload JavaScript
 * Handles file upload functionality in step 1
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initFileUpload();
    checkPreviousSettings();
});

/**
 * Initialize file upload functionality
 */
function initFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('pptx-upload');
    
    if (!uploadArea || !fileInput) return;
    
    // Click on upload area to trigger file input
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Handle file selection
    fileInput.addEventListener('change', handleFileSelection);
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelection();
        }
    });
    
    // Handle previous settings button
    const usePreviousSettingsButton = document.getElementById('use-previous-settings');
    if (usePreviousSettingsButton) {
        usePreviousSettingsButton.addEventListener('click', usePreviousSettings);
    }
}

/**
 * Check if there are previous settings saved
 */
function checkPreviousSettings() {
    const previousSettingsContainer = document.getElementById('previous-settings-container');
    if (!previousSettingsContainer) return;
    
    const hasPrevSettings = hasPreviousSettings();
    previousSettingsContainer.style.display = hasPrevSettings ? 'block' : 'none';
}

/**
 * Handle file selection from input or drop
 */
function handleFileSelection() {
    const fileInput = document.getElementById('pptx-upload');
    const uploadArea = document.getElementById('upload-area');
    const uploadProgress = document.getElementById('upload-progress');
    const uploadError = document.getElementById('upload-error');
    
    if (!fileInput || !fileInput.files.length) return;
    
    const file = fileInput.files[0];
    
    // Check if file is a PowerPoint file
    if (!file.name.endsWith('.pptx')) {
        uploadError.textContent = 'الرجاء اختيار ملف PowerPoint بصيغة .pptx فقط.';
        uploadError.style.display = 'block';
        fileInput.value = '';
        return;
    }
    
    // Hide error message if it was shown
    uploadError.style.display = 'none';
    
    // Update upload area to show selected file
    uploadArea.innerHTML = `
        <i class="fas fa-file-powerpoint"></i>
        <p>${file.name}</p>
        <span>${formatFileSize(file.size)}</span>
    `;
    
    // Show progress bar
    uploadProgress.style.display = 'block';
    const progressBar = uploadProgress.querySelector('.progress-bar');
    const progressText = uploadProgress.querySelector('.progress-text');
    progressBar.style.width = '0%';
    progressText.textContent = 'جاري التحليل...';
    
    // Create FormData and upload the file
    const formData = new FormData();
    formData.append('pptx_file', file);
    
    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 5;
        if (progress > 90) {
            clearInterval(progressInterval);
        }
        progressBar.style.width = `${progress}%`;
    }, 100);
    
    // Upload the file
    fetch('/upload-pptx', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        clearInterval(progressInterval);
        
        if (data.success) {
            // Complete progress bar
            progressBar.style.width = '100%';
            progressText.textContent = 'تم التحليل بنجاح!';
            
            // Save slide analysis to localStorage for potential use later
            if (data.slide_analysis) {
                localStorage.setItem('currentSlideAnalysis', JSON.stringify(data.slide_analysis));
            }
            
            // Redirect to configure page after a short delay
            setTimeout(() => {
                window.location.href = data.redirect;
            }, 500);
        } else {
            // Show error
            uploadError.textContent = data.error || 'حدث خطأ أثناء تحليل الملف.';
            uploadError.style.display = 'block';
            uploadProgress.style.display = 'none';
            
            // Reset file input
            fileInput.value = '';
        }
    })
    .catch(error => {
        clearInterval(progressInterval);
        console.error('Error uploading file:', error);
        
        // Show error
        uploadError.textContent = 'حدث خطأ أثناء رفع الملف. الرجاء المحاولة مرة أخرى.';
        uploadError.style.display = 'block';
        uploadProgress.style.display = 'none';
        
        // Reset file input
        fileInput.value = '';
    });
}

/**
 * Format file size to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Use previous settings to generate the final output
 */
function usePreviousSettings() {
    const settings = loadSettings();
    
    if (settings) {
        // Show loading indicator
        showNotification('جاري استخدام الإعدادات السابقة...', 'info');
        
        // Send settings to server for one-step processing
        fetch('/use-previous-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // If successful, redirect to the process page with ready flag
                window.location.href = '/process?ready=true';
            } else {
                showNotification(data.error || 'حدث خطأ أثناء معالجة الإعدادات السابقة', 'error');
            }
        })
        .catch(error => {
            console.error('Error using previous settings:', error);
            showNotification('حدث خطأ أثناء معالجة الإعدادات السابقة', 'error');
        });
    } else {
        showNotification('لا يمكن العثور على إعدادات سابقة!', 'error');
    }
}