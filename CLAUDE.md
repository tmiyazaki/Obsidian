# CLAUDE.md — Obsidian Vault Guide

This file documents the structure, conventions, and workflows for this personal Obsidian knowledge management vault. AI assistants working in this repository should follow the guidelines below.

---

## Repository Purpose

This is a personal [Obsidian](https://obsidian.md/) vault stored as a Git repository. Obsidian is a Markdown-based note-taking application that supports bidirectional linking, tags, and rich metadata via YAML frontmatter. All notes are plain `.md` files.

---

## Directory Structure

```
Obsidian/
├── CLAUDE.md               # This file
├── .obsidian/              # Obsidian app settings (plugins, themes, hotkeys)
│   ├── app.json
│   ├── plugins/
│   └── themes/
├── Daily Notes/            # One file per day (YYYY-MM-DD.md)
├── Projects/               # Active project notes and planning docs
├── Resources/              # Reference material, research, links
├── Templates/              # Reusable note templates
├── Archive/                # Completed or inactive notes
└── Attachments/            # Images, PDFs, and other embedded files
```

> Directories are created on demand as the vault grows. The above is the intended layout — not all may exist yet.

---

## Note Conventions

### File Naming

- Use human-readable titles: `My Note Title.md` (not `my-note-title.md`)
- Daily notes follow `YYYY-MM-DD.md` (e.g., `2026-05-01.md`)
- Avoid special characters except spaces, hyphens, and underscores

### YAML Frontmatter

All non-daily notes should include frontmatter at the top:

```yaml
---
title: Note Title
date: 2026-05-01
tags: [tag1, tag2]
status: draft | active | archived
---
```

| Field    | Required | Description                                      |
|----------|----------|--------------------------------------------------|
| `title`  | Yes      | Human-readable title (may differ from filename) |
| `date`   | Yes      | Creation date in `YYYY-MM-DD` format             |
| `tags`   | No       | Array of lowercase tags                         |
| `status` | No       | Lifecycle state of the note                     |

### Linking

- Use **wikilinks** for internal links: `[[Note Title]]`
- Use `[[Note Title|display text]]` when the display text should differ
- Use standard Markdown links for external URLs: `[text](https://example.com)`
- Embed notes or images with `![[filename]]`

### Tags

- Lowercase, no spaces: `#project`, `#reference`, `#todo`
- Hierarchical tags are allowed: `#projects/active`, `#area/health`
- Prefer frontmatter `tags:` array over inline `#tags` for searchability

### Callouts (Obsidian-flavored)

```markdown
> [!NOTE]
> This is a note callout.

> [!WARNING]
> This is a warning.

> [!TIP]
> This is a tip.
```

---

## Git Workflow

### Branch Strategy

- `main` — stable vault state; represents the current working vault
- `claude/<description>` — branches created by AI assistants for changes

### Commit Guidelines

- Commit messages should be clear and describe what changed:
  - `Add daily note 2026-05-01`
  - `Update Projects/My Project.md with new milestones`
  - `Refactor Templates/Weekly Review.md`
- Keep commits focused — one logical change per commit
- Do not commit `.obsidian/workspace.json` (it changes on every open) unless intentional

### .gitignore Recommendations

```
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.trash/
.DS_Store
```

---

## AI Assistant Guidelines

When creating or editing notes in this vault:

1. **Always include frontmatter** on new notes (see schema above).
2. **Use wikilinks** for references to other vault notes, not Markdown links.
3. **Preserve existing structure** — place new files in the appropriate directory.
4. **Do not modify `.obsidian/` config files** unless the task explicitly requires it.
5. **Daily notes** go in `Daily Notes/` with filename `YYYY-MM-DD.md`.
6. **Templates** are blueprints — never fill in template files directly; copy them first.
7. **Archive, don't delete** notes that are no longer active (move to `Archive/`).
8. **Keep Markdown clean**: use ATX headings (`#`, `##`), fenced code blocks (` ``` `), and standard list syntax.
9. **Attachments** (images, PDFs) go in `Attachments/` and are referenced with `![[filename]]`.
10. **Dataview queries** (if the Dataview plugin is enabled) use fenced `dataview` code blocks — do not break their syntax.

---

## Common Tasks

### Create a New Note

```bash
# Place in the appropriate subdirectory
touch "Projects/My New Project.md"
```

Minimum content:

```markdown
---
title: My New Project
date: 2026-05-01
tags: [project]
status: active
---

## Overview

```

### Create Today's Daily Note

```bash
DATE=$(date +%Y-%m-%d)
touch "Daily Notes/${DATE}.md"
```

Minimum content:

```markdown
---
title: 2026-05-01
date: 2026-05-01
tags: [daily]
---

## Today's Focus

## Notes

## Tasks

- [ ] 

```

---

## Plugins (When Configured)

If `.obsidian/plugins/` exists, note which community plugins are active, as they may affect note syntax:

| Plugin        | Effect on notes                                      |
|---------------|------------------------------------------------------|
| Dataview      | Enables `dataview` fenced code blocks for queries   |
| Templater     | Enables `<% %>` template syntax in Templates/       |
| Tasks         | Extends task syntax: `- [ ] task 📅 2026-05-01`    |
| Excalidraw    | `.excalidraw.md` files contain embedded drawings    |

---

## Style Preferences

- Heading hierarchy: `#` for title (usually in frontmatter only), `##` for sections, `###` for subsections
- Prefer bullet lists over numbered lists unless order matters
- Code blocks always specify language for syntax highlighting
- Blank line between all block elements (headings, paragraphs, lists, code blocks)
