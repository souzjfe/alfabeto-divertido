#!/usr/bin/env python3
"""Gera os mp3s do Alfabeto Divertido a partir de data.js (fonte única de dados).

Uso:
    python3 generate_audio.py               # gera só os arquivos que faltam (idempotente)
    python3 generate_audio.py --force       # regenera todos os arquivos
    python3 generate_audio.py --list-files  # imprime o manifesto (JSON) sem tocar na rede
"""

import argparse
import asyncio
import json
import os
import re
import sys

try:
    import edge_tts
except ImportError:
    import subprocess
    # >=7.3.1: versões antigas recebem 403 do serviço de síntese da Microsoft.
    subprocess.check_call([sys.executable, "-m", "pip", "install", "edge-tts>=7.3.1"])
    import edge_tts

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_JS = os.path.join(BASE_DIR, "data.js")
AUDIO_DIR = os.path.join(BASE_DIR, "audio")

VOICE = "pt-BR-FranciscaNeural"
RATE = "-25%"
CONCURRENCY = 15

WARNING_TEXT = "Aperte uma letra ou número!"
NUM_WORDS = {3: 'Três', 4: 'Quatro', 5: 'Cinco', 6: 'Seis', 7: 'Sete', 8: 'Oito', 9: 'Nove'}


def _extract_const(name, source):
    match = re.search(r'const\s+%s\s*=\s*(\{.*?\n\});' % name, source, re.S)
    if not match:
        raise ValueError("const %s não encontrada em data.js" % name)
    return json.loads(match.group(1))


def load_data(path=DATA_JS):
    """Lê NUMBERS e LETTERS do data.js (os objetos são JSON válido)."""
    with open(path, encoding='utf-8') as fh:
        source = fh.read()
    return _extract_const('NUMBERS', source), _extract_const('LETTERS', source)


def _letter_filename(letter, index):
    base = letter.lower()
    return "%s.mp3" % base if index == 0 else "%s_%d.mp3" % (base, index)


def _combo_filename(count, letter, index):
    base = letter.lower()
    return "%d_%s.mp3" % (count, base) if index == 0 else "%d_%s_%d.mp3" % (count, base, index)


def combo_text(count, option):
    word = option['word'].title()
    plural = option['plural'].title()
    if count == 1:
        article = 'Uma' if option['gender'] == 'F' else 'Um'
        return "%s %s." % (article, word)
    if count == 0:
        return "Zero %s." % plural
    if count == 2:
        article = 'Duas' if option['gender'] == 'F' else 'Dois'
        return "%s %s." % (article, plural)
    return "%s %s." % (NUM_WORDS[count], plural)


def build_entries(numbers=None, letters=None):
    """Manifesto determinístico: [{filename, text}, ...] na ordem de data.js."""
    if numbers is None or letters is None:
        numbers, letters = load_data()
    entries = []
    for digit, item in numbers.items():
        entries.append({'filename': "%s.mp3" % digit, 'text': item['spoken']})
    entries.append({'filename': 'warning.mp3', 'text': WARNING_TEXT})
    for letter, letter_data in letters.items():
        for index, option in enumerate(letter_data['options']):
            entries.append({
                'filename': _letter_filename(letter, index),
                'text': "%s de %s." % (letter, option['word'].title())
            })
            for count in range(10):
                entries.append({
                    'filename': _combo_filename(count, letter, index),
                    'text': combo_text(count, option)
                })
    return entries


async def edge_save(text, path):
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(path)


async def generate_entries(entries, audio_dir=AUDIO_DIR, force=False, save_fn=None):
    """Gera os arquivos; uma falha nunca interrompe os demais (SPEECH-13)."""
    if save_fn is None:
        save_fn = edge_save
    os.makedirs(audio_dir, exist_ok=True)
    sem = asyncio.Semaphore(CONCURRENCY)
    result = {'created': 0, 'skipped': 0, 'failed': []}

    async def run_one(entry):
        path = os.path.join(audio_dir, entry['filename'])
        if os.path.exists(path) and not force:
            result['skipped'] += 1
            return
        try:
            async with sem:
                await save_fn(entry['text'], path)
            result['created'] += 1
        except Exception as exc:
            if os.path.exists(path) and os.path.getsize(path) == 0:
                os.remove(path)
            result['failed'].append({'filename': entry['filename'], 'error': str(exc)})

    await asyncio.gather(*(run_one(entry) for entry in entries))
    return result


def exit_code(result):
    return 1 if result['failed'] else 0


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--force', action='store_true', help='regenera até os arquivos que já existem')
    parser.add_argument('--list-files', action='store_true', help='imprime o manifesto JSON e sai')
    parser.add_argument('--audio-dir', default=AUDIO_DIR, help='diretório de saída (padrão: audio/)')
    args = parser.parse_args(argv)

    numbers, letters = load_data()
    entries = build_entries(numbers, letters)

    if args.list_files:
        print(json.dumps([entry['filename'] for entry in entries], ensure_ascii=False))
        return 0

    result = asyncio.run(generate_entries(entries, args.audio_dir, args.force))
    print("Gerados: %d | Pulados (já existiam): %d | Falhas: %d" % (
        result['created'], result['skipped'], len(result['failed'])))
    for failure in result['failed']:
        print("  FALHA %s: %s" % (failure['filename'], failure['error']), file=sys.stderr)
    return exit_code(result)


if __name__ == '__main__':
    raise SystemExit(main())
