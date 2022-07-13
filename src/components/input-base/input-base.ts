import Block from '../../core/Block';

import './input-base.css';

export interface InputBaseProps {
	onBlur?: () => void;
	onFocus?: () => void;
	onInput?: () => void;
	type?: 'text' | 'password' | 'email';
	value?: string;
	placeholder?: string;
}

export class InputBase extends Block {
	constructor({
		onBlur = () => {console.log('blur')},
		onFocus = () => {console.log('focus')},
		onInput = () => {console.log('input')},
		...props
	}: InputBaseProps) {
		super({...props, events: {input: onInput, blur: onBlur, focus: onFocus}});
	}

	protected render(): string {
		console.log('render()', this);
		// language=hbs
		return `
			<input class="input" type="{{type}}" placeholder="{{placeholder}}" value="{{value}}">
		`
	}
}
