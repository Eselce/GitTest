// ==UserScript==
// @name         resource.test
// @namespace    https://github.com/Eselce/GitTest
// @version      0.10
// @copyright    2017+
// @author       Sven Loges (SLC)
// @description  Test Laden von Ressourcen 
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/rep/saison/\d+/\d+/\d+-\d+.html$/
// @grant        GM.getResourceUrl
// GM 4.0 only!
// _require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// _grant        GM_getResourceURL
// @resource PAS ../img/pass.png
// @resource SCH ../img/sch.png
// @resource TOR ../img/tor.png
// @resource ZWK ../img/zwk.png
// @grant        none
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

(() => {
    // Laedt in ein Element eine IMG-Resource ueber den Namen
    // node: Zu belegendes Element
    // altText: Text, wenn Icon nicht geladen werden konnte
    // height: Hoehe des Icons in Pixel
    // width: Breite des Icons in Pixel
    // return Die IMG-Resource, die asynchron gefuellt wird
    function addIcon(node, iconName, altText = `${iconName}`, height = 32, width = 32) {
        const __IMG = document.createElement('img');

        GM.getResourceUrl(iconName).then(src => {
                console.log(`Got icon ${iconName}`);

                __IMG.src = src;
                __IMG.heigth = height;
                __IMG.width = width;
                node.appendChild(__IMG);
            }).catch(error => {
                console.error(`Failed to load icon ${iconName}:`, error);

                node.innerHTML = node.innerHTML + altText;
            });

        return __IMG;
    }

    const __TARGET = document.body;
    const __PAS = addIcon(__TARGET, 'PAS');
    const __SCH = addIcon(__TARGET, 'SCH');
    const __TOR = addIcon(__TARGET, 'TOR');
    const __ZWK = addIcon(__TARGET, 'ZWK');

    console.error(__TARGET);
})();

// *** EOF ***
