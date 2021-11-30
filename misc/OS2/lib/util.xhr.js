// ==UserScript==
// _name         util.xhr
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer XHR-Aufrufe
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.xhr.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Default XHR-Handler ====================

// openXMLHttpRequest(XHRrequest, details): Aufbau einer Verbindung ueber Verbindungsdetails
// XHRrequest: Verbindungs-Objekt
// details: Verbindungsdetails zur Verbindung
// - method: Art der Verbindung ('GET', 'POST', 'PUT', 'HEAD', 'DELETE'...)
// - url: Ziel der Verbindung
// - onload: Event-Listener fuer das Laden
// - async: true/false, ob asynchrone Verbindung
// - ...
// return Antwort-Promise auf die Verbindung
async function openXMLHttpRequest(XMLrequest, details) {
    try {
        const __REQUEST = XMLrequest;
        const __D = details;

        // TODO klaeren!
        __D.async = false;

        await __REQUEST.addEventListener('load', __D.onload);
        await __REQUEST.open(__D.method, __D.url, __D.async, __D.user, __D.password);
        await __REQUEST.send(__D.data);

        return Promise.resolve(__REQUEST);
    } catch (ex) {
        return Promise.reject(ex);
    }
}

// Der XHR-Handler...
const __XHR = XHRfactory('XHR handler', XMLHttpRequest, openXMLHttpRequest);

// ==================== Ende Default XHR-Handler ====================

// ==================== Fabrik fuer einen XHR-Handler ====================

// Fabrik fuer die Generierung eines XHR-Handlers
// XHRname: Name des XHR-Handlers
// XHRrequestClass: Klasse des Verbindungs-Objekts eines XHR-Requests
// XHRopenFun(XHRrequest, details): Aufbau einer Verbindung ueber Verbindungsdetails
// - XHRrequest: Verbindungs-Objekt
// - details: Verbindungsdetails zur Verbindung
// - * method: Art der Verbindung ('GET', 'POST', 'PUT', 'HEAD', 'DELETE'...)
// - * url: Ziel der Verbindung
// - * onload: Event-Listener fuer das Laden
// - * async: true/false, ob asynchrone Verbindung
// - * ...
// - return Antwort-Promise auf die Verbindung
// return Liefert ein Handler-Objekt mit folgenden Methoden:
// - browse(url, headers, onload): Einfacher Aufbau einer Verbindung
// - getRequest(details): Aufbau einer Verbindung mit GET-Headern
// - putRequest(details): Aufbau einer Verbindung mit PUT-Headern
// - xmlRequest(details): Allgemeiner Aufbau einer Verbindung
// - postRequest(details): Aufbau einer Verbindung mit POST-Headern
// - headRequest(details): Aufbau einer Verbindung mit HEAD-Headern
// - registerCallback(rc, fun): Registrierung fuer Behandlung verschiedener Response-Codes
// - __XMLREQUEST: Klasse des Verbindungs-Objekts, siehe XHRrequestClass
function XHRfactory(XHRname, XHRrequestClass, XHRopenFun) {
    const __XMLREQUEST = XHRrequestClass;

    if ((typeof XHRopenFun) === 'function') {
        __LOG[2]("Initializing", XHRname, '...');
    } else {
        __LOG[1]("Can't initialize", XHRname, "with", __LOG.info(XHRopenFun));
        //throw TypeError("Can't initialize " + XHRname + " with " + __LOG.info(XHRopenFun) + '!');
        return { __XMLREQUEST };
    }

    const __DETAILS = {
        'GET'     : {
                        'method' : 'GET'
                    },
        'PUT'     : {
                        'method' : 'PUT'
                    },
        'POST'    : {
                        'method' : 'POST'
                    },
        'HEAD'    : {
                        'method' : 'HEAD'
                    }
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
        'FF95'    : {
                        'User-Agent'      : 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0'
                    },
        'SCRIPT'  : {
                        'User-Agent'      : `${XHRname}`  // `${DBMOD.Name} (${DBMAN.Name}) ${XHRname}`
                    }
        };

    const __CALLBACKS = { };

    function registerCallback(status, fun) {
        __CALLBACKS[status] = fun;
    }

    function runCallback(result) {
        const __CALLBACK = __CALLBACKS[result.status];

        __LOG[2](result.status, __CALLBACK);

        return (__CALLBACK ? __CALLBACK(result) : null);
    }

    function onloadByStatus(result) {
        __LOG[2](result.status, result.statusText);

        return runCallback(result);
    }

    function onerrorDefault(error) {
        __LOG[1]("onerrorDefault():", error);

        return defaultCatch(error);
    }

    function xmlRequest(details) {
        return new Promise(function(resolve, reject) {
                try {
                    const __ONLOAD = (details.onload || sameValue);
                    const __ONERROR = (details.onerror || sameValue);
                    const __D = { };

                    Object.assign(__D, details);

                    __D.onload = (result => {
                            try {
                                const __RESULT = (result.target || result);
                                const __RET = __ONLOAD(__RESULT);

                                if (__RESULT.statusText === 'OK') {
                                    resolve(__RET);
                                } else {
                                    reject(__RESULT.statusText);
                                }
                            } catch (ex) {
                                __LOG[1]("Error in onload():", ex);
                                reject(ex);
                            }
                        });

                    __D.error = (error => {
                            __LOG[1]("onerror():", error);

                            reject(error);
                        });

                    const __REQUEST = new __XMLREQUEST();

                    if (__REQUEST && XHRopenFun) {
                        __LOG[2]('Fetching', details.url, '...');

                        const __RET = Promise.resolve(XHRopenFun(__REQUEST, __D)).catch(reject);

                        return __RET;
                    }

                    __LOG[1]('Tried to fetch', details.url, '...');

                    return reject(XHRname + " is missing!");
                } catch (ex) {
                    return reject(ex);
                }
                // NOTE Unreachable...
            });
    }

    async function getRequest(details) {
        const __H = { };
        const __D = { };

        Object.assign(__H, __HEADERS.FORM, __HEADERS.ACC, __HEADERS.SCRIPT, details.headers);
        Object.assign(__D, details, { 'headers' : __H }, __DETAILS.GET);

        const __RET = await xmlRequest(__D);

        return __RET;
    }

    async function putRequest(details) {
        const __H = { };
        const __D = { };

        Object.assign(__H, __HEADERS.FORM, __HEADERS.ACC, __HEADERS.SCRIPT, details.headers);
        Object.assign(__D, details, { 'headers' : __H }, __DETAILS.PUT);

        const __RET = await xmlRequest(__D);

        return __RET;
    }

    async function postRequest(details) {
        const __H = { };
        const __D = { };

        Object.assign(__H, __HEADERS.FORM, __HEADERS.ACC, __HEADERS.SCRIPT, details.headers);
        Object.assign(__D, details, { 'headers' : __H }, __DETAILS.PUT);

        const __RET = await xmlRequest(__D);

        return __RET;
    }

    async function headRequest(details) {
        const __H = { };
        const __D = { };

        Object.assign(__H, __HEADERS.FORM, __HEADERS.ACC, __HEADERS.SCRIPT, details.headers);
        Object.assign(__D, details, { 'headers' : __H }, __DETAILS.HEAD);

        const __RET = await xmlRequest(__D);

        return __RET;
    }

    async function browse(url, headers = { }, onload = onloadByStatus, onerror = onerrorDefault) {
        return await getRequest({
                'url'     : url,
                'headers' : headers,
                'onload'  : onload,
                'onerror' : onerror
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
                    __LOG[2](contentType);

                    doc = parser.parseFromString(result.responseText, contentType);

                    __LOG[5]("Parsed:", doc);
                } else {
                    __LOG[5]("Raw document", (result.responseType ? result.responseType : "*/*"));

                    doc = result.response;

                    //__LOG[6]("Parsed:", doc.slice(0, 256), '\n...\n', doc.slice(-256));
                }
            } catch (ex) {
                __LOG[1]("Parse error:", ex);
            }

            return doc;
        });

    return {
            browse,
            getRequest,
            putRequest,
            postRequest,
            headRequest,
            xmlRequest,
            registerCallback,
            __XMLREQUEST
        };
}

// ==================== Ende Fabrik fuer einen XHR-Handler ====================

// *** EOF ***
