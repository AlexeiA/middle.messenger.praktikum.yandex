import Block from '../../core/Block';

import './error.pcss';

interface ErrorPageProps {
	h1?: string,
	h2?: string
}

export class ErrorPage extends Block {
	constructor({h1, h2}: ErrorPageProps) {
		super({h1, h2});
	}

	render() {
		// language=hbs
		return `
			{{#Layout name="Error" }}
				<main class="error-page__main">
					<h1>{{h1}}</h1>
					<p class="center">{{h2}}</p>
					<div class="error-page__whitespace-div"></div>
					<a href="/">Назад к чатам</a>
				</main>
			{{/Layout}}
		`;
	}
}
