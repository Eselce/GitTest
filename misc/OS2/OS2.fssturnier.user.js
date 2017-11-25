// ==UserScript==
// @name         OS2.fssturnier
// @namespace    http://os.ongapo.com/
// @version      0.10+WE+
// @copyright    2017
// @author       Sven Loges (SLC)
// @description  Script zum offizellen FSS-Turnier fuer Online Soccer 2.0
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/haupt\.php(\?changetosecond=\w+(&\S+)*)?(#\S+)?$/
// @include      /^https?://(www\.)?(os\.ongapo\.com|online-soccer\.eu|os-zeitungen\.com)/fssturnier\.php(\?fordern=\d+(&\S+)*)?(#\S+)?$/
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.registerMenuCommand
// @grant        GM.info
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.log.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.value.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.proto.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.prop.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.mod.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.debug.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.store.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.dom.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.delim.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.path.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.class.uri.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.type.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.data.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.api.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.db.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.mem.cmd.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.menu.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.label.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.action.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.node.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.page.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/util.option.run.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.list.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.team.js
// @require      https://eselce.github.io/GitTest/misc/OS2/lib/OS2.page.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Konfigurations-Abschnitt fuer Optionen ====================

const __LOGLEVEL = 3;

// Moegliche Optionen (hier die Standardwerte editieren oder ueber das Benutzermenu setzen):
const __OPTCONFIG = {
    'saison' : {          // Laufende Saison
                   'Name'      : "saison",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'FreeValue' : true,
                   'SelValue'  : false,
                   'Choice'    : [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ],
                   'Default'   : 12,
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Saison: $",
                   'Hotkey'    : 'a',
                   'FormLabel' : "Saison:|$"
               },
    'aktuellerZat' : {    // Laufender ZAT
                   'Name'      : "currZAT",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'Number',
                   'Permanent' : true,
                   'SelValue'  : false,
                   'Choice'    : [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11,
                                  12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                                  24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
                                  36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
                                  48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
                                  60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
                                  72 ],
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "ZAT: $",
                   'Hotkey'    : 'Z',
                   'FormLabel' : "ZAT:|$"
               },
    'datenZat' : {        // Stand der Daten zum Team und ZAT
                   'Name'      : "dataZAT",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'Number',
                   'Hidden'    : true,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : undefined,
                   'Action'    : __OPTACTION.SET,
                   'Submit'    : undefined,
                   'Cols'      : 1,
                   'Rows'      : 1,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Daten-ZAT:"
               },
    'oldDatenZat' : {     // Stand der Daten zum Team und ZAT
                   'Name'      : "oldDataZAT",
                   'Type'      : __OPTTYPES.SD,
                   'ValType'   : 'Number',
                   'Hidden'    : true,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : undefined,
                   'Action'    : __OPTACTION.SET,
                   'Submit'    : undefined,
                   'Cols'      : 1,
                   'Rows'      : 1,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Vorheriger Daten-ZAT:"
               },
    'team' : {            // Datenspeicher fuer Daten des Erst- bzw. Zweitteams
                   'Name'      : "team",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'Permanent' : true,
                   'Default'   : undefined,  // new Team() // { 'Team' : undefined, 'Liga' : undefined, 'Land' : undefined, 'LdNr' : 0, 'LgNr' : 0 }
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 6,
                   'Replace'   : null,
                   'Space'     : 1,
                   'Label'     : "Verein:"
               },
    'rankIds' : {         // Datenspeicher fuer aktuelle Team-IDs der Teams in der Rangliste
                   'Name'      : "rankIds",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Platz-IDs:"
               },
    'oldRankIds' : {      // Datenspeicher fuer Team-IDs der Teams in der vorherigen Rangliste
                   'Name'      : "oldRankIds",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   :
                             /*
                                 [ undefined, // ZAT 1
                                   1574, 1872,  881, 1476, 1568,  728,  778, 1935, 1175, 1912,  133, 1802, 1755,  300, 1797,  569,  181, 1069, 1810,  705,
                                   1447,  161, 1018, 1652, 1030,  817,  980,  495,  798,  602,  145,  954,   67,  131, 1430,   51,  890,   13, 1261, 1789,
                                    520,  660,  314,  559,  920,  157, 1841,  837,   39,  510,  618,  169, 1420,   68, 1066,  404, 1226, 1933,  224, 1813,
                                   1126,  372,  382, 1237, 1758, 1816, 1493, 1096,  930, 1937,  121, 1572, 1794,  331,  761, 1848,   25, 1795,  381, 1858,
                                    766,  190, 1323,  327, 1923, 1016,  467, 1164, 1771,  736,  198,  616, 1772,  564, 1152,  758, 1461, 1889,  107,  715,
                                   1071,  182,  471,  691,  483, 1647,  148, 1662,  477,  689,  132,  273, 1596, 1222,  597,  963,   38,  674,  505,  340,
                                   1395,  330, 1212,  726,  160, 1818,  195, 1526,  333,  629,  582,  741,  595, 1157, 1377,  275, 1238, 1078,  152, 1528,
                                    796, 1820,  188,   86,  313, 1532,  252,  734,   82,  878,   75, 1822,  902,  242,  685, 1451 ],
                                 [ undefined, // ZAT 2
                                   1574, 1872,  881, 1476, 1568,  728,  778, 1935, 1175, 1912,  133, 1802, 1755,  181, 1797,  569,  300, 1810, 1069,  705,
                                   1447,  161,  602, 1652,  817, 1030,  980,  495,  798, 1018,  145,  954,  559,  131, 1430,   51,  157,   13, 1261, 1789,
                                   1420,  660,  314,   67,  920,  890,  404,   68,   39,  510,  618,  169,  520,  837, 1066, 1841, 1226, 1933,  224, 1813,
                                   1126,  331,  382, 1237, 1758, 1816, 1493, 1096,  930, 1937,  121, 1572, 1794,  372,  761, 1848,   25, 1795,  564, 1858,
                                    766,  190, 1323,  327, 1923,  107,  616, 1152, 1771,  736,  198,  467, 1772,  381, 1164,  273, 1461, 1889, 1016,  715,
                                   1071,  182,  471,  691,  483, 1647,  148, 1662,  477,  689,  132,  758,  330, 1222,  597,  963,  674,   38,  505,  340,
                                   1395, 1596, 1212,  726,  160, 1818,  195, 1526,  333,  629,  582,  741,  595, 1157, 1377,  275, 1238, 1451,  152, 1528,
                                   /#796#/188, 1820,   86,  313, 1532,  252,  734,   82,  878,   75, 1822,  902,  242,/#685#/1078, 1181, 1352,  419,  545,
                                   1209,  610,  346, 1901,  820, 1790,  376, 1659, 1036,  836, 1150, 1576,  463,  667,  352, 1821, 1110,  264, 1190, 1396,
                                    373, 1197,  779 ],
                                 [ undefined, // ZAT 3
                                   1574, 1872,  881, 1476,  778,  728, 1568, 1935, 1175, 1912,  133, 1755, 1802,  181, 1797, 1447,  300, 1810, 1069,  705,
                                    569,  954,  602, 1652,  817, 1030,  980,/#131#/ 145, 1018,  798,  161,  559,  495, 1430,   51,  157,  510, 1261, 1789,
                                   1420,  169,  314,   67,  920,  890,  404,   68,   39,   13, 1226,  660,  520,  837, 1066, 1841,  618,  930,  224, 1813,
                                   1126,  331,  382, 1237, 1758,/#1816#/190,  121, 1933, 1937, 1096, 1858, 1794,  372,  761,   25, 1848,  327,  564, 1572,
                                    715, 1493, 1461, 1795, 1923,  107,  616, 1152, 1771,  736, 1772,  467,  198,  381, 1164,  273, 1323, 1889, 1016,  766,
                                    505,  182,  471, 1222, 1647,  483,  148, 1662,  477,  689,  132,  758,  330,  691,  597,  582,  674,   38, 1071,  340,
                                   1395, 1596, 1377,  726,  160, 1818,  195, 1526,  333,  629,  963,  741,  734, 1157, 1212,  275, 1238, 1451,  152, 1528,
                                    188, 1820,   86,  313, 1532,  252,  595,   82,  878,   75,  242,  902, 1822, 1078, 1181, 1352,  419,  545, 1209,  610,
                                    346, 1901,  820, 1790,  376, 1659, 1036,  836, 1150, 1576,  463,  667,  352, 1821, 1110,  264, 1190, 1396,  373, 1197,
                                    779,  763,  455, 1360, 1842, 1787, 1292,  307,  137,   16,  394,  436, 1910, 1203,  172, 1224,  859 ],
                                 [ undefined, // ZAT 4
                                   1574, 1872,  881, 1912,  778, 1568,  728, 1935, 1175, 1476, 1802, 1755,  133, 1447, 1797,  181,  300, 1810,  705, 1069,
                                    569,  954,  602, 1652,  817, 1030,  980,  145, 1018,  798,  161,  559,  495, 1430,   51,  157,  510, 1261, 1789, 1420,
                                    169,  660,   67,  920,  890,  404,   68,   13,   39, 1226,  314,  520,  837, 1066,  382,  121,  930,  224, 1813,  331,
                                 /#1126#/1841, 1237, 1758,  190,  618,1858,/#1937#/1096, 1933, 1772,  372,  761,   25, 1848,  327,  564, 1572,  715, 1493,
                                   1461, 1923, 1795, 1323,  616, 1152, 1771,  736, 1794,  582,  198,  381,  597,  273,  107,  182, 1016,  766,  505, 1889,
                                    471, 1222, 1647,  691,  148, 1662,  477,  333,  132,  330,/#758#/ 483, 1164,  467,  674,   38, 1071,  726, 1395,  152,
                                   1377,  340,  160, 1818,/#195#/1526,  689,  629,  963,  741, 734,/#1157#/1212,  275,  313, 1451, 1596, 1528,  188, 1820,
                                     86, 1238, 1532,  252,  595,  242,  878,   75,   82,  902, 1822, 1190, 1181, 1360,  419,  545, 1209,  610, 1821, 1901,
                                    820,  667,  376, 1659, 1036,  836, 1150, 1576,  463,/#1790#/352,  346, 1110,  394, 1078, 1396,  373, 1197,  779,  763,
                                    455, 1352, 1842, 1787, 1292,  307,  137,   16,  264,  436, 1910, 1203,  172, 1224,  859, 1275,  322, 1663 ],
                                [ undefined, // ZAT 5
                                   1574, 1872,  881, 1912,  778, 1568,  728, 1935, 1175, 1476, 1802, 1755,  133, 1447, 1797,  181,  300, 1810,  705, 1069,
                                    569,  954,   51, 1652,  817, 1030,  980,  145, 1018,  798, 1420,  559,  495, 1430,  602, 1066,  510, 1261, 1789,  161,
                                    169,  660,   67,  920,  890,  404,   68,   13,   39, 1226,  314,  520,  837,  157,  382,  121,  930,  224, 1813,  331,
                                   1841, 1237, 1758,  190,  618, 1858, 1096, 1933, 1772,  372,  761,   25, 1848,  327,  564, 1572,  715, 1493, 1771, 1923,
                                   1795, 1323,  616, 1152, 1461,  736, 1794,  582,  148,  381,  597,  273,  107,  182, 1016,  766,  505,/#1889#/471, 1222,
                                   1647,  691,  198, 1662,  477,  333,  132,  330,  483, 1164,  467,  674, 1212, 1071,  726, 1395,  152, 1377,  340, 1528,
                                    963, 1526,  689,  629, 1818,  741,  734,   38,  275,  313, 1451, 1596,  160,  188, 1820,   86, 1238, 1532,  252,  595,
                                    242,  878,   75,   82,  902, 1822, 1190, 1181, 1360,  419,  545, 1209,  610, 1821, 1901,  820,  667,  376, 1659, 1036,
                                    836, 1150, 1576,  463,  352,  346, 1110,  394, 1078, 1396,  373, 1197,  779,  763,  455, 1352, 1842, 1787, 1910,  307,
                                    137,   16,/#264#/ 436, 1292, 1203,  172, 1224,  859, 1275,  322, 1663 ],
                                [ undefined, // ZAT 6
                                   1574, 1872,  881, 1912,  778, 1568, 1175, 1935,  728, 1476, 1802, 1810,  133, 1447, 1797,  817,  300, 1755,  705, 1069,
                                    569,  954,   51, 1652,  181, 1030,  980,  145, 1018,  798, 1420,  559,  495, 1430,  602, 1066,   39, 1261, 1789,  161,
                                    169,  660,   67,  920,  890,  404,   68,   13,  510,  157,  837,  382,  314, 1226,  520,  121,  761,  224, 1813,  331,
                                   1858, 1237, 1758,  190,  618, 1841, 1096, 1461, 1772,  327,  930,   25, 1848,  372,  564, 1572,  715, 1493, 1771, 1923,
                                   1222, 1323,  616, 1152, 1933,  736, 1794,  582,  148,  381,  597,  273,  107,  182, 1377,  766,  505,  471, 1795, 1647,
                                    691,  198, 1662,  477,  333,  132,  330,  483, 1164,  467,  674, 1212, 1071,  726, 1395,  152, 1016,  340, 1528,  963,
                                   1526,  313,  629, 1818,  741,  734,   38,  275,  689, 1451,  252,  160,  188,  242,   86, 1901, 1532, 1596, 1078, 1820,
                                    878,   82,   75,  902, 1822, 1190, 1181, 1360,  394,  545, 1209,  610, 1821, 1238,  820,  667,  376, 1292, 1910,  836,
                                   1150, 1576,  463,  352,  346, 1110,  419,  595, 1396,  373, 1663,  779,  763,  455, 1352, 1842, 1787,/#1036#/307,  137,
                                     16,  436, 1659, 1203,  172, 1224,  859, 1275,  322, 1197 ],
                                [ undefined, // ZAT 7
                                [ undefined, // ZAT 8 - 9
                                   1574, 1912,  778, 1872,  881, 1568, 1175, 1935,  728, 1802, 1476, 1810,  133, 1447,  705,  817,  300, 1755, 1797, 1069,
                                    569,  559,   51, 1652,  181, 1030,  980,  145, 1018,  798,  602,  954,  495, 1430, 1420, 1066,   39, 1261, 1789,  161,
                                    169,  660,   67,  920,  890,  404,   68,   13,  510,  157,  837,  382,  314, 1226,  520,  121,  761,  224, 1813,  331,
                                   1858, 1237, 1758,  190,  618, 1841, 1096, 1461, 1772,  327,  930,   25, 1848,  372,  564, 1572,  715, 1923, 1771, 1493,
                                   1222, 1323,  616, 1152, 1933,  736, 1794,  582,  148,  477,  273,  597,  107,  340, 1377,  766,  505,  471, 1795, 1212,
                                    691,  198, 1662,  381,  333,  132,  330,  483, 1164,  467,  674, 1647, 1071,  726, 1395,  152, 1016,  182, 1528,  963,
                                   1526,  313,  629, 1818,  741,  734,   38,  275,  689,  188,  252,  160, 1451,  242,   86, 1901, 1532, 1596, 1820,  878,
                                     82,   75,  902, 1822, 1190, 1181, 1360,  394,  545, 1209,  610,  667, 1238,  820, 1821,  376, 1292, 1910,  836, 1150,
                                   1576,  137,  352,  346, 1110,  419,  595, 1396,  373, 1663,  779,  763,  455, 1352, 1842, 1787,  307,  463,   16,  436,
                                   1659, 1203,  172, 1224,  859, 1275,  322, 1197, 1186,   21,  170 ],
                                [ undefined, // ZAT 10
                                   1912, 1574,  778, 1872, 1935, 1568, 1175,  881,  728, 1802, 1476, 1810, 1447,  133,  705,  559,  181,   51, 1797, 1652,
                                    569,  817, 1755, 1069,  300, 1420,  980,  145,  161, 1066,  602,  954,  495, 1430, 1030,  798,   39, 1261,  382, 1018,
                                    157,  660,  890,  920,   67,  404,   68,   13,  510,  169,  761, 1789,  314, 1226,  520,  121,  837,  930, 1813,  331,
                                   1858, 1923, 1758,  190,  618, 1841, 1096, 1461, 1772,  327,  224,   25,  148,  564,  372, 1572,  715, 1237, 1771, 1493,
                                   1222, 1323,  340, 1152, 1933,  736, 1794,  582, 1848,  477,  273,  597,  330,  616, 1377,  766, 1647,  471,  691, 1212,
                                   1795,  198, 1662,/#381#/ 333, 1526,  107,   86, 1164,  467, 1528,  505, 1071,  726, 1395,  152,  741,  182,  674,  963,
                                    132,  313,  629, 1818, 1016,  734,   38,  275,  689,  188,  252,  160, 1451,  242,  483, 1901, 1532, 1596, 1663, 1910,
                                     82,   75,  902, 1822, 1190, 1181, 1110,  394, 1209,  545,  610,  667,  346,  779, 1821,  376, 1292,  878,  836,/#1150#/
                                   1576,  137,  352, 1238, 1360, 1352,  595, 1396,  373, 1820,  820,  763,  170,  419, 1224, 1787,  307,  463, 1186,  436,
                                   1659, 1203,  172, 1842,  859, 1275,  322, 1197,   16,   21,  455 ],
                                [ undefined, // ZAT 11
                                   1912, 1574, 778,/#1872#/1935, 1568,  728,  881, 1175, 1802, 1476, 1810, 1447,  133,  705,  559,  181,   51, 1797, 1652,
                                    569,  817, 1755, 1069,  300, 1420,  980,  145,  161, 1066,  602,  920,  660, 1430, 1030,  798,   68,  404,  382, 1018,
                                    157,  495,  890,  954,   67, 1261,   39,  121,  510,  169,  761, 1789,  314, 1226,  520,   13,  837,  930, 1813,  331,
                                   1858, 1923, 1758,  190,  618, 1841,  477, 1461, 1771,  327,  224,   25,  148,  564,  372, 1572,  715,1237,/#1772#/1493,
                                   1222, 1323,  340, 1152, 1933,  736, 1794,  582, 1848, 1096,  273,  597,  330,  616, 1377,  766, 1647,  471,  691, 1212,
                                   1795,  198, 1662,  333, 1526,  107,   86, 1164,  467, 1528,  505, 1071,  726,  182,  152,  741, 1395,  674,  963,  132,
                                    313,  629, 1818, 1016,  734, 1190,  275,  689,  188,  252,  160,   82,  242, 483,/#1901#/1532, 1596, 1663, 1910, 1451,
                                     75,  902, 1822,  38,/#1181#/1110,  394, 1209,  545,  610,  836,  346,  779, 1821,  376, 1292,  878,  667, 1576,  137,
                                    352, 1238, 1360, 1352,  595,/#1396#/373, 1820,  820,  763,  170,  419, 1224, 1787,  307,  463, 1186,  436, 1659, 1203,
                                    172, 1842,  859, 1275,  322, 1197,   16,   21,  455, 1076, 1825,  563, 1527, 1554, 1177, 1843 ],
                                [ undefined, // ZAT 12
                                   1912, 1568,  778, 1935, 1574,  728,  881, 1175, 1802, 1476, 1810, 1447,  133,  705,  559,  181,   51, 1797, 1652,  569,
                                    817,  798,  920,  602, 1420,  980,  145,  161, 1066,  300, 1069,  660, 1430, 1030, 1755,   68,  404,  382, 1018,  510,
                                    761,  890,  954,   67,  930,   39,  121,  157,  331,  495, 1923,  314, 1226,  520,   13, 1813, 1261,  837,  169, 1858,
                                   1789, 1461,  477,  618, 1841,  190, 1758, 1771,  327,  224, 1323,  148,  564, 1222, 1572,  715, 1237, 1662,  372,   25,
                                    340, 1152,  198,  736, 1526,  582, 1848, 1096,  273,  597,  330,  616, 1377,  766, 1647,  471,  691, 1212,  726, 1933,
                                   1493,  333, 1794,  107,  313, 1164,  483, 1528,  505, 1071, 1795,  182,  152,  629, 1395,  674,  963,  132,   86,  741,
                                   1818, 1451,  734, 1190,  275,   82,  188,  252,  160,  689,  242,  467, 1532, 1596, 1663, 1910, 1016,   75,  170, 1822,
                                     38, 1110,  394, 1209,  545,  610,  836,  346,  779, 1821,  376, 1292,  878,  667, 1576,  137,  352, 1238, 1360, 1352,
                                    595,  373, 1820,  820,  763,  902, 1842, 1224,/#463#/ 307, 1787, 1186,  436, 1659, 1203,  172,  419,  859, 1275,  322,
                                   1197, 1843,   21,  455, 1076, 1825,  563, 1527, 1554, 1177,   16,  977, 1204 ],
                                [ undefined, // ZAT 13 ???
                                   1912, 1574,  778, 1935, 1568,  728,  881, 1175, 1802, 1476, 1810, 1447,  133,  705,  559,  181,   51, 1797, 1652,  569,
                                    817, 1755, 1069,  300, 1420,  980,  145,  161, 1066,  602,  920,  660, 1430, 1030,  798,   68,  404,  382, 1018,  157,
                                    495,  890,  954,   67, 1261,   39,  121,  510,  169,  761, 1789,  314, 1226,  520,   13,  837,  930, 1813,  331, 1858,
                                   1923, 1758,  190,  618, 1841,  477, 1461, 1771,  327,  224,   25,  148,  564,  372, 1572,  715, 1237, 1493, 1222, 1323,
                                    340, 1152, 1933,  736, 1794,  582, 1848, 1096,  273,  597,  330,  616, 1377,  766, 1647,  471,  691, 1212, 1795,  198,
                                   1662,  333, 1526,  107,   86, 1164,  467, 1528,  505, 1071,  726,  182,  152,  741, 1395,  674,  963,  132,  313,  629,
                                   1818, 1016,  734, 1190,  275,  689,  188,  252,  160,   82,  242,  483, 1532, 1596, 1663, 1910, 1451,   75,  902, 1822,
                                     38, 1110,  394, 1209,  545,  610,  836,  346,  779, 1821,  376, 1292,  878,  667, 1576,  137,  352, 1238, 1360, 1352,
                                    595,  373, 1820,  820,  763,  170,  419, 1224, 1787,  307,  463, 1186,  436, 1659, 1203,  172, 1842,  859, 1275,  322,
                                   1197,   16,   21,  455, 1076, 1825,  563, 1527, 1554, 1177, 1843 ],
                                [ undefined, // ZAT 13 Fehler 61 - 85
                                    778, 1568, 1912, 1935, 1574,  728,  881, 1175, 1802, 1476, 1810,   51,  133,  705,  559,  817, 1447,  980, 1652,  569,
                                    181,  798,  920,  602, 1420, 1797,  145,  954, 1066,  300, 1069,  660, 1430, 1030, 1755,   68,  404,  382, 1018,  510,
                                    761,  890,  161,   67,  930,   39,  121,  157,  331,  495, 1923,  314, 1226,  520,   13, 1813, 1261,  837,  169,  327,
                                    190, 1758, 1771, 1858,  224, 1323,  148,  564, 1222, 1572,  715, 1237, 1662,  372,   25,  340, 1152,  198,  736, 1526,
                                   1789, 1461,  477,  618, 1841, 1848,  582, 1096,  273, 1377,  330,  616,  597,  766,  691,  471, 1647, 1212,  726, 1933,
                                   1493,  333, 1794,  107,  313, 1164,  483, 1528,  505, 1071, 1795,  182,  152,  629, 1395,  674,  963,  132,   86,  741,
                                    394, 1451,  734,   75,  275,   82,  188,  252,  160,  689,  242,  467, 1532, 1596,  667, 1910, 1016, 1190,  170, 1822,
                                   1821, 1110, 1818, 1209,  545,  610,  836,  346,  779,   38,  376, 1197,  878, 1663, 1576,  137,  352, 1238, 1360, 1352,
                                    595,  373, 1820,  820,  763,  902, 1842, 1224,  307, 1787, 1186,  436, 1659, 1203,  172,  419,  859, 1275,  322, 1292,
                                   1843,   21, 1076,  455, 1825,  563, 1527, 1554, 1177,   16,  977, 1204, 1168, 1872,  693, 1086 ],
                                [ undefined, // ZAT 13 - 14
                                    778, 1568, 1912, 1935, 1574,  728,  881, 1175, 1802, 1476, 1810,   51,  133,  705,  559,  817, 1447,  980, 1652,  569,
                                    181,  798,  920,  602, 1420, 1797,  145,  954, 1066,  300, 1069,  660, 1430, 1030, 1755,   68,  404,  382, 1018,  510,
                                    761,  890,  161,   67,  930,   39,  121,  157,  331,  495, 1923,  314, 1226,  520,   13, 1813, 1261,  837,  169,  327,
                                   1789, 1461,  477,  618, 1841,  190, 1758, 1771, 1858,  224, 1323,  148,  564, 1222, 1572,  715, 1237, 1662,  372,   25,
                                    340, 1152,  198,  736, 1526, 1848,  582, 1096,  273, 1377,  330,  616,  597,  766,  691,  471, 1647, 1212,  726, 1933,
                                   1493,  333, 1794,  107,  313, 1164,  483, 1528,  505, 1071, 1795,  182,  152,  629, 1395,  674,  963,  132,   86,  741,
                                    394, 1451,  734,   75,  275,   82,  188,  252,  160,  689,  242,  467, 1532, 1596,  667, 1910, 1016, 1190,  170, 1822,
                                   1821, 1110, 1818, 1209,  545,  610,  836,  346,  779,   38,  376, 1197,  878, 1663, 1576,  137,  352, 1238, 1360, 1352,
                                    595,  373, 1820,  820,  763,  902, 1842, 1224,  307, 1787, 1186,  436, 1659, 1203,  172,  419,  859, 1275,  322, 1292,
                                   1843,   21, 1076,  455, 1825,  563, 1527, 1554, 1177,   16,  977, 1204, 1168, 1872,  693, 1086 ],
                             */
                                [ undefined, // ZAT 15
                                    778, 1568, 1912, 1935, 1574,  728,  881, 1175, 1802, 1476, 1810,   51,  133,  705,  559,  817, 1447,  980, 1652,  569,
                                    181,  798,  920,  602, 1420, 1797,  145,  954, 1066,  300, 1069,  660, 1430, 1030, 1755,   68,  404,  382, 1018,  510,
                                    761,  890,  161,   67,  930,   39,  121,  157,  331,  495, 1923,  314, 1226,  520,   13, 1813, 1261,  837,  169,  327,
                                   1789, 1461,  477,  618, 1841,  190, 1758, 1771, 1858,  224, 1323,  148,  564, 1222, 1572,  715, 1237, 1662,  372,   25,
                                    340, 1152,  198,  736, 1526, 1848,  582, 1096,  273, 1377,  330,  616,  597,  766,  691,  471, 1647, 1212,  726, 1933,
                                   1493,  333, 1794,  107,  313, 1164,  483, 1528,  505, 1071, 1795,  182,  152,  629, 1395,  674,  963,  132,   86,  741,
                                    394, 1451,  734,   75,  275,   82,  188,  252,  160,  689,  242,  467, 1532, 1596,  667, 1910, 1190,  170, 1822, 1821,
                                   1110, 1818, 1209,  545,  610,  836,  346,  779,   38,  376, 1197,  878, 1663, 1576,  137,  352, 1238, 1360, 1352,  595,
                                    373, 1820,  820,  763,  902, 1842,/*307*/1787, 1186,  436, 1659, 1203,  172,  419,  859, 1275,  322, 1292, 1843,   21,
                                   1076,  455, 1825,  563, 1527, 1554, 1177,   16,  977, 1204, 1168, 1872,  693, 1086,  441,  345,  129, 1838,  389 ],
                             /*
                                [ undefined, // ZAT 16
                                    778, 1568, 1912, 1935, 1802,  728,  881, 1175, 1574, 1476, 1810,   51, 1652,  705,  559,  817, 1447,  980,  133,  181,
                                    569, 1430,   68,  602, 1420, 1797,  145,  954, 1066,  930,  382,  660,  798,  510, 1755,  920,  495, 1069,  761, 1030,
                                   1018,  157,  121,   67,  300,   39,  161,  890,  331,  404, 1923,  314, 1461,  520,   13, 1813, 1261,  837,  169,  327,
                                   1323, 1226,  477,  618, 1858,  190,  582, 1771, 1841,  273, 1789,  148,  564, 1222, 1572,  715, 1237, 1662, 1096,  597,
                                    340, 1152,  198,  736, 1526, 1848, 1758,  372,  224, 1377,  330,  616,   25,  766,  691,  471, 1647, 1212,  726, 1933,
                                   1493,  333, 1794,  107,  313, 1164,  483,  275,   86, 1071, 1795,  182,  152,  629, 1395,  674,  963,  252,  505,  741,
                                    394, 1451,  734,   75, 1528,   82,  188,  132,  160,  689,  242,  467, 1818, 1596,  667, 1910, 1190,  170, 1663, 1821,
                                   1110, 1532, 1209,  545,  610,  836,  346,  763,   38,  376, 1197, 1842, 1822, 1576,  137,  352,  419, 1360, 1352,  595,
                                    563, 1820,  820,  779, 1659,  878, 1275, 1186, 1204,  902, 1203,  172, 1238,  859, 1787,  322, 1292, 1843,   21, 1076,
                                    455, 1825,  373, 1527, 1168, 1177,   16,  977,  436, 1554, 1872,  693, 1086,  441,  345,  129, 1838,  389,  987 ],
                             */
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Alte Platz-IDs:"
               },
    'challIds' : {        // Datenspeicher fuer Team-IDs der Teams, die herausgefordert wurden
                   'Name'      : "challIds",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : false,
                   'Permanent' : true,
                   'Default'   : [],
                   'Submit'    : undefined,
                   'Cols'      : 20,
                   'Rows'      : 1,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Forderungen-IDs:"
               },
    'teamRanks' : {       // Datenspeicher fuer aktuelle Raenge der Teams nach Team-ID in der Rangliste
                   'Name'      : "teamRanks",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : { },
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Pl\xE4tze:"
               },
    'teamIds' : {         // Datenspeicher fuer aktuelle Team-IDs der Teams nach Namen
                   'Name'      : "teamIds",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : { },
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Team-IDs:"
               },
    'teamNames' : {       // Datenspeicher fuer die Namen der Teams nach Team-ID
                   'Name'      : "teamNames",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : { },
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "Teams:"
               },
    'gegner' : {          // Datenspeicher fuer zugeloste Gegner
                   'Name'      : "gegner",
                   'Type'      : __OPTTYPES.SD,
                   'Hidden'    : false,
                   'Serial'    : true,
                   'AutoReset' : true,
                   'Permanent' : true,
                   'Default'   : { },
                   'Submit'    : undefined,
                   'Cols'      : 36,
                   'Rows'      : 20,
                   'Replace'   : null,
                   'Space'     : 0,
                   'Label'     : "FSS-Gegner:"
               },
    'reset' : {           // Optionen auf die "Werkseinstellungen" zuruecksetzen
                   'FormPrio'  : undefined,
                   'Name'      : "reset",
                   'Type'      : __OPTTYPES.SI,
                   'Action'    : __OPTACTION.RST,
                   'Label'     : "Standard-Optionen",
                   'Hotkey'    : 'r',
                   'FormLabel' : ""
               },
    'storage' : {         // Browserspeicher fuer die Klicks auf Optionen
                   'FormPrio'  : undefined,
                   'Name'      : "storage",
                   'Type'      : __OPTTYPES.MC,
                   'ValType'   : 'String',
                   'Choice'    : Object.keys(__OPTMEM),
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Speicher: $",
                   'Hotkey'    : 'c',
                   'FormLabel' : "Speicher:|$"
               },
    'oldStorage' : {      // Vorheriger Browserspeicher fuer die Klicks auf Optionen
                   'FormPrio'  : undefined,
                   'Name'      : "oldStorage",
                   'Type'      : __OPTTYPES.SD,
                   'PreInit'   : true,
                   'AutoReset' : true,
                   'Hidden'    : true
               },
    'showForm' : {        // Optionen auf der Webseite (true = anzeigen, false = nicht anzeigen)
                   'FormPrio'  : 1,
                   'Name'      : "showForm",
                   'Type'      : __OPTTYPES.SW,
                   'FormType'  : __OPTTYPES.SI,
                   'Permanent' : true,
                   'Default'   : false,
                   'Title'     : "$V Optionen",
                   'Action'    : __OPTACTION.NXT,
                   'Label'     : "Optionen anzeigen",
                   'Hotkey'    : 'O',
                   'AltTitle'  : "$V schlie\xDFen",
                   'AltLabel'  : "Optionen verbergen",
                   'AltHotkey' : 'O',
                   'FormLabel' : ""
               }
};

// ==================== Ende Konfigurations-Abschnitt fuer Optionen ====================

// ==================== Spezialisierter Abschnitt fuer Optionen ====================

// Gesetzte Optionen (wird von initOptions() angelegt und von loadOptions() gefuellt):
const __OPTSET = { };

// Logging initialisieren mit Loglevel (siehe ganz oben im Konfigurationsabschnitt)...
__LOG.init(window, __LOGLEVEL);

// Teamparameter fuer getrennte Speicherung der Optionen fuer Erst- und Zweitteam...
const __TEAMCLASS = new TeamClassification();

// Optionen mit Daten, die ZAT- und Team-bezogen gemerkt werden...
__TEAMCLASS.optSelect = {
                       'datenZat'     : true,
                       'oldDatenZat'  : true,
                       'rankIds'      : true,
                       'oldRankIds'   : true,
                       'challIds'     : true,
                       'teamRanks'    : true,
                       'teamIds'      : true,
                       'teamNames'    : true,
                       'gegner'       : true
                   };

// Behandelt die Optionen und laedt das Benutzermenu
// optConfig: Konfiguration der Optionen
// optSet: Platz fuer die gesetzten Optionen
// optParams: Eventuell notwendige Parameter zur Initialisierung
// 'hideMenu': Optionen werden zwar geladen und genutzt, tauchen aber nicht im Benutzermenu auf
// 'teamParams': Getrennte Daten-Option wird genutzt, hier: Team() mit 'LdNr'/'LgNr' des Erst- bzw. Zweitteams
// 'menuAnchor': Startpunkt fuer das Optionsmenu auf der Seite
// 'showForm': Checkliste der auf der Seite sichtbaren Optionen (true fuer sichtbar)
// 'hideForm': Checkliste der auf der Seite unsichtbaren Optionen (true fuer unsichtbar)
// 'formWidth': Anzahl der Elemente pro Zeile
// 'formBreak': Elementnummer des ersten Zeilenumbruchs
// return Promise auf gefuelltes Objekt mit den gesetzten Optionen
function buildOptions(optConfig, optSet = undefined, optParams = { 'hideMenu' : false }) {
    // Klassifikation ueber Land und Liga des Teams...
    __TEAMCLASS.optSet = optSet;  // Classification mit optSet verknuepfen
    __TEAMCLASS.teamParams = optParams.teamParams;  // Ermittelte Parameter

    return startOptions(optConfig, optSet, __TEAMCLASS).then(
                optSet => showOptions(optSet, optParams),
                defaultCatch);
}

// ==================== Ende Abschnitt fuer Optionen ====================

// ==================== Abschnitt fuer sonstige Parameter ====================

const __TEAMSEARCHHAUPT = {  // Parameter zum Team "<b>Willkommen im Managerb&uuml;ro von TEAM</b><br>LIGA LAND<a href=..."
        'Zeile'  : 0,
        'Spalte' : 1,
        'start'  : " von ",
        'middle' : "</b><br>",
        'liga'   : ". Liga",
        'land'   : ' ',
        'end'    : "<a href="
    };

const __TEAMSEARCHTEAM = {  // Parameter zum Team "<b>TEAM - LIGA <a href=...>LAND</a></b>"
        'Zeile'  : 0,
        'Spalte' : 0,
        'start'  : "<b>",
        'middle' : " - ",
        'liga'   : ". Liga",
        'land'   : 'target="_blank">',
        'end'    : "</a></b>"
    };

// Ermittelt, wie das eigene Team heisst und aus welchem Land bzw. Liga es kommt (zur Unterscheidung von Erst- und Zweitteam)
// cell: Tabellenzelle mit den Parametern zum Team "startTEAMmiddleLIGA...landLANDend", LIGA = "#liga[ (A|B|C|D)]"
// teamSeach: Muster fuer die Suche, die Eintraege fuer 'start', 'middle', 'liga', 'land' und 'end' enthaelt
// return Im Beispiel { 'Team' : "TEAM", 'Liga' : "LIGA", 'Land' : "LAND", 'LdNr' : LAND-NUMMER, 'LgNr' : LIGA-NUMMER },
//        z.B. { 'Team' : "Choromonets Odessa", 'Liga' : "1. Liga", 'Land' : "Ukraine", 'LdNr' : 20, 'LgNr' : 1 }
function getTeamParamsFromTable(table, teamSearch = undefined) {
    const __TEAMSEARCH   = getValue(teamSearch, __TEAMSEARCHHAUPT);
    const __TEAMCELLROW  = getValue(__TEAMSEARCH.Zeile, 0);
    const __TEAMCELLCOL  = getValue(__TEAMSEARCH.Spalte, 0);
    const __TEAMCELLSTR  = (table === undefined) ? "" : table.rows[__TEAMCELLROW].cells[__TEAMCELLCOL].innerHTML;
    const __SEARCHSTART  = __TEAMSEARCH.start;
    const __SEARCHMIDDLE = __TEAMSEARCH.middle;
    const __SEARCHLIGA   = __TEAMSEARCH.liga;
    const __SEARCHLAND   = __TEAMSEARCH.land;
    const __SEARCHEND    = __TEAMSEARCH.end;
    const __INDEXSTART   = __TEAMCELLSTR.indexOf(__SEARCHSTART);
    const __INDEXEND     = __TEAMCELLSTR.indexOf(__SEARCHEND);

    let teamParams = __TEAMCELLSTR.substring(__INDEXSTART + __SEARCHSTART.length, __INDEXEND);
    const __INDEXLIGA = teamParams.indexOf(__SEARCHLIGA);
    const __INDEXMIDDLE = teamParams.indexOf(__SEARCHMIDDLE);

    let land = ((~ __INDEXLIGA) ? teamParams.substring(__INDEXLIGA + __SEARCHLIGA.length) : undefined);
    const __TEAMNAME = ((~ __INDEXMIDDLE) ? teamParams.substring(0, __INDEXMIDDLE) : undefined);
    let liga = (((~ __INDEXLIGA) && (~ __INDEXMIDDLE)) ? teamParams.substring(__INDEXMIDDLE + __SEARCHMIDDLE.length) : undefined);

    if (land !== undefined) {
        if (land.charAt(2) === ' ') {    // Land z.B. hinter "2. Liga A " statt "1. Liga "
            land = land.substr(2);
        }
        if (liga !== undefined) {
            liga = liga.substring(0, liga.length - land.length);
        }
        const __INDEXLAND = land.indexOf(__SEARCHLAND);
        if (~ __INDEXLAND) {
            land = land.substr(__INDEXLAND + __SEARCHLAND.length);
        }
    }

    const __TEAM = new Team(__TEAMNAME, land, liga);

    return __TEAM;
}

// Verarbeitet die URL der Seite und ermittelt die Nummer der gewuenschten Unterseite
// url: Adresse der Seite
// leafs: Liste von Filenamen mit der Default-Seitennummer (falls Query-Parameter nicht gefunden)
// item: Query-Parameter, der die Nummer der Unterseite angibt
// return Parameter aus der URL der Seite als Nummer
function getPageIdFromURL(url, leafs, item = 'page') {
    const __URI = new URI(url);
    const __LEAF = __URI.getLeaf();

    for (let leaf in leafs) {
        if (__LEAF === leaf) {
            const __DEFAULT = leafs[leaf];

            return getValue(__URI.getQueryPar(item), __DEFAULT);
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

// Ermittelt die Platzierungen der Rangliste aus der HTML-Tabelle und speichert diese
// table: Tabelle mit der Rangliste
// optSet: Platz fuer die gesetzten Optionen
function calcRanksFromTable(table, optSet) {
    const __RANKBOXES = table.getElementsByTagName('span');
    const __RANKIDS = [];
    const __TEAMIDS = { };
    const __TEAMNAMES = { };

    for (let team of __RANKBOXES) {
        const __TEXT = team.textContent;
        const __TEAMLINK = getTable(0, 'a', team);
        const __TEAMNAME = __TEAMLINK.textContent;
        const __HREF = __TEAMLINK.href;
        const __RANKMATCH = /^\d+\./.exec(__TEXT);
        const __RANK = parseInt(__RANKMATCH[0], 10);
        const __TEAMIDMATCH = /\d+$/.exec(__HREF);
        const __TEAMID = parseInt(__TEAMIDMATCH[0], 10);

        __RANKIDS[__RANK] = __TEAMID;

        __TEAMIDS[__TEAMNAME] = __TEAMID;
        __TEAMNAMES[__TEAMID] = __TEAMNAME;
    }

    const __TEAMRANKS = reverseMapping(__RANKIDS, x => Number(x));

    // Neuen Rangliste speichern...
    setOpt(optSet.rankIds, __RANKIDS, false);
    setOpt(optSet.teamRanks, __TEAMRANKS, false);
    setOpt(optSet.teamIds, __TEAMIDS, false);
    setOpt(optSet.teamNames, __TEAMNAMES, false);
}

// Ermittelt die IDs der herausgeforderten Teams aus der HTML-Tabelle und speichert diese
// page: Enthaelt Liste mit den Herausforderungen
// optSet: Platz fuer die gesetzten Optionen
function calcChallengesFromHTML(page, optSet) {
    const __OLISTS = page.getElementsByTagName('ol');

    if (__OLISTS && (__OLISTS.length == 3)) {
        const __CHALLENGES = __OLISTS[0];
        const __CHALLBOXES = __CHALLENGES.getElementsByTagName('span');
        const __CHALLIDS = [];

        for (let team of __CHALLBOXES) {
            const __TEAMLINK = getTable(0, 'a', team);
            const __HREF = __TEAMLINK.href;
            const __TEAMIDMATCH = /\d+$/.exec(__HREF);
            const __TEAMID = parseInt(__TEAMIDMATCH[0], 10);

            __CHALLIDS.push(__TEAMID);
        }

        __LOG[4](__CHALLIDS);

        if (__CHALLIDS.length) {
            // Neuen Forderungsliste speichern...
            setOpt(optSet.challIds, __CHALLIDS, false);
        }
    }
}

// Ermittelt die Gegner aus der HTML-Tabelle und speichert diese
// games: Liste der ausgelosten Spiele
// optSet: Platz fuer die gesetzten Optionen
function calcGegner(games, optSet) {
    const __GEGNER = { };

    for (let game of games) {
        const __TEAMLINKS = game.getElementsByTagName('a');
        const __HEIMIDMATCH = /\d+$/.exec(__TEAMLINKS[0].href);
        const __GASTIDMATCH = /\d+$/.exec(__TEAMLINKS[1].href);
        const __HEIMID = parseInt(__HEIMIDMATCH[0], 10);
        const __GASTID = parseInt(__GASTIDMATCH[0], 10);

        __GEGNER[__HEIMID] = __GASTID;
        __GEGNER[__GASTID] = __HEIMID;
    }

    // Neuen Rangliste speichern...
    setOpt(optSet.gegner, __GEGNER, false);
}

// Hilfsfunktion: Formatiert eine Box im Ranking
// box: "span"-Bereich eines Teams in der Rangliste des offiziellen FSS-Turniers
// color: falls angegeben, gewuenschte Schriftfarbe
// bgColor: falls angegeben, gewuenschte Hintergrundfarbe
// substRank: Ersatztext fuer die Platzierungsangabe, "$1." ist der Originaltext
function formatRankBox(box, color, bgColor, substRank) {
    if (substRank) {
        const __HTML = box.innerHTML;

        box.innerHTML = __HTML.replace(/<b>(\d+)\.<\/b>/, "<b>" + substRank + "<\/b>");
    }
    if (bgColor) {
        box.style.backgroundColor = bgColor;
    }
    if (color) {
        box.style.color = color;
    }
}

// Markiert alle Aenderungen am Ranking
// table: Tabelle mit der Rangliste
// optSet: Gesetzte Optionen
function markChanges(table, optSet) {
    const __RANKBOXES = table.getElementsByTagName('span');
    const __RANKIDS = getOptValue(optSet.rankIds);
    const __OLDRANKIDS = getOptValue(optSet.oldRankIds);
    const __TEAMRANKS = getOptValue(optSet.teamRanks);
    const __OLDTEAMRANKS = reverseMapping(__OLDRANKIDS, x => Number(x));
    const __GEGNER = getOptValue(optSet.gegner);

    for (let team of __RANKBOXES) {
        const __TEXT = team.textContent;
        const __RANKMATCH = /^\d+\./.exec(__TEXT);
        const __RANK = parseInt(__RANKMATCH[0], 10);
        const __RANKID = __RANKIDS[__RANK];
        const __OLDRANKID = __OLDRANKIDS[__RANK];

        if (__OLDRANKID === undefined) {  // neuer Rang (Neuanmeldung)
            const __CORANK = __OLDTEAMRANKS[__RANKID];

            if (__CORANK) {  // Neuanmeldung war bereits platziert
                formatRankBox(team, undefined, 'brown', getOrdinal("$1") + " (" + getOrdinal(__CORANK) + ')');
            } else {  // normale Neuanmeldung
                formatRankBox(team, undefined, 'black');
            }
        } else if (__OLDRANKID !== __RANKID) {  // Platzwechsel
            const __CORANK = __TEAMRANKS[__OLDRANKID];
            const __COLOR = ((__CORANK < __RANK) ? 'red' : 'cyan');

            formatRankBox(team, __COLOR, undefined, getOrdinal("$1") + " (" + getOrdinal(__CORANK) + ')');
        } else if (__GEGNER[__RANKID]) {  // FSS angesetzt
            const __GEGNERID = __GEGNER[__RANKID];
            const __CORANK = __TEAMRANKS[__GEGNERID];
            const __ARROW = ((__CORANK < __RANK) ? "&lt;" : "&gt;");

            formatRankBox(team, 'magenta', undefined, "$1. " + __ARROW + ' ' + getOrdinal(__CORANK));
        } else {
            // Kein FSS beim Turnier...
            formatRankBox(team);
        }
    }
}

// Markiert bestimmte Teams in der Rangliste (eigenes Team, Gegner)
// table: Tabelle mit der Rangliste
// optSet: Gesetzte Optionen
// teamName: Name des eigenen Teams
// teamName: Name des gegnerischen Teams
function markTeam(table, optSet, teamName, gegnerName) {
    const __RANKBOXES = table.getElementsByTagName('span');
    const __RANKIDS = getOptValue(optSet.rankIds);
    const __CHALLIDS = getOptValue(optSet.challIds);

    for (let team of __RANKBOXES) {
        const __TEAMLINK = getTable(0, 'a', team);
        const __NAME = __TEAMLINK.textContent;

        if (__NAME === teamName) {
            formatRankBox(team, undefined, 'blue');
        } else if (__NAME === gegnerName) {
            formatRankBox(team, undefined, 'darkred');
        } else {
            const __TEXT = team.textContent;
            const __RANKMATCH = /^\d+\./.exec(__TEXT);
            const __RANK = parseInt(__RANKMATCH[0], 10);
            const __RANKID = __RANKIDS[__RANK];

            //if (__CHALLIDS.some(x => (x === __RANKID))) {
            for (let challId of __CHALLIDS) {
                if (challId == __RANKID) {
                    formatRankBox(team, undefined, 'grey');
                }
            }
        }
    }
}

// ==================== Ende Abschnitt fuer sonstige Parameter ====================

// ==================== Erzeugung von Testdaten ====================

function testItemAppend(node, platz, id, name) {
    const __LI = document.createElement('li');
    const __SPAN = document.createElement('span');
    const __B = document.createElement('b');
    const __BR1 = document.createElement('br');
    const __BR2 = document.createElement('br');
    const __A1 = document.createElement('a');
    const __A2 = document.createElement('a');

    __B.append(platz + '.');

    //__A1.onclick
    __A1.href = "https://os.ongapo.com/st.php?c=" + id;
    __A1.append(name);

    __A2.className = "MINUS";
    __A2.href = "https://os.ongapo.com/fssturnier.php?cancelforderung=" + id + "#d";
    __A2.append("Forderung zur\xFCcknehmen");

    __SPAN.className = "fsst_team";
    __SPAN.append(__B, __BR1, __A1, __BR2, __A2);

    __LI.append(__SPAN);

    node.append(__LI);
}

function testInsertBefore1(node, before) {
    const __OL = document.createElement('ol');

    testItemAppend(__OL, 56, 404, "Drovno Siroki Brijeg");
    testItemAppend(__OL, 58, 1933, "Dynamo Astrakhan");
    testItemAppend(__OL, 57, 1226, "Blo-W\xE4iss Lintgen");

    node.insertBefore(__OL, before);
}

function testInsertBefore2(node, before) {
    const __OL = document.createElement('ol');

    testItemAppend(__OL, 79, 381, "Schleswig Kiel");
    testItemAppend(__OL, 83, 1323, "Atletico Coimbra");
    testItemAppend(__OL, 80, 1858, "FK Petropavlovsk");

    node.insertBefore(__OL, before);
}

// ==================== Ende Erzeugung von Testdaten ====================

// ==================== Hauptprogramm ====================

// Verarbeitet Ansicht "Haupt" (Managerbuero) zur Ermittlung des aktuellen ZATs
function procHaupt() {
    const __TEAMPARAMS = getTeamParamsFromTable(getTable(1), __TEAMSEARCHHAUPT);  // Link mit Team, Liga, Land...

    return buildOptions(__OPTCONFIG, __OPTSET, {
                            'teamParams' : __TEAMPARAMS,
                            'hideMenu'   : true
                        }).then(async optSet => {
            const __ZATCELL = getProp(getProp(getRows(0), 2), 'cells', { })[0];
            const __NEXTZAT = getZATNrFromCell(__ZATCELL);  // "Der naechste ZAT ist ZAT xx und ..."
            const __CURRZAT = __NEXTZAT - 1;
            const __DATAZAT = getOptValue(__OPTSET.datenZat);

            // Stand der alten Daten merken...
            setOpt(__OPTSET.oldDatenZat, __DATAZAT, false);

            if (__CURRZAT >= 0) {
                __LOG[2]("Aktueller ZAT: " + __CURRZAT);

                // Neuen aktuellen ZAT speichern...
                setOpt(__OPTSET.aktuellerZat, __CURRZAT, false);

                if (__CURRZAT !== __DATAZAT) {
                    __LOG[2](__LOG.changed(__DATAZAT, __CURRZAT));

                    // ... und ZAT-bezogene Daten als veraltet markieren (ausser 'skills' und 'positions')
                    await __TEAMCLASS.deleteOptions({
                                                  'datenZat'    : true,
                                                  'oldDatenZat' : true
                                              }).catch(defaultCatch);

                    // Neuen Daten-ZAT speichern...
                    setOpt(__OPTSET.datenZat, __CURRZAT, false);
                }
            }
        });
}

// Verarbeitet Ansicht "FSS-Turniere" (Register-Tab 'd' : "offizielles FSS-Turnier")
function procOSFSSTurnier() {
    const __TAB4 = document.getElementById('d');

    if ((__TAB4 === undefined) || (__TAB4 === null)) {
        __LOG[2]("Diese Seite ist ohne Team nicht verf\xFCgbar!");
    } else {
        // Nur Test: Daten produzieren...
        //testInsertBefore1(__TAB4, __TAB4.getElementsByTagName('ol')[0]);

        return buildOptions(__OPTCONFIG, __OPTSET, {
                                'menuAnchor' : __TAB4,
                                'formWidth'  : 1
                            }).then(optSet => {
                const __TABLE = getTable(0, 'table', __TAB4);
                const __GAMELIST = getTable(0, 'ul', __TAB4);
                const __MYTEAM = getOptValue(__OPTSET.team);
                const __GEGNER = getOptValue(__OPTSET.gegner);
                const __TEAMIDS = getOptValue(__OPTSET.teamIds);
                const __TEAMNAMES = getOptValue(__OPTSET.teamNames);

                calcRanksFromTable(__TABLE, __OPTSET);
                calcChallengesFromHTML(__TAB4, __OPTSET);

                markChanges(__TABLE, __OPTSET);

                if (__GAMELIST !== undefined) {
                    const __GAMES = __GAMELIST.getElementsByTagName('li');

                    calcGegner(__GAMES, __OPTSET);
                }

                const __TEAMID = __TEAMIDS[__MYTEAM.Team];
                const __GEGNERID = __GEGNER[__TEAMID];
                const __GEGNERNAME = __TEAMNAMES[__GEGNERID];

                markTeam(__TABLE, __OPTSET, __MYTEAM.Team, __GEGNERNAME);
            });
    }
}

(() => {
    (async () => {
        try {
            // URL-Legende:
            // page=0: Managerbuero
            // page=1: offizielles FSS-Turnier

            // Verzweige in unterschiedliche Verarbeitungen je nach Wert von page:
            switch (getPageIdFromURL(window.location.href, {
                                                               'haupt.php'      : 0,  // Ansicht "Haupt" (Managerbuero)
                                                               'fssturnier.php' : 1   // Ansicht "FSS-Turniere" (offizielles FSS-Turnier)
                                                           }, 'page')) {
                case 0  : await procHaupt().catch(defaultCatch); break;
                case 1  : await procOSFSSTurnier().catch(defaultCatch); break;
                default : break;
            }

            return 'OK';
        } catch (ex) {
            return defaultCatch(ex);
        }
    })().then(rc => {
            __LOG[1]('SCRIPT END', __DBMOD.Name, '(' + rc + ')');
        })
})();

// *** EOF ***
