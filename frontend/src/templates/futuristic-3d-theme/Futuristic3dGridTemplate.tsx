import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ProfileImage } from "@/components/templates/ProfileImage";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

function Canvas2DConstellation({ customization }: { customization: CustomizationOptions }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const primaryColor = customization.colors.primary || '#00f5ff';

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

    class Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = primaryColor;
        ctx.fill();
      }
    }

    const nodes = Array.from({ length: 65 }, () => new Node());

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.update();
        n1.draw();

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          if (dist < 130) {
            const alpha = (130 - dist) / 130 * 0.2;
            ctx.strokeStyle = `${primaryColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [primaryColor]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0 pointer-events-none" />;
}

export default function Futuristic3dGridTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen relative selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Canvas2DConstellation customization={customization} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 space-y-24">
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="min-h-[80vh] flex flex-col justify-center">
                  <div className="space-y-6 max-w-2xl">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                      {data.name}
                    </h1>
                    <h2 className="text-2xl font-bold opacity-80" style={{ color: 'var(--color-primary)' }}>
                      &gt; {data.title}
                    </h2>
                    <p className="opacity-75 leading-relaxed">
                      {data.summary}
                    </p>
                    <div className="pt-4">
                      <ProfileImage customization={customization} sizeClassName="w-32 h-32 rounded-xl" />
                    </div>
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="space-y-6">
                  <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold">Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 rounded-xl border border-white/5 bg-white/[0.01] text-xs font-mono">
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
                  <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold">Deployments</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02]"
                      >
                        <h3 className="text-lg font-bold">{proj.name}</h3>
                        <p className="opacity-70 text-xs mt-2 leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-1 mt-4">
                          {proj.technologies.slice(0, 3).map(tech => (
                            <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-white/5 opacity-60">{tech}</span>
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
                  <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold">Log</h2>
                  <div className="space-y-4">
                    {data.experience.map((exp, i) => (
                      <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold">{exp.role}</h3>
                          <p className="text-xs font-semibold opacity-70" style={{ color: 'var(--color-primary)' }}>{exp.company}</p>
                          <p className="opacity-70 text-xs mt-1 leading-relaxed max-w-xl">{exp.description}</p>
                        </div>
                        <span className="shrink-0 text-xs opacity-50 font-semibold self-start md:self-auto">{exp.duration}</span>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="py-12 text-center max-w-xl mx-auto space-y-6">
                  <h2 className="text-2xl font-bold">Contact Node</h2>
                  <p className="opacity-70 text-xs max-w-sm mx-auto">
                    Initialize communication. Ping the direct endpoint.
                  </p>
                  <div className="pt-2">
                    <a href={`mailto:${data.email}`} className="inline-block px-8 py-3 rounded-xl font-bold transition-all hover:scale-105"
                       style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
                      Connect
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
