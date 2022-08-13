"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBasePair = exports.formatTimestamps = exports.findRate = exports.hr2ms = void 0;
const immutable_1 = require("immutable");
function hr2ms(hrs) {
    return hrs * (3.6 * Math.pow(10, 6));
}
exports.hr2ms = hr2ms;
function findRate(n, h, needle = n.sort((a, b) => a - b), haystack = h.sort((a, b) => a[0] - b[0])) {
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
function formatTimestamps(t, ts = t.sort((a, b) => a - b)) {
    if (ts.count() === 0)
        throw { status: 400, message: 'No Timestamps Provided' };
    const formatTuple = (start, end) => {
        const halves = (hr2ms(90 * 24) - (end - start)) >>> 1;
        const ss = start - halves;
        const es = end + halves;
        return [ss > 0 ? ss : 0, es > 0 ? es : 0];
    };
    if (ts.count() === 1)
        return (0, immutable_1.List)([formatTuple(ts.get(0), ts.get(0))]);
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
    var _a;
    return {
        chain: o.chain.toLowerCase(),
        baseCurrency: o.baseCurrency.toLowerCase(),
        address: (_a = o.address) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
    };
}
exports.toBasePair = toBasePair;
