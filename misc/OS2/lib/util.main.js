// ==UserScript==
// _name         util.main
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017/2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer das Hauptprogramm zur jeweiligen Seite
// _require      https://eselce.github.io/OS2.scripts/lib/util.main.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Aufbau und Start des Hauptprogramms ====================

// ==================== Abschnitt fuer Klasse Main ====================

/*class*/ function Main /*{
    constructor*/(optConfig, prepareOpt, ...pageManager) {
        this.optConfig      = optConfig;
        this.optSet         = new Options(this.optConfig, '__OPTSET');
        this.prepareOpt     = prepareOpt;
        this.manager        = pageManager;
    }
//}

Class.define(Main, Object, {
        'handlePage'  : async function(page) {
                            // Fuehrt die Bearbeitung einer speziellen Seite durch
                            // page: ID fuer die aktuelle Seite
                            // return Promise auf die Durchfuehrung der Bearbeitung
                            const __MANAGER         = (this.manager[page] || { name : "Seite #" + page });
                            const __CLASSIFICATION  = (__MANAGER.classification || (new Classification()));
                            const __SETUPOPTPARAMS  = (__MANAGER.setupOptParams || (() => ({ 'hideMenu' : false })));
                            const __HANDLER         = (__MANAGER.handler || (() => Promise.resolve(false)));
                            const __PREPAREOPT      = (this.prepareOpt || (() => { }));
                            const __OPTPARAMS       = __SETUPOPTPARAMS(this.optSet);

                            if (__OPTPARAMS) {
                                // Klassifikation verknuepfen...
                                __CLASSIFICATION.assign(this.optSet, __OPTPARAMS);

                                return await startOptions(this.optConfig, this.optSet, __CLASSIFICATION).then(async optSet => {
                                        __PREPAREOPT(optSet, __OPTPARAMS);

                                        return await showOptions(optSet, __OPTPARAMS);
                                    }, defaultCatch).then(__HANDLER).then(ret => (ret ? 'OK' : ('FAILED ' + __MANAGER.name)));
                            } else {
                                return Promise.reject(`Keine Options-Parameter f\xFCr '${__MANAGER.name}' vorhanden!`);
                            }
                        },
        'run'         : function(selector, ...selectorParams) {
                            // Fuehrt die Bearbeitung zu einer selektierten Seite durch
                            // selector: Funktion zur Selektion aufgrund der als erstem Parameter uebergebenen URL der Seite
                            // selectorParams: Weitere Parameter fuer selector(URL, ...)
                            // return Promise auf die Durchfuehrung der Bearbeitung im Hauptprogramm
                            return startMain().then(async () => {
                                try {
                                    const __SELECTOR = (selector || (() => 0));
                                    const __SELECTORPARAMS = selectorParams;
                                    const __PAGE = __SELECTOR(window.location.href, ...__SELECTORPARAMS);

                                    return await this.handlePage(__PAGE).catch(defaultCatch);
                                } catch (ex) {
                                    return defaultCatch(ex);
                                }
                            }).then(rc => {
                                    __LOG[2](String(this.optSet));
                                    __LOG[1]('SCRIPT END', __DBMOD.Name, '(' + rc + ')', '/', __DBMAN.Name);
                                }, ex => {
                                    __LOG[1]('SCRIPT ERROR', __DBMOD.Name, '(' + (ex && getValue(ex[0], ex.message, ex[0] + ": " + ex[1])) + ')');
                                    __LOG[2](String(this.optSet));
                                    __LOG[1]('SCRIPT END', __DBMAN.Name);
                                });
                        }
    });

// ==================== Ende Abschnitt fuer Klasse Main ====================

// ==================== Abschnitt fuer Klasse PageManager ====================

/*class*/ function PageManager /*{
    constructor*/(pageName, classification, setupOptParams, handler) {
        this.name           = pageName;
        this.classification = classification;
        this.setupOptParams = setupOptParams;
        this.handler        = handler;
    }
//}

Class.define(RundenLink, Object);

// ==================== Ende Abschnitt fuer Klasse PageManager ====================

// ==================== Ende Abschnitt fuer Aufbau und Start des Hauptprogramms ====================

// *** EOF ***
