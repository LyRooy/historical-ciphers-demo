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
    let railsValue = 3;        // szyfr Płotowy
    let offsetValue = 0;       // offset płotowy

    // =====================================================
    // TYDZIEŃ 6: IMPLEMENTACJA ENIGMY
    // =====================================================

    //Enigma
    // Automatyczne tworzenie reflektora (symetryczne pary)
    function generateReflector(ALPH) {
        let chars = [...ALPH];
        let result = Array(ALPH.length);
        let remaining = [...chars];

        while (remaining.length > 1) {
            let a = remaining.shift();
            let b = remaining.pop();
            let ia = ALPH.indexOf(a);
            let ib = ALPH.indexOf(b);
            result[ia] = b;
            result[ib] = a;
        }
        
        // jeśli alfabet nieparzysty → ostatni znak odbija się sam
        if (remaining.length === 1) {
            let x = remaining[0];
            let ix = ALPH.indexOf(x);
            result[ix] = x;
        }
        
        return result.join('');
    }
    
    const REFLECTOR = generateReflector(POLISH_LOWER);  //Sprawia że szyfrowanie jest odwracalne

    //Generuje losowe rotory (Zwróci bład odwracalnośi)
    /*function generateRotor(alphabet) {
        const arr = [...alphabet];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]; // tasowanie Fisher-Yates
            }
            return arr.join('');
        }
        
        // Przykład: wygeneruj 3 rotory
        const ROTORS = [
            generateRotor(POLISH_LOWER),
            generateRotor(POLISH_LOWER),
            generateRotor(POLISH_LOWER)
        ];
        
        console.log("ROTORY:", ROTORS);
        */

    
    // Przykładowe 3 rotory (bijekcje)
    const ROTORS = [
        "ąbcćdeęfghijklłmnńoópqrsśtuvwxyzźża",
        "bcćdeęfghijklłmnńoópqrsśtuvwxyzźżaą",
        "cćdeęfghijklłmnńoópqrsśtuvwxyzźżaąb"
    ];
    

    function idx(ch) { return POLISH_LOWER.indexOf(ch); }  //ETW (rotor wstępny) nieruchomy w enigmie
    
    // --- rotor przód ---
    function rotorForward(i, rotor, pos) {
        let stepped = (i + pos) % ALPHABET_SIZE;
        return idx(rotor[stepped]);
    }
    
    // --- rotor tył ---
    function rotorBackward(i, rotor, pos) {
        let steppedChar = POLISH_LOWER[(i + pos) % ALPHABET_SIZE];
        let encodedIndex = rotor.indexOf(steppedChar);
        return (encodedIndex - pos + ALPHABET_SIZE) % ALPHABET_SIZE;
    }
    
    //Konwersja liter na pozycje rotora
    function letterToRotorPos(ch) {
        return POLISH_UPPER.indexOf(ch.toUpperCase());
    }

    //Konwersja pozycji na litery
    function rotorPosToLetter(pos) {
        return POLISH_UPPER[pos];
    }

    // === STAN SPA I WIZUALIZACJI ===
    let spaState = {
        currentSection: 'home',
        visualizationSteps: [],
        currentStep: 0,
        isPlaying: false,
        initialLoad: true,  // Flaga dla pierwszego załadowania
        tableModalOpen: false,
        modalPlaying: false,
        modalPlayInterval: null
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
        
        // Ukryj/pokaż odpowiednie sekcje
        const appSection = document.getElementById('app');
        const quizSection = document.getElementById('quiz');
        const tutorialSection = document.getElementById('tutorial');
        const homeSection = document.getElementById('home');
        
        // Usuń klasę active ze wszystkich ukrywalnych sekcji
        if (quizSection) quizSection.classList.remove('active');
        if (tutorialSection) tutorialSection.classList.remove('active');
        
        // Pokaż wybraną sekcję (quiz i tutorial)
        if (sectionId === 'quiz' && quizSection) {
            quizSection.classList.add('active');
        } else if (sectionId === 'tutorial' && tutorialSection) {
            tutorialSection.classList.add('active');
        }
        
        // Płynne przewijanie do sekcji (tylko jeśli nie jest to pierwsze załadowanie)
        const targetSection = document.getElementById(sectionId);
        if (targetSection && !spaState.initialLoad) {
            // Przewiń z offsetem, aby nie ukrywać nawigacji
            const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = targetSection.offsetTop - navHeight - 20;
            window.scrollTo({ 
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        // Wyłącz flagę po pierwszym załadowaniu
        if (spaState.initialLoad) {
            spaState.initialLoad = false;
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
                    <button class="table-viz-btn" id="show-table-btn" style="display: none;" onclick="openTableModal()">
                        📊 Tabela substytucji
                    </button>
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
            prevBtn.onclick = () => previousVisualizationStep();
        }
        
        if (playBtn) {
            playBtn.onclick = () => toggleVisualizationPlayback();
        }
        
        if (nextBtn) {
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
        
        const vizArea = document.querySelector('.visualization-area');
        
        const step = spaState.visualizationSteps[spaState.currentStep];
        renderVisualizationStep(step);
        updateProgressIndicators();
        
        // Zawsze resetuj scroll na samą górę
        if (vizArea) {
            vizArea.scrollTop = 0;
        }
    }
    
    function renderVisualizationStep(step) {
        const vizArea = document.querySelector('.visualization-area');
        if (!vizArea) return;
        
        
        // Sprawdź czy w Vigenère litery są takie same i pokaż notyfikację
        if (currentCipher === 'vigenere' && step.originalIndex === step.newIndex) {
            showNotification(`Litera pozostaje taka sama (przesunięcie ${step.keyShift} jest wielokrotnością 35)`, 'info');
        }
        
        // Renderuj różne wizualizacje w zależności od szyfru
        if (currentCipher === 'vigenere') {
            vizArea.innerHTML = renderVigenereVisualizationStep(step);
        } else if (currentCipher === 'railfence') {
            vizArea.innerHTML = renderRailFenceVisualizationStep(step);
        } else if (currentCipher === 'caesar') {
                // Renderuj wizualizację Cezara (istniejąca logika)
                // Formatowanie przesunięcia dla wyświetlenia
                const shiftAbs = Math.abs(step.shift);
                const shiftSign = step.shift >= 0 ? '+' : '-';
                const shiftFormatted = shiftAbs < 10 ? `0${shiftAbs}` : `${shiftAbs}`;
                const shiftDisplay = `${shiftSign}${shiftFormatted}`;
                
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
                                <div class="char-position">Pozycja: ${step.originalIndex < 10 ? '0' + step.originalIndex : step.originalIndex}</div>
                            </div>
                            
                            <div class="transform-arrow">
                                <div class="shift-info">${shiftDisplay}</div>
                                <div class="arrow">→</div>
                            </div>
                            
                            <div class="char-box transformed">
                                <div class="char-label">${transformedLabel}</div>
                                <div class="char-display">${step.transformed}</div>
                                <div class="char-position">Pozycja: ${step.newIndex < 10 ? '0' + step.newIndex : step.newIndex}</div>
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
    }
    
    function renderAlphabetWithHighlights(step) {
        const alphabet = step.isUpperCase ? POLISH_UPPER : POLISH_LOWER;
        return alphabet.split('').map((letter, index) => {
            let className = 'alphabet-letter';
            // Dodaj klasy podświetleń zawsze, bez warunku
            if (index === step.originalIndex) {
                className += ' original-highlight';
            }
            if (index === step.newIndex) {
                className += ' transformed-highlight';
            }
            return `<span class="${className}" data-index="${index}">${letter}</span>`;
        }).join('');
    }
    
    function renderCaesarAlphabetOriginal(step) {
        const alphabet = step.isUpperCase ? POLISH_UPPER : POLISH_LOWER;
        return alphabet.split('').map((letter, index) => {
            let className = 'alphabet-letter';
            if (index === step.originalIndex) {
                className += ' original-highlight';
            }
            return `<span class="${className}" data-index="${index}">${letter}</span>`;
        }).join('');
    }
    
    function renderCaesarAlphabetTransformed(step) {
        const alphabet = step.isUpperCase ? POLISH_UPPER : POLISH_LOWER;
        return alphabet.split('').map((letter, index) => {
            let className = 'alphabet-letter';
            if (index === step.newIndex) {
                className += ' transformed-highlight';
            }
            return `<span class="${className}" data-index="${index}">${letter}</span>`;
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
        
        // Natychmiast pokaż pierwszy krok
        updateVisualizationDisplay();
        
        spaState.playInterval = setInterval(() => {
            if (spaState.currentStep < spaState.visualizationSteps.length - 1) {
                spaState.currentStep++;
                updateVisualizationDisplay();
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
            let message = 'Wybierz szyfr i zaszyfruj tekst aby zobaczyć wizualizację';
            
            // Personalizowana wiadomość w zależności od wybranego szyfru
            if (currentCipher === 'caesar') {
                message = 'Zaszyfruj tekst aby zobaczyć wizualizację szyfru Cezara';
            } else if (currentCipher === 'vigenere') {
                message = 'Zaszyfruj tekst aby zobaczyć wizualizację szyfru Vigenère\'a';
            } else if (currentCipher === 'railfence') {
                message = 'Zaszyfruj tekst aby zobaczyć wizualizację szyfru płotowego';
            } else if (currentCipher === 'enigma') {
                message = 'Zaszyfruj tekst aby zobaczyć wizualizację Enigmy';
            }
            
            vizArea.innerHTML = `
                <div class="viz-placeholder">
                    <div class="placeholder-icon">🔍</div>
                    <p>${message}</p>
                </div>
            `;
        }
        
        document.querySelector('.current-step').textContent = '0';
        document.querySelector('.total-steps').textContent = '0';
        document.querySelector('.progress-fill').style.width = '0%';
    }
    
    // =====================================================
    // WIZUALIZACJA VIGENÈRE
    // =====================================================
    
    function generateVigenereVisualizationSteps(text, keyword, isEncryption = true) {
        spaState.visualizationSteps = [];
        
        // Oczyść klucz
        const cleanKeyword = keyword.toUpperCase().replace(new RegExp(`[^${POLISH_UPPER}]`, 'g'), '');
        if (cleanKeyword.length === 0) return;
        
        let stepNumber = 1;
        let keyIndex = 0;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            let lowerIdx = POLISH_LOWER.indexOf(char);
            let upperIdx = POLISH_UPPER.indexOf(char);
            
            if (lowerIdx !== -1 || upperIdx !== -1) {
                const isUpper = upperIdx !== -1;
                const textIdx = isUpper ? upperIdx : lowerIdx;
                const currentAlphabet = isUpper ? POLISH_UPPER : POLISH_LOWER;
                
                // Klucz jest zawsze w wielkich literach
                const keyChar = cleanKeyword[keyIndex % cleanKeyword.length];
                const keyShift = POLISH_UPPER.indexOf(keyChar);
                
                // Oblicz przesunięcie
                const shift = isEncryption ? keyShift : (ALPHABET_SIZE - keyShift) % ALPHABET_SIZE;
                const newIdx = (textIdx + shift) % ALPHABET_SIZE;
                const transformedChar = currentAlphabet[newIdx];
                
                // Formatowanie przesunięcia
                const shiftDisplay = isEncryption ? `+${keyShift}` : `-${keyShift}`;
                
                spaState.visualizationSteps.push({
                    stepNumber,
                    position: i,
                    original: char,
                    transformed: transformedChar,
                    keyChar: keyChar,
                    keyShift: keyShift,
                    shift: shift,
                    originalIndex: textIdx,
                    newIndex: newIdx,
                    isUpperCase: isUpper,
                    isEncryption: isEncryption,
                    keyword: cleanKeyword,
                    keyIndex: keyIndex % cleanKeyword.length,
                    description: `'${char}' + klucz '${keyChar}' (${shiftDisplay}) = '${transformedChar}'`
                });
                
                keyIndex++;
                stepNumber++;
            }
        }
        
        spaState.currentStep = 0;
        updateVisualizationDisplay();
    }
    
    function renderVigenereVisualizationStep(step) {
        // Dynamiczne etykiety
        const originalLabel = step.isEncryption ? 'Oryginalny' : 'Zaszyfrowany';
        const transformedLabel = step.isEncryption ? 'Zaszyfrowany' : 'Odszyfrowany';
        const operationLabel = step.isEncryption ? 'Szyfrowanie' : 'Deszyfrowanie';
        
        // Formatowanie przesunięcia z zerem wiodącym
        const shiftAbs = step.keyShift;
        const shiftSign = step.isEncryption ? '+' : '-';
        const shiftFormatted = shiftAbs < 10 ? `0${shiftAbs}` : `${shiftAbs}`;
        const shiftDisplay = `${shiftSign}${shiftFormatted}`;
        
        return `
            <div class="viz-step-content vigenere-viz">
                <div class="step-header">
                    <h4>${operationLabel} - Krok ${step.stepNumber}: ${step.description}</h4>
                </div>
                
                <div class="vigenere-key-display">
                    <div class="key-info">
                        <span class="key-label">Słowo kluczowe:</span>
                        <div class="key-sequence">
                            ${renderKeySequence(step)}
                        </div>
                    </div>
                </div>
                
                <div class="char-transformation">
                    <div class="char-box original">
                        <div class="char-label">${originalLabel}</div>
                        <div class="char-display">${step.original}</div>
                        <div class="char-position">Pozycja: ${step.originalIndex < 10 ? '0' + step.originalIndex : step.originalIndex}</div>
                    </div>
                    
                    <div class="transform-arrow vigenere-arrow">
                        <div class="key-char-display">
                            <div class="key-char-label">Litera klucza</div>
                            <div class="key-char-value">${step.keyChar}</div>
                            <div class="key-shift-value">Przesunięcie: ${shiftDisplay}</div>
                        </div>
                        <div class="arrow">→</div>
                    </div>
                    
                    <div class="char-box transformed">
                        <div class="char-label">${transformedLabel}</div>
                        <div class="char-display">${step.transformed}</div>
                        <div class="char-position">Pozycja: ${step.newIndex < 10 ? '0' + step.newIndex : step.newIndex}</div>
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
    
    function renderVigenereAlphabetOriginal(step) {
        const alphabet = step.isUpperCase ? POLISH_UPPER : POLISH_LOWER;
        return alphabet.split('').map((letter, index) => {
            let className = 'alphabet-letter';
            if (index === step.originalIndex) {
                className += ' original-highlight';
            }
            return `<span class="${className}" data-index="${index}">${letter}</span>`;
        }).join('');
    }
    
    function renderVigenereAlphabetTransformed(step) {
        const alphabet = step.isUpperCase ? POLISH_UPPER : POLISH_LOWER;
        return alphabet.split('').map((letter, index) => {
            let className = 'alphabet-letter';
            if (index === step.newIndex) {
                className += ' transformed-highlight';
            }
            return `<span class="${className}" data-index="${index}">${letter}</span>`;
        }).join('');
    }
    
    function renderKeySequence(step) {
        return step.keyword.split('').map((letter, index) => {
            const isActive = index === step.keyIndex;
            return `<span class="key-letter ${isActive ? 'active' : ''}">${letter}</span>`;
        }).join('');
    }
    
    // Kolejkowanie notyfikacji — wszystkie powiadomienia będą wkładane
    // do jednego kontenera, aby nie znikały przy modyfikacjach innych elementów DOM.
    const _notificationQueue = [];
    let _notificationProcessing = false;

    // Upewnij się, że istnieje kontener dla notyfikacji
    function _ensureNotificationContainer() {
        let container = document.getElementById('spa-notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'spa-notification-container';
            // Podstawowe style kontenera (można nadpisać w CSS)
            container.style.position = 'fixed';
            container.style.top = '1rem';
            container.style.right = '1rem';
            container.style.zIndex = '11001';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '0.5rem';
            document.body.appendChild(container);
        }
        return container;
    }

    function showNotification(message, type = 'info', duration = 3000) {
        return new Promise((resolve) => {
            _notificationQueue.push({ message, type, duration, resolve });
            _processNotificationQueue();
        });
    }

    function _processNotificationQueue() {
        if (_notificationProcessing) return;
        if (_notificationQueue.length === 0) return;

        _notificationProcessing = true;
        const { message, type, duration, resolve } = _notificationQueue.shift();

        const container = _ensureNotificationContainer();

        const notification = document.createElement('div');
        notification.className = `spa-notification ${type}`;
        notification.textContent = message;
        // Zapewnij, że element jest widoczny niezależnie od innych zmian DOM
        notification.style.willChange = 'opacity, transform';
        container.appendChild(notification);

        // Daj przeglądarce czas na wyrenderowanie by animacje mogły działać
        requestAnimationFrame(() => {
            notification.classList.add('visible');
        });

        // Czekaj określony czas, a następnie usuń notyfikację
        setTimeout(() => {
            notification.classList.remove('visible');
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
                // rozwiąż obietnicę, aby wywołujący mogli łączyć, jeśli chcą
                try { resolve(); } catch (e) {}
                _notificationProcessing = false;
                // przetwórz następny w kolejce
                _processNotificationQueue();
            }, 300);
        }, duration);
    }
    
    // =====================================================
    // WIZUALIZACJA TABELOWA VIGENÈRE (TABULA SUBSTYTUCJI) - MODAL
    // =====================================================
    
    function openTableModal() {
        if (currentCipher !== 'vigenere' || spaState.visualizationSteps.length === 0) return;
        
        // Zatrzymaj odtwarzanie wizualizacji głównej
        if (spaState.isPlaying) {
            stopVisualizationPlayback();
            const playBtn = document.getElementById('play-viz');
            if (playBtn) playBtn.innerHTML = '▶️';
        }
        
        const step = spaState.visualizationSteps[spaState.currentStep];
        
        const modalHTML = `
            <div class="table-modal-overlay" id="table-modal">
                <div class="table-modal-content">
                    <div class="table-modal-header">
                        <h3>Tabela Substytucji Vigenère</h3>
                        <div class="modal-controls">
                            <button class="btn-icon btn-icon-sm" title="Poprzedni krok" onclick="modalPrevStep()">
                                ⏮️
                            </button>
                            <button class="btn-icon btn-icon-sm" title="Odtwórz" id="modal-play-btn" onclick="toggleModalPlayback()">
                                ▶️
                            </button>
                            <button class="btn-icon btn-icon-sm" title="Następny krok" onclick="modalNextStep()">
                                ⏭️
                            </button>
                            <span class="modal-step-counter">
                                Krok <span id="modal-current-step">${spaState.currentStep + 1}</span> / <span id="modal-total-steps">${spaState.visualizationSteps.length}</span>
                            </span>
                        </div>
                        <button class="modal-close-btn" onclick="closeTableModal()">&times;</button>
                    </div>
                    <div class="table-modal-body" id="modal-table-body">
                        ${renderVigenereTableVisualization(step)}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        spaState.tableModalOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Pokaż notyfikację dla deszyfrowania NATYCHMIAST po otwarciu modala
        if (!step.isEncryption) {
            showNotification('Przy deszyfrowaniu: kolumna to odszyfrowana litera, przecięcie to zaszyfrowana. Zobacz legendę! ⬇️', 'info');
        }
    }
    
    function closeTableModal() {
        const modal = document.getElementById('table-modal');
        if (modal) {
            // Zatrzymaj odtwarzanie w modalu
            if (spaState.modalPlaying) {
                stopModalPlayback();
            }
            modal.remove();
            spaState.tableModalOpen = false;
            document.body.style.overflow = '';
        }
    }
    
    function updateModalContent() {
        if (!spaState.tableModalOpen) return;
        
        const step = spaState.visualizationSteps[spaState.currentStep];
        const modalBody = document.getElementById('modal-table-body');
        const currentStepEl = document.getElementById('modal-current-step');
        
        if (modalBody) {
            modalBody.innerHTML = renderVigenereTableVisualization(step);
        }
        
        if (currentStepEl) {
            currentStepEl.textContent = spaState.currentStep + 1;
        }
    }
    

    
    function modalPrevStep() {
        if (spaState.currentStep > 0) {
            spaState.currentStep--;
            updateModalContent();
            updateVisualizationDisplay();
        }
    }
    
    function modalNextStep() {
        if (spaState.currentStep < spaState.visualizationSteps.length - 1) {
            spaState.currentStep++;
            updateModalContent();
            updateVisualizationDisplay();
        }
    }
    
    function toggleModalPlayback() {
        const playBtn = document.getElementById('modal-play-btn');
        
        if (spaState.modalPlaying) {
            stopModalPlayback();
            if (playBtn) playBtn.innerHTML = '▶️';
        } else {
            // Jeśli jesteśmy na ostatnim kroku, wracamy na początek
            if (spaState.currentStep >= spaState.visualizationSteps.length - 1) {
                spaState.currentStep = 0;
                updateModalContent();
                updateVisualizationDisplay();
            }
            startModalPlayback();
            if (playBtn) playBtn.innerHTML = '⏸️';
        }
    }
    
    function startModalPlayback() {
        if (spaState.visualizationSteps.length === 0) return;
        
        spaState.modalPlaying = true;
        
        spaState.modalPlayInterval = setInterval(() => {
            if (spaState.currentStep < spaState.visualizationSteps.length - 1) {
                spaState.currentStep++;
                updateModalContent();
                updateVisualizationDisplay();
            } else {
                stopModalPlayback();
                const playBtn = document.getElementById('modal-play-btn');
                if (playBtn) playBtn.innerHTML = '▶️';
                showNotification('Wizualizacja zakończona!', 'success');
            }
        }, 1500);
    }
    
    function stopModalPlayback() {
        spaState.modalPlaying = false;
        if (spaState.modalPlayInterval) {
            clearInterval(spaState.modalPlayInterval);
            spaState.modalPlayInterval = null;
        }
    }
    
    // Funkcja globalna dla onclick w HTML
    window.closeTableModal = closeTableModal;
    window.openTableModal = openTableModal;
    window.modalPrevStep = modalPrevStep;
    window.modalNextStep = modalNextStep;
    window.toggleModalPlayback = toggleModalPlayback;
    
    // =====================================================
    // WIZUALIZACJA SZYFRU PŁOTOWEGO
    // =====================================================
    
    function generateRailFenceVisualizationSteps(text, rails, offset = 0, isEncryption = true) {
        spaState.visualizationSteps = [];

        if (rails <= 1) return;

        // Usuń spacje z tekstu dla wizualizacji
        const originalText = text;
        const cleanText = text.replace(/\s+/g, '');
        const textLength = cleanText.length;

        if (textLength === 0) {
            spaState.currentStep = 0;
            updateVisualizationDisplay();
            return;
        }

        if (isEncryption) {
            // SZYFROWANIE - umieszczamy litery w zygzaku, zaczynając od offsetu
            const fullFence = Array.from({ length: rails }, () => Array(textLength).fill(null));

            // Wypełniamy płot znakami z uwzględnieniem offsetu
            let row = offset % rails;
            let direction = (row === 0) ? 1 : (row === rails - 1) ? -1 : 1;

            for (let i = 0; i < textLength; i++) {
                fullFence[row][i] = cleanText[i];

                if (row === 0) {
                    direction = 1;
                } else if (row === rails - 1) {
                    direction = -1;
                }

                row += direction;
            }

            // Generuj kroki wizualizacji: dla każdego kroku symulujemy zygzak zaczynając od offsetu
            for (let step = 0; step < textLength; step++) {
                const fenceSnapshot = Array.from({ length: rails }, () => Array(textLength).fill(null));

                let r = offset % rails;
                let dir = (r === 0) ? 1 : (r === rails - 1) ? -1 : 1;
                let lastPlacedRow = r;

                for (let i = 0; i <= step; i++) {
                    fenceSnapshot[r][i] = cleanText[i];
                    lastPlacedRow = r;

                    if (r === 0) {
                        dir = 1;
                    } else if (r === rails - 1) {
                        dir = -1;
                    }
                    r += dir;
                }

                spaState.visualizationSteps.push({
                    stepNumber: step + 1,
                    currentRail: lastPlacedRow,
                    fence: fenceSnapshot,
                    fullFence: fullFence,
                    cleanText: cleanText,
                    originalText: originalText,
                    step: step + 1,
                    isEncryption: true,
                    description: `Umieszczenie litery '${cleanText[step]}' w rzędzie ${lastPlacedRow + 1}`
                });
            }
        } else {
            // DESZYFROWANIE - pokazujemy jak litery pojawiają się w zygzaku (jak odczytujemy)

            // Najpierw oblicz długości poszczególnych rzędów
            const lengths = Array(rails).fill(0);
            let row = offset % rails;
            let direction = (row === 0) ? 1 : (row === rails - 1) ? -1 : 1;

            for (let i = 0; i < textLength; i++) {
                lengths[row]++;

                if (row === 0) {
                    direction = 1;
                } else if (row === rails - 1) {
                    direction = -1;
                }

                row += direction;
            }

            // Rozdziel zaszyfrowany tekst na rzędy
            const fence = Array.from({ length: rails }, () => []);
            let index = 0;
            for (let r = 0; r < rails; r++) {
                for (let i = 0; i < lengths[r]; i++) {
                    fence[r].push(cleanText[index++]);
                }
            }

            // Stwórz mapę pozycji zygzaka do rzędów
            const zigzagMap = [];
            row = offset % rails;
            direction = (row === 0) ? 1 : (row === rails - 1) ? -1 : 1;
            const railIndices = Array(rails).fill(0);

            for (let pos = 0; pos < textLength; pos++) {
                zigzagMap.push({
                    rail: row,
                    railIndex: railIndices[row],
                    char: fence[row][railIndices[row]]
                });
                railIndices[row]++;

                if (row === 0) {
                    direction = 1;
                } else if (row === rails - 1) {
                    direction = -1;
                }

                row += direction;
            }

            // Generuj kroki - pokazujemy jak kolejne litery pojawiają się w płocie
            for (let step = 0; step < textLength; step++) {
                // Stwórz płot pokazujący tylko litery do tej pory
                const progressFence = Array.from({ length: rails }, () => Array(textLength).fill(null));

                // Określ pozycje kolumn dla każdego rzędu (z uwzględnieniem offsetu)
                const columnPositions = Array.from({ length: rails }, () => []);
                let r = offset % rails;
                let dir = (r === 0) ? 1 : (r === rails - 1) ? -1 : 1;

                for (let pos = 0; pos < textLength; pos++) {
                    columnPositions[r].push(pos);

                    if (r === 0) {
                        dir = 1;
                    } else if (r === rails - 1) {
                        dir = -1;
                    }
                    r += dir;
                }

                // Wypełnij płot literami do obecnego kroku
                for (let i = 0; i <= step; i++) {
                    const pos = zigzagMap[i];
                    const colPos = columnPositions[pos.rail][pos.railIndex];
                    progressFence[pos.rail][colPos] = pos.char;
                }

                const currentPos = zigzagMap[step];

                spaState.visualizationSteps.push({
                    stepNumber: step + 1,
                    currentRail: currentPos.rail,
                    currentColumn: columnPositions[currentPos.rail][currentPos.railIndex],
                    fence: progressFence,
                    cleanText: cleanText,
                    originalText: originalText,
                    step: step + 1,
                    isEncryption: false,
                    currentChar: currentPos.char,
                    description: `Odczyt litery '${currentPos.char}' z rzędu ${currentPos.rail + 1}`
                });
            }
        }

        spaState.currentStep = 0;
        updateVisualizationDisplay();
    }
    
    function renderRailFenceVisualizationStep(stepData) {
        const rails = stepData.isEncryption ? stepData.fence.length : stepData.fence.length;
        const cleanText = stepData.cleanText;
        const originalText = stepData.originalText;
        
        const operationLabel = stepData.isEncryption ? 'Szyfrowanie' : 'Deszyfrowanie';
        
        // Specjalna notyfikacja dla deszyfrowania
        if (!stepData.isEncryption && stepData.step === 1) {
            showNotification('Podczas odszyfrowywania odczytujemy litery po zygzaku - to jest wynik!', 'info');
        }
        
        let html = `
            <div class="viz-step-content">
                <div class="step-header">
                    <h4>${operationLabel} - Krok ${stepData.step} / ${cleanText.length}</h4>
                </div>
                
                <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
                    <div style="text-align: center;">
                        <p style="color: #94a3b8; font-size: 0.7rem; margin-bottom: 0.25rem;">Oryginalny tekst:</p>
                        <div style="padding: 0.4rem 0.8rem; background: rgba(99, 102, 241, 0.15); border: 2px solid #6366f1; border-radius: 6px;">
                            <code style="font-size: 0.85rem; color: #818cf8; font-family: 'Courier New', monospace;">${originalText}</code>
                        </div>
                    </div>
                    
                    <div style="color: #94a3b8; font-size: 1rem;">→</div>
                    
                    <div style="text-align: center;">
                        <p style="color: #94a3b8; font-size: 0.7rem; margin-bottom: 0.25rem;">Bez spacji:</p>
                        <div style="padding: 0.4rem 0.8rem; background: rgba(99, 102, 241, 0.1); border: 1px solid #6366f1; border-radius: 6px;">
                            <code style="font-size: 0.85rem; color: #818cf8; font-family: 'Courier New', monospace;">${cleanText}</code>
                        </div>
                    </div>
                </div>
                
                ${!stepData.isEncryption ? `
                <div style="background: rgba(0, 123, 255, 0.1); border-left: 4px solid #007bff; padding: 0.8rem; margin-bottom: 1rem; border-radius: 4px;">
                    <p style="margin: 0; font-size: 0.85rem; color: #0056b3;">
                        <strong>Ważne:</strong> Podczas odszyfrowywania odczytujemy litery <strong>po zygzaku</strong> (jak podczas szyfrowania). 
                        To jest nasz odzyfrowany tekst na bieżącym etapie.
                    </p>
                </div>
                ` : ''}
                
                <p class="viz-description" style="margin-bottom: 1rem; text-align: center; color: #cbd5e1; font-size: 0.8rem;">${stepData.description}</p>
                
                <div class="rail-fence-grid">
        `;
        
        if (stepData.isEncryption) {
            // SZYFROWANIE - pokazujemy jak zapełniamy płot
            const fence = stepData.fence;
            const textLength = fence[0].length;
            
            for (let rail = 0; rail < rails; rail++) {
                html += `<div class="rail-row" data-rail="${rail}">`;
                
                for (let pos = 0; pos < textLength; pos++) {
                    const char = fence[rail][pos];
                    let cellClass = 'rail-cell';
                    
                    if (char !== null) {
                        cellClass += ' filled';
                        if (pos === stepData.step - 1 && rail === stepData.currentRail) {
                            cellClass += ' highlight';
                        }
                    }
                    
                    html += `<div class="${cellClass}">${char !== null ? char : '·'}</div>`;
                }
                
                html += `<span class="rail-number">Rząd ${rail + 1}</span></div>`;
            }
        } else {
            // DESZYFROWANIE - pokazujemy jak litery pojawiają się po kolei w zygzaku (jak w szyfrowaniu)
            const fence = stepData.fence;
            
            for (let rail = 0; rail < rails; rail++) {
                html += `<div class="rail-row" data-rail="${rail}">`;
                
                for (let pos = 0; pos < fence[rail].length; pos++) {
                    const char = fence[rail][pos];
                    let cellClass = 'rail-cell';
                    
                    if (char !== null) {
                        cellClass += ' filled';
                        // Podświetl aktualnie dodawaną literę
                        if (rail === stepData.currentRail && pos === stepData.currentColumn) {
                            cellClass += ' highlight';
                        }
                    } else {
                        cellClass += ' empty';
                    }
                    
                    html += `<div class="${cellClass}">${char !== null ? char : '·'}</div>`;
                }
                
                html += `<span class="rail-number">Rząd ${rail + 1}</span></div>`;
            }
        }
        
        html += `
                </div>
                <div style="margin-top: 1rem; text-align: center;">
                    <span style="color: #cbd5e1; font-size: 0.875rem;">
                        Aktualny poziom: ${stepData.currentRail + 1} / ${rails} | 
                        Postęp: ${stepData.step} / ${cleanText.length}
                    </span>
                </div>
            </div>
        `;
        
        return html;
    }
    
    function renderVigenereTableVisualization(step) {
        const operationLabel = step.isEncryption ? 'Szyfrowanie' : 'Deszyfrowanie';
        
        // Generuj tabelę
        let tableHTML = '<div class="tabula-recta-container">';
        
        // Nagłówek z literą klucza
        tableHTML += `
            <div class="table-header-info">
                <div class="table-title">${operationLabel} - Krok ${step.stepNumber}</div>
                <div class="table-operation">
                    <span class="original-char-label">Tekst: <strong>${step.original}</strong></span>
                    <span class="key-char-label">Klucz: <strong>${step.keyChar}</strong></span>
                    <span class="result-char-label">Wynik: <strong>${step.transformed}</strong></span>
                </div>
            </div>
        `;
        
        // Tabela
        tableHTML += '<div class="tabula-recta-scroll"><table class="tabula-recta">';
        
        if (step.isEncryption) {
            // SZYFROWANIE: wiersz = klucz, kolumna = oryginalny tekst, przecięcie = zaszyfrowany
            // Pierwszy wiersz - nagłówek z alfabetem
            tableHTML += '<tr><th class="corner-cell"></th>';
            for (let i = 0; i < ALPHABET_SIZE; i++) {
                const isHighlighted = i === step.originalIndex;
                tableHTML += `<th class="header-cell ${isHighlighted ? 'highlight-col' : ''}">${POLISH_UPPER[i]}</th>`;
            }
            tableHTML += '</tr>';
            
            // Wiersze z przesunięciami
            for (let row = 0; row < ALPHABET_SIZE; row++) {
                const isHighlightedRow = row === step.keyShift;
                tableHTML += `<tr><th class="row-header ${isHighlightedRow ? 'highlight-row' : ''}">${POLISH_UPPER[row]}</th>`;
                
                for (let col = 0; col < ALPHABET_SIZE; col++) {
                    const shiftedIndex = (col + row) % ALPHABET_SIZE;
                    const letter = POLISH_UPPER[shiftedIndex];
                    
                    const isIntersection = (row === step.keyShift && col === step.originalIndex);
                    const isInHighlightedRow = row === step.keyShift;
                    const isInHighlightedCol = col === step.originalIndex;
                    
                    let cellClass = 'table-cell';
                    if (isIntersection) {
                        cellClass += ' intersection';
                    } else if (isInHighlightedRow) {
                        cellClass += ' in-row';
                    } else if (isInHighlightedCol) {
                        cellClass += ' in-col';
                    }
                    
                    tableHTML += `<td class="${cellClass}">${letter}</td>`;
                }
                
                tableHTML += '</tr>';
            }
        } else {
            // DESZYFROWANIE: wiersz = klucz, szukamy w wierszu litery zaszyfrowanej, kolumna to odszyfrowana
            // Pierwszy wiersz - nagłówek z alfabetem
            tableHTML += '<tr><th class="corner-cell"></th>';
            for (let i = 0; i < ALPHABET_SIZE; i++) {
                const isHighlighted = i === step.newIndex; // kolumna to wynik (odszyfrowana litera)
                tableHTML += `<th class="header-cell ${isHighlighted ? 'highlight-col' : ''}">${POLISH_UPPER[i]}</th>`;
            }
            tableHTML += '</tr>';
            
            // Wiersze z przesunięciami
            for (let row = 0; row < ALPHABET_SIZE; row++) {
                const isHighlightedRow = row === step.keyShift;
                tableHTML += `<tr><th class="row-header ${isHighlightedRow ? 'highlight-row' : ''}">${POLISH_UPPER[row]}</th>`;
                
                for (let col = 0; col < ALPHABET_SIZE; col++) {
                    const shiftedIndex = (col + row) % ALPHABET_SIZE;
                    const letter = POLISH_UPPER[shiftedIndex];
                    
                    // Przecięcie: wiersz klucza + kolumna wyniku = zaszyfrowana litera (original)
                    const isIntersection = (row === step.keyShift && col === step.newIndex);
                    const isInHighlightedRow = row === step.keyShift;
                    const isInHighlightedCol = col === step.newIndex;
                    
                    let cellClass = 'table-cell';
                    if (isIntersection) {
                        cellClass += ' intersection';
                    } else if (isInHighlightedRow) {
                        cellClass += ' in-row';
                    } else if (isInHighlightedCol) {
                        cellClass += ' in-col';
                    }
                    
                    tableHTML += `<td class="${cellClass}">${letter}</td>`;
                }
                
                tableHTML += '</tr>';
            }
        }
        
        tableHTML += '</table></div>';
        
        // Legenda
        tableHTML += `
            <div class="table-legend">
                <div class="legend-item">
                    <span class="legend-color intersection"></span>
                    <span>Przecięcie (${step.isEncryption ? 'zaszyfrowana' : 'zaszyfrowana (wejście)'})</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color in-row"></span>
                    <span>Wiersz klucza</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color in-col"></span>
                    <span>Kolumna ${step.isEncryption ? 'tekstu' : 'wyniku (odszyfrowana)'}</span>
                </div>
            </div>
        `;
        
        tableHTML += '</div>';
        
        return tableHTML;
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
    //Tydzien 4
        // === FUNKCJA SZYFRU VIGENÈRE (35-literowy polski alfabet) ===
    function vigenereCipher(text, keyword, encrypt = true) {
        if (!keyword || keyword.trim() === '') return text;

        const cleanKeyword = keyword.toUpperCase().replace(new RegExp(`[^${POLISH_UPPER}]`, 'g'), '');
        if (cleanKeyword.length === 0) return text;

        let result = '';
        let keyIndex = 0;

        for (let char of text) {
            const lowerIdx = POLISH_LOWER.indexOf(char);
            const upperIdx = POLISH_UPPER.indexOf(char);

            if (lowerIdx !== -1 || upperIdx !== -1) {
                const isUpper = upperIdx !== -1;
                const textIdx = isUpper ? upperIdx : lowerIdx;
                const alphabet = isUpper ? POLISH_UPPER : POLISH_LOWER;

                // Klucz jest zawsze w wielkich literach
                const keyChar = cleanKeyword[keyIndex % cleanKeyword.length];
                const keyShift = POLISH_UPPER.indexOf(keyChar);

                let shift = encrypt ? keyShift : (ALPHABET_SIZE - keyShift) % ALPHABET_SIZE;
                const newIdx = (textIdx + shift) % ALPHABET_SIZE;

                result += alphabet[newIdx];
                keyIndex++;
            } else {
                // Znaki spoza alfabetu (spacje, cyfry, interpunkcja) – bez zmian
                result += char;
            }
        }

        return result;
    }

    //Tydzień 5
    // === POPRAWIONY SZYFR PŁOTOWY (z usuwaniem spacji i znaków specjalnych) ===
    //Aktualizacja o offset
    function railFenceEncrypt(text, rails, offset = 0) {
        if (rails <= 1) return text.replace(/\s+/g, '');
        
        const lettersOnly = [...text].filter(char =>
            POLISH_LOWER.includes(char) || POLISH_UPPER.includes(char)
        ).join('');
        
        if (lettersOnly.length === 0) return '';
        
        const fence = Array.from({ length: rails }, () => []);
        
        let row = offset % rails;  // startujemy od offsetu
        
        let direction = 1;

        // Jeśli startujemy nie od góry/dół, musimy ustalić początkowy kierunek
        if (row === 0) direction = 1;
        else if (row === rails - 1) direction = -1;
        // w przeciwnym razie – idziemy w dół, chyba że jesteśmy blisko dołu
         
        for (const char of lettersOnly) {
            fence[row].push(char);
            
            // zmiana kierunku tylko na końcach
            if (row === 0) direction = 1;
            else if (row === rails - 1) direction = -1;
            
            row += direction;
        }
        return fence.flat().join('');
    }
    
    
    function railFenceDecrypt(ciphertext, rails, offset = 0) {
        const length = ciphertext.length;
        
        if (length === 0 || rails <= 1) return ciphertext;
        
        // 1. Oblicz długość każdego rzędu (z uwzględnieniem offsetu)
        const lengths = Array(rails).fill(0);
        let row = offset % rails;
        let direction = 1;
        
        if (row === 0) direction = 1;
        else if (row === rails - 1) direction = -1;
        
        for (let i = 0; i < length; i++) {
            lengths[row]++;
            if (row === 0) direction = 1;
            else if (row === rails - 1) direction = -1;
            row += direction;
        }
        
        // 2. Rozdziel tekst na rzędy
        const fence = [];
        let index = 0;
        for (let r = 0; r < rails; r++) {
            fence[r] = ciphertext.slice(index, index + lengths[r]).split('');
            index += lengths[r];
        }
        
        // 3. Odczytaj po zygzaku zaczynając od offsetu
        let result = '';
        row = offset % rails;
        direction = (row === 0) ? 1 : (row === rails - 1) ? -1 : 1;
        
        for (let i = 0; i < length; i++) {
            result += fence[row].shift();
            if (row === 0) direction = 1;
            else if (row === rails - 1) direction = -1;
            row += direction;
        }
        
        return result;
    }


    //Tydzien 6
    // ENIGMA // 
    // GŁÓWNA FUNKCJA ENIGMY
    function enigmaRun(text, rotorOrder, rotorPositions) {

        text = text.replace(/\s+/g, '');  // usuń wszystkie spacje

        let pos = [...rotorPositions]; // NIE MODYFIKUJ INPUTU
         
        let result = "";
        
        for (let ch of text) {
            let isUpper = POLISH_UPPER.includes(ch);
            if (isUpper) ch = ch.toLowerCase();
            
            let i = idx(ch);
            
            if (i === -1) {
                result += isUpper ? ch.toUpperCase() : ch;
                continue;
            }
            
            // ROTOR STEP (dokładnie jak w prawdziwej Enigmie)
            pos[0] = (pos[0] + 1) % ALPHABET_SIZE;
            if (pos[0] === 0) pos[1] = (pos[1] + 1) % ALPHABET_SIZE;
            if (pos[1] === 0) pos[2] = (pos[2] + 1) % ALPHABET_SIZE;
            
            // ETW = alfabet
            i = idx(POLISH_LOWER[i]);  //ETW (rotor wstępny) nieruchomy w enigmie
             
            // ROTORY PRZÓD
            for (let r = 0; r < 3; r++) {
                i = rotorForward(i, ROTORS[rotorOrder[r]], pos[r]);
            }
            
            // REFLEKTOR
            i = idx(REFLECTOR[i]);
            
            // ROTORY TYŁ
            for (let r = 2; r >= 0; r--) {
                i = rotorBackward(i, ROTORS[rotorOrder[r]], pos[r]);
            }
            
            let out = POLISH_LOWER[i];
            result += isUpper ? out.toUpperCase() : out.toLowerCase();
        }
        
        return result;
    }
    
    function enigmaEncrypt(text, order, pos) {
        return enigmaRun(text, order, [...pos]);
    }
    
    function enigmaDecrypt(text, order, pos) {
        return enigmaRun(text, order, [...pos]);
    }



    // === AKTUALIZACJA LICZNIKA ZNAKÓW ===
    function updateCharCount() {
        const count = inputTextarea.value.length;
        charCount.textContent = `${count} znak${count === 1 ? '' : count <= 4 ? 'i' : 'ów'}`;
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
            
            // Odblokuj textarea i zmień placeholder
            inputTextarea.disabled = false;
            inputTextarea.placeholder = 'Wprowadź tekst do zaszyfrowania...';

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
            
            // Ukryj przycisk tabeli substytucji dla wszystkich szyfrów
            const tableBtn = document.getElementById('show-table-btn');
            if (tableBtn) {
                tableBtn.style.display = 'none';
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
                resetAll();
                // Inicjalizuj wizualizację po wyborze szyfru Cezara
                setTimeout(initializeVisualization, 100);
            }
            // === SZYFR VIGENÈRE ===
            if (currentCipher === 'vigenere') {
                settingsGroup.innerHTML = `
                    <div class="settings-group">
                        <label for="vigenere-key">Słowo kluczowe:</label>
                        <input type="text" id="vigenere-key" class="vigenere-input" placeholder="Np. TAJNE" value="TAJNE">
                        <small class="settings-hint">Tylko polskie litery będą brane pod uwagę</small>
                    </div>
                `;

                // Pokaż alfabet (przyda się użytkownikowi)
                if (alphabetRef) {
                    alphabetRef.classList.add('show');
                }
                
                resetAll();
                // Inicjalizuj wizualizację dla Vigenère
                setTimeout(initializeVisualization, 100);
            }

            // === SZYFR PŁOTOWY ===
            if (currentCipher === 'railfence') {
                settingsGroup.innerHTML = `
                    <div class="settings-group">
                       <label for="railfence-rails">Wysokość płotu (klucz): <strong id="rails-value">3</strong></label>
                       <input type="range" id="railfence-rails" min="2" max="10" value="3" class="shift-slider">
                       <small class="settings-hint">Min 2, maks 10</small> 
                    </div>
                    <div class="settings-group">
                       <label for="railfence-offset">Przesunięcie startowe (offset): <strong id="offset-value">0</strong></label>
                       <input type="range" id="railfence-offset" min="0" max="9" value="0" class="shift-slider">
                       <small class="settings-hint">Od którego rzędu zacząć zapis (0 = domyślnie od góry)</small>
                    </div>
                `;
                //Komentarz do ilości szyn:
                /*
                 2–4 szyny → bardzo słaby szyfr (łatwo złamać „na oko”)
                 5–8 szyn → typowa siła historyczna, nadal łatwy do złamania, ale już wymaga analizy
                 9–10 szyn → mocniejsze pomieszanie tekstu, wystarczające dla celów edukacyjnych
                */
                
                const railsSlider = document.getElementById('railfence-rails');
                const railsDisplay = document.getElementById('rails-value');
                //zmiana
                const offsetSlider = document.getElementById('railfence-offset');
                const offsetDisplay = document.getElementById('offset-value');
                
                railsValue = 3;
                offsetValue = 0;

                railsSlider.addEventListener('input', () => {
                    railsValue = parseInt(railsSlider.value);
                    railsDisplay.textContent = railsValue;

                    // Maksymalny offset = rails - 1
                    const maxOffset = railsValue -1;
                    offsetSlider.max = maxOffset;

                    if (offsetValue >= railsValue) {
                        offsetValue = maxOffset;
                        offsetSlider.value = offsetValue;
                        offsetDisplay.textContent = offsetValue;
                    }
                });
                
                offsetSlider.addEventListener('input', () => {
                    offsetValue = parseInt(offsetSlider.value);
                    offsetDisplay.textContent = offsetValue;
                });
                
                 
                if (alphabetRef) alphabetRef.classList.remove('show');
                resetAll();
                setTimeout(initializeVisualization, 100);
            }

            // === ENIGMA ===
            if (currentCipher === 'enigma') {
                const alphabetOptions = POLISH_UPPER.split('')
                .map(ch => `<option value="${ch}">${ch}</option>`).join('');
                
                settingsGroup.innerHTML = `
                <label>Ustawienie rotorów:</label>
                    <div class="rotor-settings">
                        <select id="r0">${alphabetOptions}</select>
                        <select id="r1">${alphabetOptions}</select>
                        <select id="r2">${alphabetOptions}</select>
                    </div>
                    
                <label>Kolejność rotorów:</label>
                    <div class="rotor-order">
                        <select id="order0">
                            <option value="0">I</option>
                            <option value="1">II</option>
                            <option value="2">III</option>
                        </select>
                        <select id="order1">
                            <option value="0">I</option>
                            <option value="1">II</option>
                            <option value="2">III</option>
                        </select>
                        <select id="order2">
                            <option value="0">I</option>
                            <option value="1">II</option>
                            <option value="2">III</option>
                        </select>
                    </div>
                `;
            }

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
        //Cezar
        if (currentCipher === 'caesar') {
            const result = caesarCipher(input, shiftValue, true);
            outputText.textContent = result;
            
            // Generuj wizualizację dla szyfrowania
            generateVisualizationSteps(input, shiftValue, true);
            showNotification('Tekst zaszyfrowany!', 'success');
        }
        //Vigenere
        if (currentCipher === 'vigenere') {
            const keyInput = document.getElementById('vigenere-key');
            const keyword = keyInput ? keyInput.value.trim() : '';

            if (!keyword) {
                showNotification('Wprowadź słowo kluczowe!', 'warning');
                return;
            }

            const cleanKey = keyword.toUpperCase().replace(new RegExp(`[^${POLISH_UPPER}]`, 'g'), '');
            if (cleanKey.length === 0) {
                showNotification('Klucz musi zawierać przynajmniej jedną polską literę!', 'warning');
                return;
            }

            const result = vigenereCipher(input, keyword, true);
            outputText.textContent = result;
            
            // Generuj wizualizację dla Vigenère
            generateVigenereVisualizationSteps(input, keyword, true);
            
            // Pokaż przycisk tabeli substytucji
            const tableBtn = document.getElementById('show-table-btn');
            if (tableBtn) {
                tableBtn.style.display = 'block';
            }
            
            showNotification('Tekst zaszyfrowany szyfrem Vigenère!', 'success');
        }
        //PŁOTOWY
        if (currentCipher === 'railfence') {
            if (railsValue < 2) { 
                showNotification('Liczba szyn musi być większa niż 1!', 'warning'); 
                return; 
            }
            const result = railFenceEncrypt(input, railsValue,offsetValue);
            outputText.textContent = result || '(brak liter do zaszyfrowania)';
            
            // Generuj wizualizację dla szyfru płotowego (uwzględnia offset)
            generateRailFenceVisualizationSteps(input, railsValue, offsetValue, true);
            
            showNotification('Tekst zaszyfrowany szyfrem płotowym! Spacje zostały usunięte.', 'success');
        }

        //ENIGMA
        if (currentCipher === 'enigma') {
            const pos = [
                letterToRotorPos(document.getElementById('r0').value),
                letterToRotorPos(document.getElementById('r1').value),
                letterToRotorPos(document.getElementById('r2').value)
            ];
            
            const order = [
                parseInt(document.getElementById('order0').value),
                parseInt(document.getElementById('order1').value),
                parseInt(document.getElementById('order2').value),
            ];
            
            const result = enigmaEncrypt(input, order, [...pos]);
            outputText.textContent = result;
            showNotification('Tekst zaszyfrowany Enigmą!', 'success');
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
        //Cezar
        if (currentCipher === 'caesar') {
            const result = caesarCipher(input, shiftValue, false);
            outputText.textContent = result;
            
            // Generuj wizualizację dla deszyfrowania (z ujemnym przesunięciem)
            generateVisualizationSteps(input, -shiftValue, false);
            showNotification('Tekst odszyfrowany!', 'success');
        }
        //Vigenere
        if (currentCipher === 'vigenere') {
            const keyInput = document.getElementById('vigenere-key');
            const keyword = keyInput ? keyInput.value.trim() : '';

            if (!keyword) {
                showNotification('Wprowadź słowo kluczowe!', 'warning');
                return;
            }

            const cleanKey = keyword.toUpperCase().replace(new RegExp(`[^${POLISH_UPPER}]`, 'g'), '');
            if (cleanKey.length === 0) {
                showNotification('Klucz musi zawierać przynajmniej jedną polską literę!', 'warning');
                return;
            }

            const result = vigenereCipher(input, keyword, false);
            outputText.textContent = result;
            
            // Generuj wizualizację dla Vigenère
            generateVigenereVisualizationSteps(input, keyword, false);
            
            // Pokaż przycisk tabeli substytucji
            const tableBtn = document.getElementById('show-table-btn');
            if (tableBtn) {
                tableBtn.style.display = 'block';
            }
            
            showNotification('Tekst odszyfrowany szyfrem Vigenère!', 'success');
        }

        //Płotowy
        if (currentCipher === 'railfence') {
            if (railsValue < 2) { showNotification('Liczba szyn musi być większa niż 1!', 'warning'); return; }
            const result = railFenceDecrypt(input, railsValue,offsetValue);
            outputText.textContent = result;
            
            // Generuj wizualizację dla deszyfrowania płotowego (uwzględnia offset)
            generateRailFenceVisualizationSteps(input, railsValue, offsetValue, false);
            
            showNotification('Tekst odszyfrowany szyfrem płotowym!', 'success');
        }

        //Enigma
        if (currentCipher === 'enigma') {
            const pos = [
                letterToRotorPos(document.getElementById('r0').value),
                letterToRotorPos(document.getElementById('r1').value),
                letterToRotorPos(document.getElementById('r2').value)
            ];
            
            const order = [
                parseInt(document.getElementById('order0').value),
                parseInt(document.getElementById('order1').value),
                parseInt(document.getElementById('order2').value),
            ];
            
            const result = enigmaDecrypt(input, order, [...pos]);
            outputText.textContent = result;
            showNotification('Tekst odszyfrowany Enigmą!', 'success');
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
    
    // === BLOKADA TEXTAREA BEZ WYBRANEGO SZYFRU ===
    inputTextarea.addEventListener('focus', () => {
        if (!currentCipher) {
            inputTextarea.blur();
            showNotification('Najpierw wybierz szyfr!', 'warning');
        }
    });
    
    inputTextarea.addEventListener('input', () => {
        if (!currentCipher) {
            inputTextarea.value = '';
            showNotification('Najpierw wybierz szyfr!', 'warning');
        }
    });
    
    // === POCZĄTKOWA BLOKADA TEXTAREA ===
    inputTextarea.disabled = true;
    inputTextarea.placeholder = 'Najpierw wybierz szyfr...';
    
    updateCharCount();
    
    // === INICJALIZACJA ===
    initializeSPA();
    
    console.log('✨ SPA + Wizualizacja Cezara załadowana!');

    //Testowanie alfabetu
    setTimeout(() => {
    console.log("=== DIAGNOSTYKA ALFABETU ===");

    console.log("Długość POLISH_LOWER:", POLISH_LOWER.length);
    console.log("Znaki alfabetu z kodami Unicode:");
    for (let ch of POLISH_LOWER) {
        console.log(ch, "→", ch.codePointAt(0).toString(16));
    }

    console.log("=== KONIEC DIAGNOSTYKI ===");
}, 500);


    //TESTOWANIE ENIGMY//
    // ============================================================
//                 ENIGMA SELF-TEST / DIAGNOSTYKA
// ============================================================
function enigmaSelfTest() {

    console.log("=== ENIGMA TEST START ===");

    // --- 1. Test reflektora ---
    for (let i = 0; i < ALPHABET_SIZE; i++) {
        let a = POLISH_LOWER[i];
        let b = REFLECTOR[i];
        let ib = POLISH_LOWER.indexOf(b);

        if (REFLECTOR[ib] !== a) {
            console.error("❌ Reflektor nie jest symetryczny dla:", a, "<->", b);
            return false;
        }
    }
    console.log("✔ Reflektor poprawny (symetryczny).");


    // --- 2. Test rotory są bijekcjami ---
    for (let r = 0; r < ROTORS.length; r++) {
        let rotor = ROTORS[r];
        let set = new Set(rotor.split(""));
        if (set.size !== ALPHABET_SIZE) {
            console.error(`❌ Rotor ${r} nie jest bijekcją!`, rotor);
            return false;
        }
    }
    console.log("✔ Wszystkie rotory bijekcyjne.");


    // --- 3. Test jednego pełnego szyfrowania-deszyfrowania ---
    const tests = ["test", "litwa", "żółć", "enigma", "ąćęłńóśźż"];

    for (let t of tests) {
        const pos = [0, 0, 0];      // A A A
        const order = [0, 1, 2];    // I II III

        const encrypted = enigmaRun(t, order, [...pos]);
        const decrypted = enigmaRun(encrypted, order, [...pos]);

        if (decrypted !== t) {
            console.error("❌ BŁĄD ODWARACALNOŚCI:", { t, encrypted, decrypted });
            return false;
        }
    }

    console.log("✔ Enigma przechodzi test odwracalności.");


    // --- 4. Test losowych pozycji rotorów ---
    for (let p0 = 0; p0 < 5; p0++) {
        for (let p1 = 0; p1 < 5; p1++) {
            for (let p2 = 0; p2 < 5; p2++) {

                const pos = [p0, p1, p2];
                const text = "abcżźćńó";

                const encrypted = enigmaRun(text, [0,1,2], [...pos]);
                const decrypted = enigmaRun(encrypted, [0,1,2], [...pos]);

                if (decrypted !== text) {
                    console.error("❌ BŁĄD: nie działa dla pozycji:", pos, 
                                  "wynik:", decrypted);
                    return false;
                }
            }
        }
    }

    console.log("✔ Test pozycji rotorów OK.");

    console.log("=== ENIGMA TEST PASSED ===");
    return true;
}

// Automatyczne wykonanie testu po załadowaniu
setTimeout(() => {
    console.warn(">>> URUCHAMIAM TEST ENIGMY...");
    enigmaSelfTest();
}, 1000);



    
});
