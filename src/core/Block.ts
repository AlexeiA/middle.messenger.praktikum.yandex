import EventBus from './EventBus';
import {nanoid} from 'nanoid';
import Handlebars from 'handlebars';

type Events = Values<typeof Block.EVENTS>;

export default abstract class Block<P = any> {
	static EVENTS = {
		INIT: 'init',
		FLOW_CDM: 'flow:component-did-mount',
		FLOW_CDU: 'flow:component-did-update',
		FLOW_RENDER: 'flow:render',
		FLOW_RENDER_COMPLETE: 'flow:render-complete',
	} as const;

	public id = nanoid(6);

	protected _element: Nullable<HTMLElement> = null;
	protected readonly props: P;
	protected children: { [id: string]: Block } = {};

	eventBus: () => EventBus<Events>;

	protected state: any = {};
	public readonly refs: { [key: string]: Block } = {};

	private _parentElement: Nullable<HTMLElement> = null;

	public constructor(props?: P) {
		const eventBus = new EventBus<Events>();

		this.getStateFromProps(props)

		this.props = this._makePropsProxy(props || {} as P);
		this.state = this._makePropsProxy(this.state);

		this.eventBus = () => eventBus;

		this._registerEvents(eventBus);

		eventBus.emit(Block.EVENTS.INIT, this.props);
	}

	_registerEvents(eventBus: EventBus<Events>) {
		eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
		eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
		eventBus.on(Block.EVENTS.FLOW_RENDER_COMPLETE, this.renderComplete.bind(this));
	}

	_createResources() {
		this._element = this._createDocumentElement('div');
	}

	protected getStateFromProps(_props: any): void {
		this.state = {};
	}

	init() {
		this._createResources();
		this.eventBus().emit(Block.EVENTS.FLOW_RENDER, this.props);
	}

	private _componentDidMount(props: P) {
		console.log('_componentDidMount', this, props);
		this.componentDidMount(props);
	}

	componentDidMount(_props: P) {
	}

	private _componentDidUpdate(oldProps: P, newProps: P) {
		console.log('_componentDidUpdate', oldProps, newProps);
		const response = this.componentDidUpdate(oldProps, newProps);
		if (!response) {
			return;
		}
		this._render();
	}

	componentDidUpdate(_oldProps: P, _newProps: P) {
		return true;
	}

	setProps = (nextProps: P) => {
		if (!nextProps) {
			return;
		}

		Object.assign(this.props, nextProps);
	};

	setState = (nextState: any) => {
		if (!nextState) {
			return;
		}

		Object.assign(this.state, nextState);
	};

	get element() {
		return this._element;
	}

	private _render() {
		console.log('_render()', this);

		const fragment = this._compile();

		this._removeEvents();
		const newElement = fragment.firstElementChild!;

		this._element!.replaceWith(newElement);

		this._element = newElement as HTMLElement;
		this._addEvents();

		this.eventBus().emit(Block.EVENTS.FLOW_RENDER_COMPLETE);
	}

	protected render(): string {
		return '';
	};

	protected renderComplete(): void {

	}

	getContent(): HTMLElement {
		// ??????, ?????????? ?????????????? CDM ???????????? ?????????? ???????????????????? ?? DOM
		if (this.element?.parentNode?.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
			setTimeout(() => {
				if (this.element?.parentNode?.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
					this.eventBus().emit(Block.EVENTS.FLOW_CDM);
				}
			}, 100)
		}

		return this.element!;
	}

	_makePropsProxy(props: any): any {
		return new Proxy(props as unknown as object, {
			get(target: Record<string, unknown>, prop: string) {
				const value = target[prop];
				return typeof value === 'function' ? value.bind(target) : value;
			},
			set: (target: Record<string, unknown>, prop: string, value: unknown) => {
				target[prop] = value;

				// ?????????????????? ???????????????????? ????????????????????
				// ???????????? cloneDeep, ?? ???????? ???????????????? ?????????? ???????????????????? ?????????????????? cloneDeep ???? ??????????
				this.eventBus().emit(Block.EVENTS.FLOW_CDU, {...target}, target);
				return true;
			},
			deleteProperty() {
				throw new Error('?????? ??????????????');
			},
		}) as unknown as P;
	}

	_createDocumentElement(tagName: string) {
		return document.createElement(tagName);
	}

	_removeEvents() {
		const events: Record<string, () => void> = (this.props as any).events;

		if (!events || !this._element) {
			return;
		}


		Object.entries(events).forEach(([event, listener]) => {
			this._element!.removeEventListener(event, listener);
		});
	}

	_addEvents() {
		const events: Record<string, () => void> = (this.props as any).events;

		if (!events) {
			return;
		}

		Object.entries(events).forEach(([event, listener]) => {
			this._element!.addEventListener(event, listener);
		});
	}

	_compile(): DocumentFragment {
		const fragment = document.createElement('template');

		/**
		 * ???????????????? ????????????
		 */
		const template = Handlebars.compile(this.render());
		fragment.innerHTML = template({...this.state, ...this.props, children: this.children, refs: this.refs});

		/**
		 * ???????????????? ???????????????? ???? ????????????????????
		 */
		Object.entries(this.children).forEach(([id, component]) => {
			/**
			 * ???????? ???????????????? ???? id
			 */
			const stub = fragment.content.querySelector(`[data-id="${id}"]`);
			if (!stub) {
				return;
			}

			const stubChilds = stub.childNodes.length ? stub.childNodes : [];

			/**
			 * ???????????????? ???????????????? ???? component._element
			 */
			const content = component.getContent();
			stub.replaceWith(content);

			/**
			 * ???????? ?????????????? layout-??, ???????? ?????????????????? ??????????
			 */
			const layoutContent = content.dataset.layout === '1' ? content : content.querySelector('[data-layout="1"]');
			if (layoutContent && stubChilds.length) {
				layoutContent.append(...stubChilds);
			}
		});

		/**
		 * ???????????????????? ????????????????
		 */
		return fragment.content;
	}


	show() {
		this.getContent().style.display = 'block';
		return this;
	}

	hide() {
		this.getContent().style.display = 'none';
		return this;
	}

	attach() {
		return this.attachTo(this._parentElement);
	}

	attachTo(parent: HTMLElement | null) {
		const content = this.getContent();
		if (content && !content.parentElement) {
			const parentElement = parent;
			if (parentElement) {
				parentElement.appendChild(content);
			}
			this._parentElement = parentElement;
		}
		return this;
	}

	detach() {
		const content = this.getContent();
		if (content.parentElement) {
			this._parentElement = content.parentElement;
			content.parentElement.removeChild(content);
		}
		return this;
	}
}
