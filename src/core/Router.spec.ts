import { assert } from 'chai';

import router, {Router} from "./Router";
import Block from "./Block";
import Route from "./Route";
import registerComponent from "./registerComponent";

class TestBlock extends Block {}
registerComponent(TestBlock);

describe('Router', function () {
	const appElement = document.createElement('div');
	appElement.id = 'app';
	document.body.appendChild(appElement);

	it('должен конструироваться', function () {
		assert.instanceOf(router, Router);
	});

	it('должен инициализироваться', function () {
		router.init();
		assert.isFunction(window.onpopstate);
	});

	it('должен уметь добавлять роуты', function () {
		router.use('/', TestBlock);
		router.use('/another/route', TestBlock);
		assert.instanceOf(router.getRoute('/'), Route);
		assert.instanceOf(router.getRoute('/another/route'), Route);
		assert.isNull(router.getRoute('/null/route'));
	});

	it('должен уметь ходить', function () {
		router.go('/another/route');
		assert.equal(window.location.pathname, '/another/route');
	});
});
