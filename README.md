# ValleyRoadLabs / Widgets

Centralized repository for ThingsBoard custom widgets managed via a deployment control layer.

## Purpose

This repo stores **only** widget assets — no application code, no backend, no UI framework. Widgets flow through a controlled pipeline:

```
Draft → Push for Review → PR Approved → Import to ThingsBoard
```

## Repository Structure

```
widgets/                          # One folder per widget
  ├── <widget_slug>/
  │   ├── manifest.json           # Control layer metadata + status
  │   ├── widget.json             # Full ThingsBoard widget type descriptor
  │   ├── html.html               # Widget HTML template
  │   ├── css.css                 # Widget CSS
  │   ├── javascript.js           # Widget JavaScript
  │   └── settings_schema.json    # Widget settings schema
  └── .../

.widget-control/                  # Process control layer state
  ├── config.json                 # Repo + ThingsBoard config
  ├── pending-prs.json            # Tracked PR state
  ├── import-history.json         # Import audit log
  └── logs/                       # Operational logs (gitignored)
```

## Adding a New Widget

1. Create a folder under `widgets/` using snake_case + version: `my_widget_v1_0/`
2. Add a valid `manifest.json` (see schema below)
3. Add widget files: `widget.json`, `html.html`, `css.css`, `javascript.js`, `settings_schema.json`
4. The control layer will discover it automatically on next scan

## manifest.json Schema

```json
{
  "name": "Widget Display Name",
  "slug": "widget_slug_v1_0",
  "version": "1.0",
  "fqn": "widget_slug_v1_0",
  "description": "What this widget does",
  "author": "",
  "created_at": "2026-04-09T00:00:00Z",
  "updated_at": "2026-04-09T00:00:00Z",
  "thingsboard": {
    "widget_type": "latest",
    "bundle_alias": "",
    "is_system": false
  },
  "control": {
    "status": "draft",
    "last_pushed_at": null,
    "last_pushed_commit": null,
    "pr_number": null,
    "pr_url": null,
    "approved_at": null,
    "imported_at": null,
    "thingsboard_id": null
  }
}
```

### Status Lifecycle

| Status | Meaning |
|--------|---------|
| `draft` | Exists locally, never pushed for review |
| `pushed` | On a branch, PR not yet created (transient) |
| `in_review` | PR is open |
| `changes_requested` | PR has review feedback |
| `approved` | PR approved, ready to import to ThingsBoard |
| `imported` | Successfully pushed to ThingsBoard |

## Contribution Workflow

1. Make changes to widget files in your folder
2. Use the Widget Manager UI to **Push for Review** — creates a branch + PR automatically
3. Reviewers check HTML, CSS, JS, settings schema via the PR
4. Once approved, use **Import to ThingsBoard** to deploy
5. Import is **gated** — only approved widgets can be imported

## Discovery Convention

The control layer finds widgets by:
1. Scanning `widgets/` for subdirectories
2. Reading `manifest.json` in each subdirectory
3. No `manifest.json` → folder is ignored
4. `control.status` determines available actions
