// The text of a help article (rule HC-07): one reading column that styles headings, paragraphs, lists, tables, code and links of a Markdown article. Presentational only.
import type { ReactNode } from 'react';

export function ArticleBody({ children }: { children: ReactNode }) {
  return <div className="abd">{children}</div>;
}
