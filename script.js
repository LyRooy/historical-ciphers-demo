//Funkcje obsługi wejścia danych
document.addEventListener('DOMContentLoaded', () => {
    // === ELEMENTY DOM ===
    const cipherItems = document.querySelectorAll('.cipher-item');
    const currentCipherName = document.querySelector('.current-cipher-name');
    const cipherDescription = document.getElementById('cipher-description');
    const inputTextarea = document.querySelector('.cipher-input');
    const charCount = document.querySelector('.char-count');
    const settingsGroup = document.querySelector('.settings-group');
    const encryptBtn = document.getElementById('encrypt-btn');
    const decryptBtn = document.getElementById('decrypt-btn');
    const outputText = document.querySelector('.output-text');
    const copyBtn = document.getElementById('copy-btn');
    const resetBtn = document.getElementById('reset-btn');

    // === PEŁNY POLSKI ALFABET (35 liter) ===
    const POLISH_LOWER = 'aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż';
    const POLISH_UPPER = 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ';
    const ALPHABET_SIZE = 35;

    // === STAN ===
    let currentCipher = null;
    let shiftValue = 3;
    
    // === STAN SPA I WIZUALIZACJI ===
    let spaState = {
        currentSection: 'home',
        visualizationSteps: [],
        currentStep: 0,
        isPlaying: false
    };

    // =====================================================
    // TYDZIEŃ 2: STRUKTURA SPA
    // =====================================================
    
    function initializeSPA() {
        // Routing oparty na hash
        window.addEventListener('hashchange', handleSPARouting);
        
        // Ulepszona nawigacja
        enhanceNavigation();
        
        // Początkowa trasa
        handleSPARouting();
        
        console.log('🚀 SPA zainicjalizowane');
    }
    
    function handleSPARouting() {
        const hash = window.location.hash.slice(1) || 'home';
        navigateToSection(hash);
    }
    
    function navigateToSection(sectionId) {
        // Aktualizuj aktywną nawigację
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
        
        // Płynne przewijanie do sekcji
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        spaState.currentSection = sectionId;
        
        // Inicjalizuj wizualizację po przejściu do sekcji aplikacji
        if (sectionId === 'app') {
            setTimeout(initializeVisualization, 300);
        }
    }
    
    function enhanceNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                window.location.hash = targetId;
            });
        });
        
        // Przyciski hero dla nawigacji SPA
        document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute('href').slice(1);
                window.location.hash = targetId;
            });
        });
    }

    // =====================================================
    // TYDZIEŃ 3: WIZUALIZACJA CEZARA
    // =====================================================
    
    function initializeVisualization() {
        createVisualizationInterface();
        bindVisualizationControls();
        console.log('🎨 Wizualizacja Cezara zainicjalizowana');
    }
    
    function createVisualizationInterface() {
        const vizCard = document.querySelector('.viz-card');
        if (!vizCard) return;
        
        // Sprawdź czy wizualizacja już została zainicjalizowana
        if (vizCard.querySelector('.visualization-content')) {
            console.log('🎨 Wizualizacja już istnieje, pomijam inicjalizację');
            return;
        }
        
        // Dodaj zawartość wizualizacji
        const existingHeader = vizCard.querySelector('.card-header').outerHTML;
        vizCard.innerHTML = existingHeader + `
            <div class="visualization-content">
                <div class="viz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="step-counter">
                        Krok <span class="current-step">0</span> z <span class="total-steps">0</span>
                    </div>
                </div>
                
                <div class="visualization-area">
                    <div class="viz-placeholder">
                        <div class="placeholder-icon">🔍</div>
                        <p>Wybierz szyfr Cezara i zaszyfruj tekst aby zobaczyć wizualizację</p>
                    </div>
                </div>
                
                <div class="alphabet-reference">
                    <h4>Polski alfabet ( 35 liter):</h4>
                    <div class="alphabet-display">
                        ${generateAlphabetDisplay()}
                    </div>
                </div>
            </div>
        `;
    }
    
    function generateAlphabetDisplay() {
        return POLISH_UPPER.split('').map((letter, index) => 
            `<span class="alphabet-letter" data-index="${index}">${letter}</span>`
        ).join('');
    }
    
    function bindVisualizationControls() {
        // Ulepszone istniejące przyciski
        const prevBtn = document.getElementById('prev-step');
        const playBtn = document.getElementById('play-viz');
        const nextBtn = document.getElementById('next-step');
        
        if (prevBtn) {
            // Ikona już jest w HTML, tylko dodajemy funkcjonalność
            prevBtn.onclick = () => previousVisualizationStep();
        }
        
        if (playBtn) {
            // Ikona już jest w HTML, tylko dodajemy funkcjonalność
            playBtn.onclick = () => toggleVisualizationPlayback();
        }
        
        if (nextBtn) {
            // Ikona już jest w HTML, tylko dodajemy funkcjonalność
            nextBtn.onclick = () => nextVisualizationStep();
        }
    }
    
    function generateVisualizationSteps(text, shift, isEncryption = true) {
        spaState.visualizationSteps = [];
        let stepNumber = 1;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            let lowerIdx = POLISH_LOWER.indexOf(char);
            let upperIdx = POLISH_UPPER.indexOf(char);
            
            if (lowerIdx !== -1 || upperIdx !== -1) {
                const isUpper = upperIdx !== -1;
                const idx = isUpper ? upperIdx : lowerIdx;
                const currentAlphabet = isUpper ? POLISH_UPPER : POLISH_LOWER;
                // Obsługa ujemnych przesunięć (modulo dla liczb ujemnych w JS)
                const newIdx = ((idx + shift) % ALPHABET_SIZE + ALPHABET_SIZE) % ALPHABET_SIZE;
                const transformedChar = currentAlphabet[newIdx];
                
                // Formatowanie przesunięcia dla opisu
                const shiftDisplay = shift >= 0 ? `+${shift}` : `${shift}`;
                
                spaState.visualizationSteps.push({
                    stepNumber,
                    position: i,
                    original: char,
                    transformed: transformedChar,
                    shift,
                    originalIndex: idx,
                    newIndex: newIdx,
                    isUpperCase: isUpper,
                    isEncryption: isEncryption,
                    description: `'${char}' (poz. ${idx}) ${shiftDisplay} = '${transformedChar}' (poz. ${newIdx})`
                });
                stepNumber++;
            }
        }
        
        spaState.currentStep = 0;
        updateVisualizationDisplay();
    }
    
    function updateVisualizationDisplay() {
        if (spaState.visualizationSteps.length === 0) {
            clearVisualization();
            return;
        }
        
        const step = spaState.visualizationSteps[spaState.currentStep];
        renderVisualizationStep(step);
        updateProgressIndicators();
    }
    
    function renderVisualizationStep(step) {
        const vizArea = document.querySelector('.visualization-area');
        if (!vizArea) return;
        
        // Formatowanie przesunięcia dla wyświetlenia
        const shiftDisplay = step.shift >= 0 ? `+${step.shift}` : `${step.shift}`;
        
        // Dynamiczne etykiety w zależności od operacji
        const originalLabel = step.isEncryption ? 'Oryginalny' : 'Zaszyfrowany';
        const transformedLabel = step.isEncryption ? 'Zaszyfrowany' : 'Odszyfrowany';
        
        vizArea.innerHTML = `
            <div class="viz-step-content">
                <div class="step-header">
                    <h4>Krok ${step.stepNumber}: ${step.description}</h4>
                </div>
                
                <div class="char-transformation">
                    <div class="char-box original">
                        <div class="char-label">${originalLabel}</div>
                        <div class="char-display">${step.original}</div>
                        <div class="char-position">Pozycja: ${step.originalIndex}</div>
                    </div>
                    
                    <div class="transform-arrow">
                        <div class="shift-info">${shiftDisplay}</div>
                        <div class="arrow">→</div>
                    </div>
                    
                    <div class="char-box transformed">
                        <div class="char-label">${transformedLabel}</div>
                        <div class="char-display">${step.transformed}</div>
                        <div class="char-position">Pozycja: ${step.newIndex}</div>
                    </div>
                </div>
                
                <div class="alphabet-highlight">
                    <div class="alphabet-row">
                        <span class="alphabet-label">${step.isUpperCase ? 'Wielkie' : 'Małe'} litery:</span>
                        <div class="alphabet-letters">
                            ${renderAlphabetWithHighlights(step)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderAlphabetWithHighlights(step) {
        const alphabet = step.isUpperCase ? POLISH_UPPER : POLISH_LOWER;
        return alphabet.split('').map((letter, index) => {
            let className = 'alphabet-letter';
            if (index === step.originalIndex) className += ' original-highlight';
            if (index === step.newIndex) className += ' transformed-highlight';
            return `<span class="${className}">${letter}</span>`;
        }).join('');
    }
    
    function updateProgressIndicators() {
        const currentStepEl = document.querySelector('.current-step');
        const totalStepsEl = document.querySelector('.total-steps');
        const progressFill = document.querySelector('.progress-fill');
        
        if (currentStepEl) currentStepEl.textContent = spaState.currentStep + 1;
        if (totalStepsEl) totalStepsEl.textContent = spaState.visualizationSteps.length;
        
        if (progressFill && spaState.visualizationSteps.length > 0) {
            const progress = ((spaState.currentStep + 1) / spaState.visualizationSteps.length) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }
    
    function previousVisualizationStep() {
        if (spaState.currentStep > 0) {
            spaState.currentStep--;
            updateVisualizationDisplay();
        }
    }
    
    function nextVisualizationStep() {
        if (spaState.currentStep < spaState.visualizationSteps.length - 1) {
            spaState.currentStep++;
            updateVisualizationDisplay();
        }
    }
    
    function toggleVisualizationPlayback() {
        const playBtn = document.getElementById('play-viz');
        
        if (spaState.isPlaying) {
            stopVisualizationPlayback();
            playBtn.innerHTML = '▶️';
        } else {
            startVisualizationPlayback();
            playBtn.innerHTML = '⏸️';
        }
    }
    
    function startVisualizationPlayback() {
        if (spaState.visualizationSteps.length === 0) return;
        
        spaState.isPlaying = true;
        spaState.currentStep = 0;
        
        spaState.playInterval = setInterval(() => {
            updateVisualizationDisplay();
            
            if (spaState.currentStep < spaState.visualizationSteps.length - 1) {
                spaState.currentStep++;
            } else {
                stopVisualizationPlayback();
                document.getElementById('play-viz').innerHTML = '▶️';
                showNotification('Wizualizacja zakończona!', 'success');
            }
        }, 1500);
    }
    
    function stopVisualizationPlayback() {
        spaState.isPlaying = false;
        if (spaState.playInterval) {
            clearInterval(spaState.playInterval);
            spaState.playInterval = null;
        }
    }
    
    function clearVisualization() {
        const vizArea = document.querySelector('.visualization-area');
        if (vizArea) {
            vizArea.innerHTML = `
                <div class="viz-placeholder">
                    <div class="placeholder-icon">🔍</div>
                    <p>Wybierz szyfr Cezara i zaszyfruj tekst aby zobaczyć wizualizację</p>
                </div>
            `;
        }
        
        document.querySelector('.current-step').textContent = '0';
        document.querySelector('.total-steps').textContent = '0';
        document.querySelector('.progress-fill').style.width = '0%';
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `spa-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

// ===== SZYFRY ==== //

    // === FUNKCJA SZYFRU CEZARA (35-literowy alfabet) ===
    function caesarCipher(text, shift, encrypt = true) {
        shift = encrypt ? (shift % ALPHABET_SIZE) : ((ALPHABET_SIZE - (shift % ALPHABET_SIZE)) % ALPHABET_SIZE);

        return [...text].map(char => {
            const lowerIdx = POLISH_LOWER.indexOf(char);
            if (lowerIdx !== -1) {
                return POLISH_LOWER[(lowerIdx + shift) % ALPHABET_SIZE];
            }

            const upperIdx = POLISH_UPPER.indexOf(char);
            if (upperIdx !== -1) {
                return POLISH_UPPER[(upperIdx + shift) % ALPHABET_SIZE];
            }

            // Pozostałe znaki (spacje, cyfry, znaki interpunkcyjne) – bez zmian
            return char;
        }).join('');
    }

    //Pozostałe szyfry ...

    // === AKTUALIZACJA LICZNIKA ZNAKÓW ===
    function updateCharCount() {
        const count = inputTextarea.value.length;
        charCount.textContent = `${count} znak${count === 1 ? '' : count <= 4 ? 'y' : 'ów'}`;
    }

    // === RESET ===
    function resetAll() {
        // Zatrzymaj odtwarzanie wizualizacji
        stopVisualizationPlayback();
        const playBtn = document.getElementById('play-viz');
        if (playBtn) {
            playBtn.innerHTML = '▶️';
        }
        
        // Wyczyść pola
        inputTextarea.value = '';
        outputText.textContent = 'Wynik pojawi się tutaj...';
        updateCharCount();
        
        // Resetuj ustawienia szyfru
        if (currentCipher === 'caesar') {
            const slider = document.getElementById('caesar-shift');
            if (slider) {
                slider.value = 3;
                document.getElementById('shift-value').textContent = '3';
                shiftValue = 3;
            }
        }
        
        clearVisualization();
        showNotification('Pola zostały wyczyszczone', 'success');
    }

    // === WYBÓR SZYFRU ===
    cipherItems.forEach(item => {
        item.addEventListener('click', () => {
            cipherItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            currentCipher = item.dataset.cipher;
            currentCipherName.textContent = item.querySelector('h3').textContent;

            // Opisy
            const descriptions = {
                caesar: 'Szyfr Cezara to prosty szyfr podstawieniowy, w którym każda litera tekstu jest przesuwana o stałą liczbę pozycji w alfabecie.',
                vigenere: 'Szyfr Vigenère używa klucza do zmiany przesunięcia dla każdej litery.',
                railfence: 'Szyfr płotowy zapisuje tekst w zygzaku na "płocie" o zadanej liczbie szyn.',
                enigma: 'Enigma to niemiecka maszyna szyfrująca z II wojny światowej.'
            };
            cipherDescription.textContent = descriptions[currentCipher] || 'Brak opisu.';

            // Czyszczenie ustawień
            settingsGroup.innerHTML = '<p class="settings-placeholder">Wybierz szyfr, aby zobaczyć parametry</p>';

            // Ukryj alfabet dla wszystkich szyfrów
            const alphabetRef = document.querySelector('.alphabet-reference');
            if (alphabetRef) {
                alphabetRef.classList.remove('show');
            }

            //Zmiany w html dla wyboru szyfru
            // === SZYFR CEZARA ===
            if (currentCipher === 'caesar') {
                settingsGroup.innerHTML = `
                    <label for="caesar-shift">Przesunięcie (klucz): <strong id="shift-value">3</strong></label>
                    <input type="range" id="caesar-shift" min="1" max="34" value="3" class="shift-slider">
                `;

                const slider = document.getElementById('caesar-shift');
                const shiftDisplay = document.getElementById('shift-value');

                slider.addEventListener('input', () => {
                    shiftValue = parseInt(slider.value);
                    shiftDisplay.textContent = shiftValue;
                });
                
                // Pokaż alfabet dla szyfru Cezara
                if (alphabetRef) {
                    alphabetRef.classList.add('show');
                }
                
                // Inicjalizuj wizualizację po wyborze szyfru Cezara
                setTimeout(initializeVisualization, 100);
            }

            resetAll();
        });
    });

    // ==== Obsługa przycisków ====

    // === SZYFROWANIE ===
    encryptBtn.addEventListener('click', () => {
        if (!currentCipher) {
            outputText.textContent = 'Wybierz szyfr!';
            showNotification('Wybierz szyfr!', 'warning');
            return;
        }
        const input = inputTextarea.value.trim();
        if (!input) {
            outputText.textContent = 'Wprowadź tekst!';
            showNotification('Wprowadź tekst!', 'warning');
            return;
        }

        if (currentCipher === 'caesar') {
            const result = caesarCipher(input, shiftValue, true);
            outputText.textContent = result;
            
            // Generuj wizualizację dla szyfrowania
            generateVisualizationSteps(input, shiftValue, true);
            showNotification('Tekst zaszyfrowany!', 'success');
        } else {
            outputText.textContent = '[Inne szyfry w budowie]';
        }
    });

    // === ODSZYFROWANIE ===
    decryptBtn.addEventListener('click', () => {
        if (!currentCipher) {
            outputText.textContent = 'Wybierz szyfr!';
            showNotification('Wybierz szyfr!', 'warning');
            return;
        }
        const input = inputTextarea.value.trim();
        if (!input) {
            outputText.textContent = 'Wprowadź tekst!';
            showNotification('Wprowadź tekst!', 'warning');
            return;
        }

        if (currentCipher === 'caesar') {
            const result = caesarCipher(input, shiftValue, false);
            outputText.textContent = result;
            
            // Generuj wizualizację dla deszyfrowania (z ujemnym przesunięciem)
            generateVisualizationSteps(input, -shiftValue, false);
            showNotification('Tekst odszyfrowany!', 'success');
        } else {
            outputText.textContent = '[Inne szyfry w budowie]';
        }
    });

    // === KOPIOWANIE ===
    copyBtn.addEventListener('click', () => {
        const text = outputText.textContent;
        if (text && !text.includes('tutaj') && !text.includes('Wybierz') && !text.includes('Wprowadź')) {
            navigator.clipboard.writeText(text).then(() => {
                const originalTitle = copyBtn.getAttribute('title');
                copyBtn.setAttribute('title', 'Skopiowano!');
                showNotification('Tekst skopiowany do schowka!', 'success');
                setTimeout(() => copyBtn.setAttribute('title', originalTitle), 1000);
            }).catch(() => {
                showNotification('Nie udało się skopiować tekstu', 'error');
            });
        } else {
            showNotification('Brak tekstu do skopiowania', 'warning');
        }
    });

    // === RESET ===
    resetBtn.addEventListener('click', resetAll);

    // === INPUT EVENTS ===
    inputTextarea.addEventListener('input', updateCharCount);
    updateCharCount();
    
    // === INICJALIZACJA ===
    initializeSPA();
    
    console.log('✨ SPA + Wizualizacja Cezara załadowana!');
});