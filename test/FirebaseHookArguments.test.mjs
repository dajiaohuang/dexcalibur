import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = ts.createSourceFile('main.ts', readFileSync(new URL('../inspectors/Firebase/main.ts', import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true);
const snippets = new Map();
function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
        const fields = new Map(node.properties.filter(ts.isPropertyAssignment).map(p => [p.name.getText(source), p.initializer]));
        if (fields.has('name') && fields.has('before')) snippets.set(fields.get('name').text, fields.get('before').text);
    }
    ts.forEachChild(node, visit);
}
visit(source);

function invoke(name, args) {
    const snippet = snippets.get(name);
    assert.equal(typeof snippet, 'string');
    const output = [];
    const code = ts.transpileModule(snippet, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
    const hook = new Function('DXC', 'printTest', `return function () { ${code} };`)({ send: (...values) => output.push(values[2]) }, () => {});
    hook(...args);
    return output;
}

test('Firebase hooks read real function arguments without aborting the intercepted call', () => {
    const value = { document: 'sample' };
    assert.deepEqual(invoke('Firestore Get instance', [value, 'secondary']), [{ arg0: value, arg1: 'secondary' }]);
    assert.deepEqual(invoke('Firestore', ['document-id']), [{ arg0: 'document-id' }]);
    assert.deepEqual(invoke('Firestore Add document', [value]), [{ msg: value }]);
});
