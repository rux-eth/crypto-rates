// @ts-nocheck
import { List } from 'immutable';
import { findRate, hr2ms } from '../src/exchangeRates/util/dataHelpers';
import { Timestamp } from '../src/types';
import generateTuples from '../utils/generateTuples';
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
describe('findRate', () => {
    const tsNums: number = 20;
    let testTuples: List<[Timestamp, number]>;
    let max: [Timestamp, number];
    let min: [Timestamp, number];

    beforeAll(() => {
        testTuples = generateTuples(tsNums, Date.now() - hr2ms(tsNums)).sortBy((_, key) => key);
        max = testTuples.maxBy((val) => val[0]) as [Timestamp, number];
        min = testTuples.minBy((val) => val[0]) as [Timestamp, number];
        console.log(max);
    });
    describe('IOOB', () => {
        it('High', () => {
            const target: Timestamp = max[0] + hr2ms(0.5) + 1;
            const exp: [Timestamp, number] = [target, -1];
            const rate: [Timestamp, number] = findRate(List([target]), testTuples).toArray()[0];
            expect(rate).toStrictEqual(exp);
        });
        it('Low', () => {
            const target: Timestamp = min[0] - hr2ms(0.5) - 1;
            const exp: [Timestamp, number] = [target, -1];
            const rate: [Timestamp, number] = findRate(List([target]), testTuples).toArray()[0];
            expect(rate).toStrictEqual(exp);
        });
    });
    describe('Index in bounds at end', () => {
        it('High', () => {
            const target: Timestamp = max[0] + hr2ms(0.5);
            const exp: [Timestamp, number] = [target, max[1]];
            const rate: [Timestamp, number] = findRate(List([target]), testTuples).toArray()[0];
            expect(rate).toStrictEqual(exp);
        });
        it('Low', () => {
            const target: Timestamp = min[0] - hr2ms(0.5);
            const exp: [Timestamp, number] = [target, min[1]];
            const rate: [Timestamp, number] = findRate(List([target]), testTuples).toArray()[0];
            expect(rate).toStrictEqual(exp);
        });
    });
    describe('edges', () => {
        for (let i = 0; i < 10; i++) {
            let randIndex: number = getRandomInt(0, 19);
            it(`Max #${i}`, () => {
                const ts = testTuples.get(randIndex)![0];
                const target: number = ts + hr2ms(getRandomInt(1, 5000) / 10000);
                const exp: [Timestamp, number] = [target, testTuples.get(randIndex)![1]];
                const rate: [Timestamp, number] = findRate(List([target]), testTuples).toArray()[0];
                expect(rate).toStrictEqual(exp);
            });
            it(`Min #${i}`, () => {
                const ts = testTuples.get(randIndex)![0];
                const target: number = ts - hr2ms(getRandomInt(1, 5000) / 10000);
                const exp: [Timestamp, number] = [target, testTuples.get(randIndex)![1]];
                const rate: [Timestamp, number] = findRate(List([target]), testTuples).toArray()[0];

                expect(rate).toStrictEqual(exp);
            });
        }
    });
});
