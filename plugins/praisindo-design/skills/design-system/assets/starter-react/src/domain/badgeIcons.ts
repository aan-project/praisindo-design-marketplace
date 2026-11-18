// The central badge map (rule BD-03): for every value a badge shows, its intent (colour). The badge has no icon (BD-02, owner 2026-11-18). ONE map for the whole app; no page keeps a map of its own.
// Starter: three generic domains. Add the domains of your product here (a status, a category, a risk level ...) and the matching `bdg.d.<domain>` keys in the dictionaries.
// Rule: the same value has the same colour everywhere; every value has its intent.
export interface BadgeSpec { readonly intent: string }

export type BadgeDomain = 'status' | 'priority' | 'confidence' | 'fixed';

export const BADGE_MAP: Readonly<Record<BadgeDomain, Readonly<Record<string, BadgeSpec>>>> = {
  status: {
    'draft': { intent: 'neutral' },
    'pending': { intent: 'warning' },
    'in_progress': { intent: 'purple' },
    'active': { intent: 'success' },
    'completed': { intent: 'success' },
    'failed': { intent: 'danger' },
    'expired': { intent: 'danger' },
    'inactive': { intent: 'neutral' },
    'new': { intent: 'info' },   // "new" is a flame everywhere (BD-11)
  },
  priority: {
    'high': { intent: 'danger' },
    'medium': { intent: 'warning' },
    'low': { intent: 'neutral' },
  },
  confidence: {
    'high': { intent: 'success' },
    'medium': { intent: 'warning' },
    'low': { intent: 'danger' },
  },
  fixed: {},
};

/** The intent of a value. An unknown value is a mistake in the caller: it gets the intent `unknown` (default neutral) so that the page still renders. */
export function badgeFor(domain: BadgeDomain, value: string, unknown = 'neutral'): BadgeSpec {
  return BADGE_MAP[domain][value] ?? { intent: unknown };
}

/** The props of a Badge for a value of the map: the intent and the domain and value the hover tooltip is built from (rule BD-13). */
export function badgeProps(domain: BadgeDomain, value: string, unknown = 'neutral'): BadgeSpec & { readonly domain: BadgeDomain; readonly value: string } {
  return { ...badgeFor(domain, value, unknown), domain, value };
}
