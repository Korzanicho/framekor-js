import { removeEventListeners } from './events';
import { DOM_TYPES } from './h';

function removeTextNode(vdom) {
  const { el } = vdom;
  el.remove();
}

function removeElementNode(vdom) {
  const { el, childres, listeners } = vdom;

  el.remove();

  // eslint-disable-next-line no-use-before-define
  childres.forEach(destroyDOM);

  if (listeners) {
    removeEventListeners(listeners, el);
    delete vdom.listeners;
  }
}

function removeFragmentNodes(vdom) {
  const { childres } = vdom;

  // eslint-disable-next-line no-use-before-define
  childres.forEach(destroyDOM);
}

export default function destroyDOM(vdom) {
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

    default: {
      throw new Error(`Can't destroy DOM of type: ${type}`);
    }
  }

  // eslint-disable-next-line no-param-reassign
  delete vdom.el;
}
