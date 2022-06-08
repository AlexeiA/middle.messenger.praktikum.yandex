import Block from '../../core/Block';

import './link.css';
import {renderDOM} from "../../core";
//TODO придумать другой способ вместо хардкода (или забить до изобретения Роутера)
import LoginPage from "../../pages/login";
// import LoginPage from "../../pages/login";

export interface LinkProps {
	text: string;
	to: string;
}

export class Link extends Block {
	constructor(props: LinkProps) {
		const onClick = (e: MouseEvent) => {
			console.log('Link onClick()', this);
			// const router = new Router();
			// router.go(this.props.to);
			try {
				const to = this.props.to;
				let app;
				switch (to.substring(1)) {
					case "LoginPage":
						app = new LoginPage();
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
