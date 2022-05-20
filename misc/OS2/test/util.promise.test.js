// ==UserScript==
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
// ==/UserScript==

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
