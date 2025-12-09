/* md-pages.js
   Embedded markdown contents used during development
   This file contains strings (raw markdown) for pages used by the app's docs panel.
   Similar idea to quizes.js — simple static data included at build time (no fetch required).
*/

const mdPages = {
    USER_GUIDE: `# Instrukcja obsługi aplikacji

## 1. Uruchomienie
- Otwórz stronę aplikacji (np. przez GitHub Pages lub \`index.html\` lokalnie).

## 2. Wprowadzanie danych
- Kliknij przycisk "rozpocznij naukę"
- Wybierz szyfr i wprowadź wymagane parametry (np. przesunięcie lub klucz).
- Wpisz tekst jawny.
- Kliknij **Szyfruj** lub **Deszyfruj**.

## 3. Wizualizacja
- Obserwuj animację krok po kroku.

## 4. Eksport wyników
- Możesz pobrać wynik jako PDF lub TXT .

## 5. Tryb quizów
- Wybierz „Quizy” z menu.
- Rozwiąż zadania i sprawdź odpowiedzi.
`,

    README: `# Informacje o projekcie

## Cel projektu:

Głównym celem projektu jest stworzenie aplikacji webowej, która:
- umożliwia interaktywne szyfrowanie i deszyfrowanie tekstu przy użyciu klasycznych algorytmów,
- oferuje wizualizacje edukacyjne procesu przekształcania danych,
- pozwala użytkownikowi eksperymentować z różnymi parametrami (klucz, przesunięcie, ustawienia rotorów),
- zawiera materiały edukacyjne i quizy, które pomagają w utrwaleniu wiedzy,
- prezentuje analizę częstości w kontekście łamania szyfrów historycznych


## Zakres funkcjonalny:

Aplikacja oferuje następujące funkcje:
- Wprowadzanie tekstu jawnego oraz klucza (w zależności od rodzaju szyfru).
- Wybór algorytmu szyfrowania i ustawień parametrów (np. przesunięcie dla szyfru Cezara, klucz słowny dla Vigenère’a, konfiguracja rotorów w uproszczonej Enigmie).
- Wizualizację krok-po-kroku procesu szyfrowania i deszyfrowania, z wykorzystaniem interaktywnych elementów (np. tabele podstawień, schematy rotacji rotorów, animacje płotowe).
- Porównanie tekstu jawnego z szyfrogramem oraz możliwość eksportu wyników do pliku.
- Zestaw ćwiczeń i quizów edukacyjnych wspomagających naukę kryptografii.


## W aplikacji zaimplementowano cztery szyfry:

- Szyfr Cezara – prosty szyfr przesunięciowy, idealny do wprowadzenia w temat kryptografii.
- Szyfr Vigenère’a – klasyczny przykład szyfru polialfabetycznego, pokazujący, jak zwiększenie złożoności utrudnia analizę częstości.
- Szyfr płotowy (Rail Fence) – szyfr transpozycyjny, wizualizowany za pomocą animowanego układu znaków w postaci „płotu”.
- Uproszczony model Enigmy – najbardziej zaawansowany element projektu, przedstawiający działanie rotorów i odwracalność procesu szyfrowania.


## Bezpieczeństwo:

Ze względu na charakter edukacyjny, zastosowane implementacje szyfrów mają charakter demonstracyjny i nie są przeznaczone do rzeczywistych zastosowań ochrony danych.

## Znaczenie projektu:

Projekt stanowi połączenie zagadnień z zakresu kryptografii klasycznej, programowania webowego i wizualizacji danych.
Jego walorem jest nie tylko aspekt techniczny (implementacja i testowanie algorytmów), lecz także dydaktyczny. Aplikacja może być wykorzystywana jako narzędzie pomocnicze w nauce kryptografii lub informatyki teoretycznej.


## Projekt rozłożono na 12 tygodni, obejmujących kolejne etapy tworzenia aplikacji:

- od utworzenia repozytorium i szkieletu projektu,
- przez implementację czterech szyfrów,
- po testy, dokumentację, eksport wyników i quizy edukacyjne,
- aż do finalnej publikacji aplikacji na GitHub Pages.

## Podsumowanie

Projekt „Implementacja klasycznych szyfrów w aplikacji webowej” łączy elementy historii, matematyki i programowania w spójną, interaktywną formę. 
Dzięki zastosowaniu nowoczesnych technologii webowych oraz przemyślanej wizualizacji, umożliwia użytkownikowi praktyczne poznanie zasad działania dawnych szyfrów.
`,

    SECURITY_POLICY: `# Polityka bezpieczeństwa aplikacji

## Cel
Celem jest zapewnienie bezpieczeństwa danych oraz poprawnego działania aplikacji, która umożliwia użytkownikom rozwiązywanie quizów i pracę z tekstem.

## Zasady bezpieczeństwa danych
- Użytkownik powinien podawać tylko treści związane z aplikacją (bez kodu lub linków zewnętrznych).
- Aplikacja ogranicza długość danych wpisywanych do pól tekstowych, aby zapobiec przeciążeniu systemu.
- Dane użytkownika nie są udostępniane osobom trzecim.

## Ochrona przed błędami i atakami
- Tekst wpisywany przez użytkownika jest sprawdzany, aby nie zawierał kodu, który mógłby zmienić działanie aplikacji.
- Dane są przetwarzane jako zwykły tekst (bez możliwości wykonania kodu).
- Przy zapisie plików stosowane są bezpieczne nazwy i formaty (np. .txt).

## Aktualizacje i testy
- Aplikacja będzie regularnie testowana pod kątem błędów i działania funkcji.
- Aktualizacje zabezpieczeń będą wykonywane w miarę potrzeb.

## Kontakt
Jeśli użytkownik zauważy błąd lub problem z bezpieczeństwem, prosimy o zgłoszenie tego poprzez napisanie maila.`,

    Analiza_częstości_i_słabości_klasycznych_szyfrów: ` ## 1. Na czym polega analiza częstości?

Analiza częstości polega na sprawdzaniu, jak często występują litery i
ich kombinacje w szyfrogramie, a potem porównaniu tego z typowymi
statystykami języka. Ponieważ język naturalny nie jest losowy, jego
rozkład liter jest dość stabilny w języku polskim np. A, I, O i E są bardzo
częste, a litery typu Ń, Ó, Ź prawie nie występują.

Szyfry, które nie zmieniają rozkładu liter (np. Cezar, podstawieniowe,
transpozycyjne), można łatwo złamać, bo najczęstsza litera szyfrogramu
prawie zawsze odpowiada najczęstszej literze języka. Przy dłuższych
tekstach dopasowanie jest jeszcze bardziej oczywiste.

Oprócz pojedynczych liter można patrzeć też na najczęstsze dwuznaki i
trójznaki, co pomaga w łamaniu bardziej złożonych szyfrów
podstawieniowych.

Metoda przestaje działać, kiedy szyfr miesza alfabet przy każdej literze
(np. Vigenère po ustaleniu długości klucza daje się złamać, ale przy
nieznanej długości mocno zaciera statystyki), a zupełnie bezużyteczna
jest przy szyfrach typu Enigma czy nowoczesnych, gdzie struktura języka
zostaje kompletnie ukryta.

Co oznacza "chi²" w wynikach ?

"chi²" to skrót od statystyki chi‑kwadrat (χ²).
W analizie częstości porównujemy obserwowane rozkłady liter w szyfrogramie z oczekiwanym rozkładem liter w języku polskim. Chi‑kwadrat mierzy, jak bardzo obserwacje (liczby liter w szyfrogramie) różnią się od oczekiwanych wartości.
Niższa wartość χ² oznacza lepsze dopasowanie, czyli większe prawdopodobieństwo, że dana hipoteza (tu: konkretny przesunięcie/klucz) daje tekst o rozkładzie zbliżonym do naturalnego języka.


## 2. Słabości szyfru Cezara

**Typ:** prosty szyfr podstawieniowy z jednym przesunięciem.

 Dlaczego łatwo go złamać?

-   Zachowuje częstości liter.
-   Klucz ma małą przestrzeń (kilkadziesiąt możliwych przesunięć).

Typowe ataki:

-   Atak brute force.
-   Analiza częstości.

## 3. Słabości szyfru Vigenère'a

**Typ:** szyfr polialfabetyczny.

Dlaczego jest słaby?

-   Powtarzający się klucz tworzy okresowość.
-   Po ustaleniu długości klucza szyfr redukuje się do kilku szyfrów
    Cezara.

Typowe metody łamania:

-   Test Kasiski.
-   Indeks koincydencji.
-   Analiza częstości na kolumnach odpowiadających kolejnym literom
    klucza.

## 4. Słabości szyfru płotowego 

**Typ:** szyfr transpozycyjny.

Dlaczego jest słaby?

-   Nie zmienia częstości liter.
-   Klucz (liczba szyn) można brute-forcować.

Metody łamania:

-   Brute force liczby poziomów.
-   Dopasowanie tekstu do wzorca sinusoidalnego.

## 5. Słabości Enigmy

Konstrukcyjne słabości:

-   Litera nie może zaszyfrować się w samą siebie.
-   Deterministyczny ruch rotorów.
-   Symetryczność szyfrowania i deszyfrowania.

Słabości praktyczne:

-   Powtarzanie kluczy dziennych.
-   Procedury operatorów.
-   Typowe frazy umożliwiające dopasowania (criby).

Metody łamania:

-   Bomba Turinga.
-   Analiza cribów.
-   Analiza permutacji rotorów i reflektora.

`,

    Szyfr_Cezara: `

Opis działania: Szyfr Cezara polega na przesunięciu liter tekstu jawnego o ustaloną liczbę miejsc w alfabecie. Każda litera zostaje zastąpiona inną, znajdującą się dalej lub wcześniej w alfabecie, zgodnie z wartością klucza.

Klucz:

 -   Klucz to liczba określająca, o ile miejsc w alfabecie przesuwane są litery.
 -   Dla przykładu, klucz = 3 oznacza przesunięcie o trzy litery w prawo.
 -   Dla odszyfrowania tekstu używa się klucza ujemnego (np. -3 zamiast 3).

Zastosowanie: Szyfr Cezara można wykorzystać do:

 -   nauki podstaw kryptografii,
 -   prostego ukrywania treści w ćwiczeniach edukacyjnych,
 -   eksperymentów z alfabetami i przesunięciami znaków.

Zasady użytkowania:

    1. Wprowadź tekst, który chcesz zaszyfrować lub odszyfrować.
    2. Wybierz wartość klucza (np. 1–25 dla alfabetu łacińskiego lub 1-35 dla alfabetu polskiego).
    3. Ustal, czy mają być zachowane duże litery i znaki interpunkcyjne.
    4. Uruchom proces szyfrowania lub odszyfrowania.

Wynik pojawi się w polu wyjściowym programu lub w oknie podglądu.

PROSTY EKSPORT DO PLIKU TEKSTOWEGO

Co aplikacja eksportuje

    Tylko wyniki szyfrowania / odszyfrowywania oraz powiązane dane:
    -    metadane (typ operacji, nazwa szyfru, timestamp),
    -    tekst wejściowy i tekst wynikowy,
    -    ustawienia szyfru (np. przesunięcie),
    -    wizualizacja krok‑po‑kroku (jeśli została wygenerowana),
    -    analiza częstości (TylKO jeśli użytkownik ją uruchomił przed eksportem).

Gdzie znajduje się eksport w projekcie

  -  Logika eksportu: export.js
  -  Dane do eksportu pobierane są z window.getLastAction() (ustawiane przez script.js).

Jak wyeksportować wynik (instrukcja użytkownika)

  -  Wykonaj operację w aplikacji:
  -  wybierz szyfr Cezara,
  -  wprowadź tekst i ustaw klucz,
  -  kliknij „Zaszyfruj” lub „Odszyfruj”.
  -  (Opcjonalnie) Jeśli chcesz, aby raport zawierał analizę częstości:
  -  kliknij przycisk „Dokonaj analizy częstości” w panelu Wynik.
  -  W sekcji „Wynik”:
  -  kliknij „Eksport TXT” — pobierze się plik .txt zawierający raport (tekst, ustawienia, opcjonalnie kroki i analiza),
  -  kliknij „Eksport PDF” — aplikacja spróbuje wygenerować PDF zawierający snapshot wizualizacji (jeżeli dostępna). Jeśli snapshot się nie uda, PDF powstanie jako prosty dokument tekstowy (fallback),

DODATKOWE WSKAZÓWKI

    Dla uproszczenia można przygotować formularz z polem tekstowym, miejscem na wpisanie klucza i przyciskiem „Zapisz wynik”.
    Wynik można także kopiować bezpośrednio do schowka.
    Pliki zapisane w formacie .txt są najprostsze do przenoszenia i udostępniania między użytkownikami.

PODSUMOWANIE Szyfr Cezara to doskonałe narzędzie dydaktyczne. Dzięki prostocie algorytmu użytkownik może w prosty sposób eksperymentować z szyfrowaniem, a funkcja eksportu do pliku tekstowego pozwala łatwo zachować lub udostępnić efekty pracy.

`,

    Szyfr_Vigenère: `

Opis działania

Szyfr Vigenère'a to metoda szyfrowania, w której każda litera tekstu jawnego jest przesuwana o wartość wynikającą z odpowiadającej jej litery klucza. Klucz powtarza się cyklicznie, dopasowując długość do tekstu. Przesunięcia wynikają z liter klucza: - A = 0 - B = 1 - C = 2 - ... - Z = 25

Klucz

  -  Klucz stanowi dowolny ciąg liter, np. TAJNE, KLUCZ, VIGENERE.
  -  Każda litera klucza określa przesunięcie w alfabecie.
  -  Klucz powtarza się tak długo, aż pokryje cały tekst.
  -  Do odszyfrowania używa się tego samego klucza, lecz przesunięcia wykonuje się w przeciwnym kierunku.

Zastosowanie

  -  Nauka kryptografii.
  -  Ukrywanie treści w ćwiczeniach edukacyjnych.
  -  Eksperymentowanie z alfabetem i zmiennymi przesunięciami.
  -  Prezentacja szyfrowania polialfabetycznego.

Zasady użytkowania

  -  Wprowadź tekst do zaszyfrowania lub odszyfrowania.
  -  Podaj klucz składający się z liter.
  -  Wybierz tryb: szyfrowanie lub odszyfrowanie.
  -  Zdecyduj, czy zachować wielkość liter, polskie znaki oraz interpunkcję.
  -  Uruchom proces i odczytaj wynik w polu wyjściowym programu.

Eksport wyników

  -  Eksport dotyczy WYŁĄCZNIE wyników szyfrowania/odszyfrowywania.
  -  Co trafia do eksportu:
     -   metadane (operacja, szyfr, timestamp),
     -   tekst wejściowy i wynik,
     -   ustawienia (użyty klucz),
     -   wizualizacja krok‑po‑kroku (jeśli wygenerowana)
     -   analiza częstości (DOŁĄCZANA TYLKO JEŚLI użytkownik ją kliknął przed eksportem).
  -  Implementacja: export.js (przyciski #export-txt, #export-pdf). Dane pobierane z window.getLastAction() (z script.js).

Jak wyeksportować (użytkownik)

  -  Zaszyfruj/odszyfruj tekst.
  -  (Opcjonalnie) Kliknij „Dokonaj analizy częstości” → wtedy analiza zostanie zapisana i dołączona do eksportu.
    W sekcji Wynik:
     -   Kliknij Eksport TXT → pobierze się plik .txt z raportem.
     -   Kliknij Eksport PDF → aplikacja spróbuje snapshotu wizualizacji (html2pdf); jeśli nie, użyje prostego PDF (jsPDF).

Dodatkowe wskazówki

  -  W aplikacjach można dodać pola: tekst wejściowy, klucz, tryb pracy i przycisk „Zapisz wynik".
  -  Wynik może być kopiowany automatycznie do schowka.
  -  Najwygodniejszym formatem eksportu jest plik .txt.
  -  Klucz powinien składać się wyłącznie z liter.

Podsumowanie

Szyfr Vigenère'a to prosta i czytelna metoda szyfrowania polialfabetycznego. Dzięki możliwości eksportowania wyniku do pliku proces pracy staje się wygodny i przejrzysty.
`,

    Szyfr_Płotowy: `

Opisz działania

Szyfr płotowy (Rail Fence Cipher) to metoda szyfrowania transpozycyjnego, w której tekst zapisywany jest naprzemiennie w kolejnych wierszach, tworząc wzór zygzakowaty przypominający płot lub ogrodzenie.
Po zapisaniu tekstu w wybranej liczbie poziomów (szyn), odczytuje się go wierszami, co daje zaszyfrowaną wiadomość.

Przykład przy dwóch poziomach:
Litery tekstu zapisywane są kolejno „górą" i „dołem", a następnie odczytywane wierszami.

Klucz

  -  Kluczem jest liczba poziomów (szyn), zwykle od 2 wzwyż.\
  -  Większa liczba szyn tworzy bardziej skomplikowany wzór zygzaka.\
  -  Aby odszyfrować wiadomość, należy użyć tej samej liczby poziomów, co podczas szyfrowania.

Zastosowanie

  -  Nauka podstaw szyfrów transpozycyjnych.\
  -  Proste zadania edukacyjne.\
  -  Prezentacja różnic między szyfrowaniem podstawieniowym a transpozycyjnym.\
  -  Eksperymenty z liczbą poziomów i strukturą tekstu.

Zasady użytkowania

  -  Wprowadź tekst jawny.\
  -  Podaj liczbę poziomów (szyn), np. 2--10.\
  -  Wybierz tryb: szyfrowanie lub odszyfrowanie.\
  -  Zdecyduj, czy zachować wielkość liter i znaki interpunkcyjne.\
  -  Uruchom proces i odczytaj wynik w polu wyjściowym programu.

Eksport do pliku

  -  W projekcie eksport obsługuje tylko wyniki szyfrowania/odszyfrowywania.
  -  Dostępne formy eksportu (sekcja „Wynik”):
  -  Eksport TXT — pobiera plik tekstowy z raportem: metadane (typ operacji, szyfr, data), tekst wejściowy, ustawienia (np. liczba szyn, offset), wynik oraz opis wizualizacji (jeśli wygenerowano).
  -  Eksport PDF — próbuje wykonać snapshot wizualizacji i zapisać go jako PDF (biblioteka html2pdf). Jeśli snapshot nie jest możliwy → fallback do prostego PDF‑u tekstowego (jsPDF).

Jak wyeksportować (użytkownik)

  -  Zaszyfruj/odszyfruj tekst w aplikacji.
  -  (Opcjonalnie) Wygeneruj wizualizację, jeśli chcesz mieć ją w raporcie.
    W sekcji „Wynik”:
     -   Kliknij Eksport TXT — pobierze plik .txt z raportem.
     -   Kliknij Eksport PDF — wygeneruje PDF (snapshot UI jeśli dostępny).
     -   Kliknij ikonę kopiowania, aby skopiować wynik do schowka.

Dodatkowe wskazówki

  -  Formularz może zawierać: pole tekstowe, pole liczby poziomów, wybór trybu działania oraz przycisk „Zapisz wynik".\
  -  Wynik można kopiować bezpośrednio do schowka.\
  -  Pliki .txt są najprostszym formatem do udostępniania.\
  -  Liczba szyn nie powinna być większa niż długość tekstu.

Podsumowanie

Szyfr płotowy to prosty szyfr transpozycyjny oparty na układaniu tekstu w zygzak.
Dzięki możliwości zapisu wyników do plików tekstowych użytkownik może łatwo archiwizować i udostępniać efekty swojej pracy.
`,

    Uproszczony_model_Enigmy: `

Opis działania

Enigma to elektromechaniczna maszyna szyfrująca używana w pierwszej połowie XX wieku.
Szyfrowanie opiera się na kombinacji wirników, reflektora oraz tablicy połączeń (steckera), które wspólnie tworzą złożony system podstawień.
Każde naciśnięcie klawisza powoduje przejście sygnału przez zestaw wirników, odbicie w reflektorze i powrót tą samą drogą z inną trasą, co generuje zaszyfrowaną literę.
Po każdym znaku co najmniej jeden wirnik wykonuje obrót, zmieniając konfigurację układu i czyniąc szyfr trudnym do przewidzenia.

Klucz

  -  Klucz składa się z trzech głównych elementów: wyboru wirników, ich kolejności oraz ich pozycji startowej.
  -  Dodatkowo konfiguracja steckera (tablicy połączeń) stanowi ważną część ustawień.
  -  W typowych rekonstrukcjach Enigmy elementy klucza obejmują:
      -  numery i kolejność trzech wirników,
      -  ustawienia pierścieni (Ringstellung),
      -  pozycje startowe wirników (Grundstellung),
      -  pary zamian liter w steckerze.
  -  Do odszyfrowania konieczne jest użycie dokładnie tej samej konfiguracji.

Zastosowanie

  -  Nauka kryptografii historycznej.
  -  Symulacje maszyn szyfrujących.
  -  Projekty edukacyjne dotyczące II wojny światowej.
  -  Zrozumienie różnic między szyframi mechanicznymi a współczesną kryptografią cyfrową.

Zasady użytkowania

  -  Wprowadź tekst jawny lub szyfrogram.
  -  Wybierz typ maszyny (np. Enigma I, Enigma M3, Enigma M4 --- zależnie od programu).
  -  Ustaw kolejność wirników oraz ich pozycje startowe.
  -  Skonfiguruj ustawienia pierścieni.
  -  Podaj pary zamian liter w steckerze.
  -  Wybierz tryb szyfrowania lub odszyfrowania.
  -  Uruchom proces, po którym wynik pojawi się w polu wyjściowym programu.

Eksport wyników — co się eksportuje

  -  Tylko wyniki szyfrowania/odszyfrowywania.
  -  Metadane: typ operacji, szyfr, timestamp.
  -  Tekst wejściowy i tekst wynikowy.
  -  Ustawienia maszyny (order, grundstellung, ringstellung, plugboard).
  -  Wizualizacja krok‑po‑kroku Enigmy
  -  Analiza częstości: nie dotyczy Enigmy (dotyczy głównie Cezara/Vigenère) — nie jest standardowo dołączana.

Jak wyeksportować (użytkownik)

  -  Wykonaj szyfrowanie/odszyfrowanie w aplikacji.
    W sekcji „Wynik”:
      -  kliknij „Eksport TXT” → pobierze się plik .txt z raportem (tekst, ustawienia, wynik, ewentualna wizualizacja w formie opisowej),
      -  kliknij „Eksport PDF” → aplikacja spróbuje zrobić snapshot wizualizacji (html2pdf). Jeśli snapshot się nie powiedzie, powstanie prosty PDF tekstowy (fallback),

Dodatkowe wskazówki

  -  Enigma nie szyfruje znaków spoza alfabetu łacińskiego A--Z, dlatego przed szyfrowaniem należy usunąć lub zastąpić spacje, cyfry i znaki specjalne.
  -  W aplikacjach można dodać kreator konfiguracji wirników i steckera, co ułatwia pracę użytkownikowi.
  -  Pliki .txt są najłatwiejsze do archiwizacji i wymiany danych.
  -  Nawet niewielka zmiana w konfiguracji powoduje całkowicie inne szyfrowanie.

Podsumowanie

Enigma to jeden z najbardziej znanych szyfrów w historii.
Dzięki rekonstrukcjom i symulatorom użytkownik może poznać działanie złożonych szyfrów mechanicznych oraz zapisywać wyniki w plikach tekstowych, co ułatwia analizę i dalszą pracę.
`
};

// simple export so other scripts can reference mdPages from window
window.mdPages = mdPages;
