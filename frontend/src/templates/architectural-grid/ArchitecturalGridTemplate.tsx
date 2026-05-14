import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function ArchitecturalGridTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-text)' }}>
      
      {/* Blueprint Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10" 
           style={{ backgroundImage: `linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>
      
      {/* Structural Framing */}
      <div className="fixed inset-4 border pointer-events-none z-50" style={{ borderColor: 'var(--color-text)' }}></div>
      <div className="fixed inset-[17px] border pointer-events-none z-50 opacity-20" style={{ borderColor: 'var(--color-text)' }}></div>

      <div className="max-w-[1400px] mx-auto px-8 md:px-16 pt-16 pb-32 relative z-10">
        
        {/* Header Header */}
        <header className="grid grid-cols-4 md:grid-cols-12 gap-px border mb-16" style={{ backgroundColor: 'var(--color-text)', borderOpacity: 0.1, borderColor: 'var(--color-text)' }}>
          <div className="col-span-4 md:col-span-3 p-4 text-xs uppercase tracking-widest" style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-mono)', color: 'var(--color-text)', opacity: 0.6 }}>
            Doc No.<br/>
            <span className="font-bold opacity-100">PF-01</span>
          </div>
          <div className="col-span-4 md:col-span-6 p-4 text-center text-xs uppercase tracking-widest" style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>
            Project Title<br/>
            <span className="font-bold">{data.name} // Portfolio</span>
          </div>
          <div className="col-span-4 md:col-span-3 p-4 text-right text-xs uppercase tracking-widest" style={{ backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-mono)', color: 'var(--color-text)', opacity: 0.6 }}>
            Rev Date<br/>
            <span className="font-bold">{new Date().toLocaleDateString()}</span>
          </div>
        </header>

        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="mb-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                  <div className="md:col-span-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      <h2 className="text-sm uppercase tracking-[0.2em] mb-4 flex items-center gap-4 opacity-60" style={{ fontFamily: 'var(--font-mono)' }}>
                        <span className="w-12 h-px" style={{ backgroundColor: 'var(--color-text)', opacity: 0.3 }}></span>
                        {data.title}
                      </h2>
                      <h1 className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.9] mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
                        {data.name}
                      </h1>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t" style={{ borderColor: 'var(--color-text)', borderOpacity: 0.1 }}>
                        <p className="text-lg leading-relaxed opacity-80 font-light">
                          {data.summary}
                        </p>
                        <div className="text-sm opacity-60 space-y-2" style={{ fontFamily: 'var(--font-mono)' }}>
                          <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--color-text)', borderOpacity: 0.1 }}>
                            <span>Base Location</span>
                            <span style={{ color: 'var(--color-text)' }}>{data.location}</span>
                          </div>
                          <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--color-text)', borderOpacity: 0.1 }}>
                            <span>System Status</span>
                            <span style={{ color: 'var(--color-primary)' }}>Active</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="mb-24">
                  <div className="text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-4 opacity-60" style={{ fontFamily: 'var(--font-mono)' }}>
                    <span className="w-12 h-px" style={{ backgroundColor: 'var(--color-text)', opacity: 0.3 }}></span>
                    Structural Assets
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px border" style={{ backgroundColor: 'var(--color-text)', borderOpacity: 0.1, borderColor: 'var(--color-text)' }}>
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="p-8 group hover:opacity-90 transition-colors"
                        style={{ backgroundColor: 'var(--color-bg)' }}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <h3 className="text-3xl font-medium" style={{ fontFamily: 'var(--font-heading)' }}>{proj.name}</h3>
                          <span className="text-xs opacity-40" style={{ fontFamily: 'var(--font-mono)' }}>MOD-0{i+1}</span>
                        </div>
                        <p className="opacity-70 font-light mb-8 leading-relaxed">
                          {proj.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {proj.technologies.map(t => (
                            <span key={t} className="px-2 py-1 border text-[10px] uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)', borderColor: 'var(--color-text)', borderOpacity: 0.2 }}>
                              {t}
                            </span>
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
                <section key="experience" className="mb-24">
                  <div className="text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-4 opacity-60" style={{ fontFamily: 'var(--font-mono)' }}>
                    <span className="w-12 h-px" style={{ backgroundColor: 'var(--color-text)', opacity: 0.3 }}></span>
                    Operational Timeline
                  </div>
                  <div className="border" style={{ borderColor: 'var(--color-text)', borderOpacity: 0.1 }}>
                    {data.experience.map((exp, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-px border-b last:border-0" style={{ backgroundColor: 'var(--color-text)', borderOpacity: 0.1, borderColor: 'var(--color-text)' }}>
                        <div className="md:col-span-3 p-6 flex flex-col justify-center border-r" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-text)', borderOpacity: 0.1 }}>
                          <div className="text-xs opacity-50 mb-2" style={{ fontFamily: 'var(--font-mono)' }}>{exp.duration}</div>
                          <h3 className="text-xl font-medium" style={{ fontFamily: 'var(--font-heading)' }}>{exp.company}</h3>
                        </div>
                        <div className="md:col-span-9 p-6" style={{ backgroundColor: 'var(--color-bg)' }}>
                          <h4 className="text-lg font-medium mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{exp.role}</h4>
                          <p className="opacity-70 font-light leading-relaxed max-w-3xl">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="mb-24">
                  <div className="text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-4 opacity-60" style={{ fontFamily: 'var(--font-mono)' }}>
                    <span className="w-12 h-px" style={{ backgroundColor: 'var(--color-text)', opacity: 0.3 }}></span>
                    System Capabilities
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-px border" style={{ backgroundColor: 'var(--color-text)', borderOpacity: 0.1, borderColor: 'var(--color-text)' }}>
                    {data.skills.map((skill, i) => (
                      <div key={i} className="p-6 text-center hover:opacity-80 transition-colors cursor-default" style={{ backgroundColor: 'var(--color-bg)' }}>
                        <span className="text-sm tracking-wider uppercase" style={{ fontFamily: 'var(--font-mono)' }}>{skill}</span>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="mb-24 pt-16 border-t" style={{ borderColor: 'var(--color-text)', borderOpacity: 0.1 }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Establish <br/> Connection</h2>
                      <p className="opacity-60 text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
                        Awaiting network protocol
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <a href={`mailto:${data.email}`} className="text-2xl md:text-4xl font-light hover:italic transition-all border-b pb-2" style={{ color: 'var(--color-text)', borderColor: 'var(--color-text)', borderOpacity: 0.3 }}>
                        {data.email}
                      </a>
                    </div>
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

