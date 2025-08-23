// Main JavaScript for ARET Website

// Initialize document when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    document.querySelectorAll('.card, section').forEach(el => {
        observer.observe(el);
    });
});

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

// Dark Mode Toggle
const darkMode = {
    init: () => {
        const isDark = storage.get('darkMode') || false;
        if (isDark) {
            document.body.classList.add('dark-mode');
        }
        
        // Add toggle button if it doesn't exist
        if (!document.getElementById('darkModeToggle')) {
            const toggle = document.createElement('button');
            toggle.id = 'darkModeToggle';
            toggle.className = 'btn btn-sm position-fixed bottom-0 end-0 m-3';
            toggle.innerHTML = '<i class="fas fa-moon"></i>';
            toggle.style.zIndex = '9999';
            toggle.addEventListener('click', darkMode.toggle);
            document.body.appendChild(toggle);
        }
    },
    
    toggle: () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        storage.set('darkMode', isDark);
        
        const icon = document.querySelector('#darkModeToggle i');
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
};

// Initialize dark mode
darkMode.init();

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
    darkMode,
    pageFunctions
};
