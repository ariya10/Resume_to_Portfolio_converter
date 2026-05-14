import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function RetroTerminalTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 relative selection:text-black overflow-hidden"
         style={{ 
           backgroundColor: 'var(--color-bg)', 
           color: 'var(--color-primary)', 
           fontFamily: 'var(--font-mono)', 
           textShadow: '0 0 5px var(--color-primary)',
           selectionBackgroundColor: 'var(--color-primary)'
         }}>
      
      {/* CRT Scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>
      
      {/* CRT Flicker effect */}
      <div className="fixed inset-0 pointer-events-none z-40 animate-pulse opacity-10" style={{ backgroundColor: 'var(--color-primary)' }}></div>

      <div className="max-w-4xl mx-auto border-2 p-4 md:p-8 inset-shadow" style={{ borderColor: 'var(--color-primary)', boxShadow: '0 0 20px var(--color-primary-alpha-20)' }}>
        
        {/* Terminal Header */}
        <header className="border-b-2 pb-4 mb-8 flex justify-between items-end" style={{ borderColor: 'var(--color-primary)' }}>
          <div>
            <div>OS: PORTFOLIO-DOS v1.0.4</div>
            <div>USER: {data.name.toUpperCase().replace(/\s+/g, '_')}</div>
          </div>
          <div className="text-right hidden md:block">
            <div>MEM: 640K OK</div>
            <div>{time}</div>
          </div>
        </header>

        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="mb-12">
                  <div className="mb-4">
                    <span style={{ color: 'var(--color-text)' }}>C:\&gt;</span> USER_INFO.EXE
                  </div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="border p-4 md:p-6"
                    style={{ borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-primary-alpha-5)' }}
                  >
                    <pre className="text-xs md:text-sm font-bold whitespace-pre-wrap leading-tight mb-6">
{`
    ___  _   _    _  _   _  ____ 
   / _ \\| | | |  | \\| | / |/ ___|
  | (_) | |_| |  | .  |/ /| |    
   \\__\\_\\\\___/   |_|\\_/_/ |_|    
`}
                    </pre>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 border-b pb-6" style={{ borderColor: 'var(--color-primary)', borderOpacity: 0.3 }}>
                      <div className="col-span-1">NAME:</div>
                      <div className="col-span-3 font-bold" style={{ color: 'var(--color-text)' }}>{data.name.toUpperCase()}</div>
                      <div className="col-span-1">TITLE:</div>
                      <div className="col-span-3 font-bold" style={{ color: 'var(--color-text)' }}>{data.title.toUpperCase()}</div>
                      <div className="col-span-1">LOC:</div>
                      <div className="col-span-3 font-bold" style={{ color: 'var(--color-text)' }}>{data.location.toUpperCase()}</div>
                    </div>
                    <div className="leading-relaxed whitespace-pre-wrap">
                      {data.summary.toUpperCase()}
                    </div>
                  </motion.div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="mb-12">
                  <div className="mb-4">
                    <span style={{ color: 'var(--color-text)' }}>C:\&gt;</span> SYS_SCAN --SKILLS
                  </div>
                  <div className="border p-4 md:p-6" style={{ borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-primary-alpha-5)' }}>
                    <div className="mb-4" style={{ color: 'var(--color-text)' }}>SCANNING MODULES... [OK]</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {data.skills.map((skill, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          [ <span style={{ color: 'var(--color-text)' }}>{skill.toUpperCase()}</span> ]
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="mb-12">
                  <div className="mb-4">
                    <span style={{ color: 'var(--color-text)' }}>C:\&gt;</span> DIR /W /PROJECTS
                  </div>
                  <div className="border p-4 md:p-6" style={{ borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-primary-alpha-5)' }}>
                    {data.projects.map((proj, i) => (
                      <div key={i} className="mb-8 last:mb-0">
                        <div className="font-bold text-xl mb-2" style={{ color: 'var(--color-text)' }}>&gt; {proj.name.toUpperCase()}</div>
                        <div className="mb-2 pl-4 border-l-2" style={{ borderColor: 'var(--color-primary)', borderOpacity: 0.3 }}>{proj.description.toUpperCase()}</div>
                        <div className="pl-4 text-xs opacity-70">
                          TECH: {proj.technologies.join(' | ').toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'experience':
              if (!data.experience?.length) return null;
              return (
                <section key="experience" className="mb-12">
                  <div className="mb-4">
                    <span style={{ color: 'var(--color-text)' }}>C:\&gt;</span> TYPE HISTORY.LOG
                  </div>
                  <div className="border p-4 md:p-6 space-y-6" style={{ borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-primary-alpha-5)' }}>
                    {data.experience.map((exp, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>{exp.company.toUpperCase()}</span>
                          <span className="text-sm">[{exp.duration.toUpperCase()}]</span>
                        </div>
                        <div className="opacity-80 mb-2" style={{ color: 'var(--color-text)' }}>-- {exp.role.toUpperCase()}</div>
                        <div className="text-sm leading-relaxed">{exp.description.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="mb-12">
                  <div className="mb-4">
                    <span style={{ color: 'var(--color-text)' }}>C:\&gt;</span> CONNECT.BAT
                  </div>
                  <div className="border p-4 md:p-6 text-center" style={{ borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-primary-alpha-5)' }}>
                    <div className="mb-6 animate-pulse text-xl">AWAITING CONNECTION...</div>
                    <a href={`mailto:${data.email}`} className="border-2 px-8 py-3 font-bold hover:text-black transition-colors inline-block" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-text)', hoverBackgroundColor: 'var(--color-primary)' }}>
                      {data.email.toUpperCase()}
                    </a>
                  </div>
                  
                  <div className="mt-8">
                    <span style={{ color: 'var(--color-text)' }}>C:\&gt;</span> <span className="animate-pulse block w-2 h-4 inline-block align-middle ml-1" style={{ backgroundColor: 'var(--color-primary)' }}></span>
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

