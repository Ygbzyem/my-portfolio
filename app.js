// Renders projects from data/projects.json; #p/<slug> opens a project page.
// projects.json is author-controlled, so its "body" strings may contain inline HTML.
const RAW = (repo, path) => `https://raw.githubusercontent.com/${repo}/main/${path}`;
const $ = (sel) => document.querySelector(sel);
const home = $("#main"), detail = $("#detail");
let projects = [], activeTag = "All";
const repoInfo = {};

const pills = (items) => `<div class="project-tags">${items.map((t) => `<span>${t}</span>`).join("")}</div>`;
const specs = (rows) =>
  `<ul class="card-specs">${rows.map(([k, v]) => `<li><span>${k}</span>${v}</li>`).join("")}</ul>`;

function card(p) {
  const updated = repoInfo[p.repo] ? `updated ${repoInfo[p.repo]}` : p.year;
  return `<article class="card" data-slug="${p.slug}">
    <div class="card-meta"><span>${p.tags.join(" · ")}</span><span data-repo="${p.repo}">${updated}</span></div>
    <div class="card-head"><i class="fas ${p.icon}"></i><h3><a href="#p/${p.slug}">${p.title}</a></h3></div>
    <p>${p.summary}</p>
    ${specs(p.specs)}
    ${pills(p.stack)}
    <div class="card-links">
      <a href="#p/${p.slug}">View details →</a>
      <a class="secondary" href="https://github.com/${p.repo}" target="_blank" rel="noopener"><i class="fab fa-github"></i> Code</a>
    </div>
  </article>`;
}

function renderGrid() {
  const tags = ["All", ...new Set(projects.flatMap((p) => p.tags))];
  $("#filters").innerHTML = tags
    .map((t) => `<button type="button" aria-pressed="${t === activeTag}">${t}</button>`)
    .join("");
  const shown = activeTag === "All" ? projects : projects.filter((p) => p.tags.includes(activeTag));
  $("#projectGrid").innerHTML = shown.map(card).join("");
}

$("#filters").addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  activeTag = e.target.textContent;
  renderGrid();
});

// whole card is clickable (the old design already shows a pointer cursor on cards)
$("#projectGrid").addEventListener("click", (e) => {
  const c = e.target.closest(".card");
  if (c && !e.target.closest("a")) location.hash = `#p/${c.dataset.slug}`;
});

function block([type, a, b, c]) {
  if (type === "p") return `<p>${a}</p>`;
  if (type === "h") return `<h2>${a}</h2>`;
  if (type === "note") return `<p class="note">${a}</p>`;
  if (type === "list") return `<ul>${a.map((li) => `<li>${li}</li>`).join("")}</ul>`;
  if (type === "table")
    return `<div class="table-wrap"><table>${a ? `<caption>${a}</caption>` : ""}
      <thead><tr>${b.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead>
      <tbody>${c.map((r) => `<tr>${r.map((d) => `<td>${d}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  return "";
}

function renderDetail(p) {
  detail.innerHTML = `
    <a class="back-link" href="#projects">← All projects</a>
    <div class="detail-head">
      <span class="eyebrow" style="text-align:left">${p.tags.join(" · ")}${p.team ? ` · ${p.team}` : ""}</span>
      <h1>${p.title}</h1>
      <p class="lead">${p.summary}</p>
      ${pills(p.stack)}
    </div>
    <div class="detail-panel">${specs(p.specs)}
      <div class="card-links" style="margin-top:20px"><a class="back-link" href="https://github.com/${p.repo}" target="_blank" rel="noopener"><i class="fab fa-github"></i> Source code on GitHub ↗</a></div>
    </div>
    <figure><img src="${RAW(p.repo, p.image)}" alt="${p.imageAlt}" loading="lazy"><figcaption>${p.imageAlt}</figcaption></figure>
    <div class="prose">${p.body.map(block).join("")}</div>`;
  document.title = `${p.title} | Tung Pham`;
}

function route() {
  const m = location.hash.match(/^#p\/([\w-]+)/);
  const p = m && projects.find((x) => x.slug === m[1]);
  home.hidden = !!p;
  detail.hidden = !p;
  if (p) {
    renderDetail(p);
    window.scrollTo(0, 0);
  } else {
    document.title = "Tung Pham | IC Designer Portfolio";
    if (m) return void (location.hash = "#projects"); // unknown slug
    // the anchor was hidden when the browser tried to scroll, so scroll now
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }
}

// Last push date per repo from the public GitHub API (60 req/h unauthenticated; failures are ignored).
async function loadRepoDates() {
  const fmt = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" });
  const repos = ["Ygbzyem/my-portfolio", ...projects.map((p) => p.repo)];
  await Promise.all(repos.map(async (repo) => {
    try {
      const r = await fetch(`https://api.github.com/repos/${repo}`);
      if (r.ok) repoInfo[repo] = fmt.format(new Date((await r.json()).pushed_at));
    } catch { /* offline or rate-limited */ }
  }));
  document.querySelectorAll("[data-repo]").forEach((el) => {
    if (repoInfo[el.dataset.repo]) el.textContent = `updated ${repoInfo[el.dataset.repo]}`;
  });
  if (repoInfo["Ygbzyem/my-portfolio"]) $("#lastUpdate").textContent = ` · Last updated ${repoInfo["Ygbzyem/my-portfolio"]}`;
}

fetch("data/projects.json")
  .then((r) => r.json())
  .then((data) => {
    projects = data;
    renderGrid();
    route();
    window.addEventListener("hashchange", route);
    loadRepoDates();
  })
  .catch(() => {
    $("#projectGrid").innerHTML = `<p>Could not load projects. See <a href="https://github.com/Ygbzyem">GitHub</a>.</p>`;
  });
