import React, { useState, useEffect } from 'react';
import config from 'config';
import { Link, Redirect } from 'react-router-dom';
import { Icon, Alert } from 'antd';

import back from './back.png';

export const Login = (props) => {

	const [submitted, toSubmit] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [success, setSuccess] = useState(false);
  const [alertSet, activateAlert] = useState(false);

	const handleEmail = (e) => {
		setEmail(e.target.value);
	};

	const handlePassword = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		toSubmit(true);
	};

	useEffect(() => {
		if(!submitted) return;
		toSubmit(false);
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('accept', 'application/json');
		fetch(`${config.apiUrl}/auth/login`, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({ email: email, password: password })
		}).then(response => response.json()).then(data => {
			if(data.message !== 'Auth failed') {
				data.email = email;
				localStorage.setItem('user', JSON.stringify(data));
				setSuccess(true);
			} else {
        activateAlert(true);
        setTimeout(() => {
          activateAlert(false);
        }, 1500);
      }
		});
	}, [submitted]);

	return (
		<div className="custom" style={{ height: '100vh', width: '100vw', position: 'relative' }}>
			<img src={back} style={{ height: '100%', width: '100%', position: 'absolute', zIndex: 1 }} />
			<div className="container" style={{ position: 'absolute', zIndex: 2, width: '100%' }}>
        { alertSet && <Alert style={{ position: 'fixed', right: 0, zIndex: 999, margin: '10px 15px' }} message="Wrong email and/or password!" type="warning" /> }
				<div className="row">
					<div className="col-sm-4 col-xs-1"></div>
					<div className="col-sm-4 col-xs-10" style={{ padding: '50px 30px', background: 'white', borderRadius: '3px', marginTop: '25vh' }}>
						<div>
							<h2 className="text-center">Sign in to start your session</h2>
							<br />
							<form name="form" onSubmit={handleSubmit}>
								<div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
									<input type="text" className="form-control" placeholder="Email" autoComplete="true" name="email" value={email} onChange={handleEmail} />
									{ submitted && !email &&
										<div className="help-block">Email is required</div>
									}
								</div>
								<div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
									<input type="password" className="form-control" placeholder="Password" autoComplete="true" name="password" value={password} onChange={handlePassword} />
									{ submitted && !password &&
										<div className="help-block">Password is required</div>
									}
								</div>
								<div className="form-check text-center">
								  <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
								  <label className="form-check-label" htmlFor="defaultCheck1" style={{ fontWeight: 'normal' }}>&nbsp;&nbsp;Remember Me</label>
								</div>
								<br />
								<div className="form-group">
									<button className="btn btn-warning" style={{ width: '100%' }}>Sign In</button>
								</div>
								<br />
								<div className="text-center">
									<a href="#"><Icon type="lock" theme="filled" /> Forgot Password?</a>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			{ success && <Redirect to='/' /> }
		</div>
	);
};
