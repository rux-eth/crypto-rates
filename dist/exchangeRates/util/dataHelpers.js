"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBasePair = exports.formatTimestamps = exports.findRate = exports.hr2ms = void 0;
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
        const ts = needle.get(i);
        const price = haystack.count() < 1 ? -1 : quickSearch(ts);
        temp = temp.set(ts, price);
    }
    return temp;
}
exports.findRate = findRate;
function formatTimestamps(ts) {
    if (ts.count() < 2)
        return (0, immutable_1.List)([
            [
                ts.get(0, -hr2ms(45 * 24)) - hr2ms(45 * 24),
                ts.get(0, -hr2ms(45 * 24)) + hr2ms(45 * 24),
            ],
        ]);
    const formatTuple = (start, end) => {
        const halves = (hr2ms(90 * 24) - (end - start)) >>> 1;
        return [start - halves, end + halves];
    };
    let last = ts.get(0);
    let all = [];
    for (let i = 0; i < ts.count() - 1; i++) {
        const current = ts.get(i);
        const next = ts.get(i + 1);
        if (current + hr2ms(90 * 24) < next) {
            all.push(formatTuple(last, current));
            last = next;
        }
    }
    if (last !== ts.last())
        all.push(formatTuple(last, ts.last()));
    return (0, immutable_1.List)(all);
}
exports.formatTimestamps = formatTimestamps;
function toBasePair(o) {
    return {
        chain: o.chain,
        baseCurrency: o.baseCurrency,
        address: o.address,
    };
}
exports.toBasePair = toBasePair;
