// ==UserScript==
// _name         test.class.unittest
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Basisklasse fuer Unit-Tests fuer ein JS-Modul
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

__LOG.init(window, 7);  // Testphase

// ==================== Abschnitt fuer Klasse UnitTest ====================

// Basisklasse fuer die Ausfuehrung von Unit-Tests fuer ein JS-Modul
// name: Name des JS-Moduls
// desc: Beschreibung des Moduls
// tests: Objekt mit den Testfunktionen
function UnitTest(name, desc, tests) {
    'use strict';

    this.register(name, desc, tests, this);
}

Class.define(UnitTest, Object, {
                  'register'       : function(name, desc, tests, thisArg) {
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
                  'run'            : function(name, desc, thisArg, resultObj, resultFun, tableId) {
                                         const __RESULTS = (resultObj || (new UnitTestResults(name, desc, this)));
                                         const __TDEFS = this.tDefs;
                                         const __THIS = (thisArg || this);
                                         const __RETVALS = [];

                                         __LOG[2]("Running " + __TDEFS.length + " tests for module '" + name + "': " + desc);

                                         try {
                                             for (let entry of __TDEFS) {
                                                 const __NAME = entry.name;
                                                 const __DESC = entry.desc;
                                                 const __TFUN = entry.tFun;
                                                 const __RESULT = new UnitTestResults(__NAME, __DESC, __TFUN);

                                                 __RESULT.running();  // Testzaehler erhoehen...
                                                 __LOG[3]("Running test '" + name + "'->'" + __NAME + "'" + (__DESC ? " (" + __DESC + ')' : "") + "...");

                                                 try {
                                                     const __RETVAL = __TFUN.call(__THIS);

                                                     __RESULT.result = __RETVAL;
                                                     __RESULT.checkResult(__RETVAL);  // entscheiden, ob erfolgreich oder nicht...
                                                     __RETVALS.push(__RETVAL);

                                                     __LOG[4]("Test '" + name + "'->'" + __NAME + "' returned:", __RESULT);
                                                 } catch (ex) {
                                                     // Fehler im Einzeltest...
                                                     __RESULT.checkException(ex);
                                                 }

                                                 __RESULTS.merge(__RESULT);  // aufaddieren...

                                                 // Einzelergebnis eintragen...
                                                 resultFun.call(__THIS, __RESULT, tableId, document);
                                             }
                                         } catch (ex) {
                                             // Fehler im Framework der Klasse...
                                             __RESULTS.checkException(ex);
                                             //throw ex;  // weiterleiten an runAll() ???
                                         } finally {
                                             __RESULTS.results = __RETVALS;  // detailierte Rueckgabewerte koennen ggfs. interessant sein...
                                         }

                                         return __RESULTS;
                                     }
                });

UnitTest.runAll = function(resultFun = UnitTest.defaultResultFun, tableId, resultObj, thisArg) {
    const __ALLRESULTS = (resultObj || (new UnitTestResults("TOTAL", "Ergebnisse aller Testklassen")));

    // Attribut 'test.tDefs' mit __ALLLIBS verknuepfen (befindet sich bei sum() unter 'tests')...
    __ALLRESULTS.test = {
                            'tDefs' : __ALLLIBS
                        };

    for (let testLib of Object.values(__ALLLIBS)) {
        try {
            const __NAME = testLib.name;
            const __DESC = testLib.desc;
            const __TEST = testLib.test;
            const __TFUN = __TEST['run'];  // TODO: __TEST.run, aber variabel gehalten!
            const __THIS = (thisArg || __TEST);
            const __RESULTS = new UnitTestResults(__NAME, __DESC, __TEST);

            __LOG[1]("Starting tests for module '" + __NAME + "': " + __DESC);

            try {
                __LIBRESULTS[__NAME] = __TFUN.call(__TEST, __NAME, __DESC, __THIS, __RESULTS, resultFun, tableId);
            } catch (ex) {
                // Fehler im Framework der Testklasse...
                __RESULTS.checkException(ex);
            } finally {
                __ALLRESULTS.merge(__RESULTS);  // aufaddieren...

                __LOG[1]("Finished tests for module '" + __NAME + "':", __RESULTS.sum());
                __LOG[5]("Total results after module '" + __NAME + "':", __ALLRESULTS.sum());

                // Ergebnis eintragen...
                resultFun.call(__THIS, null, tableId, document);  // Leerzeile
                resultFun.call(__THIS, __RESULTS, tableId, document);
                resultFun.call(__THIS, null, tableId, document);  // Leerzeile
            }
        } catch(ex) {
            // Fehler im Framework der UnitTests und Module...
            __ALLRESULTS.checkException(ex);
        }
    }

    __LOG[4]("Detailed results for all tests:", __LIBRESULTS);
    __LOG[1]("Results for all tests:", __ALLRESULTS.sum());

    // Endergebnis eintragen...
    resultFun.call(thisArg, null, tableId, document);  // Leerzeile
    resultFun.call(thisArg, __ALLRESULTS, tableId, document);

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
        appendCell(__ROW, "Beschreibung", __COLOR);
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
                'error'               : function() {
                                            return ++this.countError;
                                        },
                'exception'           : function() {
                                            return ++this.countException;
                                        },
                'checkResult'         : function(result) {
                                            if (result === undefined) {  // Hier geht es eher um Funktionen ohne return als um return undefined...
                                                return this.success();
                                            } else if (result instanceof Error) {
                                                return this.error();
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
                                                return this.error();
                                            } else if (ex instanceof AssertionFailed) {
                                                return this.failed();
                                            } else {
                                                return this.exception();
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
