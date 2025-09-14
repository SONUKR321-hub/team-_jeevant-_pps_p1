class SlidePresentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 18;
        this.isTransitioning = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateUI();
    }

    initializeElements() {
        this.slidesWrapper = document.getElementById('slidesWrapper');
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.slideCounter = document.getElementById('slideCounter');
        this.progressFill = document.getElementById('progressFill');
        this.shortcutsHelp = document.getElementById('shortcutsHelp');
    }

    attachEventListeners() {
        // Navigation button events - Fixed the button assignments
        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.previousSlide();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.nextSlide();
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Click anywhere to advance (except on buttons)
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-controls') && !e.target.closest('.shortcuts-help')) {
                this.nextSlide();
            }
        });

        // Touch/swipe events for mobile
        this.attachTouchEvents();

        // Window resize event
        window.addEventListener('resize', () => this.handleResize());
    }

    attachTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;

        this.slidesWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        });

        this.slidesWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);
        });
    }

    handleSwipe(startX, endX, startY, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;

        // Check if horizontal swipe is more significant than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - go to previous slide
                this.previousSlide();
            } else {
                // Swipe left - go to next slide
                this.nextSlide();
            }
        }
    }

    handleKeyboard(e) {
        // Prevent keyboard navigation if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key) {
            case 'ArrowRight':
            case ' ':
            case 'Enter':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                this.toggleFullscreen();
                break;
            case '?':
            case 'h':
                this.toggleShortcutsHelp();
                break;
        }
    }

    nextSlide() {
        if (this.isTransitioning || this.currentSlide >= this.totalSlides) {
            return;
        }
        this.goToSlide(this.currentSlide + 1);
    }

    previousSlide() {
        if (this.isTransitioning || this.currentSlide <= 1) {
            return;
        }
        this.goToSlide(this.currentSlide - 1);
    }

    goToSlide(slideNumber) {
        if (this.isTransitioning || slideNumber < 1 || slideNumber > this.totalSlides || slideNumber === this.currentSlide) {
            return;
        }

        this.isTransitioning = true;

        // Remove active class from current slide
        const currentSlideElement = this.slides[this.currentSlide - 1];
        currentSlideElement.classList.remove('active');
        
        // Add prev class for slide-out animation
        if (slideNumber > this.currentSlide) {
            currentSlideElement.classList.add('prev');
        }

        // Update current slide number
        const previousSlide = this.currentSlide;
        this.currentSlide = slideNumber;

        // Activate new slide after a short delay
        setTimeout(() => {
            const newSlideElement = this.slides[this.currentSlide - 1];
            newSlideElement.classList.add('active');
            
            // Remove prev class from old slide
            this.slides[previousSlide - 1].classList.remove('prev');
            
            this.updateUI();
            
            // Allow new transitions after animation completes
            setTimeout(() => {
                this.isTransitioning = false;
            }, 250);
        }, 50);
    }

    updateUI() {
        // Update slide counter
        this.slideCounter.textContent = `${this.currentSlide} / ${this.totalSlides}`;

        // Update progress bar
        const progressPercentage = (this.currentSlide / this.totalSlides) * 100;
        this.progressFill.style.width = `${progressPercentage}%`;

        // Update navigation button states - Fixed the disable logic
        const isFirstSlide = this.currentSlide === 1;
        const isLastSlide = this.currentSlide === this.totalSlides;
        
        // Disable/enable buttons properly
        this.prevBtn.disabled = isFirstSlide;
        this.nextBtn.disabled = isLastSlide;

        // Update visual states
        if (isFirstSlide) {
            this.prevBtn.style.opacity = '0.5';
            this.prevBtn.style.cursor = 'not-allowed';
        } else {
            this.prevBtn.style.opacity = '1';
            this.prevBtn.style.cursor = 'pointer';
        }

        if (isLastSlide) {
            this.nextBtn.style.opacity = '0.5';
            this.nextBtn.style.cursor = 'not-allowed';
        } else {
            this.nextBtn.style.opacity = '1';
            this.nextBtn.style.cursor = 'pointer';
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    toggleShortcutsHelp() {
        const isVisible = this.shortcutsHelp.style.display !== 'none';
        this.shortcutsHelp.style.display = isVisible ? 'none' : 'block';
        
        // Auto-hide after 3 seconds
        if (!isVisible) {
            setTimeout(() => {
                this.shortcutsHelp.style.display = 'none';
            }, 3000);
        }
    }

    handleResize() {
        // Handle any responsive adjustments if needed
        // Currently handled by CSS, but available for future enhancements
    }

    // Method to programmatically navigate to specific slides
    jumpToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
            this.goToSlide(slideNumber);
        }
    }

    // Method to get current slide info
    getCurrentSlideInfo() {
        return {
            current: this.currentSlide,
            total: this.totalSlides,
            percentage: (this.currentSlide / this.totalSlides) * 100
        };
    }

    // Auto-play functionality (optional)
    startAutoPlay(intervalMs = 10000) {
        this.autoPlayInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides) {
                this.nextSlide();
            } else {
                this.stopAutoPlay();
            }
        }, intervalMs);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    // Method to add slide transition animations
    addCustomAnimation(slideElement, animationType = 'fade') {
        slideElement.classList.add(`animation-${animationType}`);
    }
}

// Enhanced slide content management
class SlideContentManager {
    constructor(presentation) {
        this.presentation = presentation;
        this.initializeSlideContent();
    }

    initializeSlideContent() {
        // Add any dynamic content initialization here
        this.addSlideNumbers();
        this.enhanceTablesForMobile();
        this.addProgressiveDisclosure();
    }

    addSlideNumbers() {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            if (!slide.querySelector('.slide-number')) {
                const slideNumber = document.createElement('div');
                slideNumber.className = 'slide-number';
                slideNumber.textContent = index + 1;
                slideNumber.style.position = 'absolute';
                slideNumber.style.bottom = '20px';
                slideNumber.style.left = '20px';
                slideNumber.style.fontSize = '12px';
                slideNumber.style.color = 'var(--color-text-secondary)';
                slideNumber.style.opacity = '0.7';
                slide.appendChild(slideNumber);
            }
        });
    }

    enhanceTablesForMobile() {
        const tables = document.querySelectorAll('.performance-table, .results-table, .partnership-table');
        
        tables.forEach(table => {
            // Add horizontal scroll wrapper for mobile
            if (!table.parentElement.classList.contains('table-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-wrapper';
                wrapper.style.overflowX = 'auto';
                wrapper.style.WebkitOverflowScrolling = 'touch';
                
                table.parentElement.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
    }

    addProgressiveDisclosure() {
        // Add click-to-reveal functionality for bullet points
        const bulletLists = document.querySelectorAll('.slide-bullets');
        
        bulletLists.forEach(list => {
            const bullets = list.querySelectorAll('li');
            bullets.forEach((bullet, index) => {
                // Add staggered animation delay
                bullet.style.animationDelay = `${index * 0.1}s`;
                bullet.classList.add('bullet-item');
            });
        });
    }
}

// Accessibility enhancements
class AccessibilityManager {
    constructor(presentation) {
        this.presentation = presentation;
        this.initializeAccessibility();
    }

    initializeAccessibility() {
        this.addAriaLabels();
        this.setupFocusManagement();
        this.addScreenReaderAnnouncements();
    }

    addAriaLabels() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.setAttribute('aria-label', 'Previous slide');
        nextBtn.setAttribute('aria-label', 'Next slide');
        
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
            slide.setAttribute('role', 'img');
        });
    }

    setupFocusManagement() {
        // Ensure proper focus management for keyboard users
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Custom tab handling if needed
            }
        });
    }

    addScreenReaderAnnouncements() {
        // Create live region for slide announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'slide-announcements';
        document.body.appendChild(liveRegion);
    }

    announceSlideChange(slideNumber, totalSlides) {
        const liveRegion = document.getElementById('slide-announcements');
        if (liveRegion) {
            liveRegion.textContent = `Now on slide ${slideNumber} of ${totalSlides}`;
        }
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            slideTransitions: [],
            loadTime: performance.now()
        };
    }

    recordSlideTransition(fromSlide, toSlide, duration) {
        this.metrics.slideTransitions.push({
            from: fromSlide,
            to: toSlide,
            duration: duration,
            timestamp: performance.now()
        });
    }

    getAverageTransitionTime() {
        if (this.metrics.slideTransitions.length === 0) return 0;
        
        const total = this.metrics.slideTransitions.reduce((sum, transition) => 
            sum + transition.duration, 0);
        return total / this.metrics.slideTransitions.length;
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize main presentation
    const presentation = new SlidePresentation();
    
    // Initialize additional managers
    const contentManager = new SlideContentManager(presentation);
    const accessibilityManager = new AccessibilityManager(presentation);
    const performanceMonitor = new PerformanceMonitor();
    
    // Enhanced slide change handler
    const originalGoToSlide = presentation.goToSlide.bind(presentation);
    presentation.goToSlide = function(slideNumber) {
        const startTime = performance.now();
        const currentSlide = this.currentSlide;
        
        originalGoToSlide(slideNumber);
        
        // Record performance and announce change
        setTimeout(() => {
            const endTime = performance.now();
            performanceMonitor.recordSlideTransition(currentSlide, slideNumber, endTime - startTime);
            accessibilityManager.announceSlideChange(slideNumber, this.totalSlides);
        }, 300);
    };
    
    // Global presentation object for external access
    window.JeevantPresentation = {
        presentation: presentation,
        contentManager: contentManager,
        accessibilityManager: accessibilityManager,
        performanceMonitor: performanceMonitor,
        
        // Public API methods
        goToSlide: (slideNumber) => presentation.jumpToSlide(slideNumber),
        next: () => presentation.nextSlide(),
        previous: () => presentation.previousSlide(),
        getCurrentInfo: () => presentation.getCurrentSlideInfo(),
        startAutoPlay: (interval) => presentation.startAutoPlay(interval),
        stopAutoPlay: () => presentation.stopAutoPlay()
    };
    
    // Log initialization
    console.log('Jeevant AI Presentation initialized successfully');
    console.log('Available commands: JeevantPresentation.goToSlide(n), JeevantPresentation.next(), JeevantPresentation.previous()');
    
    // Show initial shortcuts help briefly
    setTimeout(() => {
        presentation.toggleShortcutsHelp();
    }, 2000);
});