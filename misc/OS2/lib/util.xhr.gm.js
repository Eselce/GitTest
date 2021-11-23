// ==UserScript==
// _name         util.xhr.gm
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer GM XHR-Aufrufe
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.xhr.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.xhr.gm.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Ermittlung der vorhandenen Greasemonkey Funktionen ====================

const __GM3REQUEST = (('undefined' !== typeof GM_xmlhttpRequest) ? GM_xmlhttpRequest : undefined);  // GM 3.x and earlier
const __GM4REQUEST = (('undefined' !== typeof GM)                ? GM.xmlHttpRequest : undefined);  // GM 4.0+
const __CHECKFUN   = (fun => (('function' === typeof fun) ? fun : undefined));

const __GMREQUEST = (__CHECKFUN(__GM4REQUEST) || __CHECKFUN(__GM3REQUEST));

// ==================== Ende Ermittlung der vorhandenen Greasemonkey Funktionen ====================

// ==================== Greasemonkey XHR-Handler ====================

if (__GMREQUEST !== undefined) {
    // openGMXMLHttpRequest(XHRrequest, details): Aufbau einer Verbindung ueber Verbindungsdetails
    // XHRrequest: Verbindungs-Objekt
    // details: Verbindungsdetails zur Verbindung
    // - method: Art der Verbindung ('GET', 'POST', 'PUT', 'HEAD', 'DELETE'...)
    // - url: Ziel der Verbindung
    // - onload: Event-Listener fuer das Laden
    // - async: true/false, ob asynchrone Verbindung
    // - ...
    // return Antwort-Promise auf die Verbindung
    this.openGMXMLHttpRequest = async function(XMLrequest, details) {
        const __REQUEST = XMLrequest;
        const __D = details;

        __REQUEST;

        return await __GMREQUEST(__D);
    }
}

// Der Greasemonkey XHR-Handler...
const __GM_XHR = XHRfactory('Greasemonkey XHR handler', GMXMLHttpRequest, this.openGMXMLHttpRequest);

// ==================== Ende Greasemonkey XHR-Handler ====================

// ==================== Abschnitt fuer Klasse GMXMLHttpRequest ====================

// Eventuell fuer spaetere Erweiterungen: Klasse des Verbindungs-Objekts eines XHR-Requests...
// Bisher leer, da GM.xmlHttpRequest(details) in der openGMXMLHttpRequest()-Funktion bereits alles erledigt!
function GMXMLHttpRequest() { }

// ==================== Ende Abschnitt fuer Klasse GMXMLHttpRequest ====================

// *** EOF ***
