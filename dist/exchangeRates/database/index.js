"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const mongodb_1 = require("mongodb");
const getDbRates_1 = require("./getDbRates");
const getTickers_1 = require("./getTickers");
const uploadRates_1 = require("./uploadRates");
dotenv.config();
const client = new mongodb_1.MongoClient(process.env.MONGODB_URL).connect();
function mongoClient() {
    const mongo = {
        async getDbRates(pair) {
            const c = await client;
            return (0, getDbRates_1.getDbRates)(pair, c);
        },
        async updateRates(pair, prices) {
            const c = await client;
            return (0, uploadRates_1.uploadRates)(pair, prices, c);
        },
        async getTickers() {
            const c = await client;
            return (0, getTickers_1.getTickers)(c);
        },
    };
    return mongo;
}
exports.default = mongoClient;
