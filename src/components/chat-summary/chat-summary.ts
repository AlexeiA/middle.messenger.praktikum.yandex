import Block from '../../core/Block';
import store from "../../core/Store";

import './chat-summary.pcss';

interface ChatSummaryProps {
	id: number;
	display_name: string;
	img: string;
	message: string;
	message_time: string;
	unread_count: number;
	onClick: () => void;
}

export class ChatSummary extends Block {
	constructor({onClick = () => {console.log('click')}, ...props}: ChatSummaryProps) {
		super({...props, events: {click: onClick }});
	}

	protected render(): string {
		const isCurrent = this.props.id == store.getState().currentChatId;
		const time = this.props.message_time?.substring(11, 11 + 5);
		// language=hbs
		return `
			<div class="chat-summary {{#if ${isCurrent}}}chat-summary_selected{{/if}}" data-id="{{id}}">
				<div class="avatar"><img class="avatar chat-summary__avatar" src="{{#if img}}${process.env.API_ENDPOINT}/resources{{img}}{{else}}/static/chat_avatar_generic.png{{/if}}" alt="{{display_name}}"></div>
				<div class="message-block">
					<p class="display-name">{{display_name}}</p>
					<p class="time"><time datetime="{{message_time}}">${time}</time></p>
					<p class="message">{{message}}</p>
					{{#if unread_count}}<div class="unread-count">{{unread_count}}</div>{{/if}}
				</div>
			</div>
		`
	}
}
