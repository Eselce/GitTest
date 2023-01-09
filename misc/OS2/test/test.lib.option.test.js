// ==UserScript==
// _name         test.lib.option.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Basisklasse fuer Unit-Tests fuer ein JS-Modul
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.lib.option.js
// _require      https://eselce.github.io/OS2.scripts/test/test.lib.option.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu test.lib.option ====================

(() => {

// ==================== Abschnitt fuer Klasse UnitTestOption ====================

    const __TESTDATA = {
            'loadOption'    : [ "saison",   42,         19,             false,  undefined   ],
        };

    new UnitTest('test.lib.option.js', "Klasse UnitTestOption", {
//            'loadOption'          : function() {
//                                        
//                                    }
        });

//function UnitTestOption(name, desc, tests, load) {
//Class.define(UnitTestOption, UnitTest, {
//            'prepare'     : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
//            'cleanup'     : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
//            'setup'       : async function(name, desc, testFun, thisArg) {
//            'teardown'    : async function(name, desc, testFun, thisArg) {

// ==================== Ende Abschnitt fuer Klasse UnitTestOption ====================

// ==================== Ende Abschnitt fuer Test-Konfiguration __TESTCONFIG ====================

//const __TESTOPTCONFIG = {
//    'saison' : {          // Laufende Saison
//    'ligaSize' : {        // Ligengroesse
//    'datenZat' : {        // Stand der Daten zum Team und ZAT
//    'team' : {            // Datenspeicher fuer Daten des Erst- bzw. Zweitteams
//    'reset' : {           // Optionen auf die "Werkseinstellungen" zuruecksetzen
//    'storage' : {         // Browserspeicher fuer die Klicks auf Optionen
//    'oldStorage' : {      // Vorheriger Browserspeicher fuer die Klicks auf Optionen
//    'showForm' : {        // Optionen auf der Webseite (true = anzeigen, false = nicht anzeigen)

// ==================== Ende Abschnitt fuer Test-Konfiguration __TESTCONFIG ====================

// ==================== Spezialisierter Abschnitt fuer Optionen ====================

//const __TESTTEAMCLASS = new TeamClassification();
//__TESTTEAMCLASS.optSelect = {

// ==================== Ende Abschnitt fuer Optionen ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu test.lib.option ====================

// *** EOF ***
