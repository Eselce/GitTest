/****** JavaScript-Bibliothek 'lib.option.js' ["OPTION"] ******/

// Inhaltsverzeichnis:
// https://eselce.github.io/GitTest/misc/OS2/lib/<OPTION>: 
//  util.option.type.js
//  util.option.data.js
//  util.option.class.options.js
//  util.option.api.js
//  util.mem.js
//  util.mem.db.js
//  util.mem.cmd.js
//  util.option.menu.js
//  util.option.page.label.js
//  util.option.page.action.js
//  util.option.page.node.js
//  util.option.page.js
//  util.option.run.js
//  util.main.js

/*** Modul util.option.type.js ***/

// ==UserModule==
// _name         util.option.type
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit den Konfigurations-Typen fuer Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt Moegliche Typen fuer Optionen ====================

// Options-Typen
const __OPTTYPES = {
    'MC' : "multiple choice",
    'SW' : "switch",
    'TF' : "true/false",
    'SD' : "simple data",
    'SI' : "simple option"
};

// Aktions-Typen der Optionen
const __OPTACTION = {
    'SET' : "set option value",
    'NXT' : "set next option value",
    'RST' : "reset options"
};

// Schwere der Notwendigkeit bei den Item-Typen der Konfiguration der Optionen (__OPTCONFIG)
const __OPTNEEDSEVERITY = {
    'MAN'   : 'mandatory',      // Muss-Parameter
    'REC'   : 'recommended',    // Soll-Parameter
    'OPT'   : 'optional',       // Kann-Parameter (optional)
    'INT'   : 'internal'        // Belegt-Parameter (nicht in __OPTCONFIG verwenden!)
};

// Klassifizierung von Untergruppen der Notwendigkeit-Klassen zu Item-Typen der Konfiguration der Optionen (__OPTCONFIG)
const __OPTNEEDCONDITION = {
    'ALL'   : [ "parameter",            (optType => true) ],                                                            // Alle Parameter
    'DAT'   : [ "data parameter",       (optType => ((optType === __OPTTYPES.MC) || (optType === __OPTTYPES.SD))) ],    // Datentypen __OPTTYPES.MC und __OPTTYPES.SD
    'SEL'   : [ "select parameter",     (optType => (optType === __OPTTYPES.MC)) ],                                     // Datentyp __OPTTYPES.MC
    'SWI'   : [ "switch parameter",     (optType => ((optType === __OPTTYPES.SW) || (optType === __OPTTYPES.TF))) ],    // Datentypen __OPTTYPES.SW und __OPTTYPES.TF
    'SIM'   : [ "simple parameter",     (optType => (optType === __OPTTYPES.SI)) ],                                     // Datentyp __OPTTYPES.SI
    'COM'   : [ "complex parameter",    (optType => (optType !== __OPTTYPES.SI)) ],                                     // alle Datentypen ausser __OPTTYPES.SI
};

// Notwendigkeit der Item-Typen der Konfiguration der Optionen (__OPTCONFIG)
const __OPTNEED = {
    'MAN'   : "mandatory parameter",            // Muss-Parameter, darf nicht fehlen!
    'DAT'   : "mandatory data parameter",       // Muss-Parameter fuer Datentypen __OPTTYPES.MC und __OPTTYPES.SD
    'CHO'   : "mandatory select parameter",     // Muss-Parameter fuer Datentyp __OPTTYPES.MC
    'SWI'   : "mandatory switch parameter",     // Muss-Parameter fuer Datentypen __OPTTYPES.SW und __OPTTYPES.TF
    'REC'   : "recommended parameter",          // Soll-Parameter: Nutzung dieser Parameter wird empfohlen
    'COM'   : "recommended complex parameter",  // Soll-Parameter fuer alle Datentypen ausser __OPTTYPES.SI
    'VAL'   : "recommended data parameter",     // Soll-Parameter fuer Datentypen __OPTTYPES.MC und __OPTTYPES.SD
    'SEL'   : "recommended select parameter",   // Soll-Parameter fuer Datentyp __OPTTYPES.MC
    'TOG'   : "recommended switch parameter",   // Soll-Parameter fuer Datentypen __OPTTYPES.SW und __OPTTYPES.TF
    'OPT'   : "optional parameter",             // Optionale Parameter ohne Pficht
    'INT'   : "internal parameter"              // Nicht in __OPTCONFIG verwenden!
};

// Konfiguration der Ueberpruefung der Notwendigkeit der Item-Typen der Konfiguration der Optionen (__OPTCONFIG)
const __OPTNEEDCONFIG = { };

__OPTNEEDCONFIG[__OPTNEED.MAN] = [ __OPTNEEDSEVERITY.MAN, __OPTNEEDCONDITION.ALL ]; // Muss-Parameter, darf nicht fehlen!
__OPTNEEDCONFIG[__OPTNEED.DAT] = [ __OPTNEEDSEVERITY.MAN, __OPTNEEDCONDITION.DAT ]; // Muss-Parameter fuer Datentypen __OPTTYPES.MC und __OPTTYPES.SD
__OPTNEEDCONFIG[__OPTNEED.CHO] = [ __OPTNEEDSEVERITY.MAN, __OPTNEEDCONDITION.SEL ]; // Muss-Parameter fuer Datentyp __OPTTYPES.MC
__OPTNEEDCONFIG[__OPTNEED.SWI] = [ __OPTNEEDSEVERITY.MAN, __OPTNEEDCONDITION.SWI ]; // Muss-Parameter fuer Datentypen __OPTTYPES.SW und __OPTTYPES.TF
__OPTNEEDCONFIG[__OPTNEED.REC] = [ __OPTNEEDSEVERITY.REC, __OPTNEEDCONDITION.ALL ]; // Soll-Parameter: Nutzung dieser Parameter wird empfohlen
__OPTNEEDCONFIG[__OPTNEED.COM] = [ __OPTNEEDSEVERITY.REC, __OPTNEEDCONDITION.COM ]; // Soll-Parameter fuer alle Datentypen ausser __OPTTYPES.SI
__OPTNEEDCONFIG[__OPTNEED.VAL] = [ __OPTNEEDSEVERITY.REC, __OPTNEEDCONDITION.DAT ]; // Soll-Parameter fuer Datentypen __OPTTYPES.MC und __OPTTYPES.SD
__OPTNEEDCONFIG[__OPTNEED.SEL] = [ __OPTNEEDSEVERITY.REC, __OPTNEEDCONDITION.SEL ]; // Soll-Parameter fuer Datentyp __OPTTYPES.MC
__OPTNEEDCONFIG[__OPTNEED.TOG] = [ __OPTNEEDSEVERITY.REC, __OPTNEEDCONDITION.SWI ]; // Soll-Parameter fuer Datentypen __OPTTYPES.SW und __OPTTYPES.TF
__OPTNEEDCONFIG[__OPTNEED.OPT] = [ __OPTNEEDSEVERITY.OPT, __OPTNEEDCONDITION.ALL ]; // Optionale Parameter ohne Pficht
__OPTNEEDCONFIG[__OPTNEED.INT] = [ __OPTNEEDSEVERITY.INT, __OPTNEEDCONDITION.ALL ]; // Nicht in __OPTCONFIG verwenden!

// Abgeleitete Typen gemappt auf Haupttypen...
const __OPTITEMTYPEMAPPING = {
    'Array'     : 'Object', // Array.isArray()
    'Char'      : 'String', // String.length === 1
    'Code'      : 'String', // TODO Code-Schutz
    'Integer'   : 'Number', // Number.isInteger()
};

// Spaltenindizes von __OPTITEMS, den Daten ueber die Item-Typen der Konfiguration der Optionen (__OPTCONFIG)
const __COLOPTITEMS = {
        'INFO'      : 0,
        'TYPE'      : 1,
        'EXAM'      : 2,
        'NEED'      : 3
    };

// Item-Typen der Konfiguration der Optionen (__OPTCONFIG)
const __OPTITEMS = {
    'Action'    : [ "Aktions-Typ bei Optionswechsel",   '__OPTACTION',  "NXT, RST, SET",            __OPTNEED.MAN ],
    'AltAction' : [ "Alt Aktions-Typ (abweichend)",     '__OPTACTION',  "NXT, RST, SET",            __OPTNEED.TOG ],
    'AltHotkey' : [ "Alt Schnellanwahl im Men\u00FC",   'Char',         "'A'",                      __OPTNEED.SWI ],
    'AltLabel'  : [ "Alt Options-Ausgabename",          'String',       "Option aus: $",            __OPTNEED.TOG ],
    'AltTitle'  : [ "Alt Titel",                        'String',       "$V schlie\u00DFen",        __OPTNEED.TOG ],
    'AutoReset' : [ "Beim Laden immer auf Default",     'Boolean',      "false, true",              __OPTNEED.OPT ],
    'Choice'    : [ "Auswahlliste der Optionswerte",    'Array',        "[ 0, 1, 2, 3, 4 ]",        __OPTNEED.REC ],
    'Cols'      : [ "Ausgabebreite in Textfenster",     'Integer',      "1, 3, 20, 25, 36",         __OPTNEED.OPT ],
    'Config'    : [ "INTERNAL: Verweis auf optConfig",  'Object',       "{ }",                      __OPTNEED.INT ],
    'Default'   : [ "Startwert der Option",             'any',          "1, true, '', [], { }",     __OPTNEED.COM ],
    'FormLabel' : [ "Options-Ausgabe auf Seite",        'String',       "Option:|$",                __OPTNEED.OPT ],
    'FormPrio'  : [ "Steuert die Reihenfolge",          'Integer',      "undefined, 1",             __OPTNEED.OPT ],
    'FormType'  : [ "Typ der Option auf Seite",         '__OPTTYPES',   "SI",                       __OPTNEED.OPT ],
    'FreeValue' : [ "Freitext m\u00F6glich",            'Boolean',      "false, true",              __OPTNEED.SEL ],
    'Hidden'    : [ "Versteckte Option auf Seite",      'Boolean',      "false, true",              __OPTNEED.OPT ],
    'HiddenMenu': [ "Kein Kontextmen\u00FC",            'Boolean',      "false, true",              __OPTNEED.OPT ],
    'Hotkey'    : [ "Schnellanwahl im Men\u00FC",       'Char',         "'A'",                      __OPTNEED.REC ],
    'Item'      : [ "INTERNAL: Kopie des Schluessels",  'String',       "",                         __OPTNEED.INT ],
    'Label'     : [ "Options-Ausgabename",              'String',       "Option: $",                __OPTNEED.MAN ],
    'Loaded'    : [ "INTERNAL: Value ist geladen",      'Boolean',      "false, true",              __OPTNEED.INT ],
    'MinChoice' : [ "Abfrage ab wieviel Elementen?",    'Integer',      "0, 3",                     __OPTNEED.OPT ],
    'Name'      : [ "Interner Speichername",            'String',       "",                         __OPTNEED.MAN ],
    'Permanent' : [ "Bei AutoReset nicht zuruecksetzen",'Boolean',      "false, true",              __OPTNEED.OPT ],
    'PreInit'   : [ "Initialisierung in erster Phase",  'Boolean',      "true",                     __OPTNEED.OPT ],
    'Promise'   : [ "INTERNAL: Promise fuers Laden",    'Promise',      "",                         __OPTNEED.INT ],
    'ReadOnly'  : [ "Daten unveraenderlich",            'Boolean',      "false, true",              __OPTNEED.OPT ],
    'Replace'   : [ "Ausgabe-Element-Formatierung",     'Function',     "null, replaceArrayFun(padStartFun(4))",
                                                                                                    __OPTNEED.OPT ],
    'Rows'      : [ "Ausgabe-Zeilen in Textfenster",    'Integer',      "1, 2, 3, 6, 7, 10, 20",    __OPTNEED.OPT ],
    'SetValue'  : [ "Zu setzender DefaultWert bei Wahl",'any',          "",                         __OPTNEED.OPT ],
    'SelValue'  : [ "Ist Wert aus fester Liste?",       'Boolean',      "false, true",              __OPTNEED.SEL ],
    'Serial'    : [ "Speicherung per serialize()",      'Boolean',      "true",                     __OPTNEED.VAL ],
    'Shared'    : [ "Objektreferenz auf Option",        'Object',       "{ 'namespace' : 'http://os.ongapo.com/', 'module' : 'OS2.haupt', 'item' : '$' }",
                                                                                                    __OPTNEED.OPT ],
    'SharedData': [ "INTERNAL: Daten Objektreferenz",   'Object',       "",                         __OPTNEED.INT ],
    'Space'     : [ "Ausgabe-Spaces bei Listen",        'Integer',      "0, 1, 4",                  __OPTNEED.OPT ],
    'Submit'    : [ "onKeyDown-Code",                   'Code',         "",                         __OPTNEED.OPT ],
    'Title'     : [ "Titel",                            'String',       "$V Optionen",              __OPTNEED.OPT ],
    'Type'      : [ "Typ der Option",                   '__OPTTYPES',   "MC, SD, SI, SW",           __OPTNEED.REC ],
    'ValidOpt'  : [ "INTERNAL: Option gecheckt",        'Boolean',      "true",                     __OPTNEED.INT ],
    'ValType'   : [ "Datentyp der Werte",               'String',       "'Number', 'String'",       __OPTNEED.CHO ],
    'Value'     : [ "INTERNAL: Gesetzter Wert",         'any',          "",                         __OPTNEED.INT ],
    'config'    : [ "INTERNAL: __OPTCONFIG",            'Object',       "__OPTCONFIG",              __OPTNEED.INT ],
    'setLabel'  : [ "INTERNAL: Name/Label der Optionen",'String',       "__OPTSET",                 __OPTNEED.INT ]
};
const __OPTITEMSBYNEED = selectMapping(__OPTITEMS, __COLOPTITEMS.NEED, -1, mappingPush);

// ==================== Ende Abschnitt Moegliche Typen fuer Optionen ====================

// *** EOF ***

/*** Ende Modul util.option.type.js ***/

/*** Modul util.option.data.js ***/

// ==UserModule==
// _name         util.option.data
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Zugriff auf die Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.sys.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Initialisierung einer Option ====================

// Initialisiert die gesetzten Option
// config: Konfiguration der Option
// setValue: Zu uebernehmender Default-Wert (z.B. der jetzt gesetzte)
// return Initialwert der gesetzten Option
function initOptValue(config, setValue = undefined) {
    let value = getValue(setValue, config.Default);  // Standard

    if (config.SharedData !== undefined) {
        value = config.SharedData;
    }

    switch (config.Type) {
    case __OPTTYPES.MC : if ((value === undefined) && (config.Choice !== undefined)) {
                             value = config.Choice[0];
                         }
                         break;
    case __OPTTYPES.SW : break;
    case __OPTTYPES.TF : break;
    case __OPTTYPES.SD : config.Serial = true;
                         break;
    case __OPTTYPES.SI : break;
    default :            break;
    }

    if (config.Serial || config.Hidden) {
        config.HiddenMenu = true;
    }

    return value;
}

// ==================== Ende Abschnitt fuer Initialisierung einer Option ====================

// ==================== Abschnitt fuer Shared Optionsdaten ====================

// Gibt fuer einen 'Shared'-Eintrag eine ObjRef zurueck
// shared: Object mit den Angaben 'namespace', 'module' und ggfs. 'item'
// item: Key der Option
// return ObjRef, die das Ziel definiert
function getSharedRef(shared, item = undefined) {
    if (shared === undefined) {
        return undefined;
    }

    const __OBJREF = new ObjRef(__DBDATA);  // Gemeinsame Daten
    const __PROPS = [ 'namespace', 'module', 'item' ];
    const __DEFAULTS = [ __DBMOD.namespace, __DBMOD.name, item ];

    for (let stage = 0; stage < __PROPS.length; stage++) {
        const __DEFAULT = __DEFAULTS[stage];
        const __PROP = __PROPS[stage];
        const __NAME = shared[__PROP];

        if (__NAME === '$') {
            break;
        }

        __OBJREF.chDir(getValue(__NAME, __DEFAULT));
    }

    return __OBJREF;
}

// ==================== Ende Abschnitt fuer Shared Optionsdaten ====================

// ==================== Abschnitt fuer Zugriff auf Options-Parameter ====================

// Temporaere Aussetzung der Exceptions...
const __ERRORLOG = __LOG[1];
const __ERRORFUN = (__ERRORLOG || Error);
const __RANGEERRORFUN = (__ERRORLOG || RangeError);

// Prueft ein Objekt, ob es eine syntaktisch valide Konfiguration einer (ueber Menu) gesetzten Option ist
// optItem: Zu validierendes Konfigurations-Item-Objekt
// key: Falls bekannt, der Item-Key dieser Option (wird auf Korrektheit ueberprueft)
// preInit: Falls true, dann geht es um die Grundinitialisierung, in der keine internen Optionen erlaubt sind!
// return [__CONFIG, __NAME, __KEY, ...] Konfiguration und ggfs. Name und/oder Key der Option
function checkOptItem(optItem, key = undefined, preInit = false) {
    const __CONFIG = optItem;
    const __OPTTYPE = __CONFIG.Type;
    const __ITEMS = Object.keys(__CONFIG);
    const __NAME = __CONFIG.Name;
    const __ISSHARED = getValue(__CONFIG.Shared, false, true);
    const __KEY = key;

    if (! __ISSHARED) {  // TODO Shared Ref
        // Pruefung auf Namen der Option (redundant, da spaeter noch Ueberpruefung von __OPTNEED.MAN)...
        if (__NAME === undefined) {
            __LOG[1]("checkOptItem(): Error in " + codeLine(true, true, true, false));
            __ERRORFUN("Unknown 'Name' for option " + __LOG.info(__KEY, false));
        }

        // Ueberpruefung der Notwendigkeit der Parameter...
        const __ALLNEEDS = Object.keys(__OPTNEED);

        __ALLNEEDS.forEach(needKey => {  // alle moeglichen Notwendigkeitstypen...
                const __NEED = __OPTNEED[needKey];
                const __NEEDCONFIG = __OPTNEEDCONFIG[__NEED];
                const [ __SEVERITY, [ __CONDPARAM , __CONDFUN ]] = getValue(__NEEDCONFIG, [ null, [ null, null ] ]);
                const __NEEDED = __CONDFUN(__OPTTYPE);

                if (__NEEDED) {  // die Parameter dieser Klasse sind notwendig fuer die Option mit diesem __OPTTYPE...
                    const __PARAMETER = __SEVERITY + ' ' + __CONDPARAM; // alternativ (aber weniger eingaengig): __NEED
                    const __MISSING = "Option " + __LOG.info(__KEY, false) + " is missing " + __PARAMETER + ' ';
                    const __OPTPARAMS = getValue(__OPTITEMSBYNEED[__NEED], []);

                    __OPTPARAMS.forEach(item => {  // alle notwendigen Parameter dieser Klasse...
                            const __ITEM = __CONFIG[item];

                            if (! __ITEM) {  // Parameter ist notwendig, fehlt allerdings!
                                const __ERRORMSG = __MISSING + __LOG.info(item, false) + "...";

                                switch (__SEVERITY) {
                                    case __OPTNEEDSEVERITY.MAN: // Muss-Parameter...
                                        __LOG[1]("checkOptItem(): Error in " + codeLine(true, true, true, false));
                                        __ERRORFUN(__ERRORMSG);
                                        break;
                                    case __OPTNEEDSEVERITY.REC: // Soll-Parameter...
                                        __LOG[2]("checkOptItem(): " + __ERRORMSG);
                                        break;
                                    case __OPTNEEDSEVERITY.OPT: // Kann-Parameter...
                                        __LOG[7]("checkOptItem(): (opt) " + __ERRORMSG);
                                        break;
                                    case __OPTNEEDSEVERITY.INT: // Kann-Parameter...
                                        __LOG[9]("checkOptItem(): (int) " + __ERRORMSG);
                                        break;
                                    default:
                                        __ERRORFUN("checkOptItem(): Internal error: Unknown severity " + __LOG.info(__SEVERITY, false));
                                        break;
                                }
                            }
                        });
                }
            });
    }

    // Ueberpruefung der angegebenen Parameter auf Bekanntheit und Typen...
    __ITEMS.forEach(item => {
            const __ITEMVALUE = __CONFIG[item];
            const __ITEMINFO = __OPTITEMS[item];
            const [ __ITEMTEXT, __ITEMTYPE, __ITEMEXAMPLES, __ITEMNEED] =
                    (__ITEMINFO || [ "Error", undefined, "", __OPTNEED.OPT ]);
            const __KEYITEM = __KEY + '[' + item + ']';
            const __TYPE = (__OPTITEMTYPEMAPPING[__ITEMTYPE] || __ITEMTYPE);
            let isValid = true;

            if (! __ITEMINFO) {
                __LOG[1]("checkOptItem(): Error in " + codeLine(true, true, true, false));
                __ERRORFUN("Unknown parameter " + __LOG.info(item, false) + " for option " + __LOG.info(__KEY, false));
            }

            if (preInit && (__ITEMNEED === __OPTNEED.INT)) {
                __LOG[1]("checkOptItem(): Error in " + codeLine(true, true, true, false));
                throw TypeError("Internal parameter " + __LOG.info(item, false) + " must not be used for option " + __LOG.info(__KEY, false));
            }

            switch (__TYPE) {
                case 'Boolean'    :
                case 'Function'   :
                case 'Number'     :
                case 'Object'     :
                case 'Promise'    :
                case 'String'     :
                                    checkType(__ITEMVALUE, __TYPE.toLowerCase(), false, "checkOptItem()", __KEYITEM, __TYPE);
                                    break;
                case '__OPTACTION':
                                    checkEnumObj(__ITEMVALUE, __OPTACTION, true, "checkOptItem()", __KEYITEM, __TYPE);
                                    break;
                case '__OPTTYPES' :
                                    checkEnumObj(__ITEMVALUE, __OPTTYPES, true, "checkOptItem()", __KEYITEM, __TYPE);
                                    break;
                case 'any'        : break;  // OK
                default           : __LOG[1]("checkOptItem(): Internal error in " + codeLine(true, true, true, false));
                                    throw TypeError("Unknown parameter type " + __LOG.info(__ITEMTYPE, false) + " needed for option " + __LOG.info(__KEY, false));
            }

            if (__ITEMVALUE) {
                switch (__ITEMTYPE) {
                    case 'Array'      : isValid = Array.isArray(__ITEMVALUE);
                                        break;
                    case 'Char'       : isValid = (__ITEMVALUE.length === 1);
                                        break;
                    case 'Code'       : isValid = false;  // TODO Code-Schutz verfeinern (bisher: gesperrt)
                                        break;
                    case 'Integer'    : isValid = Number.isInteger(__ITEMVALUE);
                                        break;
                    default           : isValid = true;
                                        break;
                }
            }
            if (! isValid) {
                __LOG[1]("checkOptItem(): Error in " + codeLine(true, true, true, false));
                throw TypeError("Parameter " + __LOG.info(item, false) + " for option " + __LOG.info(__KEY, false) + " is not of type " + __ITEMTYPE);
            }
        });

    return [ __CONFIG, __NAME, __KEY ];
}

// Prueft ein Objekt, ob es eine syntaktisch valide (ueber Menu) gesetzte Option ist
// opt: Zu validierendes Options-Objekt
// key: Falls bekannt, der Item-Key dieser Option (wird auf Korrektheit ueberprueft)
// return [__CONFIG, __NAME, __KEY, ...] Konfiguration und ggfs. Name und/oder Key der Option
function checkOpt(opt, key = undefined) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __KEY = getOptKey(opt, false);  // NOTE Unbedingt strict auf false setzen, sonst zirkulaer!

    if (__NAME === undefined) {  // NOTE opt === undefined liefert __NAME === undefined
        __LOG[1]("checkOpt(): Error in " + codeLine(true, true, true, false));
        throw Error("Unknown option " + __LOG.info(key, false));
    }

    if (((typeof key) !== 'undefined') && (key !== __KEY)) {
        __LOG[1]("checkOpt(): Error in " + codeLine(true, true, true, false));
        throw RangeError("Invalid option key (expected " + __LOG.info(key, false) + ", but got " + __LOG.info(__KEY, false) + ')');
    }

    if (! opt.ValidOpt) {
        if (((typeof __NAME) !== 'undefined') && __NAME.length && ((typeof __CONFIG) === 'object')) {
            opt.ValidOpt = true;
        } else {
            opt.ValidOpt = false;
            __LOG[1]("checkOpt(): Error in " + codeLine(true, true, true, false));
            throw TypeError("Invalid option (" + __LOG.info(__NAME, false) + "): " + __LOG.info(opt, true));
        }
    }

    return [ __CONFIG, __NAME, __KEY ];
}

// Prueft alle Objekt in einem optSet, ob sie syntaktisch valide (ueber Menu) gesetzte Optionen sind
// optSet: Zu validierende Options-Objekte
// return Das uebergeben optSet (falls alle Optionen valide sind)
function checkOptSet(optSet) {
    Object.entries(optSet).forEach(([key, opt]) => checkOpt(opt, key));

    return optSet;
}

// Prueft alle Objekt in einer optConfig, ob sie syntaktisch valide Konfigurationen der (ueber Menu) gesetzte Optionen sind
// optConfig: Zu validierende Konfigurations-Objekte fuer Optionen
// preInit: Falls true, dann geht es um die Grundinitialisierung, in der keine internen Optionen erlaubt sind!
// return Das uebergeben optConfig (falls alle Optionen valide sind)
function checkOptConfig(optConfig, preInit = false) {
    const __OPTCONFIG = optConfig;
    const __ENTRIES = Object.entries(__OPTCONFIG);
    const __NAMEUSE = { };

    // Jede einzelne Option ueberpruefen...
    __ENTRIES.forEach(([key, config]) => checkOptItem(config, key, preInit));

    // Benutzte (interne Speicher-) Namen auf doppelte Eintraege ueberpruefen...
    __ENTRIES.forEach(([key, config]) => {
            const __CONFIG = config;
            const __ISSHARED = getValue(__CONFIG.Shared, false, true);

            if (! __ISSHARED) {
                const __KEY = key;
                const __NAME = config.Name;  // Muss vorhanden sein, da vorher ueberprueft!
                const __USED = __NAMEUSE[__NAME];

                if (__USED) {
                    __LOG[1]("checkOpt(): Error in " + codeLine(true, true, true, false));
                    throw RangeError("Internal name " + __LOG.info(__NAME, false) + " of option " +
                            __LOG.info(__KEY, false) + " was already used in option " + __LOG.info(__USED, false));
                } else {
                    __NAMEUSE[__NAME] = __KEY;
                }
            }
        });

    __LOG[2](Object.keys(__OPTCONFIG).length + " Optionen erfolgreich \u00FCberpr\u00FCft...");

    return __OPTCONFIG;
}

// Ueberprueft, ob eine bestimmte Option konfiguriert ist
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// return true: Option existiert, false: nicht vorhanden
function hasOpt(optSet, item) {
    if ((optSet !== undefined) && (item !== undefined)) {
        const __STRICT = true;  // TODO
        const __OPTITEM = optSet[item];
        const __EXISTS = ((__OPTITEM !== undefined) && (__OPTITEM !== null));
        const __OPT = (__EXISTS ? getOpt(__OPTITEM) : null);

        if (__OPT && __STRICT) {
            checkOpt(__OPT, item);
        }

        return __EXISTS;
    }

    return false;
}

// Gibt eine Option sicher zurueck
// opt: Config und Value der Option, ggfs. undefined
// defOpt: Rueckgabewert, falls undefined
// return Daten zur Option (oder defOpt)
function getOpt(opt, defOpt = { }) {
    return getValue(opt, defOpt);
}

// Gibt eine Option sicher zurueck (Version mit Key)
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// defOpt: Rueckgabewert, falls nicht zu finden
// return Daten zur Option (oder defOpt)
function getOptByName(optSet, item, defOpt = { }) {
    const __STRICT = true;  // TODO
    let opt = defOpt;

    if ((optSet !== undefined) && (item !== undefined)) {
        opt = getOpt(optSet[item], defOpt);
    }

    if (__STRICT) {
        checkOpt(opt, item);
    }

    return opt;
}

// Gibt die Konfigurationsdaten einer Option zurueck
// opt: Config und Value der Option
// defConfig: Rueckgabewert, falls Config nicht zu finden
// return Konfigurationsdaten der Option
function getOptConfig(opt, defConfig = { }) {
    return getValue(getOpt(opt).Config, defConfig);
}

// Gibt den Item-Key einer Option zurueck
// opt: Config und Value der Option
// strict: Ueberpruefen des Objektes?
// return Item-Key der Option innerhalb von optSet
function getOptKey(opt, strict = ! false) {
    if (strict) {
        checkOpt(opt)
    }

    return getValue(getOpt(opt).Item);
}

// Setzt den Namen einer Option
// opt: Config und Value der Option
// name: Zu setzender Name der Option
// reload: Seite mit neuem Wert neu laden
// return Gesetzter Name der Option
function setOptName(opt, name) {
    const [ __CONFIG, __NAME ] = checkOpt(opt);

    if (__NAME !== name) {
        __LOG[5]("RENAME " + __LOG.changed(__NAME, name, false, false));

        __CONFIG.Name = name;
    }

    return name;
}

// Gibt den Namen einer Option zurueck
// opt: Config und Value der Option
// return Name der Option
function getOptName(opt) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = __CONFIG.Name;

    if (! __NAME) {
        const __SHARED = __CONFIG.Shared;
        const __OBJREF = getSharedRef(__SHARED, opt.Item);

        //if (__SHARED && ! opt.Loaded) {  // TODO klaeren!

        if (__OBJREF) {
            return __OBJREF.getPath();
        }

        showAlert("Error", "Option ohne Namen", "(Item " + __LOG.info(opt.Item, false) + ") " + safeStringify(__SHARED), false);
    }

    return __NAME;
}

// Setzt den Wert einer Option
// opt: Config und Value der Option
// value: Zu setzender Wert der Option
// initialLoad (nur fuer loadOption!): Grundinitialisierung (auch Read-Only)
// return Gesetzter Wert
function setOptValue(opt, value, initialLoad = false) {
    if (opt !== undefined) {
        const [ , __NAME, __KEY ] = checkOpt(opt);

        if (initialLoad || ! opt.ReadOnly) {
            __LOG[8](__NAME + ": " + __LOG.changed(opt.Value, value, true, false));

            opt.Value = value;
        } else {
            throw TypeError("Can't modify read-only option " + __LOG.info(__KEY, false) + " (" + __NAME + ')');
        }

        return opt.Value;
    } else {
        return undefined;
    }
}

// Gibt den Wert einer Option zurueck, falls vorhanden
// opt: Config und Value der Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist (nur, falls geladen und nicht gesetzt!)
// return Gesetzter Wert (falls geladen)
function getOptValue(opt, defValue = undefined) {
    const __STRICT = true;
    let value;

    if (__STRICT) {
        checkOpt(opt);
    }

    if (opt /*&& opt.Loaded*/) {  // NOTE opt.Loaded steuert das Laden, aber opt.Value den Wert
        value = getValue(opt.Value, defValue);
    }

    return valueOf(value);
}

// Gibt den Wert einer Option zurueck, falls vorhanden
// opt: Config und Value der Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist (nur, falls geladen und nicht gesetzt!)
// return Gesetzter Wert (falls geladen)
function getOptValueByName(optSet, item, defValue = undefined) {
    // NOTE checkOpt(__OPT) wird in getOptByName() geprueft...
    const __OPT = getOptByName(optSet, item);

    return valueOf(getValue(__OPT.Value, defValue));
}

// ==================== Ende Abschnitt fuer Zugriff auf Options-Parameter ====================

// ==================== Abschnitt fuer Zugriff auf die Optionen ====================

// Setzt eine Option auf einen vorgegebenen Wert
// Fuer kontrollierte Auswahl des Values siehe setNextOpt()
// opt: Config und vorheriger Value der Option
// value: (Bei allen Typen) Zu setzender Wert
// reload: Seite mit neuem Wert neu laden
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function setOpt(opt, value, reload = false, onFulfilled = undefined, onRejected = undefined) {
    const [ __CONFIG, __NAME ] = checkOpt(opt);

    return setOptValue(opt, setStored(__NAME, value, reload, __CONFIG.Serial, onFulfilled, onRejected));
}

// Ermittelt die naechste moegliche Option
// opt: Config und Value der Option
// defValue: Ggfs. zu setzender Wert fuer den Fall, dass nichts gesetzt ist
// return Zu setzender Wert
function getNextOpt(opt, defValue = undefined) {
    const [ __CONFIG ] = checkOpt(opt);
    const __VALUE = getOptValue(opt, defValue);

    switch (__CONFIG.Type) {
    case __OPTTYPES.MC : return getValue(value, getNextValue(__CONFIG.Choice, __VALUE));
    case __OPTTYPES.SW : return getValue(value, ! __VALUE);
    case __OPTTYPES.TF : return getValue(value, ! __VALUE);
    case __OPTTYPES.SD : return getValue(value, __VALUE);
    case __OPTTYPES.SI : break;
    default :            break;
    }

    return __VALUE;
}

// Setzt die naechste moegliche Option
// opt: Config und Value der Option
// defValue: Default fuer ggfs. zu setzenden Wert
// reload: Seite mit neuem Wert neu laden
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function setNextOpt(opt, defValue = undefined, reload = false, onFulfilled = undefined, onRejected = undefined) {
    // NOTE checkOpt(opt) wird in setOpt() und getNextOpt() geprueft...
    return setOpt(opt, getNextOpt(opt, defValue), reload, onFulfilled, onRejected);
}

// Setzt die naechste moegliche Option oder fragt ab einer gewissen Anzahl interaktiv ab
// opt: Config und Value der Option
// defValue: Default fuer ggfs. zu setzenden Wert
// reload: Seite mit neuem Wert neu laden
// freeValue: Angabe, ob Freitext zugelassen ist (Default: false)
// minChoice: Ab wievielen Auswahlmoeglichkeiten soll abgefragt werden? (Default: 3)
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function promptNextOpt(opt, defValue = undefined, reload = false, freeValue = false, selValue = true, minChoice = 3, onFulfilled = undefined, onRejected = undefined) {
    const [ __CONFIG ] = checkOpt(opt);
    const __CHOICE = __CONFIG.Choice;

    if (defValue || (! __CHOICE) || (__CHOICE.length < minChoice)) {
        return setNextOpt(opt, defValue, reload, onFulfilled, onRejected);
    }

    const __VALUE = getOptValue(opt);

    try {
        const __NEXTVAL = getNextValue(__CHOICE, __VALUE);
        let message = "";

        if (selValue) {
            for (let index = 0; index < __CHOICE.length; index++) {
                message += (index + 1) + ") " + __CHOICE[index] + '\n';
            }
            message += "\nNummer oder Wert eingeben:";
        } else {
            message = __CHOICE.join(" / ") + "\n\nWert eingeben:";
        }

        const __ANSWER = prompt(message, __NEXTVAL);

        if (__ANSWER) {
            const __INDEX = parseInt(__ANSWER, 10) - 1;
            let nextVal = (selValue ? __CHOICE[__INDEX] : undefined);

            if (nextVal === undefined) {
                const __VALTYPE = getValue(__CONFIG.ValType, 'String');
                const __CASTVAL = this[__VALTYPE](__ANSWER);

                if (freeValue || (~ __CHOICE.indexOf(__CASTVAL))) {
                    nextVal = __CASTVAL;
                }
            }

            if (nextVal !== __VALUE) {
                if (nextVal !== undefined) {
                    return setOpt(opt, nextVal, reload, onFulfilled, onRejected);
                }

                const __LABEL = substParam(__CONFIG.Label, __VALUE);

                showAlert(__LABEL, "Ung\u00FCltige Eingabe: " + __ANSWER);
            }
        }

        onFulfilled(__VALUE);
    } catch (ex) {
        onRejected(ex);

        showException('[' + (ex && ex.lineNumber) + "] promptNextOpt()", ex);
    }

    return __VALUE;
}

// Setzt eine Option auf einen vorgegebenen Wert (Version mit Key)
// Fuer kontrollierte Auswahl des Values siehe setNextOptByName()
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// value: (Bei allen Typen) Zu setzender Wert
// reload: Seite mit neuem Wert neu laden
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function setOptByName(optSet, item, value, reload = false, onFulfilled = undefined, onRejected = undefined) {
    // NOTE checkOpt(__OPT) wird in getOptByName() und setOpt() geprueft...
    const __OPT = getOptByName(optSet, item);

    return setOpt(__OPT, value, reload, onFulfilled, onRejected);
}

// Ermittelt die naechste moegliche Option (Version mit Key)
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// defValue: Default fuer ggfs. zu setzenden Wert
// return Zu setzender Wert
function getNextOptByName(optSet, item, defValue = undefined) {
    // NOTE checkOpt(__OPT) wird in getOptByName() und getNextOpt() geprueft...
    const __OPT = getOptByName(optSet, item);

    return getNextOpt(__OPT, defValue);
}

// Setzt die naechste moegliche Option (Version mit Key)
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// defValue: Default fuer ggfs. zu setzenden Wert
// reload: Seite mit neuem Wert neu laden
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function setNextOptByName(optSet, item, defValue = undefined, reload = false, onFulfilled = undefined, onRejected = undefined) {
    // NOTE checkOpt(__OPT) wird in getOptByName() und setNextOpt() ueber setOpt() geprueft...
    const __OPT = getOptByName(optSet, item);

    return setNextOpt(__OPT, defValue, reload, onFulfilled, onRejected);
}

// Setzt die naechste moegliche Option oder fragt ab einer gewissen Anzahl interaktiv ab (Version mit Key)
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// defValue: Default fuer ggfs. zu setzenden Wert
// reload: Seite mit neuem Wert neu laden
// freeValue: Angabe, ob Freitext zugelassen ist (Default: false)
// minChoice: Ab wievielen Auswahlmoeglichkeiten soll abgefragt werden? (Default: 3)
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function promptNextOptByName(optSet, item, defValue = undefined, reload = false, freeValue = false, selValue = true, minChoice = 3, onFulfilled = undefined, onRejected = undefined) {
    // NOTE checkOpt(__OPT) wird in getOptByName() und promptNextOpt() geprueft...
    const __OPT = getOptByName(optSet, item);

    return promptNextOpt(__OPT, defValue, reload, freeValue, selValue, minChoice, onFulfilled, onRejected);
}

// ==================== Ende Abschnitt fuer Zugriff auf die Optionen ====================

// *** EOF ***

/*** Ende Modul util.option.data.js ***/

/*** Modul util.option.class.options.js ***/

// ==UserModule==
// _name         util.option.class.options
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Objekt-Klasse fuer die Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.sys.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse Options ====================

// Basisklasse fuer Optionen
function Options(optConfig, optSetLabel) {
    'use strict';

    this.setConst('config', (optConfig || { }), false);
    this.setConst('setLabel', (optSetLabel || '__OPTSET'), false);
}

Class.define(Options, Object, {
        'checkKey'        : function(key) {
                                UNUSED(key);
                                // Hier kann man Keys 'unsichtbar' machen...
                                return true;
                            },
        'toString'        : function() {
                                let retStr = this.setLabel + " = {  // " + __DBMOD.Name + " / " + __DBMAN.Name + '\n';

                                for (const [ __KEY, __OPT ] of Object.entries(this)) {
                                    if (this.checkKey(__KEY)) {
                                        const __CONFIG = getOptConfig(__OPT);
                                        const __SHAREDDATA = __CONFIG.SharedData;
                                        const __NAME = getOptName(__OPT);

                                        // Bei __SHAREDDATA unbedingt zyklische Referenzen vermeiden!
                                        // Daher nur die ObjRef anzeigen, ansonsten den gesetzten Wert...
                                        const __VAL = getValue(__SHAREDDATA, getOptValue(__OPT));
                                        const __OUT = [
                                                          __LOG.info(__VAL, true),
                                                          __LOG.info(__KEY, false),
                                                          __LOG.info(__NAME, false),
                                                          getValStr(__CONFIG.FormLabel),
                                                          __LOG.info(__CONFIG.Default, true)
                                            ];

                                        retStr += '\t' + __OUT.join('\t') + '\n';
                                    }
                                }

                                retStr += "}";

                                return retStr;
                            },
        'hasOpt'          : function(item) {
                                return hasOpt(this, item);
                            },
        'getOpt'          : function(item, defOpt = { }) {
                                return getOptByName(this, item, defOpt);
                            },
        'getOptValue'     : function(item, defValue = undefined) {
                                return getOptValueByName(this, item, defValue);
                            },
        'setOpt'          : function(item, value, reload = false, onFulfilled = undefined, onRejected = undefined) {
                                return setOptByName(this, item, value, reload, onFulfilled, onRejected);
                            },
        'getNextOpt'      : function(item, defValue = undefined) {
                                return getNextOptByName(this, item, defValue);
                            },
        'setNextOpt'      : function(item, defValue = undefined, reload = false, onFulfilled = undefined, onRejected = undefined) {
                                return setNextOptByName(this, item, defValue, reload, onFulfilled, onRejected);
                            },
        'promptNextOpt'   : function(item, defValue = undefined, reload = false, freeValue = false, selValue = true, minChoice = 3, onFulfilled = undefined, onRejected = undefined) {
                                return promptNextOptByName(this, item, defValue, reload, freeValue, selValue, minChoice, onFulfilled, onRejected);
                            },
        'invalidateOpts'  : async function(force = false, reload = true) {
                                return invalidateOpts(this, force, reload);
                            },
        'loadOptions'     : function(force = false) {
                                return loadOptions(this, force);
                            },
        'deleteOptions'   : async function(optSelect = undefined, force = false, reset = true) {
                                return deleteOptions(this, optSelect, force, reset);
                            },
        'saveOptions'     : async function(optSelect = undefined) {
                                return saveOptions(this, optSelect);
                            },
        'renameOptions'   : async function(optSelect = undefined, renameParam = undefined, renameFun = undefined) {
                                return renameOptions(this, optSelect, renameParam, renameFun);
                            },
        'resetOptions'    : async function(reload = true) {
                                return resetOptions(this, reload);
                            }
    });

// ==================== Ende Abschnitt fuer Klasse Options ====================

// *** EOF ***

/*** Ende Modul util.option.class.options.js ***/

/*** Modul util.option.api.js ***/

// ==UserModule==
// _name         util.option.api
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Zugriff auf die Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt Operationen auf Optionen ====================

// Invalidiert eine (ueber Menu) gesetzte Option
// opt: Zu invalidierende Option
// force: Invalidiert auch Optionen mit 'AutoReset'-Attribut
// return Promise auf resultierenden Wert
function invalidateOpt(opt, force = false, reload = true) {
    const [ __CONFIG ] = checkOpt(opt);

    return Promise.resolve(opt.Promise).then(() => {
            if (opt.Loaded && reload && ! opt.ReadOnly) {
                // Wert "ungeladen"...
                opt.Loaded = (force || ! __CONFIG.AutoReset);

                if (opt.Loaded && __CONFIG.AutoReset) {
                    // Nur zuruecksetzen, gilt als geladen...
                    setOptValue(opt, initOptValue(__CONFIG));
                }
            } else {  // ! opt.Loaded || ! reload || opt.ReadOnly
                opt.Loaded = false;
            }

            return getOptValue(opt);
        }, defaultCatch);
}

// Invalidiert die (ueber Menu) gesetzten Optionen
// optSet: Object mit den Optionen
// force: Invalidiert auch Optionen mit 'AutoReset'-Attribut
// return Promise auf Object mit den geladenen Optionen
async function invalidateOpts(optSet, force = false, reload = true) {
    for (let opt in optSet) {
        const __OPT = optSet[opt];

        await invalidateOpt(__OPT, force, reload);
    }

    return optSet;
}

// Laedt eine (ueber Menu) gesetzte Option
// opt: Zu ladende Option
// force: Laedt auch Optionen mit 'AutoReset'-Attribut
// return Promise auf gesetzten Wert der gelandenen Option
function loadOption(opt, force = false) {
    const [ __CONFIG, __NAME, __KEY ] = checkOpt(opt);

    if (! opt.Promise) {
        const __ISSHARED = getValue(__CONFIG.Shared, false, true);
        const __DEFAULT = getOptValue(opt, undefined);
        let value;

        if (opt.Loaded && ! __ISSHARED) {
            const __ERROR = "Error: Option " + __LOG.info(__NAME, false) + " bereits geladen!";

            __LOG[1](__ERROR);

            return Promise.reject(__ERROR);
        }

        if (opt.ReadOnly || __ISSHARED) {
            value = __DEFAULT;
        } else if (! force && __CONFIG.AutoReset) {
            value = initOptValue(__CONFIG);
        } else {
            value = (__CONFIG.Serial ?
                            deserialize(__NAME, __DEFAULT) :
                            summonValue(__NAME, __DEFAULT));
        }

        opt.Promise = Promise.resolve(value).then(value => {
                // Paranoide Sicherheitsabfrage (das sollte nie passieren!)...
                if (opt.Loaded || ! opt.Promise) {
                    throw Error("Unerwarteter Widerspruch zwischen Loaded und Promise in Option " +
                            __LOG.info(__KEY, false) + " (" + __NAME + ')',
                            { 'cause' : __LOG.info(opt, true, true) });
                }
                __LOG[6]("LOAD " + __NAME + ": " + __LOG.changed(__DEFAULT, value, true, true));

                // Wert intern setzen...
                const __VAL = setOptValue(opt, value, true);

                // Wert als geladen markieren...
                opt.Promise = undefined;
                opt.Loaded = true;

                return Promise.resolve(__VAL);
            }, defaultCatch);
    }

    return opt.Promise;
}

// Laedt die (ueber Menu) gesetzten Optionen
// optSet: Object mit den Optionen
// force: Laedt auch Optionen mit 'AutoReset'-Attribut
// return Array mit Promises neuer Ladevorgaenge (fuer Objekte mit 'name' und 'value')
function loadOptions(optSet, force = false) {
    const __PROMISES = [];

    for (let opt in optSet) {
        const __OPT = optSet[opt];

        if (__OPT && ! __OPT.Loaded) {
            const __PROMISE = loadOption(__OPT, force).then(value => {
                    __LOG[6]("LOADED " + __LOG.info(opt, false) + " << " + __LOG.info(value, true));

                    return Promise.resolve({
                            'name'  : opt,
                            'value' : value
                        });
                }, defaultCatch);

            __PROMISES.push(__PROMISE);
        }
    }

    return Promise.all(__PROMISES);
}

// Entfernt eine (ueber Menu) gesetzte Option (falls nicht 'Permanent')
// opt: Gesetzte Option
// force: Entfernt auch Optionen mit 'Permanent'-Attribut
// reset: Setzt bei Erfolg auf Initialwert der Option (auch fuer nicht 'AutoReset')
// return Promise von GM.deleteValue() (oder void)
function deleteOption(opt, force = false, reset = true) {
    const [ __CONFIG, __NAME ] = checkOpt(opt);

    if (force || ! __CONFIG.Permanent) {
        const __VALUE = getOptValue(opt, undefined);
        let newValue;

        return discardValue(__NAME).then(() => {
                if (reset || __CONFIG.AutoReset) {
                    newValue = setOptValue(opt, initOptValue(__CONFIG));
                }
                __LOG[6]("OK DELETE " + __LOG.changed(__VALUE, newValue, true, false));
            }, defaultCatch);
    }

    return Promise.resolve();
}

// Entfernt die (ueber Menu) gesetzten Optionen (falls nicht 'Permanent')
// optSet: Gesetzte Optionen
// optSelect: Liste von ausgewaehlten Optionen, true = entfernen, false = nicht entfernen
// force: Entfernt auch Optionen mit 'Permanent'-Attribut
// reset: Setzt bei Erfolg auf Initialwert der Option
// return Promise auf diesen Vorgang
async function deleteOptions(optSet, optSelect = undefined, force = false, reset = true) {
    const __DELETEALL = ((optSelect === undefined) || (optSelect === true));
    const __OPTSELECT = getValue(optSelect, { });

    for (let opt in optSet) {
        if (getValue(__OPTSELECT[opt], __DELETEALL)) {
            await deleteOption(optSet[opt], force, reset);
        }
    }

    return Promise.resolve();
}

// Speichert eine (ueber Menu) gesetzte Option (ggfs. erneut)
// opt: Gesetzte Option
// return Promise von setOptValue() (oder void)
function saveOption(opt) {
    const [ __CONFIG, __NAME ] = checkOpt(opt);

    if (__CONFIG !== undefined) {
        const __VALUE = getOptValue(opt);

        __LOG[4]("SAVE " + __NAME);

        return setOpt(opt, __VALUE, false);
    }

    return Promise.resolve();
}

// Speichert die (ueber Menu) gesetzten Optionen im Speicher
// optSet: Gesetzte Optionen
// optSelect: Liste von ausgewaehlten Optionen, true = speichern, false = nicht speichern
// return Promise auf diesen Vorgang
async function saveOptions(optSet, optSelect = undefined) {
    const __SAVEALL = ((optSelect === undefined) || (optSelect === true));
    const __OPTSELECT = getValue(optSelect, { });

    for (let opt in optSet) {
        if (getValue(__OPTSELECT[opt], __SAVEALL)) {
            await saveOption(optSet[opt]);
        }
    }

    return Promise.resolve();
}

// Benennt eine Option um und laedt sie ggfs. nach
// opt: Gesetzte Option
// name: Neu zu setzender Name (Speicheradresse)
// reload: Wert nachladen statt beizubehalten
// force: Laedt auch Optionen mit 'AutoReset'-Attribut
// return Promise auf umbenannte Option
async function renameOption(opt, name, reload = false, force = false) {
    const [ , __NAME ] = checkOpt(opt);

    if (__NAME !== name) {
        await deleteOption(opt, true, false);

        setOptName(opt, name);

        await invalidateOpt(opt, opt.Loaded, reload);

        if (reload) {
            opt.Loaded = false;

            await loadOption(opt, force);
        }
    }

    return Promise.resolve(opt);
}

// Ermittelt einen neuen Namen mit einem Prefix. Parameter fuer renameOptions()
// name: Gesetzter Name (Speicheradresse)
// prefix: Prefix, das vorangestellt werden soll
// return Neu zu setzender Name (Speicheradresse)
function prefixName(name, prefix) {
    return (prefix + name);
}

// Ermittelt einen neuen Namen mit einem Postfix. Parameter fuer renameOptions()
// name: Gesetzter Name (Speicheradresse)
// postfix: Postfix, das angehaengt werden soll
// return Neu zu setzender Name (Speicheradresse)
function postfixName(name, postfix) {
    return (name + postfix);
}

// Benennt selektierte Optionen nach einem Schema um und laedt sie ggfs. nach
// optSet: Gesetzte Optionen
// optSelect: Liste von ausgewaehlten Optionen, true = nachladen, false = nicht nachladen
// 'reload': Option nachladen?
// 'force': Option auch mit 'AutoReset'-Attribut nachladen?
// renameParam: Wird an renameFun uebergeen
// renameFun: function(name, param) zur Ermittlung des neuen Namens
// - name: Neu zu setzender Name (Speicheradresse)
// - param: Parameter "renameParam" von oben, z.B. Prefix oder Postfix
// return Promise auf diesen Vorgang
async function renameOptions(optSet, optSelect, renameParam = undefined, renameFun = prefixName) {
    if (renameFun === undefined) {
        __LOG[1]("RENAME: Illegale Funktion!");
    }
    for (let opt in optSelect) {
        const __OPTPARAMS = optSelect[opt];
        const __OPT = optSet[opt];

        if (__OPT === undefined) {
            __LOG[1]("RENAME: Option", __LOG.info(opt, false), "nicht gefunden!");
        } else {
            const [ , __NAME ] = checkOpt(__OPT);
            const __NEWNAME = renameFun(__NAME, renameParam);
            const __ISSCALAR = ((typeof __OPTPARAMS) === 'boolean');
            // Laedt die unter dem neuen Namen gespeicherten Daten nach?
            const __RELOAD = (__ISSCALAR ? __OPTPARAMS : __OPTPARAMS.reload);
            // Laedt auch Optionen mit 'AutoReset'-Attribut?
            const __FORCE = (__ISSCALAR ? true : __OPTPARAMS.force);

            await renameOption(__OPT, __NEWNAME, __RELOAD, __FORCE);
        }
    }
}

// Setzt die Optionen in optSet auf die "Werkseinstellungen" des Skripts
// optSet: Gesetzte Optionen
// reload: Seite mit "Werkseinstellungen" neu laden
// return Promise auf diesen Vorgang
async function resetOptions(optSet, reload = true) {
    // Alle (nicht 'Permanent') gesetzten Optionen entfernen...
    await deleteOptions(optSet, true, false, ! reload);

    // ... und ggfs. Seite neu laden (mit "Werkseinstellungen")...
    refreshPage(reload);
}

// ==================== Zugriff auf Option mit eventuellem Nachladen ====================

// Gibt den Wert einer Option zurueck. Laedt die Option per loadOption(), falls noetig.
// opt: Config und Value der Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// asyncLoad: Daten werden asynchron geladen, Rueckgabewert ist ein Promise-Objekt
// force: Laedt auch Optionen mit 'AutoReset'-Attribut
// return Gesetzter Wert bzw. ein Promise darauf bei asyncLoad
function loadOptValue(opt, defValue = undefined, asyncLoad = true, force = false) {
    if (! opt) {
        return Promise.reject("loadOptValue: Option ist undefined");
    }

    const [ , __NAME ] = checkOpt(opt);

    if (asyncLoad) {
        let promise = (opt.Loaded ? Promise.resolve(opt.Value) : opt.Promise);

        if (! promise) {
            promise = loadOption(opt, force);
        }

        return promise.then(value => valueOf(getValue(value, defValue)));
    } else {
        if (! opt.Loaded) {
            __LOG[1]("Warnung: loadOptValue(" + __LOG.info(__NAME, false) + ") erlaubt kein Nachladen!");
        }

        return getOptValue(opt, defValue);
    }
}

// ==================== Ende Abschnitt Operationen auf Optionen ====================

// *** EOF ***

/*** Ende Modul util.option.api.js ***/

/*** Modul util.mem.js ***/

// ==UserModule==
// _name         util.mem
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer localStorage und sessionStorage
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Speicher ====================

// Speicher-Typen der Optionen
const __OPTMEM = {
    'normal' : {
                   'Name'      : "Browser",
                   'Value'     : localStorage,
                   'Display'   : 'localStorage',
                   'Prefix'    : 'run'
               },
    'begrenzt' : {
                   'Name'      : "Session",
                   'Value'     : sessionStorage,
                   'Display'   : 'sessionStorage',
                   'Prefix'    : 'run'
               },
    'inaktiv' : {
                   'Name'      : "inaktiv",
                   'Value'     : undefined,
                   'Display'   : "",
                   'Prefix'    : ""
               }
};

// ==================== Daten fuer Speicher ====================

// Namen des Default-, Temporaer- und Null-Memories...
const __MEMNORMAL   = 'normal';
const __MEMSESSION  = 'begrenzt';
const __MEMINACTIVE = 'inaktiv';

// Definition des Default-, Dauer- und Null-Memories...
const __OPTMEMNORMAL   = __OPTMEM[__MEMNORMAL];
const __OPTMEMSESSION  = __OPTMEM[__MEMSESSION];
const __OPTMEMINACTIVE = __OPTMEM[__MEMINACTIVE];

// Medium fuer die Datenbank (Speicher)
let myOptMem = __OPTMEMNORMAL;
let myOptMemSize;

// ==================== Abschnitt fuer Speicher ====================

// Ermittelt fuer die uebergebene Speicher-Konfiguration einen Speicher
// memory: __OPTMEM.normal = unbegrenzt gespeichert (localStorage), __OPTMEM.begrenzt = bis Browserende gespeichert (sessionStorage), __OPTMEM.inaktiv
// defMemory: Ersatz-Wert, falls memory undefined. Soll nur memory genutzt werden, dann z.B. null uebergeben!
// return memory, falls okay, sonst einen Defaultwert
function getMemory(memory = undefined, defMemory = getValue(myOptMem, __OPTMEMNORMAL)) {
    return getValue(memory, defMemory);
}

// Kompatibilitaetsfunktion: Testet, ob der uebergebene Speicher genutzt werden kann
// memory: __OPTMEM.normal = unbegrenzt gespeichert (localStorage), __OPTMEM.begrenzt = bis Browserende gespeichert (sessionStorage), __OPTMEM.inaktiv
// return true, wenn der Speichertest erfolgreich war
function canUseMemory(memory = undefined) {
    const __STORAGE = getMemory(memory, { });
    const __MEMORY = __STORAGE.Value;
    let ret = false;

    if (__MEMORY !== undefined) {
        const __TESTPREFIX = 'canUseMemoryTest';
        const __TESTDATA = Math.random().toString();
        const __TESTITEM = __TESTPREFIX + __TESTDATA;

        __MEMORY.setItem(__TESTITEM, __TESTDATA);
        ret = (__MEMORY.getItem(__TESTITEM) === __TESTDATA);
        __MEMORY.removeItem(__TESTITEM);
    }

    __LOG[4]("canUseMemory(" + __STORAGE.Name + ") = " + ret);

    return ret;
}

// Ermittelt die Groesse des benutzten Speichers
// memory: __OPTMEM.normal = unbegrenzt gespeichert (localStorage), __OPTMEM.begrenzt = bis Browserende gespeichert (sessionStorage), __OPTMEM.inaktiv
// return Groesse des genutzten Speichers in Bytes
function getMemSize(memory = undefined) {
    const __STORAGE = getMemory(memory);
    const __MEMORY = __STORAGE.Value;

    //getMemUsage(__MEMORY);

    if (__MEMORY !== undefined) {
        const __SIZE = safeStringify(__MEMORY).length;

        __LOG[4]("MEM: " + __SIZE + " bytes");
        return __SIZE;
    } else {
        return 0;
    }
}

// Gibt rekursiv und detailliert die Groesse des benutzten Speichers fuer ein Objekt aus
// value: (Enumerierbares) Objekt oder Wert, dessen Groesse gemessen wird
// out: Logfunktion, etwa __LOG[5]
// depth: Gewuenschte Rekursionstiefe (0 = nur dieses Objekt, -1 = alle Ebenen)
// name: Name des Objekts
function getMemUsage(value = undefined, out = undefined, depth = -1, name = '$') {
    const __OUT = (out || __LOG[5]);

    if ((typeof value) === 'string') {
        const __SIZE = value.length;

        __OUT("USAGE: " + name + '\t' + __SIZE + '\t' + value.slice(0, 255));
    } else if ((typeof value) === 'object') {
        if (depth === 0) {
            const __SIZE = safeStringify(value).length;

            __OUT("USAGE: " + name + '\t' + __SIZE);
        } else {
            depth--;
            for (let sub in value) {
                getMemUsage(value[sub], __OUT, depth, name + '.' + sub);
            }
            getMemUsage(value, __OUT, 0, name);
        }
    } else {
       const __DATA = (((typeof value) === 'function') ? "" : '\t' + value);

        __OUT("USAGE: " + name + '\t' + (typeof value) + __DATA);
    }
}

// Restauriert den vorherigen Speicher (der in einer Option definiert ist)
// opt: Option zur Wahl des Speichers
// return Promise auf gesuchten Speicher oder Null-Speicher ('inaktiv')
async function restoreMemoryByOpt(opt) {
    // Memory Storage fuer vorherige Speicherung...
    const __STORAGE = await loadOptValue(opt, __MEMNORMAL, true, true);

    return __OPTMEM[__STORAGE];
}

// Initialisiert den Speicher (der in einer Option definiert ist) und merkt sich diesen ggfs.
// opt: Option zur Wahl des Speichers
// saveOpt: Option zur Speicherung der Wahl des Speichers (fuer restoreMemoryByOpt)
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesuchter Speicher oder Null-Speicher ('inaktiv'), falls speichern nicht moeglich ist
function startMemoryByOpt(opt, saveOpt = undefined, onFulfilled = undefined, onRejected = undefined) {
    // Memory Storage fuer naechste Speicherung...
    let storage = getOptValue(opt, __MEMNORMAL);
    let optMem = __OPTMEM[storage];

    if (! canUseMemory(optMem)) {
        if (storage !== __MEMINACTIVE) {
            storage = __MEMINACTIVE;
            optMem = __OPTMEM[storage];
        }
    }

    if (saveOpt !== undefined) {
        setOpt(saveOpt, storage, false, onFulfilled, onRejected);
    }

    return optMem;
}

// ==================== Ende Abschnitt fuer Speicher ====================

// *** EOF ***

/*** Ende Modul util.mem.js ***/

/*** Modul util.mem.db.js ***/

// ==UserModule==
// _name         util.mem.db
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer die Script-Datenbank
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.sys.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.db.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Funktionen fuer die Scriptdatenbank ====================

// Initialisiert die Scriptdatenbank, die einen Datenaustausch zwischen den Scripten ermoeglicht
// optSet: Gesetzte Optionen (und Config)
function initScriptDB(optSet) {
    UNUSED(optSet);

     // Speicher fuer die DB-Daten...
    const __DBMEM = myOptMem.Value;

    __DBTOC.versions = getValue((__DBMEM === undefined) ? undefined : JSON.parse(__DBMEM.getItem('__DBTOC.versions')), { });
    __DBTOC.namespaces = getValue((__DBMEM === undefined) ? undefined : JSON.parse(__DBMEM.getItem('__DBTOC.namespaces')), { });

    // Zunaechst den alten Eintrag entfernen...
    delete __DBTOC.versions[__DBMOD.name];
    delete __DBTOC.namespaces[__DBMOD.name];

    if (__DBMEM !== undefined) {
        // ... und die Daten der Fremdscripte laden...
        for (let module in __DBTOC.versions) {
            scriptDB(module, getValue(JSON.parse(__DBMEM.getItem('__DBDATA.' + module)), { }));
        }
    }
}

// Setzt die Daten dieses Scriptes in der Scriptdatenbank, die einen Datenaustausch zwischen den Scripten ermoeglicht
// optSet: Gesetzte Optionen (und Config)
function updateScriptDB(optSet) {
    // Eintrag ins Inhaltsverzeichnis...
    __DBTOC.versions[__DBMOD.name] = __DBMOD.version;
    __DBTOC.namespaces[__DBMOD.name] = __DBMOD.namespace;

    // Speicher fuer die DB-Daten...
    const __DBMEM = myOptMem.Value;

    if (__DBMEM !== undefined) {
        // Permanente Speicherung der Eintraege...
        __DBMEM.setItem('__DBTOC.versions', safeStringify(__DBTOC.versions));
        __DBMEM.setItem('__DBTOC.namespaces', safeStringify(__DBTOC.namespaces));
        __DBMEM.setItem('__DBDATA.' + __DBMOD.name, safeStringify(optSet));

        // Aktualisierung der Speichergroesse...
        myOptMemSize = getMemSize(myOptMem);
    }

    // Jetzt die inzwischen gefuellten Daten *dieses* Scripts ergaenzen...
    scriptDB(__DBMOD.name, getValue(optSet, { }));

    __LOG[2](__DBDATA);
}

// Holt die globalen Daten zu einem Modul aus der Scriptdatenbank
// module: Gesetzte Optionen (und Config)
// initValue: Falls angegeben, zugewiesener Startwert
// return Daten zu diesem Modul
function scriptDB(module, initValue = undefined) {
    const __NAMESPACE = __DBTOC.namespaces[module];
    const __DBMODS = getProp(__DBDATA, __NAMESPACE, { });

    if (initValue !== undefined) {
        return (__DBMODS[module] = initValue);
    } else {
        return getProp(__DBMODS, module, { });
    }
}

// ==================== Ende Funktionen fuer die Scriptdatenbank ====================

// *** EOF ***

/*** Ende Modul util.mem.db.js ***/

/*** Modul util.mem.cmd.js ***/

// ==UserModule==
// _name         util.mem.cmd
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer gespeicherte Kommandos (StoredCmds)
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.cmd.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer StoredCmds ====================

// Fuehrt die in einem Storage gespeicherte Operation aus
// memory: __OPTMEM.normal = unbegrenzt gespeichert (localStorage), __OPTMEM.begrenzt = bis Browserende gespeichert (sessionStorage), __OPTMEM.inaktiv
// return Array von Objekten mit 'cmd' / 'key' / 'val' (derzeit maximal ein Kommando) oder undefined
function getStoredCmds(memory = undefined) {
    const __STORAGE = getMemory(memory);
    const __MEMORY = __STORAGE.Value;
    const __RUNPREFIX = __STORAGE.Prefix;
    const __STOREDCMDS = [];

    if (__MEMORY !== undefined) {
        const __GETITEM = function(item) {
                              return __MEMORY.getItem(__RUNPREFIX + item);
                          };
        const __DELITEM = function(item) {
                              return __MEMORY.removeItem(__RUNPREFIX + item);
                          };
        const __CMD = ((__MEMORY !== undefined) ? __GETITEM('cmd') : undefined);

        if (__CMD !== undefined) {
            const __KEY = __GETITEM('key');
            let value = __GETITEM('val');

            try {
                value = JSON.parse(value);
            } catch (ex) {
                __LOG[1]("getStoredCmds():", __CMD, __LOG.info(__KEY, false), "hat illegalen Wert", __LOG.info(value, false));
                // ... meist kann man den String selber aber speichern, daher kein "return"...
            }

            __STOREDCMDS.push({
                                'cmd' : __CMD,
                                'key' : __KEY,
                                'val' : value
                            });
        }

        __DELITEM('cmd');
        __DELITEM('key');
        __DELITEM('val');
    }

    return (__STOREDCMDS.length ? __STOREDCMDS : undefined);
}

// Fuehrt die in einem Storage gespeicherte Operation aus
// storedCmds: Array von Objekten mit 'cmd' / 'key' / 'val' (siehe getStoredCmds())
// optSet: Object mit den Optionen
// beforeLoad: Angabe, ob nach der Speicherung noch loadOptions() aufgerufen wird
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Promise auf ein Array von Operationen (wie storedCmds), die fuer die naechste Phase uebrig bleiben
async function runStoredCmds(storedCmds, optSet = undefined, beforeLoad = undefined, onFulfilled = undefined, onRejected = undefined) {
    const __BEFORELOAD = getValue(beforeLoad, true);
    const __STOREDCMDS = getValue(storedCmds, []);
    const __LOADEDCMDS = [];
    let invalidated = false;

    while (__STOREDCMDS.length) {
        const __STORED = __STOREDCMDS.shift();
        const __CMD = __STORED.cmd;
        const __KEY = __STORED.key;
        const __VAL = __STORED.val;

        if (__BEFORELOAD) {
            if (__STOREDCMDS.length) {
                await invalidateOpts(optSet);  // alle Optionen invalidieren
                invalidated = true;
            }
            switch (__OPTACTION[__CMD]) {
            case __OPTACTION.SET : __LOG[5]('SET', __LOG.info(__KEY, false), __VAL);
                                   setStored(__KEY, __VAL, false, false, onFulfilled, onRejected);
                                   break;
            case __OPTACTION.NXT : __LOG[5]('SETNEXT', __LOG.info(__KEY, false), __VAL);
                                   //setNextStored(__CONFIG.Choice, __KEY, __VAL, false, false, onFulfilled, onRejected);
                                   setStored(__KEY, __VAL, false, false, onFulfilled, onRejected);
                                   break;
            case __OPTACTION.RST : __LOG[5]('RESET', '(delayed)');
                                   __LOADEDCMDS.push(__STORED);
                                   break;
            default :              break;
            }
        } else {
            switch (__OPTACTION[__CMD]) {
            case __OPTACTION.SET :
            case __OPTACTION.NXT : __LOG[3]('SET/SETNEXT', '(undefined)');
                                   break;
            case __OPTACTION.RST : __LOG[5]('RESET');
                                   await resetOptions(optSet, false);
                                   await loadOptions(optSet);  // Reset auf umbenannte Optionen anwenden!
                                   break;
            default :              break;
            }
        }
    }

    __LOG[8]("runStoredCmds():", (invalidated ? "" : "not ") + "invalidated");

    return (__LOADEDCMDS.length ? __LOADEDCMDS : undefined);
}

// *** EOF ***

/*** Ende Modul util.mem.cmd.js ***/

/*** Modul util.option.menu.js ***/

// ==UserModule==
// _name         util.option.menu
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Script-Optionen im Benutzermenue
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.sys.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.menu.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer das Benutzermenu ====================

// Zeigt den Eintrag im Menu einer Option
// val: Derzeitiger Wert der Option
// menuOn: Text zum Setzen im Menu
// funOn: Funktion zum Setzen
// keyOn: Hotkey zum Setzen im Menu
// menuOff: Text zum Ausschalten im Menu
// funOff: Funktion zum Ausschalten
// keyOff: Hotkey zum Ausschalten im Menu
// return Promise von GM.registerMenuCommand()
async function registerMenuOption(val, menuOn, funOn, keyOn, menuOff, funOff, keyOff) {
    const __ON  = (val ? '*' : "");
    const __OFF = (val ? "" : '*');

    __LOG[4]("OPTION " + __ON + menuOn + __ON + " / " + __OFF + menuOff + __OFF);

    if (val) {
        return Promise.resolve(GM.registerMenuCommand(menuOff, funOff, keyOff)).then(() => menuOn);
    } else {
        return Promise.resolve(GM.registerMenuCommand(menuOn, funOn, keyOn)).then(() => menuOff);
    }
}

// Zeigt den Eintrag im Menu einer Option mit Wahl des naechsten Wertes
// val: Derzeitiger Wert der Option
// arr: Array-Liste mit den moeglichen Optionen
// menu: Text zum Setzen im Menu ($ wird durch gesetzten Wert ersetzt)
// fun: Funktion zum Setzen des naechsten Wertes
// key: Hotkey zum Setzen des naechsten Wertes im Menu
// return Promise von GM.registerMenuCommand()
async function registerNextMenuOption(val, arr, menu, fun, key) {
    const __MENU = substParam(menu, val);
    let options = "OPTION " + __MENU;

    for (let value of arr) {
        if (value === val) {
            options += " / *" + value + '*';
        } else {
            options += " / " + value;
        }
    }
    __LOG[4](options);

    return Promise.resolve(GM.registerMenuCommand(__MENU, fun, key)).then(() => __MENU);
}

// Zeigt den Eintrag im Menu einer Option, falls nicht hidden
// val: Derzeitiger Wert der Option
// menu: Text zum Setzen im Menu ($ wird durch gesetzten Wert ersetzt)
// fun: Funktion zum Setzen des naechsten Wertes
// key: Hotkey zum Setzen des naechsten Wertes im Menu
// hidden: Angabe, ob Menupunkt nicht sichtbar sein soll (Default: sichtbar)
// serial: Serialization fuer komplexe Daten
// return Promise von GM.registerMenuCommand() (oder String-Version des Wertes)
async function registerDataOption(val, menu, fun, key, hidden = false, serial = true) {
    const __VALUE = ((serial && (val !== undefined)) ? safeStringify(val) : val);
    const __MENU = substParam(menu, __VALUE);
    const __OPTIONS = (hidden ? "HIDDEN " : "") + "OPTION " + __MENU +
                      getValue(__VALUE, "", " = " + __VALUE);

    __LOG[hidden ? 5 : 4](__OPTIONS);

    if (hidden) {
        return Promise.resolve(__VALUE);
    } else {
        return Promise.resolve(GM.registerMenuCommand(__MENU, fun, key)).then(() => __MENU);
    }
}

// Zeigt den Eintrag im Menu einer Option
// opt: Config und Value der Option
// return Promise von GM.registerMenuCommand() (oder String-Version des Wertes)
function registerOption(opt) {
    const __CONFIG = getOptConfig(opt);
    const __VALUE = getOptValue(opt);
    const __LABEL = __CONFIG.Label;
    const __ACTION = opt.Action;
    const __HOTKEY = __CONFIG.Hotkey;
    const __HIDDEN = __CONFIG.HiddenMenu;
    const __SERIAL = __CONFIG.Serial;

    if (! __HIDDEN) {
        switch (__CONFIG.Type) {
        case __OPTTYPES.MC : return registerNextMenuOption(__VALUE, __CONFIG.Choice, __LABEL, __ACTION, __HOTKEY);
        case __OPTTYPES.SW : return registerMenuOption(__VALUE, __LABEL, __ACTION, __HOTKEY,
                                                       __CONFIG.AltLabel, __ACTION, __CONFIG.AltHotkey);
        case __OPTTYPES.TF : return registerMenuOption(__VALUE, __LABEL, __ACTION, __HOTKEY,
                                                       __CONFIG.AltLabel, opt.AltAction, __CONFIG.AltHotkey);
        case __OPTTYPES.SD : return registerDataOption(__VALUE, __LABEL, __ACTION, __HOTKEY, __HIDDEN, __SERIAL);
        case __OPTTYPES.SI : return registerDataOption(__VALUE, __LABEL, __ACTION, __HOTKEY, __HIDDEN, __SERIAL);
        default :            return Promise.resolve(__VALUE);
        }
    } else {
        // Nur Anzeige im Log...
        return registerDataOption(__VALUE, __LABEL, __ACTION, __HOTKEY, __HIDDEN, __SERIAL);
    }
}

// Baut das Benutzermenu auf (asynchron im Hintergrund)
// optSet: Gesetzte Optionen
// return Promise auf void
async function buildOptionMenu(optSet) {
    __LOG[4]("buildOptionMenu()");

    for (let opt in optSet) {
        await registerOption(optSet[opt]).then(
                result => __LOG[8](`REGISTEROPTION[${opt}] = ${result}`),
                defaultCatch);
    }
}

// ==================== Ende Abschnitt fuer das Benutzermenu ====================

// *** EOF ***

/*** Ende Modul util.option.menu.js ***/

/*** Modul util.option.page.label.js ***/

// ==UserModule==
// _name         util.option.page.label
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Node-Tooltips auf der Seite
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.sys.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.label.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Node-Tooltips auf der Seite ====================

// Hilfsfunktion: Wendet eine Konvertierung auf jede "Zeile" innerhalb eines Textes an
// text: Urspruenglicher Text
// convFun: function(line, index, arr): Konvertiert line in "Zeile" line des Arrays arr
// separator: Zeilentrenner im Text (Default: '\n')
// thisArg: optionaler this-Parameter fuer die Konvertierung
// limit: optionale Begrenzung der Zeilen
// return String mit dem neuen Text
function eachLine(text, convFun, separator = '\n', thisArg = undefined, limit = undefined) {
    const __ARR = text.split(separator, limit);
    const __RES = __ARR.map(convFun, thisArg);

    return __RES.join(separator);
}

// Hilfsfunktion: Ergaenzt einen HTML-Code um einen Titel (ToolTip)
// html: Urspruenglicher HTML-Code (z.B. ein HTML-Element oder Text)
// title: Im ToolTip angezeigter Text
// separator: Zeilentrenner im Text (Default: '|')
// limit: optionale Begrenzung der Zeilen
// return String mit dem neuen HTML-Code
function withTitle(html, title, separator = '|', limit = undefined) {
    if (title && title.length) {
        return eachLine(html, line => '<ABBR title="' + title + '">' + line + '</ABBR>', separator, undefined, limit);
    } else {
        return html;
    }
}

// Hilfsfunktion: Ermittelt einen Label- oder FormLabel-Eintrag (Default)
// label: Config-Eintrag fuer Label oder FormLabel
// defLabel: Ersatzwert, falls label nicht angegeben
// isSelect: Angabe, ob ein Parameter angezeigt wird (Default: false)
// isForm: Angabe, ob ein FormLabel gesucht ist (Default: true)
// return Vollstaendiger Label- oder FormLabel-Eintrag
function formatLabel(label, defLabel = undefined, isSelect = false, isForm = true) {
    const __LABEL = getValue(label, defLabel);

    if (isSelect && __LABEL && (substParam(__LABEL, '_') === __LABEL)) {
        return __LABEL + (isForm ? "|$" : " $");
    } else {
        return __LABEL;
    }
}

// ==================== Ende Abschnitt fuer Node-Tooltips auf der Seite ====================

// *** EOF ***

/*** Ende Modul util.option.page.label.js ***/

/*** Modul util.option.page.action.js ***/

// ==UserModule==
// _name         util.option.page.action
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Node-Tooltips auf der Seite
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.action.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Reaktionen der Node-Elemente auf der Seite ====================

// Liefert den Funktionsaufruf zur Option als String
// opt: Auszufuehrende Option
// isAlt: Angabe, ob AltAction statt Action gemeint ist
// value: Ggfs. zu setzender Wert
// serial: Serialization fuer String-Werte (Select, Textarea)
// memory: __OPTMEM.normal = unbegrenzt gespeichert (localStorage), __OPTMEM.begrenzt = bis Browserende gespeichert (sessionStorage), __OPTMEM.inaktiv
// return String mit dem (reinen) Funktionsaufruf
function getFormAction(opt, isAlt = false, value = undefined, serial = undefined, memory = undefined) {
    const __STORAGE = getMemory(memory);
    const __MEMORY = __STORAGE.Value;
    const __MEMSTR = __STORAGE.Display;
    const __RUNPREFIX = __STORAGE.Prefix;

    if (__MEMORY !== undefined) {
        const __RELOAD = "window.location.reload()";
        const __SETITEM = function(item, val, quotes = true) {
                              return (__MEMSTR + ".setItem(" + __LOG.info(__RUNPREFIX + item, false) + ',' + (quotes ? __LOG.info(val, false) : val) + "),");
                          };
        const __SETITEMS = function(cmd, key = undefined, val = undefined) {
                              return ('(' + __SETITEM('cmd', cmd) + ((key === undefined) ? "" :
                                      __SETITEM('key', key) + __SETITEM('val', val, false)) + __RELOAD + ')');
                          };
        const __CONFIG = getOptConfig(opt);
        const __SERIAL = getValue(serial, getValue(__CONFIG.Serial, false));
        const __THISVAL = ((__CONFIG.ValType === 'String') ? "'\\u0022' + this.value + '\\u0022'" : "this.value");
        const __TVALUE = getValue(__CONFIG.ValType, __THISVAL, "new " + __CONFIG.ValType + '(' + __THISVAL + ')');
        const __VALSTR = ((value !== undefined) ? safeStringify(value) : __SERIAL ? "JSON.stringify(" + __TVALUE + ')' : __TVALUE);
        const __ACTION = (isAlt ? getValue(__CONFIG.AltAction, __CONFIG.Action) : __CONFIG.Action);

        if (__ACTION !== undefined) {
            switch (__ACTION) {
            case __OPTACTION.SET : //return "doActionSet(" + __LOG.info(getOptName(opt), false) + ", " + getNextOpt(opt, __VALSTR) + ')';
                                   return __SETITEMS('SET', getOptName(opt), __VALSTR);
            case __OPTACTION.NXT : //return "doActionNxt(" + __LOG.info(getOptName(opt), false) + ", " + getNextOpt(opt, __VALSTR) + ')';
                                   return __SETITEMS('NXT', getOptName(opt), __VALSTR);
            case __OPTACTION.RST : //return "doActionRst()";
                                   return __SETITEMS('RST');
            default :              break;
            }
        }
    }

    return undefined;
}

// Liefert die Funktionsaufruf zur Option als String
// opt: Auszufuehrende Option
// isAlt: Angabe, ob AltAction statt Action gemeint ist
// value: Ggfs. zu setzender Wert
// type: Event-Typ fuer <INPUT>, z.B. "click" fuer "onclick="
// serial: Serialization fuer String-Werte (Select, Textarea)
// memory: __OPTMEM.normal = unbegrenzt gespeichert (localStorage), __OPTMEM.begrenzt = bis Browserende gespeichert (sessionStorage), __OPTMEM.inaktiv
// return String mit dem (reinen) Funktionsaufruf
function getFormActionEvent(opt, isAlt = false, value = undefined, type = 'click', serial = undefined, memory = undefined) {
    const __ACTION = getFormAction(opt, isAlt, value, serial, memory);

    return getValue(__ACTION, "", ' on' + type + '="' + __ACTION + '"');
}

// ==================== Ende Abschnitt fuer Reaktionen der Node-Elemente auf der Seite ====================

// *** EOF ***

/*** Ende Modul util.option.page.action.js ***/

/*** Modul util.option.page.node.js ***/

// ==UserModule==
// _name         util.option.page.node
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Node-Elementen in HTML auf der Seite
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.sys.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.label.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.action.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.node.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Node-Elemente auf der Seite ====================

// Zeigt eine Option auf der Seite als Auswahlbox an
// opt: Anzuzeigende Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// return String mit dem HTML-Code
function getOptionSelect(opt, defValue = undefined) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt, defValue);
    const __ACTION = getFormActionEvent(opt, false, undefined, 'change', undefined);
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel, __CONFIG.Label, true);
    const __TITLE = substParam(getValue(__CONFIG.Title, __CONFIG.Label), __VALUE);
    const __LABEL = '<LABEL for="' + __NAME + '">' + __FORMLABEL + '</LABEL>';
    let element = '<SELECT name="' + __NAME + '" id="' + __NAME + '"' + __ACTION + '>';

    if (__CONFIG.FreeValue && ! (~ __CONFIG.Choice.indexOf(__VALUE))) {
        element += '\n<OPTION value="' + __VALUE + '" SELECTED>' + __VALUE + '</OPTION>';
    }
    for (let value of __CONFIG.Choice) {
        element += '\n<OPTION value="' + value + '"' +
                   ((value === __VALUE) ? ' SELECTED' : "") +
                   '>' + value + '</OPTION>';
    }
    element += '\n</SELECT>';

    return withTitle(substParam(__LABEL, element), __TITLE);
}

// Zeigt eine Option auf der Seite als Radiobutton an
// opt: Anzuzeigende Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// return String mit dem HTML-Code
function getOptionRadio(opt, defValue = false) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt, defValue);
    const __ACTION = getFormActionEvent(opt, false, true, 'click', false);
    const __ALTACTION = getFormActionEvent(opt, true, false, 'click', false);
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel);  // nur nutzen, falls angegeben
    const __TITLE = getValue(__CONFIG.Title, '$');
    const __TITLEON = substParam(__TITLE, __CONFIG.Label);
    const __TITLEOFF = substParam(getValue(__CONFIG.AltTitle, __TITLE), __CONFIG.AltLabel);
    const __ELEMENTON  = '<INPUT type="radio" name="' + __NAME +
                         '" id="' + __NAME + 'ON" value="1"' +
                         (__VALUE ? ' CHECKED' : __ACTION) +
                         ' /><LABEL for="' + __NAME + 'ON">' +
                         __CONFIG.Label + '</LABEL>';
    const __ELEMENTOFF = '<INPUT type="radio" name="' + __NAME +
                         '" id="' + __NAME + 'OFF" value="0"' +
                         (__VALUE ? __ALTACTION : ' CHECKED') +
                         ' /><LABEL for="' + __NAME + 'OFF">' +
                         __CONFIG.AltLabel + '</LABEL>';
    const __ELEMENT = [
                          withTitle(__FORMLABEL, __VALUE ? __TITLEON : __TITLEOFF),
                          withTitle(__ELEMENTON, __TITLEON),
                          withTitle(__ELEMENTOFF, __TITLEOFF)
                      ];

    return ((__FORMLABEL && __FORMLABEL.length) ? __ELEMENT : __ELEMENT.slice(1, 3));
}

// Zeigt eine Option auf der Seite als Checkbox an
// opt: Anzuzeigende Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// return String mit dem HTML-Code
function getOptionCheckbox(opt, defValue = false) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt, defValue);
    const __ACTION = getFormActionEvent(opt, __VALUE, ! __VALUE, 'click', false);
    const __VALUELABEL = (__VALUE ? __CONFIG.Label : getValue(__CONFIG.AltLabel, __CONFIG.Label));
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel, __CONFIG.Label);
    const __TITLE = substParam(getValue(__VALUE ? __CONFIG.Title : getValue(__CONFIG.AltTitle, __CONFIG.Title), '$'), __VALUELABEL);

    return withTitle('<INPUT type="checkbox" name="' + __NAME +
                     '" id="' + __NAME + '" value="' + __VALUE + '"' +
                     (__VALUE ? ' CHECKED' : "") + __ACTION + ' /><LABEL for="' +
                     __NAME + '">' + __FORMLABEL + '</LABEL>', __TITLE);
}

// Zeigt eine Option auf der Seite als Daten-Textfeld an
// opt: Anzuzeigende Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// return String mit dem HTML-Code
function getOptionTextarea(opt, defValue = "") {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt, defValue);
    const __ACTION = getFormActionEvent(opt, false, undefined, 'submit', undefined);
    const __SUBMIT = getValue(__CONFIG.Submit, "");
    //const __ONSUBMIT = (__SUBMIT.length ? ' onKeyDown="' + __SUBMIT + '"': "");
    const __ONSUBMIT = (__SUBMIT ? ' onKeyDown="' + __SUBMIT + '"': "");
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel, __CONFIG.Label);
    const __TITLE = substParam(getValue(__CONFIG.Title, '$'), __FORMLABEL);
    const __ELEMENTLABEL = '<LABEL for="' + __NAME + '">' + __FORMLABEL + '</LABEL>';
    const __ELEMENTTEXT = '<TEXTAREA name="' + __NAME + '" id="' + __NAME + '" cols="' + __CONFIG.Cols +
                           '" rows="' + __CONFIG.Rows + '"' + __ONSUBMIT + __ACTION + '>' +
                           safeStringify(__VALUE, __CONFIG.Replace, __CONFIG.Space) + '</TEXTAREA>';

    return [ withTitle(__ELEMENTLABEL, __TITLE), __ELEMENTTEXT ];
}

// Zeigt eine Option auf der Seite als Button an
// opt: Anzuzeigende Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// return String mit dem HTML-Code
function getOptionButton(opt, defValue = false) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt, defValue);
    const __ACTION = getFormActionEvent(opt, __VALUE, ! __VALUE, 'click', false);
    const __BUTTONLABEL = (__VALUE ? getValue(__CONFIG.AltLabel, __CONFIG.Label) : __CONFIG.Label);
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel, __BUTTONLABEL);
    const __BUTTONTITLE = substParam(getValue(__VALUE ? getValue(__CONFIG.AltTitle, __CONFIG.Title) : __CONFIG.Title, '$'), __BUTTONLABEL);

    return '<LABEL for="' + __NAME + '">' + __FORMLABEL + '</LABEL>' +
           withTitle('<INPUT type="button" name="' + __NAME +
                     '" id="' + __NAME + '" value="' + __BUTTONLABEL +
                     '"' + __ACTION + '/>', __BUTTONTITLE);
}

// Zeigt eine Option auf der Seite an (je nach Typ)
// opt: Anzuzeigende Option
// return String mit dem HTML-Code
function getOptionElement(opt) {
    const __CONFIG = getOptConfig(opt);
    const __TYPE = getValue(__CONFIG.FormType, __CONFIG.Type);
    let element = "";

    if (! __CONFIG.Hidden) {
        switch (__TYPE) {
        case __OPTTYPES.MC : element = getOptionSelect(opt);
                             break;
        case __OPTTYPES.SW : if (__CONFIG.FormLabel !== undefined) {
                                 element = getOptionCheckbox(opt);
                             } else {
                                 element = getOptionRadio(opt);
                             }
                             break;
        case __OPTTYPES.TF : element = getOptionCheckbox(opt);
                             break;
        case __OPTTYPES.SD : element = getOptionTextarea(opt);
                             break;
        case __OPTTYPES.SI : element = getOptionButton(opt);
                             break;
        default :            break;
        }

        if ((typeof element) !== 'string') {
            element = '<DIV>' + Array.from(element).join('<BR />') + '</DIV>';
        }
    }

    return element;
}

// ==================== Ende Abschnitt fuer Node-Elemente auf der Seite ====================

// *** EOF ***

/*** Ende Modul util.option.page.node.js ***/

/*** Modul util.option.page.js ***/

// ==UserModule==
// _name         util.option.page
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Script-Optionen auf der Seite
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.prop.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.node.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Optionen auf der Seite ====================

// Gruppiert die Daten eines Objects nach einem Kriterium
// data: Object mit Daten
// byFun: function(val), die das Kriterium ermittelt. Default: value
// filterFun: function(key, index, arr), die das Kriterium key im Array arr an der Stelle index vergleicht. Default: Wert identisch
// sortFun: function(a, b), nach der die Kriterien sortiert werden. Default: Array.sort()
// return Neues Object mit Eintraegen der Form <Kriterium> : [ <alle Keys zu diesem Kriterium> ]
function groupData(data, byFun, filterFun, sortFun) {
    const __BYFUN = (byFun || sameValue);
    const __FILTERFUN = (filterFun || ((key, index, arr) => (arr[index] === key)));
    const __KEYS = Object.keys(data);
    const __VALS = Object.values(data);
    const __BYKEYS = __VALS.map(__BYFUN);
    const __BYKEYSET = new Set(__BYKEYS);
    const __BYKEYARRAY = [... __BYKEYSET];
    const __SORTEDKEYS = __BYKEYARRAY.sort(sortFun);
    const __GROUPEDKEYS = __SORTEDKEYS.map(byVal => __KEYS.filter((key, index) => {
                                                            UNUSED(key);
                                                            return __FILTERFUN(byVal, index, __BYKEYS);
                                                        }));
    const __ASSIGN = ((keyArr, valArr) => Object.assign({ }, ... keyArr.map((key, index) => ({ [key] : valArr[index] }))));

    return __ASSIGN(__SORTEDKEYS, __GROUPEDKEYS);
}

// Baut das Benutzermenu auf der Seite auf
// optSet: Gesetzte Optionen
// optParams: Eventuell notwendige Parameter
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// 'formWidth': Anzahl der Elemente pro Zeile
// 'formBreak': Elementnummer des ersten Zeilenumbruchs
// return String mit dem HTML-Code
function getOptionForm(optSet, optParams = { }) {
    const __FORM = '<FORM id="options" method="POST"><TABLE><TBODY><TR>';
    const __FORMEND = '</TR></TBODY></TABLE></FORM>';
    const __FORMWIDTH = getValue(optParams.formWidth, 3);
    const __FORMBREAK = getValue(optParams.formBreak, __FORMWIDTH);
    const __SHOWFORM = optSet.getOptValue('showForm', true) ? optParams.showForm : { 'showForm' : true };
    const __PRIOOPTS = groupData(optSet, opt => getOptConfig(opt).FormPrio);
    let form = __FORM;
    let count = 0;   // Bisher angezeigte Optionen
    let column = 0;  // Spalte der letzten Option (1-basierend)

    for (let optKeys of Object.values(__PRIOOPTS)) {
        for (let optKey of optKeys) {
            if (checkItem(optKey, __SHOWFORM, optParams.hideForm)) {
                const __ELEMENT = getOptionElement(optSet[optKey]);
                const __TDOPT = ((~ __ELEMENT.indexOf('|')) ? "" : ' colspan="2"');

                if (__ELEMENT) {
                    if (++count > __FORMBREAK) {
                        if (++column > __FORMWIDTH) {
                            column = 1;
                        }
                    }
                    if (column === 1) {
                        form += '</TR><TR>';
                    }
                    form += '\n<TD' + __TDOPT + '>' + __ELEMENT.replace('|', '</TD><TD>') + '</TD>';
                }
            }
        }
    }
    form += '\n' + __FORMEND;

    return form;
}

// Fuegt das Script fuer die Optionen in die Seite ein
// optSet: Gesetzte Optionen
// optParams: Eventuell notwendige Parameter
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// return String mit dem HTML-Code fuer das Script
function getOptionScript(optSet, optParams = { }) {
    UNUSED(optSet, optParams);

    //const __SCRIPT = '<SCRIPT type="text/javascript">function activateMenu() { console.log("TADAAA!"); }</SCRIPT>';
    //const __SCRIPT = '<SCRIPT type="text/javascript">\n\tfunction doActionNxt(key, value) { alert("SET " + key + " = " + value); }\n\tfunction doActionNxt(key, value) { alert("SET " + key + " = " + value); }\n\tfunction doActionRst(key, value) { alert("RESET"); }\n</SCRIPT>';
    //const __FORM = '<FORM method="POST"><input type="button" id="showOpts" name="showOpts" value="Optionen anzeigen" onclick="activateMenu()" /></FORM>';

    const __SCRIPT = "";

    //window.eval('function activateMenu() { console.log("TADAAA!"); }');

    return __SCRIPT;
}

// Informationen zu hinzugefuegten Forms
const __FORMS = { };

// Zeigt das Optionsmenu auf der Seite an (im Gegensatz zum Benutzermenu)
// anchor: Element, das als Anker fuer die Anzeige dient
// form: HTML-Form des Optionsmenu (hinten angefuegt)
// script: Script mit Reaktionen
function addOptionForm(anchor, form = "", script = "") {
    const __OLDFORM = __FORMS[anchor];
    const __REST = (__OLDFORM === undefined) ? anchor.innerHTML :
                   anchor.innerHTML.substring(0, anchor.innerHTML.length - __OLDFORM.Script.length - __OLDFORM.Form.length);

    __FORMS[anchor] = {
                          'Script' : script,
                          'Form'   : form
                      };

    anchor.innerHTML = __REST + script + form;
}

// Zeigt das Optionsmenu auf der Seite an (im Gegensatz zum Benutzermenu)
// anchor: Element, das als Anker fuer die Anzeige dient
// optSet: Gesetzte Optionen
// optParams: Eventuell notwendige Parameter
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// 'formWidth': Anzahl der Elemente pro Zeile
// 'formBreak': Elementnummer des ersten Zeilenumbruchs
function buildOptionForm(anchor, optSet, optParams = { }) {
    __LOG[4]("buildOptionForm()");

    const __FORM = getOptionForm(optSet, optParams);
    const __SCRIPT = getOptionScript(optSet, optParams);

    addOptionForm(anchor, __FORM, __SCRIPT);
}

// ==================== Ende Abschnitt fuer Optionen auf der Seite ====================

// *** EOF ***

/*** Ende Modul util.option.page.js ***/

/*** Modul util.option.run.js ***/

// ==UserModule==
// _name         util.option.run
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Aufbau und Start der Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.prop.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.path.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.db.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.cmd.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.menu.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.run.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Aufbau und Start der Optionen ====================

// Initialisiert die Menue-Funktion einer Option
// optAction: Typ der Funktion
// item: Key der Option
// optSet: Platz fuer die gesetzten Optionen (und Config)
// config: Konfiguration der Option
// return Funktion fuer die Option
function initOptAction(optAction, item = undefined, optSet = undefined, config = undefined) {
    let fun;

    if (optAction !== undefined) {
        const __CONFIG = ((config !== undefined) ? config : getOptConfig(getOptByName(optSet, item)));
        const __RELOAD = getValue(getValue(__CONFIG, { }).ActionReload, true);

        switch (optAction) {
        case __OPTACTION.SET  : fun = function() {
                                        return setOptByName(optSet, item, __CONFIG.SetValue, __RELOAD).catch(defaultCatch);
                                    };
                                break;
        case __OPTACTION.NXT  : fun = async function() {
                                        return new Promise(function(resolve, reject) {
                                                return promptNextOptByName(optSet, item, __CONFIG.SetValue, __RELOAD,
                                                    __CONFIG.FreeValue, __CONFIG.SelValue, __CONFIG.MinChoice, resolve, reject);
                                            }).catch(defaultCatch);
                                    };
                                break;
        case __OPTACTION.RST  : fun = function() {
                                        return resetOptions(optSet, __RELOAD).then(
                                                result => __LOG[4]("RESETTING (" + result + ")..."),
                                                defaultCatch);
                                    };
                                break;
        default :               break;
        }
    }

    return fun;
}

// Gibt diese Config oder, falls 'Shared', ein Referenz-Objekt mit gemeinsamen Daten zurueck
// config: Konfiguration der Option
// item: Key der Option
// return Entweder config oder gemergete Daten auf Basis des in 'Shared' angegebenen Objekts
function getSharedConfig(config, item = undefined) {
    let newConfig = getValue(config, { });
    const __SHARED = config.Shared;

    if (__SHARED !== undefined) {
        const __OBJREF = getSharedRef(__SHARED, item);  // Gemeinsame Daten

        if (getValue(__SHARED.item, '$') !== '$') {  // __OBJREF ist ein Item
            const __REF = valueOf(__OBJREF);

            newConfig = { };  // Neu aufbauen...
            addProps(newConfig, getOptConfig(__REF));
            addProps(newConfig, config);
            newConfig.setConst('SharedData', getOptValue(__REF), false);   // Wert muss schon da sein, NICHT nachladen, sonst ggfs. Promise
        } else {  // __OBJREF enthaelt die Daten selbst
            if (! newConfig.Name) {
                newConfig.Name = __OBJREF.getPath();
            }
            newConfig.setConst('SharedData', __OBJREF);  // Achtung: Ggfs. zirkulaer!
        }
    }

    return newConfig;
}

// Initialisiert die gesetzten Optionen. Man beachte:
// Diese Funktion wird erst mit preInit = true, dann mit preInit = false aufgerufen!
// optConfig: Konfiguration der Optionen
// optSet: Platz fuer die gesetzten Optionen
// preInit: Vorinitialisierung einzelner Optionen mit 'PreInit'-Attribut
// return Gefuelltes Objekt mit den gesetzten Optionen
function initOptions(optConfig, optSet = undefined, preInit = undefined) {
    const __OPTCONFIG = optConfig;  // Konfiguration wird in startOptions ueberprueft!

    if (optSet === undefined) {
        optSet = new Options();
    }

    for (let opt in optConfig) {
        const __CONFIG = optConfig[opt];
        const __PREINIT = getValue(__CONFIG.PreInit, false, true);
        const __ISSHARED = getValue(__CONFIG.Shared, false, true);

        if ((preInit === undefined) || (__PREINIT === preInit)) {
            const __SHAREDCONFIG = getSharedConfig(__CONFIG, opt);
            const __ALTACTION = getValue(__SHAREDCONFIG.AltAction, __SHAREDCONFIG.Action);
            // Gab es vorher einen Aufruf, der einen Stub-Eintrag erzeugt hat, und wurden Daten geladen?
            const __LOADED = ((preInit === false) && optSet[opt].Loaded);
            const __PROMISE = ((__LOADED || ! optSet[opt]) ? undefined : optSet[opt].Promise);
            const __VALUE = (__LOADED ? optSet[opt].Value : undefined);

            optSet[opt] = {
                'Item'      : opt,
                'Config'    : __SHAREDCONFIG,
                'Loaded'    : (__ISSHARED || __LOADED),
                'Promise'   : __PROMISE,
                'Value'     : initOptValue(__SHAREDCONFIG, __VALUE),
                'SetValue'  : __SHAREDCONFIG.SetValue,
                'ReadOnly'  : (__ISSHARED || __SHAREDCONFIG.ReadOnly),
                'Action'    : initOptAction(__SHAREDCONFIG.Action, opt, optSet, __SHAREDCONFIG),
                'AltAction' : initOptAction(__ALTACTION, opt, optSet, __SHAREDCONFIG)
            };
        } else if (preInit) {  // erstmal nur Stub
            optSet[opt] = {
                'Item'      : opt,
                'Config'    : __CONFIG,
                'Loaded'    : false,
                'Promise'   : undefined,
                'Value'     : initOptValue(__CONFIG),
                'ReadOnly'  : (__ISSHARED || __CONFIG.ReadOnly)
            };
        }
    }

    return optSet;
}

// ==================== Abschnitt fuer Klasse Classification ====================

// Basisklasse fuer eine Klassifikation der Optionen nach Kriterium (z.B. Erst- und Zweitteam oder Fremdteam)

/*class*/ function Classification /*{
    constructor*/(prefix) {
        'use strict';

        this.renameFun = prefixName;
        this.prefix = (prefix || 'old');
        this.optSet = undefined;
        this.optParams = undefined;
        this.optSelect = { };
    }
//}

Class.define(Classification, Object, {
                    'assign'          : function(optSet, optParams) {
                                            this.optSet = optSet;
                                            this.optParams = optParams;
                                        },
                    'renameOptions'   : function() {
                                            const __PARAM = this.renameParamFun();

                                            if (__PARAM !== undefined) {
                                                // Klassifizierte Optionen umbenennen...
                                                return renameOptions(this.optSet, this.optSelect, __PARAM, this.renameFun);
                                            } else {
                                                return Promise.resolve();
                                            }
                                        },
                    'saveOptions'     : function(ignList) {
                                            const __OPTSELECT = optSelect(this.optSelect, ignList);

                                            return saveOptions(this.optSet, __OPTSELECT);
                                        },
                    'deleteOptions'   : function(ignList) {
                                            const __OPTSELECT = optSelect(this.optSelectl, ignList);

                                            return deleteOptions(this.optSet, __OPTSELECT, true, true);
                                        },
                    'prefixParamFun'  : function() {
                                            // Parameter fuer 'prefixName': Prefix "old:"
                                            return ((this.prefix !== undefined) ? this.prefix + ':' : this.prefix);
                                        },
                    'renameParamFun'  : function() {
                                            // Parameter fuer 'renameFun': Default ist 'prefixName' ("old:")
                                            return this.prefixParamFun();
                                        }
                });

// Wandelt ein Array von Options-Schluesseln (props) in das optSelect-Format { 'key1' : true, 'key2' : true, ... }
// props: Array von Keys
// return Mapping mit Eintraegen, in denen die Keys auf true gesetzt sind: { 'key1' : true, 'key2' : true, ... }
function optSelectFromProps(props) {
    const __RET = { };

    if (props) {
        props.map(item => (__RET[item] = true));
    }

    return __RET;
}

// Errechnet aus einer Ausswahlliste und einer Ignore-Liste eine resultierende Liste im optSelect-Format
// selList: Mapping von auf true gesetzten Eintraegen (optSelect), die eine Grundmenge darstellen
// ignList: Mapping von auf true gesetzten Eintraegen (optSelect), die aus obiger Liste ausgetragen werden sollen
// return Resultierendes Mapping mit Eintraegen (optSelect), in denen die Keys auf true gesetzt sind: { 'key1' : true, 'key2' : true, ... }
function optSelect(selList, ignList) {
    const __PROPS = addProps([], selList, null, ignList);

    return optSelectFromProps(__PROPS);
}

// ==================== Ende Abschnitt fuer Klasse Classification ====================

// ==================== Abschnitt fuer Klasse ClassificationPair ====================

// Klasse fuer die Klassifikation der Optionen nach Team (Erst- und Zweitteam oder Fremdteam)

/*class*/ function ClassificationPair /*extends Classification {
    constructor*/(classA, classB) {
        'use strict';

        Classification.call(this);

        this.prefix = undefined;

        this.A = classA;
        this.B = classB;

        // Zugriff auf optSelect synchronisieren...
        Object.defineProperty(this, 'optSelect', {
                        get : function() {
                                  const __A = getValue(this.A, { });
                                  const __B = getValue(this.B, { });

                                  return (this.A ? __A.optSelect : __B.optSelect);
                              },
                        set : function(optSelect) {
                                  const __A = getValue(this.A, { });
                                  const __B = getValue(this.B, { });

                                  __A.optSelect = optSelect;
                                  __B.optSelect = optSelect;

                                  return optSelect;
                              }
                    });

        // Zugriff auf optSet synchronisieren...
        Object.defineProperty(this, 'optSet', {
                        get : function() {
                                  const __A = getValue(this.A, { });
                                  const __B = getValue(this.B, { });

                                  return (this.A ? __A.optSet : __B.optSet);
                              },
                        set : function(optSet) {
                                  const __A = getValue(this.A, { });
                                  const __B = getValue(this.B, { });

                                  __A.optSet = optSet;
                                  __B.optSet = optSet;

                                  return optSet;
                              }
                    });
    }
//}

Class.define(ClassificationPair, Classification, {
                    'assign'          : function(optSet, optParams) {
                                            (this.A && this.A.assign(optSet, optParams));
                                            (this.B && this.B.assign(optSet, optParams));
                                        },
                    'renameOptions'  : function() {
                                           return (this.A ? this.A.renameOptions() : Promise.resolve()).then(() =>
                                                   (this.B ? this.B.renameOptions() : Promise.resolve()));
                                       },
                    'saveOptions'    : function(ignList) {
                                           return (this.A ? this.A.saveOptions(ignList) : Promise.resolve()).then(() =>
                                                   (this.B ? this.B.saveOptions(ignList) : Promise.resolve()));
                                       },
                    'deleteOptions'  : function(ignList) {
                                           return (this.A ? this.A.deleteOptions(ignList) : Promise.resolve()).then(() =>
                                                   (this.B ? this.B.deleteOptions(ignList) : Promise.resolve()));
                                       }
                });

// ==================== Ende Abschnitt fuer Klasse ClassificationPair ====================

    // Abhaengigkeiten:
    // ================
    // initOptions (PreInit):
    // restoreMemoryByOpt: PreInit oldStorage
    // getStoredCmds: restoreMemoryByOpt
    // runStoredCmds (beforeLoad): getStoredCmds
    // loadOptions (PreInit): PreInit
    // startMemoryByOpt: storage oldStorage
    // initScriptDB: startMemoryByOpt
    // initOptions (Rest): PreInit
    // getMyTeam callback (getOptPrefix): initTeam
    // __MYTEAM (initTeam): initOptions
    // renameOptions: getOptPrefix
    // runStoredCmds (afterLoad): getStoredCmds, renameOptions
    // loadOptions (Rest): PreInit/Rest runStoredCmds
    // updateScriptDB: startMemoryByOpt
    // showOptions: startMemoryByOpt renameOptions
    // buildOptionMenu: showOptions
    // buildOptionForm: showOptions

// Initialisiert die gesetzten Optionen und den Speicher und laedt die Optionen zum Start
// optConfig: Konfiguration der Optionen
// optSet: Platz fuer die gesetzten Optionen
// return Promise auf gefuelltes Objekt mit den gesetzten Optionen
async function startOptions(optConfig, optSet = undefined, classification = undefined) {
    // Ueberpruefung der uebergebenen Konfiguration der Optionen...
    const __OPTCONFIG = checkOptConfig(optConfig, true);
    const __PREOPTSET = initOptions(__OPTCONFIG, optSet, true);  // PreInit

    // Memory Storage fuer vorherige Speicherung...
    myOptMemSize = getMemSize(myOptMem = await restoreMemoryByOpt(__PREOPTSET.oldStorage));

    // Zwischengespeicherte Befehle auslesen...
    const __STOREDCMDS = getStoredCmds(myOptMem);

    // ... ermittelte Befehle ausfuehren...
    const __LOADEDCMDS = await runStoredCmds(__STOREDCMDS, __PREOPTSET, true);  // BeforeLoad

    // Bisher noch nicht geladenene Optionen laden...
    await loadOptions(__PREOPTSET);

    // Memory Storage fuer naechste Speicherung...
    myOptMemSize = getMemSize(myOptMem = startMemoryByOpt(__PREOPTSET.storage, __PREOPTSET.oldStorage));

    // Globale Daten ermitteln...
    initScriptDB(__PREOPTSET);

    const __OPTSET = initOptions(__OPTCONFIG, __PREOPTSET, false);  // Rest

    if (classification !== undefined) {
        // Umbenennungen durchfuehren...
        await classification.renameOptions();
    }

    // ... ermittelte Befehle ausfuehren...
    await runStoredCmds(__LOADEDCMDS, __OPTSET, false);  // Rest

    // Als globale Daten speichern...
    updateScriptDB(__OPTSET);

    return __OPTSET;
}

// ==================== Abschnitt Anzeige der Optionen ====================

// Installiert die Visualisierung und Steuerung der Optionen
// optSet: Platz fuer die gesetzten Optionen
// optParams: Eventuell notwendige Parameter zur Initialisierung
// 'hideMenu': Optionen werden zwar geladen und genutzt, tauchen aber nicht im Benutzermenu auf
// 'menuAnchor': Startpunkt fuer das Optionsmenu auf der Seite
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// 'formWidth': Anzahl der Elemente pro Zeile
// 'formBreak': Elementnummer des ersten Zeilenumbruchs
// return Liefert die gesetzten Optionen zurueck
function showOptions(optSet = undefined, optParams = { 'hideMenu' : false }) {
    // Anzeige im Benutzermenue...
    if (! optParams.hideMenu) {
        buildOptionMenu(optSet).then(() => __LOG[4]("Menu OK"));
    }

    // Anzeige auf der Seite...
    if ((optParams.menuAnchor !== undefined) && (myOptMem !== __OPTMEMINACTIVE)) {
        buildOptionForm(optParams.menuAnchor, optSet, optParams);
    }

    return optSet;
}

// ==================== Ende Abschnitt fuer Aufbau und Start der Optionen ====================

// *** EOF ***

/*** Ende Modul util.option.run.js ***/

/*** Modul util.main.js ***/

// ==UserModule==
// _name         util.main
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017/2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer das Hauptprogramm zur jeweiligen Seite
// _require      https://eselce.github.io/OS2.scripts/lib/util.main.js
// ==/UserModule==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Aufbau und Start des Hauptprogramms ====================

// ==================== Abschnitt fuer Klasse Main ====================

/*class*/ function Main /*{
    constructor*/(optConfig, mainConfig, ... pageManager) {
        const __MAINCONFIG = (mainConfig || { });

        this.optConfig      = optConfig;
        this.optSet         = new Options(this.optConfig, '__OPTSET');
        this.setupManager   = __MAINCONFIG.setupManager;
        this.checkOptParams = __MAINCONFIG.checkOptParams;
        this.prepareOpt     = __MAINCONFIG.prepareOpt;
        this.verifyOpt      = __MAINCONFIG.verifyOpt;
        this.pageManager    = pageManager;
    }
//}

Class.define(Main, Object, {
        'handlePage'  : async function(page) {
                            // Fuehrt die Bearbeitung einer speziellen Seite durch
                            // page: ID fuer die aktuelle Seite
                            // return Promise auf die Durchfuehrung der Bearbeitung
                            const __SETUPMANAGER    = (this.setupManager || (page => this.pageManager[page]));
                            const __MANAGER         = getValue(__SETUPMANAGER.call(this, page), { name : "Seite #" + page, params : [] });
                            const __SETUPOPTPARAMS  = (__MANAGER.setupOptParams || (() => ({ 'hideMenu' : false })));
                            const __OPTPARAMS       = __SETUPOPTPARAMS.call(__MANAGER, this.optSet, ... __MANAGER.params);
                            const __CHECKOPTPARAMS  = (this.checkOptParams || (optParams => !! optParams));

                            if (__CHECKOPTPARAMS(__OPTPARAMS, __MANAGER)) {
                                const __CLASSIFICATION  = (__MANAGER.classification || (new Classification()));
                                const __HANDLER         = __MANAGER.handler;

                                if (! __HANDLER) {
                                    return Promise.reject(`Kein Seiten-Handler f\u00FCr '${__MANAGER.name}' vorhanden!`);
                                }

                                __LOG._(2)(`${__DBMOD.Name}: Starte Seiten-Verarbeitung f\u00FCr '${__MANAGER.name}'...`);

                                // Klassifikation verknuepfen...
                                __CLASSIFICATION.assign(this.optSet, __OPTPARAMS);

                                // Parameter im Handler verfuegbar machen...
                                __MANAGER.classification = __CLASSIFICATION;
                                __MANAGER.optParams = __OPTPARAMS;

                                return await startOptions(this.optConfig, this.optSet, __CLASSIFICATION).then(
                                        async optSet => {
                                                const __PREPAREOPT  = (__OPTPARAMS.prepareOpt || this.prepareOpt || sameValue);
                                                const __VERIFYOPT   = (__OPTPARAMS.verifyOpt || this.verifyOpt || checkOptSet);

                                                return await Promise.resolve(__PREPAREOPT(optSet, __OPTPARAMS)).then(
                                                                            optSet => Promise.resolve(showOptions(optSet, __OPTPARAMS)).then(
                                                                            optSet => __VERIFYOPT(optSet, __OPTPARAMS)));
                                            }).then(optSet => __HANDLER.call(__MANAGER, optSet, ... __MANAGER.params)).then(
                                                                            ret => ((ret ? 'OK' : 'FAILED') + ' ' + __MANAGER.name));
                            } else {
                                return Promise.reject(`Keine Options-Parameter f\u00FCr Seite '${__MANAGER.name}' vorhanden!`);
                            }
                        },
        'run'         : async function(selector, ... selectorParams) {
                            // Fuehrt die Bearbeitung zu einer selektierten Seite durch
                            // selector: Funktion zur Selektion aufgrund der als erstem Parameter uebergebenen URL der Seite
                            // selectorParams: Weitere Parameter fuer selector(URL, ...)
                            // return Promise auf die Durchfuehrung der Bearbeitung im Hauptprogramm
                            return await startMain().then(
                                    async () => {
                                            try {
                                                const __SELECTOR = (selector || (() => 0));
                                                const __SELECTORPARAMS = selectorParams;
                                                const __PAGE = __SELECTOR(window.location.href, ... __SELECTORPARAMS);

                                                return this.handlePage(__PAGE).catch(defaultCatch);
                                            } catch (ex) {
                                                return defaultCatch(ex);
                                            }
                                        }).then(rc => {
                                                const __RC = rc;

                                                __LOG[2](String(this.optSet));
                                                __LOG._(1)('SCRIPT END', __DBMOD.Name, '(' + __RC + ')', '/', __DBMAN.Name);

                                                return Promise.resolve(__RC);
                                            }, ex => {
                                                const __ERRMSG = (ex && getValue(ex[0], ex.message,
                                                            ((typeof ex) === 'string') ? ex : (ex[0] + ": " + ex[1])));

                                                __LOG._(1)('SCRIPT ERROR', __DBMOD.Name, '(' + __ERRMSG + ')');
                                                __LOG[2](String(this.optSet));
                                                __LOG._(1)('SCRIPT END', __DBMAN.Name);

                                                return Promise.reject(__ERRMSG);
                                            });
                        }
    });

// ==================== Ende Abschnitt fuer Klasse Main ====================

// ==================== Abschnitt fuer Klasse PageManager ====================

/*class*/ function PageManager /*{
    constructor*/(pageName, classification, setupOptParams, pageHandler, ... params) {
        this.name           = pageName;
        this.classification = classification;
        this.setupOptParams = setupOptParams;
        this.handler        = pageHandler;
        this.params         = (params || []);
    }
//}

Class.define(PageManager, Object, {
        'clone'       : function(... params) {
                            const __PARAMS = this.params.concat(params || []);

                            return new PageManager(this.name + " (" + params.join(", ") + ')',
                                                    this.classification, this.setupOptParams,
                                                    this.handler, ... __PARAMS);
                        }
    });

// ==================== Ende Abschnitt fuer Klasse PageManager ====================

// ==================== Ende Abschnitt fuer Aufbau und Start des Hauptprogramms ====================

// *** EOF ***

/*** Ende Modul util.main.js ***/

