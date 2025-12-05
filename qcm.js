/**
 * QCM Page - Question Handler
 * Handles form validation, progress tracking, and data storage
 * Prepares data for backend API in MessageRequest format
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('qcmForm');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const questionItems = document.querySelectorAll('.question-item');
    const totalQuestions = questionItems.length;

    // Questions text for backend
    const questionsText = {
        q1: "Combien de fois faites-vous du sport par semaine ?",
        q2: "Quelle est la durée moyenne de vos séances ?",
        q3: "Avez-vous des douleurs pendant l'effort ?",
        q4: "Quel est votre niveau sportif ?",
        q5: "Avez-vous des douleurs au bas du dos ?",
        q6: "Votre posture est-elle souvent penchée ?",
        q7: "Avez-vous du mal à rester dos droit ?",
        q8: "Combien d'heures restez-vous assis par jour ?",
        q9: "Avez-vous des tensions épaules/cou ?",
        q10: "Faites-vous des étirements régulièrement ?"
    };

    /**
     * Update progress bar based on answered questions
     */
    function updateProgress() {
        let answered = 0;

        questionItems.forEach(item => {
            const questionName = item.dataset.question;
            const inputs = item.querySelectorAll(`input[name="${questionName}"]`);
            const isAnswered = Array.from(inputs).some(input => input.checked);

            if (isAnswered) {
                answered++;
                item.classList.add('answered');
            } else {
                item.classList.remove('answered');
            }
        });

        const percentage = (answered / totalQuestions) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${answered} / ${totalQuestions} questions`;
    }

    /**
     * Validate that all questions are answered
     * @returns {boolean} Whether all questions are answered
     */
    function validateForm() {
        let allAnswered = true;
        let firstUnanswered = null;

        questionItems.forEach(item => {
            const questionName = item.dataset.question;
            const inputs = item.querySelectorAll(`input[name="${questionName}"]`);
            const isAnswered = Array.from(inputs).some(input => input.checked);

            if (!isAnswered) {
                allAnswered = false;
                item.style.borderColor = '#e74c3c';
                item.style.animation = 'shake 0.5s ease';

                if (!firstUnanswered) {
                    firstUnanswered = item;
                }

                setTimeout(() => {
                    item.style.animation = '';
                }, 500);
            } else {
                item.style.borderColor = '';
            }
        });

        if (firstUnanswered) {
            firstUnanswered.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        console.log(allAnswered);
        return allAnswered;
    }

    /**
     * Collect userContext: list of {question, response}
     * @returns {Array} Array of UserContext objects
     */
    function collectUserContext() {
        const userContext = [];

        questionItems.forEach(item => {
            const questionName = item.dataset.question;
            const selectedInput = item.querySelector(`input[name="${questionName}"]:checked`);

            if (selectedInput) {
                userContext.push({
                    question: questionsText[questionName] || questionName,
                    response: selectedInput.nextElementSibling.textContent.trim()
                });
            }
        });

        return userContext;
    }

    /**
     * Get user data from sessionStorage (from index.html form)
     * @returns {Object} User data
     */
    function getUserData() {
        try {
            // Get user data saved from index.html (key: antigravity_user)
            const userData = sessionStorage.getItem('antigravity_user');
            if (userData) {
                return JSON.parse(userData);
            }
        } catch (e) {
            console.error('Error getting user data:', e);
        }
        return {
            fullName: '',
            age: '',
            sport: '',
            level: ''
        };
    }

    /**
     * Build MessageRequest object for backend API
     * @returns {Object} MessageRequest object
     */
    function buildMessageRequest() {
        const userData = getUserData();
        const userContext = collectUserContext();

        // Map level to fitnessLevel
        const levelMap = {
            'beginner': 'Débutant',
            'intermediate': 'Intermédiaire',
            'advanced': 'Avancé'
        };

        const messageRequest = {
            fullName: userData.fullName || '',
            age: userData.age || '',
            fitnessLevel: levelMap[userData.level] || userData.level || '',
            content: '', // Will be filled later with exercise or chat message
            userContext: userContext
        };

        return messageRequest;
    }

    /**
     * Collect all form answers (object format)
     * @returns {Object} Object containing all answers
     */
    function collectAnswers() {
        const answers = {};

        questionItems.forEach(item => {
            const questionName = item.dataset.question;
            const selectedInput = item.querySelector(`input[name="${questionName}"]:checked`);

            if (selectedInput) {
                answers[questionName] = {
                    value: selectedInput.value,
                    label: selectedInput.nextElementSibling.textContent.trim()
                };
            }
        });

        return answers;
    }

    /**
     * Calculate scores based on answers
     * @param {Object} answers - The collected answers
     * @returns {Object} Calculated scores
     */
    function calculateScores(answers) {
        let sportScore = 0;
        let postureScore = 0;
        let habitsScore = 0;

        // Sport questions (q1-q4)
        if (answers.q1) sportScore += parseInt(answers.q1.value) || 0;
        if (answers.q2) sportScore += parseInt(answers.q2.value) || 0;
        if (answers.q3) sportScore += answers.q3.value === 'no' ? 2 : 0;
        if (answers.q4) sportScore += parseInt(answers.q4.value) || 0;

        // Posture questions (q5-q7) - "no" is better for pain questions
        if (answers.q5) postureScore += answers.q5.value === 'no' ? 3 : 0;
        if (answers.q6) postureScore += answers.q6.value === 'no' ? 3 : 0;
        if (answers.q7) postureScore += answers.q7.value === 'no' ? 3 : 0;

        // Habits questions (q8-q10)
        if (answers.q8) habitsScore += (3 - parseInt(answers.q8.value)) || 0;
        if (answers.q9) habitsScore += (3 - parseInt(answers.q9.value)) || 0;
        if (answers.q10) habitsScore += parseInt(answers.q10.value) || 0;

        // Calculate percentages
        const maxSportScore = 11;
        const maxPostureScore = 9;
        const maxHabitsScore = 9;

        return {
            sport: Math.round((sportScore / maxSportScore) * 100),
            posture: Math.round((postureScore / maxPostureScore) * 100),
            habits: Math.round((habitsScore / maxHabitsScore) * 100),
            overall: Math.round(((sportScore / maxSportScore + postureScore / maxPostureScore + habitsScore / maxHabitsScore) / 3) * 100)
        };
    }

    /**
     * Store QCM data in sessionStorage
     * @param {Object} answers - The answers
     * @param {Object} scores - The calculated scores
     * @param {Object} messageRequest - The MessageRequest for backend
     */
    function storeQcmData(answers, scores, messageRequest) {
        const qcmData = {
            answers,
            scores,
            messageRequest,
            timestamp: new Date().toISOString()
        };

        try {
            // Store complete QCM data
            sessionStorage.setItem('antigravity_qcm', JSON.stringify(qcmData));

            // Store MessageRequest separately for easy access
            sessionStorage.setItem('messageRequest', JSON.stringify(messageRequest));

            console.log('✅ QCM data stored');
            console.log('📦 MessageRequest for backend:', messageRequest);
            console.log('📝 UserContext:', messageRequest.userContext);

            return true;
        } catch (error) {
            console.error('❌ Error storing QCM data:', error);
            return false;
        }
    }

    /**
     * Handle form submission
     * @param {Event} event - Submit event
     */
    function handleSubmit(event) {
        event.preventDefault();

        if (!validateForm()) {
            alert('⚠️ Veuillez répondre à toutes les questions avant de continuer.');
            return;
        }

        const answers = collectAnswers();
        const scores = calculateScores(answers);
        const messageRequest = buildMessageRequest();

        if (storeQcmData(answers, scores, messageRequest)) {
            // Navigate to results page
            window.location.href = 'results.html';
        } else {
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    }

    /**
     * Add event listeners to all radio inputs
     */
    function setupListeners() {
        const allInputs = form.querySelectorAll('input[type="radio"]');

        allInputs.forEach(input => {
            input.addEventListener('change', updateProgress);
        });
    }

    /**
     * Check for existing QCM data and restore answers
     */
    function restoreAnswers() {
        try {
            const existingData = sessionStorage.getItem('antigravity_qcm');
            if (existingData) {
                const data = JSON.parse(existingData);

                if (data.answers) {
                    Object.entries(data.answers).forEach(([question, answer]) => {
                        const input = document.querySelector(
                            `input[name="${question}"][value="${answer.value}"]`
                        );
                        if (input) {
                            input.checked = true;
                        }
                    });

                    updateProgress();
                    console.log('📋 Previous answers restored');
                }
            }
        } catch (error) {
            console.log('No previous QCM data found');
        }
    }

    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // Initialize
    function init() {
        setupListeners();
        restoreAnswers();
        form.addEventListener('submit', handleSubmit);

        // Log user data from index.html
        const userData = getUserData();
        console.log('� User data from index:', userData);
        console.log('�🚀 QCM page initialized');
    }

    init();
});

/**
 * Helper function to get MessageRequest from any page
 * Can be used to send data to backend
 * @returns {Object|null} MessageRequest object or null
 */
function getMessageRequest() {
    try {
        const data = sessionStorage.getItem('messageRequest');
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error getting MessageRequest:', e);
        return null;
    }
}

/**
 * Helper function to update content in MessageRequest
 * Call this when user selects exercise or sends chat message
 * @param {string} content - The content to set
 * @returns {Object|null} Updated MessageRequest
 */
function setMessageRequestContent(content) {
    try {
        const messageRequest = getMessageRequest();
        if (messageRequest) {
            messageRequest.content = content;
            sessionStorage.setItem('messageRequest', JSON.stringify(messageRequest));
            console.log('📝 MessageRequest content updated:', content);
            return messageRequest;
        }
        return null;
    } catch (e) {
        console.error('Error updating MessageRequest:', e);
        return null;
    }
}
