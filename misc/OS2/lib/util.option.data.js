// ==UserScript==
// _name         util.option.data
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Zugriff auf die Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Zugriff auf die Optionen ====================

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
        __LOG[4]("RENAME " + __NAME + " => " + name);

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
            __LOG[6](getOptName(opt) + ": " + __LOG.changed(opt.Value, value));

            opt.Value = value;
        }
        return opt.Value;
    } else {
        return undefined;
    }
}

// Gibt den Wert einer Option zurueck
// opt: Config und Value der Option
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// load: Laedt die Option per loadOption(), falls noetig
// force: Laedt auch Optionen mit 'AutoReset'-Attribut
// return Gesetzter Wert
function getOptValue(opt, defValue = undefined, load = true, asyncLoad = false, force = false) {
    let value;

    if (opt !== undefined) {
        if (load && ! opt.Loaded) {
            if (! opt.Promise) {
                loadOption(opt, force);
            }
            if (! asyncLoad) {
                __LOG[0]("Warnung: getOptValue(" + getOptName(opt) + ") fordert zum Nachladen auf, daher nur Default-Wert!");
            }
        } else {
            value = opt.Value;
        }
    }

    return valueOf(getValue(value, defValue));
}

// ==================== Ende Abschnitt fuer Zugriff auf die Optionen ====================

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
        __LOG[0]("promptNextOpt: " + ex.message);
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
