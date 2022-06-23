"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRatesQuery = void 0;
const database_1 = __importDefault(require("../exchangeRates/database"));
const types_1 = require("../types");
const constants_1 = require("./constants");
async function validateRatesQuery(query) {
    const tickers = await (0, database_1.default)().getTickers();
    const temp = {
        key: query.key,
        ratesQuery: query.ratesQuery.map((q) => {
            if (q.chain)
                q.chain = q.chain.toLowerCase();
            if (q.baseCurrency)
                q.baseCurrency = q.baseCurrency.toLowerCase();
            if (q.address)
                q.address = q.address.toLowerCase();
            if (q.symbol)
                q.symbol = q.symbol.toLowerCase();
            if (!q.symbol || q.address) {
                return q;
            }
            const c = (constants_1.chainMapping.findKey((val) => val.symbol === q.symbol));
            if (c) {
                if (!q.chain) {
                    q.chain = c;
                }
                return q;
            }
            const tickerDoc = tickers.get(q.symbol);
            if (!tickerDoc) {
                q.address = 'null';
                return q;
            }
            if (q.chain) {
                q.address = tickerDoc.chains[q.chain];
                return q;
            }
            [q.chain, q.address] = (Object.entries(tickerDoc.chains)[0]);
            return q;
        }),
    };
    (0, types_1.assertRatesQuery)(temp);
    return temp;
}
exports.validateRatesQuery = validateRatesQuery;
