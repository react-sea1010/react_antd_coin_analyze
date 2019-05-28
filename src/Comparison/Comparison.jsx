import React, { useEffect, useState, useRef } from 'react';
import config from 'config';
import { Redirect } from 'react-router-dom';
import { Table, Layout } from 'antd';
// custom common components
import { Navigation } from '../Navigation';
import { CustomHeader } from '../Header';
// custom hook
import { useListCoins } from '../hooks';
const loading = require('../_helpers/loading.gif');
// helpers
import { authHeader, dynamicSort } from '../_helpers';
import './Comparison.css';
const { Content } = Layout;

const commafy = (num, dot = false) => 
  num ?
    dot ? 
      Number(num.toFixed(0)).toLocaleString().split(/\s/).join(',') + ((num - Math.floor(num)).toFixed(6)).substring(1, ((num - Math.floor(num)).toFixed(6)).length)
      : Number(num.toFixed(0)).toLocaleString().split(/\s/).join(',')
    : 0;

const visibleFieldsDataColumn = [
  {
    title: 'All Fields',
    dataIndex: 'name'
  }
];
const coinColumnsShort = [
  {
    title: 'Icon',
    dataIndex: 'img_url',
    key: '1',
    render: image => <img src={loading} data-src={image} width="20" height="20" />
  },
  {
    title: 'Coin Name',
    dataIndex: 'coin_title',
    key: '2'
  },
  {
    title: 'Coin Symbol',
    dataIndex: 'coin_symbol',
    key: '3'
  }
];
const coinColumnsLong = [
  {
    title: 'Icon',
    dataIndex: 'img_url',
    colSpan: 0,
    className: 'column-icon',
    key: '1',
    render: image => {
      const link = 'https://cryptocompare.com' + image;
      return <img src={loading} data-src={link} width="20" height="20" />;
    }
  },
  {
    title: 'Coin Name',
    dataIndex: 'coin_title',
    className: 'column-name',
    colSpan: 2,
    sorter: (a, b) => a.coin_title.localeCompare(b.coin_title),
    key: '2',
    render: (value, row, index) => ({
        children: value,
        props: {}
      })
  },
  {
    title: 'TA score',
    dataIndex: 'ta_score',
    key: '3',
    sorter: (a, b) => a.ta_score - b.ta_score
  },
  {
    title: 'Token supply',
    dataIndex: 'token_supply',
    key: '4',
    sorter: (a, b) => a.token_supply - b.token_supply,
    render: value => commafy(value)
  },
  {
    title: 'Market Cap',
    dataIndex: 'market_cap',
    key: '5',        
    sorter: (a, b) => a.market_cap - b.market_cap,
    render: value => '$' + commafy(value)
  },
  {
    title: 'Price USD',
    dataIndex: 'asset_price_old',
    key: '6',        
    sorter: (a, b) => a.asset_price_old - b.asset_price_old,
    render: value => '$' + commafy(value, true, 6)
  },
  {
    title: 'Price change USD (24h)',
    dataIndex: 'price_change_24',
    key: '7',        
    sorter: (a, b) => a.price_change_24 - b.price_change_24,
    render: value => commafy(value, true, 2) + '%'
  },
  {
    title: 'Volume 24h USD',
    dataIndex: 'volume_24_old',
    key: '8',        
    sorter: (a, b) => a.volume_24_old - b.volume_24_old,
    render: value => '$' + commafy(value)
  },
  {
    title: 'Volume change (24h)',
    dataIndex: 'volume_change_24',
    key: '9',        
    sorter: (a, b) => a.volume_change_24 - b.volume_change_24,
    render: value => commafy(value, true, 2) + '%'
  },
  {
    title: 'Twitter list',
    dataIndex: 'twitter_list',
    key: '10',        
    sorter: (a, b) => a.twitter_list - b.twitter_list,
    render: value => commafy(value)
  },
  {
    title: 'Twitter favorites',
    dataIndex: 'twitter_favorites',
    key: '11',        
    sorter: (a, b) => a.twitter_favorites - b.twitter_favorites,
    render: value => commafy(value)
  },
  {
    title: 'Twitter following',
    dataIndex: 'twitter_following',
    key: '12',        
    sorter: (a, b) => a.twitter_following - b.twitter_following,
    render: value => commafy(value)
  },
  {
    title: 'Twitter status',
    dataIndex: 'twitter_status',
    key: '13',        
    sorter: (a, b) => a.twitter_status - b.twitter_status,
    render: value => commafy(value)
  },
  {
    title: 'Twitter followers',
    dataIndex: 'twitter_followers',
    key: '14',        
    sorter: (a, b) => a.twitter_followers - b.twitter_followers,
    render: value => commafy(value)
  },
  {
    title: 'Reddit active users',
    dataIndex: 'reddit_active_users',
    key: '15',        
    sorter: (a, b) => a.reddit_active_users - b.reddit_active_users,
    render: value => commafy(value)
  },
  {
    title: 'Reddit posts',
    dataIndex: 'reddit_posts',
    key: '16',        
    sorter: (a, b) => a.reddit_posts - b.reddit_posts,
    render: value => commafy(value)
  },
  {
    title: 'Reddit comments',
    dataIndex: 'reddit_comments',
    key: '17',        
    sorter: (a, b) => a.reddit_comments - b.reddit_comments,
    render: value => commafy(value)
  },
  {
    title: 'Reddit subscribers',
    dataIndex: 'reddit_subscribers',
    key: '18',        
    sorter: (a, b) => a.reddit_subscribers - b.reddit_subscribers,
    render: value => commafy(value)
  },
  {
    title: 'Github Closed issues',
    dataIndex: 'github_closed_issues',
    key: '19',        
    sorter: (a, b) => a.github_closed_issues - b.github_closed_issues,
    render: value => commafy(value)
  },
  {
    title: 'Github Open pull issues',
    dataIndex: 'github_open_pull_issues',
    key: '20',        
    sorter: (a, b) => a.github_open_pull_issues - b.github_open_pull_issues,
    render: value => commafy(value)
  },
  {
    title: 'Github Closed pull issues',
    dataIndex: 'github_closed_pull_issues',
    key: '21',        
    sorter: (a, b) => a.github_closed_pull_issues - b.github_closed_pull_issues,
    render: value => commafy(value)
  },
  {
    title: 'Github Forks',
    dataIndex: 'github_forks',
    key: '22',        
    sorter: (a, b) => a.github_forks - b.github_forks,
    render: value => commafy(value)
  },
  {
    title: 'Github Subscribers',
    dataIndex: 'github_subscribers',
    key: '24',        
    sorter: (a, b) => a.github_subscribers - b.github_subscribers,
    render: value => commafy(value)
  },
  {
    title: 'Github',
    dataIndex: 'github_stars',
    key: '25',        
    sorter: (a, b) => a.github_stars - b.github_stars,
    render: value => commafy(value)
  },
  {
    title: 'Volatilty 30 day (USD)',
    dataIndex: 'volatility_30_usd',
    key: '26',        
    sorter: (a, b) => a.volatility_30_usd - b.volatility_30_usd,
    render: value => commafy(value, true, 2)
  },
  {
    title: 'Volatilty 60 days (USD)',
    dataIndex: 'volatility_60_usd',
    key: '27',        
    sorter: (a, b) => a.volatility_60_usd - b.volatility_60_usd,
    render: value => commafy(value, true, 2)
  },
  {
    title: 'Volatilty 120 days (USD)',
    dataIndex: 'volatility_120_usd',
    key: '28',        
    sorter: (a, b) => a.volatility_120_usd - b.volatility_120_usd,
    render: value => commafy(value, true, 2) 
  },
  {
    title: 'Volatilty 1 year (USD)',
    dataIndex: 'volatility_year_usd',
    key: '29',        
    sorter: (a, b) => a.volatility_year_usd - b.volatility_year_usd,
    render: value => commafy(value, true, 2) 
  },
  {
    title: 'ATH (USD)',
    dataIndex: 'ath',
    key: '30',        
    sorter: (a, b) => a.ath - b.ath,
    render: value => '$' + commafy(value, true, 6)
  },
  {
    title: 'Days since ATH (USD)',
    dataIndex: 'days_ath_usd',
    key: '31',        
    sorter: (a, b) => a.days_ath_usd - b.days_ath_usd
  },
  {
    title: 'ATH/Current Price (USD)',
    dataIndex: 'current_div_ath_usd',
    key: '32',        
    sorter: (a, b) => a.current_div_ath_usd - b.current_div_ath_usd,
    render: value => commafy(value, true, 2)
  },
  {
    title: 'ATL (USD)',
    dataIndex: 'atl',
    key: '33',
    sorter: (a, b) => a.atl - b.atl,
    render: value => '$' + commafy(value, true, 6)
  },
  {
    title: 'Days since ATL (USD)',
    dataIndex: 'days_atl_usd',
    key: '34',        
    sorter: (a, b) => a.days_atl_usd - b.days_atl_usd
  },
  {
    title: 'ATL/Current Price (USD)',
    dataIndex: 'atl_div_current_usd',
    key: '35',        
    sorter: (a, b) => a.atl_div_current_usd - b.atl_div_current_usd
  },
  {
    title: 'Weekly Price change % (USD)',
    dataIndex: 'week_usd_change',
    key: '36',        
    sorter: (a, b) => a.week_usd_change - b.week_usd_change,
    render: value => commafy(value, true, 2)+'%'
  },
  {
    title: 'Mayer Multiple (USD)',
    dataIndex: 'mayer_multiple_usd',
    key: '37',        
    sorter: (a, b) => a.mayer_multiple_usd - b.mayer_multiple_usd,
    render: value => commafy(value, true, 5)
  },
  {
    title: '30 days ratio (USD) Last 30d price avg / Past 30d price avg',
    dataIndex: 'last30_div_past30_usd',
    key: '38',        
    sorter: (a, b) => a.last30_div_past30_usd - b.last30_div_past30_usd,
    render: value => commafy(value, true, 5)
  },
  {
    title: '60 days ratio (USD) Last 60d price avg / Past 60d price avg',
    dataIndex: 'last60_div_past60_usd',
    key: '39',        
    sorter: (a, b) => a.last60_div_past60_usd - b.last60_div_past60_usd,
    render: value => commafy(value, true, 5)
  },
  {
    title: '120 days ratio (USD) Last 120d price avg / Past 120d price avg',
    dataIndex: 'last120_div_past120_usd',
    key: '40',        
    sorter: (a, b) => a.last120_div_past120_usd - b.last120_div_past120_usd,
    render: value => commafy(value, true, 5)
  },
  {
    title: '1 year ratio (USD) Last year price avg / Past year price avg',
    dataIndex: 'lastyear_div_pastyear_usd',
    key: '41',        
    sorter: (a, b) => a.lastyear_div_pastyear_usd - b.lastyear_div_pastyear_usd,
    render: value => commafy(value, true, 5)
  },
  {
    title: 'Buy Support 1%',
    dataIndex: 'buy_support_1',
    key: '42',        
    sorter: (a, b) => a.buy_support_1 - b.buy_support_1,
    render: value => '$' + commafy(value)
  },
  {
    title: 'Buy Support 2%',
    dataIndex: 'buy_support_2',
    key: '43',        
    sorter: (a, b) => a.buy_support_2 - b.buy_support_2,
    render: value => '$' + commafy(value)
  },
  {
    title: 'Buy Support 3%',
    dataIndex: 'buy_support_3',
    key: '44',        
    sorter: (a, b) => a.buy_support_3 - b.buy_support_3,
    render: value => '$' + commafy(value)
  },
  {
    title: 'Buy Support 4%',
    dataIndex: 'buy_support_4',
    key: '45',        
    sorter: (a, b) => a.buy_support_4 - b.buy_support_4,
    render: value => '$' + commafy(value)
  },
  {
    title: 'Buy Support 5%',
    dataIndex: 'buy_support_5',
    key: '46',        
    sorter: (a, b) => a.buy_support_5 - b.buy_support_5,
    render: value => '$' + commafy(value)
  },
  {
    title: 'Buy Support 10%',
    dataIndex: 'buy_support_10',
    key: '47',        
    sorter: (a, b) => a.buy_support_10 - b.buy_support_10,
    render: value => '$' + commafy(value)
  },
  {
    title: 'Buy Support 15%',
    dataIndex: 'buy_support_15',
    key: '48',        
    sorter: (a, b) => a.buy_support_15 - b.buy_support_15,
    render: value => '$' + commafy(value)
  },
  {
    title: 'Sell Support 1%',
    dataIndex: 'sell_support_1',
    key: '49',        
    sorter: (a, b) => a.sell_support_1 - b.sell_support_1,
    render: value => '$' + commafy(value)
  },
  {
    title: 'Sell Support 2%',
    dataIndex: 'sell_support_2',
    key: '50',        
    sorter: (a, b) => a.sell_support_2 - b.sell_support_2,
    render: value => '$' + commafy(value)
  },
  {
    title: 'Sell Support 3%',
    dataIndex: 'sell_support_3',
    key: '51',        
    sorter: (a, b) => a.sell_support_3 - b.sell_support_3,
    render: value => '$' + commafy(value)
  },
  {
    title: 'Sell Support 4%',
    dataIndex: 'sell_support_4',
    key: '52',        
    sorter: (a, b) => a.sell_support_4 - b.sell_support_4,
    render: value => '$' + commafy(value)
  },
  {
    title: 'Sell Support 5%',
    dataIndex: 'sell_support_5',
    key: '53',        
    sorter: (a, b) => a.sell_support_5 - b.sell_support_5,
    render: value => '$' + commafy(value)
  },
  {
    title: 'Sell Support 10%',
    dataIndex: 'sell_support_10',
    key: '54',        
    sorter: (a, b) => a.sell_support_10 - b.sell_support_10,
    render: value => '$' + commafy(value)
  },
  {
    title: 'Sell Support 15%',
    dataIndex: 'sell_support_15',
    key: '55',        
    sorter: (a, b) => a.sell_support_15 - b.sell_support_15,
    render: value => '$' + commafy(value)
  },
  {
    title: 'Buy 10%/Sell 10%',
    dataIndex: 'buy_div_sell_10',
    key: '56',        
    sorter: (a, b) => a.buy_div_sell_10 - b.buy_div_sell_10,
    render: value => commafy(value, true, 5)
  },
  {
    title: 'Buy 5%/Sell 5%',
    dataIndex: 'buy_div_sell_5',
    key: '57',        
    sorter: (a, b) => a.buy_div_sell_5 - b.buy_div_sell_5,
    render: value => commafy(value, true, 5)
  },
  {
    title: 'Buy Support 10% / Market cap',
    dataIndex: 'buy_10_div_mcap',
    key: '58',        
    sorter: (a, b) => a.buy_10_div_mcap - b.buy_10_div_mcap,
    render: value => commafy(value, true, 5)
  },
  {
    title: '(Buy 10%/Sell 10%)^2 * (Buy 10%/Market cap)',
    dataIndex: 'amir_liquidity_metric',
    key: '59',        
    sorter: (a, b) => a.amir_liquidity_metric - b.amir_liquidity_metric,
    render: value => commafy(value, true, 5)
  },
  {
    title: '(Buy 10%-Sell 10%) / (Buy 10%+Sell 10%)',
    dataIndex: 'andrey_liquidity_metric',
    key: '60',        
    sorter: (a, b) => a.andrey_liquidity_metric - b.andrey_liquidity_metric,
    render: value => commafy(value, true, 5)
  }
];


export const Comparison = (props) => {

  const SHOW_LIMIT = 14;

  const [coins, toCoins] = useState([]);
  const [selectedCoins, setSelected] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [compared, toCompare] = useState([]);
  const [showComparison, toShow] = useState(false);  
  const [sleep, setSleep] = useState(null);
  const [dynaColumn, setDynaColumn] = useState([]);  
  const [loadingContent, setLoadingContent] = useState(true);
 
  const prevFields = useRef();
  const fetched = useListCoins();

  const getVisibleFieldsData = (columns) => {
    let datas = [];
    columns.map((e, i) => {
      if (i > 1) {//except for icon and coin name
        datas.push({
          key: i - 2,
          name: e.title,
          field: e.dataIndex
        })
      }
    });
    return datas;
  }
  const visibleFieldsData = getVisibleFieldsData(coinColumnsLong);

  useEffect(() => {
    toCoins(fetched);
    setTimeout(() => {
      const allimages = document.getElementsByTagName('img');
      for (let i = 0; i < allimages.length; i++) {
        if (allimages[i].getAttribute('data-src')) allimages[i].setAttribute('src', allimages[i].getAttribute('data-src'));
      }
    }, 1200);
    document.addEventListener('click', () => {
      const allimages = document.getElementsByTagName('img');
      for (let i = 0; i < allimages.length; i++) {
        if (allimages[i].getAttribute('data-src')) allimages[i].setAttribute('src', allimages[i].getAttribute('data-src'));
      }
    });
  }, [fetched]);

  useEffect(() => {
    if (sleep) clearTimeout(sleep);
    setSleep(setTimeout(() => {
      if (selectedCoins.length <= 1) return;
      const formatted = selectedCoins.map(s => s.coin_id);      
      fetch(`${config.apiUrl}/get_assets_params`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ assets: formatted })
      }).then(response => response.json()).then(data => {        
        toCompare(data);
        setLoadingContent(false);
      });
    }, 500));
  }, [selectedCoins]);

  useEffect(() => {

    if (compared.length > 1) {      
      toShow(true);
      setLoadingContent(false);
      setTimeout(() => {
        const allimages = document.getElementsByTagName('img');
        for (let i = 0; i < allimages.length; i++) {
          if (allimages[i].getAttribute('data-src')) allimages[i].setAttribute('src', allimages[i].getAttribute('data-src'));
        }
      }, 1200);
    }
    else toShow(false);
  }, [compared]);

  useEffect(() => {
    let replaces = [
      {
        title: 'Icon',
        dataIndex: 'img_url',
        colSpan: 0,
        className: 'column-icon',
        key: '1',
        render: image => {
          const link = 'https://cryptocompare.com' + image;
          return <img src={loading} data-src={link} width="20" height="20" />;
        }
      },
      {
        title: 'Coin Name',
        dataIndex: 'coin_title',
        className: 'column-name',
        colSpan: 2,
        key: '2',
        sorter: (a, b) => a.coin_title.localeCompare(b.coin_title),
        render: (value, row, index) => ({
            children: value,
            props: {}
          })
      }
    ];

    selectedRowKeys.forEach(e => {
      let row = visibleFieldsData.filter(p => p.key === e)[0];
      replaces.push(...coinColumnsLong.filter(c => c.dataIndex === row.field));      
    });
    setDynaColumn(replaces);
  }, [selectedRowKeys]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setLoadingContent(true);
      setSelected(selectedRows);
    },
    getCheckboxProps: record => ({
      name: record.name
    }),
  };
  const rowSelectionField = {
    selectedRowKeys,
    onChange: selectRowKeys => {
      if (selectRowKeys.length <= SHOW_LIMIT) {
        setSelectedRowKeys(selectRowKeys);
        prevFields.current = selectRowKeys;
      } else {
        setSelectedRowKeys(prevFields.current);
      }
    }
  };
  return (
    <div>
      <Layout>
        <Navigation activeNav="2" />
        <Layout>
          <CustomHeader />
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <div className='tableGroup' style={{ display: 'flex', margin: '24px 16px', padding: 24, background: '#fff', justifyContent: 'space-around' }}>
              <Table key={0} rowKey={coin => coin.coin_id} loading={coins.length > 0 ? false : true} style={{ width: '40%' }} rowSelection={rowSelection} dataSource={coins.sort(dynamicSort('full_name'))} columns={coinColumnsShort} size="small" />
              <Table key={1} rowKey={vfield => vfield.key} pagination={false} scroll={{ y: 400 }} title={() => 'Parameters'} showHeader={false} rowSelection={rowSelectionField} columns={visibleFieldsDataColumn} dataSource={visibleFieldsData} size="small" style={{ width: '40%' }} />
            </div>
            <div>
              <Table key={3} className='showInfoTable' loading={loadingContent} pagination={false} rowKey={coin => coin.coin_id} scroll={{ x: '100%' }} dataSource={compared.sort(dynamicSort('full_name'))} columns={dynaColumn}/>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};