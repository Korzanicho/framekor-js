import { DOM_TYPES } from './h';
import { enqueueJob } from './scheduler';
import { removeEventListeners } from './events';

function removeTextNode(vdom) {
  const { el } = vdom;
  el.remove();
}

function removeElementNode(vdom) {
  const { el, children, listeners } = vdom;

  el.remove();

  // eslint-disable-next-line no-use-before-define
  children.forEach(destroyDOM);

  if (listeners) {
    removeEventListeners(listeners, el);
    delete vdom.listeners;
  }
}

function removeFragmentNodes(vdom) {
  const { children } = vdom;

  // eslint-disable-next-line no-use-before-define
  children.forEach(destroyDOM);
}

export function destroyDOM(vdom) {
  const { type } = vdom;

  switch (type) {
    case DOM_TYPES.TEXT: {
      removeTextNode(vdom);
      break;
    }

    case DOM_TYPES.ELEMENT: {
      removeElementNode(vdom);
      break;
    }

    case DOM_TYPES.FRAGMENT: {
      removeFragmentNodes(vdom);
      break;
    }

    case DOM_TYPES.COMPONENT: {
      vdom.component.unmount();
      enqueueJob(() => vdom.component.onUnmounted());
      break;
    }

    default: {
      throw new Error(`Can't destroy DOM of type: ${type}`);
    }
  }

  // eslint-disable-next-line no-param-reassign
  delete vdom.el;
}
