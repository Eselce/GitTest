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
    constructor*/(team, land, liga) {
        'use strict';

        this.Team = team;
        this.Land = land;
        this.Liga = liga;
        this.LdNr = getLandNr(land);
        this.LgNr = getLigaNr(liga);
    }
//}

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

/*class*/ function Verein /*extends Team {
    constructor*/(team, land, liga, id, manager, flags) {
        'use strict';

        Team.call(this, team, land, liga);

        this.ID = id;
        this.Manager = manager;
        this.Flags = (flags || []);
    }
//}

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
