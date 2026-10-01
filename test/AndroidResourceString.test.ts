import {expect} from 'chai';
import {AndroidBinary} from '../src/parser/common/AndroidBinaryResourceUtils.js';
import {AndroidBinary as DocumentAndroidBinary} from '../src/android/AndroidBinaryResourceUtils.js';

for (const implementation of [AndroidBinary, DocumentAndroidBinary]) {
describe('Android resource strings', function () {
    it('preserves an empty string pool entry', function () {
        const pool = new implementation.ResStringPool(new implementation.ResChunkHeader());
        pool.strings = ['', 'name'];
        const value = new implementation.ResValue();
        value.dataType = AndroidBinary.ValueType.STRING;
        value.data = 0;
        expect(implementation.Utils.getResourceValue(value, pool)).to.equal('');
        value.data = 1;
        expect(implementation.Utils.getResourceValue(value, pool)).to.equal('name');
    });

    it('retains fallback behavior for an absent pool or missing entry', function () {
        const value = new implementation.ResValue();
        value.dataType = AndroidBinary.ValueType.STRING;
        value.data = 3;
        expect(implementation.Utils.getResourceValue(value)).to.equal('string_3');
        const pool = new implementation.ResStringPool(new implementation.ResChunkHeader());
        expect(implementation.Utils.getResourceValue(value, pool)).to.equal('string_3');
    });
});
}
