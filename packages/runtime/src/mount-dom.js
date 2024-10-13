/* eslint-disable no-use-before-define */
import { DOM_TYPES } from './h';
import { enqueueJob } from './scheduler';
import { setAttributes } from './attributes';
import { addEventListeners } from './events';
import { extractPropsAndEvents } from './utils/props';

function createTextNode(vdom, parentEl, index) {
  const { value } = vdom;
  const textNode = document.createTextNode(value);
  // eslint-disable-next-line no-param-reassign
  vdom.el = textNode;
  insert(textNode, parentEl, index);
}

function createFragmentNodes(vdom, parentEl, index, hostComponent) {
  const { children } = vdom;
  // eslint-disable-next-line no-param-reassign
  vdom.el = parentEl;

  for (const child of children) {
    mountDOM(child, parentEl, index ? index + i : null, hostComponent);

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

function addProps(el, vdom, hostComponent) {
  const { props: attrs, events } = extractPropsAndEvents(vdom);
  // eslint-disable-next-line no-param-reassign
  vdom.listeners = addEventListeners(events, el, hostComponent);
  setAttributes(el, attrs);
}

function createElementNode(vdom, parentEl, index, hostComponent) {
  const { tag, children } = vdom;

  const element = document.createElement(tag);
  addProps(element, vdom, hostComponent);
  // eslint-disable-next-line no-param-reassign
  vdom.el = element;

  children.forEach((child) => {
    mountDOM(child, element, null, hostComponent);
  });

  insert(element, parentEl, index);
}

export function mountDOM(vdom, parentEl, index, hostComponent = null) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT: {
      createTextNode(vdom, parentEl, index);
      break;
    }

    case DOM_TYPES.ELEMENT: {
      createElementNode(vdom, parentEl, index, hostComponent);
      break;
    }

    case DOM_TYPES.FRAGMENT: {
      createFragmentNodes(vdom, parentEl, index, hostComponent);
      break;
    }

    case DOM_TYPES.COMPONENT: {
      createComponentNode(vdom, parentEl, index, hostComponent);
      enqueueJob(() => vdom.component.onMounted());
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

function createComponentNode(vdom, parentEl, index, hostComponent) {
  const Component = vdom.tag;
  const { props, events } = extractPropsAndEvents(vdom);
  const component = new Component(props, events, hostComponent);

  component.mount(parentEl, index);
  vdom.component = component;
  vdom.el = component.firstElement;
}