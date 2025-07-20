// ==UserScript==
// _name         util.promise
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Details zu Promises
// _require      https://eselce.github.io/OS2.scripts/lib/util.promise.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer einfache Promise-Utilities ====================

// Einfache sleep() Funktion fuer den taeglichen Bedarf. Wenn's mal dauern darf.
// Einfach bedeutet hier, dass es kein Fehlerhandling gibt, nicht mal clearTimeout().
// millisecs: Anzahl der Millisekunden, die gewartet werden soll
// return Promise, auf das gewartet werden kann (await, then())
function sleep(millisecs = 15000) {
    return new Promise(resolve => setTimeout(resolve, millisecs));
}

// ==================== Ende Abschnitt fuer einfache Promise-Utilities ====================

// ==================== Abschnitt fuer Promise-Steuereung ====================

// getQueuedPromise() - Liefert synchronisiertes Promise (aus Roman Bauers osext2-Project)
// Wird ueber internes Promise 'pending' synchronisiert. Zeitlicher Ablauf:
// Pre 1. Anonyme Funktion: () => { }
// Pre 2. wird ausgefuehrt: (() => { })();
// Pre 3. setzt pending auf resolved: let pending = Promise.resolve();
// Pre 4. const run = async (executor) => { ... return new Promise(executor); }
// Pre 5. und liefert zurueck: (executor) => (pending = run(executor))
// Bei Aufruf:
// 1. Executor anlegen: executor = (resolve, reject) => { }
// 2. Promise anlegen: getQueuedPromise(executor)
// 3. getQueuedPromise: (executor) => (pending = run(executor))
// 4. async run: try { await pending; }
// 5. wartet auf vorherige Operation: await
// 6. async run: finally { return new Promise(executor); }
// 7. liefert Promise zurueck: new Promise(executor)
// 8. setzt pending auf Promise: pending = new Promise(executor)
// 9. liefert Promise zurueck: (executor) => pending
const getQueuedPromise = (() => {
    let pending = Promise.resolve();
    const run = async (executor) => {
        try {
            await pending;
        } finally {
            /* eslint no-unsafe-finally: 'off' */
            return getTimedPromise(executor);
        }
    };
    return (executor) => (pending = run(executor));
})();

const getQueuedPromiseRombau = (() => {
    let pending = Promise.resolve();
    const run = (async executor => {
            try {
                await pending;
            } catch (ex) {
                return Promise.reject(ex);
            }

            return getTimedPromise(executor);
        });
    return (executor => (pending = run(executor)));
})();

/***
function QueuedPromiseFactory() {
    this._lock = Promise.resolve();

    Object.call(this);
}

QueuedPromiseFactory.prototype.create = function(executor) {
        this._promise = getTimedPromise(async (resolve, reject) => {
                await this._lock;
                this._pending = (pending = this);

                return executor(resolve, reject);
            });
    };

QueuedPromiseFactory.prototype = Object.create(Object.prototype);

QueuedPromiseFactory.prototype.constructor = QueuedPromiseFactory;
***/

const newPromise = ((executor, millisecs = 15000) => new Promise((resolve, reject) => {
            const __TIMERID = window.setTimeout((() => reject(Error("Timed out"))), millisecs);
            return executor((value => (window.clearTimeout(__TIMERID), resolve(value))),
                            (error => (window.clearTimeout(__TIMERID), reject(error))));
        }));

function getTimedPromiseSLC(executor, millisecs = 15000) {
    return new Promise((resolve, reject) => {
            const __TIMEOUTFUN = (() => {
                    return reject(Error("Timed out (" + (millisecs / 1000) + "s)"));
                });
            const __TIMERID = setTimeout(__TIMEOUTFUN, millisecs);
            const __RESOLVEFUN = (value => {
                    clearTimeout(__TIMERID);
                    return resolve(value);
                });
            const __REJECTFUN = (error => {
                    clearTimeout(__TIMERID);
                    return reject(error);
                });
            return executor(__RESOLVEFUN, __REJECTFUN);
        });
}

//const Options = { timeout : 10000 };

/**
 * Returns a promise with the given executor. The new promise will be rejected after a the given timout in millis,
 * if the executor doesn't resolve before.
 *
 * @param executor a callback used to initialize the promise
 * @param timeout the timeout in millis
 * @returns {Promise}
 */
const getTimedPromiseRombau = (executor, timeout = 10000 /***Options.timeout***/) => {
    return new Promise((resolve, reject) => {
        const timerID = setTimeout(() => reject(new Error('Die Verarbeitung hat zu lange gedauert!')), timeout);
        return executor(value => {
                clearTimeout(timerID); 
                resolve(value);
            }, error => {
                clearTimeout(timerID); 
                reject(error);
            });
    });
}

// ==================== Ende Abschnitt fuer Promise-Steuerung ====================

// ==================== Abschnitt fuer einfaches Testen von Arrays von Promises und Funktionen ====================

// Funktion zum sequentiellen Aufruf eines Arrays von Funktionen ueber Promises
// startValue: Promise, das den Startwert oder das Startobjekt beinhaltet
// funs: Liste oder Array von Funktionen, die jeweils das Zwischenergebnis umwandeln
// throw Wirft im Fehlerfall eine AssertionFailed-Exception
// return Ein Promise-Objekt mit dem Endresultat
async function callPromiseChain(startValue, ... funs) {
    checkObjClass(startValue, Promise, false, "callPromiseChain()", "startValue", 'Promise')

    funs.forEach((fun, index) => {
            checkType(fun, 'function', true, "callPromiseChain()", "Parameter #" + (index + 1), 'Function');
        });

    return funs.flat(1).reduce((prom, fun, idx, arr) => prom.then(fun).catch(
                                    ex => promiseChainCatch(ex, fun, prom, idx, arr)),
                                startValue.catch(ex => promiseCatch(ex, startValue))
                            ).catch(promiseChainFinalCatch);
}

// Funktion zum parallelen Aufruf eines Arrays von Promises bzw. Promise-basierten Funktionen
// promises: Liste oder Array von Promises oder Werten
// throw Wirft im Fehlerfall eine AssertionFailed-Exception
// return Ein Promise-Objekt mit einem Array von Einzelergebnissen als Endresultat
async function callPromiseArray(... promises) {
    return Promise.all(promises.flat(1).map(
            (val, idx, arr) => Promise.resolve(val).catch(
                ex => promiseCatch(ex, prom, idx, arr))));
}

// Parametrisierte Catch-Funktion fuer einen gegebenen Promise-Wert, ggfs. mit Angabe der Herkunft
// ex: Die zu catchende Exception
// prom: Promise (rejeted) zum betroffenen Wert
// idx: Index innerhalb des Werte-Arrays
// arr: Werte-Array mit den Promises
// return Liefert eine Assertion und die showAlert()-Parameter zurueck, ergaenzt durch die Attribute
function promiseCatch(ex, prom, idx = undefined, arr = undefined) {
    checkObjClass(prom, Promise, true, "promiseCatch()", "prom", 'Promise');
    checkType(idx, 'number', false, "promiseCatch()", "idx", 'Number');
    checkObjClass(arr, Array, false, "promiseCatch()", "arr", 'Array');

    const __CODELINE = codeLine(false, true, 3, false);
    const __ATTRIB = {
            'promise'   : prom,
            'location'  : __CODELINE
        };

    ((idx !== undefined) && (__ATTRIB['index'] = idx));
    ((arr !== undefined) && (__ATTRIB['array'] = arr));

    __LOG[2]("CATCH:", ex, prom, __LOG.info(__ATTRIB, true, false));

    const __RET = assertionCatch(ex, __LOG.info(__ATTRIB));

    return __RET;
}

// Parametrisierte Catch-Funktion fuer einen gegebenen Promise-Wert einer Chain, ggfs. mit Angabe der Herkunft
// ex: Die zu catchende Exception
// fun: betroffene Funktion innerhalb der Promise-Chain (die eine rejected Rueckgabe produziert)
// prom: Parameter-Promise zur betroffenen Funktion
// idx: Index innerhalb des Funktions-Arrays
// arr: Funktions-Array mit den Promises
// return Liefert eine Assertion und die showAlert()-Parameter zurueck, ergaenzt durch die Attribute
function promiseChainCatch(ex, fun, prom = undefined, idx = undefined, arr = undefined) {
    checkType(fun, 'function', true, "promiseChainCatch()", "fun", 'Function');
    checkObjClass(prom, Promise, true, "promiseChainCatch()", "Parameter", 'Promise');
    checkType(idx, 'number', false, "promiseChainCatch()", "idx", 'Number');
    checkObjClass(arr, Array, false, "promiseChainCatch()", "arr", 'Array');

    // Ist prom nicht rejected oder nicht vorhanden, liefere neue Exception,
    // ansonsten einfach alten Fehler durchreichen (jeweils rejected)...
    return (prom || Promise.resolve()).then(() => {
            const __CODELINE = codeLine(false, true, 3, false);
            const __ATTRIB = {
                    'function'  : fun,
                    'location'  : __CODELINE
                };

            ((prom !== undefined) && (__ATTRIB['param'] = prom));
            ((idx  !== undefined) && (__ATTRIB['index'] = idx));
            ((arr  !== undefined) && (__ATTRIB['array'] = arr));

            __LOG[2]("CATCH[" + idx + "]:", ex, prom, __LOG.info(__ATTRIB, true, false));

            const __RET = assertionCatch(ex, __ATTRIB);

            return __RET;
        });
}

// Catch-Funktion, die in einer Chain die Behandlung der Fehler abschliesst
// ex: Die zu catchende Exception
// return Liefert eine Rejection mit der richtigen Exception zurueck
async function promiseChainFinalCatch(ex) {
    const __EX = ex;

    // TODO Unklar, ob es benoetigt wird!

    const __RET = __EX;

    return Promise.reject(__RET);
}

// ==================== Ende Abschnitt fuer einfaches Testen von Arrays von Promises und Funktionen  ====================

// *** EOF ***
