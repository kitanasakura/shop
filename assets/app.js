(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const md = t => esc(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  const paras = t => (t || "").split("\n").filter(Boolean).map(p => "<p>" + md(p) + "</p>").join("");
  const lines = t => esc(t).split(/\s*\|\s*/).join("<br>");
  const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  // "/shop.html?cat=X" in a spec becomes the in-page route "#/shop?cat=X"
  const url = u => !u ? "#/" : /^(https?:|mailto:|#)/.test(u) ? u : "#/" + u.replace(/^\/+/, "").replace(/\.html/, "");
  const PH = "images/placeholder.svg";
  const img = n => !n ? PH : /^(https?:|data:)/.test(n) ? n : "images/" + n.replace(/^\/?images\//, "");
  const tag = (n, cls) => '<img class="' + (cls || "") + '" src="' + esc(img(n)) + '" alt="" loading="lazy" onerror="this.onerror=null;this.src=\'' + PH + '\'">';
  const spec = n => window.parseSpec((window.SPECS || {})[n] || "");
  const S = spec("site").settings;
  const money = n => (S.currency || "$") + (parseFloat(n) || 0).toFixed(2);

  /* ---------- cart ---------- */
  const load = () => { try { return JSON.parse(localStorage.getItem("fm_cart") || "[]"); } catch (e) { return []; } };
  const save = c => { try { localStorage.setItem("fm_cart", JSON.stringify(c)); } catch (e) {} drawCart(c); };
  function add(p) { const c = load(), f = c.find(i => i.slug === p.slug); f ? f.qty++ : c.push(Object.assign({ qty: 1 }, p)); save(c); openCart(); }
  function openCart(open) { const on = open !== false; $("#cart").hidden = !on; $("#cart-scrim").hidden = !on; document.body.classList.toggle("lock", on); }
  function drawCart(c) {
    c = c || load();
    const n = c.reduce((a, i) => a + i.qty, 0), total = c.reduce((a, i) => a + i.qty * i.price, 0);
    const badge = $("#cart-count"); if (badge) badge.textContent = n;
    const body = c.length ? c.map((i, x) => '<div class="ci">' + tag(i.image, "ci-img") + '<div><b>' + esc(i.name) + '</b><div>' + money(i.price) +
      '</div><div class="qty"><button data-q="' + x + '" data-d="-1" aria-label="Less">−</button>' + i.qty +
      '<button data-q="' + x + '" data-d="1" aria-label="More">+</button></div></div></div>').join("") : '<p class="empty">Your cart is empty. Go find a fluffy friend ♡</p>';
    const list = c.map(i => i.qty + " x " + i.name + " (" + money(i.price) + ")").join("\n");
    const mail = "mailto:" + (S.order_email || "") + "?subject=" + encodeURIComponent("Order from " + (S.name || "shop")) +
      "&body=" + encodeURIComponent("Hi! I'd like to order:\n\n" + list + "\n\nTotal: " + money(total) + "\n\nShipping address:\n");
    const checkout = S.checkout_url ? '<a class="btn wide" href="' + esc(S.checkout_url) + '">Checkout</a>' : '<a class="btn wide" href="' + esc(mail) + '">Send order by email</a>';
    $("#cart").innerHTML = '<div class="cart-head"><h3>Your cart</h3><button class="x" id="cart-close" aria-label="Close cart">×</button></div><div class="cart-body">' + body + "</div>" +
      (c.length ? '<div class="cart-foot"><div class="total"><span>Total</span><b>' + money(total) + "</b></div>" + checkout + "</div>" : "");
  }

  /* ---------- chrome (header/footer, drawn once) ---------- */
  function chrome() {
    const nav = spec("nav"), cats = spec("categories"), perks = spec("perks");
    document.title = S.name || document.title;
    if (S.announcement) $("#announce").innerHTML = esc(S.announcement); else $("#announce").hidden = true;
    const links = nav.items.map(i => {
      const dd = i.dropdown === "categories" ? '<div class="dd">' + cats.items.map(c => '<a href="#/shop?cat=' + encodeURIComponent(c.title) + '">' + esc(c.title) + "</a>").join("") + "</div>" : "";
      return '<div class="nl' + (dd ? " has-dd" : "") + '"><a data-r="' + esc(url(i.url).split("?")[0]) + '" href="' + esc(url(i.url)) + '">' + esc(i.title) + (dd ? " ▾" : "") + "</a>" + dd + "</div>";
    }).join("");
    $("#header").innerHTML = '<a class="brand" href="#/">' + (S.logo ? tag(S.logo, "logo") : "") + "<span><b>" + esc(S.name) + "</b><small>" + esc(S.tagline) + "</small></span></a>" +
      '<nav class="nav">' + links + '</nav><div class="tools"><a href="#/shop?focus=1" aria-label="Search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg></a>' +
      '<button id="cart-btn" aria-label="Open cart"><svg viewBox="0 0 24 24"><path d="M3 4h2l2.4 11h10l2-8H6.5"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></svg><span id="cart-count">0</span></button></div>';
    $("#footer").innerHTML = '<div class="perks">' + perks.items.map(p => '<div class="perk">' + (/\.(png|jpe?g|svg|webp|gif)$/i.test(p.icon || "") ? tag(p.icon, "perk-img") : "<span>" + esc(p.icon) + "</span>") + esc(p.title) + "</div>").join("") +
      '</div><p class="legal">' + esc(S.footer) + '</p><div class="gingham"></div>';
    drawCart();
  }

  /* ---------- pages ---------- */
  function home(el) {
    const h = spec("hero").settings, cats = spec("categories"), feat = spec("featured"), f = feat.settings, p = spec("promo").settings;
    el.innerHTML =
      '<section class="hero" style="background-image:url(\'' + esc(img(h.image)) + '\')"><div class="hero-in"><h1>' + lines(h.title) + "</h1><p>" + esc(h.subtitle) + '</p><a class="btn" href="' + url(h.button_link) + '">' + esc(h.button_text) + " →</a></div></section>" +
      '<section class="cats">' + cats.items.map(c => '<a class="cat" href="#/shop?cat=' + encodeURIComponent(c.title) + '">' + tag(c.icon, "cat-img") + "<span>" + esc(c.title) + " ♡</span></a>").join("") + "</section>" +
      '<section class="feat"><h2><span>' + esc(f.icon) + "</span> " + esc(f.title) + " <span>" + esc(f.icon) + '</span></h2><p class="sub">' + esc(f.subtitle) + '</p><div class="arches">' +
      feat.items.map(i => '<a class="arch" href="' + url(i.link || "/shop") + '">' + tag(i.image) + "<span>" + esc(i.title) + " →</span></a>").join("") + "</div></section>" +
      '<section class="promo" style="background-image:url(\'' + esc(img(p.image)) + '\')"><div class="promo-in"><h2>' + lines(p.title) + "</h2><p>" + esc(p.text) + '</p><a class="btn" href="' + url(p.button_link) + '">' + esc(p.button_text) + " →</a></div>" +
      (p.stamp ? '<div class="stamp">' + esc(p.stamp) + " ✉</div>" : "") +
      (p.form_action ? '<form class="signup" action="' + esc(p.form_action) + '" method="post"><input type="email" name="email" required placeholder="' + esc(p.email_placeholder) + '" aria-label="Email"><button>' + esc(p.subscribe_text) + "</button></form>" : "") + "</section>";
  }

  let ITEMS = [], shop = { cat: "All", q: "" };
  function shopPage(el, qs) {
    const inv = spec("inventory"), cats = spec("categories");
    ITEMS = inv.items.map(i => ({ slug: slug(i.title), name: i.title, price: parseFloat(i.price) || 0, category: i.category || "", images: (i.images || "").split(",").map(s => s.trim()).filter(Boolean),
      badge: i.badge || "", out: /^(out|no|sold)/i.test(i.stock || ""), desc: i.description || i.text || "" }));
    const names = ["All"].concat(cats.items.map(c => c.title));
    ITEMS.forEach(i => { if (i.category && !names.includes(i.category)) names.push(i.category); });
    shop = { cat: qs.get("cat") || "All", q: "", names };
    el.innerHTML = '<section class="shophead"><h1>Shop</h1><div class="filters"><input id="q" type="search" placeholder="Search plushies…" aria-label="Search"><div class="chips" id="chips"></div></div></section><section class="grid" id="grid"></section>';
    $("#q").oninput = e => { shop.q = e.target.value.toLowerCase(); drawGrid(); };
    drawGrid();
    if (qs.get("focus")) $("#q").focus();
    const open = ITEMS.find(i => i.slug === qs.get("item")); if (open) openModal(open);
  }
  function drawGrid() {
    $("#chips").innerHTML = shop.names.map(n => '<button class="chip' + (n === shop.cat ? " on" : "") + '" data-c="' + esc(n) + '">' + esc(n) + "</button>").join("");
    const list = ITEMS.filter(i => (shop.cat === "All" || i.category === shop.cat) && (i.name + " " + i.desc + " " + i.category).toLowerCase().includes(shop.q));
    $("#grid").innerHTML = list.length ? list.map(i => '<article class="card" data-s="' + i.slug + '" tabindex="0">' + (i.badge ? '<em class="badge">' + esc(i.badge) + "</em>" : "") + tag(i.images[0], "card-img") +
      "<h3>" + esc(i.name) + '</h3><div class="price">' + (i.out ? "Sold out" : money(i.price)) + "</div></article>").join("") : '<p class="empty">Nothing here yet ♡</p>';
  }
  function openModal(i) {
    const m = $("#modal");
    m.innerHTML = '<div class="mbox"><button class="x" id="m-close" aria-label="Close">×</button><div class="gal">' + tag(i.images[0], "big") + '<div class="thumbs">' +
      i.images.map(s => '<img src="' + esc(img(s)) + '" alt="" data-big="' + esc(img(s)) + '">').join("") + '</div></div><div class="minfo"><h2>' + esc(i.name) + '</h2><div class="price">' + money(i.price) + "</div><p>" + esc(i.desc) + "</p>" +
      (i.out ? '<button class="btn" disabled>Sold out</button>' : '<button class="btn" data-add="' + i.slug + '">Add to cart</button>') + "</div></div>";
    m.hidden = false; document.body.classList.add("lock");
  }
  function closeModal() { $("#modal").hidden = true; if ($("#cart").hidden) document.body.classList.remove("lock"); }

  function textPage(el, name) {
    if (!(window.SPECS || {})[name]) { el.innerHTML = '<section class="doc"><h1>Page not found</h1><p class="lead"><a href="#/">Back home ♡</a></p></section>'; return; }
    const d = spec(name), s = d.settings;
    let html = '<section class="doc"><h1>' + esc(d.title) + "</h1>";
    if (s.intro) html += '<p class="lead">' + md(s.intro) + "</p>";
    if (s.image && name === "about") html += tag(s.image, "doc-img");
    if (name === "contact") html += '<ul class="contact">' + (s.email ? '<li>✉ <a href="mailto:' + esc(s.email) + '">' + esc(s.email) + "</a></li>" : "") + (s.instagram ? '<li>♡ <a href="' + esc(s.instagram) + '">Instagram</a></li>' : "") + (s.hours ? "<li>☾ " + esc(s.hours) + "</li>" : "") + "</ul>";
    html += d.items.map(i => '<article class="post">' + (i.image ? tag(i.image, "post-img") : "") + "<h2>" + esc(i.title) + "</h2>" + (i.date ? "<time>" + esc(i.date) + "</time>" : "") + paras(i.text) + "</article>").join("") + "</section>";
    el.innerHTML = html;
  }

  /* ---------- router ---------- */
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("?"), page = parts[0] || "home", qs = new URLSearchParams(parts[1] || "");
    const el = $("#app");
    if (page === "home") home(el); else if (page === "shop") shopPage(el, qs); else textPage(el, page);
    document.querySelectorAll(".nl>a").forEach(a => a.classList.toggle("on", a.dataset.r === "#/" + (page === "home" ? "" : page)));
    openCart(false); if (page !== "shop") closeModal(); window.scrollTo(0, 0);
  }

  /* ---------- one set of global listeners ---------- */
  document.addEventListener("click", e => {
    const t = e.target, q = t.dataset && t.dataset.q;
    if (t.closest("#cart-btn")) return openCart();
    if (t.id === "cart-scrim" || t.id === "cart-close") return openCart(false);
    if (q != null && q !== "") { const c = load(); c[q].qty += +t.dataset.d; if (c[q].qty < 1) c.splice(q, 1); return save(c); }
    if (t.id === "m-close" || t.id === "modal") return closeModal();
    if (t.dataset && t.dataset.big) return ($(".big").src = t.dataset.big);
    if (t.dataset && t.dataset.add) { const i = ITEMS.find(x => x.slug === t.dataset.add); closeModal(); return add({ slug: i.slug, name: i.name, price: i.price, image: i.images[0] }); }
    const ch = t.closest(".chip"); if (ch) { shop.cat = ch.dataset.c; return drawGrid(); }
    const cd = t.closest(".card"); if (cd) openModal(ITEMS.find(i => i.slug === cd.dataset.s));
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeModal(); openCart(false); }
    const cd = e.target.closest && e.target.closest(".card"); if (cd && e.key === "Enter") openModal(ITEMS.find(i => i.slug === cd.dataset.s));
  });
  window.addEventListener("hashchange", route);
  chrome(); route();
})();
