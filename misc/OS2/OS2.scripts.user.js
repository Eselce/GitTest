// ==UserScript==
// @name         OS2.scripts
// @namespace    http://github.com/
// @version      0.10+lib
// @copyright    2017+
// @author       Sven Loges (SLC)
// @description  Analysiert die Scripts auf GitHub
// @include      /^https?://(www\.)?(github\.com)/(Eselce)/(GitTest|OS2\.scripts)/(tree|blob)/(master)/(misc/OS2/|)(lib/.*\.js|.*\.user\.js)(\?\S+(&\S+)*)?(#\S+)?$/
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
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.list.js
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
    'libs' : {            // Datenspeicher fuer aktuelle Funktionsdaten der Libs
                   'Name'      : "libs",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'Permanent' : true,
                   'Default'   : { },
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 1,
                   'Label'     : "Module:"
               },
    'funs' : {            // Datenspeicher fuer aktuelle Funktionsdaten
                   'Name'      : "funs",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'Permanent' : true,
                   'Default'   : { },
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 1,
                   'Label'     : "Funktionen:"
               },
    'calls' : {           // Datenspeicher fuer aktuelle Aufrufdaten
                   'Name'      : "calls",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'Permanent' : true,
                   'Default'   : { },
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 1,
                   'Label'     : "Aufrufe:"
               },
    'deps' : {            // Datenspeicher fuer Modulabhaengigkeiten
                   'Name'      : "deps",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'Permanent' : true,
                   'Default'   : { },
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 1,
                   'Label'     : "Abh\xE4ngigkeiten:"
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
                   'FormPrio'  : 1,
                   'Name'      : "showForm",
                   'Type'      : __OPTTYPES.SW,
                   'FormType'  : __OPTTYPES.SI,
                   'Permanent' : true,
                   'Default'   : false,
                   'Title'     : "$V Optionen",
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Optionen anzeigen",
                   'Hotkey'    : 'a',
                   'AltTitle'  : "$V schlie\xDFen",
                   'AltLabel'  : "Optionen verbergen",
                   'AltHotkey' : 'v',
                   'FormLabel' : ""
               }
};

// ==================== Ende Konfigurations-Abschnitt fuer Optionen ====================

// ==================== Spezialisierter Abschnitt fuer Optionen ====================

// Gesetzte Optionen (wird von initOptions() angelegt und von loadOptions() gefuellt):
const __OPTSET = { };

// Logging initialisieren mit Loglevel (siehe ganz oben im Konfigurationsabschnitt)...
__LOG.init(window, __LOGLEVEL);

// Teamparameter fuer getrennte Speicherung der Optionen fuer Erst- und Zweitteam...
const __TEAMCLASS = new TeamClassification();

// Optionen mit Daten, die ZAT- und Team-bezogen gemerkt werden...
__TEAMCLASS.optSelect = { };

// Behandelt die Optionen und laedt das Benutzermenu
// optConfig: Konfiguration der Optionen
// optSet: Platz fuer die gesetzten Optionen
// optParams: Eventuell notwendige Parameter zur Initialisierung
// 'hideMenu': Optionen werden zwar geladen und genutzt, tauchen aber nicht im Benutzermenu auf
// 'teamParams': Getrennte Daten-Option wird genutzt, hier: Team() mit 'LdNr'/'LgNr' des Erst- bzw. Zweitteams
// 'menuAnchor': Startpunkt fuer das Optionsmenu auf der Seite
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// 'formWidth': Anzahl der Elemente pro Zeile
// 'formBreak': Elementnummer des ersten Zeilenumbruchs
// return Promise auf gefuelltes Objekt mit den gesetzten Optionen
function buildOptions(optConfig, optSet = undefined, optParams = { 'hideMenu' : false }) {
    // Klassifikation ueber Land und Liga des Teams...
    __TEAMCLASS.optSet = optSet;  // Classification mit optSet verknuepfen
    __TEAMCLASS.teamParams = optParams.teamParams;  // Ermittelte Parameter

    return startOptions(optConfig, optSet, __TEAMCLASS).then(
                optSet => showOptions(optSet, optParams),
                defaultCatch);
}

// ==================== Ende Abschnitt fuer Optionen ====================

// ==================== Hauptprogramm ====================

function getScriptFromArray(path, lines) {
    const __SCRIPT = {
            'filename'  : "",
            'filepath'  : "",
            'libname'   : "",
            'code'      : [],
            'funs'      : { },
            'lines'     : 0,
            'init'      : function(path, lines) {
                    const __URI = new URI(path);
                    this.filename = getValue(__URI.getLeaf(), 'Unnamed');
                    this.filepath = path;
                    this.libname = this.filename.replace(/\.user\.js$/, "").replace(/\.js$/, "");
                    this.lines = lines.length;

                    for (let i = 0; i < this.lines; ) {
                        this.code[++i] = lines[i];
                    }

                    this.calcFuncs();
                },
            'calcFuncs' : function() {
                    const __CODE = this.Code;
                    const __REGEXFUN = /function\s*?(\w+)?\s*?(\([^]*?\))(?=\s*?\{)/gm;

                    for (let match; (match = __REGEXFUN.exec(__CODE)); ) {
                        this.funs[match[1]] = match[2].replace(/\s*=\s*.*(?=[,\)])/g, "");
                    }
                },
            'findCalls' : function(funs) {
                    const __THISLIB = this.libname;
                    const __CODE = this.Code;
                    const __REGEXCALL = /(\w+)\s*?(\([^]*?\))/gm;
                    const __BLACKLIST = [ '__proto__', 'constructor', 'hasOwnProperty', 'toSource', 'toString', 'valueOf' ];  // Object properties
                    const __CALLS = { };
                    const __LIBS = { };

                    for (let match; (match = __REGEXCALL.exec(__CODE)); ) {
                        const __FUN = match[1];
                        const __LIB = (__FUN && ! (__FUN in __BLACKLIST) && funs[__FUN]);

                        if (__LIB && (__LIB !== __THISLIB)) {
                            __CALLS[__FUN] = __LIB;
                            __LIBS[__LIB] = getValue(__LIBS[__LIB], 0) + 1;

                            __LOG[6](__FUN, __LIBS, __LIB);
                        }
                    }

                    __CALLS.__LIBS = __LIBS;

                    return __CALLS;
                }
        };

    Object.defineProperty(__SCRIPT, 'Text', {
            get : function() {
                      return this.code.join('\n');
                  },
            set : undefined
        });

    Object.defineProperty(__SCRIPT, 'Code', {
            get : function() {
                      const __NOSLSL = this.Text.replace(/\/\/.*$/gm, "");
                      const __NOSLST = __NOSLSL.replace(/\/\*[^]*\*\//gm, "");
                      const __NOTRWS = __NOSLST.replace(/\s*$/gm, "");
                      return __NOTRWS;
                  },
            set : undefined
        });

    __SCRIPT.init(path, lines);

    return __SCRIPT;
}

function getScriptFromHTML(pathElement, table) {
    const __NAME = getSelection(pathElement, 'String', getSelectedValue);
    const __ROWS = table.rows;
    const __LINES = [];

    for (let i = 0; i < __ROWS.length; i++) {
        const __ROW = __ROWS[i];
        const __CELLS = __ROW.cells;
        const __LINENUMBER = __CELLS[0].getAttribute('data-line-number');
        const __LNR = Number(__LINENUMBER);
        const __TEXT = __CELLS[1].textContent;

        if (__LNR === i + 1) {
            __LINES.push(__TEXT);
        }
    }

    return getScriptFromArray(__NAME, __LINES);
}

// Verarbeitet eine Script-Ansicht bei GitHub
function procScript() {
    return buildOptions(__OPTCONFIG, __OPTSET, {
                            'menuAnchor' : getTable(0, 'ul'),
                            'formWidth'  : 2
                        }).then(optSet => {
            // Quellcode ermitteln...
            const __TABLE = getTable(1);  // um 1 verschoben wegen Options-Form
            const __SCRIPT = getScriptFromHTML('path', __TABLE);
            const __LIB = __SCRIPT.libname;
            const __LIBS = getOptValue(__OPTSET.libs, { });
            const __FUNS = getOptValue(__OPTSET.funs, { });
            const __DEPS = getOptValue(__OPTSET.deps, { });

            if (__SCRIPT.filename && ! __SCRIPT.filename.endsWith(".user.js")) {
                __LIBS[__LIB] = __SCRIPT.funs;
                Object.keys(__SCRIPT.funs).forEach(fun => (__FUNS[fun] = __LIB));
            }

            const __CALLS = __SCRIPT.findCalls(__FUNS);

            __DEPS[__LIB] = __CALLS.__LIBS;

            console.error(__SCRIPT);
            console.error(__LIBS);
            console.error(__FUNS);
            console.error(__CALLS);
            console.error(__DEPS);

            setOpt(__OPTSET.libs, __LIBS, false);
            setOpt(__OPTSET.funs, __FUNS, false);
            setOpt(__OPTSET.calls, __CALLS, false);
            setOpt(__OPTSET.deps, __DEPS, false);
        });
}

(() => {
    (async () => {
        try {
            await procScript().catch(defaultCatch);

            return 'OK';
        } catch (ex) {
            return defaultCatch(ex);
        }
    })().then(rc => {
            __LOG[1]('SCRIPT END', __DBMOD.Name, '(' + rc + ')');
        });
})();

// *** EOF ***
