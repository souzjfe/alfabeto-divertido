import os
import subprocess
import sys
import asyncio

def install_package(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    import edge_tts
except ImportError:
    install_package("edge-tts")
    import edge_tts

alphabet = {
    '1': 'Um.',
    '2': 'Dois.',
    '3': 'Três.',
    '4': 'Quatro.',
    '5': 'Cinco.',
    '6': 'Seis.',
    '7': 'Sete.',
    '8': 'Oito.',
    '9': 'Nove.',
    '0': 'Zero.',
    'A': 'A de abelha.',
    'B': 'B de borboleta.',
    'C': 'C de cachorro.',
    'D': 'D de dinossauro.',
    'E': 'E de elefante.',
    'F': 'F de flor.',
    'G': 'G de gato.',
    'H': 'H de hipopótamo.',
    'I': 'I de ilha.',
    'J': 'J de jacaré.',
    'K': 'K de kiwi.',
    'L': 'L de leão.',
    'M': 'M de Melissa.',
    'N': 'N de nuvem.',
    'O': 'Ó de ovelha.',
    'P': 'P de peixe.',
    'Q': 'Q de queijo.',
    'R': 'R de robô.',
    'S': 'S de sol.',
    'T': 'T de tartaruga.',
    'U': 'U de Ulisses.',
    'V': 'V de vaca.',
    'W': 'W de wi-fi.',
    'X': 'X de xícara.',
    'Y': 'Y de yoga.',
    'Z': 'Z de zebra.',
    'WARNING': 'Aperte uma letra ou número!'
}

items_info = {
    'A': {'singular': 'abelha', 'plural': 'abelhas', 'gender': 'F'},
    'B': {'singular': 'borboleta', 'plural': 'borboletas', 'gender': 'F'},
    'C': {'singular': 'cachorro', 'plural': 'cachorros', 'gender': 'M'},
    'D': {'singular': 'dinossauro', 'gender': 'M'},
    'E': {'singular': 'elefante', 'gender': 'M'},
    'F': {'singular': 'flor', 'plural': 'flores', 'gender': 'F'},
    'G': {'singular': 'gato', 'gender': 'M'},
    'H': {'singular': 'hipopótamo', 'gender': 'M'},
    'I': {'singular': 'ilha', 'gender': 'F'},
    'J': {'singular': 'jacaré', 'gender': 'M'},
    'K': {'singular': 'kiwi', 'gender': 'M'},
    'L': {'singular': 'leão', 'plural': 'leões', 'gender': 'M'},
    'M': {'singular': 'Melissa', 'plural': 'Melissas', 'gender': 'F'},
    'N': {'singular': 'nuvem', 'plural': 'nuvens', 'gender': 'F'},
    'O': {'singular': 'ovelha', 'gender': 'F'},
    'P': {'singular': 'peixe', 'gender': 'M'},
    'Q': {'singular': 'queijo', 'gender': 'M'},
    'R': {'singular': 'robô', 'gender': 'M'},
    'S': {'singular': 'sol', 'plural': 'sóis', 'gender': 'M'},
    'T': {'singular': 'tartaruga', 'gender': 'F'},
    'U': {'singular': 'Ulisses', 'plural': 'Ulisses', 'gender': 'M'},
    'V': {'singular': 'vaca', 'gender': 'F'},
    'W': {'singular': 'wi-fi', 'plural': 'wi-fis', 'gender': 'M'},
    'X': {'singular': 'xícara', 'gender': 'F'},
    'Y': {'singular': 'yoga', 'gender': 'F'},
    'Z': {'singular': 'zebra', 'gender': 'F'},
}

num_words = {
    3: 'Três',
    4: 'Quatro',
    5: 'Cinco',
    6: 'Seis',
    7: 'Sete',
    8: 'Oito',
    9: 'Nove'
}

async def save_audio(sem, text, voice, path):
    async with sem:
        communicate = edge_tts.Communicate(text, voice, rate="-25%")
        await communicate.save(path)

async def generate():
    audio_dir = "/Users/jefersonsouza/Developments/alfabeto-divertido/audio"
    os.makedirs(audio_dir, exist_ok=True)
    voice = "pt-BR-FranciscaNeural"
    sem = asyncio.Semaphore(15)
    tasks = []

    for key, text in alphabet.items():
        output_file = os.path.join(audio_dir, f"{key.lower()}.mp3")
        tasks.append(save_audio(sem, text, voice, output_file))

    for l_key, info in items_info.items():
        singular = info['singular']
        plural = info.get('plural', singular + 's')
        gender = info['gender']
        
        for num in range(10):
            if num == 0:
                text = f"Zero {plural}."
            elif num == 1:
                word = "Uma" if gender == 'F' else "Um"
                text = f"{word} {singular}."
            elif num == 2:
                word = "Duas" if gender == 'F' else "Dois"
                text = f"{word} {plural}."
            else:
                text = f"{num_words[num]} {plural}."
            
            filename = f"{num}_{l_key.lower()}.mp3"
            output_file = os.path.join(audio_dir, filename)
            tasks.append(save_audio(sem, text, voice, output_file))

    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(generate())
