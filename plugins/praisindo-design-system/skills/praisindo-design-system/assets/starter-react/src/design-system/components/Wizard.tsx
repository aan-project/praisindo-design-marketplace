// Port of Wizard(): five variants. The `act` data attributes become onStep(index).
import { usePrefs } from '../../app/providers/PrefsProvider';
import { stepBarWidth, stepPad, stepState } from '../../domain/nav';
import { Icon } from './Icon';

export interface Step { label: string; sub?: string; icon?: string; err?: boolean }
export interface StepNavProps { id: string; variant?: 'chevron' | 'segment' | 'numbered' | 'icon' | 'status' | 'vertical'; steps: readonly Step[]; cur?: number; aria?: string; onStep?: (i: number) => void; readOnly?: boolean; /** variant status: the support text of a step replaces the state text under its label (the execution request card, rule XR-14) */ detail?: boolean }

export function Wizard({ id, variant = 'numbered', steps, cur = 0, aria = '', onStep, readOnly, detail }: StepNavProps) {
  const { t } = usePrefs();
  return (
    <nav className={`wz wz-${variant}`} id={id} aria-label={aria || t('sn.aria')}>
      <ol>
        {steps.map((x, i) => {
          const st = stepState(i, cur, x.err);
          const lab = <><span className="wz-l">{x.label}</span>{x.sub ? <span className="wz-t">{x.sub}</span> : null}</>;
          const mark = st === 'done' ? <Icon name="check" /> : st === 'err' ? <Icon name="priority_high" /> : null;
          let inner;
          if (variant === 'chevron') inner = lab;
          else if (variant === 'segment') inner = <><span className="wz-bar" /><span className="wz-row"><Icon name={st === 'done' ? 'check_circle' : st === 'cur' ? 'radio_button_checked' : st === 'err' ? 'error' : 'radio_button_unchecked'} /><span className="wz-l">{x.label}</span></span></>;
          else if (variant === 'icon') inner = <><span className="wz-ico"><Icon name={x.icon || 'circle'} /></span><span className="wz-bar"><i style={{ width: `${stepBarWidth(i, cur)}%` }} /></span>{lab}</>;
          else if (variant === 'vertical') inner = <><span className="wz-top"><span className="wz-n">{mark ?? (st === 'cur' ? <Icon name="more_horiz" /> : stepPad(i))}</span><i className="wz-ln" /></span><span className="wz-tx"><span className="wz-l">{x.label}</span>{x.sub ? <span className="wz-t">{x.sub}</span> : null}</span></>;   // rule XR-01: the steps of a request as a column
          else if (variant === 'status') inner = <><span className="wz-top"><span className="wz-n">{mark ?? (st === 'cur' ? <i /> : null)}</span><i className="wz-ln" /></span><span className="wz-l">{x.label}</span><span className="wz-st">{detail && x.sub ? x.sub : t(st === 'done' ? 'sn.done' : st === 'cur' ? 'sn.cur' : st === 'err' ? 'sn.err' : 'sn.todo')}</span></>;
          else inner = <><span className="wz-top"><i className="wz-ln" /><span className="wz-n">{mark ?? stepPad(i)}</span><i className="wz-ln" /></span>{lab}</>;
          return (
            <li key={i} className={`wz-s ${st}`}>
              {readOnly   // a status, not a control: the steps are not buttons (rule DT-07)
                ? <div className="wz-b wz-ro" aria-current={i === cur ? 'step' : undefined}>{inner}</div>
                : <button type="button" className="wz-b" aria-current={i === cur ? 'step' : undefined} aria-label={x.err ? `${x.label}: ${t('sn.err')}` : undefined} onClick={() => onStep?.(i)}>{inner}</button>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
