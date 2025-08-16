/**
 * Process JavaScript
 * Handles the file processing functionality in step 3
 */

// Global variables
let outputFilename = null;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initProcessPage();
});

/**
 * Show loading overlay with custom message
 * @param {string} message - The message to display
 */
function showLoading(message = 'جاري المعالجة...') {
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingMessage = document.getElementById('loading-message');
    
    if (loadingMessage) {
        loadingMessage.textContent = message;
    }
    
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Initialize the process page
 */
function initProcessPage() {
    // Initialize navigation buttons
    const backButton = document.getElementById('back-to-step-2');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = '/configure';
        });
    }
    
    // Initialize file upload
    initZipFileUpload();
    
    // Initialize process button
    const startProcessingButton = document.getElementById('start-processing');
    if (startProcessingButton) {
        startProcessingButton.addEventListener('click', startProcessing);
    }
    
    // Initialize template settings export/import buttons
    const exportSettingsButton = document.getElementById('export-template-settings');
    if (exportSettingsButton) {
        exportSettingsButton.addEventListener('click', exportTemplateSettings);
    }
    
    const importSettingsButton = document.getElementById('import-template-settings');
    const importSettingsFile = document.getElementById('import-settings-file');
    if (importSettingsButton && importSettingsFile) {
        importSettingsButton.addEventListener('click', () => {
            importSettingsFile.click();
        });
        
        importSettingsFile.addEventListener('change', importTemplateSettings);
    }
    
    // Initialize template settings export/import buttons in results section
    const exportSettingsResultButton = document.getElementById('export-template-settings-result');
    if (exportSettingsResultButton) {
        exportSettingsResultButton.addEventListener('click', exportTemplateSettings);
    }
    
    const importSettingsResultButton = document.getElementById('import-template-settings-result');
    const importSettingsResultFile = document.getElementById('import-settings-file-result');
    if (importSettingsResultButton && importSettingsResultFile) {
        importSettingsResultButton.addEventListener('click', () => {
            importSettingsResultFile.click();
        });
        
        importSettingsResultFile.addEventListener('change', importTemplateSettings);
    }
    
    // Check if we're coming from "use previous settings"
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('ready') === 'true') {
        // Show notification that we're using previous settings
        showNotification('تم استخدام الإعدادات السابقة بنجاح. يرجى رفع ملف الصور للمتابعة.', 'success');
    }
    
    // Initialize download button
    const downloadResultButton = document.getElementById('download-result');
    if (downloadResultButton) {
        downloadResultButton.addEventListener('click', downloadResult);
    }
    
    // Initialize restart button
    const restartProcessButton = document.getElementById('restart-process');
    if (restartProcessButton) {
        restartProcessButton.addEventListener('click', restartProcess);
    }
    
    // Initialize fullscreen button
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', openFullscreenSlideshow);
    }
    
/**
 * Export template settings to a JSON file
 */
function exportTemplateSettings() {
    // Get current settings from localStorage
    const settings = loadSettings();
    
    if (!settings) {
        showNotification('لا توجد إعدادات محفوظة للتصدير!', 'error');
        return;
    }
    
    // Create a JSON file
    const settingsJson = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsJson], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_settings_' + new Date().toISOString().slice(0, 10) + '.json';
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
    
    showNotification('تم تصدير إعدادات القالب بنجاح!', 'success');
}

/**
 * Import template settings from a JSON file
 */
function importTemplateSettings() {
    const fileInput = document.getElementById('import-settings-file');
    
    if (!fileInput || !fileInput.files.length) {
        return;
    }
    
    const file = fileInput.files[0];
    
    // Check if file is a JSON file
    if (!file.name.endsWith('.json')) {
        showNotification('الرجاء اختيار ملف JSON صالح!', 'error');
        return;
    }
    
    // Read file content
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const settings = JSON.parse(e.target.result);
            
            // Validate settings structure
            if (!settings || !settings.images || !settings.texts) {
                throw new Error('بنية ملف الإعدادات غير صالحة!');
            }
            
            // Save settings to localStorage
            saveSettings(settings);
            
            // Update server-side settings
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
                    showNotification('تم استيراد إعدادات القالب بنجاح!', 'success');
                    
                    // Reload the page to apply settings
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    showNotification(data.error || 'حدث خطأ أثناء استيراد الإعدادات!', 'error');
                }
            })
            .catch(error => {
                console.error('Error importing settings:', error);
                showNotification('حدث خطأ أثناء استيراد الإعدادات!', 'error');
            });
        } catch (error) {
            console.error('Error parsing settings file:', error);
            showNotification('ملف الإعدادات غير صالح!', 'error');
        }
    };
    
    reader.readAsText(file);
}
    }
    }
    
    // Initialize slideshow navigation buttons
    const prevSlideBtn = document.getElementById('prev-slide');
    const nextSlideBtn = document.getElementById('next-slide');
    const fullscreenPrevBtn = document.getElementById('fullscreen-prev');
    const fullscreenNextBtn = document.getElementById('fullscreen-next');
    
    if (prevSlideBtn) prevSlideBtn.addEventListener('click', showPreviousSlide);
    if (nextSlideBtn) nextSlideBtn.addEventListener('click', showNextSlide);
    if (fullscreenPrevBtn) fullscreenPrevBtn.addEventListener('click', showPreviousSlideFullscreen);
    if (fullscreenNextBtn) fullscreenNextBtn.addEventListener('click', showNextSlideFullscreen);
    
    // Initialize fullscreen close button
    const closeFullscreenBtn = document.querySelector('.close-fullscreen');
    if (closeFullscreenBtn) {
        closeFullscreenBtn.addEventListener('click', closeFullscreenSlideshow);
    }
    
    // Close fullscreen when clicking outside
    window.addEventListener('click', (event) => {
        const fullscreenModal = document.getElementById('fullscreen-slideshow');
        if (event.target === fullscreenModal) {
            closeFullscreenSlideshow();
        }
    });
    
    // Display configuration summary
    updateProcessConfigSummary();
}

/**
 * Initialize zip file upload functionality
 */
function initZipFileUpload() {
    const uploadArea = document.getElementById('zip-upload-area');
    const fileInput = document.getElementById('zip-upload');
    const startProcessingButton = document.getElementById('start-processing');
    
    if (!uploadArea || !fileInput || !startProcessingButton) return;
    
    // Click on upload area to trigger file input
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Handle file selection
    fileInput.addEventListener('change', handleZipFileSelection);
    
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
            handleZipFileSelection();
        }
    });
}

/**
 * Handle zip file selection from input or drop
 */
function handleZipFileSelection() {
    const fileInput = document.getElementById('zip-upload');
    const uploadArea = document.getElementById('zip-upload-area');
    const startProcessingButton = document.getElementById('start-processing');
    const uploadError = document.getElementById('zip-upload-error');
    
    if (!fileInput || !fileInput.files.length) return;
    
    const file = fileInput.files[0];
    
    // Check if file is a zip file
    if (!file.name.endsWith('.zip')) {
        if (uploadError) {
            uploadError.textContent = 'الرجاء اختيار ملف مضغوط بصيغة ZIP فقط.';
            uploadError.style.display = 'block';
        }
        fileInput.value = '';
        return;
    }
    
    // Hide error message if it was shown
    if (uploadError) {
        uploadError.style.display = 'none';
    }
    
    // Update upload area to show selected file
    uploadArea.innerHTML = `
        <i class="fas fa-file-archive"></i>
        <p>${file.name}</p>
        <span>${formatFileSize(file.size)}</span>
    `;
    
    // Enable start processing button
    if (startProcessingButton) {
        startProcessingButton.disabled = false;
    }
}

/**
 * Update the process configuration summary
 */
function updateProcessConfigSummary() {
    const summaryContainer = document.getElementById('process-config-summary');
    if (!summaryContainer) return;
    
    // Check if placeholdersConfig is available (should be passed from the server)
    if (typeof placeholdersConfig === 'undefined' || !placeholdersConfig) {
        summaryContainer.innerHTML = '<p>لا توجد إعدادات متاحة.</p>';
        return;
    }
    
    let summaryHTML = '';
    
    // Images summary
    summaryHTML += '<div class="summary-section">';
    summaryHTML += '<h4>🖼️ إعدادات الصور:</h4>';
    
    let activeImages = 0;
    for (const key in placeholdersConfig.images) {
        const config = placeholdersConfig.images[key];
        if (config.use) {
            summaryHTML += `<div class="summary-item success">✅ صورة ${config.order}: سيتم استبدالها بالصورة رقم ${config.order} من كل مجلد</div>`;
            activeImages++;
        } else {
            summaryHTML += `<div class="summary-item info">⏭️ صورة: لن يتم استبدالها</div>`;
        }
    }
    
    if (activeImages === 0) {
        summaryHTML += '<div class="summary-item info">⚠️ لم يتم تحديد أي صور للاستبدال</div>';
    }
    
    summaryHTML += '</div>';
    
    // Texts summary
    summaryHTML += '<div class="summary-section">';
    summaryHTML += '<h4>📝 إعدادات النصوص:</h4>';
    
    let activeTexts = 0;
    for (const key in placeholdersConfig.texts) {
        const config = placeholdersConfig.texts[key];
        if (config.type !== 'ترك فارغ') {
            let valueText = '';
            
            if (config.type === 'نص ثابت') {
                valueText = config.value || 'غير محدد';
            } else if (config.type === 'تاريخ') {
                valueText = config.value === 'today' ? 'تاريخ اليوم' : config.value || 'غير محدد';
            } else if (config.type === 'تاريخ الصورة') {
                valueText = 'تاريخ الصورة الأولى';
            } else if (config.type === 'اسم المجلد') {
                valueText = 'اسم المجلد';
            }
            
            const keepOriginalText = config.keepOriginal ? ' (مع إبقاء النص الأصلي)' : '';
            
            summaryHTML += `<div class="summary-item success">✅ ${config.type}: ${valueText}${keepOriginalText}</div>`;
            activeTexts++;
        } else {
            summaryHTML += `<div class="summary-item info">⏭️ نص: سيترك فارغاً</div>`;
        }
    }
    
    if (activeTexts === 0) {
        summaryHTML += '<div class="summary-item info">ℹ️ جميع النصوص ستترك فارغة</div>';
    }
    
    summaryHTML += '</div>';
    
    // Update the summary container
    summaryContainer.innerHTML = summaryHTML;
}

/**
 * Start processing the files
 */
function startProcessing() {
    const fileInput = document.getElementById('zip-upload');
    const uploadProgress = document.getElementById('zip-upload-progress');
    const uploadError = document.getElementById('zip-upload-error');
    
    if (!fileInput || !fileInput.files.length) {
        if (uploadError) {
            uploadError.textContent = 'الرجاء اختيار ملف مضغوط أولاً.';
            uploadError.style.display = 'block';
        }
        return;
    }
    
    const file = fileInput.files[0];
    
    // Hide error message if it was shown
    if (uploadError) {
        uploadError.style.display = 'none';
    }
    
    // Show loading overlay
    showLoading('جاري معالجة ملف الصور...');
    
    // Show progress bar
    if (uploadProgress) {
        uploadProgress.style.display = 'block';
        const progressBar = uploadProgress.querySelector('.progress-bar');
        const progressText = uploadProgress.querySelector('.progress-text');
        if (progressBar) progressBar.style.width = '0%';
        if (progressText) progressText.textContent = 'جاري المعالجة...';
    }
    
    // Get options
    const imageOrder = document.querySelector('input[name="image-order"]:checked')?.value || 'alphabetical';
    const skipEmptyFolders = document.getElementById('skip-empty-folders')?.checked || true;
    
    // Create FormData and upload the file
    const formData = new FormData();
    formData.append('zip_file', file);
    formData.append('image_order', imageOrder);
    formData.append('skip_empty_folders', skipEmptyFolders);
    
    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 2;
        if (progress > 90) {
            clearInterval(progressInterval);
        }
        if (uploadProgress) {
            const progressBar = uploadProgress.querySelector('.progress-bar');
            if (progressBar) progressBar.style.width = `${progress}%`;
        }
    }, 200);
    
    // Upload the file and process
    fetch('/upload-zip', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        clearInterval(progressInterval);
        
        // Hide loading overlay
        hideLoading();
        
        if (data.success) {
            // Complete progress bar
            if (uploadProgress) {
                const progressBar = uploadProgress.querySelector('.progress-bar');
                const progressText = uploadProgress.querySelector('.progress-text');
                if (progressBar) progressBar.style.width = '100%';
                if (progressText) progressText.textContent = 'تم المعالجة بنجاح!';
            }
            
            // Save output filename
            outputFilename = data.output_filename;
            
            // Show results section
            showResults(data);
            
            // Show processing details
            showProcessingDetails(data.details);
            
            // Hide upload section
            const uploadContainer = document.querySelector('.upload-container');
            if (uploadContainer) {
                uploadContainer.style.display = 'none';
            }
            
            // Hide additional options
            const additionalOptions = document.querySelector('.additional-options');
            if (additionalOptions) {
                additionalOptions.style.display = 'none';
            }
            
            // Hide process buttons
            const processButtons = document.querySelector('.process-buttons');
            if (processButtons) {
                processButtons.style.display = 'none';
            }
            
            // Show success notification
            showNotification('تم معالجة الملفات بنجاح!', 'success');
        } else {
            // Hide loading overlay
            hideLoading();
            
            // Show error
            if (uploadError) {
                uploadError.textContent = data.error || 'حدث خطأ أثناء معالجة الملفات.';
                uploadError.style.display = 'block';
            }
            
            // Hide progress bar
            if (uploadProgress) {
                uploadProgress.style.display = 'none';
            }
            
            // Show processing details if available
            if (data.details) {
                showProcessingDetails(data.details);
            }
            
            // Show error notification
            showNotification('حدث خطأ أثناء معالجة الملفات', 'error');
        }
    })
    .catch(error => {
        clearInterval(progressInterval);
        console.error('Error processing files:', error);
        
        // Hide loading overlay
        hideLoading();
        
        // Show error
        if (uploadError) {
            uploadError.textContent = 'حدث خطأ أثناء معالجة الملفات. الرجاء المحاولة مرة أخرى.';
            uploadError.style.display = 'block';
        }
        
        // Hide progress bar
        if (uploadProgress) {
            uploadProgress.style.display = 'none';
        }
        
        // Show error notification
        showNotification('حدث خطأ أثناء معالجة الملفات', 'error');
    });
}

/**
 * Show processing results
 * @param {Object} data - The processing results data
 */
function showResults(data) {
    const resultsSection = document.getElementById('results-section');
    if (!resultsSection) return;
    
    // Show results section
    resultsSection.style.display = 'block';
    
    // Update statistics
    const slidesCount = document.getElementById('slides-count');
    const foldersCount = document.getElementById('folders-count');
    const imagesCount = document.getElementById('images-count');
    
    if (slidesCount) slidesCount.textContent = data.stats.created_slides;
    if (foldersCount) foldersCount.textContent = data.stats.processed_folders;
    if (imagesCount) imagesCount.textContent = data.stats.total_images;
    
    // Show processing details container
    const processingDetailsContainer = document.getElementById('processing-details-container');
    if (processingDetailsContainer) {
        processingDetailsContainer.style.display = 'block';
    }
    
    // TODO: Add preview slideshow functionality
    // For now, we'll just show a placeholder
    const previewSlideshow = document.getElementById('preview-slideshow');
    if (previewSlideshow) {
        previewSlideshow.style.display = 'block';
        
        // Create a placeholder slide
        const slideshowContent = document.getElementById('slideshow-content');
        if (slideshowContent) {
            slideshowContent.innerHTML = `
                <div class="slide active">
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                        <i class="fas fa-file-powerpoint" style="font-size: 64px; color: #3498db; margin-bottom: 20px;"></i>
                        <h3>تم إنشاء ${data.stats.created_slides} شريحة بنجاح</h3>
                        <p style="margin-top: 10px;">يمكنك تحميل الملف النهائي من خلال زر التحميل أدناه</p>
                    </div>
                </div>
            `;
        }
    }
}

/**
 * Show processing details
 * @param {Array} details - The processing details
 */
function showProcessingDetails(details) {
    const detailsContainer = document.getElementById('processing-details');
    if (!detailsContainer || !details) return;
    
    let detailsHTML = '';
    
    details.forEach(detail => {
        let iconClass = '';
        
        switch (detail.type) {
            case 'success':
                iconClass = 'fa-check-circle';
                break;
            case 'warning':
                iconClass = 'fa-exclamation-triangle';
                break;
            case 'error':
                iconClass = 'fa-exclamation-circle';
                break;
            default:
                iconClass = 'fa-info-circle';
        }
        
        detailsHTML += `
            <div class="detail-item ${detail.type}">
                <span class="detail-icon"><i class="fas ${iconClass}"></i></span>
                <span class="detail-message">${detail.message}</span>
            </div>
        `;
    });
    
    detailsContainer.innerHTML = detailsHTML;
}

/**
 * Download the result file
 */
function downloadResult() {
    if (!outputFilename) {
        showNotification('لا يوجد ملف للتحميل', 'error');
        return;
    }
    
    window.location.href = `/download/${outputFilename}`;
}

/**
 * Restart the process
 */
function restartProcess() {
    fetch('/reset')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                showNotification('حدث خطأ أثناء إعادة التشغيل', 'error');
            }
        })
        .catch(error => {
            console.error('Error restarting process:', error);
            showNotification('حدث خطأ أثناء إعادة التشغيل', 'error');
        });
}

/**
 * Show the previous slide
 */
function showPreviousSlide() {
    const slides = document.querySelectorAll('#slideshow-content .slide');
    if (!slides.length) return;
    
    let activeIndex = -1;
    slides.forEach((slide, index) => {
        if (slide.classList.contains('active')) {
            activeIndex = index;
        }
    });
    
    if (activeIndex > 0) {
        slides[activeIndex].classList.remove('active');
        slides[activeIndex - 1].classList.add('active');
        updateSlideCounter();
    }
}

/**
 * Show the next slide
 */
function showNextSlide() {
    const slides = document.querySelectorAll('#slideshow-content .slide');
    if (!slides.length) return;
    
    let activeIndex = -1;
    slides.forEach((slide, index) => {
        if (slide.classList.contains('active')) {
            activeIndex = index;
        }
    });
    
    if (activeIndex < slides.length - 1) {
        slides[activeIndex].classList.remove('active');
        slides[activeIndex + 1].classList.add('active');
        updateSlideCounter();
    }
}

/**
 * Update the slide counter
 */
function updateSlideCounter() {
    const counter = document.getElementById('slide-counter');
    if (!counter) return;
    
    const slides = document.querySelectorAll('#slideshow-content .slide');
    if (!slides.length) {
        counter.textContent = '0 / 0';
        return;
    }
    
    let activeIndex = -1;
    slides.forEach((slide, index) => {
        if (slide.classList.contains('active')) {
            activeIndex = index;
        }
    });
    
    if (activeIndex !== -1) {
        counter.textContent = `${activeIndex + 1} / ${slides.length}`;
    }
}

/**
 * Open the fullscreen slideshow
 */
function openFullscreenSlideshow() {
    const fullscreenSlideshow = document.getElementById('fullscreen-slideshow');
    if (!fullscreenSlideshow) return;
    
    fullscreenSlideshow.style.display = 'block';
    
    // Copy current slide to fullscreen view
    const currentSlide = document.querySelector('#slideshow-content .slide.active');
    if (currentSlide) {
        const fullscreenSlide = document.getElementById('fullscreen-slide');
        if (fullscreenSlide) {
            fullscreenSlide.innerHTML = currentSlide.innerHTML;
        }
    }
    
    // Update counter
    updateFullscreenCounter();
}

/**
 * Close the fullscreen slideshow
 */
function closeFullscreenSlideshow() {
    const fullscreenSlideshow = document.getElementById('fullscreen-slideshow');
    if (fullscreenSlideshow) {
        fullscreenSlideshow.style.display = 'none';
    }
}

/**
 * Show the previous slide in fullscreen mode
 */
function showPreviousSlideFullscreen() {
    showPreviousSlide();
    
    // Update fullscreen slide
    const currentSlide = document.querySelector('#slideshow-content .slide.active');
    if (currentSlide) {
        const fullscreenSlide = document.getElementById('fullscreen-slide');
        if (fullscreenSlide) {
            fullscreenSlide.innerHTML = currentSlide.innerHTML;
        }
    }
    
    // Update counter
    updateFullscreenCounter();
}

/**
 * Show the next slide in fullscreen mode
 */
function showNextSlideFullscreen() {
    showNextSlide();
    
    // Update fullscreen slide
    const currentSlide = document.querySelector('#slideshow-content .slide.active');
    if (currentSlide) {
        const fullscreenSlide = document.getElementById('fullscreen-slide');
        if (fullscreenSlide) {
            fullscreenSlide.innerHTML = currentSlide.innerHTML;
        }
    }
    
    // Update counter
    updateFullscreenCounter();
}

/**
 * Update the fullscreen counter
 */
function updateFullscreenCounter() {
    const counter = document.getElementById('slide-counter');
    const fullscreenCounter = document.getElementById('fullscreen-counter');
    
    if (counter && fullscreenCounter) {
        fullscreenCounter.textContent = counter.textContent;
    }
}