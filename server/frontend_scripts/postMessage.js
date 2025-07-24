window.addEventListener("message", (e) => {
    const { data, source, origin } = e;

    // this is bound to the iframe embedder page js
    if (data === "info") {
        /**
         * Return necessary data
         */
        const dataToPass = {
            name: data,
        };
        dataToPass.title = document.title;

        /**
         * Get favicon html
         */
        const favIconElement = document.querySelector("link[rel='icon']");
        if (favIconElement) {
            dataToPass.favIconHTML = favIconElement.outerHTML;
        }

        source.postMessage(dataToPass, origin);
    }

    /**
     * Listen for events
     *
     */
    if (
        Object.prototype.toString.call(data) === "[object Object]" &&
        data.name === "eventsToListen"
    ) {
        data.data.forEach(({ events, selector, preventDefault }) => {
            const elements = [...document.querySelectorAll(selector)];

            /**
             * Loop over event elements found
             */
            elements.forEach((element) => {
                /**
                 * Add every events in this element
                 */
                events.forEach((event) => {
                    element.addEventListener(event, (e) => {
                        if (preventDefault) e.preventDefault();

                        /**
                         * Tell source that event has been fired
                         */
                        source.postMessage(
                            {
                                name: "eventThatYouToldToListenFired",
                                selector,
                                event,
                            },
                            origin
                        );
                    });
                });
            });
        });
    }
});
