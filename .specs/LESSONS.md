# LESSONS - auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Specify/Design)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation - do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 - Define in the AC the exact expected output for degenerate quantities (zero and one), including any preserved legacy rendering such as the zero-count emoji.
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `spec` · harmful: 0
- features: multi-option-speech
- evidence: spec.md:76 (spec)
- last seen: 2026-10-20T18:34:41Z

### L-002 - Assert side-effect edge cases explicitly (e.g. previous audio paused on rapid re-taps); implementing the behavior in code does not count as coverage.
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `tests` · harmful: 0
- features: multi-option-speech
- evidence: spec.md:105 (tests)
- last seen: 2026-10-20T18:34:41Z

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
