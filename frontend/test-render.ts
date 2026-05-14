import { generatePortfolioHTML } from './src/lib/template-renderer';
import { getDefaultCustomization } from './src/lib/portfolio-templates';

const data = {
  name: "Jane Doe",
  title: "Designer",
  email: "jane@doe.com",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  website: "",
  summary: "A designer.",
  bio: "",
  skills: ["Figma"],
  skillCategories: {},
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  languages: [],
  interests: [],
  userType: "designer",
  portfolioTone: "professional",
  profileImage: ""
};

try {
  const layouts = [
    "cinematic-parallax",
    "bento-grid-interactive",
    "immersive-glass",
    "editorial-asymmetry",
    "brutalist-neo"
  ];
  
  layouts.forEach(layout => {
    const opts = getDefaultCustomization(layout as any, "executive-obsidian");
    const html = generatePortfolioHTML(data, opts as any, false);
    console.log(`Layout ${layout} OK. length = ${html.length}`);
  });
} catch (e) {
  console.error("ERROR:", e);
}
