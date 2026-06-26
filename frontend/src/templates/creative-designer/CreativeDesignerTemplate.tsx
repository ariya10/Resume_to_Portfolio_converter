import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ProfileImage } from "@/components/templates/ProfileImage";
import { ArrowUpRight } from "lucide-react";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function CreativeDesignerTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      {/* Off-white overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 mix-blend-overlay opacity-30 bg-noise" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 py-20 space-y-36">
        
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="min-h-[85vh] flex flex-col justify-end py-12 relative">
                  <div className="flex flex-col-reverse md:flex-row gap-12 md:items-end justify-between">
                    <div className="space-y-8 max-w-xl">
                      <div className="text-sm font-semibold tracking-widest uppercase opacity-70">
                        {data.title} / Based in {data.location}
                      </div>
                      
                      <h1 className="text-5xl md:text-8xl font-light tracking-tighter leading-[0.9]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Crafting <span className="italic font-bold" style={{ color: 'var(--color-primary)' }}>memorable</span> digital artifacts.
                      </h1>
                      
                      <p className="text-xl opacity-80 leading-relaxed font-light">
                        {data.summary}
                      </p>
                      
                      <div className="pt-4">
                        <a href={`mailto:${data.email}`} className="group inline-flex items-center gap-2 text-lg font-bold border-b-2 transition-all pb-1 hover:gap-4"
                           style={{ borderColor: 'var(--color-primary)', color: 'var(--color-text)' }}>
                          <span>Start a Project</span>
                          <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" style={{ color: 'var(--color-primary)' }} />
                        </a>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center md:mb-12 justify-center">
                      <div className="relative p-2 border border-black/10 rounded-3xl" style={{ backgroundColor: 'var(--color-surface)' }}>
                        <ProfileImage customization={customization} sizeClassName="w-48 h-48 md:w-64 md:h-64 rounded-2xl" />
                      </div>
                    </div>
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="space-y-8">
                  <div className="flex justify-between items-baseline border-b border-black/10 pb-4">
                    <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold">Specialization</h2>
                    <span className="text-[10px] font-mono opacity-50">SKILLS // CORES</span>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {data.skills.map((skill, i) => (
                      <motion.span 
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04 }}
                        className="text-2xl md:text-4xl font-light tracking-tight hover:text-[var(--color-primary)] transition-all cursor-default"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {skill} <span className="opacity-20 ml-2">/</span>
                      </motion.span>
                    ))}
                  </div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="space-y-16">
                  <div className="flex justify-between items-baseline border-b border-black/10 pb-4">
                    <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold">Selected Work</h2>
                    <span className="text-[10px] font-mono opacity-50">PROJECTS // DESIGN</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6 group"
                      >
                        <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden relative border border-black/5 flex items-center justify-center p-8 transition-all group-hover:scale-[0.98]" 
                             style={{ backgroundColor: 'var(--color-surface)' }}>
                          <span className="text-6xl font-black opacity-10 absolute left-6 top-6 font-mono">{i + 1}</span>
                          <div className="space-y-2 text-center max-w-xs">
                            <h4 className="text-2xl font-bold uppercase tracking-tight">{proj.name}</h4>
                            <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                              {proj.technologies.slice(0, 3).map(tech => (
                                <span key={tech} className="text-[9px] px-2 py-0.5 rounded-full border border-black/10 bg-white/20 uppercase tracking-wider font-mono">{tech}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="text-2xl font-semibold tracking-tight leading-tight">{proj.name}</h3>
                            <p className="opacity-70 text-sm font-light">{proj.description}</p>
                          </div>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="p-2 border border-black/10 rounded-full hover:bg-black/5 hover:rotate-45 transition-all shrink-0">
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'experience':
              if (!data.experience?.length) return null;
              return (
                <section key="experience" className="space-y-12">
                  <div className="flex justify-between items-baseline border-b border-black/10 pb-4">
                    <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold">Exhibitions & Roles</h2>
                    <span className="text-[10px] font-mono opacity-50">TIMELINE // ARCHIVES</span>
                  </div>
                  <div className="space-y-0">
                    {data.experience.map((exp, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-4 py-8 border-b border-black/10 gap-4"
                      >
                        <div className="text-sm font-mono opacity-60">{exp.duration}</div>
                        <div className="md:col-span-2 space-y-1">
                          <h3 className="text-xl font-bold tracking-tight">{exp.role}</h3>
                          <p className="opacity-75 text-sm font-light leading-relaxed">{exp.description}</p>
                        </div>
                        <div className="text-right text-sm font-bold uppercase tracking-wider md:block hidden" style={{ color: 'var(--color-primary)' }}>
                          {exp.company}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="py-12 border-t border-black/10 flex flex-col md:flex-row gap-8 items-start justify-between">
                  <div className="max-w-md space-y-4">
                    <h2 className="text-4xl md:text-5xl font-light tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
                      Let's design the <span className="font-bold italic">future</span> together.
                    </h2>
                    <p className="opacity-70 text-sm font-light">
                      Currently accepting commissions, agency consultations, and collaborative digital experiments.
                    </p>
                  </div>
                  <div className="pt-4 flex flex-col gap-2 shrink-0">
                    <a href={`mailto:${data.email}`} className="px-8 py-4 rounded-full font-bold text-center border-2 transition-all font-mono hover:scale-105"
                       style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', borderColor: 'var(--color-text)' }}>
                      Say Hello
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
