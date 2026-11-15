// Live-instance counters for the adapters (M5 acceptance: "navigate between pages 50x: no leaked tables/charts/listeners").
// They are plain module counters so unit tests and the e2e stress test can read them (the e2e reads window.__adapterStats).
export interface AdapterStats { chartsCreated: number; chartsDestroyed: number; tablesCreated: number; tablesDestroyed: number }

const s: AdapterStats = { chartsCreated: 0, chartsDestroyed: 0, tablesCreated: 0, tablesDestroyed: 0 };

export const adapterStats = {
  get snapshot(): AdapterStats & { chartsLive: number; tablesLive: number } {
    return { ...s, chartsLive: s.chartsCreated - s.chartsDestroyed, tablesLive: s.tablesCreated - s.tablesDestroyed };
  },
  chartUp() { s.chartsCreated++; },
  chartDown() { s.chartsDestroyed++; },
  tableUp() { s.tablesCreated++; },
  tableDown() { s.tablesDestroyed++; },
  reset() { s.chartsCreated = s.chartsDestroyed = s.tablesCreated = s.tablesDestroyed = 0; },
};

if (typeof window !== 'undefined') (window as unknown as { __adapterStats?: typeof adapterStats }).__adapterStats = adapterStats;
