import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ProfileImage } from "@/components/templates/ProfileImage";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

function AmbientSpaceGlow({ customization }: { customization: CustomizationOptions }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    class Star {
      x: number;
      y: number;
      size: number;
      alpha: number;
      delta: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5;
        this.alpha = Math.random();
        this.delta = Math.random() * 0.015 + 0.005;
      }

      update() {
        this.alpha += this.delta;
        if (this.alpha > 1 || this.alpha < 0.2) this.delta *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const stars = Array.from({ length: 80 }, () => new Star());

    const render = () => {
      ctx.fillStyle = 'rgba(15, 17, 19, 0.2)';
      ctx.fillRect(0, 0, width, height);

      stars.forEach((s) => {
        s.update();
        s.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0 pointer-events-none opacity-45" />;
}

function ParallaxCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / (rect.height / 2)) * 8;
    const rotateY = (x / (rect.width / 2)) * 8;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="transition-transform duration-200 ease-out preserve-3d"
    >
      {children}
    </div>
  );
}

export default function Floating3dCardTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen relative selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0F1113]">
        <AmbientSpaceGlow customization={customization} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 space-y-24">
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="min-h-[80vh] flex flex-col justify-center">
                  <ParallaxCard>
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl max-w-2xl space-y-6 shadow-2xl">
                      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        {data.name}
                      </h1>
                      <h2 className="text-xl font-bold opacity-80" style={{ color: 'var(--color-primary)' }}>
                        {data.title}
                      </h2>
                      <p className="opacity-75 leading-relaxed text-sm">
                        {data.summary}
                      </p>
                      <div className="pt-2">
                        <ProfileImage customization={customization} sizeClassName="w-28 h-28 rounded-full border-2 border-white/20" />
                      </div>
                    </div>
                  </ParallaxCard>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="space-y-6">
                  <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold">Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 rounded-xl backdrop-blur-md bg-white/5 border border-white/5 text-xs font-semibold">
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
                        className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/5 hover:border-white/15 transition-all"
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
                  <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold">Archives</h2>
                  <div className="space-y-4">
                    {data.experience.map((exp, i) => (
                      <div key={i} className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/5 flex flex-col md:flex-row justify-between gap-4">
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
                <section key="contact" className="py-12 text-center max-w-xl mx-auto space-y-6 backdrop-blur-md bg-white/5 border border-white/5 rounded-3xl p-8">
                  <h2 className="text-2xl font-bold">Connect</h2>
                  <p className="opacity-70 text-xs max-w-sm mx-auto">
                    Open to consulting opportunities, remote roles, and creative partnerships.
                  </p>
                  <div className="pt-2">
                    <a href={`mailto:${data.email}`} className="inline-block px-8 py-3 rounded-xl font-bold border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-xs">
                      Send Email
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
