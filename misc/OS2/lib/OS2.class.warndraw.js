// ==UserScript==
// _name         OS2.class.warndraw
// _namespace    http://os.ongapo.com/
// _version      0.10
// _copyright    2021+
// _author       Sven Loges (SLC)
// _description  JS-lib mit OS2-spezifischen Klassen WarnDrawPlayer, WarnDrawMessage und WarnDrawMessageAufstieg
// _require      https://eselce.github.io/OS2.scripts/lib/OS2.class.warndraw.js
// ==/UserScript==

// ECMAScript 6:
/* jshint esnext: true */
/* jshint moz: true */

// ==================== Abschnitt fuer Klasse WarnDrawPlayer ====================

// Klasse fuer Ziehwarnung fuer einen Jugendspieler

class WarnDrawPlayer {
    constructor(player, alertColor) {
        'use strict';

        this.player = player;

        if (this.player !== undefined) {
            // Default Warnlevel...
            this.setZatLeft(player.getZatLeft());
            this.currZAT = player.currZAT;
            this.setWarn(true, true, true);
            this.colAlert = alertColor || this.alertColor();
        } else {
            // Kein Warnlevel...
            this.setZatLeft(undefined);
            this.currZAT = undefined;
            this.setWarn(false, false, false);
            this.colAlert = undefined;
        }
    }
}

Class.define(WarnDrawPlayer, Object, {
        '__MONATEBISABR'    : 1,
        '__ZATWARNVORLAUF'  : 1,
        '__ZATMONATVORLAUF' : 6,
        'setZatLeft'        : function(zatLeft) {
                                  this.zatLeft = zatLeft;
                              },
        'setWarn'           : function(warn, warnMonth, warnAufstieg) {
                                  this.warn = (this.aufstieg ? warnAufstieg : warn);
                                  this.warnMonth = warnMonth;
                              },
        'alertColor'        : function() {
                                  return getColor('STU');  // rot
                              },
        'getColor'          : function(color) {
                                  return ((this.mustDraw() && this.colAlert) ? this.colAlert : color);
                              },
        'calcZiehIndex'     : function(currZAT) {
                                  const __RESTZAT = this.zatLeft + currZAT;
                                  const __INDEX = parseInt(__RESTZAT / 6 + 1) - this.__MONATEBISABR;  // Lfd. Nummer des Abrechnungsmonats (0-basiert)

                                  return __INDEX;
                              },
        'isZiehAufstieg'    : function() {
                                  return this.aufstieg;
                              },
        'setAufstieg'       : function() {
                                  this.aufstieg = true;

                                  if (this.isZiehAufstieg()) {
                                      this.setZatLeft(72 - this.currZAT - this.__ZATWARNVORLAUF);
                                  }

                                  return this.zatLeft;
                              },
        'mustDraw'          : function() {
                                  return ((this.warn || this.warnMonth) && (this.zatLeft < this.__ZATWARNVORLAUF));
                              },
        'monthDraw'         : function() {
                                  return (this.mustDraw() || (this.warn && (this.aufstieg || this.warnMonth) && (this.zatLeft < this.__ZATMONATVORLAUF)));  // Abrechnungszeitraum vor dem letztmoeglichen Ziehen...
                              }
    });

const __NOWARNDRAW = new WarnDrawPlayer(undefined, undefined);  // inaktives Objekt

// ==================== Ende Abschnitt fuer Klasse WarnDrawPlayer ====================

// ==================== Abschnitt fuer Klasse WarnDrawMessage ====================

// Klasse fuer Warnmeldung fuer einen Jugendspieler

class WarnDrawMessage {
    constructor(optSet, currZAT) {
        'use strict';

        this.optSet = optSet;

        this.warn = getOptValue(this.optSet.zeigeWarnung, true);
        this.warnMonth = getOptValue(this.optSet.zeigeWarnungMonat, true);
        this.warnHome = getOptValue(this.optSet.zeigeWarnungHome, true);
        this.warnDialog = getOptValue(this.optSet.zeigeWarnungDialog, false);
        this.warnAufstieg = getOptValue(this.optSet.zeigeWarnungAufstieg, true);
        this.warnLegende = getOptValue(this.optSet.zeigeWarnungLegende, true);

        this.out = {
                       'supertag' : true,
                       'top'      : true,
                       'link'     : true,
                       'label'    : true,
                       'bottom'   : true
                   };

        this.setOptionHome();

        this.startMessage(currZAT);
    }
}

Class.define(WarnDrawMessage, Object, {
        '__ZATWARNVORLAUF'  : 1,
        '__ZATMONATVORLAUF' : 6,
        'startMessage'      : function(currZAT) {
                                  this.setZat(currZAT);
                                  this.createMessage();
                              },
        'setZat'            : function(currZAT) {
                                  this.currZAT = currZAT;

                                  if (currZAT === undefined) {
                                      this.abrZAT = undefined;
                                      this.rest   = undefined;
                                      this.anzahl = undefined;
                                  } else {
                                      this.configureZat();
                                  }
                              },
        'setOptionHome'     : function() {
                                  this.warnOption = this.hasHome();
                              },
        'setOptionLegende'  : function() {
                                  this.warnOption = this.hasLegende();
                              },
        'configureZat'      : function() {
                                  const __ZIEHANZAHL = getOptValue(this.optSet.ziehAnz, []);
                                  const __INDEX = parseInt(this.currZAT / 6);

                                  this.abrZAT = (__INDEX + 1) * 6;
                                  this.rest   = 5 - (this.currZAT % 6);
                                  this.anzahl = __ZIEHANZAHL[__INDEX];
                              },
        'getTextMessage'    : function() {
                                  return "ZAT " + this.abrZAT + ' ' + ((this.anzahl > 1) ? "m\xFCssen " + this.anzahl : "muss einer") +
                                         " deiner Jugendspieler in das Profiteam \xFCbernommen werden, ansonsten verschwinde" + ((this.anzahl > 1) ? "n sie" : "t er") + '!';
                              },
        'createMessage'     : function() {
                                  this.label = undefined;
                                  this.when = undefined;
                                  this.text = undefined;

                                  if (this.hasHome() || this.hasLegende() || this.hasDialog()) {
                                      if (this.anzahl > 0) {
                                          this.text = this.getTextMessage();

                                          if (this.warnMonth && (this.rest > 0)) {
                                              this.label = "Warnung";
                                              this.when = "Bis zur n\xE4chsten Abrechnung am ";
                                          } else if ((this.warn || this.warnMonth) && (this.rest === 0)) {
                                              this.label = "LETZTE WARNUNG VOR DER ABRECHNUNG";
                                              this.when = "Bis zum n\xE4chsten ";
                                          }
                                      }
                                  }
                              },
        'hasMessage'        : function() {
                                  return !! this.when;
                              },
        'hasHome'           : function() {
                                  return this.warnHome;
                              },
        'hasLegende'        : function() {
                                  return this.warnLegende;
                              },
        'hasOption'         : function() {
                                  return this.warnOption;
                              },
        'hasDialog'         : function() {
                                  return this.warnDialog;
                              },
        'showMessage'       : function(anchor, tag, appendFind = true) {  // appendFind: true = append, false = insertBefore, "..." search string = insert at find position
                                  let ret = (anchor || { }).innerHTML;

                                  if (this.hasMessage()) {
                                      if (this.hasOption()) {
                                          const __OLDHTML = ret;
                                          const __HTML = this.getHTML(tag);

                                          if ((typeof appendFind) === 'string') {
                                              const __INDEX = __OLDHTML.indexOf(appendFind);
                                              const __POS = (~ __INDEX) ? __INDEX : __OLDHTML.length;

                                              ret = __OLDHTML.substring(0, __POS) + __HTML + __OLDHTML.substring(__POS);
                                          } else if (appendFind) {
                                              ret = __OLDHTML + __HTML;
                                          } else {
                                              ret = __HTML + __OLDHTML;
                                          }

                                          anchor.innerHTML = ret;
                                      }
                                  }

                                  return ret;
                              },
        'showDialog'        : function(dlgFun) {
                                  if (this.hasMessage()) {
                                      if (this.hasDialog() && (this.rest === 0)) {
                                          dlgFun(this.label, this.when + this.text);
                                      }
                                  }
                              },
        'tagText'           : function(tag, text) {
                                  return ((tag !== undefined) ? this.getOpeningTag(tag) + text + this.getClosingTag(tag) : text);
                              },
        'tagParagraph'      : function(tag, text) {
                                  return this.tagText(tag, this.tagText(this.getSubTag(tag), text));
                              },
        'getSubTag'         : function(tag) {
                                  return ((tag === 'tr') ? 'td' + this.getColorTD() : ((tag === 'p') ? this.getColorTag() : undefined));
                              },
        'getSuperTag'       : function(tag) {
                                  return ((tag === 'p') ? 'div' : undefined);
                              },
        'getOpeningTag'     : function(tag) {
                                  return '<' + tag + '>';
                              },
        'getClosingTag'     : function(tag) {
                                  const __INDEX1 = (tag ? tag.indexOf(' ') : -1);
                                  const __INDEX2 = (tag ? tag.indexOf('=') : -1);
                                  const __INDEX = ((~ __INDEX1) && (~ __INDEX2)) ? Math.min(__INDEX1, __INDEX2) : Math.max(__INDEX1, __INDEX2);
                                  const __TAGNAME = ((~ __INDEX) ? tag.substring(0, __INDEX) : tag);

                                  return "</" + __TAGNAME + '>';
                              },
        'getLink'           : function() {
                                  return './ju.php';
                              },
        'getTopHTML'        : function(tag) {
                                  return this.tagParagraph(tag, "&nbsp;");
                              },
        'getBottomHTML'     : function(tag) {
                                  return this.tagParagraph(tag, "&nbsp;");
                              },
        'getColorTag'       : function() {
                                  return "color='red'";  // rot
                              },
        'getColorTD'        : function() {
                                  return " class='STU'";  // rot
                              },
        'getHTML'           : function(tag = 'p') {
                                  return this.tagParagraph((this.out.supertag ? this.getSuperTag(tag) : undefined), (this.out.top ? this.getTopHTML(tag) : "") +
                                         this.tagParagraph(tag, this.tagText('b', this.tagText((this.out.link ? "a href='" + this.getLink() + "'" : undefined),
                                         (this.out.label ? this.label + ": " : "") + this.when + this.text))) + (this.out.bottom ? this.getBottomHTML(tag) : ""));
                              }
    });

Object.defineProperty(WarnDrawMessage.prototype, 'innerHTML', {
        get : function() {
                  return this.getHTML('p');
              }
    });

// ==================== Ende Abschnitt fuer Klasse WarnDrawMessage ====================

// ==================== Abschnitt fuer Klasse WarnDrawMessageAufstieg ====================

// Klasse fuer Warnmeldung im Falle eines Aufstiegs fuer einen Jugendspieler

class WarnDrawMessageAufstieg extends WarnDrawMessage {
    constructor(optSet, currZAT) {
        'use strict';

        WarnDrawMessage.call(this, optSet, currZAT);

        this.out.top = false;  // kein Vorschub vor der Zeile

        this.warn = (this.warn && this.warnAufstieg);  // kann man ausschalten
        this.startMessage(currZAT);  // 2. Aufruf (zur Korrektur)
    }
}

Class.define(WarnDrawMessageAufstieg, WarnDrawMessage, {
        'configureZat'      : function() {
                                  const __ZIEHANZAUFSTIEG = getOptValue(this.optSet.ziehAnzAufstieg, 0);
                                  const __INDEX = parseInt(this.currZAT / 6);

                                  this.abrZAT = (__INDEX + 1) * 6;
                                  this.rest   = 5 - (this.currZAT % 6);
                                  this.anzahl = ((this.currZAT + this.__ZATMONATVORLAUF > 72 - this.__ZATWARNVORLAUF) ? __ZIEHANZAUFSTIEG : 0);

                                  this.warnDialog = false;     // kein Dialog fuer Aufstiegswarnung
                                  this.warnMonth = this.warn;  // nur im letzten Monat der Saison!
                              },
        'getTextMessage'    : function() {
                                  return "ZAT " + this.abrZAT + " ist im Falle eines Aufstiegs f\xFCr " + ((this.anzahl > 1) ? "" + this.anzahl : "einen") +
                                         " deiner Jugendspieler m\xF6glicherweise die letzte Chance, " + ((this.anzahl > 1) ? " diese noch vor ihrem" : "ihn noch vor seinem") +
                                         " Geburtstag in der n\xE4chsten Saison in das Profiteam zu \xFCbernehmen!";
                              },
        'getColorTag'       : function() {
                                  return "color='magenta'";  // magenta
                              },
        'getColorTD'        : function() {
                                  return " class='OMI'";  // magenta
                              }
    });

// ==================== Ende Abschnitt fuer Klasse WarnDrawMessageAufstieg ====================

// *** EOF ***
