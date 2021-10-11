// ==UserScript==
// _name         test.mock.gm
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Mock-Funktionen als Ersatz fuer Greasemonkey-Einbindung
// _require      https://eselce.github.io/OS2.scripts/lib/test.mock.gm.js
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

__LOG[4](GM);

// ==================== Ende Abschnitt fuer Mock GM3-Funktionen ====================

// *** EOF ***
