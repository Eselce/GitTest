// ==UserScript==
// _name         util.option.class.options
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Objekt-Klasse fuer die Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.sys.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse Options ====================

// Basisklasse fuer Optionen
function Options(optConfig, optSetLabel) {
    'use strict';

    this.setConst('config', (optConfig || { }), false);
    this.setConst('setLabel', (optSetLabel || '__OPTSET'), false);
}

Class.define(Options, Object, {
        'checkKey'        : function(key) {
                                UNUSED(key);
                                // Hier kann man Keys 'unsichtbar' machen...
                                return true;
                            },
        'toString'        : function() {
                                let retStr = this.setLabel + " = {  // " + __DBMOD.Name + " / " + __DBMAN.Name + '\n';

                                for (const [ __KEY, __OPT ] of Object.entries(this)) {
                                    if (this.checkKey(__KEY)) {
                                        const __CONFIG = getOptConfig(__OPT);
                                        const __SHAREDDATA = __CONFIG.SharedData;
                                        const __NAME = getOptName(__OPT);

                                        // Bei __SHAREDDATA unbedingt zyklische Referenzen vermeiden!
                                        // Daher nur die ObjRef anzeigen, ansonsten den gesetzten Wert...
                                        const __VAL = getValue(__SHAREDDATA, getOptValue(__OPT));
                                        const __OUT = [
                                                          __LOG.info(__VAL, true),
                                                          __LOG.info(__KEY, false),
                                                          __LOG.info(__NAME, false),
                                                          getValStr(__CONFIG.FormLabel),
                                                          __LOG.info(__CONFIG.Default, true)
                                            ];

                                        retStr += '\t' + __OUT.join('\t') + '\n';
                                    }
                                }

                                retStr += "}";

                                return retStr;
                            },
        'getOpt'          : function(item, defOpt = { }) {
                                return getOptByName(this, item, defOpt);
                            },
        'getOptValue'     : function(item, defValue = undefined) {
                                return getOptValueByName(this, item, defValue);
                            },
        'setOpt'          : function(item, value, reload = false, onFulfilled = undefined, onRejected = undefined) {
                                return setOptByName(this, item, value, reload, onFulfilled, onRejected);
                            },
        'getNextOpt'      : function(item, defValue = undefined) {
                                return getNextOptByName(this, item, defValue);
                            },
        'setNextOpt'      : function(item, defValue = undefined, reload = false, onFulfilled = undefined, onRejected = undefined) {
                                return setNextOptByName(this, item, defValue, reload, onFulfilled, onRejected);
                            },
        'promptNextOpt'   : function(item, defValue = undefined, reload = false, freeValue = false, selValue = true, minChoice = 3, onFulfilled = undefined, onRejected = undefined) {
                                return promptNextOptByName(this, item, defValue, reload, freeValue, selValue, minChoice, onFulfilled, onRejected);
                            },
        'invalidate'      : async function(force = false, reload = true) {
                                return invalidateOpts(this, force, reload);
                            },
        'load'            : function(force = false) {
                                return loadOptions(this, force);
                            },
        'delete'          : async function(optSelect = undefined, force = false, reset = true) {
                                return deleteOptions(this, optSelect, force, reset);
                            },
        'save'            : async function(optSelect = undefined) {
                                return saveOptions(this, optSelect);
                            },
        'rename'          : async function(optSelect = undefined, renameParam = undefined, renameFun = undefined) {
                                return renameOptions(this, optSelect, renameParam, renameFun);
                            },
        'reset'           : async function(reload = true) {
                                return resetOptions(this, reload);
                            }
    });

// ==================== Ende Abschnitt fuer Klasse Options ====================

// *** EOF ***
