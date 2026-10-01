import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const launcher = fileURLToPath(new URL('../scripts/run_os_script.mjs', import.meta.url));

test('OS launcher decodes paths and preserves arguments and child status', () => {
    const root = mkdtempSync(join(tmpdir(), 'dexcalibur launcher '));
    try {
        const runner = join(root, 'scripts with spaces #', 'run_os_script.mjs');
        mkdirSync(join(dirname(runner), 'os_scripts'), { recursive: true });
        copyFileSync(launcher, runner);
        writeFileSync(join(dirname(runner), 'os_scripts', `${platform()}.fixture.js`),
            'console.log(JSON.stringify(process.argv.slice(2))); process.exit(7);');
        const args = ['space in argument', 'literal & value', '#fragment'];
        const result = spawnSync(process.execPath, [runner, 'fixture', ...args], { encoding: 'utf8' });
        assert.equal(result.error, undefined);
        assert.equal(result.status, 7, result.stderr);
        assert.ok(result.stdout.includes(JSON.stringify(args)), result.stdout);

        const missing = spawnSync(process.execPath, [runner, 'missing'], { encoding: 'utf8' });
        assert.equal(missing.status, 1);
        assert.match(missing.stdout, /Script not found/);
    } finally {
        rmSync(root, { recursive: true, force: true });
    }
});
