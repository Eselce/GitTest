// ==UserScript==
// _name         util.log.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Logging und safeStringify()
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/test/util.log.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Mock GM3-Funktionen ====================

if (typeof GM_getValue == 'undefined') {
    this.GM_getValue = function(name, defaultValue) {  // Mock GM_getValue function
            if (__MOCKSTORAGE.hasOwnProperty(name)) {
                return __MOCKSTORAGE[name];
            } else {
                return defaultValue;
            }
        };
}

if (typeof GM_setValue == 'undefined') {
    this.GM_setValue = function(name, value) {  // Mock GM_setValue function
            __MOCKSTORAGE[name] = value;
        };
}

if (typeof GM_deleteValue == 'undefined') {
    this.GM_deleteValue = function(name) {  // Mock GM_deleteValue function
            delete __MOCKSTORAGE[name];
        };
}

// Interner Speicher zur Simulation eines localStorage...
const __MOCKSTORAGE = { };

// Zuordnung im GM-Objekt...
Object.entries({
        'GM_deleteValue' : 'deleteValue',
        'GM_getValue'    : 'getValue',
        'GM_setValue'    : 'setValue'
    }).forEach(([oldKey, newKey]) => {
        let old = this[oldKey];
        if (old && (typeof GM[newKey] == 'undefined')) {
            GM[newKey] = function(...args) {
                    return new Promise((resolve, reject) => {
                            try {
                                resolve(old.apply(this, args));
                            } catch (e) {
                                reject(e);
                            }
                        });
                };
        }
    });

__LOG[1](GM);

// ==================== Ende Abschnitt fuer Mock GM3-Funktionen ====================

// ==================== Abschnitt fuer Beispiel-Tests ====================

const __BSPTESTS = new UnitTest('util.log.js', "Alles rund um das Logging", {
                               'log0'              : function() {
                                                         __LOG[3]("Testausgabe!");

                                                         return true;
                                                     },
                               'safeStringifyZahl' : function() {
                                                         const __RET = safeStringify(42);
                                                         const __EXP = '42';

                                                         return ASSERT_EQUAL(__RET, __EXP, "Nicht die Antwort auf alles!");
                                                     },
                               'safeStringifyFail' : function() {
                                                         const __RET = safeStringify(42);
                                                         const __EXP = 42;

                                                         return ASSERT_EQUAL(__RET, __EXP, "Absichtlich eingebauter Typfehler!");
                                                     },
                               'safeStringifyLike' : function() {
                                                         const __RET = safeStringify(42);
                                                         const __EXP = 42;

                                                         return ASSERT_ALIKE(__RET, __EXP, "Trotz der Gemeinsamkeiten nicht erkannt!");
                                                     }
                               });
const __BSPTESTSLEER = new UnitTest('empty.js', "Leere UnitTest-Klasse", { });
const __BSPTESTSUNDEFINED = new UnitTest('undefined.js', "Fehlende Tests");

// ==================== Ende Abschnitt fuer Beispiel-Tests ====================

// ==================== Abschnitt fuer Unit-Tests zu util.log ====================

// ==================== Abschnitt fuer Logging ====================

//const __LOG = {
//                  'logFun'    : [
//                  'init'      : function(win, logLevel = 1) {
//                  'stringify' : safeStringify,      // JSON.stringify
//                  'changed'   : function(oldVal, newVal) {

// ==================== Abschnitt fuer safeStringify() ====================

//function safeStringify(value, replacer = undefined, space = undefined, cycleReplacer = undefined) {
//function serializer(replacer = undefined, cycleReplacer = undefined) {
//function replaceArraySimple(key, value) {
//function replaceArray(key, value) {

// ==================== Ende Abschnitt fuer safeStringify() ====================

// *** EOF ***
