/**
 * Interactive Slide JavaScript
 * Handles the interactive slide functionality in step 2
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // The interactive slide will be initialized when navigating to step 2
});

/**
 * Initialize the interactive slide
 */
function initializeInteractiveSlide() {
    const interactiveSlide = document.getElementById('interactive-slide');
    const elementOptions = document.getElementById('element-options');
    
    if (!interactiveSlide || !elementOptions) return;
    
    // Clear previous content
    interactiveSlide.innerHTML = '';
    
    // Get slide data from app state
    const appState = window.appState || {};
    const slideData = appState.slideData;
    
    if (!slideData || !slideData.slides || !slideData.slides.length) {
        interactiveSlide.innerHTML = '<p class="no-data">لا توجد بيانات للشرائح. الرجاء رفع ملف صالح.</p>';
        return;
    }
    
    // Use the first slide as the interactive slide
    const slide = slideData.slides[0];
    
    // Set background color
    interactiveSlide.style.backgroundColor = slide.background || '#ffffff';
    
    // Create elements
    slide.elements.forEach(element => {
        createSlideElement(interactiveSlide, element);
    });
    
    // Update statistics
    updateStatistics(slideData.statistics, 'slide-statistics');
}

/**
 * Create a slide element
 * @param {HTMLElement} container - The container to add the element to
 * @param {Object} elementData - The element data
 */
function createSlideElement(container, elementData) {
    const element = document.createElement('div');
    element.id = elementData.id;
    element.className = `slide-element slide-element-${elementData.type}`;
    element.dataset.type = elementData.type;
    
    // Set position and size
    if (elementData.position) {
        element.style.top = elementData.position.top;
        element.style.left = elementData.position.left;
        element.style.width = elementData.position.width;
        element.style.height = elementData.position.height;
    }
    
    // Set styles
    if (elementData.style) {
        Object.keys(elementData.style).forEach(key => {
            element.style[key] = elementData.style[key];
        });
    }
    
    // Create content based on element type
    switch (elementData.type) {
        case 'title':
        case 'text':
            element.innerHTML = elementData.content;
            break;
            
        case 'image':
            const img = document.createElement('img');
            img.src = elementData.src || 'https://via.placeholder.com/300x200?text=صورة';
            img.alt = 'صورة';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            element.appendChild(img);
            break;
            
        case 'list':
            const ul = document.createElement('ul');
            elementData.content.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                ul.appendChild(li);
            });
            element.appendChild(ul);
            break;
            
        case 'chart':
            element.innerHTML = `<div class="chart-placeholder">مخطط بياني: ${elementData.chartType}</div>`;
            break;
            
        case 'date':
            const today = new Date();
            const formattedDate = formatDate(today, elementData.format || 'DD/MM/YYYY');
            element.textContent = formattedDate;
            break;
            
        default:
            element.textContent = 'عنصر غير معروف';
    }
    
    // Make element interactive
    makeElementInteractive(element, elementData);
    
    // Add element to container
    container.appendChild(element);
}

/**
 * Make an element interactive
 * @param {HTMLElement} element - The element to make interactive
 * @param {Object} elementData - The element data
 */
function makeElementInteractive(element, elementData) {
    // Add click event to show options
    element.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Remove selected class from all elements
        const allElements = document.querySelectorAll('.slide-element');
        allElements.forEach(el => el.classList.remove('selected'));
        
        // Add selected class to clicked element
        element.classList.add('selected');
        
        // Show options for this element
        showElementOptions(element, elementData);
        
        // Show options modal
        showElementOptionsModal(element, elementData);
    });
}

/**
 * Show options for an element in the control panel
 * @param {HTMLElement} element - The element to show options for
 * @param {Object} elementData - The element data
 */
function showElementOptions(element, elementData) {
    const elementOptions = document.getElementById('element-options');
    if (!elementOptions) return;
    
    // Clear previous options
    elementOptions.innerHTML = '';
    
    // Create options based on element type
    const optionsTitle = document.createElement('h4');
    optionsTitle.textContent = `خيارات ${getElementTypeName(elementData.type)}`;
    elementOptions.appendChild(optionsTitle);
    
    // Create common options
    createCommonOptions(elementOptions, element, elementData);
    
    // Create type-specific options
    switch (elementData.type) {
        case 'title':
        case 'text':
            createTextOptions(elementOptions, element, elementData);
            break;
            
        case 'image':
            createImageOptions(elementOptions, element, elementData);
            break;
            
        case 'list':
            createListOptions(elementOptions, element, elementData);
            break;
            
        case 'chart':
            createChartOptions(elementOptions, element, elementData);
            break;
            
        case 'date':
            createDateOptions(elementOptions, element, elementData);
            break;
    }
}

/**
 * Show options modal for an element
 * @param {HTMLElement} element - The element to show options for
 * @param {Object} elementData - The element data
 */
function showElementOptionsModal(element, elementData) {
    const modal = document.getElementById('element-options-modal');
    const modalTitle = document.getElementById('modal-element-title');
    const modalOptions = document.getElementById('modal-options-container');
    
    if (!modal || !modalTitle || !modalOptions) return;
    
    // Set modal title
    modalTitle.textContent = `خيارات ${getElementTypeName(elementData.type)}`;
    
    // Clear previous options
    modalOptions.innerHTML = '';
    
    // Create options based on element type
    createCommonOptions(modalOptions, element, elementData);
    
    // Create type-specific options
    switch (elementData.type) {
        case 'title':
        case 'text':
            createTextOptions(modalOptions, element, elementData);
            break;
            
        case 'image':
            createImageOptions(modalOptions, element, elementData);
            break;
            
        case 'list':
            createListOptions(modalOptions, element, elementData);
            break;
            
        case 'chart':
            createChartOptions(modalOptions, element, elementData);
            break;
            
        case 'date':
            createDateOptions(modalOptions, element, elementData);
            break;
    }
    
    // Show the modal
    modal.style.display = 'block';
}

/**
 * Create common options for all element types
 * @param {HTMLElement} container - The container to add options to
 * @param {HTMLElement} element - The element to create options for
 * @param {Object} elementData - The element data
 */
function createCommonOptions(container, element, elementData) {
    // Position options
    const positionGroup = document.createElement('div');
    positionGroup.className = 'form-group';
    positionGroup.innerHTML = `
        <label>الموقع والحجم</label>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <div style="flex: 1;">
                <label for="${elementData.id}-top">أعلى</label>
                <input type="text" id="${elementData.id}-top" class="form-control" value="${elementData.position?.top || '0%'}">
            </div>
            <div style="flex: 1;">
                <label for="${elementData.id}-left">يسار</label>
                <input type="text" id="${elementData.id}-left" class="form-control" value="${elementData.position?.left || '0%'}">
            </div>
        </div>
        <div style="display: flex; gap: 10px;">
            <div style="flex: 1;">
                <label for="${elementData.id}-width">العرض</label>
                <input type="text" id="${elementData.id}-width" class="form-control" value="${elementData.position?.width || '100%'}">
            </div>
            <div style="flex: 1;">
                <label for="${elementData.id}-height">الارتفاع</label>
                <input type="text" id="${elementData.id}-height" class="form-control" value="${elementData.position?.height || '100%'}">
            </div>
        </div>
    `;
    container.appendChild(positionGroup);
    
    // Add event listeners for position inputs
    const topInput = document.getElementById(`${elementData.id}-top`);
    const leftInput = document.getElementById(`${elementData.id}-left`);
    const widthInput = document.getElementById(`${elementData.id}-width`);
    const heightInput = document.getElementById(`${elementData.id}-height`);
    
    [topInput, leftInput, widthInput, heightInput].forEach(input => {
        if (input) {
            input.addEventListener('change', () => {
                element.style.top = topInput.value;
                element.style.left = leftInput.value;
                element.style.width = widthInput.value;
                element.style.height = heightInput.value;
                
                // Update element data
                elementData.position = {
                    top: topInput.value,
                    left: leftInput.value,
                    width: widthInput.value,
                    height: heightInput.value
                };
            });
        }
    });
}

/**
 * Create text-specific options
 * @param {HTMLElement} container - The container to add options to
 * @param {HTMLElement} element - The element to create options for
 * @param {Object} elementData - The element data
 */
function createTextOptions(container, element, elementData) {
    // Content options
    const contentGroup = document.createElement('div');
    contentGroup.className = 'form-group';
    contentGroup.innerHTML = `
        <label for="${elementData.id}-content">المحتوى</label>
        <textarea id="${elementData.id}-content" class="form-control" rows="4">${elementData.content || ''}</textarea>
        
        <div class="form-check" style="margin-top: 10px;">
            <input type="checkbox" id="${elementData.id}-keep-original" class="form-check-input">
            <label for="${elementData.id}-keep-original" class="form-check-label">إبقاء النص كما هو بدون تعديل</label>
        </div>
    `;
    container.appendChild(contentGroup);
    
    // Style options
    const styleGroup = document.createElement('div');
    styleGroup.className = 'form-group';
    styleGroup.innerHTML = `
        <label>تنسيق النص</label>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <div style="flex: 1;">
                <label for="${elementData.id}-font-size">حجم الخط</label>
                <input type="text" id="${elementData.id}-font-size" class="form-control" value="${elementData.style?.fontSize || '16px'}">
            </div>
            <div style="flex: 1;">
                <label for="${elementData.id}-font-weight">سمك الخط</label>
                <select id="${elementData.id}-font-weight" class="form-control">
                    <option value="normal" ${elementData.style?.fontWeight === 'normal' ? 'selected' : ''}>عادي</option>
                    <option value="bold" ${elementData.style?.fontWeight === 'bold' ? 'selected' : ''}>غامق</option>
                </select>
            </div>
        </div>
        <div style="display: flex; gap: 10px;">
            <div style="flex: 1;">
                <label for="${elementData.id}-text-align">محاذاة النص</label>
                <select id="${elementData.id}-text-align" class="form-control">
                    <option value="right" ${elementData.style?.textAlign === 'right' ? 'selected' : ''}>يمين</option>
                    <option value="center" ${elementData.style?.textAlign === 'center' ? 'selected' : ''}>وسط</option>
                    <option value="left" ${elementData.style?.textAlign === 'left' ? 'selected' : ''}>يسار</option>
                </select>
            </div>
            <div style="flex: 1;">
                <label for="${elementData.id}-color">لون النص</label>
                <input type="color" id="${elementData.id}-color" class="form-control" value="${elementData.style?.color || '#000000'}">
            </div>
        </div>
    `;
    container.appendChild(styleGroup);
    
    // Add event listeners
    const contentInput = document.getElementById(`${elementData.id}-content`);
    const keepOriginalCheckbox = document.getElementById(`${elementData.id}-keep-original`);
    const fontSizeInput = document.getElementById(`${elementData.id}-font-size`);
    const fontWeightSelect = document.getElementById(`${elementData.id}-font-weight`);
    const textAlignSelect = document.getElementById(`${elementData.id}-text-align`);
    const colorInput = document.getElementById(`${elementData.id}-color`);
    
    // Content change event
    if (contentInput) {
        contentInput.addEventListener('input', () => {
            if (!keepOriginalCheckbox.checked) {
                element.innerHTML = contentInput.value;
                elementData.content = contentInput.value;
            }
        });
    }
    
    // Keep original checkbox event
    if (keepOriginalCheckbox) {
        keepOriginalCheckbox.addEventListener('change', () => {
            contentInput.disabled = keepOriginalCheckbox.checked;
            elementData.keepOriginal = keepOriginalCheckbox.checked;
            
            if (!keepOriginalCheckbox.checked) {
                element.innerHTML = contentInput.value;
                elementData.content = contentInput.value;
            }
        });
    }
    
    // Style change events
    if (fontSizeInput) {
        fontSizeInput.addEventListener('change', () => {
            element.style.fontSize = fontSizeInput.value;
            elementData.style = elementData.style || {};
            elementData.style.fontSize = fontSizeInput.value;
        });
    }
    
    if (fontWeightSelect) {
        fontWeightSelect.addEventListener('change', () => {
            element.style.fontWeight = fontWeightSelect.value;
            elementData.style = elementData.style || {};
            elementData.style.fontWeight = fontWeightSelect.value;
        });
    }
    
    if (textAlignSelect) {
        textAlignSelect.addEventListener('change', () => {
            element.style.textAlign = textAlignSelect.value;
            elementData.style = elementData.style || {};
            elementData.style.textAlign = textAlignSelect.value;
        });
    }
    
    if (colorInput) {
        colorInput.addEventListener('input', () => {
            element.style.color = colorInput.value;
            elementData.style = elementData.style || {};
            elementData.style.color = colorInput.value;
        });
    }
}

/**
 * Create image-specific options
 * @param {HTMLElement} container - The container to add options to
 * @param {HTMLElement} element - The element to create options for
 * @param {Object} elementData - The element data
 */
function createImageOptions(container, element, elementData) {
    const imageGroup = document.createElement('div');
    imageGroup.className = 'form-group';
    imageGroup.innerHTML = `
        <label for="${elementData.id}-image-src">مصدر الصورة</label>
        <input type="text" id="${elementData.id}-image-src" class="form-control" value="${elementData.src || ''}">
        
        <div style="margin-top: 10px;">
            <label for="${elementData.id}-object-fit">طريقة عرض الصورة</label>
            <select id="${elementData.id}-object-fit" class="form-control">
                <option value="cover" ${elementData.style?.objectFit === 'cover' ? 'selected' : ''}>تغطية</option>
                <option value="contain" ${elementData.style?.objectFit === 'contain' ? 'selected' : ''}>احتواء</option>
                <option value="fill" ${elementData.style?.objectFit === 'fill' ? 'selected' : ''}>ملء</option>
            </select>
        </div>
    `;
    container.appendChild(imageGroup);
    
    // Add event listeners
    const srcInput = document.getElementById(`${elementData.id}-image-src`);
    const objectFitSelect = document.getElementById(`${elementData.id}-object-fit`);
    
    if (srcInput) {
        srcInput.addEventListener('change', () => {
            const img = element.querySelector('img');
            if (img) {
                img.src = srcInput.value || 'https://via.placeholder.com/300x200?text=صورة';
                elementData.src = srcInput.value;
            }
        });
    }
    
    if (objectFitSelect) {
        objectFitSelect.addEventListener('change', () => {
            const img = element.querySelector('img');
            if (img) {
                img.style.objectFit = objectFitSelect.value;
                elementData.style = elementData.style || {};
                elementData.style.objectFit = objectFitSelect.value;
            }
        });
    }
}

/**
 * Create list-specific options
 * @param {HTMLElement} container - The container to add options to
 * @param {HTMLElement} element - The element to create options for
 * @param {Object} elementData - The element data
 */
function createListOptions(container, element, elementData) {
    const listGroup = document.createElement('div');
    listGroup.className = 'form-group';
    listGroup.innerHTML = `
        <label for="${elementData.id}-list-items">عناصر القائمة</label>
        <textarea id="${elementData.id}-list-items" class="form-control" rows="6">${(elementData.content || []).join('\n')}</textarea>
        <p class="help-text">أدخل كل عنصر في سطر منفصل</p>
        
        <div class="form-check" style="margin-top: 10px;">
            <input type="checkbox" id="${elementData.id}-keep-original-list" class="form-check-input">
            <label for="${elementData.id}-keep-original-list" class="form-check-label">إبقاء القائمة كما هي بدون تعديل</label>
        </div>
    `;
    container.appendChild(listGroup);
    
    // Add event listeners
    const listItemsInput = document.getElementById(`${elementData.id}-list-items`);
    const keepOriginalCheckbox = document.getElementById(`${elementData.id}-keep-original-list`);
    
    if (listItemsInput && keepOriginalCheckbox) {
        listItemsInput.addEventListener('input', () => {
            if (!keepOriginalCheckbox.checked) {
                const items = listItemsInput.value.split('\n').filter(item => item.trim() !== '');
                
                // Update element
                const ul = element.querySelector('ul') || document.createElement('ul');
                ul.innerHTML = '';
                
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    ul.appendChild(li);
                });
                
                if (!element.contains(ul)) {
                    element.innerHTML = '';
                    element.appendChild(ul);
                }
                
                // Update element data
                elementData.content = items;
            }
        });
        
        keepOriginalCheckbox.addEventListener('change', () => {
            listItemsInput.disabled = keepOriginalCheckbox.checked;
            elementData.keepOriginal = keepOriginalCheckbox.checked;
            
            if (!keepOriginalCheckbox.checked) {
                const items = listItemsInput.value.split('\n').filter(item => item.trim() !== '');
                
                // Update element
                const ul = element.querySelector('ul') || document.createElement('ul');
                ul.innerHTML = '';
                
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    ul.appendChild(li);
                });
                
                if (!element.contains(ul)) {
                    element.innerHTML = '';
                    element.appendChild(ul);
                }
                
                // Update element data
                elementData.content = items;
            }
        });
    }
}

/**
 * Create chart-specific options
 * @param {HTMLElement} container - The container to add options to
 * @param {HTMLElement} element - The element to create options for
 * @param {Object} elementData - The element data
 */
function createChartOptions(container, element, elementData) {
    const chartGroup = document.createElement('div');
    chartGroup.className = 'form-group';
    chartGroup.innerHTML = `
        <label for="${elementData.id}-chart-type">نوع المخطط</label>
        <select id="${elementData.id}-chart-type" class="form-control">
            <option value="bar" ${elementData.chartType === 'bar' ? 'selected' : ''}>شريطي</option>
            <option value="line" ${elementData.chartType === 'line' ? 'selected' : ''}>خطي</option>
            <option value="pie" ${elementData.chartType === 'pie' ? 'selected' : ''}>دائري</option>
        </select>
        
        <div style="margin-top: 15px;">
            <label>بيانات المخطط</label>
            <div style="display: flex; gap: 10px;">
                <div style="flex: 1;">
                    <label for="${elementData.id}-chart-labels">التسميات</label>
                    <textarea id="${elementData.id}-chart-labels" class="form-control" rows="4">${(elementData.data?.labels || []).join('\n')}</textarea>
                    <p class="help-text">أدخل كل تسمية في سطر منفصل</p>
                </div>
                <div style="flex: 1;">
                    <label for="${elementData.id}-chart-values">القيم</label>
                    <textarea id="${elementData.id}-chart-values" class="form-control" rows="4">${(elementData.data?.values || []).join('\n')}</textarea>
                    <p class="help-text">أدخل كل قيمة في سطر منفصل</p>
                </div>
            </div>
        </div>
    `;
    container.appendChild(chartGroup);
    
    // Add event listeners
    const chartTypeSelect = document.getElementById(`${elementData.id}-chart-type`);
    const labelsInput = document.getElementById(`${elementData.id}-chart-labels`);
    const valuesInput = document.getElementById(`${elementData.id}-chart-values`);
    
    if (chartTypeSelect) {
        chartTypeSelect.addEventListener('change', () => {
            element.innerHTML = `<div class="chart-placeholder">مخطط بياني: ${chartTypeSelect.value}</div>`;
            elementData.chartType = chartTypeSelect.value;
        });
    }
    
    if (labelsInput && valuesInput) {
        const updateChartData = () => {
            const labels = labelsInput.value.split('\n').filter(label => label.trim() !== '');
            const values = valuesInput.value.split('\n')
                .filter(value => value.trim() !== '')
                .map(value => parseFloat(value) || 0);
            
            elementData.data = {
                labels: labels,
                values: values
            };
        };
        
        labelsInput.addEventListener('input', updateChartData);
        valuesInput.addEventListener('input', updateChartData);
    }
}

/**
 * Create date-specific options
 * @param {HTMLElement} container - The container to add options to
 * @param {HTMLElement} element - The element to create options for
 * @param {Object} elementData - The element data
 */
function createDateOptions(container, element, elementData) {
    const dateGroup = document.createElement('div');
    dateGroup.className = 'form-group';
    dateGroup.innerHTML = `
        <label for="${elementData.id}-date-format">تنسيق التاريخ</label>
        <select id="${elementData.id}-date-format" class="form-control">
            <option value="DD/MM/YYYY" ${elementData.format === 'DD/MM/YYYY' ? 'selected' : ''}>DD/MM/YYYY</option>
            <option value="MM/DD/YYYY" ${elementData.format === 'MM/DD/YYYY' ? 'selected' : ''}>MM/DD/YYYY</option>
            <option value="YYYY-MM-DD" ${elementData.format === 'YYYY-MM-DD' ? 'selected' : ''}>YYYY-MM-DD</option>
            <option value="DD MMMM YYYY" ${elementData.format === 'DD MMMM YYYY' ? 'selected' : ''}>DD MMMM YYYY</option>
        </select>
    `;
    container.appendChild(dateGroup);
    
    // Add event listeners
    const formatSelect = document.getElementById(`${elementData.id}-date-format`);
    
    if (formatSelect) {
        formatSelect.addEventListener('change', () => {
            const today = new Date();
            const formattedDate = formatDate(today, formatSelect.value);
            element.textContent = formattedDate;
            elementData.format = formatSelect.value;
        });
    }
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
        'date': 'التاريخ'
    };
    
    return typeNames[type] || 'العنصر';
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
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            
            let icon = '';
            switch (key) {
                case 'totalSlides':
                    icon = 'fas fa-file-powerpoint';
                    break;
                case 'totalElements':
                    icon = 'fas fa-object-group';
                    break;
                case 'totalImages':
                    icon = 'fas fa-image';
                    break;
                case 'totalCharts':
                    icon = 'fas fa-chart-bar';
                    break;
                default:
                    icon = 'fas fa-info-circle';
            }
            
            statItem.innerHTML = `
                <span class="stat-icon"><i class="${icon}"></i></span>
                <span class="stat-label">${getStatisticLabel(key)}:</span>
                <span class="stat-value">${statistics[key]}</span>
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
        'totalSlides': 'إجمالي الشرائح',
        'totalElements': 'إجمالي العناصر',
        'totalImages': 'إجمالي الصور',
        'totalCharts': 'إجمالي المخططات'
    };
    
    return labels[key] || key;
}