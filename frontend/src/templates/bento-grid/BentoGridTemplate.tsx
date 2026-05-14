import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from 'lucide-react';

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

const item = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function BentoGridTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen p-4 md:p-8 selection:bg-[var(--color-primary)] selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
      
      <div className="max-w-[1200px] mx-auto">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[200px]"
        >
          
          {visibleSections.map(section => {
            switch(section) {
              case 'hero':
                return (
                  <React.Fragment key="hero">
                    {/* Main Name/Title Card */}
                    <motion.div variants={item} className="col-span-1 md:col-span-4 lg:col-span-4 row-span-2 rounded-3xl p-8 md:p-12 shadow-sm border border-[var(--color-text)]/5 flex flex-col justify-between group hover:shadow-md transition-shadow" style={{ backgroundColor: 'var(--color-surface)' }}>
                      <div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{data.name}</h1>
                        <h2 className="text-xl md:text-2xl font-medium opacity-60" style={{ color: 'var(--color-primary)' }}>{data.title}</h2>
                      </div>
                      <p className="text-lg opacity-70 max-w-xl leading-relaxed mt-4">
                        {data.summary}
                      </p>
                    </motion.div>

                    {/* Image or Location Card */}
                    <motion.div variants={item} className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 rounded-3xl p-8 shadow-sm border border-[var(--color-text)]/5 flex flex-col justify-center items-center text-center relative overflow-hidden group" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
                      <div className="absolute inset-0 bg-black/10 transform scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full opacity-50 origin-center"></div>
                      <MapPin className="w-8 h-8 mb-3 relative z-10" />
                      <h3 className="font-bold text-lg relative z-10">Location</h3>
                      <p className="opacity-80 relative z-10">{data.location}</p>
                    </motion.div>

                    {/* Social/Contact Cards */}
                    <motion.div variants={item} className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 grid grid-cols-2 gap-4">
                      <a href={`mailto:${data.email}`} className="rounded-3xl p-6 shadow-sm border border-[var(--color-text)]/5 flex flex-col items-center justify-center hover:opacity-80 transition-colors group" style={{ backgroundColor: 'var(--color-surface)' }}>
                        <Mail className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity mb-2" style={{ color: 'var(--color-primary)' }} />
                        <span className="text-sm font-semibold">Email</span>
                      </a>
                      <a href={data.linkedin || '#'} className="text-white rounded-3xl p-6 shadow-sm border border-black/5 flex flex-col items-center justify-center hover:opacity-90 transition-colors" style={{ backgroundColor: '#0A66C2' }}>
                        <Linkedin className="w-8 h-8 mb-2" />
                        <span className="text-sm font-semibold">LinkedIn</span>
                      </a>
                    </motion.div>
                  </React.Fragment>
                );

              case 'projects':
                if (!data.projects?.length) return null;
                return (
                  <motion.div key="projects" variants={item} className="col-span-1 md:col-span-4 lg:col-span-6 row-span-2 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col" style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-bg)' }}>
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Featured Projects</h2>
                      <ArrowUpRight className="w-6 h-6 opacity-40" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                      {data.projects.slice(0, 3).map((proj, i) => (
                        <div key={i} className="rounded-2xl p-6 flex flex-col justify-between border border-[var(--color-bg)]/10 hover:bg-[var(--color-bg)]/5 transition-colors" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', opacity: 0.9 }}>
                          <div>
                            <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{proj.name}</h3>
                            <p className="text-sm opacity-60 line-clamp-3">{proj.description}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {proj.technologies.slice(0,3).map(t => <span key={t} className="text-xs px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>{t}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'experience':
                if (!data.experience?.length) return null;
                return (
                  <motion.div key="experience" variants={item} className="col-span-1 md:col-span-4 lg:col-span-3 row-span-2 rounded-3xl p-8 shadow-sm border border-[var(--color-text)]/5 overflow-hidden flex flex-col" style={{ backgroundColor: 'var(--color-surface)' }}>
                    <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Experience</h2>
                    <div className="flex-1 overflow-y-auto pr-4 space-y-6">
                      {data.experience.map((exp, i) => (
                        <div key={i} className="relative pl-6 border-l-2 border-[var(--color-text)]/10">
                          <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1.5 border-4" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-surface)' }}></div>
                          <h3 className="font-bold">{exp.role}</h3>
                          <div className="text-sm opacity-50 mb-2">{exp.company} • {exp.duration}</div>
                          <p className="text-sm opacity-70 line-clamp-2">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'skills':
                if (!data.skills?.length) return null;
                return (
                  <motion.div key="skills" variants={item} className="col-span-1 md:col-span-2 lg:col-span-3 row-span-2 rounded-3xl p-8 shadow-sm border border-[var(--color-text)]/5 border-dashed" style={{ backgroundColor: 'var(--color-surface)', opacity: 0.8 }}>
                    <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Tech Stack</h2>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill, i) => (
                        <span key={i} className="px-4 py-2 rounded-xl text-sm font-semibold shadow-sm border border-[var(--color-text)]/5" style={{ backgroundColor: 'var(--color-bg)' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );

              case 'contact':
                return (
                  <motion.div key="contact" variants={item} className="col-span-1 md:col-span-4 lg:col-span-6 row-span-1 rounded-3xl p-8 flex items-center justify-between group cursor-pointer" style={{ background: `linear-gradient(to right, var(--color-primary), var(--color-accent))`, color: 'var(--color-bg)' }}>
                    <div>
                      <h2 className="text-3xl font-bold mb-2 group-hover:scale-105 transition-transform origin-left" style={{ fontFamily: 'var(--font-heading)' }}>Let's work together</h2>
                      <p className="opacity-80">I'm currently available for new opportunities.</p>
                    </div>
                    <div className="bg-black/10 p-4 rounded-full group-hover:bg-black/20 transition-colors">
                      <ArrowUpRight className="w-8 h-8" />
                    </div>
                  </motion.div>
                );

              default: return null;
            }
          })}
        </motion.div>
      </div>
    </div>
  );
}

