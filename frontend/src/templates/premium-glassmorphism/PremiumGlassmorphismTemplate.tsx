import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ProfileImage } from "@/components/templates/ProfileImage";
import { Sparkles, Compass, MessageCircle } from "lucide-react";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function PremiumGlassmorphismTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen selection:text-white relative overflow-hidden pb-16"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      {/* Floating Aurora / Light Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-[100px] opacity-25 animate-pulse mix-blend-screen pointer-events-none"
           style={{ backgroundColor: 'var(--color-primary)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-25 animate-pulse mix-blend-screen pointer-events-none"
           style={{ backgroundColor: 'var(--color-accent)' }} />

      <div className="max-w-5xl mx-auto px-6 relative z-10 py-16 space-y-28">
        
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="min-h-[70vh] flex items-center">
                  <div className="w-full backdrop-blur-lg bg-white/[0.03] border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-10 items-center">
                    <div className="flex-1 space-y-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm bg-white/5 border border-white/10"
                           style={{ color: 'var(--color-accent)' }}>
                        <Sparkles className="w-3 h-3" />
                        <span>Interactive Experience</span>
                      </div>
                      
                      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        {data.name}
                      </h1>
                      
                      <h2 className="text-xl font-bold opacity-80" style={{ color: 'var(--color-primary)' }}>
                        {data.title}
                      </h2>
                      
                      <p className="text-base opacity-75 max-w-xl leading-relaxed">
                        {data.summary}
                      </p>
                      
                      <div className="pt-2">
                        <a href={`mailto:${data.email}`} className="px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all border border-white/10 bg-white/5 hover:bg-white/10 inline-block text-xs uppercase tracking-wider">
                          Get in Touch
                        </a>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex items-center justify-center">
                      <div className="backdrop-blur-md bg-white/5 border border-white/15 p-2 rounded-full shadow-lg">
                        <ProfileImage customization={customization} sizeClassName="w-40 h-40 md:w-52 md:h-52 rounded-full" />
                      </div>
                    </div>
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="space-y-8">
                  <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold text-center">Stack & Capabilities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.skills.map((skill, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04 }}
                        className="p-5 rounded-2xl backdrop-blur-md bg-white/[0.02] border border-white/5 hover:border-white/15 text-center transition-all"
                      >
                        <Compass className="w-5 h-5 mx-auto mb-2 opacity-60" style={{ color: 'var(--color-primary)' }} />
                        <h3 className="text-sm font-semibold">{skill}</h3>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="space-y-12">
                  <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold text-center">Selected Outputs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl backdrop-blur-md bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          <span className="text-xs font-semibold opacity-50 uppercase tracking-widest">PRODUCT {i+1}</span>
                          <h3 className="text-2xl font-bold">{proj.name}</h3>
                          <p className="opacity-70 text-sm leading-relaxed">{proj.description}</p>
                        </div>
                        <div className="pt-6 mt-6 border-t border-white/5 flex flex-wrap gap-2 items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {proj.technologies.slice(0, 3).map(tech => (
                              <span key={tech} className="text-[10px] px-2.5 py-0.5 rounded bg-white/5 opacity-60">{tech}</span>
                            ))}
                          </div>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold block underline hover:text-[var(--color-primary)] transition-all">
                              Launch App
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
                  <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold text-center">Career Archives</h2>
                  <div className="max-w-2xl mx-auto space-y-4">
                    {data.experience.map((exp, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-2xl backdrop-blur-md bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold">{exp.role}</h3>
                          <p className="text-xs font-semibold opacity-70" style={{ color: 'var(--color-primary)' }}>{exp.company}</p>
                          <p className="opacity-70 text-xs leading-relaxed max-w-lg mt-1">{exp.description}</p>
                        </div>
                        <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] font-semibold opacity-60 self-start md:self-auto">{exp.duration}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="py-12 text-center max-w-xl mx-auto space-y-6 backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                  <MessageCircle className="w-10 h-10 mx-auto" style={{ color: 'var(--color-primary)' }} />
                  <h2 className="text-2xl font-bold">Initialize Project Dialog</h2>
                  <p className="opacity-70 text-xs max-w-sm mx-auto">
                    Let's collaborate on high-fidelity designs, interactive templates, and beautiful web products.
                  </p>
                  <div className="pt-2">
                    <a href={`mailto:${data.email}`} className="inline-block px-8 py-3.5 rounded-xl font-bold shadow-lg transition-all hover:scale-105"
                       style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
                      Request Consultation
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
