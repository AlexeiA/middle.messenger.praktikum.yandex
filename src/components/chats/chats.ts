import Block from '../../core/Block';

import './chats.pcss';
import store from "../../core/Store";
import {getChats} from "../../pages/chat/chat_api";

//TODO sort chats by time

export class ChatsBlock extends Block {
	constructor() {
		console.log('constructor ChatsBlock');
		super({onClick: (event: Event) => {
			// @ts-ignore
			store.dispatch({currentChatId: parseInt(event.currentTarget.dataset.id)});
		}});
		store.on('changed', (_, __) => {
			this.setState({chats: store.getState().chats});
		});
		store.dispatch(getChats);
	}

	protected getStateFromProps() {
		this.state = {
			chats: []
		}
	}

	render() {
		// language=hbs
		return `
			<div>
				{{#if chats}}
                    {{#each chats}}
                        {{{ChatSummary
							id = this.id
							display_name = this.title
							img = this.last_message.user.avatar
							message = this.last_message.content
							message_time = this.last_message.time
							unread_count = this.unread_count
							onClick = @root.onClick
                        }}}
                    {{/each}}
				{{else}}
					{{#if isLoading}}
						Загрузка...
					{{/if}}
				{{/if}}
            </div>
		`;
	}
}
