import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import yaml from 'js-yaml';

const workflow = yaml.load(readFileSync(new URL('../.github/workflows/CI.yml', import.meta.url), 'utf8'));

test('release download pattern selects the platform artifacts produced by build', () => {
    const download = workflow.jobs.release_upload.steps.find(step => step.uses === 'actions/download-artifact@v4').with;
    const uploads = workflow.jobs.build.steps.filter(step => step.uses === 'actions/upload-artifact@v4' && step.with.name.startsWith('dxc-platform-'));
    assert.equal(uploads.length, 2);
    assert.equal(download.pattern, 'dxc-platform-*.tar.gz');
    assert.equal(download['merge-multiple'], true);
    assert.equal(download.path, 'out/');
    const upload = workflow.jobs.release_upload.steps.find(step => step.run).run;
    assert.match(upload, /\.\/out\/dxc-platform-ubuntu-latest\.\*\.tar\.gz/);
    for (const step of uploads) {
        assert.match(step.with.name, /^dxc-platform-.*\.(node|deno)\.tar\.gz$/);
    }
});

test('Docker context belongs to the checkout in the Docker job', () => {
    const steps = workflow.jobs.docker.steps;
    const checkout = steps.find(step => step.uses === 'actions/checkout@v4').with;
    const build = steps.find(step => step.uses === 'docker/build-push-action@v6').with;
    assert.equal(build.context, `./${checkout.path}`);
    assert.ok(build.file.startsWith(`${build.context}/`));
});
