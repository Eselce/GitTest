// ==UserScript==
// _name         test.bsp.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  Einfache Beispiele fuer Unit-Tests
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/test.bsp.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests test.bsp ====================

(() => {

// ==================== Abschnitt fuer Beispiel-Tests ====================

    const __BSPTESTS = new UnitTest('util.log.js', "Alles rund um das Logging", {
            'log0'                : function() {
                                        __LOG[4]("Testausgabe!");

                                        return true;
                                    },
            'safeStringifyZahl'   : function() {
                                        const __RET = safeStringify(42);
                                        const __EXP = '42';

                                        return ASSERT_EQUAL(__RET, __EXP, "Nicht die Antwort auf alles!");
                                    },
            'safeStringifyFail'   : function() {
                                        const __RET = safeStringify(42);
                                        const __EXP = 42;

                                        return ASSERT_EQUAL(__RET, __EXP, "Absichtlich eingebauter Typfehler!");
                                    },
            'safeStringifyLike'   : function() {
                                        const __RET = safeStringify(42);
                                        const __EXP = 42;

                                        return ASSERT_ALIKE(__RET, __EXP, "Trotz der Gemeinsamkeiten nicht erkannt!");
                                    }
        });

    const __BSPTESTSLEER = new UnitTest('empty.js', "Leere UnitTest-Klasse", { });

    const __BSPTESTSUNDEFINED = new UnitTest('undefined.js', "Fehlende Tests", null);

// ==================== Ende Abschnitt fuer Beispiel-Tests ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests test.bsp ====================

// *** EOF ***
