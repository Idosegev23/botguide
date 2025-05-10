document.addEventListener('DOMContentLoaded', function() {
    // Handle page loader
    const pageLoader = document.querySelector('.page-loader');
    if (pageLoader) {
        // Hide loader after page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                pageLoader.classList.add('hidden');
                // Remove from DOM after animation is complete
                setTimeout(() => {
                    pageLoader.remove();
                }, 500);
            }, 500); // Small delay to ensure everything is rendered
        });
    }
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links - improved
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate position with offset for fixed header and smooth scroll
                const headerHeight = document.querySelector('.site-header').offsetHeight + 20;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Add active class to the clicked link
                document.querySelectorAll('.anchor-nav a, .main-nav a').forEach(link => {
                    link.classList.remove('active');
                });
                document.querySelectorAll(`.anchor-nav a[href="${targetId}"], .main-nav a[href="${targetId}"]`).forEach(link => {
                    link.classList.add('active');
                });
                
                // Highlight the section
                document.querySelectorAll('section').forEach(section => {
                    section.classList.remove('active-section');
                });
                targetElement.classList.add('active-section');
                
                // Close mobile menu if it's open
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });

    // FAQ Accordion - improved
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        header.addEventListener('click', () => {
            // Close all other accordions
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    otherContent.style.maxHeight = '0';
                }
            });
            
            // Toggle the current accordion
            const isActive = item.classList.contains('active');
            item.classList.toggle('active');
            
            if (!isActive) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });
    
    // Highlight current section in anchor navigation
    function highlightCurrentSection() {
        const sections = [
            '#step1',
            '#step2',
            '#step3',
            '#step4',
            '#step5',
            '#tips',
            '#intro',
            '#openai',
            '#make',
            '#greenapi',
            '#expansion'
        ];
        
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        let currentSection = null;
        
        sections.forEach(sectionId => {
            const section = document.querySelector(sectionId);
            if (section) {
                const sectionTop = section.offsetTop - 100; // Account for sticky header
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = sectionId;
                    
                    // Add subtle animation to the current section
                    section.classList.add('active-section');
                } else {
                    const inactiveSection = document.querySelector(sectionId);
                    if (inactiveSection) {
                        inactiveSection.classList.remove('active-section');
                    }
                }
            }
        });
        
        document.querySelectorAll('.anchor-nav a, .main-nav a').forEach(anchor => {
            anchor.classList.remove('active');
            
            if (currentSection && anchor.getAttribute('href') === currentSection) {
                anchor.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightCurrentSection);
    // Call once to set initial state
    highlightCurrentSection();
    
    // Add CSS animation class to sections when they come into view
    function animateSectionsOnScroll() {
        const allSections = document.querySelectorAll('.step-section, .faq-section, .cta-section');
        
        allSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const screenPosition = window.innerHeight * 0.9;
            
            if (sectionTop < screenPosition) {
                section.classList.add('fade-in-section');
            }
        });
    }
    
    window.addEventListener('scroll', animateSectionsOnScroll);
    // Call once to check initial viewport
    animateSectionsOnScroll();
    
    // Stylize emojis in text elements
    function stylizeEmojis() {
        const textElements = document.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6');
        const emojiRegex = /[\p{Emoji}]/gu;
        
        textElements.forEach(element => {
            const text = element.innerHTML;
            if (emojiRegex.test(text)) {
                element.innerHTML = text.replace(emojiRegex, match => {
                    return `<span class="emoji">${match}</span>`;
                });
            }
        });
    }
    
    stylizeEmojis();

    // Enhanced image handling with lightbox
    const imageContainers = document.querySelectorAll('.image-container');
    
    // Create popup overlay elements
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';
    
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    
    const popupImage = document.createElement('img');
    popupImage.className = 'popup-image';
    
    const popupClose = document.createElement('div');
    popupClose.className = 'popup-close';
    popupClose.innerHTML = '&times;';
    
    const popupCaption = document.createElement('div');
    popupCaption.className = 'popup-caption';
    
    popupContent.appendChild(popupImage);
    popupContent.appendChild(popupCaption);
    popupContent.appendChild(popupClose);
    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);
    
    // Handle image clicks
    imageContainers.forEach(container => {
        const img = container.querySelector('img');
        
        if (img) {
            // Add zoom effect on hover
            img.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.02)';
                img.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            });
            
            img.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
                img.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
            });
            
            // Open image in lightbox on click
            container.addEventListener('click', () => {
                popupImage.src = img.src;
                
                // Get alt text or generate a caption
                const caption = img.alt || 'תמונה מתוך המדריך';
                popupCaption.textContent = caption;
                
                // Show the overlay with animation
                popupOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling while overlay is active
            });
        }
    });
    
    // Close popup handlers
    popupClose.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
            closePopup();
        }
    });
    
    function closePopup() {
        popupOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    // Add "Copy to Clipboard" functionality for code blocks
    document.querySelectorAll('pre code').forEach(codeBlock => {
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.textContent = 'העתק קוד';
        
        // Insert button before code block
        codeBlock.parentNode.insertBefore(copyButton, codeBlock);
        
        // Add click handler
        copyButton.addEventListener('click', () => {
            const code = codeBlock.textContent;
            navigator.clipboard.writeText(code).then(() => {
                // Visual feedback
                copyButton.textContent = 'הועתק!';
                copyButton.classList.add('copied');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    copyButton.textContent = 'העתק קוד';
                    copyButton.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Error copying text: ', err);
                copyButton.textContent = 'שגיאה בהעתקה';
                
                setTimeout(() => {
                    copyButton.textContent = 'העתק קוד';
                }, 2000);
            });
        });
    });
    
    // Add animated scroll indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = '<div class="scroll-arrow"></div>';
    document.querySelector('.hero-section').appendChild(scrollIndicator);
    
    scrollIndicator.addEventListener('click', () => {
        const firstSection = document.querySelector('#intro') || document.querySelector('main').firstElementChild;
        if (firstSection) {
            window.scrollTo({
                top: firstSection.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
    
    // Hide scroll indicator when scrolled down
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }
    });
    
    // Add "Back to Top" button
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '↑';
    backToTopButton.title = 'חזרה לראש העמוד';
    document.body.appendChild(backToTopButton);
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
}); 