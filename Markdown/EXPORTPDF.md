# Eksport wyników — instrukcja 

- Eksport dotyczy WYŁĄCZNIE wyników szyfrowania/odszyfrowywania, wizualizacji i (opcjonalnie) analizy częstości.
- Implementacja eksportu znajduje się w pliku `export.js`. Dane pobierane są z `window.getLastAction()` (ustawiane w `script.js`).

Co trafia do eksportu
- Metadane operacji: typ (encrypt / decrypt), nazwa szyfru, znacznik czasu.
- Tekst wejściowy (input) i wynik (output).
- Ustawienia szyfru (np. shift, keyword, rails, offset, konfiguracja Enigmy).
- Wizualizacja krok‑po‑kroku (jeśli została wygenerowana) — do PDF jako snapshot HTML.
- Analiza częstości — zostanie dołączona tylko jeśli użytkownik ją **kliknął** przed eksportem (pole `analysisClicked` w `lastAction`).

Jak korzystać — instrukcja dla użytkownika
1. Wykonaj operację: wybierz szyfr i kliknij „Zaszyfruj” lub „Odszyfruj”.  
2. (Opcjonalnie) Jeżeli chcesz analizę częstości w raporcie: kliknij „Dokonaj analizy częstości” po wygenerowaniu wyniku.  
3. W sekcji „Wynik”:
   - kliknij „Eksport TXT” → pobierze się plik .txt z raportem,
   - kliknij „Eksport PDF” → aplikacja spróbuje wygenerować PDF zawierający snapshot wizualizacji (jeśli możliwe); w razie problemów powstanie prosty PDF tekstowy,
   - kliknij przycisk kopiowania, aby skopiować wynik do schowka.


Bezpieczeństwo — sanitizacja HTML
- `export.js` może wstawiać fragmenty HTML (np. `analysisHtml`) do tymczasowego kontenera przed wykonaniem snapshotu.
- ZAWSZE sanitizuj dynamiczny HTML przed wstawieniem (w projekcie dostępny jest DOMPurify):
  ```js
  const safe = window.DOMPurify ? DOMPurify.sanitize(action.analysisHtml) : action.analysisHtml;
  container.innerHTML = safe;
  ```

Gdzie w kodzie szukać logiki eksportu
- `export.js`:
  - przyciski: `#export-txt`, `#export-pdf`
  - funkcje: `downloadTxt`, `exportPdfFromText`, logika budowy `exportEl` (snapshot) oraz `buildVisualizationHTMLForExport`
- `script.js`:
  - zapisuje dane akcji (lastAction) przy szyfrowaniu/odszyfrowywaniu (`setLastAction` / `getLastAction`),
  - generuje analizę częstości i pola `analysisHtml` / `analysisData` kiedy użytkownik kliknie przycisk analizy.


Testowanie lokalne
- Uruchom prosty serwer w katalogu projektu (fetch/html2canvas lepiej działa z http):
  - `python -m http.server 8000` lub `npx http-server -p 8000`
- Otwórz stronę, wykonaj szyfrowanie, (opcjonalnie) uruchom analizę, kliknij eksport i sprawdź pobrany plik.

Podsumowanie
- Eksportuje się tylko wyniki szyfrowania/odszyfrowywania, wizualizacje i analizę (jeśli wykonana).
