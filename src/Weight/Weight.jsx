import React, { useEffect, useState } from 'react';
import config from 'config';
import { Link, Redirect } from 'react-router-dom';
import { Layout, Table, Slider } from 'antd';
// common custom components
import { Navigation } from '../Navigation';
import { CustomHeader } from '../Header';
// custom hook
import { useListCoins } from '../hooks';
const loading = require('../_helpers/loading.gif');
// helpers
import { authHeader, dynamicSort } from '../_helpers';
const { Content } = Layout;

export const Weight = (props) => {

  const [coins, toCoins] = useState([]);
  const [selected, setSelected] = useState([]);
  const [compared, toCompare] = useState([]);
  const [show, toShow] = useState(false);

  // sliders
  const [volume, setVolume] = useState(0);
  const [cap, setCap] = useState(0);
  const [bs, setBS] = useState(0);
  const [b, setB] = useState(0);
  const [ath, setATH] = useState(0);
  const [atl, setATL] = useState(0);

  // weights table fix
  const [k, setK] = useState(0);

  // RxJS will be better
  const [sleep, setSleep] = useState(null);

  const fetched = useListCoins();
  useEffect(() => {
    toCoins(fetched);
  }, [fetched]);

  useEffect(() => {
    if(compared.length > 1) toShow(true);
    else toShow(false);
  }, [compared]);

  useEffect(() => {
    if(sleep) clearTimeout(sleep);
    if(selected.length <= 1) return;
    setSleep(setTimeout(() => {
      const cs = selected.map(row => row.coin_id);
      fetch(`${config.apiUrl}/weight`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
          vol_7_days: volume,
          // vol_7_days_un_trusted: volume,
          // vol_7_days_trusted: volume,
          market_cap: cap,
          liquidity_buy_5: b,
          distance_ath: ath,
          distance_atl: atl,
          assets: cs.map(c => Number.parseInt(c))
        })
      }).then(response => response.json()).then(data => {
        console.log(data);
        toCompare(data);
      });
    }, 500));
  }, [selected, volume, cap, bs, b, ath, atl]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const allimages = document.getElementsByTagName('img');
    for (let i = 0; i < allimages.length; i++) {
      if (allimages[i].getAttribute('data-src')) allimages[i].setAttribute('src', allimages[i].getAttribute('data-src'));
    }
  }, [show, compared]);

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

  const comparedColumns = [
    {
      title: 'Icon',
      dataIndex: 'img_url',
      key: '1',
      render: image => {
        const link = 'https://cryptocompare.com' + image;
        return <img src={loading} data-src={link} width="20" height="20" />;
      }
    },
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: '2'
    },
    {
      title: 'Volume 7 days',
      dataIndex: 'vol_7_days_un_trusted',
      key: '3'
    },
    {
      title: 'Market Cap',
      dataIndex: 'market_cap',
      key: '4'
    },
    {
      title: 'Liquidity Buy/Sell 10%',
      dataIndex: 'liquidity_buy_sell_10',
      key: '5'
    },
    {
      title: 'Liquidity Buy 5%',
      dataIndex: 'liquidity_buy_5',
      key: '6'
    },
    {
      title: 'Total Weight Calc.',
      dataIndex: 'total_calculated_weight',
      key: '7'
    }
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelected(selectedRows);
    },
    getCheckboxProps: record => ({
      name: record.name
    }),
  };

  return (
    <div>
      <Layout>
        <Navigation activeNav="3" />
        <Layout>
          <CustomHeader />
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <Table style={{ width: '45%', float: 'left' }} rowKey={coin => coin.coin_id} rowSelection={rowSelection} dataSource={coins.sort(dynamicSort('full_name'))} columns={coinColumnsShort} size="small" />
            <table style={{ width: '50%', marginLeft: '3%', float: 'left' }}>
              <tbody>
                <tr style={{ height: '67px' }}>
                  <td style={{ width: '20%' }}><p>Volume 7 days: </p></td>
                  <td><Slider min={0} max={5} tooltipVisible={true} defaultValue={volume} id='v7days' onAfterChange={setVolume} /></td>
                </tr>
                <tr style={{ height: '75px' }}>
                  <td style={{ width: '20%' }}><p>Market Cap: </p></td>
                  <td><Slider min={0} max={5} tooltipVisible={true} defaultValue={cap} id='mcap' onAfterChange={setCap} /></td>
                </tr>
                <tr style={{ height: '75px' }}>
                  <td style={{ width: '20%' }}><p>Liquidity Buy/Sell 10%: </p></td>
                  <td><Slider min={0} max={5} tooltipVisible={true} defaultValue={bs} id='liquiditybs' onAfterChange={setBS} /></td>
                </tr>
                <tr style={{ height: '75px' }}>
                  <td style={{ width: '20%' }}><p>Liquidity Buy 5%: </p></td>
                  <td><Slider min={0} max={5} tooltipVisible={true} defaultValue={b} id='liquidityb' onAfterChange={setB} /></td>
                </tr>
                <tr style={{ height: '75px' }}>
                  <td style={{ width: '20%' }}><p>Distance ATH: </p></td>
                  <td><Slider min={0} max={5} tooltipVisible={true} defaultValue={ath} id='distanceath' onAfterChange={setATH} /></td>
                </tr>
                <tr style={{ height: '75px' }}>
                  <td style={{ width: '20%' }}><p>Distance ATL: </p></td>
                  <td><Slider min={0} max={5} tooltipVisible={true} defaultValue={atl} id='distanceatl' onAfterChange={setATL} /></td>
                </tr>
              </tbody>
            </table>
          </Content>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            { show && <Table rowKey={coin => coin.coin_id * coin.market_cap * coin.vol_7_days_un_trusted} dataSource={compared} columns={comparedColumns} /> }
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
