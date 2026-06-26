import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ProfileImage } from "@/components/templates/ProfileImage";
import { Cpu, Database, Network, Send } from "lucide-react";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function AiEngineerTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10" 
           style={{ backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`, backgroundSize: '24px 24px' }}>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 py-16 space-y-28">
        
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="min-h-[80vh] flex flex-col justify-center py-8">
                  <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-[var(--color-primary)]">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>epoch_loss: 0.0024</span>
                      </div>
                      
                      <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        Building <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-accent))` }}>Intelligent</span> Systems.
                      </h1>
                      
                      <h2 className="text-xl md:text-2xl font-mono text-slate-400">
                        &gt; {data.name} // {data.title}
                      </h2>
                      
                      <p className="text-lg opacity-75 max-w-xl leading-relaxed">
                        {data.summary}
                      </p>
                      
                      <div className="flex gap-4 pt-2">
                        <a href={`mailto:${data.email}`} className="px-6 py-3 rounded-lg font-bold border transition-all text-xs uppercase tracking-wider font-mono hover:scale-105"
                           style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)', borderColor: 'var(--color-primary)' }}>
                          Run Connection
                        </a>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex items-center justify-center">
                      <div className="border border-violet-500/20 p-2 bg-violet-950/10 rounded-full">
                        <ProfileImage customization={customization} sizeClassName="w-48 h-48 md:w-64 md:h-64 rounded-full" />
                      </div>
                    </div>
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="space-y-12">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <Network className="w-6 h-6 text-[var(--color-primary)]" />
                    <h2 className="text-2xl font-bold font-mono">Neural Weights & Stack</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.skills.map((skill, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="p-4 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] font-mono text-xs flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                        <span>{skill}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="space-y-12">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <Database className="w-6 h-6 text-[var(--color-primary)]" />
                    <h2 className="text-2xl font-bold font-mono">Models & Architectures</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] flex flex-col justify-between space-y-4"
                      >
                        <div>
                          <h3 className="text-xl font-bold font-mono text-slate-200">{proj.name}</h3>
                          <p className="opacity-70 text-xs leading-relaxed mt-2">{proj.description}</p>
                        </div>
                        <div className="pt-4 border-t border-white/5 flex flex-wrap gap-1.5 items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {proj.technologies.slice(0, 3).map(tech => (
                              <span key={tech} className="text-[10px] px-2.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono">{tech}</span>
                            ))}
                          </div>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold underline hover:text-[var(--color-primary)] transition-all font-mono">
                              run_demo
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
                  <h2 className="text-2xl font-bold font-mono border-b border-white/10 pb-4">Training History</h2>
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
                        <span className="text-[10px] font-mono opacity-50 block mb-1">{exp.duration}</span>
                        <h3 className="text-lg font-bold">{exp.role} <span className="opacity-50">@</span> {exp.company}</h3>
                        <p className="opacity-70 text-xs leading-relaxed mt-2 max-w-3xl">{exp.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="py-16 text-center max-w-xl mx-auto space-y-6">
                  <h2 className="text-3xl font-extrabold font-mono" style={{ fontFamily: 'var(--font-heading)' }}>
                    Trigger Agent
                  </h2>
                  <p className="opacity-70 text-sm max-w-md mx-auto leading-relaxed">
                    Ready to build neural search, fine-tune models, or engineer LLM agent workflows? Ping my API.
                  </p>
                  <div className="pt-4">
                    <a href={`mailto:${data.email}`} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all shadow-md font-mono hover:scale-105"
                       style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
                      <Send className="w-4 h-4" />
                      <span>ping_agent()</span>
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
