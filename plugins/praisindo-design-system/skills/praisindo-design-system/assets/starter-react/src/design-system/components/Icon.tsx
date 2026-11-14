import { iconClass } from './iconClass';

/** Material Icons ligature, same markup as the prototype's Ic(name, solid). Decorative: hidden from assistive tech. */
export function Icon({ name, solid }: { name: string; solid?: boolean }) {
  return <span className={iconClass(solid)} aria-hidden="true">{name}</span>;
}
