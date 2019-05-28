import React, { useEffect, useState } from 'react';
import { Layout, Form, Input, Icon, Checkbox, Alert } from 'antd';
// custom common components
import { Navigation } from '../Navigation';
import { CustomHeader } from '../Header';
// helpers
import config from 'config';
import { authHeader, dynamicSort } from '../_helpers';

const { Content } = Layout;

export const Subscriptions = (props) => {

  const [alert, setAlert] = useState({});
  const [active, setActive] = useState(false);
  const [toCheckEmail, setCheckEmail] = useState("");
  const [toCheckPhone, setCheckPhone] = useState("");
  const [subscriptions, setSubscriptions] = useState({
    username: JSON.parse(localStorage.getItem('user')).email,
    subs_daily_report_email: false,
    subs_daily_report_signal: false,
    mobile_number: ''
  });

  useEffect(() => {
    fetch(`${config.apiUrl}/get_subs/${subscriptions.username}`, {
      method: 'GET',
      headers: authHeader()
    }).then(response => response.json()).then(data => {
      if(typeof data[0] !== 'undefined') setSubscriptions(data[0]);
    });
  }, []);

  const handleEmail = (e) => {
    setSubscriptions({
      ...subscriptions,
      username: e.target.value
    });
    setCheckEmail("");
    buttonCheck();
  };

  const handleCheckEmail = (e) => {
    const c = checkEmail() ? "success" : "error";
    if(e.target.checked) setCheckEmail(c);
    else setCheckPhone("");
    setSubscriptions({
      ...subscriptions,
      subs_daily_report_email: e.target.checked
    });
    buttonCheck();
  };

  const checkEmail = () => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(subscriptions.username).toLowerCase());
  };

  const handleSignal = (e) => {
    setSubscriptions({
      ...subscriptions,
      mobile_number: e.target.value
    });
    setCheckPhone("");
    buttonCheck();
  };

  const handleCheckPhone = (e) => {
    const c = checkPhone() ? "success" : "error";
    if(e.target.checked) setCheckPhone(c);
    else setCheckPhone("");
    setSubscriptions({
      ...subscriptions,
      subs_daily_report_signal: e.target.checked
    });
    buttonCheck();
  };

  const checkPhone = () => {
    const re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    if(String(subscriptions.mobile_number) === '') return false;
    return re.test(String(subscriptions.mobile_number).toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(toCheckPhone === 'error') return;
    fetch(`${config.apiUrl}/save_subs`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({
        id: subscriptions.id,
        username: subscriptions.username,
        subs_daily_report_email: subscriptions.subs_daily_report_email ? checkEmail() : false,
        subs_daily_report_signal: subscriptions.subs_daily_report_signal ? checkPhone() : false,
        mobile_number: subscriptions.mobile_number
      })
    }).then(response => response.json()).then(data => {
      if(!data.error) setAlert({msg: 'Saved!', t: 'success'});
      else setAlert({msg: 'Can not process request, check form & try again.', t: 'error'});
      setActive(true);
      setTimeout(() => {
        setActive(false);
      }, 1500);
    });
  };

  const buttonCheck = () => {
    const b = document.querySelector('#save');
    if(!subscriptions.subs_daily_report_signal) {
      if(checkPhone()) {
        return b.disabled = false;
      } else {
        return b.disabled = true;
      }
    }
    return b.disabled = false;
  };

  return (
    <div>
      <Layout>
        <Navigation activeNav="4" />
        <Layout>
          { active && <Alert style={{ position: 'fixed', right: 0, zIndex: 999, margin: '10px 15px' }} message={alert.msg} type={alert.t} /> }
          <CustomHeader />
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <h3>There are 2 options of newsletter broadcasting now. Please, select preferred.</h3>
            <br />
            <Form style={{ width: '40%' }} onSubmit={handleSubmit}>
              <Form.Item validateStatus={toCheckEmail} help="Enter your Email address">
                <Input value={subscriptions.username || ''} prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Your Email" onChange={handleEmail} />
              </Form.Item>
              <Form.Item validateStatus={toCheckPhone} help="Enter your Phone number with Country Code">
                <Input value={subscriptions.mobile_number || ''} prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="e.g. +1 444 1234567" onChange={handleSignal} />
              </Form.Item>
              <Form.Item>
                <Checkbox checked={subscriptions.subs_daily_report_email || false} onChange={handleCheckEmail}>Receive News via Email</Checkbox>
              </Form.Item>
              <Form.Item>
                <Checkbox checked={subscriptions.subs_daily_report_signal || false} onChange={handleCheckPhone}>Receive News via Signal App.</Checkbox>
              </Form.Item>
              <Form.Item style={{ float: 'right' }}>
                <button id="save" className="btn btn-warning" onClick={handleSubmit}>Save Changes</button>
              </Form.Item>
            </Form>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};