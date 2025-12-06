# Szyfr płotowy --- Dokumentacja użytkownika

## Opis działania

Szyfr płotowy (Rail Fence Cipher) to metoda szyfrowania
transpozycyjnego, w której tekst zapisywany jest naprzemiennie w
kolejnych wierszach, tworząc wzór zygzakowaty przypominający płot lub
ogrodzenie.\
Po zapisaniu tekstu w wybranej liczbie poziomów (szyn), odczytuje się go
wierszami, co daje zaszyfrowaną wiadomość.

Przykład przy dwóch poziomach:\
Litery tekstu zapisywane są kolejno „górą" i „dołem", a następnie
odczytywane wierszami.

 Klucz

-   Kluczem jest liczba poziomów (szyn), zwykle od 2 wzwyż.\
-   Większa liczba szyn tworzy bardziej skomplikowany wzór zygzaka.\
-   Aby odszyfrować wiadomość, należy użyć tej samej liczby poziomów, co
    podczas szyfrowania.

 Zastosowanie

-   Nauka podstaw szyfrów transpozycyjnych.\
-   Proste zadania edukacyjne.\
-   Prezentacja różnic między szyfrowaniem podstawieniowym a
    transpozycyjnym.\
-   Eksperymenty z liczbą poziomów i strukturą tekstu.

 Zasady użytkowania

-   Wprowadź tekst jawny.\
-   Podaj liczbę poziomów (szyn), np. 2--10.\
-   Wybierz tryb: szyfrowanie lub odszyfrowanie.\
-   Zdecyduj, czy zachować wielkość liter i znaki interpunkcyjne.\
-   Uruchom proces i odczytaj wynik w polu wyjściowym programu.

 Eksport do pliku 
 - W projekcie eksport obsługuje tylko wyniki szyfrowania/odszyfrowywania.
 - Dostępne formy eksportu (sekcja „Wynik”):
  - **Eksport TXT** — pobiera plik tekstowy z raportem: metadane (typ operacji, szyfr, data), tekst wejściowy, ustawienia (np. liczba szyn, offset), wynik oraz opis wizualizacji (jeśli wygenerowano).
  - **Eksport PDF** — próbuje wykonać snapshot wizualizacji i zapisać go jako PDF (biblioteka html2pdf). Jeśli snapshot nie jest możliwy → fallback do prostego PDF‑u tekstowego (jsPDF).

 Jak wyeksportować (użytkownik)
 - Zaszyfruj/odszyfruj tekst w aplikacji.  
 - (Opcjonalnie) Wygeneruj wizualizację, jeśli chcesz mieć ją w raporcie.  
 - W sekcji „Wynik”:
   - Kliknij **Eksport TXT** — pobierze plik `.txt` z raportem.  
   - Kliknij **Eksport PDF** — wygeneruje PDF (snapshot UI jeśli dostępny).  
   - Kliknij ikonę kopiowania, aby skopiować wynik do schowka.  

 Dodatkowe wskazówki

-   Formularz może zawierać: pole tekstowe, pole liczby poziomów, wybór
    trybu działania oraz przycisk „Zapisz wynik".\
-   Wynik można kopiować bezpośrednio do schowka.\
-   Pliki .txt są najprostszym formatem do udostępniania.\
-   Liczba szyn nie powinna być większa niż długość tekstu.

 Podsumowanie

Szyfr płotowy to prosty szyfr transpozycyjny oparty na układaniu tekstu
w zygzak.\
Dzięki możliwości zapisu wyników do plików tekstowych użytkownik może
łatwo archiwizować i udostępniać efekty swojej pracy.
