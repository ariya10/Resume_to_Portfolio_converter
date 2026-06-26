import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ProfileImage } from "@/components/templates/ProfileImage";
import { User, Bookmark, Briefcase, Mail } from "lucide-react";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function PersonalBrandTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 py-16 space-y-24">
        
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="py-12 border-b border-black/5">
                  <div className="flex flex-col md:flex-row gap-10 items-center">
                    <div className="shrink-0 flex items-center justify-center">
                      <ProfileImage customization={customization} sizeClassName="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-amber-500/10" />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left space-y-4">
                      <h1 className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        {data.name}
                      </h1>
                      
                      <h2 className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                        {data.title}
                      </h2>
                      
                      <p className="text-base opacity-75 max-w-xl leading-relaxed">
                        {data.summary}
                      </p>
                      
                      <div className="flex justify-center md:justify-start gap-4 pt-2">
                        {data.email && <a href={`mailto:${data.email}`} className="text-sm font-semibold hover:opacity-70 transition-opacity">Email</a>}
                        {data.linkedin && <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:opacity-70 transition-opacity">LinkedIn</a>}
                        {data.github && <a href={data.github} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:opacity-70 transition-opacity">GitHub</a>}
                      </div>
                    </div>
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-black/5 pb-2">
                    <User className="w-4 h-4 opacity-60" />
                    <h2 className="text-xs uppercase tracking-widest opacity-60 font-bold">Interests & Core Skills</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-black/5" style={{ backgroundColor: 'var(--color-surface)' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-black/5 pb-2">
                    <Bookmark className="w-4 h-4 opacity-60" />
                    <h2 className="text-xs uppercase tracking-widest opacity-60 font-bold">Featured Projects</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-5 rounded-2xl border border-black/5 bg-white/[0.01] hover:bg-white/[0.03]"
                      >
                        <h3 className="text-lg font-bold">{proj.name}</h3>
                        <p className="opacity-70 text-xs mt-2 leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-1 mt-4">
                          {proj.technologies.slice(0, 3).map(tech => (
                            <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-black/5 opacity-60">{tech}</span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'experience':
              if (!data.experience?.length) return null;
              return (
                <section key="experience" className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-black/5 pb-2">
                    <Briefcase className="w-4 h-4 opacity-60" />
                    <h2 className="text-xs uppercase tracking-widest opacity-60 font-bold">Career Timeline</h2>
                  </div>
                  <div className="space-y-4">
                    {data.experience.map((exp, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row justify-between py-4 border-b border-black/5 gap-2"
                      >
                        <div className="space-y-1">
                          <h3 className="text-base font-bold">{exp.role}</h3>
                          <p className="text-xs font-semibold opacity-70">{exp.company}</p>
                          <p className="opacity-70 text-xs mt-1 leading-relaxed max-w-xl">{exp.description}</p>
                        </div>
                        <span className="shrink-0 text-xs opacity-50 font-medium self-start md:self-auto">{exp.duration}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="py-12 text-center max-w-lg mx-auto space-y-6">
                  <Mail className="w-10 h-10 mx-auto opacity-70" />
                  <h2 className="text-2xl font-bold">Let's Connect</h2>
                  <p className="opacity-70 text-xs">
                    I'm always open to new relationships, speaking engagements, and consulting requests. Drop me an email!
                  </p>
                  <div className="pt-2">
                    <a href={`mailto:${data.email}`} className="inline-block px-8 py-3.5 rounded-full font-bold shadow-md hover:scale-105 transition-all text-xs"
                       style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
                      Send message
                    </a>
                  </div>
                </section>
              );

            default: return null;
          }
        })}
      </div>
    </div>
  );
}
