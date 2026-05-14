import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import * as THREE from 'three';

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

// 3D Background Component
// 3D Background Component
function SceneBackground({ customization }: { customization: CustomizationOptions }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const primaryColor = customization.colors.primary || '#4338ca';
  const accentColor = customization.colors.accent || '#ec4899';
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[2, 0, -5]}>
          <MeshDistortMaterial 
            color={primaryColor} 
            attach="material" 
            distort={0.4} 
            speed={2} 
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Float>
      
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere args={[0.8, 32, 32]} position={[-3, -2, -3]}>
          <MeshDistortMaterial 
            color={accentColor} 
            attach="material" 
            distort={0.3} 
            speed={3} 
            roughness={0.4}
            metalness={0.6}
          />
        </Sphere>
      </Float>

      <Environment preset="city" />
    </>
  );
}

export default function ThreeDInteractiveTemplate({ data, customization }: TemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div ref={containerRef} className="min-h-screen relative selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      {/* 3D Canvas Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <SceneBackground customization={customization} />
        </Canvas>
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

