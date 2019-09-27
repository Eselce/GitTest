// ==UserScript==
// @name         mainchat.test
// @namespace    http://mainchat.net/
// @version      0.10
// @copyright    2019+
// @author       Sven Loges (SLC)
// @description  OS2 Mainchat-Test-Script for Greasemonkey 4.0
// @include      /^https?://\S+\.mainchat\.net/interaktiv.php(\S+)?$/
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.registerMenuCommand
// @grant        GM.info
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_info
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.log.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.value.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.proto.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.prop.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.mod.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.debug.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.store.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.dom.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.delim.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.path.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.uri.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.type.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.data.js
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
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.list.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.team.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.page.js
// ==/UserScript==

// ECMAScript 9:
/* jshint esversion: 9 */

// ==================== Abschnitt fuer Bugfixes ====================
// Nur einmal js hint ganz oben
// util.value, util.dom: 2x Number.isNaN() statt isNaN()
// util.value: floorValue(), padNumber(): 2x Number.isFinite() statt isFinite()
// util.value, util.mem.db, util.option.page.node, util.option.page: getValue(), initScriptDB(), getOptionCheckbox(), getOptionButton(), addForm(): Klammern
// util.value, util.proto, util.dom, util.class.URI, util.option.data: getNumberString(), reverseString(), getAllProperties(), getStyleFromElements(),
//     getSelectionFromComboBox(), convertArrayFromHTML(), URI.parseParams(), promptNextOpt(): for -> while
// util.log: __LOG.init(): überarbeitet
// util.value: : Klammern
// util.value: String.prototype.format(): \{, \} in RegExp
// util.value, util.class: Function.prototype.name(): auskommentiert
// util.value, util.debug, util.class: String.prototype.format(), showAlert(), Class.initFun(): arguments
// util.mem.mod: ScriptModule: __NEWDBMOD statt __DBMOD
// util.option.data, util.option.page.action, mainchat.test: \u00## statt \x##
// util.log, util.value, util.class.uri, util.option.data, util.option.page.node, util.option.page: serializer(), floorValue(), URI, promptNextOpt(),
//     getOptionSelect(), getForm(): Boolean-Cast für ~
// util.prop, util.mem.mod, util.dom, util.class, util.class.path, util.class.uri, -util.option.data, util.option.api, util.mem, util.mem.db,
//     util.option.menu, util.option.run: addProps(), delProps(), substParam(), addInputField(), Object.setConst(), Directory.chDir(), ObjRef.valueOf(),
//     formatParams(), -getSharedRef(), invalidateOpts(), loadOptions(), deleteOptions(), renameOptions(), getMemUsage(), initScriptDB(), buildMenu(),
//     initOptions(): Object.keys().forEach() statt for (let ... in ...)
// util.store, util.option.api, mainchat.test: storeValue(), summonValue(), deserialize(), invalidateOpt(), loadOption(), loadOptions(), deleteOption(), buildOptions(), procChat(), main(): function() {} statt => {}
// util.dom: getIntFromHTML(), getFloatFromHTML(): defaultCatch(ex) statt empty block
// util.class: Object.setConst: Keys in ''
// util.log: __LOG.init(): level += 1;
// util.class: Class: const __BASEOBJ = (__BASECLASS || { });
// util.option.data, util.mem.cmd, util.option.page.action, util.option.page.node, util.option.run: initOptValue(), getNextOpt(), runStoredCmds(),
//     getFormAction(), getOptionElement(), initOptAction(): default : break; entfernt
// util.mem: getMemUsage(): __SIZE war doppelt
// util.option.api, util.option.menu: invalidateOpts(), loadOptions(), deleteOptions(), renameOptions(), buildMenu(): Umstellung auf map() bzw, reduce()
// util.class: Leerzeile vor // ==================== Abschnitt fuer Klasse Class ====================
// BUGGY?
// Überprüfen: const __BASEINIT = __BASEOBJ.init; / this.init = initFun; -> ggfs. __init! / was ist mit this.name?
// 1758: Class.define(ObjRef, Directory, { 'valueOf' ...
// 2105: getSharedRef()
// 2289: promptNextOpt()
// 2453: invalidateOpts()
// 2570: deleteOptions(), renameOption()
// 2635: renameOptions(), resetOptions(), loadOptValue()
// 2847: restoreMemoryByOpt()
// 3044: runStoredCmds()
// 3124: registerMenuOption(), registerNextMenuOption(), registerDataOption()
// 3215: buildMenu()
// 3267: withTitle()
// 3405: getOptionSelect()
// 3583: groupData(), getForm()
// 3736: initOptAction()
// 3902: startOptions()
// 4161: main()
// ==================== Ende Abschnitt fuer Bugfixes ====================

// ==================== Abschnitt fuer Inline-Versionen der @requires ====================

// ==UserScript==
// _name         util.log
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Logging und safeStringify()
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// ==/UserScript==

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
                                    const __VOIDFUN = function() { return this; };
                                    let level = 0;

                                    while (level < this.logFun.length) {
                                        this[level] = ((level > logLevel) ? __VOIDFUN : this.logFun[level]);
                                        level += 1;
                                    }
                                },
                  'stringify' : safeStringify,      // JSON.stringify
                  'changed'   : function(oldVal, newVal) {
                                    const __OLDVAL = this.stringify(oldVal);
                                    const __NEWVAL = this.stringify(newVal);

                                    return ((__OLDVAL !== __NEWVAL) ? __OLDVAL + " => " : "") + __NEWVAL;
                                }
              };

__LOG.init(window, 3);  // Zunaechst mal Loglevel 3, erneutes __LOG.init(window, __LOGLEVEL) im Hauptprogramm...

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

                if (Boolean(~ __THISPOS)) {
                    __STACK.splice(__THISPOS + 1);
                    __KEYS.splice(__THISPOS, Infinity, key);
                } else {
                    __STACK.push(this);
                    __KEYS.push(key);
                }
                if (Boolean(~ __STACK.indexOf(value))) {
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

// *** EOF ***

// ==UserScript==
// _name         util.value
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Logging, Debugging, Error-Handling, usw.
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// ==/UserScript==

// ==================== Abschnitt fuer diverse Utilities fuer Werte ====================

// Gibt einen Wert zurueck. Ist dieser nicht definiert oder null, wird ein Alternativwert geliefert
// value: Ein Wert. Ist dieser nicht undefined oder null, wird er zurueckgeliefert (oder retValue)
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// retValue: Falls definiert, Rueckgabe-Wert fuer den Fall, dass value nicht undefined oder null ist
// return Der Wert. Sind weder value noch defValue definiert, dann undefined
function getValue(value, defValue = undefined, retValue = undefined) {
    return (((value === undefined) || (value === null)) ? defValue : ((retValue === undefined) ? value : retValue));
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
function getMulValue(valueA, valueB, digits = 0, defValue = NaN) {
    let product = defValue;

    if ((valueA !== undefined) && (valueB !== undefined)) {
        product = parseFloat(valueA) * parseFloat(valueB);
    }

    if (Number.isNaN(product)) {
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
        let i = 0;

        while (i < __TEMP.length) {
            if ((i > 0) && (i % 3 === 0)) {
                result += '.';
            }
            result += __TEMP.substr(i++, 1);
        }

        return reverseString(result);
    }
}

// Liefert den ganzzeiligen Anteil einer Zahl zurueck, indem alles hinter einem Punkt abgeschnitten wird
// value: Eine uebergebene Dezimalzahl
// return Der ganzzeilige Anteil dieser Zahl
function floorValue(value, dot = '.') {
    if ((value === 0) || (value && Number.isFinite(value))) {
        const __VALUE = value.toString();
        const __INDEXDOT = (__VALUE ? __VALUE.indexOf(dot) : -1);

        return Number(Boolean(~ __INDEXDOT) ? __VALUE.substring(0, __INDEXDOT) : __VALUE);
    } else {
        return value;
    }
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
    if ((value === 0) || (value && Number.isFinite(value))) {
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
    let i = string.length - 1;

    while (i >= 0) {
        result += string.substr(i--, 1);
    }

    return result;
}

// Identitaetsfunktion. Konvertiert nichts, sondern liefert einfach den Wert zurueck
// value: Der uebergebene Wert
// return Derselbe Wert
function sameValue(value) {
    return value;
}

// Hilfsfunktion fuer Array.sort(): Vergleich zweier Zahlen
// valueA: Erster Zahlenwert
// valueB: Zweiter Zahlenwert
// return -1 = kleiner, 0 = gleich, +1 = groesser
function compareNumber(valueA, valueB) {
    return +(valueA > valueB) || (+(valueA === valueB) - 1);
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

// ==UserScript==
// _name         util.proto
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Prototypes
// _require      https://eselce.github.io/OS2.scripts/lib/util.proto.js
// ==/UserScript==

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
            return (base.prototype === XML.prototype);
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
    let o = obj;

    while (o !== null) {
      ret = ret.concat(Object.getOwnPropertyNames(o));
      o = Object.getPrototypeOf(o);
    }

    return ret;
}

// ==================== Ende Abschnitt fuer diverse Utilities fuer Function-Prototypes ====================

// ==================== Abschnitt fuer diverse Funktionen, die bekannte Prototypes erweitern ====================

// Kompatibilitaetsfunktion zur Ermittlung des Namens einer Funktion (falle <Function>.name nicht vorhanden ist)
//#if (Function.prototype.name === undefined) {
//#    Object.defineProperty(Function.prototype, 'name', {
//#            get : function() {
//#                      return /function ([^(\s]*)/.exec(this.toString())[1];
//#                  }
//#        });
//#}

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
String.prototype.format = function __f() {
    const __ARGS = __f.arguments;
    return this.replace(/\{(\d+)\}/g, function(match, argIdx) {
                                        const __ARG = __ARGS[argIdx];
                                        return ((__ARG !== undefined) ? __ARG : match);
                                    });
};

// ==================== Ende Abschnitt fuer diverse Funktionen, die bekannte Prototypes erweitern ====================

// *** EOF ***

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
    Object.keys(getValue(addData, { })).forEach(function(item) {
        if (checkItem(item, addList, ignList)) {
            data[item] = addData[item];
        }
    });

    return data;
}

// Entfernt Properties in einem Objekt
// data: Objekt, deren Properties bearbeitet werden
// delList: Checkliste der zu loeschenden Items (true fuer loeschen), falls angegeben
// ignList: Checkliste der ignorierten Items (true fuer auslassen), falls angegeben
// return Das veraenderte Objekt ohne die geloeschten Properties
function delProps(data, delList = undefined, ignList = undefined) {
    Object.keys(getValue(data, { })).forEach(function(item) {
        if (checkItem(item, delList, ignList)) {
            delete data[item];
        }
    });

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
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// ==/UserScript==

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

    const __META = getValue(meta, GM.info.script);
    const __PROPS = {
                'name'        : true,
                'version'     : true,
                'namespace'   : true,
                'description' : true
            };

    const __NEWDBMOD = { };

    __LOG[5](__META);

    // Infos zu diesem Script...
    addProps(__NEWDBMOD, __META, __PROPS);

    // Voller Name fuer die Ausgabe...
    Object.defineProperty(__NEWDBMOD, 'Name', {
                    get : function() {
                              return this.name + " (" + this.version + ')';
                          },
                    set : undefined
                });

    __LOG[2](__NEWDBMOD);

    return __NEWDBMOD;
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

    Object.keys(textSubst).forEach(function(ch) {
        const __SUBST = textSubst[ch];

        ret = ret.replace('$' + ch, __SUBST);
    });

    return ret.replace('$', par1);
}

// ==================== Ende Funktionen fuer die Scriptdatenbank ====================

// *** EOF ***

// ==UserScript==
// _name         util.debug
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Debugging, Error-Handling, usw.
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// ==/UserScript==

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

    return showAlert.arguments;
}

// Gibt eine Meldung in der Console aus und oeffnet ein Bestaetigungsfenster
// mit der Meldung zu einer Exception oder einer Fehlermeldung
// label: Eine Ueberschrift
// ex: Exception oder sonstiges Fehlerobjekt
// return Liefert die showAlert()-Parameter zurueck
function showException(label, ex) {
    if (ex && ex.message) {  // Exception
        return showAlert(label, ex.message, ex);
    } else {  // sonstiger Fehler
        return showAlert(label, ex);
    }
}

// Standard-Callback-Funktion fuer onRejected, also abgefangener Fehler
// in einer Promise bei Exceptions oder Fehler bzw. Rejections
// error: Parameter von reject() im Promise-Objekt, der von Promise.catch() erhalten wurde
// return Liefert die showAlert()-Parameter zurueck
function defaultCatch(error) {
    try {
        const __LABEL = `[${error.lineNumber}] ${__DBMOD.Name}`;

        return showException(__LABEL, error);
    } catch (ex) {
        return showException(`[${ex.lineNumber}] ${__DBMOD.Name}`, ex.message, ex);
    }
}

// ==================== Ende Abschnitt fuer Debugging, Error-Handling ====================

// *** EOF ***

// ==UserScript==
// _name         util.store
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Script-Optionen im Benutzermenue
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// ==/UserScript==

// ==================== Abschnitt fuer die Sicherung und das Laden von Daten ====================

// Speichert einen String/Integer/Boolean-Wert unter einem Namen ab
// name: GM.setValue()-Name, unter dem die Daten gespeichert werden
// value: Zu speichernder String/Integer/Boolean-Wert
// return Promise auf ein Objekt, das 'name' und 'value' der Operation enthaelt
function storeValue(name, value) {
    __LOG[4](name + " >> " + value);

    return GM.setValue(name, value).then(function(voidValue) {
            __LOG[5]("OK " + name + " >> " + value);

            return Promise.resolve({
                    'name'  : name,
                    'value' : value
                });
        }, defaultCatch);
}

// Holt einen String/Integer/Boolean-Wert unter einem Namen zurueck
// name: GM.getValue()-Name, unter dem die Daten gespeichert wurden
// defValue: Default-Wert fuer den Fall, dass nichts gespeichert ist
// return Promise fuer den String/Integer/Boolean-Wert, der unter dem Namen gespeichert war
function summonValue(name, defValue = undefined) {
    return GM.getValue(name, defValue).then(function(value) {
            __LOG[4](name + " << " + value);

            return Promise.resolve(value);
        }, function(ex) {
            __LOG[0](name + ": " + ex.message);

            return Promise.reject(ex);
        }, defaultCatch);
}

// Speichert einen beliebiegen (strukturierten) Wert unter einem Namen ab
// name: GM.setValue()-Name, unter dem die Daten gespeichert werden
// value: Beliebiger (strukturierter) Wert
// return Promise auf ein Objekt, das 'name' und 'value' in der String-Darstellung des Wertes enthaelt
function serialize(name, value) {
    const __STREAM = ((value !== undefined) ? safeStringify(value) : value);

    return storeValue(name, __STREAM);
}

// Holt einen beliebiegen (strukturierter) Wert unter einem Namen zurueck
// name: GM.getValue()-Name, unter dem die Daten gespeichert wurden
// defValue: Default-Wert fuer den Fall, dass nichts gespeichert ist
// return Promise fuer das Objekt, das unter dem Namen gespeichert war
function deserialize(name, defValue = undefined) {
    return summonValue(name).then(function(stream) {
            if (stream && stream.length) {
                return JSON.parse(stream);
            } else {
                return defValue;
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

// ==================== Abschnitt fuer diverse DOM-Utilities ====================

// Legt Input-Felder in einem Form-Konstrukt an, falls noetig
// form: <form>...</form>
// props: Map von name:value-Paaren
// type: Typ der Input-Felder (Default: unsichtbare Daten)
// return Ergaenztes Form-Konstrukt
function addInputField(form, props, type = 'hidden') {
    Object.keys(props).forEach(function(fieldName) {
        let field = form[fieldName];
        if (! field) {
            field = document.createElement('input');
            field.type = type;
            field.name = fieldName;
            form.appendChild(field);
        }
        field.value = props[fieldName];
    });

    return form;
}

// Legt unsichtbare Input-Daten in einem Form-Konstrukt an, falls noetig
// form: <form>...</form>
// props: Map von name:value-Paaren
// return Ergaenztes Form-Konstrukt
function addHiddenField(form, props) {
    return addInputField(form, props, 'hidden');
}

// Hilfsfunktion fuer alle Browser: Fuegt fuer ein Event eine Reaktion ein
// obj: Betroffenes Objekt, z.B. ein Eingabeelement
// type: Name des Events, z.B. "click"
// callback: Funktion als Reaktion
// capture: Event fuer Parent zuerst (true) oder Child (false als Default)
// return false bei Misserfolg
function addEvent(obj, type, callback, capture = false) {
    if (obj.addEventListener) {
        return obj.addEventListener(type, callback, capture);
    } else if (obj.attachEvent) {
        return obj.attachEvent('on' + type, callback);
    } else {
        __LOG[0]("Could not add " + type + " event:");
        __LOG[2](callback);

        return false;
    }
}

// Hilfsfunktion fuer alle Browser: Entfernt eine Reaktion fuer ein Event
// obj: Betroffenes Objekt, z.B. ein Eingabeelement
// type: Name des Events, z.B. "click"
// callback: Funktion als Reaktion
// capture: Event fuer Parent zuerst (true) oder Child (false als Default)
// return false bei Misserfolg
function removeEvent(obj, type, callback, capture = false) {
    if (obj.removeEventListener) {
        return obj.removeEventListener(type, callback, capture);
    } else if (obj.detachEvent) {
        return obj.detachEvent('on' + type, callback);
    } else {
        __LOG[0]("Could not remove " + type + " event:");
        __LOG[2](callback);

        return false;
    }
}

// Hilfsfunktion fuer alle Browser: Fuegt fuer ein Event eine Reaktion ein
// id: ID des betroffenen Eingabeelements
// type: Name des Events, z.B. "click"
// callback: Funktion als Reaktion
// capture: Event fuer Parent zuerst (true) oder Child (false als Default)
// return false bei Misserfolg
function addDocEvent(id, type, callback, capture = false) {
    const __OBJ = document.getElementById(id);

    return addEvent(__OBJ, type, callback, capture);
}

// Hilfsfunktion fuer alle Browser: Entfernt eine Reaktion fuer ein Event
// id: ID des betroffenen Eingabeelements
// type: Name des Events, z.B. "click"
// callback: Funktion als Reaktion
// capture: Event fuer Parent zuerst (true) oder Child (false als Default)
// return false bei Misserfolg
function removeDocEvent(id, type, callback, capture = false) {
    const __OBJ = document.getElementById(id);

    return removeEvent(__OBJ, type, callback, capture);
}

// Hilfsfunktion fuer die Ermittlung eines Elements der Seite
// name: Name des Elements (siehe "name=")
// index: Laufende Nummer des Elements (0-based), Default: 0
// doc: Dokument (document)
// return Gesuchtes Element mit der lfd. Nummer index oder undefined (falls nicht gefunden)
function getElement(name, index = 0, doc = document) {
    const __TAGS = doc.getElementsByName(name);
    const __TABLE = (__TAGS ? __TAGS[index] : undefined);

    return __TABLE;
}

// Hilfsfunktion fuer die Ermittlung eines Elements der Seite (Default: Tabelle)
// index: Laufende Nummer des Elements (0-based)
// tag: Tag des Elements ("table")
// doc: Dokument (document)
// return Gesuchtes Element oder undefined (falls nicht gefunden)
function getTable(index, tag = 'table', doc = document) {
    const __TAGS = doc.getElementsByTagName(tag);
    const __TABLE = (__TAGS ? __TAGS[index] : undefined);

    return __TABLE;
}

// Hilfsfunktion fuer die Ermittlung der Zeilen einer Tabelle
// name: Name des Tabellen-Elements (siehe "name=")
// index: Laufende Nummer des Tabellen-Elements (0-based), Default: 0
// doc: Dokument (document)
// return Gesuchte Zeilen oder undefined (falls nicht gefunden)
function getElementRows(name, index = 0, doc = document) {
    const __TABLE = getElement(name, index, doc);
    const __ROWS = (__TABLE ? __TABLE.rows : undefined);

    return __ROWS;
}

// Hilfsfunktion fuer die Ermittlung der Zeilen einer Tabelle
// index: Laufende Nummer des Elements (0-based)
// doc: Dokument (document)
// return Gesuchte Zeilen oder undefined (falls nicht gefunden)
function getRows(index, doc = document) {
    const __TABLE = getTable(index, 'table', doc);
    const __ROWS = (__TABLE ? __TABLE.rows : undefined);

    return __ROWS;
}

// Hilfsfunktion fuer die Ermittlung der Zeilen einer Tabelle
// id: ID des Tabellen-Elements
// doc: Dokument (document)
// return Gesuchte Zeilen oder undefined (falls nicht gefunden)
function getRowsById(id, doc = document) {
    const __TABLE = doc.getElementById(id);
    const __ROWS = (__TABLE ? __TABLE.rows : undefined);

    return __ROWS;
}

// ==================== Ende Abschnitt fuer diverse DOM-Utilities ====================

// ==================== Abschnitt fuer sonstige Parameter ====================

// Fuegt eine Zelle ans Ende der uebergebenen Zeile hinzu und fuellt sie
// row: Zeile, die verlaengert wird
// content: Textinhalt der neuen Zelle
// color: Schriftfarbe der neuen Zelle (z.B. "#FFFFFF" fuer weiss)
// Bei Aufruf ohne Farbe wird die Standardfarbe benutzt
function appendCell(row, content, color) {
    row.insertCell(-1);

    const __COLIDX = row.cells.length - 1;

    row.cells[__COLIDX].textContent = content;
    row.cells[__COLIDX].align = "center";
    row.cells[__COLIDX].style.color = color;
}

// Fuegt eine Zelle ans Ende der uebergebenen Zeile hinzu und fuellt sie
// row: Zeile, die verlaengert wird
// content: HTML-Inhalt der neuen Zelle
// color: Schriftfarbe der neuen Zelle (z.B. "#FFFFFF" fuer weiss)
// Bei Aufruf ohne Farbe wird die Standardfarbe benutzt
function appendHTML(row, content, color) {
    row.insertCell(-1);

    const __COLIDX = row.cells.length - 1;

    row.cells[__COLIDX].innerHTML = content;
    row.cells[__COLIDX].align = "center";
    row.cells[__COLIDX].style.color = color;
}

// Formatiert eine Zelle um (mit einfachen Parametern)
// cell: Zu formatierende Zelle
// bold: Inhalt fett darstellen (true = ja, false = nein)
// color: Falls angegeben, die Schriftfarbe
// bgColor: Falls angegeben, die Hintergrundfarbe
// return Die formatierte Zelle
function formatCell(cell, bold = true, color = undefined, bgColor = undefined) {
    if (cell) {
        if (bold) {
            cell.style.fontWeight = 'bold';
        }
        if (color) {
            cell.style.color = color;
        }
        if (bgColor) {
            cell.style.backgroundColor = bgColor;
        }
    }

    return cell;
}

// Ermittelt ein Stil-Attribut in Abhaengigkeit der Klasse aus einem Array von Elementen
// elements: Array von Elementen
// propertyName: Name des gesuchten Attributs (value) oder undefined fuer alles
// keyFun: Funktion zur Ermittlung des Keys aus einem Element (key)
// return Liste von key/value-Paaren (<className> : <property> oder <className> : <style>)
function getStyleFromElements(elements, propertyName = undefined, keyFun = getClassNameFromElement) {
    const __ELEMENTS = getValue(elements, []);
    const __RET = { };
    let index = 0;

    while (index < __ELEMENTS.length) {
        const __ELEMENT = __ELEMENTS[index++];
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
    const __SELECT = ((typeof element) === 'string' ? getValue(document.getElementsByName(element), [])[0] : element);

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
    const __SELECT = ((typeof element) === 'string' ? getValue(document.getElementsByName(element), [])[0] : element);

    return this[valType](getValue(valFun(__SELECT), defValue));
}

// Ermittelt den ausgewaehlten Wert einer Combo-Box und gibt diesen zurueck
// comboBox: Alle 'option'-Eintraege der Combo-Box
// defValue: Default-Wert, falls nichts selektiert ist
// valType: Typ-Klasse der Optionswerte ('String', 'Number', ...)
// return Ausgewaehlter Wert
function getSelectionFromComboBox(comboBox, defValue = undefined, valType = 'String') {
    let selection;
    let i = 0;

    while (i < comboBox.length) {
        const __ENTRY = comboBox[i++];

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
    const __CELL = getValue(cells[colIdxInt], { });
    const __TEXT = __CELL.textContent;

    if (__TEXT !== undefined) {
        try {
            const __VALUE = parseInt(__TEXT, 10);

            if (! Number.isNaN(__VALUE)) {
                return __VALUE;
            }
        } catch (ex) {
            defaultCatch(ex);
        }

        return -1;
    }

    return undefined;
}

// Liest eine Dezimalzahl aus der Spalte einer Zeile der Tabelle aus
// cells: Die Zellen einer Zeile
// colIdxInt: Spaltenindex der gesuchten Werte
// return Spalteneintrag als Dezimalzahl (undefined fuer "keine Zahl" oder "nicht gefunden")
function getFloatFromHTML(cells, colIdxFloat) {
    const __CELL = getValue(cells[colIdxFloat], { });
    const __TEXT = __CELL.textContent;

    if (__TEXT !== undefined) {
        try {
            return parseFloat(__TEXT);
        } catch (ex) {
            defaultCatch(ex);
        }
    }

    return undefined;
}

// Liest einen String aus der Spalte einer Zeile der Tabelle aus
// cells: Die Zellen einer Zeile
// colIdxStr: Spaltenindex der gesuchten Werte
// return Spalteneintrag als String ("" fuer "nicht gefunden")
function getStringFromHTML(cells, colIdxStr) {
    const __CELL = getValue(cells[colIdxStr], { });
    const __TEXT = __CELL.textContent;

    return getValue(__TEXT.toString(), "");
}

// Liest einen String aus der Spalte einer Zeile der Tabelle aus, nachdem dieser konvertiert wurde
// cells: Die Zellen einer Zeile
// colIdxStr: Spaltenindex der gesuchten Werte
// convertFun: Funktion, die den Wert konvertiert
// return Spalteneintrag als String ("" fuer "nicht gefunden")
function convertStringFromHTML(cells, colIdxStr, convertFun = sameValue) {
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
// convertFun: Funktion, die die Werte konvertiert
// return Array mit Spalteneintraegen als String ("" fuer "nicht gefunden")
function convertArrayFromHTML(cells, colIdxArr, arrOrLength = 1, convertFun = sameValue) {
    const __ARR = ((typeof arrOrSize === 'number') ? { } : arrOrLength);
    const __LENGTH = getValue(__ARR.length, arrOrLength);
    const __RET = [];
    let index = 0;
    let colIdx = colIdxArr;

    while (index < __LENGTH) {
        const __CELL = getValue(cells[colIdx], { });
        const __TEXT = convertFun(getValue(__ARR[index], __CELL.textContent), __CELL, colIdx++, index++);

        if (__TEXT !== undefined) {
            __CELL.innerHTML = __TEXT;
        }

        __RET.push(getValue(__TEXT, "").toString());
    }

    return __RET;
}

// ==================== Ende Abschnitt fuer sonstige Parameter ====================

// *** EOF ***

// ==UserScript==
// _name         util.class
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Class-Objekte
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// ==/UserScript==

// ==================== Polyfill fuer showAlert() ====================

if ((typeof showAlert) === 'undefined') {
    this.showAlert = console.error;
}

// ==================== Abschnitt fuer Klasse Class ====================

function Class(className, baseClass, initFun) {
    'use strict';

    try {
        const __BASE = ((baseClass !== undefined) ? baseClass : Object);
        const __BASEPROTO = (__BASE ? __BASE.prototype : undefined);
        const __BASECLASS = (__BASEPROTO ? __BASEPROTO.__class : undefined);

        this.className = (className || '?');
        this.baseClass = __BASECLASS;
        Object.setConst(this, 'baseProto', __BASEPROTO, false);

        if (! initFun) {
            const __BASEOBJ = (__BASECLASS || { });
            const __BASEINIT = __BASEOBJ.init;

            if (__BASEINIT) {
                initFun = function __init() {
                              // Basisklassen-Init aufrufen...
                              return __BASEINIT.call(this, __init.arguments);
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
        showAlert('[' + ex.lineNumber + "] Error in Class " + className, ex.message, ex);
    }
}

Class.define = function(subClass, baseClass, members = undefined, initFun = undefined, createProto = true) {
        return (subClass.prototype = subClass.subclass(baseClass, members, initFun, createProto));
    };

Object.setConst = function(obj, item, value, config) {
        return Object.defineProperty(obj, item, {
                        'enumerable'   : false,
                        'configurable' : (config || true),
                        'writable'     : false,
                        'value'        : value
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

            Object.keys(__MEMBERS).forEach(function(item) {
                if ((item !== '__name') && (item !== '__init')) {
                    Object.setConst(__PROTO, item, __MEMBERS[item]);
                }
            });

            Object.setConst(__PROTO, '__class', __CLASS, ! __CREATEPROTO);

            return __PROTO;
        } catch (ex) {
            showAlert('[' + ex.lineNumber + "] Error in subclassing", ex.message, ex);
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

// *** EOF ***

// ==UserScript==
// _name         util.class.delim
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Class-Objekten zu Pfad-Trennern
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.delim.js
// ==/UserScript==

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

// ==UserScript==
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
// ==/UserScript==

// ==================== Abschnitt fuer Klasse Path ====================

// Basisklasse fuer die Verwaltung eines Pfades
// homePath: Absoluter Startpfad als String
// delims: Objekt mit Trennern und Symbolen als Properties (oder Delims-Objekt)
// 'delim': Trennzeichen zwischen zwei Ebenen
// 'back': Name des relativen Vaterverzeichnisses
// 'root': Kennung vor dem ersten Trenner am Anfang eines absoluten Pfads
// 'home': Kennung vor dem ersten Trenner am Anfang eines Pfads relativ zu Home
function Path(homePath, delims) {
    'use strict';

    this.dirs = [];
    this.setDelims(delims);
    this.homeDirs = this.getDirs(homePath, { 'home' : "" });

    this.home();
}

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
                                      Object.keys(subDir).forEach(function(sub) {
                                          this.chDir(sub);
                                      });
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

// ==UserScript==
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
// ==/UserScript==

// ==================== Abschnitt fuer Klasse URI ====================

// Basisklasse fuer die Verwaltung einer URI/URL
// homePath: Absoluter Startpfad als String
// delims: Objekt mit Trennern und Symbolen als Properties (oder Delims-Objekt)
// 'delim': Trennzeichen zwischen zwei Ebenen
// 'back': Name des relativen Vaterverzeichnisses
// 'root': Kennung vor dem ersten Trenner am Anfang eines absoluten Pfads
// 'home': Kennung vor dem ersten Trenner am Anfang eines Pfads relativ zu Home
function URI(homePath, delims) {
    'use strict';

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
                                         const __PATH = (Boolean(~ __INDEXHOST) ? __NOSCHEME.substring(__INDEXHOST + __HOSTDELIM.length) : __NOSCHEME);
                                         const __INDEXHOSTPORT = (__PATH ? __PATH.indexOf(__ROOTDELIM) : -1);
                                         const __HOSTPORT = (Boolean(~ __INDEXHOSTPORT) ? __PATH.substring(0, __INDEXHOSTPORT) : undefined);
                                         const __INDEXPORT = (__HOSTPORT ? __HOSTPORT.indexOf(__PORTDELIM) : -1);
                                         const __HOST = (Boolean(~ __INDEXPORT) ? __HOSTPORT.substring(0, __INDEXPORT) : __HOSTPORT);
                                         const __PORT = (Boolean(~ __INDEXPORT) ? __HOSTPORT.substring(__INDEXPORT + __PORTDELIM.length) : undefined);

                                         return {
                                                    'host' : __HOST,
                                                    'port' : __PORT
                                                };
                                     },
               'stripHostPort'     : function(path = undefined) {
                                         const __HOSTDELIM = this.delims.host;
                                         const __ROOTDELIM = this.delims.root + this.delims.delim;
                                         const __INDEXHOST = (path ? path.indexOf(__HOSTDELIM) : -1);
                                         const __PATH = (Boolean(~ __INDEXHOST) ? path.substring(__INDEXHOST + __HOSTDELIM.length) : path);
                                         const __INDEXHOSTPORT = (__PATH ? __PATH.indexOf(__ROOTDELIM) : -1);

                                         return (Boolean(~ __INDEXHOSTPORT) ? __PATH.substring(__INDEXHOSTPORT) : __PATH);
                                     },
               'getSchemePrefix'   : function(path = undefined) {
                                         const __SCHEMEDELIM = this.delims.scheme;
                                         const __INDEXSCHEME = (path ? path.indexOf(__SCHEMEDELIM) : -1);

                                         return (Boolean(~ __INDEXSCHEME) ? path.substring(0, __INDEXSCHEME) : undefined);
                                     },
               'stripSchemePrefix' : function(path = undefined) {
                                         const __SCHEMEDELIM = this.delims.scheme;
                                         const __INDEXSCHEME = (path ? path.indexOf(__SCHEMEDELIM) : -1);

                                         return (Boolean(~ __INDEXSCHEME) ? path.substring(__INDEXSCHEME + __INDEXSCHEME.length) : path);
                                     },
               'getNodeSuffix'     : function(path = undefined) {
                                         const __NODEDELIM = this.delims.node;
                                         const __INDEXNODE = (path ? path.lastIndexOf(__NODEDELIM) : -1);

                                         return (Boolean(~ __INDEXNODE) ? path.substring(__INDEXNODE + __NODEDELIM.length) : undefined);
                                     },
               'stripNodeSuffix'   : function(path = undefined) {
                                         const __NODEDELIM = this.delims.node;
                                         const __INDEXNODE = (path ? path.lastIndexOf(__NODEDELIM) : -1);

                                         return (Boolean(~ __INDEXNODE) ? path.substring(0, __INDEXNODE) : path);
                                     },
               'getQueryString'    : function(path = undefined) {
                                         const __QUERYDELIM = this.delims.query;
                                         const __PATH = this.stripNodeSuffix(path);
                                         const __INDEXQUERY = (__PATH ? __PATH.indexOf(__QUERYDELIM) : -1);

                                         return (Boolean(~ __INDEXQUERY) ? __PATH.substring(__INDEXQUERY + __QUERYDELIM.length) : undefined);
                                     },
               'stripQueryString'  : function(path = undefined) {
                                         const __QUERYDELIM = this.delims.query;
                                         const __INDEXQUERY = (path ? path.indexOf(__QUERYDELIM) : -1);

                                         return (Boolean(~ __INDEXQUERY) ? path.substring(0, __INDEXQUERY) : path);
                                     },
               'formatParams'      : function(params, formatFun, delim = ' ', assign = '=') {
                                         const __PARAMS = [];

                                         Object.keys(params).forEach(function(param) {
                                             __PARAMS.push(param + assign + formatFun(params[param]));
                                         });

                                         return __PARAMS.join(delim);
                                     },
               'parseParams'       : function(params, parseFun, delim = ' ', assign = '=') {
                                         const __RET = { };

                                         if (params) {
                                             const __PARAMS = params.split(delim);
                                             let index = 0;

                                             while (index < __PARAMS.length) {
                                                 const __PARAM = __PARAMS[index++];

                                                 if (__PARAM) {
                                                     const __INDEX = __PARAM.indexOf(assign);
                                                     const __KEY = (Boolean(~ __INDEX) ? __PARAM.substring(0, __INDEX) : __PARAM);
                                                     const __VAL = (Boolean(~ __INDEX) ? parseFun(__PARAM.substring(__INDEX + assign.length)) : true);

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
               'getDirs'           : function(path = undefined, delims = undefined) {
                                         const __PATH = this.getServerPath(path);

                                         return Path.prototype.getDirs.call(this, __PATH);
                                     }
           });

// ==================== Ende Abschnitt fuer Klasse URI ====================

// *** EOF ***

// ==UserScript==
// _name         util.option.type
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit den Konfigurations-Typen fuer Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// ==/UserScript==

// ==================== Abschnitt Moegliche Typen fuer Optionen ====================

// Options-Typen
const __OPTTYPES = {
    'MC' : "multiple choice",
    'SW' : "switch",
    'TF' : "true/false",
    'SD' : "simple data",
    'SI' : "simple option"
};

// Options-Typen
const __OPTACTION = {
    'SET' : "set option value",
    'NXT' : "set next option value",
    'RST' : "reset options"
};

// ==================== Ende Abschnitt Moegliche Typen fuer Optionen ====================

// *** EOF ***

// ==UserScript==
// _name         util.option.data
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Zugriff auf die Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// ==/UserScript==

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

    for (let stage in __PROPS) {
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
    if ((optSet !== undefined) && (item !== undefined)) {
        return getOpt(optSet[item], defOpt);
    } else {
        return defOpt;
    }
}

// Gibt die Konfigurationsdaten einer Option zurueck
// opt: Config und Value der Option
// defConfig: Rueckgabewert, falls Config nicht zu finden
// return Konfigurationsdaten der Option
function getOptConfig(opt, defConfig = { }) {
    return getValue(getOpt(opt).Config, defConfig);
}

// Setzt den Namen einer Option
// opt: Config und Value der Option
// name: Zu setzender Name der Option
// reload: Seite mit neuem Wert neu laden
// return Gesetzter Name der Option
function setOptName(opt, name) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);

    if (__NAME !== name) {
        __LOG[4]("RENAME " + __NAME + " => " + name);

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

        if (__SHARED && ! opt.Loaded) {
            const __OBJREF = getSharedRef(__SHARED, opt.Item);

            return __OBJREF.getPath();
        }

        showAlert("Error", "Option ohne Namen", safeStringify(__CONFIG));
    }

    return __NAME;
}

// Setzt den Wert einer Option
// opt: Config und Value der Option
// name: Zu setzender Wert der Option
// return Gesetzter Wert
function setOptValue(opt, value) {
    if (opt !== undefined) {
        if (! opt.ReadOnly) {
            __LOG[6](getOptName(opt) + ": " + __LOG.changed(opt.Value, value));

            opt.Value = value;
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
    let value;

    if (opt && opt.Loaded) {
        value = getValue(opt.Value, defValue);
    }

    return valueOf(value);
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
    return setOptValue(opt, setStored(getOptName(opt), value, reload, getOptConfig(opt).Serial, onFulfilled, onRejected));
}

// Ermittelt die naechste moegliche Option
// opt: Config und Value der Option
// value: Ggfs. zu setzender Wert
// return Zu setzender Wert
function getNextOpt(opt, value = undefined) {
    const __CONFIG = getOptConfig(opt);
    const __VALUE = getOptValue(opt, value);

    switch (__CONFIG.Type) {
    case __OPTTYPES.MC : return getValue(value, getNextValue(__CONFIG.Choice, __VALUE));
    case __OPTTYPES.SW : return getValue(value, ! __VALUE);
    case __OPTTYPES.TF : return getValue(value, ! __VALUE);
    case __OPTTYPES.SD : return getValue(value, __VALUE);
    case __OPTTYPES.SI : break;
    }

    return __VALUE;
}

// Setzt die naechste moegliche Option
// opt: Config und Value der Option
// value: Default fuer ggfs. zu setzenden Wert
// reload: Seite mit neuem Wert neu laden
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function setNextOpt(opt, value = undefined, reload = false, onFulfilled = undefined, onRejected = undefined) {
    return setOpt(opt, getNextOpt(opt, value), reload, onFulfilled, onRejected);
}

// Setzt die naechste moegliche Option oder fragt ab einer gewissen Anzahl interaktiv ab
// opt: Config und Value der Option
// value: Default fuer ggfs. zu setzenden Wert
// reload: Seite mit neuem Wert neu laden
// freeValue: Angabe, ob Freitext zugelassen ist (Default: false)
// minChoice: Ab wievielen Auswahlmoeglichkeiten soll abgefragt werden? (Default: 3)
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function promptNextOpt(opt, value = undefined, reload = false, freeValue = false, selValue = true, minChoice = 3, onFulfilled = undefined, onRejected = undefined) {
    const __CONFIG = getOptConfig(opt);
    const __CHOICE = __CONFIG.Choice;

    if (value || (! __CHOICE) || (__CHOICE.length < minChoice)) {
        return setNextOpt(opt, value, reload, onFulfilled, onRejected);
    }

    const __VALUE = getOptValue(opt, value);

    try {
        const __NEXTVAL = getNextValue(__CHOICE, __VALUE);
        let message = "";

        if (selValue) {
            let index = 0;

            while (index < __CHOICE.length) {
                message += (index + 1) + ") " + __CHOICE[index] + '\n';
                index++;
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

                if (freeValue || Boolean(~ __CHOICE.indexOf(__CASTVAL))) {
                    nextVal = __CASTVAL;
                }
            }

            if (nextVal !== __VALUE) {
                if (nextVal) {
                    return setOpt(opt, nextVal, reload, onFulfilled, onRejected);
                }

                const __LABEL = substParam(__CONFIG.Label, __VALUE);

                showAlert(__LABEL, "Ung\u00FCltige Eingabe: " + __ANSWER);
            }
        }
    } catch (ex) {
        __LOG[0]("promptNextOpt: " + ex.message);
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
    const __OPT = getOptByName(optSet, item);

    return setOpt(__OPT, value, reload, onFulfilled, onRejected);
}

// Ermittelt die naechste moegliche Option (Version mit Key)
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// value: Default fuer ggfs. zu setzenden Wert
// return Zu setzender Wert
function getNextOptByName(optSet, item, value = undefined) {
    const __OPT = getOptByName(optSet, item);

    return getNextOpt(__OPT, value);
}

// Setzt die naechste moegliche Option (Version mit Key)
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// value: Default fuer ggfs. zu setzenden Wert
// reload: Seite mit neuem Wert neu laden
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function setNextOptByName(optSet, item, value = undefined, reload = false, onFulfilled = undefined, onRejected = undefined) {
    const __OPT = getOptByName(optSet, item);

    return setNextOpt(__OPT, value, reload, onFulfilled, onRejected);
}

// Setzt die naechste moegliche Option oder fragt ab einer gewissen Anzahl interaktiv ab (Version mit Key)
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// value: Default fuer ggfs. zu setzenden Wert
// reload: Seite mit neuem Wert neu laden
// freeValue: Angabe, ob Freitext zugelassen ist (Default: false)
// minChoice: Ab wievielen Auswahlmoeglichkeiten soll abgefragt werden? (Default: 3)
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function promptNextOptByName(optSet, item, value = undefined, reload = false, freeValue = false, selValue = true, minChoice = 3, onFulfilled = undefined, onRejected = undefined) {
    const __OPT = getOptByName(optSet, item);

    return promptNextOpt(__OPT, value, reload, freeValue, selValue, minChoice, onFulfilled, onRejected);
}

// ==================== Ende Abschnitt fuer Zugriff auf die Optionen ====================

// *** EOF ***

// ==UserScript==
// _name         util.option.api
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Zugriff auf die Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// ==/UserScript==

// ==================== Abschnitt Operationen auf Optionen ====================

// Invalidiert eine (ueber Menu) gesetzte Option
// opt: Zu invalidierende Option
// force: Invalidiert auch Optionen mit 'AutoReset'-Attribut
// return Promise auf resultierenden Wert
function invalidateOpt(opt, force = false) {
    return Promise.resolve(opt.Promise).then(function(value) {
            if (opt.Loaded && ! opt.ReadOnly) {
                const __CONFIG = getOptConfig(opt);

                // Wert "ungeladen"...
                opt.Loaded = (force || ! __CONFIG.AutoReset);

                if (opt.Loaded && __CONFIG.AutoReset) {
                    // Nur zuruecksetzen, gilt als geladen...
                    setOptValue(opt, initOptValue(__CONFIG));
                }
            }

            return getOptValue(opt);
        }, defaultCatch);
}

// Invalidiert die (ueber Menu) gesetzten Optionen
// optSet: Object mit den Optionen
// force: Invalidiert auch Optionen mit 'AutoReset'-Attribut
// return Promise auf Object mit den geladenen Optionen
async function invalidateOpts(optSet, force = false) {
    await Promise.all(Object.keys(optSet).map(async function(opt) {
        const __OPT = optSet[opt];

        await invalidateOpt(__OPT, force);
    }));

    return optSet;
}

// Laedt eine (ueber Menu) gesetzte Option
// opt: Zu ladende Option
// force: Laedt auch Optionen mit 'AutoReset'-Attribut
// return Promise auf gesetzten Wert der gelandenen Option
function loadOption(opt, force = false) {
    if (! opt.Promise) {
        const __CONFIG = getOptConfig(opt);
        const __ISSHARED = getValue(__CONFIG.Shared, false, true);
        const __NAME = getOptName(opt);
        const __DEFAULT = getOptValue(opt, undefined);
        let value;

        if (opt.Loaded && ! __ISSHARED) {
            const __ERROR = "Error: Oprion '" + __NAME + "' bereits geladen!";

            __LOG[0](__MESSAGE);

            return Promise.reject(__MESSAGE);
        }

        if (opt.ReadOnly || __ISSHARED) {
            value = __DEFAULT;
        } else if (! force && __CONFIG.AutoReset) {
            value = initOptValue(__CONFIG);
        } else {
            value = (__CONFIG.Serial ?
                            deserialize(__NAME, __DEFAULT) :
                            GM.getValue(__NAME, __DEFAULT));
        }

        opt.Promise = Promise.resolve(value).then(function(value) {
                // Paranoide Sicherheitsabfrage (das sollte nie passieren!)...
                if (opt.Loaded || ! opt.Promise) {
                    showAlert("Error", "Unerwarteter Widerspruch zwischen opt.Loaded und opt.Promise", safeStringify(opt));
                }
                __LOG[5]("LOAD " + __NAME + ": " + __LOG.changed(__DEFAULT, value));

                // Wert intern setzen...
                const __VAL = setOptValue(opt, value);

                // Wert als geladen markieren...
                opt.Promise = undefined;
                opt.Loaded = true;

                return __VAL;
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

    Object.keys(optSet).forEach(function(opt) {
        const __OPT = optSet[opt];

        if (! __OPT.Loaded) {
            const __PROMISE = loadOption(__OPT, force).then(function(value) {
                    __LOG[5]("LOADED " + opt + " << " + value);

                    return Promise.resolve({
                            'name'  : opt,
                            'value' : value
                        });
                }, defaultCatch);

            __PROMISES.push(__PROMISE);
        }
    });

    return Promise.all(__PROMISES);
}

// Entfernt eine (ueber Menu) gesetzte Option (falls nicht 'Permanent')
// opt: Gesetzte Option
// force: Entfernt auch Optionen mit 'Permanent'-Attribut
// reset: Setzt bei Erfolg auf Initialwert der Option (auch fuer nicht 'AutoReset')
// return Promise von GM.deleteValue() (oder void)
function deleteOption(opt, force = false, reset = true) {
    const __CONFIG = getOptConfig(opt);

    if (force || ! __CONFIG.Permanent) {
        const __NAME = getOptName(opt);

        __LOG[4]("DELETE " + __NAME);

        return GM.deleteValue(__NAME).then(function(voidValue) {
                if (reset || __CONFIG.AutoReset) {
                    setOptValue(opt, initOptValue(__CONFIG));
                }
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

    const __RET = await Object.keys(optSet).reduce((promise, opt) => promise.then(async () => {
        if (getValue(__OPTSELECT[opt], __DELETEALL)) {
            await deleteOption(optSet[opt], force, reset);
        }
    }, defaultCatch), Promise.resolve());

    return __RET;
}

// Benennt eine Option um und laedt sie ggfs. nach
// opt: Gesetzte Option
// name: Neu zu setzender Name (Speicheradresse)
// reload: Wert nachladen statt beizubehalten
// force: Laedt auch Optionen mit 'AutoReset'-Attribut
// return Promise auf umbenannte Option
async function renameOption(opt, name, reload = false, force = false) {
    const __NAME = getOptName(opt);

    if (__NAME !== name) {
        await deleteOption(opt, true, ! reload);

        setOptName(opt, name);

        await invalidateOpt(opt, opt.Loaded);

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
        __LOG[0]("RENAME: Illegale Funktion!");
    }
    const __RET = await Object.keys(optSet).reduce((promise, opt) => promise.then(async () => {
        const __OPTPARAMS = optSelect[opt];
        const __OPT = optSet[opt];

        if (__OPT === undefined) {
            __LOG[0]("RENAME: Option '" + opt + "' nicht gefunden!");
        } else {
            const __NAME = getOptName(__OPT);
            const __NEWNAME = renameFun(__NAME, renameParam);
            const __ISSCALAR = ((typeof __OPTPARAMS) === 'boolean');
            // Laedt die unter dem neuen Namen gespeicherten Daten nach?
            const __RELOAD = (__ISSCALAR ? __OPTPARAMS : __OPTPARAMS.reload);
            // Laedt auch Optionen mit 'AutoReset'-Attribut?
            const __FORCE = (__ISSCALAR ? true : __OPTPARAMS.force);

            await renameOption(__OPT, __NEWNAME, __RELOAD, __FORCE);
        }
    }, defaultCatch), Promise.resolve());

    return __RET;
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

    if (asyncLoad) {
        if (! opt) {
            return Promise.reject("loadOptValue: Option ist undefined");
        } else {
            let promise = (opt.Loaded ? Promise.resolve(opt.Value) : opt.Promise);

            if (! promise) {
                promise = loadOption(opt, force);
            }

            return promise.then(value => valueOf(getValue(value, defValue)));
        }
    } else {
        if (! (opt && opt.Loaded)) {
            __LOG[0](`Warnung: loadOptValue(${getOptName(opt)}) erlaubt kein Nachladen!`);
        }

        return getOptValue(opt, defValue);
    }
}

// ==================== Ende Abschnitt Operationen auf Optionen ====================

// *** EOF ***

// ==UserScript==
// _name         util.mem
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer localStorage und sessionStorage
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// ==/UserScript==

// ==================== Abschnitt fuer Speicher ====================

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
const __MEMINAKTIVE = 'inaktiv';

// Definition des Default-, Dauer- und Null-Memories...
const __OPTMEMNORMAL   = __OPTMEM[__MEMNORMAL];
const __OPTMEMSESSION  = __OPTMEM[__MEMSESSION];
const __OPTMEMINAKTIVE = __OPTMEM[__MEMINAKTIVE];

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
        const __TESTPREFIX = 'canUseStorageTest';
        const __TESTDATA = Math.random().toString();
        const __TESTITEM = __TESTPREFIX + __TESTDATA;

        __MEMORY.setItem(__TESTITEM, __TESTDATA);
        ret = (__MEMORY.getItem(__TESTITEM) === __TESTDATA);
        __MEMORY.removeItem(__TESTITEM);
    }

    __LOG[2]("canUseStorage(" + __STORAGE.Name + ") = " + ret);

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

        __LOG[2]("MEM: " + __SIZE + " bytes");
        return __SIZE;
    } else {
        return 0;
    }
}

// Gibt rekursiv und detailliert die Groesse des benutzten Speichers fuer ein Objekt aus
// value: (Enumerierbares) Objekt oder Wert, dessen Groesse gemessen wird
// out: Logfunktion, etwa __LOG[4]
// depth: Gewuenschte Rekursionstiefe (0 = nur dieses Objekt, -1 = alle Ebenen)
// name: Name des Objekts
function getMemUsage(value = undefined, out = undefined, depth = -1, name = '$') {
    const __OUT = (out || __LOG[4]);

    if ((typeof value) === 'string') {
        const __SIZESTR = value.length;

        __OUT("USAGE: " + name + '\t' + __SIZESTR + '\t' + value.slice(0, 255));
    } else if ((typeof value) === 'object') {
        if (depth === 0) {
            const __SIZEOBJ = safeStringify(value).length;

            __OUT("USAGE: " + name + '\t' + __SIZEOBJ);
        } else {
            depth--;
            Object.keys(value).forEach(function(sub) {
                getMemUsage(value[sub], __OUT, depth, name + '.' + sub);
            });
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
        if (storage !== __MEMINAKTIVE) {
            storage = __MEMINAKTIVE;
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

// ==UserScript==
// _name         util.mem.db
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer die Script-Datenbank
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.db.js
// ==/UserScript==

// ==================== Funktionen fuer die Scriptdatenbank ====================

// Initialisiert die Scriptdatenbank, die einen Datenaustausch zwischen den Scripten ermoeglicht
// optSet: Gesetzte Optionen (und Config)
function initScriptDB(optSet) {
     // Speicher fuer die DB-Daten...
    const __DBMEM = myOptMem.Value;

    __DBTOC.versions = getValue(((__DBMEM === undefined) ? undefined : JSON.parse(__DBMEM.getItem('__DBTOC.versions'))), { });
    __DBTOC.namespaces = getValue(((__DBMEM === undefined) ? undefined : JSON.parse(__DBMEM.getItem('__DBTOC.namespaces'))), { });

    // Zunaechst den alten Eintrag entfernen...
    delete __DBTOC.versions[__DBMOD.name];
    delete __DBTOC.namespaces[__DBMOD.name];

    if (__DBMEM !== undefined) {
        // ... und die Daten der Fremdscripte laden...
        Object.keys(__DBTOC.versions).forEach(function(module) {
            scriptDB(module, getValue(JSON.parse(__DBMEM.getItem('__DBDATA.' + module)), { }));
        });
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

// ==UserScript==
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
// ==/UserScript==

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
                __LOG[0]("getStoredCmds(): " + __CMD + " '" + __KEY + "' hat illegalen Wert '" + value + "'");
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
            case __OPTACTION.SET : __LOG[4]("SET '" + __KEY + "' " + __VAL);
                                   setStored(__KEY, __VAL, false, false, onFulfilled, onRejected);
                                   break;
            case __OPTACTION.NXT : __LOG[4]("SETNEXT '" + __KEY + "' " + __VAL);
                                   //setNextStored(__CONFIG.Choice, __KEY, __VAL, false, false, onFulfilled, onRejected);
                                   setStored(__KEY, __VAL, false, false, onFulfilled, onRejected);
                                   break;
            case __OPTACTION.RST : __LOG[4]("RESET (delayed)");
                                   __LOADEDCMDS.push(__STORED);
                                   break;
            }
        } else {
            switch (__OPTACTION[__CMD]) {
            case __OPTACTION.SET :
            case __OPTACTION.NXT : __LOG[2]("SET/SETNEXT (undefined)");
                                   break;
            case __OPTACTION.RST : __LOG[4]("RESET");
                                   await resetOptions(optSet, false);
                                   await loadOptions(optSet);  // Reset auf umbenannte Optionen anwenden!
                                   break;
            }
        }
    }

    return (__LOADEDCMDS.length ? __LOADEDCMDS : undefined);
}

// *** EOF ***

// ==UserScript==
// _name         util.option.menu
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Script-Optionen im Benutzermenue
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.menu.js
// ==/UserScript==

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
function registerMenuOption(val, menuOn, funOn, keyOn, menuOff, funOff, keyOff) {
    const __ON  = (val ? '*' : "");
    const __OFF = (val ? "" : '*');

    __LOG[3]("OPTION " + __ON + menuOn + __ON + " / " + __OFF + menuOff + __OFF);

    if (val) {
        return GM.registerMenuCommand(menuOff, funOff, keyOff).then(result => menuOn);
    } else {
        return GM.registerMenuCommand(menuOn, funOn, keyOn).then(result => menuOff);
    }
}

// Zeigt den Eintrag im Menu einer Option mit Wahl des naechsten Wertes
// val: Derzeitiger Wert der Option
// arr: Array-Liste mit den moeglichen Optionen
// menu: Text zum Setzen im Menu ($ wird durch gesetzten Wert ersetzt)
// fun: Funktion zum Setzen des naechsten Wertes
// key: Hotkey zum Setzen des naechsten Wertes im Menu
// return Promise von GM.registerMenuCommand()
function registerNextMenuOption(val, arr, menu, fun, key) {
    const __MENU = substParam(menu, val);
    let options = "OPTION " + __MENU;

    for (let value of arr) {
        if (value === val) {
            options += " / *" + value + '*';
        } else {
            options += " / " + value;
        }
    }
    __LOG[3](options);

    return GM.registerMenuCommand(__MENU, fun, key).then(result => __MENU);
}

// Zeigt den Eintrag im Menu einer Option, falls nicht hidden
// val: Derzeitiger Wert der Option
// menu: Text zum Setzen im Menu ($ wird durch gesetzten Wert ersetzt)
// fun: Funktion zum Setzen des naechsten Wertes
// key: Hotkey zum Setzen des naechsten Wertes im Menu
// hidden: Angabe, ob Menupunkt nicht sichtbar sein soll (Default: sichtbar)
// serial: Serialization fuer komplexe Daten
// return Promise von GM.registerMenuCommand() (oder String-Version des Wertes)
function registerDataOption(val, menu, fun, key, hidden = false, serial = true) {
    const __VALUE = ((serial && (val !== undefined)) ? safeStringify(val) : val);
    const __MENU = substParam(menu, __VALUE);
    const __OPTIONS = (hidden ? "HIDDEN " : "") + "OPTION " + __MENU +
                      getValue(__VALUE, "", " = " + __VALUE);

    __LOG[hidden ? 4 : 3](__OPTIONS);

    if (hidden) {
        return Promise.resolve(__VALUE);
    } else {
        return GM.registerMenuCommand(__MENU, fun, key).then(result => __MENU);
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

    if (! __CONFIG.HiddenMenu) {
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
async function buildMenu(optSet) {
    __LOG[3]("buildMenu()");

    const __RET = await Object.keys(optSet).reduce((promise, opt) => promise.then(async () => {
        await registerOption(optSet[opt]).then(
                result => __LOG[6](`REGISTEROPTION[${opt}] = ${result}`),
                defaultCatch);
    }, defaultCatch), Promise.resolve());

    return __RET;
}

// ==================== Ende Abschnitt fuer das Benutzermenu ====================

// *** EOF ***

// ==UserScript==
// _name         util.option.page.label
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Node-Tooltips auf der Seite
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.label.js
// ==/UserScript==

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
        return eachLine(html, line => '<abbr title="' + title + '">' + line + '</abbr>', separator, undefined, limit);
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

// ==UserScript==
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
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.action.js
// ==/UserScript==

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
                              return (__MEMSTR + ".setItem('" + __RUNPREFIX + item + "', " + (quotes ? "'" + val + "'" : val) + "),");
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
            case __OPTACTION.SET : //return "doActionSet('" + getOptName(opt) + "', " + getNextOpt(opt, __VALSTR) + ')';
                                   return __SETITEMS('SET', getOptName(opt), __VALSTR);
            case __OPTACTION.NXT : //return "doActionNxt('" + getOptName(opt) + "', " + getNextOpt(opt, __VALSTR) + ')';
                                   return __SETITEMS('NXT', getOptName(opt), __VALSTR);
            case __OPTACTION.RST : //return "doActionRst()";
                                   return __SETITEMS('RST');
            }
        }
    }

    return undefined;
}

// Liefert die Funktionsaufruf zur Option als String
// opt: Auszufuehrende Option
// isAlt: Angabe, ob AltAction statt Action gemeint ist
// value: Ggfs. zu setzender Wert
// type: Event-Typ fuer <input>, z.B. "click" fuer "onclick="
// serial: Serialization fuer String-Werte (Select, Textarea)
// memory: __OPTMEM.normal = unbegrenzt gespeichert (localStorage), __OPTMEM.begrenzt = bis Browserende gespeichert (sessionStorage), __OPTMEM.inaktiv
// return String mit dem (reinen) Funktionsaufruf
function getFormActionEvent(opt, isAlt = false, value = undefined, type = 'click', serial = undefined, memory = undefined) {
    const __ACTION = getFormAction(opt, isAlt, value, serial, memory);

    return getValue(__ACTION, "", ' on' + type + '="' + __ACTION + '"');
}

// ==================== Ende Abschnitt fuer Reaktionen der Node-Elemente auf der Seite ====================

// *** EOF ***

// ==UserScript==
// _name         util.option.page.node
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Node-Elementen in HTML auf der Seite
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.label.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.action.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.node.js
// ==/UserScript==

// ==================== Abschnitt fuer Node-Elemente auf der Seite ====================

// Zeigt eine Option auf der Seite als Auswahlbox an
// opt: Anzuzeigende Option
// return String mit dem HTML-Code
function getOptionSelect(opt) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt);
    const __ACTION = getFormActionEvent(opt, false, undefined, 'change', undefined);
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel, __CONFIG.Label, true);
    const __TITLE = substParam(getValue(__CONFIG.Title, __CONFIG.Label), __VALUE);
    const __LABEL = '<label for="' + __NAME + '">' + __FORMLABEL + '</label>';
    let element = '<select name="' + __NAME + '" id="' + __NAME + '"' + __ACTION + '>';

    if (__CONFIG.FreeValue && ! Boolean(~ __CONFIG.Choice.indexOf(__VALUE))) {
        element += '\n<option value="' + __VALUE + '" SELECTED>' + __VALUE + '</option>';
    }
    for (let value of __CONFIG.Choice) {
        element += '\n<option value="' + value + '"' +
                   ((value === __VALUE) ? ' SELECTED' : "") +
                   '>' + value + '</option>';
    }
    element += '\n</select>';

    return withTitle(substParam(__LABEL, element), __TITLE);
}

// Zeigt eine Option auf der Seite als Radiobutton an
// opt: Anzuzeigende Option
// return String mit dem HTML-Code
function getOptionRadio(opt) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt, false);
    const __ACTION = getFormActionEvent(opt, false, true, 'click', false);
    const __ALTACTION = getFormActionEvent(opt, true, false, 'click', false);
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel); // nur nutzen, falls angegeben
    const __TITLE = getValue(__CONFIG.Title, '$');
    const __TITLEON = substParam(__TITLE, __CONFIG.Label);
    const __TITLEOFF = substParam(getValue(__CONFIG.AltTitle, __TITLE), __CONFIG.AltLabel);
    const __ELEMENTON  = '<input type="radio" name="' + __NAME +
                         '" id="' + __NAME + 'ON" value="1"' +
                         (__VALUE ? ' CHECKED' : __ACTION) +
                         ' /><label for="' + __NAME + 'ON">' +
                         __CONFIG.Label + '</label>';
    const __ELEMENTOFF = '<input type="radio" name="' + __NAME +
                         '" id="' + __NAME + 'OFF" value="0"' +
                         (__VALUE ? __ALTACTION : ' CHECKED') +
                         ' /><label for="' + __NAME + 'OFF">' +
                         __CONFIG.AltLabel + '</label>';
    const __ELEMENT = [
                          withTitle(__FORMLABEL, __VALUE ? __TITLEON : __TITLEOFF),
                          withTitle(__ELEMENTON, __TITLEON),
                          withTitle(__ELEMENTOFF, __TITLEOFF)
                      ];

    return ((__FORMLABEL && __FORMLABEL.length) ? __ELEMENT : __ELEMENT.slice(1, 3));
}

// Zeigt eine Option auf der Seite als Checkbox an
// opt: Anzuzeigende Option
// return String mit dem HTML-Code
function getOptionCheckbox(opt) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt, false);
    const __ACTION = getFormActionEvent(opt, __VALUE, ! __VALUE, 'click', false);
    const __VALUELABEL = (__VALUE ? __CONFIG.Label : getValue(__CONFIG.AltLabel, __CONFIG.Label));
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel, __CONFIG.Label);
    const __TITLE = substParam(getValue((__VALUE ? __CONFIG.Title : getValue(__CONFIG.AltTitle, __CONFIG.Title)), '$'), __VALUELABEL);

    return withTitle('<input type="checkbox" name="' + __NAME +
                     '" id="' + __NAME + '" value="' + __VALUE + '"' +
                     (__VALUE ? ' CHECKED' : "") + __ACTION + ' /><label for="' +
                     __NAME + '">' + __FORMLABEL + '</label>', __TITLE);
}

// Zeigt eine Option auf der Seite als Daten-Textfeld an
// opt: Anzuzeigende Option
// return String mit dem HTML-Code
function getOptionTextarea(opt) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt);
    const __ACTION = getFormActionEvent(opt, false, undefined, 'submit', undefined);
    const __SUBMIT = getValue(__CONFIG.Submit, "");
    //const __ONSUBMIT = (__SUBMIT.length ? ' onKeyDown="' + __SUBMIT + '"': "");
    const __ONSUBMIT = (__SUBMIT ? ' onKeyDown="' + __SUBMIT + '"': "");
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel, __CONFIG.Label);
    const __TITLE = substParam(getValue(__CONFIG.Title, '$'), __FORMLABEL);
    const __ELEMENTLABEL = '<label for="' + __NAME + '">' + __FORMLABEL + '</label>';
    const __ELEMENTTEXT = '<textarea name="' + __NAME + '" id="' + __NAME + '" cols="' + __CONFIG.Cols +
                           '" rows="' + __CONFIG.Rows + '"' + __ONSUBMIT + __ACTION + '>' +
                           safeStringify(__VALUE, __CONFIG.Replace, __CONFIG.Space) + '</textarea>';

    return [ withTitle(__ELEMENTLABEL, __TITLE), __ELEMENTTEXT ];
}

// Zeigt eine Option auf der Seite als Button an
// opt: Anzuzeigende Option
// return String mit dem HTML-Code
function getOptionButton(opt) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt, false);
    const __ACTION = getFormActionEvent(opt, __VALUE, ! __VALUE, 'click', false);
    const __BUTTONLABEL = (__VALUE ? getValue(__CONFIG.AltLabel, __CONFIG.Label) : __CONFIG.Label);
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel, __BUTTONLABEL);
    const __BUTTONTITLE = substParam(getValue((__VALUE ? getValue(__CONFIG.AltTitle, __CONFIG.Title) : __CONFIG.Title), '$'), __BUTTONLABEL);

    return '<label for="' + __NAME + '">' + __FORMLABEL + '</label>' +
           withTitle('<input type="button" name="" + ' + __NAME +
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
        }

        if ((typeof element) !== 'string') {
            element = '<div>' + Array.from(element).join('<br />') + '</div>';
        }
    }

    return element;
}

// ==================== Ende Abschnitt fuer Node-Elemente auf der Seite ====================

// *** EOF ***

// ==UserScript==
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
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.node.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.js
// ==/UserScript==

// ==================== Abschnitt fuer Optionen auf der Seite ====================

// Gruppiert die Daten eines Objects nach einem Kriterium
// data: Object mit Daten
// byFun: function(val), die das Kriterium ermittelt. Default: value
// filterFun: function(key, index, arr), die das Kriterium key im Array arr an der Stelle index vergleicht. Default: Wert identisch
// sortFun: function(a, b), nach der die Kriterien sortiert werden. Default: Array.sort()
// return Neues Object mit Eintraegen der Form <Kriterium> : [ <alle Keys zu diesem Kriterium> ]
function groupData(data, byFun, filterFun, sortFun) {
    const __BYFUN = (byFun || (val => val));
    const __FILTERFUN = (filterFun || ((key, index, arr) => (arr[index] === key)));
    const __KEYS = Object.keys(data);
    const __VALS = Object.values(data);
    const __BYKEYS = __VALS.map(__BYFUN);
    const __BYKEYSET = new Set(__BYKEYS);
    const __BYKEYARRAY = [...__BYKEYSET];
    const __SORTEDKEYS = __BYKEYARRAY.sort(sortFun);
    const __GROUPEDKEYS = __SORTEDKEYS.map(byVal => __KEYS.filter((key, index, arr) => __FILTERFUN(byVal, index, __BYKEYS)));
    const __ASSIGN = ((keyArr, valArr) => Object.assign({ }, ...keyArr.map((key, index) => ({ [key] : valArr[index] }))));

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
function getForm(optSet, optParams = { }) {
    const __FORM = '<form id="options" method="POST"><table><tbody><tr>';
    const __FORMEND = '</tr></tbody></table></form>';
    const __FORMWIDTH = getValue(optParams.formWidth, 3);
    const __FORMBREAK = getValue(optParams.formBreak, __FORMWIDTH);
    const __SHOWFORM = getOptValue(optSet.showForm, true) ? optParams.showForm : { 'showForm' : true };
    const __PRIOOPTS = groupData(optSet, opt => getOptConfig(opt).FormPrio);
    let form = __FORM;
    let count = 0;   // Bisher angezeigte Optionen
    let column = 0;  // Spalte der letzten Option (1-basierend)

    for (let optKeys of Object.values(__PRIOOPTS)) {
        for (let optKey of optKeys) {
            if (checkItem(optKey, __SHOWFORM, optParams.hideForm)) {
                const __ELEMENT = getOptionElement(optSet[optKey]);
                const __TDOPT = (Boolean(~ __ELEMENT.indexOf('|')) ? "" : ' colspan="2"');

                if (__ELEMENT) {
                    if (++count > __FORMBREAK) {
                        if (++column > __FORMWIDTH) {
                            column = 1;
                        }
                    }
                    if (column === 1) {
                        form += '</tr><tr>';
                    }
                    form += '\n<td' + __TDOPT + '>' + __ELEMENT.replace('|', '</td><td>') + '</td>';
                }
            }
        }
    }
    form += '\n' + __FORMEND;

    return form;
}

// Fuegt das Script in die Seite ein
// optSet: Gesetzte Optionen
// optParams: Eventuell notwendige Parameter
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// return String mit dem HTML-Code fuer das Script
function getScript(optSet, optParams = { }) {
    //const __SCRIPT = '<script type="text/javascript">function activateMenu() { console.log("TADAAA!"); }</script>';
    //const __SCRIPT = '<script type="text/javascript">\n\tfunction doActionNxt(key, value) { alert("SET " + key + " = " + value); }\n\tfunction doActionNxt(key, value) { alert("SET " + key + " = " + value); }\n\tfunction doActionRst(key, value) { alert("RESET"); }\n</script>';
    //const __FORM = '<form method="POST"><input type="button" id="showOpts" name="showOpts" value="Optionen anzeigen" onclick="activateMenu()" /></form>';
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
function addForm(anchor, form = "", script = "") {
    const __OLDFORM = __FORMS[anchor];
    const __REST = ((__OLDFORM === undefined) ? anchor.innerHTML :
                   anchor.innerHTML.substring(0, anchor.innerHTML.length - __OLDFORM.Script.length - __OLDFORM.Form.length));

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
function buildForm(anchor, optSet, optParams = { }) {
    __LOG[3]("buildForm()");

    const __FORM = getForm(optSet, optParams);
    const __SCRIPT = getScript(optSet, optParams);

    addForm(anchor, __FORM, __SCRIPT);
}

// ==================== Ende Abschnitt fuer Optionen auf der Seite ====================

// *** EOF ***

// ==UserScript==
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
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.menu.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.run.js
// ==/UserScript==

// ==================== Abschnitt fuer Aufbau und Start der Optionen ====================

// Initialisiert die Menue-Funktion einer Option
// optAction: Typ der Funktion
// item: Key der Option
// optSet: Platz fuer die gesetzten Optionen (und Config)
// optConfig: Konfiguration der Option
// return Funktion fuer die Option
function initOptAction(optAction, item = undefined, optSet = undefined, optConfig = undefined) {
    let fun;

    if (optAction !== undefined) {
        const __CONFIG = ((optConfig !== undefined) ? optConfig : getOptConfig(getOptByName(optSet, item)));
        const __RELOAD = getValue(getValue(__CONFIG, { }).ActionReload, true);

        switch (optAction) {
        case __OPTACTION.SET : fun = function() {
                                       return setOptByName(optSet, item, __CONFIG.SetValue, __RELOAD).catch(defaultCatch);
                                   };
                               break;
        case __OPTACTION.NXT : fun = function() {
                                       return promptNextOptByName(optSet, item, __CONFIG.SetValue, __RELOAD,
                                                  __CONFIG.FreeValue, __CONFIG.SelValue, __CONFIG.MinChoice).catch(defaultCatch);
                                   };
                               break;
        case __OPTACTION.RST : fun = function() {
                                       return resetOptions(optSet, __RELOAD).then(
                                               result => __LOG[3]("RESETTING (" + result + ")..."),
                                               defaultCatch);
                                   };
                               break;
        }
    }

    return fun;
}

// Gibt diese Config oder, falls 'Shared', ein Referenz-Objekt mit gemeinsamen Daten zurueck
// optConfig: Konfiguration der Option
// item: Key der Option
// return Entweder optConfig oder gemergete Daten auf Basis des in 'Shared' angegebenen Objekts
function getSharedConfig(optConfig, item = undefined) {
    let config = getValue(optConfig, { });
    const __SHARED = config.Shared;

    if (__SHARED !== undefined) {
        const __OBJREF = getSharedRef(__SHARED, item);  // Gemeinsame Daten

        if (getValue(__SHARED.item, '$') !== '$') {  // __OBJREF ist ein Item
            const __REF = valueOf(__OBJREF);

            config = { };  // Neu aufbauen...
            addProps(config, getOptConfig(__REF));
            addProps(config, optConfig);
            config.setConst('SharedData', getOptValue(__REF), false);   // Wert muss schon da sein, NICHT nachladen, sonst ggfs. Promise
        } else {  // __OBJREF enthaelt die Daten selbst
            if (! config.Name) {
                config.Name = __OBJREF.getPath();
            }
            config.setConst('SharedData', __OBJREF);  // Achtung: Ggfs. zirkulaer!
        }
    }

    return config;
}

// Initialisiert die gesetzten Optionen
// optConfig: Konfiguration der Optionen
// optSet: Platz fuer die gesetzten Optionen
// preInit: Vorinitialisierung einzelner Optionen mit 'PreInit'-Attribut
// return Gefuelltes Objekt mit den gesetzten Optionen
function initOptions(optConfig, optSet = undefined, preInit = undefined) {
    let value;

    if (optSet === undefined) {
        optSet = { };
    }

    Object.keys(optConfig).forEach(function(opt) {
        const __OPTCONFIG = optConfig[opt];
        const __PREINIT = getValue(__OPTCONFIG.PreInit, false, true);
        const __ISSHARED = getValue(__OPTCONFIG.Shared, false, true);

        if ((preInit === undefined) || (__PREINIT === preInit)) {
            const __CONFIG = getSharedConfig(__OPTCONFIG, opt);
            const __ALTACTION = getValue(__CONFIG.AltAction, __CONFIG.Action);
            // Gab es vorher einen Aufruf, der einen Stub-Eintrag erzeugt hat, und wurden Daten geladen?
            const __LOADED = ((preInit === false) && optSet[opt].Loaded);
            const __PROMISE = ((__LOADED || ! optSet[opt]) ? undefined : optSet[opt].Promise);
            const __VALUE = (__LOADED ? optSet[opt].Value : undefined);

            optSet[opt] = {
                'Item'      : opt,
                'Config'    : __CONFIG,
                'Loaded'    : (__ISSHARED || __LOADED),
                'Promise'   : __PROMISE,
                'Value'     : initOptValue(__CONFIG, __VALUE),
                'SetValue'  : __CONFIG.SetValue,
                'ReadOnly'  : (__ISSHARED || __CONFIG.ReadOnly),
                'Action'    : initOptAction(__CONFIG.Action, opt, optSet, __CONFIG),
                'AltAction' : initOptAction(__ALTACTION, opt, optSet, __CONFIG)
            };
        } else if (preInit) {  // erstmal nur Stub
            optSet[opt] = {
                'Item'      : opt,
                'Config'    : __OPTCONFIG,
                'Loaded'    : false,
                'Promise'   : undefined,
                'Value'     : initOptValue(__OPTCONFIG),
                'ReadOnly'  : (__ISSHARED || __OPTCONFIG.ReadOnly)
            };
        }
    });

    return optSet;
}

// ==================== Abschnitt fuer Klasse Classification ====================

// Basisklasse fuer eine Klassifikation der Optionen nach Kriterium (z.B. Erst- und Zweitteam oder Fremdteam)
function Classification() {
    'use strict';

    this.renameFun = prefixName;
    //this.renameParamFun = undefined;
    this.optSet = undefined;
    this.optSelect = { };
}

Class.define(Classification, Object, {
                    'renameOptions' : function() {
                                          const __PARAM = this.renameParamFun();

                                          if (__PARAM !== undefined) {
                                              // Klassifizierte Optionen umbenennen...
                                              return renameOptions(this.optSet, this.optSelect, __PARAM, this.renameFun);
                                          } else {
                                              return Promise.resolve();
                                          }
                                      },
                    'deleteOptions' : function(ignList) {
                                          const __OPTSELECT = addProps([], this.optSelect, null, ignList);

                                          return deleteOptions(this.optSet, __OPTSELECT, true, true);
                                      }
                });

// ==================== Ende Abschnitt fuer Klasse Classification ====================

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
    // buildMenu: showOptions
    // buildForm: showOptions

// Initialisiert die gesetzten Optionen und den Speicher und laedt die Optionen zum Start
// optConfig: Konfiguration der Optionen
// optSet: Platz fuer die gesetzten Optionen
// return Promise auf gefuelltes Objekt mit den gesetzten Optionen
async function startOptions(optConfig, optSet = undefined, classification = undefined) {
    optSet = initOptions(optConfig, optSet, true);  // PreInit

    // Memory Storage fuer vorherige Speicherung...
    myOptMemSize = getMemSize(myOptMem = await restoreMemoryByOpt(optSet.oldStorage));

    // Zwischengespeicherte Befehle auslesen...
    const __STOREDCMDS = getStoredCmds(myOptMem);

    // ... ermittelte Befehle ausfuehren...
    const __LOADEDCMDS = await runStoredCmds(__STOREDCMDS, optSet, true);  // BeforeLoad

    // Bisher noch nicht geladenene Optionen laden...
    await loadOptions(optSet);

    // Memory Storage fuer naechste Speicherung...
    myOptMemSize = getMemSize(myOptMem = startMemoryByOpt(optSet.storage, optSet.oldStorage));

    // Globale Daten ermitteln...
    initScriptDB(optSet);

    optSet = initOptions(optConfig, optSet, false);  // Rest

    if (classification !== undefined) {
        // Umbenennungen durchfuehren...
        await classification.renameOptions();
    }

    // ... ermittelte Befehle ausfuehren...
    await runStoredCmds(__LOADEDCMDS, optSet, false);  // Rest

    // Als globale Daten speichern...
    updateScriptDB(optSet);

    return optSet;
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
        buildMenu(optSet).then(() => __LOG[3]("Menu OK"));
    }

    // Anzeige auf der Seite...
    if ((optParams.menuAnchor !== undefined) && (myOptMem !== __OPTMEMINAKTIVE)) {
        buildForm(optParams.menuAnchor, optSet, optParams);
    }

    return optSet;
}

// ==================== Ende Abschnitt fuer Aufbau und Start der Optionen ====================

// *** EOF ***

//==UserScript==
//_name         OS2.list
//_namespace    http://os.ongapo.com/
//_version      0.10
//_copyright    2017+
//_author       Sven Loges (SLC)
//_description  JS-lib mit Funktionen und Utilities zu OS2-spezifischen Listen
//_require      https://eselce.github.io/OS2.scripts/lib/util.value.js
//_require      https://eselce.github.io/OS2.scripts/lib/OS2.list.js
//==/UserScript==

//==================== Abschnitt fuer interne IDs auf den Seiten ====================

const __GAMETYPENRN = {    // "Blind FSS gesucht!"
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

const __GAMETYPEALIASES = {
     'unbekannt'  :  "unbekannt",
     'reserviert' :  undefined,
     'Frei'       :  undefined,
     'spielfrei'  :  "",
     'Friendly'   :  "FSS",
     'Liga'       :  undefined,
     'LP'         :  "Pokal",
     'OSEQ'       :  undefined,
     'OSE'        :  undefined,
     'OSCQ'       :  undefined,
     'OSC'        :  undefined,
     'Supercup'   : "Super"
 };
const __GAMETYPES = reverseMapping(__GAMETYPENRN);

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
const __LIGATYPES = reverseMapping(__LIGANRN);

const __LANDNRN = {
     'unbekannt'              :   0,
     'Albanien'               :  45,
     'Andorra'                :  95,
     'Armenien'               :  83,
     'Aserbaidschan'          : 104,
     'Belgien'                :  12,
     'Bosnien-Herzegowina'    :  66,
     'Bulgarien'              :  42,
     'D\xE4nemark'            :   8,
     'Deutschland'            :   6,
     'England'                :   1,
     'Estland'                :  57,
     'Far\xF6er'              :  68,
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
     '\xD6sterreich'          :  14,
     'Polen'                  :  25,
     'Portugal'               :  17,
     'Rum\xE4nien'            :  28,
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
     'T\xFCrkei'              :  39,
     'Ukraine'                :  20,
     'Ungarn'                 :  26,
     'Wales'                  :   3,
     'Weissrussland'          :  71,
     'Zypern'                 :  38
 };
const __LAENDER = reverseMapping(__LANDNRN);

const __TLALAND = {
     undefined : 'unbekannt',
     'ALB'     : 'Albanien',
     'AND'     : 'Andorra',
     'ARM'     : 'Armenien',
     'AZE'     : 'Aserbaidschan',
     'BEL'     : 'Belgien',
     'BIH'     : 'Bosnien-Herzegowina',
     'BUL'     : 'Bulgarien',
     'DEN'     : 'D\xE4nemark',
     'GER'     : 'Deutschland',
     'ENG'     : 'England',
     'EST'     : 'Estland',
     'FRO'     : 'Far\xF6er',
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
     'AUT'     : '\xD6sterreich',
     'POL'     : 'Polen',
     'POR'     : 'Portugal',
     'ROM'     : 'Rum\xE4nien',
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
     'TUR'     : 'T\xFCrkei',
     'UKR'     : 'Ukraine',
     'HUN'     : 'Ungarn',
     'WAL'     : 'Wales',
     'BLR'     : 'Weissrussland',
     'CYP'     : 'Zypern'
 };
const __LANDTLAS = reverseMapping(__TLALAND);

//==================== Abschnitt fuer Daten des Spielplans ====================

//Gibt die ID fuer den Namen eines Wettbewerbs zurueck
//gameType: Name des Wettbewerbs eines Spiels
//defValue: Default-Wert
//return OS2-ID fuer den Spieltyp (1 bis 7 oder 10), 0 fuer "spielfrei"/"Frei"/"reserviert", -1 fuer ungueltig
function getGameTypeID(gameType, defValue = __GAMETYPENRN.unbekannt) {
 return getValue(__GAMETYPENRN[gameType], defValue);
}

//Gibt den Namen eines Wettbewerbs zurueck
//id: OS2-ID des Wettbewerbs eines Spiels (1 bis 7 oder 10), 0 fuer "spielfrei"/"Frei"/"reserviert", -1 fuer ungueltig
//defValue: Default-Wert
//return Spieltyp fuer die uebergebene OS2-ID
function getGameType(id, defValue) {
 return getValue(__GAMETYPES[id], defValue);
}

//Gibt den alternativen (Kurznamen) fuer den Namen eines Wettbewerbs zurueck
//gameType: Name des Wettbewerbs eines Spiels
//return Normalerweise den uebergebenen Parameter, in Einzelfaellen eine Kurzversion
function getGameTypeAlias(gameType) {
 return getValue(__GAMETYPEALIASES[gameType], getValue(gameType, __GAMETYPEALIASES.unbekannt));
}

//Gibt den Namen des Landes mit dem uebergebenen Kuerzel (TLA) zurueck.
//tla: Kuerzel (TLA) des Landes
//defValue: Default-Wert
//return Name des Landes, 'unbekannt' fuer undefined
function getLandName(tla, defValue = __TLALAND[undefined]) {
 return getValue(__TLALAND[tla], defValue);
}

//Gibt die ID des Landes mit dem uebergebenen Namen zurueck.
//land: Name des Landes
//defValue: Default-Wert
//return OS2-ID des Landes, 0 fuer ungueltig
function getLandNr(land, defValue = __LANDNRN.unbekannt) {
 return getValue(__LANDNRN[land], defValue);
}

//Gibt die ID der Liga mit dem uebergebenen Namen zurueck.
//land: Name der Liga
//defValue: Default-Wert
//return OS2-ID der Liga, 0 fuer ungueltig
function getLigaNr(liga, defValue = __LIGANRN.unbekannt) {
 return getValue(__LIGANRN[liga], defValue);
}

//Kehrt das Mapping eines Objekts um und liefert ein neues Objekt zurueck.
//obj: Objekt mit key => value
//convFun: Konvertierfunktion fuer die Werte
//return Neues Objekt mit value => key (doppelte value-Werte fallen heraus!)
function reverseMapping(obj, convFun) {
 if (! obj) {
     return obj;
 }

 const __RET = { };

 for (let key in obj) {
     const __VALUE = obj[key];

     __RET[__VALUE] = (convFun ? convFun(key) : key);
 }

 return __RET;
}

//==================== Ende Abschnitt fuer interne IDs auf den Seiten ====================

//Schaut nach, ob der uebergebene Index zu einem trainierbaren Skill gehoert
//Die Indizes gehen von 0 (SCH) bis 16 (EIN)
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

//Konvertiert einen Aufwertungstext fuer einen Skillnamen in den fuer einen Torwart
//name: Allgemeiner Skillname (abgeleitet von den Feldspielern)
//return Der konvertierte String (z.B. "FAN" statt "KOB") oder unveraendert
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

//Konvertiert die allgemeinen Skills in die eines Torwarts
//value: Ein Text, der die Skillnamen enthaelt
//return Der konvertierte String mit Aenderungen (z.B. "FAN" statt "KOB") oder unveraendert
function convertGoalieSkill(value) {
 if (value !== undefined) {
     value = value.replace(/\w+/g, getGoalieSkill);
 }

 return value;
}

//Gibt alle Skill-Namen zurueck
function getAllSkillNames(isGoalie = false) {
 if (isGoalie) {
     return [ 'ABS', 'STS', 'FAN', 'STB', 'SPL', 'REF', 'FUQ', 'ERF', 'AGG', 'PAS', 'AUS', 'UEB', 'WID', 'SEL', 'DIS', 'ZUV', 'EIN' ];
 } else {
     return [ 'SCH', 'BAK', 'KOB', 'ZWK', 'DEC', 'GES', 'FUQ', 'ERF', 'AGG', 'PAS', 'AUS', 'UEB', 'WID', 'SEL', 'DIS', 'ZUV', 'EIN' ];
 }
}

//Gibt den Skill-Namen zu einem Index zurueck
function getSkillName(idx, isGoalie = false) {
 const __ALLNAMES = getAllSkillNames(isGoalie);

 return __ALLNAMES[idx];
}

//Gibt den Skill-Namen zu einem Index-Array zurueck
function getSkillNameArray(idxArr, isGoalie = false) {
 return (idxArr ? idxArr.map(function(item) {
                                 return getSkillName(item, isGoalie);
                             }) : idxArr);
}

//Gibt die Indizes aller Skills zurueck
function getIdxAllSkills() {
 return [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
}

//Gibt die Indizes der trainierbaren Skills zurueck
function getIdxTrainableSkills() {
 return [ 0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 15 ];
}

//Gibt die Indizes der Fixskills zurueck
function getIdxFixSkills() {
 return [ 6, 7, 12, 13, 14, 16 ];
}

//Gibt die Indizes der Primaerskills zurueck
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

//Gibt die Indizes der (trainierbaren) Sekundaerskills zurueck
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

//Gibt die zur Position gehoerige Farbe zurueck
function getColor(pos) {
 switch (pos) {
     case 'TOR' : return "#FFFF00";
     case 'ABW' : return "#00FF00";
     case 'DMI' : return "#3366FF";
     case 'MIT' : return "#66FFFF";
     case 'OMI' : return "#FF66FF";
     case 'STU' : return "#FF0000";
     case 'LEI' : return "#FFFFFF";
     case "" :    return "#111166";  // osBlau
     default :    return "";
 }
}

//*** EOF ***

//==UserScript==
//_name         OS2.team
//_namespace    http://os.ongapo.com/
//_version      0.10
//_copyright    2017+
//_author       Sven Loges (SLC)
//_description  JS-lib mit OS2-spezifische Funktionen und Utilities zu Teams
//_require      https://eselce.github.io/OS2.scripts/lib/util.log.js
//_require      https://eselce.github.io/OS2.scripts/lib/util.prop.js
//_require      https://eselce.github.io/OS2.scripts/lib/util.class.js
//_require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
//_require      https://eselce.github.io/OS2.scripts/lib/util.option.run.js
//_require      https://eselce.github.io/OS2.scripts/lib/OS2.list.js
//_require      https://eselce.github.io/OS2.scripts/lib/OS2.team.js
//==/UserScript==

//==================== Abschnitt fuer Klasse TeamClassification ====================

//Klasse fuer die Klassifikation der Optionen nach Team (Erst- und Zweitteam oder Fremdteam)
function TeamClassification() {
 'use strict';

 Classification.call(this);

 this.team = undefined;
 this.teamParams = undefined;
}

Class.define(TeamClassification, Classification, {
                 'renameParamFun' : function() {
                                        const __MYTEAM = (this.team = getMyTeam(this.optSet, this.teamParams, this.team));

                                        if (__MYTEAM.LdNr) {
                                            // Prefix fuer die Optionen mit gesonderten Behandlung...
                                            return __MYTEAM.LdNr.toString() + '.' + __MYTEAM.LgNr.toString() + ':';
                                        } else {
                                            return undefined;
                                        }
                                    }
             });

//==================== Ende Abschnitt fuer Klasse TeamClassification ====================

//==================== Abschnitt fuer Klasse Team ====================

//Klasse fuer Teamdaten
function Team(team, land, liga) {
 'use strict';

 this.Team = team;
 this.Land = land;
 this.Liga = liga;
 this.LdNr = getLandNr(land);
 this.LgNr = getLigaNr(liga);
}

Class.define(Team, Object, {
                 '__TEAMITEMS' : {   // Items, die in Team als Teamdaten gesetzt werden...
                                     'Team' : true,
                                     'Liga' : true,
                                     'Land' : true,
                                     'LdNr' : true,
                                     'LgNr' : true
                                 }
             });

//==================== Ende Abschnitt fuer Klasse Team ====================

//==================== Abschnitt fuer Klasse Verein ====================

//Klasse fuer Vereinsdaten
function Verein(team, land, liga, id, manager, flags) {
 'use strict';

 Team.call(this, team, land, liga);

 this.ID = id;
 this.Manager = manager;
 this.Flags = (flags || []);
}

Class.define(Verein, Team, {
                 '__TEAMITEMS' : {   // Items, die in Verein als Teamdaten gesetzt werden...
                                     'Team'    : true,
                                     'Liga'    : true,
                                     'Land'    : true,
                                     'LdNr'    : true,
                                     'LgNr'    : true,
                                     'ID'      : true,
                                     'Manager' : true,
                                     'Flags'   : true
                                 }
             });

//==================== Ende Abschnitt fuer Klasse Verein ====================

//==================== Abschnitt zu Teamdaten ====================

//Gibt die Teamdaten zurueck und aktualisiert sie ggfs. in der Option
//optSet: Platz fuer die gesetzten Optionen
//teamParams: Dynamisch ermittelte Teamdaten ('Team', 'Liga', 'Land', 'LdNr' und 'LgNr')
//myTeam: Objekt fuer die Teamdaten
//return Die Teamdaten oder undefined bei Fehler
function getMyTeam(optSet = undefined, teamParams = undefined, myTeam = new Team()) {
 if (teamParams !== undefined) {
     addProps(myTeam, teamParams, myTeam.__TEAMITEMS);
     __LOG[2]("Ermittelt: " + safeStringify(myTeam));
     // ... und abspeichern, falls erweunscht...
     if (optSet && optSet.team) {
         setOpt(optSet.team, myTeam, false);
     }
 } else {
     const __TEAM = ((optSet && optSet.team) ? getOptValue(optSet.team) : undefined);  // Gespeicherte Parameter

     if ((__TEAM !== undefined) && (__TEAM.Land !== undefined)) {
         addProps(myTeam, __TEAM, myTeam.__TEAMITEMS);
         __LOG[2]("Gespeichert: " + safeStringify(myTeam));
     } else {
         __LOG[4]("Team nicht ermittelt: " + safeStringify(__TEAM));
     }
 }

 return myTeam;
}

//==================== Ende Abschnitt zu Teamdaten ====================

//*** EOF ***

//==UserScript==
//_name         OS2.page
//_namespace    http://os.ongapo.com/
//_version      0.10
//_copyright    2017+
//_author       Sven Loges (SLC)
//_description  JS-lib mit OS2-spezifische Funktionen zur Ermittlung von Daten auf den Seiten
//_require      https://eselce.github.io/OS2.scripts/lib/OS2.page.js
//==/UserScript==

//ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

//==================== Abschnitt fuer Parameter von den OS2-Seiten ====================

//Verarbeitet die URL der Seite und ermittelt die Nummer der gewuenschten Unterseite
//url: Adresse der Seite
//leafs: Liste von Filenamen mit der Default-Seitennummer (falls Query-Parameter nicht gefunden)
//item: Query-Parameter, der die Nummer der Unterseite angibt
//return Parameter aus der URL der Seite als Nummer
function getPageIdFromURL(url, leafs, item = 'page') {
 const __URI = new URI(url);
 const __LEAF = __URI.getLeaf();

 for (let leaf in leafs) {
     if (__LEAF === leaf) {
         const __DEFAULT = leafs[leaf];

         return getValue(__URI.getQueryPar(item), __DEFAULT);
     }
 }

 return -1;
}

//Gibt die laufende Nummer des ZATs im Text einer Zelle zurueck
//cell: Tabellenzelle mit der ZAT-Nummer im Text
//return ZAT-Nummer im Text
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

//Ermittelt das Spiel-Ergebnis aus einer Tabellenzelle, etwa "2 : 1", und liefert zwei Werte zurueck
//cell: Tabellenzelle mit Eintrag "2 : 1"
//return { '2', '1' } im Beispiel
function getErgebnisFromCell(cell) {
 const __ERGEBNIS = cell.textContent.split(" : ", 2);

 return __ERGEBNIS;
}

//Ermittelt das Spiel-Ergebnis aus einer Tabellenzelle und setzt tore/gtore im Spielplanzeiger
//currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT
//cell: Tabellenzelle mit Eintrag "2 : 1"
//return Modifizierter Spielplanzeiger
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

//==================== Ende Abschnitt fuer Parameter von den OS2-Seiten ====================

//*** EOF ***

// ==================== Ende Abschnitt fuer Inline-Versionen der @requires ====================

// ==================== Konfigurations-Abschnitt fuer Optionen ====================

const __LOGLEVEL = 3;

// Moegliche Optionen (hier die Standardwerte editieren oder ueber das Benutzermenu setzen):
const __OPTCONFIG = {
    'sepStyle' : {        // Stil der Trennlinie
                   'Name'      : "sepStyle",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'Choice'    : [ 'solid', 'hidden', 'dotted', 'dashed', 'double', 'groove', 'ridge',
                                   'inset', 'outset', 'none' ],
//                   'Default'   : 'dashed',
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Stil: $",
                   'Hotkey'    : 'l',
                   'FormLabel' : "Stil:|$"
               },
    'sepColor' : {        // Farbe der Trennlinie
                   'Name'      : "sepColor",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'FreeValue' : true,
                   'Choice'    : [ 'white', 'yellow', 'black', 'blue', 'cyan', 'gold', 'grey', 'green',
                                   'lime', 'magenta', 'maroon', 'navy', 'olive', 'orange', 'purple',
                                   'red', 'teal', 'transparent' ],
//                   'Default'   : 'red',
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Farbe: $",
                   'Hotkey'    : 'F',
                   'FormLabel' : "Farbe:|$"
               },
    'sepWidth' : {        // Dicke der Trennlinie
                   'Name'      : "sepWidth",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'FreeValue' : true,
                   'Choice'    : [ 'thin', 'medium', 'thick' ],
//                   'Default'   : '3px',
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Dicke: $",
                   'Hotkey'    : 'D',
                   'FormLabel' : "Dicke:|$"
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

// Gesetzte Optionen (wird von initOptions() angelegt und von loadOptions() gefuellt):
const __OPTSET = { };

// Logging initialisieren mit Loglevel (siehe ganz oben im Konfigurationsabschnitt)...
__LOG.init(window, __LOGLEVEL);

// Teamparameter fuer getrennte Speicherung der Optionen fuer Erst- und Zweitteam...
const __TEAMCLASS = new TeamClassification();

// Optionen mit Daten, die ZAT- und Team-bezogen gemerkt werden...
__TEAMCLASS.optSelect = { };

// Behandelt die Optionen und laedt das Benutzermenu
// optConfig: Konfiguration der Optionen
// optSet: Platz fuer die gesetzten Optionen
// optParams: Eventuell notwendige Parameter zur Initialisierung
// 'hideMenu': Optionen werden zwar geladen und genutzt, tauchen aber nicht im Benutzermenu auf
// 'teamParams': Getrennte Daten-Option wird genutzt, hier: Team() mit 'LdNr'/'LgNr' des Erst- bzw. Zweitteams
// 'menuAnchor': Startpunkt fuer das Optionsmenu auf der Seite
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// 'formWidth': Anzahl der Elemente pro Zeile
// 'formBreak': Elementnummer des ersten Zeilenumbruchs
// return Promise auf gefuelltes Objekt mit den gesetzten Optionen
function buildOptions(optConfig, optSet = undefined, optParams = { 'hideMenu' : false }) {
    // Klassifikation ueber Land und Liga des Teams...
    __TEAMCLASS.optSet = optSet;  // Classification mit optSet verknuepfen
    __TEAMCLASS.teamParams = optParams.teamParams;  // Ermittelte Parameter

    return startOptions(optConfig, optSet, __TEAMCLASS).then(function(optSet) {
                    return showOptions(optSet, optParams);
                }, defaultCatch);
}

// ==================== Ende Abschnitt fuer Optionen ====================

//==================== Abschnitt fuer Chat-Operationen ====================

// Ersetzt URLs im Chat durch Links zu diesen Adressen.
// Es wird 'https:', 'http:', 'www.', 'youtu.be/', 'os.ongapo.com/' und 'online-soccer.eu/' erkannt.
// rows: Array von HTML-Zeilen
function patchLinks(rows) {
    for (let row of rows) {
        const __LINE = getValue(row.innerHTML, "");
        const __NB = "</b> ";
        const __NBLEN = __NB.length;
        const __NBPOS = __LINE.indexOf(__NB);
        const __POS = (Boolean(~ __NBPOS) ? (__NBPOS + __NBLEN) : 0);
        const __LABEL = __LINE.substring(0, __POS);
        let text = __LINE.substring(__POS);

        if (__POS) {
            let pos2 = 0;
            let pos1;

            while (pos2 < text.length) {
                pos1 = (text.indexOf('https:', pos2) + 1) || (text.indexOf('http:', pos2) + 1) || (text.indexOf('www.', pos2) + 1) || (text.indexOf('youtu.be/', pos2) + 1) || (text.indexOf('os.ongapo.com/', pos2) + 1) || (text.indexOf('online-soccer.eu/', pos2) + 1);
                if (pos1) {
                    pos2 = (text.indexOf(' ', pos1) + 1) || (text.length + 1);

                    const __TARGET = text.substring(pos1 - 1, pos2 - 1);
                    const __URL = (__TARGET.startsWith('http') ? "" : 'https://') + __TARGET;
                    const __SUBST = '<A HREF="' + __URL + '" TARGET="_new">' + __TARGET + '</A>';

                    __LOG[0](pos1, pos2, text.substr(pos1 - 2, 1), pos1 + __SUBST.length, __TARGET, __SUBST);

                    if ((pos1 < 2) || ((text.substr(pos1 - 2, 1) !== '"') && (text.substr(pos1 - 2, 1) !== '>'))) {
                        text = text.substring(0, pos1 - 1) + __SUBST + text.substring(pos2 - 1);

                        pos2 = pos1 + __SUBST.length;
                    }

                    __LOG[1](text);
                } else {
                    pos2 = text.length;
                }
            }

            row.innerHTML = __LABEL + text;
        }
    }
}

//==================== Ende Abschnitt fuer Chat-Operationen ====================

//==================== Hauptprogramm ====================

// Verarbeitet Ansicht "mainchat.net"
function procChat() {
    const __WPARENT = parent.wrappedJSObject;
    const __WCHAT = __WPARENT && __WPARENT.chat;
  
    if (__WCHAT && (__WCHAT.document === undefined)) {
        __LOG[2]("Diese Seite ist ohne Chat nicht verf\u00FCgbar!");
    } else {
        return buildOptions(__OPTCONFIG, __OPTSET, {
                                'menuAnchor' : getTable(1, 'table'),
                                'hideForm'   : {
                                                   'sepStyle'      : true,
                                                   'sepColor'      : true,
                                                   'sepWidth'      : true
                                               },
                                'formWidth'  : 1
                            }).then(function(optSet) {
                const __DOC = __WCHAT.document;
                const __BODY = getTable(0, 'body', __DOC);
                const __CHAT = __DOC.getElementsByTagName('font');

                // Format der Trennlinie...
                const __BORDERSTRING = getOptValue(__OPTSET.sepStyle) + ' ' + getOptValue(__OPTSET.sepColor) + ' ' + getOptValue(__OPTSET.sepWidth);

                __BODY.style.border = __BORDERSTRING;

                patchLinks(__CHAT);
            });
    }

    // Promise fuer alle Faelle ohne Rueckgabewert...
    return Promise.resolve();
}

(() => {
    (async () => {
        try {
            await procChat().catch(defaultCatch);

            return 'OK';
        } catch (ex) {
            return defaultCatch(ex);
        }
    })().then(function(rc) {
            __LOG[1]('SCRIPT END', __DBMOD.Name, '(' + rc + ')');
        });
})();

// *** EOF ***
