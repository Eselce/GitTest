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

// ==================== Abschnitt fuer Klasse UnitTest ====================

// Basisklasse fuer eine spezielle Exception fuer Assertions
// msg: Text oder Text liefernde Funktion
// thisArg: Referenz auf ein Bezugsobjekt
// params: ggfs. Parameter fuer die msg-Funktion
function AssertionFailed(msg, thisArg, ...params) {
    //'use strict';

    if (msg === undefined) {
        this.text = msg;
    } else if (typeof msg === 'function') {
        const __TEXT = msg.call(thisArg, ...params);

        this.text = ((__TEXT === undefined) ? __TEXT : String(__TEXT));
    } else {
        this.text = String(msg);
    }
}

Class.define(UnitTest, Object, {
                  'getText'       : function() {
                                        return this.text;
                                    }
    });

// ==================== Ende Abschnitt fuer Klasse AssertionFailed ====================

// ==================== Abschnitt fuer ASSERT-Testfunktion ====================

// Basisfunktion fuer die Durchfuehrung einer Ueberpruefung einer Bedingung
// test: Bedingung, die als wahr angenommen wird
// msg: Text oder Text liefernde Funktion fuer den Fall einer Diskrepanz
// thisArg: Referenz auf ein Bezugsobjekt
// params: ggfs. Parameter fuer die msg-Funktion
// throw Wirft dann AssertionFailed-Exception mit diesem Text
// return true, da in diesem Fall keine Exception geworfen wurde!
const ASSERT = function(test, msg, thisArg, ...params) {
    'use strict';

    if (! test) {
        const __FAIL = new AssertionFailed(msg, thisArg, ...params);
        __LOG[3]("FAIL", __FAIL);

        throw __FAIL;
    } else {
        __LOG[6]("OK", test);
    }

    return true;
};

// ==================== Ende Abschnitt fuer ASSERT ====================

// ==================== Abschnitt fuer sonstige ASSERT-Funktionen ====================

const ASSERT_NOT = function(test, msg, thisArg, ...params) {
    return ASSERT(! test, msg, thisArg, ...params);
}

const ASSERT_NULL = function(test, msg, thisArg, ...params) {
    return ASSERT(test === null, msg, thisArg, ...params);
}

const ASSERT_NOT_NULL = function(test, msg, thisArg, ...params) {
    return ASSERT(test !== null, msg, thisArg, ...params);
}

const ASSERT_SET = function(test, msg, thisArg, ...params) {
    return ASSERT(test != undefined, msg, thisArg, ...params);
}

const ASSERT_NOT_SET = function(test, msg, thisArg, ...params) {
    return ASSERT(test == undefined, msg, thisArg, ...params);
}

const ASSERT_EQUAL = function(erg, exp, msg, thisArg, ...params) {
    return ASSERT(erg === exp, msg, thisArg, ...params);
}

const ASSERT_NOT_EQUAL = function(erg, exp, msg, thisArg, ...params) {
    return ASSERT(erg !== exp, msg, thisArg, ...params);
}

const ASSERT_ALIKE = function(erg, exp, msg, thisArg, ...params) {
    return ASSERT(erg == exp, msg, thisArg, ...params);
}

const ASSERT_NOT_ALIKE = function(erg, exp, msg, thisArg, ...params) {
    return ASSERT(erg != exp, msg, thisArg, ...params);
}

const ASSERT_IN_DELTA = function(erg, exp, delta, msg, thisArg, ...params) {
    return ASSERT(Math.abs(erg - exp) <= delta, msg, thisArg, ...params);
}

const ASSERT_NOT_IN_DELTA = function(erg, erg, delta, msg, thisArg, ...params) {
    return ASSERT(Math.abs(erg - exp) > delta, msg, thisArg, ...params);
}

const ASSERT_INSTANCEOF = function(obj, cls, msg, thisArg, ...params) {
    return ASSERT((obj instanceof cls), msg, thisArg, ...params);
}

const ASSERT_NOT_INSTANCEOF = function(obj, cls, msg, thisArg, ...params) {
    return ASSERT_NOT((obj instanceof cls), msg, thisArg, ...params);
}

const ASSERT_MATCH = function(str, pattern, msg, thisArg, ...params) {
    return ASSERT((str || "").match(pattern), msg, thisArg, ...params);
}

const ASSERT_NOT_MATCH = function(str, pattern, msg, thisArg, ...params) {
    return ASSERT_NOT((str || "").match(pattern), msg, thisArg, ...params);
}

// ==================== Ende Abschnitt fuer sonstige ASSERT-Funktionen ====================

// *** EOF ***
