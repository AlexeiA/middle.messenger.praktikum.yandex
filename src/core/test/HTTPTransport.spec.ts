import { assert } from "chai";
import HTTPTransport from "../HTTPTransport";
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const endpoint = 'www.server.com';

const url = `${endpoint}/`;

const handlers = [
	rest.get(url, (_req, res, ctx) => {
		return res(ctx.status(200), ctx.body('test get'));
	}),
	rest.post(url, (_req, res, ctx) => {
		return res(ctx.status(200), ctx.body('test post'));
	}),
	rest.put(url, (_req, res, ctx) => {
		return res(ctx.status(200), ctx.body('test put'));
	}),
	rest.delete(url, (_req, res, ctx) => {
		return res(ctx.status(200), ctx.body('test delete'));
	}),
];

const server = setupServer(...handlers);
server.listen();

describe('Тест HTTPTransport', function () {
	it('Должен конструироваться', function () {
		const http = new HTTPTransport();
		assert.instanceOf(http, HTTPTransport);
	})

	it('Должен конструироваться с параметрами', function () {
		const opts = {
			credentials: true,
			data: 'data',
			headers: {'Content-Type': 'text/plain'},
			timeout: 1000
		};
		const http = new HTTPTransport(opts);
		assert.instanceOf(http, HTTPTransport);
		assert.deepEqual(http.options, opts);
	})

	it('Должен работать get', async function () {
		await test('get');
	})

	it('Должен работать post', async function () {
		await test('post');
	})

	it('Должен работать put', async function () {
		await test('put');
	})

	it('Должен работать delete', async function () {
		await test('delete');
	})

	async function test(verb: 'get' | 'post' | 'put' | 'delete') {
		const http = new HTTPTransport();
		const resp = await http[verb](url);
		assert.instanceOf(resp, XMLHttpRequest);
		assert.equal(resp.status, 200);
		assert.equal(resp.responseText, 'test ' + verb);
	}
})
