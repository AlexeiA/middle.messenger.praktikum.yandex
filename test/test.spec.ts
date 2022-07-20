import { assert, expect } from 'chai';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const window = new JSDOM('<html/>', {
	url: 'https://www.simplechat.ru/'
}).window;

describe('Array', function () {
	describe('#indexOf()', function () {
		it('should return -1 when the value is not present', function () {
			assert.equal([1, 2, 3].indexOf(4), -1);
		});
	});
});

describe("Typescript + Babel usage suite", () => {
	it("should return string correctly", () => {
		expect("Hello" + "mocha" === "Hello mocha");
	});
	it("should return string", () => {
		assert.typeOf(window.document.location.pathname, 'string');
	});
});
