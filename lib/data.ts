import type { Rep, SalesData, Targets, BadgeDef, WeeklySalesChart } from '@/types';

export const REPS: Rep[] = [
  { id: 1, name: 'Ana García',       avatar: 'AG', color: '#00e5ff', role: 'Senior AE', email: 'ana@empresa.com',    active: true },
  { id: 2, name: 'Carlos López',     avatar: 'CL', color: '#00ff9d', role: 'AE',        email: 'carlos@empresa.com', active: true },
  { id: 3, name: 'María Rodríguez',  avatar: 'MR', color: '#ffd600', role: 'Senior AE', email: 'maria@empresa.com',  active: true },
  { id: 4, name: 'David Martínez',   avatar: 'DM', color: '#ff6b35', role: 'AE',        email: 'david@empresa.com',  active: true },
  { id: 5, name: 'Laura Sánchez',    avatar: 'LS', color: '#b44fff', role: 'SDR',       email: 'laura@empresa.com',  active: true },
  { id: 6, name: 'Javier Fernández', avatar: 'JF', color: '#ff3d8b', role: 'AE',        email: 'javier@empresa.com', active: true },
  { id: 7, name: 'Sara González',    avatar: 'SG', color: '#00bcd4', role: 'SDR',       email: 'sara@empresa.com',   active: true },
  { id: 8, name: 'Miguel Torres',    avatar: 'MT', color: '#ffab40', role: 'AE',        email: 'miguel@empresa.com', active: true },
];

export const SALES_DATA: SalesData[] = [
  { repId: 1, week: 11800, month: 48200, quarter: 138500, year: 521000, deals: 31, avgT: 1555, conv: 35, newCli: 12, streak: 14 },
  { repId: 2, week: 13900, month: 57300, quarter: 162000, year: 610000, deals: 44, avgT: 1302, conv: 31, newCli: 19, streak: 21 },
  { repId: 3, week: 9200,  month: 38900, quarter: 108000, year: 405000, deals: 25, avgT: 1556, conv: 27, newCli: 9,  streak: 7  },
  { repId: 4, week: 15200, month: 62100, quarter: 182000, year: 688000, deals: 49, avgT: 1269, conv: 41, newCli: 23, streak: 28 },
  { repId: 5, week: 7800,  month: 31400, quarter: 92000,  year: 349000, deals: 19, avgT: 1653, conv: 23, newCli: 7,  streak: 5  },
  { repId: 6, week: 12400, month: 51200, quarter: 148000, year: 555000, deals: 38, avgT: 1347, conv: 33, newCli: 15, streak: 16 },
  { repId: 7, week: 8900,  month: 36700, quarter: 104000, year: 392000, deals: 23, avgT: 1596, conv: 28, newCli: 11, streak: 9  },
  { repId: 8, week: 11200, month: 45800, quarter: 131000, year: 490000, deals: 34, avgT: 1347, conv: 30, newCli: 13, streak: 12 },
];

export const TARGETS: Targets = {
  weekly: 12500,
  monthly: 50000,
  quarterly: 150000,
  yearly: 600000,
  dealTarget: 40,
  convTarget: 30,
};

export const BADGE_DEFS: BadgeDef[] = [
  { id: 'deal10',  icon: '⚡', label: 'Deal Maker',      desc: '10 deals en un mes',   color: '#ffd600' },
  { id: 'streak7', icon: '🔥', label: 'En Racha',         desc: '7 días seguidos',      color: '#ff6b35' },
  { id: 'target',  icon: '🎯', label: 'Obj. Cumplido',    desc: '100% del objetivo',    color: '#00e5ff' },
  { id: 'topteam', icon: '👑', label: 'Top del Equipo',   desc: '#1 en el ranking',     color: '#ffd700' },
  { id: 'bigdeal', icon: '💎', label: 'Big Deal',         desc: 'Deal > 5.000€',        color: '#b44fff' },
  { id: 'newcli',  icon: '🚀', label: 'Captador',         desc: '5+ nuevos clientes',   color: '#00ff9d' },
];

export const REP_BADGES: string[][] = [
  ['target', 'streak7', 'deal10'],
  ['topteam', 'target', 'streak7', 'deal10', 'bigdeal', 'newcli'],
  ['deal10'],
  ['topteam', 'target', 'streak7', 'deal10', 'bigdeal', 'newcli'],
  [],
  ['target', 'deal10'],
  ['deal10'],
  ['target', 'deal10', 'streak7'],
];

export const WEEKLY_SALES_CHART: WeeklySalesChart = {
  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
  data: [
    [1200, 1800, 900,  2100, 1800],
    [2100, 1400, 2800, 1900, 1700],
    [800,  1100, 1400, 2000, 900 ],
    [2800, 2200, 3100, 2500, 4600],
    [600,  900,  800,  1200, 700 ],
    [1800, 2200, 1600, 2900, 1900],
    [700,  1100, 900,  1400, 800 ],
    [1400, 1800, 1500, 2200, 1300],
  ],
};

export const ROLES = ['Senior AE', 'AE', 'SDR', 'BDR', 'Account Manager'];
export const COLORS = ['#00e5ff', '#00ff9d', '#ffd600', '#ff6b35', '#b44fff', '#ff3d8b', '#00bcd4', '#ffab40'];

// ── helpers ──────────────────────────────────────────────────────────────────

export function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M€`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}k€`;
  return `${n}€`;
}

export function fmtShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}k`;
  return `${n}`;
}

export function getSalesForPeriod(data: SalesData, period: string): number {
  return data[period as keyof SalesData] as number;
}

export function getTargetForPeriod(targets: Targets, period: string): number {
  const map: Record<string, number> = {
    week: targets.weekly,
    month: targets.monthly,
    quarter: targets.quarterly,
    year: targets.yearly,
  };
  return map[period] ?? targets.monthly;
}

export function getRank(repIdx: number, period: string, salesData: SalesData[]): number {
  const vals = salesData.map(d => getSalesForPeriod(d, period));
  const sorted = [...vals].sort((a, b) => b - a);
  return sorted.indexOf(vals[repIdx]) + 1;
}

export function calcXP(sales: number, deals: number, streak: number): number {
  return Math.round(sales / 1000 + deals * 10 + streak * 5);
}
