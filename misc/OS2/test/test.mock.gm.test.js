// ==UserScript==
// _name         test.mock.gm.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Mock-Funktionen als Ersatz fuer Greasemonkey-Einbindung
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.mock.gm.js
// _require      https://eselce.github.io/OS2.scripts/test/test.mock.gm.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu test.mock.gm ====================

(() => {

// ==================== Abschnitt fuer Mock GM3-Funktionen ====================

    const __TESTDATA = {
            'loadOption'    : [ "saison",   42,         19,             false,  undefined   ],
        };

    new UnitTest('test.mock.gm.js', "Mock GM3-Funktionen", {
//            'loadOption'          : function() {
//                                        
//                                    }
        });

//this.GM_getValue = function(name, defaultValue) {  // Mock GM_getValue function
//this.GM_setValue = function(name, value) {  // Mock GM_setValue function
//this.GM_deleteValue = function(name) {  // Mock GM_deleteValue function
//this.GM_listValues = function() {  // Mock GM_listValues function
//const __MOCKSTORAGE = { };

// ==================== Ende Abschnitt fuer Mock GM3-Funktionen ====================

// ==================== Abschnitt fuer Mock GM4-Objekt ====================

//this.GM = { };
//this.GM['info'] = { };
//const GM_INFO = this.GM.info;
//GM_INFO['scriptHandler'] = "Mock Script Handler";
//GM_INFO['version'] = "0.10";
//if ((typeof __DBMAN.scriptHandler) === 'undefined') {
//Object.entries({
//        'GM_deleteValue' : 'deleteValue',
//        'GM_getValue'    : 'getValue',
//        'GM_listValues'  : 'listValues',
//        'GM_setValue'    : 'setValue'
//    }).forEach(([oldKey, newKey]) => {

// ==================== Ende Abschnitt fuer Mock GM4-Objekt ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu test.mock.gm ====================

// *** EOF ***
