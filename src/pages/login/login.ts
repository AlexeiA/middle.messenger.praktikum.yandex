import Block from '../../core/Block';

import './login.pcss';
import {validateValue, ValidationRule} from "../../helpers/validator";

export class LoginPage extends Block {
	protected getStateFromProps() {
		this.state = {
			values: {
				login: '',
				password: '',
			},
			errors: {
				login: '',
				password: '',
			},
			onLogin: () => {
				const loginData = {
					login: (this.refs.login.refs.input.element as HTMLInputElement).value,
					password: (this.refs.password.refs.input.element as HTMLInputElement).value
				};
				console.log(loginData);
				const nextState = {
					errors: {
						login: validateValue(ValidationRule.Login, loginData.login),
						password: validateValue(ValidationRule.Password, loginData.password),
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
			{{#Layout name="Login" }}
				<main class="login__main">
					<form>

						{{{Input
							label="Имя"
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
							text="Войти"
							onClick=onLogin
						}}}
					</form>
				</main>
			{{/Layout}}
		`;
	}
}
