import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ProfileImage } from "@/components/templates/ProfileImage";
import { Camera, Image as ImageIcon, MapPin } from "lucide-react";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function PhotographerTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen selection:text-white pb-24"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 py-16 space-y-32">
        
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="min-h-[80vh] flex flex-col justify-between py-8">
                  <div className="flex justify-between items-center border-b border-white/10 pb-6">
                    <div className="flex items-center gap-2">
                      <Camera className="w-5 h-5 opacity-70" />
                      <span className="text-xs uppercase tracking-widest font-bold">Captured Moments</span>
                    </div>
                    <span className="text-xs font-mono opacity-50">{data.location}</span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-12 items-center my-12">
                    <div className="flex-1 space-y-6">
                      <h1 className="text-5xl md:text-8xl font-light tracking-tighter leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                        {data.name}
                      </h1>
                      <h2 className="text-lg md:text-xl tracking-widest uppercase opacity-70 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {data.title}
                      </h2>
                      <p className="text-lg opacity-70 leading-relaxed font-light max-w-xl">
                        {data.summary}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center justify-center">
                      <div className="border border-white/10 p-2 bg-white/5 rounded-2xl">
                        <ProfileImage customization={customization} sizeClassName="w-48 h-48 md:w-64 md:h-64 rounded-xl" />
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-mono opacity-40 border-t border-white/10 pt-6">
                    &copy; {new Date().getFullYear()} All visual rights reserved.
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="space-y-8">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                    <Camera className="w-4.5 h-4.5 opacity-60" />
                    <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold">Creative Domains</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {data.skills.map((skill, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] rounded-xl transition-all"
                      >
                        <span className="text-[10px] font-mono opacity-40 block mb-2">DOMAIN // 0{i+1}</span>
                        <h3 className="text-lg font-medium">{skill}</h3>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="space-y-12">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4.5 h-4.5 opacity-60" />
                      <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold">Exhibitions</h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4 group"
                      >
                        <div className="aspect-[3/4] w-full bg-white/5 rounded-xl overflow-hidden relative border border-white/10 flex items-center justify-center p-6">
                          <span className="text-7xl font-light opacity-5 absolute select-none">{i+1}</span>
                          <div className="text-center space-y-2 z-10 opacity-60 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs font-mono uppercase tracking-widest opacity-50">GALLERY</p>
                            <h4 className="text-xl font-bold uppercase tracking-tight">{proj.name}</h4>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold">{proj.name}</h3>
                          <p className="opacity-60 text-xs leading-relaxed font-light">{proj.description}</p>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold block pt-2 underline underline-offset-4 hover:text-[var(--color-primary)] transition-all">
                              View Exhibition
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
                  <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                    <Camera className="w-4.5 h-4.5 opacity-60" />
                    <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold">Chronicles</h2>
                  </div>
                  <div className="space-y-6 max-w-3xl">
                    {data.experience.map((exp, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-white/5 gap-2"
                      >
                        <span className="text-xs font-mono opacity-50">{exp.duration}</span>
                        <div className="flex-1 md:px-8">
                          <h3 className="text-lg font-bold">{exp.role} <span className="opacity-40 font-light">at</span> {exp.company}</h3>
                          <p className="opacity-60 text-xs leading-relaxed font-light mt-1">{exp.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="py-16 text-center max-w-xl mx-auto space-y-6">
                  <h2 className="text-3xl md:text-5xl font-light tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
                    Capture something <span className="italic font-normal">extraordinary</span>.
                  </h2>
                  <p className="opacity-60 text-sm font-light">
                    Available for editorial assignments, landscape commissions, and creative art direction.
                  </p>
                  <div className="pt-4">
                    <a href={`mailto:${data.email}`} className="inline-block px-8 py-3.5 rounded-full border border-white/20 hover:border-white/80 hover:bg-white text-white hover:text-black transition-all text-xs uppercase tracking-wider font-mono">
                      Request Shoot
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
