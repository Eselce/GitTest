// ==UserScript==
// _name         test.lib.option
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Basisklasse fuer Unit-Tests fuer ein JS-Modul
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/lib.option.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.lib.option.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse UnitTestOption ====================

// Spezialisierte Klasse fuer die Ausfuehrung von Unit-Tests fuer Optionen
// name: Name des JS-Moduls
// desc: Beschreibung des Moduls
// tests: Objekt mit den Testfunktionen
// load: Angabe, ob die Tests geladen werden sollen (false: Test nicht laden)
function UnitTestOption(name, desc, tests, load) {
    'use strict';

    this.register(name, desc, tests, load, this);
}

Class.define(UnitTestOption, UnitTest, {
            'prepare'     : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
                                __LOG[1]("prepare()", name, desc);
                                return true;
                            },
            'cleanup'     : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
                                __LOG[1]("cleanup()", name, desc);
                                return true;
                            },
            'setup'       : async function(name, desc, testFun, thisArg) {
                                __LOG[1]("setup()", name, desc, testFun, thisArg);
                                return true;
                            },
            'teardown'    : async function(name, desc, testFun, thisArg) {
                                __LOG[1]("teardown()", name, desc, testFun, thisArg);
                                return true;
                            }
        });

// ==================== Ende Abschnitt fuer Klasse UnitTestOption ====================

// *** EOF ***
