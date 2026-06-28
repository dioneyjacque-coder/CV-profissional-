
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { ResumeData } from "../types";

export const exportToExcel = async (data: ResumeData) => {
  const rows = [];
  rows.push(["CURRÍCULO PROFISSIONAL"]);
  rows.push([data.fullName.toUpperCase()]);
  rows.push([`${data.email} | ${data.phone}`]);
  rows.push([data.address]);
  rows.push([]);

  if (data.summary) {
    rows.push(["RESUMO PROFISSIONAL"]);
    rows.push([data.summary]);
    rows.push([]);
  }

  if (data.experiences.length > 0) {
    rows.push(["EXPERIÊNCIA PROFISSIONAL"]);
    data.experiences.forEach(exp => {
      rows.push([`${exp.role} em ${exp.company} (${exp.startDate} - ${exp.current ? 'Presente' : exp.endDate})`]);
      rows.push([exp.description]);
      rows.push([]);
    });
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 80 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Currículo");
  XLSX.writeFile(wb, `${data.fullName.replace(/\s+/g, '_')}_Curriculo.xlsx`);
};

export const exportToPDF = async (data: ResumeData) => {
  const element = document.getElementById('resume-canvas');
  if (!element) return;

  // Forçar o elemento a estar visível e em tamanho real para captura
  const originalStyle = element.getAttribute('style') || '';
  
  // Reset temporário para captura perfeita
  element.style.transform = 'none';
  element.style.margin = '0';
  element.style.boxShadow = 'none';
  element.style.position = 'fixed';
  element.style.left = '-9999px';
  element.style.top = '0';
  
  try {
    const canvas = await html2canvas(element, {
      scale: 3, // Ultra alta definição
      useCORS: true,
      allowTaint: true,
      letterRendering: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794,
      windowHeight: 1123
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    // Adiciona a imagem cobrindo exatamente a página A4
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    pdf.save(`${data.fullName.replace(/\s+/g, '_')}_Curriculo_Profissional.pdf`);
  } catch (error) {
    console.error("Erro na geração do PDF de alta fidelidade:", error);
    alert("Erro ao gerar PDF. Certifique-se de que todas as imagens foram carregadas.");
  } finally {
    // Restaurar o estilo original para o visualizador do navegador
    element.setAttribute('style', originalStyle);
  }
};
