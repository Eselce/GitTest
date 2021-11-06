// ==UserScript==
// _name         util.proto
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Prototypes
// _require      https://eselce.github.io/OS2.scripts/lib/util.proto.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer diverse Utilities fuer Function-Prototypes ====================

// Ueberprueft, ob ein Objekt einer bestimmten Klasse angehoert (ggfs. per Vererbung)
// obj: Ein (generisches) Objekt
// base: Eine Objektklasse (Konstruktor-Funktion)
// return true, wenn der Prototyp rekursiv gefunden werden konnte
function instanceOf(obj, base) {
    while (obj !== null) {
        if (obj === base.prototype) {
            return true;
        }
        if ((typeof obj) === 'xml') {  // Sonderfall mit Selbstbezug
            //return (base.prototype === XML.prototype);
            return (base.prototype === XMLDocument.prototype);  // Notloesung!
        }
        obj = Object.getPrototypeOf(obj);
    }

    return false;
}

// Liefert alle Basisklassen des Objekts (inkl. Vererbung)
// obj: Ein (generisches) Objekt
// return true, wenn der Prototyp rekursiv gefunden werden konnte
function getPrototypes(obj) {
    let ret = [];

    while (obj !== null) {
        const __PROTO = Object.getPrototypeOf(obj);

        ret.push(__PROTO);
        if ((typeof obj) === 'xml') {  // Sonderfall mit Selbstbezug
            break;
        }
        obj = __PROTO;
    }

    return ret;
}

// Liefert alle Attribute/Properties des Objekts (inkl. Vererbung)
// obj: Ein (generisches) Objekt
// return Array von Items (Property-Namen)
function getAllProperties(obj) {
    let ret = [];

    for (let o = obj; o !== null; o = Object.getPrototypeOf(o)) {
      ret = ret.concat(Object.getOwnPropertyNames(o));
    }

    return ret;
}

// ==================== Ende Abschnitt fuer diverse Utilities fuer Function-Prototypes ====================

// ==================== Abschnitt mit Ergaenzungen und Polyfills zu Standardobjekten ====================

// Kompatibilitaetsfunktion zur Ermittlung des Namens einer Funktion (falls <Function>.name nicht vorhanden ist)
if (Function.prototype.name === undefined) {
    Object.defineProperty(Function.prototype, 'name', {
            get : function() {
                      return /function ([^(\s]*)/.exec(this.toString())[1];
                  }
        });
}

// Ergaenzung fuer Strings: Links oder rechts auffuellen nach Vorlage
// padStr: Vorlage, z.B. "00" fuer zweistellige Zahlen
// padLeft: true = rechtsbuendig, false = linksbuendig
// clip: Abschneiden, falls zu lang
// return Rechts- oder linksbuendiger String, der so lang ist wie die Vorlage
String.prototype.pad = function(padStr, padLeft = true, clip = false) {
    const __LEN = ((clip || (padStr.length > this.length)) ? padStr.length : this.length);

    return (padLeft ? String(padStr + this).slice(- __LEN) : String(this + padStr).slice(0, __LEN));
};

// Ersetzt in einem String {0}, {1}, ... durch die entsprechenden Parameter
// arguments: Parameter, die fuer {0}, {1}, ... eingesetzt werden sollen
// return Resultierender String
String.prototype.format = function() {
    const __ARGS = arguments;
    return this.replace(/{(\d+)}/g, function(match, argIdx) {
                                        const __ARG = __ARGS[argIdx];
                                        return ((__ARG !== undefined) ? __ARG : match);
                                    });
};

// Polyfill for das originale Array.reduce, da das alte prototype.js 1.6.0.3
// dies ueberschreibt durch eine Funktion, die die Aufgabe nicht erfuellt!
// Um weitere Konflikte zu vermeiden, wird die Methode Array.Reduce genannt
// reduceFun: Reduktions-Funktion mit bis zu vier Parametern:
// - value: Kumulativer Wert
// - element: Das aktuelle Element des Arrays
// - index: Index von element im Array
// - arr: Das ganze Array
// value: Inititaler Wert. Falls nicht angegeben, wird mit dem 1. Element gestartet
// return Kumulierter Wert nach Durchlaufen des gesamten Arrays
Array.prototype.Reduce = function(reduceFun, value) {
    if ((! reduceFun) || ((typeof reduceFun) !== 'function')) {
        throw TypeError();
    }

    const __LEN = this.length;
    const __DOSHIFT = (((typeof value) === 'undefined') || (value === null));

    if (__DOSHIFT) {
        value = this[0];
    } 

    for (let i = (__DOSHIFT ? 1 : 0); i < __LEN; i++) {
        value = reduceFun.call(this, value, this[i], i, this);
    }

    return value;
}

// Polyfill for das originale Array.reduceRight, analog zu Array.reduce
// Um weitere Konflikte zu vermeiden, wird die Methode Array.ReduceRight genannt
// reduceFun: Reduktions-Funktion mit bis zu vier Parametern:
// - value: Kumulativer Wert
// - element: Das aktuelle Element des Arrays
// - index: Index von element im Array
// - arr: Das ganze Array
// value: Inititaler Wert. Falls nicht angegeben, wird mit dem letzten Element gestartet
// return Kumulierter Wert nach Durchlaufen des gesamten Arrays
Array.prototype.ReduceRight = function(reduceFun, value) {
    if ((! reduceFun) || ((typeof reduceFun) !== 'function')) {
        throw TypeError();
    }

    const __LEN = this.length;
    const __DOSHIFT = (((typeof value) === 'undefined') || (value === null));

    if (__DOSHIFT) {
        value = this[__LEN - 1];
    } 

    for (let i = __LEN - (__DOSHIFT ? 2 : 1); i >= 0; i--) {
        value = reduceFun.call(this, value, this[i], i, this);
    }

    return value;
}

// ==================== Ende Abschnitt mit Ergaenzungen und Polyfills zu Standardobjekten ====================

// *** EOF ***
