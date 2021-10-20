

/*** Modul test.assert.js ***/

// ==UserScript==
// _name         test.assert
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit ASSERT-Funktionen aller Art und AssertFailed
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
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

// ==================== Abschnitt fuer Error-Handling ====================

// Assertion-Callback-Funktion fuer onRejected, also abgefangener Fehler
// in einer Promise bei Exceptions oder Fehler bzw. Rejections innerhalb einer Assertion
// error: Parameter von reject() im Promise-Objekt, der von Promise.catch() erhalten wurde
// attribs: Weitere Attribute in Objekten, die im error vermerkt werden
// return Liefert eine Assertion und die showAlert()-Parameter zurueck
function assertionCatch(error, ...attribs) {
    try {
        const __LABEL = `[${error.lineNumber}] ${__DBMOD.Name}`;
        const __ERROR = Object.assign(error, ...attribs);
        const __RET = showException(__LABEL, __ERROR, false);

        return ASSERT(false, "Promise rejected!", __RET);
    } catch (ex) {
        return showException(`[${ex.lineNumber}] ${__DBMOD.Name}`, ex);
    }
}

// ==================== Ende Abschnitt fuer Error-Handling ====================

// ==================== Abschnitt fuer einfaches Testen von Arrays von Promises und Funktionen ====================

// Funktion zum sequentiellen Aufruf eines Arrays von Funktionen ueber Promises
// startValue: Promise oder Wert, der/die den Startwert oder das Startobjekt beinhaltet
// funs: Liste oder Array von Funktionen, die jeweils das Zwischenergebnis umwandeln
// throw Wirft im Fehlerfall eine AssertionFailed-Exception
// return Ein Promise-Objekt mit dem Endresultat
async function callPromiseChain(startValue, ...funs) {
    return funs.flat(1).reduce((prom, fun, idx, arr) => prom.then(fun, ex => assertionCatch(ex, {
            'function'  : fun,
            'param'     : prom,
            'array'     : arr,
            'index'     : idx
        })), Promise.resolve(startValue));
}

// Funktion zum parallelen Aufruf eines Arrays von Promises bzw. Promise-basierten Funktionen
// promises: Liste oder Array von Promises oder Werten
// throw Wirft im Fehlerfall eine AssertionFailed-Exception
// return Ein Promise-Objekt mit einem Array von Einzelergebnissen als Endresultat
async function callPromiseArray(...promises) {
    return Promise.all(promises.flat(1).map((val, idx, arr) => Promise.resolve(val).catch(ex => assertionCatch(ex, {
            'promise'   : value,
            'array'     : arr,
            'index'     : idx
        }))));
}

// ==================== Ende Abschnitt fuer einfaches Testen von Arrays von Promises und Funktionen  ====================

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
        __LOG[4]("FAIL", __FAIL);

        throw __FAIL;
    } else {
        __LOG[8]("OK", test);
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
    return ASSERT(test === null, __LOG.info(test, true, true) + " !== null", msg, thisArg, ...params);
}

const ASSERT_NOT_NULL = function(test, msg, thisArg, ...params) {
    return ASSERT(test !== null, __LOG.info(test, true, true) + " === null", msg, thisArg, ...params);
}

const ASSERT_SET = function(test, msg, thisArg, ...params) {
    return ASSERT(test != undefined, __LOG.info(test, true, true) + " == undefined", msg, thisArg, ...params);
}

const ASSERT_NOT_SET = function(test, msg, thisArg, ...params) {
    return ASSERT(test == undefined, __LOG.info(test, true, true) + " != undefined", msg, thisArg, ...params);
}

const ASSERT_EQUAL = function(erg, exp, msg, thisArg, ...params) {
    return ASSERT(__LOG.info(erg, true, true) === __LOG.info(exp, true, true), __LOG.info(erg, true, true) + " !== " + __LOG.info(exp, true, true), msg, thisArg, ...params);
}

const ASSERT_NOT_EQUAL = function(erg, exp, msg, thisArg, ...params) {
    return ASSERT(__LOG.info(erg, true, true) !== __LOG.info(exp, true, true), __LOG.info(erg, true, true) + " === " + __LOG.info(exp, true, true), msg, thisArg, ...params);
}

const ASSERT_ALIKE = function(erg, exp, msg, thisArg, ...params) {
    return ASSERT(erg == exp, __LOG.info(erg, true, true) + " != " + __LOG.info(exp, true, true), msg, thisArg, ...params);
}

const ASSERT_NOT_ALIKE = function(erg, exp, msg, thisArg, ...params) {
    return ASSERT(erg != exp, __LOG.info(erg, true, true) + " == " + __LOG.info(exp, true, true), msg, thisArg, ...params);
}

const ASSERT_IN_DELTA = function(erg, exp, delta, msg, thisArg, ...params) {
    return ASSERT(Math.abs(erg - exp) <= delta, __LOG.info(erg, true, true) + " != " + __LOG.info(exp, true, true) + " +/- " + delta, msg, thisArg, ...params);
}

const ASSERT_NOT_IN_DELTA = function(erg, exp, delta, msg, thisArg, ...params) {
    return ASSERT(Math.abs(erg - exp) > delta, __LOG.info(erg, true, true) + " == " + __LOG.info(exp, true, true) + " +/- " + delta, msg, thisArg, ...params);
}

const ASSERT_INSTANCEOF = function(obj, cls, msg, thisArg, ...params) {
    return ASSERT((obj instanceof cls), __LOG.info(obj, true, true) + " ist kein " + __LOG.info(cls, true, true), msg, thisArg, ...params);
}

const ASSERT_NOT_INSTANCEOF = function(obj, cls, msg, thisArg, ...params) {
    return ASSERT_NOT((obj instanceof cls), __LOG.info(obj, true, true) + " ist " + __LOG.info(cls, true, true), msg, thisArg, ...params);
}

const ASSERT_MATCH = function(str, pattern, msg, thisArg, ...params) {
    return ASSERT((str || "").match(pattern), __LOG.info(str, true, true) + " match-t " + __LOG.info(pattern, true, true), msg, thisArg, ...params);
}

const ASSERT_NOT_MATCH = function(str, pattern, msg, thisArg, ...params) {
    return ASSERT_NOT((str || "").match(pattern), __LOG.info(str, true, true) + " match-t nicht " + __LOG.info(pattern, true, true), msg, thisArg, ...params);
}

// ==================== Ende Abschnitt fuer sonstige ASSERT-Funktionen ====================

// ==================== Abschnitt fuer globale Variablen ====================

// Parameter fuer ASSERT_IN_DELTA und ASSERT_NOT_IN_DELTA (Float-Genauigkeit)...
const __ASSERTDELTA = 0.000001;

// ==================== Ende Abschnitt fuer globale Variablen ====================

// *** EOF ***

/*** Ende test.assert.js ***/

/*** Modul test.class.unittest.js ***/

// ==UserScript==
// _name         test.class.unittest
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Basisklasse fuer Unit-Tests fuer ein JS-Modul
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

__LOG.init(window, 9);  // Testphase

// ==================== Abschnitt fuer Klasse UnitTest ====================

// Basisklasse fuer die Ausfuehrung von Unit-Tests fuer ein JS-Modul
// name: Name des JS-Moduls
// desc: Beschreibung des Moduls
// tests: Objekt mit den Testfunktionen
// load: Angabe, ob die Tests geladen werden sollen (false: Test nicht laden)
function UnitTest(name, desc, tests, load) {
    'use strict';

    this.register(name, desc, tests, load, this);
}

Class.define(UnitTest, Object, {
                  'register'       : function(name, desc, tests, load, thisArg) {
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
                                                                                       const __MSG = "No tests available for " + __LIBNAME;
                                                                                       __LOG[1](__MSG);
                                                                                       throw __MSG;
                                                                                   });
                                             }
                                         }

                                         __ALLLIBS[__LIBNAME] = __LIBENTRY;
                                     },
                  'addTest'        : function(name, tFun, desc = undefined) {
                                         const __NAME = name;
                                         const __TFUN = (tFun || { });  // TODO: Dummy
                                         const __TFUNDOBJ = __TFUN.description;
                                         const __TFUNDESC = (__TFUNDOBJ ? String((typeof __TFUNDOBJ === 'function') ? __TFUNDOBJ() : __TFUNDOBJ) : undefined);
                                         const __DESC = (desc || __TFUNDESC);
                                         const __ENTRY = {
                                                             'name' : __NAME,
                                                             'desc' : __DESC,
                                                             'tFun' : __TFUN
                                                         };

                                         this.tDefs.push(__ENTRY);
                                     },
                  'run'            : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
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

                                                 __RESULT.running();  // Testzaehler erhoehen...
                                                 __LOG[4]("Running test", __LOG.info(name, false) + "->" + __LOG.info(__NAME, false) + (__DESC ? " (" + __DESC + ')' : "") + "...");

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
                                                        __LOG[1]("Exception", ex, "in test",__LOG.info(name, false) + "->" + __LOG.info(__NAME, false) + ':', __RESULT.sum());
                                                    }
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

UnitTest.runAll = async function(resultFun = UnitTest.defaultResultFun, tableId, resultObj, thisArg) {
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
            const __TFUN = __TEST['run'];  // TODO: __TEST.run, aber variabel gehalten!
            const __THIS = (thisArg || __TEST);
            const __RESULTS = new UnitTestResults("SUMME", __NAME, __TEST);

            __LOG[2]("Starting tests for module", __LOG.info(__NAME, false) + ':', __DESC);

            try {
                __LIBRESULTS[__NAME] = await __TFUN.call(__TEST, __NAME, __DESC, __THIS, __RESULTS, resultFun, tableId);
            } catch (ex) {
                // Fehler im Framework der Testklasse...
                __RESULTS.checkException(ex);

                __LOG[1]("Exception", ex, "in module", __LOG.info(__NAME, false) + ':', __RESULTS.sum());
            } finally {
                __ALLRESULTS.merge(__RESULTS);  // aufaddieren...

                __LOG[2]("Finished tests for module", __LOG.info(__NAME, false) + ':',  __RESULTS.sum());
                __LOG[6]("Total results after module", __LOG.info(__NAME, false) + ':',  __ALLRESULTS.sum());

                // Ergebnis eintragen...
                resultFun.call(__THIS, null, tableId, document);  // Leerzeile
                resultFun.call(__THIS, __RESULTS, tableId, document);
                resultFun.call(__THIS, null, tableId, document);  // Leerzeile
            }
        } catch(ex) {
            // Fehler im Framework der UnitTests und Module...
            __ALLRESULTS.checkException(ex);

            __LOG[1]("Exception", ex, "in module", __LOG.info(__NAME, false) + ':',  __ALLRESULTS.sum());
        }
    }

    try {
        __LOG[5]("Detailed results for all tests:", __LIBRESULTS);
        __LOG[2]("Results for all tests:", __ALLRESULTS.sum());

        // Endergebnis eintragen...
        resultFun.call(thisArg, null, tableId, document);  // Leerzeile
        resultFun.call(thisArg, __ALLRESULTS, tableId, document);
    } catch(ex) {
        // Fehler bei der Anzeige des Ergebnisses...
        __ALLRESULTS.checkException(ex);
    }

    return __ALLRESULTS;
}

UnitTest.defaultResultFun = function(resultObj, tableId, doc = document) {
    const __TABLE = UnitTest.getOrCreateTestResultTable(tableId, doc);
    const __RESULTS = (resultObj || { });
    const __UNITTEST = (__RESULTS.test || { });

    if (__TABLE) {
        const __ROW = doc.createElement('tr');
        const __COLOR = undefined;

        if (__RESULTS.name) {
            appendCell(__ROW, __UNITTEST.name, __COLOR);
            appendCell(__ROW, __UNITTEST.desc, __COLOR);
            appendCell(__ROW, __RESULTS.name, __COLOR);
            appendCell(__ROW, __RESULTS.desc, __COLOR);
            appendCell(__ROW, __RESULTS.countRunning, __COLOR);
            appendCell(__ROW, __RESULTS.countSuccess, __COLOR);
            appendCell(__ROW, __RESULTS.countFailed, __COLOR);
            appendCell(__ROW, __RESULTS.countError, __COLOR);
            appendCell(__ROW, __RESULTS.countException, __COLOR);
            appendCell(__ROW, __RESULTS.result, __COLOR);
        }

        __TABLE.appendChild(__ROW);
    }

    return __TABLE;
}

UnitTest.getOrCreateTestResultTable = function(tableId = 'UnitTest', doc = document) {
    let table = doc.getElementById(tableId);

    if (! table) {  // Anlegen...
        table = doc.createElement('table');
        table.id = tableId;
        doc.body.appendChild(table);
    }

    if (! table.rows.length) {
        const __ROW = doc.createElement('tr');
        const __COLOR = undefined;

        appendCell(__ROW, "Modul", __COLOR);
        appendCell(__ROW, "Beschreibung", __COLOR);
        appendCell(__ROW, "Test", __COLOR);
        appendCell(__ROW, "Details", __COLOR);
        appendCell(__ROW, "Anz", __COLOR);
        appendCell(__ROW, "OK", __COLOR);
        appendCell(__ROW, "FAIL", __COLOR);
        appendCell(__ROW, "ERR", __COLOR);
        appendCell(__ROW, "EX", __COLOR);
        appendCell(__ROW, "Ergebnis", __COLOR);

        table.appendChild(__ROW);
    }

    return table;
}

// ==================== Ende Abschnitt fuer Klasse UnitTest ====================

// ==================== Abschnitt fuer Klasse UnitTestResults ====================

// Ergebnisklasse fuer die Ausfuehrung von Unit-Tests fuer ein JS-Modul
// libName: Name des JS-Moduls
// libDesc: Beschreibung des Moduls
// libTest: UnitTest-Klasse des Moduls
function UnitTestResults(libName, libDesc, libTest) {
    'use strict';

    this.name = libName;
    this.desc = libDesc;
    this.test = (libTest || { });

    this.countRunning   = 0;  // Zaehler Tests
    this.countSuccess   = 0;  // Zaehler OK
    this.countFailed    = 0;  // Zaehler FAIL
    this.countError     = 0;  // Zaehler ERR (Fehler im Test, Spezial-Exception)
    this.countException = 0;  // Zaehler EX (andere Exceptions)
}

Class.define(UnitTestResults, Object, {
                'running'             : function() {
                                            return ++this.countRunning;
                                        },
                'success'             : function() {
                                            return ++this.countSuccess;
                                        },
                'failed'              : function() {
                                            return ++this.countFailed;
                                        },
                'error'               : function(ex) {
                                            const __EX = (ex || { });

                                            this.result = __EX.message;

                                            return ++this.countError;
                                        },
                'exception'           : function(ex) {
                                            const __EX = (ex || { });

                                            if (__EX instanceof AssertionFailed) {
                                                this.result = __EX.getText();

                                                return this.failed();
                                            } else {
                                                this.result = String(__EX);

                                                return ++this.countException;
                                            }
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
                                            this.countRunning   += resultsToAdd.countRunning;
                                            this.countSuccess   += resultsToAdd.countSuccess;
                                            this.countFailed    += resultsToAdd.countFailed;
                                            this.countError     += resultsToAdd.countError;
                                            this.countException += resultsToAdd.countException;

                                            if (! this.results) {
                                                this.results = { };
                                            }
                                            this.results[resultsToAdd.name] = resultsToAdd.results;

                                            return this;
                                        },
                'sum'                 : function() {
                                            return {
                                                    'name'      : this.name,
                                                    'desc'      : this.desc,
                                                    'running'   : this.countRunning,
                                                    'success'   : this.countSuccess,
                                                    'failed'    : this.countFailed,
                                                    'error'     : this.countError,
                                                    'exception' : this.countException,
                                                    'tests'     : this.test.tDefs,
                                                    'results'   : this.results
                                                };
                                        }
            });

// ==================== Ende Abschnitt fuer Klasse UnitTestResults ====================

// ==================== Abschnitt fuer globale Variablen ====================

const __ALLLIBS = { };
const __LIBRESULTS = { };

// ==================== Ende Abschnitt fuer globale Variablen ====================

// *** EOF ***

/*** Ende test.class.unittest.js ***/

/*** Modul util.log.test.js ***/

// ==UserScript==
// _name         util.log.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Logging und safeStringify()
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/util.log.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.log ====================

(() => {

// ==================== Abschnitt fuer Logging ====================

//const __LOG = {
//                  'logFun'    : [
//                  'init'      : function(win, logLevel = 1) {
//                  'stringify' : safeStringify,      // JSON.stringify
//                  'changed'   : function(oldVal, newVal) {

// ==================== Ende Abschnitt fuer Logging ====================

// ==================== Abschnitt fuer safeStringify() ====================

//function safeStringify(value, replacer = undefined, space = undefined, cycleReplacer = undefined) {
//function serializer(replacer = undefined, cycleReplacer = undefined) {
//function replaceArraySimple(key, value) {
//function replaceArray(key, value) {

// ==================== Ende Abschnitt fuer safeStringify() ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.log ====================

// *** EOF ***

/*** Ende util.log.test.js ***/

/*** Modul util.store.test.js ***/

// ==UserScript==
// _name         util.store.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Script-Optionen im Benutzermenue
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/util.store.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.store ====================

(() => {

// ==================== Abschnitt fuer die Sicherung und das Laden von Daten ====================

    // Komponenten der Testreihen (sto/ser x ent/sum/des):
    // storeValue*   = STO/ent
    // summonValue*  = sto/SUM * DEF
    // serialize*    = SER/sum
    // serialize2*   = SER/ent
    // deserialize*  = sto/DES * DEF
    // deserialize2* = ser/DES * DEF
    const __UNITTESTSTORE1 = new UnitTest('util.store.js Daten', "Sicherung und das Laden von Daten", {
            'storeValueString'    : function() {
                                        const __NAME = "UnitTestS";
                                        const __VAL = "Teststring";
                                        const __EXP = '"Teststring"';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "String falsch gespeichert");
                                            });
                                    },
            'storeValueInt'       : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 42;
                                        const __EXP = '42';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Integer falsch gespeichert");
                                            });
                                    },
            'storeValueBool'      : function() {
                                        const __NAME = "UnitTestB";
                                        const __VAL = false;
                                        const __EXP = 'false';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Boolean falsch gespeichert");
                                            });
                                    },
            'storeValueFloat'     : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 47.11;
                                        const __EXP = '47.11';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_IN_DELTA(__RET, __VAL, __ASSERTDELTA, "Float falsch gespeichert");
                                            });
                                    },
            'storeValueArray'     : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ 1, 2, 4, 8 ];
                                        const __EXP = '[1,2,4,8]';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch gespeichert");
                                            });
                                    },
            'storeValueArray2'   : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ "1", null, false, 815 ];
                                        const __EXP = '["1",null,false,815]';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch gespeichert");
                                            });
                                    },
            'storeValueArray3'   : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ String(1), undefined, Boolean(true), new AssertionFailed(815, "Fehler") ];
                                        const __EXP = '["1",null,true,{"text":"Fehler (815)"}]';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch gespeichert");
                                            });
                                    },
            'storeValueObject'    : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { eins : 1, zwei : 2, fuenf : 5 };
                                        const __EXP = '{"eins":1,"zwei":2,"fuenf":5}';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch gespeichert");
                                            });
                                    },
            'storeValueObject2'   : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'const': { innen : true, aussen : null }, a : { b : { c : [ 2, 47.11, true ] } } };
                                        const __EXP = '{"const":{"innen":true,"aussen":null},"a":{"b":{"c":[2,47.11,true]}}}';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch gespeichert");
                                            });
                                    },
            'storeValueObject3'   : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'fun' : function(x) { return x * x; }, 'bool' : new Boolean(true) };
                                        const __EXP = '{"bool":true}';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch gespeichert");
                                            });
                                    },
            'storeValueUndef'     : function() {
                                        const __NAME = "UnitTestU";
                                        const __VAL = undefined;
                                        const __EXP = undefined;

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Undefined falsch gespeichert");
                                            });
                                    },
            'storeValueNull'      : function() {
                                        const __NAME = "UnitTestN";
                                        const __VAL = null;
                                        const __EXP = 'null';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch gespeichert");
                                            });
                                    },
            'storeValueNaN'       : function() {
                                        const __NAME = "UnitTestNaN";
                                        const __VAL = NaN;
                                        const __EXP = 'null';  // TODO: richtig?

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "NaN falsch gespeichert");
                                            });
                                    },
            'storeValueFunction'  : function() {
                                        const __NAME = "UnitTestP";
                                        const __VAL = function(x) { return x * x; };
                                        const __EXP = undefined;

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Function falsch gespeichert");
                                            });
                                    },
            'summonValueString'   : function() {
                                        const __NAME = "UnitTestS";
                                        const __VAL = "Teststring";
                                        const __EXP = '"Teststring"';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "String falsch geladen");
                                            });
                                    },
            'summonValueInt'      : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 42;
                                        const __EXP = '42';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Integer falsch geladen");
                                            });
                                    },
            'summonValueBool'     : function() {
                                        const __NAME = "UnitTestB";
                                        const __VAL = false;
                                        const __EXP = 'false';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Boolean falsch geladen");
                                            });
                                    },
            'summonValueFloat'    : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 47.11;
                                        const __EXP = '47.11';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_IN_DELTA(__RET, __VAL, __ASSERTDELTA, "Float falsch geladen");
                                            });
                                    },
            'summonValueArray'    : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ 1, 2, 4, 8 ];
                                        const __EXP = '[1,2,4,8]';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'summonValueArray2'   : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ "1", null, false, 815 ];
                                        const __EXP = '["1",null,false,815]';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'summonValueArray3'   : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ String(1), undefined, Boolean(true), new AssertionFailed(815, "Fehler") ];
                                        const __EXP = '["1",null,true,{"text":"Fehler (815)"}]';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'summonValueObject'   : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { eins : 1, zwei : 2, fuenf : 5 };
                                        const __EXP = '{"eins":1,"zwei":2,"fuenf":5}';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'summonValueObject2'  : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'const': { innen : true, aussen : null }, a : { b : { c : [ 2, 47.11, true ] } } };
                                        const __EXP = '{"const":{"innen":true,"aussen":null},"a":{"b":{"c":[2,47.11,true]}}}';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'summonValueObject3'  : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'fun' : function(x) { return x * x; }, 'bool' : new Boolean(true) };
                                        const __EXP = '{"bool":true}';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'summonValueUndef'    : function() {
                                        const __NAME = "UnitTestU";
                                        const __VAL = undefined;
                                        const __EXP = undefined;

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Undefined falsch geladen");
                                            });
                                    },
            'summonValueNull'     : function() {
                                        const __NAME = "UnitTestN";
                                        const __VAL = null;
                                        const __EXP = 'null';

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch geladen");
                                            });
                                    },
            'summonValueNaN'      : function() {
                                        const __NAME = "UnitTestNaN";
                                        const __VAL = NaN;
                                        const __EXP = 'null';  // TODO: richtig?

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "NaN falsch geladen");
                                            });
                                    },
            'summonValueFunction' : function() {
                                        const __NAME = "UnitTestP";
                                        const __VAL = function(x) { return x * x; };
                                        const __EXP = undefined;

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Function falsch geladen");
                                            });
                                    },
            'summonValueDefault'  : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = 'ERROR';
                                        const __EXP = undefined;

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'summonValueDefault2' : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = 'ERROR';
                                        const __EXP = null;

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Defaultwert bei null ignoriert");
                                            });
                                    },
            'summonValueDefault3' : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = 'ERROR';
                                        const __EXP = "";

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Defaultwert bei \"\" ignoriert");
                                            });
                                    },
            'serializeString'     : function() {
                                        const __NAME = "UnitTestS";
                                        const __VAL = "Teststring";
                                        const __EXP = '"Teststring"';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "String falsch gespeichert");
                                            });
                                    },
            'serializeInt'        : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 42;
                                        const __EXP = '42';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Integer falsch gespeichert");
                                            });
                                    },
            'serializeBool'       : function() {
                                        const __NAME = "UnitTestB";
                                        const __VAL = false;
                                        const __EXP = 'false';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Boolean falsch gespeichert");
                                            });
                                    },
            'serializeFloat'      : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 47.11;
                                        const __EXP = '47.11';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Float falsch gespeichert");
                                            });
                                    },
            'serializeArray'      : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ 1, 2, 4, 8 ];
                                        const __EXP = '[1,2,4,8]';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            });
                                    },
            'serializeArray2'     : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ "1", null, false, 815 ];
                                        const __EXP = '["1",null,false,815]';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            });
                                    },
            'serializeArray3'     : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ String(1), undefined, Boolean(true), new AssertionFailed(815, "Fehler") ];
                                        const __EXP = '["1",null,true,{"text":"Fehler (815)"}]';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            });
                                    },
            'serializeObject'     : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { eins : 1, zwei : 2, fuenf : 5 };
                                        const __EXP = '{"eins":1,"zwei":2,"fuenf":5}';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            });
                                    },
            'serializeObject2'    : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'const': { innen : true, aussen : null }, a : { b : { c : [ 2, 47.11, true ] } } };
                                        const __EXP = '{"const":{"innen":true,"aussen":null},"a":{"b":{"c":[2,47.11,true]}}}';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            });
                                    },
            'serializeObject3'    : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'fun' : function(x) { return x * x; }, 'bool' : new Boolean(true) };
                                        const __EXP = '{"bool":true}';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            });
                                    },
            'serializeUndef'      : function() {
                                        const __NAME = "UnitTestU";
                                        const __VAL = undefined;
                                        const __EXP = undefined;

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Undefined falsch gespeichert");
                                            });
                                    },
            'serializeNull'       : function() {
                                        const __NAME = "UnitTestN";
                                        const __VAL = null;
                                        const __EXP = 'null';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Null falsch gespeichert");
                                            });
                                    },
            'serializeNaN'        : function() {
                                        const __NAME = "UnitTestNaN";
                                        const __VAL = NaN;
                                        const __EXP = 'null';  // TODO: richtig?

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "NaN falsch gespeichert");
                                            });
                                    },
            'serializeFunction'   : function() {
                                        const __NAME = "UnitTestP";
                                        const __VAL = function(x) { return x * x; };
                                        const __EXP = undefined;

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Function falsch gespeichert");
                                            });
                                    },
            'serializeDefault'    : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = undefined;
                                        const __EXP = 'ERROR';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'serializeDefault2'   : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = null;
                                        const __EXP = 'ERROR';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Defaultwert bei null ignoriert");
                                            });
                                    },
            'serializeDefault3'   : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = "";
                                        const __EXP = 'ERROR';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Defaultwert bei \"\" ignoriert");
                                            });
                                    },
            'serialize2String'    : function() {
                                        const __NAME = "UnitTestS";
                                        const __VAL = "Teststring";
                                        const __EXP = '"Teststring"';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "String falsch gespeichert");
                                            });
                                    },
            'serialize2Int'       : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 42;
                                        const __EXP = '42';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Integer falsch gespeichert");
                                            });
                                    },
            'serialize2Bool'      : function() {
                                        const __NAME = "UnitTestB";
                                        const __VAL = false;
                                        const __EXP = 'false';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Boolean falsch gespeichert");
                                            });
                                    },
            'serialize2Float'     : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 47.11;
                                        const __EXP = '47.11';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Float falsch gespeichert");
                                            });
                                    },
            'serialize2Array'     : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ 1, 2, 4, 8 ];
                                        const __EXP = '[1,2,4,8]';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            });
                                    },
            'serialize2Array2'    : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ "1", null, false, 815 ];
                                        const __EXP = '["1",null,false,815]';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            });
                                    },
            'serialize2Array3'    : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ String(1), undefined, Boolean(true), new AssertionFailed(815, "Fehler") ];
                                        const __EXP = '["1",null,true,{"text":"Fehler (815)"}]';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            });
                                    },
            'serialize2Object'    : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { eins : 1, zwei : 2, fuenf : 5 };
                                        const __EXP = '{"eins":1,"zwei":2,"fuenf":5}';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            });
                                    },
            'serialize2Object2'   : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'const': { innen : true, aussen : null }, a : { b : { c : [ 2, 47.11, true ] } } };
                                        const __EXP = '{"const":{"innen":true,"aussen":null},"a":{"b":{"c":[2,47.11,true]}}}';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            });
                                    },
            'serialize2Object3'   : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'fun' : function(x) { return x * x; }, 'bool' : new Boolean(true) };
                                        const __EXP = '{"bool":true}';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            });
                                    },
            'serialize2Undef'     : function() {
                                        const __NAME = "UnitTestU";
                                        const __VAL = undefined;
                                        const __EXP = undefined;

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Undefined falsch gespeichert");
                                            });
                                    },
            'serialize2Null'      : function() {
                                        const __NAME = "UnitTestN";
                                        const __VAL = null;
                                        const __EXP = 'null';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Null falsch gespeichert");
                                            });
                                    },
            'serialize2NaN'       : function() {
                                        const __NAME = "UnitTestNaN";
                                        const __VAL = NaN;
                                        const __EXP = 'null';  // TODO: richtig?

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "NaN falsch gespeichert");
                                            });
                                    },
            'serialize2Function'  : function() {
                                        const __NAME = "UnitTestP";
                                        const __VAL = function(x) { return x * x; };
                                        const __EXP = undefined;

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Function falsch gespeichert");
                                            });
                                    },
            'deserializeString'   : function() {
                                        const __NAME = "UnitTestS";
                                        const __VAL = "Teststring";
                                        const __EXP = '"Teststring"';

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "String falsch geladen");
                                            });
                                    },
            'deserializeInt'      : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 42;
                                        const __EXP = '42';

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Integer falsch geladen");
                                            });
                                    },
            'deserializeBool'     : function() {
                                        const __NAME = "UnitTestB";
                                        const __VAL = false;
                                        const __EXP = 'false';

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Boolean falsch geladen");
                                            });
                                    },
            'deserializeFloat'    : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 47.11;
                                        const __EXP = '47.11';

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_IN_DELTA(__RET, __VAL, __ASSERTDELTA, "Float falsch geladen");
                                            });
                                    },
            'deserializeArray'    : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ 1, 2, 4, 8 ];
                                        const __EXP = '[1,2,4,8]';

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'deserializeArray2'   : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ "1", null, false, 815 ];
                                        const __EXP = '["1",null,false,815]';

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'deserializeArray3'   : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ String(1), undefined, Boolean(true), new AssertionFailed(815, "Fehler") ];
                                        const __EXP = '["1",null,true,{"text":"Fehler (815)"}]';

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'deserializeObject'   : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { eins : 1, zwei : 2, fuenf : 5 };
                                        const __EXP = '{"eins":1,"zwei":2,"fuenf":5}';

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'deserializeObject2'  : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'const': { innen : true, aussen : null }, a : { b : { c : [ 2, 47.11, true ] } } };
                                        const __EXP = '{"const":{"innen":true,"aussen":null},"a":{"b":{"c":[2,47.11,true]}}}';

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'deserializeObject3'  : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'fun' : function(x) { return x * x; }, 'bool' : new Boolean(true) };
                                        const __EXP = '{"bool":true}';

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'deserializeUndef'    : function() {
                                        const __NAME = "UnitTestU";
                                        const __VAL = undefined;
                                        const __EXP = undefined;

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Undefined falsch geladen");
                                            });
                                    },
            'deserializeNull'     : function() {
                                        const __NAME = "UnitTestN";
                                        const __VAL = null;
                                        const __EXP = 'null';

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch geladen");
                                            });
                                    },
            'deserializeNaN'      : function() {
                                        const __NAME = "UnitTestNaN";
                                        const __VAL = NaN;
                                        const __EXP = 'null';  // TODO: richtig?

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "NaN falsch geladen");
                                            });
                                    },
            'deserializeFunction' : function() {
                                        const __NAME = "UnitTestP";
                                        const __VAL = function(x) { return x * x; };
                                        const __EXP = undefined;

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Function falsch geladen");
                                            });
                                    },
            'deserializeDefault'  : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = 'ERROR';
                                        const __EXP = undefined;

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'deserializeDefault2' : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = 'ERROR';
                                        const __EXP = null;

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Defaultwert bei null ignoriert");
                                            });
                                    },
            'deserializeDefault3' : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = 'ERROR';
                                        const __EXP = "";

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Defaultwert bei \"\" ignoriert");
                                            });
                                    },
            'deserialize2String'  : function() {
                                        const __NAME = "UnitTestS";
                                        const __VAL = "Teststring";
                                        const __EXP = '"Teststring"';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "String falsch geladen");
                                            });
                                    },
            'deserialize2Int'     : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 42;
                                        const __EXP = '42';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Integer falsch geladen");
                                            });
                                    },
            'deserialize2Bool'    : function() {
                                        const __NAME = "UnitTestB";
                                        const __VAL = false;
                                        const __EXP = 'false';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Boolean falsch geladen");
                                            });
                                    },
            'deserialize2Float'   : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 47.11;
                                        const __EXP = '47.11';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_IN_DELTA(__RET, __VAL, __ASSERTDELTA, "Float falsch geladen");
                                            });
                                    },
            'deserialize2Array'   : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ 1, 2, 4, 8 ];
                                        const __EXP = '[1,2,4,8]';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'deserialize2Array2'  : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ "1", null, false, 815 ];
                                        const __EXP = '["1",null,false,815]';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'deserialize2Array3'  : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ String(1), undefined, Boolean(true), new AssertionFailed(815, "Fehler") ];
                                        const __EXP = '["1",null,true,{"text":"Fehler (815)"}]';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'deserialize2Object'  : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { eins : 1, zwei : 2, fuenf : 5 };
                                        const __EXP = '{"eins":1,"zwei":2,"fuenf":5}';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'deserialize2Object2' : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'const': { innen : true, aussen : null }, a : { b : { c : [ 2, 47.11, true ] } } };
                                        const __EXP = '{"const":{"innen":true,"aussen":null},"a":{"b":{"c":[2,47.11,true]}}}';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'deserialize2Object3' : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'fun' : function(x) { return x * x; }, 'bool' : new Boolean(true) };
                                        const __EXP = '{"bool":true}';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'deserialize2Undef'   : function() {
                                        const __NAME = "UnitTestU";
                                        const __VAL = undefined;
                                        const __EXP = undefined;

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Undefined falsch geladen");
                                            });
                                    },
            'deserialize2Null'    : function() {
                                        const __NAME = "UnitTestN";
                                        const __VAL = null;
                                        const __EXP = 'null';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch geladen");
                                            });
                                    },
            'deserialize2NaN'     : function() {
                                        const __NAME = "UnitTestNaN";
                                        const __VAL = NaN;
                                        const __EXP = 'null';  // TODO: richtig?

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "NaN falsch geladen");
                                            });
                                    },
            'deserialize2Function': function() {
                                        const __NAME = "UnitTestP";
                                        const __VAL = function(x) { return x * x; };
                                        const __EXP = undefined;

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Function falsch geladen");
                                            });
                                    },
            'deserialize2Default' : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = undefined;
                                        const __EXP = 'ERROR';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'deserialize2Default2': function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = null;
                                        const __EXP = 'ERROR';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Defaultwert bei null ignoriert");
                                            });
                                    },
            'deserialize2Default3': function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = "";
                                        const __EXP = 'ERROR';

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, 'ERROR'), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Defaultwert bei \"\" ignoriert");
                                            });
                                    }
        });

// ==================== Abschnitt fuer die Folgen einer Speicherung ====================

    const __UNITTESTSTORE2 = new UnitTest('util.store.js Reload', "Neuladen der Seite", {
            'refreshPageNoReload' : function() {
                                        const __RET = refreshPage(false);
                                        return ASSERT_NOT_SET(__RET, "Kein Returnwert erwartet");
                                    }
        });

// ==================== Abschnitt fuer die Sicherung von Daten mit Callback ====================

    const __UNITTESTSTORE3 = new UnitTest('util.store.js Callback', "Sicherung von Daten mit Callback", {
//            'setStored'           : function() {
//                                    }
        });

//function setStored(name, value, reload = false, serial = false, onFulfilled = undefined, onRejected = undefined) {
//function setNextStored(arr, name, value, reload = false, serial = false, onFulfilled = undefined, onRejected = undefined) {

// ==================== Ende Abschnitt fuer die Sicherung und das Laden von Daten ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.store ====================

// *** EOF ***

/*** Ende util.store.test.js ***/

