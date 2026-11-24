import { createContext } from 'react';

/** True inside a detail page (`DetailLayout`): its tabs are segmented without being asked (rule DT-19). */
export const DetailPageContext = createContext(false);
