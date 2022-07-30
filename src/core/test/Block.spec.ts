import { assert } from "chai";
import Button from "../../components/button";
import renderBlock from "../renderBlock";

describe('Тест Block', function () {
	it ('Попробуем отрендерить кнопку', function () {
		const button = new Button({text: 'Я кнопка', onClick: () => {}});
		assert.instanceOf(button, Button);
		document.body.innerHTML = '<div id="app"></div>';
		renderBlock('#app', button);
		assert.instanceOf(document.querySelector('button'), HTMLButtonElement);
	})

	it ('Попробуем кликнуть на кнопку', function () {
		const button = new Button({text: 'Я кнопка', onClick: () => {
			document.querySelector('button')!.value = 'Я нажатая кнопка';
		}});
		assert.instanceOf(button, Button);
		document.body.innerHTML = '<div id="app"></div>';
		renderBlock('#app', button);
		const buttonElement = document.querySelector('button');
		assert.instanceOf(buttonElement, HTMLButtonElement);
		buttonElement!.click();
		assert.equal(buttonElement!.value, 'Я нажатая кнопка');
	})
})
