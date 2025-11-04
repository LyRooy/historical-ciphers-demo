Instrukcja: Eksport do pliku PDF w aplikacji webowej
Cel

Umożliwienie użytkownikowi zapisywania wyników szyfrowania, wizualizacji lub quizu w formacie PDF, bez potrzeby użycia backendu.
Funkcjonalność realizowana po stronie przeglądarki przy użyciu bibliotek:
jsPDF lub html2pdf.js.

Krok 1 — Instalacja biblioteki

W terminalu projektu uruchom:

npm install jspdf


lub — jeśli chcesz eksportować całe sekcje HTML (ze stylami CSS):

npm install html2pdf.js

Krok 2 — Eksport prostego raportu (tekstowego)
Przykład (JavaScript / React)
import jsPDF from "jspdf";

export function exportToPDF() {
  const doc = new jsPDF();

  // Nagłówek dokumentu
  doc.setFontSize(18);
  doc.text("Raport szyfrowania", 20, 20);

  // Treść
  doc.setFontSize(12);
  doc.text("Szyfr: Cezara (+3)", 20, 40);
  doc.text("Tekst jawny: ALA MA KOTA", 20, 50);
  doc.text("Szyfrogram: DOD PD NRWD", 20, 60);
  doc.text("Autor: Jan Kowalski", 20, 80);

  // Zapis pliku
  doc.save("raport_szyfrowania.pdf");
}


Wynik: w przeglądarce automatycznie pobierze się plik raport_szyfrowania.pdf.

Krok 3 — Eksport fragmentu strony (HTML + CSS)

Jeśli chcesz zapisać widok aplikacji (np. quiz, wizualizację, raport) jako PDF — użyj html2pdf.js.

Przykład:
import html2pdf from "html2pdf.js";

export function exportSectionToPDF() {
  const element = document.getElementById("export-section");
  const options = {
    margin: 10,
    filename: "quiz_wynik.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  html2pdf().set(options).from(element).save();
}

HTML przykład:
<div id="export-section">
  <h2>Wynik quizu</h2>
  <p>Użytkownik: Anna Nowak</p>
  <p>Poprawne odpowiedzi: 8/10</p>
</div>

<button onclick="exportSectionToPDF()">Pobierz PDF</button>

Krok 4 — Dobre praktyki

Dodaj tytuł i metadane PDF-a:

doc.setProperties({
  title: "Raport szyfrowania",
  subject: "Wyniki użytkownika",
  author: "Aplikacja Szyfry Web",
  keywords: "szyfrowanie, edukacja, kryptografia",
});


Zachowaj czytelność PDF-a:

krótkie linie tekstu,

odpowiednie marginesy,

testowanie polskich znaków (UTF-8).

Krok 5 — Alternatywy
Biblioteka	Zastosowanie	Zalety	Wady
jsPDF	Teksty i proste raporty	Lekka, łatwa w obsłudze	Małe możliwości stylowania
html2pdf.js	Eksport wyglądu strony (HTML + CSS)	Zachowuje styl	Wolniejsza przy dużych stronach
pdfmake	Raporty edukacyjne, quizy	Obsługuje tabele i polskie znaki	Wymaga konfiguracji layoutu
Podsumowanie

Rekomendacja:
Do projektu edukacyjnego szyfrów zastosuj html2pdf.js – pozwala eksportować wizualizacje, raporty i quizy w formie zgodnej z widokiem aplikacji.
