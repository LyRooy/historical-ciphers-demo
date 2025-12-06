# Instrukcja: Eksport do pliku PDF w aplikacji webowej

## Cel

Umożliwienie użytkownikowi zapisywania wyników szyfrowania lub
deszyfrowania, wizualizacji oraz analizy częstości , w formacie PDF 

Eksport odbywa się w całości po stronie przeglądarki za pomocą
bibliotek:

-   **jsPDF** --- idealny dla prostych raportów tekstowych,
-   **html2pdf.js** --- najlepszy do eksportowania sekcji HTML
    (wizualizacji, analiz, wyników szyfrowania).

------------------------------------------------------------------------

## Krok 1 --- Instalacja wymaganych bibliotek

W terminalu projektu uruchom:

npm install jspdf

npm install html2pdf.js

------------------------------------------------------------------------

## Krok 2 --- Eksport prostego raportu (tekstowego)

Używane, gdy chcesz zapisać np. wynik szyfrowania/deszyfrowania bez
grafiki i bez stylów HTML.

### Przykład (JavaScript / React)

import jsPDF from "jspdf";

export function exportToPDF({ method, input, output, shift, author }) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Raport szyfrowania", 20, 20);

  doc.setFontSize(12);
  doc.text(`Metoda: ${method}`, 20, 40);

  if (method === "Cezar") {
    doc.text(`Przesunięcie: ${shift}`, 20, 50);
    doc.text(`Tekst jawny: ${input}`, 20, 60);
    doc.text(`Szyfrogram: ${output}`, 20, 70);
  }

  if (method === "Vigenere") {
    doc.text(`Klucz: ${shift}`, 20, 50);
    doc.text(`Tekst jawny: ${input}`, 20, 60);
    doc.text(`Szyfrogram: ${output}`, 20, 70);
  }

  doc.text(`Autor: ${author}`, 20, 90);

  doc.setProperties({
    title: "Raport szyfrowania",
    subject: "Wyniki użytkownika",
    author: "Aplikacja Szyfry Web",
    keywords: "szyfrowanie, kryptografia, Cezar, Vigenere",
  });

  doc.save("raport_szyfrowania.pdf");
}

------------------------------------------------------------------------

## Krok 3 --- Eksport sekcji strony (HTML + CSS)

Używane, gdy chcesz pobrać:

-   wizualizację szyfrowania,
-   wykres analizy częstości Cezara/Vigenère,
-   pełny raport renderowany w UI aplikacji.

### Przykład:

import html2pdf from "html2pdf.js";

export function exportSectionToPDF() {
  const element = document.getElementById("export-section");

  const options = {
    margin: 10,
    filename: "raport_szyfrowania.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(options).from(element).save();
}

### Przykładowy HTML

<div id="export-section">
  <h2>Raport szyfrowania</h2>
  <p>Metoda: Cezar (+3)</p>
  <p>Tekst jawny: ALA MA KOTA</p>
  <p>Szyfrogram: DOD PD NRWD</p>
  <div id="frequency-chart"></div>
</div>

<button onclick="exportSectionToPDF()">Pobierz PDF</button>

------------------------------------------------------------------------

## Krok 4 --- Dobre praktyki

 Dodaj metadane PDF-a

doc.setProperties({
  title: "Raport",
  subject: "Wyniki szyfrowania",
  author: "Aplikacja Szyfry Web",
});

 Zachowaj czytelność dokumentu

-   stosuj krótkie linie tekstu,
-   używaj odpowiednich marginesów,
-   testuj polskie znaki (UTF-8),
-   w html2pdf.js skaluj html2canvas dla ostrego eksportu wykresów.

------------------------------------------------------------------------

## Podsumowanie

### Rekomendacja dla Twojej aplikacji szyfrów:

Użyj **html2pdf.js**, ponieważ:

-   eksportuje wizualizacje (wykresy),
-   zachowuje układ UI,
-   pozwala zapisać kompletny raport szyfrowania/deszyfrowania oraz
    analizę częstości --- dokładnie to, czego potrzebuje aplikacja.

Do prostych logów i raportów tekstowych możesz wciąż używać **jsPDF**.

------------------------------------------------------------------------

## Gotowe do integracji

Zastępujesz stary moduł ExportPDF --- teraz eksport obejmuje:

-   wynik szyfrowania/deszyfrowania,
-   wizualizację procesu,
-   analizę częstości (jeśli użytkownik ją wyświetlił),
-   pełny wygląd sekcji UI dzięki html2pdf.js.
