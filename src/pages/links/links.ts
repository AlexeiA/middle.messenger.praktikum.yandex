import Block from '../../core/Block';
import { LinkProps } from '../../components/link';

import './links.pcss';

interface LinksPageProps {
	links: Array<LinkProps>
}

export class LinksPage extends Block {
	constructor({links}: LinksPageProps) {
		super({links});
	}

	render() {
		// language=hbs
		return `
			{{#Layout name="Links" }}
				<main class="index-page__main">
					<h1>Симпл Чат</h1>
					<h2>Содержание</h2>
					<ul>
						{{#each links}}
							{{#with this}}
								<li>{{{Link text="{{text}}" to="{{to}}"}}}</li>
							{{/with}}
						{{/each}}
					</ul>
                </main>
			{{/Layout}}
		`;
	}
}
