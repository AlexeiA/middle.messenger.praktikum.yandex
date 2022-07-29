import HTTPTransport from "../../core/HTTPTransport";
import type { Dispatch } from '../../core/Store';

export class ChatApi {
	private static http = new HTTPTransport({credentials: true});
	private static baseUri = process.env.API_ENDPOINT;

	static getChats() {
		return new Promise<ChatsResponseData>((resolve, reject) => {
			this.http.get(this.baseUri + '/chats')
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

	static createChat(data: CreateChatRequestData) {
		return new Promise<void>((resolve, reject) => {
			this.http.post(this.baseUri + '/chats', {data})
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

	static addUsers(data: ChatUsersRequestData) {
		return new Promise<void>((resolve, reject) => {
			this.http.put(this.baseUri + '/chats/users', {data})
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

	static removeUsers(data: ChatUsersRequestData) {
		return new Promise<void>((resolve, reject) => {
			this.http.delete(this.baseUri + '/chats/users', {data})
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

	static getToken(chatId: number) {
		return new Promise<ChatTokenResponseData>((resolve, reject) => {
			this.http.post(`${this.baseUri}/chats/token/${chatId}`)
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

type ChatsResponseData = ChatData[];

type CreateChatRequestData = { title: string };

type ChatUsersRequestData = { users: number[], chatId: number };

type ChatTokenResponseData = { token: string };

export const getChats = async (
	dispatch: Dispatch<AppState>,
	state: AppState,
) => {
	console.log('dispatching', this);
	dispatch({ isLoading: true });

	try {
		let chats = await ChatApi.getChats() as ChatsResponseData;
		console.log(chats);
		let nextState = {
			isLoading: false, chats
		} as Partial<AppState>;
		if (state.currentChatId == null && chats && chats.length > 0) {
			nextState.currentChatId = chats[0].id;
		}
		dispatch(nextState);
	}
	catch (error) {
		console.error(error);
		dispatch({isLoading: false});
		// @ts-ignore
		alert(`Ошибка: ${error?.reason}`);

	}
};

export const createChat = async (
	dispatch: Dispatch<AppState>,
	_: AppState,
	data: CreateChatRequestData,
) => {
	console.log('dispatching', this);
	dispatch({ isLoading: true });

	try {
		let chat = await ChatApi.createChat(data);
		console.log(chat);
		dispatch(getChats);
	}
	catch (error) {
		console.error(error);
		dispatch({isLoading: false});
		// @ts-ignore
		alert(`Ошибка: ${error?.reason}`);
	}
};

export const addUsersToChat = async (
	dispatch: Dispatch<AppState>,
	_: AppState,
	data: ChatUsersRequestData,
) => {
	console.log('dispatching', this);
	dispatch({ isLoading: true });

	try {
		await ChatApi.addUsers(data);
		dispatch(getChats);
	}
	catch (error) {
		console.error(error);
		dispatch({isLoading: false});
		// @ts-ignore
		alert(`Ошибка: ${error?.reason}`);
	}
};

export const removeUsersFromChat = async (
	dispatch: Dispatch<AppState>,
	_: AppState,
	data: ChatUsersRequestData,
) => {
	console.log('dispatching', this);
	dispatch({ isLoading: true });

	try {
		await ChatApi.removeUsers(data);
		dispatch(getChats);
	}
	catch (error) {
		console.error(error);
		dispatch({isLoading: false});
		// @ts-ignore
		alert(`Ошибка: ${error?.reason}`);
	}
};

export const getToken = async (
	dispatch: Dispatch<AppState>,
	_: AppState,
	data: number,
) => {
	console.log('dispatching', this);
	dispatch({ isLoading: true });

	try {
		const token = await ChatApi.getToken(data);
		dispatch({isLoading: false, currentToken: token.token});
	}
	catch (error) {
		console.error(error);
		dispatch({isLoading: false});
		// @ts-ignore
		alert(`Ошибка: ${error?.reason}`);
	}
};
