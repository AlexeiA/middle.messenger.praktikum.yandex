import HTTPTransport from "../../core/HTTPTransport";
import type { Dispatch } from '../../core/Store';
import router from "../../core/Router";

export class LoginApi {
	private static http = new HTTPTransport({credentials: true});
	private static baseUri = 'https://ya-praktikum.tech/api/v2';

	static login(data: LoginRequestData) {
		return new Promise<LoginResponseData>((resolve, reject) => {
			this.http.post(this.baseUri + '/auth/signin', {data})
				.then((xhr) => {
					if (xhr.status === 200) {
						resolve();
					}
					else {
						reject(JSON.parse(xhr.responseText));
					}
				});
		});
	}

	static user() {
		return new Promise<User>((resolve, reject) => {
			this.http.get(this.baseUri + '/auth/user')
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

	static logout() {
		return new Promise<void>((resolve, reject) => {
			this.http.post(this.baseUri + '/auth/logout')
				.then(xhr => {
					if (xhr.status === 200) {
						resolve();
					}
					else {
						reject();
					}
				})
		});
	}
}

type LoginRequestData = {
	login: string,
	password: string,
};

type LoginResponseData = void | { reason: string };

export const login = async (
	dispatch: Dispatch<AppState>,
	// @ts-ignore
	state: AppState,
	data: LoginRequestData,
) => {
	console.log('dispatching', this);debugger;
	dispatch({ isLoading: true });

	try {
		const response = await LoginApi.login(data);
		console.log(response);
		const user = await LoginApi.user();
		console.log(user);
		dispatch({ isLoading: false, loginFormError: null, user });
		router.go('/settings');
	}
	catch (error) {
		console.error(error);
		await LoginApi.logout();
		// @ts-ignore
		dispatch({ isLoading: false, loginFormError: error?.reason || 'Unknown Error', user: null });
		router.go('/');
	}
};
