
import React, { useState } from 'react';
import { ResumeData, Experience, Education, Skill } from '../types';
import { CNH_CATEGORIES } from '../constants';
import { Plus, Trash2, Wand2, User, Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Award, Camera, X, LayoutGrid, Check } from 'lucide-react';
import { refineText, editPhotoWithAI } from '../services/geminiService';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  isDarkMode?: boolean;
}

const ResumeForm: React.FC<Props> = ({ data, onChange, isDarkMode }) => {
  const [isRefining, setIsRefining] = useState<string | null>(null);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [photoPrompt, setPhotoPrompt] = useState('');

  const handleChange = (field: keyof ResumeData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleAddExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false
    };
    handleChange('experiences', [...data.experiences, newExp]);
  };

  const handleUpdateExperience = (id: string, updates: Partial<Experience>) => {
    const newExperiences = data.experiences.map(exp => 
      exp.id === id ? { ...exp, ...updates } : exp
    );
    handleChange('experiences', newExperiences);
  };

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: ''
    };
    handleChange('education', [...data.education, newEdu]);
  };

  const handleUpdateEducation = (id: string, updates: Partial<Education>) => {
    const newEducation = data.education.map(edu => 
      edu.id === id ? { ...edu, ...updates } : edu
    );
    handleChange('education', newEducation);
  };

  const handleAddSkill = (field: 'skills' | 'languages') => {
    const newSkill: Skill = { id: crypto.randomUUID(), name: '' };
    handleChange(field, [...data[field], newSkill]);
  };

  const handleUpdateSkill = (field: 'skills' | 'languages', id: string, name: string) => {
    const newSkills = data[field].map(s => s.id === id ? { ...s, name } : s);
    handleChange(field, newSkills);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIRefine = async (field: 'summary' | string, id?: string) => {
    setIsRefining(id || field);
    try {
      if (field === 'summary') {
        const refined = await refineText(data.summary, "Resumo profissional de currículo");
        handleChange('summary', refined);
      } else if (id) {
        const exp = data.experiences.find(e => e.id === id);
        if (exp) {
          const refined = await refineText(exp.description, `Descrição de cargo: ${exp.role} na empresa ${exp.company}`);
          handleUpdateExperience(id, { description: refined });
        }
      }
    } finally {
      setIsRefining(null);
    }
  };

  const handleAIPhotoEdit = async () => {
    if (!data.photo || !photoPrompt) return;
    setIsEditingPhoto(true);
    try {
      const edited = await editPhotoWithAI(data.photo, photoPrompt);
      if (edited) handleChange('photo', edited);
    } finally {
      setIsEditingPhoto(false);
      setPhotoPrompt('');
    }
  };

  const sectionClasses = `p-6 rounded-xl shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`;
  const inputClasses = `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'}`;
  const labelClasses = `block text-sm font-medium mb-1 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`;
  const subCardClasses = `p-4 border rounded-xl space-y-4 transition-colors ${isDarkMode ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'}`;

  return (
    <div className="space-y-8 pb-20">
      {/* Modelo de Currículo */}
      <section className={sectionClasses}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
          <LayoutGrid className="w-5 h-5 text-blue-500" /> Modelo de Currículo
        </h3>
        <p className={`text-xs mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Selecione o estilo visual do seu currículo. O modelo "Fiel ao PDF" reproduz exatamente o estilo, fontes e barras divisórias do arquivo enviado.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleChange('template', 'modern')}
            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
              (data.template === 'modern' || !data.template)
                ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5'
                : isDarkMode ? 'border-slate-800 hover:border-slate-705 bg-slate-900 text-slate-300' : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">Executivo Moderno</span>
              {(data.template === 'modern' || !data.template) && <Check className="w-4 h-4 text-blue-500" />}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Design executivo moderno, com cabeçalho azul estruturado e foco em legibilidade corporativa padrão.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleChange('template', 'pdf_minimalist')}
            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
              data.template === 'pdf_minimalist'
                ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5'
                : isDarkMode ? 'border-slate-800 hover:border-slate-705 bg-slate-900 text-slate-300' : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">Elegante Minimalista</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-500">Fiel ao PDF</span>
              {data.template === 'pdf_minimalist' && <Check className="w-4 h-4 text-blue-500" />}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Baseado no PDF fornecido. Layout limpo, nome em destaque, foto redonda na direita e duas linhas horizontais.
            </p>
          </button>
        </div>
      </section>

      {/* Photo Section */}
      <section className={sectionClasses}>
        <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-500" /> Foto (Opcional)
          </span>
          {data.photo && (
            <button 
              onClick={() => handleChange('photo', null)}
              className="text-xs flex items-center gap-1 text-red-500 hover:text-red-600 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remover Foto
            </button>
          )}
        </h3>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative group shrink-0">
            <div className={`w-32 h-40 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-slate-100 border-slate-300 hover:border-blue-400'}`}>
              {data.photo ? (
                <img src={data.photo} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <div className="text-center p-2">
                  <User className={`w-10 h-10 mx-auto mb-1 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Adicionar</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Clique para enviar uma foto"
            />
          </div>
          
          <div className="flex-1 w-full space-y-3">
            <label className={labelClasses}>Edição Mágica (AI)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={photoPrompt}
                onChange={(e) => setPhotoPrompt(e.target.value)}
                placeholder="Ex: 'Remova o fundo'"
                className={inputClasses}
                disabled={!data.photo}
              />
              <button 
                onClick={handleAIPhotoEdit}
                disabled={isEditingPhoto || !data.photo}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isEditingPhoto ? <span className="animate-spin text-lg">◌</span> : <Wand2 className="w-4 h-4" />}
                Editar
              </button>
            </div>
            {!data.photo ? (
              <p className={`text-xs p-2 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20`}>
                Envie uma foto para habilitar a edição com Inteligência Artificial.
              </p>
            ) : (
              <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Sugestão: "Ajuste iluminação", "Fundo cinza", "Traje social".</p>
            )}
          </div>
        </div>
      </section>

      {/* Personal Info */}
      <section className={sectionClasses}>
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" /> Informações Pessoais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelClasses}>Nome em Destaque (Topo)</label>
            <input 
              type="text" 
              value={data.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Ex: AMANDA TEIXEIRA"
              className={inputClasses}
            />
          </div>
          <div className="col-span-2">
            <label className={labelClasses}>Nome Completo (Detalhes / Contatos)</label>
            <input 
              type="text" 
              value={data.fullNameContact || ''}
              onChange={(e) => handleChange('fullNameContact', e.target.value)}
              placeholder="Ex: Amanda Angelina Conceição Teixeira"
              className={inputClasses}
            />
            <p className={`text-[11px] mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Se deixado em branco, será exibido o "Nome em Destaque (Topo)".
            </p>
          </div>
          <div>
            <label className={labelClasses}>E-mail</label>
            <input 
              type="email" 
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Telefone</label>
            <input 
              type="text" 
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="col-span-2">
            <label className={labelClasses}>Endereço Completo</label>
            <input 
              type="text" 
              value={data.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Linkedin</label>
            <input 
              type="text" 
              value={data.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Categoria CNH</label>
            <select 
              value={data.cnh}
              onChange={(e) => handleChange('cnh', e.target.value)}
              className={inputClasses}
            >
              <option value="">Nenhuma</option>
              {CNH_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClasses}>Estado Civil</label>
            <input 
              type="text" 
              placeholder="Ex: Solteiro(a), Casado(a)"
              value={data.civilStatus || ''}
              onChange={(e) => handleChange('civilStatus', e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Data de Nascimento / Idade</label>
            <input 
              type="text" 
              placeholder="Ex: 13/06/2004 ou 21 anos"
              value={data.birthDate || ''}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>
      </section>

      {/* Professional Summary */}
      <section className={sectionClasses}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-500" /> Resumo Profissional
          </h3>
          <button 
            onClick={() => handleAIRefine('summary')}
            disabled={isRefining === 'summary' || !data.summary}
            className="text-sm flex items-center gap-1 text-blue-500 hover:text-blue-400 disabled:opacity-50"
          >
            <Wand2 className="w-4 h-4" /> 
            {isRefining === 'summary' ? 'Melhorando...' : 'IA'}
          </button>
        </div>
        <textarea 
          rows={4}
          value={data.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="Fale brevemente sobre sua trajetória..."
          className={inputClasses}
        />
      </section>

      {/* Experience */}
      <section className={sectionClasses}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-500" /> Experiência Profissional
          </h3>
          <button 
            onClick={handleAddExperience}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-800 text-blue-400 hover:bg-slate-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-6">
          {data.experiences.map((exp) => (
            <div key={exp.id} className={subCardClasses}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Empresa"
                  value={exp.company}
                  onChange={(e) => handleUpdateExperience(exp.id, { company: e.target.value })}
                  className={inputClasses.replace('bg-slate-800', 'bg-slate-900').replace('bg-slate-50', 'bg-white')}
                />
                <input 
                  type="text" 
                  placeholder="Cargo"
                  value={exp.role}
                  onChange={(e) => handleUpdateExperience(exp.id, { role: e.target.value })}
                  className={inputClasses.replace('bg-slate-800', 'bg-slate-900').replace('bg-slate-50', 'bg-white')}
                />
                <input 
                  type="text" 
                  placeholder="Início (Opcional)"
                  value={exp.startDate}
                  onChange={(e) => handleUpdateExperience(exp.id, { startDate: e.target.value })}
                  className={inputClasses.replace('bg-slate-800', 'bg-slate-900').replace('bg-slate-50', 'bg-white')}
                />
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Fim (Opcional)"
                    disabled={exp.current}
                    value={exp.endDate}
                    onChange={(e) => handleUpdateExperience(exp.id, { endDate: e.target.value })}
                    className={inputClasses.replace('bg-slate-800', 'bg-slate-900').replace('bg-slate-50', 'bg-white')}
                  />
                  <label className={`flex items-center gap-1 text-xs whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    <input 
                      type="checkbox" 
                      checked={exp.current}
                      onChange={(e) => handleUpdateExperience(exp.id, { current: e.target.checked })}
                    /> Atual
                  </label>
                </div>
              </div>
              <div className="relative">
                <textarea 
                  placeholder="Descrição..."
                  rows={3}
                  value={exp.description}
                  onChange={(e) => handleUpdateExperience(exp.id, { description: e.target.value })}
                  className={inputClasses.replace('bg-slate-800', 'bg-slate-900').replace('bg-slate-50', 'bg-white')}
                />
                <button 
                  onClick={() => handleAIRefine('experience', exp.id)}
                  className="absolute bottom-3 right-3 text-xs flex items-center gap-1 text-blue-500 hover:text-blue-400"
                >
                  <Wand2 className="w-3 h-3" /> IA
                </button>
              </div>
              <button 
                onClick={() => handleChange('experiences', data.experiences.filter(e => e.id !== exp.id))}
                className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Remover
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className={sectionClasses}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-500" /> Formação
          </h3>
          <button 
            onClick={handleAddEducation}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-800 text-blue-400 hover:bg-slate-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-6">
          {data.education.map((edu) => (
            <div key={edu.id} className={subCardClasses}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Instituição"
                  value={edu.institution}
                  onChange={(e) => handleUpdateEducation(edu.id, { institution: e.target.value })}
                  className={inputClasses.replace('bg-slate-800', 'bg-slate-900').replace('bg-slate-50', 'bg-white')}
                />
                <input 
                  type="text" 
                  placeholder="Curso"
                  value={edu.degree}
                  onChange={(e) => handleUpdateEducation(edu.id, { degree: e.target.value })}
                  className={inputClasses.replace('bg-slate-800', 'bg-slate-900').replace('bg-slate-50', 'bg-white')}
                />
                <input 
                  type="text" 
                  placeholder="Área"
                  value={edu.field}
                  onChange={(e) => handleUpdateEducation(edu.id, { field: e.target.value })}
                  className={inputClasses.replace('bg-slate-800', 'bg-slate-900').replace('bg-slate-50', 'bg-white')}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Início"
                    value={edu.startDate}
                    onChange={(e) => handleUpdateEducation(edu.id, { startDate: e.target.value })}
                    className={inputClasses.replace('bg-slate-800', 'bg-slate-900').replace('bg-slate-50', 'bg-white')}
                  />
                  <input 
                    type="text" 
                    placeholder="Fim"
                    value={edu.endDate}
                    onChange={(e) => handleUpdateEducation(edu.id, { endDate: e.target.value })}
                    className={inputClasses.replace('bg-slate-800', 'bg-slate-900').replace('bg-slate-50', 'bg-white')}
                  />
                </div>
              </div>
              <button 
                onClick={() => handleChange('education', data.education.filter(e => e.id !== edu.id))}
                className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Remover
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className={sectionClasses}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Habilidades</h3>
              <button onClick={() => handleAddSkill('skills')} className="text-blue-500 hover:text-blue-400"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.skills.map(skill => (
                <div key={skill.id} className={`flex items-center gap-1 px-3 py-1 rounded-full group transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <input 
                    value={skill.name} 
                    onChange={(e) => handleUpdateSkill('skills', skill.id, e.target.value)}
                    placeholder="Ex: React"
                    className="bg-transparent text-sm outline-none border-none p-0 w-20 text-inherit"
                  />
                  <button onClick={() => handleChange('skills', data.skills.filter(s => s.id !== skill.id))} className="opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3 text-red-400" /></button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Idiomas</h3>
              <button onClick={() => handleAddSkill('languages')} className="text-blue-500 hover:text-blue-400"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.languages.map(lang => (
                <div key={lang.id} className={`flex items-center gap-1 px-3 py-1 rounded-full group transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <input 
                    value={lang.name} 
                    onChange={(e) => handleUpdateSkill('languages', lang.id, e.target.value)}
                    placeholder="Inglês"
                    className="bg-transparent text-sm outline-none border-none p-0 w-24 text-inherit"
                  />
                  <button onClick={() => handleChange('languages', data.languages.filter(s => s.id !== lang.id))} className="opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3 text-red-400" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumeForm;
