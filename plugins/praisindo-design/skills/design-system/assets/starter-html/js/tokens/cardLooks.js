// The looks of the number cards, in ONE place (rule WG-14, owner 2026-11-17). The stat cards and the KPI cards each have a list of looks; the first is the default.
// A look added here appears by itself in My Preferences (the drawers Stat view and KPI view list this registry and the stored choice is checked against it); `comp` is the component that draws it and the Design page names.
export const STAT_LOOKS = [
  { id: 'ring', en: 'Ring', idn: 'Ring', comp: 'StatCards' },
  { id: 'icon', en: 'Icon', idn: 'Ikon', comp: 'StatIcon' },
  { id: 'percent', en: 'Percent', idn: 'Persen', comp: 'StatRing' },
  { id: 'solid', en: 'Solid', idn: 'Solid', comp: 'StatSolid' },
  { id: 'soft', en: 'Soft', idn: 'Soft', comp: 'StatSoft' },
];
export const KPI_LOOKS = [
  { id: 'card', en: 'Card', idn: 'Kartu', comp: 'KPI' },
  { id: 'compact', en: 'Compact', idn: 'Ringkas', comp: 'KpiCompact' },
  { id: 'trend', en: 'Trend', idn: 'Tren', comp: 'KpiTrend' },
];
