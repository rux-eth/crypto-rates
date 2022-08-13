"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRateQuery = void 0;
const database_1 = __importDefault(require("../database"));
const constants_1 = require("./constants");
const dataHelpers_1 = require("./dataHelpers");
let ticks = (0, database_1.default)().getTickers();
async function validateRateQuery(o) {
    const tickers = await ticks;
    const toRateQuery = () => {
        return {
            ...(0, dataHelpers_1.toBasePair)(o),
            id: o.id,
            timestamp: o.timestamp,
        };
    };
    if ((o === null || o === void 0 ? void 0 : o.baseCurrency) && (o === null || o === void 0 ? void 0 : o.id) && (o === null || o === void 0 ? void 0 : o.timestamp) && ((o === null || o === void 0 ? void 0 : o.chain) || (o === null || o === void 0 ? void 0 : o.symbol))) {
        if ((o === null || o === void 0 ? void 0 : o.chain) && o.chain in constants_1.chainMapping && ((o === null || o === void 0 ? void 0 : o.address) || !(o === null || o === void 0 ? void 0 : o.symbol))) {
            return { valid: true, rateQuery: toRateQuery() };
        }
        if (o === null || o === void 0 ? void 0 : o.symbol) {
            o.symbol = o.symbol.toLowerCase();
            const chain = constants_1.iChainMapping.findKey((val) => val.symbol === o.symbol);
            if (chain) {
                o.chain = chain;
                return { valid: true, rateQuery: toRateQuery() };
            }
            const chains = tickers.get(o.symbol);
            if (!chains)
                return { valid: false };
            o.chain = (o === null || o === void 0 ? void 0 : o.chain) && o.chain in chains ? o.chain : Object.keys(chains)[0];
            o.address = chains[o.chain];
            return { valid: true, rateQuery: toRateQuery() };
        }
        return { valid: false };
    }
    return { valid: false };
}
exports.validateRateQuery = validateRateQuery;
