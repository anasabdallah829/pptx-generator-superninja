/**
 * Slide Preview JavaScript
 * Handles the slide preview functionality in step 3
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // The slide preview will be initialized when navigating to step 3
    
    // Initialize navigation buttons
    const prevSlideBtn = document.getElementById('prev-slide');
    const nextSlideBtn = document.getElementById('next-slide');
    const fullscreenPrevBtn = document.getElementById('fullscreen-prev');
    const fullscreenNextBtn = document.getElementById('fullscreen-next');
    
    if (prevSlideBtn) prevSlideBtn.addEventListener('click', showPreviousSlide);
    if (nextSlideBtn) nextSlideBtn.addEventListener('click', showNextSlide);
    if (fullscreenPrevBtn) fullscreenPrevBtn.addEventListener('click', showPreviousSlideFullscreen);
    if (fullscreenNextBtn) fullscreenNextBtn.addEventListener('click', showNextSlideFullscreen);
});

/**
 * Initialize the slide preview
 */
function initializeSlidePreview() {
    const slideshow = document.getElementById('slideshow');
    
    if (!slideshow) return;
    
    // Clear previous content
    slideshow.innerHTML = '';
    
    // Get slide data from app state
    const appState = window.appState || {};
    const slideData = appState.slideData;
    
    if (!slideData || !slideData.slides || !slideData.slides.length) {
        slideshow.innerHTML = '<p class="no-data">لا توجد بيانات للشرائح. الرجاء رفع ملف صالح.</p>';
        return;
    }
    
    // Create slides
    slideData.slides.forEach((slide, index) => {
        createPreviewSlide(slideshow, slide, index === 0);
    });
    
    // Update slide counter
    updateSlideCounter();
    
    // Update statistics
    updateStatistics(slideData.statistics, 'preview-statistics');
}

/**
 * Create a preview slide
 * @param {HTMLElement} container - The container to add the slide to
 * @param {Object} slideData - The slide data
 * @param {boolean} isActive - Whether this slide is active
 */
function createPreviewSlide(container, slideData, isActive) {
    const slide = document.createElement('div');
    slide.id = slideData.id;
    slide.className = `slide ${isActive ? 'active' : ''}`;
    slide.style.backgroundColor = slideData.background || '#ffffff';
    
    // Create elements
    slideData.elements.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.className = `slide-element slide-element-${element.type}`;
        
        // Set position and size
        if (element.position) {
            elementDiv.style.position = 'absolute';
            elementDiv.style.top = element.position.top;
            elementDiv.style.left = element.position.left;
            elementDiv.style.width = element.position.width;
            elementDiv.style.height = element.position.height;
        }
        
        // Set styles
        if (element.style) {
            Object.keys(element.style).forEach(key => {
                elementDiv.style[key] = element.style[key];
            });
        }
        
        // Create content based on element type
        switch (element.type) {
            case 'title':
            case 'text':
                elementDiv.innerHTML = element.content;
                break;
                
            case 'image':
                const img = document.createElement('img');
                img.src = element.src || 'https://via.placeholder.com/300x200?text=صورة';
                img.alt = 'صورة';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = element.style?.objectFit || 'cover';
                elementDiv.appendChild(img);
                break;
                
            case 'list':
                const ul = document.createElement('ul');
                element.content.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    ul.appendChild(li);
                });
                elementDiv.appendChild(ul);
                break;
                
            case 'chart':
                elementDiv.innerHTML = `<div class="chart-placeholder">مخطط بياني: ${element.chartType}</div>`;
                break;
                
            case 'date':
                const today = new Date();
                const formattedDate = formatDate(today, element.format || 'DD/MM/YYYY');
                elementDiv.textContent = formattedDate;
                break;
        }
        
        slide.appendChild(elementDiv);
    });
    
    container.appendChild(slide);
}

/**
 * Show the previous slide
 */
function showPreviousSlide() {
    const slides = document.querySelectorAll('#slideshow .slide');
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
    const slides = document.querySelectorAll('#slideshow .slide');
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
 * Show the previous slide in fullscreen mode
 */
function showPreviousSlideFullscreen() {
    const slides = document.querySelectorAll('#slideshow .slide');
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
        
        // Update fullscreen slide
        const fullscreenSlide = document.getElementById('fullscreen-slide');
        if (fullscreenSlide) {
            fullscreenSlide.innerHTML = slides[activeIndex - 1].innerHTML;
        }
        
        updateSlideCounter();
        updateFullscreenCounter();
    }
}

/**
 * Show the next slide in fullscreen mode
 */
function showNextSlideFullscreen() {
    const slides = document.querySelectorAll('#slideshow .slide');
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
        
        // Update fullscreen slide
        const fullscreenSlide = document.getElementById('fullscreen-slide');
        if (fullscreenSlide) {
            fullscreenSlide.innerHTML = slides[activeIndex + 1].innerHTML;
        }
        
        updateSlideCounter();
        updateFullscreenCounter();
    }
}

/**
 * Update the slide counter
 */
function updateSlideCounter() {
    const counter = document.getElementById('slide-counter');
    if (!counter) return;
    
    const slides = document.querySelectorAll('#slideshow .slide');
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
 * Update the fullscreen counter
 */
function updateFullscreenCounter() {
    const counter = document.getElementById('slide-counter');
    const fullscreenCounter = document.getElementById('fullscreen-counter');
    
    if (counter && fullscreenCounter) {
        fullscreenCounter.textContent = counter.textContent;
    }
}