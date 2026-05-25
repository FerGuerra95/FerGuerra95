# CEO's OS — Backup & Restore Runbook

**Status:** Operational procedure (provisional RPO/RTO — not a contractual SLA).  
**Last updated:** C.14.2 — backup/restore rehearsal + `integrity_check`.

## 1. Scope

This runbook covers **SQLite** persistence for CEO's OS backend (`better-sqlite3`, WAL mode).

| In scope | Out of scope |
|---|---|
| Backup via `better-sqlite3` `.backup()` | Hot file copy of live `.sqlite` + `-wal` without backup API |
| `PRAGMA integrity_check` / `quick_check` | Point-in-time recovery beyond last backup |
| Local restore **drill** on a copy | In-place restore on **live production** from this phase |
| Render disk path documentation | Automated Render cron (configure separately) |

## 2. Production expectations

| Item | Value |
|---|---|
| Runtime | Node.js + Express on Render |
| DB env | `DB_PATH` (required in production) |
| Example prod path | `/var/data/ceos-os.sqlite` (Render persistent disk — verify in dashboard) |
| Journal | `journal_mode = WAL` (see `backend/storage/sqliteStorage.js`) |
| Health | `GET /health`, `GET /api/health` after restore smoke |

**Do not** commit database files, WAL/SHM sidecars, or backup artifacts to git.

## 3. Scripts (repository)

| Script | Purpose |
|---|---|
| `scripts/backup-sqlite.js` | WAL-safe backup + integrity on backup file |
| `scripts/verify-sqlite-integrity.js` | Read-only integrity / quick_check |
| `scripts/restore-sqlite-drill.js` | Copy backup → drill target + verify (not production) |

### Environment variables

| Variable | Purpose |
|---|---|
| `DB_PATH` | Source SQLite file (required in production) |
| `BACKUP_DIR` | Output directory (default: `.local/backups` under repo root) |
| `ALLOW_PRODUCTION_RESTORE_TARGET` | Must stay unset; only blocks accidental prod overwrite in drill script |

## 4. Backup — local / staging

```powershell
# PowerShell (repo root)
$env:DB_PATH = "backend\data\ceo_os.sqlite"   # or absolute path
$env:BACKUP_DIR = ".local\backups"
node scripts/backup-sqlite.js
```

Expected output (no row data):

- `status: ok`
- `backup: <path>`
- `size_bytes: <n>`
- `integrity_check: ok`

## 5. Backup — production (read-only on live DB)

Run from a shell with access to the persistent disk (Render shell / approved ops host):

```bash
export DB_PATH=/var/data/ceos-os.sqlite
export BACKUP_DIR=/var/data/backups
node scripts/backup-sqlite.js
```

Store backups **outside** the git repository. Retain per your retention policy (provisional: 7–30 daily copies until automated policy is approved).

## 6. Verify integrity

```powershell
node scripts/verify-sqlite-integrity.js --db ".local\backups\ceos-os-backup-YYYYMMDD-HHMMSS.sqlite"
# optional faster check:
node scripts/verify-sqlite-integrity.js --db "<backup>" --quick
```

Exit code `0` only when result is `ok`.

## 7. Restore drill (rehearsal only)

**Never** point `--target` at the live production database.

```powershell
node scripts/restore-sqlite-drill.js `
  --backup ".local\backups\ceos-os-backup-YYYYMMDD-HHMMSS.sqlite" `
  --target ".local\restore-drill\ceos-os-restore.sqlite"

node scripts/verify-sqlite-integrity.js --db ".local\restore-drill\ceos-os-restore.sqlite"
```

Optional: start API against drill copy (local only):

```powershell
$env:DB_PATH = ".local\restore-drill\ceos-os-restore.sqlite"
npm start
# smoke: /health, /api/health, login with test org
```

## 8. Real production restore (maintenance window)

1. Announce maintenance; stop traffic (scale to 0 or enable maintenance mode).
2. **Backup current live DB** (`scripts/backup-sqlite.js`) — do not skip.
3. Copy chosen backup file to replace live DB path (or restore to new file and update `DB_PATH` if path changes).
4. Remove stale `-wal` / `-shm` next to old live file if replacing file in place (only after app stopped).
5. `node scripts/verify-sqlite-integrity.js --db $DB_PATH`
6. Restart service; run production smoke (health, login, one read per critical module).
7. Keep pre-restore backup until sign-off.

**Rollback:** Repeat from step 2 using the pre-restore backup taken in step 2.

## 9. RPO / RTO (provisional)

| Metric | Initial target | Notes |
|---|---|---|
| **RPO** | 24 hours | Until scheduled automated backups exist |
| **RTO** | 4 hours | Manual restore + smoke; not SLA-backed |

Review quarterly or before enterprise pilot expansion.

## 10. Security & compliance

- Do not print table contents or credentials from scripts.
- Do not attach backups to tickets, chat, or git.
- Rotate prod test credentials separately (`C14-P1-CREDENTIAL-01`).
- Backups contain full tenant data — treat as confidential.

## 11. Review cadence

| Activity | Frequency |
|---|---|
| Backup + integrity on prod | Weekly until automation |
| Restore drill on copy | Quarterly |
| Runbook review | After schema migration or hosting change |

## 12. Post-restore smoke checklist

- [ ] `/health` and `/api/health` return 200
- [ ] Login with test admin (prod test org)
- [ ] `GET /api/ma/cases` with token → 200
- [ ] CEO `/ceo` loads (no white screen)
- [ ] No unexpected 5xx on Reporting/Governance list endpoints

## 13. Owner

Engineering / Release — update this runbook when `DB_PATH`, host, or backup tooling changes.
