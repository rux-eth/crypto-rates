import json
from datetime import datetime, timedelta
from decimal import Decimal

from document_parser import DocumentParser
from errors import NotATradeException


class GeminiParser(DocumentParser):
    def __init__(self, *args, **kwargs):
        kwargs['exchange_name'] = 'gemini'
        kwargs['header'] = {
            'created_at': None,
            'amount': None,
            'fill_amount': None,
            'currency_pair': None,
            'type': 'Type',
        }
        kwargs['header_rows'] = 0
        super(GeminiParser, self).__init__(*args, **kwargs)

    def process_row(self, row):
        if row['type'].lower() not in ['buy', 'sell', 'credit', 'debit']:
            raise NotATradeException("Gemini trade is not a buy or sell", row)
        if row['type'].lower() in ['buy', 'sell']:
            row['type'] = row['type'].lower()
        elif row['type'].lower() == 'debit':
            row['type'] = 'withdrawal'
        else:
            row['type'] = 'deposit'
        row['created_at'] = self.process_date(row)
        row['amount'] = self.process_amount(row)
        row['currency_pair'] = self.process_currency_pair(row)
        row['fill_amount'] = self.process_fill_amount(row)

        # print(json.dumps(row, indent=3))
        return row

    def process_date(self, row):
        date = row['_extras']['Date']
        time = row['_extras']['Time (UTC)']
        dt = datetime.strptime(f'{date} {time}'.split('.')[0], '%Y-%m-%d %H:%M:%S')
        return dt.strftime('%Y-%m-%dT%H:%M:%SZ')

    def process_amount(self, row):
        currency = ''
        if row['type'].lower() in ['buy', 'sell']:
            currency = row['_extras']['Symbol'][:-3]
        else:
            currency = row['_extras']['Symbol']
        amt = str(row['_extras'][currency + ' Amount ' + currency])
        chars = ['.', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'e', '-']
        return abs(float(''.join(_ if _ in chars else '' for _ in amt)))

    def process_fill_amount(self, row):
        currency = ''
        if row['type'].lower() in ['buy', 'sell']:
            currency = row['_extras']['Symbol'][-3:]
        else:
            currency = row['_extras']['Symbol']
        amt = str(row['_extras'][currency + ' Amount ' + currency])
        chars = ['.', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'e', '-']
        return abs(float(''.join(_ if _ in chars else '' for _ in amt)))

    def process_currency_pair(self, row):
        if len(row['_extras']['Symbol']) > 4:
            return row['_extras']['Symbol'][:-3] + '-' + row['_extras']['Symbol'][-3:]
        else:
            return row['_extras']['Symbol'] + '-' + row['_extras']['Symbol']

    def process_price(self, row):
        return row['fill_amount'] / row['amount']
