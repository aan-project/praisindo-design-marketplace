// PLACEHOLDER session. Replace with the product's real sign-in. The shell only needs a name, an email and whether the user is an administrator.
// Rule: a protected page must never render its content for a user who may not see it (the shell shows the "restricted" card).
export interface Session { name: string; email: string; admin: boolean }
export const useSession = (): { sess: Session; signOut: (() => void) | null } => ({ sess: { name: 'Demo Admin', email: 'admin@example.com', admin: true }, signOut: null });
/** Permission check used by menus and pages. Wire it to the product's roles. */
export const can = (_permission: string, sess: Session = useSession().sess): boolean => sess.admin;
