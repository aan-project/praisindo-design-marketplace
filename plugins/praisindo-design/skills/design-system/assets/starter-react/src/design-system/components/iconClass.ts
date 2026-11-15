// Class names exactly as the prototype's Ic(): Outlined by default, filled only when `solid === true`.
export const iconClass = (solid?: boolean): string => `${solid === true ? 'material-icons' : 'material-icons-outlined'} ic`;
