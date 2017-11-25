// ==UserScript==
// @name         OS2.zugabgabe
// @namespace    http://os.ongapo.com/
// @version      0.10+WE+
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

                    // ... und abspeichern...

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

                    // ... und ZAT-bezogene Daten als veraltet markieren
                    await __TEAMCLASS.deleteOptions({
                                                  'datenZat'    : true,
                                                  'oldDatenZat' : true
                                              }).catch(defaultCatch);

                    // Neuen Daten-ZAT speichern...
                    setOpt(__OPTSET.datenZat, __CURRZAT, false);
                }
            }
        });
}

// Verarbeitet Ansicht "Aufstellung"
function procAufstellung() {
    const __ROWOFFSETUPPER = 1;     // Header-Zeile
    const __ROWOFFSETLOWER = 0;

    return buildOptions(__OPTCONFIG, __OPTSET, {
                            'menuAnchor' : getTable(0, 'div'),
                            'formWidth'  : 1
                        });
}

// Verarbeitet Ansicht "Aktionen"
function procAktionen() {
    const __ROWOFFSETUPPER = 1;     // Header-Zeile
    const __ROWOFFSETLOWER = 0;

    return buildOptions(__OPTCONFIG, __OPTSET, {
                            'menuAnchor' : getTable(0, 'div'),
                            'formWidth'  : 1
                        });
}

// Verarbeitet Ansicht "Einstellungen"
function procEinstellungen() {
    const __ROWOFFSETUPPER = 1;     // Header-Zeile
    const __ROWOFFSETLOWER = 0;

    return buildOptions(__OPTCONFIG, __OPTSET, {
                            'menuAnchor' : getTable(0, 'div'),
                            'formWidth'  : 1
                        });
}

(() => {
    (async () => {
        try {
            // Verzweige in unterschiedliche Verarbeitungen je nach aufgerufener Seite:
            switch (getPageIdFromURL(window.location.href, {
                                                               'haupt.php'     : -1,  // Ansicht "Haupt" (Managerbuero)
                                                               'zugabgabe.php' :  0   // Ansicht "Zugabgabe"
                                                           }, 'p')) {
                case -1 : await procHaupt().catch(defaultCatch); break;
                case  0 : await procAufstellung().catch(defaultCatch); break;
                case  1 : await procAktionen().catch(defaultCatch); break;
                case  2 : await procEinstellungen().catch(defaultCatch); break;
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
