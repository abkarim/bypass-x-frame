/**
 * Extract domain from a url
 *
 * @param {string} url
 * @returns
 */
export function extractDomain(url) {
    const match = url.match(
        /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im
    );
    return match && match[0];
}
