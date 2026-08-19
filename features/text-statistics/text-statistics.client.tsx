'use client';

import { useMemo, useState } from 'react';

import { calculateTextStatistics } from './text-statistics';

const exampleText =
  'Paste an example paragraph here to explore text statistics.\n\nThis utility counts words, lines, paragraphs, and reading time.';

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function TextStatistics() {
  const [text, setText] = useState('');
  const statistics = useMemo(() => calculateTextStatistics(text), [text]);

  function exportJson() {
    downloadFile('text-statistics.json', JSON.stringify(statistics, null, 2), 'application/json');
  }

  function exportXml() {
    const { characters, words, lines, paragraphs, bytes, readingTimeMinutes } = statistics;
    const xml = `<text-statistics><characters>${characters}</characters><words>${words}</words><lines>${lines}</lines><paragraphs>${paragraphs}</paragraphs><bytes>${bytes}</bytes><reading-time-minutes>${readingTimeMinutes}</reading-time-minutes></text-statistics>`;
    downloadFile('text-statistics.xml', xml, 'application/xml');
  }

  return (
    <div className="text-statistics-workspace">
      <div className="text-editor-panel">
        <div className="text-editor-toolbar">
          <div>
            <button
              className="mini-action"
              onClick={() => void navigator.clipboard.readText().then(setText)}
              type="button"
            >
              ▣ Paste
            </button>
            <button className="mini-action" onClick={() => setText('')} type="button">
              ◇ Clear
            </button>
          </div>
          <button
            className="mini-action load-example"
            onClick={() => setText(exampleText)}
            type="button"
          >
            ▣ Load example
          </button>
        </div>
        <textarea
          aria-label="Text to analyze"
          className="text-stat-editor"
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste or type your text here..."
          value={text}
        />
        <div className="text-editor-footer">
          <span>◉ Processed locally</span>
          <span>UTF-8</span>
        </div>
      </div>
      <aside className="analysis-panel">
        <div className="analysis-heading">
          <span>Analysis</span>
          <button
            className="copy-summary"
            onClick={() => void navigator.clipboard.writeText(JSON.stringify(statistics, null, 2))}
            title="Copy summary"
            type="button"
          >
            ▣
          </button>
        </div>
        <div className="stat-cards">
          <div>
            <small>◉ Characters</small>
            <strong>{statistics.characters}</strong>
            <em>without spaces: {statistics.charactersWithoutSpaces}</em>
          </div>
          <div>
            <small>¶ Words</small>
            <strong>{statistics.words}</strong>
          </div>
          <div>
            <small>§ Lines</small>
            <strong>{statistics.lines}</strong>
          </div>
          <div>
            <small>▤ Paragraphs</small>
            <strong>{statistics.paragraphs}</strong>
          </div>
        </div>
        <div className="analysis-details">
          <div>
            <span>◉ Bytes (UTF-8)</span>
            <strong>{statistics.bytes} B</strong>
          </div>
          <div>
            <span>◷ Est. reading time</span>
            <strong>{statistics.readingTimeMinutes} min</strong>
          </div>
        </div>
        <div className="export-actions">
          <button className="export-json" onClick={exportJson} type="button">
            ↧ Export as JSON
          </button>
          <button className="export-json" onClick={exportXml} type="button">
            ⌘ Export as XML
          </button>
        </div>
      </aside>
    </div>
  );
}
