import { MaybeLocalizedString, translate } from "../localization";

interface NodeProps {
  id?: string;
  class?: string;
  style?: string;
  onClick?: () => void;
  type?: string;
}

export function elem<K extends keyof HTMLElementTagNameMap>(tagName: K, propsOrChildren?: NodeProps | Node[], children?: Node[]): HTMLElementTagNameMap[K] {
  const elem = document.createElement(tagName);

  if (propsOrChildren !== undefined) {
    if (Array.isArray(propsOrChildren)) {
      elem.append(...propsOrChildren);
    } else {
      if (propsOrChildren.id !== undefined) {
        elem.setAttribute('id', propsOrChildren.id);
      }

      if (propsOrChildren.class !== undefined) {
        elem.setAttribute('class', propsOrChildren.class);
      }

      if (propsOrChildren.style !== undefined) {
        elem.setAttribute('style', propsOrChildren.style);
      }

      if (propsOrChildren.onClick !== undefined) {
        elem.addEventListener('click', propsOrChildren.onClick);
      }

      if (propsOrChildren.type !== undefined) {
        elem.setAttribute('type', propsOrChildren.type);
      }
    }
  }
  
  if (children !== undefined) {
    elem.append(...children);
  }

  return elem;
}
export const text = (_text: MaybeLocalizedString, disableTranslation = false) =>
  document.createTextNode(
    (disableTranslation && typeof _text === 'string') ? _text : translate(_text)
  );

export const elemsFromRawHtml = (html: string): Node[] => {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return Array.from(template.content.childNodes);
}

export const h1 = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('h1', propsOrChildren, children);
export const h2 = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('h2', propsOrChildren, children);
export const h3 = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('h3', propsOrChildren, children);
export const h4 = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('h4', propsOrChildren, children);
export const h5 = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('h5', propsOrChildren, children);
export const h6 = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('h6', propsOrChildren, children);
export const div = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('div', propsOrChildren, children);
export const span = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('span', propsOrChildren, children);
export const p = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('p', propsOrChildren, children);
export const ul = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('ul', propsOrChildren, children);
export const ol = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('ol', propsOrChildren, children);
export const li = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('li', propsOrChildren, children);
export const header = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('header', propsOrChildren, children);
export const footer = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('footer', propsOrChildren, children);
export const article = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('article', propsOrChildren, children);
export const section = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('section', propsOrChildren, children);
export const nav = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('nav', propsOrChildren, children);
export const details = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('details', propsOrChildren, children);
export const summary = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('summary', propsOrChildren, children);

interface ANodeProps extends NodeProps {
  href?: string;
  target?: string;
}

export const a = (propsOrChildren?: ANodeProps | Node[], children?: Node[]) => {
  const _elem = elem('a', propsOrChildren, children);

  if (!Array.isArray(propsOrChildren) && (propsOrChildren !== undefined)) {
    const props = propsOrChildren

    if (props.href) {
      _elem.setAttribute('href', props.href);
    }

    if (props.target) {
      _elem.setAttribute('target', props.target);
    }
  }

  return _elem;
}

interface TextAreaNodeProps extends NodeProps {
  readonly?: boolean;
  value?: string
  onInput?: (e: Event) => void;
}

export const textArea = (propsOrChildren?: TextAreaNodeProps | Node[], children?: Node[]) => {
  const _elem = elem('textarea', propsOrChildren, children);

  if (!Array.isArray(propsOrChildren) && (propsOrChildren !== undefined)) {
    const props = propsOrChildren

    if (props.readonly) {
      _elem.setAttribute('readonly', '');
    }

    if (props.onInput) {
      _elem.addEventListener('input', e => props.onInput!(e));
    }

    if (props.value) {
      _elem.value = props.value;
    }
  }

  return _elem;
}
export const button = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('button', propsOrChildren, children);
export const i = (propsOrChildren?: NodeProps | Node[], children?: Node[]) => elem('i', propsOrChildren, children);

interface CheckboxProps extends NodeProps {
  checked?: boolean;
  onChange?: (e: Event) => void;
}

export const checkbox = (propsOrChildren?: CheckboxProps | Node[], children?: Node[]) => {
  const _elem = elem('input', { ...propsOrChildren, type: 'checkbox' }, children);

  if (!Array.isArray(propsOrChildren) && (propsOrChildren !== undefined)) {
    const props = propsOrChildren

    if (props.checked) {
      _elem.setAttribute('checked', '');
    }

    if (props.onChange) {
      _elem.addEventListener('change', e => props.onChange!(e));
    }
  }

  return _elem;
}

interface LabelProps extends NodeProps {
  for?: string;
}

export const label = (propsOrChildren?: LabelProps | Node[], children?: Node[]) => {
  const _elem = elem('label', propsOrChildren, children);

  if (!Array.isArray(propsOrChildren) && (propsOrChildren !== undefined)) {
    const props = propsOrChildren

    if (props.for) {
      _elem.setAttribute('for', props.for);
    }
  }

  return _elem;
}

interface ImgProps extends NodeProps {
  src?: string;
  alt?: string;
}

export const img = (propsOrChildren?: ImgProps | Node[], children?: Node[]) => {
  const _elem = elem('img', propsOrChildren, children);

  if (!Array.isArray(propsOrChildren) && (propsOrChildren !== undefined)) {
    const props = propsOrChildren

    if (props.src) {
      _elem.setAttribute('src', props.src);
    }

    if (props.alt) {
      _elem.setAttribute('alt', translate(props.alt));
    }
  }

  return _elem;
}

interface SelectProps extends NodeProps {
  value?: string;
  onChange?: (e: Event) => void;
}

export const select = (propsOrChildren?: SelectProps | Node[], children?: Node[]) => {
  const _elem = elem('select', propsOrChildren, children);

  if (!Array.isArray(propsOrChildren) && (propsOrChildren !== undefined)) {
    const props = propsOrChildren

    if (props.value) {
      _elem.setAttribute('value', props.value);
    }

    if (props.onChange) {
      _elem.addEventListener('change', e => props.onChange!(e));
    }
  }

  return _elem;
}

interface OptionProps extends NodeProps {
  value?: string;
}

export const option = (propsOrChildren?: OptionProps | Node[], children?: Node[]) => {
  const _elem = elem('option', propsOrChildren, children);

  if (!Array.isArray(propsOrChildren) && (propsOrChildren !== undefined)) {
    const props = propsOrChildren

    if (props.value) {
      _elem.setAttribute('value', props.value);
    }
  }

  return _elem;
}

interface TextInputProps extends NodeProps {
  value?: string;
  placeholder?: string;
  onInput?: (e: Event) => void;
  disabled?: boolean;
}

export const textInput = (propsOrChildren?: TextInputProps | Node[], children?: Node[]) => {
  const _elem = elem('input', { ...propsOrChildren, type: 'text' }, children);

  if (!Array.isArray(propsOrChildren) && (propsOrChildren !== undefined)) {
    const props = propsOrChildren

    if (props.value) {
      _elem.setAttribute('value', props.value);
    }

    if (props.placeholder) {
      _elem.setAttribute('placeholder', translate(props.placeholder));
    }

    if (props.onInput) {
      _elem.addEventListener('input', e => props.onInput!(e));
    }

    if (props.disabled) {
      _elem.setAttribute('disabled', '');
    }
  }

  return _elem;
}

interface FileInputProps extends NodeProps {
  accept?: string;
  onChange?: (e: Event) => void;
}

export const fileInput = (propsOrChildren?: FileInputProps | Node[], children?: Node[]) => {
  const _elem = elem('input', { ...propsOrChildren, type: 'file' }, children);

  if (!Array.isArray(propsOrChildren) && (propsOrChildren !== undefined)) {
    const props = propsOrChildren

    if (props.accept) {
      _elem.setAttribute('accept', props.accept);
    }

    if (props.onChange) {
      _elem.addEventListener('change', e => props.onChange!(e));
    }
  }

  return _elem;
}