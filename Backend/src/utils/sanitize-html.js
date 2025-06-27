import sanitizeHtml from 'sanitize-html';

export function cleanHTML(dirty) {
    return sanitizeHtml(dirty, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
        allowedAttributes: { '*': ['href', 'src', 'alt'] },
    });
}
