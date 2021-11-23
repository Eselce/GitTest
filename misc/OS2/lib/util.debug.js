// ==UserScript==
// _name         util.debug
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Debugging, Error-Handling, usw.
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Debugging und Error-Handling ====================

// Gibt eine Meldung in der Console aus und oeffnet ggfa. ein Bestaetigungsfenster mit der Meldung
// label: Eine Ueberschrift
// message: Der Meldungs-Text
// data: Ein Wert. Ist er angegeben, wird er in der Console ausgegeben
// show: Angabe, ob neben Logs auch noch ein alert-Dialog aufpoppen soll (Default: true)
// return Liefert die Parameter zurueck
function showAlert(label, message, data = undefined, show = true) {
    __LOG[1](label + ": " + message);

    if (data !== undefined) {
        __LOG[2](data);
    }

    if (show) {
        alert(label + "\n\n" + message);
    }

    return arguments;
}

// Gibt eine Meldung in der Console aus und oeffnet ggfa. ein Bestaetigungsfenster
// mit der Meldung zu einer Exception oder einer Fehlermeldung
// label: Eine Ueberschrift
// ex: Exception oder sonstiges Fehlerobjekt
// show: Angabe, dass neben Logs auch ein alert-Dialog aufpoppen soll (Default: true)
// return Liefert die showAlert()-Parameter zurueck
function showException(label, ex, show = true) {
    if (ex && ex.message) {  // Exception
        return showAlert(label, ex.message, ex, show);
    } else {  // sonstiger Fehler
        return showAlert(label, ex, undefined, show);
    }
}

// Standard-Callback-Funktion fuer onRejected, also abgefangener Fehler
// in einer Promise bei Exceptions oder Fehler bzw. Rejections
// error: Parameter von reject() im Promise-Objekt, der von Promise.catch() erhalten wurde
// show: Angabe, dass neben Logs auch ein alert-Dialog aufpoppen soll (Default: true)
// return Liefert die showAlert()-Parameter zurueck
function defaultCatch(error, show) {
    // Sichern, dass error belegt ist (wie etwa bei GMs 'reject();' in 'GM_setValue())'...
    error = (error || new Error("Promise rejected!"));

    if ((typeof error) === 'string') {
        const __CODELINE = codeLine(true, false, true, false);
        const [ __FILENAME, __LINECOLNUMBER ] = __CODELINE.match(/(.*?):(\d+(?::\d+))/).slice(1, 3);  // [1], [2]

        error = {
                    message     : error,
                    fileName    : __FILENAME,
                    lineNumber  : __LINECOLNUMBER
                };
    } else if (error[2]) {  // Recatch...
        return Promise.reject(error);
    }

    try {
        const __LABEL = `[${error.lineNumber}] ${__DBMOD.Name}`;

        return Promise.reject(showException(__LABEL, error, show));
    } catch (ex) {
        return Promise.reject(showException(`[${ex && ex.lineNumber}] ${__DBMOD.Name}`, ex, true));
    }
}

// Ermittlung der gerade signifikanten Quellcode-Stelle des Programmablaufs
// ex: Exception, Error o.ae. mit 'stack' Eigenschaft, die ein Stacktrace enthaelt
// longForm: Ausgabe des vollen Pfades anstelle von nur dem Dateinamen und der Zeilennummer
// showFunName: Neben Datei und Zeilennummer zusaetzlich Funktionsnamen zurueckgeben (Default: false)
// ignoreCaller: Neben codeLine() auch den Caller ignorieren, als Zahl: Anzahl der Caller (Default: false)
// ignoreLibs (empfohlen): Ueberspringen von lib*.js-Eintraegen (ausser beim untersten Aufruf)
// return Liefert Dateiname:Zeilennummer des Aufrufers als String
function codeLineFor(ex, longForm = false, showFunName = false, ignoreCaller = false, ignoreLibs = true) {
    try {
        const __EX = (ex || { stack : "" });
        const __STACK = __EX.stack.split("\n");
        let countCaller = Number(ignoreCaller);  // Normalerweise 0 oder 1, bei 2 wird auch der naechste Aufrufer ignoriert!
        let ret;
        let nameLine;
        let funName;

        for (let i = 0; i < __STACK.length; i++) {
            const __LINE = __STACK[i];
            if (! __LINE) { break; }
            const [ __FUNNAME, __LOCATION ] = __LINE.split('@', 2);
            const __NAMELINE = getValue(__LOCATION, "").replace(/.*\//, ""); 

            if (countCaller-- > 0) {
                // Aufrufer wird ignoriert...
                continue;
            }

            if (ignoreLibs && __NAMELINE.match(/^lib\./)) {  // "lib.*"
                if (! ret) {
                    [ ret, nameLine, funName ] = [ __LOCATION, __NAMELINE, __FUNNAME ];
                }
                continue;
            }
            [ ret, nameLine, funName ] = [ __LOCATION, __NAMELINE, __FUNNAME ];
            break;
        }

        if (ret && ! longForm) {
            ret = nameLine;
        }

        return ret + (showFunName ? (':' + funName) : "");
    } catch (ex) {
        return showException("Error in codeLine()", ex);
    }
}

// Ermittlung der gerade signifikanten Quellcode-Stelle des Programmablaufs
// longForm: Ausgabe des vollen Pfades anstelle von nur dem Dateinamen und der Zeilennummer
// showFunName: Neben Datei und Zeilennummer zusaetzlich Funktionsnamen zurueckgeben (Default: false)
// ignoreCaller: Neben codeLine() auch den Caller ignorieren, als Zahl: Anzahl der Caller (Default: false)
// ignoreLibs (empfohlen): Ueberspringen von lib*.js-Eintraegen (ausser beim untersten Aufruf)
// return Liefert Dateiname:Zeilennummer des Aufrufers als String
function codeLine(longForm = false, showFunName = false, ignoreCaller = false, ignoreLibs = true) {
    const __IGNORECALLER = Number(ignoreCaller) + 1;   // codeLine() selber ignorieren!
    const __EX = Error();

    return codeLineFor(__EX, longForm, showFunName, __IGNORECALLER, ignoreLibs);
}

// ==================== Ende Abschnitt fuer Debugging, Error-Handling ====================

// *** EOF ***
