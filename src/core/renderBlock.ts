import Block from './Block';

export default function renderBlock(query: string, block: Block) {
	const root = document.querySelector(query);
	root!.innerHTML = '';
	root!.appendChild(block.getContent());
}
