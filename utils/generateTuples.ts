import { List } from 'immutable';
import { hr2ms } from '../src/exchangeRates/util/dataHelpers';
import { Timestamp, TimestampTuple } from '../src/types';
export default function generateTuples(
    nums: number,
    startTS: Timestamp
): List<[Timestamp, number]> {
    const temp: TimestampTuple[] = [];
    for (let i = 0; i < nums; i++) {
        temp.push([startTS + hr2ms(1) * i, Math.random()]);
    }
    return List(temp);
}
