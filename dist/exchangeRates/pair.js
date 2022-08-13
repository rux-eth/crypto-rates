"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pair = exports.initializePairs = void 0;
const immutable_1 = require("immutable");
const database_1 = __importDefault(require("./database"));
const marketChart_1 = require("./marketChart");
const dataHelpers_1 = require("./util/dataHelpers");
const typeAssertions_1 = require("./util/typeAssertions");
class Pair {
    constructor(p, k) {
        this.timestamp = (0, immutable_1.List)([]);
        this.rates = (0, immutable_1.Map)();
        this.basePair = p;
        this.chain = p.chain;
        this.baseCurrency = p.baseCurrency;
        this.address = p.address;
        this.key = k;
    }
    async fetchRates() {
        await this.fetchDbRates();
        if (this.rates.count() !== this.timestamp.count())
            await this.fetchCgRates();
        /*         this.rates.forEach((v, k) => {
            console.log(v);
            console.log(k);
        }); */
        return this;
    }
    async fetchDbRates() {
        this.rates = (0, dataHelpers_1.findRate)(this.timestamp, await (0, database_1.default)().getDbRates(this.basePair)).filter((val) => val > 0);
    }
    async fetchCgRates() {
        const left = this.timestamp.filterNot((ts) => this.rates.has(ts));
        const formatted = (0, dataHelpers_1.formatTimestamps)(left);
        const tuples = await (0, marketChart_1.marketChart)(this.basePair, formatted, this.key);
        const newRates = (0, dataHelpers_1.findRate)(left, tuples).filter((val) => val > 0);
        this.rates = this.rates.merge(newRates);
        if (tuples.count() > 0) {
            (0, database_1.default)().updateRates(this.basePair, tuples);
        }
    }
    addTimestamps(ts) {
        this.timestamp = this.timestamp.concat(...ts);
    }
    getRate(ts) {
        return this.rates.get(ts, -1);
    }
}
exports.Pair = Pair;
async function initializePairs(q) {
    let pair2id = (0, immutable_1.List)([]);
    let ipair2pair = (0, immutable_1.Map)();
    let ids = [];
    await Promise.all(q.map(async (val) => {
        if (!(val === null || val === void 0 ? void 0 : val.id))
            throw { status: 400, message: `No Request ID Provided` };
        const validated = await (0, typeAssertions_1.validateRateQuery)(val);
        if (validated.valid) {
            const rq = validated.rateQuery;
            if (ids.includes(rq.id))
                throw { status: 400, message: `Repeating Request ID: ${rq.id}` };
            const basePair = (0, dataHelpers_1.toBasePair)(rq);
            const pair = ipair2pair.get((0, immutable_1.Map)(basePair), new Pair(basePair));
            pair.addTimestamps(rq.timestamp);
            pair2id = pair2id.push([rq.id, pair]);
            ipair2pair = ipair2pair.set((0, immutable_1.Map)(basePair), pair);
        }
    }));
    return (0, immutable_1.Map)(pair2id);
}
exports.initializePairs = initializePairs;
