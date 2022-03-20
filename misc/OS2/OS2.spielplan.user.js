// ==UserScript==
// @name         OS2.spielplan
// @namespace    http://os.ongapo.com/
// @version      0.73+lib
// @copyright    2013+
// @author       Sven Loges (SLC)
// @description  Spielplan-Abschnitt aus dem Master-Script fuer Online Soccer 2.0
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/(st|showteam)\.php\?s=6(&\w+=?[+\w]+)*(#\w+)?$/
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
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.calc.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.team.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.page.team.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.page.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.zat.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Konfigurations-Abschnitt fuer Optionen ====================

const __LOGLEVEL = 4;

// Moegliche Optionen (hier die Standardwerte editieren oder ueber das Benutzermenu setzen):
const __OPTCONFIG = {
    'longStats' : {       // Detailliertere Ausgabe des Stands
                   'Name'      : "longStats",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Lange Stats",
                   'Hotkey'    : 'L',
                   'AltLabel'  : "Kurze Stats",
                   'AltHotkey' : 'K',
                   'FormLabel' : "Lange Stats"
               },
    'showStats' : {       // Ergebnisse aufaddieren und Stand anzeigen
                   'Name'      : "showStats",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Stats ein",
                   'Hotkey'    : 'S',
                   'AltLabel'  : "Stats aus",
                   'AltHotkey' : 'S',
                   'FormLabel' : "Statistik"
               },
    'shortKom' : {        // "Vorbericht(e) & Kommentar(e)" nicht ausschreiben
                   'Name'      : "shortKom",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Kurze Texte",
                   'Hotkey'    : 'T',
                   'AltLabel'  : "Lange Texte",
                   'AltHotkey' : 'T',
                   'FormLabel' : "Abk\u00FCrzungen"
               },
    'sepMonths' : {       // Im Spielplan Trennstriche zwischen den Monaten
                   'Name'      : "sepMonths",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Monate trennen",
                   'Hotkey'    : 'M',
                   'AltLabel'  : "Keine Monate",
                   'AltHotkey' : 'M',
                   'FormLabel' : "Monate trennen"
               },
    'sepStyle' : {        // Stil der Trennlinie
                   'Name'      : "sepStyle",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'Choice'    : [ 'solid', 'hidden', 'dotted', 'dashed', 'double', 'groove', 'ridge',
                                   'inset', 'outset', 'none' ],
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Stil: $",
                   'Hotkey'    : 'i',
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
    'liga' : {            // Name der Liga
                   'Name'      : "liga",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'String',
                   'FreeValue' : true,
                   'Hidden'    : true
               },
    'land' : {            // Name des Landes
                   'Name'      : "land",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'String',
                   'FreeValue' : true,
                   'Hidden'    : true
               },
    'tabTyp' : {          // Name des Anzeigetyps der Tabelle
                   'Name'      : "tabTyp",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'String',
                   'FreeValue' : true,
                   'Hidden'    : true
               },
    'Prunde' : {          // Name der Pokalrunde
                   'Name'      : "Prunde",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'String',
                   'FreeValue' : true,
                   'Hidden'    : true
               },
    'OSCrunde' : {        // Name der OSC-Runde
                   'Name'      : "OSCrunde",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'String',
                   'FreeValue' : true,
                   'Hidden'    : true
               },
    'OSErunde' : {        // Name der OSE-Runde
                   'Name'      : "OSErunde",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'String',
                   'FreeValue' : true,
                   'Hidden'    : true
               },
    'aktuelleSaison' : {  // Laufende Saison
                   'Name'      : "aktuelleSaison",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : true,
                   'SelValue'  : false,
                   'Choice'    : [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 ],
                   'Default'   : 18,
                   'Hidden'    : true
               },
    'saison' : {          // Angezeigte Saison
                   'Name'      : "saison",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : true,
                   'SelValue'  : false,
                   'Choice'    : [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 ],
                   'Default'   : 18,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Saison: $",
                   'Hotkey'    : 's',
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
    'team' : {            // Datenspeicher fuer Daten des Erst- bzw. Zweitteams
                   'Name'      : "team",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'Permanent' : true,
                   'Default'   : undefined,  // new Team() // { 'Team' : undefined, 'Liga' : undefined, 'Land' : undefined, 'TmNr' : 0, 'LdNr' : 0, 'LgNr' : 0 }
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 6,
                   'Replace'   : null,
                   'Space'     : 1,
                   'Label'     : "Verein:"
               },
    'ligaNr' : {          // Rang der Liga
                   'Name'      : "ligaNr",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : false,
                   'SelValue'  : false,
                   'Choice'    : [ 0, 1, 2, 3, 4, 5, 6, 7 ],
                   'Default'   : 0,
                   'Hidden'    : true
               },
    'landNr' : {          // ID des Landes
                   'Name'      : "landNr",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'Number',
                   'FreeValue' : false,
                   'SelValue'  : false,
                   'Choice'    : Object.keys(__LAENDER),
                   'Default'   : 0,
                   'Hidden'    : true
               },
    'tabTypNr' : {        // Anzeigetyp der Tabelle
                   'Name'      : "tabTypNr",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'Number',
                   'FreeValue' : true,
                   'Hidden'    : true
               },
    'PrundenNr' : {       // Pokalrundennummer
                   'Name'      : "PrundenNr",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : false,
                   'SelValue'  : false,
                   'Choice'    : [ 0, 1, 2, 3, 4, 5, 6, 7 ],
                   'Default'   : 0,
                   'Hidden'    : true
               },
    'OSCrundenNr' : {     // OSC-Rundennummer
                   'Name'      : "OSCrundenNr",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : false,
                   'SelValue'  : false,
                   'Choice'    : [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
                   'Default'   : 0,
                   'Hidden'    : true
               },
    'OSErundenNr' : {     // OSE-Rundennummer
                   'Name'      : "OSErundenNr",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : false,
                   'SelValue'  : false,
                   'Choice'    : [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ],
                   'Default'   : 0,
                   'Hidden'    : true
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

// ==================== Spezialisierter Abschnitt fuer Optionen ====================

// Logging initialisieren mit Loglevel (siehe ganz oben im Konfigurationsabschnitt)...
__LOG.init(window, __LOGLEVEL);

// Teamparameter fuer getrennte Speicherung der Optionen fuer Erst- und Zweitteam...
const __TEAMCLASS = new TeamClassification();

// Optionen mit Daten, die ZAT- und Team-bezogen gemerkt werden...
__TEAMCLASS.optSelect = {
        'ligaSize'   : true
    };

// ==================== Ende Abschnitt fuer Optionen ====================

// ==================== Page-Manager fuer zu bearbeitende Seiten ====================

// Verarbeitet Ansicht "Saisonplan"
const procSpielplan = new PageManager("Spielplan", __TEAMCLASS, () => {
        const __TEAMPARAMS = getTeamParamsFromTable(__TEAMSEARCHTEAM, __TEAMIDSEARCHTEAM);

        const __ROWOFFSETUPPER = 1;     // Header-Zeile
        const __COLUMNINDEX = {
                'ZAT' : 0,
                'Art' : 1,
                'Geg' : 2,
                'Erg' : 3,
                'Ber' : 4,
                'Zus' : 5,
                'Kom' : 6
            };

        // Fuer den Handler unten merken...
        this.__ROWOFFSETUPPER = __ROWOFFSETUPPER;
        this.__COLUMNINDEX = __COLUMNINDEX;

        return {
                'Tab'         : getElement('form+table'),  // #2: Tabelle direkt hinter der Saisonauswahl
                'Zei'         : __ROWOFFSETUPPER,
                'Spa'         : __COLUMNINDEX.Art,
                'teamParams'  : __TEAMPARAMS,
                'menuAnchor'  : getElement('div'),
                'hideForm'    : {
                                    'team'  : true
                                },
                'formWidth'   : 3,
                'formBreak'   : 4
            };
    }, async optSet => {
        const __COLUMNINDEX     = this.__COLUMNINDEX;       // von oben!
        const __ROWOFFSETUPPER  = this.__ROWOFFSETUPPER;    // von oben!
        const __ROWOFFSETLOWER  = 0;
        const __CLASSFREI       = 'DMI';    // magenta

        // Format der Trennlinie zwischen den Monaten...
        const __BORDERSTRING = optSet.getOptValue('sepStyle') + ' ' + optSet.getOptValue('sepColor') + ' ' + optSet.getOptValue('sepWidth');

        const __ZAT = firstZAT(optSet.getOptValue('saison'), optSet.getOptValue('ligaSize'));

        const __ROWS = getRows('form+table');  // #2: Tabelle direkt hinter der Saisonauswahl

        if (! __ROWS) {
            __LOG[1]("Kein Spielplan vorhanden!");
            return;
        }

        let ligaStats = emptyStats();
        let euroStats = emptyStats();

        for (let i = __ROWOFFSETUPPER; i < __ROWS.length - __ROWOFFSETLOWER; i++) {
            const __CELLS = __ROWS[i].cells;    // Aktuelle Eintraege
            const __ARTCLASS = __CELLS[__COLUMNINDEX.Art].className;

            incZAT(__ZAT);

            setGegnerFromCell(__ZAT, __CELLS[__COLUMNINDEX.Geg]);
            setSpielArtFromCell(__ZAT, __CELLS[__COLUMNINDEX.Art]);
            setErgebnisFromCell(__ZAT, __CELLS[__COLUMNINDEX.Erg]);

            if (optSet.getOptValue('shortKom')) {
                const __CELLKOM = __CELLS[__COLUMNINDEX.Kom];
                const __CELLART = __CELLS[__COLUMNINDEX.Art];

                __CELLKOM.innerHTML = __CELLKOM.innerHTML.replace("Vorbericht(e)", 'V').replace("Kommentar(e)", 'K').replace("&amp;", '/').replace('&', '/');
                __CELLART.innerHTML = __CELLART.innerHTML.replace(": Heim", "(H)").replace(": Ausw\u00E4rts", "(A)").replace(__ZAT.gameType, getGameTypeAlias(__ZAT.gameType));
            }

            __CELLS[__COLUMNINDEX.Erg].className = __ARTCLASS;
            __CELLS[__COLUMNINDEX.Zus].className = __ARTCLASS;

            if (__ZAT.gameType === 'spielfrei') {
                __CELLS[__COLUMNINDEX.ZAT].className = __CLASSFREI;
            }

            if (__CELLS[__COLUMNINDEX.Zus].textContent === "") {
                const __CELLBER = __CELLS[__COLUMNINDEX.Ber];
                let stats = "";

                addBilanzLinkToCell(__CELLBER, __ZAT.gameType, "Bilanz");

                if (optSet.getOptValue('shortKom')) {
                    __CELLBER.innerHTML = __CELLBER.innerHTML.replace("Klick", "(*)").replace("Bilanz", 'V').replace("Vorschau", 'V');
                }

                if (__ZAT.gameType === 'Liga') {
                    if (__ZAT.ZAT < 70) {
                        stats = addResultToStats(ligaStats, optSet.getOptValue('longStats'), __ZAT);
                    }
                } else if ((__ZAT.gameType === 'OSCQ') || (__ZAT.gameType === 'OSEQ') || (__ZAT.gameType === 'OSE')) {
                    if (__ZAT.hinRueck !== 1) {
                        euroStats = emptyStats();
                    }
                    stats = addResultToStats(euroStats, optSet.getOptValue('longStats'), __ZAT);
                } else if (__ZAT.gameType === 'OSC') {
                    if ((__ZAT.hinRueck !== 1) && ((__ZAT.euroRunde >= 9) || ((__ZAT.euroRunde % 3) === 0))) {
                        euroStats = emptyStats();
                    }
                    stats = addResultToStats(euroStats, optSet.getOptValue('longStats'), __ZAT);
                }

                if (optSet.getOptValue('showStats')) {
                    if (stats !== "") {
                        stats = ' ' + stats;
                    }
                } else {
                    stats = "";
                }
                __CELLS[__COLUMNINDEX.Zus].innerHTML = getZatLink(__ZAT, __TEAMCLASS.team, true) + addTableLink(__ZAT, __TEAMCLASS.team, stats, true);
            }

            if (optSet.getOptValue('sepMonths') && (__ZAT.ZAT % __ZAT.anzZATpMonth === 0) && (i < __ROWS.length - __ROWOFFSETLOWER - 1)) {
                Array.from(__CELLS).forEach(cell => {
                        cell.style.borderBottom = __BORDERSTRING;
                    });
/*
                for (let j = 0; j < __CELLS.length; j++) {
                    __CELLS[j].style.borderBottom = __BORDERSTRING;
                }
*/
            }
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
// 'Tab': Tabelle mit dem Spielplan
// 'Zei': Startzeile des Spielplans mit dem ersten ZAT
// 'Spa': Spalte der Tabellenzelle mit der Spielart (z.B. "Liga : Heim")
// 'teamParams': Getrennte Daten-Option wird genutzt, hier: Team() mit 'LdNr'/'LgNr' des Erst- bzw. Zweitteams
// 'menuAnchor': Startpunkt fuer das Optionsmenu auf der Seite
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// 'formWidth': Anzahl der Elemente pro Zeile
// 'formBreak': Elementnummer des ersten Zeilenumbruchs
// return Gefuelltes Objekt mit den gesetzten Optionen
function prepareOptions(optSet, optParams) {
    // Werte aus der HTML-Seite ermitteln...
    const __BOXSAISONS = document.getElementsByTagName('option');
    const __SAISON = getSelectionFromComboBox(__BOXSAISONS, 0, 'Number');
    const __LIGASIZE = (optParams.Tab ? getLigaSizeFromSpielplan(optParams.Tab.rows, optParams.Zei, optParams.Spa, optSet.getOptValue('saison')) : undefined);

    // ... und abspeichern...
    setOpt(optSet.saison, __SAISON, false);
    setOpt(optSet.ligaSize, __LIGASIZE, false);

    return optSet;
}

// Callback-Funktion fuer die Ermittlung des richtigen PageManagers
// page: Die ueber den Selektor ermittelte Seitennummer (hier: nur 6 gueltig)
// return Der zugehoerige PageManager (hier: 0)
function setupManager(page) {
    const __MAIN = this;

    return __MAIN.pageManager[page - 6];
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
                    'showteam.php' : 0, // Teamansicht Hauptfenster
                    'st.php'       : 0  // Teamansicht Popupfenster
                };
const __ITEM = 's';

// URL-Legende:
// s=0: Teamuebersicht
// s=1: Vertragsdaten
// s=2: Einzelwerte
// s=3: Statistik Saison
// s=4: Statistik Gesamt
// s=5: Teaminfo
// s=6: Saisonplan (*) s=6 wird behandelt durch PageManager #0
// s=7: Vereinshistorie
// s=8: Transferhistorie
// s=9: Leihhistorie
// s=10: Saisonhistorie
const __MAIN = new Main(__OPTCONFIG, __MAINCONFIG, procSpielplan);

__MAIN.run(getPageIdFromURL, __LEAFS, __ITEM);

// ==================== Ende Hauptprogramm ====================

// *** EOF ***
