/* ============================================================
   static/js/index.js
   - Before/after comparison sliders (drag to wipe)
   - BibTeX copy button
   Original code.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  // ---- Comparison sliders ----
  function initCompare(el) {
    var setPos = function (clientX) {
      var r = el.getBoundingClientRect();
      var p = ((clientX - r.left) / r.width) * 100;
      p = Math.max(0, Math.min(100, p));
      el.style.setProperty("--pos", p + "%");
    };
    var dragging = false;
    el.addEventListener("pointerdown", function (e) {
      dragging = true;
      if (el.setPointerCapture) { try { el.setPointerCapture(e.pointerId); } catch (x) {} }
      setPos(e.clientX);
      e.preventDefault();
    });
    el.addEventListener("pointermove", function (e) {
      if (dragging) setPos(e.clientX);
    });
    var stop = function () { dragging = false; };
    el.addEventListener("pointerup", stop);
    el.addEventListener("pointercancel", stop);

    // Keyboard support on the handle
    var handle = el.querySelector(".compare-handle");
    if (handle) {
      handle.addEventListener("keydown", function (e) {
        var cur = parseFloat(getComputedStyle(el).getPropertyValue("--pos"));
        if (isNaN(cur)) cur = 50;
        if (e.key === "ArrowLeft")  { el.style.setProperty("--pos", Math.max(0, cur - 2) + "%"); e.preventDefault(); }
        if (e.key === "ArrowRight") { el.style.setProperty("--pos", Math.min(100, cur + 2) + "%"); e.preventDefault(); }
      });
    }
  }
  document.querySelectorAll(".compare").forEach(initCompare);

  // ---- BibTeX copy ----
  var btn = document.getElementById("copy-bibtex");
  var pre = document.querySelector("#bibtex pre");
  if (btn && pre) {
    btn.addEventListener("click", function () {
      var text = pre.innerText;
      var done = function () {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = "Copy"; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var range = document.createRange();
        range.selectNode(pre);
        var sel = window.getSelection();
        sel.removeAllRanges(); sel.addRange(range);
        try { document.execCommand("copy"); } catch (e) {}
        sel.removeAllRanges(); done();
      }
    });
  }
});