import { withoutNulls } from './utils/arrays';

export const DOM_TYPES = {
  TEXT: 'text',
  ELEMENT: 'element',
  FRAGMENT: 'fragment',
  COMPONENT: 'component'
};

export function hString(str) {
  return { type: DOM_TYPES.TEXT, value: str };
}

function mapTextNodes(children) {
  return children.map((child) => (typeof child === 'string' ? hString(child) : child));
}

export function hFragment(children) {
  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(children)),
  };
}

export function h(tag, props = {}, children = []) {
  const type = typeof tag === 'string' ? DOM_TYPES.ELEMENT : DOM_TYPES.COMPONENT;
  return {
    tag,
    props,
    type,
    children: mapTextNodes(withoutNulls(children)),
  };
}

export function extractChildren(vdom) {
  if (vdom.children == null) return [];

  const children = [];

  for (const child of vdom.children) {
    if (child.type === DOM_TYPES.FRAGMENT) {
      children.push(...extractChildren(child, children));
    } else {
      children.push(child);
    }
  }

  return children;
}

export function lipsum(paragraphsQuantity = 1) {
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut 
  enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
  ut aliquip ex ea commodo consequat.`;

  return hFragment(Array(paragraphsQuantity).fill(h('p', {}, [text])));
}
