class Step {
    constructor(options) {
        this.id = options.id;
        this.number = options.number;
        this.title = options.title;
        this.description = options.description;
        this.imageSrc = options.imageSrc || '';
        this.tip = options.tip || '';
        this.parent = options.parent || document.querySelector('.main-content .container');
    }

    render() {
        // Create step section element
        const stepSection = document.createElement('section');
        stepSection.id = this.id;
        stepSection.className = 'step-section';

        // Create step content
        const stepContent = document.createElement('div');
        stepContent.className = 'step-content';

        // Create title
        const title = document.createElement('h2');
        title.textContent = `שלב ${this.number}: ${this.title}`;

        // Create description
        const description = document.createElement('p');
        description.textContent = this.description;

        // Create image placeholder
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-placeholder';

        if (this.imageSrc) {
            const image = document.createElement('img');
            image.src = this.imageSrc;
            image.alt = `תמונה עבור ${this.title}`;
            imageContainer.appendChild(image);
        } else {
            const imagePlaceholder = document.createElement('span');
            imagePlaceholder.textContent = 'תמונה תבוא כאן';
            imageContainer.appendChild(imagePlaceholder);
        }

        // Create tip if provided
        let tipElement = null;
        if (this.tip) {
            tipElement = document.createElement('div');
            tipElement.className = 'tip';
            const tipText = document.createElement('p');
            tipText.innerHTML = `💡 טיפ חשוב: ${this.tip}`;
            tipElement.appendChild(tipText);
        }

        // Append all elements to the step content
        stepContent.appendChild(title);
        stepContent.appendChild(description);
        stepContent.appendChild(imageContainer);
        if (tipElement) {
            stepContent.appendChild(tipElement);
        }

        // Append step content to step section
        stepSection.appendChild(stepContent);

        // Append to parent element
        this.parent.appendChild(stepSection);

        return stepSection;
    }

    update(newData) {
        // Find the existing step section
        const stepSection = document.getElementById(this.id);
        if (!stepSection) return;

        // Update the object properties
        if (newData.title) this.title = newData.title;
        if (newData.description) this.description = newData.description;
        if (newData.imageSrc) this.imageSrc = newData.imageSrc;
        if (newData.tip) this.tip = newData.tip;

        // Update the DOM
        const title = stepSection.querySelector('h2');
        if (title) title.textContent = `שלב ${this.number}: ${this.title}`;

        const description = stepSection.querySelector('p');
        if (description) description.textContent = this.description;

        const imageContainer = stepSection.querySelector('.image-placeholder');
        if (imageContainer && newData.imageSrc) {
            imageContainer.innerHTML = '';
            const image = document.createElement('img');
            image.src = this.imageSrc;
            image.alt = `תמונה עבור ${this.title}`;
            imageContainer.appendChild(image);
        }

        const tip = stepSection.querySelector('.tip p');
        if (tip && newData.tip) {
            tip.innerHTML = `💡 טיפ חשוב: ${this.tip}`;
        } else if (newData.tip && !tip) {
            const tipElement = document.createElement('div');
            tipElement.className = 'tip';
            const tipText = document.createElement('p');
            tipText.innerHTML = `💡 טיפ חשוב: ${this.tip}`;
            tipElement.appendChild(tipText);
            stepSection.querySelector('.step-content').appendChild(tipElement);
        }
    }

    remove() {
        const stepSection = document.getElementById(this.id);
        if (stepSection) {
            stepSection.remove();
        }
    }
} 