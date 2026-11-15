// A pointer click also blurs the button: the collapsed sidebar expands again while it has focus (`:focus-within`), so a mouse user would not see it collapse.
// Round collapse / expand button on the edge of the sidebar (docs/design-system/sidebar-mockup.html, `.edge`). Presentational: the page owns the state.
// Proposal (approved with the sidebar task): name SidebarToggle; props `collapsed`, `label` (the accessible name, i18n `hdr.sidebar`), `onToggle`; it sits on the right edge of a
// positioned container; role=button with aria-expanded = !collapsed; shown on the Design page under Navigation & shell; hidden on mobile where the sidebar is off-canvas.
import { Icon } from './Icon';

export interface EdgeToggleProps { collapsed: boolean; label: string; onToggle: (pointer: boolean) => void }

export function SidebarToggle({ collapsed, label, onToggle }: EdgeToggleProps) {
  return (
    <button type="button" className="edge" data-testid="sb-edge" aria-label={label} title={label} aria-expanded={!collapsed} onClick={(e) => { onToggle(e.detail > 0); if (e.detail > 0) e.currentTarget.blur(); }}>
      <Icon name={collapsed ? 'chevron_right' : 'chevron_left'} />
    </button>
  );
}
