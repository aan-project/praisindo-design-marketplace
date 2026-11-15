// Port of InfoTooltip() and IconTile(). Since DS 1.64 InfoTooltip renders the Tooltip component (dark bubble, flip, keyboard, touch) instead of the old CSS-only `.hint` tip.
import { usePrefsOptional } from '../../app/providers/PrefsProvider';
import { translate } from '../../i18n';
import { initials } from '../../lib/text';
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';

export function InfoTooltip({ text, icon = 'info' }: { text: string; icon?: string }) {
  const p = usePrefsOptional();   // usable without a provider (primitive tests): English label
  return <Tooltip label={p ? p.t('tt.help') : translate('en', 'tt.help')} icon={icon}>{text}</Tooltip>;
}
export function IconTile({ icon, intent = 'brand' }: { icon: string; intent?: string }) {
  return <span className={`hp-ic i-${intent}`} aria-hidden="true"><Icon name={icon} /></span>;
}

/** Port of Av(): initials avatar used in list rows. */
export function Avatar({ name }: { name: string }) {
  return <span className="hav" aria-hidden="true">{initials(name)}</span>;
}
