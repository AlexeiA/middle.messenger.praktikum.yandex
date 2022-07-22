import { assert } from 'chai';

import router, {Router} from "./Router";

describe('Router', function () {
	it('должен конструироваться', function () {
		assert.instanceOf(router, Router);
	});
});
