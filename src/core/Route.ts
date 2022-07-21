import Block from "./Block";
import renderBlock from "./renderBlock";

export default class Route {
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
			renderBlock(this._props.rootQuery, this._block);
			return;
		}

		this._block.show();
	}
}
