// דוגמה לשימוש בקומפוננטת השלב

// יבוא הקומפוננטה (אם משתמשים בקבצי ES modules)
// import { Step } from './Step.js';

document.addEventListener('DOMContentLoaded', function() {
    // מחיקת השלבים הקיימים שהוגדרו ב-HTML (אופציונלי)
    // document.querySelectorAll('.step-section').forEach(step => step.remove());
    
    // יצירת מערך השלבים
    const stepsData = [
        {
            id: 'step1',
            number: 1,
            title: 'פתיחת חשבון OpenAI',
            description: 'בשלב זה נלמד כיצד לפתוח חשבון ב-OpenAI ולקבל מפתח API שישמש אותנו בהמשך הדרך.',
            imageSrc: '', // ניתן להוסיף נתיב לתמונה אם קיימת
            tip: 'בדקו שאתם משתמשים במייל מאומת בעת ההרשמה.'
        },
        {
            id: 'step2',
            number: 2,
            title: 'הרשמה ל-Make',
            description: 'בשלב זה נלמד כיצד להירשם לפלטפורמת Make שתשמש אותנו לחיבור בין השירותים השונים.',
            tip: 'השתמשו בגרסה החינמית למטרות בדיקה.'
        },
        // ניתן להוסיף שלבים נוספים לפי הצורך
    ];
    
    // יצירת והצגת השלבים בדף
    const steps = stepsData.map(stepData => {
        const step = new Step(stepData);
        return step.render();
    });
    
    // דוגמה לעדכון שלב לאחר יצירתו
    setTimeout(() => {
        if (steps.length > 0) {
            const firstStep = new Step(stepsData[0]);
            firstStep.update({
                title: 'פתיחת חשבון OpenAI - עודכן!',
                description: 'תיאור חדש לשלב הראשון שהוספנו באמצעות JavaScript.',
                tip: 'טיפ חדש ומעודכן!'
            });
        }
    }, 3000); // עדכון לאחר 3 שניות לצורך הדגמה
});

/* 
דוגמה לשימוש בקומפוננטה עם מודולים:

// יצירת שלב חדש
const newStep = new Step({
    id: 'step8',
    number: 8,
    title: 'שלב נוסף',
    description: 'תיאור של השלב הנוסף שיצרנו.',
    tip: 'טיפ לשלב הנוסף.'
});

// הצגת השלב בדף
newStep.render();

// עדכון השלב
newStep.update({
    title: 'כותרת מעודכנת',
    description: 'תיאור מעודכן'
});

// הסרת השלב
// newStep.remove();
*/ 