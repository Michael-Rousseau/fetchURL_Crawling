import axios from "axios";
import { URL } from "url";
import { parse } from "parse5";

async function getHTML(url: string): Promise<string | null> {//GET request
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

function parseLinks(html: string, baseURL: string): string[] {//parse the HTML content
    const links: string[] = [];
    const document = parse(html);
    const traverse = (node: any) => {
        if (node.nodeName === 'a' && node.attrs) {
            const hrefAttr = node.attrs.find((attr: any) => attr.name === 'href');
            if (hrefAttr) {
                const href = hrefAttr.value;
                const fullURL = new URL(href, baseURL).toString();
                if (new URL(fullURL).hostname === new URL(baseURL).hostname) {
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

async function getDocSize(url: string): Promise<number> {//retrieve the size of the doc
    try {
        const response = await axios.head(url);
        return parseInt(response.headers['content-length'] || '0', 10);
    } catch (err) {
        console.error(err);
        return 0;
    }
}

async function crawl(url: string, visited: Set<string>) {
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

    readline.question("Enter the starting URL: ", async (homeURL: string) => {
        const visited: Set<string> = new Set();
        await crawl(homeURL, visited);
        readline.close();
    });
})();
