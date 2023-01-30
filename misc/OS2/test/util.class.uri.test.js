// ==UserScript==
// _name         util.class.uri.test
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2023+
// _author       Sven Loges (SLC)
// _description  Unit-Tests JS-lib mit Funktionen und Utilities fuer Details zu Objekten, Arrays, etc.
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.delim.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.path.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.uri.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/test/util.class.uri.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Unit-Tests zu util.class.uri ====================

(() => {

// ==================== Abschnitt fuer diverse Utilities fuer URLs etc. ====================

    const __TESTDATA = {
            'formatParamsUnform'    : [ { "saison" : 19, "ZAT" : 15 },  ' ',    '=',    "saison=19 ZAT=15",         'string'    ],
            'formatParamsString'    : [ { "saison" : 19, "ZAT" : 15 },  ' ',    '=',    'saison="19" ZAT="15"',     'string'    ],
            'formatParamsObjForm'   : [ { "saison" : 19, "ZAT" : 15 },  ', ',   ' : ',  "saison : 19, ZAT : 15",    'string'    ],
            'formatParamsEmpty'     : [ null,                           ' ',    '=',    "",                         'string'    ],
        };

    new UnitTest('util.class.uri.js', "Klasse URI fuer URLs etc.", {
//               'setDelims'         : function() {
//               'setSchemeDelim'    : function(schemeDelim = undefined) {
//               'setQueryDelim'     : function(queryDelim = undefined) {
//               'setParSepDelim'    : function(parSepDelim = undefined) {
//               'setParAssDelim'    : function(parAssDelim = undefined) {
//               'setNodeDelim'      : function(nodeDelim = undefined) {
//               'getServerPath'     : function(path = undefined) {
//               'getHostPort'       : function(path = undefined) {
//               'stripHostPort'     : function(path = undefined) {
//               'getSchemePrefix'   : function(path = undefined) {
//               'stripSchemePrefix' : function(path = undefined) {
//               'getNodeSuffix'     : function(path = undefined) {
//               'stripNodeSuffix'   : function(path = undefined) {
//               'getQueryString'    : function(path = undefined) {
//               'stripQueryString'  : function(path = undefined) {

            'formatParamsUnform'              : function() {
                                                    const [ __VAL, __DLM, __ASS, __EXP, __TYPE ] = __TESTDATA['formatParamsUnform'];
                                                    const __FORMATFUN = undefined;
                                                    const __RET = URI.prototype.formatParams(__VAL, __FORMATFUN, __DLM, __ASS);

                                                    ASSERT_EQUAL(__RET, __EXP, "formatParams() muss String zur\u00FCckgeben");

                                                    return ASSERT_TYPEOF(__RET, __TYPE, "formatParams() muss String zur\u00FCckgeben");
                                                },
            'formatParamsString'              : function() {
                                                    const [ __VAL, __DLM, __ASS, __EXP, __TYPE ] = __TESTDATA['formatParamsString'];
                                                    const __FORMATFUN = function(value) {
                                                                            return '"' + value + '"';
                                                                        };
                                                    const __RET = URI.prototype.formatParams(__VAL, __FORMATFUN, __DLM, __ASS);

                                                    ASSERT_EQUAL(__RET, __EXP, "formatParams() muss String zur\u00FCckgeben");

                                                    return ASSERT_TYPEOF(__RET, __TYPE, "formatParams() muss String zur\u00FCckgeben");
                                                },
            'formatParamsObjForm'             : function() {
                                                    const [ __VAL, __DLM, __ASS, __EXP, __TYPE ] = __TESTDATA['formatParamsObjForm'];
                                                    const __FORMATFUN = sameValue;
                                                    const __RET = URI.prototype.formatParams(__VAL, __FORMATFUN, __DLM, __ASS);

                                                    ASSERT_EQUAL(__RET, __EXP, "formatParams() muss String zur\u00FCckgeben");

                                                    return ASSERT_TYPEOF(__RET, __TYPE, "formatParams() muss String zur\u00FCckgeben");
                                                },
            'formatParamsEmpty'               : function() {
                                                    const [ __VAL, __DLM, __ASS, __EXP, __TYPE ] = __TESTDATA['formatParamsEmpty'];
                                                    const __FORMATFUN = sameValue;
                                                    const __RET = URI.prototype.formatParams(__VAL, __FORMATFUN, __DLM, __ASS);

                                                    ASSERT_EQUAL(__RET, __EXP, "formatParams() muss String zur\u00FCckgeben");

                                                    return ASSERT_TYPEOF(__RET, __TYPE, "formatParams() muss String zur\u00FCckgeben");
                                                },

//               'parseParams'       : function(params, parseFun, delim = ' ', assign = '=') {
//               'rawValue'          : function(value) {
//               'parseValue'        : function(value) {
//               'getQuery'          : function(delims = { }) {
//               'parseQuery'        : function(path = undefined, delims = { }) {
//               'setQuery'          : function(query) {
//               'setQueryPar'       : function(key, value) {
//               'getPath'           : function(dirs = undefined, delims = undefined) {
//               'getDirs'           : function(path = undefined, delims) {
        });

// ==================== Ende Abschnitt fuer diverse Utilities fuer URLs etc. ====================

})();

// ==================== Ende Abschnitt fuer Unit-Tests zu util.class.uri ====================

// *** EOF ***
