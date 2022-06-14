import Block from '../../core/Block';

import './chat.pcss';
import {validateValue, ValidationRule} from "../../helpers/validator";

export class ChatPage extends Block {
	protected getStateFromProps() {
		this.state = {
			value: '',
			error: '',
			sendMessage: () => {
				const value = (this.refs.message.refs.input.element as HTMLInputElement).value;
				const nextState = {
					value: value,
					error: validateValue(ValidationRule.Message, value)
				};
				this.setState(nextState);
			}
		}
	}

	render() {
		const {value, error} = this.state;
		// language=hbs
		return `
			{{#Layout name="Chat" }}
				<div class="chats">
					{{{ChatSummary
						display_name = 'Тот парень'
						img = '/static/avatar_generic.png'
						message = 'Крайнее сообщение от парня'
						message_time = '01:23'
					}}}
					{{{ChatSummary
						display_name = 'Тот девушка'
						img = '/static/avatar_generic.png'
						message = 'Крайнее сообщение от девушки'
						message_time = '02:34'
					}}}
					{{{ChatSummary
						display_name = 'Тот бабушка'
						img = '/static/avatar_generic.png'
						message = 'Крайнее сообщение от бабушки'
						message_time = '03:45'
					}}}
                </div>
				<div class="chat">
					<div class="chat-header">
						Тот девушка
					</div>
					<hr>
					<div class="history">
						<p class="message to">Я помню чудное мгновенье</p>
						<p class="message to">Передо мной явилось ты</p>
						<p class="message from">Явился</p>
						<p class="message from">Явилась*</p>
						<p class="message to">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto, excepturi.</p>
						<p class="message from">О, ты знаешь латынь О_о</p>
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
