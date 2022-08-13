import axios, { AxiosPromise, AxiosResponse } from 'axios';
import rateLimiter from 'axios-rate-limit';
import { List } from 'immutable';
import { BasePair, Timestamp, TimestampTuple } from './types';
import { coinGeckoBaseUrl, iChainMapping } from './util/constants';
import { hr2ms } from './util/dataHelpers';

const http = rateLimiter(
    axios.create({
        method: 'get',
        validateStatus: (status) => status === 200 || status === 404,
    }),
    { maxRequests: 50, perMilliseconds: 65000 }
);
let counter = 0;
export async function marketChart(
    pair: BasePair,
    times: List<TimestampTuple>,
    key?: string
): Promise<List<TimestampTuple>> {
    const baseUrl: string = pair?.address
        ? `${coinGeckoBaseUrl}coins/${iChainMapping.get(pair.chain)!.platform}/contract/${
              pair.address
          }/market_chart/range?vs_currency=${pair.baseCurrency}`
        : `${coinGeckoBaseUrl}coins/${
              iChainMapping.get(pair.chain)!.coinId
          }/market_chart/range?vs_currency=${pair.baseCurrency}`;
    let temp: List<TimestampTuple> = List([]);
    const queue: AxiosPromise[] = [];

    for (let i = 0; i < times.count(); i++) {
        const end: Timestamp = times.get(i, [0, 0])[1];
        let start: Timestamp = times.get(i, [0, 0])[0];
        while (start < end) {
            const nt: Timestamp = start + hr2ms(24 * 90);
            const url: string = `${baseUrl}&from=${Math.round(start / 1000)}&to=${Math.round(
                nt / 1000
            )}`;
            queue.push(http(url));
            start = nt;
        }
    }
    const final: AxiosResponse[] = await Promise.all(queue);
    temp = temp.concat(...final.map((val) => val.data.prices));
    return temp;
}

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
