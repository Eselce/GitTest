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
    constructor*/(optConfig, mainConfig, ... pageManager) {
        const __MAINCONFIG = (mainConfig || { });

        this.optConfig      = optConfig;
        this.optSet         = new Options(this.optConfig, '__OPTSET');
        this.setupManager   = __MAINCONFIG.setupManager;
        this.checkOptParams = __MAINCONFIG.checkOptParams;
        this.prepareOpt     = __MAINCONFIG.prepareOpt;
        this.verifyOpt      = __MAINCONFIG.verifyOpt;
        this.pageManager    = pageManager;
    }
//}

Class.define(Main, Object, {
        'handlePage'  : async function(page) {
                            // Fuehrt die Bearbeitung einer speziellen Seite durch
                            // page: ID fuer die aktuelle Seite
                            // return Promise auf die Durchfuehrung der Bearbeitung
                            const __SETUPMANAGER    = (this.setupManager || (page => this.pageManager[page]));
                            const __MANAGER         = getValue(__SETUPMANAGER.call(this, page), { name : "Seite #" + page, params : [] });
                            const __SETUPOPTPARAMS  = (__MANAGER.setupOptParams || (() => ({ 'hideMenu' : false })));
                            const __OPTPARAMS       = __SETUPOPTPARAMS.call(__MANAGER, this.optSet, ... __MANAGER.params);
                            const __CHECKOPTPARAMS  = (this.checkOptParams || (optParams => !! optParams));

                            if (__CHECKOPTPARAMS(__OPTPARAMS, __MANAGER)) {
                                const __CLASSIFICATION  = (__MANAGER.classification || (new Classification()));
                                const __HANDLER         = __MANAGER.handler;

                                if (! __HANDLER) {
                                    return Promise.reject(`Kein Seiten-Handler f\xFCr '${__MANAGER.name}' vorhanden!`);
                                }

                                __LOG[2](`${__DBMOD.Name}: Starte Seiten-Verarbeitung f\xFCr '${__MANAGER.name}'...`);

                                // Klassifikation verknuepfen...
                                __CLASSIFICATION.assign(this.optSet, __OPTPARAMS);

                                return await startOptions(this.optConfig, this.optSet, __CLASSIFICATION).then(
                                        async optSet => {
                                                const __PREPAREOPT  = (__OPTPARAMS.prepareOpt || this.prepareOpt || sameValue);
                                                const __VERIFYOPT   = (__OPTPARAMS.verifyOpt || this.verifyOpt || checkOptSet);

                                                return await Promise.resolve(__PREPAREOPT(optSet, __OPTPARAMS)).then(
                                                                            optSet => Promise.resolve(showOptions(optSet, __OPTPARAMS)).then(
                                                                            optSet => __VERIFYOPT(optSet, __OPTPARAMS)));
                                            }).then(__HANDLER.bind(__MANAGER, this.optSet, ... __MANAGER.params)).then(
                                                                    ret => ((ret ? 'OK' : 'FAILED') + ' ' + __MANAGER.name));
                            } else {
                                return Promise.reject(`Keine Options-Parameter f\xFCr Seite '${__MANAGER.name}' vorhanden!`);
                            }
                        },
        'run'         : async function(selector, ... selectorParams) {
                            // Fuehrt die Bearbeitung zu einer selektierten Seite durch
                            // selector: Funktion zur Selektion aufgrund der als erstem Parameter uebergebenen URL der Seite
                            // selectorParams: Weitere Parameter fuer selector(URL, ...)
                            // return Promise auf die Durchfuehrung der Bearbeitung im Hauptprogramm
                            return await startMain().then(
                                    async () => {
                                            try {
                                                const __SELECTOR = (selector || (() => 0));
                                                const __SELECTORPARAMS = selectorParams;
                                                const __PAGE = __SELECTOR(window.location.href, ... __SELECTORPARAMS);

                                                return this.handlePage(__PAGE).catch(defaultCatch);
                                            } catch (ex) {
                                                return defaultCatch(ex);
                                            }
                                        }).then(rc => {
                                                __LOG[2](String(this.optSet));
                                                __LOG[1]('SCRIPT END', __DBMOD.Name, '(' + rc + ')', '/', __DBMAN.Name);

                                                return Promise.resolve(true);
                                            }, ex => {
                                                __LOG[1]('SCRIPT ERROR', __DBMOD.Name, '(' + (ex && getValue(ex[0], ex.message,
                                                            ((typeof ex) === 'string') ? ex : (ex[0] + ": " + ex[1]))) + ')');
                                                __LOG[2](String(this.optSet));
                                                __LOG[1]('SCRIPT END', __DBMAN.Name);

                                                return Promise.resolve(false);
                                            });
                        }
    });

// ==================== Ende Abschnitt fuer Klasse Main ====================

// ==================== Abschnitt fuer Klasse PageManager ====================

/*class*/ function PageManager /*{
    constructor*/(pageName, classification, setupOptParams, pageHandler, ... params) {
        this.name           = pageName;
        this.classification = classification;
        this.setupOptParams = setupOptParams;
        this.handler        = pageHandler;
        this.params         = (params || []);
    }
//}

Class.define(PageManager, Object, {
        'clone'       : function(... params) {
                            const __PARAMS = this.params.concat(params || []);

                            return new PageManager(this.name + " (" + params.join(", ") + ')',
                                                    this.classification, this.setupOptParams,
                                                    this.handler, ... __PARAMS);
                        }
    });

// ==================== Ende Abschnitt fuer Klasse PageManager ====================

// ==================== Ende Abschnitt fuer Aufbau und Start des Hauptprogramms ====================

// *** EOF ***
