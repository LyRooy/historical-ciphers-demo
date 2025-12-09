// md-viewer.js — lekka przeglądarka Markdown
// Funkcje:
// - załaduj pliki Markdown po ścieżce
// - oczyść HTML (używając DOMPurify jeśli obecny)
// - pokaż modal/panel i obsługuj zamykanie
// - obsługuj komponowanie README + wiele plików Markdown dla 'Dokumentacji'

(function(){
    function isAvailable(id) { return document.getElementById(id) !== null; }

    const viewer = document.getElementById('md-viewer');
    const mdTitle = document.getElementById('md-title');
    const mdContent = document.getElementById('md-content');
    const mdClose = document.getElementById('md-close');

    function sanitizeHtml(html) {
        if (window.DOMPurify) return DOMPurify.sanitize(html);
        return html; // starania bez wysiłku (użytkownik powinien używać serwera w produkcji)
    }

    function escapeHtml(str) {
        if (str === undefined || str === null) return '';
        return String(str).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch]);
    }

    function showLocalServerHint(container, err) {
        const safeMessage = escapeHtml(err && err.message ? String(err.message) : 'Błąd sieciowy');
        const html = `
            <div style="color:#a33;font-weight:700;margin-bottom:8px">Nie można wczytać pliku lokalnego (file://) z powodu polityki CORS</div>
            <div style="background:#fff7e6;border:1px solid #ffd8a8;padding:10px;border-radius:6px;margin-bottom:8px;white-space:pre-wrap;color:#111;">${safeMessage}</div>
            <div style="font-size:0.95rem;color:#333;margin-bottom:6px;">Aby wczytywać markdown lokalnie uruchom prosty serwer HTTP w katalogu projektu — fetch działa tylko z protokołu http(s).</div>
            <div style="background:#f7f7f7;padding:8px;border-radius:6px;border:1px dashed #eee;color:#000;">
                <strong>PowerShell (najprościej, jeśli masz Python):</strong>
                <pre style="margin:8px 0 0 0">python -m http.server 8000</pre>
                <div style="margin-top:6px"><strong>lub (Node.js):</strong>
                <pre style="margin:6px 0 0 0">npx http-server -p 8000</pre>
                <div style="margin-top:6px;color:#666">Po uruchomieniu otwórz: <code>http://localhost:8000</code></div>
            </div>
            <div style="margin-top:8px;color:#666;font-size:0.9rem">Alternatywnie użyj rozszerzenia VS Code "Live Server" i otwórz projekt przez serwer.</div>
        `;
        container.innerHTML = html;
    }

    async function fetchText(path) {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        return res.text();
    }

    async function loadMarkdown(path, title) {
        if (!viewer || !mdContent || !mdTitle) return;
        mdTitle.textContent = title || path;
        mdContent.innerHTML = '<div style="color:#666">Ładowanie…</div>';
        viewer.style.display = 'block';
        try {
            const md = await fetchText(path);
            const html = window.marked ? marked.parse(md) : DOMPurify ? DOMPurify.sanitize(md) : md;
            mdContent.innerHTML = sanitizeHtml(html);
            // odkryj przycisk zamknij jeśli ukryty
            if (mdClose) mdClose.style.display = 'inline-block';
            // zaktualizuj historię aby użytkownicy mogli dodać zakładkę
            try { history.replaceState(null, '', `#md=${encodeURIComponent(path)}`); } catch(e){}
        } catch (err){
            // Jeśli uruchamiasz bezpośrednio z file://, przeglądarki blokują fetch (CORS) — daj przyjazną wskazówkę
            if (location.protocol === 'file:' || /Failed to fetch|net::ERR_FAILED|blocked by CORS|Cross origin requests/i.test(String(err.message || ''))) {
                showLocalServerHint(mdContent, err);
            } else {
                mdContent.innerHTML = `<pre style="color:red">Błąd podczas ładowania pliku: ${escapeHtml(String(err.message || 'nieznany błąd'))}</pre>`;
            }
        }
    }

    async function loadCombined(paths, title) {
        if (!viewer || !mdContent || !mdTitle) return;
        mdTitle.textContent = title || 'Dokumentacja';
        mdContent.innerHTML = '<div style="color:#666">Ładowanie dokumentacji…</div>';
        viewer.style.display = 'block';
        try {
            const parts = [];
            for (const p of paths) {
                try {
                    const txt = await fetchText(p);
                    // dodaj separator i nagłówek nazwy pliku
                    parts.push(`## Plik: ${p}\n\n` + txt);
                } catch (e) {
                    parts.push(`**Błąd ładowania ${p}: ${e.message}**\n`);
                }
            }

            const combined = parts.join('\n\n---\n\n');
            const html = window.marked ? marked.parse(combined) : combined;
            mdContent.innerHTML = sanitizeHtml(html);
            if (mdClose) mdClose.style.display = 'inline-block';
            try { history.replaceState(null, '', '#md=DOCUMENTATION'); } catch(e){}
        } catch (err) {
            if (location.protocol === 'file:' || /Failed to fetch|net::ERR_FAILED|blocked by CORS|Cross origin requests/i.test(String(err.message || ''))) {
                showLocalServerHint(mdContent, err);
            } else {
                mdContent.innerHTML = `<pre style="color:red">Błąd: ${escapeHtml(String(err.message || 'nieznany błąd'))}</pre>`;
            }
        }
    }

    // okabluj zamknięcie css
    if (mdClose) mdClose.addEventListener('click', () => {
        if (viewer) viewer.style.display = 'none';
        mdClose.style.display = 'none';
        // utrzymuj historię bez zmian
    });

    // dołącz procedury obsługi do łączy z klasą md-link
    document.addEventListener('click', (ev) => {
        const el = ev.target.closest && ev.target.closest('.md-link');
        if (!el) return;
        ev.preventDefault();
        const md = el.dataset.md;
        const mode = el.dataset.mode || 'single';
        if (mode === 'single') {
            loadMarkdown(md, el.textContent.trim());
        } else if (mode === 'docs') {
            // dokumenty: jeśli atrybut data-extra obecny, spodziewana się listy oddzielonej przecinkami
            const extras = el.dataset.extra ? el.dataset.extra.split(',').map(s=>s.trim()).filter(Boolean) : [];
            // montaż README + extras
            const readme = el.dataset.readme || 'README.md';
            const paths = [readme, ...extras];
            loadCombined(paths, el.textContent.trim());
        }
    });

    // załaduj z hash podczas ładowania strony
    document.addEventListener('DOMContentLoaded', () => {
        if (!location.hash) return;
        const raw = location.hash.slice(1);
        if (!raw.startsWith('md=')) return;
        const key = raw.slice(3);
        if (key === 'DOCUMENTATION') {
            // jeśli hash sygnalizuje dokumentację, spróbuj README + standardowe dodatki
            const extras = ['Markdown/Sekcja i analiza szyfrow.md','Markdown/CESSAR.md','Markdown/Vigenere.md','Markdown/Plotowy.md','Markdown/Enigma.md'];
            loadCombined(['README.md', ...extras], 'Dokumentacja (łączona)');
        } else {
            const path = decodeURIComponent(key);
            loadMarkdown(path, path);
        }
    });

})();
