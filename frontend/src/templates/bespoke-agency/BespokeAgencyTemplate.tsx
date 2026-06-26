import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ProfileImage } from "@/components/templates/ProfileImage";
import { ArrowDown } from "lucide-react";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function BespokeAgencyTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 py-16 space-y-28">
        
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="min-h-[80vh] flex flex-col justify-between py-8">
                  <div className="flex justify-between items-baseline border-b-2 border-current pb-4">
                    <span className="text-sm font-bold uppercase tracking-widest">BESPOKE AGENCY</span>
                    <span className="text-xs font-semibold">{data.location}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center my-12">
                    <div className="md:col-span-3 space-y-8">
                      <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight leading-[0.8]" style={{ fontFamily: 'var(--font-heading)' }}>
                        {data.name}
                      </h1>
                      <h2 className="text-2xl font-bold uppercase tracking-wide">
                        {data.title}
                      </h2>
                      <p className="text-lg opacity-85 leading-relaxed font-medium">
                        {data.summary}
                      </p>
                      <div className="pt-4 flex gap-4">
                        <a href={`mailto:${data.email}`} className="px-8 py-4 rounded-none font-bold uppercase border-2 border-current shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                           style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
                          CONNECT DIRECTLY
                        </a>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 flex justify-center">
                      <div className="border-4 border-current p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <ProfileImage customization={customization} sizeClassName="w-48 h-48 md:w-64 md:h-64 rounded-none" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t-2 border-current pt-4">
                    <span className="text-xs opacity-60">DESIGN & PERFORMANCE // STUDIO</span>
                    <ArrowDown className="w-5 h-5 animate-bounce" />
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="space-y-8">
                  <h2 className="text-xs uppercase tracking-widest opacity-60 font-bold border-b-2 border-current pb-2">Capabilites</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {data.skills.map((skill, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="p-6 border-2 border-current shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white/5"
                      >
                        <h3 className="text-lg font-bold uppercase tracking-tight">{skill}</h3>
                        <p className="opacity-70 text-xs mt-2 leading-relaxed font-medium">Bespoke technical execution engineered for stability and brand differentiation.</p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="space-y-12">
                  <h2 className="text-xs uppercase tracking-widest opacity-60 font-bold border-b-2 border-current pb-2">Case Archives</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-8 border-2 border-current shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white/5 flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          <span className="text-xs font-bold opacity-50 uppercase tracking-widest">RECORD // 0{i+1}</span>
                          <h3 className="text-3xl font-black uppercase tracking-tighter">{proj.name}</h3>
                          <p className="opacity-80 text-sm leading-relaxed font-medium">{proj.description}</p>
                        </div>
                        <div className="pt-6 mt-6 border-t-2 border-current flex flex-wrap gap-2 items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {proj.technologies.slice(0, 3).map(tech => (
                              <span key={tech} className="text-[10px] px-2 py-0.5 border border-current font-bold uppercase tracking-wider">{tech}</span>
                            ))}
                          </div>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-wider block underline hover:text-[var(--color-primary)] transition-all">
                              LAUNCH CASE &rarr;
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
                <section key="experience" className="space-y-8">
                  <h2 className="text-xs uppercase tracking-widest opacity-60 font-bold border-b-2 border-current pb-2">Background log</h2>
                  <div className="space-y-6">
                    {data.experience.map((exp, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="p-6 border-2 border-current shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <h3 className="text-xl font-black uppercase tracking-tight">{exp.role}</h3>
                          <p className="text-xs font-bold uppercase tracking-wider opacity-70" style={{ color: 'var(--color-primary)' }}>{exp.company}</p>
                          <p className="opacity-80 text-xs leading-relaxed max-w-xl mt-2 font-medium">{exp.description}</p>
                        </div>
                        <span className="shrink-0 px-3 py-1 border border-current text-xs font-bold opacity-75 self-start md:self-auto">{exp.duration}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="py-16 text-center max-w-xl mx-auto space-y-6 border-2 border-current shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
                    INITIATE DISPATCH
                  </h2>
                  <p className="opacity-80 text-sm font-medium leading-relaxed">
                    We engineer technical products that work. If you have a high-impact requirement, contact our studio.
                  </p>
                  <div className="pt-4">
                    <a href={`mailto:${data.email}`} className="inline-block px-8 py-4 border-2 border-current shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs font-bold uppercase tracking-wider transition-all hover:scale-105"
                       style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
                      CONNECT DIRECTLY
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
