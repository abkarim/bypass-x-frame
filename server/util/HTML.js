import fs from "node:fs/promises";
import appRootPath from "app-root-path";

/**
 * Insert html at the head element
 *
 * @param {string} HTML_to_insert
 * @param {string} pageHTML
 * @param {string} position top|bottom
 * @returns
 */
export function insertAtTheHead(HTML_to_insert, pageHTML, position = "bottom") {
    let regex = /(<head>)/;
    if (position === "top") {
        return pageHTML.replace(regex, `$1 ${HTML_to_insert}`);
    }

    regex = /(<\/head>)/;
    return pageHTML.replace(regex, `${HTML_to_insert} $1`);
}

/**
 * Insert string the the bottom of the page
 * this insertion happens before the body closing tag
 *
 * @param {string} HTML_to_insert
 * @param {string} pageHTML
 * @returns {string}
 */
export function insertAtTheBottom(HTML_to_insert, pageHTML) {
    /**
     * This regex finds the last body closing tag followed by the lase html ending tag
     * the last body ending tag has a named group 'body_end_tag'
     */
    const regex = /(?<body_end_tag><\/body>)([\s\S]+)?(<\/html>)/i;
    return pageHTML.replace(regex, `${HTML_to_insert}$<body_end_tag>$2$3`);
}

/**
 * Insert js script to the page
 */
export function insertJS(content, html) {
    return insertAtTheBottom(
        `
        <script>
            ${content}
        </script>
        `,
        html
    );
}

/**
 * Modify response html to handle necessary things
 *
 * @param {string} HTML
 * @param {import("express").Request} req
 * @returns {string}
 */
export async function modifyHTML(HTML, req) {
    try {
        /**
         * Remove security integrity attribute
         */
        const regexToMatch = /integrity="[\S]+"/gm;
        HTML = HTML.replace(regexToMatch, " ");

        /**
         * Add base url to handle relative links
         *
         */
        HTML = insertAtTheHead(
            `<base href="${req.params[0]}" target="_self" >`,
            HTML,
            "top"
        );

        /**
         * Add script to communicate using postMessage
         */
        HTML = insertJS(
            await fs.readFile(
                appRootPath.resolve("/server/frontend_scripts/postMessage.js")
            ),
            HTML
        );

        /**
         * Add script to add proxy to links
         */
        HTML = insertJS(
            await fs.readFile(
                appRootPath.resolve(
                    "/server/frontend_scripts/addProxyToLinks.js"
                )
            ),
            HTML
        );

        /**
         * Register service worker
         */
        HTML = insertJS(
            await fs.readFile(
                appRootPath.resolve(
                    "/server/frontend_scripts/registerServiceWorker.js"
                )
            ),
            HTML
        );

        if (process.env.NODE_ENV === "development") {
            try {
                const clipboardy = await import("clipboardy");
                await clipboardy.default.write(HTML);
                console.log("copied to clipboard");
            } catch (err) {
                console.error(err);
            }
        }
    } catch (err) {
        console.log(err);
    } finally {
        return HTML;
    }
}
