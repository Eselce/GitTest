/****** JavaScript-Bibliothek 'lib.OS2.base.js' ["OS2BASE"] ******/

// Inhaltsverzeichnis:
// https://eselce.github.io/GitTest/misc/OS2/lib/<OS2BASE>: 
//  OS2.list.js
//  OS2.calc.js
//  OS2.team.js
//  OS2.page.team.js
//  OS2.page.js
//  OS2.zat.js

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
const __INTOSEALLZATS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.EvtOSE, __COLINTSPIELPLAN.ZAT, mappingPushFun(Number));
const __INTOSCALLZATS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.EvtOSC, __COLINTSPIELPLAN.ZAT, mappingPushFun(Number));
const __INTOSECUPS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSE, __COLINTSPIELPLAN.CupOSE, mappingPush);
const __INTOSCCUPS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSC, __COLINTSPIELPLAN.CupOSC, mappingPush);
const __INTOSEEVTS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSE, __COLINTSPIELPLAN.EvtOSE, mappingPush);
const __INTOSCEVTS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSC, __COLINTSPIELPLAN.EvtOSC, mappingPush);
const __INTOSEZATS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSE, __COLINTSPIELPLAN.ZAT, mappingPushFun(Number));
const __INTOSCZATS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSC, __COLINTSPIELPLAN.ZAT, mappingPushFun(Number));

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
    const __HASTEAMOPT = optSet.hasOpt('team');

    if (teamParams !== undefined) {
        addProps(myTeam, teamParams, myTeam.__TEAMITEMS);
        __LOG[2]("Ermittelt: " + safeStringify(myTeam));
        // ... und abspeichern, falls erweunscht...
        if (__HASTEAMOPT) {
            optSet.setOpt('team', myTeam, false);
        }
    } else {
        const __TEAM = (__HASTEAMOPT ? optSet.getOptValue('team') : undefined);  // Gespeicherte Parameter

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
        'Tabelle'   : 'TABLE TABLE',  // Erste Tabelle innerhalb einer Tabelle...
        'Zeile'     : 0,
        'Spalte'    : 1,
        'start'     : " von ",
        'middle'    : "</b><br>",
        'liga'      : ". Liga",
        'land'      : ' ',
        'end'       : "<a href="
    };

const __TEAMSEARCHTEAM = {  // Parameter zum Team "<b>TEAM - LIGA <a href=...>LAND</a></b>"
        'Tabelle'   : 'TABLE TABLE',  // Erste Tabelle innerhalb einer Tabelle...
        'Zeile'     : 0,
        'Spalte'    : 0,
        'start'     : "<b>",
        'middle'    : " - ",
        'liga'      : ". Liga",
        'land'      : 'target="_blank">',
        'end'       : "</a></b>"
    };

const __TEAMIDSEARCHHAUPT = {  // Parameter zur Team-ID "<b>Deine Spiele in</b>...<a href="livegame/index.php?spiele=TEAMID,ZAT">LIVEGAME</a>"
        'Tabelle'   : 'TABLE',  // Aeussere Tabelle, erste ueberhaupt (darunter die Zeile #6 "Deine Spiele in")...
        'Zeile'     : 6,
        'Spalte'    : 0,
        'start'     : '<a href="livegame/index.php?spiele=',
        'end'       : '">LIVEGAME</a>',
        'delim'     : ','
    };

const __TEAMIDSEARCHTEAM = {  // Parameter zur Team-ID "<a hspace="20" href="javascript:tabellenplatz(TEAMID)">Tabellenpl\u00E4tze</a>"
        'Tabelle'   : 'TABLE',  // Aeussere Tabelle, erste ueberhaupt (darunter die Zeile #1/Spalte #1 "Tabellenplaetze")...
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
    const __TEAMTABLE    = getElement(getValue(__TEAMSEARCH.Tabelle, 'TABLE TABLE'), 0, doc);
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
    const __TEAMIDTABLE    = getElement(getValue(__TEAMIDSEARCH.Tabelle, 'TABLE'), 0, doc);
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

// Liefert umschlossenen textContent und einen der einem <A>-Link uebergebenen Parameter.
// Als Drittes wird optional der ganze Ziel-Link (das href) zurueckgegeben.
// element: Eine <A>-Node mit href-Link
// queryID: Name des Parameters innerhalb der URL, der die ID liefert
// return Text, ID und href-Link
function getLinkData(element, queryID) {
    checkType(element && element.href, 'string', true, 'getLinkData', 'element.href', 'String');
    checkType(queryID, 'string', false, 'getLinkData', 'queryID', 'String');

    const __A = element; // <A href="https://.../...?QUERYID=ID">TEXT</A>
    const __TEXT = __A.textContent;
    const __HREF = __A.href;
    const __URI = new URI(__HREF);
    const __ID = __URI.getQueryPar(queryID);

    return [ __TEXT, __ID, __HREF ];
}

// Liefert den HTML-Code fuer einen parametrisierten <IMG>-Link.
// imageURL: URL des verlinkten Bildes
// title: Tooltip des Bildes (Default: null fuer kein Tooltip)
// altText: ALT-Parameter fuer Ausgabe ohne Bild (Default: Tooltip-Text)
// return String mit HTML-Code des <IMG>-Links
function getImgLink(imageURL, title = null, altText = title) {
    checkType(imageURL, 'string', true, 'getImgLink', 'imageURL', 'String');
    checkType(title, 'string', false, 'getImgLink', 'title', 'String');
    checkType(altText, 'string', false, 'getImgLink', 'altText', 'String');

    const __ALTSTR = (altText ? (' alt="' + altText + '"') : "");
    const __IMGSTR = '<IMG src="' + imageURL + '"' + __ALTSTR + ' />';
    const __RETSTR = (title ? ('<ABBR title="' + title + '">' + __IMGSTR + '</ABBR>') : __IMGSTR);

    return __RETSTR;
}

// Liefert den HTML-Code fuer einen parametrisierten <A>-Link auf ein OS-Team.
// teamName: Name des Teams fuer den textContent
// osID: OS-ID des Teams
// return String mit HTML-Code des <A>-Team-Links
function getTeamLink(teamName, osID) {
    checkType(teamName, 'string', true, 'getTeamLink', 'teamName', 'String');
    checkType(osID, 'number', true, 'getTeamLink', 'osID', 'Number');

    const __RETSTR = '<A href="/st.php?c=' + osID + '" onClick="teaminfo(' + osID + '); return false;">' + teamName + '</A>';

    return __RETSTR;
}

// Liefert den HTML-Code fuer einen parametrisierten <A>-Link auf das Manager-PM-Fenster.
// managerName: Name des Managers fuer den textContent
// pmID: User-ID des Managers im PM-System von OS2
// return String mit HTML-Code des <A>-Manager-Links, falls pmID okay, ansonsten nur Managername geklammert
function getManagerLink(managerName, pmID) {
    checkType(managerName, 'string', true, 'getManagerLink', 'managerName', 'String');
    checkType(pmID, 'number', true, 'getManagerLink', 'pmID', 'Number');

    const __RETSTR = (pmID > -1) ? ('<A href="/osneu/pm?action=writeNew&receiver_id=' + pmID
                    + '" onclick="writePM(" + pmID + "); return false;" target="_blank">'
                    + managerName + '</A>') : ('(' + managerName + ')');

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

                                 return "<A " + URI.prototype.formatParams({
                                                                      'href'   : this.uri.getPath(),
                                                                      'target' : (target ? target : '_blank')
                                                                  }, function(value) {
                                                                         return '"' + value + '"';
                                                                     }, ' ', '=') + '>' + this.getLabel() + "</A>";
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
            ret = ' <A href="javascript:spielpreview(' + paarung + ',' + __GAMETYPEID + ')">' + label + "</A>";
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

