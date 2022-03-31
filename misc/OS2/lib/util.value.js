// ==UserScript==
// _name         util.value
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Logging, Debugging, Error-Handling, usw.
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer diverse Utilities fuer Werte ====================

// Gibt einen Wert zurueck. Ist dieser nicht definiert oder null, wird ein Alternativwert geliefert
// value: Ein Wert. Ist dieser nicht undefined oder null, wird er zurueckgeliefert (oder retValue)
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist (also undefined oder null)
// retValue: Falls definiert, Rueckgabe-Wert fuer den Fall, dass value gesetzt (also nicht undefined oder null) ist
// return Der Wert. Sind weder value noch defValue definiert, dann undefined
function getValue(value, defValue = undefined, retValue = undefined) {
    return ((value === undefined) || (value === null)) ? defValue : (retValue === undefined) ? value : retValue;
}

// Gibt den Item-Wert eines Objektes zurueck. Ist dieser nicht definiert oder null, wird ein Alternativwert geliefert
// Ist das Objekt selbst undefined, gibt es keinen Fehler, es wird jedoch undefined zurueckgegeben
// obj: Das Objekt, dessen Item den Wert liefern soll
// item: Ein Key. Ist der zugehoerige Wert nicht undefined oder null, wird er zurueckgeliefert (oder retValue)
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// retValue: Falls definiert, Rueckgabe-Wert fuer den Fall, dass value nicht undefined oder null ist
// return Der Wert. Sind weder value noch defValue definiert, dann undefined
function getObjValue(obj, item, defValue = undefined, retValue = undefined) {
    return getValue(getValue(obj, { })[item], defValue, retValue);
}

// Gibt den Wert eines Arrays-Elements zurueck. Ist dieser nicht definiert oder null, wird ein Alternativwert geliefert
// Ist das Array selbst undefined, gibt es keinen Fehler, es wird jedoch undefined zurueckgegeben
// arr: Das Array, dessen Item den Wert liefern soll
// index: Ein Array-Index. Ist der zugehoerige Wert im Array nicht undefined oder null, wird er zurueckgeliefert (oder retValue)
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist
// retValue: Falls definiert, Rueckgabe-Wert fuer den Fall, dass value nicht undefined oder null ist
// return Der Wert. Sind weder value noch defValue definiert, dann undefined
function getArrValue(arr, index, defValue = undefined, retValue = undefined) {
    return getValue(getValue(arr, [])[index], defValue, retValue);
}

// Fuegt einen Wert dem Item-Array eines Objektes hinzu. Ist dieses nicht definiert oder null, wird es vorher angelegt
// Ist das Objekt selbst undefined, gibt es keinen Fehler, der gelieferte Eintrag muss jedoch noch selbst zugewiesen werden
// obj: Das Objekt, dessen Item mit dem Wert gesetzt werden soll
// item: Ein Key. Ist der zugehoerige Wert undefined oder null, wird ein Array angelegt
// value: Zu setzender Wert
// defValue: Default-Wert fuer den Fall, dass value nichts gesetzt ist
// returnOnly: true - Wert nur ermittlen, nicht im obj setzen, false - Item auch setzen
// scalarUnique: true - Nur bei mehreren Eintraegen Array nutzen, false - Skalare Werte,
//               wobei nur der letzte gesetzte Wert bei identischen Schluesseln uebrig bleibt!
// return Das Array mit allen Werten, die fuer dieses item gesetzt sind
function pushObjValue(obj, item, value, defValue, returnOnly = false, scalarUnique = false) {
    const __VALUE = getObjValue(obj, item, []);
    const __VALUEARR = (Array.isArray(__VALUE) ? __VALUE : [ __VALUE ]);

    __VALUEARR.push(getValue(value, defValue));

    const __RET = ((scalarUnique && (__VALUEARR.length === 1)) ? __VALUEARR[0] : __VALUEARR);

    if (obj && (! returnOnly)) {
        obj[item] = __RET;
    }

    return __RET;
}

// Fuegt einen Wert dem Item-Array-Element eines Arrays hinzu. Ist dieses nicht definiert oder null, wird es vorher angelegt
// Ist das Array selbst undefined, gibt es keinen Fehler, der gelieferte Eintrag muss jedoch noch selbst zugewiesen werden
// arr: Das Objekt, dessen Item mit dem Wert gesetzt werden soll
// index: Ein Array-Index. Ist der zugehoerige Wert im Array undefined oder null, wird ein Array an dieser Stelle angelegt
// value: Zu setzender Wert
// defValue: Default-Wert fuer den Fall, dass value nichts gesetzt ist
// returnOnly: true - Wert nur ermittlen, nicht im arr setzen, false - Item auch setzen
// scalarUnique: true - Nur bei mehreren Eintraegen Array nutzen, false - Skalare Werte,
//               wobei nur der letzte gesetzte Wert bei identischen Schluesseln uebrig bleibt!
// return Das Array mit allen Werten, die fuer diesen Index gesetzt sind
function pushArrValue(arr, index, value, defValue, returnOnly = false, scalarUnique = false) {
    const __VALUE = getArrValue(arr, index, []);
    const __VALUEARR = (Array.isArray(__VALUE) ? __VALUE : [ __VALUE ]);

    __VALUEARR.push(getValue(value, defValue));

    const __RET = ((scalarUnique && (__VALUEARR.length === 1)) ? __VALUEARR[0] : __VALUEARR);

    if (arr && (! returnOnly)) {
        arr[index] = __RET;
    }

    return __RET;
}

// Gibt einen Wert zurueck. Ist dieser nicht definiert, wird ein Alternativwert geliefert
// value: Ein Wert. Ist dieser definiet und in den Grenzen, wird er zurueckgeliefert
// minValue: Untere Grenze fuer den Wert, falls angegeben
// minValue: Obere Grenze fuer den Wert, falls angegeben
// defValue: Default-Wert fuer den Fall, dass nichts gesetzt ist oder der Wert ausserhalb liegt
// return Der Wert. Sind weder value (in den Grenzen) noch defValue definiert, dann undefined
function getValueIn(value, minValue = undefined, maxValue = undefined, defValue = undefined) {
    const __VALUE = getValue(value, defValue);

    if ((minValue !== undefined) && (__VALUE < minValue)) {
        return defValue;
    }
    if ((maxValue !== undefined) && (__VALUE > maxValue)) {
        return defValue;
    }

    return __VALUE;
}

// Ermittelt den naechsten Wert aus einer Array-Liste
// arr: Array-Liste mit den moeglichen Werte
// value: Vorher gesetzter Wert
// return Naechster Wert in der Array-Liste
function getNextValue(arr, value) {
    const __POS = arr.indexOf(value) + 1;

    return arr[getValueIn(__POS, 0, arr.length - 1, 0)];
}

// Gibt ein Produkt zurueck. Ist einer der Multiplikanten nicht definiert, wird ein Alternativwert geliefert
// valueA: Ein Multiplikant. Ist dieser undefined, wird als Produkt defValue zurueckgeliefert
// valueB: Ein Multiplikant. Ist dieser undefined, wird als Produkt defValue zurueckgeliefert
// digits: Anzahl der Stellen nach dem Komma fuer das Produkt (Default: 0)
// defValue: Default-Wert fuer den Fall, dass ein Multiplikant nicht gesetzt ist (Default: NaN)
// return Das Produkt auf digits Stellen genau. Ist dieses nicht definiert, dann defValue
function getMulValue(valueA, valueB, digits = 0, defValue = Number.NaN) {
    let product = defValue;

    if ((valueA !== undefined) && (valueB !== undefined)) {
        product = parseFloat(valueA) * parseFloat(valueB);
    }

    if (isNaN(product)) {
        product = defValue;
    }

    return parseFloat(product.toFixed(digits));
}

// Gibt eine Ordinalzahl zur uebergebenen Zahl zurueck
// value: Eine ganze Zahl
// defValue: Default-Wert fuer den Fall, dass der Wert nicht gesetzt ist (Default: '*')
// return Die Ordinalzahl als String der Form "n." oder defValue, falls nicht angegeben
function getOrdinal(value, defValue = '*') {
    return getValue(value, defValue, value + '.');
}

// Wandelt einen String in eine Zahl um.
// Prozentzahlen werden als Anteil eines Ganzen interpretiert (d.h. "100%" -> 1).
// Ganze Zahlen mit Tausenderpunkten werden erkannt, wenn sie mit '.' gefolgt von 3 Ziffern enden.
// Dezimalzahlen werden erkannt, wenn sie mit '.' gefolgt von beliebig vielen Ziffern enden.
// Da zuerst auf ganze Zahlen geprueft wird, koennen Dezimalzahlen nicht 3 Nachkommaziffern haben.
// numberString: Dezimalzahl als String
// return Numerischer Wert der Zahl im String
function getNumber(numberString) {
    const __STR = (numberString || "");
    // Ist es eine Prozentzahl?
    const __PERCENT = (__STR.indexOf('%') > -1);
    // Buchstaben und '%' entfernen;
    // Whitespaces vorne und hintenentfernen...
    const str = __STR.replace(/[a-zA-Z%]/g, "").trim();
    const __REGEXPINT     = /^\d+$/;
    const __REGEXPINTDOTS = /^\d+(\.\d{3}){1,}$/;
    const __REGEXPNUMBER  = /^\d*\.\d{1,}$/;
    let ret = Number.NaN;

    // parseXXX interpretiert einen Punkt immer als Dezimaltrennzeichen!
    if (__REGEXPINT.test(str)) {
        // Einfache ganze Zahl...
        ret = Number.parseInt(str, 10);
    } else if (__REGEXPINTDOTS.test(str)) {
        // Ganze Zahl mit Tausenderpunkten...
        ret = Number.parseInt(str.replace(/\./g, ""), 10);
    } else if (__REGEXPNUMBER.test(str)) {
        // Dezimalzahl mit Punkt als Trennzeichen...
        ret = Number.parseFloat(str);
    } else {
        // Kein gueltiger String
    }

    return (__PERCENT ? (ret / 100) : ret);
}

// Fuegt in die uebergebene Zahl Tausender-Trennpunkte ein
// Wandelt einen etwaig vorhandenen Dezimalpunkt in ein Komma um
// numberString: Dezimalzahl als String
// return Diese Dezimalzahl als String mit Tausender-Trennpunkten und Komma statt Dezimalpunkt
function getNumberString(numberString) {
    if (numberString.lastIndexOf('.') !== -1) {
        // Zahl enthaelt Dezimalpunkt
        const __VORKOMMA = numberString.substring(0, numberString.lastIndexOf('.'));
        const __NACHKOMMA = numberString.substring(numberString.lastIndexOf('.') + 1, numberString.length);

        return getNumberString(__VORKOMMA) + ',' + __NACHKOMMA;
    } else {
        // Kein Dezimalpunkt, fuege Tausender-Trennpunkte ein:
        // String umdrehen, nach jedem dritten Zeichen Punkt einfuegen, dann wieder umdrehen:
        const __TEMP = reverseString(numberString);
        let result = "";

        for (let i = 0; i < __TEMP.length; i++) {
            if ((i > 0) && ((i % 3) === 0)) {
                result += '.';
            }
            result += __TEMP.substr(i, 1);
        }

        return reverseString(result);
    }
}

// Liefert den ganzzeiligen Anteil einer Zahl zurueck, indem alles hinter einem Punkt abgeschnitten wird
// value: Eine uebergebene Dezimalzahl
// return Der ganzzeilige Anteil dieser Zahl
function floorValue(value, dot = '.') {
    if ((value === 0) || (value && isFinite(value))) {
        const __VALUE = value.toString();
        const __INDEXDOT = (__VALUE ? __VALUE.indexOf(dot) : -1);

        return Number((~ __INDEXDOT) ? __VALUE.substring(0, __INDEXDOT) : __VALUE);
    } else {
        return value;
    }
}

// Liefert eine generische Funktion zurueck, die die Elemente eines Arrays auf eine vorgegebene Weise formatiert
// formatFun: Formatierfunktion fuer ein Element
// - element: Wert des Elements
// - index: Laufende Nummer des Elements (0-basiert)
// - arr: Das gesamte Array, wobei arr[index] === element
// return Generische Funktion, die an Array-Funktionen uebergeben werden kann, z.B. als Replacer fuer safeStringify()
function replaceArrayFun(formatFun, space = ' ') {
    return function(key, value) {
            UNUSED(key);

            const __VALUE = getValue(this[""], value);  // value ist anders als in Dokumentation beschrieben, nutze ggfs. ""-Eintrag!

            if (Array.isArray(__VALUE)) {
                const __RET = (formatFun ? __VALUE.map((element, index, arr) => formatFun(element, index, arr)) : __VALUE);

                return '[' + space + __RET.join(',' + space) + space + ']';
            }

            return value;  // value ist, anders als in der Dokumentation beschrieben, bereits konvertiert!
        };
}

// Liefert eine generische Funktion zurueck, die einen String auf eine vorgegebene Weise rechtsbuending formatiert,
// indem er links mit den uebergebenen Zeichen aufgefuellt wird. Laenge und Zeichen werden fest vorgegeben.
// targetLength: Zielbreite, es wird allerdings nicht abgeschnitten (falls der Wert zu klein ist, bleibt das Original)
// padString: Auffuell-Zeichen oder -String (Muster), das ggfs. auf die richtige Laenge zugeschnitten wird
// return Generische Funktion mit fester Zielbreite und Fuellzeichen. Moegliche Nutzung: replaceArrayFun(padStartFun(4))
function padStartFun(targetLength = 4, padString = ' ') {
    return (value => String(value).padStart(targetLength, padString));
}

// Liefert eine generische Funktion zurueck, die einen String auf eine vorgegebene Weise linksbuending formatiert,
// indem er rechts mit den uebergebenen Zeichen aufgefuellt wird. Laenge und Zeichen werden fest vorgegeben.
// targetLength: Zielbreite, es wird allerdings nicht abgeschnitten (falls der Wert zu klein ist, bleibt das Original)
// padString: Auffuell-Zeichen oder -String (Muster), das ggfs. auf die richtige Laenge zugeschnitten wird
// return Generische Funktion mit fester Zielbreite und Fuellzeichen. Moegliche Nutzung: replaceArrayFun(padEndFun(4))
function padEndFun(targetLength = 4, padString = ' ') {
    return (value => String(value).padEnd(targetLength, padString));
}

// Liefert einen rechtsbuendigen Text zurueck, der links aufgefuellt wird
// value: Ein uebergebener Wert
// size: Zielbreite (clipping fuer < 0: Abschneiden, falls zu lang)
// char: Zeichen zum Auffuellen
// return Ein String, der mindestens |size| lang ist (oder genau, falls size < 0, also clipping)
function padLeft(value, size = 4, char = ' ') {
    const __SIZE = Math.abs(size);
    const __CLIP = (size < 0);
    const __VALUE = (value ? value.toString() : "");
    let i = __VALUE.length;
    let str = "";

    while (i < __SIZE) {
        str += char;
        i += char.length;
    }
    str = ((i > __SIZE) ? str.slice(0, __SIZE - __VALUE.length - 1) : str) + __VALUE;

    return (__CLIP ? str.slice(size) : str);
}

// Liefert eine rechtsbuendigen Zahl zurueck, der links (mit Nullen) aufgefuellt wird
// value: Eine uebergebene Zahl
// size: Zielbreite (Default: 2)
// char: Zeichen zum Auffuellen (Default: '0')
// forceClip: Abschneiden erzwingen, falls zu lang?
// return Eine Zahl als String, der mindestens 'size' lang ist (oder genau, falls size < 0, also clipping)
function padNumber(value, size = 2, char = '0') {
    if ((value === 0) || (value && isFinite(value))) {
        return padLeft(value, size, char);
    } else {
        return value;
    }
}

// Dreht den uebergebenen String um
// string: Eine Zeichenkette
// return Dieselbe Zeichenkette rueckwaerts
function reverseString(string) {
    let result = "";

    for (let i = string.length - 1; i >= 0; i--) {
        result += string.substr(i, 1);
    }

    return result;
}

// Identitaetsfunktion. Konvertiert nichts, sondern liefert einfach den Wert zurueck
// value: Der uebergebene Wert
// return Derselbe Wert
function sameValue(value) {
    return value;
}

// Existenzfunktion. Liefert zurueck, ob ein Wert belegt ist
// value: Der uebergebene Wert
// return Angabe ob Wert belegt ist
function existValue(value) {
    return !! value;
}

// Hilfsfunktion fuer Array.sort(): Vergleich zweier Zahlen
// valueA: Erster Zahlenwert
// valueB: Zweiter Zahlenwert
// return -1 = kleiner, 0 = gleich, +1 = groesser
function compareNumber(valueA, valueB) {
    return +(valueA > valueB) || (+(valueA === valueB) - 1);
}

// Gemeinsame Funktion fuer 'typeof' und 'instanceof', die sowohl fuer
//  Primitives als auch fuer Objekte funktioniert
// value: Objekt (Object, Array) oder primitiver Wert (Number, String, Boolean)
// return Bei Objekten aehnlich 'instanceof', bei Primitives aehnlich 'typeof'
//  Moegliche Ergebnisse: 'Undefined', 'Null', 'Number' (auch NaN), 'String',
//  'Boolean', 'Symbol', 'Function', 'Array', 'Object'
function typeOf(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
}

// Sicheres obj.valueOf() fuer alle Daten
// data: Objekt oder Wert
// return Bei Objekten valueOf() oder das Objekt selber, bei Werten der Wert
function valueOf(data) {
    const __USEMEMBER = (data && ((typeof data.valueOf) === 'function'));

    return (__USEMEMBER ? data.valueOf() : data);
}

// ==================== Ende Abschnitt fuer diverse Utilities fuer Werte ====================

// *** EOF ***
