self.addEventListener("fetch", (e) => {
    const { mode, url, referrer } = e.request;

    /**
     * This is the main page request
     * no need to intercept here
     * this is already using proxy
     */
    if (mode === "navigate") return;

    /**
     * Ignore static files
     * css, images, js etc
     */
    const assetsRegex =
        /.(js|css|png|jpg|jpeg|svg|woff2?|ttf|eot|ico|gif|webp)$/gm;
    if (assetsRegex.test(url)) return;

    /**
     * Use proxy if a request want to communicate
     */
    if (!url.startsWith(referrer)) {
        const redirectURL = `${referrer}${url}`;
        console.log(`${url} redirected to ${redirectURL}`);

        e.respondWith(
            (async () => {
                try {
                    const reqClone = e.request.clone();

                    const newRequest = new Request(redirectURL, {
                        method: reqClone.method,
                        headers: reqClone.headers,
                        body:
                            reqClone.method !== "GET" &&
                            reqClone.method !== "HEAD"
                                ? reqClone.body
                                : undefined,
                        duplex:
                            reqClone.method !== "GET" &&
                            reqClone.method !== "HEAD"
                                ? "half"
                                : undefined,
                    });

                    return await fetch(newRequest);
                } catch (err) {
                    console.error("Proxy fetch failed:", err);
                    return new Response("Internal proxy error", {
                        status: 500,
                    });
                }
            })()
        );
    }
});
