

/*** Modul util.log.test.js ***/

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

/*** Ende util.log.test.js ***/

/*** Modul util.store.test.js ***/

// ==UserScript==
// _name         util.store.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Script-Optionen im Benutzermenue
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/test/util.store.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.store ====================

// ==================== Abschnitt fuer die Sicherung und das Laden von Daten ====================

const __UNITTESTSTORE1 = new UnitTest('util.store.js 1', "Sicherung und das Laden von Daten", {
        'serializeString'     : function() {
                                    const __NAME = "UnitTestS";
                                    const __VAL = "Teststring";
                                    const __EXP = '"Teststring"';

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, "String falsch gespeichert");
                                        }, defaultCatch);
                                },
        'serializeInt'        : function() {
                                    const __NAME = "UnitTestI";
                                    const __VAL = 42;
                                    const __EXP = '42';

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, "Integer falsch gespeichert");
                                        }, defaultCatch);
                                },
        'serializeBool'       : function() {
                                    const __NAME = "UnitTestB";
                                    const __VAL = false;
                                    const __EXP = 'false';

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, "Boolean falsch gespeichert");
                                        }, defaultCatch);
                                },
        'serializeFloat'      : function() {
                                    const __NAME = "UnitTestI";
                                    const __VAL = 47.11;
                                    const __EXP = '47.11';

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, 0.000001, "Float falsch gespeichert");
                                        }, defaultCatch);
                                },
        'serializeArray'      : function() {
                                    const __NAME = "UnitTestA";
                                    const __VAL = [ 1, 2, 4, 8 ];
                                    const __EXP = '[1,2,4,8]';

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, "Array falsch gespeichert");
                                        }, defaultCatch);
                                },
        'serializeObject'     : function() {
                                    const __NAME = "UnitTestO";
                                    const __VAL = { eins : 1, zwei : 2, fuenf : 5 };
                                    const __EXP = '{"eins":1,"zwei":2,"fuenf":5}';

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, "Object falsch gespeichert");
                                        }, defaultCatch);
                                },
        'serializeUndefined'  : function() {
                                    const __NAME = "UnitTestU";
                                    const __VAL = undefined;
                                    const __EXP = undefined;

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, "Undefined falsch gespeichert");
                                        }, defaultCatch);
                                },
        'serializeNull'       : function() {
                                    const __NAME = "UnitTestN";
                                    const __VAL = null;
                                    const __EXP = 'null';

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, "Null falsch gespeichert");
                                        }, defaultCatch);
                                },
        'serializeNull'       : function() {
                                    const __NAME = "UnitTestNaN";
                                    const __VAL = NaN;
                                    const __EXP = 'null';  // TODO: richtig?

                                    return serialize(__NAME, __VAL).then(entry => {
                                            const __NAM = entry.name;
                                            const __RET = entry.value;

                                            ASSERT_EQUAL(__NAM, __NAME, "Falscher Speicherort");
                                            ASSERT_EQUAL(__RET, __EXP, "NaN falsch gespeichert");
                                        }, defaultCatch);
                                }
    });

//function storeValue(name, value) {
//function summonValue(name, defValue = undefined) {
//function serialize(name, value) {
//function deserialize(name, defValue = undefined) {
//function refreshPage(reload = true) {

// ==================== Abschnitt fuer die Sicherung von Daten mit Callback ====================

//function setStored(name, value, reload = false, serial = false, onFulfilled = undefined, onRejected = undefined) {
//function setNextStored(arr, name, value, reload = false, serial = false, onFulfilled = undefined, onRejected = undefined) {

// ==================== Ende Abschnitt fuer die Sicherung und das Laden von Daten ====================

// *** EOF ***

/*** Ende util.store.test.js ***/

