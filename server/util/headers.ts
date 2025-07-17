export function cleanAndSetResponseHeader(response, res) {
    for (const [key, value] of Object.entries(response.headers)) {
        if (key.startsWith("x-")) continue;

        if (key.startsWith("cross-")) continue;

        if (key.startsWith("access-")) continue;

        if (key.startsWith("content-")) continue;

        if (key.startsWith("document-")) continue;

        if (key.startsWith("report")) continue;

        res.setHeader(key, value);
        // console.log(key, value);
    }
}

export function cleanAndReturnRequestHeader(headers) {
    return Object.fromEntries(
        Object.entries(headers).filter(([key]) => {
            if (key.startsWith("sec-fetch")) return false;

            if (key === "host" || key === "referer") return false;

            if (key.includes("upgrade-insecure-request")) return false;

            if (key.includes("user-agent")) return false;

            if (key.includes("accept")) return false;

            return true;
        })
    );
}
