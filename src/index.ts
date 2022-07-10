import { registerComponent } from './core';
import router from './core/Router';

import './app.pcss';

import Button from './components/button';
import Link from './components/link';
import Input from './components/input';
import Layout from './components/layout';
import InputBase from "./components/input-base";
import ErrorComponent from "./components/error";
import ChatSummary from "./components/chat-summary";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ChatPage from "./pages/chat";
import ChatsBlock from "./components/chats";
import ProfileEditPage from "./pages/profile_edit";
import ErrorPage from "./pages/error";
import {LoginApi} from "./pages/login/login_api";
import store from "./core/Store";

registerComponent(Button);
registerComponent(Link);
registerComponent(Input);
registerComponent(Layout);
registerComponent(InputBase);
registerComponent(ErrorComponent);
registerComponent(ChatSummary);
registerComponent(ChatsBlock);

document.addEventListener("DOMContentLoaded", () => {
	router
		.use('/', LoginPage)
		.use('/sign-up', RegisterPage)
		.use('/messenger', ChatPage)
		.use('/settings', ProfileEditPage)
		.use('/404', ErrorPage)
		.use('/500', ErrorPage);

	LoginApi.user().then((user) => {
		store.set({user});
		if (window.location.pathname === '/') {
			router.start('/messenger');
		}
		else {
			router.start();
		}
	}, (reason) => {
		console.warn(reason);
		router.start();
	});
});
