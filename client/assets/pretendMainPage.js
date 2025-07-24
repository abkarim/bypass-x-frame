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

/**
 * Add events inside iframe
 * to listen here
 *
 * format is
 * [{querySelector, [events], preventDefault}]
 */
const eventsToListen = [
    {
        // selector: "button[name='login']",
        // events: ["click", "mouseover"],
        // preventDefault: true,
    },
];

iframe.addEventListener("load", () => {
    iframe.contentWindow.postMessage("info", "*");
    iframe.contentWindow.postMessage(
        {
            name: "eventsToListen",
            data: eventsToListen,
        },
        "*"
    );
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
            /**
             * Message for site info
             */
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

                break;

            /**
             * Message for event fire
             * that you told to listen
             */
            case "eventThatYouToldToListenFired":
                console.log({ selector: data.selector, event: data.event });
                alert("wake up man! do something");

                break;
        }
    }
});
