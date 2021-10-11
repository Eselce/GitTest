

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

                                        return storeValue(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "String falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'storeValueInt'       : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 42;
                                        const __EXP = '42';

                                        return storeValue(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Integer falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'storeValueBool'      : function() {
                                        const __NAME = "UnitTestB";
                                        const __VAL = false;
                                        const __EXP = 'false';

                                        return storeValue(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Boolean falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'storeValueFloat'     : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 47.11;
                                        const __EXP = '47.11';

                                        return storeValue(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_IN_DELTA(__RET, __VAL, __ASSERTDELTA, "Float falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'storeValueArray'     : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ 1, 2, 4, 8 ];
                                        const __EXP = '[1,2,4,8]';

                                        return storeValue(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'storeValueArray2'   : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ "1", null, false, 815 ];
                                        const __EXP = '["1",null,false,815]';

                                        return storeValue(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'storeValueArray3'   : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ String(1), undefined, Boolean(true), new AssertionFailed(815, "Fehler") ];
                                        const __EXP = '["1",null,true,{"text":"Fehler (815)"}]';

                                        return storeValue(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'storeValueObject'    : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { eins : 1, zwei : 2, fuenf : 5 };
                                        const __EXP = '{"eins":1,"zwei":2,"fuenf":5}';

                                        return storeValue(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'storeValueObject2'   : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'const': { innen : true, aussen : null }, a : { b : { c : [ 2, 47.11, true ] } } };
                                        const __EXP = '{"const":{"innen":true,"aussen":null},"a":{"b":{"c":[2,47.11,true]}}}';

                                        return storeValue(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'storeValueObject3'   : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'fun' : function(x) { return x * x; }, 'bool' : new Boolean(true) };
                                        const __EXP = '{"bool":true}';

                                        return storeValue(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'storeValueUndef'     : function() {
                                        const __NAME = "UnitTestU";
                                        const __VAL = undefined;
                                        const __EXP = undefined;

                                        return storeValue(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Undefined falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'storeValueNull'      : function() {
                                        const __NAME = "UnitTestN";
                                        const __VAL = null;
                                        const __EXP = 'null';

                                        return storeValue(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'storeValueNaN'       : function() {
                                        const __NAME = "UnitTestNaN";
                                        const __VAL = NaN;
                                        const __EXP = 'null';  // TODO: richtig?

                                        return storeValue(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "NaN falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'storeValueFunction'  : function() {
                                        const __NAME = "UnitTestP";
                                        const __VAL = function(x) { return x * x; };
                                        const __EXP = undefined;

                                        return storeValue(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Function falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'summonValueString'   : function() {
                                        const __NAME = "UnitTestS";
                                        const __VAL = "Teststring";
                                        const __EXP = '"Teststring"';

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "String falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'summonValueInt'      : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 42;
                                        const __EXP = '42';

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Integer falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'summonValueBool'     : function() {
                                        const __NAME = "UnitTestB";
                                        const __VAL = false;
                                        const __EXP = 'false';

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Boolean falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'summonValueFloat'    : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 47.11;
                                        const __EXP = '47.11';

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_IN_DELTA(__RET, __VAL, __ASSERTDELTA, "Float falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'summonValueArray'    : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ 1, 2, 4, 8 ];
                                        const __EXP = '[1,2,4,8]';

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'summonValueArray2'   : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ "1", null, false, 815 ];
                                        const __EXP = '["1",null,false,815]';

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'summonValueArray3'   : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ String(1), undefined, Boolean(true), new AssertionFailed(815, "Fehler") ];
                                        const __EXP = '["1",null,true,{"text":"Fehler (815)"}]';

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'summonValueObject'   : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { eins : 1, zwei : 2, fuenf : 5 };
                                        const __EXP = '{"eins":1,"zwei":2,"fuenf":5}';

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'summonValueObject2'  : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'const': { innen : true, aussen : null }, a : { b : { c : [ 2, 47.11, true ] } } };
                                        const __EXP = '{"const":{"innen":true,"aussen":null},"a":{"b":{"c":[2,47.11,true]}}}';

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'summonValueObject3'  : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'fun' : function(x) { return x * x; }, 'bool' : new Boolean(true) };
                                        const __EXP = '{"bool":true}';

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'summonValueUndef'    : function() {
                                        const __NAME = "UnitTestU";
                                        const __VAL = undefined;
                                        const __EXP = undefined;

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name).then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Undefined falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'summonValueNull'     : function() {
                                        const __NAME = "UnitTestN";
                                        const __VAL = null;
                                        const __EXP = 'null';

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name).then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'summonValueNaN'      : function() {
                                        const __NAME = "UnitTestNaN";
                                        const __VAL = NaN;
                                        const __EXP = 'null';  // TODO: richtig?

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "NaN falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'summonValueFunction' : function() {
                                        const __NAME = "UnitTestP";
                                        const __VAL = function(x) { return x * x; };
                                        const __EXP = undefined;

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Function falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'summonValueDefault'  : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = 'ERROR';
                                        const __EXP = undefined;

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Defaultwert bei undefined ignoriert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'summonValueDefault2' : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = 'ERROR';
                                        const __EXP = null;

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Defaultwert bei null ignoriert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'summonValueDefault3' : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = 'ERROR';
                                        const __EXP = "";

                                        return storeValue(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Defaultwert bei \"\" ignoriert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeString'     : function() {
                                        const __NAME = "UnitTestS";
                                        const __VAL = "Teststring";
                                        const __EXP = '"Teststring"';

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "String falsch gespeichert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeInt'        : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 42;
                                        const __EXP = '42';

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Integer falsch gespeichert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeBool'       : function() {
                                        const __NAME = "UnitTestB";
                                        const __VAL = false;
                                        const __EXP = 'false';

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Boolean falsch gespeichert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeFloat'      : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 47.11;
                                        const __EXP = '47.11';

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Float falsch gespeichert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeArray'      : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ 1, 2, 4, 8 ];
                                        const __EXP = '[1,2,4,8]';

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeArray2'     : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ "1", null, false, 815 ];
                                        const __EXP = '["1",null,false,815]';

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeArray3'     : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ String(1), undefined, Boolean(true), new AssertionFailed(815, "Fehler") ];
                                        const __EXP = '["1",null,true,{"text":"Fehler (815)"}]';

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeObject'     : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { eins : 1, zwei : 2, fuenf : 5 };
                                        const __EXP = '{"eins":1,"zwei":2,"fuenf":5}';

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeObject2'    : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'const': { innen : true, aussen : null }, a : { b : { c : [ 2, 47.11, true ] } } };
                                        const __EXP = '{"const":{"innen":true,"aussen":null},"a":{"b":{"c":[2,47.11,true]}}}';

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeObject3'    : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'fun' : function(x) { return x * x; }, 'bool' : new Boolean(true) };
                                        const __EXP = '{"bool":true}';

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeUndef'      : function() {
                                        const __NAME = "UnitTestU";
                                        const __VAL = undefined;
                                        const __EXP = undefined;

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name).then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Undefined falsch gespeichert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeNull'       : function() {
                                        const __NAME = "UnitTestN";
                                        const __VAL = null;
                                        const __EXP = 'null';

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name).then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Null falsch gespeichert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeNaN'        : function() {
                                        const __NAME = "UnitTestNaN";
                                        const __VAL = NaN;
                                        const __EXP = 'null';  // TODO: richtig?

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "NaN falsch gespeichert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeFunction'   : function() {
                                        const __NAME = "UnitTestP";
                                        const __VAL = function(x) { return x * x; };
                                        const __EXP = undefined;

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Function falsch gespeichert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeDefault'    : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = undefined;
                                        const __EXP = 'ERROR';

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Defaultwert bei undefined ignoriert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeDefault2'   : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = null;
                                        const __EXP = 'ERROR';

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Defaultwert bei null ignoriert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serializeDefault3'   : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = "";
                                        const __EXP = 'ERROR';

                                        return serialize(__NAME, __VAL).then(entry => summonValue(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Defaultwert bei \"\" ignoriert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'serialize2String'    : function() {
                                        const __NAME = "UnitTestS";
                                        const __VAL = "Teststring";
                                        const __EXP = '"Teststring"';

                                        return serialize(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "String falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'serialize2Int'       : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 42;
                                        const __EXP = '42';

                                        return serialize(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Integer falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'serialize2Bool'      : function() {
                                        const __NAME = "UnitTestB";
                                        const __VAL = false;
                                        const __EXP = 'false';

                                        return serialize(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Boolean falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'serialize2Float'     : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 47.11;
                                        const __EXP = '47.11';

                                        return serialize(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Float falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'serialize2Array'     : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ 1, 2, 4, 8 ];
                                        const __EXP = '[1,2,4,8]';

                                        return serialize(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'serialize2Array2'    : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ "1", null, false, 815 ];
                                        const __EXP = '["1",null,false,815]';

                                        return serialize(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'serialize2Array3'    : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ String(1), undefined, Boolean(true), new AssertionFailed(815, "Fehler") ];
                                        const __EXP = '["1",null,true,{"text":"Fehler (815)"}]';

                                        return serialize(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'serialize2Object'    : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { eins : 1, zwei : 2, fuenf : 5 };
                                        const __EXP = '{"eins":1,"zwei":2,"fuenf":5}';

                                        return serialize(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'serialize2Object2'   : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'const': { innen : true, aussen : null }, a : { b : { c : [ 2, 47.11, true ] } } };
                                        const __EXP = '{"const":{"innen":true,"aussen":null},"a":{"b":{"c":[2,47.11,true]}}}';

                                        return serialize(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'serialize2Object3'   : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'fun' : function(x) { return x * x; }, 'bool' : new Boolean(true) };
                                        const __EXP = '{"bool":true}';

                                        return serialize(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'serialize2Undef'     : function() {
                                        const __NAME = "UnitTestU";
                                        const __VAL = undefined;
                                        const __EXP = undefined;

                                        return serialize(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Undefined falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'serialize2Null'      : function() {
                                        const __NAME = "UnitTestN";
                                        const __VAL = null;
                                        const __EXP = 'null';

                                        return serialize(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Null falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'serialize2NaN'       : function() {
                                        const __NAME = "UnitTestNaN";
                                        const __VAL = NaN;
                                        const __EXP = 'null';  // TODO: richtig?

                                        return serialize(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "NaN falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'serialize2Function'  : function() {
                                        const __NAME = "UnitTestP";
                                        const __VAL = function(x) { return x * x; };
                                        const __EXP = undefined;

                                        return serialize(__NAME, __VAL).then(entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Function falsch gespeichert");
                                            }, defaultCatch);
                                    },
            'deserializeString'   : function() {
                                        const __NAME = "UnitTestS";
                                        const __VAL = "Teststring";
                                        const __EXP = '"Teststring"';

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "String falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserializeInt'      : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 42;
                                        const __EXP = '42';

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Integer falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserializeBool'     : function() {
                                        const __NAME = "UnitTestB";
                                        const __VAL = false;
                                        const __EXP = 'false';

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Boolean falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserializeFloat'    : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 47.11;
                                        const __EXP = '47.11';

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_IN_DELTA(__RET, __VAL, __ASSERTDELTA, "Float falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserializeArray'    : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ 1, 2, 4, 8 ];
                                        const __EXP = '[1,2,4,8]';

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserializeArray2'   : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ "1", null, false, 815 ];
                                        const __EXP = '["1",null,false,815]';

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserializeArray3'   : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ String(1), undefined, Boolean(true), new AssertionFailed(815, "Fehler") ];
                                        const __EXP = '["1",null,true,{"text":"Fehler (815)"}]';

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserializeObject'   : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { eins : 1, zwei : 2, fuenf : 5 };
                                        const __EXP = '{"eins":1,"zwei":2,"fuenf":5}';

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserializeObject2'  : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'const': { innen : true, aussen : null }, a : { b : { c : [ 2, 47.11, true ] } } };
                                        const __EXP = '{"const":{"innen":true,"aussen":null},"a":{"b":{"c":[2,47.11,true]}}}';

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserializeObject3'  : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'fun' : function(x) { return x * x; }, 'bool' : new Boolean(true) };
                                        const __EXP = '{"bool":true}';

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserializeUndef'    : function() {
                                        const __NAME = "UnitTestU";
                                        const __VAL = undefined;
                                        const __EXP = undefined;

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name).then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Undefined falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserializeNull'     : function() {
                                        const __NAME = "UnitTestN";
                                        const __VAL = null;
                                        const __EXP = 'null';

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name).then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserializeNaN'      : function() {
                                        const __NAME = "UnitTestNaN";
                                        const __VAL = NaN;
                                        const __EXP = 'null';  // TODO: richtig?

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "NaN falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserializeFunction' : function() {
                                        const __NAME = "UnitTestP";
                                        const __VAL = function(x) { return x * x; };
                                        const __EXP = undefined;

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Function falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserializeDefault'  : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = 'ERROR';
                                        const __EXP = undefined;

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Defaultwert bei undefined ignoriert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserializeDefault2' : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = 'ERROR';
                                        const __EXP = null;

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Defaultwert bei null ignoriert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserializeDefault3' : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = 'ERROR';
                                        const __EXP = "";

                                        return storeValue(__NAME, __EXP).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Defaultwert bei \"\" ignoriert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2String'  : function() {
                                        const __NAME = "UnitTestS";
                                        const __VAL = "Teststring";
                                        const __EXP = '"Teststring"';

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "String falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2Int'     : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 42;
                                        const __EXP = '42';

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Integer falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2Bool'    : function() {
                                        const __NAME = "UnitTestB";
                                        const __VAL = false;
                                        const __EXP = 'false';

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Boolean falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2Float'   : function() {
                                        const __NAME = "UnitTestI";
                                        const __VAL = 47.11;
                                        const __EXP = '47.11';

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_IN_DELTA(__RET, __VAL, __ASSERTDELTA, "Float falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2Array'   : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ 1, 2, 4, 8 ];
                                        const __EXP = '[1,2,4,8]';

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2Array2'  : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ "1", null, false, 815 ];
                                        const __EXP = '["1",null,false,815]';

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2Array3'  : function() {
                                        const __NAME = "UnitTestA";
                                        const __VAL = [ String(1), undefined, Boolean(true), new AssertionFailed(815, "Fehler") ];
                                        const __EXP = '["1",null,true,{"text":"Fehler (815)"}]';

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2Object'  : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { eins : 1, zwei : 2, fuenf : 5 };
                                        const __EXP = '{"eins":1,"zwei":2,"fuenf":5}';

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2Object2' : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'const': { innen : true, aussen : null }, a : { b : { c : [ 2, 47.11, true ] } } };
                                        const __EXP = '{"const":{"innen":true,"aussen":null},"a":{"b":{"c":[2,47.11,true]}}}';

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2Object3' : function() {
                                        const __NAME = "UnitTestO";
                                        const __VAL = { 'fun' : function(x) { return x * x; }, 'bool' : new Boolean(true) };
                                        const __EXP = '{"bool":true}';

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2Undef'   : function() {
                                        const __NAME = "UnitTestU";
                                        const __VAL = undefined;
                                        const __EXP = undefined;

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name).then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Undefined falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2Null'    : function() {
                                        const __NAME = "UnitTestN";
                                        const __VAL = null;
                                        const __EXP = 'null';

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name).then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2NaN'     : function() {
                                        const __NAME = "UnitTestNaN";
                                        const __VAL = NaN;
                                        const __EXP = 'null';  // TODO: richtig?

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "NaN falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2Function': function() {
                                        const __NAME = "UnitTestP";
                                        const __VAL = function(x) { return x * x; };
                                        const __EXP = undefined;

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Function falsch geladen");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2Default' : function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = undefined;
                                        const __EXP = 'ERROR';

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Defaultwert bei undefined ignoriert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2Default2': function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = null;
                                        const __EXP = 'ERROR';

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Defaultwert bei null ignoriert");
                                            }, defaultCatch), defaultCatch);
                                    },
            'deserialize2Default3': function() {
                                        const __NAME = "UnitTestD";
                                        const __VAL = "";
                                        const __EXP = 'ERROR';

                                        return serialize(__NAME, __VAL).then(entry => deserialize(entry.name, 'ERROR').then(value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Defaultwert bei \"\" ignoriert");
                                            }, defaultCatch), defaultCatch);
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

