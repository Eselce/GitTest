/****** JavaScript-Bibliothek 'lib.OS2.base.js' ["OS2BASE"] ******/

// Inhaltsverzeichnis:
// https://eselce.github.io/GitTest/misc/OS2/lib/<OS2BASE>: 
//  OS2.list.js
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

