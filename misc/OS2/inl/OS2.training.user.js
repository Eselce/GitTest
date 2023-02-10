// ==UserScript==
// @name         OS2.training
// @namespace    http://os.ongapo.com/
// @version      0.31+lib-inl
// @copyright    2013+
// @author       Sven Loges (SLC) / Andreas Eckes (Strindheim BK)
// @description  OS 2.0 - Berechnet die Trainingswahrscheinlichkeiten abhaengig von der Art des Einsatzes
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/haupt\.php(\?changetosecond=\w+(&\w+=?[+\w]+)*)?(#\w+)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/trainer\.php(\?\w+=?[+\w]+(&\w+=?[+\w]+)*)?(#\w+)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/training\.php(\?\w+=?[+\w]+(&\w+=?[+\w]+)*)?(#\w+)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/zar\.php(\?\w+=?[+\w]+(&\w+=?[+\w]+)*)?(#\w+)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/zugabgabe\.php(\?\w+=?[+\w]+(&\w+=?[+\w]+)*)?(#\w+)?$/
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.registerMenuCommand
// @grant        GM.info
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.log.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.object.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.promise.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.value.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.proto.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.prop.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.sys.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.mod.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.debug.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.store.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.dom.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.script.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.delim.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.path.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.uri.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.report.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.type.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.data.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.class.options.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.api.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.db.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.cmd.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.menu.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.label.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.action.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.node.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.run.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.main.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.list.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.calc.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.team.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.page.team.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.page.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.zat.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.warndraw.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.player.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.column.js
// ==/UserScript==

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.log.js ***/

// ==UserModule==
// _name         util.log
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Logging und safeStringify()
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// ==/UserModule==

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

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.log.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.object.js ***/

// ==UserModule==
// _name         util.object
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Details zu Objekten, Arrays, etc.
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// ==/UserModule==

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

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.object.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.promise.js ***/

// ==UserModule==
// _name         util.promise
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Details zu Promises
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Promise-Utilities ====================

// getQueuedPromise() - Liefert synchronisiertes Promise (aus Roman Bauers osext2-Project)
// Wird ueber internes Promise 'pending' synchronisiert. Zeitlicher Ablauf:
// Pre 1. Anonyme Funktion: () => { }
// Pre 2. wird ausgefuehrt: (() => { })();
// Pre 3. setzt pending auf resolved: let pending = Promise.resolve();
// Pre 4. const run = async (executor) => { ... return new Promise(executor); }
// Pre 5. und liefert zurueck: (executor) => (pending = run(executor))
// Bei Aufruf:
// 1. Executor anlegen: executor = (resolve, reject) => { }
// 2. Promise anlegen: getQueuedPromise(executor)
// 3. getQueuedPromise: (executor) => (pending = run(executor))
// 4. async run: try { await pending; }
// 5. wartet auf vorherige Operation: await
// 6. async run: finally { return new Promise(executor); }
// 7. liefert Promise zurueck: new Promise(executor)
// 8. setzt pending auf Promise: pending = new Promise(executor)
// 9. liefert Promise zurueck: (executor) => pending
const getQueuedPromise = (() => {
    let pending = Promise.resolve();
    const run = async (executor) => {
        try {
            await pending;
        } finally {
            /* eslint no-unsafe-finally: 'off' */
            return getTimedPromise(executor);
        }
    };
    return (executor) => (pending = run(executor));
})();

const getQueuedPromiseRombau = (() => {
    let pending = Promise.resolve();
    const run = (async executor => {
            try {
                await pending;
            } catch (ex) {
                return Promise.reject(ex);
            }

            return getTimedPromise(executor);
        });
    return (executor => (pending = run(executor)));
})();

/***
function QueuedPromiseFactory() {
    this._lock = Promise.resolve();

    Object.call(this);
}

QueuedPromiseFactory.prototype.create = function(executor) {
        this._promise = getTimedPromise(async (resolve, reject) => {
                await this._lock;
                this._pending = (pending = this);

                return executor(resolve, reject);
            });
    };

QueuedPromiseFactory.prototype = Object.create(Object.prototype);

QueuedPromiseFactory.prototype.constructor = QueuedPromiseFactory;
***/

const newPromise = ((executor, millisecs = 15000) => new Promise((resolve, reject) => {
            const timerID = window.setTimeout((() => reject(Error("Timed out"))), millisecs);
            return executor((value => (window.clearTimeout(timerID), resolve(value))), reject);
        }));

function getTimedPromiseSLC(executor, millisecs = 15000) {
    return new Promise((resolve, reject) => {
            const timeoutFun = (() => {
                    return reject(Error("Timed out (" + (millisecs / 1000) + "s)"));
                });
            const timerID = setTimeout(timeoutFun, millisecs);
            const resolveFun = (value => {
                    clearTimeout(timerID);
                    return resolve(value);
                });
            return executor(resolveFun, reject);
        });
}

//const Options = { timeout : 10000 };

/**
 * Returns a promise with the given executor. The new promise will be rejected after a the given timout in millis,
 * if the executor doesn't resolve before.
 *
 * @param executor a callback used to initialize the promise
 * @param timeout the timeout in millis
 * @returns {Promise}
 */
const getTimedPromiseRombau = (executor, timeout = 10000 /***Options.timeout***/) => {
    return new Promise((resolve, reject) => {
        const timerID = setTimeout(() => reject(new Error('Die Verarbeitung hat zu lange gedauert!')), timeout);
        return executor(value => {
            clearTimeout(timerID); 
            resolve(value);
        }, reject);
    });
}

// ==================== Ende Abschnitt fuer Promise-Utilities ====================

// ==================== Abschnitt fuer einfaches Testen von Arrays von Promises und Funktionen ====================

// Funktion zum sequentiellen Aufruf eines Arrays von Funktionen ueber Promises
// startValue: Promise, das den Startwert oder das Startobjekt beinhaltet
// funs: Liste oder Array von Funktionen, die jeweils das Zwischenergebnis umwandeln
// throw Wirft im Fehlerfall eine AssertionFailed-Exception
// return Ein Promise-Objekt mit dem Endresultat
async function callPromiseChain(startValue, ... funs) {
    checkObjClass(startValue, Promise, false, "callPromiseChain()", "startValue", 'Promise')

    funs.forEach((fun, index) => {
            checkType(fun, 'function', true, "callPromiseChain()", "Parameter #" + (index + 1), 'Function');
        });

    return funs.flat(1).reduce((prom, fun, idx, arr) => prom.then(fun).catch(
                                    ex => promiseChainCatch(ex, fun, prom, idx, arr)),
                                startValue.catch(ex => promiseCatch(ex, startValue))
                            ).catch(promiseChainFinalCatch);
}

// Funktion zum parallelen Aufruf eines Arrays von Promises bzw. Promise-basierten Funktionen
// promises: Liste oder Array von Promises oder Werten
// throw Wirft im Fehlerfall eine AssertionFailed-Exception
// return Ein Promise-Objekt mit einem Array von Einzelergebnissen als Endresultat
async function callPromiseArray(... promises) {
    return Promise.all(promises.flat(1).map(
            (val, idx, arr) => Promise.resolve(val).catch(
                ex => promiseCatch(ex, prom, idx, arr))));
}

// Parametrisierte Catch-Funktion fuer einen gegebenen Promise-Wert, ggfs. mit Angabe der Herkunft
// ex: Die zu catchende Exception
// prom: Promise (rejeted) zum betroffenen Wert
// idx: Index innerhalb des Werte-Arrays
// arr: Werte-Array mit den Promises
// return Liefert eine Assertion und die showAlert()-Parameter zurueck, ergaenzt durch die Attribute
function promiseCatch(ex, prom, idx = undefined, arr = undefined) {
    checkObjClass(prom, Promise, true, "promiseCatch()", "prom", 'Promise');
    checkType(idx, 'number', false, "promiseCatch()", "idx", 'Number');
    checkObjClass(arr, Array, false, "promiseCatch()", "arr", 'Array');

    const __CODELINE = codeLine(false, true, 3, false);
    const __ATTRIB = {
            'promise'   : prom,
            'location'  : __CODELINE
        };

    ((idx !== undefined) && (__ATTRIB['index'] = idx));
    ((arr !== undefined) && (__ATTRIB['array'] = arr));

    __LOG[2]("CATCH:", ex, prom, __LOG.info(__ATTRIB, true, false));

    const __RET = assertionCatch(ex, __LOG.info(__ATTRIB));

    return __RET;
}

// Parametrisierte Catch-Funktion fuer einen gegebenen Promise-Wert einer Chain, ggfs. mit Angabe der Herkunft
// ex: Die zu catchende Exception
// fun: betroffene Funktion innerhalb der Promise-Chain (die eine rejected Rueckgabe produziert)
// prom: Parameter-Promise zur betroffenen Funktion
// idx: Index innerhalb des Funktions-Arrays
// arr: Funktions-Array mit den Promises
// return Liefert eine Assertion und die showAlert()-Parameter zurueck, ergaenzt durch die Attribute
function promiseChainCatch(ex, fun, prom = undefined, idx = undefined, arr = undefined) {
    checkType(fun, 'function', true, "promiseChainCatch()", "fun", 'Function');
    checkObjClass(prom, Promise, true, "promiseChainCatch()", "Parameter", 'Promise');
    checkType(idx, 'number', false, "promiseChainCatch()", "idx", 'Number');
    checkObjClass(arr, Array, false, "promiseChainCatch()", "arr", 'Array');

    // Ist prom nicht rejected oder nicht vorhanden, liefere neue Exception,
    // ansonsten einfach alten Fehler durchreichen (jeweils rejected)...
    return (prom || Promise.resolve()).then(() => {
            const __CODELINE = codeLine(false, true, 3, false);
            const __ATTRIB = {
                    'function'  : fun,
                    'location'  : __CODELINE
                };

            ((prom !== undefined) && (__ATTRIB['param'] = prom));
            ((idx  !== undefined) && (__ATTRIB['index'] = idx));
            ((arr  !== undefined) && (__ATTRIB['array'] = arr));

            __LOG[2]("CATCH[" + idx + "]:", ex, prom, __LOG.info(__ATTRIB, true, false));

            const __RET = assertionCatch(ex, __ATTRIB);

            return __RET;
        });
}

// Catch-Funktion, die in einer Chain die Behandlung der Fehler abschliesst
// ex: Die zu catchende Exception
// return Liefert eine Rejection mit der richtigen Exception zurueck
async function promiseChainFinalCatch(ex) {
    const __EX = ex;

    // TODO Unklar, ob es benoetigt wird!

    const __RET = __EX;

    return Promise.reject(__RET);
}

// ==================== Ende Abschnitt fuer einfaches Testen von Arrays von Promises und Funktionen  ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.promise.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.value.js ***/

// ==UserModule==
// _name         util.value
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Logging, Debugging, Error-Handling, usw.
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// ==/UserModule==

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
    // Whitespaces vorne und hinten entfernen...
    const str = __STR.replace(/[a-zA-Z%]/g, "").trim();
    const __REGEXPINT     = /^[+-]?\d+$/;
    const __REGEXPINTDOTS = /^[+-]?\d+(\.\d{3})+$/;
    const __REGEXPNUMBER  = /^[+-]?\d*\.\d+$/;
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

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.value.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.proto.js ***/

// ==UserModule==
// _name         util.proto
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Prototypes
// _require      https://eselce.github.io/OS2.scripts/lib/util.proto.js
// ==/UserModule==

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

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.proto.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.prop.js ***/

// ==UserModule==
// _name         util.prop
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Logging, Debugging, Error-Handling, usw.
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.prop.js
// ==/UserModule==

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

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.prop.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.sys.js ***/

// ==UserModule==
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
// ==/UserModule==

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

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.sys.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.mod.js ***/

// ==UserModule==
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
// ==/UserModule==

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

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.mod.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.debug.js ***/

// ==UserModule==
// _name         util.debug
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Debugging, Error-Handling, usw.
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// ==/UserModule==

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

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.debug.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.store.js ***/

// ==UserModule==
// _name         util.store
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Script-Optionen im Benutzermenue
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// ==/UserModule==

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

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.store.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.dom.js ***/

// ==UserModule==
// _name         util.dom
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer DOM-Operationen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.dom.js
// ==/UserModule==

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

    return getValue(__CELL.firstElementChild, null);
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

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.dom.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.script.js ***/

// ==UserModule==
// _name         util.script
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer das Laden, Starten und Benutzen von Skripten
// _require      https://eselce.github.io/OS2.scripts/lib/util.script.js
// ==/UserModule==

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

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.script.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.class.js ***/

// ==UserModule==
// _name         util.class
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Class-Objekte
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Polyfill fuer showAlert() ====================

if ((typeof showAlert) === 'undefined') {
    this.showAlert = console.error;
}

// ==================== Abschnitt fuer Klasse Class ====================

/*class*/ function Class /*{
    constructor*/(className, baseClass, initFun) {
        'use strict';

        try {
            const __BASE = ((baseClass !== undefined) ? baseClass : Object);
            const __BASEPROTO = (__BASE ? __BASE.prototype : undefined);
            const __BASECLASS = (__BASEPROTO ? __BASEPROTO.__class : undefined);

            this.className = (className || '?');
            this.baseClass = __BASECLASS;
            Object.setConst(this, 'baseProto', __BASEPROTO, false);

            if (! initFun) {
                const __BASEINIT = (__BASECLASS || { }).init;

                if (__BASEINIT) {
                    initFun = function() {
                                  // Basisklassen-Init aufrufen...
                                  return __BASEINIT.apply(this, arguments);
                              };
                } else {
                    initFun = function() {
                                  // Basisklassen-Init fehlt (und Basisklasse ist nicht Object)...
                                  return false;
                              };
                }
            }

            console.assert((__BASE === null) || ((typeof __BASE) === 'function'), "No function:", __BASE);
            console.assert((typeof initFun) === 'function', "Not a function:", initFun);

            this.init = initFun;
        } catch (ex) {
            return showException('[' + (ex && ex.lineNumber) + "] Error in Class " + className, ex);
        }
    }
//}

Class.define = function(subClass, baseClass, members = undefined, initFun = undefined, createProto = true) {
        return (subClass.prototype = subClass.subclass(baseClass, members, initFun, createProto));
    };

Object.setConst = function(obj, item, value, config) {
        return Object.defineProperty(obj, item, {
                        enumerable   : false,
                        configurable : (config || true),  // TODO
                        writable     : false,
                        value        : value
                    });
    };

Object.setConst(Object.prototype, 'subclass', function(baseClass, members, initFun, createProto) {
        'use strict';

        try {
            const __MEMBERS = (members || { });
            const __CREATEPROTO = ((createProto === undefined) ? true : createProto);

            console.assert((typeof this) === 'function', "Not a function:", this);
            console.assert((typeof __MEMBERS) === 'object', "Not an object:", __MEMBERS);

            const __CLASS = new Class(this.name || __MEMBERS.__name, baseClass, initFun || __MEMBERS.__init);
            const __PROTO = (__CREATEPROTO ? Object.create(__CLASS.baseProto) : this.prototype);

            for (let item in __MEMBERS) {
                if ((item !== '__name') && (item !== '__init')) {
                    Object.setConst(__PROTO, item, __MEMBERS[item]);
                }
            }

            Object.setConst(__PROTO, 'constructor', this);

            Object.setConst(__PROTO, '__class', __CLASS, ! __CREATEPROTO);

            return __PROTO;
        } catch (ex) {
            return showException('[' + (ex && ex.lineNumber) + "] Error in subclassing", ex);
        }
    }, false);

Class.define(Object, null, {
                    '__init'       : function() {
                                         // Oberstes Basisklassen-Init...
                                         return true;
                                     },
                    'getClass'     : function() {
                                         return this.__class;
                                     },
                    'getClassName' : function() {
                                         const __CLASS = this.getClass();

                                         return (__CLASS ? __CLASS.getName() : undefined);
                                     },
                    'setConst'     : function(item, value, config = undefined) {
                                         return Object.setConst(this, item, value, config);
                                     }
                }, undefined, false);

Class.define(Function, Object);

Class.define(Class, Object, {
                    'getName'      : function() {
                                         return this.className;
                                     }
                });

// ==================== Ende Abschnitt fuer Klasse Class ====================

// ==================== Abschnitt fuer Hilfsfunktionen ====================

//
// Hilfsfunktionen, die von Options.toString() genutzt werden
//

// Liefert die Klasse des Objektes
// obj: Das Objekt, um das es geht
// return Klassenname der Klasse des Objektes
function getClass(obj) {
    if (obj != undefined) {
        if ((typeof obj) === 'object') {
            if (obj.getClass) {
                return obj.getClass();
            }
        }
    }

    return undefined;
}

// Liefert den Klassennamen des Objektes
// obj: Das Objekt, um das es geht
// return Klassenname der Klasse des Objektes
function getClassName(obj) {
    const __CLASS = getClass(obj);

    return ((__CLASS ? __CLASS.className : undefined));  // __CLASS.getName() problematisch?
}

// ==================== Abschnitt fuer Hilfsfunktionen ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.class.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.class.delim.js ***/

// ==UserModule==
// _name         util.class.delim
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Class-Objekten zu Pfad-Trennern
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.delim.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse Delims ====================

// Basisklasse fuer die Verwaltung der Trennzeichen und Symbole von Pfaden
// delim: Trennzeichen zwischen zwei Ebenen (oder Objekt/Delims mit entsprechenden Properties)
// back: (Optional) Name des relativen Vaterverzeichnisses
// root: (Optional) Kennung vor dem ersten Trenner am Anfang eines absoluten Pfads
// home: (Optional) Kennung vor dem ersten Trenner am Anfang eines Pfads relativ zu Home
function Delims(delim, back, root, home) {
    'use strict';

    if ((typeof delim) === 'object') {
        // Erster Parameter ist Objekt mit den Properties...
        if (back === undefined) {
            back = delim.back;
        }
        if (root === undefined) {
            root = delim.root;
        }
        if (home === undefined) {
            home = delim.home;
        }
        delim = delim.delim;
    }

    this.setDelim(delim);
    this.setBack(back);
    this.setRoot(root);
    this.setHome(home);
}

Class.define(Delims, Object, {
              'setDelim'       : function(delim = undefined) {
                                     this.delim = delim;
                                 },
              'setBack'        : function(back = undefined) {
                                     this.back = back;
                                 },
              'setRoot'        : function(root = undefined) {
                                     this.root = root;
                                 },
              'setHome'        : function(home = undefined) {
                                     this.home = home;
                                 }
          });

// ==================== Ende Abschnitt fuer Klasse Delims ====================

// ==================== Abschnitt fuer Klasse UriDelims ====================

// Basisklasse fuer die Verwaltung der Trennzeichen und Symbole von URIs
// delim: Trennzeichen zwischen zwei Ebenen (oder Objekt/Delims mit entsprechenden Properties)
// back: (Optional) Name des relativen Vaterverzeichnisses
// root: (Optional) Kennung vor dem ersten Trenner am Anfang eines absoluten Pfads
// home: (Optional) Kennung vor dem ersten Trenner am Anfang eines Pfads relativ zu Home
// scheme: (Optional) Trennzeichen fuer den Schema-/Protokollnamen vorne
// host: (Optional) Prefix fuer Hostnamen hinter dem Scheme-Trenner
// port: (Optional) Trennzeichen vor der Portangabe, falls vorhanden
// query: (Optional) Trennzeichen fuer die Query-Parameter hinter dem Pfad
// parSep: (Optional) Trennzeichen zwischen je zwei Parametern
// parAss: (Optional) Trennzwischen zwischen Key und Value
// node: (Optional) Trennzeichen fuer den Knotennamen hinten (Fragment, Kapitel)
function UriDelims(delim, back, root, home, scheme, host, port, query, qrySep, qryAss, node) {
    'use strict';

    if ((typeof delim) === 'object') {
        // Erster Parameter ist Objekt mit den Properties...
        if (scheme === undefined) {
            scheme = delim.scheme;
        }
        if (host === undefined) {
            host = delim.host;
        }
        if (port === undefined) {
            port = delim.port;
        }
        if (query === undefined) {
            query = delim.query;
        }
        if (qrySep === undefined) {
            qrySep = delim.qrySep;
        }
        if (qryAss === undefined) {
            qryAss = delim.qryAss;
        }
        if (node === undefined) {
            node = delim.node;
        }
    }

    Delims.call(this, delim, back, root, home);

    this.setScheme(scheme);
    this.setHost(host);
    this.setPort(port);
    this.setQuery(query);
    this.setQrySep(qrySep);
    this.setQryAss(qryAss);
    this.setNode(node);
}

Class.define(UriDelims, Delims, {
              'setScheme'      : function(scheme = undefined) {
                                     this.scheme = scheme;
                                 },
              'setHost'        : function(host = undefined) {
                                     this.host = host;
                                 },
              'setPort'        : function(port = undefined) {
                                     this.port = port;
                                 },
              'setQuery'       : function(query = undefined) {
                                     this.query = query;
                                 },
              'setQrySep'      : function(qrySep = undefined) {
                                     this.qrySep = qrySep;
                                 },
              'setQryAss'      : function(qryAss = undefined) {
                                     this.qryAss = qryAss;
                                 },
              'setNode'        : function(node = undefined) {
                                     this.node = node;
                                 }
          });

// ==================== Ende Abschnitt fuer Klasse UriDelims ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.class.delim.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.class.path.js ***/

// ==UserModule==
// _name         util.class.path
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Class-Objekten zu Pfad, Verzeichnis und Objektreferenz
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.delim.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.path.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse Path ====================

// Basisklasse fuer die Verwaltung eines Pfades
// homePath: Absoluter Startpfad als String
// delims: Objekt mit Trennern und Symbolen als Properties (oder Delims-Objekt)
// 'delim': Trennzeichen zwischen zwei Ebenen
// 'back': Name des relativen Vaterverzeichnisses
// 'root': Kennung vor dem ersten Trenner am Anfang eines absoluten Pfads
// 'home': Kennung vor dem ersten Trenner am Anfang eines Pfads relativ zu Home

/*class*/ function Path /*{
    constructor*/(homePath, delims) {
        'use strict';

        this.dirs = [];
        this.setDelims(delims);
        this.homeDirs = this.getDirs(homePath, { 'home' : "" });

        this.home();
    }
//}

Class.define(Path, Object, {
                  'root'           : function() {
                                         this.dirs.splice(0, this.dirs.length);
                                     },
                  'home'           : function() {
                                         this.dirs = this.homeDirs.slice();
                                     },
                  'up'             : function() {
                                         this.dirs.pop();
                                     },
                  'down'           : function(subDir) {
                                         this.dirs.push(subDir);
                                     },
                  'setDelims'      : function(delims = undefined) {
                                         this.setConst('delims', new Delims(delims));
                                     },
                  'setDelim'       : function(delim = undefined) {
                                         this.delims.setDelim(delim || '/');
                                     },
                  'setBackDelim'   : function(backDelim = undefined) {
                                         this.delims.setBack(backDelim || "..");
                                     },
                  'setRootDelim'   : function(rootDelim = undefined) {
                                         this.delims.setRoot(rootDelim || "");
                                     },
                  'setHomeDelim'   : function(homeDelim = undefined) {
                                         this.delims.setHome(homeDelim || '~');
                                     },
                  'setSchemeDelim' : function(schemeDelim = undefined) {
                                         this.delims.setScheme(schemeDelim || ':');
                                     },
                  'setHostDelim'   : function(hostDelim = undefined) {
                                         this.delims.setHost(hostDelim || '//');
                                     },
                  'setPortDelim'   : function(portDelim = undefined) {
                                         this.delims.setHost(portDelim || ':');
                                     },
                  'setQueryDelim'  : function(queryDelim = undefined) {
                                         this.delims.setQuery(queryDelim || '?');
                                     },
                  'setParSepDelim' : function(parSepDelim = undefined) {
                                         this.delims.setParSep(parSepDelim || '&');
                                     },
                  'setParAssDelim' : function(parAssDelim = undefined) {
                                         this.delims.setParAss(parAssDelim || '=');
                                     },
                  'setNodeDelim'   : function(nodeDelim = undefined) {
                                         this.delims.setNode(nodeDelim || '#');
                                     },
                  'getLeaf'        : function(dirs = undefined) {
                                         const __DIRS = (dirs || this.dirs);

                                         return ((__DIRS && __DIRS.length) ? __DIRS.slice(-1)[0] : "");
                                     },
                  'getPath'        : function(dirs = undefined, delims = undefined) {
                                         const __DELIMS = new Delims(delims);
                                         const __DELIM = (__DELIMS.delim || this.delims.delim);
                                         const __ROOTDELIM = ((__DELIMS.root !== undefined) ? __DELIMS.root : this.delims.root);
                                         const __DIRS = (dirs || this.dirs);

                                         return __ROOTDELIM + __DELIM + __DIRS.join(__DELIM);
                                     },
                  'getDirs'        : function(path = undefined, delims = undefined) {
                                         const __DELIMS = new Delims(delims);
                                         const __DELIM = (__DELIMS.delim || this.delims.delim);
                                         const __ROOTDELIM = ((__DELIMS.root !== undefined) ? __DELIMS.root : this.delims.root);
                                         const __HOMEDELIM = ((__DELIMS.home !== undefined) ? __DELIMS.home : this.delims.home);
                                         const __DIRS = (path ? path.split(__DELIM) : []);
                                         const __FIRST = __DIRS[0];

                                         if (__FIRST && (__FIRST !== __ROOTDELIM) && (__FIRST !== __HOMEDELIM)) {
                                             showAlert("Kein absoluter Pfad", this.getPath(__DIRS), this);
                                         }

                                         return __DIRS.slice(1);
                                     }
                });

// ==================== Ende Abschnitt fuer Klasse Path ====================

// ==================== Abschnitt fuer Klasse Directory ====================

// Basisklasse fuer eine Verzeichnisstruktur
// homePath: Absoluter Startpfad als String
// delims: Objekt mit Trennern und Symbolen als Properties (oder Delims-Objekt)
// 'delim': Trennzeichen zwischen zwei Ebenen
// 'back': Name des relativen Vaterverzeichnisses
// 'root': Kennung vor dem ersten Trenner am Anfang eines absoluten Pfads
// 'home': Kennung vor dem ersten Trenner am Anfang eines Pfads relativ zu Home
function Directory(homePath, delims) {
    'use strict';

    Path.call(this, homePath, delims);
}

Class.define(Directory, Path, {
                    'chDir' : function(subDir = undefined) {
                                  if (subDir === undefined) {
                                      this.root();
                                  } else if ((typeof subDir) === 'object') {
                                      for (let sub of subDir) {
                                          this.chDir(sub);
                                      }
                                  } else {
                                      if (subDir === this.delims.home) {
                                          this.home();
                                      } else if (subDir === this.delims.back) {
                                          this.up();
                                      } else {
                                          this.down(subDir);
                                      }
                                  }
                              },
                    'pwd'   : function() {
                                  return this.getPath();
                              }
                });

// ==================== Ende Abschnitt fuer Klasse Directory ====================

// ==================== Abschnitt fuer Klasse ObjRef ====================

// Basisklasse fuer eine Objekt-Referenz
function ObjRef(rootObj) {
    'use strict';

    Directory.call(this, undefined, new Delims('/', "..", '/', '~'));

    this.setConst('rootObj', rootObj);  // Wichtig: Verweis nicht verfolgen! Gefahr durch Zyklen!
}

Class.define(ObjRef, Directory, {
                    'valueOf' : function() {
                                    let ret = this.rootObj;

                                    for (let name of this.dirs) {
                                        if (ret === undefined) {
                                            break;
                                        }
                                        ret = ret[name];
                                    }

                                    return ret;
                                }
                });

// ==================== Ende Abschnitt fuer Klasse ObjRef ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.class.path.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.class.uri.js ***/

// ==UserModule==
// _name         util.class.uri
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Class-Objekt fuer URIs
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.delim.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.path.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.uri.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse URI ====================

// Basisklasse fuer die Verwaltung einer URI/URL
// homePath: Absoluter Startpfad als String
// delims: Objekt mit Trennern und Symbolen als Properties (oder Delims-Objekt)
// 'delim': Trennzeichen zwischen zwei Ebenen
// 'back': Name des relativen Vaterverzeichnisses
// 'root': Kennung vor dem ersten Trenner am Anfang eines absoluten Pfads
// 'home': Kennung vor dem ersten Trenner am Anfang eines Pfads relativ zu Home

/*class*/ function URI /*extends Path {
    constructor*/(homePath, delims) {
        'use strict';

        UNUSED(delims);

        Path.call(this);

        const __HOSTPORT = this.getHostPort(homePath);

        this.scheme = this.getSchemePrefix(homePath);
        this.host = __HOSTPORT.host;
        this.port = this.parseValue(__HOSTPORT.port);
        this.query = this.parseQuery(this.getQueryString(homePath));
        this.node = this.getNodeSuffix(homePath);

        this.homeDirs = this.getDirs(homePath, { 'home' : "" });

        this.home();
    }
//}

Class.define(URI, Path, {
               'setDelims'         : function() {
                                         this.setConst('delims', new UriDelims('/', "..", "", '~', ':', "//", ':', '?', '&', '=', '#'));
                                     },
               'setSchemeDelim'    : function(schemeDelim = undefined) {
                                         this.delims.setScheme(schemeDelim || ':');
                                     },
               'setQueryDelim'     : function(queryDelim = undefined) {
                                         this.delims.setQuery(queryDelim || '?');
                                     },
               'setParSepDelim'    : function(parSepDelim = undefined) {
                                         this.delims.setParSep(parSepDelim || '&');
                                     },
               'setParAssDelim'    : function(parAssDelim = undefined) {
                                         this.delims.setParAss(parAssDelim || '=');
                                     },
               'setNodeDelim'      : function(nodeDelim = undefined) {
                                         this.delims.setNode(nodeDelim || '#');
                                     },
               'getServerPath'     : function(path = undefined) {
                                         return this.stripHostPort(this.stripQueryString(this.stripNodeSuffix(this.stripSchemePrefix(path))));
                                     },
               'getHostPort'       : function(path = undefined) {
                                         const __HOSTDELIM = this.delims.host;
                                         const __PORTDELIM = this.delims.port;
                                         const __ROOTDELIM = this.delims.root + this.delims.delim;
                                         const __NOSCHEME = this.stripSchemePrefix(path);
                                         const __INDEXHOST = (__NOSCHEME ? __NOSCHEME.indexOf(__HOSTDELIM) : -1);
                                         const __PATH = ((~ __INDEXHOST) ? __NOSCHEME.substring(__INDEXHOST + __HOSTDELIM.length) : __NOSCHEME);
                                         const __INDEXHOSTPORT = (__PATH ? __PATH.indexOf(__ROOTDELIM) : -1);
                                         const __HOSTPORT = ((~ __INDEXHOSTPORT) ? __PATH.substring(0, __INDEXHOSTPORT) : undefined);
                                         const __INDEXPORT = (__HOSTPORT ? __HOSTPORT.indexOf(__PORTDELIM) : -1);
                                         const __HOST = ((~ __INDEXPORT) ? __HOSTPORT.substring(0, __INDEXPORT) : __HOSTPORT);
                                         const __PORT = ((~ __INDEXPORT) ? __HOSTPORT.substring(__INDEXPORT + __PORTDELIM.length) : undefined);

                                         return {
                                                    'host' : __HOST,
                                                    'port' : __PORT
                                                };
                                     },
               'stripHostPort'     : function(path = undefined) {
                                         const __HOSTDELIM = this.delims.host;
                                         const __ROOTDELIM = this.delims.root + this.delims.delim;
                                         const __INDEXHOST = (path ? path.indexOf(__HOSTDELIM) : -1);
                                         const __PATH = ((~ __INDEXHOST) ? path.substring(__INDEXHOST + __HOSTDELIM.length) : path);
                                         const __INDEXHOSTPORT = (__PATH ? __PATH.indexOf(__ROOTDELIM) : -1);

                                         return ((~ __INDEXHOSTPORT) ? __PATH.substring(__INDEXHOSTPORT) : __PATH);
                                     },
               'getSchemePrefix'   : function(path = undefined) {
                                         const __SCHEMEDELIM = this.delims.scheme;
                                         const __INDEXSCHEME = (path ? path.indexOf(__SCHEMEDELIM) : -1);

                                         return ((~ __INDEXSCHEME) ? path.substring(0, __INDEXSCHEME) : undefined);
                                     },
               'stripSchemePrefix' : function(path = undefined) {
                                         const __SCHEMEDELIM = this.delims.scheme;
                                         const __INDEXSCHEME = (path ? path.indexOf(__SCHEMEDELIM) : -1);

                                         return ((~ __INDEXSCHEME) ? path.substring(__INDEXSCHEME + __INDEXSCHEME.length) : path);
                                     },
               'getNodeSuffix'     : function(path = undefined) {
                                         const __NODEDELIM = this.delims.node;
                                         const __INDEXNODE = (path ? path.lastIndexOf(__NODEDELIM) : -1);

                                         return ((~ __INDEXNODE) ? path.substring(__INDEXNODE + __NODEDELIM.length) : undefined);
                                     },
               'stripNodeSuffix'   : function(path = undefined) {
                                         const __NODEDELIM = this.delims.node;
                                         const __INDEXNODE = (path ? path.lastIndexOf(__NODEDELIM) : -1);

                                         return ((~ __INDEXNODE) ? path.substring(0, __INDEXNODE) : path);
                                     },
               'getQueryString'    : function(path = undefined) {
                                         const __QUERYDELIM = this.delims.query;
                                         const __PATH = this.stripNodeSuffix(path);
                                         const __INDEXQUERY = (__PATH ? __PATH.indexOf(__QUERYDELIM) : -1);

                                         return ((~ __INDEXQUERY) ? __PATH.substring(__INDEXQUERY + __QUERYDELIM.length) : undefined);
                                     },
               'stripQueryString'  : function(path = undefined) {
                                         const __QUERYDELIM = this.delims.query;
                                         const __INDEXQUERY = (path ? path.indexOf(__QUERYDELIM) : -1);

                                         return ((~ __INDEXQUERY) ? path.substring(0, __INDEXQUERY) : path);
                                     },
               'formatParams'      : function(params = [], formatFun = sameValue, delim = ' ', assign = '=') {
                                         const __PARAMS = [];

                                         for (let param in params) {
                                             __PARAMS.push(param + assign + formatFun(params[param]));
                                         }

                                         return __PARAMS.join(delim);
                                     },
               'parseParams'       : function(params, parseFun, delim = ' ', assign = '=') {
                                         const __RET = { };

                                         if (params) {
                                             const __PARAMS = params.split(delim);

                                             for (let index = 0; index < __PARAMS.length; index++) {
                                                 const __PARAM = __PARAMS[index];

                                                 if (__PARAM) {
                                                     const __INDEX = __PARAM.indexOf(assign);
                                                     const __KEY = ((~ __INDEX) ? __PARAM.substring(0, __INDEX) : __PARAM);
                                                     const __VAL = ((~ __INDEX) ? parseFun(__PARAM.substring(__INDEX + assign.length)) : true);

                                                     __RET[__KEY] = __VAL;
                                                 }
                                             }
                                         }

                                         return __RET;
                                     },
               'rawValue'          : function(value) {
                                         return value;
                                     },
               'parseValue'        : function(value) {
                                         const __VALUE = Number(value);

                                         if (__VALUE == value) {  // schwacher Vergleich true, also Number
                                             return __VALUE;
                                         } else {
                                             const __LOWER = (value ? value.toLowerCase() : undefined);

                                             if ((__LOWER === 'true') || (__LOWER === 'false')) {
                                                 return (value === 'true');
                                             }
                                         }

                                         return value;
                                     },
               'getQuery'          : function(delims = { }) {
                                         const __QRYSEP = ((delims.qrySep !== undefined) ? delims.qrySep : this.delims.qrySep);
                                         const __QRYASS = ((delims.qryAss !== undefined) ? delims.qryAss : this.delims.qryAss);

                                         return this.formatParams(this.query, this.rawValue, __QRYSEP, __QRYASS);
                                     },
               'parseQuery'        : function(path = undefined, delims = { }) {
                                         const __QRYSEP = ((delims.qrySep !== undefined) ? delims.qrySep : this.delims.qrySep);
                                         const __QRYASS = ((delims.qryAss !== undefined) ? delims.qryAss : this.delims.qryAss);

                                         return this.parseParams(path, this.parseValue, __QRYSEP, __QRYASS);
                                     },
               'setQuery'          : function(query) {
                                         this.query = query;
                                     },
               'setQueryPar'       : function(key, value) {
                                         this.query[key] = value;
                                     },
               'getQueryPar'       : function(key) {
                                         return this.query[key];
                                     },
               'getPath'           : function(dirs = undefined, delims = undefined) {
                                         const __DELIMS = new UriDelims(delims);
                                         const __SCHEMEDELIM = ((__DELIMS.scheme !== undefined) ? __DELIMS.scheme : this.delims.scheme);
                                         const __HOSTDELIM = ((__DELIMS.host !== undefined) ? __DELIMS.host : this.delims.host);
                                         const __PORTDELIM = ((__DELIMS.port !== undefined) ? __DELIMS.port : this.delims.port);
                                         const __QUERYDELIM = ((__DELIMS.query !== undefined) ? __DELIMS.query : this.delims.query);
                                         const __NODEDELIM = ((__DELIMS.node !== undefined) ? __DELIMS.node : this.delims.node);
                                         const __SCHEMENAME = this.scheme;
                                         const __SCHEME = (__SCHEMENAME ? __SCHEMENAME + __SCHEMEDELIM : "");
                                         const __HOSTNAME = this.host;
                                         const __HOST = (__HOSTNAME ? __HOSTDELIM + __HOSTNAME : "");
                                         const __PORTNR = this.port;
                                         const __PORT = ((__HOSTNAME && __PORTNR) ? __PORTDELIM + __PORTNR : "");
                                         const __QUERYSTR = this.getQuery();
                                         const __QUERY = (__QUERYSTR ? __QUERYDELIM + __QUERYSTR : "");
                                         const __NODENAME = this.node;
                                         const __NODE = (__NODENAME ? __NODEDELIM + __NODENAME : "");

                                         return __SCHEME + __HOST + __PORT + Path.prototype.getPath.call(this, dirs, delims) + __QUERY + __NODE;
                                     },
               'getDirs'           : function(path = undefined, delims) {
                                         UNUSED(delims);

                                         const __PATH = this.getServerPath(path);

                                         return Path.prototype.getDirs.call(this, __PATH);
                                     }
           });

// ==================== Ende Abschnitt fuer Klasse URI ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.class.uri.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.class.report.js ***/

// ==UserModule==
// _name         util.class.report
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Berichts-Klassen-Objekten fuer Auswertungen
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.report.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse Report ====================

// Basisklasse zum Konfigurieren eines Reports fuer Ereignisse

/*class*/ function Report /*{
    constructor*/(label) {
        'use strict';

        this.label = label;         // Name des Reports in der Ausgabe
        this.success = false;       // Angabe, ob etwas zu berichten ist
        this.entries = [];          // Liste der Eintraege, die in den Report eingehen
        this.entryFormatter = null; // Formatierfunktion fuer ein entry
    }
//}

Class.define(Report, Object, {
        'setFormatter'    : function(formatFun) {
                                checkType(formatFun, 'function', true, 'Report.setFormatter', 'formatFun', 'Function');

                                this.entryFormatter = formatFun;
                            },
        'handleEntry'     : function(entry) {
                                if (this.testEntry(entry)) {
                                    this.success = true;
                                    this.entries.push(entry);
                                }
                                return this.success;
                            },
        'testEntry'       : function(entry) {
                                return getValue(entry, false, true);
                            },
        'formatEntry'     : function(entry) {
                                return (this.entryFormatter ? this.entryFormatter(entry) : valueOf(entry));
                            },
        'formatEntries'   : function() {
                                return this.entries.map(entry => this.formatEntry(entry)).join(", ");
                            },
        'formatLabel'     : function(entryStr) {
                                const __LABEL = this.getLabel();

                                return getValue(entryStr, __LABEL, __LABEL + " (" + entryStr + ')');
                            },
        'getLabel'        : function() {
                                return this.getLabelPrefix() + getValue(this.label, "", this.label) + this.getLabelPostfix();
                            },
        'getLabelPrefix'  : function() {
                                const __ANZ = this.entries.length;

                                return ((__ANZ > 1) ? this.entries.length + "x " : "");
                            },
        'getLabelPostfix' : function() {
                                return "";
                            },
        'getReport'       : function() {
                                return (this.success ? this.formatLabel(this.formatEntries(this.entries)) : "");
                            },
        'toString'        : function() {
                                return this.getReport();
                            }
    });

// ==================== Ende Abschnitt fuer Klasse Report ====================

// ==================== Abschnitt fuer Klasse ReportEval ====================

// Basisklasse zum Konfigurieren eines Reports eines gefilterten Kriteriums fuer Ereignisse

/*class*/ function ReportEval /*extends Report {
    constructor*/(label, evalFun, filterFun, formatValFun) {
        'use strict';

        checkType(evalFun, 'function', false, 'ReportEval', 'evalFun', 'Function');
        checkType(filterFun, 'function', false, 'ReportEval', 'filterFun', 'Function');
        checkType(formatValFun, 'function', false, 'ReportEval', 'formatValFun', 'Function');

        Report.call(this, label);

        this.evalFun = evalFun;  // Funktion zur Ermittlung des Kriteriums
        this.filterFun = filterFun;
        this.formatValFun = formatValFun;
    }
//}

Class.define(ReportEval, Report, {
        'testEntry'       : function(entry) {
                                return this.filterTest(entry, (this.evalFun ? this.evalFun(entry) : true));
                            },
        'getLabelPostfix' : function() {
                                const __FORMATFUN = getValue(this.formatValFun, sameValue);
                                const __VAL = this.getVal();

                                return (__VAL ? (": " + __FORMATFUN(__VAL)) : "");
                            },
        'getVal'          : function() {
                                return 'OK';
                            },
        'filterTest'      : function(entry, test) {
                                const __FILTER = this.filterEvals(entry, test);

                                if (__FILTER) {
                                    return this.evalTest(entry, test);
                                }

                                return __FILTER;
                            },
        'filterEvals'     : function(entry, test) {
                                return (this.filterFun ? this.filterFun(entry, test) : test);
                            },
        'evalTest'        : function(entry, test) {
                                UNUSED(entry);

                                return test;
                            }
    });

// ==================== Ende Abschnitt fuer Klasse ReportEval ====================

// ==================== Abschnitt fuer Klasse ReportExists ====================

// Klasse zum Konfigurieren eines Reports eines gefilterten Kriteriums fuer Ereignisse

/*class*/ function ReportExists /*extends ReportEval {
    constructor*/(label, evalFun, filterFun, formatValFun) {
        'use strict';

        ReportEval.call(this, label, evalFun, filterFun, formatValFun);
    }
//}

Class.define(ReportExists, ReportEval, {
        'getVal'          : function() {
                                return null;
                            },
        'evalTest'        : function(entry, test) {
                                UNUSED(entry);

                                return test;
                            }
    });

// ==================== Ende Abschnitt fuer Klasse ReportExists ====================

// ==================== Abschnitt fuer Klasse ReportSum ====================

// Klasse zum Konfigurieren eines Reports zur gefilterten Summenbildung eines Kriteriums fuer Ereignisse

/*class*/ function ReportSum /*extends ReportEval {
    constructor*/(label, evalFun, filterFun, formatValFun, sumFun) {
        'use strict';

        checkType(sumFun, 'function', false, 'ReportSum', 'sumFun', 'Function');

        ReportEval.call(this, label, evalFun, filterFun, formatValFun);

        this.sumFun = sumFun;
        this.sumVal = undefined;
    }
//}

Class.define(ReportSum, ReportEval, {
        'formatEntries'   : function() {  // Gruppenbefehle wie "Sum" liefern generell eh alle Elemente!
                                return null;
                            },
        'getLabelPrefix'  : function() {
                                return "";
                            },
        'getVal'          : function() {
                                return this.sumVal;
                            },
        'evalTest'        : function(entry, test) {
                                UNUSED(entry);

                                const __SUMVAL = this.sumEvals(test, this.sumVal);

                                this.sumVal = __SUMVAL;

                                return true;
                            },
        'sumEvals'        : function(thisVal, sumVal) {
                                return (this.sumFun ? this.sumFun(thisVal, sumVal) : (getValue(sumVal, 0) + thisVal));
                            }
    });

// ==================== Ende Abschnitt fuer Klasse ReportSum ====================

// ==================== Abschnitt fuer Klasse ReportCount ====================

// Klasse zum Konfigurieren eines Reports zur Zaehlung gefilterter Kriterien fuer Ereignisse

/*class*/ function ReportCount /*extends ReportSum {
    constructor*/(label, evalFun, filterFun, formatValFun) {
        'use strict';

        ReportSum.call(this, label, evalFun, filterFun, formatValFun, ((thisVal, sumVal) => (getValue(sumVal, 0) + getValue(thisVal, 0, 1))));
    }
//}

Class.define(ReportCount, ReportSum);

// ==================== Ende Abschnitt fuer Klasse ReportCount ====================

// ==================== Abschnitt fuer Klasse ReportAverage ====================

// Klasse zum Konfigurieren eines Reports zur Zaehlung gefilterter Kriterien fuer Ereignisse

/*class*/ function ReportAverage /*extends ReportSum {
    constructor*/(label, evalFun, filterFun, formatValFun, sumFun) {
        'use strict';

        ReportSum.call(this, label, evalFun, filterFun, formatValFun, sumFun);
    }
//}

Class.define(ReportAverage, ReportSum, {
        'getVal'          : function() {
                                const __ANZ = this.entries.length;

                                return (this.sumVal / __ANZ).toFixed(2);
                            }
    });

// ==================== Ende Abschnitt fuer Klasse ReportAverage ====================

// ==================== Abschnitt fuer Klasse ReportCompare ====================

// Basisklasse zum Konfigurieren eines Reports eines Kriterium-Vergleichs fuer Ereignisse

/*class*/ function ReportCompare /*extends ReportEval {
    constructor*/(label, evalFun, compareFun, filterFun, formatValFun) {
        'use strict';

        checkType(compareFun, 'function', false, 'ReportCompare', 'compareFun', 'Function');

        ReportEval.call(this, label, evalFun, filterFun, formatValFun);

        this.compareFun = compareFun;
        this.bestVal = undefined;
    }
//}

Class.define(ReportCompare, ReportEval, {
        'getVal'          : function() {
                                return this.bestVal;
                            },
        'evalTest'        : function(entry, test) {
                                UNUSED(entry);

                                const __BESTVAL = getValue(this.bestVal, test);
                                const __COMPARE = this.compareEvals(test, __BESTVAL);
                                let ret = false;

                                if (__COMPARE >= 0) {
                                    ret = true;

                                    this.bestVal = test;

                                    if (__COMPARE > 0) {  // Rekord wurde uebertroffen!
                                        this.entries = [];
                                    }
                                }

                                return ret;
                            },
        'compareEvals'    : function(thisVal, bestVal) {
                                return (this.compareFun ? this.compareFun(thisVal, bestVal) : 0);
                            }
    });

// ==================== Ende Abschnitt fuer Klasse ReportCompare ====================

// ==================== Abschnitt fuer Klasse ReportMax ====================

// Klasse zum Konfigurieren eines Reports eines Maximalwerts fuer Ereignisse

/*class*/ function ReportMax /*extends ReportCompare {
    constructor*/(label, evalFun, filterFun, formatValFun) {
        'use strict';

        ReportCompare.call(this, label, evalFun, ((thisVal, bestVal) => (thisVal - bestVal)), filterFun, formatValFun);
    }
//}

Class.define(ReportMax, ReportCompare);

// ==================== Ende Abschnitt fuer Klasse ReportMax ====================

// ==================== Abschnitt fuer Klasse ReportMin ====================

// Klasse zum Konfigurieren eines Reports eines Minimalwerts fuer Ereignisse

/*class*/ function ReportMin /*extends ReportCompare {
    constructor*/(label, evalFun, filterFun, formatValFun) {
        'use strict';

        ReportCompare.call(this, label, evalFun, ((thisVal, bestVal) => (bestVal - thisVal)), filterFun, formatValFun);
    }
//}

Class.define(ReportMin, ReportCompare);

// ==================== Ende Abschnitt fuer Klasse ReportMin ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.class.report.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.type.js ***/

// ==UserModule==
// _name         util.option.type
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit den Konfigurations-Typen fuer Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt Moegliche Typen fuer Optionen ====================

// Options-Typen
const __OPTTYPES = {
    'MC' : "multiple choice",
    'SW' : "switch",
    'TF' : "true/false",
    'SD' : "simple data",
    'SI' : "simple option"
};

// Aktions-Typen der Optionen
const __OPTACTION = {
    'SET' : "set option value",
    'NXT' : "set next option value",
    'RST' : "reset options"
};

// Schwere der Notwendigkeit bei den Item-Typen der Konfiguration der Optionen (__OPTCONFIG)
const __OPTNEEDSEVERITY = {
    'MAN'   : 'mandatory',      // Muss-Parameter
    'REC'   : 'recommended',    // Soll-Parameter
    'OPT'   : 'optional',       // Kann-Parameter (optional)
    'INT'   : 'internal'        // Belegt-Parameter (nicht in __OPTCONFIG verwenden!)
};

// Klassifizierung von Untergruppen der Notwendigkeit-Klassen zu Item-Typen der Konfiguration der Optionen (__OPTCONFIG)
const __OPTNEEDCONDITION = {
    'ALL'   : [ "parameter",            (optType => true) ],                                                            // Alle Parameter
    'DAT'   : [ "data parameter",       (optType => ((optType === __OPTTYPES.MC) || (optType === __OPTTYPES.SD))) ],    // Datentypen __OPTTYPES.MC und __OPTTYPES.SD
    'SEL'   : [ "select parameter",     (optType => (optType === __OPTTYPES.MC)) ],                                     // Datentyp __OPTTYPES.MC
    'SWI'   : [ "switch parameter",     (optType => ((optType === __OPTTYPES.SW) || (optType === __OPTTYPES.TF))) ],    // Datentypen __OPTTYPES.SW und __OPTTYPES.TF
    'SIM'   : [ "simple parameter",     (optType => (optType === __OPTTYPES.SI)) ],                                     // Datentyp __OPTTYPES.SI
    'COM'   : [ "complex parameter",    (optType => (optType !== __OPTTYPES.SI)) ],                                     // alle Datentypen ausser __OPTTYPES.SI
};

// Notwendigkeit der Item-Typen der Konfiguration der Optionen (__OPTCONFIG)
const __OPTNEED = {
    'MAN'   : "mandatory parameter",            // Muss-Parameter, darf nicht fehlen!
    'DAT'   : "mandatory data parameter",       // Muss-Parameter fuer Datentypen __OPTTYPES.MC und __OPTTYPES.SD
    'CHO'   : "mandatory select parameter",     // Muss-Parameter fuer Datentyp __OPTTYPES.MC
    'SWI'   : "mandatory switch parameter",     // Muss-Parameter fuer Datentypen __OPTTYPES.SW und __OPTTYPES.TF
    'REC'   : "recommended parameter",          // Soll-Parameter: Nutzung dieser Parameter wird empfohlen
    'COM'   : "recommended complex parameter",  // Soll-Parameter fuer alle Datentypen ausser __OPTTYPES.SI
    'VAL'   : "recommended data parameter",     // Soll-Parameter fuer Datentypen __OPTTYPES.MC und __OPTTYPES.SD
    'SEL'   : "recommended select parameter",   // Soll-Parameter fuer Datentyp __OPTTYPES.MC
    'TOG'   : "recommended switch parameter",   // Soll-Parameter fuer Datentypen __OPTTYPES.SW und __OPTTYPES.TF
    'OPT'   : "optional parameter",             // Optionale Parameter ohne Pficht
    'INT'   : "internal parameter"              // Nicht in __OPTCONFIG verwenden!
};

// Konfiguration der Ueberpruefung der Notwendigkeit der Item-Typen der Konfiguration der Optionen (__OPTCONFIG)
const __OPTNEEDCONFIG = { };

__OPTNEEDCONFIG[__OPTNEED.MAN] = [ __OPTNEEDSEVERITY.MAN, __OPTNEEDCONDITION.ALL ]; // Muss-Parameter, darf nicht fehlen!
__OPTNEEDCONFIG[__OPTNEED.DAT] = [ __OPTNEEDSEVERITY.MAN, __OPTNEEDCONDITION.DAT ]; // Muss-Parameter fuer Datentypen __OPTTYPES.MC und __OPTTYPES.SD
__OPTNEEDCONFIG[__OPTNEED.CHO] = [ __OPTNEEDSEVERITY.MAN, __OPTNEEDCONDITION.SEL ]; // Muss-Parameter fuer Datentyp __OPTTYPES.MC
__OPTNEEDCONFIG[__OPTNEED.SWI] = [ __OPTNEEDSEVERITY.MAN, __OPTNEEDCONDITION.SWI ]; // Muss-Parameter fuer Datentypen __OPTTYPES.SW und __OPTTYPES.TF
__OPTNEEDCONFIG[__OPTNEED.REC] = [ __OPTNEEDSEVERITY.REC, __OPTNEEDCONDITION.ALL ]; // Soll-Parameter: Nutzung dieser Parameter wird empfohlen
__OPTNEEDCONFIG[__OPTNEED.COM] = [ __OPTNEEDSEVERITY.REC, __OPTNEEDCONDITION.COM ]; // Soll-Parameter fuer alle Datentypen ausser __OPTTYPES.SI
__OPTNEEDCONFIG[__OPTNEED.VAL] = [ __OPTNEEDSEVERITY.REC, __OPTNEEDCONDITION.DAT ]; // Soll-Parameter fuer Datentypen __OPTTYPES.MC und __OPTTYPES.SD
__OPTNEEDCONFIG[__OPTNEED.SEL] = [ __OPTNEEDSEVERITY.REC, __OPTNEEDCONDITION.SEL ]; // Soll-Parameter fuer Datentyp __OPTTYPES.MC
__OPTNEEDCONFIG[__OPTNEED.TOG] = [ __OPTNEEDSEVERITY.REC, __OPTNEEDCONDITION.SWI ]; // Soll-Parameter fuer Datentypen __OPTTYPES.SW und __OPTTYPES.TF
__OPTNEEDCONFIG[__OPTNEED.OPT] = [ __OPTNEEDSEVERITY.OPT, __OPTNEEDCONDITION.ALL ]; // Optionale Parameter ohne Pficht
__OPTNEEDCONFIG[__OPTNEED.INT] = [ __OPTNEEDSEVERITY.INT, __OPTNEEDCONDITION.ALL ]; // Nicht in __OPTCONFIG verwenden!

// Abgeleitete Typen gemappt auf Haupttypen...
const __OPTITEMTYPEMAPPING = {
    'Array'     : 'Object', // Array.isArray()
    'Char'      : 'String', // String.length === 1
    'Code'      : 'String', // TODO Code-Schutz
    'Integer'   : 'Number', // Number.isInteger()
};

// Spaltenindizes von __OPTITEMS, den Daten ueber die Item-Typen der Konfiguration der Optionen (__OPTCONFIG)
const __COLOPTITEMS = {
        'INFO'      : 0,
        'TYPE'      : 1,
        'EXAM'      : 2,
        'NEED'      : 3
    };

// Item-Typen der Konfiguration der Optionen (__OPTCONFIG)
const __OPTITEMS = {
    'Action'    : [ "Aktions-Typ bei Optionswechsel",   '__OPTACTION',  "NXT, RST, SET",            __OPTNEED.MAN ],
    'AltAction' : [ "Alt Aktions-Typ (abweichend)",     '__OPTACTION',  "NXT, RST, SET",            __OPTNEED.TOG ],
    'AltHotkey' : [ "Alt Schnellanwahl im Men\u00FC",   'Char',         "'A'",                      __OPTNEED.SWI ],
    'AltLabel'  : [ "Alt Options-Ausgabename",          'String',       "Option aus: $",            __OPTNEED.TOG ],
    'AltTitle'  : [ "Alt Titel",                        'String',       "$V schlie\u00DFen",        __OPTNEED.TOG ],
    'AutoReset' : [ "Beim Laden immer auf Default",     'Boolean',      "false, true",              __OPTNEED.OPT ],
    'Choice'    : [ "Auswahlliste der Optionswerte",    'Array',        "[ 0, 1, 2, 3, 4 ]",        __OPTNEED.REC ],
    'Cols'      : [ "Ausgabebreite in Textfenster",     'Integer',      "1, 3, 20, 25, 36",         __OPTNEED.OPT ],
    'Config'    : [ "INTERNAL: Verweis auf optConfig",  'Object',       "{ }",                      __OPTNEED.INT ],
    'Default'   : [ "Startwert der Option",             'any',          "1, true, '', [], { }",     __OPTNEED.COM ],
    'FormLabel' : [ "Options-Ausgabe auf Seite",        'String',       "Option:|$",                __OPTNEED.OPT ],
    'FormPrio'  : [ "Steuert die Reihenfolge",          'Integer',      "undefined, 1",             __OPTNEED.OPT ],
    'FormType'  : [ "Typ der Option auf Seite",         '__OPTTYPES',   "SI",                       __OPTNEED.OPT ],
    'FreeValue' : [ "Freitext m\u00F6glich",            'Boolean',      "false, true",              __OPTNEED.SEL ],
    'Hidden'    : [ "Versteckte Option auf Seite",      'Boolean',      "false, true",              __OPTNEED.OPT ],
    'HiddenMenu': [ "Kein Kontextmen\u00FC",            'Boolean',      "false, true",              __OPTNEED.OPT ],
    'Hotkey'    : [ "Schnellanwahl im Men\u00FC",       'Char',         "'A'",                      __OPTNEED.REC ],
    'Item'      : [ "INTERNAL: Kopie des Schluessels",  'String',       "",                         __OPTNEED.INT ],
    'Label'     : [ "Options-Ausgabename",              'String',       "Option: $",                __OPTNEED.MAN ],
    'Loaded'    : [ "INTERNAL: Value ist geladen",      'Boolean',      "false, true",              __OPTNEED.INT ],
    'MinChoice' : [ "Abfrage ab wieviel Elementen?",    'Integer',      "0, 3",                     __OPTNEED.OPT ],
    'Name'      : [ "Interner Speichername",            'String',       "",                         __OPTNEED.MAN ],
    'Permanent' : [ "Bei AutoReset nicht zuruecksetzen",'Boolean',      "false, true",              __OPTNEED.OPT ],
    'PreInit'   : [ "Initialisierung in erster Phase",  'Boolean',      "true",                     __OPTNEED.OPT ],
    'Promise'   : [ "INTERNAL: Promise fuers Laden",    'Promise',      "",                         __OPTNEED.INT ],
    'ReadOnly'  : [ "Daten unveraenderlich",            'Boolean',      "false, true",              __OPTNEED.OPT ],
    'Replace'   : [ "Ausgabe-Element-Formatierung",     'Function',     "null, replaceArrayFun(padStartFun(4))",
                                                                                                    __OPTNEED.OPT ],
    'Rows'      : [ "Ausgabe-Zeilen in Textfenster",    'Integer',      "1, 2, 3, 6, 7, 10, 20",    __OPTNEED.OPT ],
    'SetValue'  : [ "Zu setzender DefaultWert bei Wahl",'any',          "",                         __OPTNEED.OPT ],
    'SelValue'  : [ "Ist Wert aus fester Liste?",       'Boolean',      "false, true",              __OPTNEED.SEL ],
    'Serial'    : [ "Speicherung per serialize()",      'Boolean',      "true",                     __OPTNEED.VAL ],
    'Shared'    : [ "Objektreferenz auf Option",        'Object',       "{ 'namespace' : 'http://os.ongapo.com/', 'module' : 'OS2.haupt', 'item' : '$' }",
                                                                                                    __OPTNEED.OPT ],
    'SharedData': [ "INTERNAL: Daten Objektreferenz",   'Object',       "",                         __OPTNEED.INT ],
    'Space'     : [ "Ausgabe-Spaces bei Listen",        'Integer',      "0, 1, 4",                  __OPTNEED.OPT ],
    'Submit'    : [ "onKeyDown-Code",                   'Code',         "",                         __OPTNEED.OPT ],
    'Title'     : [ "Titel",                            'String',       "$V Optionen",              __OPTNEED.OPT ],
    'Type'      : [ "Typ der Option",                   '__OPTTYPES',   "MC, SD, SI, SW",           __OPTNEED.REC ],
    'ValidOpt'  : [ "INTERNAL: Option gecheckt",        'Boolean',      "true",                     __OPTNEED.INT ],
    'ValType'   : [ "Datentyp der Werte",               'String',       "'Number', 'String'",       __OPTNEED.CHO ],
    'Value'     : [ "INTERNAL: Gesetzter Wert",         'any',          "",                         __OPTNEED.INT ],
    'config'    : [ "INTERNAL: __OPTCONFIG",            'Object',       "__OPTCONFIG",              __OPTNEED.INT ],
    'setLabel'  : [ "INTERNAL: Name/Label der Optionen",'String',       "__OPTSET",                 __OPTNEED.INT ]
};
const __OPTITEMSBYNEED = selectMapping(__OPTITEMS, __COLOPTITEMS.NEED, -1, mappingPush);

// ==================== Ende Abschnitt Moegliche Typen fuer Optionen ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.type.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.data.js ***/

// ==UserModule==
// _name         util.option.data
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Zugriff auf die Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.sys.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Initialisierung einer Option ====================

// Initialisiert die gesetzten Option
// config: Konfiguration der Option
// setValue: Zu uebernehmender Default-Wert (z.B. der jetzt gesetzte)
// return Initialwert der gesetzten Option
function initOptValue(config, setValue = undefined) {
    let value = getValue(setValue, config.Default);  // Standard

    if (config.SharedData !== undefined) {
        value = config.SharedData;
    }

    switch (config.Type) {
    case __OPTTYPES.MC : if ((value === undefined) && (config.Choice !== undefined)) {
                             value = config.Choice[0];
                         }
                         break;
    case __OPTTYPES.SW : break;
    case __OPTTYPES.TF : break;
    case __OPTTYPES.SD : config.Serial = true;
                         break;
    case __OPTTYPES.SI : break;
    default :            break;
    }

    if (config.Serial || config.Hidden) {
        config.HiddenMenu = true;
    }

    return value;
}

// ==================== Ende Abschnitt fuer Initialisierung einer Option ====================

// ==================== Abschnitt fuer Shared Optionsdaten ====================

// Gibt fuer einen 'Shared'-Eintrag eine ObjRef zurueck
// shared: Object mit den Angaben 'namespace', 'module' und ggfs. 'item'
// item: Key der Option
// return ObjRef, die das Ziel definiert
function getSharedRef(shared, item = undefined) {
    if (shared === undefined) {
        return undefined;
    }

    const __OBJREF = new ObjRef(__DBDATA);  // Gemeinsame Daten
    const __PROPS = [ 'namespace', 'module', 'item' ];
    const __DEFAULTS = [ __DBMOD.namespace, __DBMOD.name, item ];

    for (let stage = 0; stage < __PROPS.length; stage++) {
        const __DEFAULT = __DEFAULTS[stage];
        const __PROP = __PROPS[stage];
        const __NAME = shared[__PROP];

        if (__NAME === '$') {
            break;
        }

        __OBJREF.chDir(getValue(__NAME, __DEFAULT));
    }

    return __OBJREF;
}

// ==================== Ende Abschnitt fuer Shared Optionsdaten ====================

// ==================== Abschnitt fuer Zugriff auf Options-Parameter ====================

// Temporaere Aussetzung der Exceptions...
const __ERRORLOG = __LOG[1];
const __ERRORFUN = (__ERRORLOG || Error);
const __RANGEERRORFUN = (__ERRORLOG || RangeError);

// Prueft ein Objekt, ob es eine syntaktisch valide Konfiguration einer (ueber Menu) gesetzten Option ist
// optItem: Zu validierendes Konfigurations-Item-Objekt
// key: Falls bekannt, der Item-Key dieser Option (wird auf Korrektheit ueberprueft)
// preInit: Falls true, dann geht es um die Grundinitialisierung, in der keine internen Optionen erlaubt sind!
// return [__CONFIG, __NAME, __KEY, ...] Konfiguration und ggfs. Name und/oder Key der Option
function checkOptItem(optItem, key = undefined, preInit = false) {
    const __CONFIG = optItem;
    const __OPTTYPE = __CONFIG.Type;
    const __ITEMS = Object.keys(__CONFIG);
    const __NAME = __CONFIG.Name;
    const __ISSHARED = getValue(__CONFIG.Shared, false, true);
    const __KEY = key;

    if (! __ISSHARED) {  // TODO Shared Ref
        // Pruefung auf Namen der Option (redundant, da spaeter noch Ueberpruefung von __OPTNEED.MAN)...
        if (__NAME === undefined) {
            __LOG[1]("checkOptItem(): Error in " + codeLine(true, true, true, false));
            __ERRORFUN("Unknown 'Name' for option " + __LOG.info(__KEY, false));
        }

        // Ueberpruefung der Notwendigkeit der Parameter...
        const __ALLNEEDS = Object.keys(__OPTNEED);

        __ALLNEEDS.forEach(needKey => {  // alle moeglichen Notwendigkeitstypen...
                const __NEED = __OPTNEED[needKey];
                const __NEEDCONFIG = __OPTNEEDCONFIG[__NEED];
                const [ __SEVERITY, [ __CONDPARAM , __CONDFUN ]] = getValue(__NEEDCONFIG, [ null, [ null, null ] ]);
                const __NEEDED = __CONDFUN(__OPTTYPE);

                if (__NEEDED) {  // die Parameter dieser Klasse sind notwendig fuer die Option mit diesem __OPTTYPE...
                    const __PARAMETER = __SEVERITY + ' ' + __CONDPARAM; // alternativ (aber weniger eingaengig): __NEED
                    const __MISSING = "Option " + __LOG.info(__KEY, false) + " is missing " + __PARAMETER + ' ';
                    const __OPTPARAMS = getValue(__OPTITEMSBYNEED[__NEED], []);

                    __OPTPARAMS.forEach(item => {  // alle notwendigen Parameter dieser Klasse...
                            const __ITEM = __CONFIG[item];

                            if (! __ITEM) {  // Parameter ist notwendig, fehlt allerdings!
                                const __ERRORMSG = __MISSING + __LOG.info(item, false) + "...";

                                switch (__SEVERITY) {
                                    case __OPTNEEDSEVERITY.MAN: // Muss-Parameter...
                                        __LOG[1]("checkOptItem(): Error in " + codeLine(true, true, true, false));
                                        __ERRORFUN(__ERRORMSG);
                                        break;
                                    case __OPTNEEDSEVERITY.REC: // Soll-Parameter...
                                        __LOG[2]("checkOptItem(): " + __ERRORMSG);
                                        break;
                                    case __OPTNEEDSEVERITY.OPT: // Kann-Parameter...
                                        __LOG[7]("checkOptItem(): (opt) " + __ERRORMSG);
                                        break;
                                    case __OPTNEEDSEVERITY.INT: // Kann-Parameter...
                                        __LOG[9]("checkOptItem(): (int) " + __ERRORMSG);
                                        break;
                                    default:
                                        __ERRORFUN("checkOptItem(): Internal error: Unknown severity " + __LOG.info(__SEVERITY, false));
                                        break;
                                }
                            }
                        });
                }
            });
    }

    // Ueberpruefung der angegebenen Parameter auf Bekanntheit und Typen...
    __ITEMS.forEach(item => {
            const __ITEMVALUE = __CONFIG[item];
            const __ITEMINFO = __OPTITEMS[item];
            const [ __ITEMTEXT, __ITEMTYPE, __ITEMEXAMPLES, __ITEMNEED] =
                    (__ITEMINFO || [ "Error", undefined, "", __OPTNEED.OPT ]);
            const __KEYITEM = __KEY + '[' + item + ']';
            const __TYPE = (__OPTITEMTYPEMAPPING[__ITEMTYPE] || __ITEMTYPE);
            let isValid = true;

            if (! __ITEMINFO) {
                __LOG[1]("checkOptItem(): Error in " + codeLine(true, true, true, false));
                __ERRORFUN("Unknown parameter " + __LOG.info(item, false) + " for option " + __LOG.info(__KEY, false));
            }

            if (preInit && (__ITEMNEED === __OPTNEED.INT)) {
                __LOG[1]("checkOptItem(): Error in " + codeLine(true, true, true, false));
                throw TypeError("Internal parameter " + __LOG.info(item, false) + " must not be used for option " + __LOG.info(__KEY, false));
            }

            switch (__TYPE) {
                case 'Boolean'    :
                case 'Function'   :
                case 'Number'     :
                case 'Object'     :
                case 'Promise'    :
                case 'String'     :
                                    checkType(__ITEMVALUE, __TYPE.toLowerCase(), false, "checkOptItem()", __KEYITEM, __TYPE);
                                    break;
                case '__OPTACTION':
                                    checkEnumObj(__ITEMVALUE, __OPTACTION, true, "checkOptItem()", __KEYITEM, __TYPE);
                                    break;
                case '__OPTTYPES' :
                                    checkEnumObj(__ITEMVALUE, __OPTTYPES, true, "checkOptItem()", __KEYITEM, __TYPE);
                                    break;
                case 'any'        : break;  // OK
                default           : __LOG[1]("checkOptItem(): Internal error in " + codeLine(true, true, true, false));
                                    throw TypeError("Unknown parameter type " + __LOG.info(__ITEMTYPE, false) + " needed for option " + __LOG.info(__KEY, false));
            }

            if (__ITEMVALUE) {
                switch (__ITEMTYPE) {
                    case 'Array'      : isValid = Array.isArray(__ITEMVALUE);
                                        break;
                    case 'Char'       : isValid = (__ITEMVALUE.length === 1);
                                        break;
                    case 'Code'       : isValid = false;  // TODO Code-Schutz verfeinern (bisher: gesperrt)
                                        break;
                    case 'Integer'    : isValid = Number.isInteger(__ITEMVALUE);
                                        break;
                    default           : isValid = true;
                                        break;
                }
            }
            if (! isValid) {
                __LOG[1]("checkOptItem(): Error in " + codeLine(true, true, true, false));
                throw TypeError("Parameter " + __LOG.info(item, false) + " for option " + __LOG.info(__KEY, false) + " is not of type " + __ITEMTYPE);
            }
        });

    return [ __CONFIG, __NAME, __KEY ];
}

// Prueft ein Objekt, ob es eine syntaktisch valide (ueber Menu) gesetzte Option ist
// opt: Zu validierendes Options-Objekt
// key: Falls bekannt, der Item-Key dieser Option (wird auf Korrektheit ueberprueft)
// return [__CONFIG, __NAME, __KEY, ...] Konfiguration und ggfs. Name und/oder Key der Option
function checkOpt(opt, key = undefined) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __KEY = getOptKey(opt, false);  // NOTE Unbedingt strict auf false setzen, sonst zirkulaer!

    if (__NAME === undefined) {  // NOTE opt === undefined liefert __NAME === undefined
        __LOG[1]("checkOpt(): Error in " + codeLine(true, true, true, false));
        throw Error("Unknown option " + __LOG.info(key, false));
    }

    if (((typeof key) !== 'undefined') && (key !== __KEY)) {
        __LOG[1]("checkOpt(): Error in " + codeLine(true, true, true, false));
        throw RangeError("Invalid option key (expected " + __LOG.info(key, false) + ", but got " + __LOG.info(__KEY, false) + ')');
    }

    if (! opt.ValidOpt) {
        if (((typeof __NAME) !== 'undefined') && __NAME.length && ((typeof __CONFIG) === 'object')) {
            opt.ValidOpt = true;
        } else {
            opt.ValidOpt = false;
            __LOG[1]("checkOpt(): Error in " + codeLine(true, true, true, false));
            throw TypeError("Invalid option (" + __LOG.info(__NAME, false) + "): " + __LOG.info(opt, true));
        }
    }

    return [ __CONFIG, __NAME, __KEY ];
}

// Prueft alle Objekt in einem optSet, ob sie syntaktisch valide (ueber Menu) gesetzte Optionen sind
// optSet: Zu validierende Options-Objekte
// return Das uebergeben optSet (falls alle Optionen valide sind)
function checkOptSet(optSet) {
    Object.entries(optSet).forEach(([key, opt]) => checkOpt(opt, key));

    return optSet;
}

// Prueft alle Objekt in einer optConfig, ob sie syntaktisch valide Konfigurationen der (ueber Menu) gesetzte Optionen sind
// optConfig: Zu validierende Konfigurations-Objekte fuer Optionen
// preInit: Falls true, dann geht es um die Grundinitialisierung, in der keine internen Optionen erlaubt sind!
// return Das uebergeben optConfig (falls alle Optionen valide sind)
function checkOptConfig(optConfig, preInit = false) {
    const __OPTCONFIG = optConfig;
    const __ENTRIES = Object.entries(__OPTCONFIG);
    const __NAMEUSE = { };

    // Jede einzelne Option ueberpruefen...
    __ENTRIES.forEach(([key, config]) => checkOptItem(config, key, preInit));

    // Benutzte (interne Speicher-) Namen auf doppelte Eintraege ueberpruefen...
    __ENTRIES.forEach(([key, config]) => {
            const __CONFIG = config;
            const __ISSHARED = getValue(__CONFIG.Shared, false, true);

            if (! __ISSHARED) {
                const __KEY = key;
                const __NAME = config.Name;  // Muss vorhanden sein, da vorher ueberprueft!
                const __USED = __NAMEUSE[__NAME];

                if (__USED) {
                    __LOG[1]("checkOpt(): Error in " + codeLine(true, true, true, false));
                    throw RangeError("Internal name " + __LOG.info(__NAME, false) + " of option " +
                            __LOG.info(__KEY, false) + " was already used in option " + __LOG.info(__USED, false));
                } else {
                    __NAMEUSE[__NAME] = __KEY;
                }
            }
        });

    __LOG[2](Object.keys(__OPTCONFIG).length + " Optionen erfolgreich \u00FCberpr\u00FCft...");

    return __OPTCONFIG;
}

// Ueberprueft, ob eine bestimmte Option konfiguriert ist
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// return true: Option existiert, false: nicht vorhanden
function hasOpt(optSet, item) {
    if ((optSet !== undefined) && (item !== undefined)) {
        const __STRICT = true;  // TODO
        const __OPTITEM = optSet[item];
        const __EXISTS = ((__OPTITEM !== undefined) && (__OPTITEM !== null));
        const __OPT = (__EXISTS ? getOpt(__OPTITEM) : null);

        if (__OPT && __STRICT) {
            checkOpt(__OPT, item);
        }

        return __EXISTS;
    }

    return false;
}

// Gibt eine Option sicher zurueck
// opt: Config und Value der Option, ggfs. undefined
// defOpt: Rueckgabewert, falls undefined
// return Daten zur Option (oder defOpt)
function getOpt(opt, defOpt = { }) {
    return getValue(opt, defOpt);
}

// Gibt eine Option sicher zurueck (Version mit Key)
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// defOpt: Rueckgabewert, falls nicht zu finden
// return Daten zur Option (oder defOpt)
function getOptByName(optSet, item, defOpt = { }) {
    const __STRICT = true;  // TODO
    let opt = defOpt;

    if ((optSet !== undefined) && (item !== undefined)) {
        opt = getOpt(optSet[item], defOpt);
    }

    if (__STRICT) {
        checkOpt(opt, item);
    }

    return opt;
}

// Gibt die Konfigurationsdaten einer Option zurueck
// opt: Config und Value der Option
// defConfig: Rueckgabewert, falls Config nicht zu finden
// return Konfigurationsdaten der Option
function getOptConfig(opt, defConfig = { }) {
    return getValue(getOpt(opt).Config, defConfig);
}

// Gibt den Item-Key einer Option zurueck
// opt: Config und Value der Option
// strict: Ueberpruefen des Objektes?
// return Item-Key der Option innerhalb von optSet
function getOptKey(opt, strict = ! false) {
    if (strict) {
        checkOpt(opt)
    }

    return getValue(getOpt(opt).Item);
}

// Setzt den Namen einer Option
// opt: Config und Value der Option
// name: Zu setzender Name der Option
// reload: Seite mit neuem Wert neu laden
// return Gesetzter Name der Option
function setOptName(opt, name) {
    const [ __CONFIG, __NAME ] = checkOpt(opt);

    if (__NAME !== name) {
        __LOG[5]("RENAME " + __LOG.changed(__NAME, name, false, false));

        __CONFIG.Name = name;
    }

    return name;
}

// Gibt den Namen einer Option zurueck
// opt: Config und Value der Option
// return Name der Option
function getOptName(opt) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = __CONFIG.Name;

    if (! __NAME) {
        const __SHARED = __CONFIG.Shared;
        const __OBJREF = getSharedRef(__SHARED, opt.Item);

        //if (__SHARED && ! opt.Loaded) {  // TODO klaeren!

        if (__OBJREF) {
            return __OBJREF.getPath();
        }

        showAlert("Error", "Option ohne Namen", "(Item " + __LOG.info(opt.Item, false) + ") " + safeStringify(__SHARED), false);
    }

    return __NAME;
}

// Setzt den Wert einer Option
// opt: Config und Value der Option
// value: Zu setzender Wert der Option
// initialLoad (nur fuer loadOption!): Grundinitialisierung (auch Read-Only)
// return Gesetzter Wert
function setOptValue(opt, value, initialLoad = false) {
    if (opt !== undefined) {
        const [ , __NAME, __KEY ] = checkOpt(opt);

        if (initialLoad || ! opt.ReadOnly) {
            __LOG[8](__NAME + ": " + __LOG.changed(opt.Value, value, true, false));

            opt.Value = value;
        } else {
            throw TypeError("Can't modify read-only option " + __LOG.info(__KEY, false) + " (" + __NAME + ')');
        }

        return opt.Value;
    } else {
        return undefined;
    }
}

// Gibt den Wert einer Option zurueck, falls vorhanden
// opt: Config und Value der Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist (nur, falls geladen und nicht gesetzt!)
// return Gesetzter Wert (falls geladen)
function getOptValue(opt, defValue = undefined) {
    const __STRICT = true;
    let value;

    if (__STRICT) {
        checkOpt(opt);
    }

    if (opt /*&& opt.Loaded*/) {  // NOTE opt.Loaded steuert das Laden, aber opt.Value den Wert
        value = getValue(opt.Value, defValue);
    }

    return valueOf(value);
}

// Gibt den Wert einer Option zurueck, falls vorhanden
// opt: Config und Value der Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist (nur, falls geladen und nicht gesetzt!)
// return Gesetzter Wert (falls geladen)
function getOptValueByName(optSet, item, defValue = undefined) {
    // NOTE checkOpt(__OPT) wird in getOptByName() geprueft...
    const __OPT = getOptByName(optSet, item);

    return valueOf(getValue(__OPT.Value, defValue));
}

// ==================== Ende Abschnitt fuer Zugriff auf Options-Parameter ====================

// ==================== Abschnitt fuer Zugriff auf die Optionen ====================

// Setzt eine Option auf einen vorgegebenen Wert
// Fuer kontrollierte Auswahl des Values siehe setNextOpt()
// opt: Config und vorheriger Value der Option
// value: (Bei allen Typen) Zu setzender Wert
// reload: Seite mit neuem Wert neu laden
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function setOpt(opt, value, reload = false, onFulfilled = undefined, onRejected = undefined) {
    const [ __CONFIG, __NAME ] = checkOpt(opt);

    return setOptValue(opt, setStored(__NAME, value, reload, __CONFIG.Serial, onFulfilled, onRejected));
}

// Ermittelt die naechste moegliche Option
// opt: Config und Value der Option
// defValue: Ggfs. zu setzender Wert fuer den Fall, dass nichts gesetzt ist
// return Zu setzender Wert
function getNextOpt(opt, defValue = undefined) {
    const [ __CONFIG ] = checkOpt(opt);
    const __VALUE = getOptValue(opt, defValue);

    switch (__CONFIG.Type) {
    case __OPTTYPES.MC : return getValue(value, getNextValue(__CONFIG.Choice, __VALUE));
    case __OPTTYPES.SW : return getValue(value, ! __VALUE);
    case __OPTTYPES.TF : return getValue(value, ! __VALUE);
    case __OPTTYPES.SD : return getValue(value, __VALUE);
    case __OPTTYPES.SI : break;
    default :            break;
    }

    return __VALUE;
}

// Setzt die naechste moegliche Option
// opt: Config und Value der Option
// defValue: Default fuer ggfs. zu setzenden Wert
// reload: Seite mit neuem Wert neu laden
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function setNextOpt(opt, defValue = undefined, reload = false, onFulfilled = undefined, onRejected = undefined) {
    // NOTE checkOpt(opt) wird in setOpt() und getNextOpt() geprueft...
    return setOpt(opt, getNextOpt(opt, defValue), reload, onFulfilled, onRejected);
}

// Setzt die naechste moegliche Option oder fragt ab einer gewissen Anzahl interaktiv ab
// opt: Config und Value der Option
// defValue: Default fuer ggfs. zu setzenden Wert
// reload: Seite mit neuem Wert neu laden
// freeValue: Angabe, ob Freitext zugelassen ist (Default: false)
// minChoice: Ab wievielen Auswahlmoeglichkeiten soll abgefragt werden? (Default: 3)
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function promptNextOpt(opt, defValue = undefined, reload = false, freeValue = false, selValue = true, minChoice = 3, onFulfilled = undefined, onRejected = undefined) {
    const [ __CONFIG ] = checkOpt(opt);
    const __CHOICE = __CONFIG.Choice;

    if (defValue || (! __CHOICE) || (__CHOICE.length < minChoice)) {
        return setNextOpt(opt, defValue, reload, onFulfilled, onRejected);
    }

    const __VALUE = getOptValue(opt);

    try {
        const __NEXTVAL = getNextValue(__CHOICE, __VALUE);
        let message = "";

        if (selValue) {
            for (let index = 0; index < __CHOICE.length; index++) {
                message += (index + 1) + ") " + __CHOICE[index] + '\n';
            }
            message += "\nNummer oder Wert eingeben:";
        } else {
            message = __CHOICE.join(" / ") + "\n\nWert eingeben:";
        }

        const __ANSWER = prompt(message, __NEXTVAL);

        if (__ANSWER) {
            const __INDEX = parseInt(__ANSWER, 10) - 1;
            let nextVal = (selValue ? __CHOICE[__INDEX] : undefined);

            if (nextVal === undefined) {
                const __VALTYPE = getValue(__CONFIG.ValType, 'String');
                const __CASTVAL = this[__VALTYPE](__ANSWER);

                if (freeValue || (~ __CHOICE.indexOf(__CASTVAL))) {
                    nextVal = __CASTVAL;
                }
            }

            if (nextVal !== __VALUE) {
                if (nextVal !== undefined) {
                    return setOpt(opt, nextVal, reload, onFulfilled, onRejected);
                }

                const __LABEL = substParam(__CONFIG.Label, __VALUE);

                showAlert(__LABEL, "Ung\u00FCltige Eingabe: " + __ANSWER);
            }
        }

        onFulfilled(__VALUE);
    } catch (ex) {
        onRejected(ex);

        showException('[' + (ex && ex.lineNumber) + "] promptNextOpt()", ex);
    }

    return __VALUE;
}

// Setzt eine Option auf einen vorgegebenen Wert (Version mit Key)
// Fuer kontrollierte Auswahl des Values siehe setNextOptByName()
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// value: (Bei allen Typen) Zu setzender Wert
// reload: Seite mit neuem Wert neu laden
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function setOptByName(optSet, item, value, reload = false, onFulfilled = undefined, onRejected = undefined) {
    // NOTE checkOpt(__OPT) wird in getOptByName() und setOpt() geprueft...
    const __OPT = getOptByName(optSet, item);

    return setOpt(__OPT, value, reload, onFulfilled, onRejected);
}

// Ermittelt die naechste moegliche Option (Version mit Key)
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// defValue: Default fuer ggfs. zu setzenden Wert
// return Zu setzender Wert
function getNextOptByName(optSet, item, defValue = undefined) {
    // NOTE checkOpt(__OPT) wird in getOptByName() und getNextOpt() geprueft...
    const __OPT = getOptByName(optSet, item);

    return getNextOpt(__OPT, defValue);
}

// Setzt die naechste moegliche Option (Version mit Key)
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// defValue: Default fuer ggfs. zu setzenden Wert
// reload: Seite mit neuem Wert neu laden
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function setNextOptByName(optSet, item, defValue = undefined, reload = false, onFulfilled = undefined, onRejected = undefined) {
    // NOTE checkOpt(__OPT) wird in getOptByName() und setNextOpt() ueber setOpt() geprueft...
    const __OPT = getOptByName(optSet, item);

    return setNextOpt(__OPT, defValue, reload, onFulfilled, onRejected);
}

// Setzt die naechste moegliche Option oder fragt ab einer gewissen Anzahl interaktiv ab (Version mit Key)
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// defValue: Default fuer ggfs. zu setzenden Wert
// reload: Seite mit neuem Wert neu laden
// freeValue: Angabe, ob Freitext zugelassen ist (Default: false)
// minChoice: Ab wievielen Auswahlmoeglichkeiten soll abgefragt werden? (Default: 3)
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function promptNextOptByName(optSet, item, defValue = undefined, reload = false, freeValue = false, selValue = true, minChoice = 3, onFulfilled = undefined, onRejected = undefined) {
    // NOTE checkOpt(__OPT) wird in getOptByName() und promptNextOpt() geprueft...
    const __OPT = getOptByName(optSet, item);

    return promptNextOpt(__OPT, defValue, reload, freeValue, selValue, minChoice, onFulfilled, onRejected);
}

// ==================== Ende Abschnitt fuer Zugriff auf die Optionen ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.data.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.class.options.js ***/

// ==UserModule==
// _name         util.option.class.options
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Objekt-Klasse fuer die Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.sys.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse Options ====================

// Basisklasse fuer Optionen
function Options(optConfig, optSetLabel) {
    'use strict';

    this.setConst('config', (optConfig || { }), false);
    this.setConst('setLabel', (optSetLabel || '__OPTSET'), false);
}

Class.define(Options, Object, {
        'checkKey'        : function(key) {
                                UNUSED(key);
                                // Hier kann man Keys 'unsichtbar' machen...
                                return true;
                            },
        'toString'        : function() {
                                let retStr = this.setLabel + " = {  // " + __DBMOD.Name + " / " + __DBMAN.Name + '\n';

                                for (const [ __KEY, __OPT ] of Object.entries(this)) {
                                    if (this.checkKey(__KEY)) {
                                        const __CONFIG = getOptConfig(__OPT);
                                        const __SHAREDDATA = __CONFIG.SharedData;
                                        const __NAME = getOptName(__OPT);

                                        // Bei __SHAREDDATA unbedingt zyklische Referenzen vermeiden!
                                        // Daher nur die ObjRef anzeigen, ansonsten den gesetzten Wert...
                                        const __VAL = getValue(__SHAREDDATA, getOptValue(__OPT));
                                        const __OUT = [
                                                          __LOG.info(__VAL, true),
                                                          __LOG.info(__KEY, false),
                                                          __LOG.info(__NAME, false),
                                                          getValStr(__CONFIG.FormLabel),
                                                          __LOG.info(__CONFIG.Default, true)
                                            ];

                                        retStr += '\t' + __OUT.join('\t') + '\n';
                                    }
                                }

                                retStr += "}";

                                return retStr;
                            },
        'hasOpt'          : function(item) {
                                return hasOpt(this, item);
                            },
        'getOpt'          : function(item, defOpt = { }) {
                                return getOptByName(this, item, defOpt);
                            },
        'getOptValue'     : function(item, defValue = undefined) {
                                return getOptValueByName(this, item, defValue);
                            },
        'setOpt'          : function(item, value, reload = false, onFulfilled = undefined, onRejected = undefined) {
                                return setOptByName(this, item, value, reload, onFulfilled, onRejected);
                            },
        'getNextOpt'      : function(item, defValue = undefined) {
                                return getNextOptByName(this, item, defValue);
                            },
        'setNextOpt'      : function(item, defValue = undefined, reload = false, onFulfilled = undefined, onRejected = undefined) {
                                return setNextOptByName(this, item, defValue, reload, onFulfilled, onRejected);
                            },
        'promptNextOpt'   : function(item, defValue = undefined, reload = false, freeValue = false, selValue = true, minChoice = 3, onFulfilled = undefined, onRejected = undefined) {
                                return promptNextOptByName(this, item, defValue, reload, freeValue, selValue, minChoice, onFulfilled, onRejected);
                            },
        'invalidateOpts'  : async function(force = false, reload = true) {
                                return invalidateOpts(this, force, reload);
                            },
        'loadOptions'     : function(force = false) {
                                return loadOptions(this, force);
                            },
        'deleteOptions'   : async function(optSelect = undefined, force = false, reset = true) {
                                return deleteOptions(this, optSelect, force, reset);
                            },
        'saveOptions'     : async function(optSelect = undefined) {
                                return saveOptions(this, optSelect);
                            },
        'renameOptions'   : async function(optSelect = undefined, renameParam = undefined, renameFun = undefined) {
                                return renameOptions(this, optSelect, renameParam, renameFun);
                            },
        'resetOptions'    : async function(reload = true) {
                                return resetOptions(this, reload);
                            }
    });

// ==================== Ende Abschnitt fuer Klasse Options ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.class.options.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.api.js ***/

// ==UserModule==
// _name         util.option.api
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Zugriff auf die Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt Operationen auf Optionen ====================

// Invalidiert eine (ueber Menu) gesetzte Option
// opt: Zu invalidierende Option
// force: Invalidiert auch Optionen mit 'AutoReset'-Attribut
// return Promise auf resultierenden Wert
function invalidateOpt(opt, force = false, reload = true) {
    const [ __CONFIG ] = checkOpt(opt);

    return Promise.resolve(opt.Promise).then(() => {
            if (opt.Loaded && reload && ! opt.ReadOnly) {
                // Wert "ungeladen"...
                opt.Loaded = (force || ! __CONFIG.AutoReset);

                if (opt.Loaded && __CONFIG.AutoReset) {
                    // Nur zuruecksetzen, gilt als geladen...
                    setOptValue(opt, initOptValue(__CONFIG));
                }
            } else {  // ! opt.Loaded || ! reload || opt.ReadOnly
                opt.Loaded = false;
            }

            return getOptValue(opt);
        }, defaultCatch);
}

// Invalidiert die (ueber Menu) gesetzten Optionen
// optSet: Object mit den Optionen
// force: Invalidiert auch Optionen mit 'AutoReset'-Attribut
// return Promise auf Object mit den geladenen Optionen
async function invalidateOpts(optSet, force = false, reload = true) {
    for (let opt in optSet) {
        const __OPT = optSet[opt];

        await invalidateOpt(__OPT, force, reload);
    }

    return optSet;
}

// Laedt eine (ueber Menu) gesetzte Option
// opt: Zu ladende Option
// force: Laedt auch Optionen mit 'AutoReset'-Attribut
// return Promise auf gesetzten Wert der gelandenen Option
function loadOption(opt, force = false) {
    const [ __CONFIG, __NAME, __KEY ] = checkOpt(opt);

    if (! opt.Promise) {
        const __ISSHARED = getValue(__CONFIG.Shared, false, true);
        const __DEFAULT = getOptValue(opt, undefined);
        let value;

        if (opt.Loaded && ! __ISSHARED) {
            const __ERROR = "Error: Option " + __LOG.info(__NAME, false) + " bereits geladen!";

            __LOG[1](__ERROR);

            return Promise.reject(__ERROR);
        }

        if (opt.ReadOnly || __ISSHARED) {
            value = __DEFAULT;
        } else if (! force && __CONFIG.AutoReset) {
            value = initOptValue(__CONFIG);
        } else {
            value = (__CONFIG.Serial ?
                            deserialize(__NAME, __DEFAULT) :
                            summonValue(__NAME, __DEFAULT));
        }

        opt.Promise = Promise.resolve(value).then(value => {
                // Paranoide Sicherheitsabfrage (das sollte nie passieren!)...
                if (opt.Loaded || ! opt.Promise) {
                    throw Error("Unerwarteter Widerspruch zwischen Loaded und Promise in Option " +
                            __LOG.info(__KEY, false) + " (" + __NAME + ')',
                            { 'cause' : __LOG.info(opt, true, true) });
                }
                __LOG[6]("LOAD " + __NAME + ": " + __LOG.changed(__DEFAULT, value, true, true));

                // Wert intern setzen...
                const __VAL = setOptValue(opt, value, true);

                // Wert als geladen markieren...
                opt.Promise = undefined;
                opt.Loaded = true;

                return Promise.resolve(__VAL);
            }, defaultCatch);
    }

    return opt.Promise;
}

// Laedt die (ueber Menu) gesetzten Optionen
// optSet: Object mit den Optionen
// force: Laedt auch Optionen mit 'AutoReset'-Attribut
// return Array mit Promises neuer Ladevorgaenge (fuer Objekte mit 'name' und 'value')
function loadOptions(optSet, force = false) {
    const __PROMISES = [];

    for (let opt in optSet) {
        const __OPT = optSet[opt];

        if (__OPT && ! __OPT.Loaded) {
            const __PROMISE = loadOption(__OPT, force).then(value => {
                    __LOG[6]("LOADED " + __LOG.info(opt, false) + " << " + __LOG.info(value, true));

                    return Promise.resolve({
                            'name'  : opt,
                            'value' : value
                        });
                }, defaultCatch);

            __PROMISES.push(__PROMISE);
        }
    }

    return Promise.all(__PROMISES);
}

// Entfernt eine (ueber Menu) gesetzte Option (falls nicht 'Permanent')
// opt: Gesetzte Option
// force: Entfernt auch Optionen mit 'Permanent'-Attribut
// reset: Setzt bei Erfolg auf Initialwert der Option (auch fuer nicht 'AutoReset')
// return Promise von GM.deleteValue() (oder void)
function deleteOption(opt, force = false, reset = true) {
    const [ __CONFIG, __NAME ] = checkOpt(opt);

    if (force || ! __CONFIG.Permanent) {
        const __VALUE = getOptValue(opt, undefined);
        let newValue;

        return discardValue(__NAME).then(() => {
                if (reset || __CONFIG.AutoReset) {
                    newValue = setOptValue(opt, initOptValue(__CONFIG));
                }
                __LOG[6]("OK DELETE " + __LOG.changed(__VALUE, newValue, true, false));
            }, defaultCatch);
    }

    return Promise.resolve();
}

// Entfernt die (ueber Menu) gesetzten Optionen (falls nicht 'Permanent')
// optSet: Gesetzte Optionen
// optSelect: Liste von ausgewaehlten Optionen, true = entfernen, false = nicht entfernen
// force: Entfernt auch Optionen mit 'Permanent'-Attribut
// reset: Setzt bei Erfolg auf Initialwert der Option
// return Promise auf diesen Vorgang
async function deleteOptions(optSet, optSelect = undefined, force = false, reset = true) {
    const __DELETEALL = ((optSelect === undefined) || (optSelect === true));
    const __OPTSELECT = getValue(optSelect, { });

    for (let opt in optSet) {
        if (getValue(__OPTSELECT[opt], __DELETEALL)) {
            await deleteOption(optSet[opt], force, reset);
        }
    }

    return Promise.resolve();
}

// Speichert eine (ueber Menu) gesetzte Option (ggfs. erneut)
// opt: Gesetzte Option
// return Promise von setOptValue() (oder void)
function saveOption(opt) {
    const [ __CONFIG, __NAME ] = checkOpt(opt);

    if (__CONFIG !== undefined) {
        const __VALUE = getOptValue(opt);

        __LOG[4]("SAVE " + __NAME);

        return setOpt(opt, __VALUE, false);
    }

    return Promise.resolve();
}

// Speichert die (ueber Menu) gesetzten Optionen im Speicher
// optSet: Gesetzte Optionen
// optSelect: Liste von ausgewaehlten Optionen, true = speichern, false = nicht speichern
// return Promise auf diesen Vorgang
async function saveOptions(optSet, optSelect = undefined) {
    const __SAVEALL = ((optSelect === undefined) || (optSelect === true));
    const __OPTSELECT = getValue(optSelect, { });

    for (let opt in optSet) {
        if (getValue(__OPTSELECT[opt], __SAVEALL)) {
            await saveOption(optSet[opt]);
        }
    }

    return Promise.resolve();
}

// Benennt eine Option um und laedt sie ggfs. nach
// opt: Gesetzte Option
// name: Neu zu setzender Name (Speicheradresse)
// reload: Wert nachladen statt beizubehalten
// force: Laedt auch Optionen mit 'AutoReset'-Attribut
// return Promise auf umbenannte Option
async function renameOption(opt, name, reload = false, force = false) {
    const [ , __NAME ] = checkOpt(opt);

    if (__NAME !== name) {
        await deleteOption(opt, true, false);

        setOptName(opt, name);

        await invalidateOpt(opt, opt.Loaded, reload);

        if (reload) {
            opt.Loaded = false;

            await loadOption(opt, force);
        }
    }

    return Promise.resolve(opt);
}

// Ermittelt einen neuen Namen mit einem Prefix. Parameter fuer renameOptions()
// name: Gesetzter Name (Speicheradresse)
// prefix: Prefix, das vorangestellt werden soll
// return Neu zu setzender Name (Speicheradresse)
function prefixName(name, prefix) {
    return (prefix + name);
}

// Ermittelt einen neuen Namen mit einem Postfix. Parameter fuer renameOptions()
// name: Gesetzter Name (Speicheradresse)
// postfix: Postfix, das angehaengt werden soll
// return Neu zu setzender Name (Speicheradresse)
function postfixName(name, postfix) {
    return (name + postfix);
}

// Benennt selektierte Optionen nach einem Schema um und laedt sie ggfs. nach
// optSet: Gesetzte Optionen
// optSelect: Liste von ausgewaehlten Optionen, true = nachladen, false = nicht nachladen
// 'reload': Option nachladen?
// 'force': Option auch mit 'AutoReset'-Attribut nachladen?
// renameParam: Wird an renameFun uebergeen
// renameFun: function(name, param) zur Ermittlung des neuen Namens
// - name: Neu zu setzender Name (Speicheradresse)
// - param: Parameter "renameParam" von oben, z.B. Prefix oder Postfix
// return Promise auf diesen Vorgang
async function renameOptions(optSet, optSelect, renameParam = undefined, renameFun = prefixName) {
    if (renameFun === undefined) {
        __LOG[1]("RENAME: Illegale Funktion!");
    }
    for (let opt in optSelect) {
        const __OPTPARAMS = optSelect[opt];
        const __OPT = optSet[opt];

        if (__OPT === undefined) {
            __LOG[1]("RENAME: Option", __LOG.info(opt, false), "nicht gefunden!");
        } else {
            const [ , __NAME ] = checkOpt(__OPT);
            const __NEWNAME = renameFun(__NAME, renameParam);
            const __ISSCALAR = ((typeof __OPTPARAMS) === 'boolean');
            // Laedt die unter dem neuen Namen gespeicherten Daten nach?
            const __RELOAD = (__ISSCALAR ? __OPTPARAMS : __OPTPARAMS.reload);
            // Laedt auch Optionen mit 'AutoReset'-Attribut?
            const __FORCE = (__ISSCALAR ? true : __OPTPARAMS.force);

            await renameOption(__OPT, __NEWNAME, __RELOAD, __FORCE);
        }
    }
}

// Setzt die Optionen in optSet auf die "Werkseinstellungen" des Skripts
// optSet: Gesetzte Optionen
// reload: Seite mit "Werkseinstellungen" neu laden
// return Promise auf diesen Vorgang
async function resetOptions(optSet, reload = true) {
    // Alle (nicht 'Permanent') gesetzten Optionen entfernen...
    await deleteOptions(optSet, true, false, ! reload);

    // ... und ggfs. Seite neu laden (mit "Werkseinstellungen")...
    refreshPage(reload);
}

// ==================== Zugriff auf Option mit eventuellem Nachladen ====================

// Gibt den Wert einer Option zurueck. Laedt die Option per loadOption(), falls noetig.
// opt: Config und Value der Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// asyncLoad: Daten werden asynchron geladen, Rueckgabewert ist ein Promise-Objekt
// force: Laedt auch Optionen mit 'AutoReset'-Attribut
// return Gesetzter Wert bzw. ein Promise darauf bei asyncLoad
function loadOptValue(opt, defValue = undefined, asyncLoad = true, force = false) {
    if (! opt) {
        return Promise.reject("loadOptValue: Option ist undefined");
    }

    const [ , __NAME ] = checkOpt(opt);

    if (asyncLoad) {
        let promise = (opt.Loaded ? Promise.resolve(opt.Value) : opt.Promise);

        if (! promise) {
            promise = loadOption(opt, force);
        }

        return promise.then(value => valueOf(getValue(value, defValue)));
    } else {
        if (! opt.Loaded) {
            __LOG[1]("Warnung: loadOptValue(" + __LOG.info(__NAME, false) + ") erlaubt kein Nachladen!");
        }

        return getOptValue(opt, defValue);
    }
}

// ==================== Ende Abschnitt Operationen auf Optionen ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.api.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.js ***/

// ==UserModule==
// _name         util.mem
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer localStorage und sessionStorage
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Speicher ====================

// Speicher-Typen der Optionen
const __OPTMEM = {
    'normal' : {
                   'Name'      : "Browser",
                   'Value'     : localStorage,
                   'Display'   : 'localStorage',
                   'Prefix'    : 'run'
               },
    'begrenzt' : {
                   'Name'      : "Session",
                   'Value'     : sessionStorage,
                   'Display'   : 'sessionStorage',
                   'Prefix'    : 'run'
               },
    'inaktiv' : {
                   'Name'      : "inaktiv",
                   'Value'     : undefined,
                   'Display'   : "",
                   'Prefix'    : ""
               }
};

// ==================== Daten fuer Speicher ====================

// Namen des Default-, Temporaer- und Null-Memories...
const __MEMNORMAL   = 'normal';
const __MEMSESSION  = 'begrenzt';
const __MEMINACTIVE = 'inaktiv';

// Definition des Default-, Dauer- und Null-Memories...
const __OPTMEMNORMAL   = __OPTMEM[__MEMNORMAL];
const __OPTMEMSESSION  = __OPTMEM[__MEMSESSION];
const __OPTMEMINACTIVE = __OPTMEM[__MEMINACTIVE];

// Medium fuer die Datenbank (Speicher)
let myOptMem = __OPTMEMNORMAL;
let myOptMemSize;

// ==================== Abschnitt fuer Speicher ====================

// Ermittelt fuer die uebergebene Speicher-Konfiguration einen Speicher
// memory: __OPTMEM.normal = unbegrenzt gespeichert (localStorage), __OPTMEM.begrenzt = bis Browserende gespeichert (sessionStorage), __OPTMEM.inaktiv
// defMemory: Ersatz-Wert, falls memory undefined. Soll nur memory genutzt werden, dann z.B. null uebergeben!
// return memory, falls okay, sonst einen Defaultwert
function getMemory(memory = undefined, defMemory = getValue(myOptMem, __OPTMEMNORMAL)) {
    return getValue(memory, defMemory);
}

// Kompatibilitaetsfunktion: Testet, ob der uebergebene Speicher genutzt werden kann
// memory: __OPTMEM.normal = unbegrenzt gespeichert (localStorage), __OPTMEM.begrenzt = bis Browserende gespeichert (sessionStorage), __OPTMEM.inaktiv
// return true, wenn der Speichertest erfolgreich war
function canUseMemory(memory = undefined) {
    const __STORAGE = getMemory(memory, { });
    const __MEMORY = __STORAGE.Value;
    let ret = false;

    if (__MEMORY !== undefined) {
        const __TESTPREFIX = 'canUseMemoryTest';
        const __TESTDATA = Math.random().toString();
        const __TESTITEM = __TESTPREFIX + __TESTDATA;

        __MEMORY.setItem(__TESTITEM, __TESTDATA);
        ret = (__MEMORY.getItem(__TESTITEM) === __TESTDATA);
        __MEMORY.removeItem(__TESTITEM);
    }

    __LOG[4]("canUseMemory(" + __STORAGE.Name + ") = " + ret);

    return ret;
}

// Ermittelt die Groesse des benutzten Speichers
// memory: __OPTMEM.normal = unbegrenzt gespeichert (localStorage), __OPTMEM.begrenzt = bis Browserende gespeichert (sessionStorage), __OPTMEM.inaktiv
// return Groesse des genutzten Speichers in Bytes
function getMemSize(memory = undefined) {
    const __STORAGE = getMemory(memory);
    const __MEMORY = __STORAGE.Value;

    //getMemUsage(__MEMORY);

    if (__MEMORY !== undefined) {
        const __SIZE = safeStringify(__MEMORY).length;

        __LOG[4]("MEM: " + __SIZE + " bytes");
        return __SIZE;
    } else {
        return 0;
    }
}

// Gibt rekursiv und detailliert die Groesse des benutzten Speichers fuer ein Objekt aus
// value: (Enumerierbares) Objekt oder Wert, dessen Groesse gemessen wird
// out: Logfunktion, etwa __LOG[5]
// depth: Gewuenschte Rekursionstiefe (0 = nur dieses Objekt, -1 = alle Ebenen)
// name: Name des Objekts
function getMemUsage(value = undefined, out = undefined, depth = -1, name = '$') {
    const __OUT = (out || __LOG[5]);

    if ((typeof value) === 'string') {
        const __SIZE = value.length;

        __OUT("USAGE: " + name + '\t' + __SIZE + '\t' + value.slice(0, 255));
    } else if ((typeof value) === 'object') {
        if (depth === 0) {
            const __SIZE = safeStringify(value).length;

            __OUT("USAGE: " + name + '\t' + __SIZE);
        } else {
            depth--;
            for (let sub in value) {
                getMemUsage(value[sub], __OUT, depth, name + '.' + sub);
            }
            getMemUsage(value, __OUT, 0, name);
        }
    } else {
       const __DATA = (((typeof value) === 'function') ? "" : '\t' + value);

        __OUT("USAGE: " + name + '\t' + (typeof value) + __DATA);
    }
}

// Restauriert den vorherigen Speicher (der in einer Option definiert ist)
// opt: Option zur Wahl des Speichers
// return Promise auf gesuchten Speicher oder Null-Speicher ('inaktiv')
async function restoreMemoryByOpt(opt) {
    // Memory Storage fuer vorherige Speicherung...
    const __STORAGE = await loadOptValue(opt, __MEMNORMAL, true, true);

    return __OPTMEM[__STORAGE];
}

// Initialisiert den Speicher (der in einer Option definiert ist) und merkt sich diesen ggfs.
// opt: Option zur Wahl des Speichers
// saveOpt: Option zur Speicherung der Wahl des Speichers (fuer restoreMemoryByOpt)
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesuchter Speicher oder Null-Speicher ('inaktiv'), falls speichern nicht moeglich ist
function startMemoryByOpt(opt, saveOpt = undefined, onFulfilled = undefined, onRejected = undefined) {
    // Memory Storage fuer naechste Speicherung...
    let storage = getOptValue(opt, __MEMNORMAL);
    let optMem = __OPTMEM[storage];

    if (! canUseMemory(optMem)) {
        if (storage !== __MEMINACTIVE) {
            storage = __MEMINACTIVE;
            optMem = __OPTMEM[storage];
        }
    }

    if (saveOpt !== undefined) {
        setOpt(saveOpt, storage, false, onFulfilled, onRejected);
    }

    return optMem;
}

// ==================== Ende Abschnitt fuer Speicher ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.db.js ***/

// ==UserModule==
// _name         util.mem.db
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer die Script-Datenbank
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.sys.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.db.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Funktionen fuer die Scriptdatenbank ====================

// Initialisiert die Scriptdatenbank, die einen Datenaustausch zwischen den Scripten ermoeglicht
// optSet: Gesetzte Optionen (und Config)
function initScriptDB(optSet) {
    UNUSED(optSet);

     // Speicher fuer die DB-Daten...
    const __DBMEM = myOptMem.Value;

    __DBTOC.versions = getValue((__DBMEM === undefined) ? undefined : JSON.parse(__DBMEM.getItem('__DBTOC.versions')), { });
    __DBTOC.namespaces = getValue((__DBMEM === undefined) ? undefined : JSON.parse(__DBMEM.getItem('__DBTOC.namespaces')), { });

    // Zunaechst den alten Eintrag entfernen...
    delete __DBTOC.versions[__DBMOD.name];
    delete __DBTOC.namespaces[__DBMOD.name];

    if (__DBMEM !== undefined) {
        // ... und die Daten der Fremdscripte laden...
        for (let module in __DBTOC.versions) {
            scriptDB(module, getValue(JSON.parse(__DBMEM.getItem('__DBDATA.' + module)), { }));
        }
    }
}

// Setzt die Daten dieses Scriptes in der Scriptdatenbank, die einen Datenaustausch zwischen den Scripten ermoeglicht
// optSet: Gesetzte Optionen (und Config)
function updateScriptDB(optSet) {
    // Eintrag ins Inhaltsverzeichnis...
    __DBTOC.versions[__DBMOD.name] = __DBMOD.version;
    __DBTOC.namespaces[__DBMOD.name] = __DBMOD.namespace;

    // Speicher fuer die DB-Daten...
    const __DBMEM = myOptMem.Value;

    if (__DBMEM !== undefined) {
        // Permanente Speicherung der Eintraege...
        __DBMEM.setItem('__DBTOC.versions', safeStringify(__DBTOC.versions));
        __DBMEM.setItem('__DBTOC.namespaces', safeStringify(__DBTOC.namespaces));
        __DBMEM.setItem('__DBDATA.' + __DBMOD.name, safeStringify(optSet));

        // Aktualisierung der Speichergroesse...
        myOptMemSize = getMemSize(myOptMem);
    }

    // Jetzt die inzwischen gefuellten Daten *dieses* Scripts ergaenzen...
    scriptDB(__DBMOD.name, getValue(optSet, { }));

    __LOG[2](__DBDATA);
}

// Holt die globalen Daten zu einem Modul aus der Scriptdatenbank
// module: Gesetzte Optionen (und Config)
// initValue: Falls angegeben, zugewiesener Startwert
// return Daten zu diesem Modul
function scriptDB(module, initValue = undefined) {
    const __NAMESPACE = __DBTOC.namespaces[module];
    const __DBMODS = getProp(__DBDATA, __NAMESPACE, { });

    if (initValue !== undefined) {
        return (__DBMODS[module] = initValue);
    } else {
        return getProp(__DBMODS, module, { });
    }
}

// ==================== Ende Funktionen fuer die Scriptdatenbank ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.db.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.cmd.js ***/

// ==UserModule==
// _name         util.mem.cmd
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer gespeicherte Kommandos (StoredCmds)
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.cmd.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer StoredCmds ====================

// Fuehrt die in einem Storage gespeicherte Operation aus
// memory: __OPTMEM.normal = unbegrenzt gespeichert (localStorage), __OPTMEM.begrenzt = bis Browserende gespeichert (sessionStorage), __OPTMEM.inaktiv
// return Array von Objekten mit 'cmd' / 'key' / 'val' (derzeit maximal ein Kommando) oder undefined
function getStoredCmds(memory = undefined) {
    const __STORAGE = getMemory(memory);
    const __MEMORY = __STORAGE.Value;
    const __RUNPREFIX = __STORAGE.Prefix;
    const __STOREDCMDS = [];

    if (__MEMORY !== undefined) {
        const __GETITEM = function(item) {
                              return __MEMORY.getItem(__RUNPREFIX + item);
                          };
        const __DELITEM = function(item) {
                              return __MEMORY.removeItem(__RUNPREFIX + item);
                          };
        const __CMD = ((__MEMORY !== undefined) ? __GETITEM('cmd') : undefined);

        if (__CMD !== undefined) {
            const __KEY = __GETITEM('key');
            let value = __GETITEM('val');

            try {
                value = JSON.parse(value);
            } catch (ex) {
                __LOG[1]("getStoredCmds():", __CMD, __LOG.info(__KEY, false), "hat illegalen Wert", __LOG.info(value, false));
                // ... meist kann man den String selber aber speichern, daher kein "return"...
            }

            __STOREDCMDS.push({
                                'cmd' : __CMD,
                                'key' : __KEY,
                                'val' : value
                            });
        }

        __DELITEM('cmd');
        __DELITEM('key');
        __DELITEM('val');
    }

    return (__STOREDCMDS.length ? __STOREDCMDS : undefined);
}

// Fuehrt die in einem Storage gespeicherte Operation aus
// storedCmds: Array von Objekten mit 'cmd' / 'key' / 'val' (siehe getStoredCmds())
// optSet: Object mit den Optionen
// beforeLoad: Angabe, ob nach der Speicherung noch loadOptions() aufgerufen wird
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Promise auf ein Array von Operationen (wie storedCmds), die fuer die naechste Phase uebrig bleiben
async function runStoredCmds(storedCmds, optSet = undefined, beforeLoad = undefined, onFulfilled = undefined, onRejected = undefined) {
    const __BEFORELOAD = getValue(beforeLoad, true);
    const __STOREDCMDS = getValue(storedCmds, []);
    const __LOADEDCMDS = [];
    let invalidated = false;

    while (__STOREDCMDS.length) {
        const __STORED = __STOREDCMDS.shift();
        const __CMD = __STORED.cmd;
        const __KEY = __STORED.key;
        const __VAL = __STORED.val;

        if (__BEFORELOAD) {
            if (__STOREDCMDS.length) {
                await invalidateOpts(optSet);  // alle Optionen invalidieren
                invalidated = true;
            }
            switch (__OPTACTION[__CMD]) {
            case __OPTACTION.SET : __LOG[5]('SET', __LOG.info(__KEY, false), __VAL);
                                   setStored(__KEY, __VAL, false, false, onFulfilled, onRejected);
                                   break;
            case __OPTACTION.NXT : __LOG[5]('SETNEXT', __LOG.info(__KEY, false), __VAL);
                                   //setNextStored(__CONFIG.Choice, __KEY, __VAL, false, false, onFulfilled, onRejected);
                                   setStored(__KEY, __VAL, false, false, onFulfilled, onRejected);
                                   break;
            case __OPTACTION.RST : __LOG[5]('RESET', '(delayed)');
                                   __LOADEDCMDS.push(__STORED);
                                   break;
            default :              break;
            }
        } else {
            switch (__OPTACTION[__CMD]) {
            case __OPTACTION.SET :
            case __OPTACTION.NXT : __LOG[3]('SET/SETNEXT', '(undefined)');
                                   break;
            case __OPTACTION.RST : __LOG[5]('RESET');
                                   await resetOptions(optSet, false);
                                   await loadOptions(optSet);  // Reset auf umbenannte Optionen anwenden!
                                   break;
            default :              break;
            }
        }
    }

    __LOG[8]("runStoredCmds():", (invalidated ? "" : "not ") + "invalidated");

    return (__LOADEDCMDS.length ? __LOADEDCMDS : undefined);
}

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.cmd.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.menu.js ***/

// ==UserModule==
// _name         util.option.menu
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Script-Optionen im Benutzermenue
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.sys.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.menu.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer das Benutzermenu ====================

// Zeigt den Eintrag im Menu einer Option
// val: Derzeitiger Wert der Option
// menuOn: Text zum Setzen im Menu
// funOn: Funktion zum Setzen
// keyOn: Hotkey zum Setzen im Menu
// menuOff: Text zum Ausschalten im Menu
// funOff: Funktion zum Ausschalten
// keyOff: Hotkey zum Ausschalten im Menu
// return Promise von GM.registerMenuCommand()
async function registerMenuOption(val, menuOn, funOn, keyOn, menuOff, funOff, keyOff) {
    const __ON  = (val ? '*' : "");
    const __OFF = (val ? "" : '*');

    __LOG[4]("OPTION " + __ON + menuOn + __ON + " / " + __OFF + menuOff + __OFF);

    if (val) {
        return Promise.resolve(GM.registerMenuCommand(menuOff, funOff, keyOff)).then(() => menuOn);
    } else {
        return Promise.resolve(GM.registerMenuCommand(menuOn, funOn, keyOn)).then(() => menuOff);
    }
}

// Zeigt den Eintrag im Menu einer Option mit Wahl des naechsten Wertes
// val: Derzeitiger Wert der Option
// arr: Array-Liste mit den moeglichen Optionen
// menu: Text zum Setzen im Menu ($ wird durch gesetzten Wert ersetzt)
// fun: Funktion zum Setzen des naechsten Wertes
// key: Hotkey zum Setzen des naechsten Wertes im Menu
// return Promise von GM.registerMenuCommand()
async function registerNextMenuOption(val, arr, menu, fun, key) {
    const __MENU = substParam(menu, val);
    let options = "OPTION " + __MENU;

    for (let value of arr) {
        if (value === val) {
            options += " / *" + value + '*';
        } else {
            options += " / " + value;
        }
    }
    __LOG[4](options);

    return Promise.resolve(GM.registerMenuCommand(__MENU, fun, key)).then(() => __MENU);
}

// Zeigt den Eintrag im Menu einer Option, falls nicht hidden
// val: Derzeitiger Wert der Option
// menu: Text zum Setzen im Menu ($ wird durch gesetzten Wert ersetzt)
// fun: Funktion zum Setzen des naechsten Wertes
// key: Hotkey zum Setzen des naechsten Wertes im Menu
// hidden: Angabe, ob Menupunkt nicht sichtbar sein soll (Default: sichtbar)
// serial: Serialization fuer komplexe Daten
// return Promise von GM.registerMenuCommand() (oder String-Version des Wertes)
async function registerDataOption(val, menu, fun, key, hidden = false, serial = true) {
    const __VALUE = ((serial && (val !== undefined)) ? safeStringify(val) : val);
    const __MENU = substParam(menu, __VALUE);
    const __OPTIONS = (hidden ? "HIDDEN " : "") + "OPTION " + __MENU +
                      getValue(__VALUE, "", " = " + __VALUE);

    __LOG[hidden ? 5 : 4](__OPTIONS);

    if (hidden) {
        return Promise.resolve(__VALUE);
    } else {
        return Promise.resolve(GM.registerMenuCommand(__MENU, fun, key)).then(() => __MENU);
    }
}

// Zeigt den Eintrag im Menu einer Option
// opt: Config und Value der Option
// return Promise von GM.registerMenuCommand() (oder String-Version des Wertes)
function registerOption(opt) {
    const __CONFIG = getOptConfig(opt);
    const __VALUE = getOptValue(opt);
    const __LABEL = __CONFIG.Label;
    const __ACTION = opt.Action;
    const __HOTKEY = __CONFIG.Hotkey;
    const __HIDDEN = __CONFIG.HiddenMenu;
    const __SERIAL = __CONFIG.Serial;

    if (! __HIDDEN) {
        switch (__CONFIG.Type) {
        case __OPTTYPES.MC : return registerNextMenuOption(__VALUE, __CONFIG.Choice, __LABEL, __ACTION, __HOTKEY);
        case __OPTTYPES.SW : return registerMenuOption(__VALUE, __LABEL, __ACTION, __HOTKEY,
                                                       __CONFIG.AltLabel, __ACTION, __CONFIG.AltHotkey);
        case __OPTTYPES.TF : return registerMenuOption(__VALUE, __LABEL, __ACTION, __HOTKEY,
                                                       __CONFIG.AltLabel, opt.AltAction, __CONFIG.AltHotkey);
        case __OPTTYPES.SD : return registerDataOption(__VALUE, __LABEL, __ACTION, __HOTKEY, __HIDDEN, __SERIAL);
        case __OPTTYPES.SI : return registerDataOption(__VALUE, __LABEL, __ACTION, __HOTKEY, __HIDDEN, __SERIAL);
        default :            return Promise.resolve(__VALUE);
        }
    } else {
        // Nur Anzeige im Log...
        return registerDataOption(__VALUE, __LABEL, __ACTION, __HOTKEY, __HIDDEN, __SERIAL);
    }
}

// Baut das Benutzermenu auf (asynchron im Hintergrund)
// optSet: Gesetzte Optionen
// return Promise auf void
async function buildOptionMenu(optSet) {
    __LOG[4]("buildOptionMenu()");

    for (let opt in optSet) {
        await registerOption(optSet[opt]).then(
                result => __LOG[8](`REGISTEROPTION[${opt}] = ${result}`),
                defaultCatch);
    }
}

// ==================== Ende Abschnitt fuer das Benutzermenu ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.menu.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.label.js ***/

// ==UserModule==
// _name         util.option.page.label
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Node-Tooltips auf der Seite
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.sys.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.label.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Node-Tooltips auf der Seite ====================

// Hilfsfunktion: Wendet eine Konvertierung auf jede "Zeile" innerhalb eines Textes an
// text: Urspruenglicher Text
// convFun: function(line, index, arr): Konvertiert line in "Zeile" line des Arrays arr
// separator: Zeilentrenner im Text (Default: '\n')
// thisArg: optionaler this-Parameter fuer die Konvertierung
// limit: optionale Begrenzung der Zeilen
// return String mit dem neuen Text
function eachLine(text, convFun, separator = '\n', thisArg = undefined, limit = undefined) {
    const __ARR = text.split(separator, limit);
    const __RES = __ARR.map(convFun, thisArg);

    return __RES.join(separator);
}

// Hilfsfunktion: Ergaenzt einen HTML-Code um einen Titel (ToolTip)
// html: Urspruenglicher HTML-Code (z.B. ein HTML-Element oder Text)
// title: Im ToolTip angezeigter Text
// separator: Zeilentrenner im Text (Default: '|')
// limit: optionale Begrenzung der Zeilen
// return String mit dem neuen HTML-Code
function withTitle(html, title, separator = '|', limit = undefined) {
    if (title && title.length) {
        return eachLine(html, line => '<ABBR title="' + title + '">' + line + '</ABBR>', separator, undefined, limit);
    } else {
        return html;
    }
}

// Hilfsfunktion: Ermittelt einen Label- oder FormLabel-Eintrag (Default)
// label: Config-Eintrag fuer Label oder FormLabel
// defLabel: Ersatzwert, falls label nicht angegeben
// isSelect: Angabe, ob ein Parameter angezeigt wird (Default: false)
// isForm: Angabe, ob ein FormLabel gesucht ist (Default: true)
// return Vollstaendiger Label- oder FormLabel-Eintrag
function formatLabel(label, defLabel = undefined, isSelect = false, isForm = true) {
    const __LABEL = getValue(label, defLabel);

    if (isSelect && __LABEL && (substParam(__LABEL, '_') === __LABEL)) {
        return __LABEL + (isForm ? "|$" : " $");
    } else {
        return __LABEL;
    }
}

// ==================== Ende Abschnitt fuer Node-Tooltips auf der Seite ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.label.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.action.js ***/

// ==UserModule==
// _name         util.option.page.action
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Node-Tooltips auf der Seite
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.action.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Reaktionen der Node-Elemente auf der Seite ====================

// Liefert den Funktionsaufruf zur Option als String
// opt: Auszufuehrende Option
// isAlt: Angabe, ob AltAction statt Action gemeint ist
// value: Ggfs. zu setzender Wert
// serial: Serialization fuer String-Werte (Select, Textarea)
// memory: __OPTMEM.normal = unbegrenzt gespeichert (localStorage), __OPTMEM.begrenzt = bis Browserende gespeichert (sessionStorage), __OPTMEM.inaktiv
// return String mit dem (reinen) Funktionsaufruf
function getFormAction(opt, isAlt = false, value = undefined, serial = undefined, memory = undefined) {
    const __STORAGE = getMemory(memory);
    const __MEMORY = __STORAGE.Value;
    const __MEMSTR = __STORAGE.Display;
    const __RUNPREFIX = __STORAGE.Prefix;

    if (__MEMORY !== undefined) {
        const __RELOAD = "window.location.reload()";
        const __SETITEM = function(item, val, quotes = true) {
                              return (__MEMSTR + ".setItem(" + __LOG.info(__RUNPREFIX + item, false) + ',' + (quotes ? __LOG.info(val, false) : val) + "),");
                          };
        const __SETITEMS = function(cmd, key = undefined, val = undefined) {
                              return ('(' + __SETITEM('cmd', cmd) + ((key === undefined) ? "" :
                                      __SETITEM('key', key) + __SETITEM('val', val, false)) + __RELOAD + ')');
                          };
        const __CONFIG = getOptConfig(opt);
        const __SERIAL = getValue(serial, getValue(__CONFIG.Serial, false));
        const __THISVAL = ((__CONFIG.ValType === 'String') ? "'\\u0022' + this.value + '\\u0022'" : "this.value");
        const __TVALUE = getValue(__CONFIG.ValType, __THISVAL, "new " + __CONFIG.ValType + '(' + __THISVAL + ')');
        const __VALSTR = ((value !== undefined) ? safeStringify(value) : __SERIAL ? "JSON.stringify(" + __TVALUE + ')' : __TVALUE);
        const __ACTION = (isAlt ? getValue(__CONFIG.AltAction, __CONFIG.Action) : __CONFIG.Action);

        if (__ACTION !== undefined) {
            switch (__ACTION) {
            case __OPTACTION.SET : //return "doActionSet(" + __LOG.info(getOptName(opt), false) + ", " + getNextOpt(opt, __VALSTR) + ')';
                                   return __SETITEMS('SET', getOptName(opt), __VALSTR);
            case __OPTACTION.NXT : //return "doActionNxt(" + __LOG.info(getOptName(opt), false) + ", " + getNextOpt(opt, __VALSTR) + ')';
                                   return __SETITEMS('NXT', getOptName(opt), __VALSTR);
            case __OPTACTION.RST : //return "doActionRst()";
                                   return __SETITEMS('RST');
            default :              break;
            }
        }
    }

    return undefined;
}

// Liefert die Funktionsaufruf zur Option als String
// opt: Auszufuehrende Option
// isAlt: Angabe, ob AltAction statt Action gemeint ist
// value: Ggfs. zu setzender Wert
// type: Event-Typ fuer <INPUT>, z.B. "click" fuer "onclick="
// serial: Serialization fuer String-Werte (Select, Textarea)
// memory: __OPTMEM.normal = unbegrenzt gespeichert (localStorage), __OPTMEM.begrenzt = bis Browserende gespeichert (sessionStorage), __OPTMEM.inaktiv
// return String mit dem (reinen) Funktionsaufruf
function getFormActionEvent(opt, isAlt = false, value = undefined, type = 'click', serial = undefined, memory = undefined) {
    const __ACTION = getFormAction(opt, isAlt, value, serial, memory);

    return getValue(__ACTION, "", ' on' + type + '="' + __ACTION + '"');
}

// ==================== Ende Abschnitt fuer Reaktionen der Node-Elemente auf der Seite ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.action.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.node.js ***/

// ==UserModule==
// _name         util.option.page.node
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Node-Elementen in HTML auf der Seite
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.sys.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.label.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.action.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.node.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Node-Elemente auf der Seite ====================

// Zeigt eine Option auf der Seite als Auswahlbox an
// opt: Anzuzeigende Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// return String mit dem HTML-Code
function getOptionSelect(opt, defValue = undefined) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt, defValue);
    const __ACTION = getFormActionEvent(opt, false, undefined, 'change', undefined);
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel, __CONFIG.Label, true);
    const __TITLE = substParam(getValue(__CONFIG.Title, __CONFIG.Label), __VALUE);
    const __LABEL = '<LABEL for="' + __NAME + '">' + __FORMLABEL + '</LABEL>';
    let element = '<SELECT name="' + __NAME + '" id="' + __NAME + '"' + __ACTION + '>';

    if (__CONFIG.FreeValue && ! (~ __CONFIG.Choice.indexOf(__VALUE))) {
        element += '\n<OPTION value="' + __VALUE + '" SELECTED>' + __VALUE + '</OPTION>';
    }
    for (let value of __CONFIG.Choice) {
        element += '\n<OPTION value="' + value + '"' +
                   ((value === __VALUE) ? ' SELECTED' : "") +
                   '>' + value + '</OPTION>';
    }
    element += '\n</SELECT>';

    return withTitle(substParam(__LABEL, element), __TITLE);
}

// Zeigt eine Option auf der Seite als Radiobutton an
// opt: Anzuzeigende Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// return String mit dem HTML-Code
function getOptionRadio(opt, defValue = false) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt, defValue);
    const __ACTION = getFormActionEvent(opt, false, true, 'click', false);
    const __ALTACTION = getFormActionEvent(opt, true, false, 'click', false);
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel);  // nur nutzen, falls angegeben
    const __TITLE = getValue(__CONFIG.Title, '$');
    const __TITLEON = substParam(__TITLE, __CONFIG.Label);
    const __TITLEOFF = substParam(getValue(__CONFIG.AltTitle, __TITLE), __CONFIG.AltLabel);
    const __ELEMENTON  = '<INPUT type="radio" name="' + __NAME +
                         '" id="' + __NAME + 'ON" value="1"' +
                         (__VALUE ? ' CHECKED' : __ACTION) +
                         ' /><LABEL for="' + __NAME + 'ON">' +
                         __CONFIG.Label + '</LABEL>';
    const __ELEMENTOFF = '<INPUT type="radio" name="' + __NAME +
                         '" id="' + __NAME + 'OFF" value="0"' +
                         (__VALUE ? __ALTACTION : ' CHECKED') +
                         ' /><LABEL for="' + __NAME + 'OFF">' +
                         __CONFIG.AltLabel + '</LABEL>';
    const __ELEMENT = [
                          withTitle(__FORMLABEL, __VALUE ? __TITLEON : __TITLEOFF),
                          withTitle(__ELEMENTON, __TITLEON),
                          withTitle(__ELEMENTOFF, __TITLEOFF)
                      ];

    return ((__FORMLABEL && __FORMLABEL.length) ? __ELEMENT : __ELEMENT.slice(1, 3));
}

// Zeigt eine Option auf der Seite als Checkbox an
// opt: Anzuzeigende Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// return String mit dem HTML-Code
function getOptionCheckbox(opt, defValue = false) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt, defValue);
    const __ACTION = getFormActionEvent(opt, __VALUE, ! __VALUE, 'click', false);
    const __VALUELABEL = (__VALUE ? __CONFIG.Label : getValue(__CONFIG.AltLabel, __CONFIG.Label));
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel, __CONFIG.Label);
    const __TITLE = substParam(getValue(__VALUE ? __CONFIG.Title : getValue(__CONFIG.AltTitle, __CONFIG.Title), '$'), __VALUELABEL);

    return withTitle('<INPUT type="checkbox" name="' + __NAME +
                     '" id="' + __NAME + '" value="' + __VALUE + '"' +
                     (__VALUE ? ' CHECKED' : "") + __ACTION + ' /><LABEL for="' +
                     __NAME + '">' + __FORMLABEL + '</LABEL>', __TITLE);
}

// Zeigt eine Option auf der Seite als Daten-Textfeld an
// opt: Anzuzeigende Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// return String mit dem HTML-Code
function getOptionTextarea(opt, defValue = "") {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt, defValue);
    const __ACTION = getFormActionEvent(opt, false, undefined, 'submit', undefined);
    const __SUBMIT = getValue(__CONFIG.Submit, "");
    //const __ONSUBMIT = (__SUBMIT.length ? ' onKeyDown="' + __SUBMIT + '"': "");
    const __ONSUBMIT = (__SUBMIT ? ' onKeyDown="' + __SUBMIT + '"': "");
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel, __CONFIG.Label);
    const __TITLE = substParam(getValue(__CONFIG.Title, '$'), __FORMLABEL);
    const __ELEMENTLABEL = '<LABEL for="' + __NAME + '">' + __FORMLABEL + '</LABEL>';
    const __ELEMENTTEXT = '<TEXTAREA name="' + __NAME + '" id="' + __NAME + '" cols="' + __CONFIG.Cols +
                           '" rows="' + __CONFIG.Rows + '"' + __ONSUBMIT + __ACTION + '>' +
                           safeStringify(__VALUE, __CONFIG.Replace, __CONFIG.Space) + '</TEXTAREA>';

    return [ withTitle(__ELEMENTLABEL, __TITLE), __ELEMENTTEXT ];
}

// Zeigt eine Option auf der Seite als Button an
// opt: Anzuzeigende Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// return String mit dem HTML-Code
function getOptionButton(opt, defValue = false) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt, defValue);
    const __ACTION = getFormActionEvent(opt, __VALUE, ! __VALUE, 'click', false);
    const __BUTTONLABEL = (__VALUE ? getValue(__CONFIG.AltLabel, __CONFIG.Label) : __CONFIG.Label);
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel, __BUTTONLABEL);
    const __BUTTONTITLE = substParam(getValue(__VALUE ? getValue(__CONFIG.AltTitle, __CONFIG.Title) : __CONFIG.Title, '$'), __BUTTONLABEL);

    return '<LABEL for="' + __NAME + '">' + __FORMLABEL + '</LABEL>' +
           withTitle('<INPUT type="button" name="' + __NAME +
                     '" id="' + __NAME + '" value="' + __BUTTONLABEL +
                     '"' + __ACTION + '/>', __BUTTONTITLE);
}

// Zeigt eine Option auf der Seite an (je nach Typ)
// opt: Anzuzeigende Option
// return String mit dem HTML-Code
function getOptionElement(opt) {
    const __CONFIG = getOptConfig(opt);
    const __TYPE = getValue(__CONFIG.FormType, __CONFIG.Type);
    let element = "";

    if (! __CONFIG.Hidden) {
        switch (__TYPE) {
        case __OPTTYPES.MC : element = getOptionSelect(opt);
                             break;
        case __OPTTYPES.SW : if (__CONFIG.FormLabel !== undefined) {
                                 element = getOptionCheckbox(opt);
                             } else {
                                 element = getOptionRadio(opt);
                             }
                             break;
        case __OPTTYPES.TF : element = getOptionCheckbox(opt);
                             break;
        case __OPTTYPES.SD : element = getOptionTextarea(opt);
                             break;
        case __OPTTYPES.SI : element = getOptionButton(opt);
                             break;
        default :            break;
        }

        if ((typeof element) !== 'string') {
            element = '<DIV>' + Array.from(element).join('<BR />') + '</DIV>';
        }
    }

    return element;
}

// ==================== Ende Abschnitt fuer Node-Elemente auf der Seite ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.node.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.js ***/

// ==UserModule==
// _name         util.option.page
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Script-Optionen auf der Seite
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.prop.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.node.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Optionen auf der Seite ====================

// Gruppiert die Daten eines Objects nach einem Kriterium
// data: Object mit Daten
// byFun: function(val), die das Kriterium ermittelt. Default: value
// filterFun: function(key, index, arr), die das Kriterium key im Array arr an der Stelle index vergleicht. Default: Wert identisch
// sortFun: function(a, b), nach der die Kriterien sortiert werden. Default: Array.sort()
// return Neues Object mit Eintraegen der Form <Kriterium> : [ <alle Keys zu diesem Kriterium> ]
function groupData(data, byFun, filterFun, sortFun) {
    const __BYFUN = (byFun || sameValue);
    const __FILTERFUN = (filterFun || ((key, index, arr) => (arr[index] === key)));
    const __KEYS = Object.keys(data);
    const __VALS = Object.values(data);
    const __BYKEYS = __VALS.map(__BYFUN);
    const __BYKEYSET = new Set(__BYKEYS);
    const __BYKEYARRAY = [... __BYKEYSET];
    const __SORTEDKEYS = __BYKEYARRAY.sort(sortFun);
    const __GROUPEDKEYS = __SORTEDKEYS.map(byVal => __KEYS.filter((key, index) => {
                                                            UNUSED(key);
                                                            return __FILTERFUN(byVal, index, __BYKEYS);
                                                        }));
    const __ASSIGN = ((keyArr, valArr) => Object.assign({ }, ... keyArr.map((key, index) => ({ [key] : valArr[index] }))));

    return __ASSIGN(__SORTEDKEYS, __GROUPEDKEYS);
}

// Baut das Benutzermenu auf der Seite auf
// optSet: Gesetzte Optionen
// optParams: Eventuell notwendige Parameter
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// 'formWidth': Anzahl der Elemente pro Zeile
// 'formBreak': Elementnummer des ersten Zeilenumbruchs
// return String mit dem HTML-Code
function getOptionForm(optSet, optParams = { }) {
    const __FORM = '<FORM id="options" method="POST"><TABLE><TBODY><TR>';
    const __FORMEND = '</TR></TBODY></TABLE></FORM>';
    const __FORMWIDTH = getValue(optParams.formWidth, 3);
    const __FORMBREAK = getValue(optParams.formBreak, __FORMWIDTH);
    const __SHOWFORM = optSet.getOptValue('showForm', true) ? optParams.showForm : { 'showForm' : true };
    const __PRIOOPTS = groupData(optSet, opt => getOptConfig(opt).FormPrio);
    let form = __FORM;
    let count = 0;   // Bisher angezeigte Optionen
    let column = 0;  // Spalte der letzten Option (1-basierend)

    for (let optKeys of Object.values(__PRIOOPTS)) {
        for (let optKey of optKeys) {
            if (checkItem(optKey, __SHOWFORM, optParams.hideForm)) {
                const __ELEMENT = getOptionElement(optSet[optKey]);
                const __TDOPT = ((~ __ELEMENT.indexOf('|')) ? "" : ' colspan="2"');

                if (__ELEMENT) {
                    if (++count > __FORMBREAK) {
                        if (++column > __FORMWIDTH) {
                            column = 1;
                        }
                    }
                    if (column === 1) {
                        form += '</TR><TR>';
                    }
                    form += '\n<TD' + __TDOPT + '>' + __ELEMENT.replace('|', '</TD><TD>') + '</TD>';
                }
            }
        }
    }
    form += '\n' + __FORMEND;

    return form;
}

// Fuegt das Script fuer die Optionen in die Seite ein
// optSet: Gesetzte Optionen
// optParams: Eventuell notwendige Parameter
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// return String mit dem HTML-Code fuer das Script
function getOptionScript(optSet, optParams = { }) {
    UNUSED(optSet, optParams);

    //const __SCRIPT = '<SCRIPT type="text/javascript">function activateMenu() { console.log("TADAAA!"); }</SCRIPT>';
    //const __SCRIPT = '<SCRIPT type="text/javascript">\n\tfunction doActionNxt(key, value) { alert("SET " + key + " = " + value); }\n\tfunction doActionNxt(key, value) { alert("SET " + key + " = " + value); }\n\tfunction doActionRst(key, value) { alert("RESET"); }\n</SCRIPT>';
    //const __FORM = '<FORM method="POST"><input type="button" id="showOpts" name="showOpts" value="Optionen anzeigen" onclick="activateMenu()" /></FORM>';

    const __SCRIPT = "";

    //window.eval('function activateMenu() { console.log("TADAAA!"); }');

    return __SCRIPT;
}

// Informationen zu hinzugefuegten Forms
const __FORMS = { };

// Zeigt das Optionsmenu auf der Seite an (im Gegensatz zum Benutzermenu)
// anchor: Element, das als Anker fuer die Anzeige dient
// form: HTML-Form des Optionsmenu (hinten angefuegt)
// script: Script mit Reaktionen
function addOptionForm(anchor, form = "", script = "") {
    const __OLDFORM = __FORMS[anchor];
    const __REST = (__OLDFORM === undefined) ? anchor.innerHTML :
                   anchor.innerHTML.substring(0, anchor.innerHTML.length - __OLDFORM.Script.length - __OLDFORM.Form.length);

    __FORMS[anchor] = {
                          'Script' : script,
                          'Form'   : form
                      };

    anchor.innerHTML = __REST + script + form;
}

// Zeigt das Optionsmenu auf der Seite an (im Gegensatz zum Benutzermenu)
// anchor: Element, das als Anker fuer die Anzeige dient
// optSet: Gesetzte Optionen
// optParams: Eventuell notwendige Parameter
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// 'formWidth': Anzahl der Elemente pro Zeile
// 'formBreak': Elementnummer des ersten Zeilenumbruchs
function buildOptionForm(anchor, optSet, optParams = { }) {
    __LOG[4]("buildOptionForm()");

    const __FORM = getOptionForm(optSet, optParams);
    const __SCRIPT = getOptionScript(optSet, optParams);

    addOptionForm(anchor, __FORM, __SCRIPT);
}

// ==================== Ende Abschnitt fuer Optionen auf der Seite ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.run.js ***/

// ==UserModule==
// _name         util.option.run
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Aufbau und Start der Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.prop.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.path.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.db.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.cmd.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.menu.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.run.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Aufbau und Start der Optionen ====================

// Initialisiert die Menue-Funktion einer Option
// optAction: Typ der Funktion
// item: Key der Option
// optSet: Platz fuer die gesetzten Optionen (und Config)
// config: Konfiguration der Option
// return Funktion fuer die Option
function initOptAction(optAction, item = undefined, optSet = undefined, config = undefined) {
    let fun;

    if (optAction !== undefined) {
        const __CONFIG = ((config !== undefined) ? config : getOptConfig(getOptByName(optSet, item)));
        const __RELOAD = getValue(getValue(__CONFIG, { }).ActionReload, true);

        switch (optAction) {
        case __OPTACTION.SET  : fun = function() {
                                        return setOptByName(optSet, item, __CONFIG.SetValue, __RELOAD).catch(defaultCatch);
                                    };
                                break;
        case __OPTACTION.NXT  : fun = async function() {
                                        return new Promise(function(resolve, reject) {
                                                return promptNextOptByName(optSet, item, __CONFIG.SetValue, __RELOAD,
                                                    __CONFIG.FreeValue, __CONFIG.SelValue, __CONFIG.MinChoice, resolve, reject);
                                            }).catch(defaultCatch);
                                    };
                                break;
        case __OPTACTION.RST  : fun = function() {
                                        return resetOptions(optSet, __RELOAD).then(
                                                result => __LOG[4]("RESETTING (" + result + ")..."),
                                                defaultCatch);
                                    };
                                break;
        default :               break;
        }
    }

    return fun;
}

// Gibt diese Config oder, falls 'Shared', ein Referenz-Objekt mit gemeinsamen Daten zurueck
// config: Konfiguration der Option
// item: Key der Option
// return Entweder config oder gemergete Daten auf Basis des in 'Shared' angegebenen Objekts
function getSharedConfig(config, item = undefined) {
    let newConfig = getValue(config, { });
    const __SHARED = config.Shared;

    if (__SHARED !== undefined) {
        const __OBJREF = getSharedRef(__SHARED, item);  // Gemeinsame Daten

        if (getValue(__SHARED.item, '$') !== '$') {  // __OBJREF ist ein Item
            const __REF = valueOf(__OBJREF);

            newConfig = { };  // Neu aufbauen...
            addProps(newConfig, getOptConfig(__REF));
            addProps(newConfig, config);
            newConfig.setConst('SharedData', getOptValue(__REF), false);   // Wert muss schon da sein, NICHT nachladen, sonst ggfs. Promise
        } else {  // __OBJREF enthaelt die Daten selbst
            if (! newConfig.Name) {
                newConfig.Name = __OBJREF.getPath();
            }
            newConfig.setConst('SharedData', __OBJREF);  // Achtung: Ggfs. zirkulaer!
        }
    }

    return newConfig;
}

// Initialisiert die gesetzten Optionen. Man beachte:
// Diese Funktion wird erst mit preInit = true, dann mit preInit = false aufgerufen!
// optConfig: Konfiguration der Optionen
// optSet: Platz fuer die gesetzten Optionen
// preInit: Vorinitialisierung einzelner Optionen mit 'PreInit'-Attribut
// return Gefuelltes Objekt mit den gesetzten Optionen
function initOptions(optConfig, optSet = undefined, preInit = undefined) {
    const __OPTCONFIG = optConfig;  // Konfiguration wird in startOptions ueberprueft!

    if (optSet === undefined) {
        optSet = new Options();
    }

    for (let opt in optConfig) {
        const __CONFIG = optConfig[opt];
        const __PREINIT = getValue(__CONFIG.PreInit, false, true);
        const __ISSHARED = getValue(__CONFIG.Shared, false, true);

        if ((preInit === undefined) || (__PREINIT === preInit)) {
            const __SHAREDCONFIG = getSharedConfig(__CONFIG, opt);
            const __ALTACTION = getValue(__SHAREDCONFIG.AltAction, __SHAREDCONFIG.Action);
            // Gab es vorher einen Aufruf, der einen Stub-Eintrag erzeugt hat, und wurden Daten geladen?
            const __LOADED = ((preInit === false) && optSet[opt].Loaded);
            const __PROMISE = ((__LOADED || ! optSet[opt]) ? undefined : optSet[opt].Promise);
            const __VALUE = (__LOADED ? optSet[opt].Value : undefined);

            optSet[opt] = {
                'Item'      : opt,
                'Config'    : __SHAREDCONFIG,
                'Loaded'    : (__ISSHARED || __LOADED),
                'Promise'   : __PROMISE,
                'Value'     : initOptValue(__SHAREDCONFIG, __VALUE),
                'SetValue'  : __SHAREDCONFIG.SetValue,
                'ReadOnly'  : (__ISSHARED || __SHAREDCONFIG.ReadOnly),
                'Action'    : initOptAction(__SHAREDCONFIG.Action, opt, optSet, __SHAREDCONFIG),
                'AltAction' : initOptAction(__ALTACTION, opt, optSet, __SHAREDCONFIG)
            };
        } else if (preInit) {  // erstmal nur Stub
            optSet[opt] = {
                'Item'      : opt,
                'Config'    : __CONFIG,
                'Loaded'    : false,
                'Promise'   : undefined,
                'Value'     : initOptValue(__CONFIG),
                'ReadOnly'  : (__ISSHARED || __CONFIG.ReadOnly)
            };
        }
    }

    return optSet;
}

// ==================== Abschnitt fuer Klasse Classification ====================

// Basisklasse fuer eine Klassifikation der Optionen nach Kriterium (z.B. Erst- und Zweitteam oder Fremdteam)

/*class*/ function Classification /*{
    constructor*/(prefix) {
        'use strict';

        this.renameFun = prefixName;
        this.prefix = (prefix || 'old');
        this.optSet = undefined;
        this.optParams = undefined;
        this.optSelect = { };
    }
//}

Class.define(Classification, Object, {
                    'assign'          : function(optSet, optParams) {
                                            this.optSet = optSet;
                                            this.optParams = optParams;
                                        },
                    'renameOptions'   : function() {
                                            const __PARAM = this.renameParamFun();

                                            if (__PARAM !== undefined) {
                                                // Klassifizierte Optionen umbenennen...
                                                return renameOptions(this.optSet, this.optSelect, __PARAM, this.renameFun);
                                            } else {
                                                return Promise.resolve();
                                            }
                                        },
                    'saveOptions'     : function(ignList) {
                                            const __OPTSELECT = optSelect(this.optSelect, ignList);

                                            return saveOptions(this.optSet, __OPTSELECT);
                                        },
                    'deleteOptions'   : function(ignList) {
                                            const __OPTSELECT = optSelect(this.optSelectl, ignList);

                                            return deleteOptions(this.optSet, __OPTSELECT, true, true);
                                        },
                    'prefixParamFun'  : function() {
                                            // Parameter fuer 'prefixName': Prefix "old:"
                                            return ((this.prefix !== undefined) ? this.prefix + ':' : this.prefix);
                                        },
                    'renameParamFun'  : function() {
                                            // Parameter fuer 'renameFun': Default ist 'prefixName' ("old:")
                                            return this.prefixParamFun();
                                        }
                });

// Wandelt ein Array von Options-Schluesseln (props) in das optSelect-Format { 'key1' : true, 'key2' : true, ... }
// props: Array von Keys
// return Mapping mit Eintraegen, in denen die Keys auf true gesetzt sind: { 'key1' : true, 'key2' : true, ... }
function optSelectFromProps(props) {
    const __RET = { };

    if (props) {
        props.map(item => (__RET[item] = true));
    }

    return __RET;
}

// Errechnet aus einer Ausswahlliste und einer Ignore-Liste eine resultierende Liste im optSelect-Format
// selList: Mapping von auf true gesetzten Eintraegen (optSelect), die eine Grundmenge darstellen
// ignList: Mapping von auf true gesetzten Eintraegen (optSelect), die aus obiger Liste ausgetragen werden sollen
// return Resultierendes Mapping mit Eintraegen (optSelect), in denen die Keys auf true gesetzt sind: { 'key1' : true, 'key2' : true, ... }
function optSelect(selList, ignList) {
    const __PROPS = addProps([], selList, null, ignList);

    return optSelectFromProps(__PROPS);
}

// ==================== Ende Abschnitt fuer Klasse Classification ====================

// ==================== Abschnitt fuer Klasse ClassificationPair ====================

// Klasse fuer die Klassifikation der Optionen nach Team (Erst- und Zweitteam oder Fremdteam)

/*class*/ function ClassificationPair /*extends Classification {
    constructor*/(classA, classB) {
        'use strict';

        Classification.call(this);

        this.prefix = undefined;

        this.A = classA;
        this.B = classB;

        // Zugriff auf optSelect synchronisieren...
        Object.defineProperty(this, 'optSelect', {
                        get : function() {
                                  const __A = getValue(this.A, { });
                                  const __B = getValue(this.B, { });

                                  return (this.A ? __A.optSelect : __B.optSelect);
                              },
                        set : function(optSelect) {
                                  const __A = getValue(this.A, { });
                                  const __B = getValue(this.B, { });

                                  __A.optSelect = optSelect;
                                  __B.optSelect = optSelect;

                                  return optSelect;
                              }
                    });

        // Zugriff auf optSet synchronisieren...
        Object.defineProperty(this, 'optSet', {
                        get : function() {
                                  const __A = getValue(this.A, { });
                                  const __B = getValue(this.B, { });

                                  return (this.A ? __A.optSet : __B.optSet);
                              },
                        set : function(optSet) {
                                  const __A = getValue(this.A, { });
                                  const __B = getValue(this.B, { });

                                  __A.optSet = optSet;
                                  __B.optSet = optSet;

                                  return optSet;
                              }
                    });
    }
//}

Class.define(ClassificationPair, Classification, {
                    'assign'          : function(optSet, optParams) {
                                            (this.A && this.A.assign(optSet, optParams));
                                            (this.B && this.B.assign(optSet, optParams));
                                        },
                    'renameOptions'  : function() {
                                           return (this.A ? this.A.renameOptions() : Promise.resolve()).then(() =>
                                                   (this.B ? this.B.renameOptions() : Promise.resolve()));
                                       },
                    'saveOptions'    : function(ignList) {
                                           return (this.A ? this.A.saveOptions(ignList) : Promise.resolve()).then(() =>
                                                   (this.B ? this.B.saveOptions(ignList) : Promise.resolve()));
                                       },
                    'deleteOptions'  : function(ignList) {
                                           return (this.A ? this.A.deleteOptions(ignList) : Promise.resolve()).then(() =>
                                                   (this.B ? this.B.deleteOptions(ignList) : Promise.resolve()));
                                       }
                });

// ==================== Ende Abschnitt fuer Klasse ClassificationPair ====================

    // Abhaengigkeiten:
    // ================
    // initOptions (PreInit):
    // restoreMemoryByOpt: PreInit oldStorage
    // getStoredCmds: restoreMemoryByOpt
    // runStoredCmds (beforeLoad): getStoredCmds
    // loadOptions (PreInit): PreInit
    // startMemoryByOpt: storage oldStorage
    // initScriptDB: startMemoryByOpt
    // initOptions (Rest): PreInit
    // getMyTeam callback (getOptPrefix): initTeam
    // __MYTEAM (initTeam): initOptions
    // renameOptions: getOptPrefix
    // runStoredCmds (afterLoad): getStoredCmds, renameOptions
    // loadOptions (Rest): PreInit/Rest runStoredCmds
    // updateScriptDB: startMemoryByOpt
    // showOptions: startMemoryByOpt renameOptions
    // buildOptionMenu: showOptions
    // buildOptionForm: showOptions

// Initialisiert die gesetzten Optionen und den Speicher und laedt die Optionen zum Start
// optConfig: Konfiguration der Optionen
// optSet: Platz fuer die gesetzten Optionen
// return Promise auf gefuelltes Objekt mit den gesetzten Optionen
async function startOptions(optConfig, optSet = undefined, classification = undefined) {
    // Ueberpruefung der uebergebenen Konfiguration der Optionen...
    const __OPTCONFIG = checkOptConfig(optConfig, true);
    const __PREOPTSET = initOptions(__OPTCONFIG, optSet, true);  // PreInit

    // Memory Storage fuer vorherige Speicherung...
    myOptMemSize = getMemSize(myOptMem = await restoreMemoryByOpt(__PREOPTSET.oldStorage));

    // Zwischengespeicherte Befehle auslesen...
    const __STOREDCMDS = getStoredCmds(myOptMem);

    // ... ermittelte Befehle ausfuehren...
    const __LOADEDCMDS = await runStoredCmds(__STOREDCMDS, __PREOPTSET, true);  // BeforeLoad

    // Bisher noch nicht geladenene Optionen laden...
    await loadOptions(__PREOPTSET);

    // Memory Storage fuer naechste Speicherung...
    myOptMemSize = getMemSize(myOptMem = startMemoryByOpt(__PREOPTSET.storage, __PREOPTSET.oldStorage));

    // Globale Daten ermitteln...
    initScriptDB(__PREOPTSET);

    const __OPTSET = initOptions(__OPTCONFIG, __PREOPTSET, false);  // Rest

    if (classification !== undefined) {
        // Umbenennungen durchfuehren...
        await classification.renameOptions();
    }

    // ... ermittelte Befehle ausfuehren...
    await runStoredCmds(__LOADEDCMDS, __OPTSET, false);  // Rest

    // Als globale Daten speichern...
    updateScriptDB(__OPTSET);

    return __OPTSET;
}

// ==================== Abschnitt Anzeige der Optionen ====================

// Installiert die Visualisierung und Steuerung der Optionen
// optSet: Platz fuer die gesetzten Optionen
// optParams: Eventuell notwendige Parameter zur Initialisierung
// 'hideMenu': Optionen werden zwar geladen und genutzt, tauchen aber nicht im Benutzermenu auf
// 'menuAnchor': Startpunkt fuer das Optionsmenu auf der Seite
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// 'formWidth': Anzahl der Elemente pro Zeile
// 'formBreak': Elementnummer des ersten Zeilenumbruchs
// return Liefert die gesetzten Optionen zurueck
function showOptions(optSet = undefined, optParams = { 'hideMenu' : false }) {
    // Anzeige im Benutzermenue...
    if (! optParams.hideMenu) {
        buildOptionMenu(optSet).then(() => __LOG[4]("Menu OK"));
    }

    // Anzeige auf der Seite...
    if ((optParams.menuAnchor !== undefined) && (myOptMem !== __OPTMEMINACTIVE)) {
        buildOptionForm(optParams.menuAnchor, optSet, optParams);
    }

    return optSet;
}

// ==================== Ende Abschnitt fuer Aufbau und Start der Optionen ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.option.run.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.main.js ***/

// ==UserModule==
// _name         util.main
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017/2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer das Hauptprogramm zur jeweiligen Seite
// _require      https://eselce.github.io/OS2.scripts/lib/util.main.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Aufbau und Start des Hauptprogramms ====================

// ==================== Abschnitt fuer Klasse Main ====================

/*class*/ function Main /*{
    constructor*/(optConfig, mainConfig, ... pageManager) {
        const __MAINCONFIG = (mainConfig || { });

        this.optConfig      = optConfig;
        this.optSet         = new Options(this.optConfig, '__OPTSET');
        this.setupManager   = __MAINCONFIG.setupManager;
        this.checkOptParams = __MAINCONFIG.checkOptParams;
        this.prepareOpt     = __MAINCONFIG.prepareOpt;
        this.verifyOpt      = __MAINCONFIG.verifyOpt;
        this.pageManager    = pageManager;
    }
//}

Class.define(Main, Object, {
        'handlePage'  : async function(page) {
                            // Fuehrt die Bearbeitung einer speziellen Seite durch
                            // page: ID fuer die aktuelle Seite
                            // return Promise auf die Durchfuehrung der Bearbeitung
                            const __SETUPMANAGER    = (this.setupManager || (page => this.pageManager[page]));
                            const __MANAGER         = getValue(__SETUPMANAGER.call(this, page), { name : "Seite #" + page, params : [] });
                            const __SETUPOPTPARAMS  = (__MANAGER.setupOptParams || (() => ({ 'hideMenu' : false })));
                            const __OPTPARAMS       = __SETUPOPTPARAMS.call(__MANAGER, this.optSet, ... __MANAGER.params);
                            const __CHECKOPTPARAMS  = (this.checkOptParams || (optParams => !! optParams));

                            if (__CHECKOPTPARAMS(__OPTPARAMS, __MANAGER)) {
                                const __CLASSIFICATION  = (__MANAGER.classification || (new Classification()));
                                const __HANDLER         = __MANAGER.handler;

                                if (! __HANDLER) {
                                    return Promise.reject(`Kein Seiten-Handler f\u00FCr '${__MANAGER.name}' vorhanden!`);
                                }

                                __LOG[2](`${__DBMOD.Name}: Starte Seiten-Verarbeitung f\u00FCr '${__MANAGER.name}'...`);

                                // Klassifikation verknuepfen...
                                __CLASSIFICATION.assign(this.optSet, __OPTPARAMS);

                                // Parameter im Handler verfuegbar machen...
                                __MANAGER.classification = __CLASSIFICATION;
                                __MANAGER.optParams = __OPTPARAMS;

                                return await startOptions(this.optConfig, this.optSet, __CLASSIFICATION).then(
                                        async optSet => {
                                                const __PREPAREOPT  = (__OPTPARAMS.prepareOpt || this.prepareOpt || sameValue);
                                                const __VERIFYOPT   = (__OPTPARAMS.verifyOpt || this.verifyOpt || checkOptSet);

                                                return await Promise.resolve(__PREPAREOPT(optSet, __OPTPARAMS)).then(
                                                                            optSet => Promise.resolve(showOptions(optSet, __OPTPARAMS)).then(
                                                                            optSet => __VERIFYOPT(optSet, __OPTPARAMS)));
                                            }).then(optSet => __HANDLER.call(__MANAGER, optSet, ... __MANAGER.params)).then(
                                                                            ret => ((ret ? 'OK' : 'FAILED') + ' ' + __MANAGER.name));
                            } else {
                                return Promise.reject(`Keine Options-Parameter f\u00FCr Seite '${__MANAGER.name}' vorhanden!`);
                            }
                        },
        'run'         : async function(selector, ... selectorParams) {
                            // Fuehrt die Bearbeitung zu einer selektierten Seite durch
                            // selector: Funktion zur Selektion aufgrund der als erstem Parameter uebergebenen URL der Seite
                            // selectorParams: Weitere Parameter fuer selector(URL, ...)
                            // return Promise auf die Durchfuehrung der Bearbeitung im Hauptprogramm
                            return await startMain().then(
                                    async () => {
                                            try {
                                                const __SELECTOR = (selector || (() => 0));
                                                const __SELECTORPARAMS = selectorParams;
                                                const __PAGE = __SELECTOR(window.location.href, ... __SELECTORPARAMS);

                                                return this.handlePage(__PAGE).catch(defaultCatch);
                                            } catch (ex) {
                                                return defaultCatch(ex);
                                            }
                                        }).then(rc => {
                                                const __RC = rc;

                                                __LOG[2](String(this.optSet));
                                                __LOG[1]('SCRIPT END', __DBMOD.Name, '(' + __RC + ')', '/', __DBMAN.Name);

                                                return Promise.resolve(__RC);
                                            }, ex => {
                                                const __ERRMSG = (ex && getValue(ex[0], ex.message,
                                                            ((typeof ex) === 'string') ? ex : (ex[0] + ": " + ex[1])));

                                                __LOG[1]('SCRIPT ERROR', __DBMOD.Name, '(' + __ERRMSG + ')');
                                                __LOG[2](String(this.optSet));
                                                __LOG[1]('SCRIPT END', __DBMAN.Name);

                                                return Promise.reject(__ERRMSG);
                                            });
                        }
    });

// ==================== Ende Abschnitt fuer Klasse Main ====================

// ==================== Abschnitt fuer Klasse PageManager ====================

/*class*/ function PageManager /*{
    constructor*/(pageName, classification, setupOptParams, pageHandler, ... params) {
        this.name           = pageName;
        this.classification = classification;
        this.setupOptParams = setupOptParams;
        this.handler        = pageHandler;
        this.params         = (params || []);
    }
//}

Class.define(PageManager, Object, {
        'clone'       : function(... params) {
                            const __PARAMS = this.params.concat(params || []);

                            return new PageManager(this.name + " (" + params.join(", ") + ')',
                                                    this.classification, this.setupOptParams,
                                                    this.handler, ... __PARAMS);
                        }
    });

// ==================== Ende Abschnitt fuer Klasse PageManager ====================

// ==================== Ende Abschnitt fuer Aufbau und Start des Hauptprogramms ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/util.main.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.list.js ***/

// ==UserModule==
// _name         OS2.list
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities zu OS2-spezifischen Listen
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.list.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer interne IDs auf den Seiten ====================

const __GAMETYPENRN = {    // 'Blind FSS gesucht!'
        'unbekannt'  : -1,
        'reserviert' :  0,
        'Frei'       :  0,
        'spielfrei'  :  0,
        'Friendly'   :  1,
        'Liga'       :  2,
        'LP'         :  3,
        'OSEQ'       :  4,
        'OSE'        :  5,
        'OSCQ'       :  6,
        'OSC'        :  7,
        'Supercup'   : 10
    };
const __GAMETYPES = reverseArray(__GAMETYPENRN);

const __GAMETYPEALIASES = {
        'unbekannt'  :  'unbekannt',
        'reserviert' :  undefined,
        'Frei'       :  undefined,
        'spielfrei'  :  "",
        'Friendly'   :  'FSS',
        'Liga'       :  undefined,
        'LP'         :  'Pokal',
        'OSEQ'       :  undefined,
        'OSE'        :  undefined,
        'OSCQ'       :  undefined,
        'OSC'        :  undefined,
        'Supercup'   : 'Super'
    };

const __LIGANRN = {
        'unbekannt'  :  0,
        '1. Liga'    :  1,
        '2. Liga A'  :  2,
        '2. Liga B'  :  3,
        '3. Liga A'  :  4,
        '3. Liga B'  :  5,
        '3. Liga C'  :  6,
        '3. Liga D'  :  7
    };
const __LIGANAMES = reverseArray(__LIGANRN);

const __LANDNRN = {
        'unbekannt'              :   0,
        'Albanien'               :  45,
        'Andorra'                :  95,
        'Armenien'               :  83,
        'Aserbaidschan'          : 104,
        'Belgien'                :  12,
        'Bosnien-Herzegowina'    :  66,
        'Bulgarien'              :  42,
        'D\u00E4nemark'          :   8,
        'Deutschland'            :   6,
        'England'                :   1,
        'Estland'                :  57,
        'Far\u00F6er'            :  68,
        'Finnland'               :  40,
        'Frankreich'             :  32,
        'Georgien'               :  49,
        'Griechenland'           :  30,
        'Irland'                 :   5,
        'Island'                 :  29,
        'Israel'                 :  23,
        'Italien'                :  10,
        'Kasachstan'             : 105,
        'Kroatien'               :  24,
        'Lettland'               :  97,
        'Liechtenstein'          :  92,
        'Litauen'                :  72,
        'Luxemburg'              :  93,
        'Malta'                  :  69,
        'Mazedonien'             :  86,
        'Moldawien'              :  87,
        'Niederlande'            :  11,
        'Nordirland'             :   4,
        'Norwegen'               :   9,
        '\u00D6sterreich'        :  14,
        'Polen'                  :  25,
        'Portugal'               :  17,
        'Rum\u00E4nien'          :  28,
        'Russland'               :  19,
        'San Marino'             :  98,
        'Schottland'             :   2,
        'Schweden'               :  27,
        'Schweiz'                :  37,
        'Serbien und Montenegro' :  41,
        'Slowakei'               :  70,
        'Slowenien'              :  21,
        'Spanien'                :  13,
        'Tschechien'             :  18,
        'T\u00FCrkei'            :  39,
        'Ukraine'                :  20,
        'Ungarn'                 :  26,
        'Wales'                  :   3,
        'Weissrussland'          :  71,
        'Zypern'                 :  38
    };
const __LAENDER = reverseArray(__LANDNRN);

const __TLALAND = {
        undefined : 'unbekannt',
        'ALB'     : 'Albanien',
        'AND'     : 'Andorra',
        'ARM'     : 'Armenien',
        'AZE'     : 'Aserbaidschan',
        'BEL'     : 'Belgien',
        'BIH'     : 'Bosnien-Herzegowina',
        'BUL'     : 'Bulgarien',
        'DEN'     : 'D\u00E4nemark',
        'GER'     : 'Deutschland',
        'ENG'     : 'England',
        'EST'     : 'Estland',
        'FRO'     : 'Far\u00F6er',
        'FIN'     : 'Finnland',
        'FRA'     : 'Frankreich',
        'GEO'     : 'Georgien',
        'GRE'     : 'Griechenland',
        'IRL'     : 'Irland',
        'ISL'     : 'Island',
        'ISR'     : 'Israel',
        'ITA'     : 'Italien',
        'KAZ'     : 'Kasachstan',
        'CRO'     : 'Kroatien',
        'LVA'     : 'Lettland',
        'LIE'     : 'Liechtenstein',
        'LTU'     : 'Litauen',
        'LUX'     : 'Luxemburg',
        'MLT'     : 'Malta',
        'MKD'     : 'Mazedonien',
        'MDA'     : 'Moldawien',
        'NED'     : 'Niederlande',
        'NIR'     : 'Nordirland',
        'NOR'     : 'Norwegen',
        'AUT'     : '\u00D6sterreich',
        'POL'     : 'Polen',
        'POR'     : 'Portugal',
        'ROM'     : 'Rum\u00E4nien',
        'RUS'     : 'Russland',
        'SMR'     : 'San Marino',
        'SCO'     : 'Schottland',
        'SWE'     : 'Schweden',
        'SUI'     : 'Schweiz',
        'SCG'     : 'Serbien und Montenegro',
        'SVK'     : 'Slowakei',
        'SVN'     : 'Slowenien',
        'ESP'     : 'Spanien',
        'CZE'     : 'Tschechien',
        'TUR'     : 'T\u00FCrkei',
        'UKR'     : 'Ukraine',
        'HUN'     : 'Ungarn',
        'WAL'     : 'Wales',
        'BLR'     : 'Weissrussland',
        'CYP'     : 'Zypern'
    };
const __LANDTLAS = reverseMapping(__TLALAND);

const __TLALIGASIZE = {
        undefined : 10,
        'ALB'     : 10,
        'AND'     : 10,
        'ARM'     : 10,
        'AZE'     : 10,
        'BEL'     : 18,
        'BIH'     : 10,
        'BUL'     : 10,
        'DEN'     : 10,
        'GER'     : 18,
        'ENG'     : 20,
        'EST'     : 10,
        'FRO'     : 10,
        'FIN'     : 10,
        'FRA'     : 18,
        'GEO'     : 10,
        'GRE'     : 18,
        'IRL'     : 10,
        'ISL'     : 10,
        'ISR'     : 10,
        'ITA'     : 18,
        'KAZ'     : 10,
        'CRO'     : 10,
        'LVA'     : 10,
        'LIE'     : 10,
        'LTU'     : 10,
        'LUX'     : 10,
        'MLT'     : 10,
        'MKD'     : 10,
        'MDA'     : 10,
        'NED'     : 18,
        'NIR'     : 10,
        'NOR'     : 10,
        'AUT'     : 10,
        'POL'     : 10,
        'POR'     : 18,
        'ROM'     : 10,
        'RUS'     : 18,
        'SMR'     : 10,
        'SCO'     : 10,
        'SWE'     : 10,
        'SUI'     : 10,
        'SCG'     : 10,
        'SVK'     : 10,
        'SVN'     : 10,
        'ESP'     : 20,
        'CZE'     : 10,
        'TUR'     : 18,
        'UKR'     : 10,
        'HUN'     : 10,
        'WAL'     : 10,
        'BLR'     : 10,
        'CYP'     : 10
    };
const __LIGASIZETLAS = reverseMapping(__TLALIGASIZE, mappingPush);

// ==================== Ende Abschnitt fuer interne IDs auf den Seiten ====================

// ==================== Abschnitt fuer interne IDs des OS-Spielplans auf den Seiten ====================

const __COLINTSPIELPLAN = {
        'Rd'        : 0,
        'IdOSE'     : 1,
        'IdOSC'     : 2,
        'ZAT_S2'    : 3,    // 0,
        'ZAT'       : 4,    // 1,
        'LabOSE'    : 5,    // 2,
        'LabOSC'    : 6,    // 3,
        'Lfd'       : 7,
        'CupOSE'    : 8,    // 4,
        'CupOSC'    : 9,    // 5,
        'EvtOSE'    : 10,   // 6,
        'EvtOSC'    : 11,   // 7,
        'RndOSE'    : 12,   // 8,
        'RndOSC'    : 13,   // 9,
        'HROSE'     : 14,   // 10,
        'HROSC'     : 15,   // 11,
        'EtOSE'     : 16,
        'EtOSC'     : 17,
        'Et2OSE'    : 18,
        'Et2OSC'    : 19,
        'IntOSE'    : 20,   // 12,
        'IntOSC'    : 21    // 13
    };

const __INTSPIELPLAN = {
        // Id : Rd OSE OSC ZAT2 ZAT LabOSE                      LabOSC                     Lfd  CupOSE  CupOSC  EvtOSE  EvtOSC      RndOSE              RndOSC             HROSE/C EtOSE/C Et2OSE/C IntOSE              IntOSC
        1   : [ 1,  0,  0,  0,  0,  'Saisonstart',              'Saisonstart',              1,  'OSEQ', 'OSCQ', 'OSEQ', 'OSCQ',     '',                 '',                 0,  0,  1,  1,  1,  1,  '',                 ''              ],
        2   : [ 2,  1,  1,  4,  5,  '1. Quali Hin',             '1. Quali Hin',             2,  'OSEQ', 'OSCQ', 'OSEQ', 'OSCQ',     'Runde 1',          'Runde 1',          1,  1,  1,  1,  1,  1,  '1. Runde',         '1. Runde'      ],
        3   : [ 3,  1,  1,  6,  7,  '1. Quali R\u00FCck',       '1. Quali R\u00FCck',       3,  'OSEQ', 'OSCQ', 'OSEQ', 'OSCQ',     'Runde 1',          'Runde 1',          2,  2,  1,  1,  1,  1,  '1. Runde',         '1. Runde'      ],
        4   : [ 4,  2,  2,  10, 11, '2. Quali Hin',             '2. Quali Hin',             4,  'OSEQ', 'OSCQ', 'OSEQ', 'OSCQ',     'Runde 2',          'Runde 2',          1,  1,  1,  1,  1,  1,  '2. Runde',         '2. Runde'      ],
        5   : [ 5,  2,  2,  14, 13, '2. Quali R\u00FCck',       '2. Quali R\u00FCck',       5,  'OSEQ', 'OSCQ', 'OSEQ', 'OSCQ',     'Runde 2',          'Runde 2',          2,  2,  1,  1,  1,  1,  '2. Runde',         '2. Runde'      ],
        6   : [ 0,  0,  10, 16, 17, '',                         '',                         8,  '',     'OSC',  '',     'OSC-HR',   '',                 '',                 0,  0,  0,  2,  0,  2,  '',                 ''              ],
        7   : [ 0,  0,  10, 36, 31, '',                         '',                         13, '',     'OSC',  '',     'OSC-HR',   '',                 '',                 0,  0,  0,  2,  0,  2,  '',                 ''              ],
        8   : [ 6,  3,  11, 16, 17, '3. Quali Hin',             '1. Gruppenspiel',          8,  'OSEQ', 'OSC',  'OSEQ', 'OSC-HR',   'Runde 3',          'Spiel 1',          1,  1,  1,  2,  1,  2,  '3. Runde',         '1. Runde'      ],  // 1. Spiel
        9   : [ 7,  3,  12, 22, 19, '3. Quali R\u00FCck',       '2. Gruppenspiel',          9,  'OSEQ', 'OSC',  'OSEQ', 'OSC-HR',   'Runde 3',          'Spiel 2',          2,  1,  1,  2,  1,  2,  '3. Runde',         '1. Runde'      ],  // 2. Spiel
        10  : [ 8,  11, 13, 24, 23, '1. Runde Hin',             '3. Gruppenspiel',          10, 'OSE',  'OSC',  'OSE',  'OSC-HR',   'Runde 1',          'Spiel 3',          1,  1,  2,  2,  2,  2,  '1. Runde',         '1. Runde'      ],  // 3. Spiel
        11  : [ 9,  11, 14, 26, 25, '1. Runde R\u00FCck',       '4. Gruppenspiel',          11, 'OSE',  'OSC',  'OSE',  'OSC-HR',   'Runde 1',          'Spiel 4',          2,  2,  2,  2,  2,  2,  '1. Runde',         '1. Runde'      ],  // 4. Spiel
        12  : [ 10, 12, 15, 34, 29, '2. Runde Hin',             '5. Gruppenspiel',          12, 'OSE',  'OSC',  'OSE',  'OSC-HR',   'Runde 2',          'Spiel 5',          1,  2,  3,  2,  3,  2,  '2. Runde',         '1. Runde'      ],  // 5. Spiel
        13  : [ 11, 12, 16, 36, 31, '2. Runde R\u00FCck',       '6. Gruppenspiel',          13, 'OSE',  'OSC',  'OSE',  'OSC-HR',   'Runde 2',          'Spiel 6',          2,  2,  3,  2,  3,  2,  '2. Runde',         '1. Runde'      ],  // 6. Spiel
        14  : [ 0,  0,  20, 38, 35, '',                         '',                         16, '',     'OSC',  '',     'OSC-ZR',   '',                 '',                 0,  0,  0,  3,  0,  3,  '',                 ''              ],
        15  : [ 0,  0,  20, 54, 49, '',                         '',                         21, '',     'OSC',  '',     'OSC-ZR',   '',                 '',                 0,  0,  0,  3,  0,  3,  '',                 ''              ],
        16  : [ 12, 13, 21, 38, 35, '3. Runde Hin',             '7. Gruppenspiel',          16, 'OSE',  'OSC',  'OSE',  'OSC-ZR',   'Runde 3',          'Spiel 1',          1,  1,  3,  3,  3,  3,  '3. Runde',         '2. Runde'      ],  // 1. Spiel
        17  : [ 13, 13, 22, 42, 37, '3. Runde R\u00FCck',       '8. Gruppenspiel',          17, 'OSE',  'OSC',  'OSE',  'OSC-ZR',   'Runde 3',          'Spiel 2',          2,  1,  3,  3,  3,  3,  '3. Runde',         '2. Runde'      ],  // 2. Spiel
        18  : [ 14, 14, 23, 44, 41, '4. Runde Hin',             '9. Gruppenspiel',          18, 'OSE',  'OSC',  'OSE',  'OSC-ZR',   'Runde 4',          'Spiel 3',          1,  1,  3,  3,  3,  3,  '4. Runde',         '2. Runde'      ],  // 3. Spiel
        19  : [ 15, 14, 24, 50, 43, '4. Runde R\u00FCck',       '10. Gruppenspiel',         19, 'OSE',  'OSC',  'OSE',  'OSC-ZR',   'Runde 4',          'Spiel 4',          2,  2,  3,  3,  3,  3,  '4. Runde',         '2. Runde'      ],  // 4. Spiel
        20  : [ 16, 21, 25, 52, 47, 'Achtelfinale Hin',         '11. Gruppenspiel',         20, 'OSE',  'OSC',  'OSE',  'OSC-ZR',   'Achtelfinale',     'Spiel 5',          1,  2,  4,  3,  4,  3,  '5. Runde',         '2. Runde'      ],  // 5. Spiel
        21  : [ 17, 21, 26, 54, 49, 'Achtelfinale R\u00FCck',   '12. Gruppenspiel',         21, 'OSE',  'OSC',  'OSE',  'OSC-ZR',   'Achtelfinale',     'Spiel 6',          2,  2,  4,  3,  4,  3,  '5. Runde',         '2. Runde'      ],  // 6. Spiel
        22  : [ 0,  0,  30, 56, 53, '',                         '',                         24, '',     'OSC',  '',     'OSC-FR',   '',                 '',                 0,  0,  0,  4,  0,  4,  '',                 ''              ],
        23  : [ 0,  0,  30, 70, 71, '',                         '',                         28, '',     'OSC',  '',     'OSC-FR',   '',                 '',                 0,  0,  0,  4,  0,  4,  '',                 ''              ],
        24  : [ 18, 31, 31, 56, 53, 'Viertelfinale Hin',        'Viertelfinale Hin',        24, 'OSE',  'OSC',  'OSE',  'OSC-FR',   'Viertelfinale',    'Viertelfinale',    1,  1,  4,  4,  5,  4,  '6. Runde',         '3. Runde'      ],
        25  : [ 19, 31, 31, 60, 55, 'Viertelfinale R\u00FCck',  'Viertelfinale R\u00FCck',  25, 'OSE',  'OSC',  'OSE',  'OSC-FR',   'Viertelfinale',    'Viertelfinale',    2,  2,  4,  4,  5,  4,  '6. Runde',         '3. Runde'      ],
        26  : [ 20, 32, 32, 62, 59, 'Halbfinale Hin',           'Halbfinale Hin',           26, 'OSE',  'OSC',  'OSE',  'OSC-FR',   'Halbfinale',       'Halbfinale',       1,  1,  4,  4,  5,  4,  '7. Runde',         '4. Runde'      ],
        27  : [ 21, 32, 32, 66, 61, 'Halbfinale R\u00FCck',     'Halbfinale R\u00FCck',     27, 'OSE',  'OSC',  'OSE',  'OSC-FR',   'Halbfinale',       'Halbfinale',       2,  2,  4,  4,  5,  4,  '7. Runde',         '4. Runde'      ],
        28  : [ 22, 33, 33, 70, 71, 'Finale',                   'Finale',                   28, 'OSE',  'OSC',  'OSE',  'OSC-FR',   'Finale',           'Finale',           0,  0,  4,  4,  5,  4,  '8. Runde',         '5. Runde'      ],
        29  : [ 23, 40, 40, 99, 99, 'Saisonende',               'Saisonende',               28, 'OSE',  'OSC',  'OSE',  'OSC-FR',   'Sieger',           'Sieger',           0,  0,  4,  4,  5,  4,  'Sieger',           'Sieger'        ]
    };

const __INTZATLABOSE = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.ZAT, __COLINTSPIELPLAN.LabOSE);
const __INTZATLABOSC = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.ZAT, __COLINTSPIELPLAN.LabOSC);
const __INTLABOSEZAT = reverseMapping(__INTZATLABOSE);
const __INTLABOSCZAT = reverseMapping(__INTZATLABOSC);
const __INTZATIDOSE = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.ZAT, __COLINTSPIELPLAN.IdOSE, Number);
const __INTZATIDOSC = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.ZAT, __COLINTSPIELPLAN.IdOSC, Number);
const __INTOSEALLZATS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.EvtOSE, __COLINTSPIELPLAN.ZAT, mappingPushFun(Number));
const __INTOSCALLZATS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.EvtOSC, __COLINTSPIELPLAN.ZAT, mappingPushFun(Number));
const __INTOSECUPS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSE, __COLINTSPIELPLAN.CupOSE, mappingPush);
const __INTOSCCUPS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSC, __COLINTSPIELPLAN.CupOSC, mappingPush);
const __INTOSEEVTS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSE, __COLINTSPIELPLAN.EvtOSE, mappingPush);
const __INTOSCEVTS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSC, __COLINTSPIELPLAN.EvtOSC, mappingPush);
const __INTOSEZATS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSE, __COLINTSPIELPLAN.ZAT, mappingPushFun(Number));
const __INTOSCZATS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSC, __COLINTSPIELPLAN.ZAT, mappingPushFun(Number));

const __OSCRUNDEN = {
        0   : 'Saisonstart',
        1   : '1. Runde Quali',
        2   : '2. Runde Quali',
        3   : 'Sieger Quali',
        10  : 'Hauptrunde',     // '1. Hauptrunde'
        11  : 'HR Spiel 1',
        12  : 'HR Spiel 2',
        13  : 'HR Spiel 3',
        14  : 'HR Spiel 4',
        15  : 'HR Spiel 5',
        16  : 'HR Spiel 6',
        20  : 'Zwischenrunde',  // '2. Hauptrunde'
        21  : 'ZR Spiel 1',
        22  : 'ZR Spiel 2',
        23  : 'ZR Spiel 3',
        24  : 'ZR Spiel 4',
        25  : 'ZR Spiel 5',
        26  : 'ZR Spiel 6',
        31  : 'Viertelfinale',
        32  : 'Halbfinale',
        33  : 'Finale',
        34  : 'OSC-Sieger',
        40  : 'Saisonende'
    };
const __OSERUNDEN = {
        0   : 'Saisonstart',
        1   : '1. Runde Quali',
        2   : '2. Runde Quali',
        3   : '3. Runde Quali',
        4   : 'Sieger Quali',
        11  : '1. Runde',
        12  : '2. Runde',
        13  : '3. Runde',
        14  : '4. Runde',
        21  : 'Achtelfinale',
        31  : 'Viertelfinale',
        32  : 'Halbfinale',
        33  : 'Finale',
        34  : 'OSE-Sieger',
        40  : 'Saisonende'
    };

// Beschreibungstexte aller Runden...
const __POKALRUNDEN = [ "", '1. Runde', '2. Runde', '3. Runde', 'Achtelfinale', 'Viertelfinale', 'Halbfinale', 'Finale', 'Pokalsieger' ];
const __QUALIRUNDEN = [ "", 'Quali 1', 'Quali 2', 'Quali 3' ];
const __OSCKORUNDEN = [ "", 'Viertelfinale', 'Halbfinale', 'Finale', 'OSC-Sieger' ];
const __OSEKORUNDEN = [ "", 'Runde 1', 'Runde 2', 'Runde 3', 'Runde 4', 'Achtelfinale', 'Viertelfinale', 'Halbfinale', 'Finale', 'OSE-Sieger' ];
const __OSCALLRND   = [ "", '1. Runde Quali', '2. Runde Quali', '1. Hauptrunde', '2. Hauptrunde', 'Viertelfinale', 'Halbfinale', 'Finale', 'OSC-Sieger' ];
const __OSEALLRND   = [ "", '1. Runde Quali', '2. Runde Quali', '3. Runde Quali', '1. Runde', '2. Runde', '3. Runde', '4. Runde', 'Achtelfinale', 'Viertelfinale', 'Halbfinale', 'Finale', 'OSE-Sieger' ];
const __HINRUECK    = [ " Hin", " R\u00FCck", "" ];

// Ermittlung von Spielrunden...
const __RUNDEPOKAL  = reverseMapping(__POKALRUNDEN, Number);
const __RUNDEQUALI  = reverseMapping(__QUALIRUNDEN, Number);
const __KORUNDEOSC  = reverseMapping(__OSCKORUNDEN, Number);
const __KORUNDEOSE  = reverseMapping(__OSEKORUNDEN, Number);
const __ALLRNDOSC   = reverseMapping(__OSCALLRND, Number);
const __ALLRNDOSE   = reverseMapping(__OSEALLRND, Number);

const __HINRUECKHIN     = 0;
const __HINRUECKRUECK   = 1;
const __HINRUECKNULL    = 2;

// ==================== Ende Abschnitt fuer interne IDs des OS-Spielplans auf den Seiten ====================

// ==================== Abschnitt fuer Daten des Spielplans ====================

// Gibt die ID fuer den Namen eines Wettbewerbs zurueck
// gameType: Name des Wettbewerbs eines Spiels
// defValue: Default-Wert
// return OS2-ID fuer den Spieltyp (1 bis 7 oder 10), 0 fuer 'spielfrei'/'Frei'/'reserviert', -1 fuer ungueltig
function getGameTypeID(gameType, defValue = __GAMETYPENRN.unbekannt) {
    return getValue(__GAMETYPENRN[gameType], defValue);
}

// Gibt den Namen eines Wettbewerbs zurueck
// id: OS2-ID des Wettbewerbs eines Spiels (1 bis 7 oder 10), 0 fuer 'spielfrei'/'Frei'/'reserviert', -1 fuer ungueltig
// defValue: Default-Wert
// return Spieltyp fuer die uebergebene OS2-ID
function getGameType(id, defValue) {
    return getValue(__GAMETYPES[id], defValue);
}

// Gibt den alternativen (Kurznamen) fuer den Namen eines Wettbewerbs zurueck
// gameType: Name des Wettbewerbs eines Spiels
// return Normalerweise den uebergebenen Parameter, in Einzelfaellen eine Kurzversion
function getGameTypeAlias(gameType) {
    return getValue(__GAMETYPEALIASES[gameType], getValue(gameType, __GAMETYPEALIASES.unbekannt));
}

// Gibt den Namen des Landes mit dem uebergebenen Kuerzel (TLA) zurueck.
// tla: Kuerzel (TLA) des Landes
// defValue: Default-Wert
// return Name des Landes, 'unbekannt' fuer undefined
function getLandName(tla, defValue = __TLALAND.undefined) {
    return getValue(__TLALAND[tla], defValue);
}

// Gibt den Namen des Landes mit der uebergebenen ID zurueck.
// ID: OS2-ID des Landes
// defValue: Default-Wert
// return Name der Landes, 'unbekannt' fuer ungueltig
function getLandNameById(ID, defValue = __LAENDER[0]) {
    return getValue(__LAENDER[ID], defValue);
}

// Gibt die ID des Landes mit dem uebergebenen Namen zurueck.
// land: Name des Landes
// defValue: Default-Wert
// return OS2-ID des Landes, 0 fuer ungueltig
function getLandNr(land, defValue = __LANDNRN.unbekannt) {
    return getValue(__LANDNRN[land], defValue);
}

// Gibt die TLA des Landes mit dem uebergebenen Namen zurueck.
// land: Name des Landes
// defValue: Default-Wert
// return TLA des Landes, undefined fuer ungueltig
function getLandTLA(land, defValue = __LANDTLAS.unbekannt) {
    return getValue(__LANDTLAS[land], defValue);
}

// Gibt die ID der Liga mit dem uebergebenen Namen zurueck.
// liga: Name der Liga
// defValue: Default-Wert
// return OS2-ID der Liga, 0 fuer ungueltig
function getLigaNr(liga, defValue = __LIGANRN.unbekannt) {
    return getValue(__LIGANRN[liga], defValue);
}

// Gibt den Namen einer per ID uebergebenen Liga zurueck.
// ID: OS2-ID der Liga
// defValue: Default-Wert
// return Name der Liga, 'unbekannt' fuer ungueltig
function getLigaName(ID, defValue = __LIGANAMES[0]) {
    return getValue(__LIGANAMES[ID], defValue);
}

// Gibt die Ligengroesse des Landes mit dem uebergebenen Kuerzel (TLA) zurueck.
// tla: Kuerzel (TLA) des Landes
// defValue: Default-Wert (__TLALIGASIZE[undefined])
// return Ligengroesse des Landes (10/18/20), defaultValue fuer unbekannt
function getLigaSizeByTLA(tla, defValue = __TLALIGASIZE.undefined) {
    return getValue(__TLALIGASIZE[tla], defValue);
}

// Gibt die Ligengroesse des Landes mit dem uebergebenen Namen zurueck.
// land: Name des Landes
// defValue: Default-Wert (__TLALIGASIZE[undefined])
// return Ligengroesse des Landes (10/18/20), defaultValue fuer unbekannt
function getLigaSize(land, defValue = __TLALIGASIZE.undefined) {
    return getLigaSizeByTLA(__LANDTLAS[land], defValue);
}

// Gibt die Ligengroesse des Landes mit der uebergebenen ID zurueck.
// ID: OS2-ID des Landes
// defValue: Default-Wert (__TLALIGASIZE[undefined])
// return Ligengroesse des Landes (10/18/20), defaultValue fuer unbekannt
function getLigaSizeById(ID, defValue = __TLALIGASIZE.undefined) {
    return getValue(__LAENDER[ID], defValue);
}

// Gibt den ZAT, das Event und den Link einer internationalen Runde zurueck.
// TODO Diese Version ist beschraenkt auf Saisons ab der 3. Saison!
// searchCup: Gesuchter Wettbewerb ('OSC', 'OSCQ', 'OSE', 'OSEQ')
// searchRunde: Gesuchte Runde im Wettbewerb ('1. Runde', ...)
// currZAT: Der aktuelle ZAT (fuer die Frage, ob vergangene oder kommende Runde)
// lastRnd: Letzte Runde finden (statt erreichter Runde): Ergebnisse liegen in der Vergangenheit
// return ZAT, Event der Runde und deren OS2-Webseite der erreichten (bzw. vergangenen) Runde
function calcZATEventByCupRunde(searchCup, searchRunde, currZAT, lastRnd) {
    const __CUP = searchCup;
    const __RUNDE = searchRunde;
    const __CURRZAT = currZAT;
    const __LASTRND = lastRnd;
    const __CUPS = getArrValue(__INTOSECUPS, __RUNDE).concat(
                        getArrValue(__INTOSCCUPS, __RUNDE));
    const __EVTS = getArrValue(__INTOSEEVTS, __RUNDE).concat(
                        getArrValue(__INTOSCEVTS, __RUNDE));
    const __ZATS = getArrValue(__INTOSEZATS, __RUNDE).concat(
                        getArrValue(__INTOSCZATS, __RUNDE));
    let ret = [ -1, __CUP, null ];  // nicht gefunden

    __CUPS.forEach((cup, index) => {
            if (cup === __CUP) {
                const __ZAT = getValue(__ZATS[index]);
                const __EVT = getValue(__EVTS[index]);

                if ((! ~ ret[0]) || (ret[0] <= __CURRZAT)) {  // in der Zukunft nur den ersten Treffer...
                    if ((! __LASTRND) || (__ZAT <= __CURRZAT)) {  // bei __LASTRND keine zukuenftigen Runden...
                        ret = [ __ZAT, __EVT, __EVT.toLowerCase() + '.php' ];
                    }
                }
            }
        });

    return ret;
}

// ==================== Abschnitt fuer Daten des Spielplans ====================

// ==================== Abschnitt fuer Skilltypen, Skills und Spielreihen ====================

// Schaut nach, ob der uebergebene Index zu einem trainierbaren Skill gehoert
// Die Indizes gehen von 0 (SCH) bis 16 (EIN)
function isTrainableSkill(idx) {
    const __TRAINABLESKILLS = getIdxTrainableSkills();
    const __IDX = parseInt(idx, 10);
    let result = false;

    for (let idxTrainable of __TRAINABLESKILLS) {
        if (__IDX === idxTrainable) {
            result = true;
            break;
        }
    }

    return result;
}

// Konvertiert einen Aufwertungstext fuer einen Skillnamen in den fuer einen Torwart
// name: Allgemeiner Skillname (abgeleitet von den Feldspielern)
// return Der konvertierte String (z.B. 'FAN' statt 'KOB') oder unveraendert
function getGoalieSkill(name) {
    const __GOALIESKILLS = {
                               'SCH' : 'ABS',
                               'BAK' : 'STS',
                               'KOB' : 'FAN',
                               'ZWK' : 'STB',
                               'DEC' : 'SPL',
                               'GES' : 'REF'
                           };

    return getValue(__GOALIESKILLS[name], name);
}

// Konvertiert die allgemeinen Skills in die eines Torwarts
// value: Ein Text, der die Skillnamen enthaelt
// return Der konvertierte String mit Aenderungen (z.B. 'FAN' statt 'KOB') oder unveraendert
function convertGoalieSkill(value) {
    if (value !== undefined) {
        value = value.replace(/\w+/g, getGoalieSkill);
    }

    return value;
}

// Gibt alle Skill-Namen zurueck
function getAllSkillNames(isGoalie = false) {
    if (isGoalie) {
        return [ 'ABS', 'STS', 'FAN', 'STB', 'SPL', 'REF', 'FUQ', 'ERF', 'AGG', 'PAS', 'AUS', 'UEB', 'WID', 'SEL', 'DIS', 'ZUV', 'EIN' ];
    } else {
        return [ 'SCH', 'BAK', 'KOB', 'ZWK', 'DEC', 'GES', 'FUQ', 'ERF', 'AGG', 'PAS', 'AUS', 'UEB', 'WID', 'SEL', 'DIS', 'ZUV', 'EIN' ];
    }
}

// Gibt den Skill-Namen zu einem Index zurueck
function getSkillName(idx, isGoalie = false) {
    const __ALLNAMES = getAllSkillNames(isGoalie);

    return __ALLNAMES[idx];
}

// Gibt den Skill-Namen zu einem Index-Array zurueck
function getSkillNameArray(idxArr, isGoalie = false) {
    return (idxArr ? idxArr.map(function(item) {
                                    return getSkillName(item, isGoalie);
                                }) : idxArr);
}

// Gibt die Indizes aller Skills zurueck
function getIdxAllSkills() {
    return [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
}

// Gibt die Indizes der trainierbaren Skills zurueck
function getIdxTrainableSkills() {
    return [ 0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 15 ];
}

// Gibt die Indizes der Fixskills zurueck
function getIdxFixSkills() {
    return [ 6, 7, 12, 13, 14, 16 ];
}

// Gibt die Indizes der Primaerskills zurueck
function getIdxPriSkills(pos) {
    switch (pos) {
        case 'TOR' : return [ 2, 3, 4, 5 ];
        case 'ABW' : return [ 2, 3, 4, 15 ];
        case 'DMI' : return [ 1, 4, 9, 11 ];
        case 'MIT' : return [ 1, 3, 9, 11 ];
        case 'OMI' : return [ 1, 5, 9, 11 ];
        case 'STU' : return [ 0, 2, 3, 5 ];
        default :    return [];
    }
}

// Gibt die Indizes der (trainierbaren) Sekundaerskills zurueck
function getIdxSecSkills(pos) {
    switch (pos) {
        case 'TOR' : return [ 0, 1, 8, 9, 10, 11, 15 ];
        case 'ABW' : return [ 0, 1, 5, 8, 9, 10, 11 ];
        case 'DMI' : return [ 0, 2, 3, 5, 8, 10, 15 ];
        case 'MIT' : return [ 0, 2, 4, 5, 8, 10, 15 ];
        case 'OMI' : return [ 0, 2, 3, 4, 8, 10, 15 ];
        case 'STU' : return [ 1, 4, 8, 9, 10, 11, 15 ];
        default :    return [];
    }
}

// Gibt die zur Position gehoerige Farbe zurueck
function getColor(pos) {
    switch (pos) {
        case 'TOR' : return '#FFFF00';
        case 'ABW' : return '#00FF00';
        case 'DMI' : return '#3366FF';
        case 'MIT' : return '#66FFFF';
        case 'OMI' : return '#FF66FF';
        case 'STU' : return '#FF0000';
        case 'LEI' : return '#FFFFFF';
        case "" :    return __OSBLAU;
        default :    return "";
    }
}

// ==================== Ende Abschnitt fuer Skilltypen, Skills und Spielreihen ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.list.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.calc.js ***/

// ==UserModule==
// _name         OS2.calc
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities zu OS2-spezifischen Berechnungen
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.list.js
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.calc.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer konstante Parameter bei OS2 ====================

const __SAISONZATS      = 72;   // Anzahl der ZATs pro Saison, ab Saison 3
const __MONATZATS       =  6;   // Anzahl der ZATs pro Abrechnungs-Monat, ab Saison 2
const __SAISONFIRST     =  3;   // Erste Saison mit diesen Parametern, ab Saison 3
const __SAISON6ZATMONAT =  2;   // Erste Saison mit 6 ZATs pro Monat, ab Saison 2

const __OLDSAISONZATS   = 70;   // Anzahl der ZATs pro Saison, nur in der 1. und 2. Saison
const __OLDMONATZATS    =  7;   // Anzahl der ZATs pro Abrechnungs-Monat, nur in der 1. Saison
const __OLDSAISONFIRST  =  1;   // Erste Saison mit diesen Parametern, ab Saison 1

const __OSBLAU          = '#111166';    // Globale Hintergrundfarbe bei OS2

const __NUMOPTI         = 27;
const __NUMSKILLS       = 17;
const __NUMTRAINABLE    = 11;

// ==================== Ende Abschnitt fuer konstante Parameter bei OS2 ====================

// ==================== Abschnitt fuer dezimales Alter (Potential-Berechnung) ====================

// Gibt das dezimale Alter passend zum ganzzahligen Alter und Geburtsdatum eines Spielers zurueck
// age: Ganzzahliges Alter des Spielers
// geb: Geburtsdatum des Spielers
// currZAT: Aktueller ZAT
// return Das Alter des Spielers zum currZAT als Dezimalbruch
function getDezAlter(age, geb, currZAT) {
    const __ZUSATZZATS = ((currZAT < geb)
                        ? (__SAISONZATS - (geb - currZAT))  // ... hat diese Saison noch Geburtstag!
                        : (currZAT - geb));                 // .... hatte diese Saison schon Geburtstag!
    const __DEZALTER = age + (__ZUSATZZATS / __SAISONZATS);

    return __DEZALTER;
}

// ==================== Ende Abschnitt fuer dezimales Alter (Potential-Berechnung) ====================

// ==================== Abschnitt fuer EQ19 (Potential-Berechnung) ====================

// ==================== Abschnitt Werte-Tabellen fuer Potential-Berechnung ====================

// Fuer Skill-Werte von 0 bis 99: Anzahl der Trainings-ZATs, die bei vollem Training (17er/99.5) noetig sind...
const __DAUER = [    0,  1,  2,  3,  4,  5,  6,  7,  8,  9,     //  0 -  9
                    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,     // 10 - 19
                    20, 21, 22, 23, 24, 25, 26, 27, 28, 29,     // 20 - 29
                    30, 31, 32, 33, 34, 35, 36, 37, 38, 39,     // 30 - 39
                    40, 41, 42, 43, 44, 45, 46, 47, 48, 49,     // 40 - 49
                    50, 51, 52, 53, 54, 55, 56, 58, 59, 60,     // 50 - 59
                    62, 63, 65, 66, 68, 70, 71, 73, 75, 77,     // 60 - 69
                    79, 82, 84, 87, 89, 92, 95, 98,101,104,     // 70 - 79
                   108,112,116,120,125,130,136,142,148,155,     // 80 - 89
                   163,171,181,192,205,220,238,261,292,340 ];   // 90 - 99

// Fuer Alter von 0 bis 39: Anzahl der Trainings-ZATs, die bei vollem Training (17er/99.5) noetig sind...
const __TAGE = [ -1505,  -1426,  -1346,  -1267,  -1188,  -1109,  -1030,   -950,   -871,   -792,     //  0 -  9
                  -713,   -634,   -554,-   475,   -396,   -317,   -238,   -158,    -79,      0,     // 10 - 19
                    72,    138,    198,    254,    304,    350,    392,    431,    465,    497,     // 20 - 29
                   526,    551,    575,    596,    615,    632,    648,    662,    674,    685 ];   // 30 - 39

// Fuer Alter von 0 bis 39: Faktor fuer die Restbruchteile des Alters (in Prozent)...
const __FAKTOR = [ 110,110,110,110,110,110,110,110,110,110,     //  0 -  9
                   110,110,110,110,110,110,110,110,110,100,     // 10 - 19
                    92, 84, 77, 70, 64, 58, 53, 48, 44, 40,     // 20 - 29
                    36, 33, 29, 26, 24, 21, 19, 17, 15, 14];    // 30 - 39

// ==================== Abschnitt Hilfsfunktion zur Potential-Berechnung ====================

// Gibt Anzahl trainierter Skillpunkte und Michael Bertrams EQ19
// "Potential" (frueher: "Talent") eines Spielers zurueck.
// Dies ist ein Vergleichswert mit vergleichbaren 19-jaehrigen
// Spielern, die voll mit 17er-Trainer trainiert werden
// dezAlter: Dezimales Alter (also Alter plus ZATsSeitGeb / 72) des Spielers
// skills: Array mit den Spieler-Einzelskills (Index 0 bis 15)
// return Die passenden EQ19-Daten
//        - __TRAINIERT: Anzahl der 11 trainierten Skills (ohne FUQ, ERF und Fix-Skills)
//        - __POTENTIAL: Gewichtete Trainingsleistung unabhaengig vom Alter
function calcPotential(dezAlter, skills) {
    const [ __TRAINIERT, __EQ19 ] = getIdxTrainableSkills().Reduce(
            function (res, skillIdx) {          // Fuer alle trainierbaren Skilltypen...
                const __SKILL = skills[skillIdx];

                res[0] += __SKILL;              // Skillpunkte aufsummieren (trainierte Skills)
                res[1] += __DAUER[__SKILL];     // ZAT-Dauer aufsummieren (Trainingsleistung als ZAT-Dauer)

                return res;
            }, [0, 0]);                         // Start-Werte fuer [ __TRAINIERT, __EQ19 ]

    const __ALTER = Math.min(39, Math.floor(dezAlter));                 // Ganzzahliger Anteil des Alters (max 39)
    const __RESTZAT = Math.round(__SAISONZATS * (dezAlter - __ALTER));  // Tage seit dem (max. 39.) Geburtstag des Spielers
    const __BASISERWARTUNG = __TAGE[__ALTER] + Math.round((__RESTZAT * __FAKTOR[__ALTER]) / 100);  // Erwartete Profi-Trainingsleistung
    const __POTENTIAL = __EQ19 - __BASISERWARTUNG;                      // Trainingsleistung oberhalb des Trainings eines 19j Spielers ohne Skillpunkte

    return [ __TRAINIERT, __POTENTIAL ];
}

// ==================== Ende Abschnitt fuer EQ19 (Potential-Berechnung) ====================

// ==================== Abschnitt fuer Berechnung von Trainergehaeltern und Trainingswahrscheinlichkeiten ====================

// ==================== Abschnitt Konstanten fuer Training ====================

// Konstante 0.99 ^ 99
const __099HOCH99 = 0.36972963764972677265718790562881;

// Faktoren auf Trainingswahrscheinlichkeiten fuer Einsaetze...
const __TRFACTORS = [ 1.00, 1.10, 1.25, 1.35 ];  // Tribuene, Bank, teilweise, durchgehend

// ==================== Ende Abschnitt Konstanten fuer Training ====================

// Gibt das Gehalt eines Trainers zurueck
// tSkill: Trainer-Skill (60, 62.5, ..., 97.5, 99.5)
// tZATs: Trainer-Vertragslaenge (6, 12, ..., 90, 96)
// return Trainer-Gehalt eines Trainers von bestimmtem Skill
function calcTGehalt(tSkill = 99.5, tZATs = 96) {
    const __OLDTSKILL = parseInt((2 * tSkill - 100.5).toFixed(0), 10);
    const __SKILLFACT = Math.pow(__OLDTSKILL - 16.34, 1.26);
    const __ZATFACT = (596 - tZATs) / 500;
    const __GEHALT = 1950 * __SKILLFACT * __ZATFACT;

    return __GEHALT;
}

// Gibt die Wahrscheinlichkeit fuer ein Training zurueck
// alter: Alter des Spielers
// pSkill: Derzeitiger Wert des zu trainierenden Spieler-Skills
// tSkill: Trainer-Skill (60, 62.5, ..., 97.5, 99.5)
// mode: Einsatztyp (0: Tribuene/Basis, 1: Bank, 2: teilweise, 3: durchgehend)
// limit: Obere Grenze (99), Default ist unbegrenzt (undefined)
// return Trainingswahrscheinlichkeit
function calcProbPercent(alter, pSkill = 100, tSkill = 99.5, mode = 0, limit = undefined) {
    const __SKILLDIFF = tSkill - pSkill;
    const __SKILLPLUS = Math.max(0, __SKILLDIFF + 0.5);
    const __SKILLFACT = __SKILLPLUS / (101 - __SKILLPLUS);
    const __ALTER = Math.floor(alter);  // Gesucht ist der ganzzahlige Anteil des Alters!
    const __ALTERFACT = Math.pow((100 - __ALTER) / 37, 7);
    const __PROB = __099HOCH99 * __SKILLFACT * __ALTERFACT * __TRFACTORS[mode];

    return ((limit === undefined) ? __PROB : Math.min(limit, __PROB));
}

// Gibt die Wahrscheinlichkeit fuer ein Training zurueck
// alter: Alter des Spielers
// tSkill: Trainer-Skill (60, 62.5, ..., 97.5, 99.5)
// mode: Einsatztyp (0: Tribuene/Basis, 1: Bank, 2: teilweise, 3: durchgehend)
// prob: Gewuenschte Wahrscheinlichkeit (Default ist 99)
// return Spieler-Skill eines zu trainierenden Spielers, der optimal trainiert wird
function calcMinPSkill(alter, tSkill = 99.5, mode = 0, prob = 99) {
    const __ALTER = Math.floor(alter);  // Gesucht ist der ganzzahlige Anteil des Alters!
    const __ALTERFACT = Math.pow((100 - __ALTER) / 37, 7);
    const __SKILLFACT = prob / (__099HOCH99 * __ALTERFACT * __TRFACTORS[mode]);
    const __SKILLPLUS = 101 * __SKILLFACT / (__SKILLFACT + 1);
    const __SKILLDIFF = Math.max(0, __SKILLPLUS) - 0.5;
    const __PSKILL = tSkill - __SKILLDIFF;

    return Math.max(0, __PSKILL);
}

// Gibt die Trainingswahrscheinlichkeit zurueck
// Format der Rueckgabe: "aaa.bb %", "aa.bb %" bzw. "a.bb %" (keine Deckelung bei 99.00 %)
// probStr: Basis-Wahrscheinlichkeit (= Tribuene) als Prozent-String
// mode: Art des Einsatzes: 0 - Tribuene, 1 - Bank, 2 - Teilweiser Einsatz, 3 - Volleinsatz
// unit: Einheitensymbol (Default: " %")
// fixed: Nachkommastellen (Default: 2)
// limit: Obere Grenze, z.B. 99.0 (Default: aus)
// return String der Trainingswahrscheinlichkeit im oben angegebenen Format
function getProbabilityStr(probStr, mode, unit = " %", fixed = 2, limit = undefined) {
    if ((probStr == "0.00 %") || (probStr == "Trainerskill zu niedrig!")) {
        return "";
    } else {
        let ret = parseFloat(probStr) * __TRFACTORS[mode];

        if (limit) {
            ret = Math.min(limit, ret);
        }

        return ret.toFixed(fixed).toString() + unit;
    }
}

// ==================== Ende Abschnitt fuer Berechnung von Trainergehaeltern und Trainingswahrscheinlichkeiten ====================

// ==================== Abschnitt fuer Berechnung von Marktwerten von Spielern ====================

const __MW5TF = 1.00;  // Zufaelliger Faktor zwischen 0.97 und 1.03, mal als 1.00 angenommen

const __MW9FORMEL = false;  // alte MW-Formel bis Saison 9
const __MW10FORMEL = true;  // neue MW-Formel ab Saison 10

// Berechnet den Marktwert eines Spielers
// age: Alter als Dezimalbruch
// skill: Skill-Schnitt
// opti: Opti-Schnitt
// mwFormel: Angabe ueber die Marktwert-Formel:
// - false: Formel, die bis Saison 9 genutzt wurde
// - true: Formel, die seit Saison 10 genutzt wird
// return Marktwert des Spielers mit o.a. Werten
function calcMarketValue(age, skill, opti, mwFormel = __MW10FORMEL) {
    const __AGE = age;
    const __SKILL = skill;
    const __OPTI = opti;

    if (mwFormel === __MW9FORMEL) {
        return Math.round(Math.pow((1 + (__SKILL / 100)) * (1 + (__OPTI / 100)) * (2 - (__AGE / 100)), 10) * 2);    // Alte Formel bis Saison 9
    } else {  // MW-Formel ab Saison 10...
        return Math.round(Math.pow(1 + (__SKILL / 100), 5.65) * Math.pow(1 + (__OPTI / 100), 8.1) * Math.pow(1 + ((100 - __AGE) / 49), 10) * __MW5TF);
    }
}

// ==================== Ende Abschnitt fuer Berechnung von Marktwerten von Spielern ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.calc.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.team.js ***/

// ==UserModule==
// _name         OS2.team
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifische Funktionen und Utilities zu Teams
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.prop.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.run.js
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.list.js
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.team.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse TeamClassification ====================

// Klasse fuer die Klassifikation der Optionen nach Team (Erst- und Zweitteam oder Fremdteam)

/*class*/ function TeamClassification /*extends Classification {
    constructor*/() {
        'use strict';

        Classification.call(this);

        this.prefix = undefined;

        this.team = undefined;
        this.teamParams = undefined;
    }
//}

Class.define(TeamClassification, Classification, {
                    'assign'          : function(optSet, optParams) {
                                            Classification.prototype.assign.call(this, optSet, optParams);
                                            this.teamParams = optParams.teamParams;
                                        },
                    'renameParamFun'  : function() {
                                            const __MYTEAM = (this.team = getMyTeam(this.optSet, this.teamParams, this.team));

                                            if (__MYTEAM.LdNr) {
                                                // Prefix fuer die Optionen mit gesonderten Behandlung...
                                                this.prefix = __MYTEAM.LdNr.toString() + '.' + __MYTEAM.LgNr.toString();
                                            } else {
                                                this.prefix = undefined;
                                            }

                                            return this.prefixParamFun();
                                        }
                });

// ==================== Ende Abschnitt fuer Klasse TeamClassification ====================

// ==================== Abschnitt fuer Klasse Team ====================

// Klasse fuer Teamdaten

/*class*/ function Team /*{
    constructor*/(team, land, liga, teamId) {
        'use strict';

        this.Team = team;
        this.Land = land;
        this.Liga = liga;
        this.TmNr = (teamId || 0);
        this.LdNr = getLandNr(land);
        this.LgNr = getLigaNr(liga);
    }
//}

Class.define(Team, Object, {
                    '__TEAMITEMS' : {   // Items, die in Team als Teamdaten gesetzt werden...
                                        'Team' : true,
                                        'Liga' : true,
                                        'Land' : true,
                                        'TmNr' : true,
                                        'LdNr' : true,
                                        'LgNr' : true
                                    }
                });

// ==================== Ende Abschnitt fuer Klasse Team ====================

// ==================== Abschnitt fuer Klasse Verein ====================

// Klasse fuer Vereinsdaten

/*class*/ function Verein /*extends Team {
    constructor*/(team, land, liga, teamId, manager, flags) {
        'use strict';

        Team.call(this, team, land, liga, teamId);

        this.Manager = manager;
        this.Flags = (flags || []);

        Object.defineProperty(this, 'ID', {
                enumerable    : false,
                configurable  : true,
                get           : function() {
                                    return this.TmNr;
                                },
                set           : undefined
            });
    }
//}

Class.define(Verein, Team, {
                    '__TEAMITEMS' : {   // Items, die in Verein als Teamdaten gesetzt werden...
                                        'Team'    : true,
                                        'Liga'    : true,
                                        'Land'    : true,
                                        'TmNr'    : true,
                                        'LdNr'    : true,
                                        'LgNr'    : true,
                                        'Manager' : true,
                                        'Flags'   : true
                                    }
                });

// ==================== Ende Abschnitt fuer Klasse Verein ====================

// ==================== Abschnitt zu Teamdaten ====================

// Gibt die Teamdaten zurueck und aktualisiert sie ggfs. in der Option
// optSet: Platz fuer die gesetzten Optionen
// teamParams: Dynamisch ermittelte Teamdaten ('Team', 'Liga', 'Land', 'TmNr', 'LdNr' und 'LgNr')
// myTeam: Objekt fuer die Teamdaten
// return Die Teamdaten oder undefined bei Fehler
function getMyTeam(optSet = undefined, teamParams = undefined, myTeam = new Team()) {
    const __HASTEAMOPT = optSet.hasOpt('team');

    if (teamParams !== undefined) {
        addProps(myTeam, teamParams, myTeam.__TEAMITEMS);
        __LOG[2]("Ermittelt: " + safeStringify(myTeam));
        // ... und abspeichern, falls erweunscht...
        if (__HASTEAMOPT) {
            optSet.setOpt('team', myTeam, false);
        }
    } else {
        const __TEAM = (__HASTEAMOPT ? optSet.getOptValue('team') : undefined);  // Gespeicherte Parameter

        if ((__TEAM !== undefined) && (__TEAM.Land !== undefined)) {
            addProps(myTeam, __TEAM, myTeam.__TEAMITEMS);
            __LOG[2]("Gespeichert: " + safeStringify(myTeam));
        } else {
            __LOG[3]("Team nicht ermittelt: " + safeStringify(__TEAM));
        }
    }

    return myTeam;
}

// ==================== Ende Abschnitt zu Teamdaten ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.team.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.page.team.js ***/

// ==UserModule==
// _name         OS2.page.team
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifische Funktionen zur Ermittlung des Teams auf den Seiten
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.page.team.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Ermittlung des Teams von einer OS2-Seite ====================

const __TEAMSEARCHHAUPT = {  // Parameter zum Team "<b>Willkommen im Managerb&uuml;ro von TEAM</b><br>LIGA LAND<a href=..."
        'Tabelle'   : 'TABLE TABLE',  // Erste Tabelle innerhalb einer Tabelle...
        'Zeile'     : 0,
        'Spalte'    : 1,
        'start'     : " von ",
        'middle'    : "</b><br>",
        'liga'      : ". Liga",
        'land'      : ' ',
        'end'       : "<a href="
    };

const __TEAMSEARCHTEAM = {  // Parameter zum Team "<b>TEAM - LIGA <a href=...>LAND</a></b>"
        'Tabelle'   : 'TABLE TABLE',  // Erste Tabelle innerhalb einer Tabelle...
        'Zeile'     : 0,
        'Spalte'    : 0,
        'start'     : "<b>",
        'middle'    : " - ",
        'liga'      : ". Liga",
        'land'      : 'target="_blank">',
        'end'       : "</a></b>"
    };

const __TEAMIDSEARCHHAUPT = {  // Parameter zur Team-ID "<b>Deine Spiele in</b>...<a href="livegame/index.php?spiele=TEAMID,ZAT">LIVEGAME</a>"
        'Tabelle'   : 'TABLE',  // Aeussere Tabelle, erste ueberhaupt (darunter die Zeile #6 "Deine Spiele in")...
        'Zeile'     : 6,
        'Spalte'    : 0,
        'start'     : '<a href="livegame/index.php?spiele=',
        'end'       : '">LIVEGAME</a>',
        'delim'     : ','
    };

const __TEAMIDSEARCHTEAM = {  // Parameter zur Team-ID "<a hspace="20" href="javascript:tabellenplatz(TEAMID)">Tabellenpl\u00E4tze</a>"
        'Tabelle'   : 'TABLE',  // Aeussere Tabelle, erste ueberhaupt (darunter die Zeile #1/Spalte #1 "Tabellenplaetze")...
        'Zeile'     : 1,
        'Spalte'    : 1,
        'start'     : '<a hspace="20" href="javascript:tabellenplatz(',
        'end'       : ')">Tabellenpl\u00E4tze</a>',
        'delim'     : null
    };

// Ermittelt, wie das eigene Team heisst und aus welchem Land bzw. Liga es kommt (zur Unterscheidung von Erst- und Zweitteam)
// teamSearch: Muster fuer die Suche nach Team, die Eintraege fuer 'start', 'middle', 'liga', 'land' und 'end' enthaelt, ausserdem die
//              Adresse der Tabellenzelle mit den Parametern zum Team "startTEAMmiddleLIGA...landLANDend", LIGA = "#liga[ (A|B|C|D)]"
// teamIdSearch: Muster fuer die Suche nach Team-ID, die Eintraege fuer 'start' und 'end' enthaelt, ausserdem die
//              Adresse der Tabellenzelle mit den Parametern zur Team-ID "startTEAMIDend"
// doc: Optionale Angabe des Dokuments, in dem die Tabelle gesucht wird  (Default: document)
// return Im Beispiel { 'Team' : "TEAM", 'Liga' : "LIGA", 'Land' : "LAND", 'TmNr' : TEAMID, 'LdNr' : LAND-NUMMER, 'LgNr' : LIGA-NUMMER },
//        z.B. { 'Team' : "Choromonets Odessa", 'Liga' : "1. Liga", 'Land' : "Ukraine", 'TmNr' : 930, 'LdNr' : 20, 'LgNr' : 1 }
function getTeamParamsFromTable(teamSearch, teamIdSearch, doc = document) {
    // Ermittlung von Team, Liga und Land...
    const __TEAMSEARCH   = getValue(teamSearch, __TEAMSEARCHHAUPT);
    const __TEAMTABLE    = getElement(getValue(__TEAMSEARCH.Tabelle, 'TABLE TABLE'), 0, doc);
    const __TEAMCELLROW  = getValue(__TEAMSEARCH.Zeile, 0);
    const __TEAMCELLCOL  = getValue(__TEAMSEARCH.Spalte, 0);
    const __TEAMCELLSTR  = (__TEAMTABLE === undefined) ? "" : __TEAMTABLE.rows[__TEAMCELLROW].cells[__TEAMCELLCOL].innerHTML;
    const __SEARCHSTART  = __TEAMSEARCH.start;
    const __SEARCHMIDDLE = __TEAMSEARCH.middle;
    const __SEARCHLIGA   = __TEAMSEARCH.liga;
    const __SEARCHLAND   = __TEAMSEARCH.land;
    const __SEARCHEND    = __TEAMSEARCH.end;
    const __INDEXSTART   = __TEAMCELLSTR.indexOf(__SEARCHSTART);
    const __INDEXEND     = __TEAMCELLSTR.indexOf(__SEARCHEND);

    let teamParams = __TEAMCELLSTR.substring(__INDEXSTART + __SEARCHSTART.length, __INDEXEND);
    const __INDEXLIGA = teamParams.indexOf(__SEARCHLIGA);
    const __INDEXMIDDLE = teamParams.indexOf(__SEARCHMIDDLE);

    let land = ((~ __INDEXLIGA) ? teamParams.substring(__INDEXLIGA + __SEARCHLIGA.length) : undefined);
    const __TEAMNAME = ((~ __INDEXMIDDLE) ? teamParams.substring(0, __INDEXMIDDLE) : undefined);
    let liga = (((~ __INDEXLIGA) && (~ __INDEXMIDDLE)) ? teamParams.substring(__INDEXMIDDLE + __SEARCHMIDDLE.length) : undefined);

    if (land !== undefined) {
        if (land.charAt(2) === ' ') {    // Land z.B. hinter "2. Liga A " statt "1. Liga "
            land = land.substr(2);
        }
        if (liga !== undefined) {
            liga = liga.substring(0, liga.length - land.length);
        }
        const __INDEXLAND = land.indexOf(__SEARCHLAND);
        if (~ __INDEXLAND) {
            land = land.substr(__INDEXLAND + __SEARCHLAND.length);
        }
    }

    // Ermittlung der Team-ID (indirekt ueber den Livegame- bzw. Tabellenplatz-Link)...
    const __TEAMIDSEARCH   = getValue(teamIdSearch, __TEAMIDSEARCHHAUPT);
    const __TEAMIDTABLE    = getElement(getValue(__TEAMIDSEARCH.Tabelle, 'TABLE'), 0, doc);
    const __TEAMIDCELLROW  = getValue(__TEAMIDSEARCH.Zeile, 6);
    const __TEAMIDCELLCOL  = getValue(__TEAMIDSEARCH.Spalte, 0);  // Alternativ: 'a[href^=livegame]' (outerHTML)
    const __TEAMIDCELLSTR  = (__TEAMIDTABLE === undefined) ? "" : __TEAMIDTABLE.rows[__TEAMIDCELLROW].cells[__TEAMIDCELLCOL].innerHTML;
    const __SEARCHIDSTART  = __TEAMIDSEARCH.start;
    const __SEARCHIDEND    = __TEAMIDSEARCH.end;
    const __SEARCHIDDELIM    = __TEAMIDSEARCH.delim;
    const __INDEXIDSTART   = __TEAMIDCELLSTR.indexOf(__SEARCHIDSTART);
    const __INDEXIDEND     = __TEAMIDCELLSTR.indexOf(__SEARCHIDEND);
    const __INDEXIDDELIM   = (__SEARCHIDDELIM ? __TEAMIDCELLSTR.lastIndexOf(__SEARCHIDDELIM, __INDEXIDEND) : __INDEXIDEND);
    const __TEAMIDSTR      = __TEAMIDCELLSTR.substring(__INDEXIDSTART + __SEARCHIDSTART.length, __INDEXIDDELIM);
    const __TEAMID         = Number.parseInt(__TEAMIDSTR, 10);

    const __TEAM = new Team(__TEAMNAME, land, liga, __TEAMID);

    return __TEAM;
}

// ==================== Ende Abschnitt fuer Ermittlung des Teams von einer OS2-Seite ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.page.team.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.page.js ***/

// ==UserModule==
// _name         OS2.page
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifische Funktionen zur Ermittlung von Daten auf den Seiten
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.page.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Parameter von den OS2-Seiten ====================

// Verarbeitet die URL der Seite und ermittelt die Nummer der gewuenschten Unterseite
// url: Adresse der Seite
// leafs: Liste von Filenamen mit Basis-Seitennummern (zu denen ggfs. Query-Parameter addiert wird)
// item: Query-Parameter, der die Nummer der Unterseite angibt (wird zur Basisnummer addiert),
//      allerdings nur, wenn Basis-Seitennummer positiv ist, ansonsten Absolutwert ohne Unterseite
// return Parameter aus der URL der Seite als Nummer (-1, falls nicht gefunden)
function getPageIdFromURL(url, leafs, item = 'page') {
    const __URI = new URI(url);
    const __LEAF = __URI.getLeaf();

    for (let leaf in leafs) {
        if (__LEAF === leaf) {
            const __BASE = getValue(leafs[leaf], 0);
            const __ITEM = getValue(__URI.getQueryPar(item), 0);

            return Math.abs(__BASE) + ((__BASE >= 0) ? __ITEM : 0);
        }
    }

    return -1;
}

// Gibt die laufende Nummer des ZATs im Text einer Zelle zurueck
// cell: Tabellenzelle mit der ZAT-Nummer im Text
// return ZAT-Nummer im Text
function getZATNrFromCell(cell) {
    const __TEXT = ((cell === undefined) ? [] : cell.textContent.split(' '));
    let ZATNr = 0;

    for (let i = 1; (ZATNr === 0) && (i < __TEXT.length); i++) {
        if (__TEXT[i - 1] === "ZAT") {
            if (__TEXT[i] !== "ist") {
                ZATNr = parseInt(__TEXT[i], 10);
            }
        }
    }

    return ZATNr;
}

// Ermittelt das Spiel-Ergebnis aus einer Tabellenzelle, etwa "2 : 1", und liefert zwei Werte zurueck
// cell: Tabellenzelle mit Eintrag "2 : 1"
// return { '2', '1' } im Beispiel
function getErgebnisFromCell(cell) {
    const __ERGEBNIS = cell.textContent.split(" : ", 2);

    return __ERGEBNIS;
}

// Ermittelt das Spiel-Ergebnis aus einer Tabellenzelle und setzt tore/gtore im Spielplanzeiger
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT
// cell: Tabellenzelle mit Eintrag "2 : 1"
// return Modifizierter Spielplanzeiger
function setErgebnisFromCell(currZAT, cell) {
    const __ERGEBNIS = getErgebnisFromCell(cell);

    if (__ERGEBNIS.length === 2) {
        currZAT.gFor = parseInt(__ERGEBNIS[0], 10);
        currZAT.gAga = parseInt(__ERGEBNIS[1], 10);
    } else {
        currZAT.gFor = -1;
        currZAT.gAga = -1;
    }

    return currZAT;
}

// Liest aus, ob der Spieler Torwart oder Feldspieler ist (Version mit Zelle)
// cell: Eine fuer TOR eingefaerbte Zelle
// return Angabe, der Spieler Torwart oder Feldspieler ist
function isGoalieFromCell(cell) {
    return (cell.className === 'TOR');
}

// Liest aus, ob der Spieler Torwart oder Feldspieler ist (Version mit Zell-Array)
// cells: Die Zellen einer Zeile
// colIdxClass: Spaltenindex einer fuer TOR eingefaerbten Zelle (Default: 0)
// return Angabe, der Spieler Torwart oder Feldspieler ist
function isGoalieFromHTML(cells, colIdxClass = 0) {
    return isGoalieFromCell(cells[colIdxClass]);
}

// ==================== Ende Abschnitt fuer Parameter von den OS2-Seiten ====================

// ==================== Abschnitt fuer Hilfsfunktionen ====================

// Liefert umschlossenen textContent und einen der einem <A>-Link uebergebenen Parameter.
// Als Drittes wird optional der ganze Ziel-Link (das href) zurueckgegeben.
// element: Eine <A>-Node mit href-Link
// queryID: Name des Parameters innerhalb der URL, der die ID liefert
// return Text, ID und href-Link
function getLinkData(element, queryID) {
    checkType(element && element.href, 'string', true, 'getLinkData', 'element.href', 'String');
    checkType(queryID, 'string', false, 'getLinkData', 'queryID', 'String');

    const __A = element; // <A href="https://.../...?QUERYID=ID">TEXT</A>
    const __TEXT = __A.textContent;
    const __HREF = __A.href;
    const __URI = new URI(__HREF);
    const __ID = __URI.getQueryPar(queryID);

    return [ __TEXT, __ID, __HREF ];
}

// Liefert den HTML-Code fuer einen parametrisierten <IMG>-Link.
// imageURL: URL des verlinkten Bildes
// title: Tooltip des Bildes (Default: null fuer kein Tooltip)
// altText: ALT-Parameter fuer Ausgabe ohne Bild (Default: Tooltip-Text)
// return String mit HTML-Code des <IMG>-Links
function getImgLink(imageURL, title = null, altText = title) {
    checkType(imageURL, 'string', true, 'getImgLink', 'imageURL', 'String');
    checkType(title, 'string', false, 'getImgLink', 'title', 'String');
    checkType(altText, 'string', false, 'getImgLink', 'altText', 'String');

    const __ALTSTR = (altText ? (' alt="' + altText + '"') : "");
    const __IMGSTR = '<IMG src="' + imageURL + '"' + __ALTSTR + ' />';
    const __RETSTR = (title ? ('<ABBR title="' + title + '">' + __IMGSTR + '</ABBR>') : __IMGSTR);

    return __RETSTR;
}

// Liefert den HTML-Code fuer einen parametrisierten <A>-Link auf ein OS-Team.
// teamName: Name des Teams fuer den textContent
// osID: OS-ID des Teams
// return String mit HTML-Code des <A>-Team-Links
function getTeamLink(teamName, osID) {
    checkType(teamName, 'string', true, 'getTeamLink', 'teamName', 'String');
    checkType(osID, 'number', true, 'getTeamLink', 'osID', 'Number');

    const __RETSTR = '<A href="/st.php?c=' + osID + '" onClick="teaminfo(' + osID + '); return false;">' + teamName + '</A>';

    return __RETSTR;
}

// Liefert den HTML-Code fuer einen parametrisierten <A>-Link auf das Manager-PM-Fenster.
// managerName: Name des Managers fuer den textContent
// pmID: User-ID des Managers im PM-System von OS2
// return String mit HTML-Code des <A>-Manager-Links, falls pmID okay, ansonsten nur Managername geklammert
function getManagerLink(managerName, pmID) {
    checkType(managerName, 'string', true, 'getManagerLink', 'managerName', 'String');
    checkType(pmID, 'number', true, 'getManagerLink', 'pmID', 'Number');

    const __RETSTR = (pmID > -1) ? ('<A href="/osneu/pm?action=writeNew&receiver_id=' + pmID
                    + '" onclick="writePM(" + pmID + "); return false;" target="_blank">'
                    + managerName + '</A>') : ('(' + managerName + ')');

    return __RETSTR;
}

// ==================== Ende Abschnitt fuer Hilfsfunktionen ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.page.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.zat.js ***/

// ==UserModule==
// _name         OS2.zat
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifische Funktionen fuer Spielplan und ZATs und Klasse RundenLink
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.zat.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Spielplan und ZATs ====================

// ==================== Abschnitt fuer Klasse RundenLink ====================

/*class*/ function RundenLink /*{
    constructor*/(saison, team) {
        'use strict';

        this.uri = new URI("http://os.ongapo.com/");
        this.runde = 0;
        this.prop = "";
        this.label = "";

        this.setAktion("Statistik+ausgeben");

        if (saison) {
            this.setSaison(saison);
        }
        if (team) {
            this.setTeam(team);
        }
    }
//}

Class.define(RundenLink, Object, {
        'setSaison'    : function(saison) {
                             this.uri.setQueryPar('saauswahl', saison);
                         },
        'setTeam'      : function(team) {
                             this.uri.setQueryPar('landauswahl', team.LdNr);
                             this.uri.setQueryPar('ligaauswahl', team.LgNr);
                             this.uri.setQueryPar('hl',          team.TmNr);
                         },
        'setPage'      : function(page, label) {
                             this.uri.home();
                             this.uri.down(page + ".php");
                             this.setLabel(label);
                         },
        'setRunde'     : function(prop, runde) {
                             this.prop = prop;
                             this.runde = runde;
                         },
        'setLabel'     : function(label) {
                             this.label = (label || "");
                         },
        'setAnzeigen'  : function(show = true) {
                             this.uri.setQueryPar('erganzeigen', (show ? 1 : 0));
                         },
        'setAktion'    : function(aktion = "Statistik+ausgeben") {
                             this.uri.setQueryPar('stataktion', aktion);
                         },
        'getLabel'     : function() {
                             return (this.label || "Link");
                         },
        'getHTML'      : function(target = undefined) {
                             if ((this.runde <= 0) || (! this.uri.getLeaf())) {
                                 return this.label;
                             } else {
                                 if (this.prop) {
                                     this.uri.setQueryPar(this.prop, this.runde);
                                 }

                                 return "<A " + URI.prototype.formatParams({
                                                                      'href'   : this.uri.getPath(),
                                                                      'target' : (target ? target : '_blank')
                                                                  }, function(value) {
                                                                         return '"' + value + '"';
                                                                     }, ' ', '=') + '>' + this.getLabel() + "</A>";
                             }
                         }
    });

// ==================== Ende Abschnitt fuer Klasse RundenLink ====================

// Liefert einen vor den ersten ZAT zurueckgesetzten Spielplanzeiger
// saison: Enthaelt die Nummer der laufenden Saison
// ligaSize: Anzahl der Teams in dieser Liga (Gegner + 1)
// - ZATs pro Abrechnungsmonat
// - Saison
// - ZAT
// - GameType
// - Heim/Auswaerts
// - Gegner
// - Tore
// - Gegentore
// - Ligengroesse
// - Ligaspieltag
// - Pokalrunde
// - Eurorunde
// - Hin/Rueck
// - ZAT Rueck
// - ZAT Korr
function firstZAT(saison, ligaSize) {
    return {             // Erste Saison 7 ZAT, danach 6 ZAT...
        'anzZATpMonth' : ((saison < __SAISON6ZATMONAT) ? __OLDMONATZATS : __MONATZATS),
        'saison'       : saison,
        'ZAT'          : 0,
        'gameType'     : 'spielfrei',
        'heim'         : true,
        'gegner'       : "",
        'gFor'         : 0,
        'gAga'         : 0,
        'ligaSize'     : ligaSize,
        'ligaSpieltag' : 0,
        'pokalRunde'   : 1,
        'euroRunde'    : 0,
        'hinRueck'     : __HINRUECKNULL,    // 0: Hin, 1: Rueck, 2: unbekannt
        'ZATrueck'     : 0,
        'ZATkorr'      : 0
    };
}

// Liefert den ZAT als String
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT
// longStats: Formatiert die Langversion des Textes
function getZAT(currZAT, longStats) {
    return (longStats ? currZAT.gameType + ' ' + (currZAT.heim ? "Heim" : "Ausw\u00E4rts") + ' ' : "") +
           (longStats ? '[' + currZAT.ligaSpieltag + ' ' + currZAT.pokalRunde + ' ' + currZAT.euroRunde + "] " : "") +
           (longStats ? '[' + currZAT.ZATrueck + __HINRUECK[currZAT.hinRueck] +
                        ' ' + ((currZAT.ZATkorr < 0) ? "" : '+') + currZAT.ZATkorr + "] " : "") +
           (longStats ? currZAT.gegner + ((currZAT.gFor > -1) ? " (" + currZAT.gFor + " : " + currZAT.gAga + ')' : "") + ' ' : "") +
           'S' + currZAT.saison + "-Z" + ((currZAT.ZAT < 10) ? '0' : "") + currZAT.ZAT;
}

// Liefert die ZATs der Sonderspieltage fuer 10er- (2) und 20er-Ligen (4)
// saison: Enthaelt die Nummer der laufenden Saison
// return [ 10erHin, 10erRueck, 20erHin, 20erRueck ], ZAT-Nummern der Zusatzspieltage
function getLigaExtra(saison) {
    if (saison < __SAISONFIRST) {
        return [ 8, 64, 32, 46 ];
    } else {
        return [ 9, 65, 33, 57 ];
    }
}

// Spult die Daten um anzZAT ZATs vor und schreibt Parameter
// anhand des Spielplans fort. Also Spieltag, Runde, etc.
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT
// anzZAT: Anzahl der ZAT, um die vorgespult wird
function incZAT(currZAT, anzZAT = 1) {
    const __LIGAEXTRA = getLigaExtra(currZAT.saison);
    const __LIGAFIRST = 3 - (__LIGAEXTRA[0] % 2);

    for (let i = anzZAT; i > 0; i--) {
        currZAT.ZAT++;
        if ((currZAT.ZAT - __LIGAFIRST + 1) % 2 === 1) {
            currZAT.ligaSpieltag++;
        } else {
            const __POS = __LIGAEXTRA.indexOf(currZAT.ZAT);

            if (~ __POS) {
                if (__POS < 2 * (currZAT.ligaSize % 9)) {
                    currZAT.ligaSpieltag++;
                }
            }
        }
        if ((currZAT.ZAT > 12) && ((currZAT.ZAT % 10) === 5)) {    // passt fuer alle Saisons: 12, 20, 30, 40, 48, 58, 68 / 3, 15, 27, 39, 51, 63, 69
            currZAT.pokalRunde++;
        }
        if (((currZAT.ZAT + currZAT.ZATkorr) % 6) === 4) {
            if (currZAT.ZAT < 63) {
                currZAT.ZATrueck = currZAT.ZAT + 2;
                currZAT.euroRunde++;
                currZAT.hinRueck = __HINRUECKHIN;
            } else {
                currZAT.euroRunde = 11;    // Finale
                currZAT.hinRueck = __HINRUECKNULL;
            }
        }
        if (currZAT.ZAT === currZAT.ZATrueck) {
            currZAT.hinRueck = __HINRUECKRUECK;     // 5, 7; 11, 13;  (17, 19)  / 23,   25; 29, 31; 35,  37; 41,  43; 47, 49; 53,  55; 59,  61; 69
            if (currZAT.saison < __SAISONFIRST) {   // 4, 6; 10, 14*; (16, 22*) / 24**, 26; 34, 36; 38*, 42; 44*, 50; 52, 54; 56*, 60; 62*, 66; 70
                if (currZAT.ZAT === 22) {
                    currZAT.ZATkorr = 4;
                } else if ((currZAT.ZAT - 6) % 20 > 6) {
                    currZAT.ZATkorr = 2;
                } else {
                    currZAT.ZATkorr = 0;
                }
                if ((currZAT.ZAT === 22) || (currZAT.ZAT === 30)) {
                    currZAT.euroRunde--;    // Frueher: 3. Quali-Rueckspiel erst knapp vor 1. Hauptrunde
                }
            }
        }
    }
}

// Liefert die Beschreibung des Spiels am aktuellen ZAT fuer das Team
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT (inkl. Saison)
// team: Enthaelt ein Team-Objekt fuer das betroffene Team
// showLink: Angabe, ob ein Link eingefuegt werden soll (normalerweise true)
// showRunde: Angabe, ob statt des Namens des Spieltags nur die Runde angegeben werden soll
// lastRnd: Letzte Runde finden (statt erreichter Runde): Ergebnisse liegen in der Vergangenheit
// return Beschreibung des Spiels mit Link, falls showLink true ist, sonst Leerstring
function getZatLink(currZAT, team, showLink = true, showRunde = false, lastRnd = false) {
    const __LASTRND = lastRnd;
    const __SHOWRUNDE = (showRunde || __LASTRND);
    const __SHOWLINK = showLink;

    // RundenLink anlegen...
    const __LINK = new RundenLink(currZAT.saison, team);

    if (currZAT.gameType === 'Liga') {
        if (currZAT.ZAT < 70) {
            __LINK.setRunde('stauswahl', currZAT.ligaSpieltag);
            __LINK.setPage('ls', __LINK.runde + ". Spieltag");
        } else {
            __LINK.setLabel("Relegation");
        }
    } else if (currZAT.gameType === 'LP') {
        __LINK.setRunde('stauswahl', currZAT.pokalRunde);
        __LINK.setPage('lp', __POKALRUNDEN[__LINK.runde]);
    } else if (currZAT.gameType === 'OSEQ') {
        const __EURORUNDE = currZAT.euroRunde;
        const __IDOSE = __INTZATIDOSE[currZAT.ZAT] + ((__EURORUNDE >= 3) && ! __LASTRND);
        const __RUNDE = (__SHOWRUNDE ? __OSERUNDEN[__IDOSE] : __QUALIRUNDEN[__EURORUNDE] + __HINRUECK[currZAT.hinRueck]);

        __LINK.setRunde('runde', __EURORUNDE);
        __LINK.setPage('oseq', __RUNDE);
    } else if (currZAT.gameType === 'OSCQ') {
        const __EURORUNDE = currZAT.euroRunde;
        const __IDOSC = __INTZATIDOSC[currZAT.ZAT] + ((__EURORUNDE >= 2) && ! __LASTRND);
        const __RUNDE = (__SHOWRUNDE ? __OSCRUNDEN[__IDOSC] : __QUALIRUNDEN[__EURORUNDE] + __HINRUECK[currZAT.hinRueck]);

        __LINK.setRunde('runde', __EURORUNDE);
        __LINK.setPage('oscq', __RUNDE);
    } else if (currZAT.gameType === 'OSC') {
        if (currZAT.euroRunde < 9) {
            const __GRUPPENPHASE = ((currZAT.euroRunde < 6) ? "HR-Grp. " : "ZR-Grp. ");
            const __EURORUNDE = (currZAT.euroRunde % 3) * 2 + 1 + currZAT.hinRueck;
            const __IDOSC = __INTZATIDOSC[currZAT.ZAT];
            const __RUNDE = (__SHOWRUNDE ? __OSCRUNDEN[__IDOSC] : __GRUPPENPHASE + "Spiel " + __EURORUNDE);

            __LINK.setRunde("", __EURORUNDE);
            __LINK.setPage(((currZAT.euroRunde < 6) ? 'oschr' : 'osczr'), __RUNDE);
        } else {
            const __EURORUNDE = currZAT.euroRunde - 8;
            const __IDOSC = __INTZATIDOSC[currZAT.ZAT];
            const __RUNDE = (__SHOWRUNDE ? __OSCRUNDEN[__IDOSC] : __OSCKORUNDEN[__EURORUNDE] + __HINRUECK[currZAT.hinRueck]);

            __LINK.setRunde("", __EURORUNDE);
            __LINK.setPage('oscfr', __RUNDE);
        }
    } else if (currZAT.gameType === 'OSE') {
        const __EURORUNDE = currZAT.euroRunde - 3;
        const __IDOSE = __INTZATIDOSE[currZAT.ZAT];
        const __RUNDE = (__SHOWRUNDE ? __OSERUNDEN[__IDOSE] : __OSEKORUNDEN[__EURORUNDE] + __HINRUECK[currZAT.hinRueck]);

        __LINK.setRunde('runde', __EURORUNDE);
        __LINK.setPage('ose', __RUNDE);
    } else if (currZAT.gameType === 'Supercup') {
        __LINK.setRunde("", 1);
        __LINK.setPage('supercup', currZAT.gameType);
    } else {
        __LINK.setLabel();  // irgendwie besser lesbar! ("Friendly" bzw. "spielfrei"/"Frei"/"reserviert")
    }
    __LINK.setAnzeigen(true);

    return (__SHOWLINK ? __LINK.getHTML() : "");
}

// Fuegt einen Link auf die Ligatabelle hinzu, falls es ein Ligaspiel ist
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT (inkl. Saison)
// team: Enthaelt ein Team-Objekt fuer das betroffene Team
// label: Text, der ggfs. mit dem Link angezeigt werden soll
// showLabel: Angabe, ob das Label in jedem Fall angezeigt werden soll (normalerweise true)
// return Uebergebenes Label mit Link, falls showLabel true ist, sonst ggfs. nur das Label
function addTableLink(currZAT, team, label, showLabel = true) {
    const __LINK = new RundenLink(currZAT.saison, team);

    if (showLabel) {
        __LINK.setLabel(label);
    }

    if (currZAT.gameType === 'Liga') {
        if (currZAT.ZAT < 70) {
            if (label) {
                __LINK.setPage('lt', label);
                __LINK.setRunde("", 1);
            }
        }
    }

    return __LINK.getHTML();
}

// ==================== Abschnitt fuer Statistiken des Spielplans ====================

// Liefert eine auf 0 zurueckgesetzte Ergebnissumme
// - Siege
// - Unentschieden
// - Niederlagen
// - Tore
// - Gegentore
// - Siegpunkte
function emptyStats() {
    return {
        'S'    : 0,
        'U'    : 0,
        'N'    : 0,
        'gFor' : 0,
        'gAga' : 0,
        'P'    : 0
    };
}

// Liefert die Stats als String
// stats: Enthaelt die summierten Stats
// longStats: Formatiert die Langversion des Textes
function getStats(stats, longStats) {
    return (longStats ? '[' + stats.S + ' ' + stats.U + ' ' + stats.N + "] " : "/ ") +
           stats.gFor + ':' + stats.gAga + ' ' + ((stats.gFor < stats.gAga) ? "" : (stats.gFor > stats.gAga) ? '+' : "") +
           (stats.gFor - stats.gAga) + " (" + stats.P + ')';
}

// Summiert ein Ergebnis auf die Stats und liefert den neuen Text zurueck
// stats: Enthaelt die summierten Stats
// longStats: Formatiert die Langversion des Textes
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT (mit dem Ergebnis)
function addResultToStats(stats, longStats, currZAT) {
    let ret = "";

    if (currZAT.gFor > -1) {
        let p = 0;

        if (currZAT.gFor > currZAT.gAga) {
            stats.S++;
            p = 3;
        } else if (currZAT.gFor === currZAT.gAga) {
            stats.U++;
            p = 1;
        } else {
            stats.N++;
        }
        stats.P += p;
        stats.gFor += currZAT.gFor;
        stats.gAga += currZAT.gAga;

        ret = getStats(stats, longStats);
    }

    return ret;
}

// ==================== Abschnitt fuer sonstige Parameter ====================

// Ermittelt den Spielgegner aus einer Tabellenzelle und liefert den Namen zurueck
// cell: Tabellenzelle mit dem Namen des Gegners
// return Der Name des Gegners
function getGegnerFromCell(cell) {
    const __GEGNER = cell.textContent;
    const __POS = __GEGNER.indexOf(" (");

    if (~ __POS) {
        return __GEGNER.substr(0, __POS);
    } else {
        return __GEGNER;
    }
}

// Ermittelt den Namen des Spielgegners aus einer Tabellenzelle und setzt gegner im Spielplanzeiger
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT
// cell: Tabellenzelle mit dem Namen des Gegners
function setGegnerFromCell(currZAT, cell) {
    const __GEGNER = getGegnerFromCell(cell);

    currZAT.gegner = __GEGNER;
}

// Ermittelt die Spielart aus einer Tabellenzelle, etwa "Liga : Heim", und liefert zwei Werte zurueck
// cell: Tabellenzelle mit Eintrag "Liga : Heim" (Spielplan) oder "Liga  Heim: " (Managerbuero)
// return { "Liga", "Heim" } im Beispiel
function getSpielArtFromCell(cell) {
    const __TEXT = cell.textContent.replace('\u00A0', "").replace(':', "").replace("  ", ' ');
    const __SPIELART = __TEXT.split(' ', 2);

    return __SPIELART;
}

// Ermittelt die Spielart aus einer Tabellenzelle und setzt gameType/heim im Spielplanzeiger
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT
// cell: Tabellenzelle mit Eintrag "Liga : Heim" oder "Liga Heim"
function setSpielArtFromCell(currZAT, cell) {
    const __SPIELART = getSpielArtFromCell(cell);

    currZAT.gameType = __SPIELART[0];
    currZAT.heim     = (__SPIELART.length < 2) || (__SPIELART[1] === 'Heim');
}

// Gibt die ID fuer den Namen eines Wettbewerbs zurueck
// cell: Tabellenzelle mit Link auf den Spielberichts-Link
// gameType: Name des Wettbewerbs eines Spiels
// label: Anzuklickender Text des neuen Links
// return HTML-Link auf die Preview-Seite fuer diesen Spielbericht
function getBilanzLinkFromCell(cell, gameType, label) {
    const __GAMETYPEID = getGameTypeID(gameType);
    let ret = "";

    if (cell.textContent !== 'Vorschau') {   // Nur falls Link nicht bereits vorhanden
        if (__GAMETYPEID > 1) {              // nicht moeglich fuer "Friendly" bzw. "spielfrei"/"Frei"/"reserviert"
            const __SEARCHFUN = ":os_bericht(";
            let paarung = cell.innerHTML.substr(cell.innerHTML.indexOf(__SEARCHFUN) + __SEARCHFUN.length);

            paarung = paarung.substr(0, paarung.indexOf(')'));
            paarung = paarung.substr(0, paarung.lastIndexOf(','));
            paarung = paarung.substr(0, paarung.lastIndexOf(','));
            ret = ' <A href="javascript:spielpreview(' + paarung + ',' + __GAMETYPEID + ')">' + label + "</A>";
        }
    }

    return ret;
}

// Addiert einen Link auf die Bilanz hinter den Spielberichts-Link
// cell: Tabellenzelle mit Link auf den Spielberichts-Link
// gameType: Name des Wettbewerbs eines Spiels
// label: Anzuklickender Text des neuen Links
function addBilanzLinkToCell(cell, gameType, label) {
    const __BILANZLINK = getBilanzLinkFromCell(cell, gameType, label);

    if (__BILANZLINK !== "") {
        cell.innerHTML += __BILANZLINK;
    }
}

// ==================== Abschnitt fuer sonstige Parameter des Spielplans ====================

// Ermittelt aus dem Spielplan die Ligengroesse ueber die Sonderspieltage
// rows: Tabellenzeilen mit dem Spielplan
// startIdx: Index der Zeile mit dem ersten ZAT
// colArtIdx: Index der Spalte der Tabellenzelle mit der Spielart (z.B. "Liga : Heim")
// saison: Enthaelt die Nummer der laufenden Saison
// return 10 bei 36 Spielen, 18 bei 34 Spielen, 20 bei 38 Spielen
function getLigaSizeFromSpielplan(rows, startIdx, colArtIdx, saison) {
    const __LIGAEXTRA = getLigaExtra(saison);
    const __TEST10ER = getSpielArtFromCell(rows[startIdx + __LIGAEXTRA[0] - 1].cells[colArtIdx]);
    const __TEST20ER = getSpielArtFromCell(rows[startIdx + __LIGAEXTRA[2] - 1].cells[colArtIdx]);

    if (__TEST20ER[0] === 'Liga') {
        return 20;
    } else if (__TEST10ER[0] === 'Liga') {
        return 10;
    } else {
        return 18;
    }
}

// ==================== Ende Abschnitt fuer sonstige Parameter des Spielplans ====================

// ==================== Ende Abschnitt fuer Spielplan und ZATs ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.zat.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.warndraw.js ***/

// ==UserModule==
// _name         OS2.class.warndraw
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifischen Klassen WarnDrawPlayer, WarnDrawMessage und WarnDrawMessageAufstieg
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.class.warndraw.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse WarnDrawPlayer ====================

// Klasse fuer Ziehwarnung fuer einen Jugendspieler

/*class*/ function WarnDrawPlayer /*{
    constructor*/(player, alertColor) {
        'use strict';

        this.player = player;

        if (this.player !== undefined) {
            // Default Warnlevel...
            this.setZatLeft(player.getZatLeft());
            this.currZAT = player.currZAT;
            this.setWarn(true, true, true);
            this.colAlert = alertColor || this.alertColor();
        } else {
            // Kein Warnlevel...
            this.setZatLeft(undefined);
            this.currZAT = undefined;
            this.setWarn(false, false, false);
            this.colAlert = undefined;
        }
    }
//}

Class.define(WarnDrawPlayer, Object, {
        '__MONATEBISABR'    : 1,
        '__ZATWARNVORLAUF'  : 1,
        '__ZATMONATVORLAUF' : __MONATZATS,
        'setZatLeft'        : function(zatLeft) {
                                  this.zatLeft = zatLeft;
                              },
        'setWarn'           : function(warn, warnMonth, warnAufstieg) {
                                  this.warn = (this.aufstieg ? warnAufstieg : warn);
                                  this.warnMonth = warnMonth;
                              },
        'alertColor'        : function() {
                                  return getColor('STU');  // rot
                              },
        'getColor'          : function(color) {
                                  return ((this.mustDraw() && this.colAlert) ? this.colAlert : color);
                              },
        'calcZiehIndex'     : function(currZAT) {
                                  const __RESTZAT = this.zatLeft + currZAT;
                                  const __INDEX = parseInt(__RESTZAT / __MONATZATS + 1) - this.__MONATEBISABR;  // Lfd. Nummer des Abrechnungsmonats (0-basiert)

                                  return __INDEX;
                              },
        'isZiehAufstieg'    : function() {
                                  return this.aufstieg;
                              },
        'setAufstieg'       : function() {
                                  this.aufstieg = true;

                                  if (this.isZiehAufstieg()) {
                                      this.setZatLeft(__SAISONZATS - this.currZAT - this.__ZATWARNVORLAUF);
                                  }

                                  return this.zatLeft;
                              },
        'mustDraw'          : function() {
                                  return ((this.warn || this.warnMonth) && (this.zatLeft < this.__ZATWARNVORLAUF));
                              },
        'monthDraw'         : function() {
                                  return (this.mustDraw() || (this.warn && (this.aufstieg || this.warnMonth) && (this.zatLeft < this.__ZATMONATVORLAUF)));  // Abrechnungszeitraum vor dem letztmoeglichen Ziehen...
                              }
    });

const __NOWARNDRAW = new WarnDrawPlayer(undefined, undefined);  // inaktives Objekt

// ==================== Ende Abschnitt fuer Klasse WarnDrawPlayer ====================

// ==================== Abschnitt fuer Klasse WarnDrawMessage ====================

// Klasse fuer Warnmeldung fuer einen Jugendspieler

/*class*/ function WarnDrawMessage /*{
    constructor*/(optSet, currZAT) {
        'use strict';

        this.optSet = optSet;

        this.warn = this.optSet.getOptValue('zeigeWarnung', true);
        this.warnMonth = this.optSet.getOptValue('zeigeWarnungMonat', true);
        this.warnHome = this.optSet.getOptValue('zeigeWarnungHome', true);
        this.warnDialog = this.optSet.getOptValue('zeigeWarnungDialog', false);
        this.warnAufstieg = this.optSet.getOptValue('zeigeWarnungAufstieg', true);
        this.warnLegende = this.optSet.getOptValue('zeigeWarnungLegende', true);

        this.out = {
                       'supertag' : true,
                       'top'      : true,
                       'link'     : true,
                       'label'    : true,
                       'bottom'   : true
                   };

        this.setOptionHome();

        this.startMessage(currZAT);
    }
//}

Class.define(WarnDrawMessage, Object, {
        '__ZATWARNVORLAUF'  : 1,
        '__ZATMONATVORLAUF' : __MONATZATS,
        'startMessage'      : function(currZAT) {
                                  this.setZat(currZAT);
                                  this.createMessage();
                              },
        'setZat'            : function(currZAT) {
                                  this.currZAT = currZAT;

                                  if (currZAT === undefined) {
                                      this.abrZAT = undefined;
                                      this.rest   = undefined;
                                      this.anzahl = undefined;
                                  } else {
                                      this.configureZat();
                                  }
                              },
        'setOptionHome'     : function() {
                                  this.warnOption = this.hasHome();
                              },
        'setOptionLegende'  : function() {
                                  this.warnOption = this.hasLegende();
                              },
        'configureZat'      : function() {
                                  const __ZIEHANZAHL = this.optSet.getOptValue('ziehAnz', []);
                                  const __INDEX = parseInt(this.currZAT / __MONATZATS);

                                  this.abrZAT = (__INDEX + 1) * __MONATZATS;
                                  this.rest   = (__MONATZATS - 1) - (this.currZAT % __MONATZATS);
                                  this.anzahl = __ZIEHANZAHL[__INDEX];
                              },
        'getTextMessage'    : function() {
                                  return "ZAT " + this.abrZAT + ' ' + ((this.anzahl > 1) ? "m\u00FCssen " + this.anzahl : "muss einer") +
                                         " deiner Jugendspieler in das Profiteam \u00FCbernommen werden, ansonsten verschwinde" +
                                         ((this.anzahl > 1) ? "n sie" : "t er") + " ersatzlos!";
                              },
        'createMessage'     : function() {
                                  this.label = undefined;
                                  this.when = undefined;
                                  this.text = undefined;

                                  if (this.hasHome() || this.hasLegende() || this.hasDialog()) {
                                      if (this.anzahl > 0) {
                                          this.text = this.getTextMessage();

                                          if (this.warnMonth && (this.rest > 0)) {
                                              this.label = "Warnung";
                                              this.when = "Bis zur n\u00E4chsten Abrechnung am ";
                                          } else if ((this.warn || this.warnMonth) && (this.rest === 0)) {
                                              this.label = "LETZTE WARNUNG VOR DER ABRECHNUNG";
                                              this.when = "Bis zum n\u00E4chsten ";
                                          }
                                      }
                                  }
                              },
        'hasMessage'        : function() {
                                  return !! this.when;
                              },
        'hasHome'           : function() {
                                  return this.warnHome;
                              },
        'hasLegende'        : function() {
                                  return this.warnLegende;
                              },
        'hasOption'         : function() {
                                  return this.warnOption;
                              },
        'hasDialog'         : function() {
                                  return this.warnDialog;
                              },
        'showMessage'       : function(anchor, tag, appendFind = true) {  // appendFind: true = append, false = insertBefore, "..." search string = insert at find position
                                  let ret = (anchor || { }).innerHTML;

                                  if (this.hasMessage()) {
                                      if (this.hasOption()) {
                                          const __OLDHTML = ret;
                                          const __HTML = this.getHTML(tag);

                                          if ((typeof appendFind) === 'string') {
                                              const __INDEX = __OLDHTML.indexOf(appendFind);
                                              const __POS = (~ __INDEX) ? __INDEX : __OLDHTML.length;

                                              ret = __OLDHTML.substring(0, __POS) + __HTML + __OLDHTML.substring(__POS);
                                          } else if (appendFind) {
                                              ret = __OLDHTML + __HTML;
                                          } else {
                                              ret = __HTML + __OLDHTML;
                                          }

                                          anchor.innerHTML = ret;
                                      }
                                  }

                                  return ret;
                              },
        'showDialog'        : function(dlgFun) {
                                  if (this.hasMessage()) {
                                      if (this.hasDialog() && (this.rest === 0)) {
                                          dlgFun(this.label, this.when + this.text);
                                      }
                                  }
                              },
        'tagText'           : function(tag, text) {
                                  return ((tag !== undefined) ? this.getOpeningTag(tag) + text + this.getClosingTag(tag) : text);
                              },
        'tagParagraph'      : function(tag, text) {
                                  return this.tagText(tag, this.tagText(this.getSubTag(tag), text));
                              },
        'getSubTag'         : function(tag) {
                                  return (this.isTag(tag, 'TR') ? 'TD' + this.getColorTD() : (this.isTag(tag, 'P') ? this.getColorTag() : undefined));
                              },
        'getSuperTag'       : function(tag) {
                                  return (this.isTag(tag, 'P') ? 'DIV' : undefined);
                              },
        'getOpeningTag'     : function(tag) {
                                  return '<' + (tag || "").toUpperCase() + '>';
                              },
        'getClosingTag'     : function(tag) {
                                  const __INDEX1 = (tag ? tag.indexOf(' ') : -1);
                                  const __INDEX2 = (tag ? tag.indexOf('=') : -1);
                                  const __INDEX = ((~ __INDEX1) && (~ __INDEX2)) ? Math.min(__INDEX1, __INDEX2) : Math.max(__INDEX1, __INDEX2);
                                  const __TAGNAME = ((~ __INDEX) ? tag.substring(0, __INDEX) : tag);

                                  return this.getOpeningTag('/' + __TAGNAME);
                              },
        'isTag'             : function(tag, compareTag) {
                                  return (tag && compareTag && (tag.toUpperCase() === compareTag.toUpperCase()));
                              },
        'getLink'           : function() {
                                  return './ju.php';
                              },
        'getTopHTML'        : function(tag) {
                                  return this.tagParagraph(tag, "&nbsp;");
                              },
        'getBottomHTML'     : function(tag) {
                                  return this.tagParagraph(tag, "&nbsp;");
                              },
        'getColorTag'       : function() {
                                  return "color='red'";  // rot
                              },
        'getColorTD'        : function() {
                                  return " class='STU'";  // rot
                              },
        'getHTML'           : function(tag = 'P') {
                                  return this.tagParagraph((this.out.supertag ? this.getSuperTag(tag) : undefined), (this.out.top ? this.getTopHTML(tag) : "") +
                                         this.tagParagraph(tag, this.tagText('A', this.tagText((this.out.link ? "A href='" + this.getLink() + "'" : undefined),
                                         (this.out.label ? this.label + ": " : "") + this.when + this.text))) + (this.out.bottom ? this.getBottomHTML(tag) : ""));
                              }
    });

Object.defineProperty(WarnDrawMessage.prototype, 'innerHTML', {
        get : function() {
                  return this.getHTML('P');
              }
    });

// ==================== Ende Abschnitt fuer Klasse WarnDrawMessage ====================

// ==================== Abschnitt fuer Klasse WarnDrawMessageAufstieg ====================

// Klasse fuer Warnmeldung im Falle eines Aufstiegs fuer einen Jugendspieler

/*class*/ function WarnDrawMessageAufstieg /*extends WarnDrawMessage {
    constructor*/(optSet, currZAT) {
        'use strict';

        WarnDrawMessage.call(this, optSet, currZAT);

        this.out.top = false;  // kein Vorschub vor der Zeile

        this.warn = (this.warn && this.warnAufstieg);  // kann man ausschalten
        this.startMessage(currZAT);  // 2. Aufruf (zur Korrektur)
    }
//}

Class.define(WarnDrawMessageAufstieg, WarnDrawMessage, {
        'configureZat'      : function() {
                                  const __ZIEHANZAUFSTIEG = this.optSet.getOptValue('ziehAnzAufstieg', 0);
                                  const __INDEX = parseInt(this.currZAT / __MONATZATS);

                                  this.abrZAT = (__INDEX + 1) * __MONATZATS;
                                  this.rest   = (__MONATZATS - 1) - (this.currZAT % __MONATZATS);
                                  this.anzahl = ((this.currZAT + this.__ZATMONATVORLAUF > __SAISONZATS - this.__ZATWARNVORLAUF) ? __ZIEHANZAUFSTIEG : 0);

                                  this.warnDialog = false;     // kein Dialog fuer Aufstiegswarnung
                                  this.warnMonth = this.warn;  // nur im letzten Monat der Saison!
                              },
        'getTextMessage'    : function() {
                                  return "ZAT " + this.abrZAT + " ist im Falle eines Aufstiegs f\u00FCr " + ((this.anzahl > 1) ? "" + this.anzahl : "einen") +
                                         " deiner Jugendspieler m\u00F6glicherweise die letzte Chance, " + ((this.anzahl > 1) ? " diese noch vor ihrem" : "ihn noch vor seinem") +
                                         " Geburtstag in der n\u00E4chsten Saison in das Profiteam zu \u00FCbernehmen!";
                              },
        'getColorTag'       : function() {
                                  return "color='magenta'";  // magenta
                              },
        'getColorTD'        : function() {
                                  return " class='OMI'";  // magenta
                              }
    });

// ==================== Ende Abschnitt fuer Klasse WarnDrawMessageAufstieg ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.warndraw.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.player.js ***/

// ==UserModule==
// _name         OS2.class.player
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifischer Klasse PlayerRecord
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.class.player.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse PlayerRecord ====================

// Klasse fuer Spalten des Jugendkaders

/*class*/ function PlayerRecord /*{
    constructor*/(land, age, isGoalie, saison, currZAT, donation) {
        'use strict';

        this.land = land;
        this.age = age;
        this.isGoalie = isGoalie;

        this.saison = saison;
        this.currZAT = currZAT;
        this.donation = donation;
        this.mwFormel = ((this.saison < 10) ? this.__MWFORMEL.alt : this.__MWFORMEL.S10);

        // in new PlayerRecord() definiert:
        // this.land: TLA des Geburtslandes
        // this.age: Ganzzahliges Alter des Spielers
        // this.isGoalie: Angabe, ob es ein TOR ist
        // this.mwFormel: Benutzte MW-Formel, siehe __MWFORMEL
        // this.donation: Jugendfoerderungsbetrag in Euro

        // in this.initPlayer() definiert:
        // this.zatGeb: ZAT, an dem der Spieler Geburtstag hat, -1 fuer "noch nicht zugewiesen", also '?'
        // this.zatAge: Bisherige erfolgte Trainings-ZATs
        // this.birth: Universell eindeutige Nummer des Geburtstags-ZATs des Spielers
        // this.talent: Talent als Zahl (-1=wenig, 0=normal, +1=hoch)
        // this.aufwert: Aufwertungsstring

        // in this.calcSkills() definiert:
        // this.positions[][]: Positionstexte und Optis; TOR-Index ist 5
        // this.skills[]: Einzelskills
        // this.skillsEnd[]: Berechnet aus this.skills, this.age und aktuellerZat
        // this.zatLeft: ZATs bis zum Ende 18 (letzte Ziehmoeglichkeit)
        // this.restEnd: Korrekturterm zum Ausgleich von Rundungsfehlern mit Ende 18
        //               (also Skills, die nicht explizit in this.skillsEnd stehen)

        // in this.calcZusatz()/setZusatz() definiert:
        // this.trainiert: Anzahl der erfolgreichen Trainingspunkte
        // indirekt this.zatAge und this.bestPos

        // in this.createWarnDraw() definiert:
        // this.warnDraw: Behandlung von Warnungen Ende 18
        // this.warnDrawAufstieg: Behandlung von Warnungen bei Aufstieg

        // in this.getPos() definiert:
        // this.bestPos: erster (bester) Positionstext
    }
//}

Class.define(PlayerRecord, Object, {
        '__TIME'                : {   // Zeitpunktangaben
                                      'cre' : 0,  // Jugendspieler angelegt (mit 12 Jahren)
                                      'beg' : 1,  // Jugendspieler darf trainieren (wird 13 Jahre alt)
                                      'now' : 2,  // Aktueller ZAT
                                      'end' : 3   // Jugendspieler wird Ende 18 gezogen (Geb. - 1 bzw. ZAT 71 fuer '?')
                                  },
        '__MWFORMEL'            : {   // Zu benutzende Marktwertformel
                                      'alt' : 0,  // Marktwertformel bis Saison 9 inklusive
                                      'S10' : 1   // Marktwertformel MW5 ab Saison 10
                                  },
        '__MAXPRISKILLS'        : 4 * 99,
        'toString'              : function() {  // Bisher nur die noetigsten Werte ausgegeben...
                                      let result = "Alter\t\t" + this.age + "\n\n";
                                      result += "Aktuelle Werte\n";
                                      result += "Skillschnitt\t" + this.getSkill().toFixed(2) + '\n';
                                      result += "Optis und Marktwerte";

                                      for (let pos of this.positions) {
                                          result += "\n\t" + pos + '\t';
                                          result += this.getOpti(pos).toFixed(2) + '\t';
                                          result += getNumberString(this.getMarketValue(pos).toString());
                                      }

                                      result += "\n\nWerte mit Ende 18\n";
                                      result += "Skillschnitt\t" + this.getSkill(this.__TIME.end).toFixed(2) + '\n';
                                      result += "Optis und Marktwerte";

                                      for (let pos of this.positions) {
                                          result += "\n\t" + this.getPos() + '\t';
                                          result += this.getOpti(pos, this.__TIME.end).toFixed(2) + '\t';
                                          result += getNumberString(this.getMarketValue(pos, this.__TIME.end).toString());
                                      }

                                      return result;
                                  },  // Ende this.toString()
        'initPlayer'            : function(data, index, isSkillData = false) {  // isSkillData: true = Skilldaten, false = Basiswerte (Geb., Talent, Aufwertungen) oder keine
                                      if (data !== undefined) {
                                          if (isSkillData) {
                                              this.setSkills(data[index]);
                                          } else if (data.length >= 2){
                                              this.setGeb(data[0][index]);
                                              this.talent = data[1][index];
                                              this.aufwert = data[2][index];
                                          } else {
                                              // keine Daten
                                          }
                                      }
                                  },  // Ende this.initPlayer()
        'createWarnDraw'        : function(ziehmich = null, klasse = 1) {  // ziehmich: input Element zum Ziehen; klasse: Spielklasse 1, 2, 3
                                      // Objekte fuer die Verwaltung der Ziehwarnungen...
                                      this.warnDraw = undefined;
                                      this.warnDrawAufstieg = undefined;
                                      if (ziehmich) {
                                          const __LASTZAT = this.currZAT + this.getZatLeft();

                                          if (__LASTZAT < __SAISONZATS) {  // U19
                                              this.warnDraw = new WarnDrawPlayer(this, getColor('STU'));  // rot
                                              __LOG[5](this.getAge().toFixed(2), "rot");
                                          } else if (__LASTZAT < Math.max(2, klasse) * __SAISONZATS) {  // Rest bis inkl. U18 (Liga 1 und 2) bzw. U17 (Liga 3)
                                              // do nothing
                                          } else if (__LASTZAT < (klasse + 1) * __SAISONZATS) {  // U17/U16 je nach Liga 2/3
                                              this.warnDrawAufstieg = new WarnDrawPlayer(this, getColor('OMI'));  // magenta
                                              this.warnDrawAufstieg.setAufstieg();
                                              __LOG[5](this.getAge().toFixed(2), "magenta");
                                          }
                                      }
                                  },  // Ende this.createWarnDraw()
        'setSkills'             : function(skills) {
                                      // Berechnet die Opti-Werte, sortiert das Positionsfeld und berechnet die Einzelskills mit Ende 18
                                     this.skills = skills;

                                      const __POSREIHEN = [ 'ABW', 'DMI', 'MIT', 'OMI', 'STU', 'TOR' ];
                                      this.positions = [];
                                      for (let index = 0; index < __POSREIHEN.length; index++) {
                                          const __REIHE = __POSREIHEN[index];

                                          this.positions[index] = [ __REIHE, this.getOpti(__REIHE) ];
                                      }

                                      // Sortieren
                                      sortPositionArray(this.positions);
                                  },  // Ende this.setSkills()
        'prognoseSkills'        : function() {
                                      // Einzelskills mit Ende 18 berechnen
                                      this.skillsEnd = [];

                                      const __ZATDONE = this.getZatDone();
                                      const __ZATTOGO = this.getZatLeft();
                                      const __ADDRATIO = (__ZATDONE ? __ZATTOGO / __ZATDONE : 0);

                                      let addSkill = __ZATTOGO * this.getAufwertungsSchnitt();

                                      for (let i in this.skills) {
                                          const __SKILL = this.skills[i];
                                          let progSkill = __SKILL;

                                          if (isTrainableSkill(i)) {
                                              // Auf ganze Zahl runden und parseInt(), da das sonst irgendwie als String interpretiert wird
                                              const __ADDSKILL = Math.min(99 - progSkill, getMulValue(__ADDRATIO, __SKILL, 0, Number.NaN));

                                              progSkill += __ADDSKILL;
                                              addSkill -= __ADDSKILL;
                                          }

                                          this.skillsEnd[i] = progSkill;
                                      }
                                      this.restEnd = addSkill;
                                  },  // Ende this.prognoseSkills()
        'setZusatz'             : function(zatAge, trainiert, bestPos) {
                                      // Setzt Nebenwerte fuer den Spieler (geht ohne initPlayer())
                                      if (zatAge !== undefined) {
                                          this.zatAge = zatAge;
                                      }
                                      this.trainiert = trainiert;
                                      this.bestPos = bestPos;
                                  },
        'calcZusatz'            : function() {
                                      // Ermittelt Nebenwerte fuer den Spieler und gibt sie alle zurueck (nach initPlayer())
                                      // this.zatAge und this.skills bereits in initPlayer() berechnet
                                      this.trainiert = this.getTrainiert(true);  // neu berechnet aus Skills
                                      let bestPos = this.getPos(-1);  // hier: -1 explizit angeben, damit neu ermittelt (falls this.bestPos noch nicht belegt)

                                      return {
                                                 'zatAge'     : this.zatAge,
                                                 'trainiert'  : this.trainiert,
                                                 'bestPos'    : bestPos
                                             };
                                  },
        'getGeb'                : function() {
                                      return (this.zatGeb < 0) ? '?' : this.zatGeb;
                                  },
        'setGeb'                : function(gebZAT) {
                                      this.zatGeb = gebZAT;
                                      this.zatAge = this.calcZatAge(this.currZAT);
                                      this.birth = (36 + this.saison) * __SAISONZATS + this.currZAT - this.zatAge;
                                  },
        'calcZatAge'            : function(currZAT) {
                                      let zatAge;

                                      if (this.zatGeb !== undefined) {
                                          let ZATs = __SAISONZATS * (this.age - ((currZAT < this.zatGeb) ? 12 : 13));  // Basiszeit fuer die Jahre seit Jahrgang 13

                                          if (this.zatGeb < 0) {
                                              zatAge = ZATs + currZAT;  // Zaehlung begann Anfang der Saison (und der Geburtstag wird erst nach dem Ziehen bestimmt)
                                          } else {
                                              zatAge = ZATs + currZAT - this.zatGeb;  // Verschiebung relativ zum Geburtstag (von -zatGeb, ..., 0, ..., 71 - zatGeb)
                                          }
                                      }

                                      return zatAge;
                                  },
        'getZatAge'             : function(when = this.__TIME.now) {
                                      if (when === this.__TIME.end) {
                                          return (18 - 12) * __SAISONZATS - 1;  // (max.) Trainings-ZATs bis Ende 18
                                      } else if (this.zatAge !== undefined) {
                                          return this.zatAge;
                                      } else {
                                          __LOG[3]("Empty getZatAge()");

                                          return Number.NaN;
                                      }
                                  },
        'getZatDone'            : function(when = this.__TIME.now) {
                                      return Math.max(0, this.getZatAge(when));
                                  },
        'getZatLeft'            : function(when = this.__TIME.now) {
                                      if (this.zatLeft === undefined) {
                                          this.zatLeft = this.getZatDone(this.__TIME.end) - this.getZatDone(when);
                                      }

                                      return this.zatLeft;
                                  },
        'calcZiehIndex'         : function() {
                                      //const __RESTZAT = this.getZatAge(this.__TIME.end) - this.getZatAge() + this.currZAT;
                                      //const __INDEX = parseInt(__RESTZAT / __MONATZATS + 1) - 1;  // Lfd. Nummer des Abrechnungsmonats (0-basiert)

                                      return (this.warnDraw && this.warnDraw.calcZiehIndex(this.currZAT));
                                  },
        'isZiehAufstieg'        : function() {
                                      return (this.warnDrawAufstieg && this.warnDrawAufstieg.isZiehAufstieg());
                                  },
        'getAge'                : function(when = this.__TIME.now) {
                                      if (this.mwFormel === this.__MWFORMEL.alt) {
                                          return (when === this.__TIME.end) ? 18 : this.age;
                                      } else {  // Geburtstage ab Saison 10...
                                          return (13.00 + this.getZatAge(when) / __SAISONZATS);
                                      }
                                  },
        'getTrainiert'          : function(recalc = false) {
                                      if (recalc || (this.trainiert === undefined)) {
                                          this.trainiert = this.getTrainableSkills();
                                      }

                                      return this.trainiert;
                                  },
        'getAufwertungsSchnitt' : function() {
                                      const __ZATDONE = this.getZatDone();

                                      if (__ZATDONE) {
                                          return parseFloat(this.getTrainiert() / __ZATDONE);
                                      } else {
                                          // Je nach Talentklasse mittlerer Aufwertungsschnitt aller Talente der Klasse
                                          // (gewichtet nach Verteilung der Talentstufen in dieser Talentklasse)
                                          return (1 + (this.talent / 3.6)) * (this.donation / 10000);
                                      }
                                  },
        'getPos'                : function(idx = 0) {
                                      const __IDXOFFSET = 1;

                                      switch (idx) {
                                      case -1 : return (this.bestPos = this.positions[this.isGoalie ? 5 : 0][0]);
                                      case  0 : return this.bestPos;
                                      default : return this.positions[idx - __IDXOFFSET][0];
                                      }
                                  },
        'getPosPercent'         : function(idx = 0) {
                                      const __IDXOFFSET = 1;
                                      const __OPTI = this.positions[this.isGoalie ? 5 : 0][1];
                                      let optiSec = __OPTI;

                                      switch (idx) {
                                      case -1 : break;  // __OPTI
                                      case  0 : optiSec = (this.isGoalie ? 0 : this.positions[1][1]);  // Backup-Wert (TOR: keiner)
                                                break;
                                      default : optiSec = this.positions[idx - __IDXOFFSET][1];
                                      }

                                      return parseFloat(100 * optiSec / __OPTI);
                                  },
        'getTalent'             : function() {
                                      return (this.talent < 0) ? 'wenig' : (this.talent > 0) ? 'hoch' : 'normal';
                                  },
        'getAufwert'            : function() {
                                      return this.aufwert;
                                  },
        'boldPriSkillNames'     : function(text) {
                                      const __PRISKILLNAMES = this.getPriSkillNames();

                                      return (! text) ? text : text.replace(/\w+/g, function(name) {
                                                                                        return ((~ __PRISKILLNAMES.indexOf(name)) ? '<B>' + name + '</B>' : name);
                                                                                    });
                                  },
        'getPriSkillNames'      : function(pos = undefined) {
                                      return getSkillNameArray(getIdxPriSkills(pos ? pos : this.getPos()), this.isGoalie);
                                  },
        'getSkillSum'           : function(when = this.__TIME.now, idxSkills = undefined, restRate = 15) {
                                      let cachedItem;

                                      if (idxSkills === undefined) {  // Gesamtsumme ueber alle Skills wird gecached...
                                          cachedItem = ((when === this.__TIME.end) ? 'skillSumEnd' : 'skillSum');

                                          const __CACHED = this[cachedItem];

                                          if (__CACHED !== undefined) {
                                              return __CACHED;
                                          }

                                          idxSkills = getIdxAllSkills();
                                      }

                                      const __SKILLS = ((when === this.__TIME.end) ? this.skillsEnd : this.skills);
                                      let sumSkills = ((when === this.__TIME.end) ? (restRate / 15) * this.restEnd : 0);

                                      if (__SKILLS) {
                                          for (let idx of idxSkills) {
                                              sumSkills += __SKILLS[idx];
                                          }
                                      }

                                      if (cachedItem !== undefined) {
                                          this[cachedItem] = sumSkills;
                                      }

                                      return sumSkills;
                                  },
        'getSkill'              : function(when = this.__TIME.now) {
                                      return this.getSkillSum(when) / __NUMSKILLS;
                                  },
        'getOpti'               : function(pos, when = this.__TIME.now) {
                                      const __SUMALLSKILLS = this.getSkillSum(when);
                                      const __SUMPRISKILLS = this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4);
                                      const __OVERFLOW = Math.max(0, __SUMPRISKILLS - this.__MAXPRISKILLS);
/*if (this.zatGeb === 24) {
    console.error("__OVERFLOW = " + __OVERFLOW);
    console.error("__SUMALLSKILLS = " + __SUMALLSKILLS);
    console.error("__SUMPRISKILLS = " + __SUMPRISKILLS);
    console.error("getOpti(" + pos + ") = " + ((4 * (__SUMPRISKILLS - __OVERFLOW) + __SUMALLSKILLS) / __NUMOPTI));
}*/
                                      return (4 * (__SUMPRISKILLS - __OVERFLOW) + __SUMALLSKILLS) / __NUMOPTI;
                                  },
        'getPrios'              : function(pos, when = this.__TIME.now) {
                                      return Math.min(this.__MAXPRISKILLS, this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4)) / 4;
                                  },
        'getPriPercent'         : function(pos, when = this.__TIME.now) {
                                      const __SUMPRISKILLS = this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4);
                                      const __SUMSECSKILLS = this.getSkillSum(when, getIdxSecSkills(pos), 7);
                                      const __OVERFLOW = Math.max(0, __SUMPRISKILLS - this.__MAXPRISKILLS);

                                      return (100 * (__SUMPRISKILLS - __OVERFLOW)) / (__SUMPRISKILLS + __SUMSECSKILLS);
                                  },
        'getSecPercent'         : function(pos, when = this.__TIME.now) {
                                      const __SUMPRISKILLS = this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4);
                                      const __SUMSECSKILLS = this.getSkillSum(when, getIdxSecSkills(pos), 7);
                                      const __OVERFLOW = Math.max(0, __SUMPRISKILLS - this.__MAXPRISKILLS);

                                      return (100 * (__SUMSECSKILLS + __OVERFLOW)) / (__SUMPRISKILLS + __SUMSECSKILLS);
                                  },
        'getTrainableSkills'    : function(when = this.__TIME.now) {
                                      return this.getSkillSum(when, getIdxTrainableSkills());
                                  },
        'getFixSkills'          : function() {
                                      return this.getSkillSum(this.__TIME.now, getIdxFixSkills());
                                  },
        'getMarketValue'        : function(pos, when = this.__TIME.now) {
                                      const __MW = calcMarketValue(this.getAge(when),
                                                                   this.getSkill(when),
                                                                   this.getOpti(pos, when),
                                                                   ((this.mwFormel === this.__MWFORMEL.alt)
                                                                        ? __MW9FORMEL : __MW10FORMEL));

                                      return __MW;
                                  },
        'getFingerPrint'        : function() {
                                      // Jeweils gleichbreite Werte: (Alter/Geb.=>Monat), Land, Talent ('-', '=', '+')...
                                      const __BASEPART = padNumber(this.birth / __MONATZATS, 3) + padLeft(this.land, -3);
                                      const __TALENT = '-=+'[this.talent + 1];

                                      if (this.skills === undefined) {
                                          return __BASEPART + getValue(__TALENT, "");
                                      } else {
                                          const __SKILLS = this.skills;
                                          const __FIXSKILLS = getIdxFixSkills().slice(-4);  // ohne die Nullen aus FUQ und ERF
                                          const __FIXSKILLSTR = __FIXSKILLS.map(function(idx) {
                                                                                    return padNumber(__SKILLS[idx], -2);
                                                                                }).join("");

                                          // Jeweils gleichbreite Werte: Zusaetzlich vier der sechs Fixskills...
                                          return (__BASEPART + getValue(__TALENT, '?') + __FIXSKILLSTR);
                                      }
                                  },
        'isFingerPrint'         : function(fpA, fpB) {
                                      if (fpA && fpB) {
                                          if (fpA === fpB) {
                                              return true;  // voellig identisch
                                          } else if (this.isBaseFingerPrint(fpA, fpB)) {
                                              return 1;  // schwaches true
                                          }
                                      }

                                      return false;
                                  },
        'isBaseFingerPrint'     : function(fpA, fpB) {
                                      if (fpA && fpB) {
                                          if (this.getBaseFingerPrint(fpA) === this.getBaseFingerPrint(fpB)) {
                                              // Base ist identisch...
                                              if ((getValue(fpA[6], '?') === '?') || (getValue(fpB[6], '?') === '?') || (fpA[6] === fpB[6])) {
                                                  // ... und auch das Talent-Zeichen ist leer oder '?'...
                                                  return true;
                                              }
                                          }
                                      }

                                      return false;
                                  },
        'getBaseFingerPrint'    : function(fingerprint) {
                                      return (fingerprint ? fingerprint.slice(0, 6) : undefined);
                                  },
        'getCatFromFingerPrint' : function(fingerprint) {
                                      return (fingerprint ? floorValue((fingerprint.slice(0, 3) - 1) / 12) : undefined);
                                  },
        'getCat'                : function() {
                                      return (this.birth ? floorValue((this.birth - 1) / __SAISONZATS) : undefined);
                                  },
        'findInFingerPrints'    : function(fingerprints) {
                                      const __MYFINGERPRINT = this.getFingerPrint();  // ggfs. unvollstaendiger Fingerprint
                                      const __MYCAT = this.getCat();
                                      const __RET = [];

                                      if (__MYCAT !== undefined) {
                                          for (let id in fingerprints) {
                                              const __CAT = this.getCatFromFingerPrint(id);

                                              if (__CAT === __MYCAT) {
                                                  if (this.isFingerPrint(id, __MYFINGERPRINT)) {
                                                      __RET.push(id);
                                                      break;  // erster Treffer zaehlt
                                                  }
                                              }
                                          }
                                      }

                                      return ((__RET.length === 1) ? __RET[0] : undefined);
                                  }
    });

// Hilfsfunktionen **********************************************************************

// Sortiert das Positionsfeld per BubbleSort
function sortPositionArray(array) {
    const __TEMP = [];
    let transposed = true;
    // TOR soll immer die letzte Position im Feld sein, deshalb - 1
    let length = array.length - 1;

    while (transposed && (length > 1)) {
        transposed = false;
        for (let i = 0; i < length - 1; i++) {
            // Vergleich Opti-Werte:
            if (array[i][1] < array[i + 1][1]) {
                // vertauschen
                __TEMP[0] = array[i][0];
                __TEMP[1] = array[i][1];
                array[i][0] = array[i + 1][0];
                array[i][1] = array[i + 1][1];
                array[i + 1][0] = __TEMP[0];
                array[i + 1][1] = __TEMP[1];
                transposed = true;
            }
        }
        length--;
    }
}

// ==================== Ende Abschnitt fuer Klasse PlayerRecord ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.player.js ***/

/*** Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.column.js ***/

// ==UserModule==
// _name         OS2.class.column
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifischer Klasse ColumnManager
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.class.column.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse ColumnManager ====================

// Klasse fuer Spalten des Jugendkaders

/*class*/ function ColumnManager /*{
    constructor*/(optSet, colIdx, showCol) {
        'use strict';

        __LOG[4]("ColumnManager()");

        const __SHOWCOL = getValue(showCol, true);
        const __SHOWALL = ((__SHOWCOL === true) || (__SHOWCOL.Default === true));

        const __BIRTHDAYS = optSet.getOptValue('birthdays', []).length;
        const __TCLASSES = optSet.getOptValue('tClasses', []).length;
        const __PROGRESSES = optSet.getOptValue('progresses', []).length;

        const __ZATAGES = optSet.getOptValue('zatAges', []).length;
        const __TRAINIERT = optSet.getOptValue('trainiert', []).length;
        const __POSITIONS = optSet.getOptValue('positions', []).length;

        const __EINZELSKILLS = optSet.getOptValue('skills', []).length;
        const __PROJECTION = (__EINZELSKILLS && __ZATAGES);

        this.colIdx = colIdx;

        this.saison = optSet.getOptValue('saison');
        this.gt = optSet.getOptValue('zeigeJahrgang');
        this.gtUxx = optSet.getOptValue('zeigeUxx');

        this.fpId = (__BIRTHDAYS && __TCLASSES && __POSITIONS && getValue(__SHOWCOL.zeigeId, __SHOWALL) && optSet.getOptValue('zeigeId'));
        this.warn = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnung, __SHOWALL) && optSet.getOptValue('zeigeWarnung'));
        this.warnMonth = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungMonat, __SHOWALL) && optSet.getOptValue('zeigeWarnungMonat'));
        this.warnHome = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungHome, __SHOWALL) && optSet.getOptValue('zeigeWarnungHome'));
        this.warnDialog = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungDialog, __SHOWALL) && optSet.getOptValue('zeigeWarnungDialog'));
        this.warnAufstieg = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungAufstieg, __SHOWALL) && optSet.getOptValue('zeigeWarnungAufstieg'));
        this.warnLegende = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungLegende, __SHOWALL) && optSet.getOptValue('zeigeWarnungLegende'));
        this.bar = (__PROJECTION && getValue(__SHOWCOL.zeigeBalken, __SHOWALL) && optSet.getOptValue('zeigeBalken'));
        this.barAbs = optSet.getOptValue('absBalken');
        this.donor = optSet.getOptValue('foerderung');
        this.geb = (__BIRTHDAYS && getValue(__SHOWCOL.zeigeGeb, __SHOWALL) && optSet.getOptValue('zeigeGeb'));
        this.tal = (__TCLASSES && getValue(__SHOWCOL.zeigeTal, __SHOWALL) && optSet.getOptValue('zeigeTal'));
        this.quo = (__ZATAGES && __TRAINIERT && getValue(__SHOWCOL.zeigeQuote, __SHOWALL) && optSet.getOptValue('zeigeQuote'));
        this.aufw = (__PROGRESSES && getValue(__SHOWCOL.zeigeAufw, __SHOWALL) && optSet.getOptValue('zeigeAufw'));
        this.substAge = (__ZATAGES && getValue(__SHOWCOL.ersetzeAlter, __SHOWALL) && optSet.getOptValue('ersetzeAlter'));
        this.alter = (__ZATAGES && getValue(__SHOWCOL.zeigeAlter, __SHOWALL) && optSet.getOptValue('zeigeAlter'));
        this.fix = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeFixSkills, __SHOWALL) && optSet.getOptValue('zeigeFixSkills'));
        this.tr = (__EINZELSKILLS && __TRAINIERT && getValue(__SHOWCOL.zeigeTrainiert, __SHOWALL) && optSet.getOptValue('zeigeTrainiert'));
        this.zat = (__ZATAGES && getValue(__SHOWCOL.zeigeZatDone, __SHOWALL) && optSet.getOptValue('zeigeZatDone'));
        this.antHpt = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeAnteilPri, __SHOWALL) && optSet.getOptValue('zeigeAnteilPri'));
        this.antNeb = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeAnteilSec, __SHOWALL) && optSet.getOptValue('zeigeAnteilSec'));
        this.pri = (__EINZELSKILLS && getValue(__SHOWCOL.zeigePrios, __SHOWALL) && optSet.getOptValue('zeigePrios'));
        this.skill = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeSkill, __SHOWALL) && optSet.getOptValue('zeigeSkill'));
        this.pos = (__EINZELSKILLS && __POSITIONS && getValue(__SHOWCOL.zeigePosition, __SHOWALL) && optSet.getOptValue('zeigePosition'));
        this.anzOpti = ((__EINZELSKILLS && getValue(__SHOWCOL.zeigeOpti, __SHOWALL)) ? optSet.getOptValue('anzahlOpti') : 0);
        this.anzMw =  ((__PROJECTION && getValue(__SHOWCOL.zeigeMW, __SHOWALL)) ? optSet.getOptValue('anzahlMW') : 0);
        this.substSkills = (__PROJECTION && getValue(__SHOWCOL.ersetzeSkills, __SHOWALL) && optSet.getOptValue('ersetzeSkills'));
        this.trE = (__PROJECTION && __TRAINIERT && getValue(__SHOWCOL.zeigeTrainiertEnde, __SHOWALL) && optSet.getOptValue('zeigeTrainiertEnde'));
        this.zatE = (__ZATAGES && getValue(__SHOWCOL.zeigeZatLeft, __SHOWALL) && optSet.getOptValue('zeigeZatLeft'));
        this.antHptE = (__PROJECTION && getValue(__SHOWCOL.zeigeAnteilPriEnde, __SHOWALL) && optSet.getOptValue('zeigeAnteilPriEnde'));
        this.antNebE = (__PROJECTION && getValue(__SHOWCOL.zeigeAnteilSecEnde, __SHOWALL) && optSet.getOptValue('zeigeAnteilSecEnde'));
        this.priE = (__PROJECTION && getValue(__SHOWCOL.zeigePriosEnde, __SHOWALL) && optSet.getOptValue('zeigePriosEnde'));
        this.skillE = (__PROJECTION && getValue(__SHOWCOL.zeigeSkillEnde, __SHOWALL) && optSet.getOptValue('zeigeSkillEnde'));
        this.anzOptiE = ((__PROJECTION && getValue(__SHOWCOL.zeigeOptiEnde, __SHOWALL)) ? optSet.getOptValue('anzahlOptiEnde') : 0);
        this.anzMwE = ((__PROJECTION && getValue(__SHOWCOL.zeigeMWEnde, __SHOWALL)) ? optSet.getOptValue('anzahlMWEnde') : 0);
        this.kennzE = optSet.getOptValue('kennzeichenEnde');
    }
//}

Class.define(ColumnManager, Object, {
        'toString'       : function() {  // Bisher nur die noetigsten Parameter ausgegeben...
                               let result = "Skillschnitt\t\t" + this.skill + '\n';
                               result += "Beste Position\t" + this.pos + '\n';
                               result += "Optis\t\t\t" + this.anzOpti + '\n';
                               result += "Marktwerte\t\t" + this.anzMw + '\n';
                               result += "Skillschnitt Ende\t" + this.skillE + '\n';
                               result += "Optis Ende\t\t" + this.anzOptiE + '\n';
                               result += "Marktwerte Ende\t" + this.anzMwE + '\n';

                               return result;
                           },
        'addCell'        : function(tableRow) {
                               return tableRow.insertCell(-1);
                           },
        'addAndFillCell' : function(tableRow, value, color, align, digits = 2) {
                               let text = value;

                               if ((value || (value === 0)) && isFinite(value) && (value !== true) && (value !== false)) {
                                   // Zahl einfuegen
                                   if (value < 1000) {
                                       // Mit Nachkommastellen darstellen
                                       text = parseFloat(value).toFixed(digits);
                                   } else {
                                       // Mit Tausenderpunkten darstellen
                                       text = getNumberString(value.toString());
                                   }
                               }

                               // String, Boolean oder Zahl einfuegen...
                               const __CELL = this.addCell(tableRow);

                               __CELL.innerHTML = text;
                               if (color) {
                                   __CELL.style.color = color;
                               }
                               if (align) {
                                   __CELL.align = align;
                               }

                               return __CELL;
                           },
        'addAndBarCell'  : function(tableRow, value, scale = 100, offset = 0, width = 100, height = 10, zoom = 100) {
                               const __VALUE = ((scale && isFinite(value)) ? ((value - offset) / Math.max(1, scale - offset) * 100) : 0);

                               // HTML-Code fuer Anteilsbalken einfuegen...
                               const __CELL = this.addCell(tableRow);

                               __CELL.innerHTML = this.getBarImg(__VALUE, width, height, zoom);
                               __CELL.align = 'left';

                               return __CELL;
                           },
        'getBarImg'      : function(value, width = 100, height = 10, zoom = 100) {
                               const __IMAGE = Math.min(99, Math.max(0, getMulValue(value, 1, 0, 0)));
                               const __LENGTH = getMulValue(width / 100, getMulValue(zoom / 100, value, 0, 0), 0, 0);
                               const __WIDTH = Math.min(width, __LENGTH);
                               const __HEIGHT = Math.max(3, getMulValue(zoom / 100, height * (__LENGTH / __WIDTH), 0, 0));

                               // HTML-Code fuer Anteilsbalken...
                               return '<IMG src="images/balken/' + __IMAGE + '.GIF" width="' + __WIDTH + '" height="' + __HEIGHT + '">';
                           },
        'addTitles'      : function(headers, titleColor = '#FFFFFF') {
                               // Spaltentitel zentrieren
                               headers.align = 'center';

                               // Titel fuer die aktuellen Werte
                               if (this.fpId) {
                                   this.addAndFillCell(headers, "Identifikation", titleColor);
                               }
                               if (this.bar) {
                                   this.addAndFillCell(headers, "Qualit\u00E4t", titleColor);
                               }
                               if (this.tal) {
                                   this.addAndFillCell(headers, "Talent", titleColor);
                               }
                               if (this.quo) {
                                   this.addAndFillCell(headers, "Quote", titleColor);
                               }
                               if (this.aufw) {
                                   this.addAndFillCell(headers, "Aufwertung", titleColor);
                               }
                               if (this.geb) {
                                   this.addAndFillCell(headers, "Geb.", titleColor);
                               }
                               if (this.alter && ! this.substAge) {
                                   this.addAndFillCell(headers, "Alter", titleColor);
                               }
                               if (this.fix) {
                                   this.addAndFillCell(headers, "fix", titleColor);
                               }
                               if (this.tr) {
                                   this.addAndFillCell(headers, "tr.", titleColor);
                               }
                               if (this.zat) {
                                   this.addAndFillCell(headers, "ZAT", titleColor);
                               }
                               if (this.antHpt) {
                                   this.addAndFillCell(headers, "%H", titleColor);
                               }
                               if (this.antNeb) {
                                   this.addAndFillCell(headers, "%N", titleColor);
                               }
                               if (this.pri) {
                                   this.addAndFillCell(headers, "Prios", titleColor);
                               }
                               if (this.skill) {
                                   this.addAndFillCell(headers, "Skill", titleColor);
                               }
                               if (this.pos) {
                                   this.addAndFillCell(headers, "Pos", titleColor);
                               }
                               for (let i = 1; i <= 6; i++) {
                                   if (i <= this.anzOpti) {
                                       this.addAndFillCell(headers, "Opti " + i, titleColor);
                                   }
                                   if (i <= this.anzMw) {
                                       this.addAndFillCell(headers, "MW " + i, titleColor);
                                   }
                               }

                               // Titel fuer die Werte mit Ende 18
                               if (this.trE) {
                                   this.addAndFillCell(headers, "tr." + this.kennzE, titleColor);
                               }
                               if (this.zatE) {
                                   this.addAndFillCell(headers, "ZAT" + this.kennzE, titleColor);
                               }
                               if (this.antHptE) {
                                   this.addAndFillCell(headers, "%H" + this.kennzE, titleColor);
                               }
                               if (this.antNebE) {
                                   this.addAndFillCell(headers, "%N" + this.kennzE, titleColor);
                               }
                               if (this.priE) {
                                   this.addAndFillCell(headers, "Prios" + this.kennzE, titleColor);
                               }
                               if (this.skillE) {
                                   this.addAndFillCell(headers, "Skill" + this.kennzE, titleColor);
                               }
                               for (let i = 1; i <= 6; i++) {
                                   if (i <= this.anzOptiE) {
                                       this.addAndFillCell(headers, "Opti " + i + this.kennzE, titleColor);
                                   }
                                   if (i <= this.anzMwE) {
                                       this.addAndFillCell(headers, "MW " + i + this.kennzE, titleColor);
                                   }
                               }
                           },  // Ende addTitles()
        'addValues'      : function(player, playerRow, color = '#FFFFFF') {
                               // Warnlevel des Spielers anpassen...
                               const __WARNDRAW = player.warnDraw || player.warnDrawAufstieg || __NOWARNDRAW;
                               __WARNDRAW.setWarn(this.warn, this.warnMonth, this.warnAufstieg);

                               const __IDXPRI = getIdxPriSkills(player.getPos());
                               const __COLOR = __WARNDRAW.getColor(player.isGoalie ? getColor('TOR') : color); // Angepasst an Ziehwarnung
                               const __POS1COLOR = getColor((player.getPosPercent() > 99.99) ? 'LEI' : player.getPos());

                               // Aktuelle Werte
                               if (this.fpId) {
                                   this.addAndFillCell(playerRow, player.getFingerPrint(), __COLOR);
                               }
                               if (this.bar) {
                                   const __VALUE = player.getPrios(player.getPos(), player.__TIME.end);
                                   const __SCALE = (this.barAbs ? 100 : (this.donor / 125));
                                   const __OFFSET = (this.barAbs ? 0 : Math.pow(__SCALE / 20, 2));
                                   const __ZOOM = 50 + __SCALE / 2;

                                   this.addAndBarCell(playerRow, __VALUE, __SCALE, __OFFSET, 100, 10, __ZOOM);
                               }
                               if (this.tal) {
                                   this.addAndFillCell(playerRow, player.getTalent(), __COLOR);
                               }
                               if (this.quo) {
                                   this.addAndFillCell(playerRow, player.getAufwertungsSchnitt(), __COLOR, null, 2);
                               }
                               if (this.colIdx.Auf) {
                                   convertStringFromHTML(playerRow.cells, this.colIdx.Auf, function(aufwert) {
                                                                                               return player.boldPriSkillNames(aufwert);
                                                                                           });
                               }
                               if (this.aufw) {
                                   this.addAndFillCell(playerRow, player.boldPriSkillNames(player.getAufwert()), __COLOR, 'left');
                               }
                               if (this.geb) {
                                   this.addAndFillCell(playerRow, player.getGeb(), __COLOR, null, 0);
                               }
                               if (this.substAge) {
                                   convertStringFromHTML(playerRow.cells, this.colIdx.Age, function(value) {
                                                                                               UNUSED(value);
                                                                                               return parseFloat(player.getAge()).toFixed(2);
                                                                                           });
                               } else if (this.alter) {
                                   this.addAndFillCell(playerRow, player.getAge(), __COLOR, null, 2);
                               }
                               if (__WARNDRAW.monthDraw()) {  // Abrechnungszeitraum vor dem letztmoeglichen Ziehen...
                                   formatCell(playerRow.cells[this.colIdx.Age], true, __WARNDRAW.colAlert, null, 1.0);
                               }
                               if (this.fix) {
                                   this.addAndFillCell(playerRow, player.getFixSkills(), __COLOR, null, 0);
                               }
                               if (this.tr) {
                                   this.addAndFillCell(playerRow, player.getTrainableSkills(), __COLOR, null, 0);
                               }
                               if (this.zat) {
                                   this.addAndFillCell(playerRow, player.getZatDone(), __COLOR, null, 0);
                               }
                               if (this.antHpt) {
                                   this.addAndFillCell(playerRow, player.getPriPercent(player.getPos()), __COLOR, null, 0);
                               }
                               if (this.antNeb) {
                                   this.addAndFillCell(playerRow, player.getSecPercent(player.getPos()), __COLOR, null, 0);
                               }
                               if (this.pri) {
                                   this.addAndFillCell(playerRow, player.getPrios(player.getPos()), __COLOR, null, 1);
                               }
                               if (this.skill) {
                                   this.addAndFillCell(playerRow, player.getSkill(), __COLOR, null, 2);
                               }
                               if (this.pos) {
                                   this.addAndFillCell(playerRow, player.getPos(), __POS1COLOR);
                               }
                               for (let i = 1; i <= 6; i++) {
                                   const __POSI = ((i === 1) ? player.getPos() : player.getPos(i));
                                   const __COLI = getColor(__POSI);

                                   if (i <= this.anzOpti) {
                                       if ((i === 1) || ! player.isGoalie) {
                                           // Opti anzeigen
                                           this.addAndFillCell(playerRow, player.getOpti(__POSI), __COLI, null, 2);
                                       } else {
                                           // TOR, aber nicht bester Opti -> nur Zelle hinzufuegen
                                           this.addCell(playerRow);
                                       }
                                   }
                                   if (i <= this.anzMw) {
                                       if ((i === 1) || ! player.isGoalie) {
                                           // MW anzeigen
                                           this.addAndFillCell(playerRow, player.getMarketValue(__POSI), __COLI, null, 0);
                                       } else {
                                           // TOR, aber nicht bester MW -> nur Zelle hinzufuegen
                                           this.addCell(playerRow);
                                       }
                                   }
                               }

                               // Einzelwerte mit Ende 18
                               if (this.colIdx.Einz) {
                                   if (this.substSkills) {
                                       convertArrayFromHTML(playerRow.cells, this.colIdx.Einz, player.skillsEnd, function(value, cell, arr, index) {
                                                                                                                     UNUSED(arr);
                                                                                                                     if (~ __IDXPRI.indexOf(index)) {
                                                                                                                         formatCell(cell, true, __OSBLAU, __POS1COLOR, 1.0);
                                                                                                                     }
                                                                                                                     return value;
                                                                                                                 });
                                   } else {
                                       convertArrayFromHTML(playerRow.cells, this.colIdx.Einz, player.skills.length, function(value, cell, arr, index) {
                                                                                                                         UNUSED(arr);
                                                                                                                         if (~ __IDXPRI.indexOf(index)) {
                                                                                                                             formatCell(cell, true, __POS1COLOR, null, 1.0);
                                                                                                                         }
                                                                                                                         return value;
                                                                                                                     });
                                   }
                               }
                               if (this.trE) {
                                   this.addAndFillCell(playerRow, player.getTrainableSkills(player.__TIME.end), __COLOR, null, 1);
                               }
                               if (this.zatE) {
                                   this.addAndFillCell(playerRow, player.getZatLeft(), __COLOR, null, 0);
                               }
                               if (this.antHptE) {
                                   this.addAndFillCell(playerRow, player.getPriPercent(player.getPos(), player.__TIME.end), __COLOR, null, 0);
                               }
                               if (this.antNebE) {
                                   this.addAndFillCell(playerRow, player.getSecPercent(player.getPos(), player.__TIME.end), __COLOR, null, 0);
                               }
                               if (this.priE) {
                                   this.addAndFillCell(playerRow, player.getPrios(player.getPos(), player.__TIME.end), __COLOR, null, 1);
                               }
                               if (this.skillE) {
                                   this.addAndFillCell(playerRow, player.getSkill(player.__TIME.end), __COLOR, null, 2);
                               }
                               for (let i = 1; i <= 6; i++) {
                                   const __POSI = ((i === 1) ? player.getPos() : player.getPos(i));
                                   const __COLI = getColor(__POSI);

                                   if (i <= this.anzOptiE) {
                                       if ((i === 1) || ! player.isGoalie) {
                                           // Opti anzeigen
                                           this.addAndFillCell(playerRow, player.getOpti(__POSI, player.__TIME.end), __COLI, null, 2);
                                       } else {
                                           // TOR, aber nicht bester Opti -> nur Zelle hinzufuegen
                                           this.addCell(playerRow);
                                       }
                                   }
                                   if (i <= this.anzMwE) {
                                       if ((i === 1) || ! player.isGoalie) {
                                           // MW anzeigen
                                           this.addAndFillCell(playerRow, player.getMarketValue(__POSI, player.__TIME.end), __COLI, null, 0);
                                       } else {
                                           // TOR, aber nicht bester MW -> nur Zelle hinzufuegen
                                           this.addCell(playerRow);
                                       }
                                   }
                               }
                           },  // Ende addValues(player, playerRow)
        'setGroupTitle'  : function(tableRow) {
                               if (this.gtUxx) {
                                   const __CELL = tableRow.cells[0];
                                   const __SAI = __CELL.innerHTML.match(/Saison (\d+)/)[1];
                                   const __JG = 13 + this.saison - __SAI;

                                   __CELL.innerHTML = __CELL.innerHTML.replace('Jahrgang', 'U' + __JG + ' - $&');
                               }

                               tableRow.style.display = (this.gt ? '' : 'none');
                           }  // Ende setGroupTitle(tableRow)
    });

// ==================== Ende Abschnitt fuer Klasse ColumnManager ====================

// *** EOF ***

/*** Ende Modul https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.column.js ***/

/*** Benutzerskript https://eselce.github.io/GitTest/misc/OS2/OS2.training.user.js ***/

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Konfigurations-Abschnitt fuer Optionen ====================

const __LOGLEVEL = 9;

// Moegliche Optionen (hier die Standardwerte editieren oder ueber das Benutzermenu setzen):
const __OPTCONFIG = {
    'zeigeId' : {         // Spaltenauswahl fuer Identifizierung der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showId",
                   'Type'      : __OPTTYPES.SW,
                   'Hidden'    : true,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Identifikation ein",
                   'Hotkey'    : 'I',
                   'AltLabel'  : "Identifikation aus",
                   'AltHotkey' : 'I',
                   'FormLabel' : "Identifikation"
               },
    'zeigeAlter' : {      // Spaltenauswahl fuer Alter der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showAge",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Alter ein",
                   'Hotkey'    : 'A',
                   'AltLabel'  : "Alter aus",
                   'AltHotkey' : 'A',
                   'FormLabel' : "Alter"
               },
    'zeigePosition' : {   // Spaltenauswahl fuer Position der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showPos",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Position ein",
                   'Hotkey'    : 'P',
                   'AltLabel'  : "Position aus",
                   'AltHotkey' : 'P',
                   'FormLabel' : "Position"
               },
    'zeigeTOR' : {        // Spaltenauswahl fuer Torwarte der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showTOR",
                   'Type'      : __OPTTYPES.SW,
                   'Hidden'    : true,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "TOR ein",
                   'Hotkey'    : 'T',
                   'AltLabel'  : "TOR aus",
                   'AltHotkey' : 'T',
                   'FormLabel' : "Torwart?"
               },
    'zeigeOpti' : {       // Spaltenauswahl fuer die aktuellen Werte (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showOpti",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Opti ein",
                   'Hotkey'    : 'O',
                   'AltLabel'  : "Opti aus",
                   'AltHotkey' : 'O',
                   'FormLabel' : "Opti"
               },
    'zeigeVerletzung' : { // Spaltenauswahl fuer Verletzungsdauer der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showVerl",
                   'Type'      : __OPTTYPES.SW,
                   'Hidden'    : true,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "TOR ein",
                   'Hotkey'    : 'T',
                   'AltLabel'  : "TOR aus",
                   'AltHotkey' : 'T',
                   'FormLabel' : "Torwart?"
               },
    'zeigeBlessur' : {    // Spaltenauswahl fuer Blessur der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showBlessur",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Blessur ein",
                   'Hotkey'    : 'S',
                   'AltLabel'  : "Blessur aus",
                   'AltHotkey' : 'S',
                   'FormLabel' : "Blessur"
               },
    'zeigeSkillPos' : {   // Spaltenauswahl fuer trainierten Skill der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showSkillPos",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Trainierter Skill ein",
                   'Hotkey'    : 's',
                   'AltLabel'  : "Trainierter Skill aus",
                   'AltHotkey' : 's',
                   'FormLabel' : "Trainierter Skill"
               },
    'zeigeSkill' : {      // Spaltenauswahl fuer trainierten Skillwert der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showSkill",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Skillwert ein",
                   'Hotkey'    : 'S',
                   'AltLabel'  : "Skillwert aus",
                   'AltHotkey' : 'S',
                   'FormLabel' : "Skillwert"
               },
    'zeigeSkillUp' : {    // Spaltenauswahl fuer erhoehten der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showSkillUp",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Neuer Skillwert ein",
                   'Hotkey'    : 'n',
                   'AltLabel'  : "Neuer Skillwert aus",
                   'AltHotkey' : 'S',
                   'FormLabel' : "Neuer Skillwert"
               },
    'zeigeTSkill' : {     // Spaltenauswahl fuer Trainerskill der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showTSkill",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Trainer-Skill ein",
                   'Hotkey'    : 'T',
                   'AltLabel'  : "Trainer-Skill aus",
                   'AltHotkey' : 'T',
                   'FormLabel' : "Trainer-Skill"
               },
    'zeigeTNr' : {        // Spaltenauswahl fuer Trainernummer der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showTNr",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Trainer-Nummer ein",
                   'Hotkey'    : 't',
                   'AltLabel'  : "Trainer-Nummer aus",
                   'AltHotkey' : 't',
                   'FormLabel' : "Trainer-Nummer"
               },
    'zeigePrio' : {       // Spaltenauswahl fuer Training eines Primaerskills der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showPrio",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Prim\u00E4rskill ein",
                   'Hotkey'    : 'p',
                   'AltLabel'  : "Prim\u00E4rskill aus",
                   'AltHotkey' : 'p',
                   'FormLabel' : "Prim\u00E4rskill?"
               },
    'zeigeEinsatz' : {    // Spaltenauswahl fuer Spielereinsatz der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showEins",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Einsatz ein",
                   'Hotkey'    : 'E',
                   'AltLabel'  : "Einsatz aus",
                   'AltHotkey' : 'E',
                   'FormLabel' : "Einsatz"
               },
    'zeigeProzent' : {    // Spaltenauswahl fuer Trainingsprozente der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showProz",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Trainings-Prozente ein",
                   'Hotkey'    : 'P',
                   'AltLabel'  : "Trainings-Prozente aus",
                   'AltHotkey' : 'P',
                   'FormLabel' : "Trainings-Prozente"
               },
    'zeigeProzentBalken' : { // Spaltenauswahl fuer Balken Trainingsprozente der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showProzBar",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Prozente-Balken ein",
                   'Hotkey'    : 'p',
                   'AltLabel'  : "Prozente-Balken aus",
                   'AltHotkey' : 'p',
                   'FormLabel' : "Prozente-Balken"
               },
    'zeigeErwartung' : {  // Spaltenauswahl fuer Trainingserwartung der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showEw",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Trainings-EW ein",
                   'Hotkey'    : 'E',
                   'AltLabel'  : "Trainings-EW aus",
                   'AltHotkey' : 'E',
                   'FormLabel' : "Trainings-EW"
               },
    'zeigeErwartungBalken' : { // Spaltenauswahl fuer Balken Trainingserwartung der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showEwBar",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Erwartungswert-Balken ein",
                   'Hotkey'    : 'e',
                   'AltLabel'  : "Erwartungswert-Balken aus",
                   'AltHotkey' : 'e',
                   'FormLabel' : "Erwartungswert-Balken"
               },
    'zeigeErfolg' : {     // Spaltenauswahl fuer Trainingsaufwertung der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showErf",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Erfolgswert ein",
                   'Hotkey'    : 'a',
                   'AltLabel'  : "Erfolgswert aus",
                   'AltHotkey' : 'a',
                   'FormLabel' : "Erfolgswert"
               },
    'sepStyle' : {        // Stil der Trennlinie
                   'Name'      : "sepStyle",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'Hidden'    : true,
                   'Choice'    : [ 'solid', 'hidden', 'dotted', 'dashed', 'double', 'groove', 'ridge',
                                   'inset', 'outset', 'none' ],
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Stil: $",
                   'Hotkey'    : 'l',
                   'FormLabel' : "Stil:|$"
               },
    'sepColor' : {        // Farbe der Trennlinie
                   'Name'      : "sepColor",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'Hidden'    : true,
                   'FreeValue' : true,
                   'Choice'    : [ 'white', 'yellow', 'black', 'blue', 'cyan', 'gold', 'grey', 'green',
                                   'lime', 'magenta', 'maroon', 'navy', 'olive', 'orange', 'purple',
                                   'red', 'teal', 'transparent' ],
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Farbe: $",
                   'Hotkey'    : 'F',
                   'FormLabel' : "Farbe:|$"
               },
    'sepWidth' : {        // Dicke der Trennlinie
                   'Name'      : "sepWidth",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'Hidden'    : true,
                   'FreeValue' : true,
                   'Choice'    : [ 'thin', 'medium', 'thick' ],
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Dicke: $",
                   'Hotkey'    : 'D',
                   'FormLabel' : "Dicke:|$"
               },
    'saison' : {          // Laufende Saison
                   'Name'      : "saison",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : true,
                   'SelValue'  : false,
                   'Choice'    : [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 ],
                   'Default'   : 19,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Saison: $",
                   'Hotkey'    : 'a',
                   'FormLabel' : "Saison:|$"
               },
    'aktuellerZat' : {    // Laufender ZAT
                   'Name'      : "currZAT",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'Permanent' : true,
                   'SelValue'  : false,
                   'Choice'    : [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11,
                                  12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                                  24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
                                  36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
                                  48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
                                  60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
                                  72 ],
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "ZAT: $",
                   'Hotkey'    : 'Z',
                   'FormLabel' : "ZAT:|$"
               },
    'datenZat' : {        // Stand der Daten zum Team und ZAT
                   'Name'      : "dataZAT",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'Number',
                   'Hidden'    : true,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : undefined,
                   'Action'    : __OPTACTION.SET,
                   'Submit'    : undefined,
                   'Cols'      : 1,
                   'Rows'      : 1,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Daten-ZAT:"
               },
    'oldDatenZat' : {     // Stand der Daten zum Team und ZAT
                   'Name'      : "oldDataZAT",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'Number',
                   'Hidden'    : true,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : undefined,
                   'Action'    : __OPTACTION.SET,
                   'Submit'    : undefined,
                   'Cols'      : 1,
                   'Rows'      : 1,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Vorheriger Daten-ZAT:"
               },
    'team' : {            // Datenspeicher fuer Daten des Erst- bzw. Zweitteams
                   'Name'      : "team",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'Team',
                   'Hidden'    : false,
                   'Serial'    : true,
                   'Permanent' : true,
                   'Default'   : undefined,  // new Team() // { 'Team' : undefined, 'Liga' : undefined, 'Land' : undefined, 'TmNr' : 0, 'LdNr' : 0, 'LgNr' : 0 }
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 6,
                   'Replace'   : null,
                   'Space'     : 1,
                   'Label'     : "Verein:"
               },
    'trainer' : {         // Datenspeicher fuer Trainer-Skills aller Trainer
                   'Name'      : "trainer",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [ null, null, null, null, null, null ],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainer:"
               },
    'tGehaelter' : {      // Datenspeicher fuer Trainer-Gehaelter aller Trainer
                   'Name'      : "tGehaelter",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [0, 0, 0, 0, 0, 0],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainer-Geh\u00E4lter:"
               },
    'tVertraege' : {      // Datenspeicher fuer Laengen der Trainer-Vertraege aller Trainer
                   'Name'      : "tVertraege",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [0, 0, 0, 0, 0, 0],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainer-Vertr\u00E4ge:"
               },
    'tReste' : {          // Datenspeicher fuer Rest-Laengen der Trainer-Vertraege aller Trainer
                   'Name'      : "tReste",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [0, 0, 0, 0, 0, 0],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainer-Restlaufzeit:"
               },
    'tAnzahlen' : {       // Datenspeicher fuer Anzahl zugeordneter Spieler zu den jeweiligen Trainern
                   'Name'      : "tAnzahlen",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [0, 0, 0, 0, 0, 0],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 1,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Anzahl Spieler:"
               },
    'ids' : {             // Datenspeicher fuer ID der Spieler
                   'Name'      : "ids",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Spieler-IDs:"
               },
    'names' : {           // Datenspeicher fuer Name der Spieler
                   'Name'      : "names",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 10,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Spielernamen:"
               },
    'ages' : {            // Datenspeicher fuer Alter der Spieler
                   'Name'      : "ages",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Alter:"
               },
    'positions' : {       // Datenspeicher fuer Spieler-Positionen
                   'Name'      : "positions",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 3,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Positionen:"
               },
    'opti27' : {          // Datenspeicher fuer ganzzahlige Opti-Punkte (mal 27) der Spieler
                   'Name'      : "opti27",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Opti (x27):"
               },
    'verletzt' : {        // Datenspeicher fuer Verletzungsdauer der Spieler
                   'Name'      : "verletzt",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Verletzungen:"
               },
    'skills' : {          // Datenspeicher fuer vorherige Werte der Spieler-Skills
                   'Name'      : "skills",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Skills:"
               },
    'tSkills' : {         // Datenspeicher fuer Skills der Trainer
                   'Name'      : "tSkills",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainer-Skills:"
               },
    'trainiert' : {       // Datenspeicher fuer Zuordnung der Trainer
                   'Name'      : "trainiert",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainer-Nummern:"
               },
    'skillPos' : {        // Datenspeicher fuer Zuordnung der Trainings (Skill-Positionen)
                   'Name'      : "skillPos",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Skill-Positionen:"
               },
    'isPrio' : {          // Datenspeicher fuer Zuordnung der Trainings (Primaerskill ja/nein)
                   'Name'      : "isPrio",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Prio-Training:"
               },
    'einsaetze' : {       // Datenspeicher fuer Einsatzarten der Spieler
                   'Name'      : "einsaetze",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Einsatz-Typen:"
               },
    'prozente' : {        // Datenspeicher fuer Trainingswahrscheinlichkeiten (in Prozent)
                   'Name'      : "prozente",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainings-Prozente:"
               },
    'erwartungen' : {     // Datenspeicher fuer Erwartungswert des Trainings (Prios 5fach)
                   'Name'      : "erwartungen",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainings-EW:"
               },
    'erfolge' : {         // Datenspeicher fuer Trainingserfolge
                   'Name'      : "erfolge",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainings-Erfolge:"
               },
    'blessuren' : {         // Datenspeicher fuer Trainingsblessuren
                   'Name'      : "blessuren",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainings-Blessuren:"
               },
    'reset' : {           // Optionen auf die "Werkseinstellungen" zuruecksetzen
                   'FormPrio'  : undefined,
                   'Name'      : "reset",
                   'Type'      : __OPTTYPES.SI,
                   'Action'    : __OPTACTION.RST,
                   'Label'     : "Standard-Optionen",
                   'Hotkey'    : 'r',
                   'FormLabel' : ""
               },
    'storage' : {         // Browserspeicher fuer die Klicks auf Optionen
                   'FormPrio'  : undefined,
                   'Name'      : "storage",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'Choice'    : Object.keys(__OPTMEM),
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Speicher: $",
                   'Hotkey'    : 'c',
                   'FormLabel' : "Speicher:|$"
               },
    'oldStorage' : {      // Vorheriger Browserspeicher fuer die Klicks auf Optionen
                   'FormPrio'  : undefined,
                   'Name'      : "oldStorage",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'String',
                   'PreInit'   : true,
                   'AutoReset' : true,
                   'Hidden'    : true
               },
    'showForm' : {        // Optionen auf der Webseite (true = anzeigen, false = nicht anzeigen)
                   'FormPrio'  : 1,
                   'Name'      : "showForm",
                   'Type'      : __OPTTYPES.SW,
                   'FormType'  : __OPTTYPES.SI,
                   'Permanent' : true,
                   'Default'   : false,
                   'Title'     : "$V Optionen",
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Optionen anzeigen",
                   'Hotkey'    : 'O',
                   'AltTitle'  : "$V schlie\u00DFen",
                   'AltLabel'  : "Optionen verbergen",
                   'AltHotkey' : 'O',
                   'FormLabel' : ""
               }
};

// ==================== Spezialisierter Abschnitt fuer Optionen ====================

// Logging initialisieren mit Loglevel (siehe ganz oben im Konfigurationsabschnitt)...
__LOG.init(window, __LOGLEVEL);

// Teamparameter fuer getrennte Speicherung der Optionen fuer Erst- und Zweitteam...
const __TEAMCLASS = new TeamClassification();

// Optionen mit Daten, die ZAT- und Team-bezogen gemerkt werden...
__TEAMCLASS.optSelect = {
        'datenZat'        : true,
        'oldDatenZat'     : true,
        'trainer'         : true,
        'tGehaelter'      : true,
        'tVertraege'      : true,
        'tReste'          : true,
        'tAnzahlen'       : true,
        'ids'             : true,
        'names'           : true,
        'ages'            : true,
        'positions'       : true,
        'opti27'          : true,
        'verletzt'        : true,
        'skills'          : true,
        'tSkills'         : true,
        'trainiert'       : true,
        'skillPos'        : true,
        'isPrio'          : true,
        'einsaetze'       : true,
        'prozente'        : true,
        'erwartungen'     : true,
        'erfolge'         : true,
        'blessuren'       : true
    };

// Teamparameter fuer getrennte Speicherung der Optionen fuer Erst- und Zweitteam...
const __LASTZATCLASS = new Classification('old');

// Optionen mit Daten, die ZAT-bezogen (fuer jetzigen und vergangenen ZAT) gemerkt werden...
__LASTZATCLASS.optSelect = {
        'trainer'         : true,
        'tGehaelter'      : true,
        'tVertraege'      : true,
        'tReste'          : true,
        'tAnzahlen'       : true,
        'ids'             : true,
        'names'           : true,
        'ages'            : true,
        'positions'       : true,
        'opti27'          : true,
        'verletzt'        : true,
        'skills'          : true,
        'tSkills'         : true,
        'trainiert'       : true,
        'skillPos'        : true,
        'isPrio'          : true,
        'einsaetze'       : true,
        'prozente'        : true,
        'erwartungen'     : true,
        'erfolge'         : true,
        'blessuren'       : true
    };

// ==================== Ende Abschnitt fuer Optionen ====================

// Klasse ColumnManagerBase *****************************************************************

/*class*/ function ColumnManagerBase /*{
    constructor*/(optSet, colIdx, showCol) {
        'use strict';
        UNUSED(optSet, showCol);

        __LOG[4]("ColumnManagerBase()");

/***
        const __SHOWCOL = getValue(showCol, true);
        const __SHOWALL = ((__SHOWCOL === true) || (__SHOWCOL.Default === true));

        const __BIRTHDAYS = optSet.getOptValue('birthdays', []).length;
        const __TCLASSES = optSet.getOptValue('tClasses', []).length;
        const __PROGRESSES = optSet.getOptValue('progresses', []).length;

        const __ZATAGES = optSet.getOptValue('zatAges', []).length;
        const __TRAINIERT = optSet.getOptValue('trainiert', []).length;
        const __POSITIONS = optSet.getOptValue('positions', []).length;

        const __EINZELSKILLS = optSet.getOptValue('skills', []).length;
        const __PROJECTION = (__EINZELSKILLS && __ZATAGES);
***/

        this.colIdx = colIdx;

/***
        this.saison = optSet.getOptValue('saison');
        this.gt = optSet.getOptValue('zeigeJahrgang');
        this.gtUxx = optSet.getOptValue('zeigeUxx');

        this.fpId = (__BIRTHDAYS && __TCLASSES && __POSITIONS && getValue(__SHOWCOL.zeigeId, __SHOWALL) && optSet.getOptValue('zeigeId'));
        this.warn = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnung, __SHOWALL) && optSet.getOptValue('zeigeWarnung'));
        this.warnMonth = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungMonat, __SHOWALL) && optSet.getOptValue('zeigeWarnungMonat'));
        this.warnHome = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungHome, __SHOWALL) && optSet.getOptValue('zeigeWarnungHome'));
        this.warnDialog = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungDialog, __SHOWALL) && optSet.getOptValue('zeigeWarnungDialog'));
        this.warnAufstieg = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungAufstieg, __SHOWALL) && optSet.getOptValue('zeigeWarnungAufstieg'));
        this.warnLegende = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungLegende, __SHOWALL) && optSet.getOptValue('zeigeWarnungLegende'));
        this.bar = (__PROJECTION && getValue(__SHOWCOL.zeigeBalken, __SHOWALL) && optSet.getOptValue('zeigeBalken'));
        this.barAbs = optSet.getOptValue('absBalken');
        this.donor = optSet.getOptValue('foerderung');
        this.geb = (__BIRTHDAYS && getValue(__SHOWCOL.zeigeGeb, __SHOWALL) && optSet.getOptValue('zeigeGeb'));
        this.tal = (__TCLASSES && getValue(__SHOWCOL.zeigeTal, __SHOWALL) && optSet.getOptValue('zeigeTal'));
        this.quo = (__ZATAGES && __TRAINIERT && getValue(__SHOWCOL.zeigeQuote, __SHOWALL) && optSet.getOptValue('zeigeQuote'));
        this.aufw = (__PROGRESSES && getValue(__SHOWCOL.zeigeAufw, __SHOWALL) && optSet.getOptValue('zeigeAufw'));
        this.substAge = (__ZATAGES && getValue(__SHOWCOL.ersetzeAlter, __SHOWALL) && optSet.getOptValue('ersetzeAlter'));
        this.alter = (__ZATAGES && getValue(__SHOWCOL.zeigeAlter, __SHOWALL) && optSet.getOptValue('zeigeAlter'));
        this.fix = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeFixSkills, __SHOWALL) && optSet.getOptValue('zeigeFixSkills'));
        this.tr = (__EINZELSKILLS && __TRAINIERT && getValue(__SHOWCOL.zeigeTrainiert, __SHOWALL) && optSet.getOptValue('zeigeTrainiert'));
        this.zat = (__ZATAGES && getValue(__SHOWCOL.zeigeZatDone, __SHOWALL) && optSet.getOptValue('zeigeZatDone'));
        this.antHpt = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeAnteilPri, __SHOWALL) && optSet.getOptValue('zeigeAnteilPri'));
        this.antNeb = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeAnteilSec, __SHOWALL) && optSet.getOptValue('zeigeAnteilSec'));
        this.pri = (__EINZELSKILLS && getValue(__SHOWCOL.zeigePrios, __SHOWALL) && optSet.getOptValue('zeigePrios'));
        this.skill = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeSkill, __SHOWALL) && optSet.getOptValue('zeigeSkill'));
        this.pos = (__EINZELSKILLS && __POSITIONS && getValue(__SHOWCOL.zeigePosition, __SHOWALL) && optSet.getOptValue('zeigePosition'));
        this.anzOpti = ((__EINZELSKILLS && getValue(__SHOWCOL.zeigeOpti, __SHOWALL)) ? optSet.getOptValue('anzahlOpti') : 0);
        this.anzMw =  ((__PROJECTION && getValue(__SHOWCOL.zeigeMW, __SHOWALL)) ? optSet.getOptValue('anzahlMW') : 0);
        this.substSkills = (__PROJECTION && getValue(__SHOWCOL.ersetzeSkills, __SHOWALL) && optSet.getOptValue('ersetzeSkills'));
        this.trE = (__PROJECTION && __TRAINIERT && getValue(__SHOWCOL.zeigeTrainiertEnde, __SHOWALL) && optSet.getOptValue('zeigeTrainiertEnde'));
        this.zatE = (__ZATAGES && getValue(__SHOWCOL.zeigeZatLeft, __SHOWALL) && optSet.getOptValue('zeigeZatLeft'));
        this.antHptE = (__PROJECTION && getValue(__SHOWCOL.zeigeAnteilPriEnde, __SHOWALL) && optSet.getOptValue('zeigeAnteilPriEnde'));
        this.antNebE = (__PROJECTION && getValue(__SHOWCOL.zeigeAnteilSecEnde, __SHOWALL) && optSet.getOptValue('zeigeAnteilSecEnde'));
        this.priE = (__PROJECTION && getValue(__SHOWCOL.zeigePriosEnde, __SHOWALL) && optSet.getOptValue('zeigePriosEnde'));
        this.skillE = (__PROJECTION && getValue(__SHOWCOL.zeigeSkillEnde, __SHOWALL) && optSet.getOptValue('zeigeSkillEnde'));
        this.anzOptiE = ((__PROJECTION && getValue(__SHOWCOL.zeigeOptiEnde, __SHOWALL)) ? optSet.getOptValue('anzahlOptiEnde') : 0);
        this.anzMwE = ((__PROJECTION && getValue(__SHOWCOL.zeigeMWEnde, __SHOWALL)) ? optSet.getOptValue('anzahlMWEnde') : 0);
        this.kennzE = optSet.getOptValue('kennzeichenEnde');
***/
    }
//}

Class.define(ColumnManagerBase, Object, {
        'toString'       : function() {  // Bisher nur die noetigsten Parameter ausgegeben...
                               const __RESULT = "Cols\t\t" + this.colIdx + '\n';

                               return __RESULT;
                           },
        'insertRow'      : function(table, rowIdx = 0) {
                               return table.insertRow(rowIdx);
                           },
        'addRow'         : function(table) {
                               return this.insertRow(table, -1);
                           },
        'insertCell'     : function(tableRow, colIdx) {
                               return tableRow.insertCell(colIdx);
                           },
        'addCell'        : function(tableRow) {
                               return this.insertCell(tableRow, -1);
                           },
        'addAndFillCell' : function(tableRow, value, color, align, digits = 2) {
                               let text = value;

                               if ((value || (value === 0)) && isFinite(value) && (value !== true) && (value !== false)) {
                                   // Zahl einfuegen
                                   if (value < 1000) {
                                       // Mit Nachkommastellen darstellen
                                       text = parseFloat(value).toFixed(digits);
                                   } else {
                                       // Mit Tausenderpunkten darstellen
                                       text = getNumberString(value.toString());
                                   }
                               }

                               // String, Boolean oder Zahl einfuegen...
                               const __CELL = this.addCell(tableRow);

                               __CELL.innerHTML = text;
                               if (color) {
                                   __CELL.style.color = color;
                               }
                               if (align) {
                                   __CELL.align = align;
                               }

                               return __CELL;
                           },
        'addAndBarCell'  : function(tableRow, value, scale = 100, offset = 0, width = 100, height = 10, zoom = 100) {
                               const __VALUE = ((scale && isFinite(value)) ? ((value - offset) / Math.max(1, scale - offset) * 100) : 0);

                               // HTML-Code fuer Anteilsbalken einfuegen...
                               const __CELL = this.addCell(tableRow);

                               __CELL.innerHTML = this.getBarImg(__VALUE, width, height, zoom);
                               __CELL.align = 'left';

                               return __CELL;
                           },
        'getBarImg'      : function(value, width = 100, height = 10, zoom = 100) {
                               const __IMAGE = Math.min(99, Math.max(0, getMulValue(value, 1, 0, 0)));
                               const __LENGTH = getMulValue(width / 100, getMulValue(zoom / 100, value, 0, 0), 0, 0);
                               const __WIDTH = Math.min(width, __LENGTH);
                               const __HEIGHT = Math.max(3, getMulValue(zoom / 100, height * (__LENGTH / __WIDTH), 0, 0));

                               // HTML-Code fuer Anteilsbalken...
                               return '<IMG src="images/balken/' + __IMAGE + '.GIF" width="' + __WIDTH + '" height="' + __HEIGHT + '">';
                           },
        'insertTitles'   : function(table, titleColor = '#FFFFFF') {
                               UNUSED(table, titleColor);
                           },  // Ende insertTitles()
        'addTitles'      : function(headers, titleColor = '#FFFFFF') {
                               UNUSED(headers, titleColor);
                           },  // Ende addTitles()
        'addValues'      : function(player, playerRow, color = '#FFFFFF') {
                               UNUSED(player, playerRow, color);
                           }  // Ende addValues(player, playerRow)
    });

// Klasse ColumnManagerZatReport *****************************************************************

/*class*/ function ColumnManagerZatReport /*extends ColumnManagerBase {
    constructor*/(optSet, colIdx, showCol) {
        'use strict';

        ColumnManagerBase.call(this, optSet, colIdx, showCol);

        __LOG[3]("ColumnManagerZatReport()");

        const __SHOWCOL = getValue(showCol, true);
        const __SHOWALL = ((__SHOWCOL === true) || (__SHOWCOL.Default === true));

        const __SAISON = optSet.getOptValue('saison');
        const __AKTZAT = optSet.getOptValue('aktuellerZat');
        const __DATZAT = optSet.getOptValue('datenZat');
        const __GEALTERT = ((__AKTZAT >= __SAISONZATS) ? true : false);
        const __CURRZAT = (__GEALTERT ? 0 : __AKTZAT);

        const __REPSAISON = getSelection('saison', 'Number');
        const __REPZAT = getSelection('zat', 'Number');
        const __SAISONWECHSEL = ((__DATZAT === 0) ? true : false);
        const __OLDSAISON = (__SAISONWECHSEL ? __SAISON - 1 : __SAISON);
        const __OLDZAT = (__SAISONWECHSEL ? __SAISONZATS : __DATZAT);

        const __TEAM = optSet.getOptValue('team', { });

        const __IDS = eval(optSet.getOptValue('ids', []));
        const __EINSAETZE = eval(optSet.getOptValue('einsaetze', []));
        const __TSKILLS = eval(optSet.getOptValue('tSkills', []));
        const __TEAMDATA = __IDS.length;
        const __EINSDATA = __EINSAETZE.length;
        const __TRAIDATA = __TSKILLS.length;
        const __LASTZAT = ((__REPZAT === __OLDZAT) && (__REPSAISON === __OLDSAISON));

        this.saison = __SAISON;
        this.currZAT = __CURRZAT;
        this.oldSaison = __OLDSAISON;
        this.oldZAT = __OLDZAT;
        this.team = __TEAM;

        __LOG[4]("Team:", __TEAM);
        __LOG[4]("Aktuell:", __SAISON, __CURRZAT);
        __LOG[4]("Altdaten:", __OLDSAISON, __OLDZAT);

        this.id = (getValue(__SHOWCOL.zeigeId, __SHOWALL) && optSet.getOptValue('zeigeId'));
        this.alter = (__TEAMDATA && getValue(__SHOWCOL.zeigeAlter, __SHOWALL) && optSet.getOptValue('zeigeAlter'));
        this.pos = (__TEAMDATA && getValue(__SHOWCOL.zeigePosition, __SHOWALL) && optSet.getOptValue('zeigePosition'));
        this.goalie = (__TEAMDATA && getValue(__SHOWCOL.zeigeTOR, __SHOWALL) && optSet.getOptValue('zeigeTOR'));
        this.opti = (__TEAMDATA && getValue(__SHOWCOL.zeigeOpti, __SHOWALL) && optSet.getOptValue('zeigeOpti'));
        this.verl = (__TEAMDATA && getValue(__SHOWCOL.zeigeVerletzung, __SHOWALL) && optSet.getOptValue('zeigeVerletzung'));
        this.blessur = (getValue(__SHOWCOL.zeigeBlessur, __SHOWALL) && optSet.getOptValue('zeigeBlessur'));
        this.skillPos = (__TEAMDATA && __LASTZAT && getValue(__SHOWCOL.zeigeSkillPos, __SHOWALL) && optSet.getOptValue('zeigeSkillPos'));
        this.skill = (__TEAMDATA && __LASTZAT && getValue(__SHOWCOL.zeigeSkill, __SHOWALL) && optSet.getOptValue('zeigeSkill'));
        this.skillUp = (__TEAMDATA && __LASTZAT && getValue(__SHOWCOL.zeigeSkillUp, __SHOWALL) && optSet.getOptValue('zeigeSkillUp'));
        this.tSkill = (__TRAIDATA && __LASTZAT && getValue(__SHOWCOL.zeigeTSkill, __SHOWALL) && optSet.getOptValue('zeigeTSkill'));
        this.tNr = (__TRAIDATA && __LASTZAT && getValue(__SHOWCOL.zeigeTNr, __SHOWALL) && optSet.getOptValue('zeigeTNr'));
        this.prio = (__TEAMDATA && __LASTZAT && getValue(__SHOWCOL.zeigePrio, __SHOWALL) && optSet.getOptValue('zeigePrio'));
        this.eins = (__TEAMDATA && __EINSDATA && __LASTZAT && getValue(__SHOWCOL.zeigeEinsatz, __SHOWALL) && optSet.getOptValue('zeigeEinsatz'));
        this.proz = (__TRAIDATA && __LASTZAT && getValue(__SHOWCOL.zeigeProzent, __SHOWALL) && optSet.getOptValue('zeigeProzent'));
        this.prozB = (__TRAIDATA && __LASTZAT && getValue(__SHOWCOL.zeigeProzentBalken, __SHOWALL) && optSet.getOptValue('zeigeProzentBalken'));
        this.erw = (__LASTZAT && getValue(__SHOWCOL.zeigeErwartung, __SHOWALL) && optSet.getOptValue('zeigeErwartung'));
        this.erwB = (__LASTZAT && getValue(__SHOWCOL.zeigeErwartungBalken, __SHOWALL) && optSet.getOptValue('zeigeErwartungBalken'));
        this.erf = (__LASTZAT && getValue(__SHOWCOL.zeigeErfolg, __SHOWALL) && optSet.getOptValue('zeigeErfolg'));
    }
//}

Class.define(ColumnManagerZatReport, ColumnManagerBase, {
        'toString'       : function() {  // Bisher nur die noetigsten Parameter ausgegeben...
                               let result = ColumnManagerBase.call(this);
/***
                               result += "Beste Position\t" + this.pos + '\n';
                               result += "Optis\t\t\t" + this.anzOpti + '\n';
                               result += "Marktwerte\t\t" + this.anzMw + '\n';
                               result += "Skillschnitt Ende\t" + this.skillE + '\n';
                               result += "Optis Ende\t\t" + this.anzOptiE + '\n';
                               result += "Marktwerte Ende\t" + this.anzMwE + '\n';
***/
                               return result;
                           },
        'addFillCell'    : function(playerRow, testVar) {
                               if (testVar !== undefined) {
                                   return true;
                               } else {
                                   this.addAndFillCell(playerRow, "", __OSBLAU);
                                   return false;
                               }
                           },
        'insertTitles'   : function(table, titleColor = '#FFFFFF') {
                               const __HEADERS = this.insertRow(table, 0);

                               this.addAndFillCell(__HEADERS, "Name des Spielers", titleColor);
                               this.addAndFillCell(__HEADERS, "Ergebnis", titleColor);

                               return this.addTitles(__HEADERS, titleColor);
                           },
        'addTitles'      : function(headers, titleColor = '#FFFFFF') {
                               // Spaltentitel zentrieren
                               headers.align = 'center';

                               // Titel fuer die aktuellen Werte
                               if (this.id) {
                                   this.addAndFillCell(headers, "User-ID", titleColor);
                               }
                               if (this.alter) {
                                   this.addAndFillCell(headers, "Alter", titleColor);
                               }
                               if (this.pos) {
                                   this.addAndFillCell(headers, "POS", titleColor);
                               }
                               if (this.goalie) {
                                   this.addAndFillCell(headers, "TOR", titleColor);
                               }
                               if (this.opti) {
                                   this.addAndFillCell(headers, "Opti", titleColor);
                               }
                               if (this.verletzt) {
                                   this.addAndFillCell(headers, 'V', titleColor);
                               }
                               if (this.blessur) {
                                   this.addAndFillCell(headers, '#', titleColor);
                               }
                               if (this.skillPos) {
                                   this.addAndFillCell(headers, "Skill", titleColor);
                               }
                               if (this.skill) {
                                   this.addAndFillCell(headers, "von", titleColor);
                               }
                               if (this.skillUp) {
                                   this.addAndFillCell(headers, "auf", titleColor);
                               }
                               if (this.tSkill) {
                                   this.addAndFillCell(headers, "Tr.", titleColor);
                               }
                               if (this.tNr) {
                                   this.addAndFillCell(headers, '#', titleColor);
                               }
                               if (this.prio) {
                                   this.addAndFillCell(headers, 'P', titleColor);
                               }
                               if (this.eins) {
                                   this.addAndFillCell(headers, "Eins", titleColor);
                               }
                               if (this.prozB) {
                                   this.addAndFillCell(headers, "Trainings-%", titleColor);
                               }
                               if (this.proz) {
                                   this.addAndFillCell(headers, '%', titleColor);
                               }
                               if (this.erw || this.erwB) {
                                   this.addAndFillCell(headers, (this.erwB ? "EW+" : "EW"), titleColor);
                               }
                               if (this.erwB) {
                                   this.addAndFillCell(headers, "EW-", titleColor);
                               }
                               if (this.erf) {
                                   this.addAndFillCell(headers, "Erfolg", titleColor);
                               }

                               return headers;
                           },  // Ende addTitles()
        'addValues'      : function(player, playerRow, color = '#FFFFFF') {
                               //const __IDXPRI = getIdxPriSkills(player.getPos());
                               //const __LEICOLOR = getColor('LEI');
                               const __TORCOLOR = getColor('TOR');
                               const __NEWCOLOR = color;
                               const __POSCOLOR = (player.isGoalie ? __TORCOLOR : getColor(player.pos));
                               const __COLOR = ((player.erfolg === undefined) ? color : __POSCOLOR);

                               // Balken-Grafik...
                               const __SCALE = 100;  // (this.barAbs ? 100 : (this.donor / 125));
                               const __OFFSET = 0;  // (this.barAbs ? 0 : Math.pow(__SCALE / 20, 2));
                               const __ZOOM = 50 + __SCALE / 2;

                               // Rueckgabewerte...
                               const __RET = [ 0.0, 0.0 ];  // Erwartung, Aufwertung

                               // Aktuelle Werte
                               if (this.id) {
                                   //this.addAndFillCell(playerRow, player.id, __POSCOLOR);
                               }
                               if (this.alter) {
                                   this.addAndFillCell(playerRow, player.age, __POSCOLOR, null, 0);
                               }
                               if (this.pos) {
                                   this.addAndFillCell(playerRow, player.pos, __POSCOLOR);
                               }
                               if (this.goalie) {
                                   //this.addAndFillCell(playerRow, player.isGoalie, __POSCOLOR);
                               }
                               if (this.opti) {
                                   this.addAndFillCell(playerRow, player.opti, __POSCOLOR, null, 2);
                               }
                               if (this.verl) {
                                   //this.addAndFillCell(playerRow, player.verl, __POSCOLOR);
                               }
                               if (this.blessur) {
                                   if (player.blessur !== undefined) {
                                       this.addAndFillCell(playerRow, ((player.blessur < 0) ? (player.blessur + " ZAT") : (player.blessur + " FIT")), __TORCOLOR, null, 0);
                                   } else {
                                       this.addFillCell(playerRow);
                                   }
                               }
                               if (this.skillPos) {
                                   this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, getSkillName(player.skillID, player.isGoalie), __COLOR);
                               }
                               if (this.skill) {
                                   this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, player.pSkill, __COLOR, null, 0);
                               }
                               if (this.skillUp) {
                                   if (player.erfolg) {
                                       this.addAndFillCell(playerRow, "-> " + (parseInt(player.pSkill, 0) + 1), __COLOR, null, 0);
                                   } else {
                                       this.addFillCell(playerRow);
                                   }
                               }
                               if (this.tSkill) {
                                   this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, player.tSkill, __COLOR, null, 1);
                               }
                               if (this.tNr) {
                                   this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, player.tNr, __COLOR, null, 0);
                               }
                               if (this.prio) {
                                   this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, player.isPrio ? '*' : "", __NEWCOLOR);
                               }
                               if (this.eins) {
                                   const __EINS = ((player.einsatz < 1) ? "" : ((player.einsatz === 3) ? player.pos : "EIN"));

                                   this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, __EINS, getColor(__EINS), null, 0);
                               }

                               const __PROZENT = (player.prozent || 0);

                               if (this.prozB) {
                                   this.addFillCell(playerRow, player.erfolg) && this.addAndBarCell(playerRow, __PROZENT, __SCALE, __OFFSET, 100, 10, __ZOOM);
                               }
                               if (this.proz) {
                                   this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, __PROZENT.toFixed(0) + '%', __COLOR, 'right');
                               }

                               const __ERWARTUNG = (player.erwartung || 0);
                               const __ERWARTPROZ = parseInt(__ERWARTUNG * 20, 10);

                               __RET[0] = __ERWARTUNG;

                               if (player.erfolg) {
                                   const __AUFWERTUNG = (player.isPrio ? 5 : 1);

                                   __RET[1] = __AUFWERTUNG;

                                   if (this.erwB) {
                                       this.addFillCell(playerRow, player.erfolg) && this.addAndBarCell(playerRow, __ERWARTPROZ, __SCALE, __OFFSET, 100, 10, __ZOOM);
                                   }
                                   if (this.erw) {
                                       this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, __ERWARTUNG, __COLOR, null, 2);
                                   } else if (this.erwB) {
                                       this.addFillCell(playerRow);
                                   }
                                   if (this.erf) {
                                       this.addAndFillCell(playerRow, __AUFWERTUNG, __COLOR, null, 0);
                                   }
                               } else {
                                   if (this.erw) {
                                       this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, - __ERWARTUNG, __NEWCOLOR, 'right', 2);
                                   } else if (this.erwB) {
                                       this.addFillCell(playerRow);
                                   }
                                   if (this.erwB) {
                                       this.addFillCell(playerRow, player.erfolg) && this.addAndBarCell(playerRow, __ERWARTPROZ, __SCALE, __OFFSET, 100, 10, __ZOOM);
                                   }
                                   if (this.erf) {
                                       this.addFillCell(playerRow, player.erfolg) && this.addFillCell(playerRow);
                                   }
                               }
/***
                               // Aktuelle Werte (alt)
                               if (this.fpId) {
                                   this.addAndFillCell(playerRow, player.getFingerPrint(), __COLOR);
                               }
                               if (this.bar) {
                                   const __VALUE = player.getPrios(player.getPos(), player.__TIME.end);
                                   const __SCALE = (this.barAbs ? 100 : (this.donor / 125));
                                   const __OFFSET = (this.barAbs ? 0 : Math.pow(__SCALE / 20, 2));
                                   const __ZOOM = 50 + __SCALE / 2;

                                   this.addAndBarCell(playerRow, __VALUE, __SCALE, __OFFSET, 100, 10, __ZOOM);
                               }
                               if (this.tal) {
                                   this.addAndFillCell(playerRow, player.getTalent(), __COLOR);
                               }
                               if (this.quo) {
                                   this.addAndFillCell(playerRow, player.getAufwertungsSchnitt(), __COLOR, null, 2);
                               }
                               if (this.colIdx.Auf) {
                                   convertStringFromHTML(playerRow.cells, this.colIdx.Auf, function(aufwert) {
                                                                                               return player.boldPriSkillNames(aufwert);
                                                                                           });
                               }
                               if (this.aufw) {
                                   this.addAndFillCell(playerRow, player.boldPriSkillNames(player.getAufwert()), __COLOR, 'left');
                               }
                               if (this.geb) {
                                   this.addAndFillCell(playerRow, player.getGeb(), __COLOR, null, 0);
                               }
                               if (this.substAge) {
                                   convertStringFromHTML(playerRow.cells, this.colIdx.Age, function(value) {
                                                                                               UNUSED(value);
                                                                                               return parseFloat(player.getAge()).toFixed(2);
                                                                                           });
                               } else if (this.alter) {
                                   this.addAndFillCell(playerRow, player.getAge(), __COLOR, null, 2);
                               }
                               if (this.fix) {
                                   this.addAndFillCell(playerRow, player.getFixSkills(), __COLOR, null, 0);
                               }
                               if (this.tr) {
                                   this.addAndFillCell(playerRow, player.getTrainableSkills(), __COLOR, null, 0);
                               }
                               if (this.zat) {
                                   this.addAndFillCell(playerRow, player.getZatDone(), __COLOR, null, 0);
                               }
                               if (this.antHpt) {
                                   this.addAndFillCell(playerRow, player.getPriPercent(player.getPos()), __COLOR, null, 0);
                               }
                               if (this.antNeb) {
                                   this.addAndFillCell(playerRow, player.getSecPercent(player.getPos()), __COLOR, null, 0);
                               }
                               if (this.pri) {
                                   this.addAndFillCell(playerRow, player.getPrios(player.getPos()), __COLOR, null, 1);
                               }
                               if (this.skill) {
                                   this.addAndFillCell(playerRow, player.getSkill(), __COLOR, null, 2);
                               }
                               if (this.pos) {
                                   this.addAndFillCell(playerRow, player.getPos(), __NEWCOLOR);
                               }

                               // Einzelwerte mit Ende 18
                               if (this.colIdx.Einz) {
                                   if (this.substSkills) {
                                       convertArrayFromHTML(playerRow.cells, this.colIdx.Einz, player.skillsEnd, function(value, cell, arr, index) {
                                                                                                                     UNUSED(arr);
                                                                                                                     if (~ __IDXPRI.indexOf(index)) {
                                                                                                                         formatCell(cell, true, __OSBLAU, __NEWCOLOR, 1.0);
                                                                                                                     }
                                                                                                                     return value;
                                                                                                                 });
                                   } else {
                                       convertArrayFromHTML(playerRow.cells, this.colIdx.Einz, player.skills.length, function(value, cell, arr, index) {
                                                                                                                         UNUSED(arr);
                                                                                                                         if (~ __IDXPRI.indexOf(index)) {
                                                                                                                             formatCell(cell, true, __NEWCOLOR, null, 1.0);
                                                                                                                         }
                                                                                                                         return value;
                                                                                                                     });
                                   }
                               }
                               if (this.trE) {
                                   this.addAndFillCell(playerRow, player.getTrainableSkills(player.__TIME.end), __COLOR, null, 1);
                               }
                               if (this.zatE) {
                                   this.addAndFillCell(playerRow, player.getZatLeft(), __COLOR, null, 0);
                               }
                               if (this.antHptE) {
                                   this.addAndFillCell(playerRow, player.getPriPercent(player.getPos(), player.__TIME.end), __COLOR, null, 0);
                               }
                               if (this.antNebE) {
                                   this.addAndFillCell(playerRow, player.getSecPercent(player.getPos(), player.__TIME.end), __COLOR, null, 0);
                               }
                               if (this.priE) {
                                   this.addAndFillCell(playerRow, player.getPrios(player.getPos(), player.__TIME.end), __COLOR, null, 1);
                               }
                               if (this.skillE) {
                                   this.addAndFillCell(playerRow, player.getSkill(player.__TIME.end), __COLOR, null, 2);
                               }
***/
                               return __RET;
                           }  // Ende addValues(player, playerRow)
    });

// Klasse PlayerRecordTraining ******************************************************************

/*class*/ function PlayerRecordTraining /*{
    constructor*/(land, age, isGoalie, saison, currZAT, donation) {
        'use strict';

        this.land = land;
        this.age = age;
        this.isGoalie = isGoalie;

        this.saison = saison;
        this.currZAT = currZAT;
        this.donation = donation;
        this.mwFormel = ((this.saison < 10) ? this.__MWFORMEL.alt : this.__MWFORMEL.S10);

        // in new PlayerRecordTraining() definiert:
        // this.land: TLA des Geburtslandes
        // this.age: Ganzzahliges Alter des Spielers
        // this.isGoalie: Angabe, ob es ein TOR ist
        // this.mwFormel: Benutzte MW-Formel, siehe __MWFORMEL
        // this.donation: Jugendfoerderungsbetrag in Euro

        // in this.initPlayer() definiert:
        // this.zatGeb: ZAT, an dem der Spieler Geburtstag hat, -1 fuer "noch nicht zugewiesen", also '?'
        // this.zatAge: Bisherige erfolgte Trainings-ZATs
        // this.birth: Universell eindeutige Nummer des Geburtstags-ZATs des Spielers
        // this.talent: Talent als Zahl (-1=wenig, 0=normal, +1=hoch)
        // this.aufwert: Aufwertungsstring

        // in this.calcSkills() definiert:
        // this.positions[][]: Positionstexte und Optis; TOR-Index ist 5
        // this.skills[]: Einzelskills
        // this.skillsEnd[]: Berechnet aus this.skills, this.age und aktuellerZat
        // this.zatLeft: ZATs bis zum Ende 18 (letzte Ziehmoeglichkeit)
        // this.restEnd: Korrekturterm zum Ausgleich von Rundungsfehlern mit Ende 18
        //               (also Skills, die nicht explizit in this.skillsEnd stehen)

        // in this.calcZusatz()/setZusatz() definiert:
        // this.trainiert: Anzahl der erfolgreichen Trainingspunkte
        // indirekt this.zatAge und this.bestPos

        // in this.createWarnDraw() definiert:
        // this.warnDraw: Behandlung von Warnungen Ende 18
        // this.warnDrawAufstieg: Behandlung von Warnungen bei Aufstieg

        // in this.getPos() definiert:
        // this.bestPos: erster (bester) Positionstext
    }
//}

Class.define(PlayerRecordTraining, Object, {
        '__TIME'                : {   // Zeitpunktangaben
                                      'cre' : 0,  // Jugendspieler angelegt (mit 12 Jahren)
                                      'beg' : 1,  // Jugendspieler darf trainieren (wird 13 Jahre alt)
                                      'now' : 2,  // Aktueller ZAT
                                      'end' : 3   // Jugendspieler wird Ende 18 gezogen (Geb. - 1 bzw. ZAT 71 fuer '?')
                                  },
        '__MWFORMEL'            : {   // Zu benutzende Marktwertformel
                                      'alt' : 0,  // Marktwertformel bis Saison 9 inklusive
                                      'S10' : 1   // Marktwertformel MW5 ab Saison 10
                                  },
        '__MAXPRISKILLS'        : 4 * 99,
        'toString'              : function() {  // Bisher nur die noetigsten Werte ausgegeben...
                                      __LOG[0](this.positions);
                                      let result = "Alter\t\t" + this.age + "\n\n";
                                      result += "Aktuelle Werte\n";
                                      result += "Skillschnitt\t" + this.getSkill().toFixed(2) + '\n';
                                      result += "Optis und Marktwerte";

                                      for (let pos of this.positions) {
                                          result += "\n\t" + pos + '\t';
                                          result += this.getOpti(pos).toFixed(2) + '\t';
                                          result += getNumberString(this.getMarketValue(pos).toString());
                                      }

                                      result += "\n\nWerte mit Ende 18\n";
                                      result += "Skillschnitt\t" + this.getSkill(this.__TIME.end).toFixed(2) + '\n';
                                      result += "Optis und Marktwerte";

                                      for (let pos of this.positions) {
                                          result += "\n\t" + this.getPos() + '\t';
                                          result += this.getOpti(pos, this.__TIME.end).toFixed(2) + '\t';
                                          result += getNumberString(this.getMarketValue(pos, this.__TIME.end).toString());
                                      }

                                      return result;
                                  },  // Ende this.toString()
        'initPlayer'            : function(data, index, isSkillData = false) {  // isSkillData: true = Skilldaten, false = Basiswerte (Geb., Talent, Aufwertungen) oder keine
                                      this.zatAge = 0;  // TODO

                                      if (data !== undefined) {
                                          if (isSkillData) {
                                              this.setSkills(data[index]);
                                          } else if (data.length >= 2){
                                              this.setGeb(data[0][index]);
                                              this.talent = data[1][index];
                                              this.aufwert = data[2][index];
                                          } else {
                                              // keine Daten
                                          }
                                      }
                                  },  // Ende this.initPlayer()
        'createWarnDraw'        : function(ziehmich = null, klasse = 1) {  // ziehmich: input Element zum Ziehen; klasse: Spielklasse 1, 2, 3
                                      // Objekte fuer die Verwaltung der Ziehwarnungen...
                                      this.warnDraw = undefined;
                                      this.warnDrawAufstieg = undefined;
                                      if (ziehmich) {
                                          const __LASTZAT = this.currZAT + this.getZatLeft();

                                          if (__LASTZAT < __SAISONZATS) {  // U19
                                              this.warnDraw = new WarnDrawPlayer(this, getColor('STU'));  // rot
                                              __LOG[5](this.getAge().toFixed(2), "rot");
                                          } else if (__LASTZAT < Math.max(2, klasse) * __SAISONZATS) {  // Rest bis inkl. U18 (Liga 1 und 2) bzw. U17 (Liga 3)
                                              // do nothing
                                          } else if (__LASTZAT < (klasse + 1) * __SAISONZATS) {  // U17/U16 je nach Liga 2/3
                                              this.warnDrawAufstieg = new WarnDrawPlayer(this, getColor('OMI'));  // magenta
                                              this.warnDrawAufstieg.setAufstieg();
                                              __LOG[5](this.getAge().toFixed(2), "magenta");
                                          }
                                      }
                                  },  // Ende this.createWarnDraw()
        'setSkills'             : function(skills) {
                                      // Berechnet die Opti-Werte, sortiert das Positionsfeld und berechnet die Einzelskills mit Ende 18
                                     this.skills = skills;

                                      const __POSREIHEN = [ 'ABW', 'DMI', 'MIT', 'OMI', 'STU', 'TOR' ];
                                      this.positions = [];
                                      for (let index = 0; index < __POSREIHEN.length; index++) {
                                          const __REIHE = __POSREIHEN[index];

                                          this.positions[index] = [ __REIHE, this.getOpti(__REIHE) ];
                                      }

                                      // Sortieren
                                      __LOG[0](this.positions);
                                      //sortPositionArray(this.positions);
                                      //__LOG[0](this.positions);
                                  },  // Ende this.setSkills()
        'prognoseSkills'        : function() {
                                      // Einzelskills mit Ende 18 berechnen
                                      this.skillsEnd = [];

                                      const __ZATDONE = this.getZatDone();
                                      const __ZATTOGO = this.getZatLeft();
                                      const __ADDRATIO = (__ZATDONE ? __ZATTOGO / __ZATDONE : 0);

                                      let addSkill = __ZATTOGO * this.getAufwertungsSchnitt();

                                      for (let i in this.skills) {
                                          const __SKILL = this.skills[i];
                                          let progSkill = __SKILL;

                                          if (isTrainableSkill(i)) {
                                              // Auf ganze Zahl runden und parseInt(), da das sonst irgendwie als String interpretiert wird
                                              const __ADDSKILL = Math.min(99 - progSkill, getMulValue(__ADDRATIO, __SKILL, 0, Number.NaN));

                                              progSkill += __ADDSKILL;
                                              addSkill -= __ADDSKILL;
                                          }

                                          this.skillsEnd[i] = progSkill;
                                      }
                                      this.restEnd = addSkill;
                                  },  // Ende this.prognoseSkills()
        'setZusatz'             : function(zatAge, trainiert, bestPos) {
                                      // Setzt Nebenwerte fuer den Spieler (geht ohne initPlayer())
                                      if (zatAge !== undefined) {
                                          this.zatAge = zatAge;
                                      }
                                      this.trainiert = trainiert;
                                      this.bestPos = bestPos;
                                  },
        'calcZusatz'            : function() {
                                      // Ermittelt Nebenwerte fuer den Spieler und gibt sie alle zurueck (nach initPlayer())
                                      // this.zatAge und this.skills bereits in initPlayer() berechnet
                                      this.trainiert = this.getTrainiert(true);  // neu berechnet aus Skills
                                      let bestPos = this.getPos(-1);  // hier: -1 explizit angeben, damit neu ermittelt (falls this.bestPos noch nicht belegt)

                                      return {
                                                 'zatAge'     : this.zatAge,
                                                 'trainiert'  : this.trainiert,
                                                 'bestPos'    : bestPos
                                             };
                                  },
        'getGeb'                : function() {
                                      return (this.zatGeb < 0) ? '?' : this.zatGeb;
                                  },
        'setGeb'                : function(gebZAT) {
                                      this.zatGeb = gebZAT;
                                      this.zatAge = this.calcZatAge(this.currZAT);
                                      this.birth = (36 + this.saison) * __SAISONZATS + this.currZAT - this.zatAge;
                                  },
        'calcZatAge'            : function(currZAT) {
                                      let zatAge;

                                      if (this.zatGeb !== undefined) {
                                          let ZATs = __SAISONZATS * (this.age - ((currZAT < this.zatGeb) ? 12 : 13));  // Basiszeit fuer die Jahre seit Jahrgang 13

                                          if (this.zatGeb < 0) {
                                              zatAge = ZATs + currZAT;  // Zaehlung begann Anfang der Saison (und der Geburtstag wird erst nach dem Ziehen bestimmt)
                                          } else {
                                              zatAge = ZATs + currZAT - this.zatGeb;  // Verschiebung relativ zum Geburtstag (von -zatGeb, ..., 0, ..., 71 - zatGeb)
                                          }
                                      }

                                      return zatAge;
                                  },
        'getZatAge'             : function(when = this.__TIME.now) {
                                      if (when === this.__TIME.end) {
                                          return (18 - 12) * __SAISONZATS - 1;  // (max.) Trainings-ZATs bis Ende 18
                                      } else if (this.zatAge !== undefined) {
                                          return this.zatAge;
                                      } else {
                                          __LOG[3]("Empty getZatAge()");

                                          return Number.NaN;
                                      }
                                  },
        'getZatDone'            : function(when = this.__TIME.now) {
                                      return Math.max(0, this.getZatAge(when));
                                  },
        'getZatLeft'            : function(when = this.__TIME.now) {
                                      if (this.zatLeft === undefined) {
                                          this.zatLeft = this.getZatDone(this.__TIME.end) - this.getZatDone(when);
                                      }

                                      return this.zatLeft;
                                  },
        'calcZiehIndex'         : function() {
                                      //const __RESTZAT = this.getZatAge(this.__TIME.end) - this.getZatAge() + this.currZAT;
                                      //const __INDEX = parseInt(__RESTZAT / __MONATZATS + 1) - 1;  // Lfd. Nummer des Abrechnungsmonats (0-basiert)

                                      return (this.warnDraw && this.warnDraw.calcZiehIndex(this.currZAT));
                                  },
        'isZiehAufstieg'        : function() {
                                      return (this.warnDrawAufstieg && this.warnDrawAufstieg.isZiehAufstieg());
                                  },
        'getAge'                : function(when = this.__TIME.now) {
                                      if (this.mwFormel === this.__MWFORMEL.alt) {
                                          return (when === this.__TIME.end) ? 18 : this.age;
                                      } else {  // Geburtstage ab Saison 10...
                                          return (13.00 + this.getZatAge(when) / __SAISONZATS);
                                      }
                                  },
        'getTrainiert'          : function(recalc = false) {
                                      if (recalc || (this.trainiert === undefined)) {
                                          this.trainiert = this.getTrainableSkills();
                                      }

                                      return this.trainiert;
                                  },
        'getAufwertungsSchnitt' : function() {
                                      const __ZATDONE = this.getZatDone();

                                      if (__ZATDONE) {
                                          return parseFloat(this.getTrainiert() / __ZATDONE);
                                      } else {
                                          // Je nach Talentklasse mittlerer Aufwertungsschnitt aller Talente der Klasse
                                          // (gewichtet nach Verteilung der Talentstufen in dieser Talentklasse)
                                          return (1 + (this.talent / 3.6)) * (this.donation / 10000);
                                      }
                                  },
        'getPos'                : function(idx = 0) {
                                      __LOG[0](this.positions);
                                      const __IDXOFFSET = 1;

                                      switch (idx) {
                                      case -1 : return (this.bestPos = this.positions[this.isGoalie ? 5 : 0][0]);
                                      case  0 : return this.bestPos;
                                      default : return this.positions[idx - __IDXOFFSET][0];
                                      }
                                  },
        'getPosPercent'         : function(idx = 0) {
                                      __LOG[0](this.positions);
                                      const __IDXOFFSET = 1;
                                      const __OPTI = this.positions[this.isGoalie ? 5 : 0][1];
                                      let optiSec = __OPTI;

                                      switch (idx) {
                                      case -1 : break;  // __OPTI
                                      case  0 : optiSec = (this.isGoalie ? 0 : this.positions[1][1]);  // Backup-Wert (TOR: keiner)
                                                break;
                                      default : optiSec = this.positions[idx - __IDXOFFSET][1];
                                      }

                                      return parseFloat(100 * optiSec / __OPTI);
                                  },
        'getTalent'             : function() {
                                      return (this.talent < 0) ? 'wenig' : (this.talent > 0) ? 'hoch' : 'normal';
                                  },
        'getAufwert'            : function() {
                                      return this.aufwert;
                                  },
        'boldPriSkillNames'     : function(text) {
                                      const __PRISKILLNAMES = this.getPriSkillNames();

                                      return (! text) ? text : text.replace(/\w+/g, function(name) {
                                                                                        return ((~ __PRISKILLNAMES.indexOf(name)) ? '<B>' + name + '</B>' : name);
                                                                                    });
                                  },
        'getPriSkillNames'      : function(pos = undefined) {
                                      return getSkillNameArray(getIdxPriSkills(pos ? pos : this.getPos()), this.isGoalie);
                                  },
        'getSkillSum'           : function(when = this.__TIME.now, idxSkills = undefined, restRate = 15) {
                                      let cachedItem;

                                      if (idxSkills === undefined) {  // Gesamtsumme ueber alle Skills wird gecached...
                                          cachedItem = ((when === this.__TIME.end) ? 'skillSumEnd' : 'skillSum');

                                          const __CACHED = this[cachedItem];

                                          if (__CACHED !== undefined) {
                                              return __CACHED;
                                          }

                                          idxSkills = getIdxAllSkills();
                                      }

                                      const __SKILLS = ((when === this.__TIME.end) ? this.skillsEnd : this.skills);
                                      let sumSkills = ((when === this.__TIME.end) ? (restRate / 15) * this.restEnd : 0);

                                      if (__SKILLS) {
                                          for (let idx of idxSkills) {
                                              sumSkills += __SKILLS[idx];
                                          }
                                      }

                                      if (cachedItem !== undefined) {
                                          this[cachedItem] = sumSkills;
                                      }

                                      return sumSkills;
                                  },
        'getSkill'              : function(when = this.__TIME.now) {
                                      return this.getSkillSum(when) / __NUMSKILLS;
                                  },
        'getOpti'               : function(pos, when = this.__TIME.now) {
                                      UNUSED(pos, when);
                                      return 85;
/*                                      const __SUMALLSKILLS = this.getSkillSum(when);
                                      const __SUMPRISKILLS = this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4);
                                      const __OVERFLOW = Math.max(0, __SUMPRISKILLS - this.__MAXPRISKILLS);
if (this.zatGeb === 24) {
    console.error("__OVERFLOW = " + __OVERFLOW);
    console.error("__SUMALLSKILLS = " + __SUMALLSKILLS);
    console.error("__SUMPRISKILLS = " + __SUMPRISKILLS);
    console.error("getOpti(" + pos + ") = " + ((4 * (__SUMPRISKILLS - __OVERFLOW) + __SUMALLSKILLS) / __NUMOPTI));
}
                                      return (4 * (__SUMPRISKILLS - __OVERFLOW) + __SUMALLSKILLS) / __NUMOPTI;
*/
                                  },
        'getPrios'              : function(pos, when = this.__TIME.now) {
                                      return Math.min(this.__MAXPRISKILLS, this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4)) / 4;
                                  },
        'getPriPercent'         : function(pos, when = this.__TIME.now) {
                                      const __SUMPRISKILLS = this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4);
                                      const __SUMSECSKILLS = this.getSkillSum(when, getIdxSecSkills(pos), 7);
                                      const __OVERFLOW = Math.max(0, __SUMPRISKILLS - this.__MAXPRISKILLS);

                                      return (100 * (__SUMPRISKILLS - __OVERFLOW)) / (__SUMPRISKILLS + __SUMSECSKILLS);
                                  },
        'getSecPercent'         : function(pos, when = this.__TIME.now) {
                                      const __SUMPRISKILLS = this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4);
                                      const __SUMSECSKILLS = this.getSkillSum(when, getIdxSecSkills(pos), 7);
                                      const __OVERFLOW = Math.max(0, __SUMPRISKILLS - this.__MAXPRISKILLS);

                                      return (100 * (__SUMSECSKILLS + __OVERFLOW)) / (__SUMPRISKILLS + __SUMSECSKILLS);
                                  },
        'getTrainableSkills'    : function(when = this.__TIME.now) {
                                      return this.getSkillSum(when, getIdxTrainableSkills());
                                  },
        'getFixSkills'          : function() {
                                      return this.getSkillSum(this.__TIME.now, getIdxFixSkills());
                                  },
        'getMarketValue'        : function(pos, when = this.__TIME.now) {
                                      const __AGE = this.getAge(when);

                                      if (this.mwFormel === this.__MWFORMEL.alt) {
                                          return Math.round(Math.pow((1 + this.getSkill(when)/100) * (1 + this.getOpti(pos, when)/100) * (2 - __AGE/100), 10) * 2);    // Alte Formel bis Saison 9
                                      } else {  // MW-Formel ab Saison 10...
                                          const __MW5TF = 1.00;  // Zwischen 0.97 und 1.03

                                          return Math.round(Math.pow(1 + this.getSkill(when)/100, 5.65) * Math.pow(1 + this.getOpti(pos, when)/100, 8.1) * Math.pow(1 + (100 - __AGE)/49, 10) * __MW5TF);
                                      }
                                  },
        'getFingerPrint'        : function() {
                                      // Jeweils gleichbreite Werte: (Alter/Geb.=>Monat), Land, Talent ('-', '=', '+')...
                                      const __BASEPART = padNumber(this.birth / __MONATZATS, 3) + padLeft(this.land, -3);
                                      const __TALENT = '-=+'[this.talent + 1];

                                      if (this.skills === undefined) {
                                          return __BASEPART + getValue(__TALENT, "");
                                      } else {
                                          const __SKILLS = this.skills;
                                          const __FIXSKILLS = getIdxFixSkills().slice(-4);  // ohne die Nullen aus FUQ und ERF
                                          const __FIXSKILLSTR = __FIXSKILLS.map(function(idx) {
                                                                                    return padNumber(__SKILLS[idx], -2);
                                                                                }).join("");

                                          // Jeweils gleichbreite Werte: Zusaetzlich vier der sechs Fixskills...
                                          return (__BASEPART + getValue(__TALENT, '?') + __FIXSKILLSTR);
                                      }
                                  },
        'isFingerPrint'         : function(fpA, fpB) {
                                      if (fpA && fpB) {
                                          if (fpA === fpB) {
                                              return true;  // voellig identisch
                                          } else if (this.isBaseFingerPrint(fpA, fpB)) {
                                              return 1;  // schwaches true
                                          }
                                      }

                                      return false;
                                  },
        'isBaseFingerPrint'     : function(fpA, fpB) {
                                      if (fpA && fpB) {
                                          if (this.getBaseFingerPrint(fpA) === this.getBaseFingerPrint(fpB)) {
                                              // Base ist identisch...
                                              if ((getValue(fpA[6], '?') === '?') || (getValue(fpB[6], '?') === '?') || (fpA[6] === fpB[6])) {
                                                  // ... und auch das Talent-Zeichen ist leer oder '?'...
                                                  return true;
                                              }
                                          }
                                      }

                                      return false;
                                  },
        'getBaseFingerPrint'    : function(fingerprint) {
                                      return (fingerprint ? fingerprint.slice(0, 6) : undefined);
                                  },
        'getCatFromFingerPrint' : function(fingerprint) {
                                      return (fingerprint ? floorValue((fingerprint.slice(0, 3) - 1) / 12) : undefined);
                                  },
        'getCat'                : function() {
                                      return (this.birth ? floorValue((this.birth - 1) / __SAISONZATS) : undefined);
                                  },
        'findInFingerPrints'    : function(fingerprints) {
                                      const __MYFINGERPRINT = this.getFingerPrint();  // ggfs. unvollstaendiger Fingerprint
                                      const __MYCAT = this.getCat();
                                      const __RET = [];

                                      if (__MYCAT !== undefined) {
                                          for (let id in fingerprints) {
                                              const __CAT = this.getCatFromFingerPrint(id);

                                              if (__CAT === __MYCAT) {
                                                  if (this.isFingerPrint(id, __MYFINGERPRINT)) {
                                                      __RET.push(id);
                                                      break;  // erster Treffer zaehlt
                                                  }
                                              }
                                          }
                                      }

                                      return ((__RET.length === 1) ? __RET[0] : undefined);
                                  }
    });

// Ende Hilfs-Klassen *****************************************************************

// Hilfsfunktionen **********************************************************************

// Schaut nach, ob der uebergebene Index zu einem trainierbaren Skill gehoert
// Die Indizes gehen von 0 (SCH) bis 16 (EIN)
function isTrainableSkill(idx) {
    const __TRAINABLESKILLS = getIdxTrainableSkills();
    const __IDX = parseInt(idx, 10);
    let result = false;

    for (let idxTrainable of __TRAINABLESKILLS) {
        if (__IDX === idxTrainable) {
            result = true;
            break;
        }
    }

    return result;
}

// Gibt alle Skill-Namen zurueck
function getAllSkillNames(isGoalie = false) {
    if (isGoalie) {
        return [ 'ABS', 'STS', 'FAN', 'STB', 'SPL', 'REF', 'FUQ', 'ERF', 'AGG', 'PAS', 'AUS', 'UEB', 'WID', 'SEL', 'DIS', 'ZUV', 'EIN' ];
    } else {
        return [ 'SCH', 'BAK', 'KOB', 'ZWK', 'DEC', 'GES', 'FUQ', 'ERF', 'AGG', 'PAS', 'AUS', 'UEB', 'WID', 'SEL', 'DIS', 'ZUV', 'EIN' ];
    }
}

// Gibt den Skill-Namen zu einem Index zurueck
function getSkillName(idx, isGoalie = false) {
    const __ALLNAMES = getAllSkillNames(isGoalie);

    return ((idx != undefined) ? __ALLNAMES[idx] : idx);
}

// Gibt die Skill-Namen zu einem Index-Array zurueck
function getSkillNameArray(idxArr, isGoalie = false) {
    return (idxArr ? idxArr.map(function(item) {
                                    return getSkillName(item, isGoalie);
                                }) : idxArr);
}

// Gibt den Index zu einem Skill-Namen zurueck
function getSkillID(skillName, isGoalie = false) {
    const __ALLNAMES = getAllSkillNames(isGoalie);

    return ((skillName != undefined) ? __ALLNAMES.indexOf(skillName) : skillName);
}

// Gibt die Indices zu einem Skill-Namen-Array zurueck
function getSkillIdArray(nameArr, isGoalie = false) {
    return (nameArr ? nameArr.map(function(item) {
                                      return getSkillID(item, isGoalie);
                                  }) : nameArr);
}

// Gibt die Indizes aller Skills zurueck
function getIdxAllSkills() {
    return [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
}

// Gibt die Indizes der trainierbaren Skills zurueck
function getIdxTrainableSkills() {
    return [ 0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 15 ];
}

// Gibt die Indizes der Fixskills zurueck
function getIdxFixSkills() {
    return [ 6, 7, 12, 13, 14, 16 ];
}

// Gibt die Indizes der Primaerskills zurueck
function getIdxPriSkills(pos) {
    switch (pos) {
        case 'TOR' : return [ 2, 3, 4, 5 ];
        case 'ABW' : return [ 2, 3, 4, 15 ];
        case 'DMI' : return [ 1, 4, 9, 11 ];
        case 'MIT' : return [ 1, 3, 9, 11 ];
        case 'OMI' : return [ 1, 5, 9, 11 ];
        case 'STU' : return [ 0, 2, 3, 5 ];
        default :    return [];
    }
}

// Gibt die Indizes der (trainierbaren) Sekundaerskills zurueck
function getIdxSecSkills(pos) {
    switch (pos) {
        case 'TOR' : return [ 0, 1, 8, 9, 10, 11, 15 ];
        case 'ABW' : return [ 0, 1, 5, 8, 9, 10, 11 ];
        case 'DMI' : return [ 0, 2, 3, 5, 8, 10, 15 ];
        case 'MIT' : return [ 0, 2, 4, 5, 8, 10, 15 ];
        case 'OMI' : return [ 0, 2, 3, 4, 8, 10, 15 ];
        case 'STU' : return [ 1, 4, 8, 9, 10, 11, 15 ];
        default :    return [];
    }
}

// Gibt die zur Position gehoerigen Primaerskills zurueck
function getPrimarySkills(pos) {
    switch (pos) {
        case "TOR": return "FAN,STB,SPL,REF";
        case "ABW": return "KOB,ZWK,DEC,ZUV";
        case "DMI": return "BAK,DEC,PAS,UEB";
        case "MIT": return "BAK,ZWK,PAS,UEB";
        case "OMI": return "BAK,GES,PAS,UEB";
        case "STU": return "SCH,KOB,ZWK,GES";
        case "LEI": return "";
        default:    return "";
    }
}

// Gibt zurueck, ob der Skill ein zur Position gehoeriger Primaerskill ist
function isPrimarySkill(pos, skill) {
    const __PRIMARYSKILLS = getPrimarySkills(pos);

    return (__PRIMARYSKILLS.indexOf(skill) > -1);
}

// Hilfsfunktionen fuer das Training **********************************************************************

// Gibt die Position dieser Zeile zurueck
function getPos(row, colIdxChance) {
    const __CLASSNAME = row.cells[colIdxChance].className;

    return __CLASSNAME;
}

// Gibt den Skill dieser Zeile zurueck
function getSkill(row, colIdxSkill) {
    const __HTML = row.cells[colIdxSkill].innerHTML;
    //const __SKILL = __HTML.substr(__HTML.indexOf("\"selected\"") + 11, 3);
    const __SKILL = __HTML.substr(__HTML.indexOf("selected=\"\"") + 12, 3);

    return __SKILL;
}

// Gibt den Spieler in dieser Zeile zurueck
function getSpieler(row, colIdxSpieler) {
    const __HTML = row.cells[colIdxSpieler].innerHTML;
    const __SEARCH = "javascript:spielerinfo(";
    const __INDEX1 = __HTML.indexOf(__SEARCH);
    const __INDEX2 = __HTML.indexOf(')', __INDEX1);
    const __INDEX3 = __HTML.indexOf('>', __INDEX2);
    const __INDEX4 = __HTML.indexOf("</a>", __INDEX3);
    const __SID = ((~ __INDEX1) ? parseInt(__HTML.substring(__INDEX1 + __SEARCH.length, __INDEX2), 10) : undefined);
    const __SNAME = ((~ __INDEX3) ? __HTML.substring(__INDEX3 + 1, __INDEX4) : undefined);

    return {
               'id'   : __SID,
               'name' : __SNAME
           };
}

// Gibt die Spieler-ID in dieser Zeile zurueck
function getSpielerID(row, colIdxSpieler) {
    return getSpieler(row, colIdxSpieler).id;
}

// Gibt den Spielernamen in dieser Zeile zurueck
function getSpielerName(row, colIdxSpieler) {
    return getSpieler(row, colIdxSpieler).name;
}

// Gibt die Wahrscheinlichkeit fuer eine Aufwertung zurueck
function getProbString(row, colIdxChance) {
    const __PROBSTR = row.cells[colIdxChance].textContent;

    return __PROBSTR;
}

// Gibt das Alter des Spielers dieser Zeile zurueck
function getAlter(row, colIdxAlter) {
    const __ALTERSTR = row.cells[colIdxAlter].textContent;

    return parseInt(__ALTERSTR, 10);
}

// Gibt den Skillwert des trainierten Skills des Spielers dieser Zeile zurueck
function getPSkill(row, colIdxPSkill) {
    const __PSKILLSTR = row.cells[colIdxPSkill].textContent;

    return ((__PSKILLSTR.length === 0) ? undefined : parseInt(__PSKILLSTR, 10));
}

// Gibt den Trainer-Skill dieser Zeile zurueck
function getTSkill(row, colIdxTSkill) {
    const __HTML = row.cells[colIdxTSkill].innerHTML;
    //const __TSKILLSTR = __HTML.substr(__HTML.indexOf("\"selected\"") + 15);
    const __TSKILLSTR = __HTML.substr(__HTML.indexOf("selected=\"\"") + 16);
    const __TSKILL = ((__TSKILLSTR.substr(0, 1) === '/') ? undefined : parseFloat(__TSKILLSTR.substr(0, __TSKILLSTR.indexOf('<'))));

    return __TSKILL;
}

// Gibt die Trainer-Zuordnung dieser Zeile zurueck
function getTrainerNr(row, colIdxTrainer) {
    const __HTML = row.cells[colIdxTrainer].innerHTML;
    //const __TRAINERSTR = __HTML.substr(__HTML.indexOf("\"selected\"") + 13);
    const __TRAINERSTR = __HTML.substr(__HTML.indexOf("selected=\"\"") + 14);
    const __TRAINERNR = ((__TRAINERSTR.substr(2, 1) === '/') ? undefined : parseInt(__TRAINERSTR.substr(0, 1), 10));

    return __TRAINERNR;
}

// ==================== Ende Abschnitt genereller Code zur Anzeige des Trainings ====================

// ==================== Page-Manager fuer zu bearbeitende Seiten ====================

// Verarbeitet Ansicht "Haupt" (Managerbuero) zur Ermittlung des aktuellen ZATs
const procHaupt = new PageManager("Haupt (Managerb\u00FCro)", null, () => {
        const __TEAMPARAMS = getTeamParamsFromTable(__TEAMSEARCHHAUPT, __TEAMIDSEARCHHAUPT);

        return {
                'teamParams'  : __TEAMPARAMS,
//                'menuAnchor'  : getElement('DIV'),
                'hideMenu'    : true,
                'oldData'     : false,
                'showForm'    : {
                                    'showForm'  : true
                                }
            };
    }, async optSet => {
        //const __ZATCELL = getProp(getProp(getRows(), 2), 'cells', { })[0];
        const __ZATCELL = getElement('TD[style] B');  // #2,0: Der erste farbige Fetteintrag ('<td style="color:orange"><b>')
        const __NEXTZAT = getZATNrFromCell(__ZATCELL);  // "Der naechste ZAT ist ZAT xx und ..."
        const __CURRZAT = __NEXTZAT - 1;
        const __DATAZAT = optSet.getOptValue('datenZat');

        if (__CURRZAT >= 0) {
            __LOG[2]("Aktueller ZAT: " + __CURRZAT);

            // Neuen aktuellen ZAT speichern...
            optSet.setOpt('aktuellerZat', __CURRZAT, false);

            if (__CURRZAT !== __DATAZAT) {
                __LOG[2](__LOG.changed(__DATAZAT, __CURRZAT));

                __LOG[1]("vor DELETE:" + optSet);

                // ... und ZAT-bezogene Daten als veraltet markieren (NIE die Optionen, die nach 'old' gehen!)
                const __IGNLIST = Object.assign({
                                                    'datenZat'    : true,
                                                    'oldDatenZat' : true
                                                }, __LASTZATCLASS.optSelect);

                await __TEAMCLASS.deleteOptions(__IGNLIST).catch(defaultCatch);

                const __CLASSIFICATION = new Classification('old');

                __LOG[1]("vor RENAME:" + optSet);

                // Daten in 'old'-Daten ueberfuehren...
                __CLASSIFICATION.optSelect = Object.Map(__LASTZATCLASS.optSelect, () => false);  // false: Kein reload
                __CLASSIFICATION.optSet = optSet;
                await __CLASSIFICATION.renameOptions();

                __LOG[1]("vor SAVE:" + optSet);

                // Daten in 'old' speichern...
                __CLASSIFICATION.optSelect = Object.Map(__LASTZATCLASS.optSelect, () => true);  // true: Speichern
                await __CLASSIFICATION.saveOptions();

                // Stand der alten Daten merken...
                optSet.setOpt('oldDatenZat', __DATAZAT, false);

                // Neuen Daten-ZAT speichern...
                optSet.setOpt('datenZat', __CURRZAT, false);
            }
        }

        return true;
    });

// Verarbeitet Ansicht "Zugabgabe - Aufstellung"
const procAufstellung = new PageManager("Zugabgabe - Aufstellung", null, () => {
        if (getRows('TABLE+TABLE') === undefined) {  // #4: Tabelle mit Spieleraufstellung direkt hinter der Tabelle mit Raster
            __LOG[2]("Diese Seite ist ohne Team nicht verf\u00FCgbar!");
        } else {
            return {
//                    'menuAnchor'  : getElement('DIV'),
                    'oldData'     : false,
                    'showForm'    : {
                                        'saison'        : true,
                                        'aktuellerZat'  : true,
                                        'team'          : true,
                                        'ids'           : true,
                                        'names'         : true,
                                        'ages'          : true,
                                        'positions'     : true,
                                        'opti27'        : true,
                                        'einsaetze'     : true,
                                        'reset'         : true,
                                        'showForm'      : false
                                    },
                    'formWidth'   : 1
                };
        }
        // Fehler fuer alle Faelle ohne Rueckgabewert...
        return false;
    }, async optSet => {
        const __COLUMNINDEX = {
                'Raster'   : 0,
                'Spieler'  : 1,
                'Age'      : 2,
                'U'        : 3,
                'MOR'      : 4,
                'FIT'      : 5,
                'Skill'    : 6,
                'Opti'     : 7,
                'S'        : 8
            };
        const __EINSATZ = {
                'Trib'  : 0,
                'Bank'  : 1,
                'Teil'  : 2,
                'Durch' : 3
            };

        // Gespeicherte Daten...
        //const __TRAINER = optSet.getOptValue('trainer', []);
        const __IDS = optSet.getOptValue('ids', []);
        const __NAMES = optSet.getOptValue('names', []);
        const __AGES = optSet.getOptValue('ages', []);
        const __POSITIONS = optSet.getOptValue('positions', []);
        const __OPTI27 = optSet.getOptValue('opti27', []);
        //const __VERLETZT = optSet.getOptValue('verletzt', []);
        //const __SKILLS = optSet.getOptValue('skills', []);
        //const __TSKILLS = optSet.getOptValue('tSkills', []);
        //const __TRAINIERT = optSet.getOptValue('trainiert', []);
        //const __SKILLPOS = optSet.getOptValue('skillPos', []);
        //const __ISPRIO = optSet.getOptValue('isPrio', []);
        const __EINSAETZE = optSet.getOptValue('einsaetze', []);
        //const __PROZENTE = optSet.getOptValue('prozente', []);
        //const __EW = optSet.getOptValue('erwartungen', []);
        //const __ERFOLGE = optSet.getOptValue('erfolge', []);
        //const __BLESSUREN = optSet.getOptValue('blessuren', []);

        const __ROWS = getRows('TABLE+TABLE');  // #4: Tabelle mit Spieleraufstellung direkt hinter der Tabelle mit Raster
        //const __HEADERS = __ROWS[0];
        const __SLENGTH = __ROWS.length - 6;
        //const __TLENGTH = 6;

        __EINSAETZE.length = __SLENGTH;
        __EINSAETZE.fill(__EINSATZ.Trib);

        let newID = false;

        for (let i = 1; i < __ROWS.length - 5; i++) {
            const __CURRENTROW = __ROWS[i];
            const __SPIELER = getSpieler(__CURRENTROW, __COLUMNINDEX.Spieler);
            const __ID = __SPIELER.id;
            const __NAME = __SPIELER.name;

            if (! __IDS.includes(__ID)) {
                const __ALTER = getAlter(__CURRENTROW, __COLUMNINDEX.Age);
                const __POS = getPos(__CURRENTROW, __COLUMNINDEX.Spieler);
                const __OPTI = getFloatFromHTML(__CURRENTROW.cells, __COLUMNINDEX.Opti);
                const __O27 = parseInt((__NUMOPTI * __OPTI).toFixed(0), 10);

                __LOG[4]("Adding new player", '#' + __ID, __NAME, __ALTER, __POS, __OPTI.toFixed(2));

                newID = true;
                __IDS.push(__ID);
                __NAMES.push(__NAME);
                __AGES.push(__ALTER);
                __POSITIONS.push(__POS);
                __OPTI27.push(__O27);
            }

            const __INDEX = __IDS.indexOf(__ID);
            const __RASTER = getSelection("ra[" + __ID + ']');

            if (~ __INDEX) {
                __EINSAETZE[__INDEX] = ((__RASTER === '-') ? __EINSATZ.Trib : ((~ "UVWXYZ".indexOf(__RASTER)) ? __EINSATZ.Bank : __EINSATZ.Durch));
            } else {
                __LOG[0]("User-ID", __ID, "not found!");
            }
        }

        if (newID) {
            optSet.setOpt('ids', __IDS, false);
            optSet.setOpt('names', __NAMES, false);
            optSet.setOpt('ages', __AGES, false);
            optSet.setOpt('positions', __POSITIONS, false);
            optSet.setOpt('opti27', __OPTI27, false);
        }

        optSet.setOpt('einsaetze', __EINSAETZE, false);

        //optSet.setOpt('trainer', __TRAINER, false);
        //optSet.setOpt('verletzt', __VERLETZT, false);
        //optSet.setOpt('skills', __SKILLS, false);
        //optSet.setOpt('tSkills', __TSKILLS, false);
        //optSet.setOpt('trainiert', __TRAINIERT, false);
        //optSet.setOpt('skillPos', __SKILLPOS, false);
        //optSet.setOpt('isPrio', __ISPRIO, false);
        //optSet.setOpt('prozente', __PROZENTE, false);
        //optSet.setOpt('erwartungen', __EW, false);
        //optSet.setOpt('erfolge', __ERFOLGE, false);
        //optSet.setOpt('blessuren', __BLESSUREN, false);

        return true;
    });

// Verarbeitet Ansicht "Zugabgabe - Aktionen"
const procAktionen = new PageManager("Zugabgabe - Aktionen", null, () => {
        if (getRows() === undefined) {
            __LOG[2]("Diese Seite ist ohne Team nicht verf\u00FCgbar!");
        } else {
            return {
                    'menuAnchor'  : getElement('DIV'),
                    'oldData'     : false,
                    'showForm'    : {
                                        'saison'        : true,
                                        'aktuellerZat'  : true,
                                        'team'          : true,
                                        'reset'         : true,
                                        'showForm'      : true
                                    },
                    'formWidth'   : 1
                };
        }
        // Fehler fuer alle Faelle ohne Rueckgabewert...
        return false;
    }, async optSet => {
            UNUSED(optSet);
            //const __ROWS = getRows();
            //const __HEADERS = __ROWS[0];
            //return true;
        });

// Verarbeitet Ansicht "Zugabgabe - Einstellungen"
const procEinstellungen = new PageManager("Zugabgabe - Einstellungen", null, () => {
    if (getRows() === undefined) {
        __LOG[2]("Diese Seite ist ohne Team nicht verf\u00FCgbar!");
        } else {
            return {
                    'menuAnchor'  : getElement('DIV'),
                    'oldData'     : false,
                    'showForm'    : {
                                        'saison'        : true,
                                        'aktuellerZat'  : true,
                                        'team'          : true,
                                        'reset'         : true,
                                        'showForm'      : true
                                    },
                    'formWidth'   : 1
                };
        }
        // Fehler fuer alle Faelle ohne Rueckgabewert...
        return false;
    }, async optSet => {
            UNUSED(optSet);
            //const __ROWS = getRows();
            //const __HEADERS = __ROWS[0];
            //return true;
        });

// Verarbeitet Ansicht "Trainer"
const procTrainer = new PageManager("Trainer", null, () => {
//        if (getRows() === undefined) {
//            __LOG[2]("Diese Seite ist ohne Team nicht verf\u00FCgbar!");
//        } else {
            return {
                    'menuAnchor'  : getElement('DIV'),
                    'oldData'     : false,
                    'showForm'    : {
                                        'saison'        : true,
                                        'aktuellerZat'  : true,
                                        'team'          : true,
                                        'reset'         : true,
                                        'showForm'      : true
                                    },
                    'formWidth'   : 1
                };
//        }
        // Fehler fuer alle Faelle ohne Rueckgabewert...
//        return false;
    }, async optSet => {
            UNUSED(optSet);
            //const __ROWS = getRows();
            //const __HEADERS = __ROWS[0];
            //return true;
        });

// Verarbeitet Ansicht "Training"
const procTraining = new PageManager("Training", null, () => {
        if (getRows('FORM TABLE') === undefined) {  // #2: Tabelle innerhalb des Forms zur Trainingseinstellung
            __LOG[2]("Diese Seite ist ohne Team nicht verf\u00FCgbar!");
        } else {
            return {
                    'menuAnchor'  : getElement('DIV'),
                    'oldData'     : false,
                    'showForm'    : {
                                        'sepStyle'      : true,
                                        'sepColor'      : true,
                                        'sepWidth'      : true,
                                        'saison'        : true,
                                        'aktuellerZat'  : true,
                                        'team'          : true,
                                        'trainer'       : true,
                                        'tGehaelter'    : true,
                                        'tVertraege'    : true,
                                        'tReste'        : true,
                                        'tAnzahlen'     : true,
                                        'ids'           : true,
                                        'names'         : true,
                                        'ages'          : true,
                                        'positions'     : true,
                                        'opti27'        : true,
                                        'verletzt'      : true,
                                        'skills'        : true,
                                        'tSkills'       : true,
                                        'trainiert'     : true,
                                        'skillPos'      : true,
                                        'isPrio'        : true,
                                        'einsaetze'     : true,
                                        'prozente'      : true,
                                        'erwartungen'   : true,
                                        'erfolge'       : true,
                                        'blessuren'     : true,
                                        'reset'         : true,
                                        'showForm'      : true
                                   },
                    'formWidth'  : 1
                };
        }
        // Fehler fuer alle Faelle ohne Rueckgabewert...
        return false;
    }, async optSet => {
        const __COLWIDTH  = 80;
        const __COLWIDTH2 = 40;

        const __COLUMNINDEX = {
                'Verletzt' : 0,
                'Spieler'  : 1,
                'Age'      : 2,
                'Opti'     : 3,
                'Trainer'  : 4,
                'TSkill'   : 4,
                'Skill'    : 5,
                'PSkill'   : 6,
                'Chance'   : 7
            };
        const __TITLE = {
                'Prob1'    : "Bankeinsatz",
                'Prob2'    : "Teilweise",
                'Prob3'    : "Durchgehend",
                'PS'       : "Primary",
                'Value'    : "EW",
                'WS0'      : "WS0",
                'WS'       : "WS",
                'Min0'     : "min.",
                'Min3'     : "max.",
                'Gehalt'   : "Gehalt"
            };
        const __EINSATZ = {
                'Trib'  : 0,
                'Bank'  : 1,
                'Teil'  : 2,
                'Durch' : 3
            };

        // Gespeicherte Daten...
        const __TRAINER = [];  // neu aufbauen! optSet.getOptValue('trainer', []);
        const __TANZAHL = [0, 0, 0, 0, 0, 0];  // neu aufbauen! optSet.getOptValue('tAnzahlen', []);
        const __IDS = optSet.getOptValue('ids', []);
        const __NAMES = optSet.getOptValue('names', []);
        const __AGES = optSet.getOptValue('ages', []);
        const __POSITIONS = optSet.getOptValue('positions', []);
        const __OPTI27 = optSet.getOptValue('opti27', []);
        //const __VERLETZT = optSet.getOptValue('verletzt', []);
        const __SKILLS = optSet.getOptValue('skills', []);
        const __TSKILLS = optSet.getOptValue('tSkills', []);
        const __TRAINIERT = optSet.getOptValue('trainiert', []);
        const __SKILLPOS = optSet.getOptValue('skillPos', []);
        const __ISPRIO = optSet.getOptValue('isPrio', []);
        const __EINSAETZE = optSet.getOptValue('einsaetze', []);
        const __PROZENTE = optSet.getOptValue('prozente', []);
        const __EW = optSet.getOptValue('erwartungen', []);
        const __ERFOLGE = optSet.getOptValue('erfolge', []);
        const __BLESSUREN = optSet.getOptValue('blessuren', []);

        const __EINSMAP = { };

        // Ermittelte Einsaetze (ggfs. von Aufstellung-Seite) den IDs zuordnen (bei Sperren, Verletzungen, Leihen relevant)...
        __IDS.map((id, index) => (__EINSMAP[id] = __EINSAETZE[index]));
        __EINSAETZE.length = 0;  // vorerst alle loeschen und spaeter wieder einfuegen!

        const __ROWS = getRows('FORM TABLE');  // #2: Tabelle innerhalb des Forms zur Trainingseinstellung
        const __HEADERS = __ROWS[0];
        const __OPAQUEUNUSED    = 0.4;
        const __OPAQUECHANCE    = 0.5;
        const __OPAQUEEINSATZ   = 1.0;

        // Ueberschriften hinzufuegen
        const __ORGLENGTH = __HEADERS.cells.length;
        appendCell(__HEADERS, __TITLE.Prob1);
        appendCell(__HEADERS, __TITLE.Prob2);
        appendCell(__HEADERS, __TITLE.Prob3);

        const __COL2LENGTH = __HEADERS.cells.length;
        appendCell(__HEADERS, __TITLE.PS);
        appendCell(__HEADERS, __TITLE.Value);
        appendCell(__HEADERS, __TITLE.WS0);
        appendCell(__HEADERS, __TITLE.WS);
        appendCell(__HEADERS, __TITLE.Min0);
        appendCell(__HEADERS, __TITLE.Min3);
        //appendCell(__HEADERS, __TITLE.Gehalt);

        // Breite der neuen Spalten festlegen
        for (let i = __ORGLENGTH + 1; i < __HEADERS.cells.length; i++) {
            __HEADERS.cells[i].setAttribute('width', (i < __COL2LENGTH) ? __COLWIDTH : __COLWIDTH2, false);
        }

        const __PROBINDEX = __COLUMNINDEX.Chance;  // entspricht __ORGLENGTH - 1 (derzeit letzte Spalte), enthaelt die Prozente
        const __SLENGTH = __ROWS.length - 1;
        const __TLENGTH = 6;

        __TRAINER.length = __TLENGTH;
        __TANZAHL.length = __TLENGTH;
        __IDS.length = __SLENGTH;
        __NAMES.length = __SLENGTH;
        __AGES.length = __SLENGTH;
        __POSITIONS.length = __SLENGTH;
        __OPTI27.length = __SLENGTH;
        //__VERLETZT.length = __SLENGTH;
        __SKILLS.length = __SLENGTH;
        __TSKILLS.length = __SLENGTH;
        __TRAINIERT.length = __SLENGTH;
        __SKILLPOS.length = __SLENGTH;
        __ISPRIO.length = __SLENGTH;
        __EINSAETZE.length = __SLENGTH;
        __PROZENTE.length = __SLENGTH;
        __EW.length = __SLENGTH;
        __ERFOLGE.length = __SLENGTH;
        __BLESSUREN.length = __SLENGTH;

        // Wahrscheinlichkeiten eintragen
        let value = 0.0;
        let sum = 0.0;
        for (let i = 1; i < __ROWS.length; i++) {
            const __INDEX = i - 1;
            const __CURRENTROW = __ROWS[i];
            const __SPIELER = getSpieler(__CURRENTROW, __COLUMNINDEX.Spieler);
            const __ID = __SPIELER.id;
            const __NAME = __SPIELER.name;
            const __SKILL = getSkill(__CURRENTROW, __COLUMNINDEX.Skill);
            const __POS = getPos(__CURRENTROW, __PROBINDEX);
            const __COLOR = getColor(__POS);
            const __EINSART = getValue(__EINSMAP[__ID], __EINSATZ.Trib);  // Daten oben ermittelt
            const __PROBSTRING = getProbString(__CURRENTROW, __PROBINDEX);
            const __PRACTICE = (getProbabilityStr(__PROBSTRING, __EINSATZ.Trib) !== "");
            const __PRACTICEPS = __PRACTICE && isPrimarySkill(__POS, __SKILL);

            if (__PRACTICE) {
                value = parseFloat(getProbabilityStr(__PROBSTRING, __EINSART, "", 2, 99)) * (__PRACTICEPS ? 5 : 1) / 100.0;
                sum += value;
            } else {
                value = 0.0;
            }

            const __VALUESTR = value.toFixed(2).toString();
            const __ALTER = getAlter(__CURRENTROW, __COLUMNINDEX.Age);
            const __GOALIE = isGoalieFromHTML(__CURRENTROW.cells, __COLUMNINDEX.Spieler);
            const __OPTI = getFloatFromHTML(__CURRENTROW.cells, __COLUMNINDEX.Opti);
            const __PSKILL = getPSkill(__CURRENTROW, __COLUMNINDEX.PSkill);
            const __TSKILL = getTSkill(__CURRENTROW, __COLUMNINDEX.TSkill);
            const __TNR = getTrainerNr(__CURRENTROW, __COLUMNINDEX.Trainer);
            const __PROBSTR0 = calcProbPercent(__ALTER, __PSKILL, __TSKILL);
            const __PROBSTR = calcProbPercent(__ALTER, __PSKILL, __TSKILL, __EINSART);
            const __MINSTR0 = calcMinPSkill(__ALTER, __TSKILL, __EINSATZ.Trib);
            const __MINSTR3 = calcMinPSkill(__ALTER, __TSKILL, __EINSATZ.Durch);
            //const __GEHALT = calcTGehalt(__TSKILL);

            if (__TNR) {
                __TRAINER[__TNR - 1] = __TSKILL;
                __TANZAHL[__TNR - 1]++;
            }
            __IDS[__INDEX] = __ID;
            __NAMES[__INDEX] = __NAME;
            __AGES[__INDEX] = __ALTER;
            __POSITIONS[__INDEX] = __POS;
            __OPTI27[__INDEX] = parseInt((__NUMOPTI * __OPTI).toFixed(0), 10);
            //__VERLETZT[__INDEX] = 0;
            __SKILLS[__INDEX] = __PSKILL;
            __TSKILLS[__INDEX] = __TSKILL;
            __TRAINIERT[__INDEX] = __TNR;
            __SKILLPOS[__INDEX] = getSkillID((__PRACTICE ? __SKILL : undefined), __GOALIE);
            __ISPRIO[__INDEX] = (__PRACTICEPS ? 1 : 0);
            __EINSAETZE[__INDEX] = __EINSART;  // auf oben ermittelte Daten zurueckgreifen!
            __PROZENTE[__INDEX] = (__PRACTICE ? Math.min(99, parseInt(__PROBSTR.toFixed(0), 10)) : undefined);
            __EW[__INDEX] = parseFloat(__VALUESTR, 10);
            __ERFOLGE[__INDEX] = false;
            __BLESSUREN[__INDEX] = 0;

            formatCell(__CURRENTROW.cells[__PROBINDEX + __EINSATZ.Trib], undefined, undefined, undefined, __OPAQUECHANCE);
            for (let j = __EINSATZ.Bank; j <= __EINSATZ.Durch; j++) {
                const __CELL = appendCell(__CURRENTROW, getProbabilityStr(__PROBSTRING, j), __COLOR);

                formatCell(__CELL, undefined, undefined, undefined, __OPAQUEUNUSED);
            }
            if (__PRACTICE) {
                formatCell(__CURRENTROW.cells[__PROBINDEX + __EINSART], true, undefined, undefined, __OPAQUEEINSATZ);  // fett
            } else if (__EINSART > __EINSATZ.Trib) {  // Inhalt verschieben in die richtige Spalte (Wert ist 0.00 %)
                __CURRENTROW.cells[__PROBINDEX + __EINSART].innerHTML = __CURRENTROW.cells[__PROBINDEX + __EINSATZ.Trib].innerHTML;
                __CURRENTROW.cells[__PROBINDEX + __EINSATZ.Trib].textContent = '';
            }

            appendCell(__CURRENTROW, __PRACTICEPS ? __SKILL : "", __COLOR);
            appendCell(__CURRENTROW, __VALUESTR, __COLOR);
            appendCell(__CURRENTROW, __PROBSTR0.toFixed(2), __COLOR);
            appendCell(__CURRENTROW, __PROBSTR.toFixed(2), __COLOR);
            appendCell(__CURRENTROW, value ? __MINSTR0.toFixed(0) : "", __COLOR);
            appendCell(__CURRENTROW, value ? __MINSTR3.toFixed(0) : "", __COLOR);
            //appendCell(__CURRENTROW, __GEHALT.toFixed(0), __COLOR);
/*
            if (__PRACTICEPS) {
                for (let j = 0; j < __CURRENTROW.length; j++) {
                    __CURRENTROW.cells[j].style.color = '#FFFFFF';
                    __CURRENTROW.cells[j].style.fontWeight = 'bold';
                }
            }
*/
        }

        // Fuegt einen Hinweis zur maximalen Trainingswahrscheinlichkeit in den Textbereich ueber der Tabelle hinzu
        const __WARN1 = "Die in den Spalten \"" + __TITLE.Prob1 + "\", \"" + __TITLE.Prob2 + "\" und \"" + __TITLE.Prob3 +
                        "\" angegebenen Wahrscheinlichkeiten dienen nur zur Orientierung!";
        const __WARN2 = "Die maximale Wahrscheinlichkeit einer Aufwertung ist immer 99.00 %! Zu erwartende Aufwertungen = " + sum.toFixed(2).toString();

        const __TABLE = getTable(1);  // #1: Tabelle mit "Achtung!"-Anleitungstext ueber dem Form zur Trainingseinstellung
        const __NEWCELL1 = appendCell(__TABLE.insertRow(-1), __WARN1 /* , '#FFFF00' */);
        __NEWCELL1.setAttribute('colspan', 4, false);
        const __NEWCELL2 = appendCell(__TABLE.insertRow(-1), __WARN2 /* , '#FFFF00' */);
        __NEWCELL2.setAttribute('colspan', 3, false);

        optSet.setOpt('trainer', __TRAINER, false);
        optSet.setOpt('tAnzahlen', __TANZAHL, false);
        optSet.setOpt('ids', __IDS, false);
        optSet.setOpt('names', __NAMES, false);
        optSet.setOpt('ages', __AGES, false);
        optSet.setOpt('positions', __POSITIONS, false);
        optSet.setOpt('opti27', __OPTI27, false);
        //optSet.setOpt('verletzt', __VERLETZT, false);
        optSet.setOpt('skills', __SKILLS, false);
        optSet.setOpt('tSkills', __TSKILLS, false);
        optSet.setOpt('trainiert', __TRAINIERT, false);
        optSet.setOpt('skillPos', __SKILLPOS, false);
        optSet.setOpt('isPrio', __ISPRIO, false);
        optSet.setOpt('einsaetze', __EINSAETZE, false);
        optSet.setOpt('prozente', __PROZENTE, false);
        optSet.setOpt('erwartungen', __EW, false);
        //optSet.setOpt('erfolge', __ERFOLGE, false);
        //optSet.setOpt('blessuren', __BLESSUREN, false);

        return true;
    });

// Verarbeitet Ansicht "ZAT-Report"
const procZatReport = new PageManager("ZAT-Report", null, () => {
        if (getRows('TABLE~TABLE') === undefined) {  // #1: Tabelle (Trainingserfolge) mit Geschwistertabelle (Einnahmen / Ausgaben) davor
            __LOG[2]("Diese Seite ist ohne Team nicht verf\u00FCgbar!");
        } else {
            return {
                    'menuAnchor'  : getElement('DIV'),
                    'oldData'     : true,
                    'showForm'    : {
                                        'zeigeId'               : true,
                                        'zeigeAlter'            : true,
                                        'zeigePosition'         : true,
                                        'zeigeTOR'              : true,
                                        'zeigeOpti'             : true,
                                        'zeigeVerletzung'       : true,
                                        'zeigeBlessur'          : true,
                                        'zeigeSkillPos'         : true,
                                        'zeigeSkill'            : true,
                                        'zeigeSkillUp'          : true,
                                        'zeigeTSkill'           : true,
                                        'zeigeTNr'              : true,
                                        'zeigePrio'             : true,
                                        'zeigeEinsatz'          : true,
                                        'zeigeProzent'          : true,
                                        'zeigeProzentBalken'    : true,
                                        'zeigeErwartung'        : true,
                                        'zeigeErwartungBalken'  : true,
                                        'zeigeErfolg'           : true,
                                        'sepStyle'              : true,
                                        'sepColor'              : true,
                                        'sepWidth'              : true,
                                        'saison'                : true,
                                        'aktuellerZat'          : true,
                                        'team'                  : true,
                                        'reset'                 : true,
                                        'showForm'              : true
                                   },
                    'formWidth'  : 1
                };
        }
        // Fehler fuer alle Faelle ohne Rueckgabewert...
        return false;
    }, async optSet => {
        const __ROWOFFSETUPPER = 1;     // Header-Zeile (nach Einfuegung!)
        const __ROWOFFSETLOWER = 0;     // Fussnote

        const __COLUMNINDEX = {
                'Name'  : 0,
                'Succ'  : 1,
                'Zus'   : 2
            };

        // Gespeicherte Daten...
        const __IDS = optSet.getOptValue('ids', []);
        //const __NAMES = optSet.getOptValue('names', []);
        const __AGES = optSet.getOptValue('ages', []);
        const __POSITIONS = optSet.getOptValue('positions', []);
        const __OPTI27 = optSet.getOptValue('opti27', []);
        const __VERLETZT = optSet.getOptValue('verletzt', []);
        const __SKILLS = optSet.getOptValue('skills', []);
        const __TSKILLS = optSet.getOptValue('tSkills', []);
        const __TRAINIERT = optSet.getOptValue('trainiert', []);
        const __SKILLPOS = optSet.getOptValue('skillPos', []);
        const __ISPRIO = optSet.getOptValue('isPrio', []);
        const __EINSAETZE = optSet.getOptValue('einsaetze', []);
        const __PROZENTE = optSet.getOptValue('prozente', []);
        const __EW = optSet.getOptValue('erwartungen', []);
        const __ERFOLGE = [];  // neu aufbauen! optSet.getOptValue('erfolge', []);
        const __BLESSUREN = [];  // neu aufbauen! optSet.getOptValue('blessuren', []);

        const __PLAYERS = [];  // init(__ROWS, optSet, __COLUMNINDEX, __ROWOFFSETUPPER, __ROWOFFSETLOWER, 1);
        const __COLMAN = new ColumnManagerZatReport(optSet, __COLUMNINDEX, {
                                            'Default'            : true,
                                            'zeigeErfahrung'     : false
                                        });

        const __TABLE = getElement('TABLE ~ TABLE');    // #1: Tabelle (Trainingserfolge) mit Geschwistertabelle (Einnahmen / Ausgaben) davor
        const __ROWS = __TABLE.rows;
        const __TITLECOLOR = getColor('LEI');  // '#FFFFFF'
        const __DATA = [ 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60 ];
        const __SAISON = __COLMAN.oldSaison;
        const __CURRZAT = __COLMAN.oldZAT;
        const __TEAM = __COLMAN.team;
        const __LAND = __TEAM.Land;

        let sumErwartung = 0.0;
        let sumAufwertung = 0.0;

        const __HEADERS = __COLMAN.insertTitles(__TABLE, __TITLECOLOR);
        UNUSED(__HEADERS);

        for (let i = __ROWOFFSETUPPER, j = 0; i < __ROWS.length - __ROWOFFSETLOWER; i++) {
            const __CURRENTROW = __ROWS[i];
            const __CELLS = __CURRENTROW.cells;

            if (__CELLS.length > 1) {
                const __SPIELER = getSpieler(__CURRENTROW, __COLUMNINDEX.Name);
                const __ID = __SPIELER.id;
                const __NAME = __SPIELER.name;
                const __INDEX = __IDS.indexOf(__ID);
                const __SUCC = getStringFromHTML(__CELLS, __COLUMNINDEX.Succ);
                const __SUCCNUM = parseInt(__SUCC.substr(-6, 2), 10);  // 2 Stellen ab Ende - 6, dahinter " ZAT" bzw. " FIT"
                const __ERFAHRUNG = (__SUCC === "Erfahrung gestiegen");
                const __FUQ = (! __ERFAHRUNG) && (__SUCC === "F\u00FChrungsqualität gestiegen");
                const __ERFOLG = ((__ERFAHRUNG || __FUQ) ? undefined : (__SUCC.endsWith(" erfolglos") ? 0 : (__SUCC.endsWith(" erfolgreich") ? 1 : undefined)));
                const __BLESSUR = (__SUCC.startsWith("Trainingsblessur: ") ? (__SUCC.endsWith(" FIT") ? __SUCCNUM : (__SUCC.endsWith(" ZAT") ? - __SUCCNUM : undefined)) : undefined);
                const __ERROR = ! (__ERFAHRUNG || __FUQ || (__ERFOLG !== undefined) || (__BLESSUR !== undefined));

                if (__ERROR) {
                    __LOG[0]("Error: " + __SUCC + " (" + __SUCCNUM + ')');
                }
                const __ALTER = __AGES[__INDEX];
                const __POS = __POSITIONS[__INDEX];
                const __ISGOALIE = (__POS === "TOR");
                const __OPTI = parseInt(__OPTI27[__INDEX], 10) / __NUMOPTI;
                const __VERL = __VERLETZT[__INDEX];
                const __PSKILL = __SKILLS[__INDEX];
                const __TSKILL = __TSKILLS[__INDEX];
                const __TNR = __TRAINIERT[__INDEX];
                const __SKILLID = __SKILLPOS[__INDEX];
                const __PRACTICEPS = (__ISPRIO[__INDEX] > 0);
                const __EINSATZ = __EINSAETZE[__INDEX];
                const __PROZENT =  __PROZENTE[__INDEX];
                const __ERWARTUNG = __EW[__INDEX];

                __ERFOLGE[__INDEX] = __ERFOLG;
                __BLESSUREN[__INDEX] = __BLESSUR;

                const __NEWPLAYER = new PlayerRecordTraining(__LAND, __ALTER, __ISGOALIE, __SAISON, __CURRZAT, 10000);

                __NEWPLAYER.initPlayer(__DATA, __ID, true);

                __NEWPLAYER.prognoseSkills();

                __NEWPLAYER.id = __ID;
                __NEWPLAYER.name = __NAME;
                __NEWPLAYER.age = __ALTER;
                __NEWPLAYER.pos = __POS;
                __NEWPLAYER.isGoalie = __ISGOALIE;
                __NEWPLAYER.opti = __OPTI;
                __NEWPLAYER.verl = __VERL;
                __NEWPLAYER.pSkill = __PSKILL;
                __NEWPLAYER.tSkill = __TSKILL;
                __NEWPLAYER.tNr = __TNR;
                __NEWPLAYER.skillID = __SKILLID;
                __NEWPLAYER.isPrio = __PRACTICEPS;
                __NEWPLAYER.einsatz = __EINSATZ;
                __NEWPLAYER.prozent = __PROZENT;
                __NEWPLAYER.erwartung = __ERWARTUNG;

                __NEWPLAYER.erfolg = __ERFOLG;
                __NEWPLAYER.blessur = __BLESSUR;

                const __RET = __COLMAN.addValues(__NEWPLAYER, __ROWS[i], __TITLECOLOR);

                sumErwartung += __RET[0];
                sumAufwertung += __RET[1];

                __PLAYERS[j++] = __NEWPLAYER;
            }
        }

        __LOG[0]("Erwartung vs. Aufwertungen", sumErwartung.toFixed(2), sumAufwertung.toFixed(2));

        //optSet.setOpt('trainer', __TRAINER, false);
        //optSet.setOpt('tAnzahlen', __TANZAHL, false);
        //optSet.setOpt('ids', __IDS, false);
        //optSet.setOpt('names', __NAMES, false);
        //optSet.setOpt('ages', __AGES, false);
        //optSet.setOpt('positions', __POSITIONS, false);
        //optSet.setOpt('opti27', __OPTI27, false);
        //optSet.setOpt('verletzt', __VERLETZT, false);
        //optSet.setOpt('skills', __SKILLS, false);
        //optSet.setOpt('tSkills', __TSKILLS, false);
        //optSet.setOpt('trainiert', __TRAINIERT, false);
        //optSet.setOpt('skillPos', __SKILLPOS, false);
        //optSet.setOpt('isPrio', __ISPRIO, false);
        //optSet.setOpt('einsaetze', __EINSAETZE, false);
        //optSet.setOpt('prozente', __PROZENTE, false);
        //optSet.setOpt('erwartungen', __EW, false);
        optSet.setOpt('erfolge', __ERFOLGE, false);
        optSet.setOpt('blessuren', __BLESSUREN, false);

        return true;
    });

// ==================== Ende Page-Manager fuer zu bearbeitende Seiten ====================

// ==================== Spezialbehandlung der Startparameter ====================

// Callback-Funktion fuer die Behandlung der Optionen und Laden des Benutzermenus
// Diese Funktion erledigt nur Modifikationen und kann z.B. einfach optSet zurueckgeben!
// optSet: Platz fuer die gesetzten Optionen
// optParams: Eventuell notwendige Parameter zur Initialisierung
// 'hideMenu': Optionen werden zwar geladen und genutzt, tauchen aber nicht im Benutzermenu auf
// 'teamParams': Getrennte Daten-Option wird genutzt, hier: Team() mit 'LdNr'/'LgNr' des Erst- bzw. Zweitteams
// 'menuAnchor': Startpunkt fuer das Optionsmenu auf der Seite
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// 'formWidth': Anzahl der Elemente pro Zeile
// 'formBreak': Elementnummer des ersten Zeilenumbruchs
// return Gefuelltes Objekt mit den gesetzten Optionen
function prepareOptions(optSet, optParams) {
    UNUSED(optParams);

    return optSet;
}

function checkOptParams(optParams, manager) {
    const __CLASSIFICATION = ((!! optParams.oldData) ? new ClassificationPair(__TEAMCLASS, __LASTZATCLASS) : __TEAMCLASS);

    // Classification ist optParams-abhaengig, daher hier setzen statt im Konstruktor des PageManagers...
    manager.classification = __CLASSIFICATION;

    return !! optParams;
}

// ==================== Ende Spezialbehandlung der Startparameter ====================

// ==================== Hauptprogramm ====================

// Konfiguration der Callback-Funktionen zum Hauptprogramm...
const __MAINCONFIG = {
                        checkOptParams  : checkOptParams,
                        prepareOpt      : prepareOptions
                    };

// Selektor (Seite bzw. Parameter) fuer den richtigen PageManager...
const __LEAFS = {
                    'zugabgabe.php' : 0,    // Ansicht "Zugabgabe" (p = 0, 1, 2)
                    'haupt.php'     : -3,   // Ansicht "Haupt" (Managerbuero)
                    'trainer.php'   : -4,   // Ansicht "Trainer"
                    'training.php'  : -5,   // Ansicht "Training"
                    'zar.php'       : -6    // Ansicht "ZAT-Report"
                };
const __ITEM = 'p';

// URL-Legende:
// p=0: Zugabgabe Aufstellung
// p=1: Zugabgabe Aktionen
// p=2: Zugabgabe Einstellungen
// p=3: Managerbuero
// p=4: Trainer
// p=5: Training
// p=6: ZAT-Report
const __MAIN = new Main(__OPTCONFIG, __MAINCONFIG,
                        procAufstellung, procAktionen, procEinstellungen,
                        procHaupt, procTrainer, procTraining, procZatReport);

__MAIN.run(getPageIdFromURL, __LEAFS, __ITEM);

// ==================== Ende Hauptprogramm ====================

// *** EOF ***

/*** Ende Benutzerskript https://eselce.github.io/GitTest/misc/OS2/OS2.training.user.js ***/

/*** Automatisch generiert: Freitag, 10. Februar 2023 ***/
