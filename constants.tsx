
import React from 'react';
import { ResumeData } from './types';

export const INITIAL_DATA: ResumeData = {
  fullName: '',
  photo: null,
  email: '',
  phone: '',
  address: '',
  linkedin: '',
  portfolio: '',
  cnh: '',
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  template: 'modern',
  civilStatus: '',
  birthDate: '',
  fullNameContact: '',
};

export const CNH_CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'];

export const THEMES = {
  classic: {
    primary: 'text-slate-900',
    secondary: 'text-slate-600',
    accent: 'bg-slate-900',
    border: 'border-slate-200'
  },
  modern: {
    primary: 'text-blue-900',
    secondary: 'text-blue-700',
    accent: 'bg-blue-600',
    border: 'border-blue-100'
  }
};
