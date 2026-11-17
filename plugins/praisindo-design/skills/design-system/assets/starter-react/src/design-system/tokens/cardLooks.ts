// The looks of the number cards, in ONE place (rule WG-14, owner 2026-11-17). The stat cards and the KPI cards each have a list of looks; the first is the default.
// A look added here appears by itself in My Preferences (the drawers Stat view and KPI view list this registry and the stored choice is checked against it); the component draws it
// (`StatCards` and `KPI` in `components/Widgets.tsx`) and the Design page shows it with the component named in `comp` (a unit test checks both).
export interface CardLook {
  /** the value that is stored in the preferences and given to `variant` */ id: string;
  /** the name in English and in Indonesian, as the option of My Preferences shows it */ en: string; idn: string;
  /** the component that draws it, named on the Design page */ comp: string;
}
export const STAT_LOOKS: readonly CardLook[] = [
  { id: 'ring', en: 'Ring', idn: 'Ring', comp: 'StatCards' },
  { id: 'icon', en: 'Icon', idn: 'Ikon', comp: 'StatIcon' },
  { id: 'percent', en: 'Percent', idn: 'Persen', comp: 'StatRing' },
  { id: 'solid', en: 'Solid', idn: 'Solid', comp: 'StatSolid' },
  { id: 'soft', en: 'Soft', idn: 'Soft', comp: 'StatSoft' },
];
export const KPI_LOOKS: readonly CardLook[] = [
  { id: 'card', en: 'Card', idn: 'Kartu', comp: 'KPI' },
  { id: 'compact', en: 'Compact', idn: 'Ringkas', comp: 'KpiCompact' },
  { id: 'trend', en: 'Trend', idn: 'Tren', comp: 'KpiTrend' },
];
