import Block from '../../core/Block';
import store from '../../core/Store';
import {register} from './register_api'

import './register.pcss';
import {validateValue, ValidationRule} from "../../helpers/validator";

export class RegisterPage extends Block {
	protected getStateFromProps() {
		this.state = {
			values: {
				first_name: '',
				second_name: '',
				email: '',
				phone: '',
				login: '',
				password: '',
			},
			errors: {
				first_name: '',
				second_name: '',
				email: '',
				phone: '',
				login: '',
				password: '',
			},
			onLogin: () => {
				const loginData = {
					//TODO DRY
					first_name: (this.refs.first_name.refs.input.element as HTMLInputElement).value,
					second_name: (this.refs.second_name.refs.input.element as HTMLInputElement).value,
					email: (this.refs.email.refs.input.element as HTMLInputElement).value,
					phone: (this.refs.phone.refs.input.element as HTMLInputElement).value,
					login: (this.refs.login.refs.input.element as HTMLInputElement).value,
					password: (this.refs.password.refs.input.element as HTMLInputElement).value
				};
				console.log(loginData);
				const nextState = {
					errors: {
						first_name: validateValue(ValidationRule.Name, loginData.first_name),
						second_name: validateValue(ValidationRule.Name, loginData.second_name),
						email: validateValue(ValidationRule.Email, loginData.email),
						phone: validateValue(ValidationRule.Phone, loginData.phone),
						login: validateValue(ValidationRule.Login, loginData.login),
						password: validateValue(ValidationRule.Password, loginData.password),
					},
					values: {...loginData},
				};
				this.setState(nextState);

				const hasError = Object.values(nextState.errors).some(val => val !== '');
				if (!hasError) {
					console.log('store.dispatch', 'register', loginData)
					store.dispatch(register, loginData);
				}
			}
		}
	}

	render() {
		const {errors, values} = this.state;
		const isLoading = store.getState().isLoading;
		// language=hbs
		return `
			{{#Layout name="Login" }}
				<main class="login__main">
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
							label = "Пароль"
							value="${values.password}"
							error="${errors.password}"
							ref="password"
							id="password"
							type="password"
							placeholder=""
							validationRule="${ValidationRule.Password}"
						}}}
						{{{Button
							text="Зарегистрироваться"
							onClick=onLogin
							disabled="${isLoading}"
						}}}
						{{{Link
							text="Войти"
							to="/"
						}}}
					</form>
				</main>
			{{/Layout}}
		`;
	}
}
