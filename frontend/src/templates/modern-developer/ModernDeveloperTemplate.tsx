import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ProfileImage } from "@/components/templates/ProfileImage";
import { Terminal, Code, Cpu, ExternalLink } from "lucide-react";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function ModernDeveloperTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      {/* Code grid lines background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" 
           style={{ backgroundImage: `linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 py-16">
        
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="min-h-[80vh] flex flex-col justify-center py-12 border-b border-white/10">
                  <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-[var(--color-primary)]">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>developer_portfolio_v2.0</span>
                      </div>
                      
                      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        Hey, I'm <span style={{ color: 'var(--color-primary)' }}>{data.name}</span>
                      </h1>
                      
                      <h2 className="text-2xl font-bold opacity-80 font-mono">
                        &gt; {data.title}
                      </h2>
                      
                      <p className="text-lg opacity-75 max-w-2xl leading-relaxed">
                        {data.summary}
                      </p>
                      
                      <div className="flex gap-4 pt-4">
                        <a href={`mailto:${data.email}`} className="px-5 py-2.5 rounded-lg font-bold border transition-all text-xs uppercase tracking-wider font-mono hover:scale-105"
                           style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)', borderColor: 'var(--color-primary)' }}>
                          contact_me.sh
                        </a>
                        {data.github && (
                          <a href={data.github} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg font-bold border border-white/10 hover:bg-white/5 transition-all text-xs uppercase tracking-wider font-mono">
                            github_repo
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex items-center justify-center">
                      <ProfileImage customization={customization} sizeClassName="w-48 h-48 md:w-64 md:h-64 rounded-2xl border-4 border-white/15" />
                    </div>
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="py-20 border-b border-white/10">
                  <div className="flex items-center gap-3 mb-12">
                    <Code className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                    <h2 className="text-3xl font-bold font-mono" style={{ fontFamily: 'var(--font-heading)' }}>capabilities.json</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.skills.map((skill, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-[var(--color-primary)]/50 transition-all font-mono text-sm flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                        <span>{skill}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="py-20 border-b border-white/10">
                  <div className="flex items-center gap-3 mb-12">
                    <Cpu className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                    <h2 className="text-3xl font-bold font-mono" style={{ fontFamily: 'var(--font-heading)' }}>deployed_projects.md</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-2xl border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{proj.name}</h3>
                            {proj.link && (
                              <a href={proj.link} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:text-[var(--color-primary)] transition-all">
                                <ExternalLink className="w-4.5 h-4.5" />
                              </a>
                            )}
                          </div>
                          <p className="opacity-70 text-sm mb-6 leading-relaxed">{proj.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                          {proj.technologies.map(t => (
                            <span key={t} className="px-2.5 py-1 bg-white/5 rounded text-xs font-mono opacity-80" style={{ color: 'var(--color-primary)' }}>
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
                <section key="experience" className="py-20 border-b border-white/10">
                  <h2 className="text-3xl font-bold mb-12 font-mono" style={{ fontFamily: 'var(--font-heading)' }}>work_history.log</h2>
                  <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                    {data.experience.map((exp, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="pl-10 relative"
                      >
                        <span className="absolute left-1.5 top-2.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-primary)] ring-4 ring-white/5" />
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                          <h3 className="text-xl font-bold">{exp.role} @ <span style={{ color: 'var(--color-primary)' }}>{exp.company}</span></h3>
                          <span className="px-2.5 py-1 rounded-md bg-white/5 text-xs font-mono opacity-70">{exp.duration}</span>
                        </div>
                        <p className="opacity-75 text-sm leading-relaxed max-w-3xl">{exp.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="py-24 text-center max-w-2xl mx-auto space-y-6">
                  <h2 className="text-4xl font-extrabold" style={{ fontFamily: 'var(--font-heading)' }}>Initialize Connection</h2>
                  <p className="opacity-70 leading-relaxed font-mono text-sm">
                    Have an interesting project or career opportunity? Send a request to connect.
                  </p>
                  <div className="pt-4">
                    <a href={`mailto:${data.email}`} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all font-mono hover:scale-105"
                       style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
                      &gt; connect_mail()
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
