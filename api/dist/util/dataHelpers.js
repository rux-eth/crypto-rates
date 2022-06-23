"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignRates = exports.combinePairs = exports.convertToPair = exports.equalTo = exports.findRate = exports.hr2ms = void 0;
const immutable_1 = require("immutable");
function hr2ms(hrs) {
    return hrs * (3.6 * Math.pow(10, 6));
}
exports.hr2ms = hr2ms;
function findRate(needle, haystack) {
    const quickSearch = (target) => {
        const index = haystack.findIndex((val) => {
            const min = val[0] - hr2ms(0.5);
            const max = val[0] + hr2ms(0.5);
            const ts = target;
            return ts >= min && ts <= max;
        });
        return index === -1 ? index : haystack.get(index)[1];
    };
    let temp = (0, immutable_1.Map)();
    for (let i = 0; i < needle.count(); i++) {
        temp = temp.set(needle.get(i), haystack.count() < 1 ? -1 : quickSearch(needle.get(i)));
    }
    return temp;
}
exports.findRate = findRate;
function equalTo(p1, p2) {
    return (p1.chain === p2.chain && p1.address === p2.address && p1.baseCurrency === p2.baseCurrency);
}
exports.equalTo = equalTo;
function convertToPair(p) {
    return {
        chain: p.chain,
        baseCurrency: p.baseCurrency,
        address: p.address,
    };
}
exports.convertToPair = convertToPair;
function combinePairs(q) {
    let temp = (0, immutable_1.Map)();
    q.ratesQuery.forEach((val) => {
        const p = (0, immutable_1.Map)(convertToPair(val));
        temp = temp.set(p, temp.get(p, (0, immutable_1.List)([])).concat(...val.timestamp));
    });
    return temp;
}
exports.combinePairs = combinePairs;
function assignRates(q, rates) {
    return q.ratesQuery.map((val) => {
        const p = (0, immutable_1.Map)(convertToPair(val));
        return {
            id: val.id,
            query: val,
            rates: val.timestamp.map((ts) => {
                var _a;
                return {
                    timestamp: ts,
                    price: (_a = rates.getIn([p, ts])) !== null && _a !== void 0 ? _a : -1,
                };
            }),
        };
    });
}
exports.assignRates = assignRates;
/* export function combineTimestamps(stamps: Timestamp[], spread: Timestamp): TimestampTuple[] {

} */
/*
function formatTimestamps(
    t: List<Timestamp> | Timestamp,
    timestamps: List<Timestamp> = isList(t) ? t.sort((a, b) => a + b) : List([t])
): List<[Timestamp, Timestamp]> {
    if (timestamps.count() === 1)
        return List([[timestamps.get(0) - hr2ms(24 * 45), timestamps.get(0) + hr2ms(24 * 45)]]);
    const splits: [Timestamp, Timestamp][] = [];
    while (timestamps.count() > 0) {
        const stamps: List<Timestamp> = timestamps.takeUntil(
            (val, index) => val - hr2ms(45 * 24) > timestamps.get(index + 1)
        );
        const min: Timestamp = stamps.min() - hr2ms(24 * 45);
        const max: Timestamp = stamps.max() + hr2ms(24 * 45);
        splits.push([min < 0 ? 0 : min, max > Date.now() ? Date.now() : max]);
        timestamps = timestamps.slice(stamps.count());
    }
    return List(splits);
} */
