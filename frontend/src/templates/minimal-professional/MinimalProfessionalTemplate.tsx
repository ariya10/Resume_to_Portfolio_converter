import React from 'react';
import { motion } from 'framer-motion';
import { type PortfolioData, type CustomizationOptions } from "@/lib/portfolio-templates";
import { ProfileImage } from "@/components/templates/ProfileImage";

interface TemplateProps {
  data: PortfolioData;
  customization: CustomizationOptions;
}

export default function MinimalProfessionalTemplate({ data, customization }: TemplateProps) {
  const visibleSections = customization.sectionInstances.filter(s => s.visible).map(s => s.type);

  return (
    <div className="min-h-screen selection:text-white"
         style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', selectionBackgroundColor: 'var(--color-primary)' }}>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 py-20 space-y-24">
        
        {visibleSections.map(section => {
          switch(section) {
            case 'hero':
              return (
                <section key="hero" className="py-12 border-b border-black/[0.08]">
                  <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
                    <div className="flex-1 space-y-6">
                      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        {data.name}
                      </h1>
                      
                      <h2 className="text-lg font-medium opacity-80 uppercase tracking-widest text-[var(--color-primary)]">
                        {data.title}
                      </h2>
                      
                      <p className="text-base opacity-75 max-w-xl leading-relaxed">
                        {data.summary}
                      </p>
                      
                      <div className="pt-2 flex gap-4 text-xs font-medium opacity-60">
                        {data.location && <span>{data.location}</span>}
                        <span>&bull;</span>
                        {data.email && <a href={`mailto:${data.email}`} className="hover:opacity-100 hover:text-[var(--color-primary)] transition-all">Email</a>}
                        {data.linkedin && (
                          <>
                            <span>&bull;</span>
                            <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 hover:text-[var(--color-primary)] transition-all">LinkedIn</a>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-center">
                      <ProfileImage customization={customization} sizeClassName="w-32 h-32 md:w-40 md:h-40 rounded-xl" />
                    </div>
                  </div>
                </section>
              );

            case 'skills':
              if (!data.skills?.length) return null;
              return (
                <section key="skills" className="space-y-6">
                  <h2 className="text-xs uppercase tracking-widest opacity-50 font-bold">Expertise</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                    {data.skills.map((skill, i) => (
                      <div key={i} className="text-sm font-medium border-l border-black/10 pl-4 py-1">
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
                  <h2 className="text-xs uppercase tracking-widest opacity-50 font-bold">Selected Case Work</h2>
                  <div className="space-y-8">
                    {data.projects.map((proj, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="py-4 border-b border-black/[0.06] flex flex-col md:flex-row justify-between gap-4"
                      >
                        <div className="space-y-2 max-w-xl">
                          <h3 className="text-lg font-bold">{proj.name}</h3>
                          <p className="opacity-70 text-xs leading-relaxed">{proj.description}</p>
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {proj.technologies.map(tech => (
                              <span key={tech} className="text-[10px] opacity-50 font-medium">{tech} &bull;</span>
                            ))}
                          </div>
                        </div>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold underline hover:text-[var(--color-primary)] transition-all self-start md:self-auto">
                            Read case study
                          </a>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'experience':
              if (!data.experience?.length) return null;
              return (
                <section key="experience" className="space-y-8">
                  <h2 className="text-xs uppercase tracking-widest opacity-50 font-bold">Experience</h2>
                  <div className="space-y-6">
                    {data.experience.map((exp, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <h3 className="text-base font-bold">{exp.role}</h3>
                          <p className="text-xs font-semibold opacity-70">{exp.company}</p>
                          <p className="opacity-70 text-xs mt-1 leading-relaxed max-w-xl">{exp.description}</p>
                        </div>
                        <span className="shrink-0 text-xs opacity-50 font-medium self-start md:self-auto">{exp.duration}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key="contact" className="py-12 border-t border-black/5 text-center space-y-6">
                  <h2 className="text-2xl font-bold">Get In Touch</h2>
                  <p className="opacity-70 text-xs max-w-sm mx-auto">
                    Please reach out for professional inquiries or potential project collaborations.
                  </p>
                  <div className="pt-2">
                    <a href={`mailto:${data.email}`} className="inline-block px-8 py-3 rounded border border-black/80 hover:bg-black hover:text-white transition-all text-xs font-medium uppercase tracking-wider">
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
