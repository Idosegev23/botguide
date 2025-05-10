// קבועים ומשתנים גלובליים
const ASSISTANT_ID = 'asst_dZRPD5ivNTccvxIKnyhwuCrK'; // מזהה האסיסטנט של OpenAI
let threadId = null; // מזהה השיחה הנוכחית
let isWaitingForResponse = false; // מצב המתנה לתשובה מהשרת

// פונקציה ליצירת טאיימסטמפ נוכחי
function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// פונקציה להוספת הודעה לממשק
function addMessage(text, isUser = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = text;
    messageContent.appendChild(messageParagraph);
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = getCurrentTime();
    
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);
    
    chatMessages.appendChild(messageDiv);
    
    // גלילה לתחתית הצ'אט
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// פונקציה להצגת סמן 'מקליד'
function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
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

// פונקציה להסרת סמן 'מקליד'
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// יצירת שיחה חדשה מול האסיסטנט
async function createThread() {
    try {
        const response = await fetch('/api/openai/create-thread', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('שגיאה ביצירת שיחה חדשה');
        }
        
        const data = await response.json();
        threadId = data.threadId;
        console.log('נוצרה שיחה חדשה:', threadId);
    } catch (error) {
        console.error('שגיאה ביצירת שיחה:', error);
        addMessage('התרחשה שגיאה ביצירת השיחה. אנא נסה שוב מאוחר יותר.');
    }
}

// שליחת הודעה לאסיסטנט וקבלת תשובה
async function sendMessageToAssistant(userMessage) {
    if (!threadId) {
        await createThread();
    }
    
    try {
        // הוספת הודעת המשתמש לשיחה
        const addMessageResponse = await fetch('/api/openai/add-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                threadId: threadId,
                message: userMessage
            })
        });
        
        if (!addMessageResponse.ok) {
            throw new Error('שגיאה בהוספת הודעה לשיחה');
        }
        
        // הפעלת האסיסטנט על השיחה
        showTypingIndicator();
        const runResponse = await fetch('/api/openai/run-assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                threadId: threadId,
                assistantId: ASSISTANT_ID
            })
        });
        
        if (!runResponse.ok) {
            throw new Error('שגיאה בהפעלת האסיסטנט');
        }
        
        const runData = await runResponse.json();
        const { messages } = runData;
        
        // הצגת התשובה האחרונה מהאסיסטנט
        if (messages && messages.length > 0) {
            const assistantMessage = messages[messages.length - 1].content.text;
            removeTypingIndicator();
            addMessage(assistantMessage, false);
        } else {
            removeTypingIndicator();
            addMessage('לא התקבלה תשובה מהאסיסטנט. אנא נסה שוב.', false);
        }
    } catch (error) {
        console.error('שגיאה בשליחת הודעה:', error);
        removeTypingIndicator();
        addMessage('התרחשה שגיאה בתקשורת עם האסיסטנט. אנא נסה שוב מאוחר יותר.', false);
    }
}

// פונקציה לטיפול בשליחת הודעה מהמשתמש
function handleSendMessage() {
    if (isWaitingForResponse) return;
    
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        
        isWaitingForResponse = true;
        sendMessageToAssistant(message)
            .finally(() => {
                isWaitingForResponse = false;
            });
    }
}

// פונקציה לניקוי השיחה
function clearChat() {
    // שמירת ההודעה הראשונה של הבוט
    const firstBotMessage = document.querySelector('.message.bot-message');
    
    // ניקוי כל ההודעות
    document.getElementById('chat-messages').innerHTML = '';
    
    // החזרת ההודעה הראשונה של הבוט
    if (firstBotMessage) {
        document.getElementById('chat-messages').appendChild(firstBotMessage.cloneNode(true));
    }
    
    // יצירת שיחה חדשה בשרת
    threadId = null;
    createThread();
}

// פונקציה להפעלה וכיבוי תיבת העזרה
function toggleHelpBox() {
    const quickHelp = document.getElementById('quick-help');
    quickHelp.classList.toggle('active');
}

// פונקציה לסגירת תיבת העזרה
function closeHelpBox() {
    const quickHelp = document.getElementById('quick-help');
    quickHelp.classList.remove('active');
}

// פונקציה לטיפול בלחיצה על שאלה מוכנה
function handleQuickQuestion(event) {
    if (event.target.classList.contains('help-question')) {
        event.preventDefault();
        
        const question = event.target.textContent;
        const userInput = document.getElementById('user-input');
        
        userInput.value = question;
        userInput.focus();
        
        // סגירת תיבת העזרה
        closeHelpBox();
    }
}

// אתחול הדף
document.addEventListener('DOMContentLoaded', () => {
    // יצירת שיחה חדשה
    createThread();
    
    // מאזינים לאירועים
    document.getElementById('send-button').addEventListener('click', handleSendMessage);
    
    document.getElementById('user-input').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });
    
    document.getElementById('clear-chat').addEventListener('click', clearChat);
    
    // מאזינים לאירועים של העזרה
    document.getElementById('help-icon').addEventListener('click', toggleHelpBox);
    document.getElementById('close-help').addEventListener('click', closeHelpBox);
    
    // מאזין ללחיצות על שאלות מהירות
    document.querySelector('.quick-help-content').addEventListener('click', handleQuickQuestion);
}); 