import HTTPTransport from "../../core/HTTPTransport";
import type { Dispatch } from '../../core/Store';

export class UserApi {
	private static http = new HTTPTransport();
	private static baseUri = 'https://ya-praktikum.tech/api/v2';

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

	static password(data: ProfilePasswordRequestData) {
		return new Promise<void | {reason: string}>((resolve, reject) => {
			this.http.put(this.baseUri + '/user/password', {credentials: true, data})
				.then(xhr => {
					if (xhr.status === 200) {
						resolve();
					}
					else if (xhr.responseText) {
						reject(JSON.parse(xhr.responseText));
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
	// @ts-ignore
	state: AppState,
	data: User & {avatarData: Blob} & {oldPassword: string, newPassword: string},
) => {
	console.log('dispatching', this);
	dispatch({ isLoading: true });

	try {
		let user = await UserApi.profile(data) as User;
		console.log(user);
		dispatch({ user });
		if (data.avatarData) {
			user = await UserApi.profileAvatar({ avatarData: data.avatarData }) as User;
			console.log(user);
			dispatch({ user });
		}
		if (data.oldPassword && data.newPassword) {
			const {oldPassword, newPassword} = data;
			await UserApi.password({oldPassword, newPassword});
		}
		dispatch({ isLoading: false, user });
	}
	catch (error) {
		console.error(error);
		// @ts-ignore
		alert(`Ошибка: ${error.reason}`);
	}
};
