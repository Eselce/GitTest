// ==UserScript==
// _name         util.value.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Logging, Debugging, Error-Handling, usw.
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
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

    const __TESTDATA = {
            'getValueString'    : [ '1',                '1',                'string'    ],
            'getValueInt'       : [ 42,                 42,                 'number'    ],
            'getValueBool'      : [ true,               true,               'boolean'   ],
            'getValueFloat'     : [ 47.11,              47.11,              'number'    ],
            'getValueArray'     : [ [ 3, 4 ],           [ 3, 4 ],           'object'    ],
            'getValueObject'    : [ { 3 : 4 },          { 3 : 4 },          'object'    ],
            'getValueUndef'     : [ undefined,          __ERR,              'string'    ],
            'getValueNull'      : [ null,               __ERR,              'string'    ],
            'getValueNaN'       : [ Number.NaN,         Number.NaN,         'number'    ],
            'getValueSymbol'    : [ Symbol(),           Symbol(),           'symbol'    ],
            'getValueSymbol2'   : [ Symbol.for('key'),  Symbol.for('key'),  'symbol'    ],
            'getValueFunction'  : [ function() {},      function() {},      'function'  ],
            'getValueDefault'   : [ undefined,          __ERR,              'string'    ],
            'getValueDefault2'  : [ null,               __ERR,              'string'    ],
            'getValueDefault3'  : [ "",                 "",                 'string'    ],
            'getValueDefault4'  : [ 0,                  0,                  'number'    ],
            'getValueDefault5'  : [ false,              false,              'boolean'   ],
            'getValueRetVal'    : [ true,               __ERROR,            'string'    ]
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
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Object zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Object zur\u00FCckgeben");
                                    },
            'getValueNull'        : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueNull'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Object zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Object zur\u00FCckgeben");
                                    },
            'getValueNaN'         : function() {
                                        const [ __VAL, __EXP, __TYPE ] = __TESTDATA['getValueNaN'];
                                        const __RET = getValue(__VAL, __ERR, undefined);

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss Object zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss Object zur\u00FCckgeben");
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

                                        ASSERT_EQUAL(__RET, __EXP, "getValue() muss String zur\u00FCckgeben");

                                        return ASSERT_TYPEOF(__RET, __TYPE, "getValue() muss String zur\u00FCckgeben");
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
                                    }
        });

//+function getValue(value, defValue = undefined, retValue = undefined) {
//function getObjValue(obj, item, defValue = undefined, retValue = undefined) {
//function getArrValue(arr, index, defValue = undefined, retValue = undefined) {
//function pushObjValue(obj, item, value, defValue, returnOnly = false, scalarUnique = false) {
//function pushArrValue(arr, index, value, defValue, returnOnly = false, scalarUnique = false) {
//function getValueIn(value, minValue = undefined, maxValue = undefined, defValue = undefined) {
//function getNextValue(arr, value) {
//function getMulValue(valueA, valueB, digits = 0, defValue = Number.NaN) {
//function getOrdinal(value, defValue = '*') {
//function getNumber(numberString) {
//function getNumberString(numberString) {
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
//function sameValue(value) {
//function existValue(value) {
//function compareNumber(valueA, valueB) {
//function typeOf(value) {
//function valueOf(data) {

// ==================== Ende Abschnitt fuer diverse Utilities fuer Werte ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.value ====================

// *** EOF ***
