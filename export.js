 // =====================================================
// TYDZIEŃ 9 Eksport wyników
// =====================================================
// export.js — moved from script.js
// Responsible for TXT / PDF export UI handlers that use `window.getLastAction()` provided by script.js

(function(){
    // Local DOM references
    const outputTextEl = document.querySelector('.output-text');

    function getAction() {
        if (typeof window.getLastAction === 'function') return window.getLastAction();
        // fallback to window.__lastAction if present
        return window.__lastAction || null;
    }

    // Build readable export content
    function buildExportText(action) {
        if (!action) return 'Brak danych do eksportu\n\nNie wykonano żadnej operacji szyfrowania/odszyfrowywania.';

        const lines = [];
        lines.push(`Operacja: ${action.type === 'encrypt' ? 'Szyfrowanie' : 'Odszyfrowywanie'}`);
        lines.push(`Szyfr: ${action.cipher}`);
        lines.push(`Data: ${action.timestamp}`);
        lines.push('');

        lines.push('Hasło / Tekst wejściowy:');
        lines.push(action.input || '(puste)');
        lines.push('');

        lines.push('Ustawienia szyfru:');
        if (action.settings && Object.keys(action.settings).length) {
            for (const [k, v] of Object.entries(action.settings)) {
                lines.push(`  ${k}: ${JSON.stringify(v)}`);
            }
        } else {
            lines.push('  Brak dodatkowych ustawień');
        }
        lines.push('');

        lines.push('Wizualizacja krok po kroku:');
        lines.push(formatVisualizationSteps(action.visualization));
        lines.push('');

        // Include frequency analysis text if user explicitly ran it
        if (action.analysisClicked && action.analysisData) {
            lines.push('Analiza częstości (wygenerowana przez aplikację):');
            // For Caesar, list top candidate shifts
            if (action.cipher === 'caesar' && action.analysisData.top) {
                lines.push('  Najlepsze dopasowania (chi² - niższe lepsze):');
                action.analysisData.top.forEach(t => {
                    lines.push(`    Przesunięcie +${t.shift} — chi²: ${t.score.toFixed(2)} — przybliżone odszyfrowanie: ${t.plain}`);
                });
                lines.push('');
            }
            // For Vigenere, include Kasiski / IC / candidate keys if available
            if (action.cipher === 'vigenere' && action.analysisData) {
                const ad = action.analysisData;
                if (ad.kasiski) {
                    lines.push(`  IC (wskaźnik zgodności): ${ad.ic !== undefined ? ad.ic.toFixed(4) : 'n/a'}`);
                    lines.push('  Kasiski — sugerowane długości klucza:');
                    if (ad.kasiski.probable && ad.kasiski.probable.length) {
                        ad.kasiski.probable.slice(0,6).forEach(p => lines.push(`    długość=${p.len} (count=${p.count})`));
                    } else {
                        lines.push('    brak silnych kandydatów (potrzebny dłuższy szyfrogram)');
                    }

                    if (ad.candidates && ad.candidates.length) {
                        lines.push('  Najlepsze kandydatury klucza (próby):');
                        ad.candidates.slice(0,4).forEach((c, idx) => {
                            lines.push(`    #${idx+1} długość=${c.length} klucz≈${c.key} — χ² total: ${c.score.toFixed(2)}`);
                            lines.push(`      Przykładowe odszyfrowanie: ${c.plaintext}`);
                        });
                    }
                    lines.push('');
                } else if (ad.columns) {
                    lines.push('  Analiza kolumnowa (posiadany klucz):');
                    ad.columns.forEach(col => {
                        lines.push(`    Kolumna ${col.index+1} — najlepsze przesunięcie +${col.best.shift} (χ²:${col.best.score.toFixed(2)})`);
                    });
                    if (ad.predictedPlain) {
                        lines.push('');
                        lines.push('  Odszyfrowanie przy użyciu klucza (pokazane w UI):');
                        lines.push(`    ${ad.predictedPlain}`);
                    }
                    lines.push('');
                }
            }
        }

        lines.push('Wynik (tekst wyjściowy):');
        lines.push(action.output || '(puste)');

        return lines.join('\n');
    }

    // Format visualization steps into readable text
    function formatVisualizationSteps(steps) {
        if (!Array.isArray(steps) || steps.length === 0) {
            return '  (Brak wizualizacji / operacja nie została uruchomiona)';
        }

        const rows = [];
        steps.forEach((s, idx) => {
            const stepNum = idx + 1;
            if (s.original !== undefined && s.transformed !== undefined) {
                rows.push(`  Krok ${stepNum}: ${s.original} → ${s.transformed}  (pos ${s.originalIndex ?? '-'} → ${s.newIndex ?? '-'})`);
            } else if (s.inputChar !== undefined && s.outputChar !== undefined) {
                rows.push(`  Krok ${stepNum}: ${s.inputChar} → ${s.outputChar}  (rotor positions: ${Array.isArray(s.positions) ? s.positions.join(',') : (s.positions ?? '-')})`);
                if (Array.isArray(s.path)) rows.push(`    Ścieżka: ${s.path.map(p => `${p.stage}:${p.input}->${p.output ?? p.outputChar ?? '-'}`).join(' | ')}`);
            } else if (s.fence !== undefined) {
                rows.push(`  Krok ${stepNum}: zapis płotowy`);
                rows.push(`    Płot (${s.fence.length} rzędów):`);
                s.fence.forEach((r, i) => rows.push(`      Rząd ${i+1}: ${r.join('')}`));
            } else {
                try {
                    const short = JSON.stringify(s);
                    rows.push(`  Krok ${stepNum}: ${short}`);
                } catch (e) {
                    rows.push(`  Krok ${stepNum}: (nieznany format)`);
                }
            }
        });

        return rows.join('\n');
    }

    // File helpers
    function downloadTxt(filename, content) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    function exportPdfFromText(filename, content) {
        if (window.jspdf && window.jspdf.jsPDF) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ unit: 'pt', format: 'a4' });
            const margin = 40;
            const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
            const wrapped = doc.splitTextToSize(content, pageWidth);
            doc.setFontSize(11);
            doc.text(wrapped, margin, 60);
            doc.save(filename);
        } else {
            downloadTxt(filename.replace(/\.pdf$/i, '.txt'), content);
        }
    }

    function escapeHtml(str) {
        if (str === undefined || str === null) return '';
        str = String(str);
        return str.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
    }

    // Funkcja pomocnicza - pokaż loader
    function showExportLoader(buttonEl, originalText) {
        buttonEl.disabled = true;
        buttonEl.innerHTML = '<span class="export-spinner"></span> Ładowanie...';
        buttonEl.classList.add('loading');
    }

    // Funkcja pomocnicza - ukryj loader
    function hideExportLoader(buttonEl, originalText) {
        buttonEl.disabled = false;
        buttonEl.innerHTML = originalText;
        buttonEl.classList.remove('loading');
    }

    // UI bindings
    const exportTxtBtn = document.getElementById('export-txt');
    const exportPdfBtn = document.getElementById('export-pdf');

    if (exportTxtBtn) {
        exportTxtBtn.addEventListener('click', () => {
            const originalText = exportTxtBtn.innerHTML;
            showExportLoader(exportTxtBtn, originalText);
            
            setTimeout(() => {
                const action = getAction();
                if (!action) {
                    if (outputTextEl) outputTextEl.textContent = 'Nic nie zostało zaszyfrowane ani odszyfrowane w tej sesji.';
                    if (window.showNotification) window.showNotification('Brak danych do eksportu', 'warning');
                    hideExportLoader(exportTxtBtn, originalText);
                    return;
                }
                const content = buildExportText(action);
                const filename = `${action.type}_${action.cipher}_${(new Date()).toISOString().replace(/[:.]/g,'-')}.txt`;
                downloadTxt(filename, content);
                if (window.showNotification) window.showNotification('Eksport TXT zapisany', 'success');
                hideExportLoader(exportTxtBtn, originalText);
            }, 300);
        });
    }

    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', async () => {
            const originalText = exportPdfBtn.innerHTML;
            showExportLoader(exportPdfBtn, originalText);
            
            const action = getAction();
            if (!action) {
                if (outputTextEl) outputTextEl.textContent = 'Nic nie zostało zaszyfrowane ani odszyfrowane w tej sesji.';
                if (window.showNotification) window.showNotification('Brak danych do eksportu', 'warning');
                hideExportLoader(exportPdfBtn, originalText);
                return;
            }

            const filename = `${action.type}_${action.cipher}_${(new Date()).toISOString().replace(/[:.]/g,'-')}.pdf`;

            if (Array.isArray(action.visualization) && action.visualization.length > 0) {
                try {
                    const exportEl = document.createElement('div');
                    exportEl.id = 'export-section';
                    exportEl.style.boxSizing = 'border-box';
                    exportEl.style.background = '#ffffff';
                    exportEl.style.color = '#111';
                    exportEl.style.padding = '18px';
                    exportEl.style.fontFamily = 'Arial, Helvetica, sans-serif';
                    exportEl.style.maxWidth = '900px';
                    exportEl.style.margin = '0 auto';

                    const header = document.createElement('div');
                    header.style.textAlign = 'center';
                    header.style.marginBottom = '12px';
                    header.innerHTML = `<h2 style="margin:0 0 6px 0">Raport szyfrowania / odszyfrowywania</h2>
                        <div style="font-size:0.9rem;color:#444;">Operacja: <strong>${action.type === 'encrypt' ? 'Szyfrowanie' : 'Odszyfrowywanie'}</strong>
                        &nbsp;•&nbsp;Szyfr: <strong>${action.cipher}</strong>
                        &nbsp;•&nbsp;Data: <strong>${action.timestamp}</strong></div>`;
                    exportEl.appendChild(header);

                    const ioRow = document.createElement('div');
                    ioRow.style.display = 'flex';
                    ioRow.style.gap = '18px';
                    ioRow.style.flexWrap = 'wrap';

                    const leftCol = document.createElement('div');
                    leftCol.style.flex = '1 1 320px';
                    leftCol.innerHTML = `<h3 style="margin-top:6px;">Tekst wejściowy</h3><div style="white-space:pre-wrap;border:1px solid #eee;padding:10px;border-radius:6px;background:#fafafa;">${escapeHtml(action.input || '(puste)')}</div>`;

                    const rightCol = document.createElement('div');
                    rightCol.style.flex = '1 1 320px';
                    rightCol.innerHTML = `<h3 style="margin-top:6px;">Wynik (tekst wyjściowy)</h3><div style="white-space:pre-wrap;border:1px solid #eee;padding:10px;border-radius:6px;background:#fafafa;">${escapeHtml(action.output || '(puste)')}</div>`;

                    ioRow.appendChild(leftCol);
                    ioRow.appendChild(rightCol);
                    exportEl.appendChild(ioRow);

                    const settingsDiv = document.createElement('div');
                    settingsDiv.style.marginTop = '14px';
                    settingsDiv.innerHTML = `<h4>Ustawienia szyfru</h4><pre style="background:#f5f5f5;padding:8px;border-radius:6px;border:1px solid #eee;white-space:pre-wrap;">${escapeHtml(JSON.stringify(action.settings || {}, null, 2))}</pre>`;
                    exportEl.appendChild(settingsDiv);

                    // If available, prefer a full multi-step HTML render produced by script.js
                                    // Build full multi-step HTML directly from action.visualization (safer & includes all steps)
                                    const vizHtml = buildVisualizationHTMLForExport(action);
                                    const wrapper = document.createElement('div');
                                    wrapper.innerHTML = vizHtml;
                                    wrapper.style.marginTop = '14px';
                                    wrapper.style.border = '1px solid #e6e6e6';
                                    wrapper.style.padding = '12px';
                                    wrapper.style.borderRadius = '8px';
                                    exportEl.appendChild(wrapper);

                                    // If user ran frequency analysis during session, include the analysis HTML (only when analysis was executed)
                                    if (action.analysisClicked && action.analysisHtml) {
                                        const analysisWrapper = document.createElement('div');
                                        analysisWrapper.style.marginTop = '12px';
                                        analysisWrapper.style.border = '1px dashed #ddd';
                                        analysisWrapper.style.padding = '10px';
                                        analysisWrapper.style.borderRadius = '6px';
                                        analysisWrapper.innerHTML = `<h4 style="margin-top:0">Analiza częstości</h4>${action.analysisHtml}`;
                                        exportEl.appendChild(analysisWrapper);
                                    }

                    

                    document.body.appendChild(exportEl);

                    if (window.html2pdf) {
                        const options = {
                            margin:       10,
                            filename:     filename,
                            image:        { type: 'jpeg', quality: 0.98 },
                            html2canvas:  { scale: 2 },
                            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                        };

                        await window.html2pdf().set(options).from(exportEl).save();
                        exportEl.remove();
                        if (window.showNotification) window.showNotification('PDF wygenerowany (snapshot wizualizacji)', 'success');
                        hideExportLoader(exportPdfBtn, originalText);
                        return;
                    } else {
                        exportEl.remove();
                    }
                } catch (err) {
                    console.warn('html2pdf export failed, falling back to text PDF:', err);
                }
            }

            const content = buildExportText(action);
            exportPdfFromText(filename, content);
            if (window.showNotification) window.showNotification('Eksport PDF zapisany (lub wygenerowany)', 'success');
            hideExportLoader(exportPdfBtn, originalText);
        });
    }

    // Build full HTML for visualization steps from action.visualization
    function buildVisualizationHTMLForExport(action) {
        if (!action || !Array.isArray(action.visualization) || action.visualization.length === 0) {
            return `<div style="font-style:italic;color:#666;padding:8px;background:#fafafa;border-radius:6px;border:1px dashed #eee;">Brak wizualizacji krok po kroku (uruchom operację szyfrowania/odszyfrowywania).</div>`;
        }

        const stepsHtml = action.visualization.map((s, idx) => {
            const stepNum = idx + 1;

            // Caesar / Vigenere style (original -> transformed)
            if (s.original !== undefined && s.transformed !== undefined) {
                const shiftText = s.shift !== undefined ? `<div style="font-size:0.9rem;color:#666;margin-bottom:6px;">Przesunięcie: ${escapeHtml(String(s.shift))}</div>` : '';
                const positions = `Pozycja: ${escapeHtml(String(s.originalIndex ?? '-'))} → ${escapeHtml(String(s.newIndex ?? '-'))}`;
                const lettersLabel = s.isUpperCase ? 'Wielkie' : 'Małe';

                return `
                    <div style="padding:10px;border-radius:6px;border:1px solid #eee;margin-bottom:12px;background:#fff;">
                        <div style="font-weight:700;margin-bottom:6px;">Krok ${stepNum}: ${escapeHtml(s.description || '')}</div>
                        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:6px;">
                            <div style="flex:0 0 120px"><div style="font-size:0.85rem;color:#444">${escapeHtml(lettersLabel)} - oryginał</div><div style="font-family:monospace;font-size:1.3rem;background:#fafafa;padding:8px;border-radius:4px;border:1px solid #f0f0f0;">${escapeHtml(String(s.original))}</div></div>
                            <div style="flex:0 0 40px;text-align:center;font-size:1.2rem">→</div>
                            <div style="flex:0 0 120px"><div style="font-size:0.85rem;color:#444">${escapeHtml(lettersLabel)} - wynik</div><div style="font-family:monospace;font-size:1.3rem;background:#fafafa;padding:8px;border-radius:4px;border:1px solid #f0f0f0;">${escapeHtml(String(s.transformed))}</div></div>
                        </div>
                        ${shiftText}
                        <div style="font-size:0.85rem;color:#666">${positions}</div>
                    </div>`;
            }

            // Enigma / path-based steps
            if ((s.inputChar !== undefined && s.outputChar !== undefined) || Array.isArray(s.path)) {
                const positions = Array.isArray(s.positions) ? s.positions.join(' • ') : (s.positions ? String(s.positions) : '-');
                const pathText = Array.isArray(s.path) ? s.path.map(p => escapeHtml(`${p.stage}:${p.input}->${p.output ?? p.outputChar ?? '-'}`)).join(' | ') : '';

                return `
                    <div style="padding:10px;border-radius:6px;border:1px solid #eee;margin-bottom:12px;background:#fff;">
                        <div style="font-weight:700;margin-bottom:6px;">Krok ${stepNum}: ${escapeHtml(s.description || '')}</div>
                        <div style="margin-bottom:6px;">
                            <strong>Input:</strong> <span style="font-family:monospace">${escapeHtml(String(s.inputChar ?? s.input ?? ''))}</span>
                            &nbsp;→&nbsp;
                            <strong>Output:</strong> <span style="font-family:monospace">${escapeHtml(String(s.outputChar ?? s.output ?? ''))}</span>
                        </div>
                        <div style="font-size:0.85rem;color:#666;margin-bottom:6px;">Rotor positions: ${escapeHtml(String(positions))}</div>
                        ${pathText ? `<div style="font-size:0.85rem;color:#444">Ścieżka: ${pathText}</div>` : ''}
                    </div>`;
            }

            // Railfence visual (fence matrix representation)
            if (s.fence !== undefined) {
                const rows = Array.isArray(s.fence) ? s.fence.map((r,i)=>`<div style="font-family:monospace">Rząd ${i+1}: ${escapeHtml(r.join(''))}</div>`).join('') : '';
                return `
                    <div style="padding:10px;border-radius:6px;border:1px solid #eee;margin-bottom:12px;background:#fff;">
                        <div style="font-weight:700;margin-bottom:6px;">Krok ${stepNum}: ${escapeHtml(s.description || 'Płot')}</div>
                        ${rows}
                    </div>`;
            }

            // Fallback: show JSON
            try {
                return `
                    <div style="padding:10px;border-radius:6px;border:1px solid #eee;margin-bottom:12px;background:#fff;">
                        <div style="font-weight:700;margin-bottom:6px;">Krok ${stepNum} (raw)</div>
                        <pre style="white-space:pre-wrap;">${escapeHtml(JSON.stringify(s, null, 2))}</pre>
                    </div>`;
            } catch (e) {
                return `<div style="padding:8px;color:#666">Krok ${stepNum}: (nieznany format)</div>`;
            }
        }).join('\n');

        return `<div><h4 style="margin:0 0 8px 0">Wizualizacja krok po kroku</h4>${stepsHtml}</div>`;
    }

})();
