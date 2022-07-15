import Block from '../../core/Block';

import './button.css';

interface ButtonProps {
  disabled?: boolean;
  text: string;
  onClick: () => void;
}

export class Button extends Block {
  constructor({text, onClick}: ButtonProps) {
    super({text, events: {click: onClick}});
  }

  protected render(): string {
    // language=hbs
    return `
        <button class="button__button" type="button" {{#if disabled}}disabled{{/if}}>{{text}}</button>
    `;
  }
}
