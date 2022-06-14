import Block from '../../core/Block';

import './chat-summary.pcss';

interface ChatSummaryProps {
	display_name: string;
	img: string;
	message: string;
	time: string;//TODO time class
}

export class ChatSummary extends Block {
	constructor(props: ChatSummaryProps) {
		super(props);
	}

	protected render(): string {
		// language=hbs
		return `
			<div class="chat-summary">
				<div class="avatar"><img src="{{img}}" alt="{{display_name}}"></div>
				<div class="message-block">
					<p class="display-name">{{display_name}}</p>
					<p class="time">{{message_time}}</p>
					<p class="message">{{message}}</p>
					<div class="unread-count">3</div>
				</div>
			</div>
		`
	}
}
