// ==UserScript==
// _name         util.dom
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer DOM-Operationen
// _require      https://eselce.github.io/OS2.scripts/lib/util.dom.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer diverse DOM-Utilities ====================

// Legt Input-Felder in einem Form-Konstrukt an, falls noetig
// form: <form>...</form>
// props: Map von name:value-Paaren
// type: Typ der Input-Felder (Default: unsichtbare Daten)
// return Ergaenztes Form-Konstrukt
function addInputField(form, props, type = 'hidden') {
    for (let fieldName in props) {
        let field = form[fieldName];
        if (! field) {
            field = document.createElement('input');
            field.type = type;
            field.name = fieldName;
            form.appendChild(field);
        }
        field.value = props[fieldName];
    }

    return form;
}

// Legt unsichtbare Input-Daten in einem Form-Konstrukt an, falls noetig
// form: <form>...</form>
// props: Map von name:value-Paaren
// return Ergaenztes Form-Konstrukt
function addHiddenField(form, props) {
    return addInputField(form, props, 'hidden');
}

// Hilfsfunktion fuer alle Browser: Fuegt fuer ein Event eine Reaktion ein
// obj: Betroffenes Objekt, z.B. ein Eingabeelement
// type: Name des Events, z.B. "click"
// callback: Funktion als Reaktion
// capture: Event fuer Parent zuerst (true) oder Child (false als Default)
// return false bei Misserfolg
function addEvent(obj, type, callback, capture = false) {
    if (obj.addEventListener) {
        return obj.addEventListener(type, callback, capture);
    } else if (obj.attachEvent) {
        return obj.attachEvent('on' + type, callback);
    } else {
        __LOG[0]("Could not add " + type + " event:");
        __LOG[2](callback);

        return false;
    }
}

// Hilfsfunktion fuer alle Browser: Entfernt eine Reaktion fuer ein Event
// obj: Betroffenes Objekt, z.B. ein Eingabeelement
// type: Name des Events, z.B. "click"
// callback: Funktion als Reaktion
// capture: Event fuer Parent zuerst (true) oder Child (false als Default)
// return false bei Misserfolg
function removeEvent(obj, type, callback, capture = false) {
    if (obj.removeEventListener) {
        return obj.removeEventListener(type, callback, capture);
    } else if (obj.detachEvent) {
        return obj.detachEvent('on' + type, callback);
    } else {
        __LOG[0]("Could not remove " + type + " event:");
        __LOG[2](callback);

        return false;
    }
}

// Hilfsfunktion fuer alle Browser: Fuegt fuer ein Event eine Reaktion ein
// id: ID des betroffenen Eingabeelements
// type: Name des Events, z.B. "click"
// callback: Funktion als Reaktion
// capture: Event fuer Parent zuerst (true) oder Child (false als Default)
// return false bei Misserfolg
function addDocEvent(id, type, callback, capture = false) {
    const __OBJ = document.getElementById(id);

    return addEvent(__OBJ, type, callback, capture);
}

// Hilfsfunktion fuer alle Browser: Entfernt eine Reaktion fuer ein Event
// id: ID des betroffenen Eingabeelements
// type: Name des Events, z.B. "click"
// callback: Funktion als Reaktion
// capture: Event fuer Parent zuerst (true) oder Child (false als Default)
// return false bei Misserfolg
function removeDocEvent(id, type, callback, capture = false) {
    const __OBJ = document.getElementById(id);

    return removeEvent(__OBJ, type, callback, capture);
}

// Hilfsfunktion fuer die Ermittlung eines Elements der Seite
// name: Name des Elements (siehe "name=")
// index: Laufende Nummer des Elements (0-based), Default: 0
// doc: Dokument (document)
// return Gesuchtes Element mit der lfd. Nummer index oder undefined (falls nicht gefunden)
function getElement(name, index = 0, doc = document) {
    const __TAGS = doc.getElementsByName(name);
    const __TABLE = (__TAGS ? __TAGS[index] : undefined);

    return __TABLE;
}

// Hilfsfunktion fuer die Ermittlung eines Elements der Seite (Default: Tabelle)
// index: Laufende Nummer des Elements (0-based)
// tag: Tag des Elements ("table")
// doc: Dokument (document)
// return Gesuchtes Element oder undefined (falls nicht gefunden)
function getTable(index, tag = 'table', doc = document) {
    const __TAGS = doc.getElementsByTagName(tag);
    const __TABLE = (__TAGS ? __TAGS[index] : undefined);

    return __TABLE;
}

// Hilfsfunktion fuer die Ermittlung der Zeilen einer Tabelle
// name: Name des Tabellen-Elements (siehe "name=")
// index: Laufende Nummer des Tabellen-Elements (0-based), Default: 0
// doc: Dokument (document)
// return Gesuchte Zeilen oder undefined (falls nicht gefunden)
function getElementRows(name, index = 0, doc = document) {
    const __TABLE = getElement(name, index, doc);
    const __ROWS = (__TABLE ? __TABLE.rows : undefined);

    return __ROWS;
}

// Hilfsfunktion fuer die Ermittlung der Zeilen einer Tabelle
// index: Laufende Nummer des Elements (0-based)
// doc: Dokument (document)
// return Gesuchte Zeilen oder undefined (falls nicht gefunden)
function getRows(index, doc = document) {
    const __TABLE = getTable(index, 'table', doc);
    const __ROWS = (__TABLE ? __TABLE.rows : undefined);

    return __ROWS;
}

// Hilfsfunktion fuer die Ermittlung der Zeilen einer Tabelle
// id: ID des Tabellen-Elements
// doc: Dokument (document)
// return Gesuchte Zeilen oder undefined (falls nicht gefunden)
function getRowsById(id, doc = document) {
    const __TABLE = doc.getElementById(id);
    const __ROWS = (__TABLE ? __TABLE.rows : undefined);

    return __ROWS;
}

// ==================== Ende Abschnitt fuer diverse DOM-Utilities ====================

// *** EOF ***
