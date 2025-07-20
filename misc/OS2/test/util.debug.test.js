// ==UserScript==
// _name         util.debug.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Debugging, Error-Handling, usw.
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/util.debug.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.debug ====================

(() => {

// ==================== Abschnitt fuer Debugging und Error-Handling ====================

    const __TESTDATA = {
            'loadOption'    : [ "saison",   42,         19,             false,  undefined   ],
        };

    new UnitTest('util.debug.js', "Utilities zu Debugging und Error-Handling", {
//            'loadOption'          : function() {
//                                        
//                                    }
        });

//function showAlert(label, message, data = undefined, show = true) {
//function askUser(message, dflt, acceptFun) {
//function showException(label, ex, show = true) {
//function defaultCatch(error, show) {

// ==================== Hilfsfunktionen fuer Typueberpruefungen ====================

//function checkObjClass(obj, cls, strict = false, label = "", objName = undefined, className = undefined) {
//function checkType(value, type, strict = false, label = "", valName = undefined, typeName = undefined) {
//function checkEnumObj(value, enumObj, strict = false, label = "", valName = undefined, enumName = undefined) {

// ==================== Ende Hilfsfunktionen fuer Typueberpruefungen ====================

//function codeLineFor(ex, longForm = false, showFunName = false, ignoreCaller = false, ignoreLibs = true) {
//function codeLine(longForm = false, showFunName = false, ignoreCaller = false, ignoreLibs = true) {
//function checkCodeLineBlacklist(funName, fileName, strictFileName = false) {
//const __CODELINEBLACKLIST = {
//const __CODELINEBLACKLISTREGEXP = {

// ==================== Ende Abschnitt fuer Debugging, Error-Handling ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.debug ====================

// *** EOF ***
