// ==UserScript==
// @name         OS2.tabelle
// @namespace    http://os.ongapo.com/
// @version      0.12+lib
// @copyright    2016+
// @author       Sven Loges (SLC)
// @description  Tabellen-Script fuer Online Soccer 2.0
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/haupt\.php(\?changetosecond=\w+(&\w+=?[+\w]+)*)?(#\w+)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/(l[pt]|os(cfr|e)|fpt)\.php(\?\w+=?[+\w]+(&\w+=?[+\w]+)*)?(#\w+)?$/
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
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.promise.js
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
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.report.js
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
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.calc.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.team.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.page.team.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.page.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.class.table.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Konfigurations-Abschnitt fuer Optionen ====================

const __LOGLEVEL = 4;

// Moegliche Optionen (hier die Standardwerte editieren oder ueber das Benutzermenu setzen):
const __OPTCONFIG = {
    'zeigeQuali' : {      // Einfaerbung der Europapokalplaetze (true = anzeigen, false = nicht anzeigen)
                   'Name'      : "showQuali",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Einf\u00E4rbung ein",
                   'Hotkey'    : 'f',
                   'AltLabel'  : "Einf\u00E4rbung aus",
                   'AltHotkey' : 'f',
                   'FormLabel' : "Einf\u00E4rbung"
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
                   'Choice'    : [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 ],
                   'Default'   : 20,
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
                   'Choice'    : [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 ],
                   'Default'   : 20,
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
                   'Choice'    : [ 'Gesamttabelle', 'Heimtabelle', 'Ausw\u00E4rtstabelle', '2-Punktetabelle', 'Hinrundentabelle', 'R\u00FCckrundentabelle', '1. Halbzeit', '2. Halbzeit', 'Kreuztabelle' ],
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
                   'Label'     : "L\u00E4nder der Vereine:"
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
                   'Label'     : "Startpl\u00E4tze:"
               },
    'team' : {            // Datenspeicher fuer Daten des Erst- bzw. Zweitteams
                   'Name'      : "team",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'Team',
                   'Hidden'    : false,
                   'Serial'    : true,
                   'Permanent' : true,
                   'Default'   : undefined,  // new Team() // { 'Team' : undefined, 'Liga' : undefined, 'Land' : undefined, 'TmNr' : 0, 'LdNr' : 0, 'LgNr' : 0 }
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
                   'ValType'   : 'String',
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
                   'AltTitle'  : "$V schlie\u00DFen",
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

// ==================== Abschnitt fuer sonstige Parameter ====================

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
    optSet.setOpt('data', data, false);

    if (optSet.getOptValue('calcStats', true)) {
        optSet.setOpt('dataStats', getDataStats(data), false);
    }

    if (saison && optSet.getOptValue('calcQuali', true)) {
        const __SDATA = getProp(data, saison, { });

        optSet.setOpt('startPlaetze', getQualiIDs(__SDATA), false);
    }
}

// Setzt statische Daten aus einer alten Saison (Fairplay-Plaetze)
// landData: [1] bis [10/18/20], ['P'], ['P2'], ['OSC'], ['OSE'] (['FP'], ['OSC2'] und ['OSE2']) mit je [ ID, Quali-ID ]
// fpTyp: Typ des vergebenen Platzes ('OSE' bis Saison 6, 'OSEQ' ab Saison 7, wieder 'OSE' ab Saison 20)
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
            __LOG[1]("initFairplaySaisonData(): #" + __TEAMID + " " + __LAND);
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
                         11 : [  927, 1646,  888 ],
                         12 : [  534,  297,  346 ],
                         13 : [  919, 1270,  442 ],
                         14 : [  191,  466, 1352 ],
                         15 : [  346, 1756,  754 ],
                         16 : [  927, 1608, 1466 ],
                         17 : [  266,  346,  693 ],
                         18 : [ 1501, 1917,  980,   39 ],
                         19 : [  179, 1352,  823 ]
                     };

    for (let saison in __FPDATA) {
        const __SDATA = getProp(data, saison, { });
        const __TYP = (((saison < 6) || (saison >= 19)) ? 'OSE' : 'OSEQ');

        initFairplaySaisonData(__SDATA, __TYP, __FPDATA[saison], laender);
    }
}

// Ermittelt die Verteilung der Europapokalplaetze
// landData: [1] bis [10/18/20], ['P'], ['P2'], ['OSC'], ['OSE'] (['FP'], ['OSC2'] und ['OSE2']) mit je [ ID, Quali-ID ]
// return Modifizierte landData mit [ ID, Quali-ID, Quali-ID (effektiv) ]
function calcEuropaPlaetze(landData) {
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

// ==================== Page-Manager fuer zu bearbeitende Seiten ====================

// Verarbeitet Ansicht "Haupt" (Managerbuero) zur Ermittlung des aktuellen ZATs
const procHaupt = new PageManager("Haupt (Managerb\u00FCro)", __TEAMCLASS, () => {
        const __TEAMPARAMS = getTeamParamsFromTable(__TEAMSEARCHHAUPT, __TEAMIDSEARCHHAUPT);

        return {
                'teamParams' : __TEAMPARAMS,
                'hideMenu'   : true
            };
    }, async optSet => {
        UNUSED(optSet);

        // Nichts zu tun!
        return true;
    });

// Verarbeitet Ansicht "Fairplaytabelle"
const procFairplay = new PageManager("Fairplaytabelle", __TEAMCLASS, () => {
        return {
                'menuAnchor' : getElement('DIV'),
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
            };
    }, async optSet => {
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
        const __CURRSAISON = optSet.getOptValue('aktuelleSaison');
        const __EINFAERBUNG = optSet.getOptValue('zeigeQuali', true);
        const __SHOWTITLES = optSet.getOptValue('zeigeTitel', true);
        const __LAENDER = optSet.getOptValue('laender', []);
        const __DATA = optSet.getOptValue('data', []);

        const __TABLEMAN = new TableManager(optSet, __COLUMNINDEX, getRowsById('fairplay'), __ROWOFFSETUPPER, __ROWOFFSETLOWER);

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
                const __QUALI = getGameTypeID(((__CURRSAISON <= 6) || (__CURRSAISON > 19)) ? 'OSE' : 'OSEQ');

                __LDATA.FP = [ __TEAMID, __QUALI, __QUALI ];
                getProp(__TITEL, __TEAMID, []).push(__TYPEN.FP);
            }

            if (__SHOWTITLES) {
                const __TIT = __TITEL[__TEAMID];

                __TABLEMAN.addTitel(i, __TIT, ", ");
            }
        }

        saveQualiData(optSet, __DATA, __CURRSAISON);

        return true;
    });

// Verarbeitet Ansichten "OS Championscup FR" und "OS Europacup"
// typ: Name des Wettbewerbs ('OSC' oder 'OSE')
// finale: Letzte Runde mit dem Finalspiel
const procEuropa = new PageManager("Internationales Finale", __TEAMCLASS, (optSet, typ, finale) => {
        UNUSED(optSet, finale);

        return {
                'menuAnchor' : getElement('DIV'),
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
            };
    }, async (optSet, typ, finale) => {
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

        const __RUNDE = optSet.getOptValue(typ + 'rundenNr');
        const __FINALE = (__RUNDE === finale);
        const __ROWS = getRows();  // #0: Die OSE- oder OSC-Finale

        if (__FINALE && __ROWS.length) {
            const __CELLS = __ROWS[0].cells;  // Finalspiel
            const __SAISON = optSet.getOptValue('saison');
            const __VEREINE = optSet.getOptValue('vereine', []);
            const __LAENDER = optSet.getOptValue('laender', []);
            const __DATA = optSet.getOptValue('data', []);
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

                saveQualiData(optSet, __DATA, __SAISON);
            }

            optSet.setOpt('vereine', __VEREINE, false);
            optSet.setOpt('laender', __LAENDER, false);
        }

        return true;
    });

// Verarbeitet Ansicht "Landespokale"
// finale: Letzte Runde mit dem Finalspiel
const procPokal = new PageManager("Landespokalfinale", __TEAMCLASS, (optSet, finale) => {
        UNUSED(optSet, finale);

        return {
                'menuAnchor' : getElement('DIV'),
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
            };
    }, async (optSet, finale) => {
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
        const __RUNDE = optSet.getOptValue('PrundenNr');
        const __FINALE = (__RUNDE === finale);
        const __ROWS = getRows();  // #0: Das Pokalfinale

        if (__FINALE && __ROWS.length) {
            const __CELLS = __ROWS[0].cells;  // Finalspiel
            const __SAISON = optSet.getOptValue('saison');
            const __LAND = optSet.getOptValue('land');
            const __VEREINE = optSet.getOptValue('vereine', []);
            const __LAENDER = optSet.getOptValue('laender', []);
            const __DATA = optSet.getOptValue('data', []);
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

                saveQualiData(optSet, __DATA, __SAISON);
            }

            optSet.setOpt('vereine', __VEREINE, false);
            optSet.setOpt('laender', __LAENDER, false);
        }

        return true;
    });

// Verarbeitet Ansicht "Ligatabelle"
const procTabelle = new PageManager("Ligatabelle", __TEAMCLASS, () => {
        return {
                'menuAnchor' : getElement('DIV'),
                'hideForm'   : {
                                   'Prunde'        : true,
                                   'OSCrunde'      : true,
                                   'OSErunde'      : true,
                                   'PrundenNr'     : true,
                                   'OSCrundenNr'   : true,
                                   'OSErundenNr'   : true
                               },
                'formWidth'  : 1
            };
    }, async optSet => {
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

        const __TABLEMAN = new TableManager(optSet, __COLUMNINDEX, getRows('TABLE#kader1.sortable'), __ROWOFFSETUPPER, __ROWOFFSETLOWER);

        const __SAISON = __TABLEMAN.saison;
        const __LAND = __TABLEMAN.land;
        const __EINFAERBUNG = optSet.getOptValue('zeigeQuali', true);
        const __SHOWTITLES = optSet.getOptValue('zeigeTitel', true);
        const __SHOWCURRTITLES = optSet.getOptValue('zeigeAktuelleTitel', true);
        const __SHOWQUALITITLES = optSet.getOptValue('zeigeQualiTitel', true);
        const __VEREINE = optSet.getOptValue('vereine', []);
        const __LAENDER = optSet.getOptValue('laender', []);
        //const __MANAGER = optSet.getOptValue('manager', []);
        const __LIGEN = optSet.getOptValue('ligen', []);
        const __DATA = optSet.getOptValue('data', []);
        const __SDATA = getProp(__DATA, __SAISON, { });
        const __LDATA = getProp(__SDATA, __LAND, { });

        if (optSet.getOptValue('setFPdata', false)) {
            initFairplayData(__DATA, __LAENDER);

            optSet.setOpt('setFPdata', false, false);
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

        optSet.setOpt('vereine', __VEREINE, false);
        optSet.setOpt('laender', __LAENDER, false);
        //optSet.setOpt('manager', __MANAGER, false);
        optSet.setOpt('ligen', __LIGEN, false);

        if (__TABLEMAN.isErsteLiga) {
            calcEuropaPlaetze(__LDATA);

            saveQualiData(optSet, __DATA, __SAISON);

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

            const __LEGENDE = getElement('BR + TABLE'); // #1: Legenden-Tabelle hinter <BR>-Abschnitt, der von der Ligatabelle absetzt
            const __ROWS = (__LEGENDE ? getTags('TR', __LEGENDE) : { });
            const __TABCOLORS = getStyleFromElements(__ROWS, 'backgroundColor', getUpperClassNameFromElement);  // Faerbungen aus Legende ermitteln
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

                    const __LCOLOR = (__LTIT ? __TABCOLORS[__LTIT] : __OSBLAU);
                    const __TCOLOR = ((__TABLEMAN.isCurrSaison && ! __TABLEMAN.isAbschluss) ? __LCOLOR : undefined);

                    __TABLEMAN.addTitel(i, getValue(__LTITSHOWN, __LFILL), ", ", __LCOLOR);
                    __TABLEMAN.addTitel(i, __TIT, ", ", __TCOLOR);
                }
            }
        }

        return true;
    });

// ==================== Ende Page-Manager fuer zu bearbeitende Seiten ====================

// ==================== Spezialbehandlung der Startparameter ====================

// Callback-Funktion fuer die Behandlung der Optionen und Laden des Benutzermenus
// Diese Funktion erledigt nur Modifikationen und kann z.B. einfach optSet zurueckgeben!
// optSet: Platz fuer die gesetzten Optionen
// optParams: Eventuell notwendige Parameter zur Initialisierung (unbenutzt!)
// return Gefuelltes Objekt mit den gesetzten Optionen
function prepareOptions(optSet, optParams) {
    UNUSED(optParams);

    // Werte aus der HTML-Seite ermitteln...
    const __LIGA = getSelection('ligaauswahl');
    const __LAND = getSelection('landauswahl');
    const __TABTYP = getSelection('tabauswahl');
    const __PRUNDE = getSelection('stauswahl');
    const __OSCRUNDE = getSelection('runde');
    const __OSERUNDE = getSelection('runde');
    const __DEFSAISON = optSet.getOptValue('aktuelleSaison');
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
    setOptByName(optSet, 'liga', __LIGA, false);
    setOptByName(optSet, 'land', __LAND, false);
    setOptByName(optSet, 'tabTyp', __TABTYP, false);
    setOptByName(optSet, 'Prunde', __PRUNDE, false);
    setOptByName(optSet, 'OSCrunde', __OSCRUNDE, false);
    setOptByName(optSet, 'OSErunde', __OSERUNDE, false);
    setOptByName(optSet, 'aktuelleSaison', __CURRSAISON, false);
    setOptByName(optSet, 'saison', __SAISON, false);
    setOptByName(optSet, 'ligaNr', __LIGANR, false);
    setOptByName(optSet, 'landNr', __LANDNR, false);
    setOptByName(optSet, 'tabTypNr', __TABTYPNR, false);
    setOptByName(optSet, 'PrundenNr', __PRUNDNR, false);
    setOptByName(optSet, 'OSCrundenNr', __OSCRUNDNR, false);
    setOptByName(optSet, 'OSErundenNr', __OSERUNDNR, false);

    return optSet;
}

// ==================== Ende Spezialbehandlung der Startparameter ====================

// ==================== Hauptprogramm ====================

// Konfiguration der Callback-Funktionen zum Hauptprogramm...
const __MAINCONFIG = {
                        prepareOpt  : prepareOptions
                    };

// Selektor fuer den richtigen PageManager...
const __LEAFS = {
                    'haupt.php' : 0,    // Ansicht "Haupt" (Managerbuero)
                    'lp.php'    : 1,    // Ansicht "Landespokale" (Pokalfinale)
                    'lt.php'    : 2,    // Ansicht "Ligatabelle" (Gesamttabelle)
                    'oscfr.php' : 3,    // Ansicht "OS Championscup FR" (OSC-Finale)
                    'ose.php'   : 4,    // Ansicht "OS Europacup" (OSE-Finale)
                    'fpt.php'   : 5     // Ansicht "Fairplaytabelle"
                };

// URL-Legende:
// page=0: Managerbuero
// page=1: Landespokale
// page=2: Ligatabelle
// page=3: OS Championscup FR (OSC-Finale)
// page=4: OS Europacup (OSE-Finale)
// page=5: Fairplaytabelle
const __MAIN = new Main(__OPTCONFIG, __MAINCONFIG,
                        procHaupt, procPokal.clone(7), procTabelle,
                        procEuropa.clone('OSC', 9),
                        procEuropa.clone('OSE', 8), procFairplay);

__MAIN.run(getPageIdFromURL, __LEAFS);

// ==================== Ende Hauptprogramm ====================

// *** EOF ***
