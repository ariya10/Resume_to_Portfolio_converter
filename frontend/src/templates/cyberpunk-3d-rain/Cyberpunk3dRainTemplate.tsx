import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ProfileImage } from "@/components/templates/ProfileImage";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

function Canvas2DCyberpunkRain({ customization }: { customization: CustomizationOptions }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const primaryColor = customization.colors.primary || '#39ff14';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const fontSize = 12;
    const columns = Math.floor(width / fontSize) + 1;
    const drops: number[] = Array.from({ length: columns }, () => Math.random() * -80);

    const matrixChars = "011010010111010101010110011001".split("");

    const render = () => {
      ctx.fillStyle = 'rgba(10, 11, 13, 0.15)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = primaryColor + 'aa';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.985) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [primaryColor]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0 opacity-25 pointer-events-none" />;
}

export default function Cyberpunk3dRainTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen relative selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0A0B0D]">
        <Canvas2DCyberpunkRain customization={customization} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 space-y-24">
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="min-h-[80vh] flex flex-col justify-center">
                  <div className="space-y-6 max-w-2xl border border-[var(--color-primary)]/20 p-8 rounded-xl bg-black/60 backdrop-blur-md">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>
                      {data.name}
                    </h1>
                    <h2 className="text-xl font-bold font-mono opacity-80" style={{ color: 'var(--color-primary)' }}>
                      CRITICAL_AGENT: {data.title}
                    </h2>
                    <p className="opacity-75 leading-relaxed font-mono text-xs">
                      {data.summary}
                    </p>
                    <div className="pt-4">
                      <ProfileImage customization={customization} sizeClassName="w-32 h-32 rounded-none border border-[var(--color-primary)]" />
                    </div>
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="space-y-6">
                  <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold font-mono">Capabilities Log</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 rounded border border-[var(--color-primary)]/30 bg-black/40 text-xs font-mono">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="space-y-8">
                  <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold font-mono">Active Sectors</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-6 rounded border border-[var(--color-primary)]/20 bg-black/40 backdrop-blur-sm"
                      >
                        <h3 className="text-lg font-bold font-mono">{proj.name}</h3>
                        <p className="opacity-70 text-xs mt-2 leading-relaxed font-mono">{proj.description}</p>
                        <div className="flex flex-wrap gap-1 mt-4">
                          {proj.technologies.slice(0, 3).map(tech => (
                            <span key={tech} className="text-[10px] px-2 py-0.5 border border-white/10 opacity-60">{tech}</span>
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
                <section key="experience" className="space-y-8">
                  <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold font-mono">Chronology Core</h2>
                  <div className="space-y-4">
                    {data.experience.map((exp, i) => (
                      <div key={i} className="p-6 rounded border border-[var(--color-primary)]/20 bg-black/40 flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold font-mono">{exp.role}</h3>
                          <p className="text-xs font-semibold opacity-70 font-mono" style={{ color: 'var(--color-primary)' }}>{exp.company}</p>
                          <p className="opacity-70 text-xs mt-1 leading-relaxed max-w-xl font-mono">{exp.description}</p>
                        </div>
                        <span className="shrink-0 text-xs font-mono opacity-50 self-start md:self-auto">{exp.duration}</span>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="py-12 text-center max-w-xl mx-auto space-y-6">
                  <h2 className="text-2xl font-bold font-mono">Terminal Dispatch</h2>
                  <p className="opacity-70 text-xs max-w-sm mx-auto font-mono">
                    Send a connection request to initiate communications interface.
                  </p>
                  <div className="pt-2">
                    <a href={`mailto:${data.email}`} className="inline-block px-8 py-3 rounded border border-[var(--color-primary)] bg-black/80 hover:bg-[var(--color-primary)] hover:text-black transition-all text-xs font-mono">
                      CONNECT()
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
