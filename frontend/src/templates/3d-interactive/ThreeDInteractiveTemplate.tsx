import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

function Canvas2DInteractiveBackground({ customization }: { customization: CustomizationOptions }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const primaryColor = customization.colors.primary || '#4338ca';
  const accentColor = customization.colors.accent || '#ec4899';

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

    class Orb {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      angle: number;
      spinSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 80 + 40;
        this.speedX = (Math.random() - 0.5) * 1.0;
        this.speedY = (Math.random() - 0.5) * 1.0;
        this.color = Math.random() > 0.5 ? primaryColor : accentColor;
        this.angle = Math.random() * Math.PI * 2;
        this.spinSpeed = (Math.random() - 0.5) * 0.01;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.spinSpeed;

        if (this.x < -this.size || this.x > width + this.size) this.speedX *= -1;
        if (this.y < -this.size || this.y > height + this.size) this.speedY *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        grad.addColorStop(0, this.color + '25'); // Low opacity glow
        grad.addColorStop(0.5, this.color + '0f');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const orbs: Orb[] = Array.from({ length: 12 }, () => new Orb());

    let mouse = { x: width / 2, y: height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render dynamic grids
      ctx.strokeStyle = `${primaryColor}06`;
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Interactive mouse focus highlight
      const radialGlow = ctx.createRadialGradient(mouse.x, mouse.y, 5, mouse.x, mouse.y, 350);
      radialGlow.addColorStop(0, `${primaryColor}1a`);
      radialGlow.addColorStop(0.5, `${accentColor}0b`);
      radialGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 350, 0, Math.PI * 2);
      ctx.fill();

      // Draw ambient elements
      orbs.forEach((orb) => {
        orb.update();
        orb.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [primaryColor, accentColor]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />;
}

export default function ThreeDInteractiveTemplate({ data, customization }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div ref={containerRef} className="min-h-screen relative selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      {/* Canvas 2D Background instead of ThreeJS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Canvas2DInteractiveBackground customization={customization} />
      </div>

      {/* HTML Overlay Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-12">
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="min-h-screen flex flex-col justify-center pb-32">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="font-medium tracking-widest uppercase mb-4"
                    style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}
                  >
                    {data.title}
                  </motion.h2>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-6xl md:text-8xl font-black tracking-tighter mb-8 max-w-4xl leading-tight"
                    style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)', fontFamily: 'var(--font-heading)' }}
                  >
                    {data.name}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="text-xl md:text-2xl max-w-2xl leading-relaxed opacity-70"
                  >
                    {data.summary}
                  </motion.p>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="py-32">
                  <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Works.</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors cursor-pointer group"
                      >
                        <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{proj.name}</h3>
                        <p className="opacity-70 mb-8 leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {proj.technologies.map(t => (
                            <span key={t} className="px-3 py-1 bg-black/50 rounded-full text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
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
                <section key="experience" className="py-32">
                  <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tight text-right" style={{ fontFamily: 'var(--font-heading)' }}>Experience.</h2>
                  <div className="space-y-8">
                    {data.experience.map((exp, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col md:flex-row gap-8 items-start border-b border-white/10 pb-8"
                      >
                        <div className="md:w-1/4">
                          <div className="font-bold mb-2" style={{ color: 'var(--color-primary)' }}>{exp.duration}</div>
                          <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{exp.company}</h3>
                        </div>
                        <div className="md:w-3/4">
                          <h4 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{exp.role}</h4>
                          <p className="opacity-70 leading-relaxed">{exp.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="py-32 text-center">
                  <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Capabilities.</h2>
                  <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                    {data.skills.map((skill, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, type: "spring" }}
                        className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-lg font-medium hover:text-white transition-all cursor-default"
                        style={{ hoverBackgroundColor: 'var(--color-primary)', hoverBorderColor: 'var(--color-primary)' }}
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="py-32 flex flex-col justify-center items-center text-center min-h-[50vh]">
                  <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>Ready to connect?</h2>
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={`mailto:${data.email}`}
                    className="px-12 py-6 rounded-full text-2xl font-bold tracking-tight shadow-[0_0_40px_rgba(236,72,153,0.4)]"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}
                  >
                    Drop a line
                  </motion.a>
                </section>
              );

            default: return null;
          }
        })}
      </div>
    </div>
  );
}
