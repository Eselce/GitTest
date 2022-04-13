// ==UserScript==
// @name         OS2.osec.starter
// @namespace    http://os.ongapo.com/
// @version      0.10+lib
// @copyright    2022+
// @author       Sven Loges (SLC)
// @description  Script zu den internationalen Teilnehmern bzw. Startern fuer Online Soccer 2.0
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/haupt\.php(\?changetosecond=\w+(&\w+=?[+\w]+)*)?(#\w+)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/(osneu/)?intTeilnehmer(\?\w+=?[+\w]+(&\w+=?[+\w]+)*)?(#\w+)?$/
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.registerMenuCommand
// @grant        GM.addStyle
// @grant        GM.info
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
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

// ==================== Ende Abschnitt fuer Optionen ====================

// ==================== Page-Manager fuer zu bearbeitende Seiten ====================

// Verarbeitet Ansicht "Haupt" (Managerbuero) zur Ermittlung des aktuellen ZATs
const procHaupt = new PageManager("Haupt (Managerb\u00FCro)", null, () => {
        return {
//                'menuAnchor' : getElement('div'),
                'hideMenu'   : true,
                'showForm'   : {
                                   'saison'               : true,
                                   'aktuellerZat'         : true,
                                   'showForm'             : true
                               }
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

                    // Neuen Daten-ZAT speichern...
                    optSet.setOpt('datenZat', __CURRZAT, false);
                }
            }

            return true;
        });

// Verarbeitet Ansicht "Internationale Teilnehmer"
const procIntTeilnehmer = new PageManager("Internationale Teilnehmer", null, () => {
        const __COLUMNINDEX = {
                'Sai' : 0,
                'Lig' : 1,
                'Tab' : 2,
                'Pok' : 3,
                'OSE' : 4,
                'OSC' : 5
            };

        // Fuer den Handler unten merken...
        this.__COLUMNINDEX = __COLUMNINDEX;

        return {
                'header'      : getElements('h2'),              // 4x <h2> fuer 4 Ueberschriften ('OSC', 'OSCQ', 'OSE', 'OSEQ')
                'listen'      : getElements('.int_teilnehmer'), // 4x <ul> fuer 4 Starterlisten
                'tabAnchor'   : getElement('h1'),               // Neue Tabelle unter der Ueberschrift
                'menuAnchor'  : getElements('.int_teilnehmer')[3],
                'hideForm'    : false,
                'formWidth'   : 3,
                'formBreak'   : 4
            };
    }, async function(optSet) {
        // Stil fuer rausgeflogene Teams definieren...
        GM.addStyle(".raus { color: #ff0000 } table#intstarter tr.raus a { color: #ff3333 }");

        // Format der Trennlinie zwischen den Eintraegen...
        const __BORDERSTRING = optSet.getOptValue('sepStyle') + ' ' + optSet.getOptValue('sepColor') + ' ' + optSet.getOptValue('sepWidth');

        const __OPTPARAMS = this.optParams;
        const __HEADER = __OPTPARAMS.header;
        const __LISTEN = __OPTPARAMS.listen;
        const __TABANCHOR = __OPTPARAMS.tabAnchor;
        const __MAXLIGALEN = "2. Liga A".length;  // Maximale Laenge der Ligabezeichnung
        let count = 0;
        let rausCount = 0;

        const __CUPS = Array.from(__HEADER).map(element => element.textContent);
        const __TEAMLISTS = Array.from(__LISTEN).map((list, indexList) =>
                    Array.from(getElements('li', list)).map(entry => {
                                const __ITEMS = getElements('a,div', entry);
                                const __CUP = __CUPS[indexList];  // passende Ueberschrift (Wettbewerb)
                                const [ __TEAMNAME, __OSID ] = getLinkData(__ITEMS[1], 'c');
                                const [ __MANAGER, __PMID ] = getLinkData(__ITEMS[2], 'receiver_id');
                                const __VEREINSTR = getTeamLink(__TEAMNAME, __OSID);
                                const __MANAGERSTR = getManagerLink(__MANAGER, __PMID);
                                const [ __LIGALAND, __RUNDE ] = __ITEMS[3].textContent.split(" - ", 2);
                                const __INDEXLIGALAND = __LIGALAND.lastIndexOf(' ', __MAXLIGALEN);
                                const __LIGA = __LIGALAND.substring(0, __INDEXLIGALAND);
                                const __LAND = __LIGALAND.substring(__INDEXLIGALAND + 1);
                                const __TLA = getLandTLA(__LAND);
                                const __FLAGSTR = getImgLink('images/flaggen/' + __TLA + '.gif', __TLA);
                                const [ __SKILLSTR, __OPTISTR ] = __ITEMS[4].textContent.split(" - ", 2);
                                const __SKILL = Number.parseFloat(__SKILLSTR.split(": ")[1]);
                                const __OPTI = Number.parseFloat(__OPTISTR.split(": ")[1]);
                                const __SAISON = optSet.getOptValue('saison');
                                const __CURRZAT = optSet.getOptValue('aktuellerZat');
                                const __LIGASIZE = getLigaSizeByTLA(__TLA);
                                const __VEREIN = new Verein(__TEAMNAME, __LAND, __LIGA, __OSID, __MANAGER);
                                const __ZAT = firstZAT(__SAISON, __LIGASIZE);

                                __ZAT.gameType = "Liga";

                                const __LIGASTR = addTableLink(__ZAT, __VEREIN, __LIGA, true)
                                const [ __INTZAT, __INTEVT, __INTLNK ] = calcZATEventByCupRunde(__CUP, __RUNDE, __CURRZAT);

                                incZAT(__ZAT, __INTZAT);
                                __ZAT.gameType = __CUP;

                                const __ZATLINK = getZatLink(__ZAT, __VEREIN, true);
                                const __RAUS = (__ZAT.ZAT <= __CURRZAT);

                                return {
                                        'lfd'         : (__RAUS ? --rausCount : ++count),
                                        'raus'        : __RAUS,
                                        'cup'         : __CUP,
                                        'id'          : __OSID,
                                        'verein'      : __TEAMNAME,
                                        'vereinStr'   : __VEREINSTR,
                                        'pmId'        : __PMID,
                                        'manager'     : __MANAGER,
                                        'managerStr'  : __MANAGERSTR,
                                        'liga'        : __LIGA,
                                        'ligaStr'     : __LIGASTR,
                                        'ligaNr'      : getLigaNr(__LIGA),
                                        'land'        : __LAND,
                                        'landNr'      : getLandNr(__LAND),
                                        'landTLA'     : __TLA,
                                        'flagStr'     : __FLAGSTR,
                                        'runde'       : __RUNDE,
                                        'rundeStr'    : __ZATLINK,
                                        'rundeLnk'    : __INTLNK,
                                        'rundeEvt'    : __INTEVT,
                                        'rundeZAT'    : __INTZAT,
                                        'skill'       : __SKILL.toFixed(2),
                                        'opti'        : __OPTI.toFixed(2)
                                    };
                            })
                );

        if (! __CUPS) {
            __LOG[1]("Keine Teilnehmerliste vorhanden!");
            return;
        }

        const __ITEMS = [ 'id', 'lfd', 'landNr', 'cup', 'rundeZAT', 'rundeStr', 'flagStr', 'vereinStr', 'land', 'managerStr', 'ligaStr', 'ligaNr', 'skill', 'opti' ];
        const __HEADS = [ 'ID', '#', 'Land', 'Cup', 'ZAT', 'Runde', 'Flagge', 'Verein', 'Land', 'Manager', 'Liga', 'Liga', 'Skill', 'Opti' ];
        const __ALIGN = 'center';
        const __TABLE = document.createElement('table');
        const __TBODY = document.createElement('tbody');

        __TABLE.id = 'intstarter';
        //__TABLE.border = 1;
        __TABLE.cellpadding = 10;
        __TABLE.style.borderCollapse = 'collapse';
        __TABLE.style.borderColor = '#aaaaaa';
        __TABLE.classList.add('sortable');

        const __THR = document.createElement('tr');

        __HEADS.forEach(head => {
                const __TH = document.createElement('th');

                __TH.textContent = head;
                __TH.style.borderBottom = __BORDERSTRING;

                __THR.appendChild(__TH);
            });

        __TBODY.appendChild(__THR);

        __TEAMLISTS.forEach((list, indexList) => {
                const __CLASS = __CUPS[indexList].toLowerCase();  // passende Style-Class zum Wettbewerb

                list.forEach((entry, indexEntry) => {
                        const __TR = document.createElement('tr');
                        const __BORDERTOP = (indexEntry === 0);
                        const __RAUS = entry.raus;

                        if (__RAUS) {
                            __TR.classList.add('raus');
                        }

                        __ITEMS.forEach(item => {
                                const __TD = document.createElement('td');

                                __TD.innerHTML = entry[item];
                                __TD.align = __ALIGN;
                                if (__BORDERTOP) {
                                    __TD.style.borderTop = __BORDERSTRING;
                                }

                                __TR.appendChild(__TD);
                            });

                        __TR.classList.add(__CLASS);

                        __TBODY.appendChild(__TR);

                        __LOG[7](entry.id, entry.lfd, entry.landNr, entry.pmID, entry.cup,
                                entry.runde, entry.rundeEvt, entry.rundeZAT, entry.rundeLnk,
                                entry.landTLA, entry.verein, entry.land, entry.manager,
                                entry.liga, entry.ligaNr, entry.skill, entry.opti);
                    });
            });

        __TABLE.appendChild(__TBODY);

        insertAfter(__TABLE, __TABANCHOR);

        return true;
    });

// ==================== Ende Page-Manager fuer zu bearbeitende Seiten ====================

// ==================== Hauptprogramm ====================

// Selektor (Seite bzw. Parameter) fuer den richtigen PageManager...
const __LEAFS = {
                    'haupt.php'     : 0, // Ansicht "Haupt" (Managerbuero)
                    'intTeilnehmer' : 1  // Teamansicht "Internationale Teilnehmer"
                };

// URL-Legende:
// 0: Managerbuero
// 1: Internationale Teilnehmer
const __MAIN = new Main(__OPTCONFIG, null, procHaupt, procIntTeilnehmer);

__MAIN.run(getPageIdFromURL, __LEAFS);

// ==================== Ende Hauptprogramm ====================

// *** EOF ***
