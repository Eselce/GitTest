// ==UserScript==
// _name         util.object.test
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
// _require      https://eselce.github.io/OS2.scripts/test/util.object.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.object ====================

(() => {

// ==================== Abschnitt fuer diverse Utilities fuer Object, Array, etc. ====================

// ==================== Abschnitt fuer detaillierte Ausgabe von Daten ====================

    const __TESTDATA = {
            'loadOption'    : [ "saison",   42,         18,             false,  undefined   ],
        };

    new UnitTest('util.object.js', "Utilities fuer Object, Array, etc.", {
            'loadOption'          : function() {
                                        
                                    }
        });

//Object.Map = function(obj, mapFun, thisArg, filterFun, sortFun) {
//function getObjInfo(obj, keyStrings, longForm, stepIn) {
//function getValStr(obj, keyStrings, showType, showLen, stepIn) {

// ==================== Ende Abschnitt fuer detaillierte Ausgabe von Daten ====================

// ==================== Abschnitt Hilfsfunktionen fuer Array-Mapping ====================

//function Arrayfrom(obj, mapFun, thisArg) {
//function reverseArray(obj, keyValFun, valuesFun, valKeyFun) {

// ==================== Ende Abschnitt Hilfsfunktionen fuer Array-Mapping ====================

// ==================== Abschnitt Hilfsfunktionen fuer Object-Mapping ====================

//function reverseMapping(obj, keyValFun, valuesFun, valKeyFun) {
//function selectMapping(obj, keyIndex = -1, valueIndex = 0, keyValFun, valKeyFun) {
//function mappingPush(value, key, obj) {
//function mappingSetOrPush(value, key, obj) {
//function mappingPushFun(valueFun) {
//function mappingSetOrPushFun(valueFun) {
//function mappingValueSelect(index, keyValFun = null, value, key, obj, oldObj) {
//function mappingValuesFunSelect(index, obj) {

// ==================== Ende Abschnitt Hilfsfunktionen fuer Object-Mapping ====================

// ==================== Ende Abschnitt fuer diverse Utilities fuer Object, Array, etc. ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.object ====================

// *** EOF ***
