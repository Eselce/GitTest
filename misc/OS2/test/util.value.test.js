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

    const __TESTDATA = {
            'loadOption'    : [ "saison",   42,         18,             false,  undefined   ],
        };

    new UnitTest('util.value.js', "Utilities zur Behandlung von Werten", {
            'loadOption'          : function() {
                                        
                                    }
        });

//function getValue(value, defValue = undefined, retValue = undefined) {
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
