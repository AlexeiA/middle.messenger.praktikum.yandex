export enum METHODS {
	GET = 'GET',
	PUT = 'PUT',
	POST = 'POST',
	DELETE = 'DELETE'
}

/**
 * Функцию реализовывать здесь необязательно, но может помочь не плодить логику у GET-метода
 * На входе: объект. Пример: {a: 1, b: 2, c: {d: 123}, k: [1, 2, 3]}
 * На выходе: строка. Пример: ?a=1&b=2&c=[object Object]&k=1,2,3
 */
function queryStringify(data: {}) {
	// Можно делать трансформацию GET-параметров в отдельной функции
	return '?' + toArray(data).join('&');
}

function toArray(obj: any) {
	let arr: Array<string> = [];
	Object.entries(obj).forEach(([k, v]) => {
		if (Array.isArray(v)) {
			arr.push(k + '=' + v.join(','));
		}
		else if (v && typeof v === 'object') {
			arr.push(k + '=' + v.toString());
		}
		else {
			arr.push(`${k}=${v}`);
		}
	});
	return arr;
}

interface IRequestOptions {
	method: METHODS;
	data: any;
	headers: [];
	timeout?: number;
}

export default class HTTPTransport {
	get = (url: string, options: IRequestOptions) => {
		return this.request(url, {...options, method: METHODS.GET}, options.timeout);
	};
	put = (url: string, options: IRequestOptions) => {
		return this.request(url, {...options, method: METHODS.PUT}, options.timeout);
	};
	post = (url: string, options: IRequestOptions) => {
		return this.request(url, {...options, method: METHODS.POST}, options.timeout);
	};
	delete = (url: string, options: IRequestOptions) => {
		return this.request(url, {...options, method: METHODS.DELETE}, options.timeout);
	};

	// options:
	// headers — obj
	// data — obj
	request = (url: string, options: IRequestOptions, timeout = 5000) => {
		return new Promise((resolve, reject) => {
			console.log(resolve, reject);
			let data = options.data;
			let method = options.method;
			if (method === 'GET' && data) {
				url += queryStringify(data);
			}

			const xhr = new XMLHttpRequest();
			xhr.open(options.method, url);

			if (options.headers) {
				Object.entries(options.headers).forEach(function ([key, value]) {
					xhr.setRequestHeader(key, value);
				});
			}

			xhr.onload = function () {
				console.log(xhr)
				resolve(xhr)
			};

			xhr.timeout = options.timeout || timeout;

			const handleError = (ev: ProgressEvent) => {
				console.log(ev);
				reject(ev);
			};

			xhr.onabort = handleError;
			xhr.onerror = handleError;
			xhr.ontimeout = handleError;

			if (method === 'GET' || !data) {
				xhr.send();
			}
			else {
				xhr.send(JSON.stringify(data));
			}
		})
	};
}
