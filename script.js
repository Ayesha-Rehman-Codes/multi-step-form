document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    const totalSteps = 3;

    const form = document.getElementById('multiStepForm');
    const steps = document.querySelectorAll('.form-step');
    const stepCircles = document.querySelectorAll('.step-circle');
    const progressBar = document.getElementById('progressBar');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const summaryCard = document.getElementById('summaryCard');
    const successMessage = document.getElementById('successMessage');

    const validators = {
        fullName: value => value.trim().length >= 3 ? '' : 'Name must be at least 3 characters long.',
        email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address.',
        username: value => value.trim().length >= 4 ? '' : 'Username must be at least 4 characters long.',
        password: value => value.length >= 6 ? '' : 'Password must be at least 6 characters long.'
    };

    function loadSavedData() {
        const savedData = JSON.parse(localStorage.getItem('formAutosave')) || {};
        Object.keys(savedData).forEach(key => {
            const input = form.elements[key];
            if (input) input.value = savedData[key];
        });
    }

    form.addEventListener('input', (e) => {
        if (e.target.name) {
            const savedData = JSON.parse(localStorage.getItem('formAutosave')) || {};
            savedData[e.target.name] = e.target.value;
            localStorage.setItem('formAutosave', JSON.stringify(savedData));
            
            // Real-time error removal when user fixes content
            validateField(e.target);
        }
    });

    // Individual Field Validation Logic
    function validateField(input) {
        const fieldName = input.name;
        if (!validators[fieldName]) return true;

        const errorMsg = validators[fieldName](input.value);
        const errorSpan = document.getElementById(`error-${fieldName}`);
        
        if (errorMsg) {
            errorSpan.textContent = errorMsg;
            input.style.borderColor = '#ef4444';
            return false;
        } else {
            errorSpan.textContent = '';
            input.style.borderColor = '#e5e7eb';
            return true;
        }
    }

    function validateStep(stepNum) {
        const stepContainer = document.querySelector(`.form-step[data-step="${stepNum}"]`);
        const inputs = stepContainer.querySelectorAll('input');
        let isStepValid = true;

        inputs.forEach(input => {
            const isValid = validateField(input);
            if (!isValid) isStepValid = false;
        });

        return isStepValid;
    }

    function updateUI() {
        steps.forEach(step => {
            step.classList.remove('active-step');
            if (parseInt(step.dataset.step) === currentStep) {
                setTimeout(() => step.classList.add('active-step'), 50);
            }
        });

        stepCircles.forEach((circle, idx) => {
            if (idx < currentStep) {
                circle.classList.add('active');
            } else {
                circle.classList.remove('active');
            }
        });

        const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progressPercent}%`;

        if (currentStep === 1) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }

        if (currentStep === totalSteps) {
            nextBtn.textContent = 'Submit';
        } else {
            nextBtn.textContent = 'Next';
        }

        if (currentStep === 3) {
            generateSummary();
        }
    }

    function generateSummary() {
        const savedData = JSON.parse(localStorage.getItem('formAutosave')) || {};
        summaryCard.innerHTML = `
            <div class="summary-item"><span class="summary-label">Full Name:</span> <span class="summary-value">${savedData.fullName || 'N/A'}</span></div>
            <div class="summary-item"><span class="summary-label">Email:</span> <span class="summary-value">${savedData.email || 'N/A'}</span></div>
            <div class="summary-item"><span class="summary-label">Username:</span> <span class="summary-value">${savedData.username || 'N/A'}</span></div>
        `;
    }

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            if (validateStep(currentStep)) {
                currentStep++;
                updateUI();
            }
        } else {

            handleFormSubmit();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
        }
    });

    function handleFormSubmit() {

        summaryCard.classList.add('hidden');
        nextBtn.classList.add('hidden');
        prevBtn.classList.add('hidden');
        successMessage.classList.remove('hidden');

        localStorage.removeItem('formAutosave');
    }

    loadSavedData();
    updateUI();
});