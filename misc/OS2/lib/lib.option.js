

/*** Modul util.option.type.js ***/

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

// Options-Typen
const __OPTACTION = {
    'SET' : "set option value",
    'NXT' : "set next option value",
    'RST' : "reset options"
};

// ==================== Ende Abschnitt Moegliche Typen fuer Optionen ====================

// *** EOF ***

/*** Ende util.option.type.js ***/

/*** Modul util.option.data.js ***/

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

    for (let stage in __PROPS) {
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
    if ((optSet !== undefined) && (item !== undefined)) {
        return getOpt(optSet[item], defOpt);
    } else {
        return defOpt;
    }
}

// Gibt die Konfigurationsdaten einer Option zurueck
// opt: Config und Value der Option
// defConfig: Rueckgabewert, falls Config nicht zu finden
// return Konfigurationsdaten der Option
function getOptConfig(opt, defConfig = { }) {
    return getValue(getOpt(opt).Config, defConfig);
}

// Setzt den Namen einer Option
// opt: Config und Value der Option
// name: Zu setzender Name der Option
// reload: Seite mit neuem Wert neu laden
// return Gesetzter Name der Option
function setOptName(opt, name) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);

    if (__NAME !== name) {
        __LOG[5]("RENAME " + __NAME + " => " + name);

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

        if (__SHARED && ! opt.Loaded) {
            const __OBJREF = getSharedRef(__SHARED, opt.Item);

            return __OBJREF.getPath();
        }

        showAlert("Error", "Option ohne Namen", safeStringify(__CONFIG));
    }

    return __NAME;
}

// Setzt den Wert einer Option
// opt: Config und Value der Option
// name: Zu setzender Wert der Option
// return Gesetzter Wert
function setOptValue(opt, value) {
    if (opt !== undefined) {
        if (! opt.ReadOnly) {
            __LOG[8](getOptName(opt) + ": " + __LOG.changed(opt.Value, value));

            opt.Value = value;
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
    let value;

    if (opt && opt.Loaded) {
        value = getValue(opt.Value, defValue);
    }

    return valueOf(value);
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
    return setOptValue(opt, setStored(getOptName(opt), value, reload, getOptConfig(opt).Serial, onFulfilled, onRejected));
}

// Ermittelt die naechste moegliche Option
// opt: Config und Value der Option
// value: Ggfs. zu setzender Wert
// return Zu setzender Wert
function getNextOpt(opt, value = undefined) {
    const __CONFIG = getOptConfig(opt);
    const __VALUE = getOptValue(opt, value);

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
// value: Default fuer ggfs. zu setzenden Wert
// reload: Seite mit neuem Wert neu laden
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function setNextOpt(opt, value = undefined, reload = false, onFulfilled = undefined, onRejected = undefined) {
    return setOpt(opt, getNextOpt(opt, value), reload, onFulfilled, onRejected);
}

// Setzt die naechste moegliche Option oder fragt ab einer gewissen Anzahl interaktiv ab
// opt: Config und Value der Option
// value: Default fuer ggfs. zu setzenden Wert
// reload: Seite mit neuem Wert neu laden
// freeValue: Angabe, ob Freitext zugelassen ist (Default: false)
// minChoice: Ab wievielen Auswahlmoeglichkeiten soll abgefragt werden? (Default: 3)
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function promptNextOpt(opt, value = undefined, reload = false, freeValue = false, selValue = true, minChoice = 3, onFulfilled = undefined, onRejected = undefined) {
    const __CONFIG = getOptConfig(opt);
    const __CHOICE = __CONFIG.Choice;

    if (value || (! __CHOICE) || (__CHOICE.length < minChoice)) {
        return setNextOpt(opt, value, reload, onFulfilled, onRejected);
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
                if (nextVal) {
                    return setOpt(opt, nextVal, reload, onFulfilled, onRejected);
                }

                const __LABEL = substParam(__CONFIG.Label, __VALUE);

                showAlert(__LABEL, "Ung\xFCltige Eingabe: " + __ANSWER);
            }
        }
    } catch (ex) {
        __LOG[1]("promptNextOpt: " + ex.message);
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
    const __OPT = getOptByName(optSet, item);

    return setOpt(__OPT, value, reload, onFulfilled, onRejected);
}

// Ermittelt die naechste moegliche Option (Version mit Key)
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// value: Default fuer ggfs. zu setzenden Wert
// return Zu setzender Wert
function getNextOptByName(optSet, item, value = undefined) {
    const __OPT = getOptByName(optSet, item);

    return getNextOpt(__OPT, value);
}

// Setzt die naechste moegliche Option (Version mit Key)
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// value: Default fuer ggfs. zu setzenden Wert
// reload: Seite mit neuem Wert neu laden
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function setNextOptByName(optSet, item, value = undefined, reload = false, onFulfilled = undefined, onRejected = undefined) {
    const __OPT = getOptByName(optSet, item);

    return setNextOpt(__OPT, value, reload, onFulfilled, onRejected);
}

// Setzt die naechste moegliche Option oder fragt ab einer gewissen Anzahl interaktiv ab (Version mit Key)
// optSet: Platz fuer die gesetzten Optionen (und Config)
// item: Key der Option
// value: Default fuer ggfs. zu setzenden Wert
// reload: Seite mit neuem Wert neu laden
// freeValue: Angabe, ob Freitext zugelassen ist (Default: false)
// minChoice: Ab wievielen Auswahlmoeglichkeiten soll abgefragt werden? (Default: 3)
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gesetzter Wert
function promptNextOptByName(optSet, item, value = undefined, reload = false, freeValue = false, selValue = true, minChoice = 3, onFulfilled = undefined, onRejected = undefined) {
    const __OPT = getOptByName(optSet, item);

    return promptNextOpt(__OPT, value, reload, freeValue, selValue, minChoice, onFulfilled, onRejected);
}

// ==================== Ende Abschnitt fuer Zugriff auf die Optionen ====================

// *** EOF ***

/*** Ende util.option.data.js ***/

/*** Modul util.option.api.js ***/

// ==UserScript==
// _name         util.option.api
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Zugriff auf die Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.object.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt Operationen auf Optionen ====================

// Invalidiert eine (ueber Menu) gesetzte Option
// opt: Zu invalidierende Option
// force: Invalidiert auch Optionen mit 'AutoReset'-Attribut
// return Promise auf resultierenden Wert
function invalidateOpt(opt, force = false) {
    return Promise.resolve(opt.Promise).then(value => {
            if (opt.Loaded && ! opt.ReadOnly) {
                const __CONFIG = getOptConfig(opt);

                // Wert "ungeladen"...
                opt.Loaded = (force || ! __CONFIG.AutoReset);

                if (opt.Loaded && __CONFIG.AutoReset) {
                    // Nur zuruecksetzen, gilt als geladen...
                    setOptValue(opt, initOptValue(__CONFIG));
                }
            }

            return getOptValue(opt);
        }, defaultCatch);
}

// Invalidiert die (ueber Menu) gesetzten Optionen
// optSet: Object mit den Optionen
// force: Invalidiert auch Optionen mit 'AutoReset'-Attribut
// return Promise auf Object mit den geladenen Optionen
async function invalidateOpts(optSet, force = false) {
    for (let opt in optSet) {
        const __OPT = optSet[opt];

        await invalidateOpt(__OPT, force);
    }

    return optSet;
}

// Laedt eine (ueber Menu) gesetzte Option
// opt: Zu ladende Option
// force: Laedt auch Optionen mit 'AutoReset'-Attribut
// return Promise auf gesetzten Wert der gelandenen Option
function loadOption(opt, force = false) {
    if (! opt.Promise) {
        const __CONFIG = getOptConfig(opt);
        const __ISSHARED = getValue(__CONFIG.Shared, false, true);
        const __NAME = getOptName(opt);
        const __DEFAULT = getOptValue(opt, undefined);
        let value;

        if (opt.Loaded && ! __ISSHARED) {
            const __ERROR = "Error: Oprion '" + __NAME + "' bereits geladen!";

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
                            GM.getValue(__NAME, __DEFAULT));
        }

        opt.Promise = Promise.resolve(value).then(value => {
                // Paranoide Sicherheitsabfrage (das sollte nie passieren!)...
                if (opt.Loaded || ! opt.Promise) {
                    showAlert("Error", "Unerwarteter Widerspruch zwischen opt.Loaded und opt.Promise", safeStringify(opt));
                }
                __LOG[6]("LOAD " + __NAME + ": " + __LOG.changed(__DEFAULT, value));

                // Wert intern setzen...
                const __VAL = setOptValue(opt, value);

                // Wert als geladen markieren...
                opt.Promise = undefined;
                opt.Loaded = true;

                return __VAL;
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

        if (! __OPT.Loaded) {
            const __PROMISE = loadOption(__OPT, force).then(value => {
                    __LOG[6]("LOADED " + opt + " << " + value);

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
    const __CONFIG = getOptConfig(opt);

    if (force || ! __CONFIG.Permanent) {
        const __NAME = getOptName(opt);

        __LOG[5]("DELETE " + __NAME);

        return GM.deleteValue(__NAME).then(voidValue => {
                if (reset || __CONFIG.AutoReset) {
                    setOptValue(opt, initOptValue(__CONFIG));
                }
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

// Benennt eine Option um und laedt sie ggfs. nach
// opt: Gesetzte Option
// name: Neu zu setzender Name (Speicheradresse)
// reload: Wert nachladen statt beizubehalten
// force: Laedt auch Optionen mit 'AutoReset'-Attribut
// return Promise auf umbenannte Option
async function renameOption(opt, name, reload = false, force = false) {
    const __NAME = getOptName(opt);

    if (__NAME !== name) {
        await deleteOption(opt, true, ! reload);

        setOptName(opt, name);

        await invalidateOpt(opt, opt.Loaded);

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
            __LOG[1]("RENAME: Option '" + opt + "' nicht gefunden!");
        } else {
            const __NAME = getOptName(__OPT);
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

    if (asyncLoad) {
        if (! opt) {
            return Promise.reject("loadOptValue: Option ist undefined");
        } else {
            let promise = (opt.Loaded ? Promise.resolve(opt.Value) : opt.Promise);

            if (! promise) {
                promise = loadOption(opt, force);
            }

            return promise.then(value => valueOf(getValue(value, defValue)));
        }
    } else {
        if (! (opt && opt.Loaded)) {
            __LOG[1](`Warnung: loadOptValue(${getOptName(opt)}) erlaubt kein Nachladen!`);
        }

        return getOptValue(opt, defValue);
    }
}

// ==================== Ende Abschnitt Operationen auf Optionen ====================

// *** EOF ***

/*** Ende util.option.api.js ***/

/*** Modul util.mem.js ***/

// ==UserScript==
// _name         util.mem
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer localStorage und sessionStorage
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Speicher ====================

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
const __MEMINAKTIVE = 'inaktiv';

// Definition des Default-, Dauer- und Null-Memories...
const __OPTMEMNORMAL   = __OPTMEM[__MEMNORMAL];
const __OPTMEMSESSION  = __OPTMEM[__MEMSESSION];
const __OPTMEMINAKTIVE = __OPTMEM[__MEMINAKTIVE];

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
        const __TESTPREFIX = 'canUseStorageTest';
        const __TESTDATA = Math.random().toString();
        const __TESTITEM = __TESTPREFIX + __TESTDATA;

        __MEMORY.setItem(__TESTITEM, __TESTDATA);
        ret = (__MEMORY.getItem(__TESTITEM) === __TESTDATA);
        __MEMORY.removeItem(__TESTITEM);
    }

    __LOG[4]("canUseStorage(" + __STORAGE.Name + ") = " + ret);

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
        if (storage !== __MEMINAKTIVE) {
            storage = __MEMINAKTIVE;
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

/*** Ende util.mem.js ***/

/*** Modul util.mem.db.js ***/

// ==UserScript==
// _name         util.mem.db
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer die Script-Datenbank
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.db.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Funktionen fuer die Scriptdatenbank ====================

// Initialisiert die Scriptdatenbank, die einen Datenaustausch zwischen den Scripten ermoeglicht
// optSet: Gesetzte Optionen (und Config)
function initScriptDB(optSet) {
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

/*** Ende util.mem.db.js ***/

/*** Modul util.mem.cmd.js ***/

// ==UserScript==
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
// ==/UserScript==

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
                __LOG[1]("getStoredCmds(): " + __CMD + " '" + __KEY + "' hat illegalen Wert '" + value + "'");
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
            case __OPTACTION.SET : __LOG[5]("SET '" + __KEY + "' " + __VAL);
                                   setStored(__KEY, __VAL, false, false, onFulfilled, onRejected);
                                   break;
            case __OPTACTION.NXT : __LOG[5]("SETNEXT '" + __KEY + "' " + __VAL);
                                   //setNextStored(__CONFIG.Choice, __KEY, __VAL, false, false, onFulfilled, onRejected);
                                   setStored(__KEY, __VAL, false, false, onFulfilled, onRejected);
                                   break;
            case __OPTACTION.RST : __LOG[5]("RESET (delayed)");
                                   __LOADEDCMDS.push(__STORED);
                                   break;
            default :              break;
            }
        } else {
            switch (__OPTACTION[__CMD]) {
            case __OPTACTION.SET :
            case __OPTACTION.NXT : __LOG[3]("SET/SETNEXT (undefined)");
                                   break;
            case __OPTACTION.RST : __LOG[5]("RESET");
                                   await resetOptions(optSet, false);
                                   await loadOptions(optSet);  // Reset auf umbenannte Optionen anwenden!
                                   break;
            default :              break;
            }
        }
    }

    return (__LOADEDCMDS.length ? __LOADEDCMDS : undefined);
}

// *** EOF ***

/*** Ende util.mem.cmd.js ***/

/*** Modul util.option.menu.js ***/

// ==UserScript==
// _name         util.option.menu
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Script-Optionen im Benutzermenue
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.menu.js
// ==/UserScript==

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
function registerMenuOption(val, menuOn, funOn, keyOn, menuOff, funOff, keyOff) {
    const __ON  = (val ? '*' : "");
    const __OFF = (val ? "" : '*');

    __LOG[4]("OPTION " + __ON + menuOn + __ON + " / " + __OFF + menuOff + __OFF);

    if (val) {
        return Promise.resolve(GM.registerMenuCommand(menuOff, funOff, keyOff)).then(result => menuOn);
    } else {
        return Promise.resolve(GM.registerMenuCommand(menuOn, funOn, keyOn)).then(result => menuOff);
    }
}

// Zeigt den Eintrag im Menu einer Option mit Wahl des naechsten Wertes
// val: Derzeitiger Wert der Option
// arr: Array-Liste mit den moeglichen Optionen
// menu: Text zum Setzen im Menu ($ wird durch gesetzten Wert ersetzt)
// fun: Funktion zum Setzen des naechsten Wertes
// key: Hotkey zum Setzen des naechsten Wertes im Menu
// return Promise von GM.registerMenuCommand()
function registerNextMenuOption(val, arr, menu, fun, key) {
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

    return Promise.resolve(GM.registerMenuCommand(__MENU, fun, key)).then(result => __MENU);
}

// Zeigt den Eintrag im Menu einer Option, falls nicht hidden
// val: Derzeitiger Wert der Option
// menu: Text zum Setzen im Menu ($ wird durch gesetzten Wert ersetzt)
// fun: Funktion zum Setzen des naechsten Wertes
// key: Hotkey zum Setzen des naechsten Wertes im Menu
// hidden: Angabe, ob Menupunkt nicht sichtbar sein soll (Default: sichtbar)
// serial: Serialization fuer komplexe Daten
// return Promise von GM.registerMenuCommand() (oder String-Version des Wertes)
function registerDataOption(val, menu, fun, key, hidden = false, serial = true) {
    const __VALUE = ((serial && (val !== undefined)) ? safeStringify(val) : val);
    const __MENU = substParam(menu, __VALUE);
    const __OPTIONS = (hidden ? "HIDDEN " : "") + "OPTION " + __MENU +
                      getValue(__VALUE, "", " = " + __VALUE);

    __LOG[hidden ? 5 : 4](__OPTIONS);

    if (hidden) {
        return Promise.resolve(__VALUE);
    } else {
        return Promise.resolve(GM.registerMenuCommand(__MENU, fun, key)).then(result => __MENU);
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

    if (! __CONFIG.HiddenMenu) {
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

/*** Ende util.option.menu.js ***/

/*** Modul util.option.page.label.js ***/

// ==UserScript==
// _name         util.option.page.label
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Node-Tooltips auf der Seite
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.label.js
// ==/UserScript==

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
        return eachLine(html, line => '<abbr title="' + title + '">' + line + '</abbr>', separator, undefined, limit);
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

/*** Ende util.option.page.label.js ***/

/*** Modul util.option.page.action.js ***/

// ==UserScript==
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
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.action.js
// ==/UserScript==

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
                              return (__MEMSTR + ".setItem('" + __RUNPREFIX + item + "', " + (quotes ? "'" + val + "'" : val) + "),");
                          };
        const __SETITEMS = function(cmd, key = undefined, val = undefined) {
                              return ('(' + __SETITEM('cmd', cmd) + ((key === undefined) ? "" :
                                      __SETITEM('key', key) + __SETITEM('val', val, false)) + __RELOAD + ')');
                          };
        const __CONFIG = getOptConfig(opt);
        const __SERIAL = getValue(serial, getValue(__CONFIG.Serial, false));
        const __THISVAL = ((__CONFIG.ValType === 'String') ? "'\\x22' + this.value + '\\x22'" : "this.value");
        const __TVALUE = getValue(__CONFIG.ValType, __THISVAL, "new " + __CONFIG.ValType + '(' + __THISVAL + ')');
        const __VALSTR = ((value !== undefined) ? safeStringify(value) : __SERIAL ? "JSON.stringify(" + __TVALUE + ')' : __TVALUE);
        const __ACTION = (isAlt ? getValue(__CONFIG.AltAction, __CONFIG.Action) : __CONFIG.Action);

        if (__ACTION !== undefined) {
            switch (__ACTION) {
            case __OPTACTION.SET : //return "doActionSet('" + getOptName(opt) + "', " + getNextOpt(opt, __VALSTR) + ')';
                                   return __SETITEMS('SET', getOptName(opt), __VALSTR);
            case __OPTACTION.NXT : //return "doActionNxt('" + getOptName(opt) + "', " + getNextOpt(opt, __VALSTR) + ')';
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
// type: Event-Typ fuer <input>, z.B. "click" fuer "onclick="
// serial: Serialization fuer String-Werte (Select, Textarea)
// memory: __OPTMEM.normal = unbegrenzt gespeichert (localStorage), __OPTMEM.begrenzt = bis Browserende gespeichert (sessionStorage), __OPTMEM.inaktiv
// return String mit dem (reinen) Funktionsaufruf
function getFormActionEvent(opt, isAlt = false, value = undefined, type = 'click', serial = undefined, memory = undefined) {
    const __ACTION = getFormAction(opt, isAlt, value, serial, memory);

    return getValue(__ACTION, "", ' on' + type + '="' + __ACTION + '"');
}

// ==================== Ende Abschnitt fuer Reaktionen der Node-Elemente auf der Seite ====================

// *** EOF ***

/*** Ende util.option.page.action.js ***/

/*** Modul util.option.page.node.js ***/

// ==UserScript==
// _name         util.option.page.node
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Node-Elementen in HTML auf der Seite
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.label.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.action.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.node.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Node-Elemente auf der Seite ====================

// Zeigt eine Option auf der Seite als Auswahlbox an
// opt: Anzuzeigende Option
// return String mit dem HTML-Code
function getOptionSelect(opt) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt);
    const __ACTION = getFormActionEvent(opt, false, undefined, 'change', undefined);
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel, __CONFIG.Label, true);
    const __TITLE = substParam(getValue(__CONFIG.Title, __CONFIG.Label), __VALUE);
    const __LABEL = '<label for="' + __NAME + '">' + __FORMLABEL + '</label>';
    let element = '<select name="' + __NAME + '" id="' + __NAME + '"' + __ACTION + '>';

    if (__CONFIG.FreeValue && ! (~ __CONFIG.Choice.indexOf(__VALUE))) {
        element += '\n<option value="' + __VALUE + '" SELECTED>' + __VALUE + '</option>';
    }
    for (let value of __CONFIG.Choice) {
        element += '\n<option value="' + value + '"' +
                   ((value === __VALUE) ? ' SELECTED' : "") +
                   '>' + value + '</option>';
    }
    element += '\n</select>';

    return withTitle(substParam(__LABEL, element), __TITLE);
}

// Zeigt eine Option auf der Seite als Radiobutton an
// opt: Anzuzeigende Option
// return String mit dem HTML-Code
function getOptionRadio(opt) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt, false);
    const __ACTION = getFormActionEvent(opt, false, true, 'click', false);
    const __ALTACTION = getFormActionEvent(opt, true, false, 'click', false);
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel); // nur nutzen, falls angegeben
    const __TITLE = getValue(__CONFIG.Title, '$');
    const __TITLEON = substParam(__TITLE, __CONFIG.Label);
    const __TITLEOFF = substParam(getValue(__CONFIG.AltTitle, __TITLE), __CONFIG.AltLabel);
    const __ELEMENTON  = '<input type="radio" name="' + __NAME +
                         '" id="' + __NAME + 'ON" value="1"' +
                         (__VALUE ? ' CHECKED' : __ACTION) +
                         ' /><label for="' + __NAME + 'ON">' +
                         __CONFIG.Label + '</label>';
    const __ELEMENTOFF = '<input type="radio" name="' + __NAME +
                         '" id="' + __NAME + 'OFF" value="0"' +
                         (__VALUE ? __ALTACTION : ' CHECKED') +
                         ' /><label for="' + __NAME + 'OFF">' +
                         __CONFIG.AltLabel + '</label>';
    const __ELEMENT = [
                          withTitle(__FORMLABEL, __VALUE ? __TITLEON : __TITLEOFF),
                          withTitle(__ELEMENTON, __TITLEON),
                          withTitle(__ELEMENTOFF, __TITLEOFF)
                      ];

    return ((__FORMLABEL && __FORMLABEL.length) ? __ELEMENT : __ELEMENT.slice(1, 3));
}

// Zeigt eine Option auf der Seite als Checkbox an
// opt: Anzuzeigende Option
// return String mit dem HTML-Code
function getOptionCheckbox(opt) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt, false);
    const __ACTION = getFormActionEvent(opt, __VALUE, ! __VALUE, 'click', false);
    const __VALUELABEL = (__VALUE ? __CONFIG.Label : getValue(__CONFIG.AltLabel, __CONFIG.Label));
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel, __CONFIG.Label);
    const __TITLE = substParam(getValue(__VALUE ? __CONFIG.Title : getValue(__CONFIG.AltTitle, __CONFIG.Title), '$'), __VALUELABEL);

    return withTitle('<input type="checkbox" name="' + __NAME +
                     '" id="' + __NAME + '" value="' + __VALUE + '"' +
                     (__VALUE ? ' CHECKED' : "") + __ACTION + ' /><label for="' +
                     __NAME + '">' + __FORMLABEL + '</label>', __TITLE);
}

// Zeigt eine Option auf der Seite als Daten-Textfeld an
// opt: Anzuzeigende Option
// return String mit dem HTML-Code
function getOptionTextarea(opt) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt);
    const __ACTION = getFormActionEvent(opt, false, undefined, 'submit', undefined);
    const __SUBMIT = getValue(__CONFIG.Submit, "");
    //const __ONSUBMIT = (__SUBMIT.length ? ' onKeyDown="' + __SUBMIT + '"': "");
    const __ONSUBMIT = (__SUBMIT ? ' onKeyDown="' + __SUBMIT + '"': "");
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel, __CONFIG.Label);
    const __TITLE = substParam(getValue(__CONFIG.Title, '$'), __FORMLABEL);
    const __ELEMENTLABEL = '<label for="' + __NAME + '">' + __FORMLABEL + '</label>';
    const __ELEMENTTEXT = '<textarea name="' + __NAME + '" id="' + __NAME + '" cols="' + __CONFIG.Cols +
                           '" rows="' + __CONFIG.Rows + '"' + __ONSUBMIT + __ACTION + '>' +
                           safeStringify(__VALUE, __CONFIG.Replace, __CONFIG.Space) + '</textarea>';

    return [ withTitle(__ELEMENTLABEL, __TITLE), __ELEMENTTEXT ];
}

// Zeigt eine Option auf der Seite als Button an
// opt: Anzuzeigende Option
// return String mit dem HTML-Code
function getOptionButton(opt) {
    const __CONFIG = getOptConfig(opt);
    const __NAME = getOptName(opt);
    const __VALUE = getOptValue(opt, false);
    const __ACTION = getFormActionEvent(opt, __VALUE, ! __VALUE, 'click', false);
    const __BUTTONLABEL = (__VALUE ? getValue(__CONFIG.AltLabel, __CONFIG.Label) : __CONFIG.Label);
    const __FORMLABEL = formatLabel(__CONFIG.FormLabel, __BUTTONLABEL);
    const __BUTTONTITLE = substParam(getValue(__VALUE ? getValue(__CONFIG.AltTitle, __CONFIG.Title) : __CONFIG.Title, '$'), __BUTTONLABEL);

    return '<label for="' + __NAME + '">' + __FORMLABEL + '</label>' +
           withTitle('<input type="button" name="" + ' + __NAME +
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
            element = '<div>' + Array.from(element).join('<br />') + '</div>';
        }
    }

    return element;
}

// ==================== Ende Abschnitt fuer Node-Elemente auf der Seite ====================

// *** EOF ***

/*** Ende util.option.page.node.js ***/

/*** Modul util.option.page.js ***/

// ==UserScript==
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
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.node.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.js
// ==/UserScript==

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
    const __BYFUN = (byFun || (val => val));
    const __FILTERFUN = (filterFun || ((key, index, arr) => (arr[index] === key)));
    const __KEYS = Object.keys(data);
    const __VALS = Object.values(data);
    const __BYKEYS = __VALS.map(__BYFUN);
    const __BYKEYSET = new Set(__BYKEYS);
    const __BYKEYARRAY = [...__BYKEYSET];
    const __SORTEDKEYS = __BYKEYARRAY.sort(sortFun);
    const __GROUPEDKEYS = __SORTEDKEYS.map(byVal => __KEYS.filter((key, index, arr) => __FILTERFUN(byVal, index, __BYKEYS)));
    const __ASSIGN = ((keyArr, valArr) => Object.assign({ }, ...keyArr.map((key, index) => ({ [key] : valArr[index] }))));

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
    const __FORM = '<form id="options" method="POST"><table><tbody><tr>';
    const __FORMEND = '</tr></tbody></table></form>';
    const __FORMWIDTH = getValue(optParams.formWidth, 3);
    const __FORMBREAK = getValue(optParams.formBreak, __FORMWIDTH);
    const __SHOWFORM = getOptValue(optSet.showForm, true) ? optParams.showForm : { 'showForm' : true };
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
                        form += '</tr><tr>';
                    }
                    form += '\n<td' + __TDOPT + '>' + __ELEMENT.replace('|', '</td><td>') + '</td>';
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
    //const __SCRIPT = '<script type="text/javascript">function activateMenu() { console.log("TADAAA!"); }</script>';
    //const __SCRIPT = '<script type="text/javascript">\n\tfunction doActionNxt(key, value) { alert("SET " + key + " = " + value); }\n\tfunction doActionNxt(key, value) { alert("SET " + key + " = " + value); }\n\tfunction doActionRst(key, value) { alert("RESET"); }\n</script>';
    //const __FORM = '<form method="POST"><input type="button" id="showOpts" name="showOpts" value="Optionen anzeigen" onclick="activateMenu()" /></form>';
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

/*** Ende util.option.page.js ***/

/*** Modul util.option.run.js ***/

// ==UserScript==
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
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.menu.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.run.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Aufbau und Start der Optionen ====================

// Initialisiert die Menue-Funktion einer Option
// optAction: Typ der Funktion
// item: Key der Option
// optSet: Platz fuer die gesetzten Optionen (und Config)
// optConfig: Konfiguration der Option
// return Funktion fuer die Option
function initOptAction(optAction, item = undefined, optSet = undefined, optConfig = undefined) {
    let fun;

    if (optAction !== undefined) {
        const __CONFIG = ((optConfig !== undefined) ? optConfig : getOptConfig(getOptByName(optSet, item)));
        const __RELOAD = getValue(getValue(__CONFIG, { }).ActionReload, true);

        switch (optAction) {
        case __OPTACTION.SET : fun = function() {
                                       return setOptByName(optSet, item, __CONFIG.SetValue, __RELOAD).catch(defaultCatch);
                                   };
                               break;
        case __OPTACTION.NXT : fun = function() {
                                       return promptNextOptByName(optSet, item, __CONFIG.SetValue, __RELOAD,
                                                  __CONFIG.FreeValue, __CONFIG.SelValue, __CONFIG.MinChoice).catch(defaultCatch);
                                   };
                               break;
        case __OPTACTION.RST : fun = function() {
                                       return resetOptions(optSet, __RELOAD).then(
                                               result => __LOG[4]("RESETTING (" + result + ")..."),
                                               defaultCatch);
                                   };
                               break;
        default :              break;
        }
    }

    return fun;
}

// Gibt diese Config oder, falls 'Shared', ein Referenz-Objekt mit gemeinsamen Daten zurueck
// optConfig: Konfiguration der Option
// item: Key der Option
// return Entweder optConfig oder gemergete Daten auf Basis des in 'Shared' angegebenen Objekts
function getSharedConfig(optConfig, item = undefined) {
    let config = getValue(optConfig, { });
    const __SHARED = config.Shared;

    if (__SHARED !== undefined) {
        const __OBJREF = getSharedRef(__SHARED, item);  // Gemeinsame Daten

        if (getValue(__SHARED.item, '$') !== '$') {  // __OBJREF ist ein Item
            const __REF = valueOf(__OBJREF);

            config = { };  // Neu aufbauen...
            addProps(config, getOptConfig(__REF));
            addProps(config, optConfig);
            config.setConst('SharedData', getOptValue(__REF), false);   // Wert muss schon da sein, NICHT nachladen, sonst ggfs. Promise
        } else {  // __OBJREF enthaelt die Daten selbst
            if (! config.Name) {
                config.Name = __OBJREF.getPath();
            }
            config.setConst('SharedData', __OBJREF);  // Achtung: Ggfs. zirkulaer!
        }
    }

    return config;
}

// Initialisiert die gesetzten Optionen
// optConfig: Konfiguration der Optionen
// optSet: Platz fuer die gesetzten Optionen
// preInit: Vorinitialisierung einzelner Optionen mit 'PreInit'-Attribut
// return Gefuelltes Objekt mit den gesetzten Optionen
function initOptions(optConfig, optSet = undefined, preInit = undefined) {
    if (optSet === undefined) {
        optSet = { };
    }

    for (let opt in optConfig) {
        const __OPTCONFIG = optConfig[opt];
        const __PREINIT = getValue(__OPTCONFIG.PreInit, false, true);
        const __ISSHARED = getValue(__OPTCONFIG.Shared, false, true);

        if ((preInit === undefined) || (__PREINIT === preInit)) {
            const __CONFIG = getSharedConfig(__OPTCONFIG, opt);
            const __ALTACTION = getValue(__CONFIG.AltAction, __CONFIG.Action);
            // Gab es vorher einen Aufruf, der einen Stub-Eintrag erzeugt hat, und wurden Daten geladen?
            const __LOADED = ((preInit === false) && optSet[opt].Loaded);
            const __PROMISE = ((__LOADED || ! optSet[opt]) ? undefined : optSet[opt].Promise);
            const __VALUE = (__LOADED ? optSet[opt].Value : undefined);

            optSet[opt] = {
                'Item'      : opt,
                'Config'    : __CONFIG,
                'Loaded'    : (__ISSHARED || __LOADED),
                'Promise'   : __PROMISE,
                'Value'     : initOptValue(__CONFIG, __VALUE),
                'SetValue'  : __CONFIG.SetValue,
                'ReadOnly'  : (__ISSHARED || __CONFIG.ReadOnly),
                'Action'    : initOptAction(__CONFIG.Action, opt, optSet, __CONFIG),
                'AltAction' : initOptAction(__ALTACTION, opt, optSet, __CONFIG)
            };
        } else if (preInit) {  // erstmal nur Stub
            optSet[opt] = {
                'Item'      : opt,
                'Config'    : __OPTCONFIG,
                'Loaded'    : false,
                'Promise'   : undefined,
                'Value'     : initOptValue(__OPTCONFIG),
                'ReadOnly'  : (__ISSHARED || __OPTCONFIG.ReadOnly)
            };
        }
    }

    return optSet;
}

// ==================== Abschnitt fuer Klasse Classification ====================

// Basisklasse fuer eine Klassifikation der Optionen nach Kriterium (z.B. Erst- und Zweitteam oder Fremdteam)
function Classification() {
    'use strict';

    this.renameFun = prefixName;
    //this.renameParamFun = undefined;
    this.optSet = undefined;
    this.optSelect = { };
}

Class.define(Classification, Object, {
                    'renameOptions' : function() {
                                          const __PARAM = this.renameParamFun();

                                          if (__PARAM !== undefined) {
                                              // Klassifizierte Optionen umbenennen...
                                              return renameOptions(this.optSet, this.optSelect, __PARAM, this.renameFun);
                                          } else {
                                              return Promise.resolve();
                                          }
                                      },
                    'deleteOptions' : function(ignList) {
                                          const __OPTSELECT = addProps([], this.optSelect, null, ignList);

                                          return deleteOptions(this.optSet, __OPTSELECT, true, true);
                                      }
                });

// ==================== Ende Abschnitt fuer Klasse Classification ====================

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
    optSet = initOptions(optConfig, optSet, true);  // PreInit

    // Memory Storage fuer vorherige Speicherung...
    myOptMemSize = getMemSize(myOptMem = await restoreMemoryByOpt(optSet.oldStorage));

    // Zwischengespeicherte Befehle auslesen...
    const __STOREDCMDS = getStoredCmds(myOptMem);

    // ... ermittelte Befehle ausfuehren...
    const __LOADEDCMDS = await runStoredCmds(__STOREDCMDS, optSet, true);  // BeforeLoad

    // Bisher noch nicht geladenene Optionen laden...
    await loadOptions(optSet);

    // Memory Storage fuer naechste Speicherung...
    myOptMemSize = getMemSize(myOptMem = startMemoryByOpt(optSet.storage, optSet.oldStorage));

    // Globale Daten ermitteln...
    initScriptDB(optSet);

    optSet = initOptions(optConfig, optSet, false);  // Rest

    if (classification !== undefined) {
        // Umbenennungen durchfuehren...
        await classification.renameOptions();
    }

    // ... ermittelte Befehle ausfuehren...
    await runStoredCmds(__LOADEDCMDS, optSet, false);  // Rest

    // Als globale Daten speichern...
    updateScriptDB(optSet);

    return optSet;
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
    if ((optParams.menuAnchor !== undefined) && (myOptMem !== __OPTMEMINAKTIVE)) {
        buildOptionForm(optParams.menuAnchor, optSet, optParams);
    }

    return optSet;
}

// ==================== Ende Abschnitt fuer Aufbau und Start der Optionen ====================

// *** EOF ***

/*** Ende util.option.run.js ***/

