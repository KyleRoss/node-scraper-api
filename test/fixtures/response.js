"use strict";

exports.get = `<!doctype html>
<html>
    <head></head>
    <body>
        <pre style="word-wrap: break-word; white-space: pre-wrap;">
            {"origin":"176.12.80.34"}
        </pre>
    </body>
</html>`;

exports.post = {
    "args": {},
    "data": "{\"foo\":\"bar\"}",
    "files": {},
    "form": {},
    "headers": {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Length": "13",
        "Content-Type": "application/json; charset=utf-8",
        "Host": "httpbin.org",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko"
    },
    "json": {
        "foo": "bar"
    },
    "method": "POST",
    "origin": "191.101.82.154, 191.101.82.154",
    "url": "https://httpbin.org/anything"
};
