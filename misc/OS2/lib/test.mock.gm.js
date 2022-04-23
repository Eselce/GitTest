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

if ((typeof GM_getValue) === 'undefined') {
    this.GM_getValue = function(name, defaultValue) {  // Mock GM_getValue function
            const __VAL = (__MOCKSTORAGE.hasOwnProperty(name)) ?__MOCKSTORAGE[name] : undefined;

            // getValue() defaultet neben 'undefined' auch 'null'...
            return ((__VAL === null) ? __VAL : getValue(__VAL, defaultValue));
        };
}

if ((typeof GM_setValue) === 'undefined') {
    this.GM_setValue = function(name, value) {  // Mock GM_setValue function
            __MOCKSTORAGE[name] = value;

            return value;
        };
}

if ((typeof GM_deleteValue) === 'undefined') {
    this.GM_deleteValue = function(name) {  // Mock GM_deleteValue function
            const __VALUE = __MOCKSTORAGE[name];

            delete __MOCKSTORAGE[name];

            return __VALUE;
        };
}

if ((typeof GM_listValues) === 'undefined') {
    this.GM_listValues = function() {  // Mock GM_listValues function
            return Object.keys(__MOCKSTORAGE);
        };
}

// Interner Speicher zur Simulation eines localStorage...
const __MOCKSTORAGE = { };

// ==================== Ende Abschnitt fuer Mock GM3-Funktionen ====================

// ==================== Abschnitt fuer Mock GM4-Objekt ====================

if ((typeof GM) === 'undefined') {
    this.GM = { };
}

if ((typeof GM.info) === 'undefined') {
    this.GM['info'] = { };
}

if ((typeof GM.info.scriptHandler) === 'undefined') {
    const GM_INFO = this.GM.info;

    GM_INFO['scriptHandler'] = "Mock Script Handler";
    GM_INFO['version'] = "0.10";

    // Ggfs. nachtraeglich Daten aktualisieren...
    if ((typeof __DBMAN.scriptHandler) === 'undefined') {
        __DBMAN.updateInfo(GM_INFO);
    }
}

// Zuordnung im GM-Objekt...
Object.entries({
        'GM_deleteValue' : 'deleteValue',
        'GM_getValue'    : 'getValue',
        'GM_listValues'  : 'listValues',
        'GM_setValue'    : 'setValue'
    }).forEach(([oldKey, newKey]) => {
        let old = this[oldKey];
        if (old && ((typeof GM[newKey]) === 'undefined')) {
            GM[newKey] = function(... args) {
                    return new Promise((resolve, reject) => {
                            try {
                                resolve(old.apply(this, args));
                            } catch (ex) {
                                reject(ex);
                            }
                        });
                };
        }
    });

__LOG[7](GM);

// ==================== Ende Abschnitt fuer Mock GM4-Objekt ====================

// *** EOF ***
