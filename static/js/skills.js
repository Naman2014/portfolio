document.addEventListener('DOMContentLoaded', function() {
    // Initialize Intersection Observer for skill progress bars
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // When skill item is visible
            if (entry.isIntersecting) {
                const skillItem = entry.target;
                const levelElement = skillItem.querySelector('.skill-level');
                const progressElement = skillItem.querySelector('.skill-progress');
                
                // Get the progress level from data attribute
                if (levelElement && progressElement) {
                    const level = levelElement.getAttribute('data-level');
                    
                    // Set the progress width with a small delay
                    setTimeout(() => {
                        progressElement.style.width = level;
                    }, 100);
                }
                
                // Stop observing once animated
                observer.unobserve(skillItem);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.2, // trigger when 20% visible
        rootMargin: '0px'
    });
    
    // Observe all skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        observer.observe(item);
    });
    
    // Skills Slider Navigation
    const skillsSliders = document.querySelectorAll('.skills-slider.unified');
    
    skillsSliders.forEach(skillsSlider => {
        const prevArrow = skillsSlider.parentElement.querySelector('.prev-arrow');
        const nextArrow = skillsSlider.parentElement.querySelector('.next-arrow');
        
        if (skillsSlider && prevArrow && nextArrow) {
            // Set scroll amount to exactly the width of one card plus gap
            const getScrollAmount = () => {
                const cardWidth = skillsSlider.querySelector('.skill-item').offsetWidth;
                const computedStyle = window.getComputedStyle(skillsSlider);
                const gap = parseInt(computedStyle.getPropertyValue('gap'), 10) || 25;
                
                // Scroll by 1 card at a time for a smooth experience
                return cardWidth + gap;
            };
            
            // Scroll functions
            const scrollLeft = () => {
                skillsSlider.scrollBy({
                    left: -getScrollAmount(),
                    behavior: 'smooth'
                });
            };
            
            const scrollRight = () => {
                skillsSlider.scrollBy({
                    left: getScrollAmount(),
                    behavior: 'smooth'
                });
            };
            
            // Add click event listeners
            prevArrow.addEventListener('click', scrollLeft);
            nextArrow.addEventListener('click', scrollRight);
            
            // Add keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (isElementInViewport(skillsSlider)) {
                    if (e.key === 'ArrowLeft') {
                        scrollLeft();
                    } else if (e.key === 'ArrowRight') {
                        scrollRight();
                    }
                }
            });
            
            // Auto-scroll functionality
            let autoScrollInterval;
            let isUserInteracting = false;
            
            const startAutoScroll = () => {
                autoScrollInterval = setInterval(() => {
                    if (!isUserInteracting) {
                        // If at the end, go back to start
                        if (skillsSlider.scrollLeft >= skillsSlider.scrollWidth - skillsSlider.clientWidth - 10) {
                            skillsSlider.scrollTo({
                                left: 0,
                                behavior: 'smooth'
                            });
                        } else {
                            // Otherwise continue scrolling
                            scrollRight();
                        }
                    }
                }, 4000);
            };
            
            // Start auto-scrolling
            startAutoScroll();
            
            // Pause when user interacts
            skillsSlider.addEventListener('mouseenter', () => {
                isUserInteracting = true;
            });
            
            skillsSlider.addEventListener('mouseleave', () => {
                isUserInteracting = false;
            });
            
            skillsSlider.addEventListener('touchstart', () => {
                isUserInteracting = true;
            });
            
            document.addEventListener('touchend', () => {
                setTimeout(() => {
                    isUserInteracting = false;
                }, 3000);
            });
            
            // Helper function to check if element is in viewport
            function isElementInViewport(el) {
                const rect = el.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            }
        }
    });
    
    // Legacy code for multiple sliders (kept for backwards compatibility)
    const skillsSlidersLegacy = document.querySelectorAll('.skills-slider:not(.unified)');
    if (skillsSlidersLegacy.length > 0) {
        let isScrolling = false;
        
        // Auto-scroll function
        function autoScroll(slider) {
            if (isScrolling) return;
            
            const scrollWidth = slider.scrollWidth;
            const clientWidth = slider.clientWidth;
            let currentScroll = slider.scrollLeft;
            
            // If we're at the end, go back to start
            if (currentScroll >= scrollWidth - clientWidth - 10) {
                slider.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                // Otherwise scroll a bit more
                slider.scrollTo({
                    left: currentScroll + 200,
                    behavior: 'smooth'
                });
            }
        }
        
        // Set interval for auto-scroll
        const scrollIntervals = [];
        
        skillsSlidersLegacy.forEach((slider, index) => {
            // Set different intervals for each slider
            const interval = setInterval(() => {
                autoScroll(slider);
            }, 5000 + (index * 1000)); // Stagger the timings
            
            scrollIntervals.push(interval);
            
            // Pause auto-scroll on hover
            slider.addEventListener('mouseenter', () => {
                isScrolling = true;
            });
            
            slider.addEventListener('mouseleave', () => {
                isScrolling = false;
            });
            
            // Pause on touch/manual scroll
            slider.addEventListener('scroll', () => {
                isScrolling = true;
                clearTimeout(slider.scrollTimeout);
                slider.scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                }, 2000);
            });
        });
    }
}); 