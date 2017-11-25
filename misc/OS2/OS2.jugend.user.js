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

// Klasse ColumnManager *****************************************************************

function ColumnManager(optSet, colIdx, showCol) {
    'use strict';

    __LOG[3]("ColumnManager()");

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

    this.colIdx = colIdx;

    this.fpId = (__BIRTHDAYS && __TCLASSES && __POSITIONS && getValue(__SHOWCOL.zeigeId, __SHOWALL) && getOptValue(optSet.zeigeId));
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
}

Class.define(ColumnManager, Object, {
        'toString'       : function() {  // Bisher nur die noetigsten Parameter ausgegeben...
                               let result = "Skillschnitt\t\t" + this.skill + '\n';
                               result += "Beste Position\t" + this.pos + '\n';
                               result += "Optis\t\t\t" + this.anzOpti + '\n';
                               result += "Marktwerte\t\t" + this.anzMw + '\n';
                               result += "Skillschnitt Ende\t" + this.skillE + '\n';
                               result += "Optis Ende\t\t" + this.anzOptiE + '\n';
                               result += "Marktwerte Ende\t" + this.anzMwE + '\n';

                               return result;
                           },
        'addCell'        : function(tableRow) {
                               return tableRow.insertCell(-1);
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
                               return '<img src="images/balken/' + __IMAGE + '.GIF" width="' + __WIDTH + '" height=' + __HEIGHT + '>';
                           },
        'addTitles'      : function(headers, titleColor = "#FFFFFF") {
                               // Spaltentitel zentrieren
                               headers.align = "center";

                               // Titel fuer die aktuellen Werte
                               if (this.fpId) {
                                   this.addAndFillCell(headers, "Identifikation", titleColor);
                               }
                               if (this.bar) {
                                   this.addAndFillCell(headers, "Qualit\xE4t", titleColor);
                               }
                               if (this.tal) {
                                   this.addAndFillCell(headers, "Talent", titleColor);
                               }
                               if (this.quo) {
                                   this.addAndFillCell(headers, "Quote", titleColor);
                               }
                               if (this.aufw) {
                                   this.addAndFillCell(headers, "Aufwertung", titleColor);
                               }
                               if (this.geb) {
                                   this.addAndFillCell(headers, "Geb.", titleColor);
                               }
                               if (this.alter && ! this.substAge) {
                                   this.addAndFillCell(headers, "Alter", titleColor);
                               }
                               if (this.fix) {
                                   this.addAndFillCell(headers, "fix", titleColor);
                               }
                               if (this.tr) {
                                   this.addAndFillCell(headers, "tr.", titleColor);
                               }
                               if (this.zat) {
                                   this.addAndFillCell(headers, "ZAT", titleColor);
                               }
                               if (this.antHpt) {
                                   this.addAndFillCell(headers, "%H", titleColor);
                               }
                               if (this.antNeb) {
                                   this.addAndFillCell(headers, "%N", titleColor);
                               }
                               if (this.pri) {
                                   this.addAndFillCell(headers, "Prios", titleColor);
                               }
                               if (this.skill) {
                                   this.addAndFillCell(headers, "Skill", titleColor);
                               }
                               if (this.pos) {
                                   this.addAndFillCell(headers, "Pos", titleColor);
                               }
                               for (let i = 1; i <= 6; i++) {
                                   if (i <= this.anzOpti) {
                                       this.addAndFillCell(headers, "Opti " + i, titleColor);
                                   }
                                   if (i <= this.anzMw) {
                                       this.addAndFillCell(headers, "MW " + i, titleColor);
                                   }
                               }

                               // Titel fuer die Werte mit Ende 18
                               if (this.trE) {
                                   this.addAndFillCell(headers, "tr." + this.kennzE, titleColor);
                               }
                               if (this.zatE) {
                                   this.addAndFillCell(headers, "ZAT" + this.kennzE, titleColor);
                               }
                               if (this.antHptE) {
                                   this.addAndFillCell(headers, "%H" + this.kennzE, titleColor);
                               }
                               if (this.antNebE) {
                                   this.addAndFillCell(headers, "%N" + this.kennzE, titleColor);
                               }
                               if (this.priE) {
                                   this.addAndFillCell(headers, "Prios" + this.kennzE, titleColor);
                               }
                               if (this.skillE) {
                                   this.addAndFillCell(headers, "Skill" + this.kennzE, titleColor);
                               }
                               for (let i = 1; i <= 6; i++) {
                                   if (i <= this.anzOptiE) {
                                       this.addAndFillCell(headers, "Opti " + i + this.kennzE, titleColor);
                                   }
                                   if (i <= this.anzMwE) {
                                       this.addAndFillCell(headers, "MW " + i + this.kennzE, titleColor);
                                   }
                               }
                           },  // Ende addTitles()
        'addValues'      : function(player, playerRow, color = "#FFFFFF") {
                               const __IDXPRI = getIdxPriSkills(player.getPos());
                               const __COLALERT = getColor('STU');  // rot
                               const __COLOR = ((player.zatLeft < 1) ? __COLALERT : player.isGoalie ? getColor('TOR') : color);
                               const __POS1COLOR = getColor((player.getPosPercent() > 99.99) ? 'LEI' : player.getPos());
                               const __OSBLAU = getColor("");

                               // Aktuelle Werte
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
                                   convertStringFromHTML(playerRow.cells, this.colIdx.Age, function(unused) {
                                                                                               return parseFloat(player.getAge()).toFixed(2);
                                                                                           });
                               } else if (this.alter) {
                                   this.addAndFillCell(playerRow, player.getAge(), __COLOR, null, 2);
                               }
                               if (player.zatLeft < 6) {  // Abrechnungszeitraum vor dem letztmoeglichen Ziehen...
                                   formatCell(playerRow.cells[this.colIdx.Age], true, __COLALERT, null);
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
                                   this.addAndFillCell(playerRow, player.getPos(), __POS1COLOR);
                               }
                               for (let i = 1; i <= 6; i++) {
                                   const __POSI = ((i === 1) ? player.getPos() : player.getPos(i));
                                   const __COLI = getColor(__POSI);

                                   if (i <= this.anzOpti) {
                                       if ((i === 1) || ! player.isGoalie) {
                                           // Opti anzeigen
                                           this.addAndFillCell(playerRow, player.getOpti(__POSI), __COLI, null, 2);
                                       } else {
                                           // TOR, aber nicht bester Opti -> nur Zelle hinzufuegen
                                           this.addCell(playerRow);
                                       }
                                   }
                                   if (i <= this.anzMw) {
                                       if ((i === 1) || ! player.isGoalie) {
                                           // MW anzeigen
                                           this.addAndFillCell(playerRow, player.getMarketValue(__POSI), __COLI, null, 0);
                                       } else {
                                           // TOR, aber nicht bester MW -> nur Zelle hinzufuegen
                                           this.addCell(playerRow);
                                       }
                                   }
                               }

                               // Werte mit Ende 18
                               if (this.substSkills) {
                                   convertArrayFromHTML(playerRow.cells, this.colIdx.Einz, player.skillsEnd, function(value, cell, unused, index) {
                                                                                                                 if (~ __IDXPRI.indexOf(index)) {
                                                                                                                     formatCell(cell, true, __OSBLAU, __POS1COLOR);
                                                                                                                 }
                                                                                                                 return value;
                                                                                                             });
                               } else if (this.colIdx.Einz) {
                                   convertArrayFromHTML(playerRow.cells, this.colIdx.Einz, player.skills.length, function(value, cell, unused, index) {
                                                                                                                     if (~ __IDXPRI.indexOf(index)) {
                                                                                                                         formatCell(cell, true);
                                                                                                                     }
                                                                                                                     return value;
                                                                                                                 });
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
                               for (let i = 1; i <= 6; i++) {
                                   const __POSI = ((i === 1) ? player.getPos() : player.getPos(i));
                                   const __COLI = getColor(__POSI);

                                   if (i <= this.anzOptiE) {
                                       if ((i === 1) || ! player.isGoalie) {
                                           // Opti anzeigen
                                           this.addAndFillCell(playerRow, player.getOpti(__POSI, player.__TIME.end), __COLI, null, 2);
                                       } else {
                                           // TOR, aber nicht bester Opti -> nur Zelle hinzufuegen
                                           this.addCell(playerRow);
                                       }
                                   }
                                   if (i <= this.anzMwE) {
                                       if ((i === 1) || ! player.isGoalie) {
                                           // MW anzeigen
                                           this.addAndFillCell(playerRow, player.getMarketValue(__POSI, player.__TIME.end), __COLI, null, 0);
                                       } else {
                                           // TOR, aber nicht bester MW -> nur Zelle hinzufuegen
                                           this.addCell(playerRow);
                                       }
                                   }
                               }
                           }  // Ende addValues(player, playerRow)
    });

// Klasse PlayerRecord ******************************************************************

function PlayerRecord(land, age, isGoalie, saison, currZAT, donation) {
    'use strict';

    this.land = land;
    this.age = age;
    this.isGoalie = isGoalie;

    this.saison = saison;
    this.currZAT = currZAT;
    this.donation = donation;
    this.mwFormel = ((this.saison < 10) ? this.__MWFORMEL.alt : this.__MWFORMEL.S10);

    // in new PlayerRecord() definiert:
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

    // in this.getPos() definiert:
    // this.bestPos: erster (bester) Positionstext
}

Class.define(PlayerRecord, Object, {
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
                                          result += "\n\t" + this.getPos()[i] + '\t';
                                          result += this.getOpti(pos, this.__TIME.end).toFixed(2) + '\t';
                                          result += getNumberString(this.getMarketValue(pos, this.__TIME.end).toString());
                                      }

                                      return result;
                                  },  // Ende this.toString()
        'initPlayer'            : function(data, index, skillData = false) {  // skillData: true = Skilldaten, false = Basiswerte (Geb., Talent, Aufwertungen)
                                      if (data !== undefined) {
                                          if (skillData) {
                                              this.setSkills(data[index]);
                                          } else {
                                              this.setGeb(data[0][index]);
                                              this.talent = data[1][index];
                                              this.aufwert = data[2][index];
                                          }
                                      }
                                  },  // Ende this.initPlayer()
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
                                      sortPositionArray(this.positions);
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
                                      } else {
                                          return this.zatAge;
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
                                      const __IDXOFFSET = 1;

                                      switch (idx) {
                                      case -1 : return (this.bestPos = this.positions[this.isGoalie ? 5 : 0][0]);
                                      case  0 : return this.bestPos;
                                      default : return this.positions[idx - __IDXOFFSET][0];
                                      }
                                  },
        'getPosPercent'         : function(idx = 0) {
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
                                      const __SUMALLSKILLS = this.getSkillSum(when);
                                      const __SUMPRISKILLS = this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4);
                                      const __OVERFLOW = Math.max(0, __SUMPRISKILLS - this.__MAXPRISKILLS);
/*if (this.zatGeb === 24) {
    console.error("__OVERFLOW = " + __OVERFLOW);
    console.error("__SUMALLSKILLS = " + __SUMALLSKILLS);
    console.error("__SUMPRISKILLS = " + __SUMPRISKILLS);
    console.error("getOpti(" + pos + ") = " + ((4 * (__SUMPRISKILLS - __OVERFLOW) + __SUMALLSKILLS) / 27));
}*/
                                      return (4 * (__SUMPRISKILLS - __OVERFLOW) + __SUMALLSKILLS) / 27;
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

// Funktionen fuer die HTML-Seite *******************************************************

// Liest eine Zahl aus der Spalte einer Zeile der Tabelle aus (z.B. Alter, Geburtsdatum)
// cells: Die Zellen einer Zeile
// colIdxInt: Spaltenindex der gesuchten Werte
// return Spalteneintrag als Zahl (-1 fuer "keine Zahl", undefined fuer "nicht gefunden")
function getIntFromHTML(cells, colIdxInt) {
    const __CELL = getValue(cells[colIdxInt], { });
    const __TEXT = __CELL.textContent;

    if (__TEXT !== undefined) {
        try {
            const __VALUE = parseInt(__TEXT, 10);

            if (! isNaN(__VALUE)) {
                return __VALUE;
            }
        } catch (ex) { }

        return -1;
    }

    return undefined;
}

// Liest eine Dezimalzahl aus der Spalte einer Zeile der Tabelle aus
// cells: Die Zellen einer Zeile
// colIdxInt: Spaltenindex der gesuchten Werte
// return Spalteneintrag als Dezimalzahl (undefined fuer "keine Zahl" oder "nicht gefunden")
function getFloatFromHTML(cells, colIdxFloat) {
    const __CELL = getValue(cells[colIdxFloat], { });
    const __TEXT = __CELL.textContent;

    if (__TEXT !== undefined) {
        try {
            return parseFloat(__TEXT);
        } catch (ex) { }
    }

    return undefined;
}

// Liest einen String aus der Spalte einer Zeile der Tabelle aus
// cells: Die Zellen einer Zeile
// colIdxStr: Spaltenindex der gesuchten Werte
// return Spalteneintrag als String ("" fuer "nicht gefunden")
function getStringFromHTML(cells, colIdxStr) {
    const __CELL = getValue(cells[colIdxStr], { });
    const __TEXT = __CELL.textContent;

    return getValue(__TEXT.toString(), "");
}

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

// Liest einen String aus der Spalte einer Zeile der Tabelle aus, nachdem dieser konvertiert wurde
// cells: Die Zellen einer Zeile
// colIdxStr: Spaltenindex der gesuchten Werte
// convertFun: Funktion, die den Wert konvertiert
// return Spalteneintrag als String ("" fuer "nicht gefunden")
function convertStringFromHTML(cells, colIdxStr, convertFun = sameValue) {
    const __CELL = getValue(cells[colIdxStr], { });
    const __TEXT = convertFun(__CELL.textContent, __CELL, colIdxStr, 0);

    if (__TEXT !== undefined) {
        __CELL.innerHTML = __TEXT;
    }

    return getValue(__TEXT.toString(), "");
}

// Liest ein Array von String-Werten aus den Spalten ab einer Zeile der Tabelle aus, nachdem diese konvertiert wurden
// cells: Die Zellen einer Zeile
// colIdxArr: Erster Spaltenindex der gesuchten Werte
// arrOrLength: Entweder ein Datenarray zum Fuellen oder die Anzahl der zu lesenden Werte
// convertFun: Funktion, die die Werte konvertiert
// return Array mit Spalteneintraegen als String ("" fuer "nicht gefunden")
function convertArrayFromHTML(cells, colIdxArr, arrOrLength = 1, convertFun = sameValue) {
    const __ARR = ((typeof arrOrSize === 'number') ? { } : arrOrLength);
    const __LENGTH = getValue(__ARR.length, arrOrLength);
    const __RET = [];

    for (let index = 0, colIdx = colIdxArr; index < __LENGTH; index++, colIdx++) {
        const __CELL = getValue(cells[colIdx], { });
        const __TEXT = convertFun(getValue(__ARR[index], __CELL.textContent), __CELL, colIdx, index);

        if (__TEXT !== undefined) {
            __CELL.innerHTML = __TEXT;
        }

        __RET.push(getValue(__TEXT, "").toString());
    }

    return __RET;
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

// Formatiert eine Zelle um (mit einfachen Parametern)
// cell: Zu formatierende Zelle
// bold: Inhalt fett darstellen (true = ja, false = nein)
// color: Falls angegeben, die Schriftfarbe
// bgColor: Falls angegeben, die Hintergrundfarbe
// return Die formatierte Zelle
function formatCell(cell, bold = true, color = undefined, bgColor = undefined) {
    if (cell) {
        if (bold) {
            cell.style.fontWeight = 'bold';
        }
        if (color) {
            cell.style.color = color;
        }
        if (bgColor) {
            cell.style.backgroundColor = bgColor;
        }
    }

    return cell;
}

// Konvertiert die allgemeinen Skills in die eines Torwarts
// value: Ein Text, der die Skillnamen enthaelt
// return Der konvertierte String mit Aenderungen (z.B. "FAN" statt "KOB") oder unveraendert
function convertGoalieSkill(value) {
    if (value !== undefined) {
        value = value.replace(/\w+/g, getGoalieSkill);
    }

    return value;
}

// Konvertiert einen Aufwertungstext fuer einen Skillnamen in den fuer einen Torwart
// name: Allgemeiner Skillname (abgeleitet von den Feldspielern)
// return Der konvertierte String (z.B. "FAN" statt "KOB") oder unveraendert
function getGoalieSkill(name) {
    const __GOALIESKILLS = {
                               'SCH' : 'ABS',
                               'BAK' : 'STS',
                               'KOB' : 'FAN',
                               'ZWK' : 'STB',
                               'DEC' : 'SPL',
                               'GES' : 'REF'
                           };

    return getValue(__GOALIESKILLS[name], name);
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

// Identitaetsfunktion. Konvertiert nichts, sondern liefert einfach den Wert zurueck
// value: Der uebergebene Wert
// return Derselbe Wert
function sameValue(value) {
    return value;
}

// Liefert den ganzzeiligen Anteil einer Zahl zurueck, indem alles hinter einem Punkt abgeschnitten wird
// value: Eine uebergebene Dezimalzahl
// return Der ganzzeilige Anteil dieser Zahl
function floorValue(value, dot = '.') {
    if ((value === 0) || (value && isFinite(value))) {
        const __VALUE = value.toString();
        const __INDEXDOT = (__VALUE ? __VALUE.indexOf(dot) : -1);

        return Number((~ __INDEXDOT) ? __VALUE.substring(0, __INDEXDOT) : __VALUE);
    } else {
        return value;
    }
}

// Liefert einen rechtsbuendigen Text zurueck, der links aufgefuellt wird
// value: Ein uebergebener Wert
// size: Zielbreite (clipping fuer < 0: Abschneiden, falls zu lang)
// char: Zeichen zum Auffuellen
// return Ein String, der mindestens |size| lang ist (oder genau, falls size < 0, also clipping)
function padLeft(value, size = 4, char = ' ') {
    const __SIZE = Math.abs(size);
    const __CLIP = (size < 0);
    const __VALUE = (value ? value.toString() : "");
    let i = __VALUE.length;
    let str = "";

    while (i < __SIZE) {
        str += char;
        i += char.length;
    }
    str = ((i > __SIZE) ? str.slice(0, __SIZE - __VALUE.length - 1) : str) + __VALUE;

    return (__CLIP ? str.slice(size) : str);
}

// Liefert eine rechtsbuendigen Zahl zurueck, der links (mit Nullen) aufgefuellt wird
// value: Eine uebergebene Zahl
// size: Zielbreite (Default: 2)
// char: Zeichen zum Auffuellen (Default: '0')
// forceClip: Abschneiden erzwingen, falls zu lang?
// return Eine Zahl als String, der mindestens 'size' lang ist (oder genau, falls size < 0, also clipping)
function padNumber(value, size = 2, char = '0') {
    if ((value === 0) || (value && isFinite(value))) {
        return padLeft(value, size, char);
    } else {
        return value;
    }
}

// Hilfsfunktionen **********************************************************************

// Sortiert das Positionsfeld per BubbleSort
function sortPositionArray(array) {
    const __TEMP = [];
    let transposed = true;
    // TOR soll immer die letzte Position im Feld sein, deshalb - 1
    let length = array.length - 1;

    while (transposed && (length > 1)) {
        transposed = false;
        for (let i = 0; i < length - 1; i++) {
            // Vergleich Opti-Werte:
            if (array[i][1] < array[i + 1][1]) {
                // vertauschen
                __TEMP[0] = array[i][0];
                __TEMP[1] = array[i][1];
                array[i][0] = array[i + 1][0];
                array[i][1] = array[i + 1][1];
                array[i + 1][0] = __TEMP[0];
                array[i + 1][1] = __TEMP[1];
                transposed = true;
            }
        }
        length--;
    }
}

// Fuegt in die uebergebene Zahl Tausender-Trennpunkte ein
// Wandelt einen etwaig vorhandenen Dezimalpunkt in ein Komma um
function getNumberString(numberString) {
    if (numberString.lastIndexOf('.') !== -1) {
        // Zahl enthaelt Dezimalpunkt
        const __VORKOMMA = numberString.substring(0, numberString.lastIndexOf('.'));
        const __NACHKOMMA = numberString.substring(numberString.lastIndexOf('.') + 1, numberString.length);

        return getNumberString(__VORKOMMA) + ',' + __NACHKOMMA;
    } else {
        // Kein Dezimalpunkt, fuege Tausender-Trennpunkte ein:
        // String umdrehen, nach jedem dritten Zeichen Punkt einfuegen, dann wieder umdrehen:
        const __TEMP = reverseString(numberString);
        let result = "";

        for (let i = 0; i < __TEMP.length; i++) {
            if ((i > 0) && (i % 3 === 0)) {
                result += '.';
            }
            result += __TEMP.substr(i, 1);
        }

        return reverseString(result);
    }
}

// Dreht den uebergebenen String um
function reverseString(string) {
    let result = "";

    for (let i = string.length - 1; i >= 0; i--) {
        result += string.substr(i, 1);
    }

    return result;
}

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

    return __ALLNAMES[idx];
}

// Gibt den Skill-Namen zu einem Index-Array zurueck
function getSkillNameArray(idxArr, isGoalie = false) {
    return (idxArr ? idxArr.map(function(item) {
                                    return getSkillName(item, isGoalie);
                                }) : idxArr);
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

// Gibt die zur Position gehoerige Farbe zurueck
function getColor(pos) {
    switch (pos) {
        case 'TOR' : return "#FFFF00";
        case 'ABW' : return "#00FF00";
        case 'DMI' : return "#3366FF";
        case 'MIT' : return "#66FFFF";
        case 'OMI' : return "#FF66FF";
        case 'STU' : return "#FF0000";
        case 'LEI' : return "#FFFFFF";
        case "" :    return "#111166";  // osBlau
        default :    return "";
    }
}

// ==================== Ende Abschnitt genereller Code zur Anzeige der Jugend ====================

// ==================== Abschnitt fuer sonstige Parameter ====================

// Formatiert eine Zelle um (mit einfachen Parametern)
// cell: Zu formatierende Zelle
// bold: Inhalt fett darstellen (true = ja, false = nein)
// color: Falls angegeben, die Schriftfarbe
// bgColor: Falls angegeben, die Hintergrundfarbe
// return Die formatierte Zelle
function formatCell(cell, bold = true, color = undefined, bgColor = undefined) {
    if (cell) {
        if (bold) {
            cell.style.fontWeight = 'bold';
        }
        if (color) {
            cell.style.color = color;
        }
        if (bgColor) {
            cell.style.backgroundColor = bgColor;
        }
    }

    return cell;
}

// Ermittelt die auszugewaehlenden Werte eines Selects (Combo-Box) als Array zurueck
// element: 'select'-Element oder dessen Name auf der HTML-Seite mit 'option'-Eintraegen der Combo-Box
// valType: Typ-Klasse der Optionswerte ('String', 'Number', ...)
// valFun: Funktion zur Ermittlung des Wertes eines 'option'-Eintrags (getSelectedOptionText, getSelectedValue, ...)
// defValue: Default-Wert, falls nichts selektiert ist
// return Array mit den Options-Werten
function getSelectionArray(element, valType = 'String', valFun = getSelectedValue, defValue = undefined) {
    const __SELECT = ((typeof element) === 'string' ? getValue(document.getElementsByName(element), [])[0] : element);

    return (__SELECT ? [].map.call(__SELECT.options, function(option) {
                                                         return this[valType](getValue(valFun(option), defValue));
                                                     }) : undefined);
}

// Ermittelt den ausgewaehlten Wert eines Selects (Combo-Box) und gibt diesen zurueck
// element: 'select'-Element oder dessen Name auf der HTML-Seite mit 'option'-Eintraegen der Combo-Box
// valType: Typ-Klasse der Optionswerte ('String', 'Number', ...)
// valFun: Funktion zur Ermittlung des Wertes eines 'option'-Eintrags (getSelectedOptionText, getSelectedValue, ...)
// defValue: Default-Wert, falls nichts selektiert ist
// return Ausgewaehlter Wert
function getSelection(element, valType = 'String', valFun = getSelectedOptionText, defValue = undefined) {
    const __SELECT = ((typeof element) === 'string' ? getValue(document.getElementsByName(element), [])[0] : element);

    return this[valType](getValue(valFun(__SELECT), defValue));
}

// Ermittelt den ausgewaehlten Wert einer Combo-Box und gibt diesen zurueck
// comboBox: Alle 'option'-Eintraege der Combo-Box
// defValue: Default-Wert, falls nichts selektiert ist
// valType: Typ-Klasse der Optionswerte ('String', 'Number', ...)
// return Ausgewaehlter Wert
function getSelectionFromComboBox(comboBox, defValue = undefined, valType = 'String') {
    let selection;

    for (let i = 0; i < comboBox.length; i++) {
        const __ENTRY = comboBox[i];

        if (__ENTRY.outerHTML.match(/selected/)) {
            selection = __ENTRY.textContent;
        }
    }

    return this[valType](getValue(selection, defValue));
}

// Liefert den Text (textContent) einer selektierten Option
// element: 'select'-Element auf der HTML-Seite mit 'option'-Eintraegen der Combo-Box
// return Wert der Selektion (textContent)
function getSelectedOptionText(element) {
    const __SELECTEDOPTIONS = getValue(element, { }).selectedOptions;
    const __OPTION = getValue(__SELECTEDOPTIONS, { })[0];

    return (__OPTION ? __OPTION.textContent : undefined);
}

// Liefert den 'value' einer selektierten Option
// element: 'select'-Element auf der HTML-Seite mit 'option'-Eintraegen der Combo-Box
// return Wert der Selektion ('value')
function getSelectedValue(element) {
    return getValue(element, { }).value;
}

// ==================== Ende Abschnitt fuer sonstige Parameter ====================

// ==================== Abschnitt fuer sonstige Parameter des Spielplans ====================

const __TEAMSEARCHHAUPT = {  // Parameter zum Team "<b>Willkommen im Managerb&uuml;ro von TEAM</b><br>LIGA LAND<a href=..."
        'Zeile'  : 0,
        'Spalte' : 1,
        'start'  : " von ",
        'middle' : "</b><br>",
        'liga'   : ". Liga",
        'land'   : ' ',
        'end'    : "<a href="
    };

const __TEAMSEARCHTEAM = {  // Parameter zum Team "<b>TEAM - LIGA <a href=...>LAND</a></b>"
        'Zeile'  : 0,
        'Spalte' : 0,
        'start'  : "<b>",
        'middle' : " - ",
        'liga'   : ". Liga",
        'land'   : 'target="_blank">',
        'end'    : "</a></b>"
    };

// Ermittelt, wie das eigene Team heisst und aus welchem Land bzw. Liga es kommt (zur Unterscheidung von Erst- und Zweitteam)
// cell: Tabellenzelle mit den Parametern zum Team "startTEAMmiddleLIGA...landLANDend", LIGA = "#liga[ (A|B|C|D)]"
// teamSeach: Muster fuer die Suche, die Eintraege fuer 'start', 'middle', 'liga', 'land' und 'end' enthaelt
// return Im Beispiel { 'Team' : "TEAM", 'Liga' : "LIGA", 'Land' : "LAND", 'LdNr' : LAND-NUMMER, 'LgNr' : LIGA-NUMMER },
//        z.B. { 'Team' : "Choromonets Odessa", 'Liga' : "1. Liga", 'Land' : "Ukraine", 'LdNr' : 20, 'LgNr' : 1 }
function getTeamParamsFromTable(table, teamSearch = undefined) {
    const __TEAMSEARCH   = getValue(teamSearch, __TEAMSEARCHHAUPT);
    const __TEAMCELLROW  = getValue(__TEAMSEARCH.Zeile, 0);
    const __TEAMCELLCOL  = getValue(__TEAMSEARCH.Spalte, 0);
    const __TEAMCELLSTR  = (table === undefined) ? "" : table.rows[__TEAMCELLROW].cells[__TEAMCELLCOL].innerHTML;
    const __SEARCHSTART  = __TEAMSEARCH.start;
    const __SEARCHMIDDLE = __TEAMSEARCH.middle;
    const __SEARCHLIGA   = __TEAMSEARCH.liga;
    const __SEARCHLAND   = __TEAMSEARCH.land;
    const __SEARCHEND    = __TEAMSEARCH.end;
    const __INDEXSTART   = __TEAMCELLSTR.indexOf(__SEARCHSTART);
    const __INDEXEND     = __TEAMCELLSTR.indexOf(__SEARCHEND);

    let teamParams = __TEAMCELLSTR.substring(__INDEXSTART + __SEARCHSTART.length, __INDEXEND);
    const __INDEXLIGA = teamParams.indexOf(__SEARCHLIGA);
    const __INDEXMIDDLE = teamParams.indexOf(__SEARCHMIDDLE);

    let land = ((~ __INDEXLIGA) ? teamParams.substring(__INDEXLIGA + __SEARCHLIGA.length) : undefined);
    const __TEAMNAME = ((~ __INDEXMIDDLE) ? teamParams.substring(0, __INDEXMIDDLE) : undefined);
    let liga = (((~ __INDEXLIGA) && (~ __INDEXMIDDLE)) ? teamParams.substring(__INDEXMIDDLE + __SEARCHMIDDLE.length) : undefined);

    if (land !== undefined) {
        if (land.charAt(2) === ' ') {    // Land z.B. hinter "2. Liga A " statt "1. Liga "
            land = land.substr(2);
        }
        if (liga !== undefined) {
            liga = liga.substring(0, liga.length - land.length);
        }
        const __INDEXLAND = land.indexOf(__SEARCHLAND);
        if (~ __INDEXLAND) {
            land = land.substr(__INDEXLAND + __SEARCHLAND.length);
        }
    }

    const __TEAM = new Team(__TEAMNAME, land, liga);

    return __TEAM;
}

// Verarbeitet die URL der Seite und ermittelt die Nummer der gewuenschten Unterseite
// url: Adresse der Seite
// leafs: Liste von Filenamen mit der Default-Seitennummer (falls Query-Parameter nicht gefunden)
// item: Query-Parameter, der die Nummer der Unterseite angibt
// return Parameter aus der URL der Seite als Nummer
function getPageIdFromURL(url, leafs, item = 'page') {
    const __URI = new URI(url);
    const __LEAF = __URI.getLeaf();

    for (let leaf in leafs) {
        if (__LEAF === leaf) {
            const __DEFAULT = leafs[leaf];

            return getValue(__URI.getQueryPar(item), __DEFAULT);
        }
    }

    return -1;
}

// Gibt die laufende Nummer des ZATs im Text einer Zelle zurueck
// cell: Tabellenzelle mit der ZAT-Nummer im Text
// return ZAT-Nummer im Text
function getZATNrFromCell(cell) {
    const __TEXT = ((cell === undefined) ? [] : cell.textContent.split(' '));
    let ZATNr = 0;

    for (let i = 1; (ZATNr === 0) && (i < __TEXT.length); i++) {
        if (__TEXT[i - 1] === "ZAT") {
            if (__TEXT[i] !== "ist") {
                ZATNr = parseInt(__TEXT[i], 10);
            }
        }
    }

    return ZATNr;
}

// ==================== Ende Abschnitt fuer sonstige Parameter des Spielplans ====================

// ==================== Ende Abschnitt fuer Spielplan und ZATs ====================

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
