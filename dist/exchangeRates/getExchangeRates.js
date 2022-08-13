"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExchangeRates = void 0;
const pair_1 = require("./pair");
async function getExchangeRates(query, key) {
    let pairs = await (0, pair_1.initializePairs)(query);
    await Promise.all(pairs
        .valueSeq()
        .filter((pair, index, arr) => arr.indexOf(pair) === index)
        .map(async (pair) => {
        pair = await pair.fetchRates();
    }));
    const final = query.map((val) => {
        return {
            query: val,
            rates: val.timestamp.map((ts) => {
                var _a, _b;
                return { timestamp: ts, rate: (_b = (_a = pairs.get(val.id)) === null || _a === void 0 ? void 0 : _a.getRate(ts)) !== null && _b !== void 0 ? _b : -1 };
            }),
        };
    });
    return final;
}
exports.getExchangeRates = getExchangeRates;
