import { withoutNulls } from './utils/arrays';

export const DOM_TYPES = {
  TEXT: 'text',
  ELEMENT: 'element',
  FRAGMENT: 'fragment',
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
  return {
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type: DOM_TYPES.ELEMENT,
  };
}

export function lipsum(paragraphsQuantity = 1) {
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut 
  enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
  ut aliquip ex ea commodo consequat.`;

  return hFragment(Array(paragraphsQuantity).fill(h('p', {}, [text])));
}

// Example:

// hFragment([
//   h('h1', { class: 'title' }, ['My counter']),
//   h('div', { class: 'container' }, [
//     h('button', {}, ['decrement']),
//     h('span', {}, ['0']),
//     h('button', {}, ['increment']),
//   ]),
// ]);

// function MessageComponent (level, message) {
//   return h('div', { class: `message message--${level}` }, [
//     h('p', {}, [message]),
//   ]);
// }
