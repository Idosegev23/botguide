document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate position with offset for fixed header
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if it's open
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
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
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = sectionId;
                }
            }
        });
        
        document.querySelectorAll('.anchor-nav a').forEach(anchor => {
            anchor.classList.remove('active');
            
            if (currentSection && anchor.getAttribute('href') === currentSection) {
                anchor.classList.add('active');
            }
        });
        
        document.querySelectorAll('.main-nav a').forEach(anchor => {
            anchor.classList.remove('active');
            
            if (currentSection && anchor.getAttribute('href') === currentSection) {
                anchor.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightCurrentSection);
    highlightCurrentSection();
    
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

    // טיפול באקורדיון בשאלות נפוצות
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // סגירת כל האקורדיונים האחרים
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // פתיחה/סגירה של האקורדיון הנוכחי
            item.classList.toggle('active');
        });
    });

    // צילום מסך - פתיחת תמונות בפופאפ
    const imageContainers = document.querySelectorAll('.image-container');
    
    // יצירת אלמנטי הפופאפ
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';
    
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    
    const popupImage = document.createElement('img');
    popupImage.className = 'popup-image';
    
    const popupClose = document.createElement('div');
    popupClose.className = 'popup-close';
    popupClose.innerHTML = '&times;';
    
    popupContent.appendChild(popupImage);
    popupContent.appendChild(popupClose);
    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);
    
    // טיפול באירועי לחיצה על תמונות
    imageContainers.forEach(container => {
        const img = container.querySelector('img');
        
        if (img) {
            container.addEventListener('click', () => {
                popupImage.src = img.src;
                popupOverlay.classList.add('active');
            });
        }
    });
    
    // סגירת הפופאפ
    popupClose.addEventListener('click', () => {
        popupOverlay.classList.remove('active');
    });
    
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            popupOverlay.classList.remove('active');
        }
    });

    // אנימציית גלילה חלקה למעבר לעוגנים
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // הדגשת התפריט הנוכחי בזמן גלילה
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a, .anchor-nav a');
    
    function highlightNavigation() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // הרחבת תמונות בעת מעבר עכבר
    const guideImages = document.querySelectorAll('.guide-image');
    
    guideImages.forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.02)';
        });
        
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });
}); 