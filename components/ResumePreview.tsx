
import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, MapPin, Linkedin, Car, Calendar, User } from 'lucide-react';

interface Props {
  data: ResumeData;
}

const ResumePreview: React.FC<Props> = ({ data }) => {
  // Helper to format date display
  const formatDateRange = (start: string, end: string, current: boolean) => {
    if (!start && !end && !current) return null;
    if (current) return `${start || ''} — Presente`.trim().replace(/^—/, '');
    if (start && end) return `${start} — ${end}`;
    if (start) return `Desde ${start}`;
    if (end) return `Até ${end}`;
    return null;
  };

  if (data.template === 'pdf_minimalist') {
    return (
      <div 
        id="resume-canvas" 
        className="bg-white mx-auto text-black leading-relaxed origin-top transform transition-transform duration-500 overflow-hidden font-sans"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '20mm',
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          boxSizing: 'border-box'
        }}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center pb-4 min-h-[140px]">
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-light tracking-wide text-slate-800 leading-none">
              {data.fullName ? data.fullName.toUpperCase().split(' ').map((word, idx) => (
                <span key={idx} className="block font-semibold mb-1">{word}</span>
              )) : (
                <>
                  <span className="block font-semibold mb-1">AMANDA</span>
                  <span className="block font-extralight text-slate-500">TEIXEIRA</span>
                </>
              )}
            </h1>
          </div>
          {data.photo ? (
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm shrink-0 ml-4">
              <img 
                src={data.photo} 
                className="w-full h-full object-cover" 
                alt="Profile" 
                crossOrigin="anonymous"
              />
            </div>
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center shrink-0 ml-4 bg-slate-50">
              <User className="w-10 h-10 text-slate-450" />
            </div>
          )}
        </div>

        {/* First Divider */}
        <div className="border-t border-slate-300 mb-5"></div>

        {/* Contact Info (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] text-slate-705 mb-5">
          <div className="space-y-2">
            {/* Person profile info */}
            <div className="flex items-start gap-2.5">
              <User className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-800">{data.fullNameContact || data.fullName || "Nome Completo"}</p>
                {data.civilStatus && <p className="text-xs text-slate-520">{data.civilStatus}</p>}
              </div>
            </div>

            {/* Birthdate */}
            {data.birthDate && (
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{data.birthDate}</span>
              </div>
            )}

            {/* Address */}
            {data.address && (
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span className="leading-tight">{data.address}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {/* Phone */}
            {data.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-450 shrink-0" />
                <span className="font-medium">{data.phone}</span>
              </div>
            )}

            {/* Email */}
            {data.email && (
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-450 shrink-0" />
                <span className="break-all">{data.email}</span>
              </div>
            )}

            {/* Linkedin */}
            {data.linkedin && (
              <div className="flex items-center gap-2.5">
                <Linkedin className="w-4 h-4 text-slate-450 shrink-0" />
                <span className="break-all">{data.linkedin}</span>
              </div>
            )}

            {/* CNH */}
            {data.cnh && (
              <div className="flex items-center gap-2.5">
                <Car className="w-4 h-4 text-slate-450 shrink-0" />
                <span>CNH: Categoria {data.cnh}</span>
              </div>
            )}
          </div>
        </div>

        {/* Second Divider */}
        <div className="border-t border-slate-300 mb-6"></div>

        {/* Main Content Sections (Vertical stacked) */}
        <div className="space-y-6">
          {/* Summary / Resumo */}
          {data.summary && (
            <section className="text-[13.5px]">
              <h2 className="text-[16px] font-bold text-slate-800 mb-2">
                Resumo Profissional
              </h2>
              <p className="text-slate-600 text-justify leading-relaxed whitespace-pre-line">
                {data.summary}
              </p>
            </section>
          )}

          {/* Experiência Profissional */}
          {data.experiences.length > 0 && (
            <section className="text-[13.5px]">
              <h2 className="text-[16px] font-bold text-slate-800 mb-3.5">
                Experiência Profissional
              </h2>
              <div className="space-y-4">
                {data.experiences.map((exp) => {
                  const dateText = formatDateRange(exp.startDate, exp.endDate, exp.current);
                  return (
                    <div key={exp.id} className="text-slate-700">
                      <p className="font-bold text-slate-800">
                        {exp.company} {exp.role ? `— ${exp.role}` : ''} {dateText ? `— ${dateText}` : ''}
                      </p>
                      {exp.description && (
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line mt-1 pl-3 border-l-2 border-slate-100">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Habilidades - styled clean listing of badges or small inline items to replicate the screenshot */}
          {data.skills.length > 0 && (
            <section className="text-[13.5px]">
              <h2 className="text-[16px] font-bold text-slate-800 mb-2">
                Habilidades
              </h2>
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-slate-600">
                {data.skills.map((skill, index) => (
                  <span key={skill.id} className="inline-flex items-center">
                    <span className="font-medium text-slate-700">{skill.name}</span>
                    {index < data.skills.length - 1 && <span className="mx-2 text-slate-300">•</span>}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Formação Acadêmica / Cursos */}
          {data.education.length > 0 && (
            <section className="text-[13.5px]">
              <h2 className="text-[16px] font-bold text-slate-800 mb-3.5">
                Formação Acadêmica / Cursos
              </h2>
              <div className="space-y-3">
                {data.education.map((edu) => {
                  const dateText = formatDateRange(edu.startDate, edu.endDate, false);
                  return (
                    <div key={edu.id} className="text-slate-700">
                      <p className="font-bold text-slate-800">
                        {edu.degree} em {edu.field}
                      </p>
                      <p className="text-slate-600 text-xs">
                        {edu.institution} {dateText ? `— ${dateText}` : ''}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Idiomas */}
          {data.languages.length > 0 && (
            <section className="text-[13.5px]">
              <h2 className="text-[16px] font-bold text-slate-800 mb-2">
                Idiomas
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600">
                {data.languages.map((lang, index) => (
                  <span key={lang.id} className="inline-flex items-center">
                    <span className="font-medium text-slate-700">{lang.name}</span>
                    {index < data.languages.length - 1 && <span className="mx-2 text-slate-300">•</span>}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer info or Page indication */}
        <div className="mt-12 text-center text-[11px] text-slate-400 border-t border-slate-100 pt-3">
          Página 1 de 1
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          #resume-canvas {
            font-variant-numeric: tabular-nums;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          @media screen and (max-width: 1024px) {
            #resume-canvas {
              transform: scale(calc(0.9 * (100vw / 800px)));
              margin-bottom: -150px;
            }
          }
          @media screen and (max-width: 640px) {
            #resume-canvas {
              transform: scale(calc(1 * (100vw / 850px)));
              margin-bottom: -450px;
            }
          }
        `}} />
      </div>
    );
  }

  return (
    <div 
      id="resume-canvas" 
      className="bg-white mx-auto text-black leading-relaxed origin-top transform transition-transform duration-500 overflow-hidden"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        boxSizing: 'border-box'
      }}
    >
      {/* Header Section */}
      <div className={`flex gap-10 items-start border-b-2 border-slate-900 pb-10 mb-10 ${!data.photo ? 'justify-center text-center' : ''}`}>
        {data.photo && (
          <div className="w-32 h-40 flex-shrink-0 bg-slate-100 overflow-hidden rounded shadow-md border border-slate-200">
            <img 
              src={data.photo} 
              className="w-full h-full object-cover" 
              alt="Profile" 
              crossOrigin="anonymous"
            />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight mb-4 font-serif text-slate-900" style={{ lineHeight: '1.1' }}>
            {data.fullName || 'Seu Nome Completo'}
          </h1>
          <div className={`grid gap-x-6 gap-y-3 text-[13px] text-slate-800 ${!data.photo ? 'flex flex-wrap justify-center gap-4' : 'grid-cols-2'}`}>
            {data.email && <div className="flex items-center gap-2 justify-center"><Mail className="w-3.5 h-3.5 text-blue-600" /> {data.email}</div>}
            {data.phone && <div className="flex items-center gap-2 justify-center"><Phone className="w-3.5 h-3.5 text-blue-600" /> {data.phone}</div>}
            {data.address && <div className="flex items-center gap-2 col-span-2 justify-center"><MapPin className="w-3.5 h-3.5 text-blue-600" /> {data.address}</div>}
            {data.linkedin && <div className="flex items-center gap-2 justify-center"><Linkedin className="w-3.5 h-3.5 text-blue-600" /> {data.linkedin}</div>}
            {data.cnh && <div className="flex items-center gap-2 justify-center"><Car className="w-3.5 h-3.5 text-blue-600" /> CNH: Categoria {data.cnh}</div>}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-10">
        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className="text-[16px] font-bold border-b border-slate-300 pb-2 mb-4 uppercase tracking-[0.1em] text-slate-900">
              Resumo Profissional
            </h2>
            <p className="text-[14px] text-slate-800 text-justify leading-relaxed whitespace-pre-line">
              {data.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experiences.length > 0 && (
          <section>
            <h2 className="text-[16px] font-bold border-b border-slate-300 pb-2 mb-6 uppercase tracking-[0.1em] text-slate-900">
              Experiência Profissional
            </h2>
            <div className="space-y-8">
              {data.experiences.map((exp) => {
                const dateText = formatDateRange(exp.startDate, exp.endDate, exp.current);
                return (
                  <div key={exp.id} className="relative">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[15px] font-bold text-slate-900">{exp.role}</h3>
                      {dateText && (
                        <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                          {dateText}
                        </span>
                      )}
                    </div>
                    <div className="text-[14px] font-semibold text-blue-700 mb-3 italic">{exp.company}</div>
                    <p className="text-[13.5px] text-slate-800 text-justify leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <h2 className="text-[16px] font-bold border-b border-slate-300 pb-2 mb-6 uppercase tracking-[0.1em] text-slate-900">
              Formação Acadêmica
            </h2>
            <div className="space-y-6">
              {data.education.map((edu) => {
                const dateText = formatDateRange(edu.startDate, edu.endDate, false);
                return (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[15px] font-bold text-slate-900">{edu.degree} em {edu.field}</h3>
                      {dateText && (
                        <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                          {dateText}
                        </span>
                      )}
                    </div>
                    <div className="text-[14px] text-slate-700 italic">{edu.institution}</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom Grid: Skills & Languages */}
        <div className="grid grid-cols-2 gap-16 pt-4">
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-[15px] font-bold border-b border-slate-300 pb-2 mb-4 uppercase tracking-[0.05em] text-slate-900">
                Habilidades
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {data.skills.map(skill => (
                  <div key={skill.id} className="text-[13.5px] text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></span>
                    {skill.name}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {data.languages.length > 0 && (
            <section>
              <h2 className="text-[15px] font-bold border-b border-slate-300 pb-2 mb-4 uppercase tracking-[0.05em] text-slate-900">
                Idiomas
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {data.languages.map(lang => (
                  <div key={lang.id} className="text-[13.5px] text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0"></span>
                    {lang.name}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        #resume-canvas {
          font-variant-numeric: tabular-nums;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        @media screen and (max-width: 1024px) {
          #resume-canvas {
            transform: scale(calc(0.9 * (100vw / 800px)));
            margin-bottom: -150px;
          }
        }
        @media screen and (max-width: 640px) {
          #resume-canvas {
            transform: scale(calc(1 * (100vw / 850px)));
            margin-bottom: -450px;
          }
        }
      `}} />
    </div>
  );
};

export default ResumePreview;
