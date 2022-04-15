/****** JavaScript-Bibliothek 'lib.OS2.js' ["OS2"] ******/

// Inhaltsverzeichnis:
// https://eselce.github.io/GitTest/misc/OS2/lib/<OS2>: 
//  OS2.list.js
//  OS2.calc.js
//  OS2.team.js
//  OS2.page.team.js
//  OS2.page.js
//  OS2.zat.js
//  OS2.class.warndraw.js
//  OS2.class.player.js
//  OS2.class.column.js
//  OS2.class.table.js

/*** Modul OS2.list.js ***/

// ==UserScript==
// _name         OS2.list
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities zu OS2-spezifischen Listen
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.list.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer interne IDs auf den Seiten ====================

const __GAMETYPENRN = {    // "Blind FSS gesucht!"
        'unbekannt'  : -1,
        'reserviert' :  0,
        'Frei'       :  0,
        'spielfrei'  :  0,
        'Friendly'   :  1,
        'Liga'       :  2,
        'LP'         :  3,
        'OSEQ'       :  4,
        'OSE'        :  5,
        'OSCQ'       :  6,
        'OSC'        :  7,
        'Supercup'   : 10
    };
const __GAMETYPES = reverseArray(__GAMETYPENRN);

const __GAMETYPEALIASES = {
        'unbekannt'  :  "unbekannt",
        'reserviert' :  undefined,
        'Frei'       :  undefined,
        'spielfrei'  :  "",
        'Friendly'   :  "FSS",
        'Liga'       :  undefined,
        'LP'         :  "Pokal",
        'OSEQ'       :  undefined,
        'OSE'        :  undefined,
        'OSCQ'       :  undefined,
        'OSC'        :  undefined,
        'Supercup'   : "Super"
    };

const __LIGANRN = {
        'unbekannt'  :  0,
        '1. Liga'    :  1,
        '2. Liga A'  :  2,
        '2. Liga B'  :  3,
        '3. Liga A'  :  4,
        '3. Liga B'  :  5,
        '3. Liga C'  :  6,
        '3. Liga D'  :  7
    };
const __LIGANAMES = reverseArray(__LIGANRN);

const __LANDNRN = {
        'unbekannt'              :   0,
        'Albanien'               :  45,
        'Andorra'                :  95,
        'Armenien'               :  83,
        'Aserbaidschan'          : 104,
        'Belgien'                :  12,
        'Bosnien-Herzegowina'    :  66,
        'Bulgarien'              :  42,
        'D\u00E4nemark'          :   8,
        'Deutschland'            :   6,
        'England'                :   1,
        'Estland'                :  57,
        'Far\u00F6er'            :  68,
        'Finnland'               :  40,
        'Frankreich'             :  32,
        'Georgien'               :  49,
        'Griechenland'           :  30,
        'Irland'                 :   5,
        'Island'                 :  29,
        'Israel'                 :  23,
        'Italien'                :  10,
        'Kasachstan'             : 105,
        'Kroatien'               :  24,
        'Lettland'               :  97,
        'Liechtenstein'          :  92,
        'Litauen'                :  72,
        'Luxemburg'              :  93,
        'Malta'                  :  69,
        'Mazedonien'             :  86,
        'Moldawien'              :  87,
        'Niederlande'            :  11,
        'Nordirland'             :   4,
        'Norwegen'               :   9,
        '\u00D6sterreich'        :  14,
        'Polen'                  :  25,
        'Portugal'               :  17,
        'Rum\u00E4nien'          :  28,
        'Russland'               :  19,
        'San Marino'             :  98,
        'Schottland'             :   2,
        'Schweden'               :  27,
        'Schweiz'                :  37,
        'Serbien und Montenegro' :  41,
        'Slowakei'               :  70,
        'Slowenien'              :  21,
        'Spanien'                :  13,
        'Tschechien'             :  18,
        'T\u00FCrkei'            :  39,
        'Ukraine'                :  20,
        'Ungarn'                 :  26,
        'Wales'                  :   3,
        'Weissrussland'          :  71,
        'Zypern'                 :  38
    };
const __LAENDER = reverseArray(__LANDNRN);

const __TLALAND = {
        undefined : 'unbekannt',
        'ALB'     : 'Albanien',
        'AND'     : 'Andorra',
        'ARM'     : 'Armenien',
        'AZE'     : 'Aserbaidschan',
        'BEL'     : 'Belgien',
        'BIH'     : 'Bosnien-Herzegowina',
        'BUL'     : 'Bulgarien',
        'DEN'     : 'D\u00E4nemark',
        'GER'     : 'Deutschland',
        'ENG'     : 'England',
        'EST'     : 'Estland',
        'FRO'     : 'Far\u00F6er',
        'FIN'     : 'Finnland',
        'FRA'     : 'Frankreich',
        'GEO'     : 'Georgien',
        'GRE'     : 'Griechenland',
        'IRL'     : 'Irland',
        'ISL'     : 'Island',
        'ISR'     : 'Israel',
        'ITA'     : 'Italien',
        'KAZ'     : 'Kasachstan',
        'CRO'     : 'Kroatien',
        'LVA'     : 'Lettland',
        'LIE'     : 'Liechtenstein',
        'LTU'     : 'Litauen',
        'LUX'     : 'Luxemburg',
        'MLT'     : 'Malta',
        'MKD'     : 'Mazedonien',
        'MDA'     : 'Moldawien',
        'NED'     : 'Niederlande',
        'NIR'     : 'Nordirland',
        'NOR'     : 'Norwegen',
        'AUT'     : '\u00D6sterreich',
        'POL'     : 'Polen',
        'POR'     : 'Portugal',
        'ROM'     : 'Rum\u00E4nien',
        'RUS'     : 'Russland',
        'SMR'     : 'San Marino',
        'SCO'     : 'Schottland',
        'SWE'     : 'Schweden',
        'SUI'     : 'Schweiz',
        'SCG'     : 'Serbien und Montenegro',
        'SVK'     : 'Slowakei',
        'SVN'     : 'Slowenien',
        'ESP'     : 'Spanien',
        'CZE'     : 'Tschechien',
        'TUR'     : 'T\u00FCrkei',
        'UKR'     : 'Ukraine',
        'HUN'     : 'Ungarn',
        'WAL'     : 'Wales',
        'BLR'     : 'Weissrussland',
        'CYP'     : 'Zypern'
    };
const __LANDTLAS = reverseMapping(__TLALAND);

const __TLALIGASIZE = {
        undefined : 10,
        'ALB'     : 10,
        'AND'     : 10,
        'ARM'     : 10,
        'AZE'     : 10,
        'BEL'     : 18,
        'BIH'     : 10,
        'BUL'     : 10,
        'DEN'     : 10,
        'GER'     : 18,
        'ENG'     : 20,
        'EST'     : 10,
        'FRO'     : 10,
        'FIN'     : 10,
        'FRA'     : 18,
        'GEO'     : 10,
        'GRE'     : 18,
        'IRL'     : 10,
        'ISL'     : 10,
        'ISR'     : 10,
        'ITA'     : 18,
        'KAZ'     : 10,
        'CRO'     : 10,
        'LVA'     : 10,
        'LIE'     : 10,
        'LTU'     : 10,
        'LUX'     : 10,
        'MLT'     : 10,
        'MKD'     : 10,
        'MDA'     : 10,
        'NED'     : 18,
        'NIR'     : 10,
        'NOR'     : 10,
        'AUT'     : 10,
        'POL'     : 10,
        'POR'     : 18,
        'ROM'     : 10,
        'RUS'     : 18,
        'SMR'     : 10,
        'SCO'     : 10,
        'SWE'     : 10,
        'SUI'     : 10,
        'SCG'     : 10,
        'SVK'     : 10,
        'SVN'     : 10,
        'ESP'     : 20,
        'CZE'     : 10,
        'TUR'     : 18,
        'UKR'     : 10,
        'HUN'     : 10,
        'WAL'     : 10,
        'BLR'     : 10,
        'CYP'     : 10
    };
const __LIGASIZETLAS = reverseMapping(__TLALIGASIZE, mappingPush);

// ==================== Ende Abschnitt fuer interne IDs auf den Seiten ====================

// ==================== Abschnitt fuer interne IDs des OS-Spielplans auf den Seiten ====================

const __COLINTSPIELPLAN = {
        'ZAT2'      : 0,
        'ZAT'       : 1,
        'LabOSE'    : 2,
        'LabOSC'    : 3,
        'CupOSE'    : 4,
        'CupOSC'    : 5,
        'EvtOSE'    : 6,
        'EvtOSC'    : 7,
        'RndOSE'    : 8,
        'RndOSC'    : 9,
        'HROSE'     : 10,
        'HROSC'     : 11,
        'IntOSE'    : 12,
        'IntOSC'    : 13
    };

const __INTSPIELPLAN = {
        1   : [ 0,  0,  'Saisonstart',              'Saisonstart',              '', '',         'OSEQ', 'OSCQ',     '',                 '',                 0,  0,  '',                 ''              ],
        2   : [ 4,  5,  '1. Quali Hin',             '1. Quali Hin',             'OSEQ', 'OSCQ', 'OSEQ', 'OSCQ',     'Runde 1',          'Runde 1',          1,  1,  '1. Runde',         '1. Runde'      ],
        3   : [ 6,  7,  '1. Quali R\u00FCck',       '1. Quali R\u00FCck',       'OSEQ', 'OSCQ', 'OSEQ', 'OSCQ',     'Runde 1',          'Runde 1',          2,  2,  '1. Runde',         '1. Runde'      ],
        4   : [ 10, 11, '2. Quali Hin',             '2. Quali Hin',             'OSEQ', 'OSCQ', 'OSEQ', 'OSCQ',     'Runde 2',          'Runde 2',          1,  1,  '2. Runde',         '2. Runde'      ],
        5   : [ 14, 13, '2. Quali R\u00FCck',       '2. Quali R\u00FCck',       'OSEQ', 'OSCQ', 'OSEQ', 'OSCQ',     'Runde 2',          'Runde 2',          2,  2,  '2. Runde',         '2. Runde'      ],
        6   : [ 16, 17, '3. Quali Hin',             '1. Gruppenspiel',          'OSEQ', 'OSC',  'OSEQ', 'OSCHR',    'Runde 3',          'Spiel 1',          1,  1,  '3. Runde',         '1. Runde'      ],  // 1. Spiel
        7   : [ 22, 19, '3. Quali R\u00FCck',       '2. Gruppenspiel',          'OSEQ', 'OSC',  'OSEQ', 'OSCHR',    'Runde 3',          'Spiel 2',          2,  1,  '3. Runde',         '1. Runde'      ],  // 2. Spiel
        8   : [ 24, 23, '1. Runde Hin',             '3. Gruppenspiel',          'OSE',  'OSC',  'OSE',  'OSCHR',    'Runde 1',          'Spiel 3',          1,  1,  '1. Runde',         '2. Runde'      ],  // 3. Spiel
        9   : [ 26, 25, '1. Runde R\u00FCck',       '4. Gruppenspiel',          'OSE',  'OSC',  'OSE',  'OSCHR',    'Runde 1',          'Spiel 4',          2,  2,  '1. Runde',         '2. Runde'      ],  // 4. Spiel
        10  : [ 34, 29, '2. Runde Hin',             '5. Gruppenspiel',          'OSE',  'OSC',  'OSE',  'OSCHR',    'Runde 2',          'Spiel 5',          1,  2,  '2. Runde',         '3. Runde'      ],  // 5. Spiel
        11  : [ 36, 31, '2. Runde R\u00FCck',       '6. Gruppenspiel',          'OSE',  'OSC',  'OSE',  'OSCHR',    'Runde 2',          'Spiel 6',          2,  2,  '2. Runde',         '3. Runde'      ],  // 6. Spiel
        12  : [ 38, 35, '3. Runde Hin',             '7. Gruppenspiel',          'OSE',  'OSC',  'OSE',  'OSCZR',    'Runde 3',          'Spiel 1',          1,  1,  '3. Runde',         '4. Runde'      ],  // 1. Spiel
        13  : [ 42, 37, '3. Runde R\u00FCck',       '8. Gruppenspiel',          'OSE',  'OSC',  'OSE',  'OSCZR',    'Runde 3',          'Spiel 2',          2,  1,  '3. Runde',         '4. Runde'      ],  // 2. Spiel
        14  : [ 44, 41, '4. Runde Hin',             '9. Gruppenspiel',          'OSE',  'OSC',  'OSE',  'OSCZR',    'Runde 4',          'Spiel 3',          1,  1,  '4. Runde',         '5. Runde'      ],  // 3. Spiel
        15  : [ 50, 43, '4. Runde R\u00FCck',       '10. Gruppenspiel',         'OSE',  'OSC',  'OSE',  'OSCZR',    'Runde 4',          'Spiel 4',          2,  2,  '4. Runde',         '5. Runde'      ],  // 4. Spiel
        16  : [ 52, 47, 'Achtelfinale Hin',         '11. Gruppenspiel',         'OSE',  'OSC',  'OSE',  'OSCZR',    'Achtelfinale',     'Spiel 5',          1,  2,  'Achtelfinale',     '6. Runde'      ],  // 5. Spiel
        17  : [ 54, 49, 'Achtelfinale R\u00FCck',   '12. Gruppenspiel',         'OSE',  'OSC',  'OSE',  'OSCZR',    'Achtelfinale',     'Spiel 6',          2,  2,  'Achtelfinale',     '6. Runde'      ],  // 6. Spiel
        18  : [ 56, 53, 'Viertelfinale Hin',        'Viertelfinale Hin',        'OSE',  'OSC',  'OSE',  'OSCFR',    'Viertelfinale',    'Viertelfinale',    1,  2,  'Viertelfinale',    'Viertelfinale' ],
        19  : [ 60, 55, 'Viertelfinale R\u00FCck',  'Viertelfinale R\u00FCck',  'OSE',  'OSC',  'OSE',  'OSCFR',    'Viertelfinale',    'Viertelfinale',    2,  2,  'Viertelfinale',    'Viertelfinale' ],
        20  : [ 62, 59, 'Halbfinale Hin',           'Halbfinale Hin',           'OSE',  'OSC',  'OSE',  'OSCFR',    'Halbfinale',       'Halbfinale',       1,  2,  'Halbfinale',       'Halbfinale'    ],
        21  : [ 66, 61, 'Halbfinale R\u00FCck',     'Halbfinale R\u00FCck',     'OSE',  'OSC',  'OSE',  'OSCFR',    'Halbfinale',       'Halbfinale',       2,  2,  'Halbfinale',       'Halbfinale'    ],
        22  : [ 70, 71, 'Finale',                   'Finale',                   'OSE',  'OSC',  'OSE',  'OSCFR',    'Finale',           'Finale',           1,  2,  'Finale',           'Finale'        ],
        23  : [ 99, 99, 'Saisonende',               'Saisonende',               '', '',         'OSE',  'OSCFR',    'Sieger',           'Sieger',           0,  0,  'Sieger',           'Sieger'        ]
    };
const __INTZATLABOSE = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.ZAT, __COLINTSPIELPLAN.LabOSE);
const __INTZATLABOSC = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.ZAT, __COLINTSPIELPLAN.LabOSC);
const __INTLABOSEZAT = reverseMapping(__INTZATLABOSE);
const __INTLABOSCZAT = reverseMapping(__INTZATLABOSC);
const __INTOSEALLZATS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.EvtOSE, __COLINTSPIELPLAN.ZAT, mappingPush);
const __INTOSCALLZATS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.EvtOSC, __COLINTSPIELPLAN.ZAT, mappingPush);
const __INTOSECUPS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSE, __COLINTSPIELPLAN.CupOSE, mappingPush);
const __INTOSCCUPS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSC, __COLINTSPIELPLAN.CupOSC, mappingPush);
const __INTOSEEVTS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSE, __COLINTSPIELPLAN.EvtOSE, mappingPush);
const __INTOSCEVTS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSC, __COLINTSPIELPLAN.EvtOSC, mappingPush);
const __INTOSEZATS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSE, __COLINTSPIELPLAN.ZAT, mappingPush);
const __INTOSCZATS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSC, __COLINTSPIELPLAN.ZAT, mappingPush);

// Beschreibungstexte aller Runden...
const __POKALRUNDEN = [ "", "1. Runde", "2. Runde", "3. Runde", "Achtelfinale", "Viertelfinale", "Halbfinale", "Finale", "Pokalsieger" ];
const __QUALIRUNDEN = [ "", "Quali 1", "Quali 2", "Quali 3" ];
const __OSCRUNDEN   = [ "", "Viertelfinale", "Halbfinale", "Finale", "OSC-Sieger" ];
const __OSERUNDEN   = [ "", "Runde 1", "Runde 2", "Runde 3", "Runde 4", "Achtelfinale", "Viertelfinale", "Halbfinale", "Finale", "OSE-Sieger" ];
const __OSCALLRND   = [ "", "1. Runde Quali", "2. Runde Quali", "1. Hauptrunde", "2. Hauptrunde", "Viertelfinale", "Halbfinale", "Finale", "OSC-Sieger" ];
const __OSEALLRND   = [ "", "1. Runde Quali", "2. Runde Quali", "3. Runde Quali", "1. Runde", "2. Runde", "3. Runde", "4. Runde", "Achtelfinale", "Viertelfinale", "Halbfinale", "Finale", "OSE-Sieger" ];
const __HINRUECK    = [ " Hin", " R\u00FCck", "" ];

// Ermittlung von Spielrunden...
const __RUNDEPOKAL  = reverseMapping(__POKALRUNDEN, Number);
const __RUNDEQUALI  = reverseMapping(__QUALIRUNDEN, Number);
const __RUNDEOSC    = reverseMapping(__OSCRUNDEN, Number);
const __RUNDEOSE    = reverseMapping(__OSERUNDEN, Number);
const __ALLRNDOSC   = reverseMapping(__OSCALLRND, Number);
const __ALLRNDOSE   = reverseMapping(__OSEALLRND, Number);

const __HINRUECKHIN     = 0;
const __HINRUECKRUECK   = 1;
const __HINRUECKNULL    = 2;

// ==================== Ende Abschnitt fuer interne IDs des OS-Spielplans auf den Seiten ====================

// ==================== Abschnitt fuer Daten des Spielplans ====================

// Gibt die ID fuer den Namen eines Wettbewerbs zurueck
// gameType: Name des Wettbewerbs eines Spiels
// defValue: Default-Wert
// return OS2-ID fuer den Spieltyp (1 bis 7 oder 10), 0 fuer "spielfrei"/"Frei"/"reserviert", -1 fuer ungueltig
function getGameTypeID(gameType, defValue = __GAMETYPENRN.unbekannt) {
    return getValue(__GAMETYPENRN[gameType], defValue);
}

// Gibt den Namen eines Wettbewerbs zurueck
// id: OS2-ID des Wettbewerbs eines Spiels (1 bis 7 oder 10), 0 fuer "spielfrei"/"Frei"/"reserviert", -1 fuer ungueltig
// defValue: Default-Wert
// return Spieltyp fuer die uebergebene OS2-ID
function getGameType(id, defValue) {
    return getValue(__GAMETYPES[id], defValue);
}

// Gibt den alternativen (Kurznamen) fuer den Namen eines Wettbewerbs zurueck
// gameType: Name des Wettbewerbs eines Spiels
// return Normalerweise den uebergebenen Parameter, in Einzelfaellen eine Kurzversion
function getGameTypeAlias(gameType) {
    return getValue(__GAMETYPEALIASES[gameType], getValue(gameType, __GAMETYPEALIASES.unbekannt));
}

// Gibt den Namen des Landes mit dem uebergebenen Kuerzel (TLA) zurueck.
// tla: Kuerzel (TLA) des Landes
// defValue: Default-Wert
// return Name des Landes, 'unbekannt' fuer undefined
function getLandName(tla, defValue = __TLALAND.undefined) {
    return getValue(__TLALAND[tla], defValue);
}

// Gibt den Namen des Landes mit der uebergebenen ID zurueck.
// ID: OS2-ID des Landes
// defValue: Default-Wert
// return Name der Landes, "unbekannt" fuer ungueltig
function getLandNameById(ID, defValue = __LAENDER[0]) {
    return getValue(__LAENDER[ID], defValue);
}

// Gibt die ID des Landes mit dem uebergebenen Namen zurueck.
// land: Name des Landes
// defValue: Default-Wert
// return OS2-ID des Landes, 0 fuer ungueltig
function getLandNr(land, defValue = __LANDNRN.unbekannt) {
    return getValue(__LANDNRN[land], defValue);
}

// Gibt die TLA des Landes mit dem uebergebenen Namen zurueck.
// land: Name des Landes
// defValue: Default-Wert
// return TLA des Landes, undefined fuer ungueltig
function getLandTLA(land, defValue = __LANDTLAS.unbekannt) {
    return getValue(__LANDTLAS[land], defValue);
}

// Gibt die ID der Liga mit dem uebergebenen Namen zurueck.
// liga: Name der Liga
// defValue: Default-Wert
// return OS2-ID der Liga, 0 fuer ungueltig
function getLigaNr(liga, defValue = __LIGANRN.unbekannt) {
    return getValue(__LIGANRN[liga], defValue);
}

// Gibt den Namen einer per ID uebergebenen Liga zurueck.
// ID: OS2-ID der Liga
// defValue: Default-Wert
// return Name der Liga, "unbekannt" fuer ungueltig
function getLigaName(ID, defValue = __LIGANAMES[0]) {
    return getValue(__LIGANAMES[ID], defValue);
}

// Gibt die Ligengroesse des Landes mit dem uebergebenen Kuerzel (TLA) zurueck.
// tla: Kuerzel (TLA) des Landes
// defValue: Default-Wert (__TLALIGASIZE[undefined])
// return Ligengroesse des Landes (10/18/20), defaultValue fuer unbekannt
function getLigaSizeByTLA(tla, defValue = __TLALIGASIZE.undefined) {
    return getValue(__TLALIGASIZE[tla], defValue);
}

// Gibt die Ligengroesse des Landes mit dem uebergebenen Namen zurueck.
// land: Name des Landes
// defValue: Default-Wert (__TLALIGASIZE[undefined])
// return Ligengroesse des Landes (10/18/20), defaultValue fuer unbekannt
function getLigaSize(land, defValue = __TLALIGASIZE.undefined) {
    return getLigaSizeByTLA(__LANDTLAS[land], defValue);
}

// Gibt die Ligengroesse des Landes mit der uebergebenen ID zurueck.
// ID: OS2-ID des Landes
// defValue: Default-Wert (__TLALIGASIZE[undefined])
// return Ligengroesse des Landes (10/18/20), defaultValue fuer unbekannt
function getLigaSizeById(ID, defValue = __TLALIGASIZE.undefined) {
    return getValue(__LAENDER[ID], defValue);
}

// Gibt den ZAT, das Event und den Link einer internationalen Runde zurueck.
// TODO Diese Version ist beschraenkt auf Saisons ab der 3. Saison!
// searchCup: Gesuchter Wettbewerb ('OSC', 'OSCQ', 'OSE', 'OSEQ')
// searchRunde: Gesuchte Runde im Wettbewerb ('1. Runde', ...)
// currZAT: Der aktuelle ZAT (fuer die Frage, ob vergangene oder kommende Runde)
// lastRnd: Letzte Runde finden (statt erreichter Runde): Ergebnisse liegen in der Vergangenheit
// return ZAT, Event der Runde und deren OS2-Webseite der erreichten (bzw. vergangenen) Runde
function calcZATEventByCupRunde(searchCup, searchRunde, currZAT, lastRnd) {
    const __CUP = searchCup;
    const __RUNDE = searchRunde;
    const __CURRZAT = currZAT;
    const __LASTRND = lastRnd;
    const __CUPS = getArrValue(__INTOSECUPS, __RUNDE).concat(
                        getArrValue(__INTOSCCUPS, __RUNDE));
    const __EVTS = getArrValue(__INTOSEEVTS, __RUNDE).concat(
                        getArrValue(__INTOSCEVTS, __RUNDE));
    const __ZATS = getArrValue(__INTOSEZATS, __RUNDE).concat(
                        getArrValue(__INTOSCZATS, __RUNDE));
    let ret = [ -1, __CUP, null ];  // nicht gefunden

    __CUPS.forEach((cup, index) => {
            if (cup === __CUP) {
                const __ZAT = getValue(__ZATS[index]);
                const __EVT = getValue(__EVTS[index]);

                if ((! ~ ret[0]) || (ret[0] <= __CURRZAT)) {  // in der Zukunft nur den ersten Treffer...
                    if ((! __LASTRND) || (__ZAT <= __CURRZAT)) {  // bei __LASTRND keine zukuenftigen Runden...
                        ret = [ __ZAT, __EVT, __EVT.toLowerCase() + '.php' ];
                    }
                }
            }
        });

    return ret;
}

// ==================== Abschnitt fuer Daten des Spielplans ====================

// ==================== Abschnitt fuer Skilltypen, Skills und Spielreihen ====================

// Schaut nach, ob der uebergebene Index zu einem trainierbaren Skill gehoert
// Die Indizes gehen von 0 (SCH) bis 16 (EIN)
function isTrainableSkill(idx) {
    const __TRAINABLESKILLS = getIdxTrainableSkills();
    const __IDX = parseInt(idx, 10);
    let result = false;

    for (let idxTrainable of __TRAINABLESKILLS) {
        if (__IDX === idxTrainable) {
            result = true;
            break;
        }
    }

    return result;
}

// Konvertiert einen Aufwertungstext fuer einen Skillnamen in den fuer einen Torwart
// name: Allgemeiner Skillname (abgeleitet von den Feldspielern)
// return Der konvertierte String (z.B. "FAN" statt "KOB") oder unveraendert
function getGoalieSkill(name) {
    const __GOALIESKILLS = {
                               'SCH' : 'ABS',
                               'BAK' : 'STS',
                               'KOB' : 'FAN',
                               'ZWK' : 'STB',
                               'DEC' : 'SPL',
                               'GES' : 'REF'
                           };

    return getValue(__GOALIESKILLS[name], name);
}

// Konvertiert die allgemeinen Skills in die eines Torwarts
// value: Ein Text, der die Skillnamen enthaelt
// return Der konvertierte String mit Aenderungen (z.B. "FAN" statt "KOB") oder unveraendert
function convertGoalieSkill(value) {
    if (value !== undefined) {
        value = value.replace(/\w+/g, getGoalieSkill);
    }

    return value;
}

// Gibt alle Skill-Namen zurueck
function getAllSkillNames(isGoalie = false) {
    if (isGoalie) {
        return [ 'ABS', 'STS', 'FAN', 'STB', 'SPL', 'REF', 'FUQ', 'ERF', 'AGG', 'PAS', 'AUS', 'UEB', 'WID', 'SEL', 'DIS', 'ZUV', 'EIN' ];
    } else {
        return [ 'SCH', 'BAK', 'KOB', 'ZWK', 'DEC', 'GES', 'FUQ', 'ERF', 'AGG', 'PAS', 'AUS', 'UEB', 'WID', 'SEL', 'DIS', 'ZUV', 'EIN' ];
    }
}

// Gibt den Skill-Namen zu einem Index zurueck
function getSkillName(idx, isGoalie = false) {
    const __ALLNAMES = getAllSkillNames(isGoalie);

    return __ALLNAMES[idx];
}

// Gibt den Skill-Namen zu einem Index-Array zurueck
function getSkillNameArray(idxArr, isGoalie = false) {
    return (idxArr ? idxArr.map(function(item) {
                                    return getSkillName(item, isGoalie);
                                }) : idxArr);
}

// Gibt die Indizes aller Skills zurueck
function getIdxAllSkills() {
    return [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
}

// Gibt die Indizes der trainierbaren Skills zurueck
function getIdxTrainableSkills() {
    return [ 0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 15 ];
}

// Gibt die Indizes der Fixskills zurueck
function getIdxFixSkills() {
    return [ 6, 7, 12, 13, 14, 16 ];
}

// Gibt die Indizes der Primaerskills zurueck
function getIdxPriSkills(pos) {
    switch (pos) {
        case 'TOR' : return [ 2, 3, 4, 5 ];
        case 'ABW' : return [ 2, 3, 4, 15 ];
        case 'DMI' : return [ 1, 4, 9, 11 ];
        case 'MIT' : return [ 1, 3, 9, 11 ];
        case 'OMI' : return [ 1, 5, 9, 11 ];
        case 'STU' : return [ 0, 2, 3, 5 ];
        default :    return [];
    }
}

// Gibt die Indizes der (trainierbaren) Sekundaerskills zurueck
function getIdxSecSkills(pos) {
    switch (pos) {
        case 'TOR' : return [ 0, 1, 8, 9, 10, 11, 15 ];
        case 'ABW' : return [ 0, 1, 5, 8, 9, 10, 11 ];
        case 'DMI' : return [ 0, 2, 3, 5, 8, 10, 15 ];
        case 'MIT' : return [ 0, 2, 4, 5, 8, 10, 15 ];
        case 'OMI' : return [ 0, 2, 3, 4, 8, 10, 15 ];
        case 'STU' : return [ 1, 4, 8, 9, 10, 11, 15 ];
        default :    return [];
    }
}

// Gibt die zur Position gehoerige Farbe zurueck
function getColor(pos) {
    switch (pos) {
        case 'TOR' : return '#FFFF00';
        case 'ABW' : return '#00FF00';
        case 'DMI' : return '#3366FF';
        case 'MIT' : return '#66FFFF';
        case 'OMI' : return '#FF66FF';
        case 'STU' : return '#FF0000';
        case 'LEI' : return '#FFFFFF';
        case "" :    return __OSBLAU;
        default :    return "";
    }
}

// ==================== Ende Abschnitt fuer Skilltypen, Skills und Spielreihen ====================

// *** EOF ***

/*** Ende Modul OS2.list.js ***/

/*** Modul OS2.calc.js ***/

// ==UserScript==
// _name         OS2.calc
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities zu OS2-spezifischen Berechnungen
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.list.js
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.calc.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer konstante Parameter bei OS2 ====================

const __SAISONZATS      = 72;   // Anzahl der ZATs pro Saison, ab Saison 3
const __MONATZATS       =  6;   // Anzahl der ZATs pro Abrechnungs-Monat, ab Saison 2
const __SAISONFIRST     =  3;   // Erste Saison mit diesen Parametern, ab Saison 3
const __SAISON6ZATMONAT =  2;   // Erste Saison mit 6 ZATs pro Monat, ab Saison 2

const __OLDSAISONZATS   = 70;   // Anzahl der ZATs pro Saison, nur in der 1. und 2. Saison
const __OLDMONATZATS    =  7;   // Anzahl der ZATs pro Abrechnungs-Monat, nur in der 1. Saison
const __OLDSAISONFIRST  =  1;   // Erste Saison mit diesen Parametern, ab Saison 1

const __OSBLAU          = '#111166';    // Globale Hintergrundfarbe bei OS2

const __NUMOPTI         = 27;
const __NUMSKILLS       = 17;
const __NUMTRAINABLE    = 11;

// ==================== Ende Abschnitt fuer konstante Parameter bei OS2 ====================

// ==================== Abschnitt fuer dezimales Alter (Potential-Berechnung) ====================

// Gibt das dezimale Alter passend zum ganzzahligen Alter und Geburtsdatum eines Spielers zurueck
// age: Ganzzahliges Alter des Spielers
// geb: Geburtsdatum des Spielers
// currZAT: Aktueller ZAT
// return Das Alter des Spielers zum currZAT als Dezimalbruch
function getDezAlter(age, geb, currZAT) {
    const __ZUSATZZATS = ((currZAT < geb)
                        ? (__SAISONZATS - (geb - currZAT))  // ... hat diese Saison noch Geburtstag!
                        : (currZAT - geb));                 // .... hatte diese Saison schon Geburtstag!
    const __DEZALTER = age + (__ZUSATZZATS / __SAISONZATS);

    return __DEZALTER;
}

// ==================== Ende Abschnitt fuer dezimales Alter (Potential-Berechnung) ====================

// ==================== Abschnitt fuer EQ19 (Potential-Berechnung) ====================

// ==================== Abschnitt Werte-Tabellen fuer Potential-Berechnung ====================

// Fuer Skill-Werte von 0 bis 99: Anzahl der Trainings-ZATs, die bei vollem Training (17er/99.5) noetig sind...
const __DAUER = [    0,  1,  2,  3,  4,  5,  6,  7,  8,  9,     //  0 -  9
                    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,     // 10 - 19
                    20, 21, 22, 23, 24, 25, 26, 27, 28, 29,     // 20 - 29
                    30, 31, 32, 33, 34, 35, 36, 37, 38, 39,     // 30 - 39
                    40, 41, 42, 43, 44, 45, 46, 47, 48, 49,     // 40 - 49
                    50, 51, 52, 53, 54, 55, 56, 58, 59, 60,     // 50 - 59
                    62, 63, 65, 66, 68, 70, 71, 73, 75, 77,     // 60 - 69
                    79, 82, 84, 87, 89, 92, 95, 98,101,104,     // 70 - 79
                   108,112,116,120,125,130,136,142,148,155,     // 80 - 89
                   163,171,181,192,205,220,238,261,292,340 ];   // 90 - 99

// Fuer Alter von 0 bis 39: Anzahl der Trainings-ZATs, die bei vollem Training (17er/99.5) noetig sind...
const __TAGE = [ -1505,  -1426,  -1346,  -1267,  -1188,  -1109,  -1030,   -950,   -871,   -792,     //  0 -  9
                  -713,   -634,   -554,-   475,   -396,   -317,   -238,   -158,    -79,      0,     // 10 - 19
                    72,    138,    198,    254,    304,    350,    392,    431,    465,    497,     // 20 - 29
                   526,    551,    575,    596,    615,    632,    648,    662,    674,    685 ];   // 30 - 39

// Fuer Alter von 0 bis 39: Faktor fuer die Restbruchteile des Alters (in Prozent)...
const __FAKTOR = [ 110,110,110,110,110,110,110,110,110,110,     //  0 -  9
                   110,110,110,110,110,110,110,110,110,100,     // 10 - 19
                    92, 84, 77, 70, 64, 58, 53, 48, 44, 40,     // 20 - 29
                    36, 33, 29, 26, 24, 21, 19, 17, 15, 14];    // 30 - 39

// ==================== Abschnitt Hilfsfunktion zur Potential-Berechnung ====================

// Gibt Anzahl trainierter Skillpunkte und Michael Bertrams EQ19
// "Potential" (frueher: "Talent") eines Spielers zurueck.
// Dies ist ein Vergleichswert mit vergleichbaren 19-jaehrigen
// Spielern, die voll mit 17er-Trainer trainiert werden
// dezAlter: Dezimales Alter (also Alter plus ZATsSeitGeb / 72) des Spielers
// skills: Array mit den Spieler-Einzelskills (Index 0 bis 15)
// return Die passenden EQ19-Daten
//        - __TRAINIERT: Anzahl der 11 trainierten Skills (ohne FUQ, ERF und Fix-Skills)
//        - __POTENTIAL: Gewichtete Trainingsleistung unabhaengig vom Alter
function calcPotential(dezAlter, skills) {
    const [ __TRAINIERT, __EQ19 ] = getIdxTrainableSkills().Reduce(
            function (res, skillIdx) {          // Fuer alle trainierbaren Skilltypen...
                const __SKILL = skills[skillIdx];

                res[0] += __SKILL;              // Skillpunkte aufsummieren (trainierte Skills)
                res[1] += __DAUER[__SKILL];     // ZAT-Dauer aufsummieren (Trainingsleistung als ZAT-Dauer)

                return res;
            }, [0, 0]);                         // Start-Werte fuer [ __TRAINIERT, __EQ19 ]

    const __ALTER = Math.min(39, Math.floor(dezAlter));                 // Ganzzahliger Anteil des Alters (max 39)
    const __RESTZAT = Math.round(__SAISONZATS * (dezAlter - __ALTER));  // Tage seit dem (max. 39.) Geburtstag des Spielers
    const __BASISERWARTUNG = __TAGE[__ALTER] + Math.round((__RESTZAT * __FAKTOR[__ALTER]) / 100);  // Erwartete Profi-Trainingsleistung
    const __POTENTIAL = __EQ19 - __BASISERWARTUNG;                      // Trainingsleistung oberhalb des Trainings eines 19j Spielers ohne Skillpunkte

    return [ __TRAINIERT, __POTENTIAL ];
}

// ==================== Ende Abschnitt fuer EQ19 (Potential-Berechnung) ====================

// ==================== Abschnitt fuer Berechnung von Trainergehaeltern und Trainingswahrscheinlichkeiten ====================

// ==================== Abschnitt Konstanten fuer Training ====================

// Konstante 0.99 ^ 99
const __099HOCH99 = 0.36972963764972677265718790562881;

// Faktoren auf Trainingswahrscheinlichkeiten fuer Einsaetze...
const __TRFACTORS = [ 1.00, 1.10, 1.25, 1.35 ];  // Tribuene, Bank, teilweise, durchgehend

// ==================== Ende Abschnitt Konstanten fuer Training ====================

// Gibt das Gehalt eines Trainers zurueck
// tSkill: Trainer-Skill (60, 62.5, ..., 97.5, 99.5)
// tZATs: Trainer-Vertragslaenge (6, 12, ..., 90, 96)
// return Trainer-Gehalt eines Trainers von bestimmtem Skill
function calcTGehalt(tSkill = 99.5, tZATs = 96) {
    const __OLDTSKILL = parseInt((2 * tSkill - 100.5).toFixed(0), 10);
    const __SKILLFACT = Math.pow(__OLDTSKILL - 16.34, 1.26);
    const __ZATFACT = (596 - tZATs) / 500;
    const __GEHALT = 1950 * __SKILLFACT * __ZATFACT;

    return __GEHALT;
}

// Gibt die Wahrscheinlichkeit fuer ein Training zurueck
// alter: Alter des Spielers
// pSkill: Derzeitiger Wert des zu trainierenden Spieler-Skills
// tSkill: Trainer-Skill (60, 62.5, ..., 97.5, 99.5)
// mode: Einsatztyp (0: Tribuene/Basis, 1: Bank, 2: teilweise, 3: durchgehend)
// limit: Obere Grenze (99), Default ist unbegrenzt (undefined)
// return Trainingswahrscheinlichkeit
function calcProbPercent(alter, pSkill = 100, tSkill = 99.5, mode = 0, limit = undefined) {
    const __SKILLDIFF = tSkill - pSkill;
    const __SKILLPLUS = Math.max(0, __SKILLDIFF + 0.5);
    const __SKILLFACT = __SKILLPLUS / (101 - __SKILLPLUS);
    const __ALTER = Math.floor(alter);  // Gesucht ist der ganzzahlige Anteil des Alters!
    const __ALTERFACT = Math.pow((100 - __ALTER) / 37, 7);
    const __PROB = __099HOCH99 * __SKILLFACT * __ALTERFACT * __TRFACTORS[mode];

    return ((limit === undefined) ? __PROB : Math.min(limit, __PROB));
}

// Gibt die Wahrscheinlichkeit fuer ein Training zurueck
// alter: Alter des Spielers
// tSkill: Trainer-Skill (60, 62.5, ..., 97.5, 99.5)
// mode: Einsatztyp (0: Tribuene/Basis, 1: Bank, 2: teilweise, 3: durchgehend)
// prob: Gewuenschte Wahrscheinlichkeit (Default ist 99)
// return Spieler-Skill eines zu trainierenden Spielers, der optimal trainiert wird
function calcMinPSkill(alter, tSkill = 99.5, mode = 0, prob = 99) {
    const __ALTER = Math.floor(alter);  // Gesucht ist der ganzzahlige Anteil des Alters!
    const __ALTERFACT = Math.pow((100 - __ALTER) / 37, 7);
    const __SKILLFACT = prob / (__099HOCH99 * __ALTERFACT * __TRFACTORS[mode]);
    const __SKILLPLUS = 101 * __SKILLFACT / (__SKILLFACT + 1);
    const __SKILLDIFF = Math.max(0, __SKILLPLUS) - 0.5;
    const __PSKILL = tSkill - __SKILLDIFF;

    return Math.max(0, __PSKILL);
}

// Gibt die Trainingswahrscheinlichkeit zurueck
// Format der Rueckgabe: "aaa.bb %", "aa.bb %" bzw. "a.bb %" (keine Deckelung bei 99.00 %)
// probStr: Basis-Wahrscheinlichkeit (= Tribuene) als Prozent-String
// mode: Art des Einsatzes: 0 - Tribuene, 1 - Bank, 2 - Teilweiser Einsatz, 3 - Volleinsatz
// unit: Einheitensymbol (Default: " %")
// fixed: Nachkommastellen (Default: 2)
// limit: Obere Grenze, z.B. 99.0 (Default: aus)
// return String der Trainingswahrscheinlichkeit im oben angegebenen Format
function getProbabilityStr(probStr, mode, unit = " %", fixed = 2, limit = undefined) {
    if ((probStr == "0.00 %") || (probStr == "Trainerskill zu niedrig!")) {
        return "";
    } else {
        let ret = parseFloat(probStr) * __TRFACTORS[mode];

        if (limit) {
            ret = Math.min(limit, ret);
        }

        return ret.toFixed(fixed).toString() + unit;
    }
}

// ==================== Ende Abschnitt fuer Berechnung von Trainergehaeltern und Trainingswahrscheinlichkeiten ====================

// ==================== Abschnitt fuer Berechnung von Marktwerten von Spielern ====================

const __MW5TF = 1.00;  // Zufaelliger Faktor zwischen 0.97 und 1.03, mal als 1.00 angenommen

const __MW9FORMEL = false;  // alte MW-Formel bis Saison 9
const __MW10FORMEL = true;  // neue MW-Formel ab Saison 10

// Berechnet den Marktwert eines Spielers
// age: Alter als Dezimalbruch
// skill: Skill-Schnitt
// opti: Opti-Schnitt
// mwFormel: Angabe ueber die Marktwert-Formel:
// - false: Formel, die bis Saison 9 genutzt wurde
// - true: Formel, die seit Saison 10 genutzt wird
// return Marktwert des Spielers mit o.a. Werten
function calcMarketValue(age, skill, opti, mwFormel = __MW10FORMEL) {
    const __AGE = age;
    const __SKILL = skill;
    const __OPTI = opti;

    if (mwFormel === __MW9FORMEL) {
        return Math.round(Math.pow((1 + (__SKILL / 100)) * (1 + (__OPTI / 100)) * (2 - (__AGE / 100)), 10) * 2);    // Alte Formel bis Saison 9
    } else {  // MW-Formel ab Saison 10...
        return Math.round(Math.pow(1 + (__SKILL / 100), 5.65) * Math.pow(1 + (__OPTI / 100), 8.1) * Math.pow(1 + ((100 - __AGE) / 49), 10) * __MW5TF);
    }
}

// ==================== Ende Abschnitt fuer Berechnung von Marktwerten von Spielern ====================

// *** EOF ***

/*** Ende Modul OS2.calc.js ***/

/*** Modul OS2.team.js ***/

// ==UserScript==
// _name         OS2.team
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifische Funktionen und Utilities zu Teams
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.prop.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.run.js
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.list.js
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.team.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse TeamClassification ====================

// Klasse fuer die Klassifikation der Optionen nach Team (Erst- und Zweitteam oder Fremdteam)

/*class*/ function TeamClassification /*extends Classification {
    constructor*/() {
        'use strict';

        Classification.call(this);

        this.prefix = undefined;

        this.team = undefined;
        this.teamParams = undefined;
    }
//}

Class.define(TeamClassification, Classification, {
                    'assign'          : function(optSet, optParams) {
                                            Classification.prototype.assign.call(this, optSet, optParams);
                                            this.teamParams = optParams.teamParams;
                                        },
                    'renameParamFun'  : function() {
                                            const __MYTEAM = (this.team = getMyTeam(this.optSet, this.teamParams, this.team));

                                            if (__MYTEAM.LdNr) {
                                                // Prefix fuer die Optionen mit gesonderten Behandlung...
                                                this.prefix = __MYTEAM.LdNr.toString() + '.' + __MYTEAM.LgNr.toString();
                                            } else {
                                                this.prefix = undefined;
                                            }

                                            return this.prefixParamFun();
                                        }
                });

// ==================== Ende Abschnitt fuer Klasse TeamClassification ====================

// ==================== Abschnitt fuer Klasse Team ====================

// Klasse fuer Teamdaten

/*class*/ function Team /*{
    constructor*/(team, land, liga, teamId) {
        'use strict';

        this.Team = team;
        this.Land = land;
        this.Liga = liga;
        this.TmNr = (teamId || 0);
        this.LdNr = getLandNr(land);
        this.LgNr = getLigaNr(liga);
    }
//}

Class.define(Team, Object, {
                    '__TEAMITEMS' : {   // Items, die in Team als Teamdaten gesetzt werden...
                                        'Team' : true,
                                        'Liga' : true,
                                        'Land' : true,
                                        'TmNr' : true,
                                        'LdNr' : true,
                                        'LgNr' : true
                                    }
                });

// ==================== Ende Abschnitt fuer Klasse Team ====================

// ==================== Abschnitt fuer Klasse Verein ====================

// Klasse fuer Vereinsdaten

/*class*/ function Verein /*extends Team {
    constructor*/(team, land, liga, teamId, manager, flags) {
        'use strict';

        Team.call(this, team, land, liga, teamId);

        this.Manager = manager;
        this.Flags = (flags || []);

        Object.defineProperty(this, 'ID', {
                enumerable    : false,
                configurable  : true,
                get           : function() {
                                    return this.TmNr;
                                },
                set           : undefined
            });
    }
//}

Class.define(Verein, Team, {
                    '__TEAMITEMS' : {   // Items, die in Verein als Teamdaten gesetzt werden...
                                        'Team'    : true,
                                        'Liga'    : true,
                                        'Land'    : true,
                                        'TmNr'    : true,
                                        'LdNr'    : true,
                                        'LgNr'    : true,
                                        'Manager' : true,
                                        'Flags'   : true
                                    }
                });

// ==================== Ende Abschnitt fuer Klasse Verein ====================

// ==================== Abschnitt zu Teamdaten ====================

// Gibt die Teamdaten zurueck und aktualisiert sie ggfs. in der Option
// optSet: Platz fuer die gesetzten Optionen
// teamParams: Dynamisch ermittelte Teamdaten ('Team', 'Liga', 'Land', 'TmNr', 'LdNr' und 'LgNr')
// myTeam: Objekt fuer die Teamdaten
// return Die Teamdaten oder undefined bei Fehler
function getMyTeam(optSet = undefined, teamParams = undefined, myTeam = new Team()) {
    if (teamParams !== undefined) {
        addProps(myTeam, teamParams, myTeam.__TEAMITEMS);
        __LOG[2]("Ermittelt: " + safeStringify(myTeam));
        // ... und abspeichern, falls erweunscht...
        if (optSet && optSet.team) {
            optSet.setOpt('team', myTeam, false);
        }
    } else {
        const __TEAM = ((optSet && optSet.team) ? optSet.getOptValue('team') : undefined);  // Gespeicherte Parameter

        if ((__TEAM !== undefined) && (__TEAM.Land !== undefined)) {
            addProps(myTeam, __TEAM, myTeam.__TEAMITEMS);
            __LOG[2]("Gespeichert: " + safeStringify(myTeam));
        } else {
            __LOG[3]("Team nicht ermittelt: " + safeStringify(__TEAM));
        }
    }

    return myTeam;
}

// ==================== Ende Abschnitt zu Teamdaten ====================

// *** EOF ***

/*** Ende Modul OS2.team.js ***/

/*** Modul OS2.page.team.js ***/

// ==UserScript==
// _name         OS2.page.team
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifische Funktionen zur Ermittlung des Teams auf den Seiten
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.page.team.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Ermittlung des Teams von einer OS2-Seite ====================

const __TEAMSEARCHHAUPT = {  // Parameter zum Team "<b>Willkommen im Managerb&uuml;ro von TEAM</b><br>LIGA LAND<a href=..."
        'Tabelle'   : 'table table',  // Erste Tabelle innerhalb einer Tabelle...
        'Zeile'     : 0,
        'Spalte'    : 1,
        'start'     : " von ",
        'middle'    : "</b><br>",
        'liga'      : ". Liga",
        'land'      : ' ',
        'end'       : "<a href="
    };

const __TEAMSEARCHTEAM = {  // Parameter zum Team "<b>TEAM - LIGA <a href=...>LAND</a></b>"
        'Tabelle'   : 'table table',  // Erste Tabelle innerhalb einer Tabelle...
        'Zeile'     : 0,
        'Spalte'    : 0,
        'start'     : "<b>",
        'middle'    : " - ",
        'liga'      : ". Liga",
        'land'      : 'target="_blank">',
        'end'       : "</a></b>"
    };

const __TEAMIDSEARCHHAUPT = {  // Parameter zur Team-ID "<b>Deine Spiele in</b>...<a href="livegame/index.php?spiele=TEAMID,ZAT">LIVEGAME</a>"
        'Tabelle'   : 'table',  // Aeussere Tabelle, erste ueberhaupt (darunter die Zeile #6 "Deine Spiele in")...
        'Zeile'     : 6,
        'Spalte'    : 0,
        'start'     : '<a href="livegame/index.php?spiele=',
        'end'       : '">LIVEGAME</a>',
        'delim'     : ','
    };

const __TEAMIDSEARCHTEAM = {  // Parameter zur Team-ID "<a hspace="20" href="javascript:tabellenplatz(TEAMID)">Tabellenpl\u00E4tze</a>"
        'Tabelle'   : 'table',  // Aeussere Tabelle, erste ueberhaupt (darunter die Zeile #1/Spalte #1 "Tabellenplaetze")...
        'Zeile'     : 1,
        'Spalte'    : 1,
        'start'     : '<a hspace="20" href="javascript:tabellenplatz(',
        'end'       : ')">Tabellenpl\u00E4tze</a>',
        'delim'     : null
    };

// Ermittelt, wie das eigene Team heisst und aus welchem Land bzw. Liga es kommt (zur Unterscheidung von Erst- und Zweitteam)
// teamSearch: Muster fuer die Suche nach Team, die Eintraege fuer 'start', 'middle', 'liga', 'land' und 'end' enthaelt, ausserdem die
//              Adresse der Tabellenzelle mit den Parametern zum Team "startTEAMmiddleLIGA...landLANDend", LIGA = "#liga[ (A|B|C|D)]"
// teamIdSearch: Muster fuer die Suche nach Team-ID, die Eintraege fuer 'start' und 'end' enthaelt, ausserdem die
//              Adresse der Tabellenzelle mit den Parametern zur Team-ID "startTEAMIDend"
// doc: Optionale Angabe des Dokuments, in dem die Tabelle gesucht wird  (Default: document)
// return Im Beispiel { 'Team' : "TEAM", 'Liga' : "LIGA", 'Land' : "LAND", 'TmNr' : TEAMID, 'LdNr' : LAND-NUMMER, 'LgNr' : LIGA-NUMMER },
//        z.B. { 'Team' : "Choromonets Odessa", 'Liga' : "1. Liga", 'Land' : "Ukraine", 'TmNr' : 930, 'LdNr' : 20, 'LgNr' : 1 }
function getTeamParamsFromTable(teamSearch, teamIdSearch, doc = document) {
    // Ermittlung von Team, Liga und Land...
    const __TEAMSEARCH   = getValue(teamSearch, __TEAMSEARCHHAUPT);
    const __TEAMTABLE    = getElement(getValue(__TEAMSEARCH.Tabelle, 'table table'), 0, doc);
    const __TEAMCELLROW  = getValue(__TEAMSEARCH.Zeile, 0);
    const __TEAMCELLCOL  = getValue(__TEAMSEARCH.Spalte, 0);
    const __TEAMCELLSTR  = (__TEAMTABLE === undefined) ? "" : __TEAMTABLE.rows[__TEAMCELLROW].cells[__TEAMCELLCOL].innerHTML;
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

    // Ermittlung der Team-ID (indirekt ueber den Livegame- bzw. Tabellenplatz-Link)...
    const __TEAMIDSEARCH   = getValue(teamIdSearch, __TEAMIDSEARCHHAUPT);
    const __TEAMIDTABLE    = getElement(getValue(__TEAMIDSEARCH.Tabelle, 'table'), 0, doc);
    const __TEAMIDCELLROW  = getValue(__TEAMIDSEARCH.Zeile, 6);
    const __TEAMIDCELLCOL  = getValue(__TEAMIDSEARCH.Spalte, 0);  // Alternativ: 'a[href^=livegame]' (outerHTML)
    const __TEAMIDCELLSTR  = (__TEAMIDTABLE === undefined) ? "" : __TEAMIDTABLE.rows[__TEAMIDCELLROW].cells[__TEAMIDCELLCOL].innerHTML;
    const __SEARCHIDSTART  = __TEAMIDSEARCH.start;
    const __SEARCHIDEND    = __TEAMIDSEARCH.end;
    const __SEARCHIDDELIM    = __TEAMIDSEARCH.delim;
    const __INDEXIDSTART   = __TEAMIDCELLSTR.indexOf(__SEARCHIDSTART);
    const __INDEXIDEND     = __TEAMIDCELLSTR.indexOf(__SEARCHIDEND);
    const __INDEXIDDELIM   = (__SEARCHIDDELIM ? __TEAMIDCELLSTR.lastIndexOf(__SEARCHIDDELIM, __INDEXIDEND) : __INDEXIDEND);
    const __TEAMIDSTR      = __TEAMIDCELLSTR.substring(__INDEXIDSTART + __SEARCHIDSTART.length, __INDEXIDDELIM);
    const __TEAMID         = Number.parseInt(__TEAMIDSTR, 10);

    const __TEAM = new Team(__TEAMNAME, land, liga, __TEAMID);

    return __TEAM;
}

// ==================== Ende Abschnitt fuer Ermittlung des Teams von einer OS2-Seite ====================

// *** EOF ***

/*** Ende Modul OS2.page.team.js ***/

/*** Modul OS2.page.js ***/

// ==UserScript==
// _name         OS2.page
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifische Funktionen zur Ermittlung von Daten auf den Seiten
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.page.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Parameter von den OS2-Seiten ====================

// Verarbeitet die URL der Seite und ermittelt die Nummer der gewuenschten Unterseite
// url: Adresse der Seite
// leafs: Liste von Filenamen mit Basis-Seitennummern (zu denen ggfs. Query-Parameter addiert wird)
// item: Query-Parameter, der die Nummer der Unterseite angibt (wird zur Basisnummer addiert),
//      allerdings nur, wenn Basis-Seitennummer positiv ist, ansonsten Absolutwert ohne Unterseite
// return Parameter aus der URL der Seite als Nummer (-1, falls nicht gefunden)
function getPageIdFromURL(url, leafs, item = 'page') {
    const __URI = new URI(url);
    const __LEAF = __URI.getLeaf();

    for (let leaf in leafs) {
        if (__LEAF === leaf) {
            const __BASE = getValue(leafs[leaf], 0);
            const __ITEM = getValue(__URI.getQueryPar(item), 0);

            return Math.abs(__BASE) + ((__BASE >= 0) ? __ITEM : 0);
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

// Liest aus, ob der Spieler Torwart oder Feldspieler ist (Version mit Zelle)
// cell: Eine fuer TOR eingefaerbte Zelle
// return Angabe, der Spieler Torwart oder Feldspieler ist
function isGoalieFromCell(cell) {
    return (cell.className === 'TOR');
}

// Liest aus, ob der Spieler Torwart oder Feldspieler ist (Version mit Zell-Array)
// cells: Die Zellen einer Zeile
// colIdxClass: Spaltenindex einer fuer TOR eingefaerbten Zelle (Default: 0)
// return Angabe, der Spieler Torwart oder Feldspieler ist
function isGoalieFromHTML(cells, colIdxClass = 0) {
    return isGoalieFromCell(cells[colIdxClass]);
}

// ==================== Ende Abschnitt fuer Parameter von den OS2-Seiten ====================

// ==================== Abschnitt fuer Hilfsfunktionen ====================

// Liefert umschlossenen textContent und einen der einem <a>-Link uebergebenen Parameter.
// Als Drittes wird optional der ganze Ziel-Link (das href) zurueckgegeben.
// element: Eine <a>-Node mit href-Link
// queryID: Name des Parameters innerhalb der URL, der die ID liefert
// return Text, ID und href-Link
function getLinkData(element, queryID) {
    checkType(element && element.href, 'string', true, 'getLinkData', 'element.href', 'String');
    checkType(queryID, 'string', false, 'getLinkData', 'queryID', 'String');

    const __A = element; // <a href="https://.../...?QUERYID=ID">TEXT</a>
    const __TEXT = __A.textContent;
    const __HREF = __A.href;
    const __URI = new URI(__HREF);
    const __ID = __URI.getQueryPar(queryID);

    return [ __TEXT, __ID, __HREF ];
}

// Liefert den HTML-Code fuer einen parametrisierten <img>-Link.
// imageURL: URL des verlinkten Bildes
// title: Tooltip des Bildes (Default: null fuer kein Tooltip)
// altText: ALT-Parameter fuer Ausgabe ohne Bild (Default: Tooltip-Text)
// return String mit HTML-Code des <img>-Links
function getImgLink(imageURL, title = null, altText = title) {
    checkType(imageURL, 'string', true, 'getImgLink', 'imageURL', 'String');
    checkType(title, 'string', false, 'getImgLink', 'title', 'String');
    checkType(altText, 'string', false, 'getImgLink', 'altText', 'String');

    const __ALTSTR = (altText ? (' alt="' + altText + '"') : "");
    const __IMGSTR = '<img src="' + imageURL + '"' + __ALTSTR + ' />';
    const __RETSTR = (title ? ('<abbr title="' + title + '">' + __IMGSTR + '</abbr>') : __IMGSTR);

    return __RETSTR;
}

// Liefert den HTML-Code fuer einen parametrisierten <a>-Link auf ein OS-Team.
// teamName: Name des Teams fuer den textContent
// osID: OS-ID des Teams
// return String mit HTML-Code des <a>-Team-Links
function getTeamLink(teamName, osID) {
    checkType(teamName, 'string', true, 'getTeamLink', 'teamName', 'String');
    checkType(osID, 'number', true, 'getTeamLink', 'osID', 'Number');

    const __RETSTR = '<a href="/st.php?c=' + osID + '" onClick="teaminfo(' + osID + ');return false;">' + teamName + '</a>';

    return __RETSTR;
}

// Liefert den HTML-Code fuer einen parametrisierten <a>-Link auf das Manager-PM-Fenster.
// managerName: Name des Managers fuer den textContent
// pmID: User-ID des Managers im PM-System von OS2
// return String mit HTML-Code des <a>-Manager-Links, falls pmID okay, ansonsten nur Managername geklammert
function getManagerLink(managerName, pmID) {
    checkType(managerName, 'string', true, 'getManagerLink', 'managerName', 'String');
    checkType(pmID, 'number', true, 'getManagerLink', 'pmID', 'Number');

    const __RETSTR = (pmID > -1) ? ('<a href="/osneu/pm?action=writeNew&receiver_id=' + pmID
                    + '" onclick="writePM(" + pmID + ");return false;" target="_blank">'
                    + managerName + '</a>') : ('(' + managerName + ')');

    return __RETSTR;
}

// ==================== Ende Abschnitt fuer Hilfsfunktionen ====================

// *** EOF ***

/*** Ende Modul OS2.page.js ***/

/*** Modul OS2.zat.js ***/

// ==UserScript==
// _name         OS2.zat
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifische Funktionen fuer Spielplan und ZATs und Klasse RundenLink
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.zat.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Spielplan und ZATs ====================

// ==================== Abschnitt fuer Klasse RundenLink ====================

/*class*/ function RundenLink /*{
    constructor*/(saison, team) {
        'use strict';

        this.uri = new URI("http://os.ongapo.com/");
        this.runde = 0;
        this.prop = "";
        this.label = "";

        this.setAktion("Statistik+ausgeben");

        if (saison) {
            this.setSaison(saison);
        }
        if (team) {
            this.setTeam(team);
        }
    }
//}

Class.define(RundenLink, Object, {
        'setSaison'    : function(saison) {
                             this.uri.setQueryPar('saauswahl', saison);
                         },
        'setTeam'      : function(team) {
                             this.uri.setQueryPar('landauswahl', team.LdNr);
                             this.uri.setQueryPar('ligaauswahl', team.LgNr);
                             this.uri.setQueryPar('hl',          team.TmNr);
                         },
        'setPage'      : function(page, label) {
                             this.uri.home();
                             this.uri.down(page + ".php");
                             this.setLabel(label);
                         },
        'setRunde'     : function(prop, runde) {
                             this.prop = prop;
                             this.runde = runde;
                         },
        'setLabel'     : function(label) {
                             this.label = (label || "");
                         },
        'setAnzeigen'  : function(show = true) {
                             this.uri.setQueryPar('erganzeigen', (show ? 1 : 0));
                         },
        'setAktion'    : function(aktion = "Statistik+ausgeben") {
                             this.uri.setQueryPar('stataktion', aktion);
                         },
        'getLabel'     : function() {
                             return (this.label || "Link");
                         },
        'getHTML'      : function(target = undefined) {
                             if ((this.runde <= 0) || (! this.uri.getLeaf())) {
                                 return this.label;
                             } else {
                                 if (this.prop) {
                                     this.uri.setQueryPar(this.prop, this.runde);
                                 }

                                 return "<a " + URI.prototype.formatParams({
                                                                      'href'   : this.uri.getPath(),
                                                                      'target' : (target ? target : '_blank')
                                                                  }, function(value) {
                                                                         return '"' + value + '"';
                                                                     }, ' ', '=') + '>' + this.getLabel() + "</a>";
                             }
                         }
    });

// ==================== Ende Abschnitt fuer Klasse RundenLink ====================

// Liefert einen vor den ersten ZAT zurueckgesetzten Spielplanzeiger
// saison: Enthaelt die Nummer der laufenden Saison
// ligaSize: Anzahl der Teams in dieser Liga (Gegner + 1)
// - ZATs pro Abrechnungsmonat
// - Saison
// - ZAT
// - GameType
// - Heim/Auswaerts
// - Gegner
// - Tore
// - Gegentore
// - Ligengroesse
// - Ligaspieltag
// - Pokalrunde
// - Eurorunde
// - Hin/Rueck
// - ZAT Rueck
// - ZAT Korr
function firstZAT(saison, ligaSize) {
    return {             // Erste Saison 7 ZAT, danach 6 ZAT...
        'anzZATpMonth' : ((saison < __SAISON6ZATMONAT) ? __OLDMONATZATS : __MONATZATS),
        'saison'       : saison,
        'ZAT'          : 0,
        'gameType'     : 'spielfrei',
        'heim'         : true,
        'gegner'       : "",
        'gFor'         : 0,
        'gAga'         : 0,
        'ligaSize'     : ligaSize,
        'ligaSpieltag' : 0,
        'pokalRunde'   : 1,
        'euroRunde'    : 0,
        'hinRueck'     : __HINRUECKNULL,    // 0: Hin, 1: Rueck, 2: unbekannt
        'ZATrueck'     : 0,
        'ZATkorr'      : 0
    };
}

// Liefert den ZAT als String
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT
// longStats: Formatiert die Langversion des Textes
function getZAT(currZAT, longStats) {
    return (longStats ? currZAT.gameType + ' ' + (currZAT.heim ? "Heim" : "Ausw\u00E4rts") + ' ' : "") +
           (longStats ? '[' + currZAT.ligaSpieltag + ' ' + currZAT.pokalRunde + ' ' + currZAT.euroRunde + "] " : "") +
           (longStats ? '[' + currZAT.ZATrueck + __HINRUECK[currZAT.hinRueck] +
                        ' ' + ((currZAT.ZATkorr < 0) ? "" : '+') + currZAT.ZATkorr + "] " : "") +
           (longStats ? currZAT.gegner + ((currZAT.gFor > -1) ? " (" + currZAT.gFor + " : " + currZAT.gAga + ')' : "") + ' ' : "") +
           'S' + currZAT.saison + "-Z" + ((currZAT.ZAT < 10) ? '0' : "") + currZAT.ZAT;
}

// Liefert die ZATs der Sonderspieltage fuer 10er- (2) und 20er-Ligen (4)
// saison: Enthaelt die Nummer der laufenden Saison
// return [ 10erHin, 10erRueck, 20erHin, 20erRueck ], ZAT-Nummern der Zusatzspieltage
function getLigaExtra(saison) {
    if (saison < __SAISONFIRST) {
        return [ 8, 64, 32, 46 ];
    } else {
        return [ 9, 65, 33, 57 ];
    }
}

// Spult die Daten um anzZAT ZATs vor und schreibt Parameter
// anhand des Spielplans fort. Also Spieltag, Runde, etc.
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT
// anzZAT: Anzahl der ZAT, um die vorgespult wird
function incZAT(currZAT, anzZAT = 1) {
    const __LIGAEXTRA = getLigaExtra(currZAT.saison);
    const __LIGAFIRST = 3 - (__LIGAEXTRA[0] % 2);

    for (let i = anzZAT; i > 0; i--) {
        currZAT.ZAT++;
        if ((currZAT.ZAT - __LIGAFIRST + 1) % 2 === 1) {
            currZAT.ligaSpieltag++;
        } else {
            const __POS = __LIGAEXTRA.indexOf(currZAT.ZAT);

            if (~ __POS) {
                if (__POS < 2 * (currZAT.ligaSize % 9)) {
                    currZAT.ligaSpieltag++;
                }
            }
        }
        if ((currZAT.ZAT > 12) && ((currZAT.ZAT % 10) === 5)) {    // passt fuer alle Saisons: 12, 20, 30, 40, 48, 58, 68 / 3, 15, 27, 39, 51, 63, 69
            currZAT.pokalRunde++;
        }
        if (((currZAT.ZAT + currZAT.ZATkorr) % 6) === 4) {
            if (currZAT.ZAT < 63) {
                currZAT.ZATrueck = currZAT.ZAT + 2;
                currZAT.euroRunde++;
                currZAT.hinRueck = __HINRUECKHIN;
            } else {
                currZAT.euroRunde = 11;    // Finale
                currZAT.hinRueck = __HINRUECKNULL;
            }
        }
        if (currZAT.ZAT === currZAT.ZATrueck) {
            currZAT.hinRueck = __HINRUECKRUECK;     // 5, 7; 11, 13;  (17, 19)  / 23,   25; 29, 31; 35,  37; 41,  43; 47, 49; 53,  55; 59,  61; 69
            if (currZAT.saison < __SAISONFIRST) {   // 4, 6; 10, 14*; (16, 22*) / 24**, 26; 34, 36; 38*, 42; 44*, 50; 52, 54; 56*, 60; 62*, 66; 70
                if (currZAT.ZAT === 22) {
                    currZAT.ZATkorr = 4;
                } else if ((currZAT.ZAT - 6) % 20 > 6) {
                    currZAT.ZATkorr = 2;
                } else {
                    currZAT.ZATkorr = 0;
                }
                if ((currZAT.ZAT === 22) || (currZAT.ZAT === 30)) {
                    currZAT.euroRunde--;    // Frueher: 3. Quali-Rueckspiel erst knapp vor 1. Hauptrunde
                }
            }
        }
    }
}

// Liefert die Beschreibung des Spiels am aktuellen ZAT fuer das Team
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT (inkl. Saison)
// team: Enthaelt ein Team-Objekt fuer das betroffene Team
// showLink: Angabe, ob ein Link eingefuegt werden soll (normalerweise true)
// return Beschreibung des Spiels mit Link, falls showLink true ist, sonst Leerstring
function getZatLink(currZAT, team, showLink = true) {
    const __LINK = new RundenLink(currZAT.saison, team);

    if (currZAT.gameType === 'Liga') {
        if (currZAT.ZAT < 70) {
            __LINK.setRunde('stauswahl', currZAT.ligaSpieltag);
            __LINK.setPage('ls', __LINK.runde + ". Spieltag");
        } else {
            __LINK.setLabel("Relegation");
        }
    } else if (currZAT.gameType === 'LP') {
        __LINK.setRunde('stauswahl', currZAT.pokalRunde);
        __LINK.setPage('lp', __POKALRUNDEN[__LINK.runde]);
    } else if ((currZAT.gameType === 'OSCQ') || (currZAT.gameType === 'OSEQ')) {
        __LINK.setRunde('runde', currZAT.euroRunde);
        __LINK.setPage(((currZAT.gameType === 'OSCQ') ? 'oscq' : 'oseq'), __QUALIRUNDEN[__LINK.runde] + __HINRUECK[currZAT.hinRueck]);
    } else if (currZAT.gameType === 'OSC') {
        if (currZAT.euroRunde < 9) {
            const __GRUPPENPHASE = ((currZAT.euroRunde < 6) ? "HR-Grp. " : "ZR-Grp. ");

            __LINK.setRunde("", (currZAT.euroRunde % 3) * 2 + 1 + currZAT.hinRueck);
            __LINK.setPage(((currZAT.euroRunde < 6) ? 'oschr' : 'osczr'), __GRUPPENPHASE + "Spiel " + __LINK.runde);
        } else {
            __LINK.setPage('oscfr', __OSCRUNDEN[currZAT.euroRunde - 8] + __HINRUECK[currZAT.hinRueck]);
        }
    } else if (currZAT.gameType === 'OSE') {
        __LINK.setRunde('runde', currZAT.euroRunde - 3);
        __LINK.setPage('ose', __OSERUNDEN[__LINK.runde] + __HINRUECK[currZAT.hinRueck]);
    } else if (currZAT.gameType === 'Supercup') {
        __LINK.setRunde("", 1);
        __LINK.setPage('supercup', currZAT.gameType);
    } else {
        __LINK.setLabel();  // irgendwie besser lesbar! ("Friendly" bzw. "spielfrei"/"Frei"/"reserviert")
    }
    __LINK.setAnzeigen(true);

    return (showLink ? __LINK.getHTML() : "");
}

// Fuegt einen Link auf die Ligatabelle hinzu, falls es ein Ligaspiel ist
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT (inkl. Saison)
// team: Enthaelt ein Team-Objekt fuer das betroffene Team
// label: Text, der ggfs. mit dem Link angezeigt werden soll
// showLabel: Angabe, ob das Label in jedem Fall angezeigt werden soll (normalerweise true)
// return Uebergebenes Label mit Link, falls showLabel true ist, sonst ggfs. nur das Label
function addTableLink(currZAT, team, label, showLabel = true) {
    const __LINK = new RundenLink(currZAT.saison, team);

    if (showLabel) {
        __LINK.setLabel(label);
    }

    if (currZAT.gameType === 'Liga') {
        if (currZAT.ZAT < 70) {
            if (label) {
                __LINK.setPage('lt', label);
                __LINK.setRunde("", 1);
            }
        }
    }

    return __LINK.getHTML();
}

// ==================== Abschnitt fuer Statistiken des Spielplans ====================

// Liefert eine auf 0 zurueckgesetzte Ergebnissumme
// - Siege
// - Unentschieden
// - Niederlagen
// - Tore
// - Gegentore
// - Siegpunkte
function emptyStats() {
    return {
        'S'    : 0,
        'U'    : 0,
        'N'    : 0,
        'gFor' : 0,
        'gAga' : 0,
        'P'    : 0
    };
}

// Liefert die Stats als String
// stats: Enthaelt die summierten Stats
// longStats: Formatiert die Langversion des Textes
function getStats(stats, longStats) {
    return (longStats ? '[' + stats.S + ' ' + stats.U + ' ' + stats.N + "] " : "/ ") +
           stats.gFor + ':' + stats.gAga + ' ' + ((stats.gFor < stats.gAga) ? "" : (stats.gFor > stats.gAga) ? '+' : "") +
           (stats.gFor - stats.gAga) + " (" + stats.P + ')';
}

// Summiert ein Ergebnis auf die Stats und liefert den neuen Text zurueck
// stats: Enthaelt die summierten Stats
// longStats: Formatiert die Langversion des Textes
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT (mit dem Ergebnis)
function addResultToStats(stats, longStats, currZAT) {
    let ret = "";

    if (currZAT.gFor > -1) {
        let p = 0;

        if (currZAT.gFor > currZAT.gAga) {
            stats.S++;
            p = 3;
        } else if (currZAT.gFor === currZAT.gAga) {
            stats.U++;
            p = 1;
        } else {
            stats.N++;
        }
        stats.P += p;
        stats.gFor += currZAT.gFor;
        stats.gAga += currZAT.gAga;

        ret = getStats(stats, longStats);
    }

    return ret;
}

// ==================== Abschnitt fuer sonstige Parameter ====================

// Ermittelt den Spielgegner aus einer Tabellenzelle und liefert den Namen zurueck
// cell: Tabellenzelle mit dem Namen des Gegners
// return Der Name des Gegners
function getGegnerFromCell(cell) {
    const __GEGNER = cell.textContent;
    const __POS = __GEGNER.indexOf(" (");

    if (~ __POS) {
        return __GEGNER.substr(0, __POS);
    } else {
        return __GEGNER;
    }
}

// Ermittelt den Namen des Spielgegners aus einer Tabellenzelle und setzt gegner im Spielplanzeiger
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT
// cell: Tabellenzelle mit dem Namen des Gegners
function setGegnerFromCell(currZAT, cell) {
    const __GEGNER = getGegnerFromCell(cell);

    currZAT.gegner = __GEGNER;
}

// Ermittelt die Spielart aus einer Tabellenzelle, etwa "Liga : Heim", und liefert zwei Werte zurueck
// cell: Tabellenzelle mit Eintrag "Liga : Heim" (Spielplan) oder "Liga  Heim: " (Managerbuero)
// return { "Liga", "Heim" } im Beispiel
function getSpielArtFromCell(cell) {
    const __TEXT = cell.textContent.replace('\u00A0', "").replace(':', "").replace("  ", ' ');
    const __SPIELART = __TEXT.split(' ', 2);

    return __SPIELART;
}

// Ermittelt die Spielart aus einer Tabellenzelle und setzt gameType/heim im Spielplanzeiger
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT
// cell: Tabellenzelle mit Eintrag "Liga : Heim" oder "Liga Heim"
function setSpielArtFromCell(currZAT, cell) {
    const __SPIELART = getSpielArtFromCell(cell);

    currZAT.gameType = __SPIELART[0];
    currZAT.heim     = (__SPIELART.length < 2) || (__SPIELART[1] === 'Heim');
}

// Gibt die ID fuer den Namen eines Wettbewerbs zurueck
// cell: Tabellenzelle mit Link auf den Spielberichts-Link
// gameType: Name des Wettbewerbs eines Spiels
// label: Anzuklickender Text des neuen Links
// return HTML-Link auf die Preview-Seite fuer diesen Spielbericht
function getBilanzLinkFromCell(cell, gameType, label) {
    const __GAMETYPEID = getGameTypeID(gameType);
    let ret = "";

    if (cell.textContent !== 'Vorschau') {   // Nur falls Link nicht bereits vorhanden
        if (__GAMETYPEID > 1) {              // nicht moeglich fuer "Friendly" bzw. "spielfrei"/"Frei"/"reserviert"
            const __SEARCHFUN = ":os_bericht(";
            let paarung = cell.innerHTML.substr(cell.innerHTML.indexOf(__SEARCHFUN) + __SEARCHFUN.length);

            paarung = paarung.substr(0, paarung.indexOf(')'));
            paarung = paarung.substr(0, paarung.lastIndexOf(','));
            paarung = paarung.substr(0, paarung.lastIndexOf(','));
            ret = ' <a href="javascript:spielpreview(' + paarung + ',' + __GAMETYPEID + ')">' + label + "</a>";
        }
    }

    return ret;
}

// Addiert einen Link auf die Bilanz hinter den Spielberichts-Link
// cell: Tabellenzelle mit Link auf den Spielberichts-Link
// gameType: Name des Wettbewerbs eines Spiels
// label: Anzuklickender Text des neuen Links
function addBilanzLinkToCell(cell, gameType, label) {
    const __BILANZLINK = getBilanzLinkFromCell(cell, gameType, label);

    if (__BILANZLINK !== "") {
        cell.innerHTML += __BILANZLINK;
    }
}

// ==================== Abschnitt fuer sonstige Parameter des Spielplans ====================

// Ermittelt aus dem Spielplan die Ligengroesse ueber die Sonderspieltage
// rows: Tabellenzeilen mit dem Spielplan
// startIdx: Index der Zeile mit dem ersten ZAT
// colArtIdx: Index der Spalte der Tabellenzelle mit der Spielart (z.B. "Liga : Heim")
// saison: Enthaelt die Nummer der laufenden Saison
// return 10 bei 36 Spielen, 18 bei 34 Spielen, 20 bei 38 Spielen
function getLigaSizeFromSpielplan(rows, startIdx, colArtIdx, saison) {
    const __LIGAEXTRA = getLigaExtra(saison);
    const __TEST10ER = getSpielArtFromCell(rows[startIdx + __LIGAEXTRA[0] - 1].cells[colArtIdx]);
    const __TEST20ER = getSpielArtFromCell(rows[startIdx + __LIGAEXTRA[2] - 1].cells[colArtIdx]);

    if (__TEST20ER[0] === 'Liga') {
        return 20;
    } else if (__TEST10ER[0] === 'Liga') {
        return 10;
    } else {
        return 18;
    }
}

// ==================== Ende Abschnitt fuer sonstige Parameter des Spielplans ====================

// ==================== Ende Abschnitt fuer Spielplan und ZATs ====================

// *** EOF ***

/*** Ende Modul OS2.zat.js ***/

/*** Modul OS2.class.warndraw.js ***/

// ==UserScript==
// _name         OS2.class.warndraw
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifischen Klassen WarnDrawPlayer, WarnDrawMessage und WarnDrawMessageAufstieg
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.class.warndraw.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse WarnDrawPlayer ====================

// Klasse fuer Ziehwarnung fuer einen Jugendspieler

/*class*/ function WarnDrawPlayer /*{
    constructor*/(player, alertColor) {
        'use strict';

        this.player = player;

        if (this.player !== undefined) {
            // Default Warnlevel...
            this.setZatLeft(player.getZatLeft());
            this.currZAT = player.currZAT;
            this.setWarn(true, true, true);
            this.colAlert = alertColor || this.alertColor();
        } else {
            // Kein Warnlevel...
            this.setZatLeft(undefined);
            this.currZAT = undefined;
            this.setWarn(false, false, false);
            this.colAlert = undefined;
        }
    }
//}

Class.define(WarnDrawPlayer, Object, {
        '__MONATEBISABR'    : 1,
        '__ZATWARNVORLAUF'  : 1,
        '__ZATMONATVORLAUF' : __MONATZATS,
        'setZatLeft'        : function(zatLeft) {
                                  this.zatLeft = zatLeft;
                              },
        'setWarn'           : function(warn, warnMonth, warnAufstieg) {
                                  this.warn = (this.aufstieg ? warnAufstieg : warn);
                                  this.warnMonth = warnMonth;
                              },
        'alertColor'        : function() {
                                  return getColor('STU');  // rot
                              },
        'getColor'          : function(color) {
                                  return ((this.mustDraw() && this.colAlert) ? this.colAlert : color);
                              },
        'calcZiehIndex'     : function(currZAT) {
                                  const __RESTZAT = this.zatLeft + currZAT;
                                  const __INDEX = parseInt(__RESTZAT / __MONATZATS + 1) - this.__MONATEBISABR;  // Lfd. Nummer des Abrechnungsmonats (0-basiert)

                                  return __INDEX;
                              },
        'isZiehAufstieg'    : function() {
                                  return this.aufstieg;
                              },
        'setAufstieg'       : function() {
                                  this.aufstieg = true;

                                  if (this.isZiehAufstieg()) {
                                      this.setZatLeft(__SAISONZATS - this.currZAT - this.__ZATWARNVORLAUF);
                                  }

                                  return this.zatLeft;
                              },
        'mustDraw'          : function() {
                                  return ((this.warn || this.warnMonth) && (this.zatLeft < this.__ZATWARNVORLAUF));
                              },
        'monthDraw'         : function() {
                                  return (this.mustDraw() || (this.warn && (this.aufstieg || this.warnMonth) && (this.zatLeft < this.__ZATMONATVORLAUF)));  // Abrechnungszeitraum vor dem letztmoeglichen Ziehen...
                              }
    });

const __NOWARNDRAW = new WarnDrawPlayer(undefined, undefined);  // inaktives Objekt

// ==================== Ende Abschnitt fuer Klasse WarnDrawPlayer ====================

// ==================== Abschnitt fuer Klasse WarnDrawMessage ====================

// Klasse fuer Warnmeldung fuer einen Jugendspieler

/*class*/ function WarnDrawMessage /*{
    constructor*/(optSet, currZAT) {
        'use strict';

        this.optSet = optSet;

        this.warn = this.optSet.getOptValue('zeigeWarnung', true);
        this.warnMonth = this.optSet.getOptValue('zeigeWarnungMonat', true);
        this.warnHome = this.optSet.getOptValue('zeigeWarnungHome', true);
        this.warnDialog = this.optSet.getOptValue('zeigeWarnungDialog', false);
        this.warnAufstieg = this.optSet.getOptValue('zeigeWarnungAufstieg', true);
        this.warnLegende = this.optSet.getOptValue('zeigeWarnungLegende', true);

        this.out = {
                       'supertag' : true,
                       'top'      : true,
                       'link'     : true,
                       'label'    : true,
                       'bottom'   : true
                   };

        this.setOptionHome();

        this.startMessage(currZAT);
    }
//}

Class.define(WarnDrawMessage, Object, {
        '__ZATWARNVORLAUF'  : 1,
        '__ZATMONATVORLAUF' : __MONATZATS,
        'startMessage'      : function(currZAT) {
                                  this.setZat(currZAT);
                                  this.createMessage();
                              },
        'setZat'            : function(currZAT) {
                                  this.currZAT = currZAT;

                                  if (currZAT === undefined) {
                                      this.abrZAT = undefined;
                                      this.rest   = undefined;
                                      this.anzahl = undefined;
                                  } else {
                                      this.configureZat();
                                  }
                              },
        'setOptionHome'     : function() {
                                  this.warnOption = this.hasHome();
                              },
        'setOptionLegende'  : function() {
                                  this.warnOption = this.hasLegende();
                              },
        'configureZat'      : function() {
                                  const __ZIEHANZAHL = this.optSet.getOptValue('ziehAnz', []);
                                  const __INDEX = parseInt(this.currZAT / __MONATZATS);

                                  this.abrZAT = (__INDEX + 1) * __MONATZATS;
                                  this.rest   = (__MONATZATS - 1) - (this.currZAT % __MONATZATS);
                                  this.anzahl = __ZIEHANZAHL[__INDEX];
                              },
        'getTextMessage'    : function() {
                                  return "ZAT " + this.abrZAT + ' ' + ((this.anzahl > 1) ? "m\u00FCssen " + this.anzahl : "muss einer") +
                                         " deiner Jugendspieler in das Profiteam \u00FCbernommen werden, ansonsten verschwinde" + ((this.anzahl > 1) ? "n sie" : "t er") + '!';
                              },
        'createMessage'     : function() {
                                  this.label = undefined;
                                  this.when = undefined;
                                  this.text = undefined;

                                  if (this.hasHome() || this.hasLegende() || this.hasDialog()) {
                                      if (this.anzahl > 0) {
                                          this.text = this.getTextMessage();

                                          if (this.warnMonth && (this.rest > 0)) {
                                              this.label = "Warnung";
                                              this.when = "Bis zur n\u00E4chsten Abrechnung am ";
                                          } else if ((this.warn || this.warnMonth) && (this.rest === 0)) {
                                              this.label = "LETZTE WARNUNG VOR DER ABRECHNUNG";
                                              this.when = "Bis zum n\u00E4chsten ";
                                          }
                                      }
                                  }
                              },
        'hasMessage'        : function() {
                                  return !! this.when;
                              },
        'hasHome'           : function() {
                                  return this.warnHome;
                              },
        'hasLegende'        : function() {
                                  return this.warnLegende;
                              },
        'hasOption'         : function() {
                                  return this.warnOption;
                              },
        'hasDialog'         : function() {
                                  return this.warnDialog;
                              },
        'showMessage'       : function(anchor, tag, appendFind = true) {  // appendFind: true = append, false = insertBefore, "..." search string = insert at find position
                                  let ret = (anchor || { }).innerHTML;

                                  if (this.hasMessage()) {
                                      if (this.hasOption()) {
                                          const __OLDHTML = ret;
                                          const __HTML = this.getHTML(tag);

                                          if ((typeof appendFind) === 'string') {
                                              const __INDEX = __OLDHTML.indexOf(appendFind);
                                              const __POS = (~ __INDEX) ? __INDEX : __OLDHTML.length;

                                              ret = __OLDHTML.substring(0, __POS) + __HTML + __OLDHTML.substring(__POS);
                                          } else if (appendFind) {
                                              ret = __OLDHTML + __HTML;
                                          } else {
                                              ret = __HTML + __OLDHTML;
                                          }

                                          anchor.innerHTML = ret;
                                      }
                                  }

                                  return ret;
                              },
        'showDialog'        : function(dlgFun) {
                                  if (this.hasMessage()) {
                                      if (this.hasDialog() && (this.rest === 0)) {
                                          dlgFun(this.label, this.when + this.text);
                                      }
                                  }
                              },
        'tagText'           : function(tag, text) {
                                  return ((tag !== undefined) ? this.getOpeningTag(tag) + text + this.getClosingTag(tag) : text);
                              },
        'tagParagraph'      : function(tag, text) {
                                  return this.tagText(tag, this.tagText(this.getSubTag(tag), text));
                              },
        'getSubTag'         : function(tag) {
                                  return ((tag === 'tr') ? 'td' + this.getColorTD() : ((tag === 'p') ? this.getColorTag() : undefined));
                              },
        'getSuperTag'       : function(tag) {
                                  return ((tag === 'p') ? 'div' : undefined);
                              },
        'getOpeningTag'     : function(tag) {
                                  return '<' + tag + '>';
                              },
        'getClosingTag'     : function(tag) {
                                  const __INDEX1 = (tag ? tag.indexOf(' ') : -1);
                                  const __INDEX2 = (tag ? tag.indexOf('=') : -1);
                                  const __INDEX = ((~ __INDEX1) && (~ __INDEX2)) ? Math.min(__INDEX1, __INDEX2) : Math.max(__INDEX1, __INDEX2);
                                  const __TAGNAME = ((~ __INDEX) ? tag.substring(0, __INDEX) : tag);

                                  return "</" + __TAGNAME + '>';
                              },
        'getLink'           : function() {
                                  return './ju.php';
                              },
        'getTopHTML'        : function(tag) {
                                  return this.tagParagraph(tag, "&nbsp;");
                              },
        'getBottomHTML'     : function(tag) {
                                  return this.tagParagraph(tag, "&nbsp;");
                              },
        'getColorTag'       : function() {
                                  return "color='red'";  // rot
                              },
        'getColorTD'        : function() {
                                  return " class='STU'";  // rot
                              },
        'getHTML'           : function(tag = 'p') {
                                  return this.tagParagraph((this.out.supertag ? this.getSuperTag(tag) : undefined), (this.out.top ? this.getTopHTML(tag) : "") +
                                         this.tagParagraph(tag, this.tagText('b', this.tagText((this.out.link ? "a href='" + this.getLink() + "'" : undefined),
                                         (this.out.label ? this.label + ": " : "") + this.when + this.text))) + (this.out.bottom ? this.getBottomHTML(tag) : ""));
                              }
    });

Object.defineProperty(WarnDrawMessage.prototype, 'innerHTML', {
        get : function() {
                  return this.getHTML('p');
              }
    });

// ==================== Ende Abschnitt fuer Klasse WarnDrawMessage ====================

// ==================== Abschnitt fuer Klasse WarnDrawMessageAufstieg ====================

// Klasse fuer Warnmeldung im Falle eines Aufstiegs fuer einen Jugendspieler

/*class*/ function WarnDrawMessageAufstieg /*extends WarnDrawMessage {
    constructor*/(optSet, currZAT) {
        'use strict';

        WarnDrawMessage.call(this, optSet, currZAT);

        this.out.top = false;  // kein Vorschub vor der Zeile

        this.warn = (this.warn && this.warnAufstieg);  // kann man ausschalten
        this.startMessage(currZAT);  // 2. Aufruf (zur Korrektur)
    }
//}

Class.define(WarnDrawMessageAufstieg, WarnDrawMessage, {
        'configureZat'      : function() {
                                  const __ZIEHANZAUFSTIEG = this.optSet.getOptValue('ziehAnzAufstieg', 0);
                                  const __INDEX = parseInt(this.currZAT / __MONATZATS);

                                  this.abrZAT = (__INDEX + 1) * __MONATZATS;
                                  this.rest   = (__MONATZATS - 1) - (this.currZAT % __MONATZATS);
                                  this.anzahl = ((this.currZAT + this.__ZATMONATVORLAUF > __SAISONZATS - this.__ZATWARNVORLAUF) ? __ZIEHANZAUFSTIEG : 0);

                                  this.warnDialog = false;     // kein Dialog fuer Aufstiegswarnung
                                  this.warnMonth = this.warn;  // nur im letzten Monat der Saison!
                              },
        'getTextMessage'    : function() {
                                  return "ZAT " + this.abrZAT + " ist im Falle eines Aufstiegs f\u00FCr " + ((this.anzahl > 1) ? "" + this.anzahl : "einen") +
                                         " deiner Jugendspieler m\u00F6glicherweise die letzte Chance, " + ((this.anzahl > 1) ? " diese noch vor ihrem" : "ihn noch vor seinem") +
                                         " Geburtstag in der n\u00E4chsten Saison in das Profiteam zu \u00FCbernehmen!";
                              },
        'getColorTag'       : function() {
                                  return "color='magenta'";  // magenta
                              },
        'getColorTD'        : function() {
                                  return " class='OMI'";  // magenta
                              }
    });

// ==================== Ende Abschnitt fuer Klasse WarnDrawMessageAufstieg ====================

// *** EOF ***

/*** Ende Modul OS2.class.warndraw.js ***/

/*** Modul OS2.class.player.js ***/

// ==UserScript==
// _name         OS2.class.player
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifischer Klasse PlayerRecord
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.class.player.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse PlayerRecord ====================

// Klasse fuer Spalten des Jugendkaders

/*class*/ function PlayerRecord /*{
    constructor*/(land, age, isGoalie, saison, currZAT, donation) {
        'use strict';

        this.land = land;
        this.age = age;
        this.isGoalie = isGoalie;

        this.saison = saison;
        this.currZAT = currZAT;
        this.donation = donation;
        this.mwFormel = ((this.saison < 10) ? this.__MWFORMEL.alt : this.__MWFORMEL.S10);

        // in new PlayerRecord() definiert:
        // this.land: TLA des Geburtslandes
        // this.age: Ganzzahliges Alter des Spielers
        // this.isGoalie: Angabe, ob es ein TOR ist
        // this.mwFormel: Benutzte MW-Formel, siehe __MWFORMEL
        // this.donation: Jugendfoerderungsbetrag in Euro

        // in this.initPlayer() definiert:
        // this.zatGeb: ZAT, an dem der Spieler Geburtstag hat, -1 fuer "noch nicht zugewiesen", also '?'
        // this.zatAge: Bisherige erfolgte Trainings-ZATs
        // this.birth: Universell eindeutige Nummer des Geburtstags-ZATs des Spielers
        // this.talent: Talent als Zahl (-1=wenig, 0=normal, +1=hoch)
        // this.aufwert: Aufwertungsstring

        // in this.calcSkills() definiert:
        // this.positions[][]: Positionstexte und Optis; TOR-Index ist 5
        // this.skills[]: Einzelskills
        // this.skillsEnd[]: Berechnet aus this.skills, this.age und aktuellerZat
        // this.zatLeft: ZATs bis zum Ende 18 (letzte Ziehmoeglichkeit)
        // this.restEnd: Korrekturterm zum Ausgleich von Rundungsfehlern mit Ende 18
        //               (also Skills, die nicht explizit in this.skillsEnd stehen)

        // in this.calcZusatz()/setZusatz() definiert:
        // this.trainiert: Anzahl der erfolgreichen Trainingspunkte
        // indirekt this.zatAge und this.bestPos

        // in this.createWarnDraw() definiert:
        // this.warnDraw: Behandlung von Warnungen Ende 18
        // this.warnDrawAufstieg: Behandlung von Warnungen bei Aufstieg

        // in this.getPos() definiert:
        // this.bestPos: erster (bester) Positionstext
    }
//}

Class.define(PlayerRecord, Object, {
        '__TIME'                : {   // Zeitpunktangaben
                                      'cre' : 0,  // Jugendspieler angelegt (mit 12 Jahren)
                                      'beg' : 1,  // Jugendspieler darf trainieren (wird 13 Jahre alt)
                                      'now' : 2,  // Aktueller ZAT
                                      'end' : 3   // Jugendspieler wird Ende 18 gezogen (Geb. - 1 bzw. ZAT 71 fuer '?')
                                  },
        '__MWFORMEL'            : {   // Zu benutzende Marktwertformel
                                      'alt' : 0,  // Marktwertformel bis Saison 9 inklusive
                                      'S10' : 1   // Marktwertformel MW5 ab Saison 10
                                  },
        '__MAXPRISKILLS'        : 4 * 99,
        'toString'              : function() {  // Bisher nur die noetigsten Werte ausgegeben...
                                      let result = "Alter\t\t" + this.age + "\n\n";
                                      result += "Aktuelle Werte\n";
                                      result += "Skillschnitt\t" + this.getSkill().toFixed(2) + '\n';
                                      result += "Optis und Marktwerte";

                                      for (let pos of this.positions) {
                                          result += "\n\t" + pos + '\t';
                                          result += this.getOpti(pos).toFixed(2) + '\t';
                                          result += getNumberString(this.getMarketValue(pos).toString());
                                      }

                                      result += "\n\nWerte mit Ende 18\n";
                                      result += "Skillschnitt\t" + this.getSkill(this.__TIME.end).toFixed(2) + '\n';
                                      result += "Optis und Marktwerte";

                                      for (let pos of this.positions) {
                                          result += "\n\t" + this.getPos() + '\t';
                                          result += this.getOpti(pos, this.__TIME.end).toFixed(2) + '\t';
                                          result += getNumberString(this.getMarketValue(pos, this.__TIME.end).toString());
                                      }

                                      return result;
                                  },  // Ende this.toString()
        'initPlayer'            : function(data, index, isSkillData = false) {  // isSkillData: true = Skilldaten, false = Basiswerte (Geb., Talent, Aufwertungen) oder keine
                                      if (data !== undefined) {
                                          if (isSkillData) {
                                              this.setSkills(data[index]);
                                          } else if (data.length >= 2){
                                              this.setGeb(data[0][index]);
                                              this.talent = data[1][index];
                                              this.aufwert = data[2][index];
                                          } else {
                                              // keine Daten
                                          }
                                      }
                                  },  // Ende this.initPlayer()
        'createWarnDraw'        : function(ziehmich = null, klasse = 1) {  // ziehmich: input Element zum Ziehen; klasse: Spielklasse 1, 2, 3
                                      // Objekte fuer die Verwaltung der Ziehwarnungen...
                                      this.warnDraw = undefined;
                                      this.warnDrawAufstieg = undefined;
                                      if (ziehmich) {
                                          const __LASTZAT = this.currZAT + this.getZatLeft();

                                          if (__LASTZAT < __SAISONZATS) {  // U19
                                              this.warnDraw = new WarnDrawPlayer(this, getColor('STU'));  // rot
                                              __LOG[5](this.getAge().toFixed(2), "rot");
                                          } else if (__LASTZAT < Math.max(2, klasse) * __SAISONZATS) {  // Rest bis inkl. U18 (Liga 1 und 2) bzw. U17 (Liga 3)
                                              // do nothing
                                          } else if (__LASTZAT < (klasse + 1) * __SAISONZATS) {  // U17/U16 je nach Liga 2/3
                                              this.warnDrawAufstieg = new WarnDrawPlayer(this, getColor('OMI'));  // magenta
                                              this.warnDrawAufstieg.setAufstieg();
                                              __LOG[5](this.getAge().toFixed(2), "magenta");
                                          }
                                      }
                                  },  // Ende this.createWarnDraw()
        'setSkills'             : function(skills) {
                                      // Berechnet die Opti-Werte, sortiert das Positionsfeld und berechnet die Einzelskills mit Ende 18
                                     this.skills = skills;

                                      const __POSREIHEN = [ 'ABW', 'DMI', 'MIT', 'OMI', 'STU', 'TOR' ];
                                      this.positions = [];
                                      for (let index = 0; index < __POSREIHEN.length; index++) {
                                          const __REIHE = __POSREIHEN[index];

                                          this.positions[index] = [ __REIHE, this.getOpti(__REIHE) ];
                                      }

                                      // Sortieren
                                      sortPositionArray(this.positions);
                                  },  // Ende this.setSkills()
        'prognoseSkills'        : function() {
                                      // Einzelskills mit Ende 18 berechnen
                                      this.skillsEnd = [];

                                      const __ZATDONE = this.getZatDone();
                                      const __ZATTOGO = this.getZatLeft();
                                      const __ADDRATIO = (__ZATDONE ? __ZATTOGO / __ZATDONE : 0);

                                      let addSkill = __ZATTOGO * this.getAufwertungsSchnitt();

                                      for (let i in this.skills) {
                                          const __SKILL = this.skills[i];
                                          let progSkill = __SKILL;

                                          if (isTrainableSkill(i)) {
                                              // Auf ganze Zahl runden und parseInt(), da das sonst irgendwie als String interpretiert wird
                                              const __ADDSKILL = Math.min(99 - progSkill, getMulValue(__ADDRATIO, __SKILL, 0, Number.NaN));

                                              progSkill += __ADDSKILL;
                                              addSkill -= __ADDSKILL;
                                          }

                                          this.skillsEnd[i] = progSkill;
                                      }
                                      this.restEnd = addSkill;
                                  },  // Ende this.prognoseSkills()
        'setZusatz'             : function(zatAge, trainiert, bestPos) {
                                      // Setzt Nebenwerte fuer den Spieler (geht ohne initPlayer())
                                      if (zatAge !== undefined) {
                                          this.zatAge = zatAge;
                                      }
                                      this.trainiert = trainiert;
                                      this.bestPos = bestPos;
                                  },
        'calcZusatz'            : function() {
                                      // Ermittelt Nebenwerte fuer den Spieler und gibt sie alle zurueck (nach initPlayer())
                                      // this.zatAge und this.skills bereits in initPlayer() berechnet
                                      this.trainiert = this.getTrainiert(true);  // neu berechnet aus Skills
                                      let bestPos = this.getPos(-1);  // hier: -1 explizit angeben, damit neu ermittelt (falls this.bestPos noch nicht belegt)

                                      return {
                                                 'zatAge'     : this.zatAge,
                                                 'trainiert'  : this.trainiert,
                                                 'bestPos'    : bestPos
                                             };
                                  },
        'getGeb'                : function() {
                                      return (this.zatGeb < 0) ? '?' : this.zatGeb;
                                  },
        'setGeb'                : function(gebZAT) {
                                      this.zatGeb = gebZAT;
                                      this.zatAge = this.calcZatAge(this.currZAT);
                                      this.birth = (36 + this.saison) * __SAISONZATS + this.currZAT - this.zatAge;
                                  },
        'calcZatAge'            : function(currZAT) {
                                      let zatAge;

                                      if (this.zatGeb !== undefined) {
                                          let ZATs = __SAISONZATS * (this.age - ((currZAT < this.zatGeb) ? 12 : 13));  // Basiszeit fuer die Jahre seit Jahrgang 13

                                          if (this.zatGeb < 0) {
                                              zatAge = ZATs + currZAT;  // Zaehlung begann Anfang der Saison (und der Geburtstag wird erst nach dem Ziehen bestimmt)
                                          } else {
                                              zatAge = ZATs + currZAT - this.zatGeb;  // Verschiebung relativ zum Geburtstag (von -zatGeb, ..., 0, ..., 71 - zatGeb)
                                          }
                                      }

                                      return zatAge;
                                  },
        'getZatAge'             : function(when = this.__TIME.now) {
                                      if (when === this.__TIME.end) {
                                          return (18 - 12) * __SAISONZATS - 1;  // (max.) Trainings-ZATs bis Ende 18
                                      } else if (this.zatAge !== undefined) {
                                          return this.zatAge;
                                      } else {
                                          __LOG[3]("Empty getZatAge()");

                                          return Number.NaN;
                                      }
                                  },
        'getZatDone'            : function(when = this.__TIME.now) {
                                      return Math.max(0, this.getZatAge(when));
                                  },
        'getZatLeft'            : function(when = this.__TIME.now) {
                                      if (this.zatLeft === undefined) {
                                          this.zatLeft = this.getZatDone(this.__TIME.end) - this.getZatDone(when);
                                      }

                                      return this.zatLeft;
                                  },
        'calcZiehIndex'         : function() {
                                      //const __RESTZAT = this.getZatAge(this.__TIME.end) - this.getZatAge() + this.currZAT;
                                      //const __INDEX = parseInt(__RESTZAT / __MONATZATS + 1) - 1;  // Lfd. Nummer des Abrechnungsmonats (0-basiert)

                                      return (this.warnDraw && this.warnDraw.calcZiehIndex(this.currZAT));
                                  },
        'isZiehAufstieg'        : function() {
                                      return (this.warnDrawAufstieg && this.warnDrawAufstieg.isZiehAufstieg());
                                  },
        'getAge'                : function(when = this.__TIME.now) {
                                      if (this.mwFormel === this.__MWFORMEL.alt) {
                                          return (when === this.__TIME.end) ? 18 : this.age;
                                      } else {  // Geburtstage ab Saison 10...
                                          return (13.00 + this.getZatAge(when) / __SAISONZATS);
                                      }
                                  },
        'getTrainiert'          : function(recalc = false) {
                                      if (recalc || (this.trainiert === undefined)) {
                                          this.trainiert = this.getTrainableSkills();
                                      }

                                      return this.trainiert;
                                  },
        'getAufwertungsSchnitt' : function() {
                                      const __ZATDONE = this.getZatDone();

                                      if (__ZATDONE) {
                                          return parseFloat(this.getTrainiert() / __ZATDONE);
                                      } else {
                                          // Je nach Talentklasse mittlerer Aufwertungsschnitt aller Talente der Klasse
                                          // (gewichtet nach Verteilung der Talentstufen in dieser Talentklasse)
                                          return (1 + (this.talent / 3.6)) * (this.donation / 10000);
                                      }
                                  },
        'getPos'                : function(idx = 0) {
                                      const __IDXOFFSET = 1;

                                      switch (idx) {
                                      case -1 : return (this.bestPos = this.positions[this.isGoalie ? 5 : 0][0]);
                                      case  0 : return this.bestPos;
                                      default : return this.positions[idx - __IDXOFFSET][0];
                                      }
                                  },
        'getPosPercent'         : function(idx = 0) {
                                      const __IDXOFFSET = 1;
                                      const __OPTI = this.positions[this.isGoalie ? 5 : 0][1];
                                      let optiSec = __OPTI;

                                      switch (idx) {
                                      case -1 : break;  // __OPTI
                                      case  0 : optiSec = (this.isGoalie ? 0 : this.positions[1][1]);  // Backup-Wert (TOR: keiner)
                                                break;
                                      default : optiSec = this.positions[idx - __IDXOFFSET][1];
                                      }

                                      return parseFloat(100 * optiSec / __OPTI);
                                  },
        'getTalent'             : function() {
                                      return (this.talent < 0) ? 'wenig' : (this.talent > 0) ? 'hoch' : 'normal';
                                  },
        'getAufwert'            : function() {
                                      return this.aufwert;
                                  },
        'boldPriSkillNames'     : function(text) {
                                      const __PRISKILLNAMES = this.getPriSkillNames();

                                      return (! text) ? text : text.replace(/\w+/g, function(name) {
                                                                                        return ((~ __PRISKILLNAMES.indexOf(name)) ? '<b>' + name + '</b>' : name);
                                                                                    });
                                  },
        'getPriSkillNames'      : function(pos = undefined) {
                                      return getSkillNameArray(getIdxPriSkills(pos ? pos : this.getPos()), this.isGoalie);
                                  },
        'getSkillSum'           : function(when = this.__TIME.now, idxSkills = undefined, restRate = 15) {
                                      let cachedItem;

                                      if (idxSkills === undefined) {  // Gesamtsumme ueber alle Skills wird gecached...
                                          cachedItem = ((when === this.__TIME.end) ? 'skillSumEnd' : 'skillSum');

                                          const __CACHED = this[cachedItem];

                                          if (__CACHED !== undefined) {
                                              return __CACHED;
                                          }

                                          idxSkills = getIdxAllSkills();
                                      }

                                      const __SKILLS = ((when === this.__TIME.end) ? this.skillsEnd : this.skills);
                                      let sumSkills = ((when === this.__TIME.end) ? (restRate / 15) * this.restEnd : 0);

                                      if (__SKILLS) {
                                          for (let idx of idxSkills) {
                                              sumSkills += __SKILLS[idx];
                                          }
                                      }

                                      if (cachedItem !== undefined) {
                                          this[cachedItem] = sumSkills;
                                      }

                                      return sumSkills;
                                  },
        'getSkill'              : function(when = this.__TIME.now) {
                                      return this.getSkillSum(when) / __NUMSKILLS;
                                  },
        'getOpti'               : function(pos, when = this.__TIME.now) {
                                      const __SUMALLSKILLS = this.getSkillSum(when);
                                      const __SUMPRISKILLS = this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4);
                                      const __OVERFLOW = Math.max(0, __SUMPRISKILLS - this.__MAXPRISKILLS);
/*if (this.zatGeb === 24) {
    console.error("__OVERFLOW = " + __OVERFLOW);
    console.error("__SUMALLSKILLS = " + __SUMALLSKILLS);
    console.error("__SUMPRISKILLS = " + __SUMPRISKILLS);
    console.error("getOpti(" + pos + ") = " + ((4 * (__SUMPRISKILLS - __OVERFLOW) + __SUMALLSKILLS) / __NUMOPTI));
}*/
                                      return (4 * (__SUMPRISKILLS - __OVERFLOW) + __SUMALLSKILLS) / __NUMOPTI;
                                  },
        'getPrios'              : function(pos, when = this.__TIME.now) {
                                      return Math.min(this.__MAXPRISKILLS, this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4)) / 4;
                                  },
        'getPriPercent'         : function(pos, when = this.__TIME.now) {
                                      const __SUMPRISKILLS = this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4);
                                      const __SUMSECSKILLS = this.getSkillSum(when, getIdxSecSkills(pos), 7);
                                      const __OVERFLOW = Math.max(0, __SUMPRISKILLS - this.__MAXPRISKILLS);

                                      return (100 * (__SUMPRISKILLS - __OVERFLOW)) / (__SUMPRISKILLS + __SUMSECSKILLS);
                                  },
        'getSecPercent'         : function(pos, when = this.__TIME.now) {
                                      const __SUMPRISKILLS = this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4);
                                      const __SUMSECSKILLS = this.getSkillSum(when, getIdxSecSkills(pos), 7);
                                      const __OVERFLOW = Math.max(0, __SUMPRISKILLS - this.__MAXPRISKILLS);

                                      return (100 * (__SUMSECSKILLS + __OVERFLOW)) / (__SUMPRISKILLS + __SUMSECSKILLS);
                                  },
        'getTrainableSkills'    : function(when = this.__TIME.now) {
                                      return this.getSkillSum(when, getIdxTrainableSkills());
                                  },
        'getFixSkills'          : function() {
                                      return this.getSkillSum(this.__TIME.now, getIdxFixSkills());
                                  },
        'getMarketValue'        : function(pos, when = this.__TIME.now) {
                                      const __MW = calcMarketValue(this.getAge(when),
                                                                   this.getSkill(when),
                                                                   this.getOpti(pos, when),
                                                                   ((this.mwFormel === this.__MWFORMEL.alt)
                                                                        ? __MW9FORMEL : __MW10FORMEL));

                                      return __MW;
                                  },
        'getFingerPrint'        : function() {
                                      // Jeweils gleichbreite Werte: (Alter/Geb.=>Monat), Land, Talent ('-', '=', '+')...
                                      const __BASEPART = padNumber(this.birth / __MONATZATS, 3) + padLeft(this.land, -3);
                                      const __TALENT = '-=+'[this.talent + 1];

                                      if (this.skills === undefined) {
                                          return __BASEPART + getValue(__TALENT, "");
                                      } else {
                                          const __SKILLS = this.skills;
                                          const __FIXSKILLS = getIdxFixSkills().slice(-4);  // ohne die Nullen aus FUQ und ERF
                                          const __FIXSKILLSTR = __FIXSKILLS.map(function(idx) {
                                                                                    return padNumber(__SKILLS[idx], -2);
                                                                                }).join("");

                                          // Jeweils gleichbreite Werte: Zusaetzlich vier der sechs Fixskills...
                                          return (__BASEPART + getValue(__TALENT, '?') + __FIXSKILLSTR);
                                      }
                                  },
        'isFingerPrint'         : function(fpA, fpB) {
                                      if (fpA && fpB) {
                                          if (fpA === fpB) {
                                              return true;  // voellig identisch
                                          } else if (this.isBaseFingerPrint(fpA, fpB)) {
                                              return 1;  // schwaches true
                                          }
                                      }

                                      return false;
                                  },
        'isBaseFingerPrint'     : function(fpA, fpB) {
                                      if (fpA && fpB) {
                                          if (this.getBaseFingerPrint(fpA) === this.getBaseFingerPrint(fpB)) {
                                              // Base ist identisch...
                                              if ((getValue(fpA[6], '?') === '?') || (getValue(fpB[6], '?') === '?') || (fpA[6] === fpB[6])) {
                                                  // ... und auch das Talent-Zeichen ist leer oder '?'...
                                                  return true;
                                              }
                                          }
                                      }

                                      return false;
                                  },
        'getBaseFingerPrint'    : function(fingerprint) {
                                      return (fingerprint ? fingerprint.slice(0, 6) : undefined);
                                  },
        'getCatFromFingerPrint' : function(fingerprint) {
                                      return (fingerprint ? floorValue((fingerprint.slice(0, 3) - 1) / 12) : undefined);
                                  },
        'getCat'                : function() {
                                      return (this.birth ? floorValue((this.birth - 1) / __SAISONZATS) : undefined);
                                  },
        'findInFingerPrints'    : function(fingerprints) {
                                      const __MYFINGERPRINT = this.getFingerPrint();  // ggfs. unvollstaendiger Fingerprint
                                      const __MYCAT = this.getCat();
                                      const __RET = [];

                                      if (__MYCAT !== undefined) {
                                          for (let id in fingerprints) {
                                              const __CAT = this.getCatFromFingerPrint(id);

                                              if (__CAT === __MYCAT) {
                                                  if (this.isFingerPrint(id, __MYFINGERPRINT)) {
                                                      __RET.push(id);
                                                      break;  // erster Treffer zaehlt
                                                  }
                                              }
                                          }
                                      }

                                      return ((__RET.length === 1) ? __RET[0] : undefined);
                                  }
    });

// Hilfsfunktionen **********************************************************************

// Sortiert das Positionsfeld per BubbleSort
function sortPositionArray(array) {
    const __TEMP = [];
    let transposed = true;
    // TOR soll immer die letzte Position im Feld sein, deshalb - 1
    let length = array.length - 1;

    while (transposed && (length > 1)) {
        transposed = false;
        for (let i = 0; i < length - 1; i++) {
            // Vergleich Opti-Werte:
            if (array[i][1] < array[i + 1][1]) {
                // vertauschen
                __TEMP[0] = array[i][0];
                __TEMP[1] = array[i][1];
                array[i][0] = array[i + 1][0];
                array[i][1] = array[i + 1][1];
                array[i + 1][0] = __TEMP[0];
                array[i + 1][1] = __TEMP[1];
                transposed = true;
            }
        }
        length--;
    }
}

// ==================== Ende Abschnitt fuer Klasse PlayerRecord ====================

// *** EOF ***

/*** Ende Modul OS2.class.player.js ***/

/*** Modul OS2.class.column.js ***/

// ==UserScript==
// _name         OS2.class.column
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifischer Klasse ColumnManager
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.class.column.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse ColumnManager ====================

// Klasse fuer Spalten des Jugendkaders

/*class*/ function ColumnManager /*{
    constructor*/(optSet, colIdx, showCol) {
        'use strict';

        __LOG[4]("ColumnManager()");

        const __SHOWCOL = getValue(showCol, true);
        const __SHOWALL = ((__SHOWCOL === true) || (__SHOWCOL.Default === true));

        const __BIRTHDAYS = optSet.getOptValue('birthdays', []).length;
        const __TCLASSES = optSet.getOptValue('tClasses', []).length;
        const __PROGRESSES = optSet.getOptValue('progresses', []).length;

        const __ZATAGES = optSet.getOptValue('zatAges', []).length;
        const __TRAINIERT = optSet.getOptValue('trainiert', []).length;
        const __POSITIONS = optSet.getOptValue('positions', []).length;

        const __EINZELSKILLS = optSet.getOptValue('skills', []).length;
        const __PROJECTION = (__EINZELSKILLS && __ZATAGES);

        this.colIdx = colIdx;

        this.saison = optSet.getOptValue('saison');
        this.gt = optSet.getOptValue('zeigeJahrgang');
        this.gtUxx = optSet.getOptValue('zeigeUxx');

        this.fpId = (__BIRTHDAYS && __TCLASSES && __POSITIONS && getValue(__SHOWCOL.zeigeId, __SHOWALL) && optSet.getOptValue('zeigeId'));
        this.warn = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnung, __SHOWALL) && optSet.getOptValue('zeigeWarnung'));
        this.warnMonth = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungMonat, __SHOWALL) && optSet.getOptValue('zeigeWarnungMonat'));
        this.warnHome = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungHome, __SHOWALL) && optSet.getOptValue('zeigeWarnungHome'));
        this.warnDialog = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungDialog, __SHOWALL) && optSet.getOptValue('zeigeWarnungDialog'));
        this.warnAufstieg = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungAufstieg, __SHOWALL) && optSet.getOptValue('zeigeWarnungAufstieg'));
        this.warnLegende = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungLegende, __SHOWALL) && optSet.getOptValue('zeigeWarnungLegende'));
        this.bar = (__PROJECTION && getValue(__SHOWCOL.zeigeBalken, __SHOWALL) && optSet.getOptValue('zeigeBalken'));
        this.barAbs = optSet.getOptValue('absBalken');
        this.donor = optSet.getOptValue('foerderung');
        this.geb = (__BIRTHDAYS && getValue(__SHOWCOL.zeigeGeb, __SHOWALL) && optSet.getOptValue('zeigeGeb'));
        this.tal = (__TCLASSES && getValue(__SHOWCOL.zeigeTal, __SHOWALL) && optSet.getOptValue('zeigeTal'));
        this.quo = (__ZATAGES && __TRAINIERT && getValue(__SHOWCOL.zeigeQuote, __SHOWALL) && optSet.getOptValue('zeigeQuote'));
        this.aufw = (__PROGRESSES && getValue(__SHOWCOL.zeigeAufw, __SHOWALL) && optSet.getOptValue('zeigeAufw'));
        this.substAge = (__ZATAGES && getValue(__SHOWCOL.ersetzeAlter, __SHOWALL) && optSet.getOptValue('ersetzeAlter'));
        this.alter = (__ZATAGES && getValue(__SHOWCOL.zeigeAlter, __SHOWALL) && optSet.getOptValue('zeigeAlter'));
        this.fix = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeFixSkills, __SHOWALL) && optSet.getOptValue('zeigeFixSkills'));
        this.tr = (__EINZELSKILLS && __TRAINIERT && getValue(__SHOWCOL.zeigeTrainiert, __SHOWALL) && optSet.getOptValue('zeigeTrainiert'));
        this.zat = (__ZATAGES && getValue(__SHOWCOL.zeigeZatDone, __SHOWALL) && optSet.getOptValue('zeigeZatDone'));
        this.antHpt = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeAnteilPri, __SHOWALL) && optSet.getOptValue('zeigeAnteilPri'));
        this.antNeb = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeAnteilSec, __SHOWALL) && optSet.getOptValue('zeigeAnteilSec'));
        this.pri = (__EINZELSKILLS && getValue(__SHOWCOL.zeigePrios, __SHOWALL) && optSet.getOptValue('zeigePrios'));
        this.skill = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeSkill, __SHOWALL) && optSet.getOptValue('zeigeSkill'));
        this.pos = (__EINZELSKILLS && __POSITIONS && getValue(__SHOWCOL.zeigePosition, __SHOWALL) && optSet.getOptValue('zeigePosition'));
        this.anzOpti = ((__EINZELSKILLS && getValue(__SHOWCOL.zeigeOpti, __SHOWALL)) ? optSet.getOptValue('anzahlOpti') : 0);
        this.anzMw =  ((__PROJECTION && getValue(__SHOWCOL.zeigeMW, __SHOWALL)) ? optSet.getOptValue('anzahlMW') : 0);
        this.substSkills = (__PROJECTION && getValue(__SHOWCOL.ersetzeSkills, __SHOWALL) && optSet.getOptValue('ersetzeSkills'));
        this.trE = (__PROJECTION && __TRAINIERT && getValue(__SHOWCOL.zeigeTrainiertEnde, __SHOWALL) && optSet.getOptValue('zeigeTrainiertEnde'));
        this.zatE = (__ZATAGES && getValue(__SHOWCOL.zeigeZatLeft, __SHOWALL) && optSet.getOptValue('zeigeZatLeft'));
        this.antHptE = (__PROJECTION && getValue(__SHOWCOL.zeigeAnteilPriEnde, __SHOWALL) && optSet.getOptValue('zeigeAnteilPriEnde'));
        this.antNebE = (__PROJECTION && getValue(__SHOWCOL.zeigeAnteilSecEnde, __SHOWALL) && optSet.getOptValue('zeigeAnteilSecEnde'));
        this.priE = (__PROJECTION && getValue(__SHOWCOL.zeigePriosEnde, __SHOWALL) && optSet.getOptValue('zeigePriosEnde'));
        this.skillE = (__PROJECTION && getValue(__SHOWCOL.zeigeSkillEnde, __SHOWALL) && optSet.getOptValue('zeigeSkillEnde'));
        this.anzOptiE = ((__PROJECTION && getValue(__SHOWCOL.zeigeOptiEnde, __SHOWALL)) ? optSet.getOptValue('anzahlOptiEnde') : 0);
        this.anzMwE = ((__PROJECTION && getValue(__SHOWCOL.zeigeMWEnde, __SHOWALL)) ? optSet.getOptValue('anzahlMWEnde') : 0);
        this.kennzE = optSet.getOptValue('kennzeichenEnde');
    }
//}

Class.define(ColumnManager, Object, {
        'toString'       : function() {  // Bisher nur die noetigsten Parameter ausgegeben...
                               let result = "Skillschnitt\t\t" + this.skill + '\n';
                               result += "Beste Position\t" + this.pos + '\n';
                               result += "Optis\t\t\t" + this.anzOpti + '\n';
                               result += "Marktwerte\t\t" + this.anzMw + '\n';
                               result += "Skillschnitt Ende\t" + this.skillE + '\n';
                               result += "Optis Ende\t\t" + this.anzOptiE + '\n';
                               result += "Marktwerte Ende\t" + this.anzMwE + '\n';

                               return result;
                           },
        'addCell'        : function(tableRow) {
                               return tableRow.insertCell(-1);
                           },
        'addAndFillCell' : function(tableRow, value, color, align, digits = 2) {
                               let text = value;

                               if ((value || (value === 0)) && isFinite(value) && (value !== true) && (value !== false)) {
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
        'addAndBarCell'  : function(tableRow, value, scale = 100, offset = 0, width = 100, height = 10, zoom = 100) {
                               const __VALUE = ((scale && isFinite(value)) ? ((value - offset) / Math.max(1, scale - offset) * 100) : 0);

                               // HTML-Code fuer Anteilsbalken einfuegen...
                               const __CELL = this.addCell(tableRow);

                               __CELL.innerHTML = this.getBarImg(__VALUE, width, height, zoom);
                               __CELL.align = 'left';

                               return __CELL;
                           },
        'getBarImg'      : function(value, width = 100, height = 10, zoom = 100) {
                               const __IMAGE = Math.min(99, Math.max(0, getMulValue(value, 1, 0, 0)));
                               const __LENGTH = getMulValue(width / 100, getMulValue(zoom / 100, value, 0, 0), 0, 0);
                               const __WIDTH = Math.min(width, __LENGTH);
                               const __HEIGHT = Math.max(3, getMulValue(zoom / 100, height * (__LENGTH / __WIDTH), 0, 0));

                               // HTML-Code fuer Anteilsbalken...
                               return '<img src="images/balken/' + __IMAGE + '.GIF" width="' + __WIDTH + '" height="' + __HEIGHT + '">';
                           },
        'addTitles'      : function(headers, titleColor = '#FFFFFF') {
                               // Spaltentitel zentrieren
                               headers.align = 'center';

                               // Titel fuer die aktuellen Werte
                               if (this.fpId) {
                                   this.addAndFillCell(headers, "Identifikation", titleColor);
                               }
                               if (this.bar) {
                                   this.addAndFillCell(headers, "Qualit\u00E4t", titleColor);
                               }
                               if (this.tal) {
                                   this.addAndFillCell(headers, "Talent", titleColor);
                               }
                               if (this.quo) {
                                   this.addAndFillCell(headers, "Quote", titleColor);
                               }
                               if (this.aufw) {
                                   this.addAndFillCell(headers, "Aufwertung", titleColor);
                               }
                               if (this.geb) {
                                   this.addAndFillCell(headers, "Geb.", titleColor);
                               }
                               if (this.alter && ! this.substAge) {
                                   this.addAndFillCell(headers, "Alter", titleColor);
                               }
                               if (this.fix) {
                                   this.addAndFillCell(headers, "fix", titleColor);
                               }
                               if (this.tr) {
                                   this.addAndFillCell(headers, "tr.", titleColor);
                               }
                               if (this.zat) {
                                   this.addAndFillCell(headers, "ZAT", titleColor);
                               }
                               if (this.antHpt) {
                                   this.addAndFillCell(headers, "%H", titleColor);
                               }
                               if (this.antNeb) {
                                   this.addAndFillCell(headers, "%N", titleColor);
                               }
                               if (this.pri) {
                                   this.addAndFillCell(headers, "Prios", titleColor);
                               }
                               if (this.skill) {
                                   this.addAndFillCell(headers, "Skill", titleColor);
                               }
                               if (this.pos) {
                                   this.addAndFillCell(headers, "Pos", titleColor);
                               }
                               for (let i = 1; i <= 6; i++) {
                                   if (i <= this.anzOpti) {
                                       this.addAndFillCell(headers, "Opti " + i, titleColor);
                                   }
                                   if (i <= this.anzMw) {
                                       this.addAndFillCell(headers, "MW " + i, titleColor);
                                   }
                               }

                               // Titel fuer die Werte mit Ende 18
                               if (this.trE) {
                                   this.addAndFillCell(headers, "tr." + this.kennzE, titleColor);
                               }
                               if (this.zatE) {
                                   this.addAndFillCell(headers, "ZAT" + this.kennzE, titleColor);
                               }
                               if (this.antHptE) {
                                   this.addAndFillCell(headers, "%H" + this.kennzE, titleColor);
                               }
                               if (this.antNebE) {
                                   this.addAndFillCell(headers, "%N" + this.kennzE, titleColor);
                               }
                               if (this.priE) {
                                   this.addAndFillCell(headers, "Prios" + this.kennzE, titleColor);
                               }
                               if (this.skillE) {
                                   this.addAndFillCell(headers, "Skill" + this.kennzE, titleColor);
                               }
                               for (let i = 1; i <= 6; i++) {
                                   if (i <= this.anzOptiE) {
                                       this.addAndFillCell(headers, "Opti " + i + this.kennzE, titleColor);
                                   }
                                   if (i <= this.anzMwE) {
                                       this.addAndFillCell(headers, "MW " + i + this.kennzE, titleColor);
                                   }
                               }
                           },  // Ende addTitles()
        'addValues'      : function(player, playerRow, color = '#FFFFFF') {
                               // Warnlevel des Spielers anpassen...
                               const __WARNDRAW = player.warnDraw || player.warnDrawAufstieg || __NOWARNDRAW;
                               __WARNDRAW.setWarn(this.warn, this.warnMonth, this.warnAufstieg);

                               const __IDXPRI = getIdxPriSkills(player.getPos());
                               const __COLOR = __WARNDRAW.getColor(player.isGoalie ? getColor('TOR') : color); // Angepasst an Ziehwarnung
                               const __POS1COLOR = getColor((player.getPosPercent() > 99.99) ? 'LEI' : player.getPos());

                               // Aktuelle Werte
                               if (this.fpId) {
                                   this.addAndFillCell(playerRow, player.getFingerPrint(), __COLOR);
                               }
                               if (this.bar) {
                                   const __VALUE = player.getPrios(player.getPos(), player.__TIME.end);
                                   const __SCALE = (this.barAbs ? 100 : (this.donor / 125));
                                   const __OFFSET = (this.barAbs ? 0 : Math.pow(__SCALE / 20, 2));
                                   const __ZOOM = 50 + __SCALE / 2;

                                   this.addAndBarCell(playerRow, __VALUE, __SCALE, __OFFSET, 100, 10, __ZOOM);
                               }
                               if (this.tal) {
                                   this.addAndFillCell(playerRow, player.getTalent(), __COLOR);
                               }
                               if (this.quo) {
                                   this.addAndFillCell(playerRow, player.getAufwertungsSchnitt(), __COLOR, null, 2);
                               }
                               if (this.colIdx.Auf) {
                                   convertStringFromHTML(playerRow.cells, this.colIdx.Auf, function(aufwert) {
                                                                                               return player.boldPriSkillNames(aufwert);
                                                                                           });
                               }
                               if (this.aufw) {
                                   this.addAndFillCell(playerRow, player.boldPriSkillNames(player.getAufwert()), __COLOR, 'left');
                               }
                               if (this.geb) {
                                   this.addAndFillCell(playerRow, player.getGeb(), __COLOR, null, 0);
                               }
                               if (this.substAge) {
                                   convertStringFromHTML(playerRow.cells, this.colIdx.Age, function(value) {
                                                                                               UNUSED(value);
                                                                                               return parseFloat(player.getAge()).toFixed(2);
                                                                                           });
                               } else if (this.alter) {
                                   this.addAndFillCell(playerRow, player.getAge(), __COLOR, null, 2);
                               }
                               if (__WARNDRAW.monthDraw()) {  // Abrechnungszeitraum vor dem letztmoeglichen Ziehen...
                                   formatCell(playerRow.cells[this.colIdx.Age], true, __WARNDRAW.colAlert, null, 1.0);
                               }
                               if (this.fix) {
                                   this.addAndFillCell(playerRow, player.getFixSkills(), __COLOR, null, 0);
                               }
                               if (this.tr) {
                                   this.addAndFillCell(playerRow, player.getTrainableSkills(), __COLOR, null, 0);
                               }
                               if (this.zat) {
                                   this.addAndFillCell(playerRow, player.getZatDone(), __COLOR, null, 0);
                               }
                               if (this.antHpt) {
                                   this.addAndFillCell(playerRow, player.getPriPercent(player.getPos()), __COLOR, null, 0);
                               }
                               if (this.antNeb) {
                                   this.addAndFillCell(playerRow, player.getSecPercent(player.getPos()), __COLOR, null, 0);
                               }
                               if (this.pri) {
                                   this.addAndFillCell(playerRow, player.getPrios(player.getPos()), __COLOR, null, 1);
                               }
                               if (this.skill) {
                                   this.addAndFillCell(playerRow, player.getSkill(), __COLOR, null, 2);
                               }
                               if (this.pos) {
                                   this.addAndFillCell(playerRow, player.getPos(), __POS1COLOR);
                               }
                               for (let i = 1; i <= 6; i++) {
                                   const __POSI = ((i === 1) ? player.getPos() : player.getPos(i));
                                   const __COLI = getColor(__POSI);

                                   if (i <= this.anzOpti) {
                                       if ((i === 1) || ! player.isGoalie) {
                                           // Opti anzeigen
                                           this.addAndFillCell(playerRow, player.getOpti(__POSI), __COLI, null, 2);
                                       } else {
                                           // TOR, aber nicht bester Opti -> nur Zelle hinzufuegen
                                           this.addCell(playerRow);
                                       }
                                   }
                                   if (i <= this.anzMw) {
                                       if ((i === 1) || ! player.isGoalie) {
                                           // MW anzeigen
                                           this.addAndFillCell(playerRow, player.getMarketValue(__POSI), __COLI, null, 0);
                                       } else {
                                           // TOR, aber nicht bester MW -> nur Zelle hinzufuegen
                                           this.addCell(playerRow);
                                       }
                                   }
                               }

                               // Einzelwerte mit Ende 18
                               if (this.colIdx.Einz) {
                                   if (this.substSkills) {
                                       convertArrayFromHTML(playerRow.cells, this.colIdx.Einz, player.skillsEnd, function(value, cell, arr, index) {
                                                                                                                     UNUSED(arr);
                                                                                                                     if (~ __IDXPRI.indexOf(index)) {
                                                                                                                         formatCell(cell, true, __OSBLAU, __POS1COLOR, 1.0);
                                                                                                                     }
                                                                                                                     return value;
                                                                                                                 });
                                   } else {
                                       convertArrayFromHTML(playerRow.cells, this.colIdx.Einz, player.skills.length, function(value, cell, arr, index) {
                                                                                                                         UNUSED(arr);
                                                                                                                         if (~ __IDXPRI.indexOf(index)) {
                                                                                                                             formatCell(cell, true, __POS1COLOR, null, 1.0);
                                                                                                                         }
                                                                                                                         return value;
                                                                                                                     });
                                   }
                               }
                               if (this.trE) {
                                   this.addAndFillCell(playerRow, player.getTrainableSkills(player.__TIME.end), __COLOR, null, 1);
                               }
                               if (this.zatE) {
                                   this.addAndFillCell(playerRow, player.getZatLeft(), __COLOR, null, 0);
                               }
                               if (this.antHptE) {
                                   this.addAndFillCell(playerRow, player.getPriPercent(player.getPos(), player.__TIME.end), __COLOR, null, 0);
                               }
                               if (this.antNebE) {
                                   this.addAndFillCell(playerRow, player.getSecPercent(player.getPos(), player.__TIME.end), __COLOR, null, 0);
                               }
                               if (this.priE) {
                                   this.addAndFillCell(playerRow, player.getPrios(player.getPos(), player.__TIME.end), __COLOR, null, 1);
                               }
                               if (this.skillE) {
                                   this.addAndFillCell(playerRow, player.getSkill(player.__TIME.end), __COLOR, null, 2);
                               }
                               for (let i = 1; i <= 6; i++) {
                                   const __POSI = ((i === 1) ? player.getPos() : player.getPos(i));
                                   const __COLI = getColor(__POSI);

                                   if (i <= this.anzOptiE) {
                                       if ((i === 1) || ! player.isGoalie) {
                                           // Opti anzeigen
                                           this.addAndFillCell(playerRow, player.getOpti(__POSI, player.__TIME.end), __COLI, null, 2);
                                       } else {
                                           // TOR, aber nicht bester Opti -> nur Zelle hinzufuegen
                                           this.addCell(playerRow);
                                       }
                                   }
                                   if (i <= this.anzMwE) {
                                       if ((i === 1) || ! player.isGoalie) {
                                           // MW anzeigen
                                           this.addAndFillCell(playerRow, player.getMarketValue(__POSI, player.__TIME.end), __COLI, null, 0);
                                       } else {
                                           // TOR, aber nicht bester MW -> nur Zelle hinzufuegen
                                           this.addCell(playerRow);
                                       }
                                   }
                               }
                           },  // Ende addValues(player, playerRow)
        'setGroupTitle'  : function(tableRow) {
                               if (this.gtUxx) {
                                   const __CELL = tableRow.cells[0];
                                   const __SAI = __CELL.innerHTML.match(/Saison (\d+)/)[1];
                                   const __JG = 13 + this.saison - __SAI;

                                   __CELL.innerHTML = __CELL.innerHTML.replace('Jahrgang', 'U' + __JG + ' - $&');
                               }

                               tableRow.style.display = (this.gt ? '' : 'none');
                           }  // Ende setGroupTitle(tableRow)
    });

// ==================== Ende Abschnitt fuer Klasse ColumnManager ====================

// *** EOF ***

/*** Ende Modul OS2.class.column.js ***/

/*** Modul OS2.class.table.js ***/

// ==UserScript==
// _name         OS2.class.table
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifischer Klasse TableManager
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.class.table.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse TableManager ====================

// Klasse fuer Tabelle

/*class*/ function TableManager /*{
    constructor*/(optSet, colIdx, rows, offsetUpper, offsetLower) {
        'use strict';

        //Object.call(this);

        this.currSaison = optSet.getOptValue('aktuelleSaison');

        this.saison = optSet.getOptValue('saison');
        this.land = optSet.getOptValue('land');
        this.liga = optSet.getOptValue('liga');
        this.tabTypNr = optSet.getOptValue('tabTypNr', 0);

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
//}

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

// ==================== Abschnitt fuer Hilfsfunktionen zum Zugriff auf die Seite ====================

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

// ==================== Ende Abschnitt fuer Hilfsfunktionen zum Zugriff auf die Seite ====================

// *** EOF ***

/*** Ende Modul OS2.class.table.js ***/

