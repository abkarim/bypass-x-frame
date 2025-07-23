const iframe = document.getElementsByTagName("iframe")[0];

/**
 * Set iframe src via src-proxy attribute
 */
const iframeURL = new URL(iframe.getAttribute("src-proxy"));
const parentParams = new URLSearchParams(window.location.search);
parentParams.forEach((value, key) => {
    iframeURL.searchParams.set(key, value);
});

iframe.src = iframeURL.toString();

iframe.addEventListener("load", () => {
    iframe.contentWindow.postMessage("info", "*");
});

/**
 * Track favicon
 */
let faviconAdded = false;

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
                    /**
                     * Remove previous favicon if added
                     */
                    if (faviconAdded) {
                        const prevIcon =
                            document.querySelector("link[rel='icon']");
                        if (prevIcon) prevIcon.remove();
                    }

                    /**
                     * Only add favicon if not added already
                     */
                    document.head.innerHTML =
                        document.head.innerHTML + data.favIconHTML;

                    faviconAdded = true;
                }
        }
    }
});
