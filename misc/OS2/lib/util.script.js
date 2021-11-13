// ==UserScript==
// _name         util.script
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer das Laden, Starten und Benutzen von Skripten
// _require      https://eselce.github.io/OS2.scripts/lib/util.script.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer diverse Utilities fuer Skripte ====================

// Laedt ein Script dynamisch nach (ueber ein Script-Tag)
// url: URL der Script-Datei
// return Promise auf das Laden des Scriptes
function loadScript(url) {
    return new Promise(function(resolve, reject) {
            const __SCRIPT = document.createElement('script');

            __SCRIPT.type = 'text/javascript';
            __SCRIPT.src = url;
            //__SCRIPT.async = true;
            __SCRIPT.defer = true;
            __SCRIPT.onerror = reject;
            __SCRIPT.onload = resolve;

            //document.currentScript.parentNode.insertBefore(__SCRIPT, document.currentScript);
            document.head.appendChild(__SCRIPT);
        });
}

// Laedt ein Script dynamisch nach (ueber ein Script-Tag) und fuehrt daraufhin eine Funktion aus
// url: URL der Script-Datei
// fun: Auszufuehrende Funktion
// params: Parameterliste fuer den Aufruf der Funktion
// return Promise auf den Rueckgabewert dieser Funktion
function getScript(url, fun, ... params) {
    return loadScript(url).then(fun(... params),
                                () => {
                                        __LOG[1]("Failed to load", url);
                                    });
}

// ==================== Ende Abschnitt fuer diverse Utilities fuer Skripte ====================

// *** EOF ***
