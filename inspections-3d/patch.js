(function () {
  var q = new URLSearchParams(location.search);
  function param(k) { return q.get(k) || ''; }

  function replaceAll(oldStr, newStr) {
    if (!oldStr || !newStr) return;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.textContent.indexOf(oldStr) !== -1) {
        n.textContent = n.textContent.split(oldStr).join(newStr);
      }
    }
  }

  function hide(el) { if (el) el.style.display = 'none'; }

  /* ========= أوامر الصفحة الأم ========= */
  window.addEventListener('message', function (ev) {
    var d = ev.data;
    if (!d) return;

    if (d.type === 'get-damages') {
      window.dispatchEvent(new Event('patch-notify'));

    } else if (d.type === 'damage-delete') {
      // ندوس زرار الحذف جوّه التطبيق عشان النقطة تتشال
      try {
        var allBtns = document.querySelectorAll('.damage-section button');
        var trash = [];
        for (var b = 0; b < allBtns.length; b++) {
          var html = allBtns[b].innerHTML || '';
          var ttl = allBtns[b].getAttribute('title') || '';
          if (/trash|delete/i.test(html) || /trash|delete/i.test(ttl)) trash.push(allBtns[b]);
        }
        if (trash.length === 0) {
          var iconBtns = [];
          for (var b3 = 0; b3 < allBtns.length; b3++) {
            if (allBtns[b3].textContent.trim().length <= 1) iconBtns.push(allBtns[b3]);
          }
          for (var b2 = 1; b2 < iconBtns.length; b2 += 2) trash.push(iconBtns[b2]);
        }
        if (trash[d.index]) {
          var origConfirm = window.confirm;
          window.confirm = function () { return true; };
          trash[d.index].click();
          window.confirm = origConfirm;
        }
      } catch (e) {}
      setTimeout(function () { window.dispatchEvent(new Event('patch-notify')); }, 150);

    } else if (d.type === 'damage-update') {
      window.dispatchEvent(new CustomEvent('patch-update', { detail: d }));
    }
  });

  /* ========= التطبيق عند الفتح ========= */
  function apply() {
    if (!document.body) return;

    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');

    if (!document.getElementById('patch-style')) {
      var st = document.createElement('style');
      st.id = 'patch-style';
      st.textContent =
        'html, body { height: 100% !important; margin: 0 !important; overflow: hidden !important; } ' +
        '[data-patch-hidden] { display: none !important; } ' +
        'main.shell { height: 100vh !important; } ' +
        'main.shell > * { height: 100% !important; overflow-y: auto !important; } ' +
        'main.shell > .right-col { overflow: hidden !important; display: flex !important; flex-direction: column !important; } ' +
        '.right-col > *:not(.damage-section) { flex: 1 1 auto !important; } ' +
        '.damage-section { display: none !important; } ' +
        '.modal + div { display: none !important; }';
      document.head.appendChild(st);
    }

    // بيانات العقد الحقيقية مكان الثوابت
    replaceAll('Mercedes-Benz CLA 250', param('car'));
    replaceAll('2024 Coupe / Executive Line', param('sub'));
    replaceAll('WDD1183431N123456', param('vin'));
    replaceAll('24,500 km', param('mileage'));
    replaceAll('Digital White Metallic', param('color'));
    replaceAll('2.0L Turbo I4', param('engine'));
    replaceAll('7G-DCT Automatic', param('transmission'));

    // إخفاء الزيادات
    var links = document.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].textContent.trim() === 'CrashCar') {
        hide(links[i].closest('header') || links[i].closest('nav'));
        break;
      }
    }
    var btns = document.querySelectorAll('button');
    for (var j = 0; j < btns.length; j++) {
      var t = btns[j].textContent.trim();
      if (t.indexOf('Save Report') === 0 || t.indexOf('Reset View') === 0) hide(btns[j]);
    }
    var all = document.querySelectorAll('*');
    for (var k = 0; k < all.length; k++) {
      var el = all[k];
      if (el.children.length === 0 && el.textContent.indexOf('INSPECTION PROGRESS') !== -1) {
        hide(el.closest('div') || el.parentElement);
      }
    }
  }

  apply();
  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    apply();
    if (tries > 20) clearInterval(timer);
  }, 500);
})();