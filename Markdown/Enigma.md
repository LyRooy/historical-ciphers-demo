# Enigma --- Dokumentacja użytkownika

Opis działania

Enigma to elektromechaniczna maszyna szyfrująca używana w pierwszej
połowie XX wieku.\
Szyfrowanie opiera się na kombinacji wirników, reflektora oraz tablicy
połączeń (steckera), które wspólnie tworzą złożony system podstawień.\
Każde naciśnięcie klawisza powoduje przejście sygnału przez zestaw
wirników, odbicie w reflektorze i powrót tą samą drogą z inną trasą, co
generuje zaszyfrowaną literę.\
Po każdym znaku co najmniej jeden wirnik wykonuje obrót, zmieniając
konfigurację układu i czyniąc szyfr trudnym do przewidzenia.

Klucz

-   Klucz składa się z trzech głównych elementów: wyboru wirników, ich
    kolejności oraz ich pozycji startowej.\
-   Dodatkowo konfiguracja steckera (tablicy połączeń) stanowi ważną
    część ustawień.\
-   W typowych rekonstrukcjach Enigmy elementy klucza obejmują:
    -   numery i kolejność trzech wirników,\
    -   ustawienia pierścieni (Ringstellung),\
    -   pozycje startowe wirników (Grundstellung),\
    -   pary zamian liter w steckerze.\
-   Do odszyfrowania konieczne jest użycie dokładnie tej samej
    konfiguracji.

Zastosowanie

-   Nauka kryptografii historycznej.\
-   Symulacje maszyn szyfrujących.\
-   Projekty edukacyjne dotyczące II wojny światowej.\
-   Zrozumienie różnic między szyframi mechanicznymi a współczesną
    kryptografią cyfrową.

Zasady użytkowania

-   Wprowadź tekst jawny lub szyfrogram.\
-   Wybierz typ maszyny (np. Enigma I, Enigma M3, Enigma M4 --- zależnie
    od programu).\
-   Ustaw kolejność wirników oraz ich pozycje startowe.\
-   Skonfiguruj ustawienia pierścieni.\
-   Podaj pary zamian liter w steckerze.\
-   Wybierz tryb szyfrowania lub odszyfrowania.\
-   Uruchom proces, po którym wynik pojawi się w polu wyjściowym
    programu.

Eksport wyników — co się eksportuje 
- Tylko wyniki szyfrowania/odszyfrowywania.
- Metadane: typ operacji, szyfr, timestamp.
- Tekst wejściowy i tekst wynikowy.
- Ustawienia maszyny (order, grundstellung, ringstellung, plugboard).
- Wizualizacja krok‑po‑kroku Enigmy 
- Analiza częstości: nie dotyczy Enigmy (dotyczy głównie Cezara/Vigenère) — nie jest standardowo dołączana.

Jak wyeksportować (użytkownik)
- Wykonaj szyfrowanie/odszyfrowanie w aplikacji.  
- W sekcji „Wynik”:
   - kliknij „Eksport TXT” → pobierze się plik `.txt` z raportem (tekst, ustawienia, wynik, ewentualna wizualizacja w formie opisowej),
   - kliknij „Eksport PDF” → aplikacja spróbuje zrobić snapshot wizualizacji (html2pdf). Jeśli snapshot się nie powiedzie, powstanie prosty PDF tekstowy (fallback),
   - lub kliknij ikonę kopiowania, by skopiować wynik do schowka.  

Dodatkowe wskazówki

-   Enigma nie szyfruje znaków spoza alfabetu łacińskiego A--Z, dlatego
    przed szyfrowaniem należy usunąć lub zastąpić spacje, cyfry i znaki
    specjalne.\
-   W aplikacjach można dodać kreator konfiguracji wirników i steckera,
    co ułatwia pracę użytkownikowi.\
-   Pliki .txt są najłatwiejsze do archiwizacji i wymiany danych.\
-   Nawet niewielka zmiana w konfiguracji powoduje całkowicie inne
    szyfrowanie.

Podsumowanie

Enigma to jeden z najbardziej znanych szyfrów w historii.\
Dzięki rekonstrukcjom i symulatorom użytkownik może poznać działanie
złożonych szyfrów mechanicznych oraz zapisywać wyniki w plikach
tekstowych, co ułatwia analizę i dalszą pracę.
