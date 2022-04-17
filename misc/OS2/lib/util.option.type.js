// ==UserScript==
// _name         util.option.type
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit den Konfigurations-Typen fuer Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// ==/UserScript==

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
    'HiddenMenu': [ "INTERNAL: Kein Kontextmen\u00FC",  'Boolean',      "false, true",              __OPTNEED.INT ],
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
    'ValType'   : [ "Datentyp der Werte",               'String',       "'Number', 'String'",       __OPTNEED.CHO ],
    'Value'     : [ "INTERNAL: Gesetzter Wert",         'any',          "",                         __OPTNEED.INT ]
};
const __OPTITEMSBYNEED = selectMapping(__OPTITEMS, __COLOPTITEMS.NEED, -1, mappingPush);

// ==================== Ende Abschnitt Moegliche Typen fuer Optionen ====================

// *** EOF ***
