# Multi-Option Speech Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: inline (feature straightforward — no design.md)
**Status**: In Progress

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: none (repo sem AGENTS.md, CONTRIBUTING.md, configs de teste ou CI - strong defaults applied).

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Dados e lógica pura (`data.js`) | unit | 1:1 com SPEECH-01..06, 09..11, 14: ≥5 opções/letra, nomes obrigatórios, regressão da opção 0, sorteio sem repetição, nome de arquivo, texto de plural | `tests/data.test.mjs` | `node --test tests/data.test.mjs` |
| UI glue (`app.js`) | unit (headless DOM stub) | 1:1 com SPEECH-01,02,07,08,09: toque sorteia opção no palco, toque repetido muda a opção, combinação usa opção exibida, áudio tocado = arquivo da opção, números sozinhos inalterados | `tests/app.test.mjs` | `node --test tests/app.test.mjs` |
| Gerador de áudio (`generate_audio.py`) | unit (`unittest`, stdlib) | 1:1 com SPEECH-12..15: parse de data.js, manifesto determinístico, idempotência (só ausentes), falha parcial reportada com exit != 0, voz/ritmo fixos | `tests/test_generator.py` | `python3 -m unittest discover -s tests -p 'test_*.py'` |
| Áudios gerados (`audio/`) | unit (fs check) | Manifesto completo presente no disco (SPEECH-12, SPEECH-14) | `tests/audio.test.mjs` | `node --test tests/audio.test.mjs` |

## Gate Check Commands

> Generated from codebase - confirm before Execute.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Após tarefas com testes unitários | `node --test tests/*.test.mjs && python3 -m unittest discover -s tests -p 'test_*.py'` |
| Full | Após T4 (toda a suíte, inclui cobertura de mp3s) | mesmo do Quick (não há infra e2e no repo) |
| Build | Fechamento de feature | Quick + `python3 <skill-dir>/scripts/validate_spec.py multi-option-speech --root .` |

---

## Execution Plan

Phases are ordered and run sequentially - each phase completes before the next begins, and tasks within a phase execute in order.

### Phase 1: Dados e app

Fonte única de dados + UI de sorteio.

- T1 (data.js + testes de dados) → T2 (app.js + testes de UI headless)

### Phase 2: Áudio

Geração dos mp3s de todas as opções.

- T3 (gerador + testes python) → T4 (execução da geração + teste de cobertura)

---

## Task Breakdown

### T1: Criar data.js com modelo de opções e helpers puras

**What**: Novo `data.js` com NUMBERS (como o alphabet atual de dígitos), LETTERS (26 letras × ≥5 opções com word/plural/emoji/gender, opção 0 = palavra atual) e helpers puras: `pickOptionIndex`, `getLetterAudioFile`, `getComboAudioFile`, `getComboDisplayText`; expostas em `globalThis` para browser e `module.exports` para Node; `index.html` carrega `data.js` antes de `app.js`.
**Where**: `data.js`
**Depends on**: None
**Reuses**: palavras/cores/emojis/plurais atuais de `app.js` (copiados como opção 0); nomes obrigatórios: ANTONELA, AURORA (A), BIA (B), JÚLIO, JOCA, JEFERSON (J), PEDRO, PATRÍCIA (P)
**Requirement**: SPEECH-01, SPEECH-03, SPEECH-04, SPEECH-05, SPEECH-06, SPEECH-09, SPEECH-11, SPEECH-14

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `data.js` expõe LETTERS (26 letras, ≥5 opções cada) e NUMBERS (10 dígitos)
- [x] Opção 0 de cada letra é idêntica à palavra/plural/emoji/cor atuais (regressão)
- [x] Os 8 nomes obrigatórios estão nas letras corretas (JÚLIO/PATRÍCIA acentuados)
- [x] Helpers puras testáveis com rng injetado
- [x] `index.html` inclui `<script src="data.js">` antes de `app.js`
- [x] Gate check passes: `node --test tests/data.test.mjs` (13/13)
- [x] Test count: 13 testes passam (sem remoção silenciosa)

**Tests**: unit
**Gate**: quick

**Commit**: `feat: add multi-option letter data model with pure helpers`

---

### T2: Sortear opção a cada toque no app.js

**What**: `app.js` passa a consumir `data.js`: teclado montado de NUMBERS+LETTERS, cada toque de letra sorteia opção diferente da última exibida (`pickOptionIndex`), palco mostra word/emoji da opção, combinação número+letra usa a opção exibida (texto plural/singular + emojis repetidos + áudio `num_letra_idx`), áudio anterior é interrompido no novo toque; testes headless com stub de DOM.
**Where**: `app.js`
**Depends on**: T1
**Reuses**: fluxo atual de `selectLetter`, `speakLetter`, `showWarning`, partículas, sons (mantidos); remove o guard `currentlySpeakingLetter === letra` que bloqueava re-toque
**Requirement**: SPEECH-01, SPEECH-02, SPEECH-07, SPEECH-08, SPEECH-09, SPEECH-10

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Teclado renderiza 10 números + 26 letras com emoji da opção 0
- [x] Toque na letra mostra opção sorteada e toca o mp3 correspondente (`audio/m.mp3`, `audio/m_1.mp3`…)
- [x] Toque repetido na mesma letra nunca repete a opção imediatamente anterior
- [x] Letra + número exibe "N PALAVRA(S)" da opção exibida e toca `audio/{n}_{letra}_{idx}.mp3`
- [x] Números sozinhos e warning continuam idênticos ao comportamento atual
- [x] Falha de áudio não quebra a interface (`.catch` mantido)
- [x] Gate check passes: `node --test tests/app.test.mjs` (10/10)
- [x] Test count: 10 testes passam (sem remoção silenciosa)

**Tests**: unit
**Gate**: quick

**Commit**: `feat: randomize letter speech option on every tap`

---

### T3: Reescrever generate_audio.py por opção

**What**: `generate_audio.py` lê `data.js` (parse do JSON embutido), gera mp3 de cada opção de letra ("X de Y.") e de cada combinação 0-9 ("Três Pedros."), com `--list-files` (manifesto), `--force`, idempotência (pula existentes), voz `pt-BR-FranciscaNeural` rate `-25%`, coleta falhas e reporta no final com exit != 0; testes `unittest` com injeção de save_fn.
**Where**: `generate_audio.py`
**Depends on**: T1
**Reuses**: estrutura `save_audio`/semáforo/asyncio atual; convenção de nomes das helpers de `data.js` (idx 0 = nome legado)
**Requirement**: SPEECH-12, SPEECH-13, SPEECH-14, SPEECH-15

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `python3 generate_audio.py --list-files` imprime o manifesto JSON determinístico (2 execuções idênticas)
- [x] Geração pula arquivos já existentes; `--force` regenera tudo
- [x] Falha em 1 arquivo não interrompe os demais e é reportada com exit code != 0
- [x] Voz e ritmo inalterados
- [x] Gate check passes: `python3 -m unittest discover -s tests -p 'test_*.py'` (9/9)
- [x] Test count: 9 testes python passam (sem remoção silenciosa)

**Tests**: unit
**Gate**: quick

**Commit**: `feat: rewrite audio generator for per-option manifest`

---

### T4: Gerar os mp3s de todas as opções

**What**: Executar `python3 generate_audio.py` para criar os ~1.143 mp3s novos (letras × opções 1-4 + combinações 0-9 × opções 1-4) e adicionar `tests/audio.test.mjs` validando que o manifesto inteiro existe em `audio/`.
**Where**: `audio/`
**Depends on**: T3
**Reuses**: manifesto de `generate_audio.py --list-files`
**Requirement**: SPEECH-12, SPEECH-14

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] Script conclui sem falhas reportadas (exit 0) — 1.143 criados, 297 legados pulados
- [x] `tests/audio.test.mjs` confere que os 1.441 arquivos do manifesto existem em `audio/`
- [x] Gate check passes: `node --test tests/*.test.mjs && python3 -m unittest discover -s tests -p 'test_*.py'` (glob explícito: `node --test tests/` não resolve os `.mjs` no Node 22)
- [x] Test count: suíte completa verde (25 Node + 9 Python = 34 testes)

**Tests**: unit
**Gate**: full

**Commit**: `feat: generate missing audio for all letter options`

---

## Phase Execution Map

Visual representation of task ordering. Phases run in sequence, and tasks within a phase run in order:

```
T1 → T2
T1 → T3 → T4
```

Execution is strictly sequential - there is no intra-phase parallelism. A single agent (or batch worker) works one task at a time, in order.

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1: Criar data.js | 1 arquivo novo + wiring mínimo | ✅ Granular |
| T2: Sorteio no app.js | 1 arquivo (modify) + testes | ✅ Granular |
| T3: Reescrever generate_audio.py | 1 arquivo (rewrite) + testes | ✅ Granular |
| T4: Gerar mp3s | 1 diretório de artefatos + 1 teste | ✅ Granular |

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | None | — | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T1 | T1 → T3 | ✅ Match |
| T4 | T3 | T3 → T4 | ✅ Match |

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1: data.js | Dados e lógica pura | unit | unit | ✅ OK |
| T2: app.js | UI glue (headless DOM stub) | unit | unit | ✅ OK |
| T3: generate_audio.py | Gerador de áudio | unit | unit | ✅ OK |
| T4: audio/ + teste de cobertura | Áudios gerados (fs check) | unit | unit | ✅ OK |
