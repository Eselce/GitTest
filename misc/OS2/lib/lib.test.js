/****** JavaScript-Bibliothek 'lib.test.js' ["TEST"] ******/

// Inhaltsverzeichnis:
// https://eselce.github.io/GitTest/misc/OS2/test/<TEST>: 
//  util.log.test.js
//  util.store.test.js

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

    const __ERROR = 'ERROR';

    const __TESTDATA = {
            'String'    : [ 'UnitTestS',    "Teststring",                                                       '"Teststring"' ],
            'Int'       : [ 'UnitTestI',    42,                                                                 '42' ],
            'Bool'      : [ 'UnitTestB',    false,                                                              'false' ],
            'Float'     : [ 'UnitTestI',    47.11,                                                              '47.11' ],
            'Array'     : [ 'UnitTestA',    [ 1, 2, 4, 8 ],                                                     '[1,2,4,8]' ],
            'Array2'    : [ 'UnitTestA',    [ '1', null, false, 815 ],                                          '["1",null,false,815]' ],
            'Array3'    : [ 'UnitTestA',    [ String(1), undefined, new Boolean(true) ],                        '["1",null,true]' ],
            'Object'    : [ 'UnitTestO',    { eins : 1, zwei : 2, fuenf : 5 },                                  '{"eins":1,"zwei":2,"fuenf":5}' ],
            'Object2'   : [ 'UnitTestO',    { 'c': { i : true, a : null }, a : { b : { c : [ 2, 47.11 ] } } },  '{"c":{"i":true,"a":null},"a":{"b":{"c":[2,47.11]}}}' ],
            'Object3'   : [ 'UnitTestO',    new AssertionFailed(new Boolean(true), "Fehler"),                   '{"message":"\'Fehler\' (true)"}' ],
            'Undef'     : [ 'UnitTestU',    undefined,                                                          undefined ],
            'Null'      : [ 'UnitTestN',    null,                                                               'null' ],
            'NaN'       : [ 'UnitTestNaN',  Number.NaN,                                                         String(Number.NaN) ],  // TODO: 'null'?
            'PosInf'    : [ 'UnitTestInf',  Number.POSITIVE_INFINITY,                                           String(Number.POSITIVE_INFINITY) ],
            'NegInf'    : [ 'UnitTestInf',  Number.NEGATIVE_INFINITY,                                           String(Number.NEGATIVE_INFINITY) ],
            'MinVal'    : [ 'UnitTestMin',  Number.MIN_VALUE,                                                   String(Number.MIN_VALUE) ],
            'MaxVal'    : [ 'UnitTestMax',  Number.MAX_VALUE,                                                   String(Number.MAX_VALUE) ],
            'MinInt'    : [ 'UnitTestMin',  Number.MIN_SAFE_INTEGER,                                            String(Number.MIN_SAFE_INTEGER) ],
            'MaxInt'    : [ 'UnitTestMax',  Number.MAX_SAFE_INTEGER,                                            String(Number.MAX_SAFE_INTEGER) ],
            'Epsilon'   : [ 'UnitTestInf',  Number.EPSILON,                                                     String(Number.EPSILON) ],
            'Function'  : [ 'UnitTestP',    function(x) { return x * x; },                                      undefined ],
            'Default'   : [ 'UnitTestD',    undefined,                                                          undefined,              __ERROR ],
            'Default2'  : [ 'UnitTestD',    null,                                                               'null',                 __ERROR ],
            'Default3'  : [ 'UnitTestD',    "",                                                                 '""',                   __ERROR ]
        };

    // Komponenten der Testreihen (sto/ser x ent/sum/des):
    // storeValue*   = STO/ent
    // summonValue*  = sto/SUM * DEF
    // serialize*    = SER/sum * DEF
    // serialize2*   = SER/ent
    // deserialize*  = sto/DES * DEF
    // deserialize2* = ser/DES * DEF
    const __UNITTESTSTORE1 = new UnitTest('util.store.js Daten', "Sicherung und das Laden von Daten", {
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

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Undefined falsch geladen");
                                            });
                                    },
            'summonValueNull'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Null'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name), value => {
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
            'summonValueFunction' : function() {  // NOTE Keine Speicherung von Function
                                        const [ __NAME, __VAL, , __ERR ] = __TESTDATA['Function'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Function falsch geladen");
                                            });
                                    },
            'summonValueDefault'  : function() {
                                        const [ __NAME, __VAL, , __ERR ] = __TESTDATA['Default'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'summonValueDefault2' : function() {  // NOTE Kein Default-Wert bei null
                                        const [ __NAME, __VAL, , __ERR ] = __TESTDATA['Default2'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Summon-Wert bei null ignoriert");
                                            });
                                    },
            'summonValueDefault3' : function() {  // NOTE Kein Default-Wert bei ""
                                        const [ __NAME, __VAL, , __ERR ] = __TESTDATA['Default3'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
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
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Undef'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Undefined falsch gespeichert");
                                            });
                                    },
            'serializeNull'       : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Null'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Null falsch gespeichert");
                                            });
                                    },
            'serializeNaN'        : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['NaN'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "NaN falsch gespeichert");
                                            });
                                    },
            'serializePosInf'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['PosInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "+Infinity falsch gespeichert");
                                            });
                                    },
            'serializeNegInf'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['NegInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "-Infinity falsch gespeichert");
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
            'serializeFunction'   : function() {  // NOTE Keine Speicherung von Function
                                        const [ __NAME, __VAL, __EXP, __ERR ] = __TESTDATA['Function'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Function falsch gespeichert");
                                            });
                                    },
            'serializeDefault'    : function() {
                                        const [ __NAME, __VAL, , __ERR ] = __TESTDATA['Default'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'serializeDefault2'   : function() {  // NOTE Kein Default-Wert bei null
                                        const [ __NAME, __VAL, __EXP, __ERR ] = __TESTDATA['Default2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Serialize-Wert bei null ignoriert");
                                            });
                                    },
            'serializeDefault3'   : function() {  // NOTE Kein Default-Wert bei ""
                                        const [ __NAME, __VAL, __EXP, __ERR ] = __TESTDATA['Default3'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
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
            'serialize2NaN'       : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['NaN'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "NaN falsch gespeichert");
                                            });
                                    },
            'serialize2PosInf'    : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['PosInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "+Infinity falsch gespeichert");
                                            });
                                    },
            'serialize2NegInf'    : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['NegInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "-Infinity falsch gespeichert");
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
            'serialize2Function'  : function() {  // NOTE Keine Speicherung von Function
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Function'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Function falsch gespeichert");
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
            'deserializeArray3'   : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Array3'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
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
            'deserializeObject3'  : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Object3'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'deserializeUndef'    : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Undef'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Undefined falsch geladen");
                                            });
                                    },
            'deserializeNull'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Null'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch geladen");
                                            });
                                    },
            'deserializeNaN'      : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['NaN'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "NaN falsch geladen");
                                            });
                                    },
            'deserializePosInf'   : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['PosInf'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "+Infinity falsch geladen");
                                            });
                                    },
            'deserializeNegInf'   : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['NegInf'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "-Infinity falsch geladen");
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
            'deserializeFunction' : function() {  // NOTE Keine Speicherung von Function
                                        const [ __NAME, __VAL, __EXP, __ERR ] = __TESTDATA['Function'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Function falsch geladen");
                                            });
                                    },
            'deserializeDefault'  : function() {
                                        const [ __NAME, __VAL, , __ERR ] = __TESTDATA['Default'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'deserializeDefault2' : function() {  // NOTE Kein Default-Wert bei null
                                        const [ __NAME, __VAL, __EXP, __ERR ] = __TESTDATA['Default2'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Serialize-Wert bei null ignoriert");
                                            });
                                    },
            'deserializeDefault3' : function() {  // NOTE Kein Default-Wert bei ""
                                        const [ __NAME, __VAL, __EXP, __ERR ] = __TESTDATA['Default3'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERR), value => {
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
            'deserialize2Array3'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Array3'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
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
            'deserialize2Object3' : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object3'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'deserialize2Undef'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Undef'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Undefined falsch geladen");
                                            });
                                    },
            'deserialize2Null'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Null'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch geladen");
                                            });
                                    },
            'deserialize2NaN'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['NaN'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "NaN falsch geladen");
                                            });
                                    },
            'deserialize2PosInf'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['PosInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "+Infinity falsch geladen");
                                            });
                                    },
            'deserialize2NegInf'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['NegInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "-Infinity falsch geladen");
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
            'deserialize2Function': function() {  // NOTE Keine Speicherung von Function
                                        const [ __NAME, __VAL, , __ERR ] = __TESTDATA['Function'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Function falsch geladen");
                                            });
                                    },
            'deserialize2Default' : function() {
                                        const [ __NAME, __VAL, , __ERR ] = __TESTDATA['Default'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'deserialize2Default2': function() {  // NOTE Kein Default-Wert bei null
                                        const [ __NAME, __VAL, , __ERR ] = __TESTDATA['Default2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Serialize-Wert bei null ignoriert");
                                            });
                                    },
            'deserialize2Default3': function() {  // NOTE Kein Default-Wert bei ""
                                        const [ __NAME, __VAL, , __ERR ] = __TESTDATA['Default3'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Serialize-Wert bei \"\" ignoriert");
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

