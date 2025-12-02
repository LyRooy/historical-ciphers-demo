console.log("Quiz JS załadowany");
const quizData = {
    basic: [
        { q: "Co to jest szyfr Cezara?", a: ["Szyfr, który zamienia litery na cyfry", "Szyfr przesuwający litery o stałą liczbę pozycji w alfabecie", "Szyfr polegający na losowej zamianie liter", "Szyfr używający klucza w postaci zdania"], c: 1 },
        { q: "Dlaczego szyfr Cezara jest uważany za mało bezpieczny?", a: ["Można go złamać, testując wszystkie możliwe przesunięcia", "Używa zbyt długiego klucza", "Szyfruje tylko samogłoski", "Wymaga dużej mocy obliczeniowej"], c: 0 },
        { q: "W szyfrze Cezara zastosowano przesunięcie o +3. Jak zaszyfruje się litera „A”?", a: ["A", "B", "C", "D"], c: 2 },
        { q: "Odszyfruj szyfrogram „KGNNQ” przy przesunięciu 3.", a: ["HELLO", "HANNA", "MAMMA", "TUTTI"], c: 0 },
        { q: "Czym różni się szyfr podstawieniowy od transpozycyjnego?", a: ["W podstawieniowym zmieniane są litery, a w transpozycyjnym ich kolejność", "W transpozycyjnym dodaje się nowe litery", "Oba działają identycznie", "Transpozycyjny używa klucza liczbowego"], c: 0 },
        { q: "W szyfrze Vigenère’a klucz to „TAJNE”. Co oznacza, że jest to szyfr polialfabetyczny?", a: ["Każda litera tekstu jawnego szyfrowana jest innym alfabetem", "Używa tylko jednego alfabetu", "Klucz zawiera tylko liczby", "Wykorzystuje permutacje cyfr"], c: 0 },
        { q: "Który szyfr używa kilku alfabetów do szyfrowania jednej wiadomości?", a: ["Cezar", "Vigenère", "Rail Fence", "Morse’a"], c: 1 },
        { q: "Na czym polega szyfr płotowy (Rail Fence)?", a: ["Litery są przestawiane w formie falistego wzoru", "Litery są przesuwane o 3 pozycje", "Każda litera zamieniana jest na cyfrę", "Używany jest klucz słowny"], c: 0 },
        { q: "Co oznacza, że szyfrowanie w Enigmie jest symetryczne?", a: ["Ten sam proces służy do szyfrowania i odszyfrowywania", "Wymaga dwóch różnych kluczy", "Nie używa rotorów", "Zawsze daje ten sam wynik"], c: 0 },
        { q: "Jakim celem jest analiza częstości w kryptografii klasycznej?", a: ["Wykrywanie błędów ortograficznych", "Szukanie najczęściej występujących liter w szyfrogramie", "Zmina klucza na krótszy", "Poprawa szybkości szyfrowania"], c: 1 }
    ],

    advanced: [
        { q: "Zaszyfruj tekst „ALA MA KOTA” szyfrem Cezara z przesunięciem +5.", a: ["FQF RF PTYF", "FQF RF PTPY", "DOD PD ŃSYD", "DOD PD NRWD"], c: 2 },
        { q: "Odszyfruj „ŃSY TMŚVD HVBIŻ” przy przesunięciu 5.", a: ["KOT PIÓRA DRZEW", "LAS KWINT DRZWI", "DOM KWIAT STÓŁK", "SOS MĄDRA PISMO"], c: 0 },
        { q: "Zidentyfikuj szyfr: litery są poprzestawiane, ale nie zmienione.", a: ["Cezar", "Vigenère", "Rail Fence", "Enigma"], c: 2 },
        { q: "Vigenère – zaszyfruj „KRYPTONIM” kluczem „KLUCZ”.", a: ["VZCFAJQWB", "UYTLBFPKZ", "VZCFAJQWBM", "TBRSRZYCO"], c: 3 },
        { q: "Vigenère – odszyfruj „RRÓAHWNAX” kluczem „HASLO”.", a: ["TAJNE DANE", "KOD TEST", "KRYPTONIM", "TEORIA"], c: 2 },
        { q: "Jak można ustalić długość klucza w szyfrze Vigenère’a?", a: ["Za pomocą testu Kasiski’ego", "Licząc długość szyfrogramu", "Analizując sumę liter", "Nie da się tego zrobić"], c: 0 },
        { q: "Rail Fence – dla 3 szyn zaszyfruj „KRYPTOGRAFIA”.", a: ["KTARPORFAYGI", "KRYGFATOARPI", "KRGAYFTORAPI", "KRGAFYTORAPI"], c: 0 },
        { q: "Jak działają rotory w maszynie Enigma?", a: ["Każdy rotor przesuwa się po zaszyfrowaniu litery, zmieniając układ alfabetu", "Rotor ustawia alfabet raz na początku", "Rotor zamienia litery losowo", "Rotor działa tylko przy odszyfrowaniu"], c: 0 },
        { q: "Jaką rolę pełni reflektor w Enigmie?", a: ["Odbija sygnał, dzięki czemu szyfrowanie jest odwracalne", "Losuje klucz", "Sprawdza błędy", "Wybiera rotor"], c: 0 },
        { q: "W jaki sposób można złamać szyfr Cezara metodą brute-force?", a: ["Sprawdzić wszystkie możliwe przesunięcia od 1 do 25", "Użyć długiego klucza", "Wykonać analizę statystyczną", "Użyć klucza liczbowego"], c: 0 },
        { q: "Porównaj odporność szyfrów Cezara i Vigenère’a.", a: ["Vigenère jest trudniejszy do złamania dzięki zmiennemu kluczowi", "Cezar jest trudniejszy, bo używa jednego alfabetu", "Obydwa są równie łatwe", "Cezar wymaga testu Kasiski’ego"], c: 0 },
        { q: "Dlaczego Enigma była trudniejsza do złamania niż wcześniejsze szyfry?", a: ["Używała wielu rotorów i zmiennej konfiguracji po każdej literze", "Działała szybciej", "Używała klucza jednorazowego", "Była całkowicie losowa"], c: 0 },
        { q: "Który z poniższych fragmentów najlepiej opisuje algorytm szyfru Cezara?", a: ["Dodaj przesunięcie do kodu każdej litery i zamień z powrotem na literę", "Zamień kolejność wszystkich liter na odwrót", "Zastąp każdą literę inną losową literą alfabetu", "Zamień litery na liczby i dodaj 10"], c: 0 },
        { q: "Jakie błędy w użyciu klucza osłabiały bezpieczeństwo Enigmy?", a: ["Powtarzanie ustawień początkowych rotorów", "Losowy wybór klucza", "Częsta zmiana klucza", "Zbyt wiele rotorów"], c: 0 },
        { q: "W jaki sposób zwiększenie liczby rotorów w Enigmie wpływało na bezpieczeństwo?", a: ["Zwiększało liczbę możliwych kombinacji, a więc bezpieczeństwo", "Zmniejszało liczbę kombinacji", "Nie miało wpływu", "Powodowało błędy w szyfrowaniu"], c: 0 }
    ],

    specific: {
        "Szyfr Cezara": [
            { q: "Zaszyfruj słowo KOT przy przesunięciu 3.", a: ["NRW", "NRZ", "MQW", "MTX"], c: 2 },
            { q: "Odszyfruj WKG ŚXLEM przy przesunięciu 3.", a: ["THE QUICK", "LAS DRZEW", "KOT KONIK", "OCB NREZH"], c: 0 },
            { q: "Litera D została zaszyfrowana jako J. Jakie przesunięcie?", a: ["4", "5", "6", "7"], c: 3 },
            { q: "Z jakim przesunięciem litera A przejdzie w C?", a: ["1", "2", "3", "35"], c: 2 },
            { q: "Co robi szyfr Cezara?", a: ["Zamienia litery na ich liczby", "Przesuwa litery o stałą liczbę", "Miesza kolejność liter", "Zastępuje literę losową inną literą"], c: 1 },
            { q: "Jaki będzie wynik szyfrowania HELLO przy przesunięciu 1?", a: ["IFMMP", "IĘŁŁO", "HFMLO", "IĘŁŁÓ"], c: 3 },
            { q: "Odszyfruj ZGNEQOG przy przesunięciu 3.", a: ["PICTURE", "WELCOME", "WĘMDÓŃĘ", "TEACHER"], c: 1 },
            { q: "Jeśli przesunięcie = 0, to wynik szyfrowania:", a: ["jest losowy", "jest tekstem jawnym", "zależy od klucza", "jest anagramem tekstu"], c: 1 },
            { q: "Jaki znak powstanie z X przy przesunięciu 5?", a: ["Z", "Ó", "A", "Ż" ], c: 2 },
            { q: "Największe możliwe przesunięcie w alfabecie 35-znakowym to:", a: ["25", "26", "35", "34"], c: 3 }
        ],

        "Szyfr Vigenère'a": [
            { q: "Zaszyfruj CAT kluczem KEY (alfabet 35-znakowy).", a: ["MEB", "MEQ", "MFI", "OIC"], c: 1 },
            { q: "Odszyfruj RJHUŚ kluczem KEY.", a: ["HELLO", "HOLLO", "HILLO", "HALLO"], c: 0 },
            { q: "Co jest potrzebne do szyfru Vigenère’a?", a: ["Liczba", "Słowo – klucz", "Brak klucza", "Liczba i klucz"], c: 1 },
            { q: "Która litera znajduje się w tablicy na przecięciu D i E?", a: ["G", "H", "I", "J"], c: 2 },
            { q: "Klucz = A oznacza:", a: ["przesunięcie 0", "przesunięcie 1", "przesunięcie według alfabetu", "nieprawidłowy klucz"], c: 0 },
            { q: "Zaszyfruj DOG kluczem KEY.", a: ["NCI", "NČI", "ŃŚD", "NDI"], c: 2 },
            { q: "Jaką długość musi mieć klucz?", a: ["zawsze 3", "przynajmniej 1", "tyle co tekst (zawsze)", "wielokrotność 3"], c: 1 },
            { q: "Czy Vigenère jest polialfabetyczny?", a: ["Tak", "Nie", "Tylko przy kluczu > 1", "Tylko dla liter bez ogonków"], c: 0 },
            { q: "Co się stanie, jeśli klucz jest krótszy niż tekst?", a: ["jest powtarzany", "szyfr nie działa", "tekst się skraca", "używa się innego klucza"], c: 0 },
            { q: "Odszyfruj LCX kluczem ABC.", a: ["LAB", "LĄU", "LBU", "LCA"], c: 1 }
        ],

        "Szyfr płotowy (Rail Fence)": [
            { q: "Zaszyfruj HELLO przy 2 poziomach.", a: ["HLELO", "HOLEL", "HLOEL", "HLEOL"], c: 2 },
            { q: "Odszyfruj KITTY (3 poziomy).", a: ["KTYTI", "KITTY", "KITYT", "KTITK"], c: 0 },
            { q: "Ile poziomów ma wzór?\nH O R\n E L\n  D", a: ["2", "3", "4", "5"], c: 1 },
            { q: "Zaszyfruj ATTACK przy 3 poziomach.", a: ["AATCTK", "ACTAKT", "ATCATK", "ATKTAC"], c: 1 },
            { q: "Co robi szyfr płotowy?", a: ["miesza kolejność liter falowo", "podmienia litery", "losuje litery", "zamienia litery na liczby"], c: 0 },
            { q: "Odszyfruj ACEBDF (2 poziomy).", a: ["ACEDBF", "ACBEDF", "ABCDEF", "ABEDCF"], c: 2 },
            { q: "Jaki będzie wzór dla słowa DOG przy 3 poziomach?", a: ["D\nO\nG", "DOG", "D O G (w 2 rzędach)", "DGO"], c: 0 },
            { q: "Czy szyfr płotowy zmienia alfabet?", a: ["Tak", "Nie", "Tylko przy nieparzystej liczbie poziomów", "Tylko dla liter diakrytycznych"], c: 1 },
            { q: "Jaki tekst powstanie z CRYPTO przy 2 poziomach?", a: ["CYTRPO", "CPTYOR", "CRPYTO", "CRPYOT"], c: 0 },
            { q: "Który szyfr jest najbardziej podobny w działaniu?", a: ["Cezara", "Przestawieniowy", "XOR", "Vigenère"], c: 1 }
        ],

        "Analiza częstości": [
            { q: "Najczęstsza litera w języku angielskim to:", a: ["A", "E", "T", "O"], c: 1 },
            { q: "Litery są wyrównane — sugeruje to szyfr:", a: ["Cezara", "Vigenère’a", "podstawieniowy monoalfabetyczny", "Rail Fence"], c: 1 },
            { q: "Szyfr podstawieniowy monoalfabetyczny ma:", a: ["zniekształcony histogram", "wyrównany histogram", "histogram zerowy", "tylko jedną literę"], c: 0 },
            { q: "W tekście częstość litery Q jest duża — co to sugeruje?", a: ["błąd", "niestandardowy alfabet", "szyfr nieangielski", "poprawne dopasowanie"], c: 1 },
            { q: "Jeśli w szyfrze litera najczęściej występująca to X, to odpowiada prawdopodobnie:", a: ["A", "O", "E", "T"], c: 2 },
            { q: "Co przedstawia histogram?", a: ["losowość", "częstotliwość liter", "klucze szyfru", "długość wiadomości"], c: 1 },
            { q: "Czy analiza częstości działa na szyfr Cezara?", a: ["Tak", "Nie", "Tylko przy kluczu > 10", "Tylko przy kluczu parzystym"], c: 0 },
            { q: "Tekst z równymi częstotliwościami liter:", a: ["ułatwia łamanie szyfru", "jest łatwy do przeczytania", "ukrywa strukturę języka", "zwiększa entropię alfabetu"], c: 2 },
            { q: "Szyfr Vigenère’a z długim losowym kluczem jest odporny, bo:", a: ["zmienia alfabet", "ukrywa statystykę", "daje krótszy tekst", "usuwa diakrytyki"], c: 1 },
            { q: "Jaki szyfr można złamać analizą częstości?", a: ["Rail Fence", "Monoalfabetyczny", "permutacyjny blokowy", "Enigma"], c: 1 }
        ],

        "Prosty model Enigmy": [
            { q: "Ile kroków wykona rotor po wpisaniu DOG?", a: ["1", "2", "3", "26"], c: 2 },
            { q: "Co dzieje się po odbiciu od reflektora?", a: ["sygnał wraca", "sygnał się kończy", "zmienia alfabet", "sygnał zostaje skasowany"], c: 0 },
            { q: "Jaka jest funkcja rotorów?", a: ["zamieniają litery na cyfry", "zmieniają drogę sygnału w zależności od pozycji", "trzymają klucz publiczny", "odczytują hasło"], c: 1 },
            { q: "Co oznacza ustawienie A–A–A?", a: ["rotory w pozycji 0", "klucz = AAA", "reflektor wyłączony", "brak obrotu rotorów"], c: 0 },
            { q: "Jeśli rotor ma 26 pozycji, po ilu krokach wróci do A?", a: ["25", "1", "24", "26"], c: 3 },
            { q: "Co robi reflektor?", a: ["zatrzymuje sygnał", "odbija go inną drogą", "zamienia sygnał na liczbę", "powiela sygnał"], c: 1 },
            { q: "Czy Enigma szyfruje symetrycznie?", a: ["Tak", "Nie", "Tylko przy reflektorze typu B", "Tylko przy kluczu parzystym"], c: 0 },
            { q: "Co zmienia każdy klawisz?", a: ["ustawienie reflektora", "długość klucza", "pozycję rotorów", "alfabet"], c: 2 },
            { q: "Jaki element NIE występuje w Enigmie?", a: ["rotory", "reflektor", "klucz publiczny", "plugboard"], c: 2 },
            { q: "Po zaszyfrowaniu jednej litery rotory:", a: ["obracają się", "resetują", "losują pozycję", "wyłączają reflektor"], c: 0 }
        ]
    }
};


document.addEventListener("DOMContentLoaded", () => {
    const quizContainer = document.getElementById("quiz-container");
    const quizTitle = document.getElementById("quiz-title");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const currentQuestionEl = document.getElementById("current-question");
    const totalQuestionsEl = document.getElementById("total-questions");
    const progressFill = document.getElementById("progress-fill");
    const prevBtn = document.getElementById("prev-question");
    const nextBtn = document.getElementById("next-question");
    const submitBtn = document.getElementById("submit-quiz");
    const resultBox = document.getElementById("quiz-result");
    const scoreDisplay = document.getElementById("score-display");
    const scoreMessage = document.getElementById("score-message");
    const restartBtn = document.getElementById("restart-quiz");
    const backBtn = document.getElementById("back-to-categories");
    const specificQuizzes = document.getElementById("specific-quizzes");
    const answersReview = document.getElementById("answers-review");
    const quizQuestions = document.getElementById("quiz-questions");
    const mainQuizCategories = document.querySelector('.main-quiz-categories');
    const quizCloseBtn = document.getElementById("quiz-close");



    let currentQuiz = [];
    let currentIndex = 0;
    let answers = []; // indeksy zaznaczeń użytkownika
    const letters = ["A","B","C","D","E","F"];

    // Obsługa przycisku zamknij
    if (quizCloseBtn) {
        quizCloseBtn.addEventListener("click", () => {
            const quizSection = document.getElementById("quiz");
            if (quizSection) {
                quizSection.classList.remove('active');
                // Opcjonalnie: przejdź do strony głównej
                window.location.hash = 'home';
            }
        });
    }

    // KATEGORIE
    document.querySelectorAll(".quiz-category-card").forEach(card => {
        card.addEventListener("click", () => {
            const type = card.dataset.quiz;
            if (type === "basic") {
                currentQuiz = quizData.basic;
                quizTitle.textContent = "Poziom 1 – Podstawowy";
                startQuiz();
            } else if (type === "advanced") {
                currentQuiz = quizData.advanced;
                quizTitle.textContent = "Poziom 2 – Zaawansowany";
                startQuiz();
            } else if (type === "specific") {
                renderSpecificQuizzes();
            }
        });
    });

    function renderSpecificQuizzes() {
        specificQuizzes.innerHTML = "";
        Object.keys(quizData.specific).forEach(topic => {
            const card = document.createElement("div");
            card.className = "quiz-category-card";
            card.innerHTML = `<h3>${topic}</h3><p>10 pytań</p>`;
            card.addEventListener("click", () => {
                currentQuiz = quizData.specific[topic];
                quizTitle.textContent = "Quiz: " + topic;
                startQuiz();
                specificQuizzes.style.display = "none";
            });
            specificQuizzes.appendChild(card);
        });
        mainQuizCategories.style.display = "none";
        specificQuizzes.style.display = "flex";

        const backToMainBtn = document.createElement("button");
        backToMainBtn.textContent = "← Wróć do głównych quizów";
        backToMainBtn.className = "btn btn-outline";
        backToMainBtn.style.marginTop = "2rem";
        backToMainBtn.addEventListener("click", () => {
            specificQuizzes.style.display = "none";
            mainQuizCategories.style.display = "flex";
        });
        specificQuizzes.appendChild(backToMainBtn);
    }

    function startQuiz() {
        quizContainer.style.display = "block";
        resultBox.style.display = "none";
        answersReview.innerHTML = "";
        currentIndex = 0;
        answers = new Array(currentQuiz.length).fill(null);
        totalQuestionsEl.textContent = currentQuiz.length;
        showQuestion();
    }

    function showQuestion() {
        const q = currentQuiz[currentIndex];
        questionText.textContent = q.q;
        optionsContainer.innerHTML = "";
        q.a.forEach((opt, i) => {
            const div = document.createElement("div");
            div.className = "quiz-option";
            div.innerHTML = `<strong>${letters[i]}.</strong> ${opt}`;
            if (answers[currentIndex] === i) div.classList.add("selected");
            div.addEventListener("click", () => {
                answers[currentIndex] = i;
                // Odśwież podświetlenie bez skakania
                [...optionsContainer.children].forEach((c, idx) => {
                    c.classList.toggle("selected", idx === i);
                });
            });
            optionsContainer.appendChild(div);
        });

        currentQuestionEl.textContent = currentIndex + 1;
        progressFill.style.width = ((currentIndex + 1) / currentQuiz.length * 100) + "%";
        prevBtn.style.display = currentIndex > 0 ? "inline-block" : "none";
        nextBtn.style.display = currentIndex < currentQuiz.length - 1 ? "inline-block" : "none";
        submitBtn.style.display = currentIndex === currentQuiz.length - 1 ? "inline-block" : "none";
    }

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            showQuestion();
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentIndex < currentQuiz.length - 1) {
            currentIndex++;
            showQuestion();
        }
    });

    submitBtn.addEventListener("click", () => {
        console.log("Kliknięto zakończ quiz");
        let score = 0;
        currentQuiz.forEach((q, i) => {
            if (answers[i] === q.c) score++;
        });
        
        scoreDisplay.textContent = `${score} / ${currentQuiz.length}`;
        scoreMessage.textContent = score === currentQuiz.length ? "Perfekcyjnie!" :
        score > currentQuiz.length / 2 ? "Dobra robota!" :"Spróbuj ponownie!";
        
        buildAnswersReview();
        // pokaż wynik, ukryj tylko pytania
        quizQuestions.style.display = "none";
        resultBox.style.display = "block";
    });


    function buildAnswersReview() {
        answersReview.innerHTML = `<h4>Przegląd odpowiedzi</h4>`;
        const list = document.createElement("div");

        currentQuiz.forEach((q, i) => {
            const userIdx = answers[i];
            const correctIdx = q.c;

            const item = document.createElement("div");
            item.className = `answer-item ${userIdx === correctIdx ? 'correct' : 'incorrect'}`;
            item.innerHTML = `
                <div class="question-title">Pytanie ${i+1}: ${q.q}</div>
                <div class="answer-row">
                    <div><span class="label">Twoja odpowiedź:</span>
                        ${userIdx != null ? `<span class="answer-badge">${letters[userIdx]}.</span> ${q.a[userIdx]}` : `<em>brak wyboru</em>`}
                    </div>
                    <div><span class="label">Poprawna odpowiedź:</span>
                        <span class="answer-badge">${letters[correctIdx]}.</span> ${q.a[correctIdx]}
                    </div>
                </div>
            `;
            // kliknięcie przenosi do pytania (odnośnik)
            item.addEventListener("click", () => {
                resultBox.style.display = "none";
                quizContainer.style.display = "block";
                currentIndex = i;
                showQuestion();
                // podświetl wybraną odpowiedź po powrocie
                if (answers[i] != null) {
                    [...optionsContainer.children].forEach((c, idx) => {
                        c.classList.toggle("selected", idx === answers[i]);
                    });
                }
                window.scrollTo({ top: quizContainer.offsetTop - 80, behavior: 'smooth' });
            });

            list.appendChild(item);
        });

        answersReview.appendChild(list);
    }

    restartBtn.addEventListener("click", startQuiz);
    backBtn.addEventListener("click", () => {
        quizContainer.style.display = "none";
        resultBox.style.display = "none";
         mainQuizCategories.style.display = "flex";
        specificQuizzes.style.display = "none";
    });
});
