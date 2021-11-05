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

// Gesetzte Optionen (werden ggfs. von initOptions() angelegt und von loadOptions() gefuellt):
//const __OPTSET = new Options(__OPTCONFIG, '__OPTSET');

/*class*/ function Main /*{
    constructor*/(optConfig, optSet, classification) {
        UNUSED(optConfig, optSet, classification);
    }
//}

//const __MAIN = new Main(__OPTCONFIG, __OPTSET, __TEAMCLASS);

/*
Classification.assign(optSet, optParam) {
    this.optSet = optSet;
    this.optParam = optParam;
}

TeamClassification.assign(optSet, optParam) {
    this.optSet = optSet;
    this.optParam = optParam;
    this.teamParam = optParam.teamParam;
}
*/

// Fuehrt die Bearbeitung einer speziellen Seite durch
// optConfig: Konfiguration der Optionen
// optSet: Platz fuer die gesetzten Optionen (und Config)
// page: ID fuer die aktuelle Seite
// return Promise auf die Durchfuehrung der Bearbeitung
function handlePage(optConfig, optSet, page) {
    const __SETUPOPTPARAMS = (this.setupOptParams[page] || (() => ({ 'hideMenu' : false })));
    const __CLASSIFICATION = this.classification[page];
    const __PREPAREOPTIONS = this.prepareOptions;
    const __HANDLER = this.handler[page];
    const __OPTPARAMS = __SETUPOPTPARAMS(optSet);

    if (__OPTPARAMS) {
        // Klassifikation verknuepfen...
        __CLASSIFICATION.assign(optSet, __OPTPARAMS);

        startOptions(optConfig, optSet, __CLASSIFICATION).then(optSet => {
                __PREPAREOPTIONS(optSet, __OPTPARAMS);

                return showOptions(optSet, __OPTPARAMS);
            }, defaultCatch).then(__HANDLER);
    } else {
        return Promise.reject(`Keine Options-Parameter f\xFCr Seite ${page} vorhanden!`);
    }
}

function run() {
    startMain().then(async () => {
        try {
            const __SELECTOR = this.selector;
            const __SELECTORPARAMS = this.selectorParams;
            const __PAGE = __SELECTOR(window.location.href, ...__SELECTORPARAMS);

            await handlePage(this.optConfig, this.optSet, __PAGE).catch(defaultCatch);

            return 'OK';
        } catch (ex) {
            return defaultCatch(ex);
        }
    }).then(rc => {
            //__LOG[2](String(__OPTSET));
            __LOG[1]('SCRIPT END', __DBMOD.Name, '(' + rc + ')');
        });
};

// ==================== Ende Abschnitt fuer Aufbau und Start des Hauptprogramms ====================

// *** EOF ***
