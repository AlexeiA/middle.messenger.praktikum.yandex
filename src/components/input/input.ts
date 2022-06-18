import Block from '../../core/Block';
import {InputBaseProps} from "../input-base";

import './input.css';
import {validateValue, ValidationRule} from "../../helpers/validator";

interface InputProps extends InputBaseProps {
	label?: string;
	error?: string;
	validationRule?: ValidationRule;
}

export class Input extends Block {
	constructor({label, validationRule, error, ...props}: InputProps) {
		super({label, validationRule, error, ...props,
			onBlur: (e: FocusEvent) => {
				const input = e.target as HTMLInputElement;
				const value = input.value;
				if (validationRule) {
					const error = validateValue(validationRule, value);
					this.refs.error.setProps({text: error});
				}
			},
			onFocus: () => {
				this.refs.error.setProps({text: ''});
			}
		});
	}

	protected render(): string {
		// language=hbs
		return `
			<div class="input">
				<div class="input__label">{{label}}</div>
				{{{InputBase
					type=type
					placeholder=placeholder
					value=value
					onBlur=onBlur
					onFocus=onFocus
					ref="input"
				}}}
				{{{ErrorComponent ref="error" text=error}}}
			</div>
		`
	}
}
