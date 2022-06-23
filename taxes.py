import json
from datetime import datetime

import requests

from trades import Trades


class Taxes():
    def __init__(self, *args, **kwargs) -> None:
        pass
    def run(self, trades=None, errors=None):
        trades, errors = self.run_trades()
        print(len(trades))
        #print(json.dumps(trades, indent=3))
        txs, prices = self.parse_trades(trades)
        query = {
            'transactions': txs,
            'prices': prices
        }

        res = requests.post(url='http://localhost:3000/taxes',json=query)
        cap_gains = self.calc_cap_gains(res.json())
        print(json.dumps(cap_gains, indent=3))
    def calc_cap_gains(self, report):
        r = report['report']
        capital_gains = {}
        for year in r:
            total = 0
            for i in r[year]['short']:
                total += (float(i['proceeds']) - float(i['cost_basis']))
            capital_gains[year] = total
        return capital_gains

    def run_trades(self):
        return Trades().run()
    def parse_trades(self, trades):
        txs = []
        prices = []
        ratesQuery = []
        for i,x in enumerate(trades):
            tx = {}
            price = {}
            tx['tx_id'] = i

            if x['type'].lower() in ['buy', 'sell']:
                tx['tx_type'] = 'TRADE'
                tx['timestamp'] = x['created_at']
                tx['side'] = x['fill_type'].upper()
                tx['base_code'] = x['currency'].upper()
                tx['base_amount'] = x['amount']
                tx['quote_code'] = x['fill_currency']
                tx['quote_amount'] = x['fill_amount']
                price['tx_id'] = i
                price['timestamp'] = x['created_at']
                price['base_code']  = x['currency'].upper()
                price['quote_code'] = x['fill_currency']
                price['price'] = float(x['fill_amount']) / float(x['amount'])

                prices.append(price)
            else:
                tx['tx_type'] = x['type'].upper()
                tx['{}_code'.format(x['type'].lower())] = x['currency'].upper()
                tx['{}_amount'.format(x['type'].lower())] = x['amount']
                tx['timestamp'] = x['created_at']
                if not x['currency'].lower() == 'usd':
                    q = {}
                    q['id'] = i
                    q['symbol'] = x['currency'].lower()
                    q['baseCurrency'] = 'usd'
                    q['timestamp'] = [self.date_to_ts(x['created_at'])]
                    ratesQuery.append(q)
            txs.append(tx)

        return txs, prices + self.fetch_rates(ratesQuery)
    def fetch_rates(self, ratesQuery):
        res = requests.post('http://localhost:3000/rates', json={'ratesQuery': ratesQuery})
        prices = []
        for elem in res.json():
            prices.append({
                'tx_id': elem['query']['id'],
                'timestamp': self.ts_to_date(elem['query']['timestamp'][0]),
                'base_code': elem['query']['symbol'].upper(),
                'quote_code': elem['query']['baseCurrency'].upper(),
                'price': elem['rates'][0]['rate']
            })
        return prices
    def ts_to_date(self, ts):
        dt = datetime.fromtimestamp(ts/1000)
        return dt.strftime('%Y-%m-%dT%H:%M:%SZ')
    def date_to_ts(self, date):
        dt = datetime.strptime(date, '%Y-%m-%dT%H:%M:%SZ')
        return int(dt.timestamp() * 1000)


