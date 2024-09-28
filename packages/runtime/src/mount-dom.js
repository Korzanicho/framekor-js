/* eslint-disable no-use-before-define */
import { DOM_TYPES } from './h';
import { setAttributes } from './attributes';
import { addEventListeners } from './events';

function createTextNode(vdom, parentEl, index) {
  const { value } = vdom;
  const textNode = document.createTextNode(value);
  // eslint-disable-next-line no-param-reassign
  vdom.el = textNode;
  insert(textNode, parentEl, index);
}

function createFragmentNodes(vdom, parentEl, index) {
  const { children } = vdom;
  // eslint-disable-next-line no-param-reassign
  vdom.el = parentEl;

  for (const child of children) {
    mountDOM(child, parentEl, index)

    if (index == null) {
      continue
    }

    switch (child.type) {
      case DOM_TYPES.FRAGMENT:
        index += child.children.length
        break
      default:
        index++
    }
  }
}

function addProps(el, props, vdom) {
  const { on: events, ...attrs } = props;
  // eslint-disable-next-line no-param-reassign
  vdom.listeners = addEventListeners(events, el);
  setAttributes(el, attrs);
}

function createElementNode(vdom, parentEl, index) {
  const { tag, props, children } = vdom;

  const element = document.createElement(tag);
  addProps(element, props, vdom);
  // eslint-disable-next-line no-param-reassign
  vdom.el = element;

  children.forEach((child) => {
    mountDOM(child, element);
  });

  insert(element, parentEl, index);
}

export function mountDOM(vdom, parentEl, index) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT: {
      createTextNode(vdom, parentEl, index);
      break;
    }

    case DOM_TYPES.ELEMENT: {
      createElementNode(vdom, parentEl, index);
      break;
    }

    case DOM_TYPES.FRAGMENT: {
      createFragmentNodes(vdom, parentEl, index);
      break;
    }

    default: {
      throw new Error(`Can't mount DOM of type: ${vdom.type}`);
    }
  }
}

function insert(el, parentEl, index) {
  // if index is null or undefined, append to the end
  if (index == null) {
    parentEl.append(el);
    return;
  }

  if (index < 0) {
    throw new Error('Index must be a positive integer, got ' + index);
  }

  const children = parentEl.childNodes;

  if (index >= children.length) {
    parentEl.append(el);
  } else {
    parentEl.insertBefore(el, children[index]);
  }
}
