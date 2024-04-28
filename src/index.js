"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var url_1 = require("url");
var parse5_1 = require("parse5");
function getHTML(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
                case 2:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function parseLinks(html, baseURL) {
    var links = [];
    var document = (0, parse5_1.parse)(html);
    var traverse = function (node) {
        if (node.nodeName === 'a' && node.attrs) {
            var hrefAttr = node.attrs.find(function (attr) { return attr.name === 'href'; });
            if (hrefAttr) {
                var href = hrefAttr.value;
                var fullURL = new url_1.URL(href, baseURL).toString();
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
function getDocSize(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.head(url)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, parseInt(response.headers['content-length'] || '0', 10)];
                case 2:
                    err_2 = _a.sent();
                    console.error(err_2);
                    return [2 /*return*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function crawl(url, visited) {
    return __awaiter(this, void 0, void 0, function () {
        var html, docSize, links, _i, links_1, link;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (visited.has(url)) {
                        return [2 /*return*/];
                    }
                    visited.add(url);
                    console.log("Crawl:", url);
                    return [4 /*yield*/, getHTML(url)];
                case 1:
                    html = _a.sent();
                    if (!html)
                        return [2 /*return*/];
                    return [4 /*yield*/, getDocSize(url)];
                case 2:
                    docSize = _a.sent();
                    links = parseLinks(html, url);
                    console.log("Doc Size: ".concat(docSize, " bytes\nNumber Of Links: ").concat(links.length, "\nLinks Found on: ").concat(url, ": ").concat(links));
                    _i = 0, links_1 = links;
                    _a.label = 3;
                case 3:
                    if (!(_i < links_1.length)) return [3 /*break*/, 6];
                    link = links_1[_i];
                    return [4 /*yield*/, crawl(link, visited)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var readline;
    return __generator(this, function (_a) {
        readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        readline.question("Enter the starting URL: ", function (homeURL) { return __awaiter(void 0, void 0, void 0, function () {
            var visited;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        visited = new Set();
                        return [4 /*yield*/, crawl(homeURL, visited)];
                    case 1:
                        _a.sent();
                        readline.close();
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); })();
