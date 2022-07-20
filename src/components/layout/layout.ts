import Block from '../../core/Block';

import './layout.pcss';

export class Layout extends Block {
	protected render(): string {
		// language=hbs
		return `
			<div data-layout="1"></div>
		`
	}
}
