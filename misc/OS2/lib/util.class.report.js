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
