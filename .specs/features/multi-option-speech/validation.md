# Multi-Option Speech Validation

**Date**: 2026-10-20
**Spec**: `.specs/features/multi-option-speech/spec.md`
**Diff range**: `d2d3501~1..a2ffeb7` (commits `d2d3501`, `56623dc`, `7abc1e0`, `922a9f5`, `7d63ab4`, `a2ffeb7`)
**Verifier**: independent sub-agent (author ≠ verifier)
**Verdict**: **PASS**

---

## Task Completion

| Task | Status | Notes |
| ---- | ------ | ------- |
| T1: data.js + testes de dados | ✅ Done | 13/13 testes; `index.html:61` carrega `data.js` antes de `app.js:62` |
| T2: sorteio no app.js | ✅ Done | 10/10 testes headless |
| T3: generate_audio.py | ✅ Done | 9/9 testes unittest |
| T4: mp3s + teste de manifesto | ✅ Done | 1.441 arquivos do manifesto existem em `audio/` |

Todos os checkboxes de `tasks.md` marcados; nenhum bloqueio ou trabalho parcial.

---

## Spec-Anchored Acceptance Criteria

### P1: Sorteio de opções por letra

| Criterion (WHEN X THEN Y) | Spec-defined outcome | `file:line` + assertion | Result |
| ------------------------- | -------------------- | ----------------------- | ------ |
| WHEN tecla de letra acionada THEN exibir no palco opção sorteada entre as cadastradas (SPEECH-01) | palco mostra `word` pertencente a `LETTERS[L].options` | `tests/app.test.mjs:131` - `assert.ok(words.includes(app.stage.word()))` (letra M, + letter/color em `:132-133`) | ✅ PASS |
| WHEN opção exibida THEN reproduzir o áudio daquela opção (ex. M → `audio/m_1.mp3`) (SPEECH-02) | último `Audio` criado = `getLetterAudioFile(letter, idxExibido)`; idx0 = legado, idx>0 = sufixo `_N` | `tests/app.test.mjs:141` - `assert.equal(app.lastAudio(), data.getLetterAudioFile('P', idx))`; naming em `tests/data.test.mjs:157-162` - `assert.equal(getLetterAudioFile('M', 1), 'audio/m_1.mp3')` etc. | ✅ PASS |
| WHEN tecla reacionada THEN sortear opção diferente da última exibida (SPEECH-03) | `idx ≠ prev` para todo rng e todo prev válido | `tests/data.test.mjs:129` - `assert.notEqual(idx, prev)` (sweep de 9 rng × todos os prev × 26 letras); `tests/app.test.mjs:150` - `assert.notEqual(word, previous)` em 15 toques | ✅ PASS |
| SHALL ≥5 opções por letra A–Z com palavra, plural, emoji e gênero (SPEECH-04) | 26 letras exatas; `options.length ≥ 5`; campos não-vazios; gender ∈ {M,F} | `tests/data.test.mjs:69` - `assert.equal(Object.keys(LETTERS).sort().join(''), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')`; `tests/data.test.mjs:74` - `assert.ok(data.options.length >= 5)`; `tests/data.test.mjs:109-112` (word/plural/emoji/gender) | ✅ PASS |
| SHALL incluir Pedro, Antonela, Aurora, Bia, Julio, Joca, Jeferson, Patrícia em P/A/B/J (SPEECH-05) | nomes nas letras certas; grafia JÚLIO/PATRÍCIA conforme decisão `spec.md:34` | `tests/data.test.mjs:82` - `assert.ok(words.includes(name))` para MANDATORY_NAMES (`tests/data.test.mjs:59-64`: ANTONELA, AURORA, BIA, JÚLIO, JOCA, JEFERSON, PEDRO, PATRÍCIA) | ✅ PASS |
| SHALL usar os áudios existentes da opção 0 sem regenerá-los (SPEECH-06) | opção 0 = palavra legada + nome legado do mp3; gerador pula existentes | `tests/data.test.mjs:90` - `assert.equal(option0.word, legacy.word)`; `tests/data.test.mjs:157` - `assert.equal(getLetterAudioFile('M', 0), 'audio/m.mp3')`; `tests/test_generator.py:91` - `assertNotIn('m.mp3', self.saved)` | ✅ PASS |
| IF reprodução falhar THEN interface responsiva sem erro visível (SPEECH-07) | palco/atualização continuam com `play()` rejeitando | `tests/app.test.mjs:219` - `assert.ok(words.includes(app.stage.word()))` e `tests/app.test.mjs:221` - `assert.match(app.stage.word(), /^2 /)` com `audioPlayRejects: true` (erro engolido por `.catch` em `app.js:126`) | ✅ PASS (ver nota) |
| WHEN número acionado sem letra anterior THEN exibir/falar número como hoje, sem sortear (SPEECH-08) | palco = palavra do número, áudio legado `audio/N.mp3` | `tests/app.test.mjs:188-190` - `assert.equal(app.stage.word(), 'SETE')` / `lastAudio() === 'audio/7.mp3'`; reset pós-combo em `tests/app.test.mjs:198-199` | ✅ PASS |

### P2: Combinações número + letra

| Criterion (WHEN X THEN Y) | Spec-defined outcome | `file:line` + assertion | Result |
| ------------------------- | -------------------- | ----------------------- | ------ |
| WHEN número após letra THEN contagem com singular p/ 1, plural p/ 0 e 2+, emojis da opção repetidos (SPEECH-09) | `1 WORD` / `N PLURALS`; emoji = opção × quantidade | `tests/data.test.mjs:168-171` - `assert.equal(getComboDisplayText(1, 'P', i), '1 PEDRO')` / `(0…,'0 PEDROS')` / `(2…,'2 PEDROS')`; `tests/app.test.mjs:161-162` - `stage.word() === '3 ${plural}'` e emoji `Array(3).fill(option.emoji)` | ✅ PASS (ver nota ⚠️ qtd 0) |
| WHEN combo exibida THEN tocar áudio da opção correspondente (ex. `audio/3_p_1.mp3`) (SPEECH-10) | áudio = `getComboAudioFile(3, 'P', idxPedro)` | `tests/app.test.mjs:163` - `assert.equal(app.lastAudio(), data.getComboAudioFile(3, 'P', idx))`; `tests/data.test.mjs:161` - `assert.equal(getComboAudioFile(3, 'P', 2), 'audio/3_p_2.mp3')`; texto em `tests/test_generator.py:47` - `assertEqual(entries['3_p_1.mp3'], 'Três Pedros.')` | ✅ PASS |
| SHALL plural explícito no cadastro, incl. irregulares LEÕES e SÓIS (SPEECH-11) | plurais literais no dado e no texto | `tests/data.test.mjs:173-174` - `assert.equal(getComboDisplayText(2, 'L', 0), '2 LEÕES')` e `('3','S',0) === '3 SÓIS'`; campos em `tests/data.test.mjs:110` | ✅ PASS |

### P3: Geração dos mp3s

| Criterion (WHEN X THEN Y) | Spec-defined outcome | `file:line` + assertion | Result |
| ------------------------- | -------------------- | ----------------------- | ------ |
| WHEN `generate_audio.py` executado THEN mp3 por opção × letra e por combo 0–9, reutilizando existentes (SPEECH-12) | manifesto = 10 números + warning + 26×5×(1+10) = 1.441 arquivos, todos presentes | `tests/test_generator.py:32` - `assertEqual(len(names), 1441)`; `tests/audio.test.mjs:29` - `assert.deepEqual(generated, expectedManifest())`; presença em `tests/audio.test.mjs:34` - `assert.deepEqual(missing, [])`; skip em `tests/test_generator.py:88-91` | ✅ PASS |
| IF síntese falhar THEN continuar e reportar com exit ≠ 0 (SPEECH-13) | falha isolada listada; demais gerados; `exit_code == 1` | `tests/test_generator.py:105` - `assertEqual([f['filename'] …], ['3_m_2.mp3'])`; `:107` `assertEqual(created, len(entries)-1)`; `:108` - `assertEqual(exit_code(result), 1)` | ✅ PASS |
| SHALL manifesto idêntico entre execuções (`--list-files` ×2) (SPEECH-14) | duas listas idênticas | `tests/test_generator.py:51-52` - `assertEqual(build_entries(), build_entries())` + `tests/test_generator.py:61` - CLI == `build_entries()` (CLI é função pura do manifesto ⇒ 2 execuções idênticas); verificação manual deste verificador: 2 execuções `--list-files` → 1441 entradas, `identical: True` | ✅ PASS |
| SHALL manter voz `pt-BR-FranciscaNeural` e rate `-25%` (SPEECH-15) | constantes exatas | `tests/test_generator.py:116-117` - `assertEqual(VOICE, 'pt-BR-FranciscaNeural')` / `assertEqual(RATE, '-25%')` | ✅ PASS |

**Status**: ✅ 15/15 ACs cobertos com evidência `file:line` apontando o outcome da spec — ⚠️ 2 notas de precisão da spec sinalizadas abaixo (não bloqueiam).

**Notas de precisão da spec (⚠️, sinalizadas — não silenciadas):**

1. **SPEECH-09, quantidade 0**: o AC define "emojis daquela opção repetidos conforme a quantidade", mas não define o que mostrar quando a quantidade é 0; a implementação preserva o legado 💨 (`app.js:242-243`, assertado em `tests/app.test.mjs:182`). Spec-precision gap — recomenda-se amendment no spec, não mudança de código.
2. **SPEECH-07, "sem exibir erro ao usuário"**: o teste asserta a responsividade (`tests/app.test.mjs:219,221`); a ausência de erro visível é implícita (não há superfície de erro no app; `.catch` em `app.js:126` engole a falha). Cobertura aceitável, mas a asserção "nenhum elemento de erro apareceu" não existe.
3. **SPEECH-05 grafia**: o AC escreve "Julio" sem acento, mas a tabela de decisões (`spec.md:34`) fixa JÚLIO/PATRÍCIA; o teste segue a forma decidida (`tests/data.test.mjs:62,64`). Consistente com a spec resolvida — sem ação.

---

## Discrimination Sensor

Scratch: git worktree temporário (`git worktree add --detach <tmp> HEAD`), nunca a árvore real; baseline `git status --porcelain` = vazio antes e idêntico depois (`ISOLATION-OK`), HEAD inalterado em `a2ffeb7`. `git stash` não utilizado.

| # | Mutation | File:line (mutado no scratch) | Suite rodada | Killed? |
| - | -------- | ----------------------------- | ------------ | ------- |
| a | `pickOptionIndex` sempre retorna a mesma opção (`count <= 1 \|\| count > 0` → `return 0`) | `data.js:291` | `node --test tests/data.test.mjs tests/app.test.mjs` → 3 falhas (`tests/app.test.mjs:144`, `tests/data.test.mjs:124`, `tests/data.test.mjs:136`) | ✅ Killed |
| b | Regra "não repetir a última" trocada por retorno direto do último índice (`return previousIndex`) | `data.js:299-303` | mesma suite → 2 falhas (`tests/app.test.mjs:144`, `tests/data.test.mjs:129`) | ✅ Killed |
| c | Singular/plural quebrado no gerador: `count == 1` sempre plural (`Dois Pedros.` em vez de `Um Pedro.`) | `generate_audio.py:64-66` | `python3 -m unittest discover -s tests -p 'test_*.py'` → 1 falha: `tests/test_generator.py:43` `AssertionError: 'Dois Pedros.' != 'Um Pedro.'` | ✅ Killed |
| d | Naming de sufixo de opção `_1` → `_01` (`padStart(2,'0')` em letter e combo) | `data.js:310,315` | `node --test tests/*.test.mjs` → 3 falhas (`tests/audio.test.mjs:26`, `tests/audio.test.mjs:32`, `tests/data.test.mjs:156`) | ✅ Killed |
| e | Combinação número+letra usa sempre a opção 0 em vez da exibida | `app.js:240-250` (3× `combo.optionIndex` → `0`) | `node --test tests/app.test.mjs` → 3 falhas no 1º run (`tests/app.test.mjs:155`, `:167`, `:176`) | ✅ Killed |

**Sensor depth**: 5 mutações manuais (≥5 — profundidade propositalmente acima do lightweight, cobrindo sorteio, cadastro, naming, texto e glue de UI)
**Result**: 5/5 killed, 0 survived - **PASS**

---

## Interactive UAT Results

Não realizado — sem usuário no loop desta sessão do Verifier; a feature é de UI mas toda a superfície comportamental coberta pelos ACs é verificável por testes headless (executados). UAT interativo pode ser agendado pelo orquestrador como etapa separada (spec "Independent Test": tocar P três vezes).

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| No features além do pedido | ✅ (diff `d2d3501~1..a2ffeb7` contém só data.js, app.js, generate_audio.py, index.html +1 script tag, 4 arquivos de teste, `audio/`) |
| No abstrações para código de uso único | ✅ (helpers puras são exigidas pelo T1 e usadas por app.js, gerador e testes) |
| No "flexibility" desnecessária | ✅ |
| Só arquivos necessários | ✅ (não houve toque em arquivos não listados no escopo) |
| Não "melhorou" código não relacionado | ✅ |
| Padrões/estilo existentes preservados | ✅ (estrutura `save_audio`/asyncio do gerador mantida; estilo do app idêntico) |
| Testes mapeados a ACs e não-rasos | ✅ (spot-check SPEECH-03: sweep determinístico com rng injetado + teste de integração de 15 toques) |
| Spec-anchored outcome check | ✅ (tabela acima; 2 ⚠️ de precisão sinalizados) |
| Cobertura por camada conforme matriz | ✅ (dados 1:1 ACs; UI happy+edge+error; gerador 1:1 SPEECH-12..15; fs check) |
| Todo teste tem dono (sem testes órfãos) | ✅ (13 data → SPEECH-01..06,09..11,14 + edge cases; 10 app → SPEECH-01,02,03,07,08,09,10 + warning done-when; 2 audio → SPEECH-12/14; 9 python → SPEECH-12..15) |
| Guidelines documentadas seguidas | ✅ "none - strong defaults applied" (repo sem AGENTS.md/CONTRIBUTING/CI — declarado em `tasks.md:18`) |

---

## Edge Cases

- [x] Mp3 novo ausente durante sessão → falha silenciosa, demais teclas ok (SPEECH-07): `tests/app.test.mjs:215-222`
- [x] Letra com uma única opção → sempre essa opção (exclusão não se aplica): `tests/data.test.mjs:146-154`
- [ ] **Toques rápidos repetidos → parar áudio anterior e tocar o novo**: implementado em `app.js:117-118` (`playSpeech` chama `stopCurrentSpeech()` → `pause()`), **mas nenhum teste asserta a interrupção** (o stub `pause() {}` de `tests/app.test.mjs:90` nunca é verificado) — gap de cobertura ranqueado como Fix 1
- [x] Geração com todos os arquivos presentes é idempotente (só pula): `tests/test_generator.py:82-91`

---

## Gate Check

- **Gate command**: `node --test tests/*.test.mjs && python3 -m unittest discover -s tests -p 'test_*.py'` (Quick/Full de `tasks.md:33`)
- **Result**: 34 passed, 0 failed, 0 skipped (25 Node `# pass 25 # fail 0` + 9 Python `Ran 9 tests … OK`)
- **Manifesto**: `python3 generate_audio.py --list-files` → 1441 entradas; duas execuções idênticas (`identical: True`)
- **Test count before feature**: 0 (não havia diretório `tests/` em `d2d3501~1`)
- **Test count after feature**: 34 (13 data + 10 app + 2 audio + 9 python)
- **Delta**: +34 novos testes
- **Skipped tests**: nenhum
- **Failures**: nenhum

**Test Integrity**: nenhum teste pré-existente foi removido ou enfraquecido (o diretório `tests/` é 100% novo nesta feature).

---

## Fix Plans (gaps sinalizados — para roteamento pelo orquestrador)

### Fix 1: Edge case "toques rápidos interrompem o áudio anterior" sem asserção

- **Root cause**: a interrupção é efeito colateral dentro de `playSpeech` (`app.js:117-118`) e o stub de `Audio` em `tests/app.test.mjs` expõe `pause()` sem que nenhum teste conte chamadas.
- **Fix task**: em `tests/app.test.mjs`, registrar instâncias de `Audio` pausadas e assertar que ao tocar a mesma letra 2× seguidas a 1ª foi `pause()`-ada e a 2ª é a nova instância (`assert` sobre chamadas do stub).
- **Verify**: `node --test tests/app.test.mjs` verde + mutação "remover `stopCurrentSpeech()` de `playSpeech`" passa a matar o teste.
- **Priority**: Minor (comportamento correto em produção; risco é regressão silenciosa futura)

### Fix 2 (spec, não código): definir emoji da contagem 0 no AC SPEECH-09

- **Root cause**: `spec.md:76` não define o resultado para quantidade 0; a implementação preserva o legado 💨 (`app.js:242-243`).
- **Fix task**: amendment no spec: "WHEN a contagem é 0 THEN exibir 💨 (legado) e o plural da opção".
- **Priority**: Cosmetic (clareza da spec; comportamento atual é o legado preservado)

---

## Requirement Traceability Update

`spec.md` atualizado de `Implementing` → `✅ Verified` para as 15 requirements (SPEECH-01..15) — todos os ACs com evidência `file:line` e sensor limpo.

| Requirement | Previous Status | New Status |
| ----------- | --------------- | ---------- |
| SPEECH-01..15 (15 linhas) | Implementing | ✅ Verified |

---

## Summary

**Overall**: ✅ Ready

**Spec-anchored check**: 15/15 ACs com asserção casando o outcome da spec; 2 spec-precision gaps sinalizados (não bloqueantes)
**Sensor**: 5/5 mutações mortas (0 sobreviventes)
**Gate**: 34 passed, 0 failed (25 Node + 9 Python), manifesto 1441 idêntico entre execuções
**Dados**: 8/8 nomes obrigatórios nas letras certas (JÚLIO/PATRÍCIA acentuados); 26 letras, mínimo de 5 opções (A=5)

**What works**: sorteio sem repetição imediata (unit + integração), áudio da opção exibida em letra e combo, singular/plural e emojis da opção, legado da opção 0 preservado (naming + bytes), números sozinhos inalterados, gerador determinístico/idempotente/falha-parcial-com-exit-1, 1.441 mp3s no disco.

**Issues found**: 1 gap de cobertura (edge case de interrupção de áudio sem asserção — Fix 1, Minor) e 2 notas de precisão da spec (emoji da contagem 0; "sem exibir erro" implícito). Nenhum mutante sobrevivente, nenhum AC sem evidência, nenhum desvio de spec.

**Next steps**: orquestrador roteia Fix 1 (e opcionalmente Fix 2); re-verificação rápida do único teste novo; UAT interativo opcional ("Independent Test" do spec).
