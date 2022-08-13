import { List, Map as IMap } from 'immutable';
import { BasePair, IRate, Timestamp, TimestampTuple } from '../types';

export function hr2ms(hrs: number): number {
    return hrs * (3.6 * Math.pow(10, 6));
}
export function findRate(
    n: List<Timestamp>,
    h: List<TimestampTuple>,
    needle = n.sort((a, b) => a - b),
    haystack = h.sort((a, b) => a[0] - b[0])
): IRate {
    const quickSearch = (target: Timestamp): number => {
        const index: number = haystack.findIndex((val: TimestampTuple) => {
            const min = val[0] - hr2ms(0.5);
            const max = val[0] + hr2ms(0.5);
            const ts = target;
            return ts >= min && ts <= max;
        });
        return index === -1 ? index : haystack.get(index)![1];
    };
    let temp: IRate = IMap();
    for (let i = 0; i < needle.count(); i++) {
        const ts = needle.get(i)!;
        const price = haystack.count() < 1 ? -1 : quickSearch(ts);
        temp = temp.set(ts, price);
    }
    return temp;
}
export function formatTimestamps(
    t: List<Timestamp>,
    ts = t.sort((a, b) => a - b)
): List<TimestampTuple> {
    if (ts.count() === 0) throw { status: 400, message: 'No Timestamps Provided' };
    const formatTuple = (start: Timestamp, end: Timestamp): TimestampTuple => {
        const halves: Timestamp = (hr2ms(90 * 24) - (end - start)) >>> 1;
        const ss: Timestamp = start - halves;
        const es: Timestamp = end + halves;

        return [ss > 0 ? ss : 0, es > 0 ? es : 0];
    };
    if (ts.count() === 1) return List([formatTuple(ts.get(0)!, ts.get(0)!)]);

    let last: Timestamp = ts.get(0)!;
    let all: TimestampTuple[] = [];
    for (let i = 0; i < ts.count() - 1; i++) {
        const current: Timestamp = ts.get(i)!;
        const next: Timestamp = ts.get(i + 1)!;
        if (current + hr2ms(90 * 24) < next) {
            all.push(formatTuple(last, current));
            last = next;
        }
    }
    if (last !== ts.last()) all.push(formatTuple(last, ts.last()));
    return List(all);
}
export function toBasePair<T extends BasePair>(o: T): BasePair {
    return <BasePair>{
        chain: o.chain,
        baseCurrency: o.baseCurrency,
        address: o.address,
    };
}
