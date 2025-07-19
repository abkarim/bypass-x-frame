window.addEventListener("message", (e) => {
    // this is bound to the iframe embedder page js
    if (e.data === "info") {
        /**
         * Return necessary data
         */
        const data = {
            name: e.data,
        };
        data.title = document.title;

        /**
         * Get favicon html
         */
        const favIconElement = document.querySelector("link[rel='icon']");
        if (favIconElement) {
            data.favIconHTML = favIconElement.outerHTML;
        }

        e.source.postMessage(data, e.origin);
    }
});
