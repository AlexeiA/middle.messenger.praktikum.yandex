import HTTPTransport from "../../core/HTTPTransport";
import type { Dispatch } from '../../core/Store';
import router from "../../core/Router";

class RegisterApi {
	private static http = new HTTPTransport();
	private static baseUri = process.env.API_ENDPOINT;

	static register(data: RegisterRequestData) {
		return new Promise<RegisterResponseData>((resolve, reject) => {
			this.http.post(this.baseUri + '/auth/signup', {data, credentials: true})
				.then((xhr) => {
					if (xhr.status === 200) {
						resolve(JSON.parse(xhr.responseText));
					}
					else {
						reject(JSON.parse(xhr.responseText));
					}
				});
		});
	}

	static user() {
		return new Promise<User>((resolve, reject) => {
			this.http.get(this.baseUri + '/auth/user', {credentials: true})
				.then(xhr => {
					if (xhr.status === 200) {
						resolve(JSON.parse(xhr.responseText));
					}
					else {
						reject(JSON.parse(xhr.responseText));
					}
				})
		});
	}
}

type RegisterRequestData = {
	first_name: string,
	second_name: string,
	login: string,
	email: string,
	password: string,
	phone: string
};

type RegisterResponseData = { id: number } | { reason: string };

export const register = async (
	dispatch: Dispatch<AppState>,
	state: AppState,
	data: RegisterRequestData,
) => {
	console.log('dispatching', this);debugger;
	dispatch({ isLoading: true });

	try {
		const response = await RegisterApi.register(data);
		console.log(response);
		const user = await RegisterApi.user();
		console.log(user);
		dispatch({ isLoading: false, registerFormError: null, user });
		router.go('/messenger');
	}
	catch (error) {
		console.error(error);
		// @ts-ignore
		dispatch({ isLoading: false, registerFormError: error?.reason || 'Unknown Error' });
	}
};
