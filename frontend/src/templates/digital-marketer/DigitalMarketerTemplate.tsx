import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ProfileImage } from "@/components/templates/ProfileImage";
import { TrendingUp, BarChart2, Award, Mail } from "lucide-react";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function DigitalMarketerTemplate({ data, customization }: TemplateProps) {
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
                  <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-semibold text-[var(--color-primary)]">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Growth & Conversion Specialist</span>
                      </div>
                      
                      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        Scaling brands through <span style={{ color: 'var(--color-primary)' }}>data-driven</span> campaigns.
                      </h1>
                      
                      <p className="text-lg opacity-75 leading-relaxed max-w-xl">
                        I'm {data.name}, {data.title}. {data.summary}
                      </p>
                      
                      <div className="flex gap-4 pt-2">
                        <a href={`mailto:${data.email}`} className="px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:scale-105"
                           style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
                          Request Consultation
                        </a>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex items-center justify-center">
                      <ProfileImage customization={customization} sizeClassName="w-48 h-48 md:w-64 md:h-64 rounded-2xl" />
                    </div>
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="space-y-12">
                  <div className="flex justify-between items-baseline border-b border-black/10 pb-4">
                    <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold">Core Competencies</h2>
                    <span className="text-[10px] font-mono opacity-50">MARKETING // DATA</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {data.skills.map((skill, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="p-5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02]"
                      >
                        <BarChart2 className="w-5 h-5 mb-3" style={{ color: 'var(--color-primary)' }} />
                        <h3 className="text-sm font-bold">{skill}</h3>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="space-y-12">
                  <div className="flex justify-between items-baseline border-b border-black/10 pb-4">
                    <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold">Campaign Showcase</h2>
                    <span className="text-[10px] font-mono opacity-50">RESULTS // DELIVERED</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          <span className="text-xs font-semibold opacity-50 uppercase tracking-widest">CAMPAIGN {i+1}</span>
                          <h3 className="text-2xl font-bold">{proj.name}</h3>
                          <p className="opacity-70 text-sm leading-relaxed">{proj.description}</p>
                        </div>
                        <div className="pt-6 mt-6 border-t border-white/5 flex flex-wrap gap-2 items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {proj.technologies.slice(0, 3).map(tech => (
                              <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-white/5 opacity-70">{tech}</span>
                            ))}
                          </div>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold block underline hover:text-[var(--color-primary)] transition-all">
                              View Campaign
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
                    <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold">Professional History</h2>
                    <span className="text-[10px] font-mono opacity-50">RECORD // HISTORY</span>
                  </div>
                  <div className="space-y-6">
                    {data.experience.map((exp, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4"
                        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-surface)' }}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                            <h3 className="text-lg font-bold">{exp.role}</h3>
                          </div>
                          <p className="text-sm font-semibold opacity-75">{exp.company}</p>
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
                <section key="contact" className="py-16 text-center max-w-xl mx-auto space-y-6">
                  <Mail className="w-12 h-12 mx-auto" style={{ color: 'var(--color-primary)' }} />
                  <h2 className="text-3xl md:text-5xl font-extrabold" style={{ fontFamily: 'var(--font-heading)' }}>
                    Ready to scale?
                  </h2>
                  <p className="opacity-60 text-sm">
                    Schedule a strategy session today. Let's look over your metrics and optimize your conversion rates.
                  </p>
                  <div className="pt-4">
                    <a href={`mailto:${data.email}`} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold shadow-lg transition-all hover:scale-105"
                       style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
                      <span>Schedule Consultation</span>
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
