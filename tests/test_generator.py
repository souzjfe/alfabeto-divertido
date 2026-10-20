import asyncio
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import generate_audio


class LoadDataTests(unittest.TestCase):
    def test_load_data_parses_data_js(self):
        numbers, letters = generate_audio.load_data()
        self.assertEqual(len(numbers), 10)
        self.assertEqual(len(letters), 26)
        for letter, data in letters.items():
            self.assertGreaterEqual(len(data['options']), 5, 'letra %s com menos de 5 opções' % letter)
            for option in data['options']:
                for field in ('word', 'plural', 'emoji', 'gender'):
                    self.assertIn(field, option, '%s sem campo %s' % (letter, field))
                self.assertIn(option['gender'], ('M', 'F'))


class ManifestTests(unittest.TestCase):
    def test_manifest_has_every_expected_file(self):
        names = [e['filename'] for e in generate_audio.build_entries()]
        # 10 números + warning + (24 letras × 5 opções + B e I × 6 opções) × (1 letra + 10 combinações)
        self.assertEqual(len(names), 1463)
        self.assertEqual(len(set(names)), len(names), 'manifesto com arquivos duplicados')
        for expected in ('0.mp3', '7.mp3', 'warning.mp3', 'm.mp3', '0_a.mp3', '3_m_2.mp3', '9_z_4.mp3',
                         'b_5.mp3', 'i_5.mp3', '9_b_5.mp3', '9_i_5.mp3'):
            self.assertIn(expected, names)

    def test_manifest_texts_match_spec(self):
        entries = {e['filename']: e['text'] for e in generate_audio.build_entries()}
        self.assertEqual(entries['1.mp3'], 'Um.')
        self.assertEqual(entries['warning.mp3'], 'Aperte uma letra ou número!')
        self.assertEqual(entries['m.mp3'], 'M de Melissa.')
        self.assertEqual(entries['p_1.mp3'], 'P de Pedro.')
        self.assertEqual(entries['1_p_1.mp3'], 'Um Pedro.')
        self.assertEqual(entries['2_a_1.mp3'], 'Duas Antonelas.')
        self.assertEqual(entries['1_a_1.mp3'], 'Uma Antonela.')
        self.assertEqual(entries['3_p_2.mp3'], 'Três Patrícias.')
        self.assertEqual(entries['3_p_1.mp3'], 'Três Pedros.')
        self.assertEqual(entries['0_m.mp3'], 'Zero Melissas.')
        self.assertEqual(entries['2_l.mp3'], 'Dois Leões.')
        self.assertEqual(entries['b_5.mp3'], 'B de Benício.')
        self.assertEqual(entries['i_5.mp3'], 'I de Isis.')
        self.assertEqual(entries['1_i_5.mp3'], 'Uma Isis.')
        self.assertEqual(entries['2_b_5.mp3'], 'Dois Benícios.')

    def test_manifest_is_deterministic(self):
        self.assertEqual(generate_audio.build_entries(), generate_audio.build_entries())

    def test_list_files_cli_matches_manifest(self):
        proc = subprocess.run(
            [sys.executable, generate_audio.__file__, '--list-files'],
            capture_output=True, text=True
        )
        self.assertEqual(proc.returncode, 0, proc.stderr)
        listed = json.loads(proc.stdout)
        self.assertEqual(listed, [e['filename'] for e in generate_audio.build_entries()])


class GenerationTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.saved = []

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def _fake_save(self, fail_on=None):
        async def save(text, path):
            if fail_on and os.path.basename(path) == fail_on:
                open(path, 'w').close()  # simula o arquivo parcial que o edge-tts deixa para trás
                raise RuntimeError('síntese indisponível')
            self.saved.append(os.path.basename(path))
            with open(path, 'w') as fh:
                fh.write(text)
        return save

    def test_skips_existing_files(self):
        entries = generate_audio.build_entries()
        for name in ('1.mp3', 'm.mp3'):
            open(os.path.join(self.tmp, name), 'w').close()
        result = asyncio.run(generate_audio.generate_entries(entries, self.tmp, save_fn=self._fake_save()))
        self.assertEqual(result['failed'], [])
        self.assertEqual(result['skipped'], 2)
        self.assertEqual(result['created'], len(entries) - 2)
        self.assertEqual(generate_audio.exit_code(result), 0)
        self.assertNotIn('m.mp3', self.saved, 'arquivo legado não deve ser regenerado')

    def test_force_regenerates_everything(self):
        entries = generate_audio.build_entries()
        open(os.path.join(self.tmp, '1.mp3'), 'w').close()
        result = asyncio.run(
            generate_audio.generate_entries(entries, self.tmp, force=True, save_fn=self._fake_save()))
        self.assertEqual(result['skipped'], 0)
        self.assertEqual(result['created'], len(entries))

    def test_failure_is_reported_and_does_not_stop_others(self):
        entries = generate_audio.build_entries()
        result = asyncio.run(generate_audio.generate_entries(
            entries, self.tmp, save_fn=self._fake_save(fail_on='3_m_2.mp3')))
        self.assertEqual([f['filename'] for f in result['failed']], ['3_m_2.mp3'])
        self.assertIn('síntese indisponível', result['failed'][0]['error'])
        self.assertEqual(result['created'], len(entries) - 1)
        self.assertEqual(generate_audio.exit_code(result), 1)
        self.assertFalse(
            os.path.exists(os.path.join(self.tmp, '3_m_2.mp3')),
            'arquivo parcial vazio deve ser removido')


class VoiceTests(unittest.TestCase):
    def test_voice_and_rate_preserved(self):
        self.assertEqual(generate_audio.VOICE, 'pt-BR-FranciscaNeural')
        self.assertEqual(generate_audio.RATE, '-25%')


if __name__ == '__main__':
    unittest.main()
