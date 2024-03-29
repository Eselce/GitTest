// ==UserScript==
// _name         test.assert
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit ASSERT-Funktionen aller Art und AssertFailed
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
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

/*class*/ function AssertionFailed /*{
    constructor*/(whatFailed, msg, thisArg, ... params) {
        //'use strict';
        const __THIS = (thisArg || this);

        if (msg === undefined) {
            this.message = "";
        } else if ((typeof msg) === 'function') {
            const __TEXT = msg.apply(__THIS, params);

            this.message = String(__TEXT);
        } else {
            this.message = String(msg);
        }

        if (whatFailed) {
            this.message += " (" + whatFailed + ')';
        }
    }
//}

Class.define(AssertionFailed, Object, {
                  'getTextMessage'    : function() {
                                            return this.message;
                                        }
    });

// ==================== Ende Abschnitt fuer Klasse AssertionFailed ====================

// ==================== Abschnitt fuer Error-Handling ====================

// Assertion-Callback-Funktion fuer onRejected, also abgefangener Fehler
// in einer Promise bei Exceptions oder Fehler bzw. Rejections innerhalb einer Assertion
// error: Parameter von reject() im Promise-Objekt, der von Promise.catch() erhalten wurde
// attribs: Weitere Attribute in Objekten, die im error vermerkt werden
// return Liefert eine Assertion und die showAlert()-Parameter zurueck
function assertionCatch(error, ... attribs) {
    // Sichern, dass error belegt ist (wie etwa bei GMs 'reject();' in 'GM_setValue())'...
    if (error === undefined) {
        error = Error("Promise rejected!");
    }

    try {
        const __ISOBJ = ((typeof error) === 'object');  // Error-Objekt (true) oder skalarer Rueckgabewert (false)?
        const __CODELINE = codeLineFor(error, true, false, true, false);

        //__LOG[9]("CODELINE:", __CODELINE);

        const __MATCH = __CODELINE.match(/(.*?):(\d+(?::\d+)?)/);

        if (! __CODELINE) {
            __LOG[1]('assertionCatch():', "codeLine() is empty for error", error);
        }

        const __LINECOLNUMBER = (__CODELINE ? __MATCH[2] : null);
        const __LINENUM = (error.lineNumber || __LINECOLNUMBER);
        const __LABEL = `[${__LINENUM}] ${__DBMOD.Name}`;
        const __ERROR = (__ISOBJ ? Object.assign(error, ... attribs) : error);
        const __RET = showException(__LABEL, __ERROR, false);

        UNUSED(__RET);
        //ASSERT(false, "Promise rejected!", __RET);  // TODO

        return Promise.reject(__ERROR);
    } catch (ex) {
        const __SILENT = (ex instanceof AssertionFailed);

        if (__SILENT) {
            __LOG[1]("ASSERTIONCATCH!!!", ex);  // TODO!!!
        }

        return defaultCatch(ex, ! __SILENT);
    }
}

// ==================== Ende Abschnitt fuer Error-Handling ====================

// ==================== Abschnitt fuer ASSERT-Testfunktion ====================

// Basisfunktion fuer die Durchfuehrung einer Ueberpruefung einer Bedingung
// test: Bedingung, die als wahr angenommen wird
// whatFailed: Info, was schief lief fuer den Fall einer Diskrepanz
// msg: Text oder Text liefernde Funktion fuer den Fall einer Diskrepanz
// thisArg: Referenz auf ein Bezugsobjekt
// params: ggfs. Parameter fuer die msg-Funktion
// throw Wirft dann AssertionFailed-Exception mit diesem Text
// return true, da in diesem Fall keine Exception geworfen wurde!
const ASSERT = function(test, whatFailed, msg, thisArg, ... params) {
    //'use strict';

    if (! test) {
        const __FAIL = new AssertionFailed(whatFailed, msg, thisArg, ... params);

        __FAIL.codeLine = codeLine(false, true, 2, true);
        __LOG[4]("FAIL", __LOG.info(__FAIL, true, true));

        throw __FAIL;
    } else {
        __LOG[8]("OK", test, codeLine(false, true, 2, false), "(NOT " + whatFailed + ')');
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
const ASSERT_NOT = function(test, whatFailed, msg, thisArg, ... params) {
    return ASSERT(! test, whatFailed, msg, thisArg, ... params);
}

// ==================== Ende Abschnitt fuer ASSERT ====================

// ==================== Abschnitt fuer sonstige ASSERT-Funktionen ====================

const ASSERT_TRUE = function(test, msg, thisArg, ... params) {
    return ASSERT(test === true, __LOG.info(test, true, true) + " !== true", msg, thisArg, ... params);
}

const ASSERT_FALSE = function(test, msg, thisArg, ... params) {
    return ASSERT(test === false, __LOG.info(test, true, true) + " !== false", msg, thisArg, ... params);
}

const ASSERT_NULL = function(test, msg, thisArg, ... params) {
    return ASSERT(test === null, __LOG.info(test, true, true) + " !== null", msg, thisArg, ... params);
}

const ASSERT_NOT_NULL = function(test, msg, thisArg, ... params) {
    return ASSERT(test !== null, __LOG.info(test, true, true) + " === null", msg, thisArg, ... params);
}

const ASSERT_ZERO = function(test, msg, thisArg, ... params) {
    return ASSERT(test === 0, __LOG.info(test, true, true) + " !== 0", msg, thisArg, ... params);
}

const ASSERT_NOT_ZERO = function(test, msg, thisArg, ... params) {
    return ASSERT(test !== 0, __LOG.info(test, true, true) + " === 0", msg, thisArg, ... params);
}

const ASSERT_ONE = function(test, msg, thisArg, ... params) {
    return ASSERT(test === 1, __LOG.info(test, true, true) + " !== 1", msg, thisArg, ... params);
}

const ASSERT_NOT_ONE = function(test, msg, thisArg, ... params) {
    return ASSERT(test !== 1, __LOG.info(test, true, true) + " === 1", msg, thisArg, ... params);
}

const ASSERT_SET = function(test, msg, thisArg, ... params) {
    return ASSERT(test != null, __LOG.info(test, true, true) + " == null", msg, thisArg, ... params);
}

const ASSERT_NOT_SET = function(test, msg, thisArg, ... params) {
    return ASSERT(test == null, __LOG.info(test, true, true) + " != null", msg, thisArg, ... params);
}

const ASSERT_EQUAL = function(erg, exp, msg, thisArg, ... params) {
    return ASSERT(__LOG.info(erg, true, true) === __LOG.info(exp, true, true), __LOG.info(erg, true, true) + " !== " + __LOG.info(exp, true, true), msg, thisArg, ... params);
}

const ASSERT_NOT_EQUAL = function(erg, exp, msg, thisArg, ... params) {
    return ASSERT(__LOG.info(erg, true, true) !== __LOG.info(exp, true, true), __LOG.info(erg, true, true) + " === " + __LOG.info(exp, true, true), msg, thisArg, ... params);
}

const ASSERT_ALIKE = function(erg, exp, msg, thisArg, ... params) {
    return ASSERT(erg == exp, __LOG.info(erg, true, true) + " != " + __LOG.info(exp, true, true), msg, thisArg, ... params);
}

const ASSERT_NOT_ALIKE = function(erg, exp, msg, thisArg, ... params) {
    return ASSERT(erg != exp, __LOG.info(erg, true, true) + " == " + __LOG.info(exp, true, true), msg, thisArg, ... params);
}

const ASSERT_LESS = function(erg, exp, msg, thisArg, ... params) {
    return ASSERT(erg < exp, __LOG.info(erg, true, true) + " >= " + __LOG.info(exp, true, true), msg, thisArg, ... params);
}

const ASSERT_NOT_LESS = function(erg, exp, msg, thisArg, ... params) {
    return ASSERT(erg >= exp, __LOG.info(erg, true, true) + " < " + __LOG.info(exp, true, true), msg, thisArg, ... params);
}

const ASSERT_GREATER = function(erg, exp, msg, thisArg, ... params) {
    return ASSERT(erg > exp, __LOG.info(erg, true, true) + " <= " + __LOG.info(exp, true, true), msg, thisArg, ... params);
}

const ASSERT_NOT_GREATER = function(erg, exp, msg, thisArg, ... params) {
    return ASSERT(erg <= exp, __LOG.info(erg, true, true) + " > " + __LOG.info(exp, true, true), msg, thisArg, ... params);
}

const ASSERT_IN_DELTA = function(erg, exp, delta, msg, thisArg, ... params) {
    checkType(erg, 'number', true, 'ASSERT_IN_DELTA', "erg", 'Number');
    checkType(exp, 'number', true, 'ASSERT_IN_DELTA', "exp", 'Number');

    return ASSERT(Math.abs(erg - exp) <= delta, __LOG.info(erg, true, true) + " != " + __LOG.info(exp, true, true) + " +/- " + delta, msg, thisArg, ... params);
}

const ASSERT_NOT_IN_DELTA = function(erg, exp, delta, msg, thisArg, ... params) {
    checkType(erg, 'number', true, 'ASSERT_NOT_IN_DELTA', "erg", 'Number');
    checkType(exp, 'number', true, 'ASSERT_NOT_IN_DELTA', "exp", 'Number');

    return ASSERT(Math.abs(erg - exp) > delta, __LOG.info(erg, true, true) + " == " + __LOG.info(exp, true, true) + " +/- " + delta, msg, thisArg, ... params);
}

const ASSERT_IN_EPSILON = function(erg, exp, scale = 1, epsilon = __ASSERTEPSILON, msg, thisArg, ... params) {
    checkType(erg, 'number', true, 'ASSERT_IN_EPSILON', "erg", 'Number');
    checkType(exp, 'number', true, 'ASSERT_IN_EPSILON', "exp", 'Number');

    const __EPSILON = scale * epsilon;
    const __PROZENT = 100 * __EPSILON;
    const __DELTA = ((exp === 0.0) ? 1.0 : Math.abs(exp)) * __EPSILON;

    return ASSERT(Math.abs(erg - exp) <= __DELTA, __LOG.info(erg, true, true) + " != " + __LOG.info(exp, true, true) + " +/- " + __PROZENT + '%', msg, thisArg, ... params);
}

const ASSERT_NOT_IN_EPSILON = function(erg, exp, scale = 1, epsilon = __ASSERTEPSILON, msg, thisArg, ... params) {
    checkType(erg, 'number', true, 'ASSERT_NOT_IN_EPSILON', "erg", 'Number');
    checkType(exp, 'number', true, 'ASSERT_NOT_IN_EPSILON', "exp", 'Number');

    const __EPSILON = scale * epsilon;
    const __PROZENT = 100 * __EPSILON;
    const __DELTA = ((exp === 0.0) ? 1.0 : Math.abs(exp)) * __EPSILON;

    return ASSERT(Math.abs(erg - exp) > __DELTA, __LOG.info(erg, true, true) + " == " + __LOG.info(exp, true, true) + " +/- " + __PROZENT + '%', msg, thisArg, ... params);
}

const ASSERT_OFTYPE = function(obj, type, msg, thisArg, ... params) {
    checkType(type, 'string', true, 'ASSERT_OFTYPE', "type", 'String');

    return ASSERT((typeOf(obj) === type), __LOG.info(obj, true, true) + " ist kein " + __LOG.info(type, false), msg, thisArg, ... params);
}

const ASSERT_NOT_OFTYPE = function(obj, type, msg, thisArg, ... params) {
    checkType(type, 'string', true, 'ASSERT_NOT_OFTYPE', "type", 'String');

    return ASSERT((typeOf(obj) !== type), __LOG.info(obj, true, true) + " ist " + __LOG.info(type, false), msg, thisArg, ... params);
}

const ASSERT_TYPEOF = function(obj, type, msg, thisArg, ... params) {
    checkType(type, 'string', true, 'ASSERT_TYPEOF', "type", 'String');

    return ASSERT(((typeof obj) === type), __LOG.info(obj, true, true) + " ist kein " + __LOG.info(type, false), msg, thisArg, ... params);
}

const ASSERT_NOT_TYPEOF = function(obj, type, msg, thisArg, ... params) {
    checkType(type, 'string', true, 'ASSERT_NOT_TYPEOF', "type", 'String');

    return ASSERT(((typeof obj) !== type), __LOG.info(obj, true, true) + " ist " + __LOG.info(type, false), msg, thisArg, ... params);
}

const ASSERT_INSTANCEOF = function(obj, cls, msg, thisArg, ... params) {
    checkType(cls, 'function', true, 'ASSERT_INSTANCEOF', "cls", 'Function');

    const __CLASSNAME = (cls || { }).name;

    return ASSERT((obj instanceof cls), __LOG.info(obj, true, true) + " ist kein " + __LOG.info(__CLASSNAME, false), msg, thisArg, ... params);
}

const ASSERT_NOT_INSTANCEOF = function(obj, cls, msg, thisArg, ... params) {
    checkType(cls, 'function', true, 'ASSERT_NOT_INSTANCEOF', "cls", 'Function');

    const __CLASSNAME = (cls || { }).name;

    return ASSERT(! (obj instanceof cls), __LOG.info(obj, true, true) + " ist " + __LOG.info(__CLASSNAME, false), msg, thisArg, ... params);
}

const ASSERT_MATCH = function(str, pattern, msg, thisArg, ... params) {
    checkType(str, 'string', false, 'ASSERT_MATCH', "str", 'String');
    checkObjClass(pattern, RegExp, true, 'ASSERT_MATCH', "pattern", 'RegExp');

    return ASSERT((str || "").match(pattern), __LOG.info(str, true, true) + " hat nicht das Muster " + String(pattern), msg, thisArg, ... params);
}

const ASSERT_NOT_MATCH = function(str, pattern, msg, thisArg, ... params) {
    checkType(str, 'string', false, 'ASSERT_NOT_MATCH', "str", 'String');
    checkObjClass(pattern, RegExp, true, 'ASSERT_NOT_MATCH', "pattern", 'RegExp');

    return ASSERT(! (str || "").match(pattern), __LOG.info(str, true, true) + " hat das Muster " + String(pattern), msg, thisArg, ... params);
}

// ==================== Ende Abschnitt fuer sonstige ASSERT-Funktionen ====================

// ==================== Abschnitt fuer globale Variablen ====================

// Parameter fuer ASSERT_IN_DELTA, ASSERT_NOT_IN_DELTA, ASSERT_IN_EPSILON und ASSERT_NOT_IN_EPSILON (Float-Genauigkeit)...
const __ASSERTDELTA     = 0.000001;
const __ASSERTEPSILON   = Number.EPSILON;

// ==================== Ende Abschnitt fuer globale Variablen ====================

// *** EOF ***
