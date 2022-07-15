import Block from '../../core/Block';

import './link.css';
import {renderDOM} from "../../core";
import ErrorPage from "../../pages/error";

export interface LinkProps {
	text: string;
	to: string;
}

export class Link extends Block {
	constructor(props: LinkProps) {
		const onClick = (e: MouseEvent) => {
			console.log('Link onClick()', this);
			//TODO нужно ли router.go(this.props.to);
			try {
				const to = this.props.to;
				let app;
				switch (to.substring(1)) {
					case "404":
						app = new ErrorPage({
							h1: "404",
							h2: "Не туда попали"
						});
						break;
					case "500":
						app = new ErrorPage({
							h1: "500",
							h2: "Уже фиксим"
						});
						break;
					default:
						document.location.href = to;
				}
				if (app) {
					renderDOM(app);
				}
			}
			catch (err) {
				console.error(err);
				//TODO this.eventBus().emit('error')
			}
			e.preventDefault();
		}

		super({...props, events: {click: onClick}});
	}

	render() {
		// language=hbs
		return `<a href="{{to}}">{{text}}</a>`;
	}
}
