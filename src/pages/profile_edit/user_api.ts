import HTTPTransport from "../../core/HTTPTransport";
import type { Dispatch } from '../../core/Store';
import router from "../../core/Router";

export class UserApi {
	private static http = new HTTPTransport();
	private static baseUri = process.env.API_ENDPOINT;

	static profile(data: ProfileRequestData) {
		return new Promise<ProfileResponseData>((resolve, reject) => {
			this.http.put(this.baseUri + '/user/profile', { data, credentials: true })
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

	static profilePassword(data: ProfilePasswordRequestData) {
		return new Promise<void>((resolve, reject) => {
			this.http.put(this.baseUri + '/user/profile/password', {credentials: true})
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

	static profileAvatar(data: ProfileAvatarRequestData) {
		return new Promise<ProfileResponseData>((resolve, reject) => {
			const formData = new FormData();
			formData.append('avatar', data.avatarData);
			this.http.put(this.baseUri + '/user/profile/avatar', {credentials: true, data: formData})
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

type ProfileRequestData = Omit<User, 'avatar' | 'login'>;

type ProfileResponseData = User | { reason: string };

type ProfilePasswordRequestData = { newPassword: string, oldPassword: string };

type ProfileAvatarRequestData = { avatarData: Blob };

export const updateUser = async (
	dispatch: Dispatch<AppState>,
	state: AppState,
	data: User & {avatarData: Blob},
) => {
	console.log('dispatching', this);debugger;
	dispatch({ isLoading: true });

	try {
		// await UserApi.profilePassword(data);
		let user = await UserApi.profile(data) as User;
		console.log(user);

		if (data.avatarData) {
			user = await UserApi.profileAvatar({ avatarData: data.avatarData }) as User;
			console.log(user);
		}
		//TODO if password changed

		dispatch({ isLoading: false, loginFormError: null, user });
		// router.go('/settings');
	}
	catch (error) {
		console.error(error);
		// await UserApi.logout();
		// @ts-ignore
		dispatch({ isLoading: false, loginFormError: error?.reason || 'Unknown Error', user: null });
		// router.go('/');
	}
};
