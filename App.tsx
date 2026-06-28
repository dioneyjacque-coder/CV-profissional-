
import React, { useState, useEffect } from 'react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import { INITIAL_DATA } from './constants';
import { ResumeData } from './types';
import { exportToExcel, exportToPDF } from './services/exportService';
import { FileDown, FileSpreadsheet, FileText, Sparkles, Moon, Sun, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [isExporting, setIsExporting] = useState<'pdf' | 'excel' | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleExportPDF = async () => {
    setIsExporting('pdf');
    try {
      await exportToPDF(data);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting('excel');
    try {
      await exportToExcel(data);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header */}
      <header className={`border-b px-6 py-4 sticky top-0 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>ProCV Builder</h1>
              <p className={`text-xs font-medium flex items-center gap-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                <ShieldCheck className="w-3 h-3" /> Exportação 100% Fiel ao A4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={handleExportPDF}
              disabled={!!isExporting}
              className={`hidden md:flex px-6 py-2 bg-blue-600 text-white rounded-lg font-bold transition-all items-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-50 hover:bg-blue-700 active:scale-95`}
            >
              <FileDown className="w-5 h-5" />
              {isExporting === 'pdf' ? 'Processando...' : 'Baixar PDF Original'}
            </button>

            <button 
              onClick={handleExportExcel}
              disabled={!!isExporting}
              className={`hidden md:flex p-2 bg-emerald-100 text-emerald-700 rounded-lg font-bold transition-all items-center gap-2 disabled:opacity-50 hover:bg-emerald-200`}
              title="Exportar como Planilha"
            >
              <FileSpreadsheet className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col lg:flex-row transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <aside className={`w-full lg:w-[450px] xl:w-[500px] lg:h-[calc(100vh-73px)] lg:overflow-y-auto border-r custom-scrollbar transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-6 lg:p-8">
            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Editor Profissional</h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Abaixo você vê exatamente como ficará sua folha de papel.</p>
            </div>
            <ResumeForm data={data} onChange={setData} isDarkMode={isDarkMode} />
          </div>
        </aside>

        <section className={`flex-1 p-4 md:p-8 lg:p-12 flex flex-col items-center lg:h-[calc(100vh-73px)] lg:overflow-y-auto custom-scrollbar transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-200/50'}`}>
          <div className="mb-6 lg:hidden w-full text-center">
            <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>Preview de Impressão A4</h3>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="w-full flex justify-center pb-24 lg:pb-0">
            <ResumePreview data={data} />
          </div>
        </section>
      </main>

      {/* Floating Action for Mobile */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] z-[60] flex flex-col gap-2 no-print">
        <button 
          onClick={handleExportPDF}
          disabled={!!isExporting}
          className="w-full px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
        >
          <FileDown className="w-6 h-6" /> 
          {isExporting === 'pdf' ? 'Gerando arquivo...' : 'Baixar Currículo A4'}
        </button>
        <button 
          onClick={handleExportExcel}
          disabled={!!isExporting}
          className="w-full py-2 bg-emerald-600/10 text-emerald-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-emerald-600/20"
        >
          <FileSpreadsheet className="w-4 h-4" /> Exportar Planilha de Dados
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#334155' : '#cbd5e1'};
          border-radius: 10px;
        }
        @media (max-width: 1024px) {
          body { overflow-x: hidden; }
        }
      `}} />
    </div>
  );
};

export default App;
