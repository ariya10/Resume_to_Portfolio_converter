import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function NeoBrutalistTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      {/* Brutalist Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" 
           style={{ backgroundImage: `linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)`, backgroundSize: '50px 50px' }}>
      </div>

      {/* Top Banner */}
      <div className="text-white font-bold text-center py-2 text-sm uppercase tracking-widest border-b-4 border-black relative z-10" style={{ backgroundColor: 'var(--color-primary)', borderBottomColor: 'var(--color-text)' }}>
        Warning: High Impact Content Ahead
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 pt-12 pb-24">
        
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="mb-32">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="border-8 p-8 md:p-16 relative"
                    style={{ borderColor: 'var(--color-text)', backgroundColor: 'var(--color-surface)' }}
                  >
                    <div className="absolute top-0 right-0 text-white px-4 py-1 font-bold border-l-8 border-b-8" style={{ backgroundColor: 'var(--color-accent)', borderColor: 'var(--color-text)' }}>
                      ID: {data.name.split(' ')[0]}
                    </div>
                    
                    <h1 className="text-[12vw] leading-[0.8] font-black uppercase tracking-tighter mb-8 max-w-full break-words" style={{ fontFamily: 'var(--font-heading)' }}>
                      {data.name}
                    </h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start border-t-8 pt-8" style={{ borderColor: 'var(--color-text)' }}>
                      <div>
                        <div className="text-2xl font-bold inline-block px-4 py-2 border-4 mb-4 uppercase" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)', borderColor: 'var(--color-text)' }}>
                          {data.title}
                        </div>
                        <div className="text-xl font-bold uppercase">{data.location}</div>
                      </div>
                      <div>
                        <p className="text-2xl font-bold leading-tight">
                          {data.summary}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="mb-32">
                  <h2 className="text-[8vw] font-black uppercase tracking-tighter mb-12 inline-block px-8 py-4" style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', fontFamily: 'var(--font-heading)' }}>
                    Outputs
                  </h2>
                  <div className="space-y-12">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="border-8 p-8 relative transition-colors"
                        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-text)' }}
                      >
                        <div className="absolute -top-8 -left-8 text-white text-5xl font-black w-16 h-16 flex items-center justify-center border-4" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-text)' }}>
                          {i + 1}
                        </div>
                        <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 mt-4" style={{ fontFamily: 'var(--font-heading)' }}>
                          {proj.name}
                        </h3>
                        <p className="text-2xl font-bold mb-8 max-w-3xl border-l-8 pl-6" style={{ borderColor: 'var(--color-text)' }}>
                          {proj.description}
                        </p>
                        <div className="flex flex-wrap gap-4">
                          {proj.technologies.map(t => (
                            <span key={t} className="px-4 py-2 text-xl font-bold uppercase" style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-bg)' }}>
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
                <section key="experience" className="mb-32">
                  <h2 className="text-[8vw] font-black uppercase tracking-tighter mb-12 text-white inline-block px-8 py-4 border-8" style={{ backgroundColor: 'var(--color-accent)', borderColor: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
                    History
                  </h2>
                  <div className="grid grid-cols-1 gap-8">
                    {data.experience.map((exp, i) => (
                      <div key={i} className="border-8 bg-white grid grid-cols-1 md:grid-cols-12" style={{ borderColor: 'var(--color-text)' }}>
                        <div className="md:col-span-4 p-8 flex flex-col justify-between" style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-bg)' }}>
                          <h3 className="text-4xl font-black uppercase mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{exp.company}</h3>
                          <div className="text-xl font-bold inline-block px-4 py-2 border-4 self-start" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)', borderColor: 'var(--color-bg)' }}>
                            {exp.duration}
                          </div>
                        </div>
                        <div className="md:col-span-8 p-8" style={{ backgroundColor: 'var(--color-bg)' }}>
                          <h4 className="text-4xl font-black uppercase mb-6" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-heading)' }}>{exp.role}</h4>
                          <p className="text-2xl font-bold leading-snug">
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
                <section key="skills" className="mb-32">
                   <div className="border-8 p-8 md:p-16" style={{ borderColor: 'var(--color-text)', backgroundColor: 'var(--color-surface)' }}>
                     <h2 className="text-5xl font-black uppercase mb-12 border-b-8 pb-4" style={{ borderColor: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
                       Technical Specs
                     </h2>
                     <div className="flex flex-wrap gap-4">
                       {data.skills.map((skill, i) => (
                         <div key={i} className="text-3xl font-black uppercase px-6 py-4 border-4 transition-colors" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-text)' }}>
                           {skill}
                         </div>
                       ))}
                     </div>
                   </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="mb-32">
                  <div className="border-8 p-12 text-center flex flex-col items-center" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-text)' }}>
                    <h2 className="text-[10vw] font-black uppercase tracking-tighter leading-none mb-12" style={{ fontFamily: 'var(--font-heading)' }}>
                      Transmit <br/> Signal
                    </h2>
                    <a href={`mailto:${data.email}`} className="text-white text-3xl md:text-5xl font-black uppercase px-12 py-6 transition-colors border-8 border-transparent" style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-bg)' }}>
                      {data.email}
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

