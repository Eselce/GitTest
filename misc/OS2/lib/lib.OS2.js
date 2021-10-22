/****** JavaScript-Bibliothek 'lib.OS2.js' ["OS2"] ******/

// Inhaltsverzeichnis:
// https://eselce.github.io/GitTest/misc/OS2/lib/<OS2>: 
//  OS2.list.js
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
        'D\xE4nemark'            :   8,
        'Deutschland'            :   6,
        'England'                :   1,
        'Estland'                :  57,
        'Far\xF6er'              :  68,
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
        '\xD6sterreich'          :  14,
        'Polen'                  :  25,
        'Portugal'               :  17,
        'Rum\xE4nien'            :  28,
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
        'T\xFCrkei'              :  39,
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
        'DEN'     : 'D\xE4nemark',
        'GER'     : 'Deutschland',
        'ENG'     : 'England',
        'EST'     : 'Estland',
        'FRO'     : 'Far\xF6er',
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
        'AUT'     : '\xD6sterreich',
        'POL'     : 'Polen',
        'POR'     : 'Portugal',
        'ROM'     : 'Rum\xE4nien',
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
        'TUR'     : 'T\xFCrkei',
        'UKR'     : 'Ukraine',
        'HUN'     : 'Ungarn',
        'WAL'     : 'Wales',
        'BLR'     : 'Weissrussland',
        'CYP'     : 'Zypern'
    };
const __LANDTLAS = reverseMapping(__TLALAND);

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

// Gibt die ID des Landes mit dem uebergebenen Namen zurueck.
// land: Name des Landes
// defValue: Default-Wert
// return OS2-ID des Landes, 0 fuer ungueltig
function getLandNr(land, defValue = __LANDNRN.unbekannt) {
    return getValue(__LANDNRN[land], defValue);
}

// Gibt die ID der Liga mit dem uebergebenen Namen zurueck.
// land: Name der Liga
// defValue: Default-Wert
// return OS2-ID der Liga, 0 fuer ungueltig
function getLigaNr(liga, defValue = __LIGANRN.unbekannt) {
    return getValue(__LIGANRN[liga], defValue);
}

// Kehrt das Mapping eines Objekts um und liefert ein neues Objekt zurueck.
// obj: Objekt mit key => value
// convFun: Konvertierfunktion fuer die Werte
// return Neues Objekt mit value => key (doppelte value-Werte fallen heraus!)
function reverseMapping(obj, convFun) {
    if (! obj) {
        return obj;
    }

    const __RET = { };

    for (let key in obj) {
        const __VALUE = obj[key];

        __RET[__VALUE] = (convFun ? convFun(key) : key);
    }

    return __RET;
}

// ==================== Ende Abschnitt fuer interne IDs auf den Seiten ====================

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

// *** EOF ***

/*** Ende OS2.list.js ***/

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
function TeamClassification() {
    'use strict';

    Classification.call(this);

    this.prefix = undefined;

    this.team = undefined;
    this.teamParams = undefined;
}

Class.define(TeamClassification, Classification, {
                    'renameParamFun' : function() {
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
function Team(team, land, liga) {
    'use strict';

    this.Team = team;
    this.Land = land;
    this.Liga = liga;
    this.LdNr = getLandNr(land);
    this.LgNr = getLigaNr(liga);
}

Class.define(Team, Object, {
                    '__TEAMITEMS' : {   // Items, die in Team als Teamdaten gesetzt werden...
                                        'Team' : true,
                                        'Liga' : true,
                                        'Land' : true,
                                        'LdNr' : true,
                                        'LgNr' : true
                                    }
                });

// ==================== Ende Abschnitt fuer Klasse Team ====================

// ==================== Abschnitt fuer Klasse Verein ====================

// Klasse fuer Vereinsdaten
function Verein(team, land, liga, id, manager, flags) {
    'use strict';

    Team.call(this, team, land, liga);

    this.ID = id;
    this.Manager = manager;
    this.Flags = (flags || []);
}

Class.define(Verein, Team, {
                    '__TEAMITEMS' : {   // Items, die in Verein als Teamdaten gesetzt werden...
                                        'Team'    : true,
                                        'Liga'    : true,
                                        'Land'    : true,
                                        'LdNr'    : true,
                                        'LgNr'    : true,
                                        'ID'      : true,
                                        'Manager' : true,
                                        'Flags'   : true
                                    }
                });

// ==================== Ende Abschnitt fuer Klasse Verein ====================

// ==================== Abschnitt zu Teamdaten ====================

// Gibt die Teamdaten zurueck und aktualisiert sie ggfs. in der Option
// optSet: Platz fuer die gesetzten Optionen
// teamParams: Dynamisch ermittelte Teamdaten ('Team', 'Liga', 'Land', 'LdNr' und 'LgNr')
// myTeam: Objekt fuer die Teamdaten
// return Die Teamdaten oder undefined bei Fehler
function getMyTeam(optSet = undefined, teamParams = undefined, myTeam = new Team()) {
    if (teamParams !== undefined) {
        addProps(myTeam, teamParams, myTeam.__TEAMITEMS);
        __LOG[2]("Ermittelt: " + safeStringify(myTeam));
        // ... und abspeichern, falls erweunscht...
        if (optSet && optSet.team) {
            setOpt(optSet.team, myTeam, false);
        }
    } else {
        const __TEAM = ((optSet && optSet.team) ? getOptValue(optSet.team) : undefined);  // Gespeicherte Parameter

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

/*** Ende OS2.team.js ***/

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
        'Zeile'  : 0,
        'Spalte' : 1,
        'start'  : " von ",
        'middle' : "</b><br>",
        'liga'   : ". Liga",
        'land'   : ' ',
        'end'    : "<a href="
    };

const __TEAMSEARCHTEAM = {  // Parameter zum Team "<b>TEAM - LIGA <a href=...>LAND</a></b>"
        'Zeile'  : 0,
        'Spalte' : 0,
        'start'  : "<b>",
        'middle' : " - ",
        'liga'   : ". Liga",
        'land'   : 'target="_blank">',
        'end'    : "</a></b>"
    };

// Ermittelt, wie das eigene Team heisst und aus welchem Land bzw. Liga es kommt (zur Unterscheidung von Erst- und Zweitteam)
// cell: Tabellenzelle mit den Parametern zum Team "startTEAMmiddleLIGA...landLANDend", LIGA = "#liga[ (A|B|C|D)]"
// teamSeach: Muster fuer die Suche, die Eintraege fuer 'start', 'middle', 'liga', 'land' und 'end' enthaelt
// return Im Beispiel { 'Team' : "TEAM", 'Liga' : "LIGA", 'Land' : "LAND", 'LdNr' : LAND-NUMMER, 'LgNr' : LIGA-NUMMER },
//        z.B. { 'Team' : "Choromonets Odessa", 'Liga' : "1. Liga", 'Land' : "Ukraine", 'LdNr' : 20, 'LgNr' : 1 }
function getTeamParamsFromTable(table, teamSearch = undefined) {
    const __TEAMSEARCH   = getValue(teamSearch, __TEAMSEARCHHAUPT);
    const __TEAMCELLROW  = getValue(__TEAMSEARCH.Zeile, 0);
    const __TEAMCELLCOL  = getValue(__TEAMSEARCH.Spalte, 0);
    const __TEAMCELLSTR  = (table === undefined) ? "" : table.rows[__TEAMCELLROW].cells[__TEAMCELLCOL].innerHTML;
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

    const __TEAM = new Team(__TEAMNAME, land, liga);

    return __TEAM;
}

// ==================== Ende Abschnitt fuer Ermittlung des Teams von einer OS2-Seite ====================

// *** EOF ***

/*** Ende OS2.page.team.js ***/

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
// leafs: Liste von Filenamen mit der Default-Seitennummer (falls Query-Parameter nicht gefunden)
// item: Query-Parameter, der die Nummer der Unterseite angibt
// return Parameter aus der URL der Seite als Nummer
function getPageIdFromURL(url, leafs, item = 'page') {
    const __URI = new URI(url);
    const __LEAF = __URI.getLeaf();

    for (let leaf in leafs) {
        if (__LEAF === leaf) {
            const __DEFAULT = leafs[leaf];

            return getValue(__URI.getQueryPar(item), __DEFAULT);
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

// *** EOF ***

/*** Ende OS2.page.js ***/

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

// Beschreibungstexte aller Runden
const __POKALRUNDEN = [ "", "1. Runde", "2. Runde", "3. Runde", "Achtelfinale", "Viertelfinale", "Halbfinale", "Finale" ];
const __QUALIRUNDEN = [ "", "Quali 1", "Quali 2", "Quali 3" ];
const __OSCRUNDEN   = [ "", "Viertelfinale", "Halbfinale", "Finale" ];
const __OSERUNDEN   = [ "", "Runde 1", "Runde 2", "Runde 3", "Runde 4", "Achtelfinale", "Viertelfinale", "Halbfinale", "Finale" ];
const __HINRUECK    = [ " Hin", " R\xFCck", "" ];

// ==================== Abschnitt fuer Klasse RundenLink ====================

function RundenLink(saison, team) {
    'use strict';

    this.uri = new URI("http://os.ongapo.com/?erganzeigen=1&stataktion=Statistik+ausgeben");
    this.runde = 0;
    this.prop = "";
    this.label = "";

    if (saison) {
        this.setSaison(saison);
    }
    if (team) {
        this.setTeam(team);
    }
}

Class.define(RundenLink, Object, {
        'setSaison'    : function(saison) {
                             this.uri.setQueryPar('saauswahl', saison);
                         },
        'setTeam'      : function(team) {
                             this.uri.setQueryPar('landauswahl', team.LdNr);
                             this.uri.setQueryPar('ligaauswahl', team.LgNr);
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
    return {
        'anzZATpMonth' : ((saison < 2) ? 7 : 6),    // Erste Saison 7 ZAT, danach 6 ZAT...
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
        'hinRueck'     : 2,    // 0: Hin, 1: Rueck, 2: unbekannt
        'ZATrueck'     : 0,
        'ZATkorr'      : 0
    };
}

// Liefert den ZAT als String
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT
// longStats: Formatiert die Langversion des Textes
function getZAT(currZAT, longStats) {
    return (longStats ? currZAT.gameType + ' ' + (currZAT.heim ? "Heim" : "Ausw\xE4rts") + ' ' : "") +
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
    if (saison < 3) {
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
                currZAT.hinRueck = 0;
            } else {
                currZAT.euroRunde = 11;    // Finale
                currZAT.hinRueck = 2;
            }
        }
        if (currZAT.ZAT === currZAT.ZATrueck) {
            currZAT.hinRueck = 1;        // 5, 7; 11, 13;  (17, 19)  / 23,   25; 29, 31; 35,  37; 41,  43; 47, 49; 53,  55; 59,  61; 69
            if (currZAT.saison < 3) {    // 4, 6; 10, 14*; (16, 22*) / 24**, 26; 34, 36; 38*, 42; 44*, 50; 52, 54; 56*, 60; 62*, 66; 70
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

    return (showLink ? __LINK.getHTML() : "");
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
    const __TEXT = cell.textContent.replace('\xA0', "").replace(':', "").replace("  ", ' ');
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

/*** Ende OS2.zat.js ***/

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

function WarnDrawPlayer(player, alertColor) {
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

Class.define(WarnDrawPlayer, Object, {
        '__MONATEBISABR'    : 1,
        '__ZATWARNVORLAUF'  : 1,
        '__ZATMONATVORLAUF' : 6,
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
                                  const __INDEX = parseInt(__RESTZAT / 6 + 1) - this.__MONATEBISABR;  // Lfd. Nummer des Abrechnungsmonats (0-basiert)

                                  return __INDEX;
                              },
        'isZiehAufstieg'    : function() {
                                  return this.aufstieg;
                              },
        'setAufstieg'       : function() {
                                  this.aufstieg = true;

                                  if (this.isZiehAufstieg()) {
                                      this.setZatLeft(72 - this.currZAT - this.__ZATWARNVORLAUF);
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

function WarnDrawMessage(optSet, currZAT) {
    'use strict';

    this.optSet = optSet;

    this.warn = getOptValue(this.optSet.zeigeWarnung, true);
    this.warnMonth = getOptValue(this.optSet.zeigeWarnungMonat, true);
    this.warnHome = getOptValue(this.optSet.zeigeWarnungHome, true);
    this.warnDialog = getOptValue(this.optSet.zeigeWarnungDialog, false);
    this.warnAufstieg = getOptValue(this.optSet.zeigeWarnungAufstieg, true);
    this.warnLegende = getOptValue(this.optSet.zeigeWarnungLegende, true);

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

Class.define(WarnDrawMessage, Object, {
        '__ZATWARNVORLAUF'  : 1,
        '__ZATMONATVORLAUF' : 6,
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
                                  const __ZIEHANZAHL = getOptValue(this.optSet.ziehAnz, []);
                                  const __INDEX = parseInt(this.currZAT / 6);

                                  this.abrZAT = (__INDEX + 1) * 6;
                                  this.rest   = 5 - (this.currZAT % 6);
                                  this.anzahl = __ZIEHANZAHL[__INDEX];
                              },
        'getTextMessage'    : function() {
                                  return "ZAT " + this.abrZAT + ' ' + ((this.anzahl > 1) ? "m\xFCssen " + this.anzahl : "muss einer") +
                                         " deiner Jugendspieler in das Profiteam \xFCbernommen werden, ansonsten verschwinde" + ((this.anzahl > 1) ? "n sie" : "t er") + '!';
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
                                              this.when = "Bis zur n\xE4chsten Abrechnung am ";
                                          } else if ((this.warn || this.warnMonth) && (this.rest === 0)) {
                                              this.label = "LETZTE WARNUNG VOR DER ABRECHNUNG";
                                              this.when = "Bis zum n\xE4chsten ";
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

function WarnDrawMessageAufstieg(optSet, currZAT) {
    'use strict';

    WarnDrawMessage.call(this, optSet, currZAT);

    this.out.top = false;  // kein Vorschub vor der Zeile

    this.warn = (this.warn && this.warnAufstieg);  // kann man ausschalten
    this.startMessage(currZAT);  // 2. Aufruf (zur Korrektur)
}

Class.define(WarnDrawMessageAufstieg, WarnDrawMessage, {
        'configureZat'      : function() {
                                  const __ZIEHANZAUFSTIEG = getOptValue(this.optSet.ziehAnzAufstieg, 0);
                                  const __INDEX = parseInt(this.currZAT / 6);

                                  this.abrZAT = (__INDEX + 1) * 6;
                                  this.rest   = 5 - (this.currZAT % 6);
                                  this.anzahl = ((this.currZAT + this.__ZATMONATVORLAUF > 72 - this.__ZATWARNVORLAUF) ? __ZIEHANZAUFSTIEG : 0);

                                  this.warnDialog = false;     // kein Dialog fuer Aufstiegswarnung
                                  this.warnMonth = this.warn;  // nur im letzten Monat der Saison!
                              },
        'getTextMessage'    : function() {
                                  return "ZAT " + this.abrZAT + " ist im Falle eines Aufstiegs f\xFCr " + ((this.anzahl > 1) ? "" + this.anzahl : "einen") +
                                         " deiner Jugendspieler m\xF6glicherweise die letzte Chance, " + ((this.anzahl > 1) ? " diese noch vor ihrem" : "ihn noch vor seinem") +
                                         " Geburtstag in der n\xE4chsten Saison in das Profiteam zu \xFCbernehmen!";
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

/*** Ende OS2.class.warndraw.js ***/

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

function PlayerRecord(land, age, isGoalie, saison, currZAT, donation) {
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

                                          if (__LASTZAT < 72) {  // U19
                                              this.warnDraw = new WarnDrawPlayer(this, getColor('STU'));  // rot
                                              __LOG[5](this.getAge().toFixed(2), "rot");
                                          } else if (__LASTZAT < Math.max(2, klasse) * 72) {  // Rest bis inkl. U18 (Liga 1 und 2) bzw. U17 (Liga 3)
                                              // do nothing
                                          } else if (__LASTZAT < (klasse + 1) * 72) {  // U17/U16 je nach Liga 2/3
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
                                              const __ADDSKILL = Math.min(99 - progSkill, getMulValue(__ADDRATIO, __SKILL, 0, NaN));

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
                                      this.birth = (36 + this.saison) * 72 + this.currZAT - this.zatAge;
                                  },
        'calcZatAge'            : function(currZAT) {
                                      let zatAge;

                                      if (this.zatGeb !== undefined) {
                                          let ZATs = 72 * (this.age - ((currZAT < this.zatGeb) ? 12 : 13));  // Basiszeit fuer die Jahre seit Jahrgang 13

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
                                          return (18 - 12) * 72 - 1;  // (max.) Trainings-ZATs bis Ende 18
                                      } else if (this.zatAge !== undefined) {
                                          return this.zatAge;
                                      } else {
                                          __LOG[3]("Empty getZatAge()");

                                          return NaN;
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
                                      //const __INDEX = parseInt(__RESTZAT / 6 + 1) - 1;  // Lfd. Nummer des Abrechnungsmonats (0-basiert)

                                      return (this.warnDraw && this.warnDraw.calcZiehIndex(this.currZAT));
                                  },
        'isZiehAufstieg'        : function() {
                                      return (this.warnDrawAufstieg && this.warnDrawAufstieg.isZiehAufstieg());
                                  },
        'getAge'                : function(when = this.__TIME.now) {
                                      if (this.mwFormel === this.__MWFORMEL.alt) {
                                          return (when === this.__TIME.end) ? 18 : this.age;
                                      } else {  // Geburtstage ab Saison 10...
                                          return (13.00 + this.getZatAge(when) / 72);
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
                                      return this.getSkillSum(when) / 17;
                                  },
        'getOpti'               : function(pos, when = this.__TIME.now) {
                                      const __SUMALLSKILLS = this.getSkillSum(when);
                                      const __SUMPRISKILLS = this.getSkillSum(when, getIdxPriSkills(pos), 2 * 4);
                                      const __OVERFLOW = Math.max(0, __SUMPRISKILLS - this.__MAXPRISKILLS);
/*if (this.zatGeb === 24) {
    console.error("__OVERFLOW = " + __OVERFLOW);
    console.error("__SUMALLSKILLS = " + __SUMALLSKILLS);
    console.error("__SUMPRISKILLS = " + __SUMPRISKILLS);
    console.error("getOpti(" + pos + ") = " + ((4 * (__SUMPRISKILLS - __OVERFLOW) + __SUMALLSKILLS) / 27));
}*/
                                      return (4 * (__SUMPRISKILLS - __OVERFLOW) + __SUMALLSKILLS) / 27;
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
                                      const __AGE = this.getAge(when);

                                      if (this.mwFormel === this.__MWFORMEL.alt) {
                                          return Math.round(Math.pow((1 + this.getSkill(when)/100) * (1 + this.getOpti(pos, when)/100) * (2 - __AGE/100), 10) * 2);    // Alte Formel bis Saison 9
                                      } else {  // MW-Formel ab Saison 10...
                                          const __MW5TF = 1.00;  // Zwischen 0.97 und 1.03

                                          return Math.round(Math.pow(1 + this.getSkill(when)/100, 5.65) * Math.pow(1 + this.getOpti(pos, when)/100, 8.1) * Math.pow(1 + (100 - __AGE)/49, 10) * __MW5TF);
                                      }
                                  },
        'getFingerPrint'        : function() {
                                      // Jeweils gleichbreite Werte: (Alter/Geb.=>Monat), Land, Talent ('-', '=', '+')...
                                      const __BASEPART = padNumber(this.birth / 6, 3) + padLeft(this.land, -3);
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
                                      return (this.birth ? floorValue((this.birth - 1) / 72) : undefined);
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

/*** Ende OS2.class.player.js ***/

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

function ColumnManager(optSet, colIdx, showCol) {
    'use strict';

    __LOG[4]("ColumnManager()");

    const __SHOWCOL = getValue(showCol, true);
    const __SHOWALL = ((__SHOWCOL === true) || (__SHOWCOL.Default === true));

    const __BIRTHDAYS = getOptValue(optSet.birthdays, []).length;
    const __TCLASSES = getOptValue(optSet.tClasses, []).length;
    const __PROGRESSES = getOptValue(optSet.progresses, []).length;

    const __ZATAGES = getOptValue(optSet.zatAges, []).length;
    const __TRAINIERT = getOptValue(optSet.trainiert, []).length;
    const __POSITIONS = getOptValue(optSet.positions, []).length;

    const __EINZELSKILLS = getOptValue(optSet.skills, []).length;
    const __PROJECTION = (__EINZELSKILLS && __ZATAGES);

    this.colIdx = colIdx;

    this.saison = getOptValue(optSet.saison);
    this.gt = getOptValue(optSet.zeigeJahrgang);
    this.gtUxx = getOptValue(optSet.zeigeUxx);

    this.fpId = (__BIRTHDAYS && __TCLASSES && __POSITIONS && getValue(__SHOWCOL.zeigeId, __SHOWALL) && getOptValue(optSet.zeigeId));
    this.warn = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnung, __SHOWALL) && getOptValue(optSet.zeigeWarnung));
    this.warnMonth = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungMonat, __SHOWALL) && getOptValue(optSet.zeigeWarnungMonat));
    this.warnHome = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungHome, __SHOWALL) && getOptValue(optSet.zeigeWarnungHome));
    this.warnDialog = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungDialog, __SHOWALL) && getOptValue(optSet.zeigeWarnungDialog));
    this.warnAufstieg = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungAufstieg, __SHOWALL) && getOptValue(optSet.zeigeWarnungAufstieg));
    this.warnLegende = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungLegende, __SHOWALL) && getOptValue(optSet.zeigeWarnungLegende));
    this.bar = (__PROJECTION && getValue(__SHOWCOL.zeigeBalken, __SHOWALL) && getOptValue(optSet.zeigeBalken));
    this.barAbs = getOptValue(optSet.absBalken);
    this.donor = getOptValue(optSet.foerderung);
    this.geb = (__BIRTHDAYS && getValue(__SHOWCOL.zeigeGeb, __SHOWALL) && getOptValue(optSet.zeigeGeb));
    this.tal = (__TCLASSES && getValue(__SHOWCOL.zeigeTal, __SHOWALL) && getOptValue(optSet.zeigeTal));
    this.quo = (__ZATAGES && __TRAINIERT && getValue(__SHOWCOL.zeigeQuote, __SHOWALL) && getOptValue(optSet.zeigeQuote));
    this.aufw = (__PROGRESSES && getValue(__SHOWCOL.zeigeAufw, __SHOWALL) && getOptValue(optSet.zeigeAufw));
    this.substAge = (__ZATAGES && getValue(__SHOWCOL.ersetzeAlter, __SHOWALL) && getOptValue(optSet.ersetzeAlter));
    this.alter = (__ZATAGES && getValue(__SHOWCOL.zeigeAlter, __SHOWALL) && getOptValue(optSet.zeigeAlter));
    this.fix = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeFixSkills, __SHOWALL) && getOptValue(optSet.zeigeFixSkills));
    this.tr = (__EINZELSKILLS && __TRAINIERT && getValue(__SHOWCOL.zeigeTrainiert, __SHOWALL) && getOptValue(optSet.zeigeTrainiert));
    this.zat = (__ZATAGES && getValue(__SHOWCOL.zeigeZatDone, __SHOWALL) && getOptValue(optSet.zeigeZatDone));
    this.antHpt = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeAnteilPri, __SHOWALL) && getOptValue(optSet.zeigeAnteilPri));
    this.antNeb = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeAnteilSec, __SHOWALL) && getOptValue(optSet.zeigeAnteilSec));
    this.pri = (__EINZELSKILLS && getValue(__SHOWCOL.zeigePrios, __SHOWALL) && getOptValue(optSet.zeigePrios));
    this.skill = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeSkill, __SHOWALL) && getOptValue(optSet.zeigeSkill));
    this.pos = (__EINZELSKILLS && __POSITIONS && getValue(__SHOWCOL.zeigePosition, __SHOWALL) && getOptValue(optSet.zeigePosition));
    this.anzOpti = ((__EINZELSKILLS && getValue(__SHOWCOL.zeigeOpti, __SHOWALL)) ? getOptValue(optSet.anzahlOpti) : 0);
    this.anzMw =  ((__PROJECTION && getValue(__SHOWCOL.zeigeMW, __SHOWALL)) ? getOptValue(optSet.anzahlMW) : 0);
    this.substSkills = (__PROJECTION && getValue(__SHOWCOL.ersetzeSkills, __SHOWALL) && getOptValue(optSet.ersetzeSkills));
    this.trE = (__PROJECTION && __TRAINIERT && getValue(__SHOWCOL.zeigeTrainiertEnde, __SHOWALL) && getOptValue(optSet.zeigeTrainiertEnde));
    this.zatE = (__ZATAGES && getValue(__SHOWCOL.zeigeZatLeft, __SHOWALL) && getOptValue(optSet.zeigeZatLeft));
    this.antHptE = (__PROJECTION && getValue(__SHOWCOL.zeigeAnteilPriEnde, __SHOWALL) && getOptValue(optSet.zeigeAnteilPriEnde));
    this.antNebE = (__PROJECTION && getValue(__SHOWCOL.zeigeAnteilSecEnde, __SHOWALL) && getOptValue(optSet.zeigeAnteilSecEnde));
    this.priE = (__PROJECTION && getValue(__SHOWCOL.zeigePriosEnde, __SHOWALL) && getOptValue(optSet.zeigePriosEnde));
    this.skillE = (__PROJECTION && getValue(__SHOWCOL.zeigeSkillEnde, __SHOWALL) && getOptValue(optSet.zeigeSkillEnde));
    this.anzOptiE = ((__PROJECTION && getValue(__SHOWCOL.zeigeOptiEnde, __SHOWALL)) ? getOptValue(optSet.anzahlOptiEnde) : 0);
    this.anzMwE = ((__PROJECTION && getValue(__SHOWCOL.zeigeMWEnde, __SHOWALL)) ? getOptValue(optSet.anzahlMWEnde) : 0);
    this.kennzE = getOptValue(optSet.kennzeichenEnde);
}

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
                                   this.addAndFillCell(headers, "Qualit\xE4t", titleColor);
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
                               const __OSBLAU = getColor("");

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
                                   convertStringFromHTML(playerRow.cells, this.colIdx.Age, function(unused) {
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
                                       convertArrayFromHTML(playerRow.cells, this.colIdx.Einz, player.skillsEnd, function(value, cell, unused, index) {
                                                                                                                     if (~ __IDXPRI.indexOf(index)) {
                                                                                                                         formatCell(cell, true, __OSBLAU, __POS1COLOR, 1.0);
                                                                                                                     }
                                                                                                                     return value;
                                                                                                                 });
                                   } else {
                                       convertArrayFromHTML(playerRow.cells, this.colIdx.Einz, player.skills.length, function(value, cell, unused, index) {
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

/*** Ende OS2.class.column.js ***/

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
function TableManager(optSet, colIdx, rows, offsetUpper, offsetLower) {
    'use strict';

    Object.call(this);

    this.currSaison = getOptValue(optSet.aktuelleSaison);

    this.saison = getOptValue(optSet.saison);
    this.land = getOptValue(optSet.land);
    this.liga = getOptValue(optSet.liga);
    this.tabTypNr = getOptValue(optSet.tabTypNr, 0);

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

/*** Ende OS2.class.table.js ***/

