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

    // הפעלת בוט הצ'אט הצף
    const floatingChatIcon = document.getElementById('floating-chat-icon');
    const floatingChatContainer = document.getElementById('floating-chat-container');
    const minimizeChatButton = document.getElementById('minimize-chat');
    const chatInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    // יצירת מזהה משתמש ייחודי (UUID)
    function generateUserId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // שמירת מזהה המשתמש ב-localStorage או יצירת חדש אם לא קיים
    let userId = localStorage.getItem('chatUserId');
    if (!userId) {
        userId = generateUserId();
        localStorage.setItem('chatUserId', userId);
    }

    // פתיחה וסגירה של ממשק הצ'אט
    floatingChatIcon.addEventListener('click', () => {
        floatingChatContainer.classList.add('active');
        chatInput.focus();
    });

    minimizeChatButton.addEventListener('click', () => {
        floatingChatContainer.classList.remove('active');
    });

    // הוספת הודעה לממשק הצ'אט
    function addChatMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (isUser) {
            // תוכן הודעת משתמש נשאר כטקסט רגיל
            const messageParagraph = document.createElement('p');
            messageParagraph.textContent = text;
            messageContent.appendChild(messageParagraph);
        } else {
            // עיבוד תוכן הודעת הבוט
            const formattedContent = formatBotMessage(text);
            messageContent.innerHTML = formattedContent;
        }
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        const now = new Date();
        messageTime.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        
        chatMessages.appendChild(messageDiv);
        
        // גלילה לתחתית הצ'אט
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // פונקציה לעיצוב הודעות בוט
    function formatBotMessage(text) {
        if (!text) return '';
        
        // הסרת תבניות מקור לא רצויות (כמו 【X:Y†source】)
        let cleanedText = text.replace(/【\d+:\d+†source】/g, '').trim();

        // בדיקה אם יש רשימות
        let hasUnorderedList = cleanedText.match(/^(\*|\-)\s.+$/gm);
        let hasOrderedList = cleanedText.match(/^\d+\.\s.+$/gm);
        
        // החלפת סימונים מיוחדים ועיצוב התוכן
        let formattedText = cleanedText
            // פיסקאות
            .replace(/\n\s*\n/g, '</p><p>')
            
            // עטיפת כל התוכן בתגית p
            .replace(/^(.+)$/gm, function(match) {
                // אם השורה כבר מתחילה עם תגית HTML, השאר אותה כמו שהיא
                if (match.startsWith('<') || match.trim() === '') {
                    return match;
                }
                return match;
            })
            
            // סימון כותרות (צריך להיות לפני מעבדי שורה)
            .replace(/^#\s+(.+)$/gm, '<h4>$1</h4>')
            .replace(/^##\s+(.+)$/gm, '<h5>$1</h5>')
            .replace(/^###\s+(.+)$/gm, '<h6>$1</h6>')
            
            // סימון ציטוטים (blockquote)
            .replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')
            
            // סימון רשימות
            .replace(/^(\*|\-)\s+(.+)$/gm, '<li>$2</li>')
            .replace(/^(\d+)\.\s+(.+)$/gm, '<li>$2</li>')
            
            // סימון טקסט מודגש ונטוי
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/_(.+?)_/g, '<em>$1</em>')
            
            // קישורים (בפורמט מארקדאון)
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            
            // קוד ותחביר מיוחד
            .replace(/`(.+?)`/g, '<code>$1</code>')
            
            // החלפת שורות חדשות בתגית <br> (לאחר הטיפול בכותרות ורשימות)
            .replace(/\n/g, '<br>');
        
        // עטיפת התוכן בתגית p (אם לא כבר נעטף)
        if (!formattedText.startsWith('<p>')) {
            formattedText = '<p>' + formattedText + '</p>';
        }
        
        // תיקון מקומות שבהם יש שימוש כפול בתגיות
        formattedText = formattedText
            .replace(/<p><h([4-6])>/g, '<h$1>')
            .replace(/<\/h([4-6])><\/p>/g, '</h$1>')
            .replace(/<p><blockquote>/g, '<blockquote>')
            .replace(/<\/blockquote><\/p>/g, '</blockquote>')
            .replace(/<\/p><p><\/p><p>/g, '</p><p>')
            .replace(/<p><\/p>/g, '');
        
        // עטיפת פריטי רשימה ב-ul או ol
        if (hasUnorderedList) {
            formattedText = wrapListItems(formattedText, 'ul');
        }
        
        if (hasOrderedList) {
            formattedText = wrapListItems(formattedText, 'ol');
        }
        
        return formattedText;
    }
    
    // פונקציה לעטיפת פריטי רשימה בתגיות ul או ol
    function wrapListItems(html, listType) {
        // כיוון שכבר הכנסנו את התוכן לתגיות p, צריך לחפש את פריטי הרשימה בתוכן
        let parts = html.split(/<\/?p>/g).filter(p => p.trim() !== '');
        let result = [];
        
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            
            // אם החלק מכיל פריטי רשימה
            if (part.includes('<li>')) {
                // הוצאת פריטי הרשימה מהחלק
                let liItems = part.split('<br>').filter(line => line.includes('<li>'));
                
                // בניית הרשימה
                let listHtml = `<${listType}>` + liItems.join('') + `</${listType}>`;
                
                // הוספת הרשימה לתוצאה
                result.push(listHtml);
                
                // הוספת שאר הטקסט שלא היה חלק מהרשימה
                let nonListText = part.split('<br>').filter(line => !line.includes('<li>')).join('<br>');
                if (nonListText.trim() !== '') {
                    result.push('<p>' + nonListText + '</p>');
                }
            } else {
                // הוספת חלק שאינו רשימה
                result.push('<p>' + part + '</p>');
            }
        }
        
        return result.join('').replace(/<p><\/p>/g, '');
    }

    // הצגת סמן 'מקליד'
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        // הוספת שלוש נקודות לאנימציה
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingDiv.appendChild(dot);
        }
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // הסרת סמן 'מקליד'
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // שליחת הודעה לשרת וקבלת תשובה
    async function sendChatMessage(message) {
        try {
            showTypingIndicator();
            
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    userId: userId
                })
            });
            
            if (!response.ok) {
                throw new Error('בעיה בתקשורת עם השרת');
            }
            
            const data = await response.json();
            removeTypingIndicator();
            
            if (data.response) {
                addChatMessage(data.response, false);
            } else {
                addChatMessage('מצטער, לא הצלחתי לקבל תשובה. אנא נסה שוב.', false);
            }
        } catch (error) {
            console.error('שגיאה בשליחת ההודעה:', error);
            removeTypingIndicator();
            addChatMessage('אירעה שגיאה בתקשורת עם השרת. אנא נסה שוב מאוחר יותר.', false);
        }
    }

    // טיפול בשליחת הודעה
    function handleSendChatMessage() {
        const message = chatInput.value.trim();
        
        if (message) {
            addChatMessage(message, true);
            chatInput.value = '';
            sendChatMessage(message);
        }
    }

    // האזנה לאירועים
    sendButton.addEventListener('click', handleSendChatMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendChatMessage();
        }
    });

    // טיפול במקרה של לחיצה במקום אחר בעמוד
    document.addEventListener('click', (e) => {
        // סגירת הצ'אט אם לחצו מחוץ לאזור הצ'אט ולא על הכפתור
        if (floatingChatContainer.classList.contains('active') && 
            !floatingChatContainer.contains(e.target) && 
            e.target !== floatingChatIcon && 
            !floatingChatIcon.contains(e.target)) {
            floatingChatContainer.classList.remove('active');
        }
    });

    // מנע התפשטות האירוע כשלוחצים בתוך הצ'אט
    floatingChatContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Dark Mode Toggle
    function initDarkMode() {
        const darkModeToggle = document.createElement('button');
        darkModeToggle.className = 'dark-mode-toggle';
        darkModeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        darkModeToggle.setAttribute('aria-label', 'החלף מצב תצוגה');
        darkModeToggle.setAttribute('title', 'החלף מצב תצוגה');
        document.body.appendChild(darkModeToggle);

        // Check for saved preference
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            updateDarkModeIcon(true);
        }

        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            updateDarkModeIcon(isDark);
        });
    }

    function updateDarkModeIcon(isDark) {
        const darkModeToggle = document.querySelector('.dark-mode-toggle');
        if (isDark) {
            darkModeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        } else {
            darkModeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        }
    }

    // Intersection Observer for fade-in animations
    function initScrollAnimations() {
        const fadeElems = document.querySelectorAll('.step-section, .hero-section h1, .hero-subtitle, .hero-features, .hero-buttons');
        
        fadeElems.forEach(elem => {
            elem.classList.add('fade-in-section');
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        });

        fadeElems.forEach(elem => {
            observer.observe(elem);
        });
    }

    // Smooth anchor scrolling
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
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
    }

    // Active menu highlighting
    function initActiveMenu() {
        const sections = document.querySelectorAll('.step-section');
        const navItems = document.querySelectorAll('.anchor-nav a');
        
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${current}`) {
                    item.classList.add('active');
                }
            });
        });
    }

    // Mobile menu toggle
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                mainNav.classList.toggle('active');
            });
        
            // Close menu when clicking on a link
            document.querySelectorAll('.main-nav a').forEach(link => {
                link.addEventListener('click', () => {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                });
            });
        }
    }

    // Back to top button
    function initBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
        backToTop.setAttribute('aria-label', 'חזרה לראש הדף');
        backToTop.setAttribute('title', 'חזרה לראש הדף');
        document.body.appendChild(backToTop);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // הפעלת האקורדיון
    function initAccordion() {
        const accordionItems = document.querySelectorAll('.accordion-item');
        
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            
            header.addEventListener('click', () => {
                // בדיקה אם זה האייטם שכבר פתוח
                const isOpen = item.classList.contains('active');
                
                // סגירת כל האייטמים
                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // פתיחת האייטם הנוכחי (אם הוא היה סגור)
                if (!isOpen) {
                    item.classList.add('active');
                }
            });
        });
    }

    // טיפול בכפתור הצ'אט
    function initChatButton() {
        const chatButton = document.querySelector('.chat-bubble');
        
        if (chatButton) {
            chatButton.addEventListener('click', () => {
                // פה אפשר לשלב פתיחת חלון צ'אט או הפנייה למספר וואטסאפ
                // לדוגמה: window.open('https://wa.me/972XXXXXXXXX', '_blank');
                alert('צור קשר עם המומחים שלנו בוואטסאפ לקבלת סיוע נוסף!');
            });
        }
    }

    initDarkMode();
    initScrollAnimations();
    initSmoothScroll();
    initActiveMenu();
    initMobileMenu();
    initBackToTop();
    initAccordion();
    initChatButton();
}); 