// ==UserScript==
// _name         util.store
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Script-Optionen im Benutzermenue
// _require      https://eselce.github.io/OS2.scripts/lib/util.store.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Konfigurations-Abschnitt fuer Speicherung (GM.setValue, GM.deleteValue) ====================

// Echte Schreibzugriffe (false = read only)
const __GMWRITE = true;

// ==================== Abschnitt Programmstart und zugehoerigen Hilfsfunktionen ====================

// Gesammelte Routinen fuer den Start des Scriptes...
const __SCRIPTINIT = [];

// Registrierung eine Startfunktion
// startFun: Auszufuehrende Funktion
// return void
async function registerStartFun(startFun) {
    __SCRIPTINIT.push(startFun);
}

// Funktion zum sequentiellen Aufruf der Startroutinen in __SCRIPTINIT ueber Promises
// return Ein Promise-Objekt fuer den Programmstart
async function startMain() {
    return __SCRIPTINIT.reduce((prom, fun) => prom.then(fun, defaultCatch),
            Promise.resolve(true)).then(__SCRIPTINIT.length = 0);
}

// ==================== Abschnitt Lesefilter und zugehoerigen Hilfsfunktionen ====================

// Modifikationen fuer Kompatibilitaet (z.B. "undefined" statt undefined bei Tampermonkey)
const __GMREADFILTER = [];

async function GM_checkForTampermonkeyBug() {
    const __TESTNAME = 'GM_checkForTampermonkeyBug';
    const __TESTVALUE = undefined;
    const __TESTDEFAULT = "DEFAULT";
    const __TESTFILTER = GM_TampermonkeyFilter;

    return __SETVALUE(__TESTNAME, __TESTVALUE).then(
        __GETVALUE(__TESTNAME, __TESTDEFAULT), defaultCatch).then(value => {
                const __RET = (value !== __TESTDEFAULT);

                if (__RET) {
                    if (! __GMREADFILTER.push(__TESTFILTER)) {
                        return false;
                    }

                    __LOG[8]("GM_TampermonkeyFilter AKTIVIERT!")
                }

                return __RET;
            }, defaultCatch);
}

// Funktion zum sequentiellen Aufruf der Filter in __GMREADFILTER ueber Promises
// startValue: Promise oder Wert, der/die den Startwert oder das Startobjekt beinhaltet
// name: GM.getValue()-Name, unter dem die Daten gespeichert wurden (Zusatzinfo fuer den Filter)
// defValue: Default-Wert fuer den Fall, dass nichts gespeichert ist (Zusatzinfo fuer den Filter)
// return Ein Promise-Objekt mit dem Endresultat
async function useReadFilter(startValue, name, defValue) {
    return __GMREADFILTER.reduce((prom, fun) => prom.then(
            value => fun(value, name, defValue), defaultCatch),
            Promise.resolve(startValue));
}

// Kompatibilitionsfunktion gegen den undefined-Bug von Tampermonkey
// value: Gelesener Wert oder Promise darauf
// name: GM.getValue()-Name, unter dem die Daten gespeichert wurden (Zusatzinfo fuer den Filter)
// defValue: Default-Wert fuer den Fall, dass nichts gespeichert ist (Zusatzinfo fuer den Filter)
// return Promise mit korrigiertem Wert
async function GM_TampermonkeyFilter(value, name, defValue) {
    const __VALUE = await Promise.resolve(value);

    __LOG[8]('GM_TampermonkeyFilter(' + __LOG.info(value, false) + "), "
        + __LOG.info(name, false) + ", " + __LOG.info(defValue, false));

    if (__VALUE === 'undefined') {
        __LOG[4]("GM_TampermonkeyFilter: Fixing", __LOG.info(value, false),
            "for", __LOG.info(name, false), "to", __LOG.info(defValue, false));

        return defValue;
    }

    return value;
}

// ==================== Invarianter Abschnitt zur Speicherung (GM.setValue, GM.deleteValue) ====================

// Generator-Funktion: Liefert eine ausgewählte GM-Funktion
// action: Name der Funktion im GM-Objekt
// label: Ausgabe-Titel
// condition: Bedingung fuer die Auswahl
// altAction: Alternative zu Parameter 'action' im Falle "condition === false"
// level: Ausgabe-Loglevel
// return Ausgewaehlte GM-Funktion
function GM_function(action, label, condition = true, altAction = undefined, level = 8) {
    // Nur einmalig ermitteln...
    const __LABEL = ((condition ? '+' : '-') + label);
    const __FUN = GM[condition ? action : altAction];

    return function(...args) {
            const __NAME = __LOG.info(args[0], false);
            __LOG[level](__LABEL, __NAME);
            return __FUN(...args);
        };
}

// Umlenkung von Speicherung und Loeschung auf nicht-inversible 'getValue'-Funktion.
// Falls __GMWRITE false ist, wird nicht geschrieben, bei true werden Optionen gespeichert.
// TODO: Dynamische Variante
const __GETVALUE = GM_function('getValue', 'GET');
const __SETVALUE = GM_function('setValue', 'SET', __GMWRITE, 'getValue');
const __DELETEVALUE = GM_function('deleteValue', 'DELETE', __GMWRITE, 'getValue');
const __LISTVALUES = GM_function('listValues', 'KEYS');

registerStartFun(async () => {
        if (__GMWRITE) {
            __LOG[8]("Schreiben von Optionen wurde AKTIVIERT!");
        } else {
            __LOG[8]("Schreiben von Optionen wurde DEAKTIVIERT!");
        }
    });

// GGfs. GM_TampermonkeyFilter aktivieren...
registerStartFun(GM_checkForTampermonkeyBug);

// ==================== Ende Invarianter Abschnitt zur Speicherung (GM.setValue, GM.deleteValue) ====================

// ==================== Abschnitt fuer die Sicherung und das Laden von Daten ====================

// Speichert einen String/Integer/Boolean-Wert unter einem Namen ab
// name: GM.setValue()-Name, unter dem die Daten gespeichert werden
// value: Zu speichernder String/Integer/Boolean-Wert
// return Promise auf ein Objekt, das 'name' und 'value' der Operation enthaelt
function storeValue(name, value) {
    __LOG[5](name + " >> " + __LOG.info(value, true, true));

    return __SETVALUE(name, value).then(() => {
            __LOG[6]('OK', name, '>>', __LOG.info(value, true, true));

            return Promise.resolve({
                    'name'  : name,
                    'value' : value
                });
        }, ex => {
            __LOG[1](name + ':', ex.message);

            return Promise.reject(ex);
        });
}

// Holt einen String/Integer/Boolean-Wert unter einem Namen zurueck
// name: GM.getValue()-Name, unter dem die Daten gespeichert wurden
// defValue: Default-Wert fuer den Fall, dass nichts gespeichert ist
// return Promise fuer den String/Integer/Boolean-Wert, der unter dem Namen gespeichert war
function summonValue(name, defValue = undefined) {
    const __VALPROMISE = __GETVALUE(name, defValue);

    return useReadFilter(__VALPROMISE, name, defValue).then(value => {
            __LOG[5](name, '<<', __LOG.info(value, true, true));

            return Promise.resolve(value);
        }, ex => {
            __LOG[1](name + ':', ex.message);

            return Promise.reject(ex);
        });
}

// Entfernt einen String/Integer/Boolean-Wert, der unter einem Namen gespeichert ist
// name: GM.deleteValue()-Name, unter dem die Daten gespeichert wurden
// return Promise fuer den String/Integer/Boolean-Wert, der unter dem Namen gespeichert war
function discardValue(name) {
    __LOG[5]("DELETE " + __LOG.info(name, false));

    return __DELETEVALUE(name).then(value => {
            __LOG[5]('OK', 'DELETE', name);

            return Promise.resolve(value);
        }, ex => {
            __LOG[1](name + ':', ex.message);

            return Promise.reject(ex);
        });
}

// Listet die Namen aller Orte auf, unter der ein String/Integer/Boolean-Wert gespeichert ist
// return Promise fuer ein Array von GM.listValues()-Namen, unter denen String/Integer/Boolean-Werte gespeichert sind
function keyValues() {
    return __LISTVALUES().then(keys => {
            __LOG[5]("KEYS:", keys);

            return Promise.resolve(keys);
        }, ex => {
            __LOG[1]("KEYS:", ex.message);

            return Promise.reject(ex);
        });
}

// Speichert einen beliebiegen (strukturierten) Wert unter einem Namen ab
// name: GM.setValue()-Name, unter dem die Daten gespeichert werden
// value: Beliebiger (strukturierter) Wert
// return Promise auf ein Objekt, das 'name' und 'value' in der String-Darstellung des Wertes enthaelt
function serialize(name, value) {
    const __STREAM = ((value !== undefined) ? safeStringify(value) : value);

    return storeValue(name, __STREAM);
}

// Holt einen beliebiegen (strukturierter) Wert unter einem Namen zurueck
// name: GM.getValue()-Name, unter dem die Daten gespeichert wurden
// defValue: Default-Wert fuer den Fall, dass nichts gespeichert ist
// return Promise fuer das Objekt, das unter dem Namen gespeichert war
function deserialize(name, defValue = undefined) {
    return summonValue(name).then(stream => {
            if (stream && stream.length) {
                try {
                    return JSON.parse(stream);
                } catch (ex) {
                    __LOG[1](__LOG.info(name, false), '<<', __LOG.info(stream, true, true));
                    ex.message += ": " + __LOG.info(name, false) + " : " + __LOG.info(stream);
                    throw ex;
                }
            } else {
                return defValue;
            }
        });
}

// ==================== Abschnitt fuer die Folgen einer Speicherung ====================

// Setzt die Seite gemaess der Aenderungen zurueck...
// reload: Seite wird ganz neu geladen
function refreshPage(reload = true) {
    if (reload) {
        __LOG[2]("Seite wird neu geladen...");
        window.location.reload();
    }
}

// ==================== Abschnitt fuer die Sicherung von Daten mit Callback ====================

// Setzt eine Option dauerhaft und laedt die Seite neu
// name: Name der Option als Speicherort
// value: Zu setzender Wert
// reload: Seite mit neuem Wert neu laden
// serial: Serialization fuer komplexe Daten
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gespeicherter Wert fuer setOptValue()
function setStored(name, value, reload = false, serial = false, onFulfilled = undefined, onRejected = undefined) {
    (serial ? serialize(name, value)
            : storeValue(name, value))
                .then(onFulfilled, onRejected)
                .then(() => refreshPage(reload), defaultCatch);  // Ende der Kette...

    return value;
}

// Setzt den naechsten Wert aus einer Array-Liste als Option
// arr: Array-Liste mit den moeglichen Optionen
// name: Name der Option als Speicherort
// value: Vorher gesetzter Wert
// reload: Seite mit neuem Wert neu laden
// serial: Serialization fuer komplexe Daten
// onFulfilled: Reaktion auf Speicherung im resolve-Fall (1. Promise.then()-Parameter)
// onRejected: Reaktion auf Speicherung im reject-Fall (2. Promise.then()-Parameter)
// return Gespeicherter Wert fuer setOptValue()
function setNextStored(arr, name, value, reload = false, serial = false, onFulfilled = undefined, onRejected = undefined) {
    return setStored(name, getNextValue(arr, value), reload, serial, onFulfilled, onRejected);
}

// ==================== Ende Abschnitt fuer die Sicherung und das Laden von Daten ====================

// *** EOF ***
