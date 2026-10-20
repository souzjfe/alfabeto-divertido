// Os dados (NUMBERS, LETTERS) e as helpers puras vêm de data.js, carregado antes deste arquivo.
let audioCtx = null;
let musicInterval = null;
let musicPlaying = false;
let toastTimeout = null;
let currentSpeechAudio = null;
let currentlySpeaking = null;
let lastLetterSelected = null;
const lastOptionIndexByLetter = {};

const melodyNotes = [
    60, 64, 67, 72,
    60, 64, 67, 72,
    57, 60, 64, 69,
    57, 60, 64, 69,
    53, 57, 60, 65,
    53, 57, 60, 65,
    55, 59, 62, 67,
    55, 59, 62, 67
];
let noteIndex = 0;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playMelodyNote() {
    if (!audioCtx || !musicPlaying) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'triangle';
    const midiNote = melodyNotes[noteIndex];
    osc.frequency.value = Math.pow(2, (midiNote - 69) / 12) * 440;

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.85);

    noteIndex = (noteIndex + 1) % melodyNotes.length;
}

function startMusic() {
    if (musicInterval) clearInterval(musicInterval);
    musicPlaying = true;
    musicInterval = setInterval(playMelodyNote, 500);
    document.getElementById('btn-music').classList.add('active');
    document.getElementById('btn-music').querySelector('.btn-text').textContent = 'Música: Desligar';
}

function stopMusic() {
    musicPlaying = false;
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
    document.getElementById('btn-music').classList.remove('active');
    document.getElementById('btn-music').querySelector('.btn-text').textContent = 'Música: Ligar';
}

function playBubbleSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.12);

    gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.18);
}

function playWarningSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(70, audioCtx.currentTime + 0.18);

    gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.22);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
}

function stopCurrentSpeech() {
    if (currentSpeechAudio) {
        currentSpeechAudio.pause();
        currentSpeechAudio = null;
    }
}

function playSpeech(fileUrl, token) {
    stopCurrentSpeech();
    currentlySpeaking = token;
    currentSpeechAudio = new Audio(fileUrl);
    currentSpeechAudio.addEventListener('ended', () => {
        if (currentlySpeaking === token) {
            currentlySpeaking = null;
        }
    });
    currentSpeechAudio.play().catch(() => {
        if (currentlySpeaking === token) {
            currentlySpeaking = null;
        }
    });
}

function createParticles() {
    const container = document.getElementById('stage-particles');
    container.innerHTML = '';
    const emojis = ['✨', '🎈', '⭐', '🌈', '🍭', '🎉'];

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 150;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const rotate = Math.random() * 360 - 180;

        particle.style.setProperty('--dx', `${dx}px`);
        particle.style.setProperty('--dy', `${dy}px`);
        particle.style.setProperty('--dr', `${rotate}deg`);

        particle.style.left = '50%';
        particle.style.top = '50%';

        container.appendChild(particle);
    }
}

function resetStageAnimation() {
    const stageLetter = document.getElementById('stage-letter');
    const stageEmoji = document.getElementById('stage-emoji');
    const stageWord = document.getElementById('stage-word');

    stageLetter.classList.remove('animate-pop');
    stageEmoji.classList.remove('animate-pop');
    stageWord.classList.remove('animate-pop');
    void stageLetter.offsetWidth;

    return { stageLetter, stageEmoji, stageWord };
}

function setStageEmoji(stageEmoji, text, fontSize) {
    stageEmoji.textContent = text;
    stageEmoji.style.fontSize = fontSize;
}

function emojiSizeForCount(count) {
    if (count === 1) return '10rem';
    if (count <= 4) return '6rem';
    return '4.5rem';
}

function animateStageCard(color) {
    document.body.style.backgroundColor = color;
    document.getElementById('stage-card').style.setProperty('--theme-color', color);
    document.getElementById('stage-letter').classList.add('animate-pop');
    document.getElementById('stage-emoji').classList.add('animate-pop');
    document.getElementById('stage-word').classList.add('animate-pop');
}

function highlightKey(key) {
    document.querySelectorAll('.key-card').forEach(card => {
        if (card.dataset.key === key) {
            card.classList.add('active');
            setTimeout(() => card.classList.remove('active'), 250);
        }
    });
}

function selectLetter(key) {
    const upper = key.toUpperCase();
    if (NUMBERS[upper]) {
        selectNumber(upper);
    } else if (LETTERS[upper]) {
        selectLetterOption(upper);
    }
}

// SPEECH-01/03: cada toque sorteia uma opção da letra, diferente da última exibida.
function selectLetterOption(letter) {
    const optionIndex = pickOptionIndex(letter, lastOptionIndexByLetter[letter]);
    lastOptionIndexByLetter[letter] = optionIndex;
    lastLetterSelected = { letter, optionIndex };

    const option = getLetterOption(letter, optionIndex);
    const { stageLetter, stageEmoji, stageWord } = resetStageAnimation();

    stageLetter.textContent = letter;
    setStageEmoji(stageEmoji, option.emoji, '10rem');
    stageWord.textContent = option.word;

    animateStageCard(LETTERS[letter].color);
    highlightKey(letter);
    playBubbleSound();
    playSpeech(getLetterAudioFile(letter, optionIndex), letter);
    createParticles();
}

// SPEECH-09/10: a combinação número+letra usa a opção exibida da letra.
function selectNumber(num) {
    const count = parseInt(num, 10);
    const combo = lastLetterSelected;
    lastLetterSelected = null;

    const { stageLetter, stageEmoji, stageWord } = resetStageAnimation();
    stageLetter.textContent = num;

    if (combo) {
        const option = getLetterOption(combo.letter, combo.optionIndex);
        stageWord.textContent = getComboDisplayText(count, combo.letter, combo.optionIndex);
        if (count === 0) {
            setStageEmoji(stageEmoji, '💨', '8rem');
        } else {
            setStageEmoji(stageEmoji, Array(count).fill(option.emoji).join(' '), emojiSizeForCount(count));
        }
        animateStageCard(LETTERS[combo.letter].color);
        highlightKey(num);
        playBubbleSound();
        playSpeech(getComboAudioFile(count, combo.letter, combo.optionIndex), `${num}_${combo.letter}`);
        createParticles();
        return;
    }

    const item = NUMBERS[num];
    stageWord.textContent = item.word;
    if (count === 0) {
        setStageEmoji(stageEmoji, '💨', '8rem');
    } else {
        setStageEmoji(stageEmoji, Array(count).fill(item.emoji).join(' '), emojiSizeForCount(count));
    }
    animateStageCard(item.color);
    highlightKey(num);
    playBubbleSound();
    playSpeech(getNumberAudioFile(num), num);
    createParticles();
}

function showWarning() {
    lastLetterSelected = null;
    if (currentlySpeaking === 'WARNING') {
        return;
    }
    playWarningSound();
    playSpeech('audio/warning.mp3', 'WARNING');
    const toast = document.getElementById('invalid-key-toast');
    toast.classList.remove('hidden');
    const toastClone = toast.cloneNode(true);
    toast.parentNode.replaceChild(toastClone, toast);
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toastClone.classList.add('hidden');
    }, 1500);
}

function getKeyDisplay(key) {
    if (NUMBERS[key]) {
        return { emoji: NUMBERS[key].emoji, color: NUMBERS[key].color };
    }
    return { emoji: LETTERS[key].options[0].emoji, color: LETTERS[key].color };
}

function buildKeyboard() {
    const grid = document.getElementById('virtual-keyboard');
    grid.innerHTML = '';

    Object.keys(NUMBERS).concat(Object.keys(LETTERS)).forEach(key => {
        const display = getKeyDisplay(key);
        const card = document.createElement('div');
        card.className = 'key-card';
        card.dataset.key = key;
        card.style.setProperty('--key-theme-color', display.color);

        const letterSpan = document.createElement('span');
        letterSpan.className = 'key-letter';
        letterSpan.textContent = key;

        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'key-emoji';
        emojiSpan.textContent = display.emoji;

        card.appendChild(letterSpan);
        card.appendChild(emojiSpan);

        card.addEventListener('click', () => {
            initAudio();
            selectLetter(key);
        });

        grid.appendChild(card);
    });
}

function toggleFullscreen() {
    const container = document.getElementById('app-container');
    if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        }
        document.getElementById('btn-fullscreen').classList.add('active');
        document.getElementById('btn-fullscreen').querySelector('.btn-text').textContent = 'Sair da Tela';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        document.getElementById('btn-fullscreen').classList.remove('active');
        document.getElementById('btn-fullscreen').querySelector('.btn-text').textContent = 'Tela Cheia';
    }
}

document.getElementById('btn-music').addEventListener('click', () => {
    initAudio();
    if (musicPlaying) {
        stopMusic();
    } else {
        startMusic();
    }
});

document.getElementById('btn-fullscreen').addEventListener('click', () => {
    initAudio();
    toggleFullscreen();
});

document.getElementById('btn-start').addEventListener('click', () => {
    initAudio();
    document.getElementById('welcome-modal').classList.add('hidden');
    startMusic();
});

window.addEventListener('keydown', (e) => {
    if (e.repeat) {
        e.preventDefault();
        return;
    }

    if (document.getElementById('welcome-modal').classList.contains('hidden') === false) {
        return;
    }

    if (e.key === 'Tab' || e.key === 'Enter' || e.key === 'Space' || e.key === ' ' || e.key === 'Backspace' || e.key === 'Escape') {
        e.preventDefault();
        showWarning();
        return;
    }

    if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
    }

    const key = e.key.toUpperCase();
    if (NUMBERS[key] || LETTERS[key]) {
        e.preventDefault();
        selectLetter(key);
    } else {
        if (e.key.length === 1) {
            e.preventDefault();
            showWarning();
        }
    }
});

buildKeyboard();
