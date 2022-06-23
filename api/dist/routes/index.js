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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv = __importStar(require("dotenv"));
const express = __importStar(require("express"));
const queue_1 = require("../exchangeRates/coingecko/queue");
const getExchangeRates_1 = __importDefault(require("../exchangeRates/getExchangeRates"));
//import { Coin, MarketChartData, NotFoundResponse } from '../exchangeRates/src/types';
const asyncHandler_1 = __importDefault(require("../util/asyncHandler"));
dotenv.config();
const jsonParser = body_parser_1.default.json();
const router = express.Router();
/* router.post('/taxes', jsonParser, (req, res, next) => {
    const taxesReq = req.body;
    assertTaxesQuery(taxesReq);
    const report = createReport({
        config: {
            local_currency: 'USD',
            price_method: 'BASE',
            cost_basis_method: 'FIFO',
            decimal_places: 2,
            allow_lot_overlap: true,
        },
        transactions: taxesReq.transactions,
        prices: taxesReq.prices,
    });
    console.log(report);
    res.json(report);
}); */
router.post('/rates', jsonParser, (0, asyncHandler_1.default)(async (req, res, next) => {
    const response = await (0, getExchangeRates_1.default)(req.body.ratesQuery, req.body.key);
    (0, queue_1.resetQueue)(req.body.key);
    //console.log(response);
    res.json(response);
}));
exports.default = router;
