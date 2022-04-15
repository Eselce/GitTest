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

// Notwendigkeit der Item-Typen der Konfiguration der Optionen (__OPTCONFIG)
const __OPTNEED = {
    'MAN'   : "mandatory parameter",        // Muss-Parameter, darf nicht fehlen!
    'DAT'   : "mandatory data parameter",   // Muss-Parameter fuer Datentypen __OPTTYPES.SD und __OPTTYPES.MC
    'REC'   : "recommended parameter",      // Soll-Parameter: Nutzung dieser Parameter wird empfohlen
    'VAL'   : "recommended parameter",      // Soll-Parameter fuer Datentypen __OPTTYPES.SD und __OPTTYPES.MC
    'SEL'   : "recommended parameter",      // Soll-Parameter fuer Datentyp __OPTTYPES.MC
    'OPT'   : "optional parameter",         // Optionale Parameter ohne Pficht
    'INT'   : "internal parameter"          // Nicht in __OPTCONFIG verwenden!
};

// Abgeleitete Typen gemappt auf Haupttypen...
const __OPTITEMTYPES = {
    'Array'     : 'Object', // Array.isArray()
    'Char'      : 'String', // String.length === 1
    'Code'      : 'String', // TODO Code-Schutz
    'Integer'   : 'Number', // Number.isInteger()
};

// Item-Typen der Konfiguration der Optionen (__OPTCONFIG)
const __OPTITEMS = {
    'Action'    : [ "Aktions-Typ bei Optionswechsel",   '__OPTACTION',  "NXT, RST, SET",            __OPTNEED.MAN ],
    'AltAction' : [ "Alt Aktions-Typ (abweichend)",     '__OPTACTION',  "NXT, RST, SET",            __OPTNEED.OPT ],
    'AltHotkey' : [ "Alt Schnellanwahl im Men\u00FC",   'Char',         "'A'",                      __OPTNEED.REC ],
    'AltLabel'  : [ "Alt Options-Ausgabename",          'String',       "Option aus: $",            __OPTNEED.MAN ],
    'AltTitle'  : [ "Alt Titel",                        'String',       "$V schlie\u00DFen",        __OPTNEED.OPT ],
    'AutoReset' : [ "Beim Laden immer auf Default",     'Boolean',      "false, true",              __OPTNEED.OPT ],
    'Choice'    : [ "Auswahlliste der Optionswerte",    'Array',        "[ 0, 1, 2, 3, 4 ]",        __OPTNEED.REC ],
    'Cols'      : [ "Ausgabebreite in Textfenster",     'Integer',      "1, 3, 20, 25, 36",         __OPTNEED.REC ],
    'Config'    : [ "INTERNAL: Verweis auf optConfig",  'Object',       "{ }",                      __OPTNEED.INT ],
    'Default'   : [ "Startwert der Option",             'any',          "1, true, '', [], { }",     __OPTNEED.REC ],
    'FormLabel' : [ "Options-Ausgabe auf Seite",        'String',       "Option:|$",                __OPTNEED.MAN ],
    'FormPrio'  : [ "Steuert die Reihenfolge",          'Integer',      "undefined, 1",             __OPTNEED.OPT ],
    'FormType'  : [ "Typ der Option auf Seite",         '__OPTTYPES',   "SI",                       __OPTNEED.OPT ],
    'FreeValue' : [ "Freitext m\u00F6glich",            'Boolean',      "false, true",              __OPTNEED.VAL ],
    'Hidden'    : [ "Versteckte Option auf Seite",      'Boolean',      "false, true",              __OPTNEED.REC ],
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
    'Serial'    : [ "Speicherung per serialize()",      'Boolean',      "true",                     __OPTNEED.REC ],
    'Shared'    : [ "Objektreferenz auf Option",        'Object',       "{ 'namespace' : 'http://os.ongapo.com/', 'module' : 'OS2.haupt', 'item' : '$' }",
                                                                                                    __OPTNEED.OPT ],
    'SharedData': [ "INTERNAL: Daten Objektreferenz",   'Object',       "",                         __OPTNEED.INT ],
    'Space'     : [ "Ausgabe-Spaces bei Listen",        'Integer',      "0, 1, 4",                  __OPTNEED.OPT ],
    'Submit'    : [ "onKeyDown-Code",                   'Code',         "",                         __OPTNEED.OPT ],
    'Title'     : [ "Titel",                            'String',       "$V Optionen",              __OPTNEED.OPT ],
    'Type'      : [ "Typ der Option",                   '__OPTTYPES',   "MC, SD, SI, SW",           __OPTNEED.REC ],
    'ValType'   : [ "Datentyp der Werte",               'String',       "'Number', 'String'",       __OPTNEED.DAT ],
    'Value'     : [ "INTERNAL: Gesetzter Wert",         'any',          "",                         __OPTNEED.INT ]
};
const __OPTITEMSBYNEED = reverseMapping(__OPTITEMS, mappingPush);

// ==================== Ende Abschnitt Moegliche Typen fuer Optionen ====================

// *** EOF ***
