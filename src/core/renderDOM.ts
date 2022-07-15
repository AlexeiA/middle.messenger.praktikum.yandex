import Block from './Block';

export default function renderDOM(block: Block) {
  const root = document.querySelector('#app');
  root!.innerHTML = '';
  root!.appendChild(block.getContent());
}

export function render(query: string, block: Block) {
	const root = document.querySelector(query);
	root!.innerHTML = '';
	root!.appendChild(block.getContent());
}
