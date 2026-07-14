import os
import subprocess
import sys

def install_package(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    import edge_tts
except ImportError:
    install_package("edge-tts")
    import edge_tts

import asyncio

alphabet = {
    '1': '1 de um.',
    '2': '2 de dois.',
    '3': '3 de três.',
    '4': '4 de quatro.',
    '5': '5 de cinco.',
    '6': '6 de seis.',
    '7': '7 de sete.',
    '8': '8 de oito.',
    '9': '9 de nove.',
    '0': '0 de zero.',
    'A': 'A de abelha.',
    'B': 'B de borboleta.',
    'C': 'C de cachorro.',
    'D': 'D de dinossauro.',
    'E': 'E de elefante.',
    'F': 'F de foca.',
    'G': 'G de gato.',
    'H': 'H de hipopótamo.',
    'I': 'I de ilha.',
    'J': 'J de jacaré.',
    'K': 'K de kiwi.',
    'L': 'L de leão.',
    'M': 'M de Melissa.',
    'N': 'N de nuvem.',
    'O': 'O de ovelha.',
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

async def generate():
    audio_dir = "/Users/jefersonsouza/Developments/alfabeto-divertido/audio"
    os.makedirs(audio_dir, exist_ok=True)
    voice = "pt-BR-FranciscaNeural"
    for key, text in alphabet.items():
        output_file = os.path.join(audio_dir, f"{key.lower()}.mp3")
        communicate = edge_tts.Communicate(text, voice, rate="-25%")
        await communicate.save(output_file)

if __name__ == "__main__":
    asyncio.run(generate())
