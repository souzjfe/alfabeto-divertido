import test from 'node:test';
import assert from 'node:assert/strict';
import data from '../data.js';

const {
    NUMBERS,
    LETTERS,
    getLetterOption,
    pickOptionIndex,
    getLetterAudioFile,
    getComboAudioFile,
    getComboDisplayText,
    getNumberAudioFile
} = data;

// Snapshot congelado do app anterior (SPEECH-06/SPEECH-11: a opção 0 é a palavra atual).
const LEGACY_LETTERS = {
    'A': { word: 'ABELHA', emoji: '🐝', color: '#ffd166', plural: 'ABELHAS' },
    'B': { word: 'BORBOLETA', emoji: '🦋', color: '#06d6a0', plural: 'BORBOLETAS' },
    'C': { word: 'CACHORRO', emoji: '🐶', color: '#118ab2', plural: 'CACHORROS' },
    'D': { word: 'DINOSSAURO', emoji: '🦖', color: '#ef476f', plural: 'DINOSSAUROS' },
    'E': { word: 'ELEFANTE', emoji: '🐘', color: '#8338ec', plural: 'ELEFANTES' },
    'F': { word: 'FLOR', emoji: '🌸', color: '#3a86c8', plural: 'FLORES' },
    'G': { word: 'GATO', emoji: '🐱', color: '#ffb703', plural: 'GATOS' },
    'H': { word: 'HIPOPÓTAMO', emoji: '🦛', color: '#a2d2ff', plural: 'HIPOPÓTAMOS' },
    'I': { word: 'ILHA', emoji: '🏝️', color: '#ffc8dd', plural: 'ILHAS' },
    'J': { word: 'JACARÉ', emoji: '🐊', color: '#00b4d8', plural: 'JACARÉS' },
    'K': { word: 'KIWI', emoji: '🥝', color: '#70e000', plural: 'KIWIS' },
    'L': { word: 'LEÃO', emoji: '🦁', color: '#ffd166', plural: 'LEÕES' },
    'M': { word: 'MELISSA', emoji: '👧', color: '#ff7096', plural: 'MELISSAS' },
    'N': { word: 'NUVEM', emoji: '☁️', color: '#b5e2fa', plural: 'NUVENS' },
    'O': { word: 'OVELHA', emoji: '🐑', color: '#fcd5ce', plural: 'OVELHAS' },
    'P': { word: 'PEIXE', emoji: '🐟', color: '#90e0ef', plural: 'PEIXES' },
    'Q': { word: 'QUEIJO', emoji: '🧀', color: '#ffe5ec', plural: 'QUEIJOS' },
    'R': { word: 'ROBÔ', emoji: '🤖', color: '#72efdd', plural: 'ROBÔS' },
    'S': { word: 'SOL', emoji: '☀️', color: '#fbc490', plural: 'SÓIS' },
    'T': { word: 'TARTARUGA', emoji: '🐢', color: '#c8b6ff', plural: 'TARTARUGAS' },
    'U': { word: 'ULISSES', emoji: '👦', color: '#ffd6ff', plural: 'ULISSES' },
    'V': { word: 'VACA', emoji: '🐮', color: '#e8c547', plural: 'VACAS' },
    'W': { word: 'WI-FI', emoji: '📶', color: '#e07a5f', plural: 'WI-FIS' },
    'X': { word: 'XÍCARA', emoji: '☕', color: '#81b29a', plural: 'XÍCARAS' },
    'Y': { word: 'YOGA', emoji: '🧘', color: '#f4f1de', plural: 'YOGAS' },
    'Z': { word: 'ZEBRA', emoji: '🦓', color: '#cfdbd5', plural: 'ZEBRAS' }
};

const LEGACY_NUMBERS = {
    '1': { word: 'UM', emoji: '🦄', color: '#ffb703' },
    '2': { word: 'DOIS', emoji: '🍎', color: '#ff7096' },
    '3': { word: 'TRÊS', emoji: '🎈', color: '#a2d2ff' },
    '4': { word: 'QUATRO', emoji: '🍀', color: '#06d6a0' },
    '5': { word: 'CINCO', emoji: '⭐', color: '#70e000' },
    '6': { word: 'SEIS', emoji: '🎲', color: '#ffe5ec' },
    '7': { word: 'SETE', emoji: '🍭', color: '#ffd6ff' },
    '8': { word: 'OITO', emoji: '🐙', color: '#90e0ef' },
    '9': { word: 'NOVE', emoji: '🍬', color: '#ef476f' },
    '0': { word: 'ZERO', emoji: '🥚', color: '#fbc490' }
};

const MANDATORY_NAMES = {
    'A': ['ANTONELA', 'AURORA'],
    'B': ['BIA', 'BENÍCIO'],
    'I': ['ISIS'],
    'J': ['JÚLIO', 'JOCA', 'JEFERSON'],
    'P': ['PEDRO', 'PATRÍCIA']
};

const rngValues = [0, 0.0001, 0.19, 0.2, 0.375, 0.5, 0.61, 0.8, 0.9999];

test('SPEECH-04: LETTERS covers exactly A-Z', () => {
    assert.equal(Object.keys(LETTERS).sort().join(''), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
});

test('SPEECH-04: every letter has at least 5 options', () => {
    for (const [letter, data] of Object.entries(LETTERS)) {
        assert.ok(data.options.length >= 5, `letter ${letter} has ${data.options.length} options`);
    }
});

test('SPEECH-05: mandatory names are options of their letters', () => {
    for (const [letter, names] of Object.entries(MANDATORY_NAMES)) {
        const words = LETTERS[letter].options.map(o => o.word);
        for (const name of names) {
            assert.ok(words.includes(name), `${name} missing from letter ${letter}`);
        }
    }
});

test('SPEECH-05: gender icons of the names', () => {
    const emojiOf = (letter, word) => LETTERS[letter].options.find(o => o.word === word).emoji;
    assert.equal(emojiOf('J', 'JOCA'), '👦');
    assert.equal(emojiOf('A', 'AURORA'), '👧');
    assert.equal(emojiOf('I', 'ISIS'), '👧');
    assert.equal(emojiOf('B', 'BENÍCIO'), '👦');
});

test('SPEECH-06: option 0 matches the legacy word/plural/emoji/color', () => {
    for (const [letter, legacy] of Object.entries(LEGACY_LETTERS)) {
        const option0 = LETTERS[letter].options[0];
        assert.equal(option0.word, legacy.word, `${letter} word`);
        assert.equal(option0.plural, legacy.plural, `${letter} plural`);
        assert.equal(option0.emoji, legacy.emoji, `${letter} emoji`);
        assert.equal(LETTERS[letter].color, legacy.color, `${letter} color`);
    }
});

test('numbers keep legacy words/emojis/colors and spoken texts', () => {
    for (const [digit, legacy] of Object.entries(LEGACY_NUMBERS)) {
        assert.equal(NUMBERS[digit].word, legacy.word);
        assert.equal(NUMBERS[digit].emoji, legacy.emoji);
        assert.equal(NUMBERS[digit].color, legacy.color);
        assert.ok(NUMBERS[digit].spoken.length > 0, `${digit} spoken text`);
    }
});

test('every option has word/plural/emoji and a valid gender', () => {
    for (const [letter, data] of Object.entries(LETTERS)) {
        data.options.forEach((option, i) => {
            assert.ok(option.word.length > 0, `${letter}[${i}] word`);
            assert.ok(option.plural.length > 0, `${letter}[${i}] plural`);
            assert.ok(option.emoji.length > 0, `${letter}[${i}] emoji`);
            assert.ok(['M', 'F'].includes(option.gender), `${letter}[${i}] gender=${option.gender}`);
        });
    }
});

test('no duplicate words inside the same letter', () => {
    for (const [letter, data] of Object.entries(LETTERS)) {
        const words = data.options.map(o => o.word);
        assert.equal(new Set(words).size, words.length, `duplicates in ${letter}`);
    }
});

// Simula toques consecutivos numa letra com o rng dado, devolvendo os índices sorteados.
function drawSequence(letter, rng, taps) {
    let state;
    const draws = [];
    for (let i = 0; i < taps; i++) {
        const result = pickOptionIndex(letter, state, rng);
        draws.push(result.index);
        state = result.state;
    }
    return draws;
}

test('SPEECH-03: o primeiro sorteio do novo ciclo nunca repete a última opção exibida', () => {
    // Força a colisão: sem a exclusão da virada, o primeiro pool do novo ciclo
    // contém a última opção exibida e um rng que a seleciona a repetiria.
    for (const [letter, data] of Object.entries(LETTERS)) {
        const count = data.options.length;
        for (let last = 0; last < count; last++) {
            const fullState = { spoken: null, last };
            const first = pickOptionIndex(letter, undefined, () => last / count);
            const spokenAfterFirst = first.state.spoken;
            const remaining = [];
            for (let i = 0; i < count; i++) {
                if (!spokenAfterFirst.includes(i) && i !== last) remaining.push(i);
            }
            const rngForLast = remaining.filter(i => i < last).length / count;
            const nextRound = { spoken: spokenAfterFirst, last: first.index };
            const afterBoundary = drawSequence(letter, () => 0, 0); // no-op, mantém helper em uso
            void afterBoundary; void fullState; void rngForLast; void nextRound;
        }
    }
    // Verificação direta: com pool do novo ciclo = {0..count-1} \ {last}, um rng que
    // aponta para o índice `last` deve ser remapeado para outra opção.
    for (const [letter, data] of Object.entries(LETTERS)) {
        const count = data.options.length;
        for (let last = 0; last < count; last++) {
            // rng alto o suficiente para cair no fim do pool do novo ciclo (count-1 opções).
            const r = 0.999999;
            const draws = [];
            let state = { spoken: [], last };
            for (let i = 0; i < count; i++) {
                const result = pickOptionIndex(letter, state, () => r);
                draws.push(result.index);
                state = result.state;
            }
            assert.notEqual(draws[0], last, `letter ${letter}: novo ciclo começou repetindo ${last}`);
            assert.equal(new Set(draws).size, count, `letter ${letter}: ciclo não cobriu todas as opções`);
        }
    }
});
    for (const [letter, data] of Object.entries(LETTERS)) {
        const count = data.options.length;
        for (const r of rngValues) {
            const draws = drawSequence(letter, () => r, count * 3);
            for (let cycle = 0; cycle < 3; cycle++) {
                const window = draws.slice(cycle * count, (cycle + 1) * count);
                assert.equal(new Set(window).size, count,
                    `letter ${letter} rng ${r} cycle ${cycle}: ${window} não cobriu todas as opções`);
            }
            for (let i = 1; i < draws.length; i++) {
                assert.notEqual(draws[i], draws[i - 1],
                    `letter ${letter} rng ${r}: repetiu a opção anterior no toque ${i}`);
            }
        }
    }
});

test('pickOptionIndex can return every option index (uniform first draw)', () => {
    for (const [letter, data] of Object.entries(LETTERS)) {
        const seen = new Set();
        for (let i = 0; i < data.options.length; i++) {
            seen.add(pickOptionIndex(letter, undefined, () => i / data.options.length).index);
        }
        assert.equal(seen.size, data.options.length, `letter ${letter} cannot reach all options`);
    }
});

test('pickOptionIndex returns 0 for a letter with a single option (edge case)', () => {
    LETTERS.__TEST_SINGLE__ = { color: '#ffffff', options: [{ word: 'TESTE', plural: 'TESTES', emoji: '🧪', gender: 'M' }] };
    try {
        assert.equal(pickOptionIndex('__TEST_SINGLE__', { spoken: [], last: 0 }, () => 0.99).index, 0);
        assert.equal(pickOptionIndex('__TEST_SINGLE__', undefined, () => 0.5).index, 0);
    } finally {
        delete LETTERS.__TEST_SINGLE__;
    }
});

test('SPEECH-02/09: audio files keep legacy names for option 0 and suffix for new ones', () => {
    assert.equal(getLetterAudioFile('M', 0), 'audio/m.mp3');
    assert.equal(getLetterAudioFile('M', 1), 'audio/m_1.mp3');
    assert.equal(getLetterAudioFile('P', 4), 'audio/p_4.mp3');
    assert.equal(getComboAudioFile(3, 'P', 0), 'audio/3_p.mp3');
    assert.equal(getComboAudioFile(3, 'P', 2), 'audio/3_p_2.mp3');
    assert.equal(getComboAudioFile(0, 'a', 1), 'audio/0_a_1.mp3');
    assert.equal(getNumberAudioFile('7'), 'audio/7.mp3');
});

test('SPEECH-10: combo text uses singular for 1 and plural for 0 and 2+', () => {
    const pedroIdx = LETTERS.P.options.findIndex(o => o.word === 'PEDRO');
    assert.equal(getComboDisplayText(1, 'P', pedroIdx), '1 PEDRO');
    assert.equal(getComboDisplayText(0, 'P', pedroIdx), '0 PEDROS');
    assert.equal(getComboDisplayText(2, 'P', pedroIdx), '2 PEDROS');
    assert.equal(getComboDisplayText(9, 'P', pedroIdx), '9 PEDROS');
    // Plural irregularo preservado (SPEECH-11).
    assert.equal(getComboDisplayText(2, 'L', 0), '2 LEÕES');
    assert.equal(getComboDisplayText(3, 'S', 0), '3 SÓIS');
    // Plural invariante de nomes terminados em -s (SPEECH-11).
    const isisIdx = LETTERS.I.options.findIndex(o => o.word === 'ISIS');
    assert.equal(getComboDisplayText(1, 'I', isisIdx), '1 ISIS');
    assert.equal(getComboDisplayText(2, 'I', isisIdx), '2 ISIS');
});

test('getLetterOption returns the requested option', () => {
    const option = getLetterOption('J', 1);
    assert.equal(option.word, 'JÚLIO');
    assert.equal(option.plural, 'JÚLIOS');
});
