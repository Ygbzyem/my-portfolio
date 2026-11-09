# my-portfolio

Personal portfolio of **Phạm Minh Tùng**, IC Design student at FPT University.
Live at **https://ygbzyem.github.io/my-portfolio/**

Plain HTML, CSS and JavaScript on GitHub Pages: no framework and no build step. Projects are data-driven. Each one is an entry in `data/projects.json` that the page renders as a card and as its own detail page (`#p/<slug>`).

## Repository structure

```
my-portfolio/
├── index.html            # page shell: hero, skills, about, contact
├── style.css             # dark teal theme, aurora/particles background, reveal animations
├── script.js             # clocks, particles, scroll reveal, mobile menu
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
| 2 | `script.js` | Footer clocks, background particles, scroll-reveal, mobile menu |
| 3 | `app.js` | Loads `projects.json`, builds the filter and cards, routes `#p/<slug>` to a detail page, reads `pushed_at` from the GitHub API |
| 4 | `data/projects.json` | Content only. Edit this file to add or update a project |

## Adding a project

Append an object to `data/projects.json`:

```json
{
  "slug": "uart-controller",
  "title": "UART Controller",
  "icon": "fa-microchip",
  "year": 2026,
  "repo": "Ygbzyem/UART-Controller",
  "tags": ["RTL", "FPGA"],
  "stack": ["Verilog", "Vivado"],
  "summary": "One or two sentences on what it does.",
  "specs": [["Fmax", "… MHz"], ["Resources", "… LUT · … FF"], ["Verification", "… / … checks"]],
  "image": "image/Block_Diagram.png",
  "imageAlt": "Block diagram",
  "body": [["p", "Paragraph"], ["h", "Heading"], ["list", ["item"]],
           ["table", "Caption", ["Col A", "Col B"], [["1", "2"]]]]
}
```

`image` is a path inside the project repository, loaded from `raw.githubusercontent.com`. `icon` is a Font Awesome 6 class. Optional field: `team`.

## Run locally

`fetch()` does not work from `file://`, so serve the folder over HTTP:

```
python -m http.server 8000
# open http://localhost:8000
```
