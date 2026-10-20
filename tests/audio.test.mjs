import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import data from '../data.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function expectedManifest() {
    const files = [];
    for (const digit of Object.keys(data.NUMBERS)) files.push(`audio/${digit}.mp3`);
    files.push('audio/warning.mp3');
    for (const [letter, letterData] of Object.entries(data.LETTERS)) {
        letterData.options.forEach((_, index) => {
            files.push(data.getLetterAudioFile(letter, index));
            for (let count = 0; count <= 9; count++) {
                files.push(data.getComboAudioFile(count, letter, index));
            }
        });
    }
    return files;
}

test('SPEECH-12: o manifesto do gerador bate com os arquivos esperados pelo app', () => {
    const stdout = execFileSync('python3', ['generate_audio.py', '--list-files'], { cwd: root, encoding: 'utf8' });
    const generated = JSON.parse(stdout).map(f => `audio/${f}`);
    assert.deepEqual(generated, expectedManifest());
});

test('SPEECH-12/14: todos os mp3s do manifesto existem em audio/', () => {
    const missing = expectedManifest().filter(f => !fs.existsSync(path.join(root, f)));
    assert.deepEqual(missing, [], `mp3s ausentes: ${missing.slice(0, 10).join(', ')} (${missing.length} no total)`);
});
