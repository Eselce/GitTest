// ==UserScript==
// @name         gm4-polyfill.test
// @namespace    http://wiki.greasespot.net/
// @version      0.10
// @copyright    2017+
// @author       Sven Loges (SLC)
// @description  RMC-Test-Script for gm4-polyfill and Greasemonkey 4.0
// @include      /^https?://wiki\.greasespot\.net/Greasemonkey_Manual(#\S+)?(\?\S+(&\S+)*)?$/
// @grant        GM.registerMenuCommand
// @require      https://eselce.github.io/GitTest/misc/gm4-polyfill-test.js
// @grant        GM_registerMenuCommand
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

(() => {
    function registerMenuCommandSync(text, fun, key) {
        console.error('registerMenuCommandSync("' + text + '", ' + fun + ", '" + key + "')");

        return GM_registerMenuCommand(text, fun, key);
    }

    function registerVerboseSync(text, fun, key) {
        console.error('registerVerboseSync("' + text + '", ' + fun + ", '" + key + "')");

        return GM_registerMenuCommand(text, fun, key);
    }

    async function registerMenuCommand(text, fun, key) {
        console.error('registerMenuCommand("' + text + '", ' + fun + ", '" + key + "')");

        return await GM.registerMenuCommand(text, fun, key);
    }

    async function registerVerbose(text, fun, key) {
        console.error('registerVerbose("' + text + '", ' + fun + ", '" + key + "')");

        return await GM.registerMenuCommand(text, fun, key);
    }

    // ==================== Hauptprogramm ====================

    function procMain() {
        let prom = Promise.resolve();

        Object.entries({
            'Eins' : 1,
            'Zwei' : 4,
            'Drei' : 9,
            'Vier' : 16,
            'Fuenf' : 25
        }).forEach(([oldKey, newKey]) => {
            prom.then(res => registerVerbose(oldKey, () => {
                console.error(oldKey + " hoch 2 ist " + newKey);
            }, oldKey.substr(0, 1)));
        });

        Object.entries({
            'Eins' : 1,
            'Zwei' : 4,
            'Drei' : 9,
            'Vier' : 16,
            'Fuenf' : 25
        }).forEach(([oldKey, newKey]) => {
            prom.then(res => registerVerbose('Alt-' + oldKey, () => {
                console.error(oldKey + " hoch 2 ist " + newKey);
            }, oldKey.substr(1, 1)));
        });

        prom.then(res => console.log('DONE');
    }

    procMain();
})();

// *** EOF ***