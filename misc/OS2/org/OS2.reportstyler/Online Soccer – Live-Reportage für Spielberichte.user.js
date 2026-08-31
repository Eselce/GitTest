// ==UserScript==
// @name         Online Soccer – Live-Reportage für Spielberichte
// @namespace    online-soccer.eu.reportstyler
// @version      1.3
// @description  Verwandelt Spielberichte auf online-soccer.eu in eine moderierte Live-Übertragung: Einleitung mit Taktik & Schlüsselspielern, Ticker mit Tempo-Regelung, vier Analyse-Kommentare (nach 15 Min, Halbzeit, 15 Min vor Schluss, Schluss), abwechslungsreiche Kommentare für Tore, Freistöße, Elfmeter, Ecken und Abseits mit Spannungspausen, Stadion-Atmosphäre, Fangesänge und Momentum-Anzeige. Läuft komplett lokal im Browser.
// @author       Daniel Gent
// @license      MIT
// @homepageURL  https://greasyfork.org/
// @match        https://online-soccer.eu/rep/*
// @match        https://www.online-soccer.eu/rep/*
// @match        https://os.ongapo.com/rep/*
// @match        https://www.os.ongapo.com/rep/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      online-soccer.eu
// @connect      os.ongapo.com
// @connect      self
// @downloadURL https://update.greasyfork.org/scripts/593088/Online%20Soccer%20%E2%80%93%20Live-Reportage%20f%C3%BCr%20Spielberichte.user.js
// @updateURL https://update.greasyfork.org/scripts/593088/Online%20Soccer%20%E2%80%93%20Live-Reportage%20f%C3%BCr%20Spielberichte.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (window.__osReportPub) return;
  window.__osReportPub = true;

  // Bericht-Popup automatisch höher ziehen, damit Spielfeld/Aufstellung hineinpassen
  try {
    if (window.opener && !window.__osResized) {
      window.__osResized = true;
      const availH = (window.screen && screen.availHeight) ? screen.availHeight : 900;
      const availW = (window.screen && screen.availWidth) ? screen.availWidth : 1000;
      const targetH = Math.min(availH - 40, 1050);
      const targetW = Math.min(Math.max(window.outerWidth || 0, 1000), availW - 40);
      if ((window.outerHeight || 0) < targetH - 30) {
        try { window.moveTo(Math.max(window.screenX || 20, 10), 8); } catch (e) {}
        window.resizeTo(targetW, targetH);
      }
    }
  } catch (e) { /* Resize kann vom Browser blockiert sein – dann bleibt es beim manuellen Ziehen */ }

  // =========================================================================
  // TEIL 1 – TEXTBAUSTEINE
  // =========================================================================
  function L(t) { return new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'); }
  const pick = a => a[Math.floor(Math.random() * a.length)];

  const RULES = [
    { re: L('Anpfiff'),  to: ['Anpfiff – es geht los!', 'Anpfiff – der Schiedsrichter gibt das Spiel frei!', 'Anpfiff – auf geht’s!', 'Der Ball rollt – Anpfiff!'] },
    { re: L('Halbzeit'), to: ['Halbzeit – kurz durchatmen.', 'Halbzeit – die Teams gehen in die Kabine.', 'Halbzeitpfiff – Zeit für die Kabinenansprache.', 'Halbzeit – die erste Hälfte ist vorbei.'] },
    { re: L('Abpfiff'),  to: ['Abpfiff – das Spiel ist vorbei!', 'Abpfiff – Schlusspfiff, Ende der Partie!', 'Abpfiff – aus, das Spiel ist aus!', 'Abpfiff – Feierabend!'] },
    { re: /, TOR(?![\wÄÖÜäöüß])/g, to: [', TOOOR! ⚽', ', und die Kugel schlägt ein – TOOOR! ⚽', ', der Ball zappelt im Netz – TOOOR! ⚽', ', drin ist er – TOOOR! ⚽'] },
    { re: L('ist machtlos'), to: ['ist völlig chancenlos', 'hat nicht den Hauch einer Abwehrchance', 'ist ohne jede Rettung geschlagen', 'kommt einen Schritt zu spät', 'greift ins Leere'] },
    { re: L('Neuer Spielstand:'), to: ['🔥 Neuer Spielstand:', '⚽ Neuer Spielstand:', '📢 Neuer Spielstand:', '🎉 Neuer Spielstand:'] },
    { re: L('schiesst mit einem Aufsetzer aufs lange Eck'), to: ['setzt einen tückischen Aufsetzer ins lange Eck', 'zieht einen Aufsetzer aufs lange Eck', 'drischt einen Aufsetzer ins lange Eck', 'jagt die Kugel als Aufsetzer ins lange Eck'] },
    { re: L('schiesst mit einem Aufsetzer aufs kurze Eck'), to: ['drückt einen Aufsetzer aufs kurze Eck', 'jagt einen Aufsetzer aufs kurze Eck', 'zieht einen Aufsetzer ins kurze Eck', 'setzt die Kugel als Aufsetzer aufs kurze Eck'] },
    { re: L('köpft mit einem Aufsetzer aufs kurze Eck'),    to: ['wuchtet den Kopfball aufs kurze Eck', 'nickt den Ball scharf aufs kurze Eck', 'köpft die Kugel als Aufsetzer ins kurze Eck', 'drückt den Kopfball aufs kurze Eck'] },
    { re: L('schiesst mit viel Effet Richtung Kreuzecke'),  to: ['zirkelt den Ball mit viel Effet Richtung Kreuzeck', 'schlenzt die Kugel gefühlvoll Richtung Kreuzeck', 'zieht den Ball mit viel Effet Richtung Winkel', 'jagt einen gedrehten Ball Richtung Kreuzeck'] },
    { re: L('schiesst den Ball in die rechte Ecke'), to: ['zieht ab ins rechte Eck', 'feuert die Kugel ins rechte Eck', 'nimmt das rechte Eck ins Visier', 'zimmert den Ball ins rechte Eck'] },
    { re: L('schiesst den Ball in die linke Ecke'),  to: ['zieht ab ins linke Eck', 'feuert die Kugel ins linke Eck', 'nimmt das linke Eck ins Visier', 'zimmert den Ball ins linke Eck'] },
    { re: L('legt sich den Ball auf den richtigen Fuss und zieht ab'), to: ['legt sich das Leder zurecht und feuert', 'nimmt sich ein Herz und zieht ab', 'macht sich den Ball zurecht und schießt', 'legt sich die Kugel auf den starken Fuß und zieht durch'] },
    { re: L('schiesst aufs Tor'), to: ['nimmt Maß und zieht ab', 'sucht den Abschluss', 'lässt es aus der Distanz krachen', 'zieht einfach mal ab'] },
    { re: L('Strammer Linksschuß von'),  to: ['Wuchtiger Linksschuss von', 'Ein Hammer mit links von', 'Ein satter Linksschuss von', 'Ein strammer Linksschuss von'] },
    { re: L('Strammer Rechtsschuß von'), to: ['Wuchtiger Rechtsschuss von', 'Ein Hammer mit rechts von', 'Ein satter Rechtsschuss von', 'Ein strammer Rechtsschuss von'] },
    { re: L('Harter Schuss von'), to: ['Ein satter Schuss von', 'Wuchtig abgezogen von', 'Ein harter Schuss von', 'Ein wuchtiger Abschluss von'] },
    { re: L('Ein Schlenzer von'),  to: ['Ein feiner Schlenzer von', 'Ein gefühlvoller Schlenzer von', 'Ein sehenswerter Schlenzer von', 'Ein technisch feiner Schlenzer von'] },
    { re: L('Ein Flatterball von'), to: ['Ein tückischer Flatterball von', 'Ein gefährlich flatternder Ball von', 'Ein tückisch flatternder Schuss von', 'Ein wild flatternder Ball von'] },
    { re: L('Ein Schuss von'), to: ['Ein Abschluss von', 'Ein Versuch von', 'Ein Distanzversuch von', 'Ein Schuss von'] },
    { re: L('Der Ball geht knapp über das Tor'), to: ['streicht haarscharf über die Latte!', 'geht nur um Zentimeter drüber!', 'zischt knapp über den Querbalken!', 'segelt hauchdünn über das Tor!'] },
    { re: L('Der Ball geht knapp am Tor vorbei'), to: ['zischt haarscharf am Pfosten vorbei!', 'geht nur um Millimeter daneben!', 'streicht knapp am Kasten vorbei!', 'rauscht hauchdünn am Tor vorbei!'] },
    { re: L('Der Ball geht hoch über das Tor'),   to: ['segelt weit über den Kasten!', 'geht deutlich zu hoch!', 'fliegt hoch über die Latte!', 'rauscht weit über das Tor!'] },
    { re: L('Der Ball geht weit am Tor vorbei'),  to: ['geht deutlich am Tor vorbei.', 'zischt klar am Kasten vorbei.', 'verfehlt das Tor deutlich.', 'geht weit daneben.'] },
    { re: L('Der Ball geht über das Tor'),  to: ['geht drüber.', 'streicht über den Kasten.', 'segelt über das Tor.', 'geht knapp zu hoch.'] },
    { re: L('Der Ball geht neben das Tor'), to: ['geht knapp daneben.', 'streicht am Pfosten vorbei.', 'verfehlt den Kasten.', 'geht am Tor vorbei.'] },
    { re: L('Der Ball geht am Tor vorbei'), to: ['rauscht am Tor vorbei.', 'zischt am Kasten vorbei.', 'geht neben das Gehäuse.', 'verfehlt das Ziel.'] },
    { re: L('kann den Ball nicht richtig festhalten'), to: ['patzt gewaltig', 'lässt den Ball nach vorne abklatschen', 'bekommt den Ball nicht sauber zu fassen', 'lässt die Kugel durchrutschen', 'kann den Ball nicht festhalten'] },
    { re: L('Der Keeper hat den Ball sicher'), to: ['Der Keeper pflückt sich die Kugel sicher herunter.', 'Der Keeper fängt den Ball sicher.', 'Der Torwart hat den Ball sicher.', 'Der Keeper nimmt den Ball problemlos auf.'] },
    { re: L('Der Ball landet beim Keeper'),    to: ['Der Ball landet sicher in den Armen des Keepers.', 'Der Ball rollt dem Keeper in die Arme.', 'Der Keeper muss sich nur bücken.', 'Der Ball findet den Weg zum Torwart.'] },
    { re: L('kann den Ball locker festhalten'), to: ['hält den Ball ganz locker fest.', 'nimmt den Ball entspannt auf.', 'fängt den Ball mühelos.', 'pflückt den Ball sicher aus der Luft.'] },
    { re: L('dreht den Ball zur Ecke'), to: ['lenkt den Ball mit einer Glanzparade zur Ecke!', 'kratzt den Ball noch zur Ecke!', 'fischt den Ball stark zur Ecke!', 'lenkt den Ball reaktionsschnell zur Ecke!'] },
    { re: L('lenkt den Ball zur Ecke ab'), to: ['fischt den Ball gerade noch zur Ecke.', 'lenkt den Ball mit den Fingerspitzen zur Ecke.', 'kratzt den Ball zur Ecke.', 'wehrt den Ball zur Ecke ab.'] },
    { re: L('hat den Ball sicher'), to: ['ist sofort zur Stelle', 'nimmt den Ball sicher auf', 'hält den Ball fest', 'fängt den Ball sicher'] },
    { re: L('wie einen Schuljungen stehen'), to: ['ganz alt aussehen!', 'stehen, als wäre er angewurzelt!', 'wie einen Anfänger aussehen!', 'ins Leere laufen!'] },
    { re: L('nicht mit einem Übersteiger versetzen'), to: ['mit dem Übersteiger nicht überwinden – der bleibt eiskalt', 'mit dem Übersteiger nicht austricksen', 'trotz Übersteiger nicht stehen lassen', 'mit dem Übersteiger nicht knacken'] },
    { re: L('mit einem gelungenen Dribbling überspielen'), to: ['mit einem starken Dribbling stehen lassen', 'mit einem feinen Dribbling überspielen', 'mit einem sehenswerten Dribbling austanzen', 'per Dribbling ins Leere schicken'] },
    { re: L('mit einem Übersteiger'), to: ['mit einem sehenswerten Übersteiger', 'mit einem starken Übersteiger', 'mit einer schnellen Übersteiger-Finte', 'mit einem feinen Übersteiger'] },
    { re: L('verstolpert den Ball bei einem versuchten Dribbling'), to: ['vertändelt den Ball im Dribbling – ärgerlich.', 'verstolpert den Ball beim Dribbling.', 'verliert den Ball im eigenen Dribbling.', 'vertüddelt die Kugel beim Dribbelversuch.'] },
    { re: L('erkämpft sich den Ball - Torchance vereitelt'), to: ['grätscht dazwischen und klärt die Situation!', 'fängt den Ball ab und erstickt die Chance im Keim!', 'holt sich den Ball und vereitelt die Chance!', 'geht dazwischen – Torchance dahin!'] },
    { re: L('verlädt'), to: ['verlädt eiskalt', 'verlädt gekonnt', 'düpiert', 'narrt'] },
    { re: L('mit einer gelungenen Körpertäuschung'), to: ['mit einer herrlichen Körpertäuschung', 'mit einer sehenswerten Körpertäuschung', 'mit einer feinen Körpertäuschung', 'mit einer klasse Körpertäuschung'] },
    { re: L('versucht vergeblich eine Körpertäuschung bei'), to: ['scheitert mit einer Körpertäuschung an', 'kommt mit einer Körpertäuschung nicht vorbei an', 'beißt sich mit einer Körpertäuschung fest an', 'versucht es vergeblich mit einer Körpertäuschung gegen'] },
    { re: L('gefällt – FREISTOSS'), to: ['von den Beinen geholt – FREISTOSS!', 'zu Fall gebracht – FREISTOSS!', 'gelegt – Pfiff, FREISTOSS!', 'umgegrätscht – FREISTOSS!'] },
    { re: L('ein Bein - FREISTOSS'), to: ['ein Bein – Pfiff, FREISTOSS!', 'ein Bein – der Schiri zeigt auf FREISTOSS!', 'das Bein – FREISTOSS!', 'ein Bein und bringt ihn zu Fall – FREISTOSS!'] },
    { re: L('kassiert dafür die gelbe Karte'), to: ['sieht dafür verdient Gelb.', 'wandert dafür ins Notizbuch – Gelb.', 'kassiert dafür die Gelbe Karte.', 'sieht dafür den gelben Karton.'] },
    { re: L('Der Linienrichter hebt die Fahne - ABSEITS!'), to: ['ABSEITS! Der Angreifer startet einen Tick zu früh – die Fahne geht hoch.', 'Die Fahne oben – ABSEITS! Der Stürmer stand hauchdünn zu weit vorn.', 'ABSEITS! Und das war klar – der Angreifer war deutlich zu früh dran.', 'Der Angreifer kommt einen Schritt zu spät aus dem Abseits heraus – ABSEITS!', 'Der Linienrichter zögert kurz, hebt dann doch die Fahne. ABSEITS – zum Unmut der Ränge.', 'Der Assistent ist auf der Höhe und hebt zu Recht die Fahne. ABSEITS!', 'Der Linienrichter fuchtelt mit der Fahne – ABSEITS, zum Ärger des Angreifers und der Bank.', 'Das hätte eine dicke Chance werden können – doch die Fahne geht hoch. ABSEITS!', 'Schade, diese vielversprechende Aktion wird abgepfiffen. ABSEITS!', 'Hauchdünn nur, aber die Fahne ist oben – ABSEITS!', 'ABSEITS! Der Angreifer war der Abwehr um eine Nasenlänge voraus.', 'Der Linienrichter hebt sofort die Fahne – ABSEITS, da gibt es keine Diskussion.', 'Eine ganz knappe Entscheidung – der Assistent entscheidet auf ABSEITS.', 'Der Stürmer löst sich zu früh – ABSEITS! Die Aktion wäre brandgefährlich geworden.', 'ABSEITS! Um Zentimeter zu spät aus der letzten Linie gelöst.', 'Die Fahne geht hoch, der Angreifer reklamiert – vergeblich. ABSEITS!', 'Grenzwertig, aber der Linienrichter bleibt bei ABSEITS.', 'Der Angreifer stand mit der Schulter im Abseits – ABSEITS, ganz eng.', 'ABSEITS! Da war der Stürmer einen Wimpernschlag zu früh unterwegs.', 'Der Linienrichter braucht einen Moment, dann hebt er die Fahne – ABSEITS!', 'So verpufft eine gute Gelegenheit – ABSEITS gegen den Angreifer.', 'Klare Sache für den Assistenten: ABSEITS!', 'Der Angreifer schaut ungläubig zur Fahne – ABSEITS, die Aktion ist tot.', 'ABSEITS! Ein Tick zu ungeduldig im Laufweg.', 'Der Assistent hebt die Fahne, der Angreifer hebt die Arme – ABSEITS!', 'Zu früh gestartet, das Timing stimmte nicht – ABSEITS!'] },
    { re: L('versucht einen Beinschuss, aber'), to: ['probiert es mit einem frechen Tunnel, doch', 'will den Ball durch die Beine spielen, aber', 'versucht einen Tunnel, doch', 'probiert den Beinschuss, aber'] },
    { re: L('verpasst'), to: ['verpasst knapp', 'verpasst frech', 'verpasst um Haaresbreite', 'verpasst'] },
    { re: L('hat aufgepasst.'), to: ['ist hellwach!', 'lässt sich nicht überlisten.', 'passt gut auf.', 'ist auf dem Posten.'] },
    { re: L('nicht vorbei'), to: ['einfach nicht durch', 'partout nicht vorbei', 'nicht durchkommen', 'nicht passieren'] },
    { re: L('nicht umspielen'), to: ['nicht überwinden', 'nicht umkurven', 'nicht austricksen', 'nicht umspielen'] },
    { re: L('nicht überspielen'), to: ['nicht überlisten', 'nicht überwinden', 'nicht ausspielen', 'nicht überspielen'] },
    { re: L('versucht vergeblich den Ball über'), to: ['versucht vergeblich, den Ball über', 'scheitert mit dem Versuch, den Ball über', 'probiert vergeblich, den Ball über', 'müht sich vergeblich, den Ball über'] },
    { re: L('zu heben'), to: ['zu heben', 'zu lupfen', 'zu chippen'] },
    { re: L('flankt in den Strafraum'), to: ['schlägt eine gefährliche Flanke in den Strafraum!', 'bringt eine scharfe Flanke in den Strafraum!', 'zirkelt eine Flanke in den Sechzehner!', 'flankt gefährlich in die Mitte!'] },
    { re: L('zieht den Ball auf den ersten Pfosten'),  to: ['bringt den Ball scharf an den ersten Pfosten', 'zieht die Kugel an den ersten Pfosten', 'flankt auf den ersten Pfosten', 'bringt den Ball an den kurzen Pfosten'] },
    { re: L('zieht den Ball auf den zweiten Pfosten'), to: ['bringt den Ball scharf an den zweiten Pfosten', 'zieht die Kugel an den zweiten Pfosten', 'flankt auf den zweiten Pfosten', 'bringt den Ball an den langen Pfosten'] },
    { re: L('zieht den Ball vor das Tor'), to: ['zieht den Ball gefährlich vor den Kasten', 'bringt den Ball vor das Tor', 'zieht die Kugel scharf vor den Kasten', 'flankt vor das Tor'] },
    { re: L('Ein Gegner kann erfolgreich stören'), to: ['ein Gegner grätscht dazwischen!', 'doch die Abwehr klärt.', 'ein Verteidiger fängt das ab!', 'aber ein Gegenspieler stört entscheidend!'] },
    { re: L('bekommt den Ball nicht unter Kontrolle'), to: ['verliert den Ball in der Annahme.', 'kann den Ball nicht bändigen.', 'bringt den Ball nicht unter Kontrolle.', 'lässt den Ball abspringen.'] },
    { re: L('Verunglückt völlig und landet beim Gegner'), to: ['Das misslingt völlig – der Gegner schnappt sich die Kugel.', 'Das geht daneben – der Gegner ist zur Stelle.', 'Völlig verunglückt – der Gegner übernimmt.', 'Das misslingt – der Ball landet beim Gegner.'] },
    { re: L('Der Ball geht an Freund und Feind vorbei ins Aus'), to: ['der Ball rauscht an allen vorbei ins Aus.', 'der Ball segelt an Freund und Feind vorbei ins Aus.', 'niemand kommt ran – der Ball geht ins Aus.', 'der Ball verschwindet an allen vorbei im Aus.'] },
    { re: L('landet hinter dem Tor'), to: ['landet im Toraus.', 'rollt ins Toraus.', 'geht über die Grundlinie ins Aus.', 'landet hinter der Grundlinie im Aus.'] },
    { re: L('spielt mit einem langen Pass zu'), to: ['schlägt einen weiten Ball auf', 'feuert einen langen Pass auf', 'eröffnet weiträumig auf', 'schlägt das Leder lang auf', 'chippt den Ball weit auf', 'schlägt einen Diagonalball auf', 'verlagert weiträumig auf', 'spielt einen Flugball auf', 'wechselt geschickt die Seite auf', 'schickt einen präzisen langen Ball auf', 'schlägt den Ball hoch nach vorne auf', 'bedient mit einem langen Ball'] },
    { re: L('spielt einen langen Ball zu'), to: ['schlägt einen weiten Ball auf', 'schickt einen langen Ball auf', 'verlagert weit auf', 'spielt einen langen Ball auf'] },
    { re: L('spielt den Ball lang zu'), to: ['schlägt den Ball weit auf', 'eröffnet weiträumig auf', 'schickt einen langen Pass auf', 'spielt den Ball lang auf', 'chippt den Ball weit auf', 'schlägt einen Diagonalball auf', 'verlagert das Spiel weiträumig auf', 'spielt einen Flugball auf', 'wechselt die Seite auf', 'schlägt das Leder lang auf'] },
    { re: L('per langem Pass zu'), to: ['mit einem weiten Ball auf', 'per Steilpass auf', 'mit einem langen Schlag auf', 'per langem Ball auf', 'mit einem Diagonalball auf', 'per Flugball auf', 'mit einem präzisen langen Ball auf', 'per Seitenwechsel auf'] },
    { re: L('mit langem Pass zu'), to: ['mit einem weiten Ball auf', 'per Steilpass auf', 'mit einem langen Schlag auf', 'per langem Ball auf', 'mit einem Diagonalball auf', 'per Flugball auf', 'mit einem präzisen langen Ball auf', 'per Seitenwechsel auf'] },
    { re: L('passt lang zu'), to: ['schlägt den Ball weit auf', 'schickt einen langen Pass auf', 'spielt einen langen Ball auf', 'passt lang auf', 'chippt den Ball weit auf', 'schlägt einen Diagonalball auf', 'verlagert weiträumig auf', 'schlägt das Leder lang auf'] },
    { re: L('spielt mit einem kurzen Pass zu'), to: ['kombiniert flach mit', 'legt kurz ab auf', 'spielt einen sauberen Kurzpass auf', 'schiebt den Ball flach zu', 'spielt ein kurzes Zuspiel auf', 'lässt den Ball klatschen zu', 'bedient flach', 'spielt sicher flach zu', 'tastet sich flach vor zu', 'kombiniert kurz mit'] },
    { re: L('spielt einen kurzen Ball zu'), to: ['schiebt den Ball flach zu', 'kombiniert flach mit', 'spielt einen kurzen Pass auf', 'legt kurz ab auf', 'spielt ein kurzes Zuspiel auf', 'lässt klatschen zu', 'bedient flach', 'spielt sicher flach zu'] },
    { re: L('spielt den Ball kurz zu'), to: ['schiebt den Ball flach zu', 'legt kurz ab auf', 'kombiniert mit', 'spielt einen kurzen Pass auf', 'spielt ein kurzes Zuspiel auf', 'lässt den Ball klatschen zu', 'bedient flach', 'spielt sicher flach zu', 'tippt den Ball kurz zu'] },
    { re: L('per Kurzpass zu'), to: ['mit einem scharfen Kurzpass auf', 'flach kombiniert mit', 'mit einem kurzen Zuspiel auf', 'mit einem kurzen Pass auf', 'mit einem sauberen Kurzpass auf', 'per Doppelpass mit', 'mit einem flachen Ball auf', 'per kurzem Zuspiel auf'] },
    { re: L('mit Kurzpass zu'), to: ['mit einem scharfen Kurzpass auf', 'flach kombiniert mit', 'mit einem kurzen Zuspiel auf', 'mit einem kurzen Pass auf', 'mit einem sauberen Kurzpass auf', 'per Doppelpass mit', 'mit einem flachen Ball auf', 'per kurzem Zuspiel auf'] },
    { re: L('passt den Ball direkt auf'), to: ['spielt direkt weiter auf', 'lässt den Ball direkt abtropfen auf', 'bedient direkt', 'legt direkt ab auf', 'lässt den Ball prallen auf', 'verlängert direkt auf', 'leitet direkt weiter auf', 'spielt ohne Ballannahme auf'] },
    { re: L('spielt den Ball zu'), to: ['verlagert das Spiel auf', 'reicht den Ball weiter auf', 'spielt weiter auf', 'schiebt den Ball zu', 'spielt quer auf', 'bringt den Ball zu', 'passt weiter auf', 'lässt den Ball laufen zu'] },
    { re: /[ \t]*\bweiter\b/g, to: [''] }
  ];

  function transform(text) {
    const store = []; let out = text;
    for (const rule of RULES) out = out.replace(rule.re, () => { const tk = '\uE000' + store.length + '\uE001'; store.push(pick(rule.to)); return tk; });
    return out.replace(/\uE000(\d+)\uE001/g, (_, i) => store[+i]);
  }
  let osOriginalHTML = '';
  (function () {
    osOriginalHTML = document.body.innerHTML;
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const t = n.parentNode && n.parentNode.nodeName;
        if (t === 'SCRIPT' || t === 'STYLE' || t === 'TEXTAREA' || t === 'INPUT' || t === 'OPTION') return NodeFilter.FILTER_REJECT;
        return n.nodeValue && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const ns = []; let n; while ((n = w.nextNode())) ns.push(n);
    ns.forEach(node => { const a = transform(node.nodeValue); if (a !== node.nodeValue) node.nodeValue = a; });
  })();

  // =========================================================================
  // TEIL 2 – MODERIERTE ÜBERTRAGUNG
  // =========================================================================
  const style = document.createElement('style');
  style.textContent = `
    .os-title{margin:14px 0;padding:12px 16px;border-radius:10px;
      background:linear-gradient(135deg,#0b6e2e,#0a8a3a);color:#fff;
      font-family:system-ui,Arial,sans-serif}
    .os-title b{font-size:18px}
    .os-title .m{font-size:12px;opacity:.9;margin-top:3px}
    .os-logo{height:20px;width:auto;vertical-align:middle;margin:0 5px;position:relative;top:-1px}
    .os-title .os-logo{height:26px}
    .os-title{position:relative}
    .os-league-logo{position:absolute;top:8px;right:14px;height:58px;width:auto;filter:drop-shadow(0 1px 3px rgba(0,0,0,.4))}
    .os-act h3 .os-logo{height:22px;margin:0 6px 0 0}
    .os-mod .os-logo{height:18px}
    .os-sticky{position:sticky;top:0;z-index:50;margin:12px 0}
    .os-ticker{display:flex;align-items:center;gap:10px;
      flex-wrap:wrap;padding:8px 12px;border-radius:10px 10px 0 0;background:#152a63;color:#fff;
      border:1px solid #3f61ad;font-family:system-ui,Arial,sans-serif}
    .os-ticker button{cursor:pointer;border:none;border-radius:6px;padding:6px 12px;font-weight:700;font-size:13px;background:#fff;color:#111}
    .os-ticker button:hover{background:#e8e8e8}
    .os-ticker .os-play{background:#ffe08a;color:#3a2f00;min-width:104px}
    .os-ticker .os-speed{display:flex;gap:4px;align-items:center}
    .os-ticker .os-speed span{font-size:12px;color:#ccc}
    .os-ticker .os-speed button{padding:6px 8px;background:#2a2a2a;color:#fff;border:1px solid #444}
    .os-ticker .os-speed button.active{background:#0a8a3a;border-color:#0a8a3a}
    .os-ticker .os-phase{margin-left:auto;font-size:12px;color:#ffe08a;font-weight:700}
    .os-ticker .os-conf-toggle{display:inline-flex;align-items:center;gap:5px;font-size:13px;color:#cfe0ff;cursor:pointer;user-select:none}
    .os-ticker .os-conf-toggle input{cursor:pointer}
    .os-ticker .os-conf-status{font-size:11px;color:#9fb4e0}
    .os-confrow td{background:rgba(75,208,126,.12) !important;color:#d8ffe6 !important;border-top:1px dashed rgba(75,208,126,.4);font-size:13px;padding:5px 8px}
    .os-atmorow td{background:transparent !important;border:none !important;padding:3px 10px 6px !important}
    .os-atmobox{border-left:4px solid #8fa0bf;background:rgba(255,255,255,.05);padding:7px 12px;border-radius:5px;font-size:13px;line-height:1.5;color:#e2e9f3}
    .os-atmobox .os-chant{font-weight:700;color:var(--ac,#e2e9f3)}
    .os-atmobox.os-atmo-loud{border-left-width:6px;background:rgba(255,255,255,.085)}
    body.os-atmo-off .os-atmorow{display:none !important}
    .os-conf-l1{font-weight:700}
    .os-bkh{color:#9bd451;font-weight:700}
    .os-bka{color:#7f9cff;font-weight:700}
    .os-conf-l2{color:#d8ffe6}
    @keyframes osConfReveal{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}
    .os-conf-head{font-weight:700;margin-bottom:4px}
    .os-conftab{border-collapse:collapse;margin:2px 0 2px 10px;font-size:13px}
    .os-conftab td{padding:2px 8px;color:#d8ffe6}
    .os-conftab td.os-dash{color:#8fd6a8;padding:2px 4px}
    .os-conftab td.os-res{font-variant-numeric:tabular-nums;color:#ffffff}
    .os-conftab td.os-win{font-weight:800;color:#ffffff}
    body.os-conf-off .os-confrow{display:none !important}
    .os-confsum{margin-top:8px;padding:6px 10px;border-left:3px solid #4bd07e;background:rgba(75,208,126,.10);border-radius:5px;color:#d8ffe6;font-style:normal}
    .os-confsum .os-cm{display:flex;align-items:center;gap:8px;padding:4px 0;max-width:520px;margin:0 auto}
    .os-confsum .os-cm-h{flex:1;text-align:right}
    .os-confsum .os-cm-a{flex:1;text-align:left}
    .os-confsum .os-cm .os-logo{width:22px;height:22px;object-fit:contain;flex:0 0 auto}
    .os-confsum .os-cm-score{background:#101010;color:#fff;font-weight:800;padding:2px 9px;border-radius:4px;min-width:46px;text-align:center;font-variant-numeric:tabular-nums;flex:0 0 auto}
    .os-confsum .os-win{font-weight:800;color:#ffffff}
    body.os-conf-off .os-confsum{display:none}
    .os-shot td:last-child::after{content:' …';color:#ffe08a;font-weight:800;letter-spacing:2px}
    .os-ticker .os-seekwrap{flex-basis:100%;display:flex;align-items:center;gap:8px;margin-top:2px}
    .os-ticker .os-seek{flex:1;accent-color:#ffe08a;cursor:pointer}
    .os-board{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;
      padding:7px 12px;background:#0a1533;border:1px solid #3f61ad;border-top:none;
      border-radius:0 0 10px 10px;color:#fff;font-family:system-ui,Arial,sans-serif;
      box-shadow:0 2px 10px rgba(0,0,0,.5)}
    .os-board{display:flex;flex-direction:column;align-items:stretch;gap:3px;justify-content:flex-start;
      padding:7px 12px;background:#0a1533;border:1px solid #3f61ad;border-top:none;
      border-radius:0 0 10px 10px;color:#fff;font-family:system-ui,Arial,sans-serif;
      box-shadow:0 2px 10px rgba(0,0,0,.5)}
    .os-board>*{flex:0 0 auto}
    .os-board-main{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap}
    .os-board .team{display:flex;align-items:center;justify-content:center}
    .os-board .os-logo{width:75px;height:75px;object-fit:contain;margin:0}
    .os-board .scorebox{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
    .os-board .score{font-size:36px;font-weight:800;letter-spacing:1px;background:#000;color:#ffe08a;
      height:75px;display:flex;align-items:center;justify-content:center;box-sizing:border-box;
      padding:0 20px;border-radius:8px;min-width:104px;text-align:center;font-variant-numeric:tabular-nums}
    .os-board .min{font-size:13px;color:#9fb4e0;text-align:center}
    .os-board-goals{display:flex;align-items:flex-start;align-content:flex-start;gap:12px;min-height:0}
    .os-board-goals .os-goals-home,.os-board-goals .os-goals-away{flex:1;display:flex;flex-direction:column;gap:1px;min-height:0;align-self:flex-start}
    .os-goals-home{text-align:right;align-items:flex-end}
    .os-goals-away{text-align:left;align-items:flex-start}
    .os-goals-spacer{flex:0 0 auto;width:64px;text-align:center}
    .os-board .min{font-size:13px;color:#ffe08a;font-weight:700;text-align:center}
    .os-goalitem{font-size:11px;line-height:1.3;white-space:nowrap}
    .os-goals-home .os-goalitem{color:#9fe0b5}
    .os-goals-away .os-goalitem{color:#a7c4ff}
    .os-board.flash .score{animation:osFlash .7s ease}
    .os-momentum{width:100%;margin-top:2px;border-top:1px solid rgba(255,255,255,.10);padding-top:3px}
    body.os-mom-off .os-momentum{display:none}
    body.os-sober .os-emo{display:none}
    .os-statgrid{max-width:580px;margin:10px auto 2px}
    .os-stat-h{text-align:center;font-weight:800;color:#e9f0ff;margin-bottom:6px;font-size:13px}
    .os-stat-title{text-align:center;font-weight:800;letter-spacing:1.4px;color:#ffcf5a;margin:13px 0 5px;font-size:11.5px;border-bottom:1px solid rgba(255,207,90,.25);padding-bottom:3px}
    .os-stat-row{display:grid;grid-template-columns:38px 1fr 148px 1fr 38px;align-items:center;gap:6px;margin:3px 0;font-size:12px}
    .os-stat-hv{text-align:right;font-weight:700;color:#7be0a0;font-variant-numeric:tabular-nums}
    .os-stat-av{text-align:left;font-weight:700;color:#8fb4ff;font-variant-numeric:tabular-nums}
    .os-stat-lbl{text-align:center;color:#c8d4ea}
    .os-stat-bar{height:7px;background:rgba(255,255,255,.09);border-radius:4px;overflow:hidden;display:flex}
    .os-stat-bar-h{justify-content:flex-end}
    .os-stat-bar-h span{background:#2fbf63;height:100%;border-radius:4px}
    .os-stat-bar-a span{background:#3f7fe0;height:100%;border-radius:4px}
    .os-ps-team{margin:4px 0 18px}
    .os-ps-head{display:flex;align-items:center;gap:10px;margin:2px 0 8px;font-weight:800;font-size:16px;color:#e9f0ff}
    .os-ps-head img{width:30px;height:30px;object-fit:contain}
    .os-pst-wrap{overflow-x:auto}
    .os-pst{table-layout:fixed;border-collapse:collapse;width:100%;font-size:12px;margin:2px 0 8px;min-width:720px}
    .os-pst .c-name{width:320px}
    .os-pst .c-note{width:50px}
    .os-pst .c-min{width:54px}
    .os-pst .c-tore{width:48px}
    .os-pst .c-vorl{width:48px}
    .os-pst .c-card{width:34px}
    .os-card{display:inline-block;width:9px;height:13px;border-radius:2px;vertical-align:middle}
    .os-card-y{background:#f2c200}
    .os-card-r{background:#e0483b}
    .os-card-yr{background:linear-gradient(135deg,#f2c200 0 50%,#e0483b 50% 100%)}
    .os-card-n{font-size:10px;margin-left:2px;color:#cfe0ea;vertical-align:middle}
    .os-el-pitch{position:relative;max-width:660px;margin:6px auto 0;border-radius:10px;overflow:hidden;background:linear-gradient(#178a3f,#0f6e31)}
    .os-el-lines{position:absolute;inset:0;width:100%;height:100%}
    .os-el-rows{position:relative;z-index:1;display:flex;flex-direction:column;gap:22px;padding:24px 6px 16px}
    .os-el-row{display:flex;justify-content:center;gap:14px;flex-wrap:wrap}
    .os-el-card{width:104px;text-align:center;color:#fff}
    .os-el-pw{position:relative;width:80px;height:80px;margin:0 auto}
    .os-el-photo{width:100%;height:100%;border-radius:8px;overflow:hidden;background:#0d1b3d;border:2px solid rgba(255,255,255,.75)}
    .os-el-photo img{width:100%;height:100%;object-fit:cover;display:block}
    .os-el-logo{position:absolute;top:-18px;left:-20px;width:42px;height:42px;z-index:2}
    .os-el-logo img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))}
    .os-el-note{position:absolute;top:-8px;right:-8px;z-index:2;background:#000;color:#fff;font-weight:800;font-size:13px;border-radius:6px;padding:1px 6px;box-shadow:0 1px 3px rgba(0,0,0,.5)}
    .os-el-name{font-size:13px;margin-top:2px;line-height:1.3;text-shadow:0 1px 2px rgba(0,0,0,.7)}
    .os-el-pos{margin-top:7px}
    .os-el-team{font-size:11px;color:#dfeaff;opacity:.85;text-shadow:0 1px 2px rgba(0,0,0,.6);margin-top:1px}
    .os-el-hint{max-width:660px;margin:6px auto 0;text-align:center;font-size:11px;color:#9fb4e0}
    .os-el-load{text-align:center;color:#9fb4e0;padding:12px}
    .os-title .os-title-league{font-weight:800;color:#fff;opacity:1;margin-top:4px;letter-spacing:.3px}
    .os-title-league:empty{display:none}
    .os-origbox{margin:12px 0;padding:12px 14px;background:#0a1533;border:1px solid #3f61ad;border-radius:10px;color:#e9f0ff}
    .os-origbox a{color:#8fb4ff}
    .os-pst th{color:#9fb4e0;font-weight:700;text-align:center;padding:3px 6px;border-bottom:1px solid rgba(255,255,255,.16);white-space:nowrap}
    .os-pst th.l,.os-pst td.l{text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .os-pst td{text-align:center;padding:3px 6px;color:#dbe6f7;white-space:nowrap;font-variant-numeric:tabular-nums}
    .os-pst tbody tr:nth-child(even){background:rgba(255,255,255,.03)}
    .os-ps-so{color:#9fb4e0}
    .os-note{font-weight:800;color:#e9f0ff}
    .os-note-hi{color:#5fe08a}
    .os-note-lo{color:#ff8a7a}
    .os-mom-label{font-size:10px;color:#9fb4e0;text-align:center;margin-bottom:1px;letter-spacing:.4px}
    .os-mom-label span{opacity:.7}
    .os-mom-svg{display:block;width:100%;height:auto;aspect-ratio:1000/128;max-height:112px}
    .os-poss{display:flex;align-items:center;gap:8px;max-width:520px;margin:2px auto 0;font-size:11px;font-weight:700}
    .os-poss-h{color:#7be0a0;min-width:34px;text-align:right}
    .os-poss-a{color:#8fb4ff;min-width:34px;text-align:left}
    .os-poss-bar{flex:1;display:flex;height:8px;border-radius:4px;overflow:hidden;background:#0d1b3d}
    .os-poss-bh{background:#2fbf63;transition:width .3s ease}
    .os-poss-ba{background:#3f7fe0;transition:width .3s ease}
    .os-mk{transition:opacity .25s ease}
    @keyframes osFlash{0%,100%{background:#000}45%{background:#1f7a3a}}
    .os-act{font-family:system-ui,Arial,sans-serif;margin:12px 0;padding:14px 16px;border-radius:10px;
      border:1px solid #3f61ad;background:#1c3576;color:#f2f2f2;animation:osfade .4s ease}
    .os-act h3{margin:0 0 8px;color:#4bd07e;font-size:15px}
    .os-act h3.home{color:#79dca0} .os-act h3.away{color:#8ab4ff}
    .os-mod{font-size:16px;line-height:1.5}
    .os-lineup{list-style:none;margin:6px 0 0;padding-left:2px;color:#f2f2f2} .os-lineup li{margin:4px 0}
    .os-pos{display:inline-block;min-width:30px;text-align:center;border-radius:4px;
      padding:1px 6px;margin-right:5px;font-size:11px;font-weight:800}
    .os-pos.p-TOR{background:#f2c200;color:#3a2f00}
    .os-pos.p-ABW{background:#8fd694;color:#0a2a12}
    .os-pos.p-DMI{background:#1f3a93;color:#ffffff}
    .os-pos.p-MIT{background:#7db8e8;color:#0a2233}
    .os-pos.p-OMI{background:#f4a6c6;color:#3a0a1e}
    .os-pos.p-STU{background:#e0483b;color:#ffffff}
    .os-lineup .os-tal{display:inline-block;margin-left:4px;padding:0 5px;border-radius:3px;
      background:#2a3f6e;color:#cfe0ff;font-size:10px;font-weight:600;vertical-align:middle}
    .os-talnote{font-style:normal;font-weight:700;color:#ffe08a}
    .os-goalrow td{padding:0 !important;background:transparent !important;border:none !important}
    .os-goalbox{background:#f5f7fa;color:#12203f;border-radius:8px;margin:10px 0;overflow:hidden;box-shadow:0 3px 10px rgba(0,0,0,.35)}
    .os-gb-head{display:flex;align-items:center;background:#0f1e3f;color:#fff;padding:7px 12px;font-weight:800;font-size:14px}
    .os-gb-min{min-width:46px}
    .os-gb-title{flex:1;text-align:center;letter-spacing:1.5px}
    .os-gb-ball{font-size:16px}
    .os-gb-main{display:flex;align-items:flex-start;gap:12px;padding:11px 12px}
    .os-gb-person{display:flex;align-items:flex-start;gap:10px}
    .os-gb-assist{margin-left:22px}
    .os-gb-photo{width:56px;height:56px;border-radius:6px;overflow:hidden;background:#dfe6f0;flex:0 0 auto}
    .os-gb-assist .os-gb-photo{width:46px;height:46px}
    .os-gb-photo img{width:100%;height:100%;object-fit:cover;display:block}
    .os-gb-pinfo{min-width:0}
    .os-gb-name{font-weight:800;font-size:15px;line-height:1.2}
    .os-gb-pos{margin:3px 0 2px}
    .os-gb-role{font-size:12px;color:#5a6b8a;font-weight:600}
    .os-gb-so{font-size:12px;color:#5a6b8a;margin-top:1px}
    .os-gb-score{margin-left:auto;align-self:center;background:#0f1e3f;color:#fff;font-weight:800;font-size:18px;padding:4px 12px;border-radius:6px;font-variant-numeric:tabular-nums;flex:0 0 auto}
    .os-gb-comment{padding:0 12px 12px;font-size:13px;line-height:1.55;color:#243a63}
    .os-gb-comment .os-emo{color:#3a4f7a}
    .os-eventrow td{padding:0 !important;background:transparent !important;border:none !important}
    .os-evbox{background:#474788;color:#eef0ff;border-radius:8px;margin:8px 0;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.3)}
    .os-ev-head{display:flex;align-items:center;background:rgba(0,0,0,.22);padding:6px 12px;font-weight:800;font-size:13px;letter-spacing:1px}
    .os-ev-min{min-width:44px}
    .os-ev-title{flex:1;text-align:center}
    .os-ev-icon{font-size:15px}
    .os-ev-main{display:flex;align-items:center;gap:12px;padding:10px 12px}
    .os-ev-photo{width:48px;height:48px;border-radius:6px;overflow:hidden;background:#33336a;flex:0 0 auto}
    .os-ev-photo img{width:100%;height:100%;object-fit:cover;display:block}
    .os-ev-info{flex:1;min-width:0}
    .os-ev-name{font-weight:800;font-size:15px}
    .os-ev-team{display:flex;align-items:center;gap:5px;font-size:12px;color:#c3c8f0;margin-top:2px}
    .os-ev-team img{width:15px;height:15px;object-fit:contain}
    .os-ev-subwrap{display:flex;justify-content:center;align-items:flex-start;gap:6px;padding:10px 12px 6px}
    .os-ev-player{display:flex;flex-direction:column;align-items:center;gap:3px;min-width:118px}
    .os-ev-arrows{display:flex;align-items:center;justify-content:center;gap:16px;height:48px}
    .os-ev-out{color:#ff6b5e;font-size:18px;font-weight:800;line-height:1}
    .os-ev-in{color:#4ce07a;font-size:18px;font-weight:800;line-height:1}
    .os-ev-pos-c{margin-top:3px}
    .os-ev-fullname{font-weight:800;font-size:13px;white-space:nowrap;line-height:1.2}
    .os-ev-pname{font-size:12px;text-align:center;line-height:1.25}
    .os-ev-so{font-size:11px;color:#c3c8f0;margin-top:1px}
    .os-ev-player .os-ev-so{text-align:center}
    .os-ev-team-c{justify-content:center;padding:0 0 9px}
    .os-form{font-style:normal;font-weight:700;letter-spacing:2px;color:#ffe08a;margin-left:4px}
    @keyframes osfade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
    table.os-tac{border-collapse:collapse;width:100%;max-width:520px;margin:0 auto;color:#f2f2f2;font-size:13px;border-radius:8px;overflow:hidden}
    table.os-tac th,table.os-tac td{padding:7px 10px;text-align:center;border-bottom:1px solid rgba(255,255,255,.07)}
    table.os-tac td.l,table.os-tac th.l{text-align:left;color:#bfe8cc;font-weight:700}
    table.os-tac thead th{background:#0a8a3a;color:#fff;vertical-align:bottom}
    .os-tac-th{display:flex;flex-direction:column;align-items:center;gap:3px}
    .os-tac-th img{width:28px;height:28px;object-fit:contain}
    table.os-tac tbody tr:nth-child(even):not(.os-tac-group):not(.os-tac-barrow){background:rgba(255,255,255,.035)}
    tr.os-tac-group td{background:rgba(255,207,90,.12);color:#ffcf5a;font-weight:800;letter-spacing:1px;font-size:11px;text-transform:uppercase;text-align:left;padding:5px 10px}
    .os-tac-cmp{display:flex;align-items:center;gap:8px}
    .os-tac-cmp .v{min-width:46px;font-weight:700;font-variant-numeric:tabular-nums;color:#cfe0ea}
    .os-tac-cmp .v:first-child{text-align:right}
    .os-tac-cmp .v:last-child{text-align:left}
    .os-tac-cmp .v.hi{color:#fff}
    .os-tac-cmp .bar{flex:1;height:8px;background:rgba(255,255,255,.09);border-radius:4px;overflow:hidden;display:flex}
    .os-tac-cmp .bar.h{justify-content:flex-end}
    .os-tac-cmp .bar.h span{background:#2fbf63;height:100%;border-radius:4px}
    .os-tac-cmp .bar.a span{background:#3f7fe0;height:100%;border-radius:4px}
    .os-fieldwrap{max-width:360px;margin-left:auto;margin-right:auto}
    .os-field{position:relative;width:100%;aspect-ratio:320/460;border-radius:6px;overflow:hidden}
    .os-field-logo{position:absolute;left:9%;width:34px;height:34px;z-index:3;opacity:.92;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))}
    .os-field-logo img{width:100%;height:100%;object-fit:contain}
    .os-fl-home{top:7%}
    .os-fl-away{bottom:7%}
    .os-field svg{position:absolute;inset:0;width:100%;height:100%}
    .os-chip{position:absolute;transform:translate(-50%,-50%);z-index:3}
    .os-name{display:block;font-size:10px;font-weight:700;white-space:nowrap;
      padding:2px 6px;border-radius:5px;box-shadow:0 1px 2px rgba(0,0,0,.45);
      background:rgba(255,255,255,.94);color:#12261a}
    .os-chip.p-TOR .os-name{background:#f2c200;color:#3a2f00}
    .os-chip.p-ABW .os-name{background:#8fd694;color:#0a2a12}
    .os-chip.p-DMI .os-name{background:#1f3a93;color:#ffffff}
    .os-chip.p-MIT .os-name{background:#7db8e8;color:#0a2233}
    .os-chip.p-OMI .os-name{background:#f4a6c6;color:#3a0a1e}
    .os-chip.p-STU .os-name{background:#e0483b;color:#ffffff}
    .os-live-current, .os-live-current td, .os-live-current th{background:rgba(150,180,255,.10) !important;color:#ffffff !important}
    .os-comment td{color:#fff !important;font-style:italic;background:#1c3576;border-left:4px solid #0a8a3a;padding:9px 13px;font-size:14px;line-height:1.5}
    .os-comment.hz td,.os-comment.fin td{background:#1c3576;border-left:4px solid #ffe08a;font-size:15px}
    .os-comment.goal td{background:#1c3576;border-left:4px solid #ffe08a;font-size:15px}
    .os-comment b{font-style:normal;color:#ffe08a !important}
    .os-tooorrow td{padding:2px 8px}
    .os-tooor{display:inline-flex;align-items:center;gap:10px;
      font-size:1.5em;opacity:0;animation:osTooorIn .4s ease forwards}
    @keyframes osTooorIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
    .os-goalgif{flex:0 0 auto}
    .os-goalgif .os-ball{animation:osShot 1.7s ease-in infinite}
    @keyframes osShot{0%{transform:translate(0,0);opacity:0}12%{opacity:1}
      45%{transform:translate(30px,-4px);opacity:1}62%{transform:translate(30px,-4px);opacity:1}
      72%{opacity:0}100%{transform:translate(0,0);opacity:0}}
    .os-scoreline td{background:linear-gradient(90deg,#f2c200,#ffde6a) !important;color:#111 !important;
      font-weight:800;font-size:16px;text-align:center;letter-spacing:.3px}
    .os-scoreline *{color:#111 !important}
  `;
  document.head.appendChild(style);

  function buildField() {
    return `<svg viewBox="0 0 320 460" preserveAspectRatio="none">
      <defs><radialGradient id="osg" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#33c65f"/><stop offset="100%" stop-color="#128a3a"/></radialGradient></defs>
      <rect x="0" y="0" width="320" height="460" fill="#0d1b5e"/>
      <rect x="8" y="8" width="304" height="444" fill="url(#osg)"/>
      <g fill="none" stroke="#fff" stroke-width="2" opacity="0.85">
        <rect x="16" y="16" width="288" height="428"/>
        <line x1="16" y1="230" x2="304" y2="230"/>
        <circle cx="160" cy="230" r="36"/><circle cx="160" cy="230" r="2" fill="#fff" stroke="none"/>
        <rect x="85" y="378" width="150" height="66"/><rect x="125" y="418" width="70" height="26"/>
        <path d="M 138 378 A 34 34 0 0 1 182 378"/>
        <rect x="85" y="16" width="150" height="66"/><rect x="125" y="16" width="70" height="26"/>
        <path d="M 138 82 A 34 34 0 0 0 182 82"/>
      </g>
      <g fill="#fff"><rect x="142" y="444" width="36" height="6"/><rect x="142" y="10" width="36" height="6"/></g>
    </svg>`;
  }

  try {
    const bodyText = document.body.innerText;
    const txt = el => (el.textContent || '').replace(/\s+/g, ' ').trim();

    // ---- Meta / Teams ----
    const info = bodyText.match(/Datum\s*:\s*(.+?)\s+Stadion\s*:\s*(.+?)\s+Spielart\s*:\s*(.+?)\s+Zuschaueranzahl\s*:?\s*([\d.]+)/s) || [];
    const datum = (info[1] || '').trim(), stadion = (info[2] || '').trim(),
          spielart = (info[3] || '').trim(), zuschauer = (info[4] || '').trim();
    let home = '', away = '', header = null;
    document.querySelectorAll('h1,h2,h3,h4').forEach(el => {
      if (home) return;
      const m = txt(el).match(/^(.+?)\s[-–]\s(.+?)$/);
      if (m && m[1].length < 40 && m[2].length < 40 && !/Datum|Stadion|Spielart/.test(el.textContent)) { home = m[1].trim(); away = m[2].trim(); header = el; }
    });
    // Team-IDs aus der URL + Wappen-Logos (Muster: /images/wappen/00000000.png)
    const urlIds = location.pathname.match(/(\d+)-(\d+)\.html/) || [];
    const homeId = urlIds[1] || '', awayId = urlIds[2] || '';
    const LOGO_EXTS = ['png', 'gif', 'jpg', 'jpeg'];
    const logoBase = id => location.origin + '/images/wappen/' + String(id).padStart(8, '0') + '.';
    const logoTag = id => id ? `<img class="os-logo" data-lid="${id}" data-ext="0" src="${logoBase(id)}${LOGO_EXTS[0]}" alt="">` : '';
    const attachLogoErrors = () => document.querySelectorAll('img.os-logo:not([data-eh])').forEach(im => {
      im.setAttribute('data-eh', '1');
      im.addEventListener('error', () => {
        const id = im.getAttribute('data-lid');
        const next = parseInt(im.getAttribute('data-ext') || '0', 10) + 1;
        if (id && next < LOGO_EXTS.length) { im.setAttribute('data-ext', String(next)); im.src = logoBase(id) + LOGO_EXTS[next]; }
        else { im.style.display = 'none'; }
      });
    });

    // ---- Legende -> Namen ----
    const pre = bodyText.split(/Starteinstellungen|Es folgt der Spielbericht/)[0];
    const homeMap = {}, awayMap = {};
    (function parseLegend() {
      const toks = pre.split(/\s+/).filter(Boolean);
      const isLetter = t => /^[A-Z]$/.test(t);
      const isName = t => /^\p{Lu}/u.test(t) && /\p{Ll}/u.test(t);
      let i = 0;
      while (i < toks.length - 1 && !(isLetter(toks[i]) && isName(toks[i + 1]))) i++;
      const seen = {};
      while (i < toks.length) {
        if (isLetter(toks[i])) {
          const letter = toks[i++]; const parts = [];
          while (i < toks.length && !isLetter(toks[i])) parts.push(toks[i++]);
          const name = parts.join(' ').trim();
          if (name && isName(name)) { if (!seen[letter]) { homeMap[letter] = name; seen[letter] = 1; } else if (!awayMap[letter]) awayMap[letter] = name; }
        } else i++;
      }
    })();
    const starterLetters = ['T', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K', 'L'];
    const surname = n => { const p = (n || '').trim().split(/\s+/); return p.length <= 2 ? p[p.length - 1] : p.slice(-2).join(' '); };
    const boldSurname = n => {
      const p = (n || '').trim().split(/\s+/);
      if (p.length <= 1) return '<b>' + (n || '') + '</b>';
      const k = p.length <= 2 ? 1 : 2;
      return p.slice(0, p.length - k).join(' ') + ' <b>' + p.slice(p.length - k).join(' ') + '</b>';
    };
    const norm = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
    const POSORD = { TOR: 0, ABW: 1, DMI: 2, MIT: 3, OMI: 4, STU: 5 };
    // Aufstellung rendern: sortiert nach Position, Positions-Tag farbig, Nachname fett, Team-Farbe über die Liste
    const TAL_ABBR = { Spielmacher: 'Spielmacher', Freistossspezialist: 'Freistoß', Torinstinkt: 'Torinstinkt', Flankengott: 'Flanken', Libero: 'Libero', Elfmetertöter: 'Elfmeter', Torwandtalent: 'Torwand', Kopfballspezialist: 'Kopfball' };
    const posFB = { home: {}, away: {} };
    function renderLineup(block, map, players, fb) {
      const rows = starterLetters.filter(l => map[l]).map(l => {
        const name = map[l], p = players ? players[norm(name)] : null;
        const known = !!(p && p.pos);
        const pos = known ? p.pos : ((fb && fb[l]) || '');
        return { name, pos, known, skill: (p && p.skill) || '', opt: (p && p.opt) || '', talents: (p && p.talents) || [] };
      });
      rows.sort((a, b) => ((a.pos in POSORD ? POSORD[a.pos] : 9) - (b.pos in POSORD ? POSORD[b.pos] : 9)));
      const ul = block.querySelector('.os-lineup'); if (!ul) return;
      ul.innerHTML = rows.map(r => {
        const tag = r.pos ? `<span class="os-pos p-${r.pos}">${r.pos}</span>` : '';
        const stats = r.known ? ((r.skill ? ' – ' + r.skill : '') + (r.opt ? ' – ' + r.opt : '')) : '';
        const tal = (r.known && r.talents.length) ? r.talents.map(t => `<span class="os-tal">${TAL_ABBR[t] || t}</span>`).join('') : '';
        return `<li>${tag}${boldSurname(r.name)}${stats}${tal ? ' ' + tal : ''}</li>`;
      }).join('');
    }

    // ---- Tabellen finden ----
    const tables = [...document.querySelectorAll('table')];
    const findTbl = pred => tables.find(t => pred(t.textContent));
    const tblStart = findTbl(s => /Einsatz/.test(s) && /Spielweise/.test(s) && !/Anpfiff/.test(s));
    const tblStat  = findTbl(s => /Endstand/.test(s) && /Ballbesitz/.test(s));
    const tblPlayer= findTbl(s => /Spielername/.test(s) && /Vorlagen/.test(s));
    const tblReport= findTbl(s => /Anpfiff/.test(s));

    const parseTwoCol = tbl => {
      const map = {};
      if (!tbl) return map;
      tbl.querySelectorAll('tr').forEach(tr => {
        const cells = [...tr.children].map(c => txt(c));
        const label = cells[0];
        const vals = cells.slice(1).filter(v => v !== '');
        if (label && vals.length >= 2) map[label] = [vals[0], vals[vals.length - 1]];
      });
      return map;
    };
    const S = parseTwoCol(tblStart), V = parseTwoCol(tblStat);
    const getV = (map, sub) => { const k = Object.keys(map).find(k => k.indexOf(sub) >= 0); return k ? map[k] : ['–', '–']; };

    // ---- Messung Rasterpositionen (vor dem Ausblenden!) ----
    const starterSet = new Set(starterLetters);
    const markers = [];
    const auf = new Set();
    document.querySelectorAll('b, strong').forEach(el => {
      const t = txt(el);
      if (t.length !== 1) return;
      const after = ((el.nextSibling && el.nextSibling.textContent) || '') + ((el.nextElementSibling && el.nextElementSibling.textContent) || '');
      const isLegend = /[A-ZÄÖÜ][a-zäöüß]{2,}/.test(after);
      const box = el.closest('ul,ol,table'); if (box) auf.add(box);
      if (isLegend) return;
      if (!starterSet.has(t)) return;
      const r = el.getBoundingClientRect();
      if (r.width > 0) markers.push({ L: t, cx: r.left + r.width / 2, cy: r.top + r.height / 2 });
    });

    // ---- Bausteine erzeugen ----
    const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

    const title = el('div', 'os-title', `<b>${logoTag(homeId)}${home} &nbsp;–&nbsp; ${away}${logoTag(awayId)}</b><div class="m">${[stadion, datum, zuschauer ? zuschauer + ' Zuschauer' : ''].filter(Boolean).join(' · ')}</div><div class="m os-title-league">${spielart || ''}</div>`);
    // ===== Liga-Logos (Land|Liga-Code -> Bild). Weitere Nationen hier ergaenzen: 'Land|1':'data:image/png;base64,...'
    const LEAGUE_LOGOS = {
      'Belgien|1': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4TnrqAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kb9Lw0AcxV9bpUWqInaQ4pChOtnFijiWKhbBQmkrtOpgcukvaNKQpLg4Cq4FB38sVh1cnHV1cBUEwR8g/gHipOgiJX4vKbSI8eC4D+/uPe7eAd5WjSlGXxxQVFPPJBNCvrAq+F8RwAiGEENYZIaWyi7m4Dq+7uHh612UZ7mf+3MMykWDAR6BOM403STeIJ7dNDXO+8QhVhFl4nPiKZ0uSPzIdcnhN85lm708M6TnMvPEIWKh3MNSD7OKrhDPEEdkRaV8b95hmfMWZ6XWYJ178hcGi+pKlus0x5HEElJIQ4CEBqqowUSUVpUUAxnaT7j4w7Y/TS6JXFUwciygDgWi7Qf/g9/dGqXYtJMUTAD9L5b1MQH4d4F207K+jy2rfQL4noErteuvt4C5T9KbXS1yBAxvAxfXXU3aAy53gLEnTdRFW/LR9JZKwPsZfVMBGL0FBtac3jr7OH0ActTV8g1wcAhMlil73eXdgd7e/j3T6e8H5LJy1D94vG0AAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfqCBIHCwPO2dhlAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAIABJREFUeNrtnHeYVuWZ/z/3c85bpjeGKUyjw9A7FiQSRAyKmig2Ytdoylo3u0lMYrKu62azxiSby2hMTDGagBWjQUEUJIgivZdhgKlM7zNvOc/z++Oc950ZiooSk192z3XBwLzlPM/33O37ve9z4P+Oj3zI38Mitu5sTygpDEy2bBkf9KtiDD4DPeGwPhjqMVu27qrbdu6sgsj/arCqKtsHZWX57la2usoyR/OioRqcSCtiwiABVCALy59vjEk/GA2pXzY0hB4tHJzc8r8KrBWrd/pmTh12l882923dtj2lqfLPnDVuE0q3IxIFDFp8gIHoAFrWTSXtjAUEh4yoDYXNnW+uPbBk4QWl5tNet/q0T1hR05F29vRRz7Y21/3nN//1WylnTJ9JxcG3sUybB5QACss4KKOxpRn77aW0XnMLNY8+muvvaXt67uwR/7XnSIv9Dw3Wjr2tCdlZgWWHDu1dePnli/jRIw+jjUFrfZyh9zUbbRSBnjDBx39H7V1fV6ah9p7C7IQfrVvXIP+wYA0uSPxh1ZEj51x11dWsX78e85EcyWAZcJRgxBDcvI2mb9+P1d7ylTFjk2/+hwSrsTl8vuN03/b1r9/Lli1bMMZ49tMfMWOM91rfyGpQGsQYBI1/w1bqHvmZJPjkhzVHOocNHHT3p2Jhp93vL7zo5/KlO75QYtvd54bC3ee8+uLKgjffeGdlwNaLl7/2inr+hZdOYDzGxUxOZlsgGBAwRhDA/9JyOhfOT21Jy3ktEq1p+8b3l9bPPGvSVp/fvybU5Vt36fl5jX+XYD31QnliWoaeiQkvAHMBUjsiYrRlDLy1eg0LFkz8rNZhHnzwhyd2PZF+FiZyMtQkDqploO2Z5yj5/r8NmTwpnQP7tnHmrBHnOdHue22/dC9btfN9E/Ut1yZ5eUdrZNsXFxVH/2Zg/fa5vSlpGcHzDT2XWlb4c1r3pAsGjEVbSwdHa2so23eY+tYQ888/k507d7Bp08YT4CQeTMb96f1f+hQ3RhmMAjQoEddNFdir1hK5rYqLF57JDx5+iWHDN5JbkMXAgXkJiUmBWeKLzvKp0AMZAX/Fi2/ueVFM8Pnqw6F1t98wMvJXB+sXv9njy85PmC1W1w0izucMLelGDD1hQ0NtPQf3lbF1y262bCknGnUhUMpiyNBi3lr1+gktxnxoxWfibxLvTSICxuBzooQqypg8fhRdXc/x2M+XYXBITrKZOnUkYyeUMmRYsaRnphYpUf+EdH+tYHDgyEtv7l3qRKzf1FQ5O79yw0hzWsF66vn9WWnp5gZwbjXSOhwMUUdTXV3D/t3lrFr5DhUVzSgRd9PGtRODEBDDgKw09u3dfwIY+tqQYIyOA2qMca2uL1ACRsd/gVIKU1vLgJkjEKPRxmBE6OzUrF69h7dW78aIw9gxhZxzzlRKhg6WnNwBxSKRe+2A3F042P+XF1aW/7y2ouP5228Y1/OJwXpqSXVSRmbPTofWHKMVrU1t7Ni2mzffWEvZwQb3K4xBxEIsw9Bh2UyaPJ5BRfns2rKHDes34/cn0NTUcAwIJg6ZBw8K1Q8MY7zXjPRaWSy8iVtKmJY2fJaNxuGKxeeTnZvNoQOH2LJxF1VVbQgWu3ZUsWt7JaIMk6cM5uxZUxk+apRKStGzLBWaVTw441VgwScGK9TT5dcmkuk4hiVPPcvrKzZitAAWYKEszYRJgxkzfjSFJSUkpCQS6YnQ3NBIQ0MDkQg4WmPbdr/y4IQOFysbpG/Mkt6MqU0/uxStcAJ+jNaIERrr6skvymf6WTOZMesM2lpaOHSgnK0bd7Fvfy0Yi03vH+b998tJTLC49vqFnDFrCo7uzDotbuiYiBjj4DiGlSs3Y7TCoBk5MptpZ0ylcEghSSkpdHZ2UlNRxcH9h3hv/Xa6O12XEoT2tnaGDx9+QpDES3AxfxPpRUriZYXxjMpzRXE/pw2orAF0dnUD8MbrG3n9tc1kZweZNmMcRUNKGD1+LBOnT6S5qZny/YdZs+o9Ghpa6e4Wdu7YwxmzpgE+dVrASk41sVXjGI1gseDiczhj9gxC4SiVR46wZ/kaNry3i0hEPDfzaAoaC0VFZQ0jR40+aQ3lxjjBiI7HJ8H7LqNAFILGWG5gRwQNbkVfPIw9+/aDUWhlEBSNDT0sf2UDmPdJTrOZeeZYRowewYRpExg/ZQIvL32ZTRv2E3Uc14rFOT1g+SwLQbtX1QgGTeaAdNo7Ovjpfz5BZ0e0lwiIjuWrPpYJm7fs4KLPzSYpKYnOzs5jYpb7bkE4aVoSASXeRYidwdBdUkTW8MGse+ZljLiuCLoPP9F0tEdYsXwLK/68mSHDM7n5azeSlpEMYjzcBT5iPvxQRM0JikSDQmtNe2cEUL3nMnIMGVagNE888SopqenceeedvbnP+06J+RSm9zwSr7r6B/Z+i1D4Lr+Umo5Oljz3LkZOQAGMe4EFgyhDV0cItBczje4tXEROD1hKYm7hLUUEidET47rFyWxCGQMOlFe0sebt97j2+sWkpqX1C/Lxv6W3hjLGLTx6T2owGled0IDRdBXlkzn/fJa9tJJQSDyrMidz9HhGNZ7lGdzPCAr0R6P0HwqWKPs4HmdORO1OdL7Y74zhgQd/SXLKAB7/xeMnpjReJuzvnp7Feb+yjKAxhJWftPvu4UBjM/c/+Ixb031Aho0vRaTfeS1LEBwsseO+OyD3xgFZeVdenplz5fyPoToolJJjNtcLghsg5XhX9QJxzBr3l7fy8A+fYP78BTzyo58cA5iOl6fSL4bFgPIimhjCAcH+7j04I8Zw332PoB27vwt/UNw7JgS0t3WxY8teXnz2xeIB+Vc9mZnz+Q1Gmo7YdtcSCF916hW8Ua4bivS6RmxrcQIsH75IY/HE79YycGAWt99+PVkDMrj99tvo6Ojy4op4Qdf0/5hyE4c2EMrMIvHb96KmTeM73/sRq9cdxhh10pATK4BjaSEcjlK25zDVR+oAi63bD7Fl65Pk56XmfG5B6fWFJXkMKihm1449PPPUm3LKYNmWDSIoJX1wEa+G+iCMjn3VQQQeevhlmlvbuOuuG1n7l3X89Cc/RdmHQYW90HWMBRsh4vNjLp9H5nXX0Gj5+e69/8myV3cAChHzoWuI/Wxp7uZXj/2RlGQf582byIiRw8gbNJCs7Ex8tgXiABb79pgTxj/7ww0rgihA3KwnRuL05FR6HiaeJgw//+WbvLt+O9/4xi088uMf091WjlgbcDo3Y5xmBAfEj9h5WMGJZN0/GScplz+veIvvfu+X1NaHXV1L+q7D9Ikq/ZNHcpKPKVOHMW58Kbm5OaRnZxAM+jxwvIQFiLhWqpTCIPapgyUaEdMHEnELyGPA6mvyJ28jmXjg3rqziSuu+XfOmlHA9dd/ntLSM8jLW0hKomsJ2ght7REOVDWyfdtWHnv8fnbubXUzo8G1KKFfpot9f0KCYvr0kQwbMZTiwYVkZadj2z6UclBixcVEweqNubFLqoxrHEadOlgWqp/fx0JV3Am97PhBQB0LZFyxEpu1G2pZ+95PMUbISLUZNTyPlNRkGpvb2Luvhs6uMCI+r55z3PgmEivGMGh8PsPUKcMYVTqCgsJBZOdkk5DoR8RBvPUbbzdGLCzVl3u6l17FqZRFOBzts8FTiVmisAzGOpnAIsfX3qYvzztRUWsExMuARnmxR9PaFuW9jRUekMbjgH6vKne89xoSghbjxhczfORgSoYUkZObQyDo8xiE656uN7ihwxiHjvYeKisrKSguJCMtCSUqXt6JuBezoztMfUM7LS3dWIJ1ymApcamZUicJT8Z8dFm4D8zCsbFPecYix1UoSgmTJhYzYsxwikoKyRuUTTDg8173kg/GizkKx9G0tbbRUN/AgOwsWlvaeOD+JwHDwz+5C0sMIholbtrt7InS1NJJV1c3mlh2Pb5w+1CwxBKjlCDKyxDHcLoTIfih8etEiqmJKRBRfD7FiJH5TJw8lvxBeQzMHUhySgLGy6jx0OCFBGOgrbWTuqO1FJUUULbvMA//1xJEbL56xwIyszLQOCjAVgpLWRhRtHf30NLaQVd3GI3lWoWomJWcuhuKEVHxGOW6R38rOj7J9nI8E+eLfWs0V6uPmaoBC8aUFlBaOoxBxXnk5uWSkpKCKCdO4kV0vPgVDJGww5FDNRw5VMHWLbvYubMKEP7jh3egtad8SIS33niXL1y+wA3mxuAYQ3NHD63tnUQcB7RClI3SOi79eDHx1MFCxMRT37GdhA9Ppf3V0HgCVRSXpDN12gQKiwsYmJdDUmoQ24pdCAuF44FjIWKIhqHicBVVlbUUFOURDAb4j3//FYIP24bxYwuZMGkUyUkJGO1JLyh27qzlnNnNnkcoauvaSMnQ3lJUXM/HO1csO56A1X0EsLTp1eS8Kr4vDzNxtztZweACUFSSzrgJoxg8dDA5uQNJSU1GWQaltGf6bhRTXiHa3t5Od1c3mQMySUj009jawn888CTg41++eTW2rTzJKMrXvraIqTMmAFGMNthK4n0OQfHWqncRcUVLIwpRVh/e2kf3j9Mm6XulT6XOilmkuEbmfYciph0pEO25qIoH7fy8NMZMGEHJkCIKigeRkpqCsrUn3Eg8A1nYvcwJxc6te3ntlbfYf6AJrR2GDcvijn++BaM1GBsRDSaKpWwXWmNITAjS091DQ10DWdkZ9ISi3lkclLLYvbs6fmm1GJwY+xQQZXpzlMdBRU7sNx8Olna/WomgxEIbOLCnnMpDFa7ZeipnRmYCM88YS2FJIbn5eWRkpCJWLI1r9w8KpdwlhcNRAkGbmPgJsGnDVn7+s5dJSFCMKR3Ejp1VlJU1U3GomswBaSDuZt3tuhZric3SJcuprmmio0vz7Qdvp7mzx72w2jBx8nA2bdznVer9IdCAqFjVJ4iO1xJojXPKYL299t1gTk5AdmzfiqNdxNev2016RoBz50xgyPAS8gblkZaRhmXHAnFv/eIuw8aJOvj9hj27DvL++s3s23+I7z34dcTnBu3urhC/+/WfUEq49voLGTVmNPfc8SApSQnYtkYpl18qLEIRaOsMu5YlUFbeRE5eElPPHALKRoxCtGBEGD1uFBs37u2nxMb1VOkjbsbZUkxJ+YhF6YC821K06Z6BROc8+tizl2ndYScmWsz6zFgGDxtM/qB80jJS8fktz536trTc9KsdTVNTEzVVdezasYc9e47wvQfuYd/Ovaxbu4+0ND9+20JjsBREwmHaOzRKNOkZCWSkJ/D9f/syli+R5BSblpb2OHfr7AyBCmHQiDIsWnwBYyaWEo0zAy8TC+QW5pOc4qOjw63+jdfTpA8Bj8dgERR4HiTRDwRr5sz71L6yfUuc6NH5SamSNGnyMIaMGEJufi6ZAzLxB1RcV3KRcfooELbbVBDD7u37WfL7ZTQ1Rryw6ZCRlYgxEc/aXIAtywIigBCNOl6RqOjqjrB+3fuse3sTu3ZXs2jxfHIH5bkqp1ZoNKK86lw7+JP8aAVWjKrErMgY/EE/U6aPY/WqbYgVdauZEygKrvArcfcWTOQDwTpQZisj4Vk33Pa5pOGjh5GQEMAYx+NPKk4MRQQ0NDe1Ul1Zw6GygzQ3tTFqzFBmnD2Vnq4eGhvCoDVXXH0u48aPJjkjFZ/fH08QjtZEIxGwNOGwpr65He042L4APSHDO2s3sWN7FbHetgHQErcII70yd83ho7TUNXNgbxnjpoxFtIonJW3CTJg6juEjS8jKySEpJTEuLR+bt52QQ3NTC0drGnAF8Q8AKyExSkePkJmVQUKiL04hYtYTK7tqq2v4xf/8gcb6HpQST4rXbNpUxoSJ41BEPYItjJsyjuzsVEQsImGHcNgBA1oLNfWtiOXuy9Ge2uA4RKIO8y5cwP59TxLq7mMpXg1mcDmiEYUyhhWvrvcERJg0bTzpAzK57paLyC3MJzEpkcTEBExOpkeU3faaMeBENa1NjTTWNnGwrJwdWw+attZwo8AmIWHZB4IV1Q7amHjFH6tU4gHbcx8dMTQ0hFAK7rh3MS0tTTz5i5cBRUdXN1EdGwpR7N11iHeb6mhr62DewvmEnUhcBlaWjTEalEFZXoQ1oHWEtPSkeIIgxiBE4pTEeIpDZnYipWOGUjK0mIH5OSSnp6AsIZtsL4DreEHsRAwdbe001dVTfqCcXdvLqKtrw1JWHaQ+Cr6XbZWxs7768Z4P7RtGVbcIRvXVtI0xvfTBM9iI48TLcR1XByzS0v2I5ScUceKFylO/ewUdNYwYmePNjrpKkjYevbDdTORoAXEQ8VN3tIlQaDehHu1RJuIbT0uzsQM2SelB7r3vRtIy0xDbcnV8o/tN3OiooaO1nZaGJsoOHGTblr001neixAIxTJsylCuvnE9ObvFzX7lxzv2n1GQVz021NjiO6aeGau0WpAaHaMTEmwz7d5dRdqAMMMxfcC7KtnGiUS/WaObNm8HQ4YNJzUhHe1MxLo1xg4JPLKLhMMGERBKTfPR0GV57+T1QwuQpg2nv6CKYGCAxxc+d37iJtMw0bL9r+sFg0C2ajccftUVHewd11bVUV1Szf3c55eV1bh9BYOr0YUyfns3yV95BBM6aPZUJk8djSVr5KXekHZQLiHZHe8yxbapYuI1TBcWry9Z5bmLx/LOv89WSQX0+B+MmjSUzOxWNoKVPaz8qbFu/mbJ9+2lu6eS2O2/gqusuYsWrawkELSZMmcCYSaWIJViWjRZNZjAQ74qLUYgRutq7aayvp/JQhQvOwTrcrrzqJzUbYzh3/rm0tbZheAeMZkD2ADdORnzbThmsgLFMFNGu6/XtufUCZMTE3QkM191yCaKE3zz+IpEeaG5siPMrAziOoaGhjeb6ZvIKc+Nkvrs7yktL30LZhikzRhAVTcnoodw6akTcKhHHEwodRAsYi672DprqG6mpqmX71t2Ul9XHhbwYbXGZnRMfVxIscvKSSE1LZe/2PQhCMOAja8AAjFbh7i5n8ymD1W0SxG07abTWvZ1hdB/glBsbvOH+1LQkLNtyWaIYlKXcq2oUCs2vH32a1tYeUDZ3f+sGbNumdMwgRpQOI78wj4zsbIIJfq9mitVusVLBoqc7RH1dHXVVRzmwu4z9e6sIh2NZ2p3p8th8P31NTN9xS83MsyeijeH99Vu9mnI0CYlBjLZ2NDV01J8yWH4J0WMQo/uA1beji8GIO2EnxiXDjqPp7O7BctMCSWkZtDS2xZXPtvZuho3MY9SYoSQk+Zk97xws29+nNY+rrXtdlp6uMK3NLdRU17B/Vxm7th9x46fXWzQSUzJ1r9B43HxqTE4zIAqUw7BRw2ioq6Oqxr31Z/zEUoxxEJP4p9tvGmpOGSxblBHBONrgOI57ffsMffZVOLXH61evXMehQ7WAcM6548nMTKehupp5F06moKSA7JxsElOTPOXZi3sSm8qBaNihubGJuuo6Du4vZ9vWA4R6+neTJDblFx/miMso/ZspJ6g0BWHSlKGkZ2by1opVLlO1DcNGDEVEaWN8L3ysmdKw0YIY0Q44RsevVmwoza3evZFIb6hi584KBmQnMPeCMxg/fTJiG0ZNGMOIWH3Tj1AodMShubmFo1XVlO8vZ+f2g3S0hxFj9Wng9tHlXW3Ag6av+mhOPMh7DFpGDGfMmkF7aytr3tgMWCxYMJXUtGS0Y21qrk3a9rHAciQcn8qPgxSXiCWubVl+i8/MG0dhcRG5hfmkpKa4g2hCvFiMbcuJaNqbW6mtruXA3gPs2nGI9vaQ16mJWYWFUTHXhuzsBBKTgkQjUFXZQlZ2EsEEP5VHmk55HPusWaMpKCpg9Yo1REIuXZpx1jRXgzPBR69fnKU/Flg+EyAEovqB1K9ZCBgGFgxkzqDzXEJrjNeCcuOKdqC5sZGmukaOHKpk784yaqrb+82Jul0mN3Ecq0mWlKRx21dvxgpadLR38p1//QkLvzCXQUWFPPCtn8Yndk5+Y0EvbwwGFWfMnk5jfSMrX3sfEcN5508gb1AuEKgI9/j+8LHn4E3UrV1QJt49MTHgTF9B0JtdMKCj0NXRQUtTM2V7D7B1y24a6rvchoS3qeP25Um5xrjfH9vdyJGZXHvj1aSk+XCMocsiXlf1Jb8nBCo2Bd1Hzr5k0VzS0jNY8ttniUY1waDFvAvmuqzA8f/g8gVFXR//pgGrCyK96permfS91cFdfGdrB/VH6zhy8BB7dh2kurIFjCI51UfAbyPGRox2gThR8/WYieWB2X4WXvxZJk2bgD+gvEkmg8+y3eaPEmwVy8xy0vZa76SzcOaskYyZNJadm7azY2slInDNF+cxICcdHN+O5qbIE5/oDgufaMIiIspliIIbRzo7umg42kjl4Ur27y6jvKwJraMEAio+tecPCrffcSOODvE/D/+acM/xkfdYixAMd911OaPHDCUxycbRLq1y3LtNsC3XQnyW4LOteI/wpI1b73oWFKUxZ/65NB1t4sVnV4EYSktzmHnWdDcVO4n/fN2iwT2fCCzj+MSIJeEeh6ryWioOlXNwfwX799VHo1HngMJ6xxj/GwH/gO3f+s6Vj+Xkpc7cs3s/j/z3HwiHoqx9azUXXDKfqxZfxG9/9bI7v/kB060GGDJ8EEnJPjCCpTRKCZbRRLVge0O3fp8i4LM+8HtitCY93c+ixZdgUPzxd88R6jEkJfm47uYrCARsMAlPbN9W/Rof4+hfOugISgxP/GxpFHwHBFYpzFolCWvHDiuoWvv2D+KBY/ioB24JRevWjZ88JuXSz5/BC8+/w7q1u0jLSGHWnHO4YvE8nvnNa8dNJh/fEBG0UXS0d7DuL5v4zOwzCQZtRDn4vJaWrRR+S3GysdFYrR5IgKtv+AJpGWm89Mdl1FR3AHDTLZeSm5cDJrCrqzP4z9+89yzzicEqzM+JHK5s+qIt9q5BBQMPb97w33Fw6qr7f3D+2bk7Xlh56B7bbn3sggvnSeXhWjZsPMDyZRtIz0hl3KSJdHV289Jza+KzDcd2EzGwfctuqmvqWL1mK93dUWbPnumqs30SsaUMtnX8+LfpnYnGF1Bce9PF5BXksvLPr7Np4yGUGBZdOZspU8cjxu7U0cTFV1xU1MbHPPqBtXnjdwzwCkBdzYd/uL6264n8/OTx/kD7V6+96QpaWn7J/rJ6/vDUCoxWzDh7Bn6/xdJn3uyfTftY2uNP/Lm3oLAM4ajB9nujBqI8xcPloX2H/GKauTJCIGhx/a2fp6A4nzdfX8Vbq7ajsDh3TinnzZ+LKOXgBL+08LyizXyC4xPd9nvr4lLT1ZF4rxB8NTUtlS/fcS3FRamghT8+/Rq7t+9k8owpXHPdBYiSkwyHqF4ZRYRQVNMdNfREDeGoxiBEHE046hzTDTcoA2npNjd+eREFxYNYvWItK1/bjBiLWWcP44prPo/fVmgn6cEL5w79PZ/w+MT3SC9amBfSkYSrRdnvZmRl8JU7byQ3JwmM8Ptfv8qm9zZSOqGUW79yGUlJdt+R9z7/6DWZcFQTjjiEog5h73aRnoimK+z0K44FRWFxKjd/5VoG5gxk+cuv8fry91FimDqlkKuuu5xAMIgxCb9oruN+TsNxWm4ov/j84taeLnuh4N88MHcAd//LrQwuycQYzZKn32DtqrUUDSniS/90DYUlad58qjohqws7Om5J4airSUWihnAkNuWi0MC4KUUsvvkaEpMCvLT0Rd5eswsRw5lnjuKm275IYlIQIbgkGk772nVXD9V/N2ABXPa54XWKlAuUBDbn5GXzT/fcyMgRA1FY/PlP77Js6UskpaRw3a2LmX7msPhNTcceUccQihrCUYhEtddIMYSi2htccliwcCZfuPpSQj1dPP2rJWzZdAgFzP3seK676UoSk4OISXu2oznx2ksvyAmdrj2e1kcVLJhTcDQSSjwPCfwlIyuDO+69nXNmjUbQbFh3gF8/9lu6urq4+LKFXLn4s9h238FcT131bit0tCHqSdvGuLejZGQmcMtXL+fsObOoLK/g8R8/RXlZAxjD5YvO4eprLyMYDICT9MvuzoRrrvp8Yeh07s/iNB9/fOpH3Zde9vUlPpuRfr8pHTt+FAGfsGP3Ydraetj03g6ys5MYO2kCpeOHU3+0iubmnngImz13JpblXsNwKMKaVe8xZXopGTlpTJ4ykczMTNa9tZYlT68kEtb4bMNtX76Uz3z2HCwroMH3UFt98O6rvlAQPd17+6s8BGPRhUUdbS3Bq8RJ/y9/wK8vvOQ87r77ChKDNuFQhKd/s4JXnnuZ5JRELr/6Unx+6Tcs3rc5Ihi0own6Ewj3RHj6yWdY/qf3MBgKC1O577tfZvrMaSiRTkzCzevfrPvW4iuLnb/Gviz+Ssfzf3xEzzvvupWBpMRDls+Zm5s/0D9l6jgqj5TT0NBOZUUju7btoqhkEEG/4sihekS5lqV8rugXCUVZu+pdRowcQnVFJb9/8gXqjnYAhjnnjuPm27/IwLxMRKwKdNYlF80tWvb2mif/Wlv6dB4JtWxV5RRRnX8wdA7r7gyz6vXVLF26Ji5PpyYn0N4WRlnw7YfuwEqwAU13aw8Pfutn+PwWkaiDMhaBgHDTLQuZNnOSewMWSauccNK1F58/qOqvvY9P5Vk0C+cUbOzuSp6OTvtdUlKiWXDJ+Xz3+1+iqDADZcSVlb2eohvMHbpauvnLG2tRYnAiGmUM06YV8cBDdzLz7GlYdjCsJOXb0Z60+Z8GUJ+aZcWOh374tpROLrxKSefDmkhOZ0eI1W+8zfPPvU00GkWwmDN/MgnJCax4ZR2hbrdBkZ7q55prL2Ty9InewJxvp+jUWy+cU7Tu01z/3+TJbC+vPDJIrI6fGhO5xIiRyooaXljyKhs2lsduJfdWp5k/fwoXLJhLRmYK4IsYE/gf28r67gWzs9o/7XX/zZ7599CPN0jp2PRLUZH/RnpKtCPs2raHpX94hcNHWph0On5dAAAAlklEQVQ6dQgXXXo+xSUF7j04Jvk9o+WrF80dvuFvtea/+dMkX3itItUX6PgmRL+mTTQxHIpScbiKwUNLUDaIseowwX9rbTKPLb5sxN/0iZJ/F4/eBHhxxZFRYvU8pKzui4x2lBJfyBjfY04o9d8vmZ9f9/ewxr8bsAAe/tkmKRmSNcvvdy6MRn2/uOT8wv383/H/5/H/ABu4Aj/fNP9HAAAAAElFTkSuQmCC'
    };
    const leagueDiv = s => { const m = String(s || '').match(/(\d+)\s*\.?\s*(?:Liga|Division|Klasse|Bundesliga)/i); return m ? m[1] : (/Ehrendivision|Premier League|Erste Liga|1st/i.test(s || '') ? '1' : ''); };
    const applyLeagueLogo = (country, leagueName) => {
      try {
        const div = leagueDiv(leagueName);
        const src = div && LEAGUE_LOGOS[(country || '').trim() + '|' + div];
        let img = title.querySelector('.os-league-logo');
        if (src) { if (!img) { img = document.createElement('img'); img.className = 'os-league-logo'; img.alt = ''; title.appendChild(img); } img.src = src; img.style.display = ''; }
        else if (img) { img.style.display = 'none'; }
      } catch (e) { }
    };

    const bar = el('div', 'os-ticker',
      `<button class="os-play">▶ Anpfiff starten</button>
       <div class="os-speed"><span>Tempo:</span>
         <button data-s="0.25">0,25×</button><button data-s="0.5" class="active">0,5×</button>
         <button data-s="0.75">0,75×</button><button data-s="1">1×</button><button data-s="2">2×</button><button data-s="4">4×</button></div>
       <button class="os-all">⏭ Alles zeigen</button>
       <button class="os-reset">⟲ Zurücksetzen</button>
       <label class="os-conf-toggle"><input type="checkbox" class="os-conf-chk"> Konferenz</label>
       <label class="os-conf-toggle"><input type="checkbox" class="os-mom-chk" checked> Momentum</label>
       <label class="os-conf-toggle"><input type="checkbox" class="os-sober-chk"> nüchtern</label>
       <label class="os-conf-toggle"><input type="checkbox" class="os-atmo-chk" checked> Atmosphäre</label>
       <label class="os-conf-toggle"><input type="checkbox" class="os-orig-chk"> Original</label>
       <span class="os-conf-status"></span>
       <span class="os-phase">bereit</span>
       <div class="os-seekwrap"><input type="range" class="os-seek" min="0" max="1" value="0" step="1"></div>`);

    // Anzeigetafel (Score-Board) – nur Logos, Torschützen (Heim links, Gast rechts)
    const board = el('div', 'os-board',
      `<div class="os-board-main">` +
        `<span class="team home">${logoTag(homeId)}</span>` +
        `<span class="scorebox"><span class="score">0 : 0</span></span>` +
        `<span class="team away">${logoTag(awayId)}</span>` +
      `</div>` +
      `<div class="os-board-goals"><div class="os-goals-home"></div><div class="os-goals-spacer"><span class="min"></span></div><div class="os-goals-away"></div></div>`);
    const scoreEl = board.querySelector('.score');
    const minEl = board.querySelector('.min');
    const goalHomeEl = board.querySelector('.os-goals-home');
    const goalAwayEl = board.querySelector('.os-goals-away');
    let goalMap = {};
    const setScoreBoard = (h, a, flash) => { scoreEl.textContent = h + ' : ' + a; if (flash) { board.classList.remove('flash'); void board.offsetWidth; board.classList.add('flash'); } };
    let momentumTo = () => {}, hideMarkers = () => {};
    const setMinBoard = m => { minEl.textContent = (m || m === 0) ? m + "'" : ''; momentumTo(typeof m === 'number' ? m : 0); };
    const clearGoalBoard = () => { goalHomeEl.innerHTML = ''; goalAwayEl.innerHTML = ''; goalMap = {}; };
    const addGoalToBoard = gi => {
      const key = (gi.home ? 'h:' : 'a:') + gi.scorer;
      const entry = goalMap[key];
      if (entry) {
        entry.mins.push(gi.min);
        entry.el.textContent = gi.scorer + ' ' + entry.mins.map(m => '(' + m + '.)').join(' ');
      } else {
        const d = document.createElement('div');
        d.className = 'os-goalitem';
        d.textContent = gi.scorer + ' (' + gi.min + '.)';
        (gi.home ? goalHomeEl : goalAwayEl).appendChild(d);
        goalMap[key] = { el: d, mins: [gi.min] };
      }
    };
    board.style.display = 'none';

    const INTRO = {"begr": ["Herzlich willkommen zum heutigen Aufeinandertreffen von {Heim} und {Gast}!", "Ein herzliches Willkommen zu diesem Spiel zwischen {Heim} und {Gast}.", "Willkommen im {Stadion} - heute empfängt {Heim} den {Gast}!", "Guten Abend aus dem {Stadion}, wo {Heim} heute auf {Gast} trifft!", "Die Bühne ist bereitet: {Heim} empfängt heute {Gast}.", "Schön, dass Sie dabei sind zum Duell {Heim} gegen {Gast}!", "Im {Stadion} steigt gleich die Partie zwischen {Heim} und {Gast}.", "Fußballzeit in {Stadt}: {Heim} misst sich mit {Gast}.", "Alles ist angerichtet für das Aufeinandertreffen von {Heim} und {Gast}.", "Wir begrüßen Sie zur Begegnung zwischen {Heim} und {Gast}.", "Das Warten hat ein Ende: {Heim} fordert heute {Gast}.", "Spannung liegt in der Luft vor dem Spiel {Heim} gegen {Gast}.", "Ein interessanter Vergleich steht bevor: {Heim} trifft auf {Gast}.", "Willkommen zur heutigen Partie der {Liga}!", "Im Fokus steht heute das Duell von {Heim} und {Gast}.", "Die Fans freuen sich auf {Heim} gegen {Gast}.", "Herzlich willkommen aus {Stadt} zum heutigen Spiel.", "Gleich beginnt die Begegnung zwischen {Heim} und {Gast}.", "Heute schauen wir auf das Kräftemessen von {Heim} und {Gast}.", "Beste Fußballunterhaltung verspricht dieses Duell.", "Die Mannschaften stehen bereit für einen spannenden Abend.", "Herzlich willkommen zur Live-Übertragung aus dem {Stadion}.", "Die Vorfreude ist groß vor dem Duell {Heim} gegen {Gast}.", "Ein packendes Spiel liegt vor uns.", "Heute empfängt {Heim} den Herausforderer {Gast}.", "Alle Augen richten sich auf diese Begegnung.", "Die Zuschauer warten gespannt auf den Anpfiff.", "Es erwartet uns heute eine knifflige Begegnung zwischen {Heim} und {Gast}", "Hier im {Stadion} freuen wir uns auf die Partie zwischen {Heim} und {Gast}"], "einordnung": ["Am {Spieltag}. Spieltag der {Liga} empfängt {Heim} den {Gast}.", "In der {Liga} steht der {Spieltag}. Spieltag an - {Heim} gegen {Gast}.", "Es ist der {Spieltag}. Spieltag: {Heim} fordert {Gast} heraus.", "Die Partie findet im Rahmen des {Spieltag}. Spieltags der {Liga} statt.", "Wichtige Punkte stehen am {Spieltag}. Spieltag der {Liga} auf dem Spiel.", "Der Ligaalltag schreibt heute das Kapitel {Heim} gegen {Gast}.", "Im Wettbewerb der {Liga} wartet ein interessantes Duell.", "Für beide Teams ist dieser Spieltag von großer Bedeutung.", "Die Saison nimmt Fahrt auf und der {Spieltag}. Spieltag steht an.", "Heute zählt jeder Punkt in der {Liga}.", "Die Begegnung ist Teil eines spannenden Spieltags.", "Am {Spieltag}. Spieltag kreuzen sich die Wege von {Heim} und {Gast}.", "Die {Liga} bietet heute erneut attraktive Paarungen.", "Mitten in der Saison treffen zwei ambitionierte Teams aufeinander.", "Die nächsten Zähler werden heute vergeben.", "Der Spielplan führt {Heim} und {Gast} zusammen.", "In der Tabelle könnte dieses Spiel wichtige Auswirkungen haben.", "Ein richtungsweisendes Duell am {Spieltag}. Spieltag.", "Die {Liga} hält heute diese Begegnung bereit.", "Für beide Klubs geht es um wertvolle Punkte.", "Der Wettbewerb wird intensiver, jeder Fehler kann zählen.", "Eine weitere spannende Etappe der {Liga} beginnt.", "Im Kampf um die Saisonziele steht heute viel auf dem Spiel.", "Die Ausgangslage verspricht ein interessantes Match.", "Die Saisongeschichte wird um ein weiteres Kapitel ergänzt.", "{Heim} und {Gast} wollen ihre Bilanz verbessern.", "Heute richtet sich der Blick auf dieses Ligaduell.", "Die Rahmenbedingungen für ein interessantes Spiel sind gegeben."], "kulisse": ["{Zuschauer} Zuschauer sorgen im {Stadion} fuer eine tolle Kulisse.", "Im gut gefuellten {Stadion} von {Stadt} sind heute {Zuschauer} Fans dabei.", "Vor {Zuschauer} Zuschauern steigt die Partie in {Stadt}.", "Die Ränge im {Stadion} sind bestens gefüllt.", "Aus {Stadt} wird eine stimmungsvolle Atmosphäre gemeldet.", "Die Fans beider Teams sorgen für einen lautstarken Rahmen.", "Das {Stadion} präsentiert sich in bester Fußballstimmung.", "Vor beeindruckender Kulisse wird gleich angepfiffen.", "Die Zuschauer erwarten ein packendes Spiel.", "Im Rund herrscht bereits große Vorfreude.", "Die Atmosphäre im Stadion ist elektrisierend.", "Viele Fans haben den Weg ins Stadion gefunden.", "Die Tribünen bilden einen würdigen Rahmen.", "Fußballfeststimmung in {Stadt}.", "Das Publikum macht sich bemerkbar.", "Die Kulisse könnte kaum besser sein.", "Ein starker Zuschauerzuspruch begleitet diese Partie.", "Die Fans stehen geschlossen hinter ihren Teams.", "Das Stadion bietet heute ein tolles Bild.", "Die Stimmung steigt mit jeder Minute.", "Die Zuschauer tragen ihren Teil zum Fußballabend bei.", "Hier ist alles bereit für einen besonderen Abend.", "Die Ränge sind voller Erwartung.", "Das Publikum fiebert dem Anpfiff entgegen.", "Eine lebhafte Atmosphäre prägt den Abend.", "Die Heimfans setzen bereits erste Akzente.", "Auch die Anhänger des {Gast} sind vertreten.", "Beste Bedingungen für ein Fußballspiel."], "trainer": ["Auf der Bank von {Heim} sitzt Trainer {TrainerH}, bei {Gast} {TrainerG}.", "{Heim} geht mit Coach {TrainerH} ins Spiel, {Gast} mit {TrainerG}.", "Die Trainer heute: {TrainerH} bei {Heim}, {TrainerG} beim {Gast}.", "Trainer {TrainerH} hat sein Team gut eingestellt.", "Aufseiten des {Gast} trägt {TrainerG} die Verantwortung.", "Zwei Trainer mit klaren Ideen treffen heute aufeinander.", "{TrainerH} und {TrainerG} stehen an der Seitenlinie im Mittelpunkt.", "Die taktische Handschrift beider Coaches dürfte sichtbar werden.", "Trainerduell: {TrainerH} gegen {TrainerG}.", "Beide Übungsleiter setzen auf ihre bewährten Kräfte.", "Die Marschroute kommt heute von {TrainerH} und {TrainerG}.", "Die Trainer haben ihre Mannschaften auf die Partie vorbereitet.", "Interessant wird sein, welche Anpassungen die Coaches vornehmen.", "Die Verantwortung an der Linie liegt bei erfahrenen Händen.", "Beide Trainer wollen ihrer Mannschaft wichtige Punkte sichern.", "Ein spannendes Kräftemessen auch auf der Bank.", "Die Personalentscheidungen der Trainer stehen fest.", "Nun müssen die Vorgaben auf dem Platz umgesetzt werden.", "Die Vorbereitung ist abgeschlossen, jetzt zählt die Umsetzung.", "Die Trainer vertrauen ihrer Startelf.", "An den Seitenlinien wird mitgefiebert.", "Die Strategen der Teams beobachten jede Aktion genau.", "Auch das Trainerduell verspricht Spannung.", "Die Handschrift der Coaches könnte spielentscheidend sein.", "Beide Teams folgen heute einem klaren Plan.", "Die Trainer haben die Qual der Wahl hinter sich.", "Nun geht es darum, die Strategie erfolgreich umzusetzen.", "Die Verantwortung liegt bei Spielern und Trainern gleichermaßen."], "taktik": ["{Heim} setzt auf eine {SpielweiseH} Ausrichtung bei {EinsatzH} Einsatz.", "Taktisch geht {Gast} {SpielweiseG} zu Werke ({EinsatzG} Einsatz).", "{Heim} ({SpielweiseH}, {EinsatzH}) trifft auf {Gast} ({SpielweiseG}, {EinsatzG}).", "{Gast} setzt auf eine {SpielweiseG} Spielanlage bei {EinsatzG} Einsatz.", "Beide Teams gehen mit klarer taktischer Ausrichtung ins Spiel.", "Die Herangehensweisen könnten unterschiedlicher kaum sein.", "Viel wird davon abhängen, welche Taktik besser greift.", "{Heim} möchte mit seiner {SpielweiseH} Ausrichtung Akzente setzen.", "Die Einsatzwerte deuten auf ein engagiertes Spiel hin.", "Taktische Disziplin dürfte heute ein Schlüssel sein.", "Die Balance zwischen Offensive und Defensive wird entscheidend.", "Beide Mannschaften haben einen klaren Matchplan.", "Die gewählte Spielweise verspricht interessante Duelle.", "Ein intensives Ringen um Kontrolle im Mittelfeld zeichnet sich ab.", "Wer seine Strategie konsequenter umsetzt, hat Vorteile.", "Die taktischen Vorgaben stehen fest.", "Nun wird sich zeigen, welches Konzept Erfolg bringt.", "Auch kleine Anpassungen können den Unterschied machen.", "Die Systeme der Teams treffen direkt aufeinander.", "Spannend wird, wie beide Mannschaften auf Rückschläge reagieren.", "Disziplin und Struktur sind gefragt.", "Die Ausrichtungen versprechen ein abwechslungsreiches Spiel.", "Beide Trainer vertrauen ihrer taktischen Idee.", "Die Spielweise könnte den Charakter der Partie prägen.", "Viele Augen richten sich auf die taktischen Feinheiten.", "Das Match bietet reichlich Stoff für Taktikfreunde.", "Die Mannschaften wollen ihre Stärken gezielt einbringen.", "Die Ausrichtung beider Teams ist klar erkennbar."], "spieler": ["Vorne soll es bei {Heim} {StuermerH} richten.", "Im Sturm des {Gast} ruhen die Hoffnungen auf {StuermerG}.", "Die Augen richten sich auf {StuermerH} und {StuermerG}.", "Auch Torhüter {TorwartH} könnte mit wichtigen Paraden zum Schlüsselspieler werden.", "Auf der Gegenseite steht Keeper {TorwartG} besonders im Fokus.", "{AbwehrH} soll der Defensive des {Heim} Stabilität verleihen.", "{AbwehrG} organisiert die Hintermannschaft des {Gast}.", "Im Mittelfeld werden die Impulse von {MittelfeldH} gefragt sein.", "{MittelfeldG} soll das Spiel des {Gast} lenken.", "Die Torhüter könnten heute eine entscheidende Rolle spielen.", "Die Zweikämpfe der Abwehrchefs versprechen Spannung.", "Im Zentrum könnte ein starker Auftritt der Mittelfeldstrategen den Unterschied machen.", "Nicht nur die Stürmer stehen heute im Rampenlicht.", "Die Defensivreihen bauen auf ihre Führungsspieler.", "Kreativität aus dem Mittelfeld könnte zum Erfolgsfaktor werden.", "Einzelne Aktionen von Schlüsselspielern können ein Spiel entscheiden.", "Die Stürmer stehen unter besonderer Beobachtung.", "Die Fans hoffen auf starke Auftritte ihrer Leistungsträger.", "Torgefahr ist auf beiden Seiten vorhanden.", "Die entscheidenden Momente können aus allen Mannschaftsteilen kommen.", "Offensive Qualität ist reichlich vorhanden.", "Auch die Defensivarbeit einzelner Akteure wird entscheidend sein.", "Heute könnten Torjäger, Spielmacher oder Torhüter zu Matchwinnern werden.", "Jede Chance und jede Parade kann große Bedeutung haben.", "Die Hoffnung ruht auf bewährten Kräften in allen Mannschaftsteilen.", "Vor dem Tor wird Effizienz gefragt sein.", "Die Leistungsträger möchten ihrer Mannschaft den Weg weisen.", "Die Schlüsselspieler stehen bereit."], "ausgangslage": ["Beide Teams blicken auf ihre aktuelle Formkurve.", "Die Tabellenlage erhöht die Bedeutung der Begegnung.", "Wer heute gewinnt, kann ein wichtiges Signal senden.", "Form und Selbstvertrauen spielen eine große Rolle.", "Die jüngsten Ergebnisse machen neugierig auf diese Partie.", "Ein Vergleich der aktuellen Leistungen verspricht Spannung.", "Beide Mannschaften wollen ihren Trend bestätigen.", "Die Positionen in der Tabelle könnten zusätzlichen Druck erzeugen.", "Jeder Punkt zählt in dieser Saisonphase.", "Die Ausgangslage wirkt ausgeglichen.", "Das Momentum könnte eine entscheidende Rolle spielen.", "Aktuelle Formwerte sprechen für ein enges Spiel.", "Die Teams möchten ihre Situation verbessern.", "Es geht auch darum, Selbstvertrauen zu sammeln.", "Ein Erfolgserlebnis wäre für beide Seiten wertvoll.", "Die bisherige Saison liefert eine interessante Ausgangsbasis.", "Heute bietet sich die Chance auf einen Schritt nach vorne.", "Die Formkurven könnten sich heute weiterentwickeln.", "Der Blick auf die Tabelle bleibt spannend.", "Beide Teams wollen den nächsten Erfolg verbuchen.", "Die aktuelle Entwicklung beider Mannschaften ist bemerkenswert.", "Das Duell hat auch tabellarisch Gewicht.", "Die Punkte könnten noch wichtig werden.", "Ein enger Vergleich vor dem Anpfiff.", "Die Voraussetzungen versprechen Ausgeglichenheit."], "storyline": ["Beide Mannschaften brauchen die Punkte - Spannung ist garantiert.", "Kann {Heim} vor eigenem Publikum bestehen? Gleich wissen wir mehr.", "Ein Duell mit vielen offenen Fragen - jetzt zaehlt es.", "Wer setzt heute das bessere Zeichen?", "Viele rechnen mit einer offenen Partie.", "Kleinigkeiten könnten den Ausschlag geben.", "Die Erwartungen an dieses Duell sind hoch.", "Beide Teams wollen ihre Ambitionen untermauern.", "Es geht um Prestige und wichtige Punkte.", "Ein intensiver Schlagabtausch ist zu erwarten.", "Die Spannung steigt von Minute zu Minute.", "Welche Mannschaft erwischt den besseren Start?", "Antworten gibt es gleich auf dem Platz.", "Das Momentum kann schnell wechseln.", "Die Voraussetzungen für einen spannenden Abend sind vorhanden.", "Kein Team wird etwas verschenken.", "Die Zuschauer dürfen sich auf Einsatz freuen.", "Die Partie ist schwer vorherzusagen.", "Viele Augen blicken gespannt auf dieses Duell.", "Ein enger Ausgang erscheint möglich.", "Diese Begegnung hat das Potenzial für Dramatik.", "Es liegt Spannung in der Luft.", "Beide Seiten wittern ihre Chance.", "Ein echter Härtetest wartet auf die Mannschaften.", "Die Bühne für ein interessantes Duell ist bereitet.", "Jetzt müssen Taten folgen.", "Der Countdown zum Anpfiff läuft.", "Gleich zeigt sich, wer besser vorbereitet ist."], "ueberleitung": ["Gleich rollt der Ball - viel Vergnuegen bei der Uebertragung!", "Die Mannschaften stehen bereit, es kann losgehen!", "Jetzt geht es los - Anpfiff!", "Die letzten Vorbereitungen laufen.", "Die Spieler haben ihre Positionen eingenommen.", "Der Anpfiff steht unmittelbar bevor.", "Es dauert nur noch Augenblicke.", "Alles ist angerichtet für 90 spannende Minuten.", "Die Spannung erreicht ihren Höhepunkt.", "Die Mannschaften betreten das Spielfeld.", "Jetzt richtet sich der Fokus auf das Geschehen am Ball.", "Die Fans sind bereit, die Teams ebenfalls.", "Gleich beginnt das Spiel.", "Die Voraussetzungen sind geschaffen.", "Es ist alles bereit für den ersten Pfiff.", "Die Wartezeit ist vorbei.", "Nun zählt nur noch das Geschehen auf dem Rasen.", "Das Spiel kann beginnen.", "Die letzten Anweisungen sind gegeben.", "In wenigen Momenten geht es los.", "Die Bühne gehört nun den Spielern.", "Es wird ernst.", "Der Fußballabend startet jetzt.", "Jetzt spricht der Ball.", "Die Begegnung steht in den Startlöchern.", "Wir wünschen beste Unterhaltung.", "Viel Spaß beim Mitfiebern.", "Auf geht’s in diese Partie."]};
    const greetingText = (ht, at) =>
      `Herzlich willkommen zum heutigen Spiel zwischen ${logoTag(homeId)}<b>${home}</b>${ht ? ` (Trainer: ${ht})` : ''} und ${logoTag(awayId)}<b>${away}</b>${at ? ` (Trainer: ${at})` : ''}! ` +
      (stadion ? `Wir befinden uns im <b>${stadion}</b>` : '') + (zuschauer ? `, und <b>${zuschauer}</b> Zuschauer sind heute dabei` : '') + '.';
    const greeting = el('div', 'os-act', `<div class="os-mod">${greetingText('', '')}</div>`);

    const lineupHtml = (teamName, role, cls, id) => `<h3 class="${cls}">${logoTag(id)}Die ${role} ${teamName} mit folgender Aufstellung</h3><ul class="os-lineup ${cls}"></ul>`;
    const homeBlock = el('div', 'os-act', lineupHtml(home, 'Heimmannschaft', 'home', homeId));
    const awayBlock = el('div', 'os-act', lineupHtml(away, 'Gästemannschaft', 'away', awayId));
    renderLineup(homeBlock, homeMap, null);
    renderLineup(awayBlock, awayMap, null);

    // Formation (Feld)
    const fieldAct = el('div', 'os-act', `<h3>Die Formationen auf dem Platz</h3>`);
    const fieldWrap = el('div', 'os-fieldwrap', `<div class="os-field"><div class="os-field-logo os-fl-home">${logoTag(homeId)}</div>${buildField()}<div class="os-field-logo os-fl-away">${logoTag(awayId)}</div></div>`);
    fieldAct.appendChild(fieldWrap);
    if (markers.length >= 16 && Object.keys(homeMap).length >= 5 && Object.keys(awayMap).length >= 5) {
      // Legenden-Vorkommen entfernen: senkrechte Stapel = viele Marker mit fast gleichem x.
      const bucket = {};
      markers.forEach(m => { const k = Math.round(m.cx / 8); (bucket[k] = bucket[k] || []).push(m); });
      let grid = markers.filter(m => bucket[Math.round(m.cx / 8)].length < 6);
      if (grid.length < 16) grid = markers; // Sicherheitsnetz
      const dedupe = arr => { const s = {}; return arr.filter(m => s[m.L] ? false : (s[m.L] = 1, true)); };
      const xs = grid.map(m => m.cx), midX = (Math.min(...xs) + Math.max(...xs)) / 2;
      const homeMks = dedupe(grid.filter(m => m.cx < midX));
      const awayMks = dedupe(grid.filter(m => m.cx >= midX));
      // Spaltenbreite (px pro Rasterspalte) aus beiden Blöcken schätzen – kleinster Spaltenabstand.
      const colWidthOf = mks => {
        const u = [...new Set(mks.map(m => Math.round(m.cx)))].sort((a, b) => a - b);
        let best = Infinity;
        for (let i = 1; i < u.length; i++) { const g = u[i] - u[i - 1]; if (g > 3 && g < best) best = g; }
        return best;
      };
      const colW = Math.min(colWidthOf(homeMks), colWidthOf(awayMks));
      const STEP = 7.5; // % Feldbreite pro Rasterspalte (für beide Teams gleich!)
      const place = (mks, map, isHome) => {
        const gk = mks.find(m => m.L === 'T'), outp = mks.filter(m => m.L !== 'T');
        const gkCy = gk ? gk.cy : Math.max(...mks.map(m => m.cy));
        const gkCx = gk ? gk.cx : (Math.min(...outp.map(m => m.cx)) + Math.max(...outp.map(m => m.cx))) / 2;
        const pmax = Math.max(1, Math.max(...outp.map(m => Math.abs(m.cy - gkCy))));
        const cw = isFinite(colW) ? colW : 1;
        const clampX = v => Math.max(8, Math.min(92, v));
        const field = fieldWrap.querySelector('.os-field');
        const addChip = (name, x, y, extra) => {
          if (!name) return;
          const c = el('div', 'os-chip ' + (isHome ? 'home' : 'away') + (extra ? ' ' + extra : ''));
          c.style.left = x + '%'; c.style.top = y + '%';
          c.setAttribute('data-player', name); c.title = name;
          c.innerHTML = `<span class="os-name">${surname(name)}</span>`;
          field.appendChild(c);
        };
        // Echte Spalte (relativ zum Torwart = Mitte) und Zeile übernehmen.
        outp.forEach(m => {
          if (!map[m.L]) return;
          const p = Math.abs(m.cy - gkCy) / pmax;                     // 0 = tief .. 1 = vorne
          const colOff = Math.round((m.cx - gkCx) / cw);              // Spaltenversatz zur Mitte
          const x = clampX(50 + colOff * STEP);
          const y = isHome ? (9 + p * 37) : (91 - p * 37);
          const fb = p < 0.34 ? 'p-ABW' : (p < 0.7 ? 'p-MIT' : 'p-STU'); // grobe Farbe nach Tiefe
          (isHome ? posFB.home : posFB.away)[m.L] = fb.slice(2);
          addChip(map[m.L], x, y, fb);
        });
        if (gk) { (isHome ? posFB.home : posFB.away)['T'] = 'TOR'; addChip(map['T'], 50, isHome ? 4 : 96, 'gk p-TOR'); }
      };
      place(homeMks, homeMap, true);
      place(awayMks, awayMap, false);
      renderLineup(homeBlock, homeMap, null, posFB.home);
      renderLineup(awayBlock, awayMap, null, posFB.away);
    }

    // Taktik-Gegenüberstellung
    const tacNum = s => { const n = parseFloat(String(s).replace('%', '').replace(',', '.')); return isNaN(n) ? 0 : n; };
    const tacRow = (label, v) => `<tr><td class="l">${label}</td><td>${v[0] || '–'}</td><td>${v[1] || '–'}</td></tr>`;
    const tacGroup = t => `<tr class="os-tac-group"><td colspan="3">${t}</td></tr>`;
    const tacBar = (label, v) => {
      const h = tacNum(v[0]), a = tacNum(v[1]), mx = Math.max(h, a, 1);
      const hp = Math.round(h / mx * 100), ap = Math.round(a / mx * 100);
      return `<tr class="os-tac-barrow"><td class="l">${label}</td><td colspan="2"><div class="os-tac-cmp">`
        + `<span class="v ${h >= a ? 'hi' : ''}">${v[0] || '–'}</span>`
        + `<div class="bar h"><span style="width:${hp}%"></span></div>`
        + `<div class="bar a"><span style="width:${ap}%"></span></div>`
        + `<span class="v ${a >= h ? 'hi' : ''}">${v[1] || '–'}</span></div></td></tr>`;
    };
    const tactics = el('div', 'os-act',
      `<h3>Gegenüberstellung der taktischen Ausrichtung</h3>
       <table class="os-tac"><thead><tr><th class="l">Merkmal</th>` +
      `<th><div class="os-tac-th">${logoTag(homeId)}<span>${home}</span></div></th>` +
      `<th><div class="os-tac-th">${logoTag(awayId)}<span>${away}</span></div></th></tr></thead><tbody>` +
      tacGroup('Grundausrichtung') +
      tacRow('Einsatz', getV(S, 'Einsatz')) +
      tacRow('Härte', getV(S, 'Härte')) +
      tacRow('Spielweise', getV(S, 'Spielweise')) +
      tacGroup('Mannschaftsteile') +
      tacRow('Ausrichtung – Sturm', getV(S, 'Sturm')) +
      tacRow('Ausrichtung – Mittelfeld', getV(S, 'Mittelfeld')) +
      tacRow('Ausrichtung – Abwehr', getV(S, 'Abwehr')) +
      tacGroup('Individuelle Qualität') +
      tacBar('Skill (Ø)', getV(V, 'Schnitt Skill')) +
      tacBar('Opt. Skill (Ø)', getV(V, 'Opt.Skill')) +
      `</tbody></table>`);

    const preAct = el('div', 'os-act', `<h3>Vor dem Anpfiff</h3><div class="os-mod">…</div>`);
    const kickoff = el('div', 'os-act', `<div class="os-mod">Dann pfeift der Schiedsrichter das Spiel an – und <b>los geht’s!</b></div>`);
    const matchTitle = el('div', 'os-act', `<h3>Spielverlauf</h3>`);
    const statsTitle1 = el('div', 'os-act', `<h3>Schlusspfiff – die Spielstatistiken</h3>`);
    const statsTitle2 = el('div', 'os-act', `<h3>Die Spielerstatistiken</h3>`);
    const playerStatsAct = el('div', 'os-act os-ps-act', `<h3>Die Spielerstatistiken</h3><div class="os-ps-body"></div>`);
    const elevenAct = el('div', 'os-act os-el-act', `<h3>⭐ Elf des Tages</h3><div class="os-el-body"></div>`);
    elevenAct.style.display = 'none';
    let gHData = null, gAData = null;
    // Spieler-Statistik: Zeilen aus der Tabelle lesen (Heim links, Gast rechts/gespiegelt)
    const parsePlayerTable = tbl => {
      if (!tbl) return { home: [], away: [] };
      const rows = [...tbl.querySelectorAll('tr')];
      if (rows.length < 2) return { home: [], away: [] };
      const head = [...rows[0].children].map(c => (c.textContent || '').trim());
      const n2 = t => t.toLowerCase().replace(/[\s.]/g, '');
      const idxs = pred => head.map((t, i) => pred(n2(t)) ? i : -1).filter(i => i >= 0);
      const nm = idxs(t => t === 'spielername'), no = idxs(t => t === 'note'), zk = idxs(t => t === 'zk'), zkp = idxs(t => /zk/.test(t) && /%/.test(t)), sh = idxs(t => t === 'schüsse' || t === 'schuesse'), ot = idxs(t => /aufstor/.test(t)), to = idxs(t => t === 'tore'), vo = idxs(t => t === 'vorlagen');
      const data = rows.slice(1).filter(r => r.children.length >= head.length && !/summe|gesamt|schnitt|durchschnitt/i.test(r.textContent));
      const cT = (r, i) => (i >= 0 && r.children[i]) ? (r.children[i].textContent || '').trim() : '';
      const mk = (r, s) => ({ name: cT(r, nm[s]), note: cT(r, no[s]), zk: cT(r, zk[s]), zkp: cT(r, zkp[s]), shots: cT(r, sh[s]), onTarget: cT(r, ot[s]), goals: cT(r, to[s]), assists: cT(r, vo[s]) });
      const home = [], away = [];
      data.forEach(r => { const h = mk(r, 0); if (h.name) home.push(h); if (nm.length > 1) { const a = mk(r, 1); if (a.name) away.push(a); } });
      return { home, away };
    };
    const parsePlayerRows = () => parsePlayerTable(tblPlayer);
    const psRows = parsePlayerRows();
    const pcards = {}, psaves = {}, subInfo = [];
    const sn = n => norm(surname(n || ''));
    const findPlayerInText = t => { const names = [...Object.values(homeMap || {}), ...Object.values(awayMap || {})].filter(Boolean); for (const nm of names) { const s = surname(nm); if (s && t.indexOf(s) >= 0) return nm; } return null; };
    const teamOf = name => { const nn = norm(name); for (const l in homeMap) if (homeMap[l] && norm(homeMap[l]) === nn) return 'h'; for (const l in awayMap) if (awayMap[l] && norm(awayMap[l]) === nn) return 'a'; for (const si of subInfo) if (si.in && norm(si.in) === nn) return si.side; return null; };
    const allKnownPlayers = () => { const list = []; for (const l in homeMap) if (homeMap[l]) list.push({ name: homeMap[l], side: 'h' }); for (const l in awayMap) if (awayMap[l]) list.push({ name: awayMap[l], side: 'a' }); for (const si of subInfo) if (si.in) list.push({ name: si.in, side: si.side }); return list; };
    const cardPlayerSide = line => {
      const found = [];
      for (const p of allKnownPlayers()) { const s = surname(p.name); if (s) { const i = line.indexOf(s); if (i >= 0) found.push({ p, i }); } }
      if (!found.length) return null;
      found.sort((a, b) => a.i - b.i);
      let victimI = -1;
      const vm = line.match(/Foul (?:an|gegen)\s+/i);
      if (vm) { const after = vm.index + vm[0].length; const cand = found.filter(f => f.i >= after - 1); if (cand.length) victimI = cand[0].i; }
      const carded = found.find(f => f.i !== victimI) || found[0];
      return carded.p;
    };
    const rowLinesOf = r => { const c = [...r.children].find(x => (x.textContent || '').trim().length > 12); return c ? c.innerHTML.split(/<br\s*\/?>/i).map(s => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()) : [txt(r)]; };
    const posOfPS = (name, tData, letterMap, fbMap) => {
      const p = tData && tData.players ? tData.players[norm(name)] : null;
      if (p && p.pos) return p.pos;
      for (const l in letterMap) { if (letterMap[l] && norm(letterMap[l]) === norm(name)) return (fbMap && fbMap[l]) || ''; }
      return '';
    };
    // Spieler-Note 1–10 (1=schlecht, 10=sehr gut), positionsabhängig gewichtet, auf 0,5 gerundet
    const rating = (pos, s) => {
      let r = 5.5;
      const duel = s.zkp != null ? (s.zkp - 50) / 12 : 0;
      let pd = 0;
      if (s.passN) { const pq = s.passOk / s.passN; pd += (pq - 0.8) * (Math.min(s.passN, 40) / 40) * 1.2; }
      if (s.dribN) { const dq = s.dribOk / s.dribN; pd += (dq - 0.4) * Math.min(s.dribN, 8) * 0.08; }
      pd = Math.max(-0.6, Math.min(0.6, pd));
      if (pos === 'TOR') {
        r = 5.5 + s.saves * 0.4 - s.conceded * 0.5;
        if (s.conceded === 0 && s.minutes >= 60) r += 1.5;
      } else if (pos === 'ABW' || pos === 'DMI') {
        r += duel * 0.7 + Math.min(s.zk, 18) * 0.04 + s.goals * 1.1 + s.assists * 0.8 - s.teamConceded * 0.2 + pd;
      } else if (pos === 'MIT' || pos === 'OMI') {
        r += duel * 0.55 + s.assists * 1.1 + s.goals * 1.0 + Math.min(s.zk, 22) * 0.03 + s.onTarget * 0.13 + pd;
      } else {
        r += s.goals * 1.15 + s.assists * 0.8 + s.onTarget * 0.18 + duel * 0.3 + pd;
      }
      r -= s.yellow * 0.3;
      // Schwere Negativ-Ereignisse als ABZÜGE (eine starke Gesamtleistung kann gegenrechnen)
      if (s.red > 0) r -= 3.5;
      if (s.missedPen) r -= 1.5;
      if (s.zkp != null && s.zkp <= 10 && s.zk >= 5) r -= 2.5;
      if (s.passN >= 8 && s.passOk / s.passN <= 0.10) r -= 2.5;
      if (s.dribN >= 4 && s.dribOk / s.dribN <= 0.10) r -= 1.5;
      if (pos === 'TOR' && s.saves === 0 && s.conceded >= 4) r -= 1.0;
      if (s.minutes < 30) r = 5.5 + (r - 5.5) * 0.6;
      r = Math.max(1, Math.min(10, r));
      return Math.round(r * 2) / 2;
    };
    let sceneStats = {};
    const findNamesInLine = line => {
      const all = allKnownPlayers().map(p => p.name).filter(Boolean).sort((a, b) => b.length - a.length);
      const fp = [];
      all.forEach(nm => { const i = line.indexOf(nm); if (i >= 0) fp.push({ i, nm }); });
      fp.sort((a, b) => a.i - b.i);
      const out = [], taken = [];
      fp.forEach(({ i, nm }) => { if (taken.some(t => i >= t[0] && i < t[1])) return; out.push({ i, nm }); taken.push([i, i + nm.length]); });
      out.sort((a, b) => a.i - b.i); return out;
    };
    const afterKw = (line, fp, re) => { const m = line.match(re); if (!m) return ''; for (const f of fp) { if (f.i > m.index) return f.nm; } return ''; };
    const parseSceneLine = (L, nextL) => {
      const fp = findNamesInLine(L); const p1 = fp[0] ? fp[0].nm : '', p2 = fp[1] ? fp[1].nm : '';
      const R = { akteur: p1, gegner: '', ziel: '', typ: '', dribbling: false, zksieger: '', erfolg: '', pass: false };
      if (/^Anpfiff|^Halbzeit|^Abpfiff|Neuer Spielstand|kassiert.*Kart|wechselt:|kommt für|ändert (Spielweise|Einsatz)|ABSEITS|^Der Ball landet beim Keeper/.test(L)) { R.akteur = ''; return R; }
      if (/wird von .* gefällt/.test(L)) { return Object.assign(R, { akteur: afterKw(L, fp, /\bvon\b/), gegner: p1, typ: 'Foul', erfolg: 'negativ' }); }
      if (/Foul von .* an /.test(L)) { return Object.assign(R, { akteur: afterKw(L, fp, /Foul von/), gegner: afterKw(L, fp, /\ban\b/), typ: 'Foul', erfolg: 'negativ' }); }
      if (/ein Bein/.test(L) && /FREISTOSS/.test(L)) { return Object.assign(R, { akteur: p1, gegner: p2, typ: 'Foul', erfolg: 'negativ' }); }
      let shot = false;
      if (/köpft|Kopfball/.test(L) && !/weg|Gefahrenzone|klärt/.test(L)) shot = true;
      else if (/schiesst|zieht ab|\bSchuss\b|Schlenzer|Flatterball|Strammer (Links|Rechts)schuß|Harter Schuss|Ein Schuss von/.test(L)) shot = true;
      if (/Beinschuss/.test(L)) shot = false;
      if (shot) return Object.assign(R, { akteur: p1, typ: 'Abschluss' });
      if (/^Ecke:/.test(L)) return Object.assign(R, { akteur: p1, typ: 'Standard' });
      if (/flankt/.test(L)) return Object.assign(R, { akteur: p1, typ: 'Flanke', erfolg: 'positiv', pass: true });
      if (/versetzt .* mit einem Übersteiger|lässt .* wie einen Schuljungen stehen|mit einem gelungenen Dribbling überspielen|verlädt .* mit einer gelungenen Körpertäuschung|tankt sich .* durch/.test(L))
        return Object.assign(R, { akteur: p1, gegner: p2, typ: 'Dribbling', dribbling: true, zksieger: p1, erfolg: 'positiv' });
      if (/verstolpert den Ball bei einem versuchten Dribbling/.test(L))
        return Object.assign(R, { akteur: p1, gegner: '', typ: 'Dribbling', dribbling: true, zksieger: '', erfolg: 'negativ' });
      if (/kann .* nicht mit einem Übersteiger versetzen|kann .* nicht umspielen|kann .* nicht überspielen|versucht vergeblich eine Körpertäuschung|versucht vergeblich den Ball über .* zu heben/.test(L)) {
        const g = p2 || afterKw(L, fp, /\b(bei|über)\b/); return Object.assign(R, { akteur: p1, gegner: g, typ: 'Dribbling', dribbling: true, zksieger: g, erfolg: 'negativ' });
      }
      if (/lässt .* nicht vorbei/.test(L)) return Object.assign(R, { akteur: p2, gegner: p1, typ: 'Dribbling', dribbling: true, zksieger: p1, erfolg: 'negativ' });
      if (/Beinschuss/.test(L) && /hat aufgepasst/.test(L)) { const g = afterKw(L, fp, /\baber\b/) || p2; return Object.assign(R, { akteur: p1, gegner: g, typ: 'Dribbling', dribbling: true, zksieger: g, erfolg: 'negativ' }); }
      if (/verpasst/.test(L) && /Beinschuss/.test(L)) return Object.assign(R, { akteur: p1, gegner: p2, typ: 'Dribbling', dribbling: true, zksieger: p1, erfolg: 'positiv' });
      if (/erkämpft sich den Ball/.test(L)) return Object.assign(R, { akteur: p1, typ: 'Zweikampf', zksieger: p1, erfolg: 'positiv' });
      let typ = '';
      if (/langem Pass|langen Ball|lang zu|passt lang|per langem|einen langen Ball|spielt den Ball lang|spielt einen langen Ball/.test(L)) typ = 'Passspiel lang';
      else if (/Kurzpass|kurzen Pass|kurzer Ball|kurzen Ball|kurz zu|per Kurzpass|einen kurzen Ball|spielt den Ball kurz/.test(L)) typ = 'Passspiel kurz';
      else if (/spielt den Ball zu|passt den Ball direkt|passt .* auf|spielt .* zu/.test(L)) typ = 'Passspiel kurz';
      if (typ) {
        const ziel = afterKw(L, fp, /\b(zu|auf|für)\b/);
        let neg = /landet hinter dem Tor|ins Aus|geht an Freund und Feind|Verunglückt|landet beim Gegner|Ein Gegner kann erfolgreich stören/.test(L);
        if (!neg && (/erkämpft sich den Ball/.test(nextL) || /ABSEITS/.test(nextL))) neg = true;
        return Object.assign(R, { akteur: p1, ziel, typ, pass: true, erfolg: neg ? 'negativ' : 'positiv' });
      }
      return R;
    };
    function computeSceneStats() {
      const stats = {}; const S = k => (stats[k] = stats[k] || { pass: 0, passOk: 0, duel: 0, duelWon: 0, drib: 0, dribOk: 0, penMissed: false });
      const lines = [];
      const odoc = new DOMParser().parseFromString(osOriginalHTML || '', 'text/html');
      const otbl = [...odoc.querySelectorAll('table')].find(t => /Anpfiff/.test(t.textContent));
      if (otbl) otbl.querySelectorAll('tr').forEach(tr => {
        const cell = [...tr.children].find(x => (x.textContent || '').trim().length > 12) || tr.children[tr.children.length - 1];
        const parts = cell ? cell.innerHTML.split(/<br\s*\/?>/i).map(s => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean) : [];
        parts.forEach(p => { if (p.length > 3) lines.push(p); });
      });
      for (let i = 0; i < lines.length; i++) {
        const A = parseSceneLine(lines[i], lines[i + 1] || '');
        if (A.pass && A.akteur) { const k = sn(A.akteur); S(k).pass++; if (A.erfolg === 'positiv') S(k).passOk++; }
        if (A.dribbling && A.akteur) { const k = sn(A.akteur); S(k).drib++; if (A.erfolg === 'positiv') S(k).dribOk++; }
        if (A.typ === 'Dribbling' || A.typ === 'Zweikampf') {
          if (A.akteur) { const k = sn(A.akteur); S(k).duel++; if (A.zksieger === A.akteur) S(k).duelWon++; }
          if (A.gegner && A.gegner !== 'GEGENSPIELER') { const k = sn(A.gegner); S(k).duel++; if (A.zksieger === A.gegner) S(k).duelWon++; }
        }
        if (/ELFMETER/i.test(lines[i])) {
          const nx = lines[i + 1] || '';
          if (nx && !/\bTOR\b/.test(nx)) { const sh = findNamesInLine(nx)[0]; if (sh) S(sn(sh.nm)).penMissed = true; }
        }
      }
      return stats;
    }
    const psSection = (teamName, teamId, rows, tData, letterMap, fbMap, teamIsHome, pmin, endMin) => {
      if (!rows || !rows.length) return '';
      const gc = teamIsHome ? (score ? score.a : 0) : (score ? score.h : 0);
      const num = s => { const n = parseFloat(String(s).replace(',', '.')); return isNaN(n) ? 0 : n; };
      const z = v => (v && String(v) !== '0') ? v : '';
      const enr = rows.map(r => {
        const p = tData && tData.players ? tData.players[norm(r.name)] : null;
        let pos = p && p.pos ? p.pos : '';
        if (!pos) { for (const l in letterMap) { if (letterMap[l] && norm(letterMap[l]) === norm(r.name)) { pos = (fbMap && fbMap[l]) || ''; break; } } }
        const skill = (p && p.skill) || '', opt = (p && p.opt) || '';
        const key = sn(r.name);
        const min = pmin[key] != null ? pmin[key] : endMin;
        const card = pcards[key] || { y: 0, r: 0 };
        const saves = psaves[key] || 0;
        const ss = sceneStats[key] || { pass: 0, passOk: 0, duel: 0, duelWon: 0, drib: 0, dribOk: 0 };
        const passPct = ss.pass ? Math.round(ss.passOk / ss.pass * 100) + '%' : '';
        const dribPct = ss.drib ? Math.round(ss.dribOk / ss.drib * 100) + '%' : '';
        const st = { pos, goals: num(r.goals), assists: num(r.assists), shots: num(r.shots), onTarget: num(r.onTarget), zk: num(r.zk), zkp: r.zkp ? num(r.zkp) : null, yellow: card.y, red: card.r, minutes: min, saves, conceded: gc, teamConceded: gc, passN: ss.pass, passOk: ss.passOk, dribN: ss.drib, dribOk: ss.dribOk, missedPen: ss.penMissed };
        return Object.assign({}, r, { pos, skill, opt, min, card, saves, _pass: ss.pass || '', _passpct: passPct, _drib: ss.drib || '', _dribpct: dribPct, note: rating(pos, st) });
      });
      const byPos = (a, b) => ((a.pos in POSORD ? POSORD[a.pos] : 9) - (b.pos in POSORD ? POSORD[b.pos] : 9));
      const gks = enr.filter(p => p.pos === 'TOR'), out = enr.filter(p => p.pos !== 'TOR').sort(byPos);
      const nme = p => `<span class="os-pos p-${p.pos || 'MIT'}">${p.pos || '–'}</span> ${boldSurname(p.name)}<span class="os-ps-so">${p.skill ? ' – ' + p.skill : ''}${p.opt ? ' – ' + p.opt : ''}</span>`;
      const noteTd = n => `<td class="os-note ${n >= 8 ? 'os-note-hi' : n <= 4 ? 'os-note-lo' : ''}">${n % 1 === 0 ? n : n.toFixed(1)}</td>`;
      const cardY = p => (p.card.y === 1 && !p.card.r) ? thY : '';
      const cardR = p => {
        if (p.card.r > 0) return `<span class="os-card os-card-r"></span>${p.card.r > 1 ? '<span class="os-card-n">' + p.card.r + '</span>' : ''}`;
        if (p.card.y >= 2) return '<span class="os-card os-card-yr" title="Gelb-Rote Karte"></span>';
        return '';
      };
      const thY = '<span class="os-card os-card-y"></span>', thR = '<span class="os-card os-card-r"></span>';
      const cgShared = '<col class="c-name"><col class="c-note"><col class="c-min"><col class="c-tore"><col class="c-vorl"><col class="c-card"><col class="c-card">';
      const cgFull = cgShared + '<col><col><col><col><col class="c-pass"><col class="c-pass"><col class="c-pass"><col class="c-pass">';
      let gkT = '';
      if (gks.length) gkT = `<table class="os-pst"><colgroup>${cgFull}</colgroup><thead><tr><th class="l">Torwart</th><th>Note</th><th>Min</th><th>GegT</th><th>Par.</th><th>${thY}</th><th>${thR}</th><th></th><th></th><th></th><th></th><th>Pässe</th><th>Pass%</th><th>Dribb.</th><th>Dr%</th></tr></thead><tbody>`
        + gks.map(p => `<tr><td class="l">${nme(p)}</td>${noteTd(p.note)}<td>${p.min}'</td><td>${gc}</td><td>${z(p.saves)}</td><td>${cardY(p)}</td><td>${cardR(p)}</td><td></td><td></td><td></td><td></td><td>${p._pass}</td><td>${p._passpct}</td><td>${p._drib}</td><td>${p._dribpct}</td></tr>`).join('') + `</tbody></table>`;
      const ofT = `<table class="os-pst"><colgroup>${cgFull}</colgroup><thead><tr><th class="l">Spieler</th><th>Note</th><th>Min</th><th>Tore</th><th>Vorl.</th><th>${thY}</th><th>${thR}</th><th>ZK</th><th>ZK%</th><th>Sch.</th><th>a.T.</th><th>Pässe</th><th>Pass%</th><th>Dribb.</th><th>Dr%</th></tr></thead><tbody>`
        + out.map(p => `<tr><td class="l">${nme(p)}</td>${noteTd(p.note)}<td>${p.min}'</td><td>${z(p.goals)}</td><td>${z(p.assists)}</td><td>${cardY(p)}</td><td>${cardR(p)}</td><td>${z(p.zk)}</td><td>${p.zkp ? p.zkp : ''}</td><td>${z(p.shots)}</td><td>${z(p.onTarget)}</td><td>${p._pass}</td><td>${p._passpct}</td><td>${p._drib}</td><td>${p._dribpct}</td></tr>`).join('') + `</tbody></table>`;
      return `<div class="os-ps-team"><div class="os-ps-head">${logoTag(teamId)}<span class="os-ps-name">${teamName}</span></div><div class="os-pst-wrap">${gkT}${ofT}</div></div>`;
    };
    const buildPlayerStats = (hd, ad) => {
      const body = playerStatsAct.querySelector('.os-ps-body'); if (!body) return;
      try { sceneStats = computeSceneStats(); } catch (e) { console.warn('[OS] Szenen-Statistik fehlgeschlagen:', e); sceneStats = {}; }
      const endMin = Math.max(maxMin, 90), pmin = {};
      [...Object.values(homeMap || {}), ...Object.values(awayMap || {})].filter(Boolean).forEach(nm => { pmin[sn(nm)] = endMin; });
      subInfo.forEach(si => { if (si.out) pmin[sn(si.out)] = si.min; if (si.in) pmin[sn(si.in)] = Math.max(0, endMin - si.min); });
      const html = psSection(home, homeId, psRows.home, hd, homeMap, posFB.home, true, pmin, endMin) + psSection(away, awayId, psRows.away, ad, awayMap, posFB.away, false, pmin, endMin);
      body.innerHTML = html || 'Keine Spielerdaten gefunden.';
      attachLogoErrors();
    };

    // ---- Präsentationscontainer aufbauen ----
    const stage = el('div', 'os-stage');
    const anchor = header || document.body.firstElementChild;
    (anchor.parentNode || document.body).insertBefore(title, anchor ? anchor.nextSibling : null);
    const sticky = el('div', 'os-sticky'); sticky.appendChild(bar); sticky.appendChild(board);
    title.after(sticky); sticky.after(stage);
    attachLogoErrors();

    // Reihenfolge im Stage
    [greeting, homeBlock, awayBlock, fieldAct, tactics, preAct, kickoff, matchTitle].forEach(n => stage.appendChild(n));
    if (tblReport) stage.appendChild(tblReport);
    stage.appendChild(statsTitle1); if (tblStat) stage.appendChild(tblStat);
    stage.appendChild(statsTitle2); if (tblPlayer) stage.appendChild(tblPlayer);
    stage.appendChild(playerStatsAct);
    stage.appendChild(elevenAct);
    const origBox = el('div', 'os-origbox', osOriginalHTML || '<i>Original nicht verfügbar.</i>');
    origBox.style.display = 'none';
    stage.after(origBox);

    // ---- Originale ausblenden ----
    const hide = n => { if (n) n.style.display = 'none'; };
    auf.forEach(hide);                 // Buchstaben-Raster + Legende
    hide(tblStart);                    // durch eigene Taktik-Tabelle ersetzt
    if (header) hide(header);
    // Überschriften / Intro / Meta ausblenden
    const killTexts = ['Hier zuerst die taktischen', 'Es folgen die Starteinstellungen', 'Es folgt der Spielbericht', 'Es folgen die Spielstatistiken', 'Es folgen die Spielerstatistiken', 'Datum :'];
    document.querySelectorAll('p, strong, b, span, div, h1, h2, h3, h4, td').forEach(n => {
      if (n.closest('.os-stage') || n.closest('.os-ticker') || n.closest('.os-title')) return;
      const t = txt(n);
      if (t.length && t.length < 130 && killTexts.some(k => t.indexOf(k) === 0 || t === k)) n.style.display = 'none';
    });

    // Original-Aufstellung (Buchstaben-Raster UND linke Namensliste) robust ausblenden.
    // Prinzip: Von einem Aufstellungs-Element aus so weit hochklettern wie möglich,
    // ohne meine eigene Anzeige (Titel/Leiste/Bühne) oder Bericht/Statistik zu erfassen –
    // und diesen größten "sicheren" Block ausblenden.
    const protectedEls = [title, bar, stage, tblReport, tblStat, tblPlayer].filter(Boolean);
    const isSafe = n => n && n !== document.body && n !== document.documentElement &&
      !protectedEls.some(f => n === f || n.contains(f));
    const hideBiggestSafe = elm => {
      if (!elm || (elm.closest && elm.closest('.os-stage, .os-ticker, .os-title'))) return;
      let n = elm, last = null;
      while (n && isSafe(n)) { last = n; n = n.parentElement; }
      if (last) last.style.display = 'none';
    };

    // (a) alle Einzelbuchstaben (Raster/Legende)
    document.querySelectorAll('b, strong, font, span, div, li, tr, p, td').forEach(elm => {
      const t = txt(elm);
      if (t.length === 1 && /[A-Za-z]/.test(t)) hideBiggestSafe(elm);
    });
    // (b) alle Original-Elemente, die exakt einen Spielernamen (oder Nachnamen) enthalten
    const names = new Set();
    [...Object.values(homeMap), ...Object.values(awayMap)].forEach(nm => {
      if (!nm) return; const p = nm.trim().split(/\s+/); names.add(nm.trim()); if (p.length > 1) names.add(p[p.length - 1]);
    });
    document.querySelectorAll('span, div, li, tr, p, font, b, strong, td, a').forEach(elm => {
      if (elm.closest('.os-stage, .os-ticker, .os-title')) return;
      if (elm.children.length > 2) return;
      const t = txt(elm);
      if (t && t.length < 45 && names.has(t)) hideBiggestSafe(elm);
    });

    // Alles im Stage zunächst verbergen
    const acts = [greeting, homeBlock, awayBlock, fieldAct, tactics, preAct, kickoff, matchTitle, tblReport, statsTitle1, tblStat, statsTitle2, tblPlayer, playerStatsAct, elevenAct].filter(Boolean);
    let broadcastEnded = false;
    acts.forEach(a => a.style.display = 'none');
    const reportRows = tblReport ? [...tblReport.querySelectorAll('tr')].filter(tr => txt(tr)) : [];
    reportRows.forEach(r => r.style.display = 'none');

    // ---- Ablauf-Jobs ----
    const phase = bar.querySelector('.os-phase');
    const playBtn = bar.querySelector('.os-play');
    const speedBtns = [...bar.querySelectorAll('.os-speed button')];
    let seeking = false;
    const scrollTo = n => { if (seeking) return; try { n.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (_) {} };
    const clearCur = () => reportRows.forEach(r => { r.classList.remove('os-live-current'); r.classList.remove('os-shot'); });
    const showEl = n => { if (n) n.style.display = ''; };

    const jobs = [];
    const act = (n, label, delay) => jobs.push({ label, delay, run: () => { showEl(n); scrollTo(n); } });
    act(greeting, 'Begrüßung', 3000);
    act(homeBlock, 'Aufstellung Heim', 2600);
    act(awayBlock, 'Aufstellung Gast', 2600);
    act(fieldAct, 'Formation', 3200);
    act(tactics, 'Taktik', 3800);
    act(preAct, 'Vor dem Anpfiff', 4200);
    act(kickoff, 'Anpfiff', 2400);
    jobs.push({ label: 'Anpfiff', delay: 500, run: () => { board.style.display = ''; showEl(matchTitle); showEl(tblReport); scrollTo(matchTitle); } });

    // ---- Kommentator-Engine ----
    const makeCommentRow = (html, extra) => {
      const tr = document.createElement('tr');
      tr.className = 'os-comment' + (extra ? ' ' + extra : '');
      tr.style.display = 'none';
      const td = document.createElement('td');
      td.colSpan = 20;
      td.innerHTML = '<i>' + html + '</i>';
      tr.appendChild(td);
      return tr;
    };
    const cap = s => s.replace(/^(\s*(?:<[^>]+>\s*)*)([a-zäöüß])/, (_, p, c) => p + c.toUpperCase());
    const emo = s => `<span class="os-emo">${s}</span>`;
    const usedPhr = [];
    const pickNR = arr => { if (!arr || !arr.length) return ''; if (arr.length === 1) return arr[0]; const fresh = arr.filter(x => usedPhr.indexOf(x) < 0); const pool = fresh.length ? fresh : arr; const c = pool[Math.floor(Math.random() * pool.length)]; usedPhr.push(c); if (usedPhr.length > 16) usedPhr.shift(); return c; };
    const nameOf = s => s === 'h' ? home : away;
    const possPct = acc => { const t = (acc.homeAct || 0) + (acc.awayAct || 0); return t ? Math.round(acc.homeAct / t * 100) : 50; };
    const domFrom = acc => { const t = (acc.homeAct || 0) + (acc.awayAct || 0); if (t < 6) return null; const hp = acc.homeAct / t; return hp >= 0.57 ? 'h' : hp <= 0.43 ? 'a' : null; };
    const chFav = acc => { const d = (acc.chH || 0) - (acc.chA || 0); return d >= 2 ? 'h' : d <= -2 ? 'a' : null; };
    const coachTag = s => `<span class="os-coach" data-team="${s}">der Coach von ${nameOf(s)}</span>`;
    const coachReactP = (ls, ts, kind) => {
      const L = coachTag(ls), T = coachTag(ts);
      if (kind === 'lucky') return pickNR([`${L} schmunzelt zufrieden, während ${T} sichtlich bedient ist`, `bei ${L} Erleichterung, bei ${T} wächst der Frust`, `${L} reibt sich die Hände, ${T} kocht innerlich`]);
      if (kind === 'deserved') return pickNR([`${L} nickt zufrieden, ${T} sucht nach Lösungen`, `Zufriedenheit bei ${L}, Ratlosigkeit bei ${T}`]);
      return pickNR([`beide Trainer fordern lautstark mehr`, `an den Seitenlinien wird eifrig dirigiert`]);
    };
    const roughBit = acc => acc.fouls >= 3 ? emo(pickNR([`die Gangart wurde spürbar ruppiger`, `es ging zunehmend zur Sache – viele Fouls`])) : (acc.cards >= 1 ? emo(pickNR([`der Schiri musste den Karton zücken`, `eine Verwarnung sorgte für Diskussionen`])) : '');
    const standoutBit = acc => { const p = Object.keys(acc.players).sort((a, b) => acc.players[b] - acc.players[a])[0]; return (p && acc.players[p] >= 3) ? pickNR([`auffälligster Akteur: <b>${p}</b>`, `<b>${p}</b> war kaum vom Ball zu trennen`]) : ''; };
    const sceneLine = acc => (acc && acc.topScene) ? emo(pickNR([`Die gefährlichste Szene: ${acc.topScene.text}`, `Der Aufreger der Phase: ${acc.topScene.text}`])) : '';
    const keyScene = (acc, maxMin) => { const ks = (acc.keyMoments || []).filter(k => k.min <= maxMin); if (ks.length) { ks.sort((a, b) => (b.prio - a.prio) || (b.min - a.min)); return ks[0].text; } return (acc.topScene && acc.topScene.text) ? acc.topScene.text : ''; };
    const chancesLine = cum => { const h = cum.chH || 0, a = cum.chA || 0; return (h + a >= 2) ? `bei den Torchancen steht es ${home} ${h}:${a} ${away}` : ''; };
    const phaseLine = (m, sh, sa) => {
      const margin = Math.abs(sh - sa), played = sh + sa;
      if (m >= 75 && margin <= 1) return emo(pickNR([`die Schlussphase bricht an – es bleibt eng`, `jetzt zählt jede Minute, die Nervosität steigt`]));
      if (m <= 20 && played === 0) return emo(pickNR([`noch tasten sich beide Teams ab`, `noch sucht keiner den letzten Zug nach vorn`]));
      return '';
    };
    let lastIntDom = null;
    const shiftLine = cd => { const s = (cd && lastIntDom && cd !== lastIntDom) ? emo(pickNR([`das Blatt wendet sich – jetzt übernimmt ${nameOf(cd)}`, `ein Umschwung: ${nameOf(cd)} drückt nun`])) : ''; if (cd) lastIntDom = cd; return s; };
    const situation = (sh, sa, cum) => {
      const draw = sh === sa, hp = possPct(cum), dom = domFrom(cum), cf = chFav(cum);
      const ls = sh > sa ? 'h' : 'a', ts = sh > sa ? 'a' : 'h', lead = nameOf(ls), trail = nameOf(ts);
      const hi = Math.max(sh, sa), lo = Math.min(sh, sa), margin = hi - lo;
      const bits = [];
      if (draw) {
        if (dom) bits.push(pickNR([`${nameOf(dom)} hat mehr Ballbesitz (${dom === 'h' ? hp : 100 - hp} %), findet aber kein Durchkommen`, `${nameOf(dom)} drückt (${dom === 'h' ? hp : 100 - hp} % Ballbesitz), ohne zwingend zu werden`]));
        else bits.push(pickNR([`ein ausgeglichenes Spiel (${hp}:${100 - hp} Ballbesitz)`, `Partie auf Augenhöhe, ${hp}:${100 - hp} beim Ballbesitz`]));
      } else if (margin >= 3) {
        bits.push(pickNR([`${lead} führt klar mit ${hi}:${lo} und hat alles im Griff`, `eine Machtdemonstration von ${lead} – beim ${hi}:${lo} ist die Sache längst durch`, `${lead} dominiert nach Belieben, ${hi}:${lo} spricht Bände`]));
        bits.push(emo(coachReactP(ls, ts, 'deserved')));
      } else if (margin === 2) {
        bits.push(pickNR([`${lead} hat die Partie mit zwei Toren Vorsprung im Griff`, `${lead} führt komfortabel mit ${hi}:${lo} und lässt kaum etwas zu`]));
        bits.push(emo(coachReactP(ls, ts, 'deserved')));
      } else {
        const domLead = dom === ls, cfLead = cf === ls;
        if (dom && !domLead) { bits.push(pickNR([`${lead} führt gegen den Spielverlauf: ${nameOf(dom)} macht das Spiel (${dom === 'h' ? hp : 100 - hp} % Ballbesitz), doch vorne trifft ${lead}`, `eine schmeichelhafte Führung – ${nameOf(dom)} dominiert (${dom === 'h' ? hp : 100 - hp} % Ballbesitz), ${lead} nutzt seine Momente eiskalt`])); bits.push(emo(coachReactP(ls, ts, 'lucky'))); }
        else if (domLead || cfLead) { bits.push(pickNR([`${lead} kontrolliert die Partie (${ls === 'h' ? hp : 100 - hp} % Ballbesitz) und führt verdient`, `${lead} ist überlegen und liegt hochverdient vorn`])); bits.push(emo(coachReactP(ls, ts, 'deserved'))); }
        else bits.push(pickNR([`${lead} führt knapp, das Spiel bleibt offen (${hp}:${100 - hp} Ballbesitz)`, `${lead} liegt knapp vorn, ${trail} bleibt aber dran`]));
      }
      return bits;
    };
    const betterTeam = acc => { const p = domFrom(acc), c = chFav(acc); if (p && c) return p === c ? p : c; return c || p; };
    const openingComment = (iv, sh, sa) => {
      const played = sh + sa, dom = domFrom(iv), cf = chFav(iv);
      const a = played === 0
        ? pickNR(['noch tasten sich beide Teams ab, es steht 0:0', 'ein vorsichtiger, ausgeglichener Beginn ohne Tore'])
        : pickNR([`ein temporeicher Auftakt, bereits ${sh}:${sa} steht es`, `viel Betrieb in der Anfangsphase, nach gut 15 Minuten heißt es ${sh}:${sa}`]);
      let b;
      if (dom) { const c = (cf && cf !== dom) ? `, die besseren Chancen verzeichnet allerdings ${nameOf(cf)}` : ''; b = pickNR([`den Ton gibt bislang ${nameOf(dom)} an${c}`, `die erste Viertelstunde gehört ${nameOf(dom)}${c}`]); }
      else if (cf) b = `zwingender vor dem Tor war bisher ${nameOf(cf)}`;
      else b = pickNR(['noch neutralisieren sich beide Mannschaften', 'bislang begegnen sich beide auf Augenhöhe']);
      return `<b>Nach einer Viertelstunde.</b> ${[a, b].filter(Boolean).map(cap).join('. ')}.`;
    };
    const crunchComment = (gameAcc, iv, sh, sa, wb) => {
      const margin = Math.abs(sh - sa), hi = Math.max(sh, sa), lo = Math.min(sh, sa);
      const ls = sh > sa ? 'h' : 'a', ts = ls === 'h' ? 'a' : 'h', parts = [];
      if (margin >= 3) parts.push(pickNR([`beim ${hi}:${lo} ist die Partie längst entschieden, es geht nur noch um die Höhe`, `das ${hi}:${lo} nimmt der Schlussphase die Spannung`]));
      else if (margin === 0) parts.push(pickNR([`Crunch Time: beim ${sh}:${sa} ist noch alles offen`, `es steht Spitz auf Knopf, die Entscheidung muss erst noch fallen`]));
      else parts.push(pickNR([`Crunch Time: ${nameOf(ls)} führt knapp mit ${hi}:${lo}, doch entschieden ist hier noch nichts`, `die heiße Phase bricht an – ${nameOf(ls)} liegt mit ${hi}:${lo} vorn, aber ${nameOf(ts)} bleibt dran`]));
      const turned = (sh > sa && wb.h) ? 'h' : (sa > sh && wb.a) ? 'a' : null;
      const cd = iv.dangerSum > 1 ? 'h' : iv.dangerSum < -1 ? 'a' : null;
      if (turned && margin >= 1) parts.push(`${nameOf(turned)} hat das Spiel gedreht und will den Vorsprung nun über die Zeit bringen`);
      else if (cd && margin <= 2) parts.push(pickNR([`zuletzt drängt ${nameOf(cd)} vehement auf ${cd === ls ? 'die Entscheidung' : 'den Ausgleich'}`, `das Momentum liegt zuletzt klar bei ${nameOf(cd)}`]));
      else { const bt = betterTeam(gameAcc); if (bt && margin <= 1) parts.push(`über die gesamte Distanz war ${nameOf(bt)} das etwas bessere Team`); }
      if (margin >= 1 && margin <= 2 && parts.length < 3) parts.push(emo(pickNR([`${coachTag(ts)} peitscht seine Elf noch einmal nach vorn, ${coachTag(ls)} beschwört die Konzentration`, `${coachTag(ts)} sucht die letzte Idee, ${coachTag(ls)} stellt auf Absichern um`])));
      return `<b>15 Minuten vor Schluss.</b> ${parts.slice(0, 3).map(cap).join('. ')}.`;
    };
    const periodicComment = (m, ivAcc, sh, sa, gameAcc, wb) => {
      if (m <= 20) return openingComment(ivAcc, sh, sa);
      return crunchComment(gameAcc || {}, ivAcc, sh, sa, wb || { h: false, a: false });
    };
    const halftimeComment = (sh, sa, acc, wb) => {
      const draw = sh === sa, hi = Math.max(sh, sa), lo = Math.min(sh, sa);
      const ls = sh >= sa ? 'h' : 'a', ts = ls === 'h' ? 'a' : 'h';
      const lead = nameOf(ls), trail = nameOf(ts);
      const hp = possPct(acc), dom = domFrom(acc), better = betterTeam(acc);
      const chH = acc.chH || 0, chA = acc.chA || 0, poss = `${hp}:${100 - hp}`;
      const gs = (acc.keyMoments || []).filter(k => k.type === 'goal' && k.side === ls && k.scorer);
      const cnt = {}; gs.forEach(g => cnt[g.scorer] = (cnt[g.scorer] || 0) + 1);
      let topS = '', topN = 0; for (const s in cnt) if (cnt[s] > topN) { topN = cnt[s]; topS = s; }
      const scorerBit = topN >= 3 ? ` nach einem Dreierpack von <b>${topS}</b>` : (topN === 2 ? ` nach einem Doppelpack von <b>${topS}</b>` : '');
      const desrv = (!draw && better === ls) ? ' verdient' : '';
      const opening = draw
        ? pickNR([`zur Pause trennen sich ${home} und ${away} mit ${sh}:${sa}`, `beim Stand von ${sh}:${sa} geht es in die Kabinen`])
        : `zur Pause führt ${lead}${scorerBit}${desrv} mit ${hi}:${lo}`;
      let mid = '';
      const turned = !draw && wb && wb[ls];
      if (turned) mid = pickNR([`${trail} ging zwar zunächst in Führung, doch ${lead}${better === ls ? ', das bis dahin bessere Team,' : ''} drehte die Partie`, `nach frühem Rückstand kämpfte sich ${lead} zurück und drehte die Begegnung`]);
      else if (!draw && better === ls) mid = pickNR([`${lead} war über die 45 Minuten das bessere Team`, `${lead} bestimmte weitgehend das Geschehen`]);
      else if (!draw && dom && dom !== ls) mid = pickNR([`dabei machte ${nameOf(dom)} sogar mehr fürs Spiel, doch ${lead} zeigte sich eiskalt`, `die Führung ist etwas schmeichelhaft, denn ${nameOf(dom)} hatte die größeren Spielanteile`]);
      else if (draw && dom) mid = `tonangebend war bislang ${nameOf(dom)}`;
      let stats = '';
      if (draw) { if ((chH + chA) >= 2 || dom) stats = dom ? `${nameOf(dom)} hatte dabei etwas mehr Ballbesitz (${poss}), bei den Chancen steht es ${chH}:${chA}` : `auch die Zahlen sind ausgeglichen (${poss} Ballbesitz, ${chH}:${chA} Chancen)`; }
      else if (better === ls || dom === ls) stats = pickNR([`auch die Zahlen belegen es: mehr Ballbesitz (${poss}) und die besseren Chancen (${chH}:${chA}) sprechen für ${lead}`, `${lead} hatte mehr vom Spiel (${poss} Ballbesitz) und die besseren Gelegenheiten (${chH}:${chA})`]);
      else if (dom && dom !== ls) stats = `bei den Spielanteilen liegt ${nameOf(dom)} vorn (${poss} Ballbesitz), bei den Torchancen steht es ${chH}:${chA}`;
      else if (chH + chA >= 2) stats = `bei den Torchancen steht es ${chH}:${chA}`;
      const ks = keyScene(acc, 45);
      const scene = ks ? pickNR([`die Schlüsselszene der ersten Hälfte war eindeutig ${ks}`, `der entscheidende Moment der ersten Hälfte: ${ks}`]) : '';
      const outlook = !draw
        ? pickNR([`${trail} muss sich nun sammeln und die zweite Hälfte mit neuem Elan angehen`, `bei ${trail} sind nach der Pause neue Impulse gefragt`, `${trail} braucht in Durchgang zwei eine deutliche Steigerung`])
        : pickNR([`nach der Pause dürften beide Teams nachlegen wollen`, `die Entscheidung fällt in der zweiten Hälfte`]);
      const parts = [opening, mid, stats, scene, outlook].filter(Boolean);
      return `<b>Halbzeitanalyse.</b> ${parts.map(cap).join('. ')}.`;
    };
    const coachFinal = (ws, ls) => { const W = coachTag(ws), L = coachTag(ls); return pickNR([`${W} strahlt \u00fcber das ganze Gesicht, w\u00e4hrend ${L} entt\u00e4uscht Richtung Kabine zieht`, `Erleichterung und Stolz bei ${W}, w\u00e4hrend ${L} sichtlich mit dem Ausgang hadert`, `${W} l\u00e4sst sich feiern, ${L} findet zun\u00e4chst keine Worte`, `${W} ballt zufrieden die Faust, ${L} starrt fassungslos auf den Rasen`, `pure Freude bei ${W}, blanke Entt\u00e4uschung bei ${L}`, `${W} genie\u00dft den Moment, ${L} haderte mit den eigenen Entscheidungen`]); };
    const finalComment = (sh, sa, acc, wb) => {
      const draw = sh === sa, hi = Math.max(sh, sa), lo = Math.min(sh, sa), margin = hi - lo;
      const ws = sh > sa ? 'h' : 'a', lsd = ws === 'h' ? 'a' : 'h';
      const win = nameOf(ws), los = nameOf(lsd), dom = domFrom(acc), better = betterTeam(acc);
      const gs = (acc.keyMoments || []).filter(k => k.type === 'goal' && k.side === ws && k.scorer);
      const cnt = {}; gs.forEach(g => cnt[g.scorer] = (cnt[g.scorer] || 0) + 1);
      let topS = '', topN = 0; for (const s in cnt) if (cnt[s] > topN) { topN = cnt[s]; topS = s; }
      const scorerBit = topN >= 3 ? ` – <b>${topS}</b> mit drei Treffern der gefeierte Mann` : (topN === 2 ? ` – <b>${topS}</b> schnürte einen Doppelpack` : '');
      const opening = draw
        ? pickNR([`am Ende trennen sich ${home} und ${away} mit ${sh}:${sa}`, `Schlusspfiff: ${sh}:${sa}, es gibt keinen Sieger`])
        : `${win} gewinnt mit ${hi}:${lo}${scorerBit}`;
      let mid;
      const turned = !draw && wb && wb[ws];
      if (draw) mid = dom ? `${nameOf(dom)} war die aktivere Mannschaft, kam über das Remis aber nicht hinaus` : `ein leistungsgerechtes Unentschieden, mit dem beide leben können`;
      else if (turned) mid = pickNR([`nach frühem Rückstand drehte ${win} die Partie und wurde für die Aufholjagd belohnt`, `${win} lag zwischenzeitlich zurück, drehte das Spiel aber und feierte am Ende den Sieg`]);
      else if (margin >= 3) mid = pickNR([`ein klarer, ungefährdeter Erfolg – ${win} ließ nie Zweifel aufkommen`, `eine Machtdemonstration von ${win}, das den Gegner phasenweise vorführte`]);
      else if (better === ws) mid = pickNR([`ein hochverdienter Sieg – ${win} war über 90 Minuten das bessere Team`, `${win} kontrollierte die Partie und gewann letztlich verdient`]);
      else if (dom && dom !== ws) mid = pickNR([`ein glücklicher Erfolg: ${los} machte das Spiel, doch ${win} zeigte sich vorne eiskalt`, `${win} gewinnt gegen den Spielverlauf – Effizienz schlug Ballbesitz`]);
      else mid = pickNR([`ein enges Spiel, in dem ${win} das bessere Ende für sich hatte`, `eine knappe, aber letztlich verdiente Sache für ${win}`]);
      const ks = keyScene(acc, 999);
      const scene = ks ? `die Szene des Spiels war ${ks}` : '';
      const coach = !draw ? emo(coachFinal(ws, lsd)) : '';
      const pl = acc.players || {}; const p = Object.keys(pl).sort((a, b) => pl[b] - pl[a])[0];
      const pod = (p && pl[p] >= 4) ? pickNR([`Spieler des Spiels: <b>${p}</b>`, `herausragend über 90 Minuten: <b>${p}</b>`]) : '';
      const parts = [opening, mid, scene, coach, pod].filter(Boolean);
      return `<b>Schlussanalyse.</b> ${parts.map(cap).join('. ')}.`;
    };
    const styleComment = (team, kind, val) => {
      const t = team === 'Heimteam' ? home : away;
      if (/Spielweise/.test(kind)) return pick([
        `Bewegung an der Seitenlinie: ${t} stellt die Spielweise auf <b>${val}</b> um und will dem Spiel einen neuen Stempel aufdrücken.`,
        `Taktischer Eingriff bei ${t} – die Spielweise wird auf <b>${val}</b> geändert.`
      ]);
      return pick([
        `${t} dreht am Einsatz und geht auf <b>${val}</b> – jetzt sollen alle Reserven auf den Platz.`,
        `Mehr Feuer gefordert: ${t} erhöht den Einsatz auf <b>${val}</b>.`
      ]);
    };
    const subComment = (team, inP, outP) => {
      const t = team === 'Heimteam' ? home : away;
      return pick([
        `Wechsel bei ${t}: <b>${inP}</b> kommt für ${outP} und soll neue Impulse bringen.`,
        `Frische Kräfte bei ${t} – <b>${inP}</b> ersetzt ${outP}.`,
        `${t} reagiert und bringt <b>${inP}</b> für ${outP}.`
      ]);
    };
    const goalTypeOf = t => {
      if (!t) return '';
      if (/Elfmeter|Strafstoß|Foulelfmeter/i.test(t)) return 'per Elfmeter';
      if (/Freistoß|Freistoss/i.test(t)) return 'per Freistoß';
      if (/Kopfball|köpft|per Kopf/i.test(t)) return 'per Kopfball';
      if (/Distanz|Fernschuss|Hammer|aus der Distanz/i.test(t)) return 'mit einem Distanzschuss';
      if (/Flatterball/i.test(t)) return 'mit einem tückischen Flatterball';
      if (/Volley|Direktabnahme/i.test(t)) return 'per Volley';
      if (/Schlenzer|zirkelt/i.test(t)) return 'mit einem feinen Schlenzer';
      if (/patzt|schlecht berechnet|nicht festhalten|nicht fassen|Fehler|vertändelt|Missverständnis/i.test(t)) return 'nach einem Abwehrpatzer';
      return '';
    };
    const GOALBOX_A = {"tb": {"kopfball": ["{S} steigt am höchsten und nickt den Ball unhaltbar ins Eck.", "Ein wuchtiger Kopfball von {S} - der Keeper ist chancenlos!", "{S} schraubt sich hoch und köpft die Kugel unter die Latte.", "Per Flugkopfball wuchtet {S} das Leder ins Netz!", "{S} verlängert mit dem Kopf und lässt dem Torwart keine Chance.", "{S} steigt höher als die gesamte Abwehr und köpft den Ball kompromisslos ins Netz.", "Was für eine Lufthoheit von {S}! Der Kopfball schlägt unhaltbar im Eck ein.", "Flugkopfball von {S} und das Stadion explodiert vor Begeisterung.", "{S} schraubt sich in die Höhe und versenkt die Kugel unter der Latte.", "Der Torwart streckt sich vergeblich, dieser Kopfball ist perfekt gesetzt.", "{S} gewinnt das Luftduell mit beeindruckender Wucht.", "Der Ball rauscht nach dem Kopfball von {S} unaufhaltsam ins Tor.", "Lehrbuchmäßig steigt {S} zum Kopfball hoch und trifft.", "Höher kann man kaum springen, {S} krönt seinen Laufweg mit dem Treffer.", "Eine mustergültige Hereingabe findet in {S} den perfekten Abnehmer.", "Mit dem Mut eines Mittelstürmers wirft sich {S} in diesen Ball.", "Der Kopfball von {S} schlägt genau dort ein, wo kein Torwart hinkommt.", "{S} verlängert die Flanke technisch brillant ins lange Eck.", "Die Defensive verliert {S} aus den Augen und wird sofort bestraft.", "Ein echter Wuchtkopfball von {S} lässt das Netz erzittern.", "Perfektes Timing, perfekte Flugbahn, perfekter Abschluss.", "Der Ball küsst den Innenpfosten und landet im Netz.", "{S} gewinnt das Duell in der Luft mit beeindruckender Entschlossenheit.", "Aus vollem Lauf setzt {S} diesen Kopfball traumhaft.", "Der Angreifer hängt förmlich in der Luft und trifft.", "Was für eine Präsenz von {S} im Strafraum.", "Der Kopfball kommt wie ein Vorschlaghammer daher.", "Die Flanke wird durch {S} zu Gold veredelt.", "Mit unglaublicher Präzision nickt {S} den Ball ein.", "Der Keeper bleibt wie angewurzelt stehen.", "Das ist Kopfballspiel in Perfektion.", "Im richtigen Moment am richtigen Ort: {S}.", "Die Kugel schlägt unhaltbar im Winkel ein.", "Eine Demonstration von Timing und Kopfballstärke.", "Was für ein Abschluss mit dem Kopf von {S}!"], "wuchtschuss": ["{S} drischt den Ball so wuchtig ins Netz, dass der Torwart nur noch winken konnte.", "{S} hämmert das Leder kompromisslos unter die Latte!", "{S} jagt die Kugel humorlos in die Maschen.", "Ein Strahl von {S} schlägt unhaltbar ein.", "{S} hämmert das Leder mit voller Wucht in die Maschen.", "Toooor! Ein Geschoss von {S} schlägt ein wie ein Donnerschlag.", "Der Ball zischt wie eine Rakete am Torwart vorbei.", "Keine Chance für den Keeper bei diesem Hammerabschluss.", "{S} zieht kompromisslos ab und trifft mitten ins Glück.", "Der Schuss hat eine unglaubliche Geschwindigkeit.", "Wucht pur von {S}, das Stadion rastet aus.", "Ein Vollspannschuss wie aus dem Bilderbuch.", "Der Ball schlägt krachend unter der Latte ein.", "Was für ein Strahl von {S}!", "Der Torwart kann nur hinterherschauen.", "Ein Abschluss voller Kraft und Entschlossenheit.", "{S} trifft das Leder perfekt und wird belohnt.", "Dieser Schuss hat pure Sprengkraft.", "Das Netz zappelt noch Sekunden nach dem Einschlag.", "Ein Hammer, der seinesgleichen sucht.", "Der Ball schlägt wie ein Blitz aus heiterem Himmel ein.", "Mit einem Gewaltsschuss sorgt {S} für Ekstase.", "Der Torwart hört den Ball nur vorbeirauschen.", "Ein echter Kandidat für das Tor des Monats.", "Was für eine Kanonenkugel von {S}.", "Der Abschluss ist ebenso mutig wie präzise.", "Vollrisiko und Volltreffer.", "Der Ball wird förmlich ins Tor geprügelt.", "Die Fans springen bei diesem Schuss von den Sitzen.", "Pure Gewalt im rechten Fuß von {S}.", "Das Leder schlägt unhaltbar im Eck ein.", "Ein präziser Hammerabschluss aus vollem Lauf.", "{S} packt den Vorschlaghammer aus.", "Dieser Schuss lässt das komplette Stadion beben."], "platziert": ["{S} zirkelt die Kugel unhaltbar in den Winkel - ein Traumtor!", "{S} bleibt eiskalt und schiebt den Ball gefühlvoll ins lange Eck.", "Mit der Präzision eines Uhrmachers setzt {S} den Ball ins Eck.", "{S} schlenzt den Ball mit traumhafter Präzision in den Winkel.", "Was für ein feiner Abschluss von {S}! Der Ball passt haargenau ins Eck.", "Der Torwart fliegt, doch an diesen Schuss kommt er niemals heran.", "Mit der Ruhe eines Routiniers setzt {S} die Kugel ins lange Eck.", "Zentimetergenau findet {S} die einzige Lücke im Tor.", "Der Ball küsst den Innenpfosten und schlägt dann im Netz ein.", "Ein Abschluss voller Übersicht und Klasse von {S}.", "{S} malt den Ball förmlich ins Tor.", "Das ist Fußballkunst in ihrer schönsten Form.", "Gefühlvoller kann man einen Ball kaum platzieren.", "{S} beweist hier Nerven aus Stahl.", "Der Abschluss wirkt mühelos, ist aber technisch herausragend.", "Millimeterarbeit von {S} im entscheidenden Moment.", "Der Ball segelt unerreichbar ins obere Eck.", "Mit viel Gefühl und noch mehr Qualität trifft {S} ins Schwarze.", "Der Keeper bleibt machtlos zurück und schaut dem Ball hinterher.", "Ein Schlenzer wie aus dem Fußball-Lehrbuch.", "{S} setzt den Abschluss mit chirurgischer Präzision.", "Was für eine Übersicht des Torschützen!", "Der Ball findet seinen Weg ins Netz wie ferngesteuert.", "Eine elegante Lösung in einer Drucksituation.", "Technik, Ruhe und Präzision vereinen sich in diesem Abschluss.", "Der Torhüter ahnt die Ecke, kommt aber niemals rechtzeitig hin.", "Traumhafte Ballkontrolle und ein Abschluss von höchster Qualität.", "Der Ball schlägt punktgenau dort ein, wo er soll.", "Das Publikum erhebt sich für diesen brillanten Treffer.", "{S} vollendet mit einer Leichtigkeit, die beeindruckt.", "Ein Tor zum Genießen für jeden Fußballliebhaber.", "Präziser kann man einen Torabschluss kaum ausführen.", "Ein Abschluss der Extraklasse von {S}.", "Toooor! {S} hebt den Kopf, sieht die Ecke und versenkt den Ball traumhaft.", "Die Fans halten kurz den Atem an, dann explodiert das Stadion vor Begeisterung.", "Mit einer Selbstverständlichkeit schiebt {S} die Kugel ins Glück.", "Der Torwart wirkt geschlagen, noch bevor der Ball einschlägt.", "Ein Abschluss voller Coolness unter höchstem Druck.", "Da zeigt {S} die Klasse eines ganz großen Torjägers.", "Die Kugel schlägt ein und die Tribünen verwandeln sich in ein Tollhaus.", "Was für ein Moment! {S} setzt den Ball perfekt neben den Pfosten.", "Dieses Tor ist eine Mischung aus Mut, Technik und Genie.", "Eine fußballerische Delikatesse von {S}."], "heber": ["{S} lupft den Ball mit traumhafter Leichtigkeit ins Tor.", "{S} hebt den Ball mit traumhafter Leichtigkeit über den Keeper hinweg.", "Was für eine freche Lösung von {S}! Der Lupfer sitzt perfekt.", "Der Torwart kommt heraus und wird eiskalt überlistet.", "Mit ganz viel Gefühl hebt {S} die Kugel ins Netz.", "Eine brillante Idee von {S} in höchster Bedrängnis.", "Der Ball segelt majestätisch über den Keeper hinweg.", "{S} entscheidet sich für den Heber und liegt goldrichtig.", "Ein Lupfer wie aus dem Lehrbuch.", "Der Torwart ist bereits geschlagen, als der Ball den Fuß verlässt.", "Was für eine elegante Art, ein Tor zu erzielen.", "{S} vollendet mit technischer Finesse.", "Der Ball beschreibt einen perfekten Bogen ins Netz.", "Das Publikum staunt über diese geniale Entscheidung.", "Mit Samthandschuhen hebt {S} den Ball ins Glück.", "Ein Hauch von Genie liegt in diesem Abschluss.", "Der Keeper kann nur zuschauen, wie der Ball hinter ihm einschlägt.", "Ein Lupfer voller Mut und Selbstvertrauen.", "{S} spielt die Situation überragend clever aus.", "Das ist hohe Fußballkunst.", "Gefühlvoller kann man einen Torwart kaum überwinden.", "Ein Abschluss zum Zurücklehnen und Genießen.", "{S} macht aus einer guten Chance ein wunderschönes Tor.", "Der Ball fällt wie ein Blatt vom Himmel ins Netz.", "Der Torwart wird mit einem einzigen Kontakt ausgespielt.", "Traumhafte Übersicht von {S} in dieser Situation.", "Die Zuschauer honorieren diese technische Meisterleistung.", "Was für ein feines Füßchen von {S}.", "Der Ball senkt sich unerreichbar hinter die Linie.", "Da zeigt {S} sein ganzes Können.", "Eine Lösung, die man nicht alle Tage sieht.", "Toooor! {S} hebt den Ball über den herausstürmenden Keeper und sorgt für Ekstase auf den Rängen.", "Was für ein Nervenbündel? Ganz im Gegenteil! {S} bleibt cool und lupft traumhaft ein.", "Der Torwart macht sich groß, doch {S} findet die noch größere Lösung.", "Mit einem Kontakt zaubert {S} den Ball ins Netz.", "Der Abschluss wirkt spielerisch leicht und ist doch von höchster Schwierigkeit.", "Ganz viel Gefühl, ganz viel Klasse und am Ende ein wunderschönes Tor.", "Der Keeper steht plötzlich im Leeren und {S} feiert den perfekten Lupfer.", "Dieses Tor gehört in jede Highlight-Sammlung.", "Die Fans springen von ihren Sitzen, als der Ball hinter dem Torwart einschlägt.", "Ein Kunstwerk von {S}, vollendet mit einem perfekten Heber."], "distanz": ["Aus der Distanz zieht {S} ab - und die Kugel schlägt unhaltbar ein!", "{S} zieht aus der zweiten Reihe ab und trifft genau in den Torhimmel.", "Der Ball fliegt wie ein Strahl durch die Abendluft und schlägt unhaltbar ein.", "Was für ein Mut von {S}, aus dieser Entfernung den Abschluss zu suchen.", "Das Stadion hält kurz den Atem an und explodiert dann vor Freude.", "Ein Fernschuss voller Überzeugung von {S}.", "Die Kugel nimmt Maß und landet perfekt im Winkel.", "Aus der Distanz setzt {S} ein echtes Ausrufezeichen.", "Der Torwart kommt zwar noch heran, kann den Einschlag aber nicht verhindern.", "Das Leder schlägt mit voller Wucht hinter dem Keeper ein.", "Ein Distanzschuss wie aus einem Fußballmärchen.", "{S} überrascht den Schlussmann mit einem Abschluss der Extraklasse.", "Solche Tore sieht man selbst auf diesem Niveau nicht oft.", "Der Ball entwickelt eine unglaubliche Flugkurve.", "{S} beweist außergewöhnliches Selbstvertrauen.", "Ein echter Traumtreffer aus der Entfernung.", "Das Publikum feiert diesen Distanzhammer frenetisch.", "Der Keeper ist komplett machtlos.", "Die Kugel rauscht genau unter die Latte.", "{S} trifft den Ball absolut perfekt.", "Der Schuss kommt aus dem Nichts und endet im Netz.", "Aus über zwanzig Metern schlägt {S} gnadenlos zu.", "Der Ball schlägt ein wie ein Meteorit.", "Ein Distanzschuss voller Klasse und Präzision.", "Die Fans können kaum glauben, was sie gerade gesehen haben.", "Ein Treffer für die Jahresrückblicke.", "{S} sorgt mit einem Kunstschuss für Begeisterung.", "Die Flugbahn ist nahezu perfekt.", "Der Ball landet punktgenau dort, wo es weh tut.", "Fernschüsse dieser Qualität sind selten.", "Ein Meisterwerk aus der zweiten Reihe.", "{S} nimmt Maß und trifft traumhaft.", "Die Arena steht Kopf nach diesem Distanztreffer.", "Gewaltige Schusstechnik von {S}.", "Der Ball senkt sich im allerletzten Moment ins Netz.", "Aus der Entfernung entwickelt der Schuss eine unglaubliche Dynamik.", "{S} sorgt für einen dieser besonderen Fußballmomente.", "Der Distanzversuch wird zur perfekten Überraschung.", "Der Keeper verschätzt sich minimal und wird bestraft.", "Die Kugel schlägt genau neben dem Pfosten ein.", "Dieser Treffer hat absoluten Seltenheitswert.", "Was für ein Kunstschuss von {S}!", "Ein Distanztreffer, der die Zuschauer von den Sitzen reißt.", "Der Ball findet seinen Weg durch ein dichtes Spielerfeld.", "{S} beweist Mut und Können zugleich.", "Der Schuss entwickelt unterwegs noch zusätzlichen Drall.", "Die Fans feiern diesen Moment mit grenzenloser Begeisterung.", "Ein Fernschuss wie aus dem Lehrbuch.", "Das Leder schlägt unhaltbar im rechten Winkel ein.", "{S} setzt die Kugel perfekt in Szene.", "Die Anzeigetafel muss nach diesem Traumtor aktualisiert werden.", "Ein Distanzschuss voller Entschlossenheit.", "Dieser Treffer sorgt für Staunen auf allen Tribünen.", "{S} trifft die Kugel so sauber wie nur wenige Spieler.", "Die Flugbahn bringt selbst Experten ins Schwärmen.", "Der Torwart bleibt regungslos stehen und schaut hinterher.", "Ein magischer Moment aus der zweiten Reihe.", "Die Kugel landet wie ferngesteuert im Netz.", "{S} verwandelt eine unscheinbare Szene in ein Highlight.", "Das komplette Stadion erhebt sich nach diesem Traumschuss.", "Ein unvergesslicher Distanztreffer von {S}."], "abstauber": ["So kann man ein Tor natuerlich auch machen - {S} stochert die Kugel über die Linie, Hauptsache drin!", "{S} reagiert blitzschnell und drückt den Ball aus kurzer Distanz über die Linie.", "Der Torwart kann zunächst parieren, doch gegen den Nachschuss von {S} ist er machtlos.", "Genau dort steht ein Torjäger: {S} staubt eiskalt ab.", "Im Strafraumchaos behält {S} die Übersicht und trifft.", "Der Ball springt vor die Füße von {S} und der sagt Danke.", "Nicht schön, aber unglaublich effektiv von {S}.", "{S} riecht die Situation früher als alle anderen und staubt ab.", "Der Abpraller landet genau dort, wo {S} bereits lauert.", "Mit einem schnellen Reflex macht {S} den Treffer perfekt.", "Der Torjägerinstinkt von {S} zahlt sich aus.", "{S} schaltet schneller als die gesamte Defensive.", "Der erste Versuch wird gehalten, der zweite sitzt.", "Im richtigen Moment am richtigen Ort: {S}.", "Der Ball will einfach zu {S} und landet schließlich im Netz.", "Aus dem Gewühl heraus findet {S} die entscheidende Lücke.", "Ein klassischer Abstauber eines echten Mittelstürmers.", "{S} reagiert geistesgegenwärtig und bringt die Kugel unter.", "Die Verteidiger zögern, {S} nicht.", "Der Nachschuss von {S} ist reine Formsache.", "Der Ball liegt plötzlich frei und {S} schlägt zu.", "Was für ein Riecher von {S} im Strafraum!", "Der Keeper wird erst zum Helden und Sekunden später zum Verlierer.", "{S} macht genau das, was Torjäger eben machen.", "Im Strafraumgewühl verliert niemand den Überblick außer {S}.", "Der erste Ball wird abgewehrt, der zweite gehört {S}.", "{S} schiebt die Kugel überlegt ins freie Eck.", "Keine Sekunde Überlegen von {S}, direkt im Netz.", "Der Stürmer nutzt die Unordnung eiskalt aus.", "Die Abwehr bekommt den Ball nicht weg und {S} bedankt sich.", "Ein Treffer voller Instinkt und Reaktionsschnelligkeit.", "Der Abpraller fällt genau vor die Füße von {S}.", "{S} ist gedanklich einen Schritt schneller als alle anderen.", "Die Kugel springt durch den Strafraum und landet beim richtigen Mann.", "Ein echter Knipser-Treffer von {S}.", "Der Torwart kann nur noch entsetzt hinterherschauen.", "{S} drückt den Ball kompromisslos ins Netz.", "Der Ball fällt glücklich vor die Füße von {S}, der Rest ist Routine.", "Der Angreifer zeigt seinen Killerinstinkt vor dem Tor.", "{S} reagiert wie ein Raubtier im Strafraum.", "Nach mehreren Abwehrversuchen landet der Ball schließlich bei {S}.", "Das Chaos im Strafraum endet mit Jubel für {S}.", "Der Nachschuss sitzt perfekt.", "{S} nutzt die zweite Chance konsequent aus.", "Kein Glanzstück, aber ein wichtiges Tor von {S}.", "Der Ball prallt ab und {S} schaltet sofort.", "Torjäger leben von solchen Momenten und {S} beweist genau das.", "Der Keeper ist bereits geschlagen, als {S} zum Ball kommt.", "Eine typische Stürmeraktion von {S}.", "Das Leder springt frei und {S} schnürt eiskalt zu.", "Im Gedränge behält {S} die Nerven und trifft.", "Die Defensive bekommt keinen Zugriff und {S} bestraft das sofort.", "Der Ball wird abgefälscht und landet perfekt für {S}.", "{S} stochert die Kugel irgendwie über die Linie und das reicht.", "Der Treffer entsteht aus purem Willen und Aufmerksamkeit.", "Ein Abstauber wie aus dem Lehrbuch.", "Die Fans feiern den Torjägerinstinkt von {S}.", "Der Ball landet genau dort, wo ein Stürmer stehen muss.", "{S} beweist einmal mehr seinen Torriecher.", "Aus kürzester Distanz macht {S} den Sack zu.", "Der Treffer ist vielleicht nicht spektakulär, aber für {S} zählt nur das Ergebnis."], "solo": ["{S} umkurvt den halben Gegner und schiebt eiskalt ein - ein Solo zum Zunge schnalzen!", "{S} tanzt durch die Abwehr wie durch Slalomstangen und vollendet eiskalt.", "Eine sensationelle Einzelaktion von {S}, die mit dem Tor belohnt wird.", "{S} nimmt den Ball auf, marschiert los und macht den Rest alleine.", "Was für ein Solo von {S}! Die Verteidiger haben das Nachsehen.", "Der Weg zum Tor scheint verbarrikadiert, doch {S} findet eine Lösung.", "{S} lässt einen Gegenspieler nach dem anderen stehen.", "Dieses Dribbling gehört in jede Highlight-Sendung.", "Die Defensive kommt gegen {S} keinen Moment in den Zweikampf.", "{S} spielt Katz und Maus mit der gegnerischen Hintermannschaft.", "Eine Demonstration individueller Klasse von {S}.", "Der Ball klebt förmlich am Fuß von {S}.", "Mit unglaublicher Leichtigkeit dribbelt sich {S} durch die Abwehr.", "Die Gegenspieler sehen nur noch die Rückennummer von {S}.", "Sololauf von {S} und das Stadion hält den Atem an.", "{S} nimmt Tempo auf und ist plötzlich nicht mehr zu stoppen.", "Ein Geniestreich von {S}, der diesen Angriff im Alleingang abschließt.", "{S} zeigt seine komplette technische Klasse.", "Der Verteidiger wird verladen, der Torwart anschließend überwunden.", "Was für eine Körperbeherrschung von {S}!", "{S} dringt in den Strafraum ein und bewahrt die Ruhe.", "Eine Einzelaktion voller Selbstvertrauen.", "Die Abwehr wirkt gegen {S} völlig überfordert.", "Mit schnellen Richtungswechseln lässt {S} alle Gegner ins Leere laufen.", "{S} zieht das Tempo an und niemand kann folgen.", "Der Sololauf endet mit einem perfekten Abschluss.", "Das Publikum erhebt sich bereits während des Dribblings.", "{S} tänzelt durch die Abwehrreihe und schiebt ein.", "Eine spektakuläre Aktion des Ausnahmekönners {S}.", "Die Gegenspieler kommen einfach nicht an den Ball.", "{S} macht aus einer harmlosen Situation eine Großchance.", "Der Angreifer übernimmt die Verantwortung und belohnt sich selbst.", "Ein Solo voller Tempo, Technik und Entschlossenheit.", "{S} findet selbst auf engstem Raum eine Lücke.", "Die Verteidiger wirken wie Statisten bei diesem Lauf.", "{S} spielt seine Gegenspieler schwindelig.", "Eine außergewöhnliche Einzelaktion mit perfektem Ende.", "Das ist Fußballkunst auf höchstem Niveau.", "{S} setzt sich mit purem Willen durch.", "Jeder Kontakt sitzt perfekt bei diesem Solo.", "Die Kugel scheint magnetisch am Fuß von {S} zu haften.", "{S} vernascht die komplette Abwehrreihe.", "Der Sololauf entwickelt sich Meter für Meter zum Highlight.", "{S} behält trotz hoher Geschwindigkeit die volle Kontrolle.", "Einmal aufgedreht und niemand bekommt {S} mehr zu fassen.", "Die Gegner kommen nur einen Schritt zu spät.", "Was für ein Antritt von {S}!", "Der Ball wird zum treuen Begleiter auf diesem Weg zum Tor.", "{S} schlängelt sich durch die Lücken der Defensive.", "Ein Solo, über das die Fans noch lange sprechen werden.", "Der Torschütze zeigt seine Extraklasse eindrucksvoll.", "{S} übernimmt das Kommando und entscheidet die Szene alleine.", "Eine Kombination aus Mut, Technik und Übersicht.", "Das komplette Stadion feiert diesen Sololauf.", "{S} hat die zündende Idee und setzt sie perfekt um.", "Ein Spieler, ein Ball, ein Tor. Mehr braucht es nicht.", "Die Abwehr wird von {S} regelrecht auseinandergenommen.", "Mit traumhafter Ballkontrolle zieht {S} Richtung Tor.", "Ein Solo wie aus dem Fußball-Lehrfilm.", "{S} macht aus Raumgewinn einen Torgewinn.", "Was für ein Lauf, was für ein Tor, was für ein Moment von {S}!"], "freistoss": ["{S} zirkelt den Freistoß traumhaft über die Mauer ins Eck!", "Was für ein Kunstschuss von {S}! Der Ball schlägt unhaltbar ein.", "Der Torwart streckt sich vergeblich, dieser Freistoß ist perfekt getreten.", "Mit beeindruckender Präzision trifft {S} direkt ins Glück.", "Der Ball fliegt wie an einer Schnur gezogen ins Netz.", "Traumtor aus ruhendem Ball von {S}.", "Die Mauer ist überwunden, der Keeper geschlagen.", "Ein Freistoß wie aus dem Lehrbuch.", "{S} beweist außergewöhnliche Schusstechnik.", "Der Ball senkt sich im letzten Moment hinter dem Torwart.", "Perfekt getreten und perfekt platziert.", "Was für eine Flugkurve von {S}!", "Der Freistoß schlägt genau im Winkel ein.", "Da passt einfach alles zusammen.", "{S} schlenzt den Ball mit viel Gefühl ins Eck.", "Keine Chance für den Schlussmann.", "Der Ball küsst noch das Aluminium und landet im Netz.", "Ein direkter Freistoß der Extraklasse.", "{S} trifft den Ball ideal und wird belohnt.", "Traumhafte Technik beim Freistoßschützen.", "Ein Abschluss voller Eleganz und Präzision.", "Das Publikum feiert diesen Freistoß lautstark.", "Der Torwart sieht den Ball nur einschlagen.", "Ein Kunstwerk auf dem Fußballplatz.", "Mit feiner Klinge überlistet {S} die gesamte Defensive.", "Der Ball nimmt exakt die gewünschte Flugbahn.", "Das ist Freistoßkunst auf höchstem Niveau.", "Die Zuschauer honorieren diesen Geniestreich.", "Ein Treffer, der in Erinnerung bleiben wird.", "{S} verwandelt den Standard in ein echtes Highlight.", "Toooor! {S} zaubert den Ball über die Mauer hinweg und lässt das Stadion erbeben.", "Der Freistoß ist ein Gemälde in Fußballform.", "{S} hebt den Blick, nimmt Maß und trifft traumhaft.", "Die Kugel fliegt unaufhaltsam ihrem Ziel entgegen.", "Was für ein Moment! Der Ball schlägt genau im rechten Winkel ein.", "Der Keeper macht einen Satz, kommt aber keinen Zentimeter mehr heran.", "Die Fans können ihren Augen kaum trauen.", "Ein Freistoß wie aus einem Highlight-Video.", "Das Stadion explodiert, als die Kugel im Netz einschlägt.", "Eine perfekte Mischung aus Technik, Gefühl und Mut von {S}."], "elfmeter": ["{S} bleibt vom Punkt eiskalt und verwandelt sicher.", "Nerven aus Stahl bei {S}, der Keeper ist chancenlos.", "Ganz cool schiebt {S} den Ball ins Eck.", "Der Torwart ahnt die Ecke, kommt aber nicht mehr heran.", "Souverän verwandelt von {S}.", "Ein Strafstoß voller Selbstvertrauen.", "{S} lässt sich diese Gelegenheit nicht entgehen.", "Der Ball schlägt präzise im unteren Eck ein.", "Kein Zittern, kein Wackeln, nur Tor durch {S}.", "Der Schütze behält die Ruhe und trifft.", "Was für eine Kaltschnäuzigkeit von {S}!", "Der Keeper entscheidet sich für die falsche Seite.", "Sicherer kann man einen Elfmeter kaum schießen.", "{S} verlädt den Torwart mit einer cleveren Bewegung.", "Der Strafstoß sitzt perfekt.", "Volle Konzentration und ein perfekter Abschluss.", "Der Ball schlägt unhaltbar im Netz ein.", "Da zeigt {S} echte Führungsqualitäten.", "Ein Elfmeterschütze wie aus dem Lehrbuch.", "{S} behält die Nerven und versenkt den Ball.", "Der Druck scheint an {S} komplett abzuprallen.", "Eine Demonstration von Ruhe und Präzision.", "Mit beeindruckender Gelassenheit trifft {S}.", "Der Keeper bleibt machtlos zurück.", "Punktgenau verwandelt von {S}.", "Der Ball landet genau dort, wo der Torwart nicht hinkommt.", "Ein Strafstoß voller Überzeugung.", "{S} macht alles richtig und wird belohnt.", "Die Fans feiern die Nervenstärke des Schützen.", "Keine Diskussion, kein Zweifel: Der Ball ist drin.", "Toooor! {S} bleibt vor zehntausenden Zuschauern eiskalt und verwandelt sicher.", "Die Anspannung war greifbar, doch {S} behält die Nerven.", "Der Torwart fliegt, der Ball schlägt ein, perfekter Elfmeter!", "Mit der Ruhe eines Routiniers schiebt {S} den Ball ins Netz.", "Was für eine Coolness in diesem Moment.", "Das Stadion hält kurz den Atem an und explodiert dann vor Jubel.", "{S} übernimmt die Verantwortung und liefert.", "Der Druck ist riesig, der Abschluss noch größer.", "Eiskalt, präzise und absolut souverän.", "Ein Strafstoß, der die Fans von den Sitzen reißt."], "neutral": ["Mit einer Frechheit vollendet {S} - der Keeper schaut noch heute.", "{S} erwischt den Keeper auf dem falschen Fuß.", "Der Abschluss von {S} ist ein Kunstwerk auf Rasen.", "Der Torwart ist chancenlos gegen diesen Abschluss von {S}.", "Toooor! {S} bringt das Stadion zum Beben.", "Der Ball schlägt ein und die Fans rasten aus.", "{S} nutzt die Gelegenheit und sorgt für Jubelstürme.", "Der Abschluss von {S} landet unhaltbar im Netz.", "Was für ein Moment für {S} und {Team}!", "Die Kugel zappelt im Netz und die Stimmung explodiert.", "Der Torwart kann nur hinterherschauen.", "Das Stadion erhebt sich geschlossen von den Sitzen.", "{S} sorgt für Ekstase auf den Rängen.", "Ein Treffer, der die Zuschauer begeistert.", "Jetzt gibt es kein Halten mehr für die Fans.", "Der Ball findet seinen Weg ins Tor.", "Ein wichtiger Treffer für {Team}.", "Der Jubel kennt keine Grenzen.", "{S} trifft und die Arena steht Kopf.", "Die Defensive des {Gegner} ist geschlagen.", "Was für eine Reaktion des Publikums!", "Der Treffer kommt genau zum richtigen Zeitpunkt.", "Das Netz wackelt und die Fans feiern.", "{S} zeigt seine ganze Qualität.", "Eine Aktion mit erfolgreichem Ausgang für {Team}.", "Der Torwart ist machtlos.", "Jubelnde Gesichter auf den Tribünen.", "Ein Tor, das dem Spiel neue Spannung verleiht.", "Die Zuschauer liegen sich in den Armen.", "{S} nutzt seine Chance konsequent.", "Die Fans feiern ihren Torschützen ausgelassen.", "Dieser Treffer sorgt für Begeisterung.", "Die Arena verwandelt sich in ein Tollhaus.", "Ein Tor, das seine Wirkung nicht verfehlt.", "Was für eine Szene im Stadion!", "Der Ball schlägt ein und die Emotionen kochen hoch.", "{S} wird sofort von seinen Mitspielern umringt.", "Die Ränge explodieren vor Freude.", "Ein Treffer voller Bedeutung für {Team}.", "Die Partie bekommt durch dieses Tor eine neue Dynamik.", "Die Fans bejubeln diesen Moment frenetisch.", "Was für eine Reaktion auf den Tribünen!", "Das Stadion bebt bis in die Grundmauern.", "Der Jubel hallt durch die gesamte Arena.", "{S} macht den Unterschied in dieser Szene.", "Der Ball schlägt ein und die Begeisterung kennt keine Grenzen.", "Die Zuschauer feiern diesen Treffer lautstark.", "Ein Tor, das große Emotionen auslöst.", "Der Torschütze wird sofort zum gefeierten Mann.", "Die Mannschaft von {Team} jubelt ausgelassen.", "Das Publikum honoriert diesen Treffer mit ohrenbetäubendem Jubel.", "Die Fans halten es nicht mehr auf ihren Plätzen.", "Ein weiterer großer Moment für {S}.", "Toooor für {Team}! {S} sorgt für grenzenlose Begeisterung."]}, "ent": {"vorlage": ["Nach mustergültiger Vorlage von {A} war der Abschluss nur noch Formsache.", "{A} legt uneigennuetzig ab, und den Rest erledigt {S}.", "{A} sieht die Lücke und bedient {S} punktgenau.", "Ein feiner Steckpass von {A} hebelt die gesamte Defensive aus.", "Nach einer Hereingabe von {A} kommt {S} frei zum Abschluss.", "{A} flankt butterweich in den Strafraum.", "Nach einer mustergültigen Vorlage von {A} muss {S} nur noch vollenden.", "{A} legt perfekt quer und {S} sagt Danke.", "Ein genialer Pass von {A} öffnet die komplette Defensive.", "Mit einem traumhaften Zuspiel setzt {A} seinen Mitspieler in Szene.", "Der Pass von {A} kommt genau im richtigen Moment.", "{A} serviert die Chance auf dem Silbertablett.", "Ein Steckpass der Extraklasse von {A}.", "Die Übersicht von {A} macht diesen Angriff überhaupt erst möglich.", "{A} spielt einen Ball, den nur wenige überhaupt sehen würden.", "Die Vorarbeit von {A} ist mindestens genauso stark wie der Abschluss.", "Mit einem perfekten Schnittstellenpass hebelt {A} die Abwehr aus.", "{A} öffnet mit einem einzigen Kontakt das gesamte Spielfeld.", "Die Flanke von {A} landet punktgenau beim Torschützen.", "Ein Assist wie aus dem Lehrbuch von {A}.", "{A} setzt {S} ideal in Szene.", "Der Angriff wird durch die Übersicht von {A} veredelt.", "Was für ein Zuspiel von {A}!", "{A} findet die einzige Lücke in der Defensive.", "Ein überragender Pass bringt {S} in Abschlussposition.", "Die Vorarbeit von {A} ist pure Fußballkunst.", "{A} hebt die Kugel traumhaft über die Abwehrkette.", "Ein Pass mit dem Außenrist sorgt für Gefahr.", "{A} spielt die Verteidiger förmlich schwindelig.", "Die Defensive wird durch den Assist von {A} komplett überrascht.", "Ein perfekter Diagonalball von {A} leitet den Treffer ein.", "{A} beweist außergewöhnliche Spielintelligenz.", "Die Flanke kommt haargenau auf den Kopf von {S}.", "Ein Geistesblitz von {A} öffnet die Tür zum Tor.", "{A} erkennt die Situation schneller als alle anderen.", "Mit viel Übersicht bringt {A} den Ball in die Gefahrenzone.", "Die Hereingabe von {A} ist kaum zu verteidigen.", "{A} serviert die Chance maßgeschneidert.", "Das Auge von {A} macht hier den Unterschied.", "Ein Pass durch mehrere Abwehrspieler erreicht {S}.", "{A} legt den Ball perfekt in den Lauf des Torschützen.", "Die Kombination zwischen {A} und {S} funktioniert überragend.", "Ein Traumpass von {A} sorgt für große Gefahr.", "Die Abwehr wird durch einen präzisen Pass auseinandergenommen.", "{A} bereitet den Treffer mit beeindruckender Ruhe vor.", "Ein Ball in die Tiefe bringt die Defensive ins Wanken.", "Die Vorlage von {A} hat absolute Weltklassequalität.", "{A} hebt den Kopf und findet die perfekte Lösung.", "Mit viel Gefühl setzt {A} seinen Mitspieler ein.", "Die Flanke kommt scharf und präzise in den Strafraum.", "Ein herrlicher Steckpass öffnet den Weg zum Tor.", "{A} beweist bei diesem Zuspiel außergewöhnliches Timing.", "Der Assistent erkennt die Bewegung von {S} frühzeitig.", "Ein Pass wie mit dem Lineal gezogen.", "{A} schickt {S} auf die Reise Richtung Tor.", "Die Vorarbeit zeigt die ganze Klasse von {A}.", "Ein raffinierter Pass bringt die Defensive komplett aus dem Konzept.", "{A} spielt genau in den freien Raum.", "Die perfekte Vorlage macht den Abschluss erst möglich.", "Ein technisch brillanter Assist von {A}.", "{A} nutzt die kleinste Lücke konsequent aus.", "Der Pass kommt millimetergenau an.", "Mit seinem Zuspiel hebelt {A} die gesamte Hintermannschaft aus.", "Eine Vorlage voller Übersicht, Präzision und Qualität.", "{A} liefert die perfekte Einladung zum Torerfolg."], "standard": ["Nach einer Standardsituation staubt {S} eiskalt ab.", "Nach einer scharf getretenen Ecke fällt der Ball direkt vor die Füße von {S}.", "Eine Standardsituation sorgt für maximale Unordnung in der Defensive des {Gegner}.", "Nach einer gefährlichen Ecke reagiert {S} am schnellsten.", "Der ruhende Ball wird zur perfekten Vorlage für {S}.", "Nach einem Freistoß landet die Kugel genau dort, wo {S} lauert.", "Die Abwehr bekommt den Ball nicht geklärt und {S} bedankt sich.", "Ein Standard bringt die Hintermannschaft des {Gegner} ins Wanken.", "Nach einer Kopfballverlängerung landet der Ball bei {S}.", "Die Ecke sorgt für Chaos im Strafraum.", "Der Standard wird zum Türöffner für {Team}.", "Nach einer unübersichtlichen Situation behält {S} die Orientierung.", "Ein Freistoß segelt gefährlich in den Strafraum.", "Der zweite Ball landet direkt bei {S}.", "Die Defensive bekommt keinen Zugriff auf die Situation.", "Nach einem Standard zeigt {S} seinen Torriecher.", "Eine präzise Hereingabe bringt die Abwehr in Bedrängnis.", "Der Ball springt durch den Strafraum und landet bei {S}.", "Nach einer Ecke entsteht plötzlich viel Platz für {S}.", "Die Standardspezialisten von {Team} liefern perfekte Vorarbeit.", "Eine scharfe Hereingabe zwingt die Defensive zu Fehlern.", "Der Freistoß sorgt für mächtig Verkehr vor dem Tor.", "Nach einer Ecke ist {S} gedankenschneller als alle anderen.", "Die Abwehr bekommt den Ball nicht aus der Gefahrenzone.", "Ein Standardhebel öffnet die Defensive des {Gegner}.", "Der Ball wird gefährlich verlängert und erreicht {S}.", "Ein präziser Standard bringt die Entscheidung ins Rollen.", "Nach dem ersten Kontakt bleibt der Ball heiß.", "Die Hereingabe sorgt für große Verwirrung im Strafraum.", "Nach einer Ecke reagiert {S} blitzschnell.", "Die Defensive verliert in der Hektik die Zuordnung.", "Der Standard kommt perfekt in den gefährlichen Raum.", "Nach einer Flanke aus ruhendem Ball entsteht die Chance.", "Die Zuordnung stimmt nicht und {S} nutzt das sofort.", "Eine einstudierte Variante überrascht den {Gegner}.", "Der Ball fällt genau vor die Füße von {S}.", "Nach einer Ecke wird die Situation immer gefährlicher.", "Der Freistoß sorgt für Panik in der Hintermannschaft.", "Die Standardvariante geht perfekt auf.", "Ein ruhender Ball entwickelt enorme Gefahr für den {Gegner}.", "Nach einer Standardsituation ist {S} zur Stelle und bestraft jeden Fehler."], "konter": ["Ein schneller Konter über {A} zerlegt die Abwehr des {Gegner}.", "Blitzschnell schaltet {Team} um und überrollt die Defensive des {Gegner}.", "Ein Konter wie aus dem Lehrbuch bringt die Abwehr komplett ins Wanken.", "Mit wenigen Kontakten spielen sich {Team} durch das gesamte Feld.", "{A} treibt den Ball nach vorne und öffnet alle Räume.", "Die Defensive wird auf dem falschen Fuß erwischt und hat keine Chance mehr.", "Was für ein Umschaltmoment von {Team}!", "{A} startet den Gegenangriff mit einem genialen ersten Pass.", "Innerhalb weniger Sekunden geht es vom eigenen Strafraum bis vor das gegnerische Tor.", "Der Konter läuft mit unglaublichem Tempo.", "Die Verteidiger kommen einfach nicht mehr hinterher.", "{Team} nutzt den freien Raum gnadenlos aus.", "Ein blitzsauber ausgespielter Gegenangriff.", "{A} beschleunigt das Spiel im perfekten Moment.", "Jetzt rollt die Kontermaschine von {Team}.", "Mit Höchstgeschwindigkeit geht es Richtung Tor.", "Die Hintermannschaft des {Gegner} wird regelrecht überfahren.", "Nur wenige Ballkontakte genügen für den gefährlichen Angriff.", "Die Defensive wird komplett auseinandergezogen.", "{A} spielt den tödlichen Pass im richtigen Moment.", "Ein schneller Gegenstoß sorgt für riesige Probleme beim Gegner.", "{Team} nutzt die Unordnung nach dem Ballgewinn perfekt aus.", "Die Räume öffnen sich plötzlich überall.", "Der Konter entwickelt sich wie aus einem Fußball-Lehrfilm.", "Ein Ballgewinn genügt und sofort wird es gefährlich.", "{A} erkennt die Überzahlsituation sofort.", "Die gesamte Aktion läuft mit beeindruckender Präzision ab.", "Die Verteidiger müssen rückwärtslaufen und verlieren die Kontrolle.", "Ein Nadelstich von {Team} mit maximaler Wirkung.", "Der Angriff nimmt rasant an Fahrt auf.", "Die Zuschauer spüren schon früh die große Chance.", "Mit Tempo und Übersicht wird der Konter perfekt ausgespielt.", "{A} treibt seine Mannschaft energisch nach vorne.", "Die Abwehr kommt einen Schritt zu spät.", "Ein Bilderbuch-Konter bringt die Entscheidung.", "{Team} nutzt die offenen Räume kompromisslos.", "Aus der eigenen Hälfte geht es direkt in Richtung Tor.", "Der Ball läuft schneller als die gegnerische Defensive.", "Ein perfekter Moment für den Gegenangriff.", "Die Umschaltbewegung von {Team} gelingt ideal.", "{A} zieht mehrere Gegenspieler auf sich und schafft Platz.", "Die Defensive wird komplett überrascht.", "Der Angriff rollt wie eine Welle auf das Tor zu.", "Die Konterchance wird eiskalt ausgespielt.", "{A} liefert den entscheidenden Impuls für den Angriff.", "Ein Gegenstoß voller Dynamik und Entschlossenheit.", "Die Verteidigung wird gnadenlos ausgekontert.", "{Team} braucht nur wenige Sekunden bis zur Torchance.", "Die gegnerische Ordnung bricht komplett auseinander.", "Ein Ballgewinn wird sofort in Tempo umgesetzt.", "Der Konter entwickelt sich mit atemberaubender Geschwindigkeit.", "{A} schickt seinen Mitspieler perfekt auf die Reise.", "Die Abwehr hat gegen das Tempo keine Antwort.", "Mit direktem Spiel wird der Gegner auseinandergezogen.", "Der Konter läuft wie auf Schienen.", "Jede Ballaktion sitzt bei diesem Gegenangriff.", "Die Überzahl wird hervorragend ausgespielt.", "Ein Tempogegenstoß von höchster Qualität.", "Die Defensive wird regelrecht zerlegt.", "Perfektes Umschaltspiel von {Team}.", "Ein Konter, der von der ersten bis zur letzten Sekunde hervorragend ausgespielt wird."], "kombination": ["Nach einem Doppelpass mit {A} steht die Abwehr plötzlich im Leeren.", "Nach einem schnellen Doppelpass mit {A} ist die Defensive des {Gegner} ausgehebelt.", "Mit wenigen Kontakten kombiniert sich {Team} sehenswert vors Tor.", "Ein blitzsauberes Zusammenspiel zwischen {A} und {S} öffnet alle Räume.", "Die Kombination läuft wie aus dem Lehrbuch.", "Mehrere Direktpässe lassen die Abwehr ins Leere laufen.", "{A} und {S} spielen sich mit traumhafter Präzision durch die Defensive.", "Die Hintermannschaft des {Gegner} kommt keinen Schritt hinterher.", "Ein perfekter Doppelpass bringt {S} in Abschlussposition.", "Das ist feinster Kombinationsfußball von {Team}.", "Mit traumhaftem Kurzpassspiel wird die Defensive auseinandergenommen.", "Die Offensive von {Team} kombiniert sich sehenswert durch das Zentrum.", "Ein Kontakt, zwei Kontakte, drei Kontakte und plötzlich ist der Weg zum Tor frei.", "Die Spieler von {Team} lassen den Ball laufen und den Gegner hinterherlaufen.", "Nach einer brillanten Passstafette steht {S} frei vor dem Tor.", "Die Kombination ist zu schnell für die Defensive des {Gegner}.", "Ein sehenswerter Spielzug bringt {S} in perfekte Position.", "Mit chirurgischer Präzision spielt sich {Team} durch die Abwehrreihe.", "Das Zusammenspiel von {A} und {S} funktioniert perfekt.", "Die Passfolge ist ein Genuss für jeden Fußballfan.", "{Team} zerlegt den Gegner mit intelligentem Kombinationsspiel.", "Die Defensive wird von einer Passstafette nach der anderen überfordert.", "Mit wenigen Berührungen spielt sich {Team} bis vors Tor.", "Ein Angriff wie aus dem Fußball-Lehrbuch.", "Der Ball läuft schneller als jeder Verteidiger.", "Nach einem herrlichen Doppelpass hat {S} freie Bahn.", "Die Kombination öffnet Räume, die zuvor nicht vorhanden waren.", "Perfekt abgestimmtes Zusammenspiel bringt die Chance.", "Die Abwehr kann dem Tempo der Kombination nicht folgen.", "Eine brillante Passfolge führt direkt zum Torabschluss.", "Mehrere Spieler sind beteiligt und am Ende profitiert {S}.", "Traumhaft herausgespielt von {Team}.", "Die Ballzirkulation des {Team} sorgt für große Probleme beim {Gegner}.", "Jeder Pass sitzt, jeder Laufweg passt.", "Die Kombination wird mit höchster Präzision vorgetragen.", "Der Gegner wird förmlich schwindelig gespielt.", "Mit direktem Spiel kombiniert sich {Team} durch die letzte Linie.", "Die Verteidiger sehen meist nur die Rücklichter des Balles.", "Ein Angriff voller Übersicht, Technik und Tempo.", "Die Passmaschine von {Team} läuft auf Hochtouren.", "Ein großartig herausgespielter Angriff bringt {S} in diese Situation."], "gegnerfehler": ["Ein Ballgewinn tief in der gegnerischen Hälfte bringt {S} in Position.", "Ein Fehler des {Gegner} lädt {S} förmlich zum Toreschießen ein.", "Ein folgenschwerer Fehlpass des {Gegner} bringt {S} in eine perfekte Position.", "Die Defensive des {Gegner} leistet sich einen entscheidenden Aussetzer.", "{S} nutzt einen schweren Fehler der Hintermannschaft eiskalt aus.", "Ein Missverständnis in der Abwehr öffnet plötzlich den Weg zum Tor.", "Der Ballverlust des {Gegner} wird sofort bestraft.", "Die Verteidiger zögern einen Moment zu lange und {S} schlägt zu.", "Ein katastrophaler Fehlpass lädt {S} förmlich zum Toreschießen ein.", "Die Klärungsaktion des {Gegner} misslingt völlig.", "{S} riecht den Fehler und setzt sofort nach.", "Ein Abstimmungsproblem in der Defensive sorgt für große Gefahr.", "Der Ball springt unglücklich vor die Füße von {S}.", "Die Abwehr bekommt den Ball nicht kontrolliert geklärt.", "Ein technischer Fehler bringt die Ordnung des {Gegner} zum Einsturz.", "Da fehlt die Kommunikation in der Hintermannschaft.", "Der Torwart und seine Verteidiger sind sich uneinig und {S} profitiert.", "Ein unnötiger Ballverlust leitet den Angriff ein.", "Die Unsicherheit in der Defensive wird sofort bestraft.", "{S} setzt die Abwehr früh unter Druck und erzwingt den Fehler.", "Aus einer harmlosen Situation entsteht plötzlich eine Großchance.", "Die Klärung landet genau bei {S}.", "Ein Stellungsfehler öffnet eine riesige Lücke.", "Die Defensive wirkt einen Moment unsortiert.", "Der Gegner bringt sich mit einem Fehler selbst in Schwierigkeiten.", "Ein missglückter Rückpass sorgt für Alarm.", "{S} antizipiert den Fehler hervorragend.", "Die gesamte Hintermannschaft wird von der Situation überrascht.", "Ein unglücklicher Querschläger landet beim Torschützen.", "Der Ball springt von einem Verteidiger direkt in die Gefahrenzone.", "Die Abwehr verliert die Kontrolle über die Situation.", "Ein Ausrutscher bringt den gesamten Defensivverbund ins Wanken.", "{S} lauert genau auf solche Fehler.", "Der Gegner verliert den Ball an der denkbar schlechtesten Stelle.", "Ein zu riskanter Aufbau wird sofort bestraft.", "Die Defensive spielt sich selbst in Bedrängnis.", "Ein Moment der Unachtsamkeit wird zum Problem.", "{S} schnappt sich den Ball und schaltet sofort um.", "Ein kapitaler Fehler bringt die gesamte Ordnung durcheinander.", "Der Klärungsversuch entwickelt sich zur perfekten Vorlage.", "Die Hintermannschaft wirkt für einen Augenblick völlig orientierungslos.", "Ein Ballverlust unter Druck wird zum Verhängnis.", "{S} setzt aggressiv nach und erzwingt den Fehler.", "Der Gegner bekommt die Situation einfach nicht bereinigt.", "Ein ungenauer Pass wird sofort abgefangen.", "Die Defensive verliert den Überblick und wird bestraft.", "Der Ball springt von mehreren Spielern hin und her, bis {S} zuschlägt.", "Eine unglückliche Aktion bringt den Gegner ins Hintertreffen.", "{S} erkennt die Schwäche der Defensive sofort.", "Aus einem kleinen Fehler entsteht eine riesige Chance.", "Die gegnerische Abwehr hilft hier kräftig mit.", "Ein individueller Fehler öffnet plötzlich alle Räume.", "Die Hintermannschaft wirkt überrascht vom eigenen Ballverlust.", "Ein missglückter erster Kontakt bringt die Gefahr ins Rollen.", "Der Gegner verliert den Ball leichtfertig am eigenen Strafraum.", "{S} hat das richtige Gespür für solche Situationen.", "Ein Verteidiger verschätzt sich und wird sofort bestraft.", "Die Klärung landet genau dort, wo sie nicht landen darf.", "Ein unnötiger Fehler wird gnadenlos ausgenutzt.", "Die Defensive schenkt dem Gegner praktisch die Chance.", "{S} bedankt sich höflich für das unerwartete Geschenk.", "Ein Abwehrfehler mit maximalen Konsequenzen für den {Gegner}."], "solo": ["{S} erobert den Ball selbst und macht das Ding im Alleingang.", "{S} setzt sich stark durch und zieht unwiderstehlich Richtung Tor.", "{S} erobert den Ball selbst und macht sich entschlossen auf den Weg Richtung Tor.", "Mit einer starken Einzelaktion lässt {S} die Defensive alt aussehen.", "{S} setzt sich gegen mehrere Gegenspieler durch und behält die Kontrolle.", "Ein Sololauf voller Mut und Entschlossenheit von {S}.", "Die Verteidiger finden kein Mittel gegen {S}.", "{S} nimmt das Spiel selbst in die Hand.", "Mit Tempo und Technik arbeitet sich {S} durch die Hintermannschaft.", "Die Abwehrspieler können {S} nicht stoppen.", "Eine brillante Einzelaktion bringt {S} in aussichtsreiche Position.", "{S} tanzt durch die Defensive und schafft sich den nötigen Raum.", "Der Angreifer lässt einen Gegenspieler nach dem anderen stehen.", "Mit viel Dynamik dringt {S} in den Strafraum ein.", "Eine außergewöhnliche Ballkontrolle verschafft {S} den entscheidenden Vorteil.", "Der Sololauf von {S} sorgt für große Probleme beim {Gegner}.", "{S} zieht unwiderstehlich Richtung Tor.", "Die Verteidigung wird von der Entschlossenheit des Angreifers überrascht.", "{S} behauptet den Ball gegen mehrere Gegenspieler.", "Mit einer starken Körpertäuschung verschafft sich {S} Platz.", "Niemand greift entscheidend ein und {S} marschiert weiter.", "Die Defensive weicht Schritt für Schritt zurück.", "{S} zeigt seine gesamte individuelle Klasse.", "Ein Dribbling wie aus dem Lehrbuch bringt die Chance.", "Die Verteidiger kommen einfach nicht an den Ball.", "Der Angreifer übernimmt die Verantwortung und zieht durch.", "{S} lässt seinen Gegenspieler mit einer geschickten Bewegung ins Leere laufen.", "Mit beeindruckender Technik arbeitet sich {S} in die Gefahrenzone vor.", "Die Hintermannschaft des {Gegner} wird regelrecht auseinandergezogen.", "{S} nutzt jede Lücke konsequent aus.", "Ein Sololauf voller Selbstvertrauen und Überzeugung.", "Die Verteidigung wird von {S} förmlich überrannt.", "{S} nimmt es mit der gesamten Abwehr auf und gewinnt dieses Duell eindrucksvoll.", "Was für eine Einzelaktion von {S}! Die Fans stehen bereits auf.", "Der Ball klebt förmlich am Fuß von {S}, während die Gegenspieler hinterherlaufen.", "Mit unglaublicher Entschlossenheit treibt {S} den Ball nach vorne.", "Die Defensive des {Gegner} wird von {S} schwindelig gespielt.", "Ein Solo voller Tempo, Technik und Leidenschaft.", "{S} marschiert quer durch die gegnerische Hälfte und sorgt für höchste Gefahr.", "Die Zuschauer können kaum glauben, wie leicht {S} an den Verteidigern vorbeikommt.", "Eine außergewöhnliche Einzelaktion ebnet den Weg für den Abschluss.", "{S} zeigt hier die Klasse eines Unterschiedsspielers."]}, "jubel": ["{S} rennt jubelnd zur Eckfahne und reisst sich das Trikot vom Leib.", "Die ganze Mannschaft begraebt {S} unter sich.", "{S} legt eine einstudierte Jubelchoreografie hin.", "{S} kuesst das Vereinswappen und lässt sich feiern.", "Ausgelassener Jubel - {S} rutscht auf Knien über den Rasen.", "{S} breitet die Arme aus und genießt den Moment.", "Die Teamkollegen stürmen auf {S} zu und feiern ausgelassen.", "{S} zeigt auf die Fans und wird frenetisch bejubelt.", "Jubelnd lässt sich {S} von den Anhängern feiern.", "Die Ersatzspieler sprinten mit aufs Feld.", "{S} tanzt vor Freude an der Seitenlinie.", "Ein kollektiver Freudentaumel erfasst das ganze Team.", "{S} formt mit den Händen ein Herz in Richtung Tribüne.", "{S} reißt beide Arme in die Höhe und sprintet zur Kurve.", "Die gesamte Mannschaft begräbt {S} unter einer Jubeltraube.", "{S} küsst das Vereinswappen auf der Brust.", "Mit ausgebreiteten Armen gleitet {S} über den Rasen.", "Der Torschütze verschwindet in einer Wolke jubelnder Mitspieler.", "{S} schlägt voller Emotionen auf das Vereinslogo.", "Ein lauter Jubelschrei entweicht {S} beim Weg zur Eckfahne.", "Die Ersatzspieler stürmen geschlossen aufs Feld.", "{S} zeigt mit beiden Händen auf die Fans.", "Jubelnd springt {S} über die Werbebande.", "Die ganze Mannschaft rennt geschlossen zur Fankurve.", "{S} fällt auf die Knie und blickt in den Himmel.", "Die Tribüne skandiert lautstark den Namen von {S}.", "Der Torschütze wird von seinen Teamkollegen durchgeschüttelt.", "Mit geballten Fäusten feiert {S} vor den Fans.", "{S} dreht eine Ehrenrunde entlang der Tribüne.", "Ein kollektiver Freudentaumel erfasst die Mannschaft.", "Die Spieler springen sich gegenseitig in die Arme.", "{S} rennt direkt zur Trainerbank.", "Der Jubel scheint gar kein Ende mehr zu nehmen.", "{S} rutscht auf Knien quer über den Rasen.", "Mit einem Hechtsprung landet {S} vor der Kurve.", "Die Mannschaft bildet einen großen Jubelkreis.", "Der Torschütze trommelt sich voller Stolz auf die Brust.", "{S} lässt sich vom tosenden Publikum feiern.", "Ein wildes Tänzchen von {S} sorgt für zusätzliche Begeisterung.", "Die Fans feiern ihren Helden frenetisch.", "{S} umarmt als Erstes seinen Vorlagengeber.", "Die Mitspieler reißen {S} beinahe von den Füßen.", "Jubelnde Ersatzspieler springen über die Bande.", "{S} zeigt mit beiden Zeigefingern Richtung Himmel.", "Die gesamte Bank steht Kopf.", "Ein breites Grinsen ist aus dem Gesicht von {S} nicht mehr wegzubekommen.", "Die Mannschaft tanzt gemeinsam vor der Fankurve.", "{S} läuft direkt in die Arme seines Trainers.", "Die Emotionen brechen aus allen Beteiligten heraus.", "Das Stadion bebt, während {S} die Arme ausbreitet.", "Mit einem lauten Schrei feiert {S} den Treffer.", "Die Spieler bilden eine riesige Jubeltraube.", "Der Torschütze klatscht jede Hand an der Seitenlinie ab.", "{S} rennt voller Adrenalin entlang der Torauslinie.", "Die Fans liegen sich auf den Rängen in den Armen.", "Jubelnd springt {S} in die Menge seiner Mitspieler.", "Die Mannschaft feiert vor den lautesten Fans im Stadion.", "{S} zeigt auf den Rücken seines Trikots.", "Mit einer Faustbewegung feiert {S} den Moment.", "Die Ersatzbank leert sich schlagartig.", "Das gesamte Team versammelt sich um den Torschützen.", "{S} klopft sich mehrfach auf die Brust.", "Die Jubelszenen nehmen fast kein Ende.", "{S} küsst seinen Ehering und widmet den Treffer seiner Familie.", "Der Torschütze salutiert scherzhaft in Richtung Tribüne.", "Die Mannschaft springt synchron vor Freude.", "{S} posiert kurz vor den Kameras.", "Mit offenen Armen läuft {S} auf die Fans zu.", "Die Mitspieler werfen sich übereinander vor Freude.", "{S} genießt die Ovationen des Publikums.", "Eine Welle der Begeisterung rollt durchs Stadion.", "Die Kurve antwortet mit ohrenbetäubendem Jubel.", "Jubel, Emotionen und pure Erleichterung bei {Team}.", "{S} ahmt eine einstudierte Jubelbewegung nach.", "Die Mannschaft feiert diesen Treffer wie einen Titelgewinn.", "Mit einer beherzten Faustgeste feiert {S} vor den Fans.", "Die Zuschauer springen geschlossen von ihren Sitzen auf.", "{S} wird von seinen Mitspielern hochgehoben.", "Das Team bildet einen Kreis um den Torschützen.", "Ein emotionaler Ausnahmezustand auf dem Rasen.", "Der Jubel schwappt von den Spielern auf die Tribünen über.", "{S} klatscht begeistert mit den Fans ab.", "Die Euphorie kennt keine Grenzen.", "{S} trommelt auf die Eckfahne ein.", "Die Mannschaft versammelt sich vor dem Gästeblock.", "Begeisterung pur auf allen Tribünen.", "Der Torschütze schreit seine Freude heraus.", "Die Kurve feiert ununterbrochen weiter.", "{S} springt auf die Arme seiner Teamkollegen.", "Ein Meer aus jubelnden Menschen erhebt sich.", "Die Spieler bilden einen spontanen Freudentanz.", "Der Treffer sorgt für unbeschreibliche Szenen.", "Der Jubel hallt minutenlang durchs Stadion.", "{S} zeigt auf die Tribüne und bedankt sich bei den Fans.", "Die Mitspieler reißen den Torschützen mit sich.", "Ein gemeinsamer Sprint Richtung Fankurve beginnt.", "Die Spieler feiern Schulter an Schulter.", "{S} lässt sich von den Emotionen mitreißen.", "Die Zuschauer feiern ihren Matchwinner.", "Der Jubel wird von Sekunde zu Sekunde lauter.", "Die Kurve verwandelt sich in ein Tollhaus.", "{S} genießt den Moment mit geschlossenen Augen.", "Die Mannschaft feiert ausgelassen vor den Fans.", "Der Torschütze schlägt einen Purzelbaum vor Freude.", "Ein gewaltiger Jubelschrei geht durchs Stadion.", "Die Spieler tanzen ausgelassen um {S} herum.", "Die Fans skandieren immer wieder den Namen des Torschützen.", "Mit strahlendem Gesicht läuft {S} zum Mittelkreis zurück.", "Die Mannschaft feiert diesen Treffer als Wendepunkt der Partie.", "Emotionen, wohin man blickt.", "Der Jubel auf den Rängen übertrifft jede Erwartung.", "{S} wird zum Mittelpunkt einer riesigen Jubelgruppe.", "Das Stadion versinkt in einer einzigen, gewaltigen Welle der Begeisterung."], "trainerTor": ["Auf der Bank des {Team} ballt der Trainer die Faust.", "Der Trainer des {Team} springt jubelnd von der Bank auf.", "An der Seitenlinie des {Team} gibt es kein Halten mehr.", "Der Coach des {Team} klatscht zufrieden in die Haende.", "Der Trainer des {Team} reißt beide Arme nach oben.", "Auf der Bank des {Team} brechen alle Dämme.", "Erleichterung steht dem Coach des {Team} ins Gesicht geschrieben.", "Der Trainer jubelt gemeinsam mit seinem Betreuerstab.", "Großer Jubel entlang der Seitenlinie des {Team}.", "Der Coach applaudiert begeistert in Richtung Spielfeld.", "Die Bank des {Team} feiert den Treffer ausgelassen.", "Ein breites Grinsen macht sich beim Trainer des {Team} breit.", "Der Trainer reißt beide Arme nach oben und brüllt seine Freude heraus.", "Pure Erleichterung macht sich beim Coach des {Team} breit.", "Der Trainer sprintet mehrere Meter entlang der Seitenlinie.", "Jetzt hält es den Coach nicht mehr auf seinem Platz.", "Der Trainer ballt beide Fäuste und feiert ausgelassen.", "Jubelnd springt der Coach seinem Assistenten in die Arme.", "Die gesamte Bank erhebt sich geschlossen von ihren Sitzen.", "Der Trainer applaudiert begeistert in Richtung Spielfeld.", "Ein breites Grinsen macht sich im Gesicht des Coaches breit.", "Der Trainer feiert diesen Treffer wie einen Titelgewinn.", "Auf der Bank des {Team} herrscht Ausnahmezustand.", "Der Coach schreit seine Freude lautstark heraus.", "Die Emotionen brechen ungefiltert aus dem Trainer heraus.", "Der Trainer klatscht begeistert mit seinem Betreuerstab ab.", "Jubelnde Ersatzspieler reißen den Coach gleich mit.", "Die Trainerbank verwandelt sich in eine einzige Jubelzone.", "Der Coach zeigt jubelnd Richtung Tribüne.", "Großer Jubel entlang der gesamten Seitenlinie.", "Der Trainer genießt diesen Moment sichtbar.", "Der Coach springt mehrfach vor Freude in die Luft.", "Jetzt feiern Spieler und Trainer gemeinsam.", "Der Trainer reißt die Faust energisch nach oben.", "Die Erleichterung ist dem Coach deutlich anzusehen.", "Der Treffer löst einen Jubelsturm auf der Bank aus.", "Der Trainer umarmt seine engsten Mitarbeiter.", "Pure Begeisterung beim gesamten Trainerstab.", "Der Coach applaudiert ununterbrochen Richtung Mannschaft.", "Die Freude ist der gesamten Bank anzumerken.", "Der Trainer läuft jubelnd bis an die Außenlinie.", "Die Anspannung fällt schlagartig vom Trainer ab.", "Der Coach kann sein Lächeln kaum verbergen.", "Die komplette Bank springt gleichzeitig auf.", "Der Trainer feiert voller Leidenschaft.", "Glückseligkeit macht sich auf der Bank des {Team} breit.", "Der Coach blickt jubelnd Richtung Himmel.", "Jetzt kennt die Begeisterung keine Grenzen mehr.", "Der Trainer schüttelt vor Freude ungläubig den Kopf.", "Spontan bilden Trainer und Ersatzspieler einen Jubelkreis.", "Der Coach genießt die Reaktion der Fans.", "Die Fäuste fliegen nach oben, die Emotionen kochen über.", "Der Trainer rennt jubelnd die Coaching-Zone entlang.", "Erleichterung und Freude vermischen sich beim Coach.", "Die Trainerbank explodiert förmlich vor Begeisterung.", "Der Trainer applaudiert energisch für seine Mannschaft.", "Jetzt wird auf der Bank lautstark gefeiert.", "Die gesamte Seitenlinie steht Kopf.", "Der Coach lässt seinen Emotionen freien Lauf.", "Jubelnde Szenen auf der Bank des {Team}.", "Der Trainer wirkt wie befreit.", "Dieser Treffer lässt den Coach völlig ausrasten.", "Der Trainer springt seinem Co-Trainer lachend in die Arme.", "Die gesamte Bank jubelt im Kollektiv.", "Der Coach schickt begeistert die Fäuste in den Himmel.", "Die Freude des Trainers steckt die gesamte Bank an.", "Jetzt feiert jeder auf seine Art.", "Der Coach dreht sich jubelnd zur Tribüne um.", "Ein emotionaler Moment für den Trainer des {Team}.", "Der Treffer sorgt für explosive Szenen an der Seitenlinie.", "Der Trainer kann seine Begeisterung kaum kontrollieren.", "Die Coaching-Zone wird zur Partylandschaft.", "Der Coach bedankt sich jubelnd bei seinen Spielern.", "Die Bank feiert diesen Treffer mit voller Hingabe.", "Der Trainer reißt die Arme weit auseinander.", "Ein emotionales Feuerwerk auf der Seitenlinie.", "Der Coach tanzt einen kleinen Freudentanz.", "Alles fällt von den Schultern des Trainers ab.", "Jetzt werden sämtliche Emotionen sichtbar.", "Der Treffer trifft den Coach mitten ins Herz.", "Jubelschreie hallen von der Bank über das Feld.", "Der Trainer klatscht euphorisch Beifall.", "Die Freude kennt auf der Bank keine Grenzen.", "Der Coach wirkt überwältigt von den Emotionen.", "Die Ersatzspieler feiern direkt neben dem Trainer.", "Der Jubel auf der Bank steht dem auf den Rängen in nichts nach.", "Der Trainer hebt beide Hände triumphierend in die Luft.", "Eine Welle der Begeisterung rollt durch den gesamten Stab.", "Der Coach applaudiert voller Stolz.", "Die Trainerbank erlebt ihren großen Moment.", "Der Treffer sorgt für pure Euphorie.", "Der Trainer schreit seine Freude von der Seele.", "Auf der Bank fällt die letzte Anspannung ab.", "Der Coach feiert mit glänzenden Augen.", "Die Seitenlinie bebt vor Begeisterung.", "Jubelnde Umarmungen wohin man schaut.", "Der Trainer wirkt wie elektrisiert.", "Die Euphorie auf der Bank greift um sich.", "Der Coach reißt jubelnd die Fäuste vors Gesicht.", "Der Treffer sorgt für strahlende Gesichter.", "Die gesamte Bank erlebt einen Moment der Ekstase.", "Der Trainer feiert diesen Treffer, als wäre es der Siegtreffer.", "Pure Leidenschaft an der Seitenlinie.", "Die Begeisterung ist dem Coach ins Gesicht geschrieben.", "Der Trainer applaudiert begeistert in Richtung Fans.", "Ein emotionaler Ausbruch des gesamten Trainerstabs.", "Die Freude dieses Moments lässt sich nicht verbergen.", "Der Treffer löst grenzenlosen Jubel auf der Bank aus.", "Der Coach genießt jede Sekunde dieses Augenblicks.", "Die Trainerbank versinkt in einer Welle der Begeisterung.", "Dieser Treffer sorgt für einen unvergesslichen Jubelmoment beim Trainer des {Team}."], "trainerGegner": ["An der Bank des {Gegner} herrscht betretenes Schweigen.", "Der Trainer des {Gegner} schuettelt fassungslos den Kopf.", "Der Coach des {Gegner} brüllt Anweisungen auf das Feld.", "Auf der Gegnerbank fliegt frustriert die Wasserflasche.", "Der Trainer des {Gegner} wirkt bedient.", "Ratlose Blicke auf der Bank des {Gegner}.", "Der Coach des {Gegner} verschränkt enttäuscht die Arme.", "Auf der Gästebank macht sich Frust breit.", "Der Trainer des {Gegner} diskutiert lautstark mit seinem Assistenten.", "Die Reaktion beim {Gegner} fällt entsprechend ernüchtert aus.", "Kopfschütteln und Unverständnis auf der Bank des {Gegner}.", "Der Gegentrainer fordert sofort mehr Konzentration ein.", "Auf der Bank des {Gegner} herrscht betretenes Schweigen.", "Der Trainer des {Gegner} schlägt die Hände über dem Kopf zusammen.", "Fassungslos blickt der Coach auf das Spielfeld.", "Der Gegentreffer sorgt für blankes Entsetzen auf der Bank.", "Der Trainer schüttelt ungläubig den Kopf.", "Ratlose Blicke beim gesamten Trainerteam.", "Der Coach tritt frustriert gegen die Getränkekiste.", "Die Enttäuschung ist dem Trainer deutlich anzusehen.", "Wut und Frust machen sich an der Seitenlinie breit.", "Der Trainer fordert sofort mehr Konzentration.", "Der Coach diskutiert lautstark mit seinem Assistenten.", "Die Stimmung auf der Bank kippt schlagartig.", "Der Trainer blickt konsterniert zur Anzeigetafel.", "Auf der Gegenseite herrscht Schockstarre.", "Frustriert läuft der Coach die Seitenlinie entlang.", "Der Trainer kann den Gegentreffer kaum fassen.", "Jetzt wird es laut auf der Bank des {Gegner}.", "Der Coach ringt sichtbar mit seinen Emotionen.", "Große Ernüchterung beim gesamten Trainerstab.", "Der Trainer sucht sofort das Gespräch mit seinen Assistenten.", "Der Gegentreffer sitzt tief.", "Der Coach wirkt völlig bedient.", "Enttäuscht verschränkt der Trainer die Arme.", "Ungläubig blickt der Coach auf seine Mannschaft.", "Die Reaktion des Trainers spricht Bände.", "Auf der Bank macht sich Frust breit.", "Der Trainer tritt nervös von einem Bein aufs andere.", "Der Coach fordert energisch eine Reaktion.", "Die Mienen auf der Bank verfinstern sich.", "Der Gegentreffer trifft den Trainer ins Mark.", "Der Coach läuft hektisch durch die Coaching-Zone.", "Frustrierte Gesten auf der Bank des {Gegner}.", "Der Trainer zeigt seinen Spielern sofort klare Anweisungen.", "Die Ernüchterung macht sich überall bemerkbar.", "Der Coach wirkt sichtlich enttäuscht.", "Jetzt ist Schadensbegrenzung angesagt.", "Auf der Bank des {Gegner} herrscht Alarmstimmung.", "Der Trainer blickt fassungslos ins Leere.", "Ratlosigkeit dominiert die Seitenlinie.", "Die Enttäuschung ist greifbar.", "Der Coach reagiert mit einem wütenden Tritt gegen eine Wasserflasche.", "Jetzt versucht der Trainer seine Mannschaft wieder aufzurichten.", "Der Gegentreffer sorgt für lange Gesichter.", "Der Coach zeigt unmissverständlich seinen Unmut.", "Die gesamte Bank wirkt geschockt.", "Der Trainer kann kaum glauben, was gerade passiert ist.", "Der Frust entlädt sich in wilden Gesten.", "Aufmunternde Worte sollen die Mannschaft zurück ins Spiel bringen.", "Der Coach fordert sofort mehr Aggressivität.", "Entsetzen beim gesamten Betreuerstab.", "Der Trainer blickt kopfschüttelnd Richtung Himmel.", "Auf der Bank herrscht pure Ernüchterung.", "Der Coach versucht Ruhe in die Situation zu bringen.", "Frustration macht sich breit.", "Der Trainer wirkt sichtlich angeschlagen.", "Es wird intensiv diskutiert auf der Bank des {Gegner}.", "Der Coach schaut fragend in Richtung seiner Defensive.", "Der Treffer sorgt für Unruhe im gesamten Trainerteam.", "Die Körpersprache des Trainers verrät alles.", "Auf der Gegenseite herrscht Ausnahmezustand, allerdings im negativen Sinn.", "Der Coach fordert sofort eine Reaktion seiner Mannschaft.", "Der Trainer läuft nervös vor der Bank auf und ab.", "Die Enttäuschung lässt sich nicht verbergen.", "Der Gegentreffer sorgt für sichtbare Verzweiflung.", "Der Trainer presst die Lippen aufeinander.", "Frustriert blickt der Coach in Richtung Spielfeld.", "Der Treffer wirbelt die Planungen des Trainers durcheinander.", "Der Coach wirkt zunehmend ratlos.", "Große Sorgenfalten auf der Stirn des Trainers.", "Der Gegentreffer schlägt wie ein Nackenschlag ein.", "Der Trainer versucht seine Emotionen zu kontrollieren.", "Die Bank des {Gegner} steht unter Schock.", "Der Coach blickt seine Spieler eindringlich an.", "Jetzt sind Führungsqualitäten gefragt.", "Auf der Seitenlinie macht sich Nervosität breit.", "Der Trainer fordert lautstark Ordnung.", "Das Trainerteam diskutiert mögliche Umstellungen.", "Der Coach schüttelt ununterbrochen den Kopf.", "Der Treffer sorgt für spürbare Verunsicherung.", "Aufmunternde Gesten sollen die Moral stärken.", "Der Trainer wirkt wie vom Donner gerührt.", "Der Coach blickt enttäuscht zu Boden.", "Große Ratlosigkeit auf der Bank des {Gegner}.", "Der Gegentreffer verändert die Stimmung schlagartig.", "Frust und Enttäuschung dominieren die Seitenlinie.", "Der Trainer kämpft sichtbar mit seiner Fassung.", "Die Belastung dieses Moments steht ihm ins Gesicht geschrieben.", "Der Coach blickt ungläubig auf die Anzeigetafel.", "Die Reaktion des Trainers fällt entsprechend heftig aus.", "Auf der Bank macht sich Resignation breit.", "Der Coach stemmt die Hände in die Hüften und sucht nach Antworten.", "Jetzt ist der Trainer gefordert, seine Mannschaft neu einzustellen.", "Die Enttäuschung schlägt in Wut um.", "Der Gegentreffer sorgt für kollektives Kopfschütteln.", "Der Trainer versucht sofort gegenzusteuern.", "Die Stimmung auf der Bank erreicht einen Tiefpunkt.", "Der Coach wirkt völlig konsterniert.", "Auf der Seite des {Gegner} herrscht blankes Entsetzen.", "Dieser Gegentreffer hinterlässt deutliche Spuren beim Trainerstab.", "Der Trainer des {Gegner} sucht verzweifelt nach einer Antwort auf diesen Rückschlag."], "zuschauer": ["Die Zuschauer sind aus dem Häuschen!", "Ein Raunen und dann Jubel auf den Rängen.", "Die Fans feiern ihren Helden frenetisch.", "Das Stadion bebt bis in die Grundmauern!", "Die Fans springen geschlossen von ihren Sitzen auf.", "Ein gewaltiger Jubelsturm fegt durch die Arena.", "Die Zuschauer sind völlig aus dem Häuschen.", "Pure Ekstase auf den Rängen von {Stadt}.", "Tausende Arme schnellen gleichzeitig nach oben.", "Die Tribünen verwandeln sich in ein Tollhaus.", "Jubelschreie hallen durchs gesamte Stadion.", "Die Fans feiern diesen Treffer frenetisch.", "Das Publikum liegt sich in den Armen.", "Die Arena steht komplett Kopf.", "Ein ohrenbetäubender Lärm erfüllt das Rund.", "Die Fans können ihr Glück kaum fassen.", "Der Jubel ist bis weit außerhalb des Stadions zu hören.", "Begeisterung kennt jetzt keine Grenzen mehr.", "Die Zuschauer feiern ihren Helden lautstark.", "Die Stimmung erreicht ihren absoluten Höhepunkt.", "Das Stadion explodiert vor Freude.", "Die Tribünen geraten in einen Ausnahmezustand.", "Die Anhänger des {Team} feiern ausgelassen.", "Ein gewaltiges Raunen geht in Jubel über.", "Die Fans reißen begeistert die Arme nach oben.", "Die Zuschauer feiern, als gäbe es kein Morgen.", "Die Kurve verwandelt sich in ein einziges Fahnenmeer.", "Die Anhänger skandieren lautstark den Namen von {S}.", "Die Stimmung ist elektrisierend.", "Das Publikum bedankt sich mit tosendem Applaus.", "Jubelnde Gesichter wohin man auch blickt.", "Die Ränge werden von einer Euphoriewelle erfasst.", "Begeisterung pur auf allen Tribünen.", "Das Stadion erlebt einen Gänsehautmoment.", "Die Fans singen aus voller Kehle.", "Die Zuschauer feiern diesen Treffer wie einen Titelgewinn.", "Die Atmosphäre ist schlichtweg sensationell.", "Die Arena verwandelt sich in einen Hexenkessel.", "Überall wird gejubelt und gefeiert.", "Die Zuschauer können kaum stillstehen vor Freude.", "Jubel brandet von allen Seiten auf.", "Die Kurve bebt vor Begeisterung.", "Das Publikum liefert die passende Antwort auf diesen Treffer.", "Die Fans feiern jede Wiederholung auf der Anzeigetafel.", "Die Zuschauer verlieren völlig die Kontrolle über ihre Emotionen.", "Die Begeisterung schwappt durch alle Stadionbereiche.", "Das gesamte Rund steht geschlossen auf.", "Die Fans liegen einander jubelnd in den Armen.", "Die Tribünen werden von einem Freudentaumel erfasst.", "Der Lärmpegel erreicht neue Höchstwerte.", "Die Stimmung ist kaum in Worte zu fassen.", "Die Zuschauer feiern ihren Liebling.", "Die Arena versinkt in einer Welle der Begeisterung.", "Die Fans danken ihrer Mannschaft mit lautem Beifall.", "Das Publikum erlebt einen unvergesslichen Moment.", "Die Ränge explodieren förmlich vor Freude.", "Die Zuschauer feiern jede Sekunde dieses Augenblicks.", "Die Kurve antwortet mit lautstarken Sprechchören.", "Das Stadion entwickelt eine unglaubliche Energie.", "Jeder Fan scheint gerade zu jubeln.", "Die Begeisterung kennt keine Altersgrenzen.", "Die Arena wird von Emotionen überrollt.", "Jubelnde Fans prägen das Bild auf den Tribünen.", "Das Publikum feiert diesen Treffer aus voller Leidenschaft.", "Die Zuschauer treiben ihre Mannschaft weiter nach vorne.", "Die Euphorie ist in jeder Ecke des Stadions spürbar.", "Die Ränge geraten ins Wanken vor Begeisterung.", "Der Treffer sorgt für grenzenlosen Jubel.", "Das Stadion antwortet mit einem gewaltigen Lärmorkan.", "Die Fans verwandeln die Arena in ein Tollhaus.", "Die Begeisterung springt von Reihe zu Reihe über.", "Die Zuschauer feiern diesen Moment gemeinsam.", "Ein unvergesslicher Jubelsturm zieht durchs Stadion.", "Die Kurve singt nun noch lauter als zuvor.", "Euphorische Szenen auf allen Tribünen.", "Das Publikum feiert den Treffer mit jeder Faser.", "Gänsehaut macht sich im gesamten Stadion breit.", "Die Fans springen auf den Wellen der Begeisterung mit.", "Die Arena ist komplett elektrisiert.", "Der Jubel scheint das Dach wegtragen zu wollen.", "Tausende Kehlen schreien ihre Freude heraus.", "Die Zuschauer erleben pure Fußballmagie.", "Die Fans zelebrieren diesen Treffer minutenlang.", "Das Stadion wird zu einem Meer aus Jubel.", "Begeisterte Anhänger feiern lautstark mit.", "Eine unbeschreibliche Stimmung herrscht auf den Rängen.", "Die Zuschauer lassen ihren Emotionen freien Lauf.", "Der Jubel steigert sich immer weiter.", "Das Publikum explodiert förmlich vor Freude.", "Die Fans genießen jeden einzelnen Moment.", "Die Arena erlebt einen ihrer lautesten Augenblicke.", "Die Zuschauer verwandeln das Stadion in einen Hexenkessel.", "Die Freude ist auf jedem Tribünenplatz sichtbar.", "Das Publikum feiert den Torschützen wie einen Superstar.", "Die Stimmung erreicht absolutes Endspielniveau.", "Ein Meer aus Schals wird in die Höhe gestreckt.", "Die Fans sorgen für eine unvergleichliche Atmosphäre.", "Der Jubel rollt wie eine Welle durchs Stadion.", "Die Zuschauer geraten in kollektive Ekstase.", "Die Begeisterung kennt keine Grenzen mehr.", "Das ganze Stadion scheint zu tanzen.", "Die Fans feiern diesen Moment für die Ewigkeit.", "Das Stadion versinkt in einer gewaltigen Welle aus Jubel, Leidenschaft und Begeisterung."]};
    let homeCoach = '', awayCoach = '', vorentschUsed = false;
    const GBA_STRIP = s => (s || '').replace(/<[^>]+>/g, ' ');
    const gbaType = t => {
      if (/Elfmeter|Strafsto(ß|ss)|vom Punkt/i.test(t)) return 'elfmeter';
      if (/Freisto(ß|ss)/i.test(t)) return 'freistoss';
      if (/k(ö|oe)pft|Kopfball|Flugkopfball|\bnickt\b|per Kopf|Kopfsto(ß|ss)/i.test(t)) return 'kopfball';
      if (/Heber|Lupfer|lupft|hebt (den Ball|die Kugel).{0,24}(ü|ue)ber|Bogenlampe|hebt.{0,10}(ü|ue)ber den/i.test(t)) return 'heber';
      if (/Distanz|aus (?:(ü|ue)ber )?\d+\s*Metern|zweite[rn]? Reihe|Fernschuss|aus der Ferne|aus gut \d+/i.test(t)) return 'distanz';
      if (/Vollspann|h(ä|ae)mmert|drischt|wuchtig|Granate|\bStrahl\b|knallt|\bHammer\b|zimmert|Geschoss|feuert|pr(ü|ue)gelt|Kanonen/i.test(t)) return 'wuchtschuss';
      if (/Schlenzer|zirkelt|Effet|schlenzt|Au(ß|ss)enrist|platziert|gef(ü|ue)hlvoll|schiebt|ins lange Eck|ins kurze Eck|Kunstschuss|Innenpfosten/i.test(t)) return 'platziert';
      if (/Abstauber|staubt|stochert|Nachschuss|Abpraller|Gew(ü|ue)hl|abgef(ä|ae)lscht|dr(ü|ue)ckt|Gest(ö|oe)ber/i.test(t)) return 'abstauber';
      if (/tankt|umkurvt|\bSolo\b|Dribbling|setzt sich (bullig )?durch|Alleingang|schl(ä|ae)ngelt|umspielt/i.test(t)) return 'solo';
      return 'neutral';
    };
    const gbaEnt = (prep, assist) => {
      if (/\bEcke\b|Eckball|Freisto(ß|ss)|Standardsituation|nach einer Flanke/i.test(prep)) return 'standard';
      if (/Fehler|Ballverlust|Ballgewinn|vert(ä|ae)ndelt|Fehlpass|abgefangen|erobert.{0,12}Ball|Missverst(ä|ae)ndnis|Aussetzer|verstolpert/i.test(prep)) return 'gegnerfehler';
      if (/Konter|Umschalt|Gegensto(ß|ss)|Gegenangriff/i.test(prep)) return 'konter';
      if (/Doppelpass|Kombination|Zusammenspiel|Direktpass|kombiniert/i.test(prep)) return 'kombination';
      return assist ? 'vorlage' : 'solo';
    };
    const goalComment = (scoredHome, pf, pa, nf, na2, scorer, minute, assist, rowHtml) => {
      const scTeam = scoredHome ? home : away, coTeam = scoredHome ? away : home;
      const sFor_b = scoredHome ? pf : pa, sAg_b = scoredHome ? pa : pf, sFor_a = sFor_b + 1;
      const late = minute >= 85, side = scoredHome ? 'h' : 'a';
      const sHtml = '<b>' + scorer + '</b>', aHtml = assist ? '<b>' + assist + '</b>' : '';
      const cityOf = n => (n || '').split(/\s+/).filter(Boolean).pop() || n;
      const fill = t => t.replace(/\{S\}/g, sHtml).replace(/\{A\}/g, aHtml).replace(/\{Team\}/g, scTeam).replace(/\{Gegner\}/g, coTeam).replace(/\{Stadt\}/g, cityOf(scTeam));
      // Torzeile + Vorlauf aus dem Original bestimmen
      const lines = GBA_STRIP(rowHtml).split(/\s{2,}|\n/).map(x => x.trim()).filter(Boolean);
      let gi = lines.findIndex(l => /\bTO+R\b/.test(l));
      if (gi < 0) gi = lines.length - 1;
      const goalLine = lines[gi] || '', prep = lines.slice(Math.max(0, gi - 3), gi).join(' ');
      const scType = gbaType(goalLine), entKey = gbaEnt(prep, assist);
      // Kontextsatz bei markanten Staenden
      let ctx = '';
      if (sFor_b === sAg_b && sFor_b === 0) ctx = pickNR(['Das 1:0 \u2013 der Bann ist gebrochen!', 'Die erste F\u00fchrung der Partie!']);
      else if (sFor_a === sAg_b) ctx = pickNR(['Der Ausgleich \u2013 die Partie ist neu er\u00f6ffnet!', scTeam + ' schl\u00e4gt zur\u00fcck und gleicht aus!']);
      else if (sFor_b < sAg_b) { const defAfter = sAg_b - sFor_a; if (defAfter === 1) ctx = late ? 'Der Anschlusstreffer in der Schlussphase \u2013 jetzt wird es dramatisch!' : 'Der Anschlusstreffer \u2013 es wird nochmal spannend!'; else if (defAfter >= 3) ctx = pickNR(['Reine Ergebniskosmetik beim klaren R\u00fcckstand.', 'Ein Treffer f\u00fcrs Ergebnis \u2013 an der Niederlage \u00e4ndert das nichts.', 'Zu wenig, zu sp\u00e4t \u2013 blo\u00dfe Kosmetik.']); else ctx = 'Der R\u00fcckstand schmilzt, doch die Aufgabe bleibt gro\u00df.'; }
      else if (sFor_b === sAg_b) ctx = scTeam + ' dreht die Partie und geht in F\u00fchrung!';
      else if (sFor_a - sAg_b >= 3) {
        if (!vorentschUsed) { ctx = 'Das d\u00fcrfte die Vorentscheidung sein.'; vorentschUsed = true; }
        else ctx = pickNR([scTeam + ' schraubt das Ergebnis in die H\u00f6he.', 'Ein weiterer Nackenschlag f\u00fcr ' + coTeam + '.', scTeam + ' legt nach und baut die F\u00fchrung aus.', 'Das wird eine deutliche Angelegenheit.', coTeam + ' ist l\u00e4ngst geschlagen, ' + scTeam + ' spielt frei auf.', 'Die Frage ist nur noch, wie hoch ' + scTeam + ' am Ende gewinnt.', scTeam + ' setzt die \u00dcberlegenheit eindrucksvoll fort.']);
      }
      const B = GOALBOX_A;
      const trainerLine = () => {
        const useTor = Math.random() < 0.5;
        const pool = useTor ? B.trainerTor : B.trainerGegner; if (!pool || !pool.length) return '';
        const teamName = useTor ? scTeam : coTeam;
        const cSide = useTor ? (scoredHome ? 'h' : 'a') : (scoredHome ? 'a' : 'h');
        let t = pickNR(pool);
        if (!/\{Team\}|\{Gegner\}/.test(t)) t = 'Auf der ' + teamName + '-Bank: ' + t;
        if (Math.random() < 0.5) t = t.replace(/\bDer (?:Gegen)?[Tt]rainer\b|\bDer Coach\b/, m => '<span class="os-cn" data-s="' + cSide + '" data-fmt="trainer">' + m + '</span>');
        return t;
      };
      const desc = [];
      if (ctx) desc.push(ctx);
      let eP = (B.ent[entKey] || []).slice(); if (!assist) eP = eP.filter(e => !/\{A\}/.test(e));
      if (!eP.length) eP = (B.ent.solo || []).filter(e => !/\{A\}/.test(e));
      if (eP.length && Math.random() < 0.85) desc.push(fill(pickNR(eP)));
      let tP = (B.tb[scType] && B.tb[scType].length) ? B.tb[scType] : B.tb.neutral;
      if (tP && tP.length) desc.push(fill(pickNR(tP)));
      const react = [];
      if (B.jubel && B.jubel.length && Math.random() < 0.6) react.push(fill(pickNR(B.jubel)));
      if (Math.random() < 0.55) { const tl = trainerLine(); if (tl) react.push(fill(tl)); }
      if (react.length < 2 && B.zuschauer && B.zuschauer.length && Math.random() < 0.45) react.push(fill(pickNR(B.zuschauer)));
      const conn = ['Und ', 'Dann ', 'Anschlie\u00dfend ', 'Derweil '];
      const reactJoined = react.map((s, i) => (i > 0 && Math.random() < 0.45 && !/^Auf der /.test(s)) ? (conn[Math.floor(Math.random() * conn.length)] + s.charAt(0).toLowerCase() + s.slice(1)) : s);
      return '\u26bd <b>TOR!</b> ' + desc.concat(reactJoined).join(' ');
    };

    // ===== Stadion-Atmosphäre (variantenreich) =====
    const ATMO = {
      heimNormal: ['Zufriedener Applaus auf den Rängen.', 'Die Heimfans quittieren den Treffer mit Beifall.', 'Solider Jubel im weiten Rund.', 'Anerkennendes Klatschen von den Tribünen.', 'Erleichtertes Aufatmen und Applaus im Stadion.'],
      heimAussichtslos: ['Nur vereinzelter Applaus – beim klaren Rückstand mag keine echte Freude aufkommen.', 'Ergebniskosmetik – die Ränge reagieren verhalten.', 'Ein Pflichtapplaus, mehr gibt der Spielstand nicht her.', 'Die Fans quittieren den Treffer nüchtern.', 'Ein müder Jubel – die Niederlage ist längst besiegelt.', 'Freundlicher Applaus, doch die Hoffnung ist dahin.'],
      raunen: ['Ein Raunen geht durch das Stadion.', 'Ein kollektives Aufstöhnen auf den Rängen!', 'Aaahh – das ganze Rund stockt kurz.', 'Die Zuschauer fassen sich an den Kopf.', 'Ein Aufschrei, dann Stöhnen – so knapp!', 'Die Ränge halten kollektiv die Luft an.'],
      heimGross: ['Die Ränge explodieren – ein Jubelsturm im ganzen Stadion!', 'Ohrenbetäubender Jubel brandet auf!', 'Das Stadion bebt, die Fans liegen sich in den Armen!', 'Ein gewaltiger Jubelschrei rollt über die Tribünen!', 'Die Heimkurve kocht – Jubelarien im Rund!'],
      heimEkstase: ['EKSTASE auf den Rängen – das Stadion steht Kopf!', 'Der Hexenkessel kocht über – unbeschreibliche Szenen!', 'Die Fans rasten völlig aus – Gänsehaut pur!', 'Grenzenloser Jubel – die Tribünen beben bis in die Grundmauern!', 'Pure Ekstase! Das ganze Stadion ist ein einziges Tollhaus!'],
      gast: ['Es wird schlagartig still im Rund – nur der Gästeblock feiert lautstark.', 'Betretenes Schweigen auf den Heimrängen, Jubel im Gästeblock.', 'Die Heimfans verstummen, der mitgereiste Anhang tobt.', 'Stille im Stadion – einzig die Gästefans bejubeln den Treffer.', 'Ein Raunen geht durchs Rund, während die Gästekurve explodiert.'],
      gelbGastApplaus: ['Zustimmender Applaus der Heimfans für die Entscheidung.', 'Beifall auf den Rängen – die Fans goutieren die Karte.', 'Die Heimkurve klatscht anerkennend.', 'Zufriedenes Nicken und Applaus von den Tribünen.'],
      gelbHeimPfiff: ['Pfiffe und Unmut auf den Rängen gegen die Entscheidung.', 'Ein Pfeifkonzert brandet auf – die Fans hadern mit dem Schiri.', 'Empörtes Raunen im Stadion.', 'Die Heimkurve protestiert lautstark gegen die Karte.'],
      rotGastJubel: ['Riesenjubel und Applaus – die Heimfans feiern den Platzverweis.', 'Die Ränge bejubeln die Karte lautstark.', 'Höhnischer Applaus verabschiedet den Gästespieler.', 'Genugtuung auf den Tribünen – die Fans feiern die Entscheidung.'],
      rotHeimPfiff: ['Wütende Pfiffe und Unmut gegen die Entscheidung.', 'Ein gellendes Pfeifkonzert hallt durchs Stadion.', 'Die Heimfans protestieren lautstark gegen den Platzverweis.', 'Empörung auf den Rängen – die Kurve tobt gegen den Schiri.'],
      grobFoulHeim: ['Betretenes Schweigen – bei dieser Härte bleibt der Protest aus.', 'Nur vereinzeltes Raunen; das Foul war unstrittig.', 'Kein Widerspruch von den Rängen – die Aktion war klar.', 'Die Heimfans halten sich zurück, die Karte war verdient.']
    };
    const atmoGoalKey = (scoredHome, nf, na, minute) => {
      if (!scoredHome) return 'gast';
      const lead = nf - na, wasLead = (nf - 1) - na;
      const ausgleich = lead === 0, fuehrung = lead > 0 && wasLead <= 0, anschluss = lead === -1;
      if ((ausgleich || fuehrung) && minute >= 80) return 'heimEkstase';
      if (ausgleich || fuehrung || anschluss) return 'heimGross';
      if (lead <= -3) return 'heimAussichtslos';
      return 'heimNormal';
    };
    const atmoCardKey = (side, type, grob) => {
      const heim = side === 'h';
      if (heim && grob) return 'grobFoulHeim';
      if (type === 'red' || type === 'yellowred') return heim ? 'rotHeimPfiff' : 'rotGastJubel';
      return heim ? 'gelbHeimPfiff' : 'gelbGastApplaus';
    };
    const atmoInner = txt => '📣 ' + txt.replace(/'(.+)'/, "<span class='os-chant'>'$1'</span>");
    const fanSide = key => (key === 'gast' || key === 'endeGastsieg') ? 'a' : 'h';
    const loudness = (min, h, a) => { let l = min < 25 ? 0 : min < 75 ? 1 : 2; const m = Math.abs(h - a); if (m <= 1) l += 1; if (min >= 80 && m <= 1) l += 1; if (m >= 4) l -= 1; return Math.max(0, Math.min(3, l)); };
    const atmoLine = key => { const p = ATMO[key]; if (!p || !p.length) return ''; return emo(atmoInner(pickNR(p))); };
    const ATMO_FAN = {"beginn": ["Die Vereinshymne von {Team} erklingt - tausende Schals werden geschwenkt.", "Ohrenbetäubender Empfang beim Einlauf der Mannschaften!", "Die Fans schmettern lautstark die Hymne, das ganze Rund ist eine Farbenmeer.", "Eine gewaltige Choreografie empfängt die Teams in {Stadt}.", "Die Tribünen beben vor Vorfreude auf den Anpfiff.", "Gänsehautstimmung im Stadion, begleitet von Fahnen und Gesängen.", "Die Fans von {Team} setzen mit einem Banner ein beeindruckendes Zeichen.", "Ein Meer aus Schals erhebt sich in {Stadt}.", "Die Atmosphäre knistert bereits Minuten vor dem Anstoß.", "Die Anhänger begrüßen ihre Mannschaft mit tosendem Applaus."], "heimAllg": ["Die Kurve stimmt an: 'Oh wie ist das schön!'", "Rhythmisches Klatschen treibt {Team} nach vorne.", "'Auf geht's {Stadt}, kämpfen und siegen!' hallt es von den Rängen.", "'Nur der {Team}!' hallt durch das Stadion.", "Die Heimfans sorgen pausenlos für lautstarke Unterstützung.", "Sprechchöre rollen wie Wellen durch die Arena.", "Die Anhänger treiben {Team} mit voller Lautstärke an.", "Von den Rängen kommt unermüdlicher Support für die Heimelf."], "heimFuehrt": ["Zufriedene Sprechchöre: 'Oh wie ist das schön!'", "Die Fans feiern ihre führende Mannschaft lautstark.", "Die Fans genießen die Führung und feiern jede gelungene Aktion.", "Laute Gesänge begleiten die Heimmannschaft auf dem Weg zum Sieg.", "Die Kurve klatscht im Takt und feiert den Vorsprung.", "Selbst kleine Ballgewinne werden bejubelt.", "Beste Stimmung auf den Heimrängen nach der Führung."], "heimZurueck": ["'Wir woll'n euch kämpfen sehn!' schallt es von der Tribüne.", "Die Kurve peitscht {Team} unermüdlich nach vorne.", "Trotz des Rückstands glauben die Fans weiter an die Wende.", "Lautstarke Unterstützung soll {Team} zurück ins Spiel bringen.", "Die Kurve fordert Kampfgeist und Einsatz.", "Keiner gibt auf, die Fans stehen hinter ihrer Mannschaft.", "Anfeuerungsrufe begleiten jede Offensivaktion."], "anpeitschen": ["{S} fordert gestikulierend mehr Unterstützung - und prompt brandet lautstarker Support auf!", "Die Mannschaft peitscht die Fans an, die Kurve antwortet mit gellenden Sprechchören.", "'Wir woll'n euch kämpfen sehn!' - die Ränge drängen {Team} zum Sieg.", "Das Stadion erhebt sich nach einer Großchance von {Team}.", "Jede gelungene Aktion sorgt für neuen Lärm auf den Rängen.", "Die Fans spüren, dass hier noch etwas möglich ist.", "Mit rhythmischem Klatschen wird die Mannschaft nach vorne getrieben.", "Die Schlussphase wird von ohrenbetäubendem Support begleitet."], "gast": ["Aus dem Gästeblock schallt es: 'Auswärtssieg! Auswärtssieg!'", "Die mitgereisten Fans feiern lautstark ihre Mannschaft.", "Die Gästefans machen sich mit Gesängen bemerkbar.", "Aus dem Auswärtsblock kommt lautstarker Jubel.", "Die mitgereisten Anhänger feiern jede gelungene Aktion ihres Teams.", "'Hier regiert der Gastverein!' schallt es aus dem Block.", "Die Gästekurve präsentiert sich bestens aufgelegt."], "fansGehen": ["Beim Stand der Dinge verlassen die ersten enttäuschten Fans das Stadion.", "Die Ränge lichten sich - vielen Heimfans reicht es beim klaren Rückstand.", "Einige Zuschauer machen sich vorzeitig auf den Heimweg.", "Die Enttäuschung ist vielen Fans deutlich anzusehen.", "Reihenweise werden nun Plätze auf den Tribünen frei.", "Der klare Spielstand drückt auf die Stimmung der Heimfans.", "Die ersten Pfiffe mischen sich unter die Stille."], "torschuetze": ["Die Fans skandieren den Namen des Torschützen: '{S}! {S}!'", "{S} lässt sich von der Kurve feiern.", "Der Jubel nach dem Treffer gilt ganz {S}.", "'{S}!' schallt es immer wieder von den Tribünen.", "Die Fans feiern ihren Torschützen mit Sprechchören.", "{S} wird für seinen Treffer begeistert gefeiert.", "Das Stadion zollt {S} großen Respekt für das Tor."], "torwart": ["Die Fans feiern {TW} nach einer weiteren Glanzparade frenetisch.", "'{TW}! {TW}!' - der Rückhalt wird von den Rängen gefeiert.", "{TW} wächst heute über sich hinaus und wird gefeiert.", "Jede Parade von {TW} löst Beifall aus.", "Die Fans danken {TW} für die starke Leistung.", "Der Keeper wird nach seiner Rettungstat lautstark gewürdigt.", "{TW} avanciert zum Publikumsliebling des Tages."], "trainer": ["Die Fans rufen nach der beeindruckenden Leistung der Mannschaft: '{Trainer} - Fußballgott!'", "'{Trainer}! {Trainer}!' - der Coach wird gefeiert.", "Die Fans honorieren die Arbeit von {Trainer} mit Applaus.", "Sprechchöre für {Trainer} werden immer lauter.", "Die starke Leistung der Mannschaft wirft ein positives Licht auf {Trainer}.", "Die Anhänger feiern ihren Erfolgscoach.", "{Trainer} genießt den Applaus der Heimfans."], "endeHeimsieg": ["Riesenjubel beim Abpfiff - die Zuschauer liegen sich in den Armen!", "{Team} gewinnt - das Stadion feiert ausgelassen mit der Mannschaft.", "Die Feierlichkeiten auf den Rängen kennen keine Grenzen.", "Ein verdienter Heimsieg wird ausgelassen bejubelt.", "Die Fans singen noch lange nach dem Abpfiff weiter.", "Große Freude bei Spielern und Zuschauern.", "Das Stadion verwandelt sich in ein Tollhaus."], "endeGastsieg": ["Der Gästeblock feiert den Auswärtssieg, im Rund macht sich Enttäuschung breit.", "Stille auf den Heimrängen, ausgelassene Freude bei den Gästen.", "Die Gäste feiern den Erfolg ausgelassen vor ihrem Block.", "Enttäuschte Gesichter bei den Heimfans nach dem Schlusspfiff.", "Der Auswärtssieg wird von den mitgereisten Anhängern gefeiert.", "Die Heimelf verabschiedet sich unter gemischten Reaktionen.", "Die Gäste nehmen drei Punkte mit auf die Heimreise."], "endeRemis": ["Verhaltener Applaus zum Abpfiff nach der Punkteteilung.", "Gemischte Gefühle im Stadion nach dem Remis.", "Beide Teams werden nach dem Remis mit Applaus bedacht.", "Niemand ist ganz zufrieden, aber auch niemand geht leer aus.", "Das Publikum verabschiedet die Mannschaften respektvoll.", "Nach umkämpften 90 Minuten steht die Punkteteilung.", "Ein gerechtes Remis sorgt für gemischte Emotionen."]};
    ATMO_FAN.heimAllg.push("Die Fankurve ruft '{Name1}', die Haupttribüne antwortet '{Stadt}'!", "'Ale, ale, alee \u2013 super {Verein}, alee!' brandet durch die Arena.", "'Hey, hey, {Verein}, hey!' hallt von den R\u00e4ngen.", "'Steht auf, wenn ihr {Stadt}-Fans seid!' \u2013 und die Kurve erhebt sich.", "'Immer wieder, immer wieder {Verein}!' skandiert der Anhang.", "'Wer wird hier der Meister? {Verein}!' t\u00f6nt es von den R\u00e4ngen.");
    ATMO_FAN.heimFuehrt.push("'{Verein} vor, noch ein Tor!' fordert die Kurve.", "'So ein sch\u00f6ner Tag \u2013 {Stadt}!' schallt \u00fcbers Rund.");
    ATMO_FAN.gast.push("'Immer wieder {Verein}!' schallt aus dem G\u00e4steblock.", "'Ale, ale, alee \u2013 super {Verein}, alee!' aus dem Ausw\u00e4rtsblock.", "'{Verein}, {Verein}!' feuert der mitgereiste Anhang lautstark an.");
    ATMO_FAN.torschuetzeGott = ["'{S} \u2013 Fu\u00dfballgott!' skandiert das ganze Stadion.", "Die R\u00e4nge huldigen ihrem Dreifachtorsch\u00fctzen: '{S}, {S}!'", "'{S} \u2013 Fu\u00dfballgott!' \u2013 Sprechch\u00f6re f\u00fcr den Hattrick-Helden.", "Das Stadion liegt {S} zu F\u00fc\u00dfen: '{S}, {S}, {S}!'"];

    const ATMO_LEAD = ['In der Kurve formiert sich ein Gesang', 'Erst vereinzelt, dann immer lauter', 'Ein Vorsänger gibt den Ton an', 'Die Trommeln geben den Takt vor', 'Von der Hintertortribüne schwappt es herüber', 'Zehntausend Kehlen holen Luft'];
    const ATMO_BILD = ['ein Fahnenmeer wogt über die Ränge', 'das ganze Rund klatscht im Takt', 'tausende Schals recken sich in die Höhe', 'die Gänsehaut-Stimmung überträgt sich aufs Feld', 'der Lärmpegel schwillt weiter an', 'die Wucht des Support ist körperlich spürbar'];
    const fanAtmo = (key, extra) => {
      const pool = ATMO_FAN[key]; if (!pool || !pool.length) return '';
      const awaySide = (key === 'gast' || key === 'endeGastsieg');
      const vTeam = awaySide ? away : home, toks = (vTeam || '').split(/\s+/).filter(Boolean);
      const c = Object.assign({ team: home, gegner: away, stadt: (toks[toks.length - 1] || vTeam), name1: (toks.slice(0, -1).join(' ') || vTeam), verein: vTeam, trainer: 'der Trainer' }, extra || {});
      let t = pickNR(pool).replace(/\{Team\}/g, c.team).replace(/\{Gegner\}/g, c.gegner).replace(/\{Stadt\}/g, c.stadt).replace(/\{Name1\}/g, c.name1).replace(/\{Verein\}/g, c.verein).replace(/\{Trainer\}/g, '<span class="os-cn" data-s="h" data-fmt="name">' + c.trainer + '</span>').replace(/Gastvereins?/g, c.gegner).replace(/Heimvereins?/g, c.team);
      if (c.s) t = t.replace(/\{S\}/g, bkNameHTML(c.s, c.sSide || 'h'));
      if (c.tw) t = t.replace(/\{TW\}/g, bkNameHTML(c.tw, c.twSide || 'h'));
      if (Math.random() < 0.4 && !/stimmt an|schallt|hallt|skandier|formiert|Vorsänger/i.test(t)) t = pickNR(ATMO_LEAD) + ' – ' + t;
      if (Math.random() < 0.4) t = t.replace(/[.!]?\s*$/, '') + ' – ' + pickNR(ATMO_BILD) + '.';
      return emo(atmoInner(t));
    };

    // Selbst enthaltene, animierte Tor-Grafik (Ball fliegt ins Netz) – wirkt wie ein GIF.
    // Willst du ein eigenes GIF, ersetze GOAL_ICON durch: '<img src="URL" width="48">'
    const GOAL_ICON = `<svg class="os-goalgif" viewBox="0 0 70 44" width="48" height="30" aria-label="Tor">
      <g stroke="#ffffff" stroke-width="0.7" opacity="0.7"><path d="M30 9V37 M38 9V37 M46 9V37 M54 9V37 M23 16H61 M23 23H61 M23 30H61"/></g>
      <rect x="22" y="8" width="40" height="30" fill="none" stroke="#ffffff" stroke-width="2.6"/>
      <circle class="os-ball" cx="8" cy="30" r="4.5" fill="#ffffff" stroke="#0a3a1c" stroke-width="1"/></svg>`;
    let curMin = '', buildMin = 0, score = { h: 0, a: 0 }, markIdx = 0, cardCount = 0;
    const wasBehind = { h: false, a: false };
    let atmoBeginnShown = false, atmoLastChant = -99, atmoFansGone = false, atmoEndShown = false, atmoLastAnpeitsch = -99;
    const atmoSaves = { h: 0, a: 0 }, atmoLastTW = { h: 0, a: 0 }, pgoals = {};
    const goalComments = [];
    const eventBoxRows = [];
    const cardBox = (min, side, type, name) => {
      const team = side === 'h' ? home : away, teamId = side === 'h' ? homeId : awayId;
      const title = type === 'red' ? 'ROTE KARTE' : (type === 'yellowred' ? 'GELB-ROTE KARTE' : 'GELBE KARTE');
      const icon = `<span class="os-card os-card-${type === 'red' ? 'r' : (type === 'yellowred' ? 'yr' : 'y')}"></span>`;
      const n = (name || '').replace(/"/g, '');
      return `<div class="os-evbox"><div class="os-ev-head"><span class="os-ev-min">${min}'</span><span class="os-ev-title">${title}</span>${icon}</div>`
        + `<div class="os-ev-main"><div class="os-ev-photo os-ev-ph" data-name="${n}" data-side="${side}"></div>`
        + `<div class="os-ev-info"><div class="os-ev-name"><span class="os-ev-pos" data-name="${n}" data-side="${side}"></span>${boldSurname(name || '')}</div>`
        + `<div class="os-ev-so" data-name="${n}" data-side="${side}"></div>`
        + `<div class="os-ev-team">${logoTag(teamId)}<span>${team}</span></div></div></div></div>`;
    };
    const subBox = (min, side, inName, outName, injury) => {
      const teamId = side === 'h' ? homeId : awayId, team = side === 'h' ? home : away;
      const title = injury ? 'VERLETZUNG' : 'SPIELERWECHSEL';
      const icon = injury ? '🚑' : '⇄';
      const col = nm => { const n = (nm || '').replace(/"/g, ''); return `<div class="os-ev-player">`
        + `<div class="os-ev-photo os-ev-ph" data-name="${n}" data-side="${side}"></div>`
        + `<div class="os-ev-pos os-ev-pos-c" data-name="${n}" data-side="${side}"></div>`
        + `<div class="os-ev-fullname">${boldSurname(nm || '')}</div>`
        + `<div class="os-ev-so" data-name="${n}" data-side="${side}"></div></div>`; };
      return `<div class="os-evbox"><div class="os-ev-head"><span class="os-ev-min">${min}'</span><span class="os-ev-title">${title}</span><span class="os-ev-icon">${icon}</span></div>`
        + `<div class="os-ev-subwrap">${col(outName)}<div class="os-ev-arrows"><span class="os-ev-out">▼</span><span class="os-ev-in">▲</span></div>${col(inName)}</div>`
        + `<div class="os-ev-team os-ev-team-c">${logoTag(teamId)}<span>${team}</span></div></div>`;
    };
    let confCtx = null, confLoaded = false, confResults = null, confBumps = [], hzCommentTr = null, finalCommentTr = null;
    const marks = [15, 75];
    const homeSurn = starterLetters.map(l => homeMap[l]).filter(Boolean).map(surname);
    const awaySurn = starterLetters.map(l => awayMap[l]).filter(Boolean).map(surname);
    const SHOT_RE = /Eck|Kasten|Latte|Pfosten|Netz|pariert|hält|lenkt|abgewehrt|vorbei|daneben|drüber|Distanz|Abschluss|Kopfball|TOOOR/;
    const mkAcc = () => ({ homeAct: 0, awayAct: 0, fouls: 0, cards: 0, shots: 0, goalsH: 0, goalsA: 0, players: {}, chH: 0, chA: 0, dangerSum: 0, topScene: null, keyMoments: [] });
    const game = mkAcc(); let iv = mkAcc();
    const momentum = {}, danger = {}, mEvents = []; let maxMin = 0;
    const rs = { h: {}, a: {} }, rsHT = { h: {}, a: {} };
    const bumpStat = (team, key, mn) => { if (!team) return; rs[team][key] = (rs[team][key] || 0) + 1; if (mn != null && mn <= 45) rsHT[team][key] = (rsHT[team][key] || 0) + 1; };
    const feed = (rt, mn) => {
      homeSurn.forEach(s => { if (s && rt.indexOf(s) >= 0) { game.homeAct++; iv.homeAct++; iv.players[s] = (iv.players[s] || 0) + 1; game.players[s] = (game.players[s] || 0) + 1; if (mn != null) { (momentum[mn] = momentum[mn] || { h: 0, a: 0 }).h++; } } });
      awaySurn.forEach(s => { if (s && rt.indexOf(s) >= 0) { game.awayAct++; iv.awayAct++; iv.players[s] = (iv.players[s] || 0) + 1; game.players[s] = (game.players[s] || 0) + 1; if (mn != null) { (momentum[mn] = momentum[mn] || { h: 0, a: 0 }).a++; } } });
      if (/FREISTOSS/.test(rt)) { game.fouls++; iv.fouls++; }
      if (/Gelb|\bRot\b/.test(rt)) { game.cards++; iv.cards++; }
      if (SHOT_RE.test(rt)) { game.shots++; iv.shots++; }
    };
    const sideOf = rt => homeSurn.some(s => s && rt.indexOf(s) >= 0) ? 'h' : (awaySurn.some(s => s && rt.indexOf(s) >= 0) ? 'a' : null);
    const homeGK = surname(homeMap['T'] || ''), awayGK = surname(awayMap['T'] || '');
    const KEEPER_SAVE = /pariert|hält|abwehr|Fingerspitzen|patzt|fängt|lenkt|klatscht|wehrt|pflückt|faustet/i;
    const FRAME = /an die Latte|an den Pfosten|Querbalken|\bLatte\b|\bPfosten\b/i;
    const SHOTKW = /zieht ab|Abschluss|\bSchuss\b|Kopfball|Schlenzer|feuert|nimmt Maß|Volley|Distanz|Hammer|zirkelt|köpft|Direktabnahme|Flatterball|Aufsetzer|Fallrückzieher|hämmert|drischt/i;
    const OFFKW = /vorbei|zu hoch|drüber|daneben|verzieht|streicht/i;
    const DEF_CLEAR = /aus der Gefahrenzone|klärt|geklärt|blockt|geblockt|grätscht|befreit|rettet|entschärft|fängt ab|abgefangen|zur Ecke|köpft.*(?:weg|aus|zur)|wehrt.*ab|spitzelt.*weg/i;
    const fieldTeamOf = line => {
      let hp = Infinity, ap = Infinity;
      homeSurn.forEach(s => { if (s && s !== homeGK) { const p = line.indexOf(s); if (p >= 0) hp = Math.min(hp, p); } });
      awaySurn.forEach(s => { if (s && s !== awayGK) { const p = line.indexOf(s); if (p >= 0) ap = Math.min(ap, p); } });
      if (hp === Infinity && ap === Infinity) return null;
      return hp <= ap ? 'h' : 'a';
    };
    const lineMom = line => {
      const hasHomeGK = homeGK && line.indexOf(homeGK) >= 0, hasAwayGK = awayGK && line.indexOf(awayGK) >= 0;
      if (KEEPER_SAVE.test(line) && (hasHomeGK || hasAwayGK)) return { team: hasHomeGK ? 'a' : 'h', w: 3 };   // Parade/Patzer -> Chance des Gegners des Keepers
      if (DEF_CLEAR.test(line)) { const t = fieldTeamOf(line); return t ? { team: t === 'h' ? 'a' : 'h', w: 0.6 } : null; } // Abwehr klärt -> kleiner Ausschlag fürs angreifende Team
      if (FRAME.test(line)) { const t = fieldTeamOf(line); return t ? { team: t, w: 3 } : null; }               // Latte/Pfosten
      if (SHOTKW.test(line)) { const t = fieldTeamOf(line); if (t) return { team: t, w: OFFKW.test(line) ? 2 : 2.5 }; } // Torschuss
      if (/Eckball|Ecke:/i.test(line)) { const t = fieldTeamOf(line); return t ? { team: t, w: 1.5 } : null; }  // Ecke
      const t = fieldTeamOf(line); return t ? { team: t, w: 0.5 } : null;                                        // Aufbau/sonstiges
    };
    const cleanScene = ln => { let t = (ln || '').replace(/\s+/g, ' ').trim().replace(/^[-–\s]+/, ''); if (t.length > 95) t = t.slice(0, 92) + '…'; return t; };
    // Chancen-fokussierte Momentum-Gewichtung (auf Originaltext)
    const momWeight = line => {
      if (/Neuer Spielstand|^Anpfiff|Halbzeit|Abpfiff|ABSEITS|wechselt:|kommt für|ändert (Spielweise|Einsatz)|kassiert.*Kart|Der Linienrichter/.test(line)) return null;
      const hasHomeGK = homeGK && line.indexOf(homeGK) >= 0, hasAwayGK = awayGK && line.indexOf(awayGK) >= 0;
      if (/,\s*TOR\b|\bTOR\b\s*$|machtlos.*TOR/.test(line)) { const t = fieldTeamOf(line); return t ? { team: t, w: 5 } : null; }
      if (KEEPER_SAVE.test(line) && (hasHomeGK || hasAwayGK)) return { team: hasHomeGK ? 'a' : 'h', w: /locker/.test(line) ? 2.5 : 3 };
      if (FRAME.test(line)) { const t = fieldTeamOf(line); return t ? { team: t, w: 3.5 } : null; }
      if (SHOTKW.test(line) && !/Beinschuss/.test(line)) { const t = fieldTeamOf(line); return t ? { team: t, w: 2.2 } : null; }
      if (/Eckball|Ecke:/i.test(line)) { const t = fieldTeamOf(line); return t ? { team: t, w: 1.2 } : null; }
      if (/erkämpft sich den Ball/.test(line)) { const t = fieldTeamOf(line); return t ? { team: t, w: 0.8 } : null; }
      if (/(gelungenen Dribbling|Übersteiger|wie einen Schuljungen stehen|verlädt .* Körpertäuschung|tankt sich .* durch|flankt)/.test(line) && !/nicht|vergeblich/.test(line)) { const t = fieldTeamOf(line); return t ? { team: t, w: 0.4 } : null; }
      const t = fieldTeamOf(line); if (!t) return null;
      if (/ins Aus|hinter dem Tor|Verunglückt|an Freund und Feind/.test(line)) return { team: t, w: 0.1 };
      return { team: t, w: 0.18 };
    };
    const computeDangerOriginal = () => {
      const dg = {}; const doc = new DOMParser().parseFromString(osOriginalHTML || '', 'text/html');
      const tbl = [...doc.querySelectorAll('table')].find(t => /Anpfiff/.test(t.textContent)); let curMin = 0;
      if (tbl) tbl.querySelectorAll('tr').forEach(tr => {
        const first = (tr.children[0] ? tr.children[0].textContent : '').trim();
        const m = /^\d+\.?$/.test(first) ? parseInt(first, 10) : null; if (m != null) curMin = m;
        const cell = [...tr.children].find(x => (x.textContent || '').trim().length > 12) || tr.children[tr.children.length - 1];
        const parts = cell ? cell.innerHTML.split(/<br\s*\/?>/i).map(s => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean) : [];
        parts.forEach(ln => { const w = momWeight(ln); if (w) dg[curMin] = (dg[curMin] || 0) + (w.team === 'h' ? w.w : -w.w); });
      });
      return dg;
    };
    let lastShot = null;
    const dangerAcc = (r, mn) => {
      if (mn == null) return;
      const cell = [...r.children].find(c => (c.textContent || '').trim().length > 12);
      const lines = cell ? cell.innerHTML.split(/<br\s*\/?>/i).map(s => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ')) : [txt(r)];
      let v = 0;
      lines.forEach(ln => {
        const m = lineMom(ln); if (!m) return;
        v += (m.team === 'h' ? m.w : -m.w);
        if (m.w >= 2) {
          if (m.team === 'h') { game.chH++; iv.chH++; } else { game.chA++; iv.chA++; }
          const sc = { w: m.w, team: m.team, min: mn, text: cleanScene(ln) };
          const notable = sc && sc.text && /TOR!|\bPfosten\b|\bLatte\b|Aluminium|Lattenkreuz|Fingerspitzen|Glanzparade|Weltklasse|zur Ecke|sensationell|Flugeinlage|haarscharf|\bknapp\b|Zentimeter|rei\u00dft|auf der Linie|Volley|Fallr\u00fcckzieher|Seitfallzieher|Winkel/i.test(sc.text);
          if (notable) { if (!iv.topScene || m.w > iv.topScene.w) iv.topScene = sc; if (!game.topScene || m.w > game.topScene.w) game.topScene = sc; }
          lastShot = { text: cleanScene(ln), min: mn };
        }
      });
      // Statistik-Zählung aus dem Spielbericht (pro Team, kumulativ + Halbzeit)
      lines.forEach(ln => {
        const t = fieldTeamOf(ln);
        if (SHOTKW.test(ln) && !DEF_CLEAR.test(ln)) {
          bumpStat(t, 'sh', mn);
          if (KEEPER_SAVE.test(ln) || /zappelt im Netz|schlägt ein|unhaltbar|ins Netz|macht.?los/i.test(ln)) bumpStat(t, 'ot', mn);
          if (FRAME.test(ln)) bumpStat(t, 'pl', mn);
        }
        if (KEEPER_SAVE.test(ln)) { if (homeGK && ln.indexOf(homeGK) >= 0) psaves[sn(homeMap['T'] || '')] = (psaves[sn(homeMap['T'] || '')] || 0) + 1; if (awayGK && ln.indexOf(awayGK) >= 0) psaves[sn(awayMap['T'] || '')] = (psaves[sn(awayMap['T'] || '')] || 0) + 1; }
        if (/Ecke:|Eckball/i.test(ln)) bumpStat(t, 'co', mn);
        if (/ABSEITS/i.test(ln)) bumpStat(t, 'ab', mn);
        if (/FREISTOSS|Freistoß/i.test(ln)) bumpStat(t, 'fk', mn);
        if (/flankt|Flanke/i.test(ln)) bumpStat(t, 'fl', mn);
        if (/Dribbling|Übersteiger|Körpertäuschung|tankt sich|umkurvt|umspielt|umspielen/i.test(ln)) bumpStat(t, 'dr', mn);
      });
      if (v) danger[mn] = (danger[mn] || 0) + v;
      game.dangerSum += v; iv.dangerSum += v;
    };
    const BAUKASTEN = {"szene": ["Freie Bahn!", "Ein gewaltiger Strich!", "Riesenchance!", "Nach einer Ecke kommt der Ball flach herein.", "Eine Flanke wird nur bis zur Strafraumgrenze geklärt.", "Der Ball tropft im Strafraum herum.", "Schneller Umschaltmoment!", "Der Ball springt nach einem Zweikampf genau in den freien Raum.", "Ploetzlich oeffnet sich eine Luecke in der Defensive!", "Ein Ballgewinn tief in der gegnerischen Haelfte.", "Die Hintermannschaft bekommt den Ball nicht geklärt.", "Ein genialer Steckpass hebelt die Abwehr aus.", "Konterchance!", "Die Kugel landet perfekt im Rückraum.", "Gefaehrliche Hereingabe!", "Die Abwehr ist für einen Moment unsortiert.", "Da ist jede Menge Platz vor dem Tor.", "Ein schneller Doppelpass sorgt für Verwirrung.", "Die Flanke segelt punktgenau in den Strafraum.", "Ein Pressingfehler bringt die Gegner in Bedraengnis.", "Der zweite Ball faellt vor die Füße eines Angreifers.", "Ein langer Ball sorgt für Gefahr.", "Die Situation scheint bereits geklärt.", "Ein Querschlaeger wird ploetzlich brenzlig.", "Die Abwehr bekommt keinen Zugriff.", "Die Chance entwickelt sich aus dem Nichts.", "Ein weiter Einwurf stiftet Chaos.", "Der Angriff nimmt ploetzlich Tempo auf.", "Die Kugel bleibt heiss.", "Ein schöner Seitenwechsel oeffnet den Raum.", "Die Flanke rutscht bis an den zweiten Pfosten durch.", "Ein Missverstaendnis in der Defensive.", "Die Zuordnung stimmt für einen Moment nicht.", "Der Gegner wird auf dem falschen Fuss erwischt.", "Gefaehrlicher zweiter Ball!", "Ein abgefälschter Pass landet genau richtig.", "Die Fans halten den Atem an.", "Ein schöner Spielzug ueber mehrere Stationen.", "Die Kugel tropft gefaehrlich durch den Strafraum.", "Viel Verkehr im Fünfmeterraum.", "Die Defensive kommt nicht hinterher.", "Da bietet sich eine Abschlussmoeglichkeit.", "Die Flanke kommt mit Zug vors Tor.", "Ein Befreiungsschlag landet beim Gegner.", "Die Aktion wird stark vorbereitet.", "Ein schneller Haken schafft den nötigen Platz.", "Die Abwehr rueckt zu spaet heraus.", "Der Angriff rollt ungebremst weiter.", "Ein Kontakt veraendert die gesamte Szene.", "Die Hereingabe wird noch leicht abgefälscht.", "Jetzt wird es laut auf den Rängen!", "Die Kugel springt unberechenbar auf."], "schuss": [{"t": "{S} zieht aus der zweiten Reihe ab", "d": "weit"}, {"t": "{S} feuert eine Granate von der Strafraumgrenze aufs Gehäuse", "d": "weit"}, {"t": "{S} zieht aus 20 Metern stramm ab", "d": "weit"}, {"t": "{S} zimmert den Ball volle Pulle", "d": "mittel"}, {"t": "{S} zieht aus spitzem Winkel knallhart ab", "d": "mittel"}, {"t": "{S} schlenzt den Ball gefühlvoll", "d": "mittel"}, {"t": "{S} schießt einen gefühlvollen Heber", "d": "mittel"}, {"t": "{S} zirkelt den Ball mit dem Außenrist", "d": "mittel"}, {"t": "{S} nimmt den Ball direkt volley", "d": "egal"}, {"t": "{S} zieht trocken ab", "d": "egal"}, {"t": "{S} schießt tückisch flach durch die Beine des Verteidigers", "d": "nah"}, {"t": "{S} zieht sofort per Direktabnahme ab", "d": "nah"}, {"t": "{S} zieht per Dropkick ab", "d": "nah"}, {"t": "{S} schießt mit der Fußspitze", "d": "nah"}, {"t": "{S} versucht es frech mit der Hacke", "d": "nah"}, {"t": "{S} setzt zum spektakulären Fallrückzieher an", "d": "nah"}, {"t": "{S} versucht einen artistischen Fallrückzieher", "d": "nah"}, {"t": "{S} zieht per Seitfallzieher ab", "d": "nah"}, {"t": "{S} nimmt den Ball per Seitfallzieher", "d": "nah"}, {"t": "{S} nimmt den Ball volley", "d": "egal"}, {"t": "{S} feuert einen Volley aus der Luft ab", "d": "egal"}, {"t": "{S} erwischt die Kugel perfekt mit dem Vollspann", "d": "egal"}, {"t": "{S} schließt per Direktabnahme ab", "d": "nah"}, {"t": "{S} hält ohne Ballannahme sofort drauf", "d": "nah"}, {"t": "{S} schlenzt den Ball mit dem Außenrist", "d": "mittel"}, {"t": "{S} zieht mit dem Außenrist Richtung Winkel ab", "d": "mittel"}, {"t": "{S} setzt einen raffinierten Heber mit dem Außenrist an", "d": "mittel"}, {"t": "{S} zirkelt die Kugel technisch stark mit dem Außenrist", "d": "mittel"}, {"t": "{S} überrascht die Abwehr mit einem frechen Abschluss per Hacke", "d": "nah"}, {"t": "{S} bugsiert den Ball mit der Hacke", "d": "nah"}, {"t": "{S} vollendet mit dem Rücken zum Tor artistisch mit der Hacke", "d": "nah"}, {"t": "{S} schießt mit der Fußspitze aufs Gehäuse", "d": "nah"}, {"t": "{S} stochert den Ball aus kurzer Distanz aufs Tor", "d": "nah"}, {"t": "{S} zieht aus der Drehung ab", "d": "mittel"}, {"t": "{S} schließt im Fallen ab", "d": "nah"}, {"t": "{S} schießt aus vollem Lauf", "d": "mittel"}, {"t": "{S} zieht aus dem Sprint heraus ab", "d": "mittel"}, {"t": "{S} feuert den Ball nach kurzer Ballmitnahme aufs Tor", "d": "mittel"}, {"t": "{S} nimmt Maß und schließt entschlossen ab", "d": "mittel"}, {"t": "{S} hämmert den Ball mit Vollspann aufs Gehäuse", "d": "mittel"}, {"t": "{S} jagt einen satten Spannstoß aufs Tor", "d": "weit"}, {"t": "{S} setzt einen wuchtigen Linksschuss ab", "d": "mittel"}, {"t": "{S} zieht mit rechts kompromisslos ab", "d": "mittel"}, {"t": "{S} trifft den Ball perfekt mit dem schwächeren Fuß", "d": "mittel"}, {"t": "{S} schlenzt gefühlvoll mit dem Innenrist", "d": "mittel"}, {"t": "{S} setzt einen präzisen Innenseitenschuss aufs Tor", "d": "mittel"}, {"t": "{S} hebt den Ball technisch fein Richtung Gehäuse", "d": "nah"}, {"t": "{S} versucht einen frechen Lupfer", "d": "nah"}, {"t": "{S} hebt den Ball über den herausstürmenden {TW}", "d": "nah"}, {"t": "{S} schickt eine Bogenlampe aufs Tor", "d": "mittel"}, {"t": "{S} setzt einen tückischen Aufsetzer aufs Gehäuse", "d": "weit"}, {"t": "{S} bringt einen schwer zu berechnenden Aufsetzer aufs Tor", "d": "weit"}, {"t": "{S} schießt ansatzlos", "d": "mittel"}, {"t": "{S} fasst sich aus der Distanz ein Herz", "d": "weit"}, {"t": "{S} probiert es einfach einmal aus der Ferne", "d": "weit"}, {"t": "{S} zieht aus rund 30 Metern ab", "d": "weit"}, {"t": "{S} knallt den Ball von der Strafraumkante aufs Tor", "d": "weit"}, {"t": "{S} kommt aus spitzem Winkel zum Abschluss", "d": "mittel"}, {"t": "{S} schießt durch die Beine eines Verteidigers", "d": "nah"}, {"t": "{S} feuert einen technisch anspruchsvollen Kunstschuss Richtung Winkel", "d": "mittel"}, {"t": "{S} legt den Ball am herausstrümenden {TX} vorbei", "d": "nah"}, {"t": "{S} nimmt den Ball per Drop-Kick", "d": "weit"}, {"t": "{S} schießt mit einem fulminanten Drop-Kick aufs Tor", "d": "mittel"}, {"t": "{S} schießt den Ball tückisch in Richtung Tor", "d": "mittel"}, {"t": "{S} spielt sich frei und probiert es mit einem Kunstschuss", "d": "mittel"}], "kopf": ["{S} steigt hoch und köpft", "{S} kommt völlig frei zum Kopfball", "{S} verlaengert die Flanke per Kopf Richtung Tor", "{S} setzt sich im Luftzweikampf durch und köpft", "{S} köpft gegen die Laufrichtung des {TW}", "{S} schraubt sich hoch zum Flugkopfball", "{S} köpft kraftvoll von der Strafraumgrenze", "{S} köpft gezielt und platziert", "{S} setzt einen wuchtigen Aufsetzer per Kopf aufs Tor", "{S} nickt die Kugel präzise aufs lange Eck", "{S} kommt am zweiten Pfosten frei zum Kopfball", "{S} setzt zum Hechtkopfball an", "{S} erwischt die Hereingabe perfekt mit der Stirn", "{S} verlängert den Ball per Kopf gefährlich aufs Tor", "{S} köpft aus vollem Lauf aufs Gehäuse", "{S} steigt zwischen zwei Verteidigern am höchsten und köpft", "{S} setzt einen Flugkopfball Richtung Winkel", "{S} drückt den Ball aus kurzer Distanz per Kopf aufs Tor", "{S} nickt den Ball gegen den Boden aufs Gehäuse", "{S} setzt einen technisch starken Kopfball aufs lange Eck", "{S} köpft die Flanke aus dem Rückwärtslaufen aufs Tor", "{S} bringt den Ball per Kopf als Bogenlampe aufs Gehäuse", "{S} verlängert die Hereingabe mit dem Hinterkopf aufs Tor", "{S} köpft nach einem Freistoß gefährlich aufs Tor", "{S} setzt sich im Luftduell robust durch und köpft", "{S} steigt am Elfmeterpunkt hoch und köpft", "{S} köpft aus spitzem Winkel aufs Gehäuse", "{S} köpft den Ball mit viel Wucht Richtung Tor", "{S} kommt nach einer Ecke frei zum Kopfballabschluss", "{S} drückt den Ball am kurzen Pfosten per Kopf aufs Tor", "{S} setzt einen präzisen Flugkopfball aufs Gehäuse", "{S} nickt die Kugel artistisch Richtung Winkel", "{S} köpft den Ball schulbuchmäßig aufs Tor", "{S} erwischt die Flanke im Sprung perfekt", "{S} setzt einen platzierten Kopfstoß auf den Kasten", "{S} kommt im Rücken der Abwehr zum Kopfball", "{S} verlängert den Ball als Bogenkopfball aufs Tor", "{S} köpft aus dem Lauf gefährlich aufs Gehäuse", "{S} setzt den Ball per Kopf auf das kurze Eck", "{S} drückt den Ball aus dem Getümmel aufs Tor", "{S} köpft die Kugel mit viel Timing aufs Gehäuse", "{S} kommt nach einer Kopfballverlängerung zum nächsten Kopfball", "{S} bringt den Ball aus kurzer Distanz per Kopf aufs Tor", "{S} köpft gegen die Flugrichtung des Balles aufs Gehäuse", "{S} setzt den Ball mit der Stirn präzise aufs Eck", "{S} kommt nach einer Bogenlampe frei zum Kopfball", "{S} köpft trotz Bedrängnis aufs Tor", "{S} erwischt den Ball nach einer Flanke mit voller Wucht", "{S} setzt einen gefährlichen Kopfball Richtung Innenpfosten", "{S} nickt den Ball aus zentraler Position aufs Gehäuse", "{S} verlängert den Ball aus kurzer Distanz per Kopf", "{S} köpft den Ball technisch stark aufs lange Eck", "{S} bringt einen druckvollen Kopfball auf das Tor", "{S} steht frei und hat alle Zeit der Welt den Kopfball zu platzieren", "{S} bekommt den Ball irgendwie an die Stirn", "{S} fälscht den Ball unerwartet für den {TW} mit dem Kopf ab"], "ziel": ["aufs lange Eck", "in die kurze Ecke", "in die Tormitte", "in den Winkel", "auf den langen Pfosten", "flach ins lange Eck", "Richtung Innenpfosten", "ins obere linke Eck", "ins obere rechte Eck", "flach an den linken Innenpfosten", "flach an den rechten Innenpfosten", "hoch Richtung linker Winkel", "hoch Richtung rechter Winkel", "direkt unter die Latte", "ans Lattenkreuz", "zentimetergenau ins lange Eck", "scharf aufs kurze Eck", "flach durch die Mitte", "genau neben den linken Pfosten", "genau neben den rechten Pfosten", "mit viel Effet aufs lange Eck", "mit Schnitt Richtung Torwinkel", "halbhoch ins linke Eck", "halbhoch ins rechte Eck", "zentral unter den Querbalken", "auf den ersten Pfosten", "auf den zweiten Pfosten", "genau zwischen Pfosten und {TW}", "Richtung linkes Kreuzeck", "Richtung rechtes Kreuzeck", "flach ins kurze Eck", "unter die Arme von {TW}", "über die Schulter von {TW}", "in die linke Torecke", "in die rechte Torecke", "mit Zug zum Tor aufs lange Eck", "mit viel Tempo auf das kurze Eck", "haarscharf Richtung Innenpfosten", "knapp unter die Latte", "hoch in die Tormitte", "flach Richtung rechter Innenpfosten", "flach Richtung linker Innenpfosten", "mit viel Drall aufs lange Eck", "mit einem Aufsetzer aufs linke Eck", "mit einem Aufsetzer aufs rechte Eck", "genau in den Winkel", "Richtung Lattenunterkante", "zwischen die Beine von {TW}", "haarscharf ins kurze Eck", "punktgenau ins lange Eck", "mit viel Effet Richtung Innenpfosten"], "erg": {"paradeGehalten": ["aber {TW} taucht rechtzeitig ab und begräbt den Schuss sicher unter sich", "doch {TW} reagiert blitzschnell und packt im Nachfassen sicher zu", "{TW} steht goldrichtig und pflückt den Ball sicher herunter", "{TW} macht sich lang und fängt das Leder souverän ab", "{TW} bleibt konzentriert und entschärft die Gefahr sicher", "{TW} fängt den zentralen Schuss problemlos", "der Ball wird noch abgefälscht, doch {TW} begräbt ihn sicher unter sich", "doch {TW} reißt blitzschnell die Arme hoch und pariert", "aber {TW} zeigt einen starken Reflex auf der Linie", "{TW} macht den Winkel geschickt klein und verhindert den Treffer", "doch {TW} taucht rechtzeitig ins Eck ab und hält", "{TW} fischt den Ball mit den Fingerspitzen aus der Ecke", "aber {TW} ist hellwach und entschärft die Situation", "doch {TW} reagiert glänzend aus kurzer Distanz", "{TW} lenkt den Ball kontrolliert vor die Brust und packt zu", "aber {TW} ist unten und hält den Ball fest", "doch {TW} beweist starke Nerven im Eins-gegen-Eins", "{TW} bleibt lange stehen und pariert sicher", "aber {TW} verhindert den Einschlag mit einer Fußabwehr", "doch {TW} bekommt noch entscheidend die Hand an den Ball", "{TW} wirft sich mit vollem Einsatz in die Flugbahn", "aber {TW} pflückt den Ball sicher aus der Luft", "doch {TW} reagiert auch auf den abgefälschten Schuss stark", "{TW} pariert mit einer schnellen Reaktion auf der Linie", "aber {TW} liest die Situation perfekt und hält", "doch {TW} kratzt den Ball noch rechtzeitig weg", "{TW} entschärft den Abschluss mit einer Glanzparade", "aber {TW} macht sich lang und verhindert den Treffer", "doch {TW} beweist ausgezeichnete Reflexe", "{TW} hält den Ball sicher im Nachfassen", "aber {TW} ist aufmerksam und packt beherzt zu", "doch {TW} bekommt den Fuß rechtzeitig dazwischen", "{TW} lenkt den Ball mit starker Reaktion über die Gefahr hinweg", "aber {TW} hält auch diesen Versuch souverän", "doch {TW} bleibt Sieger im direkten Duell", "{TW} wirft sich mutig in den Schuss", "aber {TW} deckt die kurze Ecke hervorragend ab", "doch {TW} ist zur Stelle und begräbt den Ball unter sich", "{TW} reagiert hervorragend auf den Aufsetzer", "aber {TW} macht die Ecke geschickt zu", "doch {TW} sichert den Ball im zweiten Versuch", "{TW} verhindert mit einem starken Reflex den Einschlag", "aber {TW} lenkt den Ball sicher aus der Gefahrenzone", "doch {TW} fängt den anspruchsvollen Schuss problemlos", "{TW} hält auch unter Bedrängnis sicher fest", "aber {TW} bekommt beide Hände hinter den Ball", "doch {TW} reagiert überragend aus kürzester Distanz", "{TW} zeigt eine starke Parade im Fallen", "aber {TW} pariert mit einer schnellen Handbewegung", "doch {TW} verhindert den Treffer in höchster Not", "{TW} zeigt eine sehenswerte Flugeinlage und hält", "aber {TW} ist auf dem Posten und entschärft die Szene", "aber {TW} ist mit einem tollen Reflex zur Stelle", "{TW} wehrt den Schuss mit beiden Fäusten ab", "doch {TW} lässt sich nicht überwinden und pariert sicher", "{TW} macht einen Schritt in die falsche Richtung und hält den Ball trotzdem fest", "aber {TW} mit einem sensationellen Reflex zur Stelle", "doch {TW} hat die Ecke geahnt und ist rechtzeitig zur Stelle"], "zurEcke": ["{TW} lenkt den Ball mit den Fingerspitzen zur Ecke", "{TW} dreht den Ball um den Pfosten zur Ecke", "stark! {TW} fälscht den Ball noch zur Ecke ab", "doch {TW} kratzt den Ball gerade noch aus dem Winkel zur Ecke", "{TW} reißt den Arm hoch und lenkt den Schuss zur Ecke", "aber {TW} verhindert den Einschlag mit einer Glanzparade zur Ecke", "{TW} bekommt die Fingerspitzen an den Ball und klärt zur Ecke", "doch {TW} macht sich lang und dreht den Ball um den Pfosten", "{TW} taucht ins Eck ab und lenkt den Ball zur Ecke", "aber {TW} pariert spektakulär und rettet zur Ecke", "{TW} reagiert blitzschnell und lenkt den Ball zur Ecke ab", "doch {TW} wischt den Ball im letzten Moment über die Linie zur Ecke", "{TW} verhindert mit einer Flugeinlage den Treffer und klärt zur Ecke", "aber {TW} lenkt den Schuss noch an den Pfosten vorbei zur Ecke", "{TW} pariert den Aufsetzer und wehrt zur Ecke ab", "doch {TW} bekommt noch eine Hand an den Ball und klärt zur Ecke", "{TW} entschärft den Distanzschuss mit den Fingerspitzen zur Ecke", "aber {TW} dreht den Ball artistisch um den Pfosten", "{TW} zeigt einen starken Reflex und lenkt zur Ecke", "doch {TW} reagiert hervorragend auf den abgefälschten Ball und klärt zur Ecke", "{TW} verhindert den Einschlag mit einer Parade aus dem Winkel zur Ecke", "aber {TW} lenkt den Ball mit einer Hand um den Pfosten", "{TW} bekommt noch entscheidenden Kontakt und verursacht die Ecke", "doch {TW} ist rechtzeitig unten und klärt zur Ecke", "{TW} faustet den Ball im letzten Moment zur Ecke", "aber {TW} rettet auf der Torlinie und lenkt zur Ecke", "{TW} reagiert geistesgegenwärtig und klärt zur Ecke", "doch {TW} pariert den Volley und lenkt ihn zur Ecke", "{TW} verhindert den Treffer aus kurzer Distanz und wehrt zur Ecke ab", "aber {TW} lenkt den Ball über die Latte zur Ecke", "{TW} zeigt eine sensationelle Parade und rettet zur Ecke", "doch {TW} bekommt die Hand noch an den Ball und klärt", "{TW} stoppt den Schuss mit einer starken Reaktion zur Ecke", "aber {TW} macht sich ganz lang und lenkt zur Ecke", "{TW} pariert auch den tückischen Aufsetzer zur Ecke", "doch {TW} kratzt das Leder noch um den Pfosten", "{TW} verhindert mit einer starken Fußabwehr den Treffer und klärt zur Ecke", "aber {TW} bekommt gerade noch die Fingerspitzen an den Ball", "{TW} lenkt den Versuch aus dem Kreuzeck zur Ecke", "doch {TW} rettet spektakulär gegen die Laufrichtung", "{TW} reagiert bei schlechter Sicht stark und klärt zur Ecke", "aber {TW} verhindert das Tor mit einer Parade im Rückwärtslaufen", "{TW} lenkt den Kopfball mit einer starken Reaktion zur Ecke", "doch {TW} verhindert per Reflex den Einschlag und wehrt zur Ecke ab", "{TW} bekommt noch die Faust hinter den Ball und klärt", "aber {TW} rettet in höchster Not und lenkt zur Ecke", "{TW} verhindert das sichere Tor mit einer Weltklasseparade zur Ecke", "doch {TW} kratzt den Ball vom Weg ins Netz und verursacht die Ecke", "{TW} liegt in der Luft und klärt am Ende zur Ecke", "{TW} kommt aus dem Kasten und klärt ungewollt zur Ecke", "{TW} streckt sich und hebt den Ball über die Latte zur Ecke", "{TW} knallt mit dem Ball entschärften gegen die Latte, zum Glück nur zur Ecke"], "abpraller": ["{TW} kann den Ball nur nach vorne abklatschen", "{TW} pariert, doch der Ball bleibt im Fünfmeterraum liegen", "{TW} kann den Ball nur mit einer Hand abwehren", "{TW} lässt den Schuss nach vorne abprallen", "{TW} faeustet den Ball direkt in die Gefahrenzone", "{TW} pariert stark, doch der Ball bleibt im Spiel", "{TW} bekommt die Hände dran, kann aber nicht festhalten", "{TW} wehrt zur Seite ab, dort wartet bereits ein Angreifer", "{TW} lenkt den Ball in den Fünfmeterraum", "{TW} verhindert den Treffer, doch die Szene ist noch nicht geklärt", "{TW} kann den Ball nur wegstochern", "{TW} pariert mit einem Reflex, der Nachschuss ist moeglich", "{TW} wehrt den Ball direkt vor die Füße eines Angreifers ab", "{TW} hat den Ball kurz, lässt ihn aber wieder fallen", "{TW} bekommt keinen sicheren Griff an den Ball", "{TW} klatscht den Schuss unkontrolliert ab", "{TW} reagiert stark, der Ball springt jedoch zurück ins Feld", "{TW} lenkt den Ball zur Seite, die Gefahr bleibt bestehen", "{TW} kann nur nach vorne abwehren", "{TW} pariert, doch der Ball bleibt im Sechzehner heiss", "{TW} reißt die Arme hoch und lenkt den Ball vor sich ab", "{TW} bekommt noch die Fingerspitzen dran, mehr aber nicht", "{TW} wehrt den Ball direkt in den Rückraum ab", "{TW} kann den Abschluss nicht kontrolliert festhalten", "{TW} pariert stark, doch die Abwehr ist weiter gefordert", "{TW} verhindert den Einschlag, der Ball bleibt jedoch frei", "{TW} bekommt den Ball an die Brust und lässt abprallen", "{TW} entschärft den Schuss nur teilweise", "{TW} lenkt den Ball in den Strafraum zurück", "{TW} kann den Ball nicht unter Kontrolle bringen", "{TW} pariert mit dem Fuss, der Ball bleibt gefaehrlich", "{TW} ist noch dran, doch die Kugel springt ins Feld zurück", "{TW} fängt den Ball nicht sauber", "{TW} kann die Hereingabe nur abtropfen lassen", "{TW} bekommt beim Nachfassen keinen Zugriff", "{TW} verhindert das Tor, aber nicht den zweiten Versuch", "{TW} wehrt den Ball direkt vor das Tor ab", "{TW} lenkt den Schuss an die Seite, dort ist Platz", "{TW} kratzt den Ball weg, der Nachschuss liegt in der Luft", "{TW} pariert artistisch, doch die Situation bleibt offen", "{TW} kann nur noch reagieren und abwehren", "{TW} lenkt den Ball ungluecklich ins Zentrum", "{TW} bekommt den Ball nicht zu fassen", "{TW} wehrt mit letzter Kraft ab, der Ball bleibt gefaehrlich", "{TW} verhindert per Fussabwehr den Treffer", "{TW} lässt den Ball durch die Hände rutschen, kann aber retten", "{TW} pariert stark, der Ball liegt weiter frei vor dem Tor"], "alu": ["der Ball klatscht an den Pfosten", "mit voller Wucht an die Latte", "Aluminium! Der Ball springt vom Innenpfosten zurück ins Feld", "der Ball knallt an den Innenpfosten und springt zurück ins Feld", "die Latte rettet für die Hintermannschaft", "das Leder kracht ans Lattenkreuz", "vom Außenpfosten prallt der Ball ins Toraus", "Aluminium verhindert die Führung", "der Ball springt von der Unterkante der Latte zurück ins Spiel", "nur der Pfosten steht dem Treffer im Weg", "das Gehäuse rettet in höchster Not", "der Ball klatscht an den rechten Pfosten", "der Ball knallt gegen den linken Pfosten", "haarscharf an die Latte gesetzt", "die Querlatte zittert gewaltig", "vom Lattenkreuz zurück ins Feld", "der Ball springt vom Innenpfosten quer durch den Fünfmeterraum", "Aluminium! Da fehlen nur Zentimeter", "der Schuss landet mit voller Wucht am Pfosten", "die Latte bewahrt {TW} vor dem Gegentor", "der Ball küsst den Außenpfosten", "vom Pfosten zurück vor die Füße der Angreifer", "das Lattenkreuz verhindert den Einschlag", "Pech für den Schützen, der Ball landet am Aluminium", "der Ball knallt an die Unterkante der Latte und springt heraus", "Doppelpech: erst Pfosten, dann kann die Abwehr klären", "der Ball springt vom Pfosten zurück ins Spiel", "nur Zentimeter fehlen zum Traumtor, Pfosten!", "das Aluminium steht dem Treffer im Weg", "der Ball landet am rechten Winkel des Tores", "die Latte verhindert den Einschlag in letzter Sekunde", "vom linken Pfosten zurück ins Feld", "vom rechten Pfosten prallt der Ball zurück", "der Ball setzt auf die Latte auf und springt darüber", "das Gehäuse erbebt nach diesem Abschluss", "die Querlatte rettet spektakulär", "der Ball kracht mit voller Wucht gegen das Aluminium", "ans Lattenkreuz gesetzt, mehr Pech geht kaum", "der Ball springt vom Pfosten direkt zurück in den Strafraum", "Aluminium! Das Tor war schon fast bejubelt", "die Latte rettet für den bereits geschlagenen {TW}", "der Ball klatscht außen an den Pfosten", "Zentimeter fehlen, stattdessen nur Aluminium", "der Abschluss landet exakt am Innenpfosten", "der Ball trifft die Unterkante der Latte und springt zurück", "ein lauter Knall am Pfosten verhindert den Treffer", "der Ball springt quer von Pfosten zu Pfosten zurück", "das Aluminium rettet in allerhöchster Not", "der Ball kracht scheppernd gegen das Gebälk"], "vorbei": ["der Ball streicht knapp am langen Pfosten vorbei", "das Leder segelt deutlich drueber", "nur knapp daneben", "der Ball zischt am kurzen Pfosten vorbei ins Toraus", "der Ball rauscht knapp am rechten Pfosten vorbei", "der Ball rauscht knapp am linken Pfosten vorbei", "nur Zentimeter fehlen zur Führung", "haarscharf am Winkel vorbei", "ein guter Meter am Tor vorbei", "knapp über die Latte", "deutlich über das Gehäuse", "das Leder segelt weit über den Kasten", "der Abschluss streicht über den Querbalken", "am linken Toreck vorbei", "am rechten Toreck vorbei", "knapp neben das lange Eck", "knapp neben das kurze Eck", "nur das Außennetz getroffen", "der Ball landet im Außennetz", "der Versuch verfehlt das Tor denkbar knapp", "um Haaresbreite vorbei", "wenige Zentimeter neben das Gehäuse", "der Ball streicht am Pfosten vorbei", "am Torwinkel vorbei", "zu hoch angesetzt", "leicht verzogen", "deutlich verzogen", "der Abschluss geht klar vorbei", "kein Problem für die Zuschauer hinter dem Tor", "überhastet abgeschlossen, deutlich vorbei", "der Ball fliegt Richtung Tribüne", "das Ziel wird knapp verfehlt", "der Ball senkt sich zu spät", "der Schuss geht über das lange Eck hinweg", "der Versuch segelt über die Latte ins Toraus", "der Ball geht neben dem Pfosten ins Aus", "knapp rechts vorbei", "knapp links vorbei", "der Ball zischt am Winkel vorbei", "der Abschluss geht über das Kreuzeck hinweg", "das Leder verpasst den rechten Winkel knapp", "das Leder verpasst den linken Winkel knapp", "aus aussichtsreicher Position drüber", "weit am Tor vorbei", "der Ball fliegt deutlich über den Kasten", "am kurzen Eck vorbei ins Toraus", "am langen Eck vorbei ins Toraus", "der Ball springt noch auf und geht dann vorbei", "der Versuch landet hinter dem Tor", "der Ball segelt Richtung Eckfahne", "der Ball landet direkt in den Armen eines Balljungen", "der Versuch landet in den Wolken", "der Ball muss eigentlich drin sein, dennoch trudelt der Ball am Tor vorbei", "der Ball muss eigentlich drin sein, dennoch fliegt der Ball am Tor vorbei", "welch ein Abschluss und dennoch vorbei", "die Spieler reissen die Arme nach oben, ehe der Ball am Kasten vorbei fliegt"], "geblockt": ["ein Verteidiger wirft sich in den Schuss und blockt", "im letzten Moment abgeblockt", "ein Abwehrbein ist rechtzeitig dazwischen", "der Abschluss bleibt an einem Verteidiger hängen", "die Defensive bekommt den Körper dazwischen", "ein Verteidiger stellt sich mutig in die Schussbahn", "der Schuss wird entscheidend abgefälscht", "die Abwehr klärt in höchster Not", "ein Verteidiger stoppt den Ball mit vollem Körpereinsatz", "der Versuch wird noch zur Seite geblockt", "ein Abwehrspieler wirft sich aufopferungsvoll in den Schuss", "der Ball prallt vom Verteidiger zurück", "die Hintermannschaft macht die Lücke rechtzeitig zu", "ein Verteidiger fängt den Schuss ab", "die Kugel bleibt im Abwehrverbund hängen", "der Abschluss wird noch entscheidend gebremst", "ein Verteidiger klärt auf der letzten Rille", "die Abwehr entschärft die Situation mit vereinten Kräften", "ein Block verhindert die große Torchance", "der Ball wird schon im Ansatz geblockt", "ein Verteidiger hält den Fuß rechtzeitig hinein", "der Schuss wird noch aus der Gefahrenzone gelenkt", "die Verteidigung bekommt den Ball nicht sauber geklärt, aber geblockt", "ein Abwehrspieler geht kompromisslos dazwischen", "der Ball bleibt an einem herausrückenden Verteidiger hängen", "die Defensive wirft alles in diesen Block", "ein Verteidiger macht sich breit und blockt", "der Versuch bleibt im Getümmel stecken", "die Abwehr verhindert den Einschlag mit letztem Einsatz", "ein Verteidiger grätscht im entscheidenden Moment dazwischen", "der Schuss wird von der Mauer abgefangen", "ein Verteidiger blockt mit der Brust", "die Kugel wird aus kurzer Distanz abgewehrt", "ein Verteidiger verhindert den Abschluss auf der Linie", "der Ball prallt vom Verteidiger ins Feld zurück", "der Schuss kommt nicht durch den Abwehrriegel", "der Abschluss wird von mehreren Spielern abgeblockt", "ein Verteidiger bekommt den Kopf dazwischen", "die Abwehr reagiert blitzschnell und blockt", "ein Verteidiger opfert sich für sein Team auf", "der Schuss bleibt an den Beinen eines Gegenspielers hängen", "gerade noch geblockt, bevor es richtig gefährlich wird", "der Ball wird aus aussichtsreicher Position abgewehrt", "ein Verteidiger schmeißt sich erfolgreich in die Flugbahn", "die Defensive macht den Raum geschickt zu", "der Versuch wird noch von der Hacke eines Verteidigers abgefälscht", "ein Abwehrspieler lenkt den Ball entscheidend ab", "der Schuss wird im Strafraumgewühl geblockt", "ein Verteidiger verhindert mit starkem Stellungsspiel den Abschluss", "die Abwehr ist aufmerksam und blockt den Ball weg"], "tor": ["unhaltbar im Winkel - TOR!", "{TW} ist chancenlos - TOR!", "der Ball schlaegt unten links im Netz ein - TOR!", "kein Halten für {TW} - das Netz zappelt, TOR!", "abgefälscht und dadurch völlig unhaltbar - TOR!", "abgefälscht und unhaltbar - TOR!", "am Ende eines wilden Gestochers landet der Ball im Netz - TOR!", "artistisch vollendet - TOR!", "aus kürzester Distanz abgestaubt - TOR!", "aus schwierigem Winkel erfolgreich - TOR!", "aus spitzem Winkel ins Netz gesetzt - TOR!", "da kann {TW} nur hinterherschauen - TOR!", "das Lattenkreuz hilft kräftig mit - TOR!", "das Leder schlägt am Ende der perfekten Kombination ein - TOR!", "das Leder schlägt krachend unter der Latte ein - TOR!", "das Leder schlägt unhaltbar ein - TOR!", "das Netz wird förmlich zerrissen - TOR!", "das Stadion bebt, TOR!", "das Stadion explodiert förmlich - TOR!", "der Abschluss passt auf den Zentimeter - TOR!", "der Abschluss passt durch ein Nadelöhr - TOR!", "der Abschluss sitzt perfekt im kurzen Eck - TOR!", "der Abschluss sitzt perfekt im langen Eck - TOR!", "der Abschluss überrascht alle Beteiligten - TOR!", "der Ball dreht sich unhaltbar ins Tor - TOR!", "der Ball erinnert sich an den Weg ins Netz - TOR!", "der Ball findet die einzige Lücke - TOR!", "der Ball findet die kleinste Lücke im Tor - TOR!", "der Ball findet seinen Weg ins Netz - TOR!", "der Ball fliegt schnurgerade in den Winkel - TOR!", "der Ball kullert über die Linie - TOR!", "der Ball küsst beide Innenpfosten und geht hinein - TOR!", "der Ball küsst den Pfosten und geht rein - TOR!", "der Ball landet dort, wo kein Torwart hinkommt - TOR!", "der Ball landet exakt im Kreuzeck - TOR!", "der Ball landet genau unter dem Querbalken - TOR!", "der Ball landet punktgenau dort, wo {TW} nicht hinkommt - TOR!", "der Ball landet unhaltbar im linken oberen Eck - TOR!", "der Ball landet unhaltbar im rechten oberen Eck - TOR!", "der Ball rauscht durch das Gewühl ins Netz - TOR!", "der Ball rauscht in den Torwinkel - TOR!", "der Ball rauscht ins obere Eck - TOR!", "der Ball rutscht unter {TW} hindurch - TOR!", "der Ball schlägt ein wie ein Blitz - TOR!", "der Ball schlägt ein wie ein Strahl - TOR!", "der Ball schlägt flach neben dem Pfosten ein - TOR!", "der Ball schlägt genau im Eck ein - TOR!", "der Ball schlägt genau im Knick ein - TOR!", "der Ball schlägt hoch im Netz ein - TOR!", "der Ball schlägt humorlos im Netz ein - TOR!", "der Ball schlägt im unteren Eck ein - TOR!", "der Ball schlägt mit voller Wucht im Netz ein - TOR!", "der Ball schlägt mit Wucht im Netz ein - TOR!", "der Ball schlägt über dem Keeper im Netz ein - TOR!", "der Ball schlägt unbarmherzig im Netz ein - TOR!", "der Ball schlägt unhaltbar hinter {TW} ein - TOR!", "der Ball schlägt unhaltbar im linken Eck ein - TOR!", "der Ball schlägt unhaltbar im rechten Eck ein - TOR!", "der Ball schlägt unten links im Netz ein - TOR!", "der Ball schlägt wie an der Schnur gezogen im Winkel ein - TOR!", "der Ball schraubt sich traumhaft ins Eck - TOR!", "der Ball senkt sich im letzten Moment ins Tor - TOR!", "der Ball springt vom Innenpfosten ins Netz - TOR!", "der Ball tanzt von der Latte hinter die Linie - TOR!", "der Ball verschwindet im Netz - TOR!", "der Ball wird immer länger und schlägt im Netz ein - TOR!", "der Ball wird noch entscheidend abgefälscht und landet im Netz - TOR!", "der Ball zappelt im linken Winkel - TOR!", "der Ball zappelt im rechten Winkel - TOR!", "der Distanzschuss sitzt exakt - TOR!", "der Fallrückzieher sitzt - TOR!", "der Fallrückzieher wird zur Sensation - TOR!", "der Hechtkopfball sitzt perfekt - TOR!", "der Jubel kennt keine Grenzen - TOR!", "der Keeper ist machtlos - TOR!", "der Keeper ist noch dran, kann den Treffer aber nicht verhindern - TOR!", "der Keeper streckt sich vergeblich - TOR!", "der Kopfball senkt sich unhaltbar ins Netz - TOR!", "der Kunstschuss wird belohnt - TOR!", "der Lupfer gerät perfekt - TOR!", "der Lupfer sitzt perfekt - TOR!", "der Nachschuss sitzt - TOR!", "der Nachschuss sitzt kompromisslos - TOR!", "der Pfosten hilft kräftig mit, TOR!", "der Schuss ist unhaltbar platziert - TOR!", "der Seitfallzieher landet im Tor - TOR!", "der Seitfallzieher zappelt im Netz - TOR!", "der Treffer fällt mit Ansage - TOR!", "der Treffer ist perfekt herausgespielt - TOR!", "der Volley landet traumhaft im Winkel - TOR!", "die Abwehr bekommt keinen Zugriff mehr, TOR!", "die Abwehr kann nur hinterherschauen - TOR!", "die Belohnung für einen mutigen Abschluss - TOR!", "die Belohnung für einen mutigen Versuch - TOR!", "die Fans rasten aus, TOR!", "die Fans stehen Kopf - TOR!", "die Kombination wird eiskalt abgeschlossen - TOR!", "die Kugel findet spektakulär den Weg ins Netz - TOR!", "die Kugel liegt im Netz - TOR!", "die Kugel schlägt direkt neben dem Lattenkreuz ein - TOR!", "die Kugel schlägt genau dort ein, wo es wehtut - TOR!", "die Kugel schlägt krachend im Netz ein - TOR!", "die Kugel segelt hinter {TW} ins Tor - TOR!", "durch die Beine eines Verteidigers ins Tor - TOR!", "durch die Beine von {TW} - TOR!", "durch Freund und Feind hindurch - TOR!", "durch Mann und Maus hindurch - TOR!", "ein abgefälschter Ball wird zum Glücksfall - TOR!", "ein Abschluss für das Highlight-Video - TOR!", "ein Abschluss wie aus dem Lehrbuch - TOR!", "ein Abschluss zum Zungeschnalzen - TOR!", "ein absolutes Traumtor - TOR!", "ein genialer Abschluss - TOR!", "ein Kunstschuss mit perfektem Ausgang - TOR!", "ein Moment für die Highlight-Reels - TOR!", "ein Schlenzer wie aus dem Lehrbuch - TOR!", "ein Schuss voller Überzeugung - TOR!", "ein Schuss wie ein Stich ins Herz der Defensive - TOR!", "ein Sonntagsschuss - TOR!", "ein Strich in den Winkel - TOR!", "ein technischer Geniestreich - TOR!", "ein Tor der Marke Traumtor - TOR!", "ein Traumtor aus der Distanz - TOR!", "ein Treffer aus dem Nichts - TOR!", "ein Treffer der Extraklasse - TOR!", "ein Treffer der höchsten Kategorie - TOR!", "ein Treffer der Kategorie Weltklasse - TOR!", "ein Treffer für die Geschichtsbücher - TOR!", "ein Treffer Marke Traumtor - TOR!", "ein Treffer wie gemalt - TOR!", "ein wunderschön herausgespielter Treffer - TOR!", "eine Augenweide von einem Abschluss - TOR!", "eine Bogenlampe mit Happy End - TOR!", "eine brillante Einzelaktion endet mit dem Tor - TOR!", "eine echte Willensleistung - TOR!", "eine perfekte Kombination endet mit dem Treffer - TOR!", "eine wunderbare Flanke findet ihren perfekten Abschluss - TOR!", "eiskalt vor {TW} geblieben - TOR!", "er Ball schlägt unhaltbar im Giebel ein - TOR!", "flach ins kurze Eck abgeschlossen - TOR!", "flach ins lange Eck vollendet - TOR!", "gegen die Laufrichtung von {TW} - TOR!", "gnadenlos ausgenutzt - TOR!", "humorlos abgeschlossen - TOR!", "kaltschnäuzig verwandelt - TOR!", "kein Verteidiger kommt mehr heran - TOR!", "kein Zweifel, der sitzt - TOR!", "keine Abwehrchance für {TW} - TOR!", "mit aller Entschlossenheit vollendet - TOR!", "mit chirurgischer Präzision vollendet - TOR!", "mit dem ersten Kontakt vollendet - TOR!", "mit der Hacke artistisch vollendet - TOR!", "mit der Hacke erfolgreich abgeschlossen - TOR!", "mit einem Aufsetzer unlösbar für {TW} - TOR!", "mit einem letzten Kontakt über die Linie gelenkt - TOR!", "mit einem satten Vollspannschuss ins Netz - TOR!", "mit einem sehenswerten Volley verwandelt - TOR!", "mit einem Strahl ins obere Eck - TOR!", "mit etwas Glück, aber nicht unverdient - TOR!", "mit feinem Effet ins lange Eck - TOR!", "mit letzter Konsequenz abgeschlossen - TOR!", "mit technisch höchstem Niveau abgeschlossen - TOR!", "mit viel Effet im Netz versenkt - TOR!", "mit viel Gefühl über {TW} hinweg - TOR!", "mit viel Übersicht vollendet - TOR!", "mustergültig abgeschlossen - TOR!", "per Direktabnahme ins Netz - TOR!", "perfekt in die Maschen gesetzt - TOR!", "perfekt ins Kreuzeck gezirkelt - TOR!", "perfekt platziert - TOR!", "präzise neben den Pfosten gesetzt - TOR!", "sensationell vollendet - TOR!", "über den herausstürmenden {TW} hinweg - TOR!", "über Umwege, aber erfolgreich - TOR!", "unter Mithilfe der Latte ins Netz - TOR!", "unwiderstehlich im Netz eingeschlagen - TOR!", "voller Mut belohnt sich {S} mit dem Treffer - TOR!", "volles Risiko, voller Erfolg - TOR!", "vom Innenpfosten ins Netz - TOR!", "vom linken Innenpfosten ins Tor gesprungen - TOR!", "vom rechten Innenpfosten hinter die Linie - TOR!", "von der Unterkante der Latte hinter die Linie - TOR!", "wuchtig unter die Latte gesetzt - TOR!"]}};
    // ===== Torszenen-Baukasten: sinnvolle Zusammensetzung =====
    const bkPick = a => a[Math.floor(Math.random() * a.length)];
    const bkClean = s => s.replace(/\s+/g, ' ').replace(/\s+([.,!?])/g, '$1').trim();
    const bkHeight = t => {
      if (/Heber|Lupfer|Bogenlampe|Bogenkopfball|schraubt sich|hebt (den Ball|die Kugel)|Fallr(ü|ue)ckzieher|Flugkopfball|(ü|ue)ber den .*(TW|Keeper|Torwart|Torh(ü|ue)ter)|\bBogen/i.test(t)) return 'hoch';
      if (/Flachschuss|\bflach\b|\bflachen\b|Aufsetzer|durch die Beine|am Boden|stochert|Hacke|Dropkick|Gr(ä|ae)tsche|bugsiert|Spannsto(ß|ss)/i.test(t)) return 'flach';
      return 'egal';
    };
    const bkIsOver = e => /dr(ü|ue)ber|(ü|ue)ber (die |das |den )?(Latte|Tor|Kasten|Geh(ä|ae)use|Querbalken|lange|Kreuzeck|Schulter)|zu hoch|Tribüne|Wolken|segelt.{0,12}(ü|ue)ber|senkt sich zu sp(ä|ae)t|fliegt.{0,20}(ü|ue)ber|verzogen/i.test(e);
    const bkHasDir = e => /\blinks?\b|\blinke[nrs]?\b|\brechts?\b|\brechte[nrs]?\b|kurze[nrs]?|lange[nrs]?|\bkurz\b|\blang\b|Winkel|Kreuzeck|Innenpfosten|(linken|rechten) Pfosten|erste[nr] Pfosten|zweite[nr] Pfosten|\bMitte\b|obere[ns]?|unter die Latte|ins .{0,6}Eck|aufs .{0,6}Eck|am .{0,10}Pfosten|Torecke/i.test(e);
    const bkKernHasTarget = k => /aufs (Tor|Geh|lange|kurze|Eck)|Richtung|ins .{0,8}Eck|in die (Ecke|Mitte|Torecke)|auf das (Tor|Geh)|\bWinkel\b|\bPfosten\b|aufs Geh(ä|ae)use|auf den .{0,12}Pfosten|aufs .{0,6}Eck/i.test(k);
    const bkHighZiel = z => /unter die Latte|Winkel|obere[ns]?|Lattenkreuz|Querbalken|(ü|ue)ber die Schulter|Kreuzeck|\bhoch\b/i.test(z);
    const bkFlatZiel = z => /\bflach\b|\bunten\b|durch die Beine|am Boden|zwischen die Beine|zwischen Pfosten|zwischen .{0,14}und/i.test(z);
    // Ergebnis, das eine FUSS-Abschlussart beschreibt (passt nicht zu Kopfball)
    const bkFootMethod = e => /mit der Hacke|\bLupfer\b|Spannsto(ß|ss)|\bVolley\b|Schlenzer|Fu(ß|ss)spitze|Fallr(ü|ue)ckzieher|Distanzschuss|mit dem (linken|rechten) Fu(ß|ss)|per Direktabnahme|Dropkick|Seitfallzieher/i.test(e);
    // Ergebnis, das einen KOPFBALL beschreibt (passt nicht zu Fuß-Schuss)
    const bkHeadMethod = e => /per Kopf|mit dem Kopf|\bKopfball\b|k(ö|oe)pft|Kopfsto(ß|ss)|Flugkopfball/i.test(e);
    const bkKeeperSyn = ['der Keeper', 'der Schlussmann', 'der Torh\u00fcter', 'der Schnapper', 'der Mann zwischen den Pfosten'];
    const bkNameMarkup = {};
    const bkTeamColorCache = {};
    const bkTeamColor = side => {
      if (bkTeamColorCache[side] !== undefined) return bkTeamColorCache[side];
      const DEF = side === 'a' ? '#6ea8ff' : '#7ed957';
      let col = null;
      try {
        const map = side === 'a' ? awayMap : homeMap;
        const names = Object.values(map || {}).filter(Boolean);
        const els = [...document.querySelectorAll('a,span,font')];
        const counts = {};
        for (const nm of names) {
          const el = els.find(e => (e.textContent || '').trim() === nm);
          if (!el) continue;
          const c = getComputedStyle(el).color; const m = c && c.match(/(\d+),\s*(\d+),\s*(\d+)/);
          if (!m) continue;
          const r = +m[1], g = +m[2], b = +m[3], mn = Math.min(r, g, b), mx = Math.max(r, g, b);
          // nur klar gesaettigte, nicht-weisse/nicht-graue Farben zulassen
          if (mx >= 90 && mn <= 210 && (mx - mn) >= 25) counts[c] = (counts[c] || 0) + 1;
        }
        let best = 0; for (const k in counts) if (counts[k] > best) { best = counts[k]; col = k; }
      } catch (e) { }
      return (bkTeamColorCache[side] = col || DEF);
    };
    const bkNameHTML = (nm, side) => {
      const key = nm + '|' + (side || '');
      if (bkNameMarkup[key] != null) return bkNameMarkup[key];
      return (bkNameMarkup[key] = '<b style="color:' + bkTeamColor(side) + ' !important;font-weight:700">' + nm + '</b>');
    };
    const bkSubst = (s, shooterHtml, keeperHtml) => {
      s = s.replace(/\{S\}/g, shooterHtml);
      let first = true;
      s = s.replace(/\{TW\}/g, () => { if (first) { first = false; return keeperHtml; } return bkKeeperSyn[Math.floor(Math.random() * bkKeeperSyn.length)]; });
      return s;
    };
    const bkDetectType = res => {
      if (/,\s*TOR\b|\bTOR\b|\bTOR!|machtlos/.test(res)) return 'tor';
      if (/zur Ecke|dreht den Ball.*Ecke|lenkt.*(zur )?Ecke|f(ä|ae)ustet.*Ecke|um den Pfosten|(ü|ue)ber die Latte zur Ecke/i.test(res)) return 'zurEcke';
      if (/nicht richtig festhalten|abklatschen|abprallen|prallt.*ab|l(ä|ae)sst.*(fallen|abprallen)|Nachschuss|nicht festhalten|nicht unter Kontrolle|kann.*nicht.*halten|klatscht.*ab/i.test(res)) return 'abpraller';
      if (/an den Pfosten|an die Latte|Pfosten|Latte|Querbalken|Aluminium|Geb(ä|ae)lk/i.test(res)) return 'alu';
      if (/geblockt|abgeblockt|abgewehrt|\bblockt\b|wirft sich.*Schuss|Abwehrbein|dazwischen|abgef(ä|ae)lscht.*Verteidiger/i.test(res)) return 'geblockt';
      if (/neben das Tor|(ü|ue)ber das Tor|am Tor vorbei|\bvorbei\b|Toraus|daneben|dr(ü|ue)ber|verzogen|verzieht|Au(ß|ss)ennetz/i.test(res)) return 'vorbei';
      if (/hat den Ball sicher|h(ä|ae)lt|pariert|f(ä|ae)ngt|locker festhalten|landet beim Keeper|\bsicher\b|festhalten|packt|entsch(ä|ae)rft|Reflex|Parade/i.test(res)) return 'paradeGehalten';
      return null;
    };
    const bkAssemble = (kind, type, shooter, keeper, shSide, noScene) => {
      const B = BAUKASTEN;
      let kern;
      if (kind === 'kopf') { if (!B.kopf.length) return null; kern = bkPick(B.kopf); }
      else { if (!B.schuss.length) return null; kern = bkPick(B.schuss).t; }
      const kh = bkHeight(kern);
      let pool = (B.erg[type] || []).slice();
      if (!pool.length) return null;
      // Kopf/Fuss-Konflikt im Ergebnis vermeiden
      let f1 = pool.filter(e => kind === 'kopf' ? !bkFootMethod(e) : !bkHeadMethod(e));
      if (f1.length) pool = f1;
      // Hoehe: Flachschuss nicht drueber, Heber nicht flach am Pfosten vorbei
      if (type === 'vorbei' && kh === 'flach') { const f = pool.filter(e => !bkIsOver(e)); if (f.length) pool = f; }
      const erg = bkPick(pool);
      let ziel = '';
      if (!bkKernHasTarget(kern) && !bkHasDir(erg) && Math.random() < 0.55) {
        let zp = B.ziel.filter(z => kh === 'flach' ? !bkHighZiel(z) : (kh === 'hoch' ? !bkFlatZiel(z) : true));
        if (zp.length) ziel = bkPick(zp);
      }
      const szene = (!noScene && Math.random() < 0.45 && B.szene.length) ? bkPick(B.szene) : '';
      let s = (szene ? szene + ' ' : '') + kern + (ziel ? ' ' + ziel : '') + ' - ' + erg;
      const kSide = shSide === 'h' ? 'a' : 'h';
      const kHtml = /^[a-zä-ü]/.test(keeper) ? keeper : bkNameHTML(keeper, kSide);
      return bkSubst(bkClean(s), bkNameHTML(shooter, shSide || 'h'), kHtml);
    };
    const origRowCells = (() => {
      const doc = new DOMParser().parseFromString(osOriginalHTML || '', 'text/html');
      const t = [...doc.querySelectorAll('table')].find(x => /Anpfiff/.test(x.textContent));
      if (!t) return [];
      return [...t.querySelectorAll('tr')].filter(tr => (tr.textContent || '').trim()).map(tr => { const c = [...tr.children].find(x => (x.textContent || '').trim().length > 12) || tr.children[tr.children.length - 1]; return c ? c.innerHTML : ''; });
    })();
    const offsideScene = (player, side) => {
      const S = player ? bkNameHTML(player, side) : 'der Angreifer';
      const close = Math.random() < 0.55;
      const stell = close
        ? pickNR(['{S} startet einen Tick zu früh', '{S} steht hauchdünn im Abseits', '{S} löst sich einen Wimpernschlag zu früh', '{S} ist um Haaresbreite zu weit vorn', '{S} kommt einen Schritt zu spät aus dem Abseits heraus'])
        : pickNR(['{S} steht klar im Abseits', '{S} ist deutlich zu früh dran', '{S} löst sich viel zu früh aus der Abwehrkette', '{S} steht mehrere Schritte zu weit vorn']);
      const lini = close
        ? pickNR(['der Linienrichter zögert kurz, hebt dann doch die Fahne', 'der Assistent entscheidet nach kurzem Zögern auf Abseits', 'der Linienrichter fuchtelt mit der Fahne'])
        : pickNR(['der Linienrichter hebt sofort die Fahne', 'der Assistent ist auf der Höhe und hebt zu Recht die Fahne', 'da gibt es keine Diskussion']);
      const isHome = side === 'h';
      const crowd = (isHome && close) ? pickNR(['Pfiffe von den Rängen – die Heimfans sind sich sicher, das war keiner', 'Unmut im Rund, die Heimkurve reklamiert lautstark', 'die Heimfans protestieren – für sie war das kein Abseits'])
        : (isHome && !close) ? pickNR(['die Heimfans nehmen die Entscheidung hin', 'ein kurzes Aufstöhnen geht durch das Rund'])
        : (!isHome && close) ? pickNR(['erleichtertes Aufatmen auf den Heimrängen', 'die Heimfans bejubeln die Fahne des Assistenten'])
        : pickNR(['zustimmender Applaus von den Heimrängen', 'die Heimfans quittieren die Abseitsstellung mit Applaus']);
      const chance = Math.random() < 0.4 ? pickNR([' Das hätte gefährlich werden können.', ' Eine vielversprechende Aktion wird so gestoppt.', ' Schade um die Situation.']) : '';
      const body = cap((stell + ', ' + lini).replace(/\{S\}/g, S));
      return '<b style="color:#f59e0b">ABSEITS! ' + body + '. ' + cap(crowd) + '.' + chance + '</b>';
    };
    const penDecision = (op, fouled, side, contro) => {
      const foulTxt = op.replace(/\s*[–-]\s*ELFMETER.*/i, '').trim();
      const forHome = side === 'h';
      const strit = contro >= 1 || /rutscht.{0,20}aus/i.test(op);
      const clarity = pickNR((strit && STDX.elfStrittig.length) ? STDX.elfStrittig : (STDX.elfKlar.length ? STDX.elfKlar : ['ein klarer Elfmeter']));
      const crowd = pickNR(forHome ? (STDX.elfFanPos.length ? STDX.elfFanPos : ['Jubel auf den Rängen']) : (STDX.elfFanNeg.length ? STDX.elfFanNeg : ['Pfiffe auf den Rängen']));
      return foulTxt + ' – <b style="color:#e11d1d">ELFMETER!</b> Der Schiedsrichter zeigt auf den Punkt – ' + clarity + '. ' + cap(crowd);
    };
    const penExecution = (shooter, side, op) => {
      const S = shooter ? bkNameHTML(shooter, side) : 'der Schütze';
      const TW = stdKeeper(side);
      const links = /link/i.test(op), rechts = /recht/i.test(op), winkel = /Winkel/i.test(op);
      const ziel = winkel ? ('in den ' + (links ? 'linken' : rechts ? 'rechten' : 'oberen') + ' Winkel') : (links ? 'ins linke Eck' : rechts ? 'ins rechte Eck' : 'ins Eck');
      const isTor = /\bTO+R\b/.test(op);
      const isSave = !isTor && /gehalten|pariert|hält|entschärft|abgewehrt|Glanzparade|wehrt/i.test(op);
      const isMiss = !isTor && /vorbei|verschossen|neben|drüber|über das Tor|verzieht|Pfosten|Latte|Aluminium/i.test(op);
      const fill = t => t.replace(/\{S\}/g, S).replace(/\{TW\}/g, TW).replace(/\{Ziel\}/g, ziel);
      let exec;
      if (isSave) exec = fill(pickNR(STDX.elfHalt));
      else if (isMiss) exec = fill(pickNR(STDX.elfMiss));
      else exec = fill(pickNR(STDX.elfTor));
      return cap(fill(pickNR(STDX.elfAnlauf))) + ' – ' + boldOut(cap(exec));
    };
const STDX = {"fsAnlauf": ["Der Schiedsrichter gibt den Ball frei. Die Mauer steht, {TW} dirigiert. {S} legt sich den Ball zurecht und läuft an", "Gefährliche Freistoßposition. {TW} ordnet die Mauer, {S} nimmt Maß und läuft an", "{S} will es direkt versuchen. Die Mauer steht, {TW} ist auf der Hut", "{S} konzentriert sich, blickt auf das Tor und startet seinen Anlauf", "Ruhig atmet {S} durch, dann setzt er zum Freistoß an", "{TW} positioniert die Mauer, {S} läuft entschlossen an", "{S} nimmt wenige Schritte Anlauf und visiert das Tor an", "Spannung im Stadion, {S} macht sich bereit", "{S} wartet auf den Pfiff und läuft los", "Der Ball liegt perfekt, {S} startet seinen Anlauf", "{TW} wirkt angespannt, {S} kommt angelaufen", "{S} fokussiert das Ziel und zieht das Tempo an", "Jetzt wird es gefährlich, {S} nimmt Anlauf", "{S} visiert die Lücke in der Mauer an", "Mit schnellen Schritten nähert sich {S} dem Ball", "{S} startet seinen gewohnt kurzen Anlauf", "Der Freistoß ist freigegeben, {S} läuft an", "{TW} steht bereit, {S} setzt zum Schuss an", "{S} macht die letzten Schritte zum Ball", "Alle Blicke richten sich auf {S}", "Vielversprechende Position für {S}", "{S} wirkt entschlossen und läuft an", "Der Moment ist da, {S} startet seinen Versuch", "{S} nimmt Anlauf für die Standardsituation", "Die Mauer springt bereits nervös, {S} kommt angelaufen"], "fsTor": ["{S} zirkelt den Ball über die Mauer {Ziel} – {TW} ist machtlos, TOR!", "{S} jagt die Kugel durch die Mauer {Ziel} – drin!", "ein Traumfreistoß! {S} hämmert den Ball {Ziel} – TOR!", "{S} schlenzt den Ball präzise {Ziel} – TOR!", "{S} trifft den Ball perfekt {Ziel} – verwandelt!", "{S} setzt den Freistoß traumhaft {Ziel} – TOR!", "{TW} streckt sich vergeblich, {S} trifft {Ziel} – drin!", "{S} hebt den Ball geschickt über die Mauer {Ziel} – TOR!", "Ein Kunstschuss von {S} {Ziel} – Tor!", "{S} findet die Lücke und trifft {Ziel} – TOR!", "Der Ball schlägt unhaltbar {Ziel} ein – TOR!", "{S} trifft wie aus dem Lehrbuch {Ziel} – drin!", "Präzise Ausführung von {S} {Ziel} – TOR!", "{TW} kommt nicht heran, {S} trifft {Ziel} – verwandelt!", "Freistoßqualität von {S} {Ziel} – TOR!", "{S} schickt den Ball gefühlvoll {Ziel} – drin!", "Herrlich geschossen von {S} {Ziel} – TOR!", "{S} trifft punktgenau {Ziel} – verwandelt!", "Der Ball rauscht {Ziel} – TOR!", "{S} sorgt mit dem Freistoß für Jubel {Ziel} – TOR!", "Perfekt gezielt von {S} {Ziel} – drin!", "{S} erwischt den Ball optimal {Ziel} – TOR!", "Unhaltbar für {TW}, der Ball landet {Ziel} – TOR!", "{S} krönt den Angriff mit einem Freistoßtor {Ziel} – TOR!", "Genial ausgeführt von {S} {Ziel} – drin!"], "fsParade": ["{S} zieht ab – {TW} fischt den Ball stark aus dem Eck!", "{S} zirkelt ihn über die Mauer – {TW} ist mit einer Glanzparade zur Stelle!", "{S} tritt an – {TW} lenkt den Ball noch über die Latte!", "{S} schießt platziert – {TW} pariert glänzend!", "{S} visiert das Eck an – {TW} bekommt die Fingerspitzen dran!", "Starker Versuch von {S} – {TW} hält sicher", "{S} zieht den Ball aufs Tor – {TW} reagiert blitzschnell!", "{S} bringt viel Schnitt hinein – {TW} klärt zur Ecke", "{TW} taucht ab und verhindert den Treffer", "{S} schießt hart – {TW} wehrt den Ball ab", "Guter Freistoß von {S} – {TW} ist aufmerksam", "{S} bringt den Ball gefährlich aufs Tor – gehalten von {TW}", "{TW} macht sich lang und pariert", "{S} versucht es direkt – {TW} bleibt Sieger", "Starke Reaktion von {TW} nach dem Schuss von {S}", "{S} schlenzt den Ball aufs Eck – {TW} verhindert das Tor", "{TW} bekommt noch die Hand an den Ball", "{S} zielt genau – {TW} hält überragend", "Der Freistoß kommt gefährlich – {TW} klärt stark", "{S} zieht ab – sensationelle Parade von {TW}", "{TW} lenkt den Ball um den Pfosten", "{S} hämmert drauf – {TW} reißt die Arme hoch", "{TW} entschärft den Freistoß mit sicherem Zugriff", "{S} versucht es mit Gefühl – {TW} passt auf", "{TW} bewahrt sein Team vor dem Gegentor"], "fsVorbei": ["{S} zieht ab – der Ball streicht knapp am Pfosten vorbei", "{S} tritt an – der Ball segelt knapp über das Tor", "{S} verzieht – der Ball segelt am Gehäuse vorbei", "{S} schießt knapp rechts vorbei", "{S} setzt den Ball über die Latte", "{S} verfehlt das Ziel nur um Zentimeter", "Der Versuch von {S} geht am linken Pfosten vorbei", "{S} trifft den Ball nicht optimal – vorbei", "Knapp daneben von {S}", "Der Ball von {S} rauscht am Tor vorbei", "{S} setzt den Freistoß zu hoch an", "Der Schuss von {S} verzieht sich", "{S} zielt auf das Eck – knapp vorbei", "Wenig fehlt bei diesem Versuch von {S}", "{S} schlenzt den Ball neben das Tor", "Der Ball landet nicht im Ziel", "{S} hat die richtige Idee, aber nicht die Präzision", "Der Freistoß von {S} geht drüber", "{S} setzt den Ball am Pfosten vorbei", "Knappe Angelegenheit, doch kein Treffer", "Der Ball segelt über den Querbalken", "{S} verpasst das Tor knapp", "Der Schuss von {S} geht ins Toraus", "Zu ungenau von {S}", "Der Abschluss von {S} rauscht vorbei"], "elfAnlauf": ["{S} legt sich den Ball zurecht, {TW} tänzelt auf der Linie", "{S} nimmt sich die Kugel, {TW} versucht noch zu irritieren", "Alle Augen auf den Punkt – {S} nimmt Maß", "{S} schreitet langsam zum Punkt", "{S} wirkt konzentriert und startet den Anlauf", "Alles ist bereit, {S} läuft los", "{TW} macht sich groß, {S} nimmt Anlauf", "Ruhig und fokussiert steht {S} am Punkt", "Nun liegt die Verantwortung bei {S}", "{S} wartet kurz und läuft an", "Der Druck ist groß, {S} bleibt ruhig", "{TW} versucht die Ecke zu erahnen", "{S} startet seinen Ablauf mit ruhigen Schritten", "Spannung pur vor dem Strafstoß", "{S} fokussiert sich auf das Ziel", "Der Anlauf von {S} beginnt", "{TW} springt auf der Linie, {S} nähert sich dem Ball", "Alles wartet auf den Schuss von {S}", "{S} läuft entschlossen an", "Der Strafstoß steht bevor, {S} startet", "{S} nimmt Tempo auf", "Der Schütze ist bereit: {S}", "Die Nerven werden geprüft, {S} läuft an", "{TW} bleibt auf der Linie, {S} kommt"], "elfTor": ["{S} bleibt eiskalt und schiebt den Ball {Ziel} – {TW} ist in der falschen Ecke, verwandelt!", "{S} verlaedt {TW} und trifft {Ziel} – Tor!", "{S} nimmt sich ein Herz und jagt die Kugel {Ziel} – drin!", "{S} schiebt sicher ein – TOR!", "{TW} ist chancenlos, {S} trifft {Ziel} – verwandelt!", "Souverän von {S} {Ziel} – TOR!", "{S} versenkt den Ball eiskalt {Ziel} – drin!", "Der Strafstoß sitzt perfekt {Ziel} – TOR!", "{S} bleibt cool und trifft {Ziel} – verwandelt!", "Keine Chance für {TW} – TOR durch {S}!", "{S} entscheidet sich für {Ziel} – Tor!", "Sicher verwandelt von {S}", "{S} trifft nervenstark – TOR!", "Der Ball landet {Ziel} – verwandelt!", "{S} macht alles richtig – Tor!", "Präziser Strafstoß von {S} – TOR!", "{TW} liegt falsch, {S} jubelt – verwandelt!", "{S} schließt erfolgreich ab – TOR!", "Kaltblütig ausgeführt von {S} – drin!", "Der Strafstoß sitzt – TOR!", "{S} trifft ohne zu zögern – verwandelt!", "Perfekt platziert von {S} – TOR!", "Der Ball schlägt ein – Tor!", "{S} behält die Nerven – verwandelt!", "Treffer vom Punkt durch {S}"], "elfHalt": ["{TW} ahnt die Ecke, taucht ab und pariert – gehalten!", "Was fuer eine Parade! {TW} entschärft den Strafstoß!", "{TW} fliegt in die richtige Ecke und hält – der Held des Moments!", "{TW} reagiert stark und hält den Strafstoß", "Pariert! {TW} ist zur Stelle", "{TW} gewinnt das Duell vom Punkt", "Starke Tat von {TW} – gehalten!", "{S} scheitert an {TW}", "{TW} macht sich lang und pariert", "Der Torwart ahnt die Richtung und hält", "Glanzparade von {TW} beim Elfmeter", "{TW} verhindert den Einschlag", "Der Strafstoß wird entschärft", "{TW} bleibt cool und hält", "Riesenparade von {TW}!", "{S} findet seinen Meister in {TW}", "Der Torwart lenkt den Ball weg", "{TW} rettet seine Mannschaft", "Gehalten! {TW} ist nicht zu überwinden", "Klasse Reflex von {TW}", "{TW} pariert sicher", "Der Keeper bleibt Sieger", "Starke Nerven von {TW}", "{TW} entschärft den Versuch", "Der Strafstoß findet keinen Weg ins Tor"], "elfMiss": ["{S} jagt den Ball über das Tor – verschossen!", "{S} setzt den Ball neben das Gehäuse – vergeben!", "{S} knallt den Ball an das Aluminium – vergeben!", "{S} schießt deutlich vorbei – verschossen!", "Daneben! {S} vergibt vom Punkt", "{S} trifft nur den Außenpfosten – vergeben!", "Der Ball von {S} geht über die Latte – verschossen!", "Große Chance vergeben von {S}", "{S} setzt den Schuss neben den Pfosten", "Zu hoch angesetzt von {S} – vergeben!", "{S} verzieht vom Elfmeterpunkt", "Der Strafstoß misslingt {S}", "Kein Treffer für {S} – verschossen!", "{S} lässt die Gelegenheit liegen", "Der Ball landet nicht im Tor", "Fehlschuss von {S} vom Punkt", "{S} scheitert an sich selbst – vergeben!", "Knapp vorbei von {S}", "Der Versuch geht daneben", "{S} trifft das Gebälk – vergeben!", "Der Ball rauscht vorbei – verschossen!", "Ungenau ausgeführt von {S}", "Ausgelassen von {S}", "Keine Belohnung für {S}", "Der Elfmeter geht nicht hinein"], "eckEin": ["{S} läuft zur Fahne, hebt den Arm und bringt die Ecke {Ziel}, der Ball segelt", "{S} tritt die Ecke – die Hereingabe fliegt scharf {Ziel}", "{S} legt sich den Ball zurecht und bringt die Freistoßflanke {Ziel}", "{S} bringt den Ball mit viel Schnitt herein", "{S} schlägt die Ecke hoch in den Strafraum", "Gefährliche Hereingabe von {S} {Ziel}", "{S} zieht die Flanke präzise {Ziel}", "Der Ball kommt scharf von {S}", "{S} serviert die Ecke in den Fünfmeterraum", "Die Hereingabe von {S} findet den Strafraum", "{S} bringt den Ball gefährlich vors Tor", "Hohe Flanke von {S} {Ziel}", "{S} schlägt den Ball mit Zug hinein", "Jetzt kommt die Hereingabe von {S}", "Der Ball segelt von {S} in die Mitte", "{S} bringt eine scharfe Ecke hinein", "Präzise Ausführung von {S}", "{S} findet mit der Flanke den Strafraum", "Die Ecke kommt gefährlich herein", "{S} zirkelt den Ball vors Tor", "Gute Hereingabe von {S}", "Der Ball fliegt Richtung Gefahrenzone", "{S} schlägt die Standardsituation hinein", "Viel Druck hinter dieser Hereingabe", "{S} bringt den Ball punktgenau hinein"], "elfKlar": ["kein Zweifel, ein klarer Elfmeter", "da gibt es nichts zu diskutieren", "vertretbare Entscheidung des Schiedsrichters", "der Referee zeigt sofort auf den Punkt", "hier zeigt der Unparteiische keine Sekunde zu spät auf den Punkt", "der Kontakt reicht dem Schiedsrichter aus", "der Schiedsrichter ist sich sicher", "eine enge Entscheidung zugunsten des Angreifers", "der Referee bewertet das als Foul", "der Pfiff kommt prompt", "das Stadion reagiert sofort auf die Entscheidung"], "elfStrittig": ["doch das sah eher nach einer Schwalbe aus", "eine hoechst umstrittene Entscheidung", "eine allerdings sehr weiche Entscheidung", "ein kurioser Elfmeter nach einem Ausrutscher", "ein Pfiff, der für Diskussionen sorgt", "der Strafstoßpfiff überrascht viele Zuschauer", "eine knifflige Situation mit Elfmeterpfiff", "nach kurzem Zögern gibt es Elfmeter", "eine mutige Entscheidung des Referees", "auch nach Wiederholung bleibt die Szene strittig", "großer Ärger bei der verteidigenden Mannschaft", "ein Pfiff mit viel Gesprächsstoff", "die Proteste helfen nichts, es bleibt beim Elfmeter", "eine Szene, die die Gemüter erhitzt"], "elfFanPos": ["Riesenjubel auf den Heimrängen.", "Lautstarke Reaktionen auf den Rängen.", "Die Fans diskutieren heftig über die Szene.", "Großer Jubel bei einem Teil des Publikums.", "Die Zuschauer feiern die Entscheidung.", "Die Fans sorgen für eine hitzige Atmosphäre.", "Auf den Rängen gibt es gemischte Gefühle.", "Die Entscheidung wird lautstark kommentiert.", "Die Zuschauer stehen hinter dem Schiedsrichter.", "Riesige Emotionen auf den Tribünen.", "Das Publikum reagiert sofort.", "Die Stimmung kocht hoch.", "Lauter Beifall von den Heimrängen.", "Die Reaktion der Zuschauer fällt eindeutig aus.", "Das Stadion bebt.", "Große Aufregung auf den Rängen.", "Sofort gibt es Diskussionen im Publikum."], "elfFanNeg": ["Die Heimfans bejubeln den Pfiff lautstark.", "Pfeifkonzert und wütende Proteste - fuer die Heimfans nie ein Elfmeter!", "Die Heimfans nehmen den Pfiff missmutig hin.", "Lautstarke Reaktionen auf den Rängen.", "Die Fans diskutieren heftig über die Szene.", "Unmut macht sich auf den Tribünen breit.", "Pfiffe hallen durchs Stadion.", "Die Fans sorgen für eine hitzige Atmosphäre.", "Auf den Rängen gibt es gemischte Gefühle.", "Die Entscheidung wird lautstark kommentiert.", "Jubel und Proteste halten sich die Waage.", "Die Fans zeigen ihren Unmut deutlich.", "Riesige Emotionen auf den Tribünen.", "Das Publikum reagiert sofort.", "Die Stimmung kocht hoch.", "Viele Fans können den Pfiff kaum glauben.", "Die Reaktion der Zuschauer fällt eindeutig aus.", "Das Stadion bebt.", "Große Aufregung auf den Rängen.", "Sofort gibt es Diskussionen im Publikum."], "eckTor": ["{Kopf} steigt am höchsten und köpft – TOR!", "{Kopf} kommt zum Abschluss – TOR!", "{Kopf} verlängert den Ball – TOR!", "{Kopf} gewinnt das Luftduell – TOR!"], "eckSave": ["{Kopf} kommt frei zum Kopfball – {TW} faustet den Ball noch weg", "der Ball segelt gefährlich herein – {TW} pflückt ihn sicher aus der Luft", "{TW} greift sicher zu", "{Kopf} köpft aufs Tor – {TW} hält stark", "Chance nach der Ecke, aber kein Tor", "{TW} ist aufmerksam und fängt den Ball", "Der Ball springt durch den Strafraum", "Kopfball von {Kopf} – gehalten!"], "eckClear": ["die Abwehr geht dazwischen – der Ball wird aus der Gefahrenzone geköpft", "{TW} klärt vor {Kopf} mit den Fäusten", "Gefährliche Szene, doch die Abwehr bereinigt", "Die Verteidigung kann klären", "Der Ball wird aus dem Strafraum geschlagen", "Die Hereingabe sorgt für Gefahr, doch die Abwehr steht", "{TW} klärt in letzter Sekunde", "Abwehrbein dazwischen, Gefahr gebannt", "Der Ball wird noch abgefälscht"], "eckMiss": ["{Kopf} setzt den Ball knapp daneben", "{Kopf} steigt hoch – der Ball geht vorbei", "{Kopf} setzt den Kopfball über das Tor", "{Kopf} kommt frei zum Abschluss – vorbei"]};
    const boldOut = t => t.replace(/(TOR!|Tor!|verwandelt!|gehalten!|verschossen!|vergeben!|drin!)/g, '<b>$1</b>');
    const stdKeeper = side => bkNameHTML(side === 'h' ? (awayMap['T'] || 'der Keeper') : (homeMap['T'] || 'der Keeper'), side === 'h' ? 'a' : 'h');
    const directFK = (op, resultOp, side, forceGoal) => {
      const shooter = (findNamesInLine(op).slice(-1)[0] || {}).nm;
      const S = shooter ? bkNameHTML(shooter, side) : 'der Schütze';
      const TW = stdKeeper(side);
      const links = /linke Torseite|links/i.test(op), rechts = /rechte Torseite|rechts/i.test(op);
      const ziel = links ? 'ins linke Eck' : rechts ? 'ins rechte Eck' : 'Richtung Tor';
      const goal = forceGoal || /Neuer Spielstand|machtlos|angewurzelt|geschlagen|zappelt|unhaltbar/i.test(resultOp) || /\bTO+R\b/.test(resultOp);
      const save = !goal && /pariert|faustet|Torwart|Keeper|Schlussmann|Torhüter|abgewehrt|lenk|um den Pfosten|Fingerspitzen|Glanzparade|hält|pflückt|fängt|abgetropft|entschärft/i.test(resultOp);
      const miss = !goal && !save && /vorbei|neben|drüber|über das Tor|verzieht|Latte|Pfosten|Toraus/i.test(resultOp);
      const fill = t => t.replace(/\{S\}/g, S).replace(/\{TW\}/g, TW).replace(/\{Ziel\}/g, ziel);
      const intro = fill(pickNR(STDX.fsAnlauf));
      let res;
      if (goal) res = fill(pickNR(STDX.fsTor));
      else if (save) res = fill(pickNR(STDX.fsParade));
      else if (miss) res = fill(pickNR(STDX.fsVorbei));
      else res = fill(pickNR([S + ' zirkelt den Ball gefährlich ' + ziel, S + ' bringt den Freistoß gefährlich ' + ziel + ' aufs Tor']));
      return cap(intro) + ' – ' + boldOut(cap(res));
    };
    const setPlay = (op, resultOp, side, isCorner, forceGoal) => {
      const deliverer = (findNamesInLine(op).slice(-1)[0] || {}).nm;
      const D = deliverer ? bkNameHTML(deliverer, side) : 'der Schütze';
      const TW = stdKeeper(side);
      const ziel = /erste[rn]? Pfosten|kurze[rn]? Pfosten|kurzen Pfosten/i.test(op) ? 'an den ersten Pfosten' : /zweite[rn]? Pfosten|langen Pfosten/i.test(op) ? 'an den zweiten Pfosten' : /vor das Tor|Tormitte|Zentrum|zentral/i.test(op) ? 'in die Mitte' : /Fünfer|Fünfmeter/i.test(op) ? 'in den Fünfmeterraum' : 'in den Strafraum';
      const goal = forceGoal || /Neuer Spielstand/i.test(resultOp) || /\bTO+R\b/.test(resultOp);
      const cleared = /Gefahrenzone|klärt|köpft (den Ball )?(weg|aus)|geklärt|befreit|aus der Gefahr/i.test(resultOp);
      const saved = /faustet|pariert|lenkt|abgewehrt|Fingerspitzen|Glanzparade|pflückt|fängt|hält/i.test(resultOp);
      const header = (findNamesInLine(resultOp)[0] || {}).nm;
      const Hatt = header ? bkNameHTML(header, side) : 'ein Angreifer';
      const Hdef = header ? bkNameHTML(header, side === 'h' ? 'a' : 'h') : 'die Abwehr';
      let pool, kopf;
      if (goal && STDX.eckTor.length) { pool = STDX.eckTor; kopf = Hatt; }
      else if (saved && STDX.eckSave.length) { pool = STDX.eckSave; kopf = Hatt; }
      else if (cleared && STDX.eckClear.length) { pool = STDX.eckClear; kopf = Hdef; }
      else { pool = STDX.eckSave.concat(STDX.eckClear, STDX.eckMiss); kopf = Hatt; }
      if (!pool.length) pool = ['der Ball wird im Strafraum geklärt'];
      const fill = t => t.replace(/\{S\}/g, D).replace(/\{TW\}/g, TW).replace(/\{Ziel\}/g, ziel).replace(/\{Kopf\}/g, kopf);
      return cap(fill(pickNR(STDX.eckEin))) + ' – ' + boldOut(cap(fill(pickNR(pool))));
    };
    reportRows.forEach((r, idx) => {
      const rowText = txt(r);
      const first = txt(r.children && r.children[0]);
      const min = /^\d+\.?$/.test(first) ? parseInt(first, 10) : null;
      if (min != null) { buildMin = min; if (min > maxMin) maxMin = min; }
      feed(rowText, buildMin);
      dangerAcc(r, buildMin);
      const rowCards = [];
      rowLinesOf(r).forEach(ln => {
        const grob = /grob|brutal|r(ü|ue)de|Notbremse|(ü|ue)bles Foul|b(ö|oe)ses Foul|hart eingestiegen|Blutgr(ä|ae)tsche|von hinten|r(ü|ue)cksichtslos|gef(ä|ae)hrliches Spiel|Tätlichkeit/i.test(ln);
        if (!/wechselt|kommt für/.test(ln) && /Notizbuch|gelbe[nrs]? Kart|gelben Karton|\bGelb\b|Karton|verwarnt|Verwarnung/i.test(ln)) {
          const info = cardPlayerSide(ln); const side = info ? info.side : sideOf(ln);
          let type = 'yellow';
          if (info) { const k = sn(info.name); const pc = (pcards[k] = pcards[k] || { y: 0, r: 0 }); pc.y++; if (pc.y >= 2) { type = 'yellowred'; pc.yr = 1; } }
          mEvents.push({ min: buildMin, type, side, row: r });
          rowCards.push({ name: info ? info.name : '', side, type, grob });
        }
        if (/rote Karte|Platzverweis|\bRot\b|vom Platz|Ampelkarte/i.test(ln)) {
          const info = cardPlayerSide(ln); const side = info ? info.side : sideOf(ln);
          if (info) { const k = sn(info.name); (pcards[k] = pcards[k] || { y: 0, r: 0 }).r++; }
          mEvents.push({ min: buildMin, type: 'red', side, row: r });
          rowCards.push({ name: info ? info.name : '', side, type: 'red', grob });
        }
      });

      if (/Neuer Spielstand/.test(rowText)) r.classList.add('os-scoreline');

      // Tor-Aktion erkennen: TOOOR aus der normalen Zeile lösen und als eigenen Schritt anlegen
      let tooorRow = null;
      if (/TOOOR/.test(rowText)) {
        let goalTeam = null;
        for (let k = idx + 1; k < reportRows.length && k <= idx + 4; k++) {
          const m2 = txt(reportRows[k]).match(/Neuer Spielstand:\s*(\d+):(\d+)/);
          if (m2) { goalTeam = (+m2[1] > score.h) ? home : away; break; }
        }
        const cell = [...r.children].find(c => /TOOOR/.test(c.textContent));
        if (cell) cell.innerHTML = cell.innerHTML.replace(/(?:,[^,]*)?TOOOR!.*$/, '');
        tooorRow = document.createElement('tr');
        tooorRow.className = 'os-tooorrow'; tooorRow.style.display = 'none';
        const td = document.createElement('td'); td.colSpan = 20;
        td.innerHTML = `<span class="os-tooor">TOOOR${goalTeam ? ' für ' + goalTeam : ''} ${GOAL_ICON}</span>`;
        tooorRow.appendChild(td);
        r.after(tooorRow);
      }

      // Torschuss von der Auflösung trennen (Spannungspause vor Keeper-Reaktion / Tor)
      const SHOT_PHRASE_RE = /schiesst|schießt|köpft|Kopfball|schu[sß]|Hammer|Schlenzer|Volley|zieht ab|Direktabnahme|Fallrückzieher|Distanzschuss|Flachschuss|Aufsetzer|feuert|Freistoß|zirkelt|hält voll drauf|Abschluss|Flatterball|Effet|drischt|hämmert|nimmt Maß/i;
      const RESULT_RE = /neben das Tor|über das Tor|am Tor vorbei|\bvorbei\b|daneben|drüber|verzieht|an den Pfosten|an die Latte|\bPfosten\b|\bLatte\b|Torwart|Keeper|Schlussmann|Goalie|Torhüter|pariert|faustet|lenkt|machtlos|festhalten|hält|sicher|Fingerspitzen|Glanzparade|pflückt|fängt|packt|begräbt|entschärft|dicht|Toraus|Eckball|abgewehrt|abwehr|dreht den Ball|um den Pfosten|angewurzelt|kommt heraus/i;
      const bkRes = x => RESULT_RE.test(x) || /\bTO+R\b/.test(x);
      const bkIsPass = p => /passt|spielt (den Ball|einen|mit einem)|Kurzpass|langen Ball|langem Pass|flankt|kombiniert|legt .{0,10}ab|schiebt den Ball|reicht den Ball|verlagert|bedient|schlägt .{0,14}auf|eröffnet|schickt .{0,14}auf/i.test(p);
      let outcomeRow = null, midRow = null;
      {
        const tc = [...r.children].find(c => (c.textContent || '').trim().length > 15);
        if (tc) {
          let parts = tc.innerHTML.split(/<br\s*\/?>/i);
          let bkFirstShot = -1;
          // Torszenen-Varianten auf Basis des ORIGINAL-Texts einsetzen
          try {
          const origCell = origRowCells[idx] || '';
          if (origCell) {
            const origLines = origCell.split(/<br\s*\/?>/i);
            const bkDrop = [];
            let pendingPen = null, pendingFK = null;
            for (let j = 0; j < parts.length; j++) {
              const op = (origLines[j] || '').replace(/<[^>]+>/g, '').trim();
              const plainJ = (parts[j] || '').replace(/<[^>]+>/g, '').trim();
              if (/Beinschuss/i.test(op)) continue;
              if (/ELFMETER/i.test(op) || /ELFMETER/i.test(plainJ)) {
                const eb = /ELFMETER/i.test(op) ? op : plainJ;
                let fouled = /wird von/i.test(eb) ? (findNamesInLine(eb)[0] || {}).nm : (findNamesInLine(eb).slice(-1)[0] || {}).nm;
                const contro = /Schwalbe/i.test(eb) ? 2 : /fällt im Strafraum|rutscht.{0,20}aus/i.test(eb) ? 1 : 0;
                let psd = 'h'; try { psd = (fouled && teamOf(fouled)) || fieldTeamOf(eb) || 'h'; } catch (e) { }
                parts[j] = penDecision(eb, fouled, psd, contro);
                pendingPen = { side: psd };
                continue;
              }
              if (/FREISTO(ß|SS)[!.\s]*$/i.test(op) || /FREISTO(ß|SS)[!.\s]*$/i.test(plainJ)) {
                const fb = /FREISTO(ß|SS)/i.test(op) ? op : plainJ;
                let fouled = /wird von/i.test(fb) ? (findNamesInLine(fb)[0] || {}).nm : (findNamesInLine(fb).slice(-1)[0] || {}).nm;
                let fsd = 'h'; try { fsd = (fouled && teamOf(fouled)) || fieldTeamOf(fb) || 'h'; } catch (e) { }
                parts[j] = (parts[j] || '').replace(/(FREISTO(?:ß|SS)!?)/i, '<b>$1</b>');
                pendingFK = { side: fsd };
                continue;
              }
              if (/ABSEITS/i.test(op) || /ABSEITS/i.test(plainJ)) {
                const ab = /ABSEITS/i.test(op) ? op : plainJ;
                let pl = (findNamesInLine(ab).slice(-1)[0] || {}).nm;
                if (!pl && j > 0) pl = (findNamesInLine(((origLines[j - 1] || '') + ' ' + (parts[j - 1] || '')).replace(/<[^>]+>/g, '')).slice(-1)[0] || {}).nm;
                let sd = 'h'; try { sd = (pl && teamOf(pl)) || fieldTeamOf(ab) || 'h'; } catch (e) { }
                parts[j] = offsideScene(pl, sd);
                continue;
              }
              if (pendingPen && (/schie(ß|ss)t|\bSchuss\b|zieht ab|zirkelt|hämmert|Torseite|aufs Tor|vom Punkt|verwandelt|Richtung.{0,25}(Tor|Eck)/i.test(op) || /schie(ß|ss)t|\bSchuss\b|zieht ab|zirkelt|hämmert|Torseite|aufs Tor|vom Punkt|verwandelt|Richtung.{0,25}(Tor|Eck)/i.test(plainJ))) {
                const pb = /schie(ß|ss)t|\bSchuss\b|Torseite|Richtung/i.test(op) ? op : plainJ;
                const shooter = (findNamesInLine(pb)[0] || {}).nm;
                let psd = pendingPen.side || 'h'; try { psd = (shooter && teamOf(shooter)) || pendingPen.side || 'h'; } catch (e) { }
                parts[j] = penExecution(shooter, psd, pb);
                bkFirstShot = j; pendingPen = null;
                continue;
              }
              if (/Freisto(ß|ss):/i.test(plainJ) || /Freisto(ß|ss):/i.test(op)) {
                const fkBase = /Freisto(ß|ss):/i.test(plainJ) ? plainJ : op;
                const sh2 = (findNamesInLine(fkBase).slice(-1)[0] || {}).nm;
                let fsd = pendingFK ? pendingFK.side : 'h'; try { fsd = (sh2 && teamOf(sh2)) || (pendingFK && pendingFK.side) || 'h'; } catch (e) { }
                const resOp = ((origLines[j + 1] || '') + ' ' + (parts[j + 1] || '')).replace(/<[^>]+>/g, '');
                const scanTxt = (r.textContent || '') + ' ' + ((r.nextElementSibling && r.nextElementSibling.textContent) || '') + ' ' + ((r.nextElementSibling && r.nextElementSibling.nextElementSibling && r.nextElementSibling.nextElementSibling.textContent) || '');
                const scM = scanTxt.match(/Neuer Spielstand:\s*\d+:\d+\s*\(([^)]+)\)/);
                const rowGoal = !!(scM && sh2 && scM[1].indexOf(sh2) >= 0);
                parts[j] = directFK(fkBase, resOp, fsd, rowGoal);
                if (!/Neuer Spielstand/i.test(resOp)) bkDrop.push(j + 1);
                bkFirstShot = j; pendingFK = null; continue;
              }
              if (pendingFK && (/\bflankt\b/i.test(plainJ) || /\bflankt\b/i.test(op))) {
                const flBase = /\bflankt\b/i.test(plainJ) ? plainJ : op;
                const resOp = ((origLines[j + 1] || '') + ' ' + (parts[j + 1] || '')).replace(/<[^>]+>/g, '');
                const rowGoal = /Neuer Spielstand/i.test(parts.join(' ') + origLines.join(' '));
                parts[j] = setPlay(flBase, resOp, pendingFK.side, false, rowGoal);
                if (!/Neuer Spielstand/i.test(resOp)) bkDrop.push(j + 1);
                bkFirstShot = j; pendingFK = null; continue;
              }
              if (/Ecke:/i.test(plainJ) || /Ecke:/i.test(op)) {
                const ecBase = /Ecke:/i.test(plainJ) ? plainJ : op;
                const dv = (findNamesInLine(ecBase).slice(-1)[0] || {}).nm;
                let csd = 'h'; try { csd = (dv && teamOf(dv)) || fieldTeamOf(ecBase) || 'h'; } catch (e) { }
                const resOp = ((origLines[j + 1] || '') + ' ' + (parts[j + 1] || '')).replace(/<[^>]+>/g, '');
                const rowGoalE = /Neuer Spielstand/i.test(parts.join(' ') + origLines.join(' '));
                parts[j] = setPlay(ecBase, resOp, csd, true, rowGoalE);
                if (!/Neuer Spielstand/i.test(resOp)) bkDrop.push(j + 1);
                bkFirstShot = j; continue;
              }
              if (!/schiesst|schießt|\bSchuss\b|Schlenzer|Flatterball|zieht ab|köpft|Kopfball|Aufsetzer|Harter Schuss|Strammer|feuert|Effet|Volley|Direktabnahme|Ein Schuss von/i.test(op)) continue;
              const kind = /köpft|Kopfball/i.test(op) ? 'kopf' : 'schuss';
              const siO = op.search(/\s[–-]\s/);
              let resPart = '', nextUsed = false;
              if (siO >= 0) resPart = op.slice(siO).replace(/^\s*[–-]\s*/, '');
              else if (origLines[j + 1]) { resPart = origLines[j + 1].replace(/<[^>]+>/g, ''); nextUsed = true; }
              const bkType = bkDetectType(resPart);
              if (!bkType) continue;
              const shooter = (findNamesInLine(op).find(n => surname(n.nm) !== homeGK && surname(n.nm) !== awayGK) || {}).nm;
              if (!shooter) continue;
              const keeperName = (teamOf(shooter) === 'h' ? (awayMap['T'] || 'der Keeper') : (homeMap['T'] || 'der Keeper'));
              const shSide = teamOf(shooter) || fieldTeamOf(op) || 'h';
              const soloBefore = /Dribbling|stehen lassen|Körpertäuschung|Übersteiger|umkurvt|\bSolo\b|tankt sich|Schuljungen|vorbei an|setzt sich durch|Alleingang/i.test(((origLines[j - 1] || '') + ' ' + (parts[j - 1] || '')).replace(/<[^>]+>/g, ''));
              const asm = bkAssemble(kind, bkType, shooter, keeperName, shSide, soloBefore);
              if (asm) { parts[j] = asm; if (bkFirstShot < 0) bkFirstShot = j; if (nextUsed) bkDrop.push(j + 1); }
            }
            if (bkDrop.length) parts = parts.filter((_, k) => bkDrop.indexOf(k) < 0);
          }
          } catch (e) { if (window.console) console.warn('[OS] Baukasten:', e); }
          try {
          let shotIdx = bkFirstShot >= 0 ? bkFirstShot : parts.findIndex(p => { const plain = p.replace(/<[^>]+>/g, ''); const si = plain.search(/\s[–-]\s/); return SHOT_PHRASE_RE.test(plain) || (si >= 0 && bkRes(plain.slice(si)) && !bkIsPass(plain)) || (si >= 0 && /\s[–-]\s/.test(plain.slice(si + 3))); });
          // Inline-Trennung: "… Torschuss … - Ergebnis" am Bindestrich splitten
          if (shotIdx >= 0) {
            const line = parts[shotIdx]; const si = line.search(/\s[–-]\s/);
            if (si >= 0 && (shotIdx === bkFirstShot || bkRes(line.slice(si).replace(/<[^>]+>/g, '')) || /\s[–-]\s/.test(line.slice(si + 3).replace(/<[^>]+>/g, '')))) {
              const shotHtml = line.slice(0, si) + ' –';
              const resultHtml = line.slice(si).replace(/^\s*[–-]\s*/, '');
              parts.splice(shotIdx, 1, shotHtml, resultHtml);
            }
          }
          tc.innerHTML = parts.join('<br>');
          if (shotIdx >= 0 && shotIdx < parts.length - 1) {
            const afterFull = parts.slice(shotIdx + 1);
            const after = afterFull.join('<br>').trim();
            if (after) {
              tc.innerHTML = parts.slice(0, shotIdx + 1).join('<br>');
              const first = afterFull[0] || '';
              const fp = first.search(/\s[–-]\s/);
              let midHtml = '', resHtml = after;
              if (fp >= 0 && bkRes(first.slice(fp).replace(/<[^>]+>/g, ''))) {
                midHtml = first.slice(0, fp) + ' –';
                const restFirst = first.slice(fp).replace(/^\s*[–-]\s*/, '');
                resHtml = [restFirst].concat(afterFull.slice(1)).join('<br>').trim();
              }
              if (midHtml) {
                midRow = document.createElement('tr'); midRow.className = 'os-outcome'; midRow.style.display = 'none';
                const m0 = document.createElement('td'); const m1 = document.createElement('td'); m1.colSpan = 20; m1.innerHTML = midHtml;
                midRow.appendChild(m0); midRow.appendChild(m1); r.after(midRow);
              }
              outcomeRow = document.createElement('tr'); outcomeRow.className = 'os-outcome'; outcomeRow.style.display = 'none';
              const oc0 = document.createElement('td'); const oc1 = document.createElement('td'); oc1.colSpan = 20; oc1.innerHTML = resHtml;
              outcomeRow.appendChild(oc0); outcomeRow.appendChild(oc1);
              (midRow || r).after(outcomeRow);
              if (tooorRow) outcomeRow.after(tooorRow); // Reihenfolge: Anlauf → Abschluss → Auflösung → TOOOR
            }
          }
          } catch (eSp) { if (window.console) console.warn('[OS] Split:', eSp); }
        }
      }

      // Spielzeilen-Job (bei Tor-/Schuss-Aktion längere Pause danach)
      const scoreM = rowText.match(/Neuer Spielstand:\s*(\d+):(\d+)/);
      const shotAttempt = !outcomeRow && !tooorRow && !scoreM
        && /schiesst|zieht ab|Kopfball|Distanzschuss|Volley|Schlenzer|Fallrückzieher|Direktabnahme|zieht einfach ab|aufs (?:lange|kurze|rechte|linke|erste|zweite) Eck|Richtung Tor|aufs Tor|Abschluss/i.test(rowText)
        && !/vorbei|daneben|drüber|pariert|hält|lenkt|klärt|abgewehrt|geblockt|Latte|Pfosten|verzieht/i.test(rowText);
      const gmFull = rowText.match(/Neuer Spielstand:\s*(\d+):(\d+)\s*\(([^,)]+)/);
      const goalInfo = gmFull ? { home: (+gmFull[1]) > score.h, scorer: gmFull[3].trim(), min: buildMin } : null;
      const rowJob = {
        label: () => 'Minute ' + (min != null ? min : curMin), delay: midRow ? 1400 : (outcomeRow ? 2000 : (tooorRow ? 1600 : (shotAttempt ? 1700 : 900))),
        run: () => {
          if (min != null) { curMin = min; setMinBoard(min); }
          if (scoreM) setScoreBoard(scoreM[1], scoreM[2], !seeking);
          if (goalInfo) addGoalToBoard(goalInfo);
          clearCur();
          const revealRow = () => { r.style.display = ''; r.classList.add('os-live-current'); if (shotAttempt || outcomeRow) r.classList.add('os-shot'); if (r._markers) r._markers.forEach(mk => mk.style.opacity = '1'); scrollTo(r); };
          if (r._conf && r._conf.length) {
            r._conf.forEach(cr => {
              cr.style.display = '';
              const l2 = cr.querySelector('.os-conf-l2');
              if (l2) { l2.style.visibility = 'hidden'; setTimeout(() => { l2.style.visibility = ''; }, 1100 / speed); }
            });
            scrollTo(r._conf[0]);
            setTimeout(revealRow, 2300 / speed);
          }
          else revealRow();
        }
      };
      jobs.push(rowJob); r._job = rowJob;
      // Abschluss (Zwischen-Etappe) mit laengerer Pause vor dem Ergebnis
      if (midRow) {
        jobs.push({ label: 'Abschluss', delay: 2800, run: () => { clearCur(); midRow.style.display = ''; scrollTo(midRow); } });
      }
      // Auflösung (Keeper/Abwehr) als eigener Schritt
      if (outcomeRow) {
        jobs.push({ label: 'Auflösung', delay: tooorRow ? 2000 : 900, run: () => { clearCur(); outcomeRow.style.display = ''; scrollTo(outcomeRow); } });
      }
      // TOOOR als eigener Schritt nach der Pause
      if (tooorRow) {
        jobs.push({ label: 'Tor!', delay: 900, run: () => { clearCur(); tooorRow.style.display = ''; scrollTo(tooorRow); } });
      }

      const minute = buildMin;
      let anchor = tooorRow || outcomeRow || r;
      const addComment = (html, cls, label, delay) => {
        const tr = makeCommentRow(html, cls);
        anchor.after(tr); anchor = tr;
        jobs.push({ label: label || 'Kommentar', delay: delay || 3200, run: () => { clearCur(); tr.style.display = ''; scrollTo(tr); } });
        return tr;
      };
      const addAtmoRow = (html, side) => {
        if (!html) return;
        const col = (side === 'a') ? bkTeamColor('a') : bkTeamColor('h');
        const loud = loudness(buildMin, score.h, score.a);
        const tr = document.createElement('tr'); tr.className = 'os-atmorow'; tr.style.display = 'none';
        const td = document.createElement('td'); td.colSpan = 20;
        td.innerHTML = '<div class="os-atmobox' + (loud >= 2 ? ' os-atmo-loud' : '') + '" style="--ac:' + col + ';border-left-color:' + col + '">' + (loud >= 3 ? '🔊 ' : '') + html + '</div>';
        tr.appendChild(td);
        anchor.after(tr); anchor = tr;
        jobs.push({ label: 'Atmosphäre', delay: 1500, run: () => { clearCur(); tr.style.display = ''; scrollTo(tr); } });
        eventBoxRows.push(tr);
      };
      const addEventBox = (html, label) => {
        const tr = document.createElement('tr'); tr.className = 'os-eventrow'; tr.style.display = 'none';
        const td = document.createElement('td'); td.colSpan = 20; td.innerHTML = html; tr.appendChild(td);
        anchor.after(tr); anchor = tr;
        jobs.push({ label: label || 'Ereignis', delay: 3000, run: () => { clearCur(); tr.style.display = ''; scrollTo(tr); } });
        eventBoxRows.push(tr);
        return tr;
      };
      rowCards.forEach(c => { addAtmoRow(atmoLine(atmoCardKey(c.side, c.type, c.grob)), 'h'); addEventBox(cardBox(buildMin, c.side, c.type, c.name), c.type === 'red' ? 'Rote Karte' : (c.type === 'yellowred' ? 'Gelb-Rote Karte' : 'Gelbe Karte')); });

      // Tor
      const gm = rowText.match(/Neuer Spielstand:\s*(\d+):(\d+)\s*\(([^,)]+)(?:,\s*([^)]+))?\)/);
      if (gm) {
        const nh = +gm[1], na = +gm[2], scorer = gm[3].trim(), assist = gm[4] ? gm[4].trim() : '', scoredHome = nh > score.h;
        if (scoredHome) { game.goalsH++; iv.goalsH++; } else { game.goalsA++; iv.goalsA++; }
        mEvents.push({ min: minute, type: 'goal', side: scoredHome ? 'h' : 'a', row: r });
        danger[minute] = (danger[minute] || 0) + (scoredHome ? 4 : -4);
        const gTeam = scoredHome ? home : away, gTeamId = scoredHome ? homeId : awayId;
        const gtype = (lastShot && Math.abs(lastShot.min - minute) <= 1) ? goalTypeOf(lastShot.text) : '';
        const cmt = goalComment(scoredHome, score.h, score.a, nh, na, scorer, minute, assist, origRowCells[idx] || r.innerHTML).replace(/^⚽ <b>TOR!<\/b>\s*/, '');
        const scorerBlock = `<div class="os-gb-person"><div class="os-gb-photo os-gb-ph"></div><div class="os-gb-pinfo"><div class="os-gb-name">${boldSurname(scorer)}</div><div class="os-gb-pos os-gb-pos-s"></div><div class="os-gb-role">Torschütze</div><div class="os-gb-so os-gb-so-s"></div></div></div>`;
        const assistBlock = assist ? `<div class="os-gb-person os-gb-assist"><div class="os-gb-photo os-gb-aph"></div><div class="os-gb-pinfo"><div class="os-gb-name">${boldSurname(assist)}</div><div class="os-gb-pos os-gb-pos-a"></div><div class="os-gb-role">Assist</div><div class="os-gb-so os-gb-so-a"></div></div></div>` : '';
        const boxHtml = `<div class="os-goalbox"><div class="os-gb-head"><span class="os-gb-min">${minute}'</span><span class="os-gb-title">TOR FÜR ${(gTeam || '').toUpperCase()}</span><span class="os-gb-ball">⚽</span></div>`
          + `<div class="os-gb-main">${scorerBlock}${assistBlock}<div class="os-gb-score">${nh}:${na}</div></div>`
          + `<div class="os-gb-comment">${cmt}</div></div>`;
        const gtr = document.createElement('tr'); gtr.className = 'os-goalrow'; gtr.style.display = 'none';
        const gtd = document.createElement('td'); gtd.colSpan = 20; gtd.innerHTML = boxHtml; gtr.appendChild(gtd);
        if (scoredHome && scorer && ATMO_FAN.torschuetze && ATMO_FAN.torschuetze.length && Math.random() < 0.45) addAtmoRow(fanAtmo('torschuetze', { s: scorer, sSide: 'h' }), 'h');
        else addAtmoRow(atmoLine(atmoGoalKey(scoredHome, nh, na, minute)), scoredHome ? 'h' : 'a');
        anchor.after(gtr); anchor = gtr;
        jobs.push({ label: 'Tor!', delay: 3800, run: () => { clearCur(); gtr.style.display = ''; scrollTo(gtr); } });
        goalComments.push({ tr: gtr, scorer: scorer, assist: assist, home: scoredHome });
        score.h = nh; score.a = na;
        if (score.h < score.a) wasBehind.h = true; else if (score.a < score.h) wasBehind.a = true;
        try { const spec = /Distanz|Fallr\u00fcckzieher|Seitfallzieher|\bSolo\b|Traumtor|Freisto\u00df|Volley|zweite Reihe|Kunstschuss|umkurvt|schlenzt|zirkelt/i.test(origRowCells[idx] || ''); game.keyMoments.push({ type: 'goal', min: minute, side: scoredHome ? 'h' : 'a', scorer: scorer, prio: 60 + (spec ? 18 : 0), text: (spec ? 'der sehenswerte Treffer' : 'der Treffer') + ' zum ' + nh + ':' + na + ' durch <b>' + scorer + '</b>' }); } catch (e) { }
        try { const pg = (pgoals[scorer] = (pgoals[scorer] || 0) + 1); if (pg >= 3 && ATMO_FAN.torschuetzeGott && ATMO_FAN.torschuetzeGott.length) addAtmoRow(fanAtmo('torschuetzeGott', { s: scorer, sSide: scoredHome ? 'h' : 'a' }), scoredHome ? 'h' : 'a'); } catch (e) { }
      }
      // Spielweise / Einsatz
      const sc = rowText.match(/(Heimteam|Auswärtsteam) ändert (Spielweise|Einsatz) auf (.+?)(?:\s{2,}|$)/);
      if (sc) addComment(styleComment(sc[1], sc[2], sc[3].trim()), '', 'Taktik', 3200);
      // Wechsel
      rowLinesOf(r).forEach(ln => {
        let m = ln.match(/(Heimteam|Auswärtsteam) wechselt:\s*(.+?) kommt für (.+?)$/);
        if (m) { const side = m[1] === 'Heimteam' ? 'h' : 'a'; addComment(subComment(m[1], m[2].trim(), m[3].trim()), '', 'Wechsel', 3200); subInfo.push({ in: m[2].trim(), out: m[3].trim(), min: buildMin, side }); mEvents.push({ min: buildMin, type: 'sub', side, row: r }); addEventBox(subBox(buildMin, side, m[2].trim(), m[3].trim(), false), 'Wechsel'); return; }
        m = ln.match(/(.+?) muss.*?ausgewechselt.*?(?:Für ihn|Für sie) kommt (.+?)$/i);
        if (m) { const out = m[1].trim(), inn = m[2].trim(); const side = teamOf(out) || sideOf(ln); addComment(subComment(side === 'h' ? 'Heimteam' : 'Auswärtsteam', inn, out), '', 'Wechsel', 3200); subInfo.push({ in: inn, out, min: buildMin, side }); mEvents.push({ min: buildMin, type: 'sub', side, row: r }); addEventBox(subBox(buildMin, side, inn, out, true), 'Verletzung'); }
      });
      // Halbzeit
      if (/Halbzeit/.test(rowText)) { hzCommentTr = addComment(halftimeComment(score.h, score.a, game, wasBehind), 'hz', 'Halbzeitanalyse', 6500); iv = mkAcc(); }
      // Abpfiff
      if (/Abpfiff/.test(rowText)) finalCommentTr = addComment(finalComment(score.h, score.a, game, wasBehind), 'fin', 'Schlussanalyse', 6500);
      // ==== Schluesselmomente (Rote Karte / Verletzung) ====
      try {
        if (/Rote Karte|Gelb-Rote|glatt Rot|sieht (?:die )?Rot|Platzverweis/i.test(rowText)) { const nm = (findNamesInLine(rowText)[0] || {}).nm; game.keyMoments.push({ type: 'red', min: buildMin, prio: 82, text: 'die Rote Karte' + (nm ? ' gegen <b>' + nm + '</b>' : '') }); }
        if (/verletz|Verletzung|bleibt liegen|muss (?:vom Platz|behandelt|raus)|kann nicht weiter|wird vom Feld getragen|humpelt/i.test(rowText)) { const nm = (findNamesInLine(rowText)[0] || {}).nm; game.keyMoments.push({ type: 'injury', min: buildMin, prio: 70, text: 'die Verletzung' + (nm ? ' von <b>' + nm + '</b>' : '') }); }
      } catch (e) { }
      // ==== Fan-Atmosphäre (Situations-Trigger) ====
      try {
        if (!atmoBeginnShown && /Anpfiff/.test(rowText)) { addAtmoRow(fanAtmo('beginn'), 'h'); atmoBeginnShown = true; }
        if (!atmoFansGone && score.a - score.h >= 4 && buildMin >= 80) { addAtmoRow(fanAtmo('fansGehen'), 'h'); atmoFansGone = true; }
        rowLinesOf(r).forEach(ln => {
          if (KEEPER_SAVE.test(ln)) {
            const side = (homeGK && ln.indexOf(homeGK) >= 0) ? 'h' : ((awayGK && ln.indexOf(awayGK) >= 0) ? 'a' : null);
            if (side) { atmoSaves[side]++; if (atmoSaves[side] >= 3 && atmoSaves[side] - atmoLastTW[side] >= 3) { const twName = side === 'h' ? (homeMap['T'] || 'der Keeper') : (awayMap['T'] || 'der Keeper'); addAtmoRow(fanAtmo('torwart', { tw: twName, twSide: side }), side); atmoLastTW[side] = atmoSaves[side]; } }
          }
        });
        if (/an den Pfosten|an die Latte|\bAluminium\b|Lattenkreuz|ans Aluminium|Glanzparade|gl(ä|ae)nzend pariert|Riesenchance|Riesenm(ö|oe)glichkeit|kl(ä|ae)glich vergeben/i.test(rowText)) addAtmoRow(atmoLine('raunen'), 'h');
        if (buildMin >= 75 && Math.abs(score.h - score.a) <= 1 && buildMin - atmoLastAnpeitsch >= 4 && /schiesst|schießt|köpft|Torschuss|Eckball|Ecke:|Flatterball|Schlenzer|Harter Schuss|Ein Schuss von/i.test(rowText)) { addAtmoRow(fanAtmo('anpeitschen'), 'h'); atmoLastAnpeitsch = buildMin; }
        if (!atmoEndShown && /Abpfiff/.test(rowText)) { const key = score.h > score.a ? 'endeHeimsieg' : (score.h < score.a ? 'endeGastsieg' : 'endeRemis'); addAtmoRow(fanAtmo(key), fanSide(key)); if (score.h - score.a >= 3) addAtmoRow(fanAtmo('trainer'), 'h'); atmoEndShown = true; }
      } catch (e) { }
      // 15-Minuten-Takt (Auswertung der zurückliegenden Phase)
      while (markIdx < marks.length && minute >= marks[markIdx]) { addComment(periodicComment(marks[markIdx], iv, score.h, score.a, game, wasBehind), '', 'Kommentar', 3600); markIdx++; iv = mkAcc(); }
      // Allgemeine Sprechchöre ans Minutenende (vor der nächsten Spielminute)
      if (atmoLastAnpeitsch !== minute && buildMin >= 8 && buildMin <= 85 && buildMin - atmoLastChant >= Math.max(7, 20 - loudness(buildMin, score.h, score.a) * 4)) { try { const key = score.h > score.a ? 'heimFuehrt' : (score.h < score.a ? (Math.random() < 0.4 ? 'gast' : 'heimZurueck') : 'heimAllg'); addAtmoRow(fanAtmo(key), fanSide(key)); atmoLastChant = buildMin; } catch (e) { } }
    });

    // ---- Match-Momentum-Band (geschätzt, unter der Anzeigetafel) ----
    // Ballbesitz-Kalibrierung: Gewicht so wählen, dass die Live-Schätzung am Ende den offiziellen Wert trifft
    let possWeight = 1;
    (function calibratePoss() {
      let tH = 0, tA = 0; for (const k in momentum) { tH += momentum[k].h; tA += momentum[k].a; }
      const pv = getV(V, 'Ballbesitz');
      if (pv && /\d/.test(pv[0]) && tH > 0 && tA > 0) { const oH = parseInt(pv[0], 10) / 100; if (oH > 0.02 && oH < 0.98) possWeight = (oH * tA) / ((1 - oH) * tH); }
    })();

    (function buildMomentum() {
      Object.keys(danger).forEach(k => delete danger[k]);
      Object.assign(danger, computeDangerOriginal());
      const mm = Math.max(maxMin, 90);
      const W = 1000, H = 128, base = 57, maxBar = 26, pad = 26;
      const step = (W - 2 * pad) / mm;
      const xOf = m => pad + Math.max(0, Math.min(m, mm)) * step;
      const win = m => danger[m] || 0;
      let maxAbs = 1; for (let m = 1; m <= mm; m++) maxAbs = Math.max(maxAbs, Math.abs(win(m)));
      let bars = ''; const bw = Math.max(2, Math.min(step * 0.72, 9));
      for (let m = 1; m <= mm; m++) {
        const net = win(m); if (!net) continue;
        const hgt = Math.max(1.5, Math.sqrt(Math.abs(net) / maxAbs) * maxBar);
        const x = xOf(m) - bw / 2, y = net > 0 ? base - hgt : base;
        bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${hgt.toFixed(1)}" rx="1.5" fill="${net > 0 ? '#2fbf63' : '#3f7fe0'}"/>`;
      }
      const ticks = [[0, "0'"], [15, "15'"], [30, "30'"], [45, 'HT'], [60, "60'"], [75, "75'"], [mm, 'FT']];
      let axis = `<line x1="${pad}" y1="${base}" x2="${W - pad}" y2="${base}" stroke="rgba(255,255,255,.18)" stroke-width="1"/>`;
      ticks.forEach(([m, lab]) => { if (m > mm) return; const x = xOf(m); axis += `<line x1="${x}" y1="${base - maxBar - 2}" x2="${x}" y2="${base + maxBar + 2}" stroke="rgba(255,255,255,.08)" stroke-width="1"/><text x="${x}" y="${H - 3}" fill="#9fb4e0" font-size="10" text-anchor="middle">${lab}</text>`; });
      const mkShape = (type, x, y) => {
        if (type === 'goal') return `<circle cx="${x}" cy="${y}" r="5.6" fill="#ffffff" stroke="#0a0a0a" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="1.7" fill="#111"/>`;
        if (type === 'yellow') return `<rect x="${x - 3}" y="${y - 5.5}" width="6" height="11" rx="1" fill="#f2c200" stroke="#3a2f00" stroke-width=".6"/>`;
        if (type === 'yellowred') return `<clipPath id="yr${x}_${y}"><rect x="${x - 3}" y="${y - 5.5}" width="6" height="11" rx="1"/></clipPath><g clip-path="url(#yr${x}_${y})"><rect x="${x - 3}" y="${y - 5.5}" width="6" height="11" fill="#f2c200"/><path d="M ${x + 3} ${y - 5.5} L ${x - 3} ${y + 5.5} L ${x + 3} ${y + 5.5} Z" fill="#e0483b"/></g><rect x="${x - 3}" y="${y - 5.5}" width="6" height="11" rx="1" fill="none" stroke="#3a2f00" stroke-width=".6"/>`;
        if (type === 'red') return `<rect x="${x - 3}" y="${y - 5.5}" width="6" height="11" rx="1" fill="#e0483b" stroke="#5a0d06" stroke-width=".6"/>`;
        if (type === 'sub') return `<circle cx="${x}" cy="${y}" r="6.2" fill="#22b358"/><path d="M ${x - 3} ${y - 1.3} h5 l-1.6 -1.8 M ${x + 3} ${y + 1.3} h-5 l1.6 1.8" stroke="#fff" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
        return '';
      };
      let markersSvg = ''; const markerMeta = [], mkStack = {};
      mEvents.forEach((e, i) => {
        const top = e.side !== 'a';
        const key = e.min + (top ? 'h' : 'a');
        const idx = mkStack[key] || 0; mkStack[key] = idx + 1;
        const x = xOf(e.min), y = top ? (27 - idx * 13) : (90 + idx * 13);
        markersSvg += `<g class="os-mk" data-mk="${i}" style="opacity:0">${mkShape(e.type, x, y)}</g>`;
        markerMeta.push({ i, row: e.row });
      });
      const svg = el('div', 'os-momentum',
        `<div class="os-poss"><span class="os-poss-h">50%</span><div class="os-poss-bar"><span class="os-poss-bh" style="width:50%"></span><span class="os-poss-ba" style="width:50%"></span></div><span class="os-poss-a">50%</span></div>` +
        `<div class="os-mom-label">Match-Momentum &amp; Ballbesitz <span>(geschätzt)</span></div>` +
        `<svg viewBox="0 0 ${W} ${H}" class="os-mom-svg">` +
        `<defs><clipPath id="osMClip"><rect id="osMClipRect" x="0" y="0" width="${pad}" height="${H}"/></clipPath></defs>` +
        axis + `<g clip-path="url(#osMClip)">${bars}</g>` + markersSvg + `</svg>`);
      board.appendChild(svg);
      const clipRect = svg.querySelector('#osMClipRect');
      const markEls = [...svg.querySelectorAll('.os-mk')];
      const possBH = svg.querySelector('.os-poss-bh'), possBA = svg.querySelector('.os-poss-ba'), possHL = svg.querySelector('.os-poss-h'), possAL = svg.querySelector('.os-poss-a');
      // Marker an ihre Ereigniszeile hängen -> erscheinen erst, wenn die Zeile aufgedeckt wird
      markerMeta.forEach(md => { if (md.row) { (md.row._markers = md.row._markers || []).push(markEls[md.i]); } });
      hideMarkers = () => markEls.forEach(el2 => el2.style.opacity = '0');
      momentumTo = m => {
        const c = (typeof m === 'number') ? m : 0;
        const rev = Math.max(0, c - 1);   // Balken erst zeigen, wenn die Minute im Text abgeschlossen ist
        if (clipRect) clipRect.setAttribute('width', String(xOf(rev)));
        let ch = 0, ca = 0; for (let k = 1; k <= rev; k++) { const d = momentum[k]; if (d) { ch += d.h * possWeight; ca += d.a; } }
        const tot = ch + ca, hp = tot ? Math.round(ch / tot * 100) : 50;
        if (possBH) { possBH.style.width = hp + '%'; possBA.style.width = (100 - hp) + '%'; possHL.textContent = hp + '%'; possAL.textContent = (100 - hp) + '%'; }
      };
      momentumTo(0);
    })();
    buildPlayerStats(null, null);

    // ---- Statistik-Grafik (Halbzeit & Ende) ----
    (function buildStats() {
      const possAt = until => { let ch = 0, ca = 0; for (let k = 1; k <= until; k++) { const d = momentum[k]; if (d) { ch += d.h * possWeight; ca += d.a; } } const t = ch + ca; return t ? Math.round(ch / t * 100) : 50; };
      const intOf = s => { const n = parseInt(String(s).replace('%', ''), 10); return isNaN(n) ? 0 : n; };
      const numOf = s => { const n = parseFloat(String(s).replace('%', '').replace(',', '.')); return isNaN(n) ? 0 : n; };
      // Spieler-Statistik summieren (Zweikämpfe, gewonnene ZK-%, Schüsse, aufs Tor) – Heim links, Gast rechts (gespiegelt)
      const parsePlayerStats = () => {
        if (!tblPlayer) return null;
        const rows = [...tblPlayer.querySelectorAll('tr')];
        if (rows.length < 2) return null;
        const head = [...rows[0].children].map(c => (c.textContent || '').trim());
        const norm2 = t => t.toLowerCase().replace(/[\s.]/g, '');
        const idxs = pred => head.map((t, i) => pred(norm2(t)) ? i : -1).filter(i => i >= 0);
        const zk = idxs(t => t === 'zk'), zkp = idxs(t => /zk/.test(t) && /%/.test(t)), sh = idxs(t => t === 'schüsse' || t === 'schuesse'), ot = idxs(t => /aufstor/.test(t));
        const data = rows.slice(1).filter(r => r.children.length >= head.length && /\d/.test(r.textContent) && !/summe|gesamt|schnitt|durchschnitt|Ø/i.test(r.textContent));
        const res = { hZK: 0, aZK: 0, hZKwon: 0, aZKwon: 0, hSh: 0, aSh: 0, hOt: 0, aOt: 0, ok: false };
        const cell = (r, i) => (i >= 0 && r.children[i]) ? numOf(r.children[i].textContent) : 0;
        data.forEach(r => {
          if (zk.length >= 2) {
            const zh = cell(r, zk[0]), za = cell(r, zk[1]); res.hZK += zh; res.aZK += za;
            if (zkp.length >= 2) { res.hZKwon += zh * cell(r, zkp[0]) / 100; res.aZKwon += za * cell(r, zkp[1]) / 100; }
          }
          if (sh.length >= 2) { res.hSh += cell(r, sh[0]); res.aSh += cell(r, sh[1]); }
          if (ot.length >= 2) { res.hOt += cell(r, ot[0]); res.aOt += cell(r, ot[1]); }
        });
        res.ok = (res.hZK + res.aZK) > 0 || (res.hSh + res.aSh) > 0;
        return res.ok ? res : null;
      };
      const pstat = parsePlayerStats();
      const computeStats = (until, official) => {
        const src = until <= 45 ? rsHT : rs;
        const g = k => src.h[k] || 0, a = k => src.a[k] || 0;
        const hpos = possAt(until);
        let poss = [hpos, 100 - hpos], ab = [g('ab'), a('ab')], ecken = [g('co'), a('co')], fouls = null;
        if (official) {
          const pv = getV(V, 'Ballbesitz'), av = getV(V, 'Abseits'), ev = getV(V, 'Eckenverhältnis'), fv = getV(V, 'Fouls');
          if (pv && /\d/.test(pv[0])) poss = [intOf(pv[0]), intOf(pv[1])];
          if (av && /\d/.test(av[0])) ab = [intOf(av[0]), intOf(av[1])];
          if (ev && /\d/.test(ev[0])) ecken = [intOf(ev[0]), intOf(ev[1])];
          if (fv && /\d/.test(fv[0])) fouls = [intOf(fv[0]), intOf(fv[1])];
        }
        let shH = g('sh'), shA = a('sh'), otH = g('ot'), otA = a('ot');
        if (official && pstat && (pstat.hSh + pstat.aSh) > 0) { shH = Math.round(pstat.hSh); shA = Math.round(pstat.aSh); otH = Math.round(pstat.hOt); otA = Math.round(pstat.aOt); }
        const groups = [
          { title: 'TORAKTIONEN', rows: [['Schüsse', shH, shA], ['Schüsse aufs Tor', otH, otA], ['Pfosten/Latte', g('pl'), a('pl')]] },
          { title: 'BALLAKTIONEN', rows: [['Ballbesitz', poss[0], poss[1], true], ['Flanken', g('fl'), a('fl')], ['Dribblings', g('dr'), a('dr')]] }
        ];
        const zkRows = [];
        if (official && pstat && (pstat.hZK + pstat.aZK) > 0) {
          zkRows.push(['Zweikämpfe', Math.round(pstat.hZK), Math.round(pstat.aZK)]);
          zkRows.push(['gewonnene Zweikämpfe', pstat.hZK ? Math.round(pstat.hZKwon / pstat.hZK * 100) : 0, pstat.aZK ? Math.round(pstat.aZKwon / pstat.aZK * 100) : 0, true]);
        }
        if (fouls) { zkRows.push(['Foul gespielt', fouls[0], fouls[1]]); zkRows.push(['Gefoult worden', fouls[1], fouls[0]]); }
        if (zkRows.length) groups.push({ title: 'ZWEIKAMPFWERTE', rows: zkRows });
        const stdRows = [['Abseits', ab[0], ab[1]], ['Ecken', ecken[0], ecken[1]], ['Freistöße', g('fk'), a('fk')]];
        if (official) { const elf = getV(V, 'Elfmeter'); if (elf && /\d/.test(elf[0])) stdRows.push(['Elfmeter', intOf(elf[0]), intOf(elf[1])]); }
        groups.push({ title: 'STANDARDS', rows: stdRows });
        (() => {
          const cc = { h: { y: 0, yr: 0, r: 0 }, a: { y: 0, yr: 0, r: 0 } };
          mEvents.forEach(e => { const s = e.side === 'h' ? 'h' : (e.side === 'a' ? 'a' : null); if (!s) return; if (e.type === 'yellow') cc[s].y++; else if (e.type === 'yellowred') cc[s].yr++; else if (e.type === 'red') cc[s].r++; });
          const gy = cc.h.y - cc.h.yr, ay = cc.a.y - cc.a.yr;
          const total = cc.h.y + cc.a.y + cc.h.yr + cc.a.yr + cc.h.r + cc.a.r;
          if (total > 0) {
            const cr = [['Gelbe Karten', Math.max(0, gy), Math.max(0, ay)]];
            if (cc.h.yr + cc.a.yr > 0) cr.push(['Gelb-Rote Karten', cc.h.yr, cc.a.yr]);
            if (cc.h.r + cc.a.r > 0) cr.push(['Rote Karten', cc.h.r, cc.a.r]);
            groups.push({ title: 'KARTEN', rows: cr });
          }
        })();
        if (official) {
          const scaleMap = { 'sehr hoch': 5, 'hoch': 4, 'gut': 4, 'normal': 3, 'mittel': 3, 'befriedigend': 3, 'niedrig': 2, 'gering': 2, 'schlecht': 2, 'sehr niedrig': 1, 'sehr gering': 1, 'miserabel': 1 };
          const scaleOf = s => scaleMap[(s || '').toLowerCase().trim()] || 3;
          const sk = getV(V, 'Schnitt Skill'), opt = getV(V, 'Opt.Skill'), fit = getV(V, 'Fitness'), mor = getV(V, 'Moral');
          const teamRows = [];
          if (sk && /\d/.test(sk[0])) teamRows.push(['Schnitt Skill', numOf(sk[0]), numOf(sk[1]), { text: [sk[0], sk[1]] }]);
          if (opt && /\d/.test(opt[0])) teamRows.push(['Schnitt Opt.Skill', numOf(opt[0]), numOf(opt[1]), { text: [opt[0], opt[1]] }]);
          if (fit && fit[0] && !/^\s*$/.test(fit[0])) teamRows.push(['Fitness', scaleOf(fit[0]), scaleOf(fit[1]), { max: 5, text: [fit[0], fit[1]] }]);
          if (mor && mor[0] && !/^\s*$/.test(mor[0])) teamRows.push(['Moral', scaleOf(mor[0]), scaleOf(mor[1]), { max: 5, text: [mor[0], mor[1]] }]);
          if (teamRows.length) groups.push({ title: 'MANNSCHAFTSWERTE', rows: teamRows });
        }
        return groups;
      };
      const renderStats = (groups, title) => {
        let h = `<div class="os-statgrid"><div class="os-stat-h">${title}</div>`;
        groups.forEach(gr => {
          h += `<div class="os-stat-title">${gr.title}</div>`;
          gr.rows.forEach(row => {
            const lbl = row[0], hv = row[1], av = row[2], opt = row[3];
            const pct = opt === true || (opt && opt.pct), text = opt && opt.text;
            const mx = pct ? 100 : (opt && opt.max) ? opt.max : Math.max(hv, av, 1);
            const hp = Math.round(hv / mx * 100), ap = Math.round(av / mx * 100);
            const hvD = text ? text[0] : `${hv}${pct ? '%' : ''}`, avD = text ? text[1] : `${av}${pct ? '%' : ''}`;
            h += `<div class="os-stat-row"><span class="os-stat-hv">${hvD}</span>`
              + `<div class="os-stat-bar os-stat-bar-h"><span style="width:${hp}%"></span></div>`
              + `<span class="os-stat-lbl">${lbl}</span>`
              + `<div class="os-stat-bar os-stat-bar-a"><span style="width:${ap}%"></span></div>`
              + `<span class="os-stat-av">${avD}</span></div>`;
          });
        });
        return h + '</div>';
      };
      const attachGrid = (tr, html) => { if (!tr) return; const td = tr.querySelector('td'); if (td) td.appendChild(el('div', 'os-statwrap', html)); };
      attachGrid(hzCommentTr, renderStats(computeStats(45, false), 'Statistik zur Halbzeit (aus dem Spielbericht erfasst)'));
      attachGrid(finalCommentTr, renderStats(computeStats(Math.max(maxMin, 90), true), 'Spielstatistik'));
    })();

    jobs.push({ label: 'Statistik', delay: 1600, run: () => { clearCur(); momentumTo(maxMin + 2); } });
    jobs.push({ label: 'Spielerstatistik', delay: 0, run: () => { showEl(playerStatsAct); scrollTo(playerStatsAct); broadcastEnded = true; if (confChk.checked && elevenAct.querySelector('.os-el-pitch')) showEl(elevenAct); } });

    // ---- Steuerung ----
    let ji = 0, playing = false, speed = 0.5, timer = null;
    const seekEl = bar.querySelector('.os-seek');
    seekEl.max = jobs.length;
    const syncSeek = () => { seekEl.value = ji; };
    const setPhase = j => { phase.textContent = (typeof j.label === 'function') ? j.label() : j.label; };
    const stop = () => { playing = false; clearTimeout(timer); playBtn.textContent = ji >= jobs.length ? '↻ Nochmal' : '▶ Fortsetzen'; };
    const step = () => {
      if (ji >= jobs.length) { playing = false; playBtn.textContent = '↻ Nochmal'; phase.textContent = 'Ende'; syncSeek(); return; }
      const j = jobs[ji++]; try { j.run(); } catch (e) { if (window.console) console.warn('[OS] job:', e); } setPhase(j); syncSeek();
      timer = setTimeout(step, j.delay / speed);
    };
    const play = () => {
      if (ji >= jobs.length) { reset(); }
      playing = true; playBtn.textContent = '⏸ Pause'; step();
    };
    const allRows = () => tblReport ? [...tblReport.querySelectorAll('tr')] : [];
    // An eine beliebige Stelle springen: Zustand bis Ziel-Index sofort aufbauen
    const seekTo = target => {
      clearTimeout(timer); playing = false; seeking = true;
      clearCur(); clearGoalBoard(); board.style.display = 'none';
      acts.forEach(a => a.style.display = 'none');
      allRows().forEach(r => r.style.display = 'none');
      setScoreBoard(0, 0, false); setMinBoard(''); hideMarkers();
      ji = 0;
      const n = Math.max(0, Math.min(jobs.length, target | 0));
      while (ji < n) { try { jobs[ji++].run(); } catch (e) { } }
      seeking = false;
      clearCur();
      const vis = reportRows.filter(r => r.style.display !== 'none');
      const cur = vis.length ? vis[vis.length - 1] : null;
      if (cur) { cur.classList.add('os-live-current'); scrollTo(cur); }
      if (ji >= jobs.length) { minEl.textContent = 'Ende'; phase.textContent = 'komplett'; playBtn.textContent = '↻ Nochmal'; }
      else { phase.textContent = ji === 0 ? 'bereit' : 'pausiert'; playBtn.textContent = ji === 0 ? '▶ Anpfiff starten' : '▶ Fortsetzen'; }
      syncSeek();
    };
    function reset() {
      stop(); clearCur(); clearGoalBoard(); board.style.display = 'none';
      acts.forEach(a => a.style.display = 'none');
      allRows().forEach(r => r.style.display = 'none');
      setScoreBoard(0, 0, false); setMinBoard(''); hideMarkers(); broadcastEnded = false;
      ji = 0; playBtn.textContent = '▶ Anpfiff starten'; phase.textContent = 'bereit'; syncSeek();
    }
    const showAll = () => { seekTo(jobs.length); };

    playBtn.addEventListener('click', () => { playing ? stop() : play(); });
    bar.querySelector('.os-all').addEventListener('click', showAll);
    bar.querySelector('.os-reset').addEventListener('click', reset);
    speedBtns.forEach(b => b.addEventListener('click', () => { speed = parseFloat(b.dataset.s); speedBtns.forEach(x => x.classList.toggle('active', x === b)); }));
    seekEl.addEventListener('input', () => { seekTo(parseInt(seekEl.value, 10)); });
    const momChk = bar.querySelector('.os-mom-chk');
    if (momChk) momChk.addEventListener('change', () => { document.body.classList.toggle('os-mom-off', !momChk.checked); });
    const soberChk = bar.querySelector('.os-sober-chk');
    if (soberChk) soberChk.addEventListener('change', () => { document.body.classList.toggle('os-sober', soberChk.checked); });
    const atmoChk = bar.querySelector('.os-atmo-chk');
    if (atmoChk) atmoChk.addEventListener('change', () => { document.body.classList.toggle('os-atmo-off', !atmoChk.checked); });
    const origChk = bar.querySelector('.os-orig-chk');
    if (origChk) {
      let boardSaved = '';
      origChk.addEventListener('change', () => {
        const on = origChk.checked;
        if (on) { boardSaved = board.style.display; board.style.display = 'none'; } else { board.style.display = boardSaved; }
        title.style.display = on ? 'none' : '';
        stage.style.display = on ? 'none' : '';
        origBox.style.display = on ? '' : 'none';
      });
    }
    // Konferenz-Häkchen: bei Aktivierung Parallelspiele laden und einweben
    document.body.classList.add('os-conf-off');
    const confChk = bar.querySelector('.os-conf-chk');
    const confStatus = t => { const s = bar.querySelector('.os-conf-status'); if (s) s.textContent = t; };
    confChk.addEventListener('change', async () => {
      document.body.classList.toggle('os-conf-off', !confChk.checked);
      if (!confChk.checked) { confBumps.forEach(b => b.job.delay = b.orig); elevenAct.style.display = 'none'; confStatus('Konferenz aus'); return; }
      if (confLoaded) { confBumps.forEach(b => b.job.delay = Math.max(b.orig, 3200)); if (broadcastEnded && elevenAct.querySelector('.os-el-pitch')) elevenAct.style.display = ''; confStatus('Konferenz an (' + (confResults ? confResults.length : 0) + ' Spiele)'); return; }
      if (!confCtx) { confStatus('Daten noch nicht bereit – gleich erneut'); confChk.checked = false; document.body.classList.add('os-conf-off'); return; }
      confChk.disabled = true; confStatus('Konferenz lädt … (Parallelspiele)');
      confResults = await fetchConference(confCtx);
      confChk.disabled = false;
      if (!confResults) { confStatus('Keine Parallelspiele gefunden'); confChk.checked = false; document.body.classList.add('os-conf-off'); return; }
      renderConference(confResults); confLoaded = true; confStatus('Konferenz an (' + confResults.length + ' Spiele)');
      buildEleven(confResults).catch(e => console.warn('[OS] Elf des Tages fehlgeschlagen:', e));
    });
    syncSeek();

    // ---- Team-Daten von st.php nachladen (same-origin, mit Login-Sitzung) ----
    function httpGet(url) {
      return new Promise((resolve, reject) => {
        const gmFn = (typeof GM_xmlhttpRequest === 'function') ? GM_xmlhttpRequest
                   : (typeof GM === 'object' && GM && typeof GM.xmlHttpRequest === 'function') ? GM.xmlHttpRequest.bind(GM)
                   : null;
        if (gmFn) {
          try { gmFn({ method: 'GET', url, onload: r => resolve(r.responseText), onerror: () => reject('gm-error'), ontimeout: () => reject('gm-timeout') }); }
          catch (e) { reject(e); }
        } else if (typeof fetch === 'function') {
          fetch(url, { credentials: 'same-origin' }).then(r => r.text()).then(resolve, reject);
        } else reject('no-http');
      });
    }
    function httpPost(url, data) {
      const body = Object.keys(data).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&');
      return new Promise((resolve, reject) => {
        const gmFn = (typeof GM_xmlhttpRequest === 'function') ? GM_xmlhttpRequest
                   : (typeof GM === 'object' && GM && typeof GM.xmlHttpRequest === 'function') ? GM.xmlHttpRequest.bind(GM)
                   : null;
        if (gmFn) {
          try { gmFn({ method: 'POST', url, data: body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, onload: r => resolve(r.responseText), onerror: () => reject('gm-error'), ontimeout: () => reject('gm-timeout') }); }
          catch (e) { reject(e); }
        } else if (typeof fetch === 'function') {
          fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body }).then(r => r.text()).then(resolve, reject);
        } else reject('no-http');
      });
    }
    async function resolveLeague(hId, aId, season, zat, matchday, countryName, leagueHint) {
      try {
        const d0 = new DOMParser().parseFromString(await httpGet(location.origin + '/ls.php?stataktion=Statistik+ausgeben'), 'text/html');
        const optVal = (sel, txt) => { if (!sel) return ''; const o = [...sel.options].find(o => norm((o.textContent || '').replace(/^[*\s]+/, '')) === norm(txt)); return o ? o.value : ''; };
        const ligaSel = d0.querySelector('select[name="ligaauswahl"]');
        const land = optVal(d0.querySelector('select[name="landauswahl"]'), countryName);
        if (!land) return null;
        const curLiga = optVal(ligaSel, leagueHint);
        const optLigen = ligaSel ? [...ligaSel.options].map(o => o.value).filter(Boolean) : [];
        const cand = [curLiga, '1', '2', '3', '4', '5', ...optLigen].filter((v, i, a) => v && a.indexOf(v) === i).slice(0, 12);
        const nameOf = code => { if (!ligaSel) return ''; const o = [...ligaSel.options].find(o => o.value === code); return o ? (o.textContent || '').replace(/^[*\s]+/, '').trim() : ''; };
        for (const lg of cand) {
          const u = location.origin + '/ls.php?ligaauswahl=' + lg + '&landauswahl=' + land + '&stauswahl=' + matchday + '&saauswahl=' + season + '&stataktion=Statistik+ausgeben';
          const doc = new DOMParser().parseFromString(await httpGet(u), 'text/html');
          const hit = [...doc.querySelectorAll('a[href*="os_bericht"]')].some(a => { const m = (a.getAttribute('href') || '').match(/os_bericht\((\d+),(\d+),(\d+),(\d+)\)/); return m && m[1] === String(hId) && m[2] === String(aId) && +m[3] === +zat && String(m[4]) === String(season); });
          if (hit) return { code: lg, name: nameOf(lg), land };
        }
      } catch (e) { console.warn('[OS] Liga-Ermittlung fehlgeschlagen:', e); }
      return null;
    }
    async function resolveCup(hId, aId, season, zat, countryName) {
      try {
        const d0 = new DOMParser().parseFromString(await httpGet(location.origin + '/lp.php?stataktion=Statistik+ausgeben'), 'text/html');
        const optVal = (sel, txt) => { if (!sel) return ''; const o = [...sel.options].find(o => norm((o.textContent || '').replace(/^[*\s]+/, '')) === norm(txt)); return o ? o.value : ''; };
        const land = optVal(d0.querySelector('select[name="landauswahl"]'), countryName);
        if (!land) return null;
        const rSel = d0.querySelector('select[name="stauswahl"]');
        const rounds = rSel ? [...rSel.options].map(o => ({ val: o.value, name: (o.textContent || '').replace(/^[*\s]+/, '').trim() })).filter(r => r.val) : [];
        for (const r of rounds) {
          const u = location.origin + '/lp.php?landauswahl=' + land + '&stauswahl=' + r.val + '&saauswahl=' + season + '&stataktion=Statistik+ausgeben';
          const doc = new DOMParser().parseFromString(await httpGet(u), 'text/html');
          const prs = [];
          doc.querySelectorAll('a[href*="os_bericht"]').forEach(a => { const m = (a.getAttribute('href') || '').match(/os_bericht\((\d+),(\d+),(\d+),(\d+)\)/); if (!m) return; const row = a.closest('tr'); const names = row ? [...row.querySelectorAll('a[href*="teaminfo"]')].map(x => x.textContent.trim()) : []; prs.push({ home: m[1], away: m[2], zat: +m[3], season: m[4], homeName: names[0] || ('Team ' + m[1]), awayName: names[1] || ('Team ' + m[2]) }); });
          if (prs.some(p => p.home === String(hId) && p.away === String(aId) && +p.zat === +zat && String(p.season) === String(season))) return { round: r.val, roundName: r.name, land, pairs: prs };
        }
      } catch (e) { console.warn('[OS] Pokalrunde-Ermittlung fehlgeschlagen:', e); }
      return null;
    }
    // ---- Konferenz: Tore der Parallelspiele ----
    function parseReportGoals(html) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const tbl = [...doc.querySelectorAll('table')].find(t => /Anpfiff/.test(t.textContent));
      const goals = []; let curMin = 0, ph = 0, pa = 0;
      const lines = [];
      if (tbl) tbl.querySelectorAll('tr').forEach(tr => {
        const first = (tr.children[0] ? tr.children[0].textContent : '').trim();
        const m = /^\d+\.?$/.test(first) ? parseInt(first, 10) : null; if (m != null) curMin = m;
        const cell = [...tr.children].find(x => (x.textContent || '').trim().length > 12) || tr.children[tr.children.length - 1];
        const parts = cell ? cell.innerHTML.split(/<br\s*\/?>/i).map(s => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean) : [];
        parts.forEach(p => lines.push({ min: curMin, text: p }));
      });
      for (let i = 0; i < lines.length; i++) {
        const g = lines[i].text.match(/Neuer Spielstand:\s*(\d+):(\d+)\s*(?:\(([^,)]+)(?:,\s*([^)]+))?)?/);
        if (!g) continue;
        const nh = +g[1], na = +g[2];
        let shot = '', prep = '';
        for (let j = i - 1; j >= 0 && j >= i - 4; j--) {
          if (/schiesst|köpft|Schuss|zieht ab|Schlenzer|Flatterball|Kopfball|Strammer|Harter Schuss/.test(lines[j].text)) { shot = lines[j].text; if (j - 1 >= 0 && lines[j - 1].min === lines[i].min && !/Neuer Spielstand/.test(lines[j - 1].text)) prep = lines[j - 1].text; break; }
        }
        goals.push({ min: lines[i].min, sh: nh, sa: na, scorerHome: nh > ph, scorer: (g[3] || '').trim(), assist: (g[4] || '').trim(), prep, shot });
        ph = nh; pa = na;
      }
      const ptbl = [...doc.querySelectorAll('table')].find(t => /Spielername/.test(t.textContent) && /Vorlagen/.test(t.textContent));
      const players = parsePlayerTable(ptbl);
      return { goals, finalH: ph, finalA: pa, players };
    }
    async function fetchConference(ctx) {
      if (ctx.cup) {
        try {
          const others = (ctx.pairs || []).filter(p => +p.zat === +ctx.zat && String(p.season) === String(ctx.season) && !(p.home === ctx.homeId && p.away === ctx.awayId));
          if (!others.length) { console.warn('[OS] Pokal-Konferenz: keine Parallelspiele'); return null; }
          return (await Promise.all(others.map(async p => {
            try { const rg = parseReportGoals(await httpGet(location.origin + '/rep/saison/' + p.season + '/' + p.zat + '/' + p.home + '-' + p.away + '.html')); return { ...p, goals: rg.goals, finalH: rg.finalH, finalA: rg.finalA, players: rg.players }; }
            catch (e) { return { ...p, goals: [], finalH: 0, finalA: 0, players: { home: [], away: [] } }; }
          }))).filter(Boolean);
        } catch (e) { console.warn('[OS] Pokal-Konferenz fehlgeschlagen:', e); return null; }
      }
      try {
        const d0 = new DOMParser().parseFromString(await httpGet(location.origin + '/ls.php?stataktion=Statistik+ausgeben'), 'text/html');
        const optVal = (sel, txt) => { if (!sel) return ''; const o = [...sel.options].find(o => norm((o.textContent || '').replace(/^[*\s]+/, '')) === norm(txt)); return o ? o.value : ''; };
        const ligaSel = d0.querySelector('select[name="ligaauswahl"]');
        const land = optVal(d0.querySelector('select[name="landauswahl"]'), ctx.country);
        const curLiga = optVal(ligaSel, ctx.league);
        if (!land) { console.warn('[OS] Konferenz: Land-Code nicht gefunden', ctx.country); return null; }
        const optLigen = ligaSel ? [...ligaSel.options].map(o => o.value).filter(Boolean) : [];
        const cand = [curLiga, '1', '2', '3', '4', '5', ...optLigen].filter((v, i, a) => v && a.indexOf(v) === i).slice(0, 12);
        const parsePairs = doc => { const pr = []; doc.querySelectorAll('a[href*="os_bericht"]').forEach(a => { const m = (a.getAttribute('href') || '').match(/os_bericht\((\d+),(\d+),(\d+),(\d+)\)/); if (!m) return; const row = a.closest('tr'); const names = row ? [...row.querySelectorAll('a[href*="teaminfo"]')].map(x => x.textContent.trim()) : []; pr.push({ home: m[1], away: m[2], zat: +m[3], season: m[4], homeName: names[0] || ('Team ' + m[1]), awayName: names[1] || ('Team ' + m[2]) }); }); return pr; };
        let pairs = [];
        for (const lg of cand) {
          const u = location.origin + '/ls.php?ligaauswahl=' + lg + '&landauswahl=' + land + '&stauswahl=' + ctx.matchday + '&saauswahl=' + ctx.season + '&stataktion=Statistik+ausgeben';
          const pr = parsePairs(new DOMParser().parseFromString(await httpGet(u), 'text/html'));
          if (pr.some(p => p.home === ctx.homeId && p.away === ctx.awayId && p.zat === +ctx.zat && String(p.season) === String(ctx.season))) { pairs = pr; console.log('[OS] Konferenz-Liga gefunden: ligaauswahl=' + lg); break; }
        }
        const others = pairs.filter(p => p.zat === +ctx.zat && String(p.season) === String(ctx.season) && !(p.home === ctx.homeId && p.away === ctx.awayId));
        if (!others.length) { console.warn('[OS] Konferenz: passende Liga/Parallelspiele nicht gefunden für', ctx.homeId + '-' + ctx.awayId, 'Saison', ctx.season, 'Spieltag', ctx.matchday); return null; }
        const results = (await Promise.all(others.map(async p => {
          try { const rg = parseReportGoals(await httpGet(location.origin + '/rep/saison/' + p.season + '/' + p.zat + '/' + p.home + '-' + p.away + '.html')); return { ...p, goals: rg.goals, finalH: rg.finalH, finalA: rg.finalA, players: rg.players }; }
          catch (e) { console.warn('[OS] Konferenz-Bericht fehlgeschlagen', p, e); return null; }
        }))).filter(Boolean);
        console.log('[OS] Konferenz geladen:', results.length, 'Parallelspiele');
        return results.length ? results : null;
      } catch (e) { console.warn('[OS] Konferenz laden fehlgeschlagen:', e); return null; }
    }
    function renderConference(results) {
      document.querySelectorAll('.os-confrow').forEach(e => e.remove());
      confBumps.forEach(b => b.job.delay = b.orig); confBumps = [];
      reportRows.forEach(r => { r._conf = null; r._lastConf = null; r._bumped = false; });
      if (!results) return;
      // Zeilen-Minuten (null bei Fortsetzungszeilen ohne Minutenangabe)
      const rowMin = reportRows.map(r => { const f = (r.children[0] ? r.children[0].textContent : '').trim(); return /^\d+\.?$/.test(f) ? parseInt(f, 10) : null; });
      // alle Parallel-Tore sammeln und nach Minute sortieren
      const all = [];
      results.forEach(res => res.goals.forEach(g => all.push({ ...g, homeName: res.homeName, awayName: res.awayName })));
      all.sort((a, b) => a.min - b.min);
      all.forEach(g => {
        // Ziel: ERSTE Zeile der Spielminute – das Tor wird VOR der Minute genannt
        let fi = -1; for (let i = 0; i < reportRows.length; i++) { if (rowMin[i] != null && rowMin[i] >= g.min) { fi = i; break; } }
        let target = fi >= 0 ? reportRows[fi] : reportRows[reportRows.length - 1];
        if (!target) return;
        const shD = g.scorerHome ? `<b>${g.sh}</b>` : `${g.sh}`, saD = !g.scorerHome ? `<b>${g.sa}</b>` : `${g.sa}`;
        const cityOf = n => { const toks = (n || '').split(/\s+/).filter(t => t && !/^[´'`’]?\d/.test(t)); return toks.length ? toks[toks.length - 1] : (n || ''); };
        const short = cityOf(g.homeName);
        const cr = document.createElement('tr'); cr.className = 'os-confrow os-confgoal'; cr.style.display = 'none';
        const c1 = document.createElement('td'); c1.textContent = g.min + '.';
        const c2 = document.createElement('td'); c2.colSpan = 20;
        c2.innerHTML = `<div class="os-conf-l1">⚽ TOR in ${short}!</div>`
          + `<div class="os-conf-l2">Neuer Spielstand: ${g.homeName} ${shD}:${saD} ${g.awayName}` + (g.scorer ? ` &nbsp;|&nbsp; Torschütze ${g.scorer}` : '') + `</div>`;
        cr.appendChild(c1); cr.appendChild(c2);
        if (target._lastConf) target._lastConf.after(cr); else if (target.parentNode) target.parentNode.insertBefore(cr, target);
        target._lastConf = cr;
        (target._conf = target._conf || []).push(cr);
        // Ticker an dieser Zeile länger pausieren, damit Tor + Minute Platz haben
        if (target._job && !target._bumped) { confBumps.push({ job: target._job, orig: target._job.delay }); target._job.delay = Math.max(target._job.delay || 900, 3600); target._bumped = true; }
        if (target.style.display !== 'none') cr.style.display = '';
      });
      // Halbzeit-Zwischenstände und Endstände als Scoreboard (Wappen + Ergebnis-Box) in die Analyse-Zeilen hängen
      const matchRow = (hn, an, hid, aid, hs, as) => `<div class="os-cm"><span class="os-cm-h ${hs > as ? 'os-win' : ''}">${hn}</span>${logoTag(hid)}<span class="os-cm-score">${hs}:${as}</span>${logoTag(aid)}<span class="os-cm-a ${as > hs ? 'os-win' : ''}">${an}</span></div>`;
      const appendSummary = (tr, html) => {
        if (!tr) return false;
        const td = tr.querySelector('td'); if (!td) return false;
        td.querySelectorAll('.os-confsum').forEach(e => e.remove());
        const d = document.createElement('div'); d.className = 'os-confsum'; d.innerHTML = html;
        const grid = td.querySelector('.os-statwrap');   // Statistik soll NACH den Konferenz-Ergebnissen stehen
        if (grid && grid.parentNode === td) td.insertBefore(d, grid); else td.appendChild(d);
        return true;
      };
      const hzTab = results.map(res => { let a = 0, b = 0; res.goals.forEach(g => { if (g.min <= 45) { a = g.sh; b = g.sa; } }); return matchRow(res.homeName, res.awayName, res.home, res.away, a, b); }).join('');
      const endTab = results.map(res => matchRow(res.homeName, res.awayName, res.home, res.away, res.finalH, res.finalA)).join('');
      const okHz = appendSummary(hzCommentTr, '<div class="os-conf-head">⚽ Halbzeit an den anderen Plätzen</div>' + hzTab);
      const okEnd = appendSummary(finalCommentTr, '<div class="os-conf-head">⚽ Endstände der anderen Plätze</div>' + endTab);
      attachLogoErrors();
      console.log('[OS] Konferenz-Übersichten angehängt – Halbzeit:', okHz, 'Ende:', okEnd);
    }
    async function buildEleven(confResults) {
      if (!confResults || !confResults.length) return;
      const body = elevenAct.querySelector('.os-el-body'); if (!body) return;
      body.innerHTML = '<div class="os-el-load">Elf des Tages wird berechnet …</div>';
      if (broadcastEnded && confChk.checked) elevenAct.style.display = '';
      const num = s => { const n = parseFloat(String(s).replace(',', '.')); return isNaN(n) ? 0 : n; };
      const teamIds = new Set(); confResults.forEach(res => { teamIds.add(res.home); teamIds.add(res.away); });
      const teamData = {};
      await Promise.all([...teamIds].map(async tid => { try { teamData[tid] = await fetchTeam(tid); } catch (e) { teamData[tid] = null; } }));
      const urlIds = location.pathname.match(/(\d+)-(\d+)\.html/) || [];
      teamData[urlIds[1]] = gHData; teamData[urlIds[2]] = gAData;
      const players = [];
      const endMin = Math.max(maxMin, 90), pmin = {};
      [...Object.values(homeMap || {}), ...Object.values(awayMap || {})].filter(Boolean).forEach(nm => { pmin[sn(nm)] = endMin; });
      subInfo.forEach(si => { if (si.out) pmin[sn(si.out)] = si.min; if (si.in) pmin[sn(si.in)] = Math.max(0, endMin - si.min); });
      const addTeam = (rows, teamId, teamName, gc, isMain) => {
        const td = teamData[teamId];
        (rows || []).forEach(r => {
          if (!r.name) return;
          const p = td && td.players ? td.players[norm(r.name)] : null;
          const pos = p && p.pos ? p.pos : '';
          const id = p && p.id ? p.id : '';
          const key = sn(r.name);
          const card = isMain ? (pcards[key] || { y: 0, r: 0 }) : { y: 0, r: 0 };
          const st = { pos, goals: num(r.goals), assists: num(r.assists), shots: num(r.shots), onTarget: num(r.onTarget), zk: num(r.zk), zkp: r.zkp ? num(r.zkp) : null, yellow: card.y, red: card.r, minutes: isMain ? (pmin[key] != null ? pmin[key] : endMin) : 90, saves: isMain ? (psaves[key] || 0) : 0, conceded: gc, teamConceded: gc };
          players.push({ name: r.name, teamName, teamId, pos, id, note: rating(pos, st), goals: num(r.goals), assists: num(r.assists), zk: num(r.zk), zkp: r.zkp ? num(r.zkp) : 0, conceded: gc });
        });
      };
      const em = getV(V, 'Endstand'); const fMH = parseInt(em[0], 10), fMA = parseInt(em[1], 10);
      addTeam(psRows.home, urlIds[1], home, isNaN(fMA) ? score.a : fMA, true);
      addTeam(psRows.away, urlIds[2], away, isNaN(fMH) ? score.h : fMH, true);
      confResults.forEach(res => { if (res.players) { addTeam(res.players.home, res.home, res.homeName, res.finalA, false); addTeam(res.players.away, res.away, res.awayName, res.finalH, false); } });
      const eligible = (p, g) => g === 'TOR' ? p.pos === 'TOR' : g === 'ABW' ? (p.pos === 'ABW' || p.pos === 'DMI') : g === 'MIT' ? (p.pos === 'MIT' || p.pos === 'DMI' || p.pos === 'OMI') : (p.pos === 'STU' || p.pos === 'OMI');
      const cmp = g => (a, b) => {
        if (b.note !== a.note) return b.note - a.note;
        if (g === 'STU') { if (b.goals !== a.goals) return b.goals - a.goals; if (b.assists !== a.assists) return b.assists - a.assists; return b.zkp - a.zkp; }
        if (g === 'ABW') { if (b.zkp !== a.zkp) return b.zkp - a.zkp; if (b.zk !== a.zk) return b.zk - a.zk; return b.goals - a.goals; }
        if (g === 'MIT') { if (b.assists !== a.assists) return b.assists - a.assists; if (b.zkp !== a.zkp) return b.zkp - a.zkp; return b.goals - a.goals; }
        if (g === 'TOR') { if (a.conceded !== b.conceded) return a.conceded - b.conceded; return b.note - a.note; }
        return 0;
      };
      const used = new Set();
      const pick = (g, n) => { const pool = players.filter(p => eligible(p, g) && !used.has(p)).sort(cmp(g)); const sel = pool.slice(0, n); sel.forEach(p => used.add(p)); return sel; };
      const gk = pick('TOR', 1), def = pick('ABW', 3), att = pick('STU', 3), mid = pick('MIT', 4);
      if (!gk.length && !def.length && !mid.length && !att.length) { body.innerHTML = '<div class="os-el-load">Keine Positionsdaten verfügbar – Elf des Tages nicht berechenbar.</div>'; return; }
      const card = p => `<div class="os-el-card"><div class="os-el-pw"><div class="os-el-photo"><img src="${location.origin}/faceprev.php?sid=${p.id}" alt="" loading="lazy" onerror="this.style.visibility='hidden'"></div><span class="os-el-logo">${logoTag(p.teamId)}</span><span class="os-el-note">${p.note % 1 === 0 ? p.note : p.note.toFixed(1)}</span></div><div class="os-el-pos"><span class="os-pos p-${p.pos || 'MIT'}">${p.pos || '–'}</span></div><div class="os-el-name">${boldSurname(p.name)}</div><div class="os-el-team">${p.teamName}</div></div>`;
      const row = arr => arr.length ? `<div class="os-el-row">${arr.map(card).join('')}</div>` : '';
      body.innerHTML = `<div class="os-el-pitch"><svg class="os-el-lines" viewBox="0 0 320 460" preserveAspectRatio="none"><g fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2"><rect x="6" y="6" width="308" height="448"/><line x1="6" y1="230" x2="314" y2="230"/><circle cx="160" cy="230" r="42"/><circle cx="160" cy="230" r="2" fill="#fff" stroke="none"/><rect x="82" y="6" width="156" height="60"/><rect x="120" y="6" width="80" height="24"/><rect x="82" y="394" width="156" height="60"/><rect x="120" y="430" width="80" height="24"/></g></svg><div class="os-el-rows">${row(att)}${row(mid)}${row(def)}${row(gk)}</div></div><div class="os-el-hint">Geschätzt aus Note, Position (Stammposition) und Statistik des Spieltags.</div>`;
      attachLogoErrors();
      elevenAct.style.display = (broadcastEnded && confChk.checked) ? '' : 'none';
      console.log('[OS] Elf des Tages:', [...gk, ...def, ...mid, ...att].map(p => p.name + ' ' + p.note));
    }
    async function fetchTeam(id) {
      try {
        const html = await httpGet(location.origin + '/st.php?c=' + id);
        const doc = new DOMParser().parseFromString(html, 'text/html');
        let team = '', trainer = '', league = '', country = '';
        const tr = doc.querySelector('a[href*="writePM"]');
        if (tr) trainer = tr.textContent.trim();
        const ligaEl = [...doc.querySelectorAll('b, strong, h1, h2, h3, td, p, div, span')]
          .find(e => / - .*Liga/.test(e.textContent || '') && (e.textContent || '').length < 90);
        if (ligaEl) {
          const parts = (ligaEl.textContent || '').split(/\s+-\s+/);
          team = (parts[0] || '').trim();
          const lm = (parts[1] || '').match(/(\d+\.\s*Liga(?:\s+[A-D](?![a-zäöü]))?)\s+([A-ZÄÖÜ][a-zäöüß]+)/);
          if (lm) { league = lm[1].trim(); country = lm[2].trim(); }
        }
        const players = {};
        const TAL = ['Spielmacher', 'Freistossspezialist', 'Torinstinkt', 'Flankengott', 'Libero', 'Elfmetertöter', 'Torwandtalent', 'Kopfballspezialist'];
        const talRe = new RegExp('\\((' + TAL.join('|') + ')\\)', 'g');
        doc.querySelectorAll('a[href*="sp.php"]').forEach(a => {
          const name = a.textContent.trim(); if (!name) return;
          const idm = (a.getAttribute('href') || '').match(/sp\.php\?s=(\d+)/); const pid = idm ? idm[1] : '';
          const row = a.closest('tr, li, p, div') || a.parentElement;
          const rt = row ? row.textContent : '';
          const pos = (rt.match(/\b(TOR|ABW|DMI|MIT|OMI|STU)\b/) || [])[1] || '';
          const dec = rt.match(/\d{1,3}\.\d{2}/g) || [];
          const talents = []; let tm; while ((tm = talRe.exec(rt))) talents.push(tm[1]); talRe.lastIndex = 0;
          players[norm(name)] = { pos, skill: dec[0] || '', opt: dec[1] || '', talents, id: pid };
        });
        console.log('[OS] Team ' + id + ':', team || '(kein Name)', '|', league, country, '| Spieler:', Object.keys(players).length);
        return { team, trainer, players, league, country };
      } catch (e) { console.warn('[OS] Laden von Team ' + id + ' fehlgeschlagen:', e); return null; }
    }
    (async () => {
      const ids = location.pathname.match(/(\d+)-(\d+)\.html/);
      if (!ids) { console.warn('[OS] Keine Team-IDs in der URL gefunden.'); return; }
      let [, homeId, awayId] = ids;
      let [hData, aData] = await Promise.all([fetchTeam(homeId), fetchTeam(awayId)]);
      if (hData && aData && away && hData.team && norm(hData.team) === norm(away)) { const t = hData; hData = aData; aData = t; }
      gHData = hData; gAData = aData;
      greeting.querySelector('.os-mod').innerHTML = greetingText(hData && hData.trainer, aData && aData.trainer);
      homeCoach = (hData && hData.trainer) || ''; awayCoach = (aData && aData.trainer) || '';
      document.querySelectorAll('.os-cn').forEach(el => { const c = el.getAttribute('data-s') === 'h' ? homeCoach : awayCoach; if (c) el.textContent = (el.getAttribute('data-fmt') === 'name' ? c : 'Trainer ' + c); });
      renderLineup(homeBlock, homeMap, hData && hData.players, posFB.home);
      renderLineup(awayBlock, awayMap, aData && aData.players, posFB.away);
      attachLogoErrors();
      const POSCLS = { TOR: 'p-TOR', ABW: 'p-ABW', DMI: 'p-DMI', MIT: 'p-MIT', OMI: 'p-OMI', STU: 'p-STU' };
      const ALLPOS = ['p-TOR', 'p-ABW', 'p-DMI', 'p-MIT', 'p-OMI', 'p-STU'];
      const colorChips = (sel, players) => {
        if (!players) return;
        document.querySelectorAll('.os-field .os-chip' + sel).forEach(c => {
          const p = players[norm(c.getAttribute('data-player'))];
          if (p && p.pos && POSCLS[p.pos]) { ALLPOS.forEach(cl => c.classList.remove(cl)); c.classList.add(POSCLS[p.pos]); }
        });
      };
      colorChips('.home', hData && hData.players);
      colorChips('.away', aData && aData.players);
      // Sondertalente -> Torschützen-Kommentare anreichern (Torinstinkt)
      const allTalents = {};
      [hData, aData].forEach(d => { if (d && d.players) Object.keys(d.players).forEach(k => { allTalents[k] = (d.players[k] && d.players[k].talents) || []; }); });
      goalComments.forEach(g => {
        const data = g.home ? hData : aData;
        const fill = (photoSel, posSel, soSel, name) => {
          const p = name && data && data.players ? data.players[norm(name)] : null;
          if (!p) return;
          const ph = g.tr.querySelector(photoSel); if (ph && p.id) ph.innerHTML = `<img src="${location.origin}/faceprev.php?sid=${p.id}" alt="" onerror="this.style.display='none'">`;
          const pos = g.tr.querySelector(posSel); if (pos && p.pos) pos.innerHTML = `<span class="os-pos p-${p.pos}">${p.pos}</span>`;
          const so = g.tr.querySelector(soSel); if (so) so.textContent = [p.skill, p.opt].filter(Boolean).join(' – ');
        };
        fill('.os-gb-ph', '.os-gb-pos-s', '.os-gb-so-s', g.scorer);
        fill('.os-gb-aph', '.os-gb-pos-a', '.os-gb-so-a', g.assist);
        const tal = allTalents[norm(g.scorer)] || [];
        if (tal.indexOf('Torinstinkt') >= 0) {
          const c = g.tr.querySelector('.os-gb-comment');
          if (c) c.insertAdjacentHTML('beforeend', ' <span class="os-talnote">Der Torinstinkt-Stürmer war zur Stelle!</span>');
        }
      });
      eventBoxRows.forEach(tr => tr.querySelectorAll('[data-name]').forEach(el => {
        const nm = el.dataset.name, side = el.dataset.side;
        const data = side === 'h' ? hData : aData;
        const p = nm && data && data.players ? data.players[norm(nm)] : null;
        if (!p) return;
        if (el.classList.contains('os-ev-ph')) { if (p.id) el.innerHTML = `<img src="${location.origin}/faceprev.php?sid=${p.id}" alt="" onerror="this.style.display='none'">`; }
        else if (el.classList.contains('os-ev-pos')) { if (p.pos) el.innerHTML = `<span class="os-pos p-${p.pos}">${p.pos}</span> `; }
        else if (el.classList.contains('os-ev-so')) { el.textContent = [p.skill, p.opt].filter(Boolean).join(' – '); }
      }));
      console.log('[OS] Aufstellungen & Talente aktualisiert.');
      buildPlayerStats(hData, aData);
      // Trainernamen in die Kommentar-Platzhalter einsetzen (Punkt 7)
      document.querySelectorAll('.os-coach').forEach(elc => {
        const t = elc.getAttribute('data-team');
        const tr = t === 'h' ? (hData && hData.trainer) : (aData && aData.trainer);
        if (tr) elc.textContent = 'Trainer ' + tr;
      });

      // ---- Saisonplan -> Spieltag, Form, Spielart (zeitpunkt-korrekt) ----
      const urlM = location.pathname.match(/\/saison\/(\d+)\/(\d+)\//);
      const rSeason = urlM ? urlM[1] : '', rZat = urlM ? parseInt(urlM[2], 10) : null;
      async function fetchSchedule(id) {
        const parse = html => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const matches = [];
          doc.querySelectorAll('a[href*="os_bericht"]').forEach(a => {
            const m = (a.getAttribute('href') || '').match(/os_bericht\((\d+),(\d+),(\d+),(\d+)\)/); if (!m) return;
            const row = a.closest('tr, li, p, div') || a.parentElement; const rt = row ? row.textContent : '';
            const sa = (rt.match(/\b(Liga|Friendly|LP|Pokal)\b/) || [])[1] || '';
            const res = rt.match(/(\d+)\s*:\s*(\d+)/);
            matches.push({ home: m[1], away: m[2], zat: +m[3], season: m[4], sa: sa, gl: res ? +res[1] : null, gr: res ? +res[2] : null });
          });
          return matches;
        };
        try {
          let matches = null;
          if (rSeason) {
            try { const mp = parse(await httpPost(location.origin + '/st.php?s=6&c=' + id, { saison: rSeason, saauswahl: rSeason })); if (mp.some(m => String(m.season) === String(rSeason))) matches = mp; } catch (e) { }
          }
          if (!matches) matches = parse(await httpGet(location.origin + '/st.php?s=6&c=' + id));
          return matches;
        } catch (e) { console.warn('[OS] Saisonplan ' + id + ' fehlgeschlagen:', e); return null; }
      }
      async function fetchHistory(id) {
        try {
          const doc = new DOMParser().parseFromString(await httpGet(location.origin + '/st.php?s=10&c=' + id), 'text/html');
          const rows = [];
          doc.querySelectorAll('tr').forEach(tr => {
            const cells = [...tr.children].map(c => c.textContent.trim());
            if (cells.length < 4) return;
            const season = parseInt(cells[0], 10); if (isNaN(season)) return;
            const place = (cells[2].match(/(\d+)\.\s*Platz/) || [])[1];
            rows.push({ season, liga: cells[1], place: place ? +place : null, pokal: cells[3] || '' });
          });
          return rows;
        } catch (e) { console.warn('[OS] Historie ' + id + ' fehlgeschlagen:', e); return null; }
      }
      const POKAL_RANK = { 'Pokalsieger': 7, 'Finale': 6, 'Halbfinale': 5, 'Achtelfinale': 4 };
      const LAND_ADJ = { 'Belgien': 'belgischer', 'Deutschland': 'deutscher', 'England': 'englischer', 'Frankreich': 'französischer', 'Italien': 'italienischer', 'Spanien': 'spanischer', 'Niederlande': 'niederländischer', 'Österreich': 'österreichischer', 'Schweiz': 'Schweizer', 'Portugal': 'portugiesischer', 'Schottland': 'schottischer', 'Türkei': 'türkischer', 'Griechenland': 'griechischer', 'Polen': 'polnischer', 'Dänemark': 'dänischer', 'Schweden': 'schwedischer', 'Norwegen': 'norwegischer', 'Kroatien': 'kroatischer', 'Tschechien': 'tschechischer', 'Ungarn': 'ungarischer', 'Wales': 'walisischer', 'Irland': 'irischer', 'Serbien': 'serbischer', 'Ukraine': 'ukrainischer' };
      const historyBest = (rows, teamName, country) => {
        if (!rows || !rows.length) return '';
        const past = rows.filter(r => !rSeason || r.season < +rSeason);
        if (!past.length) return '';
        const adj = (country && LAND_ADJ[country]) ? LAND_ADJ[country] + ' ' : '';
        const t1 = past.filter(r => /1\.\s*Liga/.test(r.liga) && r.place === 1).map(r => r.season).sort((a, b) => a - b);
        const t2 = past.filter(r => /2\.\s*Liga/.test(r.liga) && r.place === 1).map(r => r.season).sort((a, b) => a - b);
        const top = past.filter(r => /1\.\s*Liga/.test(r.liga) && r.place).sort((a, b) => a.place - b.place)[0];
        let pk = -1, pkName = '', pkSeason = null;
        past.forEach(r => Object.keys(POKAL_RANK).forEach(k => { if (r.pokal.indexOf(k) >= 0 && POKAL_RANK[k] > pk) { pk = POKAL_RANK[k]; pkName = k; pkSeason = r.season; } }));
        if (t1.length) {
          const n = t1.length, latest = t1[t1.length - 1];
          return pick([
            `${teamName} ist ${n > 1 ? n + '-facher ' : ''}${adj}Meister`,
            `die letzte Meisterschaft holte ${teamName} in Saison ${latest}`,
            `${teamName}, ${n > 1 ? n + '-facher ' : ''}${adj}Meister, ist eine echte Größe`
          ]);
        }
        if (t2.length) return `${teamName} stieg in Saison ${t2[t2.length - 1]} als Meister der 2. Liga auf`;
        if (top && top.place <= 3) return `${teamName} stand in der 1. Liga schon auf Rang ${top.place} (Saison ${top.season})`;
        if (pkName === 'Pokalsieger') return `${teamName} gewann in Saison ${pkSeason} den Pokal`;
        if (pkName === 'Finale') return `${teamName} stand in Saison ${pkSeason} im Pokalfinale`;
        if (pk >= 4) return `${teamName} erreichte in Saison ${pkSeason} im Pokal das ${pkName}`;
        return '';
      };
      const teamForm = (matches, teamId, teamFirst) => {
        if (!matches || rZat == null) return null;
        const tm = matches.map(m => {
          const isHome = m.home === String(teamId);
          // teamFirst=true: Ergebnis steht als Team:Gegner (linke Zahl = dieses Team)
          const tg = teamFirst ? m.gl : (isHome ? m.gl : m.gr);
          const og = teamFirst ? m.gr : (isHome ? m.gr : m.gl);
          const res = (tg == null || og == null) ? null : (tg > og ? 'S' : tg < og ? 'N' : 'U');
          return { zat: m.zat, season: m.season, sa: m.sa, res, tg, og };
        });
        const cur = tm.find(m => m.zat === rZat);
        if (!cur) return null;
        const sameSeason = !rSeason || cur.season === rSeason;
        const ligaAll = tm.filter(m => m.sa === 'Liga');
        const matchday = ligaAll.filter(m => m.zat <= rZat).length;
        const prior = sameSeason ? ligaAll.filter(m => m.zat < rZat && m.res != null) : [];
        let w = 0, d = 0, l = 0, gf = 0, ga = 0;
        prior.forEach(m => { gf += (m.tg || 0); ga += (m.og || 0); if (m.res === 'S') w++; else if (m.res === 'U') d++; else l++; });
        const form = prior.slice(-5).map(m => m.res);
        return { spielart: cur.sa, matchday, form, played: prior.length, w, d, l, pts: w * 3 + d, gf, ga, sameSeason };
      };
      const pick = arr => arr[Math.floor(Math.random() * arr.length)];
      // Formphrase OHNE Teamname (verb-first). avoid = Phrase des anderen Teams (nicht wiederholen)
      const formClause = (f, avoid) => {
        const P = arr => { const o = arr.filter(x => x !== avoid); return pick(o.length ? o : arr); };
        if (!f || !f.length) return P(['startet ohne große Ligaform in die Partie', 'hat noch keine Formkurve vorzuweisen']);
        const last = f[f.length - 1];
        let streak = 1; for (let i = f.length - 2; i >= 0 && f[i] === last; i--) streak++;
        let unbeaten = 0; for (let i = f.length - 1; i >= 0 && f[i] !== 'N'; i--) unbeaten++;
        let winless = 0; for (let i = f.length - 1; i >= 0 && f[i] !== 'S'; i--) winless++;
        const w = f.filter(x => x === 'S').length, d = f.filter(x => x === 'U').length, n = f.filter(x => x === 'N').length;
        if (last === 'S' && streak >= 3) return P([`ist mit ${streak} Siegen in Folge brandheiß`, `reist mit einer Siegesserie von ${streak} Spielen an`, `strotzt vor Selbstvertrauen – ${streak} Siege am Stück`]);
        if (last === 'N' && streak >= 3) return P([`steckt mit ${streak} Pleiten in Folge tief in der Krise`, `hat die letzten ${streak} Spiele allesamt verloren`, `braucht dringend ein Erfolgserlebnis – ${streak} Niederlagen nacheinander`]);
        if (last === 'N' && streak === 2) return P([`kommt mit zwei Niederlagen im Rücken`, `hat zuletzt zweimal verloren – die Fans sind besorgt`, `will die zwei Pleiten schnell vergessen machen`]);
        if (last === 'S' && streak === 2) return P([`ist mit zwei Siegen im Aufwind`, `hat zuletzt zweimal gewonnen und Blut geleckt`, `surft auf einer kleinen Erfolgswelle`]);
        if (unbeaten >= 4) return P([`ist seit ${unbeaten} Ligaspielen ungeschlagen`, `wartet seit ${unbeaten} Spielen auf eine Niederlage`]);
        if (winless >= 4) return P([`wartet seit ${winless} Ligaspielen auf einen Sieg`, `hängt seit ${winless} Spielen ohne Dreier fest`]);
        if (winless >= 3) return P([`ist seit ${winless} Spielen sieglos`, `kommt seit ${winless} Partien nicht zum Sieg`]);
        if (w >= 4) return P([`präsentiert sich in bestechender Verfassung`, `ist derzeit kaum zu stoppen`]);
        if (n >= 4) return P([`steckt tief im Formtief`, `sucht händeringend nach der Form`]);
        if (w >= 1 && d >= 1 && n >= 1) return P([`zeigt zuletzt ein Auf und Ab ohne echte Konstanz`, `ist schwer einzuschätzen – mal so, mal so`, `schwankt zwischen Licht und Schatten`, `lässt jede Konstanz vermissen`]);
        if (n > w) return P([`läuft der Form etwas hinterher`, `hat zuletzt mehr verloren als gewonnen`]);
        if (w > n) return P([`ist ordentlich in Fahrt`, `hat den Schwung auf seiner Seite`]);
        return P([`kommt mit durchwachsener Bilanz`, `bewegt sich im soliden Mittelmaß`]);
      };
      const recordText = t => (!t || t.played === 0) ? 'ist noch ohne Ligaspiel (Saisonauftakt)' :
        `hat <b>${t.pts}</b> Punkte aus ${t.played} Spielen (${t.w}&#8209;${t.d}&#8209;${t.l}, ${t.gf}:${t.ga} Tore)`;
      const compareText = (hf, af) => {
        if (!hf || !af || hf.played === 0 || af.played === 0) return '';
        const diff = hf.pts - af.pts;
        if (diff >= 6) return ` Nach Punkten hat ${home} klar die Nase vorn.`;
        if (diff <= -6) return ` ${away} bringt das deutlich dickere Punktepolster mit.`;
        if (Math.abs(diff) <= 2) return ' Punktemäßig liegen beide dicht beieinander – ein enges Duell.';
        return diff > 0 ? ` ${home} steht etwas besser da.` : ` ${away} steht etwas besser da.`;
      };
      // Schlüsselspieler positionsabhängig und kreativ
      // Verb-first-Klausel, passt nach "Bei {Team} …" (Verb an zweiter Stelle)
      const roleClause = who => {
        const nm = `<b>${who.name}</b>`;
        const t = who.tal || [];
        const has = w => t.indexOf(w) >= 0;
        const note = t.length ? (TAL_ABBR[t[0]] || t[0]) : (who.o ? 'Opt.-Skill ' + who.o.toFixed(2) : '');
        const tail = note ? ` (${note})` : '';
        if (who.role === 'libero') return `räumt Libero ${nm} als letzter Mann hinten alles ab${tail}`;
        if (who.role === 'spielmacher') return `gibt Spielmacher ${nm} im Zentrum den Takt vor${tail}`;
        if (who.pos === 'TOR') return pick([`soll ${nm} den Kasten sauber halten`, `steht mit ${nm} ein sicherer Rückhalt im Tor`, `wird ${nm} im Tor gefordert sein, wenn es brenzlig wird`]) + tail;
        if (who.pos === 'ABW') return pick([`ist ${nm} das Bollwerk – schwer zu überwinden`, `soll ${nm} hinten dichtmachen und die Angreifer entschärfen`, `ruht die defensive Hoffnung auf ${nm}`]) + tail;
        if (who.pos === 'DMI') return pick([`räumt ${nm} vor der Abwehr die Bälle ab`, `sorgt ${nm} im Zentrum für die nötige Balance`]) + tail;
        if (who.pos === 'MIT') return pick([`zieht ${nm} im Mittelfeld die Fäden`, `soll ${nm} das Spiel gestalten und die Angriffe einleiten`, `läuft über ${nm} das Aufbauspiel`]) + tail;
        if (who.pos === 'OMI') return pick([`soll ${nm} die Kreativität bringen und die Stürmer füttern`, `liefert ${nm} die zündenden Ideen`, `sucht ${nm} den entscheidenden letzten Pass`]) + tail;
        if (who.pos === 'STU') return pick([`soll ${nm} für die Tore sorgen`, has('Torinstinkt') ? `lauert Torjäger ${nm} mit seinem Torinstinkt auf jede Chance` : `hofft man auf die Treffer von ${nm}`, `soll ${nm} seine Chancen eiskalt nutzen`]) + tail;
        return `gilt ${nm} als einer der Schlüsselspieler${tail}`;
      };
      const focusPlayer = (map, players, tac) => {
        if (!players) return null;
        const byPos = {}, byName = {};
        starterLetters.forEach(l => {
          const nm = map[l]; if (!nm) return;
          const p = players[norm(nm)]; if (!p || !p.pos) return;
          const o = { name: nm, o: parseFloat(p.opt) || 0, pos: p.pos, tal: p.talents || [] };
          (byPos[p.pos] = byPos[p.pos] || []).push(o); byName[norm(nm)] = o;
        });
        const all = Object.keys(byPos).reduce((a, k) => a.concat(byPos[k]), []);
        if (!all.length) return null;
        const best = arr => (arr && arr.length) ? arr.slice().sort((a, b) => b.o - a.o)[0] : null;
        const lib = tac && tac.libero && byName[norm(tac.libero)]; if (lib) return Object.assign({}, lib, { role: 'libero' });
        const sm = tac && tac.spielmacher && byName[norm(tac.spielmacher)]; if (sm) return Object.assign({}, sm, { role: 'spielmacher' });
        const sw = (tac && tac.spielweise) || '';
        let c = null;
        if (/offensiv|brechstange|angriff|sturm/i.test(sw)) c = best(byPos.OMI) || best(byPos.STU);
        else if (/defensiv|abwehrblock|abwehrriegel|mauer|konter/i.test(sw)) c = best(byPos.TOR) || best(byPos.ABW) || best(byPos.DMI);
        else c = best(byPos.MIT);
        return c || best(all);
      };
      const keyPlayers = (htac, atac) => {
        const hi = focusPlayer(homeMap, hData && hData.players, htac), ai = focusPlayer(awayMap, aData && aData.players, atac);
        const s = [];
        if (hi) s.push(`Bei <b>${home}</b> ${roleClause(hi)}.`);
        if (ai) s.push(`Bei <b>${away}</b> ${roleClause(ai)}.`);
        return s.length ? ' ' + s.join(' ') : '';
      };
      // Formation aus den Positionen der Startelf (st.php oder Feld-Fallback)
      const formationOf = (map, players, fb) => {
        const cnt = { ABW: 0, DMI: 0, MIT: 0, OMI: 0, STU: 0 };
        starterLetters.forEach(l => {
          if (l === 'T') return;
          const nm = map[l]; if (!nm) return;
          const p = players && players[norm(nm)];
          const pos = (p && p.pos) || (fb && fb[l]) || '';
          if (cnt[pos] !== undefined) cnt[pos]++;
        });
        return { cnt, str: ['ABW', 'DMI', 'MIT', 'OMI', 'STU'].map(k => cnt[k]).filter(x => x > 0).join('-') };
      };
      const DEF_RE = /defensiv|abwehr|riegel|mauer|konter|tief|verhalten|zurückgezogen/i;
      const OFF_RE = /offensiv|angriff|sturm|forsch|druck|nach vorn/i;
      const HARD_RE = /hart|brutal|grätsch|ruppig|aggressiv|blut|rustikal/i;
      const FAIR_RE = /fair|zahm|zurückhaltend|ruhig/i;
      const EFF_RE = /voll|erhöht|maximal|intensiv|hoch/i;
      const wordy = v => v && v !== '–' && /[A-Za-zÄÖÜäöü]/.test(v);
      const tacticsLine = (team, trainer, f, tac, avoid) => {
        const coach = trainer ? 'Coach ' + trainer : 'der Trainer';
        const opts = [];
        if (f && f.str) opts.push(`${team} läuft im ${f.str} auf`, `${team} beginnt im ${f.str}`);
        const sw = tac && tac.spielweise;
        if (wordy(sw)) {
          if (DEF_RE.test(sw)) opts.push(`${team} igelt sich ein – die Spielweise steht auf „${sw}"`, `${team} setzt auf einen Abwehrblock (Spielweise „${sw}")`, `${coach} lässt ${team} betont defensiv agieren („${sw}")`);
          else if (OFF_RE.test(sw)) opts.push(`${team} sucht offensiv sein Heil – Spielweise „${sw}"`, `${coach} stellt ${team} auf Angriff („${sw}")`, `${team} will nach vorne spielen („${sw}")`);
          else opts.push(`die Spielweise von ${team} steht auf „${sw}"`, `${team} agiert mit „${sw}" als Grundausrichtung`);
        }
        const ha = tac && tac.haerte;
        if (wordy(ha)) {
          if (HARD_RE.test(ha)) opts.push(`${team} geht ruppig zu Werke (Härte „${ha}")`, `bei ${team} wird hart in die Zweikämpfe gegangen („${ha}")`);
          else if (FAIR_RE.test(ha)) opts.push(`${team} setzt auf eine faire Gangart („${ha}")`);
        }
        const ei = tac && tac.einsatz;
        if (wordy(ei) && EFF_RE.test(ei)) opts.push(`${team} will mit vollem Einsatz Druck machen („${ei}")`);
        const ar = [];
        if (wordy(tac && tac.abwehr)) ar.push('Abwehr „' + tac.abwehr + '"');
        if (wordy(tac && tac.mittelfeld)) ar.push('Mittelfeld „' + tac.mittelfeld + '"');
        if (wordy(tac && tac.sturm)) ar.push('Sturm „' + tac.sturm + '"');
        if (ar.length >= 2) opts.push(`${team} gibt die Marschroute vor: ${ar.join(', ')}`);
        const o = opts.filter(x => x && x !== avoid);
        return o.length ? pick(o) : '';
      };
      const streakOf = f => { if (!f || !f.length) return { last: '', n: 0, unbeaten: 0 }; const last = f[f.length - 1]; let n = 1; for (let i = f.length - 2; i >= 0 && f[i] === last; i--) n++; let ub = 0; for (let i = f.length - 1; i >= 0 && f[i] !== 'N'; i--) ub++; return { last, n, unbeaten: ub }; };
      const atmosphere = hf => {
        const opts = [
          `Die Mannschaften laufen soeben ein, die Vereinshymne von ${home} schallt noch durchs Rund.`,
          `Eine beeindruckende Choreographie der Heimfans empfängt die beiden Teams.`,
          `Fahnen, Schals und lautstarke Gesänge – die Kulisse${stadion ? ' im ' + stadion : ''} ist bereitet.`,
          `Das Flutlicht brennt, der Rasen ist frisch gemäht – die Bühne für dieses Duell steht.`,
          `Die Fans sind früh da und stimmen sich lautstark auf die Partie ein.`,
          `Die Blockfahne der Heimkurve ist entrollt, die Stimmung brodelt schon vor dem Anpfiff.`
        ];
        const z = zuschauer ? parseInt(String(zuschauer).replace(/\D/g, ''), 10) : 0;
        if (z > 0) opts.push(`${zuschauer} Zuschauer sorgen für eine prächtige Kulisse.`);
        if (z >= 15000) opts.push(`Bei ${zuschauer} Fans ist das Rund bestens gefüllt.`);
        if (hf && hf.form) {
          const s = streakOf(hf.form), tr = hData && hData.trainer;
          if (s.last === 'S' && s.n >= 3) opts.push(`Nach ${s.n} Siegen in Folge werden ${home}${tr ? ' und vor allem Trainer ' + tr : ''} schon beim Einlaufen von den Rängen gefeiert.`);
          else if (s.unbeaten >= 4) opts.push(`Die Heimfans sind bester Laune – ihre Elf ist seit ${s.unbeaten} Spielen ungeschlagen.`);
          else if (s.last === 'N' && s.n >= 3) opts.push(`Nach zuletzt schwachen Wochen fordern die Heimfans lautstark eine Reaktion.`);
        }
        return pick(opts);
      };
      try {
        const setAct = (t, h) => { preAct.querySelector('h3').textContent = t; preAct.querySelector('.os-mod').innerHTML = h; };
        const [hSched, aSched] = await Promise.all([fetchSchedule(homeId), fetchSchedule(awayId)]);
        // Leserichtung des Ergebnisses aus dem echten Endstand ableiten (Gast-Saisonplan gegen Heim:Gast)
        let teamFirst = true;
        const aCur = aSched && aSched.find(m => m.zat === rZat);
        if (aCur && aCur.gl != null && aCur.gr != null) {
          if (aCur.gl === score.h && aCur.gr === score.a) teamFirst = false;       // Heim:Auswärts
          else if (aCur.gl === score.a && aCur.gr === score.h) teamFirst = true;   // Team:Gegner
        }
        console.log('[OS] Ergebnis-Leserichtung teamFirst =', teamFirst, '(Endstand', score.h + ':' + score.a + ', Gast-Zeile', aCur && (aCur.gl + ':' + aCur.gr) + ')');
        const hf = teamForm(hSched, homeId, teamFirst), af = teamForm(aSched, awayId, teamFirst);
        const sa = (hf && hf.spielart) || (af && af.spielart) || spielart || '';
        const tlEl = title.querySelector('.os-title-league');
        const ctyH = (hData && hData.country) || (aData && aData.country) || '';
        const lgHint = (hData && hData.league) || (aData && aData.league) || '';
        const isFriendly = /Friendly|Frendly|Freundschaft|Testspiel/i.test(sa);
        const isIntl = /\bOSC\b|\bOSE\b|Champions|Europapokal|Europacup/i.test(sa);
        const isLP = !isIntl && /\bLP\b|Ligapokal|Landespokal|Pokal/i.test(sa);
        const isLiga = !isFriendly && !isIntl && !isLP;
        if (tlEl && isFriendly) {
          tlEl.textContent = ['Freundschaftsspiel', rSeason ? 'Saison ' + rSeason : ''].filter(Boolean).join('  ·  ');
          applyLeagueLogo('', '');
        } else if (tlEl && isIntl) {
          const cupName = /\bOSC\b|Champions/i.test(sa) ? 'OS Championscup (OSC)' : 'OS Europacup (OSE)';
          tlEl.textContent = [cupName, rSeason ? 'Saison ' + rSeason : ''].filter(Boolean).join('  ·  ');
          applyLeagueLogo('', '');
        } else if (tlEl && isLP) {
          tlEl.textContent = [ctyH, 'Landespokal', rSeason ? 'Saison ' + rSeason : ''].filter(Boolean).join('  ·  ');
          applyLeagueLogo('', '');
          resolveCup(String(homeId), String(awayId), rSeason, rZat, ctyH).then(rc => {
            if (!rc) return;
            tlEl.textContent = [ctyH, 'Landespokal', rSeason ? 'Saison ' + rSeason : '', rc.roundName].filter(Boolean).join('  ·  ');
            confCtx = { cup: true, country: ctyH, season: rSeason, zat: rZat, homeId: String(homeId), awayId: String(awayId), pairs: rc.pairs };
            const cst = bar.querySelector('.os-conf-status'); if (cst && !confLoaded) cst.textContent = 'Konferenz verfügbar';
          }).catch(() => { });
        } else if (tlEl && isLiga && hf && hf.matchday) {
          const setInfo = lg => { tlEl.textContent = [ctyH, lg, rSeason ? 'Saison ' + rSeason : '', hf.matchday + '. Spieltag'].filter(Boolean).join('  ·  '); applyLeagueLogo(ctyH, lg); };
          setInfo(lgHint || sa);
          resolveLeague(String(homeId), String(awayId), rSeason, rZat, hf.matchday, ctyH, lgHint).then(rl => { if (rl && rl.name) setInfo(rl.name); }).catch(() => { });
        } else if (tlEl) {
          tlEl.textContent = [ctyH, lgHint || sa, rSeason ? 'Saison ' + rSeason : ''].filter(Boolean).join('  ·  ');
        }
        if (isLiga && hf && hf.matchday) {
          confCtx = { league: (hData && hData.league) || (aData && aData.league) || '', country: (hData && hData.country) || (aData && aData.country) || '', season: rSeason, zat: rZat, matchday: hf.matchday, homeId: String(homeId), awayId: String(awayId) };
          const st = bar.querySelector('.os-conf-status'); if (st && !confLoaded) st.textContent = 'Konferenz verfügbar';
        }
        // ==== Einleitung vor dem Spiel (Baukasten) ====
        try {
          const iStadt = (home || '').split(/\s+/).filter(Boolean).pop() || home;
          const iEin = getV(S, 'Einsatz') || [], iSpw = getV(S, 'Spielweise') || [];
          const iPos = (map, pos, grp) => { for (const L in map) if (L !== 'T' && pos && pos[L] === grp) return map[L]; return ''; };
          const iB = nm => nm ? '<b>' + nm + '</b>' : '';
          const ictx = {
            Heim: '<b>' + home + '</b>', Gast: '<b>' + away + '</b>', Stadt: iStadt, Stadion: stadion || '', Zuschauer: zuschauer || '',
            Liga: (lgHint || sa || ''), Spieltag: (hf && hf.matchday) || '',
            TrainerH: (hData && hData.trainer) || '', TrainerG: (aData && aData.trainer) || '',
            EinsatzH: iEin[0] || '', EinsatzG: iEin[1] || '', SpielweiseH: iSpw[0] || '', SpielweiseG: iSpw[1] || '',
            TorwartH: iB(homeMap['T']), TorwartG: iB(awayMap['T']),
            StuermerH: iB(iPos(homeMap, posFB.home, 'STU')), StuermerG: iB(iPos(awayMap, posFB.away, 'STU')),
            AbwehrH: iB(iPos(homeMap, posFB.home, 'ABW')), AbwehrG: iB(iPos(awayMap, posFB.away, 'ABW')),
            MittelfeldH: iB(iPos(homeMap, posFB.home, 'MIT')), MittelfeldG: iB(iPos(awayMap, posFB.away, 'MIT'))
          };
          const iusable = s => (s.match(/\{(\w+)\}/g) || []).every(p => { const k = p.slice(1, -1); return ictx[k] != null && String(ictx[k]).trim() !== ''; });
          const ifill = s => s.replace(/\{(\w+)\}/g, (m, k) => ictx[k] != null ? ictx[k] : m);
          const iparts = [];
          const iadd = (key, prob) => { const pool = (INTRO[key] || []).filter(iusable); if (pool.length && (prob >= 1 || Math.random() < prob)) iparts.push(ifill(pickNR(pool))); };
          iadd('begr', 1); iadd('einordnung', 0.85); iadd('kulisse', 0.7); iadd('trainer', 0.5); iadd('taktik', 0.6); iadd('spieler', 0.7); iadd('ausgangslage', 0.4); iadd('storyline', 0.55); iadd('ueberleitung', 1);
          if (iparts.length >= 3) { const gm = greeting.querySelector('.os-mod'); if (gm) gm.innerHTML = iparts.join(' '); }
        } catch (e) { }
        const hFo = formationOf(homeMap, hData && hData.players, posFB.home);
        const aFo = formationOf(awayMap, aData && aData.players, posFB.away);
        const sk = i => { let v = parseFloat(String((getV(V, 'Opt.Skill')[i] ?? getV(V, 'Opt')[i]) || '').replace(',', '.')); if (isNaN(v)) v = parseFloat(String(getV(V, 'Schnitt Skill')[i] || '').replace(',', '.')); return isNaN(v) ? null : v; };
        const hSk = sk(0), aSk = sk(1);
        const favLine = () => {
          if (hSk == null || aSk == null) return '';
          const d = hSk - aSk;
          if (Math.abs(d) < 1) return pick([`Von der individuellen Klasse liegen beide eng beieinander (Opt.-Skill ${hSk.toFixed(1)} zu ${aSk.toFixed(1)}) – ein offener Ausgang.`, `Kaum Unterschiede auf dem Papier: ${hSk.toFixed(1)} zu ${aSk.toFixed(1)} im Opt.-Skill.`]);
          const fav = d > 0 ? home : away, favV = d > 0 ? hSk : aSk, othV = d > 0 ? aSk : hSk;
          return pick([`Auf dem Papier ist ${fav} favorisiert (Opt.-Skill ${favV.toFixed(1)} zu ${othV.toFixed(1)}).`, `Die individuelle Klasse spricht für ${fav} (${favV.toFixed(1)} zu ${othV.toFixed(1)} im Opt.-Skill).`, `${fav} bringt im Schnitt die stärkeren Einzelspieler mit (Opt.-Skill ${favV.toFixed(1)} zu ${othV.toFixed(1)}).`]);
        };
        const tacGet = i => ({
          einsatz: (getV(S, 'Einsatz')[i] || '').trim(), haerte: (getV(S, 'Härte')[i] || '').trim(),
          spielweise: (getV(S, 'Spielweise')[i] || '').trim(), sturm: (getV(S, 'Sturm')[i] || '').trim(),
          mittelfeld: (getV(S, 'Mittelfeld')[i] || '').trim(), abwehr: (getV(S, 'Abwehr')[i] || '').trim(),
          spielmacher: (getV(S, 'Spielmacher')[i] || '').trim(), libero: (getV(S, 'Libero')[i] || '').trim()
        });
        const hTac = tacGet(0), aTac = tacGet(1);
        const tac = () => {
          const out = []; let hLine = '';
          if (Math.random() < 0.7) { hLine = tacticsLine(home, hData && hData.trainer, hFo, hTac); if (hLine) out.push(hLine + '.'); }
          if (Math.random() < 0.7) { const a = tacticsLine(away, aData && aData.trainer, aFo, aTac, hLine); if (a) out.push(a + '.'); }
          return out;
        };
        if (/Friendly/i.test(sa)) {
          const parts = [atmosphere(hf), 'Ein Freundschaftsspiel ohne Punkte – Gelegenheit zum Testen, Ausprobieren und Kräftemessen; das Ergebnis ist zweitrangig.'];
          parts.push(...tac()); const kp = keyPlayers(hTac, aTac); if (kp) parts.push(kp.trim());
          setAct('Vor dem Anpfiff', parts.filter(Boolean).join(' '));
        } else if (/LP|Pokal/i.test(sa)) {
          const parts = [atmosphere(hf), 'Ein Pokalspiel – hier zählt nur der Sieg. Wer verliert, ist raus; das verspricht Spannung bis zur letzten Sekunde.'];
          parts.push(...tac()); const kp = keyPlayers(hTac, aTac); if (kp) parts.push(kp.trim());
          setAct('Vor dem Anpfiff', parts.filter(Boolean).join(' '));
        } else if (/Liga/i.test(sa) && (hf || af)) {
          const md = (hf && hf.matchday) || (af && af.matchday);
          const hClause = formClause(hf && hf.form), aClause = formClause(af && af.form, hClause);
          const parts = [atmosphere(hf)];
          if (md) parts.push(`Vor dem <b>${md}. Spieltag</b>.`);
          parts.push(`<b>${home}</b> ${recordText(hf)} und ${hClause}.`);
          parts.push(`<b>${away}</b> ${recordText(af)} und ${aClause}.`);
          const cmp = compareText(hf, af); if (cmp) parts.push(cmp.trim());
          const fl = favLine(); if (fl) parts.push(fl);
          parts.push(...tac()); const kp = keyPlayers(hTac, aTac); if (kp) parts.push(kp.trim());
          setAct('Vor dem Anpfiff', parts.filter(Boolean).join(' '));
        } else {
          const parts = [atmosphere(hf), 'Gleich rollt der Ball – beide Mannschaften sind bereit, jetzt zählt nur, was auf dem Platz passiert.'];
          parts.push(...tac()); const kp = keyPlayers(hTac, aTac); if (kp) parts.push(kp.trim());
          setAct('Vor dem Anpfiff', parts.filter(Boolean).join(' '));
        }
        console.log('[OS] Saisonplan ausgewertet:', sa, hf, af);
      } catch (e) { console.warn('[OS] Vor-dem-Anpfiff-Anekdote übersprungen:', e); }
    })();

  } catch (e) {
    console.warn('[Online Soccer Styler] Übertragung übersprungen:', e);
  }
})();
