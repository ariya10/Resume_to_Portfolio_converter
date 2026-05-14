import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function MinimalSwissTemplate({ data, customization }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div 
      ref={containerRef}
      className="bg-[var(--color-bg)] text-[var(--color-text)] min-h-screen selection:bg-[var(--color-primary)] selection:text-[var(--color-bg)]"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Navigation / Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="py-12 flex justify-between items-start"
        >
          <div className="font-bold text-sm tracking-tight uppercase w-1/4">
            {data.name} <br/> 
            <span className="opacity-50">Folio &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="text-right text-sm font-medium uppercase tracking-tight w-1/4">
            {data.location} <br/>
            <a href={`mailto:${data.email}`} className="hover:opacity-50 transition-opacity">Contact</a>
          </div>
        </motion.header>

        {visibleSections.map((sectionType) => {
          switch (sectionType) {
            case 'hero':
              return (
                <motion.section key="hero" initial="hidden" animate="visible" variants={stagger} className="pt-32 pb-48 grid grid-cols-12 gap-8 items-end">
                  <div className="col-span-12 md:col-span-9">
                    <motion.h1 variants={fadeUp} className="text-[10vw] leading-[0.85] font-black tracking-tighter uppercase ml-[-0.5vw]" style={{ fontFamily: 'var(--font-heading)' }}>
                      {data.title.split(' ').map((word, i) => <span key={i} className="block">{word}</span>)}
                    </motion.h1>
                  </div>
                  <motion.div variants={fadeUp} className="col-span-12 md:col-span-3 pb-4">
                    <p className="text-lg font-medium leading-tight max-w-sm text-[var(--color-text-secondary)]">{data.summary}</p>
                  </motion.div>
                </motion.section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="py-32 border-t border-[var(--color-text)]/10">
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="grid grid-cols-12 gap-8 mb-24">
                    <div className="col-span-12 md:col-span-4"><h2 className="text-3xl font-bold tracking-tight uppercase" style={{ fontFamily: 'var(--font-heading)' }}>Selected Works</h2></div>
                  </motion.div>
                  <div className="flex flex-col">
                    {data.projects.map((project, idx) => (
                      <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="group grid grid-cols-12 gap-8 py-12 border-b border-[var(--color-text)]/10 items-center hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-colors duration-500 -mx-6 md:-mx-12 px-6 md:px-12 cursor-pointer">
                        <div className="col-span-12 md:col-span-1 text-sm font-bold opacity-50 group-hover:opacity-100">0{idx + 1}</div>
                        <div className="col-span-12 md:col-span-5"><h3 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase" style={{ fontFamily: 'var(--font-heading)' }}>{project.name}</h3></div>
                        <div className="col-span-12 md:col-span-4"><p className="text-sm font-medium leading-relaxed opacity-70 group-hover:opacity-100">{project.description}</p></div>
                        <div className="col-span-12 md:col-span-2 text-right"><span className="text-xs uppercase tracking-widest border border-current rounded-full px-4 py-2">View Project</span></div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'experience':
              if (!data.experience?.length) return null;
              return (
                <section key="experience" className="py-32 border-t border-[var(--color-text)]/10 grid grid-cols-12 gap-8">
                  <div className="col-span-12 md:col-span-4 mb-12 md:mb-0"><h2 className="text-3xl font-bold tracking-tight uppercase sticky top-24" style={{ fontFamily: 'var(--font-heading)' }}>Experience</h2></div>
                  <div className="col-span-12 md:col-span-8 flex flex-col gap-16">
                    {data.experience.map((exp, idx) => (
                      <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><h3 className="text-2xl font-bold uppercase" style={{ fontFamily: 'var(--font-heading)' }}>{exp.role}</h3><p className="text-lg font-medium opacity-50">{exp.company}</p></div>
                        <div><p className="text-sm font-bold tracking-widest uppercase mb-4 opacity-50">{exp.duration}</p><p className="text-base font-medium leading-relaxed text-[var(--color-text-secondary)]">{exp.description}</p></div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'skills':
              return (
                <section key="skills" className="py-32 border-t border-[var(--color-text)]/10 grid grid-cols-12 gap-8">
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="col-span-12 border-r-0 md:border-r border-[var(--color-text)]/10 pr-0 md:pr-12 mb-24 md:mb-0">
                    <h2 className="text-3xl font-bold tracking-tight uppercase mb-12" style={{ fontFamily: 'var(--font-heading)' }}>Core Capabilities</h2>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill, idx) => (
                        <span key={idx} className="text-sm font-medium uppercase tracking-widest border border-[var(--color-text)]/20 rounded-full px-5 py-2 hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-colors cursor-default">{skill}</span>
                      ))}
                    </div>
                  </motion.div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="py-32 border-t border-[var(--color-text)]/10 grid grid-cols-12 gap-8">
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="col-span-12 flex flex-col justify-between">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight uppercase mb-12" style={{ fontFamily: 'var(--font-heading)' }}>Let's Connect</h2>
                      <h3 className="text-[5vw] md:text-6xl font-black tracking-tighter uppercase leading-none mb-8 hover:italic transition-all" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                        <a href={`mailto:${data.email}`}>{data.email}</a>
                      </h3>
                    </div>
                    <div className="flex gap-8 text-sm font-bold tracking-widest uppercase opacity-50">
                      {data.linkedin && <a href={data.linkedin} className="hover:opacity-100 transition-opacity hover:text-[var(--color-primary)]">LinkedIn</a>}
                      {data.github && <a href={data.github} className="hover:opacity-100 transition-opacity hover:text-[var(--color-primary)]">GitHub</a>}
                      {data.website && <a href={data.website} className="hover:opacity-100 transition-opacity hover:text-[var(--color-primary)]">Website</a>}
                    </div>
                  </motion.div>
                </section>
              );

            default: return null;
          }
        })}
        
      </div>
    </div>
  );
}

