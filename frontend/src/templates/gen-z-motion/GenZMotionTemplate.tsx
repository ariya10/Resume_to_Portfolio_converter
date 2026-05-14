import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

const Marquee = ({ text }: { text: string }) => (
  <div className="overflow-hidden flex py-4 border-y-4 border-black transform -rotate-2 scale-105 my-12" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
    <motion.div 
      animate={{ x: [0, -1000] }}
      transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      className="flex whitespace-nowrap text-3xl font-black uppercase tracking-tighter"
    >
      {[...Array(10)].map((_, i) => (
        <span key={i} className="mx-4">{text} ✨</span>
      ))}
    </motion.div>
  </div>
);

export default function GenZMotionTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen selection:text-white overflow-hidden"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-text)' }}>
      
      {/* Fun background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          style={{ backgroundColor: 'var(--color-accent)' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Nav */}
        <nav className="py-6 flex justify-between items-center border-4 border-black rounded-full px-8 mt-6 shadow-[8px_8px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: 'var(--color-surface)' }}>
          <div className="font-black text-xl uppercase tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>{data.name}</div>
          <a href={`mailto:${data.email}`} className="px-6 py-2 rounded-full border-2 border-black font-bold hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
            SAY HI 👋
          </a>
        </nav>

        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="py-24 text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="inline-block border-4 border-black rounded-full px-8 py-3 font-bold text-xl mb-8 shadow-[6px_6px_0px_rgba(0,0,0,1)] transform -rotate-3 hover:rotate-3 transition-transform"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    {data.title}
                  </motion.div>
                  <motion.h1 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-7xl md:text-[120px] font-black uppercase tracking-tighter leading-[0.8] mb-8"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {data.name}
                  </motion.h1>
                  <motion.p 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl md:text-4xl font-bold max-w-3xl mx-auto leading-tight p-6 border-4 border-black rounded-3xl shadow-[8px_8px_0px_rgba(0,0,0,1)]"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    {data.summary}
                  </motion.p>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="py-20">
                  <Marquee text="FEATURED DROPS" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? 2 : -2 }}
                        className="border-4 border-black rounded-3xl p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
                        style={{ backgroundColor: 'var(--color-surface)' }}
                      >
                        <div>
                          <h3 className="text-4xl font-black uppercase mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{proj.name}</h3>
                          <p className="text-xl font-medium mb-8 border-b-4 border-black pb-8">{proj.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {proj.technologies.map(t => (
                            <span key={t} className="border-2 border-black px-4 py-2 rounded-full font-bold text-sm uppercase" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
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
                <section key="experience" className="py-20">
                  <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-center mb-16" style={{ fontFamily: 'var(--font-heading)' }}>
                    LORE
                  </h2>
                  <div className="space-y-8 max-w-4xl mx-auto">
                    {data.experience.map((exp, i) => (
                      <motion.div 
                        key={i}
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-6 md:items-center relative overflow-hidden group"
                        style={{ backgroundColor: 'var(--color-surface)' }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full border-b-4 border-l-4 border-black transform translate-x-16 -translate-y-16 group-hover:translate-x-0 group-hover:-translate-y-0 transition-transform" style={{ backgroundColor: 'var(--color-accent)' }}></div>
                        <div className="md:w-1/3">
                          <div className="inline-block bg-black text-white px-4 py-2 font-bold rounded-full mb-4 border-2 border-white transform -rotate-3" style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-bg)' }}>{exp.duration}</div>
                          <h3 className="text-3xl font-black uppercase" style={{ fontFamily: 'var(--font-heading)' }}>{exp.company}</h3>
                        </div>
                        <div className="md:w-2/3 relative z-10">
                          <h4 className="text-2xl font-bold mb-2" style={{ WebkitTextStroke: '1px black', color: 'var(--color-primary)' }}>{exp.role}</h4>
                          <p className="font-medium text-lg">{exp.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="py-20">
                  <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-center mb-16 text-white" style={{ WebkitTextStroke: '2px black', fontFamily: 'var(--font-heading)' }}>
                    STATS
                  </h2>
                  <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                    {data.skills.map((skill, i) => {
                      const colors = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-surface)', 'var(--color-bg)'];
                      const randomColor = colors[i % colors.length];
                      return (
                        <motion.div 
                          key={i}
                          drag
                          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                          whileHover={{ scale: 1.1, zIndex: 10 }}
                          whileTap={{ scale: 0.9 }}
                          className="border-4 border-black rounded-full px-8 py-4 text-2xl font-black uppercase shadow-[6px_6px_0px_rgba(0,0,0,1)] cursor-grab active:cursor-grabbing"
                          style={{ backgroundColor: randomColor }}
                        >
                          {skill}
                        </motion.div>
                      );
                    })}
                  </div>
                  <p className="text-center mt-8 font-bold" style={{ color: 'var(--color-text)' }}>(psst... you can drag these!)</p>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="py-32 flex flex-col items-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="border-8 border-black rounded-[50px] p-12 md:p-24 text-center shadow-[20px_20px_0px_rgba(0,0,0,1)] relative w-full max-w-4xl"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-bg)' }}>
                      Hit <br/> Me <br/> Up
                    </h2>
                    <a href={`mailto:${data.email}`} className="text-3xl md:text-5xl font-black uppercase px-12 py-6 border-4 border-white rounded-full transition-colors inline-block transform hover:-rotate-3" style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-bg)' }}>
                      SEND IT
                    </a>
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

