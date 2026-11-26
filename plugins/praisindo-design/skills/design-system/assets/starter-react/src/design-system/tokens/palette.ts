// Token palette of the Praisindo Design System (palette of v2.30, unchanged since). Do not edit the ramps or the neutral/dark values (rule CL-01); change only BDEF for your product.
// DK_INTENT stays empty unless the DS owner writes a dark value by hand.
export type Ramp = Readonly<Record<number, string>>;

export const N: Ramp = {0:'#ffffff',50:'#fcfcfc',100:'#efefef',200:'#eaeaea',300:'#dedede',400:'#c4c4c4',500:'#979797',600:'#5c5c5c',700:'#2c2c2c',800:'#191919',900:'#121212',950:'#0d0d0d'};
export const R: Ramp = {50:'#ffebee',100:'#ffcdd2',200:'#ef9a9a',300:'#e57373',500:'#f44336',600:'#e53935',700:'#d32f2f',900:'#b71c1c',950:'#611a15'};
export const G: Ramp = {50:'#e8f5e9',100:'#c8e6c9',200:'#a5d6a7',300:'#81c784',500:'#4caf50',600:'#43a047',700:'#388e3c',900:'#1b5e20'};
export const A: Ramp = {50:'#fff8e1',100:'#ffecb3',200:'#ffe082',300:'#ffd54f',500:'#ffc107',600:'#ffb300',700:'#ffa000',900:'#ff6f00',950:'#664d02'};
export const PU: Ramp = {50:'#f3e5f5',100:'#e1bee7',200:'#ce93d8',300:'#ba68c8',500:'#9c27b0',600:'#8e24aa',700:'#7b1fa2',900:'#4a148c'};
export const CY: Ramp = {50:'#e0f7fa',100:'#b2ebf2',200:'#80deea',300:'#4dd0e1',500:'#00bcd4',600:'#00acc1',700:'#0097a7',900:'#006064'};
export const IB: Ramp = {50:'#e3f2fd',100:'#bbdefb',200:'#90caf9',300:'#64b5f6',500:'#2196f3',600:'#1e88e5',700:'#1976d2',900:'#0d47a1'};
export const BR0: Ramp = {50:'#f2f8ff',100:'#d9ebff',200:'#bfdeff',300:'#73b6ff',400:'#409cff',500:'#007bff',600:'#006fe6',700:'#0056b3',800:'#004a99',900:'#003e80',950:'#001f40'};

export type FontScale = Readonly<{ xs: number; sm: number; md: number; lg: number; h1: number; h2: number; h3: number; h4: number }>;
export const FS: Readonly<Record<'small' | 'regular' | 'large', FontScale>> = {small:{xs:10,sm:12,md:13,lg:15,h1:24,h2:20,h3:18,h4:15},regular:{xs:11,sm:13,md:14,lg:16,h1:28,h2:24,h3:20,h4:16},large:{xs:12,sm:14,md:15,lg:18,h1:32,h2:28,h3:24,h4:18}};
export const DK = {page:'#0b0e13',card:'#151a21',raised:'#1e242d',field:'#10141a',line:'#222932',lineS:'#1a1f26',lineX:'#3d4652',text:'#e6e9ee',s1:'#2d3540',s2:'#6b7482',s3:'#8a93a1',s4:'#aab1bd'} as const;

/**
 * Optional dark-mode values for the intent colours. Nothing is written here yet: every dark intent token is then derived by the contrast engine (colorEngine.ts `darkIntent`).
 * To fix a dark value by hand, add it per intent and token; it is used verbatim (the engine does not touch it) and the other tokens of that intent stay derived.
 *   intents: brand | secondary | danger | success | warning | info | purple | cyan
 *   tokens : surface-subtle-1 | surface-default | foreground-default | foreground-strong | border-subtle | border-default | border-strong
 * Example: `export const DK_INTENT = { danger: { 'surface-default': '#d73b30', 'foreground-default': '#f7786e' } };`
 */
export type DkIntentToken = 'surface-subtle-1' | 'surface-default' | 'foreground-default' | 'foreground-strong' | 'border-subtle' | 'border-default' | 'border-strong';
export const DK_INTENT: Readonly<Partial<Record<string, Partial<Record<DkIntentToken, string>>>>> = {};

export interface Brand {
  appName: string; primary: string; secondary: string; logoLight: string; logoDark: string;
  favicon: string; font: string; /** the default weight of the text (300, 400, 500 or 600; DS 2.71): absent means 400 */ fontWeight?: number; defaultMode: 'light' | 'dark'; defaultLang: 'en' | 'id';
}
export const BDEF: Brand = {appName:'My App',primary:'#007bff',secondary:'#7e57c2',logoLight:'',logoDark:'',favicon:'',font:'Figtree',fontWeight:400,defaultMode:'light',defaultLang:'en'};
