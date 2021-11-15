// ==UserScript==
// @name         OS2.zugabgabe
// @namespace    http://os.ongapo.com/
// @version      0.10+lib
// @copyright    2017+
// @author       Sven Loges (SLC)
// @description  Zugabgabe-Script fuer Online Soccer 2.0
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/haupt\.php(\?changetosecond=\w+(&\S+)*)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/zugabgabe\.php(\?p=\d+(&\S+)*)?$/
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
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Konfigurations-Abschnitt fuer Optionen ====================

const __LOGLEVEL = 4;

// Moegliche Optionen (hier die Standardwerte editieren oder ueber das Benutzermenu setzen):
const __OPTCONFIG = {
    'shortSelect' : {      // Verkuezte Klappboxen nur mit infrage kommenden Spielern (true = nur Auswahl, false = alle Spieler)
                   'Name'      : "showQuali",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Auswahl kurz",
                   'Hotkey'    : 'A',
                   'AltLabel'  : "Auswahl lang",
                   'AltHotkey' : 'A',
                   'FormLabel' : "Auswahl k\xFCrzen"
               },
    'zeigeKuerzel' : {      // Zeigt den Buchstaben der Spieler im Text (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showLetter",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "K\xFCrzel ein",
                   'Hotkey'    : 'K',
                   'AltLabel'  : "K\xFCrzel aus",
                   'AltHotkey' : 'K',
                   'FormLabel' : "K\xFCrzel"
               },
    'aktuellerZat' : {    // Laufender ZAT
                   'Name'      : "currZAT",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'Permanent' : true,
                   'SelValue'  : false,
                   'Choice'    : [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11,
                                  12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                                  24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
                                  36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
                                  48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
                                  60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
                                  72 ],
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "ZAT: $",
                   'Hotkey'    : 'Z',
                   'FormLabel' : "ZAT:|$"
               },
    'datenZat' : {        // Stand der Daten zum Team und ZAT
                   'Name'      : "dataZAT",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'Number',
                   'Hidden'    : true,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : undefined,
                   'Action'    : __OPTACTION.SET,
                   'Submit'    : undefined,
                   'Cols'      : 1,
                   'Rows'      : 1,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Daten-ZAT:"
               },
    'oldDatenZat' : {     // Stand der Daten zum Team und ZAT
                   'Name'      : "oldDataZAT",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'Number',
                   'Hidden'    : true,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : undefined,
                   'Action'    : __OPTACTION.SET,
                   'Submit'    : undefined,
                   'Cols'      : 1,
                   'Rows'      : 1,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Vorheriger Daten-ZAT:"
               },
    'team' : {            // Datenspeicher fuer Daten des Erst- bzw. Zweitteams
                   'Name'      : "team",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'Permanent' : true,
                   'Default'   : undefined,  // new Team() // { 'Team' : undefined, 'Liga' : undefined, 'Land' : undefined, 'LdNr' : 0, 'LgNr' : 0 }
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 6,
                   'Replace'   : null,
                   'Space'     : 1,
                   'Label'     : "Verein:"
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

// Teamparameter fuer getrennte Speicherung der Optionen fuer Erst- und Zweitteam...
const __TEAMCLASS = new TeamClassification();

// Optionen mit Daten, die ZAT- und Team-bezogen gemerkt werden...
__TEAMCLASS.optSelect = { };

// ==================== Ende Abschnitt fuer Optionen ====================

// ==================== Page-Manager fuer zu bearbeitende Seiten ====================

// Verarbeitet Ansicht "Haupt" (Managerbuero) zur Ermittlung des aktuellen ZATs
const procHaupt = new PageManager("Haupt (Managerb\xFCro)", __TEAMCLASS, () => {
        const __TEAMPARAMS = getTeamParamsFromTable(getTable(1), __TEAMSEARCHHAUPT);  // Link mit Team, Liga, Land...

        return {
                'teamParams'  : __TEAMPARAMS,
                'hideMenu'    : true
            };
    }, async optSet => {
        const __ZATCELL = getProp(getProp(getRows(0), 2), 'cells', { })[0];
        const __NEXTZAT = getZATNrFromCell(__ZATCELL);  // "Der naechste ZAT ist ZAT xx und ..."
        const __CURRZAT = __NEXTZAT - 1;
        const __DATAZAT = optSet.getOptValue('datenZat');

        // Stand der alten Daten merken...
        optSet.setOpt('oldDatenZat', __DATAZAT, false);

        if (__CURRZAT >= 0) {
            __LOG[2]("Aktueller ZAT: " + __CURRZAT);

            // Neuen aktuellen ZAT speichern...
            optSet.setOpt('aktuellerZat', __CURRZAT, false);

            if (__CURRZAT !== __DATAZAT) {
                __LOG[2](__LOG.changed(__DATAZAT, __CURRZAT));

                // ... und ZAT-bezogene Daten als veraltet markieren
                await __TEAMCLASS.deleteOptions({
                                              'datenZat'    : true,
                                              'oldDatenZat' : true
                                          }).catch(defaultCatch);

                // Neuen Daten-ZAT speichern...
                optSet.setOpt('datenZat', __CURRZAT, false);
            }
        }

        return true;
    });

// Verarbeitet Ansicht "Aufstellung"
const procAufstellung = new PageManager("Aufstellung", __TEAMCLASS, () => {
        return {
                'menuAnchor'  : getTable(0, 'div'),
                'formWidth'   : 1
            };
    }, async optSet => {
        UNUSED(optSet);
        //const __ROWOFFSETUPPER = 1;   // Header-Zeile
        //const __ROWOFFSETLOWER = 0;
        //UNUSED(__ROWOFFSETUPPER, __ROWOFFSETLOWER);
        //return true;
    });

// Verarbeitet Ansicht "Aktionen"
const procAktionen = new PageManager("Aktionen", __TEAMCLASS, () => {
        return {
                'menuAnchor'  : getTable(0, 'div'),
                'formWidth'   : 1
            };
    }, async optSet => {
        UNUSED(optSet);
        //const __ROWOFFSETUPPER = 1;   // Header-Zeile
        //const __ROWOFFSETLOWER = 0;
        //UNUSED(__ROWOFFSETUPPER, __ROWOFFSETLOWER);
        //return true;
    });

// Verarbeitet Ansicht "Einstellungen"
const procEinstellungen = new PageManager("Einstellungen", __TEAMCLASS, () => {
        return {
                'menuAnchor'  : getTable(0, 'div'),
                'formWidth'   : 1
            };
    }, async optSet => {
        UNUSED(optSet);
        //const __ROWOFFSETUPPER = 1;   // Header-Zeile
        //const __ROWOFFSETLOWER = 0;
        //UNUSED(__ROWOFFSETUPPER, __ROWOFFSETLOWER);
        //return true;
    });

// ==================== Ende Page-Manager fuer zu bearbeitende Seiten ====================

// ==================== Spezialbehandlung der Startparameter ====================

// Callback-Funktion fuer die Behandlung der Optionen und Laden des Benutzermenus
// Diese Funktion erledigt nur Modifikationen und kann z.B. einfach optSet zurueckgeben!
// optSet: Platz fuer die gesetzten Optionen
// optParams: Eventuell notwendige Parameter zur Initialisierung
// 'hideMenu': Optionen werden zwar geladen und genutzt, tauchen aber nicht im Benutzermenu auf
// 'teamParams': Getrennte Daten-Option wird genutzt, hier: Team() mit 'LdNr'/'LgNr' des Erst- bzw. Zweitteams
// 'menuAnchor': Startpunkt fuer das Optionsmenu auf der Seite
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// 'formWidth': Anzahl der Elemente pro Zeile
// 'formBreak': Elementnummer des ersten Zeilenumbruchs
// return Gefuelltes Objekt mit den gesetzten Optionen
function prepareOptions(optSet, optParams) {
    UNUSED(optParams);

    // Werte aus der HTML-Seite ermitteln...

    // ... und abspeichern...

    return optSet;
}

// ==================== Ende Spezialbehandlung der Startparameter ====================

// ==================== Hauptprogramm ====================

const __MAINCONFIG = {
                        prepareOpt      : prepareOptions
                    };

const __LEAFS = {
                    'zugabgabe.php' :  0,   // Ansicht "Zugabgabe" (p = 0, 1, 2)
                    'haupt.php'     :  3,   // Ansicht "Haupt" (Managerbuero)
                };
const __ITEM = 'p';

// URL-Legende:
// p=0: Zugabgabe Aufstellung
// p=1: Zugabgabe Aktionen
// p=2: Zugabgabe Einstellungen
// p=3: Managerbuero
const __MAIN = new Main(__OPTCONFIG, __MAINCONFIG,
                        procAufstellung, procAktionen, procEinstellungen, procHaupt);

__MAIN.run(getPageIdFromURL, __LEAFS, __ITEM);

// ==================== Ende Hauptprogramm ====================

// *** EOF ***
