// ==UserScript==
// _name         xhr-test.js
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  GitHub_GitTest/misc (Eselce 10.11.2017 20:22:15) Test lib for XHR call
// @grant        GM.xmlHttpRequest
// @require      https://arantius.com/misc/greasemonkey/imports/greasemonkey4-polyfill.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

console.log("Init xhr-test.js");

var xhrTest = (function() {
    // ECMAScript 6: Erlaubt 'const', 'let', ...
    /* jshint esnext: true */
    /* jshint moz: true */

    const __XMLREQUEST = ((GM && (typeof GM.xmlHttpRequest === 'function'))
                            ? GM.xmlHttpRequest
                            : GM_xmlhttpRequest);

    const __DETAILS = {
        'GET'     : {
                        'method'          : 'GET'
                    },
        'PUT'     : {
                        'method'          : 'PUT'
                    },
        };

    const __HEADERS = {
        'FORM'    : {
                        'Content-Type'    : "application/x-www-form-urlencoded"
                    },
        'ACC'     : {
                        'Accept'          : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                        'Accept-Language' : "de,en-US;q=0.7,en;q=0.3",
                        'Accept-Encoding' : "gzip, deflate, br"
                    },
        'FF58'    : {
                        'User-Agent'      : 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0'
                    }
        };

    const __CALLBACKS = { };

    function registerCallback(status, fun) {
        __CALLBACKS[status] = fun;
    }

    function runCallback(result) {
        const __CALLBACK = __CALLBACKS[result.status];

        console.log(__CALLBACK);

        return (__CALLBACK ? __CALLBACK(result) : null);
    }

    function onloadByStatus(result) {
        console.log(result.status, result.statusText);

        return runCallback(result);
    }

    function xmlRequest(d) {
        return new Promise(function(resolve, reject) {
                const __ONLOAD = d.onload;
                const __D = { };

                Object.assign(__D, d);

                __D.onload = function(result) {
                        const __RET = __ONLOAD(result);

                        if (result.statusText === 'OK') {
                            resolve(__RET);
                        } else {
                            reject(result.statusText);
                        }
                    };

                console.log('Fetching', d.url, '...');

                const __RET = __XMLREQUEST(__D);

                if (__RET  !== undefined) {
                    return resolve(__RET);
                }
            });
    }

    function getRequest(d) {
        const __D = { };

        Object.assign(__D, d, __DETAILS.GET);

        return xmlRequest(__D);
    }

    function putRequest(d) {
        const __H = { };
        const __D = { };

        Object.assign(__H, __HEADERS.FORM, __HEADERS.ACC, __HEADERS.FF58, d.headers);
        Object.assign(__D, d, { 'headers' : __H }, __DETAILS.PUT);

        return xmlRequest(__D);
    }

    function browse(url, headers = { }, onload = onloadByStatus) {
        const __H = { };

        Object.assign(__H, __HEADERS.ACC, __HEADERS.FF58, headers);

        return getRequest({
                'url'     : url,
                'headers' : __H,
                'onload'  : onload
            });
    }

    registerCallback(200, function(result) {
            let parser = new DOMParser();
            let contentType;
            let doc;

            try {
                let match = result.responseHeaders.match(/Content-Type:\s+((\w+)\/(\w+))/);
                contentType = (match ? match[1] : 'application/xml');
                console.log(contentType);

                doc = parser.parseFromString(result.responseText, contentType);
            }
            catch(ex) {
                console.error("Parse error:", ex);
            }
            finally {
                console.log(doc.title, doc);
            }

            return doc;
        });

    return {
            browse,
            getRequest,
            putRequest,
            xmlRequest,
            registerCallback,
            __XMLREQUEST
        };
})();

// *** EOF ***