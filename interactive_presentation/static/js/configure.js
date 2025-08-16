/**
 * Configure JavaScript
 * Handles the interactive slide functionality in step 2
 */

// Global variables
let currentSelectedElement = null;
let placeholdersConfig = {
    images: {},
    texts: {}
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initConfigurePage();
});

/**
 * Initialize the configure page
 */
function initConfigurePage() {
    // Initialize navigation buttons
    const backButtons = document.querySelectorAll('#back-to-step-1, #back-to-step-1-bottom');
    const nextButtons = document.querySelectorAll('#next-to-step-3, #next-to-step-3-bottom');
    
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = '/';
        });
    });
    
    nextButtons.forEach(button => {
        button.addEventListener('click', saveConfigAndProceed);
    });
    
    // Initialize modal close button
    const closeModalButton = document.querySelector('.close-modal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeElementOptionsModal);
    }
    
    // Initialize modal buttons
    const saveElementOptionsButton = document.getElementById('save-element-options');
    const cancelElementOptionsButton = document.getElementById('cancel-element-options');
    
    if (saveElementOptionsButton) {
        saveElementOptionsButton.addEventListener('click', saveElementOptions);
    }
    
    if (cancelElementOptionsButton) {
        cancelElementOptionsButton.addEventListener('click', closeElementOptionsModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('element-options-modal');
        if (event.target === modal) {
            closeElementOptionsModal();
        }
    });
    
    // Initialize the interactive slide
    initializeInteractiveSlide();
}

/**
 * Initialize the interactive slide
 */
function initializeInteractiveSlide() {
    const interactiveSlide = document.getElementById('interactive-slide');
    
    if (!interactiveSlide) return;
    
    // Clear previous content
    interactiveSlide.innerHTML = '';
    
    // Set background color
    interactiveSlide.style.backgroundColor = '#ffffff';
    
    // Check if slideAnalysis is available (should be passed from the server)
    if (typeof slideAnalysis === 'undefined' || !slideAnalysis) {
        interactiveSlide.innerHTML = '<p class="no-data">لا توجد بيانات للشرائح. الرجاء رفع ملف صالح.</p>';
        return;
    }
    
    // Create elements for each placeholder
    createImagePlaceholders(slideAnalysis.image_placeholders, interactiveSlide);
    createTextPlaceholders(slideAnalysis.text_placeholders, interactiveSlide);
    createTitlePlaceholders(slideAnalysis.title_placeholders, interactiveSlide);
    
    // Update statistics
    updateStatistics(slideAnalysis, 'slide-statistics');
    
    // Initialize image placeholders configuration
    initImagePlaceholdersConfig(slideAnalysis.image_placeholders);
    
    // Initialize text placeholders configuration
    initTextPlaceholdersConfig(slideAnalysis.text_placeholders);
    
    // Update configuration summary
    updateConfigSummary();
}

/**
 * Create image placeholders in the interactive slide
 * @param {Array} imagePlaceholders - The image placeholders data
 * @param {HTMLElement} container - The container to add the placeholders to
 */
function createImagePlaceholders(imagePlaceholders, container) {
    if (!imagePlaceholders || !imagePlaceholders.length) return;
    
    imagePlaceholders.forEach((placeholder, index) => {
        const element = document.createElement('div');
        element.id = `element-${placeholder.id}`;
        element.className = `slide-element slide-element-image`;
        element.dataset.type = 'image';
        element.dataset.id = placeholder.id;
        
        // Set position and size
        element.style.position = 'absolute';
        element.style.top = `${placeholder.top_percent}%`;
        element.style.left = `${placeholder.left_percent}%`;
        element.style.width = `${placeholder.width_percent}%`;
        element.style.height = `${placeholder.height_percent}%`;
        
        // Create placeholder content
        const placeholderContent = document.createElement('div');
        placeholderContent.className = 'placeholder-content';
        placeholderContent.style.width = '100%';
        placeholderContent.style.height = '100%';
        placeholderContent.style.display = 'flex';
        placeholderContent.style.alignItems = 'center';
        placeholderContent.style.justifyContent = 'center';
        placeholderContent.style.flexDirection = 'column';
        placeholderContent.style.backgroundColor = 'rgba(255, 107, 107, 0.15)';
        placeholderContent.style.border = '2px dashed #ff6b6b';
        placeholderContent.style.borderRadius = '5px';
        
        placeholderContent.innerHTML = `
            <i class="fas fa-image" style="font-size: 24px; color: #ff6b6b; margin-bottom: 5px;"></i>
            <div style="font-size: 14px; color: #ff6b6b; font-weight: bold;">صورة ${index + 1}</div>
        `;
        
        element.appendChild(placeholderContent);
        
        // Make element interactive
        element.addEventListener('click', () => {
            selectElement(element, placeholder);
        });
        
        container.appendChild(element);
    });
}

/**
 * Create text placeholders in the interactive slide
 * @param {Array} textPlaceholders - The text placeholders data
 * @param {HTMLElement} container - The container to add the placeholders to
 */
function createTextPlaceholders(textPlaceholders, container) {
    if (!textPlaceholders || !textPlaceholders.length) return;
    
    textPlaceholders.forEach((placeholder, index) => {
        const element = document.createElement('div');
        element.id = `element-${placeholder.id}`;
        element.className = `slide-element slide-element-text`;
        element.dataset.type = 'text';
        element.dataset.id = placeholder.id;
        
        // Set position and size
        element.style.position = 'absolute';
        element.style.top = `${placeholder.top_percent}%`;
        element.style.left = `${placeholder.left_percent}%`;
        element.style.width = `${placeholder.width_percent}%`;
        element.style.height = `${placeholder.height_percent}%`;
        
        // Create placeholder content
        const placeholderContent = document.createElement('div');
        placeholderContent.className = 'placeholder-content';
        placeholderContent.style.width = '100%';
        placeholderContent.style.height = '100%';
        placeholderContent.style.display = 'flex';
        placeholderContent.style.alignItems = 'center';
        placeholderContent.style.justifyContent = 'center';
        placeholderContent.style.flexDirection = 'column';
        placeholderContent.style.backgroundColor = 'rgba(78, 205, 196, 0.15)';
        placeholderContent.style.border = '2px dashed #4ecdc4';
        placeholderContent.style.borderRadius = '5px';
        
        placeholderContent.innerHTML = `
            <i class="fas fa-align-left" style="font-size: 24px; color: #4ecdc4; margin-bottom: 5px;"></i>
            <div style="font-size: 14px; color: #4ecdc4; font-weight: bold;">نص ${index + 1}</div>
            <div style="font-size: 12px; color: #4ecdc4;">${placeholder.current_content}</div>
        `;
        
        element.appendChild(placeholderContent);
        
        // Make element interactive
        element.addEventListener('click', () => {
            selectElement(element, placeholder);
        });
        
        container.appendChild(element);
    });
}

/**
 * Create title placeholders in the interactive slide
 * @param {Array} titlePlaceholders - The title placeholders data
 * @param {HTMLElement} container - The container to add the placeholders to
 */
function createTitlePlaceholders(titlePlaceholders, container) {
    if (!titlePlaceholders || !titlePlaceholders.length) return;
    
    titlePlaceholders.forEach((placeholder, index) => {
        const element = document.createElement('div');
        element.id = `element-${placeholder.id}`;
        element.className = `slide-element slide-element-title`;
        element.dataset.type = 'title';
        element.dataset.id = placeholder.id;
        
        // Set position and size
        element.style.position = 'absolute';
        element.style.top = `${placeholder.top_percent}%`;
        element.style.left = `${placeholder.left_percent}%`;
        element.style.width = `${placeholder.width_percent}%`;
        element.style.height = `${placeholder.height_percent}%`;
        
        // Create placeholder content
        const placeholderContent = document.createElement('div');
        placeholderContent.className = 'placeholder-content';
        placeholderContent.style.width = '100%';
        placeholderContent.style.height = '100%';
        placeholderContent.style.display = 'flex';
        placeholderContent.style.alignItems = 'center';
        placeholderContent.style.justifyContent = 'center';
        placeholderContent.style.flexDirection = 'column';
        placeholderContent.style.backgroundColor = 'rgba(69, 183, 209, 0.15)';
        placeholderContent.style.border = '2px dashed #45b7d1';
        placeholderContent.style.borderRadius = '5px';
        
        placeholderContent.innerHTML = `
            <i class="fas fa-heading" style="font-size: 24px; color: #45b7d1; margin-bottom: 5px;"></i>
            <div style="font-size: 14px; color: #45b7d1; font-weight: bold;">عنوان</div>
            <div style="font-size: 12px; color: #45b7d1;">${placeholder.current_content}</div>
        `;
        
        element.appendChild(placeholderContent);
        
        // Make element interactive
        element.addEventListener('click', () => {
            selectElement(element, placeholder);
        });
        
        container.appendChild(element);
    });
}

/**
 * Initialize image placeholders configuration
 * @param {Array} imagePlaceholders - The image placeholders data
 */
function initImagePlaceholdersConfig(imagePlaceholders) {
    const container = document.getElementById('image-placeholders-container');
    if (!container || !imagePlaceholders || !imagePlaceholders.length) return;
    
    container.innerHTML = '';
    
    imagePlaceholders.forEach((placeholder, index) => {
        const card = document.createElement('div');
        card.className = 'placeholder-card';
        card.dataset.id = placeholder.id;
        
        card.innerHTML = `
            <div class="placeholder-header">
                <h4 class="placeholder-title">
                    <i class="fas fa-image"></i> صورة ${index + 1}
                </h4>
                <button class="btn secondary-btn btn-sm" onclick="selectElementById(${placeholder.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <div class="placeholder-content">
                <div class="placeholder-info">
                    <p><span>العرض:</span> <span>${placeholder.width_percent.toFixed(1)}%</span></p>
                    <p><span>الارتفاع:</span> <span>${placeholder.height_percent.toFixed(1)}%</span></p>
                    <p><span>الموقع:</span> <span>(${placeholder.left_percent.toFixed(1)}%, ${placeholder.top_percent.toFixed(1)}%)</span></p>
                </div>
                <div class="placeholder-controls">
                    <div class="form-check">
                        <input type="checkbox" id="use-image-${placeholder.id}" class="form-check-input" checked 
                            onchange="updateImageConfig(${placeholder.id}, 'use', this.checked)">
                        <label for="use-image-${placeholder.id}">استبدال هذه الصورة</label>
                    </div>
                    <div class="form-group" id="image-order-group-${placeholder.id}">
                        <label for="image-order-${placeholder.id}">ترتيب الصورة:</label>
                        <input type="number" id="image-order-${placeholder.id}" class="form-control" 
                            min="1" max="20" value="${index + 1}" 
                            onchange="updateImageConfig(${placeholder.id}, 'order', parseInt(this.value))">
                        <small>1 = الصورة الأولى في كل مجلد</small>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
        
        // Initialize config for this placeholder
        placeholdersConfig.images[`image_${placeholder.id}`] = {
            use: true,
            order: index + 1,
            placeholder_info: placeholder
        };
    });
}

/**
 * Initialize text placeholders configuration
 * @param {Array} textPlaceholders - The text placeholders data
 */
function initTextPlaceholdersConfig(textPlaceholders) {
    const container = document.getElementById('text-placeholders-container');
    if (!container || !textPlaceholders || !textPlaceholders.length) return;
    
    container.innerHTML = '';
    
    textPlaceholders.forEach((placeholder, index) => {
        const card = document.createElement('div');
        card.className = 'placeholder-card';
        card.dataset.id = placeholder.id;
        
        card.innerHTML = `
            <div class="placeholder-header">
                <h4 class="placeholder-title">
                    <i class="fas fa-align-left"></i> نص ${index + 1}
                </h4>
                <button class="btn secondary-btn btn-sm" onclick="selectElementById(${placeholder.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <div class="placeholder-content">
                <div class="placeholder-info">
                    <p><span>المحتوى الحالي:</span> <span>${placeholder.current_content}</span></p>
                    <p><span>الموقع:</span> <span>(${placeholder.left_percent.toFixed(1)}%, ${placeholder.top_percent.toFixed(1)}%)</span></p>
                </div>
                <div class="placeholder-controls">
                    <div class="form-group">
                        <label>كيف تريد ملء هذا النص؟</label>
                        <div class="radio-group">
                            <label>
                                <input type="radio" name="text-fill-${placeholder.id}" value="ترك فارغ" checked
                                    onchange="updateTextConfig(${placeholder.id}, 'type', this.value)">
                                <span>ترك فارغ</span>
                            </label>
                            <label>
                                <input type="radio" name="text-fill-${placeholder.id}" value="نص ثابت"
                                    onchange="updateTextConfig(${placeholder.id}, 'type', this.value)">
                                <span>نص ثابت</span>
                            </label>
                            <label>
                                <input type="radio" name="text-fill-${placeholder.id}" value="تاريخ"
                                    onchange="updateTextConfig(${placeholder.id}, 'type', this.value)">
                                <span>تاريخ</span>
                            </label>
                            <label>
                                <input type="radio" name="text-fill-${placeholder.id}" value="تاريخ الصورة"
                                    onchange="updateTextConfig(${placeholder.id}, 'type', this.value)">
                                <span>تاريخ الصورة</span>
                            </label>
                            <label>
                                <input type="radio" name="text-fill-${placeholder.id}" value="اسم المجلد"
                                    onchange="updateTextConfig(${placeholder.id}, 'type', this.value)">
                                <span>اسم المجلد</span>
                            </label>
                        </div>
                    </div>
                    
                    <div id="text-custom-${placeholder.id}" class="form-group" style="display: none;">
                        <label for="text-value-${placeholder.id}">أدخل النص المطلوب:</label>
                        <input type="text" id="text-value-${placeholder.id}" class="form-control"
                            placeholder="مثال: اسم المشروع، اسم الشركة، إلخ..."
                            onchange="updateTextConfig(${placeholder.id}, 'value', this.value)">
                    </div>
                    
                    <div id="text-date-${placeholder.id}" class="form-group" style="display: none;">
                        <label>اختر نوع التاريخ:</label>
                        <div class="radio-group">
                            <label>
                                <input type="radio" name="text-date-type-${placeholder.id}" value="today" checked
                                    onchange="updateTextConfig(${placeholder.id}, 'value', this.value)">
                                <span>تاريخ اليوم</span>
                            </label>
                            <label>
                                <input type="radio" name="text-date-type-${placeholder.id}" value="custom"
                                    onchange="showCustomDatePicker(${placeholder.id})">
                                <span>تاريخ مخصص</span>
                            </label>
                        </div>
                        <div id="text-custom-date-${placeholder.id}" style="display: none; margin-top: 10px;">
                            <input type="date" id="text-date-value-${placeholder.id}" class="form-control"
                                onchange="updateTextConfig(${placeholder.id}, 'value', this.value)">
                        </div>
                    </div>
                    
                    <div id="text-keep-original-${placeholder.id}" class="form-check" style="margin-top: 15px;">
                        <input type="checkbox" id="keep-original-${placeholder.id}" class="form-check-input"
                            onchange="updateTextConfig(${placeholder.id}, 'keepOriginal', this.checked)">
                        <label for="keep-original-${placeholder.id}">إبقاء النص كما هو بدون تعديل</label>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
        
        // Add event listeners for radio buttons
        const radioButtons = card.querySelectorAll('input[type="radio"][name^="text-fill"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                const textId = this.name.split('-')[2];
                const customTextDiv = document.getElementById(`text-custom-${textId}`);
                const dateDiv = document.getElementById(`text-date-${textId}`);
                const keepOriginalDiv = document.getElementById(`text-keep-original-${textId}`);
                
                // Hide all option divs first
                customTextDiv.style.display = 'none';
                dateDiv.style.display = 'none';
                
                // Show relevant div based on selection
                if (this.value === 'نص ثابت') {
                    customTextDiv.style.display = 'block';
                } else if (this.value === 'تاريخ') {
                    dateDiv.style.display = 'block';
                }
                
                // Show keep original checkbox for text and date options
                if (this.value === 'نص ثابت' || this.value === 'تاريخ' || 
                    this.value === 'تاريخ الصورة' || this.value === 'اسم المجلد') {
                    keepOriginalDiv.style.display = 'block';
                } else {
                    keepOriginalDiv.style.display = 'none';
                }
            });
        });
        
        // Initialize config for this placeholder
        placeholdersConfig.texts[`text_${placeholder.id}`] = {
            type: 'ترك فارغ',
            value: null,
            keepOriginal: false
        };
    });
}

/**
 * Show custom date picker for text placeholder
 * @param {number} id - The placeholder ID
 */
function showCustomDatePicker(id) {
    const customDateDiv = document.getElementById(`text-custom-date-${id}`);
    if (customDateDiv) {
        customDateDiv.style.display = 'block';
        
        // Set default date to today
        const dateInput = document.getElementById(`text-date-value-${id}`);
        if (dateInput) {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            dateInput.value = formattedDate;
            
            // Update config with the selected date
            updateTextConfig(id, 'value', formattedDate);
        }
    }
}

/**
 * Update image placeholder configuration
 * @param {number} id - The placeholder ID
 * @param {string} property - The property to update
 * @param {*} value - The new value
 */
function updateImageConfig(id, property, value) {
    const configKey = `image_${id}`;
    
    if (!placeholdersConfig.images[configKey]) {
        placeholdersConfig.images[configKey] = {
            use: true,
            order: 1,
            placeholder_info: {}
        };
    }
    
    placeholdersConfig.images[configKey][property] = value;
    
    // If "use" is set to false, disable the order input
    if (property === 'use') {
        const orderGroup = document.getElementById(`image-order-group-${id}`);
        if (orderGroup) {
            orderGroup.style.opacity = value ? '1' : '0.5';
            const orderInput = document.getElementById(`image-order-${id}`);
            if (orderInput) {
                orderInput.disabled = !value;
            }
        }
    }
    
    // Update configuration summary
    updateConfigSummary();
}

/**
 * Update text placeholder configuration
 * @param {number} id - The placeholder ID
 * @param {string} property - The property to update
 * @param {*} value - The new value
 */
function updateTextConfig(id, property, value) {
    const configKey = `text_${id}`;
    
    if (!placeholdersConfig.texts[configKey]) {
        placeholdersConfig.texts[configKey] = {
            type: 'ترك فارغ',
            value: null,
            keepOriginal: false
        };
    }
    
    placeholdersConfig.texts[configKey][property] = value;
    
    // Update configuration summary
    updateConfigSummary();
}

/**
 * Select an element in the interactive slide
 * @param {HTMLElement} element - The element to select
 * @param {Object} elementData - The element data
 */
function selectElement(element, elementData) {
    // Deselect previously selected element
    if (currentSelectedElement) {
        currentSelectedElement.classList.remove('selected');
    }
    
    // Select the new element
    element.classList.add('selected');
    currentSelectedElement = element;
    
    // Show options modal for the selected element
    showElementOptionsModal(element, elementData);
}

/**
 * Select an element by ID
 * @param {number} id - The element ID
 */
function selectElementById(id) {
    const element = document.getElementById(`element-${id}`);
    if (!element) return;
    
    // Find the element data in the slide analysis
    let elementData = null;
    
    if (element.dataset.type === 'image') {
        elementData = slideAnalysis.image_placeholders.find(p => p.id === id);
    } else if (element.dataset.type === 'text') {
        elementData = slideAnalysis.text_placeholders.find(p => p.id === id);
    } else if (element.dataset.type === 'title') {
        elementData = slideAnalysis.title_placeholders.find(p => p.id === id);
    }
    
    if (elementData) {
        selectElement(element, elementData);
    }
}

/**
 * Show options modal for the selected element
 * @param {HTMLElement} element - The selected element
 * @param {Object} elementData - The element data
 */
function showElementOptionsModal(element, elementData) {
    const modal = document.getElementById('element-options-modal');
    const modalTitle = document.getElementById('modal-element-title');
    const modalOptions = document.getElementById('modal-options-container');
    
    if (!modal || !modalTitle || !modalOptions) return;
    
    // Set modal title
    const elementType = element.dataset.type;
    const elementTypeName = getElementTypeName(elementType);
    modalTitle.innerHTML = `<i class="fas ${getElementTypeIcon(elementType)}"></i> خيارات ${elementTypeName}`;
    
    // Clear previous options
    modalOptions.innerHTML = '';
    
    // Create options based on element type
    if (elementType === 'image') {
        createImageOptions(modalOptions, element, elementData);
    } else if (elementType === 'text') {
        createTextOptions(modalOptions, element, elementData);
    } else if (elementType === 'title') {
        createTitleOptions(modalOptions, element, elementData);
    }
    
    // Show the modal
    modal.style.display = 'block';
}

/**
 * Create options for image element
 * @param {HTMLElement} container - The container to add options to
 * @param {HTMLElement} element - The element to create options for
 * @param {Object} elementData - The element data
 */
function createImageOptions(container, element, elementData) {
    const configKey = `image_${elementData.id}`;
    const config = placeholdersConfig.images[configKey] || {
        use: true,
        order: 1,
        placeholder_info: elementData
    };
    
    const optionsHTML = `
        <div class="form-group">
            <div class="form-check">
                <input type="checkbox" id="modal-use-image-${elementData.id}" class="form-check-input" ${config.use ? 'checked' : ''}>
                <label for="modal-use-image-${elementData.id}">استبدال هذه الصورة</label>
            </div>
        </div>
        
        <div class="form-group" id="modal-image-order-group-${elementData.id}" ${!config.use ? 'style="opacity: 0.5;"' : ''}>
            <label for="modal-image-order-${elementData.id}">ترتيب الصورة:</label>
            <input type="number" id="modal-image-order-${elementData.id}" class="form-control" 
                min="1" max="20" value="${config.order}" ${!config.use ? 'disabled' : ''}>
            <small>1 = الصورة الأولى في كل مجلد</small>
        </div>
        
        <div class="form-group">
            <h4>معلومات الموضع:</h4>
            <div class="placeholder-info">
                <p><span>العرض:</span> <span>${elementData.width_percent.toFixed(1)}%</span></p>
                <p><span>الارتفاع:</span> <span>${elementData.height_percent.toFixed(1)}%</span></p>
                <p><span>الموقع:</span> <span>(${elementData.left_percent.toFixed(1)}%, ${elementData.top_percent.toFixed(1)}%)</span></p>
            </div>
        </div>
    `;
    
    container.innerHTML = optionsHTML;
    
    // Add event listeners
    const useImageCheckbox = document.getElementById(`modal-use-image-${elementData.id}`);
    const imageOrderInput = document.getElementById(`modal-image-order-${elementData.id}`);
    const imageOrderGroup = document.getElementById(`modal-image-order-group-${elementData.id}`);
    
    if (useImageCheckbox) {
        useImageCheckbox.addEventListener('change', function() {
            const checked = this.checked;
            
            // Update UI
            if (imageOrderGroup) {
                imageOrderGroup.style.opacity = checked ? '1' : '0.5';
            }
            
            if (imageOrderInput) {
                imageOrderInput.disabled = !checked;
            }
            
            // Update config
            updateImageConfig(elementData.id, 'use', checked);
            
            // Also update the checkbox in the main config panel
            const mainCheckbox = document.getElementById(`use-image-${elementData.id}`);
            if (mainCheckbox) {
                mainCheckbox.checked = checked;
            }
        });
    }
    
    if (imageOrderInput) {
        imageOrderInput.addEventListener('change', function() {
            const value = parseInt(this.value);
            
            // Update config
            updateImageConfig(elementData.id, 'order', value);
            
            // Also update the input in the main config panel
            const mainInput = document.getElementById(`image-order-${elementData.id}`);
            if (mainInput) {
                mainInput.value = value;
            }
        });
    }
}

/**
 * Create options for text element
 * @param {HTMLElement} container - The container to add options to
 * @param {HTMLElement} element - The element to create options for
 * @param {Object} elementData - The element data
 */
function createTextOptions(container, element, elementData) {
    const configKey = `text_${elementData.id}`;
    const config = placeholdersConfig.texts[configKey] || {
        type: 'ترك فارغ',
        value: null,
        keepOriginal: false
    };
    
    const optionsHTML = `
        <div class="form-group">
            <label>كيف تريد ملء هذا النص؟</label>
            <div class="radio-group">
                <label>
                    <input type="radio" name="modal-text-fill-${elementData.id}" value="ترك فارغ" ${config.type === 'ترك فارغ' ? 'checked' : ''}>
                    <span>ترك فارغ</span>
                </label>
                <label>
                    <input type="radio" name="modal-text-fill-${elementData.id}" value="نص ثابت" ${config.type === 'نص ثابت' ? 'checked' : ''}>
                    <span>نص ثابت</span>
                </label>
                <label>
                    <input type="radio" name="modal-text-fill-${elementData.id}" value="تاريخ" ${config.type === 'تاريخ' ? 'checked' : ''}>
                    <span>تاريخ</span>
                </label>
                <label>
                    <input type="radio" name="modal-text-fill-${elementData.id}" value="تاريخ الصورة" ${config.type === 'تاريخ الصورة' ? 'checked' : ''}>
                    <span>تاريخ الصورة</span>
                </label>
                <label>
                    <input type="radio" name="modal-text-fill-${elementData.id}" value="اسم المجلد" ${config.type === 'اسم المجلد' ? 'checked' : ''}>
                    <span>اسم المجلد</span>
                </label>
            </div>
        </div>
        
        <div id="modal-text-custom-${elementData.id}" class="form-group" style="display: ${config.type === 'نص ثابت' ? 'block' : 'none'};">
            <label for="modal-text-value-${elementData.id}">أدخل النص المطلوب:</label>
            <input type="text" id="modal-text-value-${elementData.id}" class="form-control"
                placeholder="مثال: اسم المشروع، اسم الشركة، إلخ..."
                value="${config.type === 'نص ثابت' && config.value ? config.value : ''}">
        </div>
        
        <div id="modal-text-date-${elementData.id}" class="form-group" style="display: ${config.type === 'تاريخ' ? 'block' : 'none'};">
            <label>اختر نوع التاريخ:</label>
            <div class="radio-group">
                <label>
                    <input type="radio" name="modal-text-date-type-${elementData.id}" value="today" ${config.type === 'تاريخ' && config.value === 'today' ? 'checked' : ''}>
                    <span>تاريخ اليوم</span>
                </label>
                <label>
                    <input type="radio" name="modal-text-date-type-${elementData.id}" value="custom" ${config.type === 'تاريخ' && config.value !== 'today' ? 'checked' : ''}>
                    <span>تاريخ مخصص</span>
                </label>
            </div>
            <div id="modal-text-custom-date-${elementData.id}" style="display: ${config.type === 'تاريخ' && config.value !== 'today' ? 'block' : 'none'}; margin-top: 10px;">
                <input type="date" id="modal-text-date-value-${elementData.id}" class="form-control"
                    value="${config.type === 'تاريخ' && config.value !== 'today' ? config.value : ''}">
            </div>
        </div>
        
        <div id="modal-text-keep-original-${elementData.id}" class="form-check" style="margin-top: 15px; display: ${config.type !== 'ترك فارغ' ? 'block' : 'none'};">
            <input type="checkbox" id="modal-keep-original-${elementData.id}" class="form-check-input" ${config.keepOriginal ? 'checked' : ''}>
            <label for="modal-keep-original-${elementData.id}">إبقاء النص كما هو بدون تعديل</label>
        </div>
        
        <div class="form-group">
            <h4>معلومات الموضع:</h4>
            <div class="placeholder-info">
                <p><span>المحتوى الحالي:</span> <span>${elementData.current_content}</span></p>
                <p><span>الموقع:</span> <span>(${elementData.left_percent.toFixed(1)}%, ${elementData.top_percent.toFixed(1)}%)</span></p>
            </div>
        </div>
    `;
    
    container.innerHTML = optionsHTML;
    
    // Add event listeners for radio buttons
    const radioButtons = container.querySelectorAll('input[type="radio"][name^="modal-text-fill"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            const textId = this.name.split('-')[3];
            const customTextDiv = document.getElementById(`modal-text-custom-${textId}`);
            const dateDiv = document.getElementById(`modal-text-date-${textId}`);
            const keepOriginalDiv = document.getElementById(`modal-text-keep-original-${textId}`);
            
            // Hide all option divs first
            customTextDiv.style.display = 'none';
            dateDiv.style.display = 'none';
            
            // Show relevant div based on selection
            if (this.value === 'نص ثابت') {
                customTextDiv.style.display = 'block';
            } else if (this.value === 'تاريخ') {
                dateDiv.style.display = 'block';
            }
            
            // Show keep original checkbox for text and date options
            if (this.value === 'نص ثابت' || this.value === 'تاريخ' || 
                this.value === 'تاريخ الصورة' || this.value === 'اسم المجلد') {
                keepOriginalDiv.style.display = 'block';
            } else {
                keepOriginalDiv.style.display = 'none';
            }
            
            // Update config
            updateTextConfig(textId, 'type', this.value);
            
            // Also update the radio button in the main config panel
            const mainRadio = document.querySelector(`input[type="radio"][name="text-fill-${textId}"][value="${this.value}"]`);
            if (mainRadio) {
                mainRadio.checked = true;
                
                // Trigger change event to update the main panel UI
                const event = new Event('change');
                mainRadio.dispatchEvent(event);
            }
        });
    });
    
    // Add event listeners for date type radio buttons
    const dateTypeRadios = container.querySelectorAll('input[type="radio"][name^="modal-text-date-type"]');
    dateTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const textId = this.name.split('-')[4];
            const customDateDiv = document.getElementById(`modal-text-custom-date-${textId}`);
            
            if (this.value === 'custom') {
                customDateDiv.style.display = 'block';
                
                // Set default date to today if not already set
                const dateInput = document.getElementById(`modal-text-date-value-${textId}`);
                if (dateInput && !dateInput.value) {
                    const today = new Date();
                    const formattedDate = today.toISOString().split('T')[0];
                    dateInput.value = formattedDate;
                    
                    // Update config with the selected date
                    updateTextConfig(textId, 'value', formattedDate);
                }
            } else {
                customDateDiv.style.display = 'none';
                
                // Update config with 'today'
                updateTextConfig(textId, 'value', 'today');
            }
            
            // Also update the radio button in the main config panel
            if (this.value === 'today') {
                const mainRadio = document.querySelector(`input[type="radio"][name="text-date-type-${textId}"][value="today"]`);
                if (mainRadio) {
                    mainRadio.checked = true;
                }
            } else {
                const mainRadio = document.querySelector(`input[type="radio"][name="text-date-type-${textId}"][value="custom"]`);
                if (mainRadio) {
                    mainRadio.checked = true;
                    showCustomDatePicker(textId);
                }
            }
        });
    });
    
    // Add event listener for custom text input
    const customTextInput = document.getElementById(`modal-text-value-${elementData.id}`);
    if (customTextInput) {
        customTextInput.addEventListener('input', function() {
            // Update config
            updateTextConfig(elementData.id, 'value', this.value);
            
            // Also update the input in the main config panel
            const mainInput = document.getElementById(`text-value-${elementData.id}`);
            if (mainInput) {
                mainInput.value = this.value;
            }
        });
    }
    
    // Add event listener for custom date input
    const customDateInput = document.getElementById(`modal-text-date-value-${elementData.id}`);
    if (customDateInput) {
        customDateInput.addEventListener('change', function() {
            // Update config
            updateTextConfig(elementData.id, 'value', this.value);
            
            // Also update the input in the main config panel
            const mainInput = document.getElementById(`text-date-value-${elementData.id}`);
            if (mainInput) {
                mainInput.value = this.value;
            }
        });
    }
    
    // Add event listener for keep original checkbox
    const keepOriginalCheckbox = document.getElementById(`modal-keep-original-${elementData.id}`);
    if (keepOriginalCheckbox) {
        keepOriginalCheckbox.addEventListener('change', function() {
            // Update config
            updateTextConfig(elementData.id, 'keepOriginal', this.checked);
            
            // Also update the checkbox in the main config panel
            const mainCheckbox = document.getElementById(`keep-original-${elementData.id}`);
            if (mainCheckbox) {
                mainCheckbox.checked = this.checked;
            }
        });
    }
}

/**
 * Create options for title element
 * @param {HTMLElement} container - The container to add options to
 * @param {HTMLElement} element - The element to create options for
 * @param {Object} elementData - The element data
 */
function createTitleOptions(container, element, elementData) {
    const optionsHTML = `
        <div class="form-group">
            <p class="info-message">
                <i class="fas fa-info-circle"></i>
                سيتم استبدال العنوان باسم المجلد تلقائياً
            </p>
        </div>
        
        <div class="form-group">
            <h4>معلومات الموضع:</h4>
            <div class="placeholder-info">
                <p><span>المحتوى الحالي:</span> <span>${elementData.current_content}</span></p>
                <p><span>الموقع:</span> <span>(${elementData.left_percent.toFixed(1)}%, ${elementData.top_percent.toFixed(1)}%)</span></p>
            </div>
        </div>
    `;
    
    container.innerHTML = optionsHTML;
}

/**
 * Close the element options modal
 */
function closeElementOptionsModal() {
    const modal = document.getElementById('element-options-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Deselect the current element
    if (currentSelectedElement) {
        currentSelectedElement.classList.remove('selected');
        currentSelectedElement = null;
    }
}

/**
 * Save element options from the modal
 */
function saveElementOptions() {
    // Close the modal
    closeElementOptionsModal();
    
    // Update configuration summary
    updateConfigSummary();
    
    // Show notification
    showNotification('تم حفظ الإعدادات بنجاح', 'success');
}

/**
 * Update the configuration summary
 */
function updateConfigSummary() {
    const summaryContainer = document.getElementById('config-summary-content');
    if (!summaryContainer) return;
    
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
 * Save configuration and proceed to the next step
 */
function saveConfigAndProceed() {
    // Save configuration to server
    fetch('/save-config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(placeholdersConfig)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Save configuration to localStorage for potential use later
            saveSettings(placeholdersConfig);
            
            // Redirect to process page
            window.location.href = data.redirect;
        } else {
            showNotification('حدث خطأ أثناء حفظ الإعدادات', 'error');
        }
    })
    .catch(error => {
        console.error('Error saving configuration:', error);
        showNotification('حدث خطأ أثناء حفظ الإعدادات', 'error');
    });
}