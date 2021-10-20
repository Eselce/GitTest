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
