export const SKILLS = ['QA','Product','Development','DevOps','UX/UI','Data','AI','Project Management','Cybersecurity','Marketing'] as const;
export type Skill = typeof SKILLS[number];
export const REAL_TITLES = [
 'Technical Product Manager',
 'Senior QA Engineer',
 'Technical Product Owner',
 'System Validation Engineer',
 'Product Support Engineer',
 'Technical Project Manager',
 'QA Lead',
 'Solutions Engineer',
] as const;
export const TITLES = [
  'Technical Product Builder',
  'QA Engineer with Product Superpowers',
  'Chief Why-Is-This-Broken Officer',
  'Full-Stack Problem Solver',
  'Cross-Functional Human API',
  'Professional Edge-Case Collector',
  'Chief It-Works-On-My-Machine Officer',
];
export function generateTitle(skills: readonly Skill[], attempt = 0): string {
  if (skills.length === 0) return '404: Skills Not Selected (Coffee Required)';
  if (skills.length === 1) return `${skills[0]} Specialist — Surprisingly Focused`;
  const pool = [
    ...(skills.includes('QA') && skills.includes('Development') ? ['Professional Bug Creator & Destroyer'] : []),
    ...(skills.includes('Product') && skills.includes('Development') ? ['Chief Idea-to-Reality Officer'] : []),
    ...(skills.includes('AI') && skills.includes('Data') ? ['Algorithm Whisperer'] : []),
    ...(skills.includes('DevOps') ? ['Production Firefighter (On Call Forever)'] : []),
    ...(skills.includes('QA') && skills.includes('Product') ? ['Chief But-What-About-The-User Officer'] : []),
    'Cross-Functional Chaos Coordinator',
    'Human Integration Layer',
    'Multi-Tab Brain Operator',
  ];
  return pool[((attempt % pool.length) + pool.length) % pool.length];
}
