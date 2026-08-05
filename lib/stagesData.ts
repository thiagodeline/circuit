// Estrutura do formato VCL (Valorant Circuit League), usada no Manual Circuit

export const ESTRUTURA_QUALIFIER = [
  { titulo: 'Inscrições abertas', descricao: 'Qualquer time pode se inscrever no VCL Qualifier (vagas configuradas pela staff a cada edição).' },
  { titulo: 'Fase de grupos (MD1)', descricao: 'Os times inscritos são divididos em grupos de 4. Cada time joga contra todos os outros do seu grupo.' },
  { titulo: 'Vaga direta', descricao: 'O 1º e o 2º colocados de cada grupo garantem vaga direta no VCL.' },
  { titulo: 'Repescagem (MD1)', descricao: 'O 3º e o 4º colocados de cada grupo disputam a repescagem entre si pelas últimas vagas do VCL.' },
];

export const ESTRUTURA_VCL = [
  { titulo: 'Oitavas de Final', formato: 'MD3' },
  { titulo: 'Quartas de Final', formato: 'MD3' },
  { titulo: 'Semifinais', formato: 'MD3' },
  { titulo: 'Grande Final', formato: 'MD5' },
];
