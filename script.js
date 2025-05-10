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
    
    // וידוא שקישורים מוצגים כראוי ולא כטקסט
    fixExternalLinks();
    
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
                document.querySelectorAll('.nav-menu a').forEach(link => {
                    link.classList.remove('active');
                });
                document.querySelectorAll(`.nav-menu a[href="${targetId}"]`).forEach(link => {
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
        
        document.querySelectorAll('.nav-menu a').forEach(anchor => {
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

    // הפעלת אירוע לחיצה לכפתור הצ'אט בתפריט
    const chatToggleButton = document.querySelector('.chat-toggle-button');
    if (chatToggleButton) {
        chatToggleButton.addEventListener('click', function() {
            toggleChatInterface(true);
        });
    }

    // פונקציה להגדרת כפתור הצ'אט הצף
    setupChatButton();

    // הגדרת ממשק הצ'אט המוטמע
    setupChatInterface();
});

// פונקציה להגדרת כפתור הצ'אט הצף
function setupChatButton() {
    // יצירת הכפתור הצף אם לא קיים
    if (!document.querySelector('.floating-chat-button')) {
        const floatingButton = document.createElement('div');
        floatingButton.className = 'floating-chat-button';
        floatingButton.innerHTML = '<span class="chat-icon">💬</span>';
        document.body.appendChild(floatingButton);

        // טיפול בלחיצה על הכפתור
        floatingButton.addEventListener('click', function() {
            toggleChatInterface();
        });
    }
}

// פונקציה להגדרת ממשק הצ'אט
function setupChatInterface() {
    // בדיקה אם ממשק הצ'אט כבר קיים
    if (!document.querySelector('.chat-container')) {
        // יצירת מיכל הצ'אט
        const chatContainer = document.createElement('div');
        chatContainer.className = 'chat-container';
        chatContainer.innerHTML = `
            <div class="chat-header">
                <h3>בוט תמיכה</h3>
                <button class="close-chat">×</button>
            </div>
            <div class="chat-messages">
                <div class="bot-message">
                    <div class="message-content">שלום! איך אוכל לעזור לך בנושא בוטים לשירות לקוחות?</div>
                </div>
            </div>
            <div class="chat-input-container">
                <textarea class="chat-input" placeholder="הקלד שאלה כאן..."></textarea>
                <button class="send-message">שלח</button>
            </div>
        `;
        document.body.appendChild(chatContainer);

        // טיפול בסגירת הצ'אט
        const closeButton = chatContainer.querySelector('.close-chat');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                toggleChatInterface(false);
            });
        }

        // טיפול בשליחת הודעה
        const sendButton = chatContainer.querySelector('.send-message');
        const chatInput = chatContainer.querySelector('.chat-input');
        const chatMessages = chatContainer.querySelector('.chat-messages');

        if (sendButton && chatInput && chatMessages) {
            // שליחת הודעה בלחיצה על כפתור השליחה
            sendButton.addEventListener('click', function() {
                sendMessage(chatInput, chatMessages);
            });

            // שליחת הודעה בלחיצה על Enter
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(chatInput, chatMessages);
                }
            });
        }
    }
}

// פונקציה לטוגל הצגת/הסתרת ממשק הצ'אט
function toggleChatInterface(show = true) {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
        if (show) {
            chatContainer.classList.add('active');
        } else {
            chatContainer.classList.remove('active');
        }
    }
}

// פונקציה לשליחת הודעה לבוט
function sendMessage(inputElement, messagesContainer) {
    const message = inputElement.value.trim();
    if (!message) return;

    // הוספת הודעת המשתמש לצ'אט
    const userMessageElement = document.createElement('div');
    userMessageElement.className = 'user-message';
    userMessageElement.innerHTML = `<div class="message-content">${message}</div>`;
    messagesContainer.appendChild(userMessageElement);

    // ניקוי תיבת הקלט
    inputElement.value = '';

    // גלילה לתחתית הצ'אט
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // הצגת אינדיקטור טעינה
    const loadingElement = document.createElement('div');
    loadingElement.className = 'bot-message loading';
    loadingElement.innerHTML = '<div class="message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
    messagesContainer.appendChild(loadingElement);

    // שליחת הבקשה לשרת
    const userId = generateUserId();
    
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            userId: userId
        })
    })
    .then(response => response.json())
    .then(data => {
        // הסרת אינדיקטור הטעינה
        messagesContainer.removeChild(loadingElement);

        // הוספת תשובת הבוט
        const botMessageElement = document.createElement('div');
        botMessageElement.className = 'bot-message';
        botMessageElement.innerHTML = `<div class="message-content">${data.response}</div>`;
        messagesContainer.appendChild(botMessageElement);

        // גלילה לתחתית הצ'אט
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    })
    .catch(error => {
        // הסרת אינדיקטור הטעינה
        messagesContainer.removeChild(loadingElement);

        // הצגת הודעת שגיאה
        const errorElement = document.createElement('div');
        errorElement.className = 'bot-message error';
        errorElement.innerHTML = '<div class="message-content">מצטערים, אירעה שגיאה. אנא נסה שוב מאוחר יותר.</div>';
        messagesContainer.appendChild(errorElement);

        console.error('שגיאה בקריאה לשרת:', error);
    });
}

// יצירת מזהה משתמש
function generateUserId() {
    // שימוש במזהה קיים אם קיים
    let userId = localStorage.getItem('chatUserId');
    if (!userId) {
        // יצירת מזהה אקראי אם אין
        userId = 'user_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('chatUserId', userId);
    }
    return userId;
}

// פונקציה לתיקון תצוגת הקישורים החיצוניים
function fixExternalLinks() {
    // וידוא שקישורים חיצוניים מוצגים כראוי
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        // וידוא שהתוכן של הקישור אינו מציג את ה-href
        if (link.textContent.startsWith('http') && link.textContent === link.getAttribute('href')) {
            // מחפש טקסט חלופי מתוך האלמנט ההורה
            const parentText = link.parentElement.textContent.replace(link.textContent, '').trim();
            if (parentText) {
                const domain = new URL(link.href).hostname.replace('www.', '');
                link.textContent = domain;
            }
        }
        
        // וידוא שיש טקסט באלמנט
        if (!link.textContent.trim()) {
            const domain = new URL(link.href).hostname.replace('www.', '');
            link.textContent = domain;
        }
        
        // פתיחת קישורים חיצוניים בחלון חדש אם אין כבר מאפיין target
        if (!link.getAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
} 