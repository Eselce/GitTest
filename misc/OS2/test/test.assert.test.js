// ==UserScript==
// _name         test.assert.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Script-Optionen im Benutzermenue
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/test.assert.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu test.assert ====================

(() => {

// ==================== Abschnitt fuer Test-Werkzeuge ====================

    const __RESOLVED = (() => Promise.resolve(true));
    const __REJECTED = (() => Promise.reject(false));
    const __ERRORMSG = "Erroneous";
    const __ERRONEOUS = function() { Error(__ERRORMSG); };
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
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_SET failed (undefined == undefined)', "Fehler bei der Fehlermeldung");

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
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (undefined == undefined)', "Fehler beim Zusammensetzen der Fehlermeldung");

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
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (undefined == undefined)', "Fehler beim Zusammensetzen der Fehlermeldung");

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
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_NOT_SET failed (String[3] "set" != undefined)', "Fehler bei der Fehlermeldung");

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
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (String[3] "set" != undefined)', "Fehler beim Zusammensetzen der Fehlermeldung");

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
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (String[3] "set" != undefined)', "Fehler beim Zusammensetzen der Fehlermeldung");

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
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_SET failed (object null == undefined)', "Fehler bei der Fehlermeldung");

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
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (object null == undefined)', "Fehler beim Zusammensetzen der Fehlermeldung");

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
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (object null == undefined)', "Fehler beim Zusammensetzen der Fehlermeldung");

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
                                                        ASSERT_EQUAL(ex.message, 'ASSERT_NOT_SET failed (String[3] "set" != undefined)', "Fehler bei der Fehlermeldung");

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
                                                        ASSERT_EQUAL(ex.message, '42 ist die Wahrheit (String[3] "set" != undefined)', "Fehler beim Zusammensetzen der Fehlermeldung");

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
                                                        ASSERT_EQUAL(ex.message, 'ASSERT-Funktionen ist die Wahrheit (String[3] "set" != undefined)', "Fehler beim Zusammensetzen der Fehlermeldung");

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
