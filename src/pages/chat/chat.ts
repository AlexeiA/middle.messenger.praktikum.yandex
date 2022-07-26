import Block from '../../core/Block';

import './chat.pcss';
import '/src/static/avatar_generic.png';

import {validateValue, ValidationRule} from "../../helpers/validator";
import MySocket from "../../core/MySocket";
import router from "../../core/Router";
import store from "../../core/Store";
import {addUsersToChat, createChat, getToken, removeUsersFromChat} from "./chat_api";

export class ChatPage extends Block {
	constructor() {
		console.log('constructor', 'ChatPage');
		super();
		store.on('changed', (prevState, nextState) => {
			console.log('ChatPage changed', prevState, nextState);
			if (prevState.currentChatId != nextState.currentChatId) {
				store.dispatch(getToken, nextState.currentChatId);
				return;
			}
			if (prevState.currentToken === nextState.currentToken) {
				return;
			}
			const token = store.getState().currentToken;
			const userId = store.getState().user?.id;
			const chatId = store.getState().currentChatId;
			if (this.socket) {
				this.socket.send({
					content: `Я, пользователь ${userId}, отключился!`,
					type: 'message',
				});
				this.state.messages = [];
				this.socket.close(1000, 'Смена чата');
			}
			this.socket = new MySocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`);
			this.socket.on('open', () => {
				console.log('Соединение установлено');
				if (this.socket) {
					this.socket.send({
						content: '0',
						type: 'get old'
					});
					this.socket.send({
						content: `Я, пользователь ${userId}, подключился!`,
						type: 'message'
					});
				}
			});

			this.socket.on('close', (event: CloseEvent) => {
				if (event.wasClean) {
					console.log('Соединение закрыто чисто');
				} else {
					console.log('Обрыв соединения');
				}

				console.log(`Код: ${event.code} | Причина: ${event.reason}`);
			});

			this.socket.on('message', event => {
				console.log('Получены данные', event.data);
				let data;
				try {
					data = JSON.parse(event.data);
				}
				catch (error) {
					console.error('Некорректный формат данных');
					return;
				}
				if (data.type === 'message') {
					this.state.messages.push({
						id: data.id,
						content: sanitize(data.content),
						direction: data.user_id === userId ? 'out' : 'in'
					});
				}
				else if (data.type === 'user connected') {
					this.state.messages.push({
						id: data.id,
						content: `Пользователь ${data.content} подключился`,
						direction: 'system'
					});

				}
				else if (Array.isArray(data)) {//old messages
					data.forEach((msg) => {
						this.state.messages.push({
							id: msg.id,
							content: sanitize(`${msg.content}`),
							direction: msg.user_id === userId ? 'out' : 'in'
						});
					});
					this.state.messages.sort(function (a: {id: number}, b: {id: number}) {
						return b.id - a.id;
					});
				}
				else {
					console.warn('Неизвестный формат данных', data);
					return;
				}
				this.setState({messages: this.state.messages});
			});

			this.socket.on('error', event => {
				// @ts-ignore
				console.log('Ошибка', event.message);
			});
		});
	}

	socket: Nullable<MySocket> = null;

	private static validateUsersPrompt(users: string): boolean {
		const usersRegExp = /[\d,]+/;
		return usersRegExp.test(users);
	}

	protected getStateFromProps() {
		this.state = {
			value: '',
			error: '',
			chat: null,
			token: null,
			messages: [],
			sendMessage: () => {
				const value = (this.refs.message.refs.input.element as HTMLInputElement).value;
				const nextState = {
					value: value,
					error: validateValue(ValidationRule.Message, value)
				};
				if (!nextState.error) {
					this.socket && this.socket.send({
						content: value,
						type: 'message',
					});
				}
				this.setState(nextState);
			},
			createChat: () => {
				const title = prompt('Название чата');
				if (title) {
					store.dispatch(createChat, {title});
				}
			},
			addUsers: () => {
				const users = prompt('Идентификаторы пользователей для добавления', 'Например: 123,456');
				if (users) {
					if (ChatPage.validateUsersPrompt(users)) {
						store.dispatch(addUsersToChat, {users: JSON.parse(`[${users}]`), chatId: store.getState().currentChatId});
					}
					else {
						alert('Строка идентификаторов имеет недопустимый формат');
					}
				}
			},
			removeUsers: () => {
				const users = prompt('Идентификаторы пользователей для удаления', 'Например: 123,456');
				if (users) {
					if (ChatPage.validateUsersPrompt(users)) {
						store.dispatch(removeUsersFromChat, {users: JSON.parse(`[${users}]`), chatId: store.getState().currentChatId});
					}
					else {
						alert('Строка идентификаторов имеет недопустимый формат');
					}
				}
			},
			gotoSettings: () => {
				router.go('/settings');
			}
		}
	}

	render() {
		console.log('render', this);
		const {value, error} = this.state;
		const chatId = store.getState().currentChatId;
		// language=hbs
		return `
			{{#Layout name="Chat" }}
				<div class="chats">
					{{{Button
						text="Новый чат"
						onClick=createChat
					}}}
                	{{{ChatsBlock
					}}}
				</div>
				<div class="chat">
					<div class="chat-header">
						{{{Button
							text="Добавить собеседников"
							onClick=addUsers
							disabled=${chatId == null}
						}}}
						{{{Button
							text="Удалить собеседников"
							onClick=removeUsers
							disabled=${chatId == null}
						}}}
						{{{Button
							text="Мой профиль"
							onClick=gotoSettings
						}}}
					</div>
					<hr>
					<div class="history">
						{{#each messages}}
							<p class="message {{this.direction}}">{{this.content}}</p>
						{{/each}}
					</div>
					<hr>
					<div class="message-new">
						{{{Input
							label=""
							value="${value}"
							error="${error}"
							ref="message"
							id="message"
							type="text"
							placeholder="Сообщение"
							validationRule="${ValidationRule.Message}"
                        }}}
						{{{Button
							text="Отправить"
							onClick=sendMessage
						}}}
					</div>
				</div>
			{{/Layout}}
		`;
	}

	protected renderComplete() {
		const historyElement = document.querySelector('.chat .history');
		if (historyElement) {
			historyElement.scrollTop = historyElement.scrollHeight;
		}
	}
}

function sanitize(content: string) {
	return content.substring(0, 10_000).replace(/<(\/?)script>/ig, '');
}
