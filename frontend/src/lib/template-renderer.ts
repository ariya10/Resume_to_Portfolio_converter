import { PortfolioData, CustomizationOptions } from "./portfolio-templates";

// --- CSS Generator ---
function generateCSS(): string {
  return `
    :root {
      --primary: #111827;
      --secondary: #F9FAFB;
      --accent: #2563EB;
      --background: #FFFFFF;
      --surface: #F3F4F6;
      --text: #111827;
      --text-secondary: #4B5563;
      --font-body: 'Inter', sans-serif;
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: var(--font-body);
      background-color: var(--background);
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    [contenteditable="true"] { outline: none; transition: background 0.2s; }
    [contenteditable="true"]:hover { background: rgba(0,0,0,0.02); border-radius: 4px; }
    [contenteditable="true"]:focus { background: rgba(0,0,0,0.05); box-shadow: 0 0 0 2px var(--accent); border-radius: 4px; }

    /* LAYOUT */
    section {
      padding: 4rem 0;
      border-bottom: 1px solid var(--surface);
    }
    section:last-child {
      border-bottom: none;
    }

    h1, h2, h3 {
      font-weight: 800;
      line-height: 1.2;
    }

    .section-title {
      font-size: 2rem;
      margin-bottom: 2.5rem;
      color: var(--primary);
    }
  `;
}

// --- RENDER HELPERS ---
const editAttr = (field: string, editMode: boolean) => editMode ? `contenteditable="true" data-field="${field}"` : '';

const joinSkills = (skills: string[]) => (skills || []).join(", ");
const joinTechnologies = (tech: string[]) => (tech || []).join(", ");

// --- SECTIONS ---

function renderHero(data: PortfolioData, opts: CustomizationOptions, editMode: boolean): string {
  const img = data.profileImage || opts.profileImage ? `
    <img src="${data.profileImage || opts.profileImage}" alt="Profile" 
         style="width:120px;height:120px;border-radius:50%;object-fit:cover;margin-bottom:1.5rem;"
         ${editMode ? `data-field="profileImage"` : ''} />
  ` : "";

  return `
    <section data-section-id="hero" style="padding-top: 6rem;">
      <div class="container" style="text-align: center;">
        ${img}
        <h1 style="font-size:3.5rem;margin-bottom:1rem;" ${editAttr("name", editMode)}>${data.name}</h1>
        <h2 style="font-size:1.5rem;color:var(--accent);margin-bottom:1.5rem;font-weight:600;" ${editAttr("title", editMode)}>${data.title}</h2>
        <p style="font-size:1.1rem;color:var(--text-secondary);max-width:700px;margin:0 auto;line-height:1.8;" ${editAttr("summary", editMode)}>${data.summary}</p>
        <div style="margin-top:2rem;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
          ${data.email ? `<a href="mailto:${data.email}" style="color:var(--text);text-decoration:none;" ${editAttr("email", editMode)}>${"Email"}</a>` : ''}
          ${data.linkedin ? `<a href="${data.linkedin}" style="color:var(--text);text-decoration:none;" ${editAttr("linkedin", editMode)}>${"LinkedIn"}</a>` : ''}
          ${data.github ? `<a href="${data.github}" style="color:var(--text);text-decoration:none;" ${editAttr("github", editMode)}>${"GitHub"}</a>` : ''}
          ${data.website ? `<a href="${data.website}" style="color:var(--text);text-decoration:none;" ${editAttr("website", editMode)}>${"Website"}</a>` : ''}
        </div>
      </div>
    </section>
  `;
}

function renderExperience(data: PortfolioData, opts: CustomizationOptions, editMode: boolean): string {
  if (!data.experience || !data.experience.length) {
    return `
      <section data-section-id="experience">
        <div class="container">
          <h2 class="section-title">Experience</h2>
          <p style="color:var(--text-secondary);">No experience yet.</p>
        </div>
      </section>
    `;
  }

  const expHTML = data.experience.map((e, idx) => `
    <div style="margin-bottom:2.5rem;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:0.5rem;flex-wrap:wrap;">
        <h3 style="font-size:1.25rem;">
          <span ${editAttr(`experience.${idx}.role`, editMode)}>${e.role}</span>
          <span style="color:var(--accent);">@ </span>
          <span ${editAttr(`experience.${idx}.company`, editMode)}>${e.company}</span>
        </h3>
        <span style="font-size:0.9rem;color:var(--text-secondary);font-weight:600;" ${editAttr(`experience.${idx}.duration`, editMode)}>${e.duration}</span>
      </div>
      <p style="color:var(--text-secondary);" ${editAttr(`experience.${idx}.description`, editMode)}>${e.description}</p>
    </div>
  `).join('');

  return `
    <section data-section-id="experience">
      <div class="container">
        <h2 class="section-title">Experience</h2>
        <div>${expHTML}</div>
      </div>
    </section>
  `;
}

function renderProjects(data: PortfolioData, opts: CustomizationOptions, editMode: boolean): string {
  if (!data.projects || !data.projects.length) {
    return `
      <section data-section-id="projects">
        <div class="container">
          <h2 class="section-title">Projects</h2>
          <p style="color:var(--text-secondary);">No projects yet.</p>
        </div>
      </section>
    `;
  }

  const projHTML = data.projects.map((p, idx) => `
    <div style="background:var(--surface);padding:2rem;border-radius:8px;margin-bottom:1.5rem;">
      <h3 style="font-size:1.25rem;margin-bottom:0.75rem;" ${editAttr(`projects.${idx}.name`, editMode)}>${p.name}</h3>
      <p style="color:var(--text-secondary);margin-bottom:1.5rem;" ${editAttr(`projects.${idx}.description`, editMode)}>${p.description}</p>

      <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;">
        <span style="font-size:0.8rem;padding:0.25rem 0.75rem;background:var(--background);border:1px solid #E5E7EB;border-radius:9999px;font-weight:600;"
              ${editAttr(`projects.${idx}.technologies`, editMode)}
        >
          ${joinTechnologies(p.technologies)}
        </span>

        ${
          p.link
            ? `<a href="${p.link}" style="font-size:0.85rem;color:var(--text);text-decoration:underline;"
                 ${editAttr(`projects.${idx}.link`, editMode)}
               >
                 Link
               </a>`
            : ""
        }
      </div>
    </div>
  `).join('');

  return `
    <section data-section-id="projects">
      <div class="container">
        <h2 class="section-title">Projects</h2>
        <div style="display:grid;grid-template-columns:1fr;gap:1.5rem;">
          ${projHTML}
        </div>
      </div>
    </section>
  `;
}

function renderSkills(data: PortfolioData, opts: CustomizationOptions, editMode: boolean): string {
  const skills = data.skills || [];
  if (!skills.length) {
    return `
      <section data-section-id="skills">
        <div class="container">
          <h2 class="section-title">Skills</h2>
          <p style="color:var(--text-secondary);">No skills yet.</p>
        </div>
      </section>
    `;
  }

  return `
    <section data-section-id="skills">
      <div class="container">
        <h2 class="section-title">Skills</h2>
        <div style="display:flex;flex-wrap:wrap;gap:0.75rem;">
          <span style="font-size:0.95rem;padding:0.5rem 1rem;background:var(--surface);color:var(--text);border-radius:6px;font-weight:600;"
                ${editAttr("skills", editMode)}
          >
            ${joinSkills(skills)}
          </span>
        </div>
      </div>
    </section>
  `;
}

function renderEducation(data: PortfolioData, opts: CustomizationOptions, editMode: boolean): string {
  const education = data.education || [];
  if (!education.length) {
    return `
      <section data-section-id="education">
        <div class="container">
          <h2 class="section-title">Education</h2>
          <p style="color:var(--text-secondary);">No education yet.</p>
        </div>
      </section>
    `;
  }

  const eduHTML = education.map((e, idx) => `
    <div style="margin-bottom:2.5rem;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:0.5rem;flex-wrap:wrap;">
        <h3 style="font-size:1.25rem;">
          <span ${editAttr(`education.${idx}.degree`, editMode)}>${e.degree}</span>
          <span style="color:var(--accent);"> · </span>
          <span ${editAttr(`education.${idx}.institution`, editMode)}>${e.institution}</span>
        </h3>
        <span style="font-size:0.9rem;color:var(--text-secondary);font-weight:600;" ${editAttr(`education.${idx}.duration`, editMode)}>${e.duration}</span>
      </div>

      <div style="color:var(--text-secondary);font-weight:700;font-size:0.95rem;margin-bottom:0.5rem;">
        <span style="color:var(--text-secondary);">GPA: </span>
        <span ${editAttr(`education.${idx}.gpa`, editMode)}>${e.gpa}</span>
      </div>
    </div>
  `).join("");

  return `
    <section data-section-id="education">
      <div class="container">
        <h2 class="section-title">Education</h2>
        <div>${eduHTML}</div>
      </div>
    </section>
  `;
}

function renderContact(data: PortfolioData, opts: CustomizationOptions, editMode: boolean): string {
  return `
    <section data-section-id="contact" style="text-align:center;padding-bottom:6rem;">
      <div class="container">
        <h2 class="section-title" style="margin-bottom:1rem;">Get in Touch</h2>
        <p style="color:var(--text-secondary);margin-bottom:2.5rem;font-size:1.1rem;" ${editAttr("bio", editMode)}>${data.bio}</p>

        ${
          data.email
            ? `<a href="mailto:${data.email}" style="display:inline-block;padding:1rem 2.5rem;background:var(--text);color:var(--background);text-decoration:none;border-radius:9999px;font-weight:bold;font-size:1rem;transition:opacity 0.2s;"
                  ${editAttr("email", editMode)}
              >Say Hello</a>`
            : `<div style="color:var(--text-secondary);font-size:1rem;">Add an email in your contact details.</div>`
        }
      </div>
    </section>
  `;
}

// --- MAIN GENERATOR ---
export function generatePortfolioHTML(
  data: PortfolioData,
  opts: CustomizationOptions,
  editMode: boolean = false
): string {
  const visibleSections = opts.sectionInstances.filter((s) => s.visible).map((s) => s.type);

  const sectionsHTML = visibleSections
    .map((type) => {
      switch (type) {
        case "hero":
          return renderHero(data, opts, editMode);
        case "experience":
          return renderExperience(data, opts, editMode);
        case "projects":
          return renderProjects(data, opts, editMode);
        case "skills":
          return renderSkills(data, opts, editMode);
        case "education":
          return renderEducation(data, opts, editMode);
        case "contact":
          return renderContact(data, opts, editMode);
        default:
          return "";
      }
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} - Portfolio</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
    ${generateCSS()}
  </style>
</head>
<body>
  ${sectionsHTML}
  ${
    editMode
      ? `<script>
    // Prevent links from navigating during edit mode
    document.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', e => e.preventDefault());
    });
  </script>`
      : ""
  }
</body>
</html>`;
}
