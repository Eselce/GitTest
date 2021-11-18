// ==UserScript==
// @name         OS2.unittest
// @namespace    http://os.ongapo.com/
// @version      0.10+lib
// @copyright    2021+
// @author       Sven Loges (SLC)
// @description  Unittest-Script fuer Online Soccer 2.0
// @include      /^https?://(www\.)?(eselce\.github\.io|raw\.githubusercontent\.com/Eselce)/(OS2\.scripts|GitTest(/master)?/misc/OS2)/test/\S+\.test\.js(\?\w+=?\w+(&\w+=?\w+)*)?(#\w+)?$/
// @include      /^https?://(www\.)?(eselce\.github\.io|raw\.githubusercontent\.com/Eselce)/(OS2\.scripts|GitTest(/master)?/misc/OS2)/test/lib\.\S+\.test\.js(\?\w+=?\w+(&\w+=?\w+)*)?(#\w+)?$/
// @include      /^file:///\w:(/\S+)*/GitHub/GitTest/misc/OS2/test/\S+\.test\.js(\?\w+=?\w+(&\w+=?\w+)*)?(#\w+)?$/
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
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.object.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.value.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.proto.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.prop.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.sys.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.mod.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.debug.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.store.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.dom.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.script.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.delim.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.path.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.uri.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.type.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.data.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.class.options.js
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
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.main.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.list.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.team.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.page.team.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.page.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.zat.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.warndraw.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.player.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.column.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.table.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/test.assert.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/test.class.unittest.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/test.lib.option.js
// _require      https://eselce.github.io/GitTest/misc/OS2/test/test.assert.test.js
// _require      https://eselce.github.io/GitTest/misc/OS2/test/test.bsp.test.js
// _require      https://eselce.github.io/GitTest/misc/OS2/test/util.log.test.js
// _require      https://eselce.github.io/GitTest/misc/OS2/test/util.store.test.js
// _require      https://eselce.github.io/GitTest/misc/OS2/test/util.option.api.test.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

/* eslint no-multi-spaces: "off" */

// ==================== Konfigurations-Abschnitt fuer Optionen ====================

const __LOGLEVEL = 9;

// Moegliche Optionen (hier die Standardwerte editieren oder ueber das Benutzermenu setzen):
const __OPTCONFIG = {
    'minLevel' : {        // Minimal angezeigter Fehlerlevel: 0 = alle, 1 = ab FAILED, 2 = ab Exception, 3 = ab Error, 4 = nur Summen
                   'Name'      : "minLevel",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : false,
                   'SelValue'  : false,
                   'Choice'    : [ 0, 1, 2, 3, 4 ],
                   'Default'   : 1,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Min. Level: $",
                   'Hotkey'    : 'L',
                   'FormLabel' : "Min. Level:|$"
               },
    'loadScript' : {      // Auswahl der Art und Weise, wie das Unit-Test-Script gelesen wird (true = loadScript(), false = eval())
                   'Name'      : "loadScript",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : false,
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

// Logging initialisieren mit Loglevel (siehe ganz oben im Konfigurationsabschnitt)...
__LOG.init(window, __LOGLEVEL);

// ==================== Ende Abschnitt fuer Optionen ====================

// ==================== Page-Manager fuer zu bearbeitende Seiten ====================

// Verarbeitet Ansicht "Unit-Test Quellcode" zur Ausfuehrung der UnitTests dieser Datei
const procHaupt = new PageManager("Unit-Test Quellcode", null, () => {
        return {
//                'menuAnchor'  : getTable(0, 'div'),
                'hideMenu'    : false,
                'showForm'    : true
            };
    }, async optSet => {
        const __MINLEVEL = optSet.getOptValue('minLevel');
        const __LOADSCRIPT = optSet.getOptValue('loadScript');
        const __EVAL = (__LOADSCRIPT ? "" : document.body.textContent);

        document.body.innerHTML = '';  // Seite leeren

        if (__LOADSCRIPT) {
            return await getScript(window.location.href, UnitTest.runAll, __MINLEVEL);
        } else {
            eval(__EVAL);  // Die gerade geladene JS-Datei

            return await UnitTest.runAll(__MINLEVEL);
        }
    });

// ==================== Ende Page-Manager fuer zu bearbeitende Seiten ====================

// ==================== Hauptprogramm ====================

const __MAIN = new Main(__OPTCONFIG, null, procHaupt);

__MAIN.run();

// ==================== Ende Hauptprogramm ====================

// *** EOF ***
