import {expect} from 'chai';
import {DexStructures} from '../src/android/DexStructures.js';

describe('DEX wide literals', function () {
    it('preserves all 64 bits and signed long interpretation', function () {
        const decoder = new DexStructures.DalvikBytecodeDecoder();
        for (const value of [0n, 2147483648n, 4294967295n, 9223372036854775807n, -1n, -4294967296n, -9223372036854775808n]) {
            const bits = BigInt.asUintN(64, value);
            const words = [0x0318];
            for (let shift = 0n; shift < 64n; shift += 16n) {
                words.push(Number((bits >> shift) & 0xffffn));
            }
            const [instruction] = decoder.decode(words);
            expect(instruction.size).to.equal(5);
            expect(instruction.operands).to.deep.equal([{type: 'register', value: 3}, value]);
        }
    });
});
