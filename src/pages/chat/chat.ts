import Block from '../../core/Block';

import './chat.pcss';
import {validateValue, ValidationRule} from "../../helpers/validator";

export class ChatPage extends Block {
	protected getStateFromProps() {
		this.state = {
			values: {
				display_name: '',
				first_name: '',
				second_name: '',
				email: '',
				phone: '',
				avatar: '',
				login: '',
				oldPassword: '',
				newPassword: '',
			},
			errors: {
				display_name: '',
				first_name: '',
				second_name: '',
				email: '',
				phone: '',
				avatar: '',
				login: '',
				oldPassword: '',
				newPassword: '',
			},
			onSave: () => {
				const loginData = {
					//TODO DRY
					display_name: (this.refs.display_name.refs.input.element as HTMLInputElement).value,
					first_name: (this.refs.first_name.refs.input.element as HTMLInputElement).value,
					second_name: (this.refs.second_name.refs.input.element as HTMLInputElement).value,
					email: (this.refs.email.refs.input.element as HTMLInputElement).value,
					phone: (this.refs.phone.refs.input.element as HTMLInputElement).value,
					avatar: (this.refs.avatar.refs.input.element as HTMLInputElement).value,
					login: (this.refs.login.refs.input.element as HTMLInputElement).value,
					oldPassword: (this.refs.oldPassword.refs.input.element as HTMLInputElement).value,
					newPassword: (this.refs.newPassword.refs.input.element as HTMLInputElement).value
				};
				const nextState = {
					errors: {
						display_name: validateValue(ValidationRule.Login, loginData.display_name),
						first_name: validateValue(ValidationRule.Name, loginData.first_name),
						second_name: validateValue(ValidationRule.Name, loginData.second_name),
						email: validateValue(ValidationRule.Email, loginData.email),
						phone: validateValue(ValidationRule.Phone, loginData.phone),
						avatar: '',
						login: validateValue(ValidationRule.Login, loginData.login),
						oldPassword: '',
						newPassword: validateValue(ValidationRule.Password, loginData.newPassword),
					},
					values: {...loginData},
				};
				this.setState(nextState);
			}
		}
	}

	render() {
		const {errors, values} = this.state;

		// language=hbs
		return `
			{{#Layout name="Chat" }}
				<h1>Страница чатов и лента переписки (заглушка)</h1>
				<p class="center"><input name="message" placeholder="Сообщение"><button>></button></p>
			{{/Layout}}
		`;
	}
}
