// The application root: providers, the Praisindo shell, and the page of the current route. Add pages in app/routes.tsx and menu entries in app/nav.config.ts.
import { PrefsProvider } from './app/providers/PrefsProvider';
import { ToastProvider } from './app/providers/ToastProvider';
import { ROUTES, routeKeyOf } from './app/routes';
import { usePage } from './app/routing';
import { AppShell } from './app/shell/AppShell';

function Routes() {
  const page = usePage();
  return <AppShell page={page}>{ROUTES[routeKeyOf(page)]!.element(page)}</AppShell>;
}

export default function App() {
  return <PrefsProvider><ToastProvider><Routes /></ToastProvider></PrefsProvider>;
}
