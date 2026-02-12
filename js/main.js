// LUXURY EVENT VENUE BOOKING - MAIN JAVASCRIPT

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    initializeAnimations();
    initializeInteractions();
    initializeFilters();
    initializeWishlist();
    initializeScrollReveal();
    smoothScroll();
});

// Theme Toggle Functionality
function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    if (html.getAttribute('data-theme') === 'light') {
        html.removeAttribute('data-theme');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        if (themeText) themeText.textContent = 'Dark';
        localStorage.setItem('theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        if (themeText) themeText.textContent = 'Light';
        localStorage.setItem('theme', 'light');
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        if (themeText) themeText.textContent = 'Light';
    }
}

// Smooth scrolling for navigation links
function smoothScroll() {
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
}

// Initialize animations
function initializeAnimations() {
    // Hero animations
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');

    if (heroTitle) {
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 100);
    }

    if (heroSubtitle) {
        setTimeout(() => {
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 400);
    }

    if (heroButtons) {
        setTimeout(() => {
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
        }, 700);
    }

    // Parallax effect for hero sections
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero');

        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Initialize interactive elements
function initializeInteractions() {
    // Magnetic buttons effect
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline-primary');

    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });

    // Card hover effects
    const cards = document.querySelectorAll('.card, .venue-card, .dashboard-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Gold shimmer effect on hover
    const goldElements = document.querySelectorAll('.text-gold, .btn-primary');

    goldElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            this.style.textShadow = '0 0 20px rgba(212, 175, 55, 0.5)';
        });

        element.addEventListener('mouseleave', function () {
            this.style.textShadow = 'none';
        });
    });
}

// Initialize venue filters
function initializeFilters() {
    const filterForm = document.querySelector('#venueFilters');
    const venueCards = document.querySelectorAll('.venue-card');

    if (filterForm) {
        filterForm.addEventListener('change', function () {
            const filters = {
                location: document.querySelector('#locationFilter')?.value || '',
                eventType: document.querySelector('#eventTypeFilter')?.value || '',
                capacity: document.querySelector('#capacityFilter')?.value || '',
                priceRange: document.querySelector('#priceRangeFilter')?.value || ''
            };

            filterVenues(venueCards, filters);
        });
    }

    // Search functionality
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            filterVenues(venueCards, { search: searchTerm });
        });
    }
}

// Filter venues based on criteria
function filterVenues(venues, filters) {
    venues.forEach(venue => {
        let show = true;

        // Location filter
        if (filters.location && !venue.dataset.location?.includes(filters.location)) {
            show = false;
        }

        // Event type filter
        if (filters.eventType && !venue.dataset.eventTypes?.includes(filters.eventType)) {
            show = false;
        }

        // Capacity filter
        if (filters.capacity) {
            const venueCapacity = parseInt(venue.dataset.capacity);
            const minCapacity = parseInt(filters.capacity);
            if (venueCapacity < minCapacity) {
                show = false;
            }
        }

        // Price range filter
        if (filters.priceRange) {
            const venuePrice = parseInt(venue.dataset.price);
            const maxPrice = parseInt(filters.priceRange);
            if (venuePrice > maxPrice) {
                show = false;
            }
        }

        // Search filter
        if (filters.search) {
            const venueText = venue.textContent.toLowerCase();
            if (!venueText.includes(filters.search)) {
                show = false;
            }
        }

        venue.style.display = show ? 'block' : 'none';

        // Add animation
        if (show) {
            venue.style.animation = 'fadeInUp 0.5s ease-out';
        }
    });
}

// Initialize wishlist functionality
function initializeWishlist() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');

    wishlistButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const venueId = this.dataset.venueId;
            const isActive = this.classList.contains('active');

            if (isActive) {
                this.classList.remove('active');
                this.innerHTML = '<i class="far fa-heart"></i>';
                removeFromWishlist(venueId);
            } else {
                this.classList.add('active');
                this.innerHTML = '<i class="fas fa-heart"></i>';
                addToWishlist(venueId);
            }

            // Pulse animation
            this.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
}

// Add venue to wishlist
function addToWishlist(venueId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.includes(venueId)) {
        wishlist.push(venueId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification('Venue added to wishlist!', 'success');
    }
}

// Remove venue from wishlist
function removeFromWishlist(venueId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(id => id !== venueId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    showNotification('Venue removed from wishlist', 'info');
}

// Initialize scroll reveal animations
function initializeScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    function checkReveal() {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Check on load
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--royal-gold)' : 'var(--black-light)'};
        color: ${type === 'success' ? 'var(--midnight-black)' : 'var(--pearl-white)'};
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Image gallery with lightbox
function initializeGallery() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    const lightbox = document.querySelector('#lightbox');
    const lightboxImg = document.querySelector('#lightbox-img');
    const lightboxClose = document.querySelector('#lightbox-close');

    galleryImages.forEach(image => {
        image.addEventListener('click', function () {
            const imgSrc = this.src || this.dataset.src;
            lightboxImg.src = imgSrc;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Form validation
function validateForm(formId) {
    const form = document.querySelector(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');

            // Remove error on input
            input.addEventListener('input', function () {
                if (this.value.trim()) {
                    this.classList.remove('is-invalid');
                }
            });
        } else {
            input.classList.remove('is-invalid');
        }
    });

    return isValid;
}

// Loading states
function showLoading(element, text = 'Loading...') {
    const originalContent = element.innerHTML;
    element.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>${text}`;
    element.disabled = true;
    element.dataset.originalContent = originalContent;
}

function hideLoading(element) {
    if (element.dataset.originalContent) {
        element.innerHTML = element.dataset.originalContent;
        delete element.dataset.originalContent;
    }
    element.disabled = false;
}

// Dashboard animations
function initializeDashboard() {
    const statCards = document.querySelectorAll('.stat-card');

    statCards.forEach((card, index) => {
        const number = card.querySelector('.stat-number');
        if (number) {
            const finalValue = parseInt(number.textContent);
            animateNumber(number, 0, finalValue, 1000, index * 200);
        }
    });
}

// Animate numbers
function animateNumber(element, start, end, duration, delay = 0) {
    setTimeout(() => {
        const increment = (end - start) / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }, delay);
}

// Calendar functionality
function initializeCalendar() {
    const calendarDays = document.querySelectorAll('.calendar-day');

    calendarDays.forEach(day => {
        day.addEventListener('click', function () {
            // Remove previous selection
            calendarDays.forEach(d => d.classList.remove('selected'));

            // Add selection to clicked day
            this.classList.add('selected');

            // Update hidden input
            const dateInput = document.querySelector('#selectedDate');
            if (dateInput) {
                dateInput.value = this.dataset.date;
            }
        });
    });
}

// Compare venues functionality
function initializeCompare() {
    const compareButtons = document.querySelectorAll('.compare-btn');
    const compareContainer = document.querySelector('#compareContainer');

    compareButtons.forEach(button => {
        button.addEventListener('click', function () {
            const venueId = this.dataset.venueId;
            toggleCompare(venueId, this);
        });
    });
}

function toggleCompare(venueId, button) {
    let compareList = JSON.parse(localStorage.getItem('compareList') || '[]');

    if (compareList.includes(venueId)) {
        compareList = compareList.filter(id => id !== venueId);
        button.classList.remove('active');
        button.textContent = 'Compare';
    } else {
        if (compareList.length >= 3) {
            showNotification('You can compare up to 3 venues at a time', 'warning');
            return;
        }
        compareList.push(venueId);
        button.classList.add('active');
        button.textContent = 'Remove';
    }

    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCompareDisplay();
}

function updateCompareDisplay() {
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    const compareCount = document.querySelector('#compareCount');

    if (compareCount) {
        compareCount.textContent = compareList.length;
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .calendar-day.selected {
        background-color: var(--royal-gold) !important;
        color: var(--midnight-black) !important;
    }
    
    .is-invalid {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
    
    .notification {
        animation: slideInRight 0.3s ease-out;
    }
`;
document.head.appendChild(style);
