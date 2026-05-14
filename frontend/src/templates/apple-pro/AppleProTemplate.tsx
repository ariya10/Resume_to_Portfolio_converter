import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function AppleProTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen font-sans antialiased selection:bg-[var(--color-primary)] selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full h-[44px] backdrop-blur-md border-b border-[var(--color-text)]/5 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-bg)', opacity: 0.8 }}>
        <div className="max-w-[980px] w-full flex justify-between items-center text-[12px] font-medium tracking-wide">
          <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{data.name}</span>
          <div className="flex gap-6 opacity-80">
            {visibleSections.map(s => (
              <span key={s} className="capitalize cursor-pointer hover:text-[var(--color-primary)] transition-colors">{s}</span>
            ))}
          </div>
        </div>
      </nav>

      {visibleSections.map((sectionType) => {
        switch (sectionType) {
          case 'hero':
            return (
              <section key="hero" className="min-h-screen flex flex-col items-center justify-center pt-[44px] px-4 text-center">
                <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="text-[21px] md:text-[28px] font-semibold tracking-tight mb-2 opacity-60" style={{ fontFamily: 'var(--font-heading)' }}>{data.title}</motion.h2>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="text-[56px] md:text-[80px] font-semibold tracking-tighter leading-tight mb-8 max-w-[800px]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {data.summary.substring(0, 80)}...
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="text-[19px] md:text-[21px] font-medium tracking-tight opacity-60 max-w-[600px] leading-relaxed mb-12">
                  {data.summary}
                </motion.p>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 1 }}>
                  <a href={`mailto:${data.email}`} className="text-white px-8 py-3 rounded-full text-[17px] font-medium transition-colors" style={{ backgroundColor: 'var(--color-primary)' }}>Contact Me</a>
                </motion.div>
              </section>
            );

          case 'projects':
            if (!data.projects?.length) return null;
            return (
              <section key="projects" className="py-32 px-4" style={{ backgroundColor: 'var(--color-bg)' }}>
                <div className="max-w-[1200px] mx-auto">
                  <h2 className="text-[48px] font-semibold tracking-tighter text-center mb-20" style={{ fontFamily: 'var(--font-heading)' }}>Selected Work.</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.projects.map((proj, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="rounded-3xl p-10 overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-[var(--color-text)]/5" style={{ backgroundColor: 'var(--color-surface)' }}>
                        <h3 className="text-[28px] font-semibold tracking-tight mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{proj.name}</h3>
                        <p className="text-[17px] opacity-60 leading-relaxed mb-8 font-medium">{proj.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {proj.technologies.map((tech, j) => (
                            <span key={j} className="text-[12px] font-medium px-3 py-1 rounded-full shadow-sm" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>{tech}</span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'experience':
            if (!data.experience?.length) return null;
            return (
              <section key="experience" className="py-32 px-4" style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-bg)' }}>
                <div className="max-w-[980px] mx-auto">
                  <h2 className="text-[48px] font-semibold tracking-tighter text-center mb-24" style={{ color: 'var(--color-bg)', fontFamily: 'var(--font-heading)' }}>Experience.</h2>
                  <div className="space-y-24">
                    {data.experience.map((exp, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-[var(--color-bg)]/10 pt-8">
                        <div className="col-span-1 md:col-span-4">
                          <h3 className="text-[24px] font-semibold" style={{ color: 'var(--color-bg)' }}>{exp.company}</h3>
                          <p className="text-[17px] opacity-60 font-medium" style={{ color: 'var(--color-bg)' }}>{exp.duration}</p>
                        </div>
                        <div className="col-span-1 md:col-span-8">
                          <h4 className="text-[24px] font-semibold mb-4" style={{ color: 'var(--color-bg)' }}>{exp.role}</h4>
                          <p className="text-[19px] leading-relaxed opacity-60 font-medium" style={{ color: 'var(--color-bg)' }}>{exp.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'skills':
            if (!data.skills?.length) return null;
            return (
              <section key="skills" className="py-32 px-4" style={{ backgroundColor: 'var(--color-bg)' }}>
                <div className="max-w-[980px] mx-auto text-center">
                  <h2 className="text-[48px] font-semibold tracking-tighter mb-16" style={{ fontFamily: 'var(--font-heading)' }}>Skills.</h2>
                  <div className="flex flex-wrap justify-center gap-4">
                    {data.skills.map((skill, i) => (
                      <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="px-6 py-3 rounded-full text-[17px] font-medium" style={{ backgroundColor: 'var(--color-surface)' }}>
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'contact':
            return (
              <section key="contact" className="py-32 px-4 text-center" style={{ backgroundColor: 'var(--color-bg)' }}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="max-w-[800px] mx-auto">
                  <h2 className="text-[56px] font-semibold tracking-tighter mb-8" style={{ fontFamily: 'var(--font-heading)' }}>Let's build something together.</h2>
                  <a href={`mailto:${data.email}`} className="text-[24px] font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>{data.email}</a>
                </motion.div>
              </section>
            );

          default: return null;
        }
      })}

      {/* Footer */}
      <footer className="py-8 text-center text-[12px] font-medium border-t border-[var(--color-text)]/5" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}>
        Copyright &copy; {new Date().getFullYear()} {data.name}. All rights reserved.
      </footer>
    </div>
  );
}

