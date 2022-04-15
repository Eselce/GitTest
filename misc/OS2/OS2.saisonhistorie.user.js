// ==UserScript==
// @name         OS2.saisonhistorie
// @namespace    http://os.ongapo.com/
// @version      0.10+lib
// @copyright    2022+
// @author       Sven Loges (SLC)
// @description  Saisonhistorie-Abschnitt aus dem Master-Script fuer Online Soccer 2.0
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/(st|showteam)\.php\?s=10(&\w+=?[+\w]+)*(#\w+)?$/
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
    'showStats' : {       // Alle Titel und Erfolge zusammenfassen
                   'Name'      : "showStats",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Stats ein",
                   'Hotkey'    : 'S',
                   'AltLabel'  : "Stats aus",
                   'AltHotkey' : 'S',
                   'FormLabel' : "Zusammenfassung"
               },
    'longStats' : {       // Europapokal ausfuehrlich
                   'Name'      : "longStats",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Viele Stats",
                   'Hotkey'    : 'V',
                   'AltLabel'  : "Wenige Stats",
                   'AltHotkey' : 'W',
                   'FormLabel' : "Viele Details"
               },
    'shortKom' : {        // "Nicht teilgenommen" weglassen
                   'Name'      : "shortKom",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : true,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Leere Eintr\u00E4ge",
                   'Hotkey'    : 'T',
                   'AltLabel'  : "Nicht teilgenommen",
                   'AltHotkey' : 'T',
                   'FormLabel' : "Leere Eintr\u00E4ge"
               },
    'extraQuali' : {      // Europapokal ausfuehrlich (Quali gesondert ausweisen)
                   'Name'      : "extraQuali",
                   'Type'      : __OPTTYPES.SW,
                   'Default'   : false,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Qualis extra",
                   'Hotkey'    : 'E',
                   'AltLabel'  : "Qualis integriert",
                   'AltHotkey' : 'I',
                   'FormLabel' : "Qualis extra"
               },
    'land' : {            // Name des Landes
                   'Name'      : "land",
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
        'ligaSize'   : true
    };

// ==================== Ende Abschnitt fuer Optionen ====================

// ==================== Abschnitt fuer Klasse SaisonhistorieEntry ====================

// Klasse zum Halten eines Saison-Ergebnisses in der Saison-Historie

/*class*/ function SaisonhistorieEntry /*{
    constructor*/(cells) {
        'use strict';

        //this.cells = cells;  // zugrundeliegende Zeile der Tabelle

        this.parseCells(cells);
    }
//}

Class.define(SaisonhistorieEntry, Object, {
        'parseCells'      : function(cells) {
                                const __COLUMNINDEX = {
                                        'Saison'    : 0,
                                        'Liga'      : 1,
                                        'Tabelle'   : 2,
                                        'Pokal'     : 3,
                                        'OSE'       : 4,
                                        'OSC'       : 5
                                    };

                                const __SAISON  = getIntFromHTML(cells, __COLUMNINDEX.Saison);
                                const __LIGA    = getStringFromHTML(cells, __COLUMNINDEX.Liga);
                                const __TABELLE = getStringFromHTML(cells, __COLUMNINDEX.Tabelle);
                                const __POKAL   = getStringFromHTML(cells, __COLUMNINDEX.Pokal);
                                const __OSE     = getStringFromHTML(cells, __COLUMNINDEX.OSE);
                                const __OSC     = getStringFromHTML(cells, __COLUMNINDEX.OSC);

                                const __LIGANR  = getLigaNr(__LIGA);
                                const __INDEXP  = __TABELLE.indexOf('.');
                                const __PLATZ   = Number.parseInt(__TABELLE.substring(0, __INDEXP), 10);
                                const __MATCHP  = __TABELLE.match(/^\d+\. Platz \((\d+) Punkte\)$/);
                                const __PUNKTE  = (__MATCHP ? Number.parseInt(__MATCHP[1], 10) : 0);
                                const __POKALNR = __RUNDEPOKAL[__POKAL];
                                const __OSENR   = __ALLRNDOSE[__OSE];
                                const __OSCNR   = __ALLRNDOSC[__OSC];

                                this.saison = __SAISON;
                                this.ligaNr = __LIGANR;
                                this.platz = __PLATZ;
                                this.punkte = __PUNKTE;
                                this.pokalNr = __POKALNR;
                                this.OSENr = __OSENR;
                                this.OSCNr = __OSCNR;
                            },
        'isMeister'       : function() {
                                return ((this.ligaNr === 1) && (this.platz === 1));
                            },
        'isVizeMeister'   : function() {
                                return ((this.ligaNr === 1) && (this.platz === 2));
                            },
        'isZweitMeister'  : function() {
                                return (((this.ligaNr === 2) || (this.ligaNr === 3)) && (this.platz === 1));
                            },
        'isDrittMeister'  : function() {
                                return ((this.ligaNr >= 4) && (this.platz === 1));
                            },
        'isPokalsieger'   : function() {
                                return (__POKALRUNDEN[this.pokalNr] === 'Pokalsieger');
                            },
        'isPokalfinale'   : function() {
                                return (__POKALRUNDEN[this.pokalNr] === 'Finale');
                            },
        'isOSEsieger'     : function() {
                                return (__OSEALLRND[this.OSENr] === 'OSE-Sieger');
                            },
        'isOSEfinale'     : function() {
                                return (__OSEALLRND[this.OSENr] === 'Finale');
                            },
        'isOSCsieger'     : function() {
                                return (__OSCALLRND[this.OSCNr] === 'OSC-Sieger');
                            },
        'isOSCfinale'     : function() {
                                return (__OSCALLRND[this.OSCNr] === 'Finale');
                            },
        'valueOf'         : function() {
                                return ('S' + this.saison);
                            },
        'toString'        : function() {
                                return "\nSaison: " + this.saison + "\tLiga #" + this.ligaNr
                                    + "\tPlatz: " + this.platz + "\tPunkte: " + this.punkte
                                    + "\tPokal #" + this.pokalNr + "\tOSE #" + this.OSENr + "\tOSC #" + this.OSCNr;
                            }
    });

// ==================== Ende Abschnitt fuer Klasse SaisonhistorieEntry ====================

// ==================== Page-Manager fuer zu bearbeitende Seiten ====================

// Verarbeitet Ansicht "Saisonhistorie"
const procSaisonhistorie = new PageManager("Saisonhistorie", __TEAMCLASS, () => {
        const __TEAMPARAMS = getTeamParamsFromTable(__TEAMSEARCHTEAM, __TEAMIDSEARCHTEAM);

        const __ROWOFFSETUPPER = 1;     // Header-Zeile
        const __COLUMNINDEX = {
                'Sai' : 0,
                'Lig' : 1,
                'Tab' : 2,
                'Pok' : 3,
                'OSE' : 4,
                'OSC' : 5
            };

        // Fuer den Handler unten merken...
        this.__ROWOFFSETUPPER = __ROWOFFSETUPPER;
        this.__COLUMNINDEX = __COLUMNINDEX;

        return {
                'Tab'         : getElement('table#leihe.sortable'),  // #2: Sortierbare Tabelle, die ID '#leihe' ist bestimmt falsch kopiert!
                'Zei'         : __ROWOFFSETUPPER,
                'Spa'         : __COLUMNINDEX.Sai,
                'teamParams'  : __TEAMPARAMS,
                'menuAnchor'  : getElement('div'),
                'hideForm'    : {
                                    'team'  : true
                                },
                'formWidth'   : 3,
                'formBreak'   : 4
            };
    }, async optSet => {
        //const __ROWOFFSETUPPER  = this.__ROWOFFSETUPPER;    // von oben!
        //const __ROWOFFSETLOWER  = 0;

        const __ROWS = getRows('table#leihe.sortable');  // #2: Sortierbare Tabelle, die ID '#leihe' ist bestimmt falsch kopiert!

        if (! __ROWS) {
            __LOG[1]("Keine Saisonhistorie vorhanden!");
            return;
        }

        // Format der Trennlinie zwischen den Eintraegen...
        const __BORDERSTRING = optSet.getOptValue('sepStyle') + ' ' + optSet.getOptValue('sepColor') + ' ' + optSet.getOptValue('sepWidth');
        const __SHORTKOM = optSet.getOptValue('shortKom');
        const __NOEMPTYCOLUMNS = __SHORTKOM;  // Gemeinsame Aufgabe
        const __SHOWSTATS = optSet.getOptValue('showStats');
        const __LONGSTATS = optSet.getOptValue('longStats');
        //const __EXTRAQUALI = optSet.getOptValue('extraQuali');  // TODO
        const __EMPTYTEXT = 'Nicht teilgenommen';
        const __REPORTS = [];

        if (__SHOWSTATS) {
            const __SHOW = (report => __REPORTS.push(report));
            const __LANG = (__LONGSTATS ? __SHOW : UNUSED);
            const __KURZ = __SHOW;

            // Formatierungen...
            //const __OUTSAISON = (entry => ('S' + entry.saison));
            //const __OUTSAISONLONG = (entry => ("Saison " + entry.saison));
            const __OUTTEILNAHMEN = (anz => ((anz === 1) ? "1 Teilnahme" : (anz + " Teilnahmen")));
            const __OUTERFOLGE = (anz => ((anz === 1) ? "1 Erfolg" : (anz + " Erfolge")));
            const __OUTAUSGESCHIEDEN = (anz => (anz + "-mal ausgeschieden"));
            const __OUTSCHNITT = (wert => (wert + " im Schnitt"));
            const __OUTPUNKTESCHNITT = (punkte => (punkte + " Punkte im Schnitt"));
            const __OUTPUNKTE = (punkte => ((punkte === 1) ? "1 Punkt" : (punkte + " Punkte")));
            const __OUTPLATZ = (platz => (platz + ". Platz"));
            const __OUTLIGA = (ligaNr => ((ligaNr === 1) ? "1. Liga" : ((ligaNr < 4) ? "2. Liga" : "3. Liga")));
            const __OUTLIGANAME = getLigaName;
            const __OUTPOKAL = (pokalNr => __POKALRUNDEN[pokalNr]);
            const __OUTOSE = (OSENr => __OSEALLRND[OSENr]);
            const __OUTOSC = (OSCNr => __OSCALLRND[OSCNr]);

            // Hilfsfunktionen fuer Evals und Filter der Reports...
            const __MEISTER = (entry => entry.isMeister());
            const __VIZEMEISTER = (entry => entry.isVizeMeister());
            const __ZWEITMEISTER = (entry => entry.isZweitMeister());
            const __DRITTMEISTER = (entry => entry.isDrittMeister());
            const __POKALSIEGER = (entry => entry.isPokalsieger());
            const __POKALFINALIST = (entry => entry.isPokalfinale());
            const __POKALFINALE = (entry => (entry.isPokalfinale() || entry.isPokalsieger()));
            const __OSESIEGER = (entry => entry.isOSEsieger());
            const __OSEFINALIST = (entry => entry.isOSEfinale());
            const __OSEFINALE = (entry => (entry.isOSEfinale() || entry.isOSEsieger()));
            const __OSCSIEGER = (entry => entry.isOSCsieger());
            const __OSCFINALIST = (entry => entry.isOSCfinale());
            const __OSCFINALE = (entry => (entry.isOSCfinale() || entry.isOSCsieger()));
            const __PUNKTE = (entry => entry.punkte);
            const __PLATZ = (entry => entry.platz);
            const __POKALRND = (entry => entry.pokalNr);
            const __OSEC = (entry => (entry.OSENr || entry.OSCNr));
            const __OSERND = (entry => entry.OSENr);
            const __OSERNDQ = (entry => (entry.OSENr <= 3));
            const __OSERND1 = (entry => (entry.OSENr > 3));
            const __OSCRND = (entry => entry.OSCNr);
            const __OSCRNDQ = (entry => (entry.OSCNr <= 2));
            const __OSCRND1 = (entry => (entry.OSCNr > 2));
            const __OSCRND2 = (entry => (entry.OSCNr > 3));
            const __OSCRNDKO = (entry => (entry.OSCNr > 4));
            const __LIGA = (entry => entry.ligaNr);
            const __LIGALVL = (entry => ((entry.ligaNr === 1) ? 1 : ((entry.ligaNr < 4) ? 2 : 3)));
            const __LIGA1 = (entry => (entry.ligaNr === 1));
            const __LIGA1NOT = (entry => (entry.ligaNr > 1));
            const __LIGA2 = (entry => ((entry.ligaNr === 2) || (entry.ligaNr === 3)));
            const __LIGA3 = (entry => (entry.ligaNr > 3));
            const __COUNT = (() => 1);

            // Alle Reports, je nach Optionen werden mehr (__LANG) oder weniger (__KURZ) davon genutzt...
            __KURZ(new ReportExists("OSC-Sieger", __OSCSIEGER));
            __KURZ(new ReportExists("OSC-Finalist", __OSCFINALIST));
            __KURZ(new ReportExists("OSE-Sieger", __OSESIEGER));
            __KURZ(new ReportExists("OSE-Finalist", __OSEFINALIST));
            __KURZ(new ReportExists("Meister", __MEISTER));
            __KURZ(new ReportExists("Vizemeister", __VIZEMEISTER));
            __LANG(new ReportExists("Zweitliga-Meister", __ZWEITMEISTER));
            __LANG(new ReportExists("Drittliga-Meister", __DRITTMEISTER));
            __KURZ(new ReportExists("Pokalsieger", __POKALSIEGER));
            __KURZ(new ReportExists("Pokalfinalist", __POKALFINALIST));
            __KURZ(new ReportSum("Gesamtpunkte", __PUNKTE, null, __OUTPUNKTE));
            __KURZ(new ReportMax("Maximale Punkte", __PUNKTE, null, __OUTPUNKTE));
            __LANG(new ReportMin("Minimale Punkte", __PUNKTE, null, __OUTPUNKTE));
            __LANG(new ReportAverage("Durchschnittspunkte", __PUNKTE, null, __OUTPUNKTESCHNITT));
            __LANG(new ReportSum("Gesamtpunkte 1. Liga", __PUNKTE, __LIGA1, __OUTPUNKTE));
            __LANG(new ReportMax("Maximale Punkte 1. Liga", __PUNKTE, __LIGA1, __OUTPUNKTE));
            __LANG(new ReportMin("Minimale Punkte 1. Liga", __PUNKTE, __LIGA1, __OUTPUNKTE));
            __LANG(new ReportAverage("Durchschnittspunkte 1. Liga", __PUNKTE, __LIGA1, __OUTPUNKTESCHNITT));
            __LANG(new ReportSum("Gesamtpunkte 2. Liga", __PUNKTE, __LIGA2, __OUTPUNKTE));
            __LANG(new ReportMax("Maximale Punkte 2. Liga", __PUNKTE, __LIGA2, __OUTPUNKTE));
            __LANG(new ReportMin("Minimale Punkte 2. Liga", __PUNKTE, __LIGA2, __OUTPUNKTE));
            __LANG(new ReportAverage("Durchschnittspunkte 2. Liga", __PUNKTE, __LIGA2, __OUTPUNKTESCHNITT));
            __LANG(new ReportSum("Gesamtpunkte 3. Liga", __PUNKTE, __LIGA3, __OUTPUNKTE));
            __LANG(new ReportMax("Maximale Punkte 3. Liga", __PUNKTE, __LIGA3, __OUTPUNKTE));
            __LANG(new ReportMin("Minimale Punkte 3. Liga", __PUNKTE, __LIGA3, __OUTPUNKTE));
            __LANG(new ReportAverage("Durchschnittspunkte 3. Liga", __PUNKTE, __LIGA3, __OUTPUNKTESCHNITT));
            __KURZ(new ReportMax("Bestes Pokalergebnis", __POKALRND, null, __OUTPOKAL));
            __LANG(new ReportMin("Schlechtestes Pokalergebnis", __POKALRND, null, __OUTPOKAL));
            __KURZ(new ReportMax("Bestes OSC-Ergebnis", __OSCRND, null, __OUTOSC));
            __LANG(new ReportMin("Schlechtestes OSC-Ergebnis", __OSCRND, null, __OUTOSC));
            __LANG(new ReportMax("Sp&auml;testes OSCQ-Scheitern", __OSCRND, __OSCRNDQ, __OUTOSC));
            __LANG(new ReportMin("Fr&uuml;hestes OSCQ-Scheitern", __OSCRND, __OSCRNDQ, __OUTOSC));
            __KURZ(new ReportMax("Bestes OSE-Ergebnis", __OSERND, null, __OUTOSE));
            __LANG(new ReportMin("Schlechtestes OSE-Ergebnis", __OSERND, null, __OUTOSE));
            __LANG(new ReportMax("Sp&auml;testes OSEQ-Scheitern", __OSERND, __OSERNDQ, __OUTOSE));
            __LANG(new ReportMin("Fr&uuml;hestes OSEQ-Scheitern", __OSERND, __OSERNDQ, __OUTOSE));
            __KURZ(new ReportCount("1. Liga", __LIGA1, null, __OUTTEILNAHMEN));
            __KURZ(new ReportCount("2. Liga", __LIGA2, null, __OUTTEILNAHMEN));
            __KURZ(new ReportCount("3. Liga", __LIGA3, null, __OUTTEILNAHMEN));
            __LANG(new ReportCount("National", __COUNT, __POKALRND, __OUTTEILNAHMEN));
            __LANG(new ReportCount("International", __COUNT, __OSEC, __OUTTEILNAHMEN));
            __KURZ(new ReportCount("OSC/OSCQ", __OSCRND, null, __OUTTEILNAHMEN));
            __LANG(new ReportCount("OSC Quali", __OSCRNDQ, null, __OUTAUSGESCHIEDEN));
            __LANG(new ReportCount("OSC HR", __OSCRND1, null, __OUTTEILNAHMEN));
            __LANG(new ReportCount("OSC ZR", __OSCRND2, null, __OUTTEILNAHMEN));
            __LANG(new ReportCount("OSC FR", __OSCRNDKO, null, __OUTTEILNAHMEN));
            __KURZ(new ReportCount("OSE/OSEQ", __OSERND, null, __OUTTEILNAHMEN));
            __LANG(new ReportCount("OSE Quali", __OSERNDQ, null, __OUTAUSGESCHIEDEN));
            __LANG(new ReportCount("OSE", __OSERND1, null, __OUTTEILNAHMEN));
            __LANG(new ReportCount("OSC-Siege", __OSCSIEGER, null, __OUTERFOLGE));
            __LANG(new ReportCount("OSC-Finals", __OSCFINALE, null, __OUTERFOLGE));
            __LANG(new ReportCount("OSE-Siege", __OSESIEGER, null, __OUTERFOLGE));
            __LANG(new ReportCount("OSE-Finals", __OSEFINALE, null, __OUTERFOLGE));
            __LANG(new ReportCount("Meisterschaften", __MEISTER, null, __OUTERFOLGE));
            __LANG(new ReportCount("Vize-Meisterschaften", __VIZEMEISTER, null, __OUTERFOLGE));
            __LANG(new ReportCount("Zweitliga-Meisterschaften", __ZWEITMEISTER, null, __OUTERFOLGE));
            __LANG(new ReportCount("Drittliga-Meisterschaften", __DRITTMEISTER, null, __OUTERFOLGE));
            __LANG(new ReportCount("Pokalsiege", __POKALSIEGER, null, __OUTERFOLGE));
            __LANG(new ReportCount("Pokalfinals", __POKALFINALE, null, __OUTERFOLGE));
            __LANG(new ReportExists("1. Liga", __LIGA1));
            __LANG(new ReportExists("2. Liga", __LIGA2));
            __LANG(new ReportExists("3. Liga", __LIGA3));
            __LANG(new ReportExists("OSC/OSCQ", __OSCRND));
            __LANG(new ReportExists("OSC Quali", __OSCRNDQ));
            __LANG(new ReportExists("OSC HR", __OSCRND1));
            __LANG(new ReportExists("OSC ZR", __OSCRND2));
            __LANG(new ReportExists("OSC FR", __OSCRNDKO));
            __LANG(new ReportExists("OSE/OSEQ", __OSERND));
            __LANG(new ReportExists("OSE Quali", __OSERNDQ));
            __LANG(new ReportExists("OSE", __OSERND1));
            __KURZ(new ReportMin("Beste Platzierung 1. Liga", __PLATZ, __LIGA1, __OUTPLATZ));
            __LANG(new ReportMax("Schlechteste Platzierung 1. Liga", __PLATZ, __LIGA1, __OUTPLATZ));
            __LANG(new ReportAverage("Durchschnittliche Platzierung 1. Liga", __PLATZ, __LIGA1, __OUTSCHNITT));
            __LANG(new ReportMin("Beste Platzierung sonstige Ligen", __PLATZ, __LIGA1NOT, __OUTPLATZ));
            __LANG(new ReportMax("Schlechteste Platzierung sonstige Ligen", __PLATZ, __LIGA1NOT, __OUTPLATZ));
            __LANG(new ReportAverage("Durchschnittliche Platzierung sonstige Ligen", __PLATZ, __LIGA1NOT, __OUTSCHNITT));
            __LANG(new ReportMin("Beste Platzierung 2. Liga", __PLATZ, __LIGA2, __OUTPLATZ));
            __LANG(new ReportMax("Schlechteste Platzierung 2. Liga", __PLATZ, __LIGA2, __OUTPLATZ));
            __LANG(new ReportAverage("Durchschnittliche Platzierung 2. Liga", __PLATZ, __LIGA2, __OUTSCHNITT));
            __LANG(new ReportMin("Beste Platzierung 3. Liga", __PLATZ, __LIGA3, __OUTPLATZ));
            __LANG(new ReportMax("Schlechteste Platzierung 3. Liga", __PLATZ, __LIGA3, __OUTPLATZ));
            __LANG(new ReportAverage("Durchschnittliche Platzierung 3. Liga", __PLATZ, __LIGA3, __OUTSCHNITT));
            __KURZ(new ReportMin("H&ouml;chste Liga", __LIGA, null, __OUTLIGANAME));
            __LANG(new ReportMax("Niedrigste Liga", __LIGA, null, __OUTLIGANAME));
            __LANG(new ReportMin("H&ouml;chste Ligenstufe", __LIGALVL, null, __OUTLIGA));
            __LANG(new ReportMax("Niedrigste Ligenstufe", __LIGALVL, null, __OUTLIGA));

            // Ueberall die Eintraege im Format "Saison xx" (per valueOf) statt 'Sxx' anzeigen...
            //__REPORTS.forEach(report => report.setFormatter(__OUTSAISONLONG));
        }

        // Jede bekannte Spalte erstmal als leer markieren...
        const __EMPTYCOLUMN = reverseArray(this.__COLUMNINDEX).map(() => true);

        Array.from(__ROWS).reverse().forEach(row => {
                const __ROWINDEX = row.rowIndex;
                const __CELLS = row.cells;    // Aktuelle Eintraege

                if (__ROWINDEX > 0) {  // kein Header...
                    const __ENTRY = new SaisonhistorieEntry(__CELLS);

                    __REPORTS.forEach(report => report.handleEntry(__ENTRY));

                    __LOG[2](String(__ENTRY));
                }

                row.style.textAlign = 'center';

                Array.from(__CELLS).forEach((cell, index) => {
                        cell.style.border = __BORDERSTRING;

                        if (cell.textContent === __EMPTYTEXT) {
                            if (__SHORTKOM) {
                                cell.textContent = "";  // Eintrag irritiert etwas, leeres Feld ist besser!
                            }
                        } else if (__ROWINDEX > 0) {  // kein Header...
                            __EMPTYCOLUMN[index] = false;
                        }
                    });
/*
                //Array.from(document.querySelector('#leihe').rows[i].cells).forEach(cell => (cell.style.border = __BORDERSTRING));
*/
            });

        if (__NOEMPTYCOLUMNS) {
            for (let index = this.__COLUMNINDEX.OSC; index >= this.__COLUMNINDEX.OSE; index--) {
                if (__EMPTYCOLUMN[index]) {
                    Array.from(__ROWS).forEach(row => {
                            row.deleteCell(index);
                        });
                }
            }
        }

        const __UL = document.createElement('ul');

        __REPORTS.forEach(report => {
                const __REPORT = report.getReport();
                if (__REPORT) {
                    const __LI = document.createElement('li');

                    __LI.innerHTML = __REPORT;
                    __UL.append(__LI);
                }
            });

        const __ANCHOR = document.querySelector('#leihe');  // ueber den Namen reden wir noch einmal...

        insertBefore(__UL, __ANCHOR);

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
    const __BOXSAISONS = getTags('option');
    const __SAISON = getSelectionFromComboBox(__BOXSAISONS, 0, 'Number');
    const __LIGASIZE = 10; // (optParams.Tab ? getLigaSizeFromSpielplan(optParams.Tab.rows, optParams.Zei, optParams.Spa, optSet.getOptValue('aktuelleSaison')) : undefined);

    // ... und abspeichern...
    optSet.setOpt('aktuelleSaison', __SAISON, false);
    optSet.setOpt('ligaSize', __LIGASIZE, false);

    return optSet;
}

// Callback-Funktion fuer die Ermittlung des richtigen PageManagers
// page: Die ueber den Selektor ermittelte Seitennummer (hier: nur 10 gueltig)
// return Der zugehoerige PageManager (hier: 0)
function setupManager(page) {
    const __MAIN = this;

    return __MAIN.pageManager[page - 10];
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
const __MAIN = new Main(__OPTCONFIG, __MAINCONFIG, procSaisonhistorie);

__MAIN.run(getPageIdFromURL, __LEAFS, __ITEM);

// ==================== Ende Hauptprogramm ====================

// *** EOF ***
