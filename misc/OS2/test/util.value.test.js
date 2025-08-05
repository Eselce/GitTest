// ==UserScript==
// _name         util.value.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Logging, Debugging, Error-Handling, usw.
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/util.value.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.value ====================

(() => {

// ==================== Abschnitt fuer diverse Utilities fuer Werte ====================

    const __ERROR = 'ERROR';
    const __ERR = __ERROR;
    const __KEY = 'key';    // Key fuer Object
    const __KEY0 = 0;       // Key fuer Array

// ==================== Abschnitt fuer getValue(), getObjValue() und getArrValue() ====================

    const __TESTDATA = {
            'getValueString'        : [ '1',                            '1',                'string'    ],
            'getValueInt'           : [ 42,                             42,                 'number'    ],
            'getValueBool'          : [ true,                           true,               'boolean'   ],
            'getValueFloat'         : [ 47.11,                          47.11,              'number'    ],
            'getValueArray'         : [ [ 3, 4 ],                       [ 3, 4 ],           'object'    ],
            'getValueObject'        : [ { 3 : 4 },                      { 3 : 4 },          'object'    ],
            'getValueUndef'         : [ undefined,                      undefined,          'undefined' ],
            'getValueNull'          : [ null,                           undefined,          'undefined' ],
            'getValueNaN'           : [ Number.NaN,                     Number.NaN,         'number'    ],
            'getValueSymbol'        : [ Symbol(),                       Symbol(),           'symbol'    ],
            'getValueSymbol2'       : [ Symbol.for('key'),              Symbol.for('key'),  'symbol'    ],
            'getValueFunction'      : [ function() {},                  function() {},      'function'  ],
            'getValueDefault'       : [ undefined,                      __ERR,              'string'    ],
            'getValueDefault2'      : [ null,                           __ERR,              'string'    ],
            'getValueDefault3'      : [ "",                             "",                 'string'    ],
            'getValueDefault4'      : [ 0,                              0,                  'number'    ],
            'getValueDefault5'      : [ false,                          false,              'boolean'   ],
            'getValueRetVal'        : [ true,                           __ERROR,            'string'    ],
            'getObjValueString'     : [ { key : '1' },                  '1',                'string'    ],
            'getObjValueInt'        : [ { key : 42 },                   42,                 'number'    ],
            'getObjValueBool'       : [ { key : true },                 true,               'boolean'   ],
            'getObjValueFloat'      : [ { key : 47.11 },                47.11,              'number'    ],
            'getObjValueArray'      : [ { key : [ 3, 4 ] },             [ 3, 4 ],           'object'    ],
            'getObjValueObject'     : [ { key : { 3 : 4 } },            { 3 : 4 },          'object'    ],
            'getObjValueUndef'      : [ { key : undefined },            undefined,          'undefined' ],
            'getObjValueUndef2'     : [ { },                            undefined,          'undefined' ],
            'getObjValueNull'       : [ { key : null },                 undefined,          'undefined' ],
            'getObjValueNaN'        : [ { key : Number.NaN },           Number.NaN,         'number'    ],
            'getObjValueSymbol'     : [ { key : Symbol() },             Symbol(),           'symbol'    ],
            'getObjValueSymbol2'    : [ { key : Symbol.for('key') },    Symbol.for('key'),  'symbol'    ],
            'getObjValueFunction'   : [ { key : function() {} },        function() {},      'function'  ],
            'getObjValueDefault'    : [ { key : undefined },            __ERR,              'string'    ],
            'getObjValueDefault2'   : [ { key : null },                 __ERR,              'string'    ],
            'getObjValueDefault3'   : [ { key : "" },                   "",                 'string'    ],
            'getObjValueDefault4'   : [ { key : 0 },                    0,                  'number'    ],
            'getObjValueDefault5'   : [ { key : false },                false,              'boolean'   ],
            'getObjValueRetVal'     : [ { key : true },                 __ERROR,            'string'    ],
            'getObjValueObjUndef'   : [ undefined,                      __ERR,              'string'    ],
            'getObjValueObjNull'    : [ null,                           __ERR,              'string'    ],
            'getObjValueObjString'  : [ "",                             __ERR,              'string'    ],
            'getArrValueString'     : [ [ '1' ],                        '1',                'string'    ],
            'getArrValueInt'        : [ [ 42 ],                         42,                 'number'    ],
            'getArrValueBool'       : [ [ true ],                       true,               'boolean'   ],
            'getArrValueFloat'      : [ [ 47.11 ],                      47.11,              'number'    ],
            'getArrValueArray'      : [ [ [ 3, 4 ] ],                   [ 3, 4 ],           'object'    ],
            'getArrValueObject'     : [ [ { 3 : 4 } ],                  { 3 : 4 },          'object'    ],
            'getArrValueUndef'      : [ [ undefined ],                  undefined,          'undefined' ],
            'getArrValueUndef2'     : [ [],                             undefined,          'undefined' ],
            'getArrValueNull'       : [ [ null ],                       undefined,          'undefined' ],
            'getArrValueNaN'        : [ [ Number.NaN ],                 Number.NaN,         'number'    ],
            'getArrValueSymbol'     : [ [ Symbol() ],                   Symbol(),           'symbol'    ],
            'getArrValueSymbol2'    : [ [ Symbol.for('key') ],          Symbol.for('key'),  'symbol'    ],
            'getArrValueFunction'   : [ [ function() {} ],              function() {},      'function'  ],
            'getArrValueDefault'    : [ [ undefined ],                  __ERR,              'string'    ],
            'getArrValueDefault2'   : [ [ null ],                       __ERR,              'string'    ],
            'getArrValueDefault3'   : [ [ "" ],                         "",                 'string'    ],
            'getArrValueDefault4'   : [ [ 0 ],                          0,                  'number'    ],
            'getArrValueDefault5'   : [ [ false ],                      false,              'boolean'   ],
            'getArrValueRetVal'     : [ [ true ],                       __ERROR,            'string'    ],
            'getArrValueObjUndef'   : [ undefined,                      __ERR,              'string'    ],
            'getArrValueObjNull'    : [ null,                           __ERR,              'string'    ],
            'getArrValueObjString'  : [ "",                             __ERR,              'string'    ]
        };

    new UnitTest('util.value.js', "Utilities zur Behandlung von Werten", {
            'getValueString'      : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueString'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss String zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss String zur\u00FCckgeben");
                                    },
            'getValueInt'         : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueInt'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Integer zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Integer zur\u00FCckgeben");
                                    },
            'getValueBool'        : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueBool'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Boolean zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Boolean zur\u00FCckgeben");
                                    },
            'getValueFloat'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueFloat'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Float zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Float zur\u00FCckgeben");
                                    },
            'getValueArray'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueArray'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Array zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Array zur\u00FCckgeben");
                                    },
            'getValueObject'      : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueObject'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Object zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Object zur\u00FCckgeben");
                                    },
            'getValueUndef'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueUndef'];
                                        const __RET = getValue(__VAL, undefined, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss undefined zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss undefined zur\u00FCckgeben");
                                    },
            'getValueNull'        : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueNull'];
                                        const __RET = getValue(__VAL, undefined, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss undefined zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss undefined zur\u00FCckgeben");
                                    },
            'getValueNaN'         : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueNaN'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss NaN zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss NaN zur\u00FCckgeben");
                                    },
            'getValueSymbol'      : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueSymbol'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Symbol zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Symbol zur\u00FCckgeben");
                                    },
            'getValueSymbol2'     : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueSymbol2'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Symbol zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Symbol zur\u00FCckgeben");
                                    },
            'getValueFunction'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueFunction'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Function zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Function zur\u00FCckgeben");
                                    },
            'getValueDefault'     : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueDefault'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss __ERR zur\u00FCckgeben");
                                    },
            'getValueDefault2'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueDefault2'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss __ERR zur\u00FCckgeben");
                                    },
            'getValueDefault3'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueDefault3'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Leerstring zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Leerstring zur\u00FCckgeben");
                                    },
            'getValueDefault4'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueDefault4'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Integer zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Integer zur\u00FCckgeben");
                                    },
            'getValueDefault5'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueDefault5'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Boolean zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Boolean zur\u00FCckgeben");
                                    },
            'getValueRetVal'      : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueRetVal'];
                                        const __RET = getValue(__VAL, undefined, __ERROR);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss __ERROR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss __ERROR zur\u00FCckgeben");
                                    },
            'getObjValueString'   : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueString'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss String zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss String zur\u00FCckgeben");
                                    },
            'getObjValueInt'      : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueInt'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Integer zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Integer zur\u00FCckgeben");
                                    },
            'getObjValueBool'     : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueBool'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Boolean zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Boolean zur\u00FCckgeben");
                                    },
            'getObjValueFloat'    : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueFloat'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Float zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Float zur\u00FCckgeben");
                                    },
            'getObjValueArray'    : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueArray'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Array zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Array zur\u00FCckgeben");
                                    },
            'getObjValueObject'   : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueObject'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Object zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Object zur\u00FCckgeben");
                                    },
            'getObjValueUndef'    : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueUndef'];
                                        const __RET = getObjValue(__OBJ, __KEY, undefined, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss undefined zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss undefined zur\u00FCckgeben");
                                    },
            'getObjValueUndef2'   : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueUndef2'];
                                        const __RET = getObjValue(__OBJ, __KEY, undefined, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss undefined zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss undefined zur\u00FCckgeben");
                                    },
            'getObjValueNull'     : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueNull'];
                                        const __RET = getObjValue(__OBJ, __KEY, undefined, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss undefined zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss undefined zur\u00FCckgeben");
                                    },
            'getObjValueNaN'      : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueNaN'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss NaN zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss NaN zur\u00FCckgeben");
                                    },
            'getObjValueSymbol'   : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueSymbol'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Symbol zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Symbol zur\u00FCckgeben");
                                    },
            'getObjValueSymbol2'  : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueSymbol2'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Symbol zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Symbol zur\u00FCckgeben");
                                    },
            'getObjValueFunction' : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueFunction'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Function zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Function zur\u00FCckgeben");
                                    },
            'getObjValueDefault'  : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueDefault'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss __ERR zur\u00FCckgeben");
                                    },
            'getObjValueDefault2' : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueDefault2'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss __ERR zur\u00FCckgeben");
                                    },
            'getObjValueDefault3' : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueDefault3'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Leerstring zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Leerstring zur\u00FCckgeben");
                                    },
            'getObjValueDefault4' : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueDefault4'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Integer zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Integer zur\u00FCckgeben");
                                    },
            'getObjValueDefault5' : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueDefault5'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss Boolean zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss Boolean zur\u00FCckgeben");
                                    },
            'getObjValueRetVal'   : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueRetVal'];
                                        const __RET = getObjValue(__OBJ, __KEY, undefined, __ERROR);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss __ERROR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss __ERROR zur\u00FCckgeben");
                                    },
            'getObjValueObjUndef' : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueObjUndef'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss __ERROR zur\u00FCckgeben");
                                    },
            'getObjValueObjNull'  : function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueObjNull'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss __ERROR zur\u00FCckgeben");
                                    },
            'getObjValueObjString': function() {
                                        const [ __OBJ, __EXP, __TYPE ] = __TESTDATA['getObjValueObjString'];
                                        const __RET = getObjValue(__OBJ, __KEY, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getObjValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getObjValue() muss __ERROR zur\u00FCckgeben");
                                    },
            'getArrValueString'   : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueString'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss String zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss String zur\u00FCckgeben");
                                    },
            'getArrValueInt'      : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueInt'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Integer zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Integer zur\u00FCckgeben");
                                    },
            'getArrValueBool'     : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueBool'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Boolean zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Boolean zur\u00FCckgeben");
                                    },
            'getArrValueFloat'    : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueFloat'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Float zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Float zur\u00FCckgeben");
                                    },
            'getArrValueArray'    : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueArray'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Array zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Array zur\u00FCckgeben");
                                    },
            'getArrValueObject'   : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueObject'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Object zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Object zur\u00FCckgeben");
                                    },
            'getArrValueUndef'    : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueUndef'];
                                        const __RET = getArrValue(__ARR, __KEY0, undefined, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss undefined zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss undefined zur\u00FCckgeben");
                                    },
            'getArrValueUndef2'   : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueUndef2'];
                                        const __RET = getArrValue(__ARR, __KEY0, undefined, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss undefined zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss undefined zur\u00FCckgeben");
                                    },
            'getArrValueNull'     : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueNull'];
                                        const __RET = getArrValue(__ARR, __KEY0, undefined, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss undefined zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss undefined zur\u00FCckgeben");
                                    },
            'getArrValueNaN'      : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueNaN'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss NaN zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss NaN zur\u00FCckgeben");
                                    },
            'getArrValueSymbol'   : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueSymbol'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Symbol zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Symbol zur\u00FCckgeben");
                                    },
            'getArrValueSymbol2'  : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueSymbol2'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Symbol zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Symbol zur\u00FCckgeben");
                                    },
            'getArrValueFunction' : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueFunction'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Function zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Function zur\u00FCckgeben");
                                    },
            'getArrValueDefault'  : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueDefault'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss __ERR zur\u00FCckgeben");
                                    },
            'getArrValueDefault2' : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueDefault2'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss __ERR zur\u00FCckgeben");
                                    },
            'getArrValueDefault3' : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueDefault3'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Leerstring zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Leerstring zur\u00FCckgeben");
                                    },
            'getArrValueDefault4' : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueDefault4'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Integer zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Integer zur\u00FCckgeben");
                                    },
            'getArrValueDefault5' : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueDefault5'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss Boolean zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss Boolean zur\u00FCckgeben");
                                    },
            'getArrValueRetVal'   : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueRetVal'];
                                        const __RET = getArrValue(__ARR, __KEY0, undefined, __ERROR);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss __ERROR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss __ERROR zur\u00FCckgeben");
                                    },
            'getArrValueObjUndef' : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueObjUndef'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss __ERROR zur\u00FCckgeben");
                                    },
            'getArrValueObjNull'  : function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueObjNull'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss __ERROR zur\u00FCckgeben");
                                    },
            'getArrValueObjString': function() {
                                        const [ __ARR, __EXP, __TYPE ] = __TESTDATA['getArrValueObjString'];
                                        const __RET = getArrValue(__ARR, __KEY0, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getArrValue() muss __ERR zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getArrValue() muss __ERROR zur\u00FCckgeben");
                                    }
        });

// ==================== Ende Abschnitt fuer getValue(), getObjValue() und getArrValue() ====================

// ==================== Abschnitt fuer getNumber() ====================

    const __EPSILON = 1e-10; // Ausreichend genau, um Abweichungen von korrekter Umwandlung zu erkennen

    const __TESTDATANUMBER = {
            'getNumberInt'          : [ '42',                           42,                 'number'    ],
            'getNumberIntNeg'       : [ '-42',                          -42,                'number'    ],
            'getNumberIntOne'       : [ '1.234',                        1234,               'number'    ],
            'getNumberIntOneNeg'    : [ '-1.234',                       -1234,              'number'    ],
            'getNumberIntTwo'       : [ '12.345.678',                   12345678,           'number'    ],
            'getNumberIntTwoNeg'    : [ '-12.345.678',                  -12345678,          'number'    ],
            'getNumberNum1'         : [ '0.9',                          0.9,                'number'    ],
            'getNumberNum1Neg'      : [ '-0.9',                         -0.9,               'number'    ],
            'getNumberNum2'         : [ '0.98',                         0.98,               'number'    ],
            'getNumberNum2Neg'      : [ '-0.98',                        -0.98,              'number'    ],
            'getNumberNum3Not'      : [ '0.987',                        987,                'number'    ],
            'getNumberNum3NotNeg'   : [ '-0.987',                       -987,               'number'    ],
            'getNumberNum4'         : [ '0.9876',                       0.9876,             'number'    ],
            'getNumberNum4Neg'      : [ '-0.9876',                      -0.9876,            'number'    ],
            'getNumberNum5'         : [ '0.98765',                      0.98765,            'number'    ],
            'getNumberNum5Neg'      : [ '-0.98765',                     -0.98765,           'number'    ],
            'getNumberNum6'         : [ '0.987654',                     0.987654,           'number'    ],
            'getNumberNum6Neg'      : [ '-0.987654',                    -0.987654,          'number'    ],
            'getNumberIpc'          : [ '42%',                          0.42,               'number'    ],
            'getNumberIpcNeg'       : [ '-42%',                         -0.42,              'number'    ],
            'getNumberIpcOne'       : [ '1.234%',                       12.34,              'number'    ],
            'getNumberIpcOneNeg'    : [ '-1.234%',                      -12.34,             'number'    ],
            'getNumberIpcTwo'       : [ '12.345.678%',                  123456.78,          'number'    ],
            'getNumberIpcTwoNeg'    : [ '-12.345.678%',                 -123456.78,         'number'    ],
            'getNumberNpc1'         : [ '0.9%',                         0.009,              'number'    ],
            'getNumberNpc1Neg'      : [ '-0.9%',                        -0.009,             'number'    ],
            'getNumberNpc2'         : [ '0.98%',                        0.0098,             'number'    ],
            'getNumberNpc2Neg'      : [ '-0.98%',                       -0.0098,            'number'    ],
            'getNumberNpc3Not'      : [ '0.987%',                       9.87,               'number'    ],
            'getNumberNpc3NotNeg'   : [ '-0.987%',                      -9.87,              'number'    ],
            'getNumberNpc4'         : [ '0.9876%',                      0.009876,           'number'    ],
            'getNumberNpc4Neg'      : [ '-0.9876%',                     -0.009876,          'number'    ],
            'getNumberNpc5'         : [ '0.98765%',                     0.0098765,          'number'    ],
            'getNumberNpc5Neg'      : [ '-0.98765%',                    -0.0098765,         'number'    ],
            'getNumberNpc6'         : [ '0.987654%',                    0.00987654,         'number'    ],
            'getNumberNpc6Neg'      : [ '-0.987654%',                   -0.00987654,        'number'    ]
        };

    new UnitTest('util.value.js Number', "Utilities zur Behandlung von Nummern", {
            'getNumberInt'        : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberInt'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIntNeg'     : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIntNeg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIntOne'     : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIntOne'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIntOneNeg'  : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIntOneNeg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIntTwo'     : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIntTwo'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIntTwoNeg'  : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIntTwoNeg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum1'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum1'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum1Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum1Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum2'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum2'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum2Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum2Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum3Not'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum3Not'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum3NotNeg' : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum3NotNeg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum4'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum4'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum4Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum4Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum5'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum5'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum5Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum5Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum6'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum6'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNum6Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNum6Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIpc'        : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIpc'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIpcNeg'     : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIpcNeg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIpcOne'     : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIpcOne'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIpcOneNeg'  : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIpcOneNeg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIpcTwo'     : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIpcTwo'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberIpcTwoNeg'  : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberIpcTwoNeg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_EQUAL(__RET, __EXP, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc1'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc1'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc1Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc1Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc2'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc2'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc2Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc2Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc3Not'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc3Not'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc3NotNeg' : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc3NotNeg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc4'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc4'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc4Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc4Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc5'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc5'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc5Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc5Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc6'       : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc6'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    },
            'getNumberNpc6Neg'    : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATANUMBER['getNumberNpc6Neg'];
                                        const __RET = getNumber(__VAL);

                                        ASSERT_IN_EPSILON(__RET, __EXP, 1, __EPSILON, "getNumber() muss Zahl zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getNumber() muss Number zur\u00FCckgeben");
                                    }
        });

// ==================== Ende Abschnitt fuer getNumber() ====================

//+function getValue(value, defValue = undefined, retValue = undefined) {
//+function getObjValue(obj, item, defValue = undefined, retValue = undefined) {
//+function getArrValue(arr, index, defValue = undefined, retValue = undefined) {
//function pushObjValue(obj, item, value, defValue, returnOnly = false, scalarUnique = false) {
//function pushArrValue(arr, index, value, defValue, returnOnly = false, scalarUnique = false) {
//function clearObj(obj, keepFilter = null) {
//function clearObjFast(obj, keepFilter = null) {
//function allItems(item) {
//function noItems(item) {
//function getValueIn(value, minValue = undefined, maxValue = undefined, defValue = undefined) {
//function getNextValue(arr, value) {
//function getMulValue(valueA, valueB, digits = 0, defValue = Number.NaN) {
//function getOrdinal(value, defValue = '*') {
//+function getNumber(numberString) {
//function getNumberString(numberString) {
//function getArrString(arr, spaceOrFormat = ' ') {
//function getKeyString(obj, spaceOrFormat = ' ') {
//function getValueString(obj, spaceOrFormat = ' ') {
//function getEntryString(obj, spaceOrFormat = ' ', entryFun = undefined) {
//function floorValue(value, dot = '.') {
//function toArray(value) {
//function flatArray(... args) {
//function param0Wrapper(wrapFun, param0Fun) {
//function param0ArrWrapper(wrapFun, param0ArrFun) {
//function paramWrapper(wrapFun, paramFuns) {
//function paramArrWrapper(wrapFun, paramFuns) {
//function replaceArrayFun(formatFun, space = ' ') {
//function padStartFun(targetLength = 4, padString = ' ') {
//function padEndFun(targetLength = 4, padString = ' ') {
//function padLeft(value, size = 4, char = ' ') {
//function padNumber(value, size = 2, char = '0') {
//function reverseString(string) {
//function trimMS(string) {
//function sameValue(value) {
//function existValue(value) {
//function compareNumber(valueA, valueB) {
//function typeOf(value) {
//function valueOf(data) {

// ==================== Ende Abschnitt fuer diverse Utilities fuer Werte ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.value ====================

// *** EOF ***
