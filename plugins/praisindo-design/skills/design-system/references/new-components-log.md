# New-component log and rule proposals

In a project that uses this skill nobody can grant permission to add to the DS master. So: you may create a component or variant that the DS does not have, but only after trying to meet the need with the existing ones, and you must log it so the Praisindo design owner can decide whether to add it to the DS master.

## File

`docs/design-system/new-components.md` (create it with the project; keep it in git). Sections:

```
# New components, variants and proposals — <project> (skill design-system v2.124.2)

## New components and variants
### <Name> — <date>
- Kind: component | variant of <existing component> | new token | new CSS pattern
- Why existing components did not fit: <1-3 sentences, name the closest existing component and what is missing>
- Where used: <pages/screens>
- Built from: <tokens and components used; confirm tokens only and grid 4px>
- API / props: <signature>
- Design System page: <section where the live example is>
- Suggested for the DS master? yes | no | unsure — <reason>

## Rule proposals
### <short title> — <date>
- Rule in conflict or missing: <id or "none">
- What the project needs and why
- What you did meanwhile (you keep following the rule)

## Temporary decisions
(e.g. Branding stored in the browser only; replace when a server exists.)
```

## When to log

- Any new TSX/HTML component, a new variant or prop of an existing component, a new token, a new class that does the job of a component (a custom pill, button, card, alert, list row).
- A different behaviour of a DS component.
- Anything you did that the DS rules do not cover, or where a rule gets in the way (never break the rule; propose).

## Rules for the new piece

Tokens only, 4px grid, light/dark, EN/ID, accessible (focus, labels, keyboard), a live example and an API row on the Design System page, no shadow unless the DS uses one for that component, and no re-use of an existing class name for another purpose.

Tell the user, in your final message, which entries were added to the log.
