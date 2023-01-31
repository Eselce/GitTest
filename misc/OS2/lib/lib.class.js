/****** JavaScript-Bibliothek 'lib.class.js' ["CLASS"] ******/

// Inhaltsverzeichnis:
// https://eselce.github.io/GitTest/misc/OS2/lib/<CLASS>: 
//  util.class.js
//  util.class.delim.js
//  util.class.path.js
//  util.class.uri.js
//  util.class.report.js

/*** Modul util.class.js ***/

// ==UserScript==
// _name         util.class
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Class-Objekte
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Polyfill fuer showAlert() ====================

if ((typeof showAlert) === 'undefined') {
    this.showAlert = console.error;
}

// ==================== Abschnitt fuer Klasse Class ====================

/*class*/ function Class /*{
    constructor*/(className, baseClass, initFun) {
        'use strict';

        try {
            const __BASE = ((baseClass !== undefined) ? baseClass : Object);
            const __BASEPROTO = (__BASE ? __BASE.prototype : undefined);
            const __BASECLASS = (__BASEPROTO ? __BASEPROTO.__class : undefined);

            this.className = (className || '?');
            this.baseClass = __BASECLASS;
            Object.setConst(this, 'baseProto', __BASEPROTO, false);

            if (! initFun) {
                const __BASEINIT = (__BASECLASS || { }).init;

                if (__BASEINIT) {
                    initFun = function() {
                                  // Basisklassen-Init aufrufen...
                                  return __BASEINIT.apply(this, arguments);
                              };
                } else {
                    initFun = function() {
                                  // Basisklassen-Init fehlt (und Basisklasse ist nicht Object)...
                                  return false;
                              };
                }
            }

            console.assert((__BASE === null) || ((typeof __BASE) === 'function'), "No function:", __BASE);
            console.assert((typeof initFun) === 'function', "Not a function:", initFun);

            this.init = initFun;
        } catch (ex) {
            return showException('[' + (ex && ex.lineNumber) + "] Error in Class " + className, ex);
        }
    }
//}

Class.define = function(subClass, baseClass, members = undefined, initFun = undefined, createProto = true) {
        return (subClass.prototype = subClass.subclass(baseClass, members, initFun, createProto));
    };

Object.setConst = function(obj, item, value, config) {
        return Object.defineProperty(obj, item, {
                        enumerable   : false,
                        configurable : (config || true),  // TODO
                        writable     : false,
                        value        : value
                    });
    };

Object.setConst(Object.prototype, 'subclass', function(baseClass, members, initFun, createProto) {
        'use strict';

        try {
            const __MEMBERS = (members || { });
            const __CREATEPROTO = ((createProto === undefined) ? true : createProto);

            console.assert((typeof this) === 'function', "Not a function:", this);
            console.assert((typeof __MEMBERS) === 'object', "Not an object:", __MEMBERS);

            const __CLASS = new Class(this.name || __MEMBERS.__name, baseClass, initFun || __MEMBERS.__init);
            const __PROTO = (__CREATEPROTO ? Object.create(__CLASS.baseProto) : this.prototype);

            for (let item in __MEMBERS) {
                if ((item !== '__name') && (item !== '__init')) {
                    Object.setConst(__PROTO, item, __MEMBERS[item]);
                }
            }

            Object.setConst(__PROTO, 'constructor', this);

            Object.setConst(__PROTO, '__class', __CLASS, ! __CREATEPROTO);

            return __PROTO;
        } catch (ex) {
            return showException('[' + (ex && ex.lineNumber) + "] Error in subclassing", ex);
        }
    }, false);

Class.define(Object, null, {
                    '__init'       : function() {
                                         // Oberstes Basisklassen-Init...
                                         return true;
                                     },
                    'getClass'     : function() {
                                         return this.__class;
                                     },
                    'getClassName' : function() {
                                         const __CLASS = this.getClass();

                                         return (__CLASS ? __CLASS.getName() : undefined);
                                     },
                    'setConst'     : function(item, value, config = undefined) {
                                         return Object.setConst(this, item, value, config);
                                     }
                }, undefined, false);

Class.define(Function, Object);

Class.define(Class, Object, {
                    'getName'      : function() {
                                         return this.className;
                                     }
                });

// ==================== Ende Abschnitt fuer Klasse Class ====================

// ==================== Abschnitt fuer Hilfsfunktionen ====================

//
// Hilfsfunktionen, die von Options.toString() genutzt werden
//

// Liefert die Klasse des Objektes
// obj: Das Objekt, um das es geht
// return Klassenname der Klasse des Objektes
function getClass(obj) {
    if (obj != undefined) {
        if ((typeof obj) === 'object') {
            if (obj.getClass) {
                return obj.getClass();
            }
        }
    }

    return undefined;
}

// Liefert den Klassennamen des Objektes
// obj: Das Objekt, um das es geht
// return Klassenname der Klasse des Objektes
function getClassName(obj) {
    const __CLASS = getClass(obj);

    return ((__CLASS ? __CLASS.className : undefined));  // __CLASS.getName() problematisch?
}

// ==================== Abschnitt fuer Hilfsfunktionen ====================

// *** EOF ***

/*** Ende Modul util.class.js ***/

/*** Modul util.class.delim.js ***/

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

/*** Ende Modul util.class.delim.js ***/

/*** Modul util.class.path.js ***/

// ==UserScript==
// _name         util.class.path
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Class-Objekten zu Pfad, Verzeichnis und Objektreferenz
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.delim.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.path.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse Path ====================

// Basisklasse fuer die Verwaltung eines Pfades
// homePath: Absoluter Startpfad als String
// delims: Objekt mit Trennern und Symbolen als Properties (oder Delims-Objekt)
// 'delim': Trennzeichen zwischen zwei Ebenen
// 'back': Name des relativen Vaterverzeichnisses
// 'root': Kennung vor dem ersten Trenner am Anfang eines absoluten Pfads
// 'home': Kennung vor dem ersten Trenner am Anfang eines Pfads relativ zu Home

/*class*/ function Path /*{
    constructor*/(homePath, delims) {
        'use strict';

        this.dirs = [];
        this.setDelims(delims);
        this.homeDirs = this.getDirs(homePath, { 'home' : "" });

        this.home();
    }
//}

Class.define(Path, Object, {
                  'root'           : function() {
                                         this.dirs.splice(0, this.dirs.length);
                                     },
                  'home'           : function() {
                                         this.dirs = this.homeDirs.slice();
                                     },
                  'up'             : function() {
                                         this.dirs.pop();
                                     },
                  'down'           : function(subDir) {
                                         this.dirs.push(subDir);
                                     },
                  'setDelims'      : function(delims = undefined) {
                                         this.setConst('delims', new Delims(delims));
                                     },
                  'setDelim'       : function(delim = undefined) {
                                         this.delims.setDelim(delim || '/');
                                     },
                  'setBackDelim'   : function(backDelim = undefined) {
                                         this.delims.setBack(backDelim || "..");
                                     },
                  'setRootDelim'   : function(rootDelim = undefined) {
                                         this.delims.setRoot(rootDelim || "");
                                     },
                  'setHomeDelim'   : function(homeDelim = undefined) {
                                         this.delims.setHome(homeDelim || '~');
                                     },
                  'setSchemeDelim' : function(schemeDelim = undefined) {
                                         this.delims.setScheme(schemeDelim || ':');
                                     },
                  'setHostDelim'   : function(hostDelim = undefined) {
                                         this.delims.setHost(hostDelim || '//');
                                     },
                  'setPortDelim'   : function(portDelim = undefined) {
                                         this.delims.setHost(portDelim || ':');
                                     },
                  'setQueryDelim'  : function(queryDelim = undefined) {
                                         this.delims.setQuery(queryDelim || '?');
                                     },
                  'setParSepDelim' : function(parSepDelim = undefined) {
                                         this.delims.setParSep(parSepDelim || '&');
                                     },
                  'setParAssDelim' : function(parAssDelim = undefined) {
                                         this.delims.setParAss(parAssDelim || '=');
                                     },
                  'setNodeDelim'   : function(nodeDelim = undefined) {
                                         this.delims.setNode(nodeDelim || '#');
                                     },
                  'getLeaf'        : function(dirs = undefined) {
                                         const __DIRS = (dirs || this.dirs);

                                         return ((__DIRS && __DIRS.length) ? __DIRS.slice(-1)[0] : "");
                                     },
                  'getPath'        : function(dirs = undefined, delims = undefined) {
                                         const __DELIMS = new Delims(delims);
                                         const __DELIM = (__DELIMS.delim || this.delims.delim);
                                         const __ROOTDELIM = ((__DELIMS.root !== undefined) ? __DELIMS.root : this.delims.root);
                                         const __DIRS = (dirs || this.dirs);

                                         return __ROOTDELIM + __DELIM + __DIRS.join(__DELIM);
                                     },
                  'getDirs'        : function(path = undefined, delims = undefined) {
                                         const __DELIMS = new Delims(delims);
                                         const __DELIM = (__DELIMS.delim || this.delims.delim);
                                         const __ROOTDELIM = ((__DELIMS.root !== undefined) ? __DELIMS.root : this.delims.root);
                                         const __HOMEDELIM = ((__DELIMS.home !== undefined) ? __DELIMS.home : this.delims.home);
                                         const __DIRS = (path ? path.split(__DELIM) : []);
                                         const __FIRST = __DIRS[0];

                                         if (__FIRST && (__FIRST !== __ROOTDELIM) && (__FIRST !== __HOMEDELIM)) {
                                             showAlert("Kein absoluter Pfad", this.getPath(__DIRS), this);
                                         }

                                         return __DIRS.slice(1);
                                     }
                });

// ==================== Ende Abschnitt fuer Klasse Path ====================

// ==================== Abschnitt fuer Klasse Directory ====================

// Basisklasse fuer eine Verzeichnisstruktur
// homePath: Absoluter Startpfad als String
// delims: Objekt mit Trennern und Symbolen als Properties (oder Delims-Objekt)
// 'delim': Trennzeichen zwischen zwei Ebenen
// 'back': Name des relativen Vaterverzeichnisses
// 'root': Kennung vor dem ersten Trenner am Anfang eines absoluten Pfads
// 'home': Kennung vor dem ersten Trenner am Anfang eines Pfads relativ zu Home
function Directory(homePath, delims) {
    'use strict';

    Path.call(this, homePath, delims);
}

Class.define(Directory, Path, {
                    'chDir' : function(subDir = undefined) {
                                  if (subDir === undefined) {
                                      this.root();
                                  } else if ((typeof subDir) === 'object') {
                                      for (let sub of subDir) {
                                          this.chDir(sub);
                                      }
                                  } else {
                                      if (subDir === this.delims.home) {
                                          this.home();
                                      } else if (subDir === this.delims.back) {
                                          this.up();
                                      } else {
                                          this.down(subDir);
                                      }
                                  }
                              },
                    'pwd'   : function() {
                                  return this.getPath();
                              }
                });

// ==================== Ende Abschnitt fuer Klasse Directory ====================

// ==================== Abschnitt fuer Klasse ObjRef ====================

// Basisklasse fuer eine Objekt-Referenz
function ObjRef(rootObj) {
    'use strict';

    Directory.call(this, undefined, new Delims('/', "..", '/', '~'));

    this.setConst('rootObj', rootObj);  // Wichtig: Verweis nicht verfolgen! Gefahr durch Zyklen!
}

Class.define(ObjRef, Directory, {
                    'valueOf' : function() {
                                    let ret = this.rootObj;

                                    for (let name of this.dirs) {
                                        if (ret === undefined) {
                                            break;
                                        }
                                        ret = ret[name];
                                    }

                                    return ret;
                                }
                });

// ==================== Ende Abschnitt fuer Klasse ObjRef ====================

// *** EOF ***

/*** Ende Modul util.class.path.js ***/

/*** Modul util.class.uri.js ***/

// ==UserScript==
// _name         util.class.uri
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Class-Objekt fuer URIs
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.delim.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.path.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.uri.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse URI ====================

// Basisklasse fuer die Verwaltung einer URI/URL
// homePath: Absoluter Startpfad als String
// delims: Objekt mit Trennern und Symbolen als Properties (oder Delims-Objekt)
// 'delim': Trennzeichen zwischen zwei Ebenen
// 'back': Name des relativen Vaterverzeichnisses
// 'root': Kennung vor dem ersten Trenner am Anfang eines absoluten Pfads
// 'home': Kennung vor dem ersten Trenner am Anfang eines Pfads relativ zu Home

/*class*/ function URI /*extends Path {
    constructor*/(homePath, delims) {
        'use strict';

        UNUSED(delims);

        Path.call(this);

        const __HOSTPORT = this.getHostPort(homePath);

        this.scheme = this.getSchemePrefix(homePath);
        this.host = __HOSTPORT.host;
        this.port = this.parseValue(__HOSTPORT.port);
        this.query = this.parseQuery(this.getQueryString(homePath));
        this.node = this.getNodeSuffix(homePath);

        this.homeDirs = this.getDirs(homePath, { 'home' : "" });

        this.home();
    }
//}

Class.define(URI, Path, {
               'setDelims'         : function() {
                                         this.setConst('delims', new UriDelims('/', "..", "", '~', ':', "//", ':', '?', '&', '=', '#'));
                                     },
               'setSchemeDelim'    : function(schemeDelim = undefined) {
                                         this.delims.setScheme(schemeDelim || ':');
                                     },
               'setQueryDelim'     : function(queryDelim = undefined) {
                                         this.delims.setQuery(queryDelim || '?');
                                     },
               'setParSepDelim'    : function(parSepDelim = undefined) {
                                         this.delims.setParSep(parSepDelim || '&');
                                     },
               'setParAssDelim'    : function(parAssDelim = undefined) {
                                         this.delims.setParAss(parAssDelim || '=');
                                     },
               'setNodeDelim'      : function(nodeDelim = undefined) {
                                         this.delims.setNode(nodeDelim || '#');
                                     },
               'getServerPath'     : function(path = undefined) {
                                         return this.stripHostPort(this.stripQueryString(this.stripNodeSuffix(this.stripSchemePrefix(path))));
                                     },
               'getHostPort'       : function(path = undefined) {
                                         const __HOSTDELIM = this.delims.host;
                                         const __PORTDELIM = this.delims.port;
                                         const __ROOTDELIM = this.delims.root + this.delims.delim;
                                         const __NOSCHEME = this.stripSchemePrefix(path);
                                         const __INDEXHOST = (__NOSCHEME ? __NOSCHEME.indexOf(__HOSTDELIM) : -1);
                                         const __PATH = ((~ __INDEXHOST) ? __NOSCHEME.substring(__INDEXHOST + __HOSTDELIM.length) : __NOSCHEME);
                                         const __INDEXHOSTPORT = (__PATH ? __PATH.indexOf(__ROOTDELIM) : -1);
                                         const __HOSTPORT = ((~ __INDEXHOSTPORT) ? __PATH.substring(0, __INDEXHOSTPORT) : undefined);
                                         const __INDEXPORT = (__HOSTPORT ? __HOSTPORT.indexOf(__PORTDELIM) : -1);
                                         const __HOST = ((~ __INDEXPORT) ? __HOSTPORT.substring(0, __INDEXPORT) : __HOSTPORT);
                                         const __PORT = ((~ __INDEXPORT) ? __HOSTPORT.substring(__INDEXPORT + __PORTDELIM.length) : undefined);

                                         return {
                                                    'host' : __HOST,
                                                    'port' : __PORT
                                                };
                                     },
               'stripHostPort'     : function(path = undefined) {
                                         const __HOSTDELIM = this.delims.host;
                                         const __ROOTDELIM = this.delims.root + this.delims.delim;
                                         const __INDEXHOST = (path ? path.indexOf(__HOSTDELIM) : -1);
                                         const __PATH = ((~ __INDEXHOST) ? path.substring(__INDEXHOST + __HOSTDELIM.length) : path);
                                         const __INDEXHOSTPORT = (__PATH ? __PATH.indexOf(__ROOTDELIM) : -1);

                                         return ((~ __INDEXHOSTPORT) ? __PATH.substring(__INDEXHOSTPORT) : __PATH);
                                     },
               'getSchemePrefix'   : function(path = undefined) {
                                         const __SCHEMEDELIM = this.delims.scheme;
                                         const __INDEXSCHEME = (path ? path.indexOf(__SCHEMEDELIM) : -1);

                                         return ((~ __INDEXSCHEME) ? path.substring(0, __INDEXSCHEME) : undefined);
                                     },
               'stripSchemePrefix' : function(path = undefined) {
                                         const __SCHEMEDELIM = this.delims.scheme;
                                         const __INDEXSCHEME = (path ? path.indexOf(__SCHEMEDELIM) : -1);

                                         return ((~ __INDEXSCHEME) ? path.substring(__INDEXSCHEME + __INDEXSCHEME.length) : path);
                                     },
               'getNodeSuffix'     : function(path = undefined) {
                                         const __NODEDELIM = this.delims.node;
                                         const __INDEXNODE = (path ? path.lastIndexOf(__NODEDELIM) : -1);

                                         return ((~ __INDEXNODE) ? path.substring(__INDEXNODE + __NODEDELIM.length) : undefined);
                                     },
               'stripNodeSuffix'   : function(path = undefined) {
                                         const __NODEDELIM = this.delims.node;
                                         const __INDEXNODE = (path ? path.lastIndexOf(__NODEDELIM) : -1);

                                         return ((~ __INDEXNODE) ? path.substring(0, __INDEXNODE) : path);
                                     },
               'getQueryString'    : function(path = undefined) {
                                         const __QUERYDELIM = this.delims.query;
                                         const __PATH = this.stripNodeSuffix(path);
                                         const __INDEXQUERY = (__PATH ? __PATH.indexOf(__QUERYDELIM) : -1);

                                         return ((~ __INDEXQUERY) ? __PATH.substring(__INDEXQUERY + __QUERYDELIM.length) : undefined);
                                     },
               'stripQueryString'  : function(path = undefined) {
                                         const __QUERYDELIM = this.delims.query;
                                         const __INDEXQUERY = (path ? path.indexOf(__QUERYDELIM) : -1);

                                         return ((~ __INDEXQUERY) ? path.substring(0, __INDEXQUERY) : path);
                                     },
               'formatParams'      : function(params = [], formatFun = sameValue, delim = ' ', assign = '=') {
                                         const __PARAMS = [];

                                         for (let param in params) {
                                             __PARAMS.push(param + assign + formatFun(params[param]));
                                         }

                                         return __PARAMS.join(delim);
                                     },
               'parseParams'       : function(params, parseFun, delim = ' ', assign = '=') {
                                         const __RET = { };

                                         if (params) {
                                             const __PARAMS = params.split(delim);

                                             for (let index = 0; index < __PARAMS.length; index++) {
                                                 const __PARAM = __PARAMS[index];

                                                 if (__PARAM) {
                                                     const __INDEX = __PARAM.indexOf(assign);
                                                     const __KEY = ((~ __INDEX) ? __PARAM.substring(0, __INDEX) : __PARAM);
                                                     const __VAL = ((~ __INDEX) ? parseFun(__PARAM.substring(__INDEX + assign.length)) : true);

                                                     __RET[__KEY] = __VAL;
                                                 }
                                             }
                                         }

                                         return __RET;
                                     },
               'rawValue'          : function(value) {
                                         return value;
                                     },
               'parseValue'        : function(value) {
                                         const __VALUE = Number(value);

                                         if (__VALUE == value) {  // schwacher Vergleich true, also Number
                                             return __VALUE;
                                         } else {
                                             const __LOWER = (value ? value.toLowerCase() : undefined);

                                             if ((__LOWER === 'true') || (__LOWER === 'false')) {
                                                 return (value === 'true');
                                             }
                                         }

                                         return value;
                                     },
               'getQuery'          : function(delims = { }) {
                                         const __QRYSEP = ((delims.qrySep !== undefined) ? delims.qrySep : this.delims.qrySep);
                                         const __QRYASS = ((delims.qryAss !== undefined) ? delims.qryAss : this.delims.qryAss);

                                         return this.formatParams(this.query, this.rawValue, __QRYSEP, __QRYASS);
                                     },
               'parseQuery'        : function(path = undefined, delims = { }) {
                                         const __QRYSEP = ((delims.qrySep !== undefined) ? delims.qrySep : this.delims.qrySep);
                                         const __QRYASS = ((delims.qryAss !== undefined) ? delims.qryAss : this.delims.qryAss);

                                         return this.parseParams(path, this.parseValue, __QRYSEP, __QRYASS);
                                     },
               'setQuery'          : function(query) {
                                         this.query = query;
                                     },
               'setQueryPar'       : function(key, value) {
                                         this.query[key] = value;
                                     },
               'getQueryPar'       : function(key) {
                                         return this.query[key];
                                     },
               'getPath'           : function(dirs = undefined, delims = undefined) {
                                         const __DELIMS = new UriDelims(delims);
                                         const __SCHEMEDELIM = ((__DELIMS.scheme !== undefined) ? __DELIMS.scheme : this.delims.scheme);
                                         const __HOSTDELIM = ((__DELIMS.host !== undefined) ? __DELIMS.host : this.delims.host);
                                         const __PORTDELIM = ((__DELIMS.port !== undefined) ? __DELIMS.port : this.delims.port);
                                         const __QUERYDELIM = ((__DELIMS.query !== undefined) ? __DELIMS.query : this.delims.query);
                                         const __NODEDELIM = ((__DELIMS.node !== undefined) ? __DELIMS.node : this.delims.node);
                                         const __SCHEMENAME = this.scheme;
                                         const __SCHEME = (__SCHEMENAME ? __SCHEMENAME + __SCHEMEDELIM : "");
                                         const __HOSTNAME = this.host;
                                         const __HOST = (__HOSTNAME ? __HOSTDELIM + __HOSTNAME : "");
                                         const __PORTNR = this.port;
                                         const __PORT = ((__HOSTNAME && __PORTNR) ? __PORTDELIM + __PORTNR : "");
                                         const __QUERYSTR = this.getQuery();
                                         const __QUERY = (__QUERYSTR ? __QUERYDELIM + __QUERYSTR : "");
                                         const __NODENAME = this.node;
                                         const __NODE = (__NODENAME ? __NODEDELIM + __NODENAME : "");

                                         return __SCHEME + __HOST + __PORT + Path.prototype.getPath.call(this, dirs, delims) + __QUERY + __NODE;
                                     },
               'getDirs'           : function(path = undefined, delims) {
                                         UNUSED(delims);

                                         const __PATH = this.getServerPath(path);

                                         return Path.prototype.getDirs.call(this, __PATH);
                                     }
           });

// ==================== Ende Abschnitt fuer Klasse URI ====================

// *** EOF ***

/*** Ende Modul util.class.uri.js ***/

/*** Modul util.class.report.js ***/

// ==UserScript==
// _name         util.class.report
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2022+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Berichts-Klassen-Objekten fuer Auswertungen
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.report.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse Report ====================

// Basisklasse zum Konfigurieren eines Reports fuer Ereignisse

/*class*/ function Report /*{
    constructor*/(label) {
        'use strict';

        this.label = label;         // Name des Reports in der Ausgabe
        this.success = false;       // Angabe, ob etwas zu berichten ist
        this.entries = [];          // Liste der Eintraege, die in den Report eingehen
        this.entryFormatter = null; // Formatierfunktion fuer ein entry
    }
//}

Class.define(Report, Object, {
        'setFormatter'    : function(formatFun) {
                                checkType(formatFun, 'function', true, 'Report.setFormatter', 'formatFun', 'Function');

                                this.entryFormatter = formatFun;
                            },
        'handleEntry'     : function(entry) {
                                if (this.testEntry(entry)) {
                                    this.success = true;
                                    this.entries.push(entry);
                                }
                                return this.success;
                            },
        'testEntry'       : function(entry) {
                                return getValue(entry, false, true);
                            },
        'formatEntry'     : function(entry) {
                                return (this.entryFormatter ? this.entryFormatter(entry) : valueOf(entry));
                            },
        'formatEntries'   : function() {
                                return this.entries.map(entry => this.formatEntry(entry)).join(", ");
                            },
        'formatLabel'     : function(entryStr) {
                                const __LABEL = this.getLabel();

                                return getValue(entryStr, __LABEL, __LABEL + " (" + entryStr + ')');
                            },
        'getLabel'        : function() {
                                return this.getLabelPrefix() + getValue(this.label, "", this.label) + this.getLabelPostfix();
                            },
        'getLabelPrefix'  : function() {
                                const __ANZ = this.entries.length;

                                return ((__ANZ > 1) ? this.entries.length + "x " : "");
                            },
        'getLabelPostfix' : function() {
                                return "";
                            },
        'getReport'       : function() {
                                return (this.success ? this.formatLabel(this.formatEntries(this.entries)) : "");
                            },
        'toString'        : function() {
                                return this.getReport();
                            }
    });

// ==================== Ende Abschnitt fuer Klasse Report ====================

// ==================== Abschnitt fuer Klasse ReportEval ====================

// Basisklasse zum Konfigurieren eines Reports eines gefilterten Kriteriums fuer Ereignisse

/*class*/ function ReportEval /*extends Report {
    constructor*/(label, evalFun, filterFun, formatValFun) {
        'use strict';

        checkType(evalFun, 'function', false, 'ReportEval', 'evalFun', 'Function');
        checkType(filterFun, 'function', false, 'ReportEval', 'filterFun', 'Function');
        checkType(formatValFun, 'function', false, 'ReportEval', 'formatValFun', 'Function');

        Report.call(this, label);

        this.evalFun = evalFun;  // Funktion zur Ermittlung des Kriteriums
        this.filterFun = filterFun;
        this.formatValFun = formatValFun;
    }
//}

Class.define(ReportEval, Report, {
        'testEntry'       : function(entry) {
                                return this.filterTest(entry, (this.evalFun ? this.evalFun(entry) : true));
                            },
        'getLabelPostfix' : function() {
                                const __FORMATFUN = getValue(this.formatValFun, sameValue);
                                const __VAL = this.getVal();

                                return (__VAL ? (": " + __FORMATFUN(__VAL)) : "");
                            },
        'getVal'          : function() {
                                return 'OK';
                            },
        'filterTest'      : function(entry, test) {
                                const __FILTER = this.filterEvals(entry, test);

                                if (__FILTER) {
                                    return this.evalTest(entry, test);
                                }

                                return __FILTER;
                            },
        'filterEvals'     : function(entry, test) {
                                return (this.filterFun ? this.filterFun(entry, test) : test);
                            },
        'evalTest'        : function(entry, test) {
                                UNUSED(entry);

                                return test;
                            }
    });

// ==================== Ende Abschnitt fuer Klasse ReportEval ====================

// ==================== Abschnitt fuer Klasse ReportExists ====================

// Klasse zum Konfigurieren eines Reports eines gefilterten Kriteriums fuer Ereignisse

/*class*/ function ReportExists /*extends ReportEval {
    constructor*/(label, evalFun, filterFun, formatValFun) {
        'use strict';

        ReportEval.call(this, label, evalFun, filterFun, formatValFun);
    }
//}

Class.define(ReportExists, ReportEval, {
        'getVal'          : function() {
                                return null;
                            },
        'evalTest'        : function(entry, test) {
                                UNUSED(entry);

                                return test;
                            }
    });

// ==================== Ende Abschnitt fuer Klasse ReportExists ====================

// ==================== Abschnitt fuer Klasse ReportSum ====================

// Klasse zum Konfigurieren eines Reports zur gefilterten Summenbildung eines Kriteriums fuer Ereignisse

/*class*/ function ReportSum /*extends ReportEval {
    constructor*/(label, evalFun, filterFun, formatValFun, sumFun) {
        'use strict';

        checkType(sumFun, 'function', false, 'ReportSum', 'sumFun', 'Function');

        ReportEval.call(this, label, evalFun, filterFun, formatValFun);

        this.sumFun = sumFun;
        this.sumVal = undefined;
    }
//}

Class.define(ReportSum, ReportEval, {
        'formatEntries'   : function() {  // Gruppenbefehle wie "Sum" liefern generell eh alle Elemente!
                                return null;
                            },
        'getLabelPrefix'  : function() {
                                return "";
                            },
        'getVal'          : function() {
                                return this.sumVal;
                            },
        'evalTest'        : function(entry, test) {
                                UNUSED(entry);

                                const __SUMVAL = this.sumEvals(test, this.sumVal);

                                this.sumVal = __SUMVAL;

                                return true;
                            },
        'sumEvals'        : function(thisVal, sumVal) {
                                return (this.sumFun ? this.sumFun(thisVal, sumVal) : (getValue(sumVal, 0) + thisVal));
                            }
    });

// ==================== Ende Abschnitt fuer Klasse ReportSum ====================

// ==================== Abschnitt fuer Klasse ReportCount ====================

// Klasse zum Konfigurieren eines Reports zur Zaehlung gefilterter Kriterien fuer Ereignisse

/*class*/ function ReportCount /*extends ReportSum {
    constructor*/(label, evalFun, filterFun, formatValFun) {
        'use strict';

        ReportSum.call(this, label, evalFun, filterFun, formatValFun, ((thisVal, sumVal) => (getValue(sumVal, 0) + getValue(thisVal, 0, 1))));
    }
//}

Class.define(ReportCount, ReportSum);

// ==================== Ende Abschnitt fuer Klasse ReportCount ====================

// ==================== Abschnitt fuer Klasse ReportAverage ====================

// Klasse zum Konfigurieren eines Reports zur Zaehlung gefilterter Kriterien fuer Ereignisse

/*class*/ function ReportAverage /*extends ReportSum {
    constructor*/(label, evalFun, filterFun, formatValFun, sumFun) {
        'use strict';

        ReportSum.call(this, label, evalFun, filterFun, formatValFun, sumFun);
    }
//}

Class.define(ReportAverage, ReportSum, {
        'getVal'          : function() {
                                const __ANZ = this.entries.length;

                                return (this.sumVal / __ANZ).toFixed(2);
                            }
    });

// ==================== Ende Abschnitt fuer Klasse ReportAverage ====================

// ==================== Abschnitt fuer Klasse ReportCompare ====================

// Basisklasse zum Konfigurieren eines Reports eines Kriterium-Vergleichs fuer Ereignisse

/*class*/ function ReportCompare /*extends ReportEval {
    constructor*/(label, evalFun, compareFun, filterFun, formatValFun) {
        'use strict';

        checkType(compareFun, 'function', false, 'ReportCompare', 'compareFun', 'Function');

        ReportEval.call(this, label, evalFun, filterFun, formatValFun);

        this.compareFun = compareFun;
        this.bestVal = undefined;
    }
//}

Class.define(ReportCompare, ReportEval, {
        'getVal'          : function() {
                                return this.bestVal;
                            },
        'evalTest'        : function(entry, test) {
                                UNUSED(entry);

                                const __BESTVAL = getValue(this.bestVal, test);
                                const __COMPARE = this.compareEvals(test, __BESTVAL);
                                let ret = false;

                                if (__COMPARE >= 0) {
                                    ret = true;

                                    this.bestVal = test;

                                    if (__COMPARE > 0) {  // Rekord wurde uebertroffen!
                                        this.entries = [];
                                    }
                                }

                                return ret;
                            },
        'compareEvals'    : function(thisVal, bestVal) {
                                return (this.compareFun ? this.compareFun(thisVal, bestVal) : 0);
                            }
    });

// ==================== Ende Abschnitt fuer Klasse ReportCompare ====================

// ==================== Abschnitt fuer Klasse ReportMax ====================

// Klasse zum Konfigurieren eines Reports eines Maximalwerts fuer Ereignisse

/*class*/ function ReportMax /*extends ReportCompare {
    constructor*/(label, evalFun, filterFun, formatValFun) {
        'use strict';

        ReportCompare.call(this, label, evalFun, ((thisVal, bestVal) => (thisVal - bestVal)), filterFun, formatValFun);
    }
//}

Class.define(ReportMax, ReportCompare);

// ==================== Ende Abschnitt fuer Klasse ReportMax ====================

// ==================== Abschnitt fuer Klasse ReportMin ====================

// Klasse zum Konfigurieren eines Reports eines Minimalwerts fuer Ereignisse

/*class*/ function ReportMin /*extends ReportCompare {
    constructor*/(label, evalFun, filterFun, formatValFun) {
        'use strict';

        ReportCompare.call(this, label, evalFun, ((thisVal, bestVal) => (bestVal - thisVal)), filterFun, formatValFun);
    }
//}

Class.define(ReportMin, ReportCompare);

// ==================== Ende Abschnitt fuer Klasse ReportMin ====================

// *** EOF ***

/*** Ende Modul util.class.report.js ***/

