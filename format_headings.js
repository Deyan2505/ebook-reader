const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Replace Chapter Titles
content = content.replace(/<p>(Глава \d+.*?)<\/p>/gi, '<h2 class="chapter-main-title">$1</h2>');
content = content.replace(/<p>(ЕПИЛОГ.*?)<\/p>/gi, '<h2 class="chapter-main-title">$1</h2>');
content = content.replace(/<p>(Част [IVX]+:.*?)<\/p>/gi, '<h2 class="chapter-main-title">$1</h2>');

// Replace Psychological Analysis headings
content = content.replace(/<p>([Пп]сихологически анализ\.?)<\/p>/gi, '<h3 class="analysis-main-title">$1</h3>');
content = content.replace(/<p>(ПСИХОЛОГИЧЕСКИ АНАЛИЗ)<\/p>/g, '<h3 class="analysis-main-title">$1</h3>');

// Replace Psychological Subheadings that might have text on the same line
content = content.replace(/<p>(Емоционален подтекст:?)(.*?)<\/p>/gi, function(match, title, rest) {
    if (rest.trim()) {
        return `<h4 class="analysis-subtitle">${title}</h4><p>${rest.trim()}</p>`;
    }
    return `<h4 class="analysis-subtitle">${title}</h4>`;
});
content = content.replace(/<p>(Психологически термин:?)(.*?)<\/p>/gi, function(match, title, rest) {
    if (rest.trim()) {
        return `<h4 class="analysis-subtitle">${title}</h4><p>${rest.trim()}</p>`;
    }
    return `<h4 class="analysis-subtitle">${title}</h4>`;
});

// Replace other generic ALL CAPS titles
content = content.replace(/<p>([А-ЯA-Z\s,]{5,60})<\/p>/g, '<h3 class="chapter-subtitle">$1</h3>');

// Catch subtitles: any P block that doesn't end with sentence-ending punctuation, 
// isn't too long, doesn't start with a dash, and doesn't contain a comma followed by a lowercase word.
// To be safe, we'll only do it for lines without punctuation at the end.
content = content.replace(/<p>([^—\-\.<>!?]{3,60})<\/p>/g, function(match, text) {
    // If it's mostly uppercase, we already handled or can handle.
    // If it's a title, make it an h3
    // But exclude lines that are clearly dialogue missing a dot, or weird edge cases.
    if (text.includes('—') || text.includes('-')) return match; // skip dialogue
    return `<h3 class="chapter-subtitle">${text.trim()}</h3>`;
});

// Add CSS to head
const styleIndex = content.indexOf('</style>');
if (styleIndex !== -1 && !content.includes('.chapter-main-title')) {
    const customCSS = `
    .chapter-main-title {
        font-family: var(--font-sans);
        font-size: 2.4em;
        font-weight: 800;
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
        text-align: center;
        color: var(--accent);
        letter-spacing: -0.02em;
    }
    .chapter-subtitle {
        font-family: var(--font-sans);
        font-size: 0.95em;
        font-weight: 400;
        font-style: italic;
        margin-top: 1.2rem;
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
        opacity: 0.85;
        text-align: center;
        letter-spacing: 0.02em;
    }
    .analysis-main-title {
        font-family: var(--font-mono);
        color: #6a1b9a;
        text-transform: uppercase;
        font-size: 1.5em;
        font-weight: bold;
        letter-spacing: 0.05em;
        margin-top: 2em;
        margin-bottom: 0.5em;
        border-bottom: 2px solid #6a1b9a;
        padding-bottom: 0.2em;
    }
    .analysis-subtitle {
        font-family: var(--font-sans);
        font-size: 1.3em;
        font-weight: 600;
        font-style: italic;
        margin-top: 1.4em;
        margin-bottom: 0.5rem;
        color: #8e44ad;
    }
    [data-theme="dark"] .analysis-main-title {
        color: #ce93d8;
        border-bottom-color: #ce93d8;
    }
    [data-theme="dark"] .analysis-subtitle {
        color: #d1c4e9;
    }
`;
    content = content.replace('</style>', customCSS + '</style>');
}

fs.writeFileSync('index.html', content);
console.log('Script completed replacing headings in index.html');
