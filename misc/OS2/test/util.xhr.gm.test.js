// ==UserScript==
// _name         util.xhr.gm.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer GM XHR-Aufrufe
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.xhr.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.xhr.gm.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.lib.option.js
// _require      https://eselce.github.io/OS2.scripts/test/util.xhr.gm.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.xhr.gm ====================

(() => {

// ==================== Abschnitt Versuch eines Verbindungsaufbaus ====================

    const __THIS = __GM_XHR;
    const __LABEL = "[GM_XHR] ";

    const __TESTFUNS = [
            'browse',
            'getRequest',
            'putRequest',
            'postRequest',
            'headRequest',
            'xmlRequest',
            'registerCallback',
            '__XMLREQUEST'
        ];

    const __TESTDATA = {
            'browseXML'     : [ "https://eselce.github.io/GitTest/misc/OS2/lib/util.xhr.js",                    /^\/\/ ==UserScript==([^]*)\n+\/\/ _name         util\.xhr$/m  ],
            'browseXMLCORS' : [ "https://os.ongapo.com/spv.php?action=getListByName&term=Volodimir Oleynikov",  /.*/    ]
        };

    new UnitTestOption('util.xhr.gm.js', "Schnittstelle zum GM Verbindungsaufbau", {
            'handlerExists'       : function() {
                                        return ASSERT_SET(__THIS, __LABEL + "Handler nicht gefunden");
                                    },
            'memberFuns'          : function() {
                                        for (let testFun of __TESTFUNS) {
                                            const __TESTFUN = __THIS[testFun];

                                            ASSERT_SET(__TESTFUN, __LABEL + "Methode " + __LOG.info(testFun, false) + " nicht gefunden");

                                            return ASSERT_TYPEOF(__TESTFUN, 'function', __LABEL + "Methode " + __LOG.info(testFun, false) + " ist keine Funktion");
                                        }
                                    },
            'browseXML'           : function() {
                                        const [ __URL, __EXP ] = __TESTDATA['browseXML'];

                                        ASSERT_SET(__THIS.browse, __LABEL + "Methode 'browse' nicht gefunden");
                                        ASSERT_TYPEOF(__THIS.browse, 'function', __LABEL + "Methode 'browse' ist keine Funktion");

                                        return callPromiseChain(__THIS.browse(__URL), doc => {
                                                const __RET = doc;

                                                return ASSERT_MATCH(__RET, __EXP, "browseXML() sollte XML-Daten liefern");
                                            });
                                    },
            'browseXMLonload'     : function() {
                                        const [ __URL, __EXP ] = __TESTDATA['browseXML'];

                                        ASSERT_SET(__THIS.browse, __LABEL + "Methode 'browse' nicht gefunden");
                                        ASSERT_TYPEOF(__THIS.browse, 'function', __LABEL + "Methode 'browse' ist keine Funktion");

                                        return new Promise(function(resolve, reject) {
                                                return __THIS.browse(__URL, null, request => {
                                                        try {
                                                            const __DOC = request.response;
                                                            const __RET = request.responseText;

                                                            ASSERT_MATCH(__DOC, __EXP, "browseXMLonload() response sollte XML-Daten liefern");

                                                            ASSERT_MATCH(__RET, __EXP, "browseXMLonload() responseText sollte XML-Daten liefern");

                                                            return resolve(true);
                                                        } catch (ex) {
                                                            return reject(ex);
                                                        }
                                                        // NOTE Unreachable...
                                                    }).catch(reject);
                                            });
                                    },
            'browseXMLCORS'       : function() {
                                        const [ __URL, __EXP ] = __TESTDATA['browseXMLCORS'];

                                        ASSERT_SET(__THIS.browse, __LABEL + "Methode 'browse' nicht gefunden");
                                        ASSERT_TYPEOF(__THIS.browse, 'function', __LABEL + "Methode 'browse' ist keine Funktion");

                                        return callPromiseChain(__THIS.browse(__URL), doc => {
                                                const __RET = doc;

                                                return ASSERT_EQUAL(__RET, __EXP, "browseXMLCORS() sollte XML-Daten liefern");
                                            });
                                    },
            'browseXMLCORSonload' : function() {
                                        const [ __URL, __EXP ] = __TESTDATA['browseXMLCORS'];

                                        ASSERT_SET(__THIS.browse, __LABEL + "Methode 'browse' nicht gefunden");
                                        ASSERT_TYPEOF(__THIS.browse, 'function', __LABEL + "Methode 'browse' ist keine Funktion");

                                        return new Promise(function(resolve, reject) {
                                                return __THIS.browse(__URL, null, request => {
                                                        try {
                                                            const __DOC = request.response;
                                                            const __RET = request.responseText;

                                                            ASSERT_MATCH(__DOC, __EXP, "browseXMLCORSonload() response sollte XML-Daten liefern");

                                                            ASSERT_MATCH(__RET, __EXP, "browseXMLCORSonload() responseText sollte XML-Daten liefern");

                                                            return resolve(true);
                                                        } catch (ex) {
                                                            return reject(ex);
                                                        }
                                                        // NOTE Unreachable...
                                                    }).catch(reject);
                                            });
                                    }
        });

// ==================== Ende Abschnitt Versuch eines Verbindungsaufbaus ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.xhr.gm ====================

// *** EOF ***
