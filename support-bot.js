// בוט תמיכה המשתמש באסיסטנט של OpenAI
require('dotenv').config(); // עבור משתני סביבה

const { OpenAI } = require('openai');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// יצירת לקוח OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // יש להגדיר בקובץ .env או בהגדרות הסביבה ב-Vercel
});

// מזהה האסיסטנט שלך ב-OpenAI
const ASSISTANT_ID = 'asst_dZRPD5ivNTccvxIKnyhwuCrK';

// שמירת שיחות של משתמשים
const userThreads = {};

app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'נדרשת הודעה' });
    }

    // יצירת שרשור חדש אם לא קיים עבור המשתמש
    if (!userThreads[userId]) {
      const thread = await openai.beta.threads.create();
      userThreads[userId] = thread.id;
    }

    // הוספת הודעת משתמש לשרשור
    await openai.beta.threads.messages.create(userThreads[userId], {
      role: 'user',
      content: message,
    });

    // הפעלת האסיסטנט על השרשור
    const run = await openai.beta.threads.runs.create(userThreads[userId], {
      assistant_id: ASSISTANT_ID,
    });

    // המתנה לסיום עיבוד האסיסטנט
    let runStatus = await openai.beta.threads.runs.retrieve(
      userThreads[userId],
      run.id
    );

    // המתנה לסיום העיבוד
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(
        userThreads[userId],
        run.id
      );
      
      if (['failed', 'cancelled', 'expired'].includes(runStatus.status)) {
        return res.status(500).json({ 
          error: `העיבוד נכשל עם סטטוס: ${runStatus.status}` 
        });
      }
    }

    // קבלת ההודעות מהשרשור
    const messages = await openai.beta.threads.messages.list(
      userThreads[userId]
    );

    // החזרת התשובה האחרונה מהאסיסטנט
    const lastMessage = messages.data
      .filter(msg => msg.role === 'assistant')
      .shift();

    if (lastMessage) {
      return res.json({ 
        response: lastMessage.content[0].text.value,
        threadId: userThreads[userId]
      });
    } else {
      return res.status(404).json({ error: 'לא נמצאה תשובה מהאסיסטנט' });
    }
  } catch (error) {
    console.error('שגיאה בעיבוד צ׳אט:', error);
    res.status(500).json({ error: error.message || 'שגיאת שרת פנימית' });
  }
});

// נקודת קצה לניקוי שיחות משתמש
app.post('/api/clear-chat', (req, res) => {
  const { userId } = req.body;
  if (userThreads[userId]) {
    delete userThreads[userId];
    res.json({ success: true, message: 'השיחה נוקתה בהצלחה' });
  } else {
    res.status(404).json({ error: 'לא נמצאה שיחה למשתמש זה' });
  }
});

// נתיב ליצירת שיחה חדשה
app.post('/api/openai/create-thread', async (req, res) => {
  try {
    const thread = await openai.beta.threads.create();
    res.json({ threadId: thread.id });
  } catch (error) {
    console.error('שגיאה ביצירת שיחה:', error);
    res.status(500).json({ error: 'שגיאה ביצירת שיחה חדשה' });
  }
});

// נתיב להוספת הודעה לשיחה
app.post('/api/openai/add-message', async (req, res) => {
  try {
    const { threadId, message } = req.body;
    
    if (!threadId || !message) {
      return res.status(400).json({ error: 'חסרים פרטים נדרשים' });
    }
    
    const messageObj = await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message
    });
    
    res.json({ messageId: messageObj.id });
  } catch (error) {
    console.error('שגיאה בהוספת הודעה:', error);
    res.status(500).json({ error: 'שגיאה בהוספת הודעה לשיחה' });
  }
});

// נתיב להפעלת האסיסטנט על שיחה
app.post('/api/openai/run-assistant', async (req, res) => {
  try {
    const { threadId, assistantId } = req.body;
    
    if (!threadId || !assistantId) {
      return res.status(400).json({ error: 'חסרים פרטים נדרשים' });
    }
    
    // הפעלת האסיסטנט על השיחה
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId
    });
    
    // המתנה לסיום הריצה
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    
    // בדיקת סטטוס הריצה עד לסיום
    while (runStatus.status !== 'completed' && runStatus.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // המתנה לשנייה
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }
    
    if (runStatus.status === 'failed') {
      return res.status(500).json({ error: 'הריצה נכשלה', details: runStatus });
    }
    
    // קבלת ההודעות מהאסיסטנט
    const messages = await openai.beta.threads.messages.list(threadId);
    
    // החזרת ההודעות למשתמש
    res.json({ 
      status: 'completed',
      messages: messages.data.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content[0].text || {}
      }))
    });
  } catch (error) {
    console.error('שגיאה בהפעלת האסיסטנט:', error);
    res.status(500).json({ error: 'שגיאה בהפעלת האסיסטנט' });
  }
});

// נקודת כניסה ראשית - מחזירה את הדף הראשי
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// הגדרת הפורט בהתאם לסביבה
const PORT = process.env.PORT || 3000;

// אם אנחנו לא ב-Vercel, הפעל את השרת
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`השרת פועל בפורט ${PORT}`);
  });
}

// ייצוא האפליקציה עבור Vercel
module.exports = app; 