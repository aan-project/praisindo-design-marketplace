// CopyButton (rule CP-01, owner decision 2026-11-23): the icon button that copies a value the user has to carry somewhere else: a password, a one-time code, a phone or WhatsApp number, an email,
// an account or virtual-account number, an amount to pay, a reference or an ID. It sits right after the value (the value stays readable text; select-and-copy still works). One click copies `value`
// (not the label), the icon turns into a check for two seconds and a toast says "Copied"; when the browser refuses, the toast says so (danger). It is an icon-only link Button (type link, intent neutral: the soft secondary text colour that turns primary on hover; owner revision 2026-11-23),
// so it has the focus ring and the hover of a Button. `label` names the value for assistive technology ("Copy password"). Nothing is sent anywhere: it only uses the clipboard.
import { useEffect, useRef, useState } from 'react';
import { usePrefs } from '../../app/providers/PrefsProvider';
import { useToastOptional } from '../../app/providers/ToastProvider';
import { fill } from '../../i18n/fill';
import { copyText } from '../../lib/copyText';
import { Button } from './Button';

export interface CopyButtonProps {
  /** the text that is copied (a phone number as it is dialled, an amount without the currency sign when it is typed into another field, the plain password) */ value: string;
  /** the name of the value, for the accessible label and the tooltip: "password", "phone number" */ label: string;
  /** `md` where the value is a field-size line (a password box), `sm` (default) inline after a text */ size?: 'sm' | 'md';
  /** told when the copy worked (the activity log of a page may record it) */ onCopied?: () => void;
}
const SHOWN_MS = 2000;

export function CopyButton({ value, label, size = 'sm', onCopied }: CopyButtonProps) {
  const { t } = usePrefs(), toast = useToastOptional()?.toast, [done, setDone] = useState(false), timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const name = fill(t('cp.aria'), { n: label });
  const click = () => { void copyText(value).then((ok) => { if (!ok) { toast?.(t('cp.fail'), 'danger'); return; } setDone(true); toast?.(fill(t('cp.done'), { n: label })); onCopied?.(); clearTimeout(timer.current); timer.current = setTimeout(() => setDone(false), SHOWN_MS); }); };
  return <Button icon={done ? 'check' : 'content_copy'} type="link" intent="neutral" size={size} aria={name} title={name} onClick={click} />;
}
