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

    // Funktionalitaet der Logging-Funktionen...
    new UnitTest('util.log.js Logging', "Tools zum Loggen von Meldungen", {
            'logFun'              : function() {
                                        const __LOGFUN __LOG.logFun;

                                        ASSERT_EQUAL(__LOGFUN.length, 10, "logFun[] ben\u00F6tigt 10 Funktionen");  // 0, ..., 9

                                        __LOGFUN.forEach((fun, index) => {
                                                ASSERT_TYPEOF(fun, 'function', "logFun[" + index + " mu\u00DF eine Funktion sein");
                                            });

                                        return true;
                                    }
        });

//const __LOG = {
//                  'init'      : function(win, logLevel = 4, show = true) {
//                  'createFun' : function(name, fun, bindTo = undefined) {
//                  'stringify' : safeStringify,      // JSON.stringify
//                  'info'      : function(obj, showType = true, elementType = false) {
//                  'changed'   : function(oldVal, newVal, showType, elementType, delim = " => ") {

// ==================== Ende Abschnitt fuer Logging ====================

// ==================== Abschnitt fuer UNUSED() ====================

//function UNUSED(... unused) {

// ==================== Ende Abschnitt fuer UNUSED() ====================

// ==================== Abschnitt fuer safeStringify() ====================

//function safeStringify(value, replacer = undefined, space = undefined, cycleReplacer = undefined) {
//function serializer(replacer = undefined, cycleReplacer = undefined) {
//cycleReplacer = function(key, value) {
//function replaceArraySimple(key, value) {
//function replaceArray(key, value) {

// ==================== Ende Abschnitt fuer safeStringify() ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.log ====================

// *** EOF ***
