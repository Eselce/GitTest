/****** JavaScript-Bibliothek 'lib.test.base.js' ["TESTBASE"] ******/

// Inhaltsverzeichnis:
// https://eselce.github.io/GitTest/misc/OS2/lib/<TESTBASE>: 
//  test.assert.js
//  test.class.unittest.js
//  test.lib.option.js

/*** Modul test.assert.js ***/

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
    const __DELTA = ((exp === 0.0) ? 1.0 : exp) * __EPSILON;

    return ASSERT(Math.abs(erg - exp) <= __DELTA, __LOG.info(erg, true, true) + " != " + __LOG.info(exp, true, true) + " +/- " + __PROZENT + '%', msg, thisArg, ... params);
}

const ASSERT_NOT_IN_EPSILON = function(erg, exp, scale = 1, epsilon = __ASSERTEPSILON, msg, thisArg, ... params) {
    checkType(erg, 'number', true, 'ASSERT_NOT_IN_EPSILON', "erg", 'Number');
    checkType(exp, 'number', true, 'ASSERT_NOT_IN_EPSILON', "exp", 'Number');

    const __EPSILON = scale * epsilon;
    const __PROZENT = 100 * __EPSILON;
    const __DELTA = ((exp === 0.0) ? 1.0 : exp) * __EPSILON;

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

// ==UserScript==
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
// ==/UserScript==

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
            const __RESULTS = new UnitTestResults("SUMME", __NAME, __TEST);
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
    const __SUMMARY = ((__UNITTEST.name === __RESULTS.desc) || __ENDSUMMARY);
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

// ==UserScript==
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
// ==/UserScript==

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
                   'Default'   : 18,
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

