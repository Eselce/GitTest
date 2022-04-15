// ==UserScript==
// _name         util.option.data
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Zugriff auf die Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.sys.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// ==/UserScript==

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
    const __MAN = getValue(__OPTITEMSBYNEED[__OPTNEED.MAN], []);    // Muss-Parameter
    const __DAT = getValue(__OPTITEMSBYNEED[__OPTNEED.DAT], []);    // Muss-Parameter fuer __OPTTYPES.MC und __OPTTYPES.SD
    const __CHO = getValue(__OPTITEMSBYNEED[__OPTNEED.CHO], []);    // Muss-Parameter fuer __OPTTYPES.MC
    const __REC = getValue(__OPTITEMSBYNEED[__OPTNEED.REC], []);    // Soll-Parameter
    const __VAL = getValue(__OPTITEMSBYNEED[__OPTNEED.VAL], []);    // Soll-Parameter fuer __OPTTYPES.MC und __OPTTYPES.SD
    const __SEL = getValue(__OPTITEMSBYNEED[__OPTNEED.SEL], []);    // Soll-Parameter fuer __OPTTYPES.MC

    if (! __ISSHARED) {  // TODO Shared Ref
        // Redundante Pruefung auf Namen der Option (spaeter Ueberpruefung von __MAN)...
        if (__NAME === undefined) {
            __LOG[1]("checkOptItem(): Error in " + codeLine(true, true, true, false));
            throw Error("Unknown 'Name' for option " + __LOG.info(__KEY, false));
        }

        // Ueberpruefung der Pflichtparameter...
        __MAN.forEach(item => {
                const __ITEM = __CONFIG[item];

                if (! __ITEM) {
                    __LOG[1]("checkOptItem(): Error in " + codeLine(true, true, true, false));
                    throw Error("Option " + __LOG.info(__KEY, false) + " is missing mandatory parameter " + __LOG.info(item, false) + "...");
                }
            });
        __DAT.forEach(item => {
                const __ITEM = __CONFIG[item];

                if ((! __ITEM) && ((__OPTTYPE === __OPTTYPES.MC) || (__OPTTYPE === __OPTTYPES.SD))) {
                    __LOG[1]("checkOptItem(): Error in " + codeLine(true, true, true, false));
                    throw Error("Option " + __LOG.info(__KEY, false) + " is missing mandatory data parameter " + __LOG.info(item, false) + "...");
                }
            });
        __DAT.forEach(item => {
                const __ITEM = __CONFIG[item];

                if ((! __ITEM) && (__OPTTYPE === __OPTTYPES.MC)) {
                    __LOG[1]("checkOptItem(): Error in " + codeLine(true, true, true, false));
                    throw Error("Option " + __LOG.info(__KEY, false) + " is missing mandatory select parameter " + __LOG.info(item, false) + "...");
                }
            });

        // Ueberpruefung der Pflichtparameter...
        __REC.forEach(item => {
                const __ITEM = __CONFIG[item];

                if (! __ITEM) {
                    __LOG[2]("checkOptItem(): Option " + __LOG.info(__KEY, false) + " is missing recommended parameter " + __LOG.info(item, false) + "...");
                }
            });
        __VAL.forEach(item => {
                const __ITEM = __CONFIG[item];

                if ((! __ITEM) && ((__OPTTYPE === __OPTTYPES.MC) || (__OPTTYPE === __OPTTYPES.SD))) {
                    __LOG[2]("checkOptItem(): Option " + __LOG.info(__KEY, false) + " is missing recommended data parameter " + __LOG.info(item, false) + "...");
                }
            });
        __SEL.forEach(item => {
                const __ITEM = __CONFIG[item];

                if ((! __ITEM) && (__OPTTYPE === __OPTTYPES.MC)) {
                    __LOG[2]("checkOptItem(): Option " + __LOG.info(__KEY, false) + " is missing recommended select parameter " + __LOG.info(item, false) + "...");
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
            const __TYPE = (__OPTITEMTYPES[__ITEMTYPE] || __ITEMTYPE);
            let isValid = true;

            if (! __ITEMINFO) {
                __LOG[1]("checkOptItem(): Error in " + codeLine(true, true, true, false));
                throw Error("Unknown parameter " + __LOG.info(item, false) + " for option " + __LOG.info(__KEY, false));
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

    if (! opt.validOption) {
        if (((typeof __NAME) !== 'undefined') && __NAME.length && ((typeof __CONFIG) === 'object')) {
            opt.validOption = true;
        } else {
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
    Object.entries(optSet).forEach(([item, opt]) => checkOpt(opt, item));

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
    __ENTRIES.forEach(([item, config]) => checkOptItem(config, item, preInit));

    // Benutzte (interne Speicher-) Namen auf doppelte Eintraege ueberpruefen...
    __ENTRIES.forEach(([key, config]) => {
            const __KEY = key;
            const __NAME = config.Name;  // Muss vorhanden sein, da vorher ueberprueft!
            const __USED = __NAMEUSE[__NAME];

            if (__USED) {
                __LOG[1]("checkOpt(): Error in " + codeLine(true, true, true, false));
                throw RangeError("Internal name of option " + __LOG.info(__KEY, false) + " already used in option " + __LOG.info(__USED, false));
            } else {
                __NAMEUSE[__NAME] = item;
            }
        });

    __LOG[2](Object.keys(__OPTCONFIG).length + " Optionen erfolgreich \u00FCberpr\u00FCft...");

    return __OPTCONFIG;
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
    const __STRICT = true;
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

    const __VALUE = getOptValue(opt, value);

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
