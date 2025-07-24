import express from "express";
import axios from "axios";
import cors from "cors";
import helmet from "helmet";
import https from "https";
import {
    cleanAndReturnRequestHeader,
    cleanAndSetResponseHeader,
} from "./util/headers.js";
import { modifyHTML } from "./util/HTML.js";
import appRootPath from "app-root-path";

const app = express();
const port = 3000;

const agent = new https.Agent({
    rejectUnauthorized: false, // ignore invalid certs
});

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

app.use(express.static(appRootPath.resolve("/public")));

app.use("/*", async (req, res) => {
    const url = req.params[0];

    try {
        const axiosOptions = {
            method: req.method,
            url,
            headers: cleanAndReturnRequestHeader(req.headers),
            responseType: "arraybuffer",
            httpAgent: agent,
            validateStatus: null,
        };

        const response = await axios(axiosOptions);

        cleanAndSetResponseHeader(response, res);

        const contentType = response.headers["content-type"] || "";
        res.status(response.status);
        res.setHeader("content-type", contentType);

        let data;
        if (contentType.includes("application/json")) {
            data = JSON.parse(Buffer.from(response.data).toString("utf-8"));
            res.json(data);
            return;
        } else if (contentType.includes("text/")) {
            data = Buffer.from(response.data).toString("utf-8");

            if (contentType.includes("text/html")) {
                data = await modifyHTML(data, req);
            }
        } else {
            data = Buffer.from(response.data);
        }

        res.send(data);
    } catch (err) {
        console.log({ err });
        console.error(`Axios proxy error: ${req.url} {err.message}`);
        res.status(500).send("Proxy error");
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
