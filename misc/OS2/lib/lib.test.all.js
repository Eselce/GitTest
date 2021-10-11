

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
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
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
                  'run'            : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
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
                                                 const __RESULT = new UnitTestResults(__NAME, __DESC, __THIS);

                                                 __RESULT.running();  // Testzaehler erhoehen...
                                                 __LOG[3]("Running test '" + name + "'->'" + __NAME + "'" + (__DESC ? " (" + __DESC + ')' : "") + "...");

                                                 try {
                                                     const __RETVAL = await __TFUN.call(__THIS);

                                                     __RESULT.checkResult(__RETVAL);  // entscheiden, ob erfolgreich oder nicht...
                                                     __RETVALS.push(__RETVAL);

                                                     __LOG[4]("Test '" + name + "'->'" + __NAME + "' returned:", __RETVAL);
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

UnitTest.runAll = async function(resultFun = UnitTest.defaultResultFun, tableId, resultObj, thisArg) {
    const __LIBCOUNT = Object.keys(__ALLLIBS).length;
    const __ALLRESULTS = (resultObj || (new UnitTestResults("TOTAL", __LIBCOUNT + " Module")));

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
            const __RESULTS = new UnitTestResults("SUMME", __NAME, __TEST);

            __LOG[1]("Starting tests for module '" + __NAME + "': " + __DESC);

            try {
                __LIBRESULTS[__NAME] = await __TFUN.call(__TEST, __NAME, __DESC, __THIS, __RESULTS, resultFun, tableId);
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
                                                return this.success();
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

/*** Modul test.assert.js ***/

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
    return ASSERT(test === null, test + " !== null", msg, thisArg, ...params);
}

const ASSERT_NOT_NULL = function(test, msg, thisArg, ...params) {
    return ASSERT(test !== null, test + " === null", msg, thisArg, ...params);
}

const ASSERT_SET = function(test, msg, thisArg, ...params) {
    return ASSERT(test != undefined, test + " == undefined", msg, thisArg, ...params);
}

const ASSERT_NOT_SET = function(test, msg, thisArg, ...params) {
    return ASSERT(test == undefined, test + " != undefined", msg, thisArg, ...params);
}

const ASSERT_EQUAL = function(erg, exp, msg, thisArg, ...params) {
    return ASSERT(erg === exp, erg + " !== " + exp, msg, thisArg, ...params);
}

const ASSERT_NOT_EQUAL = function(erg, exp, msg, thisArg, ...params) {
    return ASSERT(erg !== exp, erg + " === " + exp, msg, thisArg, ...params);
}

const ASSERT_ALIKE = function(erg, exp, msg, thisArg, ...params) {
    return ASSERT(erg == exp, erg + " != " + exp, msg, thisArg, ...params);
}

const ASSERT_NOT_ALIKE = function(erg, exp, msg, thisArg, ...params) {
    return ASSERT(erg != exp, erg + " == " + exp, msg, thisArg, ...params);
}

const ASSERT_IN_DELTA = function(erg, exp, delta, msg, thisArg, ...params) {
    return ASSERT(Math.abs(erg - exp) <= delta, erg + " != " + exp + " +/- " + delta, msg, thisArg, ...params);
}

const ASSERT_NOT_IN_DELTA = function(erg, exp, delta, msg, thisArg, ...params) {
    return ASSERT(Math.abs(erg - exp) > delta, erg + " == " + exp + " +/- " + delta, msg, thisArg, ...params);
}

const ASSERT_INSTANCEOF = function(obj, cls, msg, thisArg, ...params) {
    return ASSERT((obj instanceof cls), obj + " ist kein " + cls, msg, thisArg, ...params);
}

const ASSERT_NOT_INSTANCEOF = function(obj, cls, msg, thisArg, ...params) {
    return ASSERT_NOT((obj instanceof cls), obj + " ist " + cls, msg, thisArg, ...params);
}

const ASSERT_MATCH = function(str, pattern, msg, thisArg, ...params) {
    return ASSERT((str || "").match(pattern), str + " match-t " + pattern, msg, thisArg, ...params);
}

const ASSERT_NOT_MATCH = function(str, pattern, msg, thisArg, ...params) {
    return ASSERT_NOT((str || "").match(pattern), str + " match-t nicht " + pattern, msg, thisArg, ...params);
}

// ==================== Ende Abschnitt fuer sonstige ASSERT-Funktionen ====================

// *** EOF ***

/*** Ende test.assert.js ***/

/*** Modul util.log.test.js ***/

// ==UserScript==
// _name         util.log.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Logging und safeStringify()
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/test/util.log.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Mock GM3-Funktionen ====================

if (typeof GM_getValue == 'undefined') {
    this.GM_getValue = function(name, defaultValue) {  // Mock GM_getValue function
            if (__MOCKSTORAGE.hasOwnProperty(name)) {
                return __MOCKSTORAGE[name];
            } else {
                return defaultValue;
            }
        };
}

if (typeof GM_setValue == 'undefined') {
    this.GM_setValue = function(name, value) {  // Mock GM_setValue function
            __MOCKSTORAGE[name] = value;
        };
}

if (typeof GM_deleteValue == 'undefined') {
    this.GM_deleteValue = function(name) {  // Mock GM_deleteValue function
            delete __MOCKSTORAGE[name];
        };
}

// Interner Speicher zur Simulation eines localStorage...
const __MOCKSTORAGE = { };

// Zuordnung im GM-Objekt...
Object.entries({
        'GM_deleteValue' : 'deleteValue',
        'GM_getValue'    : 'getValue',
        'GM_setValue'    : 'setValue'
    }).forEach(([oldKey, newKey]) => {
        let old = this[oldKey];
        if (old && (typeof GM[newKey] == 'undefined')) {
            GM[newKey] = function(...args) {
                    return new Promise((resolve, reject) => {
                            try {
                                resolve(old.apply(this, args));
                            } catch (e) {
                                reject(e);
                            }
                        });
                };
        }
    });

__LOG[1](GM);

// ==================== Ende Abschnitt fuer Mock GM3-Funktionen ====================

// ==================== Abschnitt fuer Beispiel-Tests ====================

const __BSPTESTS = new UnitTest('util.log.js', "Alles rund um das Logging", {
                               'log0'              : function() {
                                                         __LOG[3]("Testausgabe!");

                                                         return true;
                                                     },
                               'safeStringifyZahl' : function() {
                                                         const __RET = safeStringify(42);
                                                         const __EXP = '42';

                                                         return ASSERT_EQUAL(__RET, __EXP, "Nicht die Antwort auf alles!");
                                                     },
                               'safeStringifyFail' : function() {
                                                         const __RET = safeStringify(42);
                                                         const __EXP = 42;

                                                         return ASSERT_EQUAL(__RET, __EXP, "Absichtlich eingebauter Typfehler!");
                                                     },
                               'safeStringifyLike' : function() {
                                                         const __RET = safeStringify(42);
                                                         const __EXP = 42;

                                                         return ASSERT_ALIKE(__RET, __EXP, "Trotz der Gemeinsamkeiten nicht erkannt!");
                                                     }
                               });
const __BSPTESTSLEER = new UnitTest('empty.js', "Leere UnitTest-Klasse", { });
const __BSPTESTSUNDEFINED = new UnitTest('undefined.js', "Fehlende Tests");

// ==================== Ende Abschnitt fuer Beispiel-Tests ====================

// ==================== Abschnitt fuer Unit-Tests zu util.log ====================

// ==================== Abschnitt fuer Logging ====================

//const __LOG = {
//                  'logFun'    : [
//                  'init'      : function(win, logLevel = 1) {
//                  'stringify' : safeStringify,      // JSON.stringify
//                  'changed'   : function(oldVal, newVal) {

// ==================== Abschnitt fuer safeStringify() ====================

//function safeStringify(value, replacer = undefined, space = undefined, cycleReplacer = undefined) {
//function serializer(replacer = undefined, cycleReplacer = undefined) {
//function replaceArraySimple(key, value) {
//function replaceArray(key, value) {

// ==================== Ende Abschnitt fuer safeStringify() ====================

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
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/test/util.store.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.store ====================

// ==================== Abschnitt fuer die Sicherung und das Laden von Daten ====================

const __UNITTESTSTORE1 = new UnitTest('util.store.js 1', "Sicherung und das Laden von Daten", {
        'serializeString'     : function() {
                                    const __NAME = "UnitTestS";
                                    const __VAL = "Teststring";
                                    const __EXP = '"Teststring"';

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, "String falsch gespeichert");
                                        }, defaultCatch);
                                },
        'serializeInt'        : function() {
                                    const __NAME = "UnitTestI";
                                    const __VAL = 42;
                                    const __EXP = '42';

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, "Integer falsch gespeichert");
                                        }, defaultCatch);
                                },
        'serializeBool'       : function() {
                                    const __NAME = "UnitTestB";
                                    const __VAL = false;
                                    const __EXP = 'false';

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, "Boolean falsch gespeichert");
                                        }, defaultCatch);
                                },
        'serializeFloat'      : function() {
                                    const __NAME = "UnitTestI";
                                    const __VAL = 47.11;
                                    const __EXP = '47.11';

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, 0.000001, "Float falsch gespeichert");
                                        }, defaultCatch);
                                },
        'serializeArray'      : function() {
                                    const __NAME = "UnitTestA";
                                    const __VAL = [ 1, 2, 4, 8 ];
                                    const __EXP = '[1,2,4,8]';

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                        }, defaultCatch);
                                },
        'serializeObject'     : function() {
                                    const __NAME = "UnitTestO";
                                    const __VAL = { eins : 1, zwei : 2, fuenf : 5 };
                                    const __EXP = '{"eins":1,"zwei":2,"fuenf":5}';

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                        }, defaultCatch);
                                },
        'serializeUndefined'  : function() {
                                    const __NAME = "UnitTestU";
                                    const __VAL = undefined;
                                    const __EXP = undefined;

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, "Undefined falsch gespeichert");
                                        }, defaultCatch);
                                },
        'serializeNull'       : function() {
                                    const __NAME = "UnitTestN";
                                    const __VAL = null;
                                    const __EXP = 'null';

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, "Null falsch gespeichert");
                                        }, defaultCatch);
                                },
        'serializeNull'       : function() {
                                    const __NAME = "UnitTestNaN";
                                    const __VAL = NaN;
                                    const __EXP = 'null';  // TODO: richtig?

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, "NaN falsch gespeichert");
                                        }, defaultCatch);
                                }
    });

//function storeValue(name, value) {
//function summonValue(name, defValue = undefined) {
//function serialize(name, value) {
//function deserialize(name, defValue = undefined) {
//function refreshPage(reload = true) {

// ==================== Abschnitt fuer die Sicherung von Daten mit Callback ====================

//function setStored(name, value, reload = false, serial = false, onFulfilled = undefined, onRejected = undefined) {
//function setNextStored(arr, name, value, reload = false, serial = false, onFulfilled = undefined, onRejected = undefined) {

// ==================== Ende Abschnitt fuer die Sicherung und das Laden von Daten ====================

// *** EOF ***

/*** Ende util.store.test.js ***/

