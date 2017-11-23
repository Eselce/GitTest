// ==UserScript==
// _name         util.debug
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Logging, Debugging, Error-Handling, usw.
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Logging, Debugging, Error-Handling ====================

// ==================== Abschnitt fuer Logging ====================

// Ein Satz von Logfunktionen, die je nach Loglevel zur Verfuegung stehen. Aufruf: __LOG[level](text)
const __LOG = {
                  'logFun'    : [
                                    console.error,  // [0] Alert
                                    console.error,  // [1] Error
                                    console.log,    // [2] Log: Release
                                    console.log,    // [3] Log: Info
                                    console.log,    // [4] Log: Debug
                                    console.log,    // [5] Log: Verbose
                                    console.log,    // [6] Log: Very verbose
                                    console.log     // [7] Log: Testing
                                ],
                  'init'      : function(win, logLevel = 1) {
                                    for (let level = 0; level < this.logFun.length; level++) {
                                        this[level] = ((level > logLevel) ? function() { } : this.logFun[level]);
                                    }
                                },
                  'stringify' : safeStringify,      // JSON.stringify
                  'changed'   : function(oldVal, newVal) {
                                    const __OLDVAL = this.stringify(oldVal);
                                    const __NEWVAL = this.stringify(newVal);

                                    return ((__OLDVAL !== __NEWVAL) ? __OLDVAL + " => " : "") + __NEWVAL;
                                }
              };

// __LOG.init(window, __LOGLEVEL);

// ==================== Abschnitt fuer safeStringify() ====================

// Sicheres JSON.stringify(), das auch mit Zyklen umgehen kann
// value: Auszugebene Daten. Siehe JSON.stringify()
// replacer: Elementersetzer. Siehe JSON.stringify()
// space: Verschoenerung. Siehe JSON.stringify()
// cycleReplacer: Ersetzer im Falle von Zyklen
// return String mit Ausgabe der Objektdaten
function safeStringify(value, replacer = undefined, space = undefined, cycleReplacer = undefined) {
    return JSON.stringify(value, serializer(replacer, cycleReplacer), space);
}

// Hilfsfunktion fuer safeStringify(): Kapselt replacer und einen cycleReplacer fuer Zyklen
// replacer: Elementersetzer. Siehe JSON.stringify()
// cycleReplacer: Ersetzer im Falle von Zyklen
// return Ersetzer-Funktion fuer JSON.stringify(), die beide Ersetzer vereint
function serializer(replacer = undefined, cycleReplacer = undefined) {
    const __STACK = [];
    const __KEYS = [];

    if (! cycleReplacer) {
        cycleReplacer = function(key, value) {
                if (__STACK[0] === value) {
                    return "[~]";
                }
                return "[~." + __KEYS.slice(0, __STACK.indexOf(value)).join('.') + ']';
            };
    }

    return function(key, value) {
            if (__STACK.length) {
                const __THISPOS = __STACK.indexOf(this);

                if (~ __THISPOS) {
                    __STACK.splice(__THISPOS + 1);
                    __KEYS.splice(__THISPOS, Infinity, key);
                } else {
                    __STACK.push(this);
                    __KEYS.push(key);
                }
                if (~ __STACK.indexOf(value)) {
                    value = cycleReplacer.call(this, key, value);
                }
            } else {
                __STACK.push(value);
            }

            return ((! replacer) ? value : replacer.call(this, key, value));
        };
}

// Replacer fuer JSON.stringify() oder safeStringify(), der Arrays kompakter darstellt
// key: Der uebergebene Schluessel
// value: Der uebergebene Wert
// return Fuer Arrays eine kompakte Darstellung, sonst derselbe Wert
function replaceArraySimple(key, value) {
    if (Array.isArray(value)) {
        return "[ " + value.join(", ") + " ]";
    }

    return value;
}

// Replacer fuer JSON.stringify() oder safeStringify(), der Arrays kompakter darstellt
// key: Der uebergebene Schluessel
// value: Der uebergebene Wert
// return Fuer Arrays eine kompakte Darstellung, sonst derselbe Wert
function replaceArray(key, value) {
    if (Array.isArray(value)) {
        __RET = value.map(function(element) {
                              return safeStringify(element, replaceArray, 0);
                          });

        return __RET;
    }

    return value;
}

// ==================== Ende Abschnitt fuer safeStringify() ====================

// ==================== Abschnitt fuer Debugging und Error-Handling ====================

// Gibt eine Meldung in der Console aus und oeffnet ein Bestaetigungsfenster mit der Meldung
// label: Eine Ueberschrift
// message: Der Meldungs-Text
// data: Ein Wert. Ist er angegeben, wird er in der Console ausgegeben
// return Liefert die Parameter zurueck
function showAlert(label, message, data = undefined) {
    __LOG[0](label + ": " + message);

    if (data !== undefined) {
        __LOG[2](data);
    }

    alert(label + "\n\n" + message);

    return arguments;
}

// Gibt eine Meldung in der Console aus und oeffnet ein Bestaetigungsfenster
// mit der Meldung zu einer Exception oder einer Fehlermeldung
// label: Eine Ueberschrift
// ex: Exception oder sonstiges Fehlerobjekt
// return Liefert die showAlert()-Parameter zurueck
function showException(label, ex) {
    if (ex && ex.message) {  // Exception
        showAlert(label, ex.message, ex);
    } else {  // sonstiger Fehler
        showAlert(label, ex);
    }
}

// Standard-Callback-Funktion fuer onRejected, also abgefangener Fehler
// in einer Promise bei Exceptions oder Fehler bzw. Rejections
// error: Parameter von reject() im Promise-Objekt, der von Promise.catch() erhalten wurde
// return Liefert die showAlert()-Parameter zurueck
function defaultCatch(error) {
    try {
        const __LABEL = `[${error.lineNumber}] ${__DBMOD.Name}`;

        if (error && error.message) {  // Exception
            return showException(__LABEL, error.message, error);
        } else {
            return showException(__LABEL, error);
        }
    } catch (ex) {
        return showException(`[${ex.lineNumber}] ${__DBMOD.Name}`, ex.message, ex);
    }
}

// ==================== Ende Abschnitt fuer Logging, Debugging, Error-Handling ====================

// *** EOF ***
