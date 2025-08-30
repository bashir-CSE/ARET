// Main JavaScript for ARET Website

// Initialize document when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add page transition effect
    document.body.classList.add('page-transition');
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Initialize image loading animations
    initializeImageLoading();
    
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Initialize navigation features
    initializeNavigation();
    
    // Initialize back to top button
    initializeBackToTop();
    
    // Set active navigation link
    setActiveNavLink();
    
    // Add smooth scrolling for all anchor links and improved implementation
    initializeSmoothScrolling();
    
    // Add animation to elements when they come into view
    initializeScrollAnimations();
});

// Initialize Smooth Scrolling
function initializeSmoothScrolling() {
    // Enhanced smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                // Use both methods for better browser support
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback for older browsers
                    smoothScrollTo(targetPosition, 800);
                }
            }
        });
    });
    
    // Smooth scrolling for internal page links
    document.querySelectorAll('a[href*=".html#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const [page, hash] = href.split('#');
            
            if (hash && window.location.pathname.includes(page)) {
                e.preventDefault();
                const target = document.getElementById(hash);
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Smooth scroll fallback for older browsers
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    // Easing function for smooth animation
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Initialize Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Remove initial hidden state
                entry.target.style.opacity = '';
                entry.target.style.transform = '';
                
                // Add animation classes with staggered timing
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                    
                    // Add specific animations based on element type
                    if (entry.target.classList.contains('card')) {
                        entry.target.classList.add('scale-in');
                    }
                    
                    if (entry.target.tagName === 'SECTION') {
                        entry.target.classList.add('slide-in-left');
                    }
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.card, section, .btn-lg');
    elementsToAnimate.forEach((el, index) => {
        // Set initial state only if element is not in viewport
        const rect = el.getBoundingClientRect();
        if (rect.top > window.innerHeight) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
        }
        
        observer.observe(el);
        
        // Add stagger classes for CSS animations
        if (index < 5) {
            el.classList.add(`stagger-${index + 1}`);
        }
    });
    
    // Enhanced hover effects for interactive elements
    document.querySelectorAll('.card, .btn, .nav-link').forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (!this.classList.contains('animating')) {
                this.style.transition = 'transform 0.3s ease';
                this.style.transform = 'translateY(-2px) scale(1.02)';
            }
        });
        
        element.addEventListener('mouseleave', function() {
            if (!this.classList.contains('animating')) {
                this.style.transform = '';
            }
        });
    });
}

// Initialize Image Loading Animations
function initializeImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Handle images that are already loaded
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        }
    });
}

// Initialize Navigation Features
function initializeNavigation() {
    // Add click tracking to navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            analytics.trackInteraction(this, 'navigation_click');
        });
    });
}

// Set Active Navigation Link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Check if link matches current page
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Initialize Back to Top Button
function initializeBackToTop() {
    // Create back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.setAttribute('type', 'button');
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position with throttling
    let ticking = false;
    
    function updateBackToTopButton() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateBackToTopButton);
            ticking = true;
        }
    }, { passive: true });
    
    // Enhanced smooth scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        // Add visual feedback
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // Multiple scroll methods for better browser support
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Fallback smooth scroll
            smoothScrollTo(0, 800);
        }
        
        // Track analytics
        if (typeof analytics !== 'undefined') {
            analytics.track('back_to_top_click');
        }
    });
}

// Utility Functions

// Show notification
function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone number
function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 2
    }).format(amount);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Local Storage Functions
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage', e);
            return false;
        }
    },
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from localStorage', e);
            return null;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage', e);
            return false;
        }
    }
};

// Cookie Functions
const cookies = {
    set: (name, value, days = 7) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    },
    get: (name) => {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    remove: (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
};

// Analytics Functions
const analytics = {
    track: (event, data = {}) => {
        // In a real implementation, this would send data to your analytics service
        console.log('Analytics Event:', event, data);
        
        // Example: Track page views
        if (event === 'pageview') {
            const pageData = {
                page: window.location.pathname,
                title: document.title,
                timestamp: new Date().toISOString(),
                ...data
            };
            
            // Store in localStorage for now
            const pageViews = storage.get('pageViews') || [];
            pageViews.push(pageData);
            storage.set('pageViews', pageViews.slice(-100)); // Keep last 100 views
        }
    },
    
    // Track user interactions
    trackInteraction: (element, action) => {
        analytics.track('interaction', {
            element: element.tagName,
            class: element.className,
            id: element.id,
            action: action,
            timestamp: new Date().toISOString()
        });
    }
};

// Form Validation
const formValidation = {
    validate: (formElement) => {
        const inputs = formElement.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                input.classList.add('is-invalid');
                this.showError(input, 'This field is required');
            } else if (input.type === 'email' && input.value && !validateEmail(input.value)) {
                isValid = false;
                input.classList.add('is-invalid');
                this.showError(input, 'Please enter a valid email address');
            } else if (input.type === 'tel' && input.value && !validatePhone(input.value)) {
                isValid = false;
                input.classList.add('is-invalid');
                this.showError(input, 'Please enter a valid phone number');
            } else {
                input.classList.remove('is-invalid');
                this.clearError(input);
            }
        });
        
        return isValid;
    },
    
    showError: (input, message) => {
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = message;
        } else {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = message;
            input.parentNode.insertBefore(errorDiv, input.nextSibling);
        }
    },
    
    clearError: (input) => {
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.remove();
        }
    }
};

// Page-specific functions
const pageFunctions = {
    // Home page specific functions
    home: {
        init: () => {
            // Initialize home page specific features
            console.log('Initializing home page');
            
            // Add animation to featured courses
            const courseCards = document.querySelectorAll('#courses-grid .card');
            courseCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
        }
    },
    
    // Courses page specific functions
    courses: {
        init: () => {
            // Initialize courses page specific features
            console.log('Initializing courses page');
            
            // Add filter functionality
            const filterButtons = document.querySelectorAll('.btn-group button');
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    const category = this.getAttribute('data-category');
                    filterCourses(category);
                });
            });
        }
    },
    
    // Contact page specific functions
    contact: {
        init: () => {
            // Initialize contact page specific features
            console.log('Initializing contact page');
            
            // Form submission
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    if (formValidation.validate(this)) {
                        // In a real implementation, this would send the form data
                        showNotification('Thank you for your message! We will get back to you soon.', 'success');
                        this.reset();
                    } else {
                        showNotification('Please fix the errors in the form', 'warning');
                    }
                });
            }
        }
    },
    
    // Blog page specific functions
    blog: {
        init: () => {
            // Initialize blog page specific features
            console.log('Initializing blog page');
            
            // Add read more functionality
            const readMoreButtons = document.querySelectorAll('.btn-sm.btn-outline-primary');
            readMoreButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    // In a real implementation, this would navigate to the full blog post
                    showNotification('Blog post functionality would be implemented here', 'info');
                });
            });
        }
    }
};

// Initialize page-specific functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageName = currentPage.replace('.html', '');
    
    if (pageFunctions[pageName]) {
        pageFunctions[pageName].init();
    }
    
    // Track page view
    analytics.track('pageview', {
        referrer: document.referrer,
        userAgent: navigator.userAgent
    });
});

// Export functions for use in other scripts
window.ARET = {
    showNotification,
    validateEmail,
    validatePhone,
    formatCurrency,
    storage,
    cookies,
    analytics,
    formValidation,
    pageFunctions
};
