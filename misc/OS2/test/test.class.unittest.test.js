// ==UserScript==
// _name         test.class.unittest.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Basisklasse fuer Unit-Tests fuer ein JS-Modul
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/test.class.unittest.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu test.class.unittest ====================

(() => {

// ==================== Konfigurations-Abschnitt fuer Optionen ====================

//const __SHOWMODULECOUNT = false;    // Zeige Spalte mit Anzahl der Module
//const __SHOWUNITTESTDESC = false;   // Beschreibung als Tooltip (false) oder Text (true)
//const __TESTLOGLEVEL = 9;           // Logs ausfuehrlich (9) oder normal (4)

// ==================== Abschnitt fuer Klasse UnitTest ====================

    const __TESTDATA = {
            'loadOption'    : [ "saison",   42,         18,             false,  undefined   ],
        };

    new UnitTest('test.class.unittest.js', "Klasse UnitTest", {
            'loadOption'          : function() {
                                        
                                    }
        });

//function UnitTest(name, desc, tests, load) {
//Class.define(UnitTest, Object, {
//            'register'    : function(name, desc, tests, load, thisArg) {
//            'addTest'     : function(name, tFun, desc = undefined) {
//            'prepare'     : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
//            'cleanup'     : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
//            'setup'       : async function(name, desc, testFun, thisArg) {
//            'teardown'    : async function(name, desc, testFun, thisArg) {
//            'run'         : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
//UnitTest.runAll = async function(minLevel = 1, resultFun = UnitTest.defaultResultFun, tableId, resultObj, thisArg) {
//UnitTest.defaultResultFun = function(resultObj, tableId, doc = document) {
//UnitTest.getOrCreateTestResultTable = function(tableId = 'UnitTest', doc = document) {
//UnitTest.getStyleFromResults = function(results) {

// ==================== Ende Abschnitt fuer Klasse UnitTest ====================

// ==================== Abschnitt fuer Klasse UnitTestResults ====================

//function UnitTestResults(libName, libDesc, libTest) {
//Class.define(UnitTestResults, Object, {
//                'module'              : function() {
//                'running'             : function() {
//                'success'             : function() {
//                'failed'              : function() {
//                'exception'           : function(ex) {
//                'error'               : function(ex) {
//                'checkResult'         : function(result) {
//                'checkException'      : function(ex) {
//                'merge'               : function(resultsToAdd) {
//                'sum'                 : function() {

// ==================== Ende Abschnitt fuer Klasse UnitTestResults ====================

// ==================== Abschnitt fuer globale Variablen ====================

//const __ALLLIBS = { };
//const __LIBRESULTS = { };

// ==================== Ende Abschnitt fuer globale Variablen ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu test.class.unittest ====================

// *** EOF ***
