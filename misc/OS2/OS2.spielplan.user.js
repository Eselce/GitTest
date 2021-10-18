// ==UserScript==
// @name         OS2.spielplan
// @namespace    http://os.ongapo.com/
// @version      0.72+lib
// @copyright    2013+
// @author       Sven Loges (SLC)
// @description  Spielplan-Abschnitt aus dem Master-Script fuer Online Soccer 2.0
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/(st|showteam)\.php\?s=6(&\S+)*$/
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
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.list.js
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
                   'FormLabel' : "Abk\xFCrzungen"
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
                   'AltTitle'  : "$V schlie\xDFen",
                   'AltLabel'  : "Optionen verbergen",
                   'AltHotkey' : 'v',
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
        'ligaSize'   : true
    };

// Behandelt die Optionen und laedt das Benutzermenu
// optConfig: Konfiguration der Optionen
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
// return Promise auf gefuelltes Objekt mit den gesetzten Optionen
function buildOptions(optConfig, optSet = undefined, optParams = { 'hideMenu' : false }) {
    // Klassifikation ueber Land und Liga des Teams...
    __TEAMCLASS.optSet = optSet;  // Classification mit optSet verknuepfen
    __TEAMCLASS.teamParams = optParams.teamParams;  // Ermittelte Parameter

    return startOptions(optConfig, optSet, __TEAMCLASS).then(optSet => {
                    // Werte aus der HTML-Seite ermitteln...
                    const __BOXSAISONS = document.getElementsByTagName('option');
                    const __SAISON = getSelectionFromComboBox(__BOXSAISONS, 0, 'Number');
                    const __LIGASIZE = (optParams.Tab ? getLigaSizeFromSpielplan(optParams.Tab.rows, optParams.Zei, optParams.Spa, getOptValue(optSet.saison)) : undefined);

                    // ... und abspeichern...
                    setOpt(optSet.saison, __SAISON, false);
                    setOpt(optSet.ligaSize, __LIGASIZE, false);

                    return showOptions(optSet, optParams);
                }, defaultCatch);
}

// ==================== Ende Abschnitt fuer Optionen ====================

// ==================== Hauptprogramm ====================

// Verarbeitet Ansicht "Saisonplan"
function procSpielplan() {
    const __ROWOFFSETUPPER = 1;     // Header-Zeile
    const __ROWOFFSETLOWER = 0;
    const __CLASSFREI = 'DMI';

    const __COLUMNINDEX = {
        'ZAT' : 0,
        'Art' : 1,
        'Geg' : 2,
        'Erg' : 3,
        'Ber' : 4,
        'Zus' : 5,
        'Kom' : 6
    };

    const __TEAMPARAMS = getTeamParamsFromTable(getTable(1), __TEAMSEARCHTEAM);  // Link mit Team, Liga, Land...

    return buildOptions(__OPTCONFIG, __OPTSET, {
                            'Tab'        : getTable(2),
                            'Zei'        : __ROWOFFSETUPPER,
                            'Spa'        : __COLUMNINDEX.Art,
                            'teamParams' : __TEAMPARAMS,
                            'menuAnchor' : getTable(0, 'div'),
                            'hideForm'   : {
                                               'team'         : true
                                           },
                            'formWidth'  : 3,
                            'formBreak'  : 4
                        }).then(optSet => {
            const __ZAT = firstZAT(getOptValue(__OPTSET.saison), getOptValue(__OPTSET.ligaSize));

            const __ROWS = getRows(2);

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

                if (getOptValue(__OPTSET.shortKom)) {
                    const __CELLKOM = __CELLS[__COLUMNINDEX.Kom];
                    const __CELLART = __CELLS[__COLUMNINDEX.Art];

                    __CELLKOM.innerHTML = __CELLKOM.innerHTML.replace("Vorbericht(e)", 'V').replace("Kommentar(e)", 'K').replace("&amp;", '/').replace('&', '/');
                    __CELLART.innerHTML = __CELLART.innerHTML.replace(": Heim", "(H)").replace(": Ausw\xE4rts", "(A)").replace(__ZAT.gameType, getGameTypeAlias(__ZAT.gameType));
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

                    if (getOptValue(__OPTSET.shortKom)) {
                        __CELLBER.innerHTML = __CELLBER.innerHTML.replace("Klick", "(*)").replace("Bilanz", 'V').replace("Vorschau", 'V');
                    }

                    if (__ZAT.gameType === 'Liga') {
                        if (__ZAT.ZAT < 70) {
                            stats = addResultToStats(ligaStats, getOptValue(__OPTSET.longStats), __ZAT);
                        }
                    } else if ((__ZAT.gameType === 'OSCQ') || (__ZAT.gameType === 'OSEQ') || (__ZAT.gameType === 'OSE')) {
                        if (__ZAT.hinRueck !== 1) {
                            euroStats = emptyStats();
                        }
                        stats = addResultToStats(euroStats, getOptValue(__OPTSET.longStats), __ZAT);
                    } else if (__ZAT.gameType === 'OSC') {
                        if ((__ZAT.hinRueck !== 1) && ((__ZAT.euroRunde >= 9) || ((__ZAT.euroRunde % 3) === 0))) {
                            euroStats = emptyStats();
                        }
                        stats = addResultToStats(euroStats, getOptValue(__OPTSET.longStats), __ZAT);
                    }

                    if (getOptValue(__OPTSET.showStats)) {
                        if (stats !== "") {
                            stats = ' ' + stats;
                        }
                    } else {
                        stats = "";
                    }
                    __CELLS[__COLUMNINDEX.Zus].innerHTML = getZatLink(__ZAT, __TEAMCLASS.team, true) + stats;
                }

                if (getOptValue(__OPTSET.sepMonths) && (__ZAT.ZAT % __ZAT.anzZATpMonth === 0) && (i < __ROWS.length - __ROWOFFSETLOWER - 1)) {
                    // Format der Trennlinie zwischen den Monaten...
                    const __BORDERSTRING = getOptValue(__OPTSET.sepStyle) + ' ' + getOptValue(__OPTSET.sepColor) + ' ' + getOptValue(__OPTSET.sepWidth);

/*
                    for (let entry of __CELLS) {
                        entry.style.borderBottom = __BORDERSTRING;
                    }
*/
                    for (let j = 0; j < __CELLS.length; j++) {
                        __CELLS[j].style.borderBottom = __BORDERSTRING;
                    }
                }
            }
        });
}

(() => {
    (async () => {
        try {
            // URL-Legende:
            // s=0: Teamuebersicht
            // s=1: Vertragsdaten
            // s=2: Einzelwerte
            // s=3: Statistik Saison
            // s=4: Statistik Gesamt
            // s=5: Teaminfo
            // s=6: Saisonplan
            // s=7: Vereinshistorie
            // s=8: Transferhistorie
            // s=9: Leihhistorie

            // Verzweige in unterschiedliche Verarbeitungen je nach Wert von s:
            switch (getPageIdFromURL(window.location.href, {
                                                               'showteam.php' : 0,  // Teamansicht Hauptfenster
                                                               'st.php'       : 0   // Teamansicht Popupfenster
                                                           }, 's')) {
                case 6  : await procSpielplan().catch(defaultCatch); break;
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
