Co oznacza "chi²" w wynikach

"chi²" to skrót od statystyki chi‑kwadrat (χ²).
W analizie częstości porównujemy obserwowane rozkłady liter w szyfrogramie z oczekiwanym rozkładem liter w języku polskim. Chi‑kwadrat mierzy, jak bardzo obserwacje (liczby liter w szyfrogramie) różnią się od oczekiwanych wartości.
Niższa wartość χ² oznacza lepsze dopasowanie — czyli większe prawdopodobieństwo, że dana hipoteza (tu: konkretny przesunięcie/klucz) daje tekst o rozkładzie zbliżonym do naturalnego języka.
Jak interpretować Twoje przykłady

Przykład: "Przesunięcie +11 — chi²: 27.50 — Litwo ojczyzno moja..."
→ znaczy: dla przesunięcia +11 obliczony χ² wyniósł 27.50, a odszyfrowany tekst przy tym przesunięciu to „Litwo ojczyzno moja…”. Ponieważ ta wersja jest poprawną i czytelną polszczyzną (niskie χ² i sensowny tekst) → to bardzo silny kandydat.
Kolejne wiersze z wyższymi χ² (np. 92.84, 197.20) dają niezrozumiały ciąg znaków — większe χ² oznaczają słabsze dopasowanie → mniej prawdopodobne, że to prawidłowy klucz.
Dlaczego algorytm czasem „pudłuje”

Dla bardzo krótkich tekstów wynik może być mylący — próbka jest za mała, by statystyka była stabilna. W UI już pokazujemy ostrzeżenie dla bardzo krótkich szyfrogramów.
Diakrytyki i nietypowe znaki mogą silnie wpłynąć na rozkład przy małych próbkach.