1. Na czym polega analiza częstości?

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
