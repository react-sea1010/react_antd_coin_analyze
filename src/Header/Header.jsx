import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Dropdown, Button, Icon, Input } from 'antd';
const { Header } = Layout;

const desktop = window.innerWidth > 1000;
const desktopWide = window.innerWidth > 1330;

const innerMenu = () => {
  const username = JSON.parse(localStorage.getItem('user')).email;
  return (
    <Menu>
      {!desktop && <Menu.Item key="0">
        <Link to="/" style={{ margin: 3 }}>{ username }</Link>
      </Menu.Item>}
      <Menu.Item key="1">
        <Link to="/login" style={{ margin: 3 }}>Logout</Link>
      </Menu.Item>
    </Menu>
  );
};

export const CustomHeader = (props) => {
  return (
    <Header style={{ background: '#f1b044', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', flex: 1, paddingRight: 20, flexDirection: 'row', justifyContent: 'space-between', visibility: 'hidden' }}>
        <div><p>Market Cap: <span style={{ color: 'white' }}>$120,060,303,271</span> <span style={{ color: 'red' }}>-2.03%</span></p></div>
        <div><p>24h Volume: <span style={{ color: 'white' }}>$12,060,303,271</span></p></div>
        { desktop && <div><p>Dominance: BTC <span style={{ color: 'white' }}>30.7%</span> ETH <span style={{ color: 'white' }}>10.2%</span> Others <span style={{ color: 'white' }}>59.1%</span></p></div> }
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>        
        <Dropdown overlay={innerMenu()} trigger={['click']}>
          <Button type="primary" shape="circle" icon="user" style={{ marginTop: 16, background: 'transparent', border: 'none', boxShadow: 'none' }} />
        </Dropdown>
      </div>
    </Header>
  );
};