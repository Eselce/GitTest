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
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
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
                    'checkKey' : function(key) {
                        // Hier kann man Keys 'unsichtbar' machen...
                        return true;
                    },
                    'toString' : function() {
                        let retStr = this.setLabel + " = {\n";

                        for (const [ __KEY, __OPT ] of Object.entries(this)) {
                            if (this.checkKey(__KEY)) {
                                const __CONFIG = getOptConfig(__OPT);
                                const __NAME = getOptName(__OPT);
                                const __VAL = getOptValue(__OPT);
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
                    }
                });

// ==================== Ende Abschnitt fuer Klasse Options ====================

// *** EOF ***
