import { render } from "./renderDOM";
import Block from "./Block";

export class Route {
	constructor(pathname: string, view: new() => Block, props?: {}) {
		this._pathname = pathname;
		this._blockClass = view;
		this._block = null;
		this._props = props;
	}

	private _pathname: string;
	private _blockClass;
	private _block: Nullable<Block>;
	private _props: any;

	navigate(pathname: string) {
		if (this.match(pathname)) {
			this._pathname = pathname;
			this.render();
		}
	}

	leave() {
		if (this._block) {
			this._block.hide();
		}
	}

	match(pathname: string) {
		return pathname === this._pathname;
	}

	render() {
		if (!this._block) {
			this._block = new this._blockClass();
			render(this._props.rootQuery, this._block);
			return;
		}

		this._block.show();
	}
}

class Router {
	constructor(rootQuery: string) {
		this._rootQuery = rootQuery;
	}

	private routes: Route[] = [];
	private history = window.history;
	private _currentRoute: Nullable<Route> = null;
	private _rootQuery: string;

	use(pathname: string, block: new() => Block) {
		const route = new Route(pathname, block, {rootQuery: this._rootQuery});
		this.routes.push(route);
		return this;
	}

	start(pathname?: string) {
		this.init();
		if (pathname) {
			this._onRoute(pathname);
		}
		else {
			this._onRoute(window.location.pathname);
		}
	}

	init() {
		window.onpopstate = this.onpopstate;
		return this;
	}

	private onpopstate = (event: PopStateEvent)  => {
		// @ts-ignore
		this._onRoute(event.currentTarget.location.pathname);
	};

	_onRoute(pathname: string) {
		console.log('_onRoute', pathname);
		let route = this.getRoute(pathname);
		if (!route) {
			if (pathname !== '/404') {
				route = this.getRoute('/404');
			}
			if (!route) {
				throw new Error('pathname is not registered');
			}
		}

		if (this._currentRoute) {
			this._currentRoute.leave();
		}

		this._currentRoute = route;
		this._currentRoute.render();
	}

	go(pathname: string) {
		this.history.pushState({}, "", pathname);
		this._onRoute(pathname);
	}

	back() {
		this.history.back()
	}

	forward() {
		this.history.forward()
	}

	getRoute(pathname: string) {
		return this.routes.find(route => route.match(pathname)) || null;
	}
}

export default new Router('#app');
