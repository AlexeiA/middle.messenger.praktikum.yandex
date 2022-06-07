import Block from '../../core/Block';

import './layout.pcss';

interface LayoutProps {}

export class Layout extends Block<LayoutProps> {
  protected render(): string {
    // language=hbs
    return `
      <main data-layout="1"></main>
    `
  }
}