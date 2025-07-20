// ==UserScript==
// _name         OS2.page
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifischen Funktionen zur Ermittlung von Daten auf den Seiten
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.page.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Parameter von den OS2-Seiten ====================

// Verarbeitet die URL der Seite und ermittelt die Nummer der gewuenschten Unterseite
// url: Adresse der Seite
// leafs: Liste von Filenamen mit Basis-Seitennummern (zu denen ggfs. Query-Parameter addiert wird)
// item: Query-Parameter, der die Nummer der Unterseite angibt (wird zur Basisnummer addiert),
//      allerdings nur, wenn Basis-Seitennummer positiv ist, ansonsten Absolutwert ohne Unterseite
// return Parameter aus der URL der Seite als Nummer (-1, falls nicht gefunden)
function getPageIdFromURL(url, leafs, item = 'page') {
    const __URI = new URI(url);
    const __LEAF = __URI.getLeaf();

    for (let leaf in leafs) {
        if (__LEAF === leaf) {
            const __BASE = getValue(leafs[leaf], 0);
            const __ITEM = getValue(__URI.getQueryPar(item), 0);

            return Math.abs(__BASE) + ((__BASE >= 0) ? __ITEM : 0);
        }
    }

    return -1;
}

// Gibt die laufende Nummer des ZATs im Text einer Zelle zurueck
// cell: Tabellenzelle mit der ZAT-Nummer im Text
// return ZAT-Nummer im Text
function getZATNrFromCell(cell) {
    const __TEXT = ((cell === undefined) ? [] : cell.textContent.split(' '));
    let ZATNr = 0;

    for (let i = 1; (ZATNr === 0) && (i < __TEXT.length); i++) {
        if (__TEXT[i - 1] === "ZAT") {
            if (__TEXT[i] !== "ist") {
                ZATNr = parseInt(__TEXT[i], 10);
            }
        }
    }

    return ZATNr;
}

// Ermittelt das Spiel-Ergebnis aus einer Tabellenzelle, etwa "2 : 1", und liefert zwei Werte zurueck
// cell: Tabellenzelle mit Eintrag "2 : 1"
// return { '2', '1' } im Beispiel
function getErgebnisFromCell(cell) {
    const __ERGEBNIS = cell.textContent.split(" : ", 2);

    return __ERGEBNIS;
}

// Ermittelt das Spiel-Ergebnis aus einer Tabellenzelle und setzt tore/gtore im Spielplanzeiger
// currZAT: Enthaelt den Spielplanzeiger auf den aktuellen ZAT
// cell: Tabellenzelle mit Eintrag "2 : 1"
// return Modifizierter Spielplanzeiger
function setErgebnisFromCell(currZAT, cell) {
    const __ERGEBNIS = getErgebnisFromCell(cell);

    if (__ERGEBNIS.length === 2) {
        currZAT.gFor = parseInt(__ERGEBNIS[0], 10);
        currZAT.gAga = parseInt(__ERGEBNIS[1], 10);
    } else {
        currZAT.gFor = -1;
        currZAT.gAga = -1;
    }

    return currZAT;
}

// Liest aus, ob der Spieler Torwart oder Feldspieler ist (Version mit Zelle)
// cell: Eine fuer TOR eingefaerbte Zelle
// return Angabe, der Spieler Torwart oder Feldspieler ist
function isGoalieFromCell(cell) {
    return (cell.className === 'TOR');
}

// Liest aus, ob der Spieler Torwart oder Feldspieler ist (Version mit Zell-Array)
// cells: Die Zellen einer Zeile
// colIdxClass: Spaltenindex einer fuer TOR eingefaerbten Zelle (Default: 0)
// return Angabe, der Spieler Torwart oder Feldspieler ist
function isGoalieFromHTML(cells, colIdxClass = 0) {
    return isGoalieFromCell(cells[colIdxClass]);
}

// ==================== Ende Abschnitt fuer Parameter von den OS2-Seiten ====================

// ==================== Abschnitt fuer Hilfsfunktionen ====================

// Liefert umschlossenen textContent und einen der einem <A>-Link uebergebenen Parameter.
// Als Drittes wird optional der ganze Ziel-Link (das href) zurueckgegeben.
// element: Eine <A>-Node mit href-Link
// queryID: Name des Parameters innerhalb der URL, der die ID liefert
// return Text, ID und href-Link
function getLinkData(element, queryID) {
    checkType(element && element.href, 'string', true, 'getLinkData', 'element.href', 'String');
    checkType(queryID, 'string', false, 'getLinkData', 'queryID', 'String');

    const __A = element; // <A href="https://.../...?QUERYID=ID">TEXT</A>
    const __TEXT = __A.textContent;
    const __HREF = __A.href;
    const __URI = new URI(__HREF);
    const __ID = __URI.getQueryPar(queryID);

    return [ __TEXT, __ID, __HREF ];
}

// Liefert den HTML-Code fuer einen parametrisierten <IMG>-Link.
// imageURL: URL des verlinkten Bildes
// title: Tooltip des Bildes (Default: null fuer kein Tooltip)
// altText: ALT-Parameter fuer Ausgabe ohne Bild (Default: Tooltip-Text)
// return String mit HTML-Code des <IMG>-Links
function getImgLink(imageURL, title = null, altText = title) {
    checkType(imageURL, 'string', true, 'getImgLink', 'imageURL', 'String');
    checkType(title, 'string', false, 'getImgLink', 'title', 'String');
    checkType(altText, 'string', false, 'getImgLink', 'altText', 'String');

    const __ALTSTR = (altText ? (' alt="' + altText + '"') : "");
    const __IMGSTR = '<IMG src="' + imageURL + '"' + __ALTSTR + ' />';
    const __RETSTR = (title ? ('<ABBR title="' + title + '">' + __IMGSTR + '</ABBR>') : __IMGSTR);

    return __RETSTR;
}

// Liefert den HTML-Code fuer einen parametrisierten <A>-Link auf ein OS-Team.
// teamName: Name des Teams fuer den textContent
// osID: OS-ID des Teams
// return String mit HTML-Code des <A>-Team-Links
function getTeamLink(teamName, osID) {
    checkType(teamName, 'string', true, 'getTeamLink', 'teamName', 'String');
    checkType(osID, 'number', true, 'getTeamLink', 'osID', 'Number');

    const __RETSTR = '<A href="/st.php?c=' + osID + '" onClick="teaminfo(' + osID + '); return false;">' + teamName + '</A>';

    return __RETSTR;
}

// Liefert den HTML-Code fuer einen parametrisierten <A>-Link auf das Manager-PM-Fenster.
// managerName: Name des Managers fuer den textContent
// pmID: User-ID des Managers im PM-System von OS2
// return String mit HTML-Code des <A>-Manager-Links, falls pmID okay, ansonsten nur Managername geklammert
function getManagerLink(managerName, pmID) {
    checkType(managerName, 'string', true, 'getManagerLink', 'managerName', 'String');
    checkType(pmID, 'number', true, 'getManagerLink', 'pmID', 'Number');

    const __RETSTR = (pmID > -1) ? ('<A href="/osneu/pm?action=writeNew&receiver_id=' + pmID
                    + '" onclick="writePM(" + pmID + "); return false;" target="_blank">'
                    + managerName + '</A>') : ('(' + managerName + ')');

    return __RETSTR;
}

// ==================== Ende Abschnitt fuer Hilfsfunktionen ====================

// *** EOF ***
