import {expect} from 'chai';
import {AndroidBinary} from '../src/parser/common/AndroidBinaryResourceUtils.js';

describe('Android resource strings', function () {
    it('preserves an empty string pool entry', function () {
        const pool = new AndroidBinary.ResStringPool(new AndroidBinary.ResChunkHeader());
        pool.strings = ['', 'name'];
        const value = new AndroidBinary.ResValue();
        value.dataType = AndroidBinary.ValueType.STRING;
        value.data = 0;
        expect(AndroidBinary.Utils.getResourceValue(value, pool)).to.equal('');
        value.data = 1;
        expect(AndroidBinary.Utils.getResourceValue(value, pool)).to.equal('name');
    });

    it('retains fallback behavior for an absent pool or missing entry', function () {
        const value = new AndroidBinary.ResValue();
        value.dataType = AndroidBinary.ValueType.STRING;
        value.data = 3;
        expect(AndroidBinary.Utils.getResourceValue(value)).to.equal('string_3');
        const pool = new AndroidBinary.ResStringPool(new AndroidBinary.ResChunkHeader());
        expect(AndroidBinary.Utils.getResourceValue(value, pool)).to.equal('string_3');
    });
});
