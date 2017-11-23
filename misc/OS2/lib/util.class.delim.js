// ==UserScript==
// _name         util.class.delim
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Class-Objekten zu Pfad-Trennern
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.delim.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse Delims ====================

// Basisklasse fuer die Verwaltung der Trennzeichen und Symbole von Pfaden
// delim: Trennzeichen zwischen zwei Ebenen (oder Objekt/Delims mit entsprechenden Properties)
// back: (Optional) Name des relativen Vaterverzeichnisses
// root: (Optional) Kennung vor dem ersten Trenner am Anfang eines absoluten Pfads
// home: (Optional) Kennung vor dem ersten Trenner am Anfang eines Pfads relativ zu Home
function Delims(delim, back, root, home) {
    'use strict';

    if ((typeof delim) === 'object') {
        // Erster Parameter ist Objekt mit den Properties...
        if (back === undefined) {
            back = delim.back;
        }
        if (root === undefined) {
            root = delim.root;
        }
        if (home === undefined) {
            home = delim.home;
        }
        delim = delim.delim;
    }

    this.setDelim(delim);
    this.setBack(back);
    this.setRoot(root);
    this.setHome(home);
}

Class.define(Delims, Object, {
              'setDelim'       : function(delim = undefined) {
                                     this.delim = delim;
                                 },
              'setBack'        : function(back = undefined) {
                                     this.back = back;
                                 },
              'setRoot'        : function(root = undefined) {
                                     this.root = root;
                                 },
              'setHome'        : function(home = undefined) {
                                     this.home = home;
                                 }
          });

// ==================== Ende Abschnitt fuer Klasse Delims ====================

// ==================== Abschnitt fuer Klasse UriDelims ====================

// Basisklasse fuer die Verwaltung der Trennzeichen und Symbole von URIs
// delim: Trennzeichen zwischen zwei Ebenen (oder Objekt/Delims mit entsprechenden Properties)
// back: (Optional) Name des relativen Vaterverzeichnisses
// root: (Optional) Kennung vor dem ersten Trenner am Anfang eines absoluten Pfads
// home: (Optional) Kennung vor dem ersten Trenner am Anfang eines Pfads relativ zu Home
// scheme: (Optional) Trennzeichen fuer den Schema-/Protokollnamen vorne
// host: (Optional) Prefix fuer Hostnamen hinter dem Scheme-Trenner
// port: (Optional) Trennzeichen vor der Portangabe, falls vorhanden
// query: (Optional) Trennzeichen fuer die Query-Parameter hinter dem Pfad
// parSep: (Optional) Trennzeichen zwischen je zwei Parametern
// parAss: (Optional) Trennzwischen zwischen Key und Value
// node: (Optional) Trennzeichen fuer den Knotennamen hinten (Fragment, Kapitel)
function UriDelims(delim, back, root, home, scheme, host, port, query, qrySep, qryAss, node) {
    'use strict';

    if ((typeof delim) === 'object') {
        // Erster Parameter ist Objekt mit den Properties...
        if (scheme === undefined) {
            scheme = delim.scheme;
        }
        if (host === undefined) {
            host = delim.host;
        }
        if (port === undefined) {
            port = delim.port;
        }
        if (query === undefined) {
            query = delim.query;
        }
        if (qrySep === undefined) {
            qrySep = delim.qrySep;
        }
        if (qryAss === undefined) {
            qryAss = delim.qryAss;
        }
        if (node === undefined) {
            node = delim.node;
        }
    }

    Delims.call(this, delim, back, root, home);

    this.setScheme(scheme);
    this.setHost(host);
    this.setPort(port);
    this.setQuery(query);
    this.setQrySep(qrySep);
    this.setQryAss(qryAss);
    this.setNode(node);
}

Class.define(UriDelims, Delims, {
              'setScheme'      : function(scheme = undefined) {
                                     this.scheme = scheme;
                                 },
              'setHost'        : function(host = undefined) {
                                     this.host = host;
                                 },
              'setPort'        : function(port = undefined) {
                                     this.port = port;
                                 },
              'setQuery'       : function(query = undefined) {
                                     this.query = query;
                                 },
              'setQrySep'      : function(qrySep = undefined) {
                                     this.qrySep = qrySep;
                                 },
              'setQryAss'      : function(qryAss = undefined) {
                                     this.qryAss = qryAss;
                                 },
              'setNode'        : function(node = undefined) {
                                     this.node = node;
                                 }
          });

// ==================== Ende Abschnitt fuer Klasse UriDelims ====================

// *** EOF ***
