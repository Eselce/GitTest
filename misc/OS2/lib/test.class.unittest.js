// ==UserScript==
// _name         test.class.unittest
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Basisklasse fuer Unit-Tests fuer ein JS-Modul
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse UnitTest ====================

// Basisklasse fuer die Ausfuehrung von Unit-Tests fuer ein JS-Modul
// name: Name des JS-Moduls
// desc: Beschreibung des Moduls
// tests: Objekt mit den Testfunktionen
function UnitTest(name, desc, tests) {
    'use strict';

    this.register(name, desc, tests, this);
}

Class.define(UnitTest, Object, {
                  'register'       : function(name, desc, tests, thisArg) {
                                         const __LIBNAME = (name || "");
                                         const __LIBDESC = (desc || ("UnitTest " + __LIBNAME));
                                         const __THISLIB = (thisArg || this);
                                         const __LIBTESTS = Objects.entries(tests);
                                         const __LIBENTRY = {
                                                             'name' : __LIBNAME,
                                                             'desc' : __LIBDESC,
                                                             'test' : __THISLIB
                                                         };

                                         this.tDefs = [];

                                         if (__LIBTESTS.length) {
                                             for (let entry of __LIBTESTS) {
                                                 const __NAME = entry.key;
                                                 const __TFUN = entry.value;

                                                 this.addTest(__NAME, __TFUN);
                                             }
                                         } else {
                                             this.addTest('NO_TEST', function() { __LOG[0]("No tests available for", __LIBNAME); });
                                         }

                                         __ALLLIBS[__LIBNAME] = __LIBENTRY;
                                     },
                  'addTest'        : function(name, tFun, desc = undefined) {
                                         const __NAME = name;
                                         const __TFUNDOBJ = tFun.description;
                                         const __TFUNDESC = ((typeof __TFUNDOBJ === 'function') ? __TFUNDOBJ() : String(__TFUNDOBJ));
                                         const __DESC = (desc || __TFUNDESC || ("Test " + __NAME));
                                         const __TFUN = (tFun || tFun);  // TODO: Dummy
                                         const __ENTRY = {
                                                             'name' : __NAME,
                                                             'desc' : __DESC,
                                                             'tFun' : __TFUN
                                                         };

                                         this.tDefs.push(__ENTRY);
                                     },
                  'run'            : function(name, desc, thisArg) {
                                         const __TDEFS = this.tDefs;
                                         const __THIS = (thisArg || this);
                                         const __RET = [];

                                         __LOG[0]("Running " + this.tDefs.length + " tests for module '" + name + "': " + desc);

                                         for (let entry of __TDEFS) {
                                             const __NAME = entry.name;
                                             const __DESC = entry.desc;
                                             const __TFUN = entry.tFun;

                                             __LOG[1]("Running test '" + name + "'.'" + __NAME + "' (" + __DESC + ")...");

                                             const __RESULT = __TFUN.call(__THIS);

                                             __RET.push(__RESULT);
                                         }

                                         return __RET;
                                     }
                });

UnitTest.runAll = function(thisArg) {
    for (let testLib of Object.values(__ALLLIBS)) {
        const __NAME = testLib.name;
        const __DESC = testLib.desc;
        const __TEST = testLib.test;
        const __TFUN = __TEST['run'];  // TODO: __TEST.run, aber variabel gehalten!
        const __THIS = (thisArg || this);

        __LOG[0]("Starting tests for module '" + __NAME + "': " + __DESC);
        __ALLRESULTS[__NAME] = __TFUN.call(__THIS, __NAME, __DESC, __THIS);  // eventuell TODO: doppeltes __THIS
        __LOG[1]("Finished tests for module '" + __NAME + "': " + __ALLRESULTS[__NAME]);
    }

    __LOG[0]("Results for all tests:", __ALLRESULTS);

    return __ALLRESULTS;  // TODO: vorlaeufig!
}

const __ALLLIBS = {};
const __ALLRESULTS = {};

const __BSPTESTS = new UnitTest('util.log.js', "Alles rund um das Logging", {
                               'log0'              : function() {
                                                         __LOG[0]("Testausgabe!");

                                                         return true;
                                                     },
                               'safeStringifyZahl' : function() {
                                                         const __RET = safeStringify(42);
                                                         const __EXP = '42';

                                                         return (__RET === __EXP);
                                                     }
                               });

__BSPTESTS.runAll();

// ==================== Ende Abschnitt fuer Klasse UnitTest ====================

// *** EOF ***