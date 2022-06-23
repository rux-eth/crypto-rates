"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = require("bluebird");
const pair_1 = require("./pair");
async function getExchangeRates(query, key) {
    let pairs = await (0, pair_1.initializePairs)(query);
    await bluebird_1.Promise.all(pairs.valueSeq().map(async (pair) => await pair.fetchRates()));
    const final = query.map((val) => {
        var _a;
        return {
            query: val,
            rates: (_a = val === null || val === void 0 ? void 0 : val.timestamps.map((ts) => {
                var _a, _b;
                return ({
                    timestamp: ts,
                    rate: (_b = (_a = pairs.get(val.id)) === null || _a === void 0 ? void 0 : _a.getRate(ts)) !== null && _b !== void 0 ? _b : -1,
                });
            })) !== null && _a !== void 0 ? _a : [-1],
        };
    });
    return final;
}
exports.default = getExchangeRates;
