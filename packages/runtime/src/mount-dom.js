/* eslint-disable no-use-before-define */
import { DOM_TYPES } from './h';
import { setAttributes } from './attributes';
import addEventListeners from './events';

function createTextNode(vdom, parentEl) {
  const { value } = vdom;
  const textNode = document.createTextNode(value);
  // eslint-disable-next-line no-param-reassign
  vdom.el = textNode;
  parentEl.append(textNode);
}

function createFragmentNode(vdom, parentEl) {
  const { children } = vdom;
  // eslint-disable-next-line no-param-reassign
  vdom.el = parentEl;

  children.forEach((child) => mountDOM(child, parentEl));
}

function addProps(el, props, vdom) {
  const { on: events, ...attrs } = props;
  // eslint-disable-next-line no-param-reassign
  vdom.listeners = addEventListeners(events, el);
  setAttributes(el, attrs);
}

function createElementNode(vdom, parentEl) {
  const { tag, props, children } = vdom;

  const element = document.createElement(tag);
  addProps(element, props, vdom);
  // eslint-disable-next-line no-param-reassign
  vdom.el = element;

  children.forEach((child) => {
    mountDOM(child, element);
  });

  parentEl.append(element);
}

export default function mountDOM(vdom, parentEl) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT: {
      createTextNode(vdom, parentEl);
      break;
    }

    case DOM_TYPES.ELEMENT: {
      createElementNode(vdom, parentEl);
      break;
    }

    case DOM_TYPES.FRAGMENT: {
      createFragmentNode(vdom, parentEl);
      break;
    }

    default: {
      throw new Error(`Can't mount DOM of type: ${vdom.type}`);
    }
  }
}
