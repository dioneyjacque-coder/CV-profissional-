
export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface ResumeData {
  fullName: string;
  photo: string | null;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  portfolio: string;
  cnh: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Skill[];
  template?: 'modern' | 'pdf_minimalist';
  civilStatus?: string;
  birthDate?: string;
  fullNameContact?: string;
}

export enum ExportType {
  PDF = 'PDF',
  WORD = 'WORD'
}
