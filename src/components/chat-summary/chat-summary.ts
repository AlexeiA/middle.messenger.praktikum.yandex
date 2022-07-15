import Block from '../../core/Block';

import './chat-summary.pcss';
import store from "../../core/Store";

interface ChatSummaryProps {
	id: number;
	display_name: string;
	img: string;
	message: string;
	time: string;//TODO time class
	unread_count: number;
	onClick: () => void;
}

export class ChatSummary extends Block {
	constructor({onClick = () => {console.log('click')}, ...props}: ChatSummaryProps) {
		super({...props, events: {click: onClick }});
	}

	protected render(): string {
		const isCurrent = this.props.id == store.getState().currentChatId;
		// language=hbs
		return `
			<div class="chat-summary {{#if ${isCurrent}}}chat-summary_selected{{/if}}" data-id="{{id}}">
				<div class="avatar"><img class="avatar chat-summary__avatar" src="{{#if img}}https://ya-praktikum.tech/api/v2/resources{{img}}{{else}}/static/chat_avatar_generic.png{{/if}}" alt="{{display_name}}"></div>
				<div class="message-block">
					<p class="display-name">{{display_name}}</p>
					<p class="time">{{message_time}}</p>
					<p class="message">{{message}}</p>
					{{#if unread_count}}<div class="unread-count">{{unread_count}}</div>{{/if}}
				</div>
			</div>
		`
	}
}
