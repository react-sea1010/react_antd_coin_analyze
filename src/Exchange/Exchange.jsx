import React, { useState, useEffect } from 'react';
// common custom components
import { Navigation } from '../Navigation';
import { CustomHeader } from '../Header';
// custom hook
import { useListCoins } from '../hooks';
import config from 'config';
import { authHeader } from '../_helpers';
// Layout
import { Layout, Form, Input, Radio, Icon } from 'antd';
import { Menu, Select, Button, Table } from 'antd';
const { Content } = Layout;

export const Exchange = () => {

	const [coins, toCoins] = useState([]);
	const [formatted, setFormatted] = useState([]);
	const [done, setDone] = useState(false);
	const [offers, setOffers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [menu, setMenu] = useState(null);

	// handling user input
	const [wtd, setWtd] = useState(null);
	const [asset, setAsset] = useState(null);
	const [amount, setAmount] = useState(0);
	const [back, setBack] = useState(null);

	const [exchanges, setExchanges] = useState([]);

	const fetched = useListCoins();
  useEffect(() => {
    toCoins(fetched);
  }, [fetched]);

  useEffect(() => {
  	const arr = coins.map(coin => (<Select.Option value={ coin.full_name } key={ coin.coin_id }>{ coin.full_name }</Select.Option>));
  	setFormatted(arr);
  	setDone(true);
  }, [coins]);

	const handleWTD = (e) => {
		setWtd(e.target.value);
	};

	const handleAsset = (value) => {
		const reg = /\((.*)\)/;
		const match = value.match(reg)[1] || null;
		setAsset(match);
	};

	const handleInput = (e) => {
		const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      setAmount(value);
    }
	};

	const handleBack = (e) => {
		setBack(e.target.value);
	};

	useEffect(() => {
		if(!wtd || !asset || !back || !amount) return;
		// fetching data from server in real-time
		setLoading(true);
		fetch(`${config.apiUrl}/list_tickers`, {
			method: 'POST',
			headers: authHeader(),
			body: JSON.stringify({
				wtd: wtd,
				asset: asset,
				back: back,
				amount: amount
			})
		}).then(response => response.json()).then(data => {
			setOffers(data);
			setLoading(false);
		});
	}, [wtd, asset, amount, back]);

	const columns = [
		{
			title: 'Ticker Name',
			dataIndex: 'e_sym',
			key: '1'
		},
		{
			title: 'To Sell',
			dataIndex: 'q_sym',
			key: '2'
		},
		{
			title: 'To Return',
			dataIndex: 'b_sym',
			key: '3'
		}
	];

	const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setExchanges(selectedRows);
    }
  };

  return (
    <div>
      <Layout>
        <Navigation activeNav="5" />
        <Layout>
          <CustomHeader />
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
  					<Form layout="inline">
  						<Form.Item label="I want to: ">
  							<Radio.Group defaultValue="horizontal" onChange={ handleWTD }>
		              <Radio.Button value="buy">&nbsp;&nbsp;&nbsp;Buy&nbsp;&nbsp;&nbsp;</Radio.Button>
		              <Radio.Button value="sell">&nbsp;&nbsp;&nbsp;Sell&nbsp;&nbsp;&nbsp;</Radio.Button>
		            </Radio.Group>
  						</Form.Item>
  						<br />
  						<Form.Item label="Please, choose asset: ">
  							<Select
								  showSearch
								  style={{ width: 200 }}
								  placeholder="Select an asset"
								  optionFilterProp="children"
								  onChange={ handleAsset }
								  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									{ done && formatted }
								</Select>
  						</Form.Item>
  						<br />
  						<Form.Item label="Please choose the amount of coins/tokens: ">
  							<Input onChange={ handleInput } value={ amount } placeholder="Amount..." />
  						</Form.Item>
  						<br />
  						<Form.Item label="I would like to receive back: ">
  							<Radio.Group onChange={ handleBack } defaultValue="horizontal">
		              <Radio.Button value="BTC">&nbsp;&nbsp;&nbsp;BTC&nbsp;&nbsp;&nbsp;</Radio.Button>
		              <Radio.Button value="ETH">&nbsp;&nbsp;&nbsp;ETH&nbsp;&nbsp;&nbsp;</Radio.Button>
		              <Radio.Button value="USDT">&nbsp;&nbsp;&nbsp;USDT&nbsp;&nbsp;&nbsp;</Radio.Button>
		              <Radio.Button value="USD">&nbsp;&nbsp;&nbsp;USD&nbsp;&nbsp;&nbsp;</Radio.Button>
		            </Radio.Group>
  						</Form.Item>
  					</Form>
  					<br />
  					{ !loading && <Table style={{ width: '40%' }} rowSelection={rowSelection} pagination={false} rowKey={ticker => ticker.ticker_id} dataSource={offers} columns={columns} size="small" /> }
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};