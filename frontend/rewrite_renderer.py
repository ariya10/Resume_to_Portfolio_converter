import re

with open('src/lib/template-renderer.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update renderHero
new_hero = '''function renderHero(data: PortfolioData, opts: CustomizationOptions, editMode: boolean = false): string {
  const img = renderProfileImage(data, opts, "clamp(120px, 15vw, 200px)");
  const editAttr = (field: string) => editMode ? `contenteditable="true" data-field="${field}"` : '';

  const socials = [
    data.linkedin ? { href: data.linkedin, icon: renderSocialIcon("linkedin"), label: "LinkedIn" } : null,
    data.github ? { href: data.github, icon: renderSocialIcon("github"), label: "GitHub" } : null,
    data.website ? { href: data.website, icon: renderSocialIcon("website"), label: "Website" } : null,
  ].filter(Boolean);

  const socialBtns = socials.map(s =>
    `<a href="${s!.href}" target="_blank" class="hover-lift" style="display:inline-flex;align-items:center;gap:10px;padding:12px;border-radius:12px;background:var(--surface);border:1px solid var(--text-secondary)15;color:var(--text);">${s!.icon}</a>`
  ).join("");

  const cta = data.email ? `<a href="mailto:${data.email}" class="hover-lift" style="display:inline-flex;align-items:center;gap:10px;padding:16px 36px;border-radius:14px;background:var(--accent);color:#fff;text-decoration:none;font-weight:700;">Work with me</a>` : "";

  if (opts.layout === "bento-grid") {
    return `
      <section class="portfolio-section" data-section="hero" style="min-height:80vh;display:flex;align-items:center;padding:100px 0;">
        <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:24px;width:100%;">
          <div class="reveal-item" style="grid-column:span 2;padding:60px;background:var(--surface);border-radius:32px;border:1px solid var(--text-secondary)10;display:flex;flex-direction:column;justify-content:center;">
             <div style="display:inline-block;padding:8px 16px;background:var(--accent)10;color:var(--accent);border-radius:100px;font-size:0.8rem;font-weight:800;margin-bottom:24px;align-self:flex-start;">HELLO</div>
             <h1 style="font-family:var(--font-heading);font-weight:var(--font-heading-weight);font-size:clamp(3rem, 6vw, 5rem);line-height:1;margin-bottom:20px;color:var(--text);"><span ${editAttr('name')}>${data.name}</span></h1>
             <p ${editAttr('title')} style="font-size:1.5rem;color:var(--text-secondary);margin-bottom:40px;">${data.title}</p>
             <div style="display:flex;gap:16px;">${cta}</div>
          </div>
          <div class="reveal-item" style="background:var(--surface);border-radius:32px;border:1px solid var(--text-secondary)10;overflow:hidden;position:relative;min-height:300px;">
             ${opts.profileImage || data.profileImage ? `<img src="${opts.profileImage || data.profileImage}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" />` : ''}
          </div>
          <div class="reveal-item" style="padding:32px;background:var(--accent);border-radius:32px;color:#fff;display:flex;flex-direction:column;justify-content:center;">
             <div style="font-size:3rem;font-weight:900;line-height:1;">${data.experience?.length || 0}+</div>
             <div style="font-size:0.9rem;opacity:0.8;font-weight:600;margin-top:8px;">Years Experience</div>
          </div>
          <div class="reveal-item" style="grid-column:span 2;padding:32px;background:var(--surface);border-radius:32px;border:1px solid var(--text-secondary)10;display:flex;align-items:center;gap:16px;">
             ${socialBtns}
          </div>
        </div>
      </section>
    `;
  }

  if (opts.layout === "corporate-executive") {
    return `
      <section class="portfolio-section" data-section="hero" style="min-height:80vh;display:flex;align-items:center;padding:120px 0 60px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;width:100%;">
          <div class="reveal-item">
            <h1 style="font-family:var(--font-heading);font-weight:var(--font-heading-weight);line-height:1.1;margin-bottom:24px;">
              <span style="display:block;font-size:1.2rem;color:var(--accent);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:16px;">Executive Portfolio</span>
              <span ${editAttr('name')} style="font-size:clamp(2.5rem, 5vw, 4rem);color:var(--text);">${data.name}</span>
            </h1>
            <p ${editAttr('title')} style="font-size:1.2rem;color:var(--text-secondary);font-weight:500;margin-bottom:40px;border-left:4px solid var(--accent);padding-left:20px;">${data.title}</p>
            <div style="display:flex;gap:20px;">${cta}${socialBtns}</div>
          </div>
          <div class="reveal-item" style="position:relative;">
             <div style="position:absolute;inset:-20px;border:2px solid var(--text-secondary)20;border-radius:8px;"></div>
             <div style="background:var(--surface);padding:10px;border-radius:8px;box-shadow:var(--shadow-lg);">
                ${opts.profileImage || data.profileImage ? `<img src="${opts.profileImage || data.profileImage}" style="width:100%;height:auto;border-radius:4px;" />` : ''}
             </div>
          </div>
        </div>
      </section>
    `;
  }

  // Default Minimal Editorial
  return `
    <section class="portfolio-section" data-section="hero" style="min-height:90vh;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:100px 0;text-align:center;">
      <div class="reveal-item" style="margin-bottom:48px;">${img}</div>
      <h1 class="reveal-item" style="font-family:var(--font-heading);font-weight:var(--font-heading-weight);font-size:clamp(3.5rem, 10vw, 7.5rem);line-height:0.9;margin-bottom:32px;letter-spacing:-0.03em;">
        <span ${editAttr('name')}>${data.name}</span>
      </h1>
      <p ${editAttr('title')} class="reveal-item" style="font-size:clamp(1.2rem, 3vw, 1.8rem);color:var(--text);font-family:var(--font-heading);max-width:700px;margin:0 auto 48px;line-height:1.3;opacity:0.8;">${data.title}</p>
      <div class="reveal-item" style="display:flex;justify-content:center;align-items:center;gap:32px;flex-wrap:wrap;">
        ${cta}
        <div style="display:flex;gap:16px;">${socialBtns}</div>
      </div>
    </section>
  `;
}'''

content = re.sub(r'function renderHero\(.*?\n\nfunction renderAbout', new_hero + '\n\nfunction renderAbout', content, flags=re.DOTALL)

with open('src/lib/template-renderer.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Hero renderer.")
