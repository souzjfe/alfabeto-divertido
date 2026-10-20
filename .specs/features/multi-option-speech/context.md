# Contexto — decisões do usuário (discuss)

Perguntas feitas ao usuário antes da spec; respostas registradas tal como dadas.

## P1 — Como a criança escolhe entre as opções de cada letra?

| Opção oferecida | Escolhida |
| --------------- | --------- |
| Toque repete e avança (cycle fixo) | Não |
| **Aleatória a cada toque** | **Sim** |
| Linha de opções no palco (chips) | Não |

Interpretação: cada toque na letra sorteia uma das opções (≥5) daquela letra e toca o áudio dela. Sem UI nova.

## P2 — Como gerar os áudios novos (letra + combinações, ~1.400 mp3s)?

| Opção oferecida | Escolhida |
| --------------- | --------- |
| **Gerar tudo com edge-tts** | **Sim** |
| edge-tts + fallback speechSynthesis do navegador | Não |
| Só fallback do navegador | Não |

Interpretação: `generate_audio.py` é atualizado e executado para gerar todos os mp3s com a voz `pt-BR-FranciscaNeural` (ritmo -25%), como os atuais.

## Nomes obrigatórios (pedido direto do usuário)

Pedro, Antonela, Aurora, Julio, Joca, Bia, Jeferson, Patricia

## Emenda (pedido direto do usuário, após a entrega)

1. **Novos nomes**: "coloca Isis tbm, Benicio" — ISIS vira opção da letra **I** e BENÍCIO da letra **B** (grafia correta BENÍCIO, por analogia a JÚLIO; plural invariante ISIS, termina em -s como ULISSES).
2. **Ícones**: "e Joca é um apelido, então é um menino o ícone" → JOCA 👦 (era 🤡); "Aurora é um nome de menina, Isis também é uma menina" → AURORA 👧 (era 🌅) e ISIS 👧.
3. **Nova regra de sorteio**: "sorteou Jacare, o proximo sorteio so pode ser os outros exceto Jacare; se sortear Jeferson, o proximo qualquer outro exceto jacare e jeferson… até todos as possibilidades serem faladas" — lista de exclusão por letra (bag sem reposição); quando todas forem faladas, o ciclo reinicia (sem repetir a imediatamente anterior na virada, para manter o never-consecutive).
4. **Push**: "dai sobe isso" — autorizado subir a emenda ao final.

## Deferred Ideas

- **YASMIN (Y)** está cadastrado com `gender: "M"` e 🌸 — YASMIN é nome de menina. Fora do escopo desta emenda (não pedido pelo usuário); candidato a correção futura (mudar gênero/ícone exige regenerar os combos `y_4`). — obrigatórios como opções das letras P, A, J e B. "Pelo menos 5 de cada" letra também é exigência direta.
