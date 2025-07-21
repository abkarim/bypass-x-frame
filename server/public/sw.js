let origin;

self.addEventListener("message", (e) => {
    /**
     * Get origin from website
     */
    if (e.data?.type === "origin") {
        origin = e.data.origin;
    }
});

self.addEventListener("fetch", (e) => {
    const { mode, url } = e.request;
    console.log({ url, origin, mode });

    // /**
    //  * Use proxy if a request want to communicate
    //  */
    // if (!url.toString().startsWith(origin)) {
    //     /**
    //      * If this is a static file request do nothing
    //      */

    //     const redirectURL = `${origin}/${url}`;
    //     console.log(`${url} redirected to ${redirectURL}`);
    //     // e.respondWith(
    //     //     fetch(redirectURL, {
    //     //         method: e.request.method,
    //     //         headers: e.request.headers,
    //     //     })
    //     // );
    // }

    if (mode === "navigate") {
        console.log("navigating to ", url);
    }
});
