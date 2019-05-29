import React, { useState, useEffect, Fragment } from 'react';
// common custom components
import { Navigation } from '../Navigation';
import { CustomHeader } from '../Header';
// Layout
import { Layout, Table } from 'antd';
// custom hook
import { useListCoins, useAllCoins } from '../hooks';
// react-table
import ReactTable from "react-table";

const loading = require('../_helpers/loading.gif');
// helpers
import { dynamicSort } from '../_helpers';

const { Content } = Layout;

import './HomePage.css';

import  { CustomTableHeader } from '../CustomTableHeader';

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

  const coinColumns = [
    {
      Header: "#",
      accessor: "mc_rank",
      width:'1%'
    },
    {
      Header: "Asset Name",
      accessor: "coin_title",
      // Cell: (volume, row) => (
      //   <div><img src={loading} data-src={row.img_url} width="20" height="20" /> {row.coin_title}</div>
      // ),
      // Cell: row=>(
      //   <div><img src={loading} data-src={row.img_url} width="20" height="20" /> {row.coin_title}</div>  
      // ),
      width: "16%"
    },
    {
      Header: () => (
        <CustomTableHeader title={"Market Cap"} />
      ),
      accessor: "market_cap",
      width: "8%",
    },
    {
      Header: "Price",
      accessor: "asset_price",
      // Cell: row => {
      //   if (row.asset_price){
      //     return '$' + numberWithCommas(numberwith6decimals(row.asset_price || 0));
      //   }
      // },
      width: "8%"
    },
    {
      Header: "Price Change (24H)",
      accessor: "asset_price_old",
      width: "8%"
    },
    {
      Header: "Volume (24H)",
      accessor: "volume_24_old",
      width: "8%"
    },
    {
      Header: "Volume Change",
      accessor: "volume_24",
      width: "8%"
    },
    {
      Header: "ATH (USD)",
      accessor: "ath",
      width: "8%"
    },
    {
      Header: "ATL (USD)",
      accessor: "atl",
      width: "8%"
    },
    {
      Header: "Buy Support 5%",
      accessor: "buy_support_5",
      width: "8%"
    },
    {
      Header: "Sell Support 5%",
      accessor: "sell_support_5",
      width: "8%"
    },
    {
      Header: "TA Rating",
      accessor: "ta_rating",
      width: "3%"
    },
    {
      Header: "Volatility 30 days",
      accessor: "volatility_30_usd",
      width: "8%"
    },
  ]
  // sort coins by mc_rank
  coins.sort(function (a, b) { return a.mc_rank - b.mc_rank });
  console.log("coins", coins)

  const coinColumns1 = [
    {
      Header: () => (
        <CustomTableHeader title={"#"} />
      ),
      accessor: "mc_rank",
      sortMethod: (a, b) => {
        return a.mc_rank - b.mc_rank
      },
      width:'40',
    },
    {
      Header: () => (
        <CustomTableHeader title={"Asset Name"} />
      ),
      accessor: "coin_title",
      // Cell: (volume, row) => (
      //   <div><img src={loading} data-src={row.img_url} width="20" height="20" /> {row.coin_title}</div>
      // ),
      Cell: (row) => (
        <Fragment><img src={loading} data-src={row.original.img_url} width="20" height="20" /> {row.row.coin_title}</Fragment>
      ),
      width: "16%"
    },
    {
      Header: () => (
        <CustomTableHeader title={"Market Cap"} />
      ),
      accessor: "market_cap",
      Cell: (row) => (
        <Fragment>{'$' + numberWithCommas(parseInt(row.row.market_cap).toFixed(0) || 0)}</Fragment>
      ),
      sortMethod: (a, b) => {
        return a.market_cap - b.market_cap
      },
      width: "8%"
    },
    {
      Header: () => (
        <CustomTableHeader title={"Price"} />
      ),
      accessor: "asset_price",
      Cell: (row) => (
        <Fragment>{'$' + numberWithCommas(numberwith6decimals(row.row.asset_price || 0))}</Fragment>
      ),
      sortMethod: (a, b) => {
        return a.asset_price - b.asset_price
      },
      width: "8%"
    },
    {
      Header: () => (
        <CustomTableHeader title={"Price Change (24H)"} />
      ),
      accessor: "asset_price_old",
      Cell: (row) => (
        <Fragment>{getPriceChange(row.row.asset_price, row.row.asset_price_old) + '%'}</Fragment>
      ),
      sortMethod: (a, b) => {
        return getPriceChange(a.asset_price, a.asset_price_old) - getPriceChange(b.asset_price, b.asset_price_old)
      },
      width: "8%"
    },
    {
      Header: () => (
        <CustomTableHeader title={"Volume (24H)"} />
      ),
      accessor: "volume_24_old",
      Cell: (row) => (
        <Fragment>{"$" + numberWithCommas(parseInt(row.row.volume_24_old) || 0)}</Fragment>
      ),
      sortMethod: (a, b) => {
        return a.volume_24_old - b.volume_24_old
      },
      width: "8%"
    },
    {
      Header: () => (
        <CustomTableHeader title={"Volume Change"} />
      ),
      accessor: "volume_24",
      Cell: (row) => (
        <Fragment>{getVolumnChange(row.row.volume_24, row.row.volume_24_old) + '%'}</Fragment>
      ),
      sortMethod: (a, b) => {
        return getVolumnChange(a.volume_24, a.volume_24_old) - getVolumnChange(b.volume_24, b.volume_24_old)
      },
      width: "8%"
    },
    {
      Header: () => (
        <CustomTableHeader title={"ATH (USD)"} />
      ),
      accessor: "ath",
      Cell: (row) => (
        <Fragment>{'$' + numberWithCommas(numberwith6decimals(row.row.ath))}</Fragment>
      ),
      sortMethod: (a, b) => {
        return a.ath - b.ath
      },
      width: "8%"
    },
    {
      Header: () => (
        <CustomTableHeader title={"ATL (USD)"} />
      ),
      accessor: "atl",
      Cell: (row) => (
        <Fragment>{'$' + numberwith6decimals(row.row.atl)}</Fragment>
      ),
      sortMethod: (a, b) => {
        return a.atl - b.atl
      },
      width: "8%"
    },
    {
      Header: () => (
        <CustomTableHeader title={"Buy Support 5%"} />
      ),
      accessor: "buy_support_5",
      Cell: (row) => (
        <Fragment>{'$' + numberWithCommas(Number.parseInt(row.row.buy_support_5) || 0)}</Fragment>
      ),
      sortMethod: (a, b) => {
        return a.buy_support_5 - b.buy_support_5
      },
      width: "8%"
    },
    {
      Header: () => (
        <CustomTableHeader title={"Sell Support 5%"} />
      ),
      accessor: "sell_support_5",
      Cell: (row) => (
        <Fragment>{'$' + numberWithCommas(Number.parseInt(row.row.sell_support_5) || 0)}</Fragment>
      ),
      sortMethod: (a, b) => {
        return a.sell_support_5 - b.sell_support_5
      },
      width: "8%"
    },
    {
      Header: () => (
        <CustomTableHeader title={"TA Rating"} />
      ),
      accessor: "ta_rating",
      sortMethod: (a, b) => {
        return a.ta_rating - b.ta_rating
      },
      width: "3%"
    },
    {
      Header: () => (
        <CustomTableHeader title={"Volatility 30 days"} />
      ),
      accessor: "volatility_30_usd",
      Cell: (row) => (
        <Fragment>{Number.parseFloat(row.row.volatility_30_usd).toFixed(2)}</Fragment>
      ),
      sortMethod: (a, b) => {
        return a.volatility_30_usd - b.volatility_30_usd
      },
      width: "8%"
    },
  ]
  return (
    <div>
      <Layout>
        <Navigation activeNav="1" />
        <Layout>
          <CustomHeader />
          <Content style={{ margin: '24px 16px', padding: 30, background: '#fff', minHeight: 280 }}>
            {/* <Table className="homeTable" loading={coins.length > 0 ? false : true} rowKey={coin => coin.coin_id} pagination={false} dataSource={coins} columns={coinColumnsShort} /> */}
            <ReactTable
              data={coins}
              columns={coinColumns1}
              showPagination={false}
              className="homeTable"
              loading={coins.length > 0 ? false : true}
              rowKey={coin => coin.coin_id}
              defaultPageSize={97}
            />
            {/* <ReactTable
              data={coins}
              columns={coinColumns}
              showPagination={false}
              className="homeTable"
              loading={coins.length > 0 ? false : true}
              rowKey={coin => coin.coin_id}
            /> */}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
