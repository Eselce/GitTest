// ==UserScript==
// @name         YT.info
// @namespace    http://youtube.com/
// @version      0.10+lib
// @copyright    2025+
// @author       Sven Loges (SLC)
// @description  YouTube-Info-Script for Greasemonkey 4.0
// @include      /^https?://www\.youtube\.com/watch\?v=(\S+)(&\w+=?[+\w]+)*(#\w+)?$/
// @include      /^https?://youtu\.be/(\S+)\?v=(\S+)(\?\w+=?[+\w]+)*(#\w+)?(&\w+=?[+\w]+)*(#\w+)?$/
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
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/lib.all.js
// ==/UserScript==

// ECMAScript 9:
/* jshint esversion: 9 */

/* eslint no-multi-spaces: "off" */

// ==================== Konfigurations-Abschnitt fuer Optionen ====================

const __LOGLEVEL = 4;

// Moegliche Optionen (hier die Standardwerte editieren oder ueber das Benutzermenu setzen):
const __OPTCONFIG = {
    'reset' : {           // Optionen auf die "Werkseinstellungen" zuruecksetzen
                   'FormPrio'  : undefined,
                   'Name'      : "reset",
                   'Type'      : __OPTTYPES.SI,
                   'Action'    : __OPTACTION.RST,
                   'Label'     : "Standard-Optionen",
                   'Hotkey'    : 'O',
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
                   'ValType'   : 'String',
                   'PreInit'   : true,
                   'AutoReset' : true,
                   'Hidden'    : true
               },
    'showForm' : {        // Optionen auf der Webseite (true = anzeigen, false = nicht anzeigen)
                   'FormPrio'  : undefined,
                   'Name'      : "showForm",
                   'Type'      : __OPTTYPES.SW,
                   'FormType'  : __OPTTYPES.SI,
                   'Permanent' : true,
                   'Default'   : false,
                   'Title'     : "$V Optionen",
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Optionen anzeigen",
                   'Hotkey'    : 'a',
                   'AltTitle'  : "$V schlie\u00DFen",
                   'AltLabel'  : "Optionen verbergen",
                   'AltHotkey' : 'v',
                   'FormLabel' : ""
               }
};

// ==================== Ende Konfigurations-Abschnitt fuer Optionen ====================

// ==================== Page-Manager fuer Infos zum Video ====================

// Verarbeitet Ansicht "Video abspielen"
const procVideo = new PageManager("Video", null, () => {

        return {
                'menuAnchor'  : getElement('DIV'),
                'hideForm'    : {
                                    'team'  : true
                                },
                'formWidth'   : 3,
                'formBreak'   : 4
            };
    }, async optSet => {
        const __PLAYERWRAP = getElement('DIV#player');

        if (! __PLAYERWRAP) {
            __LOG[1]("Kein Player vorhanden!");
            return false;
        }

        const __URI = new URI(window.location.href);
        const __VID = getValue(__URI.getQueryPar('v'), '#NV');
        const __TITLE = getValue(getValue(getElement('div#above-the-fold div#title'), { }).textContent, '#NV').trim();
        const __UPLOADINFO = getValue(getValue(getElement('div#upload-info'), { }).outerText, '#NV\n#NV').split('\n');
        const __INFO = getValue(getValue(getElement('div#info-container yt-formatted-string#info'), { }).textContent, '#NV');
        const __VIEWCOUNT = getValue(getElement('div#info-container div[aria-label]#view-count'), { 'attributes' : { 'aria-label' : { 'nodeValue' : '#NV' }} }).attributes['aria-label'].nodeValue.trim();
        const __DESCRIPTION = getValue(getValue(getElement('ytd-text-inline-expander#description-inline-expander'), { }).textContent, '#NV');

        const __INSERT = "INSERT INTO Youtube('VID', 'TITLE', 'VIEWS', 'DESCRIPTION') VALUES ('" + __VID + "', '" + __TITLE + "', " + __VIEWCOUNT + ", '" + __DESCRIPTION + "')";
        const __VALUE = true;
        const __LABEL = __INSERT;
        const __ACTION = (() => showException("YT.info for " + __VID, __INSERT));
        const __HOTKEY = 'I';
        const __HIDDEN = false;
        const __SERIAL = true;

        __LOG[0]("TITLE:", __TITLE);
        __LOG[0]("UPLOADINFO:", __UPLOADINFO);
        __LOG[0]("INFO:", __INFO);
        __LOG[0]("VIEWCOUNT:", __VIEWCOUNT);
        __LOG[0]("DESCRIPTION:", __DESCRIPTION);

        __LOG[1](__INSERT);

        return registerDataOption(__VALUE, __LABEL, __ACTION, __HOTKEY, __HIDDEN, __SERIAL);
//        return true;
    });

// ==================== Ende Page-Manager fuer Infos zum Video ====================

// ==================== Page-Manager fuer Infos zur Suche ====================

// Verarbeitet Ansicht "Videos suchen"
const procSearch = new PageManager("Search", null, () => {

        return {
                'menuAnchor'  : getElement('DIV'),
                'hideForm'    : {
                                    'team'  : true
                                },
                'formWidth'   : 3,
                'formBreak'   : 4
            };
    }, async optSet => {
        const __ROWS = getRows('FORM+TABLE');  // #2: Tabelle direkt hinter der Saisonauswahl

        if (! __ROWS) {
            __LOG[1]("Kein Spielplan vorhanden!");
            return false;
        }

        return true;
    });

// ==================== Ende Page-Manager fuer Infos zur Suche ====================

// ==================== Spezialbehandlung der Startparameter ====================

// Callback-Funktion fuer die Behandlung der Optionen und Laden des Benutzermenus
// Diese Funktion erledigt nur Modifikationen und kann z.B. einfach optSet zurueckgeben!
// optSet: Platz fuer die gesetzten Optionen
// optParams: Eventuell notwendige Parameter zur Initialisierung
// 'hideMenu': Optionen werden zwar geladen und genutzt, tauchen aber nicht im Benutzermenu auf
// 'menuAnchor': Startpunkt fuer das Optionsmenu auf der Seite
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// 'formWidth': Anzahl der Elemente pro Zeile
// 'formBreak': Elementnummer des ersten Zeilenumbruchs
// return Gefuelltes Objekt mit den gesetzten Optionen
function prepareOptions(optSet, optParams) {
    // Werte aus der HTML-Seite ermitteln...
    //const __SAISON = 1;

    // ... und abspeichern...
    //optSet.setOpt('saison', __SAISON, false);

    return optSet;
}

// Callback-Funktion fuer die Ermittlung des richtigen PageManagers
// page: Die ueber den Selektor ermittelte Seitennummer
// return Der zugehoerige PageManager (hier: 1-basiert)
function setupManager(page) {
    const __MAIN = this;

    return __MAIN.pageManager[Math.max(0, page - 1)];
}

// ==================== Ende Spezialbehandlung der Startparameter ====================

// ==================== Hauptprogramm ====================

// Konfiguration der Callback-Funktionen zum Hauptprogramm...
const __MAINCONFIG = {
                        setupManager    : setupManager,
                        prepareOpt      : prepareOptions
                    };

// Selektor (Seite bzw. Parameter) fuer den richtigen PageManager...
const __LEAFS = {
                    'watch'        : 1, // Teamansicht Video
                    'search'       : 2  // Teamansicht Search
//                    , ''             : 0  // Teamansicht Video
                };
const __ITEM = 's';

// URL-Legende:
// s=0: Video
// s=1: Search
const __MAIN = new Main(__OPTCONFIG, __MAINCONFIG, procVideo, procSearch);

__MAIN.run(getPageIdFromURL, __LEAFS, __ITEM);

// ==================== Ende Hauptprogramm ====================

// *** EOF ***
