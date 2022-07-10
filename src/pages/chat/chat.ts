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
                	{{{ChatsBlock
					}}}
                </div>
				<div class="chat">
					<div class="chat-header">
						Первый контакт
					</div>
					<hr>
					<div class="history">
						<p class="message to">Lorem ipsum dolor sit amet.</p>
						<p class="message to">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
						<p class="message from">Lorem ipsum dolor.</p>
						<p class="message from">Lorem ipsum dolor sit amet.</p>
						<p class="message to">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto, excepturi.</p>
						<p class="message from">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
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
