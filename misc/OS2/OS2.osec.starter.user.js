// ==UserScript==
// @name         OS2.osec.starter
// @namespace    http://os.ongapo.com/
// @version      0.10+lib
// @copyright    2022+
// @author       Sven Loges (SLC)
// @description  Script zu den internationalen Teilnehmern bzw. Startern fuer Online Soccer 2.0
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/(osneu/)?intTeilnehmer(\?\w+=?[+\w]+(&\w+=?[+\w]+)*)?(#\w+)?$/
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

function insertAfter(element, anchor) {
    anchor.parentNode.insertBefore(element, anchor.nextSibling);
}

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
        // Format der Trennlinie zwischen den Eintraegen...
        const __BORDERSTRING = optSet.getOptValue('sepStyle') + ' ' + optSet.getOptValue('sepColor') + ' ' + optSet.getOptValue('sepWidth');

        const __OPTPARAMS = this.optParams;
        const __HEADER = __OPTPARAMS.header;
        const __LISTEN = __OPTPARAMS.listen;
        const __TABANCHOR = __OPTPARAMS.tabAnchor;
        const __MAXLIGALEN = "2. Liga A".length;  // Maximale Laenge der Ligabezeichnung
        let count = 0;

        const __CUPS = Array.from(__HEADER).map(element => element.textContent);
        const __TEAMLISTS = Array.from(__LISTEN).map((list, indexList) =>
                    Array.from(getElements('li', list)).map(entry => {
                                const __ITEMS = getElements('a,div', entry);
                                const __CUP = __CUPS[indexList];  // passende Ueberschrift (Wettbewerb)
                                const __LINK = __ITEMS[1].href;
                                const __ID = __LINK.substring(__LINK.lastIndexOf('=') + 1);
                                const __VEREIN = __ITEMS[1].textContent;
                                const __MANAGER = __ITEMS[2].textContent;
                                const [ __LIGALAND, __RUNDE ] = __ITEMS[3].textContent.split(" - ", 2);
                                const __INDEXLIGALAND = __LIGALAND.lastIndexOf(' ', __MAXLIGALEN);
                                const __LIGA = __LIGALAND.substring(0, __INDEXLIGALAND);
                                const __LAND = __LIGALAND.substring(__INDEXLIGALAND + 1);
                                const __TLA = getLandTLA(__LAND);
                                const __FLAG = '<abbr title="' + __TLA + '"><img src="images/flaggen/' + __TLA + '.gif" />';
                                const [ __SKILLSTR, __OPTISTR ] = __ITEMS[4].textContent.split(" - ", 2);
                                const __SKILL = Number.parseFloat(__SKILLSTR.split(": ")[1]);
                                const __OPTI = Number.parseFloat(__OPTISTR.split(": ")[1]);

                                return {
                                        'lfd'       : ++count,
                                        'cup'       : __CUP,
                                        'id'        : __ID,
                                        'verein'    : __VEREIN,
                                        'manager'   : __MANAGER,
                                        'liga'      : __LIGA,
                                        'ligaNr'    : getLigaNr(__LIGA),
                                        'land'      : __LAND,
                                        'landNr'    : getLandNr(__LAND),
                                        'landTLA'   : __TLA,
                                        'flag'      : __FLAG,
                                        'runde'     : __RUNDE,
                                        'skill'     : __SKILL.toFixed(2),
                                        'opti'      : __OPTI.toFixed(2)
                                    };
                            })
                );

        if (! __CUPS) {
            __LOG[1]("Keine Teilnehmerliste vorhanden!");
            return;
        }

        const __ITEMS = [ 'id', 'lfd', 'landNr', 'cup', 'runde', 'flag', 'verein', 'land', 'manager', 'liga', 'ligaNr', 'skill', 'opti' ];
        const __HEADS = [ 'ID', '#', 'Land', 'Cup', 'Runde', 'Flagge', 'Verein', 'Land', 'Manager', 'Liga', 'Liga', 'Skill', 'Opti' ];
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

                        __LOG[7](entry.id, entry.lfd, entry.landNr, entry.cup, entry.runde, entry.landTLA, entry.verein, entry.land, entry.manager, entry.liga, entry.ligaNr, entry.skill, entry.opti);
                    });
            });

        __TABLE.appendChild(__TBODY);

        insertAfter(__TABLE, __TABANCHOR);

        return true;
    });

// ==================== Ende Page-Manager fuer zu bearbeitende Seiten ====================

// ==================== Hauptprogramm ====================

// Selektor (Seite bzw. Parameter) fuer den richtigen PageManager (hier eigentlich ueberfluessig)...
const __LEAFS = {
                    'intTeilnehmer' : 0  // Teamansicht "Internationale Teilnehmer"
                };

// URL-Legende:
// 0: Internationale Teilnehmer
const __MAIN = new Main(__OPTCONFIG, null, procIntTeilnehmer);

__MAIN.run(getPageIdFromURL, __LEAFS);

// ==================== Ende Hauptprogramm ====================

// *** EOF ***
