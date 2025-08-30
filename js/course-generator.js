// Course Generator for ARET Website

// Global variables
let coursesData = [];
let filteredCourses = [];

// Initialize course generator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadCourses();
    
    // Initialize search functionality
    const searchInput = document.getElementById('course-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            searchCourses(this.value);
        }, 300));
    }
});

// Load courses from JSON file
function loadCourses() {
    fetch('data/courses.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            coursesData = data.courses;
            filteredCourses = [...coursesData];
            renderCourses(filteredCourses);
        })
        .catch(error => {
            console.error('Error loading courses:', error);
            showNotification('Error loading courses. Please try again later.', 'danger');
        });
}

// Render courses in the grid
function renderCourses(courses) {
    const coursesGrid = document.getElementById('courses-grid');
    if (!coursesGrid) return;
    
    // Clear existing courses
    coursesGrid.innerHTML = '';
    
    if (courses.length === 0) {
        coursesGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No courses found</h4>
                <p class="text-muted">Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    // Create course cards
    courses.forEach((course, index) => {
        const courseCard = createCourseCard(course, index);
        coursesGrid.appendChild(courseCard);
    });
    
    // Add animation to cards
    setTimeout(() => {
        const cards = coursesGrid.querySelectorAll('.card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }, 100);
}

// Create a course card element
function createCourseCard(course, index) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 mb-4';
    
    const discount = Math.round((1 - course.price / course.originalPrice) * 100);
    
    col.innerHTML = `
        <div class="card h-100 shadow-sm course-card" data-category="${course.category}" data-index="${index}">
            <div class="position-relative">
                <img src="${course.image}" class="card-img-top" alt="${course.title}" loading="lazy" style="opacity: 0; transition: opacity 0.3s ease;">
                ${discount > 0 ? `<span class="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 rounded m-2">${discount}% OFF</span>` : ''}
                <span class="position-absolute bottom-0 start-0 bg-primary text-white px-2 py-1 rounded m-2">${course.level}</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${course.title}</h3>
                ${course.subtitle ? `<h6 class="text-muted mb-3">${course.subtitle}</h6>` : ''}
                <p class="card-text">${course.description}</p>
                
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <span class="text-primary fw-bold h5 mb-0">BDT: ${formatCurrency(course.price)}</span>
                        ${course.originalPrice > course.price ? `<span class="text-decoration-line-through text-muted ms-2">BDT: ${formatCurrency(course.originalPrice)}</span>` : ''}
                    </div>
                    <span class="badge bg-secondary">${course.duration}</span>
                </div>
                
                <div class="d-flex flex-wrap gap-1 mb-3">
                    ${course.features.slice(0, 3).map(feature => 
                        `<span class="badge bg-light text-dark small">${feature}</span>`
                    ).join('')}
                    ${course.features.length > 3 ? `<span class="badge bg-light text-dark small">+${course.features.length - 3} more</span>` : ''}
                </div>
                
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">
                        <i class="fas fa-user-tie me-1"></i> ${course.instructor}
                    </small>
                    <a href="${course.enrollmentUrl}" class="btn btn-primary btn-sm">Course Description</a>
                </div>
            </div>
        </div>
    `;
    
    // Initialize enhanced image loading with shimmering effect
    const img = col.querySelector('img');
    if (img) {
        // Add shimmering effect while loading
        img.style.backgroundImage = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
        img.style.backgroundSize = '200% 100%';
        img.style.animation = 'loading 1.5s infinite';
        
        img.onload = function() {
            // Remove loading animation and show image
            this.style.backgroundImage = '';
            this.style.animation = '';
            this.style.opacity = '1';
            this.classList.add('loaded');
            console.log('Image loaded successfully:', this.src);
        };
        
        img.onerror = function() {
            console.error('Failed to load image:', this.src);
            // Try alternative image paths with cascading fallbacks
            if (this.src.includes('thumb-') && !this.src.includes('course-placeholder')) {
                this.src = 'images/course-placeholder.svg';
            } else if (!this.src.includes('placeholder')) {
                this.src = 'https://via.placeholder.com/300x200/6c5ce7/ffffff?text=Course+Image';
            } else {
                // Final fallback - remove loading animation and show placeholder background
                this.style.backgroundImage = 'linear-gradient(135deg, #6c5ce7 0%, #a777e3 100%)';
                this.style.animation = '';
            }
            this.style.opacity = '1';
        };
        
        // Check if image is already loaded (cached)
        if (img.complete && img.naturalHeight !== 0) {
            img.style.backgroundImage = '';
            img.style.animation = '';
            img.style.opacity = '1';
            img.classList.add('loaded');
        }
        
        // Force load check after a small delay to handle edge cases
        setTimeout(() => {
            if (img.style.opacity === '0') {
                console.warn('Image taking longer to load, checking status:', img.src);
                if (img.complete) {
                    if (img.naturalHeight === 0) {
                        // Image failed to load, trigger error handler
                        img.onerror();
                    } else {
                        // Image loaded, trigger success handler
                        img.onload();
                    }
                }
            }
        }, 3000); // 3 second timeout
    }
    
    return col;
}

// Filter courses by category
function filterCourses(category) {
    if (category === 'all') {
        filteredCourses = [...coursesData];
    } else {
        filteredCourses = coursesData.filter(course => course.category === category);
    }
    
    // Update active button
    const buttons = document.querySelectorAll('.btn-group button');
    buttons.forEach(button => {
        if (button.getAttribute('onclick').includes(category)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    renderCourses(filteredCourses);
}

// Search courses
function searchCourses(query) {
    if (!query.trim()) {
        filteredCourses = [...coursesData];
    } else {
        const searchTerm = query.toLowerCase();
        filteredCourses = coursesData.filter(course => 
            course.title.toLowerCase().includes(searchTerm) ||
            course.description.toLowerCase().includes(searchTerm) ||
            course.category.toLowerCase().includes(searchTerm) ||
            course.instructor.toLowerCase().includes(searchTerm) ||
            course.features.some(feature => feature.toLowerCase().includes(searchTerm))
        );
    }
    
    renderCourses(filteredCourses);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-BD', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Sort courses
function sortCourses(sortBy) {
    switch(sortBy) {
        case 'price-low':
            filteredCourses.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredCourses.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'duration':
            filteredCourses.sort((a, b) => a.duration.localeCompare(b.duration));
            break;
        default:
            filteredCourses = [...coursesData];
    }
    
    renderCourses(filteredCourses);
}

// Get course by ID
function getCourseById(id) {
    return coursesData.find(course => course.id === id);
}

// Get courses by category
function getCoursesByCategory(category) {
    return coursesData.filter(course => course.category === category);
}

// Get featured courses
function getFeaturedCourses() {
    return coursesData.filter(course => course.price < course.originalPrice);
}

// Export functions for use in other scripts
window.CourseGenerator = {
    loadCourses,
    renderCourses,
    filterCourses,
    searchCourses,
    sortCourses,
    getCourseById,
    getCoursesByCategory,
    getFeaturedCourses,
    formatCurrency
};
