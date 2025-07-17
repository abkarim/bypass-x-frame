const express = require("express");
const axios = require("axios");
const cors = require("cors");
const helmet = require("helmet");
const https = require("https");
const {
    cleanAndSetResponseHeader,
    cleanAndReturnRequestHeader,
} = require("./util/headers");
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

    try {
        const response = await axios({
            method: req.method,
            url,
            headers: cleanAndReturnRequestHeader(req.headers),
            responseType: "arraybuffer",
            httpAgent: agent,
            validateStatus: null,
        });

        cleanAndSetResponseHeader(response, res);

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
