/**
 * Antigravity - User Information Form Handler
 * Handles form validation, data storage, and navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Form field references
    const fields = {
        fullName: document.getElementById('fullName'),
        age: document.getElementById('age'),
        sport: document.getElementById('sport'),
        level: document.querySelectorAll('input[name="level"]')
    };

    // Validation rules
    const validators = {
        fullName: {
            validate: (value) => value.trim().length >= 2,
            message: 'Veuillez entrer votre nom complet (minimum 2 caractères)'
        },
        age: {
            validate: (value) => {
                const age = parseInt(value);
                return !isNaN(age) && age >= 10 && age <= 100;
            },
            message: 'Veuillez entrer un âge valide (entre 10 et 100 ans)'
        },
        sport: {
            validate: (value) => value !== '',
            message: 'Veuillez sélectionner un sport'
        },
        level: {
            validate: () => {
                return Array.from(fields.level).some(radio => radio.checked);
            },
            message: 'Veuillez sélectionner votre niveau sportif'
        }
    };

    /**
     * Show error message for a field
     * @param {string} fieldName - Name of the field
     * @param {string} message - Error message to display
     */
    function showError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const inputElement = fieldName === 'level' 
            ? null 
            : document.getElementById(fieldName);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('visible');
        }
        
        if (inputElement) {
            inputElement.classList.add('error');
        }
    }

    /**
     * Clear error message for a field
     * @param {string} fieldName - Name of the field
     */
    function clearError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const inputElement = fieldName === 'level' 
            ? null 
            : document.getElementById(fieldName);
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('visible');
        }
        
        if (inputElement) {
            inputElement.classList.remove('error');
        }
    }

    /**
     * Validate a single field
     * @param {string} fieldName - Name of the field to validate
     * @returns {boolean} - Whether the field is valid
     */
    function validateField(fieldName) {
        const validator = validators[fieldName];
        let value;
        
        if (fieldName === 'level') {
            value = getSelectedLevel();
        } else {
            value = fields[fieldName].value;
        }
        
        const isValid = validator.validate(value);
        
        if (!isValid) {
            showError(fieldName, validator.message);
        } else {
            clearError(fieldName);
        }
        
        return isValid;
    }

    /**
     * Validate all form fields
     * @returns {boolean} - Whether the entire form is valid
     */
    function validateForm() {
        let isValid = true;
        let firstInvalidField = null;
        
        // Validate each field
        Object.keys(validators).forEach(fieldName => {
            const fieldValid = validateField(fieldName);
            if (!fieldValid && !firstInvalidField) {
                firstInvalidField = fieldName;
            }
            isValid = isValid && fieldValid;
        });
        
        // Focus on first invalid field for accessibility
        if (firstInvalidField) {
            if (firstInvalidField === 'level') {
                fields.level[0].focus();
            } else {
                fields[firstInvalidField].focus();
            }
        }
        
        return isValid;
    }

    /**
     * Get the selected level value
     * @returns {string|null} - The selected level or null
     */
    function getSelectedLevel() {
        const selected = Array.from(fields.level).find(radio => radio.checked);
        return selected ? selected.value : null;
    }

    /**
     * Get the sport label from value
     * @param {string} value - Sport value
     * @returns {string} - Sport label
     */
    function getSportLabel(value) {
        const option = fields.sport.querySelector(`option[value="${value}"]`);
        return option ? option.textContent.replace(/^[^\s]+\s/, '') : value;
    }

    /**
     * Get the level label from value
     * @param {string} value - Level value
     * @returns {string} - Level label
     */
    function getLevelLabel(value) {
        const labels = {
            beginner: 'Débutant',
            intermediate: 'Intermédiaire',
            advanced: 'Avancé'
        };
        return labels[value] || value;
    }

    /**
     * Collect form data
     * @returns {Object} - User data object
     */
    function collectFormData() {
        return {
            fullName: fields.fullName.value.trim(),
            age: parseInt(fields.age.value),
            sport: fields.sport.value,
            sportLabel: getSportLabel(fields.sport.value),
            level: getSelectedLevel(),
            levelLabel: getLevelLabel(getSelectedLevel()),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Store user data in sessionStorage
     * @param {Object} data - User data to store
     */
    function storeUserData(data) {
        try {
            sessionStorage.setItem('antigravity_user', JSON.stringify(data));
            console.log('✅ Données utilisateur stockées:', data);
            return true;
        } catch (error) {
            console.error('❌ Erreur de stockage:', error);
            return false;
        }
    }

    /**
     * Navigate to QCM page
     */
    function navigateToQCM() {
        // Add loading state to button
        submitBtn.classList.add('loading');
        submitBtn.querySelector('.btn-text').textContent = 'Chargement...';
        
        // Simulate brief loading then navigate
        setTimeout(() => {
            // Navigate to QCM page
            window.location.href = 'qcm.html';
        }, 500);
    }

    /**
     * Handle form submission
     * @param {Event} event - Submit event
     */
    function handleSubmit(event) {
        event.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            // Add shake animation to form for visual feedback
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);
            return;
        }
        
        // Collect and store data
        const userData = collectFormData();
        const stored = storeUserData(userData);
        
        if (stored) {
            // Navigate to QCM
            navigateToQCM();
        } else {
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    }

    /**
     * Add real-time validation on blur
     */
    function setupRealtimeValidation() {
        // Text and number inputs
        ['fullName', 'age', 'sport'].forEach(fieldName => {
            const field = fields[fieldName];
            
            field.addEventListener('blur', () => {
                if (field.value) {
                    validateField(fieldName);
                }
            });
            
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(fieldName);
                }
            });
        });
        
        // Radio buttons
        fields.level.forEach(radio => {
            radio.addEventListener('change', () => {
                clearError('level');
            });
        });
    }

    /**
     * Add keyboard navigation for level cards
     */
    function setupKeyboardNavigation() {
        const levelCards = Array.from(fields.level);
        
        levelCards.forEach((radio, index) => {
            radio.addEventListener('keydown', (e) => {
                let targetIndex;
                
                switch (e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        targetIndex = (index + 1) % levelCards.length;
                        levelCards[targetIndex].focus();
                        levelCards[targetIndex].checked = true;
                        break;
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        targetIndex = (index - 1 + levelCards.length) % levelCards.length;
                        levelCards[targetIndex].focus();
                        levelCards[targetIndex].checked = true;
                        break;
                }
            });
        });
    }

    /**
     * Check for existing user data and pre-fill form
     */
    function checkExistingData() {
        try {
            const existingData = sessionStorage.getItem('antigravity_user');
            if (existingData) {
                const data = JSON.parse(existingData);
                
                // Pre-fill form fields
                fields.fullName.value = data.fullName || '';
                fields.age.value = data.age || '';
                fields.sport.value = data.sport || '';
                
                if (data.level) {
                    const radio = document.getElementById(data.level);
                    if (radio) radio.checked = true;
                }
                
                console.log('📋 Données existantes restaurées');
            }
        } catch (error) {
            console.log('Aucune donnée existante trouvée');
        }
    }

    // Initialize
    function init() {
        setupRealtimeValidation();
        setupKeyboardNavigation();
        checkExistingData();
        
        // Form submission
        form.addEventListener('submit', handleSubmit);
        
        console.log('🚀 Antigravity - Formulaire initialisé');
    }

    init();
});

// Add shake animation styles dynamically
const shakeStyles = document.createElement('style');
shakeStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    form.shake {
        animation: shake 0.5s ease-in-out;
    }
    
    .submit-btn.loading {
        pointer-events: none;
        opacity: 0.8;
    }
`;
document.head.appendChild(shakeStyles);
