/* Reads the tiny markdown format used in /specs/*.md
   "# Title"            -> file title
   "- key: value"       -> before the first "##" = settings, after = that item's field
   "## Name"            -> starts a new item
   other plain lines    -> item.text (paragraphs)
   <!-- comments -->    -> ignored                                              */
window.parseSpec = function (raw) {
  const out = { title: "", settings: {}, items: [] };
  let cur = null;
  String(raw || "").replace(/\r/g, "").replace(/<!--[\s\S]*?-->/g, "").split("\n").forEach(function (line) {
    let m;
    if ((m = line.match(/^##\s+(.+)/))) { cur = { title: m[1].trim(), _t: [] }; out.items.push(cur); return; }
    if ((m = line.match(/^#\s+(.+)/))) { out.title = m[1].trim(); return; }
    if ((m = line.match(/^\s*[-*]\s+([A-Za-z0-9_ -]+?)\s*:\s*(.*)$/))) {
      (cur || out.settings)[m[1].trim().toLowerCase().replace(/[\s-]+/g, "_")] = m[2].trim();
      return;
    }
    if (line.trim() && cur) cur._t.push(line.trim());
  });
  out.items.forEach(function (i) { i.text = i._t.join("\n"); delete i._t; });
  return out;
};

/* Spec registry: each specs/*.js file calls SPEC("name", `markdown`) */
window.SPECS = {};
window.SPEC = function (name, text) { window.SPECS[name] = text; };
