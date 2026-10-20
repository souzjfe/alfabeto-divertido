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

Pedro, Antonela, Aurora, Julio, Joca, Bia, Jeferson, Patricia — obrigatórios como opções das letras P, A, J e B. "Pelo menos 5 de cada" letra também é exigência direta.
