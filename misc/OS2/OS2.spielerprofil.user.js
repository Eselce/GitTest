// ==UserScript==
// @name         OS2.spielerprofil
// @namespace    http://os.ongapo.com/
// @version      0.40+lib
// @copyright    2016+
// @author       Michael Bertram / Andreas Eckes (Strindheim BK) / Sven Loges (SLC)
// @description  Alter exakt / Summe der trainierbaren Skills / Talent (trainierbare Skills mit Alter 19.00 bei unterstelltem 17er-Trainer seitdem)
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/haupt\.php(\?changetosecond=\w+(&\w+=?[+\w]+)*)?(#\w+)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/sp\.php(\?\w+=?[+\w]+(&\w+=?[+\w]+)*)?(#\w+)?$/
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
                   'Default'   : 18,
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
                   'Default'   : undefined,  // new Team() // { 'Team' : undefined, 'Liga' : undefined, 'Land' : undefined, 'TmNr' : 0, 'LdNr' : 0, 'LgNr' : 0 }
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 6,
                   'Replace'   : null,
                   'Space'     : 1,
                   'Label'     : "Verein:"
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
__TEAMCLASS.optSelect = {
                            'datenZat'     : true,
                            'oldDatenZat'  : true
                        };

// ==================== Ende Abschnitt fuer Optionen ====================

//==================== Anzeige Spieler-Profil ====================

function showSpieler(currZAT) {
    const __TABLE1 = getElement('div#a table')  // #0: Erste Tabelle auf dem Reiter '#a' - neben dem Bild
    const __ROWS1 = __TABLE1.rows;
    const __ROWS2 = getRows('table+table')      // #1: Angrenzende Tabelle auf dem Reiter '#a' - Skills

    const __ZAT = currZAT
    const __SKILLS = [];
    const __COLOR = "";
    const __ALIGN = 'right';
    const __CLASS = 'stat';
    const __AGE = getNumber(__ROWS1[0].cells[5].textContent);
    const __GEB = getNumber(__ROWS1[1].cells[4].textContent);
    const __DEZALTER = getDezAlter(__AGE, __GEB, __ZAT);

    // Skills auslesen...
    for (let i = 1, count = 0; i < 7; i++) {
        for (let j = 0; (j < 3) && (count < 17); j++) {
            const __TEXT = __ROWS2[i].cells[2 * j].textContent;

            __SKILLS[count++] = getNumber(__TEXT.substring(__TEXT.length - 2, __TEXT.length));
        }
    }

    const [ __TRAINIERT, __POTENTIAL ] = calcPotential(__DEZALTER, __SKILLS);

    // Zusaetzliche Werte ausgeben...
    appendCell(__ROWS1[3], "trainiert :", __COLOR, __ALIGN).classList.add(__CLASS);
    appendCell(__ROWS1[3], __TRAINIERT, __COLOR, __ALIGN).classList.add(__CLASS);

    const __NEWROW = __TABLE1.insertRow(4);  // neue Zeile an 4. Stelle einfuegen
    inflateRow(__NEWROW, 4);
    appendCell(__NEWROW, "Potential :", __COLOR, __ALIGN).classList.add(__CLASS);
    appendCell(__NEWROW, __POTENTIAL.toFixed(0), __COLOR, __ALIGN).classList.add(__CLASS);
    inflateRow(__NEWROW);
    appendCell(__NEWROW, "ZAT :", __COLOR, __ALIGN).classList.add(__CLASS);
    appendCell(__NEWROW, __ZAT, __COLOR, __ALIGN).classList.add(__CLASS);

    // Ganzzahliges Alter ersetzen durch Dezimalbruch...
    __ROWS1[0].cells[5].textContent = __DEZALTER.toFixed(2);

    //window.resizeTo(900, 700);  // bringt nichts wegen der Reiter

    return true;
}

//==================== Ende Anzeige Spieler-Profil ====================

// ==================== Page-Manager fuer zu bearbeitende Seiten ====================

// Verarbeitet Ansicht "Haupt" (Managerbuero) zur Ermittlung des aktuellen ZATs
const procHaupt = new PageManager("Haupt (Managerb\u00FCro)", __TEAMCLASS, () => {
        const __TEAMPARAMS = getTeamParamsFromTable(__TEAMSEARCHHAUPT, __TEAMIDSEARCHHAUPT);

        return {
                'teamParams' : __TEAMPARAMS,
                'hideMenu'   : true
            };
    }, async optSet => {
        //const __ZATCELL = getProp(getProp(getRows(), 2), 'cells', { })[0];
        const __ZATCELL = getElement('td[style] b');  // #2,0: Der erste farbige Fetteintrag ('<td style="color:orange"><b>')
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

                // ... und ZAT-bezogene Daten als veraltet markieren
                await __TEAMCLASS.deleteOptions({
                                              'datenZat'    : true,
                                              'oldDatenZat' : true
                                          }).catch(defaultCatch);

                // Neuen Daten-ZAT speichern...
                optSet.setOpt('datenZat', __CURRZAT, false);
            }
        }

        return true;
    });

// Verarbeitet Ansicht "Spielerprofil"
const procSpieler = new PageManager("Spielerprofil", __TEAMCLASS, () => {
        if (getRows('div div#a table') === undefined) {  // #0: Erste Tabelle auf erstem Reiter
            __LOG[2]("Diese Seite ist ohne Team nicht verf\u00FCgbar!");
        } else {
            return {
                    'menuAnchor' : getElement('div'),  // #0: Aeusseres <div> auf erstem Reiter
                    'showForm'   : {
                                       'sepStyle'           : true,
                                       'sepColor'           : true,
                                       'sepWidth'           : true,
                                       'saison'             : true,
                                       'aktuellerZat'       : true,
                                       'team'               : true,
                                       'reset'              : true,
                                       'showForm'           : true
                                   },
                    'formWidth'  : 1
                };
        }
    }, async optSet => {
            const __CURRZAT = getOptValue(optSet.datenZat);

            return showSpieler(__CURRZAT);
        });

// ==================== Ende Page-Manager fuer zu bearbeitende Seiten ====================

// ==================== Hauptprogramm ====================

// Selektor fuer den richtigen PageManager...
const __LEAFS = {
                    'haupt.php'      : 0,  // Ansicht "Haupt" (Managerbuero)
                    'sp.php'         : 1   // Ansicht "Spieler" (Spielerprofil)
                };

// URL-Legende:
// page=0: Managerbuero
// page=1: Spielerprofil
const __MAIN = new Main(__OPTCONFIG, null, procHaupt, procSpieler);

__MAIN.run(getPageIdFromURL, __LEAFS);

// ==================== Ende Hauptprogramm ====================

// *** EOF ***
