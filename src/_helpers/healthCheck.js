import { authHeader } from './index';
import config from 'config';

export const healthCheck = (setter) => {
	const headers = authHeader();
	if(!headers) return setter(false);
	fetch(`${config.apiUrl}/hc`, {
		method: 'GET',
		headers: headers
	}).then(response => {
		if(!response.ok) setter(false);
	}).catch(e => setter(false));
};