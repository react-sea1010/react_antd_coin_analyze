export function authHeader() {
	try {
    const headers = new Headers();
		headers.append('authorization', `Bearer ${ JSON.parse(localStorage.getItem('user')).token }`);
		headers.append('cache-control', 'no-cache');
		headers.append('Content-Type', 'application/json');
		return headers;
	} catch(e) {
		return null;
	};
};