// ==UserScript==
// @name         OS2.jugend
// @namespace    http://os.ongapo.com/
// @version      0.54+WE+
// @copyright    2013+
// @author       Sven Loges (SLC) / Andreas Eckes (Strindheim BK)
// @description  Jugendteam-Script fuer Online Soccer 2.0
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/haupt\.php(\?changetosecond=\w+(&\S+)*)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/ju\.php(\?page=\d+(&\S+)*)?$/
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
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Konfigurations-Abschnitt fuer Optionen ====================

const __LOGLEVEL = 3;

// Moegliche Optionen (hier die Standardwerte editieren oder ueber das Benutzermenu setzen):
const __OPTCONFIG = {
    'ersetzeSkills' : {   // Auswahl fuer prognostizierte Einzelskills mit Ende 18 statt der aktuellen (true = Ende 18, false = aktuell)
                   'Name'      : "substSkills",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Einzelwerte Ende",
                   'Hotkey'    : 'E',
                   'AltLabel'  : "Einzelwerte aktuell",
                   'AltHotkey' : 'k',
                   'FormLabel' : "Prognose Einzelwerte"
               },
    'zeigeBalken' : {     // Spaltenauswahl fuer den Qualitaetsbalken des Talents (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showRatioBar",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Balken Qualit\xE4t ein",
                   'Hotkey'    : 'B',
                   'AltLabel'  : "Balken Qualit\xE4t aus",
                   'AltHotkey' : 'B',
                   'FormLabel' : "Balken Qualit\xE4t"
               },
    'absBalken' : {      // Spaltenauswahl fuer den Guetebalken des Talents absolut statt nach Foerderung (true = absolut, false = relativ nach Foerderung)
                   'Name'      : "absBar",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Balken absolut",
                   'Hotkey'    : 'u',
                   'AltLabel'  : "Balken nach F\xF6rderung",
                   'AltHotkey' : 'u',
                   'FormLabel' : "Balken 100%"
               },
    'zeigeId' : {         // Spaltenauswahl fuer Identifizierungsmerkmale der Jugendspieler (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showFingerprints",
                   'Type'      : __OPTTYPES.SW,
                   'Hidden'    : true,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Identifikation ein",
                   'Hotkey'    : 'T',
                   'AltLabel'  : "Identifikation aus",
                   'AltHotkey' : 'T',
                   'FormLabel' : "Identifikation"
               },
    'zeigeTal' : {        // Spaltenauswahl fuer Talente (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showTclasses",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Talent ein",
                   'Hotkey'    : 'T',
                   'AltLabel'  : "Talent aus",
                   'AltHotkey' : 'T',
                   'FormLabel' : "Talent"
               },
    'zeigeQuote' : {      // Spaltenauswahl fuer Aufwertungsschnitt (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showRatio",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Quote ein",
                   'Hotkey'    : 'T',
                   'AltLabel'  : "Quote aus",
                   'AltHotkey' : 'T',
                   'FormLabel' : "Quote"
               },
    'zeigeGeb' : {        // Spaltenauswahl fuer Geburtstage (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showBirthday",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Geburtstag ein",
                   'Hotkey'    : 'G',
                   'AltLabel'  : "Geburtstag aus",
                   'AltHotkey' : 'G',
                   'FormLabel' : "Geburtstag"
               },
    'zeigeAlter' : {      // Spaltenauswahl fuer dezimales Alter (true = anzeigen, false = nicht anzeigen)
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
    'ersetzeAlter' : {    // Spaltenauswahl fuer dezimales Alter statt ganzzahligen Alters (true = Dezimalbruch, false = ganzzahlig)
                   'Name'      : "substAge",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Alter dezimal",
                   'Hotkey'    : 'd',
                   'AltLabel'  : "Alter ganzzahlig",
                   'AltHotkey' : 'g',
                   'FormLabel' : "Alter ersetzen"
               },
    'zeigeAufw' : {       // Spaltenauswahl fuer Aufwertungen (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showProgresses",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Aufwertungen ein",
                   'Hotkey'    : 'W',
                   'AltLabel'  : "Aufwertungen aus",
                   'AltHotkey' : 'W',
                   'FormLabel' : "Aufwertungen"
               },
    'shortAufw' : {       // Abgekuerzte Aufwertungsanzeige
                   'Name'      : "shortProgresses",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Aufwertungen kurz",
                   'Hotkey'    : 'A',
                   'AltLabel'  : "Aufwertungen lang",
                   'AltHotkey' : 'A',
                   'FormLabel' : "Kurze Aufwertungen"
               },
    'zeigeZatDone' : {    // Spaltenauswahl fuer die Anzahl der bisherigen Trainings-ZATs (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showFixZatDone",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Trainings-ZATs ein",
                   'Hotkey'    : 'Z',
                   'AltLabel'  : "Trainings-ZATs aus",
                   'AltHotkey' : 'Z',
                   'FormLabel' : "Trainings-ZATs"
               },
    'zeigeZatLeft' : {    // Spaltenauswahl fuer die Anzahl der Rest-ZATs bis Ende 18 (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showFixZatLeft",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Rest-ZATs ein",
                   'Hotkey'    : 'R',
                   'AltLabel'  : "Rest-ZATs aus",
                   'AltHotkey' : 'R',
                   'FormLabel' : "Rest-ZATs"
               },
    'zeigeFixSkills' : {  // Spaltenauswahl fuer die Summe der Fixskills (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showFixSkills",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Fixskills ein",
                   'Hotkey'    : 'F',
                   'AltLabel'  : "Fixskills aus",
                   'AltHotkey' : 'F',
                   'FormLabel' : "Fixskills"
               },
    'zeigeTrainiert' : {  // Spaltenauswahl fuer die aktuellen trainierten Skills (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showTrainiert",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Trainiert ein",
                   'Hotkey'    : 'T',
                   'AltLabel'  : "Trainiert aus",
                   'AltHotkey' : 'T',
                   'FormLabel' : "Trainiert"
               },
    'zeigeAnteilPri' : {  // Spaltenauswahl fuer den prozentualen Anteil der aktuellen Hauptskills (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showAnteilPri",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Anteil Hauptskills ein",
                   'Hotkey'    : 'H',
                   'AltLabel'  : "Anteil Hauptskills aus",
                   'AltHotkey' : 'H',
                   'FormLabel' : "Anteil Hauptskills"
               },
    'zeigeAnteilSec' : {  // Spaltenauswahl fuer den prozentualen Anteil der aktuellen Nebenskills (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showAnteilSec",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Anteil Nebenskills ein",
                   'Hotkey'    : 'N',
                   'AltLabel'  : "Anteil Nebenskills aus",
                   'AltHotkey' : 'N',
                   'FormLabel' : "Anteil Nebenskills"
               },
    'zeigePrios' : {      // Spaltenauswahl fuer den Schnitt der Hauptskills (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showPrios",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Prios ein",
                   'Hotkey'    : 'r',
                   'AltLabel'  : "Prios aus",
                   'AltHotkey' : 'r',
                   'FormLabel' : "Prios"
               },
    'zeigeSkill' : {      // Spaltenauswahl fuer die aktuellen Werte (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showSkill",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Skill ein",
                   'Hotkey'    : 'S',
                   'AltLabel'  : "Skill aus",
                   'AltHotkey' : 'S',
                   'FormLabel' : "Skill"
               },
    'zeigePosition' : {   // Position anzeigen
                   'Name'      : "showPos",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Position ein",
                   'Hotkey'    : 'P',
                   'AltLabel'  : "Position aus",
                   'AltHotkey' : 'P',
                   'FormLabel' : "Position"
               },
    'anzahlOpti' : {      // Gibt die Anzahl der Opti-Spalten an / 1: nur bester Opti, 2: die beiden besten, ..., 6: Alle inklusive TOR
                          // Bei Torhuetern wird immer nur der TOR-Opti angezeigt / Werte < 1 oder > 6 schalten die Anzeige aus
                   'Name'      : "anzOpti",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'SelValue'  : false,
                   'Choice'    : [ 0, 1, 2, 3, 4, 5, 6 ],
                   'Default'   : 1,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Opti: beste $",
                   'Hotkey'    : 'O',
                   'FormLabel' : "Opti:|beste $"
               },
    'anzahlMW' : {        // Gibt die Anzahl der MW-Spalten an / 1: nur hoechsten MW, 2: die beiden hoechsten, ..., 6: Alle inklusive TOR
                          // Bei Torhuetern wird immer nur der TOR-MW angezeigt / Werte < 1 oder > 6 schalten die Anzeige aus
                   'Name'      : "anzMW",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'SelValue'  : false,
                   'Choice'    : [ 0, 1, 2, 3, 4, 5, 6 ],
                   'Default'   : 1,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "MW: beste $",
                   'Hotkey'    : 'M',
                   'FormLabel' : "MW:|beste $"
               },
    'zeigeTrainiertEnde' : {  // Spaltenauswahl fuer die trainierten Skills mit Ende 18 (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showTrainiertEnde",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Trainiert Ende ein",
                   'Hotkey'    : 'n',
                   'AltLabel'  : "Trainiert Ende aus",
                   'AltHotkey' : 'n',
                   'FormLabel' : "Trainiert \u03A9"
               },
    'zeigeAnteilPriEnde' : {  // Spaltenauswahl fuer den prozentualen Anteil der Hauptskills mit Ende 18 (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showAnteilPriEnde",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Anteil Hauptskills Ende ein",
                   'Hotkey'    : 'u',
                   'AltLabel'  : "Anteil Hauptskills Ende aus",
                   'AltHotkey' : 'u',
                   'FormLabel' : "Anteil Hauptskills \u03A9"
               },
    'zeigeAnteilSecEnde' : {  // Spaltenauswahl fuer den prozentualen Anteil der Nebenskills mit Ende 18 (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showAnteilSecEnde",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Anteil Nebenskills Ende ein",
                   'Hotkey'    : 'b',
                   'AltLabel'  : "Anteil Nebenskills Ende aus",
                   'AltHotkey' : 'b',
                   'FormLabel' : "Anteil Nebenskills \u03A9"
               },
    'zeigePriosEnde' : {  // Spaltenauswahl fuer den Schnitt der Hauptskills (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showPriosEnde",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Prios Ende ein",
                   'Hotkey'    : 'o',
                   'AltLabel'  : "Prios Ende aus",
                   'AltHotkey' : 'o',
                   'FormLabel' : "Prios \u03A9"
               },
    'zeigeSkillEnde' : {  // Spaltenauswahl fuer die Werte mit Ende 18 (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showSkillEnde",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Skill Ende ein",
                   'Hotkey'    : 'i',
                   'AltLabel'  : "Skill Ende aus",
                   'AltHotkey' : 'i',
                   'FormLabel' : "Skill \u03A9"
               },
    'anzahlOptiEnde' : {  // Spaltenauswahl fuer die Werte mit Ende 18:
                          // Gibt die Anzahl der Opti-Spalten an / 1: nur bester Opti, 2: die beiden besten, ..., 6: Alle inklusive TOR
                          // Bei Torhuetern wird immer nur der TOR-Opti angezeigt / Werte < 1 oder > 6 schalten die Anzeige aus
                   'Name'      : "anzOptiEnde",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'SelValue'  : false,
                   'Choice'    : [ 0, 1, 2, 3, 4, 5, 6 ],
                   'Default'   : 1,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Opti Ende: beste $",
                   'Hotkey'    : 't',
                   'FormLabel' : "Opti \u03A9:|beste $"
               },
    'anzahlMWEnde' : {    // Spaltenauswahl fuer die Werte mit Ende 18:
                          // Gibt die Anzahl der MW-Spalten an / 1: nur hoechsten MW, 2: die beiden hoechsten, ..., 6: Alle inklusive TOR
                          // Bei Torhuetern wird immer nur der TOR-MW angezeigt / Werte < 1 oder > 6 schalten die Anzeige aus
                   'Name'      : "anzMWEnde",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'SelValue'  : false,
                   'Choice'    : [ 0, 1, 2, 3, 4, 5, 6 ],
                   'Default'   : 1,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "MW Ende: beste $",
                   'Hotkey'    : 'W',
                   'FormLabel' : "MW \u03A9:|beste $"
               },
    'kennzeichenEnde' : {  // Markierung fuer Ende 18
                   'Name'      : "charEnde",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'FreeValue' : true,
                   'MinChoice' : 0,
                   'Choice'    : [ " \u03A9", " 18" ],
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Ende: $",
                   'Hotkey'    : 'E',
                   'FormLabel' : "Ende 18:|$"
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
    'saison' : {          // Laufende Saison
                   'Name'      : "saison",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : true,
                   'SelValue'  : false,
                   'Choice'    : [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ],
                   'Default'   : 12,
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
    'foerderung' : {      // Jugendfoerderung
                   'Name'      : "donation",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'Permanent' : true,
                   'SelValue'  : false,
                   'Choice'    : [ 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000,
                                  5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000 ],
                   'Default'   : 10000,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "F\xF6rderung: $",
                   'Hotkey'    : 'F',
                   'FormLabel' : "F\xF6rderung:|$"
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
    'fingerprints' : {    // Datenspeicher fuer Identifizierungsmerkmale der Jugendspieler
                   'Name'      : "fingerprints",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : true,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 6,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Identifikation:"
               },
    'birthdays' : {       // Datenspeicher fuer Geburtstage der Jugendspieler
                   'Name'      : "birthdays",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : true,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Geburtstage:"
               },
    'tClasses' : {        // Datenspeicher fuer Talente der Jugendspieler (-1=wenig, 0=normal, +1=hoch)
                   'Name'      : "tClasses",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : true,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Talente:"
               },
    'progresses' : {      // Datenspeicher fuer Aufwertungen der Jugendspieler (als Strings)
                   'Name'      : "progresses",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : true,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 7,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Aufwertungen:"
               },
    'zatAges' : {         // Datenspeicher fuer (gebrochene) Alter der Jugendspieler
                   'Name'      : "zatAges",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : true,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "ZAT-Alter:"
               },
    'trainiert' : {       // Datenspeicher fuer Trainingsquoten der Jugendspieler
                   'Name'      : "numProgresses",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : true,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Trainiert:"
               },
    'positions' : {       // Datenspeicher fuer optimale Positionen der Jugendspieler
                   'Name'      : "positions",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : true,
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
    'skills' : {          // Datenspeicher fuer aktuelle Einzelskills der Jugendspieler
                   'Name'      : "skills",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : true,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Skills:"
               },
    'hauptLS'  : {        // Option 'ligaSize' aus Modul 'OS2.haupt', hier als 'hauptLS'
                   'Shared'    : { /*'namespace' : "http://os.ongapo.com/",*/ 'module' : "OS2.haupt", 'item' : 'ligaSize' },
                   'Hidden'    : true,
                   'FormLabel' : "Liga:|$er (haupt)"
               },
    'hauptZat' : {        // Option 'datenZat' aus Modul 'OS2.haupt', hier als 'hauptZat'
                   'Shared'    : { /*'namespace' : "http://os.ongapo.com/",*/ 'module' : "OS2.haupt", 'item' : 'datenZat' },
                   'Hidden'    : true,
                   'Cols'      : 36,
                   'Rows'      : 6,
                   'Label'     : "ZAT:"
               },
    'haupt' : {           // Alle Optionen des Moduls 'OS2.haupt'
                   'Shared'    : { 'module' : "OS2.haupt", 'item' : '$' },
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : true,
                   'Serial'    : true,
                   'Cols'      : 36,
                   'Rows'      : 6,
                   'Replace'   : null,
                   'Space'     : 4,
                   'Label'     : "Haupt:"
               },
    'data' : {            // Optionen aller Module
                   'Shared'    : { 'module' : '$' },
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : true,
                   'Serial'    : true,
                   'Cols'      : 36,
                   'Rows'      : 6,
                   'Replace'   : null,
                   'Space'     : 4,
                   'Label'     : "Data:"
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

// Teamparameter fuer getrennte Speicherung der Optionen fuer Erst- und Zweitteam...
const __TEAMCLASS = new TeamClassification();

// Optionen mit Daten, die ZAT- und Team-bezogen gemerkt werden...
__TEAMCLASS.optSelect = {
                            'datenZat'     : true,
                            'oldDatenZat'  : true,
                            'fingerprints' : true,
                            'birthdays'    : true,
                            'tClasses'     : true,
                            'progresses'   : true,
                            'zatAges'      : true,
                            'trainiert'    : true,
                            'positions'    : true,
                            'skills'       : true,
                            'foerderung'   : true
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
    __TEAMCLASS.optSet = optSet;  // Classification mit optSet verknuepfen
    __TEAMCLASS.teamParams = optParams.teamParams;  // Ermittelte Parameter

    return startOptions(optConfig, optSet, __TEAMCLASS).then(optSet => {
                    if (optParams.getDonation) {
                        // Jugendfoerderung aus der Options-HTML-Seite ermitteln...
                        const __BOXDONATION = document.getElementsByTagName('option');
                        const __DONATION = getSelectionFromComboBox(__BOXDONATION, 10000, 'Number');

                        __LOG[3]("Jugendf\xF6rderung: " + __DONATION + " Euro");

                        // ... und abspeichern...
                        setOpt(optSet.foerderung, __DONATION, false);
                    }

                    return showOptions(optSet, optParams);
                }, defaultCatch);
}

// ==================== Ende Abschnitt fuer Optionen ====================

// ==================== Abschnitt genereller Code zur Anzeige der Jugend ====================

// Funktionen ***************************************************************************

// Erschafft die Spieler-Objekte und fuellt sie mit Werten
// reloadData: true = Teamuebersicht, false = Spielereinzelwerte
function init(playerRows, optSet, colIdx, offsetUpper = 1, offsetLower = 0, reloadData = false) {
    storePlayerDataFromHTML(playerRows, optSet, colIdx, offsetUpper, offsetLower, reloadData);

    const __SAISON = getOptValue(optSet.saison);
    const __AKTZAT = getOptValue(optSet.aktuellerZat);
    const __GEALTERT = ((__AKTZAT >= 72) ? (getIntFromHTML(playerRows[playerRows.length - offsetLower - 1].cells, colIdx.Age) < 13) : false);
    const __CURRZAT = (__GEALTERT ? 0 : __AKTZAT);
    const __DONATION = getOptValue(optSet.foerderung);
    const __BIRTHDAYS = getOptValue(optSet.birthdays, []);
    const __TCLASSES = getOptValue(optSet.tClasses, []);
    const __PROGRESSES = getOptValue(optSet.progresses, []);
    const __ZATAGES = getOptValue(optSet.zatAges, []);
    const __TRAINIERT = getOptValue(optSet.trainiert, []);
    const __POSITIONS = getOptValue(optSet.positions, []);
    const __SKILLS = getOptValue(optSet.skills, []);
    const __BASEDATA = [ __BIRTHDAYS, __TCLASSES, __PROGRESSES ];  // fuer initPlayer
    const __DATA = (reloadData ? [ __BASEDATA, __SKILLS ] : [ __SKILLS, __BASEDATA ]);  // fuer initPlayer: [0] = von HTML-Seite, [1] = aus gespeicherten Daten
    const __IDMAP = getPlayerIdMap(optSet);
    const __CATIDS = __IDMAP.catIds;
    const __PLAYERS = [];

    __LOG[5](__IDMAP);

    for (let i = offsetUpper, j = 0; i < playerRows.length - offsetLower; i++, j++) {
        const __CELLS = playerRows[i].cells;
        const __LAND = getStringFromHTML(__CELLS, colIdx.Land);
        const __AGE = getIntFromHTML(__CELLS, colIdx.Age);
        const __ISGOALIE = isGoalieFromHTML(__CELLS, colIdx.Age);
        const __NEWPLAYER = new PlayerRecord(__LAND, __AGE, __ISGOALIE, __SAISON, __CURRZAT, __DONATION);

        __NEWPLAYER.initPlayer(__DATA[0], j, ! reloadData);

        const __IDX = selectPlayerIndex(__NEWPLAYER, j, __CATIDS);

        __NEWPLAYER.initPlayer(__DATA[1], __IDX, reloadData);

        __NEWPLAYER.prognoseSkills();

        if (reloadData) {
            __NEWPLAYER.setZusatz(__ZATAGES[__IDX], __TRAINIERT[__IDX], __POSITIONS[__IDX]);
        }

        __PLAYERS[j] = __NEWPLAYER;
    }

    if (reloadData) {
        setPlayerData(__PLAYERS, optSet);
    } else {
        calcPlayerData(__PLAYERS, optSet);
    }

    storePlayerIds(__PLAYERS, optSet);

    return __PLAYERS;
}

// Berechnet die Identifikations-IDs (Fingerprints) der Spieler neu und speichert diese
function getPlayerIdMap(optSet) {
    const __FINGERPRINTS = getOptValue(optSet.fingerprints, []);
    const __MAP = {
                      'ids'    : { },
                      'cats'   : [],
                      'catIds' : { }
                  };
    const __IDS = __MAP.ids;
    const __CATS = __MAP.cats;
    const __CATIDS = __MAP.catIds;

    for (let i = 0; i < __FINGERPRINTS.length; i++) {
        const __ID = __FINGERPRINTS[i];
        const __CAT = PlayerRecord.prototype.getCatFromFingerPrint(__ID);

        if (__ID) {
            if (! __CATIDS[__CAT]) {
                __CATIDS[__CAT] = { };
            }
            __IDS[__ID] = i;
            __CATS[i] = __CAT;
            __CATIDS[__CAT][__ID] = i;
        }
    }

    return __MAP;
}

// Berechnet die Identifikations-IDs (Fingerprints) der Spieler neu und speichert diese
function storePlayerIds(players, optSet) {
    const __FINGERPRINTS = [];

    for (let i = 0; i < players.length; i++) {
        const __PLAYER = players[i];

        if ((__PLAYER.zatGeb !== undefined) && (__PLAYER.talent !== undefined) && (__PLAYER.positions !== undefined)) {
            __FINGERPRINTS[i]  = __PLAYER.getFingerPrint();
        }
    }

    setOpt(optSet.fingerprints, __FINGERPRINTS, false);
}

// Sucht fuer den Spieler den Eintrag aus catIds heraus und gibt den (geloeschten) Index zurueck
function selectPlayerIndex(player, index, catIds) {
    const __MYCAT = player.getCat();
    const __CATS = catIds[__MYCAT];
    const __ID = player.findInFingerPrints(__CATS);
    let idx = index;

    if (__ID !== undefined) {
        idx = __CATS[__ID];
        delete __CATS[__ID];
    }

    return idx;
}

// Speichtert die abgeleiteten Werte in den Spieler-Objekten
function setPlayerData(players, optSet) {
    const __ZATAGES = [];
    const __TRAINIERT = [];
    const __POSITIONS = [];

    for (let i = 0; i < players.length; i++) {
        const __ZUSATZ = players[i].calcZusatz();

        if (__ZUSATZ.zatAge !== undefined) {  // braucht Geburtstag fuer gueltige Werte!
            __ZATAGES[i]    = __ZUSATZ.zatAge;
        }
        __TRAINIERT[i]  = __ZUSATZ.trainiert;
        __POSITIONS[i]  = __ZUSATZ.bestPos;
    }

    setOpt(optSet.zatAges, __ZATAGES, false);
    setOpt(optSet.trainiert, __TRAINIERT, false);
    setOpt(optSet.positions, __POSITIONS, false);
}

// Berechnet die abgeleiteten Werte in den Spieler-Objekten neu und speichert diese
function calcPlayerData(players, optSet) {
    const __ZATAGES = [];
    const __TRAINIERT = [];
    const __POSITIONS = [];

    for (let i = 0; i < players.length; i++) {
        const __ZUSATZ = players[i].calcZusatz();

        if (__ZUSATZ.zatAge !== undefined) {  // braucht Geburtstag fuer gueltige Werte!
            __ZATAGES[i]    = __ZUSATZ.zatAge;
        }
        __TRAINIERT[i]  = __ZUSATZ.trainiert;
        __POSITIONS[i]  = __ZUSATZ.bestPos;
    }

    setOpt(optSet.zatAges, __ZATAGES, false);
    setOpt(optSet.trainiert, __TRAINIERT, false);
    setOpt(optSet.positions, __POSITIONS, false);
}

// Ermittelt die Werte in den Spieler-Objekten aus den Daten der Seite und speichert diese
// reloadData: true = Teamuebersicht, false = Spielereinzelwerte
function storePlayerDataFromHTML(playerRows, optSet, colIdx, offsetUpper = 1, offsetLower = 0, reloadData = false) {
    if (reloadData) {
        const __BIRTHDAYS = [];
        const __TCLASSES = [];
        const __PROGRESSES = [];

        for (let i = offsetUpper, j = 0; i < playerRows.length - offsetLower; i++, j++) {
            const __CELLS = playerRows[i].cells;

            __BIRTHDAYS[j] = getIntFromHTML(__CELLS, colIdx.Geb);
            __TCLASSES[j] = getTalentFromHTML(__CELLS, colIdx.Tal);
            __PROGRESSES[j] = getAufwertFromHTML(__CELLS, colIdx.Auf, getOptValue(optSet.shortAufw, true));
        }
        setOpt(optSet.birthdays, __BIRTHDAYS, false);
        setOpt(optSet.tClasses, __TCLASSES, false);
        setOpt(optSet.progresses, __PROGRESSES, false);
    } else {
        const __SKILLS = [];

        for (let i = offsetUpper, j = 0; i < playerRows.length - offsetLower; i++, j++) {
            const __CELLS = playerRows[i].cells;

            __SKILLS[j] = getSkillsFromHTML(__CELLS, colIdx);
        }
        setOpt(optSet.skills, __SKILLS, false);
    }
}

// Trennt die Gruppen (z.B. Jahrgaenge) mit Linien
function separateGroups(rows, borderString, colIdxSort = 0, offsetUpper = 1, offsetLower = 0, offsetLeft = -1, offsetRight = 0, formatFun = sameValue) {
    if (offsetLeft < 0) {
        offsetLeft = colIdxSort;  // ab Sortierspalte
    }

    for (let i = offsetUpper, newVal, oldVal = formatFun(rows[i].cells[colIdxSort].textContent); i < rows.length - offsetLower - 1; i++, oldVal = newVal) {
        newVal = formatFun(rows[i + 1].cells[colIdxSort].textContent);
        if (newVal !== oldVal) {
            for (let j = offsetLeft; j < rows[i].cells.length - offsetRight; j++) {
                rows[i].cells[j].style.borderBottom = borderString;
            }
        }
    }
}

// Funktionen fuer die HTML-Seite *******************************************************

// Liest die Talentklasse ("wenig", "normal", "hoch") aus der Spalte einer Zeile der Tabelle aus
// cells: Die Zellen einer Zeile
// colIdxStr: Spaltenindex der gesuchten Werte
// return Talent als Zahl (-1=wenig, 0=normal, +1=hoch)
function getTalentFromHTML(cells, colIdxTal) {
    const __TEXT = getStringFromHTML(cells, colIdxTal);

    return parseInt((__TEXT === 'wenig') ? -1 : (__TEXT === 'hoch') ? +1 : 0, 10);
}

// Liest die Einzelskills aus der Spalte einer Zeile der Tabelle aus
// cells: Die Zellen einer Zeile
// colIdx: Liste von Spaltenindices der gesuchten Werte mit den Eintraegen
// 'Einz' (erste Spalte) und 'Zus' (Spalte hinter dem letzten Eintrag)
// return Skills als Array von Zahlen
function getSkillsFromHTML(cells, colIdx) {
    const __RESULT = [];

    for (let i = colIdx.Einz; i < colIdx.Zus; i++) {
        __RESULT[i - colIdx.Einz] = getIntFromHTML(cells, i);
    }

    return __RESULT;
}

// Liest aus, ob der Spieler Torwart oder Feldspieler ist
// cells: Die Zellen einer Zeile
// colIdxClass: Spaltenindex einer fuer TOR eingefaerbten Zelle
// return Angabe, der Spieler Torwart oder Feldspieler ist
function isGoalieFromHTML(cells, colIdxClass) {
    return (cells[colIdxClass].className === 'TOR');
}

// Konvertiert den Aufwertungstext einer Zelle auf der Jugend-Teamuebersicht
// value: Der Inhalt dieser Zeile ("+1 SKI +1 OPT" bzw. "+2 SKI)
// cell: Zelle, in der der Text stand (optional)
// return Der konvertierte String ("SKI OPT" bzw. "SKI SKI")
function convertAufwertung(value, cell = undefined) {
    if (value !== undefined) {
        value = value.replace(/\+2 (\w+)/, "$1 $1").replace(/\+1 /g, "");

        if (cell) {
            if (cell.className === 'TOR') {
                value = convertGoalieSkill(value);
            }

            cell.align = 'left';
        }
    }

    return value;
}

// Liest die Aufwertungen eines Spielers aus und konvertiert je nachdem, ob der Spieler Torwart oder Feldspieler ist
// cells: Die Zellen einer Zeile
// colIdxAuf: Spaltenindex der gesuchten Aufwertungen
// shortForm: true = abgekuerzt, false = Originalform
// return Konvertierte Aufwertungen (kurze oder lange Form, aber in jedem Fall fuer Torwart konvertiert)
function getAufwertFromHTML(cells, colIdxAuf, shortForm = true) {
    const __ISGOALIE = isGoalieFromHTML(cells, colIdxAuf);

    return convertStringFromHTML(cells, colIdxAuf, (shortForm ? convertAufwertung : __ISGOALIE ? convertGoalieSkill : undefined));
}

// ==================== Ende Abschnitt genereller Code zur Anzeige der Jugend ====================

// ==================== Hauptprogramm ====================

// Verarbeitet Ansicht "Haupt" (Managerbuero) zur Ermittlung des aktuellen ZATs
function procHaupt() {
    const __TEAMPARAMS = getTeamParamsFromTable(getTable(1), __TEAMSEARCHHAUPT);  // Link mit Team, Liga, Land...

    return buildOptions(__OPTCONFIG, __OPTSET, {
                            'teamParams' : __TEAMPARAMS,
                            'hideMenu'   : true
                        }).then(async optSet => {
            const __ZATCELL = getProp(getProp(getRows(0), 2), 'cells', { })[0];
            const __NEXTZAT = getZATNrFromCell(__ZATCELL);  // "Der naechste ZAT ist ZAT xx und ..."
            const __CURRZAT = __NEXTZAT - 1;
            const __DATAZAT = getOptValue(__OPTSET.datenZat);

            // Stand der alten Daten merken...
            setOpt(__OPTSET.oldDatenZat, __DATAZAT, false);

            if (__CURRZAT >= 0) {
                __LOG[2]("Aktueller ZAT: " + __CURRZAT);

                // Neuen aktuellen ZAT speichern...
                setOpt(__OPTSET.aktuellerZat, __CURRZAT, false);

                if (__CURRZAT !== __DATAZAT) {
                    __LOG[2](__LOG.changed(__DATAZAT, __CURRZAT));

                    // ... und ZAT-bezogene Daten als veraltet markieren (ausser 'skills' und 'positions')
                    await __TEAMCLASS.deleteOptions({
                                                    'skills'      : true,
                                                    'positions'   : true,
                                                    'datenZat'    : true,
                                                    'oldDatenZat' : true
                                                }).catch(defaultCatch);

                    // Neuen Daten-ZAT speichern...
                    setOpt(__OPTSET.datenZat, __CURRZAT, false);
                }
            }
        });
}

// Verarbeitet Ansicht "Optionen" zur Ermittlung der Jugendfoerderung
function procOptionen() {
    return buildOptions(__OPTCONFIG, __OPTSET, {
                            'menuAnchor'  : getTable(0, 'div'),
                            'hideMenu'    : true,
                            'getDonation' : true,
                            'showForm'    : {
                                                'foerderung'    : true,
                                                'showForm'      : true
                                            }
        });
}

// Verarbeitet Ansicht "Teamuebersicht"
function procTeamuebersicht() {
    const __ROWOFFSETUPPER = 1;     // Header-Zeile
    const __ROWOFFSETLOWER = 1;     // Ziehen-Button

    const __COLUMNINDEX = {
            'Age'   : 0,
            'Geb'   : 1,
            'Flg'   : 2,
            'Land'  : 3,
            'U'     : 4,
            'Skill' : 5,
            'Tal'   : 6,
            'Akt'   : 7,
            'Auf'   : 8,
            'Zus'   : 9
        };

    if (getElement('transfer') !== undefined) {
        __LOG[2]("Ziehen-Seite");
    } else if (getRows(1) === undefined) {
        __LOG[2]("Diese Seite ist ohne Team nicht verf\xFCgbar!");
    } else {
        return buildOptions(__OPTCONFIG, __OPTSET, {
                                'menuAnchor' : getTable(0, 'div'),
                                'showForm'   : {
                                                   'kennzeichenEnde'    : true,
                                                   'shortAufw'          : true,
                                                   'sepStyle'           : true,
                                                   'sepColor'           : true,
                                                   'sepWidth'           : true,
                                                   'saison'             : true,
                                                   'aktuellerZat'       : true,
                                                   'foerderung'         : true,
                                                   'team'               : true,
                                                   'zeigeBalken'        : true,
                                                   'absBalken'          : true,
                                                   'zeigeId'            : true,
                                                   'ersetzeAlter'       : true,
                                                   'zeigeAlter'         : true,
                                                   'zeigeQuote'         : true,
                                                   'zeigePosition'      : true,
                                                   'zeigeZatDone'       : true,
                                                   'zeigeZatLeft'       : true,
                                                   'zeigeFixSkills'     : true,
                                                   'zeigeTrainiert'     : true,
                                                   'zeigeAnteilPri'     : true,
                                                   'zeigeAnteilSec'     : true,
                                                   'zeigePrios'         : true,
                                                   'zeigeSkill'         : true,
                                                   'anzahlOpti'         : true,
                                                   'anzahlMW'           : true,
                                                   'zeigeTrainiertEnde' : true,
                                                   'zeigeAnteilPriEnde' : true,
                                                   'zeigeAnteilSecEnde' : true,
                                                   'zeigePriosEnde'     : true,
                                                   'zeigeSkillEnde'     : true,
                                                   'anzahlOptiEnde'     : true,
                                                   'anzahlMWEnde'       : true,
                                                   'zatAges'            : true,
                                                   'trainiert'          : true,
                                                   'positions'          : true,
                                                   'skills'             : true,
                                                   'reset'              : true,
                                                   'showForm'           : true
                                               },
                                'formWidth'  : 1
                            }).then(optSet => {
                const __ROWS = getRows(1);
                const __HEADERS = __ROWS[0];
                const __TITLECOLOR = getColor('LEI');  // "#FFFFFF"

                const __PLAYERS = init(__ROWS, __OPTSET, __COLUMNINDEX, __ROWOFFSETUPPER, __ROWOFFSETLOWER, true);
                const __COLMAN = new ColumnManager(__OPTSET, __COLUMNINDEX, {
                                                    'Default'            : true,
                                                    'ersetzeSkills'      : false,
                                                    'zeigeGeb'           : false,
                                                    'zeigeSkill'         : false,
                                                    'zeigeTal'           : false,
                                                    'zeigeAufw'          : false
                                                });

                __COLMAN.addTitles(__HEADERS, __TITLECOLOR);

                for (let i = 0; i < __PLAYERS.length; i++) {
                    __COLMAN.addValues(__PLAYERS[i], __ROWS[i + __ROWOFFSETUPPER], __TITLECOLOR);
                }

                // Format der Trennlinie zwischen den Monaten...
                const __BORDERSTRING = getOptValue(__OPTSET.sepStyle) + ' ' + getOptValue(__OPTSET.sepColor) + ' ' + getOptValue(__OPTSET.sepWidth);

                separateGroups(__ROWS, __BORDERSTRING, __COLUMNINDEX.Age, __ROWOFFSETUPPER, __ROWOFFSETLOWER, -1, 0, floorValue);
            });
    }
}

// Verarbeitet Ansicht "Spielereinzelwerte"
function procSpielereinzelwerte() {
    const __ROWOFFSETUPPER = 1;     // Header-Zeile
    const __ROWOFFSETLOWER = 0;

    const __COLUMNINDEX = {
            'Flg'   : 0,
            'Land'  : 1,
            'U'     : 2,
            'Age'   : 3,
            'Einz'  : 4,    // ab hier die Einzelskills
            'SCH'   : 4,
            'ABS'   : 4,    // TOR
            'BAK'   : 5,
            'STS'   : 5,    // TOR
            'KOB'   : 6,
            'FAN'   : 6,    // TOR
            'ZWK'   : 7,
            'STB'   : 7,    // TOR
            'DEC'   : 8,
            'SPL'   : 8,    // TOR
            'GES'   : 9,
            'REF'   : 9,    // TOR
            'FUQ'   : 10,
            'ERF'   : 11,
            'AGG'   : 12,
            'PAS'   : 13,
            'AUS'   : 14,
            'UEB'   : 15,
            'WID'   : 16,
            'SEL'   : 17,
            'DIS'   : 18,
            'ZUV'   : 19,
            'EIN'   : 20,
            'Zus'   : 21     // Zusaetze hinter den Einzelskills
        };

    if (getRows(1) === undefined) {
        __LOG[2]("Diese Seite ist ohne Team nicht verf\xFCgbar!");
    } else {
        return buildOptions(__OPTCONFIG, __OPTSET, {
                                'menuAnchor' : getTable(0, 'div'),
                                'hideForm'   : {
                                                   'zatAges'       : true,
                                                   'trainiert'     : true,
                                                   'positions'     : true,
                                                   'skills'        : true,
                                                   'shortAufw'     : true
                                               },
                                'formWidth'  : 1
                            }).then(optSet => {
                const __ROWS = getRows(1);
                const __HEADERS = __ROWS[0];
                const __TITLECOLOR = getColor('LEI');  // "#FFFFFF"

                const __PLAYERS = init(__ROWS, __OPTSET, __COLUMNINDEX, __ROWOFFSETUPPER, __ROWOFFSETLOWER, false);
                const __COLMAN = new ColumnManager(__OPTSET, __COLUMNINDEX, true);

                __COLMAN.addTitles(__HEADERS, __TITLECOLOR);

                for (let i = 0; i < __PLAYERS.length; i++) {
                    __COLMAN.addValues(__PLAYERS[i], __ROWS[i + __ROWOFFSETUPPER], __TITLECOLOR);
                }

                // Format der Trennlinie zwischen den Monaten...
                const __BORDERSTRING = getOptValue(__OPTSET.sepStyle) + ' ' + getOptValue(__OPTSET.sepColor) + ' ' + getOptValue(__OPTSET.sepWidth);

                separateGroups(__ROWS, __BORDERSTRING, __COLUMNINDEX.Age, __ROWOFFSETUPPER, __ROWOFFSETLOWER, -1, 0, floorValue);
            });
    }
}

(() => {
    (async () => {
        try {
            // URL-Legende:
            // page=0: Managerbuero
            // page=1: Teamuebersicht
            // page=2: Spielereinzelwerte
            // page=3: Optionen

            // Verzweige in unterschiedliche Verarbeitungen je nach Wert von page:
            switch (getPageIdFromURL(window.location.href, {
                                                               'haupt.php' : 0,  // Ansicht "Haupt" (Managerbuero)
                                                               'ju.php'    : 1   // Ansicht "Jugendteam"
                                                           }, 'page')) {
                case 0  : await procHaupt().catch(defaultCatch); break;
                case 1  : await procTeamuebersicht().catch(defaultCatch); break;
                case 2  : await procSpielereinzelwerte().catch(defaultCatch); break;
                case 3  : await procOptionen().catch(defaultCatch); break;
                default : break;
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
