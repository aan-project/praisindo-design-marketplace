// The central badge map (rules BD-02, BD-03): for every value a badge shows, its intent (colour) and its icon. ONE map for the whole app; no page keeps a map of its own.
// Starter: three generic domains. Add the domains of your product here (a status, a category, a risk level ...) and the matching `bdg.d.<domain>` keys in the dictionaries.
// Rules: the same value has the same icon everywhere; values that show together in one group have different icons; every value has an icon (or the explicit `noIcon` flag at the call site).
export interface BadgeSpec { readonly intent: string; readonly icon: string }

export type BadgeDomain = 'status' | 'priority' | 'confidence' | 'fixed';

export const BADGE_MAP: Readonly<Record<BadgeDomain, Readonly<Record<string, BadgeSpec>>>> = {
  status: {
    'draft': { intent: 'neutral', icon: 'edit_note' },
    'pending': { intent: 'warning', icon: 'schedule' },
    'in_progress': { intent: 'purple', icon: 'autorenew' },
    'active': { intent: 'success', icon: 'check_circle' },
    'completed': { intent: 'success', icon: 'task_alt' },
    'failed': { intent: 'danger', icon: 'error_outline' },
    'expired': { intent: 'danger', icon: 'event_busy' },
    'inactive': { intent: 'neutral', icon: 'block' },
    'new': { intent: 'info', icon: 'local_fire_department' },   // "new" is a flame everywhere (BD-11)
  },
  priority: {
    'high': { intent: 'danger', icon: 'keyboard_double_arrow_up' },
    'medium': { intent: 'warning', icon: 'drag_handle' },
    'low': { intent: 'neutral', icon: 'keyboard_arrow_down' },
  },
  confidence: {
    'high': { intent: 'success', icon: 'check_circle' },
    'medium': { intent: 'warning', icon: 'error_outline' },
    'low': { intent: 'danger', icon: 'help_outline' },
  },
  fixed: {},
};

/** The intent and icon of a value. An unknown value is a mistake in the caller: it gets the intent `unknown` (default neutral) and a question-mark icon so that the page still renders. */
export function badgeFor(domain: BadgeDomain, value: string, unknown = 'neutral'): BadgeSpec {
  return BADGE_MAP[domain][value] ?? { intent: unknown, icon: 'help_outline' };
}

/** The props of a Badge for a value of the map: intent, icon and the domain and value the hover tooltip is built from (rule BD-13). */
export function badgeProps(domain: BadgeDomain, value: string, unknown = 'neutral'): BadgeSpec & { readonly domain: BadgeDomain; readonly value: string } {
  return { ...badgeFor(domain, value, unknown), domain, value };
}
