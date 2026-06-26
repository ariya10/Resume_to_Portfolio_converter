import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";

// Helper to convert hex to RGB object for Figma API
function hexToRgbCode(hex: string): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return `{ r: ${r.toFixed(3)}, g: ${g.toFixed(3)}, b: ${b.toFixed(3)} }`;
}

export function generateFigmaScript(data: PortfolioData, customization: CustomizationOptions): string {
  const colors = customization.colors;
  const primaryColor = colors.primary || '#3b82f6';
  const secondaryColor = colors.secondary || '#1e293b';
  const accentColor = colors.accent || '#60a5fa';
  const bgColor = colors.background || '#0f172a';
  const textColor = colors.text || '#ffffff';
  const surfaceColor = colors.surface || '#1e293b';

  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  // Generate dynamic blocks for sections
  let sectionScripts = '';

  visibleSections.forEach(section => {
    switch (section) {
      case 'hero':
        sectionScripts += `
    // --- Hero Section ---
    const heroFrame = figma.createFrame();
    heroFrame.name = "Hero Section";
    heroFrame.layoutMode = "VERTICAL";
    heroFrame.primaryAxisSizingMode = "AUTO";
    heroFrame.counterAxisSizingMode = "AUTO";
    heroFrame.layoutAlign = "STRETCH";
    heroFrame.itemSpacing = 24;
    heroFrame.fills = [];
    heroFrame.paddingTop = 60;
    heroFrame.paddingBottom = 60;

    // Greeting
    const greetText = figma.createText();
    greetText.fontName = { family: "Inter", style: "Medium" };
    greetText.characters = "Hello, I'm";
    greetText.fontSize = 24;
    greetText.fills = [{ type: 'SOLID', color: ${hexToRgbCode(primaryColor)} }];
    heroFrame.appendChild(greetText);

    // Name
    const nameText = figma.createText();
    nameText.fontName = { family: "Inter", style: "Bold" };
    nameText.characters = ${JSON.stringify(data.name)};
    nameText.fontSize = 72;
    nameText.fills = [{ type: 'SOLID', color: ${hexToRgbCode(textColor)} }];
    heroFrame.appendChild(nameText);

    // Title
    const titleText = figma.createText();
    titleText.fontName = { family: "Inter", style: "SemiBold" };
    titleText.characters = ${JSON.stringify(data.title)};
    titleText.fontSize = 32;
    titleText.fills = [{ type: 'SOLID', color: ${hexToRgbCode(accentColor)} }];
    heroFrame.appendChild(titleText);

    // Summary
    const summaryText = figma.createText();
    summaryText.fontName = { family: "Inter", style: "Regular" };
    summaryText.characters = ${JSON.stringify(data.summary || '')};
    summaryText.fontSize = 16;
    summaryText.fills = [{ type: 'SOLID', color: ${hexToRgbCode(textColor)}, opacity: 0.8 }];
    summaryText.layoutAlign = "STRETCH";
    heroFrame.appendChild(summaryText);

    parentFrame.appendChild(heroFrame);
    `;
        break;

      case 'skills':
        if (!data.skills || data.skills.length === 0) break;
        sectionScripts += `
    // --- Skills Section ---
    const skillsFrame = figma.createFrame();
    skillsFrame.name = "Skills Section";
    skillsFrame.layoutMode = "VERTICAL";
    skillsFrame.primaryAxisSizingMode = "AUTO";
    skillsFrame.counterAxisSizingMode = "AUTO";
    skillsFrame.layoutAlign = "STRETCH";
    skillsFrame.itemSpacing = 24;
    skillsFrame.fills = [];

    const skillsTitle = figma.createText();
    skillsTitle.fontName = { family: "Inter", style: "Bold" };
    skillsTitle.characters = "Core Skills & Expertise";
    skillsTitle.fontSize = 28;
    skillsTitle.fills = [{ type: 'SOLID', color: ${hexToRgbCode(primaryColor)} }];
    skillsFrame.appendChild(skillsTitle);

    const skillsGrid = figma.createFrame();
    skillsGrid.name = "Skills Grid";
    skillsGrid.layoutMode = "HORIZONTAL";
    skillsGrid.primaryAxisSizingMode = "AUTO";
    skillsGrid.counterAxisSizingMode = "AUTO";
    skillsGrid.layoutAlign = "STRETCH";
    skillsGrid.itemSpacing = 16;
    skillsGrid.fills = [];
    
    // Add up to 8 skills as tags
    const skillsList = ${JSON.stringify(data.skills.slice(0, 8))};
    for (const skill of skillsList) {
      const tag = figma.createFrame();
      tag.name = "Tag: " + skill;
      tag.layoutMode = "HORIZONTAL";
      tag.primaryAxisSizingMode = "AUTO";
      tag.counterAxisSizingMode = "AUTO";
      tag.paddingTop = 8;
      tag.paddingBottom = 8;
      tag.paddingLeft = 16;
      tag.paddingRight = 16;
      tag.cornerRadius = 8;
      tag.fills = [{ type: 'SOLID', color: ${hexToRgbCode(surfaceColor)} }];
      tag.strokes = [{ type: 'SOLID', color: ${hexToRgbCode(primaryColor)}, opacity: 0.3 }];
      tag.strokeWeight = 1;

      const tagText = figma.createText();
      tagText.fontName = { family: "Inter", style: "Medium" };
      tagText.characters = skill;
      tagText.fontSize = 14;
      tagText.fills = [{ type: 'SOLID', color: ${hexToRgbCode(textColor)} }];
      tag.appendChild(tagText);
      skillsGrid.appendChild(tag);
    }
    skillsFrame.appendChild(skillsGrid);
    parentFrame.appendChild(skillsFrame);
    `;
        break;

      case 'projects':
        if (!data.projects || data.projects.length === 0) break;
        sectionScripts += `
    // --- Projects Section ---
    const projectsFrame = figma.createFrame();
    projectsFrame.name = "Projects Section";
    projectsFrame.layoutMode = "VERTICAL";
    projectsFrame.primaryAxisSizingMode = "AUTO";
    projectsFrame.counterAxisSizingMode = "AUTO";
    projectsFrame.layoutAlign = "STRETCH";
    projectsFrame.itemSpacing = 32;
    projectsFrame.fills = [];

    const projectsTitle = figma.createText();
    projectsTitle.fontName = { family: "Inter", style: "Bold" };
    projectsTitle.characters = "Selected Projects";
    projectsTitle.fontSize = 28;
    projectsTitle.fills = [{ type: 'SOLID', color: ${hexToRgbCode(primaryColor)} }];
    projectsFrame.appendChild(projectsTitle);

    const projectsList = figma.createFrame();
    projectsList.name = "Projects Grid";
    projectsList.layoutMode = "HORIZONTAL";
    projectsList.primaryAxisSizingMode = "AUTO";
    projectsList.counterAxisSizingMode = "AUTO";
    projectsList.layoutAlign = "STRETCH";
    projectsList.itemSpacing = 24;
    projectsList.fills = [];

    const rawProjects = ${JSON.stringify(data.projects.slice(0, 3))};
    for (const proj of rawProjects) {
      const card = figma.createFrame();
      card.name = "Project: " + proj.name;
      card.layoutMode = "VERTICAL";
      card.primaryAxisSizingMode = "AUTO";
      card.counterAxisSizingMode = "FIXED";
      card.resize(360, 240);
      card.paddingTop = 24;
      card.paddingBottom = 24;
      card.paddingLeft = 24;
      card.paddingRight = 24;
      card.cornerRadius = 16;
      card.fills = [{ type: 'SOLID', color: ${hexToRgbCode(surfaceColor)} }];
      card.strokes = [{ type: 'SOLID', color: ${hexToRgbCode(accentColor)}, opacity: 0.1 }];
      card.strokeWeight = 1;

      const pTitle = figma.createText();
      pTitle.fontName = { family: "Inter", style: "Bold" };
      pTitle.characters = proj.name;
      pTitle.fontSize = 20;
      pTitle.fills = [{ type: 'SOLID', color: ${hexToRgbCode(textColor)} }];
      card.appendChild(pTitle);

      const pDesc = figma.createText();
      pDesc.fontName = { family: "Inter", style: "Regular" };
      pDesc.characters = proj.description;
      pDesc.fontSize = 13;
      pDesc.fills = [{ type: 'SOLID', color: ${hexToRgbCode(textColor)}, opacity: 0.7 }];
      pDesc.layoutAlign = "STRETCH";
      card.appendChild(pDesc);

      projectsList.appendChild(card);
    }
    projectsFrame.appendChild(projectsList);
    parentFrame.appendChild(projectsFrame);
    `;
        break;

      case 'experience':
        if (!data.experience || data.experience.length === 0) break;
        sectionScripts += `
    // --- Experience Section ---
    const expFrame = figma.createFrame();
    expFrame.name = "Experience Section";
    expFrame.layoutMode = "VERTICAL";
    expFrame.primaryAxisSizingMode = "AUTO";
    expFrame.counterAxisSizingMode = "AUTO";
    expFrame.layoutAlign = "STRETCH";
    expFrame.itemSpacing = 24;
    expFrame.fills = [];

    const expTitle = figma.createText();
    expTitle.fontName = { family: "Inter", style: "Bold" };
    expTitle.characters = "Work History";
    expTitle.fontSize = 28;
    expTitle.fills = [{ type: 'SOLID', color: ${hexToRgbCode(primaryColor)} }];
    expFrame.appendChild(expTitle);

    const rawExperience = ${JSON.stringify(data.experience.slice(0, 3))};
    for (const exp of rawExperience) {
      const expRow = figma.createFrame();
      expRow.name = "Job: " + exp.company;
      expRow.layoutMode = "VERTICAL";
      expRow.primaryAxisSizingMode = "AUTO";
      expRow.counterAxisSizingMode = "AUTO";
      expRow.layoutAlign = "STRETCH";
      expRow.itemSpacing = 8;
      expRow.paddingTop = 16;
      expRow.paddingBottom = 16;
      expRow.fills = [];

      const jobHeader = figma.createText();
      jobHeader.fontName = { family: "Inter", style: "Bold" };
      jobHeader.characters = exp.role + " @ " + exp.company;
      jobHeader.fontSize = 18;
      jobHeader.fills = [{ type: 'SOLID', color: ${hexToRgbCode(textColor)} }];
      expRow.appendChild(jobHeader);

      const jobDuration = figma.createText();
      jobDuration.fontName = { family: "Inter", style: "Medium" };
      jobDuration.characters = exp.duration;
      jobDuration.fontSize = 12;
      jobDuration.fills = [{ type: 'SOLID', color: ${hexToRgbCode(primaryColor)} }];
      expRow.appendChild(jobDuration);

      const jobDesc = figma.createText();
      jobDesc.fontName = { family: "Inter", style: "Regular" };
      jobDesc.characters = exp.description;
      jobDesc.fontSize = 14;
      jobDesc.fills = [{ type: 'SOLID', color: ${hexToRgbCode(textColor)}, opacity: 0.8 }];
      jobDesc.layoutAlign = "STRETCH";
      expRow.appendChild(jobDesc);

      expFrame.appendChild(expRow);
    }
    parentFrame.appendChild(expFrame);
    `;
        break;

      case 'contact':
        sectionScripts += `
    // --- Contact Section ---
    const contactFrame = figma.createFrame();
    contactFrame.name = "Contact Section";
    contactFrame.layoutMode = "VERTICAL";
    contactFrame.primaryAxisSizingMode = "AUTO";
    contactFrame.counterAxisSizingMode = "AUTO";
    contactFrame.layoutAlign = "STRETCH";
    contactFrame.itemSpacing = 16;
    contactFrame.fills = [{ type: 'SOLID', color: ${hexToRgbCode(surfaceColor)} }];
    contactFrame.paddingTop = 40;
    contactFrame.paddingBottom = 40;
    contactFrame.paddingLeft = 40;
    contactFrame.paddingRight = 40;
    contactFrame.cornerRadius = 16;

    const contactTitle = figma.createText();
    contactTitle.fontName = { family: "Inter", style: "Bold" };
    contactTitle.characters = "Let's work together!";
    contactTitle.fontSize = 24;
    contactTitle.fills = [{ type: 'SOLID', color: ${hexToRgbCode(textColor)} }];
    contactFrame.appendChild(contactTitle);

    const contactEmail = figma.createText();
    contactEmail.fontName = { family: "Inter", style: "Medium" };
    contactEmail.characters = "Email: " + ${JSON.stringify(data.email || '')};
    contactEmail.fontSize = 16;
    contactEmail.fills = [{ type: 'SOLID', color: ${hexToRgbCode(primaryColor)} }];
    contactFrame.appendChild(contactEmail);

    parentFrame.appendChild(contactFrame);
    `;
        break;
    }
  });

  return `/**
 * Figma Developer Console Executable Script
 * Copy all this code and run it in the developer inspect console on figma.com
 */
(async () => {
  console.log("Generating Portfolio layout...");
  
  // Ensure font family Inter is loaded
  await Promise.all([
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Medium" }),
    figma.loadFontAsync({ family: "Inter", style: "SemiBold" }),
    figma.loadFontAsync({ family: "Inter", style: "Bold" })
  ]).catch(err => {
    console.error("Font loading error:", err);
  });

  // Create Main Frame Canvas
  const parentFrame = figma.createFrame();
  parentFrame.name = "Developer Portfolio - ${data.name}";
  parentFrame.resize(1140, 1800);
  parentFrame.x = figma.viewport.center.x - 570;
  parentFrame.y = figma.viewport.center.y - 900;
  
  // Apply Background Fill
  parentFrame.fills = [{ type: 'SOLID', color: ${hexToRgbCode(bgColor)} }];
  
  // Configure Auto-Layout Flow
  parentFrame.layoutMode = "VERTICAL";
  parentFrame.primaryAxisSizingMode = "AUTO";
  parentFrame.counterAxisSizingMode = "FIXED";
  parentFrame.itemSpacing = 80;
  parentFrame.paddingTop = 80;
  parentFrame.paddingBottom = 80;
  parentFrame.paddingLeft = 80;
  parentFrame.paddingRight = 80;

  ${sectionScripts}

  // Finalize viewport target
  figma.currentPage.appendChild(parentFrame);
  figma.viewport.scrollAndZoomIntoView([parentFrame]);
  figma.select([parentFrame]);
  
  console.log("Portfolio generated successfully in Figma!");
})();
`;
}
