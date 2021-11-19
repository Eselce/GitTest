// ==UserScript==
// _name         xhr-test.js
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  Test lib for XHR calls
// _grant        GM.xmlHttpRequest
// _require      https://arantius.com/misc/greasemonkey/imports/greasemonkey4-polyfill.js
// _grant        GM_xmlhttpRequest
// ==/UserScript==

const __XHR = (() => {
    // ECMAScript 6:
    /* jshint esnext: true */
    /* jshint moz: true */

    console.log("Init xhr-test.js");

    const __GM3REQUEST = (('undefined' !== typeof GM_xmlhttpRequest) ? GM_xmlhttpRequest : undefined);  // GM 3.x and earlier
    const __GM4REQUEST = (('undefined' !== typeof GM)                ? GM.xmlHttpRequest : undefined);  // GM 4.0+
    const __CHECKFUN   = (fun => (('function' === typeof fun) ? fun : undefined));

    const __GM_REQUEST = (__CHECKFUN(__GM4REQUEST) || __CHECKFUN(__GM3REQUEST));
    const __XMLREQUEST = XMLHttpRequest || __GM_REQUEST;

    const __DETAILS = {
        'GET'     : {
                        'method' : 'GET'
                    },
        'PUT'     : {
                        'method' : 'PUT'
                    },
        };

    const __HEADERS = {
        'FORM'    : {
                        'Content-Type'    : 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
        'ACC'     : {
                        'Accept'          : "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                        'Accept-Language' : "de,en;q=0.9,fr;q=0.7,ja;q=0.6,zh;q=0.4,zh-CN;q=0.3,en-US;q=0.1",
                        'Accept-Encoding' : "gzip, deflate, br"
                    },
        'FF58'    : {
                        'User-Agent'      : 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0'
                    }
        };

    const __CALLBACKS = { };

    function registerCallback(status, fun) {
        __CALLBACKS[status] = fun;
    }

    function runCallback(result) {
        const __CALLBACK = __CALLBACKS[result.status];

        console.log(result.status, __CALLBACK);

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

                __D.onload = (result => {
                        const __RESULT = result.target;
                        const __RET = __ONLOAD(__RESULT);

                        if (__RESULT.statusText === 'OK') {
                            resolve(__RET);
                        } else {
                            reject(__RESULT.statusText);
                        }
                    });

                const __REQUEST = new __XMLREQUEST();

                if (__REQUEST) {
                    console.log('Fetching', d.url, '...');

                    __REQUEST.addEventListener('load', __D.onload);
                    __REQUEST.open(__D.method, __D.url, false);
                    __REQUEST.send();

                    const __RET = __REQUEST;

                    if (__RET !== undefined) {
                        resolve(__RET);
                    }
                } else {
                    console.error('Tried to fetch', d.url, '...');

                    reject("XHR handler is missing");
                }
            });
    }

    function getRequest(d) {
        const __D = { };

        Object.assign(__D, d, __DETAILS.GET);

        const __RET = xmlRequest(__D);

        return __RET;
    }

    function putRequest(d) {
        const __H = { };
        const __D = { };

        Object.assign(__H, __HEADERS.FORM, __HEADERS.ACC, __HEADERS.FF58, d.headers);
        Object.assign(__D, d, { 'headers' : __H }, __DETAILS.PUT);

        const __RET = xmlRequest(__D);

        return __RET;
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
                if (result.responseHeaders) {
                    let match = result.responseHeaders.match(/^Content-Type:\s+((\S+)\/(\S+))$/m);
                    contentType = (match ? match[1] : 'application/xml');
                    console.log(contentType);

                    doc = parser.parseFromString(result.responseText, contentType);

                    console.log("Parsed:", doc);
                } else {
                    console.log("Raw document", result.responseType);

                    doc = result.response;

                    //console.log("Parsed:", doc.slice(0, 256), '\n...\n', doc.slice(-256));
                }
            }
            catch(ex) {
                console.error("Parse error:", ex);
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