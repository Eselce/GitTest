// ==UserScript==
// @name         OS2.tabelle
// @namespace    http://os.ongapo.com/
// @version      0.11+WE+
// @copyright    2016+
// @author       Sven Loges (SLC)
// @description  Tabellen-Script fuer Online Soccer 2.0
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/haupt\.php(\?changetosecond=\w+(&\S+)*)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/(l[pt]|os(cfr|e)|fpt)\.php(\?\S+(&\S+)*)?$/
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
    'zeigeQuali' : {      // Einfaerbung der Europapokalplaetze (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showQuali",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Einf\xE4rbung ein",
                   'Hotkey'    : 'f',
                   'AltLabel'  : "Einf\xE4rbung aus",
                   'AltHotkey' : 'f',
                   'FormLabel' : "Einf\xE4rbung"
               },
    'zeigeTitel' : {      // Spaltenauswahl fuer die Markierung der Titel in der Tabelle (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showTitles",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Titel ein",
                   'Hotkey'    : 'T',
                   'AltLabel'  : "Titel aus",
                   'AltHotkey' : 'T',
                   'FormLabel' : "Titel"
               },
    'zeigeAktuelleTitel' : {  // Spaltenauswahl fuer die Markierung der aktuellen Titel in der Tabelle (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showCurrTitles",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Aktuelle Titel ein",
                   'Hotkey'    : 'A',
                   'AltLabel'  : "Aktuelle Titel aus",
                   'AltHotkey' : 'A',
                   'FormLabel' : "Aktuelle Titel"
               },
    'zeigeQualiTitel' : {  // Spaltenauswahl fuer die Markierung der internationalen Plaetze in der Tabelle (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showQualiTitles",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Eurofighter ein",
                   'Hotkey'    : 'E',
                   'AltLabel'  : "Eurofighter aus",
                   'AltHotkey' : 'E',
                   'FormLabel' : "Eurofighter"
               },
    'calcQuali' : {       // Stellt die Europapokalplaetze zusammen und speichert diese (true = berechnen, false = nicht berechnen)
                   'Name'      : "calcQuali",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Startlisten ein",
                   'Hotkey'    : 'S',
                   'AltLabel'  : "Startlisten aus",
                   'AltHotkey' : 'S',
                   'FormLabel' : "Startlisten"
               },
    'calcStats' : {       // Stellt die Statistik zu Europapokalplaetzen zusammen und speichert diese (true = berechnen, false = nicht berechnen)
                   'Name'      : "calcStats",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Statistik ein",
                   'Hotkey'    : 'S',
                   'AltLabel'  : "Statistik aus",
                   'AltHotkey' : 'S',
                   'FormLabel' : "Statistik"
               },
    'aktuelleSaison' : {  // Aktuelle Saison
                   'Name'      : "currSaison",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : true,
                   'SelValue'  : false,
                   'Choice'    : [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ],
                   'Default'   : 11,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Aktuelle Saison: $",
                   'Hotkey'    : 'A',
                   'FormLabel' : "Aktuelle Saison:|$"
               },
    'saison' : {          // Ausgewaehlte Saison
                   'Name'      : "saison",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : true,
                   'SelValue'  : false,
                   'Choice'    : [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ],
                   'Default'   : 12,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Saison: $",
                   'Hotkey'    : 'S',
                   'FormLabel' : "Saison:|$"
               },
    'liga' : {            // Ausgewaehlte Liga
                   'Name'      : "liga",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'FreeValue' : false,
                   'SelValue'  : true,
                   'Choice'    : [ '1. Liga', '2. Liga A', '2. Liga B', '3. Liga A', '3. Liga B', '3. Liga C', '3. Liga D' ],
                   'Default'   : '1. Liga',
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Liga: $",
                   'Hotkey'    : 'i',
                   'FormLabel' : "Liga:|$"
               },
    'land' : {            // Ausgewaehltes Land
                   'Name'      : "land",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'FreeValue' : true,
                   'SelValue'  : false,
                   'Choice'    : [ ],
                   'Default'   : "---Landauswahl---",
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Land: $",
                   'Hotkey'    : 'a',
                   'FormLabel' : "Land:|$"
               },
    'tabTyp' : {          // Ausgewaehlter Tabellentyp
                   'Name'      : "tabTyp",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'FreeValue' : false,
                   'SelValue'  : true,
                   'Choice'    : [ 'Gesamttabelle', 'Heimtabelle', 'Ausw\xE4rtstabelle', '2-Punktetabelle', 'Hinrundentabelle', 'R\xFCckrundentabelle', '1. Halbzeit', '2. Halbzeit', 'Kreuztabelle' ],
                   'Default'   : 'Gesamttabelle',
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Tabellentyp: $",
                   'Hotkey'    : 'T',
                   'FormLabel' : "Tabellentyp:|$"
               },
    'Prunde' : {          // Ausgewaehlte Pokalrunde
                   'Name'      : "pokalRunde",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'FreeValue' : false,
                   'SelValue'  : true,
                   'Choice'    : [ '1. Runde', '2. Runde', '3. Runde', 'Achtelfinale', 'Viertelfinale', 'Halbfinale', 'Finale' ],
                   'Default'   : 'Finale',
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Pokalrunde: $",
                   'Hotkey'    : 'r',
                   'FormLabel' : "Pokalrunde:|$"
               },
    'OSCrunde' : {        // Ausgewaehlte OSC-FR-Runde
                   'Name'      : "oscRunde",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'FreeValue' : false,
                   'SelValue'  : true,
                   'Choice'    : [ 'Viertelfinale', 'Halbfinale', 'Finale' ],
                   'Default'   : 'Finale',
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "OSC-Runde: $",
                   'Hotkey'    : 'C',
                   'FormLabel' : "OSC-Runde:|$"
               },
    'OSErunde' : {        // Ausgewaehlte OSE-Runde
                   'Name'      : "oseRunde",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'FreeValue' : false,
                   'SelValue'  : true,
                   'Choice'    : [ '1. Runde', '2. Runde', '3. Runde', '4. Runde', 'Achtelfinale', 'Viertelfinale', 'Halbfinale', 'Finale' ],
                   'Default'   : 'Finale',
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "OSE-Runde: $",
                   'Hotkey'    : 'E',
                   'FormLabel' : "OSE-Runde:|$"
               },
    'ligaNr' : {          // Ausgewaehlte Liga (als Nummer)
                   'Name'      : "lgNr",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : false,
                   'SelValue'  : false,
                   'Choice'    : [ 1, 2, 3, 4, 5, 6, 7 ],
                   'Default'   : 1,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Liga-ID: $",
                   'Hotkey'    : 'g',
                   'FormLabel' : "Liga-ID:|$"
               },
    'landNr' : {          // Ausgewaehltes Land (als Nummer)
                   'Name'      : "ldNr",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : true,
                   'SelValue'  : false,
                   'Choice'    : [ ],
                   'Default'   : undefined,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Land-ID: $",
                   'Hotkey'    : 'n',
                   'FormLabel' : "Land-ID:|$"
               },
    'tabTypNr' : {        // Ausgewaehlter Tabellentyp (als Nummer)
                   'Name'      : "tabTypNr",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : false,
                   'SelValue'  : false,
                   'Choice'    : [ 0, 1, 2, 3, 4, 5, 6, 7, 10 ],
                   'Default'   : 0,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Tabellen-ID: $",
                   'Hotkey'    : 'T',
                   'FormLabel' : "Tabellen-ID:|$"
               },
    'PrundenNr' : {       // Ausgewaehlte Pokalrunde (als Nummer)
                   'Name'      : "pokalRundenNr",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : false,
                   'SelValue'  : false,
                   'Choice'    : [ 1, 2, 3, 4, 5, 6, 7 ],
                   'Default'   : 0,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Pokalrunden-ID: $",
                   'Hotkey'    : 'p',
                   'FormLabel' : "Pokalrunden-ID:|$"
               },
    'OSCrundenNr' : {     // Ausgewaehlte OSC-FR-Runde (als Nummer)
                   'Name'      : "OSCrundenNr",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : false,
                   'SelValue'  : false,
                   'Choice'    : [ 7, 8, 9 ],
                   'Default'   : 0,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "OSC-Runden-ID: $",
                   'Hotkey'    : 'c',
                   'FormLabel' : "OSC-Runden-ID:|$"
               },
    'OSErundenNr' : {     // Ausgewaehlte OSE-Runde (als Nummer)
                   'Name'      : "OSErundenNr",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : false,
                   'SelValue'  : false,
                   'Choice'    : [ 1, 2, 3, 4, 5, 6, 7, 8 ],
                   'Default'   : 0,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "OSE-Runden-ID: $",
                   'Hotkey'    : 'e',
                   'FormLabel' : "OSE-Runden-ID:|$"
               },
    'data' : {            // Datenspeicher fuer aktuelle Tabellen- und Titeldaten
                   'Name'      : "data",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 1,
                   'Label'     : "Daten:"
               },
    'dataStats' : {       // Datenspeicher fuer Statistik zu aktuellen Tabellen- und Titeldaten
                   'Name'      : "dataStats",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 1,
                   'Label'     : "Statistik:"
               },
    'vereine' : {         // Datenspeicher fuer Liste potentiell aller Vereine von OS2
                   'Name'      : "vereine",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 1,
                   'Label'     : "Bekannte Vereine:"
               },
    'laender' : {         // Datenspeicher fuer Liste der derzeitigen Ligen potentiell aller Vereine von OS2
                   'Name'      : "laender",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 1,
                   'Label'     : "L\xE4nder der Vereine:"
               },
    'manager' : {         // Datenspeicher fuer Liste der derzeitigen Manager potentiell aller Vereine von OS2
                   'Name'      : "manager",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 1,
                   'Label'     : "Manager der Vereine:"
               },
    'ligen' : {           // Datenspeicher fuer Liste der derzeitigen Ligen potentiell aller Vereine von OS2
                   'Name'      : "ligen",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 1,
                   'Label'     : "Derzeitige Ligen:"
               },
    'startPlaetze' : {    // Datenspeicher fuer ID-Liste der qualifizierten Teams zu europaeischen Wettbewerben
                   'Name'      : "qualiIDs",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'Permanent' : true,
                   'Default'   : {
                                     'OSEQ' : [],
                                     'OSE'  : [],
                                     'OSCQ' : [],
                                     'OSC'  : []
                                 },
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Startpl\xE4tze:"
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
                   'Label'     : "Mein Verein:"
               },
    'setFPdata' : {       // Fuegt alte Saisondaten ein (true = setzen, false = nicht setzen)
                   'Name'      : "setFPdata",
                   'Type'      : __OPTTYPES.SW,
                   'FormType'  : __OPTTYPES.SI,
                   'Permanent' : false,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Alte Fairplaydaten",
                   'Hotkey'    : 'D',
                   'AltLabel'  : "Fairplaydaten vorhanden",
                   'AltHotkey' : 'D',
                   'FormLabel' : ""
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

// ==================== Abschnitt fuer Klasse TableManager ====================

// Klasse fuer Tabelle
function TableManager(optSet, colIdx, rows, offsetUpper, offsetLower) {
    'use strict';

    Object.call(this);

    this.currSaison = getOptValue(optSet.aktuelleSaison);

    this.saison = getOptValue(optSet.saison);
    this.land = getOptValue(optSet.land);
    this.liga = getOptValue(optSet.liga);
    this.tabTypNr = getOptValue(optSet.tabTypNr, 0);

    this.colIdx = colIdx;

    this.rows = getValue(rows, []);
    this.headers = this.rows[0];
    this.offsetUpper = offsetUpper;
    this.offsetLower = offsetLower;

    this.vereine = this.createVereine();

    this.ligaSize = this.vereine.length;
    this.ligaNr = getLigaNr(this.liga);
    this.isErsteLiga = (this.ligaSize && (this.tabTypNr === 0) && (this.ligaNr === 1));
    this.letzterSpieltag = (this.ligaSize - 1) * ((this.ligaSize === 10) ? 4 : 2);
    this.isAbschluss = (this.getSpieltag() === this.letzterSpieltag);
    this.isCurrSaison = (this.saison === this.currSaison);
}

Class.define(TableManager, Object, {
        'createVereine'  : function() {
                               const __VEREINE = [];

                               for (let i = this.offsetUpper, j = 1; i < this.rows.length - this.offsetLower; i++, j++) {
                                   const __CELLS = this.rows[i].cells;    // Aktuelle Eintraege
                                   const __TEAMCELL = __CELLS[this.colIdx.Team];
                                   const __TEAMNAME = getTeamNameFromCell(__TEAMCELL);
                                   const __TEAMID = getTeamIdFromCell(__TEAMCELL);
                                   const __TEAMFLAGS = getTeamFlagsFromCell(__TEAMCELL);
                                   const __VEREIN = new Verein(__TEAMNAME, this.land, this.liga, __TEAMID, undefined, __TEAMFLAGS);

                                   __VEREINE.push(__VEREIN);
                               }

                               return __VEREINE;
                           },
        'addCell'        : function(tableRow) {
                               return tableRow.insertCell(-1);
                           },
        'addAndFillCell' : function(tableRow, value, color, align, digits = 2) {
                               let text = value;

                               if (value && isFinite(value) && (value !== true) && (value !== false)) {
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
        'getRow'         : function(idx) {
                               return this.rows[this.offsetUpper + idx];
                           },
        'formatCols'     : function(rowIdx, colMin, colMax, styleFormat = {
                                                                              'textAlign' : 'center'
                                                                          }) {
                               const __ROW = this.getRow(rowIdx);
                               const __CELLS = __ROW.cells;

                               for (let styleItem in styleFormat) {
                                   const __STYLEVALUE = styleFormat[styleItem];

                                   for (let idx = colMin; idx <= colMax; idx++) {
                                       const __CELL = __CELLS[idx];

                                       __CELL.style[styleItem] = __STYLEVALUE;
                                   }
                               }
                           },
        'formatAllCols'  : function(styleDefs = [
                                                    [
                                                        {
                                                            'textAlign' : 'center'
                                                        },
                                                        'Anz',
                                                        'Punkte'
                                                    ]
                                                ]) {
                               for (let index = 0; index < styleDefs.length; index++) {
                                   const __DEF = styleDefs[index];
                                   const __STYLEFORMAT = __DEF[0];
                                   const __MIN = getValue(this.colIdx[__DEF[1]], 0);
                                   const __MAX = getValue(this.colIdx[__DEF[2]], __MIN);

                                   for (let i = 0; i < this.ligaSize; i++) {
                                       this.formatCols(i, __MIN, __MAX, __STYLEFORMAT);
                                   }
                               }
                           },
        '__CLASSFILTER'  : { },
        'getClassFilter' : function(className) {
                               const __FILTER = (this.__CLASSFILTER[className] ||
                                                (this.__CLASSFILTER[className] = new RegExp("(^|\\s)" + className + "(\\s|$)")));

                               return __FILTER;
                           },
        'hasClass'       : function(element, className) {
                               const __FILTER = this.getClassFilter(className);

                               return __FILTER.test(element.className);
                           },
        'delClass'       : function(element, className) {
                               const __FILTER = this.getClassFilter(className);

                               element.className = element.className.replace(__FILTER, "$1");
                           },
        'addClass'       : function(element, className) {
                               if (! this.hasClass(element, className)) {
                                   if (element.className) {
                                       element.className += " " + className;
                                   } else {
                                       element.className = className;
                                   }
                               }
                           },
        'getQuali'       : function(idx) {
                               const __ROW = this.getRow(idx);

                               if ((! this.isErsteLiga) || this.hasClass(__ROW, 'tabelle') || this.hasClass(__ROW, 'rele') || this.hasClass(__ROW, 'ab')) {
                                   return undefined;
                               } else {
                                   return getGameTypeID(__ROW.className.toUpperCase());
                               }
                           },
        'setClass'       : function(idx, typ) {
                               const __ROW = this.rows[this.offsetUpper + idx];
                               //const __CELLS = __ROW.cells;
                               //const __PLATZCELL = __CELLS[this.colIdx.Platz];
                               const __OLDCLASS = __ROW.className;
                               const __CLASS = (typ ? getGameType(typ).toLowerCase() : __OLDCLASS);

                               __ROW.className = __CLASS;
                               //__PLATZCELL.className = __OLDCLASS;
                           },
        'delFlags'       : function(idx) {
                               const __VEREIN = this.vereine[idx];
                               const __ROW = this.rows[this.offsetUpper + idx];
                               const __CELLS = __ROW.cells;
                               const __TEAMCELL = __CELLS[this.colIdx.Team];
                               const __TEAMTEXT = __TEAMCELL.textContent;
                               const __TEAMNAME = __VEREIN.Team;

                               __TEAMCELL.innerHTML = __TEAMCELL.innerHTML.replace(__TEAMTEXT, __TEAMNAME);
                           },
        'addTitel'       : function(idx, titel, delim, bgColor, color, align = 'center', digits = 2, padding = "0px 1em") {
                               if (titel !== undefined) {
                                   const __TITEL = Array.isArray(titel) ? titel.join(delim) : titel.toString();
                                   const __ROW = this.rows[this.offsetUpper + idx];
                                   const __CELL = this.addAndFillCell(__ROW, __TITEL, color, align, digits);

                                   __CELL.style.backgroundColor = bgColor;
                                   __CELL.style.padding = padding;
                               }
                           },
        'getSpieltag'    : function() {
                               if (this.ligaSize) {
                                   const __ROW = this.rows[this.offsetUpper];
                                   const __CELLS = __ROW.cells;
                                   const __ANZCELL = __CELLS[this.colIdx.Anz];

                                   return Number(__ANZCELL.textContent);
                               } else {
                                   return 0;
                               }
                           }
    });

// ==================== Ende Abschnitt fuer Klasse TableManager ====================

// ==================== Spezialisierter Abschnitt fuer Optionen ====================

// Gesetzte Optionen (wird von initOptions() angelegt und von loadOptions() gefuellt):
const __OPTSET = { };

// Logging initialisieren mit Loglevel (siehe ganz oben im Konfigurationsabschnitt)...
__LOG.init(window, __LOGLEVEL);

// Teamparameter fuer getrennte Speicherung der Optionen fuer Erst- und Zweitteam...
const __TEAMCLASS = new TeamClassification();

// Optionen mit Daten, die ZAT- und Team-bezogen gemerkt werden...
__TEAMCLASS.optSelect = { };

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
                    // Werte aus der HTML-Seite ermitteln...
                    const __LIGA = getSelection('ligaauswahl');
                    const __LAND = getSelection('landauswahl');
                    const __TABTYP = getSelection('tabauswahl');
                    const __PRUNDE = getSelection('stauswahl');
                    const __OSCRUNDE = getSelection('runde');
                    const __OSERUNDE = getSelection('runde');
                    const __DEFSAISON = getOptValue(optSet.aktuelleSaison);
                    const __SAISONS = getSelectionArray('saauswahl', 'Number', getSelectedValue);
                    const __CURRSAISON = (__SAISONS ? Math.max(... __SAISONS) : __DEFSAISON);
                    const __SAISON = getSelection('saauswahl', 'Number', getSelectedValue);
                    const __LIGANR = getSelection('ligaauswahl', 'Number', getSelectedValue);
                    const __LANDNR = getSelection('landauswahl', 'Number', getSelectedValue);
                    const __TABTYPNR = getSelection('tabauswahl', 'Number', getSelectedValue);
                    const __PRUNDNR = getSelection('stauswahl', 'Number', getSelectedValue);
                    const __OSCRUNDNR = getSelection('runde', 'Number', getSelectedValue);
                    const __OSERUNDNR = getSelection('runde', 'Number', getSelectedValue);

                    // ... und abspeichern...
                    setOpt(optSet.liga, __LIGA, false);
                    setOpt(optSet.land, __LAND, false);
                    setOpt(optSet.tabTyp, __TABTYP, false);
                    setOpt(optSet.Prunde, __PRUNDE, false);
                    setOpt(optSet.OSCrunde, __OSCRUNDE, false);
                    setOpt(optSet.OSErunde, __OSERUNDE, false);
                    setOpt(optSet.aktuelleSaison, __CURRSAISON, false);
                    setOpt(optSet.saison, __SAISON, false);
                    setOpt(optSet.ligaNr, __LIGANR, false);
                    setOpt(optSet.landNr, __LANDNR, false);
                    setOpt(optSet.tabTypNr, __TABTYPNR, false);
                    setOpt(optSet.PrundenNr, __PRUNDNR, false);
                    setOpt(optSet.OSCrundenNr, __OSCRUNDNR, false);
                    setOpt(optSet.OSErundenNr, __OSERUNDNR, false);

                    return showOptions(optSet, optParams);
                }, defaultCatch);
}

// ==================== Ende Abschnitt fuer Optionen ====================

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

// Ermittelt das Spiel-Ergebnis aus einer Tabellenzelle, etwa "2 : 1", und liefert zwei Werte zurueck
// cell: Tabellenzelle mit Eintrag "2 : 1"
// return { '2', '1' } im Beispiel
function getErgebnisFromCell(cell) {
    const __ERGEBNIS = cell.textContent.split(" : ", 2);

    return __ERGEBNIS;
}

// Ermittelt das Spiel-Ergebnis aus einer Tabellenzelle und setzt tore/gtore im Spielplanzeiger
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT
// cell: Tabellenzelle mit Eintrag "2 : 1"
// return Modifizierter Spielplanzeiger
function setErgebnisFromCell(currZAT, cell) {
    const __ERGEBNIS = getErgebnisFromCell(cell);

    if (__ERGEBNIS.length === 2) {
        currZAT.gFor = parseInt(__ERGEBNIS[0], 10);
        currZAT.gAga = parseInt(__ERGEBNIS[1], 10);
    } else {
        currZAT.gFor = -1;
        currZAT.gAga = -1;
    }

    return currZAT;
}

// Ermittelt aus dem Inhalt einer Tabellenzelle die Zusaetze zum Team-Namen und liefert diese zurueck
// cell: Tabellenzelle mit dem Team-Namen und -Zusaetzen
// return Array mit den Flags zum Team
function getTeamFlagsFromCell(cell) {
    const __FLAGS = cell.textContent.replace(/[^\[]*\[?([MPNAZ,OSCE]*)\]?$/, "$1");

    return (__FLAGS ? __FLAGS.split(',') : undefined);
}

// Ermittelt den Team-Namen aus einer Tabellenzelle und liefert diesen zurueck
// cell: Tabellenzelle mit dem Team-Namen
// return Team-Name des Teams
function getTeamNameFromCell(cell) {
    const __NAME = cell.textContent.replace(/\s\[[MPNAZ,OSCE]+\]$/, "");

    return __NAME;
}

// Ermittelt die OS2-Team-ID aus einer Tabellenzelle mit Link auf das Team und liefert diese ID zurueck
// cell: Tabellenzelle mit Teamlink
// return OS2-Team-ID des Teams
function getTeamIdFromCell(cell) {
    //const __IDSTR = cell.innerHTML.replace(/.*javascript:teaminfo\((\d+)\).*/, "$1");  // eigentlich .* ...
    const __IDSTR = cell.innerHTML.replace(/.*javascript:teaminfo\((\d+)\)[^]*/, "$1");  // ... aber es gibt Vereinsnamen mit '\n' drin!
    const __TEAMID = Number(__IDSTR);

    return __TEAMID;
}

// Ermittelt die TLA des Landes aus einer Tabellenzelle mit Link auf die Flagge des Landes und liefert diese TLA zurueck
// cell: Tabellenzelle mit Flaggenlink
// return TLA (Kuerzel wie in der Flagge) des Landes
function getLandTlaFromCell(cell) {
    const __TLA = cell.innerHTML.replace(/.* src="images\/flaggen\/(\w\w\w).gif" .*/, "$1");

    return __TLA;
}

// Ermittelt den Names des Landes aus einer Tabellenzelle mit Link auf die Flagge des Landes und liefert diesen vollen Namen zurueck
// cell: Tabellenzelle mit Flaggenlink
// return Voller Name des Landes
function getLandNameFromCell(cell) {
    const __TLA = getLandTlaFromCell(cell);
    const __NAME = getLandName(__TLA);

    return __NAME;
}

// Ermittelt ein Stil-Attribut in Abhaengigkeit der Klasse aus einem Array von Elementen
// elements: Array von Elementen
// propertyName: Name des gesuchten Attributs (value) oder undefined fuer alles
// keyFun: Funktion zur Ermittlung des Keys aus einem Element (key)
// return Liste von key/value-Paaren (<className> : <property> oder <className> : <style>)
function getStyleFromElements(elements, propertyName = undefined, keyFun = getClassNameFromElement) {
    const __ELEMENTS = getValue(elements, []);
    const __RET = { };

    for (let index = 0; index < __ELEMENTS.length; index++) {
        const __ELEMENT = __ELEMENTS[index];
        const __KEY = keyFun(__ELEMENT);
        const __STYLE = window.getComputedStyle(__ELEMENT);
        const __VALUE = (propertyName ? __STYLE[propertyName] : __STYLE);

        __RET[__KEY] = __VALUE;
    }

    return __RET;
}

// Default-KeyFun fuer getStyleFromElements(). Liefert den Klassennamen
// element: Ein Element
// return className des Elements
function getClassNameFromElement(element) {
    return element.className;
}

// Default-KeyFun fuer getStylePropFromElements(). Liefert den UpperCase-Klassennamen
// element: Ein Element
// return className des Elements in Grossbuchstaben
function getUpperClassNameFromElement(element) {
    return element.className.toUpperCase();
}

// Liefert eine neue (leere) Statistik zurueck
// return Leere Statistik mit einem Teil der Statistik-Keys (der Rest wird neu angelegt)
function getEmptyDataStats() {
    return {
               '1'    : 0,
               '2'    : 0,
               'P'    : 0,
               'P2'   : 0,
               'OSC'  : 0,
               'OSC2' : 0,
               'OSE'  : 0,
               'OSE2' : 0,
               'FP'   : 0
           };
}

// Zaehlt die Eintraege in den Tabellen- und Titeldaten zu einem Land in einer Saison und stellt eine Statistik auf
// landData: [1] bis [10/18/20], ['P'], ['P2'], ['OSC'], ['OSE'] (['FP'], ['OSC2'] und ['OSE2']) mit je [ ID, Quali-ID, effektive Quali-ID ]
// return Statistik zu diesem Land in einen bestimmten Saison mit einigen Statistik-Keys
function getLandDataStats(landData) {
    const __LSTATS = getEmptyDataStats();
    let sum = 0;
    let sum1 = 0;
    let sum2 = 0;

    for (let typ of [ 'OSEQ', 'OSE', 'OSCQ', 'OSC' ]) {
        __LSTATS[typ + '[1]'] = 0;
        __LSTATS[typ + '[2]'] = 0;
    }

    for (let key in landData) {
        const __ENTRY = getValue(landData[key], []);

        if (__ENTRY[0]) {
            __LSTATS[key] = 1;
            sum++;
        }
        if (__ENTRY[1]) {
            const __TYP = getGameType(__ENTRY[1]);

            __LSTATS[__TYP + '[1]']++;
            sum1++;
        }
        if (__ENTRY[2]) {
            const __TYP = getGameType(__ENTRY[2]);

            __LSTATS[__TYP + '[2]']++;
            sum2++;
        }
    }

    __LSTATS['Summe[0]'] = sum;
    __LSTATS['Summe[1]'] = sum1;
    __LSTATS['Summe[2]'] = sum2;

    return __LSTATS;
}

// Zaehlt die Eintraege in den Tabellen- und Titeldaten zu einer Saison und stellt eine Statistik auf
// saisonData: [1] bis [10/18/20], ['P'], ['P2'], ['OSC'], ['OSE'] (['FP'], ['OSC2'] und ['OSE2']) mit je [ ID, Quali-ID ]
// return Statistik zu dieser einen Saison mit einigen Statistik-Keys
function getSaisonDataStats(saisonData) {
    const __SSTATS = getEmptyDataStats();

    for (let land in saisonData) {
        const __LDATA = getProp(saisonData, land, { });
        const __LSTATS = getLandDataStats(__LDATA);

        for (let key in __LSTATS) {
            getProp(__SSTATS, key, 0);
            __SSTATS[key] += __LSTATS[key];
        }
    }

    return __SSTATS;
}

// Zaehlt die Eintraege in den Tabellen- und Titeldaten und stellt eine Statistik auf
// data: Array von Saisondaten ueber alle Saisons ([0] = null, ) [1], [2], ...
// return Statistik in analogem Array mit einigen Statistik-Keys
function getDataStats(data) {
    const __STATS = [];
    const __SUMSTATS = getEmptyDataStats();

    for (let saison = 1; saison < data.length; saison++) {
        const __SDATA = getProp(data, saison, { });
        const __SSTATS = getSaisonDataStats(__SDATA);

        __STATS[saison] = __SSTATS;

        for (let key in __SSTATS) {
            getProp(__SUMSTATS, key, 0);
            __SUMSTATS[key] += __SSTATS[key];
        }

        __STATS[saison].Titel = "Saison " + saison;
    }

    __STATS[0] = __SUMSTATS;
    __STATS[0].Titel = "Alle Saisons";

    return __STATS;
}

// Ermittelt aus den Eintraegen in den Tabellen- und Titeldaten die vier Startlisten fuer 'OSEQ', 'OSE', 'OSCQ' und 'OSC'
// saisonData: Array von Saisondaten ueber eine Saison
// return Objekt mit den Startlisten fuer 'OSEQ', 'OSE', 'OSCQ' und 'OSC' (jeweils sortierte Arrays)
function getQualiIDs(saisonData) {
    const __WETTBEWERBE = [ 'OSEQ', 'OSE', 'OSCQ', 'OSC' ];
    const __STARTPLAETZE = { };
    const __LISTEN = [];

    for (let typ of __WETTBEWERBE) {
        __LISTEN[getGameTypeID(typ)] = [];
    }

    for (let land in saisonData) {
        const __LDATA = getProp(saisonData, land, { });

        for (let key in __LDATA) {
            const __ENTRY = getValue(__LDATA[key], []);
            const __QUALI = __ENTRY[2];

            if (__QUALI) {
                const __TEAMID = __ENTRY[0];

                __LISTEN[__QUALI].push(__TEAMID);
            }
        }
    }

    for (let typ of __WETTBEWERBE) {
        const __QUALI = getGameTypeID(typ);
        const __LISTE = __LISTEN[__QUALI].sort(compareNumber);

        __STARTPLAETZE[typ] = __LISTE;
    }

    return __STARTPLAETZE;
}

// Speichert die ermittelten Quali-Daten in den Optionen
// optSet: Set mit den Optionen
// data: Array von Saisondaten ueber alle Saisons ([0] = null, ) [1], [2], ...
// saison: Saison, nach deren Ergebnisse Startplaetze zu vergeben sind (optional)
function saveQualiData(optSet, data, saison) {
    setOpt(optSet.data, data, false);

    if (getOptValue(optSet.calcStats, true)) {
        setOpt(optSet.dataStats, getDataStats(data), false);
    }

    if (saison && getOptValue(optSet.calcQuali, true)) {
        const __SDATA = getProp(data, saison, { });

        setOpt(optSet.startPlaetze, getQualiIDs(__SDATA), false);
    }
}

// Setzt statische Daten aus einer alten Saison (Fairplay-Plaetz)
// landData: [1] bis [10/18/20], ['P'], ['P2'], ['OSC'], ['OSE'] (['FP'], ['OSC2'] und ['OSE2']) mit je [ ID, Quali-ID ]
// fpTyp: Typ des vergebenen Platzes ('OSE' bis Saison 6, 'OSEQ' ab Saison 7)
// teamIds: IDs der qualifizierten Teams
// laender: Array mit den Laendernamen der Teams
function initFairplaySaisonData(saisonData, fpTyp, teamIds, laender) {
    const __QUALI = getGameTypeID(fpTyp);

    for (let land in saisonData) {
        const __LDATA = getProp(saisonData, land, { });

        delete __LDATA.FP;
    }

    for (let i = 0; i < teamIds.length; i++) {
        const __TEAMID = teamIds[i];
        const __LAND = laender[__TEAMID];

        if (__LAND) {
            const __LDATA = getProp(saisonData, __LAND, { });

            __LDATA.FP = [ __TEAMID, __QUALI, __QUALI ];
        } else {
            __LOG[0]("initFairplaySaisonData(): #" + __TEAMID + " " + __LAND);
        }
    }
}

// Setzt statische Daten aus alten Saisons (Fairplay-Plaetze, Euro-TV)
// data: Array von Saisondaten ueber alle Saisons ([0] = null, ) [1], [2], ...
// laender: Array mit den Laendernamen der Teams
function initFairplayData(data, laender) {
    const __FPDATA = {
                          2 : [  476,    3,  722 ],
                          3 : [   79,  262,  383 ],
                          4 : [   79,  450, 1475 ],
                          5 : [  440,   79,  536 ],
                          6 : [  724,  817,   50 ],
                          7 : [  440,  439,   32 ],
                          8 : [  896, 1415,  610 ],
                          9 : [  145,  840,  442 ],
                         10 : [ 1715,   99,  534 ],
                         11 : [  927, 1646,  888 ]
                     };

    for (let saison in __FPDATA) {
        const __SDATA = getProp(data, saison, { });
        const __TYP = ((saison < 6) ? 'OSE' : 'OSEQ');

        initFairplaySaisonData(__SDATA, __TYP, __FPDATA[saison], laender);
    }
}

// Ermittelt die Verteilung der Europapokalplaetze
// landData: [1] bis [10/18/20], ['P'], ['P2'], ['OSC'], ['OSE'] (['FP'], ['OSC2'] und ['OSE2']) mit je [ ID, Quali-ID ]
// return Modifizierte landData mit [ ID, Quali-ID, Quali-ID (effektiv) ]
function calcEuropaPlaetze(landData, laender) {
    const __LDATA = getValue(landData, { });
    const __OSETYP = getGameTypeID('OSE');
    const __CLASSES = { };
    let zusOSE = 0;

    for (let entry in __LDATA) {
        const __ENTRY = getProp(__LDATA, entry, []);
        const __CLASSID = __ENTRY[1];

        if (__ENTRY.length > 2) {
            // Effektive Quali entfernen (wird weiter unten ggfs. erneuert)...
            delete __ENTRY[2];
            __ENTRY.length = 2;
        }

        if (__CLASSID) {
            const __TEAMID = __ENTRY[0];
            const __ACHIEVED = getProp(__CLASSES, __TEAMID, { });

            // Zuordnung merken...
            __ACHIEVED[entry] = __CLASSID;

            // Liga-Meisterschaft?
            if (String(entry).match(/^\d+$/)) {
                __ACHIEVED.res = __CLASSID;
                __ACHIEVED.typ = 'L';
            }
        }
    }

    for (let typ of [ 'OSC', 'OSE', 'P', 'FP' ]) {
        const __ENTRY = getValue(__LDATA[typ], []);
        const __TEAMID = __ENTRY[0];

        if (__TEAMID) {
            const __ACHIEVED = __CLASSES[__TEAMID];
            const __RESCLASS = __ACHIEVED.res;
            const __RESTYPE = __ACHIEVED.typ;
            const __MYTYPE = getValue(__ENTRY[1], __OSETYP);

            if ((typ === 'P') && __RESTYPE && ((__RESTYPE !== 'L') || (__RESCLASS > __OSETYP))) {
                // Pokalfinalist ersetzt Pokalsieger?
                const __ENTRY2 = getValue(__LDATA.P2, []);
                const __P2 = __ENTRY2[0];
                const __ACHIEVED2 = getProp(__CLASSES, __P2, { });
                const __RESCLASS2 = __ACHIEVED2.res;

                if (__RESCLASS2 && (__RESCLASS2 > __OSETYP)) {
                    zusOSE++;
                } else {
                    __ACHIEVED2.res = __ENTRY2[2] = __MYTYPE;
                    __ACHIEVED2.typ = typ;
                }
            } else {
                __ACHIEVED.res = __ENTRY[2] = __MYTYPE;
                __ACHIEVED.typ = typ;
            }
        } else if (typ === 'P') {
            zusOSE++;
        }
    }

    for (let platz = 1, ref = platz; platz <= 10; platz++) {  // max. 10 Europapokalplaetze (alle Saisons!)
        const __ENTRY = getProp(__LDATA, platz, []);
        const __TEAMID = __ENTRY[0];
        const __ACHIEVED = getValue(__CLASSES[__TEAMID], { });

        if (getValue(__ACHIEVED.typ, 'L') === 'L') {  // Kein Sonderplatz ('P', 'P2', 'FP', 'OSC' oder 'OSE')
            const __REFENTRY = getProp(__LDATA, ref++, []);
            const __REFTYP = __REFENTRY[1];

            if (! __REFTYP) {
                break;
            }

            const __EFFTYP = Math.max(__REFTYP, ((zusOSE > 0) ? __OSETYP : 0));

            __ENTRY[2] = __EFFTYP;

            if ((zusOSE > 0) && (__EFFTYP === __OSETYP)) {
                zusOSE--;
                ref--;
            }
        }
    }

    return landData;
}

// ==================== Hauptprogramm ====================

// Verarbeitet Ansicht "Haupt" (Managerbuero) zur Ermittlung des aktuellen ZATs
function procHaupt() {
    const __TEAMPARAMS = getTeamParamsFromTable(getTable(1), __TEAMSEARCHHAUPT);  // Link mit Team, Liga, Land...

    return buildOptions(__OPTCONFIG, __OPTSET, {
                            'teamParams' : __TEAMPARAMS,
                            'hideMenu'   : true
                        });
}

// Verarbeitet Ansicht "Fairplaytabelle"
function procFairplay() {
    const __ROWOFFSETUPPER = 1;     // Header-Zeile
    const __ROWOFFSETLOWER = 0;

    const __COLUMNINDEX = {
            'Platz'   : 0,
            'Team'    : 1,
            'Gelb'    : 2,
            'GelbRot' : 3,
            'Rot'     : 5,
            'Anz'     : 6,
            'Punkte'  : 7
        };

    return buildOptions(__OPTCONFIG, __OPTSET, {
                            'menuAnchor' : getTable(0, 'div'),
                            'hideForm'   : {
                                               'saison'        : true,
                                               'liga'          : true,
                                               'land'          : true,
                                               'tabTyp'        : true,
                                               'Prunde'        : true,
                                               'OSCrunde'      : true,
                                               'OSErunde'      : true,
                                               'ligaNr'        : true,
                                               'landNr'        : true,
                                               'tabTypNr'      : true,
                                               'PrundenNr'     : true,
                                               'OSCrundenNr'   : true,
                                               'OSErundenNr'   : true,
                                               'data'          : true,
                                               'dataStats'     : true,
                                               'manager'       : true,
                                               'ligen'         : true
                                           },
                            'formWidth'  : 1
                        }).then(optSet => {
            const __CURRSAISON = getOptValue(__OPTSET.aktuelleSaison);
            const __EINFAERBUNG = getOptValue(__OPTSET.zeigeQuali, true);
            const __SHOWTITLES = getOptValue(__OPTSET.zeigeTitel, true);
            const __LAENDER = getOptValue(__OPTSET.laender, []);
            const __DATA = getOptValue(__OPTSET.data, []);

            const __TABLEMAN = new TableManager(__OPTSET, __COLUMNINDEX, getRowsById('fairplay'), __ROWOFFSETUPPER, __ROWOFFSETLOWER);

            __TABLEMAN.isAbschluss = true;  // Vorschau der Fairplay-Tabelle auf Saisonende!
            __TABLEMAN.saison = __CURRSAISON;  // Fairplay-Tabelle gilt fuer die aktuelle Saison!

            const __SDATA = getProp(__DATA, __CURRSAISON, { });
            const __ANZFAIRPLAY = 3;  // Nur unter gewissen Umstaenden mehr als 3!
            const __LANDSHOWN = { };
            const __ENTRIES = { };
            const __TITEL = { };

            const __TYPEN = {
                        'P2'   : 'Pokalfinalist',
                        'P'    : 'Pokalsieger',
                        'OSE'  : 'OSE-Sieger',
                        'OSC'  : 'OSC-Sieger',
                        '1'    : 'Meister',       // Ab hier nur Markierungen, kein Eintrag!
                        '2'    : 'Vizemeister',
                        'OSE2' : 'OSE-Finalist',
                        'OSC2' : 'OSC-Finalist',
                        'FP'   : 'Fairplay'
                    };

            for (let i = 0; i < __TABLEMAN.ligaSize; i++) {
                const __VEREIN = __TABLEMAN.vereine[i];
                const __TEAMID = __VEREIN.ID;
                const __LAND = __LAENDER[__TEAMID];

                __LANDSHOWN[__LAND] = true;
            }

            for (let land in __LANDSHOWN) {
                const __LDATA = getProp(__SDATA, land, { });

                // Eventuell vorhandenen Eintrag entfernen (wird weiter unten neu ermittelt)...
                delete __LDATA.FP;

                for (let typ in __LDATA) {
                    const __ENTRY = getValue(__LDATA[typ], []);
                    const __TEAMID = __ENTRY[0];
                    const __TYP = __ENTRY[2];

                    if (__TEAMID) {
                        const __TYPNAME = __TYPEN[typ];

                        if (__TYPNAME) {
                            getProp(__TITEL, __TEAMID, []).push(__TYPEN[typ]);
                        }

                        if (__TYP) {
                            __ENTRIES[__TEAMID] = __ENTRY;
                        }
                    }
                }
            }
console.log(__ENTRIES);
console.log(__TITEL);
            for (let i = 0, count = __ANZFAIRPLAY; i < __TABLEMAN.ligaSize; i++) {
                const __VEREIN = __TABLEMAN.vereine[i];
                const __TEAMID = __VEREIN.ID;
                const __ENTRY = __ENTRIES[__TEAMID];

                if (__ENTRY) {
                    if (__EINFAERBUNG) {
                        const __TYP = __ENTRY[2];

                        __TABLEMAN.setClass(i, __TYP);
                    }
                } else if (count-- > 0) {
                    const __LAND = __LAENDER[__TEAMID];
                    const __LDATA = getProp(__SDATA, __LAND, { });
                    const __QUALI = getGameTypeID((__CURRSAISON < 7) ? 'OSE' : 'OSEQ');

                    __LDATA.FP = [ __TEAMID, __QUALI, __QUALI ];
                    getProp(__TITEL, __TEAMID, []).push(__TYPEN.FP);
                }

                if (__SHOWTITLES) {
                    const __TIT = __TITEL[__TEAMID];

                    __TABLEMAN.addTitel(i, __TIT, ", ");
                }
            }

            saveQualiData(__OPTSET, __DATA, __CURRSAISON);
        });
}

// Verarbeitet Ansichten "OS Championscup FR" und "OS Europacup"
// typ: Name des Wettbewerbs ('OSC' oder 'OSE')
// finale: Runde mit dem Finalspiel
function procEuropa(typ, finale) {
    const __COLUMNINDEX = {
            'LandH'  : 0,
            'WappH'  : 1,
            'TeamH'  : 2,
            'vs'     : 3,
            'LandA'  : 4,
            'WappA'  : 5,
            'TeamA'  : 6,
            '_1'     : 7,
            'Erg'    : 8,
            '_2'     : 9,
            'Ber'    : 10,
            '_3'     : 11,
            'Kom'    : 12,
            '_4'     : 13,
            'ErgR'   : 14,
            '_5'     : 15,
            'BerR'   : 16,
            '_6'     : 17,
            'KomR'   : 18
        };

    return buildOptions(__OPTCONFIG, __OPTSET, {
                            'menuAnchor' : getTable(0, 'div'),
                            'hideForm'   : {
                                               'land'          : true,
                                               'liga'          : true,
                                               'tabTyp'        : true,
                                               'Prunde'        : true,
                                               'OSCrunde'      : (typ === 'OSC'),
                                               'OSErunde'      : (typ === 'OSE'),
                                               'landNr'        : true,
                                               'ligaNr'        : true,
                                               'tabTypNr'      : true,
                                               'PrundenNr'     : true,
                                               'OSCrundenNr'   : (typ === 'OSC'),
                                               'OSErundenNr'   : (typ === 'OSE')
                                           },
                            'formWidth'  : 1
                        }).then(optSet => {
            const __RUNDE = getOptValue(__OPTSET[typ + 'rundenNr']);
            const __FINALE = (__RUNDE === finale);
            const __ROWS = getRows(0);

            if (__FINALE && __ROWS.length) {
                const __CELLS = __ROWS[0].cells;  // Finalspiel
                const __SAISON = getOptValue(__OPTSET.saison);
                const __VEREINE = getOptValue(__OPTSET.vereine, []);
                const __LAENDER = getOptValue(__OPTSET.laender, []);
                const __DATA = getOptValue(__OPTSET.data, []);
                const __HEIMLAND = getLandNameFromCell(__CELLS[__COLUMNINDEX.LandH]);
                const __TEAMHEIMCELL = __CELLS[__COLUMNINDEX.TeamH];
                const __HEIMNAME = getTeamNameFromCell(__TEAMHEIMCELL);
                const __HEIMID = getTeamIdFromCell(__TEAMHEIMCELL);
                const __HEIM = new Verein(__HEIMNAME, __HEIMLAND, undefined, __HEIMID, undefined, undefined);
                const __GASTLAND = getLandNameFromCell(__CELLS[__COLUMNINDEX.LandA]);
                const __TEAMGASTCELL = __CELLS[__COLUMNINDEX.TeamA];
                const __GASTNAME = getTeamNameFromCell(__TEAMGASTCELL);
                const __GASTID = getTeamIdFromCell(__TEAMGASTCELL);
                const __GAST = new Verein(__GASTNAME, __GASTLAND, undefined, __GASTID, undefined, undefined);
                const __ERGEBNIS = setErgebnisFromCell({ }, __CELLS[__COLUMNINDEX.Erg]);
                const __HEIMSIEG = ((__ERGEBNIS.gFor > -1) ? (__ERGEBNIS.gFor > __ERGEBNIS.gAga) : undefined);
                const __WINNER =  (__HEIMSIEG ? __HEIM : __GAST);
                const __LOSER = (__HEIMSIEG ? __GAST : __HEIM);
                const __WID = __WINNER.ID;
                const __LID = __LOSER.ID;
                const __WLAND = __WINNER.Land;
                const __LLAND = __LOSER.Land;
                const __SDATA = getProp(__DATA, __SAISON, { });
                const __LDATA = getProp(__SDATA, __WLAND, { });
                const __LDATA2 = getProp(__SDATA, __LLAND, { });

                __VEREINE[__HEIMID] = __HEIM.Team;
                __LAENDER[__HEIMID] = __HEIM.Land;
                __VEREINE[__GASTID] = __GAST.Team;
                __LAENDER[__GASTID] = __GAST.Land;

                if (__HEIMSIEG !== undefined) {
                    __LDATA[typ] = [ __WID, getGameTypeID(typ) ];
                    __LDATA2[typ + '2'] = [ __LID ];

                    saveQualiData(__OPTSET, __DATA, __SAISON);
                }

                setOpt(__OPTSET.vereine, __VEREINE, false);
                setOpt(__OPTSET.laender, __LAENDER, false);
            }
        });
}

// Verarbeitet Ansicht "Landespokale"
// finale: Runde mit dem Finalspiel
function procPokal(finale) {
    const __COLUMNINDEX = {
            'Ausw'   : 0,
            'WappH'  : 1,
            'TeamH'  : 2,
            'vs'     : 3,
            'WappA'  : 4,
            'TeamA'  : 5,
            '_1'     : 6,
            'Erg'    : 7,
            '_2'     : 8,
            'Ber'    : 9,
            '_3'     : 10,
            'Kom'    : 11
        };

    return buildOptions(__OPTCONFIG, __OPTSET, {
                            'menuAnchor' : getTable(0, 'div'),
                            'hideForm'   : {
                                               'liga'          : true,
                                               'tabTyp'        : true,
                                               'OSCrunde'      : true,
                                               'OSErunde'      : true,
                                               'ligaNr'        : true,
                                               'tabTypNr'      : true,
                                               'OSCrundenNr'   : true,
                                               'OSErundenNr'   : true
                                           },
                            'formWidth'  : 1
                        }).then(optSet => {
            const __RUNDE = getOptValue(__OPTSET.PrundenNr);
            const __FINALE = (__RUNDE === finale);
            const __ROWS = getRows(0);

            if (__FINALE && __ROWS.length) {
                const __CELLS = __ROWS[0].cells;  // Finalspiel
                const __SAISON = getOptValue(__OPTSET.saison);
                const __LAND = getOptValue(__OPTSET.land);
                const __VEREINE = getOptValue(__OPTSET.vereine, []);
                const __LAENDER = getOptValue(__OPTSET.laender, []);
                const __DATA = getOptValue(__OPTSET.data, []);
                const __HEIMTEAMCELL = __CELLS[__COLUMNINDEX.TeamH];
                const __HEIMNAME = getTeamNameFromCell(__HEIMTEAMCELL);
                const __HEIMID = getTeamIdFromCell(__HEIMTEAMCELL);
                const __HEIM = new Verein(__HEIMNAME, __LAND, undefined, __HEIMID, undefined, undefined);
                const __GASTTEAMCELL = __CELLS[__COLUMNINDEX.TeamA];
                const __GASTNAME = getTeamNameFromCell(__GASTTEAMCELL);
                const __GASTID = getTeamIdFromCell(__GASTTEAMCELL);
                const __GAST = new Verein(__GASTNAME, __LAND, undefined, __GASTID, undefined, undefined);
                const __ERGEBNIS = setErgebnisFromCell({ }, __CELLS[__COLUMNINDEX.Erg]);
                const __HEIMSIEG = ((__ERGEBNIS.gFor > -1) ? (__ERGEBNIS.gFor > __ERGEBNIS.gAga) : undefined);
                const __WINNER =  (__HEIMSIEG ? __HEIM : __GAST);
                const __LOSER = (__HEIMSIEG ? __GAST : __HEIM);
                const __WID = __WINNER.ID;
                const __LID = __LOSER.ID;
                const __SDATA = getProp(__DATA, __SAISON, { });
                const __LDATA = getProp(__SDATA, __LAND, { });

console.log(__HEIMTEAMCELL);
console.log(__GASTTEAMCELL);
console.log(__HEIM);
console.log(__GAST);
console.log(__ERGEBNIS);

                __VEREINE[__HEIMID] = __HEIM.Team;
                __LAENDER[__HEIMID] = __HEIM.Land;
                __VEREINE[__GASTID] = __GAST.Team;
                __LAENDER[__GASTID] = __GAST.Land;

                if (__HEIMSIEG !== undefined) {
                    __LDATA.P = [ __WID, getGameTypeID('OSE') ];
                    __LDATA.P2 = [ __LID ];

                    saveQualiData(__OPTSET, __DATA, __SAISON);
                }

                setOpt(__OPTSET.vereine, __VEREINE, false);
                setOpt(__OPTSET.laender, __LAENDER, false);
            }
        });
}

// Verarbeitet Ansicht "Ligatabelle"
function procTabelle() {
    const __ROWOFFSETUPPER = 1;     // Header-Zeile
    const __ROWOFFSETLOWER = 0;

    const __COLUMNINDEX = {
            'Platz'  : 0,
            'Wappen' : 1,
            'Team'   : 2,
            'Anz'    : 3,
            'S'      : 4,
            'U'      : 5,
            'N'      : 6,
            'TorF'   : 7,
            'TorA'   : 8,
            'TorD'   : 9,
            'Punkte' : 10
        };

    return buildOptions(__OPTCONFIG, __OPTSET, {
                            'menuAnchor' : getTable(0, 'div'),
                            'hideForm'   : {
                                               'Prunde'        : true,
                                               'OSCrunde'      : true,
                                               'OSErunde'      : true,
                                               'PrundenNr'     : true,
                                               'OSCrundenNr'   : true,
                                               'OSErundenNr'   : true
                                           },
                            'formWidth'  : 1
                        }).then(optSet => {
            const __TABLEMAN = new TableManager(__OPTSET, __COLUMNINDEX, getRowsById('kader1'), __ROWOFFSETUPPER, __ROWOFFSETLOWER);

            const __SAISON = __TABLEMAN.saison;
            const __LAND = __TABLEMAN.land;
            const __EINFAERBUNG = getOptValue(__OPTSET.zeigeQuali, true);
            const __SHOWTITLES = getOptValue(__OPTSET.zeigeTitel, true);
            const __SHOWCURRTITLES = getOptValue(__OPTSET.zeigeAktuelleTitel, true);
            const __SHOWQUALITITLES = getOptValue(__OPTSET.zeigeQualiTitel, true);
            const __VEREINE = getOptValue(__OPTSET.vereine, []);
            const __LAENDER = getOptValue(__OPTSET.laender, []);
            //const __MANAGER = getOptValue(__OPTSET.manager, []);
            const __LIGEN = getOptValue(__OPTSET.ligen, []);
            const __DATA = getOptValue(__OPTSET.data, []);
            const __SDATA = getProp(__DATA, __SAISON, { });
            const __LDATA = getProp(__SDATA, __LAND, { });

            if (getOptValue(__OPTSET.setFPdata, false)) {
                initFairplayData(__DATA, __LAENDER);

                setOpt(__OPTSET.setFPdata, false, false);
            }

            for (let i = 0; i < __TABLEMAN.ligaSize; i++) {
                const __VEREIN = __TABLEMAN.vereine[i];
                const __TEAMID = __VEREIN.ID;

                __VEREINE[__TEAMID] = __VEREIN.Team;
                __LAENDER[__TEAMID] = __VEREIN.Land;
                //__MANAGER[__TEAMID] = __VEREIN.Manager;
                __LIGEN[__TEAMID] = __VEREIN.LgNr;

                if (__TABLEMAN.isErsteLiga) {
                    const __QUALI = __TABLEMAN.getQuali(i);
                    const __ENTRY = [ __TEAMID ];

                    if (__QUALI) {
                        __ENTRY.push(__QUALI);
                    }

                    __LDATA[i + 1] = __ENTRY;
                }
            }

            __TABLEMAN.formatAllCols([
                                         [
                                             {
                                                 'textAlign' : 'center'
                                             },
                                             'Anz',
                                             'Punkte'
                                         ],
                                         [
                                             {
                                                 'textAlign' : 'right',
                                                 'padding'   : "0px .75em"
                                             },
                                             'TorF'
                                         ],
                                         [
                                             {
                                                 'textAlign' : 'left',
                                                 'padding'   : "0px .75em"
                                             },
                                             'TorA'
                                         ]
                                     ]);

            setOpt(__OPTSET.vereine, __VEREINE, false);
            setOpt(__OPTSET.laender, __LAENDER, false);
            //setOpt(__OPTSET.manager, __MANAGER, false);
            setOpt(__OPTSET.ligen, __LIGEN, false);

            if (__TABLEMAN.isErsteLiga) {
                calcEuropaPlaetze(__LDATA);

                saveQualiData(__OPTSET, __DATA, __SAISON);

                if (__EINFAERBUNG) {
                    for (let i = 0; i < __TABLEMAN.ligaSize; i++) {
                        const __ENTRY = getProp(__LDATA, i + 1, []);
                        const __TYP = __ENTRY[2];

                        __TABLEMAN.setClass(i, __TYP);
                    }
                }
            }

            if (__EINFAERBUNG || __SHOWTITLES || __SHOWCURRTITLES || __SHOWQUALITITLES) {
                const __ENTRIES = { };
                const __TITEL = { };
                const __LTITEL = { };

                const __LEGENDE = getTable(1);
                const __ROWS = (__LEGENDE ? __LEGENDE.getElementsByTagName("tr") : { });
                const __TABCOLORS = getStyleFromElements(__ROWS, "backgroundColor", getUpperClassNameFromElement);  // Faerbungen aus Legende ermitteln
/*
                const __TABCOLORS = {
                        'OSC'  : 'darkgreen',
                        'OSCQ' : 'olivedrab',
                        'OSE'  : 'darkOlivegreen',
                        'OSEQ' : '#88864E'
                    };
*/
                const __TYPEN = {
                        'P'    : 'Pokalsieger',
                        'P2'   : 'Pokalfinalist',
                        'OSE'  : 'OSE-Sieger',
                        'OSC'  : 'OSC-Sieger',
                        'FP'   : 'Fairplay',
                        '1'    : 'Meister',       // Ab hier nur Markierungen, kein Eintrag!
                        '2'    : 'Vizemeister',
                        'OSE2' : 'OSE-Finalist',
                        'OSC2' : 'OSC-Finalist'
                    };

                const __FLAGTYPEN = {
                        'M'    : 'Meister',
                        'P'    : 'Pokalsieger',
                        'N'    : 'Aufsteiger',
                        'A'    : 'abgestiegen',  // 'Absteiger' wird leicht verwechselt!
                        'Z'    : 'Zwangsabsteiger',
                        'OSE'  : 'OSE-Sieger',
                        'OSC'  : 'OSC-Sieger'
                    };

                const __ADDTYPEN = {
                        'P2'   : true,
                        'FP'   : true,
                        '2'    : true,
                        'OSE2' : true,
                        'OSC2' : true
                    };

                if (__SAISON > 1) {
                    const __SLDATA = getProp(__DATA, __SAISON - 1, { });
                    const __LLDATA = getProp(__SLDATA, __LAND, { });
                    const __HASCURRTITLES = (__SHOWCURRTITLES && __TABLEMAN.isCurrSaison && ! __TABLEMAN.isAbschluss);

                    if (__SHOWQUALITITLES || __SHOWCURRTITLES) {
                        for (let typ in __LLDATA) {
                            const __ENTRY = getValue(__LLDATA[typ], []);
                            const __TEAMID = __ENTRY[0];
                            const __QUALI = __ENTRY[2];
                            const __TTYP = __TYPEN[typ];
                            const __ADDTTYP = (__HASCURRTITLES ? __ADDTYPEN[typ] : false);

                            if (__QUALI) {
                                const __LTYP = getGameType(__QUALI);

                                getProp(__LTITEL, __TEAMID, []).push(__LTYP);
                            }

                            if (__TTYP && __ADDTTYP) {
                                getProp(__TITEL, __TEAMID, []).push(__TTYP);
                            }
                        }
                    }

                    if (__HASCURRTITLES) {
                        for (let i = 0; i < __TABLEMAN.ligaSize; i++) {
                            const __VEREIN = __TABLEMAN.vereine[i];
                            const __TEAMID = __VEREIN.ID;
                            const __FLAGS = __VEREIN.Flags;

                            for (let j = 0; j < __FLAGS.length; j++) {
                                const __FLAG = __FLAGS[j];
                                const __TYP = __FLAGTYPEN[__FLAG];

                                getProp(__TITEL, __TEAMID, []).push(__TYP);
                            }
                        }
                    }
                }

                const __LTITELSIZE = (__SHOWQUALITITLES ? Object.keys(__LTITEL).length : 0);

                for (let typ in __TYPEN) {
                    const __ENTRY = getValue(__LDATA[typ], []);
                    const __TEAMID = __ENTRY[0];
                    const __QUALI = __ENTRY[2];

                    if (__TEAMID) {
                        if (__TABLEMAN.isAbschluss) {
                            getProp(__TITEL, __TEAMID, []).push(__TYPEN[typ]);
                        }

                        if (__QUALI) {
                            __ENTRIES[__TEAMID] = __ENTRY;
                        }
                    }
                }
console.log(__LDATA);
console.log(__ENTRIES);
console.log(__TITEL);
console.log(__LTITEL);
                for (let i = 0; i < __TABLEMAN.ligaSize; i++) {
                    const __VEREIN = __TABLEMAN.vereine[i];
                    const __TEAMID = __VEREIN.ID;

                    if (__EINFAERBUNG) {
                        const __ENTRY = __ENTRIES[__TEAMID];

                        if (__ENTRY) {
                            const __TYP = __ENTRY[2];

                            __TABLEMAN.setClass(i, __TYP);
                        }
                    }

                    if (__SHOWCURRTITLES) {
                        __TABLEMAN.delFlags(i);
                    }

                    if (__SHOWTITLES || __SHOWCURRTITLES || __SHOWQUALITITLES) {
                        const __LTIT = __LTITEL[__TEAMID];
                        const __TIT = __TITEL[__TEAMID];
                        const __LFILL = ((__LTITELSIZE && __TIT) ? [] : undefined);
                        const __LTITSHOWN = (__SHOWQUALITITLES ? __LTIT : undefined);

                        const __OSBLAU = "#111166";
                        const __LCOLOR = (__LTIT ? __TABCOLORS[__LTIT] : __OSBLAU);
                        const __TCOLOR = ((__TABLEMAN.isCurrSaison && ! __TABLEMAN.isAbschluss) ? __LCOLOR : undefined);

                        __TABLEMAN.addTitel(i, getValue(__LTITSHOWN, __LFILL), ", ", __LCOLOR);
                        __TABLEMAN.addTitel(i, __TIT, ", ", __TCOLOR);
                    }
                }
            }
        });
}

(() => {
    (async () => {
        try {
            // Verzweige in unterschiedliche Verarbeitungen je nach aufgerufener Seite:
            switch (getPageIdFromURL(window.location.href, {
                                                               'haupt.php' : 0,  // Ansicht "Haupt" (Managerbuero)
                                                               'lp.php'    : 1,  // Ansicht "Landespokale" (Pokalfinale)
                                                               'lt.php'    : 2,  // Ansicht "Ligatabelle" (Gesamttabelle)
                                                               'oscfr.php' : 3,  // Ansicht "OS Championscup FR" (OSC-Finale)
                                                               'ose.php'   : 4,  // Ansicht "OS Europacup" (OSE-Finale)
                                                               'fpt.php'   : 5   // Ansicht "Fairplaytabelle"
                                                           })) {
                case 0  : await procHaupt().catch(defaultCatch); break;
                case 1  : await procPokal(7).catch(defaultCatch); break;
                case 2  : await procTabelle().catch(defaultCatch); break;
                case 3  : await procEuropa('OSC', 9).catch(defaultCatch); break;
                case 4  : await procEuropa('OSE', 8).catch(defaultCatch); break;
                case 5  : await procFairplay().catch(defaultCatch); break;
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
