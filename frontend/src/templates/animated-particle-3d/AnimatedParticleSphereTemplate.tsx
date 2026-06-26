import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ProfileImage } from "@/components/templates/ProfileImage";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

function Canvas2DParticleSphere({ customization }: { customization: CustomizationOptions }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const primaryColor = customization.colors.primary || '#ff3366';

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

    const particles = Array.from({ length: 280 }, () => {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      return {
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi),
        baseRadius: Math.random() * 1.2 + 0.8
      };
    });

    let angleX = 0;
    let angleY = 0;

    let mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / width - 0.5) * 0.4;
      mouse.y = (e.clientY / height - 0.5) * 0.4;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width > 768 ? width * 0.75 : width * 0.5;
      const cy = height * 0.4;
      const radius = width > 768 ? 160 : 120;

      angleX += 0.003 + mouse.y * 0.04;
      angleY += 0.004 + mouse.x * 0.04;

      particles.forEach((p) => {
        let x1 = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
        let z1 = p.x * Math.sin(angleY) + p.z * Math.cos(angleY);

        let y2 = p.y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = p.y * Math.sin(angleX) + z1 * Math.cos(angleX);

        const dist = 3.5;
        const scaleFactor = dist / (dist + z2);
        const px = cx + x1 * radius * scaleFactor;
        const py = cy + y2 * radius * scaleFactor;

        ctx.beginPath();
        const sizeScale = 1.0 + Math.sin(Date.now() * 0.003) * 0.25;
        const size = p.baseRadius * scaleFactor * sizeScale;

        const alpha = (z2 + 1.2) / 2.4;
        ctx.fillStyle = `${primaryColor}${Math.floor(alpha * 220).toString(16).padStart(2, '0')}`;

        ctx.arc(px, py, Math.max(0.5, size), 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [primaryColor]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0 pointer-events-none" />;
}

export default function AnimatedParticleSphereTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen relative selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0A0B0D]">
        <Canvas2DParticleSphere customization={customization} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 space-y-24">
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="min-h-[80vh] flex flex-col justify-center">
                  <div className="space-y-6 max-w-2xl bg-white/[0.01] border border-white/5 p-8 rounded-3xl backdrop-blur-md">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                      {data.name}
                    </h1>
                    <h2 className="text-xl font-bold opacity-80" style={{ color: 'var(--color-primary)' }}>
                      {data.title}
                    </h2>
                    <p className="opacity-75 leading-relaxed text-sm">
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
                  <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold">Specialization</h2>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 rounded-xl backdrop-blur-md bg-white/[0.02] border border-white/5 text-xs font-semibold">
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
                  <h2 className="text-xs uppercase tracking-widest opacity-60 font-semibold">Developments</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-2xl backdrop-blur-md bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all"
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
                      <div key={i} className="p-6 rounded-2xl backdrop-blur-md bg-white/[0.02] border border-white/5 flex flex-col md:flex-row justify-between gap-4">
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
                <section key="contact" className="py-12 text-center max-w-xl mx-auto space-y-6 backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                  <h2 className="text-2xl font-bold">Signal Link</h2>
                  <p className="opacity-70 text-xs max-w-sm mx-auto">
                    Initiate a connection dialogue. I will respond to valid requests.
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
