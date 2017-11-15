// ==UserScript==
// @name         xhr.test
// @namespace    http://wiki.greasespot.net/
// @version      0.10
// @copyright    2017+
// @author       Sven Loges (SLC)
// @description  XMR-Test-Script for Greasemonkey 4.0
// @include      /^https?://wiki\.greasespot\.net/Main_Page(\?\S+(&\S+)*)?(#\S+)?$/
// @grant        GM.xmlHttpRequest
// _require      https://arantius.com/misc/greasemonkey/imports/greasemonkey4-polyfill.js (buggy!)
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM_xmlhttpRequest
// @require      https://eselce.github.io/GitTest/misc/xhr-test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

(() => {
    const __URL = "https://wiki.greasespot.net/Greasemonkey_Manual";

    __XHR.browse(__URL).then(doc => {
            console.log("Received:", doc);

            if (doc && doc.response) {
                // Tampermonkey may return response object...
                console.log("Document:", doc.responseXML);
                console.log("Response:", doc.response);
            }
        }, error => {
            console.error("Error:", error);
        });
})();

// *** EOF ***
