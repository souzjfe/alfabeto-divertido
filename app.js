const alphabet = {
    '1': { word: 'UM', emoji: '🦄', color: '#ffb703' },
    '2': { word: 'DOIS', emoji: '🍒', color: '#ff7096' },
    '3': { word: 'TRÊS', emoji: '📐', color: '#a2d2ff' },
    '4': { word: 'QUATRO', emoji: '🍀', color: '#06d6a0' },
    '5': { word: 'CINCO', emoji: '🖐️', color: '#70e000' },
    '6': { word: 'SEIS', emoji: '🎲', color: '#ffe5ec' },
    '7': { word: 'SETE', emoji: '🌈', color: '#ffd6ff' },
    '8': { word: 'OITO', emoji: '🐙', color: '#90e0ef' },
    '9': { word: 'NOVE', emoji: '🎈', color: '#ef476f' },
    '0': { word: 'ZERO', emoji: '🥚', color: '#fbc490' },
    'A': { word: 'ABELHA', emoji: '🐝', color: '#ffd166' },
    'B': { word: 'BORBOLETA', emoji: '🦋', color: '#06d6a0' },
    'C': { word: 'CACHORRO', emoji: '🐶', color: '#118ab2' },
    'D': { word: 'DINOSSAURO', emoji: '🦖', color: '#ef476f' },
    'E': { word: 'ELEFANTE', emoji: '🐘', color: '#8338ec' },
    'F': { word: 'FOCA', emoji: '🦭', color: '#3a86c8' },
    'G': { word: 'GATO', emoji: '🐱', color: '#ffb703' },
    'H': { word: 'HIPOPÓTAMO', emoji: '🦛', color: '#a2d2ff' },
    'I': { word: 'ILHA', emoji: '🏝️', color: '#ffc8dd' },
    'J': { word: 'JACARÉ', emoji: '🐊', color: '#00b4d8' },
    'K': { word: 'KIWI', emoji: '🥝', color: '#70e000' },
    'L': { word: 'LEÃO', emoji: '🦁', color: '#ffd166' },
    'M': { word: 'MELISSA', emoji: '👧', color: '#ff7096' },
    'N': { word: 'NUVEM', emoji: '☁️', color: '#b5e2fa' },
    'O': { word: 'OVELHA', emoji: '🐑', color: '#fcd5ce' },
    'P': { word: 'PEIXE', emoji: '🐟', color: '#90e0ef' },
    'Q': { word: 'QUEIJO', emoji: '🧀', color: '#ffe5ec' },
    'R': { word: 'ROBÔ', emoji: '🤖', color: '#72efdd' },
    'S': { word: 'SOL', emoji: '☀️', color: '#fbc490' },
    'T': { word: 'TARTARUGA', emoji: '🐢', color: '#c8b6ff' },
    'U': { word: 'ULISSES', emoji: '👦', color: '#ffd6ff' },
    'V': { word: 'VACA', emoji: '🐮', color: '#e8c547' },
    'W': { word: 'WI-FI', emoji: '📶', color: '#e07a5f' },
    'X': { word: 'XÍCARA', emoji: '☕', color: '#81b29a' },
    'Y': { word: 'YOGA', emoji: '🧘', color: '#f4f1de' },
    'Z': { word: 'ZEBRA', emoji: '🦓', color: '#cfdbd5' }
};

let audioCtx = null;
let musicInterval = null;
let musicPlaying = false;
let toastTimeout = null;
let currentSpeechAudio = null;
let currentlySpeakingLetter = null;

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

function speakLetter(letter, word) {
    if (currentSpeechAudio) {
        currentSpeechAudio.pause();
        currentSpeechAudio = null;
    }
    currentlySpeakingLetter = letter;
    const ttsUrl = `audio/${letter.toLowerCase()}.mp3`;
    currentSpeechAudio = new Audio(ttsUrl);
    currentSpeechAudio.addEventListener('ended', () => {
        if (currentlySpeakingLetter === letter) {
            currentlySpeakingLetter = null;
        }
    });
    currentSpeechAudio.play().catch(() => {});
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

function selectLetter(letter) {
    if (currentlySpeakingLetter === letter) {
        return;
    }
    const item = alphabet[letter.toUpperCase()];
    if (!item) return;
    
    const stageLetter = document.getElementById('stage-letter');
    const stageEmoji = document.getElementById('stage-emoji');
    const stageWord = document.getElementById('stage-word');
    const stageCard = document.getElementById('stage-card');
    
    stageLetter.classList.remove('animate-pop');
    stageEmoji.classList.remove('animate-pop');
    stageWord.classList.remove('animate-pop');
    void stageLetter.offsetWidth;
    
    stageLetter.textContent = letter;
    stageEmoji.textContent = item.emoji;
    stageWord.textContent = item.word;
    
    stageLetter.classList.add('animate-pop');
    stageEmoji.classList.add('animate-pop');
    stageWord.classList.add('animate-pop');
    
    document.body.style.backgroundColor = item.color;
    stageCard.style.setProperty('--theme-color', item.color);
    
    document.querySelectorAll('.key-card').forEach(card => {
        if (card.dataset.key === letter) {
            card.classList.add('active');
            setTimeout(() => card.classList.remove('active'), 250);
        }
    });
    
    playBubbleSound();
    speakLetter(letter, item.word);
    createParticles();
}

function showWarning() {
    currentlySpeakingLetter = null;
    if (currentSpeechAudio) {
        currentSpeechAudio.pause();
        currentSpeechAudio = null;
    }
    playWarningSound();
    const ttsUrl = 'audio/warning.mp3';
    currentSpeechAudio = new Audio(ttsUrl);
    currentSpeechAudio.play().catch(() => {});
    const toast = document.getElementById('invalid-key-toast');
    toast.classList.remove('hidden');
    const toastClone = toast.cloneNode(true);
    toast.parentNode.replaceChild(toastClone, toast);
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toastClone.classList.add('hidden');
    }, 1500);
}

function buildKeyboard() {
    const grid = document.getElementById('virtual-keyboard');
    grid.innerHTML = '';
    
    Object.keys(alphabet).forEach(key => {
        const item = alphabet[key];
        const card = document.createElement('div');
        card.className = 'key-card';
        card.dataset.key = key;
        card.style.setProperty('--key-theme-color', item.color);
        
        const letterSpan = document.createElement('span');
        letterSpan.className = 'key-letter';
        letterSpan.textContent = key;
        
        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'key-emoji';
        emojiSpan.textContent = item.emoji;
        
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
    if (alphabet[key]) {
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
