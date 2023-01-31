// ==UserScript==
// @name         OS2.kontoauszug
// @namespace    http://os.ongapo.com/
// @version      0.10+lib
// @copyright    2022+
// @author       Sven Loges (SLC)
// @description  Script zum Kontoauszug der Saison fuer Online Soccer 2.0
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/(osneu/)?haupt\.php(\?changetosecond=\w+(&\w+=?[+\w]+)*)?(#\w+)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/(osneu/)?ka\.php(\?\w+=?[+\w]+(&\w+=?[+\w]+)*)?(#\w+)?$/
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
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.zat.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Konfigurations-Abschnitt fuer Optionen ====================

const __LOGLEVEL = 4;

// Moegliche Optionen (hier die Standardwerte editieren oder ueber das Benutzermenu setzen):
const __OPTCONFIG = {
    'ersetzeStand' : {    // Kontostaende vorheriger Saisons rekonstruieren
                   'Name'      : "ersetzeStand",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Alte Ausz\u00FCge ein",
                   'Hotkey'    : 'A',
                   'AltLabel'  : "Alte Ausz\u00FCge aus",
                   'AltHotkey' : 'A',
                   'FormLabel' : "Alte Ausz\u00FCge zeigen"
               },
    'saison' : {          // Ausgewaehlte Saison
                   'Name'      : "saison",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : true,
                   'SelValue'  : false,
                   'Choice'    : [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 ],
                   'Default'   : 19,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Saison: $",
                   'Hotkey'    : 'S',
                   'FormLabel' : "Saison:|$"
               },
    'aktuelleSaison' : {  // Aktuelle Saison
                   'Name'      : "currSaison",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : true,
                   'SelValue'  : false,
                   'Choice'    : [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 ],
                   'Default'   : 19,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Aktuelle Saison: $",
                   'Hotkey'    : 'A',
                   'FormLabel' : "Aktuelle Saison:|$"
               },
    'kontostand' : {      // Datenspeicher fuer Kontostaende aller Saisonenden
                   'Name'      : "balances",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : !true,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 2,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Kontost\u00E4nde:"
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
                   'ValType'   : 'String',
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
        'kontostand'      : true
    };

// ==================== Ende Abschnitt fuer Optionen ====================

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

function getNumberCol(row, colIdx) {
    const __ROW = getValue(row, []);
    const __CELLS = __ROW.cells;
    const __ELEMENT = __CELLS[colIdx];
    const __TEXT = __ELEMENT.textContent;

    return getNumber(__TEXT ? __TEXT : '0');  // Leerzeichen wird zu '0'
}

function setNumberCol(row, colIdx, val) {
    const __ROW = getValue(row, []);
    const __CELLS = __ROW.cells;
    const __ELEMENT = __CELLS[colIdx];
    const __TEXT = String(val);

    __ELEMENT.textContent = getNumberString(__TEXT);

    return __ELEMENT;
}

// Verarbeitet Ansicht "Kontoauszug"
const procKontoauszug = new PageManager("Kontoauszug", __TEAMCLASS, () => {
        return {
                'tabKonto'    : getElement('table'),
                'menuAnchor'  : getElement('table'),
                'selSaison'   : getElement('select[NAME=saison]'),
                'hideForm'    : false,
                'formWidth'   : 3,
                'formBreak'   : 4
            };
    }, async function(optSet) {
        const __COLUMNINDEX = {
                'Dat' : 0,
                'Ein' : 1,
                'Aus' : 2,
                'Lab' : 3,
                'Val' : 4
            };

        const __ERSETZEN = optSet.getOptValue('ersetzeStand');
        const __SAISON = optSet.getOptValue('saison');
        const __CURRSAISON = optSet.getOptValue('aktuelleSaison');
        const __KONTOSTAND = optSet.getOptValue('kontostand');

//      const __OPTPARAMS = this.optParams;
//      const __TABANCHOR = __OPTPARAMS.tabAnchor;
        const __HEADERPATTERN = /^([\w\s]+) - Kontoauszug - Kontostand : (-?[\d.]+) Euro$/;
        const __HEADER = getElement('B > FONT[COLOR]');
        const __HEADERTEXT = getObjValue(__HEADER, 'textContent');
        const __MATCH = getValue(__HEADERTEXT, "").match(__HEADERPATTERN);
        const [ __TEAMNAME, __AKTSTAND ] = (__MATCH ? [ __MATCH[1], getNumber(__MATCH[2]) ] : [ "", 0 ]);

        __KONTOSTAND[__CURRSAISON] = __AKTSTAND;  // Nach dieser Saison waere dies der Startwert!

        const __BUCHUNGEN = getElements('TR[ALIGN=right]');
        const __ENDSTAND = __KONTOSTAND[__SAISON];
        let anfStand = __KONTOSTAND[__SAISON - 1];  // Endstand der vorherigen Saison ist Default fuer Saisonanfang

        if (__SAISON === __CURRSAISON) {  // korrekter Kontoauszug...
            const __ERSTEZEILE = getArrValue(__BUCHUNGEN, __BUCHUNGEN.length - 1);

            if (__ERSTEZEILE) {
                const __EINGANG = getNumberCol(__ERSTEZEILE, __COLUMNINDEX.Ein);
                const __AUSGANG = getNumberCol(__ERSTEZEILE, __COLUMNINDEX.Aus);
                const __STAND = getNumberCol(__ERSTEZEILE, __COLUMNINDEX.Val);

                // Kontostand am Anfang der Saison bestimmen...
                anfStand = __STAND - (__EINGANG + __AUSGANG);  // Ausgang ist negativ!
            }
        } else if (__ENDSTAND !== undefined) {  // reparierbarer Kontoauszug (Folgesaison hat Startwert)...
            const __SUMFUN = ((sum, val) => (sum + val));
            const __EINGAENGE = Arrayfrom(__BUCHUNGEN, buchung => getNumberCol(buchung, __COLUMNINDEX.Ein));
            const __AUSGAENGE = Arrayfrom(__BUCHUNGEN, buchung => getNumberCol(buchung, __COLUMNINDEX.Aus));

            // Kontostand am Anfang der Saison bestimmen...
            anfStand = __ENDSTAND - (__EINGAENGE.reduce(__SUMFUN) + __AUSGAENGE.reduce(__SUMFUN));  // Ausgaenge sind negativ!

            if (__ERSETZEN) {
                // Buchung fuer Buchung aufsummieren und "Nicht möglich" ueberschreiben mit korrektem Kontostand...
                for (let index = __BUCHUNGEN.length - 1, stand = anfStand; index >= 0; index--) {
                    const __BUCHUNG = __BUCHUNGEN[index];
                    const __DIFF = __EINGAENGE[index] + __AUSGAENGE[index];

                    stand += __DIFF;

                    const __ELEMENT = setNumberCol(__BUCHUNG, __COLUMNINDEX.Val, stand);

                    __ELEMENT.className = ((stand < 0) ? 'MINUS' : 'PLUS');  // Rot/gruen einfaerben
                }
            }
        }

        // Ermittelten Anfangsstand als Endstand der letzten Saison eintragen...
        __KONTOSTAND[__SAISON - 1] = anfStand;

        // ... und neue Werte abspeichern...
        setOptByName(optSet, 'kontostand', __KONTOSTAND, false);

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
    const __DEFSAISON = optSet.getOptValue('aktuelleSaison');
    const __SAISON = getSelection('saison', 'Number', getSelectedValue);
    const __SAISONS = getSelectionArray('saison', 'Number', getSelectedValue);
    const __CURRSAISON = (__SAISONS ? Math.max(... __SAISONS) : __DEFSAISON);

    // ... und abspeichern...
    setOptByName(optSet, 'saison', __SAISON, false);
    setOptByName(optSet, 'aktuelleSaison', __CURRSAISON, false);

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
                    'ka.php'    : 1     // Ansicht "Kontoauszug" (unter "Team")
                };

const __MAIN = new Main(__OPTCONFIG, __MAINCONFIG, procHaupt, procKontoauszug);

__MAIN.run(getPageIdFromURL, __LEAFS);

// ==================== Ende Hauptprogramm ====================

// *** EOF ***
