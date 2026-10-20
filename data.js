// data.js - fonte única de dados do Alfabeto Divertido.
// Carregado como <script> no browser (expõe NUMBERS/LETTERS/helpers no escopo global)
// e via require() nos testes Node (module.exports).

const NUMBERS = {
    "1": { "word": "UM", "emoji": "🦄", "color": "#ffb703", "spoken": "Um." },
    "2": { "word": "DOIS", "emoji": "🍎", "color": "#ff7096", "spoken": "Dois." },
    "3": { "word": "TRÊS", "emoji": "🎈", "color": "#a2d2ff", "spoken": "Três." },
    "4": { "word": "QUATRO", "emoji": "🍀", "color": "#06d6a0", "spoken": "Quatro." },
    "5": { "word": "CINCO", "emoji": "⭐", "color": "#70e000", "spoken": "Cinco." },
    "6": { "word": "SEIS", "emoji": "🎲", "color": "#ffe5ec", "spoken": "Seis." },
    "7": { "word": "SETE", "emoji": "🍭", "color": "#ffd6ff", "spoken": "Sete." },
    "8": { "word": "OITO", "emoji": "🐙", "color": "#90e0ef", "spoken": "Oito." },
    "9": { "word": "NOVE", "emoji": "🍬", "color": "#ef476f", "spoken": "Nove." },
    "0": { "word": "ZERO", "emoji": "🥚", "color": "#fbc490", "spoken": "Zero." }
};

// A opção 0 de cada letra é a palavra original do app (mesmos mp3s já gravados).
// A opção 1..n são as opções novas sorteadas a cada toque.
const LETTERS = {
    "A": {
        "color": "#ffd166",
        "options": [
            { "word": "ABELHA", "plural": "ABELHAS", "emoji": "🐝", "gender": "F" },
            { "word": "ANTONELA", "plural": "ANTONELAS", "emoji": "👧", "gender": "F" },
            { "word": "AURORA", "plural": "AURORAS", "emoji": "👧", "gender": "F" },
            { "word": "AVIÃO", "plural": "AVIÕES", "emoji": "✈️", "gender": "M" },
            { "word": "ABACAXI", "plural": "ABACAXIS", "emoji": "🍍", "gender": "M" }
        ]
    },
    "B": {
        "color": "#06d6a0",
        "options": [
            { "word": "BORBOLETA", "plural": "BORBOLETAS", "emoji": "🦋", "gender": "F" },
            { "word": "BIA", "plural": "BIAS", "emoji": "👧", "gender": "F" },
            { "word": "BOLA", "plural": "BOLAS", "emoji": "⚽", "gender": "F" },
            { "word": "BALEIA", "plural": "BALEIAS", "emoji": "🐋", "gender": "F" },
            { "word": "BANANA", "plural": "BANANAS", "emoji": "🍌", "gender": "F" },
            { "word": "BENÍCIO", "plural": "BENÍCIOS", "emoji": "👦", "gender": "M" }
        ]
    },
    "C": {
        "color": "#118ab2",
        "options": [
            { "word": "CACHORRO", "plural": "CACHORROS", "emoji": "🐶", "gender": "M" },
            { "word": "CAVALO", "plural": "CAVALOS", "emoji": "🐴", "gender": "M" },
            { "word": "COELHO", "plural": "COELHOS", "emoji": "🐰", "gender": "M" },
            { "word": "CAMELO", "plural": "CAMELOS", "emoji": "🐫", "gender": "M" },
            { "word": "CORAÇÃO", "plural": "CORAÇÕES", "emoji": "❤️", "gender": "M" }
        ]
    },
    "D": {
        "color": "#ef476f",
        "options": [
            { "word": "DINOSSAURO", "plural": "DINOSSAUROS", "emoji": "🦖", "gender": "M" },
            { "word": "DADO", "plural": "DADOS", "emoji": "🎲", "gender": "M" },
            { "word": "DROMEDÁRIO", "plural": "DROMEDÁRIOS", "emoji": "🐪", "gender": "M" },
            { "word": "DESERTO", "plural": "DESERTOS", "emoji": "🏜️", "gender": "M" },
            { "word": "DIAMANTE", "plural": "DIAMANTES", "emoji": "💎", "gender": "M" }
        ]
    },
    "E": {
        "color": "#8338ec",
        "options": [
            { "word": "ELEFANTE", "plural": "ELEFANTES", "emoji": "🐘", "gender": "M" },
            { "word": "ESCOLA", "plural": "ESCOLAS", "emoji": "🏫", "gender": "F" },
            { "word": "ESTRELA", "plural": "ESTRELAS", "emoji": "⭐", "gender": "F" },
            { "word": "ESCADA", "plural": "ESCADAS", "emoji": "🪜", "gender": "F" },
            { "word": "ESPIRAL", "plural": "ESPIRAIS", "emoji": "🌀", "gender": "F" }
        ]
    },
    "F": {
        "color": "#3a86c8",
        "options": [
            { "word": "FLOR", "plural": "FLORES", "emoji": "🌸", "gender": "F" },
            { "word": "FOCA", "plural": "FOCAS", "emoji": "🦭", "gender": "F" },
            { "word": "FADA", "plural": "FADAS", "emoji": "🧚", "gender": "F" },
            { "word": "FOGUETE", "plural": "FOGUETES", "emoji": "🚀", "gender": "M" },
            { "word": "FRUTA", "plural": "FRUTAS", "emoji": "🍓", "gender": "F" }
        ]
    },
    "G": {
        "color": "#ffb703",
        "options": [
            { "word": "GATO", "plural": "GATOS", "emoji": "🐱", "gender": "M" },
            { "word": "GIRAFA", "plural": "GIRAFAS", "emoji": "🦒", "gender": "F" },
            { "word": "GELO", "plural": "GELOS", "emoji": "🧊", "gender": "M" },
            { "word": "GOLFINHO", "plural": "GOLFINHOS", "emoji": "🐬", "gender": "M" },
            { "word": "GAITA", "plural": "GAITAS", "emoji": "🎺", "gender": "F" }
        ]
    },
    "H": {
        "color": "#a2d2ff",
        "options": [
            { "word": "HIPOPÓTAMO", "plural": "HIPOPÓTAMOS", "emoji": "🦛", "gender": "M" },
            { "word": "HAMBÚRGUER", "plural": "HAMBÚRGUERES", "emoji": "🍔", "gender": "M" },
            { "word": "HELICÓPTERO", "plural": "HELICÓPTEROS", "emoji": "🚁", "gender": "M" },
            { "word": "HISTÓRIA", "plural": "HISTÓRIAS", "emoji": "📖", "gender": "F" },
            { "word": "HOSPITAL", "plural": "HOSPITAIS", "emoji": "🏥", "gender": "M" }
        ]
    },
    "I": {
        "color": "#ffc8dd",
        "options": [
            { "word": "ILHA", "plural": "ILHAS", "emoji": "🏝️", "gender": "F" },
            { "word": "IGUANA", "plural": "IGUANAS", "emoji": "🦎", "gender": "F" },
            { "word": "IMÃ", "plural": "IMÃS", "emoji": "🧲", "gender": "M" },
            { "word": "IGREJA", "plural": "IGREJAS", "emoji": "⛪", "gender": "F" },
            { "word": "INDÍGENA", "plural": "INDÍGENAS", "emoji": "🪶", "gender": "M" },
            { "word": "ISIS", "plural": "ISIS", "emoji": "👧", "gender": "F" }
        ]
    },
    "J": {
        "color": "#00b4d8",
        "options": [
            { "word": "JACARÉ", "plural": "JACARÉS", "emoji": "🐊", "gender": "M" },
            { "word": "JÚLIO", "plural": "JÚLIOS", "emoji": "👦", "gender": "M" },
            { "word": "JOCA", "plural": "JOCAS", "emoji": "👦", "gender": "M" },
            { "word": "JEFERSON", "plural": "JEFERSONS", "emoji": "👨", "gender": "M" },
            { "word": "JANELA", "plural": "JANELAS", "emoji": "🪟", "gender": "F" }
        ]
    },
    "K": {
        "color": "#70e000",
        "options": [
            { "word": "KIWI", "plural": "KIWIS", "emoji": "🥝", "gender": "M" },
            { "word": "KARATÊ", "plural": "KARATÊS", "emoji": "🥋", "gender": "M" },
            { "word": "KARAOKÊ", "plural": "KARAOKÊS", "emoji": "🎤", "gender": "M" },
            { "word": "KART", "plural": "KARTS", "emoji": "🏎️", "gender": "M" },
            { "word": "KIMONO", "plural": "KIMONOS", "emoji": "👘", "gender": "M" }
        ]
    },
    "L": {
        "color": "#ffd166",
        "options": [
            { "word": "LEÃO", "plural": "LEÕES", "emoji": "🦁", "gender": "M" },
            { "word": "LUA", "plural": "LUAS", "emoji": "🌙", "gender": "F" },
            { "word": "LEITE", "plural": "LEITES", "emoji": "🥛", "gender": "M" },
            { "word": "LIVRO", "plural": "LIVROS", "emoji": "📚", "gender": "M" },
            { "word": "LAGARTIXA", "plural": "LAGARTIXAS", "emoji": "🦎", "gender": "F" }
        ]
    },
    "M": {
        "color": "#ff7096",
        "options": [
            { "word": "MELISSA", "plural": "MELISSAS", "emoji": "👧", "gender": "F" },
            { "word": "MACACO", "plural": "MACACOS", "emoji": "🐒", "gender": "M" },
            { "word": "MAÇÃ", "plural": "MAÇÃS", "emoji": "🍎", "gender": "F" },
            { "word": "MALA", "plural": "MALAS", "emoji": "🧳", "gender": "F" },
            { "word": "MENINO", "plural": "MENINOS", "emoji": "👦", "gender": "M" }
        ]
    },
    "N": {
        "color": "#b5e2fa",
        "options": [
            { "word": "NUVEM", "plural": "NUVENS", "emoji": "☁️", "gender": "F" },
            { "word": "NARIZ", "plural": "NARIZES", "emoji": "👃", "gender": "M" },
            { "word": "NAVIO", "plural": "NAVIOS", "emoji": "🚢", "gender": "M" },
            { "word": "NINHO", "plural": "NINHOS", "emoji": "🪺", "gender": "M" },
            { "word": "NOZ", "plural": "NOZES", "emoji": "🌰", "gender": "F" }
        ]
    },
    "O": {
        "color": "#fcd5ce",
        "options": [
            { "word": "OVELHA", "plural": "OVELHAS", "emoji": "🐑", "gender": "F" },
            { "word": "OLHO", "plural": "OLHOS", "emoji": "👁️", "gender": "M" },
            { "word": "ORCA", "plural": "ORCAS", "emoji": "🐳", "gender": "F" },
            { "word": "OVO", "plural": "OVOS", "emoji": "🥚", "gender": "M" },
            { "word": "ONÇA", "plural": "ONÇAS", "emoji": "🐆", "gender": "F" }
        ]
    },
    "P": {
        "color": "#90e0ef",
        "options": [
            { "word": "PEIXE", "plural": "PEIXES", "emoji": "🐟", "gender": "M" },
            { "word": "PEDRO", "plural": "PEDROS", "emoji": "👦", "gender": "M" },
            { "word": "PATRÍCIA", "plural": "PATRÍCIAS", "emoji": "👩", "gender": "F" },
            { "word": "PANDA", "plural": "PANDAS", "emoji": "🐼", "gender": "M" },
            { "word": "PIPA", "plural": "PIPAS", "emoji": "🪁", "gender": "F" }
        ]
    },
    "Q": {
        "color": "#ffe5ec",
        "options": [
            { "word": "QUEIJO", "plural": "QUEIJOS", "emoji": "🧀", "gender": "M" },
            { "word": "QUARTO", "plural": "QUARTOS", "emoji": "🛏️", "gender": "M" },
            { "word": "QUADRO", "plural": "QUADROS", "emoji": "🖼️", "gender": "M" },
            { "word": "QUATI", "plural": "QUATIS", "emoji": "🦝", "gender": "M" },
            { "word": "QUINTAL", "plural": "QUINTAIS", "emoji": "🌳", "gender": "M" }
        ]
    },
    "R": {
        "color": "#72efdd",
        "options": [
            { "word": "ROBÔ", "plural": "ROBÔS", "emoji": "🤖", "gender": "M" },
            { "word": "RATO", "plural": "RATOS", "emoji": "🐭", "gender": "M" },
            { "word": "REI", "plural": "REIS", "emoji": "🤴", "gender": "M" },
            { "word": "ROSA", "plural": "ROSAS", "emoji": "🌹", "gender": "F" },
            { "word": "RUA", "plural": "RUAS", "emoji": "🛣️", "gender": "F" }
        ]
    },
    "S": {
        "color": "#fbc490",
        "options": [
            { "word": "SOL", "plural": "SÓIS", "emoji": "☀️", "gender": "M" },
            { "word": "SAPO", "plural": "SAPOS", "emoji": "🐸", "gender": "M" },
            { "word": "SORVETO", "plural": "SORVETES", "emoji": "🍦", "gender": "M" },
            { "word": "SINO", "plural": "SINOS", "emoji": "🔔", "gender": "M" },
            { "word": "SARDINHA", "plural": "SARDINHAS", "emoji": "🐟", "gender": "F" }
        ]
    },
    "T": {
        "color": "#c8b6ff",
        "options": [
            { "word": "TARTARUGA", "plural": "TARTARUGAS", "emoji": "🐢", "gender": "F" },
            { "word": "TOMATE", "plural": "TOMATES", "emoji": "🍅", "gender": "M" },
            { "word": "TORRE", "plural": "TORRES", "emoji": "🗼", "gender": "F" },
            { "word": "TAMBOR", "plural": "TAMBORES", "emoji": "🥁", "gender": "M" },
            { "word": "TROVOADA", "plural": "TROVOADAS", "emoji": "🌩️", "gender": "F" }
        ]
    },
    "U": {
        "color": "#ffd6ff",
        "options": [
            { "word": "ULISSES", "plural": "ULISSES", "emoji": "👦", "gender": "M" },
            { "word": "UVA", "plural": "UVAS", "emoji": "🍇", "gender": "F" },
            { "word": "URSO", "plural": "URSOS", "emoji": "🐻", "gender": "M" },
            { "word": "URUBU", "plural": "URUBUS", "emoji": "🦅", "gender": "M" },
            { "word": "UNICÓRNIO", "plural": "UNICÓRNIOS", "emoji": "🦄", "gender": "M" }
        ]
    },
    "V": {
        "color": "#e8c547",
        "options": [
            { "word": "VACA", "plural": "VACAS", "emoji": "🐮", "gender": "F" },
            { "word": "VASSOURA", "plural": "VASSOURAS", "emoji": "🧹", "gender": "F" },
            { "word": "VIOLÃO", "plural": "VIOLÕES", "emoji": "🎸", "gender": "M" },
            { "word": "VULCÃO", "plural": "VULCÕES", "emoji": "🌋", "gender": "M" },
            { "word": "VENTO", "plural": "VENTOS", "emoji": "🌬️", "gender": "M" }
        ]
    },
    "W": {
        "color": "#e07a5f",
        "options": [
            { "word": "WI-FI", "plural": "WI-FIS", "emoji": "📶", "gender": "M" },
            { "word": "WOK", "plural": "WOKS", "emoji": "🥘", "gender": "M" },
            { "word": "WATT", "plural": "WATTS", "emoji": "⚡", "gender": "M" },
            { "word": "WESLEY", "plural": "WESLEYS", "emoji": "👦", "gender": "M" },
            { "word": "WIKIPÉDIA", "plural": "WIKIPÉDIAS", "emoji": "🌐", "gender": "F" }
        ]
    },
    "X": {
        "color": "#81b29a",
        "options": [
            { "word": "XÍCARA", "plural": "XÍCARAS", "emoji": "☕", "gender": "F" },
            { "word": "XADREZ", "plural": "XADREZES", "emoji": "♟️", "gender": "M" },
            { "word": "XOFA", "plural": "XOFAS", "emoji": "🛋️", "gender": "M" },
            { "word": "XAMPU", "plural": "XAMPUS", "emoji": "🧴", "gender": "M" },
            { "word": "XAROPE", "plural": "XARROPES", "emoji": "🧪", "gender": "M" }
        ]
    },
    "Y": {
        "color": "#f4f1de",
        "options": [
            { "word": "YOGA", "plural": "YOGAS", "emoji": "🧘", "gender": "F" },
            { "word": "YOGURTE", "plural": "YOGURTES", "emoji": "🍶", "gender": "M" },
            { "word": "YASMIN", "plural": "YASMINS", "emoji": "🌸", "gender": "M" },
            { "word": "YARA", "plural": "YARAS", "emoji": "🌺", "gender": "F" },
            { "word": "YUCA", "plural": "YUCAS", "emoji": "🌿", "gender": "F" }
        ]
    },
    "Z": {
        "color": "#cfdbd5",
        "options": [
            { "word": "ZEBRA", "plural": "ZEBRAS", "emoji": "🦓", "gender": "F" },
            { "word": "ZEBU", "plural": "ZEBUS", "emoji": "🐂", "gender": "M" },
            { "word": "ZIG-ZAG", "plural": "ZIG-ZAGS", "emoji": "➰", "gender": "M" },
            { "word": "ZINCO", "plural": "ZINCS", "emoji": "🔩", "gender": "M" },
            { "word": "ZUMBÍ", "plural": "ZUMBIS", "emoji": "🧟", "gender": "M" }
        ]
    }
};

function getLetterOption(letterKey, optionIndex) {
    return LETTERS[letterKey].options[optionIndex];
}

// Sorteia um índice de opção; nunca repete o índice anterior quando há mais de uma opção.
function pickOptionIndex(letterKey, previousIndex, rng) {
    const count = LETTERS[letterKey].options.length;
    const rand = (rng || Math.random)();
    if (count <= 1) {
        return 0;
    }
    const hasValidPrevious = previousIndex !== undefined && previousIndex !== null &&
        previousIndex >= 0 && previousIndex < count;
    if (!hasValidPrevious) {
        return Math.floor(rand * count);
    }
    let idx = Math.floor(rand * (count - 1));
    if (idx >= previousIndex) {
        idx += 1;
    }
    return idx;
}

// Opção 0 usa os mp3s já gravados (audio/m.mp3, audio/3_m.mp3);
// opções novas usam sufixo (audio/m_1.mp3, audio/3_m_1.mp3).
function getLetterAudioFile(letterKey, optionIndex) {
    const letter = letterKey.toLowerCase();
    return optionIndex > 0 ? `audio/${letter}_${optionIndex}.mp3` : `audio/${letter}.mp3`;
}

function getComboAudioFile(count, letterKey, optionIndex) {
    const letter = letterKey.toLowerCase();
    return optionIndex > 0 ? `audio/${count}_${letter}_${optionIndex}.mp3` : `audio/${count}_${letter}.mp3`;
}

function getComboDisplayText(count, letterKey, optionIndex) {
    const option = getLetterOption(letterKey, optionIndex);
    return `${count} ${count === 1 ? option.word : option.plural}`;
}

function getNumberAudioFile(count) {
    return `audio/${count}.mp3`;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NUMBERS,
        LETTERS,
        getLetterOption,
        pickOptionIndex,
        getLetterAudioFile,
        getComboAudioFile,
        getComboDisplayText,
        getNumberAudioFile
    };
}
