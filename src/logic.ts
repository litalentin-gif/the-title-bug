export const SKILLS = ['QA','Product','Development','DevOps','UX/UI','Data','AI','Project Management','Cybersecurity','Marketing','Integration','Systems','Infrastructure'] as const;
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
 'Technical Program Manager',
 'Product Operations Manager',
 'Technical Solutions Consultant',
 'Integration Engineer',
 'Systems Engineer',
 'Release Manager',
 'Developer Experience Engineer',
 'Quality Engineering Lead',
] as const;
export const TITLES = [
  'Technical Product Builder',
  'QA Engineer with Product Superpowers',
  'Chief Why-Is-This-Broken Officer',
  'Full-Stack Problem Solver',
  'Cross-Functional Human API',
  'Professional Edge-Case Collector',
  'Chief It-Works-On-My-Machine Officer',
  'Chief Chaos Debugger',
  'Director of Making It Work',
  'Senior Dropdown Escape Artist',
  'Head of Unexpected Responsibilities',
];
export const EASTER_EGG = {
  title: '404: Professional Identity Not Found',
  description: 'Too qualified for one box. Too curious to stay in one lane.',
};
export const EASTER_EGG_INTERVAL = 10;
export type TitleMode = 'real' | 'funny';
export function pickModeTitle(mode: TitleMode, attempt: number): {title: string; description?: string} {
  if (mode === 'real') return {title: REAL_TITLES[attempt % REAL_TITLES.length]};
  if ((attempt + 1) % EASTER_EGG_INTERVAL === 0) return EASTER_EGG;
  // Discount earlier Easter Eggs so the cycle continues without skipping a title.
  const eggsShown = Math.floor((attempt + 1) / EASTER_EGG_INTERVAL);
  return {title: TITLES[(attempt - eggsShown) % TITLES.length]};
}
export function generateTitle(skills: readonly Skill[], attempt = 0): string {
  if (skills.length === 0) return '404: Skills Not Selected (Coffee Required)';
  if (skills.length === 1) return `${skills[0]} Specialist — Surprisingly Focused`;
  const pool = [
    ...(skills.includes('QA') && skills.includes('Development') ? ['Professional Bug Creator & Destroyer'] : []),
    ...(skills.includes('Product') && skills.includes('Development') ? ['Chief Idea-to-Reality Officer'] : []),
    ...(skills.includes('AI') && (skills.includes('Data') || skills.includes('Development')) ? ['Algorithm Whisperer'] : []),
    ...(skills.includes('DevOps') || skills.includes('Infrastructure') ? ['Production Firefighter (On Call Forever)'] : []),
    ...(skills.includes('QA') && (skills.includes('Product') || skills.includes('UX/UI')) ? ['Chief But-What-About-The-User Officer'] : []),
    ...(skills.includes('Project Management') && skills.includes('Development') ? ['Technical Program Manager'] : []),
    ...(skills.includes('Product') && skills.includes('Project Management') ? ['Product Operations Manager'] : []),
    ...(skills.includes('Development') && skills.includes('Marketing') ? ['Technical Solutions Consultant'] : []),
    ...((skills.includes('Development') && skills.includes('DevOps')) || (skills.includes('Integration') && (skills.includes('Development') || skills.includes('DevOps') || skills.includes('Systems') || skills.includes('Infrastructure'))) ? ['Integration Engineer'] : []),
    ...((skills.includes('Cybersecurity') && (skills.includes('DevOps') || skills.includes('Systems') || skills.includes('Infrastructure'))) || (skills.includes('Systems') && (skills.includes('DevOps') || skills.includes('Development') || skills.includes('Infrastructure'))) ? ['Systems Engineer'] : []),
    ...(skills.includes('QA') && skills.includes('Systems') ? ['System Validation Engineer'] : []),
    ...(skills.includes('Product') && skills.includes('Integration') ? ['Solutions Engineer'] : []),
    ...(skills.includes('Project Management') && (skills.includes('DevOps') || skills.includes('Infrastructure')) ? ['Release Manager'] : []),
    ...(skills.includes('Development') && skills.includes('UX/UI') ? ['Developer Experience Engineer'] : []),
    ...(skills.includes('QA') && skills.includes('DevOps') ? ['Quality Engineering Lead', 'Chief Chaos Debugger'] : []),
    ...(skills.includes('QA') && skills.includes('UX/UI') ? ['Professional Edge-Case Collector'] : []),
    ...(skills.includes('Product') && skills.includes('DevOps') ? ['Director of Making It Work'] : []),
    ...(skills.includes('Development') && skills.includes('Data') ? ['Full-Stack Problem Solver'] : []),
    ...(skills.includes('Product') && skills.includes('UX/UI') ? ['Senior Dropdown Escape Artist'] : []),
    ...(skills.length >= 4 ? ['Head of Unexpected Responsibilities'] : []),
    'Cross-Functional Chaos Coordinator',
    'Human Integration Layer',
    'Multi-Tab Brain Operator',
  ];
  return pool[((attempt % pool.length) + pool.length) % pool.length];
}
