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
    const POLISH_LOWER = 'aąbcćdeęfghijklłmnńoóprsśtuwyzźż';
    const POLISH_UPPER = 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ';
    const ALPHABET_SIZE = 35;

    // === STAN ===
    let currentCipher = null;
    let shiftValue = 3;

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
        inputTextarea.value = '';
        outputText.textContent = 'Wynik pojawi się tutaj...';
        updateCharCount();
        if (currentCipher === 'caesar') {
            const slider = document.getElementById('caesar-shift');
            if (slider) {
                slider.value = 3;
                document.getElementById('shift-value').textContent = '3';
                shiftValue = 3;
            }
        }
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
            }

            resetAll();
        });
    });

    // ==== Obsługa przycisków ====

    // === SZYFROWANIE ===
    encryptBtn.addEventListener('click', () => {
        if (!currentCipher) {
            outputText.textContent = 'Wybierz szyfr!';
            return;
        }
        const input = inputTextarea.value.trim();
        if (!input) {
            outputText.textContent = 'Wprowadź tekst!';
            return;
        }

        if (currentCipher === 'caesar') {
            outputText.textContent = caesarCipher(input, shiftValue, true);
        } else {
            outputText.textContent = '[Inne szyfry w budowie]';
        }
    });

    // === ODSZYFROWANIE ===
    decryptBtn.addEventListener('click', () => {
        if (!currentCipher) {
            outputText.textContent = 'Wybierz szyfr!';
            return;
        }
        const input = inputTextarea.value.trim();
        if (!input) {
            outputText.textContent = 'Wprowadź tekst!';
            return;
        }

        if (currentCipher === 'caesar') {
            outputText.textContent = caesarCipher(input, shiftValue, false);
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
                setTimeout(() => copyBtn.setAttribute('title', originalTitle), 1000);
            });
        }
    });

    // === RESET ===
    resetBtn.addEventListener('click', resetAll);

    // === INPUT EVENTS ===
    inputTextarea.addEventListener('input', updateCharCount);
    updateCharCount();
});