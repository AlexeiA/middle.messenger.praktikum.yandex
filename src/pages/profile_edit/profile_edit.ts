import Block from '../../core/Block';

import './profile_edit.pcss';
import {validateValue, ValidationRule} from "../../helpers/validator";

export class ProfileEditPage extends Block {
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
			{{#Layout name="ProfileEdit" }}
				<main class="login__main">
					<h1>Профиль</h1>
					<form>
						{{{Input
							label="Имя"
							value="${values.first_name}"
							error="${errors.first_name}"
							ref="first_name"
							id="first_name"
							type="text"
							placeholder=""
							validationRule="${ValidationRule.Name}"
						}}}
						{{{Input
							label = "Фамилия"
							value="${values.second_name}"
							error="${errors.second_name}"
							ref="second_name"
							id="second_name"
							type="text"
							placeholder=""
							validationRule="${ValidationRule.Name}"
						}}}
						{{{Input
							label = "Имя в чате"
							value="${values.display_name}"
							error="${errors.display_name}"
							ref="display_name"
							id="display_name"
							type="text"
							placeholder=""
							validationRule="${ValidationRule.Login}"
						}}}
						{{{Input
							label = "Электронная почта"
							value="${values.email}"
							error="${errors.email}"
							ref="email"
							id="email"
							type="email"
							placeholder=""
							validationRule="${ValidationRule.Email}"
						}}}
						{{{Input
							label = "Телефон"
							value="${values.phone}"
							error="${errors.phone}"
							ref="phone"
							id="phone"
							type="tel"
							placeholder=""
							validationRule="${ValidationRule.Phone}"
						}}}
						{{{Input
							label = "Файл с портретом"
							value="${values.avatar}"
							error="${errors.avatar}"
							ref="avatar"
							id="avatar"
							type="file"
							placeholder=""
						}}}
						{{{Input
							label="Логин"
							value="${values.login}"
							error="${errors.login}"
							ref="login"
							id="login"
							type="text"
							placeholder=""
							validationRule="${ValidationRule.Login}"
						}}}
						{{{Input
							label = "Старый пароль"
							value="${values.oldPassword}"
							error="${errors.oldPassword}"
							ref="oldPassword"
							id="oldPassword"
							type="password"
							placeholder=""
						}}}
						{{{Input
							label = "Новый пароль"
							value="${values.newPassword}"
							error="${errors.newPassword}"
							ref="newPassword"
							id="newPassword"
							type="password"
							placeholder=""
							validationRule="${ValidationRule.Password}"
						}}}
						{{{Button
							text="Сохранить"
							onClick=onSave
						}}}
						{{{Link
							text="Назад к чатам"
							to="#ChatPage"
						}}}
					</form>
				</main>
			{{/Layout}}
		`;
	}
}