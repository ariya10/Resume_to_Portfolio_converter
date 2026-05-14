import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function LuxuryDarkTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen selection:text-black overflow-hidden relative"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      {/* Cinematic Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full opacity-50 blur-[100px]" style={{ background: `radial-gradient(ellipse at center, var(--color-surface), var(--color-bg), transparent)` }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full opacity-40 blur-[120px]" style={{ background: `radial-gradient(ellipse at center, var(--color-primary-alpha-20), var(--color-bg), transparent)` }}></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Navigation */}
        <nav className="py-12 flex justify-between items-center border-b border-white/5">
          <div className="text-xl tracking-[0.2em] uppercase font-light" style={{ color: 'var(--color-primary)' }}>
            {data.name.split(' ')[0][0]}{data.name.split(' ').length > 1 ? data.name.split(' ')[1][0] : ''}
          </div>
          <div className="text-xs uppercase tracking-[0.3em] opacity-40">
            Portfolio
          </div>
        </nav>

        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="min-h-[80vh] flex flex-col justify-center py-20">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: [0.2, 0.65, 0.3, 0.9] }}
                  >
                    <p className="tracking-[0.3em] uppercase text-sm md:text-base mb-6 font-light" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                      {data.title}
                    </p>
                    <h1 className="text-5xl md:text-8xl lg:text-[120px] leading-[0.9] font-medium tracking-tight mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60" style={{ fontFamily: 'var(--font-heading)' }}>
                      {data.name}
                    </h1>
                    <p className="text-xl md:text-3xl opacity-50 max-w-2xl leading-relaxed font-light">
                      {data.summary}
                    </p>
                  </motion.div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="py-32 border-t border-white/5">
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-sm tracking-[0.3em] uppercase mb-16"
                    style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}
                  >
                    01. Selected Works
                  </motion.h2>
                  
                  <div className="space-y-32">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.2, 0.65, 0.3, 0.9] }}
                        className="group cursor-pointer"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                          <div className="md:col-span-8">
                            <h3 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 group-hover:text-[var(--color-primary)] transition-colors duration-700" style={{ fontFamily: 'var(--font-heading)' }}>
                              {proj.name}
                            </h3>
                            <p className="text-lg md:text-xl opacity-50 leading-relaxed font-light max-w-xl">
                              {proj.description}
                            </p>
                          </div>
                          <div className="md:col-span-4 flex flex-col items-start md:items-end">
                            <div className="flex flex-wrap gap-2 justify-start md:justify-end mb-4">
                              {proj.technologies.map(t => (
                                <span key={t} className="text-[10px] uppercase tracking-[0.2em] opacity-30 border border-white/10 px-3 py-1 rounded-full" style={{ fontFamily: 'var(--font-mono)' }}>
                                  {t}
                                </span>
                              ))}
                            </div>
                            <div className="w-12 h-[1px] group-hover:w-full transition-all duration-700 mt-4" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'experience':
              if (!data.experience?.length) return null;
              return (
                <section key="experience" className="py-32 border-t border-white/5">
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-sm tracking-[0.3em] uppercase mb-16"
                    style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}
                  >
                    02. Professional Journey
                  </motion.h2>
                  
                  <div className="relative border-l border-white/10 pl-8 md:pl-16 ml-4">
                    {data.experience.map((exp, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="mb-20 last:mb-0 relative"
                      >
                        <div className="absolute w-2 h-2 rounded-full -left-[37px] md:-left-[69px] top-3 shadow-[0_0_10px_#d4af37]" style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 0 10px var(--color-primary)' }}></div>
                        <div className="text-xs uppercase tracking-[0.2em] opacity-30 mb-3" style={{ fontFamily: 'var(--font-mono)' }}>{exp.duration}</div>
                        <h3 className="text-3xl font-medium mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{exp.role}</h3>
                        <h4 className="text-xl font-light italic mb-6" style={{ color: 'var(--color-primary)' }}>{exp.company}</h4>
                        <p className="opacity-50 leading-relaxed font-light max-w-2xl text-lg">
                          {exp.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="py-32 border-t border-white/5 text-center">
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-sm tracking-[0.3em] uppercase mb-16"
                    style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}
                  >
                    03. Expertise
                  </motion.h2>
                  <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 max-w-4xl mx-auto">
                    {data.skills.map((skill, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                        className="text-2xl md:text-4xl opacity-70 hover:opacity-100 transition-opacity cursor-default font-light tracking-tight"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="py-40 border-t border-white/5 text-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                  >
                    <p className="text-sm tracking-[0.3em] uppercase mb-8" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                      Inquiries
                    </p>
                    <h2 className="text-5xl md:text-8xl font-medium tracking-tight mb-12" style={{ fontFamily: 'var(--font-heading)' }}>
                      Get in touch.
                    </h2>
                    <a href={`mailto:${data.email}`} className="text-xl md:text-3xl opacity-50 hover:opacity-100 transition-opacity border-b pb-2 inline-block" style={{ color: 'var(--color-text)', borderColor: 'var(--color-text)' }}>
                      {data.email}
                    </a>
                  </motion.div>
                </section>
              );

            default: return null;
          }
        })}
        
        {/* Footer */}
        <footer className="py-12 border-t border-white/5 flex justify-between items-center text-xs tracking-[0.2em] uppercase opacity-30" style={{ fontFamily: 'var(--font-mono)' }}>
          <div>&copy; {new Date().getFullYear()}</div>
          <div className="flex gap-6">
            {data.linkedin && <a href={data.linkedin} className="hover:text-white transition-colors">LinkedIn</a>}
            {data.github && <a href={data.github} className="hover:text-white transition-colors">GitHub</a>}
          </div>
        </footer>
      </div>
    </div>
  );
}

