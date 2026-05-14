"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePortfolioHTML = generatePortfolioHTML;
var getInlineStyles = function (elementId, opts) {
    if (!opts.elementStyles || !opts.elementStyles[elementId])
        return "";
    return Object.entries(opts.elementStyles[elementId])
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        return "".concat(key, ":").concat(value);
    })
        .join(";");
};
// --- CSS Generator ---
function generateCSS(opts) {
    var c = opts.colors;
    var f = opts.fonts;
    var v = opts.visualStyle;
    return "\n    :root {\n      --primary: ".concat(c.primary, ";\n      --secondary: ").concat(c.secondary, ";\n      --accent: ").concat(c.accent, ";\n      --background: ").concat(c.background, ";\n      --surface: ").concat(c.surface, ";\n      --text: ").concat(c.text, ";\n      --text-secondary: ").concat(c.textSecondary, ";\n      --font-heading: ").concat(f.heading, ";\n      --font-heading-weight: ").concat(f.headingWeight, ";\n      --font-body: ").concat(f.body, ";\n      --font-body-weight: ").concat(f.bodyWeight, ";\n      --font-mono: ").concat(f.mono, ";\n      \n      ").concat(v.glassmorphism ? "\n        --glass-bg: rgba(255,255,255,".concat(v.glassOpacity, ");\n        --glass-border: rgba(255,255,255,0.1);\n        --glass-blur: blur(").concat(v.glassBlur, "px);\n      ") : "\n        --glass-bg: var(--surface);\n        --glass-border: transparent;\n        --glass-blur: none;\n      ", "\n    }\n    \n    * { box-sizing: border-box; margin: 0; padding: 0; }\n    \n    body {\n      font-family: var(--font-body);\n      font-weight: var(--font-body-weight);\n      background-color: var(--background);\n      color: var(--text);\n      line-height: 1.6;\n      overflow-x: hidden;\n      scroll-behavior: smooth;\n    }\n\n    [contenteditable=\"true\"] { outline: none; transition: background 0.2s; }\n    [contenteditable=\"true\"]:hover { background: rgba(255,255,255,0.05); border-radius: 4px; }\n    [contenteditable=\"true\"]:focus { background: rgba(255,255,255,0.1); box-shadow: 0 0 0 2px var(--accent); border-radius: 4px; }\n\n    /* ---- 1. CINEMATIC PARALLAX ---- */\n    .cinematic-hero {\n      height: 100vh;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      position: sticky;\n      top: 0;\n      z-index: 1;\n      text-align: center;\n      background: linear-gradient(").concat(v.gradientAngle, "deg, var(--background), var(--surface));\n    }\n    .cinematic-mask-text {\n      font-family: var(--font-heading);\n      font-size: clamp(3rem, 10vw, 10rem);\n      font-weight: 900;\n      background: linear-gradient(45deg, var(--text), var(--accent));\n      -webkit-background-clip: text;\n      -webkit-text-fill-color: transparent;\n      line-height: 1;\n      text-transform: uppercase;\n      letter-spacing: -0.05em;\n    }\n    .cinematic-content {\n      position: relative;\n      z-index: 2;\n      background: var(--background);\n      padding: 100px 5%;\n      border-top: 1px solid rgba(255,255,255,0.1);\n      box-shadow: 0 -20px 50px rgba(0,0,0,0.8);\n    }\n    \n    /* ---- 2. BENTO GRID INTERACTIVE ---- */\n    .bento-container {\n      display: grid;\n      grid-template-columns: repeat(12, 1fr);\n      grid-auto-rows: minmax(180px, auto);\n      gap: 20px;\n      padding: 40px;\n      max-width: 1400px;\n      margin: 0 auto;\n    }\n    .bento-card {\n      background: var(--surface);\n      border: 1px solid rgba(255,255,255,0.05);\n      border-radius: 24px;\n      padding: 30px;\n      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n      overflow: hidden;\n      position: relative;\n    }\n    .bento-card:hover {\n      transform: translateY(-5px);\n      border-color: var(--accent);\n      box-shadow: 0 20px 40px rgba(0,0,0,0.4);\n    }\n    \n    /* ---- 3. IMMERSIVE GLASS ---- */\n    .glass-body {\n      background: linear-gradient(135deg, var(--background), var(--surface));\n      background-attachment: fixed;\n    }\n    .glass-card {\n      background: var(--glass-bg);\n      backdrop-filter: var(--glass-blur);\n      -webkit-backdrop-filter: var(--glass-blur);\n      border: 1px solid var(--glass-border);\n      border-radius: 32px;\n      padding: 60px;\n      margin: 60px auto;\n      max-width: 1000px;\n      box-shadow: 0 20px 40px rgba(0,0,0,0.2);\n    }\n    \n    /* ---- 4. EDITORIAL ASYMMETRY ---- */\n    .editorial-container {\n      max-width: 1200px;\n      margin: 0 auto;\n      padding: 100px 5%;\n    }\n    .editorial-title {\n      font-family: var(--font-heading);\n      font-size: clamp(3rem, 8vw, 8rem);\n      font-weight: 300;\n      line-height: 0.9;\n      font-style: italic;\n    }\n    .editorial-card {\n      border-top: 2px solid var(--text);\n      padding-top: 40px;\n      margin-left: 20%;\n      margin-bottom: 120px;\n    }\n\n    /* ---- 5. BRUTALIST NEO ---- */\n    .brutalist-card {\n      background: var(--surface);\n      border: 4px solid var(--text);\n      box-shadow: 12px 12px 0px var(--accent);\n      padding: 50px;\n      margin: 80px auto;\n      max-width: 900px;\n      transition: all 0.2s;\n    }\n    .brutalist-card:hover {\n      transform: translate(4px, 4px);\n      box-shadow: 8px 8px 0px var(--accent);\n    }\n    .marquee {\n      width: 100%;\n      overflow: hidden;\n      white-space: nowrap;\n      background: var(--accent);\n      color: var(--background);\n      border-top: 4px solid var(--text);\n      border-bottom: 4px solid var(--text);\n      padding: 15px 0;\n      font-family: var(--font-heading);\n      font-weight: 900;\n      font-size: 2.5rem;\n      text-transform: uppercase;\n      margin: 60px 0;\n    }\n    .marquee span {\n      display: inline-block;\n      padding-left: 100%;\n      animation: marquee 15s linear infinite;\n    }\n    @keyframes marquee { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }\n  ");
}
// --- RENDER HELPERS ---
var editAttr = function (field, editMode) { return editMode ? "contenteditable=\"true\" data-field=\"".concat(field, "\"") : ''; };
// --- SECTIONS ---
function renderHero(data, opts, editMode) {
    var layout = opts.layout;
    var isBento = layout === "bento-grid-interactive";
    var isGlass = layout === "immersive-glass";
    var isEditorial = layout === "editorial-asymmetry";
    var isBrutalist = layout === "brutalist-neo";
    var isCinematic = layout === "cinematic-parallax";
    var img = data.profileImage || opts.profileImage ? "\n    <img src=\"".concat(data.profileImage || opts.profileImage, "\" alt=\"Profile\" \n         style=\"width:140px;height:140px;border-radius:").concat(opts.imageShape === 'circle' ? '50%' : '16px', ";object-fit:cover;border:2px solid var(--accent);margin-bottom:20px;\"\n         ").concat(editMode ? "data-field=\"profileImage\" data-resizable=\"true\"" : '', " />\n  ") : "";
    if (isCinematic) {
        return "\n      <section class=\"cinematic-hero\" data-section-id=\"hero\">\n        ".concat(img, "\n        <h1 class=\"cinematic-mask-text\" ").concat(editAttr("name", editMode), ">").concat(data.name, "</h1>\n        <p style=\"font-size:1.5rem;color:var(--text-secondary);margin-top:20px;\" ").concat(editAttr("title", editMode), ">").concat(data.title, "</p>\n      </section>\n    ");
    }
    if (isBento) {
        return "\n      <div class=\"bento-card\" style=\"grid-column: span 12; grid-row: span 2; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;\" data-section-id=\"hero\">\n        ".concat(img, "\n        <h1 style=\"font-size:4rem;font-family:var(--font-heading);font-weight:900;\" ").concat(editAttr("name", editMode), ">").concat(data.name, "</h1>\n        <p style=\"font-size:1.5rem;color:var(--accent);font-family:var(--font-mono);\" ").concat(editAttr("title", editMode), ">").concat(data.title, "</p>\n        <p style=\"max-width:600px;margin-top:20px;color:var(--text-secondary);\" ").concat(editAttr("summary", editMode), ">").concat(data.summary, "</p>\n      </div>\n    ");
    }
    if (isGlass) {
        return "\n      <section class=\"glass-card\" style=\"text-align:center;\" data-section-id=\"hero\">\n        ".concat(img, "\n        <h1 style=\"font-size:4.5rem;font-weight:800;letter-spacing:-0.03em;\" ").concat(editAttr("name", editMode), ">").concat(data.name, "</h1>\n        <h2 style=\"font-size:2rem;color:var(--accent);font-weight:300;\" ").concat(editAttr("title", editMode), ">").concat(data.title, "</h2>\n        <p style=\"font-size:1.2rem;color:var(--text-secondary);margin-top:30px;line-height:1.8;\" ").concat(editAttr("summary", editMode), ">").concat(data.summary, "</p>\n      </section>\n    ");
    }
    if (isEditorial) {
        return "\n      <section class=\"editorial-container\" data-section-id=\"hero\">\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;\">\n          <div>\n            <h1 class=\"editorial-title\" ".concat(editAttr("name", editMode), ">").concat(data.name, "</h1>\n            <h2 style=\"font-size:2rem;margin-top:20px;color:var(--text-secondary);\" ").concat(editAttr("title", editMode), ">").concat(data.title, "</h2>\n          </div>\n          <div>\n            ").concat(img, "\n            <p style=\"font-size:1.2rem;line-height:1.8;border-left:1px solid var(--text);padding-left:20px;margin-top:40px;\" ").concat(editAttr("summary", editMode), ">").concat(data.summary, "</p>\n          </div>\n        </div>\n      </section>\n    ");
    }
    if (isBrutalist) {
        return "\n      <section data-section-id=\"hero\">\n        <div class=\"marquee\"><span>".concat(data.name, " * ").concat(data.title, " * ").concat(data.name, " * ").concat(data.title, "</span></div>\n        <div class=\"brutalist-card\">\n          ").concat(img, "\n          <h1 style=\"font-size:5rem;text-transform:uppercase;line-height:0.9;\" ").concat(editAttr("name", editMode), ">").concat(data.name, "</h1>\n          <h2 style=\"font-size:2rem;color:var(--accent);margin:20px 0;background:var(--text);color:var(--background);display:inline-block;padding:5px 15px;\" ").concat(editAttr("title", editMode), ">").concat(data.title, "</h2>\n          <p style=\"font-size:1.5rem;font-weight:bold;\" ").concat(editAttr("summary", editMode), ">").concat(data.summary, "</p>\n        </div>\n      </section>\n    ");
    }
    return "";
}
function renderExperience(data, opts, editMode) {
    if (!data.experience.length)
        return "";
    var layout = opts.layout;
    var isBento = layout === "bento-grid-interactive";
    var isGlass = layout === "immersive-glass";
    var isEditorial = layout === "editorial-asymmetry";
    var isBrutalist = layout === "brutalist-neo";
    var expHTML = data.experience.map(function (e) { return "\n    <div style=\"margin-bottom:30px;padding-bottom:30px;border-bottom:1px solid rgba(255,255,255,0.1);\">\n      <div style=\"display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;\">\n        <h3 style=\"font-size:1.5rem;font-weight:bold;\">".concat(e.role, " <span style=\"color:var(--accent);\">@ ").concat(e.company, "</span></h3>\n        <span style=\"font-family:var(--font-mono);font-size:0.9rem;color:var(--text-secondary);\">").concat(e.duration, "</span>\n      </div>\n      <p style=\"margin:10px 0;color:var(--text-secondary);\">").concat(e.description, "</p>\n    </div>\n  "); }).join('');
    if (layout === "cinematic-parallax") {
        return "\n      <section class=\"cinematic-content\" data-section-id=\"experience\">\n        <h2 style=\"font-size:3rem;margin-bottom:40px;font-family:var(--font-heading);\">Experience</h2>\n        <div style=\"max-width:800px;margin:0 auto;\">".concat(expHTML, "</div>\n      </section>\n    ");
    }
    if (isBento) {
        return "\n      <div class=\"bento-card\" style=\"grid-column: span 8; grid-row: span 2;\" data-section-id=\"experience\">\n        <h2 style=\"font-size:2rem;margin-bottom:30px;\">Experience</h2>\n        <div style=\"max-height:400px;overflow-y:auto;padding-right:20px;\">".concat(expHTML, "</div>\n      </div>\n    ");
    }
    if (isGlass) {
        return "\n      <section class=\"glass-card\" data-section-id=\"experience\">\n        <h2 style=\"font-size:2.5rem;margin-bottom:40px;text-align:center;\">Experience</h2>\n        ".concat(expHTML, "\n      </section>\n    ");
    }
    if (isEditorial) {
        return "\n      <section class=\"editorial-container\" data-section-id=\"experience\">\n        <div class=\"editorial-card\">\n          <h2 style=\"font-size:3rem;margin-bottom:40px;font-style:italic;\">Experience</h2>\n          ".concat(expHTML, "\n        </div>\n      </section>\n    ");
    }
    if (isBrutalist) {
        return "\n      <section class=\"brutalist-card\" data-section-id=\"experience\">\n        <h2 style=\"font-size:4rem;text-transform:uppercase;border-bottom:4px solid var(--text);padding-bottom:10px;margin-bottom:40px;\">Experience</h2>\n        ".concat(expHTML, "\n      </section>\n    ");
    }
    return "";
}
function renderProjects(data, opts, editMode) {
    if (!data.projects.length)
        return "";
    var layout = opts.layout;
    var isBento = layout === "bento-grid-interactive";
    var isGlass = layout === "immersive-glass";
    var isEditorial = layout === "editorial-asymmetry";
    var isBrutalist = layout === "brutalist-neo";
    var projHTML = data.projects.map(function (p) { return "\n    <div style=\"background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.1);padding:30px;border-radius:16px;\">\n      <h3 style=\"font-size:1.5rem;font-weight:bold;margin-bottom:10px;\">".concat(p.name, "</h3>\n      <p style=\"color:var(--text-secondary);margin-bottom:20px;\">").concat(p.description, "</p>\n      <div style=\"display:flex;gap:10px;flex-wrap:wrap;\">\n        ").concat(p.technologies.map(function (t) { return "<span style=\"font-size:0.8rem;padding:4px 10px;background:var(--accent);color:var(--background);border-radius:20px;font-weight:bold;\">".concat(t, "</span>"); }).join(''), "\n      </div>\n    </div>\n  "); }).join('');
    if (layout === "cinematic-parallax") {
        return "\n      <section class=\"cinematic-content\" style=\"padding-top:0;\" data-section-id=\"projects\">\n        <h2 style=\"font-size:3rem;margin-bottom:40px;text-align:center;\">Selected Work</h2>\n        <div style=\"display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:30px;max-width:1200px;margin:0 auto;\">".concat(projHTML, "</div>\n      </section>\n    ");
    }
    if (isBento) {
        return "\n      <div class=\"bento-card\" style=\"grid-column: span 12; grid-row: span 2;\" data-section-id=\"projects\">\n        <h2 style=\"font-size:2rem;margin-bottom:30px;\">Projects</h2>\n        <div style=\"display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;\">".concat(projHTML, "</div>\n      </div>\n    ");
    }
    if (isGlass) {
        return "\n      <section class=\"glass-card\" data-section-id=\"projects\">\n        <h2 style=\"font-size:2.5rem;margin-bottom:40px;text-align:center;\">Projects</h2>\n        <div style=\"display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:30px;\">".concat(projHTML, "</div>\n      </section>\n    ");
    }
    if (isEditorial) {
        return "\n      <section class=\"editorial-container\" style=\"padding-top:0;\" data-section-id=\"projects\">\n        <div class=\"editorial-card\">\n          <h2 style=\"font-size:3rem;margin-bottom:40px;font-style:italic;\">Selected Works</h2>\n          <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:40px;\">".concat(projHTML, "</div>\n        </div>\n      </section>\n    ");
    }
    if (isBrutalist) {
        return "\n      <section class=\"brutalist-card\" data-section-id=\"projects\">\n        <h2 style=\"font-size:4rem;text-transform:uppercase;border-bottom:4px solid var(--text);padding-bottom:10px;margin-bottom:40px;\">Projects</h2>\n        <div style=\"display:grid;gap:30px;\">".concat(projHTML, "</div>\n      </section>\n    ");
    }
    return "";
}
function renderSkills(data, opts, editMode) {
    if (!data.skills.length)
        return "";
    var layout = opts.layout;
    var isBento = layout === "bento-grid-interactive";
    var skillPills = data.skills.map(function (s) { return "<span style=\"display:inline-block;padding:8px 16px;border:1px solid var(--text);border-radius:30px;margin:5px;font-family:var(--font-mono);font-size:0.9rem;\">".concat(s, "</span>"); }).join('');
    if (isBento) {
        return "\n      <div class=\"bento-card\" style=\"grid-column: span 4; grid-row: span 2;\" data-section-id=\"skills\">\n        <h2 style=\"font-size:2rem;margin-bottom:20px;\">Skills</h2>\n        <div>".concat(skillPills, "</div>\n      </div>\n    ");
    }
    return "\n    <section style=\"max-width:1000px;margin:60px auto;text-align:center;\" data-section-id=\"skills\">\n      <h2 style=\"font-size:2rem;margin-bottom:30px;\">Skills</h2>\n      <div>".concat(skillPills, "</div>\n    </section>\n  ");
}
function renderContact(data, opts, editMode) {
    var isBento = opts.layout === "bento-grid-interactive";
    var content = "\n    <h2 style=\"font-size:3rem;margin-bottom:20px;\">Let's Connect</h2>\n    <p style=\"font-size:1.2rem;color:var(--text-secondary);margin-bottom:30px;\">Open for opportunities and collaborations.</p>\n    <a href=\"mailto:".concat(data.email, "\" style=\"display:inline-block;padding:15px 40px;background:var(--accent);color:var(--background);text-decoration:none;font-weight:bold;font-size:1.2rem;border-radius:30px;\">Email Me</a>\n  ");
    if (isBento) {
        return "\n      <div class=\"bento-card\" style=\"grid-column: span 12; text-align:center; padding:60px;\" data-section-id=\"contact\">\n        ".concat(content, "\n      </div>\n    ");
    }
    return "\n    <section style=\"text-align:center;padding:100px 5%;background:var(--surface);\" data-section-id=\"contact\">\n      ".concat(content, "\n    </section>\n  ");
}
// --- MAIN GENERATOR ---
function generatePortfolioHTML(data, opts, editMode) {
    if (editMode === void 0) { editMode = false; }
    var visibleSections = opts.sectionInstances.filter(function (s) { return s.visible; }).map(function (s) { return s.type; });
    var sectionsHTML = visibleSections.map(function (type) {
        switch (type) {
            case "hero": return renderHero(data, opts, editMode);
            case "experience": return renderExperience(data, opts, editMode);
            case "projects": return renderProjects(data, opts, editMode);
            case "skills": return renderSkills(data, opts, editMode);
            case "contact": return renderContact(data, opts, editMode);
            default: return "";
        }
    }).join("\n");
    var bodyClass = opts.layout === "cinematic-parallax" ? "cinematic-body" :
        opts.layout === "immersive-glass" ? "glass-body" :
            opts.layout === "brutalist-neo" ? "brutalist-body" : "";
    var layoutWrapperStart = opts.layout === "bento-grid-interactive" ? '<div class="bento-container">' :
        opts.layout === "cinematic-parallax" ? '<div class="cinematic-wrapper">' : '';
    var layoutWrapperEnd = opts.layout === "bento-grid-interactive" ? '</div>' :
        opts.layout === "cinematic-parallax" ? '</div>' : '';
    return "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>".concat(data.name, " - Portfolio</title>\n  <style>\n    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Outfit:wght@400;700;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Space+Grotesk:wght@400;700&family=Space+Mono:wght@400;700&family=JetBrains+Mono:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap');\n    ").concat(generateCSS(opts), "\n  </style>\n</head>\n<body class=\"").concat(bodyClass, "\">\n  ").concat(layoutWrapperStart, "\n  ").concat(sectionsHTML, "\n  ").concat(layoutWrapperEnd, "\n  ").concat(editMode ? "<script>\n    // Prevent links from navigating during edit mode\n    document.querySelectorAll('a').forEach(a => {\n      a.addEventListener('click', e => e.preventDefault());\n    });\n  </script>" : '', "\n</body>\n</html>");
}
