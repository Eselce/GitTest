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

const __GAMETYPENRN = {    // 'Blind FSS gesucht!'
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
        'unbekannt'  :  'unbekannt',
        'reserviert' :  undefined,
        'Frei'       :  undefined,
        'spielfrei'  :  "",
        'Friendly'   :  'FSS',
        'Liga'       :  undefined,
        'LP'         :  'Pokal',
        'OSEQ'       :  undefined,
        'OSE'        :  undefined,
        'OSCQ'       :  undefined,
        'OSC'        :  undefined,
        'Supercup'   : 'Super'
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
        'Rd'        : 0,
        'IdOSE'     : 1,
        'IdOSC'     : 2,
        'ZAT_S2'    : 3,    // 0,
        'ZAT'       : 4,    // 1,
        'LabOSE'    : 5,    // 2,
        'LabOSC'    : 6,    // 3,
        'Lfd'       : 7,
        'CupOSE'    : 8,    // 4,
        'CupOSC'    : 9,    // 5,
        'EvtOSE'    : 10,   // 6,
        'EvtOSC'    : 11,   // 7,
        'RndOSE'    : 12,   // 8,
        'RndOSC'    : 13,   // 9,
        'HROSE'     : 14,   // 10,
        'HROSC'     : 15,   // 11,
        'EtOSE'     : 16,
        'EtOSC'     : 17,
        'Et2OSE'    : 18,
        'Et2OSC'    : 19,
        'IntOSE'    : 20,   // 12,
        'IntOSC'    : 21    // 13
    };

const __INTSPIELPLAN = {
        // Id : Rd OSE OSC ZAT2 ZAT LabOSE                      LabOSC                     Lfd  CupOSE  CupOSC  EvtOSE  EvtOSC      RndOSE              RndOSC             HROSE/C EtOSE/C Et2OSE/C IntOSE              IntOSC
        1   : [ 1,  0,  0,  0,  0,  'Saisonstart',              'Saisonstart',              1,  'OSEQ', 'OSCQ', 'OSEQ', 'OSCQ',     '',                 '',                 0,  0,  1,  1,  1,  1,  '',                 ''              ],
        2   : [ 2,  1,  1,  4,  5,  '1. Quali Hin',             '1. Quali Hin',             2,  'OSEQ', 'OSCQ', 'OSEQ', 'OSCQ',     'Runde 1',          'Runde 1',          1,  1,  1,  1,  1,  1,  '1. Runde',         '1. Runde'      ],
        3   : [ 3,  1,  1,  6,  7,  '1. Quali R\u00FCck',       '1. Quali R\u00FCck',       3,  'OSEQ', 'OSCQ', 'OSEQ', 'OSCQ',     'Runde 1',          'Runde 1',          2,  2,  1,  1,  1,  1,  '1. Runde',         '1. Runde'      ],
        4   : [ 4,  2,  2,  10, 11, '2. Quali Hin',             '2. Quali Hin',             4,  'OSEQ', 'OSCQ', 'OSEQ', 'OSCQ',     'Runde 2',          'Runde 2',          1,  1,  1,  1,  1,  1,  '2. Runde',         '2. Runde'      ],
        5   : [ 5,  2,  2,  14, 13, '2. Quali R\u00FCck',       '2. Quali R\u00FCck',       5,  'OSEQ', 'OSCQ', 'OSEQ', 'OSCQ',     'Runde 2',          'Runde 2',          2,  2,  1,  1,  1,  1,  '2. Runde',         '2. Runde'      ],
        6   : [ 0,  0,  10, 16, 17, '',                         '',                         8,  '',     'OSC',  '',     'OSC-HR',   '',                 '',                 0,  0,  0,  2,  0,  2,  '',                 ''              ],
        7   : [ 0,  0,  10, 36, 31, '',                         '',                         13, '',     'OSC',  '',     'OSC-HR',   '',                 '',                 0,  0,  0,  2,  0,  2,  '',                 ''              ],
        8   : [ 6,  3,  11, 16, 17, '3. Quali Hin',             '1. Gruppenspiel',          8,  'OSEQ', 'OSC',  'OSEQ', 'OSC-HR',   'Runde 3',          'Spiel 1',          1,  1,  1,  2,  1,  2,  '3. Runde',         '1. Runde'      ],  // 1. Spiel
        9   : [ 7,  3,  12, 22, 19, '3. Quali R\u00FCck',       '2. Gruppenspiel',          9,  'OSEQ', 'OSC',  'OSEQ', 'OSC-HR',   'Runde 3',          'Spiel 2',          2,  1,  1,  2,  1,  2,  '3. Runde',         '1. Runde'      ],  // 2. Spiel
        10  : [ 8,  11, 13, 24, 23, '1. Runde Hin',             '3. Gruppenspiel',          10, 'OSE',  'OSC',  'OSE',  'OSC-HR',   'Runde 1',          'Spiel 3',          1,  1,  2,  2,  2,  2,  '1. Runde',         '2. Runde'      ],  // 3. Spiel
        11  : [ 9,  11, 14, 26, 25, '1. Runde R\u00FCck',       '4. Gruppenspiel',          11, 'OSE',  'OSC',  'OSE',  'OSC-HR',   'Runde 1',          'Spiel 4',          2,  2,  2,  2,  2,  2,  '1. Runde',         '2. Runde'      ],  // 4. Spiel
        12  : [ 10, 12, 15, 34, 29, '2. Runde Hin',             '5. Gruppenspiel',          12, 'OSE',  'OSC',  'OSE',  'OSC-HR',   'Runde 2',          'Spiel 5',          1,  2,  3,  2,  3,  2,  '2. Runde',         '3. Runde'      ],  // 5. Spiel
        13  : [ 11, 12, 16, 36, 31, '2. Runde R\u00FCck',       '6. Gruppenspiel',          13, 'OSE',  'OSC',  'OSE',  'OSC-HR',   'Runde 2',          'Spiel 6',          2,  2,  3,  2,  3,  2,  '2. Runde',         '3. Runde'      ],  // 6. Spiel
        14  : [ 0,  0,  20, 38, 35, '',                         '',                         16, '',     'OSC',  '',     'OSC-ZR',   '',                 '',                 0,  0,  0,  3,  0,  3,  '',                 ''              ],
        15  : [ 0,  0,  20, 54, 49, '',                         '',                         21, '',     'OSC',  '',     'OSC-ZR',   '',                 '',                 0,  0,  0,  3,  0,  3,  '',                 ''              ],
        16  : [ 12, 13, 21, 38, 35, '3. Runde Hin',             '7. Gruppenspiel',          16, 'OSE',  'OSC',  'OSE',  'OSC-ZR',   'Runde 3',          'Spiel 1',          1,  1,  3,  3,  3,  3,  '3. Runde',         '4. Runde'      ],  // 1. Spiel
        17  : [ 13, 13, 22, 42, 37, '3. Runde R\u00FCck',       '8. Gruppenspiel',          17, 'OSE',  'OSC',  'OSE',  'OSC-ZR',   'Runde 3',          'Spiel 2',          2,  1,  3,  3,  3,  3,  '3. Runde',         '4. Runde'      ],  // 2. Spiel
        18  : [ 14, 14, 23, 44, 41, '4. Runde Hin',             '9. Gruppenspiel',          18, 'OSE',  'OSC',  'OSE',  'OSC-ZR',   'Runde 4',          'Spiel 3',          1,  1,  3,  3,  3,  3,  '4. Runde',         '5. Runde'      ],  // 3. Spiel
        19  : [ 15, 14, 24, 50, 43, '4. Runde R\u00FCck',       '10. Gruppenspiel',         19, 'OSE',  'OSC',  'OSE',  'OSC-ZR',   'Runde 4',          'Spiel 4',          2,  2,  3,  3,  3,  3,  '4. Runde',         '5. Runde'      ],  // 4. Spiel
        20  : [ 16, 21, 25, 52, 47, 'Achtelfinale Hin',         '11. Gruppenspiel',         20, 'OSE',  'OSC',  'OSE',  'OSC-ZR',   'Achtelfinale',     'Spiel 5',          1,  2,  4,  3,  4,  3,  'Achtelfinale',     '6. Runde'      ],  // 5. Spiel
        21  : [ 17, 21, 26, 54, 49, 'Achtelfinale R\u00FCck',   '12. Gruppenspiel',         21, 'OSE',  'OSC',  'OSE',  'OSC-ZR',   'Achtelfinale',     'Spiel 6',          2,  2,  4,  3,  4,  3,  'Achtelfinale',     '6. Runde'      ],  // 6. Spiel
        22  : [ 0,  0,  30, 56, 53, '',                         '',                         24, '',     'OSC',  '',     'OSC-FR',   '',                 '',                 0,  0,  0,  4,  0,  4,  '',                 ''              ],
        23  : [ 0,  0,  30, 70, 71, '',                         '',                         28, '',     'OSC',  '',     'OSC-FR',   '',                 '',                 0,  0,  0,  4,  0,  4,  '',                 ''              ],
        24  : [ 18, 31, 31, 56, 53, 'Viertelfinale Hin',        'Viertelfinale Hin',        24, 'OSE',  'OSC',  'OSE',  'OSC-FR',   'Viertelfinale',    'Viertelfinale',    1,  1,  4,  4,  5,  4,  'Viertelfinale',    'Viertelfinale' ],
        25  : [ 19, 31, 31, 60, 55, 'Viertelfinale R\u00FCck',  'Viertelfinale R\u00FCck',  25, 'OSE',  'OSC',  'OSE',  'OSC-FR',   'Viertelfinale',    'Viertelfinale',    2,  2,  4,  4,  5,  4,  'Viertelfinale',    'Viertelfinale' ],
        26  : [ 20, 32, 32, 62, 59, 'Halbfinale Hin',           'Halbfinale Hin',           26, 'OSE',  'OSC',  'OSE',  'OSC-FR',   'Halbfinale',       'Halbfinale',       1,  1,  4,  4,  5,  4,  'Halbfinale',       'Halbfinale'    ],
        27  : [ 21, 32, 32, 66, 61, 'Halbfinale R\u00FCck',     'Halbfinale R\u00FCck',     27, 'OSE',  'OSC',  'OSE',  'OSC-FR',   'Halbfinale',       'Halbfinale',       2,  2,  4,  4,  5,  4,  'Halbfinale',       'Halbfinale'    ],
        28  : [ 22, 33, 33, 70, 71, 'Finale',                   'Finale',                   28, 'OSE',  'OSC',  'OSE',  'OSC-FR',   'Finale',           'Finale',           0,  0,  4,  4,  5,  4,  'Finale',           'Finale'        ],
        29  : [ 23, 40, 40, 99, 99, 'Saisonende',               'Saisonende',               28, 'OSE',  'OSC',  'OSE',  'OSC-FR',   'Sieger',           'Sieger',           0,  0,  4,  4,  5,  4,  'Sieger',           'Sieger'        ]
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

const __OSCRUNDEN = {
        0   : 'Saisonstart',
        1   : '1. Runde Quali',
        2   : '2. Runde Quali',
        3   : 'Sieger Quali',
        10  : 'Hauptrunde',     // '1. Hauptrunde'
        11  : 'HR Spiel 1',
        12  : 'HR Spiel 2',
        13  : 'HR Spiel 3',
        14  : 'HR Spiel 4',
        15  : 'HR Spiel 5',
        16  : 'HR Spiel 6',
        20  : 'Zwischenrunde',  // '2. Hauptrunde'
        21  : 'ZR Spiel 1',
        22  : 'ZR Spiel 2',
        23  : 'ZR Spiel 3',
        24  : 'ZR Spiel 4',
        25  : 'ZR Spiel 5',
        26  : 'ZR Spiel 6',
        31  : 'Viertelfinale',
        32  : 'Halbfinale',
        33  : 'Finale',
        34  : 'OSC-Sieger',
        40  : 'Saisonende'
    };
const __OSERUNDEN = {
        0   : 'Saisonstart',
        1   : '1. Runde Quali',
        2   : '2. Runde Quali',
        3   : '3. Runde Quali',
        4   : 'Sieger Quali',
        11  : '1. Runde',
        12  : '2. Runde',
        13  : '3. Runde',
        14  : '4. Runde',
        21  : 'Achtelfinale',
        31  : 'Viertelfinale',
        32  : 'Halbfinale',
        33  : 'Finale',
        34  : 'OSE-Sieger',
        40  : 'Saisonende'
    };

// Beschreibungstexte aller Runden...
const __POKALRUNDEN = [ "", '1. Runde', '2. Runde', '3. Runde', 'Achtelfinale', 'Viertelfinale', 'Halbfinale', 'Finale', 'Pokalsieger' ];
const __QUALIRUNDEN = [ "", 'Quali 1', 'Quali 2', 'Quali 3' ];
const __OSCKORUNDEN = [ "", 'Viertelfinale', 'Halbfinale', 'Finale', 'OSC-Sieger' ];
const __OSEKORUNDEN = [ "", 'Runde 1', 'Runde 2', 'Runde 3', 'Runde 4', 'Achtelfinale', 'Viertelfinale', 'Halbfinale', 'Finale', 'OSE-Sieger' ];
const __OSCALLRND   = [ "", '1. Runde Quali', '2. Runde Quali', '1. Hauptrunde', '2. Hauptrunde', 'Viertelfinale', 'Halbfinale', 'Finale', 'OSC-Sieger' ];
const __OSEALLRND   = [ "", '1. Runde Quali', '2. Runde Quali', '3. Runde Quali', '1. Runde', '2. Runde', '3. Runde', '4. Runde', 'Achtelfinale', 'Viertelfinale', 'Halbfinale', 'Finale', 'OSE-Sieger' ];
const __HINRUECK    = [ " Hin", " R\u00FCck", "" ];

// Ermittlung von Spielrunden...
const __RUNDEPOKAL  = reverseMapping(__POKALRUNDEN, Number);
const __RUNDEQUALI  = reverseMapping(__QUALIRUNDEN, Number);
const __KORUNDEOSC  = reverseMapping(__OSCKORUNDEN, Number);
const __KORUNDEOSE  = reverseMapping(__OSEKORUNDEN, Number);
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
// return OS2-ID fuer den Spieltyp (1 bis 7 oder 10), 0 fuer 'spielfrei'/'Frei'/'reserviert', -1 fuer ungueltig
function getGameTypeID(gameType, defValue = __GAMETYPENRN.unbekannt) {
    return getValue(__GAMETYPENRN[gameType], defValue);
}

// Gibt den Namen eines Wettbewerbs zurueck
// id: OS2-ID des Wettbewerbs eines Spiels (1 bis 7 oder 10), 0 fuer 'spielfrei'/'Frei'/'reserviert', -1 fuer ungueltig
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
// return Name der Landes, 'unbekannt' fuer ungueltig
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
// return Name der Liga, 'unbekannt' fuer ungueltig
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
// return Der konvertierte String (z.B. 'FAN' statt 'KOB') oder unveraendert
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
// return Der konvertierte String mit Aenderungen (z.B. 'FAN' statt 'KOB') oder unveraendert
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
