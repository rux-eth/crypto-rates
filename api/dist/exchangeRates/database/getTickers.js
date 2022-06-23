"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTickers = void 0;
const immutable_1 = require("immutable");
async function getTickers(c) {
    const coll = c.db('exchange-rates').collection('tickers');
    return (0, immutable_1.Map)((0, immutable_1.List)(await coll.find().toArray())
        .filter((elem) => elem && 'symbol' in elem && 'chains' in elem)
        .map((doc) => [doc.symbol, doc.chains]));
}
exports.getTickers = getTickers;
