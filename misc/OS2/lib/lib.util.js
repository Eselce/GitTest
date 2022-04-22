/****** JavaScript-Bibliothek 'lib.util.js' ["UTIL"] ******/

// Inhaltsverzeichnis:
// https://eselce.github.io/GitTest/misc/OS2/lib/<UTIL>: 
//  util.log.js
//  util.object.js
//  util.value.js
//  util.proto.js
//  util.prop.js
//  util.mem.sys.js
//  util.mem.mod.js
//  util.debug.js
//  util.store.js
//  util.xhr.js
//  util.xhr.gm.js
//  util.dom.js
//  util.script.js

/*** Modul util.log.js ***/

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

// Polyfill fuer console.exception() (wenn es kein Firefox ist)...
if ((typeof console.exception) === 'undefined') {  // Chrome, Edge, Opera, ...
    console.exception = console.error;
    console.dirlog = console.log;
    console.verbose = console.table;
} else {  // Firefox, ...
    console.dirlog = console.dir;
    console.verbose = console.log;
}

// Ein Satz von Logfunktionen, die je nach Loglevel zur Verfuegung stehen. Aufruf: __LOG[level](text)
const __LOG = {
                  'logFun'    : [
                                    console.exception,  // [0] Error: Alert
                                    console.error,      // [1] Error: Error
                                    console.warn,       // [2] Warn:  Warning
                                    console.trace,      // [3] Log:   Release
                                    console.dirlog,     // [4] Log:   Info
                                    console.log,        // [5] Log:   Log
                                    console.dirxml,     // [6] Log:   Debug
                                    console.verbose,    // [7] Log:   Verbose
                                    console.info,       // [8] Info:  Very verbose
                                    console.debug       // [9] Debug: Testing
                                ],                      // [""] Log:  Table
                                                        // [true]     {
                                                        // [false]    }
                  'init'      : function(win, logLevel = 4, show = true) {
                                    // prototypejs 1.6.0.3 macht Function.bind() untauglich (dadurch gibt es falsche Zeilennummern)...
                                    const __NOBIND = (((typeof Prototype) !== 'undefined') ? (Prototype.Version === '1.6.0.3') : false);
                                    //const __NOBIND = ([true].reduce(() => false, true));  // Heuristik ueber Array.prototype.reduce
                                    const __BINDTO = (__NOBIND ? null : (win ? win.console : console));

                                    for (let level = 0; level < this.logFun.length; level++) {
                                        this.createFun(level, ((level > logLevel) ? null : this.logFun[level]), __BINDTO);
                                    }
                                    this.createFun('""',    console.table);     // console.table
                                    this.createFun("!",     console.assert);    // console.assert(cond, ...)
                                    this.createFun(true,    console.group);     // console.group(name)
                                    this.createFun(false,   console.groupEnd);  // console.groupEnd

                                    if (this.__NOBIND === undefined) {
                                        this.__NOBIND = __NOBIND;
                                        if (this.__NOBIND) {
                                            __LOG[2]("Prototype", Prototype.Version, "detected!");
                                        }
                                    }

                                    this.__LOGLEVEL = logLevel;
                                    if (show) {
                                        __LOG[2]("Loglevel:", this.__LOGLEVEL);
                                    }

                                    return this.__LOGLEVEL;
                                },
                  'createFun' : function(name, fun, bindTo = undefined) {
                                    let ret;

                                    if (! fun) {
                                        ret = function() { };
                                    } else {
                                        if (bindTo) {
                                            ret = fun.bind(bindTo, '[' + name + ']');
                                        } else {
                                            ret = fun;
                                        }
                                    }

                                    return (this[name] = ret);
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

__LOG.init(window, 4, false);  // Zunaechst mal Loglevel 4, erneutes __LOG.init(window, __LOGLEVEL) im Hauptprogramm...

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
// return Liefert formal die Parameter zurueck (wenn moeglich, als Skalar, sonst Array)
function UNUSED(... unused) {
    return ((unused.length < 2) ? unused[0] : unused);
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
                    __KEYS.splice(__THISPOS, Number.POSITIVE_INFINITY, key);
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

/*** Ende Modul util.log.js ***/

/*** Modul util.object.js ***/

// ==UserScript==
// _name         util.object
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Details zu Objekten, Arrays, etc.
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer diverse Utilities fuer Object, Array, etc. ====================

// ==================== Abschnitt fuer detaillierte Ausgabe von Daten ====================

// Fuehrt eine Map-Function auf ein Object aus und liefert ein neues Objekt zurueck.
// Zusaetzlich kann die Auswahl der Elemente per Filter eingeschraenkt werden sowie
// das Ergebnis sortiert (Default nach Wert, aber auch nach Schluessel).
// Um weitere Konflikte mit prototype.js zu vermeiden, wird die Methode Object.Map genannt
// obj: Das Object, das gemappt wird
// mapFun: Eine Mapping-Funktion (value [, key [, index [, array]]])
// - value: Wert
// - key: Schluessel
// - index: lfd. Nummer des Eintrags
// - array: entries() des Objekts obj
// | Alternativ Ein zu setzender Wert (keine Funktion)
// thisArg: Wert, der als this verwendet wird, wenn mapFun, filterFun und sortFun ausgefuehrt werden (Default: obj)
// filterFun: Eine Filter-Funktion auf (value [, key [, index [, array]]]) (Default: alle Elemente)
// - value: Wert
// - key: Schluessel
// - index: lfd. Nummer des Eintrags
// - array: entries() des Objekts obj
// | Alternativ undefined, null: alle Elemente
// | Alternativ Ein (schwach "==") zu vergleichender Wert (keine Funktion)
// sortFun: Eine Sortier-Funktion auf (value1, value2 [, key1, key2])
// - value1: Erster Wert
// - value2: Zweiter Wert
// - key1: Erster Schluessel
// - key2: Zweiter Schluessel
// | Alternativ undefined, false: unsortiert
// | Alternativ true: Normale Sortierung anhand der UTF-16 Codepoints
// return Ein neues Object mit gemappten Werten
Object.Map = function(obj, mapFun, thisArg, filterFun, sortFun) {
    if (! obj) {
        __LOG[3]("Object.Map():", "Keine Aktion bei leerem Objekt", obj);

        return obj;
    } else if ((typeof obj) === 'object') {
        const __THIS = (thisArg || obj);
        const __MAPFUN = (((typeof mapFun) === 'function')
                          ? (([key, value], index) => [key, mapFun.call(__THIS, value, key, index, __FILTERARR)])
                          : (([key, ]) => [key, mapFun]));
        const __FILTERFUN = ((filterFun == undefined)
                             ? (() => true)
                             : (((typeof filterFun) === 'function')
                                ? (([key, value], index) => [key, filterFun.call(__THIS, value, key, index, __ARR)])
                                : (([ , value]) => (value == filterFun))));
        const __SORTFUN = ((sortFun === true)
                           ? undefined
                           : (([key1, value1], [key2, value2]) => sortFun.call(__THIS, value1, value2, key1, key2)));
        const __ARR = Object.entries(obj);
        const __FILTERARR = __ARR.filter(__FILTERFUN);  // [, __THIS] wird bereits erledigt
        const __MAPPEDARR = __FILTERARR.map(__MAPFUN);  // [, __THIS] wird bereits erledigt

        return Object.fromEntries(((sortFun) ? __MAPPEDARR.sort(__SORTFUN) : __MAPPEDARR));
    } else {
        __LOG[1]("Object.map():", "Illegales Objekt erhalten", obj);

        return obj;
    }
}

// Liefert Datentyp und detaillierte Angaben zu einem Objekt aller Art, also Object, Array, Function, String, etc.
// obj: Das Objekt, um das es geht
// keyStrings: Nutzt bei Strings '' statt ""
// showLen: Die Groesse/Laenge wird mit angegeben
// stepIn: Eingelagerte Objekte werden rekursiv aufgeloest
// return [typ, valstr]: Liefert Datentyp des Objekts und Ausgabestring mit den Details
function getObjInfo(obj, keyStrings, longForm, stepIn) {
    const __TYPEOF = (typeof obj);
    const __VALUEOF = Object.valueOf(obj);
    const __LENGTH = ((obj != undefined) ? ((__TYPEOF === 'object') ? Object.entries(obj) : obj).length : obj);
    const __STRDELIM1 = (keyStrings ? "'" : '"');
    const __STRDELIM2 = (keyStrings ? "'" : '"');
    const __NUMDELIM1 = (keyStrings ? "" : '\u2039');  // '<'
    const __NUMDELIM2 = (keyStrings ? "" : '\u203A');  // '>'
    const __SYMDELIM1 = (keyStrings ? "" : '(');
    const __SYMDELIM2 = (keyStrings ? "" : ')');
    const __SPACE = (keyStrings ? "" : ' ');
    const __ARRDELIM = ',' + __SPACE;
    const __ARRDELIM1 = '[';
    const __ARRDELIM2 = ']';
    const __OBJSETTER = __SPACE + ':' + __SPACE;
    const __OBJDELIM = ',' + __SPACE;
    const __OBJDELIM1 = '{';
    const __OBJDELIM2 = '}';
    const __LENSTR = (__LENGTH ? __ARRDELIM1 + __LENGTH + __ARRDELIM2 : "");
    const __VALUESTR = ((__TYPEOF === 'symbol') ? __LOG.info(getValue(Symbol.keyFor(obj), ""), false) : String(obj));
    let typeStr = __TYPEOF;
    let valueStr = __VALUESTR;

    switch (__TYPEOF) {
    case 'undefined'  : break;
    case 'string'     : typeStr = 'String';
                        valueStr = __STRDELIM1 + valueStr + __STRDELIM2;
                        break;
    case 'boolean'    : typeStr = 'Boolean';
                        break;
    case 'number'     : if (Number.isInteger(obj)) {
                            typeStr = 'Integer';
                        } else {
                            typeStr = 'Number';
                            valueStr = __NUMDELIM1 + valueStr + __NUMDELIM2;
                        }
                        break;
    case 'function'   : longForm = false;
                        valueStr = valueStr.substr(typeStr.length);
                        break;
    case 'symbol'     : typeStr = 'Symbol';
                        longForm = false;
                        valueStr = __SYMDELIM1 + valueStr + __SYMDELIM2;
                        break;
    case 'object'     : if (Array.isArray(obj)) {
                            const __VALSTR = (__LENGTH ? obj.map(item => getValStr(item, false, stepIn, longForm, stepIn)).join(__ARRDELIM) : "");

                            typeStr = 'Array';
                            valueStr = __ARRDELIM1 + (__LENGTH ? __SPACE + __VALSTR + __SPACE : "") + __ARRDELIM2;
                        } else {
                            const __CLASS = getClass(obj);
                            const __CLASSNAME = (__CLASS ? getClassName(obj) : "");
                            const __VALSTR = (__LENGTH ? Object.values(Object.Map(obj, (value, key) => (getValStr(key, true) + __OBJSETTER
                                            + getValStr(value, false, stepIn, longForm, stepIn)))).join(__OBJDELIM) : "");

                            typeStr = (__CLASSNAME ? __CLASSNAME : typeStr);
                            valueStr = __OBJDELIM1 + (__LENGTH ? __SPACE + __VALSTR + __SPACE : "") + __OBJDELIM2;
                        }
                        break;
    default :           break;
    }

    if (obj == undefined) {
        if (obj === undefined) {  // sic!
            valueStr = "";
        } else {  // null o.ae.
            valueStr = __VALUESTR;
        }
    }

    return [
                typeStr + (longForm ? __LENSTR : ""),
                valueStr,
                __TYPEOF,
                __VALUEOF,
                __LENGTH
            ];
}

// Liefert detaillierte Angaben zu einem Objekt aller Art, also Object, Array, Function, String, etc.
// obj: Das Objekt, um das es geht
// keyStrings: Nutzt bei Strings '' statt ""
// showType: Der Datentyp wird mit angegeben
// showLen: Die Groesse/Laenge wird mit angegeben
// stepIn: Eingelagerte Objekte werden rekursiv aufgeloest
// return Ausgabestring mit den Details
function getValStr(obj, keyStrings, showType, showLen, stepIn) {
    if (obj === undefined) {
        // Bei undefined ergibt sich immer 'undefined', egal wie die Parameter gesetzt sind...
        return String(obj);
    }

    const [ __TYPESTR, __VALUESTR ] = getObjInfo(obj, keyStrings, showLen, stepIn);

    return (showType ? __TYPESTR + ' ' : "") + __VALUESTR;
}

// ==================== Ende Abschnitt fuer detaillierte Ausgabe von Daten ====================

// ==================== Abschnitt Hilfsfunktionen fuer Array-Mapping ====================

// Hilfsfunktion, die Array.from() auch fuer Objekte ermoeglicht, die nicht 'array-like' sind.
// Empfehlenswert ist allerdings, dass die Schluessel positive Integer sind.
// obj: Objekt mit key => value
// mapFun (optional): Callback-Funktion, die waehrend der Konvertierung angewandt wird (siehe Array.from())
// - element: Zu mappender Wert
// - index: Index-Position im Array
// - array: Das gesamte Array
// thisArg (optional): Ggfs. zu nutzendes alternatives this fuer den Callback-Aufruf
// return Neues Array mit demselben Mapping wie das Original-Objekt
function Arrayfrom(obj, mapFun, thisArg) {
    if (! obj) {
        return obj;
    }

    checkType(obj, 'object', true, 'Arrayfrom', 'obj', 'Object');
    checkType(mapFun, 'function', false, 'Arrayfrom', 'mapFun', 'Function');

    const __RET = [];

    Object.entries(obj).forEach(([key, value]) => {
            const __VALUE = (mapFun ? mapFun.call(thisArg, value) : value);

            __RET[key] = __VALUE;
        });

    return __RET;
}

// Kehrt das Mapping eines Objekts um und liefert ein neues Array zurueck.
// obj: Objekt mit key => value
// keyValFun: Konvertierfunktion fuer die neuen Werte aus den alten Schluesseln
// - newValue: Neuer Wert (zu konvertierender alter Schluessel)
// - newKey: Neuer Schluessel (konvertierter alter Wert)
// - newObj: Neues Array (im Aufbau, alles konvertiert)
// - oldObj (optional): Altes Objekt als Referenz (als key ist newValue benutzbar)
// - return Konvertierter neuer Wert
// valuesFun: Funktion zur Ermittlung der neuen Schluessel aus alten Werten (Default: Object.values)
// - obj: Objekt, das an reverseMapping uebergeben wurde
// - return Liste aller alten Werte als Array, aus denen sich die neuen Schluessel ergeben
// valKeyFun: Konvertierfunktion fuer die neuen Schluessel aus den alten Werten
// - value: Alter Wert (unveraendert, zu konvertieren zum neuen Schluessel)
// - key: Alter Schluessel (unveraendert, wird spaeter zum neuen Wert konvertiert)
// - obj: Altes Objekt (mit allen Eintraegen, sollte unveraendert bleiben!)
// - return Konvertierter neuer Schluessel
// return Neues Objekt mit value => key (doppelte value-Werte fallen heraus!)
// Dabei werden die value-Werte zunaechst ueber valKeyFun zu neuen Schluesseln.
// Ausserdem werden die key-Werte zunaechst ueber keyValFun zu neuen Werten! 
function reverseArray(obj, keyValFun, valuesFun, valKeyFun) {
    return Arrayfrom(reverseMapping(obj, keyValFun, valuesFun, valKeyFun));
}

// ==================== Ende Abschnitt Hilfsfunktionen fuer Array-Mapping ====================

// ==================== Abschnitt Hilfsfunktionen fuer Object-Mapping ====================

// Kehrt das Mapping eines Objekts um und liefert ein neues Objekt zurueck.
// obj: Objekt mit key => value
// keyValFun: Konvertierfunktion fuer die neuen Werte aus den alten Schluesseln
// - newValue: Neuer Wert (zu konvertierender alter Schluessel)
// - newKey: Neuer Schluessel (konvertierter alter Wert)
// - newObj: Neues Objekt (im Aufbau, alles konvertiert)
// - oldObj (optional): Altes Objekt als Referenz (als key ist newValue benutzbar)
// - return Konvertierter neuer Wert
// valuesFun: Funktion zur Ermittlung der neuen Schluessel aus alten Werten (Default: Object.values)
// - obj: Objekt, das an reverseMapping uebergeben wurde
// - return Liste aller alten Werte als Array, aus denen sich die neuen Schluessel ergeben
// valKeyFun: Konvertierfunktion fuer die neuen Schluessel aus den alten Werten
// - value: Alter Wert (unveraendert, zu konvertieren zum neuen Schluessel)
// - key: Alter Schluessel (unveraendert, wird spaeter zum neuen Wert konvertiert)
// - obj: Altes Objekt (mit allen Eintraegen, sollte unveraendert bleiben!)
// - return Konvertierter neuer Schluessel
// return Neues Objekt mit value => key (doppelte value-Werte fallen heraus!)
// Dabei werden die value-Werte zunaechst ueber valKeyFun zu neuen Schluesseln.
// Ausserdem werden die key-Werte zunaechst ueber keyValFun zu neuen Werten! 
function reverseMapping(obj, keyValFun, valuesFun, valKeyFun) {
    if (! obj) {
        return obj;
    }

    try {
        checkType(obj, 'object', true, 'reverseMapping', 'obj', 'Object');
        checkType(keyValFun, 'function', false, 'reverseMapping', 'keyValFun', 'Function');
        checkType(valuesFun, 'function', false, 'reverseMapping', 'valuesFun', 'Function');
        checkType(valKeyFun, 'function', false, 'reverseMapping', 'valKeyFun', 'Function');

        const __KEYSFUN = Object.keys;
        const __VALUESFUN = (valuesFun || Object.values);
        const __OLDKEYS = getValue(__KEYSFUN(obj), []);
        const __OLDVALUES = getValue(__VALUESFUN(obj), []);
        const __RET = { };

        __OLDKEYS.forEach((key, index) => {
                const __VALUE = __OLDVALUES[index];
                const __NEWKEYS = (valKeyFun ? valKeyFun(__VALUE, index, __OLDVALUES) : __VALUE);
                const __NEWVALUE = (keyValFun ? keyValFun(key, __NEWKEYS, __RET, obj) : key);

                if (Array.isArray(__NEWKEYS)) {
                    __NEWKEYS.forEach(key => (__RET[key] = __NEWVALUE));
                } else {
                    __RET[__NEWKEYS] = __NEWVALUE;
                }
            });

        return __RET;
    } catch (ex) {
        showException('[' + (ex && ex.lineNumber) + "] reverseMapping()", ex);
    }
}

// Erzeugt ein Mapping innerhalb der Werte eines Objekts ueber Spaltenindizes.
// Ein Spaltenindex von -1 (bzw. undefined oder null) referenziert dabei die Schluessel.
// obj: Objekt mit key => value
// keyIndex: Spaltenindex fuer die neuen Schluessel (-1 fuer alte Schluessel) (Default: -1)
// valueIndex: Spaltenindex fuer die neuen Werte (-1 fuer alte Schluessel) (Default: 0 fuer 1. Spalte)
// keyValFun: Konvertierfunktion fuer die neuen Werte aus den alten Schluesseln
// - newValue: Neuer Wert (zu konvertieren)
// - newKey: Neuer Schluessel (konvertiert)
// - newObj: Neues Objekt (im Aufbau, alles konvertiert)
// - oldObj (optional): Altes Objekt als Referenz (als key ist newValue benutzbar)
// - return Konvertierter neuer Wert
// valKeyFun: Konvertierfunktion fuer die neuen Schluessel aus der Schluesselspalte
// - value: Alter Wert (unveraendert, zu konvertieren zum neuen Schluessel)
// - key: Alter Schluessel (unveraendert)
// - obj: Altes Objekt (mit allen Eintraegen, sollte unveraendert bleiben!)
// - return Konvertierter neuer Schluessel
// return Neues Objekt mit value[keyIndex] => value[valueIndex]
//        (doppelte value-Werte fallen heraus!)
// Dabei werden die value-Werte zunaechst ueber valKeyFun zu neuen Schluesseln.
// Ausserdem werden die key-Werte zunaechst ueber keyValFun zu neuen Werten! 
function selectMapping(obj, keyIndex = -1, valueIndex = 0, keyValFun, valKeyFun) {
    checkType(obj, 'object', true, 'selectMapping', 'obj', 'Object');
    checkType(keyIndex, 'number', true, 'selectMapping', 'keyIndex', 'Number');
    checkType(valueIndex, 'number', true, 'selectMapping', 'valueIndex', 'Number');
    checkType(keyValFun, 'function', false, 'selectMapping', 'keyValFun', 'Function');
    checkType(valKeyFun, 'function', false, 'selectMapping', 'valKeyFun', 'Function');

    const __KEYVALFUN = mappingValueSelect.bind(this, valueIndex, keyValFun);
    const __VALUESFUN = mappingValuesFunSelect.bind(this, keyIndex);
    const __VALKEYFUN = valKeyFun;

    return reverseMapping(obj, __KEYVALFUN, __VALUESFUN, __VALKEYFUN);
}

// Standard-Konvertierfunktion fuer die neuen Werte aus den alten Schluesseln
// fuer die Funktion reverseMapping() (legt Array mit allen Schluesseln an).
// Ohne Konvertierfunktion wuerde immer nur der letzte Schluessel gemerkt werden!
// value: Neuer Wert (zu konvertierender alter Schluessel)
// key: Neuer Schluessel (konvertierter alter Wert)
// obj: Neues Objekt (im Aufbau, alles konvertiert)
// return Konvertierter neuer Wert (in Form eines Arrays)
function mappingPush(value, key, obj) {
    return pushObjValue(obj, key, value, null, true, false);
}

// Konvertierfunktion fuer die neuen Werte aus den alten Schluesseln fuer die Funktion
// reverseMapping() (legt Array mit allen Schluesseln an, falls dieser eindeutig ist).
// Ohne Konvertierfunktion wuerde immer nur der letzte Schluessel gemerkt werden!
// value: Neuer Wert (zu konvertierender alter Schluessel)
// key: Neuer Schluessel (konvertierter alter Wert)
// obj: Neues Objekt (im Aufbau, alles konvertiert)
// return Konvertierter neuer Wert (in Form eines Arrays, falls mehr als einmal vorkommend)
function mappingSetOrPush(value, key, obj) {
    return pushObjValue(obj, key, value, null, true, true);
}

// Erzeugt Standard-Konvertierfunktion fuer die neuen Werte aus den alten Schluesseln
// fuer die Funktion reverseMapping() (legt Array mit allen Schluesseln an).
// Ohne Konvertierfunktion wuerde immer nur der letzte Schluessel gemerkt werden!
// valueFun: Funktion, die die resultierende Funktion auf den Parameter value anwendet
// return Konvertierter neuer Wert (in Form eines Arrays)
// value: Neuer Wert (zu konvertierender alter Schluessel)
// key: Neuer Schluessel (konvertierter alter Wert)
// obj: Neues Objekt (im Aufbau, alles konvertiert)
function mappingPushFun(valueFun) {
    return param0Wrapper(mappingPush, valueFun);
}

// Erzeugt Konvertierfunktion fuer die neuen Werte aus den alten Schluesseln fuer die Funktion
// reverseMapping() (legt Array mit allen Schluesseln an, falls dieser eindeutig ist).
// Ohne Konvertierfunktion wuerde immer nur der letzte Schluessel gemerkt werden!
// valueFun: Funktion, die die resultierende Funktion auf den Parameter value anwendet
// return Konvertierter neuer Wert (in Form eines Arrays, falls mehr als einmal vorkommend)
// value: Neuer Wert (zu konvertierender alter Schluessel)
// key: Neuer Schluessel (konvertierter alter Wert)
// obj: Neues Objekt (im Aufbau, alles konvertiert)
function mappingSetOrPushFun(valueFun) {
    return param0Wrapper(mappingSetOrPush, valueFun);
}

// Konvertierfunktion fuer die neuen Werte aus einer Spalte der alten Werte
// fuer die Funktion reverseMapping() als Parameter keyValFun (index und keyValFun
// sollten dafuer mit bind() herausgefiltert werden: bind(this, index, keyValFun)).
// Das Ergebnis, also ein Wert der indizierten Spalte, wird ggfs. noch nachbearbeitet.
// index: Index der Spalte, dessen Array-Eintraege als neuer Wert genutzt werden (Default: 0)
// keyValFun: Funktion, mit der der ermittelte Wert nachbearbeitet wird (Default: null)
// value: Neuer Wert (zu konvertierender alter Schluessel)
// key: Neuer Schluessel (konvertierter alter Wert)
// obj: Neues Objekt (im Aufbau, alles konvertiert)
// oldObj: Altes Objekt, aus derem alten Wert selektiert wird (key ist value, der alte Schluessel)
// return Selektierter neuer Wert (aus einer Spalte des alten Wertes)
function mappingValueSelect(index, keyValFun = null, value, key, obj, oldObj) {
    const __INDEX = getValue(index, -1);  // Bei Index -1, undefined oder null werden die Schluessel uebernommen
    const __VALUE = ((~ __INDEX) ? getArrValue(oldObj[value], index) : value);
    const __NEWVALUE = (keyValFun ? keyValFun(__VALUE, key, obj, oldObj) : __VALUE);

    return __NEWVALUE;
}

// Standard-Selectionsfunktion fuer die neuen Keys aus Spalten der alten Werte
// fuer die Funktion reverseMapping() (die in Array-Form vorliegen) als keysFun-Parameter.
// index: Index der Spalte, dessen Array-Eintraege als neuer Key genutzt werden (Default: -1 fuer Object.keys)
// obj: Objekt, dessen Werte ermittelt werden (besteht aus Array-Eintraegen)
// return Array mit allen neuen Keys (siehe Object.values, aber nur bestimmte Spalte)
function mappingValuesFunSelect(index, obj) {
    const __INDEX = getValue(index, -1);  // Bei Index -1, undefined oder null werden die Schluessel uebernommen

    if (~ __INDEX) {
        const __VALUES = Object.values(obj);
        const __NEWKEYS = __VALUES.map(valueArr => getArrValue(valueArr, __INDEX));

        return __NEWKEYS;
    } else {
        const __KEYS = Object.keys(obj);

        return __KEYS;
    }
}

// ==================== Ende Abschnitt Hilfsfunktionen fuer Object-Mapping ====================

// ==================== Ende Abschnitt fuer diverse Utilities fuer Object, Array, etc. ====================

// *** EOF ***

/*** Ende Modul util.object.js ***/

/*** Modul util.value.js ***/

// ==UserScript==
// _name         util.value
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Logging, Debugging, Error-Handling, usw.
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer diverse Utilities fuer Werte ====================

// Gibt einen Wert zurueck. Ist dieser nicht definiert oder null, wird ein Alternativwert geliefert
// value: Ein Wert. Ist dieser nicht undefined oder null, wird er zurueckgeliefert (oder retValue)
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist (also undefined oder null)
// retValue: Falls definiert, Rueckgabe-Wert fuer den Fall, dass value gesetzt (also nicht undefined oder null) ist
// return Der Wert. Sind weder value noch defValue definiert, dann undefined
function getValue(value, defValue = undefined, retValue = undefined) {
    return ((value === undefined) || (value === null)) ? defValue : (retValue === undefined) ? value : retValue;
}

// Gibt den Item-Wert eines Objektes zurueck. Ist dieser nicht definiert oder null, wird ein Alternativwert geliefert
// Ist das Objekt selbst undefined, gibt es keinen Fehler, es wird jedoch undefined zurueckgegeben
// obj: Das Objekt, dessen Item den Wert liefern soll
// item: Ein Key. Ist der zugehoerige Wert nicht undefined oder null, wird er zurueckgeliefert (oder retValue)
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// retValue: Falls definiert, Rueckgabe-Wert fuer den Fall, dass value nicht undefined oder null ist
// return Der Wert. Sind weder value noch defValue definiert, dann undefined
function getObjValue(obj, item, defValue = undefined, retValue = undefined) {
    return getValue(getValue(obj, { })[item], defValue, retValue);
}

// Gibt den Wert eines Arrays-Elements zurueck. Ist dieser nicht definiert oder null, wird ein Alternativwert geliefert
// Ist das Array selbst undefined, gibt es keinen Fehler, es wird jedoch undefined zurueckgegeben
// arr: Das Array, dessen Item den Wert liefern soll
// index: Ein Array-Index. Ist der zugehoerige Wert im Array nicht undefined oder null, wird er zurueckgeliefert (oder retValue)
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// retValue: Falls definiert, Rueckgabe-Wert fuer den Fall, dass value nicht undefined oder null ist
// return Der Wert. Sind weder value noch defValue definiert, dann undefined
function getArrValue(arr, index, defValue = undefined, retValue = undefined) {
    return getValue(getValue(arr, [])[index], defValue, retValue);
}

// Fuegt einen Wert dem Item-Array eines Objektes hinzu. Ist dieses nicht definiert oder null, wird es vorher angelegt
// Ist das Objekt selbst undefined, gibt es keinen Fehler, der gelieferte Eintrag muss jedoch noch selbst zugewiesen werden
// obj: Das Objekt, dessen Item mit dem Wert gesetzt werden soll
// item: Ein Key. Ist der zugehoerige Wert undefined oder null, wird ein Array angelegt
// value: Zu setzender Wert
// defValue: Default-Wert fuer den Fall, dass value nichts gesetzt ist
// returnOnly: true - Wert nur ermittlen, nicht im obj setzen, false - Item auch setzen
// scalarUnique: true - Nur bei mehreren Eintraegen Array nutzen, false - Skalare Werte,
//               wobei nur der letzte gesetzte Wert bei identischen Schluesseln uebrig bleibt!
// return Das Array mit allen Werten, die fuer dieses item gesetzt sind
function pushObjValue(obj, item, value, defValue, returnOnly = false, scalarUnique = false) {
    const __VALUE = getObjValue(obj, item, []);
    const __VALUEARR = (Array.isArray(__VALUE) ? __VALUE : [ __VALUE ]);

    __VALUEARR.push(getValue(value, defValue));

    const __RET = ((scalarUnique && (__VALUEARR.length === 1)) ? __VALUEARR[0] : __VALUEARR);

    if (obj && (! returnOnly)) {
        obj[item] = __RET;
    }

    return __RET;
}

// Fuegt einen Wert dem Item-Array-Element eines Arrays hinzu. Ist dieses nicht definiert oder null, wird es vorher angelegt
// Ist das Array selbst undefined, gibt es keinen Fehler, der gelieferte Eintrag muss jedoch noch selbst zugewiesen werden
// arr: Das Objekt, dessen Item mit dem Wert gesetzt werden soll
// index: Ein Array-Index. Ist der zugehoerige Wert im Array undefined oder null, wird ein Array an dieser Stelle angelegt
// value: Zu setzender Wert
// defValue: Default-Wert fuer den Fall, dass value nichts gesetzt ist
// returnOnly: true - Wert nur ermittlen, nicht im arr setzen, false - Item auch setzen
// scalarUnique: true - Nur bei mehreren Eintraegen Array nutzen, false - Skalare Werte,
//               wobei nur der letzte gesetzte Wert bei identischen Schluesseln uebrig bleibt!
// return Das Array mit allen Werten, die fuer diesen Index gesetzt sind
function pushArrValue(arr, index, value, defValue, returnOnly = false, scalarUnique = false) {
    const __VALUE = getArrValue(arr, index, []);
    const __VALUEARR = (Array.isArray(__VALUE) ? __VALUE : [ __VALUE ]);

    __VALUEARR.push(getValue(value, defValue));

    const __RET = ((scalarUnique && (__VALUEARR.length === 1)) ? __VALUEARR[0] : __VALUEARR);

    if (arr && (! returnOnly)) {
        arr[index] = __RET;
    }

    return __RET;
}

// Gibt einen Wert zurueck. Ist dieser nicht definiert, wird ein Alternativwert geliefert
// value: Ein Wert. Ist dieser definiet und in den Grenzen, wird er zurueckgeliefert
// minValue: Untere Grenze fuer den Wert, falls angegeben
// minValue: Obere Grenze fuer den Wert, falls angegeben
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist oder der Wert ausserhalb liegt
// return Der Wert. Sind weder value (in den Grenzen) noch defValue definiert, dann undefined
function getValueIn(value, minValue = undefined, maxValue = undefined, defValue = undefined) {
    const __VALUE = getValue(value, defValue);

    if ((minValue !== undefined) && (__VALUE < minValue)) {
        return defValue;
    }
    if ((maxValue !== undefined) && (__VALUE > maxValue)) {
        return defValue;
    }

    return __VALUE;
}

// Ermittelt den naechsten Wert aus einer Array-Liste
// arr: Array-Liste mit den moeglichen Werte
// value: Vorher gesetzter Wert
// return Naechster Wert in der Array-Liste
function getNextValue(arr, value) {
    const __POS = arr.indexOf(value) + 1;

    return arr[getValueIn(__POS, 0, arr.length - 1, 0)];
}

// Gibt ein Produkt zurueck. Ist einer der Multiplikanten nicht definiert, wird ein Alternativwert geliefert
// valueA: Ein Multiplikant. Ist dieser undefined, wird als Produkt defValue zurueckgeliefert
// valueB: Ein Multiplikant. Ist dieser undefined, wird als Produkt defValue zurueckgeliefert
// digits: Anzahl der Stellen nach dem Komma fuer das Produkt (Default: 0)
// defValue: Default-Wert fuer den Fall, dass ein Multiplikant nicht gesetzt ist (Default: NaN)
// return Das Produkt auf digits Stellen genau. Ist dieses nicht definiert, dann defValue
function getMulValue(valueA, valueB, digits = 0, defValue = Number.NaN) {
    let product = defValue;

    if ((valueA !== undefined) && (valueB !== undefined)) {
        product = parseFloat(valueA) * parseFloat(valueB);
    }

    if (isNaN(product)) {
        product = defValue;
    }

    return parseFloat(product.toFixed(digits));
}

// Gibt eine Ordinalzahl zur uebergebenen Zahl zurueck
// value: Eine ganze Zahl
// defValue: Default-Wert fuer den Fall, dass der Wert nicht gesetzt ist (Default: '*')
// return Die Ordinalzahl als String der Form "n." oder defValue, falls nicht angegeben
function getOrdinal(value, defValue = '*') {
    return getValue(value, defValue, value + '.');
}

// Wandelt einen String in eine Zahl um.
// Prozentzahlen werden als Anteil eines Ganzen interpretiert (d.h. "100%" -> 1).
// Ganze Zahlen mit Tausenderpunkten werden erkannt, wenn sie mit '.' gefolgt von 3 Ziffern enden.
// Dezimalzahlen werden erkannt, wenn sie mit '.' gefolgt von beliebig vielen Ziffern enden.
// Da zuerst auf ganze Zahlen geprueft wird, koennen Dezimalzahlen nicht 3 Nachkommaziffern haben.
// numberString: Dezimalzahl als String
// return Numerischer Wert der Zahl im String
function getNumber(numberString) {
    const __STR = (numberString || "");
    // Ist es eine Prozentzahl?
    const __PERCENT = (__STR.indexOf('%') > -1);
    // Buchstaben und '%' entfernen;
    // Whitespaces vorne und hintenentfernen...
    const str = __STR.replace(/[a-zA-Z%]/g, "").trim();
    const __REGEXPINT     = /^\d+$/;
    const __REGEXPINTDOTS = /^\d+(\.\d{3}){1,}$/;
    const __REGEXPNUMBER  = /^\d*\.\d{1,}$/;
    let ret = Number.NaN;

    // parseXXX interpretiert einen Punkt immer als Dezimaltrennzeichen!
    if (__REGEXPINT.test(str)) {
        // Einfache ganze Zahl...
        ret = Number.parseInt(str, 10);
    } else if (__REGEXPINTDOTS.test(str)) {
        // Ganze Zahl mit Tausenderpunkten...
        ret = Number.parseInt(str.replace(/\./g, ""), 10);
    } else if (__REGEXPNUMBER.test(str)) {
        // Dezimalzahl mit Punkt als Trennzeichen...
        ret = Number.parseFloat(str);
    } else {
        // Kein gueltiger String
    }

    return (__PERCENT ? (ret / 100) : ret);
}

// Fuegt in die uebergebene Zahl Tausender-Trennpunkte ein
// Wandelt einen etwaig vorhandenen Dezimalpunkt in ein Komma um
// numberString: Dezimalzahl als String
// return Diese Dezimalzahl als String mit Tausender-Trennpunkten und Komma statt Dezimalpunkt
function getNumberString(numberString) {
    if (numberString.lastIndexOf('.') !== -1) {
        // Zahl enthaelt Dezimalpunkt
        const __VORKOMMA = numberString.substring(0, numberString.lastIndexOf('.'));
        const __NACHKOMMA = numberString.substring(numberString.lastIndexOf('.') + 1, numberString.length);

        return getNumberString(__VORKOMMA) + ',' + __NACHKOMMA;
    } else {
        // Kein Dezimalpunkt, fuege Tausender-Trennpunkte ein:
        // String umdrehen, nach jedem dritten Zeichen Punkt einfuegen, dann wieder umdrehen:
        const __TEMP = reverseString(numberString);
        let result = "";

        for (let i = 0; i < __TEMP.length; i++) {
            if ((i > 0) && ((i % 3) === 0)) {
                result += '.';
            }
            result += __TEMP.substr(i, 1);
        }

        return reverseString(result);
    }
}

// Liefert den ganzzeiligen Anteil einer Zahl zurueck, indem alles hinter einem Punkt abgeschnitten wird
// value: Eine uebergebene Dezimalzahl
// return Der ganzzeilige Anteil dieser Zahl
function floorValue(value, dot = '.') {
    if ((value === 0) || (value && isFinite(value))) {
        const __VALUE = value.toString();
        const __INDEXDOT = (__VALUE ? __VALUE.indexOf(dot) : -1);

        return Number((~ __INDEXDOT) ? __VALUE.substring(0, __INDEXDOT) : __VALUE);
    } else {
        return value;
    }
}

// Liefert ein flaches eindimensionales Array zurueck, egal was uebergeben wurde.
// value: Ein Skalar, Objekt oder Array, Funktion, ...
// return Ein flaches Array, wenn ein Array uebergeben wurde, ansonsten ein einelementiges Array mit dem Wert
function toArray(value) {
    return ((((typeof value) === 'object') && Array.isArray(value)) ? value.flat(1) : [ value ]);
}

// Liefert ein flaches eindimensionales Array zurueck, aus allen uebergebenen Parametern.
// .... args: Beliebige Parameter, Skalare, Objekte oder Arrays, Funktionen, ...
// return Ein flaches Array, das sich aus der Aneinanderkettung all dieser Werte ergibt
function flatArray(... args) {
    return args.map(value => toArray(value)).reduce((ret, arr) => ret.concat(arr), []);
}

// Universeller einfacher Wrapper fuer den 1. Parameter. Es wird eine Funktion
// zurueckgeliefert, die dasselbe macht wie wrapFun, nur dass vorab der erste
// Parameter ueber die uebergebene Funktion manipuliert wird.
// wrapFun: Vorlage fuer die Zielfunktion
// - beliebige Parameter
// - return beliebiges Resultat
// param0Fun: Formatierungsfunktion fuer den 1. Parameter
// - value: Urspruenglicher Paramter
// - return Manipulierter Paramter
// return Liefert eine Funktion, die wrapFun entspricht, ausser dass vorher
//        param0Fun auf den 1. Parameter angewendet wird
function param0Wrapper(wrapFun, param0Fun) {
    return function(... args) {
            return wrapFun(param0Fun(args.shift()), ... args);
        };
}

// Universeller erweiterter Wrapper fuer den 1. Parameter. Es wird eine Funktion
// zurueckgeliefert, die dasselbe macht wie wrapFun, nur dass vorab der erste
// Parameter ueber die uebergebene Funktion manipuliert wird. In dieser Version
// kann diese Funktion ein Array zurueckliefern, das mehrere Parameter bedient.
// wrapFun: Vorlage fuer die Zielfunktion
// - beliebige Parameter
// - return beliebiges Resultat
// param0Fun: Formatierungsfunktion fuer den 1. Parameter
// - value: Urspruenglicher Paramter
// - return Ein oder mehrere manipulierte Paramter (bei mehreren als Array)
// return Liefert eine Funktion, die wrapFun entspricht, ausser dass vorher param0ArrFun auf
//        den 1. Parameter angewendet wird - dabei kann sich die Anzahl der Parameter veraendern!
function param0ArrWrapper(wrapFun, param0ArrFun) {
    return function(... args) {
            return wrapFun(... toArray(param0ArrFun(args.shift())), ... args);
        };
}

// Universeller Wrapper fuer beliebige Parameter. Es wird eine Funktion zurueckgeliefert,
// die dasselbe macht wie die wrapFun, nur dass vorab die Parameter laut Konfiguration ueber
// uebergebene Funktionen manipuliert wird. Hierzu dient ein Array oder Objekt von Funktionen.
// wrapFun: Vorlage fuer die Zielfunktion
// - beliebige Parameter
// - return beliebiges Resultat
// paramFuns: Formatierungsfunktionen fuer die Paramter (Key ist die lfd. Nummer)
// [index] = paramFun: Formatierungsfunktion fuer den Parameter an Stelle index
// - value: Urspruenglicher Paramter
// - return Manipulierter Paramter
// return Liefert eine Funktion, die wrapFun entspricht, ausser dass vorher vorhandene
//        Funktionen auf entsprechende Parameter angewendet werden
function paramWrapper(wrapFun, paramFuns) {
    const __FUNS = toArray(paramFuns);

    return function(... args) {
            return wrapFun(... args.map(((param, index) => (__FUNS[index] ? __FUNS[index](param) : param))));
        };
}

// Universeller Wrapper fuer beliebige Parameter. Es wird eine Funktion zurueckgeliefert,
// die dasselbe macht wie die wrapFun, nur dass vorab die Parameter laut Konfiguration ueber
// uebergebene Funktionen manipuliert wird. Hierzu dient ein Array oder Objekt von Funktionen.
// In dieser Version koennen diese Funktion Arrays zurueckliefern, die mehrere Parameter bedienen.
// wrapFun: Vorlage fuer die Zielfunktion
// - beliebige Parameter
// - return beliebiges Resultat
// paramFuns: Formatierungsfunktionen fuer die Paramter (Key ist die lfd. Nummer)
// [index] = paramFun: Formatierungsfunktion fuer den Parameter an Stelle index
// - value: Urspruenglicher Paramter
// - return Ein oder mehrere manipulierte Paramter (bei mehreren als Array)
// return Liefert eine Funktion, die wrapFun entspricht, ausser dass vorher vorhandene
//        Funktionen auf entsprechende Parameter angewendet werden - dabei kann sich
//        die Anzahl der Parameter veraendern!
function paramArrWrapper(wrapFun, paramFuns) {
    const __FUNS = toArray(paramFuns);

    return function(... args) {
            return wrapFun(... flatArray(args.map(((param, index) => toArray(__FUNS[index] ? __FUNS[index](param) : param)))));
        };
}

// Liefert eine generische Funktion zurueck, die die Elemente eines Arrays auf eine vorgegebene Weise formatiert
// formatFun: Formatierfunktion fuer ein Element
// - element: Wert des Elements
// - index: Laufende Nummer des Elements (0-basiert)
// - arr: Das gesamte Array, wobei arr[index] === element
// return Generische Funktion, die an Array-Funktionen uebergeben werden kann, z.B. als Replacer fuer safeStringify()
function replaceArrayFun(formatFun, space = ' ') {
    return function(key, value) {
            UNUSED(key);

            const __VALUE = getValue(this[""], value);  // value ist anders als in Dokumentation beschrieben, nutze ggfs. ""-Eintrag!

            if (Array.isArray(__VALUE)) {
                const __RET = (formatFun ? __VALUE.map((element, index, arr) => formatFun(element, index, arr)) : __VALUE);

                return '[' + space + __RET.join(',' + space) + space + ']';
            }

            return value;  // value ist, anders als in der Dokumentation beschrieben, bereits konvertiert!
        };
}

// Liefert eine generische Funktion zurueck, die einen String auf eine vorgegebene Weise rechtsbuending formatiert,
// indem er links mit den uebergebenen Zeichen aufgefuellt wird. Laenge und Zeichen werden fest vorgegeben.
// targetLength: Zielbreite, es wird allerdings nicht abgeschnitten (falls der Wert zu klein ist, bleibt das Original)
// padString: Auffuell-Zeichen oder -String (Muster), das ggfs. auf die richtige Laenge zugeschnitten wird
// return Generische Funktion mit fester Zielbreite und Fuellzeichen. Moegliche Nutzung: replaceArrayFun(padStartFun(4))
function padStartFun(targetLength = 4, padString = ' ') {
    return (value => String(value).padStart(targetLength, padString));
}

// Liefert eine generische Funktion zurueck, die einen String auf eine vorgegebene Weise linksbuending formatiert,
// indem er rechts mit den uebergebenen Zeichen aufgefuellt wird. Laenge und Zeichen werden fest vorgegeben.
// targetLength: Zielbreite, es wird allerdings nicht abgeschnitten (falls der Wert zu klein ist, bleibt das Original)
// padString: Auffuell-Zeichen oder -String (Muster), das ggfs. auf die richtige Laenge zugeschnitten wird
// return Generische Funktion mit fester Zielbreite und Fuellzeichen. Moegliche Nutzung: replaceArrayFun(padEndFun(4))
function padEndFun(targetLength = 4, padString = ' ') {
    return (value => String(value).padEnd(targetLength, padString));
}

// Liefert einen rechtsbuendigen Text zurueck, der links aufgefuellt wird
// value: Ein uebergebener Wert
// size: Zielbreite (clipping fuer < 0: Abschneiden, falls zu lang)
// char: Zeichen zum Auffuellen
// return Ein String, der mindestens |size| lang ist (oder genau, falls size < 0, also clipping)
function padLeft(value, size = 4, char = ' ') {
    const __SIZE = Math.abs(size);
    const __CLIP = (size < 0);
    const __VALUE = (value ? value.toString() : "");
    let i = __VALUE.length;
    let str = "";

    while (i < __SIZE) {
        str += char;
        i += char.length;
    }
    str = ((i > __SIZE) ? str.slice(0, __SIZE - __VALUE.length - 1) : str) + __VALUE;

    return (__CLIP ? str.slice(size) : str);
}

// Liefert eine rechtsbuendigen Zahl zurueck, der links (mit Nullen) aufgefuellt wird
// value: Eine uebergebene Zahl
// size: Zielbreite (Default: 2)
// char: Zeichen zum Auffuellen (Default: '0')
// forceClip: Abschneiden erzwingen, falls zu lang?
// return Eine Zahl als String, der mindestens 'size' lang ist (oder genau, falls size < 0, also clipping)
function padNumber(value, size = 2, char = '0') {
    if ((value === 0) || (value && isFinite(value))) {
        return padLeft(value, size, char);
    } else {
        return value;
    }
}

// Dreht den uebergebenen String um
// string: Eine Zeichenkette
// return Dieselbe Zeichenkette rueckwaerts
function reverseString(string) {
    let result = "";

    for (let i = string.length - 1; i >= 0; i--) {
        result += string.substr(i, 1);
    }

    return result;
}

// Identitaetsfunktion. Konvertiert nichts, sondern liefert einfach den Wert zurueck
// value: Der uebergebene Wert
// return Derselbe Wert
function sameValue(value) {
    return value;
}

// Existenzfunktion. Liefert zurueck, ob ein Wert belegt ist
// value: Der uebergebene Wert
// return Angabe ob Wert belegt ist
function existValue(value) {
    return !! value;
}

// Hilfsfunktion fuer Array.sort(): Vergleich zweier Zahlen
// valueA: Erster Zahlenwert
// valueB: Zweiter Zahlenwert
// return -1 = kleiner, 0 = gleich, +1 = groesser
function compareNumber(valueA, valueB) {
    return +(valueA > valueB) || (+(valueA === valueB) - 1);
}

// Gemeinsame Funktion fuer 'typeof' und 'instanceof', die sowohl fuer
//  Primitives als auch fuer Objekte funktioniert
// value: Objekt (Object, Array) oder primitiver Wert (Number, String, Boolean)
// return Bei Objekten aehnlich 'instanceof', bei Primitives aehnlich 'typeof'
//  Moegliche Ergebnisse: 'Undefined', 'Null', 'Number' (auch NaN), 'String',
//  'Boolean', 'Symbol', 'Function', 'Array', 'Object'
function typeOf(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
}

// Sicheres obj.valueOf() fuer alle Daten
// data: Objekt oder Wert
// return Bei Objekten valueOf() oder das Objekt selber, bei Werten der Wert
function valueOf(data) {
    const __USEMEMBER = (data && ((typeof data.valueOf) === 'function'));

    return (__USEMEMBER ? data.valueOf() : data);
}

// ==================== Ende Abschnitt fuer diverse Utilities fuer Werte ====================

// *** EOF ***

/*** Ende Modul util.value.js ***/

/*** Modul util.proto.js ***/

// ==UserScript==
// _name         util.proto
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Prototypes
// _require      https://eselce.github.io/OS2.scripts/lib/util.proto.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer diverse Utilities fuer Function-Prototypes ====================

// Ueberprueft, ob ein Objekt einer bestimmten Klasse angehoert (ggfs. per Vererbung)
// obj: Ein (generisches) Objekt
// base: Eine Objektklasse (Konstruktor-Funktion)
// return true, wenn der Prototyp rekursiv gefunden werden konnte
function instanceOf(obj, base) {
    while (obj !== null) {
        if (obj === base.prototype) {
            return true;
        }
        if ((typeof obj) === 'xml') {  // Sonderfall mit Selbstbezug
            //return (base.prototype === XML.prototype);
            return (base.prototype === XMLDocument.prototype);  // Notloesung!
        }
        obj = Object.getPrototypeOf(obj);
    }

    return false;
}

// Liefert alle Basisklassen des Objekts (inkl. Vererbung)
// obj: Ein (generisches) Objekt
// return true, wenn der Prototyp rekursiv gefunden werden konnte
function getPrototypes(obj) {
    let ret = [];

    while (obj !== null) {
        const __PROTO = Object.getPrototypeOf(obj);

        ret.push(__PROTO);
        if ((typeof obj) === 'xml') {  // Sonderfall mit Selbstbezug
            break;
        }
        obj = __PROTO;
    }

    return ret;
}

// Liefert alle Attribute/Properties des Objekts (inkl. Vererbung)
// obj: Ein (generisches) Objekt
// return Array von Items (Property-Namen)
function getAllProperties(obj) {
    let ret = [];

    for (let o = obj; o !== null; o = Object.getPrototypeOf(o)) {
      ret = ret.concat(Object.getOwnPropertyNames(o));
    }

    return ret;
}

// ==================== Ende Abschnitt fuer diverse Utilities fuer Function-Prototypes ====================

// ==================== Abschnitt mit Ergaenzungen und Polyfills zu Standardobjekten ====================

// Kompatibilitaetsfunktion zur Ermittlung des Namens einer Funktion (falls <Function>.name nicht vorhanden ist)
if (Function.prototype.name === undefined) {
    Object.defineProperty(Function.prototype, 'name', {
            get : function() {
                      return /function ([^(\s]*)/.exec(this.toString())[1];
                  }
        });
}

// Ergaenzung fuer Strings: Links oder rechts auffuellen nach Vorlage
// padStr: Vorlage, z.B. "00" fuer zweistellige Zahlen
// padLeft: true = rechtsbuendig, false = linksbuendig
// clip: Abschneiden, falls zu lang
// return Rechts- oder linksbuendiger String, der so lang ist wie die Vorlage
String.prototype.pad = function(padStr, padLeft = true, clip = false) {
    const __LEN = ((clip || (padStr.length > this.length)) ? padStr.length : this.length);

    return (padLeft ? String(padStr + this).slice(- __LEN) : String(this + padStr).slice(0, __LEN));
};

// Ersetzt in einem String {0}, {1}, ... durch die entsprechenden Parameter
// arguments: Parameter, die fuer {0}, {1}, ... eingesetzt werden sollen
// return Resultierender String
String.prototype.format = function() {
    const __ARGS = arguments;
    return this.replace(/{(\d+)}/g, function(match, argIdx) {
                                        const __ARG = __ARGS[argIdx];
                                        return ((__ARG !== undefined) ? __ARG : match);
                                    });
};

// Polyfill for das originale Array.reduce, da das alte prototype.js 1.6.0.3
// dies ueberschreibt durch eine Funktion, die die Aufgabe nicht erfuellt!
// Um weitere Konflikte zu vermeiden, wird die Methode Array.Reduce genannt
// reduceFun: Reduktions-Funktion mit bis zu vier Parametern:
// - value: Kumulativer Wert
// - element: Das aktuelle Element des Arrays
// - index: Index von element im Array
// - arr: Das ganze Array
// value: Inititaler Wert. Falls nicht angegeben, wird mit dem 1. Element gestartet
// return Kumulierter Wert nach Durchlaufen des gesamten Arrays
Object.defineProperty(Array.prototype, 'Reduce', {
    'configurable'    : true,
    'enumerable'      : false,
    'value'           : function(reduceFun, value) {
        try {
            if ((! reduceFun) || ((typeof reduceFun) !== 'function')) {
                throw TypeError("Invalid reduce() function!");
            }

            const __LEN = this.length;
            const __DOSHIFT = (((typeof value) === 'undefined') || (value === null));

            if (__DOSHIFT) {
                value = this[0];
            }

            for (let i = (__DOSHIFT ? 1 : 0); i < __LEN; i++) {
                __LOG[9](i, value, this[i]);
                if (value instanceof Promise) {
                    value.then(val => __LOG[9](i, 'value', val), err => __LOG[1]('error', err));
                }

                value = reduceFun.call(this, value, this[i], i, this);
            }

            __LOG[8](__LEN, value, reduceFun);
            if (value instanceof Promise) {
                value.then(ret => __LOG[8]('return', ret), err => __LOG[1]('error', err));
            }
        } catch (ex) {
            showException('[' + (ex && ex.lineNumber) + "] Reduce()", ex);
        }

        return value;
    }});

// Polyfill for das originale Array.reduceRight, analog zu Array.reduce
// Um weitere Konflikte zu vermeiden, wird die Methode Array.ReduceRight genannt
// reduceFun: Reduktions-Funktion mit bis zu vier Parametern:
// - value: Kumulativer Wert
// - element: Das aktuelle Element des Arrays
// - index: Index von element im Array
// - arr: Das ganze Array
// value: Inititaler Wert. Falls nicht angegeben, wird mit dem letzten Element gestartet
// return Kumulierter Wert nach Durchlaufen des gesamten Arrays
Object.defineProperty(Array.prototype, 'ReduceRight', {
    'configurable'    : true,
    'enumerable'      : false,
    'value'           : function(reduceFun, value) {
        try {
            if ((! reduceFun) || ((typeof reduceFun) !== 'function')) {
                throw TypeError("Invalid reduceRight() function!");
            }

            const __LEN = this.length;
            const __DOSHIFT = (((typeof value) === 'undefined') || (value === null));

            if (__DOSHIFT) {
                value = this[__LEN - 1];
            }

            for (let i = __LEN - (__DOSHIFT ? 2 : 1); i >= 0; i--) {
                __LOG[9](i, value, this[i]);
                if (value instanceof Promise) {
                    value.then(val => __LOG[9](i, 'value', val), err => __LOG[1]('error', err));
                }

                value = reduceFun.call(this, value, this[i], i, this);
            }

            __LOG[8](__LEN, value, reduceFun);
            if (value instanceof Promise) {
                value.then(ret => __LOG[8]('return', ret), err => __LOG[1]('error', err));
            }
        } catch (ex) {
            showException('[' + (ex && ex.lineNumber) + "] ReduceRight()", ex);
        }

        return value;
    }});

// ==================== Ende Abschnitt mit Ergaenzungen und Polyfills zu Standardobjekten ====================

// *** EOF ***

/*** Ende Modul util.proto.js ***/

/*** Modul util.prop.js ***/

// ==UserScript==
// _name         util.prop
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Logging, Debugging, Error-Handling, usw.
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.prop.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer diverse Utilities fuer Objekt-Properties ====================

// Ueberpruefung, ob ein Item aktiv ist oder nicht
// item: Name des betroffenen Items
// inList: Checkliste der inkludierten Items (Positivliste, true fuer aktiv)
// exList: Checkliste der exkludierten Items (Negativliste, true fuer inaktiv)
// return Angabe, ob das Item aktiv ist
function checkItem(item, inList = undefined, exList = undefined) {
    let active = true;

    if (inList) {
        active = (inList[item] === true);  // gesetzt und true
    }
    if (exList) {
        if (exList[item] === true) {  // gesetzt und true
            active = false;  // NICHT anzeigen
        }
    }

    return active;
}

// Fuegt Properties zu einem Objekt hinzu, die in einem zweiten stehen. Doppelte Werte werden ueberschrieben
// data: Objekt, dem Daten hinzugefuegt werden
// addData: Objekt, das zusaetzliche Properties enthaelt
// addList: Checkliste der zu setzenden Items (true fuer kopieren), falls angegeben
// ignList: Checkliste der ignorierten Items (true fuer auslassen), falls angegeben
// return Das gemergete Objekt mit allen Properties
function addProps(data, addData, addList = undefined, ignList = undefined) {
    for (let item in getValue(addData, { })) {
        if (checkItem(item, addList, ignList)) {
            data[item] = addData[item];
        }
    }

    return data;
}

// Entfernt Properties in einem Objekt
// data: Objekt, deren Properties bearbeitet werden
// delList: Checkliste der zu loeschenden Items (true fuer loeschen), falls angegeben
// ignList: Checkliste der ignorierten Items (true fuer auslassen), falls angegeben
// return Das veraenderte Objekt ohne die geloeschten Properties
function delProps(data, delList = undefined, ignList = undefined) {
    for (let item in getValue(data, { })) {
        if (checkItem(item, delList, ignList)) {
            delete data[item];
        }
    }

    return data;
}

// Gibt den Wert einer Property zurueck. Ist dieser nicht definiert oder null, wird er vorher gesetzt
// obj: Ein Objekt. Ist dieses undefined oder null, wird defValue zurueckgeliefert
// item: Key des Properties
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// return Der Wert des Properties. Sind das obj oder das Property und defValue undefined oder null, dann undefined
function getProp(obj, item, defValue = undefined) {
    if ((obj === undefined) || (obj === null)) {
        return defValue;
    }

    const __PROP = obj[item];

    if ((__PROP !== undefined) && (__PROP !== null)) {
        return __PROP;
    }

    return (obj[item] = defValue);
}

// ==================== Ende Abschnitt fuer diverse Utilities fuer Objekt-Properties ====================

// *** EOF ***

/*** Ende Modul util.prop.js ***/

/*** Modul util.mem.sys.js ***/

// ==UserScript==
// _name         util.mem.sys
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer ScriptManager (__DBMAN)
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.prop.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.sys.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Daten fuer die ScriptManager-Datenbank ====================

// Infos ueber den genutzten Script-Manager
const __DBMAN = /* new */ ScriptManager();

// ==================== Ende Daten fuer die ScriptManager-Datenbank ====================

// ==================== Abschnitt fuer Klasse ScriptManager ====================

// Initialisiert die Script-Manager-Infos und ermittelt die beschreibenden Daten
// info: GM-Infos des Scripts (Default: GM.info)
// return Beschreibende Daten fuer __DBMAN
function ScriptManager(info) {
    'use strict';

    const __DBMAN = { };
    const __PROPS = {
                'scriptHandler' : true,
                'version'       : true
            };

    Object.defineProperty(__DBMAN, 'updateInfo', {
            enumerable    : false,
            configurable  : true,
            writable      : false,
            value         : function(info) {
                                const __INFO = getValue(info, GM.info);

                                // Infos zu diesem Script-Manager...
                                addProps(this, __INFO, __PROPS);

                                if (! this.hasOwnProperty('Name')) {
                                    // Voller Name fuer die Ausgabe...
                                    Object.defineProperty(this, 'Name', {
                                            enumerable    : false,
                                            configurable  : true,
                                            get           : function() {
                                                                return this.scriptHandler + " (" + this.version + ')';
                                                            },
                                            set           : undefined
                                        });
                                }

                                if (this.scriptHandler) {
                                    __LOG[2](this);
                                }

                                return this;
                            }
        });

    __DBMAN.updateInfo(info);

    return __DBMAN;
}

//Class.define(ScriptManager, Object);

// ==================== Ende Abschnitt fuer Klasse ScriptManager ====================

// ==================== Substitution mit Daten aus der ScriptManager-Datenbank ====================

// Moegliche einfache Ersetzungen mit '$'...
let textManagerSubst;

// Substituiert '$'-Parameter in einem Text
// text: Urspruenglicher Text mit '$'-Befehlen
// par1: Der (erste) uebergebene Parameter
// return Fuer Arrays eine kompakte Darstellung, sonst derselbe Wert
function substManagerParam(text, par1) {
    let ret = getValue(text, "");

    if (! textManagerSubst) {
        textManagerSubst = {
                'm' : __DBMAN.scriptHandler,
                'w' : __DBMAN.version,
                'M' : __DBMAN.Name
            };
    }

    for (let ch in textManagerSubst) {
        const __SUBST = textManagerSubst[ch];

        ret = ret.replace('$' + ch, __SUBST);
    }

    return ret.replace('$', par1);
}

// ==================== Ende Funktionen fuer die ScriptManager-Datenbank ====================

// *** EOF ***

/*** Ende Modul util.mem.sys.js ***/

/*** Modul util.mem.mod.js ***/

// ==UserScript==
// _name         util.mem.mod
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer ScriptModule (__DBMOD)
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.prop.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.sys.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Daten fuer die Scriptdatenbank ====================

// Infos ueber dieses Script-Modul
const __DBMOD = /* new */ ScriptModule();

// Inhaltsverzeichnis der DB-Daten (indiziert durch die Script-Namen)
const __DBTOC = { };

// Daten zu den Modulen (indiziert durch die Script-Namen)
const __DBDATA = { };

// ==================== Abschnitt fuer Klasse ScriptModule ====================

// Initialisiert das Script-Modul und ermittelt die beschreibenden Daten
// meta: Metadaten des Scripts (Default: GM.info.script)
// return Beschreibende Daten fuer __DBMOD
function ScriptModule(meta) {
    'use strict';

    const __DBMOD = { };
    const __META = getValue(meta, GM.info.script);
    const __PROPS = {
                'name'        : true,
                'version'     : true,
                'namespace'   : true,
                'description' : true
            };

    __LOG[6](__META);

    // Infos zu diesem Script...
    addProps(__DBMOD, __META, __PROPS);

    // Voller Name fuer die Ausgabe...
    Object.defineProperty(__DBMOD, 'Name', {
            enumerable    : false,
            configurable  : true,
            get           : function() {
                                return this.name + " (" + this.version + ')';
                            },
            set           : undefined
        });

    __LOG[2](__DBMOD);

    return __DBMOD;
}

//Class.define(ScriptModule, Object);

// ==================== Ende Abschnitt fuer Klasse ScriptModule ====================

// ==================== Substitution mit Daten aus der Scriptdatenbank ====================

// Moegliche einfache Ersetzungen mit '$'...
let textSubst;

// Substituiert '$'-Parameter in einem Text
// text: Urspruenglicher Text mit '$'-Befehlen
// par1: Der (erste) uebergebene Parameter
// return Fuer Arrays eine kompakte Darstellung, sonst derselbe Wert
function substParam(text, par1) {
    let ret = getValue(text, "");

    if (! textSubst) {
        textSubst = {
                'n' : __DBMOD.name,
                'v' : __DBMOD.version,
                'V' : __DBMOD.Name
            };
    }

    for (let ch in textSubst) {
        const __SUBST = textSubst[ch];

        ret = ret.replace('$' + ch, __SUBST);
    }

    return ret.replace('$', par1);
}

// ==================== Ende Funktionen fuer die Scriptdatenbank ====================

// *** EOF ***

/*** Ende Modul util.mem.mod.js ***/

/*** Modul util.debug.js ***/

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
        'callPromiseChain'  :   'test.assert',
        'promiseCatch'      :   'test.assert',
        'promiseChainCatch' :   'test.assert',
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

/*** Ende Modul util.debug.js ***/

/*** Modul util.store.js ***/

// ==UserScript==
// _name         util.store
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Script-Optionen im Benutzermenue
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Konfigurations-Abschnitt fuer Speicherung (GM.setValue, GM.deleteValue) ====================

// Echte Schreibzugriffe (false = read only)
const __GMWRITE = true;

// ==================== Abschnitt Programmstart und zugehoerigen Hilfsfunktionen ====================

// Gesammelte Routinen fuer den Start des Scriptes...
const __SCRIPTINIT = [];

// Registrierung eine Startfunktion
// startFun: Auszufuehrende Funktion
// return Promise auf void
async function registerStartFun(startFun) {
    return __SCRIPTINIT.push(startFun);
}

// Funktion zum sequentiellen Aufruf der Startroutinen in __SCRIPTINIT ueber Promises
// return Ein Promise-Objekt fuer den Programmstart (Inhalt: Anzahl der Startfunktionen)
async function startMain() {
    return __SCRIPTINIT.Reduce((prom, fun) => prom.then(fun, defaultCatch),
            Promise.resolve(true)).then(() => {
                    const __LEN = __SCRIPTINIT.length;

                    // Liste wurde korrekt verarbeitet, jetzt die Liste loeschen...
                    __SCRIPTINIT.length = 0;

                    // Liefert die Anzahl der verarbeiteten Startfunktionen...
                    return __LEN;
                }, defaultCatch).catch(defaultCatch);
}

// ==================== Abschnitt Meldung Schreibstatus ====================

// Ausgabe auf die Konsole, ob __GMWRITE gesetzt ist (also Optionen beschreibbar sind)
// return Promise auf void
async function GM_showOptionsWritable() {
    if (__GMWRITE) {
        __LOG[8]("Schreiben von Optionen wurde AKTIVIERT!");
    } else {
        __LOG[8]("Schreiben von Optionen wurde DEAKTIVIERT!");
    }
}

// ==================== Abschnitt Lesefilter und zugehoerigen Hilfsfunktionen ====================

// Modifikationen fuer Kompatibilitaet (z.B. 'undefined' statt undefined bei Tampermonkey)
const __GMREADFILTER = [];

// Hilfsfunktion zur Ermittlung, ob der Tampermonkey-Bug vorliegt, dass undefined als 'undefined' gespeichert wird
// return Angabe, ob der Tampermonkey-Bug vorliegt
async function GM_checkForTampermonkeyBug() {
    const __TESTNAME = 'GM_checkForTampermonkeyBug';
    const __TESTVALUE = undefined;
    const __TESTDEFAULT = "DEFAULT";
    const __TESTBUGVALUE = 'undefined';
    const __TESTFILTER = GM_TampermonkeyFilter;

    return __SETVALUE(__TESTNAME, __TESTVALUE).then(
            () => __GETVALUE(__TESTNAME, __TESTDEFAULT), defaultCatch).then(
            value => {
                const __RET = (value !== __TESTDEFAULT);

                __LOG[8]("__GETVALUE() lieferte", __LOG.info(value, false), '-', __RET);

                if (__RET) {
                    if ((value !== __TESTBUGVALUE) && (value !== __TESTVALUE)) {
                        return false;  // Filter wuerde nichts aendern...
                    }

                    if (! __GMREADFILTER.push(__TESTFILTER)) {
                        return false;  // Hinzufuegen hat nicht geklappt...
                    }

                    // Erfolg! Filter wurde aktiviert...
                    __LOG[8]("GM_TampermonkeyFilter AKTIVIERT!")
                }

                return __RET;
            }, defaultCatch).catch(defaultCatch);
}

// Funktion zum sequentiellen Aufruf der Filter in __GMREADFILTER ueber Promises
// startValue: Promise oder Wert, der/die den Startwert oder das Startobjekt beinhaltet
// name: GM.getValue()-Name, unter dem die Daten gespeichert wurden (Zusatzinfo fuer den Filter)
// defValue: Default-Wert fuer den Fall, dass nichts gespeichert ist (Zusatzinfo fuer den Filter)
// return Ein Promise-Objekt mit dem Endresultat
async function useReadFilter(startValue, name, defValue) {
    return __GMREADFILTER.Reduce((prom, fun) => prom.then(
            value => fun(value, name, defValue), defaultCatch),
            Promise.resolve(startValue)).catch(defaultCatch);
}

// Kompatibilitionsfunktion gegen den undefined-Bug von Tampermonkey
// value: Gelesener Wert oder Promise darauf
// name: GM.getValue()-Name, unter dem die Daten gespeichert wurden (Zusatzinfo fuer den Filter)
// defValue: Default-Wert fuer den Fall, dass nichts gespeichert ist (Zusatzinfo fuer den Filter)
// return Promise mit korrigiertem Wert
async function GM_TampermonkeyFilter(value, name, defValue) {
    const __VALUE = await Promise.resolve(value);

    __LOG[8]('GM_TampermonkeyFilter(' + __LOG.info(value, false) + "), "
        + __LOG.info(name, false) + ", " + __LOG.info(defValue, false));

    if (__VALUE !== defValue) {
        if ((__VALUE === 'undefined') || (__VALUE === undefined)) {
            __LOG[4]("GM_TampermonkeyFilter: Fixing", __LOG.info(value, false),
                "for", __LOG.info(name, false), "to", __LOG.info(defValue, false));

            return defValue;
        }
    }

    return value;
}

// ==================== Abschnitt mit Hilfsroutine zur Kapselung von GM-Funktionen (GM.getValue, GM.setValue, GM.deleteValue, GM.listValues) ====================

// Generator-Funktion: Liefert eine ausgewaehlte GM-Funktion
// action: Name der Funktion im GM-Objekt
// label: Ausgabe-Titel
// condition: Bedingung fuer die Auswahl
// altAction: Alternative zu Parameter 'action' im Falle "condition === false"
// level: Ausgabe-Loglevel
// return Ausgewaehlte GM-Funktion
function GM_function(action, label, condition = true, altAction = undefined, level = 8) {
    // Nur einmalig ermitteln...
    const __LABEL = ((condition ? '+' : '-') + label);
    const __FUNKEY = (condition ? action : altAction);

    return function(... args) {
            const __NAME = __LOG.info(args[0], false);
            __LOG[level](__LABEL, __NAME);
            return GM[__FUNKEY](... args);
        };
}

// ==================== Abschnitt zur Kapselung von GM-Funktionen (GM.getValue, GM.setValue, GM.deleteValue, GM.listValues) und Start-Initialisierungen ====================

// Umlenkung von Speicherung und Loeschung auf nicht-inversible 'getValue'-Funktion.
// Falls __GMWRITE false ist, wird nicht geschrieben, bei true werden Optionen gespeichert.
// TODO: Dynamische Variante (bei Laufzeit umstellbar)
const __GETVALUE = GM_function('getValue', 'GET');
const __SETVALUE = GM_function('setValue', 'SET', __GMWRITE, 'getValue');
const __DELETEVALUE = GM_function('deleteValue', 'DELETE', __GMWRITE, 'getValue');
const __LISTVALUES = GM_function('listValues', 'KEYS');

// Anzeigen, ob Optionen beschreibbar sind (verzoegert)...
registerStartFun(GM_showOptionsWritable);

// GGfs. GM_TampermonkeyFilter aktivieren (verzoegert)...
registerStartFun(GM_checkForTampermonkeyBug);

// ==================== Ende Abschnitt zur Kapselung von GM-Funktionen (GM.getValue, GM.setValue, GM.deleteValue, GM.listValues) und Start-Initialisierungen ====================

// ==================== Abschnitt fuer die Sicherung und das Laden von Daten ====================

// Speichert einen String/Integer/Boolean-Wert unter einem Namen ab
// name: GM.setValue()-Name, unter dem die Daten gespeichert werden
// value: Zu speichernder String/Integer/Boolean-Wert
// return Promise auf ein Objekt, das 'name' und 'value' der Operation enthaelt
async function storeValue(name, value) {
    __LOG[5](name + " >> " + __LOG.info(value, true, true));

    return __SETVALUE(name, value).then(() => {
            __LOG[6]('OK', name, '>>', __LOG.info(value, true, true));

            return Promise.resolve({
                    'name'  : name,
                    'value' : value
                });
        }, ex => {
            const __MESSAGE = "Unable to storeValue() " + name + ((ex && ex.message) ? " (" + ex.message + ')' : "");

            __LOG[1](__MESSAGE);
            return Promise.reject(__MESSAGE);
        });
}

// Holt einen String/Integer/Boolean-Wert unter einem Namen zurueck
// name: GM.getValue()-Name, unter dem die Daten gespeichert wurden
// defValue: Default-Wert fuer den Fall, dass nichts gespeichert ist
// return Promise fuer den String/Integer/Boolean-Wert, der unter dem Namen gespeichert war
async function summonValue(name, defValue = undefined) {
    const __VALPROMISE = __GETVALUE(name, defValue);

    return useReadFilter(__VALPROMISE, name, defValue).then(value => {
            __LOG[5](name, '<<', __LOG.info(value, true, true));

            return Promise.resolve(value);
        }, ex => {
            const __MESSAGE = "Unable to summonValue() " + name + ((ex && ex.message) ? " (" + ex.message + ')' : "");

            __LOG[1](__MESSAGE);
            return Promise.reject(__MESSAGE);
        });
}

// Entfernt einen String/Integer/Boolean-Wert, der unter einem Namen gespeichert ist
// name: GM.deleteValue()-Name, unter dem die Daten gespeichert wurden
// return Promise fuer den String/Integer/Boolean-Wert, der unter dem Namen gespeichert war
async function discardValue(name) {
    __LOG[5]("DELETE " + __LOG.info(name, false));

    return __DELETEVALUE(name).then(value => {
            __LOG[5]('OK', 'DELETE', name);

            return Promise.resolve(value);
        }, ex => {
            const __MESSAGE = "Unable to discardValue() " + name + ((ex && ex.message) ? " (" + ex.message + ')' : "");

            __LOG[1](__MESSAGE);
            return Promise.reject(__MESSAGE);
        });
}

// Listet die Namen aller Orte auf, unter der ein String/Integer/Boolean-Wert gespeichert ist
// return Promise fuer ein Array von GM.listValues()-Namen, unter denen String/Integer/Boolean-Werte gespeichert sind
async function keyValues() {
    return __LISTVALUES().then(keys => {
            __LOG[5]("KEYS:", keys);

            return Promise.resolve(keys);
        }, ex => {
            const __MESSAGE = "Unable to list keyValues()" + ((ex && ex.message) ? " (" + ex.message + ')' : "");

            __LOG[1](__MESSAGE);
            return Promise.reject(__MESSAGE);
        });
}

// Speichert einen beliebiegen (strukturierten) Wert unter einem Namen ab
// name: GM.setValue()-Name, unter dem die Daten gespeichert werden
// value: Beliebiger (strukturierter) Wert
// return Promise auf ein Objekt, das 'name' und 'value' in der String-Darstellung des Wertes enthaelt
async function serialize(name, value) {
    const __STREAM = ((value !== undefined) ? safeStringify(value) : value);

    return storeValue(name, __STREAM);
}

// Holt einen beliebiegen (strukturierter) Wert unter einem Namen zurueck
// name: GM.getValue()-Name, unter dem die Daten gespeichert wurden
// defValue: Default-Wert fuer den Fall, dass nichts gespeichert ist
// return Promise fuer das Objekt, das unter dem Namen gespeichert war
async function deserialize(name, defValue = undefined) {
    return summonValue(name).then(stream => {
            if (stream === undefined) {
                return defValue;  // JSON-codiertes undefined, function, Symbol, etc. => defValue
            } else {
                try {
                    return JSON.parse(stream);
                } catch (ex) {
                    ex = (ex || { 'message' : 'Unknown error' });
                    __LOG[1](__LOG.info(name, false), '<<', __LOG.info(stream, true, true));
                    ex.message += ": " + __LOG.info(name, false) + " : " + __LOG.info(stream);
                    throw ex;
                }
            }
        });
}

// ==================== Abschnitt fuer die Folgen einer Speicherung ====================

// Setzt die Seite gemaess der Aenderungen zurueck...
// reload: Seite wird ganz neu geladen
function refreshPage(reload = true) {
    if (reload) {
        __LOG[2]("Seite wird neu geladen...");
        window.location.reload();
    }
}

// ==================== Abschnitt fuer die Sicherung von Daten mit Callback ====================

// Setzt eine Option dauerhaft und laedt die Seite neu
// name: Name der Option als Speicherort
// value: Zu setzender Wert
// reload: Seite mit neuem Wert neu laden
// serial: Serialization fuer komplexe Daten
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gespeicherter Wert fuer setOptValue()
function setStored(name, value, reload = false, serial = false, onFulfilled = undefined, onRejected = undefined) {
    (serial ? serialize(name, value)
            : storeValue(name, value))
                .then(onFulfilled, onRejected)
                .then(() => refreshPage(reload), defaultCatch);  // Ende der Kette...

    return value;
}

// Setzt den naechsten Wert aus einer Array-Liste als Option
// arr: Array-Liste mit den moeglichen Optionen
// name: Name der Option als Speicherort
// value: Vorher gesetzter Wert
// reload: Seite mit neuem Wert neu laden
// serial: Serialization fuer komplexe Daten
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gespeicherter Wert fuer setOptValue()
function setNextStored(arr, name, value, reload = false, serial = false, onFulfilled = undefined, onRejected = undefined) {
    return setStored(name, getNextValue(arr, value), reload, serial, onFulfilled, onRejected);
}

// ==================== Ende Abschnitt fuer die Sicherung und das Laden von Daten ====================

// *** EOF ***

/*** Ende Modul util.store.js ***/

/*** Modul util.xhr.js ***/

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
                                const __OK = ((__RESULT.statusText === 'OK')
                                            || (__RESULT.statusText === ""));

                                if (__OK && (__RESULT.status === 200)) {
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

                            const __RET = __ONERROR(error);

                            reject(__RET || error);
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

/*** Ende Modul util.xhr.js ***/

/*** Modul util.xhr.gm.js ***/

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

/*** Ende Modul util.xhr.gm.js ***/

/*** Modul util.dom.js ***/

// ==UserScript==
// _name         util.dom
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer DOM-Operationen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.dom.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer diverse DOM-Utilities ====================

// Legt Input-Felder in einem Form-Konstrukt an, falls noetig
// form: <FORM>...</FORM>
// props: Map von name:value-Paaren
// type: Typ der Input-Felder (Default: unsichtbare Daten)
// return Ergaenztes Form-Konstrukt
function addInputField(form, props, type = 'hidden') {
    for (let fieldName in props) {
        let field = form[fieldName];
        if (! field) {
            field = document.createElement('INPUT');
            field.type = type;
            field.name = fieldName;
            form.appendChild(field);
        }
        field.value = props[fieldName];
    }

    return form;
}

// Legt unsichtbare Input-Daten in einem Form-Konstrukt an, falls noetig
// form: <FORM>...</FORM>
// props: Map von name:value-Paaren
// return Ergaenztes Form-Konstrukt
function addHiddenField(form, props) {
    return addInputField(form, props, 'hidden');
}

// Hilfsfunktion fuer alle Browser: Fuegt fuer ein Event eine Reaktion ein
// obj: Betroffenes Objekt, z.B. ein Eingabeelement
// type: Name des Events, z.B. 'click'
// callback: Funktion als Reaktion
// capture: Event fuer Parent zuerst (true) oder Child (false als Default)
// return false bei Misserfolg
function addEvent(obj, type, callback, capture = false) {
    if (obj.addEventListener) {
        return obj.addEventListener(type, callback, capture);
    } else if (obj.attachEvent) {
        return obj.attachEvent('on' + type, callback);
    } else {
        __LOG[1]("Could not add " + type + " event:");
        __LOG[2](callback);

        return false;
    }
}

// Hilfsfunktion fuer alle Browser: Entfernt eine Reaktion fuer ein Event
// obj: Betroffenes Objekt, z.B. ein Eingabeelement
// type: Name des Events, z.B. 'click'
// callback: Funktion als Reaktion
// capture: Event fuer Parent zuerst (true) oder Child (false als Default)
// return false bei Misserfolg
function removeEvent(obj, type, callback, capture = false) {
    if (obj.removeEventListener) {
        return obj.removeEventListener(type, callback, capture);
    } else if (obj.detachEvent) {
        return obj.detachEvent('on' + type, callback);
    } else {
        __LOG[1]("Could not remove " + type + " event:");
        __LOG[2](callback);

        return false;
    }
}

// Hilfsfunktion fuer alle Browser: Fuegt fuer ein Event eine Reaktion ein
// id: ID des betroffenen Eingabeelements
// type: Name des Events, z.B. 'click'
// callback: Funktion als Reaktion
// capture: Event fuer Parent zuerst (true) oder Child (false als Default)
// return false bei Misserfolg
function addDocEvent(id, type, callback, capture = false) {
    const __OBJ = getElementById(id);

    return addEvent(__OBJ, type, callback, capture);
}

// Hilfsfunktion fuer alle Browser: Entfernt eine Reaktion fuer ein Event
// id: ID des betroffenen Eingabeelements
// type: Name des Events, z.B. 'click'
// callback: Funktion als Reaktion
// capture: Event fuer Parent zuerst (true) oder Child (false als Default)
// return false bei Misserfolg
function removeDocEvent(id, type, callback, capture = false) {
    const __OBJ = getElementById(id);

    return removeEvent(__OBJ, type, callback, capture);
}

// Pendant zur Javascript-Funktion Node.insertBefore(). Nur wird ueber das
// Eltern-Element hinter (statt vor) dem uebergebenen anchor eingefuegt.
// element: Neu hinzuzufuegenes HTML-Element (direkt hinter dem anchor)
// anchor: Element, hinter dem das Element unter demselben parent eingefuegt werden soll
// return Ueblicherweise das hinzugefuegte Element (Ausnahme: Siehe Node.insertBefore())
function insertAfter(element, anchor) {
    return anchor.parentNode.insertBefore(element, anchor.nextSibling);
}

// Gegenstueck zu insertAfter(). Wie die Javascript-Funktion Node.insertBefore().
// Nur wird ueber das Eltern-Element vor dem uebergebenen anchor eingefuegt.
// element: Neu hinzuzufuegenes HTML-Element (direkt hinter dem anchor)
// anchor: Element, vor dem das Element unter demselben parent eingefuegt werden soll
// return Ueblicherweise das hinzugefuegte Element (Ausnahme: Siehe Node.insertBefore())
function insertBefore(element, anchor) {
    return anchor.parentNode.insertBefore(element, anchor);
}

// Entfernt ein Element aus dem DOM-Baum ueber das Eltern-Element, das nicht angegeben werden muss.
// element: Zu loeschendes HTML-Element
// return Das entfernte Element
function removeElement(element) {
    return element.parentNode.removeChild(element);
}

// Hilfsfunktion fuer die Ermittlung aller Elements desselben Typs auf der Seite ueber CSS Selector (Default: Tabelle)
// selector: CSS Selector des Elements ('TABLE')
// doc: Dokument (document)
// return Kollektion aller gesuchten Elemente oder leer
function getElements(selector = 'TABLE', doc = document) {
    checkType(selector, 'string', true, 'getElements', 'selector', 'String');

    const __ELEMENTS = doc.querySelectorAll(selector);

    return __ELEMENTS;
}

// Hilfsfunktion fuer die Ermittlung eines Elements der Seite ueber CSS Selector (Default: Tabelle)
// selector: CSS Selector des Elements ('TABLE')
// index: Laufende Nummer des Elements (0-based), Default: 0
// doc: Dokument (document)
// return Gesuchtes Element oder undefined (falls nicht gefunden)
function getElement(selector = 'TABLE', index = 0, doc = document) {
    checkType(selector, 'string', true, 'getElement', 'selector', 'String');
    checkType(index, 'number', true, 'getElement', 'index', 'Number');

    const __ELEMENTS = doc.querySelectorAll(selector);
    const __ELEMENT = (__ELEMENTS ? __ELEMENTS[index] : undefined);

    return __ELEMENT;
}

// Hilfsfunktion fuer die Ermittlung eines Elements der Seite ueber den Namen
// name: Name des Elements (siehe "name=")
// index: Laufende Nummer des Elements (0-based), Default: 0
// doc: Dokument (document)
// return Gesuchtes Element mit der lfd. Nummer index oder undefined (falls nicht gefunden)
function getElementByName(name, index = 0, doc = document) {
    checkType(name, 'string', true, 'getElementByName', 'name', 'String');
    checkType(index, 'number', true, 'getElementByName', 'index', 'Number');

    const __ELEMENTS = doc.getElementsByName(name);
    const __ELEMENT = (__ELEMENTS ? __ELEMENTS[index] : undefined);

    return __ELEMENT;
}

// Hilfsfunktion fuer die Ermittlung eines Elements der Seite ueber die ID
// id: ID des Elements (siehe "id=")
// doc: Dokument (document)
// return Gesuchtes Element oder undefined (falls nicht gefunden)
function getElementById(id, doc = document) {
    checkType(id, 'string', true, 'getElementById', 'id', 'String');

    const __ELEMENT = doc.getElementById(id);

    return __ELEMENT;
}

// Hilfsfunktion fuer die Ermittlung aller Elemente der Seite (Default: Tabelle)
// tag: Tag des Elements ('TABLE')
// doc: Dokument (document)
// return Gesuchte Elemente
function getTags(tag = 'TABLE', doc = document) {
    checkType(tag, 'string', true, 'getTags', 'tag', 'String');

    const __TAGS = doc.getElementsByTagName(tag);

    return __TAGS;
}

// Hilfsfunktion fuer die Ermittlung eines Elements der Seite (Default: Tabelle)
// index: Laufende Nummer des Elements (0-based)
// tag: Tag des Elements ('TABLE')
// doc: Dokument (document)
// return Gesuchtes Element oder undefined (falls nicht gefunden)
function getTable(index = 0, tag = 'TABLE', doc = document) {
    checkType(tag, 'string', true, 'getTable', 'tag', 'String');
    checkType(index, 'number', true, 'getTable', 'index', 'Number');

    const __TAGS = getTags(tag, doc);
    const __TABLE = (__TAGS ? __TAGS[index] : undefined);

    return __TABLE;
}

// Hilfsfunktion fuer die Ermittlung der Zeilen einer Tabelle ueber den Namen
// name: Name des Tabellen-Elements (siehe "name=")
// index: Laufende Nummer des Tabellen-Elements (0-based), Default: 0
// doc: Dokument (document)
// return Gesuchte Zeilen oder undefined (falls nicht gefunden)
function getRowsByName(name, index = 0, doc = document) {
    checkType(name, 'string', true, 'getRowsByName', 'name', 'String');
    checkType(index, 'number', true, 'getRowsByName', 'index', 'Number');

    const __TABLE = getElementByName(name, index, doc);
    const __ROWS = (__TABLE ? __TABLE.rows : undefined);

    return __ROWS;
}

// Hilfsfunktion fuer die Ermittlung der Zeilen einer Tabelle ueber CSS Selector (Default: Tabelle)
// selector: CSS Selector des Elements ('TABLE')
// index: Laufende Nummer des Tabellen-Elements (0-based), Default: 0
// doc: Dokument (document)
// return Gesuchte Zeilen oder undefined (falls nicht gefunden)
function getRows(selector = 'TABLE', index = 0, doc = document) {
    checkType(selector, 'string', true, 'getRows', 'selector', 'String');
    checkType(index, 'number', true, 'getRows', 'index', 'Number');

    const __TABLE = getElement(selector, index, doc);
    const __ROWS = (__TABLE ? __TABLE.rows : undefined);

    return __ROWS;
}

// Hilfsfunktion fuer die Ermittlung der Zeilen eines Elements (Default: Tabelle)
// index: Laufende Nummer des Elements (0-based)
// tag: Tag des Elements ('TABLE')
// doc: Dokument (document)
// return Gesuchte Zeilen oder undefined (falls nicht gefunden)
function getTableRows(index = 0, tag = 'TABLE', doc = document) {
    checkType(index, 'number', true, 'getTableRows', 'index', 'Number');
    checkType(tag, 'string', true, 'getTableRows', 'tag', 'String');

    const __TABLE = getTable(index, tag, doc);
    const __ROWS = (__TABLE ? __TABLE.rows : undefined);

    return __ROWS;
}

// Hilfsfunktion fuer die Ermittlung der Zeilen einer Tabelle
// id: ID des Tabellen-Elements
// doc: Dokument (document)
// return Gesuchte Zeilen oder undefined (falls nicht gefunden)
function getRowsById(id, doc = document) {
    checkType(id, 'string', true, 'getRowsById', 'id', 'String');

    const __TABLE = getElementById(id, doc);
    const __ROWS = (__TABLE ? __TABLE.rows : undefined);

    return __ROWS;
}

// ==================== Ende Abschnitt fuer diverse DOM-Utilities ====================

// ==================== Abschnitt fuer sonstige Parameter ====================

// Fuegt eine Zelle ans Ende der uebergebenen Zeile hinzu und fuellt sie
// row: Zeile, die verlaengert wird
// content: Textinhalt oder HTML-Inhalt der neuen Zelle
// color: Schriftfarbe der neuen Zelle (z.B. '#FFFFFF' fuer weiss)
//      Bei Aufruf ohne Farbe wird die Standardfarbe benutzt
// align: Horizontale Textausrichtung (Default: 'center')
// showUndefined: Angabe, ob undefined als 'undefined' angezeigt wird (Default: false, also leer '')
// return Die angehaengte Zelle
function appendCell(row, content, color = undefined, align = 'center', showUndefined = false) {
    const __ROW = (row || { });
    const __CELL = __ROW.insertCell(-1);
    const __TARGET = ((showUndefined || (content !== undefined)) ? 'innerHTML' : 'textContent');

    __CELL[__TARGET] = content;
    __CELL.align = align;
    __CELL.style.color = color;

    return __CELL;
}

// Erzeugt die uebergebene Anzahl von Zellen in der uebergebenen Zeile
// row: Zeile, die aufgepumpt werden soll
// arrOrLength: Entweder ein Datenarray oder String zum Fuellen
//              oder die Anzahl der zu erzeugenden Zellen (Default: 1)
// color: Schriftfarbe der neuen Zelle (z.B. '#FFFFFF' fuer weiss)
// return Die aufgeblaehte Zeile
function inflateRow(row, arrOrLength = 1, color = undefined, align = 'center') {
    const __ROW = (row || { });
    const __ARR = (((typeof arrOrLength) === 'string') ? [ arrOrLength ] :
                    (((typeof arrOrLength) === 'number') ? [] : arrOrLength));
    const __LENGTH = (__ARR.length || arrOrLength);

    for (let i = 0; i < __LENGTH; i++) {
        appendCell(row, __ARR[i], color, align);
    }

    return __ROW;
}

// Formatiert eine Zelle um (mit 'style' Parametern)
// cell: Zu formatierende Zelle
// style: Objekt mit den Stil-Paramtern (siehe cell.style)
// return Die formatierte Zelle
function setCellStyle(cell, style) {
    const __STYLE = style || { };

    if (cell) {
        Object.assign(cell.style, __STYLE);
    }

    return cell;
}

// Formatiert eine ganze Zeile um (mit 'style' Parametern)
// row: Zu formatierende Zeile
// style: Objekt mit den Stil-Paramtern (siehe cell.style)
// return Die formatierte Zeile
function setRowStyle(row, style) {
    const __ROW = (row || { });
    const __CELLS = __ROW.cells;

    if (__CELLS) {
        const __LENGTH = __CELLS.length;

        for (let i = 0; i < __LENGTH; i++) {
            setCellStyle(__CELLS[i], style);
        }
    }

    return row;
}

// Formatiert eine Zelle um (mit einfachen Parametern)
// cell: Zu formatierende Zelle
// bold: Inhalt fett darstellen (Default: true = ja, false = nein)
// color: Falls angegeben, die Schriftfarbe
// bgColor: Falls angegeben, die Hintergrundfarbe
// opacity: Falls angegeben, die Opazitaet
// return Die formatierte Zelle
function formatCell(cell, bold = true, color = undefined, bgColor = undefined, opacity = undefined) {
    if (cell) {
        const __STYLE = { };

        if (bold) {
            __STYLE.fontWeight = 'bold';
        }
        if (color) {
            __STYLE.color = color;
        }
        if (bgColor) {
            __STYLE.backgroundColor = bgColor;
        }
        if (opacity) {
            __STYLE.opacity = opacity;
        }

        return setCellStyle(cell, __STYLE);
    }

    return cell;
}

// Formatiert eine ganze Zeile um (mit einfachen Parametern)
// row: Zu formatierende Zeile
// bold: Inhalt fett darstellen (Default: true = ja, false = nein)
// color: Falls angegeben, die Schriftfarbe
// bgColor: Falls angegeben, die Hintergrundfarbe
// opacity: Falls angegeben, die Opazitaet
// return Die formatierte Zeile
function formatRow(row, bold = true, color = undefined, bgColor = undefined, opacity = undefined) {
    const __ROW = (row || { });
    const __CELLS = __ROW.cells;

    if (__CELLS) {
        const __LENGTH = __CELLS.length;

        for (let i = 0; i < __LENGTH; i++) {
            formatCell(__CELLS[i], bold, color, bgColor, opacity);
        }
    }

    return row;
}

// Ermittelt ein Stil-Attribut in Abhaengigkeit der Klasse aus einem Array von Elementen
// elements: Array von Elementen
// propertyName: Name des gesuchten Attributs (value) oder undefined fuer alles
// keyFun: Funktion zur Ermittlung des Keys aus einem Element (key)
// return Liste von key/value-Paaren (<className> : <property> oder <className> : <style>)
function getStyleFromElements(elements, propertyName = undefined, keyFun = getClassNameFromElement) {
    const __ELEMENTS = getValue(elements, []);
    const __RET = { };

    for (let index = 0; index < __ELEMENTS.length; index++) {
        const __ELEMENT = __ELEMENTS[index];
        const __KEY = keyFun(__ELEMENT);
        const __STYLE = window.getComputedStyle(__ELEMENT);
        const __VALUE = (propertyName ? __STYLE[propertyName] : __STYLE);

        __RET[__KEY] = __VALUE;
    }

    return __RET;
}

// Default-KeyFun fuer getStyleFromElements(). Liefert den Klassennamen
// element: Ein Element
// return className des Elements
function getClassNameFromElement(element) {
    return element.className;
}

// Default-KeyFun fuer getStylePropFromElements(). Liefert den UpperCase-Klassennamen
// element: Ein Element
// return className des Elements in Grossbuchstaben
function getUpperClassNameFromElement(element) {
    return element.className.toUpperCase();
}

// ==================== Abschnitt fuer Selektion ====================

// Ermittelt die auszugewaehlenden Werte eines Selects (Combo-Box) als Array zurueck
// element: 'select'-Element oder dessen Name auf der HTML-Seite mit 'option'-Eintraegen der Combo-Box
// valType: Typ-Klasse der Optionswerte ('String', 'Number', ...)
// valFun: Funktion zur Ermittlung des Wertes eines 'option'-Eintrags (getSelectedOptionText, getSelectedValue, ...)
// defValue: Default-Wert, falls nichts selektiert ist
// return Array mit den Options-Werten
function getSelectionArray(element, valType = 'String', valFun = getSelectedValue, defValue = undefined) {
    const __SELECT = ((typeof element) === 'string' ? getElementByName(element) : element);

    return (__SELECT ? [].map.call(__SELECT.options, function(option) {
                                                         return this[valType](getValue(valFun(option), defValue));
                                                     }) : undefined);
}

// Ermittelt den ausgewaehlten Wert eines Selects (Combo-Box) und gibt diesen zurueck
// element: 'select'-Element oder dessen Name auf der HTML-Seite mit 'option'-Eintraegen der Combo-Box
// valType: Typ-Klasse der Optionswerte ('String', 'Number', ...)
// valFun: Funktion zur Ermittlung des Wertes eines 'option'-Eintrags (getSelectedOptionText, getSelectedValue, ...)
// defValue: Default-Wert, falls nichts selektiert ist
// return Ausgewaehlter Wert
function getSelection(element, valType = 'String', valFun = getSelectedOptionText, defValue = undefined) {
    const __SELECT = ((typeof element) === 'string' ? getElementByName(element) : element);

    return this[valType](getValue(valFun(__SELECT), defValue));
}

// Ermittelt den ausgewaehlten Wert einer Combo-Box und gibt diesen zurueck
// comboBox: Alle 'option'-Eintraege der Combo-Box
// defValue: Default-Wert, falls nichts selektiert ist
// valType: Typ-Klasse der Optionswerte ('String', 'Number', ...)
// return Ausgewaehlter Wert
function getSelectionFromComboBox(comboBox, defValue = undefined, valType = 'String') {
    let selection;

    for (let i = 0; i < comboBox.length; i++) {
        const __ENTRY = comboBox[i];

        if (__ENTRY.outerHTML.match(/selected/)) {
            selection = __ENTRY.textContent;
        }
    }

    return this[valType](getValue(selection, defValue));
}

// Liefert den Text (textContent) einer selektierten Option
// element: 'select'-Element auf der HTML-Seite mit 'option'-Eintraegen der Combo-Box
// return Wert der Selektion (textContent)
function getSelectedOptionText(element) {
    const __SELECTEDOPTIONS = getValue(element, { }).selectedOptions;
    const __OPTION = getValue(__SELECTEDOPTIONS, { })[0];

    return (__OPTION ? __OPTION.textContent : undefined);
}

// Liefert den 'value' einer selektierten Option
// element: 'select'-Element auf der HTML-Seite mit 'option'-Eintraegen der Combo-Box
// return Wert der Selektion ('value')
function getSelectedValue(element) {
    return getValue(element, { }).value;
}

// ==================== Abschnitt fuer Daten auslesen ====================

// Liest eine Zahl aus der Spalte einer Zeile der Tabelle aus (z.B. Alter, Geburtsdatum)
// cells: Die Zellen einer Zeile
// colIdxInt: Spaltenindex der gesuchten Werte
// return Spalteneintrag als Zahl (-1 fuer "keine Zahl", undefined fuer "nicht gefunden")
function getIntFromHTML(cells, colIdxInt) {
    checkType(colIdxInt, 'number', true, 'getIntFromHTML', 'colIdxInt', 'Number');

    const __CELL = getValue(cells[colIdxInt], { });
    const __TEXT = __CELL.textContent;

    if (__TEXT !== undefined) {
        try {
            const __VALUE = parseInt(__TEXT, 10);

            if (! isNaN(__VALUE)) {
                return __VALUE;
            }
        } catch (ex) { }

        return -1;
    }

    return undefined;
}

// Liest eine Dezimalzahl aus der Spalte einer Zeile der Tabelle aus
// cells: Die Zellen einer Zeile
// colIdxInt: Spaltenindex der gesuchten Werte
// return Spalteneintrag als Dezimalzahl (undefined fuer "keine Zahl" oder "nicht gefunden")
function getFloatFromHTML(cells, colIdxFloat) {
    checkType(colIdxFloat, 'number', true, 'getFloatFromHTML', 'colIdxFloat', 'Number');

    const __CELL = getValue(cells[colIdxFloat], { });
    const __TEXT = __CELL.textContent;

    if (__TEXT !== undefined) {
        try {
            return parseFloat(__TEXT);
        } catch (ex) { }
    }

    return undefined;
}

// Liest einen String aus der Spalte einer Zeile der Tabelle aus
// cells: Die Zellen einer Zeile
// colIdxStr: Spaltenindex der gesuchten Werte
// return Spalteneintrag als String ("" fuer "nicht gefunden")
function getStringFromHTML(cells, colIdxStr) {
    checkType(colIdxStr, 'number', true, 'getStringFromHTML', 'colIdxStr', 'Number');

    const __CELL = getValue(cells[colIdxStr], { });
    const __TEXT = __CELL.textContent;

    return getValue(__TEXT.toString(), "");
}

// Liest ein erstes Element aus der Spalte einer Zeile der Tabelle aus
// cells: Die Zellen einer Zeile
// colIdxElem: Spaltenindex der gesuchten Werte
// return Spalteneintrag als Element (null fuer "nicht gefunden")
function getElementFromHTML(cells, colIdxElem) {
    checkType(colIdxElem, 'number', true, 'getElementFromHTML', 'colIdxElem', 'Number');

    const __CELL = getValue(cells[colIdxElem], { });

    return __CELL.firstElementChild;
}

// Liest einen String aus der Spalte einer Zeile der Tabelle aus, nachdem dieser konvertiert wurde
// cells: Die Zellen einer Zeile
// colIdxStr: Spaltenindex der gesuchten Werte
// convertFun: Funktion, die den Wert konvertiert
// return Spalteneintrag als String ("" fuer "nicht gefunden")
function convertStringFromHTML(cells, colIdxStr, convertFun = sameValue) {
    checkType(colIdxStr, 'number', true, 'convertStringFromHTML', 'colIdxStr', 'Number');
    checkType(convertFun, 'function', true, 'convertStringFromHTML', 'convertFun', 'Function');

    const __CELL = getValue(cells[colIdxStr], { });
    const __TEXT = convertFun(__CELL.textContent, __CELL, colIdxStr, 0);

    if (__TEXT !== undefined) {
        __CELL.innerHTML = __TEXT;
    }

    return getValue(__TEXT.toString(), "");
}


// Liest ein Array von String-Werten aus den Spalten ab einer Zeile der Tabelle aus, nachdem diese konvertiert wurden
// cells: Die Zellen einer Zeile
// colIdxArr: Erster Spaltenindex der gesuchten Werte
// arrOrLength: Entweder ein Datenarray zum Fuellen oder die Anzahl der zu lesenden Werte
// arrOrLength: Entweder ein Datenarray oder String zum Fuellen
//              oder die Anzahl der zu lesenden Werte (Default: 1)
// convertFun: Funktion, die die Werte konvertiert
// return Array mit Spalteneintraegen als String ("" fuer "nicht gefunden")
function convertArrayFromHTML(cells, colIdxArr, arrOrLength = 1, convertFun = sameValue) {
    checkType(colIdxArr, 'number', true, 'convertArrayFromHTML', 'colIdxArr', 'Number');
    checkType(convertFun, 'function', true, 'convertArrayFromHTML', 'convertFun', 'Function');

    const __ARR = (((typeof arrOrLength) === 'string') ? [ arrOrLength ] :
                    (((typeof arrOrLength) === 'number') ? [] : arrOrLength));
    const __LENGTH = (__ARR.length || arrOrLength);
    const __RET = [];

    for (let index = 0, colIdx = colIdxArr; index < __LENGTH; index++, colIdx++) {
        const __CELL = getValue(cells[colIdx], { });
        const __TEXT = convertFun(getValue(__ARR[index], __CELL.textContent), __CELL, colIdx, index);

        if (__TEXT !== undefined) {
            __CELL.innerHTML = __TEXT;
        }

        __RET.push(getValue(__TEXT, "").toString());
    }

    return __RET;
}

// ==================== Ende Abschnitt fuer sonstige Parameter ====================

// *** EOF ***

/*** Ende Modul util.dom.js ***/

/*** Modul util.script.js ***/

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
            const __SCRIPT = document.createElement('SCRIPT');

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

/*** Ende Modul util.script.js ***/

