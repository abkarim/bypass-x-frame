const express = require("express");
const axios = require("axios");
const cors = require("cors");
const helmet = require("helmet");
const https = require("https");
const app = express();
const port = 3000;

const agent = new https.Agent({
    rejectUnauthorized: false, // ignore invalid certs
});

/**
 * Extract domain from a url
 *
 * @param {string} url
 * @returns
 */
function extractDomain(url) {
    const match = url.match(
        /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im
    );
    return match && match[0];
}

/**
 * Prepare final data
 */
function prepareFinalData(data, domain) {
    let finalData = data.replaceAll(/.(?<=="\/)(?<=.[^"]+)/gim, `${domain}/`);
    return finalData;
}

app.use(
    cors({
        origin: "*",
    })
);
app.use(
    helmet({
        xFrameOptions: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false,
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    })
);

app.use("/bypass/*", async (req, res) => {
    const url = req.params[0];
    const domain = extractDomain(url);

    const reqMethod = req.method;
    const reqHeaders = Object.fromEntries(
        Object.entries(req.headers).filter(([key]) => {
            if (key.startsWith("sec-fetch")) return false;

            if (key === "host" || key === "referer") return false;

            if (key.includes("upgrade-insecure-request")) return false;

            if (key.includes("user-agent")) return false;

            if (key.includes("accept")) return false;

            return true;
        })
    );

    try {
        const response = await axios({
            method: reqMethod,
            url,
            headers: reqHeaders,
            responseType: "arraybuffer",
            httpAgent: agent,
            validateStatus: null,
        });

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

        const contentType = response.headers["content-type"] || "";
        res.status(response.status);
        res.setHeader("content-type", contentType);

        let data;
        if (contentType.includes("application/json")) {
            data = JSON.parse(Buffer.from(response.data).toString("utf-8"));
            res.json(data);
        } else if (contentType.includes("text/")) {
            data = Buffer.from(response.data).toString("utf-8");
            res.send(data);
        } else {
            data = Buffer.from(response.data);
            res.send(data);
        }
    } catch (err) {
        console.log({ err });
        console.error("Axios proxy error:", err.message);
        res.status(500).send("Proxy error");
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
