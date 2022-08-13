const data = [
    { id: 16, symbol: 'btc', baseCurrency: 'usd', timestamp: [1570746314000] },
    { id: 18, symbol: 'btc', baseCurrency: 'usd', timestamp: [1571037194000] },
    { id: 19, symbol: 'btc', baseCurrency: 'usd', timestamp: [1574255876000] },
    { id: 24, symbol: 'btc', baseCurrency: 'usd', timestamp: [1579001159000] },
    { id: 29, symbol: 'btc', baseCurrency: 'usd', timestamp: [1581566944000] },
    { id: 36, symbol: 'btc', baseCurrency: 'usd', timestamp: [1582545373000] },
    { id: 39, symbol: 'btc', baseCurrency: 'usd', timestamp: [1582674884000] },
    { id: 40, symbol: 'btc', baseCurrency: 'usd', timestamp: [1583207229000] },
    { id: 52, symbol: 'btc', baseCurrency: 'usd', timestamp: [1586165765000] },
    { id: 65, symbol: 'btc', baseCurrency: 'usd', timestamp: [1587773426000] },
    { id: 72, symbol: 'eth', baseCurrency: 'usd', timestamp: [1588037485000] },
    { id: 73, symbol: 'btc', baseCurrency: 'usd', timestamp: [1588037496000] },
    { id: 80, symbol: 'btc', baseCurrency: 'usd', timestamp: [1591067868000] },
    { id: 81, symbol: 'btc', baseCurrency: 'usd', timestamp: [1591068244000] },
    { id: 90, symbol: 'eth', baseCurrency: 'usd', timestamp: [1591845427000] },
    { id: 91, symbol: 'btc', baseCurrency: 'usd', timestamp: [1591845440000] },
    { id: 92, symbol: 'link', baseCurrency: 'usd', timestamp: [1591845466000] },
    { id: 97, symbol: 'btc', baseCurrency: 'usd', timestamp: [1592436975000] },
    { id: 98, symbol: 'eth', baseCurrency: 'usd', timestamp: [1592437004000] },
    { id: 99, symbol: 'link', baseCurrency: 'usd', timestamp: [1592437027000] },
    { id: 101, symbol: 'btc', baseCurrency: 'usd', timestamp: [1592438669000] },
    { id: 102, symbol: 'btc', baseCurrency: 'usd', timestamp: [1592439794000] },
    { id: 132, symbol: 'btc', baseCurrency: 'usd', timestamp: [1594692745000] },
    { id: 136, symbol: 'btc', baseCurrency: 'usd', timestamp: [1594878780000] },
    { id: 143, symbol: 'btc', baseCurrency: 'usd', timestamp: [1594957897000] },
    { id: 144, symbol: 'btc', baseCurrency: 'usd', timestamp: [1594958273000] },
    { id: 145, symbol: 'btc', baseCurrency: 'usd', timestamp: [1594958650000] },
    { id: 173, symbol: 'eth', baseCurrency: 'usd', timestamp: [1596247536000] },
    { id: 174, symbol: 'btc', baseCurrency: 'usd', timestamp: [1596247820000] },
    { id: 175, symbol: 'btc', baseCurrency: 'usd', timestamp: [1596501396000] },
    { id: 181, symbol: 'eth', baseCurrency: 'usd', timestamp: [1600819370000] },
    { id: 182, symbol: 'btc', baseCurrency: 'usd', timestamp: [1600819492000] },
    { id: 189, symbol: 'btc', baseCurrency: 'usd', timestamp: [1602415975000] },
    { id: 190, symbol: 'btc', baseCurrency: 'usd', timestamp: [1602665075000] },
    { id: 193, symbol: 'btc', baseCurrency: 'usd', timestamp: [1603043466000] },
    { id: 196, symbol: 'btc', baseCurrency: 'usd', timestamp: [1603493653000] },
    { id: 199, symbol: 'btc', baseCurrency: 'usd', timestamp: [1604302308000] },
    { id: 200, symbol: 'btc', baseCurrency: 'usd', timestamp: [1604305985000] },
    { id: 203, symbol: 'btc', baseCurrency: 'usd', timestamp: [1608414271000] },
    { id: 206, symbol: 'btc', baseCurrency: 'usd', timestamp: [1608432305000] },
    { id: 209, symbol: 'btc', baseCurrency: 'usd', timestamp: [1608700582000] },
    { id: 212, symbol: 'eth', baseCurrency: 'usd', timestamp: [1608757094000] },
    { id: 214, symbol: 'btc', baseCurrency: 'usd', timestamp: [1608758756000] },
    { id: 217, symbol: 'eth', baseCurrency: 'usd', timestamp: [1608856436000] },
    { id: 222, symbol: 'btc', baseCurrency: 'usd', timestamp: [1610693712000] },
    { id: 223, symbol: 'btc', baseCurrency: 'usd', timestamp: [1610783389000] },
    { id: 224, symbol: 'btc', baseCurrency: 'usd', timestamp: [1610881362000] },
    { id: 235, symbol: 'eth', baseCurrency: 'usd', timestamp: [1612345851000] },
    { id: 236, symbol: 'eth', baseCurrency: 'usd', timestamp: [1612386888000] },
    { id: 237, symbol: 'eth', baseCurrency: 'usd', timestamp: [1613379212000] },
    { id: 242, symbol: 'eth', baseCurrency: 'usd', timestamp: [1615434333000] },
    { id: 251, symbol: 'eth', baseCurrency: 'usd', timestamp: [1618257461000] },
    { id: 253, symbol: 'eth', baseCurrency: 'usd', timestamp: [1618886645000] },
    { id: 262, symbol: 'eth', baseCurrency: 'usd', timestamp: [1623695375000] },
    { id: 265, symbol: 'gusd', baseCurrency: 'usd', timestamp: [1624325336000] },
    { id: 266, symbol: 'gusd', baseCurrency: 'usd', timestamp: [1625283265000] },
    { id: 273, symbol: 'eth', baseCurrency: 'usd', timestamp: [1628157197000] },
    { id: 277, symbol: 'gusd', baseCurrency: 'usd', timestamp: [1629769967000] },
    { id: 278, symbol: 'gusd', baseCurrency: 'usd', timestamp: [1629790830000] },
    { id: 281, symbol: 'eth', baseCurrency: 'usd', timestamp: [1629810691000] },
    { id: 283, symbol: 'eth', baseCurrency: 'usd', timestamp: [1629932563000] },
    { id: 287, symbol: 'eth', baseCurrency: 'usd', timestamp: [1632895252000] },
    { id: 288, symbol: 'eth', baseCurrency: 'usd', timestamp: [1634339534000] },
    { id: 296, symbol: 'eth', baseCurrency: 'usd', timestamp: [1635455843000] },
    { id: 297, symbol: 'eth', baseCurrency: 'usd', timestamp: [1636431131000] },
    { id: 300, symbol: 'eth', baseCurrency: 'usd', timestamp: [1639202906000] },
    { id: 303, symbol: 'eth', baseCurrency: 'usd', timestamp: [1639922310000] },
    { id: 306, symbol: 'eth', baseCurrency: 'usd', timestamp: [1641285292000] },
    { id: 309, symbol: 'usdc', baseCurrency: 'usd', timestamp: [1641733752000] },
    { id: 314, symbol: 'eth', baseCurrency: 'usd', timestamp: [1641941318000] },
    { id: 316, symbol: 'eth', baseCurrency: 'usd', timestamp: [1642014956000] },
];
export default data;