const iframe = document.getElementsByTagName("iframe")[0];
const iframeURL = new URL(iframe.src);

iframe.addEventListener("load", () => {
    iframe.contentWindow.postMessage("info", "*");
});

/**
 * Get data from iframe
 */
window.addEventListener("message", (event) => {
    if (iframeURL.origin !== event.origin) return;

    /**
     * If event.data is a object
     * and we got a name
     */
    if (
        Object.prototype.toString.call(event.data) === "[object Object]" &&
        event.data.name !== undefined
    ) {
        const data = event.data;

        switch (data.name) {
            case "info":
                document.title = data.title;

                /**
                 * Set favicon
                 */
                if (data.favIconHTML) {
                    document.head.innerHTML =
                        document.head.innerHTML + data.favIconHTML;
                }
        }
    }
});
