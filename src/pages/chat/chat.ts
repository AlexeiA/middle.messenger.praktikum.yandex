import Block from '../../core/Block';

import './chat.pcss';
import {validateValue, ValidationRule} from "../../helpers/validator";
import store from "../../core/Store";
import {addUsersToChat, createChat, getToken, removeUsersFromChat} from "./chat_api";

type Message = {
	content: string,
	direction: 'in' | 'out'
}

export class ChatPage extends Block {
	constructor() {
		console.log('constructor', 'ChatPage');
		super();
		store.on('changed', (prevState, nextState) => {
			console.log('ChatPage changed', prevState, nextState);
			const token = store.getState().currentToken;
			console.log(token);
			const userId = store.getState().user.id;
			const chatId = 361;
			if (this.socket == null && token) {
				this.socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`);
				this.socket.addEventListener('open', () => {
					console.log('Соединение установлено');
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
						this.state.messages.push({content: data.content, direction: data.user_id == store.getState().user.id ? 'out' : 'in'});
						this.setState({messages: this.state.messages});
					}
					else if (data.type == 'user connected') {
						this.state.messages.push({content: `Пользователь ${data.content} подключился`, direction: 'in'});
						this.setState({messages: this.state.messages});
					}
				});

				this.socket.addEventListener('error', event => {
					console.log('Ошибка', event.message);
				});
			}
		});
		store.dispatch(getToken, 361);
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
					store.dispatch(addUsersToChat, {users: JSON.parse(`[${users}]`), chatId: 361});
				}
			},
			removeUsers: () => {
				const users = prompt('Идентификаторы пользователей для удаления', 'Например: 123,456');
				if (users) {
					store.dispatch(removeUsersFromChat, {users: JSON.parse(`[${users}]`), chatId: 361});
				}
			}
		}
	}

	render() {
		console.log('render', this);
		const {value, error, messages} = this.state;
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
						}}}
                        {{{Button
							text="Удалить собеседников"
							onClick=removeUsers
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
