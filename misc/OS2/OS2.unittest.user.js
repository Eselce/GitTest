// ==UserScript==
// @name         OS2.unittest
// @namespace    http://os.ongapo.com/
// @version      0.10+lib
// @copyright    2021+
// @author       Sven Loges (SLC)
// @description  Unittest-Script fuer Online Soccer 2.0
// @include      /^https?://(www\.)?(eselce\.github\.io|raw\.githubusercontent\.com/Eselce)/(OS2\.scripts|GitTest(/master)?/misc/OS2)/test/\S+\.test\.js(\?\S+(&\S+)*)?$/
// @include      /^https?://(www\.)?(eselce\.github\.io|raw\.githubusercontent\.com/Eselce)/(OS2\.scripts|GitTest(/master)?/misc/OS2)/test/lib\.\S+\.test\.js(\?\S+(&\S+)*)?$/
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.registerMenuCommand
// @grant        GM.info
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.log.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.value.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.proto.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.prop.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.mod.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.debug.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.store.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.dom.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.delim.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.path.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.uri.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.type.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.data.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.api.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.db.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.cmd.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.menu.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.label.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.action.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.node.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.run.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.list.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.team.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.page.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.warndraw.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.player.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.column.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.table.js
// _require      https://eselce.github.io/GitTest/misc/OS2/lib/test.mock.gm.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/test.assert.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/test.class.unittest.js
// _require      https://eselce.github.io/GitTest/misc/OS2/test/test.bsp.test.js
// _require      https://eselce.github.io/GitTest/misc/OS2/test/util.log.test.js
// _require      https://eselce.github.io/GitTest/misc/OS2/test/util.store.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

/* eslint no-multi-spaces: "off" */

// ==================== Konfigurations-Abschnitt fuer Optionen ====================

const __LOGLEVEL = 3;

// Moegliche Optionen (hier die Standardwerte editieren oder ueber das Benutzermenu setzen):
const __OPTCONFIG = {
    'loadScript' : {      // Auswahl der Art und Weise, wie das Unit-Test-Script gelesen wird (true = loadScript(), false = eval())
                   'Name'      : "loadScript",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "loadScript() nutzen",
                   'Hotkey'    : 'l',
                   'AltLabel'  : "eval() nutzen",
                   'AltHotkey' : 'e',
                   'FormLabel' : "loadScript() statt eval()"
               },
    'sepStyle' : {        // Stil der Trennlinie
                   'Name'      : "sepStyle",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'Choice'    : [ 'solid', 'hidden', 'dotted', 'dashed', 'double', 'groove', 'ridge',
                                   'inset', 'outset', 'none' ],
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Stil: $",
                   'Hotkey'    : 'l',
                   'FormLabel' : "Stil:|$"
               },
    'sepColor' : {        // Farbe der Trennlinie
                   'Name'      : "sepColor",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'FreeValue' : true,
                   'Choice'    : [ 'white', 'yellow', 'black', 'blue', 'cyan', 'gold', 'grey', 'green',
                                   'lime', 'magenta', 'maroon', 'navy', 'olive', 'orange', 'purple',
                                   'red', 'teal', 'transparent' ],
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Farbe: $",
                   'Hotkey'    : 'F',
                   'FormLabel' : "Farbe:|$"
               },
    'sepWidth' : {        // Dicke der Trennlinie
                   'Name'      : "sepWidth",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'FreeValue' : true,
                   'Choice'    : [ 'thin', 'medium', 'thick' ],
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Dicke: $",
                   'Hotkey'    : 'D',
                   'FormLabel' : "Dicke:|$"
               },
    'reset' : {           // Optionen auf die "Werkseinstellungen" zuruecksetzen
                   'FormPrio'  : undefined,
                   'Name'      : "reset",
                   'Type'      : __OPTTYPES.SI,
                   'Action'    : __OPTACTION.RST,
                   'Label'     : "Standard-Optionen",
                   'Hotkey'    : 'r',
                   'FormLabel' : ""
               },
    'storage' : {         // Browserspeicher fuer die Klicks auf Optionen
                   'FormPrio'  : undefined,
                   'Name'      : "storage",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'Choice'    : Object.keys(__OPTMEM),
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Speicher: $",
                   'Hotkey'    : 'c',
                   'FormLabel' : "Speicher:|$"
               },
    'oldStorage' : {      // Vorheriger Browserspeicher fuer die Klicks auf Optionen
                   'FormPrio'  : undefined,
                   'Name'      : "oldStorage",
                   'Type'      : __OPTTYPES.SD,
                   'PreInit'   : true,
                   'AutoReset' : true,
                   'Hidden'    : true
               },
    'showForm' : {        // Optionen auf der Webseite (true = anzeigen, false = nicht anzeigen)
                   'FormPrio'  : 1,
                   'Name'      : "showForm",
                   'Type'      : __OPTTYPES.SW,
                   'FormType'  : __OPTTYPES.SI,
                   'Permanent' : true,
                   'Default'   : false,
                   'Title'     : "$V Optionen",
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Optionen anzeigen",
                   'Hotkey'    : 'O',
                   'AltTitle'  : "$V schlie\xDFen",
                   'AltLabel'  : "Optionen verbergen",
                   'AltHotkey' : 'O',
                   'FormLabel' : ""
               }
};

// ==================== Ende Konfigurations-Abschnitt fuer Optionen ====================

// ==================== Spezialisierter Abschnitt fuer Optionen ====================

// Gesetzte Optionen (wird von initOptions() angelegt und von loadOptions() gefuellt):
const __OPTSET = { };

// Logging initialisieren mit Loglevel (siehe ganz oben im Konfigurationsabschnitt)...
__LOG.init(window, __LOGLEVEL);

// Behandelt die Optionen und laedt das Benutzermenu
// optConfig: Konfiguration der Optionen
// optSet: Platz fuer die gesetzten Optionen
// optParams: Eventuell notwendige Parameter zur Initialisierung
// 'hideMenu': Optionen werden zwar geladen und genutzt, tauchen aber nicht im Benutzermenu auf
// 'menuAnchor': Startpunkt fuer das Optionsmenu auf der Seite
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// 'formWidth': Anzahl der Elemente pro Zeile
// 'formBreak': Elementnummer des ersten Zeilenumbruchs
// return Promise auf gefuelltes Objekt mit den gesetzten Optionen
function buildOptions(optConfig, optSet = undefined, optParams = { 'hideMenu' : false }) {
    return startOptions(optConfig, optSet).then(optSet => {
                    return showOptions(optSet, optParams);
                }, defaultCatch);
}

// ==================== Ende Abschnitt fuer Optionen ====================

// ==================== Hauptprogramm ====================

function loadScript(url) {
    return new Promise(function(resolve, reject) {
            const __SCRIPT = document.createElement('script');

            __SCRIPT.type = 'text/javascript';
            __SCRIPT.src = url;
            //__SCRIPT.async = true;
            __SCRIPT.defer = true;
            __SCRIPT.onerror = reject;
            __SCRIPT.onload = resolve;

            //document.currentScript.parentNode.insertBefore(__SCRIPT, document.currentScript);
            document.head.appendChild(__SCRIPT);
        });
}

function getScript(url, fun, ...params) {
    return loadScript(url).then(fun(...params),
                                () => {
                                        __LOG[1]("Failed to load", url);
                                    });
}

// Verarbeitet Ansicht "Haupt" (Managerbuero) zur Ermittlung des aktuellen ZATs
function procHaupt() {
    return buildOptions(__OPTCONFIG, __OPTSET, {
//                            'menuAnchor' : getTable(0, 'div'),
                            'hideMenu'   : false,
                            'showForm'   : {
                                               'showForm'             : true
                                           }
                        }).then(async optSet => {
            const __LOADSCRIPT = getOptValue(optSet.loadScript);
            const __EVAL = (__LOADSCRIPT ? "" : document.body.textContent);

            document.body.innerHTML = '';  // Seite leeren

            if (__LOADSCRIPT) {
                return getScript(window.location.href, UnitTest.runAll);
            } else {
                eval(__EVAL);  // Die gerade geladene JS-Datei

                return UnitTest.runAll();
            }
        });
}

(() => {
    (async () => {
        try {
            // URL-Legende:
            // page=0: Hauptseite

            // Verzweige in unterschiedliche Verarbeitungen je nach Wert von page:
            switch (getPageIdFromURL(window.location.href, {
                                                               'haupt.php' : 0  // Hauptseite
                                                           }, 'page')) {
                case 0  : await procHaupt().catch(defaultCatch); break;
                default : await procHaupt().catch(defaultCatch); break;
            }

            return 'OK';
        } catch (ex) {
            return defaultCatch(ex);
        }
    })().then(rc => {
            __LOG[1]('SCRIPT END', __DBMOD.Name, '(' + rc + ')');
        })
})();

// *** EOF ***
