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

// ==================== Abschnitt fuer Startroutinen und Datenspeicherungs-Filter ====================

    // Hilfsfunktionen und Hilfsdaten; Startroutinen und Datenspeicherungs-Filter
    new UnitTest('util.store.js Basis', "Startroutinen und Datenspeicherungs-Filter", {
            '__GMWRITE'           : function() {
                                        return ASSERT_TRUE(__GMWRITE, "Schreiben von Daten nicht aktiviert");
                                    },
            '__SCRIPTINIT'        : async function() {
                                        return callPromiseChain(startMain(), value => {
                                                const __RET = value;

                                                ASSERT_ZERO(__RET, "startMain() lieferte falschen R\xFCckgabewert");

                                                return ASSERT_ZERO(__SCRIPTINIT.length, "__SCRIPTINIT ist nicht leer! Eventuell startMain() nicht ausgef\xFChrt?");
                                            }).catch(startMain);
                                    },
            'registerStartFun'    : async function() {
                                        return callPromiseChain(registerStartFun(() => undefined), value => {
                                                const __RET = value;

                                                ASSERT_ONE(__RET, "registerStartFun() lieferte falschen R\xFCckgabewert");

                                                return ASSERT_ONE(__SCRIPTINIT.length, "__SCRIPTINIT muss genau einen Eintrag haben");
                                            }, startMain, value => {
                                                const __RET = value;

                                                ASSERT_ZERO(__RET, "startMain() lieferte falschen R\xFCckgabewert");

                                                return ASSERT_ZERO(__SCRIPTINIT.length, "__SCRIPTINIT ist nicht leer!");
                                            }).catch(startMain);
                                    },
            'startMain'           : function() {
                                        return callPromiseChain(registerStartFun(value => {
                                                const __RET = value;

                                                ASSERT_TRUE(__RET, "startMain() muss mit true starten");

                                                // TODO ASSERT_ONE(__SCRIPTINIT.length, "__SCRIPTINIT muss genau einen Eintrag haben");

                                                return 42;
                                            }), startMain, value => {
                                                const __RET = value;

                                                ASSERT_EQUAL(__RET, 42, "startMain() lieferte falschen R\xFCckgabewert");

                                                return ASSERT_ZERO(__SCRIPTINIT.length, "__SCRIPTINIT ist nicht leer!");
                                            });
                                    }
        });

// ==================== Ende Abschnitt fuer Startroutinen und Datenspeicherungs-Filter ====================

// ==================== Abschnitt fuer die Sicherung und das Laden von Daten ====================

    const __ERROR = 'ERROR';
    const __ERR = __ERROR;

    const __TESTDATA = {
            'String'    : [ 'UnitTestS',    "Teststring",                                                       '"Teststring"' ],
            'Int'       : [ 'UnitTestI',    42,                                                                 '42' ],
            'Bool'      : [ 'UnitTestB',    false,                                                              'false' ],
            'Float'     : [ 'UnitTestI',    47.11,                                                              '47.11' ],
            'Array'     : [ 'UnitTestA',    [ 1, 2, 4, 8 ],                                                     '[1,2,4,8]' ],
            'Array2'    : [ 'UnitTestA',    [ '1', null, false, 815 ],                                          '["1",null,false,815]' ],
            'Array3'    : [ 'UnitTestA',    [ String(1), undefined, new Boolean(true) ],                        '["1",null,true]',                  [ "1", null, true ],                 '["1",null,true]' ],
            'Object'    : [ 'UnitTestO',    { eins : 1, zwei : 2, fuenf : 5 },                                  '{"eins":1,"zwei":2,"fuenf":5}' ],
            'Object2'   : [ 'UnitTestO',    { 'c': { i : true, a : null }, a : { b : { c : [ 2, 47.11 ] } } },  '{"c":{"i":true,"a":null},"a":{"b":{"c":[2,47.11]}}}' ],
            'Object3'   : [ 'UnitTestO',    new AssertionFailed(new Boolean(true), "Fehler"),                   '{"message":"Fehler (true)"}',      { 'message' : "Fehler (true)" },    '{"message":"Fehler (true)"}' ],
            'Undef'     : [ 'UnitTestUnd',  undefined,                                                          undefined,                          undefined,                          undefined ],
            'Null'      : [ 'UnitTestNul',  null,                                                               'null' ],
            'NaN'       : [ 'UnitTestNaN',  Number.NaN,                                                         String(Number.NaN),                 null,                               "null" ],
            'PosInf'    : [ 'UnitTestInf',  Number.POSITIVE_INFINITY,                                           String(Number.POSITIVE_INFINITY),   null,                               "null" ],
            'NegInf'    : [ 'UnitTestInf',  Number.NEGATIVE_INFINITY,                                           String(Number.NEGATIVE_INFINITY),   null,                               "null" ],
            'MinVal'    : [ 'UnitTestMin',  Number.MIN_VALUE,                                                   String(Number.MIN_VALUE) ],
            'MaxVal'    : [ 'UnitTestMax',  Number.MAX_VALUE,                                                   String(Number.MAX_VALUE) ],
            'MinInt'    : [ 'UnitTestMin',  Number.MIN_SAFE_INTEGER,                                            String(Number.MIN_SAFE_INTEGER) ],
            'MaxInt'    : [ 'UnitTestMax',  Number.MAX_SAFE_INTEGER,                                            String(Number.MAX_SAFE_INTEGER) ],
            'Epsilon'   : [ 'UnitTestInf',  Number.EPSILON,                                                     String(Number.EPSILON) ],
            'Uint32Arr' : [ 'UnitTestU',    new Uint32Array([42]),                                              '{"0":42}' ],
            'Date'      : [ 'UnitTestD',    new Date(Date.UTC(2006, 0, 2, 15, 4, 5)),                           '"2006-01-02T15:04:05.000Z"',       '2006-01-02T15:04:05.000Z',         '"2006-01-02T15:04:05.000Z"' ],
            'Symbol'    : [ 'UnitTestY',    Symbol(),                                                           undefined,                          undefined,                          undefined ],
            'Symbol2'   : [ 'UnitTestY',    Symbol.for('key'),                                                  undefined,                          undefined,                          undefined ],
            'Function'  : [ 'UnitTestP',    function(x) { return x * x; },                                      'function (x) { return x * x; }',   undefined,                          undefined ],
            'Default'   : [ 'UnitTestDef',  undefined,                                                          undefined,                          undefined,                          undefined ],
            'Default2'  : [ 'UnitTestDef',  null,                                                               'null' ],
            'Default3'  : [ 'UnitTestDef',  "",                                                                 '""' ]
        };

    // Primitive Speichermethoden __GETVALUE() und __SETVALUE():
    // getSetValue*  = SET/sum (sum = GET mit Filter)
    new UnitTest('util.store.js GET/SET', "__GETVALUE() und __SETVALUE()", {
            'getSetValueString'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['String'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "String falsch geladen");
                                            });
                                    },
            'getSetValueInt'      : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Int'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Integer falsch geladen");
                                            });
                                    },
            'getSetValueBool'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Bool'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Boolean falsch geladen");
                                            });
                                    },
            'getSetValueFloat'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Float'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_IN_DELTA(__RET, __VAL, __ASSERTDELTA, "Float falsch geladen");
                                            });
                                    },
            'getSetValueArray'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Array'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'getSetValueArray2'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Array2'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'getSetValueArray3'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Array3'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Array falsch geladen");
                                            });
                                    },
            'getSetValueObject'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'getSetValueObject2'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object2'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'getSetValueObject3'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object3'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'getSetValueUndef'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Undef'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Undefined falsch geladen");
                                            });
                                    },
            'getSetValueNull'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Null'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch geladen");
                                            });
                                    },
            'getSetValueNaN'      : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['NaN'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "NaN falsch geladen");
                                            });
                                    },
            'getSetValuePosInf'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['PosInf'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "+Infinity falsch geladen");
                                            });
                                    },
            'getSetValueNegInf'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['NegInf'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "-Infinity falsch geladen");
                                            });
                                    },
            'getSetValueMinVal'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MinVal'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MinVal falsch geladen");
                                            });
                                    },
            'getSetValueMaxVal'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MaxVal'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MaxVal falsch geladen");
                                            });
                                    },
            'getSetValueMinInt'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MinInt'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MinInt falsch geladen");
                                            });
                                    },
            'getSetValueMaxInt'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['MaxInt'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "MaxInt falsch geladen");
                                            });
                                    },
            'getSetValueEpsilon'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Epsilon'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Epsilon falsch geladen");
                                            });
                                    },
            'getSetValueUint32Arr': function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Uint32Arr'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Uint32Array falsch geladen");
                                            });
                                    },
            'getSetValueDate'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Date'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Date falsch geladen");
                                            });
                                    },
            'getSetValueSymbol'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Symbol falsch geladen");
                                            });
                                    },
            'getSetValueSymbol2'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol2'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Symbol falsch geladen");
                                            });
                                    },
            'getSetValueFunction' : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Function'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Function falsch geladen");
                                            });
                                    },
            'getSetValueDefault'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Default'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'getSetValueDefault2' : function() {  // NOTE Kein Default-Wert bei null
                                        const [ __NAME, __VAL ] = __TESTDATA['Default2'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Summon-Wert bei null ignoriert");
                                            });
                                    },
            'getSetValueDefault3' : function() {  // NOTE Kein Default-Wert bei ""
                                        const [ __NAME, __VAL ] = __TESTDATA['Default3'];

                                        return callPromiseChain(__SETVALUE(__NAME, __VAL), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Summon-Wert bei \"\" ignoriert");
                                            });
                                    },
        });

    // Komponenten der Testreihen (sto/ser x ent/sum/des):
    // storeValue*   = STO/ent
    // summonValue*  = sto/SUM * DEF
    // serialize*    = SER/sum * DEF
    // serialize2*   = SER/ent
    // deserialize*  = sto/DES * DEF
    // deserialize2* = ser/DES * DEF
    new UnitTest('util.store.js Daten', "Sicherung und das Laden von Daten", {
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
            'storeValueUint32Arr' : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Uint32Arr'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Uint32Array falsch gespeichert");
                                            });
                                    },
            'storeValueDate'      : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Date'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Date falsch gespeichert");
                                            });
                                    },
            'storeValueSymbol'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Symbol falsch gespeichert");
                                            });
                                    },
            'storeValueSymbol2'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol2'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __VAL, "Symbol falsch gespeichert");
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

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Undefined falsch geladen");
                                            });
                                    },
            'summonValueNull'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Null'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
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
            'summonValueUint32Arr': function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Uint32Arr'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Uint32Array falsch geladen");
                                            });
                                    },
            'summonValueDate'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Date'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Date falsch geladen");
                                            });
                                    },
            'summonValueSymbol'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Symbol falsch geladen");
                                            });
                                    },
            'summonValueSymbol2'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol2'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Symbol falsch geladen");
                                            });
                                    },
            'summonValueFunction' : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Function'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Function falsch geladen");
                                            });
                                    },
            'summonValueDefault'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Default'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'summonValueDefault2' : function() {  // NOTE Kein Default-Wert bei null
                                        const [ __NAME, __VAL ] = __TESTDATA['Default2'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Summon-Wert bei null ignoriert");
                                            });
                                    },
            'summonValueDefault3' : function() {  // NOTE Kein Default-Wert bei ""
                                        const [ __NAME, __VAL ] = __TESTDATA['Default3'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
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
                                        const [ __NAME, __VAL ] = __TESTDATA['Undef'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Undefined falsch gespeichert");
                                            });
                                    },
            'serializeNull'       : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Null'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Null falsch gespeichert");
                                            });
                                    },
            'serializeNaN'        : function() {  // NOTE NaN wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , , __ALTEXP ] = __TESTDATA['NaN'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALTEXP, "NaN falsch gespeichert");
                                            });
                                    },
            'serializePosInf'     : function() {  // NOTE Infinity wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , , __ALTEXP ] = __TESTDATA['PosInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALTEXP, "+Infinity falsch gespeichert");
                                            });
                                    },
            'serializeNegInf'     : function() {  // NOTE -Infinity wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , , __ALTEXP ] = __TESTDATA['NegInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALTEXP, "-Infinity falsch gespeichert");
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
            'serializeUint32Arr'  : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Uint32Arr'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Uint32Array falsch gespeichert");
                                            });
                                    },
            'serializeDate'       : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Date'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Date falsch gespeichert");
                                            });
                                    },
            'serializeSymbol'     : function() {  // NOTE Keine Speicherung von Symbol
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Symbol falsch gespeichert");
                                            });
                                    },
            'serializeSymbol2'    : function() {  // NOTE Keine Speicherung von Symbol
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Symbol falsch gespeichert");
                                            });
                                    },
            'serializeFunction'   : function() {  // NOTE Keine Speicherung von Function durch JSON
                                        const [ __NAME, __VAL ] = __TESTDATA['Function'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Function falsch gespeichert");
                                            });
                                    },
            'serializeDefault'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Default'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'serializeDefault2'   : function() {  // NOTE Kein Default-Wert bei null
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Default2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "Serialize-Wert bei null ignoriert");
                                            });
                                    },
            'serializeDefault3'   : function() {  // NOTE Kein Default-Wert bei ""
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Default3'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => summonValue(entry.name, __ERROR), value => {
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
            'serialize2NaN'       : function() {  // NOTE NaN wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , , __ALTEXP ] = __TESTDATA['NaN'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __ALTEXP, "NaN falsch gespeichert");
                                            });
                                    },
            'serialize2PosInf'    : function() {  // NOTE Infinity wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , ,  __ALTEXP ] = __TESTDATA['PosInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __ALTEXP, "+Infinity falsch gespeichert");
                                            });
                                    },
            'serialize2NegInf'    : function() {  // NOTE -Infinity wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , , __ALTEXP ] = __TESTDATA['NegInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __ALTEXP, "-Infinity falsch gespeichert");
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
            'serialize2Uint32Arr' : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Uint32Arr'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Uint32Array falsch gespeichert");
                                            });
                                    },
            'serialize2Date'      : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Date'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Date falsch gespeichert");
                                            });
                                    },
            'serialize2Symbol'    : function() {  // NOTE Keine Speicherung von Symbol
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Symbol'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Symbol falsch gespeichert");
                                            });
                                    },
            'serialize2Symbol2'   : function() {  // NOTE Keine Speicherung von Symbol
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Symbol2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __EXP, "Symbol falsch gespeichert");
                                            });
                                    },
            'serialize2Function'  : function() {  // NOTE Keine Speicherung von Function durch JSON
                                        const [ __NAME, __VAL, , , __ALTEXP ] = __TESTDATA['Function'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => {
                                                const __NAM = entry.name;
                                                const __RET = entry.value;

                                                ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                                return ASSERT_EQUAL(__RET, __ALTEXP, "Function falsch gespeichert");
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
            'deserializeArray3'   : function() {  // NOTE Boolean wird von JSON untypisiert gespeichet
                                        const [ __NAME, , __EXP, __ALT ] = __TESTDATA['Array3'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "Array falsch geladen");
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
            'deserializeObject3'  : function() {  // NOTE AssertionFailed wird von JSON untypisiert gespeichet
                                        const [ __NAME, , __EXP, __ALT ] = __TESTDATA['Object3'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "Object falsch geladen");
                                            });
                                    },
            'deserializeUndef'    : function() {
                                        const [ __NAME, , __EXP ] = __TESTDATA['Undef'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Undefined falsch geladen");
                                            });
                                    },
            'deserializeNull'     : function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Null'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch geladen");
                                            });
                                    },
            'deserializeNaN'      : function() {  // NOTE NaN wird von JSON als null gespeichet
                                        const [ __NAME, , , __ALT, __ALTEXP ] = __TESTDATA['NaN'];

                                        return callPromiseChain(storeValue(__NAME, __ALTEXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "NaN falsch geladen");
                                            });
                                    },
            'deserializePosInf'   : function() {  // NOTE Infinity wird von JSON als null gespeichet
                                        const [ __NAME, , , __ALT, __ALTEXP ] = __TESTDATA['PosInf'];

                                        return callPromiseChain(storeValue(__NAME, __ALTEXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "+Infinity falsch geladen");
                                            });
                                    },
            'deserializeNegInf'   : function() {  // NOTE -Infinity wird von JSON als null gespeichet
                                        const [ __NAME, , , __ALT, __ALTEXP ] = __TESTDATA['NegInf'];

                                        return callPromiseChain(storeValue(__NAME, __ALTEXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "-Infinity falsch geladen");
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
            'deserializeUint32Arr': function() {
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Uint32Arr'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Uint32Array falsch geladen");
                                            });
                                    },
            'deserializeDate'     : function() {  // NOTE Date wird von JSON untypisiert gespeichet
                                        const [ __NAME, , __EXP, __ALT ] = __TESTDATA['Date'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "Date falsch geladen");
                                            });
                                    },
            'deserializeSymbol'  : function() {  // NOTE Keine Speicherung von Symbol
                                        const [ __NAME, , __EXP ] = __TESTDATA['Symbol'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Symbol falsch geladen");
                                            });
                                    },
            'deserializeSymbol2'  : function() {  // NOTE Keine Speicherung von Symbol
                                        const [ __NAME, , __EXP ] = __TESTDATA['Symbol2'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Symbol falsch geladen");
                                            });
                                    },
            'deserializeFunction' : function() {  // NOTE Keine Speicherung von Function durch JSON
                                        const [ __NAME, , , , __ALTEXP ] = __TESTDATA['Function'];

                                        return callPromiseChain(storeValue(__NAME, __ALTEXP), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Function falsch geladen");
                                            });
                                    },
            'deserializeDefault'  : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Default'];

                                        return callPromiseChain(storeValue(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'deserializeDefault2' : function() {  // NOTE Kein Default-Wert bei null
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Default2'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Serialize-Wert bei null ignoriert");
                                            });
                                    },
            'deserializeDefault3' : function() {  // NOTE Kein Default-Wert bei ""
                                        const [ __NAME, __VAL, __EXP ] = __TESTDATA['Default3'];

                                        return callPromiseChain(storeValue(__NAME, __EXP), entry => deserialize(entry.name, __ERROR), value => {
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
            'deserialize2Array3'  : function() {  // NOTE Boolean wird von JSON untypisiert gespeichet
                                        const [ __NAME, __VAL, , __ALT ] = __TESTDATA['Array3'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "Array falsch geladen");
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
            'deserialize2Object3' : function() {  // NOTE AssertionFailed wird von JSON untypisiert gespeichet
                                        const [ __NAME, __VAL, , __ALT ] = __TESTDATA['Object3'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "Object falsch geladen");
                                            });
                                    },
            'deserialize2Undef'   : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Undef'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Undefined falsch geladen");
                                            });
                                    },
            'deserialize2Null'    : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Null'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Null falsch geladen");
                                            });
                                    },
            'deserialize2NaN'     : function() {  // NOTE NaN wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , __ALT ] = __TESTDATA['NaN'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "NaN falsch geladen");
                                            });
                                    },
            'deserialize2PosInf'  : function() {  // NOTE Infinity wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , __ALT ] = __TESTDATA['PosInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "+Infinity falsch geladen");
                                            });
                                    },
            'deserialize2NegInf'  : function() {  // NOTE -Infinity wird von JSON als null gespeichet
                                        const [ __NAME, __VAL, , __ALT ] = __TESTDATA['NegInf'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "-Infinity falsch geladen");
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
            'deserialize2Uint32Arr':function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Uint32Arr'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Uint32Array falsch geladen");
                                            });
                                    },
            'deserialize2Date'    : function() {  // NOTE Date wird von JSON untypisiert gespeichet
                                        const [ __NAME, __VAL, , __ALT ] = __TESTDATA['Date'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ALT, "Date falsch geladen");
                                            });
                                    },
            'deserialize2Symbol'  : function() {  // NOTE Keine Speicherung von Symbol
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Symbol falsch geladen");
                                            });
                                    },
            'deserialize2Symbol2' : function() {  // NOTE Keine Speicherung von Symbol
                                        const [ __NAME, __VAL ] = __TESTDATA['Symbol2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Symbol falsch geladen");
                                            });
                                    },
            'deserialize2Function': function() {  // NOTE Keine Speicherung von Function durch JSON
                                        const [ __NAME, __VAL ] = __TESTDATA['Function'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Function falsch geladen");
                                            });
                                    },
            'deserialize2Default' : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Default'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __ERR, "Defaultwert bei undefined ignoriert");
                                            });
                                    },
            'deserialize2Default2': function() {  // NOTE Kein Default-Wert bei null
                                        const [ __NAME, __VAL ] = __TESTDATA['Default2'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Serialize-Wert bei null ignoriert");
                                            });
                                    },
            'deserialize2Default3': function() {  // NOTE Kein Default-Wert bei ""
                                        const [ __NAME, __VAL ] = __TESTDATA['Default3'];

                                        return callPromiseChain(serialize(__NAME, __VAL), entry => deserialize(entry.name, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Serialize-Wert bei \"\" ignoriert");
                                            });
                                    }
        });

// ==================== Abschnitt fuer die Folgen einer Speicherung ====================

    new UnitTest('util.store.js Reload', "Neuladen der Seite", {
            'refreshPageNoReload' : function() {
                                        const __RET = refreshPage(false);
                                        return ASSERT_NOT_SET(__RET, "Kein Returnwert erwartet");
                                    }
        });

// ==================== Abschnitt fuer die Sicherung von Daten mit Callback ====================

    new UnitTest('util.store.js Callback', "Sicherung von Daten mit Callback", {
            'setStored'           : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object2'];
                                        const __RELOAD = false;
                                        const __SERIAL = false;

                                        return callPromiseChain(new Promise(function(resolve, reject) { return setStored(__NAME, __VAL, __RELOAD, __SERIAL, resolve, reject); }), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'setStoredSerial'     : function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Object2'];
                                        const __RELOAD = false;
                                        const __SERIAL = true;

                                        return callPromiseChain(new Promise(function(resolve, reject) { return setStored(__NAME, __VAL, __RELOAD, __SERIAL, resolve, reject); }), () => deserialize(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "Object falsch geladen");
                                            });
                                    },
            'setNextStored'       : async function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Int'];
                                        const __ARR = [ 1, 2, 4, 8, 42, 47.11 ];
                                        const __EXP1 = 47.11;
                                        const __EXP2 = 1;
                                        const __RELOAD = false;
                                        const __SERIAL = false;

                                        await callPromiseChain(new Promise(function(resolve, reject) { return setNextStored(__ARR, __NAME, __VAL, __RELOAD, __SERIAL, resolve, reject); }), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP1, "Object falsch geladen");
                                            });

                                        return callPromiseChain(new Promise(function(resolve, reject) { return setNextStored(__ARR, __NAME, __EXP1, __RELOAD, __SERIAL, resolve, reject); }), () => summonValue(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP2, "Object falsch geladen");
                                            });
                                    },
            'setNextStoredSerial' : async function() {
                                        const [ __NAME, __VAL ] = __TESTDATA['Int'];
                                        const __ARR = [ 1, 2, 4, 8, 42, 47.11 ];
                                        const __EXP1 = 47.11;
                                        const __EXP2 = 1;
                                        const __RELOAD = false;
                                        const __SERIAL = true;

                                        await callPromiseChain(new Promise(function(resolve, reject) { return setNextStored(__ARR, __NAME, __VAL, __RELOAD, __SERIAL, resolve, reject); }), () => deserialize(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP1, "Object falsch geladen");
                                            });

                                        return callPromiseChain(new Promise(function(resolve, reject) { return setNextStored(__ARR, __NAME, __EXP1, __RELOAD, __SERIAL, resolve, reject); }), () => deserialize(__NAME, __ERROR), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP2, "Object falsch geladen");
                                            });
                                    }
        });

// ==================== Ende Abschnitt fuer die Sicherung und das Laden von Daten ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.store ====================

// *** EOF ***
