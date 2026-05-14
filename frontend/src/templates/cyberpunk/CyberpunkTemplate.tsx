import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { Terminal, Code2, Zap, LayoutGrid, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function CyberpunkTemplate({ data, customization }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Glow pulse effect on neon texts
      gsap.to('.neon-text', {
        textShadow: "0 0 10px var(--color-primary), 0 0 20px var(--color-primary), 0 0 30px var(--color-primary)",
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });

      // Holographic card floating effect
      gsap.to('.holo-card', {
        y: -10,
        rotationX: 5,
        rotationY: -5,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
        stagger: 0.2
      });
      
    }, containerRef);
    return () => ctx.revert();
  }, [data]);

  return (
    <div 
      ref={containerRef}
      className="bg-[var(--color-bg)] text-[var(--color-primary)] min-h-screen selection:bg-[var(--color-accent)] selection:text-white"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) scale(2) translateY(-100px)' }}>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-12">
        {/* Header Terminal style */}
        <header className="border border-[var(--color-primary)]/30 bg-black/50 p-4 backdrop-blur-sm mb-20 flex justify-between items-center rounded-sm">
          <div className="flex items-center gap-3">
             <Terminal className="w-5 h-5 text-[var(--color-accent)]" />
             <span className="font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-heading)' }}>SYS.ADMIN // {data.name}</span>
          </div>
          <div className="text-xs opacity-70">
            STATUS: <span style={{ color: 'var(--color-primary)' }}>ONLINE</span>
          </div>
        </header>

        {visibleSections.map((sectionType) => {
          switch (sectionType) {
            case 'hero':
              return (
                <section key="hero" className="mb-32 relative">
                  <div className="absolute -left-10 top-0 w-1 h-full bg-gradient-to-b from-[var(--color-accent)] to-transparent"></div>
                  <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 neon-text" style={{ fontFamily: 'var(--font-heading)' }}>{data.title}</h1>
                    <p className="text-[var(--color-accent)] text-xl md:text-2xl mb-8 uppercase tracking-widest font-bold">&gt; {data.name}</p>
                    <div className="p-6 border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 backdrop-blur-md max-w-2xl text-[var(--color-text)] leading-relaxed shadow-[0_0_15px_rgba(0,255,255,0.1)]" style={{ fontFamily: 'var(--font-body)' }}>{data.summary}</div>
                  </motion.div>
                </section>
              );
            case 'skills':
              return (
                <section key="skills" className="mb-32">
                  <h2 className="text-2xl font-bold uppercase mb-8 flex items-center gap-3 text-[var(--color-accent)]" style={{ fontFamily: 'var(--font-heading)' }}><Cpu className="w-6 h-6" /> TECH_STACK.EXE</h2>
                  <div className="flex flex-wrap gap-4">
                    {data.skills.map((skill, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="px-4 py-2 border border-[var(--color-primary)] bg-black/50 text-sm tracking-widest uppercase hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-all cursor-crosshair">
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </section>
              );
            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="mb-32">
                  <h2 className="text-2xl font-bold uppercase mb-8 flex items-center gap-3 text-[var(--color-accent)]" style={{ fontFamily: 'var(--font-heading)' }}><LayoutGrid className="w-6 h-6" /> DATABANKS.OBJ</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.projects.map((proj, i) => (
                      <div key={i} className="holo-card p-8 border border-[var(--color-accent)]/50 bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-accent)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                        <h3 className="text-2xl font-bold mb-4 text-white uppercase" style={{ fontFamily: 'var(--font-heading)' }}>{proj.name}</h3>
                        <p className="text-[var(--color-text)] opacity-70 mb-6 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{proj.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {proj.technologies.map((tech, j) => <span key={j} className="text-[10px] text-[var(--color-primary)] border border-[var(--color-primary)]/30 px-2 py-1 uppercase">{tech}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            case 'experience':
              if (!data.experience?.length) return null;
              return (
                <section key="experience" className="mb-32">
                  <h2 className="text-2xl font-bold uppercase mb-8 flex items-center gap-3 text-[var(--color-accent)]" style={{ fontFamily: 'var(--font-heading)' }}><Code2 className="w-6 h-6" /> EXEC_LOG.TXT</h2>
                  <div className="border border-[var(--color-primary)]/30 bg-black/80 p-6 font-mono text-sm shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                    {data.experience.map((exp, i) => (
                      <div key={i} className="mb-8 last:mb-0">
                        <div className="text-[var(--color-primary)] mb-2">$ cat {exp.company.replace(/\s+/g, '_').toLowerCase()}.log</div>
                        <div className="pl-4 border-l-2 border-[var(--color-primary)]/30">
                          <div className="text-white font-bold mb-1">[{exp.duration}] {exp.role}</div>
                          <div className="text-[var(--color-text)] opacity-70" style={{ fontFamily: 'var(--font-body)' }}>{exp.description}</div>
                        </div>
                      </div>
                    ))}
                    <div className="text-[var(--color-primary)] mt-4">$ cursor<span className="animate-pulse">_</span></div>
                  </div>
                </section>
              );
            case 'contact':
              return (
                <section key="contact" className="pb-32 text-center">
                   <Zap className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-6" />
                   <h2 className="text-3xl font-black uppercase mb-6 neon-text" style={{ fontFamily: 'var(--font-heading)' }}>Initiate Connection</h2>
                   <a href={`mailto:${data.email}`} className="inline-block px-8 py-4 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold tracking-widest uppercase hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-all shadow-[0_0_15px_rgba(0,255,255,0.4)]">
                     Ping Server
                   </a>
                </section>
              );
            default: return null;
          }
        })}
      </div>
    </div>
  );
}
