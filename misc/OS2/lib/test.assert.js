// ==UserScript==
// _name         test.assert
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit ASSERT-Funktionen aller Art und AssertFailed
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse AssertionFailed ====================

// Basisklasse fuer eine spezielle Exception fuer Assertions
// whatFailed: Info, was schief lief
// msg: Text oder Text liefernde Funktion
// thisArg: Referenz auf ein Bezugsobjekt
// params: ggfs. Parameter fuer die msg-Funktion
function AssertionFailed(whatFailed, msg, thisArg, ...params) {
    //'use strict';

    if (msg === undefined) {
        this.text = "";
    } else if (typeof msg === 'function') {
        const __TEXT = msg.call(thisArg, ...params);

        this.text = ((__TEXT === undefined) ? __TEXT : String(__TEXT));
    } else {
        this.text = String(msg);
    }

    if (whatFailed) {
        this.text += " (" + whatFailed + ')';
    }
}

Class.define(AssertionFailed, Object, {
                  'getText'       : function() {
                                        return this.text;
                                    }
    });

// ==================== Ende Abschnitt fuer Klasse AssertionFailed ====================

// ==================== Abschnitt fuer ASSERT-Testfunktion ====================

// Basisfunktion fuer die Durchfuehrung einer Ueberpruefung einer Bedingung
// test: Bedingung, die als wahr angenommen wird
// whatFailed: Info, was schief lief fuer den Fall einer Diskrepanz
// msg: Text oder Text liefernde Funktion fuer den Fall einer Diskrepanz
// thisArg: Referenz auf ein Bezugsobjekt
// params: ggfs. Parameter fuer die msg-Funktion
// throw Wirft dann AssertionFailed-Exception mit diesem Text
// return true, da in diesem Fall keine Exception geworfen wurde!
const ASSERT = function(test, whatFailed, msg, thisArg, ...params) {
    //'use strict';

    if (! test) {
        const __FAIL = new AssertionFailed(whatFailed, msg, thisArg, ...params);
        __LOG[3]("FAIL", __FAIL);

        throw __FAIL;
    } else {
        __LOG[6]("OK", test);
    }

    return true;
};


// Basisfunktion fuer die Durchfuehrung einer Ueberpruefung einer Fehler-Bedingung
// test: Bedingung, die als falsch angenommen wird
// whatFailed: Info, was schief lief fuer den Fall einer Uebereinstimmung
// msg: Text oder Text liefernde Funktion fuer den Fall einer Uebereinstimmung
// thisArg: Referenz auf ein Bezugsobjekt
// params: ggfs. Parameter fuer die msg-Funktion
// throw Wirft dann AssertionFailed-Exception mit diesem Text
// return true, da in diesem Fall keine Exception geworfen wurde!
const ASSERT_NOT = function(test, whatFailed, msg, thisArg, ...params) {
    return ASSERT(! test, whatFailed, msg, thisArg, ...params);
}

// ==================== Ende Abschnitt fuer ASSERT ====================

// ==================== Abschnitt fuer sonstige ASSERT-Funktionen ====================

const ASSERT_TRUE = function(test, msg, thisArg, ...params) {
    return ASSERT(test, "false", msg, thisArg, ...params);
}

const ASSERT_NOT_TRUE = function(test, msg, thisArg, ...params) {
    return ASSERT(! test, "true", msg, thisArg, ...params);
}

const ASSERT_NULL = function(test, msg, thisArg, ...params) {
    return ASSERT(test === null, getValStr(test, false, true, true, true) + " !== null", msg, thisArg, ...params);
}

const ASSERT_NOT_NULL = function(test, msg, thisArg, ...params) {
    return ASSERT(test !== null, getValStr(test, false, true, true, true) + " === null", msg, thisArg, ...params);
}

const ASSERT_SET = function(test, msg, thisArg, ...params) {
    return ASSERT(test != undefined, getValStr(test, false, true, true, true) + " == undefined", msg, thisArg, ...params);
}

const ASSERT_NOT_SET = function(test, msg, thisArg, ...params) {
    return ASSERT(test == undefined, getValStr(test, false, true, true, true) + " != undefined", msg, thisArg, ...params);
}

const ASSERT_EQUAL = function(erg, exp, msg, thisArg, ...params) {
    return ASSERT(getValStr(erg, false, true, true, true) === getValStr(exp, false, true, true, true), getValStr(erg, false, true, true, true) + " !== " + getValStr(exp, false, true, true, true), msg, thisArg, ...params);
}

const ASSERT_NOT_EQUAL = function(erg, exp, msg, thisArg, ...params) {
    return ASSERT(getValStr(erg, false, true, true, true) !== getValStr(exp, false, true, true, true), getValStr(erg, false, true, true, true) + " === " + getValStr(exp, false, true, true, true), msg, thisArg, ...params);
}

const ASSERT_ALIKE = function(erg, exp, msg, thisArg, ...params) {
    return ASSERT(erg == exp, getValStr(erg, false, true, true, true) + " != " + getValStr(exp, false, true, true, true), msg, thisArg, ...params);
}

const ASSERT_NOT_ALIKE = function(erg, exp, msg, thisArg, ...params) {
    return ASSERT(erg != exp, getValStr(erg, false, true, true, true) + " == " + getValStr(exp, false, true, true, true), msg, thisArg, ...params);
}

const ASSERT_IN_DELTA = function(erg, exp, delta, msg, thisArg, ...params) {
    return ASSERT(Math.abs(erg - exp) <= delta, getValStr(erg, false, true, true, true) + " != " + getValStr(exp, false, true, true, true) + " +/- " + delta, msg, thisArg, ...params);
}

const ASSERT_NOT_IN_DELTA = function(erg, exp, delta, msg, thisArg, ...params) {
    return ASSERT(Math.abs(erg - exp) > delta, getValStr(erg, false, true, true, true) + " == " + getValStr(exp, false, true, true, true) + " +/- " + delta, msg, thisArg, ...params);
}

const ASSERT_INSTANCEOF = function(obj, cls, msg, thisArg, ...params) {
    return ASSERT((obj instanceof cls), getValStr(obj, false, true, true, true) + " ist kein " + getValStr(cls, false, true, true, true), msg, thisArg, ...params);
}

const ASSERT_NOT_INSTANCEOF = function(obj, cls, msg, thisArg, ...params) {
    return ASSERT_NOT((obj instanceof cls), getValStr(obj, false, true, true, true) + " ist " + getValStr(cls, false, true, true, true), msg, thisArg, ...params);
}

const ASSERT_MATCH = function(str, pattern, msg, thisArg, ...params) {
    return ASSERT((str || "").match(pattern), getValStr(str, false, true, true, true) + " match-t " + getValStr(pattern, false, true, true, true), msg, thisArg, ...params);
}

const ASSERT_NOT_MATCH = function(str, pattern, msg, thisArg, ...params) {
    return ASSERT_NOT((str || "").match(pattern), getValStr(str, false, true, true, true) + " match-t nicht " + getValStr(pattern, false, true, true, true), msg, thisArg, ...params);
}

// ==================== Ende Abschnitt fuer sonstige ASSERT-Funktionen ====================

// ==================== Abschnitt fuer globale Variablen ====================

// Parameter fuer ASSERT_IN_DELTA und ASSERT_NOT_IN_DELTA (Float-Genauigkeit)...
const __ASSERTDELTA = 0.000001;

// ==================== Ende Abschnitt fuer globale Variablen ====================

// ==================== Abschnitt fuer detaillierte Ausgabe von Daten (auszulagern) ====================

// Fuehrt eine Map-Function auf ein Object aus und liefert ein neues Objekt zurueck.
// Zusaetzlich kann die Auswahl der Elemente per Filter eingeschraenkt werden sowie
// das Ergebnis sortiert (Default nach Wert, aber auch nach Schluessel).
// obj: Das Object, das gemappt wird
// mapFun: Eine Mapping-Funktion (value [, key [, index [, array]]])
// - value: Wert
// - key: Schluessel
// - index: lfd. Nummer des Eintrags
// - array: entries() des Objekts obj
// | Alternativ Ein zu setzender Wert (keine Funktion)
// thisArg: Wert, der als this verwendet wird, wenn mapFun, filterFun und sortFun ausgeführt werden (Default: obj)
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
Object.map = function(obj, mapFun, thisArg, filterFun, sortFun) {
    if (! obj) {
        __LOG[4]("Object.map():", "Keine Aktion bei leerem Objekt", obj);

        return obj;
    } else if ((typeof obj) === 'object') {
        const __THIS = (thisArg || obj);
        const __MAPFUN = (((typeof mapFun) === 'function')
                          ? (([key, value], index) => [key, mapFun.call(__THIS, value, key, index, __FILTERARR)])
                          : (([key, value]) => [key, mapFun]));
        const __FILTERFUN = ((filterFun == undefined)
                             ? (element => true)
                             : (((typeof filterFun) === 'function')
                                ? (([key, value], index) => [key, filterFun.call(__THIS, value, key, index, __ARR)])
                                : (([key, value]) => (value == filterFun))));
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

//
// Hilfsfunktionen, die von Options.toString() genutzt werden
//

function getClass(obj) {
    if (obj != undefined) {
        if (typeof obj === 'object') {
            if (obj.getClass) {
                return obj.getClass();
            }
        }
    }

    return undefined;
}

function getClassName(obj) {
    const __CLASS = getClass(obj);

    return ((__CLASS ? __CLASS.className : undefined));  // __CLASS.getName() problematisch?
}

function getObjInfo(obj, keyStrings, longForm, stepIn) {
    const __TYPEOF = typeof obj;
    const __VALUEOF = Object.valueOf(obj);
    const __LENGTH = ((obj != undefined) ? ((__TYPEOF === 'object') ? Object.entries(obj) : obj).length : obj);
    const __STRDELIM1 = (keyStrings ? "'" : '"');
    const __STRDELIM2 = (keyStrings ? "'" : '"');
    const __NUMDELIM1 = (keyStrings ? "" : '<');
    const __NUMDELIM2 = (keyStrings ? "" : '>');
    const __SPACE = (keyStrings ? "" : ' ');
    const __ARRDELIM = ',' + __SPACE;
    const __ARRDELIM1 = '[';
    const __ARRDELIM2 = ']';
    const __OBJSETTER = __SPACE + ':' + __SPACE;
    const __OBJDELIM = ',' + __SPACE;
    const __OBJDELIM1 = '{';
    const __OBJDELIM2 = '}';
    const __LENSTR = ((__LENGTH !== undefined) ? __ARRDELIM1 + __LENGTH + __ARRDELIM2 : "")
    const __VALUESTR = String(obj);
    let typeStr = __TYPEOF;
    let valueStr = __VALUESTR;

    switch (__TYPEOF) {
    case 'undefined' : break;
    case 'string'    : typeStr = 'String';
                       valueStr = __STRDELIM1 + valueStr + __STRDELIM2;
                       break;
    case 'boolean'   : typeStr = 'Boolean';
                       break;
    case 'number'    : if (Number.isInteger(obj)) {
                           typeStr = 'Integer';
                       } else {
                           typeStr = 'Number';
                           valueStr = __NUMDELIM1 + valueStr + __NUMDELIM2;
                       }
                       break;
    case 'function'  : break;
    case 'object'    : if (Array.isArray(obj)) {
                           const __VALSTR = (__LENGTH ? obj.map(item => getValStr(item, false, stepIn, longForm, stepIn)).join(__ARRDELIM) : "");

                           typeStr = 'Array';
                           valueStr = __ARRDELIM1 + (__LENGTH ? __SPACE + __VALSTR + __SPACE : "") + __ARRDELIM2;
                       } else {
                           const __CLASS = getClass(obj);
                           const __CLASSNAME = (__CLASS ? getClassName(obj) : "");
                           const __VALSTR = (__LENGTH ? Object.values(Object.map(obj, (value, key) => (getValStr(key, true) + __OBJSETTER
                                            + getValStr(value, false, stepIn, longForm, stepIn)))).join(__OBJDELIM) : "");

                           typeStr = (__CLASSNAME ? __CLASSNAME : typeStr);
                           valueStr = (__CLASSNAME ? __CLASSNAME + __SPACE : "") + __OBJDELIM1 + (__LENGTH ? __SPACE + __VALSTR + __SPACE : "") + __OBJDELIM2;
                       }
    default :          break;
    }

    if (obj == undefined) {
        if (obj === undefined) {  // sic!
            valueStr = "";
        } else {  // null o.ä.
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

function getValStr(obj, keyStrings, showType, showLen, stepIn) {
    const [ __TYPESTR, __VALUESTR ] = getObjInfo(obj, keyStrings, showLen, stepIn);

    return (showType ? __TYPESTR + ' ' : "") + __VALUESTR;
}

// ==================== Abschnitt fuer detaillierte Ausgabe von Daten (auszulagern) ====================

// *** EOF ***
