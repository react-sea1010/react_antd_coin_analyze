import React, { useState, useEffect } from 'react';
import { render } from "react-dom";
import ReactTable from "react-table";
// common custom components
import { Navigation } from '../Navigation';
import { CustomHeader } from '../Header';
// Layout
import { Layout, Table } from 'antd';
// custom hook
import { useListCoins, useAllCoins } from '../hooks';

const loading = require('../_helpers/loading.gif');
// helpers
import { dynamicSort } from '../_helpers';

const { Content } = Layout;

import './HomePage.css';

function numberWithCommas(x) {
  // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");    
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function numberwith6decimals(x) {
  if (parseFloat(x).toFixed(6) != parseFloat(x)) {
    return parseFloat(x).toFixed(6);
  }
  return x;
}
const getPriceChange = (asset_price, price) => Number.parseInt(((asset_price - price) / asset_price) * 100);
const getVolumnChange = (volume, volume_24_old) => Number.parseInt(((volume - volume_24_old) / volume) * 100);
export const HomePage = () => {

  const [coins, toCoins] = useState([]);

  const fetched = useAllCoins();
  useEffect(() => {
    toCoins(fetched);
    setTimeout(() => {
      const allimages = document.getElementsByTagName('img');
      for (let i = 0; i < allimages.length; i++) {
        if (allimages[i].getAttribute('data-src')) allimages[i].setAttribute('src', allimages[i].getAttribute('data-src'));
      }
    }, 1200);
  }, [fetched]);

  const coinColumnsShort = [
    {
      title: '#',
      dataIndex: 'mc_rank',
      key: '1',
      sorter: (a, b) => a.mc_rank - b.mc_rank,
    },
    {
      title: 'Asset Name',
      dataIndex: 'coin_title',
      key: '2',
      sorter: (a, b) => a.coin_title.localeCompare(b.coin_title),
      render: (volume, row) => (
        <div><img src={loading} data-src={row.img_url} width="20" height="20" /> {row.coin_title}</div>
      ),

    }
    , {
      title: 'Market Cap',
      dataIndex: 'market_cap',
      key: '3',
      sorter: (a, b) => a.market_cap - b.market_cap,
      render: (volume, row) => {
        if (row.market_cap)
          return '$' + numberWithCommas(parseInt(row.market_cap).toFixed(0) || 0);
      },

    }, {
      title: 'Price',
      dataIndex: 'asset_price',
      key: '4',
      render: (volume, row) => {
        if (row.asset_price)
          return '$' + numberWithCommas(numberwith6decimals(row.asset_price || 0));
      },
      sorter: (a, b) => a.asset_price - b.asset_price,

    }, {
      title: 'Price Change (24H)',
      dataIndex: 'asset_price_old',
      key: '5',
      render: (price, row) => {
        if (row.asset_price)
          return getPriceChange(row.asset_price, price) + '%'
      },
      sorter: (a, b) => getPriceChange(a.asset_price, a.asset_price_old) - getPriceChange(b.asset_price, b.asset_price_old),

    }, {
      title: 'Volume (24H)',
      dataIndex: 'volume_24_old',
      key: '6',
      render: (volume, row) => {
        if (row.volume_24_old)
          return "$" + numberWithCommas(parseInt(row.volume_24_old) || 0);
      },
      sorter: (a, b) => a.volume_24_old - b.volume_24_old,

    },
    {
      title: 'Volume Change',
      dataIndex: 'volume_24',
      key: '7',
      render: (volume, row) => {
        if (row.volume_24)
          return getVolumnChange(volume, row.volume_24_old) + '%';
      },
      sorter: (a, b) => getVolumnChange(a.volume_24, a.volume_24_old) - getVolumnChange(b.volume_24, b.volume_24_old),

    },
    {
      title: 'ATH (USD)',
      dataIndex: 'ath',
      key: '8',
      render: (volume, row) => {
        if (row.ath)
          return '$' + numberWithCommas(numberwith6decimals(row.ath));
      },
      sorter: (a, b) => a.ath - b.ath,

    },
    {
      title: 'ATL (USD)',
      dataIndex: 'atl',
      key: '9',
      render: (volume, row) => {
        if (row.atl)
          return '$' + numberwith6decimals(row.atl);
      },
      sorter: (a, b) => a.atl - b.atl,

    },
    {
      title: 'Buy Support 5%',
      dataIndex: 'buy_support_5',
      key: '10',
      render: (volume, row) => {
        if (row.buy_support_5)
          return '$' + numberWithCommas(Number.parseInt(row.buy_support_5) || 0);
      },
      sorter: (a, b) => a.buy_support_5 - b.buy_support_5,

    },
    {
      title: 'Sell Support 5%',
      dataIndex: 'sell_support_5',
      key: '11',
      render: (volume, row) => {
        if (row.sell_support_5)
          return '$' + numberWithCommas(Number.parseInt(row.sell_support_5) || 0);
      },
      sorter: (a, b) => a.sell_support_5 - b.sell_support_5,

    },
    {
      title: 'TA Rating',
      dataIndex: 'ta_rating',
      key: '12',
      sorter: (a, b) => a.ta_rating - b.ta_rating,

    },
    {
      title: 'Volatility 30 days',
      dataIndex: 'volatility_30_usd',
      key: '13',
      render: (volume, row) => {
        if (row.volatility_30_usd)
          return Number.parseFloat(row.volatility_30_usd).toFixed(2);
      },
      sorter: (a, b) => a.volatility_30_usd - b.volatility_30_usd,

    },
  ];

  // sort coins by mc_rank
  coins.sort(function (a, b) { return a.mc_rank - b.mc_rank });
  console.log("coins", coins)
  return (
    <div>
      <Layout>
        <Navigation activeNav="1" />
        <Layout>
          <CustomHeader />
          <Content style={{ margin: '24px 16px', padding: 30, background: '#fff', minHeight: 280 }}>
            <Table className="homeTable" loading={coins.length > 0 ? false : true} rowKey={coin => coin.coin_id} pagination={false} dataSource={coins} columns={coinColumnsShort} />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
