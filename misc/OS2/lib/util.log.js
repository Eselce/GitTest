// ==UserScript==
// _name         util.log
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Logging und safeStringify()
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

/* eslint no-multi-spaces: "off" */
/* eslint dot-notation: "off" */

// ==================== Abschnitt fuer Logging ====================

// Ein Satz von Logfunktionen, die je nach Loglevel zur Verfuegung stehen. Aufruf: __LOG[level](text)
const __LOG = {
                  'logFun'    : [
                                    console.exception,  // [0] Error: Alert
                                    console.error,      // [1] Error: Error
                                    console.warn,       // [2] Warn:  Warning
                                    console.trace,      // [3] Log:   Release
                                    console.dir,        // [4] Log:   Info
                                    console.log,        // [5] Log:   Log
                                    console.dirxml,     // [6] Log:   Debug
                                    console.table,      // [7] Log:   Verbose
                                    console.info,       // [8] Info:  Very verbose
                                    console.debug       // [9] Debug: Testing
                                ],                      // [""] Log:  Table
                                                        // [true]     {
                                                        // [false]    }
                  'init'      : function(win, logLevel = 4) {
                                    // prototypejs macht Function.bind() untauglich (dadurch gibt es falsche Zeilennummern)...
                                    const __NOBIND = (this && this.Prototype && (this.Prototype.Version === '1.6.0.3'));

                                    for (let level = 0; level < this.logFun.length; level++) {
                                        this[level] = ((level > logLevel) ? function() { } : (__NOBIND ? this.logFun[level] :
                                                                this.logFun[level].bind(win.console, '[' + level + ']')));
                                    }
                                    this[""]    = this.logFun[7];   // console.table
                                    this[true]  = console.group;    // console.group
                                    this[false] = console.groupEnd; // console.groupEnd
                                },
                  'stringify' : safeStringify,      // JSON.stringify
                  'info'      : function(obj, showType = true, elementType = false) {
                                    const __KEYSTRINGS = ! showType;  // kompakte Schreibweise ohne Typ
                                    const __STEPIN = elementType;     // detailliertere Ausgabe der Elemente
                                    const __SHOWLEN = true;           // Laenge/Groesse immer angeben

                                    return getValStr(obj, __KEYSTRINGS, showType, __SHOWLEN, __STEPIN);
                                },
                  'changed'   : function(oldVal, newVal, showType, elementType, delim = " => ") {
                                    const __OLDVAL = this.info(oldVal, showType, elementType);      // this.stringify(oldVal)
                                    const __NEWVAL = this.info(newVal, showType, elementType);      // this.stringify(newVal)

                                    return ((__OLDVAL !== __NEWVAL) ? __OLDVAL + delim : "") + __NEWVAL;
                                }
              };

__LOG.init(window, 4);  // Zunaechst mal Loglevel 4, erneutes __LOG.init(window, __LOGLEVEL) im Hauptprogramm...

// ==================== Notizen zum console-Objekt fuer Logging ====================

// === Das console-Objekt ===
// __LOG[level](text):
// 0    E exception rot         nicht-aufgeklappt
// 1  * E error     rot trace   nicht-aufgeklappt
// --
// 2  * W warn      gelb        nicht-aufgeklappt
// --
// 3    L trace         trace   aufgeklappt
// 4    L dir                   aufgeklappt
// 5  * L log                   nicht-aufgeklappt
// 6    L dirxml                nicht-aufgeklappt
// 7    L table                 aufgeklappt-bei-Daten
// --
// 8  * I info                  nicht-aufgeklappt
// --
// 9    D debug                 nicht-aufgeklappt   (low-prio)
// --
// ""   L table                 aufgeklappt     (erzwungene-7)
// --
// true   group
// false  groupEnd

// Filter (im Konsolenfenster):
// E error  (i Kreis weiss rot gefuellt auf blassrot)   error exception
// W warn   (i Dreieck gelb gefuellt auf blassgelb)     warn
// L log    (leer)  log dir dirxml table trace (count timeEnd timeLog -time)
// I info   (i Kreis schwarz weiss gefuellt)            info
// D debug  (leer)                                      debug
// - -      (leer)                                      (group -groupEnd)

// Tabelle:
// table    Tabelle mit name und value Spalte
//
// console-Befehle:
// group/groupEnd/groupCollapsed
// time/timeEnd/timeLog
// clear
// count/countReset
// assert

// ==================== Abschnitt fuer UNUSED() ====================

// Makro fuer die Markierung bewusst ungenutzter Variablen und Parametern
// params: Beliebig viele Parameter, mit denen nichts gemacht wird
// return Liefert formal die Parameter zurueck
function UNUSED(...unused) {
    return unused;
}

// ==================== Ende Abschnitt fuer UNUSED() ====================

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
                UNUSED(key);

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
    UNUSED(key);

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
    UNUSED(key);

    if (Array.isArray(value)) {
        const __RET = value.map(function(element) {
                                    return safeStringify(element, replaceArray, 0);
                                });

        return __RET;
    }

    return value;
}

// ==================== Ende Abschnitt fuer safeStringify() ====================

// *** EOF ***
