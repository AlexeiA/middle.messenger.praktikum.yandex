import Block from '../../core/Block';

import './error.css';

export interface ErrorProps {
	text?: string;
}

export class ErrorComponent extends Block {
	protected render(): string {
		console.log('_render()', this);
		// language=hbs
		return `
			<div class="input__error" title="{{text}}">{{text}}</div>
		`
	}
}
