# Rules register of this project

Every rule the owner gives (prompt, chat, image) and every rule the agent creates on its own is recorded here in the same piece of work (RG-01): id, the rule in one sentence, source, kind, status, the test or check that guards it, date. Status: `aktif`, `digantikan oleh <id>` or `perlu keputusan owner`.

A new rule that contradicts an existing one is reported to the owner at once, recorded below as `perlu keputusan owner` with the id it clashes with, and the existing rule stays active until the owner decides (RG-02). Run `node scripts/rules-conflicts.mjs --new <ids>` for every new rule. A rule the agent made on its own waits here as `perlu keputusan owner` until the owner confirms it (RG-04). The general rules of the Praisindo skill are in `references/rules-*.md` of the skill and are not repeated here; this file holds the rules of THIS project (for example GN-01 to GN-06 as built here, and the project's own product rules).

## Konflik (perlu keputusan owner)
No open conflict.

## Rules
| id | aturan | sumber | jenis | status | test | tanggal |
|---|---|---|---|---|---|---|
