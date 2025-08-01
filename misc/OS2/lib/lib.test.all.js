/****** JavaScript-Bibliothek 'lib.test.all.js' ["TESTBASE","TEST"] ******/

// Inhaltsverzeichnis:
// https://eselce.github.io/GitTest/misc/OS2/lib/<TESTBASE>: 
//  test.assert.js
//  test.class.unittest.js
//  test.lib.option.js
// https://eselce.github.io/GitTest/misc/OS2/test/<TEST>: 
//  test.assert.test.js
//  test.class.unittest.test.js
//  test.lib.option.test.js
//  test.mock.gm.test.js
//  util.class.uri.test.js
//  util.debug.test.js
//  util.log.test.js
//  util.object.test.js
//  util.option.api.test.js
//  util.promise.test.js
//  util.store.test.js
//  util.value.test.js
//  util.xhr.test.js
//  util.xhr.gm.test.js

/*** Modul test.assert.js ***/

// ==UserModule==
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
// ==/UserModule==

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

/*** Ende Modul test.assert.js ***/

/*** Modul test.class.unittest.js ***/

// ==UserModule==
// _name         test.class.unittest
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Basisklasse fuer Unit-Tests fuer ein JS-Modul
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Konfigurations-Abschnitt fuer Optionen ====================

const __SHOWMODULECOUNT = false;    // Zeige Spalte mit Anzahl der Module
const __SHOWUNITTESTDESC = false;   // Beschreibung als Tooltip (false) oder Text (true)

const __TESTLOGLEVEL = 9;           // Logs ausfuehrlich (9) oder normal (4)

__LOG.init(window, __TESTLOGLEVEL);  // Testphase

// ==================== Abschnitt fuer Klasse UnitTest ====================

// Basisklasse fuer die Ausfuehrung von Unit-Tests fuer ein JS-Modul
// name: Name des JS-Moduls
// desc: Beschreibung des Moduls
// tests: Objekt mit den Testfunktionen
// load: Angabe, ob die Tests geladen werden sollen (false: Test nicht laden)
function UnitTest(name, desc, tests, load) {
    'use strict';

    try {
        this.register(name, desc, tests, load, this);
    } catch (ex) {
        showException(ex);
    }
}

Class.define(UnitTest, Object, {
            'register'    : function(name, desc, tests, load, thisArg) {
                                const __LIBNAME = (name || "");
                                const __LIBDESC = (desc || ("UnitTest " + __LIBNAME));
                                const __LIBTESTS = (tests || { });
                                const __THISLIB = (thisArg || this);
                                const __LIBTFUNS = Object.entries(__LIBTESTS);
                                const __LIBENTRY = {
                                                    'name' : __LIBNAME,
                                                    'desc' : __LIBDESC,
                                                    'test' : __THISLIB
                                                };

                                this.name = __LIBNAME;
                                this.desc = __LIBDESC;
                                this.tDefs = [];

                                if (load !== false) {
                                    if (__LIBTFUNS.length) {
                                        for (let entry of __LIBTFUNS) {
                                            const __NAME = entry[0];
                                            const __TFUN = entry[1];

                                            this.addTest(__NAME, __TFUN);
                                        }
                                    } else {
                                        this.addTest('MISSING_TESTS', function() {
                                                                              const __MSG = "No tests available for " + __LOG.info(__LIBNAME, false);
                                                                              __LOG[1](__MSG);
                                                                              throw __MSG;
                                                                          });
                                    }
                                }

                                if (__ALLLIBS[__LIBNAME]) {
                                    const __MSG = "Test module " + __LOG.info(__LIBNAME, false) + " ("
                                                                + __LOG.info(__LIBDESC, false) + " already exists as "
                                                                + __LOG.info(__ALLLIBS[__LIBNAME].desc, false);
                                    __LOG[1](__MSG);
                                    throw __MSG;
                                }

                                __ALLLIBS[__LIBNAME] = __LIBENTRY;
                            },
            'addTest'     : function(name, tFun, desc = undefined) {
                                const __NAME = name;
                                const __TFUN = (tFun || { });  // TODO: Dummy
                                const __TFUNDOBJ = __TFUN.description;
                                const __TFUNDESC = (__TFUNDOBJ ? String(((typeof __TFUNDOBJ) === 'function') ? __TFUNDOBJ() : __TFUNDOBJ) : undefined);
                                const __DESC = (desc || __TFUNDESC);
                                const __ENTRY = {
                                                    'name' : __NAME,
                                                    'desc' : __DESC,
                                                    'tFun' : __TFUN
                                                };

                                this.tDefs.push(__ENTRY);
                            },
            'prepare'     : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
                                UNUSED(name, desc, thisArg, resultObj, resultFun, tableId);

                                return true;
                            },
            'cleanup'     : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
                                UNUSED(name, desc, thisArg, resultObj, resultFun, tableId);

                                return true;
                            },
            'setup'       : async function(name, desc, testFun, thisArg) {
                                UNUSED(name, desc, testFun, thisArg);

                                return true;
                            },
            'teardown'    : async function(name, desc, testFun, thisArg) {
                                UNUSED(name, desc, testFun, thisArg);

                                return true;
                            },
            'run'         : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
                                const __RESULTS = (resultObj || (new UnitTestResults(name, desc, this)));
                                const __TDEFS = this.tDefs;
                                const __THIS = (thisArg || this);
                                const __RETVALS = [];

                                __LOG[2]("Running", __TDEFS.length, "tests for module", __LOG.info(name, false) + ':', desc);

                                try {
                                    for (let entry of __TDEFS) {
                                        const __NAME = entry.name;
                                        const __DESC = entry.desc;
                                        const __TFUN = entry.tFun;
                                        const __RESULT = new UnitTestResults(__NAME, __DESC, __THIS);
                                        let result;

                                        __RESULT.running();  // Testzaehler erhoehen...
                                        __LOG[4]("Running test", __LOG.info(name, false) + "->" + __LOG.info(__NAME, false) + (__DESC ? " (" + __DESC + ')' : "") + "...");

                                        try {
                                            result = await this.setup.call(__THIS, __NAME, __DESC, __TFUN, __THIS);

                                            __LOG[9]("Preparation of test",__LOG.info(name, false) + "->" + __LOG.info(__NAME, false), "returned:", result);
                                        } catch (ex) {
                                            // Fehler im setup()...
                                            __RESULT.checkException(ex);

                                            __LOG[1]("Exception", ex, "in preparation of test",__LOG.info(name, false) + "->" + __LOG.info(__NAME, false));
                                        }

                                        try {
                                            const __RETVAL = await __TFUN.call(__THIS);

                                            __RESULT.checkResult(__RETVAL);  // entscheiden, ob erfolgreich oder nicht...
                                            __RETVALS.push(__RETVAL);

                                            __LOG[5]("Test", __LOG.info(name, false) + "->" + __LOG.info(__NAME, false), "returned:", __RETVAL);
                                        } catch (ex) {
                                            // Fehler im Einzeltest...
                                            __RESULT.checkException(ex);

                                            if (ex instanceof AssertionFailed) {
                                                __LOG[4]("Test", __LOG.info(name, false) + "->" + __LOG.info(__NAME, false), "failed:", __RESULT.sum());
                                            } else {
                                                __LOG[1]("Exception", ex, "in test", __LOG.info(name, false) + "->" + __LOG.info(__NAME, false) + ':', __RESULT.sum());
                                            }
                                        }

                                        try {
                                            result = await this.teardown.call(__THIS, __NAME, __DESC, __TFUN, __THIS);

                                            __LOG[9]("Cleanup of test",__LOG.info(name, false) + "->" + __LOG.info(__NAME, false), "returned:", result);
                                        } catch (ex) {
                                            // Fehler im teardown()...
                                            __RESULT.checkException(ex);

                                            __LOG[1]("Exception", ex, "in cleanup of test",__LOG.info(name, false) + "->" + __LOG.info(__NAME, false));
                                        }

                                        __RESULTS.merge(__RESULT);  // aufaddieren...

                                        // Einzelergebnis eintragen...
                                        resultFun.call(__THIS, __RESULT, tableId, document);
                                    }
                                } catch (ex) {
                                    // Fehler im Framework der Klasse...
                                    __RESULTS.checkException(ex);

                                    __LOG[1]("Exception", ex, "in module", __LOG.info(name, false) + ':', __RESULTS.sum());

                                    //throw ex;  // weiterleiten an runAll() ???
                                } finally {
                                    __RESULTS.results = __RETVALS;  // detailierte Rueckgabewerte koennen ggfs. interessant sein...
                                }

                                return __RESULTS;
                           }
        });

UnitTest.runAll = async function(minLevel = 1, resultFun = UnitTest.defaultResultFun, tableId, resultObj, thisArg) {
    const __LIBCOUNT = Object.keys(__ALLLIBS).length;
    const __ALLRESULTS = (resultObj || (new UnitTestResults("TOTAL", __LIBCOUNT + " Module")));

    // Attribut 'test.tDefs' mit __ALLLIBS verknuepfen (befindet sich bei sum() unter 'tests')...
    __ALLRESULTS.test = {
                            'tDefs' : __ALLLIBS
                        };

    for (let testLib of Object.values(__ALLLIBS)) {
        const __TESTLIB = (testLib || { });
        const __NAME = __TESTLIB.name;
        const __DESC = __TESTLIB.desc;
        const __TEST = __TESTLIB.test;

        try {
            const __PFUN = __TEST['prepare'];  // TODO: __TEST.prepare, aber variabel gehalten!
            const __TFUN = __TEST['run'];      // TODO: __TEST.run, aber variabel gehalten!
            const __CFUN = __TEST['cleanup'];  // TODO: __TEST.cleanup, aber variabel gehalten!
            const __THIS = (thisArg || __TEST);
            const __RESULTS = new UnitTestResults("SUMME", __DESC, __TEST);
            let result;

            // Test initialisieren und zaehlen...
            __RESULTS.module();

            // Ausgabefilter verankern...
            __THIS.minLevel =  minLevel;

            __LOG[2]("Starting tests for module", __LOG.info(__NAME, false) + ':', __DESC);

            try {
                result = await __PFUN.call(__TEST, __NAME, __DESC, __THIS, __RESULTS, resultFun, tableId);

                __LOG[9]("Preparation for module",__LOG.info(__NAME, false), "returned:", result);
            } catch (ex) {
                // Fehler im Framework zur Vorbereitung der Testklasse...
                __RESULTS.checkException(ex);

                __LOG[1]("Exception", ex, "in preparation for module", __LOG.info(__NAME, false));
            }

            try {
                __LIBRESULTS[__NAME] = await __TFUN.call(__TEST, __NAME, __DESC, __THIS, __RESULTS, resultFun, tableId);
            } catch (ex) {
                // Fehler im Framework der Testklasse...
                __RESULTS.checkException(ex);

                __LOG[1]("Exception", ex, "in module", __LOG.info(__NAME, false) + ':', __RESULTS.sum());
            } finally {
                try {
                    result = await __CFUN.call(__TEST, __NAME, __DESC, __THIS, __RESULTS, resultFun, tableId);

                __LOG[9]("Cleanup for module",__LOG.info(__NAME, false), "returned:", result);
                } catch (ex) {
                    // Fehler im Framework der Testklasse...
                    __RESULTS.checkException(ex);

                    __LOG[1]("Exception", ex, "in cleanup for module", __LOG.info(__NAME, false));
                } finally {
                    __ALLRESULTS.merge(__RESULTS);  // aufaddieren...

                    __LOG[2]("Finished tests for module", __LOG.info(__NAME, false) + ':',  __RESULTS.sum());
                    __LOG[6]("Total results after module", __LOG.info(__NAME, false) + ':',  __ALLRESULTS.sum());

                    // Ergebnis eintragen...
                    resultFun.call(__THIS, null, tableId, document);  // Leerzeile
                    resultFun.call(__THIS, __RESULTS, tableId, document);
                    resultFun.call(__THIS, null, tableId, document);  // Leerzeile
                }
            }
        } catch (ex) {
            // Fehler im Framework der UnitTests und Module...
            __ALLRESULTS.checkException(ex);

            __LOG[1]("Exception", ex, "in framework of module", __LOG.info(__NAME, false) + ':',  __ALLRESULTS.sum());
        }
    }

    try {
        __LOG[5]("Detailed results for all tests:", __LIBRESULTS);
        __LOG[2]("Results for all tests:", __ALLRESULTS.sum());

        // Endergebnis eintragen...
        resultFun.call(thisArg, null, tableId, document);  // Leerzeile
        resultFun.call(thisArg, __ALLRESULTS, tableId, document);
    } catch (ex) {
        // Fehler bei der Anzeige des Ergebnisses...
        __ALLRESULTS.checkException(ex);
    }

    return __ALLRESULTS;
}

UnitTest.defaultResultFun = function(resultObj, tableId, doc = document) {
    const __TABLE = UnitTest.getOrCreateTestResultTable(tableId, doc);
    const __RESULTS = (resultObj || { });
    const __UNITTEST = (__RESULTS.test || { });
    const __MINLEVEL = getValue(this.minLevel, 1);
    const __STYLE = UnitTest.getStyleFromResults(__RESULTS);
    const __SHOW = (__STYLE.__RESULTCLASS >= __MINLEVEL);
    const __ENDSUMMARY = (__RESULTS.name == 'TOTAL');
    const __SUMMARY = ((__UNITTEST.desc === __RESULTS.desc) || __ENDSUMMARY);
    const __SHOWRESULT = (__RESULTS.name && (__SHOW || __SUMMARY));
    const __CREATEROW = (__SHOWRESULT || (__MINLEVEL < 1));

    if (__RESULTS.name && __SUMMARY) {
        const __BORDERSTRING = (__ENDSUMMARY ? 'solid medium grey' : 'solid thin grey');

        if (__ENDSUMMARY) {
            __STYLE.paddingTop    = '6px';
            __STYLE.paddingBottom = '6px';
            __STYLE.borderBottom  = __BORDERSTRING;
        }
        __STYLE.borderTop = __BORDERSTRING;
    }

    if (__TABLE && __CREATEROW) {
        const __ROW = doc.createElement('TR');

        if (__SHOWRESULT) {
            const __SHOWDESC = __SHOWUNITTESTDESC;

            if (__SHOWDESC) {
                appendCell(__ROW, __UNITTEST.name);
                appendCell(__ROW, __UNITTEST.desc);
            } else {
                const __UNITTESTINFO = '<ABBR title="' + (__UNITTEST.desc || "") + '">'
                                                        + (__UNITTEST.name || "") + '</ABBR>';
                appendCell(__ROW, __UNITTESTINFO);
            }

            appendCell(__ROW, __RESULTS.name);
            appendCell(__ROW, __RESULTS.desc);

            if (__SHOWMODULECOUNT) {
                appendCell(__ROW, __RESULTS.countModules);
            }

            appendCell(__ROW, __RESULTS.countRunning);
            appendCell(__ROW, __RESULTS.countSuccess);
            appendCell(__ROW, __RESULTS.countFailed);
            appendCell(__ROW, __RESULTS.countException);
            appendCell(__ROW, __RESULTS.countError);
            appendCell(__ROW, __RESULTS.result);
            appendCell(__ROW, __RESULTS.codeLine);
        }

        setRowStyle(__ROW, __STYLE);

        __TABLE.appendChild(__ROW);
    }

    return __TABLE;
}

UnitTest.getOrCreateTestResultTable = function(tableId = 'UnitTest', doc = document) {
    let table = getElementById(tableId, doc);

    if (! table) {  // Anlegen...
        table = doc.createElement('TABLE');
        table.setAttribute('id', tableId);
        doc.body.appendChild(table);
    }

    if (! table.rows.length) {
        const __SHOWDESC = __SHOWUNITTESTDESC;
        const __ROW = doc.createElement('TR');
        const __COLOR = undefined;

        appendCell(__ROW, "Modul", __COLOR);

        if (__SHOWDESC) {  // Ansonsten verschoben in Tooltip
            appendCell(__ROW, "Beschreibung", __COLOR);
        }

        appendCell(__ROW, "Test", __COLOR);
        appendCell(__ROW, "Details", __COLOR);

        if (__SHOWMODULECOUNT) {
            appendCell(__ROW, "Module", __COLOR);
        }

        appendCell(__ROW, "Anz", __COLOR);
        appendCell(__ROW, "OK", __COLOR);
        appendCell(__ROW, "FAIL", __COLOR);
        appendCell(__ROW, "EX", __COLOR);
        appendCell(__ROW, "ERR", __COLOR);
        appendCell(__ROW, "Ergebnis", __COLOR);
        appendCell(__ROW, "Quellcode", __COLOR);

        table.appendChild(__ROW);
    }

    return table;
}

UnitTest.getStyleFromResults = function(results) {
    const __RESULTS = (results || { });
    const __STYLE = { };

    if (__RESULTS.countRunning > 0) {
        // Alle Stiloptionen...
        const __STYLES = {
                'countSuccess'      : { 'color' : 'green' },
                'countFailed'       : { 'color' : 'darkorange' },
                'countException'    : { 'color' : 'magenta', 'bold' : true },
                'countError'        : { 'color' : 'red', 'bold' : true }
            };
        const __STYLEKEYS = Object.keys(__STYLES);
//        // Relevanter Key ist der mit den haeufigsten Treffern...
//        const [ __MAXKEY, __MAXCOUNT ] = __STYLEKEYS.reduceRight(([ maxKey, maxCount], key) =>
//                ((__RESULTS[key] > maxCount) ? [ key, __RESULTS[key]] : [ maxKey, maxCount]),
//            [ "", 0 ]);
        // Relevanter Key ist die hoechste Kategorie mit mindestens einem Treffer...
        const [ __MAXKEY, __MAXCOUNT ] = __STYLEKEYS.reduce(([ maxKey, maxCount], key) =>
                ((__RESULTS[key] > 0) ? [ key, __RESULTS[key]] : [ maxKey, maxCount]),
            [ "", 0 ]);

        Object.assign(__STYLE, __STYLES[__MAXKEY], {
                '__RESULTCLASS' : __STYLEKEYS.indexOf(__MAXKEY),
                '__RESULTKEY'   : __MAXKEY,
                '__MAXCOUNT'    : __MAXCOUNT
                });
    }

    return __STYLE;
}

// ==================== Ende Abschnitt fuer Klasse UnitTest ====================

// ==================== Abschnitt fuer Klasse UnitTestResults ====================

// Ergebnisklasse fuer die Ausfuehrung von Unit-Tests fuer ein JS-Modul
// libName: Name des JS-Moduls
// libDesc: Beschreibung des Moduls
// libTest: UnitTest-Klasse des Moduls

/*class*/ function UnitTestResults /*{
    constructor*/(libName, libDesc, libTest) {
        'use strict';

        this.name = libName;
        this.desc = libDesc;
        this.test = (libTest || { });

        this.countModules   = 0;  // Zaehler Module
        this.countRunning   = 0;  // Zaehler Tests
        this.countSuccess   = 0;  // Zaehler OK
        this.countFailed    = 0;  // Zaehler FAIL
        this.countException = 0;  // Zaehler EX (andere Exceptions ausser ERR)
        this.countError     = 0;  // Zaehler ERR (Fehler im Test, Spezial-Exception)
    }
//}

Class.define(UnitTestResults, Object, {
                'module'              : function() {
                                            return ++this.countModules;
                                        },
                'running'             : function() {
                                            return ++this.countRunning;
                                        },
                'success'             : function() {
                                            return ++this.countSuccess;
                                        },
                'failed'              : function() {
                                            return ++this.countFailed;
                                        },
                'exception'           : function(ex) {
                                            const __EX = (ex || { });

                                            if (__EX instanceof AssertionFailed) {
                                                this.result = __EX.getTextMessage();
                                                this.codeLine = __EX.codeLine;

                                                return this.failed();
                                            } else {
                                                this.result = String(__EX);
                                                this.codeLine = codeLineFor(__EX, false, true, false, true);

                                                return ++this.countException;
                                            }
                                        },
                'error'               : function(ex) {
                                            const __EX = (ex || { });

                                            this.result = __EX.message;
                                            this.codeLine = codeLineFor(__EX, false, true, false, true);

                                            return ++this.countError;
                                        },
                'checkResult'         : function(result) {
                                            this.result = result;

                                            if (result === undefined) {  // Hier geht es eher um Funktionen ohne return als um return undefined...
                                                return this.failed();  // Es ist am saubersten, return true zu fordern!
                                            } else if (result instanceof Error) {
                                                return this.error(result);
                                            } else if (!! result) {
                                                return this.success();
                                            } else {
                                                return this.failed();
                                            }
                                        },
                'checkException'      : function(ex) {
                                            if (ex === undefined) {  // throw undefined klingt falsch (Alternativen: Error oder Exception)...
                                                return this.failed();
                                            } else if (ex instanceof Error) {
                                                return this.error(ex);
                                            } else {
                                                return this.exception(ex);
                                            }
                                        },
                'merge'               : function(resultsToAdd) {
                                            this.countModules   += resultsToAdd.countModules;
                                            this.countRunning   += resultsToAdd.countRunning;
                                            this.countSuccess   += resultsToAdd.countSuccess;
                                            this.countFailed    += resultsToAdd.countFailed;
                                            this.countException += resultsToAdd.countException;
                                            this.countError     += resultsToAdd.countError;

                                            if (! this.results) {
                                                this.results = { };
                                            }
                                            this.results[resultsToAdd.name] = resultsToAdd.results;

                                            if (! this.codeLines) {
                                                this.codeLines = { };
                                            }
                                            if (resultsToAdd.codeLines) {
                                                this.codeLines[resultsToAdd.name] = resultsToAdd.codeLines;
                                            }

                                            return this;
                                        },
                'sum'                 : function() {
                                            return {
                                                    'name'      : this.name,
                                                    'desc'      : this.desc,
                                                    'modules'   : this.countModules,
                                                    'running'   : this.countRunning,
                                                    'success'   : this.countSuccess,
                                                    'failed'    : this.countFailed,
                                                    'exception' : this.countException,
                                                    'error'     : this.countError,
                                                    'tests'     : this.test.tDefs,
                                                    'results'   : this.results,
                                                    'codeLines' : this.codeLines
                                                };
                                        }
            });

// ==================== Ende Abschnitt fuer Klasse UnitTestResults ====================

// ==================== Abschnitt fuer globale Variablen ====================

const __ALLLIBS = { };
const __LIBRESULTS = { };

// ==================== Ende Abschnitt fuer globale Variablen ====================

// *** EOF ***

/*** Ende Modul test.class.unittest.js ***/

/*** Modul test.lib.option.js ***/

// ==UserModule==
// _name         test.lib.option
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Basisklasse fuer Unit-Tests fuer ein JS-Modul
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/lib.option.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.lib.option.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse UnitTestOption ====================

// Spezialisierte Klasse fuer die Ausfuehrung von Unit-Tests fuer Optionen
// name: Name des JS-Moduls
// desc: Beschreibung des Moduls
// tests: Objekt mit den Testfunktionen
// load: Angabe, ob die Tests geladen werden sollen (false: Test nicht laden)
function UnitTestOption(name, desc, tests, load) {
    'use strict';

    UnitTest.call(this, name, desc, tests, load);
}

Class.define(UnitTestOption, UnitTest, {
            'prepare'     : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
                                UNUSED(resultObj, resultFun, tableId);

                                __LOG[1]("prepare()", name, desc);

                                const __TEAMPARAMS = new Team("Choromonets Odessa", "Ukraine", "1. Liga");

                                const __MANAGER = new PageManager("Test-Umgebung", __TESTTEAMCLASS, () => {
                                        return {
                                                'teamParams'  : __TEAMPARAMS,
                                                'menuAnchor'  : getTable(1, 'DIV'),
                                                'hideMenu'    : true,
                                                'hideForm'    : {
                                                                    'team'  : true
                                                                }
                                            };
                                    }, async optSet => {
                                        thisArg.optSet = optSet;

                                        return true;
                                    });

                                const __MAIN = new Main(__TESTOPTCONFIG, null, __MANAGER);

                                let error = null;
                                const __RET = await __MAIN.run().catch(ex => {
                                                                        // Fehler fuer ausserhalb der Promise merken...
                                                                        error = ex;
                                                                    });
                                if (error) {
                                    throw error;
                                }

                                return __RET;
                            },
            'cleanup'     : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
                                UNUSED(resultFun, tableId);

                                const __RELOAD = false;

                                __LOG[1]("cleanup()", name, desc);

                                // Status loggen...
                                __LOG[2](String(thisArg.optSet));
                                __LOG[1]('OPTION TEST END', __DBMOD.Name, '(' + resultObj.countRunning + ')', '/', __DBMAN.Name);

                                // Optionen aufraeumen...
                                await resetOptions(this.optSet, __RELOAD);
                                delete thisArg.optSet;

                                return true;
                            },
            'setup'       : async function(name, desc, testFun, thisArg) {
                                const __RELOAD = false;

                                __LOG[1]("setup()", name, desc, testFun, thisArg);

                                // "Sauberes" OptSet vorbereiten...
                                await resetOptions(this.optSet, __RELOAD);

                                return true;
                            },
            'teardown'    : async function(name, desc, testFun, thisArg) {
                                __LOG[1]("teardown()", name, desc, testFun, thisArg);

                                return true;
                            }
        });

// ==================== Ende Abschnitt fuer Klasse UnitTestOption ====================

// ==================== Ende Abschnitt fuer Test-Konfiguration __TESTCONFIG ====================

// Moegliche Optionen (hier die Standardwerte editieren oder ueber das Benutzermenu setzen):
const __TESTOPTCONFIG = {
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
    'ligaSize' : {        // Ligengroesse
                   'Name'      : "ligaSize",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'AutoReset' : true,
                   'Choice'    : [ 10, 18, 20 ],
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Liga: $er",
                   'Hotkey'    : 'i',
                   'FormLabel' : "Liga:|$er"
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
                   'Cols'      : 3,
                   'Rows'      : 1,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Daten-ZAT: $"
               },
    'team' : {            // Datenspeicher fuer Daten des Erst- bzw. Zweitteams
                   'Name'      : "team",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'Team',
                   'Hidden'    : true,
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
    'reset' : {           // Optionen auf die "Werkseinstellungen" zuruecksetzen
                   'FormPrio'  : undefined,
                   'Name'      : "reset",
                   'Type'      : __OPTTYPES.SI,
                   'Action'    : __OPTACTION.RST,
                   'Label'     : "Standard-Optionen",
                   'Hotkey'    : 'O',
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
                   'Hotkey'    : 'a',
                   'AltTitle'  : "$V schlie\u00DFen",
                   'AltLabel'  : "Optionen verbergen",
                   'AltHotkey' : 'v',
                   'FormLabel' : ""
               }
};

// ==================== Ende Abschnitt fuer Test-Konfiguration __TESTCONFIG ====================

// ==================== Spezialisierter Abschnitt fuer Optionen ====================

// Teamparameter fuer getrennte Speicherung der Optionen fuer Erst- und Zweitteam...
const __TESTTEAMCLASS = new TeamClassification();

// Optionen mit Daten, die ZAT- und Team-bezogen gemerkt werden...
__TESTTEAMCLASS.optSelect = {
//        'datenZat'   : true,
//        'ligaSize'   : true
    };

// ==================== Ende Abschnitt fuer Optionen ====================

// *** EOF ***

/*** Ende Modul test.lib.option.js ***/

/*** Modul test.assert.test.js ***/

// ==UserModule==
// _name         test.assert.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Script-Optionen im Benutzermenue
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/test.assert.test.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu test.assert ====================

(() => {

// ==================== Abschnitt fuer ASSERT-Funktionen ====================

    // Funktionalitaet der ASSERT-Funktionen...
    new UnitTest('test.assert.js ASSERTions', "ASSERT-Funktionen", {  // NOTE Text "ASSERT-Funktionen" wird unten im Test genutzt!
            'ASSERT'                          : function() {
                                                    return ASSERT(true, "Fehler", "ASSERT failed");
                                                },
            'ASSERT FAIL'                     : function() {
                                                    try {
                                                        ASSERT(false, "Fehler", "ASSERT failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "ASSERT failed (Fehler)", "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT function'                 : function() {
                                                    try {
                                                        ASSERT(false, "Fehler", (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "42 ist die Wahrheit (Fehler)", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT arrow'                    : function() {
                                                    try {
                                                        ASSERT(false, "Fehler", (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, "ASSERT-Funktionen ist die Wahrheit (Fehler)", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT'                      : function() {
                                                    return ASSERT_NOT(false, "kein Fehler", "ASSERT_NOT failed");
                                                },
            'ASSERT_NOT FAIL'                 : function() {
                                                    try {
                                                        ASSERT_NOT(true, "Fehler", "ASSERT_NOT failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "ASSERT_NOT failed (Fehler)", "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT function'             : function() {
                                                    try {
                                                        ASSERT_NOT(true, "kein Fehler", (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "42 ist die Wahrheit (kein Fehler)", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT arrow'                : function() {
                                                    try {
                                                        ASSERT_NOT(true, "kein Fehler", (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, "ASSERT-Funktionen ist die Wahrheit (kein Fehler)", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_TRUE'                     : function() {
                                                    return ASSERT_TRUE(true, "ASSERT_TRUE failed");
                                                },
            'ASSERT_TRUE FAIL'                : function() {
                                                    try {
                                                        ASSERT_TRUE(false, "ASSERT_TRUE failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "ASSERT_TRUE failed (Boolean false !== true)", "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_TRUE function'            : function() {
                                                    try {
                                                        ASSERT_TRUE(false, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "42 ist die Wahrheit (Boolean false !== true)", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_TRUE arrow'               : function() {
                                                    try {
                                                        ASSERT_TRUE(false, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, "ASSERT-Funktionen ist die Wahrheit (Boolean false !== true)", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_FALSE'                    : function() {
                                                    return ASSERT_FALSE(false, "ASSERT_FALSE failed");
                                                },
            'ASSERT_FALSE FAIL'               : function() {
                                                    try {
                                                        ASSERT_FALSE(true, "ASSERT_FALSE failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "ASSERT_FALSE failed (Boolean true !== false)", "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_FALSE function'           : function() {
                                                    try {
                                                        ASSERT_FALSE(true, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "42 ist die Wahrheit (Boolean true !== false)", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_FALSE arrow'              : function() {
                                                    try {
                                                        ASSERT_FALSE(true, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, "ASSERT-Funktionen ist die Wahrheit (Boolean true !== false)", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NULL'                     : function() {
                                                    return ASSERT_NULL(null, "ASSERT_NULL failed");
                                                },
            'ASSERT_NULL FAIL'                : function() {
                                                    try {
                                                        ASSERT_NULL("not null", "ASSERT_NULL failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_NULL failed (String[8] "not null" !== null)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NULL function'            : function() {
                                                    try {
                                                        ASSERT_NULL("not null", (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (String[8] "not null" !== null)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NULL arrow'               : function() {
                                                    try {
                                                        ASSERT_NULL("not null", (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (String[8] "not null" !== null)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_NULL'                 : function() {
                                                    return ASSERT_NOT_NULL("not null", "ASSERT_NOT_NULL failed");
                                                },
            'ASSERT_NOT_NULL FAIL'            : function() {
                                                    try {
                                                        ASSERT_NOT_NULL(null, "ASSERT_NOT_NULL failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "ASSERT_NOT_NULL failed (object null === null)", "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_NULL function'        : function() {
                                                    try {
                                                        ASSERT_NOT_NULL(null, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "42 ist die Wahrheit (object null === null)", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_NULL arrow'           : function() {
                                                    try {
                                                        ASSERT_NOT_NULL(null, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, "ASSERT-Funktionen ist die Wahrheit (object null === null)", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_ZERO'                     : function() {
                                                    return ASSERT_ZERO(0, "ASSERT_ZERO failed");
                                                },
            'ASSERT_ZERO FAIL'                : function() {
                                                    try {
                                                        ASSERT_ZERO(1, "ASSERT_ZERO failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_ZERO failed (Integer 1 !== 0)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_ZERO function'            : function() {
                                                    try {
                                                        ASSERT_ZERO(1, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (Integer 1 !== 0)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_ZERO arrow'               : function() {
                                                    try {
                                                        ASSERT_ZERO(1, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (Integer 1 !== 0)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_ZERO'                 : function() {
                                                    return ASSERT_NOT_ZERO(1, "ASSERT_NOT_ZERO failed");
                                                },
            'ASSERT_NOT_ZERO FAIL'            : function() {
                                                    try {
                                                        ASSERT_NOT_ZERO(0, "ASSERT_NOT_ZERO failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "ASSERT_NOT_ZERO failed (Integer 0 === 0)", "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_ZERO function'        : function() {
                                                    try {
                                                        ASSERT_NOT_ZERO(0, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "42 ist die Wahrheit (Integer 0 === 0)", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_ZERO arrow'           : function() {
                                                    try {
                                                        ASSERT_NOT_ZERO(0, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, "ASSERT-Funktionen ist die Wahrheit (Integer 0 === 0)", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_ONE'                      : function() {
                                                    return ASSERT_ONE(1, "ASSERT_ONE failed");
                                                },
            'ASSERT_ONE FAIL'                 : function() {
                                                    try {
                                                        ASSERT_ONE(0, "ASSERT_ONE failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_ONE failed (Integer 0 !== 1)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_ONE function'             : function() {
                                                    try {
                                                        ASSERT_ONE(0, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (Integer 0 !== 1)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_ONE arrow'                : function() {
                                                    try {
                                                        ASSERT_ONE(0, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (Integer 0 !== 1)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_ONE'                  : function() {
                                                    return ASSERT_NOT_ONE(0, "ASSERT_NOT_ONE failed");
                                                },
            'ASSERT_NOT_ONE FAIL'             : function() {
                                                    try {
                                                        ASSERT_NOT_ONE(1, "ASSERT_NOT_ONE failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "ASSERT_NOT_ONE failed (Integer 1 === 1)", "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_ONE function'         : function() {
                                                    try {
                                                        ASSERT_NOT_ONE(1, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "42 ist die Wahrheit (Integer 1 === 1)", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_ONE arrow'            : function() {
                                                    try {
                                                        ASSERT_NOT_ONE(1, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, "ASSERT-Funktionen ist die Wahrheit (Integer 1 === 1)", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_SET'                      : function() {
                                                    return ASSERT_SET("set", "ASSERT_SET failed");
                                                },
            'ASSERT_SET FAIL'                 : function() {
                                                    try {
                                                        ASSERT_SET(undefined, "ASSERT_SET failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_SET failed (undefined == null)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_SET function'             : function() {
                                                    try {
                                                        ASSERT_SET(undefined, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (undefined == null)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_SET arrow'                : function() {
                                                    try {
                                                        ASSERT_SET(undefined, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (undefined == null)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_SET'                  : function() {
                                                    return ASSERT_NOT_SET(undefined, "ASSERT_NOT_SET failed");
                                                },
            'ASSERT_NOT_SET FAIL'             : function() {
                                                    try {
                                                        ASSERT_NOT_SET("set", "ASSERT_NOT_SET failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_NOT_SET failed (String[3] "set" != null)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_SET function'         : function() {
                                                    try {
                                                        ASSERT_NOT_SET("set", (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (String[3] "set" != null)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_SET arrow'            : function() {
                                                    try {
                                                        ASSERT_NOT_SET("set", (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
 
                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (String[3] "set" != null)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_SET null'                 : function() {
                                                    return ASSERT_SET("set", "ASSERT_SET failed");
                                                },
            'ASSERT_SET null FAIL'            : function() {
                                                    try {
                                                        ASSERT_SET(null, "ASSERT_SET failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_SET failed (object null == null)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_SET null function'        : function() {
                                                    try {
                                                        ASSERT_SET(null, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (object null == null)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_SET null arrow'           : function() {
                                                    try {
                                                        ASSERT_SET(null, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (object null == null)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_SET null'             : function() {
                                                    return ASSERT_NOT_SET(null, "ASSERT_NOT_SET failed");
                                                },
            'ASSERT_NOT_SET null FAIL'        : function() {
                                                    try {
                                                        ASSERT_NOT_SET("set", "ASSERT_NOT_SET failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_NOT_SET failed (String[3] "set" != null)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_SET null function'    : function() {
                                                    try {
                                                        ASSERT_NOT_SET("set", (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (String[3] "set" != null)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_SET null arrow'       : function() {
                                                    try {
                                                        ASSERT_NOT_SET("set", (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
 
                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (String[3] "set" != null)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_EQUAL'                    : function() {
                                                    return ASSERT_EQUAL(42, 42, "ASSERT_EQUAL failed");
                                                },
            'ASSERT_EQUAL FAIL'               : function() {
                                                    try {
                                                        ASSERT_EQUAL("42", 42, "ASSERT_EQUAL failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_EQUAL failed (String[2] "42" !== Integer 42)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_EQUAL function'           : function() {
                                                    try {
                                                        ASSERT_EQUAL("42", 42, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (String[2] "42" !== Integer 42)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_EQUAL arrow'              : function() {
                                                    try {
                                                        ASSERT_EQUAL("42", 42, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (String[2] "42" !== Integer 42)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_EQUAL'                : function() {
                                                    return ASSERT_NOT_EQUAL("42", 42, "ASSERT_NOT_EQUAL failed");
                                                },
            'ASSERT_NOT_EQUAL FAIL'           : function() {
                                                    try {
                                                        ASSERT_NOT_EQUAL(42, 42, "ASSERT_NOT_EQUAL failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_NOT_EQUAL failed (Integer 42 === Integer 42)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_EQUAL function'       : function() {
                                                    try {
                                                        ASSERT_NOT_EQUAL(42, 42, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (Integer 42 === Integer 42)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_EQUAL arrow'          : function() {
                                                    try {
                                                        ASSERT_NOT_EQUAL(42, 42, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
 
                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (Integer 42 === Integer 42)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_ALIKE'                    : function() {
                                                    return ASSERT_ALIKE("42", 42, "ASSERT_ALIKE failed");
                                                },
            'ASSERT_ALIKE FAIL'               : function() {
                                                    try {
                                                        ASSERT_ALIKE("4711", 42, "ASSERT_ALIKE failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_ALIKE failed (String[4] "4711" != Integer 42)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_ALIKE function'           : function() {
                                                    try {
                                                        ASSERT_ALIKE("4711", 42, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (String[4] "4711" != Integer 42)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_ALIKE arrow'              : function() {
                                                    try {
                                                        ASSERT_ALIKE("4711", 42, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_ALIKE(ex.message, 'ASSERT-Funktionen ist die Wahrheit (String[4] "4711" != Integer 42)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_ALIKE'                : function() {
                                                    return ASSERT_NOT_ALIKE("4711", 42, "ASSERT_NOT_ALIKE failed");
                                                },
            'ASSERT_NOT_ALIKE FAIL'           : function() {
                                                    try {
                                                        ASSERT_NOT_ALIKE("42", 42, "ASSERT_NOT_ALIKE failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_NOT_ALIKE failed (String[2] "42" == Integer 42)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_ALIKE function'       : function() {
                                                    try {
                                                        ASSERT_NOT_ALIKE("42", 42, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (String[2] "42" == Integer 42)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_ALIKE arrow'          : function() {
                                                    try {
                                                        ASSERT_NOT_ALIKE("42", 42, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
 
                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (String[2] "42" == Integer 42)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_LESS'                     : function() {
                                                    return ASSERT_LESS(41, 42, "ASSERT_LESS failed");
                                                },
            'ASSERT_LESS FAIL'                : function() {
                                                    try {
                                                        ASSERT_LESS(42, 42, "ASSERT_LESS failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_LESS failed (Integer 42 >= Integer 42)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_LESS function'            : function() {
                                                    try {
                                                        ASSERT_LESS(42, 42, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (Integer 42 >= Integer 42)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_LESS arrow'               : function() {
                                                    try {
                                                        ASSERT_LESS(42, 42, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (Integer 42 >= Integer 42)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_LESS'                 : function() {
                                                    return ASSERT_NOT_LESS(42, 42, "ASSERT_NOT_LESS failed");
                                                },
            'ASSERT_NOT_LESS FAIL'            : function() {
                                                    try {
                                                        ASSERT_NOT_LESS(41, 42, "ASSERT_NOT_LESS failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_NOT_LESS failed (Integer 41 < Integer 42)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_LESS function'        : function() {
                                                    try {
                                                        ASSERT_NOT_LESS(41, 42, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (Integer 41 < Integer 42)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_LESS arrow'           : function() {
                                                    try {
                                                        ASSERT_NOT_LESS(41, 42, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
 
                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (Integer 41 < Integer 42)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_LESS2'                    : function() {
                                                    return ASSERT_LESS("41", "42", "ASSERT_LESS failed");
                                                },
            'ASSERT_LESS2 FAIL'               : function() {
                                                    try {
                                                        ASSERT_LESS("42", "42", "ASSERT_LESS failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_LESS failed (String[2] "42" >= String[2] "42")', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_LESS2 function'           : function() {
                                                    try {
                                                        ASSERT_LESS("42", "42", (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (String[2] "42" >= String[2] "42")', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_LESS2 arrow'              : function() {
                                                    try {
                                                        ASSERT_LESS("42", "42", (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (String[2] "42" >= String[2] "42")', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_LESS2'                : function() {
                                                    return ASSERT_NOT_LESS("42", "42", "ASSERT_NOT_LESS failed");
                                                },
            'ASSERT_NOT_LESS2 FAIL'           : function() {
                                                    try {
                                                        ASSERT_NOT_LESS("41", "42", "ASSERT_NOT_LESS failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_NOT_LESS failed (String[2] "41" < String[2] "42")', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_LESS2 function'       : function() {
                                                    try {
                                                        ASSERT_NOT_LESS("41", "42", (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (String[2] "41" < String[2] "42")', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_LESS2 arrow'          : function() {
                                                    try {
                                                        ASSERT_NOT_LESS("41", "42", (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
 
                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (String[2] "41" < String[2] "42")', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_GREATER'                  : function() {
                                                    return ASSERT_GREATER(43, 42, "ASSERT_GREATER failed");
                                                },
            'ASSERT_GREATER FAIL'             : function() {
                                                    try {
                                                        ASSERT_GREATER(42, 42, "ASSERT_GREATER failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_GREATER failed (Integer 42 <= Integer 42)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_GREATER function'         : function() {
                                                    try {
                                                        ASSERT_GREATER(42, 42, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (Integer 42 <= Integer 42)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_GREATER arrow'            : function() {
                                                    try {
                                                        ASSERT_GREATER(42, 42, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (Integer 42 <= Integer 42)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_GREATER'              : function() {
                                                    return ASSERT_NOT_GREATER(42, 42, "ASSERT_NOT_GREATER failed");
                                                },
            'ASSERT_NOT_GREATER FAIL'         : function() {
                                                    try {
                                                        ASSERT_NOT_GREATER(43, 42, "ASSERT_NOT_GREATER failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_NOT_GREATER failed (Integer 43 > Integer 42)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_GREATER function'     : function() {
                                                    try {
                                                        ASSERT_NOT_GREATER(43, 42, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (Integer 43 > Integer 42)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_GREATER arrow'        : function() {
                                                    try {
                                                        ASSERT_NOT_GREATER(43, 42, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
 
                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (Integer 43 > Integer 42)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_GREATER2'                 : function() {
                                                    return ASSERT_GREATER("43", "42", "ASSERT_GREATER failed");
                                                },
            'ASSERT_GREATER2 FAIL'            : function() {
                                                    try {
                                                        ASSERT_GREATER("42", "42", "ASSERT_GREATER failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_GREATER failed (String[2] "42" <= String[2] "42")', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_GREATER2 function'        : function() {
                                                    try {
                                                        ASSERT_GREATER("42", "42", (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (String[2] "42" <= String[2] "42")', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_GREATER2 arrow'           : function() {
                                                    try {
                                                        ASSERT_GREATER("42", "42", (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (String[2] "42" <= String[2] "42")', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_GREATER2'             : function() {
                                                    return ASSERT_NOT_GREATER("42", "42", "ASSERT_NOT_GREATER failed");
                                                },
            'ASSERT_NOT_GREATER2 FAIL'        : function() {
                                                    try {
                                                        ASSERT_NOT_GREATER("43", "42", "ASSERT_NOT_GREATER failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_NOT_GREATER failed (String[2] "43" > String[2] "42")', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_GREATER2 function'    : function() {
                                                    try {
                                                        ASSERT_NOT_GREATER("43", "42", (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (String[2] "43" > String[2] "42")', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_GREATER2 arrow'       : function() {
                                                    try {
                                                        ASSERT_NOT_GREATER("43", "42", (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
 
                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (String[2] "43" > String[2] "42")', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_IN_DELTA'                 : function() {
                                                    return ASSERT_IN_DELTA(42 + __ASSERTDELTA, 42, __ASSERTDELTA, "ASSERT_IN_DELTA failed");
                                                },
            'ASSERT_IN_DELTA NEG'             : function() {
                                                    return ASSERT_IN_DELTA(-42 + __ASSERTDELTA, -42, __ASSERTDELTA, "ASSERT_IN_DELTA failed");
                                                },
            'ASSERT_IN_DELTA FAIL'            : function() {
                                                    try {
                                                        ASSERT_IN_DELTA(42 + 1.1 * __ASSERTDELTA, 42, __ASSERTDELTA, "ASSERT_IN_DELTA failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_IN_DELTA failed (Number \u203942.0000011\u203A != Integer 42 +/- 0.000001)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_IN_DELTA function'        : function() {
                                                    try {
                                                        ASSERT_IN_DELTA(42 + 1.1 * __ASSERTDELTA, 42, __ASSERTDELTA, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (Number \u203942.0000011\u203A != Integer 42 +/- 0.000001)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_IN_DELTA arrow'           : function() {
                                                    try {
                                                        ASSERT_IN_DELTA(42 + 1.1 * __ASSERTDELTA, 42, __ASSERTDELTA, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (Number \u203942.0000011\u203A != Integer 42 +/- 0.000001)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_IN_DELTA'             : function() {
                                                    return ASSERT_NOT_IN_DELTA(42 + 1.1 * __ASSERTDELTA, 42, __ASSERTDELTA, "ASSERT_NOT_IN_DELTA failed");
                                                },
            'ASSERT_NOT_IN_DELTA NEG'         : function() {
                                                    return ASSERT_NOT_IN_DELTA(-42 + 1.1 * __ASSERTDELTA, -42, __ASSERTDELTA, "ASSERT_NOT_IN_DELTA failed");
                                                },
            'ASSERT_NOT_IN_DELTA FAIL'        : function() {
                                                    try {
                                                        ASSERT_NOT_IN_DELTA(42 + __ASSERTDELTA, 42, __ASSERTDELTA, "ASSERT_NOT_IN_DELTA failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_NOT_IN_DELTA failed (Number \u203942.000001\u203A == Integer 42 +/- 0.000001)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_IN_DELTA function'    : function() {
                                                    try {
                                                        ASSERT_NOT_IN_DELTA(42 + __ASSERTDELTA, 42, __ASSERTDELTA, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (Number \u203942.000001\u203A == Integer 42 +/- 0.000001)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_IN_DELTA arrow'       : function() {
                                                    try {
                                                        ASSERT_NOT_IN_DELTA(42 + __ASSERTDELTA, 42, __ASSERTDELTA, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
 
                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (Number \u203942.000001\u203A == Integer 42 +/- 0.000001)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_IN_EPSILON'               : function() {
                                                    return ASSERT_IN_EPSILON(42 + __ASSERTDELTA, 42, 110000000, __ASSERTEPSILON, "ASSERT_IN_EPSILON failed");
                                                },
            'ASSERT_IN_EPSILON NEG'           : function() {
                                                    return ASSERT_IN_EPSILON(-42 + __ASSERTDELTA, -42, 110000000, __ASSERTEPSILON, "ASSERT_IN_EPSILON failed");
                                                },
            'ASSERT_IN_EPSILON FAIL'          : function() {
                                                    try {
                                                        ASSERT_IN_EPSILON(42 + 1.1 * __ASSERTDELTA, 42, 110000000, __ASSERTEPSILON, "ASSERT_IN_EPSILON failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_IN_EPSILON failed (Number \u203942.0000011\u203A != Integer 42 +/- 0.0000024424906541753444%)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_IN_EPSILON function'      : function() {
                                                    try {
                                                        ASSERT_IN_EPSILON(42 + 1.1 * __ASSERTDELTA, 42, 110000000, __ASSERTEPSILON, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (Number \u203942.0000011\u203A != Integer 42 +/- 0.0000024424906541753444%)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_IN_EPSILON arrow'         : function() {
                                                    try {
                                                        ASSERT_IN_EPSILON(42 + 1.1 * __ASSERTDELTA, 42, 110000000, __ASSERTEPSILON, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (Number \u203942.0000011\u203A != Integer 42 +/- 0.0000024424906541753444%)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_IN_EPSILON'           : function() {
                                                    return ASSERT_NOT_IN_EPSILON(42 + 1.1 * __ASSERTDELTA, 42, 110000000, __ASSERTEPSILON, "ASSERT_NOT_IN_EPSILON failed");
                                                },
            'ASSERT_NOT_IN_EPSILON NEG'       : function() {
                                                    return ASSERT_NOT_IN_EPSILON(-42 + 1.1 * __ASSERTDELTA, -42, 110000000, __ASSERTEPSILON, "ASSERT_NOT_IN_EPSILON failed");
                                                },
            'ASSERT_NOT_IN_EPSILON FAIL'      : function() {
                                                    try {
                                                        ASSERT_NOT_IN_EPSILON(42 + __ASSERTDELTA, 42, 110000000, __ASSERTEPSILON, "ASSERT_NOT_IN_EPSILON failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_NOT_IN_EPSILON failed (Number \u203942.000001\u203A == Integer 42 +/- 0.0000024424906541753444%)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_IN_EPSILON function'  : function() {
                                                    try {
                                                        ASSERT_NOT_IN_EPSILON(42 + __ASSERTDELTA, 42, 110000000, __ASSERTEPSILON, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (Number \u203942.000001\u203A == Integer 42 +/- 0.0000024424906541753444%)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_IN_EPSILON arrow'     : function() {
                                                    try {
                                                        ASSERT_NOT_IN_EPSILON(42 + __ASSERTDELTA, 42, 110000000, __ASSERTEPSILON, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
 
                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (Number \u203942.000001\u203A == Integer 42 +/- 0.0000024424906541753444%)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_OFTYPE'                   : function() {
                                                    return ASSERT_OFTYPE(42, 'Number', "ASSERT_OFTYPE failed");
                                                },
            'ASSERT_OFTYPE FAIL'              : function() {
                                                    try {
                                                        ASSERT_OFTYPE(42, 'Boolean', "ASSERT_OFTYPE failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "ASSERT_OFTYPE failed (Integer 42 ist kein 'Boolean')", "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_OFTYPE function'          : function() {
                                                    try {
                                                        ASSERT_OFTYPE(42, 'Boolean', (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "42 ist die Wahrheit (Integer 42 ist kein 'Boolean')", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_OFTYPE arrow'             : function() {
                                                    try {
                                                        ASSERT_OFTYPE(42, 'Boolean', (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, "ASSERT-Funktionen ist die Wahrheit (Integer 42 ist kein 'Boolean')", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_OFTYPE'               : function() {
                                                    return ASSERT_NOT_OFTYPE(42, 'Boolean', "ASSERT_NOT_OFTYPE failed");
                                                },
            'ASSERT_NOT_OFTYPE FAIL'          : function() {
                                                    try {
                                                        ASSERT_NOT_OFTYPE(42, 'Number', "ASSERT_NOT_OFTYPE failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "ASSERT_NOT_OFTYPE failed (Integer 42 ist 'Number')", "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_OFTYPE function'      : function() {
                                                    try {
                                                        ASSERT_NOT_OFTYPE(42, 'Number', (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "42 ist die Wahrheit (Integer 42 ist 'Number')", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_OFTYPE arrow'         : function() {
                                                    try {
                                                        ASSERT_NOT_OFTYPE(42, 'Number', (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
 
                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, "ASSERT-Funktionen ist die Wahrheit (Integer 42 ist 'Number')", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_TYPEOF'                   : function() {
                                                    return ASSERT_TYPEOF(42, 'number', "ASSERT_TYPEOF failed");
                                                },
            'ASSERT_TYPEOF FAIL'              : function() {
                                                    try {
                                                        ASSERT_TYPEOF(42, 'object', "ASSERT_TYPEOF failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "ASSERT_TYPEOF failed (Integer 42 ist kein 'object')", "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_TYPEOF function'          : function() {
                                                    try {
                                                        ASSERT_TYPEOF(42, 'object', (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "42 ist die Wahrheit (Integer 42 ist kein 'object')", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_TYPEOF arrow'             : function() {
                                                    try {
                                                        ASSERT_TYPEOF(42, 'object', (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, "ASSERT-Funktionen ist die Wahrheit (Integer 42 ist kein 'object')", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_TYPEOF'               : function() {
                                                    return ASSERT_NOT_TYPEOF(42, 'object', "ASSERT_NOT_TYPEOF failed");
                                                },
            'ASSERT_NOT_TYPEOF FAIL'          : function() {
                                                    try {
                                                        ASSERT_NOT_TYPEOF(42, 'number', "ASSERT_NOT_TYPEOF failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "ASSERT_NOT_TYPEOF failed (Integer 42 ist 'number')", "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_TYPEOF function'      : function() {
                                                    try {
                                                        ASSERT_NOT_TYPEOF(42, 'number', (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "42 ist die Wahrheit (Integer 42 ist 'number')", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_TYPEOF arrow'         : function() {
                                                    try {
                                                        ASSERT_NOT_TYPEOF(42, 'number', (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
 
                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, "ASSERT-Funktionen ist die Wahrheit (Integer 42 ist 'number')", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_INSTANCEOF'               : function() {
                                                    return ASSERT_INSTANCEOF(new AssertionFailed('Fehler', "message"), Object, "ASSERT_INSTANCEOF failed");
                                                },
            'ASSERT_INSTANCEOF FAIL'          : function() {
                                                    try {
                                                        ASSERT_INSTANCEOF(new AssertionFailed('Fehler', "message"), Class, "ASSERT_INSTANCEOF failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "ASSERT_INSTANCEOF failed (AssertionFailed[1] { 'message' : String[16] \"message (Fehler)\" } ist kein 'Class')", "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_INSTANCEOF function'      : function() {
                                                    try {
                                                        ASSERT_INSTANCEOF(new AssertionFailed('Fehler', "message"), Class, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "42 ist die Wahrheit (AssertionFailed[1] { 'message' : String[16] \"message (Fehler)\" } ist kein 'Class')", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_INSTANCEOF arrow'         : function() {
                                                    try {
                                                        ASSERT_INSTANCEOF(new AssertionFailed('Fehler', "message"), Class, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, "ASSERT-Funktionen ist die Wahrheit (AssertionFailed[1] { 'message' : String[16] \"message (Fehler)\" } ist kein 'Class')", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_INSTANCEOF'           : function() {
                                                    return ASSERT_NOT_INSTANCEOF(new AssertionFailed('Fehler', "message"), Class, "ASSERT_NOT_INSTANCEOF failed");
                                                },
            'ASSERT_NOT_INSTANCEOF FAIL'      : function() {
                                                    try {
                                                        ASSERT_NOT_INSTANCEOF(new AssertionFailed('Fehler', "message"), Object, "ASSERT_NOT_INSTANCEOF failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "ASSERT_NOT_INSTANCEOF failed (AssertionFailed[1] { 'message' : String[16] \"message (Fehler)\" } ist 'Object')", "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_INSTANCEOF function'  : function() {
                                                    try {
                                                        ASSERT_NOT_INSTANCEOF(new AssertionFailed('Fehler', "message"), Object, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "42 ist die Wahrheit (AssertionFailed[1] { 'message' : String[16] \"message (Fehler)\" } ist 'Object')", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_INSTANCEOF arrow'     : function() {
                                                    try {
                                                        ASSERT_NOT_INSTANCEOF(new AssertionFailed('Fehler', "message"), Object, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
 
                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, "ASSERT-Funktionen ist die Wahrheit (AssertionFailed[1] { 'message' : String[16] \"message (Fehler)\" } ist 'Object')", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_INSTANCEOF2'              : function() {
                                                    return ASSERT_INSTANCEOF(new Number(42), Number, "ASSERT_INSTANCEOF failed");
                                                },
            'ASSERT_INSTANCEOF2 FAIL'         : function() {  // Number() liefert nur Primitive...
                                                    try {
                                                        ASSERT_INSTANCEOF(Number(42), Number, "ASSERT_INSTANCEOF failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "ASSERT_INSTANCEOF failed (Integer 42 ist kein 'Number')", "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_INSTANCEOF2 function'     : function() {  // Number() liefert nur Primitive...
                                                    try {
                                                        ASSERT_INSTANCEOF(Number(42), Number, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "42 ist die Wahrheit (Integer 42 ist kein 'Number')", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_INSTANCEOF2 arrow'        : function() {  // Number() liefert nur Primitive...
                                                    try {
                                                        ASSERT_INSTANCEOF(Number(42), Number, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, "ASSERT-Funktionen ist die Wahrheit (Integer 42 ist kein 'Number')", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_INSTANCEOF2'          : function() {  // Number() liefert nur Primitive...
                                                    return ASSERT_NOT_INSTANCEOF(Number(42), Number, "ASSERT_NOT_INSTANCEOF failed");
                                                },
            'ASSERT_NOT_INSTANCEOF2 FAIL'     : function() {
                                                    try {
                                                        ASSERT_NOT_INSTANCEOF(new Number(42), Number, "ASSERT_NOT_INSTANCEOF failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "ASSERT_NOT_INSTANCEOF failed (Object {} ist 'Number')", "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_INSTANCEOF2 function' : function() {
                                                    try {
                                                        ASSERT_NOT_INSTANCEOF(new Number(42), Number, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, "42 ist die Wahrheit (Object {} ist 'Number')", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_INSTANCEOF2 arrow'    : function() {
                                                    try {
                                                        ASSERT_NOT_INSTANCEOF(new Number(42), Number, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
 
                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, "ASSERT-Funktionen ist die Wahrheit (Object {} ist 'Number')", "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_MATCH'                    : function() {
                                                    return ASSERT_MATCH("Burgers", /B.*u.*g.*s/, "ASSERT_MATCH failed");
                                                },
            'ASSERT_MATCH FAIL'               : function() {
                                                    try {
                                                        ASSERT_MATCH("Burgers", /B.+u.+g.+s/, "ASSERT_MATCH failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_MATCH failed (String[7] "Burgers" hat nicht das Muster /B.+u.+g.+s/)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_MATCH function'           : function() {
                                                    try {
                                                        ASSERT_MATCH("Burgers", /B.+u.+g.+s/, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (String[7] "Burgers" hat nicht das Muster /B.+u.+g.+s/)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_MATCH arrow'              : function() {
                                                    try {
                                                        ASSERT_MATCH("Burgers", /B.+u.+g.+s/, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");

                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (String[7] "Burgers" hat nicht das Muster /B.+u.+g.+s/)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_MATCH'                : function() {
                                                    return ASSERT_NOT_MATCH("Burgers", /B.+u.+g.+s/, "ASSERT_NOT_MATCH failed");
                                                },
            'ASSERT_NOT_MATCH FAIL'           : function() {
                                                    try {
                                                        ASSERT_NOT_MATCH("Burgers", /B.*u.*g.*s/, "ASSERT_NOT_MATCH failed");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_NOT_MATCH failed (String[7] "Burgers" hat das Muster /B.*u.*g.*s/)', "Fehler bei der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_MATCH function'       : function() {
                                                    try {
                                                        ASSERT_NOT_MATCH("Burgers", /B.*u.*g.*s/, (function(param) {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (String[7] "Burgers" hat das Muster /B.*u.*g.*s/)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            'ASSERT_NOT_MATCH arrow'          : function() {
                                                    try {
                                                        ASSERT_NOT_MATCH("Burgers", /B.*u.*g.*s/, (param => {
                                                                const __RET = this.desc + ' ' + param;
                                                                return __RET;
                                                            }), { 'desc' : 42 }, "ist die Wahrheit");
                                                    } catch (ex) {
                                                        ASSERT_SET(ex, "Exception ist leer");
                                                        ASSERT_INSTANCEOF(ex, AssertionFailed, "Fehler ist kein AssertionFailed");
                                                        ASSERT_SET(ex.message, "Exception message fehlt");
 
                                                        // this-Parameter wird bei => nicht modifiziert, daher zeigt this auf das Test-Objekt (ohne this.desc)...
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (String[7] "Burgers" hat das Muster /B.*u.*g.*s/)', "Fehler beim Zusammensetzen der Fehlermeldung");

                                                        // Fehler wurde erkannt...
                                                        return true;
                                                    }

                                                    return ASSERT(false, "kein Fehler", "ASSERT hat Fehler nicht erkannt");
                                                },
            '__ASSERTDELTA'                   : function() {
                                                    return ASSERT_IN_DELTA(__ASSERTDELTA, 0, 0.00001, "__ASSERTDELTA zu gro\DF");
                                                },
            '__ASSERTEPSILON'                 : function() {
                                                    return ASSERT_IN_DELTA(__ASSERTEPSILON, 0, __ASSERTDELTA * __ASSERTDELTA, "__ASSERTEPSILON zu gro\DF");
                                                }
        });

// ==================== Ende Abschnitt fuer ASSERT-Funktionen ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu test.assert ====================

// *** EOF ***

/*** Ende Modul test.assert.test.js ***/

/*** Modul test.class.unittest.test.js ***/

// ==UserModule==
// _name         test.class.unittest.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Basisklasse fuer Unit-Tests fuer ein JS-Modul
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/test.class.unittest.test.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu test.class.unittest ====================

(() => {

// ==================== Konfigurations-Abschnitt fuer Optionen ====================

//const __SHOWMODULECOUNT = false;    // Zeige Spalte mit Anzahl der Module
//const __SHOWUNITTESTDESC = false;   // Beschreibung als Tooltip (false) oder Text (true)
//const __TESTLOGLEVEL = 9;           // Logs ausfuehrlich (9) oder normal (4)

// ==================== Abschnitt fuer Klasse UnitTest ====================

    const __TESTDATA = {
            'loadOption'    : [ "saison",   42,         19,             false,  undefined   ],
        };

    new UnitTest('test.class.unittest.js', "Klasse UnitTest", {
//            'loadOption'          : function() {
//                                        
//                                    }
        });

//function UnitTest(name, desc, tests, load) {
//Class.define(UnitTest, Object, {
//            'register'    : function(name, desc, tests, load, thisArg) {
//            'addTest'     : function(name, tFun, desc = undefined) {
//            'prepare'     : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
//            'cleanup'     : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
//            'setup'       : async function(name, desc, testFun, thisArg) {
//            'teardown'    : async function(name, desc, testFun, thisArg) {
//            'run'         : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
//UnitTest.runAll = async function(minLevel = 1, resultFun = UnitTest.defaultResultFun, tableId, resultObj, thisArg) {
//UnitTest.defaultResultFun = function(resultObj, tableId, doc = document) {
//UnitTest.getOrCreateTestResultTable = function(tableId = 'UnitTest', doc = document) {
//UnitTest.getStyleFromResults = function(results) {

// ==================== Ende Abschnitt fuer Klasse UnitTest ====================

// ==================== Abschnitt fuer Klasse UnitTestResults ====================

//function UnitTestResults(libName, libDesc, libTest) {
//Class.define(UnitTestResults, Object, {
//                'module'              : function() {
//                'running'             : function() {
//                'success'             : function() {
//                'failed'              : function() {
//                'exception'           : function(ex) {
//                'error'               : function(ex) {
//                'checkResult'         : function(result) {
//                'checkException'      : function(ex) {
//                'merge'               : function(resultsToAdd) {
//                'sum'                 : function() {

// ==================== Ende Abschnitt fuer Klasse UnitTestResults ====================

// ==================== Abschnitt fuer globale Variablen ====================

//const __ALLLIBS = { };
//const __LIBRESULTS = { };

// ==================== Ende Abschnitt fuer globale Variablen ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu test.class.unittest ====================

// *** EOF ***

/*** Ende Modul test.class.unittest.test.js ***/

/*** Modul test.lib.option.test.js ***/

// ==UserModule==
// _name         test.lib.option.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Basisklasse fuer Unit-Tests fuer ein JS-Modul
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.lib.option.js
// _require      https://eselce.github.io/OS2.scripts/test/test.lib.option.test.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu test.lib.option ====================

(() => {

// ==================== Abschnitt fuer Klasse UnitTestOption ====================

    const __TESTDATA = {
            'loadOption'    : [ "saison",   42,         19,             false,  undefined   ],
        };

    new UnitTest('test.lib.option.js', "Klasse UnitTestOption", {
//            'loadOption'          : function() {
//                                        
//                                    }
        });

//function UnitTestOption(name, desc, tests, load) {
//Class.define(UnitTestOption, UnitTest, {
//            'prepare'     : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
//            'cleanup'     : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
//            'setup'       : async function(name, desc, testFun, thisArg) {
//            'teardown'    : async function(name, desc, testFun, thisArg) {

// ==================== Ende Abschnitt fuer Klasse UnitTestOption ====================

// ==================== Ende Abschnitt fuer Test-Konfiguration __TESTCONFIG ====================

//const __TESTOPTCONFIG = {
//    'saison' : {          // Laufende Saison
//    'ligaSize' : {        // Ligengroesse
//    'datenZat' : {        // Stand der Daten zum Team und ZAT
//    'team' : {            // Datenspeicher fuer Daten des Erst- bzw. Zweitteams
//    'reset' : {           // Optionen auf die "Werkseinstellungen" zuruecksetzen
//    'storage' : {         // Browserspeicher fuer die Klicks auf Optionen
//    'oldStorage' : {      // Vorheriger Browserspeicher fuer die Klicks auf Optionen
//    'showForm' : {        // Optionen auf der Webseite (true = anzeigen, false = nicht anzeigen)

// ==================== Ende Abschnitt fuer Test-Konfiguration __TESTCONFIG ====================

// ==================== Spezialisierter Abschnitt fuer Optionen ====================

//const __TESTTEAMCLASS = new TeamClassification();
//__TESTTEAMCLASS.optSelect = {

// ==================== Ende Abschnitt fuer Optionen ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu test.lib.option ====================

// *** EOF ***

/*** Ende Modul test.lib.option.test.js ***/

/*** Modul test.mock.gm.test.js ***/

// ==UserModule==
// _name         test.mock.gm.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Mock-Funktionen als Ersatz fuer Greasemonkey-Einbindung
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.mock.gm.js
// _require      https://eselce.github.io/OS2.scripts/test/test.mock.gm.test.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu test.mock.gm ====================

(() => {

// ==================== Abschnitt fuer Mock GM3-Funktionen ====================

    const __TESTDATA = {
            'loadOption'    : [ "saison",   42,         19,             false,  undefined   ],
        };

    new UnitTest('test.mock.gm.js', "Mock GM3-Funktionen", {
//            'loadOption'          : function() {
//                                        
//                                    }
        });

//this.GM_getValue = function(name, defaultValue) {  // Mock GM_getValue function
//this.GM_setValue = function(name, value) {  // Mock GM_setValue function
//this.GM_deleteValue = function(name) {  // Mock GM_deleteValue function
//this.GM_listValues = function() {  // Mock GM_listValues function
//const __MOCKSTORAGE = { };

// ==================== Ende Abschnitt fuer Mock GM3-Funktionen ====================

// ==================== Abschnitt fuer Mock GM4-Objekt ====================

//this.GM = { };
//this.GM['info'] = { };
//const GM_INFO = this.GM.info;
//GM_INFO['scriptHandler'] = "Mock Script Handler";
//GM_INFO['version'] = "0.10";
//if ((typeof __DBMAN.scriptHandler) === 'undefined') {
//Object.entries({
//        'GM_deleteValue' : 'deleteValue',
//        'GM_getValue'    : 'getValue',
//        'GM_listValues'  : 'listValues',
//        'GM_setValue'    : 'setValue'
//    }).forEach(([oldKey, newKey]) => {

// ==================== Ende Abschnitt fuer Mock GM4-Objekt ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu test.mock.gm ====================

// *** EOF ***

/*** Ende Modul test.mock.gm.test.js ***/

/*** Modul util.class.uri.test.js ***/

// ==UserModule==
// _name         util.class.uri.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2023+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Details zu Objekten, Arrays, etc.
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.delim.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.path.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.uri.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/util.class.uri.test.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.class.uri ====================

(() => {

// ==================== Abschnitt fuer diverse Utilities fuer URLs etc. ====================

    const __TESTDATA = {
            'formatParamsUnform'    : [ { "saison" : 19, "ZAT" : 15 },  ' ',    '=',    "saison=19 ZAT=15",         'string'    ],
            'formatParamsString'    : [ { "saison" : 19, "ZAT" : 15 },  ' ',    '=',    'saison="19" ZAT="15"',     'string'    ],
            'formatParamsObjForm'   : [ { "saison" : 19, "ZAT" : 15 },  ', ',   ' : ',  "saison : 19, ZAT : 15",    'string'    ],
            'formatParamsEmpty'     : [ null,                           ' ',    '=',    "",                         'string'    ],
        };

    new UnitTest('util.class.uri.js', "Klasse URI fuer URLs etc.", {
//               'setDelims'         : function() {
//               'setSchemeDelim'    : function(schemeDelim = undefined) {
//               'setQueryDelim'     : function(queryDelim = undefined) {
//               'setParSepDelim'    : function(parSepDelim = undefined) {
//               'setParAssDelim'    : function(parAssDelim = undefined) {
//               'setNodeDelim'      : function(nodeDelim = undefined) {
//               'getServerPath'     : function(path = undefined) {
//               'getHostPort'       : function(path = undefined) {
//               'stripHostPort'     : function(path = undefined) {
//               'getSchemePrefix'   : function(path = undefined) {
//               'stripSchemePrefix' : function(path = undefined) {
//               'getNodeSuffix'     : function(path = undefined) {
//               'stripNodeSuffix'   : function(path = undefined) {
//               'getQueryString'    : function(path = undefined) {
//               'stripQueryString'  : function(path = undefined) {

            'formatParamsUnform'              : function() {
                                                    const [ __VAL, __DLM, __ASS, __EXP, __TYPE ] = __TESTDATA['formatParamsUnform'];
                                                    const __FORMATFUN = undefined;
                                                    const __RET = URI.prototype.formatParams(__VAL, __FORMATFUN, __DLM, __ASS);

                                                    ASSERT_EQUAL(__RET, __EXP, "formatParams() muss String zur\u00FCckgeben");

                                                    return ASSERT_TYPEOF(__RET, __TYPE, "formatParams() muss String zur\u00FCckgeben");
                                                },
            'formatParamsString'              : function() {
                                                    const [ __VAL, __DLM, __ASS, __EXP, __TYPE ] = __TESTDATA['formatParamsString'];
                                                    const __FORMATFUN = function(value) {
                                                                            return '"' + value + '"';
                                                                        };
                                                    const __RET = URI.prototype.formatParams(__VAL, __FORMATFUN, __DLM, __ASS);

                                                    ASSERT_EQUAL(__RET, __EXP, "formatParams() muss String zur\u00FCckgeben");

                                                    return ASSERT_TYPEOF(__RET, __TYPE, "formatParams() muss String zur\u00FCckgeben");
                                                },
            'formatParamsObjForm'             : function() {
                                                    const [ __VAL, __DLM, __ASS, __EXP, __TYPE ] = __TESTDATA['formatParamsObjForm'];
                                                    const __FORMATFUN = sameValue;
                                                    const __RET = URI.prototype.formatParams(__VAL, __FORMATFUN, __DLM, __ASS);

                                                    ASSERT_EQUAL(__RET, __EXP, "formatParams() muss String zur\u00FCckgeben");

                                                    return ASSERT_TYPEOF(__RET, __TYPE, "formatParams() muss String zur\u00FCckgeben");
                                                },
            'formatParamsEmpty'               : function() {
                                                    const [ __VAL, __DLM, __ASS, __EXP, __TYPE ] = __TESTDATA['formatParamsEmpty'];
                                                    const __FORMATFUN = sameValue;
                                                    const __RET = URI.prototype.formatParams(__VAL, __FORMATFUN, __DLM, __ASS);

                                                    ASSERT_EQUAL(__RET, __EXP, "formatParams() muss String zur\u00FCckgeben");

                                                    return ASSERT_TYPEOF(__RET, __TYPE, "formatParams() muss String zur\u00FCckgeben");
                                                },

//               'parseParams'       : function(params, parseFun, delim = ' ', assign = '=') {
//               'rawValue'          : function(value) {
//               'parseValue'        : function(value) {
//               'getQuery'          : function(delims = { }) {
//               'parseQuery'        : function(path = undefined, delims = { }) {
//               'setQuery'          : function(query) {
//               'setQueryPar'       : function(key, value) {
//               'getPath'           : function(dirs = undefined, delims = undefined) {
//               'getDirs'           : function(path = undefined, delims) {
        });

// ==================== Ende Abschnitt fuer diverse Utilities fuer URLs etc. ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.class.uri ====================

// *** EOF ***

/*** Ende Modul util.class.uri.test.js ***/

/*** Modul util.debug.test.js ***/

// ==UserModule==
// _name         util.debug.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Debugging, Error-Handling, usw.
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/util.debug.test.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.debug ====================

(() => {

// ==================== Abschnitt fuer Debugging und Error-Handling ====================

    const __TESTDATA = {
            'loadOption'    : [ "saison",   42,         19,             false,  undefined   ],
        };

    new UnitTest('util.debug.js', "Utilities zu Debugging und Error-Handling", {
//            'loadOption'          : function() {
//                                        
//                                    }
        });

//function showAlert(label, message, data = undefined, show = true) {
//function askUser(message, dflt, acceptFun) {
//function showException(label, ex, show = true) {
//function defaultCatch(error, show) {

// ==================== Hilfsfunktionen fuer Typueberpruefungen ====================

//function checkObjClass(obj, cls, strict = false, label = "", objName = undefined, className = undefined) {
//function checkType(value, type, strict = false, label = "", valName = undefined, typeName = undefined) {
//function checkEnumObj(value, enumObj, strict = false, label = "", valName = undefined, enumName = undefined) {

// ==================== Ende Hilfsfunktionen fuer Typueberpruefungen ====================

//function codeLineFor(ex, longForm = false, showFunName = false, ignoreCaller = false, ignoreLibs = true) {
//function codeLine(longForm = false, showFunName = false, ignoreCaller = false, ignoreLibs = true) {
//function checkCodeLineBlacklist(funName, fileName, strictFileName = false) {
//const __CODELINEBLACKLIST = {
//const __CODELINEBLACKLISTREGEXP = {

// ==================== Ende Abschnitt fuer Debugging, Error-Handling ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.debug ====================

// *** EOF ***

/*** Ende Modul util.debug.test.js ***/

/*** Modul util.log.test.js ***/

// ==UserModule==
// _name         util.log.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Logging und safeStringify()
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/util.log.test.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.log ====================

(() => {

// ==================== Abschnitt fuer Logging ====================

    // Funktionalitaet der Logging-Funktionen...
    new UnitTest('util.log.js Logging', "Tools zum Loggen von Meldungen", {
            'logFun'              : function() {
                                        const __LOGFUN = __LOG.logFun;

                                        ASSERT_EQUAL(__LOGFUN.length, 10, "logFun[] ben\u00F6tigt 10 Funktionen");  // 0, ..., 9

                                        __LOGFUN.forEach((fun, index) => {
                                                ASSERT_TYPEOF(fun, 'function', "logFun[" + index + " muss eine Funktion sein");
                                            });

                                        return true;
                                    }
        });

//const __LOG = {
//                  'init'      : function(win, logLevel = 4, show = true) {
//                  'createFun' : function(name, fun, bindTo = undefined) {
//                  'stringify' : safeStringify,      // JSON.stringify
//                  'info'      : function(obj, showType = true, elementType = false) {
//                  'changed'   : function(oldVal, newVal, showType, elementType, delim = " => ") {

// ==================== Ende Abschnitt fuer Logging ====================

// ==================== Abschnitt fuer UNUSED() ====================

//function UNUSED(... unused) {

// ==================== Ende Abschnitt fuer UNUSED() ====================

// ==================== Abschnitt fuer safeStringify() ====================

//function safeStringify(value, replacer = undefined, space = undefined, cycleReplacer = undefined) {
//function serializer(replacer = undefined, cycleReplacer = undefined) {
//cycleReplacer = function(key, value) {
//function replaceArraySimple(key, value) {
//function replaceArray(key, value) {

// ==================== Ende Abschnitt fuer safeStringify() ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.log ====================

// *** EOF ***

/*** Ende Modul util.log.test.js ***/

/*** Modul util.object.test.js ***/

// ==UserModule==
// _name         util.object.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Details zu Objekten, Arrays, etc.
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/util.object.test.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.object ====================

(() => {

// ==================== Abschnitt fuer diverse Utilities fuer Object, Array, etc. ====================

// ==================== Abschnitt fuer detaillierte Ausgabe von Daten ====================

    const __TESTDATA = {
            'loadOption'    : [ "saison",   42,         19,             false,  undefined   ],
        };

    new UnitTest('util.object.js', "Utilities fuer Object, Array, etc.", {
//            'loadOption'          : function() {
//                                        
//                                    }
        });

//Object.Map = function(obj, mapFun, thisArg, filterFun, sortFun) {
//function getObjInfo(obj, keyStrings, longForm, stepIn) {
//function getValStr(obj, keyStrings, showType, showLen, stepIn) {

// ==================== Ende Abschnitt fuer detaillierte Ausgabe von Daten ====================

// ==================== Abschnitt Hilfsfunktionen fuer Array-Mapping ====================

//function Arrayfrom(obj, mapFun, thisArg) {
//function reverseArray(obj, keyValFun, valuesFun, valKeyFun) {

// ==================== Ende Abschnitt Hilfsfunktionen fuer Array-Mapping ====================

// ==================== Abschnitt Hilfsfunktionen fuer Object-Mapping ====================

//function reverseMapping(obj, keyValFun, valuesFun, valKeyFun) {
//function selectMapping(obj, keyIndex = -1, valueIndex = 0, keyValFun, valKeyFun) {
//function mappingPush(value, key, obj) {
//function mappingSetOrPush(value, key, obj) {
//function mappingPushFun(valueFun) {
//function mappingSetOrPushFun(valueFun) {
//function mappingValueSelect(index, keyValFun = null, value, key, obj, oldObj) {
//function mappingValuesFunSelect(index, obj) {

// ==================== Ende Abschnitt Hilfsfunktionen fuer Object-Mapping ====================

// ==================== Ende Abschnitt fuer diverse Utilities fuer Object, Array, etc. ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.object ====================

// *** EOF ***

/*** Ende Modul util.object.test.js ***/

/*** Modul util.option.api.test.js ***/

// ==UserModule==
// _name         util.option.api.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Zugriff auf die Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.lib.option.js
// _require      https://eselce.github.io/OS2.scripts/test/util.option.api.test.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.option.api ====================

(() => {

// ==================== Abschnitt Operationen auf Optionen ====================

    const __TESTDATA = {
            'prefixName'    : [ "Name",     "Prefix",   "PrefixName"                        ],
            'postfixName'   : [ "Name",     "Postfix",  "NamePostfix"                       ],
            'loadOption'    : [ "saison",   42,         19,             false,  undefined   ]
        };

    new UnitTestOption('util.option.api.js', "Schnittstelle zur Behandlung von Optionen", {
            'loadOption'          : function() {
                                        const [ __NAME, , __EXP ] = __TESTDATA['loadOption'];
                                        const __OPT = this.optSet[__NAME];

                                        return callPromiseChain(invalidateOpt(__OPT, true, false), () => loadOption(__OPT, false), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "loadOption($[" + __LOG.info(__NAME, false) + "]) sollte die aktuelle Saison liefern");
                                            });
                                    },
            'loadOptionForce'     : function() {
                                        const [ __NAME, , __EXP ] = __TESTDATA['loadOption'];
                                        const __OPT = this.optSet[__NAME];

                                        return callPromiseChain(invalidateOpt(__OPT, true, false), () => loadOption(__OPT, true), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "loadOption($[" + __LOG.info(__NAME, false) + "]) sollte die aktuelle Saison liefern");
                                            });
                                    },
            'prefixName'          : function() {
                                        const [ __NAME, __PREFIX, __EXP ] = __TESTDATA['prefixName'];

                                        const __RET = prefixName(__NAME, __PREFIX);

                                        return ASSERT_EQUAL(__RET, __EXP, "Name falsch zusammengesetzt");
                                    },
            'postfixName'         : function() {
                                        const [ __NAME, __POSTFIX, __EXP ] = __TESTDATA['postfixName'];

                                        const __RET = postfixName(__NAME, __POSTFIX);

                                        return ASSERT_EQUAL(__RET, __EXP, "Name falsch zusammengesetzt");
                                    },
            'resetOptions'        : async function() {
                                        const [ __NAME, __VAL, __EXP, __RELOAD ] = __TESTDATA['loadOption'];
                                        const __OPT = this.optSet[__NAME];

                                        await callPromiseChain(new Promise(function(resolve, reject) { return setOpt(__OPT, __VAL, __RELOAD, resolve, reject); }), () => getOptValue(__OPT), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "getOptValue($[" + __LOG.info(__NAME, false) + "]) sollte die gesetzte Saison liefern");
                                            });

                                        return callPromiseChain(resetOptions(this.optSet, __RELOAD), () => getOptValue(__OPT), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "getOptValue($[" + __LOG.info(__NAME, false) + "]) sollte die Default-Saison liefern");
                                            });
                                    },
            'loadOptValue'        : function() {
                                        const [ __NAME, , __EXP ] = __TESTDATA['loadOption'];
                                        const __OPT = this.optSet[__NAME];

                                        return callPromiseChain(loadOptValue(__OPT), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "loadOption($[" + __LOG.info(__NAME, false) + "]) sollte die aktuelle Saison liefern");
                                            });
                                    },
            'loadOptValueDefault' : function() {
                                        const [ __NAME, , __EXP, __RELOAD, __ALT ] = __TESTDATA['loadOption'];
                                        const __OPT = this.optSet[__NAME];

                                        return callPromiseChain(new Promise(function(resolve, reject) { return setOpt(__OPT, __ALT, __RELOAD, resolve, reject); }), () => loadOptValue(__OPT, __EXP), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "loadOption($[" + __LOG.info(__NAME, false) + "]) sollte die aktuelle Saison liefern");
                                            });
                                    },
            'loadOptValueSync'    : function() {
                                        const [ __NAME, , __EXP, , __ALT ] = __TESTDATA['loadOption'];
                                        const __ASYNC = false;
                                        const __OPT = this.optSet[__NAME];

                                        return callPromiseChain(Promise.resolve(loadOptValue(__OPT, __ALT, __ASYNC)), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "loadOption($[" + __LOG.info(__NAME, false) + "]) sollte die aktuelle Saison liefern");
                                            });
                                    }
        });

//function invalidateOpt(opt, force = false, reload = true) {
//async function invalidateOpts(optSet, force = false, reload = true) {
//function loadOption(opt, force = false) {
//function loadOptions(optSet, force = false) {
//function deleteOption(opt, force = false, reset = true) {
//async function deleteOptions(optSet, optSelect = undefined, force = false, reset = true) {
//function saveOption(opt) {
//async function saveOptions(optSet, optSelect = undefined) {
//async function renameOption(opt, name, reload = false, force = false) {
//function prefixName(name, prefix) {
//function postfixName(name, postfix) {
//async function renameOptions(optSet, optSelect, renameParam = undefined, renameFun = prefixName) {
//async function resetOptions(optSet, reload = true) {
//function loadOptValue(opt, defValue = undefined, asyncLoad = true, force = false) {

// ==================== Ende Abschnitt Operationen auf Optionen ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.option.api ====================

// *** EOF ***

/*** Ende Modul util.option.api.test.js ***/

/*** Modul util.promise.test.js ***/

// ==UserModule==
// _name         util.promise.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Details zu Objekten, Arrays, etc.
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/util.promise.test.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.promise ====================

(() => {

// ==================== Abschnitt fuer Test-Werkzeuge ====================

    const __RESOLVED = (() => Promise.resolve(true));
    const __REJECTED = (() => Promise.reject(false));
    const __ERRORMSG = "Erroneous";
    const __ERRONEOUS = function() { throw Error(__ERRORMSG); };
    const __USEDCASE = sameValue;

    // Funktionalitaet der ASSERT-Funktionen...
    new UnitTest('test.assert.js Tools', "Test-Werkzeuge", {
            'callPromiseChainSimpleOK'        : function() {
                                                    return callPromiseChain(__RESOLVED()).then(value => {
                                                            return ASSERT_TRUE(value, "Falsche R\u00FCckgabe in Promise");
                                                        }, ex => {
                                                            return ASSERT(false, __LOG.info(ex), "Promise wurde rejected");
                                                        });
                                                },
            'callPromiseChainSimpleFAIL'      : function() {
                                                    return callPromiseChain(__REJECTED()).then(value => {
                                                            return ASSERT(false, __LOG.info(value), "Promise wurde nicht rejected");
                                                        }, ex => {
                                                            return ASSERT_FALSE(ex, "Falsche R\u00FCckgabe in Rejection");
                                                        });
                                                },
            'callPromiseChainUsedCaseOK'      : function() {
                                                    return callPromiseChain(__RESOLVED(), __USEDCASE).then(value => {
                                                            return ASSERT_TRUE(value, "Falsche R\u00FCckgabe in Promise");
                                                        }, ex => {
                                                            return ASSERT(false, __LOG.info(ex), "Promise wurde rejected");
                                                        });
                                                },
            'callPromiseChainUsedCaseFAIL'    : function() {
                                                    return callPromiseChain(__REJECTED(), __USEDCASE).then(value => {
                                                            return ASSERT(false, __LOG.info(value), "Promise wurde nicht rejected");
                                                        }, ex => {
                                                            return ASSERT_FALSE(ex, "Falsche R\u00FCckgabe in Rejection");
                                                        });
                                                },
            'callPromiseChainErroneousOK'     : function() {
                                                    return callPromiseChain(__RESOLVED(), __ERRONEOUS).then(value => {
                                                            return ASSERT(false, __LOG.info(value), "Promise wurde nicht rejected");
                                                        }, async ex => {
                                                            ASSERT_INSTANCEOF(ex, Error, "Promise muss Error zur\u00FCckgeben");
                                                            ASSERT_EQUAL(ex.message, __ERRORMSG, "Fehlertext in Error falsch");
                                                            ASSERT_EQUAL(ex.index, 0, "Fehler in erster Funktion wurde ignoriert");
                                                            ASSERT_EQUAL(ex.function, __ERRONEOUS, "Fehler in erster Funktion wurde ignoriert");
                                                            ASSERT_EQUAL(ex.array.length, 1, "Falsche Array-Gr\u00F6\u00DFe");
                                                            ASSERT_EQUAL(ex.array, [ __ERRONEOUS ], "Falsches Funktionen-Array");

                                                            return await ex.param.then(value => ASSERT_TRUE(value, "Falsche R\u00FCckgabe in Promise")).catch(assertionCatch);
                                                        });
                                                },
            'callPromiseChainErroneousFAIL'   : function() {
                                                    return callPromiseChain(__REJECTED(), __ERRONEOUS).then(value => {
                                                            return ASSERT(false, __LOG.info(value), "Promise wurde nicht rejected");
                                                        }, ex => {
                                                            return ASSERT_FALSE(ex, "Falsche R\u00FCckgabe in Rejection");
                                                        });
                                                },
            'callPromiseChainUsedUsedOK'      : function() {
                                                    return callPromiseChain(__RESOLVED(), __USEDCASE, __USEDCASE).then(value => {
                                                            return ASSERT_TRUE(value, "Falsche R\u00FCckgabe in Promise");
                                                        }, ex => {
                                                            return ASSERT(false, __LOG.info(ex), "Promise wurde rejected");
                                                        });
                                                },
            'callPromiseChainUsedUsedFAIL'    : function() {
                                                    return callPromiseChain(__REJECTED(), __USEDCASE, __USEDCASE).then(value => {
                                                            return ASSERT(false, __LOG.info(value), "Promise wurde nicht rejected");
                                                        }, ex => {
                                                            return ASSERT_FALSE(ex, "Falsche R\u00FCckgabe in Rejection");
                                                        });
                                                },
            'callPromiseChainUsedFailOK'      : function() {
                                                    return callPromiseChain(__RESOLVED(), __USEDCASE, __ERRONEOUS).then(value => {
                                                            return ASSERT(false, __LOG.info(value), "Promise wurde nicht rejected");
                                                        }, async ex => {
                                                            ASSERT_INSTANCEOF(ex, Error, "Promise muss Error zur\u00FCckgeben");
                                                            ASSERT_EQUAL(ex.message, __ERRORMSG, "Fehlertext in Error falsch");
                                                            ASSERT_EQUAL(ex.index, 1, "Fehler in zweiter Funktion wurde ignoriert");
                                                            ASSERT_EQUAL(ex.function, __ERRONEOUS, "Fehler in zweiter Funktion wurde ignoriert");
                                                            ASSERT_EQUAL(ex.array.length, 2, "Falsche Array-Gr\u00F6\u00DFe");
                                                            ASSERT_EQUAL(ex.array, [ __USEDCASE, __ERRONEOUS ], "Falsches Funktionen-Array");

                                                            return await ex.param.then(value => ASSERT_TRUE(value, "Falsche R\u00FCckgabe f\u00FCr Promise-Parameter")).catch(assertionCatch);
                                                        });
                                                },
            'callPromiseChainUsedFailFAIL'    : function() {
                                                    return callPromiseChain(__REJECTED(), __USEDCASE, __ERRONEOUS).then(value => {
                                                            return ASSERT(false, __LOG.info(value), "Promise wurde nicht rejected");
                                                        }, ex => {
                                                            return ASSERT_FALSE(ex, "Falsche R\u00FCckgabe in Rejection");
                                                        });
                                                },
            'callPromiseChainFailUsedOK'      : function() {
                                                    return callPromiseChain(__RESOLVED(), __ERRONEOUS, __USEDCASE).then(value => {
                                                            return ASSERT(false, __LOG.info(value), "Promise wurde nicht rejected");
                                                        }, async ex => {
                                                            ASSERT_INSTANCEOF(ex, Error, "Promise muss Error zur\u00FCckgeben");
                                                            ASSERT_EQUAL(ex.message, __ERRORMSG, "Fehlertext in Error falsch");
                                                            ASSERT_EQUAL(ex.index, 0, "Fehler in erster Funktion wurde ignoriert");
                                                            ASSERT_EQUAL(ex.function, __ERRONEOUS, "Fehler in erster Funktion wurde ignoriert");
                                                            ASSERT_EQUAL(ex.array.length, 2, "Falsche Array-Gr\u00F6\u00DFe");
                                                            ASSERT_EQUAL(ex.array, [ __ERRONEOUS, __USEDCASE ], "Falsches Funktionen-Array");

                                                            return await ex.param.then(value => ASSERT_TRUE(value, "Falsche R\u00FCckgabe f\u00FCr Promise-Parameter")).catch(assertionCatch);
                                                        });
                                                },
            'callPromiseChainFailUsedFAIL'    : function() {
                                                    return callPromiseChain(__REJECTED(), __ERRONEOUS, __USEDCASE).then(value => {
                                                            return ASSERT(false, __LOG.info(value), "Promise wurde nicht rejected");
                                                        }, ex => {
                                                            return ASSERT_FALSE(ex, "Falsche R\u00FCckgabe in Rejection");
                                                        });
                                                },
            'callPromiseChainFailFailOK'      : function() {
                                                    return callPromiseChain(__RESOLVED(), __ERRONEOUS, __ERRONEOUS).then(value => {
                                                            return ASSERT(false, __LOG.info(value), "Promise wurde nicht rejected");
                                                        }, async ex => {
                                                            ASSERT_INSTANCEOF(ex, Error, "Promise muss Error zur\u00FCckgeben");
                                                            ASSERT_EQUAL(ex.message, __ERRORMSG, "Fehlertext in Error falsch");
                                                            ASSERT_EQUAL(ex.index, 0, "Fehler in erster Funktion wurde ignoriert");
                                                            ASSERT_EQUAL(ex.function, __ERRONEOUS, "Fehler in erster Funktion wurde ignoriert");
                                                            ASSERT_EQUAL(ex.array.length, 2, "Falsche Array-Gr\u00F6\u00DFe");
                                                            ASSERT_EQUAL(ex.array, [ __ERRONEOUS, __ERRONEOUS ], "Falsches Funktionen-Array");

                                                            return await ex.param.then(value => ASSERT_TRUE(value, "Falsche R\u00FCckgabe f\u00FCr Promise-Parameter")).catch(assertionCatch);
                                                        });
                                                },
            'callPromiseChainFailFailFAIL'    : function() {
                                                    return callPromiseChain(__REJECTED(), __ERRONEOUS, __ERRONEOUS).then(value => {
                                                            return ASSERT(false, __LOG.info(value), "Promise wurde nicht rejected");
                                                        }, ex => {
                                                            return ASSERT_FALSE(ex, "Falsche R\u00FCckgabe in Rejection");
                                                        });
                                                },
        });

// ==================== Ende Abschnitt fuer Test-Werkzeuge ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.promise ====================

// *** EOF ***

/*** Ende Modul util.promise.test.js ***/

/*** Modul util.store.test.js ***/

// ==UserModule==
// _name         util.store.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Script-Optionen im Benutzermenue
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/util.store.test.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.store ====================

(() => {

// ==================== Abschnitt fuer Startroutinen und Datenspeicherungs-Filter ====================

    // Hilfsfunktionen und Hilfsdaten; Startroutinen und Datenspeicherungs-Filter
    new UnitTest('util.store.js Basis', "Startroutinen und Datenspeicherungs-Filter", {
            '__GMWRITE'           : function() {
                                        return ASSERT_TRUE(__GMWRITE, "Schreiben von Daten nicht aktiviert");
                                    },
            '__SCRIPTINIT'        : async function() {
                                        __SCRIPTINIT.length = 0;  // Starterliste leeren...

                                        return callPromiseChain(startMain(), value => {
                                                const __RET = value;

                                                ASSERT_ZERO(__RET, "startMain() darf keinen Eintrag verarbeiten");

                                                return ASSERT_ZERO(__SCRIPTINIT.length, "__SCRIPTINIT ist nicht leer! Eventuell startMain() nicht ausgef\u00FChrt?");
                                            }).catch(startMain);
                                    },
            'registerStartFun'    : async function() {
                                        __SCRIPTINIT.length = 0;  // Starterliste leeren...

                                        return callPromiseChain(registerStartFun(() => undefined), value => {
                                                const __RET = value;

                                                ASSERT_ONE(__RET, "registerStartFun() lieferte falschen R\u00FCckgabewert");

                                                return ASSERT_ONE(__SCRIPTINIT.length, "__SCRIPTINIT muss genau einen Eintrag haben");
                                            }, startMain, value => {
                                                const __RET = value;

                                                ASSERT_ONE(__RET, "startMain() muss genau einen Eintrag verarbeiten");

                                                return ASSERT_ZERO(__SCRIPTINIT.length, "__SCRIPTINIT ist nicht leer!");
                                            }).catch(startMain);
                                    },
            'GM_WRITE'            : function() {
                                        __SCRIPTINIT.length = 0;  // Starterliste leeren...

                                        return callPromiseChain(registerStartFun(GM_showOptionsWritable), value => {
                                                const __RET = value;

                                                ASSERT_ONE(__RET, "registerStartFun() lieferte falschen R\u00FCckgabewert");

                                                return ASSERT_ONE(__SCRIPTINIT.length, "__SCRIPTINIT muss genau einen Eintrag haben");
                                            }, startMain, value => {
                                                const __RET = value;

                                                ASSERT_ONE(__RET, "startMain() muss genau einen Eintrag verarbeiten");

                                                return ASSERT_ZERO(__SCRIPTINIT.length, "__SCRIPTINIT ist nicht leer!");
                                            });
                                    },
            'GM_checkTMbug'       : function() {
                                        __SCRIPTINIT.length = 0;  // Starterliste leeren...

                                        return callPromiseChain(registerStartFun(GM_checkForTampermonkeyBug), value => {
                                                const __RET = value;

                                                ASSERT_ONE(__RET, "registerStartFun() lieferte falschen R\u00FCckgabewert");

                                                return ASSERT_ONE(__SCRIPTINIT.length, "__SCRIPTINIT muss genau einen Eintrag haben");
                                            }, startMain, value => {
                                                const __RET = value;

                                                ASSERT_ONE(__RET, "startMain() muss genau einen Eintrag verarbeiten");

                                                return ASSERT_ZERO(__SCRIPTINIT.length, "__SCRIPTINIT ist nicht leer!");
                                            });
                                    },
            'startMain'           : function() {
                                        __SCRIPTINIT.length = 0;  // Starterliste leeren...

                                        return callPromiseChain(registerStartFun(value => {
                                                const __RET = value;

                                                ASSERT_TRUE(__RET, "startMain() muss mit true starten");

                                                return 42;
                                            }), value => {
                                                const __RET = value;

                                                ASSERT_ONE(__RET, "registerStartFun() lieferte falschen R\u00FCckgabewert");

                                                return ASSERT_ONE(__SCRIPTINIT.length, "__SCRIPTINIT muss genau einen Eintrag haben");
                                            }, startMain, value => {
                                                const __RET = value;

                                                ASSERT_ONE(__RET, "startMain() muss genau einen Eintrag verarbeiten");

                                                return ASSERT_ZERO(__SCRIPTINIT.length, "__SCRIPTINIT ist nicht leer!");
                                            });
                                    },
            'startMainAll'        : function() {
                                        __SCRIPTINIT.length = 0;  // Starterliste leeren...

                                        return callPromiseChain(
                                            registerStartFun(GM_showOptionsWritable),
                                            value => {
                                                const __RET = value;

                                                ASSERT_ONE(__RET, "registerStartFun() lieferte falschen R\u00FCckgabewert");

                                                return ASSERT_ONE(__SCRIPTINIT.length, "__SCRIPTINIT muss genau einen Eintrag haben");
                                            },
                                            () => registerStartFun(GM_checkForTampermonkeyBug),
                                            value => {
                                                const __RET = value;

                                                ASSERT_EQUAL(__RET, 2, "registerStartFun() lieferte falschen R\u00FCckgabewert");

                                                ASSERT_EQUAL(__SCRIPTINIT.length, 2, "__SCRIPTINIT muss genau zwei Eintr\u00E4ge haben");
                                            },
                                            startMain,
                                            value => {
                                                const __RET = value;

                                                ASSERT_EQUAL(__RET, 2, "startMain() muss genau zwei Eintr\u00E4ge verarbeiten");

                                                return ASSERT_ZERO(__SCRIPTINIT.length, "__SCRIPTINIT ist nicht leer!");
                                            });
                                    }
        });

// ==================== Ende Abschnitt fuer Startroutinen und Datenspeicherungs-Filter ====================

// ==================== Abschnitt fuer die Sicherung und das Laden von Daten ====================

    const __ERROR = 'ERROR';
    const __ERR = __ERROR;

    const __TESTDATA = {
            'String'    : [ 'UnitTestS',    "Teststring",                                                       '"Teststring"' ],
            'Int'       : [ 'UnitTestI',    42,                                                                 '42' ],
            'Bool'      : [ 'UnitTestB',    false,                                                              'false' ],
            'Float'     : [ 'UnitTestI',    47.11,                                                              '47.11' ],
            'Array'     : [ 'UnitTestA',    [ 1, 2, 4, 8 ],                                                     '[1,2,4,8]' ],
            'Array2'    : [ 'UnitTestA',    [ '1', null, false, 815 ],                                          '["1",null,false,815]' ],
            'Array3'    : [ 'UnitTestA',    [ String(1), undefined, new Boolean(true) ],                        '["1",null,true]',                  [ "1", null, true ],                 '["1",null,true]' ],
            'Object'    : [ 'UnitTestO',    { eins : 1, zwei : 2, fuenf : 5 },                                  '{"eins":1,"zwei":2,"fuenf":5}' ],
            'Object2'   : [ 'UnitTestO',    { 'c': { i : true, a : null }, a : { b : { c : [ 2, 47.11 ] } } },  '{"c":{"i":true,"a":null},"a":{"b":{"c":[2,47.11]}}}' ],
            'Object3'   : [ 'UnitTestO',    new AssertionFailed(new Boolean(true), "Fehler"),                   '{"message":"Fehler (true)"}',      { 'message' : "Fehler (true)" },    '{"message":"Fehler (true)"}' ],
            'Undef'     : [ 'UnitTestUnd',  undefined,                                                          undefined,                          undefined,                          undefined ],
            'Null'      : [ 'UnitTestNul',  null,                                                               'null' ],
            'NaN'       : [ 'UnitTestNaN',  Number.NaN,                                                         String(Number.NaN),                 null,                               "null" ],
            'PosInf'    : [ 'UnitTestInf',  Number.POSITIVE_INFINITY,                                           String(Number.POSITIVE_INFINITY),   null,                               "null" ],
            'NegInf'    : [ 'UnitTestInf',  Number.NEGATIVE_INFINITY,                                           String(Number.NEGATIVE_INFINITY),   null,                               "null" ],
            'MinVal'    : [ 'UnitTestMin',  Number.MIN_VALUE,                                                   String(Number.MIN_VALUE) ],
            'MaxVal'    : [ 'UnitTestMax',  Number.MAX_VALUE,                                                   String(Number.MAX_VALUE) ],
            'MinInt'    : [ 'UnitTestMin',  Number.MIN_SAFE_INTEGER,                                            String(Number.MIN_SAFE_INTEGER) ],
            'MaxInt'    : [ 'UnitTestMax',  Number.MAX_SAFE_INTEGER,                                            String(Number.MAX_SAFE_INTEGER) ],
            'Epsilon'   : [ 'UnitTestInf',  Number.EPSILON,                                                     String(Number.EPSILON) ],
            'Uint32Arr' : [ 'UnitTestU',    new Uint32Array([42]),                                              '{"0":42}' ],
            'Date'      : [ 'UnitTestD',    new Date(Date.UTC(2006, 0, 2, 15, 4, 5)),                           '"2006-01-02T15:04:05.000Z"',       '2006-01-02T15:04:05.000Z',         '"2006-01-02T15:04:05.000Z"' ],
            'Symbol'    : [ 'UnitTestY',    Symbol(),                                                           undefined,                          undefined,                          undefined ],
            'Symbol2'   : [ 'UnitTestY',    Symbol.for('key'),                                                  undefined,                          undefined,                          undefined ],
            'Function'  : [ 'UnitTestP',    function(x) { return x * x; },                                      'function (x) { return x * x; }',   undefined,                          undefined ],
            'Default'   : [ 'UnitTestDef',  undefined,                                                          undefined,                          undefined,                          undefined ],
            'Default2'  : [ 'UnitTestDef',  null,                                                               'null' ],
            'Default3'  : [ 'UnitTestDef',  "",                                                                 '""' ]
        };

    // Primitive Speichermethoden __GETVALUE() und __SETVALUE():
    // getSetValue*  = SET/sum (sum = GET mit Filter)
    new UnitTest('util.store.js GET/SET', "__GETVALUE() und __SETVALUE()", {
            'getSetValueString'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['String'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "String falsch geladen");
                                            });
                                    },
            'getSetValueInt'      : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Int'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Integer falsch geladen");
                                            });
                                    },
            'getSetValueBool'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Bool'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Boolean falsch geladen");
                                            });
                                    },
            'getSetValueFloat'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Float'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_IN_DELTA(__RET, __VAL, __ASSERTDELTA, "Float falsch geladen");
                                            });
                                    },
            'getSetValueArray'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Array'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'getSetValueArray2'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Array2'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'getSetValueArray3'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Array3'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'getSetValueObject'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'getSetValueObject2'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object2'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'getSetValueObject3'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object3'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'getSetValueUndef'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Undef'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Undefined falsch geladen");
                                            });
                                    },
            'getSetValueNull'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Null'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch geladen");
                                            });
                                    },
            'getSetValueNaN'      : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['NaN'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "NaN falsch geladen");
                                            });
                                    },
            'getSetValuePosInf'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['PosInf'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "+Infinity falsch geladen");
                                            });
                                    },
            'getSetValueNegInf'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['NegInf'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "-Infinity falsch geladen");
                                            });
                                    },
            'getSetValueMinVal'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MinVal'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MinVal falsch geladen");
                                            });
                                    },
            'getSetValueMaxVal'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MaxVal'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MaxVal falsch geladen");
                                            });
                                    },
            'getSetValueMinInt'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MinInt'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MinInt falsch geladen");
                                            });
                                    },
            'getSetValueMaxInt'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MaxInt'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MaxInt falsch geladen");
                                            });
                                    },
            'getSetValueEpsilon'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Epsilon'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Epsilon falsch geladen");
                                            });
                                    },
            'getSetValueUint32Arr': function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Uint32Arr'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Uint32Array falsch geladen");
                                            });
                                    },
            'getSetValueDate'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Date'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Date falsch geladen");
                                            });
                                    },
            'getSetValueSymbol'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Symbol falsch geladen");
                                            });
                                    },
            'getSetValueSymbol2'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol2'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Symbol falsch geladen");
                                            });
                                    },
            'getSetValueFunction' : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Function'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Function falsch geladen");
                                            });
                                    },
            'getSetValueDefault'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Default'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'getSetValueDefault2' : function() {  // NOTE Kein Default-Wert bei null
                                        const [ __NAME, __VAL ] = __TESTDATA['Default2'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Summon-Wert bei null ignoriert");
                                            });
                                    },
            'getSetValueDefault3' : function() {  // NOTE Kein Default-Wert bei ""
                                        const [ __NAME, __VAL ] = __TESTDATA['Default3'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Summon-Wert bei \"\" ignoriert");
                                            });
                                    },
        });

    // Komponenten der Testreihen (sto/ser x ent/sum/des):
    // storeValue*   = STO/ent
    // summonValue*  = sto/SUM * DEF
    // serialize*    = SER/sum * DEF
    // serialize2*   = SER/ent
    // deserialize*  = sto/DES * DEF
    // deserialize2* = ser/DES * DEF
    new UnitTest('util.store.js Daten', "Sicherung und das Laden von Daten", {
            'storeValueString'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['String'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "String falsch gespeichert");
                                            });
                                    },
            'storeValueInt'       : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Int'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Integer falsch gespeichert");
                                            });
                                    },
            'storeValueBool'      : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Bool'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Boolean falsch gespeichert");
                                            });
                                    },
            'storeValueFloat'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Float'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_IN_DELTA(__RET, __VAL, __ASSERTDELTA, "Float falsch gespeichert");
                                            });
                                    },
            'storeValueArray'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Array'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch gespeichert");
                                            });
                                    },
            'storeValueArray2'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Array2'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch gespeichert");
                                            });
                                    },
            'storeValueArray3'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Array3'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch gespeichert");
                                            });
                                    },
            'storeValueObject'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch gespeichert");
                                            });
                                    },
            'storeValueObject2'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object2'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch gespeichert");
                                            });
                                    },
            'storeValueObject3'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object3'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch gespeichert");
                                            });
                                    },
            'storeValueUndef'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Undef'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Undefined falsch gespeichert");
                                            });
                                    },
            'storeValueNull'      : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Null'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch gespeichert");
                                            });
                                    },
            'storeValueNaN'       : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['NaN'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "NaN falsch gespeichert");
                                            });
                                    },
            'storeValuePosInf'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['PosInf'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "+Infinity falsch gespeichert");
                                            });
                                    },
            'storeValueNegInf'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['NegInf'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "-Infinity falsch gespeichert");
                                            });
                                    },
            'storeValueMinVal'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MinVal'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "MinVal falsch gespeichert");
                                            });
                                    },
            'storeValueMaxVal'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MaxVal'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "MaxVal falsch gespeichert");
                                            });
                                    },
            'storeValueMinInt'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MinInt'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "MinInt falsch gespeichert");
                                            });
                                    },
            'storeValueMaxInt'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MaxInt'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "MaxInt falsch gespeichert");
                                            });
                                    },
            'storeValueEpsilon'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Epsilon'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Epsilon falsch gespeichert");
                                            });
                                    },
            'storeValueUint32Arr' : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Uint32Arr'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Uint32Array falsch gespeichert");
                                            });
                                    },
            'storeValueDate'      : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Date'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Date falsch gespeichert");
                                            });
                                    },
            'storeValueSymbol'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Symbol falsch gespeichert");
                                            });
                                    },
            'storeValueSymbol2'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol2'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Symbol falsch gespeichert");
                                            });
                                    },
            'storeValueFunction'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Function'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Function falsch gespeichert");
                                            });
                                    },
            'summonValueString'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['String'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "String falsch geladen");
                                            });
                                    },
            'summonValueInt'      : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Int'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Integer falsch geladen");
                                            });
                                    },
            'summonValueBool'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Bool'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Boolean falsch geladen");
                                            });
                                    },
            'summonValueFloat'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Float'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_IN_DELTA(__RET, __VAL, __ASSERTDELTA, "Float falsch geladen");
                                            });
                                    },
            'summonValueArray'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Array'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'summonValueArray2'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Array2'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'summonValueArray3'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Array3'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'summonValueObject'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'summonValueObject2'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object2'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'summonValueObject3'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object3'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'summonValueUndef'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Undef'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Undefined falsch geladen");
                                            });
                                    },
            'summonValueNull'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Null'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch geladen");
                                            });
                                    },
            'summonValueNaN'      : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['NaN'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "NaN falsch geladen");
                                            });
                                    },
            'summonValuePosInf'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['PosInf'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "+Infinity falsch geladen");
                                            });
                                    },
            'summonValueNegInf'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['NegInf'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "-Infinity falsch geladen");
                                            });
                                    },
            'summonValueMinVal'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MinVal'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MinVal falsch geladen");
                                            });
                                    },
            'summonValueMaxVal'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MaxVal'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MaxVal falsch geladen");
                                            });
                                    },
            'summonValueMinInt'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MinInt'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MinInt falsch geladen");
                                            });
                                    },
            'summonValueMaxInt'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MaxInt'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MaxInt falsch geladen");
                                            });
                                    },
            'summonValueEpsilon'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Epsilon'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Epsilon falsch geladen");
                                            });
                                    },
            'summonValueUint32Arr': function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Uint32Arr'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Uint32Array falsch geladen");
                                            });
                                    },
            'summonValueDate'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Date'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Date falsch geladen");
                                            });
                                    },
            'summonValueSymbol'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Symbol falsch geladen");
                                            });
                                    },
            'summonValueSymbol2'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol2'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Symbol falsch geladen");
                                            });
                                    },
            'summonValueFunction' : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Function'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Function falsch geladen");
                                            });
                                    },
            'summonValueDefault'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Default'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'summonValueDefault2' : function() {  // NOTE Kein Default-Wert bei null
                                        const [ __NAME, __VAL ] = __TESTDATA['Default2'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Summon-Wert bei null ignoriert");
                                            });
                                    },
            'summonValueDefault3' : function() {  // NOTE Kein Default-Wert bei ""
                                        const [ __NAME, __VAL ] = __TESTDATA['Default3'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Summon-Wert bei \"\" ignoriert");
                                            });
                                    },
            'serializeString'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['String'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "String falsch gespeichert");
                                            });
                                    },
            'serializeInt'        : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Int'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Integer falsch gespeichert");
                                            });
                                    },
            'serializeBool'       : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Bool'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Boolean falsch gespeichert");
                                            });
                                    },
            'serializeFloat'      : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Float'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Float falsch gespeichert");
                                            });
                                    },
            'serializeArray'      : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Array'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            });
                                    },
            'serializeArray2'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Array2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            });
                                    },
            'serializeArray3'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Array3'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            });
                                    },
            'serializeObject'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Object'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            });
                                    },
            'serializeObject2'    : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Object2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            });
                                    },
            'serializeObject3'    : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Object3'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            });
                                    },
            'serializeUndef'      : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Undef'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Undefined falsch gespeichert");
                                            });
                                    },
            'serializeNull'       : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Null'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Null falsch gespeichert");
                                            });
                                    },
            'serializeNaN'        : function() {  // NOTE NaN wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , , __ALTEXP ] = __TESTDATA['NaN'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALTEXP, "NaN falsch gespeichert");
                                            });
                                    },
            'serializePosInf'     : function() {  // NOTE Infinity wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , , __ALTEXP ] = __TESTDATA['PosInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALTEXP, "+Infinity falsch gespeichert");
                                            });
                                    },
            'serializeNegInf'     : function() {  // NOTE -Infinity wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , , __ALTEXP ] = __TESTDATA['NegInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALTEXP, "-Infinity falsch gespeichert");
                                            });
                                    },
            'serializeMinVal'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['MinVal'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "MinVal falsch gespeichert");
                                            });
                                    },
            'serializeMaxVal'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['MaxVal'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "MaxVal falsch gespeichert");
                                            });
                                    },
            'serializeMinInt'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['MinInt'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "MinInt falsch gespeichert");
                                            });
                                    },
            'serializeMaxInt'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['MaxInt'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "MaxInt falsch gespeichert");
                                            });
                                    },
            'serializeEpsilon'    : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Epsilon'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Epsilon falsch gespeichert");
                                            });
                                    },
            'serializeUint32Arr'  : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Uint32Arr'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Uint32Array falsch gespeichert");
                                            });
                                    },
            'serializeDate'       : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Date'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Date falsch gespeichert");
                                            });
                                    },
            'serializeSymbol'     : function() {  // NOTE Keine Speicherung von Symbol
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Symbol falsch gespeichert");
                                            });
                                    },
            'serializeSymbol2'    : function() {  // NOTE Keine Speicherung von Symbol
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Symbol falsch gespeichert");
                                            });
                                    },
            'serializeFunction'   : function() {  // NOTE Keine Speicherung von Function durch JSON
                                        const [ __NAME, __VAL ] = __TESTDATA['Function'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Function falsch gespeichert");
                                            });
                                    },
            'serializeDefault'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Default'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'serializeDefault2'   : function() {  // NOTE Kein Default-Wert bei null
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Default2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Serialize-Wert bei null ignoriert");
                                            });
                                    },
            'serializeDefault3'   : function() {  // NOTE Kein Default-Wert bei ""
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Default3'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Serialize-Wert bei \"\" ignoriert");
                                            });
                                    },
            'serialize2String'    : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['String'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "String falsch gespeichert");
                                            });
                                    },
            'serialize2Int'       : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Int'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Integer falsch gespeichert");
                                            });
                                    },
            'serialize2Bool'      : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Bool'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Boolean falsch gespeichert");
                                            });
                                    },
            'serialize2Float'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Float'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Float falsch gespeichert");
                                            });
                                    },
            'serialize2Array'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Array'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            });
                                    },
            'serialize2Array2'    : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Array2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            });
                                    },
            'serialize2Array3'    : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Array3'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            });
                                    },
            'serialize2Object'    : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Object'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            });
                                    },
            'serialize2Object2'   : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Object2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            });
                                    },
            'serialize2Object3'   : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Object3'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            });
                                    },
            'serialize2Undef'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Undef'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Undefined falsch gespeichert");
                                            });
                                    },
            'serialize2Null'      : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Null'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Null falsch gespeichert");
                                            });
                                    },
            'serialize2NaN'       : function() {  // NOTE NaN wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , , __ALTEXP ] = __TESTDATA['NaN'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __ALTEXP, "NaN falsch gespeichert");
                                            });
                                    },
            'serialize2PosInf'    : function() {  // NOTE Infinity wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , ,  __ALTEXP ] = __TESTDATA['PosInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __ALTEXP, "+Infinity falsch gespeichert");
                                            });
                                    },
            'serialize2NegInf'    : function() {  // NOTE -Infinity wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , , __ALTEXP ] = __TESTDATA['NegInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __ALTEXP, "-Infinity falsch gespeichert");
                                            });
                                    },
            'serialize2MinVal'    : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['MinVal'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "MinVal falsch gespeichert");
                                            });
                                    },
            'serialize2MaxVal'    : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['MaxVal'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "MaxVal falsch gespeichert");
                                            });
                                    },
            'serialize2MinInt'    : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['MinInt'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "MinInt falsch gespeichert");
                                            });
                                    },
            'serialize2MaxInt'    : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['MaxInt'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "MaxInt falsch gespeichert");
                                            });
                                    },
            'serialize2Epsilon'   : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Epsilon'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Epsilon falsch gespeichert");
                                            });
                                    },
            'serialize2Uint32Arr' : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Uint32Arr'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Uint32Array falsch gespeichert");
                                            });
                                    },
            'serialize2Date'      : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Date'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Date falsch gespeichert");
                                            });
                                    },
            'serialize2Symbol'    : function() {  // NOTE Keine Speicherung von Symbol
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Symbol'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Symbol falsch gespeichert");
                                            });
                                    },
            'serialize2Symbol2'   : function() {  // NOTE Keine Speicherung von Symbol
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Symbol2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Symbol falsch gespeichert");
                                            });
                                    },
            'serialize2Function'  : function() {  // NOTE Keine Speicherung von Function durch JSON
                                        const [ __NAME, __VAL, , , __ALTEXP ] = __TESTDATA['Function'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __ALTEXP, "Function falsch gespeichert");
                                            });
                                    },
            'deserializeString'   : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['String'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "String falsch geladen");
                                            });
                                    },
            'deserializeInt'      : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Int'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Integer falsch geladen");
                                            });
                                    },
            'deserializeBool'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Bool'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Boolean falsch geladen");
                                            });
                                    },
            'deserializeFloat'    : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Float'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_IN_DELTA(__RET, __VAL, __ASSERTDELTA, "Float falsch geladen");
                                            });
                                    },
            'deserializeArray'    : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Array'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'deserializeArray2'   : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Array2'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'deserializeArray3'   : function() {  // NOTE Boolean wird von JSON untypisiert gespeichet
                                        const [ __NAME, , __EXP, __ALT ] = __TESTDATA['Array3'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "Array falsch geladen");
                                            });
                                    },
            'deserializeObject'   : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Object'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'deserializeObject2'  : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Object2'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'deserializeObject3'  : function() {  // NOTE AssertionFailed wird von JSON untypisiert gespeichet
                                        const [ __NAME, , __EXP, __ALT ] = __TESTDATA['Object3'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "Object falsch geladen");
                                            });
                                    },
            'deserializeUndef'    : function() {
                                        const [ __NAME, , __EXP ] = __TESTDATA['Undef'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Undefined falsch geladen");
                                            });
                                    },
            'deserializeNull'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Null'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch geladen");
                                            });
                                    },
            'deserializeNaN'      : function() {  // NOTE NaN wird von JSON als null gespeichet
                                        const [ __NAME, , , __ALT, __ALTEXP ] = __TESTDATA['NaN'];

                                        return callPromiseChain(storeValue(__NAME, __ALTEXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "NaN falsch geladen");
                                            });
                                    },
            'deserializePosInf'   : function() {  // NOTE Infinity wird von JSON als null gespeichet
                                        const [ __NAME, , , __ALT, __ALTEXP ] = __TESTDATA['PosInf'];

                                        return callPromiseChain(storeValue(__NAME, __ALTEXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "+Infinity falsch geladen");
                                            });
                                    },
            'deserializeNegInf'   : function() {  // NOTE -Infinity wird von JSON als null gespeichet
                                        const [ __NAME, , , __ALT, __ALTEXP ] = __TESTDATA['NegInf'];

                                        return callPromiseChain(storeValue(__NAME, __ALTEXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "-Infinity falsch geladen");
                                            });
                                    },
            'deserializeMinVal'   : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['MinVal'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MinVal falsch geladen");
                                            });
                                    },
            'deserializeMaxVal'   : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['MaxVal'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MaxVal falsch geladen");
                                            });
                                    },
            'deserializeMinInt'   : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['MinInt'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MinInt falsch geladen");
                                            });
                                    },
            'deserializeMaxInt'   : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['MaxInt'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MaxInt falsch geladen");
                                            });
                                    },
            'deserializeEpsilon'  : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Epsilon'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Epsilon falsch geladen");
                                            });
                                    },
            'deserializeUint32Arr': function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Uint32Arr'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Uint32Array falsch geladen");
                                            });
                                    },
            'deserializeDate'     : function() {  // NOTE Date wird von JSON untypisiert gespeichet
                                        const [ __NAME, , __EXP, __ALT ] = __TESTDATA['Date'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "Date falsch geladen");
                                            });
                                    },
            'deserializeSymbol'  : function() {  // NOTE Keine Speicherung von Symbol
                                        const [ __NAME, , __EXP ] = __TESTDATA['Symbol'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Symbol falsch geladen");
                                            });
                                    },
            'deserializeSymbol2'  : function() {  // NOTE Keine Speicherung von Symbol
                                        const [ __NAME, , __EXP ] = __TESTDATA['Symbol2'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Symbol falsch geladen");
                                            });
                                    },
            'deserializeFunction' : function() {  // NOTE Keine Speicherung von Function durch JSON
                                        const [ __NAME, , , , __ALTEXP ] = __TESTDATA['Function'];

                                        return callPromiseChain(storeValue(__NAME, __ALTEXP), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Function falsch geladen");
                                            });
                                    },
            'deserializeDefault'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Default'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'deserializeDefault2' : function() {  // NOTE Kein Default-Wert bei null
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Default2'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Serialize-Wert bei null ignoriert");
                                            });
                                    },
            'deserializeDefault3' : function() {  // NOTE Kein Default-Wert bei ""
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Default3'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Serialize-Wert bei \"\" ignoriert");
                                            });
                                    },
            'deserialize2String'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['String'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "String falsch geladen");
                                            });
                                    },
            'deserialize2Int'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Int'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Integer falsch geladen");
                                            });
                                    },
            'deserialize2Bool'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Bool'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Boolean falsch geladen");
                                            });
                                    },
            'deserialize2Float'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Float'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_IN_DELTA(__RET, __VAL, __ASSERTDELTA, "Float falsch geladen");
                                            });
                                    },
            'deserialize2Array'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Array'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'deserialize2Array2'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Array2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'deserialize2Array3'  : function() {  // NOTE Boolean wird von JSON untypisiert gespeichet
                                        const [ __NAME, __VAL, , __ALT ] = __TESTDATA['Array3'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "Array falsch geladen");
                                            });
                                    },
            'deserialize2Object'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'deserialize2Object2' : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'deserialize2Object3' : function() {  // NOTE AssertionFailed wird von JSON untypisiert gespeichet
                                        const [ __NAME, __VAL, , __ALT ] = __TESTDATA['Object3'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "Object falsch geladen");
                                            });
                                    },
            'deserialize2Undef'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Undef'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Undefined falsch geladen");
                                            });
                                    },
            'deserialize2Null'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Null'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch geladen");
                                            });
                                    },
            'deserialize2NaN'     : function() {  // NOTE NaN wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , __ALT ] = __TESTDATA['NaN'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "NaN falsch geladen");
                                            });
                                    },
            'deserialize2PosInf'  : function() {  // NOTE Infinity wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , __ALT ] = __TESTDATA['PosInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "+Infinity falsch geladen");
                                            });
                                    },
            'deserialize2NegInf'  : function() {  // NOTE -Infinity wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , __ALT ] = __TESTDATA['NegInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "-Infinity falsch geladen");
                                            });
                                    },
            'deserialize2MinVal'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MinVal'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MinVal falsch geladen");
                                            });
                                    },
            'deserialize2MaxVal'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MaxVal'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MaxVal falsch geladen");
                                            });
                                    },
            'deserialize2MinInt'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MinInt'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MinInt falsch geladen");
                                            });
                                    },
            'deserialize2MaxInt'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MaxInt'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MaxInt falsch geladen");
                                            });
                                    },
            'deserialize2Epsilon'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Epsilon'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Epsilon falsch geladen");
                                            });
                                    },
            'deserialize2Uint32Arr':function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Uint32Arr'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Uint32Array falsch geladen");
                                            });
                                    },
            'deserialize2Date'    : function() {  // NOTE Date wird von JSON untypisiert gespeichet
                                        const [ __NAME, __VAL, , __ALT ] = __TESTDATA['Date'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "Date falsch geladen");
                                            });
                                    },
            'deserialize2Symbol'  : function() {  // NOTE Keine Speicherung von Symbol
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Symbol falsch geladen");
                                            });
                                    },
            'deserialize2Symbol2' : function() {  // NOTE Keine Speicherung von Symbol
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Symbol falsch geladen");
                                            });
                                    },
            'deserialize2Function': function() {  // NOTE Keine Speicherung von Function durch JSON
                                        const [ __NAME, __VAL ] = __TESTDATA['Function'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Function falsch geladen");
                                            });
                                    },
            'deserialize2Default' : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Default'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'deserialize2Default2': function() {  // NOTE Kein Default-Wert bei null
                                        const [ __NAME, __VAL ] = __TESTDATA['Default2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Serialize-Wert bei null ignoriert");
                                            });
                                    },
            'deserialize2Default3': function() {  // NOTE Kein Default-Wert bei ""
                                        const [ __NAME, __VAL ] = __TESTDATA['Default3'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Serialize-Wert bei \"\" ignoriert");
                                            });
                                    }
        });

// ==================== Abschnitt fuer die Folgen einer Speicherung ====================

    new UnitTest('util.store.js Reload', "Neuladen der Seite", {
            'refreshPageNoReload' : function() {
                                        const __RET = refreshPage(false);
                                        return ASSERT_NOT_SET(__RET, "Kein Returnwert erwartet");
                                    }
        });

// ==================== Abschnitt fuer die Sicherung von Daten mit Callback ====================

    new UnitTest('util.store.js Callback', "Sicherung von Daten mit Callback", {
            'setStored'           : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object2'];
                                        const __RELOAD = false;
                                        const __SERIAL = false;

                                        return callPromiseChain(new Promise(function(resolve, reject) { return setStored(__NAME, __VAL, __RELOAD, __SERIAL, resolve, reject); }), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'setStoredSerial'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object2'];
                                        const __RELOAD = false;
                                        const __SERIAL = true;

                                        return callPromiseChain(new Promise(function(resolve, reject) { return setStored(__NAME, __VAL, __RELOAD, __SERIAL, resolve, reject); }), () => deserialize(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'setNextStored'       : async function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Int'];
                                        const __ARR = [ 1, 2, 4, 8, 42, 47.11 ];
                                        const __EXP1 = 47.11;
                                        const __EXP2 = 1;
                                        const __RELOAD = false;
                                        const __SERIAL = false;

                                        await callPromiseChain(new Promise(function(resolve, reject) { return setNextStored(__ARR, __NAME, __VAL, __RELOAD, __SERIAL, resolve, reject); }), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP1, "Object falsch geladen");
                                            });

                                        return callPromiseChain(new Promise(function(resolve, reject) { return setNextStored(__ARR, __NAME, __EXP1, __RELOAD, __SERIAL, resolve, reject); }), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP2, "Object falsch geladen");
                                            });
                                    },
            'setNextStoredSerial' : async function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Int'];
                                        const __ARR = [ 1, 2, 4, 8, 42, 47.11 ];
                                        const __EXP1 = 47.11;
                                        const __EXP2 = 1;
                                        const __RELOAD = false;
                                        const __SERIAL = true;

                                        await callPromiseChain(new Promise(function(resolve, reject) { return setNextStored(__ARR, __NAME, __VAL, __RELOAD, __SERIAL, resolve, reject); }), () => deserialize(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP1, "Object falsch geladen");
                                            });

                                        return callPromiseChain(new Promise(function(resolve, reject) { return setNextStored(__ARR, __NAME, __EXP1, __RELOAD, __SERIAL, resolve, reject); }), () => deserialize(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP2, "Object falsch geladen");
                                            });
                                    }
        });

// ==================== Ende Abschnitt fuer die Sicherung und das Laden von Daten ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.store ====================

// *** EOF ***

/*** Ende Modul util.store.test.js ***/

/*** Modul util.value.test.js ***/

// ==UserModule==
// _name         util.value.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Logging, Debugging, Error-Handling, usw.
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/util.value.test.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.value ====================

(() => {

// ==================== Abschnitt fuer diverse Utilities fuer Werte ====================

    const __ERROR = 'ERROR';
    const __ERR = __ERROR;
    const __KEY = 'key';    // Key fuer Object
    const __KEY0 = 0;       // Key fuer Array

// ==================== Abschnitt fuer getValue(), getObjValue() und getArrValue() ====================

    const __TESTDATA = {
            'getValueString'        : [ '1',                            '1',                'string'    ],
            'getValueInt'           : [ 42,                             42,                 'number'    ],
            'getValueBool'          : [ true,                           true,               'boolean'   ],
            'getValueFloat'         : [ 47.11,                          47.11,              'number'    ],
            'getValueArray'         : [ [ 3, 4 ],                       [ 3, 4 ],           'object'    ],
            'getValueObject'        : [ { 3 : 4 },                      { 3 : 4 },          'object'    ],
            'getValueUndef'         : [ undefined,                      undefined,          'undefined' ],
            'getValueNull'          : [ null,                           undefined,          'undefined' ],
            'getValueNaN'           : [ Number.NaN,                     Number.NaN,         'number'    ],
            'getValueSymbol'        : [ Symbol(),                       Symbol(),           'symbol'    ],
            'getValueSymbol2'       : [ Symbol.for('key'),              Symbol.for('key'),  'symbol'    ],
            'getValueFunction'      : [ function() {},                  function() {},      'function'  ],
            'getValueDefault'       : [ undefined,                      __ERR,              'string'    ],
            'getValueDefault2'      : [ null,                           __ERR,              'string'    ],
            'getValueDefault3'      : [ "",                             "",                 'string'    ],
            'getValueDefault4'      : [ 0,                              0,                  'number'    ],
            'getValueDefault5'      : [ false,                          false,              'boolean'   ],
            'getValueRetVal'        : [ true,                           __ERROR,            'string'    ],
            'getObjValueString'     : [ { key : '1' },                  '1',                'string'    ],
            'getObjValueInt'        : [ { key : 42 },                   42,                 'number'    ],
            'getObjValueBool'       : [ { key : true },                 true,               'boolean'   ],
            'getObjValueFloat'      : [ { key : 47.11 },                47.11,              'number'    ],
            'getObjValueArray'      : [ { key : [ 3, 4 ] },             [ 3, 4 ],           'object'    ],
            'getObjValueObject'     : [ { key : { 3 : 4 } },            { 3 : 4 },          'object'    ],
            'getObjValueUndef'      : [ { key : undefined },            undefined,          'undefined' ],
            'getObjValueUndef2'     : [ { },                            undefined,          'undefined' ],
            'getObjValueNull'       : [ { key : null },                 undefined,          'undefined' ],
            'getObjValueNaN'        : [ { key : Number.NaN },           Number.NaN,         'number'    ],
            'getObjValueSymbol'     : [ { key : Symbol() },             Symbol(),           'symbol'    ],
            'getObjValueSymbol2'    : [ { key : Symbol.for('key') },    Symbol.for('key'),  'symbol'    ],
            'getObjValueFunction'   : [ { key : function() {} },        function() {},      'function'  ],
            'getObjValueDefault'    : [ { key : undefined },            __ERR,              'string'    ],
            'getObjValueDefault2'   : [ { key : null },                 __ERR,              'string'    ],
            'getObjValueDefault3'   : [ { key : "" },                   "",                 'string'    ],
            'getObjValueDefault4'   : [ { key : 0 },                    0,                  'number'    ],
            'getObjValueDefault5'   : [ { key : false },                false,              'boolean'   ],
            'getObjValueRetVal'     : [ { key : true },                 __ERROR,            'string'    ],
            'getObjValueObjUndef'   : [ undefined,                      __ERR,              'string'    ],
            'getObjValueObjNull'    : [ null,                           __ERR,              'string'    ],
            'getObjValueObjString'  : [ "",                             __ERR,              'string'    ],
            'getArrValueString'     : [ [ '1' ],                        '1',                'string'    ],
            'getArrValueInt'        : [ [ 42 ],                         42,                 'number'    ],
            'getArrValueBool'       : [ [ true ],                       true,               'boolean'   ],
            'getArrValueFloat'      : [ [ 47.11 ],                      47.11,              'number'    ],
            'getArrValueArray'      : [ [ [ 3, 4 ] ],                   [ 3, 4 ],           'object'    ],
            'getArrValueObject'     : [ [ { 3 : 4 } ],                  { 3 : 4 },          'object'    ],
            'getArrValueUndef'      : [ [ undefined ],                  undefined,          'undefined' ],
            'getArrValueUndef2'     : [ [],                             undefined,          'undefined' ],
            'getArrValueNull'       : [ [ null ],                       undefined,          'undefined' ],
            'getArrValueNaN'        : [ [ Number.NaN ],                 Number.NaN,         'number'    ],
            'getArrValueSymbol'     : [ [ Symbol() ],                   Symbol(),           'symbol'    ],
            'getArrValueSymbol2'    : [ [ Symbol.for('key') ],          Symbol.for('key'),  'symbol'    ],
            'getArrValueFunction'   : [ [ function() {} ],              function() {},      'function'  ],
            'getArrValueDefault'    : [ [ undefined ],                  __ERR,              'string'    ],
            'getArrValueDefault2'   : [ [ null ],                       __ERR,              'string'    ],
            'getArrValueDefault3'   : [ [ "" ],                         "",                 'string'    ],
            'getArrValueDefault4'   : [ [ 0 ],                          0,                  'number'    ],
            'getArrValueDefault5'   : [ [ false ],                      false,              'boolean'   ],
            'getArrValueRetVal'     : [ [ true ],                       __ERROR,            'string'    ],
            'getArrValueObjUndef'   : [ undefined,                      __ERR,              'string'    ],
            'getArrValueObjNull'    : [ null,                           __ERR,              'string'    ],
            'getArrValueObjString'  : [ "",                             __ERR,              'string'    ]
        };

    new UnitTest('util.value.js', "Utilities zur Behandlung von Werten", {
            'getValueString'      : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueString'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss String zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss String zur\u00FCckgeben");
                                    },
            'getValueInt'         : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueInt'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Integer zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Integer zur\u00FCckgeben");
                                    },
            'getValueBool'        : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueBool'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Boolean zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Boolean zur\u00FCckgeben");
                                    },
            'getValueFloat'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueFloat'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Float zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Float zur\u00FCckgeben");
                                    },
            'getValueArray'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueArray'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Array zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Array zur\u00FCckgeben");
                                    },
            'getValueObject'      : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueObject'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Object zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Object zur\u00FCckgeben");
                                    },
            'getValueUndef'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueUndef'];
                                        const __RET = getValue(__VAL, undefined, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss undefined zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss undefined zur\u00FCckgeben");
                                    },
            'getValueNull'        : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueNull'];
                                        const __RET = getValue(__VAL, undefined, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss undefined zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss undefined zur\u00FCckgeben");
                                    },
            'getValueNaN'         : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueNaN'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss NaN zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss NaN zur\u00FCckgeben");
                                    },
            'getValueSymbol'      : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueSymbol'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Symbol zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Symbol zur\u00FCckgeben");
                                    },
            'getValueSymbol2'     : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueSymbol2'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Symbol zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Symbol zur\u00FCckgeben");
                                    },
            'getValueFunction'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueFunction'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Function zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Function zur\u00FCckgeben");
                                    },
            'getValueDefault'     : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueDefault'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss __ERR zur\u00FCckgeben");
                                    },
            'getValueDefault2'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueDefault2'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss __ERR zur\u00FCckgeben");
                                    },
            'getValueDefault3'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueDefault3'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Leerstring zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Leerstring zur\u00FCckgeben");
                                    },
            'getValueDefault4'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueDefault4'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Integer zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Integer zur\u00FCckgeben");
                                    },
            'getValueDefault5'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueDefault5'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Boolean zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Boolean zur\u00FCckgeben");
                                    },
            'getValueRetVal'      : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueRetVal'];
                                        const __RET = getValue(__VAL, undefined, __ERROR);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss __ERROR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss __ERROR zur\u00FCckgeben");
                                    },
            'getObjValueString'   : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueString'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss String zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss String zur\u00FCckgeben");
                                    },
            'getObjValueInt'      : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueInt'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Integer zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Integer zur\u00FCckgeben");
                                    },
            'getObjValueBool'     : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueBool'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Boolean zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Boolean zur\u00FCckgeben");
                                    },
            'getObjValueFloat'    : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueFloat'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Float zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Float zur\u00FCckgeben");
                                    },
            'getObjValueArray'    : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueArray'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Array zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Array zur\u00FCckgeben");
                                    },
            'getObjValueObject'   : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueObject'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Object zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Object zur\u00FCckgeben");
                                    },
            'getObjValueUndef'    : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueUndef'];
                                        const __RET = getObjValue(__OBJ, __KEY, undefined, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss undefined zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss undefined zur\u00FCckgeben");
                                    },
            'getObjValueUndef2'   : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueUndef2'];
                                        const __RET = getObjValue(__OBJ, __KEY, undefined, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss undefined zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss undefined zur\u00FCckgeben");
                                    },
            'getObjValueNull'     : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueNull'];
                                        const __RET = getObjValue(__OBJ, __KEY, undefined, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss undefined zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss undefined zur\u00FCckgeben");
                                    },
            'getObjValueNaN'      : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueNaN'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss NaN zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss NaN zur\u00FCckgeben");
                                    },
            'getObjValueSymbol'   : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueSymbol'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Symbol zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Symbol zur\u00FCckgeben");
                                    },
            'getObjValueSymbol2'  : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueSymbol2'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Symbol zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Symbol zur\u00FCckgeben");
                                    },
            'getObjValueFunction' : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueFunction'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Function zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Function zur\u00FCckgeben");
                                    },
            'getObjValueDefault'  : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueDefault'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss __ERR zur\u00FCckgeben");
                                    },
            'getObjValueDefault2' : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueDefault2'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss __ERR zur\u00FCckgeben");
                                    },
            'getObjValueDefault3' : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueDefault3'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Leerstring zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Leerstring zur\u00FCckgeben");
                                    },
            'getObjValueDefault4' : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueDefault4'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Integer zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Integer zur\u00FCckgeben");
                                    },
            'getObjValueDefault5' : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueDefault5'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Boolean zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Boolean zur\u00FCckgeben");
                                    },
            'getObjValueRetVal'   : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueRetVal'];
                                        const __RET = getObjValue(__OBJ, __KEY, undefined, __ERROR);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss __ERROR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss __ERROR zur\u00FCckgeben");
                                    },
            'getObjValueObjUndef' : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueObjUndef'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss __ERROR zur\u00FCckgeben");
                                    },
            'getObjValueObjNull'  : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueObjNull'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss __ERROR zur\u00FCckgeben");
                                    },
            'getObjValueObjString': function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueObjString'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss __ERROR zur\u00FCckgeben");
                                    },
            'getArrValueString'   : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueString'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss String zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss String zur\u00FCckgeben");
                                    },
            'getArrValueInt'      : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueInt'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Integer zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Integer zur\u00FCckgeben");
                                    },
            'getArrValueBool'     : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueBool'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Boolean zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Boolean zur\u00FCckgeben");
                                    },
            'getArrValueFloat'    : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueFloat'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Float zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Float zur\u00FCckgeben");
                                    },
            'getArrValueArray'    : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueArray'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Array zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Array zur\u00FCckgeben");
                                    },
            'getArrValueObject'   : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueObject'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Object zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Object zur\u00FCckgeben");
                                    },
            'getArrValueUndef'    : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueUndef'];
                                        const __RET = getArrValue(__ARR, __KEY0, undefined, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss undefined zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss undefined zur\u00FCckgeben");
                                    },
            'getArrValueUndef2'   : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueUndef2'];
                                        const __RET = getArrValue(__ARR, __KEY0, undefined, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss undefined zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss undefined zur\u00FCckgeben");
                                    },
            'getArrValueNull'     : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueNull'];
                                        const __RET = getArrValue(__ARR, __KEY0, undefined, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss undefined zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss undefined zur\u00FCckgeben");
                                    },
            'getArrValueNaN'      : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueNaN'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss NaN zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss NaN zur\u00FCckgeben");
                                    },
            'getArrValueSymbol'   : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueSymbol'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Symbol zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Symbol zur\u00FCckgeben");
                                    },
            'getArrValueSymbol2'  : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueSymbol2'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Symbol zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Symbol zur\u00FCckgeben");
                                    },
            'getArrValueFunction' : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueFunction'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Function zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Function zur\u00FCckgeben");
                                    },
            'getArrValueDefault'  : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueDefault'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss __ERR zur\u00FCckgeben");
                                    },
            'getArrValueDefault2' : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueDefault2'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss __ERR zur\u00FCckgeben");
                                    },
            'getArrValueDefault3' : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueDefault3'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Leerstring zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Leerstring zur\u00FCckgeben");
                                    },
            'getArrValueDefault4' : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueDefault4'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Integer zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Integer zur\u00FCckgeben");
                                    },
            'getArrValueDefault5' : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueDefault5'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Boolean zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Boolean zur\u00FCckgeben");
                                    },
            'getArrValueRetVal'   : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueRetVal'];
                                        const __RET = getArrValue(__ARR, __KEY0, undefined, __ERROR);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss __ERROR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss __ERROR zur\u00FCckgeben");
                                    },
            'getArrValueObjUndef' : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueObjUndef'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss __ERROR zur\u00FCckgeben");
                                    },
            'getArrValueObjNull'  : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueObjNull'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss __ERROR zur\u00FCckgeben");
                                    },
            'getArrValueObjString': function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueObjString'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss __ERROR zur\u00FCckgeben");
                                    }
        });

// ==================== Ende Abschnitt fuer getValue(), getObjValue() und getArrValue() ====================

// ==================== Abschnitt fuer getNumber() ====================

    const __EPSILON = 1e-10; // Ausreichend genau, um Abweichungen von korrekter Umwandlung zu erkennen

    const __TESTDATANUMBER = {
            'getNumberInt'          : [ '42',                           42,                 'number'    ],
            'getNumberIntNeg'       : [ '-42',                          -42,                'number'    ],
            'getNumberIntOne'       : [ '1.234',                        1234,               'number'    ],
            'getNumberIntOneNeg'    : [ '-1.234',                       -1234,              'number'    ],
            'getNumberIntTwo'       : [ '12.345.678',                   12345678,           'number'    ],
            'getNumberIntTwoNeg'    : [ '-12.345.678',                  -12345678,          'number'    ],
            'getNumberNum1'         : [ '0.9',                          0.9,                'number'    ],
            'getNumberNum1Neg'      : [ '-0.9',                         -0.9,               'number'    ],
            'getNumberNum2'         : [ '0.98',                         0.98,               'number'    ],
            'getNumberNum2Neg'      : [ '-0.98',                        -0.98,              'number'    ],
            'getNumberNum3Not'      : [ '0.987',                        987,                'number'    ],
            'getNumberNum3NotNeg'   : [ '-0.987',                       -987,               'number'    ],
            'getNumberNum4'         : [ '0.9876',                       0.9876,             'number'    ],
            'getNumberNum4Neg'      : [ '-0.9876',                      -0.9876,            'number'    ],
            'getNumberNum5'         : [ '0.98765',                      0.98765,            'number'    ],
            'getNumberNum5Neg'      : [ '-0.98765',                     -0.98765,           'number'    ],
            'getNumberNum6'         : [ '0.987654',                     0.987654,           'number'    ],
            'getNumberNum6Neg'      : [ '-0.987654',                    -0.987654,          'number'    ],
            'getNumberIpc'          : [ '42%',                          0.42,               'number'    ],
            'getNumberIpcNeg'       : [ '-42%',                         -0.42,              'number'    ],
            'getNumberIpcOne'       : [ '1.234%',                       12.34,              'number'    ],
            'getNumberIpcOneNeg'    : [ '-1.234%',                      -12.34,             'number'    ],
            'getNumberIpcTwo'       : [ '12.345.678%',                  123456.78,          'number'    ],
            'getNumberIpcTwoNeg'    : [ '-12.345.678%',                 -123456.78,         'number'    ],
            'getNumberNpc1'         : [ '0.9%',                         0.009,              'number'    ],
            'getNumberNpc1Neg'      : [ '-0.9%',                        -0.009,             'number'    ],
            'getNumberNpc2'         : [ '0.98%',                        0.0098,             'number'    ],
            'getNumberNpc2Neg'      : [ '-0.98%',                       -0.0098,            'number'    ],
            'getNumberNpc3Not'      : [ '0.987%',                       9.87,               'number'    ],
            'getNumberNpc3NotNeg'   : [ '-0.987%',                      -9.87,              'number'    ],
            'getNumberNpc4'         : [ '0.9876%',                      0.009876,           'number'    ],
            'getNumberNpc4Neg'      : [ '-0.9876%',                     -0.009876,          'number'    ],
            'getNumberNpc5'         : [ '0.98765%',                     0.0098765,          'number'    ],
            'getNumberNpc5Neg'      : [ '-0.98765%',                    -0.0098765,         'number'    ],
            'getNumberNpc6'         : [ '0.987654%',                    0.00987654,         'number'    ],
            'getNumberNpc6Neg'      : [ '-0.987654%',                   -0.00987654,        'number'    ]
        };

    new UnitTest('util.value.js Number', "Utilities zur Behandlung von Nummern", {
            'getNumberInt'        : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberInt'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIntNeg'     : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIntNeg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIntOne'     : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIntOne'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIntOneNeg'  : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIntOneNeg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIntTwo'     : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIntTwo'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIntTwoNeg'  : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIntTwoNeg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum1'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum1'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum1Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum1Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum2'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum2'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum2Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum2Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum3Not'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum3Not'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum3NotNeg' : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum3NotNeg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum4'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum4'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum4Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum4Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum5'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum5'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum5Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum5Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum6'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum6'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum6Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum6Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIpc'        : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIpc'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIpcNeg'     : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIpcNeg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIpcOne'     : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIpcOne'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIpcOneNeg'  : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIpcOneNeg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIpcTwo'     : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIpcTwo'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIpcTwoNeg'  : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIpcTwoNeg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc1'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc1'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc1Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc1Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc2'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc2'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc2Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc2Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc3Not'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc3Not'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc3NotNeg' : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc3NotNeg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc4'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc4'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc4Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc4Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc5'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc5'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc5Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc5Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc6'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc6'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc6Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc6Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    }
        });

// ==================== Ende Abschnitt fuer getNumber() ====================

//+function getValue(value, defValue = undefined, retValue = undefined) {
//+function getObjValue(obj, item, defValue = undefined, retValue = undefined) {
//+function getArrValue(arr, index, defValue = undefined, retValue = undefined) {
//function pushObjValue(obj, item, value, defValue, returnOnly = false, scalarUnique = false) {
//function pushArrValue(arr, index, value, defValue, returnOnly = false, scalarUnique = false) {
//function clearObj(obj, keepFilter = null) {
//function clearObjFast(obj, keepFilter = null) {
//function allItems(item) {
//function noItems(item) {
//function getValueIn(value, minValue = undefined, maxValue = undefined, defValue = undefined) {
//function getNextValue(arr, value) {
//function getMulValue(valueA, valueB, digits = 0, defValue = Number.NaN) {
//function getOrdinal(value, defValue = '*') {
//+function getNumber(numberString) {
//function getNumberString(numberString) {
//function getArrString(arr, space = ' ') {
//function getKeyString(obj, space = ' ') {
//function getValueString(obj, space = ' ') {
//function getEntryString(obj, space = ' ', mapFun = undefined) {
//function floorValue(value, dot = '.') {
//function toArray(value) {
//function flatArray(... args) {
//function param0Wrapper(wrapFun, param0Fun) {
//function param0ArrWrapper(wrapFun, param0ArrFun) {
//function paramWrapper(wrapFun, paramFuns) {
//function paramArrWrapper(wrapFun, paramFuns) {
//function replaceArrayFun(formatFun, space = ' ') {
//function padStartFun(targetLength = 4, padString = ' ') {
//function padEndFun(targetLength = 4, padString = ' ') {
//function padLeft(value, size = 4, char = ' ') {
//function padNumber(value, size = 2, char = '0') {
//function reverseString(string) {
//function trimMS(string) {
//function sameValue(value) {
//function existValue(value) {
//function compareNumber(valueA, valueB) {
//function typeOf(value) {
//function valueOf(data) {

// ==================== Ende Abschnitt fuer diverse Utilities fuer Werte ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.value ====================

// *** EOF ***

/*** Ende Modul util.value.test.js ***/

/*** Modul util.xhr.test.js ***/

// ==UserModule==
// _name         util.xhr.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer XHR-Aufrufe
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.xhr.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.lib.option.js
// _require      https://eselce.github.io/OS2.scripts/test/util.xhr.test.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.xhr ====================

(() => {

// ==================== Abschnitt Versuch eines Verbindungsaufbaus ====================

    const __THIS = __XHR;
    const __LABEL = "[XHR] ";

    const __TESTFUNS = [
            'browse',
            'getRequest',
            'putRequest',
            'postRequest',
            'headRequest',
            'xmlRequest',
            'registerCallback',
            '__XMLREQUEST'
        ];

    const __TESTDATA = {
            'browseXML'     : [ "https://eselce.github.io/GitTest/misc/OS2/lib/util.xhr.js",                    /^\/\/ ==UserScript==([^]*)\n+\/\/ _name         util\.xhr$/m  ],
            'browseXMLCORS' : [ "https://os.ongapo.com/spv.php?action=getListByName&term=Volodimir Oleynikov",  /.*/    ]
        };

    new UnitTestOption('util.xhr.js', "Schnittstelle zum Verbindungsaufbau", {
            'handlerExists'       : function() {
                                        return ASSERT_SET(__THIS, __LABEL + "Handler nicht gefunden");
                                    },
            'memberFuns'          : function() {
                                        for (let testFun of __TESTFUNS) {
                                            const __TESTFUN = __THIS[testFun];

                                            ASSERT_SET(__TESTFUN, __LABEL + "Methode " + __LOG.info(testFun, false) + " nicht gefunden");

                                            return ASSERT_TYPEOF(__TESTFUN, 'function', __LABEL + "Methode " + __LOG.info(testFun, false) + " ist keine Funktion");
                                        }
                                    },
            'browseXML'           : function() {
                                        const [ __URL, __EXP ] = __TESTDATA['browseXML'];

                                        ASSERT_SET(__THIS.browse, __LABEL + "Methode 'browse' nicht gefunden");
                                        ASSERT_TYPEOF(__THIS.browse, 'function', __LABEL + "Methode 'browse' ist keine Funktion");

                                        return callPromiseChain(__THIS.browse(__URL), doc => {
                                                const __RET = doc;

                                                return ASSERT_MATCH(__RET, __EXP, "browseXML() sollte XML-Daten liefern");
                                            });
                                    },
            'browseXMLonload'     : function() {
                                        const [ __URL, __EXP ] = __TESTDATA['browseXML'];

                                        ASSERT_SET(__THIS.browse, __LABEL + "Methode 'browse' nicht gefunden");
                                        ASSERT_TYPEOF(__THIS.browse, 'function', __LABEL + "Methode 'browse' ist keine Funktion");

                                        return new Promise(function(resolve, reject) {
                                                return __THIS.browse(__URL, null, request => {
                                                        try {
                                                            const __DOC = request.response;
                                                            const __RET = request.responseText;

                                                            ASSERT_MATCH(__DOC, __EXP, "browseXMLonload() response sollte XML-Daten liefern");

                                                            ASSERT_MATCH(__RET, __EXP, "browseXMLonload() responseText sollte XML-Daten liefern");

                                                            return resolve(true);
                                                        } catch (ex) {
                                                            return reject(ex);
                                                        }
                                                        // NOTE Unreachable...
                                                    }).catch(reject);
                                            });
                                    },
            'browseXMLCORS'       : function() {
                                        const [ __URL, __EXP ] = __TESTDATA['browseXMLCORS'];
                                        const __ERRORMSG1 = "A network error occurred.";
                                        const __ERRORMSG2 = "Failed to execute 'send' on 'XMLHttpRequest': Failed to load '" + __URL.replaceAll(' ', "%20") + "'.";
                                        const __ERRORTYPE = 'NetworkError';
                                        const __ERRORRESULT = 2152923155;

                                        ASSERT_SET(__THIS.browse, __LABEL + "Methode 'browse' nicht gefunden");
                                        ASSERT_TYPEOF(__THIS.browse, 'function', __LABEL + "Methode 'browse' ist keine Funktion");

                                        return callPromiseChain(__THIS.browse(__URL), doc => {
                                                const __RET = doc;

                                                return ASSERT_NOT_EQUAL(__RET, __EXP, "browseXMLCORS() sollte keine XML-Daten liefern, sondern blockiert werden");
                                            }).catch(async ex => {
                                                ASSERT_INSTANCEOF(ex, Error, "Promise muss Error zur\u00FCckgeben");
                                                if (ex.message === __ERRORMSG1) {
                                                    ASSERT_EQUAL(ex.message, __ERRORMSG1, "Fehlertext in Error falsch");
                                                    ASSERT_EQUAL(ex.result, __ERRORRESULT, "Result in Error falsch");
                                                } else {
                                                    ASSERT_EQUAL(ex.message, __ERRORMSG2, "Fehlertext in Error falsch");
                                                }

                                                return ASSERT_EQUAL(ex.name, __ERRORTYPE, "Fehlertyp in Error falsch");
                                            });
                                    },
            'browseXMLCORSonload' : function() {
                                        const [ __URL, __EXP ] = __TESTDATA['browseXMLCORS'];
                                        const __ERRORMSG1 = "A network error occurred.";
                                        const __ERRORMSG2 = "Failed to execute 'send' on 'XMLHttpRequest': Failed to load '" + __URL.replaceAll(' ', "%20") + "'.";
                                        const __ERRORTYPE = 'NetworkError';
                                        const __ERRORRESULT = 2152923155;

                                        ASSERT_SET(__THIS.browse, __LABEL + "Methode 'browse' nicht gefunden");
                                        ASSERT_TYPEOF(__THIS.browse, 'function', __LABEL + "Methode 'browse' ist keine Funktion");

                                        return new Promise(function(resolve, reject) {
                                                return __THIS.browse(__URL, null, request => {
                                                        try {
                                                            const __DOC = request.response;
                                                            const __RET = request.responseText;

                                                            ASSERT_NOT_MATCH(__DOC, __EXP, "browseXMLCORSonload() response sollte keine XML-Daten liefern, sondern blockiert werden");

                                                            ASSERT_NOT_MATCH(__RET, __EXP, "browseXMLCORSonload() responseText sollte keine XML-Daten liefern, sondern blockiert werden");

                                                            return reject();
                                                        } catch (ex) {
                                                            return reject(ex);
                                                        }
                                                        // NOTE Unreachable...
                                                    }).catch(ex => {
                                                            try {
                                                                ASSERT_INSTANCEOF(ex, Error, "Promise muss Error zur\u00FCckgeben");
                                                                if (ex.message === __ERRORMSG1) {
                                                                    ASSERT_EQUAL(ex.message, __ERRORMSG1, "Fehlertext in Error falsch");
                                                                    ASSERT_EQUAL(ex.result, __ERRORRESULT, "Result in Error falsch");
                                                                } else {
                                                                    ASSERT_EQUAL(ex.message, __ERRORMSG2, "Fehlertext in Error falsch");
                                                                }
                                                                ASSERT_EQUAL(ex.name, __ERRORTYPE, "Fehlertyp in Error falsch");

                                                                return resolve(true);
                                                            } catch (ex) {
                                                                return reject(ex);
                                                            }
                                                        });
                                            });
                                    }
        });

// ==================== Ende Abschnitt Versuch eines Verbindungsaufbaus ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.xhr ====================

// *** EOF ***

/*** Ende Modul util.xhr.test.js ***/

/*** Modul util.xhr.gm.test.js ***/

// ==UserModule==
// _name         util.xhr.gm.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer GM XHR-Aufrufe
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.xhr.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.xhr.gm.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.lib.option.js
// _require      https://eselce.github.io/OS2.scripts/test/util.xhr.gm.test.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.xhr.gm ====================

(() => {

// ==================== Abschnitt Versuch eines Verbindungsaufbaus ====================

    const __THIS = __GM_XHR;
    const __LABEL = "[GM_XHR] ";

    const __TESTFUNS = [
            'browse',
            'getRequest',
            'putRequest',
            'postRequest',
            'headRequest',
            'xmlRequest',
            'registerCallback',
            '__XMLREQUEST'
        ];

    const __TESTDATA = {
            'browseXML'     : [ "https://eselce.github.io/GitTest/misc/OS2/lib/util.xhr.js",                    /^\/\/ ==UserScript==([^]*)\n+\/\/ _name         util\.xhr$/m  ],
            'browseXMLCORS' : [ "https://os.ongapo.com/spv.php?action=getListByName&term=Volodimir Oleynikov",  /.*/    ]
        };

    new UnitTestOption('util.xhr.gm.js', "Schnittstelle zum GM Verbindungsaufbau", {
            'handlerExists'       : function() {
                                        return ASSERT_SET(__THIS, __LABEL + "Handler nicht gefunden");
                                    },
            'memberFuns'          : function() {
                                        for (let testFun of __TESTFUNS) {
                                            const __TESTFUN = __THIS[testFun];

                                            ASSERT_SET(__TESTFUN, __LABEL + "Methode " + __LOG.info(testFun, false) + " nicht gefunden");

                                            return ASSERT_TYPEOF(__TESTFUN, 'function', __LABEL + "Methode " + __LOG.info(testFun, false) + " ist keine Funktion");
                                        }
                                    },
            'browseXML'           : function() {
                                        const [ __URL, __EXP ] = __TESTDATA['browseXML'];

                                        ASSERT_SET(__THIS.browse, __LABEL + "Methode 'browse' nicht gefunden");
                                        ASSERT_TYPEOF(__THIS.browse, 'function', __LABEL + "Methode 'browse' ist keine Funktion");

                                        return callPromiseChain(__THIS.browse(__URL), doc => {
                                                const __RET = doc;

                                                return ASSERT_MATCH(__RET, __EXP, "browseXML() sollte XML-Daten liefern");
                                            });
                                    },
            'browseXMLonload'     : function() {
                                        const [ __URL, __EXP ] = __TESTDATA['browseXML'];

                                        ASSERT_SET(__THIS.browse, __LABEL + "Methode 'browse' nicht gefunden");
                                        ASSERT_TYPEOF(__THIS.browse, 'function', __LABEL + "Methode 'browse' ist keine Funktion");

                                        return new Promise(function(resolve, reject) {
                                                return __THIS.browse(__URL, null, request => {
                                                        try {
                                                            const __DOC = request.response;
                                                            const __RET = request.responseText;

                                                            ASSERT_MATCH(__DOC, __EXP, "browseXMLonload() response sollte XML-Daten liefern");

                                                            ASSERT_MATCH(__RET, __EXP, "browseXMLonload() responseText sollte XML-Daten liefern");

                                                            return resolve(true);
                                                        } catch (ex) {
                                                            return reject(ex);
                                                        }
                                                        // NOTE Unreachable...
                                                    }).catch(reject);
                                            });
                                    },
            'browseXMLCORS'       : function() {
                                        const [ __URL, __EXP ] = __TESTDATA['browseXMLCORS'];

                                        ASSERT_SET(__THIS.browse, __LABEL + "Methode 'browse' nicht gefunden");
                                        ASSERT_TYPEOF(__THIS.browse, 'function', __LABEL + "Methode 'browse' ist keine Funktion");

                                        return callPromiseChain(__THIS.browse(__URL), doc => {
                                                const __RET = doc;

                                                return ASSERT_EQUAL(__RET, __EXP, "browseXMLCORS() sollte XML-Daten liefern");
                                            });
                                    },
            'browseXMLCORSonload' : function() {
                                        const [ __URL, __EXP ] = __TESTDATA['browseXMLCORS'];

                                        ASSERT_SET(__THIS.browse, __LABEL + "Methode 'browse' nicht gefunden");
                                        ASSERT_TYPEOF(__THIS.browse, 'function', __LABEL + "Methode 'browse' ist keine Funktion");

                                        return new Promise(function(resolve, reject) {
                                                return __THIS.browse(__URL, null, request => {
                                                        try {
                                                            const __DOC = request.response;
                                                            const __RET = request.responseText;

                                                            ASSERT_MATCH(__DOC, __EXP, "browseXMLCORSonload() response sollte XML-Daten liefern");

                                                            ASSERT_MATCH(__RET, __EXP, "browseXMLCORSonload() responseText sollte XML-Daten liefern");

                                                            return resolve(true);
                                                        } catch (ex) {
                                                            return reject(ex);
                                                        }
                                                        // NOTE Unreachable...
                                                    }).catch(reject);
                                            });
                                    }
        });

// ==================== Ende Abschnitt Versuch eines Verbindungsaufbaus ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.xhr.gm ====================

// *** EOF ***

/*** Ende Modul util.xhr.gm.test.js ***/

