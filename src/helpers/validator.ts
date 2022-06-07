export enum ValidationRule {
	Login = 'Login',
	Email = 'Email',
	Password = 'Password',
}

export function validateValue(rule: ValidationRule, value: string) {
	switch (rule) {
		case ValidationRule.Login:
			if (value.length < 3 || value.length > 20) {
				return 'Длина должна быть от 3 до 20 символов';
			}
			if (/^d\+$/.test(value)) {
				return 'Не может состоять только из цифр';
			}
			if (!/^[a-z\d-_]+$/i.test(value)) {
				return 'Латиница и цифры, без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание)';
			}
			break;
		case ValidationRule.Email:
			if (!/^[a-z\d-_]+@[a-z\d-_]*[a-z]\.[a-z]+$/i.test(value)) {
				return 'Латиница и цифры, может включать спецсимволы вроде дефиса, обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы';
			}
			break;
		case ValidationRule.Password:
			if (!/^(.*[A-Z].*){8, 40}$/.test(value)) {
				if (!/\d/.test(value)) {
					return 'Должна быть хотя бы одна цифра.';
				}
				if (value.length < 8 || value.length > 40) {
					return 'Длина должна быть от 8 до 40 символов';
				}
				return 'От 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра.';
			}
			break;
	}
	return null;
}