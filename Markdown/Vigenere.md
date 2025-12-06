# Szyfr Vigenère'a --- Dokumentacja użytkownika

Opis działania

Szyfr Vigenère'a to metoda szyfrowania, w której każda litera tekstu
jawnego jest przesuwana o wartość wynikającą z odpowiadającej jej litery
klucza. Klucz powtarza się cyklicznie, dopasowując długość do tekstu.
Przesunięcia wynikają z liter klucza: - A = 0 - B = 1 - C = 2 - ... - Z
= 25

Klucz

-   Klucz stanowi dowolny ciąg liter, np. TAJNE, KLUCZ, VIGENERE.
-   Każda litera klucza określa przesunięcie w alfabecie.
-   Klucz powtarza się tak długo, aż pokryje cały tekst.
-   Do odszyfrowania używa się tego samego klucza, lecz przesunięcia
    wykonuje się w przeciwnym kierunku.

Zastosowanie

-   Nauka kryptografii.
-   Ukrywanie treści w ćwiczeniach edukacyjnych.
-   Eksperymentowanie z alfabetem i zmiennymi przesunięciami.
-   Prezentacja szyfrowania polialfabetycznego.

Zasady użytkowania

-   Wprowadź tekst do zaszyfrowania lub odszyfrowania.
-   Podaj klucz składający się z liter.
-   Wybierz tryb: szyfrowanie lub odszyfrowanie.
-   Zdecyduj, czy zachować wielkość liter, polskie znaki oraz
    interpunkcję.
-   Uruchom proces i odczytaj wynik w polu wyjściowym programu.

Eksport wyników
- Eksport dotyczy WYŁĄCZNIE wyników szyfrowania/odszyfrowywania.  
- Co trafia do eksportu:
  - metadane (operacja, szyfr, timestamp),
  - tekst wejściowy i wynik,
  - ustawienia (użyty klucz),
  - wizualizacja krok‑po‑kroku (jeśli wygenerowana) 
  - analiza częstości (DOŁĄCZANA TYLKO JEŚLI użytkownik ją **kliknął** przed eksportem).
- Implementacja: `export.js` (przyciski `#export-txt`, `#export-pdf`). Dane pobierane z `window.getLastAction()` (z `script.js`).

Jak wyeksportować (użytkownik)
- Zaszyfruj/odszyfruj tekst.
- (Opcjonalnie) Kliknij „Dokonaj analizy częstości” → wtedy analiza zostanie zapisana i dołączona do eksportu.  
-W sekcji Wynik:
   - Kliknij **Eksport TXT** → pobierze się plik `.txt` z raportem.  
   - Kliknij **Eksport PDF** → aplikacja spróbuje snapshotu wizualizacji (html2pdf); jeśli nie, użyje prostego PDF (jsPDF).  

Dodatkowe wskazówki

-   W aplikacjach można dodać pola: tekst wejściowy, klucz, tryb pracy i
    przycisk „Zapisz wynik".
-   Wynik może być kopiowany automatycznie do schowka.
-   Najwygodniejszym formatem eksportu jest plik .txt.
-   Klucz powinien składać się wyłącznie z liter.

Podsumowanie

Szyfr Vigenère'a to prosta i czytelna metoda szyfrowania
polialfabetycznego. Dzięki możliwości eksportowania wyniku do pliku
proces pracy staje się wygodny i przejrzysty.
