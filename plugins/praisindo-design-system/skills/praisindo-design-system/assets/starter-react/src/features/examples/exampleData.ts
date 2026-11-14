// Sample data of the example pages (features/examples). Invented records, no product data: replace with the product's own data source.
export type SupStatus = 'active' | 'pending' | 'inactive' | 'new';
export interface Supplier { id: string; name: string; city: string; cat: string; limit: number; terms: number; status: SupStatus; since: string; phone: string }

const A = ['Arta', 'Bumi', 'Cahaya', 'Dharma', 'Eka', 'Fajar', 'Garuda', 'Harapan', 'Indah', 'Jaya', 'Kencana', 'Lestari', 'Mulia', 'Nusa'];
const B = ['Supply', 'Trading', 'Logistics', 'Packaging', 'Foods'];
const CITY = ['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Makassar', 'Semarang'];
const CAT = ['raw', 'pack', 'svc', 'log'] as const;
const ST: readonly SupStatus[] = ['active', 'active', 'active', 'pending', 'inactive', 'new'];

export const SUPPLIERS: readonly Supplier[] = Array.from({ length: 42 }, (_, i) => ({
  id: 'SUP-' + String(1001 + i),
  name: `${A[i % A.length]} ${B[(i * 3) % B.length]}`,
  city: CITY[(i * 5) % CITY.length]!,
  cat: CAT[i % CAT.length]!,
  limit: ((i * 7) % 20 + 1) * 25_000_000,
  terms: [30, 60, 90][i % 3]!,
  status: ST[(i * 7) % ST.length]!,
  since: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`,
  phone: '812 ' + String(3000 + i * 37).padStart(4, '0') + ' ' + String(1000 + i * 91).slice(-4),
}));
export const supplierById = (id: string | undefined): Supplier | undefined => SUPPLIERS.find((s) => s.id === id);

/** Events of a supplier, newest first (rule OR-01). */
export const supplierLog = (s: Supplier): readonly { at: string; key: string }[] =>
  [{ at: s.since + ' 09:00', key: 'ex.log.created' }, { at: s.since + ' 11:30', key: 'ex.log.verified' }, { at: s.since + ' 14:10', key: 'ex.log.limit' }]
    .sort((a, b) => (a.at < b.at ? 1 : -1));
