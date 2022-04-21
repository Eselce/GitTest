// ==UserScript==
// _name         OS2.class.column
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2017+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifischer Klasse ColumnManager
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.class.column.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse ColumnManager ====================

// Klasse fuer Spalten des Jugendkaders

/*class*/ function ColumnManager /*{
    constructor*/(optSet, colIdx, showCol) {
        'use strict';

        __LOG[4]("ColumnManager()");

        const __SHOWCOL = getValue(showCol, true);
        const __SHOWALL = ((__SHOWCOL === true) || (__SHOWCOL.Default === true));

        const __BIRTHDAYS = optSet.getOptValue('birthdays', []).length;
        const __TCLASSES = optSet.getOptValue('tClasses', []).length;
        const __PROGRESSES = optSet.getOptValue('progresses', []).length;

        const __ZATAGES = optSet.getOptValue('zatAges', []).length;
        const __TRAINIERT = optSet.getOptValue('trainiert', []).length;
        const __POSITIONS = optSet.getOptValue('positions', []).length;

        const __EINZELSKILLS = optSet.getOptValue('skills', []).length;
        const __PROJECTION = (__EINZELSKILLS && __ZATAGES);

        this.colIdx = colIdx;

        this.saison = optSet.getOptValue('saison');
        this.gt = optSet.getOptValue('zeigeJahrgang');
        this.gtUxx = optSet.getOptValue('zeigeUxx');

        this.fpId = (__BIRTHDAYS && __TCLASSES && __POSITIONS && getValue(__SHOWCOL.zeigeId, __SHOWALL) && optSet.getOptValue('zeigeId'));
        this.warn = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnung, __SHOWALL) && optSet.getOptValue('zeigeWarnung'));
        this.warnMonth = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungMonat, __SHOWALL) && optSet.getOptValue('zeigeWarnungMonat'));
        this.warnHome = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungHome, __SHOWALL) && optSet.getOptValue('zeigeWarnungHome'));
        this.warnDialog = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungDialog, __SHOWALL) && optSet.getOptValue('zeigeWarnungDialog'));
        this.warnAufstieg = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungAufstieg, __SHOWALL) && optSet.getOptValue('zeigeWarnungAufstieg'));
        this.warnLegende = (__ZATAGES && getValue(__SHOWCOL.zeigeWarnungLegende, __SHOWALL) && optSet.getOptValue('zeigeWarnungLegende'));
        this.bar = (__PROJECTION && getValue(__SHOWCOL.zeigeBalken, __SHOWALL) && optSet.getOptValue('zeigeBalken'));
        this.barAbs = optSet.getOptValue('absBalken');
        this.donor = optSet.getOptValue('foerderung');
        this.geb = (__BIRTHDAYS && getValue(__SHOWCOL.zeigeGeb, __SHOWALL) && optSet.getOptValue('zeigeGeb'));
        this.tal = (__TCLASSES && getValue(__SHOWCOL.zeigeTal, __SHOWALL) && optSet.getOptValue('zeigeTal'));
        this.quo = (__ZATAGES && __TRAINIERT && getValue(__SHOWCOL.zeigeQuote, __SHOWALL) && optSet.getOptValue('zeigeQuote'));
        this.aufw = (__PROGRESSES && getValue(__SHOWCOL.zeigeAufw, __SHOWALL) && optSet.getOptValue('zeigeAufw'));
        this.substAge = (__ZATAGES && getValue(__SHOWCOL.ersetzeAlter, __SHOWALL) && optSet.getOptValue('ersetzeAlter'));
        this.alter = (__ZATAGES && getValue(__SHOWCOL.zeigeAlter, __SHOWALL) && optSet.getOptValue('zeigeAlter'));
        this.fix = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeFixSkills, __SHOWALL) && optSet.getOptValue('zeigeFixSkills'));
        this.tr = (__EINZELSKILLS && __TRAINIERT && getValue(__SHOWCOL.zeigeTrainiert, __SHOWALL) && optSet.getOptValue('zeigeTrainiert'));
        this.zat = (__ZATAGES && getValue(__SHOWCOL.zeigeZatDone, __SHOWALL) && optSet.getOptValue('zeigeZatDone'));
        this.antHpt = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeAnteilPri, __SHOWALL) && optSet.getOptValue('zeigeAnteilPri'));
        this.antNeb = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeAnteilSec, __SHOWALL) && optSet.getOptValue('zeigeAnteilSec'));
        this.pri = (__EINZELSKILLS && getValue(__SHOWCOL.zeigePrios, __SHOWALL) && optSet.getOptValue('zeigePrios'));
        this.skill = (__EINZELSKILLS && getValue(__SHOWCOL.zeigeSkill, __SHOWALL) && optSet.getOptValue('zeigeSkill'));
        this.pos = (__EINZELSKILLS && __POSITIONS && getValue(__SHOWCOL.zeigePosition, __SHOWALL) && optSet.getOptValue('zeigePosition'));
        this.anzOpti = ((__EINZELSKILLS && getValue(__SHOWCOL.zeigeOpti, __SHOWALL)) ? optSet.getOptValue('anzahlOpti') : 0);
        this.anzMw =  ((__PROJECTION && getValue(__SHOWCOL.zeigeMW, __SHOWALL)) ? optSet.getOptValue('anzahlMW') : 0);
        this.substSkills = (__PROJECTION && getValue(__SHOWCOL.ersetzeSkills, __SHOWALL) && optSet.getOptValue('ersetzeSkills'));
        this.trE = (__PROJECTION && __TRAINIERT && getValue(__SHOWCOL.zeigeTrainiertEnde, __SHOWALL) && optSet.getOptValue('zeigeTrainiertEnde'));
        this.zatE = (__ZATAGES && getValue(__SHOWCOL.zeigeZatLeft, __SHOWALL) && optSet.getOptValue('zeigeZatLeft'));
        this.antHptE = (__PROJECTION && getValue(__SHOWCOL.zeigeAnteilPriEnde, __SHOWALL) && optSet.getOptValue('zeigeAnteilPriEnde'));
        this.antNebE = (__PROJECTION && getValue(__SHOWCOL.zeigeAnteilSecEnde, __SHOWALL) && optSet.getOptValue('zeigeAnteilSecEnde'));
        this.priE = (__PROJECTION && getValue(__SHOWCOL.zeigePriosEnde, __SHOWALL) && optSet.getOptValue('zeigePriosEnde'));
        this.skillE = (__PROJECTION && getValue(__SHOWCOL.zeigeSkillEnde, __SHOWALL) && optSet.getOptValue('zeigeSkillEnde'));
        this.anzOptiE = ((__PROJECTION && getValue(__SHOWCOL.zeigeOptiEnde, __SHOWALL)) ? optSet.getOptValue('anzahlOptiEnde') : 0);
        this.anzMwE = ((__PROJECTION && getValue(__SHOWCOL.zeigeMWEnde, __SHOWALL)) ? optSet.getOptValue('anzahlMWEnde') : 0);
        this.kennzE = optSet.getOptValue('kennzeichenEnde');
    }
//}

Class.define(ColumnManager, Object, {
        'toString'       : function() {  // Bisher nur die noetigsten Parameter ausgegeben...
                               let result = "Skillschnitt\t\t" + this.skill + '\n';
                               result += "Beste Position\t" + this.pos + '\n';
                               result += "Optis\t\t\t" + this.anzOpti + '\n';
                               result += "Marktwerte\t\t" + this.anzMw + '\n';
                               result += "Skillschnitt Ende\t" + this.skillE + '\n';
                               result += "Optis Ende\t\t" + this.anzOptiE + '\n';
                               result += "Marktwerte Ende\t" + this.anzMwE + '\n';

                               return result;
                           },
        'addCell'        : function(tableRow) {
                               return tableRow.insertCell(-1);
                           },
        'addAndFillCell' : function(tableRow, value, color, align, digits = 2) {
                               let text = value;

                               if ((value || (value === 0)) && isFinite(value) && (value !== true) && (value !== false)) {
                                   // Zahl einfuegen
                                   if (value < 1000) {
                                       // Mit Nachkommastellen darstellen
                                       text = parseFloat(value).toFixed(digits);
                                   } else {
                                       // Mit Tausenderpunkten darstellen
                                       text = getNumberString(value.toString());
                                   }
                               }

                               // String, Boolean oder Zahl einfuegen...
                               const __CELL = this.addCell(tableRow);

                               __CELL.innerHTML = text;
                               if (color) {
                                   __CELL.style.color = color;
                               }
                               if (align) {
                                   __CELL.align = align;
                               }

                               return __CELL;
                           },
        'addAndBarCell'  : function(tableRow, value, scale = 100, offset = 0, width = 100, height = 10, zoom = 100) {
                               const __VALUE = ((scale && isFinite(value)) ? ((value - offset) / Math.max(1, scale - offset) * 100) : 0);

                               // HTML-Code fuer Anteilsbalken einfuegen...
                               const __CELL = this.addCell(tableRow);

                               __CELL.innerHTML = this.getBarImg(__VALUE, width, height, zoom);
                               __CELL.align = 'left';

                               return __CELL;
                           },
        'getBarImg'      : function(value, width = 100, height = 10, zoom = 100) {
                               const __IMAGE = Math.min(99, Math.max(0, getMulValue(value, 1, 0, 0)));
                               const __LENGTH = getMulValue(width / 100, getMulValue(zoom / 100, value, 0, 0), 0, 0);
                               const __WIDTH = Math.min(width, __LENGTH);
                               const __HEIGHT = Math.max(3, getMulValue(zoom / 100, height * (__LENGTH / __WIDTH), 0, 0));

                               // HTML-Code fuer Anteilsbalken...
                               return '<IMG src="images/balken/' + __IMAGE + '.GIF" width="' + __WIDTH + '" height="' + __HEIGHT + '">';
                           },
        'addTitles'      : function(headers, titleColor = '#FFFFFF') {
                               // Spaltentitel zentrieren
                               headers.align = 'center';

                               // Titel fuer die aktuellen Werte
                               if (this.fpId) {
                                   this.addAndFillCell(headers, "Identifikation", titleColor);
                               }
                               if (this.bar) {
                                   this.addAndFillCell(headers, "Qualit\u00E4t", titleColor);
                               }
                               if (this.tal) {
                                   this.addAndFillCell(headers, "Talent", titleColor);
                               }
                               if (this.quo) {
                                   this.addAndFillCell(headers, "Quote", titleColor);
                               }
                               if (this.aufw) {
                                   this.addAndFillCell(headers, "Aufwertung", titleColor);
                               }
                               if (this.geb) {
                                   this.addAndFillCell(headers, "Geb.", titleColor);
                               }
                               if (this.alter && ! this.substAge) {
                                   this.addAndFillCell(headers, "Alter", titleColor);
                               }
                               if (this.fix) {
                                   this.addAndFillCell(headers, "fix", titleColor);
                               }
                               if (this.tr) {
                                   this.addAndFillCell(headers, "tr.", titleColor);
                               }
                               if (this.zat) {
                                   this.addAndFillCell(headers, "ZAT", titleColor);
                               }
                               if (this.antHpt) {
                                   this.addAndFillCell(headers, "%H", titleColor);
                               }
                               if (this.antNeb) {
                                   this.addAndFillCell(headers, "%N", titleColor);
                               }
                               if (this.pri) {
                                   this.addAndFillCell(headers, "Prios", titleColor);
                               }
                               if (this.skill) {
                                   this.addAndFillCell(headers, "Skill", titleColor);
                               }
                               if (this.pos) {
                                   this.addAndFillCell(headers, "Pos", titleColor);
                               }
                               for (let i = 1; i <= 6; i++) {
                                   if (i <= this.anzOpti) {
                                       this.addAndFillCell(headers, "Opti " + i, titleColor);
                                   }
                                   if (i <= this.anzMw) {
                                       this.addAndFillCell(headers, "MW " + i, titleColor);
                                   }
                               }

                               // Titel fuer die Werte mit Ende 18
                               if (this.trE) {
                                   this.addAndFillCell(headers, "tr." + this.kennzE, titleColor);
                               }
                               if (this.zatE) {
                                   this.addAndFillCell(headers, "ZAT" + this.kennzE, titleColor);
                               }
                               if (this.antHptE) {
                                   this.addAndFillCell(headers, "%H" + this.kennzE, titleColor);
                               }
                               if (this.antNebE) {
                                   this.addAndFillCell(headers, "%N" + this.kennzE, titleColor);
                               }
                               if (this.priE) {
                                   this.addAndFillCell(headers, "Prios" + this.kennzE, titleColor);
                               }
                               if (this.skillE) {
                                   this.addAndFillCell(headers, "Skill" + this.kennzE, titleColor);
                               }
                               for (let i = 1; i <= 6; i++) {
                                   if (i <= this.anzOptiE) {
                                       this.addAndFillCell(headers, "Opti " + i + this.kennzE, titleColor);
                                   }
                                   if (i <= this.anzMwE) {
                                       this.addAndFillCell(headers, "MW " + i + this.kennzE, titleColor);
                                   }
                               }
                           },  // Ende addTitles()
        'addValues'      : function(player, playerRow, color = '#FFFFFF') {
                               // Warnlevel des Spielers anpassen...
                               const __WARNDRAW = player.warnDraw || player.warnDrawAufstieg || __NOWARNDRAW;
                               __WARNDRAW.setWarn(this.warn, this.warnMonth, this.warnAufstieg);

                               const __IDXPRI = getIdxPriSkills(player.getPos());
                               const __COLOR = __WARNDRAW.getColor(player.isGoalie ? getColor('TOR') : color); // Angepasst an Ziehwarnung
                               const __POS1COLOR = getColor((player.getPosPercent() > 99.99) ? 'LEI' : player.getPos());

                               // Aktuelle Werte
                               if (this.fpId) {
                                   this.addAndFillCell(playerRow, player.getFingerPrint(), __COLOR);
                               }
                               if (this.bar) {
                                   const __VALUE = player.getPrios(player.getPos(), player.__TIME.end);
                                   const __SCALE = (this.barAbs ? 100 : (this.donor / 125));
                                   const __OFFSET = (this.barAbs ? 0 : Math.pow(__SCALE / 20, 2));
                                   const __ZOOM = 50 + __SCALE / 2;

                                   this.addAndBarCell(playerRow, __VALUE, __SCALE, __OFFSET, 100, 10, __ZOOM);
                               }
                               if (this.tal) {
                                   this.addAndFillCell(playerRow, player.getTalent(), __COLOR);
                               }
                               if (this.quo) {
                                   this.addAndFillCell(playerRow, player.getAufwertungsSchnitt(), __COLOR, null, 2);
                               }
                               if (this.colIdx.Auf) {
                                   convertStringFromHTML(playerRow.cells, this.colIdx.Auf, function(aufwert) {
                                                                                               return player.boldPriSkillNames(aufwert);
                                                                                           });
                               }
                               if (this.aufw) {
                                   this.addAndFillCell(playerRow, player.boldPriSkillNames(player.getAufwert()), __COLOR, 'left');
                               }
                               if (this.geb) {
                                   this.addAndFillCell(playerRow, player.getGeb(), __COLOR, null, 0);
                               }
                               if (this.substAge) {
                                   convertStringFromHTML(playerRow.cells, this.colIdx.Age, function(value) {
                                                                                               UNUSED(value);
                                                                                               return parseFloat(player.getAge()).toFixed(2);
                                                                                           });
                               } else if (this.alter) {
                                   this.addAndFillCell(playerRow, player.getAge(), __COLOR, null, 2);
                               }
                               if (__WARNDRAW.monthDraw()) {  // Abrechnungszeitraum vor dem letztmoeglichen Ziehen...
                                   formatCell(playerRow.cells[this.colIdx.Age], true, __WARNDRAW.colAlert, null, 1.0);
                               }
                               if (this.fix) {
                                   this.addAndFillCell(playerRow, player.getFixSkills(), __COLOR, null, 0);
                               }
                               if (this.tr) {
                                   this.addAndFillCell(playerRow, player.getTrainableSkills(), __COLOR, null, 0);
                               }
                               if (this.zat) {
                                   this.addAndFillCell(playerRow, player.getZatDone(), __COLOR, null, 0);
                               }
                               if (this.antHpt) {
                                   this.addAndFillCell(playerRow, player.getPriPercent(player.getPos()), __COLOR, null, 0);
                               }
                               if (this.antNeb) {
                                   this.addAndFillCell(playerRow, player.getSecPercent(player.getPos()), __COLOR, null, 0);
                               }
                               if (this.pri) {
                                   this.addAndFillCell(playerRow, player.getPrios(player.getPos()), __COLOR, null, 1);
                               }
                               if (this.skill) {
                                   this.addAndFillCell(playerRow, player.getSkill(), __COLOR, null, 2);
                               }
                               if (this.pos) {
                                   this.addAndFillCell(playerRow, player.getPos(), __POS1COLOR);
                               }
                               for (let i = 1; i <= 6; i++) {
                                   const __POSI = ((i === 1) ? player.getPos() : player.getPos(i));
                                   const __COLI = getColor(__POSI);

                                   if (i <= this.anzOpti) {
                                       if ((i === 1) || ! player.isGoalie) {
                                           // Opti anzeigen
                                           this.addAndFillCell(playerRow, player.getOpti(__POSI), __COLI, null, 2);
                                       } else {
                                           // TOR, aber nicht bester Opti -> nur Zelle hinzufuegen
                                           this.addCell(playerRow);
                                       }
                                   }
                                   if (i <= this.anzMw) {
                                       if ((i === 1) || ! player.isGoalie) {
                                           // MW anzeigen
                                           this.addAndFillCell(playerRow, player.getMarketValue(__POSI), __COLI, null, 0);
                                       } else {
                                           // TOR, aber nicht bester MW -> nur Zelle hinzufuegen
                                           this.addCell(playerRow);
                                       }
                                   }
                               }

                               // Einzelwerte mit Ende 18
                               if (this.colIdx.Einz) {
                                   if (this.substSkills) {
                                       convertArrayFromHTML(playerRow.cells, this.colIdx.Einz, player.skillsEnd, function(value, cell, arr, index) {
                                                                                                                     UNUSED(arr);
                                                                                                                     if (~ __IDXPRI.indexOf(index)) {
                                                                                                                         formatCell(cell, true, __OSBLAU, __POS1COLOR, 1.0);
                                                                                                                     }
                                                                                                                     return value;
                                                                                                                 });
                                   } else {
                                       convertArrayFromHTML(playerRow.cells, this.colIdx.Einz, player.skills.length, function(value, cell, arr, index) {
                                                                                                                         UNUSED(arr);
                                                                                                                         if (~ __IDXPRI.indexOf(index)) {
                                                                                                                             formatCell(cell, true, __POS1COLOR, null, 1.0);
                                                                                                                         }
                                                                                                                         return value;
                                                                                                                     });
                                   }
                               }
                               if (this.trE) {
                                   this.addAndFillCell(playerRow, player.getTrainableSkills(player.__TIME.end), __COLOR, null, 1);
                               }
                               if (this.zatE) {
                                   this.addAndFillCell(playerRow, player.getZatLeft(), __COLOR, null, 0);
                               }
                               if (this.antHptE) {
                                   this.addAndFillCell(playerRow, player.getPriPercent(player.getPos(), player.__TIME.end), __COLOR, null, 0);
                               }
                               if (this.antNebE) {
                                   this.addAndFillCell(playerRow, player.getSecPercent(player.getPos(), player.__TIME.end), __COLOR, null, 0);
                               }
                               if (this.priE) {
                                   this.addAndFillCell(playerRow, player.getPrios(player.getPos(), player.__TIME.end), __COLOR, null, 1);
                               }
                               if (this.skillE) {
                                   this.addAndFillCell(playerRow, player.getSkill(player.__TIME.end), __COLOR, null, 2);
                               }
                               for (let i = 1; i <= 6; i++) {
                                   const __POSI = ((i === 1) ? player.getPos() : player.getPos(i));
                                   const __COLI = getColor(__POSI);

                                   if (i <= this.anzOptiE) {
                                       if ((i === 1) || ! player.isGoalie) {
                                           // Opti anzeigen
                                           this.addAndFillCell(playerRow, player.getOpti(__POSI, player.__TIME.end), __COLI, null, 2);
                                       } else {
                                           // TOR, aber nicht bester Opti -> nur Zelle hinzufuegen
                                           this.addCell(playerRow);
                                       }
                                   }
                                   if (i <= this.anzMwE) {
                                       if ((i === 1) || ! player.isGoalie) {
                                           // MW anzeigen
                                           this.addAndFillCell(playerRow, player.getMarketValue(__POSI, player.__TIME.end), __COLI, null, 0);
                                       } else {
                                           // TOR, aber nicht bester MW -> nur Zelle hinzufuegen
                                           this.addCell(playerRow);
                                       }
                                   }
                               }
                           },  // Ende addValues(player, playerRow)
        'setGroupTitle'  : function(tableRow) {
                               if (this.gtUxx) {
                                   const __CELL = tableRow.cells[0];
                                   const __SAI = __CELL.innerHTML.match(/Saison (\d+)/)[1];
                                   const __JG = 13 + this.saison - __SAI;

                                   __CELL.innerHTML = __CELL.innerHTML.replace('Jahrgang', 'U' + __JG + ' - $&');
                               }

                               tableRow.style.display = (this.gt ? '' : 'none');
                           }  // Ende setGroupTitle(tableRow)
    });

// ==================== Ende Abschnitt fuer Klasse ColumnManager ====================

// *** EOF ***
