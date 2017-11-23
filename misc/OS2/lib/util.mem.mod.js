// ==UserScript==
// _name         util.mem.mod
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit Funktionen und Utilities fuer ScriptModule (__DBMOD)
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.js
// _require      https://eselce.github.io/OS2.scripts/lib/util.mem.mod.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Daten fuer die Scriptdatenbank ====================

// Infos ueber dieses Script-Modul
const __DBMOD = new ScriptModule();

// Inhaltsverzeichnis der DB-Daten (indiziert durch die Script-Namen)
const __DBTOC = { };

// Daten zu den Modulen (indiziert durch die Script-Namen)
const __DBDATA = { };

// ==================== Funktionen fuer die Scriptdatenbank ====================

// Initialisiert das Script-Modul und ermittelt die beschreibenden Daten
// meta: Metadaten des Scripts (Default: GM.info.script)
// return Beschreibende Daten fuer __DBMOD
function ScriptModule(meta) {
    'use strict';

    const __META = getValue(meta, GM.info.script);
    const __PROPS = {
                'name'        : true,
                'version'     : true,
                'namespace'   : true,
                'description' : true
            };

    const __DBMOD = { };

    __LOG[5](__META);

    // Infos zu diesem Script...
    addProps(__DBMOD, __META, __PROPS);

    // Voller Name fuer die Ausgabe...
    Object.defineProperty(__DBMOD, 'Name', {
                    get : function() {
                              return this.name + " (" + this.version + ')';
                          },
                    set : undefined
                });

    __LOG[2](__DBMOD);

    return __DBMOD;
}

Class.define(ScriptModule, Object);

// Initialisiert die Scriptdatenbank, die einen Datenaustausch zwischen den Scripten ermoeglicht
// optSet: Gesetzte Optionen (und Config)
function initScriptDB(optSet) {
     // Speicher fuer die DB-Daten...
    const __DBMEM = myOptMem.Value;

    __DBTOC.versions = getValue((__DBMEM === undefined) ? undefined : JSON.parse(__DBMEM.getItem('__DBTOC.versions')), { });
    __DBTOC.namespaces = getValue((__DBMEM === undefined) ? undefined : JSON.parse(__DBMEM.getItem('__DBTOC.namespaces')), { });

    // Zunaechst den alten Eintrag entfernen...
    delete __DBTOC.versions[__DBMOD.name];
    delete __DBTOC.namespaces[__DBMOD.name];

    if (__DBMEM !== undefined) {
        // ... und die Daten der Fremdscripte laden...
        for (let module in __DBTOC.versions) {
            scriptDB(module, getValue(JSON.parse(__DBMEM.getItem('__DBDATA.' + module)), { }));
        }
    }
}

// Setzt die Daten dieses Scriptes in der Scriptdatenbank, die einen Datenaustausch zwischen den Scripten ermoeglicht
// optSet: Gesetzte Optionen (und Config)
function updateScriptDB(optSet) {
    // Eintrag ins Inhaltsverzeichnis...
    __DBTOC.versions[__DBMOD.name] = __DBMOD.version;
    __DBTOC.namespaces[__DBMOD.name] = __DBMOD.namespace;

    // Speicher fuer die DB-Daten...
    const __DBMEM = myOptMem.Value;

    if (__DBMEM !== undefined) {
        // Permanente Speicherung der Eintraege...
        __DBMEM.setItem('__DBTOC.versions', safeStringify(__DBTOC.versions));
        __DBMEM.setItem('__DBTOC.namespaces', safeStringify(__DBTOC.namespaces));
        __DBMEM.setItem('__DBDATA.' + __DBMOD.name, safeStringify(optSet));

        // Aktualisierung der Speichergroesse...
        myOptMemSize = getMemSize(myOptMem);
    }

    // Jetzt die inzwischen gefuellten Daten *dieses* Scripts ergaenzen...
    scriptDB(__DBMOD.name, getValue(optSet, { }));

    __LOG[2](__DBDATA);
}

// Holt die globalen Daten zu einem Modul aus der Scriptdatenbank
// module: Gesetzte Optionen (und Config)
// initValue: Falls angegeben, zugewiesener Startwert
// return Daten zu diesem Modul
function scriptDB(module, initValue = undefined) {
    const __NAMESPACE = __DBTOC.namespaces[module];
    const __DBMODS = getProp(__DBDATA, __NAMESPACE, { });

    if (initValue !== undefined) {
        return (__DBMODS[module] = initValue);
    } else {
        return getProp(__DBMODS, module, { });
    }
}

// ==================== Substitution mit Daten aus der Scriptdatenbank ====================

// Moegliche einfache Ersetzungen mit '$'...
let textSubst;

// Substituiert '$'-Parameter in einem Text
// text: Urspruenglicher Text mit '$'-Befehlen
// par1: Der (erste) uebergebene Parameter
// return Fuer Arrays eine kompakte Darstellung, sonst derselbe Wert
function substParam(text, par1) {
    let ret = getValue(text, "");

    if (! textSubst) {
        textSubst  = {
                'n' : __DBMOD.name,
                'v' : __DBMOD.version,
                'V' : __DBMOD.Name
            };
    }

    for (let ch in textSubst) {
        const __SUBST = textSubst[ch];

        ret = ret.replace('$' + ch, __SUBST);
    }

    return ret.replace('$', par1);
}

// ==================== Ende Funktionen fuer die Scriptdatenbank ====================

// *** EOF ***
