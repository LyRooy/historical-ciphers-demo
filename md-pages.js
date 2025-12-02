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

    README: `# historical-ciphers-demo

Cel projektu:
Głównym celem projektu jest stworzenie aplikacji webowej, która:
-umożliwia interaktywne szyfrowanie i deszyfrowanie tekstu przy użyciu klasycznych algorytmów,
-oferuje wizualizacje edukacyjne procesu przekształcania danych,
-pozwala użytkownikowi eksperymentować z różnymi parametrami (klucz, przesunięcie, ustawienia rotorów),
-zawiera materiały edukacyjne i quizy, które pomagają w utrwaleniu wiedzy,
-prezentuje analizę częstości w kontekście łamania szyfrów historycznych


Zakres funkcjonalny:
*Aplikacja oferuje następujące funkcje:
-Wprowadzanie tekstu jawnego oraz klucza (w zależności od rodzaju szyfru).
-Wybór algorytmu szyfrowania i ustawień parametrów (np. przesunięcie dla szyfru Cezara, klucz słowny dla Vigenère’a, konfiguracja rotorów w uproszczonej Enigmie).
-Wizualizację krok-po-kroku procesu szyfrowania i deszyfrowania, z wykorzystaniem interaktywnych elementów (np. tabele podstawień, schematy rotacji rotorów, animacje płotowe).
-Porównanie tekstu jawnego z szyfrogramem oraz możliwość eksportu wyników do pliku.
-Zestaw ćwiczeń i quizów edukacyjnych wspomagających naukę kryptografii.


W aplikacji zaimplementowano cztery szyfry:
Szyfr Cezara – prosty szyfr przesunięciowy, idealny do wprowadzenia w temat kryptografii.
Szyfr Vigenère’a – klasyczny przykład szyfru polialfabetycznego, pokazujący, jak zwiększenie złożoności utrudnia analizę częstości.
Szyfr płotowy (Rail Fence) – szyfr transpozycyjny, wizualizowany za pomocą animowanego układu znaków w postaci „płotu”.
Uproszczony model Enigmy – najbardziej zaawansowany element projektu, przedstawiający działanie rotorów i odwracalność procesu szyfrowania.


Bezpieczeństwo:
Ze względu na charakter edukacyjny, zastosowane implementacje szyfrów mają charakter demonstracyjny i nie są przeznaczone do rzeczywistych zastosowań ochrony danych.

Znaczenie projektu:
Projekt stanowi połączenie zagadnień z zakresu kryptografii klasycznej, programowania webowego i wizualizacji danych.
Jego walorem jest nie tylko aspekt techniczny (implementacja i testowanie algorytmów), lecz także dydaktyczny — aplikacja może być wykorzystywana jako narzędzie pomocnicze w nauce kryptografii lub informatyki teoretycznej.


Projekt rozłożono na 12 tygodni, obejmujących kolejne etapy tworzenia aplikacji:
-od utworzenia repozytorium i szkieletu projektu,
-przez implementację czterech szyfrów,
-po testy, dokumentację, eksport wyników i quizy edukacyjne,
-aż do finalnej publikacji aplikacji na GitHub Pages.

Podsumowanie
Projekt „Implementacja klasycznych szyfrów w aplikacji webowej” łączy elementy historii, matematyki i programowania w spójną, interaktywną formę. Dzięki zastosowaniu nowoczesnych technologii webowych oraz przemyślanej wizualizacji, umożliwia użytkownikowi praktyczne poznanie zasad działania dawnych szyfrów.
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

    Analiza_częstości_i_słabości_klasycznych_szyfrów: `1. Na czym polega analiza częstości?

Analiza częstości polega na sprawdzaniu, jak często występują litery i
ich kombinacje w szyfrogramie, a potem porównaniu tego z typowymi
statystykami języka. Ponieważ język naturalny nie jest losowy, jego
rozkład liter jest dość stabilny --- w polskim np. A, I, O i E są bardzo
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

2. Słabości szyfru Cezara

**Typ:** prosty szyfr podstawieniowy z jednym przesunięciem.

 Dlaczego łatwo go złamać?

-   Zachowuje częstości liter.
-   Klucz ma małą przestrzeń (kilkadziesiąt możliwych przesunięć).

Typowe ataki:

-   Atak brute force.
-   Analiza częstości.

3. Słabości szyfru Vigenère'a

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

4. Słabości szyfru płotowego 

**Typ:** szyfr transpozycyjny.

Dlaczego jest słaby?

-   Nie zmienia częstości liter.
-   Klucz (liczba szyn) można brute-forcować.

Metody łamania:

-   Brute force liczby poziomów.
-   Dopasowanie tekstu do wzorca sinusoidalnego.

5. Słabości Enigmy

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

    Szyfr_Cezara: `Szyfr Cezara — dokumentacja użytkownika i eksport do pliku

Opis działania:
Szyfr Cezara polega na przesunięciu liter tekstu jawnego o ustaloną liczbę miejsc w alfabecie. Każda litera zostaje zastąpiona inną, znajdującą się dalej lub wcześniej w alfabecie, zgodnie z wartością klucza.

Klucz:
- Klucz to liczba określająca, o ile miejsc w alfabecie przesuwane są litery.
- Dla przykładu, klucz = 3 oznacza przesunięcie o trzy litery w prawo.
- Dla odszyfrowania tekstu używa się klucza ujemnego (np. -3 zamiast 3).

Zastosowanie:
Szyfr Cezara można wykorzystać do:
- nauki podstaw kryptografii,
- prostego ukrywania treści w ćwiczeniach edukacyjnych,
- eksperymentów z alfabetami i przesunięciami znaków.

Zasady użytkowania:
1. Wprowadź tekst, który chcesz zaszyfrować lub odszyfrować.
2. Wybierz wartość klucza (np. 1–25 dla alfabetu łacińskiego lub 1-35 dla alfabetu polskiego).
3. Ustal, czy mają być zachowane duże litery i znaki interpunkcyjne.
4. Uruchom proces szyfrowania lub odszyfrowania.

Wynik pojawi się w polu wyjściowym programu lub w oknie podglądu.

PROSTY EKSPORT DO PLIKU TEKSTOWEGO

Po zakończeniu szyfrowania użytkownik może zapisać wynik w pliku tekstowym, korzystając z prostych kroków:

1. Skopiuj wynik szyfrowania z programu.
2. Otwórz Notatnik lub inny edytor tekstu.
3. Wklej zaszyfrowany tekst.
4. Wybierz „Plik” → „Zapisz jako…”.
5. Wpisz nazwę pliku, np. wynik_cezara.txt.
6. Wybierz kodowanie UTF-8, aby zachować polskie znaki.
7. Kliknij „Zapisz”.

Po zapisaniu pliku można go ponownie otworzyć w Notatniku, aby zobaczyć lub skopiować zaszyfrowany tekst.

DODATKOWE WSKAZÓWKI
- Dla uproszczenia można przygotować formularz z polem tekstowym, miejscem na wpisanie klucza i przyciskiem „Zapisz wynik”.
- Wynik można także kopiować bezpośrednio do schowka.
- Pliki zapisane w formacie .txt są najprostsze do przenoszenia i udostępniania między użytkownikami.

PODSUMOWANIE
Szyfr Cezara to doskonałe narzędzie dydaktyczne. Dzięki prostocie algorytmu użytkownik może w prosty sposób eksperymentować z szyfrowaniem, a funkcja eksportu do pliku tekstowego pozwala łatwo zachować lub udostępnić efekty pracy.

`,

    VIGENERE: `# Szyfr Vigenère'a --- Dokumentacja użytkownika

Opis działania

Szyfr Vigenère'a to metoda szyfrowania, w której każda litera tekstu
jawnego jest przesuwana o wartość wynikającą z odpowiadającej jej litery
klucza. ... (skrót)
`,

    PLOTOWY: `# Szyfr płotowy --- Dokumentacja użytkownika

Opisz działanie (skrót)...
`,

    ENIGMA: `# Enigma --- Dokumentacja użytkownika

Opis działania

Enigma to elektromechaniczna maszyna szyfrująca... (skrót)
`
};

// simple export so other scripts can reference mdPages from window
window.mdPages = mdPages;
