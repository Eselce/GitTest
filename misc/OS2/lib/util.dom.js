// ==UserScript==
// _name         util.dom
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer DOM-Operationen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
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

// ==================== Abschnitt fuer sonstige Parameter ====================

// Fuegt eine Zelle ans Ende der uebergebenen Zeile hinzu und fuellt sie
// row: Zeile, die verlaengert wird
// content: Textinhalt der neuen Zelle
// color: Schriftfarbe der neuen Zelle (z.B. "#FFFFFF" fuer weiss)
// Bei Aufruf ohne Farbe wird die Standardfarbe benutzt
function appendCell(row, content, color) {
    row.insertCell(-1);

    const __COLIDX = row.cells.length - 1;

    row.cells[__COLIDX].textContent = content;
    row.cells[__COLIDX].align = "center";
    row.cells[__COLIDX].style.color = color;
}

// Fuegt eine Zelle ans Ende der uebergebenen Zeile hinzu und fuellt sie
// row: Zeile, die verlaengert wird
// content: HTML-Inhalt der neuen Zelle
// color: Schriftfarbe der neuen Zelle (z.B. "#FFFFFF" fuer weiss)
// Bei Aufruf ohne Farbe wird die Standardfarbe benutzt
function appendHTML(row, content, color) {
    row.insertCell(-1);

    const __COLIDX = row.cells.length - 1;

    row.cells[__COLIDX].innerHTML = content;
    row.cells[__COLIDX].align = "center";
    row.cells[__COLIDX].style.color = color;
}

// Formatiert eine Zelle um (mit einfachen Parametern)
// cell: Zu formatierende Zelle
// bold: Inhalt fett darstellen (true = ja, false = nein)
// color: Falls angegeben, die Schriftfarbe
// bgColor: Falls angegeben, die Hintergrundfarbe
// opacity: Falls angegeben, die Opazitaet
// return Die formatierte Zelle
function formatCell(cell, bold = true, color = undefined, bgColor = undefined, opacity = undefined) {
    if (cell) {
        if (bold) {
            cell.style.fontWeight = 'bold';
        }
        if (color) {
            cell.style.color = color;
        }
        if (bgColor) {
            cell.style.backgroundColor = bgColor;
        }
        if (opacity) {
            cell.style.opacity = opacity;
        }
    }

    return cell;
}

// Ermittelt ein Stil-Attribut in Abhaengigkeit der Klasse aus einem Array von Elementen
// elements: Array von Elementen
// propertyName: Name des gesuchten Attributs (value) oder undefined fuer alles
// keyFun: Funktion zur Ermittlung des Keys aus einem Element (key)
// return Liste von key/value-Paaren (<className> : <property> oder <className> : <style>)
function getStyleFromElements(elements, propertyName = undefined, keyFun = getClassNameFromElement) {
    const __ELEMENTS = getValue(elements, []);
    const __RET = { };

    for (let index = 0; index < __ELEMENTS.length; index++) {
        const __ELEMENT = __ELEMENTS[index];
        const __KEY = keyFun(__ELEMENT);
        const __STYLE = window.getComputedStyle(__ELEMENT);
        const __VALUE = (propertyName ? __STYLE[propertyName] : __STYLE);

        __RET[__KEY] = __VALUE;
    }

    return __RET;
}

// Default-KeyFun fuer getStyleFromElements(). Liefert den Klassennamen
// element: Ein Element
// return className des Elements
function getClassNameFromElement(element) {
    return element.className;
}

// Default-KeyFun fuer getStylePropFromElements(). Liefert den UpperCase-Klassennamen
// element: Ein Element
// return className des Elements in Grossbuchstaben
function getUpperClassNameFromElement(element) {
    return element.className.toUpperCase();
}

// ==================== Abschnitt fuer Selektion ====================

// Ermittelt die auszugewaehlenden Werte eines Selects (Combo-Box) als Array zurueck
// element: 'select'-Element oder dessen Name auf der HTML-Seite mit 'option'-Eintraegen der Combo-Box
// valType: Typ-Klasse der Optionswerte ('String', 'Number', ...)
// valFun: Funktion zur Ermittlung des Wertes eines 'option'-Eintrags (getSelectedOptionText, getSelectedValue, ...)
// defValue: Default-Wert, falls nichts selektiert ist
// return Array mit den Options-Werten
function getSelectionArray(element, valType = 'String', valFun = getSelectedValue, defValue = undefined) {
    const __SELECT = ((typeof element) === 'string' ? getValue(document.getElementsByName(element), [])[0] : element);

    return (__SELECT ? [].map.call(__SELECT.options, function(option) {
                                                         return this[valType](getValue(valFun(option), defValue));
                                                     }) : undefined);
}

// Ermittelt den ausgewaehlten Wert eines Selects (Combo-Box) und gibt diesen zurueck
// element: 'select'-Element oder dessen Name auf der HTML-Seite mit 'option'-Eintraegen der Combo-Box
// valType: Typ-Klasse der Optionswerte ('String', 'Number', ...)
// valFun: Funktion zur Ermittlung des Wertes eines 'option'-Eintrags (getSelectedOptionText, getSelectedValue, ...)
// defValue: Default-Wert, falls nichts selektiert ist
// return Ausgewaehlter Wert
function getSelection(element, valType = 'String', valFun = getSelectedOptionText, defValue = undefined) {
    const __SELECT = ((typeof element) === 'string' ? getValue(document.getElementsByName(element), [])[0] : element);

    return this[valType](getValue(valFun(__SELECT), defValue));
}

// Ermittelt den ausgewaehlten Wert einer Combo-Box und gibt diesen zurueck
// comboBox: Alle 'option'-Eintraege der Combo-Box
// defValue: Default-Wert, falls nichts selektiert ist
// valType: Typ-Klasse der Optionswerte ('String', 'Number', ...)
// return Ausgewaehlter Wert
function getSelectionFromComboBox(comboBox, defValue = undefined, valType = 'String') {
    let selection;

    for (let i = 0; i < comboBox.length; i++) {
        const __ENTRY = comboBox[i];

        if (__ENTRY.outerHTML.match(/selected/)) {
            selection = __ENTRY.textContent;
        }
    }

    return this[valType](getValue(selection, defValue));
}

// Liefert den Text (textContent) einer selektierten Option
// element: 'select'-Element auf der HTML-Seite mit 'option'-Eintraegen der Combo-Box
// return Wert der Selektion (textContent)
function getSelectedOptionText(element) {
    const __SELECTEDOPTIONS = getValue(element, { }).selectedOptions;
    const __OPTION = getValue(__SELECTEDOPTIONS, { })[0];

    return (__OPTION ? __OPTION.textContent : undefined);
}

// Liefert den 'value' einer selektierten Option
// element: 'select'-Element auf der HTML-Seite mit 'option'-Eintraegen der Combo-Box
// return Wert der Selektion ('value')
function getSelectedValue(element) {
    return getValue(element, { }).value;
}

// ==================== Abschnitt fuer Daten auslesen ====================

// Liest eine Zahl aus der Spalte einer Zeile der Tabelle aus (z.B. Alter, Geburtsdatum)
// cells: Die Zellen einer Zeile
// colIdxInt: Spaltenindex der gesuchten Werte
// return Spalteneintrag als Zahl (-1 fuer "keine Zahl", undefined fuer "nicht gefunden")
function getIntFromHTML(cells, colIdxInt) {
    const __CELL = getValue(cells[colIdxInt], { });
    const __TEXT = __CELL.textContent;

    if (__TEXT !== undefined) {
        try {
            const __VALUE = parseInt(__TEXT, 10);

            if (! isNaN(__VALUE)) {
                return __VALUE;
            }
        } catch (ex) { }

        return -1;
    }

    return undefined;
}

// Liest eine Dezimalzahl aus der Spalte einer Zeile der Tabelle aus
// cells: Die Zellen einer Zeile
// colIdxInt: Spaltenindex der gesuchten Werte
// return Spalteneintrag als Dezimalzahl (undefined fuer "keine Zahl" oder "nicht gefunden")
function getFloatFromHTML(cells, colIdxFloat) {
    const __CELL = getValue(cells[colIdxFloat], { });
    const __TEXT = __CELL.textContent;

    if (__TEXT !== undefined) {
        try {
            return parseFloat(__TEXT);
        } catch (ex) { }
    }

    return undefined;
}

// Liest einen String aus der Spalte einer Zeile der Tabelle aus
// cells: Die Zellen einer Zeile
// colIdxStr: Spaltenindex der gesuchten Werte
// return Spalteneintrag als String ("" fuer "nicht gefunden")
function getStringFromHTML(cells, colIdxStr) {
    const __CELL = getValue(cells[colIdxStr], { });
    const __TEXT = __CELL.textContent;

    return getValue(__TEXT.toString(), "");
}

// Liest ein erstes Element aus der Spalte einer Zeile der Tabelle aus
// cells: Die Zellen einer Zeile
// colIdxStr: Spaltenindex der gesuchten Werte
// return Spalteneintrag als Element (null fuer "nicht gefunden")
function getElementFromHTML(cells, colIdxStr) {
    const __CELL = getValue(cells[colIdxStr], { });

    return __CELL.firstElementChild;
}

// Liest einen String aus der Spalte einer Zeile der Tabelle aus, nachdem dieser konvertiert wurde
// cells: Die Zellen einer Zeile
// colIdxStr: Spaltenindex der gesuchten Werte
// convertFun: Funktion, die den Wert konvertiert
// return Spalteneintrag als String ("" fuer "nicht gefunden")
function convertStringFromHTML(cells, colIdxStr, convertFun = sameValue) {
    const __CELL = getValue(cells[colIdxStr], { });
    const __TEXT = convertFun(__CELL.textContent, __CELL, colIdxStr, 0);

    if (__TEXT !== undefined) {
        __CELL.innerHTML = __TEXT;
    }

    return getValue(__TEXT.toString(), "");
}

// Liest ein Array von String-Werten aus den Spalten ab einer Zeile der Tabelle aus, nachdem diese konvertiert wurden
// cells: Die Zellen einer Zeile
// colIdxArr: Erster Spaltenindex der gesuchten Werte
// arrOrLength: Entweder ein Datenarray zum Fuellen oder die Anzahl der zu lesenden Werte
// convertFun: Funktion, die die Werte konvertiert
// return Array mit Spalteneintraegen als String ("" fuer "nicht gefunden")
function convertArrayFromHTML(cells, colIdxArr, arrOrLength = 1, convertFun = sameValue) {
    const __ARR = ((typeof arrOrLength === 'number') ? { } : arrOrLength);
    const __LENGTH = getValue(__ARR.length, arrOrLength);
    const __RET = [];

    for (let index = 0, colIdx = colIdxArr; index < __LENGTH; index++, colIdx++) {
        const __CELL = getValue(cells[colIdx], { });
        const __TEXT = convertFun(getValue(__ARR[index], __CELL.textContent), __CELL, colIdx, index);

        if (__TEXT !== undefined) {
            __CELL.innerHTML = __TEXT;
        }

        __RET.push(getValue(__TEXT, "").toString());
    }

    return __RET;
}

// ==================== Ende Abschnitt fuer sonstige Parameter ====================

// *** EOF ***
