// ==UserScript==
// @name         OS2.fssturnier
// @namespace    http://os.ongapo.com/
// @version      0.20+lib-inl
// @copyright    2017+
// @author       Sven Loges (SLC)
// @description  Script zum offiziellen FSS-Turnier fuer Online Soccer 2.0
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/haupt\.php(\?changetosecond=\w+(&\w+=?[+\w]+)*)?(#\w+)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/fssturnier\.php(\?(fordern|cancelforderung)=\d+(&\w+=?[+\w]+)*)?(#\w+)?$/
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

/*** Benutzerskript https://eselce.github.io/GitTest/misc/OS2/OS2.fssturnier.user.js ***/

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Konfigurations-Abschnitt fuer Optionen ====================

const __LOGLEVEL = 4;

// Moegliche Optionen (hier die Standardwerte editieren oder ueber das Benutzermenu setzen):
const __OPTCONFIG = {
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
    'rankIds' : {         // Datenspeicher fuer aktuelle Team-IDs der Teams in der Rangliste
                   'Name'      : "rankIds",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : replaceArrayFun(padStartFun(4)),
                   'Space'     : 0,
                   'Label'     : "Platz-IDs:"
               },
    'oldRankIds' : {      // Datenspeicher fuer Team-IDs der Teams in der vorherigen Rangliste
                   'Name'      : "oldRankIds",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   :
                                 [ undefined, // S19, ZAT 17
                                   1461, 728, 1526, 930, 1923, 121, 778, 1882, 1528, 1430, 726, 1915, 169, 47, 1778, 152, 275, 1226, 382, 873, 1847, 820, 1218, 1771, 13, 68, 51, 809, 779, 170, 157, 483, 833, 1802, 1662, 1352, 313, 602, 1724, 495, 160, 82, 1841, 37, 1568, 1929, 300, 1566, 419, 764, 1527, 1911, 890, 977, 1866, 963, 1157, 544, 327, 314, 41, 1843, 182, 1420, 823, 693, 696, 692, 1659, 155, 219, 608, 835, 28, 1668, 132, 386, 1168, 137, 1076, 569, 1493, 80, 1096, 1935, 71, 734, 736, 761, 510, 322, 1955, 239, 1666, 224, 836, 563, 878, 1820, 1177, 493, 824, 1758, 902, 1838, 401, 1447, 741, 261, 1832, 1958, 789, 564, 699, 1238, 1054, 49, 1796, 660, 164, 218, 1774, 1596, 1264, 954, 811, 67, 1022, 1942, 1295, 1905, 38, 1657, 1971 ],
                             /*
                                 [ undefined, // S19, ZAT 16
                                   1461, 728, 1526, 1430, 1923, 121, 778, 1915, 1528, 930, 726, 1882, 169, 47, 1778, 152, 275, 13, 1847, 809, 382, 820, 1218, 1771, 1226, 68, 51, 873, 779, 1802, 82, 483, 833, 170, 1662, 1352, 313, 160, 1724, 495, 602, 157, 1841, 37, 1568, 1929, 300, 1566, 419, 764, 1527, 1911, 890, 977, 1866, 963, 1157, 544, 327, 314, 41, 1843, 182, 1420, 823, 693, 696, 692, 1659, 155, 219, 608, 835, 28, 1668, 132, 386, 1168, 137, 1076, 569, 1493, 80, 1096, 1935, 71, 734, 736, 761, 510, 322, 1958, 239, 1666, 224, 836, 563, 878, 1820, 1177, 493, 824, 1758, 902, 1838, 401, 1447, 741, 261, 1832, 1955, 789, 564, 699, 1238, 1054, 49, 1796, 660, 164, 218, 1774, 1596, 1264, 954, 811, 67, 1022, 1942, 1295, 1905, 38, 1657 ],
                                 [ undefined, // S19, ZAT 13 - 15
                                   1461, 728, 1526, 1430, 1923, 121, 778, 1915, 1528, 930, 726, 1882, 169, 47, 1778, 152, 275, 13, 1847, 809, 382, 820, 1218, 1771, 1226, 68, 51, 873, 779, 1802, 82, 483, 833, 170, 1662, 1352, 313, 160, 1724, 1527, 602, 157, 1841, 37, 1568, 1929, 300, 1566, 419, 764, 495, 1911, 890, 977, 1866, 963, 1157, 1659, 327, 314, 41, 1843, 182, 1420, 823, 693, 696, 692, 544, 155, 219, 608, 835, 28, 1668, 132, 386, 1168, 137, 1076, 569, 1935, 80, 1096, 1493, 71, 734, 736, 761, 510, 322, 1958, 401, 1666, 224, 836, 563, 878, 1820, 1177, 493, 824, 1758, 902, 1838, 239, 1447, 741, 261, 1832, 1955, 789, 564, 699, 1238, 1054, 49, 1796, 660, 164, 218, 1774, 1596, 1264, 954, 811, 67, 1022, 1942, 1295, 1905, 38, 1657 ],
                                 [ undefined, // S19, ZAT 12
                                   1461, 728, 1526, 1430, 1923, 121, 778, 1915, 47, 930, 726, 1882, 169, 1528, 1847, 152, 275, 13, 1778, 809, 382, 820, 1218, 1771, 1226, 68, 51, 873, 779, 1802, 82, 483, 833, 170, 1662, 1352, 313, 160, 1724, 1527, 602, 157, 1841, 37, 1568, 1929, 300, 1566, 419, 764, 495, 1911, 890, 977, 1866, 963, 1157, 1659, 327, 314, 41, 1843, 182, 1420, 823, 693, 696, 692, 544, 155, 219, 608, 835, 28, 1668, 132, 386, 1168, 137, 1076, 569, 1935, 80, 1096, 1493, 71, 734, 736, 761, 510, 322, 1958, 401, 1666, 224, 836, 563, 878, 1820, 1177, 493, 824, 1758, 902, 1838, 239, 1447, 741, 261, 1832, 1955, 789, 564, 1905, 1238, 1054, 49, 1796, 660, 164, 218, 1774, 1596, 1264, 954, 811, 67, 1022, 1942, 1295, 699, 38, 1657 ],
                                 [ undefined, // S19, ZAT 11
                                   1461, 728, 1526, 1430, 1923, 121, 778, 1882, 47, 930, 726, 1915, 169, 1528, 1847, 152, 275, 13, 1778, 873, 382, 779, 1218, 1771, 1226, 68, 51, 809, 820, 1802, 82, 483, 833, 170, 1662, 1352, 313, 160, 1724, 1527, 1929, 157, 37, 1841, 1568, 602, 300, 1566, 419, 764, 495, 1911, 890, 977, 1866, 963, 1157, 1659, 327, 314, 41, 1843, 182, 1420, 823, 693, 696, 692, 137, 155, 219, 1076, 835, 28, 1668, 132, 386, 1168, 544, 608, 569, 1935, 80, 1096, 563, 71, 734, 736, 761, 510, 322, 1447, 401, 1666, 224, 836, 1493, 878, 1820, 1177, 493, 824, 1758, 902, 1838, 239, 1958, 741, 261, 1832, 1955, 789, 564, 1905, 1238, 1054, 49, 1796, 660, 164, 218, 1774, 1596, 1264, 954, 811, 67, 1022, 1942, 1295, 699, 38, 1657 ],
                                 [ undefined, // S19, ZAT 10
                                   728, 1461, 1526, 1430, 1923, 121, 778, 1882, 47, 930, 1915, 726, 13, 1528, 1847, 275, 152, 169, 1778, 873, 382, 779, 1802, 1771, 833, 68, 51, 809, 820, 1218, 82, 483, 1226, 170, 1662, 1352, 313, 160, 495, 1527, 1929, 157, 37, 1841, 1568, 602, 300, 1566, 419, 764, 1724, 1911, 890, 977, 1866, 963, 1157, 1659, 327, 314, 41, 1843, 182, 1420, 823, 693, 696, 692, 137, 155, 219, 1076, 835, 28, 1668, 132, 386, 1168, 544, 608, 569, 1935, 80, 1096, 563, 71, 734, 736, 761, 510, 322, 1447, 401, 1666, 224, 836, 1838, 878, 1820, 1177, 493, 824, 1758, 902, 1493, 239, 1958, 741, 261, 1832, 1657, 789, 564, 1022, 1238, 1054, 49, 1796, 660, 164, 218, 1774, 1596, 1264, 954, 811, 67, 1905, 1942, 1295, 699, 38, 1955 ],
                                 [ undefined, // S19, ZAT 7 - 9
                                   728, 1461, 1526, 1430, 1923, 121, 778, 1882, 47, 930, 1915, 726, 13, 1528, 873, 275, 152, 169,/#980,#/1778, 1847, 382, 779, 1802, 1771, 833, 68, 51, 809, 820, 1218, 82, 483, 1226, 170, 1662, 1352, 602, 160, 495, 1527, 1929, 157, 37, 1841, 1568, 313, 300, 1566, 419, 764, 1724, 1911, 890, 977, 1866, 963, 1157, 1659, 327, 314, 41, 1843, 182, 1420, 28, 693, 696, 692, 137, 155, 219, 1076, 835, 823, 1668, 132, 386, 1168, 322, 1447, 569, 1935, 80, 1096, 563, 71, 734, 736, 761, 510, 544, 608, 401, 1666, 224, 836, 1838, 878, 1820, 1177, 493, 824, 1758, 902, 1493, 67, 38, 741, 261, 1832, 1657, 789, 564, 1022, 1238, 1054, 49, 1796, 660, 164, 218, 1774, 1596, 1264, 954, 811, 239, 1905, 1942, 1295, 699, 1958 ],
                                 [ undefined, // S19, ZAT 6
                                   728, 1430, 1526, 1461, 1923, 121, 778, 1882, 47, 930, 1915, 726, 13, 1528, 873, 1847, 152, 169, 980, 1778, 275, 779, 382, 483, 1771, 833, 68, 82, 809, 160, 1218, 51, 1802, 1226, 170, 1662, 1352, 602, 820, 495, 1527, 1929, 157, 37, 1841, 1568, 313, 1866, 1566, 419, 764, 1724, 1911, 890, 977, 300, 963, 1157, 1659, 327, 314, 41, 1843, 182, 1420, 28, 693, 696, 692, 137, 155, 219, 1076, 835, 1168, 1668, 132, 386, 823, 322, 1447, 569, 1935, 80, 1096, 563, 71, 734, 736, 761, 510, 544, 608, 401, 1666, 224, 836, 1838, 878, 1820, 1177, 493, 824, 1758, 902, 1493, 67, 38, 741, 261, 1832, 1657, 789, 564, 1022, 1238, 1054, 49, 1796, 660, 164, 218, 1774, 1596, 1264, 954, 811, 239, 1905, 1942, 1295, 699, 1958 ],
                                 [ undefined, // S19, ZAT 5
                                   728, 1430, 1526, 1461, 1923, 1882, 930, 121, 47, 778, 1915, 726, 169, 873, 1528, 1847, 152, 13, 980, 1778, 275, 779, 382, 483, 1771, 833, 68, 82, 809, 160, 1218, 51, 1802, 1226, 170, 602, 1352, 1662, 820, 1929, 1527, 495, 157, 37, 419, 1568, 313, 1866, 1566, 1841, 764, 1724, 1911, 977, 890, 300, 963, 1157, 1659, 327, 314, 41, 1843, 182, 1420, 28, 693, 696, 692, 137, 155, 219, 1076, 835, 1168, 1668, 132, 386, 823, 322, 1447, 569, 1935, 80, 1096, 563, 71, 734, 736, 761, 510, 1493, 741, 401, 1666, 224, 836, 1838, 878, 1820, 1177, 493, 824, 1758, 902, 544, 67, 38, 608, 261, 1832, 1657, 789, 564, 1238, 1022, 1054, 49, 1796, 660, 164, 218, 1774, 1596, 1264, 954, 239, 811, 1905, 1942, 1295, 699, 1958 ],
                                 [ undefined, // S19, ZAT 4
                                   728, 1430, 1526, 1461, 1923, 1882, 930, 121, 47, 778, 1915, 726, 169, 873, 1528, 1847, 152, 13, 980, 1778, 275, 779, 382, 483, 1771, 833, 68, 82, 809, 160, 1218, 51, 1802, 1226, 170, 602, 1352, 1662, 820, 1929, 1527, 495, 157, 37, 419, 1568, 313, 1866, 1566, 1841, 764, 1724, 1911, 977, 890, 300, 963, 1157, 1659, 327, 314, 41, 1843, 182, 1420, 28, 693, 696, 692, 137, 155, 219, 1076, 835, 1168, 1668, 132, 386, 823, 322, 1447, 569, 1935, 80, 1096, 563, 71, 734, 736, 761, 510, 1493, 741, 401, 1666, 224, 836, 1838, 878, 1820, 1177, 493, 824, 1758, 902, 544, 67, 38, 608, 261, 1832, 1657, 789, 564, 1238, 1054, 1022, 49, 1796, 660, 164, 218, 1774, 1596, 1264, 954, 239, 811, 1905, 1942, 1295, 699, 1958 ],
                                 [ undefined, // S19, ZAT 3
                                   728, 1430, 1882, 1461, 930, 1526, 1923, 121, 47, 778, 873, 169, 726, 1915, 1528, 1771, 980, 779, 152, 1778, 275, 13, 382, 1802, 1847, 833, 68, 82, 1662, 1352, 1218, 51, 483, 1226, 170, 602, 160, 809, 820, 1929, 1527, 495, 157, 37, 419, 1568, 313, 1866, 1566, 764, 1841, 1724, 1911, 977, 890, 300, 963, 1157, 1659, 327, 314, 41, 1843, 182, 1420, 28, 693, 696, 692, 137, 155, 219, 1076, 835, 1168, 1668, 132, 386, 823, 322, 1447, 569, 1935, 80, 1096, 563, 71, 734, 736, 761, 510, 1493, 741, 401, 1666, 224, 836, 1838, 878, 1820, 1177, 493, 824, 1758, 902, 544, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 1022, 49, 1796, 660, 164, 218, 1774, 1596, 1264, 954, 239, 811, 1905, 1942, 608, 699 ],
                                 [ undefined, // S19, ZAT 2
                                   1882, 1430, 728, 1461, 121, 1526, 1923, 930, 47, 778, 873, 980, 726, 1915, 1528, 1771, 169, 779, 152, 1847, 275, 13, 382, 1802, 1778, 483, 68, 82, 170, 1352, 1218, 37, 833, 1226, 1662, 602, 160, 809, 820, 1929, 1527, 495, 1566, 51, 419, 1568, 1659, 1866, 157, 764, 1841, 1724, 1911, 977, 890, 693, 963, 1157, 313, 327, 314, 41, 1843, 182, 1420, 28, 300, 696, 692, 137, 155, 219, 1076, 835, 1168, 1668, 132, 386, 71, 322, 1447, 569, 1935, 80, 1096, 563, 823, 734, 736, 761, 510, 1493, 741, 401, 1666, 224, 836, 1838, 878, 1820, 1177, 493, 824, 1758, 902, 544, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 1022, 49, 1796, 660, 164, 218, 1774, 1596, 1264, 954, 239, 811, 1905, 1942, 213, 608 ],
                                 [ undefined, // S19, ZAT 1
                                   1882, 1430, 728, 1461, 121, 1526, 1923, 930, 47, 778, 873, 980, 726, 1915, 1528, 1771, 169, 779, 152, 1847, 275, 13, 382, 1802, 1778, 483, 68, 82, 170, 809, 1218, 37, 833, 1929, 1662, 602, 160, 1352, 820, 1226, 1527, 495, 1566, 51, 419, 1568, 1659, 1866, 157, 764, 1841, 1724, 1911, 977, 963, 693, 890, 1157, 313, 327, 314, 41, 1843, 182, 1420, 28, 300, 696, 692, 137, 155, 219, 1076, 835, 1168, 1668, 132, 386, 71, 322, 1447, 569, 1935, 80, 1096, 563, 823, 734, 736, 761, 510, 1493, 741, 401, 1666, 224, 836, 1838, 878, 1820, 1177, 493, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1022, 1796, 660, 164, 218, 1774, 1596, 544, 954, 239, 1905, 811, 213, 1942 ],
                                 [ undefined, // S19, ZAT 0
                                   1882, 1430, 728, 1461, 121,/#1554,#/1526, 1923, 930,/#1755,#/47, 778, 873, 980, 726, 1915,/#1926,#/1528, 1771,/#1756,#/169, 779,/#1848,#/152, 1847, 275, 13, 382,/#39,#/1802,/#1933,#/1778, 483, 68, 82, 170, 809, 1218, 37,/#616,#/833, 1929, 1662, 602, 160, 1352, 820, 1226, 1527,/#1891,#/495, 1566, 51, 419, 1568, 1659, 1866, 157, 764, 1841, 1724,/#1606,#/1911, 977, 963,/#383,#/693,/#1858,#/890, 1157, 313,/#1197,#/327, 314, 41, 1843, 182, 1420, 28, 300,/#1794, 667,#/696, 692, 137, 155,/#1825,#/219, 1076, 835,/#1190,#/1168,/#1821,#/1668, 132, 386, 71,/#1222,#/322, 1447, 569, 1935, 80, 1096, 563,/#689,#/823, 734, 736,/#346, 1797,#/761, 510, 1493, 741,/#763,#/401, 1666, 224, 836, 1838,/#859,#/878, 1820, 1177, 493,/#345,#/824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1022, 1796, 660, 164, 218,/#138,#/1774, 1596,/#330,#/544 ],
                                 [ undefined, // S18, ZAT 71 - 72
                                   1882, 1430, 728, 1461, 121, 1554, 1526, 1923, 930, 1755, 47, 778, 873, 980, 726, 1915, 1926, 1528, 1771, 1756, 169, 779, 1848, 152, 1847, 275, 13, 382, 39, 1802, 1933, 1778, 483, 68, 82, 170, 809, 1218, 37, 616, 833, 1929, 1662, 602, 160, 1352, 820, 1226, 1527, 1891, 495, 1566, 51, 419, 1568, 1659, 1866, 157, 764, 1841, 1724, 1606, 1911, 977, 963, 383, 693, 1858, 890, 1157, 313, 1197, 327, 314, 41, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 219, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 1666, 224, 836, 1838, 859, 878, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1022, 1796, 660, 164, 218, 138, 1774, 1596, 330, 544 ],
                                 [ undefined, // S18, ZAT 70
                                   1882, 1430, 728, 1461, 121, 1554, 47, 1923, 930, 1755, 1526, 778, 873, 1771, 726, 1915, 1926, 1528, 980, 1756, 169, 779, 1848, 152, 1847, 1802, 13, 382, 39, 275, 1933, 1778, 483, 68, 82, 833, 809, 1891, 37, 616, 170, 1929, 1662, 602, 160, 1352, 820, 1226, 1527, 1218, 495, 1566, 51, 419, 1568, 1659, 1866, 157, 890, 1724, 1841, 1606, 1911, 977, 963, 383, 219, 1858, 764, 1157, 313, 1197, 327, 314, 41, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 693, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 1666, 224, 836, 1838, 859, 878, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1022, 1796, 660, 164, 218, 138, 1774, 1596, 330 ],
                                 [ undefined, // S18, ZAT 67 - 69
                                   1882, 1430, 728, 1461, 121, 1554, 47, 1923, 930, 1755, 1526, 778, 873, 1771, 1926, 382, 726, 1848, 980, 1756, 169, 39, 1528, 152, 82, 1802, 13, 1915, 779, 275, 1778, 1933, 68, 483, 1847, 833, 1226, 1891, 37, 616, 170, 820, 1662, 495, 51, 1352, 1929, 809, 1527, 1218, 602, 1566, 160, 419, 1568, 1659, 1866, 157, 890, 1724, 1841, 1606, 1911, 977, 963, 383, 219, 1858, 764, 1157, 313, 1197, 327, 314, 41, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 693, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 1666, 224, 836, 1838, 859, 878, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 1022, 660, 164, 218, 138, 1774, 1596, 330 ],
                                 [ undefined, // S18, ZAT 66
                                   728, 1430, 1882, 1461, 121, 1554, 47, 1923, 930, 1755, 1526, 778, 873, 1771, 1926, 382, 726, 1848, 980, 1756, 169, 39, 1528, 82, 152, 483, 13, 1915, 779, 275, 1778, 1933, 68, 1802, 1847, 833, 1226, 1891, 37, 616, 170, 820, 1662, 495, 51, 1352, 1929, 809, 1527, 1218, 1566, 602, 160, 419, 1568, 1659, 1866, 157, 1724, 890, 1606, 1841, 1911, 977, 963, 383, 219, 1858, 764, 1157, 313, 1197, 327, 314, 41, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 693, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 1666, 224, 836, 1838, 859, 878, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 1022, 660, 164, 218, 138, 1774, 1596, 330 ],
                                 [ undefined, // S18, ZAT 61 - 65
                                   728, 1430, 1882, 1461, 121, 1554, 47, 1923, 930, 1755, 1526, 778, 873, 169, 1926, 382, 726, 1848, 980, 1756, 1771, 39, 1528, 82, 152, 483, 13, 1915, 779, 275, 1778, 1933, 68, 1802, 51, 833, 1226, 1891, 37, 1662, 170, 820, 616, 495, 1847, 1352, 1929, 809, 1527, 1218, 1566, 602, 160, 419, 1568, 1659, 1866, 157, 1724, 890, 1606, 1841, 1911, 977, 963, 383, 219, 1858, 764, 1157, 313, 1197, 327, 314, 41, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 693, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 1666, 224, 836, 1838, 859, 878, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 1022, 660, 164, 218, 138, 1774, 1596, 330 ],
                                 [ undefined, // S18, ZAT 60
                                   728, 1461, 1882, 1430, 121, 1554, 47, 1923, 930, 1755, 1526, 778, 873, 169, 1756, 382, 726, 1848, 980, 1926, 1771, 39, 1528, 82, 152, 483, 13, 1915, 779, 275, 1891, 1933, 68, 1802, 51, 1847, 1226, 1778, 809, 1662, 170, 820, 1929, 495, 833, 1352, 616, 37, 1527, 1218, 1566, 602, 160, 419, 1568, 1659, 1866, 157, 1724, 890, 1606, 1841, 1911, 977, 963, 383, 219, 1858, 764, 1157, 313, 1197, 327, 314, 41, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 693, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 1666, 224, 836, 1838, 859, 878, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 1022, 660, 164, 218, 138, 1774, 1596, 330 ],
                                 [ undefined, // S18, ZAT 59
                                   728, 1461, 1882, 1430, 121, 1554, 47, 1923, 930, 1755, 1526, 778, 873, 169, 1756, 382, 726, 1848, 980, 1926, 1771, 39, 1528, 68, 152, 483, 13, 1915, 779, 275, 1891, 1662, 82, 1802, 51, 1847, 1226, 1778, 809, 1933, 170, 820, 1929, 419, 833, 1352, 616, 37, 1527, 1218, 1566, 602, 160, 495, 1568, 1659, 1866, 157, 1724, 890, 1606, 1841, 1911, 977, 963, 383, 219, 1858, 764, 1157, 313, 1197, 327, 314, 41, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 693, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 1666, 224, 836, 1838, 859, 878, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 1022, 660, 164, 218, 138, 1774, 1596, 330 ],
                                 [ undefined, // S18, ZAT 58
                                   728, 1461, 1430, 1882, 1923, 1554, 47, 121, 1756, 778, 1526, 1755, 873, 169, 930, 382, 726, 1848, 39, 1926, 1771, 980, 1528, 68, 152, 483, 82, 1915, 779, 275, 1891, 1662, 13, 1802, 51, 1847, 1226, 1778, 809, 1933, 495, 820, 1929, 419, 833, 1352, 616, 37, 1527, 1218, 1566, 602, 160, 170, 1568, 1659, 1866, 157, 1724, 1606, 890, 1911, 1841, 977, 963, 383, 219, 1858, 764, 1157, 313, 1197, 327, 314, 41, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 693, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 878, 224, 836, 1838, 859, 1666, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 1022, 660, 164, 218, 138, 1774, 1596, 330 ],
                                 [ undefined, // S18, ZAT 55 - 57
                                   728, 1461, 1430, 1882, 1923, 1554, 47, 121, 1756, 778, 1526, 1755, 873, 169, 930, 382, 68, 1848, 39, 1926, 1771, 980, 1528, 726, 152, 483, 82, 1915, 779, 275, 1662, 1891, 13, 51, 1802, 809, 1226, 1778, 1847, 1933, 495, 820, 419, 1929, 833, 1659, 1218, 37, 1527, 616, 1566, 602, 160, 170, 1568, 1352, 1866, 157, 1724, 1606, 890, 1911, 1841, 977, 963, 383, 219, 1858, 764, 1157, 313, 1197, 327, 314, 41, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 693, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 878, 224, 836, 1838, 859, 1666, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 1022, 164, 218, 138, 1774, 1596, 330 ],
                                 [ undefined, // S18, ZAT 54
                                   728, 1461, 1430, 1882, 1923, 1554, 47, 121, 1756, 778, 1526, 1755, 873, 169, 930, 382, 68, 1848, 39, 483, 980, 1771, 1528, 726, 152, 1926, 82, 1915, 1226, 275, 1662, 1891, 13, 51, 1802, 809, 779, 1778, 1847, 1933, 495, 820, 419, 1929, 1566, 1659, 1218, 37, 1527, 1866, 833, 602, 160, 1352, 1568, 170, 616, 157, 1724, 1606, 1911, 890, 963, 977, 1841, 383, 219, 1858, 764, 1157, 313, 1197, 327, 314, 41, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 693, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 878, 224, 836, 1838, 859, 1666, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 1022, 164, 218, 138, 1774, 1596, 330 /#,544#/ ],
                                 [ undefined, // S18, ZAT 53
                                   728, 1461, 1430, 1882, 1923, 1554, 47, 121, 1756, 778, 68, 1755, 873, 169, 930, 382, 1526, 1848, 39, 483, 980, 1771, 1528, 726, 152, 1926, 82, 1915, 1226, 275, 1662, 1891, 13, 51, 1802, 495, 779, 1778, 419, 820, 809, 1933, 1847, 1929, 1566, 1659, 1218, 37, 1527, 1866, 833, 602, 160, 1352, 1568, 170, 616, 157, 1724, 1606, 1911, 890, 963, 977, 1841, 383, 219, 1858, 764, 1157, 313, 1197, 327, 314, 41, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 693, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 878, 224, 836, 1838, 859, 1666, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 1022, 164, 218, 138, 1774, 1596, 330, 544 ],
                                 [ undefined, // S18, ZAT 52
                                   1430, 1923, 728, 47, 1461, 1554, 1882, 121, 1756, 778, 68, 1755, 1526, 169, 39, 726, 873, 1848, 930, 483, 980, 1771, 1528, 382, 1226, 1926, 82, 1915, 152, 275, 1662, 13, 1891, 51, 1802, 495, 779, 1778, 419, 820, 809, 1933, 1847, 1566, 1929, 1659, 1218, 37, 1527, 1866, 1911, 602, 160, 1352, 1568, 170, 616, 157, 1724, 1606, 833, 890, 963, 977, 1841, 383, 219, 1858, 764, 1157, 313, 1197, 327, 314, 41, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 693, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 878, 224, 836, 1838, 859, 1666, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660,/#257,#/1022, 164, 218, 138, 1774, 1596, 330 ],
                                 [ undefined, // S18, ZAT 49 - 51
                                   1430, 1923, 728, 47, 1461, 1554, 1882, 121, 68, 778, 1756, 1755, 1526, 169, 39, 726, 873, 1848, 930, 483, 980, 1771, 1528, 382, 1226, 1926, 1662, 51, 152, 275, 82, 13, 1891, 1915, 1802, 495, 779, 1778, 1527, 820, 809, 1933, 1218, 1566, 1929, 1659, 1847, 37, 419, 1866, 1911, 602, 160, 1352, 1568, 170, 616, 157, 1724, 1606, 833, 890, 963, 977, 1841, 383, 219, 1858, 764, 1157, 313, 1197, 327, 314, 41, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 693, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 878, 224, 836, 1838, 859, 1666, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 1022, 164, 218, 138, 1774, 1596, 330 ],
                                 [ undefined, // S18, ZAT 48
                                   1430, 1461, 728, 47, 1923, 1554, 1882, 121, 68, 778, 1756, 1755, 1526, 169, 39, 726, 873, 1848, 930, 483, 980, 152, 1528, 382, 275, 1915, 1662, 51, 1771, 1226, 82, 13, 1891, 1926, 1802, 495, 779, 1778, 1527, 419, 809,/#1686,#/1933, 1218, 1566, 1929, 1659, 1606, 37, 820, 1866, 1911, 602, 160, 1352, 1568, 157, 1724, 170, 616, 1847, 41, 890, 963, 977, 1841, 383, 219, 1858, 764, 1157, 313, 1197, 327, 314, 833, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 693, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 878, 224, 836, 1838, 859, 1666, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 1022, 164, 218, 138, 1774, 1596, 330 ],
                                 [ undefined, // S18, ZAT 47
                                   1430, 1461, 728, 47, 1923, 1554, 1882, 121, 68, 778, 1756, 1755, 1526, 169, 39, 726, 873, 1848, 930, 483, 980, 152, 1528, 382, 275, 1915, 1662, 51, 1771, 1226, 82, 13, 1891, 1926, 1802, 495, 779, 1778, 1527, 419, 1686, 809, 1933, 1218, 1566, 1929, 1659, 1606, 37, 820, 1866, 1911, 602, 160, 1352, 1568, 157, 1724, 170, 616, 1847, 41, 890, 963, 977, 1841, 383, 219, 1858, 764, 1157, 313, 1197, 327, 314, 833, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 693, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 878, 224, 836, 1838, 859, 1666, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1022, 138, 1774, 1596, 330 ],
                                 [ undefined, // S18, ZAT 46
                                   1430, 1461, 728, 47, 1923, 1554, 1882, 121, 68, 39, 1756, 1755, 1526, 169, 778, 726, 873, 1848, 1662, 483, 980, 152, 1528, 382, 275, 1915, 930, 495, 1771, 1226, 82, 13, 1891, 1926, 1802, 51, 779, 1778, 1527, 419, 1686, 1606, 1911, 1218, 1566, 1929, 1659, 809, 37, 820, 1866, 1933, 602, 160, 1352, 1568, 157, 41, 616, 170, 1847, 1724, 890, 963, 977, 1841, 383, 219, 1858, 764, 1157, 313, 1197, 327, 314, 693, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 833, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 878, 224, 836, 1838, 859, 1666, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1022, 138, 1774, 1596, 330 ],
                                 [ undefined, // S18, ZAT 43 - 45
                                   1430, 1461, 728, 47, 1923, 1554, 1882, 121, 68, 39, 1756, 1755, 1526, 169, 778, 726, 873, 1848, 1662, 483, 980, 152, 1528, 382, 275, 1915, 930, 495, 1771, 1226, 1218, 1686, 1891, 1926, 1802, 51, 779, 1778, 1527, 820, 13, 1606, 1911, 82, 1566, 1929, 1659, 809, 37, 419, 1866, 1933, 602, 160, 1352, 1568, 157, 41, 616, 170, 1847, 1724, 890, 963, 977, 219, 383, 1841, 1858, 764, 1157, 313, 1197, 327, 314, 693, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 833, 1076, 835, 1190, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 878, 224, 836, 1838, 859, 1666, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1022, 138, 1774, 1596, 330 ],
                                 [ undefined, // S18, ZAT 42
                                   728, 1461, 1430, 121, 1923, 39, 1882, 47, 68, 1554, 1756, 1848, 1526, 483, 778, 726, 1528, 1755, 1915, 169, 980, 152, 873, 382, 275, 1662, 930, 495, 1771, 1226, 1218, 1686, 1891, 1926, 1802, 51, 37, 1659, 1527, 820, 13, 1606, 1911, 82, 1566, 419, 1778, 809, 779, 1929, 1866, 1933, 602, 160, 1352, 1568, 157, 41, 890, 170, 1847, 1724, 616, 963, 977, 219, 383, 1841, 1858, 764, 1157, 313, 1197, 327, 314, 693, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 833, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 878, 224, 836, 1838, 859, 1666, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1022, 138, 1774, 1596, 330 ],
                                 [ undefined, // S18, ZAT 41
                                   728, 1461, 1430, 121, 1923, 39, 1882, 47, 68, 1554, 1756, 1848, 1526, 483, 778, 726, 1528, 1755, 1915, 169, 980, 152, 873, 382, 275, 1662, 930, 495, 1771, 1226, 1218, 1686, 1891, 1926, 1802, 51, 37, 1659, 809, 820, 13, 1606, 1911, 82, 1566, 419, 1778, 1527, 779, 1929, 1866, 1933, 1352, 160, 602, 1568, 157, 41, 890, 170, 1847, 1724, 616, 963, 977, 219, 383, 1841, 1858, 764, 1157, 313, 1197, 327, 314, 693, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 833, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 878, 224, 836, 1838, 859, 1666, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1022, 138, 1774, 1596, 330 ],
                                 [ undefined, // S18, ZAT 40
                                   728, 1461, 1430, 121, 1923, 47, 1848, 39, 68, 1554, 726, 1882, 1526, 483, 778, 1756, 1528, 1755, 1915, 169, 980, 152, 873, 382, 1686, 1662, 930, 495, 1771, 1226, 1218, 275, 1891, 809, 51, 1802, 1778, 1659, 1926, 820, 13, 1606, 1911, 82, 1566, 419, 37, 1527, 779, 1929, 1866, 1933, 1352, 160, 602, 1568, 157, 41, 890, 963, 1847, 1724, 616, 170, 977, 219, 383, 1841, 1858, 764, 1157, 313, 1197, 327, 314, 693, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 833, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 763, 401, 878, 224, 836, 1838, 859, 330, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1774, 1022, 1666 ],
                                 [ undefined, // S18, ZAT 37 - 39
                                   728, 1461, 1430, 121, 1923, 47, 1848, 39, 68, 1554, 726, 1882, 1526, 483, 778, 1756, 169, 1755, 930, 1528, 980, 152, 1218, 382, 1686, 1662, 1915, 495, 1771, 1226, 873, 275, 1891, 809, 51, 1802, 1778, 1659, 1926, 820, 13, 1606, 1911, 82, 1566, 1352, 37, 1929, 779, 1527, 1866, 1933, 419, 160, 602, 1568, 157, 41, 890, 963, 1157, 1724, 616, 170, 977, 219, 383, 1841, 1858, 764, 1847, 313, 1197, 327, 314, 693, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 763, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 833, 401, 878, 224, 836, 1838, 859, 330, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1774, 1022, 1666 ],
                                 [ undefined, // S18, ZAT 36
                                   1461, 728, 1430, 121, 1923, 47, 1848, 39, 68, 1554, 726, 1882, 1526, 483, 778, 1756, 169, 1755, 930, 1528, 980, 152, 1218, 382, 1686, 1662, 1915, 495, 1771, 1226, 873, 275, 1891, 809, 51, 1802, 1778, 1659, 419, 820, 13, 1606, 1911, 82, 1566, 1352, 37, 160, 779, 1527, 1866, 1933, 1926, 1929, 602, 1568, 157, 41, 890, 963, 1157, 1724, 693, 170, 977, 219, 383, 1841, 1858, 764, 1847, 313, 1197, 327, 314, 616, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 763, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 833, 224, 836, 1838, 859, 330, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1774, 1022, 1666 ],
                                 [ undefined, // S18, ZAT 35
                                   1461, 728, 1430, 121, 1923, 47, 1848, 39, 68, 1554, 726, 1882, 1526, 1755, 930, 1756, 1218, 483, 778, 1528, 980, 152, 169, 382, 1686, 1662, 1915, 495, 1771, 1226, 873, 82, 1891, 809, 51, 1802, 1778, 1659, 419, 820, 13, 1866, 1911, 275, 1566, 1352, 37, 160, 779, 977, 1606, 170, 1926, 1929, 1157, 1568, 157, 41, 890, 963, 602, 1724, 693, 1933, 1527, 219, 383, 1841, 1858, 764, 1847, 313, 1197, 327, 314, 616, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 763, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 833, 224, 836, 1838, 859, 330, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1774, 1022, 1666 ],
                                 [ undefined, // S18, ZAT 34
                                   1461, 728, 121, 1430, 1923, 47, 1848, 39, 726, 1554, 68, 1882, 1526, 1755, 930, 1756, 1218, 483, 778, 980, 1528, 152, 169, 382, 1686, 1662, 1915, 495, 1771, 1226, 873, 82, 1891, 809, 1911, 1802, 1778, 1659, 419, 1606, 13, 1866, 51, 275, 1566, 1352, 41, 160, 779, 977, 820, 170, 1926, 1929, 1157, 1568, 157, 37, 890, 963, 602, 1724, 693, 1933, 1527, 219, 383, 1841, 1858, 764, 1847, 313, 1197, 327, 314, 616, 1843, 182, 1420, 28, 300, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 763, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 833, 224, 836, 1838, 859, 330, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1774, 1022, 1666 ],
                                 [ undefined, // S18, ZAT 33
                                   1461, 728, 121, 1430, 1923, 47, 1755, 39, 726, 1554, 68, 1882, 930, 1848, 1526, 1756, 1218, 495, 778, 980, 1528, 152, 169, 382, 1686, 1662, 809, 483, 1771, 1226, 873, 1866, 1891, 1915, 1911, 1802, 1778, 1659, 419, 1606, 1926, 82, 51, 275, 1566, 1352, 41, 160, 779, 977, 820, 170, 13, 1929, 1157, 1568, 157, 37, 890, 963, 602, 1724, 693, 1527, 1933, 219, 383, 1841, 1858, 764, 300, 313, 1197, 327, 314, 1843, 616, 182, 1420, 28, 1847, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 763, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 833, 224, 836, 1838, 859, 330, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1774, 1022, 1666 ],
                                 [ undefined, // S18, ZAT 32
                                   1461, 1430, 121, 728, 1923, 47, 1526, 39, 726, 68, 1554, 1882, 1218, 1848, 1755, 1756, 930, 495, 778, 980, 1528, 1915, 169, 382, 1686, 1662, 809, 483, 1771, 1226, 873, 1866, 1891, 152, 1911, 82, 1778, 1659, 419, 1606, 1926, 1802, 51, 1566, 275, 1352, 41, 160, 779, 977, 820, 170, 13, 1929, 1157, 1568, 157, 1841, 890, 963, 602, 1724, 693, 1527, 1933, 219, 383, 37, 1858, 764, 300, 313, 1197, 327, 314, 1843, 616, 182, 1420, 28, 1847, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 763, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 833, 224, 836, 1838, 859, 330, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1774, 1022, 1666 ],
                                 [ undefined, // S18, ZAT 31
                                   1461, 1430, 47, 728, 1923, 121, 1526, 39, 1848, 68, 1554, 1882, 1218, 726, 1755, 1756, 930, 169, 1662, 809, 1528, 1915, 495, 382, 1686, 778, 980, 483, 1771, 1226, 419, 1866, 1891, 152, 1911, 82, 1778, 170, 873, 1606, 779, 1802, 51, 1566, 275, 1352, 41, 160, 1926, 977, 820, 1659, 13, 1929, 1157, 1568, 157, 1841, 313, 963, 602, 1724, 693, 1527, 1933, 219, 383, 37, 1858, 764, 300, 890, 1197, 327, 314, 1843, 616, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 1847, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 833, 224, 836, 1838, 859, 330, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1774, 1022, 1666 ],
                                 [ undefined, // S18, ZAT 30
                                   1461, 1923, 47, 121, 1430, 728, 1526, 39, 1848, 68, 1554, 1882, 1218, 726, 1755, 1756, 930, 169, 1662, 809, 1528, 1915, 495, 382, 1686, 1866, 980, 483, 1771, 1226, 419, 778, 1891, 152, 1911, 82, 1778, 170, 873, 1606, 779, 1802, 51, 1566, 275, 1352, 41, 160, 1926, 977, 820, 1659, 13, 1929, 1157, 1568, 157, 1841, 313, 963, 693, 1724, 602, 1527, 1933, 219, 383, 37, 1858, 764, 300, 1197, 890, 327, 314, 1843, 616, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 1847, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 563, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 836, 833, 859, 330, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1774, 1022, 1666 ],
                                 [ undefined, // S18, ZAT 29
                                   1461, 1923, 47, 121, 1430, 728, 1526, 39, 1848, 1218, 1554, 930, 68, 726, 1755, 1756, 1882, 483, 1662, 809, 1528, 1915, 495, 382, 1686, 1866, 980, 169, 1771, 1226, 873, 778, 1891, 152, 1911, 779, 1778, 170, 419, 1606, 82, 1802, 51, 1566, 275, 1352, 41, 160, 1926, 977, 820, 1659, 13, 1929, 1157, 616, 157, 1841, 313, 963, 693, 1724, 602, 1527, 1933, 219, 383, 37, 1858, 764, 300, 1197, 890, 327, 314, 1843, 1568, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 1847, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 836, 833, 859, 330, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1774, 1022 ],
                                 [ undefined, // S18, ZAT 28
                                   1461, 1430, 47, 121, 1923, 728, 1526, 68, 1848, 1218, 809, 930, 39, 726, 1755, 1756, 1882, 483, 169, 1554, 980, 1915, 495, 382, 1686, 1866, 1528, 1662, 1771, 1226, 873, 778, 1891, 152, 1911, 779, 160, 419, 170, 1606, 82, 1802, 51, 1566, 275, 1352, 41, 1778, 1926, 977, 820, 1659, 1933, 1929, 1157, 616, 157, 602, 313, 963, 693, 1724, 1841, 1527, 13, 219, 383, 37, 1858, 764, 300, 1197, 890, 327, 314, 1843, 1568, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 1847, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 836, 1022, 859, 330, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1774, 833 ],
                                 [ undefined, // S18, ZAT 27
                                   1461, 1430, 47, 121, 1923, 728, 1218, 68, 930, 1526, 809, 1848, 39, 1755, 726, 1756, 1882, 483, 169, 1554, 980, 1686, 873, 382, 1915, 1866, 1528, 1662, 1771, 1226, 495, 779, 1891, 152, 1911, 778, 160, 419, 170, 1157, 82, 1802, 51, 1566, 275, 1352, 41, 1778, 1926, 977, 820, 1659, 1933, 1929, 1606, 616, 157, 602, 313, 963, 693, 300, 1841, 1527, 13, 219, 383, 37, 1858, 764, 1724, 1197, 890, 327, 314, 1843, 1568, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 1847, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 836, 1022, 859, 330, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1774, 833 ],
                                 [ undefined, // S18, ZAT 25 - 26
                                   1461, 1430, 47, 121, 1923, 728, 1218, 68, 930, 1526, 809, 1848, 39, 1755, 726, 1756, 1882, 483, 169, 1554, 980, 1686, 873, 382, 1915, 1866, 1528, 1662, 1771, 1226, 495, 779, 1891, 152, 1911, 778, 160, 419, 170, 1157, 82, 1802, 51, 1566, 275, 1352, 41, 1778, 1926, 977, 820, 1659, 1933, 1929, 1606, 616, 157, 602, 313, 963, 693, 300, 1841, 1527, 13, 219, 383, 37, 1858, 764, 1724, 1197, 890, 327, 314, 1843, 1568, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 1847, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 836, 1022, 859, 330, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1774 ],
                                 [ undefined, // S18, ZAT 24
                                   1461, 1430, 47, 121, 1923, 1526, 1218, 68, 930, 728, 809, 1848, 39, 1755, 726, 1756, 1882, 483, 169, 1554, 980, 1686, 873, 382, 1915, 1866, 1528, 1662, 1771, 1226, 495, 779, 1891, 152, 1911, 778, 160, 419, 170, 1157, 82, 1802, 51, 1566, 275, 1352, 41, 1778, 1926, 977, 300, 1659, 1933, 693, 1606, 616, 157, 602, 313, 963, 1929, 820, 1841, 1527, 13, 219, 383, 37, 1858, 764, 1724, 1197, 890, 327, 314, 1843, 1568, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 1847, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 836, 1022, 859, 330, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138,/#1910,#/1774 ],
                                 [ undefined, // S18, ZAT 23
                                   1461, 1430, 47, 930, 1923, 1526, 1755, 68, 121, 728, 809, 1848, 39, 1218, 726, 1756, 1882, 873, 169, 1554, 980, 1686, 483, 779, 1226, 1866, 1771, 1662, 1528, 1915, 1157, 382, 1891, 152, 1911, 51, 160, 1778, 170, 495, 82, 1802, 778, 1566, 275, 1352, 41, 419, 1926, 977, 300, 1659, 1933, 693, 313, 616, 157, 602, 1606, 963, 1929, 820, 1527, 1841, 13, 219, 383, 37, 1858, 764, 1724, 1197, 890, 327, 314, 1843, 1568, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 1847, 859, 1022, 330, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1910, 1774 ],
                                 [ undefined, // S18, ZAT 22
                                   1461, 1430, 47, 930, 1923, 68, 1755, 1526, 121, 728, 809, 1882, 39, 1218, 726, 1756, 1848, 873, 169, 1554, 1226, 1686, 483, 779, 980, 1866, 1771, 1662, 1528, 1915, 1157, 382, 82, 1911, 152, 51, 160, 1778, 495, 170, 1891, 1802, 1659, 1566, 275, 157, 41, 419, 1926, 1929, 300, 778, 1933, 693, 313, 616, 1352, 1606, 602, 963, 977, 820, 1527, 1841, 13, 219, 383, 37, 1858, 764, 1724, 1197, 890, 327, 314, 1843, 1568, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 1847, 859, 330, 1022, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1910, 1774 ],
                                 [ undefined, // S18, ZAT 21
                                   1461, 930, 47, 1430, 1755, 68, 1923, 1526, 121, 728, 873, 1882, 39, 1218, 726, 779, 1848, 809, 169, 1554, 1226, 51, 483, 1756, 980, 1866, 1771, 1662, 1528, 1778, 1157, 382, 82, 1911, 152, 1686, 160, 1915, 495, 170, 1891, 1802, 1659, 275, 1566, 157, 41, 419, 1926, 1929, 300, 778, 1933, 693, 313, 616, 1352, 1606, 602, 963, 977, 820, 1527, 1841, 13, 219, 383, 37, 1858, 764, 1724, 1197, 890, 327, 314, 1843, 1568, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 1910, 859, 330, 1022, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1847, 1774 ],
                                 [ undefined, // S18, ZAT 20
                                   1461, 930, 1755, 1430, 47, 68, 1218, 1526, 121, 728, 1882, 873, 39, 1923, 779, 726, 51, 809, 980, 1554, 1226, 1848, 483, 1756, 169, 1866, 1771, 1662, 1528, 1778, 1157, 382, 82, 1911, 152, 1686, 160, 1915, 41, 170, 1891, 1802, 1659, 275, 1566, 157, 495, 419, 1926, 1841, 300, 778, 1933, 693, 313, 616, 1352, 1606, 602, 963, 977, 820, 1527, 1929, 13, 219, 383, 37, 1858, 764, 1724, 1197, 890, 327, 314, 1843, 1568, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 1910, 859, 330, 1022, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1847, 1774 ],
                                 [ undefined, // S18, ZAT 19
                                   1461, 930, 1755, 1430, 47, 68, 1218, 1526, 121, 728, 1882, 873, 39, 1923, 779, 726, 51, 809, 980, 1554, 1226, 1848, 1157, 1756, 169, 1866, 1771, 1662, 1528, 1778, 483, 382, 82, 1911, 152, 1686, 160, 170, 41, 1915, 1891, 1802, 1659, 275, 1566, 157, 495, 1926, 419, 1841, 300, 778, 1933, 693, 313, 616, 1352, 1568, 602, 963, 977, 820, 1527, 1929, 13, 219, 383, 37, 1858, 764, 1724, 1197, 890, 327, 314, 1843, 1606, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 1910, 859, 330, 1022, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1847, 1774 ],
                                 [ undefined, // S18, ZAT 18
                                   930, 1461, 47, 1430, 1755, 68, 1923, 1526, 121, 728, 980, 873, 1554, 1218, 779, 726, 1771, 809, 1882, 39, 1226, 1848, 1157, 1756, 82, 1866, 51, 1662, 1528, 160, 483, 382, 169, 1911, 152, 1686, 1778, 419, 41, 1915, 1891, 157, 1659, 275, 1566, 1802, 495, 1926, 170, 1841, 300, 778,/#333,#/1568, 693, 313, 1606, 1352, 1933, 602, 963, 977, 820, 1527, 1929, 13, 219, 383, 37, 1858, 764, 1724, 1197, 890, 327, 314, 1843, 616, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 1910, 859, 330, 1022, 1820, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1847, 1774 ],
                                 [ undefined, // S18, ZAT 17
                                   930, 1461, 47, 1430, 1755, 68, 1923, 779, 121, 728, 980, 873, 1554, 1218, 1526, 726, 1771, 809, 1882, 39, 1226, 1848, 1157, 1756, 82, 1866, 51, 1662, 1528, 160, 483, 382, 169, 1911, 152, 1686, 1778, 419, 41, 1915, 1891, 157, 1659, 275, 1566, 1802, 333, 1926, 170, 778, 300, 1841, 495, 1568, 693, 313, 1606, 1352, 1933, 602, 963, 977, 820, 1527, 1929, 13, 219, 383, 37, 1858, 764, 1724, 1197, 890, 327, 314, 1843, 616, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 1910, 859, 330, 1820, 1022, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1847, 1774 ],
                                 [ undefined, // S18, ZAT 16
                                   930, 1461, 47, 1430, 1755, 68, 1923, 779, 121, 1526, 980, 873, 1882, 1218, 728, 726, 82, 809, 1554, 39, 1226, 1848, 1157, 1756, 1771, 1866, 152, 1662, 1528, 160, 483, 382, 275, 1911, 51, 1686, 1778, 419, 41, 1915, 157, 1891, 1659, 169, 1566, 1802, 333, 820, 170, 778, 300, 1841, 495, 1568, 693, 890, 1606, 616, 1933, 602, 963, 977, 1926, 1527, 1929, 13, 219, 383, 37, 1858, 764, 1724, 1197, 313, 327, 314, 1843, 1352, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 823, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 1910, 859, 330, 1820, 1022, 1177, 493, 345, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1847, 1774 ],
                                 [ undefined, // S18, ZAT 13 - 15
                                   930, 1461, 47, 1430, 1755, 68, 1923, 779, 121, 1526, 1226, 39, 1882, 1218, 728, 809, 82, 726, 1554, 873, 980, 1157, 1848, 1756, 1771, 1866, 152, 1662, 1528, 160, 483, 382, 275, 1911, 51, 1686, 1778, 419, 41, 1802, 157, 1891, 1659, 169, 1566, 1915, 333, 820, 170, 778, 300, 1841, 495, 1568, 693, 890, 37, 616, 963, 977, 1933, 602, 1926, 1527, 1929, 13, 219, 383, 1606, 1858, 764, 1724, 1197, 313, 327, 314, 1843, 1352, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 345, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 1910, 859, 330, 1820, 1177, 1022, 493, 823, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1847, 1774 ],
                                 [ undefined, // S18, ZAT 12
                                   930, 1461, 47, 1430, 1755, 1923, 68, 779, 121, 1526, 1226, 39, 873, 1218, 728, 809, 82, 726, 1554, 1882, 980, 1157, 1848, 483, 1771, 1866, 152, 1662, 160, 1528, 1756, 382, 41, 1911, 51, 1686, 1778, 419, 275, 157, 1802, 1891, 1659, 169, 1566, 1915, 333, 820, 170, 778, 300, 1841, 495, 1568, 693, 890, 37, 616, 963, 977, 1933, 602, 1926, 1527, 1929, 13, 219, 383, 1606, 1858, 764, 1724, 1197, 313, 327, 314, 1843, 1352, 182, 1420, 28, 763, 1794, 667, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 345, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 1910, 859, 330, 1820, 1177, 1022, 493, 823, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1847, 1774 ],
                                 [ undefined, // S18, ZAT 11
                                   930, 1461, 47, 1430, 1755, 1923, 68, 779, 121, 1526, 1226, 39, 873, 1218, 728, 1157, 82, 1848, 1554, 1882, 980, 809, 726, 483, 1771, 1866, 51, 1662, 160, 1528, 1756, 382, 41, 1911, 152, 1686, 1778, 169, 275, 157, 1802, 1891, 1659, 419, 1566, 1915, 963, 820, 778, 170, 300, 1841, 977, 1568, 693, 37, 890, 616, 333, 495, 1933, 602, 1926, 1527, 1929, 13, 219, 383, 182, 1858, 764, 667, 1197, 313, 327, 314, 1843, 1352, 1606, 1420, 28, 763, 1794, 1724, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 345, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 1910, 859, 330, 1820, 1177, 493, 1022, 823, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1847, 1774 ],
                                 [ undefined, // S18, ZAT 10
                                   47, 1461, 930, 1430, 68, 1923, 1755, 1226, 121, 1526, 779, 39, 873, 1218, 728, 1157, 82, 1848, 1554, 726, 980, 809, 1882, 160, 1771, 1866, 51, 1662, 483, 1528, 1756, 382, 41, 1911, 152, 1686, 1778, 169, 275, 157, 1802, 1891, 1659, 419, 1566, 1915, 963, 820, 778, 170, 300, 1841, 977, 1568, 693, 37, 890, 616, 333, 495, 602, 1933, 1926, 1527, 1929, 13, 219, 383, 182, 1858, 764, 667, 1197, 313, 327, 314, 1843, 1352, 1606, 1420, 28, 763, 1794, 1724, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 345, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 1910, 859, 330, 1820, 1177, 493, 1022, 823, 824, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1847, 1774 ],
                                 [ undefined, // S18, ZAT 7 - 9
                                   47, 1461, 930, 1430, 68, 1923, 1755, 1226, 121, 1526, 779, 39, 873, 1218, 1157, 728, 82, 1848, 1554, 726, 980, 809, 1882, 160, 1771, 1866, 51, 1662, 483, 1528, 1756, 382, 41, 1911, 169, 1686, 1778, 152, 275, 157, 1802, 1891, 1659, 963, 1566, 495, 419, 820, 778, 170, 300, 1841, 977, 1568, 693, 37, 890, 616, 333, 1915, 602, 1933, 1926, 1527, 1929, 13, 219, 383, 182, 1858, 764, 667, 1197, 313, 327, 314, 1843, 1352, 1606, 1420, 28, 763, 1794, 1724, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 345, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 1910, 859, 330, 1820, 1177, 493, 824, 823, 1022, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1847, 1774 ],
                                 [ undefined, // S18, ZAT 6
                                   47, 1461, 930, 1755, 68, 1923, 1430, 1226, 121, 1526, 779, 39, 82, 1218, 1157, 1866, 873, 1848, 1554, 726, 980, 483, 1882, 160, 1771, 728, 51, 1662, 809, 1528, 1756, 382, 41, 1911, 169, 1686, 495, 152, 419, 157, 1891, 1802, 1659, 963, 1566, 1778, 275, 1915, 778, 170, 300, 1841, 977, 1568, 693, 37, 890, 616, 333, 820, 602, 1933, 1926, 1527, 1929, 13, 219, 383, 182, 1858, 764, 667, 1197, 313, 327, 314, 1843, 1352, 1606, 1420, 28, 763, 1794, 1724, 696, 692, 137, 155, 1825, 1190, 1076, 835, 563, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 345, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 1910, 859, 330, 1820, 1177, 493, 824, 823, 1022, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1847, 1774 ],
                                 [ undefined, // S18, ZAT 5
                                   47, 1461, 930, 1755, 68, 1923, 1430, 1226, 121, 1157, 779, 39, 82, 1218, 1526, 1866, 873, 1848, 1554, 1882, 980, 483, 726, 169, 1771, 728, 51, 1662, 809, 1756, 1528, 382, 41, 1911, 160, 1686, 495, 170, 419, 300, 1891, 1802, 1659, 963, 1566, 1778, 275, 1915, 778, 152, 157, 977, 1841, 1568, 693, 37, 616, 890, 333, 820, 1926, 1933, 602, 1527, 1929, 13, 219, 383, 182, 1858, 764, 667, 1197, 313, 327, 314, 1843, 1352, 563, 1420, 28, 763, 1794, 1724, 696, 692, 137, 155, 1825, 1190, 1076, 835, 1606, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 345, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 1910, 859, 330, 1820, 1177, 493, 824, 823, 1022, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1847, 1774 ],
                                 [ undefined, // S18, ZAT 4
                                   47, 1461, 930, 1755, 68, 1923, 1430, 1226, 121, 1157, 1866, 39, 82, 1218, 1526, 779, 873, 1848, 1771, 1882, 980, 483, 726, 169, 1554, 728, 1686, 1662, 1802, 1756, 1528, 382, 41, 1911, 160, 51, 495, 170, 419, 300, 1891, 809, 1659, 963, 1566, 1778, 275, 1915, 778, 152, 157, 977, 1841, 1568, 693, 37, 616, 890, 333, 820, 1926, 1933, 602, 1527, 383, 13, 219, 1929, 182, 1858, 764, 667, 1197, 313, 327, 314, 1843, 1352, 563, 1420, 28, 763, 1794, 1724, 696, 692, 137, 155, 1825, 1190, 1076, 835, 1606, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 345, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1838, 224, 1910, 859, 330, 1820, 1177, 493, 824, 823, 1022, 1758, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1847, 1774 ],
                                 [ undefined, // S18, ZAT 3
                                   47, 1461, 930, 1755, 68, 1923, 1157, 1226, 39, 1430, 1866, 121, 1882, 1848, 1526, 779, 169, 1218, 1771, 82, 980, 1756, 726, 873, 1554, 728, 1686, 1662, 1802, 483, 1528, 382, 41, 1911, 160, 51, 170, 495, 778, 300, 1891, 809, 1659, 963, 1566, 1778, 275, 1926, 419, 152, 616, 977, 693, 1568, 1841, 37, 157, 890, 1352, 820, 1915, 1933, 602, 1527, 383, 13, 219, 1929, 182, 1858, 764, 667, 1197, 313, 327, 314, 1843, 333, 563, 1420, 28, 763, 1794, 1724, 696, 692, 137, 155, 1825, 1190, 1076, 835, 1838, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 345, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1606, 224, 1910, 859, 330, 1820, 1177, 493, 824, 823, 1758, 1022, 902, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 660, 257, 218, 164, 1596, 138, 1847, 1774 ],
                                 [ undefined, // S18, ZAT 2
                                   47, 1461, 930, 1226, 39, 1923, 121, 1755, 68, 1430, 1866, 1157, 1882, 1218, 1526, 779, 169, 1848, 1771, 82, 980, 1756, 726, 873, 1554, 728, 1686, 1662, 483, 1802, 382, 1528, 41, 1911, 160, 1659, 495, 170, 778, 300, 1891, 809, 51, 963, 1566, 1778, 275, 1926, 419, 152, 616, 977, 693, 1568, 1352, 37, 157, 890, 1841, 820, 1915,/#1421,#/1933, 602, 1527, 383, 333, 219, 1929, 182, 1858, 764, 667, 1197, 313, 327, 314, 1843, 13, 563, 1420, 28, 763, 1794, 1724, 696, 692, 137, 155, 1825, 1190, 1076, 835, 1838, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 345, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 1606, 224, 1910, 859, 330, 1820, 1177, 493, 824, 823, 1758, 1022, 1596, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796,/#114,#/660, 257, 218, 164, 902 ],
                                 [ undefined, // S18, ZAT 1
                                   47, 1461, 930, 1226, 39, 1923, 121, 1755, 68, 1430, 1866, 1157, 1882, 1218, 1526, 779, 169, 1848, 1771, 82, 980, 1756, 726, 873, 1554, 728, 1686, 1662, 483, 1802, 382, 1528, 41, 1911, 160, 1659, 495, 170, 300, 778, 1891, 809, 51, 963, 1566, 1778, 275, 1926, 419, 616, 152, 977, 693, 1568, 1352, 37, 157, 890, 1841, 820, 1915, 1421, 1933, 602, 1527, 383, 333, 219, 1929, 182, 1858, 764, 667, 1197, 313, 327, 314, 1843, 13, 563, 1420, 28, 763, 1794, 1724, 696, 692, 137, 155, 1825, 1190, 1076, 835, 1838, 1168, 1821, 1668, 132, 386, 71, 1222, 322, 1447, 569, 1935, 80, 1096, 836, 689, 345, 734, 736, 346, 1797, 761, 510, 1493, 741, 878, 401, 660, 224, 1910, 859, 330, 1820, 1177, 493, 824, 823, 1758, 1022, 1596, 1264, 67, 38, 1295, 261, 1832, 1657, 789, 564, 1238, 1054, 49, 1796, 114, 1606, 257, 218, 164, 902 ],
                                 [ undefined, // S18, ZAT 0
                                   47, 1461, 930, 1226, 39, 1923, 121, 1755, 68, 1430, 1866, 1157, 1882, 1218, 1526, 779, 169, 1848, 1771, 82,
                                   980, 1756, 726, 873, 1554, 728, 1686, 1662, 483, 1802, 382, 1528, 41, 1911, 160, 1659, 495, 170, 300, 778,
                                   1891, 809, 51, 963, 1566, 1778, 275, 1926, 419, 616, 152, 977, 693,/#446,#/1568, 1352, 37, 157, 890, 1841,
                                   820, 1915, 1421, 1933, 602, 1527, 383, 333, 219,/#1847,#/1929, 182, 1858,/#259,#/764, 667, 1197, 313, 327,/#1254,#/
                                   314,/#1337,#/1843,/#920, 1810,#/13,/#73,#/563,/#1572, 582,#/1420, 28,/#881,#/763,/#172, 1552,#/1794, 1724, 696, 692,
                                   /#559,#/137,/#1476,#/155, 1825, 1190, 1076, 835, 1838, 1168, 1821, 1668, 132, 386, 71,/#597,#/1222, 322, 1447, 569,
                                   1935, 80,/#981, 1652,#/1096, 836, 689,/#1818, 1822, 1152, 86,#/345,/#1030,#/734,/#545, 1548,#/736,/#198,#/346, 1797,
                                   /#1275,#/761,/#436, 25,#/510,/#708,#/1493,/#524,#/741, 878,/#762, 1261,#/401,/#242,#/660, 224, 1910, 859,/#1359,#/330,
                                   /#252,#/1820, 1177,/#14, 451, 1787, 1795, 394,#/493,/#595, 355, 254, 1209,#/824,/#55,#/823,/#1881,#/1758, 1022,/#1086,
                                   1321, 21, 1006,#/1596,/#352,#/1264,/#107, 1010, 663, 102,#/67,/#214,#/38,/#1094,#/1295, 261, 1832,/#1186,#/1657,/#398,#/
                                   789, 564, 1238, 1054, 49, 1796 ],
                                 [ undefined, // S17, ZAT 71 - 72
                                   47, 1461, 930, 1226, 39, 1923, 121, 1755, 68, 1430, 1866, 1157, 1882, 1218, 1526, 779, 169, 1848, 1771, 82, 980, 1756, 726, 873, 1554, 728, 1686, 1662, 483, 1802, 382, 1528, 41, 1911, 160, 1659, 495, 170, 300, 778, 1891, 809, 51, 963, 1566, 1778, 275, 1926, 419, 616, 152, 977, 693, 446, 1568, 1352, 37, 157, 890, 1841, 820, 1915, 1421, 1933, 602, 1527, 383, 333, 219, 1847, 1929, 182, 1858, 259, 764, 667, 1197, 313, 327, 1254, 314, 1337, 1843, 920, 1810, 13, 73, 563, 1572, 582, 1420, 28, 881, 763, 172, 1552, 1794, 1724, 696, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 835, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1222, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1022, 1086, 1321, 21, 1006, 1596, 352, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49, 1796 ],
                                 [ undefined, // S17, ZAT 70
                                   930, 1461, 47, 1226, 39, 1923, 1866, 1755, 68, 1430, 121, 1157, 1882, 1218, 1526, 779, 169, 1848, 1771, 82, 726, 1756, 980, 873, 1554, 728, 160, 1662, 483, 1802, 1911, 1528, 41, 382, 1686, 1659, 495, 170, 300, 778, 1891, 809, 51, 963, 1566, 1778, 275, 1926, 419, 616, 152, 977, 693, 446, 1568, 1352, 37, 157, 890, 1841, 820, 1915, 1421, 1933, 333, 1527, 383, 602, 219, 1847, 1337, 182, 1858, 259, 764, 667, 1197, 313, 327, 1254, 314, 1929, 1843, 920, 1810, 13, 73, 563, 1572, 582, 1420, 28, 881, 763, 172, 1552, 1794, 1724, 696, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 835, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1222, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1022, 1321, 21, 1006, 1596, 352, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49, 1796 ],
                                 [ undefined, // S17, ZAT 67 - 69
                                   930, 1461, 47, 68, 39, 1755, 1866, 1923, 1226, 1526, 121, 1157, 82, 1848, 1430, 779, 169, 1218, 1771, 1882, 726, 1756, 980, 873, 41, 728, 160, 1662, 483, 1802, 1911, 1528, 1554, 382, 1686, 1659, 1926, 170, 300, 778, 419, 809, 51, 963, 1566, 1778, 37, 495, 1891, 1421, 152, 977, 693, 446, 1568, 1352, 275, 157, 820, 1841, 890, 1858, 616, 1527, 333, 1933, 383, 602, 219, 1847, 1337, 182, 1915, 259, 764, 667, 1197, 313, 327, 1254, 314, 1929, 1843, 920, 1810, 13, 73, 563, 1572, 582, 1420, 28, 881, 763, 172, 1552, 1794, 1724, 696, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 835, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1222, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1022, 1321, 21, 1006, 1596, 352, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49, 1796 ],
                                 [ undefined, // S17, ZAT 66
                                   930, 1461, 47, 68, 39, 1755, 1866, 1923, 1848, 1526, 121, 1218, 82, 1226, 1430, 779, 169, 1157, 1771, 1882, 726, 1756, 980, 873, 41, 483, 160, 1662, 728, 1802, 1911, 1554, 1528, 382, 1686, 1659, 1926, 170, 300, 778, 419, 809, 51, 963, 1566, 1778, 37, 495, 1891, 1421, 152, 977, 693, 446, 1568, 1352, 1841, 1915, 820, 275, 890, 1858, 616, 1527, 333, 1933, 383, 602, 219, 1847, 1337, 182, 157, 259, 764, 667, 1197, 313, 327, 1254, 314, 1929, 1843, 920, 1810, 696, 73, 563, 1572, 582, 1420, 28, 881, 763, 172, 1552, 1794, 1724, 13, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 835, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1222, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1022, 1321, 21, 1006, 1596, 352, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49, 1796 ],
                                 [ undefined, // S17, ZAT 61 - 65
                                   930, 1461, 47, 68, 39, 1755, 1866, 1923, 1848, 1526, 121, 1218, 1882, 1226, 1430, 779, 169, 1157, 1771, 82, 726, 1756, 980, 873, 41, 483, 160, 1662, 728, 1802, 1911, 1554, 1528, 419, 809, 1659, 1926, 1421, 300, 778, 382, 1686, 51, 963, 1566, 1778, 37, 495, 1891, 170, 152, 977, 693, 446, 1568, 1352, 1841, 1915, 820, 275, 890, 1858, 616, 1527, 333, 1933, 383, 602, 219, 1847, 1337, 182, 157, 259, 764, 667, 1197, 313, 327, 1254, 314, 1929, 1843, 920, 1810, 696, 73, 563, 1572, 582, 1420, 28, 881, 763, 172, 1552, 1794, 1724, 13, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 835, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1222, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1022, 1321, 21, 1006, 1596, 352, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49, 1796 ],
                                 [ undefined, // S17, ZAT 60
                                   47, 1461, 930, 68, 1848, 1755, 1866, 1923, 39, 1226, 169, 1218, 1882, 1526, 1430, 980, 121, 1157, 1771, 82, 726, 1756, 779, 1911, 41, 483, 160, 1662, 728, 1802, 873, 382, 1528, 419, 809, 1659, 1926, 170, 495, 778, 1554, 1686, 51, 963, 1566, 1778, 37, 300, 1891, 1421, 152, 977, 693, 446, 1568, 1352, 1841, 1915, 820, 275, 890, 1858, 616, 1527, 333, 1933, 383, 602, 219, 1847, 1337, 182, 157, 259, 764, 667, 1197, 313, 327, 1254, 314, 1929, 1843, 920, 1810, 696, 73, 563, 1572, 582, 1420, 28, 881, 763, 172, 1552, 1794, 1724, 13, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 835, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1222, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1022, 1321, 21, 1006, 1596, 352, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49, 1796 ],
                                 [ undefined, // S17, ZAT 59
                                   47, 1461, 930, 68, 1848, 1755, 1866, 1923, 39, 1226, 169, 1218, 1882, 1526, 1430, 980, 121, 1157, 1771, 41, 726, 1756, 779, 1911, 82, 1659, 160, 1662, 728, 1802, 873, 382, 1528, 419, 809, 483, 1926, 170, 495, 778, 1554, 1686, 51, 963, 1566, 1778, 37, 300, 1891, 1421, 152, 977, 693, 446, 1568, 1352, 1841, 820, 1915, 275, 890, 1858, 616, 1527, 333, 1933, 383, 602, 219, 1847, 1337, 182, 157, 259, 764, 667, 1197, 313, 327, 1254, 314, 1929, 1843, 920, 1810, 696, 73, 563, 1572, 582, 1420, 28, 881, 763, 172, 1552, 1794, 1724, 13, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 835, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1222, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1022, 1321, 21, 1006, 1596, 352, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49, 1796 ],
                                 [ undefined, // S17, ZAT 58
                                   47, 1461, 930, 1923, 1848, 1755, 1866, 68, 39, 1430, 169, 1218, 1882, 1526, 1226, 980, 121, 1157, 1771, 41, 726, 1756, 779, 1911, 82, 1659, 160, 1662, 778, 1802, 1686, 382, 483, 419, 809, 1528, 37, 963, 495, 728, 1554, 873, 51, 170, 1566, 1778, 1926, 300, 1891, 1421, 152, 977, 693, 446, 1568, 383, 1841, 820, 1915, 275, 890, 1858, 616, 1527, 333, 1933, 1352, 602, 219, 1847, 1337, 182, 157, 259, 764, 667, 1197, 313, 327, 1254, 314, 920, 1843, 1929, 1810, 696, 73, 563, 1572, 582, 1420, 28, 881, 763, 172, 1552, 1794, 1724, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 13, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1222, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 1022, 21, 1006, 1596, 352, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49, 1796 ],
                                 [ undefined, // S17, ZAT 55 - 57
                                   47, 1461, 930, 1923, 1848, 1755, 1866, 68, 39, 1430, 169, 1218, 1882, 1526, 1226, 980, 121, 1157, 1771, 41, 726, 1756, 779, 1911, 82, 809, 160, 1662, 778, 1802, 1686, 382, 483, 419, 1659, 1528, 37, 963, 495, 728, 1554, 873, 51, 170, 1566, 1778, 1926, 300, 1891, 820, 152, 890, 693, 446, 1568, 383, 1841, 1421, 1915, 275, 977, 1858, 616, 1527, 333, 1933, 1352, 602, 219, 1847, 1337, 182, 157, 259, 764, 667, 1197, 313, 327, 1254, 314, 920, 1843, 1929, 1810, 696, 73, 563, 1572, 582, 1420, 28, 881, 763, 172, 1552, 1794, 1724, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 13, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1222, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 1022, 21, 1006, 1596, 352, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49, 1796 ],
                                 [ undefined, // S17, ZAT 54
                                   1461, 47, 930, 1923, 1755, 1848, 1866, 68, 39, 1430, 169, 980, 1882, 1526, 1226, 1218, 82, 1157, 1771, 41, 726, 1756, 382, 1911, 121, 809, 160, 1662, 495, 170, 1686, 779, 483, 419, 1659, 1528, 37, 963, 778, 728, 1554, 873, 51, 1802, 1566, 1778, 1926, 300, 1891, 820, 152, 890, 693, 446, 1568, 383, 1841, 157, 1337, 275, 977, 1858, 616, 1527, 333, 1933, 1352, 602, 219, 1847, 1915, 182, 1421, 259, 764, 667, 1197, 313, 327, 1254, 314, 920, 1843, 1929, 1810, 696, 73, 563, 1572, 582, 1420, 28, 881, 763, 172, 1552, 1794, 1724, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 13, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1222, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 1022, 21, 1006, 1596, 352, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49 ],
                                 [ undefined, // S17, ZAT 53
                                   1461, 47, 930, 1923, 1755, 1848, 1866, 68, 39, 1430, 169, 980, 1882, 1526, 1226, 1218, 82, 1157, 1771, 41, 726, 1756, 382, 1911, 121, 809, 160, 1662, 495, 170, 1686, 779, 1528, 419, 1659, 483, 37, 963, 778, 728, 820, 873, 51, 1802, 1566, 1778, 1926, 300, 1891, 1554, 152, 890, 693, 446, 1568, 383, 1841, 157, 1337, 275, 977, 1858, 616, 1527, 333, 1933, 1352, 1847, 219, 602, 1915, 182, 1421, 259, 764, 667, 1197, 313, 327, 1254, 314, 920, 1843, 1810, 1929, 696, 73, 563, 1572, 582, 1420, 28, 881, 763, 172, 1552, 1794, 1222, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 13, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1724, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 1022, 21, 1006, 1596, 352, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49 ],
                                 [ undefined, // S17, ZAT 52
                                   1461, 1923, 1848, 47, 1430, 930, 980, 169, 1526, 1755, 68, 1866, 1882, 39, 1226, 1218, 82, 1157, 809, 41, 726, 1528, 382, 1911, 121, 1771, 160, 1662, 495, 1686, 170, 779, 1756, 419, 1659, 483, 37, 963, 778, 728, 820, 873, 51, 1802, 1566, 1778, 1926, 300, 1891, 333, 152, 1841, 693, 446, 1568, 383, 890, 157, 1337, 275, 977, 1858, 616, 1527, 1554, 1933, 1352, 1847, 219, 602, 1915, 182, 1421, 259, 764, 667, 1197, 313, 327, 1254, 314, 920, 1843, 1810, 73, 696, 1929, 563, 1572, 582, 1420, 28, 881, 763, 172, 1552, 1794, 1222, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 13, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1724, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1022, 1006, 1596, 352, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49 ],
                                 [ undefined, // S17, ZAT 49 - 51
                                   1461, 1923, 1848, 47, 1430, 930, 980, 169, 1526, 1755, 68, 1866, 1882, 39, 1226, 1218, 82, 1157, 809, 41, 726, 1528, 382, 1911, 121, 1771, 160, 1662, 419, 1686, 170, 779, 1756, 495, 1659, 483, 37, 963, 778, 728, 820, 873, 51, 1802, 1566, 1778, 1926, 300, 1891, 333, 152, 1841, 693, 446, 1568, 1847, 890, 157, 1337, 275, 977, 1858, 616, 1527, 1554, 1933, 1352, 383, 219, 602, 1915, 182, 1421, 259, 764, 667, 1197, 313, 327, 1254, 314, 920, 1843, 1810, 73, 696, 1929, 563, 1572, 582, 1420, 28, 881, 763, 172, 1552, 1794, 1222, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 13, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1724, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1022, 1006, 1596, 352, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49 ],
                                 [ undefined, // S17, ZAT 48
                                   1461, 1923, 1848, 47, 1430, 930, 980, 169, 1526, 1755, 68, 1866, 1882, 39, 41, 121, 82, 382, 809, 1226, 726, 1528, 1157, 1911, 1218, 1771, 160, 1662, 419, 1686, 170, 779, 1756, 495, 1659, 483, 37, 963, 778, 728, 820, 873, 51, 1566, 1802, 1847, 1926, 1858, 1891, 333, 152, 693, 1841, 446, 1568, 1778, 890, 157, 1337, 1352, 977, 300, 616, 1527, 1554, 1933, 275, 383, 219, 602, 1915, 182, 920, 259, 764, 667, 1197, 313, 327, 1254, 314, 1421, 1843, 1810, 73, 696, 1929, 563, 1572, 582, 1420, 28, 881, 763, 172, 1552, 1794, 1222, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 13, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1724, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 1022, 352, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49 ],
                                 [ undefined, // S17, ZAT 47
                                   1461, 1923, 1848, 47, 1430, 930, 980, 169, 1526, 1755, 68, 1866, 1882, 39, 41, 121, 82, 382, 809, 1226, 726, 1528, 1157, 1911, 1218, 1771, 160, 1662, 170, 1686, 419, 779, 1756, 495, 1659, 873, 37, 963, 778, 1926, 820, 483, 51, 1566, 1802, 1847, 728, 1858, 1891, 333, 152, 693, 1841, 446, 1568, 1778, 890, 1554, 1337, 1352, 977, 300, 616, 1527, 157, 1933, 275, 383, 219, 602, 1915, 182, 920, 259, 764, 667, 1197, 313, 327, 1254, 314, 1421, 1843, 1810, 73, 696, 1929, 563, 1572, 582, 1420, 28, 881, 763, 172, 1552, 1794, 1222, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 13, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1724, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 1022, 352, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49 ],
                                 [ undefined, // S17, ZAT 46
                                   1461, 1923, 1848, 47, 1430, 930, 980, 169, 1526, 68, 1755, 1866, 1882, 39, 82, 121, 41, 382, 809, 1226, 160, 1528, 1157, 1911, 419, 1771, 726, 1662, 1686, 170, 1218, 37, 1756, 495, 1659, 873, 779, 963, 1858, 1926, 820, 483, 51, 1566, 1891, 1847, 728, 778, 1802, 333, 152, 890, 1841, 157, 1568, 1778, 693, 1554, 1337, 1352, 977, 300, 616, 1527, 446, 1933, 383, 275, 219, 602, 1915, 182, 920, 259, 764, 667, 1197, 313, 327, 1254, 314, 172, 1843, 1810, 73, 696, 1572, 563, 1929, 582, 1420, 28, 881, 763, 1421, 1552, 1794, 1222, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 13, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1724, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1022, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49 ],
                                 [ undefined, // S17, ZAT 43 - 45
                                   1461, 1923, 1848, 47, 1430, 930, 980, 169, 1526, 68, 1755, 1866, 1882, 39, 82, 121, 41, 382, 809, 1226, 160, 1528, 1157, 1911, 419, 1771, 726, 1662, 1686, 170, 1218, 37, 1756, 873, 1659, 495, 779, 963, 1858, 1926, 820, 483, 51, 1566, 1891, 977, 728, 778, 1802, 333, 1554, 890, 1841, 157, 1568, 1778, 693, 152, 1337, 1352, 1847, 300, 616, 1527, 446, 1933, 383, 275, 219, 602, 327, 182, 920, 259, 764, 667, 1197, 313, 1915, 1254, 314, 172, 1843, 1810, 73, 696, 1572, 563, 1929, 582, 1420, 28, 881, 763, 1421, 1552, 1794, 1222, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 13, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1724, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1022, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49 ],
                                 [ undefined, // S17, ZAT 42
                                   1461, 1923, 1848, 47, 1430, 930, 980, 169, 1526, 68, 1755, 1866, 1882, 39, 82, 382, 41, 121, 809, 1226, 160, 1911, 1218, 1528, 419, 1771, 726, 1662, 1891, 170, 1157, 483, 1756, 873, 1659, 495, 779, 1568, 1858, 1926, 820, 37, 51, 1566, 1686, 616, 693, 778, 1802, 333, 1554, 890, 1841, 157, 963, 383, 728, 152, 1337, 1352, 1847, 300, 977, 1527, 446, 1933, 1778, 275, 219, 602, 327, 182, 920, 259, 764, 667, 1197, 313, 1915, 1254, 314, 172, 1843, 1810, 73, 696, 1572, 563, 1929, 582, 1420, 28, 881, 763, 13, 1552, 1794, 1222, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 1421, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 1724, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 689, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1022, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49 ],
                                 [ undefined, // S17, ZAT 41
                                   1461, 1923, 1848, 47, 1430, 930, 980, 169, 1526, 68, 1755, 1866, 1882, 39, 82, 382, 41, 121, 809, 1226, 160, 1911, 1218, 1528, 873, 1771, 726, 1662, 1891, 170, 1157, 483, 1756, 419, 1659, 495, 779, 1568, 1554, 1926, 820, 37, 51, 1566, 1686, 616, 693, 778, 1802, 333, 1858, 890, 1841, 1527, 963, 383, 728, 152, 1337, 1352, 1847, 300, 977, 157, 446, 1933, 1778, 275, 219, 182, 327, 602, 920, 259, 764, 667, 1197, 313, 881, 1254, 314, 172, 1843, 1810, 73, 696, 1572, 563, 1929, 582, 1420, 28, 1915, 763, 13, 1552, 1794, 1222, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 1421, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 689, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 1724, 1818, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1022, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49 ],
                                 [ undefined, // S17, ZAT 40
                                   1848, 1923, 1461, 1526, 1430, 930, 980, 169, 47, 1755, 68, 1866, 1882, 39, 82, 382, 41, 121, 809, 1226, 160, 1911, 1891, 1528, 873, 1771, 726, 1662, 1218, 170, 1926, 483, 1756, 419, 1659, 495, 779, 1568, 1554, 1157, 820, 890, 51, 1566, 1686, 616, 693, 778, 1841, 333, 1858, 37, 1802, 1337, 963, 383, 728, 152, 1527, 1352, 1847, 300, 977, 602, 259, 182, 1778, 275, 219, 1933, 327, 157, 920, 446, 764, 667, 1197, 313, 881, 1254, 314, 172, 1843, 1810, 73, 696, 1572, 563, 13, 582, 1420, 28, 1915, 763, 1929, 1552, 1794, 1222, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1076, 1421, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 689, 322, 1447, 569, 1935, 80, 981, 1652, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1022, 1264, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49 ],
                                 [ undefined, // S17, ZAT 37 - 39
                                   1848, 1923, 1461, 1526, 1430, 930, 980, 169, 47, 1755, 68, 1866, 1882, 39, 82, 382, 41, 121, 809, 1226, 160, 873, 1891, 1528, 1911, 1771, 726, 1662, 1218, 170, 1926, 483, 419, 1756, 1659, 1554, 779, 1568, 495, 1157, 820, 890, 51, 1566, 1686, 616, 693, 778, 1841, 333, 1858, 37, 1802, 1337, 963, 383, 728, 219, 1527, 1352, 1847, 300, 977, 602, 259, 182, 1778, 275, 152, 1933, 327, 157, 920, 446, 764, 667, 1197, 313, 881, 1254, 314, 172, 1843, 1810, 73, 696, 1572, 563, 13, 582, 1420, 28, 1076, 763, 1929, 1552, 1794, 1222, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1915, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 597, 689, 322, 1447, 569, 1935, 1421, 981, 1652, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 1022, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49 ],
                                 [ undefined, // S17, ZAT 36
                                   1461, 1923, 1848, 1526, 1430, 930, 980, 169, 47, 1755, 68, 1866, 1882, 39, 41, 382, 82, 121, 809, 1226, 160, 873, 1891, 1771, 1911, 1528, 419, 1662, 1568, 1926, 170, 483, 726, 1756, 1659, 1554, 693, 1218, 495, 1157, 1858, 890, 51, 1566, 1686, 616, 779, 778, 1841, 333, 820, 37, 1802, 1337, 963, 383, 152, 219, 1527, 1352, 1847, 300, 977, 602, 259, 182, 1778, 275, 728, 1933, 327, 157, 920, 13, 764, 667, 1197, 313, 881, 1254, 314, 172, 1843, 1810, 73, 696, 1572, 563, 446, 582, 1420, 28, 1076, 763, 597, 1552, 1794, 1222, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1915, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 1929, 689, 322, 1447, 569, 1935, 1421, 981, 1652, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 346, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 1022, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49 ],
                                 [ undefined, // S17, ZAT 35
                                   1461, 930, 1848, 1526, 1430, 1923, 980, 169, 47, 1755, 68, 1866, 1882, 39, 41, 382, 82, 121, 873, 1226, 160, 809, 1891, 1771, 1911, 1528, 419, 1662, 1568, 1926, 170, 483, 726, 1554, 1659, 1756, 693, 1218, 616, 1157, 1858, 51, 890, 1566, 1686, 495, 779, 778, 1841, 1527, 820, 37, 1802, 1337, 963, 383, 152, 219, 333, 1352, 1847, 300, 977, 602, 259, 182, 1778, 275, 728, 1933, 327, 157, 920, 13, 764, 667, 1197, 313, 881, 1254, 314, 172, 1843, 1810, 73, 696, 1572, 563, 446, 582, 1420, 28, 1076, 763, 597, 1552, 1794, 1222, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 1929, 689, 322, 1447, 569, 1915, 346, 981, 1652, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 1421, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 1022, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49 ],
                                 [ undefined, // S17, ZAT 34
                                   1461, 930, 1923, 169, 980, 1848, 1430, 1526, 47, 1755, 1866, 68, 1882, 39, 41, 382, 82, 121, 873, 1226, 160, 809, 1911, 1756, 1891, 1528, 419, 1662, 1568, 1858, 170, 483, 726, 1554, 1659, 1771, 693, 1218, 616, 495, 1926, 51, 890, 1566, 1686, 1157, 779, 1352, 1841, 1527, 602, 37, 1802, 1337, 963, 157, 152, 219, 333, 778, 1847, 300, 977, 820, 259, 182, 1254, 275, 728, 1933, 327, 383, 920, 13, 764, 667, 1197, 313, 881, 1778, 314, 172, 1843, 1810, 73, 696, 1572, 563, 446, 582, 1420, 28, 1076, 763, 597, 1552, 1794, 1222, 835, 692, 559, 137, 1476, 155, 1825, 1190, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1447, 569, 1915, 346, 1929, 1652, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 1421, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 1022, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 1054, 49 ],
                                 [ undefined, // S17, ZAT 33
                                   1461, 930, 1923, 169, 980, 1848, 1430, 1526, 47, 1755, 1866, 68, 1882, 39, 873, 809, 82, 121, 41, 1226, 160, 382, 1911, 1756, 1891, 1528, 419, 1662, 1568, 1858, 170, 483, 616, 1554, 1659, 1771, 693, 1218, 726, 495, 1926, 51, 890, 1566, 1686, 1157, 1847, 1352, 1841, 1527, 602, 37, 1802, 1337, 963, 157, 152, 219, 333, 778, 779, 300, 977, 820, 259, 182, 1254, 275, 728, 1933, 327, 383, 920, 13, 764, 667, 1197, 313, 881, 1778, 314, 172, 1843, 1810, 73, 696, 1572, 563, 137, 582, 1420, 28, 1076, 763, 597, 1552, 1794, 1222, 835, 692, 559, 446, 1476, 155, 1825, 1190, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1447, 569, 1915, 346, 1929, 1652, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 1421, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 1022, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 49, 1054 ],
                                 [ undefined, // S17, ZAT 32
                                   1461, 930, 1923, 169, 1526, 1848, 1430, 980, 47, 1755, 1866, 68, 809, 39, 873, 1882, 82, 121, 41, 1226, 160, 382, 1911, 1756, 1891, 1528, 419, 1662, 1568, 1858, 483, 170, 616, 693, 1659, 1771, 1554, 1157, 726, 495, 1926, 51, 890, 1566, 1686, 1218, 1847, 1352, 1841, 1527, 602, 37, 1337, 1802, 963, 157, 1933, 219, 333, 778, 779, 300, 977, 820, 259, 182, 1254, 275, 728, 152, 327, 383, 920, 13, 764, 667, 1197, 313, 881, 835, 314, 172, 1843, 1810, 73, 696, 1572, 563, 137, 582, 1420, 28, 1076, 763, 597, 1552, 1794, 1222, 1778, 692, 559, 446, 1476, 155, 1825, 1190, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1447, 569, 1915, 346, 1652, 1929, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 1421, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 1022, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 49, 1054 ],
                                 [ undefined, // S17, ZAT 31
                                   1461, 930, 1923, 169, 1526, 1848, 1430, 980, 47, 1755, 1866, 68, 809, 39, 873, 1882, 82, 121, 41, 1226, 160, 382, 1911, 1756, 1891, 1528, 419, 1662, 1568, 1858, 483, 170, 616, 693, 1659, 1771, 1554, 1157, 726, 495, 1926, 51, 890, 1566, 1686, 1218, 1847, 1352, 1841, 1527, 602, 37, 1337, 1802, 963, 157, 1933, 219, 333, 778, 779, 300, 977, 820, 259, 182, 1254, 275, 728, 152, 327, 383, 920, 13, 764, 667, 1197, 313, 881, 835, 314, 172, 1843, 1810, 73, 696, 1572, 563, 137, 582, 1420, 28, 1076, 763, 597, 1552, 1794, 1222, 1778, 692, 559, 446, 1476, 155, 1825, 1190, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1447, 569, 1915, 346, 1652, 1929, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 736, 198, 1421, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 1022, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 49, 1054 ],
                                 [ undefined, // S17, ZAT 30
                                   1461, 930, 1923, 47, 1526, 1430, 1848, 980, 169, 1755, 1866, 68, 809, 39, 873, 1882, 82, 41, 121, 1226, 160, 382, 1911, 1771, 1891, 1528, 419, 1756, 1926, 1858, 483, 170, 693, 616, 1659, 1662, 1554, 1157, 726, 1568, 495, 51, 890, 1566, 1686, 1218, 219, 1352, 1841, 1527, 602, 37, 1337, 1802, 963, 820, 1847, 1933, 333, 778, 779, 300, 977, 157, 259, 182, 1254, 275, 1810, 152, 327, 383, 920, 13, 764, 667, 1197, 313, 881, 835, 314, 172, 1843, 728, 73, 696, 1572, 563, 137, 582, 1420, 28, 1076, 763, 597, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 1778, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 446, 569, 736, 346, 1652, 1929, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 1915, 198, 1421, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 660, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 1022, 107, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 49, 1054 ],
                                 [ undefined, // S17, ZAT 29
                                   1461, 930, 1923, 47, 1526, 1430, 1848, 980, 169, 1755, 1866, 68, 873, 39, 809, 1882, 82, 41, 121, 1226, 160, 382, 1911, 1771, 419, 1528, 1891, 1756, 1926, 1554, 170, 483, 693, 616, 1659, 1662, 1858, 1157, 726, 1568, 51, 495, 1566, 890, 1686, 1218, 219, 1352, 1841, 1527, 602, 37, 1337, 1802, 963, 820, 1847, 1933, 333, 778, 779, 300, 977, 157, 259, 182, 1254, 1810, 275, 152, 327, 383, 920, 13, 764, 667, 1197, 313, 881, 835, 314, 172, 1843, 728, 73, 696, 1572, 563, 137, 582, 1420, 28, 1076, 763, 597, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 1778, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 446, 569, 736, 346, 1652, 1929, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 1030, 734, 545, 1548, 660, 198, 1421, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 1915, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1209, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 107, 1022, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 49, 1054 ],
                                 [ undefined, // S17, ZAT 28
                                   930, 1461, 1923, 47, 1526, 1430, 1848, 980, 169, 1755, 1866, 68, 873, 39, 809, 1882, 82, 41, 121, 1226, 160, 382, 1911, 1771, 419, 1528, 1891, 1756, 1926, 1554, 483, 170, 693, 616, 1659, 1662, 1858, 1157, 726, 1568, 51, 495, 1566, 890, 1686, 977, 219, 1352, 1841, 1527, 602, 37, 1337, 963, 1802, 820, 1847, 1933, 333, 13, 779, 300, 1218, 383, 259, 182, 1254, 1810, 275, 152, 327, 157, 920, 778, 764, 667, 1197, 313, 881, 835, 314, 172, 1843, 728, 73, 696, 1572, 563, 137, 582, 1420, 28, 1076, 763, 597, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 1778, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 736, 346, 1652, 1929, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 446, 734, 545, 1548, 660, 198, 1421, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 1209, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1915, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 107, 1022, 1010, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 49 ],
                                 [ undefined, // S17, ZAT 25 - 27
                                   930, 1461, 1923, 47, 1526, 1430, 1848, 873, 169, 1755, 1866, 68, 980, 39, 809, 1882, 82, 41, 121, 1226, 160, 382, 1528, 1771, 419, 1911, 1891, 1554, 1926, 1756, 483, 170, 495, 616, 1659, 1662, 1858, 51, 726, 1568, 1157, 693, 1566, 890, 1686, 977, 219, 1352, 1841, 1527, 602, 37, 1337, 963, 1802, 1810, 1847, 1933, 333, 13, 779, 300, 1218, 383, 259, 182, 1254, 820, 275, 152, 327, 157, 920, 778, 764, 667, 1197, 313, 881, 835, 314, 172, 1843, 728, 73, 696, 1572, 563, 137, 582, 1420, 28, 1076, 763, 597, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 736, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 1778, 346, 1652, 1929, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 446, 734, 545, 1548, 660, 198, 1421, 1797, 1275, 761, 436, 25, 510, 708, 1493, 524, 741, 878, 762, 1261, 401, 242, 1209, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1915, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 107, 1010, 1022, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 49 ],
                                 [ undefined, // S17, ZAT 24
                                   1923, 1461, 930, 47, 1526, 1430, 1848, 873, 169, 980, 1866, 68, 1755, 39, 809, 1882, 82, 41, 121, 1226, 160, 1911, 1528, 1771, 419, 382, 1891, 1554, 1568, 1756, 483, 170, 495, 616, 1659, 1662, 1858, 51, 693, 1926, 1157, 726, 1566, 890, 1686, 259, 219, 1352, 1841, 1527, 602, 37, 1337, 963, 1802, 1810, 1847, 333, 1933, 13, 779, 300, 1218, 383, 977, 182, 1254, 820, 275, 152, 327, 835, 920, 778, 764, 667, 1197, 313, 881, 157, 314, 172, 1843, 728, 73, 696, 1572, 563, 137, 582, 1420, 28, 1076, 763, 597, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 736, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 660, 346, 1652, 524, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 878, 734, 545, 1548, 1778, 198, 1421, 1797, 1275, 761, 436, 25, 510, 708, 1493, 1929, 741, 446, 762, 1261, 401, 242, 1209, 224, 1910, 859, 1359, 330, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1915, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 107, 1010, 1022, 663, 102, 67, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 49 ],
                                 [ undefined, // S17, ZAT 23
                                   1923, 1461, 930, 47, 169, 1430, 1848, 873, 1526, 980, 1866, 68, 1755, 39, 1882, 809, 82, 41, 1554, 1226, 160, 1911, 1528, 1771, 170, 382, 1891, 121, 1568, 1756, 483, 419, 495, 616, 1659, 1662, 1527, 51, 693, 1926, 1157, 726, 1566, 1686, 890, 259, 219, 1352, 182, 1858, 602, 37, 1337, 963, 1810, 1802, 778, 333, 1933, 275, 779, 300, 1218, 383, 977, 1841, 1254, 820, 13, 881, 327, 835, 920, 1847, 764, 667, 1197, 313, 152, 157, 314, 172, 1843, 728, 73, 696, 1572, 563, 137, 582, 1420, 28, 1076, 763, 597, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 736, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 660, 346, 1652, 524, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 878, 734, 545, 1548, 1778, 198, 330, 1797, 1275, 761, 436, 25, 510, 708, 1493, 1929, 741, 446, 762, 1261, 401, 242, 1209, 224, 1910, 859, 1359, 1421, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1915, 824, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 107, 1010, 67, 663, 102, 1022, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 49 ],
                                 [ undefined, // S17, ZAT 22
                                   1923, 1461, 930, 47, 169, 1430, 1866, 873, 1526, 980, 1848, 68, 1755, 39, 1882, 809, 82, 41, 1554, 1226, 160, 1911, 1528, 419, 170, 382, 1891, 121, 1568, 1756, 483, 1771, 495, 616, 1659, 1662, 1527, 51, 693, 259, 1157, 726, 1566, 1686, 890, 1926, 219, 1352, 182, 1858, 602, 37, 1337, 963, 1810, 1802, 778, 333, 1933, 275, 779, 300, 1218, 383, 977, 1841, 1254, 820, 13, 881, 327, 835, 920, 1847, 764, 667, 1197, 313, 152, 157, 314, 172, 1843, 728, 73, 696, 1572, 563, 137, 582, 1420, 28, 1076, 763, 597, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 736, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 660, 346, 1652, 524, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 878, 734, 545, 1548, 1778, 198, 330, 1797, 1275, 761, 436, 25, 510, 708, 1493, 1929, 741, 1261, 762, 446, 401, 242, 1209, 224, 1910, 859, 1359, 824, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1915, 1421, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 107, 1010, 67, 663, 102, 1022, 214, 38, 1094, 1295, 261, 1832, 1186, 1657, 398, 789, 564, 1238, 49, 75 ],
                                 [ undefined, // S17, ZAT 21
                                   1923, 1461, 930, 47, 169, 1430, 1866, 1882, 1526, 980, 1848, 68, 1755, 39, 873, 1554, 82, 1226, 809, 41, 160, 495, 170, 419, 1528, 382, 1891, 121, 1568, 1527, 483, 1771, 1911, 616, 1659, 1662, 1756, 51, 693, 259, 1157, 219, 1566, 1686, 890, 1926, 726, 1352, 182, 1858, 602, 37, 1337, 963, 1810, 778, 1802, 333, 275, 1933, 779, 300, 1218, 383, 977, 1841, 1254, 820, 13, 881, 327, 835, 920, 1847, 764, 667, 1197, 313, 152, 157, 314, 172, 1843, 728, 73, 696, 1572, 563, 137, 582, 1420, 28, 1076, 763, 597, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 736, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 660, 346, 1652, 524, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 198, 330, 1797, 1275, 761, 436, 25, 510, 708, 1493, 1929, 741, 1261, 762, 446, 401, 242, 1209, 1778, 1910, 859, 1359, 824, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1832, 1421, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 107, 1010, 67, 663, 102, 1022, 214, 38, 1094, 1295, 261, 1915, 1186, 1657, 398, 789, 564, 1238, 49, 75 ],
                                 [ undefined, // S17, ZAT 20
                                   1461, 1923, 169, 47, 930, 1866, 1430, 980, 39, 1882, 1848, 68, 41, 1526, 873, 121, 82, 1226, 809, 1755, 160, 495, 419, 170, 1528, 382, 1891, 1554, 693, 1527, 483, 259, 1911, 616, 1659, 1662, 1756, 963, 1568, 1771, 1157, 219, 1566, 1686, 890, 383, 726, 1352, 182, 1858, 1337, 37, 602, 51, 1810, 778, 1802, 333, 835, 1933, 779, 300, 1218, 1926, 977, 1841, 1254, 820, 13, 881, 327, 275, 920, 1847, 764, 667, 1197, 313, 152, 157, 314, 172, 1843, 28, 73, 696, 1572, 563, 137, 582, 1420, 728, 1076, 763, 597, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 736, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 660, 346, 1652, 524, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 198, 330, 1797, 1275, 761, 436, 25, 510, 708, 1493, 1929, 741, 1261, 762, 446, 401, 242, 1209, 1778, 1910, 859, 1359, 824, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1832, 1915, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 107, 1010, 67, 663, 102, 1022, 214, 38, 1094, 1295, 261, 1421, 1186, 1657, 398, 789, 564, 1238, 49 ],
                                 [ undefined, // S17, ZAT 19
                                   1461, 1923, 169, 47, 930, 1866, 1430, 980, 39, 1882, 1848, 68, 41, 1526, 873, 121, 82, 1226, 809, 1755, 160, 1527, 419, 170, 1528, 382, 1891, 1554, 693, 495, 616, 259, 1911, 483, 1659, 1662, 1756, 963, 1568, 1771, 1157, 219, 1566, 1686, 890, 383, 1218, 1352, 182, 1858, 1337, 37, 602, 51, 1810, 778, 1802, 300, 835, 977, 779, 333, 726, 1926, 1933, 1841, 1254, 1847, 13, 881, 327, 275, 920, 820, 764, 667, 1197, 313, 1076, 157, 314, 172, 1843, 28, 73, 696, 1572, 563, 137, 582, 1420, 728, 152, 763, 597, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 736, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 660, 346, 1652, 524, 1096, 836, 1818, 1724, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 198, 330, 1797, 1275, 761, 436, 25, 510, 708, 1493, 1929, 741, 1261, 762, 446, 401, 242, 1209, 1778, 1910, 859, 1359, 824, 252, 1820, 1177, 14, 451, 1787, 1795, 394, 493, 595, 355, 254, 1832, 1915, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 107, 1010, 67, 663, 102, 1022, 214, 38, 1094, 1295, 261, 1421, 1186, 1657, 398, 789, 564, 1238, 49 ],
                                 [ undefined, // S17, ZAT 18
                                   1923, 1461, 1866, 1430, 930, 169, 47, 1526, 39, 1882, 1848, 68, 41, 980, 809, 121, 82, 1226, 873, 382, 160, 1527, 419, 170, 1528, 1755, 259, 1554, 963, 495, 616, 1891, 1911, 483, 1659, 1686, 1756, 693, 1568, 1337, 1157, 219, 1566, 1662, 890, 383, 1218, 1352, 182, 1858, 1771, 37, 602, 51, 1810, 778, 1802, 300, 835, 977, 779, 333, 726, 1926, 1933, 1841, 172, 1847, 13, 881, 327, 275, 920, 820, 764, 667, 1197, 313, 1076, 157, 314, 1254, 1843, 28, 73, 696, 1572, 563, 137, 582, 1420, 728, 152, 763, 597, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 736, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 660, 346, 1652, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 198, 330, 1797, 1275, 761, 436, 1724, 510, 708, 1493, 762, 741, 1261, 1929, 394, 401, 242, 1209, 1778, 1910, 859, 1359, 824, 252, 1820, 1177, 14, 451, 1787, 1795, 446, 493, 595, 355, 254, 1832, 1915, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 107, 1010, 67, 663, 102, 1022, 214, 38, 1094, 1295, 261, 1421, 1186, 1657, 398, 789, 564, 1238, 49 ],
                                 [ undefined, // S17, ZAT 17
                                   1923, 1461, 1866, 1430, 930, 169, 47, 1526, 39, 1882, 1848, 68, 41, 980, 809, 121, 82, 1527, 873, 382, 170, 1226, 1554, 160, 1528, 1755, 259, 419, 963, 495, 616, 1891, 1911, 483, 1659, 1686, 1218, 693, 1568, 1337, 1858, 219, 1566, 1662, 890, 779, 1756, 1352, 182, 1157, 1771, 37, 602, 51, 1810, 778, 1802, 1847, 835, 977, 383, 333, 726, 1926, 1933, 1841, 172, 300, 13, 881, 327, 275, 920, 820, 764, 667, 1197, 313, 1076, 157, 314, 1254, 1843, 28, 73, 696, 1572, 563, 137, 582, 1420, 728, 736, 763, 597, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 152, 1935, 80, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 660, 346, 1652, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 198, 330, 1797, 1275, 761, 436, 1724, 510, 708, 1493, 762, 741, 1261, 1929, 394, 401, 242, 1209, 1832, 1910, 859, 1359, 824, 252, 1820, 1177, 14, 451, 1787, 1795, 446, 493, 595, 355, 254, 1778, 1238, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 352, 1264, 107, 1010, 67, 663, 102, 38, 214, 1022, 1094, 1295, 261, 1421, 1186, 1657, 398, 789, 564, 1915, 49 ],
                                 [ undefined, // S17, ZAT 16
                                   1461, 1923, 1866, 1430, 39, 169, 47, 1526, 930, 1882, 1848, 68, 41, 980, 809, 121, 82, 1527, 873, 382, 170, 1226, 1554, 160, 259, 1755, 1528, 419, 963, 495, 616, 1891, 1911, 483, 1659, 1686, 1218, 693, 1568, 1337, 1858, 219, 1566, 1662, 890, 779, 1756, 333, 182, 1157, 1771, 37, 835, 51, 1810, 778, 1933, 1847, 602, 977, 383, 1352, 172, 1926, 1802, 1841, 726, 300, 13, 881, 327, 275, 920, 820, 764, 667, 1197, 313, 1076, 157, 314, 1254, 1843, 28, 73, 696, 1572, 563, 137, 582, 1420, 80, 736, 763, 597, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 152, 1935, 728, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 660, 346, 1652, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 198, 330, 1797, 1275, 761, 436, 1724, 510, 708, 1493, 762, 741, 1261, 1929, 394, 401, 242, 1209, 1832, 1910, 859, 1359, 824, 252, 1820, 1177, 14, 451, 1787, 1795, 352, 493, 595, 355, 254, 1915, 1238, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 446, 1264, 107, 1010, 67, 663, 102, 38, 214, 1022, 1094, 1295, 261, 1421, 1186, 1657, 398, 789, 564, 1778, 49 ],
                                 [ undefined, // S17, ZAT 13 - 15
                                   1461, 1923, 1866, 1430, 39, 169, 47, 1526, 930, 1882, 1848, 68, 41, 980, 809, 1527, 1554, 121, 873, 382, 170, 1226, 82, 160, 259, 1755, 1528, 419, 963, 1566, 1659, 1891, 1911, 483, 616, 1686, 1218, 693, 1568, 1337, 1858, 219, 495, 1810, 779, 890, 1756, 333, 182, 1847, 1771, 37, 835, 51, 1662, 778, 1933, 1157, 602, 977, 383, 1352, 172, 1926, 1802, 881, 726, 300, 13, 1841, 327, 275, 920, 820, 764, 667, 1197, 313, 1076, 157, 314, 1254, 1843, 28, 73, 696, 1572, 563, 137, 582, 1420, 80, 736, 763, 597, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 1935, 728, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 152, 346, 1652, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 198, 330, 1797, 1275, 761, 436, 1724, 510, 708, 1493, 762, 741, 1261, 1929, 394, 401, 242, 1209, 1832, 1910, 859, 1359, 824, 252, 1820, 1177, 14, 451, 1787, 1795, 352, 493, 595, 355, 254, 1915, 1238, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 446, 1264, 107, 1010, 67, 663, 102, 38, 214, 1022, 1094, 1295, 261, 1421, 1186, 1657, 398, 789, 564, 1778, 49 ],
                                 [ undefined, // S17, ZAT 12
                                   1923, 1461, 1866, 47, 39, 169, 1430, 1526, 930, 1882, 1848, 121, 41, 980, 809, 1527, 1554, 68, 873, 382, 170, 1226, 82, 160, 259, 1755, 1528, 419, 963, 1566, 1659, 1891, 1911, 483, 616, 1686, 1218, 693, 1568, 1337, 1858, 219, 495, 1810, 779, 890, 1756, 333, 182, 1847, 1771, 37, 835, 51, 1662, 778, 1933, 13, 602, 977, 383, 1352, 172, 1926, 1802, 881, 726, 300, 1157, 327, 1841, 275, 920, 820, 764, 667, 1197, 313, 1076, 157, 314, 597, 1843, 28, 73, 696, 1572, 563, 137, 582, 1420, 80, 736, 763, 1254, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 1935, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 152, 346, 728, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 198, 330, 1797, 1275, 761, 436, 1724, 510, 708, 1493, 762, 741, 1261, 1929, 394, 401, 242, 1209, 1832, 1910, 859, 1359, 824, 252, 1820, 1177, 14, 451, 1787, 1795, 352, 493, 595, 355, 254, 1915, 1238, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 446, 1264, 107, 1010, 67, 663, 102, 38, 214, 1022, 1094, 1295, 261, 1421, 1186, 1657, 398, 789, 564, 1778, 49 ],
                                 [ undefined, // S17, ZAT 11
                                   1923, 1461, 1866, 47, 39, 169, 1430, 930, 1526, 1882, 1848, 121, 170, 980, 1554, 1527, 809, 68, 1755, 382, 41, 1566, 82, 160, 259, 873, 1528, 419, 963, 1226, 1659, 1891, 1858, 483, 616, 1686, 1218, 693, 1568, 1337, 1911, 219, 495, 1810, 779, 890, 1352, 1926, 182, 1847, 1771, 37, 835, 51, 1662, 778, 1933, 13, 602, 977, 383, 1756, 172, 333, 1802, 881, 726, 300, 1157, 327, 1841, 275, 920, 820, 764, 667, 1197, 313, 1076, 157, 314, 597, 1843, 28, 73, 696, 1572, 563, 137, 582, 1420, 80, 736, 763, 1254, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 1935, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 152, 346, 728, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 198, 330, 1797, 1275, 761, 436, 1724, 510, 708, 1493, 762, 741, 1261, 1929, 394, 401, 242, 1209, 1832, 1910, 859, 1359, 824, 252, 1820, 1177, 14, 451, 1787, 1795, 352, 493, 595, 355, 254, 564, 1238,/#1303#/ 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 446, 1010, 67, 663, 102, 38, 214, 1022, 1094, 1295, 261, 1421, 1186, 1657, 398, 789, 1915, 1778, 49 ],
                                 [ undefined, // S17, ZAT 10
                                   1461, 1923, 1866, 47, 39, 169, 1430, 930, 1526, 1882, 41, 121, 170, 980, 1554, 1527, 809, 82, 1755, 382, 1848, 1566, 68, 483, 259, 873, 1528, 419, 963, 693, 1659, 1891, 1858, 160, 616, 495, 1218, 1226, 1568, 1337, 1911, 219, 1686, 1810, 779, 890, 13, 1926, 182, 1847, 1771, 37, 835, 51, 1662, 778, 1933, 1352, 602, 977, 383, 1756, 172, 333, 1802, 881, 726, 300, 1157, 327, 1841, 275, 920, 820, 764, 667, 1197, 313, 1076, 157, 314, 597, 1843, 28, 73, 696, 1572, 563, 137, 582, 1420, 80, 736, 763, 1254, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 1935, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 152, 728, 1797, 1275, 761, 436, 1724, 510, 708, 1493, 762, 741, 1261, 1929, 394, 401, 242, 1209, 1832, 1910, 859, 1359, 824, 252, 1820, 1177, 14, 451, 1787, 1795, 352, 493, 595, 355, 254, 564, 1238, 1303, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 446, 1010, 67, 663, 102, 38, 214, 1094, 1022, 1295, 261, 1421, 1186, 1657, 398, 789, 1915, 1778, 49 ],
                                 [ undefined, // S17, ZAT 9
                                   1461, 1923, 1866, 47, 39, 169, 930, 1430, 1526, 1554, 41, 1527, 170, 980, 1882, 121, 1566, 82, 1755, 382, 1848, 809, 68, 483, 259, 616, 1528, 1858, 219, 693, 1218, 1891, 419, 160, 873, 495, 1659, 1226, 1568, 1337, 1926, 963, 1686, 1810, 779, 890, 13, 1911, 182, 1847, 1771, 37, 835, 51, 1662, 778, 977, 1352, 602, 1933, 383, 1756, 172, 333, 1802, 881, 314, 300, 1157, 327, 275, 1841, 920, 820, 764, 667, 1197, 313, 1076, 157, 726, 597, 1843, 28, 73, 696, 1572, 563, 137, 582, 1420, 80, 736, 763, 1254, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 1935, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 152, 728, 1797, 1275, 761, 436, 1724, 510, 708, 1493, 762, 741, 1261, 1929, 394, 401, 242, 1209, 1832, 1910, 859, 1359, 824, 252, 1820, 1177, 14, 451, 1787, 1795, 352, 493, 595, 355, 254, 564, 1238, 1303, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 446, 1010, 67, 663, 102, 38, 214, 1094, 1022, 1295, 261, 1421, 1186, 1657, 398, 789, 1915, 1778 ],
                                 [ undefined, // S17, ZAT 7 - 8
                                   1461, 1923, 1866, 47, 39, 169, 930, 1430, 1526, 1554, 41, 1527, 170, 980, 1882, 121, 1566, 82, 1755, 382, 1848, 809, 68, 483, 259, 616, 1528, 1858, 219, 693, 1218, 1891, 419, 160, 873, 495, 1659, 1226, 1568, 1337, 1926, 963, 1686, 1810, 779, 890, 13, 1911, 182, 1847, 1771, 37, 835, 51, 1662, 778, 977, 1352, 602, 1933, 383, 1756, 172, 333, 1802, 881, 314, 300, 1157, 327, 275, 1841, 920, 820, 764, 667, 1197, 313, 1076, 157, 726, 597, 1843, 28, 73, 696, 1572, 563, 137, 582, 1420, 80, 736, 763, 1254, 1552, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 1935, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 152, 728, 1797, 1275, 761, 436, 1724, 510, 708, 1493, 762, 741, 1261, 1929, 394, 401, 242, 1209, 1832, 1910, 859, 1359, 824, 252, 1820, 1177, 14, 451, 1787, 1795, 352, 493, 595, 355, 254, 564, 1238, 1303, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 446, 1010, 67, 663, 102, 38, 214, 1094, 1022, 1295, 261, 1421, 1186, 1657, 398, 789, 1915 ],
                                 [ undefined, // S17, ZAT 6
                                   1461, 1923, 1866, 47, 39, 169, 930, 1430, 1526, 1554, 41, 1527, 170, 980, 1882, 121, 1566, 82, 1755, 382, 1848, 809, 68, 483, 259, 616, 1528, 1858, 219, 693, 1218, 1891, 419, 160, 873, 495, 1659, 1226, 1568, 1337, 1926, 963, 1686, 1810, 779, 890, 13, 1911, 182, 1847, 1771, 37, 835, 51, 1662, 778, 977, 1352, 602, 1933, 383, 1756, 172, 920, 1802, 881, 314, 300, 1157, 327, 275, 1841, 333, 820, 764, 667, 1197, 313, 1076, 157, 1552, 597, 1843, 28, 73, 696, 1572, 563, 137, 582, 1420, 80, 736, 763, 1254, 726, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 1935, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 1724, 510, 708, 1493, 762, 741, 1261, 394, 1929, 401, 152, 1209, 1832, 1910, 859, 1359, 824, 252, 1820, 1177, 728, 451, 1787, 1795, 352, 493, 595, 355, 254, 564, 1238, 1303, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 446, 1010, 67, 663, 102, 38, 214, 1094, 1186, 1295, 261, 1421, 1022, 1657, 398, 789, 1915 ],
                                 [ undefined, // S17, ZAT 5
                                   1461, 1923, 1866, 930, 39, 1554, 47, 1430, 1526, 169, 1848, 1527, 1755, 980, 1882, 121, 1566, 82, 170, 382, 41, 809, 68, 483, 259, 616, 1528, 1858, 779, 693, 1218, 1891, 1926, 160, 873, 495, 1659, 1847, 1568, 1337, 419, 963, 1686, 1810, 219, 890, 13, 1756, 182, 1226, 1771, 37, 835, 51, 1662, 314, 977, 1352, 602, 1933, 383, 1911, 172, 920, 1157, 881, 778, 300, 1802, 327, 275, 1841, 333, 1076, 764, 667, 1197, 313, 820, 157, 1552, 597, 1843, 28, 73, 696, 1572, 563, 137, 582, 1420, 80, 736, 763, 1254, 726, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 1935, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 1724, 510, 708, 1493, 762, 741, 1261, 394, 1929, 401, 152, 1209, 1832, 1910, 859, 1359, 824, 252, 1820, 1177, 728, 451, 1787, 1795, 352, 493, 595, 355, 254, 564, 1238, 1303, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 67, 1010, 446, 663, 102, 38, 214, 1094, 1186, 1295, 261, 1421, 1022, 1657, 398, 789, 1915 ],
                                 [ undefined, // S17, ZAT 4
                                   1461, 1923, 1866, 930, 39, 1554, 47, 1430, 1526, 169, 1848, 1527, 1755, 980, 1882, 259, 1566, 82, 382, 170, 41, 809, 693, 483, 121, 616, 1528, 1858, 779, 68, 1218, 1891, 1926, 160, 873, 495, 13, 1847, 1568, 1337, 419, 963, 1686, 1810, 219, 890, 1659, 1756, 182, 1226, 1771, 37, 835, 51, 1662, 314, 977, 1352, 602, 1933, 383, 1911, 172, 920, 1157, 881, 778, 300, 333, 327, 275, 1841, 1802, 1076, 764, 667, 1197, 313, 73, 157, 1552, 597, 1843, 28, 820, 696, 1572, 563, 137, 582, 1420, 80, 736, 763, 1254, 726, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 1935, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 1724, 510, 708, 1493, 762, 741, 1261, 394, 1209, 401, 152, 1929, 1832, 1910, 859, 1359, 824, 252, 1820, 1177, 728, 451, 1787, 1795, 352, 493, 595, 355, 254, 564, 1238, 1303, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 1186, 1295, 261, 1421, 1022, 1657, 398, 789, 446 ],
                                 [ undefined, // S17, ZAT 3
                                   1461, 1923, 1554, 930, 39, 1866, 1848, 1430, 1755, 169, 47, 1527, 1526, 980, 1566, 259, 1882, 82, 382, 170, 809, 41, 693, 483, 121, 616, 1528, 1858, 1568, 68, 1218, 1847, 1926, 160, 873, 495, 13, 1891, 779, 1337, 1662, 963, 1686, 1810, 219, 1756, 1659, 890, 182, 977, 1771, 37, 835, 51, 419, 314, 1226, 1352, 602, 1933, 383, 1911, 172, 920, 1157, 881, 778, 300, 333, 327, 275, 1076, 1802, 1841, 764, 667, 1197, 313, 73, 1420, 1552, 597, 1843, 28, 820, 696, 1572, 563, 137, 582, 157, 80, 736, 763, 1254, 726, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 1935, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 1724, 510, 708, 1493, 762, 741, 1261, 394, 1209, 401, 564, 1929, 1832, 1910, 859, 1359, 824, 252, 1820, 1177, 1238, 451, 1787, 1795, 352, 493, 595, 355, 254, 152, 728, 1303, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 1186, 1295, 261, 1421, 1657, 1022, 398, 789, 446 ],
                                 [ undefined, // S17, ZAT 2
                                   1923, 1461, 1554, 930, 39, 1866, 1526, 1755, 1430, 169, 47, 1527, 1848, 980, 1566, 259, 1882, 82, 1528, 170, 809, 1568, 693, 483, 121, 616, 382, 1858, 41, 68, 1218, 1847, 1926, 160, 1810, 495, 1771, 1337, 1659, 1891, 1662, 963, 1686, 873, 219, 1756, 779, 890, 182, 977, 13, 37, 835, 51, 419, 314, 1226, 1352, 602, 920, 383, 1911, 172, 1933, 1157, 881, 778, 300, 333, 327, 275, 1076, 1802, 1841, 764, 667, 1197, 313, 73, 1420, 1552, 597, 1843, 28, 820, 696, 1572, 563, 137, 582, 157, 80, 736, 763, 1254, 1935, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 726, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 1724, 510, 708, 1493, 762, 741, 1261, 394, 1209, 401, 564, 1359, 1832, 1910, 859, 1929, 824, 252, 1820, 1177, 1238, 451, 1787, 1795, 352, 493, 595, 355, 254, 1186, 398, 1303, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 152, 1295,261,/#1292#/1421, 1657, 1022, 728, 789, 446 ],
                                 [ undefined, // S17, ZAT 1
                                   1923, 1461, 1554, 930, 39, 1866, 1526, 1755, 1430, 169, 47, 1527, 1848, 980, 1566, 259, 1882, 82, 1528, 170, 809, 1568, 693, 68, 121, 616, 382, 1858, 41, 483, 1218, 1847, 1926, 160, 1810, 219, 1771, 1337, 1659, 1891, 1662, 963, 1686, 873, 495, 1756, 779, 890, 182, 977, 13, 37, 835, 51, 419, 314, 1226, 1352, 602, 920, 383, 1911, 172, 1933, 1157, 881, 778, 300, 333, 327, 275, 1076, 1802, 1841, 764, 667, 1197, 313, 73, 1420, 1552, 597, 1843, 28, 820, 696, 1572, 563, 137, 582, 157, 80, 736, 763, 1254, 1935, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 726, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 741, 510, 708, 1493, 762, 1724, 1261, 394, 1209, 401, 564, 1359, 1832, 1910, 859, 1929, 824, 252, 1820, 1177, 1238, 451, 1787, 1795, 352, 493, 595, 355, 254, 1186, 398, 1292, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 152, 1295, 261, 1303, 1421, 1657, 1022, 728 ],
                                 [ undefined, // S17, ZAT 0
                                   1923, 1461, 1554, 930, 39, 1866, 1526, 1755, 1430, 169, 47, 1527, 1848, 980, 1566, 259, 1882, 82, 1528, 170, 809, 1568, 693, 68, 121, 616, 382, 1858, 41, 483, 1218, 1847, 1926, 160, 1810, 219, 1771, 1337, 1659, 1891, 1662, 963, 1686, 873, 495, 1756, 779, 890, 182, 977, 13, 37, 835, 51, 419, 314, 1226, 1352, 602, 920, 383, 1911, 172, 1933, 1157, 881, 778, 300, 333, 327, 275, 1076, 1802, 1841, 764, 667, 1197, 313, 73, 1420, 1552, 597, 1843, 28, 820, 696, 1572, 563, 137, 582, 157, 80, 736, 763, 1254, 1935, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 726, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 741, 510, 708, 1493, 762, 1724, 1261, 394, 1209, 401, 564, 1359, 1832, 1910, 859, 1929, 824, 252, 1820, 1177, 1238, 451, 1787, 1795, 352, 493, 595, 355, 254, 1186, 398, 1292, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 152, 1295, 261, 1303, 1421 ],
                                 [ undefined, // S16, ZAT 71 - 72
                                   1923, 1461, 1554, 930, 39, 1866, 1526, 1755, 1430, 169, 47, 1527, 1848, 980, 1566, 259, 1882, 82, 1528, 170, 809, 1568, 693, 68, 121, 616, 382, 1858, 41, 483, 1218, 1847, 1926, 160, 1810, 219, 1771, 1337, 1659, 1891, 1662, 963, 1686, 873, 495, 1756, 779, 890, 182, 977, 13, 37, 835, 51, 419, 314, 1226, 1352, 602, 920, 383, 1911, 172, 1933, 1157, 881, 778, 300, 333, 327, 275, 1076, 1802, 1841, 764, 667, 1197, 313, 73, 1420, 1552, 597, 1843, 28, 820, 696, 1572, 563, 137, 582, 157, 80, 736, 763, 1254, 1935, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 726, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 741, 510, 708, 1493, 762, 1724, 1261, 394, 1209, 401, 564, 1359, 1832, 1910, 859, 1929, 824, 252, 1820, 1177, 1238, 451, 1787, 1795, 352, 493, 595, 355, 254, 1186, 398, 1292, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 152, 1295, 261, 1303, 1421 ],
                                 [ undefined, // S16, ZAT 70
                                   1461, 1923, 1554, 1755, 39, 1866, 1526, 930, 1430, 169, 259, 1882, 1848, 980, 1566, 47, 1527, 82, 1528, 170, 616, 1568, 693, 68, 121, 809, 382, 1858, 41, 483, 1337, 1847, 1659, 160, 1810, 219, 1771, 1218, 1926, 1891, 1662, 963, 419, 873, 495, 1911, 1933, 890, 182, 977, 13, 602, 835, 51, 1686, 314, 1226, 1352, 37, 920, 383, 1756, 172, 779, 1157, 881, 73, 300, 333, 327, 275, 1076, 1802, 1841, 764, 667, 1197, 313, 778, 1420, 1552, 597, 1843, 28, 820, 696, 1572, 563, 137, 582, 157, 80, 736, 763, 1254, 1935, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 726, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 741, 510, 708, 1493, 762, 1724, 1261, 394, 1209, 401, 564, 1359, 1832, 1910, 859, 252, 824, 1929, 1820, 1177, 1238, 451, 1787, 1795, 352, 493, 595, 355, 254, 1186, 398, 1292, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 152, 1295, 261, 1303, 1421 ],
                                 [ undefined, // S16, ZAT 67 - 69
                                   1461, 1923, 1554, 1755, 39, 1866, 1526, 930, 1430, 169, 259, 1882, 1848, 980, 1566, 47, 1527, 382, 170, 1528, 616, 41, 1810, 68, 121, 809, 82, 1858, 1568, 1771, 1337, 1891, 1659, 160, 693, 219, 483, 1218, 1926, 1847, 1662, 963, 419, 873, 182, 1911, 1933, 890, 495, 977, 13, 602, 835, 51, 1686, 314, 1226, 1352, 37, 920, 383, 1756, 172, 779, 1157, 881, 73, 300, 333, 327, 275, 1076, 157, 1841, 764, 667, 1197, 313, 778, 1420, 1552, 597, 1843, 28, 820, 696, 1572, 563, 137, 582, 1802, 80, 736, 763, 1254, 1935, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 726, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 741, 510, 708, 1493, 762, 1724, 1261, 394, 1209, 401, 564, 1359, 1832, 1910, 859, 252, 824, 1929, 1820, 1177, 1238, 451, 1787, 1795, 352, 493, 595, 355, 254, 1186, 398, 1292, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 152, 1295, 261, 1303, 1421 ],
                                 [ undefined, // S16, ZAT 66
                                   1923, 1461, 1554, 169, 1430, 1866, 1526, 930, 39, 1755, 1882, 259, 1848, 1566, 980, 47, 1527, 1810, 170, 1528, 616, 41, 382, 1891, 121, 693, 82, 1858, 1568, 419, 1337, 68, 1847, 160, 809, 483, 219, 1911, 1926, 1659, 1662, 963, 1771, 495, 182, 1218, 51, 890, 873, 920, 13, 602, 835, 1933, 1686, 314, 1226, 1352, 1841, 977, 383, 1756, 172, 779, 1157, 881, 73, 300, 333, 327, 275, 1076, 157, 37, 764, 667, 1197, 313, 778, 1420, 1552, 597, 1843, 28, 820, 696, 1572, 563, 137, 582, 1802, 80, 736, 763, 1254, 1935, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 726, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 741, 510, 708, 1493, 762, 1724, 1261, 394, 1209, 401, 564, 1359, 1832, 1910, 859, 252, 824, 451, 1820, 1177, 1238, 1929, 1787, 1795, 352, 493, 595, 355, 254, 1186, 398, 1292, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 152, 1295, 261, 1303 ],
                                 [ undefined, // S16, ZAT 61 - 65
                                   1923, 1461, 1554, 169, 1430, 1866, 1526, 930, 39, 1755, 1882, 259, 170, 1566, 980, 47, 1527, 1810, 1848, 1528, 616, 41, 382, 1891, 121, 693, 82, 1858, 1568, 419, 1337, 68, 1847, 160, 809, 483, 219, 1911, 890, 1659, 1662, 963, 1771, 495, 182, 1218, 51, 1926, 873, 920, 383, 1686, 835, 1933, 602, 314, 1226, 1352, 1841, 977, 13, 1756, 172, 779, 1157, 881, 73, 300, 333, 327, 275, 1076, 157, 37, 764, 667, 1197, 313, 80, 1420, 1552, 597, 1843, 28, 820, 696, 1572, 563, 137, 582, 1802, 778, 736, 763, 1254, 1935, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 726, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 741, 510, 708, 1493, 762, 1724, 1261, 394, 1209, 401, 564, 1359, 1832, 1910, 859, 252, 824, 451, 1820, 1177, 1238, 1929, 1787, 1795, 352, 493, 595, 355, 254, 1186, 398, 1292, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 152, 1295, 261 ],
                                 [ undefined, // S16, ZAT 60
                                   1554, 1461, 1923, 169, 1430, 1866, 1526, 930, 39, 1755, 1882, 259, 170, 1566, 1848, 47, 1527, 1810, 980, 41, 616, 1528, 382, 1891, 121, 693, 82, 1858, 1568, 419, 1337, 68, 1847, 160, 809, 483, 219, 1911, 890, 1659, 1662, 963, 1771, 495, 182, 1218, 51, 1926, 873, 920, 383, 1686, 835, 1933, 602, 314, 1226, 1352, 1841, 977, 13, 1756, 172, 779, 1157, 881, 73, 300, 333, 327, 275, 1076, 157, 1420, 764, 667, 1197, 313, 80, 37, 1552, 597, 1843, 28, 820, 696, 1572, 563, 137, 582, 1802, 778, 736, 763, 1254, 1935, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 660, 726, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 741, 510, 708, 1493, 762, 1724, 1261, 394, 1209, 401, 564, 1359, 1832, 1910, 859, 252, 824, 451, 1820, 1177, 1238, 1787, 1929, 1795, 352, 493, 595, 355, 254, 1186, 398, 1292, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 152, 1295, 261 ],
                                 [ undefined, // S16, ZAT 59
                                   1554, 1461, 1923, 169, 1430, 1866, 1526, 930, 39, 1755, 1882, 259, 170, 1566, 1848, 47, 1527, 1810, 980, 41, 616, 1528, 382, 1891, 121, 693, 82, 1858, 1568, 809, 1337, 68, 1847, 160, 419, 483, 219, 1686, 890, 1659, 1662, 963, 1771, 51, 182, 1218, 495, 1926, 873, 920, 383, 1911, 835, 1226, 602, 314, 1933, 1352, 1841, 977, 13, 1756, 172, 779, 1157, 881, 73, 300, 333, 327, 275, 1076, 157, 1420, 1572, 667, 1197, 313, 80, 37, 1552, 597, 1843, 28, 820, 696, 764, 563, 137, 582, 1802, 660, 736, 763, 1254, 1935, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 778, 726, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 198, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 741, 510, 708, 1493, 762, 1910, 1261, 394, 1209, 401, 564, 1359, 1832, 1724, 859, 252, 824, 451, 1820, 1177, 1238, 1787, 1929, 1795, 352, 493, 595, 355, 254, 1186, 398, 1292, 55, 823, 1881, 1758, 1086, 1321, 21, 1596, 1006, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 152, 1295, 261 ],
                                 [ undefined, // S16, ZAT 58
                                   1554, 1461, 1923, 169, 1430, 1755, 1526, 930, 1882, 1866, 39, 259, 1810, 1566, 1848, 382, 1527, 170, 41, 980, 616, 1528, 47, 1891, 121, 693, 82, 1858, 1568, 809, 1337, 1686, 1847, 160, 419, 483, 219, 68, 890, 1659, 1662, 963, 1771, 51, 182, 1218, 495, 1933, 172, 920, 383, 1911, 835, 1226, 602, 314, 1926, 1352, 1841, 977, 13, 1756, 873, 779, 1157, 881, 73, 300, 333, 327, 275, 1076, 157, 1420, 1572, 667, 1197, 313, 80, 37, 1552, 597, 1843, 28, 820, 696, 764, 563, 137, 582, 1802, 660, 736, 763, 1254, 1935, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 198, 726, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 778, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 741, 510, 708, 1493, 762, 1910, 1261, 394, 1209, 401, 564, 1359, 1832, 1321, 859, 252, 824, 451, 1820, 1177, 1238, 1787, 1795, 1929, 352, 493, 595, 355, 254, 1186, 398, 1292, 55, 823, 1881, 1758, 1086, 1724, 21, 1596, 1006, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 152, 1295, 261 ],
                                 [ undefined, // S16, ZAT 55 - 57
                                   1554, 1461, 1923, 169, 1430, 1755, 1526, 930, 1882, 1866, 39, 259, 1810, 1566, 1848, 382, 1527, 170, 41, 980, 616, 1528, 47, 1891, 121, 693, 82, 1858, 1568, 809, 1337, 1686, 1847, 160, 419, 483, 219, 68, 890, 1659, 1662, 963, 1771, 51, 182, 1218, 1756, 1933, 172, 920, 383, 1911, 835, 1226, 602, 314, 1926, 1352, 779, 977, 13, 495, 873, 1841, 1157, 881, 73, 300, 1802, 327, 275, 1076, 157, 1420, 1572, 667, 1197, 313, 80, 563, 1552, 597, 1843, 28, 820, 696, 764, 37, 137, 582, 333, 660, 736, 763, 1254, 1935, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1825, 198, 726, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 778, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 741, 510, 708, 1493, 762, 1910, 1261, 394, 1209, 401, 564, 1359, 1832, 1321, 859, 252, 824, 451, 1820, 1177, 1238, 1787, 1795, 1929, 352, 493, 595, 355, 254, 1186, 398, 1292, 55, 823, 1881, 1758, 1086, 1724, 21, 1596, 1006, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 152, 1295, 261 ],
                                 [ undefined, // S16, ZAT 54
                                   1461, 1554, 1923, 169, 1430, 930, 39, 1755, 259, 1866, 1526, 1882, 1810, 980, 1848, 41, 1527, 170, 382, 1566, 616, 809, 47, 1891, 121, 693, 82, 1858, 1568, 1528, 1337, 1686, 1847, 160, 419, 483, 219, 68, 890, 1659, 1662, 963, 1771, 51, 182, 1926, 1756, 172, 1933, 920, 383, 1911, 835, 1226, 602, 314, 1218, 1352, 779, 977, 13, 495, 873, 1841, 1157, 881, 73, 300, 1802, 327, 275, 1076, 157, 1420, 1572, 667, 1197, 313, 80, 563, 1552, 597, 1843, 28, 820, 696, 764, 1825, 137, 582, 333, 660, 736, 763, 1254, 1935, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 37, 198, 726, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 778, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 741, 510, 708, 1493, 762, 1910, 1261, 394, 1209, 401, 564, 1359, 1832, 1321, 859, 252, 824, 451, 1820, 1177, 1238, 1787, 1795, 352, 1929, 493, 595, 355, 254, 1186, 398, 1292, 55, 823, 1881, 1758, 1086, 1006, 21, 1596, 1724, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 152, 1295, 261 ],
                                 [ undefined, // S16, ZAT 53
                                   1461, 1554, 1923, 169, 1430, 930, 39, 1755, 259, 1866, 1526, 1882, 1810, 980, 1848, 41, 1527, 170, 382, 1566, 616, 809, 47, 1891, 121, 693, 82, 1858, 1568, 1528, 1337, 1686, 1847, 160, 419, 483, 219, 68, 1662, 1659, 890, 963, 1771, 51, 182, 1926, 1756, 172, 1933, 920, 383, 1911, 835, 1226, 779, 314, 1218, 1352, 602, 977, 13, 495, 873, 1157, 1841, 881, 73, 300, 1802, 327, 275, 1076, 157, 1420, 1572, 667, 1197, 313, 80, 563, 1552, 597, 1843, 28, 820, 696, 764, 1825, 137, 582, 333, 660, 736, 763, 1254, 1935, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 37, 198, 726, 1652, 1838, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 778, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 741, 510, 708, 1493, 762, 1910, 1261, 394, 1209, 401, 564, 1359, 1832, 1321, 859, 252, 824, 451, 1820, 1177, 1238, 1787, 1795, 352, 1929, 493, 595, 355, 254, 1186, 398, 1292, 55, 823, 1881, 1758, 1086, 1006, 21, 1596, 1724, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 152, 1295, 261 ],
                                 [ undefined, // S16, ZAT 52
                                   1461, 1554, 1923, 169, 1430, 930, 1810, 1755, 1882, 1866, 1526, 259, 39, 980, 1848, 41, 1527, 170, 382, 121, 616, 1568, 47, 419, 1566, 693, 82, 1858, 809, 1528, 1337, 1686, 1847, 160, 1891, 483, 219, 68, 1662, 1659, 890, 963, 1771, 51, 182, 1926, 1352, 172, 1933, 920, 383, 1911, 835, 1226, 779, 314, 1218, 1756, 602, 977, 73, 495, 873, 1157, 1841, 881, 13, 300, 1802, 327, 275, 1076, 157, 1420, 1572, 667, 1197, 313, 80, 563, 1552, 597, 1843, 28, 820, 696, 764, 1825, 137, 582, 333, 660, 736, 763, 1254, 1935, 1794, 1222, 1190, 692, 559, 1447, 1476, 155, 1838, 198, 726, 1652, 37, 1168, 1821, 1668, 132, 386, 71, 981, 689, 322, 1030, 569, 778, 346, 330, 524, 1096, 836, 1818, 25, 1822, 1152, 86, 345, 878, 734, 545, 1548, 224, 242, 14, 1797, 1275, 761, 436, 741, 510, 708, 1493, 762, 1910, 1261, 394, 1209, 401, 564, 1359, 1832, 1321, 859, 252, 824, 451, 1820, 1177, 1238, 1787, 1795, 352, 355, 493, 595, 1929, 254, 1186, 398, 1292, 55, 823, 1881, 1758, 1086, 1006, 21, 1596, 1724, 107, 1264, 67, 1010, 1915, 663, 102, 38, 214, 1094, 152, 1295, 261 ],
                                 [ undefined, // S16, ZAT 49 - 51
                                   1461, 1554, 1923,  169, 1430,  930, 1810, 1755, 1882, 1866, 1526,  259,   39,  980, 1848,   41, 1527,  170,  382,  121,
                                    616, 1568,   47,  419, 1566,  693,   82, 1858,  809, 1528,   68, 1686, 1847, 1662, 1891,  483,  219, 1337,  160, 1659,
                                    890,  963, 1771,   51,  182, 1926, 1352,  172, 1933,  920,  383, 1911,  835, 1226,  779,  314, 1218, 1756,  602,  977,
                                     73,  495,  873, 1157,  881, 1841,   13,  300, 1802,  327,  275, 1076,  157, 1420, 1572,  667, 1197,  313,   80,  563,
                                   1552,  597, 1843,   28,  820,  696,  764, 1825,  137,  582,  333,  660,  736,  763, 1254, 1935, 1794, 1222, 1190,  692,
                                    559, 1447, 1476,  155, 1838,  198,  726, 1652,   37, 1168, 1821, 1668,  132,  386,   71,  981,  689,  322, 1030,  569,
                                    224,  346,  330,  524, 1096,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  778,  242,   14, 1797,
                                   1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  394, 1209,  401,  564, 1359, 1832, 1321,  859,  252,  824,
                                    451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929,  254, 1186,  398, 1292,   55,  823, 1881, 1758, 1086,
                                   1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214, 1094,  152, 1295,  261 ],
                                 [ undefined, // S16, ZAT 48
                                   1461,  930, 1923,  169, 1430, 1554, 1810,  980, 1882, 1866, 1526,  259,   39, 1755, 1848,   41,   82,  170,  382,  121,
                                    616, 1528,   47,  419, 1566,  693, 1527, 1686,  160, 1568,  963, 1858, 1847, 1662, 1891,  483,  219, 1337,  809, 1659,
                                    890,   68, 1771,   51,  182, 1926, 1352,  172, 1933,  920,  383, 1911,  835, 1226,  779,  314, 1218, 1756,  495,  977,
                                     73,  602,  873, 1157,  881, 1841,   13,  300, 1802,  327,  275, 1076,  157, 1420, 1572,  667, 1197,  313,   80,  563,
                                   1552,  597, 1843,   28,  820,  696,  764, 1825,  137,  582,  333,  660,  736,  763, 1254, 1935, 1794, 1222, 1190,  692,
                                    559, 1447, 1476,  155, 1838,  198,  726, 1652,   37, 1168, 1821, 1668,  132,  386,   71,  981,  689,  322, 1030,  569,
                                    224,  346,  330,  524, 1096,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  778,  242,   14, 1797,
                                   1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  394, 1209,  401,  564, 1359, 1832, 1321,  859,  252,  824,
                                    451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929,  254, 1186,  398, 1292,   55,  823, 1881, 1758, 1086,
                                   1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214, 1094,  152, 1295,  261 ],
                                 [ undefined, // S16, ZAT 47
                                   1461,  930, 1923,  169, 1430, 1554, 1810,  980, 1882, 1866, 1526,  259,   39, 1755, 1848,   47,   82,  170,  382, 1566,
                                    616, 1528,   41,  419,  121,  693, 1527, 1686,  160, 1568,  963, 1858, 1662, 1847, 1891,  483,  219, 1337,  809, 1659,
                                    890,   68, 1771,   51,  182, 1926, 1352,  172, 1933,  920,  383, 1911,  835, 1226,  779,  314, 1218,  313,  495,  977,
                                     73,  602,  873, 1157,  881, 1841,   13,  300, 1802,  327,  275, 1076,  157, 1420, 1572,  667, 1197, 1756,   80,  563,
                                   1552,  597, 1843,   28,  820,  696,  764, 1825,  137,  582,  333,  660,  736,  763, 1254, 1935, 1794, 1222, 1190,  692,
                                    559, 1447, 1476,  155, 1838,  198,  726, 1652,  569, 1168, 1821, 1668,  132,  386,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  330,  524, 1096,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564,  242,   14, 1797,
                                   1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  394, 1209,  401,  778, 1359, 1832, 1321,  859,  252,  824,
                                    451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929,  254, 1186,  398, 1292,   55,  823, 1881, 1758, 1086,
                                   1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214, 1094,  152, 1295,  261 ],
                                 [ undefined, // S16, ZAT 46
                                   1461,  930, 1923, 1810, 1430, 1554,  169,  980, 1526, 1866, 1882,  259,   39, 1755, 1848,   47,   82,  170,  382, 1566,
                                    616,  121,   41,  419, 1528,  693, 1527, 1686,  160, 1568,  963, 1858, 1662, 1847, 1337,  483,  219, 1891,  809, 1659,
                                    890,   68, 1771,   51,  182,  602, 1352,  172, 1933,  920,  383, 1911,  835, 1226,  779,  314, 1218,  313,  495,  977,
                                     73, 1926,  873, 1157,  881,  157,   13,  300, 1802,  327,  275, 1076, 1841, 1420, 1572,  667, 1197, 1756,   80,  563,
                                   1552,  597, 1843,   28,  820,  696,  764, 1825,  137,  582,  333,  660,  736,  763, 1254, 1935, 1794, 1222, 1190,  692,
                                    559, 1447, 1476,  155, 1838,  198,  726, 1652,  569, 1168, 1821, 1668,  132,  386,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  330,  524, 1096,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564,  242,   14, 1797,
                                   1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  394, 1209,  401,  254, 1359, 1832, 1321,  859,  252,  824,
                                    451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929,  778, 1186,  398, 1292,   55,  823, 1881, 1758, 1086,
                                   1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214, 1094,  152, 1295,  261 ],
                                 [ undefined, // S16, ZAT 45
                                   1461,  930, 1923, 1810, 1430, 1554,  169,  980, 1526, 1866, 1882,  259,   39, 1755, 1848,   47,   82,  170,  382, 1566,
                                    616,  121,   41,  419, 1528,  693, 1527, 1686, 1662, 1568,  963,  809,  160, 1847, 1337,   51,  219, 1891, 1858, 1659,
                                    172,   68, 1771,  483,  182,  602, 1352,  890, 1933,  920,  383,  313,  835, 1226,  779,  314, 1218, 1911,  495,  977,
                                     73, 1926,  873, 1157,  881,  157,   13,  300, 1802,  327,  275, 1076, 1841, 1420, 1572,  667, 1197, 1756,   80,  563,
                                   1552,  597, 1843,   28,  820,  696,  764, 1825,  137,  582,  333,  660,  736,  763,  726, 1935, 1794, 1222, 1190,  692,
                                    559, 1447, 1476,  155, 1838,  198, 1254, 1652,  569, 1168, 1821, 1668,  132,  386,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  330,  524, 1096,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564,  242,   14, 1797,
                                   1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  394, 1209,  401,  254, 1359, 1832, 1321,  859,  252,  824,
                                    451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929,  778, 1186,  398, 1292,   55,  823, 1881, 1758, 1086,
                                   1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214, 1094,  152, 1295,  261 ],
                                 [ undefined, // S16, ZAT 43 - 44
                                   1461,  930, 1923, 1810, 1430, 1554,  169,  980, 1526, 1866, 1882,  259,   39, 1755, 1848,   47,   82,  170,  382, 1566,
                                    616,  121,   41,  419, 1528,  693, 1527, 1686, 1662, 1568,  963,  809,  160, 1847, 1337,   51,  219, 1891, 1858, 1659,
                                    172,   68, 1771,  483,  182,  602, 1352,  890, 1933,  920,  383,  313,  835, 1226,  779,  314, 1218, 1911,  495,  977,
                                     73, 1926,  873, 1157,  881,  157,   13,  300, 1802,  327,  275, 1076, 1841, 1420, 1572,  667, 1197, 1756,   80,  563,
                                   1552,  597, 1843,   28,  820,  696,  764, 1825,  137,  582,  333,  660,  736,  763,  726, 1935, 1794, 1222, 1190,  692,
                                    559, 1447, 1476,  155, 1838,  198, 1254, 1652,  569, 1168, 1821, 1668,  132,  386,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  330,  524, 1096,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564,  242,   14, 1797,
                                   1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  394, 1209,  401,  254, 1359, 1832, 1321,  859,  252,  824,
                                    451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929,  778, 1186,  398, 1292,   55,  823, 1881, 1758, 1086,
                                   1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214, 1094,  152, 1295 ],
                                 [ undefined, // S16, ZAT 42
                                   1461,  930, 1923,  169, 1430,  980, 1810, 1554, 1882, 1866, 1526,  259,   39,   82, 1848,   47, 1755,  382,  170,  419,
                                    616,  121,   41, 1566, 1528,  693, 1527,  160, 1662,  219,  963,  809, 1686, 1847, 1337,   51, 1568, 1891, 1858, 1659,
                                    172,   68, 1771,  483,  182,  602, 1911,  495, 1933,  920,  383,  313,  835, 1226,  779,  314,  300, 1352,  890,  327,
                                     73, 1926,  873, 1157,  881,  157,   13, 1218, 1802,  977,  275, 1076, 1841, 1420, 1572,  667, 1197, 1756,   80,  563,
                                   1552,  597, 1843,   28,  820,  696,  764, 1825,  137,  582, 1476,  660,  736,  763,  726, 1935, 1794, 1222, 1190,  692,
                                    559, 1447,  333,  155, 1838,  198, 1254, 1652,  569, 1168, 1821, 1668,  132,  386,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  330,  524, 1096,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564,  242,   14, 1797,
                                   1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  394, 1209,  401,  254, 1359, 1832, 1321,  859,  252,  824,
                                    451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929,  778, 1186,  398, 1292,   55,  823, 1881, 1758, 1086,
                                   1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214, 1094,  152, 1295 ],
                                 [ undefined, // S16, ZAT 41
                                   1461,  930, 1923,  169, 1430,  980, 1810, 1554, 1882, 1866, 1526,  259,   39,   82, 1848,   47, 1755,  382,  170,  419,
                                    616,  121, 1662, 1566, 1528,  693, 1527,  160,   41,  219,  963,  809, 1686, 1847, 1337,   51, 1568, 1891, 1858, 1659,
                                    172,   68, 1771,  483,  182,  602, 1911,  495, 1226,  920,  383,  313,  835, 1933,  779,  314,  300, 1352,  890,  327,
                                     73, 1926,  873, 1157,  881,  157,   28, 1218, 1802,  977,  275, 1076, 1841, 1420, 1572,  667, 1197, 1756,   80,  563,
                                   1552,  597, 1843,   13,  820,  696,  764, 1825,  137,  582, 1476,  660,  736,  763,  726, 1935, 1794, 1222, 1190,  692,
                                    559, 1447,  333,  155, 1838,  198, 1254, 1652,  569, 1168, 1821, 1668,  132,  386,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  330,  524, 1096,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564,  242,   14, 1797,
                                   1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  394, 1209,  401,  254, 1359, 1832, 1321,  859,  252,  824,
                                    451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929, 1295, 1186,  398, 1292,   55,  823, 1881, 1758, 1086,
                                   1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214, 1094,  152,  778 ],
                                 [ undefined, // S16, ZAT 40
                                    930, 1461, 1923, 1430,  169, 1810,  980, 1554, 1882, 1866, 1526,  259,   39,   82, 1848,  121, 1755,  382,  170,  419,
                                    616,   47, 1662, 1566, 1847,  693, 1527,  160,   41,  219,  963,  172, 1686, 1528, 1337,   51, 1568, 1891, 1858, 1659,
                                    809,   68, 1771,  483,  182,  602, 1911,  495, 1226,  920,  383,  313,  835, 1933,  779,  314, 1756, 1352,  890,  327,
                                     73, 1926,  873, 1157,  881,  157, 1552,   80, 1802,  977,  275, 1076, 1420, 1841, 1572,  667, 1197,  300, 1218,  563,
                                     28,  597, 1843,   13,  820,  696,  764, 1825,  137,  582, 1476,  660,  736,  763,  198, 1935, 1794, 1222, 1190,  692,
                                    559, 1447,  333,  155, 1838,  726, 1254, 1652,  569, 1168, 1821, 1668,  132,  386,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  330,  524, 1096,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564,  242,   14, 1797,
                                   1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  394, 1209,  401,  254, 1359, 1832, 1321,  859,  252,  824,
                                    451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929, 1295, 1186,  398, 1292,   55,  823, 1881, 1758, 1086,
                                   1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214, 1094,  152,  778 ],
                                 [ undefined, // S16, ZAT 38 - 39
                                    930, 1461, 1923, 1430,  169, 1810,  980, 1554, 1882, 1866, 1526,  259,   39,   82, 1848,  121, 1755,  382,  170,  419,
                                   1662,   47,  616, 1566, 1847,  693, 1527,  160,   41,   51,  963,  172, 1686, 1528,   68,  219, 1568, 1891, 1858, 1659,
                                    809, 1337, 1771,  483,  182,  602, 1911, 1926, 1226,  920,  383,  313,  835, 1933,  779, 1802, 1756, 1352,  890,  327,
                                     73,  495,  873, 1157,  881,  157, 1552,   80,  314,  977,  275, 1076, 1420, 1841, 1572,  667, 1197,  300, 1218,  563,
                                     28,  597, 1843,   13,  820,  696,  764, 1825,  137,  582, 1476,  660,  736,  763,  198, 1935, 1794, 1222, 1190,  692,
                                    559, 1447,  386,  155, 1838,  726, 1254, 1652,  569, 1168, 1821, 1668,  132,  333,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  330,  524, 1096,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564,  242,   14, 1797,
                                   1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  394, 1209,  401,  254, 1359, 1832, 1321,  859,  252,  824,
                                    451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929, 1295, 1186,  398, 1292,   55,  823, 1881, 1758, 1086,
                                   1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214, 1094,  152,  778 ],
                                 [ undefined, // S16, ZAT 37
                                    930, 1461, 1923, 1430,  169, 1810,  980, 1554, 1882, 1866, 1526,  259,   39,   82, 1848,  121, 1755,  382,  170,  419,
                                   1662,   47,  616, 1566, 1847,  693, 1527,  160,   41,   51,  963,  172, 1686, 1528,   68,  219, 1568, 1891, 1858, 1659,
                                    809, 1337, 1771,  483,  182,  602, 1911, 1926, 1226,  920,  383,  313,  835, 1933,  779, 1802, 1756, 1352,  890,  327,
                                     73,  495,  873, 1157,  881,  157, 1552,   80,  314,  977,  275, 1076, 1420, 1841, 1572,  667, 1197,  300, 1218,  563,
                                     28,  597, 1843,   13,  820,  696,  764, 1825,  137,  582, 1476,  660,  736,  763,  198, 1935, 1794, 1222, 1190,  692,
                                    559, 1447,  386,  155, 1838,  726, 1254, 1652,  569, 1168, 1821, 1668,  132,  333,   71,  981,  689,  322, 1030,   37,
                                    224,  346,/#726#/ 330,  524, 1096,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564,  242,   14,
                                   1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  394, 1209,  401,  254, 1359, 1832, 1321,  859,  252,
                                    824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929, 1295, 1186,  398, 1292,   55,  823, 1881, 1758,
                                   1086, 1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214, 1094,  152,  778 ],
                                 [ undefined, // S16, ZAT 36
                                    930, 1461, 1923, 1430,  169, 1810,  980, 1554, 1882, 1866, 1526,  259,   39,   82, 1848,  121, 1755,  382,  419,  170,
                                   1662,   47,  616, 1566, 1847,  693, 1527,  160,   41,   51,  963,  172, 1686, 1528,   68,  219, 1568, 1891, 1858, 1659,
                                    920, 1337, 1771,  483,  182,  602, 1911, 1926, 1226,  809,  383,  313,  835, 1933,  779, 1802, 1552, 1352,  890,  327,
                                     73,  495,  873, 1157,  881,  157, 1756,   80,  314,  977,  275, 1076, 1420, 1841, 1572,  667, 1197,  300,  660,  563,
                                     28,  597, 1843,   13,  820,  696,  764, 1825,  137,  582, 1476, 1218,  736,  763,  198, 1935, 1794, 1222, 1190,  692,
                                    559, 1447,  386,  155, 1838,  726, 1254, 1652,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  726,  330,  524,  333,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564,  242,   14,
                                   1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  394, 1209,  401,  254, 1359, 1832, 1321,  859,  252,
                                    824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929, 1295, 1186,  398, 1292,   55,  823, 1881, 1758,
                                   1086, 1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214, 1094,  152,  778 ],
                                 [ undefined, // S16, ZAT 35
                                    930, 1461, 1923, 1430,  169, 1554,  980, 1810, 1882, 1866, 1526,  259,   39,   82, 1848, 1755,  121,  382,  419,  170,
                                   1662,   47,  616, 1847, 1566,  693, 1527,   51, 1771,  160,  963,  172, 1686,   68, 1528,  219, 1568, 1891, 1858, 1659,
                                    920, 1337,   41, 1226,  182,  602, 1926, 1911,  483,  809,  383,  313,  835, 1802,  779, 1933, 1552, 1352,  890,  327,
                                     73,  275,  873, 1157,  881,  157, 1756,   80,  314,  977,  495, 1076, 1420, 1841, 1572,  667, 1197,  300,  660,  563,
                                     28,  597, 1843,   13,  820,  696,  764, 1825,  137,  582, 1476, 1218,  736,  763,  198, 1935, 1794, 1222, 1190,  692,
                                    559, 1447,  386,  155, 1838, 1110, 1254, 1652,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  726,  330,  524,  333,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564,  242,   14,
                                   1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  394, 1209,  401,  254, 1359, 1832, 1321,  859,  252,
                                    824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929, 1295, 1186,  398, 1292,   55,  823, 1881, 1758,
                                   1086, 1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214, 1094,  152 ],
                                 [ undefined, // S16, ZAT 34
                                   1461,  930, 1923, 1430,  169, 1554,  980, 1810, 1882, 1866, 1526,  259,   39,   82, 1848, 1755,  121,  382,  419,  170,
                                   1662,  160,  616, 1847, 1566,  693, 1527,   51, 1771,   47,   41,  172,  920,   68, 1528,  219, 1568, 1891, 1858, 1659,
                                   1686, 1337,  963, 1226,  182,  483, 1926, 1911,  602,  809,  383,  313,  835, 1802,  779, 1933, 1552, 1352,  890,  327,
                                     73,  275,  873, 1157,  881,  157,   28,   80,  314,  977,  495, 1076, 1420, 1841, 1572,  667, 1197,  300,  660,  563,
                                   1756,  597, 1843,   13,  820,  696,  764, 1825,  137,  582, 1476, 1218,  736,  763,  198, 1935, 1794, 1222, 1190,  692,
                                    559, 1447,  386,  155, 1838, 1110, 1254, 1652,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  726,  330,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564,  242,   14,
                                   1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  333, 1209,  401,  254, 1359, 1832, 1321,  859,  252,
                                    824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929, 1295, 1186,  398, 1292,   55,  823, 1881, 1758,
                                   1086, 1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214, 1094,  152 ],
                                 [ undefined, // S16, ZAT 33
                                   1461,  930, 1923, 1554,  169, 1430,  980, 1810, 1882, 1866, 1526,  259,   39,   82, 1755, 1848,  121,  382,   51, 1662,
                                    170,  160,  616,   68, 1566,  693, 1527,  419, 1771,   47,   41,  172,  920, 1847, 1528,  219, 1926, 1891, 1858, 1659,
                                   1686,  313,  963, 1226,  182,  483, 1568, 1911,  602,  809,  383, 1337,  835, 1802,  779, 1933, 1552, 1352,  890,  327,
                                     73,  275,  873, 1157,  881,  157,   28,   80,  314,  977,  495, 1076, 1420, 1572, 1841,  667, 1197,  300,  660,  563,
                                   1756,  597, 1843,   13,  820,  696,  764, 1825,  137,  582, 1476, 1218,  736,  763,  198, 1935, 1794, 1222, 1190,  692,
                                    559, 1447,  386,  155, 1838, 1110, 1254, 1652,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  242,  330,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564,  726,   14,
                                   1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  333, 1209,  401,  254, 1359, 1832, 1321,  859,  252,
                                    824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929, 1295, 1186,  398, 1292,   55,  823, 1881, 1758,
                                   1086, 1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214, 1094,  152 ],
                                 [ undefined, // S16, ZAT 32
                                    930, 1461, 1923,  980,  169, 1430, 1554, 1810, 1526, 1866, 1882, 1848,   39,   82, 1755,  259,  121,  382,   51, 1662,
                                    170,  160,  616,   68, 1566,  693, 1527,  419, 1659,   47,   41,  172,  920, 1847, 1686,  219,  383, 1891, 1858, 1771,
                                   1528,  313,  963, 1226,  182,  483, 1933, 1911,  602, 1552, 1926, 1337,  835, 1802,  779, 1568,  809, 1352,  327,  890,
                                     73,  275,  873, 1157,  881,  157,   28,   80,  314,  977,  495, 1076, 1420, 1572, 1841,  667, 1197,  300,  660,  563,
                                    597, 1756, 1843,   13,  820,  696,  764, 1825,  137,  582, 1476, 1218,  736,  763,  198, 1935, 1794, 1222, 1190,  692,
                                    559, 1447,  386,  155, 1838, 1110, 1254, 1652,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  242,  330,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564,  726,   14,
                                   1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  333, 1209,  401,  254, 1359, 1832, 1321,  859,  252,
                                    824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929, 1295, 1186,  398, 1292,   55,  823, 1881, 1758,
                                   1086, 1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214, 1094,  152 ],
                                 [ undefined, // S16, ZAT 31
                                    930, 1461, 1923,  980,  169, 1430, 1554, 1810, 1526, 1866, 1882, 1848,  170,   82, 1755,  259, 1527,   68,   51, 1662,
                                     39,   47,  616,  382,   41,  693,  121,  419, 1659,  160, 1566,  172,  920, 1847, 1686,  219,  383, 1891, 1858, 1771,
                                   1528,  313,  963, 1226,  182,  483, 1933, 1911,  602, 1552, 1926,  873,  835, 1802,  779, 1568,  809, 1352,  327,  890,
                                     73,  275, 1337, 1157,  881,  157,   28,   80,  314,  977,  563, 1076, 1420, 1572, 1841,  667, 1197,  300,  660,  495,
                                    597, 1756, 1843,   13,  820,  696,  764, 1825,  137,  582, 1476, 1218,  736,  763,  198, 1935, 1794, 1222, 1190,  692,
                                    559, 1447,  386,  155, 1838, 1110, 1254, 1652,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  242,  330,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564,  726,   14,
                                   1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  333, 1209,  401,  254, 1359, 1832, 1321,  859,  252,
                                    824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929, 1295, 1186,  398, 1292,   55,  823, 1881, 1758,
                                   1086, 1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214 ],
                                 [ undefined, // S16, ZAT 30
                                    930, 1461, 1923,  980,  169, 1430, 1554, 1810, 1526, 1866, 1882, 1848,  170,   82, 1755,  259,   41,   68,   51, 1662,
                                     39,   47,  616,  382, 1527,  172,  920,  419,  383,  160, 1566,  693,  121, 1847, 1686,  219, 1659,  483, 1858, 1771,
                                   1552,  313,  963, 1226,  182, 1891, 1933, 1911,  602, 1528, 1926,  873,  835, 1802,  779, 1568,  314, 1352,  327,  890,
                                     73,  275, 1337, 1157,  881,  157,   28,   80,  809,  977,  563, 1076, 1420, 1572,  667, 1841, 1197,  300,  660,  495,
                                    597,  198, 1843,   13,  820,  696,  764, 1825,  137,  582, 1476, 1218,  736,  763, 1756, 1935, 1794, 1222, 1190,  692,
                                    559, 1447,  386,  155, 1838, 1110, 1254, 1652,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  242,  330,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564, 1321,   14,
                                   1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  333, 1209,  401,  254, 1359, 1832,  726,  859,  252,
                                    824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929, 1295, 1186,  398, 1292,   55,  823, 1881, 1758,
                                   1086, 1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214 ],
                                 [ undefined, // S16, ZAT 29
                                    930, 1461,  169,  980, 1923, 1554, 1430, 1810, 1526, 1866, 1882, 1848,  170,   82, 1755,  259,   41,   68,   51, 1662,
                                     39,   47,  616,  382, 1527,  172,  920,  419,  383,  160, 1566,  693,  121, 1771, 1686,  219, 1659,  483,  873, 1847,
                                   1552,  313,  779, 1226,  182, 1891, 1933, 1911,  602, 1528, 1926, 1858,  835, 1802,  963, 1568,  314, 1352,  327,  890,
                                     73,  275, 1337, 1157,  881,  157,   28,   80,  809,  977,  563, 1076, 1420, 1572,  667, 1841, 1197,  300,  660,  495,
                                    597,  198, 1843,   13,  820,  696,  764, 1825,  137,  582, 1476, 1218,  736,  763, 1756, 1935, 1794, 1222, 1190,  692,
                                    559, 1447,  386,  155, 1838, 1110, 1254, 1652,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  242,  330,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564, 1321,   14,
                                   1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  333, 1209,  401,  254, 1359, 1832,  726,  859,  252,
                                    824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929, 1295, 1186,  398, 1292,   55,  823, 1881, 1758,
                                   1086, 1006,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214 ],
                                 [ undefined, // S16, ZAT 28
                                    930,  980,  169, 1461, 1923, 1554, 1430, 1810, 1526, 1866, 1882, 1848,  170,   82, 1755,  172,  382,   68,   51, 1662,
                                     39,  121,  616,   41, 1527,  259,  920,  419,  383,  160, 1566,  693,   47, 1771, 1686,  219, 1659,  483,  873, 1847,
                                   1552,  313,  779, 1226,  182, 1891, 1933, 1911,  602, 1528, 1926, 1858,  835, 1802,  963, 1568,  314, 1352,  327,  890,
                                     73,  157, 1337, 1157,  881,  275,   28,   80,  198,  977,  563, 1076, 1420, 1572,  667, 1841, 1197,  300,  660,  495,
                                    597,  809, 1843,   13,  820,  696,  764, 1825,  137,  582, 1476, 1218,  736,  763, 1652, 1935, 1794, 1222, 1190,  692,
                                    559, 1447,  386,  155, 1838, 1110, 1254, 1756,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  242,  330,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564, 1321,   14,
                                   1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  333, 1209,  401,  254, 1359, 1832, 1006,  859,  252,
                                    824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929, 1295, 1186,  398, 1292,   55,  823, 1881, 1758,
                                   1086,  726,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214 ],
                                 [ undefined, // S16, ZAT 26 - 27
                                    169,  980,  930, 1461, 1923, 1554, 1430, 1810, 1526, 1755, 1882, 1848,  170,   82, 1866,  172,  382,   68,   51, 1662,
                                     39,  121,  616,   41, 1527,  259,  920,  219,  383,  160,  873,  693,   47, 1771, 1686,  419, 1659, 1226, 1566, 1926,
                                   1552,  313,  779,  483,  182, 1891, 1933,  327,  602, 1528, 1847, 1858,  835, 1802,  963, 1568,  314, 1352, 1911,   73,
                                    890,  157, 1337, 1157,  881,  275,  495,   80,  198,  977,  563, 1076, 1420, 1572,  667, 1841, 1197,  300,  660,   28,
                                    597,  809, 1843,   13,  820,  696,  764, 1825,  137,  582, 1476, 1218,  736,  763, 1652, 1935, 1794, 1222, 1190,  692,
                                    559, 1447,  386,  155, 1838, 1110, 1254, 1756,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  242,  330,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564, 1321,   14,
                                   1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  859, 1209,  401,  254, 1359, 1832, 1006,  333,  252,
                                    824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929, 1295, 1186,  398, 1292,   55,  823, 1881, 1758,
                                   1086,  726,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214 ],
                                 [ undefined, // S16, ZAT 25
                                    169,  980,  930, 1461, 1923, 1554, 1430, 1810, 1526, 1755, 1882, 1848,  170,   82, 1866,  172,  382,   68,   51, 1662,
                                     39,  121,  616,   41, 1527,  259,  920,  219,  383,  160,  873,  693,   47, 1771, 1686,  419, 1659, 1226, 1566, 1926,
                                   1552,  313,  779,  483,  182, 1891, 1933,  327,  602, 1528, 1847, 1858,  835, 1802,  963, 1568,  314, 1352, 1911,   73,
                                    890,  157, 1337, 1157,  881,  275,  495,   80,  198,  977,  563, 1076, 1420, 1572,  667, 1841, 1197,  300,  660,   28,
                                    597,  809, 1843,   13,  820,  696,  764, 1825,  137,  582, 1476, 1218,  736,  763, 1652, 1935, 1794, 1222, 1190,  692,
                                    559, 1447,  386,  155, 1838, 1110, 1254, 1756,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,   37,
                                    224,  346,  242,  330,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564, 1321,   14,
                                   1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  859, 1209,  401,  254, 1359, 1832, 1006,  333,  252,
                                    824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1929, 1295, 1186,  398, 1292,   55,  823, 1881, 1758,
                                   1086,  726,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214 ],
                                 [ undefined, // S16, ZAT 24
                                    980,  169,  930, 1461, 1923, 1554, 1430, 1810, 1526, 1755, 1882, 1848,   82,  170, 1866,  172,  382,   68,   41, 1662,
                                     39,  121,   47,   51, 1527,  419,  920,  219,  313,  160,  873,  693,  616, 1771,  483,  259, 1847, 1226, 1566, 1926,
                                   1552,  383,  779, 1686,  182, 1891, 1933,  327,  602, 1528, 1659, 1858,  835, 1802,  963, 1568,  314, 1352, 1911,   73,
                                    890,  157, 1337, 1157,  881,  275,  495,   80,  198,  977,  563, 1076, 1420, 1572,  667, 1841, 1197,  300,/#1841#/660,
                                     28,  597, 1476, 1843,   13,  820,  696,  764, 1825,  137,  582,  809, 1838,  736,  763, 1652, 1935, 1794, 1222, 1190,
                                    692,  559, 1447,  386,  155, 1218, 1110, 1254,  330,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                     37,  224,  346,  242, 1756,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564, 1321,
                                     14, 1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  859, 1209,  401,  254, 1359, 1832, 1006,  333,
                                    252,  824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1186, 1295, 1929,  398, 1292,   55,  823, 1881,
                                   1758, 1086,  726,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,   38,  214 ],
                                 [ undefined, // S16, ZAT 23
                                    980,  169,  930, 1461, 1923, 1554, 1430, 1810, 1526, 1866, 1882, 1848,   82,  170, 1755, 1527,  382,   68,   41, 1662,
                                     39,  873,   47,   51,  172,  419,  920,  219,  313, 1226,  121,  693,  616, 1771,  483,  259, 1847,  160, 1566, 1926,
                                   1552,  383,  779, 1686,  182, 1891, 1933,  327,  602, 1528, 1659, 1858,  835, 1802,  963, 1568,  314, 1352, 1911,   73,
                                    890,  157,  977, 1157,  881,  275,  495,   80,  198, 1337,  563, 1076, 1420, 1572,  667,  902, 1197,  300, 1841,  660,
                                     28,  597, 1476, 1843,   13,  820,  696,  764, 1825,  137,  582,  809, 1838,  736,  763, 1652, 1935, 1794, 1222, 1190,
                                    692,  559, 1447,  386,  155, 1218, 1110, 1254,  330,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                     37,  224,  346,  242, 1756,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  545, 1548,  564, 1321,
                                     14, 1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  859, 1209,  401,  254, 1359, 1832, 1006,  333,
                                    252,  824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1186, 1295, 1929,  398, 1292,   55,  823, 1881,
                                   1758, 1086,   38,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,  726,  214 ],
                                 [ undefined, // S16, ZAT 22
                                    980,  169,  930, 1461, 1923, 1810, 1430, 1554,   82, 1866, 1882, 1848, 1526,  170, 1662, 1527,  382,   68,   41, 1755,
                                     39,  873,   47,   51,  172,  419,  920,  219,  313, 1226,  121,  693,  616, 1771,  483,  259, 1847,  160, 1566, 1926,
                                   1552,  383,  779, 1686,  182, 1891, 1933,  327,  602, 1528, 1659, 1858,  835, 1802,  963, 1568,  314, 1352, 1911,   73,
                                    157,  890,  977, 1157,  881,  275,  495,   80,  198, 1337,  563, 1076, 1420, 1572,  667,  902, 1197,  300, 1841,  660,
                                     28,  597, 1476, 1843,   13,  820,  696,  764, 1825,  137,  582,  809, 1838,  736,  763, 1652, 1935, 1794, 1222, 1190,
                                    692,  559, 1447,  386,  155, 1218, 1110, 1254,  330,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                     37,  224,  346,  242,  545,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734, 1756, 1548,  564, 1321,
                                     14, 1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  859, 1209,  401,  254, 1359, 1832, 1006,  333,
                                    252,  824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1186, 1295, 1086,  398, 1292,   55,  823, 1881,
                                   1758, 1929,   38,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,  726,  214 ],
                                 [ undefined, // S16, ZAT 21
                                    930,  169,  980, 1461, 1923, 1810, 1866, 1554,   82, 1430, 1882, 1848, 1526,  170, 1662, 1527,  382,   68,  873, 1755,
                                     39,   41,   47,   51,  172, 1226,  920,  219,  313,  419, 1552,  693,  616, 1771,  483,  259, 1528,  779, 1802, 1926,
                                    121,  383,  160, 1686,  182, 1891, 1933,  327,  602, 1847, 1659, 1858,  835, 1566,  963, 1568,  314, 1352, 1911,   73,
                                    157,  890,  977, 1157,  881,  275,  495,   80,  198,   28,  563, 1076, 1420, 1572,  667,  902, 1197,  300, 1841,  660,
                                   1337,  597, 1476, 1843,   13,  820,  696,  764, 1825,  137,  582,  809, 1838,  736,  763, 1652, 1935, 1794, 1222, 1190,
                                    692,  559, 1447,  386,  155,   37, 1110,  346,  330,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                   1218,  224, 1254,  242,  545,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734, 1756, 1548,  564, 1321,
                                     14, 1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  859, 1209,  401,  254, 1359, 1832, 1006,  333,
                                    252,  824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1186, 1295, 1086,  398, 1292,   55,  823, 1881,
                                   1758, 1929,   38,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,  726,  214 ],
                                 [ undefined, // S16, ZAT 20
                                    930,  169, 1461,  980, 1923, 1810, 1866, 1554,   82, 1430, 1882, 1848, 1526,  170,   39, 1527,  382,   68,  172, 1755,
                                   1662,   41, 1771,   51,  873, 1226,  920,  219,  313,  419, 1552,  693,  616,   47,  483,  259, 1528, 1891, 1802, 1926,
                                    121,  383,  160, 1686,  182,  779, 1933,  327,  602, 1847, 1659, 1858,  835, 1566,  963, 1568,  314, 1352, 1911,   73,
                                    157,  890,  977, 1157,  881,  275,  495,   80,  198,   28,  563, 1076, 1420, 1572,  667,  902, 1197,  300, 1841,  660,
                                   1337,  597, 1476, 1843,   13,  820,  696,  764, 1825,  137,  582,  809, 1838,  736,  763, 1652, 1935, 1794, 1222, 1190,
                                    692,  559, 1447,  386,  155,   37, 1110,  346,  330,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                   1218,  224, 1254,  242,  545,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734, 1756, 1548,  564, 1321,
                                     14, 1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  859, 1209,  401,  254, 1359, 1832, 1006,  333,
                                    252,  824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595, 1186, 1295, 1086,  398, 1292,   55,  823, 1881,
                                   1758, 1929,   38,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,  726,  214 ],
                                 [ undefined, // S16, ZAT 19
                                    930,  169, 1461,  980, 1923, 1810, 1866, 1554,   82, 1430, 1882, 1848, 1526,  170,   39, 1527,  382,   68,  172, 1755,
                                   1662,   41, 1771,   51,  873, 1226,  920,  219,  313, 1528, 1552,  693, 1926,   47,  383,  259,  419, 1891, 1802,  616,
                                   1933,  483,  160, 1686,  182,  779,  121,  327,  602, 1847, 1659, 1858,  835,   73,  963, 1568,  314, 1352, 1076, 1566,
                                    157,  275,  977, 1157,  881,  890,  495,   80,  198,   28,  563, 1911, 1420, 1572,  667,  902, 1197,  300,  660, 1841,
                                    809,  597, 1476, 1843,   13,  820,  696,  764, 1825,  137,  582, 1337, 1838,  736,  763, 1652, 1935, 1794, 1222, 1190,
                                    692,  559, 1447,  386,  155,   37, 1110,  346,  330,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                   1548,  224, 1254,  242,  545,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734, 1756, 1218,  564, 1321,
                                     14, 1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  859, 1209,  401,  254, 1359, 1832, 1006,  333,
                                    252,  824,  451, 1820, 1177, 1238, 1787, 1795,  352,  355,  493,  595,/#778#/1186, 1295, 1086,  398, 1292,   55,  823,
                                   1881, 1758, 1929,   38,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,  726,  214 ],
                                 [ undefined, // S16, ZAT 18
                                    930,  169, 1461,  980, 1923, 1810, 1866, 1526,   82, 1430, 1882, 1848, 1554,  170,   39, 1527,  382,   68,  172,  920,
                                   1662,   41, 1771,  259,  873, 1226, 1755,  219,  419, 1528, 1552,  693, 1926,   47,  383,   51,  313, 1891, 1802,  616,
                                   1933,  483,  160, 1686,  182,  779,  121,  327,  602, 1847, 1659, 1858,  835,   73,  963, 1568,  314, 1352, 1076, 1566,
                                    157,  275,  977, 1157,  881,  890,  495,   80,  198,   28,  563, 1911, 1420, 1572,  667,  902, 1197,  300,  660, 1841,
                                   1935,  597, 1476, 1843,   13,  820,  696,  764, 1825,  137,  582, 1337, 1838,  736,  763, 1652,  809, 1794, 1222, 1190,
                                    692,  559, 1447,  386,  155,   37, 1110,  346,  330,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                   1548,  224, 1254,  242,  545,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352, 1209,  564, 1321,
                                     14, 1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  859, 1218,  401,  254, 1359, 1832, 1006,  333,
                                    252,  824,  451, 1820, 1177, 1238, 1787, 1795, 1756,  355,  493,  595,  214, 1186, 1295, 1086,  398, 1292,   55,  823,
                                   1881, 1758, 1929,   38,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,  726,  778 ],
                                 [ undefined, // S16, ZAT 17
                                    930,  169, 1461,  980, 1923, 1810, 1866, 1526,   82, 1430, 1882, 1848, 1554,  170,   39, 1527,  382,   68,  172,  920,
                                    873,   41, 1771,  259, 1662, 1226, 1755,  219,  419, 1528, 1552,  693, 1926,   47,  383,   51,  313, 1802, 1891,  616,
                                   1933,  483,  160, 1686,  182,  779,  121,  327, 1847,  602, 1659, 1352,  835,   73,  963,  902,  314, 1858, 1076, 1566,
                                    157,  275,  977, 1157,  881,   80,  495,  890,  198,   28,  563, 1911, 1420, 1572,  667, 1568, 1197,  300,  660, 1841,
                                   1935,  597, 1476, 1843,   13,  820,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,  809, 1794, 1222, 1190,
                                    692,  559, 1447,  386,  155,   37, 1110, 1337,  330,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                   1548,  224, 1254,  242,  545,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352, 1209,  564, 1321,
                                     14, 1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  859, 1218,  401,  254, 1359, 1832, 1006,  333,
                                    252,  824,  451, 1820, 1177, 1238, 1787, 1795, 1756,  355,  493,  595,  214, 1186, 1295, 1086,  398, 1292,   55,  823,
                                   1881, 1758, 1929,   38,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,  726,  778 ],
                                 [ undefined, // S16, ZAT 16
                                    930,  169,  980, 1461, 1866, 1810, 1923, 1848,   82, 1430, 1882, 1526, 1554,  170,   39,   41,  382,   68,  172,  920,
                                    873, 1527, 1552, 1662,  259, 1226, 1755,  219,  419, 1528, 1771,  693, 1926,   47,  383, 1891,  313, 1802,   51,  616,
                                    483, 1933,  160, 1686,  182,  779,  121,  327, 1847,  602, 1659, 1352,  835,   73,  963,  902,  314, 1858, 1076, 1566,
                                    157,  275,  977, 1157,  881,   80,  495,  198,  890,   28,  563, 1911, 1420, 1572,  667, 1568, 1197,  300,  660, 1841,
                                   1935,  597, 1476, 1843,   13,  820,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,  330, 1794, 1222, 1190,
                                    692,  559, 1447,  386,  155,   37, 1110, 1337,  809,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                   1548,  224, 1254,  242,  545,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352, 1209,  564, 1321,
                                     14, 1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  859,  595,  401,  254, 1359, 1832, 1006,  333,
                                    252,  824,  451, 1820, 1177, 1238, 1787, 1795, 1756,  355,  493, 1218,  214, 1186, 1295, 1086,  398, 1292,   55,  823,
                                   1881, 1758, 1929,   38,   21, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,  726,  778 ],
                                 [ undefined, // S16, ZAT 15
                                    930,  169,  980, 1461, 1866, 1810, 1923, 1848,   39, 1430, 1882, 1526, 1554,  170,   82,   41,  382,   68,  172,  920,
                                    873, 1527, 1552, 1662,  259, 1226, 1755,  219, 1528,  419, 1771,  693, 1926,   47,  383, 1891,  313, 1802,   51,  616,
                                    483, 1933,  160, 1686,  182,  902,  275,  327, 1847,  602, 1659, 1352,  835,   73,  963,  779,   28, 1858, 1076,  563,
                                    157,  121,  977, 1157,  881,   80,  495,  198,  890,  314, 1566, 1843, 1420, 1572,  667, 1568, 1197,  300,  660, 1841,
                                   1935,  597, 1476, 1911,   13,  820,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,  330, 1794, 1222, 1190,
                                    692,  559, 1447,  386,  155,   37, 1110, 1548,  809,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                   1337,  224, 1254,  242,  545,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352, 1209,  564, 1321,
                                     14, 1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  859,  595,  401,  254, 1359, 1832, 1006,  333,
                                    252,  824,  451, 1820, 1177, 1238, 1787, 1795, 1756,  355,  493, 1218,  214, 1186, 1295, 1086,  398, 1292,   55,  823,
                                   1881, 1758,   21,   38, 1929, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,  726,  778 ],
                                 [ undefined, // S16, ZAT 13 - 14
                                    930,  169,  980, 1461, 1866, 1810, 1923, 1848,   39, 1430, 1882, 1526, 1554,  170,   82,   41,  382,   68,  172,  920,
                                    873, 1527, 1552, 1662,  259, 1226, 1755,  219, 1528,  419, 1771,  693, 1926,   47,  383, 1891,  313, 1802,   51,  616,
                                    483, 1933,  160, 1686,  182,  902,  275,  327, 1847,  602, 1659, 1352,  835,   73,  963,  779,   28, 1858, 1076,  563,
                                    157,  121,  977, 1157,  881,   80,  495,  198,  890,  314, 1566, 1843, 1420, 1572,  667, 1568, 1197,  300,  660, 1841,
                                   1935,  597, 1476, 1911,   13,  820,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,  330, 1794, 1222, 1190,
                                    692,  559, 1447,  386,  155,   37, 1110, 1548,  809,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                   1337,  224, 1254,  242,  545,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352, 1209,  564, 1321,
                                     14, 1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  859,  595,  401,  254, 1359, 1832, 1006,  333,
                                    252,  824,  451, 1820, 1177, 1238, 1787, 1795, 1756,  355,  493, 1218,  214, 1186, 1295, 1086,  398, 1292,   55,  823,
                                   1881, 1758,   21,   38, 1929, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102,  726 ],
                                 [ undefined, // S16, ZAT 12
                                    930,  169,  980, 1461, 1866, 1810, 1923, 1848,   39, 1430, 1882, 1526,  920,  170,   82,   41,  172,   68,  382, 1554,
                                    873, 1527, 1552, 1662,  259, 1226, 1755,  219,   47,  419, 1771,  693, 1926, 1528,  383,  483,  313, 1802,   51,  616,
                                   1891, 1933,  160, 1686,  182,  902,  275,  327, 1847,  602, 1659, 1352,  835,   73,  963, 1568,   28, 1858, 1076,  563,
                                    157,  121,  977, 1157,  881,   80,  495,  198,  890,  314, 1935, 1843, 1420, 1572,  667,  779, 1197,  300,  660, 1841,
                                   1566,  597, 1476, 1911,   13,  820,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,  330, 1794, 1222, 1190,
                                    692,  559, 1447,  386,  155,   37, 1110, 1548,  809,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                   1337,  224, 1254,  242,  545,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352, 1209,  564, 1321,
                                     14, 1797, 1275,  761,  436,  741,  510,  708, 1493,  762, 1910, 1261,  859,  595,  401,  254, 1359, 1832, 1006,  333,
                                    252,  824,  451, 1820, 1177, 1238, 1787, 1795, 1756,  355,  493, 1218,  214, 1186, 1295, 1086,  398, 1292,   55,  823,
                                   1881, 1758,   21,   38, 1929, 1596, 1724,  107, 1264,   67, 1010, 1915,  663,  102 ],
                                 [ undefined, // S16, ZAT 11
                                    930,  169,  980, 1461, 1430, 1810, 1923, 1848,   39, 1866, 1882, 1526,  920,  170,   82, 1527,  172,   68,  382, 1554,
                                    873,   41, 1552, 1662,  259, 1226, 1755,  219,   47, 1802, 1771,  693,   51, 1528,  383,  483,  313,  419, 1926,  616,
                                   1891, 1933,  160, 1686,  182,  902,  275,  327, 1847,   73, 1659, 1352,  835,  602,  963, 1568, 1197, 1858, 1076,  563,
                                    157, 1420,  977, 1157,  881,   80,  495,  198,  314,  890, 1935, 1843,  121, 1572,  667,  779,   28,  300,  660, 1841,
                                   1566,  597, 1476, 1911,   13,  820,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,  330, 1794, 1222, 1190,
                                    692,  559, 1447,  386,  155,   37, 1110, 1548,  809,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                    741,  224, 1254,  242,  545,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352, 1209,  564, 1321,
                                     14, 1797, 1275,  761,  436, 1337,  510,  708, 1493,  762, 1910, 1261,  859,  595,  401,  254, 1359, 1832, 1006, 1929,
                                    252,  824,  451, 1820, 1177, 1238, 1787, 1795, 1756,  355,  493,  663,  214, 1186, 1295, 1086,  398, 1292,   55,  823,
                                   1881, 1758,   21,   38,  333, 1596, 1724,  107, 1264,   67, 1010, 1915, 1218,  102 ],
                                 [ undefined, // S16, ZAT 10
                                    930,  169,  980, 1461, 1430, 1810, 1866, 1848,   39, 1923, 1882, 1526,  382,   82,  170, 1527,  172,   68,  920, 1554,
                                    873,   41, 1552, 1662,  259, 1226, 1755,  219,   47, 1802, 1771,  693,   51, 1528,  383,  483,  313,  419, 1926,  616,
                                   1891, 1933,  160, 1686,  182,  902,  275,  327, 1847,   73, 1659, 1352,  835,  602,  963, 1568, 1197, 1858, 1076,  563,
                                    157, 1420,  977, 1157,  881,   80,  495,  198,  314, 1843, 1935,  890,  121, 1572,  667,  779,   28,  300,  660, 1566,
                                   1841,  597, 1476, 1911,   13,  820,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,  330, 1794, 1222, 1190,
                                    692,  559, 1447,  386,  155,   37, 1110, 1548,  809,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                    741,  224, 1254,  242,  545,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352, 1209,  564, 1321,
                                     14, 1797, 1275,  761,  436, 1337,  510,  708, 1493,  762, 1910, 1261,  859,/#1813#/595,  401,  254, 1359, 1832, 1006,
                                   1929,  252,  824,  451, 1820, 1177, 1238, 1787, 1795, 1756,  355,  493,  663,  214, 1186, 1295, 1086,  398, 1292,   55,
                                    823, 1881, 1758,   21,   38, 1010, 1596, 1724,  107, 1264,   67,  333, 1915, 1218,  102 ],
                                 [ undefined, // S16, ZAT 7 - 9
                                    930,  169,  980, 1461, 1430, 1810, 1866, 1848,   39, 1923, 1882, 1526,  382,   82,  170, 1527,  172,   68,  920, 1554,
                                    873,   41, 1552, 1662,  259, 1226, 1755,  219,  182, 1802, 1771,  693,   51, 1528,  383,  483,  327,  419, 1926,  616,
                                   1891,  275,  160, 1686,   47,  902, 1933,  313, 1847,   73, 1659, 1352,  835,  602,  963,  314, 1197,  881, 1076,  563,
                                    157, 1420,  977, 1157, 1858,   80,  495,  198, 1568, 1843, 1935,  890,  660, 1572,  667,  779,   28,  300,  121, 1566,
                                   1841,  597, 1476,  559,   13,  820,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,  330, 1794, 1222, 1190,
                                    692, 1911, 1447,  386,  155,   37, 1110, 1548,  809,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                    741,  224,  564,  242,  545,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352, 1209, 1254, 1321,
                                     14, 1797, 1275,  761,  436, 1813,  510,  708, 1493,  762, 1910, 1261,  859, 1337,  595,  401,  254, 1359, 1832, 1006,
                                   1929,  252,  824,  451, 1820, 1177, 1238, 1787, 1795, 1756,  355,  493,  663,  214, 1186, 1295, 1086,  398, 1292,   55,
                                    823, 1881, 1758,   21,   38, 1010, 1596, 1724,  107, 1264,   67,  333, 1915, 1218,  102 ],
                                 [ undefined, // S16, ZAT 6
                                    930,  169, 1461,  980, 1430, 1866, 1810, 1848,   39, 1923, 1882, 1526,  382,   82,  170, 1527,  172,   68,  920, 1554,
                                    873,   41, 1552, 1662,  259, 1226, 1755,  219,  182, 1802, 1771,  693,   51, 1528,  383,  483,  327,  419, 1926,  616,
                                   1891,  275,  160, 1686,   47,  902, 1933,  313, 1847,   73, 1659, 1352,  835,  602,  963,  314, 1197,  881, 1076,  563,
                                    157, 1420,  977, 1157, 1858,   80,  495,  198, 1568, 1843, 1935,  890,  660, 1572,  667,  779,   28,  300,  121, 1566,
                                   1841,  597, 1476,  559,   13,  820,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,  330, 1794, 1222, 1190,
                                    692, 1911, 1447,  386,  155,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                    741,  224,  564,  242,  809,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352, 1209,  595, 1321,
                                     14, 1797, 1275,  761,  436, 1813,  510,  708, 1493,  762, 1910, 1261,  859, 1337, 1254,  401,  254, 1359, 1832, 1006,
                                   1929,  252,  824,  451, 1820, 1177, 1238, 1787, 1795, 1756,  355,  493,  663,  214, 1186, 1295, 1086,  398, 1292,   55,
                                    823, 1881, 1758,   21,   38, 1010, 1596, 1724,  107, 1264,   67,  333, 1915, 1218,  102 ],
                                 [ undefined, // S16, ZAT 5
                                    930,  169, 1461,  980, 1430, 1866, 1810, 1848,   39, 1923, 1882,  873,  382,   68,  170, 1527,  172,   82,  920, 1554,
                                   1526,  182, 1552, 1662,  259, 1226, 1755,  219,   41, 1802,  327,  693,   51, 1528,  383,  483, 1771, 1659,  313,  616,
                                   1891,  275,  160, 1686,   47,  902,  314, 1926, 1847,   73,  419, 1352,  835,  602,  963, 1933, 1197,  881, 1076,  563,
                                    157, 1420,  977, 1157,  495,   80, 1858,  198, 1568, 1843, 1935,  890,  660, 1572,  667,  779,   28,  300,  155, 1447,
                                   1841,  597, 1476,  559,   13,  820,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,  330, 1794, 1222, 1190,
                                    692, 1911, 1566,  386,  121,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                    741,  224,  564,  242,  809,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352, 1209,  595, 1321,
                                     14, 1797, 1275,  761,  436, 1813,  510,  708, 1493,  762, 1910, 1261,  859,  493, 1254,  401,  254, 1359, 1832, 1006,
                                   1929,  252,  824,  451, 1820, 1177, 1238, 1787, 1795, 1756,  355, 1337,  663,  214, 1186, 1295, 1086,  398, 1292,   55,
                                    823, 1881, 1758,   21,   38, 1010, 1596, 1724,  107, 1264,   67,  333, 1915, 1218,  102 ],
                                 [ undefined, // S16, ZAT 4
                                    930,  169, 1866,  980, 1430, 1461, 1810, 1848,   39, 1923, 1882,  873,  382,   68,  170, 1527,  172,   82,  920, 1554,
                                   1526,  182, 1552, 1662,  483, 1226, 1755,  219,   41, 1802,  327,  693,   51, 1528,  383,  259, 1771, 1659,  313,  616,
                                   1891,  275,  160, 1686,   47,  902,  314, 1926, 1847,   73,  419, 1352,  835,  602,  963, 1933, 1197,  881, 1076,  563,
                                    157, 1420,  977, 1157,  495,   80, 1858,  198, 1568, 1843, 1935,  890,  660, 1572,  667,  779,   28,  300,  155, 1447,
                                   1841,  597, 1476,  559,   13,  820,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,  330, 1794, 1222, 1190,
                                    692, 1911, 1566,  386,  121,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322, 1030,
                                    741,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352, 1209,  595, 1321,
                                     14, 1797, 1275,  761,  436, 1813,  510,  708, 1493,  762, 1910,  809,  859,  493, 1254,  401,  254, 1359, 1832, 1006,
                                    451,  252,  824, 1929, 1820, 1177, 1238, 1787, 1795, 1756,  355, 1337,  663,  214, 1186, 1295, 1086,  398, 1292,   55,
                                    823, 1881, 1758,   21,   38, 1010, 1596, 1724,  107, 1264,   67,  333, 1915, 1218,  102 ],
                                 [ undefined, // S16, ZAT 3
                                    930,  169, 1866,  980, 1430, 1461, 1810, 1848,   68, 1923,  873, 1882,  382,   39,  170, 1527,  172,   82,  920, 1554,
                                   1526,  182, 1552, 1662,  483, 1226, 1755,  219,   41, 1802,  327,  693,   51, 1528,  383,  259, 1771, 1659,  313, 1352,
                                   1891,  275,  160, 1686,   47,  902,  314, 1197, 1847,   73,  419,  616,  835,  495,  963,  881, 1926, 1933, 1076,  563,
                                    157, 1420,  977, 1157,  602,   80, 1572,  198, 1568, 1843, 1935,  667,  660, 1858,  890,  779,   28,  300,  155, 1447,
                                    820,  597, 1476,  559,/#331#/  13, 1841,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,  330, 1794, 1222,
                                   1190,  692, 1911, 1566,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322,
                                   1030,  121,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352, 1209,  595,
                                   1321,   14, 1797, 1275,  761,  436, 1813,  510,  708, 1493,  762, 1910,  809,  859,  493, 1254,  401,  254, 1359, 1832,
                                   1006,  451,  252,  824, 1929, 1820, 1177, 1238, 1787, 1795, 1756,  355,   67,  663,  214, 1186, 1295, 1086,  398, 1292,
                                     55,  823, 1881, 1758,   21,   38, 1010, 1596, 1724,  107, 1264, 1337,  333, 1915, 1218,  102 ],
                                 [ undefined, // S16, ZAT 2
                                    930,  169, 1461, 1810, 1430, 1866,  980, 1882,   68, 1923,  873, 1848,  382,   39,  170, 1527,  172,   82,  920, 1554,
                                   1526,  182, 1552, 1662,  483, 1226, 1755,  219,  313, 1659,  327,  693,   51, 1528,  383,  259, 1771, 1802,   41, 1352,
                                   1891,  275,  160,   73,   47,  902, 1197,  314, 1847, 1686,  419,  616,  835,  495,  963,  881, 1926, 1933, 1076,  563,
                                    157, 1420,  977, 1157,  602,   80, 1572,  198, 1568, 1843, 1935,  667,  660, 1858,  890,  779,   28,  300,  155, 1447,
                                    820,  597, 1476,  559,  331,   13, 1841,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,  330, 1794, 1222,
                                   1190,  692, 1911, 1566,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322,
                                   1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352, 1209,  595,
                                   1321,   14, 1797, 1275,  761,  436, 1813,  510,  708, 1493,  121, 1910,  809,  859,  493, 1254,  401,  254, 1359, 1832,
                                   1006,  451,  252,  824, 1929, 1820, 1177, 1238, 1787, 1795, 1756,  355,   67,  663,  214, 1186, 1295, 1086,  398, 1292,
                                     55,  823, 1881, 1758,   21,   38, 1010, 1596, 1724,  107, 1264, 1337,  333, 1915, 1218 ],
                                 [ undefined, // S16, ZAT 1
                                    930,  169, 1461, 1810, 1430, 1866,  980, 1882,   68, 1923,  873, 1848,  382,   39,  170,  182,  172,   82,  920, 1554,
                                   1526, 1527, 1552, 1662,  483, 1226, 1755,  219,  313, 1659,  327,  693,   51, 1528,  383,  259, 1771, 1802,   41, 1352,
                                   1891,  275,  160,   73,   47,  902, 1197,  314, 1847, 1686,  419,  616,  835,  495,  963,  881, 1926,  563, 1076, 1933,
                                    157, 1420,  977, 1157,   80,  602, 1572,  198, 1568, 1843, 1935,  667,  660, 1858,  779,  890,   28,  300,  155, 1447,
                                    820,  597, 1476,  559,  331,   13, 1841,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,  330, 1794, 1222,
                                   1190,  692, 1911, 1566,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,  322,
                                   1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352, 1209,  595,
                                   1321,   14, 1797, 1275,  761,  436, 1813,  510,  708, 1493,  121, 1910,  809,  859,  493, 1756,  401,  254, 1359, 1832,
                                   1006,  451,  252,  824, 1238, 1820, 1177, 1929, 1787, 1795, 1254,  355,   67,  663,  214, 1186, 1295, 1086,  398, 1292,
                                     55,  823, 1881, 1758,   21,   38, 1010, 1596, 1724,  107, 1264, 1337,  333, 1915 ],
                                 [ undefined, // S15, ZAT 72
                                    930,  169, 1461, 1810, 1430, 1866,  980, 1882,   68, 1923,  873, 1848,  382,   39,  170,  182,  172,   82,  920, 1554,
                                   1526, 1527, 1552, 1662,  483, 1226, 1755,  219,  313, 1659,  327,  693,   51, 1528,  383,  259, 1771, 1802,   41, 1352,
                                   1891,  275,  160,   73,   47,  902, 1197,  314,/#728#/1847, 1686,  419,  616,  835,  495,  963,  881, 1926,  563, 1076,
                                   1933,  157, 1420,  977, 1157,   80,  602, 1572,  198, 1568, 1843, 1935,  667,  660, 1858,  779,  890,   28,  300,  155,
                                   1447,  820,  597, 1476,  559,  331,   13, 1841,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,  330, 1794,
                                   1222, 1190,  692, 1911, 1566,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,  981,  689,
                                    322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352, 1209,
                                    595, 1321,   14, 1797, 1275,  761,  436, 1813,  510,  708, 1493,  121, 1910,  809,  859,  493, 1756,  401,  254, 1359,
                                   1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1929, 1787, 1795, 1254,  355,   67,  663,  214, 1186, 1295, 1086,  398,
                                   1292,   55,  823, 1881, 1758,   21,   38, 1010, 1596, 1724,  107, 1264 ],
                                 [ undefined, // S15, ZAT 71
                                    930,  169,/#190#/1461, 1810, 1430, 1866,  980, 1882,   68, 1923,  873, 1848,  382,   39,  170,  182,  172,   82,  920,
                                   1554, 1526, 1527, 1552, 1662,  483, 1226, 1755,  219,  313, 1659,  327,  693,   51, 1528,  383,  259, 1771, 1802,   41,
                                   1352, 1891,  275,  160,   73,   47,  902, 1197,  314,  728, 1847, 1686,  419,  616,  835,  495,  963,  881, 1926,  563,
                                   1076, 1933,  157, 1420,  977, 1157,   80,  602, 1572,  198, 1568, 1843, 1935,  667,  660, 1858,  779,  890,   28,  300,
                                    155, 1447,  820,  597, 1476,  559,  331,   13, 1841,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,  330,
                                   1794, 1222, 1190,  692, 1911, 1566,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,  981,
                                    689,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,  352,
                                   1209,  595, 1321,   14, 1797, 1275,  761,  436, 1813,  510,  708, 1493,  121, 1910,  809,  859,  493, 1756,  401,  254,
                                   1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1929, 1787, 1795, 1254,  355,   67,  663,  214, 1186, 1295, 1086,
                                    398, 1292,   55,  823, 1881, 1758,   21,   38, 1010, 1596, 1724,  107, 1264 ],
                                 [ undefined, // S15, ZAT 70
                                    190,  169,  930, 1461, 1810, 1430, 1866,  980, 1923, 1848, 1882,  873,   68,  382,   39,  170,  182,  172,   82,  920,
                                   1526, 1554, 1527, 1528, 1662,  483, 1226, 1755,  383,  313, 1352,  327,  693,  51,/#1069#/1552,  219,  160, 1771, 1802,
                                     41, 1659, 1891,  275,  259,  495,   47,  902, 1197,  314,  728, 1847,  881,  419,  616,  835,   73,  963, 1686, 1926,
                                    563, 1076, 1933,  157, 1420,  977, 1157,   13,  602, 1572,  198, 1568, 1843, 1935,  667,  660, 1858,  779,  890,   28,
                                    300,  155, 1447,  820,  597, 1476,  559,  331,   80, 1841,  696,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692, 1911, 1566,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    981,  689,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,
                                    352, 1209,  595, 1321,   14, 1797, 1275,  761,  436, 1813,  510,  708, 1493,  121, 1910, 1787,  859,  493, 1756,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795,  809, 1929, 1254,  355,   67,  663,  214, 1186, 1295,
                                   1086,  398, 1292,   55,  823, 1881, 1758,   21,   38, 1010, 1596, 1724,  107 ],
                                 [ undefined, // S15, ZAT 67 - 69
                                    190,  169,  930, 1461, 1810, 1430, 1866,  980, 1923, 1848, 1882,  873,   68,  920,   39,  182,  170,  172,   82,  382,
                                   1526, 1554, 1069, 1528, 1662,  483, 1226, 1755,  383,   41, 1352,  327,  693,   51, 1527, 1552,  219,  160, 1771, 1802,
                                    313, 1659, 1891,  275,  259,  495,   47,  902, 1197,  314,  728, 1847,  881,  419,  616,  835,   73,  963, 1686, 1926,
                                    563, 1076, 1933,  157, 1420,  977, 1157,   13,  602, 1572,  198, 1568, 1843, 1935,  667,  660, 1858,  779,  300,   28,
                                    890,  155, 1447,  820,  597, 1476,  559,  331,   80,  696, 1841,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692, 1911, 1566,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    981,  689,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,
                                    352, 1209,  595, 1321,   14, 1797, 1275,  761,  436, 1813,  510,  708, 1493,  121, 1910, 1787,  859,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795,  809, 1929, 1254,  355,   67,  663,  214, 1186, 1295,
                                   1086,  398, 1292,   55,  823, 1756, 1758,   21,   38, 1010, 1596, 1724,  107 ],
                                 [ undefined, // S15, ZAT 66
                                    190,  169,  930, 1810, 1461, 1866, 1430,  980, 1923, 1882, 1848,  873,   68,  920,   39,  182,  172,  170,   82,  382,
                                   1526, 1554, 1069, 1528, 1662,  483, 1226, 1755,  383,   41, 1352,  327,  259,   51, 1527, 1552,  219,  160, 1771, 1802,
                                    313, 1659, 1891,  275,  693,  495,   47,  902, 1197,  314,  963,  881, 1847,  419,  616,  835,   73,  728, 1686, 1926,
                                    563, 1076, 1933,  157, 1420,  977, 1157,   13,  602, 1572,  198, 1568, 1843, 1935,  667,  660, 1858,  779,  300,   28,
                                    890,  155, 1447,  820,  597, 1476,  559,  331,   80,  696, 1841,  764, 1825,  137,  582,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692, 1911, 1566,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    981,  689,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  345,  878,  734,
                                    352, 1209,  595, 1321,   14, 1797, 1275,  761,  436, 1813,  510,  708, 1493,  121, 1910, 1787,  859,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795,  809, 1929, 1254,  355,   67,  663,  214, 1186, 1295,
                                   1086,  398, 1292,   55,  823, 1756, 1758,   21,   38, 1010, 1596, 1724,  107 ],
                                 [ undefined, // S15, ZAT 65
                                    190,  169,  930, 1810, 1461, 1866, 1430,  980, 1923, 1882, 1848,  873,   68,  920,   39,  182,  172,  170,   82,  382,
                                   1526, 1554, 1069, 1528, 1662, 1527, 1226, 1755,  383,   41, 1352,  327,  259,   51,  483, 1802,  219, 1197, 1771, 1552,
                                    313, 1659, 1891,  275,  693,  314,   47,  902,  160,  495,  963,  881, 1847,  419,  616,  835,   73,  728, 1686, 1926,
                                    563, 1076, 1933,  157, 1420,  977, 1157,   13,  602, 1572,  198, 1568, 1843, 1935,  667,  660, 1858,  779,  300,   28,
                                    890,  582, 1447,  820,  597, 1476,  559,  331,   80,  696, 1841,  764, 1825,  137,  155,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692, 1911, 1566,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    345,  689,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  981,  878,  734,
                                    352, 1209,  595, 1321,   14, 1797, 1275,  761,  436, 1813,  510,  708, 1493, 1929, 1910, 1787,  859,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795,  809,  121,  107,  355,   67,  663,  214, 1186, 1295,
                                   1086,  398, 1292,   55,  823, 1756, 1758,   21,   38, 1010, 1596, 1724, 1254 ],
                                 [ undefined, // S15, ZAT 64
                                    190,  169,  930, 1810, 1461, 1866, 1430,  980, 1923, 1882, 1848,  873,   68,  920,   39,  182,  172,  170,   82,  382,
                                   1526, 1554, 1069, 1528, 1662, 1527, 1226, 1755,  383,   41, 1352,  327,  259,   51,  483, 1802,  219, 1197, 1771, 1552,
                                    313, 1659, 1891,  275,  693,  314,   47,  902,  160,  495,  963,  881, 1847,  419,  616,  835,   73,  728, 1686, 1926,
                                    563, 1076, 1933,  157, 1420,  977, 1157,   13,  602, 1572,  198, 1568, 1843, 1935,  667,  660, 1858,  779,  300,   28,
                                    890,  582, 1447,  820,  597, 1476,  559,  331,   80,  696, 1841,  764, 1825,  137,  155,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692, 1911, 1566,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    345,  689,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  981,  878,  734,
                                    352, 1209,  595, 1321,   14, 1797, 1275,  761,  436, 1813,  510,  708, 1493, 1929, 1910, 1787,  859,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795,  809,  121,  107,  355,   67,  663,  214, 1186,/#699#/
                                   1295, 1086,  398, 1292,   55,  823, 1756, 1758,   21,   38, 1010, 1596, 1724, 1254 ],
                                 [ undefined, // S15, ZAT 61 - 63
                                    190,  169,  930, 1810, 1461, 1866, 1430,  980, 1923, 1882, 1848,  873,   68,  920,   39,  182,  172,  170,   82,  382,
                                   1526, 1554, 1069, 1528, 1662, 1527, 1226, 1755,  383,   41, 1352,  327,  259,   51,  483, 1802,  219, 1197, 1771, 1552,
                                    313, 1659, 1891,  275,  693,  314,   47,  902,  160,  495,  963,  881, 1847,  419,  616,  835,   73,  728, 1686, 1926,
                                    563, 1076, 1933,  157, 1420,  977, 1157,   13,  602, 1572,  198, 1568, 1843, 1935,  667,  660, 1858,  779,  300,   28,
                                    890,  582, 1447,  820,  597, 1476,  559,  331,   80,  696, 1841,  764, 1825,  137,  155,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692, 1911, 1566,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    345,  689,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  981,  878,  734,
                                    352, 1209,  595, 1321,   14, 1797, 1275,  761,  436, 1813,  510,  708, 1493, 1929, 1910, 1787,  859,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795,  809,  121,  107,  355,   67,  663,  214, 1186,  699,
                                   1295, 1086,  398, 1292,   55,  823, 1756, 1758,/#461#/  21,   38, 1010, 1596, 1724, 1254 ],
                                 [ undefined, // S15, ZAT 60
                                    190,  169,  930, 1810, 1461, 1882, 1430,  920,   39, 1866, 1848,  873, 1526,  980, 1923,  182, 1069,  170,   82,  382,
                                     68, 1554,  172, 1528, 1662, 1527, 1226, 1755,  383, 1891, 1352,  327,  259,   51,  483, 1802,  902, 1197, 1771, 1552,
                                    313, 1659,   41,  275,  693,  314,   47,  219,  160,  495,  963,  881, 1847,  419,  616,  835,   73,  728, 1686, 1926,
                                    563, 1076, 1933,  157, 1420,  977, 1157,   13,  602, 1572,  198, 1568, 1843, 1935,  667,  660, 1858,  779,  300,   28,
                                    890,  582, 1447,  820,  597, 1476,  559,  331,   80,  696, 1841,  764, 1825,  137, 1566,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692, 1911,  155,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    345,  689,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  981,  878,  734,
                                    352, 1209,  595, 1321,   14, 1797, 1275,  761,  436, 1813,  510,  708, 1493, 1929, 1910, 1787,  859,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795, 1254,  121,  107,  355,   67,  663,  214, 1186,  699,
                                   1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756,   21,   38, 1010, 1596, 1724,  809 ],
                                 [ undefined, // S15, ZAT 59
                                    190,  169,  930, 1810, 1461, 1882, 1430,  920,   39, 1866, 1848,  873, 1526,  980, 1923,  182, 1069,  170,   82,  382,
                                     68, 1352,  172, 1528, 1662, 1527, 1226, 1755, 1197, 1891, 1554,  327,  259,   51,  483, 1802,  902,  383, 1771, 1552,
                                    313, 1659,   41,  275,  693,  314,   47,  219,  160,  495,  963,  881, 1847, 1686,  616,  835,   73, 1572,  419, 1926,
                                    563, 1076,  157, 1933, 1420,  977, 1157,   13,  602,  728,  198, 1568, 1843, 1935,  667,  660,  820,  779,  300,   28,
                                   1447,  582,  890, 1858,  597, 1476,  559,  331,   80,  696, 1841,  764, 1825,  137, 1566,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692,  345,  155,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                   1911,  689,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  981,  878,  734,
                                    352, 1209,  595, 1321,   14, 1797, 1275,  761,  436, 1813,  510,  708, 1493, 1929, 1910, 1787,  859,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795, 1254,  121,  107,  355,   67,  663,  214, 1186,  699,
                                   1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756,   21,   38, 1010, 1596, 1724,  809 ],
                                 [ undefined, // S15, ZAT 56 - 58
                                    190, 1810,  930,  169, 1461, 1882, 1430,  920,   39, 1866, 1848,  170, 1069,  980, 1923,  182, 1526,  873,   82,  382,
                                     68, 1352, 1197, 1528, 1662, 1527, 1226, 1802,  172, 1891, 1659,  327,  259,   51,  483, 1755,  902,  383, 1771, 1552,
                                    313, 1554, 1847,  275,  693,  314,   47,  219,  160,  495,  963,  881,   41, 1686,  616,  835,  779, 1572,  419, 1926,
                                    563, 1076,  157, 1568, 1420,  977,   28,   13,  198, 1447,  602, 1933, 1843, 1935,  667,  660,  820,   73,  300, 1157,
                                    728,  582,  890, 1858,  597, 1476,  559,  331,   80,  696, 1841,  764, 1825,  137, 1566,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692,  345,  689,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    761,  155,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  981,  878,  734,
                                    352, 1209,  595, 1321,   14, 1797, 1275, 1911,  436, 1813,  510,  708, 1493, 1929, 1910, 1787,  859,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795, 1254, 1596,  107,  355,   67,  663,  214, 1186,  699,
                                   1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756,   21,   38, 1010,  121, 1724,  809 ],
                                 [ undefined, // S15, ZAT 55
                                    190, 1810,  930,  169, 1461, 1882, 1430,  920,   39, 1866, 1848,  170, 1069,  980, 1923,  182, 1526,  873,   82,  382,
                                     68, 1352, 1197, 1528, 1662, 1527, 1226, 1802,  172, 1891, 1659,  327,  259,   51,  483, 1755,  902,  383, 1771, 1552,
                                    313, 1554, 1847,  275,  693,  314,   47,  219,  160,  495,  963,  881,   41, 1686,  616,  835,  779, 1572,  419, 1926,
                                    563, 1076,  157, 1568, 1420,  977,   28,   13,  198, 1447,  602, 1933, 1843, 1935,  667,  660,  820,   73,  300, 1157,
                                    728,  582,  890, 1858,  597, 1476,  559,  331,   80,  696, 1841,  764, 1825,  137, 1566,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692,  345,  689,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    761,  155,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  981,  878,  734,
                                    352, 1209,  595, 1321,   14, 1797, 1275, 1911,  436, 1813,  510,  708, 1493, 1929, 1910, 1787,  859,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795, 1254, 1596,  107,  355,   67,  663,  214, 1186,  699,
                                   1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756,   21,   38, 1010,  121, 1724,  809 ],
                                 [ undefined, // S15, ZAT 54
                                    190, 1461,  930,  169, 1810, 1882, 1430,  920, 1848, 1866,   39, 1069,  170,  382, 1923, 1527, 1526,  873, 1226,  980,
                                     68, 1352, 1197, 1528, 1662,  182,   82, 1802,  172, 1891, 1659,  327,  259,   51,  483,  902, 1755,  160, 1771, 1552,
                                    313, 1554, 1847,  275,  693,  314,   47,  219,  383,  495,  963,  881,   41,  419,  616,   13,  779, 1572, 1686, 1926,
                                    563, 1076,  157, 1568, 1420,  977,   28,  835,  198, 1447,  602, 1933, 1843, 1935,  667,  660,  820,   73,  300, 1157,
                                   1825,  582,  890, 1858,  597, 1476,  559,  331,   80,  696, 1841,  764,  728,  137, 1566,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692,  345,  689,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    761, 1797,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  981,  878,  734,
                                    352, 1209,  595, 1321,   14,  155, 1275, 1911,  436, 1813,  510,  708, 1493, 1929, 1910, 1787,  859,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795, 1254, 1596,  107,  355,   67,  663,  214, 1186,  699,
                                   1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756,   21,   38, 1010,  121, 1724,  809 ],
                                 [ undefined, // S15, ZAT 53
                                    190, 1461,  930,  169, 1810, 1882, 1430,  920, 1848, 1866,   39, 1069,  170,  382, 1923, 1527, 1526,  873, 1226,  980,
                                     68, 1352, 1197, 1528, 1662,  182,   82, 1802,  172, 1891, 1659,  327,  259,   51,  483,  902, 1755,  160, 1771, 1552,
                                    313, 1554, 1847,  275,  693,  314,   47,  219,  383,  495,  963,  881,   41,  419,  616,   13,  779, 1572, 1686, 1926,
                                    563, 1076,  157, 1568, 1420,  977,   28,  835,  198, 1447,  602, 1933, 1843, 1935,  667,  660,  820,   73,  300, 1157,
                                   1825,  582,  890, 1858,  597, 1476,  559,  331,   80,  696, 1841,  764,  728,  137, 1566,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692,  345,  689,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    761, 1797,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,  981,  878,  734,
                                    352, 1209,  595, 1321,   14,  155, 1275, 1911,  436, 1813,  510,  708, 1493, 1929, 1910, 1787,  859,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795, 1254, 1596,  107,  355,   67,  663,  214, 1186,  699,
                                   1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756,   21,   38, 1010,  121, 1724,  809 ],
                                 [ undefined, // S15, ZAT 52
                                    190, 1461,  930,  169, 1810, 1882, 1430,  920, 1848, 1866,   39, 1069,  170,  382, 1923, 1527, 1526,  873, 1226,  980,
                                     68, 1352, 1197, 1528, 1662,  182,   82, 1802,  172, 1891, 1659,  327,  259,   51,  313,  902, 1755,  160, 1771, 1552,
                                    483, 1554, 1847,  275,  693,  314,   47, 1926,  383,  495,  963,  881,   41,  419,  616,   13,  779, 1572, 1686,  219,
                                    563, 1076,  157, 1568, 1420,  977,   28,  835,  198, 1447,  602, 1933, 1843, 1935,  667,  660,  820,   73,  300, 1157,
                                   1825,  582,  890, 1858,  597, 1476,  559,  331,   80,  696, 1841,  764,  728,  137, 1566,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692,  345,  689,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    761, 1797,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86, 1910,  878,  734,
                                    352, 1209,  595, 1321,   14,  155, 1275,  859,  436, 1813,  510,  708, 1493, 1929,  981, 1787, 1911,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795, 1254, 1596,  107,  355,   67,  663,  214, 1186,  699,
                                   1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756,   21,   38, 1010,  121, 1724,  809/#1303#/ ],
                                 [ undefined, // S15, ZAT 52(old)
                                    190, 1461,  930,  169, 1810, 1882, 1430,  920, 1848, 1866,   39, 1526,  170,  382, 1923, 1527, 1069, 1352,   68,  980,
                                   1226,  873, 1197, 1528, 1662,  182,   82, 1802,  172, 1891, 1659,  327,  259,   51,  313,  902, 1755,  160, 1771, 1552,
                                    483, 1554, 1847,  275,  693,  314,   47, 1926,  383,  495,  963,  881,   41,  419,  616,   13,  779, 1572, 1686,  219,
                                    563, 1076,  157, 1568, 1420,  977,   28,  835,  198, 1447,  602, 1843, 1933, 1935,  667,  660,  820,   73,  300,  764,
                                   1825,  582,  890, 1858,  597, 1476,  559,  331,   80,  696, 1841, 1157,  728,  137, 1566,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692,  345,  689,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    761, 1797,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86, 1910,  878,  734,
                                    352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  510,  708, 1493,  155,  981, 1787, 1911,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795, 1254, 1596,  107,  355,   67,  663,  214, 1186,  699,
                                   1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756,   21,   38, 1010,  121, 1724,  809, 1303 ],
                                 [ undefined, // S15, ZAT 49 - 51
                                    190, 1461,  930,  169, 1810, 1882, 1430,   39, 1848, 1866,  920, 1526,  170,  382, 1923, 1197, 1069, 1352,   68,  980,
                                   1226,  873, 1527, 1528, 1662,  182,   82, 1802,  172, 1891, 1659,  327,  259,   51,  313,  902, 1755,  160, 1771, 1552,
                                    483, 1554,  495,  275,  693,  314,   47, 1926,  383, 1847,  963,  881,   41,  779,  616,   13,  419, 1572, 1686,  820,
                                    563, 1076,  157, 1568, 1420,  977,   28,  835,  198, 1447,  602, 1843, 1933, 1935,  667,  660,  219,   73,  300,  764,
                                   1825,  582,  890, 1858,  597, 1476,  559,  331,   80,  696, 1841, 1157,  345,  137, 1566,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692,  728,  689,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    761, 1797,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86, 1910,  878,  734,
                                    352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  510,  708, 1493,  155,  981, 1787,   21,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795, 1254, 1596,  107,  355,   67,  663,  214, 1186,  699,
                                   1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756, 1911,   38, 1010,  121, 1724,  809, 1303 ],
                                 [ undefined, // S15, ZAT 48
                                    190, 1461,  930, 1882, 1810,  169, 1848,  920, 1430, 1866,   39,  382,  170, 1526, 1923, 1197, 1069, 1352,   68,  980,
                                   1226,  873, 1527, 1528, 1662,  182,   82, 1802,  172, 1891, 1659,  327,  259,   51,  313,  902,  314,  160, 1771, 1552,
                                    483, 1554,  495,  275,  693, 1755,   47, 1926,  419, 1847,  963,  881,   41,  779,  616,   13,  383, 1572, 1686,  820,
                                    563, 1076,  157, 1568, 1420,  977,   28,  300,  198, 1447,  602, 1843, 1933, 1935,  667,  660,  219,   73,  835,  764,
                                   1825,  582,  890, 1858,  597, 1476,  559,  331,   80,  696, 1841, 1157,  345,  137, 1566,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692,  728,  689,  386,  741,   37, 1110, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    761, 1797,  322, 1030,  762,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86, 1910,  878,  734,
                                    352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  510,  708, 1493, 1911, 1596, 1787,   21,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795, 1254,  981,  107,  355,   67,  663,  214, 1186,  699,
                                   1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756,  155,   38, 1010,  121, 1724,  809, 1303 ],
                                 [ undefined, // S15, ZAT 47
                                    190, 1461,  930, 1882, 1810,  169, 1848,  920, 1430, 1866,   39,  382, 1197, 1526, 1923,  170, 1069, 1352,   68,  980,
                                   1226,  873, 1527, 1528, 1662,  182,   82, 1802,  172, 1891, 1659,  327,  259,   51,  313,  902,  314, 1926, 1771, 1552,
                                    483, 1554,  495,  275,  693, 1755,   47,  160,  419, 1847,  963,  881,   41,  779,  616,   13,  383, 1572, 1686,  820,
                                    563, 1076,  157, 1568, 1420,  977,   28,  300,  198, 1447,  667, 1843, 1933, 1935,  602,  660,  219,   73,  835,  764,
                                   1825,  582,  890,  559,  597, 1476, 1858,  331,   80,  696, 1841, 1110,  345,  137, 1566,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692,  762,  689,  386,  741,   37, 1157, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    761, 1797,  322, 1030,  728,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86, 1910,  878,  734,
                                    352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  510,  708, 1493, 1911, 1596, 1787,   21,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795, 1254,  981,  107,  355,   67,  663,  214, 1186,  699,
                                   1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756,  155,   38, 1010,  121, 1724,  809, 1303 ],
                                 [ undefined, // S15, ZAT 46
                                    190, 1461,  930, 1810, 1882,  169, 1848, 1526, 1430, 1923,   39,  382, 1197,  920, 1866,  170, 1662, 1352,   68,  980,
                                   1226,  172, 1659, 1528, 1069,  182,   82, 1802,  873, 1891, 1527,  327,  259,   51,  313,  902,   47, 1926,  616, 1552,
                                    495,  160,  483,  275,   41, 1755,  314, 1554,  419, 1847,  963,  881,  693,  779, 1771,   13,  198, 1572,  660,  820,
                                    563, 1076,  157, 1568, 1420,  977,   28,  300,  383, 1447,  667, 1843, 1933, 1935,  602, 1686,  219,   73,  835,  764,
                                   1825,  582,  890,  559,  597, 1476, 1858,  331,   80,  696, 1841, 1110,  345,  137, 1566,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692,  762,  689,  386,  741,   37, 1157, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    761, 1797,  322, 1030,  728,  224,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86, 1910,  878,  734,
                                    352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  510,  708, 1493, 1911, 1596, 1787,   21,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795, 1254,  981,  107,  355,   67,  663,  214, 1186,  699,
                                   1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756, 1724,   38, 1010,  121,  155,  809 ],
                                 [ undefined, // S15, ZAT 44 - 45
                                    190, 1461,  930, 1810, 1882,  169, 1848, 1526, 1430, 1923,   39,   68, 1197,  920, 1866,  170, 1662, 1352,  382,  980,
                                   1226,  172, 1659, 1528, 1069,  182,   51, 1802,  873, 1891, 1527,  327,  259,   82,  313,  902,   47, 1926,  616, 1552,
                                    495,  160,  483,  275,   41, 1755,  314, 1554,  419, 1847,  963,  881,  693,  779, 1771,   13,  198, 1572,  660,  820,
                                    563, 1076,  157, 1568, 1420,  977,   28,  300,  383, 1447,  667, 1843, 1933, 1935,  602, 1686,  219,   73, 1110,  764,
                                   1825,  582,  890,  559,  597, 1476, 1858,  331,   80,  696, 1841,  835,  345,  137,  762,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692, 1566,  689,  386,  741,   37,  224, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    761, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86, 1910,  878,  734,
                                    352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  510,  708,  728, 1911, 1596, 1787,   21,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795, 1254, 1010,  107,  355,   67,  663,  214, 1186,  699,
                                   1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756, 1724,   38,  981,  121,  155,  809 ],
                                 [ undefined, // S15, ZAT 43
                                    190, 1461,  930, 1810, 1882,  169, 1848, 1526, 1430, 1923,   39,   68, 1197,  920, 1866,  170, 1662, 1352,  382,  980,
                                   1226,  172, 1659, 1528, 1069,  182,   51, 1802,  873, 1891, 1527,  327,  259,   82,  313,  902,   47, 1926,  616, 1552,
                                    495,  160,  483,  275,   41, 1755,  314, 1554,  419, 1847,  963,  881,  693,  779, 1771,   13,  198, 1572,  660,  820,
                                    563, 1076,  157, 1568, 1420,  977,   28,  300,  383, 1447,  667, 1843, 1933, 1935,  602, 1686,  219,   73, 1110,  764,
                                   1825,  582,  890,  559,  597, 1476, 1858,  331,   80,  696, 1841,  835,  345,  137,  762,  346, 1838,  736,  763, 1652,
                                    330, 1794, 1222, 1190,  692, 1566,  689,  386,  741,   37,  224, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,   71,
                                    761, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86, 1910,  878,  734,
                                    352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  510,  708,  728, 1911, 1596, 1787,   21,  493, 1881,  401,
                                    254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177, 1795, 1254, 1010,  107,  355,   67,  663,  214, 1186,  699,
                                   1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756, 1724,   38,  981,  121 ],
                                 [ undefined, // S15, ZAT 42
                                    190, 1461,  930, 1810, 1882, 1430, 1848, 1526,  169, 1923,  382,   68, 1197,  920, 1866,  170, 1662, 1352,   39,  980,
                                   1226,  172, 1527, 1528, 1069,  182,   51, 1802,  873, 1891, 1659,  327,  259,   82,  313,  902, 1771, 1926, 1554, 1552,
                                    495,  160,  483,  275,   41, 1755,  314,  616, 1847,  419,  963,  881,  693,  779,   47,   13,/#778#/ 198, 1572,  660,
                                    820,  563, 1076,  157, 1568, 1420,  977,   28,  300,  383, 1447,  667, 1843, 1935, 1933,  602, 1686,  219,   73, 1110,
                                    764, 1825,  582,  890,  559,  597, 1476, 1858,  331,   80,  696, 1841,  835,  345,  137,  762,  346, 1838,  736,  763,
                                   1652,  330, 1794, 1222, 1190,  692, 1566,  689,  386,  741,   37,  224, 1548,  545,  569, 1168, 1821, 1668,  132, 1096,
                                     71,  761, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86, 1910,  878,
                                    734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  510,  708, 1795, 1911, 1596, 1787,   21,  493, 1881,
                                    401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177,  728, 1724, 1010,  107,  355,   67,  663,  214, 1186,
                                    699, 1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756, 1254,   38,  981 ],
                                 [ undefined, // S15, ZAT 41
                                    190, 1461,  930, 1810, 1882, 1430, 1848, 1526,  169, 1197,  382,   68, 1923,  920, 1866,  170, 1662, 1352,   39,  980,
                                   1226,  873, 1527, 1528, 1069,  182,   51, 1802,  172, 1891, 1659,  327,  259,   82,  313,  902, 1771, 1926, 1554, 1552,
                                   1755,  160,  483,  275,   41,  495,  314,  616, 1847,  419,  963,  881,  693,  779,   47,   13,  778,  198, 1572,  660,
                                    820,  563, 1076,  157, 1568, 1420,  977,   28,  300,  383, 1447,  667, 1843, 1935, 1933,  602, 1110,  219,   73, 1686,
                                    764, 1825,  582,  890,  559,  597, 1476, 1858,  331,   80,  696,  224, 1096,  345,  137,  762,  346, 1838,  736,  763,
                                   1652,  330, 1794, 1222, 1190,  692, 1566,  689,  386,  741,   37, 1841, 1548,  545,  569, 1168, 1821, 1668,  132,  835,
                                     71,  761, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86, 1910,  878,
                                    734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  510,  708, 1795, 1911, 1596, 1787,   21,  493, 1881,
                                    401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177,  728, 1724, 1010,  107,  355,   67,  663,  214, 1186,
                                    699, 1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756, 1254,   38 ],
                                 [ undefined, // S15, ZAT 40
                                    930, 1882,  190, 1810, 1461, 1430, 1848, 1526,  169, 1197,  382,   68, 1923,  920, 1866,  170, 1662, 1352,   39,  980,
                                   1226,  873, 1527, 1528, 1069,  182,   51, 1802,  172,  259, 1659,  327, 1891,   82,  313,  902, 1771, 1926,  495, 1552,
                                   1755,  160,  483,  275,   41, 1554,  314,  198, 1847,  419,  963,  881,  693,  779,   47,   13,  778,  616, 1572,  660,
                                    820,  563, 1076,  157, 1568, 1420,  977,   28,  300,  383, 1447,  667, 1843, 1935, 1933,  602, 1110,/#1164#/219,   73,
                                   1686,  764, 1825,  582,  890,  559,  597, 1476, 1858,  331,   80,  696,  224, 1096,  345,  137,  762,  346, 1838,  736,
                                    763, 1652,  330, 1794, 1222, 1190,  692, 1566,  689,  386,  741,   37, 1841, 1548,  545,  569, 1168, 1821, 1668,  132,
                                    835,   71,  761, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86, 1910,
                                    878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  510,  708, 1795, 1911, 1596, 1787,   21,  493,
                                   1881,  401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177,   38, 1724, 1010,  107,  355,   67,  663,  214,
                                   1186,  699, 1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756, 1254,  728 ],
                                 [ undefined, // S15, ZAT 39
                                    930, 1882,  190, 1810, 1461, 1430, 1848, 1526,  169, 1197,  382,  170, 1923,  920, 1866,   68, 1662, 1352,   39,  980,
                                    873, 1226, 1527, 1528, 1802,  182,   51, 1069,  172,  259, 1659,  327, 1891, 1755,  313,  902, 1771, 1926,  495, 1552,
                                     82,  160,  483,  275,   41, 1554,  314,  198,  778,  419,  963,  881,  693,  779,   47,   13, 1847,  616, 1572,  660,
                                    820,  563, 1076,  157, 1568, 1420,  977,   28,  300,  383, 1447,  667, 1843, 1935, 1933, 1164, 1110,  602,  696,  224,
                                   1686,  764, 1825,  582,  890,  559,  597, 1476, 1858,  331,   80,  219,   73, 1096,  345,  137,  762,  346, 1838,  736,
                                    763, 1652,  330, 1794, 1222, 1190,  692, 1566,  689,  386,  741,   37, 1841, 1548,  545,  569, 1168, 1821, 1668,  132,
                                    510,   71,  761, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86, 1910,
                                    878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  835,  708, 1795, 1911, 1596, 1787,   21,  493,
                                   1881,  401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177,   38,1724,/#1790#/1010,  107,  355,   67,  663,
                                    214, 1186,  699, 1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756, 1254,  728 ],
                                 [ undefined, // S15, ZAT 37 - 38
                                    930, 1882,  190, 1810, 1461, 1430, 1848, 1526,  169, 1197,  382,  170, 1923,  920, 1866,   68, 1662, 1352,   39,  980,
                                    873, 1226, 1527, 1528, 1802,  182,   51, 1069,  172,  259, 1659,  327, 1891, 1755,  313,  902, 1771, 1926,  495, 1552,
                                     82,  160,  483,  275,   41, 1554,  314,  198,  778,  419,  963,  881,  693,  779,   47,   13, 1847,  616, 1572,  660,
                                    820,  563, 1076,  157, 1568, 1420,  977,   28,  300,  383, 1447,  667, 1843, 1935, 1933, 1164, 1110,  602,  696,  224,
                                   1686,  764, 1825,  582,  890,  559,  597, 1476, 1858,  331,   80,  219,   73, 1096,  345,  137,  762,  346, 1838,  736,
                                    763, 1652,  330, 1794, 1222, 1190,  692, 1566,  689,  386,  741,   37, 1841, 1548,  545,  569, 1168, 1821, 1668,  132,
                                    510,   71,  761, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86, 1910,
                                    878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  835,  708, 1795, 1911, 1596, 1787,   21,  493,
                                   1881,  401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177,   38, 1724, 1790, 1010,  107,  355,   67,  663,
                                    214, 1186,  699, 1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756 ],
                                 [ undefined, // S15, ZAT 36
                                    930, 1882, 1461, 1810,  190, 1430,  920, 1526, 1923, 1197,  382,  980,  169, 1848, 1866,   68, 1662, 1352,   39,  170,
                                    873, 1226, 1527,  259, 1802,  182,   51, 1069,  172, 1528, 1659,  327,  483, 1755,  313,  902,  419, 1926,  495, 1552,
                                     82,  160, 1891,  275,   41, 1847,  314,  198,  778, 1771,  963,  881,  693,  779,   47,   13, 1554,  616, 1572,  660,
                                    820,  563, 1076,  157, 1568, 1420,  977,   28,  300,  383, 1447,  667, 1843, 1935, 1933, 1164, 1110,  602,  696,/#1323#/
                                    224, 1686,  764, 1825,  582,  890,  559,  597, 1476, 1858,  331,   80,  219,   73, 1096,  345,  137,  762,  346, 1838,
                                    736,  763, 1652,  330, 1794, 1222, 1190,  692, 1566,  689,  386,  741,   37, 1841, 1548,  545,  569, 1168, 1821, 1668,
                                    132,  510,   71,  761, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,
                                   1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  835,  708, 1795, 1911, 1596, 1787,   21,
                                    493, 1881,  401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1820, 1177,   38, 1724, 1790, 1010,  107,  355,   67,
                                    663,  214, 1186,  699, 1295, 1086,  398, 1292,   55,  823,  461, 1758, 1756 ],
                                 [ undefined, // S15, ZAT 35
                                    930, 1882, 1461, 1810,  190, 1430,  920, 1197, 1923, 1526,  382,  980,  169, 1848, 1866,   68, 1662, 1352,   51,  170,
                                    873, 1226, 1527,  259, 1802,  182,   39, 1755,  172, 1528, 1659,  327,  483, 1069,  313,  902,  419, 1926, 1552,  495,
                                     82,  160, 1891,  275,  314, 1847,   41,  198,  778, 1771,  963,  881,  693,  779,   47,   13, 1554,  820, 1572,  660,
                                    616,  563, 1076,  157, 1568, 1420,  977,   28,  300, 1323, 1447,  667, 1843, 1935, 1933, 1164, 1110,  602,  696,  383,
                                    224, 1838,  764, 1825,  582,  890,  559,  597, 1476, 1858,  331,   80, 1668, 1222, 1096,  345,  137,  762,  346, 1686,
                                    736,  763, 1652,  330, 1794,   73, 1190,  692, 1566,  689,  386,  741,   37, 1841, 1548,  545,  569, 1168, 1821,  219,
                                    132,  510,   71,  761, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,
                                   1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  835,  708, 1795, 1820, 1596, 1787,   21,
                                    493, 1881,  401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1911, 1177,   38, 1724, 1756, 1010,  107,  355,   67,
                                    663,  214, 1186,  699, 1295, 1086,  398, 1292,   55,  823,/#637#/ 461, 1758, 1790 ],
                                 [ undefined, // S15, ZAT 34
                                   1882,  930, 1461, 1810,  190, 1430,  920, 1197,  980, 1526,  382, 1923,  169, 1848, 1866,   68, 1662, 1352,   51,  170,
                                    873, 1226, 1527,  259, 1802,  182,   39, 1755,  172, 1891, 1659,  327,  483, 1069,  313,  495,  419, 1926, 1771,  902,
                                     82,  160, 1528,  275,  314, 1847,   41,  198,  778, 1552,  963,  881,  693,  779,   47,   13, 1554,  820, 1572,  660,
                                    616,  563, 1076,  157, 1568, 1420,  977,   28,  300, 1323, 1447,  667, 1843, 1935, 1933, 1164, 1110,  602,  696,  383,
                                    224, 1838,  764, 1825,  582,  890,  559,  597, 1476, 1858,  331,   80, 1668, 1222, 1096,  345,  137,  762,  346, 1686,
                                    736,  763, 1652,  330, 1794,   73, 1190,  692, 1566,  689,  386,  741,   37, 1841, 1548,  545,  569, 1168, 1821,  219,
                                    132,  510,   71,  761, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,
                                   1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  835,  708, 1795, 1820, 1596, 1787,   21,
                                    493, 1881,  401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1911, 1177,   38, 1724, 1756, 1086,  107,  355,   67,
                                    663,  214, 1186,  699, 1295, 1010,  398, 1292,   55,  823,  637,  461, 1758, 1790 ],
                                 [ undefined, // S15, ZAT 33
                                   1882,  930, 1461, 1197,  190, 1430,  920, 1810,  980, 1526,  382, 1923,  169, 1848, 1866,   68, 1662, 1352,   51,  873,
                                    170, 1659, 1527,  259, 1802,  182,   39, 1755,  172, 1891, 1226,  327, 1926, 1069,  313,  495,   41,  483, 1771,  902,
                                    779,  160, 1528,  275,  314,  778,  419,  198, 1847, 1552,  963,  881,  693,   82,   47,   13, 1554,  820, 1572,  660,
                                    300,  563, 1076,  157, 1568, 1420,  977,   28,  616, 1323, 1447,  667, 1843, 1935, 1933, 1164, 1110,  602,  696, 1794,
                                    224, 1838,  764, 1825,  582,  890,  559,  597, 1476, 1858,  331,   80, 1668, 1222, 1096,  345,  137,  762,  346, 1686,
                                    736,  763, 1652,  330,  383,  132, 1190,  692,  761,  689,  386,  741,   37, 1841, 1548,  545,  569, 1168, 1821,  219,
                                     73,  510,   71, 1566, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1818,   25, 1822, 1152,   86,
                                   1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  835,  708, 1795, 1820, 1596, 1787,   21,
                                    493, 1881,  401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1911, 1177,   38, 1724, 1756, 1086,  107,  355,   67,
                                    663,  214, 1186,  699, 1295, 1010,  398, 1292,   55,  823,  637,  461, 1758 ],
                                 [ undefined, // S15, ZAT 32
                                    930, 1882, 1461, 1197,  190, 1430,  920, 1810,  980, 1526,  382, 1923,  169, 1848, 1662,   68, 1866, 1352,   51,  873,
                                    170, 1659, 1527,  259, 1802,  182,   39, 1755,  483, 1891, 1226,  327, 1926, 1069,  313,  495,   41,  172, 1847,  902,
                                    779,  160, 1528,  275,  314, 1568,  419,  198, 1771, 1552,  963,  881,  693,   82,   47,   13, 1554,  820, 1572,  660,
                                    300,  563, 1076,  157,  778, 1420,  977,   28,  616, 1323, 1447,  667, 1843, 1935, 1933, 1164, 1110,  602,  696, 1794,
                                    224, 1838,  764, 1825,  582,  890,  559,  597, 1476, 1858,  331,   80, 1668, 1222, 1096,  345,  137,  762,  346, 1190,
                                    736,  763, 1652,  330,  383,  132, 1686,  692,  761,  689,  386,  741,   37, 1841, 1548,  545,  569, 1168, 1821,  219,
                                     73,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1818, 1566, 1822, 1152,   86,
                                   1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  835,  708, 1795, 1820, 1596, 1787,   21,
                                    493, 1881,  401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1911, 1177,   38, 1724, 1756, 1086,  107,  355,   67,
                                    663,  214, 1186,  699, 1295, 1292,  398, 1010,   55,  823,  637,  461, 1758 ],
                                 [ undefined, // S15, ZAT 31
                                    930, 1882, 1461, 1197,  190, 1430,  920, 1810,  980, 1526,  382, 1923,  170, 1848, 1662,   68, 1866, 1352,   51,  873,
                                    169, 1659, 1527,  259, 1802,  182,   39, 1069,  483, 1891, 1226,  327, 1926, 1755,  313, 1528,   41,  172, 1847,  902,
                                    779,  160,  495,  275,  314, 1568,  419,  198, 1771, 1552,  963,  881,  693,   82,   47,   13, 1554,  820, 1572,  660,
                                    300,  563, 1076,  157,  778, 1420,  977,   28, 1110, 1323, 1447,  667, 1843, 1935, 1933, 1164,  616, 1794,  696,  602,
                                    224, 1838,  764, 1825,  582,  890,  559,  597, 1476, 1668,  331,   80, 1858, 1222, 1096,  345,  137,  762,  346, 1190,
                                    736,  763, 1652,  330,  383,  132, 1686,  692,  761,  689,  386,  741,   37, 1841, 1548,  545,  569, 1168, 1821,  219,
                                     73,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1818, 1566, 1822, 1152,   86,
                                   1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  835,  708, 1795, 1820, 1596, 1787,   21,
                                    493, 1881,  401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1911, 1177,   38, 1724, 1756, 1086,  107,  355,   67,
                                    663,  214, 1186,  699, 1295, 1292,  398, 1010,   55,  823,  637,  461, 1758 ],
                                 [ undefined, // S15, ZAT 30
                                    930, 1882, 1461, 1197,  190, 1430,  920, 1810,  980, 1526,  382, 1923, 1866, 1848, 1662,   68,  170,  259, 1069,  182,
                                    169, 1659, 1528, 1352, 1802,  873,   39,   51,  483, 1891, 1226,  160, 1926, 1755,  313, 1527,   41,  172, 1847,  902,
                                    779,  327,  495, 1552,  314, 1568,  419,  198, 1771,  275,  963,  881,  693,   82,   47,   13, 1554,  616, 1572,  660,
                                    300,  563, 1076,  157,  778, 1420,  977,   28, 1110, 1323, 1447,  667, 1843, 1935, 1933, 1164,  820, 1794,  696,  602,
                                    224, 1838,  764, 1825,  582,  890,  559,  597, 1476, 1668,  331,   80, 1858, 1222, 1096,  345,  137,  762,  346, 1190,
                                    736,  763, 1652,  330,  383,  132, 1818,  692,  761,  689,  386,  741,   37, 1841, 1548,  545,  569, 1168, 1821,  219,
                                     73,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1686, 1596, 1822, 1152,   86,
                                   1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  835,  708, 1795, 1820, 1566, 1787,   21,
                                    493, 1881,  401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1911, 1177,   38, 1724, 1756, 1086,  107,  355,   67,
                                    663,  214, 1186,  699, 1295, 1292,  398, 1010,   55,  823,  637,  461, 1758 ],
                                 [ undefined, // S15, ZAT 29
                                    930, 1882, 1461, 1197,  190, 1430,  920, 1810,  980, 1526,  382, 1923, 1866, 1848, 1662,   68,  170,  259, 1069,  182,
                                    169, 1659, 1528, 1352, 1802,  873,   39,   51,  313, 1891, 1226,  160, 1926, 1755,  483, 1527,   41,  172,  779,  902,
                                   1847,  327, 1568, 1552,  314,  495,  778,  198, 1771,  275,  963,  881,  693, 1554,   47,  977,   82,  616, 1572,  660,
                                    300,  563, 1076,  157,  419, 1420,   13,   28, 1110, 1323, 1447,  667, 1843, 1935, 1164, 1933,  820, 1794,  696,  602,
                                    224, 1838,  764, 1825,  582,  890,  559,  597, 1476, 1668,  331,   80, 1858, 1222, 1096,  345,  137,  762,  346, 1190,
                                    736,  763, 1652,  330,  383,  132, 1818,  692,  761,  689,  386,  741,   37, 1841, 1548,  545,  569, 1168, 1821,  219,
                                     73,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1686, 1596, 1822, 1152,   86,
                                   1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  835,  708, 1795, 1820, 1566, 1787,   21,
                                    493, 1881,  401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1911, 1177,   38, 1724, 1756, 1086,  107,  355,   67,
                                    663,  214, 1186,  699, 1295, 1292,  398, 1010,   55,  823,  637,  461, 1758 ],
                                 [ undefined, // S15, ZAT 28
                                   1882,  930, 1461, 1197, 1526, 1430,  920, 1810,  980,  190,  382, 1923, 1866, 1848, 1662,   68,  170,  259, 1069,  182,
                                    169, 1659, 1528, 1226, 1802,  873,  483,   51,  313, 1891, 1352,  160, 1926, 1755,   39, 1527,   41,  172,  779,  902,
                                   1847,  327, 1568, 1552,  314,  495,  778,  198, 1771,  275,  963,  881,  693, 1554,   47,   13,   82,  616, 1572,  660,
                                    300,  563, 1076,  157,  419, 1420,  977,   28, 1110, 1323, 1447,  667, 1843, 1935, 1164, 1933,  820, 1794,  696,  602,
                                    224, 1838,  764, 1825,  582,  890,  559,  597, 1476, 1668,  331,   80, 1858, 1222, 1096,  345,  137,  762,  346, 1190,
                                    736,  763, 1652,  330,  383,  132, 1818,  692,  761,  689,  386,  741,   37, 1841, 1548,  545,  569, 1168, 1821,  219,
                                     73,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1822, 1596, 1686, 1152,   86,
                                   1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436, 1813,  835,  708, 1795, 1820, 1186, 1787,   21,
                                    493, 1881,  401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1911, 1177,   38, 1724, 1756, 1086,  107,  355,   67,
                                    663,  214, 1566,  699, 1295, 1292,  398, 1010,   55,  823,  637,  461, 1758 ],
                                 [ undefined, // S15, ZAT 26 - 27
                                   1882,  930, 1461, 1197, 1526, 1430,  920, 1810,  980,  190,  382, 1923, 1866, 1848, 1662,   68,  170,  259, 1069,  182,
                                    169, 1659, 1528, 1226, 1802,  873,  483,   51,  313, 1891, 1352,  160,  779, 1755,   39, 1527,   41,  172, 1926,  902,
                                    778,  327, 1568, 1552,  314,  300, 1847,  198, 1771,  275,  963,  881,  693, 1554,   47,   13,   82,  616, 1572,  660,
                                    495,  563, 1076,  157, 1110, 1420,  977,   28,  419, 1323, 1447,  667, 1843, 1935, 1164,  224,  820, 1794,  696,  602,
                                   1933, 1838,  764, 1825,  582,  890,  559,  597, 1476, 1668,  331,  132, 1858, 1222, 1096,  345,  137,  762,  346, 1190,
                                    736,  763, 1652,  330,  383,   80, 1818,  692,  761,  689,  386,  741,   37, 1548, 1841,  545,  569, 1168, 1821,  219,
                                   1813,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1822, 1596, 1686, 1152,   86,
                                   1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436,   73,  835,  708, 1795, 1820, 1186, 1787,   21,
                                    493, 1881,  401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1758, 1177,   38, 1724, 1756, 1086,  107,  355,   67,
                                    663,  214, 1566,  699, 1295, 1292,  398, 1010,   55,  823,  637,  461, 1911 ],
                                 [ undefined, // S15, ZAT 25
                                   1882,  930, 1461, 1197, 1526, 1430,  920, 1810,  980,  190,  382, 1923, 1866, 1848, 1662,   68,  170,  259, 1069,  182,
                                    169, 1659, 1528, 1226, 1802,  873,  483,   51,  313, 1891, 1352,  160,  779, 1755,   39, 1527,   41,  172, 1926,  902,
                                    778,  327, 1568, 1552,  314,  300, 1847,  198, 1771,  275,  963,  881,  693, 1554,   47,   13,   82,  616, 1572,  660,
                                    495,  563, 1076,  157, 1110, 1420,  977,   28,  419, 1323, 1447,  667, 1843, 1935, 1164,  224,  820, 1794,  696,  602,
                                   1933, 1838,  764, 1825,  582,  890,  559,  597, 1476, 1668,  331,  132, 1858, 1222, 1096,  345,  137,  762,  346, 1190,
                                    736,  763, 1652,  330,  383,   80, 1818,  692,  761,  689,  386,  741,   37, 1548, 1841,  545,  569, 1168, 1821,  219,
                                   1813,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1822, 1596, 1686, 1152,   86,
                                   1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436,   73,  835,  708, 1795, 1820, 1186, 1787,   21,
                                    493, 1881,  401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1758, 1177,   38, 1724, 1756, 1086,  107,  355,   67,
                                    663,  214, 1566,  699, 1295, 1292,  398, 1010,   55,  823,  637,  461 ],
                                 [ undefined, // S15, ZAT 24
                                    930, 1882, 1461, 1197,  190, 1430, 1866, 1810,  980, 1526,   68,  259,  920, 1848, 1662,  382,  170, 1923, 1069,  182,
                                    169, 1659, 1528, 1226, 1802,  873,  483,   51,  313,  172, 1352,/#121#/ 160,  779, 1755,   39, 1527,   41, 1891, 1926,
                                    902,  778,  327, 1568, 1847,  495,  300, 1552,  563, 1771,  275,  963,  881,  693, 1554,   47,   13,   82,  616, 1572,
                                    660,  314,  198, 1076,  157, 1110, 1420,  602,   28,  419, 1323, 1447,  667, 1843, 1935, 1164,  224,  820, 1794,  696,
                                    977, 1933, 1838,  764, 1825,  582,  890,  559,  597, 1476, 1668,  331,  132, 1858, 1222, 1096,  345,  137, 1841,  346,
                                   1190,  736,  763, 1652,  330,  383,   80, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545,  569, 1168, 1821,
                                    219, 1813,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  836, 1822, 1596, 1686, 1152,
                                     86, 1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  859,  436,   73,  835,  708, 1795, 1820, 1186, 1787,
                                     21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  252,  824, 1238, 1758, 1177,   38, 1724, 1756, 1086,  107,  355,
                                     67,  663,  214, 1566,  699, 1295, 1292,  398, 1010,   55,  823,  637,  461 ],
                                 [ undefined, // S15, ZAT 23
                                    930, 1882, 1461, 1197,  190, 1430, 1866, 1810,  980, 1526,   68,  259,  920,  169, 1662,  382, 1659, 1923, 1069, 182,
                                   1848,  170, 1528,  779, 1802,  873,  483,   51, 1527,  172, 1352,  121,  160, 1226, 1755,   39,  313, 1771, 1891, 1554,
                                    902,  778,  327, 1568, 1847,  495,  300, 1552,  563,   41,  275,  963,  881,  693, 1926,   47,   13,   82,  616, 1572,
                                    660,  314,  198, 1076,  157, 1110, 1420,  602,   28,  419, 1323, 1447,  667, 1843, 1935, 1164,  224,  820, 1794,  696,
                                    977, 1933, 1838,  764, 1825,  582,  890,  559,  597, 1476, 1668,  331,  132, 1858, 1222, 1096,  345,  137, 1841,  346,
                                   1190,  736,  763, 1652,  330, 1813,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545,  569, 1168, 1821,
                                    859,  383,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,   80, 1822, 1596, 1686, 1152,
                                     86, 1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  219,  436,  699, 1238,  708, 1795, 1820, 1186, 1787,
                                     21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  252,  824,  835, 1758, 1177,   38, 1724, 1756, 1086,  107,  355,
                                     67,  663,  214, 1566,   73, 1295, 1292,  398, 1010,   55,  823,  637,  461 ],
                                 [ undefined, // S15, ZAT 22
                                    930, 1882, 1430, 1197,  190, 1461, 1866, 1810,  980, 1526,   68, 1923,  920,  169, 1662,  382, 1659,  259, 1069,  182,
                                   1848,  170, 1528,  779, 1802,  873,  483,  160, 1527,  172, 1891,  121,   51, 1226, 1755,   39,  313, 1771, 1352, 1554,
                                    902,  778,  327, 1568, 1847,  495,  300,/#754#/1552,  563,   41,  275,  963,  881,  693, 1926,   47,   13,   82,  616,
                                   1572,  660,  314,  198, 1076,  157, 1110, 1420,  419,   28,  602, 1323, 1447,  667, 1843, 1935, 1164,  224,  820, 1794,
                                    696,  977, 1933, 1838,  764, 1825,  582,  890,  559,  597, 1476, 1668,  331,  132, 1858, 1222, 1096,  345,  137, 1841,
                                    346, 1190,  736,  763, 1652,  330, 1813,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545,  569, 1168,
                                   1821,  859, 1686,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  252, 1822, 1596,  383,
                                   1152,   86, 1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  219,  436,  699, 1238,  708, 1795, 1820, 1186,
                                   1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,   80,  824,  461, 1758, 1177,   38, 1724, 1756, 1086,  107,
                                    355,   67,  663,  214, 1566,   73, 1295, 1292,  398, 1010,   55,  823,  637,  835 ],
                                 [ undefined, // S15, ZAT 21
                                    930, 1882, 1430, 1197,  190, 1461, 1866, 1810,  980, 1526,   68, 1923,  920,  169, 1659,  382, 1662,  259, 1069,  182,
                                   1848,  170, 1527,  779, 1802, 1755,  483,  160, 1528, 1771, 1891,  121,   51, 1226,  873,   39,  495,  172, 1352, 1554,
                                    902,  778,  327, 1568, 1847,  313,  300,  754, 1552,  563,  616,  275,  963,  881,  693, 1926,   47,   13,   82,   41,
                                   1572,  660,  314,  198, 1076,  157, 1110, 1420,  419,   28,  602, 1323, 1447,  667, 1843, 1935, 1164,  224, 1668, 1794,
                                    696,  977, 1838, 1933,  764, 1825,  582,  559,  890,  597, 1476,  820,  331,  132, 1858, 1222, 1096,  345,  137, 1841,
                                    346, 1190,  736,  763, 1652,  330, 1813,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545,  569, 1168,
                                   1821,  859, 1686,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  252, 1822, 1596,  383,
                                   1152,   86, 1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  219,  436,  699, 1238,  708, 1795, 1820, 1186,
                                   1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,   80,  824,  461, 1758, 1177,   38, 1724, 1756, 1086,  107,
                                    355,   67,  663,  214, 1566,   73, 1295, 1292,  398, 1010,   55,  823,  637,  835 ],
                                 [ undefined, // S15, ZAT 20
                                    930, 1882, 1430, 1197, 1461,  190, 1866,   68, 1526,  980, 1810, 1659,  920,  169, 1923,  382, 1662,  259, 1069,  182,
                                   1848,  170, 1527,  779, 1802, 1755,  483,  160, 1528, 1771,  495,  121,   51, 1226,  873,   39, 1891,  172, 1352,  693,
                                    902,  778,  327, 1568, 1847,  313,  754,  300, 1552,  563,  616,  275,  963,  881, 1554, 1926,   47,   13,   82,   41,
                                   1572,  660,  314,  198, 1076,  157, 1110, 1420,  419,   28,  602, 1323, 1447,  667, 1843, 1935, 1164,  224, 1668, 1794,
                                    696,  977, 1838, 1933,  764, 1825,  582,  559,  597,  890, 1476,  820,  331,  132,  345, 1222, 1096, 1858,  137, 1841,
                                    346, 1190,  736,  763, 1652,  330, 1813,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545,  569, 1168,
                                   1821,  859, 1686,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  252, 1822, 1596,  383,
                                   1152,   86, 1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  219,  436,  699, 1238,  708, 1795, 1820, 1186,
                                   1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,   80,  824,  461, 1758, 1177,   38, 1724, 1756, 1086,  107,
                                    355,   67,  663,  214, 1566,   73, 1295, 1292,  398, 1010,   55,  823 ],
                                 [ undefined, // S15, ZAT 19
                                    930, 1882, 1430, 1197, 1461,  190, 1866,   68, 1526,  980, 1810, 1659,  920,  169, 1923,  382, 1662,  259,  483,  182,
                                   1848,  170, 1527,  779, 1802, 1755, 1069,  160, 1528, 1771,  495,  121,   51, 1226,  873,   39, 1891,  172, 1352,  693,
                                    902,  778,  327, 1568, 1847,  313,  754,  300, 1572,  563,  616,  275,  963,  881, 1554, 1926,   47,   13,   82,   41,
                                   1552,  660,  314,  419, 1076,  157, 1110, 1420,  198,   28,  602, 1323, 1447,  667, 1843, 1935, 1164,  224,  331, 1794,
                                    696,  977, 1838, 1933,  764, 1825,  582,  559,  597,  890, 1476,  820, 1668,  132,  345, 1222, 1096, 1858,  137, 1841,
                                    346, 1190,  736,  763, 1652,  330, 1813,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545,  569, 1168,
                                   1821,  859, 1686,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  252, 1822, 1596,  383,
                                   1152,   86, 1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  219,  436,  699, 1238,   67, 1795, 1820, 1186,
                                   1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,   80,  824,  461, 1758, 1177,   38, 1724, 1756, 1086,  107,
                                    355,  708,  663,  214, 1566,   73, 1295, 1292,  398, 1010,   55,  823 ],
                                 [ undefined, // S15, ZAT 18
                                    930, 1882, 1430, 1197,  980,  190, 1866,  920, 1659, 1461, 1810, 1526,   68,  169, 1848, 1069, 1662,  483,  259,  182,
                                   1923, 1802, 1527,  779,  170, 1755,  382,  160, 1528,  693,  495,  121,   51, 1226,  873,   39,  172, 1891, 1352, 1771,
                                    902,  778,  327, 1568, 1847,  313,  754,  300, 1572,  563,  616,  275,  963,  881, 1554,  198, 1935,   13,   82,   41,
                                   1552,  660,  314,  419, 1076,  157, 1110, 1420, 1926,   28,  602, 1323, 1447,  667, 1843,   47, 1164,  224,  331, 1794,
                                    696,  977, 1838, 1933,  764, 1825,  582,  559,  597,  890, 1476,  820, 1668,  132,  345, 1222, 1096, 1858,  137, 1841,
                                    346, 1190,  736,  763, 1652,  330, 1813,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545,  569, 1168,
                                   1821,  859, 1686,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  252, 1822, 1596,  383,
                                   1152,   86, 1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,  219,  436,  699, 1238,   67, 1795, 1820, 1186,
                                   1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,   80,  824,  461, 1758, 1177,   38, 1724, 1756, 1086,  107,
                                    355,  708,  663,  214, 1566,   73, 1295, 1292,  398, 1010,   55,  823 ],
                                 [ undefined, // S15, ZAT 17
                                    930, 1882, 1430, 1197,  980,  190, 1866,  920, 1659, 1461, 1810, 1526,   68,  169, 1848, 1069, 1662,  483,  259,  182,
                                   1923, 1802, 1527,  779,  170, 1755,  382,  160, 1528,  693,   51,  121,  495, 1226,  778,   39,  172, 1891, 1352, 1771,
                                    902,  873,  327, 1568, 1847,  313,  754,  419, 1554,  563,  616,  275,  963,  881, 1572,  198, 1935,   13,   82,  667,
                                   1552,  660,  314,  300, 1076,  157, 1110, 1420, 1926,   28,  602, 1323, 1447,   41, 1843,   47, 1164,  224,  331, 1794,
                                    696,  977, 1838, 1190,  764, 1825,  582,  559,  597,  890, 1476,  820, 1668,  132,  345, 1222, 1096, 1858,  137,  346,
                                   1841, 1933,  736,  763, 1652,  330, 1813,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545,  569, 1168,
                                   1821,  859, 1686,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524,  394,  252, 1822, 1596, 1820,
                                   1152,   86, 1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,   80,  436,  699, 1238,   67, 1795,  383, 1186,
                                   1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  219,  824,  461, 1758, 1177,   38, 1724, 1756, 1086,  107,
                                    355,  708,  663,  214, 1566,   73, 1295, 1292,  398, 1010,   55,  823 ],
                                 [ undefined, // S15, ZAT 16
                                    930, 1882, 1430, 1197,  980, 1461, 1526, 1810, 1659,  190,  920, 1866,   68,  483, 1662, 1069, 1848,  169,  259,  182,
                                   1923, 1802, 1528,  779,  170,  693,  160,  382, 1527, 1755,   51,  121,  495, 1226,  778,   39,  172, 1891, 1352, 1771,
                                    902,  873,  327, 1568, 1847,  777,  198,  754,  419, 1554,  563,  616,  275,  963,  881, 1572,  313, 1935,   13,   82,
                                    667, 1552,  660,  314,  300, 1076,  157, 1110, 1420, 1926,   28,  602, 1323, 1447,   41, 1843,   47, 1164,  224,  331,
                                   1794,  696,  977, 1838, 1190,  764, 1825,  582,  559,  597,  890, 1476,  820, 1668,  132,  345, 1222, 1096, 1858,  137,
                                    346, 1841, 1933,  736,  763, 1652,  330, 1813,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545,  569,
                                   1168, 1821,  859,  394,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524, 1686,  252, 1822, 1596,
                                   1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,   80,  436,  699, 1238,   67, 1795,  383,
                                   1186, 1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  219,  824,  461, 1758, 1177,   38, 1724, 1756, 1086,
                                    107,  355,  708,  663,  214, 1566,   73, 1295, 1292,  398, 1010,   55,  823 ],
                                 [ undefined, // S15, ZAT 13 - 15
                                    930, 1882, 1430, 1197,  980, 1461, 1526, 1810, 1659,  190,  920, 1866,   68,  483, 1662, 1069, 1848,  169,  259,  182,
                                   1923,  170, 1528,   51, 1802,  693,  160,  382, 1527, 1755,  779,  121,  902, 1226,  778,   39,  172, 1891, 1352,  777,
                                    495,  754,  327, 1568, 1554, 1771,  198,  873,  419, 1847,  563,  616, 1552,  963,  881, 1572,  313, 1935,   13,   82,
                                    667,  275,  660,  314,  300, 1076,  157, 1110, 1420, 1926,   28,  602, 1323, 1447,  331, 1843,   47, 1164,  224,   41,
                                   1794,  696,  977, 1838, 1190, 1858, 1825,  582,  559,  597,  890, 1476, 1813, 1668,  132,  345, 1222, 1096,  764,  137,
                                    346, 1841,  763,  736, 1933, 1652,  330,  820,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545,  569,
                                   1168, 1821,  859,  394,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524, 1686,  252, 1822, 1596,
                                   1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,   80,  436,  699, 1238,   67, 1795,  383,
                                   1186, 1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  823,  824,  461, 1758, 1177,   38, 1724, 1756, 1086,
                                    107,  355,  708,  663,  214, 1566,   73, 1295, 1292,  398, 1010,   55,  219 ],
                                 [ undefined, // S15, ZAT 12
                                    930,  980, 1430, 1197, 1882, 1461, 1526, 1810, 1659, 1662,  920, 1866,  169,  483,  190, 1069, 1802,   68,  259,  182,
                                   1923,  170, 1528,   51, 1848,  693,  160,  382, 1527, 1755,  779,  121,  902, 1226,  778,   39,  172, 1891, 1352,  777,
                                    495,  754,  327, 1568, 1554, 1771,  198,  873,  419, 1847,  563,  616, 1552,  963,  881, 1572,  313, 1935,   13,   82,
                                    667,  275,  660,  314,  300, 1076,  157, 1110, 1420, 1926,   28,  602, 1323, 1447,  331, 1843,   47, 1164,  224,  764,
                                   1794,  696,  977, 1838, 1190, 1858, 1825,  582,  559,  597, 1476,  890, 1813, 1668,  132,  345, 1222, 1096,   41,  137,
                                    346, 1841,  763,  736, 1933, 1652,  330,  820,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545,  569,
                                   1168, 1821,  859,  394,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524, 1686,  252, 1822, 1596,
                                   1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,   80,  436,  699, 1238,   67, 1795,  383,
                                   1186, 1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  823,  824,  461, 1758, 1177,   38, 1724, 1756, 1086,
                                    107,  355,  708,  663,  214, 1566,   73, 1295, 1292,  398, 1010,   55,  219 ],
                                 [ undefined, // S15, ZAT 11
                                    930,  980, 1430, 1197, 1882, 1461, 1526, 1810, 1659, 1662,  920, 1866,  169,  483,  190, 1069, 1802,   68,  259,  182,
                                     51,  170, 1528, 1923, 1848,  693,  160,  382, 1527, 1755,  779,  121,  902, 1226,  778,   39,  172, 1891, 1352,  777,
                                    495,  873,  327, 1568, 1554, 1771,  198,  754,  419,  616,  563, 1847, 1552,  963,  881, 1572,  313, 1935,   13,   82,
                                    667,  275,  660,  314,  300, 1076,  157, 1110, 1420, 1926,   28,  602, 1323, 1447,  331, 1843,   47, 1164,  224,  764,
                                   1794,  696,  977, 1838, 1190, 1858, 1825,  582,  559,  597, 1476,  890, 1813, 1668,  132,  345, 1222, 1096,   41,  137,
                                    346,  763, 1841,  736, 1933, 1652,  330,  820,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545,  569,
                                   1168, 1821,  859,  394,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524, 1686,  252, 1822, 1596,
                                   1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,   80,  436,  699, 1238,   67, 1795, 1177,
                                   1186, 1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  823,  824,  461, 1758,  383,   38, 1724, 1756, 1086,
                                    107,  355,  708,  663,  214, 1566,   73, 1295, 1292,  398, 1010,   55,  219 ],
                                 [ undefined, // S15, ZAT 10
                                    930, 1461, 1430, 1197, 1882,  980, 1526, 1810, 1659,  483,   68, 1866,  169, 1662,  190, 1069, 1923,  920,  259,  182,
                                     51,  170, 1528, 1802, 1848,  693,  160,  382, 1527, 1755,  779,  121,  902, 1226,  778,   39,  198,  754, 1352,  777,
                                    495,  873,  327, 1568, 1554,  313,  172, 1891,  419, 1935,  563, 1847, 1552,  963,  881, 1572, 1771,  616,   13,   82,
                                    667, 1843,  660,  314,  300, 1076,  157, 1110, 1420, 1825,   28,  602, 1323, 1447,  331,  275,   47, 1164,  224,  764,
                                   1794,  696,  977, 1838, 1190, 1858, 1926,  582,  559,  597, 1476,  890, 1813, 1668,  132,  345, 1222, 1096,   41,  137,
                                    346,  763, 1933,  736, 1841, 1652,  330,  820,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545,  569,
                                   1168, 1821,  859,  394,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524, 1795,  252, 1822, 1596,
                                   1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,   80,  436,  699, 1238,   67, 1686, 1177,
                                   1186, 1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  823,  824,  461, 1758,  383,   38, 1724, 1756, 1086,
                                    107,  355,  708,  663,  214, 1566,   73, 1295, 1292,  398, 1010,/#1176#/ 55,  219 ],
                                 [ undefined, // S15, ZAT 9
                                    930, 1461, 1430, 1197, 1882,  980, 1526, 1810, 1659,  483,   68,   51,  169, 1662,  190, 1069, 1923,  920, 1528,  182,
                                   1866,  170,  259, 1802, 1848,  693,  160,  382, 1527, 1755,  779,  121,  902,  873,  778,   39,  198,  754, 1352,  777,
                                   1554, 1226,  327, 1568,  495,  313,  172, 1891,  419, 1935,  563, 1847, 1552,  963,  881, 1572, 1771,  616, 1110,   82,
                                    667, 1843,  660,  314,  300, 1076,  157,   13, 1420, 1825,   28,  602, 1323, 1447,  331,  275,   47, 1164,  224,  764,
                                   1794,  696,  977, 1838, 1190,  559, 1926,  582, 1858,  597, 1476,  890, 1813,  569,  132,  345, 1222, 1096,  736,  137,
                                    346,  763, 1933,   41, 1841, 1652,  330, 1821,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545, 1668,
                                   1168,  820,  859,  394,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524, 1795,  252, 1822, 1596,
                                   1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,   80,  436,  699, 1238,   67, 1686, 1177,
                                   1186, 1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  823,  824,  461, 1758, 1176,   38, 1724, 1756, 1086,
                                    107,  355,  708,  663,  214, 1566,   73, 1295, 1292,  398,   55,  383, 1010 ],
                                 [ undefined, // S15, ZAT 8
                                    930, 1461, 1430, 1197, 1882,  980, 1526, 1810, 1659,  483,   68,   51,  169, 1662,  190, 1069, 1923,  920, 1528,  182,
                                   1866,  170,  259, 1802, 1848,  693,  160,  382, 1527, 1755,  779,  121,  902,  873,  778,   39,  198,  754, 1352,  777,
                                   1554, 1226,  327, 1568,  495,  313,  172, 1891,  419, 1935,  563, 1847, 1552,  963,  881, 1572, 1771,  616, 1110,   82,
                                    667, 1843,  660,  314,  300, 1076,  157,   13, 1420, 1825,   28,  602, 1323, 1447,  331,  275,   47, 1164,  224,  764,
                                   1794,  696,  977, 1838, 1190,  559, 1926,  582, 1858,  597, 1476,  890, 1813,  569,  132,  345, 1222, 1096,  736,  137,
                                    346,  763, 1933,   41, 1841, 1652,  330, 1821,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545, 1668,
                                   1168,  820,  859,  394,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524, 1795,  252, 1822, 1596,
                                   1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,   80,  436,  699, 1238,   67, 1686, 1177,
                                   1186, 1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  823,  824,  461, 1758, 1176,   38, 1724, 1756, 1086,
                                    107,  355,  708,  663,  214, 1566,   73, 1295, 1292,  398,   55,  383 ],
                                 [ undefined, // S15, ZAT 7
                                    930, 1461, 1430, 1197, 1882,  980, 1526, 1810, 1659,  483,   68,   51,  169, 1662,  190, 1069, 1923,  920, 1528,  182,
                                   1866,  170,  259, 1802, 1848,  693,  160,  382, 1527, 1755,  779,  121,  902,  873,  778,   39,  198,  754, 1352,  777,
                                   1554, 1226,  327, 1568,  495,  313,  172, 1891,  419, 1935,  563, 1847, 1552,  963,  881, 1572, 1771,  616, 1110,   82,
                                    667, 1843,  660,  314,  300, 1076,  157,   13, 1420, 1825,   28,  602, 1323, 1447,  331,  275,   47, 1164,  224,  764,
                                   1794,  696,  977, 1838, 1190,  559, 1926,  582, 1858,  597, 1476,  890, 1813,  569,  132,  345, 1222, 1096,  736,  137,
                                    346,  763, 1933,   41, 1841, 1652,  330, 1821,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545, 1668,
                                   1168,  820,  859,  394,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524, 1795,  252, 1822, 1596,
                                   1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1321,   14, 1929, 1275,   80,  436,  699, 1238,   67, 1686, 1177,
                                   1186, 1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  823,  824,  461, 1758, 1176,   38, 1724, 1756, 1086,
                                    107,  355,  708,  663,  214, 1566,   73, 1295, 1292,  398 ],
                                 [ undefined, // S15, ZAT 6
                                    930, 1461, 1430, 1197, 1810,  980, 1526, 1882, 1659,  483,   68,   51,  169, 1662,  190, 1069, 1923,  920, 1528,  182,
                                   1866,  170,  259, 1802, 1848,  693,  160,  382, 1527, 1755,  779,  121,  902,  873,  778,   39,  198,  754, 1352,  777,
                                   1554, 1226,  327, 1568,  495,  313,  172, 1891,  419, 1935,  563, 1847, 1552,  963,  881, 1572, 1771,  616, 1110,   82,
                                    667, 1843,  660,  314,  300, 1076,  157,   13, 1420, 1825,   28,  602, 1323, 1447,  331,  275,   47, 1164,  224,  764,
                                   1794,  696,  977, 1838, 1190,  559, 1926,  582, 1858,  597, 1476,  890, 1813,  569,  132,  345, 1222, 1096,  736,  137,
                                    346,  763,   41, 1933, 1841, 1652,  330, 1821,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545, 1668,
                                   1168, 1321,  859,  394,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524, 1795,  252, 1822, 1596,
                                   1820, 1152,   86, 1910,  878,  734,  352, 1209,  595,  820,   14, 1929, 1275,   80,  436,  699, 1238,   67, 1292, 1177,
                                   1186, 1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  823,  824,  461, 1758, 1176,   38, 1724, 1756, 1086,
                                    107,  355,  708,  663,  214, 1566,   73, 1295, 1686,  398 ],
                                 [ undefined, // S15, ZAT 5
                                    930, 1461, 1430, 1197, 1810,  980, 1526, 1882, 1659,   51,   68,  483,  169, 1662,  190, 1848, 1802,  920, 1528,  182,
                                   1866,  170,  259, 1923, 1069,  693,  873,  382, 1527, 1352,  779,  121,  902,  160,  778,   39, 1552,  754, 1755,  777,
                                   1554, 1226,  327, 1568,  495,  313,  172, 1891,  419, 1935,  563, 1847,  198,  963,  881, 1572, 1771,  616, 1110,   82,
                                    667, 1843,  660,  314,  300, 1076,  157, 1858, 1420, 1825,   28,  602, 1323, 1447,  331,  275,   47, 1164,  224,  764,
                                   1794,  696,  977, 1838, 1190,  559,  569,  582,   13,  597, 1476,  890, 1813, 1926,  132,  345, 1222, 1096,  736,  137,
                                    346,  763,   41, 1933, 1841, 1652,  330, 1821,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545, 1668,
                                   1168, 1321,  859,  394,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524, 1795,  252, 1822, 1596,
                                   1820, 1152,   86, 1910,  878,  734,  352, 1209,  595,  820,   14, 1929, 1275,   80,  436,  699, 1238,   67, 1292, 1177,
                                   1186, 1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  823,  824,  461, 1758, 1176,   38, 1724, 1756, 1086,
                                    107,  355,  708,  663,  214, 1566,   73, 1295, 1686 ],
                                 [ undefined, // S15, ZAT 4
                                   1430, 1461,  930, 1197, 1810,  980, 1526, 1882, 1659,   51,   68,  483, 1866, 1662,  190, 1848, 1802,  920, 1528,  182,
                                    169,   39,  259, 1923, 1069,  693,  873,  382, 1527, 1352,  779,  121,  902,  160,  778,  170, 1552,  754, 1755,  777,
                                   1554, 1935,  327, 1568,  495,  313,  172, 1891,  419, 1226,  563, 1847,  198,  963,  881, 1572, 1771,  616, 1110,   82,
                                    667, 1843,  660,  314,  300, 1076,  157, 1858, 1420, 1825,   28,  602, 1323, 1447,  331,  275,   47, 1164,  224,  764,
                                   1794,  696,  977, 1838, 1190,  559,  569,  582,   13,  597, 1476,  890, 1813, 1926,  132,  345, 1222, 1096,  736,  137,
                                    346,  763,   41, 1933, 1841, 1652,  330, 1821,  836, 1818,  692,  761,  689,  386,  741,   37, 1548,  762,  545, 1668,
                                   1168, 1321,  859,  394,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524, 1795,  252, 1822, 1596,
                                   1820, 1152,   86, 1910,  878,  734,  352, 1209,  595,  820,   14, 1929, 1275,  214,  436,  699, 1238,   67, 1292, 1177,
                                   1186, 1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  823,  824,  461, 1758, 1176,   38, 1724, 1756, 1086,
                                    107,  355,  708,  663,   80, 1566,   73, 1295, 1686 ],
                                 [ undefined, // S15, ZAT 3
                                   1430, 1461,  930, 1197, 1810,  980, 1526, 1882, 1659,   51,   68, 1848, 1866, 1802,  190,  483, 1662,  920, 1528,  182,
                                    169,   39, 1352,  873, 1069,  693, 1923,  382, 1527,  259, 1552,  121,  902,  777,  778,  170,  779,  754,  313,  160,
                                   1554, 1935,  327, 1568,  495, 1755,  300, 1891,  419, 1226,  563, 1847,  198,  963,  881, 1572, 1771,  616, 1110,   82,
                                    667, 1843,  660,  314,  172, 1076,  597, 1858, 1420, 1825,   28,  331, 1323, 1447,  602,  275,   47, 1164,  224,  764,
                                   1794,  696,  977, 1838, 1190,  559,  569,  582,   13,  157, 1476,  890, 1813, 1926,  132,  345, 1222, 1096,  736,  137,
                                    346,  763,   41,  836,  386, 1652,  330, 1821, 1933, 1818,  692,  761,  689, 1841,  741,   37, 1548,  762,  545, 1668,
                                   1168, 1321,  859,  394,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524, 1795,  252, 1822, 1596,
                                   1820, 1152,   86, 1910,  878,  734,  352, 1209,  595,  820,   14, 1929, 1275,  214,  436,  699, 1238,   67, 1292, 1177,
                                   1186, 1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  823,  824,  663, 1758, 1176,   38, 1724, 1756, 1086,
                                    107,  355,  708,  461,   80, 1566,   73, 1295 ],
                                 [ undefined, // S15, ZAT 2
                                    930, 1810, 1430, 1197, 1461,  980, 1526, 1882, 1659, 1802,   68, 1848, 1866,   51,  190,  693, 1662,  920, 1528,  182,
                                    169,   39, 1352, 1923, 1069,  483,  873,  382, 1527,  259,  754,  121,  902,  777,  778,  495,  779, 1552,  313,  160,
                                   1554, 1935,  327, 1568,  170, 1847,  300,  198,  419,  881,  563, 1755, 1891,  963, 1226, 1572, 1771,  616, 1110,   82,
                                  /#674#/ 667, 1843,  660, 1323,   47, 1076,  597, 1858, 1420, 1825,   28,  331,  314, 1447,  602,  275,  172, 1164,  224,
                                    764, 1794,  696,  977, 1838, 1190,  559,  569,  582,   13,  157, 1476,  890, 1813, 1926,  132,  345, 1222, 1096,  736,
                                    137,  346,  763,   41,  836,  386, 1652,  330, 1821, 1818, 1933,  692,  761,  689, 1841,  741,   37, 1548,  762,  545,
                                   1668, 1168, 1321,  859,  394,  510,   71,   25, 1797,  322, 1030, 1493, 1157,  564,  242, 1261,  524, 1795,  252, 1822,
                                   1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1275,   14, 1929,  820,  214,  436,  699, 1238,   67, 1292,
                                   1177, 1186, 1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  823,  824,  663, 1758, 1176,   38, 1724, 1756,
                                   1086,  107,  355,  708,   73,   80, 1566,  461, 1295 ],
                                 [ undefined, // S15, ZAT 1
                                    930, 1810, 1430, 1197, 1461,  980, 1526, 1866, 1659, 1802,   68, 1848, 1882,   51,  190,  693, 1662,   39, 1528,  182,
                                    169,  920, 1352, 1923, 1069,  483,  873,  382, 1527,  259,  754,  121,  902,  777,  778,  495,  779, 1552,  313,  160,
                                   1554, 1935,  327, 1568,  170, 1847,  300,  198,  419,  881,  563, 1755, 1891,  963, 1226, 1572, 1771,  616, 1110,   82,
                                    674,  667, 1843,  660, 1323,   47, 1076,  597, 1858, 1420, 1825,   28,  331,  314, 1447,  602,  275,  172, 1164,  224,
                                    764, 1794,  696,  977, 1838, 1190,  559,  569,  582,   13,  157, 1476,  890, 1813, 1926,  132,  345, 1222, 1096,  736,
                                    137,  346,  763, 1493,  836,  386, 1652,  330, 1821, 1818, 1933,  692,  761,  689,  741, 1841,   37, 1548,  762,  545,
                                   1668, 1168, 1321,  859,  394,  510,   71,   25, 1797,  322, 1030,   41, 1157,  564,  242, 1261,  524, 1795,  252, 1822,
                                   1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1275,   14, 1929,  820,  214,  436,  699, 1238,   67, 1292,
                                   1177, 1186, 1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  823,  824,  663, 1758, 1176,   38, 1724, 1756,
                                   1086,  107,  355,  708,   73,/#728#/  80, 1566,  461 ],
                                 [ undefined, // S15, ZAT 0
                                    930, 1810, 1430, 1197, 1461,  980, 1526, 1866, 1659, 1802,   68, 1848, 1882,   51,  190,  693, 1662,   39, 1528,  182,
                                    169,  920, 1352, 1923, 1069,  483,  873,/#705#/ 382, 1527,  259,  754,  121,  902,  777,  778,  495,  779, 1552,  313,
                                    160, 1554, 1935,  327, 1568,  170, 1847,  300,  198,  419,  881,  563, 1755, 1891,  963, 1226, 1572, 1771,  616, 1110,
                                     82,  674,  667, 1843,  660, 1323,   47,/#441#/1076,  597, 1858, 1420, 1825,   28,  331,  314, 1447,  602,  275,  172,
                                   1164,  224,  764, 1794,  696,  977, 1838, 1190,  559,  569,  582,   13,  157, 1476,  890, 1813, 1926,  132,  345, 1222,
                                   1096,  736,  137,/#311#/ 346,  763, 1493,  836,  386, 1652,  330, 1821, 1818, 1933,  692,  761,  689,  741, 1841,   37,
                                   1548,  762,  545, 1668, 1168, 1321,  859,  394,  510,   71,   25, 1797,  322, 1030,   41, 1157,  564,  242, 1261,  524,
                                   1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1275,   14, 1929,  820,  214,  436,  699,
                                   1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  823,  824,  663, 1758, 1176,
                                     38, 1724, 1756, 1086,  107 ],
                                 [ undefined, // S14, ZAT 71 - 72
                                    930, 1810, 1430, 1197, 1461,  980, 1526, 1866, 1659, 1802,   68, 1848, 1882,   51,  190,  693, 1662,   39, 1528,  182,
                                    169,  920, 1352, 1923, 1069,  483,  873,  705,  382, 1527,  259,  754,  121,  902,  777,  778,  495,  779, 1552,  313,
                                    160, 1554, 1935,  327, 1568,  170, 1847,  300,  198,  419,  881,  563, 1755, 1891,  963, 1226, 1572, 1771,  616, 1110,
                                     82,  674,  667, 1843,  660, 1323,   47,  441, 1076,  597, 1858, 1420, 1825,   28,  331,  314, 1447,  602,  275,  172,
                                   1164,  224,  764, 1794,  696,  977, 1838, 1190,  559,  569,  582,   13,  157, 1476,  890, 1813, 1926,  132,  345, 1222,
                                   1096,  736,  137,  311,  346,  763, 1493,  836,  386, 1652,  330, 1821, 1818, 1933,  692,  761,  689,  741, 1841,   37,
                                   1548,  762,  545, 1668, 1168, 1321,  859,  394,  510,   71,   25, 1797,  322, 1030,   41, 1157,  564,  242, 1261,  524,
                                   1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1275,   14, 1929,  820,  214,  436,  699,
                                   1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,  254, 1359, 1832, 1006,  451,  823,  824,  663, 1758, 1176,
                                     38, 1724, 1756, 1086,  107 ],
                                 [ undefined, // S14, ZAT 70
                                    930, 1810, 1430, 1197, 1461,  980, 1848, 1866, 1659, 1802,   68, 1526, 1882,   51,  190, 1069,  705,   39, 1528,  182,
                                    169,  920, 1352, 1923,  693,  483,  873, 1662,  382, 1527,  259,/#1413#/754,  121,  902,  777,  778,  495,  779, 1552,
                                    313,  160, 1554, 1935,  327, 1568,  170, 1847,  300,  198,  419,  881,  563, 1755, 1891,  963, 1226, 1572, 1771,  616,
                                   1110,   82,  674,  667, 1843,  660, 1323,   47,  441, 1076,  597, 1858, 1420, 1825,   28,  331,  314, 1447,  602,  275,
                                    172, 1164,  224,  764, 1794,  696,  977, 1838, 1190,  559,  569,  582,   13,  157, 1476,  890, 1813, 1926,  132,  345,
                                   1222, 1096,  736,  137,  311,  346,  763, 1493,  836,  386, 1652,  330, 1821, 1818, 1933,  692,  761,  689,  741, 1841,
                                     37, 1548,  762,  545, 1668, 1168, 1321,  859,  394,  510,   71,   25, 1797,  322, 1030,   41, 1157,  564,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1275,   14, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,  107, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756, 1086,  254 ],
                                 [ undefined, // S14, ZAT 68 - 69
                                    930, 1810, 1430, 1197, 1461,  980, 1848, 1866, 1659, 1802,   68, 1526, 1882,  182,  190, 1069,  705,   39, 1528,   51,
                                    873,  920, 1413,  121,  693,  777,  169, 1662,  382,  779,  754, 1352,  259, 1923,  902,  483,  170,  327, 1527, 1552,
                                    313,  160,  300, 1935,  495,  963,  778, 1847, 1554,  198,   82,  881,  563, 1755, 1891, 1568, 1226, 1572, 1771,  616,
                                   1110,  419,  674,  667, 1843,  660,  275,   47,  441, 1076,  597, 1858, 1420, 1825,   28,  331,  314, 1447, 1794, 1323,
                                    172, 1164,  224,  157,  602,  696,  977, 1838, 1190,  559,  569,  582,   13,  764, 1476,  890, 1813, 1926,  132,  345,
                                   1222, 1096,  736,  137,  311,  346,  763, 1493,  836,  386, 1652,  330, 1821, 1818, 1933,  692,  761,  689,  741, 1841,
                                     37, 1548,  564,  545, 1668, 1168, 1321,  859,  394,  510,   71,   25, 1797,  322, 1030,   41, 1157,  762,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1275,   14, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,  107, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756, 1086,  254 ],
                                 [ undefined, // S14, ZAT 67
                                    930, 1810, 1430, 1197, 1461,  980, 1848, 1866, 1659, 1802,   68, 1526, 1882,  182,  190, 1069,  705,   39, 1528,   51,
                                    873,  920, 1413,  121,  693,  777,  169, 1662,  382,  779,  754, 1352,  259, 1923,  902,  483,  170,  327, 1527, 1552,
                                    313,  160,  300, 1935,  495,  963,  778, 1847, 1554,  198,   82,  881,  563, 1755, 1891, 1568, 1226, 1572, 1771,  616,
                                   1110,  419,  674,  667, 1843,  660,  275,   47,  441, 1076,  597, 1858, 1420, 1825,   28,  331,  314, 1447, 1794, 1323,
                                    172, 1164,  224,  157,  602,  696,  977, 1838, 1190,  559,  569,  582,   13,  764, 1476,  890, 1813, 1926,  132,  345,
                                   1222, 1096,  736,  137,  311,  346,  763, 1493,  836,  386, 1652,  330, 1821, 1818, 1933,  692,  761,  689,  741, 1841,
                                     37, 1548,  564,  545, 1668, 1168, 1321,  859,  394,  510,   71,   25, 1797,  322, 1030,   41, 1157,  762,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1275,   14, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,  107, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756, 1086 ],
                                 [ undefined, // S14, ZAT 66
                                    930, 1810, 1430, 1197, 1461,  980, 1848, 1866, 1659, 1802,   68, 1526, 1528,  182,  190, 1069,  705,   39, 1882,   51,
                                    873,  920,  382, 1923,  693,  777,  169, 1662, 1413, 1527,  495, 1352,  259,  121,  902,  483,  170,  327,  779, 1552,
                                    313,  160,  300, 1935,  754,  963,  778, 1847, 1554,  198,   82,  881,  563, 1891, 1755, 1568, 1226, 1572, 1771,  616,
                                   1110,  419,  674,  667, 1843,  660,  275,   47,  441, 1076,  597, 1858, 1420, 1825,   28,  331,  314, 1447, 1794, 1323,
                                    172, 1164,  224,  157,  696,  602,  977, 1838, 1190,  559,  569,  582,   13,  764, 1476,  890, 1813, 1926,  132,  345,
                                   1222, 1096,  736,  137,  311,  346,  763, 1493,  836,  386, 1652,  330, 1821, 1818,   25,  692,  761,  689,  741, 1841,
                                     37, 1548,  564,  545, 1668, 1168, 1321,  859,  394,  510,   71, 1933, 1797,  322, 1030,   41, 1157,  762,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1275,   14, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,  107, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756, 1086 ],
                                 [ undefined, // S14, ZAT 61 - 65
                                    930, 1810, 1430, 1197, 1461,  980, 1848, 1866, 1659, 1802,   68, 1526, 1528,  182,  190, 1069,  705,   39, 1882,   51,
                                    873,  920,  382, 1923,  693,  777,  169, 1662, 1413, 1527,  495, 1352,  259,  121,  902,  170,  483,  327,  779, 1552,
                                    313,  160,  300, 1935,  754,  963,  778, 1226, 1554,  198,  667,  881,  563, 1891, 1755, 1568, 1847, 1572, 1771,  616,
                                   1110,  314,  674,   82, 1843,  660,  275,   47,  441, 1076,  597,  559, 1420, 1825,   28,  331,  419, 1447, 1794, 1323,
                                    172, 1164,  224,  157,  696,  602,  977, 1838, 1190, 1858,  569,  582,   13,  764, 1476,  890, 1813, 1926,  132,  345,
                                   1222, 1096,  736,  137,  311,  346,  763, 1493,  836,  386, 1652,  330, 1821, 1818,   25,  692,  761,  689,  741, 1548,
                                     37, 1841,  564,  545, 1668, 1168, 1321,  859,  394,  510,   71, 1933, 1797,  322, 1030,   41, 1157,  762,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1275,   14, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,  107, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756, 1086 ],
                                 [ undefined, // S14, ZAT 60
                                    930, 1461, 1430, 1866, 1810,  980, 1848, 1197, 1659, 1802,   68, 1069, 1528,  182,  190, 1526,  705,   39, 1882,  169,
                                    873,  920,  382, 1923,  693,  777,   51,  902, 1413,  754,  495, 1352,  483,  121, 1662,  170,  259,  327,  779, 1552,
                                    313,  160,  300, 1935, 1527,  963, 1771, 1226, 1847, 1843,  667,  881,  563, 1891, 1755, 1568, 1554, 1572,  778,  616,
                                   1110,  314,  674,   82,  198,  660,  275,   47,  441, 1076,  597,  559, 1420, 1825,   28,  331,  419, 1447, 1794, 1323,
                                    172, 1164,  224,  157,  696,  602,  977, 1838, 1190, 1858,  569,  582,   13,  764, 1476,  890, 1813, 1926,  132,  345,
                                   1222, 1096,  736,  137,  311,  346,  763, 1493,  836,  386, 1652,  330, 1821, 1818,   25,  692,  761,  689,  741, 1548,
                                     37, 1841,  564,  545, 1668, 1168, 1321,  859,  394,  510,   71, 1797, 1933,  322, 1030,   41, 1157,  762,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1275,   14, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,  107, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756, 1086 ],
                                 [ undefined, // S14, ZAT 59
                                    930, 1461, 1430, 1866, 1810,  980, 1848, 1197, 1659, 1802,   68, 1069, 1528,  182,  190, 1526,  705,   39, 1882,  169,
                                    873,  920,  382, 1923,  693,  777,   51,  902, 1413,  754,  170, 1352,  483,  121, 1662,  495,  259,  327,  779, 1552,
                                    313,  160,  300, 1935, 1527,  963, 1771, 1226, 1847, 1843,  667,  881,  563, 1891, 1755, 1568, 1554, 1572,  778,  275,
                                   1110,  314,  674,  660,  198,   82,  616,   47,  441, 1076,  597,  559, 1420, 1825,   28,  331,  419, 1447, 1794, 1323,
                                    172, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1858,  569,  602,   13,  764, 1476,  890, 1813, 1926,  132,  345,
                                   1222, 1096,  736,  137,  311,  346,  763, 1493,  836,  386, 1652,  330, 1821, 1818,   25,  692,  761,  689,  741, 1548,
                                     37, 1841,  564,  545, 1668, 1168, 1321,  859,  394,  510,   71, 1797, 1933,  322, 1030,   41, 1157,  762,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1275,   14, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,  107, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756, 1086 ],
                                 [ undefined, // S14, ZAT 58
                                    930, 1461, 1430, 1866, 1810,  980, 1848, 1197, 1659, 1802,   68, 1526, 1528,   39,  190, 1069,  705,  182, 1882,  169,
                                    902,  920,  382, 1923,  693,  777,   51,  873,  259,  754,  170, 1352,  483,  121, 1662,  495, 1413,  327,  779, 1226,
                                    313,  160,  300, 1935, 1527,  963, 1771, 1552, 1847, 1843,  667,  881,  563, 1891, 1755, 1568, 1554, 1572,  616,  275,
                                   1110,  314,  674,  660,  198,   82,  778,   47,  441, 1076,  597,  559, 1420, 1825,   28,  331,  419, 1447, 1794, 1323,
                                    172, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569,  602,   13,  764, 1476,  890, 1858, 1926,  132,  345,
                                   1222, 1096,  736,  137,  311,  346,  763, 1493,  836,  386, 1652,  330, 1821, 1818,   25,  692,  761,  689,  741, 1548,
                                     37, 1841,  564,  545, 1668, 1168, 1321,  859,  394,  510,   71, 1797, 1933,  322, 1030,   41, 1157,  762,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1275,   14, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,  107, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756, 1086 ],
                                 [ undefined, // S14, ZAT 55 - 57
                                    930, 1461, 1430, 1866, 1810,  980, 1848, 1197, 1659, 1802,   68, 1526, 1528,   39,  190, 1069,  705,  182, 1882,  169,
                                    902,  920,  382, 1923,  693,  777,   51,  873,  259,  754,  170, 1352,  483,  121, 1662,  327, 1413,  495, 1771, 1226,
                                    313,  160,  300, 1935, 1527,  963,  779, 1552,  275, 1843,  667,  881,  563, 1891, 1755, 1568, 1554, 1572,  616, 1847,
                                   1110,  314,  674,  660,  198,   82,  778, 1794,  441, 1076,  597,  559, 1420, 1825,   28,  331, 1447,  419,   47, 1323,
                                    172, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569,  602,   13,  764, 1476,  890, 1858, 1926,  132,  345,
                                   1222, 1096,  736,  137,  311,  346,  763, 1493,  836,  386, 1652,  330, 1821, 1818,   25,  692,  761,  689,  741, 1548,
                                     37,  564, 1841,  545, 1668, 1168, 1321,  859,  394,  510,   71, 1797, 1933,  322, 1030,   41, 1157,  762,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1275,   14, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,  107, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756, 1086 ],
                                 [ undefined, // S14, ZAT 54
                                    930, 1461, 1866, 1430, 1810,  980, 1848, 1197, 1659, 1802,   68, 1526, 1528,   39,  190, 1069,  705,  182,  920,  169,
                                    902, 1882,  382, 1923,  693,  777,  327,  873,  259,  754,  483, 1352,  170,  121,  495,   51, 1413, 1662,  881, 1226,
                                    313,  160,  300, 1935, 1527,  963,  779,   82,  275, 1843,  667, 1771,  563, 1891, 1755,  441, 1554, 1572, 1076, 1847,
                                   1110,  314,  674,  660,  198, 1552,   47, 1794, 1568,  616,  597,  559, 1420, 1825,   28,  331, 1447,  419,  778, 1323,
                                    172, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569,  602,   13,  764, 1476,  890, 1858, 1926,  132,  345,
                                   1222, 1096,  736,  137,  311,  346,  763, 1493,  836,  386, 1652,  330, 1821, 1818,   25,  692,  761,  689,  741, 1548,
                                     37,  564, 1841,  545, 1668, 1168, 1321,  859,  394,  510,   71, 1797, 1933,  322, 1030,   41, 1157,  762,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1275,   14, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,  107, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756, 1086 ],
                                 [ undefined, // S14, ZAT 53
                                    930, 1461, 1866, 1430, 1810,  980, 1848, 1197, 1659, 1802,   68, 1526, 1528,   39,  190, 1069,  705,  182,  920,  169,
                                    902, 1882,  382, 1923,  693,  777,  327,  873,  259,  754,  483, 1352,  170,  121,  495,   51, 1413, 1662,  881, 1226,
                                    313,  160,  300, 1935, 1527,  963,  779,   82,  275, 1843,  667, 1771,  563, 1891, 1755,  441, 1554, 1572, 1076, 1794,
                                   1110,  314,  674,  660,  198, 1552,   47, 1847, 1568,  616,  597,  559, 1420, 1825,   28,  331, 1447, 1323,  778,  419,
                                    172, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569, 1926,   13,  764, 1476,  890, 1858,  602,  132,  345,
                                   1222, 1096,  736,  137,  311,  346,  763, 1493,  836,  386, 1652,  330, 1821, 1818,   25,  692,  761,  689,  741, 1548,
                                     37,  564, 1841,  545, 1668, 1168, 1321,  859,  394,  510,   71, 1797,  322, 1933, 1030,   41, 1157,  762,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  595, 1275,   14, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,  107, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756, 1086 ],
                                 [ undefined, // S14, ZAT 52
                                    930, 1461,  980, 1430, 1810, 1866, 1526, 1197, 1659, 1802,   68, 1848, 1528,   39,  190, 1069,  705, 1923,  920,  169,
                                    902, 1882,  382,  182,  693,  259,  327,  170,  777,  754,  483, 1352,  873,  121,  495,   51, 1413, 1662,  881, 1226,
                                    313,  160,  300, 1935, 1527,  963,  779,   82,  275, 1843,  667, 1771,  563,  198, 1755,  441, 1554, 1572, 1076, 1794,
                                   1110,  314,  674,  660, 1891, 1552,   47, 1847, 1568,  616,  597,  559, 1420, 1825,   28,  331, 1447, 1323,  778,  419,
                                    172, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569, 1926,   13,  764, 1476,  890, 1858,  602,  132,  345,
                                   1222, 1096,  736,  137,  311,  346,  763, 1493,  836,  386, 1652,  330, 1821, 1818,   25,  692,  761,  689,  741, 1548,
                                     37,  564, 1841,  545, 1668, 1168, 1321,  859,  394,  510,   71, 1797,  322, 1933, 1030,   41, 1157,  595,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  762, 1275,   14, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,  107, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756, 1086 ],
                                 [ undefined, // S14, ZAT 49 - 51
                                    930, 1461,  980, 1430, 1810, 1866, 1526, 1197, 1659, 1802,   68, 1848, 1528,   39,  190, 1069,  705, 1923,  920,  169,
                                    327, 1882,  382,  182,  693,  259,  902,  170,  777,  754, 1413, 1352,  873,  121,  160,   51,  483, 1662,  881, 1226,
                                    313,  495,  300, 1935, 1527,  963,  660,   82,  275, 1843,  667, 1771,  563,  198, 1755,  441, 1554, 1572, 1076, 1794,
                                   1110,  314,  674,  779, 1891, 1552,   47, 1847, 1568,  616,  597,  559, 1420, 1825,   28,  331, 1447, 1323, 1926,  311,
                                    172, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569,  778,   13,  764, 1476,  890, 1858,  602,  132,  345,
                                   1222, 1096,  736,  137,  419,  346,  763, 1493,  836,  386, 1652,  330, 1821, 1818,   25,  692,  761,  689,  741, 1548,
                                     37,  564,  859,  545, 1668, 1168, 1321, 1841,  394,  510,   71, 1797,  322, 1030, 1933,   41, 1157,  595,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  762, 1275,  107, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,   14, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756, 1086 ],
                                 [ undefined, // S14, ZAT 48
                                    930, 1461,  980, 1430, 1810, 1659, 1526, 1197, 1866, 1802, 1069, 1848, 1528,   39,  190,   68,  705, 1923,  920,  169,
                                    327, 1882,  754, 1413,  693,  121,  902,  170,  777,  382,  182, 1352,  873,  259,  160,   51,  483,  313,  963, 1226,
                                   1662,  495,  563, 1935, 1527,  881,  660,   82,  275, 1843,  667, 1771,  300,  198, 1755,  441,  597, 1572, 1076, 1794,
                                   1110,  314,  674,  779, 1825, 1552,  172, 1847, 1568,  616, 1554,  559, 1420, 1891,   28,  331, 1447, 1323, 1926,  311,
                                     47, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569,  346,   13,  764, 1476,  890, 1858,  602,  132,  345,
                                   1222, 1096,  736,  137,  419,  778,  763, 1493,  836,  386, 1652,  330, 1821, 1818,   25,  692,  761,  689,  741, 1548,
                                     37,  564,  859,  545, 1668, 1168, 1321, 1841,  394,  510,   71, 1797,  322, 1030, 1933,   41, 1157,  595,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  762, 1275,  107, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,   14, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756, 1086 ],
                                 [ undefined, // S14, ZAT 47
                                    930, 1461,  980, 1430, 1810, 1659, 1802, 1197, 1866, 1526, 1069, 1848, 1528,   39,  190,   68,  705, 1923,  920,  169,
                                    327,  777,  754, 1413,  693,  121,  902,  170, 1882,  382,  182, 1352,  873,  259,  160,   51,  483,  313,  963, 1226,
                                   1662,  495,  563, 1935, 1527,  881,  660,   82,  275, 1843,  667, 1771,  300,  198, 1755,  441,  597, 1572, 1076, 1794,
                                   1110,  314,  674,  779, 1825, 1552,  172,  311, 1568,  616, 1554,  559, 1420, 1891,   28,  331, 1447, 1323, 1926, 1847,
                                     47, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569,  346,   13,  764, 1476,  890, 1858,  132,  602,  345,
                                   1222, 1096,  736,  137,  419,  778,  763, 1493,  836,  386, 1652,  330, 1821, 1818,   25,  692,  761,  689,  741, 1548,
                                     37,  564,  859,  545, 1668, 1168, 1321, 1841,  394,  510,   71, 1797,  322, 1030, 1933,   41, 1157,  595,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  762, 1275,  107, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,   14, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756, 1086 ],
                                 [ undefined, // S14, ZAT 46
                                    930, 1461,  980, 1430, 1810, 1866, 1802, 1197, 1659, 1526, 1069, 1848, 1528,  920,  190,   68,  705, 1923,   39,  169,
                                    327,  777,  754, 1413,  693,  121,  902, 1882,  170,  382,  182, 1352,  873,  259,  160, 1527,  483,  198,  660, 1226,
                                   1662,  495,  563, 1935,   51,  441,  963,   82,  275, 1843,  667, 1825, 1076,  313, 1755,  881,  597, 1572,  300, 1794,
                                   1110,  314,  674,  779, 1771, 1552,   47,  311, 1568,  616, 1554,  559, 1420, 1891,   28,  331, 1447, 1323, 1926, 1847,
                                    172, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569,  346,   13, 1821, 1476,  890, 1858,  132,  602,  345,
                                   1222, 1096,  736,  137,  419,   37,  763, 1493,  836,  386, 1652,  330,  764, 1818,   25,  692,  761,  689,  741, 1548,
                                    778,  564,  859,  545, 1668, 1168, 1321, 1841,  394,  510,   71, 1797,  322, 1030, 1933,   41, 1157,  595,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  762, 1275,  107, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401,   14, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756, 1086 ],
                                 ],
                                 [ undefined, // S14, ZAT 43 - 45
                                    930, 1461,  980, 1430, 1810, 1866, 1802, 1197, 1659, 1526, 1069, 1848, 1528,  920,  190,   68,  705, 1923,   39,  169,
                                    327,  777,  754, 1413,  693,  121,  902, 1882,  170,  382,  182, 1352,  873,  259,  160, 1527,  483,  198,  660, 1226,
                                   1662,  495,  563, 1935,   51,  441,  963,   82,  275, 1843,  667, 1825, 1076,  313, 1755,  881,  597, 1572,  300, 1794,
                                   1110,  314,  674,  779, 1771, 1552,   47,  311, 1568,  616, 1926,  559, 1420,  331,   28, 1891, 1447, 1323, 1554, 1847,
                                    172, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569,  346,   13, 1821, 1476,  132, 1858,  890,  736,  345,
                                   1222, 1096,  602,  137,  419,   37,  763, 1493,  836,  386, 1652,  330,  764, 1818,   25,  692,  761,  689,  741, 1548,
                                    778,  564,  859,  545, 1668, 1168, 1321,  322,  394,  510,   71, 1797, 1841, 1030, 1933,   41, 1157,  595,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  762, 1275,  107, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401, 1086, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756,   14 ],
                                 [ undefined, // S14, ZAT 42
                                   1461,  930,  980, 1430, 1659, 1866, 1802, 1197, 1810, 1526, 1069, 1848, 1528,  920,  190,   68,  705,  754,   39,  169,
                                    327,  777, 1923,  170,  693,  121,  902,  259, 1413,  483,  182, 1352,  873, 1882,  160, 1527,  382,  198,  660, 1226,
                                   1662,  495,  563, 1935,   51,  441,  963,   82,  275, 1843,  667, 1825, 1076,  313, 1755,  881,  597, 1572,  300, 1794,
                                   1110,  314,  674,  779, 1771, 1552,   47,  311, 1568,  616, 1926,  559, 1420,  331,   28, 1891, 1447, 1323, 1554, 1847,
                                    172, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569,  346,   13, 1821, 1476,  132, 1858,  890,  736,  345,
                                   1222, 1096,  602,  137,  419,   37,  763, 1493,  836,  386, 1652,  330,  764, 1818,   25,  692,  761,  689,  741, 1548,
                                    778,  564,  859,  545, 1668, 1168, 1321,  322,  394,  510,   71, 1797, 1841, 1030, 1933,   41, 1157,  595,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  762, 1275,  107, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401, 1086, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756 ],
                                 [ undefined, // S14, ZAT 41
                                   1461,  930,  980, 1430, 1659, 1866, 1802, 1197, 1810, 1526, 1069, 1848, 1528,  920,  190,   68,  705,  754,   39,  169,
                                    327,  777, 1923,  170,  693,  121,  902,  259, 1413,  483,  182, 1352,  495, 1882,  160, 1527,  382,  963,  660, 1226,
                                   1662,  873,  563, 1935,   51,  441,  198,   82,  275, 1843,  667, 1825, 1076,  313, 1755,  881,  597, 1572,  300, 1794,
                                   1110,  314,  674,  779, 1771, 1552,   47,  311, 1568,  616, 1926,  559, 1420,  331,   28, 1891, 1447, 1323, 1554, 1858,
                                    172, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569,  346,   13, 1821, 1476,  132, 1847,  736,  890,  345,
                                   1222, 1096,  602,  137,   37,  419,  763, 1493,  836,  386, 1652,  330,  764, 1818,   25,  692,  761,  689,  741, 1548,
                                    778,  564,  859,  545, 1668, 1168, 1321,  322,  394,  510,   71, 1797, 1841, 1030,   41, 1933, 1157,  595,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  762, 1275,  107, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401, 1086, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756 ],
                                 [ undefined, // S14, ZAT 40
                                    930, 1461,  980, 1430, 1659, 1866, 1802, 1197, 1810, 1526,   68,  705,  169,  920,  190, 1069, 1848,  754,   39, 1528,
                                    327, 1352, 1923,  170,  693,  121,  902,  259,  660,  483, 1226,  777,  495, 1882,  160, 1527,  382,  963, 1413,  182,
                                   1662,  873,  563, 1935,   51,  441,  198, 1076,  275, 1843,  667, 1825,   82,  313, 1755,  881,  597, 1572,  300, 1794,
                                   1110,  314,  674,  779, 1771, 1552,   47,  311, 1568,  616, 1926,  559, 1420,  331,   28, 1891, 1447, 1323, 1554, 1858,
                                    172, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569,  346,   13, 1821, 1476,  132, 1847,  736,  890,  345,
                                   1222, 1096,  763,  137,   37,  419,  602, 1493,  836,  386, 1652,  330,  764, 1818,   25,  692,  761,  689,  741, 1548,
                                    778,  564,  859,  545, 1668, 1168, 1321,  322,  394,  510,   71, 1797, 1841, 1030,   41, 1933, 1157,  595,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  762, 1275,  107, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401, 1086, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756 ],
                                 [ undefined, // S14, ZAT 37 - 39
                                    930, 1461,  980, 1430, 1197, 1866, 1802, 1659, 1810, 1526,   68,  705,  169,  920,  190, 1069, 1848,  754,   39, 1528,
                                    327, 1352, 1923,  693,  170,  121,  902,  259,  660,  483, 1226,  777, 1527,   51,  160,  495,  382,  963, 1413,  182,
                                   1662, 1755,  563, 1935, 1882,  441,  198, 1076,  275, 1843,  667, 1825,   82,  313,  873,  881,  597, 1572,  300, 1794,
                                   1110,  314,  674,  779, 1771, 1552,   47,  311, 1568,  616, 1926,  559, 1420,  331,   28, 1891, 1447, 1323,   37, 1858,
                                    172, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569,  346,   13, 1821, 1476,  132, 1493,  736,  345,  890,
                                   1222, 1096,  763,  137, 1554,  510,  602, 1847,  836,  386, 1652,  330,  545,   41,   25,  692,  761,  689,  741, 1548,
                                   1157,  564,  859,  764, 1668, 1168, 1321,  322,  394,  419,   71, 1797, 1841, 1030, 1818, 1933,  778,  595,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  762, 1275,  107, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401, 1086, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756 ],
                                 [ undefined, // S14, ZAT 36
                                    930, 1461,  980, 1802, 1197, 1866, 1430, 1659, 1810, 1526,   68,  705,  169,  754,  190, 1069, 1848,  920,   39, 1528,
                                    327,  660, 1923,  693, 1226,  121,  902,  259, 1352,  483,  170,  382, 1527,   51,  160,  495,  777, 1076, 1413,  182,
                                   1662, 1755,  563, 1935, 1882,  441,  198,  963,  275, 1843,  667, 1825,   82,  313,  873,  881,  597, 1572,  300, 1794,
                                   1110,  314,  674,  779, 1771, 1552,   47,  311, 1568,  616, 1926,  559, 1420,  331,   28,  172, 1447, 1323,   37, 1858,
                                   1891, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569,  346,   13, 1821, 1476,  132, 1493,  736,  345,  890,
                                   1222, 1096,  763,  137, 1554,  510,  602, 1847,  836,  386, 1652,  330,  545,   41,   25,  692,  761,  689,  741, 1548,
                                   1157,  564,  859,  764, 1668, 1168, 1321,  322,  394,  419,   71, 1797, 1841, 1030, 1818, 1933,  778,  595,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  762, 1275,  107, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401, 1086, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756 ],
                                 [ undefined, // S14, ZAT 35
                                    930, 1461,  980, 1802, 1197, 1866, 1430, 1659, 1810, 1526,   68,  705,  169,  754,  190, 1069, 1848,  920,   39, 1528,
                                    327,  660, 1527,  693, 1226,  121,  902,  259, 1352,   51,  170,  382, 1923,  483,  160, 1755,  777, 1076, 1413,  182,
                                   1662,  495,  563, 1935, 1882,  667, 1794,  963,  275, 1843,  441, 1825,   82,  313,  873,  881,  597, 1572,  300,  198,
                                   1110,  314,  674,  779, 1771, 1552,   47,  311, 1568,  616, 1926,  559, 1420,  331,   28,  172, 1447, 1323,   37, 1858,
                                   1891, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569,  346,   41, 1821, 1476,  132, 1493,  736,  345, 1222,
                                    890, 1096,  763,  137, 1554,  510,  602, 1847,  836,  386, 1652,  330,  545,   13,   25,  692,  761,  689,  741, 1548,
                                   1157,  564,  859,  764, 1668, 1168, 1321,  322,  394,  419,   71, 1797, 1841, 1030, 1818, 1933,  778,  595,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  762, 1275,  107, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401, 1086, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756 ],
                                 [ undefined, // S14, ZAT 34
                                    930, 1461,  980, 1430, 1197, 1866, 1802,  705, 1810,  920,   68, 1659, 1528,  754,  693, 1069,  660, 1526,  902,  169,
                                    327, 1848, 1527,  190, 1226,  121,   39,  483, 1352,   51, 1662,  495, 1923,  259,  160, 1755,  777, 1076,  963,  182,
                                    170,  382,  563, 1935, 1882,  667, 1794, 1413,  275, 1843,  441, 1825,   82,  313, 1552,  881,  597, 1572,  300,  198,
                                   1110,  314,  674,  779, 1771,  873,   47,  311, 1568,  616, 1926,  559, 1420,  331,   28,  172, 1447, 1323,   37, 1858,
                                    346, 1164,  224,  157,  696,  582,  977, 1838, 1190, 1813,  569, 1891,   41, 1821, 1476,  132, 1493,  736,  345, 1222,
                                    890, 1096,  763,  137, 1554,  510,  602, 1847,  836,  386, 1652,  330,  545,   13,   25,  692,  761,  689,  741, 1548,
                                   1157,  564,  859,  764, 1668, 1168, 1321,  322,  394,  419,   71, 1797, 1841, 1030, 1818, 1933,  778,  595,  242, 1261,
                                    524, 1795,  252, 1822, 1596, 1820, 1152,   86, 1910,  878,  734,  352, 1209,  762, 1275,  107, 1929,  820,  214,  436,
                                    699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401, 1086, 1359, 1832, 1006,  451,  823,  824,  663, 1758,
                                   1176,   38, 1724, 1756 ],
                                 [ undefined, // S14, ZAT 33
                                    930, 1461,  980,/#728#/1430, 1197, 1866, 1802,  705, 1810,  920,   68, 1659, 1528,  754,  693, 1069,  660, 1526,  902,
                                    169,  327, 1848, 1527,  190, 1226,  121,   39,  483, 1352,   51, 1662,  495, 1923,  259, 1755,  160,  313,  275,  963,
                                    182,  170,  382,  563, 1935,  779,  667, 1794, 1413, 1076, 1843,  441, 1825,   82,  777, 1552,  881,  597, 1572,  300,
                                    198, 1110,  314,  674, 1882, 1771,  873,  224,  311, 1568,  616, 1926,  559, 1420,  331,   28,  172, 1447, 1323,   37,
                                   1858,  346, 1164,   47,  157,  696,  582,  977, 1838, 1190, 1813,  569, 1891,   41, 1821, 1476,  132, 1493,  736,  345,
                                   1222,  763, 1096,  890,  137, 1554,  510,  602, 1548,  836,  386, 1652,  330,  545,   13,   25,  692,  761,  689,  741,
                                   1847, 1157,  564,  859,  764, 1668, 1168, 1321,  322,  394, 1910,   71, 1797, 1841, 1030, 1818, 1933,  778,  595,  242,
                                   1261,  524, 1795,  252, 1822, 1596, 1820, 1152,   86,  419,  878,  734,  352, 1209,  762, 1275,  107, 1929,  820,  214,
                                    436,  699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401, 1086, 1359, 1832, 1006,  451,  823,  824,  663,
                                   1758, 1176,   38, 1724, 1756 ],
                                 [ undefined, // S14, ZAT 32
                                    980, 1461,  930,  728, 1802, 1197, 1866, 1430,  920, 1810,  705, 1526,  660, 1528,  754,  693, 1069, 1659,   68,  121,
                                     39, 1923, 1352, 1527,  190, 1226,  902,  169,  483, 1848,   51, 1662,  495,  327,  259,  563,  160,  779,  275,  963,
                                    182,  170,  382, 1755, 1935,  313,  667, 1794, 1552, 1076, 1843,  441, 1825,   82,  777, 1413,  881,  597, 1572,  300,
                                    198, 1110,  314,  674, 1882, 1771, 1323,  224,  311, 1568,  616,  346,  559, 1420,  331,   28,  172, 1447,  873,   37,
                                   1858, 1926, 1164,   47,  157,  696,  582,  977, 1838, 1190, 1813,  569,  602,   41, 1821, 1476,  132, 1493,  736,  345,
                                   1222,  763, 1096,  890,  137, 1554,  510, 1891, 1548,  836,  386, 1652,  330,  545,   13,   25,  692,  761,  689,  741,
                                   1847, 1157,  564,  859,  764, 1668, 1168, 1321,  322,  394, 1910,   71, 1797, 1841, 1030, 1818, 1933,  778,  595,/#798#/
                                    242, 1261,  524, 1795,  252, 1822, 1596, 1820, 1152,   86,  419,  878,  734,  352, 1209, 1176, 1275,  107, 1929,  820,
                                    214,  436,  699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663, 1758,  762,   38, 1724, 1756 ],
                                 [ undefined, // S14, ZAT 31
                                    980, 1461,  930,  728, 1802, 1197, 1866, 1430,  920, 1810,  705, 1526,  660, 1528, 1069,  693,  754, 1659,   68,  121,
                                     39, 1923, 1352, 1527,  190, 1226,  902,  169,  495, 1848,   51,  170,  483,  327,  259,  563,  160,  779,  275, 1076,
                                    182, 1662,  382, 1755, 1935,  313,  667, 1794, 1552,  963, 1843,  441, 1825,   82,  777, 1413,  881,  597, 1572,  300,
                                    198,  224,  314,  674,  311, 1771, 1323, 1110, 1882, 1568,  616,  346,  559, 1420,  331,   28,  172, 1447,  873,   37,
                                   1858, 1926, 1164,   47,  157,  696,  582,  977, 1838, 1190, 1813,  569,  602,   41, 1821, 1476,  132, 1493,  736,  345,
                                   1222,  763, 1096,  890,  137, 1554,  510, 1891, 1548,  836,  386, 1652,  330,  545,   13,   25,  692,  761,  689,  741,
                                    798, 1157,  564,  859,  764, 1668, 1168, 1321,  322,  394, 1910,   71, 1797, 1841, 1030, 1818, 1933,  778,  595, 1847,
                                    242, 1261,  524, 1795,  252, 1822, 1596, 1820, 1152,   86,  419,  878,  734,  352, 1209, 1176, 1275,  107, 1929,  820,
                                    214,  436,  699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663, 1758,  762,   38, 1724 ],
                                 [ undefined, // S14, ZAT 30
                                    980, 1461,  930,  728, 1802, 1197,  705, 1430,  920, 1528, 1866,  121,  660, 1810, 1069,  693,  754, 1659,   68, 1526,
                                     39,  495, 1352, 1527,  190, 1226,  902,  169, 1923, 1848,   51,  170,  483,  327,  259,  563,  160,  779,  275, 1076,
                                    182, 1662,  382, 1755, 1935,  313,  667, 1794, 1552,  963, 1843,  441, 1825,  597,  777, 1413,  881,   82, 1572,  300,
                                    198,  224, 1568,  674,  311, 1771, 1323, 1110, 1882,  314,  616,  346,  559, 1420,  331,   28,  172, 1447,  873,   37,
                                   1858, 1926, 1164,   47,  157,  696,  582,  977, 1838, 1190, 1813,  569,   41,  602, 1821, 1476,  132, 1493,  736,  345,
                                   1222,  763, 1096,  890,  137, 1554,  510, 1891, 1548,  836,  386, 1652,  330,  545,   13,   25,  692,  761,  689,  741,
                                    798, 1157,  564,  859,  764, 1668, 1168, 1321,  322,  394, 1910,   71, 1797, 1841, 1030, 1818, 1933,  352,  595, 1847,
                                    242, 1261,  524, 1795,  252, 1822, 1596, 1820, 1152,   86,  419,  878,  734,  778, 1209, 1176, 1275,  107, 1929,  820,
                                    214,  436,  699, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663, 1758,  762,   38, 1724 ],
                                 [ undefined, // S14, ZAT 29
                                    980, 1461,  930,  728, 1802, 1197,  705, 1430,  920, 1528, 1866,  121,  660, 1810, 1069,  693, 1527, 1659,   68, 1526,
                                     39,  495, 1352,  754,   51, 1226,  902,  169, 1923, 1848,  190,  170, 1755,  327,  779,  563,  160,  259,  275, 1076,
                                    182, 1662,  382,  483, 1935,  313,  667, 1794, 1552,  963, 1843,  441, 1825,  597,  777, 1413,  881,   82, 1572,  300,
                                   1110,  224, 1568,  674,  311, 1771, 1323,  198, 1882,  314,  616,  346,  559, 1420,  331,   28,  172, 1447,  873,   37,
                                   1858, 1926, 1164,   47,  157,  696,  582,  977, 1838, 1190, 1813,  569,   41,  602, 1821, 1476,  132, 1493,  736,  345,
                                   1222,  763, 1096,  890,  137, 1554,  510, 1891, 1548,  836,  386, 1652,  330,  545,   13,   25,  692,  761,  689,  741,
                                    798, 1157,  564,  859,  764, 1668, 1168, 1321,  322,  394, 1910,   71, 1797, 1841, 1030, 1818, 1933,  352,  595,  107,
                                    242, 1261,  524, 1795,  252, 1822, 1596, 1820, 1152,   86,  699,  878,  734,  778, 1209, 1176, 1275, 1847, 1929,  820,
                                    214,  436,  419, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663, 1758,  762,   38, 1724 ],
                                 [ undefined, // S14, ZAT 28
                                    980, 1461,  930,  728, 1802, 1197,  705, 1430,  920, 1528, 1526,  121,  660, 1810, 1069,  693, 1527, 1659,   68, 1866,
                                     39,  495, 1352,  754,   51, 1226,  902,  169, 1923,  160,  190,  182, 1755,  327,  779,  563, 1848,  259,  275, 1076,
                                    170,  667,  382,  483, 1935,  313, 1662, 1794, 1552,  963, 1843,  441, 1825, 1568,  777, 1882,  881,   82, 1572,  300,
                                   1110,  224,  597,  674,  311, 1771, 1323,  172, 1413,  314,  616,  346,  559, 1420,  331,   28,  198, 1447,  873,   37,
                                   1858, 1926, 1164,   47,  157,  696,  602,  977, 1838, 1190, 1813,  569,   41,  582, 1821, 1476,  132, 1493,  736,  345,
                                   1222,  763, 1096,  890,  137, 1554,  510, 1891, 1548,  836,  386, 1652,  330,  545,   13,   25,  692,  761,  689,  741,
                                    798, 1152,  564,  859,  764, 1668, 1168, 1933,  322,  394, 1910,   71, 1797, 1841, 1030, 1818, 1321,  352,  595,  107,
                                    242, 1261,  524, 1795,  252, 1822, 1596, 1820, 1157,   86,  699,  878,  734, 1724, 1209, 1176, 1275, 1847, 1929,  820,
                                    214,  436,  419, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1881,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663, 1758,  762,   38,  778 ],
                                 [ undefined, // S14, ZAT 26 - 27
                                    930, 1461,  980,  728, 1802, 1197,  705, 1430,  920, 1528, 1526,  121,  660, 1810, 1527,  693, 1069,   51,   68, 1866,
                                     39,  779, 1352, 1755, 1659, 1226,  902,  169, 1923,  160,  190,  182,  754,  327,  495,  563, 1848,  259,  275, 1076,
                                    170,  667,  382,  313, 1935,  483, 1662, 1794, 1552,  963, 1843,  441, 1110, 1568,  224, 1882,  881, 1771, 1572,  300,
                                   1825,  777,  597,  674,  311,   82,  873,  172, 1413,  314,  616,  346,  559, 1420,  331,   28,  198, 1447, 1323,   37,
                                   1858, 1926, 1164,   47,  157,  696,  602,  977, 1838, 1190, 1813,  569,   41,  582, 1821, 1476,  132, 1493,  736,  345,
                                   1222,  763, 1096,  890,  137, 1554,  510, 1891, 1548,  836,  386, 1652,  330,  545,   13,   25,  692,  761,  689,  741,
                                    798, 1152,  564,  859,  764, 1668, 1168, 1933,  322,  394, 1910,   71, 1797, 1841, 1030, 1818, 1321,  352,  595,  107,
                                    242, 1261,  524, 1795,  252, 1822, 1596, 1820, 1157,   86,  699,  878,  734, 1724, 1209, 1176, 1275, 1881, 1929,  820,
                                    214,  436,   38, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1847,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663, 1758,  762,  419,  778 ],
                                 [ undefined, // S14, ZAT 25
                                    930, 1461,  980,  728, 1802, 1197,  705, 1430,  920, 1528, 1526,  121,  660, 1810, 1527,  693, 1069,   51,   68, 1866,
                                     39,  779, 1352, 1755, 1659, 1226,  902,  169, 1923,  160,  190,  182,  754,  327,  495,  563, 1848,  259,  275, 1076,
                                    170,  667,  382,  313, 1935,  483, 1662, 1794, 1552,  963, 1843,  441, 1110, 1568,  224, 1882,  881, 1771, 1572,  300,
                                   1825,  777,  597,  674,  311,   82,  873,  172, 1413,  314,  616,  346,  559, 1420,  331,   28,  198, 1447, 1323,   37,
                                   1858, 1926, 1164,   47,  157,  696,  602,  977, 1838, 1190, 1813,  569,   41,  582, 1821, 1476,  132, 1493,  736,  345,
                                   1222,  763, 1096,  890,  137, 1554,  510, 1891, 1548,  836,  386, 1652,  330,  545,   13,   25,  692,  761,  689,  741,
                                    798, 1152,  564,  859,  764, 1668, 1168, 1933,  322,  394, 1910,   71, 1797, 1841, 1030, 1818, 1321,  352,  595,  107,
                                    242, 1261,  524, 1795,  252, 1822, 1596, 1820, 1157,   86,  699,  878,  734, 1724, 1209, 1176, 1275, 1881, 1929,  820,
                                    214,  436,   38, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1847,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663, 1758,  762,  419 ],
                                 [ undefined, // S14, ZAT 24
                                    930, 1461,  980,  728, 1802, 1197,  705,  660,  920, 1528, 1866,  121, 1430, 1810, 1527,  693, 1069,   51,   68, 1526,
                                     39,  779, 1352, 1755,  182, 1226,  902,  169, 1923,  160,  190, 1659,  754,  327,  495,  563, 1848,  483,  275, 1076,
                                    170,  667,  382,  313, 1935,  259, 1662, 1794, 1825,  963, 1843,  441, 1110, 1568,  224, 1882,  881, 1771, 1572,  300,
                                   1552,  777,  597,  674,  311,   82,  873,  172, 1413, 1323,  616,  346,  559, 1420,  331,   28,  198, 1447,  314,   37,
                                   1858, 1926, 1164,   47,  157,  696,  602,  977, 1838, 1190, 1813,  569,   41,  582, 1821, 1476,  132, 1493,  736,  345,
                                   1222,  763, 1096,  890,  137, 1554,  510,  764, 1548,  836,  386, 1652,  330,  545,   13,   25,  692,  761,  689,  741,
                                    798, 1152,  564,  859, 1891, 1668, 1168, 1841,  322,  394, 1910,   71, 1797, 1933, 1030, 1818, 1321,  352,  595,  107,
                                    242, 1261,  524, 1795,  252, 1822, 1596, 1820, 1157,   86,  699,  878,  734, 1724, 1209, 1176, 1275, 1881, 1929,  820,
                                    214,  436,   38, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1847,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663, 1758,  762,  419 ],
                                 [ undefined, // S14, ZAT 23
                                    930, 1461,  980,  728, 1802, 1197,  705,  660,  920, 1527, 1866,  121, 1430, 1810, 1528,  693,  779,   51,  169, 1526,
                                     39, 1069, 1352, 1755,  182,  190,  902,   68, 1923,  160, 1226, 1659,  754,  327,  495,  563, 1848,  483,  275, 1076,
                                    170,  667, 1662,  313, 1935,  259,  382, 1794, 1825,  963, 1843,  441, 1110, 1568,  224,  300,  881, 1771, 1572, 1882,
                                   1552,  777,  597,  674,  311,  559,  873,  172, 1413, 1323,  616,  346,   82, 1420,  331,   28,  198, 1447,  314,   37,
                                   1858, 1926, 1164,   47,  157,  696,  602,  977, 1838, 1190, 1813,  569,   41,  582, 1821, 1476,  132, 1493,  736,  345,
                                   1222,  763, 1096, 1548,  137, 1554,  510,  764,  890,  836,  386, 1652,  330,  545,   13,   25,  692,  761,  689,  741,
                                    798, 1152,  564,  859, 1891, 1668, 1168, 1841,  322,  394, 1910,   71, 1797, 1933, 1030, 1818, 1321,  352,  595,  107,
                                    242, 1261,  524, 1795,  252, 1822, 1596, 1820, 1157,   86,  699,  878,  734, 1724, 1209, 1176, 1275, 1881, 1929,  820,
                                    214,  436,   38, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1847,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663, 1758,  762,  419 ],
                                 [ undefined, // S14, ZAT 22
                                    930, 1461,  980,  728,  660, 1197,  705, 1802,  920, 1527, 1866,  121, 1430, 1810, 1528,  693, 1352,   51,  169, 1526,
                                     39, 1069,  779, 1659,  182,  190,  902,   68, 1923,  160, 1226, 1755,  754,  327,  495,  563,  382,  483,  275, 1076,
                                   1568,  667, 1662,  313, 1935,  259, 1848, 1794, 1825,  963, 1843,  441, 1110,  170,  224,  300,  881, 1771, 1572, 1882,
                                   1552,  777,  597,  674,  311,  559,  873,  172, 1413, 1323,  616,  346,   82, 1420,  331,   28,  602, 1447,  314,   37,
                                   1858, 1926, 1164, 1821,  157,  696,  198,  977, 1838, 1190, 1813,  569,   41,  582,   47, 1476,  132, 1493,  736,  345,
                                   1222,  763, 1096, 1548,  137, 1554,  510,  764,  890,  836,  386, 1652,  330,  545,   13,   25,  692,  761,  689,  741,
                                    798, 1152,  564,  859, 1891, 1668, 1168, 1841,  322,  394, 1910,   71, 1797, 1933, 1030, 1818, 1321,  352,  595,  107,
                                    242, 1261,  524, 1795,  252, 1822, 1596, 1820, 1157,   86, 1275,  878,  734, 1724, 1209, 1176,  699, 1881, 1929,  820,
                                    214,  436,   38, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1847,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663, 1758,  762,  419 ],
                                 [ undefined, // S14, ZAT 21
                                    930, 1461,  728,  980,  660, 1197,  705, 1802,  920, 1527, 1866,  121, 1430,   51, 1528,  693, 1352, 1810,  169, 1526,
                                    190, 1069,  779, 1659,  182,   39,  902,   68, 1923,  160,  275, 1755,  754,  327, 1662,  563,  382,  313, 1226, 1076,
                                   1568,  667,  495,  483, 1935,  259, 1848, 1794, 1771,  963, 1843,  441, 1110,  170,  224,  300,  881, 1825, 1572, 1882,
                                   1552,  311,  597,  674,  777,  559,  873,  172, 1413, 1323,  616,  346,   82, 1420,  331,   28,  602, 1447,  314,   37,
                                   1858, 1926, 1164, 1821,  157,  696,  198,  977, 1838, 1190, 1813,  569,   41,  582,   47, 1476,  132, 1493,  736,  345,
                                   1222,  763, 1096, 1548,  137,  798,  510,  764,  836,  890,  386, 1652,  330,  545,   13,   25,  692,  761,  689,  741,
                                   1554, 1152,  564,  859, 1891, 1668, 1168, 1841,  322,  394, 1910,   71, 1797, 1933, 1030, 1818, 1321,  352,  595,  107,
                                    242, 1261,  524, 1795,  252, 1822, 1596, 1820, 1157,   86, 1275,  878,  734, 1724, 1209, 1176,  699, 1881, 1929,  820,
                                    214,  436,   38, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1758,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663, 1847,  762 ],
                                 [ undefined, // S14, ZAT 20
                                    930, 1461,  728, 1802,  660, 1197, 1527,  980, 1866,  705,  920,  121, 1430,  190, 1528,  693, 1352, 1810,  169, 1526,
                                     51, 1069,  779, 1659,  182,   39,  902,   68, 1923,  160,  275, 1755,  754,  327, 1662,  563,  382,  313, 1226, 1076,
                                   1568,  667,  495,  483, 1935, 1825, 1848, 1794, 1771,  963, 1843,  441, 1110,  170,  224,  300,  881,  259, 1572, 1882,
                                   1552,  311,  597,  674,  777,  559,  696,  172, 1413, 1323,  616,  346,   82, 1420,  331,   28,  602, 1447,  314,   37,
                                   1858, 1926, 1164, 1821,  157,  873,  198,  977, 1838, 1190, 1813,  569,   41,  582,   47, 1476,  132, 1493,  736,  345,
                                   1222,  763, 1096, 1548,  137,  798,  510,  764,  836,  890,  386, 1652,  330,  545,   13,   25,  692,  761,  689,  741,
                                   1554, 1152,  564,  859,  394, 1668, 1168, 1841,  322, 1891, 1910,   71, 1797, 1933, 1030, 1818, 1321,  352,  595,  107,
                                    242, 1261,  524, 1795,  252, 1822, 1596, 1820, 1157,   86, 1275,  878,  734, 1724, 1209, 1176,  699, 1881, 1929,  820,
                                    214,  436,   38, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1758,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663, 1847,  762 ],
                                 [ undefined, // S14, ZAT 19
                                    930, 1461,  728, 1802,  660, 1197, 1527,  980, 1866,  705,  920,  121, 1430,  190, 1528,  693, 1352, 1810,  169, 1526,
                                     51, 1069,  779, 1659,  182,   39,  902,   68, 1923,  160,  275, 1755, 1226,  327, 1662,  563,  382,  313,  754, 1771,
                                   1568,  667,  495,  170, 1935, 1825, 1848, 1794, 1076,  963, 1843,  441, 1110,  483,  224,  300,  881,  259, 1572, 1882,
                                   1552,  311,  597,  674,  777,  559,  696,  172, 1413, 1323,  616,  346, 1447, 1420,  331,   28,  602,   82,  314,   37,
                                   1858, 1926, 1164, 1821,  157,  873,  198,  977, 1838, 1190, 1813,  569,   41,  582,  798, 1476,  132, 1493,  736,  345,
                                   1222,  763, 1096, 1548,  137,   47,  510,  764,  836,  386,  890, 1652,  330,  545,   13,   25,  692,  761,  689,  741,
                                   1554, 1152,  564,  859,  394, 1668, 1168, 1841,  322, 1891, 1910,   71, 1797, 1933, 1030, 1818, 1321,  352,  595,  107,
                                    242, 1261,  524, 1795,  252, 1822, 1596, 1820, 1157,   86, 1275,  878,  734, 1724, 1209, 1176,  699, 1881, 1929,  820,
                                    214,  436,   38, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1758,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663, 1847,  762 ],
                                 [ undefined, // S14, ZAT 18
                                    930, 1461,  660,  980,  728, 1197,  920, 1802, 1866,  705, 1527,  121, 1430, 1352, 1528,  693,  190, 1810,  169, 1659,
                                     51, 1069,  160, 1526,  182,   39, 1662,   68, 1923,  779,  275, 1755, 1935,  327,  902,  563,  382,  313,  754, 1848,
                                   1568,  667,  495,  170, 1226, 1825, 1771, 1794, 1076,  963, 1843,  441, 1110,  483,  224,  300,  881,  259, 1572, 1882,
                                   1552,  311,  597,  674,  777,  559,  696,  172, 1413, 1323,  616,  346, 1447, 1420,  331,   28,  602,   82,  314,   37,
                                   1858, 1926, 1164, 1821,  157,  873,  198,  977, 1838, 1190, 1813,  569,   41,  582,  798, 1476,  132, 1493,  736,  345,
                                   1222,  763, 1096, 1548,  137,   47,  510,  764,  836,  386, 1652,  890,  330,  545,   13,   25,  692,  761,  689,  741,
                                   1554, 1152,  564,  859,  394, 1668, 1168, 1841,  322, 1891, 1910,   71, 1797, 1933, 1030, 1818, 1321,  352,  595,  107,
                                    242, 1261,  524, 1795,  252, 1822, 1596, 1820, 1157,   86, 1275,  878,  734, 1724, 1209, 1176,  699, 1881, 1929,  820,
                                    214,  436,   38, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1758,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663 ],
                                 [ undefined, // S14, ZAT 17
                                    930, 1461,  660,  980,  728, 1197,  920, 1802, 1866,  705, 1527,  121, 1430, 1352, 1528,  693,  190, 1069,  169, 1659,
                                     51, 1810,  160, 1526,  182,   39, 1662,   68,  170,  779,  275, 1755, 1935,  327,  902,  563,  382,  313,  754, 1848,
                                   1568,  667, 1110, 1923, 1226,  881, 1771, 1794, 1076,  963, 1843,  441,  495,  311,  224,  300, 1825,  259, 1572, 1882,
                                   1552,  483,  597,  674,  777,  559,  696,  172, 1413, 1323,  616,  346, 1447, 1420,  331,   28,   37,   82, 1222,  602,
                                   1858, 1926, 1164, 1821,  157,  873,  198,  977, 1838, 1190, 1813,  569,   41,  582,  798, 1476,  132, 1493,  736,  345,
                                    314,  763, 1096, 1548,  137,   47,  510,  764,  836,  386, 1652,  890,  330,  545,   13,   25,  692,  761,  689,  741,
                                   1554, 1152,  564,  859,  394, 1668, 1168,  322, 1841, 1891, 1910,   71, 1797, 1933, 1030, 1818, 1724,  352,  595,  107,
                                    242, 1261,  524, 1795,  252, 1822, 1596, 1820, 1157,   86, 1275,  878,  734, 1321, 1209, 1176,  699, 1881, 1929,  820,
                                    214,  436,   38, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1758,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663 ],
                                 [ undefined, // S14, ZAT 16
                                   1461,  930,  660,  980,  728, 1197,  920, 1430, 1866,  705, 1527,  693, 1802, 1352,  169,  121,  190, 1810, 1528, 1526,
                                     39, 1069,  160, 1659,  182,   51,  327,   68,  170,  779, 1935, 1755,  275, 1662,  902,  563,  382,  495,  754,  881,
                                   1568,  667, 1110, 1923, 1226, 1848, 1825, 1794, 1076,  963,  483,  441,  313,  311,  224,  300, 1771,  259, 1572, 1882,
                                     82, 1843,  597,  674,  777,  559,  696,  198, 1413, 1323,  616,  346, 1447, 1420,  331,  602,   37, 1552, 1222,   28,
                                   1858, 1926, 1164, 1821,  157,  873,  172,  977, 1838, 1190, 1813,  569,   41,  582,  798, 1476,  132, 1493,  736,  345,
                                   1096,  763,  314, 1548,  137,   47,  510,  764,  836,  386, 1652,  890,  330,  545,   13,   25,  692,  761,  689,  741,
                                   1554, 1152,  564,  859,  394, 1668, 1168,  322, 1841, 1596, 1910,   71, 1797, 1933, 1030, 1818, 1724,  352,  595,  107,
                                    242, 1261,  524, 1795,  252, 1822, 1891, 1820, 1157,   86, 1275,  878,  734, 1321, 1209, 1176,  699, 1881, 1929,  820,
                                    214,  436,   38, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1758,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663 ],
                                 [ undefined, // S14, ZAT 13 - 15
                                   1461,  930,  660,  980,  728, 1197,  920, 1430, 1866,  705, 1527,  693, 1802, 1352,  169,  121,  190, 1810, 1528, 1526,
                                     39, 1069, 1755, 1659,  182,   51,  327,   68,  170,  779, 1935,  160,  275, 1662,  902,  563,  382,  495,  754,  881,
                                   1568,  667, 1110, 1923, 1226, 1848, 1825, 1794, 1076,  963,  483,  441,  313,  311,  224,  300, 1771,  696, 1572, 1882,
                                     82, 1843,  597,  674,  777,  559,  259,  198, 1413, 1222,  616,  346, 1447, 1420,  331,  602,   37, 1552, 1323,   28,
                                   1858, 1926, 1164, 1821,  157,  873,  172,  977, 1838, 1190, 1813,  569,   41,  582,  798, 1476,  132, 1493,  736,  345,
                                   1096,  763,  314, 1548,  137,   47,  510,  564,  836,  386, 1652,  330,  890,  545,   13,   25,  692,  761,  689,  741,
                                   1724, 1152,  764,  859,  394, 1668, 1168,  322, 1910, 1596, 1841,   71, 1797, 1933, 1030, 1818, 1554,  352,  595,  107,
                                    242, 1261,  524, 1795,  252, 1822, 1891, 1820, 1157,   86, 1275,  878,  734, 1758, 1209, 1176,  699, 1881, 1929,  820,
                                    214,  436,   38, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1321,  401, 1086, 1359, 1832, 1006,  451,  823,  824,
                                    663 ],
                                 [ undefined, // S14, ZAT 12
                                   1461,  930,  660,  980,  728,  705,  920, 1430, 1866, 1197, 1527,  693, 1802, 1352,  169, 1659,  190, 1810,   68, 1526,
                                     39, 1069, 1755,  121,  182, 1935, 1662, 1528,  170,  779,   51,  160,  275,  327,  667,  563,  382,  495,  754,  881,
                                   1568,  902, 1110, 1923, 1226, 1848, 1825, 1843, 1076,  963,  483,  441,  313,  311,  224,  300, 1552,  696, 1572, 1882,
                                     82, 1794,  597,  674,  777,  559,  259,  198, 1813, 1222,  616,  346, 1447, 1420,  331,   28,   37, 1771, 1323,  602,
                                   1858, 1926, 1164, 1821,  157,  873,  172,  977, 1838, 1190, 1413,  569,   41,  582,  798, 1476,  132, 1493,  736,  345,
                                   1096,  763,  314, 1548,  137, 1818,  510,  564,  836,  386, 1652,  330,  890,  545,   13,   25,  692,  761,  689,  741,
                                   1724, 1152,  764,  859,  394, 1668, 1168,  322, 1910, 1596, 1841,   71, 1797, 1933, 1030,   47, 1554,  352,  595,  107,
                                    242, 1261,  524, 1795,  252, 1822, 1891, 1820, 1157,   86, 1275,  878,  734, 1758, 1209, 1176,  699, 1881, 1929,  820,
                                    214,  436,   38, 1238,   67, 1292, 1177, 1186, 1787,   21,  493, 1321,  401, 1086, 1359, 1832, 1006,  451,  823,  824 ],
                                 [ undefined, // S14, ZAT 11
                                   1461,  930,  660,  980,  728,  705,  920, 1430, 1866, 1197, 1527,  693, 1802, 1352,  169, 1659,  190, 1810,   68, 1526,
                                   1755, 1069,   39,  121,  182, 1935, 1662, 1528,  170,  779,   51,  160,  275,  327,  667,  563,  382,  495, 1110,  881,
                                   1568,  902,  754, 1848, 1226, 1923, 1825, 1843, 1076,  963,  224,  441,  313,  311,  483,  300, 1552,  696, 1882, 1572,
                                     82, 1794,  597,  674,  777,  559,  259,  198, 1813, 1222,  616,  346, 1447, 1420,  331,   28,   37, 1771, 1323,  602,
                                   1858, 1926, 1164, 1821,  157,  873,  172,  977, 1838, 1190, 1413,  569,   41,  510,  798, 1476,  132, 1493,  736,  345,
                                   1096,  763,  314, 1548,  137, 1818,  582,  564,  836,  386, 1652,  330,  545,  890,   13,   25,  692,  761,  689,  741,
                                   1724, 1152,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841, 1797, 1933, 1030,   47, 1758,  352,  595,  764,
                                    242, 1261, 1177, 1795,  252, 1822, 1891, 1820, 1157,   86, 1275,  878,  734, 1554, 1209, 1176,  699, 1881, 1929,  820,
                                    214,  436,   38, 1238,   67, 1292,  524, 1186, 1787,   21,  493, 1321,  401, 1086, 1359, 1832, 1006,  451,  823,  824 ],
                                 [ undefined, // S14, ZAT 10
                                   1461,  930,  660,  980,  728,  705,  920, 1430, 1866, 1197, 1659,  693, 1802, 1352, 1810, 1527,  190,  169,   68, 1526,
                                   1755,  170,   39,  121,  182, 1935, 1662,   51, 1069,  382, 1528,  160,  563,  327,  667,  275,  779,  495,  483,  881,
                                   1568,  902,  754, 1848, 1226, 1923, 1825, 1843, 1076,  963,  224,  441,  313,  311, 1110,  300, 1552,  696, 1882, 1572,
                                     82, 1794,  597,  674,  777,  559,  602,  198, 1813, 1222,  616,  346, 1447, 1420,  331,   28,   37, 1771, 1323,  259,
                                   1858, 1926, 1164, 1821,  157,  873,  172,  977, 1838, 1190, 1413,  569, 1818,  510,  798, 1476,  132, 1493,  736,  345,
                                   1096,  763,  314, 1548,  137,   41,  582,  564,  836,  386, 1652,  330,  545,   13,  890,   25,  692,  761,  689,  741,
                                   1724, 1152,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841, 1797, 1933, 1030,   21, 1758,  352,  595,  764,
                                    242, 1261, 1177, 1795,  252, 1822, 1891, 1820, 1157,   86, 1275,  878,  734, 1554, 1209, 1176,  699, 1881, 1929,  820,
                                    214,  436,   38, 1238,   67, 1292,  524, 1186, 1787,   47,  493,  451,  401, 1086, 1359, 1832, 1006, 1321,  823,  824 ],
                                 [ undefined, // S14, ZAT 8 - 9
                                   1461,  930,  660,  980,  728,  705,  920, 1430, 1866, 1197, 1659,  693, 1802, 1352, 1810, 1527,  190,  169,   68, 1526,
                                   1755,  170,   39,  121,  182, 1935,  327,   51, 1069,  382, 1528,  495,  563, 1662,  667,  275,  779,  160,  483,  881,
                                   1568,  902,  754, 1848, 1226, 1923,  300, 1843, 1076,  963,  224,  441,  313,  311, 1110, 1825, 1552,  696, 1882,  559,
                                    616, 1794,  597,  674,  777, 1572,  602,  873, 1813, 1222,   82,  346, 1447, 1420,  331,   28,   37, 1771, 1323,  259,
                                   1858, 1926, 1164, 1821,  157,  198,  172,  977, 1838, 1190,  564,  569, 1818,  510,  798, 1476,  132, 1493,  736,  345,
                                   1096,  763,  314, 1548,  137,   41,  582, 1413,  836,  386, 1652,  330,  545,   13,  890,   25,  692,  761,  689,  741,
                                   1724, 1152,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841, 1797, 1933, 1030,   21, 1758,  352,  595, 1209,
                                    242, 1261, 1177, 1795,  252, 1822, 1891, 1820, 1157,   86, 1275,  878,  734,  823,  764, 1176,  699, 1881, 1929,  820,
                                    214,  436,   38, 1238,   67, 1292, 1006, 1186, 1787,   47,  493,  451,  401, 1086, 1359, 1832,  524, 1321, 1554 ],
                                 [ undefined, // S14, ZAT 7
                                   1461,  930,  660,  980,  728,  705,  920, 1430, 1866, 1197, 1659,  693, 1802, 1352, 1810, 1527,  190,  169,   68, 1526,
                                   1755,  170,   39,  121,  182, 1935,  327,   51, 1069,  382, 1528,/#1204#/495,  563, 1662,  667,  275,  779,  160,  483,
                                    881, 1568,  902,  754, 1848, 1226, 1923,  300, 1843, 1076,  963,  224,  441,  313,  311, 1110, 1825, 1552,  696, 1882,
                                    559,  616, 1794,  597,  674,  777, 1572,  602,  873, 1813, 1222,   82,  346, 1447, 1420,  331,   28,   37, 1771, 1323,
                                    259, 1858, 1926, 1164, 1821,  157,  198,  172,  977, 1838, 1190,  564,  569, 1818,  510,  798, 1476,  132, 1493,  736,
                                    345, 1096,  763,  314, 1548,  137,   41,  582, 1413,  836,  386, 1652,  330,  545,   13,  890,   25,  692,  761,  689,
                                    741, 1724, 1152,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841, 1797, 1933, 1030,   21, 1758,  352,  595,
                                   1209,  242, 1261, 1177, 1795,  252, 1822, 1891, 1820, 1157,   86, 1275,  878,  734,  823,  764, 1176,  699, 1881, 1929,
                                    820,  214,  436,   38, 1238,   67, 1292, 1006, 1186, 1787,   47,  493,  451,  401, 1086, 1359, 1832,  524, 1321 ],
                                 [ undefined, // S14, ZAT 6
                                   1461,  930,  660,  920,  705,  728,  980, 1430, 1866, 1352, 1659,  693, 1802, 1197, 1810, 1527,  190,  121,   68, 1526,
                                   1755, 1528,   39,  169,  182, 1935,  495,  667, 1069,  382,  170, 1204,  327,  160,  275,   51, 1662,  779,  563,  483,
                                    881, 1568,  902,  754, 1848, 1226, 1923,  300, 1843, 1076,  963,  224,  441,  313,  311, 1110, 1825, 1552,  696, 1882,
                                    559,  616, 1794,  597,  674,  777, 1572,  602,  873, 1813, 1222,   82,  346, 1447, 1420,  331,   28,   37, 1771, 1323,
                                    259, 1858, 1926, 1164, 1821,  157,  198,  172,  977, 1838, 1190,  564,  569, 1818,  510,  798, 1476,  132, 1493,  736,
                                    345, 1096,  763,  314, 1548,  137, 1724, 1797, 1152,  836,  386, 1652,  330,  545,   13,  890,   25,  692,  761,  689,
                                    741,   41, 1413,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,  582, 1933, 1030,   21, 1758,  352,  595,
                                   1209,  242, 1261, 1177, 1795,  252, 1822, 1891, 1820, 1157,   86, 1275,  878,  734,  823,  451, 1176,  699, 1881, 1929,
                                    820,  214,  436,   38, 1238,   67, 1292, 1006, 1186, 1787,   47,  493,  764,  401, 1086, 1359, 1832,  524, 1321 ],
                                 [ undefined, // S14, ZAT 5
                                    930, 1461,  660,  920,  705,  728,  980, 1430, 1802, 1352, 1659,  693, 1866, 1197, 1755, 1527, 1935,  121,   68, 1526,
                                   1810, 1528,   39,  169,  182,  190,  495,  667, 1069,  382,  170,  779,  327,  160,  275,   51, 1662, 1204,  563,  483,
                                    881, 1568,  902,  224, 1848, 1110, 1923,  300, 1843, 1076,  963,  754,  441,  313,  311, 1226, 1825, 1552,  696, 1882,
                                    559,  616, 1794,  597,  674,  777, 1572,  602,  873, 1813, 1222,   82,  346, 1447, 1420,  331,   28,   37, 1771,  314,
                                    259, 1858, 1926, 1164, 1821,  157,  198,  172,  977, 1838, 1190,  564,  569, 1818,  510,  798, 1476,  132, 1493,  736,
                                    345, 1096,  763, 1323, 1548,  137, 1724, 1797, 1152,  836,  386, 1652,  330,  545,   13,  890,   25,  692,  761,  689,
                                    741,   41, 1413,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,  582, 1030, 1933,   21, 1758,  352,  595,
                                   1209,  242, 1261, 1177, 1795,  252, 1822, 1891, 1820, 1157,   86, 1275,  878,  734,  823,  451, 1176,  699, 1881, 1929,
                                    820,  214,  436,   38, 1238,   67, 1292, 1006, 1186, 1787,   47,  493,  764,  401, 1086, 1359, 1832,  524, 1321 ],
                                 [ undefined, // S14, ZAT 4
                                    930, 1461,  660,  920,  705,  728,  980, 1659, 1802, 1352, 1430, 1526, 1810, 1197, 1755, 1527, 1935,  121,  182,  693,
                                   1866, 1528,  170,  169,   68,  275,  495,  667, 1069,  382,   39,  779,  327,  160,  190,  902, 1662, 1204,  563,  483,
                                    881, 1568,   51,  224, 1848, 1110, 1923,  300, 1843, 1076,  963,  754,  441,  313,  311, 1226, 1825, 1552,  331, 1882,
                                    559,  616, 1794,  597,  674,  777, 1572,  602,  873, 1813, 1222,   82,  346, 1447, 1420,  696,   28,   37, 1771,  314,
                                    259, 1858, 1926, 1164, 1821,  157,  198,  172,  977, 1838, 1190,  564,  569, 1818,  510,  798, 1476,  132, 1493,  736,
                                    345, 1096,  763, 1323, 1548,  137, 1724, 1797, 1152,  836,  386, 1652,  330,  545,   13,  890,   25,  692,  761,  689,
                                    741, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,  582, 1030, 1933,   21, 1758,  352,  595,
                                   1209,  242,   41, 1177, 1795,  252, 1822, 1891, 1820, 1157,   86, 1413,  878,  734,  823,  451, 1176,  699, 1881, 1929,
                                    820,  214,  436,   38, 1238,   67, 1292, 1006, 1186, 1787,  764,  493,   47,  401, 1086, 1359, 1832,  524, 1321 ],
                                 [ undefined, // S14, ZAT 3
                                    930, 1461,  660,  920,  705,  728, 1802, 1659,  980, 1352, 1430, 1526, 1810, 1197, 1755, 1528, 1935,  121,  182,  693,
                                   1866, 1527,  170,  169,   68,  275,  327,  667,  779,  382,   39, 1069,  495,  160,  190,  902, 1662, 1204,  563,  483,
                                    881, 1568,   51,  224, 1848, 1110, 1923,  300, 1843, 1076,  963,  674, 1882,  313,  311, 1226, 1825, 1552,  331,  441,
                                    559,  616, 1794,  597,  754,  777, 1572,  602,  873, 1813, 1222,   82,  346, 1447, 1420,  696,   28,   37, 1771,  314,
                                   1493, 1858, 1926, 1164, 1821,  157,  198,  172,  977, 1838, 1190,  564,  569, 1818,  510,  798, 1476,  132,  259,  736,
                                    345, 1096,  763, 1323, 1548,  137, 1724, 1797, 1152,  836,  386, 1652,  330,  545,   13,  890,   25,  692,  761,  689,
                                    741, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,  582, 1030, 1933,   21, 1758,  352,  595,
                                   1209,  242,   41, 1177, 1795,  252, 1822, 1891, 1820, 1157,   86, 1413,  878,  734,  823, 1086, 1359,  699, 1881, 1929,
                                    820,  214,  436,   38, 1238,   67, 1292, 1006, 1186, 1787,  764,  493,   47,  401,  451, 1176, 1832 ],
                                 [ undefined, // S14, ZAT 2
                                    930, 1461,  660,  980, 1802,  728,  705, 1755,  920, 1352, 1430, 1935, 1810, 1528, 1659, 1197, 1526,  121,  182,  693,
                                    667, 1527,  170,   39,   68, 1069,  495, 1866,  881,  382,  169,  275,  327,  160,  190, 1568, 1662, 1204,  563,  483,
                                    779,  902,   51,  224, 1848, 1110, 1923,  300, 1843, 1076,  963,  674,  616,  313, 1552, 1222, 1825,  311,  331,  441,
                                    559, 1882, 1794,  597,/#133#/ 754,  777, 1572,  602,  157, 1813, 1226,   82,  346, 1447, 1420,  696,   28,   37, 1771,
                                    314, 1493, 1858, 1190, 1164, 1821,  873,  198,  172,  977, 1838, 1926,  564,  569, 1818,  510,  798, 1476,  132,   25,
                                    736,  345, 1096,  763, 1323, 1548,  137, 1724, 1797, 1152,  836,  386, 1652,  330,  545,   13,  890,  259,  692,  761,
                                    689,  741, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,  436, 1030, 1933,   21, 1758,  352,
                                    595, 1209,  242, 1881, 1177, 1795,  252, 1822, 1891, 1820, 1157,   86, 1787,  878,  734,  823, 1086, 1359,  699,   41,
                                   1929,  820,  214,  582,   38, 1238,   67, 1292, 1006, 1186, 1413,  451,  493,   47,  401,  764, 1176, 1832 ],
                                 [ undefined, // S14, ZAT 1
                                    930, 1461,  660,  980, 1802,  728,  705, 1755,  920, 1352, 1430, 1935, 1810, 1528, 1659, 1197, 1526,  170,  182,  693,
                                    667, 1527,  121,   39,   68, 1069,  495, 1866,  881,  382,  169,  275,  327, 1848, 1662, 1568,  190, 1204,  300,  483,
                                    779,  902,   51,  224,  160, 1110, 1923,  563, 1843, 1076,  963,  674,  616,  313, 1552, 1222, 1825,  311,  331,  441,
                                    559, 1882, 1794,  597,  133,  754,  777, 1572,  602,  157, 1813, 1226,   82,  346, 1447, 1420,  696,   28,   37, 1771,
                                    314, 1493, 1858, 1190, 1164, 1821,  873,  198,  172,  977, 1838, 1926,  564,  569, 1818,  510,  798, 1476,  132,   25,
                                    736,  345, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1652,  330,  545,   13,  890,  259,  692,  761,
                                    689, 1323, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,  436, 1030, 1933,   21, 1758,  352,
                                    595, 1209,  242, 1881, 1177, 1795,  252, 1822, 1891, 1820, 1157,   86, 1787,  878,  734,  823, 1086, 1359,  699,   41,
                                   1929,  820,  214,  582,   38, 1238,   67, 1292, 1006, 1186, 1413,  451,  493,   47,  401,  764, 1176, 1832 ],
                                 [ undefined, // S12, ZAT 1
                                   1574, 1872,  881, 1476, 1568,  728,  778, 1935, 1175, 1912,  133, 1802, 1755,  300, 1797,  569,  181, 1069, 1810,  705,
                                   1447,  161, 1018, 1652, 1030,  817,  980,  495,  798,  602,  145,  954,   67,  131, 1430,   51,  890,   13, 1261, 1789,
                                    520,  660,  314,  559,  920,  157, 1841,  837,   39,  510,  618,  169, 1420,   68, 1066,  404, 1226, 1933,  224, 1813,
                                   1126,  372,  382, 1237, 1758, 1816, 1493, 1096,  930, 1937,  121, 1572, 1794,  331,  761, 1848,   25, 1795,  381, 1858,
                                    766,  190, 1323,  327, 1923, 1016,  467, 1164, 1771,  736,  198,  616, 1772,  564, 1152,  758, 1461, 1889,  107,  715,
                                   1071,  182,  471,  691,  483, 1647,  148, 1662,  477,  689,  132,  273, 1596, 1222,  597,  963,   38,  674,  505,  340,
                                   1395,  330, 1212,  726,  160, 1818,  195, 1526,  333,  629,  582,  741,  595, 1157, 1377,  275, 1238, 1078,  152, 1528,
                                    796, 1820,  188,   86,  313, 1532,  252,  734,   82,  878,   75, 1822,  902,  242,  685, 1451 ],
                                 [ undefined, // S12, ZAT 2
                                   1574, 1872,  881, 1476, 1568,  728,  778, 1935, 1175, 1912,  133, 1802, 1755,  181, 1797,  569,  300, 1810, 1069,  705,
                                   1447,  161,  602, 1652,  817, 1030,  980,  495,  798, 1018,  145,  954,  559,  131, 1430,   51,  157,   13, 1261, 1789,
                                   1420,  660,  314,   67,  920,  890,  404,   68,   39,  510,  618,  169,  520,  837, 1066, 1841, 1226, 1933,  224, 1813,
                                   1126,  331,  382, 1237, 1758, 1816, 1493, 1096,  930, 1937,  121, 1572, 1794,  372,  761, 1848,   25, 1795,  564, 1858,
                                    766,  190, 1323,  327, 1923,  107,  616, 1152, 1771,  736,  198,  467, 1772,  381, 1164,  273, 1461, 1889, 1016,  715,
                                   1071,  182,  471,  691,  483, 1647,  148, 1662,  477,  689,  132,  758,  330, 1222,  597,  963,  674,   38,  505,  340,
                                   1395, 1596, 1212,  726,  160, 1818,  195, 1526,  333,  629,  582,  741,  595, 1157, 1377,  275, 1238, 1451,  152, 1528,
                                   /#796#/188, 1820,   86,  313, 1532,  252,  734,   82,  878,   75, 1822,  902,  242,/#685#/1078, 1181, 1352,  419,  545,
                                   1209,  610,  346, 1901,  820, 1790,  376, 1659, 1036,  836, 1150, 1576,  463,  667,  352, 1821, 1110,  264, 1190, 1396,
                                    373, 1197,  779 ],
                                 [ undefined, // S12, ZAT 3
                                   1574, 1872,  881, 1476,  778,  728, 1568, 1935, 1175, 1912,  133, 1755, 1802,  181, 1797, 1447,  300, 1810, 1069,  705,
                                    569,  954,  602, 1652,  817, 1030,  980,/#131#/ 145, 1018,  798,  161,  559,  495, 1430,   51,  157,  510, 1261, 1789,
                                   1420,  169,  314,   67,  920,  890,  404,   68,   39,   13, 1226,  660,  520,  837, 1066, 1841,  618,  930,  224, 1813,
                                   1126,  331,  382, 1237, 1758,/#1816#/190,  121, 1933, 1937, 1096, 1858, 1794,  372,  761,   25, 1848,  327,  564, 1572,
                                    715, 1493, 1461, 1795, 1923,  107,  616, 1152, 1771,  736, 1772,  467,  198,  381, 1164,  273, 1323, 1889, 1016,  766,
                                    505,  182,  471, 1222, 1647,  483,  148, 1662,  477,  689,  132,  758,  330,  691,  597,  582,  674,   38, 1071,  340,
                                   1395, 1596, 1377,  726,  160, 1818,  195, 1526,  333,  629,  963,  741,  734, 1157, 1212,  275, 1238, 1451,  152, 1528,
                                    188, 1820,   86,  313, 1532,  252,  595,   82,  878,   75,  242,  902, 1822, 1078, 1181, 1352,  419,  545, 1209,  610,
                                    346, 1901,  820, 1790,  376, 1659, 1036,  836, 1150, 1576,  463,  667,  352, 1821, 1110,  264, 1190, 1396,  373, 1197,
                                    779,  763,  455, 1360, 1842, 1787, 1292,  307,  137,   16,  394,  436, 1910, 1203,  172, 1224,  859 ],
                                 [ undefined, // S12, ZAT 4
                                   1574, 1872,  881, 1912,  778, 1568,  728, 1935, 1175, 1476, 1802, 1755,  133, 1447, 1797,  181,  300, 1810,  705, 1069,
                                    569,  954,  602, 1652,  817, 1030,  980,  145, 1018,  798,  161,  559,  495, 1430,   51,  157,  510, 1261, 1789, 1420,
                                    169,  660,   67,  920,  890,  404,   68,   13,   39, 1226,  314,  520,  837, 1066,  382,  121,  930,  224, 1813,  331,
                                 /#1126#/1841, 1237, 1758,  190,  618,1858,/#1937#/1096, 1933, 1772,  372,  761,   25, 1848,  327,  564, 1572,  715, 1493,
                                   1461, 1923, 1795, 1323,  616, 1152, 1771,  736, 1794,  582,  198,  381,  597,  273,  107,  182, 1016,  766,  505, 1889,
                                    471, 1222, 1647,  691,  148, 1662,  477,  333,  132,  330,/#758#/ 483, 1164,  467,  674,   38, 1071,  726, 1395,  152,
                                   1377,  340,  160, 1818,/#195#/1526,  689,  629,  963,  741, 734,/#1157#/1212,  275,  313, 1451, 1596, 1528,  188, 1820,
                                     86, 1238, 1532,  252,  595,  242,  878,   75,   82,  902, 1822, 1190, 1181, 1360,  419,  545, 1209,  610, 1821, 1901,
                                    820,  667,  376, 1659, 1036,  836, 1150, 1576,  463,/#1790#/352,  346, 1110,  394, 1078, 1396,  373, 1197,  779,  763,
                                    455, 1352, 1842, 1787, 1292,  307,  137,   16,  264,  436, 1910, 1203,  172, 1224,  859, 1275,  322, 1663 ],
                                 [ undefined, // S12, ZAT 5
                                   1574, 1872,  881, 1912,  778, 1568,  728, 1935, 1175, 1476, 1802, 1755,  133, 1447, 1797,  181,  300, 1810,  705, 1069,
                                    569,  954,   51, 1652,  817, 1030,  980,  145, 1018,  798, 1420,  559,  495, 1430,  602, 1066,  510, 1261, 1789,  161,
                                    169,  660,   67,  920,  890,  404,   68,   13,   39, 1226,  314,  520,  837,  157,  382,  121,  930,  224, 1813,  331,
                                   1841, 1237, 1758,  190,  618, 1858, 1096, 1933, 1772,  372,  761,   25, 1848,  327,  564, 1572,  715, 1493, 1771, 1923,
                                   1795, 1323,  616, 1152, 1461,  736, 1794,  582,  148,  381,  597,  273,  107,  182, 1016,  766,  505,/#1889#/471, 1222,
                                   1647,  691,  198, 1662,  477,  333,  132,  330,  483, 1164,  467,  674, 1212, 1071,  726, 1395,  152, 1377,  340, 1528,
                                    963, 1526,  689,  629, 1818,  741,  734,   38,  275,  313, 1451, 1596,  160,  188, 1820,   86, 1238, 1532,  252,  595,
                                    242,  878,   75,   82,  902, 1822, 1190, 1181, 1360,  419,  545, 1209,  610, 1821, 1901,  820,  667,  376, 1659, 1036,
                                    836, 1150, 1576,  463,  352,  346, 1110,  394, 1078, 1396,  373, 1197,  779,  763,  455, 1352, 1842, 1787, 1910,  307,
                                    137,   16,/#264#/ 436, 1292, 1203,  172, 1224,  859, 1275,  322, 1663 ],
                                 [ undefined, // S12, ZAT 6
                                   1574, 1872,  881, 1912,  778, 1568, 1175, 1935,  728, 1476, 1802, 1810,  133, 1447, 1797,  817,  300, 1755,  705, 1069,
                                    569,  954,   51, 1652,  181, 1030,  980,  145, 1018,  798, 1420,  559,  495, 1430,  602, 1066,   39, 1261, 1789,  161,
                                    169,  660,   67,  920,  890,  404,   68,   13,  510,  157,  837,  382,  314, 1226,  520,  121,  761,  224, 1813,  331,
                                   1858, 1237, 1758,  190,  618, 1841, 1096, 1461, 1772,  327,  930,   25, 1848,  372,  564, 1572,  715, 1493, 1771, 1923,
                                   1222, 1323,  616, 1152, 1933,  736, 1794,  582,  148,  381,  597,  273,  107,  182, 1377,  766,  505,  471, 1795, 1647,
                                    691,  198, 1662,  477,  333,  132,  330,  483, 1164,  467,  674, 1212, 1071,  726, 1395,  152, 1016,  340, 1528,  963,
                                   1526,  313,  629, 1818,  741,  734,   38,  275,  689, 1451,  252,  160,  188,  242,   86, 1901, 1532, 1596, 1078, 1820,
                                    878,   82,   75,  902, 1822, 1190, 1181, 1360,  394,  545, 1209,  610, 1821, 1238,  820,  667,  376, 1292, 1910,  836,
                                   1150, 1576,  463,  352,  346, 1110,  419,  595, 1396,  373, 1663,  779,  763,  455, 1352, 1842, 1787,/#1036#/307,  137,
                                     16,  436, 1659, 1203,  172, 1224,  859, 1275,  322, 1197 ],
                                 [ undefined, // S12, ZAT 7 - 9
                                   1574, 1912,  778, 1872,  881, 1568, 1175, 1935,  728, 1802, 1476, 1810,  133, 1447,  705,  817,  300, 1755, 1797, 1069,
                                    569,  559,   51, 1652,  181, 1030,  980,  145, 1018,  798,  602,  954,  495, 1430, 1420, 1066,   39, 1261, 1789,  161,
                                    169,  660,   67,  920,  890,  404,   68,   13,  510,  157,  837,  382,  314, 1226,  520,  121,  761,  224, 1813,  331,
                                   1858, 1237, 1758,  190,  618, 1841, 1096, 1461, 1772,  327,  930,   25, 1848,  372,  564, 1572,  715, 1923, 1771, 1493,
                                   1222, 1323,  616, 1152, 1933,  736, 1794,  582,  148,  477,  273,  597,  107,  340, 1377,  766,  505,  471, 1795, 1212,
                                    691,  198, 1662,  381,  333,  132,  330,  483, 1164,  467,  674, 1647, 1071,  726, 1395,  152, 1016,  182, 1528,  963,
                                   1526,  313,  629, 1818,  741,  734,   38,  275,  689,  188,  252,  160, 1451,  242,   86, 1901, 1532, 1596, 1820,  878,
                                     82,   75,  902, 1822, 1190, 1181, 1360,  394,  545, 1209,  610,  667, 1238,  820, 1821,  376, 1292, 1910,  836, 1150,
                                   1576,  137,  352,  346, 1110,  419,  595, 1396,  373, 1663,  779,  763,  455, 1352, 1842, 1787,  307,  463,   16,  436,
                                   1659, 1203,  172, 1224,  859, 1275,  322, 1197, 1186,   21,  170 ],
                                 [ undefined, // S12, ZAT 10
                                   1912, 1574,  778, 1872, 1935, 1568, 1175,  881,  728, 1802, 1476, 1810, 1447,  133,  705,  559,  181,   51, 1797, 1652,
                                    569,  817, 1755, 1069,  300, 1420,  980,  145,  161, 1066,  602,  954,  495, 1430, 1030,  798,   39, 1261,  382, 1018,
                                    157,  660,  890,  920,   67,  404,   68,   13,  510,  169,  761, 1789,  314, 1226,  520,  121,  837,  930, 1813,  331,
                                   1858, 1923, 1758,  190,  618, 1841, 1096, 1461, 1772,  327,  224,   25,  148,  564,  372, 1572,  715, 1237, 1771, 1493,
                                   1222, 1323,  340, 1152, 1933,  736, 1794,  582, 1848,  477,  273,  597,  330,  616, 1377,  766, 1647,  471,  691, 1212,
                                   1795,  198, 1662,/#381#/ 333, 1526,  107,   86, 1164,  467, 1528,  505, 1071,  726, 1395,  152,  741,  182,  674,  963,
                                    132,  313,  629, 1818, 1016,  734,   38,  275,  689,  188,  252,  160, 1451,  242,  483, 1901, 1532, 1596, 1663, 1910,
                                     82,   75,  902, 1822, 1190, 1181, 1110,  394, 1209,  545,  610,  667,  346,  779, 1821,  376, 1292,  878,  836,/#1150#/
                                   1576,  137,  352, 1238, 1360, 1352,  595, 1396,  373, 1820,  820,  763,  170,  419, 1224, 1787,  307,  463, 1186,  436,
                                   1659, 1203,  172, 1842,  859, 1275,  322, 1197,   16,   21,  455 ],
                                 [ undefined, // S12, ZAT 11
                                   1912, 1574, 778,/#1872#/1935, 1568,  728,  881, 1175, 1802, 1476, 1810, 1447,  133,  705,  559,  181,   51, 1797, 1652,
                                    569,  817, 1755, 1069,  300, 1420,  980,  145,  161, 1066,  602,  920,  660, 1430, 1030,  798,   68,  404,  382, 1018,
                                    157,  495,  890,  954,   67, 1261,   39,  121,  510,  169,  761, 1789,  314, 1226,  520,   13,  837,  930, 1813,  331,
                                   1858, 1923, 1758,  190,  618, 1841,  477, 1461, 1771,  327,  224,   25,  148,  564,  372, 1572,  715,1237,/#1772#/1493,
                                   1222, 1323,  340, 1152, 1933,  736, 1794,  582, 1848, 1096,  273,  597,  330,  616, 1377,  766, 1647,  471,  691, 1212,
                                   1795,  198, 1662,  333, 1526,  107,   86, 1164,  467, 1528,  505, 1071,  726,  182,  152,  741, 1395,  674,  963,  132,
                                    313,  629, 1818, 1016,  734, 1190,  275,  689,  188,  252,  160,   82,  242, 483,/#1901#/1532, 1596, 1663, 1910, 1451,
                                     75,  902, 1822,  38,/#1181#/1110,  394, 1209,  545,  610,  836,  346,  779, 1821,  376, 1292,  878,  667, 1576,  137,
                                    352, 1238, 1360, 1352,  595,/#1396#/373, 1820,  820,  763,  170,  419, 1224, 1787,  307,  463, 1186,  436, 1659, 1203,
                                    172, 1842,  859, 1275,  322, 1197,   16,   21,  455, 1076, 1825,  563, 1527, 1554, 1177, 1843 ],
                                 [ undefined, // S12, ZAT 12
                                   1912, 1568,  778, 1935, 1574,  728,  881, 1175, 1802, 1476, 1810, 1447,  133,  705,  559,  181,   51, 1797, 1652,  569,
                                    817,  798,  920,  602, 1420,  980,  145,  161, 1066,  300, 1069,  660, 1430, 1030, 1755,   68,  404,  382, 1018,  510,
                                    761,  890,  954,   67,  930,   39,  121,  157,  331,  495, 1923,  314, 1226,  520,   13, 1813, 1261,  837,  169, 1858,
                                   1789, 1461,  477,  618, 1841,  190, 1758, 1771,  327,  224, 1323,  148,  564, 1222, 1572,  715, 1237, 1662,  372,   25,
                                    340, 1152,  198,  736, 1526,  582, 1848, 1096,  273,  597,  330,  616, 1377,  766, 1647,  471,  691, 1212,  726, 1933,
                                   1493,  333, 1794,  107,  313, 1164,  483, 1528,  505, 1071, 1795,  182,  152,  629, 1395,  674,  963,  132,   86,  741,
                                   1818, 1451,  734, 1190,  275,   82,  188,  252,  160,  689,  242,  467, 1532, 1596, 1663, 1910, 1016,   75,  170, 1822,
                                     38, 1110,  394, 1209,  545,  610,  836,  346,  779, 1821,  376, 1292,  878,  667, 1576,  137,  352, 1238, 1360, 1352,
                                    595,  373, 1820,  820,  763,  902, 1842, 1224,/#463#/ 307, 1787, 1186,  436, 1659, 1203,  172,  419,  859, 1275,  322,
                                   1197, 1843,   21,  455, 1076, 1825,  563, 1527, 1554, 1177,   16,  977, 1204 ],
                                 [ undefined, // S12, ZAT 13 ???
                                   1912, 1574,  778, 1935, 1568,  728,  881, 1175, 1802, 1476, 1810, 1447,  133,  705,  559,  181,   51, 1797, 1652,  569,
                                    817, 1755, 1069,  300, 1420,  980,  145,  161, 1066,  602,  920,  660, 1430, 1030,  798,   68,  404,  382, 1018,  157,
                                    495,  890,  954,   67, 1261,   39,  121,  510,  169,  761, 1789,  314, 1226,  520,   13,  837,  930, 1813,  331, 1858,
                                   1923, 1758,  190,  618, 1841,  477, 1461, 1771,  327,  224,   25,  148,  564,  372, 1572,  715, 1237, 1493, 1222, 1323,
                                    340, 1152, 1933,  736, 1794,  582, 1848, 1096,  273,  597,  330,  616, 1377,  766, 1647,  471,  691, 1212, 1795,  198,
                                   1662,  333, 1526,  107,   86, 1164,  467, 1528,  505, 1071,  726,  182,  152,  741, 1395,  674,  963,  132,  313,  629,
                                   1818, 1016,  734, 1190,  275,  689,  188,  252,  160,   82,  242,  483, 1532, 1596, 1663, 1910, 1451,   75,  902, 1822,
                                     38, 1110,  394, 1209,  545,  610,  836,  346,  779, 1821,  376, 1292,  878,  667, 1576,  137,  352, 1238, 1360, 1352,
                                    595,  373, 1820,  820,  763,  170,  419, 1224, 1787,  307,  463, 1186,  436, 1659, 1203,  172, 1842,  859, 1275,  322,
                                   1197,   16,   21,  455, 1076, 1825,  563, 1527, 1554, 1177, 1843 ],
                                 [ undefined, // S12, ZAT 13 Fehler 61 - 85
                                    778, 1568, 1912, 1935, 1574,  728,  881, 1175, 1802, 1476, 1810,   51,  133,  705,  559,  817, 1447,  980, 1652,  569,
                                    181,  798,  920,  602, 1420, 1797,  145,  954, 1066,  300, 1069,  660, 1430, 1030, 1755,   68,  404,  382, 1018,  510,
                                    761,  890,  161,   67,  930,   39,  121,  157,  331,  495, 1923,  314, 1226,  520,   13, 1813, 1261,  837,  169,  327,
                                    190, 1758, 1771, 1858,  224, 1323,  148,  564, 1222, 1572,  715, 1237, 1662,  372,   25,  340, 1152,  198,  736, 1526,
                                   1789, 1461,  477,  618, 1841, 1848,  582, 1096,  273, 1377,  330,  616,  597,  766,  691,  471, 1647, 1212,  726, 1933,
                                   1493,  333, 1794,  107,  313, 1164,  483, 1528,  505, 1071, 1795,  182,  152,  629, 1395,  674,  963,  132,   86,  741,
                                    394, 1451,  734,   75,  275,   82,  188,  252,  160,  689,  242,  467, 1532, 1596,  667, 1910, 1016, 1190,  170, 1822,
                                   1821, 1110, 1818, 1209,  545,  610,  836,  346,  779,   38,  376, 1197,  878, 1663, 1576,  137,  352, 1238, 1360, 1352,
                                    595,  373, 1820,  820,  763,  902, 1842, 1224,  307, 1787, 1186,  436, 1659, 1203,  172,  419,  859, 1275,  322, 1292,
                                   1843,   21, 1076,  455, 1825,  563, 1527, 1554, 1177,   16,  977, 1204, 1168, 1872,  693, 1086 ],
                                 [ undefined, // S12, ZAT 13 - 14
                                    778, 1568, 1912, 1935, 1574,  728,  881, 1175, 1802, 1476, 1810,   51,  133,  705,  559,  817, 1447,  980, 1652,  569,
                                    181,  798,  920,  602, 1420, 1797,  145,  954, 1066,  300, 1069,  660, 1430, 1030, 1755,   68,  404,  382, 1018,  510,
                                    761,  890,  161,   67,  930,   39,  121,  157,  331,  495, 1923,  314, 1226,  520,   13, 1813, 1261,  837,  169,  327,
                                   1789, 1461,  477,  618, 1841,  190, 1758, 1771, 1858,  224, 1323,  148,  564, 1222, 1572,  715, 1237, 1662,  372,   25,
                                    340, 1152,  198,  736, 1526, 1848,  582, 1096,  273, 1377,  330,  616,  597,  766,  691,  471, 1647, 1212,  726, 1933,
                                   1493,  333, 1794,  107,  313, 1164,  483, 1528,  505, 1071, 1795,  182,  152,  629, 1395,  674,  963,  132,   86,  741,
                                    394, 1451,  734,   75,  275,   82,  188,  252,  160,  689,  242,  467, 1532, 1596,  667, 1910, 1016, 1190,  170, 1822,
                                   1821, 1110, 1818, 1209,  545,  610,  836,  346,  779,   38,  376, 1197,  878, 1663, 1576,  137,  352, 1238, 1360, 1352,
                                    595,  373, 1820,  820,  763,  902, 1842, 1224,  307, 1787, 1186,  436, 1659, 1203,  172,  419,  859, 1275,  322, 1292,
                                   1843,   21, 1076,  455, 1825,  563, 1527, 1554, 1177,   16,  977, 1204, 1168, 1872,  693, 1086 ],
                                 [ undefined, // S12, ZAT 15
                                    778, 1568, 1912, 1935, 1574,  728,  881, 1175, 1802, 1476, 1810,   51,  133,  705,  559,  817, 1447,  980, 1652,  569,
                                    181,  798,  920,  602, 1420, 1797,  145,  954, 1066,  300, 1069,  660, 1430, 1030, 1755,   68,  404,  382, 1018,  510,
                                    761,  890,  161,   67,  930,   39,  121,  157,  331,  495, 1923,  314, 1226,  520,   13, 1813, 1261,  837,  169,  327,
                                   1789, 1461,  477,  618, 1841,  190, 1758, 1771, 1858,  224, 1323,  148,  564, 1222, 1572,  715, 1237, 1662,  372,   25,
                                    340, 1152,  198,  736, 1526, 1848,  582, 1096,  273, 1377,  330,  616,  597,  766,  691,  471, 1647, 1212,  726, 1933,
                                   1493,  333, 1794,  107,  313, 1164,  483, 1528,  505, 1071, 1795,  182,  152,  629, 1395,  674,  963,  132,   86,  741,
                                    394, 1451,  734,   75,  275,   82,  188,  252,  160,  689,  242,  467, 1532, 1596,  667, 1910, 1190,  170, 1822, 1821,
                                   1110, 1818, 1209,  545,  610,  836,  346,  779,   38,  376, 1197,  878, 1663, 1576,  137,  352, 1238, 1360, 1352,  595,
                                    373, 1820,  820,  763,  902, 1842,/#307#/1787, 1186,  436, 1659, 1203,  172,  419,  859, 1275,  322, 1292, 1843,   21,
                                   1076,  455, 1825,  563, 1527, 1554, 1177,   16,  977, 1204, 1168, 1872,  693, 1086,  441,  345,  129, 1838,  389 ],
                                 [ undefined, // S12, ZAT 16
                                    778, 1568, 1912, 1935, 1802,  728,  881, 1175, 1574, 1476, 1810,   51, 1652,  705,  559,  817, 1447,  980,  133,  181,
                                    569, 1430,   68,  602, 1420, 1797,  145,  954, 1066,  930,  382,  660,  798,  510, 1755,  920,  495, 1069,  761, 1030,
                                   1018,  157,  121,   67,  300,   39,  161,  890,  331,  404, 1923,  314, 1461,  520,   13, 1813, 1261,  837,  169,  327,
                                   1323, 1226,  477,  618, 1858,  190,  582, 1771, 1841,  273, 1789,  148,  564, 1222, 1572,  715, 1237, 1662, 1096,  597,
                                    340, 1152,  198,  736, 1526, 1848, 1758,  372,  224, 1377,  330,  616,   25,  766,  691,  471, 1647, 1212,  726, 1933,
                                   1493,  333, 1794,  107,  313, 1164,  483,  275,   86, 1071, 1795,  182,  152,  629, 1395,  674,  963,  252,  505,  741,
                                    394, 1451,  734,   75, 1528,   82,  188,  132,  160,  689,  242,  467, 1818, 1596,  667, 1910, 1190,  170, 1663, 1821,
                                   1110, 1532, 1209,  545,  610,  836,  346,  763,   38,  376, 1197, 1842, 1822, 1576,  137,  352,  419, 1360, 1352,  595,
                                    563, 1820,  820,  779, 1659,  878, 1275, 1186, 1204,  902, 1203,  172, 1238,  859, 1787,  322, 1292, 1843,   21, 1076,
                                    455, 1825,  373, 1527, 1168, 1177, /#16#/ 977,  436, 1554, 1872,  693, 1086,  441,  345,  129, 1838,  389,  987 ],
                                 [ undefined, // S12, ZAT 17
                                    778, 1912, 1568, 1935, 1802,  728,  881,  559, 1574, 1476,  705,   51, 1652, 1810, 1175,  817, 1447,  980,  133,  181,
                                    569, 1430,   68, 1066, 1420, 1797,  145,  660,  602,  930,  382,  954,  798,  510, 1755,  920,  495, 1069,  761, 1030,
                                   1018,  157,  121,   67,  300,   39,  161,  890,  477,  404, 1923,  314, 1461,  520,   13, 1771,  618,  148,  169,  327,
                                   1323, 1226,  331, 1261, 1858,  190,  582, 1813, 1841,  273, 1789,  837,  564, 1222, 1572, 1152, 1237, 1662, 1096,  597,
                                    340,/#715#/ 198,  736, 1526, 1848, 1758,  372,  224, 1377,  330,  616,   25,  766,  691,  471, 1647, 1212,  726, 1933,
                                   1493,  333, 1794,  107, 1164,  313,  689,  275,   86, 1596, 1795,  182,  152,  629, 1395,  674,  963,  252,  505,  741,
                                    394,  836,  734,   75, 1528, 1190,  188,  132,  160,  483,  242,  467, 1818, 1071,  667, 1910,   82, 1352, 1663, 1821,
                                   1110, 1532, 1209,  545,  610, 1451,  346,  763,   38,  376, 1197, 1842, 1822, 1576,  137, 1527,  419, 1360,  170,  595,
                                    563, 1820,  820,  779, 1659,  878, 1275, 1186, 1204,  902, 1203,  172, 1238,  859, 1787,  322, 1292, 1843, 1076,   21,
                                    455,  977,  373,  352, 1168, 1177, 1825,  436, 1554, 1872,  693, 1086,  441,  345,  129, 1838,  389,  987, 1552 ],
                                 [ undefined, // S12, ZAT 18
                                    778, 1912, 1568, 1935, 1802,  728,  881, 1810,   51, 1476,  705, 1574, 1652,  559, 1175,  817, 1447,  980,  181,  133,
                                   1430,  569,   68, 1066, 1420, 1797,  602,  660,  145,  930,  382,  954,  798,  510, 1755,  920,  495, 1923,  761, 1030,
                                    157, 1018,  121,  161,  300, 1461,   67,  890,  477,  327, 1069,  314,   39,  520,   13, 1771,  618,  148,  169,  404,
                                   1323, 1152,  331, 1261, 1858,  190,  582, 1813, 1841,  273, 1789,  837,  564, 1222, 1572, 1226, 1237, 1662, 1096,  597,
                                   1848,  198,  736, 1526,  340, 1758,  726,  333, 1377,  330,  616,  313,  766,  691,  471, 1647, 1212,  372,  629, 1493,
                                    224, 1794,  107, 1164,   25,  689,  275,   86, 1596, 1795,  182,  152, 1933, 1395,  483,  963,  252,  505,  741,  394,
                                    836, 1818, 1663, 1528, 1190,  188,  132,  160,  674,  242,  467,  734, 1071,  667, 1910,   82, 1352,   75, 1821,  170,
                                   1532, 1209,  545,  610, 1451,  346,  763,   38,  376, 1197, 1842, 1822,  352,  137, 1527,  419, 1360, 1110, 1204,  563,
                                   1825,  820,  779, 1659,  878, 1275, 1186,  595,  902, 1203,  172, 1238,  859, 1787,  322, 1292, 1843, 1076,   21,  455,
                                   977,/#373#//#1576#/1168,1177, 1820,  436, 1554, 1872,  693, 1086,  441,  345,  129, 1838,  389,  987, 1552 ],
                                 [ undefined, // S12, ZAT 19
                                    778, 1912, 1568, 1935,  728, 1802,  881, 1810,   51, 1476,  705, 1574, 1652,  559, 1175,  817, 1447,  980,  181,  133,
                                   1430,  569,   68, 1066, 1420,  930,  602,  660,  145, 1797,  382,  954,  798,  510, 1755,  920,  761, 1923,  495, 1030,
                                    157, 1018,  121,  161,  300, 1461,   67, 1771,  477,  327, 1069,  314,   39,  520,   13,  890,  618,  148,  169,  404,
                                    273, 1152,  331, 1261, 1858,  190,  582, 1526, 1222, 1323, 1789,  837,  564, 1841, 1572, 1226, 1237, 1662, 1096,  597,
                                   1848,  198,  736, 1813,  340, 1758,/#726#/ 333, 1377,  330,  616,  313,  689,  691,  963, 1493, 1212,  372,  629, 1647,
                                    224, 1794,  107, 1164,   25,  766,  275,  160, 1596, 1528,  182,/#152#/1933,  394,  483,/#471#/ 252,  505, 1190, 1395,
                                    188, 1818, 1663, 1795,  741,  836,  132,   86,  674,  242,  467,  734, 1821,  667, 1910,   82, 1352,   75, 1071,  170,
                                   1527, 1209,  545,  610, 1451,  346,  763,   38,  376, 1197, 1842,  563,  352, 137,/#1532#/1076, 1360, 1110, 1204, 1822,
                                   1825,  820,  779, 1659,  878, 1275, 1186,  595,  902, 1203,  172,  693,  859, 1787,  322, 1292, 1843,  419,   21,/#455#/
                                    977, 1168, 1177, 1820,  436, 1554, 1872, 1238, 1086,  441,  345,  129, 1838,  389,  987, 1552,  654 ],
                                 [ undefined, // S12, ZAT 20
                                    778, 1912, 1568, 1935,  728, 1802,  881, 1810,  705, 1476,   51, 1574, 1652,  559,/#1175#/817, 1447,  980,  181,  133,
                                   1430,  569,  510, 1066, 1420,  930,  602,  660,  145, 1797,  382,  954,  495,   68, 1755,  157,  761, 1923,  798,  300,
                                    920,   13,  121,  161, 1030, 1461,   67, 1771,  477,  327, 1069,  314,   39,  520, 1018,  890,  618,  148,  169,  404,
                                    273, 1152,  331, 1261, 1858,  190,  582, 1526, 1222, 1323, 1789,  837,  564, 1841, 1572, 1226, 1237, 1662, 1096,  597,
                                   1848,  198,  736, 1813,  340,  629,  333, 1377,  330,  616,  313,  689,  691,  963, 1493, 1212,  275, 1758, 1647,  224,
                                   1794,  107, 1164,   25,  766,  372,  160, 1596, 1528,  182, 1933,  394,  667,  252,  505, 1190, 1395,  188, 1818, 1663,
                                   1795,  741,  836,  132,   86, 1842,  242,  467,  734, 1821,  483, 1910,   82, 1352,  779, 1071,  563, 1527, 1076,  545,
                                    610,/#1451#/346,  763,   38, 1204, 1197,  674,  170,  352,  137, 1209, 1360, 1110,  376, 1822, 1825,  820,   75, 1659,
                                   1843, 1275, 1186,  595,  902, 1203,  172,  693,  859, 1787,  322,  345,  878,  419,   21,  129, 1168, 1177, 1820,  436,
                                   1554, 1872, 1238, 1086,  441, 1292,  977, 1838,  389,  987, 1552,  654, 1866,  130, 1881 ],
                                 [ undefined, // S12, ZAT 21
                                    778, 1912, 1568, 1802,  728, 1935,  881, 1810,  705, 1476,   51, 1574,  980,  559,  817, 1447, 1652,  660,  930, 1430,
                                   1755,  510, 1066, 1420,  133,  145,  181,  602,  121,  382,  954,  495,   68,  569,  157,   39, 1923,  798,  300,  920,
                                     13, 1797,  161, 1030, 1461,   67, 1771,  477,  327, 1069,  314,  761,  520, 1018, 1662,  618,  148,  169,  404,  273,
                                   1152,  331, 1261, 1858,  190,  582, 1526, 1222, 1323,/#1789#/837,  564, 1813, 1572, 1226, 1237,  890, 1096, 1848,  597,
                                    198,  736, 1841,  340,  629,  691, 1377,  224,  616,  313,  689,  333,  963, 1190, 1212,  275, 1758, 1647,  330, 1794,
                                    107, 1164,   25,  766,  372,  160, 1596, 1528,  182, 1933,  394,  667,  252,  505, 1493, 1395,  188, 1818, 1352,  741,
                                   1795,  836,  132,   86, 1842,  242,  467,  734, 1821,  483, 1910,   82, 1663,  779,  346,  563, 1527, 1076,  545,  610,
                                   1071,  763,   38, 1204, 1197,  674,  170,  352,  137, 1209, 1360, 1110,  376, 1822, 1825,  820,   75, 1659, 1843, 1275,
                                   1186,  595,  902, 1203,  172,  693,  859, 1787,  322,  345,  878,  419, 1552,  129, 1168, 1177, 1820,  436, 1554, 1872,
                                    441, 1086, 1238, 1292,  977, 1838,  389,  987,   21,  654, 1866,  130, 1881,   37, 1724 ],
                                 [ undefined, // S12, ZAT 22
                                   1568, 1912,  778, 1802,  728, 1935,  881, 1810,   51, 1476,  705, 1447,  980,  559,  817, 1574, 1652,  660,  930, 1430,
                                   1755,  495, 1066,  382,  133,  145,  181,  602,  121, 1420,  954,  510,   68, 1461,  157,   39, 1923,  798,  300,  920,
                                     13, 1797,  161, 1030,  569,  582,  169,  477,  327,  273,  314,  761,  520, 1018, 1662,  618,  148, 1771, 1858, 1069,
                                   1152,  331, 1222,  404,  190,   67, 1526, 1261, 1323,  837,  564, 1813, 1572, 1237, 1226,  890, 1096, 1848,  597,  198,
                                    736,  333,  340,  629,  691, 1377,  963,  616,  313,  689, 1841,  224, 1190, 1212,  275, 1528, 1647,  330, 1794,  107,
                                   1164,   25,  766,  394,  160, 1596, 1758,  182,  483,  372,  667,  252,  505, 1493,/#1395#/188, 1818, 1352,  741, 1795,
                                    836,  132,   86, 1842,  242,  170, 1204, 1821, 1933, 1910,   82, 1663,  779,  346,  563, 1527, 1076,  545,  610, 1071,
                                    763,   38,  734, 1197,  674,  467,  352,  137, 1209, 1360, 1110,  376,  987, 1825,  820,   75, 1659, 1843, 1275, 1186,
                                    595,  902, 1203, 1552,  693,  859, 1787,  322,  345,  878,  419,  172,  129, 1168, 1177, 1820,  436, 1554, 1872,  441,
                                   1086, 1238, 1881,  977, 1838,  389, 1822,   21, 1866,  654,  130, 1292,   37, 1724, 1429,  783 ],
                                 [ undefined, // S12, ZAT 23
                                   1568, 1912,  778, 1802,  728, 1935,  559, 1810,   51, 1476,  705, 1447,  980,  881,  817, 1574, 1652,  660,  930, 1430,
                                   1755,  495, 1066,  382,  133,  145,  181,  602,  121, 1420,  954,  510,   68, 1461,  920,   39, 1923,  798,  327,  157,
                                     13, 1797,  161, 1030,  569,  582,  169,  477,  300,  273,  314,  761,  520, 1018, 1662, 1526,  148, 1771, 1858, 1069,
                                   1152,  331, 1222,  404,  190,   67,  618, 1261, 1323, 1813,  564,  837, 1572, 1237, 1226, 1848, 1096,  890,  597,  198,
                                    736,  333,  340,  616,  691, 1377,  963,  629,  313,  689, 1841,  224, 1190, 1212,  275, 1528, 1647,  330, 1794,  107,
                                   1164,   25,  766,  394, 1821, 1596, 1758,  182,  483,  372,  667,  741,  505, 1493,  188, 1818, 1352,  252, 1527,  836,
                                    132,   86,  674, 1197,  170, 1204,  160, 1933, 1910,   82, 1663,  779,  346,  563, 1795, 1076,  545,  610, 1825,  763,
                                     38,  734,  242, 1842,  467,  352,  137, 1209, 1360, 1110,  376,  987, 1071,  820,   75, 1659, 1843, 1275, 1186,  595,
                                    902, 1203, 1552,  693,  859, 1787,  322,  345,  878,  419,  172,  129, 1168, 1838, 1820,  436, 1554, 1872,  441, 1086,
                                   1238, 1881,  977, 1177,  389, 1822,   21, 1866,  654,  130, 1292,   37, 1724, 1429,  783,  699 ],
                                 [ undefined, // S12, ZAT 24
                                   1568, 1912, 1802,  778,  728,  559, 1935, 1810,   51, 1476,  660, 1447,  980,  881,  817,  145, 1652,  705,  930, 1430,
                                   1755,  495, 1066,  382,  133, 1574,  181,  602,  121,  798,  954,  510,   68, 1461,  920,   39, 1923, 1420,  327,  157,
                                     13, 1797,  161,  300,  569,  582,  169,  477, 1030,  273,  148, 1526, 1222, 1018, 1662,  761,  314, 1771, 1858, 1069,
                                   1152,  331,  520,  404,  190,   67,  618, 1261, 1323, 1813,  564,  837, 1572, 1237, 1226, 1848, 1096,  890,  597,  198,
                                    736,  333,  340,  616,  691, 1377,  963,  629,  313,  689,  275,  182, 1190, 1212, 1841, 1528, 1647,  330, 1794,  107,
                                   1164,   25,  766,  394, 1821, 1596,  346,  224,  483,  667,  372,  741,  505, 1493,  188, 1818, 1352,  252, 1527,  836,
                                    132,   86,  674, 1197,  170, 1204,  160, 1933, 1910,   82, 1663,  779, 1758,  563, 1825, 1076,  545,  610, 1795,  763,
                                     38,  734,  242, 1842, 1552,  352,  137, 1209, 1360, 1110,  376,  987, 1071,  389,   75, 1659, 1843, 1275, 1186,  595,
                                   1866, 1203,  467,  693,  859, 1787,  322,  345,  878,  419,  172,  129, 1168, 1838,  783,  436, 1554, 1872,  441, 1086,
                                   1238, 1881,  977, 1177,  820, 1822,   21,  902,  654,  130, 1292,   37, 1724, 1429, 1820,  699,  758 ],
                                 [ undefined, // S12, ZAT 25 - 26
                                   1568, 1912, 1802,  778,  728,  559, 1935, 1810,   51, 1476,  660, 1447,  980,  881,  930,  145, 1652,  705,  817, 1430,
                                   1755,  382,   39,  495,  133, 1574,  181,  121,  602,  798,  954,  510,   68, 1461,  920, 1066, 1923, 1420,  327,  273,
                                    169, 1797,  477,  300,  569,  582,   13,  161, 1030,  157,  148, 1526, 1222, 1018, 1662,  761,  314, 1771, 1858, 1069,
                                   1152,  331,  520,  404,  190,   67,  618,  198,  689, 1813,  564,  837, 1848,  963, 1226, 1572, 1096,  890, 1794, 1261,
                                    736,  333,  340,  616,  691, 1377, 1237,  629,  313, 1323,  275,  182, 1527, 1212, 1841, 1528,   25,  330,  597,  107,
                                   1164, 1647,  766,  394,  741, 1076,  346,  224,  160,  667,  372, 1821,  170, 1493,  188, 1818, 1352,  252, 1190,  836,
                                    132,  987,  674, 1197,  505, 1204,  483, 1933, 1910,   82, 1663,  779, 1758,  563, 1825, 1596,  545,  610, 1795,  763,
                                     38,  734,  242, 1842, 1552,  352,  137, 1209, 1360, 1110,  376,   86, 1071,  389,   75, 1659, 1843, 1275, 1186,  595,
                                   1866, 1203,  467,  693,  859, 1787,  322,  345,  878,  419,  172,  129, 1168, 1838,  783,  436, 1554, 1872,  441, 1086,
                                   1238, 1881,  977, 1177,  820, 1822,   21,  902,  654,  130, 1292,   37, 1724, 1429, 1820,  699,  758, 1548 ],
                                 [ undefined, // S12, ZAT 27
                                   1568, 1912, 1802,  778,  728,  559, 1935, 1810,   51, 1476,  660, 1447,  980,  881,  930,  145, 1652,  705,  817, 1430,
                                   1755,  382,   39,  495,  133, 1574,  181,  121,  602,  798,  954,  510,   68, 1461,  920, 1066, 1923, 1420,  327,  273,
                                    169, 1797,  477,  300,  569,  582,   13,  161, 1030,  157,  148, 1526, 1222, 1018, 1662,  761,  314, 1771, 1858, 1069,
                                   1152,  331,  520,  404,  190,   67,  618,  198,  689, 1813,  564,  837, 1848,  963, 1226, 1572, 1096,  890, 1794, 1261,
                                    736,  333,  340,  616,  691, 1377, 1237,  629,  313, 1323,  275,  182, 1527, 1212, 1841, 1528,   25,  330,  597,  107,
                                   1164, 1647,  766,  394,  741, 1076,  346,  224,  160,  667,  372, 1821,  170, 1493,  188, 1818, 1352,  252, 1190,  836,
                                    132,  987,  674, 1197,  505, 1204,  483, 1933, 1910,   82, 1663,  779, 1758,  563, 1825, 1596,  545,  610, 1795,  763,
                                     38,  734,  242, 1842, 1552,  352,  137, 1209, 1360, 1110,  376,   86, 1071,  389,   75, 1659, 1843, 1275, 1186,  595,
                                   1866, 1203,  467,  693,  859, 1787,  322,  345,  878,  419,  172,  129, 1168, 1838,  783,  436, 1554, 1872,  441, 1086,
                                   1238, 1881,  977, 1177,  820, 1822,   21,  902,  654,  130, 1292,   37,1724,/#1429#/1820,  699,  758, 1548, 1223 ],
                                 [ undefined, // S12, ZAT 28
                                   1568, 1912, 1802, 1935,  728,  559,  778, 1810,   51, 1476,  660, 1447,  980,  881,  705,  145, 1652,  930,  817, 1430,
                                   1755,  382,   39,  495,  133, 1461,  181,  121,  602,  798,  954, 1797,   68, 1574,  920, 1066, 1923, 1420,  148,  273,
                                   1526,  510,  477,  300,  569,  582,   13,  161,  157, 1030,  327,  169,1222,/#1018#/1662, 1848,  689, 1771, 1858, 1069,
                                   1152,  331,  520,  963,  190,   67,  618,  198,  314, 1813,  564, 1572,  761,  404, 1226,  837, 1096,  890, 1794, 1261,
                                    736,  333,  616,  340,  691, 1377, 1237,  629,  313, 1323,  275,  182, 1527, 1212, 1841, 1528,   25,  330,  597,  107,
                                   1164, 1647,  766,  394,  741, 1076,  346,  224,  160,  667,  674, 1821,  170, 1493,  188, 1818, 1352,  252, 1190,  563,
                                    132,  987,  372, 1197,  505,  376,  483, 1933, 1910,   82, 1663,  779, 1758,  836, 1825, 1596,  545,  610,  345,  763,
                                     38,  734,  242, 1842, 1552,  352,  137, 1209, 1360, 1110, 1204,   86, 1843,  389,   75, 1659, 1071, 1275, 1186,  595,
                                   1866, 1203,  419,  693,  859, 1787,  322, 1795,  878,  467,  172,  129,   37, 1838,  783,  436, 1554, 1724,  441, 1086,
                                   1238, 1881,  977, 1177,  820, 1822,   21,  902,  654, 1548, 1292, 1168, 1872, 1820,  699,  758,  130, 1223 ],
                                 [ undefined, // S12, ZAT 29
                                   1568, 1912, 1802, 1935,  728,  559,  778,  980,   51, 1476, 1447,  660, 1810,  881,  705,  145, 1652,  930,  817, 1430,
                                   1755,   68,   39,  495,  920, 1461,  181,  121,  602,  798,  954, 1797,  382, 1574,  133, 1066, 1923,  582,  148,  273,
                                   1526,  510,  477,  300,  569, 1420, 1771,  161,  157, 1030,  327,  169, 1222, 1662, 1848,  689,   13, 1858, 1069, 1152,
                                    331,  520,  963,  190,   67, 1323, 1813,  314,  198,  564, 1572,  761,  404, 1226,  837, 1096, 1237, 1528,  691,  736,
                                     25,  616,/#340#/1261, 1377,  890,  766,  313,  618,  275,  182, 1527,  170, 1493, 1794,  333,  330,  597,  107, 1164,
                                   1647,  629,  394,  741, 1076,  346,  224,  160,  667,  674, 1821, 1212, 1841,  188, 1818, 1352,  252, 1190,  563,  132,
                                    987,  372, 1197,  505,  376, 1933,  483, 1910,  763, 1663,  779, 1758,  836, 1825, 1596,  545,  610,  345,   82,   75,
                                    734,  693, 1842, 1552,  352,  137, 1209, 1360, 1110, 1204,   86, 1843,  389,   38,1838,/#1071#/1275, 1186,  595, 1866,
                                   1203,  419,  242,  859, 1787,  322, 1795,  878,  467,  172,  129,   37, 1659,  783,  436, 1554, 1724,  441, 1086, 1238,
                                   1881,  977, 1177,  820,  654,   21,  902, 1822, 1548, 1292, 1168, 1872, 1820,  699,/#758#/ 130, 1223 ],
                                 [ undefined, // S12, ZAT 30
                                   1568, 1935, 1802, 1912,  728,  559, 1810,  980,   51,  660, 1447, 1476,  778,  881,  705,  145, 1652, 1755,  817, 1430,
                                    930,   68,   39,  495,  920, 1461,  181,  121,  602,  798,  954, 1797,  382,  148,  133, 1066, 1923,  582, 1574,  273,
                                   1526,  169,  157,  300,  327, 1420, 1771,  161,  477, 1222,  569,  510, 1030, 1662, 1848,  689,   13, 1858, 1069,  331,
                                   1152,  520,  963,  190,   67, 1323, 1813,   25,  198,  564, 1572,  766,/#404#/1226,  837, 1096, 1237, 1528,  691, 1794,
                                    314,  616, 1261, 1377,  890,  761,  618,  313,  275,  182, 1527,  170, 1493,  736,  333,  330,  597,  107, 1164, 1647,
                                    629,  394,  741, 1076,  346,  483,  160,  667, 1825, 1821, 1212, 1841,  188, 1818, 1352,  252, 1190,  563,  132,  987,
                                    137, 1197,  505, 1933,  376,  224, 1910,  763, 1663,  779, 1843,  836,  674, 1596,  545,  610,  345,   82,   75,  734,
                                    693, 1842, 1552,  352,  372, 1209, 1360, 1110, 1204,   86, 1758,  389,   38, 1838, 1275, 1186,  595, 1866, 1203,  419,
                                    242,  859, 1787,  322, 1795,  878,  467,  172,  129,   37, 1659,  783,  436, 1554, 1724,  441, 1086, 1238, 1881,  977,
                                   1177,  820,  654,   21,  902, 1822, 1548, 1292,1168,/#1872#/1820,  699,  130, 1223, 1668 ],
                                 [ undefined, // S12, ZAT 31
                                   1802, 1935, 1568, 1912,  728,  559, 1810,  980,   51,  660, 1430, 1476,  778,  881,  705,  145, 1652, 1755,  817, 1447,
                                    930,   68,   39,  495,  920, 1461,  181,  121,  602,  798,  954,  273,  300,  148,  133, 1066, 1923, 1771, 1574, 1797,
                                   1526,  169,  157,  382,  327, 1420,  582,  161,  477, 1222,  569,  510, 1030, 1662, 1848,  689,   13, 1858, 1069,  331,
                                   1152,  520,  963,  190,   67, 1323,  182,   25,  198,  275, 1572,  766, 1226,  837, 1096, 1237, 1528, 1527, 1794,  314,
                                    616, 1261, 1377,  890,  761,  618,  313,  564, 1813,  691,  170, 1493,  736,  346,  330,  597,  107, 1164, 1647,  629,
                                    394, 1190, 1076,  333,  483,  160,  667, 1825,  987, 1212, 1841,  188, 1818, 1352,  252,  741,  563,  132, 1821,  137,
                                   1197,  505, 1933,  376,  224, 1910,  763, 1663,  779, 1843,  836,  674, 1596,  545,  610, 1838,   82,   75,  734,  693,
                                   1842, 1552,  352,  372, 1209,  129, 1110, 1204,   86, 1758,  389,  441,  345, 1275,  654,  595, 1866, 1203,  419,  242,
                                    859, 1787,   37, 1795,  878,  467,  172, 1360,  322, 1659,  783,  436, 1554, 1724,   38, 1086, 1238, 1881,  977, 1548,
                                    820, 1186,   21,  902, 1822, 1177, 1292, 1168, 1820,  699,/#130#/1223, 1668, 1359 ],
                                 [ undefined, // S12, ZAT 32
                                   1802, 1935, 1568, 1912,  728,  559, 1810,  980,   51,  660, 1430, 1476,  778,  881,  705,  145, 1652, 1755,  817, 1461,
                                    930,   68,   39,  495,  920, 1447,  148,  121,  602,  798,  954,  273,  327,  181,  133, 1066, 1923, 1771, 1574, 1797,
                                   1526,  169,  157,  382,  300, 1420,  582,  161,  477, 1222,  569,  510,  963, 1662, 1848,  689,   13, 1858, 1226,  190,
                                   1152,/#520#/1030,  331,   67, 1323,  182,   25, 1572,  275,  198,  766, 1069,  837, 1096, 1237, 1528, 1527,  330,  314,
                                    616, 1261, 1377,  890,  761,  618,  313,  564, 1813,  691,  170, 1493,  563,  346, 1794,  597,  107, 1164, 1647,  629,
                                    394, 1190, 1076,  333,  483,  160,  667, 1825,  987, 1212, 1841,  188, 1818, 1352,  252,  741,  736,  132, 1821,  137,
                                   1197,  389, 1933,  376,  224, 1910,  763, 1663,  779, 1843,  836,  674, 1596,  545,  610, 1838,   82,   75,  734,  693,
                                   1842, 1552,  352,  372, 1209,  129, 1110, 1204,   86, 1758,  505,  441,  345, 1275,  654,  595, 1866, 1203,  419,  242,
                                    859, 1787,   37, 1795, 1168,  467,  172, 1360, 1659,  322,  783,  436, 1554, 1724,   38, 1086, 1238, 1881,  977, 1548,
                                    820, 1186,   21,  902, 1822, 1177, 1292,  878, 1820,  699, 1223, 1668, 1359,  204 ],
                                 [ undefined, // S12, ZAT 33
                                   1802, 1568, 1935, 1912,  728,   51,  980, 1810,  559, 1476, 1430,  660,  778,  881,  930,  145, 1652, 1755,  817, 1461,
                                    705,   68,   39,  495,  920, 1447,  148,  121, 1526,  798,  954, 1574,  327,  181,  133, 1066, 1923, 1771,  273, 1797,
                                    602,  169, 1420,  382,  300,  157,  582,  161,  477, 1222,  569,  510,  963, 1662, 1848,  689,   13,  182, 1226,  190,
                                   1152, 1030,  331,   67, 1323, 1858,   25, 1572,  275,  198,  766, 1069,  837, 1096, 1237, 1528, 1527,  330,  314,  616,
                                   1261, 1377,  890,  761,  618,  313,  564, 1813,  691,  170, 1493,  563,  346, 1794,  597,  107, 1164, 1352,/#629#/ 394,
                                   1190, 1076,  333,  483, 1197,  667,  224,  987, 1212, 1841,  188, 1818, 1647,  252,  741,  736,  132, 1821,  137,  160,
                                    389, 1552,  376, 1825, 1838,  441, 1663,  779, 1843,  836,  674, 1596,  545,  610, 1910,   82,   75,  734,  693, 1842,
                                   1933,  352,  372, 1209,  129, 1110, 1204,   86, 1758,  505,  763,  345, 1275,  654,  595, 1866, 1203,  419,  242,  859,
                                   1787,   37, 1795, 1168,  467,  172, 1360, 1659,  322,  783,  436, 1554, 1724,  977, 1086, 1238,  902,   38, 1548,  820,
                                   1186,   21, 1881, 1822, 1177, 1292,  878, 1820,  699, 1223, 1668, 1359,  204 ],
                                 [ undefined, // S12, ZAT 34
                                   1802, 1568, 1935, 1912,  728,   51,  980, 1810,  559,  930, 1430,  660,  705,  881, 1476,  145, 1652, 1755,  495, 1461,
                                    778,   68,   39,  817,  920, 1447,  148,  121, 1526,  798,  954,  133,  327,  273, 1574,  300, 1923,  602,  181, 1797,
                                   1771,  169, 1420,  382, 1066,  157,  582,  161,  477, 1222,  331,  510,  963, 1662, 1848,  275,   13,  182, 1226,  766,
                                   1152, 1237,  569, 1572, 1323, 1858,   25,   67,  689,  198,  190, 1069,  618, 1096, 1030, 1528, 1527,  330,  314,  616,
                                   1261, 1377,  890,  483,  837,  313,  564, 1813,  691,  170, 1493,  563,  346, 1794,  597,  137, 1164, 1352,  394, 1190,
                                   1076,  333,  761, 1197,  667, 1825,  987, 1212, 1841,  188, 1818, 1647,  252,  741,  736,  132, 1821,  107,  160,  389,
                                   1552,  376,  224, 1838,  441, 1663,  779, 1843,  836,  674, 1596,  545,  610, 1910,   82,   75,  734,  693, 1842, 1933,
                                    352,  372, 1866,  129, 1659, 1204,   86, 1758,  505,  763,  345, 1275,  654, 1548, 1209, 1203,  419,  242,  859, 1787,
                                     37, 1795, 1168,  467,  172, 1360, 1110,  322,  783,  436, 1554, 1724,  977, 1086, 1238,  902,   38,  595,  820, 1186,
                                     21, 1881, 1822, 1177, 1292,  878, 1820,  699, 1223, 1668, 1359,  204 ],
                                 [ undefined, // S12, ZAT 35
                                   1802, 1912, 1935, 1568,  728,   51,  980, 1810,  559,  930, 1430,  660,  705,  881, 1476,  145, 1652, 1755,  495,   39,
                                    778,   68, 1461,  817,  327, 1447,  148,  121, 1526, 1923, 1420,  133,  920,  273, 1574,  300,  798,  602,  181,  477,
                                   1771,  169,  954,  382, 1066,  157,  582,  161, 1797, 1222,  331,  510, 1848, 1662,  963,  275,   13,  182, 1527,  766,
                                   1152, 1237,  569, 1572, 1323, 1528,  170,   67,  689,  198,  190, 1069,  618, 1096, 1030, 1858, 1226,  314,  330,  616,
                                   1190, 1377, 1197,  483,  837,  313,  564, 1813,  691,   25, 1493,  987,  667, 1794,  597,  137, 1164, 1352,  394, 1261,
                                   1076,  333,  761,  890,  346, 1825, 563,/#1212#/1843,  188, 1552, 1647,  252,  741,  736,  132, 1838,  107,  160,  389,
                                   1818,  376,  224, 1821, 1933,  505,  129, 1841,  836,  674, 1596,  545,  610, 1910,   82,   75,  783,  693, 1842,  441,
                                    352, 1168, 1866,  779, 1659, 1204,   86, 1758,/#1663#/763,  345, 1275,  654, 1548, 1209, 1203,  419,  242,  859, 1787,
                                     37, 1795,  372,  467,  172, 1360, 1110,  322,  734,  436, 1554,  204,  977, 1086, 1238,  902,   38,  595,  820, 1186,
                                     21, 1881, 1822, 1177, 1292,  878, 1820,  699, 1223, 1668, 1359, 1724 ],
                                 [ undefined, // S12, ZAT 36
                                   1802, 1912, 1935, 1568,  728,   51,  980, 1810,  559,  930, 1430,  660,  705,  881, 1755,  145, 1652, 1476,  495,   39,
                                   1461,   68,  778,  817,  327, 1447,  148,  121, 1526, 1923, 1420,  133,  920,  273,  181,  300,  798,  602, 1574,  477,
                                    157,  169,  954,  382, 1066, 1771,  582,  161, 1797, 1222,  331,  510, 1848, 1662,  963,  275,   13,  182, 1527,  766,
                                   1152, 1237,  569, 1572, 1323, 1528,  170,  330, 1197,  198,  190, 1190,  618, 1096, 1030, 1858, 1226,  314,   67,  616,
                                   1069, 1377,  689,  483,  837,  597,  564,  691, 1813,   25, 1076,  987,  667, 1794,  313,  137, 1164, 1352,  394, 1261,
                                   1493,  333,  160,  890,  346, 1825,  563, 1843,  188, 1552, 1647,  252,  741,  736,  132, 1838,  107,  761,  389, 1818,
                                    763,  783,  441, 1933,  505,  129, 1841,  836,  674, 1596,  545,   82, 1910,/#610#/  75,  224,  693, 1842, 1821,  352,
                                   1168, 1866, 1659,  779, 1204,   86, 1758,  376,  345, 1275,  654, 1548, 1209,  204,  419,  242,  859, 1787,   37, 1795,
                                    372,  467,  172, 1360, 1110,   21,  734,  436, 1554, 1203,  977, 1086, 1238,  902,   38,  595,  820, 1186,  322, 1881,
                                   1822, 1177, 1292,  878, 1820,  699, 1223, 1668, 1359, 1724 ],
                                 [ undefined, // S12, ZAT 37
                                   1802, 1912, 1935, 1568,  728,   51,  980,  705,  559,  930, 1430,  660, 1810,  881, 1755,  145,  817, 1476,  495,   39,
                                   1461,   68,  778, 1652,  327, 1447,  148,  121, 1526, 1923, 1420,  133,  920,  169,  181,  300,  798,  382, 1574,  477,
                                    157,  273,  954,  602, 1066, 1771,  182,  275, 1797, 1222,  331,  510,  766, 1662, 1237,  161,  170,  582, 1527, 1848,
                                   1152,  963,  569, 1572, 1323, 1528,   13,  330, 1197, 1226,  190, 1190,  618, 1096, 1030,  616,  198,  314,   67, 1858,
                                   1069, 1377,  689,  987, 1794,  597,  564,  691, 1813,   25, 1076,  483,  667,/#837#/ 313,  137, 1164, 1352,  394, 1261,
                                   1493,  333,  160, 1552,  346, 1825,  563, 1818,  188,  890, 1647,  129,  741,  736,  132, 1838,  107,  761,  389, 1843,
                                    763,  783,  441, 1933,  505,  252, 1841,  836,  674, 1596,  545,   82, 1910,   75,  224,  693, 1842, 1821,  352, 1168,
                                   1866, 1659,  779, 1204,   86, 1758,  376,  345, 1275,  654, 1548, 1209,  204,  419,  242,  859, 1787,   37, 1795,  372,
                                    467,  172, 1360, 1110,   21,  734,  436, 1554, 1203,  977, 1086, 1238,  902,   38,  595,  820, 1186,  322, 1881, 1822,
                                   1177, 1292,  878, 1820,  699, 1223, 1668, 1359, 1724,  386 ],
                                 [ undefined, // S12, ZAT 38
                                   1802, 1912, 1935, 1568,  728,   51,  980,  705,  559,  930, 1430,  660, 1810,  881, 1755,  145,  817, 1476,  495,   39,
                                   1461,   68,  778, 1652,  327, 1447,  148,  121, 1526, 1923, 1420,  133,  920,  169,  181,  300,  798,  382, 1574,  477,
                                    157,  273,  954,  602, 1066, 1771,  182,  275, 1797, 1222,  331,  510,  766, 1662, 1237,  161,  170,  582, 1527, 1848,
                                   1152,  963,  569, 1572, 1323, 1528,   13,  330, 1197, 1226,  190, 1190,  618, 1096, 1030,  616,  198,  314,   67, 1858,
                                   1069, 1377,  689,  987, 1794,  597,  564,  691, 1813,   25, 1076,  483,  667,  313,  137, 1164, 1352,  394, 1261, 1493,
                                    333,  160, 1552,  346, 1825,  563, 1818,  188,  890, 1647,  129,  741,  736,  132, 1838,  107,  761,  389, 1843,  763,
                                    783,  441, 1933,  505,  252, 1841,  836,  674, 1596,  545,   82, 1910,   75,  224,  693, 1842, 1821,  352, 1168, 1866,
                                   1659,  779, 1204,   86, 1758,  376,  345, 1275,  654, 1548, 1209,  204,  419,  242,  859, 1787,   37, 1795,  372,  467,
                                    172, 1360, 1110,   21,  734,  436, 1554, 1203,  977, 1086, 1238,  902,   38,  595,  820, 1186,  322, 1881, 1822, 1177,
                                   1292,  878, 1820,  699, 1223, 1668, 1359, 1724,  386 ],
                                 [ undefined, // S12, ZAT 39
                                   1802, 1912, 1935, 1568,  728,   51,  980,  705,  559,  930, 1430,  660, 1810,  881, 1755,  145,  817, 1476,  495,   39,
                                   1461,   68,  778, 1652,  327, 1447,  148,  121, 1526, 1923, 1420,  133,  920,  169,  181,  300,  798,  382, 1574,  477,
                                    157,  273,  954,  602, 1066, 1771,  182,  275, 1797, 1222,  331,  510,  766, 1662, 1237,  161,  170,  582, 1527, 1848,
                                   1152,  963,  569, 1572, 1323, 1528,   13,  330, 1197, 1226,  190, 1190,  618, 1096, 1030,  616,  198,  314,   67, 1858,
                                   1069, 1377,  689,  987, 1794,  597,  564,  691, 1813,   25, 1076,  483,  667,  313,  137, 1164, 1352,  394, 1261, 1493,
                                    333,  160, 1552,  346, 1825,  563, 1818,  188,  890, 1647,  129,  741,  736,  132, 1838,  107,  761,  389, 1843,  763,
                                    783,  441, 1933,  505,  252, 1841,  836,  674, 1596,  545,   82, 1910,   75,  224,  693, 1842, 1821,  352, 1168, 1866,
                                   1659,  779, 1204,   86, 1758,  376,  345, 1275,  654, 1548, 1209,  204,  419,  242,  859, 1787,   37, 1795,  372,  467,
                                    172, 1360, 1110,   21,  734,  436, 1554, 1203,  977, 1086, 1238,  902,   38,  595,  820, 1186,  322, 1881, 1822, 1177,
                                   1292,  878, 1820,  699, 1223, 1668, 1359, 1724,  386,  311,  692 ],
                                 [ undefined, // S12, ZAT 40
                                   1802, 1912, 1935, 1568,  728,   51,  980,  705,  559,  930, 1430,  660, 1810,  881, 1755,  145,  817,  495, 1476,   39,
                                    148,  121, 1526, 1652,  327, 1447, 1461,   68,  778, 1923, 1420,  133,  920,  169,  181,  300,  798,  382,  766,  477,
                                    157,  273,  954,  602, 1066,  582, 1527,  275, 1797, 1222,  331,  510, 1574, 1662, 1237,  161,  170, 1771,  182, 1848,
                                   1190,  963,  569, 1572, 1323, 1528,   13,  330,  597, 1226,  190, 1152,  618, 1096, 1813,  616,  198,  314,  483, 1858,
                                   1352, 1377,  160,  987, 1794, 1197,  564,  691, 1030,   25, 1076,   67,  667,  313,  137, 1164, 1069,  129, 1261, 1493,
                                    333,  689, 1552,  346, 1825,  563, 1818,  188,  890, 1647,  394,  741,  736,  132, 1838,  761,  107,  389, 1843,  763,
                                    783,  441,  419,  505,  252, 1841,  836,  674, 1596,  545,   82, 1910,   75,  224,  693, 1842, 1821,  352, 1168, 1866,
                                   1659,  779, 1204,   86, 1758,  376,   37, 1275,  654, 1548, 1209,  204, 1933,  242,  859,  386,  345, 1795,  372,  467,
                                    172, 1360, 1110,   21,  734,  436, 1554, 1203,  977, 1086, 1238,  902,   38,  595,  820, 1186,  322, 1881, 1822, 1177,
                                   1292,  692, 1820, 1724, 1223, 1668, 1359,  699, 1787,  311,  878 ],
                                 [ undefined, // S12, ZAT 41
                                   1912, 1802,  728,  980, 1935,   51, 1568,  930,  559,  705, 1430,  660, 1810,  881, 1755,  145,  817,  495, 1476,   39,
                                    148,  121, 1526, 1652,  327, 1447, 1461,   68,  778, 1923, 1420,  300,  920,  169,  181,  133,  798,  382,  766,  477,
                                    602,  273,  954,  157, 1066,  582, 1527,  275, 1222, 1797,  331,  510, 1574, 1662, 1237,  161, 1848, 1771,  182,  170,
                                   1190,  963,  569, 1572, 1096, 1528,   13,  330,  597, 1226,  190, 1152,  618, 1323, 1813,  616,  198, 1076,  483, 1858,
                                   1352, 1377,  160,  987, 1794, 1197, 1552,  346, 1030,   25,  314,   67,  667,  313,  137, 1164, 1069,  129,  333, 1493,
                                   1261,  689,  564,  691,  505,   75,  674,  188,  890, 1647,  394,  741,  736,  132, 1838,  761,  107,  389, 1843,  693,
                                    779, 1168,  419, 1825,  252, 1866,  836, 1818, 1596, 1659,   82, 1910,  563,  224,  763, 1842, 1821,  352,  441, 1841,
                                    545,  783, 1204,   86, 1758,  376,   37, 1275,  654, 1548, 1209,  204, 1933,  242,  859,  386,  345, 1795,  311,  467,
                                    172, 1360, 1110,   21,  734,  436, 1554, 1203,  977, 1086, 1238,  902,   38,  595,  820, 1186,  322, 1881, 1822, 1177,
                                   1292,  692, 1820, 1724, 1223, 1668, 1359,  699, 1787,/#372#/ 878 ],
                                 [ undefined, // S12, ZAT 42
                                   1912, 1802,  728,  980, 1935,   51, 1568,  930,  559,  705, 1430,  660, 1810,  881, 1755,  145,  817,  495, 1461,   39,
                                    148,  121, 1526, 1652,  327, 1447, 1476,   68,  181, 1923, 1420,  300,  920,  169,  778,  133,  798,  382,  766,  477,
                                    602,  273,  954,  157, 1066,  582, 1527,  275, 1222, 1797,  331,  510, 1574, 1662, 1237,  161, 1848, 1771,  182,  170,
                                    330,  963, 1226, 1572, 1096, 1528,   13, 1190,  597,  569,  190,  160,  618, 1323, 1813,  616,  198, 1076,  483, 1858,
                                   1352, 1377, 1152,  987, 1794, 1197, 1552,  346, 1030,   25,  314,   75,  667,  313,  137, 1164, 1069,  129,  333, 1493,
                                   1261,  689,  564,  691,  505,   67,  674,  188,  890, 1168,  394,  741,  736,  132, 1838,  761,  107,  389, 1843,  693,
                                    779, 1647,  419, 1825,  252, 1866,  836, 1818,  204, 1659,   82, 1910,  563,  224,  763, 1842, 1821,  311,  441, 1841,
                                    545,  783, 1204,   86, 1758,  376,   37, 1275,  654, 1548, 1209, 1596,   21,  242,  859,  386,  345, 1795,  352,  467,
                                    172, 1360, 1110, 1933,  734,  436, 1554, 1203,  977, 1086,  902, 1238,   38,  595,  820, 1186,  322, 1881, 1822, 1177,
                                   1292,  692, 1820, 1724, 1223, 1668, 1359,  699, 1787,  878 ],
                                 [ undefined, // S12, ZAT 43 - 45
                                   1802, 1912,  728,  980, 1935,  705, 1568,  930,  559,   51,   39,  660, 1810,  881, 1755,  145,  817,   68, 1461, 1430,
                                    148,  121, 1526,  920,  327, 1447, 1476,  495,  181, 1923, 1420,  300, 1652,  169,  778,  382,  157,  133,  766,  477,
                                    275,  273,  954,  798, 1066,  582, 1527,  602,  170, 1797,  331,  510, 1574, 1662, 1528, 1572, 1323, 1771,  182, 1222,
                                    330,  963, 1226,  161, 1096, 1237,  987, 1190,  597,  569,  190,  160,  618, 1848,  616, 1813,  198, 1076, 1164, 1858,
                                   1352, 1377, 1152,   13, 1794, 1197, 1552,  346, 1030,   25,  314,   75,  667,  313,  137,  483, 1069,  129,  333, 1493,
                                   1261,  689,  564,  691,  505,   67,  674,  188,  890, 1168,  394,  741,  736,  132,  563,  761,  107,  389, 1843,  693,
                                    779, 1647,  419, 1825,  252, 1821,  836, 1818,  204, 1659,   82, 1910, 1838,  224,  763, 1842, 1866,  311,  441, 1841,
                                    545,  783, 1204,   86, 1758,  376,   37, 1275,  654, 1548, 1209, 1596,   21,  692,  859,  386,  345, 1795,  352,  467,
                                    172, 1360, 1110, 1933,  734,  436, 1554, 1203,  977, 1086,  902, 1238,   38,  595,  820, 1186,  322, 1881, 1822, 1177,
                                   1292,  242, 1820, 1724, 1223, 1668, 1359,  699, 1787,  878,   71 ],
                                 [ undefined, // S12, ZAT 46
                                   1802, 1912,  728,  980, 1935,  705, 1568,  930,  559,   51,   39,  660, 1810,  881, 1430,  145, 1447,   68, 1461, 1755,
                                    495,  121, 1526,  920,  327,  817, 1476,  148,  181, 1923, 1420,  300, 1652,  169,  766,  382,  157,  602,  778,  477,
                                    275,  273,  954,  798, 1066,  582, 1527,  133,  170, 1797,  331, 1226, 1574, 1662, 1528, 1572, 1323,  198,  182, 1222,
                                    330,  963,  510,  161, 1096, 1237,  987,  616,  597, 1197,  190,  160,  618, 1848, 1190, 1813, 1771, 1076, 1164, 1858,
                                   1352, 1377,  483,   13, 1794,  569, 1552,  346, 1030,   25,  314,  389,  667,  313,  137, 1152, 1069,  129,  333,  691,
                                   1261,  689,  564, 1493,  505, 1825,  674, 1659, 1821, 1168,  394,  204, 1910,  132,  563,  761,  419,   75, 1843,  693,
                                    779, 1866,  107,   67,  252,  890,  836, 1818,  741,  188,   82,  736, 1838,  224,  763, 1548, 1647,  311,  441, 1841,
                                    545,  783, 1204,   86,  902,  376,   37, 1275, 654,/#1842#/1209, 1596,   21,  692,  859,  386,  345, 1795,  352,  172,
                                  /#467#/1360, 1110, 1933,  734,  436, 1554, 1203,  977, 1086, 1758, 1238,   38,  595,  820, 1186,  322, 1881, 1822, 1177,
                                   1724,  242, 1820, 1292, 1223, 1668, 1359,  699, 1787,  878,   71 ],
                                 [ undefined, // S12, ZAT 47
                                   1802, 1912,  728,  980, 1935,  930, 1810,  705,  559,   51,   39,  660, 1568,  881, 1430,  145, 1447,  327, 1526, 1755,
                                    495,  121, 1461,  920,   68,  817, 1420,  148,  181, 1923, 1476,  300, 1652,  169,  766,  382,  582,  602,  778,  477,
                                    275,  273,  954,  798, 1066,  157, 1527,  133,  170, 1096, 1528, 1226, 1574, 1662,  331, 1813,  161,  198,  182, 1222,
                                    330,  963,  510, 1323, 1797, 1237,  987,  616, 1858, 1197,  190,  160,  618, 1848, 1190, 1572, 1771, 1076, 1164,  597,
                                   1352, 1377,  483,  505, 1794,  569, 1552,  667, 1030,  314,   25,  389,  346,  313,  137, 1152, 1069,  129,  333,  691,
                                   1261,  689,  564, 1493,   13, 1825,  674, 1659, 1821,  779,  394,  204, 1910,  132,  563,  761,  419,   75, 1843,  693,
                                   1168, 1866,  107,   67,  252,  890,  836, 1818,  741,  188,  763,  736, 1838,  224,   82, 1548, 1647,  311,  441, 1841,
                                    545,  783, 1204,   86,  902,  376,   37, 1275,  654, 1209, 1596,   21,  692,  859,  386,  345, 1795,  352,  172, 1360,
                                   1110, 1933,  734,  436, 1554, 1203,  977, 1086, 1758, 1238,  242,  595,  820, 1186,  322, 1881, 1822, 1177, 1724,   38,
                                   1820, 1292, 1223, 1668, 1359,  699, 1787,  878,   71 ],
                                 [ undefined, // S12, ZAT 48
                                   1802, 1912,  728,  980, 1935,  930, 1810,  705,  559,   51,   39,  660, 1568,  881, 1430,  145, 1447,  327, 1526, 1755,
                                    495,  121, 1461,  920,   68,  817, 1420,  766,  181, 1923, 1476,  300, 1652,  169,  148,  382,  582,  602,  133,  477,
                                    275,  273,  954,  798, 1066,  157, 1527,  778,  170, 1096, 1528, 1226, 1574, 1662,  331, 1813,  161,  198,  182, 1222,
                                    330,  963,  510, 1323, 1797, 1237,  987,  616, 1858, 1197,  190,  160,  618, 1848, 1190, 1572, 1771, 1076, 1164,  597,
                                   1352, 1377,  667,  505, 1794,  569, 1552,  483, 1030,  314,   25,  389,  346,  563,  137, 1910, 1069,  129,  333,  691,
                                   1261,  689,  564, 1493,   13, 1825,  674, 1659, 1821,  779,  419,  204, 1152,  132,  313,  761,  394,   75, 1843,  693,
                                   1168, 1866,  107,  902,  252,  441,  836, 1818,  741,  188,  763,  736, 1838,  224,   82, 1548,  345,  311,  890, 1841,
                                    545,  783, 1204,   86,   67,  376,   37, 1275,  654, 1209, 1596,   21,  692,  859, 386,/#1647#/1795,  352,  172, 1360,
                                   1110, 1933,  734,  436, 1554, 1203,  977, 1086, 1758, 1238,  242,  595,  820, 1186,  322, 1881, 1822, 1177, 1724,   38,
                                   1820, 1292, 1223, 1668, 1359,  699, 1787,  878,   71 ],
                                 [ undefined, // S12, ZAT 49
                                    728, 1912, 1802,  980, 1935,  930,  660,  705,  559,   51,   39, 1810, 1568,  881, 1755,  145, 1447,  327, 1526, 1430,
                                    495,   68, 1461,  920,  121,  817,  169,  766,  181, 1923, 1476,  300, 1652, 1420,  148,  382,  170, 1527,  133,  477,
                                    275,  273, 1662,  798, 1066,  182,  602,  778,  582, 1096, 1528, 1226,/#1574#/954,  331,  987,  161,  198,  157, 1222,
                                   1848,  963,  510, 1323, 1797, 1237, 1813,  314, 1572, 1197,  190,  160, 1552,  330, 1190, 1858, 1771, 1076,  689,  597,
                                   1352, 1377,  667,  505, 1794,  569,  618,  483, 1030,  616, 1069,  389,  204,  563, 1659, 1910,   25,  129,  333, 1843,
                                   1261, 1164,  564, 1493,  693, 1825,  674,  137, 1821,  779,  419,  346, 1152,  132,  313,  761,  394,   75,  691,   13,
                                    783, 1866,  107,  902,  252,  441,  836, 1818,  741,  188,  763,  736, 1838,  224,   82, 1548,  345,  311,  890, 1841,
                                    545, 1168, 1204,   86,   67,  376,   37, 1275,  654, 1209, 1596,   21,  692,  859,  386, 1795,  352,  172, 1360, 1110,
                                   1933,  734,  436, 1554, 1203,  977, 1086, 1758, 1238,  242,  595,  820, 1186,  322, 1881, 1822, 1177, 1724,   38, 1820,
                                   1292, 1223, 1668, 1359,  699, 1787,  878,   71, 1837 ],
                                 [ undefined, // S12, ZAT 50 - 51
                                    728, 1912, 1802,  980, 1935,  930,  660,  705,  559,   51,   39, 1810, 1568,  881, 1755,  145, 1447,  327, 1526, 1430,
                                    495,   68, 1461,  920,  121,  817,  169,  766,  181, 1923, 1476,  300, 1652, 1420,  148,  382,  170, 1527,  133,  477,
                                    275,  273, 1662,  798, 1066,  182,  602,  778,  582, 1096, 1528, 1226,  954,  331,  987,  161,  198,  157, 1222, 1848,
                                    963,  510, 1323, 1797, 1237, 1813,  314, 1572, 1197,  190,  160, 1552,  330, 1190, 1858, 1771, 1076,  689,  597, 1352,
                                   1377,  667,  505, 1794,  569,  618,  483, 1030,  616, 1069,  389,  204,  563, 1659, 1910,   25,  129,  333, 1843, 1261,
                                   1164,  564, 1493,  693, 1825,  674,  137, 1821,  779,  419,  346, 1152,  132,  313,  761,  394,   75,  691,   13,  783,
                                   1866,  107,  902,  252,  441,  836, 1818,  741,  188,  763,  736, 1838,  224,   82, 1548,  345,  311,  890, 1841,  545,
                                   1168, 1204,   86,   67,  376,   37, 1275,  654, 1209, 1596,   21,  692,  859,  386, 1795,  352,  172, 1360, 1110, 1933,
                                    734,  436, 1554, 1203,  977, 1086, 1758, 1238,  242,  595,  820, 1186,  322, 1881, 1822, 1177, 1724,   38, 1820, 1292,
                                   1223, 1668, 1359,  699, 1787,  878,   71, 1837 ],
                                 [ undefined, // S12, ZAT 52
                                    728, 1912, 1802,  980, 1935,  930,  660,  705,  559,   51,   39, 1810, 1568,  881, 1755,  145, 1447,  327, 1526, 1430,
                                    495,   68, 1461,  920,  121,  817,  169,  766,  181, 1923, 1476,  300, 1652, 1420,  148,  382,  170, 1527, 1528,  778,
                                    275,  273, 1662,  798, 1066,  182,  602,  477,  582, 1096,  133, 1226,  954,  331,  987,  161,  198,  157, 1222, 1848,
                                    963,  510, 1813, 1797, 1237, 1323,  483, 1572, 1197,  190,  160, 1552,  330, 1190, 1858, 1771, 1076,  689,  597, 1352,
                                   1377,  667,  505,  333,  569,  618,  314,  616, 1030, 1069,  389,  204,  563, 1659, 1910,   25,  129, 1794, 1843, 1261,
                                   1164,  564, 1493,  693, 1825,  674,  137, 1821,  779,  419,  346, 1152,  132,  313,  761,  394,   75,  691,   13,  783,
                                   1866,   82,   37,  252,  441,  311, 1818,  741,  188,  763,  736, 1838,  224,  107, 1548,  345,  836,  386,  977,  545,
                                   1168, 1204,   86,   67,  376,  902, 1275,  654,  242, 1596,   21,  692,  859,  890, 1933,  172,  352, 1360, 1110, 1795,
                                     71,  436, 1554, 1203, 1841, 1086, 1758, 1724, 1209,  595,  820, 1186,  322, 1881, 1822, 1177, 1238,   38, 1820, 1292,
                                   1223, 1668, 1359,  699, 1787,  878,  734, 1837 ],
                                 [ undefined, // S12, ZAT 53
                                    728, 1912,  980, 1802, 1935,  930,  660,  705, 1755,   39,   51, 1810, 1526, 1430,  559,  145, 1447,  327, 1568,  881,
                                    495,   68, 1461,  300,  121,  817,  169,  766,  181,  275, 1476,  920, 1652, 1420,  148,  382,  170, 1527, 1528,  778,
                                   1923,  273, 1662,  798, 1096,  182,  602,  477,  582, 1066,  133, 1848,  987,  331,  954,  161,  157,  198, 1197, 1226,
                                    160,  510, 1813, 1797, 1076, 1323,  483, 1352, 1222,  190,  963, 1552,  597, 1190, 1858, 1771, 1237,  689,  330, 1572,
                                   1659,  667,  505,  333,  569,  618,  314,  616, 1030, 1069,  389,  204, 563,/#1377#/1910,   25,  129, 1794, 1843,  674,
                                   1164,  564, 1493,  693, 1825, 1261,  224,  736,  779,  419,  346, 1152,  132,  313, 1548,  394,   75,  691, 1866,  783,
                                     13,   82,   37,  252, 1168,  311, 1818,  741,  188,  763, 1821, 1838,  137,  107,  761,  345,  836,  386,  977,  545,
                                    441, 1204,   86,   67,  376,  902, 1275,  654,  242, 1596,   21,  692,  859,  890, 1933,  172,  352, 1360, 1110, 1795,
                                     71,  436, 1554, 1203, 1841, 1086, 1758, 1724, 1209,  595,  820, 1186,  322, 1881, 1822, 1177, 1238,   38, 1820, 1292,
                                   1223, 1668, 1359,  699, 1787,  878,  734, 1837 ],
                                 [ undefined, // S12, ZAT 54
                                    728, 1912,  980, 1802, 1935,  930,  660,  705, 1755,   39,   51, 1810, 1526, 1430,  559,  145, 1447,  327, 1568,  881,
                                    495,   68, 1461,  300,  121,  817,  169,  766,  170,  275, 1476,  920, 1652, 1420,  148,  382,  181, 1527, 1528,  778,
                                   1923,  273, 1662,  133, 1096,  182,  602,  477,  582, 1066,  798, 1848,  987,  331,  954,  161,  157,  198, 1197, 1226,
                                    160,  597, 1813, 1797, 1076, 1323,  483, 1352, 1222,  314,  963, 1552,  510,  505, 1858, 1771, 1237,  618,  330, 1572,
                                   1659,  667, 1190, 1069,  569,  689,  190,  616,  674,  333,  389,  204,  563, 1910,   25,  129, 1794, 1843, 1030, 1164,
                                    564, 1493,  693, 1825, 1261,  224,  736,  779,  419,  346, 1152,  132,  313, 1548,  394,   75,  691, 1866,  783,   13,
                                     82,   37,  252, 1168,  311, 1818,  741,  188,  763, 1821, 1838,  137,  107,  761,  345,  836,  386,  977,  545,  441,
                                   1204,   86,   67,  376,  902, 1275,  654,  242, 1596,   21,  692,  859,  890, 1933,  172,  352, 1360, 1110, 1795,   71,
                                    436, 1554, 1203, 1841, 1086, 1758, 1724, 1209,  595,  820, 1186,  322, 1881, 1822, 1177, 1238,   38, 1820, 1292, 1223,
                                   1668, 1359,  699, 1787,  878,  734, 1837 ],
                                 [ undefined, // S12, ZAT 55 - 57
                                    728,  930,  980, 1802,  705, 1912,   51, 1935, 1755,   39,  660, 1810, 1526, 1430,  559,  300, 1447,  766,  881, 1568,
                                    495,   68, 1461,  145,  121,  817,  169,  327,  170,  275, 1476,  920, 1652, 1420,  148,  382,  181, 1527, 1528,  182,
                                   1923,  273, 1662,  133, 1096,  778,  602,  477, 1197, 1066,  798, 1848,  987,  331,  954,  161,  157,  198,  582, 1226,
                                    160,  597, 1813, 1858, 1076, 1323, 1572, 1352, 1222,  314,  963, 1552,  510,  505, 1797, 1771, 1237,  618,  204,  483,
                                   1659,  667, 1190, 1069,  569,  689,  190,  616,  674,  333,  389,  330,  563,  779, 1548,  129, 1794, 1843, 1030, 1164,
                                    564, 1493,  693, 1825, 1261,  224,  736, 1910,  419,  346, 1152,  132,  313,   25,  394,   75,  783, 1866,  691,   13,
                                    441,   37,  252, 1168,  311, 1818,  741,  188,  763, 1821,  761,  137,  107, 1838,  345,  836,  386,  977,  545,   82,
                                   1204,   86,   67,  376,  902, 1275,  654,  242, 1596,   21,  692,  859,  890, 1933,  172,  352, 1360, 1110, 1795,   71,
                                    436, 1554, 1203, 1841, 1086, 1758, 1724, 1209,  595,  820, 1186,  322, 1881, 1822, 1177, 1238,   38, 1820, 1292, 1223,
                                   1668, 1359,  699, 1787,  878,  734, 1837 ],
                                 [ undefined, // S12, ZAT 58
                                    728,  930,  980, 1802,  705, 1912,   51, 1935, 1755,  660,   39, 1810, 1526, 1430,  559,  300, 1447,  766,  881, 1568,
                                    495,  382, 1461,  145,  121,  817,  169,  327,  170,  275, 1476,  920, 1652, 1420, 1528,   68,  181, 1527,  148,  182,
                                   1923,  273, 1662,  133, 1096,  778,  602,  477, 1197, 1066,  798, 1848,  987,  331,  954,  160,  157,  198,  582, 1226,
                                    161,  597, 1813, 1858, 1076, 1323,  483, 1352,  667,  314,  963, 1552,  510,  505, 1797, 1771, 1237,  618,  204, 1572,
                                   1659, 1222, 1825, 1069, 1843,  689,  190,  616,  674,  333,  563,  330,  389,  779, 1548,  129, 1794,  569, 1030, 1164,
                                    783, 1493,  693, 1190, 1261,  224,  736, 1910,  419,  346, 1152,  132,  313,   25,  394,   75,  564, 1866,  691,   13,
                                    441,   37,  252, 1168,  311, 1818,  741,  188,  763, 1821,  761,  137,  107, 1838,  345,  836,  386,  977,   82,  545,
                                   1204,   86,   67,  376,  902, 1275,  654,  242, 1596,   21,  692,  859,  890, 1933,  172, 1724, 1360, 1110, 1795,   71,
                                    436, 1554, 1203, 1841, 1086, 1758,  352, 1209,  595,  820, 1186,  322, 1881, 1822, 1177, 1238,   38, 1820, 1292, 1223,
                                   1668, 1359,  699, 1787,  878,  734, 1837 ],
                                 [ undefined, // S12, ZAT 59
                                    728,  930,  980, 1755,  705,   51, 1912, 1935, 1802,  660,   39, 1810, 1526, 1430,  559,  300, 1447,  817,  881, 1568,
                                    495,  382, 1461,  170,  121,  766,  169,  327,  145,  275, 1527,  920,  181, 1420, 1528,   68, 1652, 1476,  148,  778,
                                   1923,  273, 1662,  133, 1096,  182,  602,  477, 1197, 1066,  798, 1076,  987,  331,  954,  160,  157, 1813,  582, 1226,
                                    161,  597,  198, 1858, 1848,  505,  483, 1352,  667,  314,  204, 1659,  510, 1323, 1797, 1771, 1237,  618,  963, 1572,
                                   1552, 1222, 1825, 1069, 1843,  689,  190,  616,  674,  333,  563,  313,  389,  779, 1910,  129, 1794,  569, 1030, 1164,
                                    783, 1493,  693, 1190,  224, 1261,  736, 1548,  419,  346, 1152,  132,  330, 1168,  394,   75,  564, 1866,  691,   13,
                                    441,   37,  252,   25,  311, 1818,  741,  188,  763, 1821,  761,  137,  692,  977,  345,  836,  386, 1838,   82,  545,
                                   1204,   86,   67,  376,  902, 1275,  654,  242, 1596,   21,  107,  859,  890, 1668,  172, 1724, 1360, 1110, 1795,   71,
                                    436, 1554, 1203, 1841, 1086, 1758,  352, 1209,  595,  820, 1186,  322, 1881, 1822, 1177, 1238,   38, 1820, 1292, 1223,
                                   1933, 1359,  699, 1787,  878,  734, 1837 ],
                                 [ undefined, // S12, ZAT 60
                                    728,  930,  980, 1755,  705,   51, 1912, 1935, 1802,  660,   39, 1810, 1526, 1430,  559,  300, 1447,  881,  817, 1568,
                                    495,  382, 1461,  170,  121,  766,  169,  327,  145,  275, 1527,  920,  181, 1420, 1528,   68, 1652, 1476, 1076,  778,
                                   1923,  273, 1662,  133, 1096,  182,  602,  477, 1197, 1066,  798,  148,  987,  331,  954,  160,  157, 1813,  582, 1226,
                                    161,  597,  198, 1858, 1848,  505,  483, 1352,  667,  314,  204, 1659,  510, 1323, 1797, 1771, 1237,  618,  963, 1572,
                                   1552,  616, 1825, 1069, 1843,  689,  190, 1222,  674,  333,  563,  313,  389,  779, 1910,  129, 1794,  569, 1030, 1164,
                                    783, 1493,  693, 1190,  224, 1261,  736, 1548,  419,  346, 1152,  132,  330, 1168,  394,   75,  564, 1866,  691,   13,
                                    441,   37,  252,   25,  311, 1818,  741,  188,  763, 1821,  761,  137,  692,  977,  345,  836,  386, 1838,   82,  545,
                                   1204,   86,   67,  376,  902, 1275,  654,  242, 1596,   21,  107,  859,  890, 1668,  172, 1724, 1360, 1110, 1795,   71,
                                    436, 1554, 1203, 1841, 1086, 1758,  352, 1209,  595,  820, 1186,  322, 1881, 1822, 1177, 1238,   38, 1820, 1292, 1223,
                                   1933, 1359,  699, 1787,  878,  734, 1837 ],
                                 [ undefined, // S12, ZAT 61
                                    930,  728,  980, 1755,  705,   51, 1912, 1802, 1935,  660, 1447, 1810, 1526, 1430,  559,  300,   39,  881,  817, 1461,
                                    766, 1527, 1568,  170,  121,  495,  169, 1528,  145,  275,  382,  920,  778, 1923,  327,   68,  477,  182, 1076,  181,
                                   1420,  273, 1662,  133,  602, 1476, 1096, 1652, 1197, 1066,  798,  148,  987,  331,  505,  160, 1352, 1813,  582, 1226,
                                    161,  597,  198, 1858, 1848,/#954#/1552,  157,  667,  314,  204, 1659,  510, 1825,  963, 1771, 1237,  618, 1797, 1572,
                                    483,  616, 1323,  783, 1843,  689,  190, 1222,  674,  333,  563,  313,/#389#/ 779, 1866,  129, 1794,  569, 1030, 1164,
                                   1069, 1493,  693, 1190,  224,  977,  736, 1548,  419,  346, 1152,  132,  330, 1168,  394,   75,  564, 1910,  691,   13,
                                    441,   37,   82,   25,  311, 1818,  741,  188,  763, 1821,  761,  137,  692, 1261,  345,  836,  386, 1838,  252,  545,
                                   1204,   86,   67,  376,  902, 1275,  654,  242, 1596,   21,  107,  859,  890, 1668,  172, 1724, 1360, 1110, 1795,   71,
                                    436, 1554, 1203, 1841, 1086, 1758,  352, 1209,  595,  820, 1186,  322, 1881, 1822, 1177, 1238,   38, 1820, 1292, 1223,
                                   1933, 1359,  699, 1787,  878,  734, 1837 ],
                                 [ undefined, // S12, ZAT 62 - 65 (Kopie!)
                                    930,  728,  980, 1755,  705,   51, 1912, 1802, 1935,  660, 1447, 1810, 1526, 1430,  559,  300,   39,  881,  817, 1461,
                                    766, 1527, 1568,  170,  121,  495,  169, 1528,  145,  275,  382,  920,  778, 1923,  327,   68,  477,  182, 1076,  181,
                                   1420,  273, 1662,  133,  602, 1476, 1096, 1652, 1197, 1066,  798,  148,  987,  331,  505,  160, 1352, 1813,  582, 1226,
                                    161,  597,  198, 1858, 1848, 1552,  157,  667,  314,  204, 1659,  510, 1825,  963, 1771, 1237,  618, 1797, 1572,  483,
                                    616, 1323,  783, 1843,  689,  190, 1222,  674,  333,  563,  313,  779, 1866,  129, 1794,  569, 1030, 1164, 1069, 1493,
                                    693, 1190,  224,  977,  736, 1548,  419,  346, 1152,  132,  330, 1168,  394,   75,  564, 1910,  691,   13,  441,   37,
                                     82,   25,  311, 1818,  741,  188,  763, 1821,  761,  137,  692, 1261,  345,  836,  386, 1838,  252,  545, 1204,   86,
                                     67,  376,  902, 1275,  654,  242, 1596,   21,  107,  859,  890, 1668,  172, 1724, 1360, 1110, 1795,   71,  436, 1554,
                                   1203, 1841, 1086, 1758,  352, 1209,  595,  820, 1186,  322, 1881, 1822, 1177, 1238,   38, 1820, 1292, 1223, 1933, 1359,
                                    699, 1787,  878,  734, 1837 ],
                                 [ undefined, // S12, ZAT 66
                                    930,  728,  980, 1755,  705,   51, 1810, 1802, 1935,  660, 1447, 1912, 1526, 1430,  559,  300,   39,  881,  817, 1461,
                                    766, 1527, 1568,  495,  121,  170,  327, 1528,  145,  275,  382,  920,  778, 1923,  169, 1076,  477,  182,   68,  181,
                                   1420,  273, 1662,  133,  602, 1352, 1096, 1652, 1197, 1066,  798,  148,  987,  331,  505,  160, 1476, 1813,  582, 1226,
                                    161,  597,  198, 1858, 1848, 1552,  157,  667,  483,  783, 1659,  510, 1825,  963, 1771, 1237,  618, 1797, 1572,  314,
                                    129, 1222,/#204#/1843, 1866,  190, 1323,  674,  333,  563,  313,  779,  689,  616, 1794,  569,  419, 1164,  346, 1493,
                                    693, 1190,  224,  977,  736, 1548, 1030, 1069, 1152,  132,  330, 1168,  394,   75,  564, 1910,  691,   13,  441,   37,
                                     82,   25,  311, 1818, 1821,  188,  763,  741,  902,  137,  692, 1261,  345,  836,  386, 1838,  252,  545, 1204,   86,
                                     67, 1724,  761, 1275,  654,  242, 1596,   21,  107,  859,  890, 1668,  172,  376, 1359, 1110, 1795,   71,  436, 1554,
                                   1203, 1841, 1086, 1758,  352, 1209,  595,  820, 1186,  322, 1881, 1822, 1177, 1238,   38, 1820, 1292, 1933, 1223, 1360,
                                    699, 1787,  878,  734, 1837,  823 ],
                                 [ undefined, // S12, ZAT 67 - 69
                                    728,  930,   51, 1755,  705,  980, 1810, 1802, 1935,  660,  300, 1912, 1526, 1430,  881, 1447,   39,  559,  817, 1461,
                                    766, 1527, 1568,  495,  121,  170,  327, 1528,  182,  275,  382,  920,  778, 1923,  169, 1076,  477,  145,   68,  181,
                                   1420,  273, 1662,  133,  602, 1352, 1096,  505, 1197, 1066,  798,  148,  987,  331, 1652, 1813, 1476,  160,  582, 1226,
                                    161,  597,  198,  963, 1848, 1552,  157,  667,  483,  783, 1659,  510, 1825, 1858, 1771, 1237,  618,  674,  779,  314,
                                    129, 1222, 1843, 1866,  190, 1323, 1797,  224,  563,  313, 1572,  689,  616, 1794,  569,  419, 1164,  346, 1493,  693,
                                   1190,  333,  977,  736, 1548, 1030, 1069, 1152,  132,  330, 1168,  394,   75,  564, 1910,  691,   13,  441,   37,   82,
                                     25,  311, 1818, 1821,  188,  763,  741,  902,  137,  692, 1261,  345,  836,  386, 1838, 1110,  545, 1204,   86,   67,
                                   1724,  761, 1275,  654,  242, 1596,   21,  107,  859,  890, 1668,  172,  376, 1359,  252, 1795,   71,  436, 1554, 1203,
                                   1841, 1086, 1758,  352, 1209,  595,  820, 1186,  322, 1881, 1822, 1177, 1238,   38, 1820, 1292, 1933, 1223, 1360,  699,
                                   1787,  878,  734, 1837,  823 ],
                                 [ undefined, // S12, ZAT 70
                                    728,  930,   51, 1755,  705,  980, 1810, 1802, 1935,  660,  300, 1912, 1526, 1430,  766,  121,   39,  559,  495, 1461,
                                    881, 1527, 1568,  817, 1447,  275,  169, 1528,  182,  170,  382,  920,  778, 1923,  327, 1076,  477,  145,   68,  987,
                                   1420,  602, 1662,  148,  273, 1352,  160,  505, 1197, 1066,  798,  133,  181,  331, 1652, 1813, 1476, 1096,  582, 1226,
                                    161,  597,  783,  963,  483, 1552,  157,  667, 1848,  198, 1659, 1825,  510, 1858,  563, 1237,  618, 1843,  779,  693,
                                    129, 1222,  674, 1866,  190, 1323, 1797,  224, 1771,  313, 1572,  441,  419,  977,  569,  616, 1164,  346, 1493,  314,
                                   1190,  333, 1794,  736, 1548, 1821,  902, 1152,   82,  330, 1168,  311,   75,  564, 1910,  691,   13,  689,   37,  132,
                                     25,  394, 1818, 1030,   21,  763,  741, 1069,  137,  692, 1261,  345,  836,  386, 1838, 1110,  545, 1204,   86,   67,
                                   1724,  761, 1275,  654,  242, 1596,  188,  107,  859,  890, 1668,  172,  376, 1359,  252, 1795,   71,  436, 1554, 1203,
                                   1841, 1086, 1758,  352, 1209,  595,  820, 1186,  322, 1881, 1822, 1177, 1238,   38, 1933, 1292, 1820, 1223, 1360,  699,
                                   1787,  878,  734, 1837,  823 ],
                                 [ undefined, // S12, ZAT 71
                                    930,  728,   51, 1755,  705,  980, 1810, 1430, 1935,  660,  300, 1912,   39, 1802,  766,  121, 1526,  559,  495, 1461,
                                    881, 1527,  920,  817, 1447,  275,  169, 1528,  182,  170,   68, 1568,  778, 1923,  327, 1076,  477,  145,  382,  987,
                                   1420,  602, 1662,  148,  273, 1352,  160,  505, 1197, 1066,  798,  133,  181,  331, 1552, 1813, 1659, 1096,  582, 1226,
                                    161,  597,  783,  963,  483, 1652,  157,  667, 1848,  198, 1476, 1825,  510, 1858,  563, 1237,  618, 1843,  779,  693,
                                    129, 1222,  674, 1866,  190, 1323,  346,  224, 1771,  313, 1572,  441,  419,  977,  569,  616, 1164, 1797, 1493,  314,
                                   1190,  333, 1794,  736, 1548, 1821,  902,  345,   82,  330, 1168,  311,   75,  564, 1910,  691,   13,  689,   37,  132,
                                     25,  394, 1818, 1030,   21,  763,  741, 1069,  137,  692, 1261, 1152,  836,  386, 1838, 1110,  545, 1204,   86,   67,
                                   1724,  761, 1275,  654,  242, 1596,  188,  107,  859,  890, 1668,  172,  376, 1359,  252, 1795,   71,  436, 1554, 1203,
                                   1841, 1086, 1758,  352, 1209,  595,  820, 1186,  322, 1881, 1822, 1177, 1238,   38, 1933, 1292, 1820, 1223, 1360,  699,
                                   1787,  878,  734, 1837,  823, 1157 ],
                                 [ undefined, // S12, ZAT 72
                                    930,  728,   51, 1755,  705,  980, 1810, 1430, 1935,  660,  300, 1912,   39, 1802,  766,  121, 1526,  559,  495, 1461,
                                    881, 1527,  920,/#817#/1447,  275,  169, 1528,  182,  170,   68, 1568,  778, 1923,  327, 1076,  477,  145,  382,/#987#/
                                   1420,  602, 1662,  148,  273, 1352,  160,  505, 1197, 1066,  798,  133,/#181#/ 331, 1552, 1813, 1659, 1096,/#582#/1226,
                                    161,  597,  783,  963,  483, 1652,  157,  667, 1848,  198, 1476, 1825,  510, 1858,  563, 1237,  618, 1843,  779,  693,
                                  /#129#/1222,  674, 1866,  190, 1323,  346,  224, 1771,  313, 1572,  441,/#419#/ 977,  569,  616, 1164, 1797, 1493,  314,
                                   1190,  333, 1794,  736, 1548, 1821,  902,  345,   82,  330, 1168,  311,   75,  564, 1910,  691,   13,  689,   37,  132,
                                     25,  394, 1818, 1030,   21,  763,  741, 1069,  137,  692, 1261, 1152,  836,  386, 1838, 1110,  545, 1204,   86,   67,
                                   1724,  761, 1275,  654,  242, 1596,  188,  107,  859,  890, 1668,  172,  376, 1359,  252, 1795,   71,  436, 1554, 1203,
                                   1841, 1086, 1758,  352, 1209,  595,  820, 1186,  322, 1881, 1822, 1177, 1238,   38, 1933, 1292, 1820, 1223, 1360,  699,
                                   1787,  878,  734, 1837,  823, 1157 ],
                                 [ undefined, // S13, ZAT 1
                                    930,  728,   51, 1755,  705,  980, 1810, 1430, 1935,  660,  300, 1912,   39, 1802,  766,  121, 1526,  559,  495, 1461,
                                    881, 1527,  920, 1447,  275,  169, 1528,  182,  170,   68, 1568,  778, 1923,  327, 1076,  477,  145,  382, 1420,  602,
                                   1662,  148,  273, 1352,  160,  505, 1197, 1066,  798,  133,  331, 1552, 1813, 1659, 1096, 1226,  161,  597,  783,  963,
                                    483, 1652,  157,  667, 1848,  198, 1476, 1825,  510, 1858,  563, 1237,  618, 1843,  779,  693, 1222,  674, 1866,  190,
                                   1323,  346,  224, 1771,  313, 1572,  441,  977,  569,  616, 1164, 1797, 1493,  314, 1190,  333, 1794,  736, 1548, 1821,
                                    902,  345,   82,  330, 1168,  311,   75,  564, 1910,  691,   13,  689,   37,  132,   25,  394, 1818, 1030,   21,  763,
                                    741, 1069,  137,  692, 1261, 1152,  836,  386, 1838, 1110,  545, 1204,   86,   67, 1724,  761, 1275,  654,  242, 1596,
                                    188,  107,  859,  890, 1668,  172,  376, 1359,  252, 1795,   71,  436, 1554, 1203, 1841, 1086, 1758,  352, 1209,  595,
                                    820, 1186,  322, 1881, 1822, 1177, 1238,   38, 1933, 1292, 1820, 1223, 1360,  699, 1787,  878,  734, 1837,  823, 1157,
                                    696, 1006,   28,   41, 1018,  754,  /#0#/1929 ],
                             //  [ undefined, 930, 728, 51, 1755, 705, 980, 1810, 1430, 1935, 660, 300, 1912, 39, 1802, 766, 121, 1526, 559, 495, 1461, 881, 1527, 920, 1447, 275, 169, 1528, 182, 170, 68, 1568, 778, 1923, 327, 1076, 477, 145, 382, 1420, 602, 1662, 148, 273, 1352, 160, 505, 1197, 1066, 798, 133, 331, 1552, 1813, 1659, 1096, 1226, 161, 597, 783, 963, 483, 1652, 157, 667, 1848, 198, 1476, 1825, 510, 1858, 563, 1237, 618, 1843, 779, 693, 1222, 674, 1866, 190, 1323, 346, 224, 1771, 313, 1572, 441, 977, 569, 616, 1164, 1797, 1493, 314, 1190, 333, 1794, 736, 1548, 1821, 902, 345, 82, 330, 1168, 311, 75, 564, 1910, 691, 13, 689, 37, 132, 25, 394, 1818, 1030, 21, 763, 741, 1069, 137, 692, 1261, 1152, 836, 386, 1838, 1110, 545, 1204, 86, 67, 1724, 761, 1275, 654, 242, 1596, 188, 107, 859, 890, 1668, 172, 376, 1359, 252, 1795, 71, 436, 1554, 1203, 1841, 1086, 1758, 352, 1209, 595, 820, 1186, 322, 1881, 1822, 1177, 1238, 38, 1933, 1292, 1820, 1223, 1360, 699, 1787, 878, 734, 1837, 823, 1157, 696, 1006, 28, 41, 1018, 754, 1929 ],
                                 [ undefined, // S13, ZAT 2
                                    930,  728,   51, 1755,  705,  980, 1810, 1802, 1935,  660, 1526, 1912,   39, 1430,  766,  121,  300,  559,  495, 1461,
                                    881, 1527,  920,  778,  275,  169, 1528,  182,  170,   68, 1568, 1447, 1923,  327, 1076,  477,  145,  382, 1420,  602,
                                   1662,  148,  273, 1352,  160,  505, 1197,  331,  783,  133, 1066, 1552, 1813, 1659, 1096, 1226,  161,  597,  798,  963,
                                    483, 1652,  157,  667, 1848,  198, 1476, 1825,  510, 1858,  563, 1237,  618, 1843,  779,  693, 1222,  674, 1866,  190,
                                   1323,  346,  224, 1771,  313, 1572,  441,  977,  569,  616, 1164, 1797, 1493,  314, 1190,/#333#/1794,  736, 1548, 1821,
                                    902,  345,   82,  330, 1168,  311,   75,  564, 1204,  691,   13,  689,   37,  132,   25,  394, 1818, 1030,   21,  763,
                                    741, 1069,  137,  692, 1261, 1152,  836,  386, 1838, 1110,  545, 1910,   86,  172, 1724,  761, 1275,  654,  242, 1596,
                                    188,  107,  859,  890, 1668,   67,  376, 1359,  252, 1795,   71,  436, 1554,1841,/#1203#/1086, 1758,  352, 1209,  595,
                                     28, 1186,  322, 1881, 1822, 1177, 1238,   38, 1933, 1292, 1820, 1223, 1360,  699, 1787,  878,  734, 1837,  823, 1157,
                                    696, 1006,  820,   41, 1018,  754, 1929 ],
                                 [ undefined, // S13, ZAT 3
                                    930,  728,   51, 1755,  705,  980, 1810, 1802, 1935,  660, 1526,  121,   39, 1430, 1461,/#1912#/300,  559,  495,  766,
                                    881,  182,  920,  778,  275,  169, 1528, 1527,  170,   68,  148, 1447, 1923,  327, 1076, 1352,  602,  382, 1420,  145,
                                   1662, 1568,  133,  477,  160, 1226, 1197,  331,  783,/#273#/1066, 1552,  198, 1659, 1096,/#505#/ 779,  597,  798,  963,
                                    674, 1652,  157, 1848,  667, 1813, 1237,  224,  510, 1866,  563, 1476,  618, 1843,/#161#/ 693, 1222,  483, 1858,  190,
                                   1323,  346, 1825, 1771,  313, 1572,  441,  977,  616,  569, 1164, 1797,  314, 1493, 1190, 1794,  736, 1548, 1821,   37,
                                    345,   82,  330, 1168,  311,   75,  564, 1204,  691,   13,  689,  902,  132,   25, 1668, 1818, 1110,   21,  763,  741,
                                   1069,  137,  692, 1261, 1152,  836,  386, 1838, 1030,  545, 1910,   86,  172, 1724,  761, 1275,  654,  242, 1596,  188,
                                    107,  859,  890,  394,   67,  376, 1359,  252, 1795,   71,  436, 1554, 1841, 1086, 1758,  352, 1209,  595,   28, 1186,
                                    322, 1881, 1933, 1177, 1238,   38, 1822, 1292, 1820, 1223, 1360,  699, 1787,  878,  734, 1837,  823, 1157,  696, 1006,
                                    820,   41, 1018,  754, 1929 ],
                                 [ undefined, // S13, ZAT 4
                                    930,  980,   51, 1810, 1802,  728, 1755,  705, 1935,  660, 1526,  121,  300,  495, 1461,   39,  778, 1430,  766,  881,
                                    182,  920,  559,  275,  169, 1528,  148,  602,   68, 1527,  160, 1923,  327, 1076, 1352,  170,  382,  783,  145, 1662,
                                   1568,  133,  477, 1447, 1226, 1197,  331, 1420, 1066, 1552,  198,  157, 1096,  779,  597,  483,  963,  563, 1652, 1659,
                                   1222,  667, 1813, 1237,  224,  510, 1866,  674, 1476,  618, 1843,  693, 1848,  798, 1858,  190, 1323,  346, 1825, 1771,
                                    313, 1572,  441,  977,  616,  569, 1164, 1797,  314, 1493, 1190, 1794,  736, 1548, 1821,   37,  345,   82,  330, 1168,
                                    311,   75,  564, 1204,  691,   13,  689,  902,  132,   25, 1668, 1818, 1110,   21,  763,  741, 1069,  137,  692, 1261,
                                   1152,  836,  386, 1838, 1030,  545, 1910,   86,  172, 1724,  761, 1275,   28,  242, 1596,  188,  107,  859,  890,  394,
                                     67,  376, 1359,  252, 1795,   71,  436, 1554, 1841, 1086, 1758,  352, 1209,  595,  654, 1186,  322, 1881, 1933, 1177,
                                   1238,   38, 1822, 1292, 1820, 1223, 1360,  699, 1787,  878,  734, 1837,  823, 1157,  696, 1006,  820,   41, 1018,  754,
                                   1929 ],
                                 [ undefined, // S13, ZAT 5
                                     51,  980,  930, 1810, 1802,  728, 1755,  705, 1526,  660, 1935,  121,  300,  495, 1461,   39,  778, 1430,  766,  881,
                                    182, 1923,  559,  275,  169, 1528,  148,  602,   68, 1527,  160,  920,  327, 1076, 1352,  170,  382,  783,  145, 1552,
                                   1568,  133,  477, 1447,  667, 1197,  331, 1420, 1066, 1662,  198,  157, 1096,  779,  597,  483,  693,  563, 1652, 1659,
                                   1222, 1226, 1813, 1237,  224,  510, 1866,  674, 1476,  618, 1843,  963, 1848,  798, 1858,  190, 1323,  346, 1825, 1771,
                                    313, 1572,  441,  977,  616,  569, 1164, 1797,  314, 1493, 1190, 1794,  736, 1548, 1821,   37,   82,  345,  330, 1168,
                                    311,   75,  564, 1204,  691,   13,  689,  902,  132,   25, 1668, 1818, 1110,   21,  763,  741, 1069,  137,  692, 1261,
                                   1152,  836,  386, 1838, 1030,  545, 1910,   86,  172, 1724,  761, 1275,   28,  242, 1596,  188,  107,  859,  890,  394,
                                     67,  376, 1359,  252, 1795,   71,  436, 1554, 1841, 1086, 1758,  352, 1209,  595,  654, 1186,  322, 1933, 1881, 1177,
                                   1238,   38, 1822, 1292, 1820, 1223, 1360,  699, 1787,  878,  734, 1837,  823, 1157,  696, 1006,  820,   41, 1018,  754,
                                   1929 ],
                                 [ undefined, // S13, ZAT 6
                                     51,  980,  930, 1810, 1802,  728,  121, 1461, 1526,  660, 1935, 1755,  300,  495,  705,   39,  778, 1430,  766,  881,
                                    182, 1923,  602,  160,  920, 1528,  148,  559,   68,  783,  275,  169,  327, 1076, 1352,  170,  382, 1527,  157, 1552,
                                   1568,  133,  477, 1447,  667, 1197,  331, 1226, 1066, 1662,  198,/#145#/ 597,  483, 1096,  779,  693,  563, 1652, 1813,
                                   1222, 1420, 1659, 1237,  224,  510, 1866,  674, 1476,  618, 1843,  963, 1848,  798, 1572,  190, 1323, 1825,  346, 1771,
                                    313, 1858,  441,  977,  616, 1204, 1164, 1797,  314, 1493, 1190, 1110,  736, 1069, 1821,   82,   37,  345,  330, 1168,
                                    311,   75,  564,  569,  691,   13,  689,  902,  132,   25, 1668, 1818, 1794,   21,  763,  741, 1548,  137,  692, 1261,
                                   1152,  836,  386, 1838, 1030,  545, 1910,  172,   86, 1724,  761, 1275,   28,  242, 1596,  188,  107,  859,  890,  394,
                                     67,  376, 1359,  252, 1795,   71,  436, 1554, 1841, 1086, 1758,  352, 1209,  595,  654, 1186, 1933,  322, 1881, 1177,
                                   1238,   38, 1822, 1292, 1820, 1223, 1360,  699, 1787,  878,  734, 1837,  823, 1157,  696, 1006,  820,   41, 1018,  754,
                                   1929 ],
                                 [ undefined, // S13, ZAT 7 - 9
                                    930,  980,   51, 1810,  660,  728,  121, 1461, 1526, 1802, 1935, 1755,  778,   39,  705,  495,  300, 1430,  766,  881,
                                    182, 1923,  602,  160,  920, 1528,  148,  559,   68,  783,  275,  169,  327, 1076, 1352,  170,  382, 1527,  157,  477,
                                   1568,  133, 1552, 1447,  667, 1197,  331, 1226, 1066, 1662,  198,  597,  483, 1096,  779,  693,  963,  674, 1813, 1222,
                                   1420, 1659, 1237,  224,  510, 1866, 1652, 1476,  618,  977,  563, 1848,  798, 1572,  190, 1323, 1825,  346, 1771,  313,
                                   1858,  616, 1843,  441, 1204, 1164, 1797,  314, 1493, 1190, 1110,  736, 1069, 1821,   82,   37,  345,  330, 1168,  311,
                                     75,  564,  569,  691,   13,  689,  902,  132,   25, 1668, 1818, 1794,   21,  763,  741, 1548,  137,  692, 1261, 1152,
                                    836,  386, 1838, 1030,  545, 1910,  172,   86, 1724,  761, 1275,   28,  242, 1596,  188,  107,  859,  890,  394,   67,
                                    376, 1359,  252, 1795,   71,  436, 1554, 1841, 1086, 1758,  352, 1209,  595,  654, 1186, 1933,  322, 1881, 1177, 1238,
                                     38, 1822, 1292, 1820, 1223, 1360,  699, 1787,  878,  734, 1837,  823, 1157,  696, 1006,  820,   41, 1018,  754, 1929 ],
                                 [ undefined, // S13, ZAT 10
                                    930,  980,   51, 1810,  660,  728,  121, 1461, 1526, 1802, 1935, 1755,  778,   39,  705,  495,  300, 1430, 1923,  881,
                                    182,/#766#/ 602,  160,  920, 1528,  148,  783,   68,  559,  275,  157,  327, 1076, 1352,  170,  382, 1226,  169,  477,
                                   1568,  133, 1552, 1447,  667, 1197,  331, 1527, 1066, 1662, 1237,  597,  483, 1096,  779,  693,  963,  674, 1813, 1222,
                                   1420, 1848,  198,  224,  510, 1866, 1652, 1476,  618,  977,  563, 1659,  616, 1572,  441, 1323, 1825,  346, 1771,  313,
                                   1858,  798, 1843,  190, 1204, 1164, 1797,  314, 1069, 1190, 1110,  736, 1493, 1821,   82,   37,  345,  330, 1168,  311,
                                     75,  564,  569,  691,   13,   28,  902,  132,   25, 1668, 1818, 1794,   21,  763,  741, 1548,  137,  692, 1261, 1152,
                                    836,  386, 1838, 1030,  545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394,   67,
                                    376, 1359,  252, 1795,   71,  436, 1554, 1841, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933,  322, 1881, 1177, 1238,
                                     38, 1822, 1292, 1820, 1223, 1360,  699, 1787,  878,  734,  754,  823, 1157,  696, 1006,  820,   41,  654, 1837, 1929 ],
                                 [ undefined, // S13, ZAT 11
                                    930,  980,   51, 1810,  660,  728, 1802, 1461, 1526,  121, 1935, 1755,  778,   39,  705,  495,  300, 1430, 1923,  920,
                                    182, 1352,  160,  881, 1528,  275,  783,   68,  559,/#148#/ 157,  327, 1076,  602,  170,  382, 1226,  169,  477, 1662,
                                    133, 1552, 1447,  667, 1197,  331, 1527, 1066, 1568, 1237,  597,  224, 1096,  779,  693,  963,  674, 1813, 1222, 1420,
                                   1848,  198,  483,  510, 1866, 1652, 1110,  618,  977,  563, 1659,  616, 1572,  441, 1204, 1858, 1843, 1771,  313, 1825,
                                    798,  346,  190, 1323, 1164, 1797,  314, 1069, 1190, 1476,  736, 1493, 1821,   82,   37,  902,  330, 1168,  311,   75,
                                    564,  569, 1818,   13,   28,  345,  132,   25, 1668,  691, 1794,   21,  763,  741, 1548,  137,  692, 1261, 1152,  836,
                                    386, 1838, 1030,  545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394,   67,  376,
                                   1359,  252, 1795,   71,  436, 1554, 1841, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933,  322, 1881, 1177, 1238,   38,
                                   1822, 1292, 1820, 1223, 1360,  699, 1787,  878,  734,  754,  823, 1157,  696, 1006,  820,   41,  654, 1837, 1929 ],
                                 [ undefined, // S13, ZAT 12
                                    930,  980,   51, 1810,  660,  728, 1802, 1461, 1526,  121, 1935, 1755,  778,   39,  705,  495, 1923, 1430,  300,  920,
                                    182, 1352,  160,  881, 1528,  275,  783,   68,  477,  157,  327, 1076,  602,  170,  382, 1226,  169,  559, 1662,  133,
                                   1552, 1447,  667, 1197,  331,  483, 1066, 1568, 1237,  597,  224, 1096,  779,  693, 1204,  674, 1813, 1222, 1420, 1848,
                                    198, 1527, 1843, 1866, 1652,  313,  618,  346,  563, 1659,  616, 1572,  441,  963, 1858,  510, 1771, 1110, 1825,  798,
                                    977,  314, 1323, 1069, 1797,  190, 1164, 1190, 1476,   82, 1493, 1821,  736,   37,  902,  330, 1168,  311,   75,  564,
                                    569, 1818,   13,   28,  345,  132,   25, 1668,  691, 1794,   21,  763,  741, 1548,  137,  692, 1261, 1152,  836,  386,
                                   1838, 1030,  545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394,   67,  376, 1359,
                                    252, 1795,   71,  436,  754, 1841, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933,  322, 1881, 1177, 1238,   38, 1822,
                                   1292, 1820, 1223, 1360,  699, 1787,  878,  734, 1554,  823, 1157,  696, 1006,  820,   41, 654,/#1837#/1929 ],
                                 [ undefined, // S13, ZAT 13
                                     51,  980,  930, 1810,  660,  728, 1802, 1461, 1526,  121, 1935, 1755,  778,   39, 1430,  495, 1923,  705,  300,  920,
                                    182, 1352, 1528,  881,  160,  275,  783,   68,  477,  602,  327, 1076,  157,  170,  382,  779,  169,  559, 1662,  133,
                                   1552, 1447,  667,  224,  198,  483, 1066, 1568, 1237,  597, 1197, 1096, 1226,  693, 1204,  674, 1813, 1222, 1420, 1848,
                                    331, 1527, 1843, 1866, 1652,  313,  618,  346,  563, 1659,  616, 1572,  441,  963, 1858,  510, 1771, 1110,  902,  798,
                                    977,  314, 1323, 1069, 1797,  190, 1164, 1190, 1476,   82, 1493, 1821,  736,   37, 1825,  330, 1168,  311,   75,  564,
                                    569, 1818,   13,   28,  345,  132,   25, 1668,  691, 1794,   21,  763,  741, 1548,  137,  692, 1838, 1152,  836,  386,
                                   1261, 1030,  545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394,   67,  376, 1359,
                                    252, 1795,   71,  436,  754, 1841, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933,  322, 1881, 1177, 1238,   38, 1822,
                                   1292, 1820, 1223, 1360,  699, 1787,  878,  734, 1554,  823, 1157,  696, 1006,  820,   41,  654, 1929 ],
                                 [ undefined, // S13, ZAT 14
                                     51,  980,  930, 1810,  660,  728, 1802, 1461, 1526,  121, 1935, 1755,  778,   39, 1430,  495, 1923,  705,  300,  920,
                                    182, 1352, 1528,  881,  160,  275,  783,   68,  477,  602,  327, 1076,  157,  170,  382,  779,  169,  559, 1662,  133,
                                   1552, 1447,  667,  224,  198,  483, 1066, 1568, 1237,  597, 1197, 1096, 1226,  693, 1204,  674, 1813, 1222, 1420, 1848,
                                    331, 1527, 1843, 1866, 1652,  313,  618,  346,  563, 1659,  616, 1572,  441,  963, 1858,  510, 1771, 1110,  902,  798,
                                    977,  314, 1323, 1069, 1797,  190, 1164, 1190, 1476,   82, 1493, 1821,  736,   37, 1825,  330, 1168,  311,   75,  564,
                                    569, 1818,   13,   28,  345,  132,   25, 1668,/#691#/1794,   21,  763,  741, 1548,  137,  692, 1838, 1152,  836,  386,
                                   1261, 1030,  545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394,   67,  376, 1359,
                                    252, 1795,   71,  436,  754, 1841, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933,  322, 1881, 1177, 1238,   38, 1822,
                                   1292, 1820, 1223, 1360,  699, 1787,  878,  734, 1554,  823, 1157,  696, 1006,  820,   41,  654, 1929, 1882,  214 ],
                                 [ undefined, // S13, ZAT 15
                                     51,  980,  930, 1810,  660,  728, 1802, 1461, 1526,  121, 1935, 1755,  778,   39, 1430,  495, 1923,  705,  300,  920,
                                    182, 1352, 1528,  881,  160,  275,  783,   68,  477,  602,  327, 1076,  157,  170,  382,  779,  169,  559, 1662,  133,
                                   1552, 1447,  667,  224,  198,  483, 1066, 1568, 1237,  597, 1197, 1096, 1226,  693, 1204,  674, 1813, 1222, 1420, 1848,
                                    331, 1527, 1843, 1866, 1652,  313,  618,  346,  563, 1659,  616, 1572,  441,  963, 1858,  510, 1771, 1110,  902,  798,
                                    977,  314, 1323, 1069, 1797,  190, 1164, 1190, 1476,   82, 1493, 1821,  736,   37, 1825,  330, 1168,  311,   75,  564,
                                    569, 1818,   13,   28,  345,  132,   25, 1668, 1794,   21,  763,  741, 1548,  137,  692, 1838, 1152,  836,  386, 1261,
                                   1030,  545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394,   67,  376, 1359,  252,
                                   1795,   71,  436,  754, 1841, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933,  322, 1881, 1177, 1238,   38, 1822, 1292,
                                   1820, 1223, 1360,  699, 1787,  878,  734, 1554,  823, 1157,  696, 1006,  820,   41,  654, 1929, 1882,  214 ],
                                 [ undefined, // S13, ZAT 16
                                     51,  980,  930, 1810,  660,  728, 1802, 1461, 1526,  121, 1935, 1755,  778,   39, 1430,  495, 1923,  705,  300,  920,
                                    182, 1352, 1528,  881,  160,  275,  783,   68,  477,  602,  327, 1076,  157,  170,  382,  779,  133,  559, 1662,  169,
                                   1552, 1204,  667,  224,  198,  483, 1066, 1568, 1237,  597, 1197, 1096, 1226,  693, 1447,  674, 1527, 1222, 1420, 1848,
                                    331, 1813, 1843, 1866, 1652,  963, 1069,  346,  563, 1659,  616, 1572,  441,  313, 1858,  510, 1771, 1110,  902,  798,
                                    977,  314, 1323,  618, 1797,  190, 1164, 1190, 1476,   82, 1493, 1821,  736,   37, 1825,  330, 1168,  311, 1794,  564,
                                    569, 1818,   13,   28,  345,  132,   25, 1668,   75,   21,  763,  741, 1548,  137,  692, 1838, 1152,  836,  386, 1261,
                                   1030,  545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394,   67,  376, 1359,  252,
                                   1795,   71,  436,  754, 1841, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933,  322, 1881, 1177, 1238,   38, 1822, 1292,
                                   1820, 1223, 1360,  699, 1787,  878,  734, 1554,  823, 1157,  696, 1006, 1882,   41,  654, 1929,  820,  214 ],
                                 [ undefined, // S13, ZAT 17
                                    980,   51,  930, 1802,  660,  728, 1810, 1461, 1526,  778, 1935, 1755,  121,   39, 1430,  920, 1352,  705,  300,  495,
                                    182, 1923, 1528,  881,  160,  275,  783,   68,  477,  602,  327, 1662,  157,  170,  382,  779,  133,  559, 1076,  169,
                                   1552, 1204,  667,  224,  693,  331, 1066, 1568, 1237,  597, 1197, 1096, 1226,  198, 1447,  674, 1527, 1222, 1420, 1848,
                                    483, 1813, 1843, 1866,  346,  963, 1069, 1652, 1858, 1659,  616, 1572,  441,  313,  563,  510, 1771, 1110,  902,  798,
                                    977,  314, 1323,  618, 1821,  190, 1164, 1190, 1476, 1493,   82, 1797,  736,   37, 1825,  330, 1168, 1838, 1794,  564,
                                    569, 1818,   13,   28,  345,  132,   25, 1668,   75,   21,  763,  741, 1548,  137,  692,  311, 1152,  836,  386, 1261,
                                   1030,  545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394,   67,  376, 1359,  252,
                                   1795,   71,  436,  754, 1841, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933,  322, 1881, 1177, 1238,   38, 1822, 1292,
                                   1820, 1223, 1360,  699, 1787,  878,  734, 1554,  823, 1157,  696, 1006, 1882,   41,  654, 1929,  820,  214 ],
                                 [ undefined, // S13, ZAT 18
                                    980,   51,  930, 1802,  660,  728, 1810, 1461, 1526,  778, 1935, 1755,  121,   39, 1430,  920, 1352,  705,  300,  495,
                                    182, 1923, 1528,  881,  160,  275,  783,   68,  477,  602,  327, 1662,  157,  170,  382,  779,  133,  559, 1076, 1237,
                                   1552, 1204,  667,  224,  693,  331, 1066, 1568,  169,  674, 1197, 1866, 1226,  198,  483,  597, 1527, 1222, 1420, 1848,
                                   1447, 1813, 1843, 1096,  346,  963, 1069, 1652, 1858, 1659,  616, 1572,  441,  313,  563,  510, 1771, 1110,  902,  798,
                                     13,  314, 1323,  618, 1821,  190, 1164, 1190, 1476, 1493,   82,  311,  736,   37, 1825,  330, 1168, 1838, 1794,  564,
                                    569, 1818,  977,   28,  345,  132,   25, 1668,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,
                                   1030,  545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394,   67,  376, 1359,  252,
                                   1795,   71,  436,  754, 1841, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933,  322, 1881, 1177, 1238,   38, 1822, 1292,
                                   1820, 1223, 1360, 1882, 1787,  878,  734, 1554,  823, 1157,  696, 1006,  699,   41,  654, 1929,  820,  214 ],
                                 [ undefined, // S13, ZAT 19
                                     51,  980,  930,  728,  660, 1802, 1810, 1461, 1526,  778, 1935, 1755,  121,   39, 1430,  920, 1528,  705,  300,  495,
                                    182, 1923, 1352,  881,  160,  275, 1662,   68,  477,  602,  327,  783,  224,  170,  382,  779,  667,  559, 1076, 1237,
                                   1552, 1204,  133,  157,  693,  331, 1066, 1568,  169,  674, 1197, 1866, 1226,  198,  483,  597, 1527, 1659, 1420, 1848,
                                   1447, 1813, 1843, 1096,  346,  963, 1069, 1652, 1858, 1222,  616, 1572,  441,  313,  563,  510, 1771, 1110,  902,  798,
                                     13,  314, 1794,  618, 1821,  190, 1164, 1190, 1476, 1493,   82,  311,  736,   37, 1825,  330, 1168, 1838, 1323,  564,
                                    569, 1818,  977,   28,  345,  132,   25, 1668,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,
                                   1030,  545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394,   67,  376, 1359,  252,
                                   1795,   71,  436,  754, 1841, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933,  322, 1881, 1177, 1238,   38, 1822, 1292,
                                   1820, 1223, 1360, 1882, 1787,  878,  734, 1554,  823, 1157,  696, 1006,  699,   41,  654, 1929,  820,  214 ],
                                 [ undefined, // S13, ZAT 20
                                     51,  980,  930, 1526,  660, 1802, 1810, 1461,  728,  778, 1935, 1755,  121,   39, 1430,  920, 1528,  705,  300,  495,
                                    182, 1923, 1352,  881,  160,  275, 1662,   68,  477,  602,  327,  783,  224,  170,  382, 1204,  667,  559, 1076, 1237,
                                   1552,  779,  133,  157,  693,  331, 1066, 1568,  169,  674, 1197, 1866, 1226,  198,  483,  597, 1527, 1659, 1420, 1848,
                                   1447, 1813, 1843, 1096,  346,  963, 1069, 1652, 1858, 1222,  616, 1572,  441,  313,  563,  510, 1771, 1110,   28,  798,
                                     13,  314, 1794,  618, 1821,  190, 1164, 1190, 1476, 1493,   82,  311,  736,   37, 1825,  330, 1168, 1838, 1323,  564,
                                    569, 1818,  977,  902,  345,  132,   25, 1668,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,
                                    754,  545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394,   67,  376,  696,  252,
                                   1795,   71,  436, 1030, 1841, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933,  322, 1881, 1177, 1238,   38, 1822, 1292,
                                   1820, 1223, 1360, 1882, 1787,  878,  734, 1554,  823, 1157, 1359, 1006,  699,   41,  654, 1929,  820,  214 ],
                                 [ undefined, // S13, ZAT 21
                                    980,   51,  930, 1526, 1461, 1802, 1810,  660,  728, 1755, 1935,  778,  121,   39, 1430,  920, 1528,  705,  300,  495,
                                    182, 1923, 1352,  275,  327,  881,  477,   68, 1662,  783,  160,  602,  224,  170,  382, 1204,  667,  559, 1076,  169,
                                   1226,  779,  133,  674,  693,  331, 1659, 1527, 1237,  157, 1197, 1866, 1552,  198,  483,  313, 1568, 1066, 1420, 1848,
                                   1447, 1069, 1843, 1096,  346,  963, 1813, 1652, 1858, 1222,  616, 1572,  441,  597,  563,  510, 1771, 1110,   28,  798,
                                     13,  314, 1794,  618, 1821,  190, 1164, 1190, 1476, 1493,   82,  311,  736,   37, 1825,  330, 1168, 1838, 1323,  564,
                                    569, 1818,  977,  902,  345,  132,   25, 1668,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,
                                    754,  545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394,   67,  376,  696,  252,
                                   1795,   71,  436, 1030, 1841, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933,  322, 1881, 1177, 1238,   38, 1822, 1292,
                                   1820, 1223, 1360, 1882, 1787,  878,  734, 1554,  823, 1157, 1359, 1006,  699,   41,  654, 1929,  820,  214 ],
                                 [ undefined, // S13, ZAT 22
                                    980, 1802,  930, 1526, 1461,   51, 1810,  660,  728, 1755,  495,  778,  705,   39, 1430,  920, 1528,  121,   68, 1935,
                                    182, 1923, 1352,  275,  327, 1662, 1204,  300,  881,  783,  160,  602,  169,  170,  382,  477,  667,  559, 1866,  224,
                                   1226,  779,  133,  674,  693,  331, 1659, 1527, 1237,  483, 1197, 1076, 1552,  198,  157,  597, 1568, 1066, 1420, 1848,
                                   1447, 1069, 1843,  441,  346,  963, 1813, 1652, 1858, 1222,  616, 1572, 1096,  313,  563,  510, 1771, 1110,   28,  798,
                                     13,  314, 1794,  618, 1821,  190,   82, 1190, 1476, 1493, 1164,  311,  736,   37, 1825,  330, 1168, 1838, 1323,  564,
                                    569, 1818,  977,  902,  345,  132,   25,  754,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,
                                   1668,  545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394, 1882,  376,  696,  252,
                                   1795,   71,  436, 1030, 1841, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933, 1157, 1881, 1177, 1238,   38, 1822, 1292,
                                  1820,/#1223#/1360,   67, 1787,  878,  734, 1554,  823,  322, 1359, 1006,  699,   41,  654, 1929,  820,  214 ],
                                 [ undefined, // S13, ZAT 23
                                    930, 1802,  980,  728, 1461,   51, 1810, 1430, 1526, 1755,  495,  778,  705,   39,  660,  327, 1528,  121,   68, 1935,
                                    182,  170, 1352,  275,  920, 1662, 1204,  300,  881,  382,  160,  602,  169, 1923,  783,  477,  667, 1527, 1866,  224,
                                   1226,  779,  133,  674,  693, 1848, 1659,  559, 1237,  483, 1197, 1076, 1552, 1843,  157,  597, 1568, 1066, 1420,  331,
                                   1447, 1069,  198,  441, 1222,  963, 1813, 1794, 1858,  346,  616, 1572, 1096,  313,  563,  510, 1771, 1110,   28,  798,
                                     13,  314, 1652,  618, 1821,  190,   82, 1190, 1476, 1493, 1164,  311,  736,   37, 1825,  330, 1168, 1838, 1323,  564,
                                    569, 1818,  977,  902,  345,  132,   25,  754,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,
                                   1668,  545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394, 1882,  376,  696,  252,
                                   1795,   71,  436, 1030, 1841, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933, 1157, 1881, 1177, 1238,   38, 1822, 1292,
                                   1820, 1360,   67, 1787,  878,  734, 1554,  823,  322, 1359, 1006,  699,   41,  654, 1929,  820,  214 ],
                                 [ undefined, // S13, ZAT 24
                                    930, 1802,  980,  728, 1461,   51, 1810, 1430, 1526, 1755,  495,  705,  778,   39,  660,  327, 1528, 1204,   68, 1662,
                                    182,  170, 1352,  275,  920, 1935,  121,  783,  881,  382,  160,  602,  169, 1923,  300, 1226,  667, 1527, 1866, 1848,
                                    477,  483,  133,  674,  693,  224, 1659,  559, 1237,  779, 1197, 1076, 1069, 1843,  157,  597, 1568, 1066, 1420,  331,
                                   1858, 1552,  198,  441, 1222,  963, 1813, 1794, 1447,  346,  616, 1572, 1096,  313,  563,  510, 1771, 1110,   28,  798,
                                     13,  314, 1652, 1825, 1821,  190,   82, 1493, 1476, 1190, 1164,  754,  736,   37,/#618#/ 330, 1168, 1838, 1323,  564,
                                    569, 1818,  977,  902,  345,  132,   25,  311,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,
                                   1882,  545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394, 1668, 1157,  696,  252,
                                   1795,   71,  436, 1030, 1841, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933,/#376#/1881, 1177, 1238,   38, 1822, 1292,
                                   1820, 1360,   67, 1787,  878,  734, 1554,  823,  322, 1359, 1006,  699,   41,  654, 1929,  820,  214 ],
                                 [ undefined, // S13, ZAT 25 - 27
                                    930,  980, 1802,  728, 1461,   51, 1810, 1430, 1526, 1755,  182,  705,  778,   39,  660,  327, 1528, 1204,   68, 1662,
                                    495,  170, 1352,  275,  920, 1935,  121,  783,  382,  881,  160,  667,  169, 1923,  300, 1226,  602, 1076, 1197, 1848,
                                    477,  483,  133,  674,  693,  224, 1659,  559, 1237,  779, 1866, 1527, 1069, 1843,  157,  597, 1568, 1066, 1420,  331,
                                   1858, 1552,  198,  346, 1222,  963, 1813, 1794, 1447,  441,  616, 1572, 1096,  313,  563,  510, 1771, 1110,   28,  798,
                                     13,  314, 1652, 1825, 1821,  190,   82, 1493, 1476, 1190, 1164,  754,  736,   37,  330, 1168, 1838, 1323,  564,  569,
                                   1818,  977,  902,  345,  132,   25,  311,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261, 1882,
                                    545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394, 1668, 1157,  696,  252, 1795,
                                     71,  436, 1030, 1841, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933, 1881, 1177, 1238,   38, 1822, 1292, 1820, 1360,
                                     67, 1787,  878,  734, 1554,  823,  322, 1359, 1006,  699,   41,  654, 1929,  820,  214 ],
                                 [ undefined, // S13, ZAT 28
                                    930,  980, 1802,  728, 1461,   51, 1810, 1430, 1526, 1755,  182,  705,  495,   39,  660,  170,  920, 1352,   68, 1662,
                                    778,  327, 1204, 1923, 1528, 1935,  121,  783,  382,  881,  160,  667,  483,  275, 1848, 1226,  602, 1076, 1197,  300,
                                   1866,  169,  133,  674,  693, 1568, 1659,  559, 1237,  779,  477, 1527, 1069, 1843,  157,  597,  224, 1066, 1420,  331,
                                   1858, 1552,  198,  563, 1222,  963, 1813, 1794, 1447,  441,  616, 1572, 1096,  313,  346,  510, 1771, 1110,   28,  798,
                                     13,  314, 1652, 1825, 1821,  190,   82, 1493, 1476, 1190, 1164,  754,  736,   37,  330,  311, 1838, 1323,  564,  569,
                                   1818,  977,  902,  345,  132,   25, 1168,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261, 1882,
                                    545, 1910,  172,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394, 1668, 1157,  696,  252, 1795,
                                     71,  436, 1841, 1030, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933, 1881, 1177, 1238,   38, 1822, 1292, 1820, 1360,
                                     67, 1787,  878,  734, 1554,  823,  322, 1359, 1006,  699,   41,  654, 1929,  820,  214 ],
                                 [ undefined, // S13, ZAT 29
                                    930, 1802,  980,  728, 1461,   51,  660, 1430, 1755, 1526,   68,  705,  495,   39, 1810,  170,  920, 1352,  182, 1662,
                                    778,  327, 1204, 1923, 1528, 1935,  121,  783,  382,  881,  160,  667,  483,  275, 1848, 1226,  602, 1076, 1197,  300,
                                   1866,  169,  133,  674,  693, 1568, 1659,  559, 1237,  779,  477, 1527, 1069, 1843,  157, 1222,  224, 1066, 1420,  441,
                                   1858, 1552,  198,  563,  597,  963, 1813, 1794, 1447,  331,  616, 1572, 1096,  313,  346,  510, 1771, 1110, 1821,  798,
                                     13,  314, 1652, 1825,   28,  190,   82, 1493, 1476, 1190, 1164,  754,  736,   37,  330,  311, 1838, 1323,  564,  569,
                                   1818,  977,  902,  345,  132,   25, 1168,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261, 1882,
                                    545, 1910,  696,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394, 1668, 1157,  172,  252, 1795,
                                     71,  436, 1841, 1030, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933, 1881, 1177, 1238,   38, 1822, 1292, 1820, 1360,
                                     67, 1787,  878,  734, 1554,  823,  322, 1359, 1006,  699,   41,  654, 1929,  820,  214 ],
                                 [ undefined, // S13, ZAT 30
                                    930, 1802,  980,  728, 1461,   51,  660, 1430, 1755, 1526,   68,  705,  495,   39, 1810,  170,  920, 1352,  783, 1662,
                                    778,  483, 1848, 1923, 1528, 1226,  121,  182,  382,  881,  160,  667,  327,  275, 1204, 1935,  602, 1076, 1197, 1527,
                                   1866,  133,  169,  674,  693, 1568, 1659,  559, 1237,  963, 1069,  300,  477, 1843,  157, 1222,  224, 1066, 1420,  441,
                                   1858, 1552,  198,  563,  597,  779, 1813, 1794, 1447,  331, 1572,  616, 1096,  313,  346,  510, 1771, 1110, 1821,  754,
                                     13,  314, 1652, 1825,   28,  190,   82, 1493, 1476, 1190, 1164,  798,  736,   37,  330,  311, 1838, 1323,  564,  569,
                                   1818,  977,  902,  345,  132,   25, 1168,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261, 1882,
                                    545, 1910,  696,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394, 1668, 1157,  172,  252, 1795,
                                     71,  436, 1841, 1030, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933, 1881, 1177, 1238,   38, 1822, 1292, 1820, 1360,
                                     67, 1787,  878,  734, 1554,  823,  322, 1359, 1006,  699,   41,  654, 1929,  820,  214 ],
                                 [ undefined, // S13, ZAT 31
                                    930, 1802,  980,  728, 1461,   51, 1810, 1430, 1755, 1526,   68,  705,  170, 1662,  660,  495,  920, 1352,  783,   39,
                                    778,  483, 1848,  667,  160, 1226,  121,  182, 1197,  881, 1528, 1923,  327,  275, 1204, 1935, 1659, 1076,  382, 1527,
                                   1843,  133,  169,  674,  693, 1568,  602,  559, 1237,  963, 1069,  300,  477, 1866, 1552, 1222,  224, 1066, 1420,  441,
                                   1858,  157,  198,  563,  597,  779, 1813, 1794, 1447,  331, 1572,  616, 1096,  313,  346,  510, 1771, 1110, 1821,  754,
                                     13,  314, 1652, 1825,   28,  190,   82, 1493, 1476, 1190, 1164,  798,  736,   37, 1882,  311, 1838, 1323,  564,  569,
                                   1818,  977,  902,  345,  132,   25, 1168,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,  330,
                                    545, 1910,  696,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  859,  890,  394, 1668, 1157,  172,  252, 1795,
                                     71,  436, 1841, 1030, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933, 1881, 1177, 1238,   38, 1822, 1292, 1820, 1360,
                                     67, 1787,  878,  734, 1554,  823,  322, 1359, 1006,  699,   41,  654, 1929,  820,  214 ],
                                 [ undefined, // S13, ZAT 32
                                    930, 1802,  980, 1430, 1461,   51, 1810,  728, 1755, 1526,   68,  705,  170, 1662,  660,  495,  920, 1352,  783,   39,
                                    778,  483, 1528,  667,  160, 1226,  121,  182, 1197,  881, 1848, 1923,  169, 1527, 1204, 1935, 1659, 1866,  382,  275,
                                   1843,  133,  327,  674,  693, 1568,  602,  559, 1237,  963, 1222,  300,  477, 1076, 1552, 1069,  224, 1066, 1420,  441,
                                   1858,  157,  198,  563,  597,  779, 1813, 1794, 1447,  616, 1572,  331, 1096,  313,  346,  510, 1771, 1110, 1821,  754,
                                     13,  314, 1652, 1825,  902,  190,   82, 1493, 1476, 1190, 1164,  798,  736,   37, 1882,  311, 1838, 1323,  564,  569,
                                   1818,  977,   28,  345,  132,   25, 1168,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,  330,
                                    545, 1910,  696,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  890,  859,  394, 1668, 1157,  172,  252, 1795,
                                     71, 1841,  436, 1030, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933, 1881, 1177, 1238,   38, 1822, 1292, 1820, 1360,
                                     67, 1787,  878,  734,/#1554#/823,  322, 1359, 1006,  699,   41,  654, 1929,  820,  214,  873 ],
                                 [ undefined, // S13, ZAT 33
                                    930, 1802,  980, 1430, 1461,   51, 1810,  728, 1755,  660,   68,   39,  170,  920, 1526,  495, 1662, 1352,  783,  705,
                                    778,  483, 1528, 1197,  160, 1935, 1204,  182,  667,  881, 1848, 1923,  169, 1527,  121, 1226, 1659, 1866,  382,  275,
                                   1843,  133,  327, 1552,  693, 1568,  602,  559, 1237,  963, 1222,  300,  477, 1076,  674, 1069,  224, 1066, 1420,  441,
                                   1858,  157,  198,  563,  597,  779, 1813, 1794, 1447,  616, 1572,  331, 1096,  313,  346,  510, 1771, 1110, 1323,  977,
                                     13,  314, 1652, 1825,  902,  190,   82, 1493, 1476, 1190, 1164,  798,  736,   37, 1882,  311, 1838, 1821,  564,  569,
                                   1818,  754,   28,  345,  132,   25, 1168,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,  330,
                                    545, 1910,  696,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  890,  859,  394, 1668, 1157,  172,  252, 1795,
                                     71, 1841,  436, 1030, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933, 1881, 1177, 1238,   38, 1822, 1292, 1820, 1360,
                                     67, 1787,  878,  734,  823,  322, 1359, 1006,  699,   41,  654, 1929,  820,  214,  873,  582 ],
                                 [ undefined, // S13, ZAT 34
                                    930, 1802,  980, 1430, 1461, 1755, 1810,  728,   51,  660,   68,   39,  170,  920, 1526,  495, 1662, 1352,  783,  705,
                                    778,  483, 1528, 1197,  160, 1935, 1204,  182,  667,  881, 1848, 1923,  133, 1659,  121, 1226, 1527, 1866,  382,  275,
                                   1843,  169,  327, 1552,  693, 1568,  602,  559, 1237,  963, 1222,  300,  477, 1076,  674, 1069,  224, 1066, 1420,  441,
                                   1858,  157,  198,  563,  597,  779, 1813,  616, 1447, 1794, 1572,  331, 1825,  313,  346,  510, 1771,  902, 1882,  977,
                                     13,  190, 1652, 1096, 1110,  314,   82, 1493, 1476, 1190, 1164,  798,  736,   37, 1323,  311, 1838, 1821,  564,  569,
                                   1818,  754,   28,  345,  132,   25, 1168,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,  330,
                                    545, 1910,  696,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  890,  859,  394, 1668, 1157,  172,  252, 1795,
                                     71, 1841,  436, 1030, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933, 1881, 1177, 1238,   38, 1822, 1292, 1820,  873,
                                     67, 1787,  878,  734,  823,  322, 1359, 1006,  699,   41,  654, 1929,  820,  214,/#1360#/582,  777 ],
                                 [ undefined, // S13, ZAT 35
                                    930, 1802,  980,  728, 1461, 1755, 1810, 1430,   51,  660,   68,   39,  170,  783, 1526,  495, 1662, 1352,  920,  705,
                                    778,  483, 1528, 1197,  121, 1935, 1204,  182,  667,  881, 1848,  382,  133, 1659,  160, 1226, 1527, 1866, 1923,  275,
                                   1843,  169,  327, 1552,  693, 1568, 1069,  559, 1237,  963, 1222,  300,  477, 1076,  674,  602,  224, 1066, 1420,  441,
                                   1858,  157,  198,  563,  597,  779, 1813,  616, 1447, 1794, 1572,  331, 1825,  313,  346,  510, 1771,  902, 1882,  977,
                                   1821,  190, 1652, 1096, 1110,  314,   82, 1493, 1476, 1190, 1164,  798,  736,   37, 1323,  311, 1838,   13,  564,  569,
                                   1818,  754,   28,  345,  132,   25, 1168,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,  330,
                                    545, 1910,  696,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  890,  859,  394, 1668, 1157,  322,  252, 1795,
                                     71, 1841,  436, 1030, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933, 1881, 1177, 1238,   38, 1822, 1292, 1820,  873,
                                     67, 1787,  878,  734,  823,  172, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,  777 ],
                                 [ undefined, // S13, ZAT 36
                                    930, 1802,  980,  728, 1461, 1755, 1810, 1430, 1526,  660,   68,  495,  170,  783,   51,   39, 1662, 1352,  920,  705,
                                   1528,  483,  778, 1197,  121, 1935, 1204,  182,  667,  881, 1848,  382,  133, 1659,  160, 1226, 1527, 1866, 1923,  275,
                                   1843, 1076,  674, 1552,  693, 1568, 1069,  559, 1237,  963, 1222,  300,  477,  169,  327,  602,  224, 1825, 1420,  441,
                                   1858,  157,  198,  563,  597,  779, 1813,  616, 1882, 1794, 1572,  331,/#1066#/346,  313,  190, 1771,  902, 1447,  977,
                                   1821,  510, 1652, 1096, 1110,  314,   82, 1493, 1476, 1190, 1164,  798,  736,   37, 1323,  311, 1838,   13,  564,  569,
                                   1818,  754,   28,  345,  132,   25, 1168,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,  330,
                                    545, 1910,  696,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  890,  859,  394, 1668,  873,  322,  252, 1795,
                                     71, 1841,  436, 1030, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933, 1881, 1177, 1238,   38, 1822, 1292, 1820, 1157,
                                     67, 1787,  878,  734,  823,  172, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,  777 ],
                                 [ undefined, // S13, ZAT 37 - 39
                                    930, 1802, 1461,  728,  980, 1755, 1810,  170, 1526,  660,   68,  495, 1430,  783,   51,   39, 1197, 1352,  920,  705,
                                   1528,  483,  778, 1662,  667, 1935, 1204,  182,  121,  881, 1848,  382, 1843, 1659,  160, 1226, 1527, 1866, 1923,  477,
                                    133, 1076,  674, 1552,  693, 1568, 1222,  559, 1237,  963, 1069,  300,  275,  169,  327,  602,  224, 1825, 1420,  441,
                                   1858,  902, 1813,  563,  597,  779,  198,  616, 1882, 1794, 1572,  331,  346,  313,  190, 1771,  157, 1447,  977, 1821,
                                    510, 1652, 1096, 1110,  314,   82, 1493, 1476, 1190, 1164,  798,  736,   37, 1323,  311, 1838,   13,  564,  569, 1818,
                                    754,   28,  345,  132,   25, 1168,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,  330,  545,
                                   1910,  696,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  890,  859,  394, 1668,  873,  322,  252, 1795,   71,
                                   1841,  436, 1030, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933, 1881, 1177, 1238,  777, 1822, 1292, 1820, 1157,   67,
                                   1787,  878,  734,  823,  172, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38 ],
                                 [ undefined, // S13, ZAT 40
                                    930, 1802, 1461,  728,  980, 1755, 1810,  170, 1526,  660,   68,  495, 1430,  783,   51,   39, 1197, 1352,  920,  705,
                                   1528,  483, 1659, 1662,  667, 1935, 1843,  182,  121,  881, 1848,  382, 1204,  778,  160, 1226, 1527, 1866, 1923,  477,
                                    133, 1076,  674, 1552,  693, 1568, 1222,  559, 1237,  963, 1069,  300,  275,  902,  327,  602,  224, 1825, 1420,  441,
                                   1858,  169, 1813,  563,  597,  779,  198,  616, 1882, 1794, 1572,  331,  346,  190,  313, 1771,  157, 1447,  311, 1821,
                                    510, 1652, 1096, 1110,  314,   82, 1493, 1476, 1190, 1164,  798,  736,   37, 1323,  977, 1838,   13,  564,  569, 1818,
                                    754,   28,  345,  132,   25,  873,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,  330,  545,
                                   1910,  696,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  890,  859,  394, 1668, 1168,  322,  252, 1795,   71,
                                   1841,  436, 1030, 1086, 1758,  352, 1209,  595, 1018, 1186, 1933, 1881, 1177, 1238,  777, 1822, 1292, 1820, 1157,   67,
                                   1787,  878,  734,  823,  172, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1926 ],
                                 [ undefined, // S13, ZAT 41
                                    930,  980, 1461,  728, 1802,  660, 1810, 1430,   68, 1755, 1526, 1197,  170,  783,   51,   39,  495,  182,  920,  705,
                                   1528, 1848, 1659, 1662,  121, 1935, 1843, 1352,  667,  881,  483,  382, 1204,  778,  160, 1226, 1527, 1866, 1923,  477,
                                    133, 1076,  327, 1552,  693, 1568, 1222,  559, 1237,  963, 1069,  300,  275,  902,  674,  224,  602, 1858, 1420,  441,
                                   1825,  169, 1813,  563,  597,  779,  198,  616, 1882, 1794, 1572,  331,  346,  190,  313, 1771,  157, 1447,  311, 1821,
                                    510, 1652, 1096, 1110,  314,   82, 1493, 1476, 1190, 1164,  798,  736,   37, 1323,  977, 1838,   13,  564,  569, 1818,
                                    754,   28,  345,  132,   25,  873,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,  330,  545,
                                   1910,  696,   86, 1724,  761, 1275,  689,  242, 1596,  188,  107,  890,  859,  394, 1668, 1168,  322,  777, 1795,   71,
                                   1841,  436, 1030, 1086, 1758,  352, 1209,  595, 1018, 1933, 1186, 1881, 1177, 1238,  252, 1822, 1292, 1820, 1157,   67,
                                   1787,  878,  734,  823,  172, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1926 ],
                                 [ undefined, // S13, ZAT 42
                                    930,  980, 1461,  728, 1802,  660, 1810, 1430,   68, 1755, 1526, 1197,  170,  783,  495,   39,   51,  182,  920,  705,
                                   1528, 1848, 1659, 1662,  121, 1935, 1843, 1352,  667,  483,  881,  382, 1204,  133,  160, 1226, 1527, 1866, 1923,  477,
                                    778, 1076,  327,  902,  693, 1568, 1222,  559, 1237,  963, 1069,  300,  275, 1552,  674,  224,  602, 1858, 1420,  441,
                                   1825,  169, 1813,  563,  597,  779,  198,  616, 1882, 1794, 1572,  331,  346,  190,  313, 1771,  157, 1447,  311, 1821,
                                    510, 1652, 1096,   82,  314, 1110, 1493, 1476, 1190, 1164,  798,  873,   37, 1323,  977, 1838,   13,  564,  569, 1818,
                                    754,   28,  345,  132,   25,  736,   75,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,  330,  545,
                                   1910,  696,  777, 1724,  761, 1275,  689,  242, 1596,  188,  107,  890,  859,  394, 1668, 1168,  322,   86, 1795,   71,
                                   1841,  436, 1030, 1086, 1758,  352, 1209,  595, 1018, 1933, 1186, 1881, 1177, 1926,  252, 1822, 1292, 1820, 1157,   67,
                                   1787,  878,  734,  823,  172, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238 ],
                                 [ undefined, // S13, ZAT 43 - 45
                                    930, 1461,  980,  728, 1802,  660, 1810, 1430,   68, 1755, 1526, 1197,  170,  783,  495, 1935,   51,  182,  920,  705,
                                   1528, 1848, 1659, 1662,  121,   39, 1843, 1352,  667,  483,  881,  382, 1204,  133,  160, 1226, 1527, 1866, 1923,  477,
                                    778, 1076,  327,  902,  693, 1568, 1222,  559, 1237,  963, 1069,  300,  275, 1552,  674, 1882,  157, 1794, 1420,  441,
                                   1825,  169, 1813,  563,  597,  779,  311,  616,  224, 1858, 1572,  331,  346,  190,  313, 1771,  602, 1447,  198, 1821,
                                    510, 1652, 1096,   82,  314, 1110, 1493, 1476, 1190, 1164,  798,  873,   37, 1323,  977, 1838,   13,  564,  569, 1818,
                                    754,   28,  345,  132,   25,  736,  696,   21,  763,  741, 1548,  137,  692, 1797, 1152,  836,  386, 1261,  330,  545,
                                   1910,   75,  777, 1724,  761, 1275,  689,  242, 1596,  188,  890,  107,  859,  394, 1668, 1168,  322,   86, 1795,   71,
                                   1841,  436, 1030, 1086, 1758,  352, 1209,  595, 1018, 1933, 1186, 1881, 1177, 1926,  252, 1822, 1292, 1820, 1157,   67,
                                   1787,  878,  734,  823,  172, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238 ],
                                 [ undefined, // S13, ZAT 46
                                    930, 1461,  980,  728, 1802,  660, 1810, 1430,   68, 1755, 1526, 1197,  170,  783,  495, 1935, 1659,  182,  920,  705,
                                   1528, 1848,   51, 1662,  121,   39, 1843, 1352,  667,  483,  881,  382, 1204,  133,  160, 1226, 1527, 1866, 1923,  477,
                                    963, 1076,  327,  902,  693, 1568, 1222,  563, 1237,  778, 1069,  300,  275,  169,  674, 1882,  157, 1794, 1420,  224,
                                   1825, 1552, 1813,  559,  597,  190,  311,  616,  441, 1858, 1572,  331,  346,  779,  313, 1771,  602, 1447,  198, 1821,
                                    510, 1652,   37,   82,  314, 1110, 1493, 1476, 1190, 1164,  798,  873, 1096,  696,  977, 1838,   13,  564,  569, 1818,
                                    754,   28,  345,  132,   25,  736, 1323,  777,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1261,  330,  545,
                                   1910,   75,   21,  692,  761, 1275,  689,  242, 1596,  890,/#188#/ 107,  859,  394, 1668, 1168,  322,   86, 1795,   71,
                                   1841,  436, 1030, 1086, 1758,  352, 1209,  595,1933,/#1018#/1186, 1881, 1177, 1926,  252, 1822, 1292, 1820, 1157,   67,
                                   1787,  878,  734,  823,  172, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238 ],
                                 [ undefined, // S13, ZAT 47
                                    930, 1461,  980,  728, 1802,  660, 1810, 1430, 1197, 1755,  182,   68,  170,  920,  705, 1935, 1659, 1526,  783,  495,
                                   1528, 1848,   51, 1662,  121,   39, 1843, 1352,  477, 1527,  881,  382, 1204,  693,  327, 1226,  483, 1568, 1923,  667,
                                    963, 1076,  160,  902,  133, 1866,  157,  563, 1237,  778, 1069,  300,  275,  169,  674, 1882, 1222, 1794, 1420,  224,
                                   1825, 1552, 1813,  559,  597,  190,  311,  616,  441, 1858, 1572,  331,  602,  779,  313, 1771,  346, 1447,  198, 1821,
                                    510, 1652,   37,   82,  314, 1110, 1493, 1476, 1190, 1164,  798,  873, 1096,  696,  977, 1838,   13,  564,  569, 1818,
                                    754,   28,  345,  132,   25,  736, 1323,  777,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1261,  330,  545,
                                   1910,   75,   21,  692,  761, 1275,  689,  242, 1596,  890,  107,  859,  394, 1668, 1168,  322,   86, 1926,   71, 1841,
                                    436, 1030, 1086, 1758,  352, 1209,  595, 1933, 1186, 1881, 1177, 1795,  252, 1822, 1292, 1820, 1157,   67, 1787,  878,
                                    734,  823,  172, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,  775 ],
                                 [ undefined, // S13, ZAT 48
                                    930, 1461,  980,  728, 1802,  660, 1810, 1430, 1197, 1755,  495,   68,  170,  920,  705, 1935, 1659, 1526,  783,  182,
                                   1528, 1848,   51, 1662,  121,   39, 1843, 1352,  477, 1527,  881,  382,  483,  693,  327, 1226, 1204, 1568, 1923,  667,
                                    963, 1076,  160,  902,  133, 1866,  157,  563, 1237, 1882, 1069,  300,  275,  169,  674,  778, 1222,  190, 1420,  224,
                                   1825, 1552, 1813,  559,  597, 1794,  311,  616,  441, 1858, 1572,  331,  602,  779,  313, 1771,  346, 1447,  198, 1821,
                                    754, 1652,   37,   82,  314, 1110, 1493, 1476, 1190, 1164,  798,  873,  777,  696,  977, 1838,   13,  564,  569, 1818,
                                    510,   28,  345,  132,   25,  736, 1323, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1261,  330,  545,
                                   1910,   75,   21,  692,  761, 1275,  689,  242, 1596,  890,  107,  859,  394, 1668, 1168,  322,   86, 1926,   71, 1841,
                                    436, 1030, 1086, 1758,  352, 1209,  595, 1933, 1186, 1881, 1177, 1795,  252, 1822, 1292, 1820, 1157,   67, 1787,  878,
                                    734,  823,  172, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,  775 ],
                                 [ undefined, // S13, ZAT 49 - 51
                                    930, 1461,  728,  980, 1810,  660, 1802, 1430, 1197, 1755,  495, 1526,  783,  920,  705, 1848,   39,   68,  170,  182,
                                   1528, 1935,   51, 1662,  121, 1659, 1843, 1352,  477, 1527,  881,  382,  483,  693,  327,  667, 1204, 1568, 1923, 1226,
                                    963,  275,  160,  902,  133, 1866,  157,  563, 1237, 1882, 1069,  300, 1076,  169,  674,  778,  441,  190, 1420,  224,
                                   1825, 1552, 1813,  559,  616, 1794,  311,  597, 1222, 1858, 1572,  331,  602,  779,  313, 1771,  346, 1447,  873,   28,
                                    754,   13,   37,   82,  314, 1110, 1493, 1476, 1190, 1164,  798,  198,  777,  696,  977, 1838, 1652,  564,  569, 1818,
                                    510, 1821,  345,  132,   25,  736, 1323, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1261,  330,  545,
                                   1910,   75,   21,  692,  761, 1275,  689,  242, 1596,  890,  107,  859,  394, 1668, 1168,  322,   86, 1926,   71, 1841,
                                    436, 1030, 1086, 1758,  352, 1209,  595, 1933, 1186, 1881, 1177, 1795,  252, 1822, 1292, 1820, 1157,   67, 1787,  878,
                                    734,  823,  775, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,  172 ],
                                 [ undefined, // S13, ZAT 52
                                    930, 1461,  728,  980, 1810,  660, 1802, 1430, 1197, 1755,  495, 1526,  783,  920,  705, 1848,   39,   68,  170,  182,
                                   1528, 1935,  477, 1662,  121, 1659, 1843, 1352,   51, 1527,  881,  382,  483,  693,  327,  667,  563, 1568, 1923, 1226,
                                    963,  275,  160,  902, 1069, 1866,  157, 1204, 1237, 1882,  133,  300, 1076,  169,  674,  597,  441,  190, 1420,  224,
                                   1825,  331, 1813,  559,  616, 1794,  311,  778, 1222, 1858, 1572, 1552,  602,  779,  313, 1771,  346, 1447,  873,   28,
                                    198,   13,   37,   82,  314, 1110, 1493, 1476, 1190, 1164,  798,  754,  777,  696,  977, 1838, 1652,  564,  569, 1818,
                                    510, 1821,  345,  132,   25,  736, 1323, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1261,  330,  545,
                                   1910,   75,   21,  692,  761, 1275,  689,  242, 1596,  890,  107,  859,  394, 1668, 1168,  322,   86, 1926,   71, 1841,
                                    436, 1030,  775, 1758,  352, 1933,  595, 1209, 1186, 1881, 1177, 1795,  252, 1822, 1292, 1820, 1157,  172, 1787,  878,
                                    734,  823, 1086, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,   67 ],
                                 [ undefined, // S13, ZAT 53
                                    930,  980,  728, 1461, 1810,  660, 1802, 1430, 1197, 1755,   68,  705,  783,  920, 1526, 1848,   39,  495,  170,  182,
                                   1528, 1935,  477, 1662,  121, 1659,  693, 1352,   51, 1527,  881,  382,  483, 1843,  327,  667,  563, 1568, 1923, 1882,
                                    169,  275, 1866,  902, 1069,  160,  157, 1204, 1237, 1226,  133,  300, 1076,  963,  674,  597,  779,  190, 1420,  224,
                                   1825,  331, 1813,  559,  616, 1794,  311,  778, 1222, 1858, 1572, 1552,  602,  441,  313, 1771,  346, 1447,  873,  696,
                                    198,   13,   37,   82,  314, 1110, 1493, 1476, 1190, 1164,  798,  754,  777,   28,  977, 1838, 1652,  564,  569, 1818,
                                    510, 1821,  345,  132,   25,  736, 1323, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1261,  330,  545,
                                   1910,   75,   21,  692,  761, 1275,  689,  242, 1926,  890,  107,  859,  394, 1668, 1168,  322,   86, 1596,   71, 1841,
                                    436, 1030,  775, 1758,  352, 1933,  595, 1209, 1186, 1881, 1177, 1795,  252, 1822, 1292, 1820, 1157,  172, 1787,  878,
                                    734,  823, 1086, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,   67 ],
                                 [ undefined, // S13, ZAT 54
                                    930,  980,  728, 1461, 1810,  660, 1802, 1430,  783, 1755,   68,  705, 1197,  920, 1526, 1848,   39,  495,  170,  182,
                                   1528, 1935,  477, 1662,  121, 1659,  693, 1352,  483, 1527,  881,  382,   51, 1843,  327,  667,  563, 1568, 1923, 1882,
                                    169,  275, 1866,  902, 1069,  160,  157, 1204, 1237, 1226,  133,  300, 1076,  963,  674,  597,  779,  190, 1420,  224,
                                   1825,  331, 1813,  559,  616, 1794,  311, 1110, 1222, 1858, 1572, 1552,  602,  441,  313, 1771,  346, 1447,  873,  696,
                                    198,   13,   37,   82,  314,  778, 1493, 1476, 1190, 1164,  798,  754,  777,   28,  977, 1838, 1652,  564,  569, 1818,
                                    510, 1821,  345,  132,   25,  736,  242, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1261,  330,  545,
                                   1910,   75,  775,  692,  761,  890,  689, 1323, 1926, 1275,  107,  859,  394, 1668, 1168,  322,  172, 1596,   71, 1841,
                                    436, 1030,   21, 1758,  352, 1933,  595, 1209, 1186, 1881, 1177, 1795,  252, 1822, 1292, 1820, 1157,   86, 1787,  878,
                                    734,  823, 1086, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,   67 ],
                                 [ undefined, // S13, ZAT 55 - 57
                                    930, 1461,  728,  980, 1810,  660, 1755, 1430,  783, 1802,   68,  705, 1197,  920, 1526, 1848,   39,  495, 1935,  182,
                                   1528,  170,  477, 1662,  121, 1659,  693, 1352,  483, 1527,  881,  382,   51,  275,  327,  667,  160, 1568, 1923, 1882,
                                    169, 1843, 1866,  902, 1069,  563, 1226, 1204, 1237,  157,  133,  300, 1076,  963,  674,  311,  779,  190, 1420,  224,
                                   1825,  331, 1813,  559,  616, 1794,  597, 1110, 1222, 1858, 1572, 1552,  602,  441,  313, 1771,  346, 1447,  873,  696,
                                    198,   13,   37,   82,  314,  778, 1493, 1476, 1190, 1164,  798,  754,  777,   28,  977, 1838, 1652,  564,  569, 1818,
                                    510, 1821,  345,  132,   25,  736,  242, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1926,  330,  545,
                                   1910,   75,  775,  692,  761,  890,  689, 1323, 1261, 1275,  107,  859,  394, 1668, 1168,  322,  172, 1596,   71, 1841,
                                    436, 1030,   21, 1758,  352, 1933,  595, 1209, 1186, 1881, 1177, 1795,  252, 1822, 1292, 1820, 1157,   86, 1787,  878,
                                    734,  823, 1086, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,   67,  259 ],
                                 [ undefined, // S13, ZAT 58
                                    930, 1461,  728,  980, 1810,  660, 1755, 1430,  783, 1802,   68,  705, 1197,  920, 1526, 1848,   39,  495, 1935,  182,
                                   1528,  170,  477, 1662,  121, 1659,  693, 1352,  483, 1527,  881,  382,  169,  275,  327,  667,  160, 1568, 1923, 1882,
                                     51, 1843, 1866,  902, 1069,  563, 1226, 1204, 1237,  157,  224,  300, 1076,  963,  674,  311,  779,  190, 1420,  133,
                                    616,  331, 1813,  559, 1825, 1794,  597, 1110, 1222, 1858, 1572, 1552,  602,  441,  313, 1771,  346, 1447,  873,  754,
                                    198,   13,   37,   82,  314,  778, 1493, 1476, 1190, 1164,  798,  696,  777,   28,  977, 1838, 1652,  564,  569, 1818,
                                    510, 1821,  345,  132,   25,  736,  242, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1926,  330,  545,
                                    172,   75,  775,  692,  890,  761,  689, 1323, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,
                                    436, 1030,   21, 1758,  352, 1933,  595, 1209, 1186, 1881, 1177, 1795,  252, 1822, 1292, 1820, 1157,   86, 1787,  878,
                                    734,  823, 1086, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,   67,  259 ],
                                 [ undefined, // S13, ZAT 59
                                    930, 1461,  728,  980, 1810,  660,  705, 1430, 1802,  783,   68, 1755, 1197,  920, 1526,  477, 1659, 1352,  170,  182,
                                   1528, 1935, 1848, 1527,  121,   39,  693,  495, 1069, 1662,  881,  382,  169,  275,  327,  667,  160, 1568, 1923, 1882,
                                     51, 1843, 1866,  902,  483,  563,  779, 1204, 1237,  190,  224,  300, 1076,  963,  674,  311, 1226,  157, 1222,  133,
                                    616,  331,  441,  559, 1825, 1794,  597, 1110, 1420, 1858, 1572, 1552,  602, 1813,  313, 1771,  346, 1447,  873,  754,
                                    198,   13,   37,   82,  314,  778, 1493, 1476, 1190, 1164,  798,  696,  777,   28,  977, 1838, 1652,  564,  569, 1818,
                                    510, 1821,  345,  132,   25,  736,  775, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1926,  330,  545,
                                    172,   75,  242,  692,  890,  761,  689, 1323, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,
                                    436, 1030,   21, 1758, 1933,  352,  595, 1209, 1186, 1881, 1177, 1795,  252, 1822, 1292, 1820, 1157,   86, 1787,  878,
                                    734,  823, 1086, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,   67,  259, 1063 ],
                                 [ undefined, // S13, ZAT 60
                                    930, 1461,  728,  980, 1810,  660,  705, 1430, 1802,  783,   68, 1755, 1197,  920, 1526,  477, 1659, 1352,  170,  182,
                                   1528, 1935, 1848, 1527,  121,   39,  693,  495, 1069, 1662,  881,  382,  169,  275,  327,  667,  160, 1568, 1923, 1882,
                                    483, 1843, 1866,  902,   51,  563,  779, 1204, 1237,  190,  224,  300, 1076,  963,  674,  311, 1226,  157, 1222,  133,
                                    616,  331,  441,  559, 1825, 1794,  597, 1110, 1420, 1858, 1572,  602, 1552, 1813,  313, 1771,  346, 1447,  873,  754,
                                    198,   13,   37,   82,  314,  778, 1493,  777, 1190, 1164,  798,  696, 1476,   28,  977, 1838, 1652,  564,  569, 1818,
                                    510, 1821,  345,  132,   25,  736,  775, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1926,  330,  545,
                                    172,   75,  242,  890,  692,  761,  689, 1323, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,
                                    436, 1030,   21, 1933, 1758,  352,  595, 1209, 1186, 1881, 1177, 1795,  252, 1822, 1292, 1820, 1157,   86, 1787,  878,
                                    734,  823, 1086, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,   67,  259, 1063 ],
                                 [ undefined, // S13, ZAT 61 - 62
                                    930, 1461,  660,  980,  783,  728,  705, 1430, 1802, 1810, 1528, 1755, 1197,  920, 1526, 1935, 1659, 1352,  170,  182,
                                     68,  477, 1848, 1527,  121,   39,  693,  495, 1069, 1662,  881,  382,  169,  275,  327,  667,  160, 1568, 1923, 1237,
                                    483, 1843, 1866,  902,   51,  563,  779, 1204, 1882,  190,  224,  300, 1076,  963,  674,  311, 1226,  157, 1110,  133,
                                    616,  331,  441,  559, 1825, 1794,  597, 1222,  873, 1858, 1572,  602, 1552, 1813,  313, 1771,  346, 1447, 1420,  696,
                                    198,   13,   37,   82,  314,  778, 1493,  777, 1190, 1164,  798,  754, 1476,   28,  977, 1838, 1652,  564,  569, 1818,
                                    510, 1821,  775,  132,   25,  736,  345, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1926,  330,  545,
                                    172,   75,  242,  890,  692,  761,  689, 1323, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,
                                    436, 1030,   21, 1933, 1758,  352,  595, 1209, 1186, 1881, 1177, 1795,  252, 1822,  259, 1820, 1157,   86, 1787,  878,
                                    734,  823, 1086, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,   67, 1292, 1063 ],
                                 [ undefined, // S13, ZAT 63
                                    930, 1461,  660,  980,  783,  728,  705, 1430, 1802, 1810, 1528, 1755, 1197,  920, 1526, 1935, 1659, 1352,  170,  182,
                                     68,/#477#/1848, 1527,  121,   39,  693,  495, 1069, 1662,  881,  382,  169,  275,  327,  667,  160, 1568, 1923, 1237,
                                    483, 1843, 1866,  902,   51,  563,  779, 1204, 1882,  190,  224,  300, 1076,  963,  674,  311, 1226,  157, 1110,  133,
                                    616,  331,  441,  559, 1825, 1794,  597, 1222,  873, 1858, 1572,  602, 1552, 1813,  313, 1771,  346, 1447, 1420,  696,
                                    198,   13,   37,   82,  314,  778, 1493,  777, 1190, 1164,  798,  754, 1476,   28,  977, 1838, 1652,  564,  569, 1818,
                                    510, 1821,  775,  132,   25,  736,  345, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1926,  330,  545,
                                    172,   75,  242,  890,  692,  761,  689, 1323, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,
                                    436, 1030,   21, 1933, 1758,  352,  595, 1209, 1186, 1881, 1177, 1795,  252, 1822,  259, 1820, 1157,   86, 1787,  878,
                                    734,  823, 1086, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,   67, 1292, 1063 ],
                                 [ undefined, // S13, ZAT 64 - 65
                                    930, 1461,  660,  980,  783,  728,  705, 1430, 1802, 1810, 1528, 1755, 1197,  920, 1526, 1935, 1659, 1352,  170,  182,
                                     68, 1848, 1527,  121,   39,  693,  495, 1069, 1662,  881,  382,  169,  275,  327,  667,  160, 1568, 1923, 1237,  483,
                                   1843, 1866,  902,   51,  563,  779, 1204, 1882,  190,  224,  300, 1076,  963,  674,  311, 1226,  157, 1110,  133,  616,
                                    331,  441,  559, 1825, 1794,  597, 1222,  873, 1858, 1572,  602, 1552, 1813,  313, 1771,  346, 1447, 1420,  696,  198,
                                     13,   37,   82,  314,  778, 1493,  777, 1190, 1164,  798,  754, 1476,   28,  977, 1838, 1652,  564,  569, 1818,  510,
                                   1821,  775,  132,   25,  736,  345, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1926,  330,  545,  172,
                                     75,  242,  890,  692,  761,  689, 1323, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,  436,
                                   1030,   21, 1933, 1758,  352,  595, 1209, 1186, 1881, 1177, 1795,  252, 1822,  259, 1820, 1157,   86, 1787,  878,  734,
                                    823, 1086, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,   67, 1292, 1063 ],
                                 [ undefined, // S13, ZAT 66
                                    930, 1461,  660,  980,  783,  728,  705, 1430, 1802, 1810, 1528, 1755, 1659,  920, 1526, 1935, 1197, 1352,  170,  182,
                                     68, 1848, 1527,  121,   39,  693,  495, 1069, 1662,  881,  382,  169,  275,  327,  667,  160, 1568, 1923, 1237,  300,
                                   1843, 1866,  902,   51,  563,  779, 1204, 1825,  190,  224,  483, 1076,  963,  674,  311, 1226,  157,  133, 1110,  616,
                                    331,  441,  559, 1882, 1794,  597, 1222,  754, 1858, 1572,  602, 1552, 1813,  313, 1771,  346, 1447, 1420,  696,  198,
                                     13,   37,   82,  314,  778, 1493,  777, 1190, 1164,  798,  873, 1476,   28,  977, 1838, 1652,  564,  569, 1818,  510,
                                   1821,  775,  132,   25,  736,  345, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1926,  330,  545,  172,
                                     75,  242,  890,  692,  761,  689, 1323, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,  436,
                                   1030, 1933,   21, 1758,  352,  595, 1209, 1186, 1881, 1177, 1795,  252, 1822,  259, 1820, 1157,   86, 1787,  878,  734,
                                    823, 1086, 1359, 1006,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,   67, 1292, 1063, 1891 ],
                                 [ undefined, // S13, ZAT 67
                                    660, 1461,  930,  980, 1802,  728,  705, 1755,  783,  920, 1352, 1430, 1659, 1810, 1526, 1935, 1197, 1528,  170,  182,
                                     68, 1848, 1527,  121,   39,  693, 1069,  495, 1866,  881,  382,  169,  275,  327,  667,  779, 1568,  190, 1237,  300,
                                   1843, 1662,  902,   51,  224,  160, 1204, 1825, 1923,  563,  483, 1076,  963,  674,  311, 1226,  157,  133, 1110,  616,
                                    331,  441,  559, 1882, 1794,  597, 1222,  754, 1858, 1572,  602, 1552, 1813,  313, 1771,  346, 1447, 1420,  696,  775,
                                     28,   37,   82,  314,/#778#/1493,  777, 1190, 1164,  798,  873, 1476,   13,  977, 1838, 1926,  564,  569, 1818,  510,
                                   1821,  198,  132,   25,  736,  345, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1652,  330,  545,  172,
                                     75,  242,  890,  692,  761,  689, 1323, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,  436,
                                   1030, 1933,   21, 1758,  352,  595, 1209,  259, 1881, 1177, 1795,  252, 1822, 1186, 1820, 1157,   86, 1787,  878,  734,
                                    823, 1086, 1359, 1063,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,   67, 1292, 1006, 1891 ],
                                 [ undefined, // S13, ZAT 68
                                    660, 1461,  930,  980, 1802,  728,  705, 1755,  783,  920, 1352, 1430, 1659, 1810, 1526, 1935, 1197, 1528,  170,  182,
                                     68, 1848, 1527,  121,   39,  693, 1069,  495, 1866,  881,  382,  169,  275,  327,  667,  779, 1568,  190, 1237,  300,
                                   1843, 1662,  902,   51,  224,  160, 1204, 1825, 1923,  563,  483, 1076,  963,  674,  311, 1226,  157,  133, 1110,  616,
                                    331,  441,  559, 1882, 1794,  597, 1222,  754, 1858, 1572,  602, 1552, 1813,  313, 1771,  346, 1447, 1420,  696,/#775#/
                                     28,   37,   82,  314, 1493,  777, 1190, 1164,  798,  873, 1476,   13,  977, 1838, 1926,  564,  569, 1818,  510, 1821,
                                    198,  132,   25,  736,  345, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1652,  330,  545,  172,   75,
                                    242,  890,  692,  761,  689, 1323, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,  436, 1030,
                                   1933,   21, 1758,  352,  595, 1209,  259, 1881, 1177, 1795,  252, 1822, 1186, 1820, 1157,   86, 1787,  878,  734,  823,
                                   1086, 1359, 1063,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,   67, 1292, 1006, 1891 ],
                                 [ undefined, // S13, ZAT 69
                                    660, 1461,  930,  980, 1802,  728,  705, 1755,  783,  920, 1352, 1430, 1659, 1810, 1526, 1935, 1197, 1528,  170,  182,
                                     68, 1848, 1527,  121,   39,  693, 1069,  495, 1866,  881,  382,  169,  275,  327,  667,  779, 1568,  190, 1237,  300,
                                   1843, 1662,  902,   51,  224,  160, 1204, 1825, 1923,  563,  483, 1076,  963,  674,  311, 1226,  157,  133, 1110,  616,
                                    331,  441,  559, 1882, 1794,  597, 1222,  754, 1858, 1572,  602, 1552, 1813,  313, 1771,  346, 1447, 1420,  696,   28,
                                     37,   82,  314, 1493,  777, 1190, 1164,  798,  873, 1476,   13,  977, 1838, 1926,  564,  569, 1818,  510, 1821,  198,
                                    132,   25,  736,  345, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1652,  330,  545,  172,   75,  242,
                                    890,  692,  761,  689, 1323, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,  436, 1030, 1933,
                                     21, 1758,  352,  595, 1209,  259, 1881, 1177, 1795,  252, 1822, 1186, 1820, 1157,   86, 1787,  878,  734,  823, 1086,
                                   1359, 1063,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,   67, 1292, 1006, 1891 ],
                                 [ undefined, // S13, ZAT 70
                                    660, 1461,  930,  980, 1802,  728,  705, 1755,/#783#/ 920, 1352, 1430, 1659, 1810, 1526, 1935, 1197, 1528,  170,  182,
                                    693,  667, 1527,  121,   39,   68, 1069,  495, 1866,  881,  382,  169,  275,  327, 1848,  779, 1568,  190, 1204,  300,
                                    483, 1662,  902,   51,  224,  160, 1237, 1110, 1923,  563, 1843, 1076,  963,  674,  616,  313, 1552, 1222, 1825,  311,
                                    331,  441,  559, 1882, 1794,  597,  133,  754,  777, 1572,  602,  157, 1813, 1226,   82,  346, 1447, 1420,  696,   28,
                                     37, 1771,  314, 1493, 1858, 1190, 1164, 1821,  873, 1476,  172,  977, 1838, 1926,  564,  569, 1818,  510,  798,  198,
                                    132,   25,  736,  345, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1652,  330,  545,   13,  890,  259,
                                     75,  692,  761,  689, 1323, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,  436, 1030, 1933,
                                     21, 1758,  352,  595, 1209,  242, 1881, 1177, 1795,  252, 1822, 1186, 1820, 1157,   86, 1787,  878,  734,  823, 1086,
                                   1359, 1063,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,   67, 1292, 1006, 1891 ],
                                 [ undefined, // S13, ZAT 71
                                    930, 1461,  660,  980, 1802,  728,  705, 1755,  920, 1352, 1430, 1935, 1810, 1528, 1659, 1197, 1526,  170,  182,  693,
                                    667, 1527,  121,   39,   68, 1069,  495, 1866,  881,  382,  169,  275,  327, 1848, 1662, 1568,  190, 1204,  300,  483,
                                    779,  902,   51,  224,  160, 1237, 1110, 1923,  563, 1843, 1076,  963,  674,  616,  313, 1552, 1222, 1825,  311,  331,
                                    441,  559, 1882, 1794,  597,  133,  754,  777, 1572,  602,  157, 1813, 1226,   82,  346, 1447, 1420,  696,   28,   37,
                                   1771,  314, 1493, 1858, 1190, 1164, 1821,  873,  198,  172,  977, 1838, 1926,  564,  569, 1818,  510,  798, 1476,  132,
                                     25,  736,  345, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1652,  330,  545,   13,  890,  259,   75,
                                    692,  761,  689, 1323, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,  436, 1030, 1933,   21,
                                   1758,  352,  595, 1209,  242, 1881, 1177, 1795,  252, 1822, 1891, 1820, 1157,   86, 1787,  878,  734,  823, 1086, 1359,
                                   1063,  699,   41,  654, 1929,  820,  214,  582,   38, 1238,   67, 1292, 1006, 1186 ],
                                 [ undefined, // S13, ZAT 72
                                    930, 1461,  660,  980, 1802,  728,  705, 1755,  920, 1352, 1430, 1935, 1810, 1528, 1659, 1197, 1526,  170,  182,  693,
                                    667, 1527,  121,   39,   68, 1069,  495, 1866,  881,  382,  169,  275,  327, 1848, 1662, 1568,  190, 1204,  300,  483,
                                    779,  902,   51,  224,  160,/#237#/1110, 1923,  563, 1843, 1076,  963,  674,  616,  313, 1552, 1222, 1825,  311,  331,
                                    441,  559, 1882, 1794,  597,  133,  754,  777, 1572,  602,  157, 1813, 1226,   82,  346, 1447, 1420,  696,   28,   37,
                                   1771,  314, 1493, 1858, 1190, 1164, 1821,  873,  198,  172,  977, 1838, 1926,  564,  569, 1818,  510,  798, 1476,  132,
                                     25,  736,  345, 1096,  763,  741, 1548,  137, 1724, 1797, 1152,  836,  386, 1652,  330,  545,   13,  890,  259, /#75#/
                                    692,  761,  689, 1323, 1261, 1275,  107,  859,  394, 1668, 1168,  322, 1910, 1596,   71, 1841,  436, 1030, 1933,   21,
                                   1758,  352,  595, 1209,  242, 1881, 1177, 1795,  252, 1822, 1891, 1820, 1157,   86, 1787,  878,  734,  823, 1086, 1359,
                                 /#1063#/ 699,   41,/#654#/1929,  820,  214,  582,   38, 1238,   67, 1292, 1006, 1186, 1413 ],
                              */
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : replaceArrayFun(padStartFun(4)),
                   'Space'     : 0,
                   'Label'     : "Alte Platz-IDs:"
               },
    'challIds' : {        // Datenspeicher fuer Team-IDs der Teams, die herausgefordert wurden
                   'Name'      : "challIds",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : false,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 20,
                   'Rows'      : 1,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Forderungen-IDs:"
               },
    'teamRanks' : {       // Datenspeicher fuer aktuelle Raenge der Teams nach Team-ID in der Rangliste
                   'Name'      : "teamRanks",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : { },
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Pl\u00E4tze:"
               },
    'teamIds' : {         // Datenspeicher fuer aktuelle Team-IDs der Teams nach Namen
                   'Name'      : "teamIds",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : { },
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Team-IDs:"
               },
    'teamNames' : {       // Datenspeicher fuer die Namen der Teams nach Team-ID
                   'Name'      : "teamNames",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : { },
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Teams:"
               },
    'gegner' : {          // Datenspeicher fuer zugeloste Gegner
                   'Name'      : "gegner",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : { },
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "FSS-Gegner:"
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

// ==================== Ende Konfigurations-Abschnitt fuer Optionen ====================

// ==================== Spezialisierter Abschnitt fuer Optionen ====================

// Logging initialisieren mit Loglevel (siehe ganz oben im Konfigurationsabschnitt)...
__LOG.init(window, __LOGLEVEL);

// Teamparameter fuer getrennte Speicherung der Optionen fuer Erst- und Zweitteam...
const __TEAMCLASS = new TeamClassification();

// Optionen mit Daten, die ZAT- und Team-bezogen gemerkt werden...
__TEAMCLASS.optSelect = {
        'datenZat'     : true,
        'oldDatenZat'  : true,
        'rankIds'      : true,
        'oldRankIds'   : true,
        'challIds'     : true,
        'teamRanks'    : true,
        'teamIds'      : true,
        'teamNames'    : true,
        'gegner'       : true
    };

// ==================== Ende Abschnitt fuer Optionen ====================

// ==================== Abschnitt fuer sonstige Parameter ====================

// Ermittelt die Platzierungen der Rangliste aus der HTML-Tabelle und speichert diese
// table: Tabelle mit der Rangliste
// optSet: Platz fuer die gesetzten Optionen
function calcRanksFromTable(table, optSet) {
    const __RANKBOXES = getElements('SPAN.fsst_team', table);
    const __RANKIDS = [];
    const __TEAMIDS = { };
    const __TEAMNAMES = { };

    for (let team of __RANKBOXES) {
        const __TEXT = team.textContent;
        const __TEAMLINK = getElement('A', 0, team);
        const __TEAMNAME = __TEAMLINK.textContent;
        const __HREF = __TEAMLINK.href;
        const __RANKMATCH = /^\d+\./.exec(__TEXT);
        const __RANK = parseInt(__RANKMATCH[0], 10);
        const __TEAMIDMATCH = /\d+$/.exec(__HREF);
        const __TEAMID = parseInt(__TEAMIDMATCH[0], 10);

        __RANKIDS[__RANK] = __TEAMID;

        __TEAMIDS[__TEAMNAME] = __TEAMID;
        __TEAMNAMES[__TEAMID] = __TEAMNAME;
    }

    const __TEAMRANKS = reverseMapping(__RANKIDS, Number);

    // Neuen Rangliste speichern...
    optSet.setOpt('rankIds', __RANKIDS, false);
    optSet.setOpt('teamRanks', __TEAMRANKS, false);
    optSet.setOpt('teamIds', __TEAMIDS, false);
    optSet.setOpt('teamNames', __TEAMNAMES, false);
}

// Ermittelt die IDs der herausgeforderten Teams aus der HTML-Tabelle und speichert diese
// page: Enthaelt Liste mit den Herausforderungen
// optSet: Platz fuer die gesetzten Optionen
function calcChallengesFromHTML(page, optSet) {
    const __OLISTS = getTags('OL', page);

    if (__OLISTS && (__OLISTS.length === 3)) {
        const __CHALLENGES = __OLISTS[0];
        const __CHALLBOXES = getTags('SPAN', __CHALLENGES);
        const __CHALLIDS = [];

        for (let team of __CHALLBOXES) {
            const __TEAMLINK = getElement('A', 0, team);
            const __HREF = __TEAMLINK.href;
            const __TEAMIDMATCH = /\d+$/.exec(__HREF);
            const __TEAMID = parseInt(__TEAMIDMATCH[0], 10);

            __CHALLIDS.push(__TEAMID);
        }

        __LOG[7](__CHALLIDS);

        if (__CHALLIDS.length) {
            // Neuen Forderungsliste speichern...
            optSet.setOpt('challIds', __CHALLIDS, false);
        }
    }
}

// Ermittelt die Gegner aus der HTML-Tabelle und speichert diese
// games: Liste der ausgelosten Spiele
// optSet: Platz fuer die gesetzten Optionen
function calcGegner(games, optSet) {
    const __GEGNER = { };

    for (let game of games) {
        const __TEAMLINKS = getTags('A', game);
        const __HEIMIDMATCH = /\d+$/.exec(__TEAMLINKS[0].href);
        const __GASTIDMATCH = /\d+$/.exec(__TEAMLINKS[1].href);
        const __HEIMID = parseInt(__HEIMIDMATCH[0], 10);
        const __GASTID = parseInt(__GASTIDMATCH[0], 10);

        __GEGNER[__HEIMID] = __GASTID;
        __GEGNER[__GASTID] = __HEIMID;
    }

    // Neuen Rangliste speichern...
    optSet.setOpt('gegner', __GEGNER, false);
}

// Hilfsfunktion: Formatiert eine Box im Ranking
// box: "span"-Bereich eines Teams in der Rangliste des offiziellen FSS-Turniers
// color: falls angegeben, gewuenschte Schriftfarbe
// bgColor: falls angegeben, gewuenschte Hintergrundfarbe
// substRank: Ersatztext fuer die Platzierungsangabe, "$1." ist der Originaltext
function formatRankBox(box, color, bgColor, substRank) {
    if (substRank) {
        const __HTML = box.innerHTML;

        box.innerHTML = __HTML.replace(/<b>(\d+)\.<\/b>/, "<B>" + substRank + "<\/B>");
    }
    if (bgColor) {
        box.style.backgroundColor = bgColor;
    }
    if (color) {
        box.style.color = color;
    }
}

// Markiert alle Aenderungen am Ranking
// table: Tabelle mit der Rangliste
// optSet: Gesetzte Optionen
function markChanges(table, optSet) {
    const __RANKBOXES = getTags('SPAN', table);
    const __RANKIDS = optSet.getOptValue('rankIds');
    const __OLDRANKIDS = optSet.getOptValue('oldRankIds');
    const __TEAMRANKS = optSet.getOptValue('teamRanks');
    const __OLDTEAMRANKS = reverseMapping(__OLDRANKIDS, Number);
    const __GEGNER = optSet.getOptValue('gegner');

    for (let team of __RANKBOXES) {
        const __TEXT = team.textContent;
        const __RANKMATCH = /^\d+\./.exec(__TEXT);
        const __RANK = parseInt(__RANKMATCH[0], 10);
        const __RANKID = __RANKIDS[__RANK];
        const __OLDRANKID = __OLDRANKIDS[__RANK];

        if (__OLDRANKID === undefined) {  // neuer Rang (Neuanmeldung)
            const __CORANK = __OLDTEAMRANKS[__RANKID];

            if (__CORANK) {  // Neuanmeldung war bereits platziert
                formatRankBox(team, undefined, 'brown', getOrdinal("$1") + " (" + getOrdinal(__CORANK) + ')');
            } else {  // normale Neuanmeldung
                formatRankBox(team, undefined, 'black');
            }
        } else if (__OLDRANKID !== __RANKID) {  // Platzwechsel
            const __CORANK = __TEAMRANKS[__OLDRANKID];
            const __COLOR = ((__CORANK < __RANK) ? 'red' : 'cyan');

            formatRankBox(team, __COLOR, undefined, getOrdinal("$1") + " (" + getOrdinal(__CORANK) + ')');
        } else if (__GEGNER[__RANKID]) {  // FSS angesetzt
            const __GEGNERID = __GEGNER[__RANKID];
            const __CORANK = __TEAMRANKS[__GEGNERID];
            const __ARROW = ((__CORANK < __RANK) ? "&lt;" : "&gt;");

            formatRankBox(team, 'magenta', undefined, "$1. " + __ARROW + ' ' + getOrdinal(__CORANK));
        } else {
            // Kein FSS beim Turnier...
            formatRankBox(team);
        }
    }
}

// Markiert bestimmte Teams in der Rangliste (eigenes Team, Gegner)
// table: Tabelle mit der Rangliste
// optSet: Gesetzte Optionen
// teamName: Name des eigenen Teams
// teamName: Name des gegnerischen Teams
function markTeam(table, optSet, teamName, gegnerName) {
    const __RANKBOXES = getTags('SPAN', table);
    const __RANKIDS = optSet.getOptValue('rankIds');
    const __CHALLIDS = optSet.getOptValue('challIds');

    for (let team of __RANKBOXES) {
        const __TEAMLINK = getElement('A', 0, team);
        const __NAME = __TEAMLINK.textContent;

        if (__NAME === teamName) {
            formatRankBox(team, undefined, 'blue');
        } else if (__NAME === gegnerName) {
            formatRankBox(team, undefined, 'darkred');
        } else {
            const __TEXT = team.textContent;
            const __RANKMATCH = /^\d+\./.exec(__TEXT);
            const __RANK = parseInt(__RANKMATCH[0], 10);
            const __RANKID = __RANKIDS[__RANK];

            //if (__CHALLIDS.some(x => (x === __RANKID))) {
            for (let challId of __CHALLIDS) {
                if (challId == __RANKID) {  // schwacher Vergleich
                    formatRankBox(team, undefined, 'grey');
                }
            }
        }
    }
}

// ==================== Ende Abschnitt fuer sonstige Parameter ====================

// ==================== Erzeugung von Testdaten ====================

function testItemAppend(node, platz, id, name) {
    const __LI = document.createElement('LI');
    const __SPAN = document.createElement('SPAN');
    const __B = document.createElement('B');
    const __BR1 = document.createElement('BR');
    const __BR2 = document.createElement('BR');
    const __A1 = document.createElement('A');
    const __A2 = document.createElement('A');

    __B.append(platz + '.');

    //__A1.onclick
    __A1.href = "https://os.ongapo.com/st.php?c=" + id;
    __A1.append(name);

    __A2.className = "MINUS";
    __A2.href = "https://os.ongapo.com/fssturnier.php?cancelforderung=" + id + "#d";
    __A2.append("Forderung zur\u00FCcknehmen");

    __SPAN.className = "fsst_team";
    __SPAN.append(__B, __BR1, __A1, __BR2, __A2);

    __LI.append(__SPAN);

    node.append(__LI);
}

function testInsertBefore1(node, before) {
    const __OL = document.createElement('OL');

    testItemAppend(__OL, 56, 404, "Drovno Siroki Brijeg");
    testItemAppend(__OL, 58, 1933, "Dynamo Astrakhan");
    testItemAppend(__OL, 57, 1226, "Blo-W\u00E4iss Lintgen");

    node.insertBefore(__OL, before);
}

function testInsertBefore2(node, before) {
    const __OL = document.createElement('OL');

    testItemAppend(__OL, 79, 381, "Schleswig Kiel");
    testItemAppend(__OL, 83, 1323, "Atletico Coimbra");
    testItemAppend(__OL, 80, 1858, "FK Petropavlovsk");

    node.insertBefore(__OL, before);
}

// ==================== Ende Erzeugung von Testdaten ====================

// ==================== Page-Manager fuer zu bearbeitende Seiten ====================

// Verarbeitet Ansicht "Haupt" (Managerbuero) zur Ermittlung des aktuellen ZATs
const procHaupt = new PageManager("Haupt (Managerb\u00FCro)", __TEAMCLASS, () => {
        const __TEAMPARAMS = getTeamParamsFromTable(__TEAMSEARCHHAUPT, __TEAMIDSEARCHHAUPT);

        return {
                'teamParams' : __TEAMPARAMS,
                'hideMenu'   : true
            };
    }, async optSet => {
        //const __ZATCELL = getProp(getProp(getRows(), 2), 'cells', { })[0];
        const __ZATCELL = getElement('TD[style] B');  // #2,0: Der erste farbige Fetteintrag ('<td style="color:orange"><b>')
        const __NEXTZAT = getZATNrFromCell(__ZATCELL);  // "Der naechste ZAT ist ZAT xx und ..."
        const __CURRZAT = __NEXTZAT - 1;
        const __DATAZAT = optSet.getOptValue('datenZat');

        // Stand der alten Daten merken...
        optSet.setOpt('oldDatenZat', __DATAZAT, false);

        if (__CURRZAT >= 0) {
            __LOG[2]("Aktueller ZAT: " + __CURRZAT);

            // Neuen aktuellen ZAT speichern...
            optSet.setOpt('aktuellerZat', __CURRZAT, false);

            if (__CURRZAT !== __DATAZAT) {
                __LOG[2](__LOG.changed(__DATAZAT, __CURRZAT));

                // ... und ZAT-bezogene Daten als veraltet markieren
                await __TEAMCLASS.deleteOptions({
                                              'datenZat'    : true,
                                              'oldDatenZat' : true
                                          }).catch(defaultCatch);

                // Neuen Daten-ZAT speichern...
                optSet.setOpt('datenZat', __CURRZAT, false);
            }
        }

        return true;
    });

// Verarbeitet Ansicht "FSS-Turniere" (Register-Tab 'd' : "offizielles FSS-Turnier")
const procOSFSSTurnier = new PageManager("FSS-Turniere", __TEAMCLASS, () => {
        const __TAB4 = getElement('DIV#d');

        if ((__TAB4 === undefined) || (__TAB4 === null)) {
            __LOG[1]("Diese Seite ist ohne Team nicht verf\u00FCgbar!");
        } else {
            // Nur Test: Daten produzieren...
            //testInsertBefore1(__TAB4, getTable(0, 'OL', __TAB4));

            return {
                    'menuAnchor' : __TAB4,
                    'formWidth'  : 1
                };
        }
        // Fehler fuer alle Faelle ohne Rueckgabewert...
        return false;
    }, async optSet => {
            const __TAB4 = getElementById('d');
            const __TABLE = getElement('TABLE.fsst_table', 0, __TAB4);
            const __GAMELIST = getTable(0, 'UL', __TAB4);
            const __GAMES = getTags((__GAMELIST ? 'LI' : ''), __GAMELIST);
            const __MYTEAM = optSet.getOptValue('team');
            const __GEGNER = optSet.getOptValue('gegner');
            const __TEAMIDS = optSet.getOptValue('teamIds');
            const __TEAMNAMES = optSet.getOptValue('teamNames');

            calcRanksFromTable(__TABLE, optSet);
            calcChallengesFromHTML(__TAB4, optSet);

            markChanges(__TABLE, optSet);

            calcGegner(__GAMES, optSet);

            const __TEAMID = __TEAMIDS[__MYTEAM.Team];
            const __GEGNERID = __GEGNER[__TEAMID];
            const __GEGNERNAME = __TEAMNAMES[__GEGNERID];

            markTeam(__TABLE, optSet, __MYTEAM.Team, __GEGNERNAME);

            return true;
        });

// ==================== Ende Page-Manager fuer zu bearbeitende Seiten ====================

// ==================== Hauptprogramm ====================

// Selektor fuer den richtigen PageManager...
const __LEAFS = {
                    'haupt.php'      : 0,  // Ansicht "Haupt" (Managerbuero)
                    'fssturnier.php' : 1   // Ansicht "FSS-Turniere" (offizielles FSS-Turnier)
                };

// URL-Legende:
// page=0: Managerbuero
// page=1: offizielles FSS-Turnier
const __MAIN = new Main(__OPTCONFIG, null, procHaupt, procOSFSSTurnier);

__MAIN.run(getPageIdFromURL, __LEAFS);

// ==================== Ende Hauptprogramm ====================

// *** EOF ***

/*** Ende Benutzerskript https://eselce.github.io/GitTest/misc/OS2/OS2.fssturnier.user.js ***/

/*** Automatisch generiert: Freitag, 10. Februar 2023 ***/
