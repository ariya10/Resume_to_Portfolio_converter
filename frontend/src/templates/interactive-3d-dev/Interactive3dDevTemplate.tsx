import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ProfileImage } from "@/components/templates/ProfileImage";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

function InteractiveCanvasFloatingShapes({ customization }: { customization: CustomizationOptions }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const primaryColor = customization.colors.primary || '#3b82f6';
  const accentColor = customization.colors.accent || '#60a5fa';

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

    let mouse = { x: width / 2, y: height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    class FloatingShape {
      x: number;
      y: number;
      size: number;
      type: 'box' | 'ring' | 'sphere';
      rotationX: number;
      rotationY: number;
      rotationZ: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor(type: 'box' | 'ring' | 'sphere', initialX: number, initialY: number, size: number, color: string) {
        this.x = initialX;
        this.y = initialY;
        this.size = size;
        this.type = type;
        this.rotationX = Math.random() * Math.PI;
        this.rotationY = Math.random() * Math.PI;
        this.rotationZ = Math.random() * Math.PI;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
        this.color = color;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < -this.size || this.x > width + this.size) this.speedX *= -1;
        if (this.y < -this.size || this.y > height + this.size) this.speedY *= -1;

        this.rotationX += 0.003;
        this.rotationY += 0.005;
        this.rotationZ += 0.004;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.strokeStyle = this.color + '55';
        ctx.fillStyle = this.color + '15';
        ctx.lineWidth = 1.5;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 400) {
          const force = (400 - dist) / 400;
          ctx.translate(-dx * force * 0.12, -dy * force * 0.12);
        }

        if (this.type === 'box') {
          const size = this.size;
          ctx.beginPath();
          const r = this.rotationY;
          const points = [
            { x: -size * Math.cos(r), y: -size * Math.sin(r) },
            { x: size * Math.sin(r), y: -size * Math.cos(r) },
            { x: size * Math.cos(r), y: size * Math.sin(r) },
            { x: -size * Math.sin(r), y: size * Math.cos(r) },
          ];
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < 4; i++) ctx.lineTo(points[i].x, points[i].y);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
        } else if (this.type === 'ring') {
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size, this.size * Math.abs(Math.sin(this.rotationX)), this.rotationZ, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size * 0.6, this.size * 0.6 * Math.abs(Math.sin(this.rotationX)), this.rotationZ, 0, Math.PI * 2);
          ctx.stroke();
        } else if (this.type === 'sphere') {
          const grad = ctx.createRadialGradient(-this.size * 0.3, -this.size * 0.3, 0, 0, 0, this.size);
          grad.addColorStop(0, '#ffffff20');
          grad.addColorStop(0.5, this.color + '40');
          grad.addColorStop(1, '#00000000');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const shapes = [
      new FloatingShape('ring', width * 0.75, height * 0.25, 75, primaryColor),
      new FloatingShape('box', width * 0.15, height * 0.7, 65, accentColor),
      new FloatingShape('sphere', width * 0.45, height * 0.8, 50, customization.colors.secondary || '#1e293b'),
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      shapes.forEach((s) => {
        s.update();
        s.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [primaryColor, accentColor, customization.colors.secondary]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0 pointer-events-none" />;
}

export default function Interactive3dDevTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen relative selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      {/* Interactive Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <InteractiveCanvasFloatingShapes customization={customization} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 space-y-28">
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="min-h-[80vh] flex flex-col justify-center">
                  <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                      <div className="inline-flex items-center px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-[var(--color-primary)]">
                        system_mode: active_interactive_renderer
                      </div>
                      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                        {data.name}
                      </h1>
                      <h2 className="text-xl font-bold opacity-85 font-mono">
                        {data.title}
                      </h2>
                      <p className="text-lg opacity-75 leading-relaxed max-w-xl">
                        {data.summary}
                      </p>
                      <div className="pt-2">
                        <a href={`mailto:${data.email}`} className="px-6 py-3 rounded-lg font-bold border transition-all text-xs uppercase tracking-wider font-mono hover:scale-105"
                           style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)', borderColor: 'var(--color-primary)' }}>
                          ping_developer
                        </a>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex items-center justify-center">
                      <ProfileImage customization={customization} sizeClassName="w-44 h-44 rounded-3xl" />
                    </div>
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="space-y-6">
                  <h2 className="text-xl font-bold font-mono border-b border-white/10 pb-2">Active Stacks</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.skills.map((skill, i) => (
                      <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] font-mono text-sm">
                        {skill}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="space-y-8">
                  <h2 className="text-xl font-bold font-mono border-b border-white/10 pb-2">Deployments</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] flex flex-col justify-between"
                      >
                        <div>
                          <h3 className="text-lg font-bold font-mono">{proj.name}</h3>
                          <p className="opacity-70 text-xs mt-2 leading-relaxed">{proj.description}</p>
                        </div>
                        <div className="pt-4 border-t border-white/5 flex flex-wrap gap-1 mt-4">
                          {proj.technologies.slice(0, 3).map(tech => (
                            <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-white/5 opacity-60 font-mono">{tech}</span>
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
                  <h2 className="text-xl font-bold font-mono border-b border-white/10 pb-2">Chronology</h2>
                  <div className="space-y-6">
                    {data.experience.map((exp, i) => (
                      <div key={i} className="flex flex-col md:flex-row justify-between py-4 border-b border-white/5 gap-2">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold">{exp.role}</h3>
                          <p className="text-xs font-semibold opacity-70" style={{ color: 'var(--color-primary)' }}>{exp.company}</p>
                          <p className="opacity-70 text-xs mt-1 leading-relaxed max-w-xl">{exp.description}</p>
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
                  <h2 className="text-2xl font-bold font-mono">Connect Endpoint</h2>
                  <p className="opacity-70 text-xs leading-relaxed font-mono">
                    Ready to initiate collaboration? Push a webhook payload.
                  </p>
                  <div className="pt-2">
                    <a href={`mailto:${data.email}`} className="inline-block px-8 py-3.5 rounded font-mono font-bold transition-all hover:scale-105"
                       style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
                      mail_to()
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
