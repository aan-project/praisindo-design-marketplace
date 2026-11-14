// "This project" section of the Design page (mandatory): the components this project added because the design system had none (docs/design-system/new-components.md).
// Every new component is shown here with its states, and logged in the markdown file. The standard sections above are the design system and are not edited by a project.
import log from '../../../docs/design-system/new-components.md?raw';
import { DsH, DsSec, useB } from './ds';

/** Add the demo of each project component to this list (name, element). */
export const PROJECT_COMPONENTS: readonly { name: string; demo: React.ReactNode }[] = [];

export function ProjectSection() {
  const B = useB();
  const logged = [...log.matchAll(/^### (.+?) \(/gm)].map((m) => m[1]!);
  return (
    <DsSec id="project" title={B('This project', 'Proyek ini')} lead={B('Components added by this project because the design system has none. Each one is listed in docs/design-system/new-components.md for the design-system owner.', 'Komponen yang ditambahkan proyek ini karena design system belum punya. Masing-masing dicatat di docs/design-system/new-components.md untuk pemilik design system.')}>
      <DsH>{B('Project components', 'Komponen proyek')}</DsH>
      {PROJECT_COMPONENTS.length ? PROJECT_COMPONENTS.map((c) => <div key={c.name} className="dsx"><span className="dsl">{c.name}{logged.includes(c.name) ? '' : ' · ' + B('not logged yet', 'belum dicatat')}</span><div className="dsv">{c.demo}</div></div>)
        : <p className="mut">{B('No project components yet. All screens use the design-system components.', 'Belum ada komponen proyek. Semua layar memakai komponen design system.')}</p>}
    </DsSec>
  );
}
