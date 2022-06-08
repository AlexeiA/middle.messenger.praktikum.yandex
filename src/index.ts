import {renderDOM, registerComponent} from './core';

import './app.pcss';

import Button from './components/button';
import Link from './components/link';
import Input from './components/input';
import Layout from './components/layout';
import LinksPage from "./pages/links";
import InputBase from "./components/input-base";
import ErrorComponent from "./components/error";

registerComponent(Button);
registerComponent(Link);
registerComponent(Input);
registerComponent(Layout);
registerComponent(InputBase);
registerComponent(ErrorComponent);

document.addEventListener("DOMContentLoaded", () => {
	const App = new LinksPage({
		links: [
			{to: "#LoginPage", text: "Авторизация"},
			{to: "#register.hbs", text: "Регистрация"},
			{to: "#chat.hbs", text: "Список чатов и лента переписки"},
			{to: "#profile_edit.hbs", text: "Настройки пользователя"},
			{to: "#404", text: "Страница 404"},
			{to: "#500", text: "Страница 5**"},
		]
	});

	renderDOM(App);
});
