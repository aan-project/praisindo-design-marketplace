// PLACEHOLDER session. Replace with the product's real sign-in. The shell needs a name, an email and whether the user is an administrator.
// Rule: a protected page must never render its content for a user who may not see it (the shell shows the "restricted" card).
export const session = { name: 'Demo Admin', email: 'admin@example.com', admin: true };
export const signOut = null;   // set a function when the product has a sign-in: the user menu then shows "Sign out"
