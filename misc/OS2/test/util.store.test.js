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
                                    const __EXP = "Teststring";

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
                                    const __EXP = "42";

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
                                    const __EXP = "false";

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
                                    const __EXP = "47.11";

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
                                    const __EXP = "[1,2,4,8]";

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
                                    const __EXP = "['eins':1,'zwei':2,'fuenf'5]";

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
                                    const __EXP = "undefined";

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
                                    const __EXP = "null";

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
                                    const __EXP = "NaN";

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
