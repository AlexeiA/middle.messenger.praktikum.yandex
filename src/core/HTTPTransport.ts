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
	data?: any;
	headers?: Record<string, string>;
	timeout?: number;
	credentials?: boolean;
}

type RequestOptions = Omit<IRequestOptions, 'method'>;

export default class HTTPTransport {
	get = (url: string, options: RequestOptions) => {
		return this.request(url, {...options, method: METHODS.GET}, options.timeout);
	};
	put = (url: string, options: RequestOptions) => {
		return this.request(url, {...options, method: METHODS.PUT}, options.timeout);
	};
	post = (url: string, options: RequestOptions) => {
		return this.request(url, {...options, method: METHODS.POST}, options.timeout);
	};
	delete = (url: string, options: RequestOptions) => {
		return this.request(url, {...options, method: METHODS.DELETE}, options.timeout);
	};

	request = (url: string, options: IRequestOptions, timeout = 5000) => {
		return new Promise<XMLHttpRequest>((resolve, reject) => {
			let data = options.data;
			let method = options.method;
			if (method === 'GET' && data) {
				url += queryStringify(data);
			}

			const xhr = new XMLHttpRequest();
			if (options.credentials) {
				xhr.withCredentials = true;
			}
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
			else if (data instanceof FormData) {
				xhr.send(data);
			}
			else {
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.send(JSON.stringify(data));
			}
		})
	};
}
