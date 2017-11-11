// ==UserScript==
// @name         xhr.test
// @namespace    http://wiki.greasespot.net/
// @version      0.10
// @copyright    2017+
// @author       Sven Loges (SLC)
// @description  XMR-Test-Script fuer Greasemonkey 4.0
// @include      /^https?://wiki\.greasespot\.net/Main_Page(#\S+)?(\?\S+(&\S+)*)?$/
// @grant        GM.xmlHttpRequest
// @require      https://arantius.com/misc/greasemonkey/imports/greasemonkey4-polyfill.js
// @grant        GM_xmlhttpRequest
// @require      https://eselce.github.io/GitTest/misc/xhr-test.js
// ==/UserScript==

// ECMAScript 6: Erlaubt 'const', 'let', ...
/* jshint esnext: true */
/* jshint moz: true */

((url) => {
    xhrTest.browse(url).then(result => {
            console.error(result);

            return Promise.resolve('OK');
        }, ex => {
            console.error("Error:", ex);

            return Promise.reject(ex);
        });
})("https://wiki.greasespot.net/Greasemonkey_Manual");

// *** EOF ***
