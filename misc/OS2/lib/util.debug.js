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
    error = (error || Error("Promise rejected!"));

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

// ==================== Hilfsfunktionen fuer Typueberpruefungen ====================

// Funktion zum Testen eines Objekts auf eine bestimmte Basisklasse
// obj: Das zu ueberpruefende Objekt
// cls: Klasse, die Basisklasse sein muss
// strict: Wird ein nicht gesetzter Wert ebenfalls als falsch angesehen?
// label: Prefix fuer die Fehlerzeile
// objName: Name des Wertes oder der Variablen
// className: Name der Basisklasse
// throw Wirft im Fehlerfall einen TypeError
// return true, falls kein Error geworfen wurde
function checkObjClass(obj, cls, strict = false, label = "", objName = undefined, className = undefined) {
    const __TYPE = (className || cls);
    const __OBJ = (objName || "Object");
    const __LABEL = (label || "Error");

    return ((obj instanceof cls) || checkType(obj, 'object', strict, __LABEL, __OBJ, __TYPE));
}

// Funktion zum Testen eines Wertes auf einen bestimmten Typen
// value: Der zu pruefende Wert
// type: Erforderlicher Typ
// strict: Wird ein nicht gesetzter Wert ebenfalls als falsch angesehen?
// label: Prefix fuer die Fehlerzeile
// valName: Name des Wertes oder der Variablen
// typeName: Name des Typs fuer die Fehlermeldung
// throw Wirft im Fehlerfall (also, wenn der Typ nicht stimmt) einen TypeError
// return true, falls kein Error geworfen wurde
function checkType(value, type, strict = false, label = "", valName = undefined, typeName = undefined) {
    const __TYPE = (typeName || type);
    const __VAL = (valName || "Value");
    const __LABEL = (label || "Error");

    if (strict || ((value !== undefined) && (value !== null))) {
        if ((typeof value) !== type) {
            throw TypeError(__LABEL + ": " + __VAL + " should be a " + __TYPE + ", but was " +
                    __LOG.info(value, true, true) + ' ' + String(value));
        }
    }

    return true;
}

// Funktion zum Testen eines Wertes auf ein bestimmtes "Enum"-Objekt
// value: Der zu pruefende Wert
// enumObj: Objekt mit den "Enum"-Mappings (Typen)
// strict: Wird ein nicht gesetzter Wert ebenfalls als falsch angesehen?
// label: Prefix fuer die Fehlerzeile
// valName: Name des Wertes oder der Variablen
// enumName: Name des "Enums" fuer die Fehlermeldung
// throw Wirft im Fehlerfall (also, wenn der Typ nicht stimmt) einen TypeError
// return true, falls kein Error geworfen wurde
function checkEnumObj(value, enumObj, strict = false, label = "", valName = undefined, enumName = undefined) {
    const __TYPE = (enumName || enumObj);
    const __VAL = (valName || "Value");
    const __LABEL = (label || "Error");

    // enumObj sollte ein "Enum"-Objekt sein...
    checkType(enumObj, 'object', true, "checkEnumObj(" + __LOG.info(valName, false) + ')', "enumObj", "Object");

    if (strict || ((value !== undefined) && (value !== null))) {
        const __VALUES = Object.values(enumObj);
        if (! __VALUES.includes(value)) {
            throw TypeError(__LABEL + ": " + __VAL + " should be a " + __TYPE + ", but was " +
                    __LOG.info(value, true, true) + ' ' + String(value));
        }
    }

    return true;
}

// ==================== Ende Hilfsfunktionen fuer Typueberpruefungen ====================

// Ermittlung der gerade signifikanten Quellcode-Stelle des Programmablaufs
// ex: Exception, Error o.ae. mit 'stack' Eigenschaft, die ein Stacktrace enthaelt
// longForm: Ausgabe des vollen Pfades anstelle von nur dem Dateinamen und der Zeilennummer
// showFunName: Neben Datei und Zeilennummer zusaetzlich Funktionsnamen zurueckgeben (Default: false)
// ignoreCaller: Neben codeLine() auch den Caller ignorieren, als Zahl: Anzahl der Caller (Default: false)
// ignoreLibs (empfohlen): Ueberspringen von lib*.js-Eintraegen (ausser beim untersten Aufruf)
// return Liefert Dateiname:Zeilennummer des Aufrufers als String
function codeLineFor(ex, longForm = false, showFunName = false, ignoreCaller = false, ignoreLibs = true) {
    try {
        const __EX = ((ex && ex.stack) ? ex : Error());
        const __EXSTACK = __EX.stack;
        const __STACK = __EXSTACK.split("\n");
        const __CHROMESTYLE = ! (~ __EXSTACK.indexOf('@'));  // "at" statt '@'-Stil (Chrome, Edge, Opera)
        const __START = (ex ? 0 : 1);  // Falls __EX hier produziert wurde, codeLineFor() selbst ignorieren!
        let countCaller = Number(ignoreCaller);  // Normalerweise 0 oder 1, bei 2 wird auch der naechste Aufrufer ignoriert!
        let ret;
        let nameLine;
        let funName;

        if (__CHROMESTYLE) {
            // In diesem Stil steht in der ersten Zeile des Stacks der Fehlertext drin...
            (__STACK.length && __STACK.shift());

            // Umformatierung auf Firefox-Stil...
            for (let i = 0; i < __STACK.length; i++) {
                __STACK[i] = __STACK[i].replace(
                                    /^    at async /, "    at async*").replace(
                                    /^    at ([ \.\*\w]+) \((\S+)\)$/, "$1@$2").replace(
                                    /^    at (\S+)$/, "@$1");
            }
        }

        for (let i = __START; i < __STACK.length; i++) {
            const __LINE = __STACK[i];

            //__LOG[9]("STACK[" + i + "]:", __LINE.replace('@', " @ "));
            if (! __LINE) { break; }

            const [ __FUNNAME, __LOCATION ] = __LINE.split('@', 2);
            const __NAMELINE = getValue(__LOCATION, "").replace(/.*\//, ""); 

            if (countCaller-- > 0) {
                // Aufrufer wird ignoriert...
                continue;
            }

            if (! checkCodeLineBlacklist(__FUNNAME, __NAMELINE)) {
                // Eintrag steht auf einer Blacklist und wird ignoriert... 
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

        return getValue(ret, "") + (showFunName ? (':' + funName) : "");
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

// Prueft, ob die uebergebene Kombination aus Funktions- und Dateinamen auf keiner Blacklist steht
// Grundlage dafuer sind die beiden Objekte __CODELINEBLACKLIST und __CODELINEBLACKLISTREGEXP
// funName: Zu pruefender Funktions-Name (Zusaetze wie 'promise callback*', 'async*' oder '/<' werden vorher entfernt)
// fileName: Name der pruefenden Datei, in der die Funktion vorkommt (Endung '.js' und Zeilen-/Spaltennummer entfernt)
// return: true, wenn gueltig; false, wenn auf einer Blacklist gefuehrt
function checkCodeLineBlacklist(funName, fileName, strictFileName = false) {
    checkType(funName, 'string', true, 'checkCodeLineBlacklist()', "funName", 'String');
    checkType(fileName, 'string', true, 'checkCodeLineBlacklist()', "fileName", 'String');

    const __FILEMATCH = fileName.match(/^([\.\w]+)\.js:/);

    if ((! __FILEMATCH) || (__FILEMATCH.length < 2)) {
        // Kein regulaerer Filename, der auf die Blacklist gesetzt werden kann...
        return true;
    }

    const __FUNNAME = funName.replace(/^[ \w]+\*/, "").replace(/(\/<)+$/, "");
    const __FILENAME = __FILEMATCH[1];
    const __ENTRY = __CODELINEBLACKLIST[__FUNNAME];
    const __REGEXPKEYS = Object.keys(__CODELINEBLACKLISTREGEXP);

    if ((__FILENAME === __ENTRY) || (__ENTRY && ! strictFileName)) {
        // Statischer Blacklist-Eintrag...
        return false;
    }

    for (let key of __REGEXPKEYS) {
        if (__FUNNAME.match(key)) {
            const __VALUE = __CODELINEBLACKLISTREGEXP[key];

            if (__FILENAME === __VALUE) {  // ohne strictFileName!
                // Dynamischer Blacklist-Eintrag...
                return false;
            }
        }
    }

    return true;
}

// Funktionen-Blacklist fuer codeLine() - Funktion vs. Modul (ggfs. strict)...
const __CODELINEBLACKLIST = {
        'ASSERT'            :   'test.assert',
        'ASSERT_NOT'        :   'test.assert',
        'assertionCatch'    :   'test.assert',
        'callPromiseChain'  :   'util.promise',
        'promiseCatch'      :   'util.promise',
        'promiseChainCatch' :   'util.promise',
        'codeLine'          :   'util.debug',
        'defaultCatch'      :   'util.debug',
        'checkOpt'          :   'util.option.data'
    };

// Funktionen-Blacklist fuer codeLine() - Funktionsmuster vs. Modul (immer strict)...
const __CODELINEBLACKLISTREGEXP = {
        'ASSERT_\\w+'       :   'test.assert'
    };

// ==================== Ende Abschnitt fuer Debugging, Error-Handling ====================

// *** EOF ***
