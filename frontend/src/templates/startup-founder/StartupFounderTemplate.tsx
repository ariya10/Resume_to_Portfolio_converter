import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ArrowRight, CheckCircle2, TrendingUp, Users, Target } from 'lucide-react';

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function StartupFounderTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen selection:bg-[var(--color-primary)] selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
      
      {/* SaaS Style Navigation */}
      <nav className="fixed top-0 left-0 w-full backdrop-blur-lg border-b z-50" style={{ backgroundColor: 'var(--color-bg)', opacity: 0.8, borderColor: 'var(--color-text)', borderOpacity: 0.1 }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>{data.name}</div>
          <div className="hidden md:flex gap-8 text-sm font-semibold opacity-60">
            {visibleSections.map(s => (
              <span key={s} className="capitalize cursor-pointer hover:text-[var(--color-primary)] transition-colors">{s}</span>
            ))}
          </div>
          <a href={`mailto:${data.email}`} className="text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors" style={{ backgroundColor: 'var(--color-text)' }}>
            Get in touch
          </a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="py-20 flex flex-col items-center text-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 border"
                    style={{ backgroundColor: 'var(--color-primary)', backgroundOpacity: 0.1, color: 'var(--color-primary)', borderColor: 'var(--color-primary)', borderOpacity: 0.2 }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--color-primary)' }}></span>
                      <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--color-primary)' }}></span>
                    </span>
                    Available for new ventures
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Building products that <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-accent))` }}>scale</span> & <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, var(--color-accent), var(--color-primary))` }}>impact</span>.
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl opacity-60 max-w-2xl mb-10 leading-relaxed"
                  >
                    {data.summary}
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <a href={`mailto:${data.email}`} className="text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2" style={{ backgroundColor: 'var(--color-primary)' }}>
                      Start a conversation <ArrowRight className="w-4 h-4" />
                    </a>
                    {data.linkedin && (
                      <a href={data.linkedin} className="px-8 py-4 rounded-xl font-semibold shadow-sm border transition-all flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', borderColor: 'var(--color-text)', borderOpacity: 0.1 }}>
                        View LinkedIn
                      </a>
                    )}
                  </motion.div>

                  {/* Trust badges / Metrics */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-20 pt-10 border-t w-full grid grid-cols-2 md:grid-cols-4 gap-8"
                    style={{ borderColor: 'var(--color-text)', borderOpacity: 0.1 }}
                  >
                    {[
                      { label: "Role", value: data.title, icon: Target },
                      { label: "Location", value: data.location, icon: MapPin },
                      { label: "Experience", value: "Proven", icon: TrendingUp },
                      { label: "Network", value: "Global", icon: Users }
                    ].map((metric, i) => {
                      const Icon = metric.icon;
                      return (
                        <div key={i} className="flex flex-col items-center">
                          <Icon className="w-6 h-6 opacity-40 mb-3" style={{ color: 'var(--color-primary)' }} />
                          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>{metric.value}</div>
                          <div className="text-sm font-semibold opacity-50 uppercase tracking-wide">{metric.label}</div>
                        </div>
                      );
                    })}
                  </motion.div>
                </section>
              );

            case 'projects':
              if (!data.projects?.length) return null;
              return (
                <section key="projects" className="py-24">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Featured Ventures</h2>
                    <p className="text-lg opacity-60 max-w-2xl mx-auto">Products and companies I've helped build, scale, and launch into the market.</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="rounded-3xl p-8 border hover:shadow-lg transition-all group"
                        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-text)', borderOpacity: 0.05 }}
                      >
                        <h3 className="text-2xl font-bold mb-3 flex items-center justify-between" style={{ fontFamily: 'var(--font-heading)' }}>
                          {proj.name}
                          <ArrowRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:text-[var(--color-primary)] transform group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="opacity-70 mb-6 leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {proj.technologies.map(t => (
                            <span key={t} className="px-3 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', opacity: 0.8 }}>{t}</span>
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
                <section key="experience" className="py-24">
                  <div className="rounded-3xl p-8 md:p-16 text-white shadow-2xl relative overflow-hidden" style={{ backgroundColor: 'var(--color-text)' }}>
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.2 }}></div>
                    
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 relative z-10" style={{ fontFamily: 'var(--font-heading)' }}>Career Timeline</h2>
                    <div className="space-y-12 relative z-10 border-l pl-8 ml-4" style={{ borderColor: 'var(--color-bg)', borderOpacity: 0.2 }}>
                      {data.experience.map((exp, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          className="relative"
                        >
                          <div className="absolute w-4 h-4 rounded-full -left-[41px] top-1.5" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                          <div className="font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>{exp.duration}</div>
                          <h3 className="text-2xl font-bold mb-1">{exp.role}</h3>
                          <h4 className="text-lg opacity-60 mb-4">{exp.company}</h4>
                          <p className="opacity-80 leading-relaxed max-w-2xl">{exp.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="py-24">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Core Competencies</h2>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                    {data.skills.map((skill, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="px-6 py-4 rounded-xl shadow-sm border font-semibold flex items-center gap-3"
                        style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-text)', borderOpacity: 0.05 }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="py-32">
                  <div className="rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden" style={{ backgroundColor: 'var(--color-primary)' }}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 relative z-10" style={{ fontFamily: 'var(--font-heading)' }}>Ready to scale?</h2>
                    <p className="text-white opacity-80 text-xl mb-10 max-w-2xl mx-auto relative z-10">
                      I'm currently accepting new opportunities and looking for exciting problems to solve. Let's build the future together.
                    </p>
                    <a href={`mailto:${data.email}`} className="inline-block px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all relative z-10" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-primary)' }}>
                      Contact Me
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

function MapPin(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
}
