// ==UserScript==
// @name         xhr.test
// @namespace    http://wiki.greasespot.net/
// @version      0.10
// @copyright    2017+
// @author       Sven Loges (SLC)
// @description  XMR-Test-Script for Greasemonkey 4.0
// @include      /^https?://wiki\.greasespot\.net/Main_Page(#\S+)?(\?\S+(&\S+)*)?$/
// @require      https://eselce.github.io/GitTest/misc/xhr-test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

(() => {
    const __URL = "https://wiki.greasespot.net/Greasemonkey_Manual";

    __XHR.browse(__URL).then(doc => {
            console.error("Received:", doc);
        }, error => {
            console.error("Error:", error);
        });
})();

// *** EOF ***
