import { DecoratorNode } from 'lexical';

export class ImageNode extends DecoratorNode {
  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  constructor(src, altText, key) {
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  createDOM() {
    const span = document.createElement('span');
    span.style.display = 'block';
    span.style.margin = '10px 0';
    
    const img = document.createElement('img');
    img.src = this.__src;
    img.alt = this.__altText;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.margin = '0 auto';
    img.style.borderRadius = '4px';
    
    span.appendChild(img);
    return span;
  }

  updateDOM(prevNode, dom) {
    const img = dom.querySelector('img');
    if (img && prevNode.__src !== this.__src) {
      img.src = this.__src;
      img.alt = this.__altText;
      return true;
    }
    return false;
  }

  static importDOM() {
    return {
      img: () => ({
        conversion: (domNode) => {
          const { src, alt } = domNode;
          const node = new ImageNode(src, alt || '');
          return { node };
        },
        priority: 0,
      }),
    };
  }

  static importJSON(serializedNode) {
    const { src, altText } = serializedNode;
    return new ImageNode(src, altText);
  }

  exportJSON() {
    return {
      src: this.__src,
      altText: this.__altText,
      type: 'image',
      version: 1,
    };
  }

  getSrc() {
    return this.__src;
  }

  getAltText() {
    return this.__altText;
  }

  setSrc(src) {
    const writable = this.getWritable();
    writable.__src = src;
  }

  setAltText(altText) {
    const writable = this.getWritable();
    writable.__altText = altText;
  }

  decorate() {
    // DecoratorNode doesn't need JSX, it uses createDOM instead
    return null;
  }
}

export function $createImageNode(src, altText = '') {
  return new ImageNode(src, altText);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}
