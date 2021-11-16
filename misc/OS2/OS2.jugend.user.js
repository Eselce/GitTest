// ==UserScript==
// @name         OS2.jugend
// @namespace    http://os.ongapo.com/
// @version      0.74+lib
// @copyright    2013+
// @author       Sven Loges (SLC) / Andreas Eckes (Strindheim BK)
// @description  Jugendteam-Script fuer Online Soccer 2.0
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/haupt\.php(\?changetosecond=\w+(&\w+=?\w+)*)?(#\w+)?/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/ju\.php(\?page=\d+(&\w+=?\w+)*)?(#\w+)?/
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

const __LOGLEVEL = 4;

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
    'zeigeJahrgang' : {   // Auswahl, ob ueber jedem Jahrgang die Ueberschriften gezeigt werden sollen oder alles in einem Block (true = Jahrgaenge, false = ein Block)
                   'Name'      : "showGroupTitle",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Jahrgangs\xFCberschriften",
                   'Hotkey'    : 'J',
                   'AltLabel'  : "Nur Trennlinie benutzen",
                   'AltHotkey' : 'j',
                   'FormLabel' : "Jahrg\xE4nge gruppieren"
               },
    'zeigeUxx' : {        // Auswahl, ob in der Ueberschrift ueber jedem Jahrgang zusaetzlich zur Saison noch der Jahrgang in der Form 'Uxx' angegeben wird
                   'Name'      : "showUxx",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Jahrg\xE4nge anzeigen",
                   'Hotkey'    : 'U',
                   'AltLabel'  : "Nur Saisons anzeigen",
                   'AltHotkey' : 'u',
                   'FormLabel' : "Jahrg\xE4nge U13 bis U19"
               },
    'zeigeWarnung' : {    // Auswahl, ob eine Warnung erscheint, wenn Talente gezogen werden sollten
                   'Name'      : "showWarning",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Ziehwarnung ein",
                   'Hotkey'    : 'Z',
                   'AltLabel'  : "Ziehwarnung aus",
                   'AltHotkey' : 'Z',
                   'FormLabel' : "Ziehwarnung"
               },
    'zeigeWarnungMonat' : {  // Auswahl, ob eine Warnung erscheint, wenn zum naechsten Abrechnungs-ZAT Talente gezogen werden sollten
                   'Name'      : "showWarningMonth",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Ziehwarnung Monat ein",
                   'Hotkey'    : 'Z',
                   'AltLabel'  : "Ziehwarnung Monat aus",
                   'AltHotkey' : 'Z',
                   'FormLabel' : "Ziehwarnung Monat"
               },
    'zeigeWarnungHome' : {  // Auswahl, ob eine Meldung im Managerbuero erscheint, wenn Talente gezogen werden sollten
                   'Name'      : "showWarningHome",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Ziehwarnung B\xFCro ein",
                   'Hotkey'    : 'z',
                   'AltLabel'  : "Ziehwarnung B\xFCro aus",
                   'AltHotkey' : 'z',
                   'FormLabel' : "Ziehwarnung B\xFCro"
               },
    'zeigeWarnungDialog' : {  // Auswahl, ob die Meldung im Managerbuero als Dialog erscheinen soll
                   'Name'      : "showWarningDialog",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Ziehwarnung B\xFCro als Dialog",
                   'Hotkey'    : 'z',
                   'AltLabel'  : "Ziehwarnung B\xFCro als Textmeldung",
                   'AltHotkey' : 'z',
                   'FormLabel' : "Ziehwarnung B\xFCro Dialog"
               },
    'zeigeWarnungAufstieg' : {  // Auswahl, ob eine Warnung in der Uebersicht erscheint, wenn Talente nach Aufstieg nicht mehr gezogen werden koennen
                   'Name'      : "showWarningAufstieg",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Ziehwarnung Aufstieg ein",
                   'Hotkey'    : 'A',
                   'AltLabel'  : "Ziehwarnung Aufstieg aus",
                   'AltHotkey' : 'A',
                   'FormLabel' : "Ziehwarnung Aufstieg"
               },
    'zeigeWarnungLegende' : {  // Auswahl, ob eine extra Meldung in Teamuebersicht erscheint, die dort als Legende dient
                   'Name'      : "showWarningLegende",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Ziehwarnung Legende ein",
                   'Hotkey'    : 'L',
                   'AltLabel'  : "Ziehwarnung Legende aus",
                   'AltHotkey' : 'L',
                   'FormLabel' : "Ziehwarnung Legende"
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
    'absBalken' : {       // Spaltenauswahl fuer den Guetebalken des Talents absolut statt nach Foerderung (true = absolut, false = relativ nach Foerderung)
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
    'ziehAnz' : {         // Datenspeicher fuer Anzahl zu ziehender Jugendspieler bis zur naechsten Abrechnung
                   'Name'      : "drawCounts",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : true,
                   'Serial'    : true,
                   'AutoReset' : false,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 25,
                   'Rows'      : 1,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Zu ziehen:"
               },
    'ziehAnzAufstieg' : { // Datenspeicher fuer Anzahl zu ziehender Jugendspieler bis zur naechsten Abrechnung im Falle eines Aufstiegs
                   'Name'      : "drawCountsAufstieg",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'Hidden'    : true,
                   'AutoReset' : false,
                   'Permanent' : true,
                   'FreeValue' : true,
                   'SelValue'  : false,
                   'Choice'    : [ 0, 1, 2, 3, 4, 5 ],
                   'Default'   : 0,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Zu ziehen bei Aufstieg: $",
                   'Hotkey'    : 'z',
                   'FormLabel' : "Zu ziehen bei Aufstieg:|$"
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

// Logging initialisieren mit Loglevel (siehe ganz oben im Konfigurationsabschnitt)...
__LOG.init(window, __LOGLEVEL);

// Teamparameter fuer getrennte Speicherung der Optionen fuer Erst- und Zweitteam...
const __TEAMCLASS = new TeamClassification();

// Optionen mit Daten, die ZAT- und Team-bezogen gemerkt werden...
__TEAMCLASS.optSelect = {
        'datenZat'        : true,
        'oldDatenZat'     : true,
        'fingerprints'    : true,
        'birthdays'       : true,
        'tClasses'        : true,
        'progresses'      : true,
        'ziehAnz'         : true,
        'ziehAnzAufstieg' : true,
        'zatAges'         : true,
        'trainiert'       : true,
        'positions'       : true,
        'skills'          : true,
        'foerderung'      : true
    };

// ==================== Ende Abschnitt fuer Optionen ====================

// ==================== Abschnitt genereller Code zur Anzeige der Jugend ====================

// Funktionen ***************************************************************************

// Erschafft die Spieler-Objekte und fuellt sie mit Werten
// playerRows: Array von Zeilen mit Array cells (Spielertabelle)
// optSet: Gesetzte Optionen (und Config)
// colIdx: Liste von Spaltenindices der gesuchten Werte
// offsetUpper: Ignorierte Zeilen oberhalb der Daten
// offsetLower: Ignorierte Zeilen unterhalb der Daten
// page: 1: Teamuebersicht, 2: Spielereinzelwerte, 3: Opt. Skill, 4: Optionen, Default: 0
function init(playerRows, optSet, colIdx, offsetUpper = 1, offsetLower = 0, page = 0) {
    storePlayerDataFromHTML(playerRows, optSet, colIdx, offsetUpper, offsetLower, page);

    const __SAISON = optSet.getOptValue('saison');
    const __AKTZAT = optSet.getOptValue('aktuellerZat');
    const __GEALTERT = ((__AKTZAT >= 72) ? (getIntFromHTML(playerRows[playerRows.length - offsetLower - 1].cells, colIdx.Age) < 13) : false);
    const __CURRZAT = (__GEALTERT ? 0 : __AKTZAT);
    const __LGNR = __TEAMCLASS.team.LgNr;
    const __KLASSE = (__LGNR > 1) ? (__LGNR > 3) ? 3 : 2 : 1;
    const __DONATION = optSet.getOptValue('foerderung');
    const __BIRTHDAYS = optSet.getOptValue('birthdays', []);
    const __TCLASSES = optSet.getOptValue('tClasses', []);
    const __PROGRESSES = optSet.getOptValue('progresses', []);
    const __ZATAGES = optSet.getOptValue('zatAges', []);
    const __TRAINIERT = optSet.getOptValue('trainiert', []);
    const __POSITIONS = optSet.getOptValue('positions', []);
    const __SKILLS = optSet.getOptValue('skills', []);
    const __ISSKILLPAGE = (page === 2);
    const __BASEDATA = [ __BIRTHDAYS, __TCLASSES, __PROGRESSES ];  // fuer initPlayer
    const __DATA = (__ISSKILLPAGE ? [ __SKILLS, __BASEDATA ] : [ __BASEDATA, __SKILLS ]);  // fuer initPlayer: [0] = von HTML-Seite, [1] = aus gespeicherten Daten
    const __IDMAP = getPlayerIdMap(optSet);
    const __CATIDS = __IDMAP.catIds;
    const __PLAYERS = [];

    __LOG[7](__IDMAP);

    for (let i = offsetUpper, j = 0; i < playerRows.length - offsetLower; i++) {
        const __CELLS = playerRows[i].cells;

        if (__CELLS.length > 1) {
            const __LAND = getStringFromHTML(__CELLS, colIdx.Land);
            const __AGE = getIntFromHTML(__CELLS, colIdx.Age);
            const __ISGOALIE = isGoalieFromHTML(__CELLS, colIdx.Age);
            const __AKTION = getElementFromHTML(__CELLS, colIdx.Akt);

            const __NEWPLAYER = new PlayerRecord(__LAND, __AGE, __ISGOALIE, __SAISON, __CURRZAT, __DONATION);

            __NEWPLAYER.initPlayer(__DATA[0], j, __ISSKILLPAGE);

            const __IDX = selectPlayerIndex(__NEWPLAYER, j, __CATIDS);

            __NEWPLAYER.initPlayer(__DATA[1], __IDX, ! __ISSKILLPAGE);

            __NEWPLAYER.prognoseSkills();

            if (! __ISSKILLPAGE) {
                __NEWPLAYER.setZusatz(__ZATAGES[__IDX], __TRAINIERT[__IDX], __POSITIONS[__IDX]);
            }

            __NEWPLAYER.createWarnDraw(__AKTION, __KLASSE);

            __PLAYERS[j++] = __NEWPLAYER;
        }
    }

    if (__ISSKILLPAGE) {
        calcPlayerData(__PLAYERS, optSet);
    } else {
        setPlayerData(__PLAYERS, optSet);
    }

    storePlayerIds(__PLAYERS, optSet);

    return __PLAYERS;
}

// Berechnet die Identifikations-IDs (Fingerprints) der Spieler neu und speichert diese
function getPlayerIdMap(optSet) {
    const __FINGERPRINTS = optSet.getOptValue('fingerprints', []);
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
// players: Array von PlayerRecord mit den Spielerdaten
// optSet: Gesetzte Optionen (und Config)
function storePlayerIds(players, optSet) {
    const __FINGERPRINTS = [];

    for (let i = 0; i < players.length; i++) {
        const __PLAYER = players[i];

        if ((__PLAYER.zatGeb !== undefined) && (__PLAYER.talent !== undefined) && (__PLAYER.positions !== undefined)) {
            __FINGERPRINTS[i]  = __PLAYER.getFingerPrint();
        }
    }

    optSet.setOpt('fingerprints', __FINGERPRINTS, false);
}

// Sucht fuer den Spieler den Eintrag aus catIds heraus und gibt den (geloeschten) Index zurueck
// player: PlayerRecord mit den Daten eines Spielers
// index: Position des Spielers im neuen Array von Spielerdaten
// catIds: PlayerIdMap zum Finden des Spielers ueber die Spielerdaten
// return Original-Index der Daten dieses Spielers im Array von Spielerdaten
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

// Speichert die abgeleiteten Werte in den Spieler-Objekten
// players: Array von PlayerRecord mit den Spielerdaten
// optSet: Gesetzte Optionen (und Config)
function setPlayerData(players, optSet) {
    const __ZIEHANZAHL = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    let ziehAnzAufstieg = 0;
    const __ZATAGES = [];
    const __TRAINIERT = [];
    const __POSITIONS = [];

    for (let i = 0; i < players.length; i++) {
        const __ZUSATZ = players[i].calcZusatz();

        if (__ZUSATZ.zatAge !== undefined) {  // braucht Geburtstag fuer gueltige Werte!
            const __INDEX = players[i].calcZiehIndex();  // Lfd. Nummer des Abrechnungsmonats (0-basiert)

            if ((__INDEX >= 0) && (__INDEX < __ZIEHANZAHL.length)) {
                __ZIEHANZAHL[__INDEX]++;
            }

            __ZATAGES[i] = __ZUSATZ.zatAge;
        }
        if (players[i].isZiehAufstieg()) {
            ziehAnzAufstieg++;
        }
        __TRAINIERT[i] = __ZUSATZ.trainiert;
        __POSITIONS[i] = __ZUSATZ.bestPos;
    }

    optSet.setOpt('ziehAnz', __ZIEHANZAHL, false);
    optSet.setOpt('ziehAnzAufstieg', ziehAnzAufstieg, false);
    optSet.setOpt('zatAges', __ZATAGES, false);
    optSet.setOpt('trainiert', __TRAINIERT, false);
    optSet.setOpt('positions', __POSITIONS, false);
}

// Berechnet die abgeleiteten Werte in den Spieler-Objekten neu und speichert diese
// players: Array von PlayerRecord mit den Spielerdaten
// optSet: Gesetzte Optionen (und Config)
function calcPlayerData(players, optSet) {
    const __ZATAGES = [];
    const __TRAINIERT = [];
    const __POSITIONS = [];

    for (let i = 0; i < players.length; i++) {
        const __ZUSATZ = players[i].calcZusatz();

        if (__ZUSATZ.zatAge !== undefined) {  // braucht Geburtstag fuer gueltige Werte!
            __ZATAGES[i] = __ZUSATZ.zatAge;
        }
        __TRAINIERT[i] = __ZUSATZ.trainiert;
        __POSITIONS[i] = __ZUSATZ.bestPos;
    }

    optSet.setOpt('zatAges', __ZATAGES, false);
    optSet.setOpt('trainiert', __TRAINIERT, false);
    optSet.setOpt('positions', __POSITIONS, false);
}

// Ermittelt die fuer diese Seite relevanten Werte in den Spieler-Objekten aus den Daten der Seite und speichert diese
// playerRows: Array von Zeilen mit Array cells (Spielertabelle)
// optSet: Gesetzte Optionen (und Config)
// colIdx: Liste von Spaltenindices der gesuchten Werte
// offsetUpper: Ignorierte Zeilen oberhalb der Daten
// offsetLower: Ignorierte Zeilen unterhalb der Daten
// page: 1: Teamuebersicht, 2: Spielereinzelwerte, 3: Opt. Skill, 4: Optionen, Default: 0
function storePlayerDataFromHTML(playerRows, optSet, colIdx, offsetUpper = 1, offsetLower = 0, page = 0) {
    const __COLDEFS = [ { }, {
                                'birthdays'  : { 'name' : 'birthdays', 'getFun' : getIntFromHTML, 'params' : [ colIdx.Geb ] },
                                'tClasses'   : { 'name' : 'tClasses', 'getFun' : getTalentFromHTML, 'params' : [ colIdx.Tal ] },
                                'progresses' : { 'name' : 'progresses', 'getFun' : getAufwertFromHTML, 'params' : [ colIdx.Auf, optSet.getOptValue('shortAufw', true) ] }
                            }, {
                                'skills'     : { 'name' : 'skills', 'getFun' : getSkillsFromHTML, 'params' : [ colIdx ]}
                            } ][getValueIn(page, 1, 2, 0)];

    return storePlayerDataColsFromHTML(playerRows, optSet, __COLDEFS, offsetUpper, offsetLower);
}

// Ermittelt bestimmte Werte in den Spieler-Objekten aus den Daten der Seite und speichert diese
// playerRows: Array von Zeilen mit Array cells (Spielertabelle)
// optSet: Gesetzte Optionen (und Config)
// colDefs: Informationen zu ausgewaehlten Datenspalten
// offsetUpper: Ignorierte Zeilen oberhalb der Daten
// offsetLower: Ignorierte Zeilen unterhalb der Daten
function storePlayerDataColsFromHTML(playerRows, optSet, colDefs, offsetUpper = 1, offsetLower = 0) {
    const __DATA = { };

    for (let key in colDefs) {
        __DATA[key] = [];
    }

    for (let i = offsetUpper, j = 0; i < playerRows.length - offsetLower; i++) {
        const __CELLS = playerRows[i].cells;

        if (__CELLS.length > 1) {
            for (let key in colDefs) {
                const __COLDEF = colDefs[key];

                __DATA[key][j] = __COLDEF.getFun(__CELLS, ... __COLDEF.params);
            }
            j++;
        }
    }

    for (let key in colDefs) {
        const __COLDEF = colDefs[key];

        __LOG[9]('Schreibe ' + __COLDEF.name + ': ' + __DATA[key]);

        optSet.setOpt(__COLDEF.name, __DATA[key], false);
    }
}

// Trennt die Gruppen (z.B. Jahrgaenge) mit Linien
function separateGroups(rows, borderString, colIdxSort = 0, offsetUpper = 1, offsetLower = 0, offsetLeft = -1, offsetRight = 0, formatFun = sameValue) {
    if (offsetLeft < 0) {
        offsetLeft = colIdxSort;  // ab Sortierspalte
    }

    for (let i = offsetUpper, newVal, oldVal = formatFun((rows[i].cells[colIdxSort] || { }).textContent); i < rows.length - offsetLower - 1; i++, oldVal = newVal) {
        newVal = formatFun((rows[i + 1].cells[colIdxSort] || { }).textContent);
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

// ==================== Page-Manager fuer zu bearbeitende Seiten ====================

// Verarbeitet Ansicht "Haupt" (Managerbuero) zur Ermittlung des aktuellen ZATs
const procHaupt = new PageManager("Haupt (Managerb\xFCro)", __TEAMCLASS, () => {
        const __TEAMPARAMS = getTeamParamsFromTable(getTable(1), __TEAMSEARCHHAUPT);  // Link mit Team, Liga, Land...

        return {
                'teamParams' : __TEAMPARAMS,
//                'menuAnchor' : getTable(0, 'div'),
                'hideMenu'   : true,
                'showForm'   : {
                                   'zeigeWarnung'         : true,
                                   'zeigeWarnungMonat'    : true,
                                   'zeigeWarnungHome'     : true,
                                   'zeigeWarnungDialog'   : true,
                                   'zeigeWarnungAufstieg' : true,
                                   'zeigeWarnungLegende'  : true,
                                   'ziehAnz'              : true,
                                   'showForm'             : true
                               }
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

                    // ... und ZAT-bezogene Daten als veraltet markieren (ausser 'skills', 'positions' und 'ziehAnz')
                    await __TEAMCLASS.deleteOptions({
                                                    'skills'      : true,
                                                    'positions'   : true,
                                                    'datenZat'    : true,
                                                    'oldDatenZat' : true,
                                                    'ziehAnz'     : (__CURRZAT > __DATAZAT)  // nur loeschen, wenn < __DATAZAT
                                                }).catch(defaultCatch);

                    // Neuen Daten-ZAT speichern...
                    optSet.setOpt('datenZat', __CURRZAT, false);
                }
            }

            const __MSG = new WarnDrawMessage(optSet, __CURRZAT);
            const __MSGAUFSTIEG = new WarnDrawMessageAufstieg(optSet, __CURRZAT);
            const __ANCHOR = getTable(0, 'tbody');

            __MSG.showMessage(__ANCHOR, 'tr', true);
            __MSG.showDialog(showAlert);
            __MSGAUFSTIEG.showMessage(__ANCHOR, 'tr', true);

            return true;
        });

// Verarbeitet Ansicht "Optionen" zur Ermittlung der Jugendfoerderung
const procOptionen = new PageManager("Optionen", __TEAMCLASS, () => {
        return {
                'menuAnchor'  : getTable(0, 'div'),
                'hideMenu'    : true,
                'getDonation' : true,
                'showForm'    : {
                                    'foerderung'           : true,
                                    'zeigeWarnung'         : true,
                                    'zeigeWarnungMonat'    : true,
                                    'zeigeWarnungHome'     : true,
                                    'zeigeWarnungDialog'   : true,
                                    'zeigeWarnungAufstieg' : true,
                                    'zeigeWarnungLegende'  : true,
                                    'ziehAnz'              : true,
                                    'showForm'             : true
                                }
            };
    }, async optSet => {
            UNUSED(optSet);
            //return true;
        });

// Verarbeitet Ansicht "Teamuebersicht"
const procTeamuebersicht = new PageManager("Team\xFCbersicht", __TEAMCLASS, () => {
        if (getElement('transfer') !== undefined) {
            __LOG[1]("Ziehen-Seite");
        } else if (getRows(1) === undefined) {
            __LOG[1]("Diese Seite ist ohne Team nicht verf\xFCgbar!");
        } else {
            return {
                    'menuAnchor' : getTable(0, 'div'),
                    'showForm'   : {
                                       'kennzeichenEnde'      : true,
                                       'shortAufw'            : true,
                                       'sepStyle'             : true,
                                       'sepColor'             : true,
                                       'sepWidth'             : true,
                                       'saison'               : true,
                                       'aktuellerZat'         : true,
                                       'foerderung'           : true,
                                       'team'                 : true,
                                       'zeigeJahrgang'        : true,
                                       'zeigeUxx'             : true,
                                       'zeigeWarnung'         : true,
                                       'zeigeWarnungMonat'    : true,
                                       'zeigeWarnungHome'     : true,
                                       'zeigeWarnungDialog'   : true,
                                       'zeigeWarnungAufstieg' : true,
                                       'zeigeWarnungLegende'  : true,
                                       'zeigeBalken'          : true,
                                       'absBalken'            : true,
                                       'zeigeId'              : true,
                                       'ersetzeAlter'         : true,
                                       'zeigeAlter'           : true,
                                       'zeigeQuote'           : true,
                                       'zeigePosition'        : true,
                                       'zeigeZatDone'         : true,
                                       'zeigeZatLeft'         : true,
                                       'zeigeFixSkills'       : true,
                                       'zeigeTrainiert'       : true,
                                       'zeigeAnteilPri'       : true,
                                       'zeigeAnteilSec'       : true,
                                       'zeigePrios'           : true,
                                       'anzahlOpti'           : true,
                                       'anzahlMW'             : true,
                                       'zeigeTrainiertEnde'   : true,
                                       'zeigeAnteilPriEnde'   : true,
                                       'zeigeAnteilSecEnde'   : true,
                                       'zeigePriosEnde'       : true,
                                       'zeigeSkillEnde'       : true,
                                       'anzahlOptiEnde'       : true,
                                       'anzahlMWEnde'         : true,
                                       'ziehAnz'              : true,
                                       'zatAges'              : true,
                                       'trainiert'            : true,
                                       'positions'            : true,
                                       'skills'               : true,
                                       'reset'                : true,
                                       'showForm'             : true
                                   },
                    'formWidth'  : 1
                };
        }
        // Fehler fuer alle Faelle ohne Rueckgabewert...
        return false;
    }, async optSet => {
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

            const __ROWS = getRows(1);
            const __HEADERS = __ROWS[0];
            const __TITLECOLOR = getColor('LEI');  // '#FFFFFF'

            const __PLAYERS = init(__ROWS, optSet, __COLUMNINDEX, __ROWOFFSETUPPER, __ROWOFFSETLOWER, 1);
            const __COLMAN = new ColumnManager(optSet, __COLUMNINDEX, {
                                                'Default'            : true,
                                                'ersetzeSkills'      : false,
                                                'zeigeGeb'           : false,
                                                'zeigeSkill'         : false,
                                                'zeigeTal'           : false,
                                                'zeigeAufw'          : false
                                            });

            __COLMAN.addTitles(__HEADERS, __TITLECOLOR);

            for (let i = __ROWOFFSETUPPER, j = 0; i < __ROWS.length - __ROWOFFSETLOWER; i++) {
                if (__ROWS[i].cells.length > 1) {
                    __COLMAN.addValues(__PLAYERS[j++], __ROWS[i], __TITLECOLOR);
                } else {
                    __COLMAN.setGroupTitle(__ROWS[i]);
                }
            }

            // Format der Trennlinie zwischen den Jahrgaengen...
            if (! __COLMAN.gt) {
                const __BORDERSTRING = optSet.getOptValue('sepStyle') + ' ' + optSet.getOptValue('sepColor') + ' ' + optSet.getOptValue('sepWidth');

                separateGroups(__ROWS, __BORDERSTRING, __COLUMNINDEX.Land, __ROWOFFSETUPPER, __ROWOFFSETLOWER, 0, 0, existValue);
            }

            const __CURRZAT = optSet.getOptValue('datenZat');
            const __MSG = new WarnDrawMessage(optSet, __CURRZAT);
            const __MSGAUFSTIEG = new WarnDrawMessageAufstieg(optSet, __CURRZAT);
            const __ANCHOR = getTable(0, 'div');
            const __SEARCH = '<form method="POST">';

            // Kompaktere Darstellung und ohne Links...
            __MSG.out.top = false;
            __MSG.out.label = false;
            __MSG.out.link = false;
            __MSG.out.bottom = false;
            __MSGAUFSTIEG.out.label = false;
            __MSGAUFSTIEG.out.link = false;
            __MSGAUFSTIEG.out.bottom = false;

            __MSG.setOptionLegende();
            __MSGAUFSTIEG.setOptionLegende();

            __MSG.showMessage(__ANCHOR, 'p', __SEARCH);
            __MSGAUFSTIEG.showMessage(__ANCHOR, 'p', __SEARCH);

            return true;
        });

// Verarbeitet Ansicht "Spielereinzelwerte"
const procSpielereinzelwerte = new PageManager("Spielereinzelwerte", __TEAMCLASS, () => {
        if (getRows(1) === undefined) {
            __LOG[1]("Diese Seite ist ohne Team nicht verf\xFCgbar!");
        } else {
            return {
                    'menuAnchor' : getTable(0, 'div'),
                    'hideForm'   : {
                                       'zeigeWarnung'         : false,
                                       'zeigeWarnungMonat'    : false,
                                       'zeigeWarnungHome'     : false,
                                       'zeigeWarnungDialog'   : false,
                                       'zeigeWarnungAufstieg' : false,
                                       'zeigeWarnungLegende'  : false,
                                       'ziehAnz'              : true,
                                       'zatAges'              : true,
                                       'trainiert'            : true,
                                       'positions'            : true,
                                       'skills'               : true,
                                       'shortAufw'            : true
                                   },
                    'formWidth'  : 1
                };
        }
        // Fehler fuer alle Faelle ohne Rueckgabewert...
        return false;
    }, async optSet => {
            const __ROWOFFSETUPPER = 1;     // Header-Zeile
            const __ROWOFFSETLOWER = 0;

            const __COLUMNINDEX = {
                    'Flg'   : 0,
                    'Land'  : 1,
                    'U'     : 2,
                    'X'     : 3,
                    'Age'   : 4,
                    'Einz'  : 5,    // ab hier die Einzelskills
                    'SCH'   : 5,
                    'ABS'   : 5,    // TOR
                    'BAK'   : 6,
                    'STS'   : 6,    // TOR
                    'KOB'   : 7,
                    'FAN'   : 7,    // TOR
                    'ZWK'   : 8,
                    'STB'   : 8,    // TOR
                    'DEC'   : 9,
                    'SPL'   : 9,    // TOR
                    'GES'   : 10,
                    'REF'   : 10,   // TOR
                    'FUQ'   : 11,
                    'ERF'   : 12,
                    'AGG'   : 13,
                    'PAS'   : 14,
                    'AUS'   : 15,
                    'UEB'   : 16,
                    'WID'   : 17,
                    'SEL'   : 18,
                    'DIS'   : 19,
                    'ZUV'   : 20,
                    'EIN'   : 21,
                    'Zus'   : 22     // Zusaetze hinter den Einzelskills
                };

            const __ROWS = getRows(1);
            const __HEADERS = __ROWS[0];
            const __TITLECOLOR = getColor('LEI');  // '#FFFFFF'

            const __PLAYERS = init(__ROWS, optSet, __COLUMNINDEX, __ROWOFFSETUPPER, __ROWOFFSETLOWER, 2);
            const __COLMAN = new ColumnManager(optSet, __COLUMNINDEX, true);

            __COLMAN.addTitles(__HEADERS, __TITLECOLOR);

            for (let i = __ROWOFFSETUPPER, j = 0; i < __ROWS.length - __ROWOFFSETLOWER; i++) {
                if (__ROWS[i].cells.length > 1) {
                    __COLMAN.addValues(__PLAYERS[j++], __ROWS[i], __TITLECOLOR);
                } else {
                    __COLMAN.setGroupTitle(__ROWS[i]);
                }
            }

            // Format der Trennlinie zwischen den Jahrgaengen...
            if (! __COLMAN.gt) {
                const __BORDERSTRING = optSet.getOptValue('sepStyle') + ' ' + optSet.getOptValue('sepColor') + ' ' + optSet.getOptValue('sepWidth');

                separateGroups(__ROWS, __BORDERSTRING, __COLUMNINDEX.Land, __ROWOFFSETUPPER, __ROWOFFSETLOWER, 0, 0, existValue);
            }

            return true;
        });

// Verarbeitet Ansicht "Opt. Skill"
const procOptSkill = new PageManager("Opt. Skill", __TEAMCLASS, () => {
        if (getRows(1) === undefined) {
            __LOG[1]("Diese Seite ist ohne Team nicht verf\xFCgbar!");
        } else {
            return {
                    'menuAnchor' : getTable(0, 'div'),
                    'showForm'   : {
                                       'kennzeichenEnde'      : true,
                                       'sepStyle'             : true,
                                       'sepColor'             : true,
                                       'sepWidth'             : true,
                                       'saison'               : true,
                                       'aktuellerZat'         : true,
                                       'foerderung'           : true,
                                       'team'                 : true,
                                       'zeigeJahrgang'        : true,
                                       'zeigeUxx'             : true,
                                       'zeigeWarnung'         : false,
                                       'zeigeWarnungMonat'    : false,
                                       'zeigeWarnungHome'     : false,
                                       'zeigeWarnungDialog'   : false,
                                       'zeigeWarnungAufstieg' : false,
                                       'zeigeWarnungLegende'  : false,
                                       'zeigeBalken'          : true,
                                       'absBalken'            : true,
                                       'zeigeId'              : true,
                                       'ersetzeAlter'         : true,
                                       'zeigeAlter'           : true,
                                       'zeigeQuote'           : true,
                                       'zeigePosition'        : true,
                                       'zeigeZatDone'         : true,
                                       'zeigeZatLeft'         : true,
                                       'zeigeFixSkills'       : true,
                                       'zeigeTrainiert'       : true,
                                       'zeigeAnteilPri'       : true,
                                       'zeigeAnteilSec'       : true,
                                       'zeigePrios'           : true,
                                       'zeigeAufw'            : true,
                                       'zeigeGeb'             : true,
                                       'zeigeTal'             : true,
                                       'anzahlOpti'           : true,
                                       'anzahlMW'             : true,
                                       'zeigeTrainiertEnde'   : true,
                                       'zeigeAnteilPriEnde'   : true,
                                       'zeigeAnteilSecEnde'   : true,
                                       'zeigePriosEnde'       : true,
                                       'zeigeSkillEnde'       : true,
                                       'anzahlOptiEnde'       : true,
                                       'anzahlMWEnde'         : true,
                                       'zatAges'              : true,
                                       'trainiert'            : true,
                                       'positions'            : true,
                                       'skills'               : true,
                                       'reset'                : true,
                                       'showForm'             : true
                                   },
                    'formWidth'  : 1
                };
        }
        // Fehler fuer alle Faelle ohne Rueckgabewert...
        return false;
    }, async optSet => {
            const __ROWOFFSETUPPER = 1;     // Header-Zeile
            const __ROWOFFSETLOWER = 0;

            const __COLUMNINDEX = {
                    'Flg'   : 0,
                    'Land'  : 1,
                    'U'     : 2,
                    'Age'   : 3,
                    'Skill' : 4,
                    'TOR'   : 5,
                    'ABW'   : 6,
                    'DMI'   : 7,
                    'MIT'   : 8,
                    'OMI'   : 9,
                    'STU'   : 10,
                    'Zus'   : 11     // Zusaetze hinter den OptSkills
                };

            const __ROWS = getRows(1);
            const __HEADERS = __ROWS[0];
            const __TITLECOLOR = getColor('LEI');  // '#FFFFFF'

            const __PLAYERS = init(__ROWS, optSet, __COLUMNINDEX, __ROWOFFSETUPPER, __ROWOFFSETLOWER, 3);
            const __COLMAN = new ColumnManager(optSet, __COLUMNINDEX, {
                                                'Default'            : true,
                                                'ersetzeSkills'      : false,
                                                'zeigeSkill'         : false
                                            });

            __COLMAN.addTitles(__HEADERS, __TITLECOLOR);

            for (let i = __ROWOFFSETUPPER, j = 0; i < __ROWS.length - __ROWOFFSETLOWER; i++) {
                if (__ROWS[i].cells.length > 1) {
                    __COLMAN.addValues(__PLAYERS[j++], __ROWS[i], __TITLECOLOR);
                } else {
                    __COLMAN.setGroupTitle(__ROWS[i]);
                }
            }

            // Format der Trennlinie zwischen den Jahrgaengen...
            if (! __COLMAN.gt) {
                const __BORDERSTRING = optSet.getOptValue('sepStyle') + ' ' + optSet.getOptValue('sepColor') + ' ' + optSet.getOptValue('sepWidth');

                separateGroups(__ROWS, __BORDERSTRING, __COLUMNINDEX.Land, __ROWOFFSETUPPER, __ROWOFFSETLOWER, 0, 0, existValue);
            }

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
    if (optParams.getDonation) {
        // Jugendfoerderung aus der Options-HTML-Seite ermitteln...
        const __BOXDONATION = document.getElementsByTagName('option');
        const __DONATION = getSelectionFromComboBox(__BOXDONATION, 10000, 'Number');

        __LOG[4]("Jugendf\xF6rderung: " + __DONATION + " Euro");

        // ... und abspeichern...
        optSet.setOpt('foerderung', __DONATION, false);
    }

    return optSet;
}

// ==================== Ende Spezialbehandlung der Startparameter ====================

// ==================== Hauptprogramm ====================

const __MAINCONFIG = {
                        prepareOpt  : prepareOptions
                    };

const __LEAFS = {
                    'haupt.php' : 0,  // Ansicht "Haupt" (Managerbuero)
                    'ju.php'    : 1   // Ansicht "Jugendteam" (page = 1, 2, 3, 4)
                };
const __ITEM = 'page';

// URL-Legende:
// page=0: Managerbuero
// page=1: Jugend Teamuebersicht
// page=2: Jugend Spielereinzelwerte
// page=3: Jugend Opt. Skill
// page=4: Jugend Optionen
const __MAIN = new Main(__OPTCONFIG, __MAINCONFIG,
                        procHaupt, procTeamuebersicht, procSpielereinzelwerte,
                        procOptSkill, procOptionen);

__MAIN.run(getPageIdFromURL, __LEAFS, __ITEM);

// ==================== Ende Hauptprogramm ====================

// *** EOF ***
