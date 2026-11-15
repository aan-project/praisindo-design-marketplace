# Praisindo design marketplace

Plugin **Praisindo design** (`praisindo-design`) with the skill `design-system` for Claude Code, with automatic updates. Call it with `/design-system` or `praisindo-design:design-system`; it also loads itself for UI work.

## Install once
```
/plugin marketplace add aan-project/praisindo-design-marketplace
/plugin install praisindo-design@praisindo-design-marketplace
```
In the desktop app: add the marketplace, then choose **Praisindo design** and "Install for me".

## Update
- **Desktop app:** Settings → Capabilities → Your plugins → Praisindo design. The version is shown under the name; the **Update** button is active when a newer version is published (grey when you have the latest). The app has no switch for automatic updates there; update by hand after each release and check the version number.
- **Claude Code in the terminal:** `/plugin` → tab Marketplaces → praisindo-design-marketplace → Enable auto-update; or by hand: `/plugin marketplace update praisindo-design-marketplace`.
- Whether the desktop app updates a third-party marketplace by itself is not tested; after the next release look at the version without pressing Update.

## Version
Three parts, `MAJOR.MINOR.PATCH` (rule VN-01 of the design system): MAJOR.MINOR is the number of the Praisindo design system the skill was synchronised with; PATCH is a fix of the skill only (the design system does not change) and goes back to 0 when the design system goes up; MAJOR goes up only when a project that uses the skill must be reworked (the owner decides).

## Owner: release a new version
1. Replace `plugins/praisindo-design/skills/design-system/` with the latest synchronised skill (without `.DS_Store` and `node_modules`).
2. Raise `version` in `plugins/praisindo-design/.claude-plugin/plugin.json` and in `.claude-plugin/marketplace.json` (plugin entry and `metadata.version`) to the same number. Without a new version the users do not receive the update.
3. Add one line to `CHANGELOG.md`.
4. Commit, tag `vMAJOR.MINOR.PATCH` and push `main` and the tag (`git push && git push --tags`).

The zip for claude.ai (`praisindo-design-v<version>.zip`) is built from the same folder.
