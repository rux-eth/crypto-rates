"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbRates = void 0;
const immutable_1 = require("immutable");
async function getDbRates(pair, c) {
    var _a, _b;
    const db = c.db('exchange-rates');
    const coll = db.collection(pair.chain);
    const doc = await coll.findOne({
        address: (_a = pair === null || pair === void 0 ? void 0 : pair.address) !== null && _a !== void 0 ? _a : pair.chain,
        baseCurrency: pair.baseCurrency,
    });
    return (0, immutable_1.List)((_b = doc === null || doc === void 0 ? void 0 : doc.prices) !== null && _b !== void 0 ? _b : []);
}
exports.getDbRates = getDbRates;
