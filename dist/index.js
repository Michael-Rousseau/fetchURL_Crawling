"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const url_1 = require("url");
const parse5_1 = require("parse5");
async function getHTML(url) {
    try {
        const response = await axios_1.default.get(url);
        return response.data;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
function parseLinks(html, baseURL) {
    const links = [];
    const document = (0, parse5_1.parse)(html);
    const traverse = (node) => {
        if (node.nodeName === 'a' && node.attrs) {
            const hrefAttr = node.attrs.find((attr) => attr.name === 'href');
            if (hrefAttr) {
                const href = hrefAttr.value;
                const fullURL = new url_1.URL(href, baseURL).toString();
                if (new url_1.URL(fullURL).hostname === new url_1.URL(baseURL).hostname) {
                    links.push(fullURL);
                }
            }
        }
        if (node.childNodes) {
            node.childNodes.forEach(traverse);
        }
    };
    traverse(document);
    return links;
}
async function getDocSize(url) {
    try {
        const response = await axios_1.default.head(url);
        return parseInt(response.headers['content-length'] || '0', 10);
    }
    catch (err) {
        console.error(err);
        return 0;
    }
}
async function crawl(url, visited) {
    if (visited.has(url)) {
        return;
    }
    visited.add(url);
    console.log("Crawl:", url);
    const html = await getHTML(url);
    if (!html)
        return;
    const docSize = await getDocSize(url);
    const links = parseLinks(html, url);
    console.log(`Doc Size: ${docSize} bytes\nNumber Of Links: ${links.length}\nLinks Found on: ${url}: ${links}`);
    for (const link of links) {
        await crawl(link, visited);
    }
}
(async () => {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    readline.question("Enter the starting URL: ", async (homeURL) => {
        const visited = new Set();
        await crawl(homeURL, visited);
        readline.close();
    });
})();
//# sourceMappingURL=index.js.map