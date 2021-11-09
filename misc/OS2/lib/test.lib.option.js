// ==UserScript==
// _name         test.lib.option
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Basisklasse fuer Unit-Tests fuer ein JS-Modul
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/lib.option.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.assert.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.class.unittest.js
// _require      https://eselce.github.io/OS2.scripts/lib/test.lib.option.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse UnitTestOption ====================

// Spezialisierte Klasse fuer die Ausfuehrung von Unit-Tests fuer Optionen
// name: Name des JS-Moduls
// desc: Beschreibung des Moduls
// tests: Objekt mit den Testfunktionen
// load: Angabe, ob die Tests geladen werden sollen (false: Test nicht laden)
function UnitTestOption(name, desc, tests, load) {
    'use strict';

    this.register(name, desc, tests, load, this);
}

Class.define(UnitTestOption, UnitTest, {
            'prepare'     : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
                                UNUSED(resultObj, resultFun, tableId);

                                const __TEAMPARAMS = new Team("Choromonets Odessa", "Ukraine", "1. Liga");

                                __LOG[1]("prepare()", name, desc);

                                thisArg.optSet = await buildOptions(__TESTOPTCONFIG, __TESTOPTSET, {
                                        'teamParams'  : __TEAMPARAMS,
                                        'menuAnchor'  : getTable(1, 'div'),
                                        'hideMenu'    : true,
                                        'hideForm'    : {
                                                           'team'   : true
                                                        }
                                    });

                                return true;
                            },
            'cleanup'     : async function(name, desc, thisArg, resultObj, resultFun, tableId) {
                                UNUSED(resultFun, tableId);

                                const __RELOAD = false;

                                __LOG[1]("cleanup()", name, desc);

                                // Status loggen...
                                __LOG[2](String(thisArg.optSet));
                                __LOG[1]('OPTION TEST END', __DBMOD.Name, '(' + resultObj.countRunning + ')');

                                // Optionen aufraeumen...
                                await resetOptions(this.optSet, __RELOAD);
                                delete thisArg.optSet;

                                return true;
                            },
            'setup'       : async function(name, desc, testFun, thisArg) {
                                const __RELOAD = false;

                                __LOG[1]("setup()", name, desc, testFun, thisArg);

                                // "Sauberes" OptSet vorbereiten...
                                await resetOptions(this.optSet, __RELOAD);

                                return true;
                            },
            'teardown'    : async function(name, desc, testFun, thisArg) {
                                __LOG[1]("teardown()", name, desc, testFun, thisArg);

                                return true;
                            }
        });

// ==================== Ende Abschnitt fuer Klasse UnitTestOption ====================

// ==================== Ende Abschnitt fuer Test-Konfiguration __TESTCONFIG ====================

// Moegliche Optionen (hier die Standardwerte editieren oder ueber das Benutzermenu setzen):
const __TESTOPTCONFIG = {
    'saison' : {          // Laufende Saison
                   'Name'      : "saison",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : true,
                   'SelValue'  : false,
                   'Choice'    : [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 ],
                   'Default'   : 17,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Saison: $",
                   'Hotkey'    : 'a',
                   'FormLabel' : "Saison:|$"
               },
    'ligaSize' : {        // Ligengroesse
                   'Name'      : "ligaSize",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'AutoReset' : true,
                   'Choice'    : [ 10, 18, 20 ],
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Liga: $er",
                   'Hotkey'    : 'i',
                   'FormLabel' : "Liga:|$er"
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
                   'Cols'      : 3,
                   'Rows'      : 1,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Daten-ZAT: $"
               },
    'team' : {            // Datenspeicher fuer Daten des Erst- bzw. Zweitteams
                   'Name'      : "team",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : true,
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
                   'Hotkey'    : 'a',
                   'AltTitle'  : "$V schlie\xDFen",
                   'AltLabel'  : "Optionen verbergen",
                   'AltHotkey' : 'v',
                   'FormLabel' : ""
               }
};

// ==================== Ende Abschnitt fuer Test-Konfiguration __TESTCONFIG ====================

// ==================== Spezialisierter Abschnitt fuer Optionen ====================

// Gesetzte Optionen (werden ggfs. von initOptions() angelegt und von loadOptions() gefuellt):
const __TESTOPTSET = new Options(__TESTOPTCONFIG, '__TESTOPTSET');

// Teamparameter fuer getrennte Speicherung der Optionen fuer Erst- und Zweitteam...
const __TESTTEAMCLASS = new TeamClassification();

// Optionen mit Daten, die ZAT- und Team-bezogen gemerkt werden...
__TESTTEAMCLASS.optSelect = {
//        'datenZat'   : true,
//        'ligaSize'   : true
    };

// Behandelt die Optionen und laedt das Benutzermenu
// optConfig: Konfiguration der Optionen
// optSet: Platz fuer die gesetzten Optionen
// optParams: Eventuell notwendige Parameter zur Initialisierung
// 'hideMenu': Optionen werden zwar geladen und genutzt, tauchen aber nicht im Benutzermenu auf
// 'teamParams': Getrennte Daten-Option wird genutzt, hier: Team() mit 'LdNr'/'LgNr' des Erst- bzw. Zweitteams
// 'menuAnchor': Startpunkt fuer das Optionsmenu auf der Seite
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// 'formWidth': Anzahl der Elemente pro Zeile
// 'formBreak': Elementnummer des ersten Zeilenumbruchs
// return Promise auf gefuelltes Objekt mit den gesetzten Optionen
function buildOptions(optConfig, optSet = undefined, optParams = { 'hideMenu' : false }) {
    // Klassifikation ueber Land und Liga des Teams...
    __TESTTEAMCLASS.optSet = optSet;  // Classification mit optSet verknuepfen
    __TESTTEAMCLASS.teamParams = optParams.teamParams;  // Ermittelte Parameter

    return startOptions(optConfig, optSet, __TESTTEAMCLASS).then(
                optSet => showOptions(optSet, optParams),
                defaultCatch);
}

// ==================== Ende Abschnitt fuer Optionen ====================

// *** EOF ***
