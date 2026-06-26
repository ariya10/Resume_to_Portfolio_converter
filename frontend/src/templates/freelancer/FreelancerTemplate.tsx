import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ProfileImage } from "@/components/templates/ProfileImage";
import { CheckCircle2, MessageSquare, Sparkles, Send } from "lucide-react";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function FreelancerTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 py-16 space-y-28">
        
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="min-h-[75vh] flex flex-col justify-center py-8">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
                    <div className="md:col-span-3 space-y-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                           style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)' }}>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Available for projects</span>
                      </div>
                      
                      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        Need a high-impact <span style={{ color: 'var(--color-primary)' }}>solution</span>? Let's build it.
                      </h1>
                      
                      <p className="text-lg opacity-75 leading-relaxed max-w-xl">
                        I am {data.name}, an expert {data.title}. {data.summary}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 pt-2">
                        <a href={`mailto:${data.email}`} className="px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:scale-105"
                           style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
                          Hire Me Today
                        </a>
                        <a href="#projects" className="px-6 py-3 rounded-xl font-bold border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                          View Work
                        </a>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 flex justify-center">
                      <ProfileImage customization={customization} sizeClassName="w-48 h-48 md:w-64 md:h-64 rounded-3xl" />
                    </div>
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="space-y-12">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <h2 className="text-3xl font-extrabold" style={{ fontFamily: 'var(--font-heading)' }}>How I Can Help You</h2>
                    <p className="opacity-70 text-sm">Tailored capabilities designed to solve complex business goals.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {data.skills.map((skill, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="p-6 rounded-2xl border transition-all"
                        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface)' }}
                      >
                        <CheckCircle2 className="w-8 h-8 mb-4" style={{ color: 'var(--color-primary)' }} />
                        <h3 className="text-lg font-bold mb-2">{skill}</h3>
                        <p className="opacity-70 text-xs leading-relaxed">Providing high quality implementation and responsive support tailored to this stack.</p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section id="projects" key="projects" className="space-y-12">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-extrabold" style={{ fontFamily: 'var(--font-heading)' }}>Featured Case Studies</h2>
                      <p className="opacity-70 text-sm">Real-world results delivered to clients around the globe.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          <span className="text-xs font-semibold opacity-50 uppercase tracking-widest">Case study #{i+1}</span>
                          <h3 className="text-2xl font-bold">{proj.name}</h3>
                          <p className="opacity-70 text-sm leading-relaxed">{proj.description}</p>
                        </div>
                        <div className="pt-6 mt-6 border-t border-white/5 flex flex-wrap gap-2 items-center justify-between">
                          <div className="flex flex-wrap gap-1.5">
                            {proj.technologies.slice(0, 3).map(tech => (
                              <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-white/5 opacity-70">{tech}</span>
                            ))}
                          </div>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold transition-all hover:translate-x-1" style={{ color: 'var(--color-primary)' }}>
                              Explore Project &rarr;
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
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <h2 className="text-3xl font-extrabold" style={{ fontFamily: 'var(--font-heading)' }}>Professional Background</h2>
                    <p className="opacity-70 text-sm">Proven track record of high-performance delivery.</p>
                  </div>
                  <div className="max-w-3xl mx-auto space-y-6">
                    {data.experience.map((exp, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-2xl border flex flex-col md:flex-row md:items-start justify-between gap-4"
                        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface)' }}
                      >
                        <div className="space-y-1.5">
                          <h3 className="text-lg font-bold">{exp.role}</h3>
                          <p className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>{exp.company}</p>
                          <p className="opacity-70 text-xs leading-relaxed max-w-xl">{exp.description}</p>
                        </div>
                        <span className="shrink-0 px-3 py-1 rounded bg-white/5 text-[11px] font-semibold opacity-60 self-start md:self-auto">{exp.duration}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="p-8 md:p-12 rounded-3xl text-center space-y-6 relative overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />
                  <MessageSquare className="w-12 h-12 mx-auto" style={{ color: 'var(--color-primary)' }} />
                  <h2 className="text-3xl md:text-4xl font-extrabold max-w-xl mx-auto" style={{ fontFamily: 'var(--font-heading)' }}>
                    Ready to scale your next digital product?
                  </h2>
                  <p className="opacity-70 text-sm max-w-lg mx-auto">
                    Get in touch with me directly to schedule a strategy call or request a detailed proposal.
                  </p>
                  <div className="pt-4">
                    <a href={`mailto:${data.email}`} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold shadow-lg transition-all hover:scale-105"
                       style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
                      <Send className="w-4 h-4" />
                      <span>Request Proposal</span>
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
