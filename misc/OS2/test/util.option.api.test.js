// ==UserScript==
// _name         util.option.api.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Zugriff auf die Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.lib.option.js
// _require      https://eselce.github.io/OS2.scripts/test/util.option.api.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.option.api ====================

(() => {

// ==================== Abschnitt Operationen auf Optionen ====================

    const __TESTDATA = {
            'prefixName'    : [ "Name",     "Prefix",   "PrefixName"                        ],
            'postfixName'   : [ "Name",     "Postfix",  "NamePostfix"                       ],
            'loadOption'    : [ "saison",   42,         18,             false,  undefined   ]
        };

    new UnitTestOption('util.option.api.js', "Schnittstelle zur Behandlung von Optionen", {
            'loadOption'          : function() {
                                        const [ __NAME, , __EXP ] = __TESTDATA['loadOption'];
                                        const __OPT = this.optSet[__NAME];

                                        return callPromiseChain(invalidateOpt(__OPT, true, false), () => loadOption(__OPT, false), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "loadOption($[" + __LOG.info(__NAME, false) + "]) sollte die aktuelle Saison liefern");
                                            });
                                    },
            'loadOptionForce'     : function() {
                                        const [ __NAME, , __EXP ] = __TESTDATA['loadOption'];
                                        const __OPT = this.optSet[__NAME];

                                        return callPromiseChain(invalidateOpt(__OPT, true, false), () => loadOption(__OPT, true), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "loadOption($[" + __LOG.info(__NAME, false) + "]) sollte die aktuelle Saison liefern");
                                            });
                                    },
            'prefixName'          : function() {
                                        const [ __NAME, __PREFIX, __EXP ] = __TESTDATA['prefixName'];

                                        const __RET = prefixName(__NAME, __PREFIX);

                                        return ASSERT_EQUAL(__RET, __EXP, "Name falsch zusammengesetzt");
                                    },
            'postfixName'         : function() {
                                        const [ __NAME, __POSTFIX, __EXP ] = __TESTDATA['postfixName'];

                                        const __RET = postfixName(__NAME, __POSTFIX);

                                        return ASSERT_EQUAL(__RET, __EXP, "Name falsch zusammengesetzt");
                                    },
            'resetOptions'        : async function() {
                                        const [ __NAME, __VAL, __EXP, __RELOAD ] = __TESTDATA['loadOption'];
                                        const __OPT = this.optSet[__NAME];

                                        await callPromiseChain(new Promise(function(resolve, reject) { return setOpt(__OPT, __VAL, __RELOAD, resolve, reject); }), () => getOptValue(__OPT), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __VAL, "getOptValue($[" + __LOG.info(__NAME, false) + "]) sollte die gesetzte Saison liefern");
                                            });

                                        return callPromiseChain(resetOptions(this.optSet, __RELOAD), () => getOptValue(__OPT), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "getOptValue($[" + __LOG.info(__NAME, false) + "]) sollte die Default-Saison liefern");
                                            });
                                    },
            'loadOptValue'        : function() {
                                        const [ __NAME, , __EXP ] = __TESTDATA['loadOption'];
                                        const __OPT = this.optSet[__NAME];

                                        return callPromiseChain(loadOptValue(__OPT), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "loadOption($[" + __LOG.info(__NAME, false) + "]) sollte die aktuelle Saison liefern");
                                            });
                                    },
            'loadOptValueDefault' : function() {
                                        const [ __NAME, , __EXP, __RELOAD, __ALT ] = __TESTDATA['loadOption'];
                                        const __OPT = this.optSet[__NAME];

                                        return callPromiseChain(new Promise(function(resolve, reject) { return setOpt(__OPT, __ALT, __RELOAD, resolve, reject); }), () => loadOptValue(__OPT, __EXP), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "loadOption($[" + __LOG.info(__NAME, false) + "]) sollte die aktuelle Saison liefern");
                                            });
                                    },
            'loadOptValueSync'    : function() {
                                        const [ __NAME, , __EXP, , __ALT ] = __TESTDATA['loadOption'];
                                        const __ASYNC = false;
                                        const __OPT = this.optSet[__NAME];

                                        return callPromiseChain(Promise.resolve(loadOptValue(__OPT, __ALT, __ASYNC)), value => {
                                                const __RET = value;

                                                return ASSERT_EQUAL(__RET, __EXP, "loadOption($[" + __LOG.info(__NAME, false) + "]) sollte die aktuelle Saison liefern");
                                            });
                                    }
        });

//function invalidateOpt(opt, force = false, reload = true) {
//async function invalidateOpts(optSet, force = false, reload = true) {
//function loadOption(opt, force = false) {
//function loadOptions(optSet, force = false) {
//function deleteOption(opt, force = false, reset = true) {
//async function deleteOptions(optSet, optSelect = undefined, force = false, reset = true) {
//function saveOption(opt) {
//async function saveOptions(optSet, optSelect = undefined) {
//async function renameOption(opt, name, reload = false, force = false) {
//function prefixName(name, prefix) {
//function postfixName(name, postfix) {
//async function renameOptions(optSet, optSelect, renameParam = undefined, renameFun = prefixName) {
//async function resetOptions(optSet, reload = true) {
//function loadOptValue(opt, defValue = undefined, asyncLoad = true, force = false) {

// ==================== Ende Abschnitt Operationen auf Optionen ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.option.api ====================

// *** EOF ***
