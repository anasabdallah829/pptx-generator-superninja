/**
 * File Upload JavaScript
 * Handles file upload functionality in step 1
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initFileUpload();
});

/**
 * Initialize file upload functionality
 */
function initFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-upload');
    const nextButton = document.getElementById('next-to-step-2');
    
    if (!uploadArea || !fileInput || !nextButton) return;
    
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
}

/**
 * Handle file selection from input or drop
 */
function handleFileSelection() {
    const fileInput = document.getElementById('file-upload');
    const uploadArea = document.getElementById('upload-area');
    const nextButton = document.getElementById('next-to-step-2');
    
    if (!fileInput || !fileInput.files.length) return;
    
    const file = fileInput.files[0];
    
    // Check if file is a zip file
    if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
        alert('الرجاء اختيار ملف مضغوط بصيغة ZIP فقط.');
        fileInput.value = '';
        return;
    }
    
    // Update upload area to show selected file
    uploadArea.innerHTML = `
        <i class="fas fa-file-archive"></i>
        <p>${file.name}</p>
        <span>${formatFileSize(file.size)}</span>
    `;
    
    // Enable next button
    nextButton.disabled = false;
    
    // Process the zip file
    processZipFile(file);
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
 * Process the uploaded zip file
 * @param {File} file - The uploaded zip file
 */
function processZipFile(file) {
    // In a real implementation, we would extract the zip file and process its contents
    // For this demo, we'll simulate the process
    
    console.log('Processing zip file:', file.name);
    
    // Store the file in the application state for later use
    window.appState = window.appState || {};
    window.appState.uploadedFile = file;
    
    // Simulate extracting slide data from the zip file
    simulateExtractSlideData(file);
}

/**
 * Simulate extracting slide data from the zip file
 * @param {File} file - The uploaded zip file
 */
function simulateExtractSlideData(file) {
    // In a real implementation, we would extract the actual data from the zip file
    // For this demo, we'll create sample slide data
    
    // Create sample slide data
    const slideData = {
        slides: [
            {
                id: 'slide-1',
                title: 'العنوان الرئيسي',
                elements: [
                    {
                        id: 'element-1',
                        type: 'title',
                        content: 'العنوان الرئيسي للشريحة',
                        position: { top: '10%', left: '10%', width: '80%', height: '15%' },
                        style: { fontSize: '32px', fontWeight: 'bold', textAlign: 'center' }
                    },
                    {
                        id: 'element-2',
                        type: 'text',
                        content: 'هذا نص توضيحي للشريحة. يمكن تعديل هذا النص أو الإبقاء عليه كما هو.',
                        position: { top: '30%', left: '10%', width: '80%', height: '20%' },
                        style: { fontSize: '18px', textAlign: 'right' }
                    },
                    {
                        id: 'element-3',
                        type: 'image',
                        src: 'placeholder-image.jpg',
                        position: { top: '55%', left: '25%', width: '50%', height: '30%' },
                        style: {}
                    },
                    {
                        id: 'element-4',
                        type: 'date',
                        format: 'DD/MM/YYYY',
                        position: { top: '90%', left: '10%', width: '30%', height: '5%' },
                        style: { fontSize: '14px', textAlign: 'right' }
                    }
                ],
                background: '#ffffff'
            },
            {
                id: 'slide-2',
                title: 'المحتوى',
                elements: [
                    {
                        id: 'element-5',
                        type: 'title',
                        content: 'محتوى العرض',
                        position: { top: '10%', left: '10%', width: '80%', height: '15%' },
                        style: { fontSize: '28px', fontWeight: 'bold', textAlign: 'center' }
                    },
                    {
                        id: 'element-6',
                        type: 'list',
                        content: [
                            'النقطة الأولى في القائمة',
                            'النقطة الثانية في القائمة',
                            'النقطة الثالثة في القائمة',
                            'النقطة الرابعة في القائمة'
                        ],
                        position: { top: '30%', left: '10%', width: '80%', height: '50%' },
                        style: { fontSize: '18px', textAlign: 'right' }
                    },
                    {
                        id: 'element-7',
                        type: 'date',
                        format: 'DD/MM/YYYY',
                        position: { top: '90%', left: '10%', width: '30%', height: '5%' },
                        style: { fontSize: '14px', textAlign: 'right' }
                    }
                ],
                background: '#f5f5f5'
            },
            {
                id: 'slide-3',
                title: 'الإحصائيات',
                elements: [
                    {
                        id: 'element-8',
                        type: 'title',
                        content: 'إحصائيات المشروع',
                        position: { top: '10%', left: '10%', width: '80%', height: '15%' },
                        style: { fontSize: '28px', fontWeight: 'bold', textAlign: 'center' }
                    },
                    {
                        id: 'element-9',
                        type: 'chart',
                        chartType: 'bar',
                        data: {
                            labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو'],
                            values: [65, 59, 80, 81, 56]
                        },
                        position: { top: '30%', left: '10%', width: '80%', height: '50%' },
                        style: {}
                    },
                    {
                        id: 'element-10',
                        type: 'text',
                        content: 'ملاحظة: هذه البيانات تمثيلية فقط',
                        position: { top: '85%', left: '10%', width: '80%', height: '5%' },
                        style: { fontSize: '14px', fontStyle: 'italic', textAlign: 'center' }
                    }
                ],
                background: '#ffffff'
            }
        ],
        statistics: {
            totalSlides: 3,
            totalElements: 10,
            totalImages: 1,
            totalCharts: 1
        }
    };
    
    // Store the slide data in the application state
    window.appState = window.appState || {};
    window.appState.slideData = slideData;
    
    console.log('Slide data extracted:', slideData);
}