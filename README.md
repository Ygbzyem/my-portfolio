# my-portfolio

Personal portfolio of **Phạm Minh Tùng**, IC Design student at FPT University.
Live at **https://ygbzyem.github.io/my-portfolio/**

Plain HTML, CSS and JavaScript on GitHub Pages: no framework and no build step. Projects are data-driven. Each one is an entry in `data/projects.json` that the page renders as a card and as its own detail page (`#p/<slug>`).

## Repository structure

```
my-portfolio/
├── index.html            # page shell: hero, skills, about, contact
├── style.css             # Night / Mist theme tokens, hero, sections, project cards
├── script.js             # clocks, scroll reveal, mobile menu, theme toggle, Discord status
├── app.js                # renders cards + detail pages from JSON, tag filter, GitHub "last updated"
├── data/
│   └── projects.json     # every project: summary, key specs, result tables, limitations
└── assets/
    ├── img/avatar.jpg
    └── pdf/Resume.pdf
```

## Module index

| # | File | Role |
|---|------|------|
| 1 | `index.html` | Static sections and the empty containers that `app.js` fills |
| 2 | `script.js` | Footer clocks, scroll reveal, mobile menu, light/dark toggle, live Discord status (Lanyard) |
| 3 | `app.js` | Loads `projects.json`, builds the filter and cards, routes `#p/<slug>` to a detail page, reads `pushed_at` from the GitHub API |
| 4 | `data/projects.json` | Content only. Edit this file to add or update a project |

## Adding a project

Only `data/projects.json` changes. The cards, the tag filter and the detail page (`#p/<slug>`) are built from it, so no HTML or JS needs editing.

1. Open `data/projects.json`.
2. Copy the template below and paste it **before the final `]`**. Put a comma after the `}` of the project above it.
3. Fill in the fields (see the table). Use numbers from the project's own README only.
4. Check the file: `python -m json.tool data/projects.json` prints the file if it is valid, or the line of the first error.
5. Preview: `python -m http.server 8000`, open http://localhost:8000, check the card and click **View details**.
6. Commit and push: `git add data/projects.json` then `git commit -m "feat: add <project> to portfolio"` then `git push`.

`projects.json` is always revalidated by the browser, so no `?v=` bump is needed for it.

### Template

```json
{
  "slug": "uart-controller",
  "title": "UART Controller",
  "icon": "fa-microchip",
  "year": 2026,
  "repo": "Ygbzyem/UART-Controller",
  "tags": ["RTL", "FPGA"],
  "stack": ["Verilog", "Vivado"],
  "summary": "One or two sentences on what it does and what makes it interesting.",
  "specs": [
    ["Fmax", "... MHz"],
    ["Resources", "... LUT · ... FF"],
    ["Verification", "... / ... checks"]
  ],
  "body": [
    ["p", "A paragraph. Inline <code>signal_name</code> is allowed."],
    ["h", "A heading"],
    ["list", ["First point", "Second point"]],
    ["table", "Caption (can be empty)", ["Col A", "Col B"], [["1", "2"], ["3", "4"]]],
    ["note", "A small italic note"]
  ]
}
```

### Fields

| Field | Required | What it is |
|-------|----------|------------|
| `slug` | yes | Unique id used in the link `#p/<slug>`; lowercase letters, digits and `-` |
| `title` | yes | Project name on the card and detail page |
| `icon` | yes | Font Awesome 6 class, e.g. `fa-microchip`, `fa-robot`, `fa-wave-square` ([icon list](https://fontawesome.com/search?ic=free)) |
| `year` | yes | Shown on the card until the GitHub "updated" date loads |
| `repo` | yes | `owner/name` of the GitHub repository |
| `tags` | yes | Filter buttons; reuse existing ones (`RTL`, `FPGA`, `DSP`, `Embedded`, `ML`, `PCB`, `Robotics`) or add a new one |
| `stack` | yes | Tools shown as pills |
| `summary` | yes | 1–2 sentences on the card and under the detail title |
| `specs` | yes | 3–4 `["Label", "Value"]` rows with the key numbers |
| `body` | yes | Detail page blocks: `p`, `h`, `list`, `table`, `note` |
| `team` | no | Small line on the detail page, e.g. `"Team of 5"` |
| `image`, `imageAlt` | no | Path to a picture inside the repo; leave both out for no picture |

Common mistakes: a missing comma between two projects, a comma after the last item of a list, or a `"` inside text (write `\"` instead).

## Run locally

`fetch()` does not work from `file://`, so serve the folder over HTTP:

```
python -m http.server 8000
# open http://localhost:8000
```
