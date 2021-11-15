// ==UserScript==
// @name         OS2.training
// @namespace    http://os.ongapo.com/
// @version      0.30beta4+lib
// @copyright    2013+
// @author       Sven Loges (SLC) / Andreas Eckes (Strindheim BK)
// @description  OS 2.0 - Berechnet die Trainingswahrscheinlichkeiten abhaengig von der Art des Einsatzes
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/haupt\.php(\?changetosecond=\w+(&\S+)*)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/trainer\.php(\?\S+(&\S+)*)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/training\.php(\?\S+(&\S+)*)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/zar\.php(\?\S+(&\S+)*)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/zugabgabe\.php(\?\S+(&\S+)*)?$/
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
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Konfigurations-Abschnitt fuer Optionen ====================

const __LOGLEVEL = 9;

// Moegliche Optionen (hier die Standardwerte editieren oder ueber das Benutzermenu setzen):
const __OPTCONFIG = {
    'zeigeId' : {         // Spaltenauswahl fuer Identifizierung der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showId",
                   'Type'      : __OPTTYPES.SW,
                   'Hidden'    : true,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Identifikation ein",
                   'Hotkey'    : 'I',
                   'AltLabel'  : "Identifikation aus",
                   'AltHotkey' : 'I',
                   'FormLabel' : "Identifikation"
               },
    'zeigeAlter' : {      // Spaltenauswahl fuer Alter der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showAge",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Alter ein",
                   'Hotkey'    : 'A',
                   'AltLabel'  : "Alter aus",
                   'AltHotkey' : 'A',
                   'FormLabel' : "Alter"
               },
    'zeigePosition' : {   // Spaltenauswahl fuer Position der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showPos",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Position ein",
                   'Hotkey'    : 'P',
                   'AltLabel'  : "Position aus",
                   'AltHotkey' : 'P',
                   'FormLabel' : "Position"
               },
    'zeigeTOR' : {        // Spaltenauswahl fuer Torwarte der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showTOR",
                   'Type'      : __OPTTYPES.SW,
                   'Hidden'    : true,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "TOR ein",
                   'Hotkey'    : 'T',
                   'AltLabel'  : "TOR aus",
                   'AltHotkey' : 'T',
                   'FormLabel' : "Torwart?"
               },
    'zeigeOpti' : {       // Spaltenauswahl fuer die aktuellen Werte (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showOpti",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Opti ein",
                   'Hotkey'    : 'O',
                   'AltLabel'  : "Opti aus",
                   'AltHotkey' : 'O',
                   'FormLabel' : "Opti"
               },
    'zeigeVerletzung' : { // Spaltenauswahl fuer Verletzungsdauer der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showVerl",
                   'Type'      : __OPTTYPES.SW,
                   'Hidden'    : true,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "TOR ein",
                   'Hotkey'    : 'T',
                   'AltLabel'  : "TOR aus",
                   'AltHotkey' : 'T',
                   'FormLabel' : "Torwart?"
               },
    'zeigeBlessur' : {    // Spaltenauswahl fuer Blessur der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showBlessur",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Blessur ein",
                   'Hotkey'    : 'S',
                   'AltLabel'  : "Blessur aus",
                   'AltHotkey' : 'S',
                   'FormLabel' : "Blessur"
               },
    'zeigeSkillPos' : {   // Spaltenauswahl fuer trainierten Skill der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showSkillPos",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Trainierter Skill ein",
                   'Hotkey'    : 's',
                   'AltLabel'  : "Trainierter Skill aus",
                   'AltHotkey' : 's',
                   'FormLabel' : "Trainierter Skill"
               },
    'zeigeSkill' : {      // Spaltenauswahl fuer trainierten Skillwert der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showSkill",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Skillwert ein",
                   'Hotkey'    : 'S',
                   'AltLabel'  : "Skillwert aus",
                   'AltHotkey' : 'S',
                   'FormLabel' : "Skillwert"
               },
    'zeigeSkillUp' : {    // Spaltenauswahl fuer erhoehten der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showSkillUp",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Neuer Skillwert ein",
                   'Hotkey'    : 'n',
                   'AltLabel'  : "Neuer Skillwert aus",
                   'AltHotkey' : 'S',
                   'FormLabel' : "Neuer Skillwert"
               },
    'zeigeTSkill' : {     // Spaltenauswahl fuer Trainerskill der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showTSkill",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Trainer-Skill ein",
                   'Hotkey'    : 'T',
                   'AltLabel'  : "Trainer-Skill aus",
                   'AltHotkey' : 'T',
                   'FormLabel' : "Trainer-Skill"
               },
    'zeigeTNr' : {        // Spaltenauswahl fuer Trainernummer der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showTNr",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Trainer-Nummer ein",
                   'Hotkey'    : 't',
                   'AltLabel'  : "Trainer-Nummer aus",
                   'AltHotkey' : 't',
                   'FormLabel' : "Trainer-Nummer"
               },
    'zeigePrio' : {       // Spaltenauswahl fuer Training eines Primaerskills der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showTSkill",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Prim\xE4rskill ein",
                   'Hotkey'    : 'p',
                   'AltLabel'  : "Prim\xE4rskill aus",
                   'AltHotkey' : 'p',
                   'FormLabel' : "Prim\xE4rskill?"
               },
    'zeigeEinsatz' : {    // Spaltenauswahl fuer Spielereinsatz der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showEins",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Einsatz ein",
                   'Hotkey'    : 'E',
                   'AltLabel'  : "Einsatz aus",
                   'AltHotkey' : 'E',
                   'FormLabel' : "Einsatz"
               },
    'zeigeProzent' : {    // Spaltenauswahl fuer Trainingsprozente der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showProz",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Trainings-Prozente ein",
                   'Hotkey'    : 'P',
                   'AltLabel'  : "Trainings-Prozente aus",
                   'AltHotkey' : 'P',
                   'FormLabel' : "Trainings-Prozente"
               },
    'zeigeProzentBalken' : { // Spaltenauswahl fuer Balken Trainingsprozente der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showProzBar",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Prozente-Balken ein",
                   'Hotkey'    : 'p',
                   'AltLabel'  : "Prozente-Balken aus",
                   'AltHotkey' : 'p',
                   'FormLabel' : "Prozente-Balken"
               },
    'zeigeErwartung' : {  // Spaltenauswahl fuer Trainingserwartung der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showEw",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Trainings-EW ein",
                   'Hotkey'    : 'E',
                   'AltLabel'  : "Trainings-EW aus",
                   'AltHotkey' : 'E',
                   'FormLabel' : "Trainings-EW"
               },
    'zeigeErwartungBalken' : { // Spaltenauswahl fuer Balken Trainingserwartung der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showEwBar",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Erwartungswert-Balken ein",
                   'Hotkey'    : 'e',
                   'AltLabel'  : "Erwartungswert-Balken aus",
                   'AltHotkey' : 'e',
                   'FormLabel' : "Erwartungswert-Balken"
               },
    'zeigeErfolg' : {     // Spaltenauswahl fuer Trainingsaufwertung der trainierten Spieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showErf",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Erfolgswert ein",
                   'Hotkey'    : 'a',
                   'AltLabel'  : "Erfolgswert aus",
                   'AltHotkey' : 'a',
                   'FormLabel' : "Erfolgswert"
               },
    'sepStyle' : {        // Stil der Trennlinie
                   'Name'      : "sepStyle",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'Hidden'    : true,
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
                   'Hidden'    : true,
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
                   'Hidden'    : true,
                   'FreeValue' : true,
                   'Choice'    : [ 'thin', 'medium', 'thick' ],
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Dicke: $",
                   'Hotkey'    : 'D',
                   'FormLabel' : "Dicke:|$"
               },
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
    'trainer' : {         // Datenspeicher fuer Trainer-Skills aller Trainer
                   'Name'      : "trainer",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [null, null, null, null, null, null],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainer:"
               },
    'tGehaelter' : {      // Datenspeicher fuer Trainer-Gehaelter aller Trainer
                   'Name'      : "tGehaelter",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [0, 0, 0, 0, 0, 0],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainer-Geh\xE4lter:"
               },
    'tVertraege' : {      // Datenspeicher fuer Laengen der Trainer-Vertraege aller Trainer
                   'Name'      : "tVertraege",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [0, 0, 0, 0, 0, 0],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainer-Vertr\xE4ge:"
               },
    'tReste' : {          // Datenspeicher fuer Rest-Laengen der Trainer-Vertraege aller Trainer
                   'Name'      : "tReste",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [0, 0, 0, 0, 0, 0],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainer-Restlaufzeit:"
               },
    'tAnzahlen' : {       // Datenspeicher fuer Anzahl zugeordneter Spieler zu den jeweiligen Trainern
                   'Name'      : "tAnzahlen",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [0, 0, 0, 0, 0, 0],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 1,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Anzahl Spieler:"
               },
    'ids' : {             // Datenspeicher fuer ID der Spieler
                   'Name'      : "ids",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Spieler-IDs:"
               },
    'names' : {           // Datenspeicher fuer Name der Spieler
                   'Name'      : "names",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 10,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Spielernamen:"
               },
    'ages' : {            // Datenspeicher fuer Alter der Spieler
                   'Name'      : "ages",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Alter:"
               },
    'positions' : {       // Datenspeicher fuer Spieler-Positionen
                   'Name'      : "positions",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 3,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Positionen:"
               },
    'opti27' : {          // Datenspeicher fuer ganzzahlige Opti-Punkte (mal 27) der Spieler
                   'Name'      : "opti27",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Opti (x27):"
               },
    'verletzt' : {        // Datenspeicher fuer Verletzungsdauer der Spieler
                   'Name'      : "verletzt",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Verletzungen:"
               },
    'skills' : {          // Datenspeicher fuer vorherige Werte der Spieler-Skills
                   'Name'      : "skills",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Skills:"
               },
    'tSkills' : {         // Datenspeicher fuer Skills der Trainer
                   'Name'      : "tSkills",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainer-Skills:"
               },
    'trainiert' : {       // Datenspeicher fuer Zuordnung der Trainer
                   'Name'      : "trainiert",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainer-Nummern:"
               },
    'skillPos' : {        // Datenspeicher fuer Zuordnung der Trainings (Skill-Positionen)
                   'Name'      : "skillPos",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Skill-Positionen:"
               },
    'isPrio' : {          // Datenspeicher fuer Zuordnung der Trainings (Primaerskill ja/nein)
                   'Name'      : "isPrio",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Prio-Training:"
               },
    'einsaetze' : {       // Datenspeicher fuer Einsatzarten der Spieler
                   'Name'      : "einsaetze",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Einsatz-Typen:"
               },
    'prozente' : {        // Datenspeicher fuer Trainingswahrscheinlichkeiten (in Prozent)
                   'Name'      : "prozente",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainings-Prozente:"
               },
    'erwartungen' : {     // Datenspeicher fuer Erwartungswert des Trainings (Prios 5fach)
                   'Name'      : "erwartungen",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainings-EW:"
               },
    'erfolge' : {         // Datenspeicher fuer Trainingserfolge
                   'Name'      : "erfolge",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainings-Erfolge:"
               },
    'blessuren' : {         // Datenspeicher fuer Trainingsblessuren
                   'Name'      : "blessuren",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainings-Blessuren:"
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

// ==================== Spezialisierter Abschnitt fuer Optionen ====================

// Logging initialisieren mit Loglevel (siehe ganz oben im Konfigurationsabschnitt)...
__LOG.init(window, __LOGLEVEL);

// Teamparameter fuer getrennte Speicherung der Optionen fuer Erst- und Zweitteam...
const __TEAMCLASS = new TeamClassification();

// Optionen mit Daten, die ZAT- und Team-bezogen gemerkt werden...
__TEAMCLASS.optSelect = {
        'datenZat'        : true,
        'oldDatenZat'     : true,
        'trainer'         : true,
        'tGehaelter'      : true,
        'tVertraege'      : true,
        'tReste'          : true,
        'tAnzahlen'       : true,
        'ids'             : true,
        'names'           : true,
        'ages'            : true,
        'positions'       : true,
        'opti27'          : true,
        'verletzt'        : true,
        'skills'          : true,
        'tSkills'         : true,
        'trainiert'       : true,
        'skillPos'        : true,
        'isPrio'          : true,
        'einsaetze'       : true,
        'prozente'        : true,
        'erwartungen'     : true,
        'erfolge'         : true,
        'blessuren'       : true
    };

// Teamparameter fuer getrennte Speicherung der Optionen fuer Erst- und Zweitteam...
const __LASTZATCLASS = new Classification('old');

// Optionen mit Daten, die ZAT-bezogen (fuer jetzigen und vergangenen ZAT) gemerkt werden...
__LASTZATCLASS.optSelect = {
        'trainer'         : true,
        'tGehaelter'      : true,
        'tVertraege'      : true,
        'tReste'          : true,
        'tAnzahlen'       : true,
        'ids'             : true,
        'names'           : true,
        'ages'            : true,
        'positions'       : true,
        'opti27'          : true,
        'verletzt'        : true,
        'skills'          : true,
        'tSkills'         : true,
        'trainiert'       : true,
        'skillPos'        : true,
        'isPrio'          : true,
        'einsaetze'       : true,
        'prozente'        : true,
        'erwartungen'     : true,
        'erfolge'         : true,
        'blessuren'       : true
    };

// ==================== Ende Abschnitt fuer Optionen ====================

// Klasse ColumnManagerBase *****************************************************************

/*class*/ function ColumnManagerBase /*{
    constructor*/(optSet, colIdx, showCol) {
        'use strict';
        UNUSED(optSet, showCol);

        __LOG[4]("ColumnManagerBase()");

/***
        const __SHOWCOL = getValue(showCol, true);
        const __SHOWALL = ((__SHOWCOL === true) || (__SHOWCOL.Default === true));

        const __BIRTHDAYS = getOptValue(optSet.birthdays, []).length;
        const __TCLASSES = getOptValue(optSet.tClasses, []).length;
        const __PROGRESSES = getOptValue(optSet.progresses, []).length;

        const __ZATAGES = getOptValue(optSet.zatAges, []).length;
        const __TRAINIERT = getOptValue(optSet.trainiert, []).length;
        const __POSITIONS = getOptValue(optSet.positions, []).length;

        const __EINZELSKILLS = getOptValue(optSet.skills, []).length;
        const __PROJECTION = (__EINZELSKILLS && __ZATAGES);
***/

        this.colIdx = colIdx;

/***
        this.saison = getOptValue(optSet.saison);
        this.gt = getOptValue(optSet.zeigeJahrgang);
        this.gtUxx = getOptValue(optSet.zeigeUxx);

        this.fpId = (__BIRTHDAYS && __TCLASSES && __POSITIONS && getValue(__SHOWCOL.zeigeId, __SHOWALL) && getOptValue(optSet.zeigeId));
        this.warn = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnung, __SHOWALL) && getOptValue(optSet.zeigeWarnung));
        this.warnMonth = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungMonat, __SHOWALL) && getOptValue(optSet.zeigeWarnungMonat));
        this.warnHome = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungHome, __SHOWALL) && getOptValue(optSet.zeigeWarnungHome));
        this.warnDialog = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungDialog, __SHOWALL) && getOptValue(optSet.zeigeWarnungDialog));
        this.warnAufstieg = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungAufstieg, __SHOWALL) && getOptValue(optSet.zeigeWarnungAufstieg));
        this.warnLegende = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungLegende, __SHOWALL) && getOptValue(optSet.zeigeWarnungLegende));
        this.bar = (__PROJECTION && getValue(__SHOWCOL.zeigeBalken, __SHOWALL) && getOptValue(optSet.zeigeBalken));
        this.barAbs = getOptValue(optSet.absBalken);
        this.donor = getOptValue(optSet.foerderung);
        this.geb = (__BIRTHDAYS && getValue(__SHOWCOL.zeigeGeb, __SHOWALL) && getOptValue(optSet.zeigeGeb));
        this.tal = (__TCLASSES && getValue(__SHOWCOL.zeigeTal, __SHOWALL) && getOptValue(optSet.zeigeTal));
        this.quo = (__ZATAGES && __TRAINIERT && getValue(__SHOWCOL.zeigeQuote, __SHOWALL) && getOptValue(optSet.zeigeQuote));
        this.aufw = (__PROGRESSES && getValue(__SHOWCOL.zeigeAufw, __SHOWALL) && getOptValue(optSet.zeigeAufw));
        this.substAge = (__ZATAGES && getValue(__SHOWCOL.ersetzeAlter, __SHOWALL) && getOptValue(optSet.ersetzeAlter));
        this.alter = (__ZATAGES && getValue(__SHOWCOL.zeigeAlter, __SHOWALL) && getOptValue(optSet.zeigeAlter));
        this.fix = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeFixSkills, __SHOWALL) && getOptValue(optSet.zeigeFixSkills));
        this.tr = (__EINZELSKILLS && __TRAINIERT && getValue(__SHOWCOL.zeigeTrainiert, __SHOWALL) && getOptValue(optSet.zeigeTrainiert));
        this.zat = (__ZATAGES && getValue(__SHOWCOL.zeigeZatDone, __SHOWALL) && getOptValue(optSet.zeigeZatDone));
        this.antHpt = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeAnteilPri, __SHOWALL) && getOptValue(optSet.zeigeAnteilPri));
        this.antNeb = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeAnteilSec, __SHOWALL) && getOptValue(optSet.zeigeAnteilSec));
        this.pri = (__EINZELSKILLS && getValue(__SHOWCOL.zeigePrios, __SHOWALL) && getOptValue(optSet.zeigePrios));
        this.skill = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeSkill, __SHOWALL) && getOptValue(optSet.zeigeSkill));
        this.pos = (__EINZELSKILLS && __POSITIONS && getValue(__SHOWCOL.zeigePosition, __SHOWALL) && getOptValue(optSet.zeigePosition));
        this.anzOpti = ((__EINZELSKILLS && getValue(__SHOWCOL.zeigeOpti, __SHOWALL)) ? getOptValue(optSet.anzahlOpti) : 0);
        this.anzMw =  ((__PROJECTION && getValue(__SHOWCOL.zeigeMW, __SHOWALL)) ? getOptValue(optSet.anzahlMW) : 0);
        this.substSkills = (__PROJECTION && getValue(__SHOWCOL.ersetzeSkills, __SHOWALL) && getOptValue(optSet.ersetzeSkills));
        this.trE = (__PROJECTION && __TRAINIERT && getValue(__SHOWCOL.zeigeTrainiertEnde, __SHOWALL) && getOptValue(optSet.zeigeTrainiertEnde));
        this.zatE = (__ZATAGES && getValue(__SHOWCOL.zeigeZatLeft, __SHOWALL) && getOptValue(optSet.zeigeZatLeft));
        this.antHptE = (__PROJECTION && getValue(__SHOWCOL.zeigeAnteilPriEnde, __SHOWALL) && getOptValue(optSet.zeigeAnteilPriEnde));
        this.antNebE = (__PROJECTION && getValue(__SHOWCOL.zeigeAnteilSecEnde, __SHOWALL) && getOptValue(optSet.zeigeAnteilSecEnde));
        this.priE = (__PROJECTION && getValue(__SHOWCOL.zeigePriosEnde, __SHOWALL) && getOptValue(optSet.zeigePriosEnde));
        this.skillE = (__PROJECTION && getValue(__SHOWCOL.zeigeSkillEnde, __SHOWALL) && getOptValue(optSet.zeigeSkillEnde));
        this.anzOptiE = ((__PROJECTION && getValue(__SHOWCOL.zeigeOptiEnde, __SHOWALL)) ? getOptValue(optSet.anzahlOptiEnde) : 0);
        this.anzMwE = ((__PROJECTION && getValue(__SHOWCOL.zeigeMWEnde, __SHOWALL)) ? getOptValue(optSet.anzahlMWEnde) : 0);
        this.kennzE = getOptValue(optSet.kennzeichenEnde);
***/
    }
//}

Class.define(ColumnManagerBase, Object, {
        'toString'       : function() {  // Bisher nur die noetigsten Parameter ausgegeben...
                               const __RESULT = "Cols\t\t" + this.colIdx + '\n';

                               return __RESULT;
                           },
        'insertRow'      : function(table, rowIdx = 0) {
                               return table.insertRow(rowIdx);
                           },
        'addRow'         : function(table) {
                               return this.insertRow(table, -1);
                           },
        'insertCell'     : function(tableRow, colIdx) {
                               return tableRow.insertCell(colIdx);
                           },
        'addCell'        : function(tableRow) {
                               return this.insertCell(tableRow, -1);
                           },
        'addAndFillCell' : function(tableRow, value, color, align, digits = 2) {
                               let text = value;

                               if ((value || (value === 0)) && isFinite(value) && (value !== true) && (value !== false)) {
                                   // Zahl einfuegen
                                   if (value < 1000) {
                                       // Mit Nachkommastellen darstellen
                                       text = parseFloat(value).toFixed(digits);
                                   } else {
                                       // Mit Tausenderpunkten darstellen
                                       text = getNumberString(value.toString());
                                   }
                               }

                               // String, Boolean oder Zahl einfuegen...
                               const __CELL = this.addCell(tableRow);

                               __CELL.innerHTML = text;
                               if (color) {
                                   __CELL.style.color = color;
                               }
                               if (align) {
                                   __CELL.align = align;
                               }

                               return __CELL;
                           },
        'addAndBarCell'  : function(tableRow, value, scale = 100, offset = 0, width = 100, height = 10, zoom = 100) {
                               const __VALUE = ((scale && isFinite(value)) ? ((value - offset) / Math.max(1, scale - offset) * 100) : 0);

                               // HTML-Code fuer Anteilsbalken einfuegen...
                               const __CELL = this.addCell(tableRow);

                               __CELL.innerHTML = this.getBarImg(__VALUE, width, height, zoom);
                               __CELL.align = 'left';

                               return __CELL;
                           },
        'getBarImg'      : function(value, width = 100, height = 10, zoom = 100) {
                               const __IMAGE = Math.min(99, Math.max(0, getMulValue(value, 1, 0, 0)));
                               const __LENGTH = getMulValue(width / 100, getMulValue(zoom / 100, value, 0, 0), 0, 0);
                               const __WIDTH = Math.min(width, __LENGTH);
                               const __HEIGHT = Math.max(3, getMulValue(zoom / 100, height * (__LENGTH / __WIDTH), 0, 0));

                               // HTML-Code fuer Anteilsbalken...
                               return '<img src="images/balken/' + __IMAGE + '.GIF" width="' + __WIDTH + '" height="' + __HEIGHT + '">';
                           },
        'insertTitles'   : function(table, titleColor = '#FFFFFF') {
                               UNUSED(table, titleColor);
                           },  // Ende insertTitles()
        'addTitles'      : function(headers, titleColor = '#FFFFFF') {
                               UNUSED(headers, titleColor);
                           },  // Ende addTitles()
        'addValues'      : function(player, playerRow, color = '#FFFFFF') {
                               UNUSED(player, playerRow, color);
                           }  // Ende addValues(player, playerRow)
    });

// Klasse ColumnManagerZatReport *****************************************************************

/*class*/ function ColumnManagerZatReport /*extends ColumnManagerBase {
    constructor*/(optSet, colIdx, showCol) {
        'use strict';

        ColumnManagerBase.call(this, optSet, colIdx, showCol);

        __LOG[3]("ColumnManagerZatReport()");

        const __SHOWCOL = getValue(showCol, true);
        const __SHOWALL = ((__SHOWCOL === true) || (__SHOWCOL.Default === true));

        const __SAISON = getOptValue(optSet.saison);
        const __AKTZAT = getOptValue(optSet.aktuellerZat);
        const __DATZAT = getOptValue(optSet.datenZat);
        const __GEALTERT = ((__AKTZAT >= 72) ? true : false);
        const __CURRZAT = (__GEALTERT ? 0 : __AKTZAT);

        const __REPSAISON = getSelection('saison', 'Number');
        const __REPZAT = getSelection('zat', 'Number');
        const __SAISONWECHSEL = ((__DATZAT === 0) ? true : false);
        const __OLDSAISON = (__SAISONWECHSEL ? __SAISON - 1 : __SAISON);
        const __OLDZAT = (__SAISONWECHSEL ? 72 : __DATZAT);

        const __TEAM = getOptValue(optSet.team, { });

        const __IDS = eval(getOptValue(optSet.ids, []));
        const __EINSAETZE = eval(getOptValue(optSet.einsaetze, []));
        const __TSKILLS = eval(getOptValue(optSet.tSkills, []));
        const __TEAMDATA = __IDS.length;
        const __EINSDATA = __EINSAETZE.length;
        const __TRAIDATA = __TSKILLS.length;
        const __LASTZAT = ((__REPZAT === __OLDZAT) && (__REPSAISON === __OLDSAISON));

        this.saison = __SAISON;
        this.currZAT = __CURRZAT;
        this.oldSaison = __OLDSAISON;
        this.oldZAT = __OLDZAT;
        this.team = __TEAM;

        __LOG[4]("Team:", __TEAM);
        __LOG[4]("Aktuell:", __SAISON, __CURRZAT);
        __LOG[4]("Altdaten:", __OLDSAISON, __OLDZAT);

        this.id = (getValue(__SHOWCOL.zeigeId, __SHOWALL) && getOptValue(optSet.zeigeId));
        this.alter = (__TEAMDATA && getValue(__SHOWCOL.zeigeAlter, __SHOWALL) && getOptValue(optSet.zeigeAlter));
        this.pos = (__TEAMDATA && getValue(__SHOWCOL.zeigePosition, __SHOWALL) && getOptValue(optSet.zeigePosition));
        this.goalie = (__TEAMDATA && getValue(__SHOWCOL.zeigeTOR, __SHOWALL) && getOptValue(optSet.zeigeTOR));
        this.opti = (__TEAMDATA && getValue(__SHOWCOL.zeigeOpti, __SHOWALL) && getOptValue(optSet.zeigeOpti));
        this.verl = (__TEAMDATA && getValue(__SHOWCOL.zeigeVerletzung, __SHOWALL) && getOptValue(optSet.zeigeVerletzung));
        this.blessur = (getValue(__SHOWCOL.zeigeBlessur, __SHOWALL) && getOptValue(optSet.zeigeBlessur));
        this.skillPos = (__TEAMDATA && __LASTZAT && getValue(__SHOWCOL.zeigeSkillPos, __SHOWALL) && getOptValue(optSet.zeigeSkillPos));
        this.skill = (__TEAMDATA && __LASTZAT && getValue(__SHOWCOL.zeigeSkill, __SHOWALL) && getOptValue(optSet.zeigeSkill));
        this.skillUp = (__TEAMDATA && __LASTZAT && getValue(__SHOWCOL.zeigeSkillUp, __SHOWALL) && getOptValue(optSet.zeigeSkillUp));
        this.tSkill = (__TRAIDATA && __LASTZAT && getValue(__SHOWCOL.zeigeTSkill, __SHOWALL) && getOptValue(optSet.zeigeTSkill));
        this.tNr = (__TRAIDATA && __LASTZAT && getValue(__SHOWCOL.zeigeTNr, __SHOWALL) && getOptValue(optSet.zeigeTNr));
        this.prio = (__TEAMDATA && __LASTZAT && getValue(__SHOWCOL.zeigePrio, __SHOWALL) && getOptValue(optSet.zeigePrio));
        this.eins = (__TEAMDATA && __EINSDATA && __LASTZAT && getValue(__SHOWCOL.zeigeEinsatz, __SHOWALL) && getOptValue(optSet.zeigeEinsatz));
        this.proz = (__TRAIDATA && __LASTZAT && getValue(__SHOWCOL.zeigeProzent, __SHOWALL) && getOptValue(optSet.zeigeProzent));
        this.prozB = (__TRAIDATA && __LASTZAT && getValue(__SHOWCOL.zeigeProzentBalken, __SHOWALL) && getOptValue(optSet.zeigeProzentBalken));
        this.erw = (__LASTZAT && getValue(__SHOWCOL.zeigeErwartung, __SHOWALL) && getOptValue(optSet.zeigeErwartung));
        this.erwB = (__LASTZAT && getValue(__SHOWCOL.zeigeErwartungBalken, __SHOWALL) && getOptValue(optSet.zeigeErwartungBalken));
        this.erf = (__LASTZAT && getValue(__SHOWCOL.zeigeErfolg, __SHOWALL) && getOptValue(optSet.zeigeErfolg));
    }
//}

Class.define(ColumnManagerZatReport, ColumnManagerBase, {
        'toString'       : function() {  // Bisher nur die noetigsten Parameter ausgegeben...
                               let result = ColumnManagerBase.call(this);
/***
                               result += "Beste Position\t" + this.pos + '\n';
                               result += "Optis\t\t\t" + this.anzOpti + '\n';
                               result += "Marktwerte\t\t" + this.anzMw + '\n';
                               result += "Skillschnitt Ende\t" + this.skillE + '\n';
                               result += "Optis Ende\t\t" + this.anzOptiE + '\n';
                               result += "Marktwerte Ende\t" + this.anzMwE + '\n';
***/
                               return result;
                           },
        'addFillCell'    : function(playerRow, testVar) {
                               const __OSBLAU = getColor("");

                               if (testVar !== undefined) {
                                   return true;
                               } else {
                                   this.addAndFillCell(playerRow, "", __OSBLAU);
                                   return false;
                               }
                           },
        'insertTitles'   : function(table, titleColor = '#FFFFFF') {
                               const __HEADERS = this.insertRow(table, 0);

                               this.addAndFillCell(__HEADERS, "Name des Spielers", titleColor);
                               this.addAndFillCell(__HEADERS, "Ergebnis", titleColor);

                               return this.addTitles(__HEADERS, titleColor);
                           },
        'addTitles'      : function(headers, titleColor = '#FFFFFF') {
                               // Spaltentitel zentrieren
                               headers.align = 'center';

                               // Titel fuer die aktuellen Werte
                               if (this.id) {
                                   this.addAndFillCell(headers, "User-ID", titleColor);
                               }
                               if (this.alter) {
                                   this.addAndFillCell(headers, "Alter", titleColor);
                               }
                               if (this.pos) {
                                   this.addAndFillCell(headers, "POS", titleColor);
                               }
                               if (this.goalie) {
                                   this.addAndFillCell(headers, "TOR", titleColor);
                               }
                               if (this.opti) {
                                   this.addAndFillCell(headers, "Opti", titleColor);
                               }
                               if (this.verletzt) {
                                   this.addAndFillCell(headers, 'V', titleColor);
                               }
                               if (this.blessur) {
                                   this.addAndFillCell(headers, '#', titleColor);
                               }
                               if (this.skillPos) {
                                   this.addAndFillCell(headers, "Skill", titleColor);
                               }
                               if (this.skill) {
                                   this.addAndFillCell(headers, "von", titleColor);
                               }
                               if (this.skillUp) {
                                   this.addAndFillCell(headers, "auf", titleColor);
                               }
                               if (this.tSkill) {
                                   this.addAndFillCell(headers, "Tr.", titleColor);
                               }
                               if (this.tNr) {
                                   this.addAndFillCell(headers, '#', titleColor);
                               }
                               if (this.prio) {
                                   this.addAndFillCell(headers, 'P', titleColor);
                               }
                               if (this.eins) {
                                   this.addAndFillCell(headers, "Eins", titleColor);
                               }
                               if (this.prozB) {
                                   this.addAndFillCell(headers, "Trainings-%", titleColor);
                               }
                               if (this.proz) {
                                   this.addAndFillCell(headers, '%', titleColor);
                               }
                               if (this.erw || this.erwB) {
                                   this.addAndFillCell(headers, (this.erwB ? "EW+" : "EW"), titleColor);
                               }
                               if (this.erwB) {
                                   this.addAndFillCell(headers, "EW-", titleColor);
                               }
                               if (this.erf) {
                                   this.addAndFillCell(headers, "Erfolg", titleColor);
                               }

                               return headers;
                           },  // Ende addTitles()
        'addValues'      : function(player, playerRow, color = '#FFFFFF') {
                               //const __IDXPRI = getIdxPriSkills(player.getPos());
                               //const __LEICOLOR = getColor('LEI');
                               const __TORCOLOR = getColor('TOR');
                               //const __OSBLAU = getColor("");
                               const __NEUCOLOR = color;
                               const __POSCOLOR = (player.isGoalie ? __TORCOLOR : getColor(player.pos));
                               const __COLOR = ((player.erfolg === undefined) ? color : __POSCOLOR);

                               // Balken-Grafik...
                               const __SCALE = 100;  // (this.barAbs ? 100 : (this.donor / 125));
                               const __OFFSET = 0;  // (this.barAbs ? 0 : Math.pow(__SCALE / 20, 2));
                               const __ZOOM = 50 + __SCALE / 2;

                               // Rueckgabewerte...
                               const __RET = [ 0.0, 0.0 ];  // Erwartung, Aufwertung

                               // Aktuelle Werte
                               if (this.id) {
                                   //this.addAndFillCell(playerRow, player.id, __POSCOLOR);
                               }
                               if (this.alter) {
                                   this.addAndFillCell(playerRow, player.age, __POSCOLOR, null, 0);
                               }
                               if (this.pos) {
                                   this.addAndFillCell(playerRow, player.pos, __POSCOLOR);
                               }
                               if (this.goalie) {
                                   //this.addAndFillCell(playerRow, player.isGoalie, __POSCOLOR);
                               }
                               if (this.opti) {
                                   this.addAndFillCell(playerRow, player.opti, __POSCOLOR, null, 2);
                               }
                               if (this.verl) {
                                   //this.addAndFillCell(playerRow, player.verl, __POSCOLOR);
                               }
                               if (this.blessur) {
                                   if (player.blessur !== undefined) {
                                       this.addAndFillCell(playerRow, ((player.blessur < 0) ? (player.blessur + " ZAT") : (player.blessur + " FIT")), __TORCOLOR, null, 0);
                                   } else {
                                       this.addFillCell(playerRow);
                                   }
                               }
                               if (this.skillPos) {
                                   this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, getSkillName(player.skillID, player.isGoalie), __COLOR);
                               }
                               if (this.skill) {
                                   this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, player.pSkill, __COLOR, null, 0);
                               }
                               if (this.skillUp) {
                                   if (player.erfolg) {
                                       this.addAndFillCell(playerRow, "-> " + (parseInt(player.pSkill, 0) + 1), __COLOR, null, 0);
                                   } else {
                                       this.addFillCell(playerRow);
                                   }
                               }
                               if (this.tSkill) {
                                   this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, player.tSkill, __COLOR, null, 1);
                               }
                               if (this.tNr) {
                                   this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, player.tNr, __COLOR, null, 0);
                               }
                               if (this.prio) {
                                   this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, player.isPrio ? '*' : "", __NEUCOLOR);
                               }
                               if (this.eins) {
                                   const __EINS = ((player.einsatz < 1) ? "" : ((player.einsatz === 3) ? player.pos : "EIN"));

                                   this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, __EINS, getColor(__EINS), null, 0);
                               }

                               const __PROZENT = (player.prozent || 0);

                               if (this.prozB) {
                                   this.addFillCell(playerRow, player.erfolg) && this.addAndBarCell(playerRow, __PROZENT, __SCALE, __OFFSET, 100, 10, __ZOOM);
                               }
                               if (this.proz) {
                                   this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, __PROZENT.toFixed(0) + '%', __COLOR, 'right');
                               }

                               const __ERWARTUNG = (player.erwartung || 0);
                               const __ERWARTPROZ = parseInt(__ERWARTUNG * 20, 10);

                               __RET[0] = __ERWARTUNG;

                               if (player.erfolg) {
                                   const __AUFWERTUNG = (player.isPrio ? 5 : 1);

                                   __RET[1] = __AUFWERTUNG;

                                   if (this.erwB) {
                                       this.addFillCell(playerRow, player.erfolg) && this.addAndBarCell(playerRow, __ERWARTPROZ, __SCALE, __OFFSET, 100, 10, __ZOOM);
                                   }
                                   if (this.erw) {
                                       this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, __ERWARTUNG, __COLOR, null, 2);
                                   } else if (this.erwB) {
                                       this.addFillCell(playerRow);
                                   }
                                   if (this.erf) {
                                       this.addAndFillCell(playerRow, __AUFWERTUNG, __COLOR, null, 0);
                                   }
                               } else {
                                   if (this.erw) {
                                       this.addFillCell(playerRow, player.erfolg) && this.addAndFillCell(playerRow, - __ERWARTUNG, __NEUCOLOR, 'right', 2);
                                   } else if (this.erwB) {
                                       this.addFillCell(playerRow);
                                   }
                                   if (this.erwB) {
                                       this.addFillCell(playerRow, player.erfolg) && this.addAndBarCell(playerRow, __ERWARTPROZ, __SCALE, __OFFSET, 100, 10, __ZOOM);
                                   }
                                   if (this.erf) {
                                       this.addFillCell(playerRow, player.erfolg) && this.addFillCell(playerRow);
                                   }
                               }
/***
                               // Aktuelle Werte (alt)
                               if (this.fpId) {
                                   this.addAndFillCell(playerRow, player.getFingerPrint(), __COLOR);
                               }
                               if (this.bar) {
                                   const __VALUE = player.getPrios(player.getPos(), player.__TIME.end);
                                   const __SCALE = (this.barAbs ? 100 : (this.donor / 125));
                                   const __OFFSET = (this.barAbs ? 0 : Math.pow(__SCALE / 20, 2));
                                   const __ZOOM = 50 + __SCALE / 2;

                                   this.addAndBarCell(playerRow, __VALUE, __SCALE, __OFFSET, 100, 10, __ZOOM);
                               }
                               if (this.tal) {
                                   this.addAndFillCell(playerRow, player.getTalent(), __COLOR);
                               }
                               if (this.quo) {
                                   this.addAndFillCell(playerRow, player.getAufwertungsSchnitt(), __COLOR, null, 2);
                               }
                               if (this.colIdx.Auf) {
                                   convertStringFromHTML(playerRow.cells, this.colIdx.Auf, function(aufwert) {
                                                                                               return player.boldPriSkillNames(aufwert);
                                                                                           });
                               }
                               if (this.aufw) {
                                   this.addAndFillCell(playerRow, player.boldPriSkillNames(player.getAufwert()), __COLOR, 'left');
                               }
                               if (this.geb) {
                                   this.addAndFillCell(playerRow, player.getGeb(), __COLOR, null, 0);
                               }
                               if (this.substAge) {
                                   convertStringFromHTML(playerRow.cells, this.colIdx.Age, function(value) {
                                                                                               UNUSED(value);
                                                                                               return parseFloat(player.getAge()).toFixed(2);
                                                                                           });
                               } else if (this.alter) {
                                   this.addAndFillCell(playerRow, player.getAge(), __COLOR, null, 2);
                               }
                               if (this.fix) {
                                   this.addAndFillCell(playerRow, player.getFixSkills(), __COLOR, null, 0);
                               }
                               if (this.tr) {
                                   this.addAndFillCell(playerRow, player.getTrainableSkills(), __COLOR, null, 0);
                               }
                               if (this.zat) {
                                   this.addAndFillCell(playerRow, player.getZatDone(), __COLOR, null, 0);
                               }
                               if (this.antHpt) {
                                   this.addAndFillCell(playerRow, player.getPriPercent(player.getPos()), __COLOR, null, 0);
                               }
                               if (this.antNeb) {
                                   this.addAndFillCell(playerRow, player.getSecPercent(player.getPos()), __COLOR, null, 0);
                               }
                               if (this.pri) {
                                   this.addAndFillCell(playerRow, player.getPrios(player.getPos()), __COLOR, null, 1);
                               }
                               if (this.skill) {
                                   this.addAndFillCell(playerRow, player.getSkill(), __COLOR, null, 2);
                               }
                               if (this.pos) {
                                   this.addAndFillCell(playerRow, player.getPos(), __NEUCOLOR);
                               }

                               // Einzelwerte mit Ende 18
                               if (this.colIdx.Einz) {
                                   if (this.substSkills) {
                                       convertArrayFromHTML(playerRow.cells, this.colIdx.Einz, player.skillsEnd, function(value, cell, arr, index) {
                                                                                                                     UNUSED(arr);
                                                                                                                     if (~ __IDXPRI.indexOf(index)) {
                                                                                                                         formatCell(cell, true, __OSBLAU, __NEUCOLOR, 1.0);
                                                                                                                     }
                                                                                                                     return value;
                                                                                                                 });
                                   } else {
                                       convertArrayFromHTML(playerRow.cells, this.colIdx.Einz, player.skills.length, function(value, cell, arr, index) {
                                                                                                                         UNUSED(arr);
                                                                                                                         if (~ __IDXPRI.indexOf(index)) {
                                                                                                                             formatCell(cell, true, __NEUCOLOR, null, 1.0);
                                                                                                                         }
                                                                                                                         return value;
                                                                                                                     });
                                   }
                               }
                               if (this.trE) {
                                   this.addAndFillCell(playerRow, player.getTrainableSkills(player.__TIME.end), __COLOR, null, 1);
                               }
                               if (this.zatE) {
                                   this.addAndFillCell(playerRow, player.getZatLeft(), __COLOR, null, 0);
                               }
                               if (this.antHptE) {
                                   this.addAndFillCell(playerRow, player.getPriPercent(player.getPos(), player.__TIME.end), __COLOR, null, 0);
                               }
                               if (this.antNebE) {
                                   this.addAndFillCell(playerRow, player.getSecPercent(player.getPos(), player.__TIME.end), __COLOR, null, 0);
                               }
                               if (this.priE) {
                                   this.addAndFillCell(playerRow, player.getPrios(player.getPos(), player.__TIME.end), __COLOR, null, 1);
                               }
                               if (this.skillE) {
                                   this.addAndFillCell(playerRow, player.getSkill(player.__TIME.end), __COLOR, null, 2);
                               }
***/
                               return __RET;
                           }  // Ende addValues(player, playerRow)
    });

// Klasse PlayerRecordTraining ******************************************************************

/*class*/ function PlayerRecordTraining /*{
    constructor*/(land, age, isGoalie, saison, currZAT, donation) {
        'use strict';

        this.land = land;
        this.age = age;
        this.isGoalie = isGoalie;

        this.saison = saison;
        this.currZAT = currZAT;
        this.donation = donation;
        this.mwFormel = ((this.saison < 10) ? this.__MWFORMEL.alt : this.__MWFORMEL.S10);

        // in new PlayerRecordTraining() definiert:
        // this.land: TLA des Geburtslandes
        // this.age: Ganzzahliges Alter des Spielers
        // this.isGoalie: Angabe, ob es ein TOR ist
        // this.mwFormel: Benutzte MW-Formel, siehe __MWFORMEL
        // this.donation: Jugendfoerderungsbetrag in Euro

        // in this.initPlayer() definiert:
        // this.zatGeb: ZAT, an dem der Spieler Geburtstag hat, -1 fuer "noch nicht zugewiesen", also '?'
        // this.zatAge: Bisherige erfolgte Trainings-ZATs
        // this.birth: Universell eindeutige Nummer des Geburtstags-ZATs des Spielers
        // this.talent: Talent als Zahl (-1=wenig, 0=normal, +1=hoch)
        // this.aufwert: Aufwertungsstring

        // in this.calcSkills() definiert:
        // this.positions[][]: Positionstexte und Optis; TOR-Index ist 5
        // this.skills[]: Einzelskills
        // this.skillsEnd[]: Berechnet aus this.skills, this.age und aktuellerZat
        // this.zatLeft: ZATs bis zum Ende 18 (letzte Ziehmoeglichkeit)
        // this.restEnd: Korrekturterm zum Ausgleich von Rundungsfehlern mit Ende 18
        //               (also Skills, die nicht explizit in this.skillsEnd stehen)

        // in this.calcZusatz()/setZusatz() definiert:
        // this.trainiert: Anzahl der erfolgreichen Trainingspunkte
        // indirekt this.zatAge und this.bestPos

        // in this.createWarnDraw() definiert:
        // this.warnDraw: Behandlung von Warnungen Ende 18
        // this.warnDrawAufstieg: Behandlung von Warnungen bei Aufstieg

        // in this.getPos() definiert:
        // this.bestPos: erster (bester) Positionstext
    }
//}

Class.define(PlayerRecordTraining, Object, {
        '__TIME'                : {   // Zeitpunktangaben
                                      'cre' : 0,  // Jugendspieler angelegt (mit 12 Jahren)
                                      'beg' : 1,  // Jugendspieler darf trainieren (wird 13 Jahre alt)
                                      'now' : 2,  // Aktueller ZAT
                                      'end' : 3   // Jugendspieler wird Ende 18 gezogen (Geb. - 1 bzw. ZAT 71 fuer '?')
                                  },
        '__MWFORMEL'            : {   // Zu benutzende Marktwertformel
                                      'alt' : 0,  // Marktwertformel bis Saison 9 inklusive
                                      'S10' : 1   // Marktwertformel MW5 ab Saison 10
                                  },
        '__MAXPRISKILLS'        : 4 * 99,
        'toString'              : function() {  // Bisher nur die noetigsten Werte ausgegeben...
                                      __LOG[0](this.positions);
                                      let result = "Alter\t\t" + this.age + "\n\n";
                                      result += "Aktuelle Werte\n";
                                      result += "Skillschnitt\t" + this.getSkill().toFixed(2) + '\n';
                                      result += "Optis und Marktwerte";

                                      for (let pos of this.positions) {
                                          result += "\n\t" + pos + '\t';
                                          result += this.getOpti(pos).toFixed(2) + '\t';
                                          result += getNumberString(this.getMarketValue(pos).toString());
                                      }

                                      result += "\n\nWerte mit Ende 18\n";
                                      result += "Skillschnitt\t" + this.getSkill(this.__TIME.end).toFixed(2) + '\n';
                                      result += "Optis und Marktwerte";

                                      for (let pos of this.positions) {
                                          result += "\n\t" + this.getPos() + '\t';
                                          result += this.getOpti(pos, this.__TIME.end).toFixed(2) + '\t';
                                          result += getNumberString(this.getMarketValue(pos, this.__TIME.end).toString());
                                      }

                                      return result;
                                  },  // Ende this.toString()
        'initPlayer'            : function(data, index, isSkillData = false) {  // isSkillData: true = Skilldaten, false = Basiswerte (Geb., Talent, Aufwertungen) oder keine
                                      this.zatAge = 0;  // TODO

                                      if (data !== undefined) {
                                          if (isSkillData) {
                                              this.setSkills(data[index]);
                                          } else if (data.length >= 2){
                                              this.setGeb(data[0][index]);
                                              this.talent = data[1][index];
                                              this.aufwert = data[2][index];
                                          } else {
                                              // keine Daten
                                          }
                                      }
                                  },  // Ende this.initPlayer()
        'createWarnDraw'        : function(ziehmich = null, klasse = 1) {  // ziehmich: input Element zum Ziehen; klasse: Spielklasse 1, 2, 3
                                      // Objekte fuer die Verwaltung der Ziehwarnungen...
                                      this.warnDraw = undefined;
                                      this.warnDrawAufstieg = undefined;
                                      if (ziehmich) {
                                          const __LASTZAT = this.currZAT + this.getZatLeft();

                                          if (__LASTZAT < 72) {  // U19
                                              this.warnDraw = new WarnDrawPlayer(this, getColor('STU'));  // rot
                                              __LOG[5](this.getAge().toFixed(2), "rot");
                                          } else if (__LASTZAT < Math.max(2, klasse) * 72) {  // Rest bis inkl. U18 (Liga 1 und 2) bzw. U17 (Liga 3)
                                              // do nothing
                                          } else if (__LASTZAT < (klasse + 1) * 72) {  // U17/U16 je nach Liga 2/3
                                              this.warnDrawAufstieg = new WarnDrawPlayer(this, getColor('OMI'));  // magenta
                                              this.warnDrawAufstieg.setAufstieg();
                                              __LOG[5](this.getAge().toFixed(2), "magenta");
                                          }
                                      }
                                  },  // Ende this.createWarnDraw()
        'setSkills'             : function(skills) {
                                      // Berechnet die Opti-Werte, sortiert das Positionsfeld und berechnet die Einzelskills mit Ende 18
                                     this.skills = skills;

                                      const __POSREIHEN = [ 'ABW', 'DMI', 'MIT', 'OMI', 'STU', 'TOR' ];
                                      this.positions = [];
                                      for (let index = 0; index < __POSREIHEN.length; index++) {
                                          const __REIHE = __POSREIHEN[index];

                                          this.positions[index] = [ __REIHE, this.getOpti(__REIHE) ];
                                      }

                                      // Sortieren
                                      __LOG[0](this.positions);
                                      //sortPositionArray(this.positions);
                                      //__LOG[0](this.positions);
                                  },  // Ende this.setSkills()
        'prognoseSkills'        : function() {
                                      // Einzelskills mit Ende 18 berechnen
                                      this.skillsEnd = [];

                                      const __ZATDONE = this.getZatDone();
                                      const __ZATTOGO = this.getZatLeft();
                                      const __ADDRATIO = (__ZATDONE ? __ZATTOGO / __ZATDONE : 0);

                                      let addSkill = __ZATTOGO * this.getAufwertungsSchnitt();

                                      for (let i in this.skills) {
                                          const __SKILL = this.skills[i];
                                          let progSkill = __SKILL;

                                          if (isTrainableSkill(i)) {
                                              // Auf ganze Zahl runden und parseInt(), da das sonst irgendwie als String interpretiert wird
                                              const __ADDSKILL = Math.min(99 - progSkill, getMulValue(__ADDRATIO, __SKILL, 0, NaN));

                                              progSkill += __ADDSKILL;
                                              addSkill -= __ADDSKILL;
                                          }

                                          this.skillsEnd[i] = progSkill;
                                      }
                                      this.restEnd = addSkill;
                                  },  // Ende this.prognoseSkills()
        'setZusatz'             : function(zatAge, trainiert, bestPos) {
                                      // Setzt Nebenwerte fuer den Spieler (geht ohne initPlayer())
                                      if (zatAge !== undefined) {
                                          this.zatAge = zatAge;
                                      }
                                      this.trainiert = trainiert;
                                      this.bestPos = bestPos;
                                  },
        'calcZusatz'            : function() {
                                      // Ermittelt Nebenwerte fuer den Spieler und gibt sie alle zurueck (nach initPlayer())
                                      // this.zatAge und this.skills bereits in initPlayer() berechnet
                                      this.trainiert = this.getTrainiert(true);  // neu berechnet aus Skills
                                      let bestPos = this.getPos(-1);  // hier: -1 explizit angeben, damit neu ermittelt (falls this.bestPos noch nicht belegt)

                                      return {
                                                 'zatAge'     : this.zatAge,
                                                 'trainiert'  : this.trainiert,
                                                 'bestPos'    : bestPos
                                             };
                                  },
        'getGeb'                : function() {
                                      return (this.zatGeb < 0) ? '?' : this.zatGeb;
                                  },
        'setGeb'                : function(gebZAT) {
                                      this.zatGeb = gebZAT;
                                      this.zatAge = this.calcZatAge(this.currZAT);
                                      this.birth = (36 + this.saison) * 72 + this.currZAT - this.zatAge;
                                  },
        'calcZatAge'            : function(currZAT) {
                                      let zatAge;

                                      if (this.zatGeb !== undefined) {
                                          let ZATs = 72 * (this.age - ((currZAT < this.zatGeb) ? 12 : 13));  // Basiszeit fuer die Jahre seit Jahrgang 13

                                          if (this.zatGeb < 0) {
                                              zatAge = ZATs + currZAT;  // Zaehlung begann Anfang der Saison (und der Geburtstag wird erst nach dem Ziehen bestimmt)
                                          } else {
                                              zatAge = ZATs + currZAT - this.zatGeb;  // Verschiebung relativ zum Geburtstag (von -zatGeb, ..., 0, ..., 71 - zatGeb)
                                          }
                                      }

                                      return zatAge;
                                  },
        'getZatAge'             : function(when = this.__TIME.now) {
                                      if (when === this.__TIME.end) {
                                          return (18 - 12) * 72 - 1;  // (max.) Trainings-ZATs bis Ende 18
                                      } else if (this.zatAge !== undefined) {
                                          return this.zatAge;
                                      } else {
                                          __LOG[3]("Empty getZatAge()");

                                          return NaN;
                                      }
                                  },
        'getZatDone'            : function(when = this.__TIME.now) {
                                      return Math.max(0, this.getZatAge(when));
                                  },
        'getZatLeft'            : function(when = this.__TIME.now) {
                                      if (this.zatLeft === undefined) {
                                          this.zatLeft = this.getZatDone(this.__TIME.end) - this.getZatDone(when);
                                      }

                                      return this.zatLeft;
                                  },
        'calcZiehIndex'         : function() {
                                      //const __RESTZAT = this.getZatAge(this.__TIME.end) - this.getZatAge() + this.currZAT;
                                      //const __INDEX = parseInt(__RESTZAT / 6 + 1) - 1;  // Lfd. Nummer des Abrechnungsmonats (0-basiert)

                                      return (this.warnDraw && this.warnDraw.calcZiehIndex(this.currZAT));
                                  },
        'isZiehAufstieg'        : function() {
                                      return (this.warnDrawAufstieg && this.warnDrawAufstieg.isZiehAufstieg());
                                  },
        'getAge'                : function(when = this.__TIME.now) {
                                      if (this.mwFormel === this.__MWFORMEL.alt) {
                                          return (when === this.__TIME.end) ? 18 : this.age;
                                      } else {  // Geburtstage ab Saison 10...
                                          return (13.00 + this.getZatAge(when) / 72);
                                      }
                                  },
        'getTrainiert'          : function(recalc = false) {
                                      if (recalc || (this.trainiert === undefined)) {
                                          this.trainiert = this.getTrainableSkills();
                                      }

                                      return this.trainiert;
                                  },
        'getAufwertungsSchnitt' : function() {
                                      const __ZATDONE = this.getZatDone();

                                      if (__ZATDONE) {
                                          return parseFloat(this.getTrainiert() / __ZATDONE);
                                      } else {
                                          // Je nach Talentklasse mittlerer Aufwertungsschnitt aller Talente der Klasse
                                          // (gewichtet nach Verteilung der Talentstufen in dieser Talentklasse)
                                          return (1 + (this.talent / 3.6)) * (this.donation / 10000);
                                      }
                                  },
        'getPos'                : function(idx = 0) {
                                      __LOG[0](this.positions);
                                      const __IDXOFFSET = 1;

                                      switch (idx) {
                                      case -1 : return (this.bestPos = this.positions[this.isGoalie ? 5 : 0][0]);
                                      case  0 : return this.bestPos;
                                      default : return this.positions[idx - __IDXOFFSET][0];
                                      }
                                  },
        'getPosPercent'         : function(idx = 0) {
                                      __LOG[0](this.positions);
                                      const __IDXOFFSET = 1;
                                      const __OPTI = this.positions[this.isGoalie ? 5 : 0][1];
                                      let optiSec = __OPTI;

                                      switch (idx) {
                                      case -1 : break;  // __OPTI
                                      case  0 : optiSec = (this.isGoalie ? 0 : this.positions[1][1]);  // Backup-Wert (TOR: keiner)
                                                break;
                                      default : optiSec = this.positions[idx - __IDXOFFSET][1];
                                      }

                                      return parseFloat(100 * optiSec / __OPTI);
                                  },
        'getTalent'             : function() {
                                      return (this.talent < 0) ? 'wenig' : (this.talent > 0) ? 'hoch' : 'normal';
                                  },
        'getAufwert'            : function() {
                                      return this.aufwert;
                                  },
        'boldPriSkillNames'     : function(text) {
                                      const __PRISKILLNAMES = this.getPriSkillNames();

                                      return (! text) ? text : text.replace(/\w+/g, function(name) {
                                                                                        return ((~ __PRISKILLNAMES.indexOf(name)) ? '<b>' + name + '</b>' : name);
                                                                                    });
                                  },
        'getPriSkillNames'      : function(pos = undefined) {
                                      return getSkillNameArray(getIdxPriSkills(pos ? pos : this.getPos()), this.isGoalie);
                                  },
        'getSkillSum'           : function(when = this.__TIME.now, idxSkills = undefined, restRate = 15) {
                                      let cachedItem;

                                      if (idxSkills === undefined) {  // Gesamtsumme ueber alle Skills wird gecached...
                                          cachedItem = ((when === this.__TIME.end) ? 'skillSumEnd' : 'skillSum');

                                          const __CACHED = this[cachedItem];

                                          if (__CACHED !== undefined) {
                                              return __CACHED;
                                          }

                                          idxSkills = getIdxAllSkills();
                                      }

                                      const __SKILLS = ((when === this.__TIME.end) ? this.skillsEnd : this.skills);
                                      let sumSkills = ((when === this.__TIME.end) ? (restRate / 15) * this.restEnd : 0);

                                      if (__SKILLS) {
                                          for (let idx of idxSkills) {
                                              sumSkills += __SKILLS[idx];
                                          }
                                      }

                                      if (cachedItem !== undefined) {
                                          this[cachedItem] = sumSkills;
                                      }

                                      return sumSkills;
                                  },
        'getSkill'              : function(when = this.__TIME.now) {
                                      return this.getSkillSum(when) / 17;
                                  },
        'getOpti'               : function(pos, when = this.__TIME.now) {
                                      UNUSED(pos, when);
                                      return 85;
/*                                      const __SUMALLSKILLS = this.getSkillSum(when);
                                      const __SUMPRISKILLS = this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4);
                                      const __OVERFLOW = Math.max(0, __SUMPRISKILLS - this.__MAXPRISKILLS);
if (this.zatGeb === 24) {
    console.error("__OVERFLOW = " + __OVERFLOW);
    console.error("__SUMALLSKILLS = " + __SUMALLSKILLS);
    console.error("__SUMPRISKILLS = " + __SUMPRISKILLS);
    console.error("getOpti(" + pos + ") = " + ((4 * (__SUMPRISKILLS - __OVERFLOW) + __SUMALLSKILLS) / 27));
}
                                      return (4 * (__SUMPRISKILLS - __OVERFLOW) + __SUMALLSKILLS) / 27;
*/
                                  },
        'getPrios'              : function(pos, when = this.__TIME.now) {
                                      return Math.min(this.__MAXPRISKILLS, this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4)) / 4;
                                  },
        'getPriPercent'         : function(pos, when = this.__TIME.now) {
                                      const __SUMPRISKILLS = this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4);
                                      const __SUMSECSKILLS = this.getSkillSum(when, getIdxSecSkills(pos), 7);
                                      const __OVERFLOW = Math.max(0, __SUMPRISKILLS - this.__MAXPRISKILLS);

                                      return (100 * (__SUMPRISKILLS - __OVERFLOW)) / (__SUMPRISKILLS + __SUMSECSKILLS);
                                  },
        'getSecPercent'         : function(pos, when = this.__TIME.now) {
                                      const __SUMPRISKILLS = this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4);
                                      const __SUMSECSKILLS = this.getSkillSum(when, getIdxSecSkills(pos), 7);
                                      const __OVERFLOW = Math.max(0, __SUMPRISKILLS - this.__MAXPRISKILLS);

                                      return (100 * (__SUMSECSKILLS + __OVERFLOW)) / (__SUMPRISKILLS + __SUMSECSKILLS);
                                  },
        'getTrainableSkills'    : function(when = this.__TIME.now) {
                                      return this.getSkillSum(when, getIdxTrainableSkills());
                                  },
        'getFixSkills'          : function() {
                                      return this.getSkillSum(this.__TIME.now, getIdxFixSkills());
                                  },
        'getMarketValue'        : function(pos, when = this.__TIME.now) {
                                      const __AGE = this.getAge(when);

                                      if (this.mwFormel === this.__MWFORMEL.alt) {
                                          return Math.round(Math.pow((1 + this.getSkill(when)/100) * (1 + this.getOpti(pos, when)/100) * (2 - __AGE/100), 10) * 2);    // Alte Formel bis Saison 9
                                      } else {  // MW-Formel ab Saison 10...
                                          const __MW5TF = 1.00;  // Zwischen 0.97 und 1.03

                                          return Math.round(Math.pow(1 + this.getSkill(when)/100, 5.65) * Math.pow(1 + this.getOpti(pos, when)/100, 8.1) * Math.pow(1 + (100 - __AGE)/49, 10) * __MW5TF);
                                      }
                                  },
        'getFingerPrint'        : function() {
                                      // Jeweils gleichbreite Werte: (Alter/Geb.=>Monat), Land, Talent ('-', '=', '+')...
                                      const __BASEPART = padNumber(this.birth / 6, 3) + padLeft(this.land, -3);
                                      const __TALENT = '-=+'[this.talent + 1];

                                      if (this.skills === undefined) {
                                          return __BASEPART + getValue(__TALENT, "");
                                      } else {
                                          const __SKILLS = this.skills;
                                          const __FIXSKILLS = getIdxFixSkills().slice(-4);  // ohne die Nullen aus FUQ und ERF
                                          const __FIXSKILLSTR = __FIXSKILLS.map(function(idx) {
                                                                                    return padNumber(__SKILLS[idx], -2);
                                                                                }).join("");

                                          // Jeweils gleichbreite Werte: Zusaetzlich vier der sechs Fixskills...
                                          return (__BASEPART + getValue(__TALENT, '?') + __FIXSKILLSTR);
                                      }
                                  },
        'isFingerPrint'         : function(fpA, fpB) {
                                      if (fpA && fpB) {
                                          if (fpA === fpB) {
                                              return true;  // voellig identisch
                                          } else if (this.isBaseFingerPrint(fpA, fpB)) {
                                              return 1;  // schwaches true
                                          }
                                      }

                                      return false;
                                  },
        'isBaseFingerPrint'     : function(fpA, fpB) {
                                      if (fpA && fpB) {
                                          if (this.getBaseFingerPrint(fpA) === this.getBaseFingerPrint(fpB)) {
                                              // Base ist identisch...
                                              if ((getValue(fpA[6], '?') === '?') || (getValue(fpB[6], '?') === '?') || (fpA[6] === fpB[6])) {
                                                  // ... und auch das Talent-Zeichen ist leer oder '?'...
                                                  return true;
                                              }
                                          }
                                      }

                                      return false;
                                  },
        'getBaseFingerPrint'    : function(fingerprint) {
                                      return (fingerprint ? fingerprint.slice(0, 6) : undefined);
                                  },
        'getCatFromFingerPrint' : function(fingerprint) {
                                      return (fingerprint ? floorValue((fingerprint.slice(0, 3) - 1) / 12) : undefined);
                                  },
        'getCat'                : function() {
                                      return (this.birth ? floorValue((this.birth - 1) / 72) : undefined);
                                  },
        'findInFingerPrints'    : function(fingerprints) {
                                      const __MYFINGERPRINT = this.getFingerPrint();  // ggfs. unvollstaendiger Fingerprint
                                      const __MYCAT = this.getCat();
                                      const __RET = [];

                                      if (__MYCAT !== undefined) {
                                          for (let id in fingerprints) {
                                              const __CAT = this.getCatFromFingerPrint(id);

                                              if (__CAT === __MYCAT) {
                                                  if (this.isFingerPrint(id, __MYFINGERPRINT)) {
                                                      __RET.push(id);
                                                      break;  // erster Treffer zaehlt
                                                  }
                                              }
                                          }
                                      }

                                      return ((__RET.length === 1) ? __RET[0] : undefined);
                                  }
    });

// Ende Hilfs-Klassen *****************************************************************

// Hilfsfunktionen **********************************************************************

// Schaut nach, ob der uebergebene Index zu einem trainierbaren Skill gehoert
// Die Indizes gehen von 0 (SCH) bis 16 (EIN)
function isTrainableSkill(idx) {
    const __TRAINABLESKILLS = getIdxTrainableSkills();
    const __IDX = parseInt(idx, 10);
    let result = false;

    for (let idxTrainable of __TRAINABLESKILLS) {
        if (__IDX === idxTrainable) {
            result = true;
            break;
        }
    }

    return result;
}

// Gibt alle Skill-Namen zurueck
function getAllSkillNames(isGoalie = false) {
    if (isGoalie) {
        return [ 'ABS', 'STS', 'FAN', 'STB', 'SPL', 'REF', 'FUQ', 'ERF', 'AGG', 'PAS', 'AUS', 'UEB', 'WID', 'SEL', 'DIS', 'ZUV', 'EIN' ];
    } else {
        return [ 'SCH', 'BAK', 'KOB', 'ZWK', 'DEC', 'GES', 'FUQ', 'ERF', 'AGG', 'PAS', 'AUS', 'UEB', 'WID', 'SEL', 'DIS', 'ZUV', 'EIN' ];
    }
}

// Gibt den Skill-Namen zu einem Index zurueck
function getSkillName(idx, isGoalie = false) {
    const __ALLNAMES = getAllSkillNames(isGoalie);

    return ((idx != undefined) ? __ALLNAMES[idx] : idx);
}

// Gibt die Skill-Namen zu einem Index-Array zurueck
function getSkillNameArray(idxArr, isGoalie = false) {
    return (idxArr ? idxArr.map(function(item) {
                                    return getSkillName(item, isGoalie);
                                }) : idxArr);
}

// Gibt den Index zu einem Skill-Namen zurueck
function getSkillID(skillName, isGoalie = false) {
    const __ALLNAMES = getAllSkillNames(isGoalie);

    return ((skillName != undefined) ? __ALLNAMES.indexOf(skillName) : skillName);
}

// Gibt die Indices zu einem Skill-Namen-Array zurueck
function getSkillIdArray(nameArr, isGoalie = false) {
    return (nameArr ? nameArr.map(function(item) {
                                      return getSkillID(item, isGoalie);
                                  }) : nameArr);
}

// Gibt die Indizes aller Skills zurueck
function getIdxAllSkills() {
    return [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
}

// Gibt die Indizes der trainierbaren Skills zurueck
function getIdxTrainableSkills() {
    return [ 0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 15 ];
}

// Gibt die Indizes der Fixskills zurueck
function getIdxFixSkills() {
    return [ 6, 7, 12, 13, 14, 16 ];
}

// Gibt die Indizes der Primaerskills zurueck
function getIdxPriSkills(pos) {
    switch (pos) {
        case 'TOR' : return [ 2, 3, 4, 5 ];
        case 'ABW' : return [ 2, 3, 4, 15 ];
        case 'DMI' : return [ 1, 4, 9, 11 ];
        case 'MIT' : return [ 1, 3, 9, 11 ];
        case 'OMI' : return [ 1, 5, 9, 11 ];
        case 'STU' : return [ 0, 2, 3, 5 ];
        default :    return [];
    }
}

// Gibt die Indizes der (trainierbaren) Sekundaerskills zurueck
function getIdxSecSkills(pos) {
    switch (pos) {
        case 'TOR' : return [ 0, 1, 8, 9, 10, 11, 15 ];
        case 'ABW' : return [ 0, 1, 5, 8, 9, 10, 11 ];
        case 'DMI' : return [ 0, 2, 3, 5, 8, 10, 15 ];
        case 'MIT' : return [ 0, 2, 4, 5, 8, 10, 15 ];
        case 'OMI' : return [ 0, 2, 3, 4, 8, 10, 15 ];
        case 'STU' : return [ 1, 4, 8, 9, 10, 11, 15 ];
        default :    return [];
    }
}

// Gibt die zur Position gehoerigen Primaerskills zurueck
function getPrimarySkills(pos) {
    switch (pos) {
        case "TOR": return "FAN,STB,SPL,REF";
        case "ABW": return "KOB,ZWK,DEC,ZUV";
        case "DMI": return "BAK,DEC,PAS,UEB";
        case "MIT": return "BAK,ZWK,PAS,UEB";
        case "OMI": return "BAK,GES,PAS,UEB";
        case "STU": return "SCH,KOB,ZWK,GES";
        case "LEI": return "";
        default:    return "";
    }
}

// Gibt zurueck, ob der Skill ein zur Position gehoeriger Primaerskill ist
function isPrimarySkill(pos, skill) {
    const __PRIMARYSKILLS = getPrimarySkills(pos);

    return (__PRIMARYSKILLS.indexOf(skill) > -1);
}

// Hilfsfunktionen fuer das Training **********************************************************************

// Konstante 0.99 ^ 99
const __099HOCH99 = 0.36972963764972677265718790562881;

const __FACTORS = [ 1.00, 1.10, 1.25, 1.35 ];  // Tribuene, Bank, teilweise, durchgehend

// Gibt die Trainingswahrscheinlichkeit zurueck
// Format der Rueckgabe: "aaa.bb %", "aa.bb %" bzw. "a.bb %" (keine Deckelung bei 99.00 %)
// probStr: Basis-Wahrscheinlichkeit (= Tribuene) als Prozent-String
// mode: Art des Einsatzes: 0 - Tribuene, 1 - Bank, 2 - Teilweiser Einsatz, 3 - Volleinsatz
// unit: Einheitensymbol (Default: " %")
// fixed: Nachkommastellen (Default: 2)
// limit: Obere Grenze, z.B. 99.0 (Default: aus)
function getProbabilityStr(probStr, mode, unit = " %", fixed = 2, limit = undefined) {
    if ((probStr == "0.00 %") || (probStr == "Trainerskill zu niedrig!")) {
        return "";
    } else {
        let ret = parseFloat(probStr) * __FACTORS[mode];

        if (limit) {
            ret = Math.min(limit, ret);
        }

        return ret.toFixed(fixed).toString() + unit;
    }
}

// Gibt die Position dieser Zeile zurueck
function getPos(row, colIdxChance) {
    const __CLASSNAME = row.cells[colIdxChance].className;

    return __CLASSNAME;
}

// Gibt den Skill dieser Zeile zurueck
function getSkill(row, colIdxSkill) {
    const __HTML = row.cells[colIdxSkill].innerHTML;
    //const __SKILL = __HTML.substr(__HTML.indexOf("\"selected\"") + 11, 3);
    const __SKILL = __HTML.substr(__HTML.indexOf("selected=\"\"") + 12, 3);

    return __SKILL;
}

// Gibt den Spieler in dieser Zeile zurueck
function getSpieler(row, colIdxSpieler) {
    const __HTML = row.cells[colIdxSpieler].innerHTML;
    const __SEARCH = "javascript:spielerinfo(";
    const __INDEX1 = __HTML.indexOf(__SEARCH);
    const __INDEX2 = __HTML.indexOf(')', __INDEX1);
    const __INDEX3 = __HTML.indexOf('>', __INDEX2);
    const __INDEX4 = __HTML.indexOf("</a>", __INDEX3);
    const __SID = ((~ __INDEX1) ? parseInt(__HTML.substring(__INDEX1 + __SEARCH.length, __INDEX2), 10) : undefined);
    const __SNAME = ((~ __INDEX3) ? __HTML.substring(__INDEX3 + 1, __INDEX4) : undefined);

    return {
               'id'   : __SID,
               'name' : __SNAME
           };
}

// Gibt die Spieler-ID in dieser Zeile zurueck
function getSpielerID(row, colIdxSpieler) {
    return getSpieler(row, colIdxSpieler).id;
}

// Gibt den Spielernamen in dieser Zeile zurueck
function getSpielerName(row, colIdxSpieler) {
    return getSpieler(row, colIdxSpieler).name;
}

// Gibt die Wahrscheinlichkeit fuer eine Aufwertung zurueck
function getProbString(row, colIdxChance) {
    const __PROBSTR = row.cells[colIdxChance].textContent;

    return __PROBSTR;
}

// Gibt das Alter des Spielers dieser Zeile zurueck
function getAlter(row, colIdxAlter) {
    const __ALTERSTR = row.cells[colIdxAlter].textContent;

    return parseInt(__ALTERSTR, 10);
}

// Gibt den Skillwert des trainierten Skills des Spielers dieser Zeile zurueck
function getPSkill(row, colIdxPSkill) {
    const __PSKILLSTR = row.cells[colIdxPSkill].textContent;

    return ((__PSKILLSTR.length === 0) ? undefined : parseInt(__PSKILLSTR, 10));
}

// Gibt den Trainer-Skill dieser Zeile zurueck
function getTSkill(row, colIdxTSkill) {
    const __HTML = row.cells[colIdxTSkill].innerHTML;
    //const __TSKILLSTR = __HTML.substr(__HTML.indexOf("\"selected\"") + 15);
    const __TSKILLSTR = __HTML.substr(__HTML.indexOf("selected=\"\"") + 16);
    const __TSKILL = ((__TSKILLSTR.substr(0, 1) === '/') ? undefined : parseFloat(__TSKILLSTR.substr(0, __TSKILLSTR.indexOf('<'))));

    return __TSKILL;
}

// Gibt die Trainer-Zuordnung dieser Zeile zurueck
function getTrainerNr(row, colIdxTrainer) {
    const __HTML = row.cells[colIdxTrainer].innerHTML;
    //const __TRAINERSTR = __HTML.substr(__HTML.indexOf("\"selected\"") + 13);
    const __TRAINERSTR = __HTML.substr(__HTML.indexOf("selected=\"\"") + 14);
    const __TRAINERNR = ((__TRAINERSTR.substr(2, 1) === '/') ? undefined : parseInt(__TRAINERSTR.substr(0, 1), 10));

    return __TRAINERNR;
}

// Gibt das Gehalt eines Trainers zurueck
// tSkill: Trainer-Skill (60, 62.5, ..., 97.5, 99.5)
// tZATs: Trainer-Vertragslänge (6, 12, ..., 90, 96)
// return Trainer-Gehalt eines Trainers von bestimmtem Skill
function calcTGehalt(tSkill = 99.5, tZATs = 96) {
    const __OLDTSKILL = parseInt((2 * tSkill - 100.5).toFixed(0), 10);
    const __SKILLFACT = Math.pow(__OLDTSKILL - 16.34, 1.26);
    const __ZATFACT = (596 - tZATs) / 500;
    const __GEHALT = 1950 * __SKILLFACT * __ZATFACT;

    return __GEHALT;
}

// Gibt die Wahrscheinlichkeit fuer ein Training zurueck
// alter: Alter des Spielers
// pSkill: Derzeitiger Wert des zu trainierenden Spieler-Skills
// tSkill: Trainer-Skill (60, 62.5, ..., 97.5, 99.5)
// mode: Einsatztyp (0: Tribuene/Basis, 1: Bank, 2: teilweise, 3: durchgehend)
// limit: Obere Grenze (99), Default ist unbegrenzt (undefined)
// return Trainingswahrscheinlichkeit
function calcProbPercent(alter, pSkill = 100, tSkill = 99.5, mode = 0, limit = undefined) {
    const __SKILLDIFF = tSkill - pSkill;
    const __SKILLPLUS = Math.max(0, __SKILLDIFF + 0.5);
    const __SKILLFACT = __SKILLPLUS / (101 - __SKILLPLUS);
    const __ALTERFACT = Math.pow((100 - alter) / 37, 7);
    const __PROB = __099HOCH99 * __SKILLFACT * __ALTERFACT * __FACTORS[mode];

    return ((limit === undefined) ? __PROB : Math.min(limit, __PROB));
}

// Gibt die Wahrscheinlichkeit fuer ein Training zurueck
// alter: Alter des Spielers
// tSkill: Trainer-Skill (60, 62.5, ..., 97.5, 99.5)
// mode: Einsatztyp (0: Tribuene/Basis, 1: Bank, 2: teilweise, 3: durchgehend)
// prob: Gewuenschte Wahrscheinlichkeit (Default ist 99)
// return Spieler-Skill eines zu trainierenden Spielers, der optimal trainiert wird
function calcMinPSkill(alter, tSkill = 99.5, mode = 0, prob = 99) {
    const __ALTERFACT = Math.pow((100 - alter) / 37, 7);
    const __SKILLFACT = prob / (__099HOCH99 * __ALTERFACT * __FACTORS[mode]);
    const __SKILLPLUS = 101 * __SKILLFACT / (__SKILLFACT + 1);
    const __SKILLDIFF = Math.max(0, __SKILLPLUS) - 0.5;
    const __PSKILL = tSkill - __SKILLDIFF;

    return Math.max(0, __PSKILL);
}

// ==================== Ende Abschnitt genereller Code zur Anzeige des Trainings ====================

// ==================== Page-Manager fuer zu bearbeitende Seiten ====================

// Verarbeitet Ansicht "Haupt" (Managerbuero) zur Ermittlung des aktuellen ZATs
const procHaupt = new PageManager("Haupt (Managerb\xFCro)", null, () => {
        const __TEAMPARAMS = getTeamParamsFromTable(getTable(1), __TEAMSEARCHHAUPT);  // Link mit Team, Liga, Land...

        return {
                'teamParams'  : __TEAMPARAMS,
//                'menuAnchor'  : getTable(0, 'div'),
                'hideMenu'    : true,
                'oldData'     : false,
                'showForm'    : {
                                    'showForm'  : true
                                }
            };
    }, async optSet => {
        const __ZATCELL = getProp(getProp(getRows(0), 2), 'cells', { })[0];
        const __NEXTZAT = getZATNrFromCell(__ZATCELL);  // "Der naechste ZAT ist ZAT xx und ..."
        const __CURRZAT = __NEXTZAT - 1;
        const __DATAZAT = getOptValue(optSet.datenZat);

        if (__CURRZAT >= 0) {
            __LOG[2]("Aktueller ZAT: " + __CURRZAT);

            // Neuen aktuellen ZAT speichern...
            setOpt(optSet.aktuellerZat, __CURRZAT, false);

            if (__CURRZAT !== __DATAZAT) {
                __LOG[2](__LOG.changed(__DATAZAT, __CURRZAT));

                __LOG[1]("vor DELETE:" + optSet);

                // ... und ZAT-bezogene Daten als veraltet markieren (NIE die Optionen, die nach 'old' gehen!)
                const __IGNLIST = Object.assign({
                                                    'datenZat'    : true,
                                                    'oldDatenZat' : true
                                                }, __LASTZATCLASS.optSelect);

                await __TEAMCLASS.deleteOptions(__IGNLIST).catch(defaultCatch);

                const __CLASSIFICATION = new Classification('old');

                __LOG[1]("vor RENAME:" + optSet);

                // Daten in 'old'-Daten ueberfuehren...
                __CLASSIFICATION.optSelect = Object.Map(__LASTZATCLASS.optSelect, () => false);  // false: Kein reload
                __CLASSIFICATION.optSet = optSet;
                await __CLASSIFICATION.renameOptions();

                __LOG[1]("vor SAVE:" + optSet);

                // Daten in 'old' speichern...
                __CLASSIFICATION.optSelect = Object.Map(__LASTZATCLASS.optSelect, () => true);  // true: Speichern
                await __CLASSIFICATION.saveOptions();

                // Stand der alten Daten merken...
                setOpt(optSet.oldDatenZat, __DATAZAT, false);

                // Neuen Daten-ZAT speichern...
                setOpt(optSet.datenZat, __CURRZAT, false);
            }
        }

        return true;
    });

// Verarbeitet Ansicht "Zugabgabe - Aufstellung"
const procAufstellung = new PageManager("Zugabgabe - Aufstellung", null, () => {
        if (getRows(4) === undefined) {
            __LOG[2]("Diese Seite ist ohne Team nicht verf\xFCgbar!");
        } else {
            return {
//                    'menuAnchor'  : getTable(0, 'div'),
                    'oldData'     : false,
                    'showForm'    : {
                                        'saison'        : true,
                                        'aktuellerZat'  : true,
                                        'team'          : true,
                                        'ids'           : true,
                                        'names'         : true,
                                        'ages'          : true,
                                        'positions'     : true,
                                        'opti27'        : true,
                                        'einsaetze'     : true,
                                        'reset'         : true,
                                        'showForm'      : false
                                    },
                    'formWidth'   : 1
                };
        }
        // Fehler fuer alle Faelle ohne Rueckgabewert...
        return false;
    }, async optSet => {
        const __COLUMNINDEX = {
                'Raster'   : 0,
                'Spieler'  : 1,
                'Age'      : 2,
                'U'        : 3,
                'MOR'      : 4,
                'FIT'      : 5,
                'Skill'    : 6,
                'Opti'     : 7,
                'S'        : 8
            };
        const __EINSATZ = {
                'Trib'  : 0,
                'Bank'  : 1,
                'Teil'  : 2,
                'Durch' : 3
            };

        // Gespeicherte Daten...
        //const __TRAINER = getOptValue(optSet.trainer, []);
        const __IDS = getOptValue(optSet.ids, []);
        const __NAMES = getOptValue(optSet.names, []);
        const __AGES = getOptValue(optSet.ages, []);
        const __POSITIONS = getOptValue(optSet.positions, []);
        const __OPTI27 = getOptValue(optSet.opti27, []);
        //const __VERLETZT = getOptValue(optSet.verletzt, []);
        //const __SKILLS = getOptValue(optSet.skills, []);
        //const __TSKILLS = getOptValue(optSet.tSkills, []);
        //const __TRAINIERT = getOptValue(optSet.trainiert, []);
        //const __SKILLPOS = getOptValue(optSet.skillPos, []);
        //const __ISPRIO = getOptValue(optSet.isPrio, []);
        const __EINSAETZE = getOptValue(optSet.einsaetze, []);
        //const __PROZENTE = getOptValue(optSet.prozente, []);
        //const __EW = getOptValue(optSet.erwartungen, []);
        //const __ERFOLGE = getOptValue(optSet.erfolge, []);
        //const __BLESSUREN = getOptValue(optSet.blessuren, []);

        const __ROWS = getRows(4);
        //const __HEADERS = __ROWS[0];
        const __SLENGTH = __ROWS.length - 6;
        //const __TLENGTH = 6;

        __EINSAETZE.length = __SLENGTH;
        __EINSAETZE.fill(__EINSATZ.Trib);

        let newID = false;

        for (let i = 1; i < __ROWS.length - 5; i++) {
            const __CURRENTROW = __ROWS[i];
            const __SPIELER = getSpieler(__CURRENTROW, __COLUMNINDEX.Spieler);
            const __ID = __SPIELER.id;
            const __NAME = __SPIELER.name;

            if (! __IDS.includes(__ID)) {
                const __ALTER = getAlter(__CURRENTROW, __COLUMNINDEX.Age);
                const __POS = getPos(__CURRENTROW, __COLUMNINDEX.Spieler);
                const __OPTI = getFloatFromHTML(__CURRENTROW.cells, __COLUMNINDEX.Opti);
                const __O27 = parseInt((27 * __OPTI).toFixed(0), 10);

                __LOG[4]("Adding new player", '#' + __ID, __NAME, __ALTER, __POS, __OPTI.toFixed(2));

                newID = true;
                __IDS.push(__ID);
                __NAMES.push(__NAME);
                __AGES.push(__ALTER);
                __POSITIONS.push(__POS);
                __OPTI27.push(__O27);
            }

            const __INDEX = __IDS.indexOf(__ID);
            const __RASTER = getSelection("ra[" + __ID + ']');

            if (~ __INDEX) {
                __EINSAETZE[__INDEX] = ((__RASTER === '-') ? __EINSATZ.Trib : ((~ "UVWXYZ".indexOf(__RASTER)) ? __EINSATZ.Bank : __EINSATZ.Durch));
            } else {
                __LOG[0]("User-ID", __ID, "not found!");
            }
        }

        if (newID) {
            setOpt(optSet.ids, __IDS, false);
            setOpt(optSet.names, __NAMES, false);
            setOpt(optSet.ages, __AGES, false);
            setOpt(optSet.positions, __POSITIONS, false);
            setOpt(optSet.opti27, __OPTI27, false);
        }

        setOpt(optSet.einsaetze, __EINSAETZE, false);

        //setOpt(optSet.trainer, __TRAINER, false);
        //setOpt(optSet.verletzt, __VERLETZT, false);
        //setOpt(optSet.skills, __SKILLS, false);
        //setOpt(optSet.tSkills, __TSKILLS, false);
        //setOpt(optSet.trainiert, __TRAINIERT, false);
        //setOpt(optSet.skillPos, __SKILLPOS, false);
        //setOpt(optSet.isPrio, __ISPRIO, false);
        //setOpt(optSet.prozente, __PROZENTE, false);
        //setOpt(optSet.erwartungen, __EW, false);
        //setOpt(optSet.erfolge, __ERFOLGE, false);
        //setOpt(optSet.blessuren, __BLESSUREN, false);

        return true;
    });

// Verarbeitet Ansicht "Zugabgabe - Aktionen"
const procAktionen = new PageManager("Zugabgabe - Aktionen", null, () => {
        if (getRows(1) === undefined) {
            __LOG[2]("Diese Seite ist ohne Team nicht verf\xFCgbar!");
        } else {
            return {
                    'menuAnchor'  : getTable(0, 'div'),
                    'oldData'     : false,
                    'showForm'    : {
                                        'saison'        : true,
                                        'aktuellerZat'  : true,
                                        'team'          : true,
                                        'reset'         : true,
                                        'showForm'      : true
                                    },
                    'formWidth'   : 1
                };
        }
        // Fehler fuer alle Faelle ohne Rueckgabewert...
        return false;
    }, async optSet => {
            UNUSED(optSet);
            //const __ROWS = getRows(1);
            //const __HEADERS = __ROWS[0];
            //return true;
        });

// Verarbeitet Ansicht "Zugabgabe - Einstellungen"
const procEinstellungen = new PageManager("Zugabgabe - Einstellungen", null, () => {
    if (getRows(1) === undefined) {
        __LOG[2]("Diese Seite ist ohne Team nicht verf\xFCgbar!");
        } else {
            return {
                    'menuAnchor'  : getTable(0, 'div'),
                    'oldData'     : false,
                    'showForm'    : {
                                        'saison'        : true,
                                        'aktuellerZat'  : true,
                                        'team'          : true,
                                        'reset'         : true,
                                        'showForm'      : true
                                    },
                    'formWidth'   : 1
                };
        }
        // Fehler fuer alle Faelle ohne Rueckgabewert...
        return false;
    }, async optSet => {
            UNUSED(optSet);
            //const __ROWS = getRows(1);
            //const __HEADERS = __ROWS[0];
            //return true;
        });

// Verarbeitet Ansicht "Trainer"
const procTrainer = new PageManager("Trainer", null, () => {
//        if (getRows(1) === undefined) {
//            __LOG[2]("Diese Seite ist ohne Team nicht verf\xFCgbar!");
//        } else {
            return {
                    'menuAnchor'  : getTable(0, 'div'),
                    'oldData'     : false,
                    'showForm'    : {
                                        'saison'        : true,
                                        'aktuellerZat'  : true,
                                        'team'          : true,
                                        'reset'         : true,
                                        'showForm'      : true
                                    },
                    'formWidth'   : 1
                };
//        }
        // Fehler fuer alle Faelle ohne Rueckgabewert...
//        return false;
    }, async optSet => {
            UNUSED(optSet);
            //const __ROWS = getRows(1);
            //const __HEADERS = __ROWS[0];
            //return true;
        });

// Verarbeitet Ansicht "Training"
const procTraining = new PageManager("Training", null, () => {
        if (getRows(2) === undefined) {
            __LOG[2]("Diese Seite ist ohne Team nicht verf\xFCgbar!");
        } else {
            return {
                    'menuAnchor'  : getTable(0, 'div'),
                    'oldData'     : false,
                    'showForm'    : {
                                        'sepStyle'      : true,
                                        'sepColor'      : true,
                                        'sepWidth'      : true,
                                        'saison'        : true,
                                        'aktuellerZat'  : true,
                                        'team'          : true,
                                        'trainer'       : true,
                                        'tGehaelter'    : true,
                                        'tVertraege'    : true,
                                        'tReste'        : true,
                                        'tAnzahlen'     : true,
                                        'ids'           : true,
                                        'names'         : true,
                                        'ages'          : true,
                                        'positions'     : true,
                                        'opti27'        : true,
                                        'verletzt'      : true,
                                        'skills'        : true,
                                        'tSkills'       : true,
                                        'trainiert'     : true,
                                        'skillPos'      : true,
                                        'isPrio'        : true,
                                        'einsaetze'     : true,
                                        'prozente'      : true,
                                        'erwartungen'   : true,
                                        'erfolge'       : true,
                                        'blessuren'     : true,
                                        'reset'         : true,
                                        'showForm'      : true
                                   },
                    'formWidth'  : 1
                };
        }
        // Fehler fuer alle Faelle ohne Rueckgabewert...
        return false;
    }, async optSet => {
        const __COLWIDTH  = 80;
        const __COLWIDTH2 = 40;

        const __COLUMNINDEX = {
                'Verletzt' : 0,
                'Spieler'  : 1,
                'Age'      : 2,
                'Opti'     : 3,
                'Trainer'  : 4,
                'TSkill'   : 4,
                'Skill'    : 5,
                'PSkill'   : 6,
                'Chance'   : 7
            };
        const __TITLE = {
                'Prob1'    : "Bankeinsatz",
                'Prob2'    : "Teilweise",
                'Prob3'    : "Durchgehend",
                'PS'       : "Primary",
                'Value'    : "EW",
                'WS0'      : "WS0",
                'WS'       : "WS",
                'Min0'     : "min.",
                'Min3'     : "max.",
                'Gehalt'   : "Gehalt"
            };
        const __EINSATZ = {
                'Trib'  : 0,
                'Bank'  : 1,
                'Teil'  : 2,
                'Durch' : 3
            };

        // Gespeicherte Daten...
        const __TRAINER = [];  // neu aufbauen! getOptValue(optSet.trainer, []);
        const __TANZAHL = [0, 0, 0, 0, 0, 0];  // neu aufbauen! getOptValue(optSet.tAnzahlen, []);
        const __IDS = getOptValue(optSet.ids, []);
        const __NAMES = getOptValue(optSet.names, []);
        const __AGES = getOptValue(optSet.ages, []);
        const __POSITIONS = getOptValue(optSet.positions, []);
        const __OPTI27 = getOptValue(optSet.opti27, []);
        //const __VERLETZT = getOptValue(optSet.verletzt, []);
        const __SKILLS = getOptValue(optSet.skills, []);
        const __TSKILLS = getOptValue(optSet.tSkills, []);
        const __TRAINIERT = getOptValue(optSet.trainiert, []);
        const __SKILLPOS = getOptValue(optSet.skillPos, []);
        const __ISPRIO = getOptValue(optSet.isPrio, []);
        const __EINSAETZE = getOptValue(optSet.einsaetze, []);
        const __PROZENTE = getOptValue(optSet.prozente, []);
        const __EW = getOptValue(optSet.erwartungen, []);
        const __ERFOLGE = getOptValue(optSet.erfolge, []);
        const __BLESSUREN = getOptValue(optSet.blessuren, []);

        const __EINSMAP = { };

        // Ermittelte Einsaetze (ggfs. von Aufstellung-Seite) den IDs zuordnen (bei Sperren, Verletzungen, Leihen relevant)...
        __IDS.map((id, index) => (__EINSMAP[id] = __EINSAETZE[index]));
        __EINSAETZE.length = 0;  // vorerst alle loeschen und spaeter wieder einfuegen!

        const __ROWS = getRows(2);
        const __HEADERS = __ROWS[0];

        // Ueberschriften hinzufuegen
        const __ORGLENGTH = __HEADERS.cells.length;
        appendCell(__HEADERS, __TITLE.Prob1);
        appendCell(__HEADERS, __TITLE.Prob2);
        appendCell(__HEADERS, __TITLE.Prob3);

        const __COL2LENGTH = __HEADERS.cells.length;
        appendCell(__HEADERS, __TITLE.PS);
        appendCell(__HEADERS, __TITLE.Value);
        appendCell(__HEADERS, __TITLE.WS0);
        appendCell(__HEADERS, __TITLE.WS);
        appendCell(__HEADERS, __TITLE.Min0);
        appendCell(__HEADERS, __TITLE.Min3);
        //appendCell(__HEADERS, __TITLE.Gehalt);

        // Breite der neuen Spalten festlegen
        for (let i = __ORGLENGTH + 1; i < __HEADERS.cells.length; i++) {
            __HEADERS.cells[i].setAttribute('width', (i < __COL2LENGTH) ? __COLWIDTH : __COLWIDTH2, false);
        }

        const __SLENGTH = __ROWS.length - 1;
        const __TLENGTH = 6;

        __TRAINER.length = __TLENGTH;
        __TANZAHL.length = __TLENGTH;
        __IDS.length = __SLENGTH;
        __NAMES.length = __SLENGTH;
        __AGES.length = __SLENGTH;
        __POSITIONS.length = __SLENGTH;
        __OPTI27.length = __SLENGTH;
        //__VERLETZT.length = __SLENGTH;
        __SKILLS.length = __SLENGTH;
        __TSKILLS.length = __SLENGTH;
        __TRAINIERT.length = __SLENGTH;
        __SKILLPOS.length = __SLENGTH;
        __ISPRIO.length = __SLENGTH;
        __EINSAETZE.length = __SLENGTH;
        __PROZENTE.length = __SLENGTH;
        __EW.length = __SLENGTH;
        __ERFOLGE.length = __SLENGTH;
        __BLESSUREN.length = __SLENGTH;

        // Wahrscheinlichkeiten eintragen
        let value = 0.0;
        let sum = 0.0;
        for (let i = 1; i < __ROWS.length; i++) {
            const __INDEX = i - 1;
            const __CURRENTROW = __ROWS[i];
            const __SPIELER = getSpieler(__CURRENTROW, __COLUMNINDEX.Spieler);
            const __ID = __SPIELER.id;
            const __NAME = __SPIELER.name;
            const __SKILL = getSkill(__CURRENTROW, __COLUMNINDEX.Skill);
            const __POS = getPos(__CURRENTROW, __COLUMNINDEX.Chance);
            const __COLOR = getColor(__POS);
            const __PROBINDEX = __ORGLENGTH - 1;  // derzeit letzte Spalte enthaelt die Prozente
            const __EINSART = getValue(__EINSMAP[__ID], __EINSATZ.Trib);  // Daten oben ermittelt
            const __PROBSTRING = getProbString(__CURRENTROW, __COLUMNINDEX.Chance);
            const __PRACTICE = (getProbabilityStr(__PROBSTRING, __EINSATZ.Trib) !== "");
            const __PRACTICEPS = __PRACTICE && isPrimarySkill(__POS, __SKILL);

            if (__PRACTICE) {
                value = parseFloat(getProbabilityStr(__PROBSTRING, __EINSART, "", 2, 99)) * (__PRACTICEPS ? 5 : 1) / 100.0;
                sum += value;
            } else {
                value = 0.0;
            }

            const __VALUESTR = value.toFixed(2).toString();
            const __ALTER = getAlter(__CURRENTROW, __COLUMNINDEX.Age);
            const __GOALIE = isGoalieFromHTML(__CURRENTROW.cells, __COLUMNINDEX.Spieler);
            const __OPTI = getFloatFromHTML(__CURRENTROW.cells, __COLUMNINDEX.Opti);
            const __PSKILL = getPSkill(__CURRENTROW, __COLUMNINDEX.PSkill);
            const __TSKILL = getTSkill(__CURRENTROW, __COLUMNINDEX.TSkill);
            const __TNR = getTrainerNr(__CURRENTROW, __COLUMNINDEX.Trainer);
            const __PROBSTR0 = calcProbPercent(__ALTER, __PSKILL, __TSKILL);
            const __PROBSTR = calcProbPercent(__ALTER, __PSKILL, __TSKILL, __EINSART);
            const __MINSTR0 = calcMinPSkill(__ALTER, __TSKILL, __EINSATZ.Trib);
            const __MINSTR3 = calcMinPSkill(__ALTER, __TSKILL, __EINSATZ.Durch);
            //const __GEHALT = calcTGehalt(__TSKILL);

            if (__TNR) {
                __TRAINER[__TNR - 1] = __TSKILL;
                __TANZAHL[__TNR - 1]++;
            }
            __IDS[__INDEX] = __ID;
            __NAMES[__INDEX] = __NAME;
            __AGES[__INDEX] = __ALTER;
            __POSITIONS[__INDEX] = __POS;
            __OPTI27[__INDEX] = parseInt((27 * __OPTI).toFixed(0), 10);
            //__VERLETZT[__INDEX] = 0;
            __SKILLS[__INDEX] = __PSKILL;
            __TSKILLS[__INDEX] = __TSKILL;
            __TRAINIERT[__INDEX] = __TNR;
            __SKILLPOS[__INDEX] = getSkillID((__PRACTICE ? __SKILL : undefined), __GOALIE);
            __ISPRIO[__INDEX] = (__PRACTICEPS ? 1 : 0);
            __EINSAETZE[__INDEX] = __EINSART;  // auf oben ermittelte Daten zurueckgreifen!
            __PROZENTE[__INDEX] = (__PRACTICE ? Math.min(99, parseInt(__PROBSTR.toFixed(0), 10)) : undefined);
            __EW[__INDEX] = parseFloat(__VALUESTR, 10);
            __ERFOLGE[__INDEX] = false;
            __BLESSUREN[__INDEX] = 0;

            for (let j = __EINSATZ.Bank; j <= __EINSATZ.Durch; j++) {
                appendCell(__CURRENTROW, getProbabilityStr(__PROBSTRING, j), __COLOR);
            }
            formatCell(__CURRENTROW.cells[__PROBINDEX + __EINSART], true);  // fett

            appendCell(__CURRENTROW, __PRACTICEPS ? __SKILL : "", __COLOR);
            appendCell(__CURRENTROW, __VALUESTR, __COLOR);
            appendCell(__CURRENTROW, __PROBSTR0.toFixed(2), __COLOR);
            appendCell(__CURRENTROW, __PROBSTR.toFixed(2), __COLOR);
            appendCell(__CURRENTROW, value ? __MINSTR0.toFixed(0) : "", __COLOR);
            appendCell(__CURRENTROW, value ? __MINSTR3.toFixed(0) : "", __COLOR);
            //appendCell(__CURRENTROW, __GEHALT.toFixed(0), __COLOR);
/*
            if (__PRACTICEPS) {
                for (let j = 0; j < __CURRENTROW.length; j++) {
                    __CURRENTROW.cells[j].style.color = '#FFFFFF';
                    __CURRENTROW.cells[j].style.fontWeight = 'bold';
                }
            }
*/
        }

        // Fuegt einen Hinweis zur maximalen Trainingswahrscheinlichkeit in den Textbereich ueber der Tabelle hinzu
        const __WARN1 = "Die in den Spalten \"" + __TITLE.Prob1 + "\", \"" + __TITLE.Prob2 + "\" und \"" + __TITLE.Prob3 +
                        "\" angegebenen Wahrscheinlichkeiten dienen nur zur Orientierung!";
        const __WARN2 = "Die maximale Wahrscheinlichkeit einer Aufwertung ist immer 99.00 %! Zu erwartende Aufwertungen = " + sum.toFixed(2).toString();

        const __TABLE = getTable(1);
        const __NEWCELL1 = appendCell(__TABLE.insertRow(-1), __WARN1 /* , '#FFFF00' */);
        __NEWCELL1.setAttribute('colspan', 4, false);
        const __NEWCELL2 = appendCell(__TABLE.insertRow(-1), __WARN2 /* , '#FFFF00' */);
        __NEWCELL2.setAttribute('colspan', 3, false);

        setOpt(optSet.trainer, __TRAINER, false);
        setOpt(optSet.tAnzahlen, __TANZAHL, false);
        setOpt(optSet.ids, __IDS, false);
        setOpt(optSet.names, __NAMES, false);
        setOpt(optSet.ages, __AGES, false);
        setOpt(optSet.positions, __POSITIONS, false);
        setOpt(optSet.opti27, __OPTI27, false);
        //setOpt(optSet.verletzt, __VERLETZT, false);
        setOpt(optSet.skills, __SKILLS, false);
        setOpt(optSet.tSkills, __TSKILLS, false);
        setOpt(optSet.trainiert, __TRAINIERT, false);
        setOpt(optSet.skillPos, __SKILLPOS, false);
        setOpt(optSet.isPrio, __ISPRIO, false);
        setOpt(optSet.einsaetze, __EINSAETZE, false);
        setOpt(optSet.prozente, __PROZENTE, false);
        setOpt(optSet.erwartungen, __EW, false);
        //setOpt(optSet.erfolge, __ERFOLGE, false);
        //setOpt(optSet.blessuren, __BLESSUREN, false);

        return true;
    });

// Verarbeitet Ansicht "ZAT-Report"
const procZatReport = new PageManager("ZAT-Report", null, () => {
        if (getRows(1) === undefined) {
            __LOG[2]("Diese Seite ist ohne Team nicht verf\xFCgbar!");
        } else {
            return {
                    'menuAnchor'  : getTable(0, 'div'),
                    'oldData'     : true,
                    'showForm'    : {
                                        'zeigeId'               : true,
                                        'zeigeAlter'            : true,
                                        'zeigePosition'         : true,
                                        'zeigeTOR'              : true,
                                        'zeigeOpti'             : true,
                                        'zeigeVerletzung'       : true,
                                        'zeigeBlessur'          : true,
                                        'zeigeSkillPos'         : true,
                                        'zeigeSkill'            : true,
                                        'zeigeSkillUp'          : true,
                                        'zeigeTSkill'           : true,
                                        'zeigeTNr'              : true,
                                        'zeigePrio'             : true,
                                        'zeigeEinsatz'          : true,
                                        'zeigeProzent'          : true,
                                        'zeigeProzentBalken'    : true,
                                        'zeigeErwartung'        : true,
                                        'zeigeErwartungBalken'  : true,
                                        'zeigeErfolg'           : true,
                                        'sepStyle'              : true,
                                        'sepColor'              : true,
                                        'sepWidth'              : true,
                                        'saison'                : true,
                                        'aktuellerZat'          : true,
                                        'team'                  : true,
                                        'reset'                 : true,
                                        'showForm'              : true
                                   },
                    'formWidth'  : 1
                };
        }
        // Fehler fuer alle Faelle ohne Rueckgabewert...
        return false;
    }, async optSet => {
        const __ROWOFFSETUPPER = 1;     // Header-Zeile (nach Einfuegung!)
        const __ROWOFFSETLOWER = 0;     // Fussnote

        const __COLUMNINDEX = {
                'Name'  : 0,
                'Succ'  : 1,
                'Zus'   : 2
            };

        // Gespeicherte Daten...
        const __IDS = getOptValue(optSet.ids, []);
        //const __NAMES = getOptValue(optSet.names, []);
        const __AGES = getOptValue(optSet.ages, []);
        const __POSITIONS = getOptValue(optSet.positions, []);
        const __OPTI27 = getOptValue(optSet.opti27, []);
        const __VERLETZT = getOptValue(optSet.verletzt, []);
        const __SKILLS = getOptValue(optSet.skills, []);
        const __TSKILLS = getOptValue(optSet.tSkills, []);
        const __TRAINIERT = getOptValue(optSet.trainiert, []);
        const __SKILLPOS = getOptValue(optSet.skillPos, []);
        const __ISPRIO = getOptValue(optSet.isPrio, []);
        const __EINSAETZE = getOptValue(optSet.einsaetze, []);
        const __PROZENTE = getOptValue(optSet.prozente, []);
        const __EW = getOptValue(optSet.erwartungen, []);
        const __ERFOLGE = [];  // neu aufbauen! getOptValue(optSet.erfolge, []);
        const __BLESSUREN = [];  // neu aufbauen! getOptValue(optSet.blessuren, []);

        const __PLAYERS = [];  // init(__ROWS, optSet, __COLUMNINDEX, __ROWOFFSETUPPER, __ROWOFFSETLOWER, 1);
        const __COLMAN = new ColumnManagerZatReport(optSet, __COLUMNINDEX, {
                                            'Default'            : true,
                                            'zeigeErfahrung'     : false
                                        });

        const __TABLE = getTable(1);
        const __ROWS = __TABLE.rows;
        const __TITLECOLOR = getColor('LEI');  // '#FFFFFF'
        const __DATA = [ 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60 ];
        const __SAISON = __COLMAN.oldSaison;
        const __CURRZAT = __COLMAN.oldZAT;
        const __TEAM = __COLMAN.team;
        const __LAND = __TEAM.Land;

        let sumErwartung = 0.0;
        let sumAufwertung = 0.0;

        const __HEADERS = __COLMAN.insertTitles(__TABLE, __TITLECOLOR);
        UNUSED(__HEADERS);

        for (let i = __ROWOFFSETUPPER, j = 0; i < __ROWS.length - __ROWOFFSETLOWER; i++) {
            const __CURRENTROW = __ROWS[i];
            const __CELLS = __CURRENTROW.cells;

            if (__CELLS.length > 1) {
                const __SPIELER = getSpieler(__CURRENTROW, __COLUMNINDEX.Name);
                const __ID = __SPIELER.id;
                const __NAME = __SPIELER.name;
                const __INDEX = __IDS.indexOf(__ID);
                const __SUCC = getStringFromHTML(__CELLS, __COLUMNINDEX.Succ);
                const __SUCCNUM = parseInt(__SUCC.substr(-6, 2), 10);  // 2 Stellen ab Ende - 6, dahinter " ZAT" bzw. " FIT"
                const __ERFAHRUNG = (__SUCC === "Erfahrung gestiegen");
                const __FUQ = (! __ERFAHRUNG) && (__SUCC === "F\xFChrungsqualität gestiegen");
                const __ERFOLG = ((__ERFAHRUNG || __FUQ) ? undefined : (__SUCC.endsWith(" erfolglos") ? 0 : (__SUCC.endsWith(" erfolgreich") ? 1 : undefined)));
                const __BLESSUR = (__SUCC.startsWith("Trainingsblessur: ") ? (__SUCC.endsWith(" FIT") ? __SUCCNUM : (__SUCC.endsWith(" ZAT") ? - __SUCCNUM : undefined)) : undefined);
                const __ERROR = ! (__ERFAHRUNG || __FUQ || (__ERFOLG !== undefined) || (__BLESSUR !== undefined));

                if (__ERROR) {
                    __LOG[0]("Error: " + __SUCC + " (" + __SUCCNUM + ')');
                }
                const __ALTER = __AGES[__INDEX];
                const __POS = __POSITIONS[__INDEX];
                const __ISGOALIE = (__POS === "TOR");
                const __OPTI = parseInt(__OPTI27[__INDEX], 10) / 27.0;
                const __VERL = __VERLETZT[__INDEX];
                const __PSKILL = __SKILLS[__INDEX];
                const __TSKILL = __TSKILLS[__INDEX];
                const __TNR = __TRAINIERT[__INDEX];
                const __SKILLID = __SKILLPOS[__INDEX];
                const __PRACTICEPS = (__ISPRIO[__INDEX] > 0);
                const __EINSATZ = __EINSAETZE[__INDEX];
                const __PROZENT =  __PROZENTE[__INDEX];
                const __ERWARTUNG = __EW[__INDEX];

                __ERFOLGE[__INDEX] = __ERFOLG;
                __BLESSUREN[__INDEX] = __BLESSUR;

                const __NEWPLAYER = new PlayerRecordTraining(__LAND, __ALTER, __ISGOALIE, __SAISON, __CURRZAT, 10000);

                __NEWPLAYER.initPlayer(__DATA, __ID, true);

                __NEWPLAYER.prognoseSkills();

                __NEWPLAYER.id = __ID;
                __NEWPLAYER.name = __NAME;
                __NEWPLAYER.age = __ALTER;
                __NEWPLAYER.pos = __POS;
                __NEWPLAYER.isGoalie = __ISGOALIE;
                __NEWPLAYER.opti = __OPTI;
                __NEWPLAYER.verl = __VERL;
                __NEWPLAYER.pSkill = __PSKILL;
                __NEWPLAYER.tSkill = __TSKILL;
                __NEWPLAYER.tNr = __TNR;
                __NEWPLAYER.skillID = __SKILLID;
                __NEWPLAYER.isPrio = __PRACTICEPS;
                __NEWPLAYER.einsatz = __EINSATZ;
                __NEWPLAYER.prozent = __PROZENT;
                __NEWPLAYER.erwartung = __ERWARTUNG;

                __NEWPLAYER.erfolg = __ERFOLG;
                __NEWPLAYER.blessur = __BLESSUR;

                const __RET = __COLMAN.addValues(__NEWPLAYER, __ROWS[i], __TITLECOLOR);

                sumErwartung += __RET[0];
                sumAufwertung += __RET[1];

                __PLAYERS[j++] = __NEWPLAYER;
            }
        }

        __LOG[0]("Erwartung vs. Aufwertungen", sumErwartung.toFixed(2), sumAufwertung.toFixed(2));

        //setOpt(optSet.trainer, __TRAINER, false);
        //setOpt(optSet.tAnzahlen, __TANZAHL, false);
        //setOpt(optSet.ids, __IDS, false);
        //setOpt(optSet.names, __NAMES, false);
        //setOpt(optSet.ages, __AGES, false);
        //setOpt(optSet.positions, __POSITIONS, false);
        //setOpt(optSet.opti27, __OPTI27, false);
        //setOpt(optSet.verletzt, __VERLETZT, false);
        //setOpt(optSet.skills, __SKILLS, false);
        //setOpt(optSet.tSkills, __TSKILLS, false);
        //setOpt(optSet.trainiert, __TRAINIERT, false);
        //setOpt(optSet.skillPos, __SKILLPOS, false);
        //setOpt(optSet.isPrio, __ISPRIO, false);
        //setOpt(optSet.einsaetze, __EINSAETZE, false);
        //setOpt(optSet.prozente, __PROZENTE, false);
        //setOpt(optSet.erwartungen, __EW, false);
        setOpt(optSet.erfolge, __ERFOLGE, false);
        setOpt(optSet.blessuren, __BLESSUREN, false);

        return true;
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

    return optSet;
}

function checkOptParams(optParams, manager) {
    const __CLASSIFICATION = ((!! optParams.oldData) ? new ClassificationPair(__TEAMCLASS, __LASTZATCLASS) : __TEAMCLASS);

    // Classification ist optParams-abhaengig, daher hier setzen statt im Konstruktor des PageManagers...
    manager.classification = __CLASSIFICATION;

    return !! optParams;
}

// ==================== Ende Spezialbehandlung der Startparameter ====================

// ==================== Hauptprogramm ====================


const __MAINCONFIG = {
                        checkOptParams  : checkOptParams,
                        prepareOpt      : prepareOptions
                    };

const __LEAFS = {
                    'zugabgabe.php' : 0,    // Ansicht "Zugabgabe" (p = 0, 1, 2)
                    'haupt.php'     : 3,    // Ansicht "Haupt" (Managerbuero)
                    'trainer.php'   : 4,    // Ansicht "Trainer"
                    'training.php'  : 5,    // Ansicht "Training"
                    'zar.php'       : 6     // Ansicht "ZAT-Report"
                };
const __ITEM = 'p';

// URL-Legende:
// p=0: Zugabgabe Aufstellung
// p=1: Zugabgabe Aktionen
// p=2: Zugabgabe Einstellungen
// p=3: Managerbuero
// p=4: Trainer
// p=5: Training
// p=6: ZAT-Report
const __MAIN = new Main(__OPTCONFIG, __MAINCONFIG,
                        procAufstellung, procAktionen, procEinstellungen,
                        procHaupt, procTrainer, procTraining, procZatReport);

__MAIN.run(getPageIdFromURL, __LEAFS, __ITEM);

// ==================== Ende Hauptprogramm ====================

// *** EOF ***
