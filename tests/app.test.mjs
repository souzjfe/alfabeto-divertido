import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import data from '../data.js';

const require = createRequire(import.meta.url);

function makeElement(tag = 'div') {
    const classes = new Set();
    const el = {
        tag,
        textContent: '',
        innerHTML: '',
        offsetWidth: 0,
        dataset: {},
        children: [],
        listeners: {},
        classes,
        style: { setProperty() {}, backgroundColor: '', fontSize: '' },
        classList: {
            add: (...cs) => cs.forEach(c => classes.add(c)),
            remove: (...cs) => cs.forEach(c => classes.delete(c)),
            contains: (c) => classes.has(c)
        },
        appendChild(child) { this.children.push(child); },
        addEventListener(type, fn) { this.listeners[type] = fn; },
        querySelector() { return makeElement(); },
        cloneNode() { return makeElement(); },
        parentNode: { replaceChild() {} }
    };
    return el;
}

// Carrega app.js de novo, com estado fresco e um DOM mínimo de mentira.
function loadApp({ audioPlayRejects = false } = {}) {
    const ids = new Map();
    const created = [];
    const audios = [];
    const windowListeners = {};

    globalThis.document = {
        getElementById(id) {
            if (!ids.has(id)) ids.set(id, makeElement());
            return ids.get(id);
        },
        createElement(tag) {
            const el = makeElement(tag);
            created.push(el);
            return el;
        },
        querySelectorAll() { return []; },
        body: { style: { backgroundColor: '' } },
        addEventListener() {},
        fullscreenElement: null
    };
    globalThis.window = {
        addEventListener(type, fn) { windowListeners[type] = fn; },
        AudioContext: class {
            constructor() { this.state = 'running'; this.currentTime = 0; this.destination = {}; }
            resume() {}
            createOscillator() {
                return {
                    type: '', frequency: {
                        value: 0, setValueAtTime() {},
                        exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {}
                    },
                    connect() {}, start() {}, stop() {}
                };
            }
            createGain() {
                return {
                    gain: {
                        value: 0, setValueAtTime() {},
                        exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {}
                    },
                    connect() {}
                };
            }
        }
    };
    globalThis.Audio = class {
        constructor(url) {
            this.url = url;
            audios.push(this);
        }
        addEventListener(type, fn) { this._listeners = this._listeners || {}, this._listeners[type] = fn; }
        play() {
            return audioPlayRejects ? Promise.reject(new Error('audio unavailable')) : Promise.resolve();
        }
        pause() {}
    };
    Object.assign(globalThis, data);

    delete require.cache[require.resolve('../app.js')];
    require('../app.js');

    // Simula o clique em "Começar Brincadeira" (fecha o modal de boas-vindas).
    globalThis.document.getElementById('welcome-modal').classList.add('hidden');

    const tapKey = (key) => {
        const card = created.find(el => el.dataset && el.dataset.key === key);
        assert.ok(card, `tecla ${key} não encontrada no teclado virtual`);
        card.listeners.click();
    };
    const pressKey = (key) => {
        windowListeners.keydown({ key, repeat: false, preventDefault() {} });
    };
    return {
        tapKey,
        pressKey,
        audios,
        ids,
        lastAudio: () => audios[audios.length - 1].url,
        stage: {
            letter: () => ids.get('stage-letter').textContent,
            emoji: () => ids.get('stage-emoji').textContent,
            word: () => ids.get('stage-word').textContent
        },
        bodyColor: () => globalThis.document.body.style.backgroundColor
    };
}

function optionIndexOf(letter, word) {
    return data.LETTERS[letter].options.findIndex(o => o.word === word);
}

test('SPEECH-01: toque na letra mostra uma opção sorteada no palco', () => {
    const app = loadApp();
    app.tapKey('M');
    const words = data.LETTERS.M.options.map(o => o.word);
    assert.ok(words.includes(app.stage.word()), `palavra inesperada: ${app.stage.word()}`);
    assert.equal(app.stage.letter(), 'M');
    assert.equal(app.bodyColor(), data.LETTERS.M.color);
});

test('SPEECH-02: o áudio tocado é o arquivo da opção exibida', () => {
    const app = loadApp();
    app.tapKey('P');
    const word = app.stage.word();
    const idx = optionIndexOf('P', word);
    assert.equal(app.lastAudio(), data.getLetterAudioFile('P', idx));
});

test('SPEECH-03: toques repetidos nunca repetem a opção anterior', () => {
    const app = loadApp();
    let previous = null;
    for (let i = 0; i < 15; i++) {
        app.tapKey('O');
        const word = app.stage.word();
        assert.notEqual(word, previous, `opção repetida: ${word}`);
        previous = word;
    }
});

test('SPEECH-03: um ciclo de toques fala todas as opções antes de repetir', () => {
    const app = loadApp();
    const count = data.LETTERS.O.options.length;
    const cycle = [];
    for (let i = 0; i < count; i++) {
        app.tapKey('O');
        cycle.push(app.stage.word());
    }
    assert.equal(new Set(cycle).size, count, `ciclo incompleto: ${cycle}`);

    app.tapKey('O');
    assert.notEqual(app.stage.word(), cycle[cycle.length - 1],
        'o novo ciclo não pode começar repetindo a última opção do ciclo anterior');
});

test('SPEECH-03: combinações número+letra não consomem o ciclo da letra', () => {
    const app = loadApp();
    const count = data.LETTERS.O.options.length;
    const seen = new Set();
    for (let i = 0; i < count; i++) {
        app.tapKey('O');
        seen.add(app.stage.word());
        app.tapKey('3');
        assert.match(app.stage.word(), /^3 /);
    }
    assert.equal(seen.size, count, `ciclo incompleto com combos no meio: ${[...seen]}`);
});

test('SPEECH-09: letra + número mostra o plural da opção exibida com os emojis dela', () => {
    const app = loadApp();
    app.tapKey('P');
    const option = data.LETTERS.P.options[optionIndexOf('P', app.stage.word())];

    app.tapKey('3');
    assert.equal(app.stage.word(), `3 ${option.plural}`);
    assert.equal(app.stage.emoji(), Array(3).fill(option.emoji).join(' '));
    assert.equal(app.lastAudio(), data.getComboAudioFile(3, 'P', optionIndexOf('P', option.word)));
    assert.equal(app.bodyColor(), data.LETTERS.P.color);
});

test('SPEECH-10: contagem 1 usa o singular', () => {
    const app = loadApp();
    app.tapKey('A');
    const idx = optionIndexOf('A', app.stage.word());
    app.tapKey('1');
    assert.equal(app.stage.word(), `1 ${data.LETTERS.A.options[idx].word}`);
    assert.equal(app.lastAudio(), data.getComboAudioFile(1, 'A', idx));
});

test('contagem 0 mostra 💨 e o plural (comportamento atual preservado)', () => {
    const app = loadApp();
    app.tapKey('O');
    const idx = optionIndexOf('O', app.stage.word());
    app.tapKey('0');
    assert.equal(app.stage.word(), `0 ${data.LETTERS.O.options[idx].plural}`);
    assert.equal(app.stage.emoji(), '💨');
});

test('número sozinho continua mostrando a palavra do número com emojis repetidos', () => {
    const app = loadApp();
    app.tapKey('7');
    assert.equal(app.stage.word(), 'SETE');
    assert.equal(app.stage.emoji(), Array(7).fill('🍭').join(' '));
    assert.equal(app.lastAudio(), 'audio/7.mp3');
});

test('depois de uma combinação, o próximo número é avulso de novo', () => {
    const app = loadApp();
    app.tapKey('P');
    app.tapKey('3');
    app.tapKey('7');
    assert.equal(app.stage.word(), 'SETE');
    assert.equal(app.lastAudio(), 'audio/7.mp3');
});

test('teclado físico: letra seleciona e tecla inválida dispara o warning uma vez', () => {
    const app = loadApp();
    app.pressKey('m');
    const words = data.LETTERS.M.options.map(o => o.word);
    assert.ok(words.includes(app.stage.word()));

    const audioCount = app.audios.length;
    app.pressKey('Tab');
    assert.equal(app.lastAudio(), 'audio/warning.mp3');
    app.pressKey('Enter');
    assert.equal(app.audios.length, audioCount + 1, 'segundo warning não deve tocar enquanto o primeiro ainda fala');
});

test('SPEECH-07: falha no áudio não quebra a interface', () => {
    const app = loadApp({ audioPlayRejects: true });
    app.tapKey('J');
    const words = data.LETTERS.J.options.map(o => o.word);
    assert.ok(words.includes(app.stage.word()), 'palco deve atualizar mesmo com áudio falhando');
    app.tapKey('2');
    assert.match(app.stage.word(), /^2 /, 'combinação também deve funcionar sem áudio');
});
