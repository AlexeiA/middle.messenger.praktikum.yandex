import Block from '../../core/Block';
import router from "../../core/Router";
import './link.css';

export interface LinkProps {
	text: string;
	to: string;
}

export class Link extends Block {
	constructor(props: LinkProps) {
		const onClick = (e: MouseEvent) => {
			try {
				router.go(props.to);
			}
			catch (err) {
				console.error(err);
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
