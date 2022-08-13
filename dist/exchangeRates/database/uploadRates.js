"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRates = void 0;
const immutable_1 = require("immutable");
async function uploadRates(pair, prices, c, coll = c.db('exchange-rates').collection(pair.chain)) {
    var _a;
    const query = {
        address: (_a = pair === null || pair === void 0 ? void 0 : pair.address) !== null && _a !== void 0 ? _a : pair.chain,
        chain: pair.chain,
        baseCurrency: pair.baseCurrency,
    };
    const doc = await coll.findOne(query);
    let newTuples = (0, immutable_1.List)(doc && doc.prices ? prices.push(...doc.prices) : prices);
    newTuples = newTuples.filter((val, index) => newTuples.findIndex((v) => v[0] === val[0] && v[1] === val[1]) === index);
    await coll.updateOne(query, { $set: { prices: newTuples.toJS() } }, { upsert: true });
}
exports.uploadRates = uploadRates;
