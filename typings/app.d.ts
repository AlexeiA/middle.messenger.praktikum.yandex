declare global {
	export type Nullable<T> = T | null;

	export type Keys<T extends Record<string, unknown>> = keyof T;
	export type Values<T extends Record<string, unknown>> = T[Keys<T>];

	export type Indexed = { [key: string]: any };

	export type AppState = {
		appIsInited: boolean;
		screen: Screens | null;
		isLoading: boolean;
		loginFormError: string | null;
		registerFormError: string | null;
		user: User | null;
		chats: [],
		currentToken: string | null;
	};

	export type User = {
		id: number;
		login: string;
		firstName: string;
		secondName: string;
		displayName: string;
		avatar: string;
		phone: string;
		email: string;
	};
	
	export type ChatsData = ChatData[];

	export type ChatData = {
		id: number,
		title: string,
		avatar: string,
		unread_count: number,
		last_message: {
			user: User,
			time: string,
			content: string
		}
	};
}

export {}
