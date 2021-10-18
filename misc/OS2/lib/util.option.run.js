// ==UserScript==
// _name         util.option.run
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer Aufbau und Start der Script-Optionen
// _require      https://eselce.github.io/OS2.scripts/lib/util.log.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.prop.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.value.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.debug.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.class.path.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.db.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.cmd.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.type.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.data.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.class.options.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.api.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.menu.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.page.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.option.run.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Aufbau und Start der Optionen ====================

// Initialisiert die Menue-Funktion einer Option
// optAction: Typ der Funktion
// item: Key der Option
// optSet: Platz fuer die gesetzten Optionen (und Config)
// optConfig: Konfiguration der Option
// return Funktion fuer die Option
function initOptAction(optAction, item = undefined, optSet = undefined, optConfig = undefined) {
    let fun;

    if (optAction !== undefined) {
        const __CONFIG = ((optConfig !== undefined) ? optConfig : getOptConfig(getOptByName(optSet, item)));
        const __RELOAD = getValue(getValue(__CONFIG, { }).ActionReload, true);

        switch (optAction) {
        case __OPTACTION.SET : fun = function() {
                                       return setOptByName(optSet, item, __CONFIG.SetValue, __RELOAD).catch(defaultCatch);
                                   };
                               break;
        case __OPTACTION.NXT : fun = function() {
                                       return promptNextOptByName(optSet, item, __CONFIG.SetValue, __RELOAD,
                                                  __CONFIG.FreeValue, __CONFIG.SelValue, __CONFIG.MinChoice).catch(defaultCatch);
                                   };
                               break;
        case __OPTACTION.RST : fun = function() {
                                       return resetOptions(optSet, __RELOAD).then(
                                               result => __LOG[4]("RESETTING (" + result + ")..."),
                                               defaultCatch);
                                   };
                               break;
        default :              break;
        }
    }

    return fun;
}

// Gibt diese Config oder, falls 'Shared', ein Referenz-Objekt mit gemeinsamen Daten zurueck
// optConfig: Konfiguration der Option
// item: Key der Option
// return Entweder optConfig oder gemergete Daten auf Basis des in 'Shared' angegebenen Objekts
function getSharedConfig(optConfig, item = undefined) {
    let config = getValue(optConfig, { });
    const __SHARED = config.Shared;

    if (__SHARED !== undefined) {
        const __OBJREF = getSharedRef(__SHARED, item);  // Gemeinsame Daten

        if (getValue(__SHARED.item, '$') !== '$') {  // __OBJREF ist ein Item
            const __REF = valueOf(__OBJREF);

            config = { };  // Neu aufbauen...
            addProps(config, getOptConfig(__REF));
            addProps(config, optConfig);
            config.setConst('SharedData', getOptValue(__REF), false);   // Wert muss schon da sein, NICHT nachladen, sonst ggfs. Promise
        } else {  // __OBJREF enthaelt die Daten selbst
            if (! config.Name) {
                config.Name = __OBJREF.getPath();
            }
            config.setConst('SharedData', __OBJREF);  // Achtung: Ggfs. zirkulaer!
        }
    }

    return config;
}

// Initialisiert die gesetzten Optionen
// optConfig: Konfiguration der Optionen
// optSet: Platz fuer die gesetzten Optionen
// preInit: Vorinitialisierung einzelner Optionen mit 'PreInit'-Attribut
// return Gefuelltes Objekt mit den gesetzten Optionen
function initOptions(optConfig, optSet = undefined, preInit = undefined) {
    if (optSet === undefined) {
        optSet = new Options();
    }

    for (let opt in optConfig) {
        const __OPTCONFIG = optConfig[opt];
        const __PREINIT = getValue(__OPTCONFIG.PreInit, false, true);
        const __ISSHARED = getValue(__OPTCONFIG.Shared, false, true);

        if ((preInit === undefined) || (__PREINIT === preInit)) {
            const __CONFIG = getSharedConfig(__OPTCONFIG, opt);
            const __ALTACTION = getValue(__CONFIG.AltAction, __CONFIG.Action);
            // Gab es vorher einen Aufruf, der einen Stub-Eintrag erzeugt hat, und wurden Daten geladen?
            const __LOADED = ((preInit === false) && optSet[opt].Loaded);
            const __PROMISE = ((__LOADED || ! optSet[opt]) ? undefined : optSet[opt].Promise);
            const __VALUE = (__LOADED ? optSet[opt].Value : undefined);

            optSet[opt] = {
                'Item'      : opt,
                'Config'    : __CONFIG,
                'Loaded'    : (__ISSHARED || __LOADED),
                'Promise'   : __PROMISE,
                'Value'     : initOptValue(__CONFIG, __VALUE),
                'SetValue'  : __CONFIG.SetValue,
                'ReadOnly'  : (__ISSHARED || __CONFIG.ReadOnly),
                'Action'    : initOptAction(__CONFIG.Action, opt, optSet, __CONFIG),
                'AltAction' : initOptAction(__ALTACTION, opt, optSet, __CONFIG)
            };
        } else if (preInit) {  // erstmal nur Stub
            optSet[opt] = {
                'Item'      : opt,
                'Config'    : __OPTCONFIG,
                'Loaded'    : false,
                'Promise'   : undefined,
                'Value'     : initOptValue(__OPTCONFIG),
                'ReadOnly'  : (__ISSHARED || __OPTCONFIG.ReadOnly)
            };
        }
    }

    return optSet;
}

// ==================== Abschnitt fuer Klasse Classification ====================

// Basisklasse fuer eine Klassifikation der Optionen nach Kriterium (z.B. Erst- und Zweitteam oder Fremdteam)
function Classification(prefix) {
    'use strict';

    this.renameFun = prefixName;
    this.prefix = (prefix || 'old');
    this.optSet = undefined;
    this.optSelect = { };
}

Class.define(Classification, Object, {
                    'renameOptions'  : function() {
                                           const __PARAM = this.renameParamFun();

                                           if (__PARAM !== undefined) {
                                               // Klassifizierte Optionen umbenennen...
                                               return renameOptions(this.optSet, this.optSelect, __PARAM, this.renameFun);
                                           } else {
                                               return Promise.resolve();
                                           }
                                       },
                    'saveOptions'    : function(ignList) {
                                           const __OPTSELECT = optSelect(this.optSelect, ignList);

                                           return saveOptions(this.optSet, __OPTSELECT);
                                       },
                    'deleteOptions'  : function(ignList) {
                                           const __OPTSELECT = optSelect(this.optSelectl, ignList);

                                           return deleteOptions(this.optSet, __OPTSELECT, true, true);
                                       },
                    'prefixParamFun' : function() {
                                           // Parameter fuer 'prefixName': Prefix "old:"
                                           return ((this.prefix !== undefined) ? this.prefix + ':' : this.prefix);
                                       },
                    'renameParamFun' : function() {
                                           // Parameter fuer 'renameFun': Default ist 'prefixName' ("old:")
                                           return this.prefixParamFun();
                                       }
                });

// Wandelt ein Array von Options-Schluesseln (props) in das optSelect-Format { 'key1' : true, 'key2' : true, ... }
// props: Array von Keys
// return Mapping mit Eintraegen, in denen die Keys auf true gesetzt sind: { 'key1' : true, 'key2' : true, ... }
function optSelectFromProps(props) {
    const __RET = { };

    if (props) {
        props.map(item => (__RET[item] = true));
    }

    return __RET;
}

// Errechnet aus einer Ausswahlliste und einer Ignore-Liste eine resultierende Liste im optSelect-Format
// selList: Mapping von auf true gesetzten Eintraegen (optSelect), die eine Grundmenge darstellen
// ignList: Mapping von auf true gesetzten Eintraegen (optSelect), die aus obiger Liste ausgetragen werden sollen
// return Resultierendes Mapping mit Eintraegen (optSelect), in denen die Keys auf true gesetzt sind: { 'key1' : true, 'key2' : true, ... }
function optSelect(selList, ignList) {
    const __PROPS = addProps([], selList, null, ignList);

    return optSelectFromProps(__PROPS);
}

// ==================== Ende Abschnitt fuer Klasse Classification ====================

// ==================== Abschnitt fuer Klasse ClassificationPair ====================

// Klasse fuer die Klassifikation der Optionen nach Team (Erst- und Zweitteam oder Fremdteam)
function ClassificationPair(classA, classB) {
    'use strict';

    Classification.call(this);

    this.prefix = undefined;

    this.A = classA;
    this.B = classB;

    // Zugriff auf optSelect synchronisieren...
    Object.defineProperty(this, 'optSelect', {
                    get : function() {
                              const __A = getValue(this.A, { });
                              const __B = getValue(this.B, { });

                              return (this.A ? __A.optSelect : __B.optSelect);
                          },
                    set : function(optSelect) {
                              const __A = getValue(this.A, { });
                              const __B = getValue(this.B, { });

                              __A.optSelect = optSelect;
                              __B.optSelect = optSelect;

                              return optSelect;
                          }
                });

    // Zugriff auf optSet synchronisieren...
    Object.defineProperty(this, 'optSet', {
                    get : function() {
                              const __A = getValue(this.A, { });
                              const __B = getValue(this.B, { });

                              return (this.A ? __A.optSet : __B.optSet);
                          },
                    set : function(optSet) {
                              const __A = getValue(this.A, { });
                              const __B = getValue(this.B, { });

                              __A.optSet = optSet;
                              __B.optSet = optSet;

                              return optSet;
                          }
                });
}

Class.define(ClassificationPair, Classification, {
                    'renameOptions'  : function() {
                                           return (this.A ? this.A.renameOptions() : Promise.resolve()).then(retValue =>
                                                   (this.B ? this.B.renameOptions() : Promise.resolve()));
                                       },
                    'saveOptions'    : function(ignList) {
                                           return (this.A ? this.A.saveOptions(ignList) : Promise.resolve()).then(retValue =>
                                                   (this.B ? this.B.saveOptions(ignList) : Promise.resolve()));
                                       },
                    'deleteOptions'  : function(ignList) {
                                           return (this.A ? this.A.deleteOptions(ignList) : Promise.resolve()).then(retValue =>
                                                   (this.B ? this.B.deleteOptions(ignList) : Promise.resolve()));
                                       }
                });

// ==================== Ende Abschnitt fuer Klasse ClassificationPair ====================

    // Abhaengigkeiten:
    // ================
    // initOptions (PreInit):
    // restoreMemoryByOpt: PreInit oldStorage
    // getStoredCmds: restoreMemoryByOpt
    // runStoredCmds (beforeLoad): getStoredCmds
    // loadOptions (PreInit): PreInit
    // startMemoryByOpt: storage oldStorage
    // initScriptDB: startMemoryByOpt
    // initOptions (Rest): PreInit
    // getMyTeam callback (getOptPrefix): initTeam
    // __MYTEAM (initTeam): initOptions
    // renameOptions: getOptPrefix
    // runStoredCmds (afterLoad): getStoredCmds, renameOptions
    // loadOptions (Rest): PreInit/Rest runStoredCmds
    // updateScriptDB: startMemoryByOpt
    // showOptions: startMemoryByOpt renameOptions
    // buildOptionMenu: showOptions
    // buildOptionForm: showOptions

// Initialisiert die gesetzten Optionen und den Speicher und laedt die Optionen zum Start
// optConfig: Konfiguration der Optionen
// optSet: Platz fuer die gesetzten Optionen
// return Promise auf gefuelltes Objekt mit den gesetzten Optionen
async function startOptions(optConfig, optSet = undefined, classification = undefined) {
    optSet = initOptions(optConfig, optSet, true);  // PreInit

    // Memory Storage fuer vorherige Speicherung...
    myOptMemSize = getMemSize(myOptMem = await restoreMemoryByOpt(optSet.oldStorage));

    // Zwischengespeicherte Befehle auslesen...
    const __STOREDCMDS = getStoredCmds(myOptMem);

    // ... ermittelte Befehle ausfuehren...
    const __LOADEDCMDS = await runStoredCmds(__STOREDCMDS, optSet, true);  // BeforeLoad

    // Bisher noch nicht geladenene Optionen laden...
    await loadOptions(optSet);

    // Memory Storage fuer naechste Speicherung...
    myOptMemSize = getMemSize(myOptMem = startMemoryByOpt(optSet.storage, optSet.oldStorage));

    // Globale Daten ermitteln...
    initScriptDB(optSet);

    optSet = initOptions(optConfig, optSet, false);  // Rest

    if (classification !== undefined) {
        // Umbenennungen durchfuehren...
        await classification.renameOptions();
    }

    // ... ermittelte Befehle ausfuehren...
    await runStoredCmds(__LOADEDCMDS, optSet, false);  // Rest

    // Als globale Daten speichern...
    updateScriptDB(optSet);

    return optSet;
}

// ==================== Abschnitt Anzeige der Optionen ====================

// Installiert die Visualisierung und Steuerung der Optionen
// optSet: Platz fuer die gesetzten Optionen
// optParams: Eventuell notwendige Parameter zur Initialisierung
// 'hideMenu': Optionen werden zwar geladen und genutzt, tauchen aber nicht im Benutzermenu auf
// 'menuAnchor': Startpunkt fuer das Optionsmenu auf der Seite
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// 'formWidth': Anzahl der Elemente pro Zeile
// 'formBreak': Elementnummer des ersten Zeilenumbruchs
// return Liefert die gesetzten Optionen zurueck
function showOptions(optSet = undefined, optParams = { 'hideMenu' : false }) {
    // Anzeige im Benutzermenue...
    if (! optParams.hideMenu) {
        buildOptionMenu(optSet).then(() => __LOG[4]("Menu OK"));
    }

    // Anzeige auf der Seite...
    if ((optParams.menuAnchor !== undefined) && (myOptMem !== __OPTMEMINAKTIVE)) {
        buildOptionForm(optParams.menuAnchor, optSet, optParams);
    }

    return optSet;
}

// ==================== Ende Abschnitt fuer Aufbau und Start der Optionen ====================

// *** EOF ***
