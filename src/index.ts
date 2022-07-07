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
import ProfileEditPage from "./pages/profile_edit";
import ErrorPage from "./pages/error";

registerComponent(Button);
registerComponent(Link);
registerComponent(Input);
registerComponent(Layout);
registerComponent(InputBase);
registerComponent(ErrorComponent);
registerComponent(ChatSummary);

document.addEventListener("DOMContentLoaded", () => {
	// 		{to: "#404", text: "Страница 404"},
	// 		{to: "#500", text: "Страница 5**"},
	router
		.use('/', LoginPage)
		.use('/sign-up', RegisterPage)
		.use('/messenger', ChatPage)
		.use('/settings', ProfileEditPage)
		.start();
});
