# Multi-Option Speech (Opções de Fala por Letra) Specification

## Problem Statement

Hoje cada letra do Alfabeto Divertido tem exatamente uma palavra fixa com um mp3 gravado ("M de Melissa", "O de ovelha"). A criança quer variedade: cada toque na letra deve poder sortear palavras diferentes — incluindo nomes de pessoas conhecidas (Pedro, Antonela, Aurora, Julio, Joca, Bia, Jeferson, Patrícia). Sem isso, o app fica repetitivo rápido e não ensina novas palavras.

## Goals

- [ ] Cada letra de A a Z tem ao menos 5 opções de palavra/nome, com áudio próprio.
- [ ] Cada toque numa letra sorteia uma opção nova (diferente da anterior) e toca o áudio dela.
- [ ] As combinações número+letra (ex.: "3 P") usam a opção sorteada ("3 PEDROS") com áudio próprio.
- [ ] Suíte de testes automatizados cobre dados, lógica de sorteio, manifesto de áudio e presença dos mp3s.

## Out of Scope

| Item | Motivo |
| ---- | ------ |
| Seletor visual de opções (chips/linhas) | Usuário escolheu sorteio aleatório a cada toque |
| Fallback de TTS do navegador (speechSynthesis) | Usuário escolheu gerar tudo com edge-tts |
| Vozes diferentes por opção | Mantém a voz única pt-BR-FranciscaNeural já usada |
| Persistência da última opção escolhida | Estado é volátil por sessão, como já é hoje |
| Opções alternativas para os números 0–9 | Números continuam com áudio fixo ("Três.", "Cinco.") |
| Alteração do layout/teclado | Teclado continua com 1 tecla por letra/número |

---

## Assumptions & Open Questions

| Assumption / decisão | Chosen default | Rationale | Confirmed? |
| --------------------- | --------------- | --------- | ---------- |
| Como a opção é escolhida a cada toque | Sorteio uniforme entre as opções da letra, excluindo a última opção exibida daquela letra (quando há mais de uma) | Evita repetição imediata sem frustrar a criança com o mesmo resultado duas vezes seguidas | n (padrão do agente; alternativa "ciclo fixo" e "seletor visual" foram recusadas) |
| Primeira opção de cada letra | É a palavra atual da letra (ex.: M → MELISSA), preservando os mp3s existentes | Mantém o comportamento conhecido e evita regenerar 297 arquivos | n (padrão do agente) |
| Nomeação dos arquivos de áudio novos | Opção 0 herda os nomes atuais (`m.mp3`, `5_m.mp3`); opções n>0 usam sufixo (`m_1.mp3`, `5_m_1.mp3`) | Compatibilidade total com os arquivos já versionados | n (padrão do agente) |
| Acentuação dos nomes exibidos | Grafia correta: JÚLIO e PATRÍCIA (as demais não têm acento) | App infantil de alfabeto deve ensinar ortografia correta | n (padrão do agente) |
| Plural dos nomes | Nome + S (PEDROS, ANTONELAS, BIAS, JOCAS, JEFERSONS…), exceto ULISSES que permanece invariante | Regra simples e previsível para a faixa etária | n (padrão do agente) |
| Gênero gramatical para os áudios de contagem | Cada opção carrega campo `gender` (M/F) usado em "Um/Uma", "Duas" | Necessário para o edge-tts falar "Um Pedro" vs "Uma Antonela" | n (padrão do agente) |
| O que o teclado mostra | A tecla mantém o emoji da primeira opção da letra (ex.: M sempre 👧) | Evita mudança visual no teclado; o palco já mostra o emoji da opção sorteada | n (padrão do agente) |
| Nomes extras além dos obrigatórios | WESLEY (W), YASMIN e YARA (Y) entram como opções extras para completar 5 | Requisito é "pelo menos 5 de cada" + os 8 nomes obrigatórios; extras são permitidos | n (padrão do agente) |
| Regeneração dos mp3s da opção 0 | Nunca regenerados; geração cobre apenas arquivos ausentes (`--force` regenera tudo) | Preserva bytes já versionados e deixa a execução idempotente | n (padrão do agente) |

**Open questions:** none - all resolved or logged above (required before the spec is confirmed).

---

## User Stories

### P1: Sorteio de opções por letra ⭐ MVP

**User Story**: As uma criança, I want tocar numa letra e ouvir palavras e nomes diferentes a cada toque so that aprendo mais palavras brincando.

**Why P1**: É o coração da feature — sem variedade o app continua fixo como hoje.

**Acceptance Criteria** (each line is one EARS pattern):

1. WHEN uma tecla de letra é acionada THEN o sistema SHALL exibir no palco uma opção sorteada entre as opções cadastradas daquela letra.  <!-- event-driven -->
2. WHEN uma opção é exibida THEN o sistema SHALL reproduzir o arquivo de áudio correspondente àquela opção (ex.: letra M → `audio/m_1.mp3`).  <!-- event-driven -->
3. WHEN uma tecla de letra é acionada novamente THEN o sistema SHALL sortear uma opção diferente da última opção exibida daquela letra.  <!-- event-driven -->
4. The system SHALL cadastrar ao menos 5 opções para cada letra de A a Z, cada uma com palavra, plural, emoji e gênero.  <!-- ubiquitous -->
5. The system SHALL incluir os nomes Pedro, Antonela, Aurora, Bia, Julio, Joca, Jeferson e Patrícia entre as opções das letras P, A, B e J respectivamente.  <!-- ubiquitous -->
6. The system SHALL usar os arquivos de áudio já existentes para a primeira opção de cada letra, sem regenerá-los.  <!-- ubiquitous -->
7. IF a reprodução de um áudio falhar THEN o sistema SHALL manter a interface responsiva sem exibir erro ao usuário.  <!-- unwanted-behavior -->
8. WHEN uma tecla de número é acionada sem uma letra anterior THEN o sistema SHALL exibir e falar o número como hoje, sem sortear opções.  <!-- event-driven -->

**Independent Test**: Abrir o app, tocar em P três vezes seguidas e ver/ouvir opções diferentes (ex.: PEIXE, PEDRO, PATRÍCIA) sem repetir a mesma duas vezes seguidas.

---

### P2: Combinações número + letra com a opção sorteada

**User Story**: As uma criança, I wantapertar uma letra e depois um número e ver a contagem da palavra sorteada so that aprendo a contar com palavras novas.

**Why P2**: Hoje "3 M" mostra "3 MELISSAS"; com opções aleatórias a combinação precisa acompanhar a opção exibida, senão o app fica inconsistente.

**Acceptance Criteria**:

1. WHEN um número é acionado após uma letra THEN o sistema SHALL exibir a contagem usando o singular da opção exibida daquela letra para 1 e o plural para 0 e 2 ou mais, acompanhada dos emojis daquela opção repetidos conforme a quantidade.  <!-- event-driven -->
2. WHEN a combinação número+letra é exibida THEN o sistema SHALL reproduzir o áudio da combinação da opção correspondente (ex.: opção PEDRO, índice 1, da letra P com 3 → `audio/3_p_1.mp3`).  <!-- event-driven -->
3. The system SHALL gerar o plural de cada opção explicitamente no cadastro de dados (incluindo plurais irregulares como LEÕES e SÓIS).  <!-- ubiquitous -->

**Independent Test**: Tocar em P (sortear PEDRO) e depois 3 → palco mostra "3 PEDROS" com 3 emojis de menino e áudio "Três Pedros."

---

### P3: Geração dos mp3s de todas as opções

**User Story**: As o mantenedor do app, I want um script que gere todos os mp3s das opções e combinações so that o app funciona offline com a mesma qualidade de voz de hoje.

**Why P3**: Sem os arquivos novos o sorteio falharia silenciosamente (AC P1-7) e a feature não teria som.

**Acceptance Criteria**:

1. WHEN `generate_audio.py` é executado THEN o sistema SHALL gerar mp3 para cada opção de cada letra e para cada combinação de 0 a 9, reutilizando os arquivos já existentes.  <!-- event-driven -->
2. IF a síntese de um arquivo falhar THEN o script SHALL continuar gerando os demais arquivos e reportar a lista de falhas ao final com código de saída diferente de zero.  <!-- unwanted-behavior -->
3. The system SHALL produzir o mesmo manifesto de arquivos entre execuções (duas execuções de `--list-files` retornam listas idênticas).  <!-- ubiquitous -->
4. The system SHALL manter a voz `pt-BR-FranciscaNeural` e o ritmo `-25%` já usados nos áudios atuais.  <!-- ubiquitous -->

**Independent Test**: Rodar `python3 generate_audio.py --list-files | wc -l` duas vezes e comparar; depois rodar o script e conferir que todos os arquivos do manifesto existem em `audio/`.

---

## Edge Cases

- IF o app estiver aberto durante a regeneração e um mp3 novo ainda não existir THEN o sistema SHALL falhar silenciosamente naquele toque (AC P1-7), sem quebrar as demais teclas.
- WHEN a letra tem somente uma opção THEN o sistema SHALL sempre exibir essa única opção (regra de exclusão do sorteio não se aplica).
- IF a criança toca várias vezes rápido na mesma tecla THEN o sistema SHALL parar o áudio anterior e tocar o novo sorteio (comportamento "a cada toque").
- WHEN a geração roda com todos os arquivos já presentes THEN o script SHALL concluir sem reescrever nada (idempotente, AC P3-3).

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| SPEECH-01 | P1: Sorteio de opções por letra | - | ✅ Verified |
| SPEECH-02 | P1: Sorteio de opções por letra | - | ✅ Verified |
| SPEECH-03 | P1: Sorteio de opções por letra | - | ✅ Verified |
| SPEECH-04 | P1: Sorteio de opções por letra | - | ✅ Verified |
| SPEECH-05 | P1: Sorteio de opções por letra | - | ✅ Verified |
| SPEECH-06 | P1: Sorteio de opções por letra | - | ✅ Verified |
| SPEECH-07 | P1: Sorteio de opções por letra | - | ✅ Verified |
| SPEECH-08 | P1: Sorteio de opções por letra | - | ✅ Verified |
| SPEECH-09 | P2: Combinações número + letra | - | ✅ Verified |
| SPEECH-10 | P2: Combinações número + letra | - | ✅ Verified |
| SPEECH-11 | P2: Combinações número + letra | - | ✅ Verified |
| SPEECH-12 | P3: Geração dos mp3s | - | ✅ Verified |
| SPEECH-13 | P3: Geração dos mp3s | - | ✅ Verified |
| SPEECH-14 | P3: Geração dos mp3s | - | ✅ Verified |
| SPEECH-15 | P3: Geração dos mp3s | - | ✅ Verified |

**Coverage:** 15 total, 15 mapped to tasks (tasks.md), 0 unmapped.

---

## Success Criteria

- [ ] Suíte verde: `node --test tests/` (dados, sorteio, nomes de arquivo, texto de combinação, manifesto, presença de mp3s) e `python3 -m unittest` (gerador).
- [ ] Os 8 nomes obrigatórios aparecem como opções e todas as 26 letras têm ≥ 5 opções.
- [ ] Todos os 1.441 arquivos do manifesto existem em `audio/` (298 atuais + ~1.143 novos).
- [ ] Demo manual: tocar em P sorteia PEIXE/PEDRO/PATRÍCIA/PANDA/PIPA com áudio, e "P" + "3" mostra "3 PEDROS" (ou a opção sorteada) com áudio correspondente.
