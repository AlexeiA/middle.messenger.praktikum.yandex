import Block from '../../core/Block';

import './chat.pcss';
import {validateValue, ValidationRule} from "../../helpers/validator";
import store from "../../core/Store";
import {addUsersToChat, createChat, getToken, removeUsersFromChat} from "./chat_api";

type Message = {
	content: string,
	direction: 'in' | 'out' | 'system'
}

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
			if (prevState.currentToken == nextState.currentToken) {
				return;
			}
			const token = store.getState().currentToken;
			const userId = store.getState().user.id;
			const chatId = store.getState().currentChatId;
			if (this.socket) {
				this.socket.send(JSON.stringify({
					content: `Я, пользователь ${userId}, отключился!`,
					type: 'message',
				}));
				this.socket.close(1000, 'Смена чата');
			}
			this.socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`);
			this.socket.addEventListener('open', () => {
				console.log('Соединение установлено');
				this.socket && this.socket.send(JSON.stringify({
					content: `Я, пользователь ${userId}, подключился!`,
					type: 'message',
				}));
			});

			this.socket.addEventListener('close', event => {
				if (event.wasClean) {
					console.log('Соединение закрыто чисто');
				} else {
					console.log('Обрыв соединения');
				}

				console.log(`Код: ${event.code} | Причина: ${event.reason}`);
			});

			this.socket.addEventListener('message', event => {
				console.log('Получены данные', event.data);
				const data = JSON.parse(event.data);
				if (data.type == 'message') {
					this.state.messages.push({content: data.content, direction: data.user_id == userId ? 'out' : 'in'});
					this.setState({messages: this.state.messages});
				}
				else if (data.type == 'user connected') {
					this.state.messages.push({content: `Пользователь ${data.content} подключился`, direction: 'system'});
					this.setState({messages: this.state.messages});
				}
			});

			this.socket.addEventListener('error', event => {
				console.log('Ошибка', event.message);
			});

			//TODO ping-pong
		});
	}

	componentDidUpdate(oldProps: any, newProps: any): boolean {
		console.log('componentDidUpdate', this, oldProps, newProps);
		return super.componentDidUpdate(oldProps, newProps);
	}

	socket: Nullable<WebSocket> = null;

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
					this.socket && this.socket.send(JSON.stringify({
						content: value,
						type: 'message',
					}));
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
					store.dispatch(addUsersToChat, {users: JSON.parse(`[${users}]`), chatId: store.getState().currentChatId});
				}
			},
			removeUsers: () => {
				const users = prompt('Идентификаторы пользователей для удаления', 'Например: 123,456');
				if (users) {
					store.dispatch(removeUsersFromChat, {users: JSON.parse(`[${users}]`), chatId: store.getState().currentChatId});
				}
			}
		}
	}

	render() {
		console.log('render', this);
		const {value, error, messages} = this.state;
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
}
