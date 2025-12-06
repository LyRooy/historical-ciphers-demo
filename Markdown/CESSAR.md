Szyfr Cezara — dokumentacja użytkownika i eksport do pliku


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

Co aplikacja eksportuje 
- Tylko wyniki szyfrowania / odszyfrowywania oraz powiązane dane:
  - metadane (typ operacji, nazwa szyfru, timestamp),
  - tekst wejściowy i tekst wynikowy,
  - ustawienia szyfru (np. przesunięcie),
  - wizualizacja krok‑po‑kroku (jeśli została wygenerowana),
  - analiza częstości (TylKO jeśli użytkownik ją uruchomił przed eksportem).

Gdzie znajduje się eksport w projekcie
- Logika eksportu: `export.js`
- Dane do eksportu pobierane są z `window.getLastAction()` (ustawiane przez `script.js`).

Jak wyeksportować wynik (instrukcja użytkownika)
1. Wykonaj operację w aplikacji:
   - wybierz szyfr Cezara,
   - wprowadź tekst i ustaw klucz,
   - kliknij „Zaszyfruj” lub „Odszyfruj”.
2. (Opcjonalnie) Jeśli chcesz, aby raport zawierał analizę częstości:
   - kliknij przycisk „Dokonaj analizy częstości” w panelu Wynik.
3. W sekcji „Wynik”:
   - kliknij „Eksport TXT” — pobierze się plik `.txt` zawierający raport (tekst, ustawienia, opcjonalnie kroki i analiza),
   - kliknij „Eksport PDF” — aplikacja spróbuje wygenerować PDF zawierający snapshot wizualizacji (jeżeli dostępna). Jeśli snapshot się nie uda, PDF powstanie jako prosty dokument tekstowy (fallback),
   - kliknij ikonę kopiowania, aby skopiować wynik bezpośrednio do schowka.
4. Po pobraniu:
   - otwórz plik w edytorze tekstu (np. VS Code, Notepad++ lub Notatnik) i sprawdź zawartość.


DODATKOWE WSKAZÓWKI
- Dla uproszczenia można przygotować formularz z polem tekstowym, miejscem na wpisanie klucza i przyciskiem „Zapisz wynik”.
- Wynik można także kopiować bezpośrednio do schowka.
- Pliki zapisane w formacie .txt są najprostsze do przenoszenia i udostępniania między użytkownikami.

PODSUMOWANIE
Szyfr Cezara to doskonałe narzędzie dydaktyczne. Dzięki prostocie algorytmu użytkownik może w prosty sposób eksperymentować z szyfrowaniem, a funkcja eksportu do pliku tekstowego pozwala łatwo zachować lub udostępnić efekty pracy.
