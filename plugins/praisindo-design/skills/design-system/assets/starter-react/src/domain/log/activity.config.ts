// The categories of the Activity history of THIS product (rule GN-01): derive them from what its users do (the starter has the four generic ones). `icon` and `intent` draw the row; the labels are in both languages.
// Add a category here, never in a page; `logActivity` rejects a category that is not in this list.
export interface ActivityCategory { key: string; icon: string; intent: string; en: string; id: string }
export const ACTIVITY_CATEGORIES: readonly ActivityCategory[] = [
  { key: 'create', icon: 'add_circle_outline', intent: 'success', en: 'Created', id: 'Dibuat' },
  { key: 'update', icon: 'edit_note', intent: 'brand', en: 'Updated', id: 'Diubah' },
  { key: 'delete', icon: 'delete_outline', intent: 'danger', en: 'Deleted', id: 'Dihapus' },
  { key: 'auth', icon: 'login', intent: 'neutral', en: 'Sign-in & session', id: 'Masuk & sesi' },
];
export const activityCategory = (key: string): ActivityCategory | undefined => ACTIVITY_CATEGORIES.find((c) => c.key === key);
