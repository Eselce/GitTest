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
const __GAMETYPES = reverseMapping(__GAMETYPENRN);

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
const __LIGATYPES = reverseMapping(__LIGANRN);

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
const __LAENDER = reverseMapping(__LANDNRN);

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
        7   : [ 22, 19, '3. Quali R\u00FCck',       '2. Gruppenspiel',          'OSEQ', 'OSC',  'OSEQ', 'OSCHR',    'Runde 3',          'Spiel 2',          2,  1,  '3. Runde',         '2. Runde'      ],  // 2. Spiel
        8   : [ 24, 23, '1. Runde Hin',             '3. Gruppenspiel',          'OSE',  'OSC',  'OSE',  'OSCHR',    'Runde 1',          'Spiel 3',          1,  1,  '1. Runde',         '3. Runde'      ],  // 3. Spiel
        9   : [ 26, 25, '1. Runde R\u00FCck',       '4. Gruppenspiel',          'OSE',  'OSC',  'OSE',  'OSCHR',    'Runde 1',          'Spiel 4',          2,  2,  '1. Runde',         '4. Runde'      ],  // 4. Spiel
        10  : [ 34, 29, '2. Runde Hin',             '5. Gruppenspiel',          'OSE',  'OSC',  'OSE',  'OSCHR',    'Runde 2',          'Spiel 5',          1,  2,  '2. Runde',         '5. Runde'      ],  // 5. Spiel
        11  : [ 36, 31, '2. Runde R\u00FCck',       '6. Gruppenspiel',          'OSE',  'OSC',  'OSE',  'OSCHR',    'Runde 2',          'Spiel 6',          2,  2,  '2. Runde',         '6. Runde'      ],  // 6. Spiel
        12  : [ 38, 35, '3. Runde Hin',             '7. Gruppenspiel',          'OSE',  'OSC',  'OSE',  'OSCZR',    'Runde 3',          'Spiel 1',          1,  1,  '3. Runde',         '1. Runde'      ],  // 1. Spiel
        13  : [ 42, 37, '3. Runde R\u00FCck',       '8. Gruppenspiel',          'OSE',  'OSC',  'OSE',  'OSCZR',    'Runde 3',          'Spiel 2',          2,  1,  '3. Runde',         '2. Runde'      ],  // 2. Spiel
        14  : [ 44, 41, '4. Runde Hin',             '9. Gruppenspiel',          'OSE',  'OSC',  'OSE',  'OSCZR',    'Runde 4',          'Spiel 3',          1,  1,  '4. Runde',         '3. Runde'      ],  // 3. Spiel
        15  : [ 50, 43, '4. Runde R\u00FCck',       '10. Gruppenspiel',         'OSE',  'OSC',  'OSE',  'OSCZR',    'Runde 4',          'Spiel 4',          2,  2,  '4. Runde',         '4. Runde'      ],  // 4. Spiel
        16  : [ 52, 47, 'Achtelfinale Hin',         '11. Gruppenspiel',         'OSE',  'OSC',  'OSE',  'OSCZR',    'Achtelfinale',     'Spiel 5',          1,  2,  'Achtelfinale',     '5. Runde'      ],  // 5. Spiel
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
const __INTOSEALLZATS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.EvtOSE, __COLINTSPIELPLAN.ZAT, mappingPush);
const __INTOSCALLZATS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.EvtOSC, __COLINTSPIELPLAN.ZAT, mappingPush);
const __INTOSECUPS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSE, __COLINTSPIELPLAN.CupOSE, mappingPush);
const __INTOSCCUPS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSC, __COLINTSPIELPLAN.CupOSC, mappingPush);
const __INTOSEEVTS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSE, __COLINTSPIELPLAN.EvtOSE, mappingPush);
const __INTOSCEVTS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSC, __COLINTSPIELPLAN.EvtOSC, mappingPush);
const __INTOSEZATS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSE, __COLINTSPIELPLAN.ZAT, mappingPush);
const __INTOSCZATS = selectMapping(__INTSPIELPLAN, __COLINTSPIELPLAN.IntOSC, __COLINTSPIELPLAN.ZAT, mappingPush);

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
function getLandName(tla, defValue = __TLALAND[undefined]) {
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
function getLigaName(ID, defValue = __LIGATYPES[0]) {
    return getValue(__LIGATYPES[ID], defValue);
}

// Gibt die Ligengroesse des Landes mit dem uebergebenen Kuerzel (TLA) zurueck.
// tla: Kuerzel (TLA) des Landes
// defValue: Default-Wert (__TLALIGASIZE[undefined])
// return Ligengroesse des Landes (10/18/20), defaultValue fuer unbekannt
function getLigaSizeByTLA(tla, defValue = __TLALIGASIZE[undefined]) {
    return getValue(__TLALIGASIZE[tla], defValue);
}

// Gibt die Ligengroesse des Landes mit dem uebergebenen Namen zurueck.
// land: Name des Landes
// defValue: Default-Wert (__TLALIGASIZE[undefined])
// return Ligengroesse des Landes (10/18/20), defaultValue fuer unbekannt
function getLigaSize(land, defValue = __TLALIGASIZE[undefined]) {
    return getLigaSizeByTLA(__LANDTLAS[land], defValue);
}

// Gibt die Ligengroesse des Landes mit der uebergebenen ID zurueck.
// ID: OS2-ID des Landes
// defValue: Default-Wert (__TLALIGASIZE[undefined])
// return Ligengroesse des Landes (10/18/20), defaultValue fuer unbekannt
function getLigaSizeById(ID, defValue = __TLALIGASIZE[undefined]) {
    return getValue(__LAENDER[ID], defValue);
}

// Gibt den ZAT, das Event und den Link einer internationalen Runde zurueck.
// TODO Diese Version ist beschraenkt auf Saisons ab der 3. Saison!
// searchCup: Gesuchter Wettbewerb ('OSC', 'OSCQ', 'OSE', 'OSEQ')
// searchRunde: Gesuchte Runde im Wettbewerb ('1. Runde', ...)
// currZAT: Der aktuelle ZAT (fuer die Frage, ob vergangene oder kommende Runde)
// return ZAT, Event der Runde und deren OS2-Webseite
function calcZATEventByCupRunde(searchCup, searchRunde, currZAT) {
    const __CUP = searchCup;
    const __RUNDE = searchRunde;
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

                if ((! ~ ret[0]) || (__ZAT <= currZAT)) {  // in der Zukunft nur den ersten Treffer...
                    ret = [ __ZAT, __EVT, __EVT.toLowerCase() + '.php' ];
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
        case "" :    return '#111166';  // osBlau
        default :    return "";
    }
}

// ==================== Ende Abschnitt fuer Skilltypen, Skills und Spielreihen ====================

// ==================== Abschnitt Hilfsfunktionen fuer Object-Mapping ====================

// Kehrt das Mapping eines Objekts um und liefert ein neues Objekt zurueck.
// obj: Objekt mit key => value
// keyValFun: Konvertierfunktion fuer die neuen Werte aus den alten Schluesseln
// - newValue: Neuer Wert (zu konvertierender alter Schluessel)
// - newKey: Neuer Schluessel (konvertierter alter Wert)
// - newObj: Neues Objekt (im Aufbau, alles konvertiert)
// - oldObj (optional): Altes Objekt als Referenz (als key ist newValue benutzbar)
// - return Konvertierter neuer Wert
// valuesFun: Funktion zur Ermittlung der neuen Schluessel aus alten Werten (Default: Object.values)
// - obj: Objekt, das an reverseMapping uebergeben wurde
// - return Liste aller alten Werte als Array, aus denen sich die neuen Schluessel ergeben
// valKeyFun: Konvertierfunktion fuer die neuen Schluessel aus den alten Werten
// - value: Alter Wert (unveraendert, zu konvertieren zum neuen Schluessel)
// - key: Alter Schluessel (unveraendert, wird spaeter zum neuen Wert konvertiert)
// - obj: Altes Objekt (mit allen Eintraegen, sollte unveraendert bleiben!)
// - return Konvertierter neuer Schluessel
// return Neues Objekt mit value => key (doppelte value-Werte fallen heraus!)
// Dabei werden die value-Werte zunaechst ueber valKeyFun zu neuen Schluesseln.
// Ausserdem werden die key-Werte zunaechst ueber keyValFun zu neuen Werten! 
function reverseMapping(obj, keyValFun, valuesFun, valKeyFun) {
    if (! obj) {
        return obj;
    }

    try {
        checkType(obj, 'object', true, 'reverseMapping', 'obj', 'Object');
        checkType(keyValFun, 'function', false, 'reverseMapping', 'keyValFun', 'Function');
        checkType(valuesFun, 'function', false, 'reverseMapping', 'valuesFun', 'Function');
        checkType(valKeyFun, 'function', false, 'reverseMapping', 'valKeyFun', 'Function');

        const __KEYSFUN = Object.keys;
        const __VALUESFUN = (valuesFun || Object.values);
        const __OLDKEYS = getValue(__KEYSFUN(obj), []);
        const __OLDVALUES = getValue(__VALUESFUN(obj), []);
        const __RET = { };

        __OLDKEYS.forEach((key, index) => {
                const __VALUE = __OLDVALUES[index];
                const __NEWKEYS = (valKeyFun ? valKeyFun(__VALUE, index, __OLDVALUES) : __VALUE);
                const __NEWVALUE = (keyValFun ? keyValFun(key, __NEWKEYS, __RET, obj) : key);

                if (Array.isArray(__NEWKEYS)) {
                    __NEWKEYS.forEach(key => (__RET[key] = __NEWVALUE));
                } else {
                    __RET[__NEWKEYS] = __NEWVALUE;
                }
            });

        return __RET;
    } catch (ex) {
        showException('[' + (ex && ex.lineNumber) + "] reverseMapping()", ex);
    }
}

// Erzeugt ein Mapping innerhalb der Werte eines Objekts ueber Spaltenindizes.
// obj: Objekt mit key => value
// keyValFun: Konvertierfunktion fuer die neuen Werte aus den alten Schluesseln
// - newValue: Neuer Wert (zu konvertieren)
// - newKey: Neuer Schluessel (konvertiert)
// - newObj: Neues Objekt (im Aufbau, alles konvertiert)
// - oldObj (optional): Altes Objekt als Referenz (als key ist newValue benutzbar)
// - return Konvertierter neuer Wert
// valKeyFun: Konvertierfunktion fuer die neuen Schluessel aus der Schluesselspalte
// - value: Alter Wert (unveraendert, zu konvertieren zum neuen Schluessel)
// - key: Alter Schluessel (unveraendert)
// - obj: Altes Objekt (mit allen Eintraegen, sollte unveraendert bleiben!)
// - return Konvertierter neuer Schluessel
// return Neues Objekt mit value[keyIndex] => value[valueIndex]
//        (doppelte value-Werte fallen heraus!)
// Dabei werden die value-Werte zunaechst ueber valKeyFun zu neuen Schluesseln.
// Ausserdem werden die key-Werte zunaechst ueber keyValFun zu neuen Werten! 
function selectMapping(obj, keyIndex, valueIndex, keyValFun, valKeyFun) {
    checkType(obj, 'object', true, 'selectMapping', 'obj', 'Object');
    checkType(keyIndex, 'number', true, 'selectMapping', 'keyIndex', 'Number');
    checkType(valueIndex, 'number', true, 'selectMapping', 'valueIndex', 'Number');
    checkType(keyValFun, 'function', false, 'selectMapping', 'keyValFun', 'Function');
    checkType(valKeyFun, 'function', false, 'selectMapping', 'valKeyFun', 'Function');

    const __KEYVALFUN = mappingValueSelect.bind(this, valueIndex, keyValFun);
    const __VALUESFUN = mappingValuesFunSelect.bind(this, keyIndex);
    const __VALKEYFUN = valKeyFun;

    return reverseMapping(obj, __KEYVALFUN, __VALUESFUN, __VALKEYFUN);
}

// Standard-Konvertierfunktion fuer die neuen Werte aus den alten Schluesseln
// fuer die Funktion reverseMapping() (legt Array mit allen Schluesseln an).
// Ohne Konvertierfunktion wuerde immer nur der letzte Schluessel gemerkt werden
// value: Neuer Wert (zu konvertierender alter Schluessel)
// key: Neuer Schluessel (konvertierter alter Wert)
// obj: Neues Objekt (im Aufbau, alles konvertiert)
// return Konvertierter neuer Wert (in Form eines Arrays)
function mappingPush(value, key, obj) {
    return pushObjValue(obj, key, value, null, true, false);
}

// Konvertierfunktion fuer die neuen Werte aus den alten Schluesseln fuer die Funktion
// reverseMapping() (legt Array mit allen Schluesseln an, falls dieser eindeutig ist).
// Ohne Konvertierfunktion wuerde immer nur der letzte Schluessel gemerkt werden
// value: Neuer Wert (zu konvertierender alter Schluessel)
// key: Neuer Schluessel (konvertierter alter Wert)
// obj: Neues Objekt (im Aufbau, alles konvertiert)
// return Konvertierter neuer Wert (in Form eines Arrays, falls mehr als einmal vorkommend)
function mappingSetOrPush(value, key, obj) {
    return pushObjValue(obj, key, value, null, true, true);
}

// Konvertierfunktion fuer die neuen Werte aus einer Spalte der alten Werte
// fuer die Funktion reverseMapping() als Parameter keyValFun (index und keyValFun
// sollten dafuer mit bind() herausgefiltert werden: bind(this, index, keyValFun)).
// Das Ergebnis, also ein Wert der indizierten Spalte, wird ggfs. noch nachbearbeitet.
// index: Index der Spalte, dessen Array-Eintraege als neuer Wert genutzt werden (Default: 0)
// keyValFun: Funktion, mit der der ermittelte Wert nachbearbeitet wird (Default: null)
// value: Neuer Wert (zu konvertierender alter Schluessel)
// key: Neuer Schluessel (konvertierter alter Wert)
// obj: Neues Objekt (im Aufbau, alles konvertiert)
// oldObj: Altes Objekt, aus derem alten Wert selektiert wird (key ist value, der alte Schluessel)
// return Selektierter neuer Wert (aus einer Spalte des alten Wertes)
function mappingValueSelect(index = 0, keyValFun = null, value, key, obj, oldObj) {
    const __VALUE = getArrValue(oldObj[value], index);
    const __NEWVALUE = (keyValFun ? keyValFun(__VALUE, key, obj, oldObj) : __VALUE);

    return __NEWVALUE;
}

// Standard-Selectionsfunktion fuer die neuen Keys aus Spalten der alten Werte
// fuer die Funktion reverseMapping() (die in Array-Form vorliegen) als keysFun-Parameter.
// index: Index der Spalte, dessen Array-Eintraege als neuer Key genutzt werden (Default: 0)
// obj: Objekt, dessen Werte ermittelt werden (besteht aus Array-Eintraegen)
// return Array mit alles Keys (siehe Object.values, aber nur bestimmte Spalte)
function mappingValuesFunSelect(index = 0, obj) {
    const __VALUES = Object.values(obj);

    return __VALUES.map(valueArr => getArrValue(valueArr, index));
}

// ==================== Ende Abschnitt Hilfsfunktionen fuer Object-Mapping ====================

// *** EOF ***
