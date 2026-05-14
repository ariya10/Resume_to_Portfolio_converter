import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function EditorialMagazineTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      {/* Decorative Border */}
      <div className="fixed inset-4 border pointer-events-none z-50" style={{ borderColor: 'var(--color-text)' }}></div>

      <div className="max-w-7xl mx-auto px-8 md:px-16 py-12">
        {/* Masthead */}
        <header className="border-b-2 pb-6 mb-16 flex justify-between items-end" style={{ borderColor: 'var(--color-text)' }}>
          <div className="text-[10px] md:text-xs uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-mono)' }}>
            Issue 01 <br /> {new Date().getFullYear()}
          </div>
          <div className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-center leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
            {data.name.split(' ')[0]} <br className="md:hidden" />
            <span className="italic font-light tracking-normal lowercase text-3xl md:text-6xl" style={{ color: 'var(--color-primary)' }}>&amp;</span> {data.name.split(' ').slice(1).join(' ')}
          </div>
          <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-right" style={{ fontFamily: 'var(--font-mono)' }}>
            {data.location} <br /> Selected Works
          </div>
        </header>

        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="mb-32">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    <div className="col-span-1 md:col-span-8">
                      <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-5xl md:text-8xl leading-[0.9] font-medium tracking-tight mb-8"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {data.title.split(' ').map((w, i) => (
                          i % 2 === 1 ? <span key={i} className="italic" style={{ color: 'var(--color-primary)' }}>{w} </span> : <span key={i}>{w} </span>
                        ))}
                      </motion.h1>
                    </div>
                    <div className="col-span-1 md:col-span-4">
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-lg md:text-xl leading-relaxed border-l pl-6 opacity-80"
                        style={{ borderColor: 'var(--color-text)' }}
                      >
                        {data.summary}
                      </motion.p>
                    </div>
                  </div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="mb-32">
                  <div className="flex items-center gap-4 mb-16">
                    <h2 className="text-3xl md:text-5xl italic" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>Index of Works</h2>
                    <div className="flex-1 border-t" style={{ borderColor: 'var(--color-text)' }}></div>
                  </div>
                  <div className="space-y-24">
                    {data.projects.map((proj, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start group"
                      >
                        <div className="col-span-1 md:col-span-1 text-2xl italic font-light" style={{ color: 'var(--color-primary)' }}>
                          {(idx + 1).toString().padStart(2, '0')}
                        </div>
                        <div className="col-span-1 md:col-span-5">
                          <h3 className="text-4xl md:text-6xl font-medium tracking-tight group-hover:italic transition-all duration-300" style={{ fontFamily: 'var(--font-heading)' }}>
                            {proj.name}
                          </h3>
                        </div>
                        <div className="col-span-1 md:col-span-4 mt-2">
                          <p className="text-lg leading-relaxed opacity-80 mb-4">
                            {proj.description}
                          </p>
                          <div className="text-xs uppercase tracking-widest opacity-60" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>
                            {proj.technologies.join(' • ')}
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
                <section key="experience" className="mb-32">
                  <div className="flex items-center gap-4 mb-16">
                    <div className="flex-1 border-t" style={{ borderColor: 'var(--color-text)' }}></div>
                    <h2 className="text-3xl md:text-5xl italic" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>Chronology</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                    {data.experience.map((exp, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="border-b pb-8"
                        style={{ borderColor: 'var(--color-text)', borderOpacity: 0.2 }}
                      >
                        <div className="text-sm tracking-widest uppercase mb-4" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>
                          {exp.duration}
                        </div>
                        <h3 className="text-3xl font-medium mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{exp.role}</h3>
                        <h4 className="text-xl italic mb-6" style={{ color: 'var(--color-primary)' }}>{exp.company}</h4>
                        <p className="opacity-80 leading-relaxed">
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
                <section key="skills" className="mb-32 p-12 -mx-8 md:-mx-16" style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-bg)' }}>
                  <h2 className="text-3xl md:text-5xl italic text-center mb-16" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>Disciplines</h2>
                  <div className="flex flex-wrap justify-center gap-6 md:gap-12 max-w-4xl mx-auto">
                    {data.skills.map((skill, idx) => (
                      <span key={idx} className="text-2xl md:text-4xl font-light tracking-tight hover:italic transition-all cursor-default" style={{ fontFamily: 'var(--font-heading)' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="py-24 text-center">
                  <h2 className="text-5xl md:text-8xl font-medium tracking-tight mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
                    Let's <span className="italic" style={{ color: 'var(--color-primary)' }}>Converse.</span>
                  </h2>
                  <a href={`mailto:${data.email}`} className="inline-block text-2xl md:text-4xl border-b-2 pb-2 hover:opacity-70 transition-colors" style={{ color: 'var(--color-text)', borderColor: 'var(--color-text)' }}>
                    {data.email}
                  </a>
                  <div className="mt-16 text-xs uppercase tracking-widest flex justify-center gap-8 opacity-60" style={{ fontFamily: 'var(--font-mono)' }}>
                    {data.linkedin && <a href={data.linkedin} className="hover:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)' }}>LinkedIn</a>}
                    {data.github && <a href={data.github} className="hover:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)' }}>GitHub</a>}
                    {data.website && <a href={data.website} className="hover:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)' }}>Website</a>}
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

