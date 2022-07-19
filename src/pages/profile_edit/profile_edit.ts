import Block from '../../core/Block';

import './profile_edit.pcss';
import {validateValue, ValidationRule} from "../../helpers/validator";
import store from "../../core/Store";
import {updateUser} from "./user_api";

export class ProfileEditPage extends Block {
	constructor() {
		super();
		store.on('changed', (prevState, nextState) => {
			console.log('onstorechanged', prevState, nextState);
			this.setState({values: {...nextState.user, currentAvatar: nextState.user.avatar}});
			this.render();
		});
	}

	protected getStateFromProps() {
		console.log('getStateFromProps', this);
		this.state = {
			values: { ...store.getState().user, currentAvatar: store.getState().user?.avatar },
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
				const userData = {
					//TODO DRY
					display_name: (this.refs.display_name.refs.input.element as HTMLInputElement).value,
					first_name: (this.refs.first_name.refs.input.element as HTMLInputElement).value,
					second_name: (this.refs.second_name.refs.input.element as HTMLInputElement).value,
					email: (this.refs.email.refs.input.element as HTMLInputElement).value,
					phone: (this.refs.phone.refs.input.element as HTMLInputElement).value,
					avatar: (this.refs.avatar.refs.input.element as HTMLInputElement).value,
					login: (this.refs.login.refs.input.element as HTMLInputElement).value,
					oldPassword: (this.refs.oldPassword.refs.input.element as HTMLInputElement).value,
					newPassword: (this.refs.newPassword.refs.input.element as HTMLInputElement).value,
					currentAvatar: this.state.values.currentAvatar
				};
				console.log(userData);
				const nextState = {
					errors: {
						display_name: validateValue(ValidationRule.Login, userData.display_name),
						first_name: validateValue(ValidationRule.Name, userData.first_name),
						second_name: validateValue(ValidationRule.Name, userData.second_name),
						email: validateValue(ValidationRule.Email, userData.email),
						phone: validateValue(ValidationRule.Phone, userData.phone),
						avatar: '',
						login: validateValue(ValidationRule.Login, userData.login),
						oldPassword: '',
						newPassword: validateValue(ValidationRule.Password, userData.newPassword),
					},
					values: {...userData},
				};
				const fileInput = document.querySelector('main form input[type=file]') as HTMLInputElement;
				// @ts-ignore
				const avatarData = nextState.values.avatar !== this.state.values.avatar ? fileInput.files[0] : null;
				this.setState(nextState);

				const hasError = Object.values(nextState.errors).some(val => val !== '');
				if (!hasError) {
					const userDataExt = {...userData, avatarData };
					store.dispatch(updateUser, userDataExt);
				}
			}
		}
	}

	render() {
		const {errors, values} = this.state;
		const avatar = 'https://ya-praktikum.tech/api/v2' + '/resources' + this.state.values.currentAvatar;
		const isLoading = store.getState().isLoading;
		console.log(`avatar=${avatar}`);
		// language=hbs
		return `
			{{#Layout name="ProfileEdit" }}
				<main class="login__main">
					<h1>Профиль</h1>
					<img class="avatar profile__avatar" src="${avatar}" alt="Аватарка">
					<form>
						{{{Input
							label="Имя"
							value="${values.first_name || ''}"
							error="${errors.first_name}"
							ref="first_name"
							id="first_name"
							type="text"
							placeholder=""
							validationRule="${ValidationRule.Name}"
						}}}
						{{{Input
							label = "Фамилия"
							value="${values.second_name || ''}"
							error="${errors.second_name}"
							ref="second_name"
							id="second_name"
							type="text"
							placeholder=""
							validationRule="${ValidationRule.Name}"
						}}}
						{{{Input
							label = "Имя в чате"
							value="${values.display_name || ''}"
							error="${errors.display_name}"
							ref="display_name"
							id="display_name"
							type="text"
							placeholder=""
							validationRule="${ValidationRule.Login}"
						}}}
						{{{Input
							label = "Электронная почта"
							value="${values.email || ''}"
							error="${errors.email}"
							ref="email"
							id="email"
							type="email"
							placeholder=""
							validationRule="${ValidationRule.Email}"
						}}}
						{{{Input
							label = "Телефон"
							value="${values.phone || ''}"
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
							disabled="${isLoading}"
						}}}
						{{{Link
							text="Назад к чатам"
							to="/messenger"
						}}}
					</form>
				</main>
			{{/Layout}}
		`;
	}
}
