import HTTPTransport from "../../core/HTTPTransport";
import type { Dispatch } from '../../core/Store';
import router from "../../core/Router";

export class ChatApi {
	private static http = new HTTPTransport();
	private static baseUri = process.env.API_ENDPOINT;

	static getChats() {
		return new Promise<ChatsResponseData>((resolve, reject) => {
			this.http.get(this.baseUri + '/chats', { credentials: true })
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

type ChatsResponseData = ChatData[] | { reason: string };

type ProfileResponseData = User | { reason: string };

type ProfilePasswordRequestData = { newPassword: string, oldPassword: string };

type ProfileAvatarRequestData = { avatarData: Blob };

export const getChats = async (
	dispatch: Dispatch<AppState>,
	state: AppState,
	data: null,
) => {
	console.log('dispatching', this);
	dispatch({ isLoading: true });

	try {
		let chats = await ChatApi.getChats();
		console.log(chats);
		dispatch({isLoading: false, chats});
	}
	catch (error) {
		console.error(error);
		dispatch({isLoading: false});
		alert(`Ошибка: ${error?.reason}`);

	}
};
