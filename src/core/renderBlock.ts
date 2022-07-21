import Block from './Block';

export default function renderBlock(query: string, block: Block) {
	const root = document.querySelector(query) as HTMLElement;
	root.innerHTML = '';
	block.attach(root);
}
