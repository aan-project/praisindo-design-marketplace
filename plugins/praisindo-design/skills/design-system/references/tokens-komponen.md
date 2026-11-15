# Tokens and components (DS v2.112.0)

Generated from the Praisindo design system document v2.30 (2026-11-03); the section "Changes up to DS 2.62" at the end lists what came after. The tables below leave out the components that came from the Praisindo domain. DomainBadges and RecommendationPickDrawer are not in the starters (build such pieces from `Badge` and the generic components). KanbanBoard / KanbanCard, ProfileCard / ProfileCardBody (the card of a person or a customer name, rules PC-02..PC-04, UN-01, UN-02), NotificationBell / NotificationPanel and the overlay helpers (`toOverlay`, `useActionMenu`) ARE in the starters and the rules require them: read their props in `assets/starter-react/src/design-system/components/`.

Foundations: font Figtree (set in Branding), letter-spacing .02em with Figtree only (any other brand font: 0, rule TH-12); brand default `#007bff`, secondary `#7e57c2`; Material Icons Outlined; radius cards/buttons/badge 8px (`--r-card`, `--r-ctl`, `--r-badge`), pill `--r-pill` 999px; focus 2px outline `--color-border-brand-strong`; dark mode uses the same token names with computed values. Controls are always size M.

## Which component for what

| Need | Use |
|---|---|
| Status or category label | `Badge` (soft, icon from the central map; `noIcon` for versions, names, tags) |
| Count, tag, name, version, permission, filter value, quick choice | `Chip` (static or interactive) |
| 2 to 4 exclusive options | `SegmentedControl` (more: `Select` or `RadioGroup`) |
| Grouped content | `Card` / `Section`; group title `GroupTitle`; detail rows `DR` |
| View/edit without leaving the page | `Drawer` (sm/md/lg; Back for nested) |
| A decision or a result | `Dialog` / `Modal` (kinds success, info, progress, warning, danger, confirm) |
| Page-level message for a real condition | `Alert` (info, success, warning, danger) |
| User must review a change (before/after) | `ChangeNotice` |
| Short confirmation | Toast (variant per intent) |
| Standing notes of a page | `Disclaimers` card at the bottom |
| Help text next to a label | `InfoTooltip` / `Tooltip` |
| Long form | `Wizard` (numbered) + `Accordion` |
| Selectable plan/template card | `RadioCard` |
| List page | `StatCards`, `SearchBar`, table, `Pagination`, empty/loading/error states |
| KPI and charts | `KPI`, `Spark`, `Ring`, `DonutSegs`, `W*` widgets |
| Detail page | `DetailLayout` + `DetailPanel` + `DetailSummary`; sections `AnchorNav`; sibling views `Tabs` |
| Sidebar collapse | `SidebarToggle` |
| Logo | `Logo`, `LogoMark`, `LogoOnBrand` |

## Tokens
### 3.1 Token naming
`--color-{role}-{intent}-{level}` where role is `background`, `surface`, `foreground` or `border`.
Neutral levels: surface `primary / secondary / tertiary`, foreground `default / subtle-1 ... subtle-4 / inverse-white / inverse-black`, border `subtle / default / strong`.
Intent levels: surface `subtle-1 / default / strong-1 / strong-2`, foreground `default / strong`, border `subtle / default / strong`.
Use `surface-*-subtle-1` for soft backgrounds, `foreground-*-strong` for text on them, `surface-*-default` for solid fills.

### 3.2 Intents
`brand` (primary action, selection, focus), `secondary`, `success` (done, healthy), `warning` (needs attention), `danger` (error, destructive, high risk), `info` (neutral information), `purple` and `cyan` (categories only), `neutral` (inactive, unknown).
Text on soft warning surfaces (badge, soft or transparent button, alert) uses `--color-foreground-warning-strong` (owner decision 2026-10-21; light-mode contrast is below AA, tracked in the a11y budget).
Components take `intent="..."`; helper classes `.i-{intent}` expose `--int-def, --int-hov, --int-prs, --int-sub, --int-fg, --int-bd` for custom parts.

### 3.3 Type scale
Tokens `--fs-xs, --fs-sm, --fs-md, --fs-lg, --fs-h-sm, --fs-h-md, --fs-h-lg, --fs-h-xl`. Body is `--fs-md`. Helper text uses `.mut` (subtle-4, `--fs-sm`). Detail rows: title `xs` in subtle-3, value `sm` in subtle-4 (component `DR`). Page title `h1`, card title `h2`.
The user can switch the base scale small / regular / large; see the table in section 3.4.


### 3.4 Token reference (generated)

Base font scale per user preference (small / regular / large):

| Step | Small | Regular | Large |
|---|---|---|---|
| xs | 10px | 11px | 12px |
| sm | 12px | 13px | 14px |
| md | 13px | 14px | 15px |
| lg | 15px | 16px | 18px |
| h1 | 24px | 28px | 32px |
| h2 | 20px | 24px | 28px |
| h3 | 18px | 20px | 24px |
| h4 | 15px | 16px | 18px |

Defaults shown with the default brand (`#007bff`). Intents with generated ramps: brand, secondary, danger, success, warning, info, purple, cyan.

#### Neutral: background and surface

| Token | Light | Dark |
|---|---|---|
| `--color-background-neutral-page` | #fcfcfc | #0b0e13 |
| `--color-background-neutral-default` | #ffffff | #151a21 |
| `--color-surface-neutral-primary` | #ffffff | #151a21 |
| `--color-surface-neutral-secondary` | #f7f7f7 | #1e242d |
| `--color-surface-neutral-tertiary` | #dedede | #2d3540 |

#### Neutral: foreground and border

| Token | Light | Dark |
|---|---|---|
| `--color-text-primary` | #121212 | #e6e9ee |
| `--color-text-faint` | #dedede | #2d3540 |
| `--color-text-muted` | #c4c4c4 | #6b7482 |
| `--color-text-tertiary` | #979797 | #8a93a1 |
| `--color-text-secondary` | #5c5c5c | #aab1bd |
| `--color-text-white` | #ffffff | #ffffff |
| `--color-text-black` | #121212 | #151a21 |
| `--color-border-neutral-subtle` | #efefef | #222932 |
| `--color-border-neutral-default` | #eaeaea | #2d3540 |
| `--color-border-neutral-strong` | #dedede | #5b6574 |

#### Intent: brand

| Token | Light | Dark |
|---|---|---|
| `--color-surface-brand-subtle-1` | #f2f8ff | #112b49 |
| `--color-surface-brand-default` | #007bff | #0071eb |
| `--color-surface-brand-strong-1` | #0056b3 | #73b6ff |
| `--color-surface-brand-strong-2` | #003e80 | #f2f8ff |
| `--color-foreground-brand-default` | #007bff | #47a0ff |
| `--color-foreground-brand-strong` | #0056b3 | #94c8ff |
| `--color-border-brand-subtle` | #f2f8ff | #0e3c6f |
| `--color-border-brand-default` | #bfdeff | #0854a6 |
| `--color-border-brand-strong` | #007bff | #47a0ff |

#### Intent: secondary

| Token | Light | Dark |
|---|---|---|
| `--color-surface-secondary-subtle-1` | #f9f7fc | #28253e |
| `--color-surface-secondary-default` | #7e57c2 | #7e57c2 |
| `--color-surface-secondary-strong-1` | #583d88 | #c5b3e4 |
| `--color-surface-secondary-strong-2` | #3f2c61 | #f9f7fc |
| `--color-foreground-secondary-default` | #7e57c2 | #a286d3 |
| `--color-foreground-secondary-strong` | #583d88 | #c9b8e5 |
| `--color-border-secondary-subtle` | #f9f7fc | #3a2f59 |
| `--color-border-secondary-default` | #dfd5f0 | #543f82 |
| `--color-border-secondary-strong` | #7e57c2 | #a286d3 |

#### Intent: danger

| Token | Light | Dark |
|---|---|---|
| `--color-surface-danger-subtle-1` | #ffebee | #3d2125 |
| `--color-surface-danger-default` | #f44336 | #d73b30 |
| `--color-surface-danger-strong-1` | #d32f2f | #e57373 |
| `--color-surface-danger-strong-2` | #b71c1c | #ffebee |
| `--color-foreground-danger-default` | #f44336 | #f7786e |
| `--color-foreground-danger-strong` | #d32f2f | #fab0ab |
| `--color-border-danger-subtle` | #ffebee | #632828 |
| `--color-border-danger-default` | #ef9a9a | #9b332e |
| `--color-border-danger-strong` | #f44336 | #f7786e |

#### Intent: success

| Token | Light | Dark |
|---|---|---|
| `--color-surface-success-subtle-1` | #e8f5e9 | #1f3529 |
| `--color-surface-success-default` | #4caf50 | #4caf50 |
| `--color-surface-success-strong-1` | #388e3c | #81c784 |
| `--color-surface-success-strong-2` | #1b5e20 | #e8f5e9 |
| `--color-foreground-success-default` | #4caf50 | #7ec581 |
| `--color-foreground-success-strong` | #388e3c | #b4ddb6 |
| `--color-border-success-subtle` | #e8f5e9 | #284e31 |
| `--color-border-success-default` | #a5d6a7 | #36733d |
| `--color-border-success-strong` | #4caf50 | #7ec581 |

#### Intent: warning

| Token | Light | Dark |
|---|---|---|
| `--color-surface-warning-subtle-1` | #fff8e1 | #3f361b |
| `--color-surface-warning-default` | #ffb300 | #ffb300 |
| `--color-surface-warning-strong-1` | #ffa000 | #ffc107 |
| `--color-surface-warning-strong-2` | #ff6f00 | #fff8e1 |
| `--color-foreground-warning-default` | #ffc107 | #ffc847 |
| `--color-foreground-warning-strong` | #ffa000 | #ffdf94 |
| `--color-border-warning-subtle` | #fff8e1 | #675015 |
| `--color-border-warning-default` | #ffe082 | #a1760d |
| `--color-border-warning-strong` | #ffc107 | #ffc847 |

#### Intent: info

| Token | Light | Dark |
|---|---|---|
| `--color-surface-info-subtle-1` | #e3f2fd | #173047 |
| `--color-surface-info-default` | #2196f3 | #1a78c2 |
| `--color-surface-info-strong-1` | #1976d2 | #64b5f6 |
| `--color-surface-info-strong-2` | #0d47a1 | #e3f2fd |
| `--color-foreground-info-default` | #2196f3 | #5fb3f6 |
| `--color-foreground-info-strong` | #1976d2 | #a2d3fa |
| `--color-border-info-subtle` | #e3f2fd | #19456b |
| `--color-border-info-default` | #90caf9 | #1c649f |
| `--color-border-info-strong` | #2196f3 | #5fb3f6 |

#### Intent: purple

| Token | Light | Dark |
|---|---|---|
| `--color-surface-purple-subtle-1` | #f3e5f5 | #2d1c3b |
| `--color-surface-purple-default` | #9c27b0 | #9c27b0 |
| `--color-surface-purple-strong-1` | #7b1fa2 | #ba68c8 |
| `--color-surface-purple-strong-2` | #4a148c | #f3e5f5 |
| `--color-foreground-purple-default` | #9c27b0 | #b863c6 |
| `--color-foreground-purple-strong` | #7b1fa2 | #d5a4de |
| `--color-border-purple-subtle` | #f3e5f5 | #441f53 |
| `--color-border-purple-default` | #ce93d8 | #662277 |
| `--color-border-purple-strong` | #9c27b0 | #b863c6 |

#### Intent: cyan

| Token | Light | Dark |
|---|---|---|
| `--color-surface-cyan-subtle-1` | #e0f7fa | #113741 |
| `--color-surface-cyan-default` | #00bcd4 | #00bcd4 |
| `--color-surface-cyan-strong-1` | #0097a7 | #4dd0e1 |
| `--color-surface-cyan-strong-2` | #006064 | #e0f7fa |
| `--color-foreground-cyan-default` | #00bcd4 | #47cfe0 |
| `--color-foreground-cyan-strong` | #006064 | #94e3ed |
| `--color-border-cyan-subtle` | #e0f7fa | #0e5360 |
| `--color-border-cyan-default` | #80deea | #087b8c |
| `--color-border-cyan-strong` | #00bcd4 | #47cfe0 |

#### Other

| Token | Light | Dark |
|---|---|---|
| `--color-scrim` | rgba(0,0,0,.45) | rgba(0,0,0,.65) |

### 3.5 Grid 4px (generated)

Every px size, gap, padding, margin, offset and line-height is a multiple of 4 (rules LY-01 to LY-04; a tie rounds up). Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64. Scan of the code (`node tools/audit_grid4.mjs`): **0** declarations off the grid, **22** exempt hairlines.

| Font size token | Line-height token | px |
|---|---|---|
| `--fs-xs` | `--lh-xs` | 16px |
| `--fs-sm` | `--lh-sm` | 20px |
| `--fs-md` | `--lh-md` | 20px |
| `--fs-lg` | `--lh-lg` | 24px |
| `--fs-h-sm` | `--lh-h-sm` | 24px |
| `--fs-h-md` | `--lh-h-md` | 24px |
| `--fs-h-lg` | `--lh-h-lg` | 28px |
| `--fs-h-xl` | `--lh-h-xl` | 32px |



## Components (signatures from the code)

Imported from `src/design-system/components/`. Signatures are copied from the code; the DS page shows each one live.

#### Alert

```ts
export interface AlertProps
export function Alert({ intent = 'info', text, extra, title, onClose, compact }: AlertProps)
```

#### Badge

```ts
export type BadgeProps =
export function Badge({ label, intent = 'brand', title, icon, noIcon, domain, value, what, tip }: BadgeProps)
```

#### Breadcrumb

```ts
export function Breadcrumb({ items }: { items: readonly (readonly [string, string])[] })
```

#### Button

```ts
export interface ButtonProps
export function Button({ label = '', icon, iconRight, intent = 'brand', type = 'fill', size = SZ, id, disabled, full, aria, title, cls = '', btnType = 'button', count = 0, zero, onClick, testid, pressed, expanded, controls }: ButtonProps)
export interface LinkBtnProps { label?: string; href: string; icon?: string; iconRight?: string; intent?: string; type?: string; size?: string; aria?: string; title?: string; cls?: string; onClick?: () => void }
export function LinkButton({ label = '', href, icon, iconRight, intent = 'brand', type = 'fill', size = SZ, aria, title, cls = '', onClick }: LinkBtnProps)
```

#### Card

```ts
export function Card({ title, body, actions, flush, footer }: { title: string; body: ReactNode; actions?: ReactNode; flush?: boolean; footer?: ReactNode })
export function Disclaimers({ items }: { items: readonly ReactNode[] })
export function Card({ body }: { body: ReactNode })
export function GroupTitle({ text, id }: { text: string; id?: string })
export function Section({ title, n, actions, desc, body, cls = '' }: { title: string; n?: number | null; actions?: ReactNode; desc?: string; body: ReactNode; cls?: string })
export function DR({ label, children }: { label: string; children?: ReactNode })
```

#### ChangeNotice

```ts
export interface ChangeNoticeProps { icon?: string; tone?: string; title: string; text?: string; rows?: readonly (readonly [string, ReactNode])[]; foot?: ReactNode; actions?: ReactNode; role?: string; cls?: string }
export function ChangeNotice({ icon = 'swap_horiz', tone = 'warning', title, text = '', rows = [], foot, actions, role = 'alert', cls = '' }: ChangeNoticeProps)
```

#### Chip

```ts
export interface ChipProps
export function Chip({ label, icon, title, disabled, selected, onClick, onRemove, removeLabel, data, removeData, testid, hidden, tone }: ChipProps)
```

#### Accordion

```ts
export interface CollapseCardProps { id: string; title: string; sum?: string; badge?: ReactNode; open?: boolean; force?: boolean; onToggle?: (open: boolean) => void; children?: ReactNode }
export function Accordion({ id, title, sum = '', badge, open = false, force = false, onToggle, children }: CollapseCardProps)
```

#### Controls

```ts
export function Switch({ id, label, on = false, dis, checked, onChange }: { id: string; label: string; on?: boolean; dis?: boolean; /** controlled: the value and its change (a setting that is saved) */ checked?: boolean; onChange?: (v: boolean) => void })
export function RadioGroup({ name, label, opts, val }: { name: string; label: string; opts: readonly (readonly [string, string])[]; val?: string })
export type SelOpts = readonly (readonly [string | number, string])[];
export function Select({ opts, val, size = SZ, aria = '', dis, onChange, id, label, req, opt, hint, help, err }: { opts: SelOpts; val?: string | number; size?: string; aria?: string; dis?: boolean; onChange?: (v: string) => void; id?: string; label?: string; req?: boolean; opt?: boolean; hint?: string; help?: string; err?: string })  // 2.31: with `label` it is a form field (.fld, label above, aria-required, aria-invalid); without it the bare control
export function SearchBar({ fields, size = SZ, fv, q = '', id = '', onField, onQuery, onClear }: { fields: SelOpts; size?: string; fv?: string; q?: string; id?: string; onField?: (v: string) => void; onQuery?: (v: string) => void; onClear?: () => void })
export function NumberInput({ id, label, val = 1, min = 0, max = 99, step = 1, suf = '' }: { id: string; label?: string; val?: number; min?: number; max?: number; step?: number; suf?: string })
export function OtpInput({ id, label, len = 6, hint }: { id: string; label?: string; len?: number; hint?: string })
export function PasswordInput({ id, label, val = '', req, meter = true }: { id: string; label?: string; val?: string; req?: boolean; meter?: boolean })
export function FileUpload({ id, label, accept = '', hint = '', multiple = true, maxMb = 5 }: { id: string; label?: string; accept?: string; hint?: string; multiple?: boolean; maxMb?: number })
export interface TagSuggestion { id: string; label: string; sub?: string; tag?: string; group?: string }
export interface TagInputProps { id: string; label?: string; val?: readonly string[]; ph?: string; suggest?: (q: string) => readonly TagSuggestion[]; sel?: readonly TagSuggestion[]; onSel?: (s: TagSuggestion[]) => void; free?: (raw: string) => TagSuggestion | null; req?: boolean; hint?: string; err?: string; none?: string; min?: number; keep?: string }
export function TagInput(p: TagInputProps)   // free tags (val, ph); with `suggest`: chips of `sel` and a list of suggestions under the field (rule EX-06)
```

#### DetailLayout

```ts
export function DetailLayout({ panel, children, side = 'left' }: { panel: ReactNode; children?: ReactNode; side?: 'left' | 'right' })
export function DetailPanel({ label, head, quick, tabs, body, note, testid }: { label: string; head: ReactNode; quick?: ReactNode; tabs?: ReactNode; body: ReactNode; note?: ReactNode; testid?: string })
export interface DetailSummaryProps
export function DetailSummary({ label, icon, intent, iconTitle, kicker, title, badges, cta, facts, next, testid }: DetailSummaryProps)
```

#### Drawer

```ts
export interface DrawerProps { title: string; size?: 'sm' | 'md' | 'lg'; id?: string; layer?: string; cls?: string; back?: string; closeLabel?: string;
export function Drawer({ title, size = 'md', id = 'drawer', layer = '', cls = '', back = '', closeLabel = 'Close', onClose, onBack, footer, actions, children }: DrawerProps)
```

#### SidebarToggle

```ts
export interface EdgeToggleProps { collapsed: boolean; label: string; onToggle: (pointer: boolean) => void }
export function SidebarToggle({ collapsed, label, onToggle }: EdgeToggleProps)
```

#### Field

```ts
export function DashBox()
export function FieldLabel({ label, req, opt, hint }: { label: string; req?: boolean; opt?: boolean; hint?: string })
export type SuggList = readonly (readonly [string, string | number])[];
export function Sugg({ list, onPick }: { list: SuggList; onPick?: (v: string | number) => void })
export interface InputProps
export function Input(p: InputProps)
export function MoneyInput(p: Omit<FormattedProps, 'pre'> & { cur?: string }) { return <Input {...p} format="money" />; }
export function GroupedNumberInput({ kind = 'ktp', max, val = '', ph, onValue, onSugg, ...o }: Omit<FormattedProps, 'help'> & { kind?: string; max?: number })
export function Textarea({ id, label, val = '', err = '', max, req, opt, hint, onChange }: { id: string; label: string; val?: string; err?: string; max?: number; req?: boolean; opt?: boolean; hint?: string; onChange?: (v: string) => void })
```

#### Hints

```ts
export function InfoTooltip({ text, icon = 'info' }: { text: string; icon?: string })
export function IconTile({ icon, intent = 'brand' }: { icon: string; intent?: string })
export function Av({ name }: { name: string })
```

#### Icon

```ts
export function Icon({ name, solid }: { name: string; solid?: boolean })
```

#### AnchorNav

```ts
export type JumpGroup = readonly [name: string, body: ReactNode];
export function AnchorNav({ k, groups, tools }: { k: string; groups: readonly JumpGroup[]; tools?: ReactNode })
export const JumpHead = ({ h, d }: { h: string; d: string }) => <div className="sech"><h2>{h}</h2><p className="mut">{d}</p></div>;
```

#### Logo

```ts
export const logoUrl = (b: Pick<Brand, 'logoLight' | 'logoDark'>, dark: boolean): string => (dark ? b.logoDark || b.logoLight : b.logoLight);
export const onBrandUrl = (b: Pick<Brand, 'logoLight' | 'logoDark'>): string => b.logoDark || b.logoLight;
export function useLogo()
export function Logo({ h = 32 }: { h?: number })
export function LogoMark({ h = 32 }: { h?: number })
export function LogoOnBrand({ h = 40 }: { h?: number })
```

#### Modal

```ts
export interface ModalCardProps { kind?: string; title: string; sub?: string; body?: ReactNode; footer?: ReactNode; icon?: string; id?: string; cls?: string; ariaModal?: boolean }
export function DialogCard({ kind = 'confirm', title, sub = '', body, footer, icon, id = 'modal', cls = '', ariaModal }: ModalCardProps)
export interface ModalProps extends Omit<ModalCardProps, 'cls' | 'ariaModal'> { tone?: string; onClose?: () => void }
export function Modal({ tone, kind, onClose, ...o }: ModalProps)
export interface DialogAct { label: string; icon?: string; onClick?: () => void }
export interface DialogTplProps
export function Dialog({ kind, title, sub, text, body, icon, id = 'dlg', ok: okIn, cancel: cancelIn, alt, onClose }: DialogTplProps)
```

#### RadioCard

```ts
export interface OptionCardProps { title: string; desc: string; tags?: readonly string[]; selected: boolean; selLabel?: string; disabled?: boolean; onSelect?: () => void }
export function RadioCard({ title, desc, tags = [], selected, selLabel, disabled, onSelect }: OptionCardProps)
```

#### Pagination

```ts
export interface PaginationProps
export function Pagination({ total, start, shown, pages, page, rpp, size, onPage, onRpp }: PaginationProps)
```

#### Phone

```ts
export const ctyCode = (c: string): string => (CTRY.find((x) => x[0] === c) ?? CTRY[0]!)[1];
export function Flag({ cc }: { cc: string })
export function CcPop({ cc, onPick }: { cc: string; onPick: (c: string) => void })
export interface PhoneInputProps { id: string; label?: string; cc?: string; val?: string; req?: boolean; opt?: boolean; hint?: string; err?: string; size?: string; onChange?: (value: string) => void }  // 2.31: onChange
export function PhoneInput({ id, label, cc: cc0 = 'ID', val = '', req, opt, hint, err = '', size = 'md', onChange }: PhoneInputProps)
```

#### Pickers

```ts
export interface DateFieldProps { id: string; label?: string; mode?: 'single' | 'range'; from?: string; to?: string; req?: boolean; opt?: boolean; hint?: string; err?: string; ph?: string; size?: string; onChange?: (from: string, to: string) => void }
export function DateField({ id, label, mode = 'single', from: from0 = '', to: to0 = '', req, opt, hint, err, ph, size = 'md', onChange }: DateFieldProps)  // 2.31: err, aria-required
export type MsOpts = readonly (readonly [string, string])[];
export interface MultiSelectProps { id: string; label?: string; opts: MsOpts; val?: readonly string[]; ph?: string; req?: boolean; opt?: boolean; hint?: string; err?: string; size?: string; onChange?: (v: string[]) => void }
export function MultiSelect({ id, label, opts, val: val0 = [], ph, req, opt, hint, err, size = 'md', onChange }: MultiSelectProps)  // 2.31: err, aria-required
```

#### SegmentedControl

```ts
export interface SegToggleProps { id: string; items: readonly (readonly [value: string, label: string, icon?: string])[]; val?: string; aria?: string; full?: boolean; onChange?: (v: string) => void }
export function SegmentedControl({ id, items, val, aria = '', full, onChange, label, req, opt, hint, err }: SegToggleProps)  // 2.31: with `label` it is a form field (.fld, label, aria-required on the radiogroup, err)
```

#### States

```ts
export function EmptyState({ size = SZ, title, desc, icon = 'inbox', cta }: { size?: string; title?: string; desc?: string; icon?: string; cta?: ReactNode })
export function ErrorState({ icon = 'error_outline', title, desc, cta, size = SZ }: { icon?: string; title: string; desc: string; cta?: ReactNode; size?: string })
export function RetryButton({ size, onClick }: { size?: string; onClick?: MouseEventHandler<HTMLButtonElement> })
export function AlertAction({ k, onClick }: { k: string; onClick?: MouseEventHandler<HTMLButtonElement> })
export function LoadingState({ size = SZ }: { size?: string })
export function ErrorState({ size = SZ, onRetry }: { size?: string; onRetry?: MouseEventHandler<HTMLButtonElement> })
export function Meter({ v }: { v: number })
```

#### Wizard

```ts
export interface Step { label: string; sub?: string; icon?: string; err?: boolean }
export interface StepNavProps { id: string; variant?: 'chevron' | 'segment' | 'numbered' | 'icon' | 'status'; steps: readonly Step[]; cur?: number; aria?: string; onStep?: (i: number) => void; readOnly?: boolean }
export function Wizard({ id, variant = 'numbered', steps, cur = 0, aria = '', onStep, readOnly }: StepNavProps)
```

#### Tabs

```ts
export type TabItem = readonly [string, string] | readonly [string, string, number];
export interface TabsProps { items: readonly TabItem[]; active?: string; size?: string; variant?: string; onChange?: (v: string) => void }
export function Tabs({ items, active, size = SZ, variant = '', onChange }: TabsProps)
export function DrawerTabs(p: Omit<TabsProps, 'variant'>)
```

#### Tooltip

```ts
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipVariant = 'text' | 'action' | 'title';
export interface TooltipAction { label: string; href?: string; onClick?: () => void }
export interface TooltipProps
export interface Placed { placement: TooltipPlacement; left: number; top: number; arrow: number }
export function ttPlace(tr: { left: number; top: number; right: number; bottom: number }, size: { w: number; h: number }, pref: TooltipPlacement, vw: number, vh: number): Placed
export function Tooltip({ children, variant, placement = 'top', title, action, label = '', icon = 'help', trigger, forceOpen }: TooltipProps)
export function useHoverTip(text: string)
```

#### Widgets

```ts
export function Delta({ v, good = 1, unit = '%', sr = '' }: { v: unknown; good?: number; unit?: string; sr?: string })
export interface SparkProps { vals: readonly unknown[]; intent?: string; w?: number; h?: number; area?: boolean; dot?: boolean; label?: string; cls?: string }
export function Spark({ vals, intent = 'brand', w = 120, h = 40, area = false, dot = false, label = '', cls = '' }: SparkProps)
export function Ring({ pct, intent = 'brand', size = 48, stroke = 6, inner, label = '' }: { pct: unknown; intent?: string; size?: number; stroke?: number; inner?: ReactNode; label?: string })
export type Seg = { v: unknown; intent: string; label: string };
export function DonutSegs({ segs, size = 140, stroke = 22, inner, label = '' }: { segs: readonly Seg[]; size?: number; stroke?: number; inner?: ReactNode; label?: string })
export function KPI({ label, n, note, size = SZ, delta, good = 1, spark, intent = 'brand' }: { label: string; n: ReactNode; note?: string; size?: string; delta?: unknown; good?: number; spark?: readonly unknown[]; intent?: string })
export interface StatItem { k?: string; on?: boolean; intent: string; label: string; n: ReactNode; pct?: number; icon?: string }
export function StatCards({ items, size = SZ, onStat }: { items: readonly StatItem[]; size?: string; onStat?: (k: string) => void })
export function WTrend({ title, value, spark, delta, good = 1, note }: { title: string; value: string; spark: readonly unknown[]; delta?: unknown; good?: number; note?: string })
export function WIconStat({ icon, intent = 'brand', value, label, delta, good = 1 }: { icon: string; intent?: string; value: string; label: string; delta?: unknown; good?: number })
export function WRingStat({ pct, label, intent = 'brand', note }: { pct: unknown; label: string; intent?: string; note?: string })
export function WArea({ icon, intent = 'brand', label, value, delta, good = 1, spark }: { icon: string; intent?: string; label: string; value: string; delta?: unknown; good?: number; spark: readonly unknown[] })
export function WDonut({ pct, center, value, label, intent = 'brand' }: { pct: unknown; center?: string; value: string; label: string; intent?: string })
export function WBars({ title, value, delta, good = 1, note, vals, labels, hi, intent = 'brand', actions }: { title: string; value: string; delta?: unknown; good?: number; note?: string; vals: readonly unknown[]; labels: readonly string[]; hi?: number | null; intent?: string; actions?: ReactNode })
export function WLine({ title, value, delta, good = 1, note, spark, labels = [], intent = 'brand', actions }: { title: string; value: string; delta?: unknown; good?: number; note?: string; spark: readonly unknown[]; labels?: readonly string[]; intent?: string; actions?: ReactNode })
export function WProgressList({ title, items, actions }: { title: string; items: readonly { label: string; value: string; target: string; v: unknown; of: unknown; intent?: string }[]; actions?: ReactNode })
export function WGauge({ title, value, target, fmt = (v: number) => String(v), note = '', intent = 'brand', actions }: { title: string; value: unknown; target: unknown; fmt?: (v: number) => string; note?: string; intent?: string; actions?: ReactNode })
export function WRingList({ title, items, actions }: { title: string; items: readonly { label: string; value: string; pct: unknown; intent?: string; icon?: string; delta?: unknown; good?: number }[]; actions?: ReactNode })
export function WSolid({ icon, value, label, delta, good = 1, intent = 'brand' }: { icon: string; value: string; label: string; delta?: unknown; good?: number; intent?: string })
export function WSegments({ title, segs, center, actions }: { title: string; segs: readonly Seg[]; center?: string; actions?: ReactNode })
export function WCompact({ title, value, label, spark, intent = 'brand' }: { title: string; value: string; label: string; spark: readonly unknown[]; intent?: string })
```

## Changes up to DS 2.62 (components and props that came after v2.30)
| Component | Signature or change | Rule |
|---|---|---|
| `RichSelect` | `RichSelect({ id, label, opts: [{v, label, desc?, icon?, intent?}], val, ph, req, opt, hint, err, size, aria, dis, onChange })`. A select whose options have an icon tile and a short description. | FM-13 |
| `ProductLogo` | `ProductLogo({ src?, name, size: 'sm' \| 'md' \| 'lg' })`. White box with a border; initials when there is no image. 32, 48 and 64px. | PD-07 (shape), see the Design page |
| `ArticleBody` | `ArticleBody({ children })`. One reading column for a long text (headings, lists, tables, code, links). | HC-07 |
| `DR` | `DR({ label, children, split? })`. `split`: label left, value right, a line under each row; a group in `.dr-g` under a `GroupTitle`. | DR-08 |
| `DateField` | adds `end` (popover opens to the left) and `up` (opens above), plus `err`, `req` and `aria-required`. | FM-14, FM-15, FM-12 |
| `Select`, `SegmentedControl`, `MultiSelect`, `PhoneInput` | form-field props (`label`, `req`, `opt`, `hint`, `err`, `onChange`); `SegmentedControl` with `val=""` hides the thumb. | FM-12 |
| `SearchBar` | adds `label` (the accessible name and placeholder when "Search" is too vague). | TB-17 |
| `Switch` | adds `hideLabel` (the label stays the accessible name; a switch in a table cell). | |
| `DetailLayout` | adds `wide` (right column 360px instead of 288px, with `side="right"`). | |
| `DetailSummary` | adds `avatar` (a logo in place of the icon tile). | |
| `Wizard` | adds `variant="vertical"` and `detail` (status variant shows the support text). | MO-07 |
| `StatCards`, `KPI`, widgets | add `animate` (default true: the numbers count up once; `false` shows them at once); the delta colour follows the direction, not a `good` argument. | MO-02, WG-01 |
| `LinkButton` | `label` accepts a node. | |
| Shell | `PROFILE_NAV` in `nav.config` and the menu of the user: Branding and Design System are there, not in the sidebar. `data-motion` on the root from `motionOn()` (`lib/countUp.ts`). | NV-13, MO-03 |


## Changes DS 2.63 to 2.73
| Component | Signature or change | Rule |
|---|---|---|
| `DetailLayout` | adds `third` (three panels as the customer record: `panel` left, children centre, `third` right). | DK-18 |
| `SegmentedControl` | adds `size?: 'sm' \| 'md'` (`sm` for a toggle in a card header); the thumb is exactly one option wide. | CP-01 |
| `RichSelect` | `RichOpt` adds `soft` (a second part of the name in a softer colour, after " - "). | FW-01 |
| `Wizard` | fills its container; labels on one line with an ellipsis; round bars; soft red error tile. | CP-02 |
| `NotificationPanel` | adds `top` (opens under the bell in a toolbar, at the top right). | PP-03 |
| `GlobalSearch` | `GlobalSearch({ id, q, groups: [{key, title, hits: [{id, icon, title, sub?, href}]}], label, placeholder, noneTitle, noneDesc, clearLabel, onQuery, onGo, placement?: 'side' \| 'below' })`. The search field with a results popover (groups, marked matches, keys). Presentational: the hits come in as props; `marked(text, q)` is exported. Style `69-site-search.css`. Not wired into the starter shell; a project that wants the sidebar search builds the search over its menu and help articles (SQ-01..SQ-04). | SQ-01..SQ-04 |
| `ApexChart` (optional adapter) | redraws when the container grows after the first draw. | CP-05 |
| `Brand` / `buildTokens` | `Brand.fontWeight` (300, 400, 500 or 600; absent = 400); `buildTokens` writes `--fw-shift` (weight minus 400) and every `font-weight` of the styles is `calc(N + var(--fw-shift,0))`. | FW-01, FW-02 |
| Styles | 69 files; `.note` is gone (use `Alert`), the bare `.pct` is gone, the content of a card and of the detail panels has 16px padding, the toast is at the bottom right. | CD-21..CD-23, DK-19 |

## Changes DS 2.74 to 2.83
Names changed in DS 2.76 (components, classes) and DS 2.79 (custom properties). The tables above already use the new names; `references/renames.json` lists every old name and `scripts/migrate-names.mjs` converts a project.

| Component | Signature or change | Rule |
|---|---|---|
| `Select` | the same props; on a device with a mouse it is a button with a list of its own in the overlay host (rows 40px, 32px small, check on the chosen row, search field when there are more than five options, keys), and a hidden native select keeps the value for forms. Native on touch devices and without `matchMedia`. Classes `.sl-t`, `.sl-n`, `.sl-v`, `.slp*`, `.slo`. | SL-01..SL-05 |
| `DateField` | adds `min`, `max`, `aria`; follows a value set by the page; hidden ISO input `name="<id>-iso"`. Its popover is drawn by `useFieldPopover().float()` (`.fpop-fix`). A date with a time is a DateField and a `Select` of the time in steps of 15 minutes. | FP-01, FP-02 |
| `MultiSelect`, `RichSelect`, `PhoneInput` | their popovers use `float()` as well. | FP-01 |
| `ErrorState` | one component (was `ErrState` and `ErrorState`): with no title and no description it is the standard error with Retry. | DS-23 |
| `Card` | without `title` it is the former `WoCard` (class `.card-bare`). | DS-23 |
| Renamed | `Wizard` (was StepNav), `NumberInput` (Stepper), `SegmentedControl` (SegToggle), `Avatar` (Av), `IconTile` (LiIc), `GroupTitle` (GroupT), `DetailRow` (DR), `ShortcutChips` (Sugg), `LinkButton`, `RetryButton`, `AlertAction`, `ActionMenu` (RowMenu), `InfoTooltip` (TipIcon), `AnchorNav` (JumpLayout), `SidebarToggle` (EdgeToggle), `RadioCard` (OptionCard), `Accordion` (CollapseCard), `PageHeader` (StdHead), `SearchBar` (SearchCombo), `GlobalSearch` (SiteSearch), `Table` (SimpleTbl), `GroupedNumberInput` (GroupInput), `FileUpload` (FileDrop), `Dialog` (DialogTpl), `DialogCard` (ModalCard), `PlainSection` (Section). | DS-23 |
| Custom properties | `--color-text-*` (neutral text), `--ff`, `--fw-shift`, `--page-pad`, `--color-scrim`, `--int-*`, `--card-gap`, `--drawer-pad`, `--hero-*`, `--dlg-*`, `--frozen-r`, `--tbl-*`, `--seg-*`, `--ring-*`, `--sign-glow`. | DS-26 |
