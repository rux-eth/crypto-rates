"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketChart = void 0;
const axios_1 = __importDefault(require("axios"));
const immutable_1 = require("immutable");
const constants_1 = require("../util/constants");
const dataHelpers_1 = require("../util/dataHelpers");
const queue_1 = require("./queue");
async function marketChart(pair, times, key) {
    console.log('here0');
    const baseUrl = (pair === null || pair === void 0 ? void 0 : pair.address)
        ? `${constants_1.coinGeckoBaseUrl}coins/${constants_1.iChainMapping.get(pair.chain).platform}/contract/${pair.address}/market_chart/range?vs_currency=${pair.baseCurrency}`
        : `${constants_1.coinGeckoBaseUrl}coins/${constants_1.iChainMapping.get(pair.chain).coinId}/market_chart/range?vs_currency=${pair.baseCurrency}`;
    let temp = (0, immutable_1.List)([]);
    for (let i = 0; i < times.count(); i++) {
        const queue = [];
        const end = times.get(i, [0, 0])[1];
        let start = times.get(i, [0, 0])[0];
        while (start < end) {
            if ((0, queue_1.leftInQueue)(key) < 1) {
                await (0, queue_1.resetQueue)(key);
            }
            const nt = start + (0, dataHelpers_1.hr2ms)(24 * 90);
            const url = `${baseUrl}&from=${Math.round(start / 1000)}&to=${Math.round(nt / 1000)}`;
            queue.push((0, axios_1.default)({
                url: url,
                method: 'get',
                validateStatus: (status) => status === 200,
                transformResponse: (data) => {
                    var _a;
                    let d = data;
                    try {
                        d = JSON.parse(d);
                        d.prices = (_a = d.prices) !== null && _a !== void 0 ? _a : [];
                        d.chain = pair.chain;
                        d.baseCurrency = pair.baseCurrency;
                        d.address = pair === null || pair === void 0 ? void 0 : pair.address;
                        return d;
                    }
                    catch (_b) { }
                },
            }));
            (0, queue_1.increaseQueue)(1, key);
            start = nt;
        }
        const final = await Promise.all(queue);
        temp.concat(...final.map((val) => { var _a; return (_a = val === null || val === void 0 ? void 0 : val.data) === null || _a === void 0 ? void 0 : _a.prices; }));
    }
    return temp;
}
exports.marketChart = marketChart;
/* import axios from "axios";
import { MarketChartResponse } from "../types";
import { coinGeckoBaseUrl } from "../util/constants";
import { iChainMappings } from "./claimMappings";
import {
  iChainMapping,
  MarketChartData,
  MarketChartRequest,
  NotFoundResponse
} from "./types";
export default async function marketChart(
  q: MarketChartRequest,
  key?: string
): Promise<Array<MarketChartData> | NotFoundResponse> {
  const queue: Promise<MarketChartResponse>[] = [];
  let st: number = q.from;
  const baseUrl: string = q.contractAddress
    ? `${coinGeckoBaseUrl}coins/${
        (<iChainMapping>iChainMappings[q.id]).platform
      }/contract/${q.contractAddress}/market_chart/range?vs_currency=${
        q.vs_currency
      }`
    : `${coinGeckoBaseUrl}coins/${
        (<iChainMapping>iChainMappings[q.id]).coinId
      }/market_chart/range?vs_currency=${q.vs_currency}`;

  while (st < q.to) {
    const nt: number = st + 86400 * 90;
    const url: string = q.contractAddress
      ? `${baseUrl}&from=${q.from}&to=${q.to}`
      : `${baseUrl}&from=${st}&to=${q.to}`;
    queue.push(
      axios({
        url: url,
        method: "get",
        validateStatus: (status) => status === 200 || status === 404,
        transformResponse: (data) => {
          let d;
          try {
            d = JSON.parse(data);
            d.id = q.id;
            d.contractAddress = q.contractAddress || null;
            d.baseCurrency = q.vs_currency
            return d;
          } catch {}
        },
      })
    );
    st = nt;
  }
  const data: MarketChartResponse[] = await Promise.all(queue);
  let temp: MarketChartData[] = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].status !== 200) {
      return <NotFoundResponse>data[i].data;
    }
    temp.push(<MarketChartData>data[i].data);
  }
  return temp;
}
 */
