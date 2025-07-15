const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 3000;

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

app.use(cors());

app.get("/bypass/*", async (req, res) => {
    const url = req.params[0];
    const domain = extractDomain(url);

    try {
        const response = await axios.get(url);
        const html = response.data;

        /**
         * Relative url should be absolute
         */

        res.send(prepareFinalData(html, domain));
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred while fetching the URL");
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
