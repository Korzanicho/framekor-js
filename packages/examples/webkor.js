function addEventListener(eventName, handler, el) {
  el.addEventListener(eventName, handler);
  return handler;
}
function addEventListeners(listeners = {}, el) {
  Object.entries(listeners).forEach(([eventName, handler]) => {
    addEventListener(eventName, handler, el);
  });
  return listeners;
}
function removeEventListeners(listeners = {}, el) {
  Object.entries(listeners).forEach(([eventName, handler]) => {
    el.removeEventListener(eventName, handler);
  });
}

function withoutNulls(arr) {
  return arr.filter((item) => item != null);
}

const DOM_TYPES = {
  TEXT: 'text',
  ELEMENT: 'element',
  FRAGMENT: 'fragment',
};
function hString(str) {
  return { type: DOM_TYPES.TEXT, value: str };
}
function mapTextNodes(children) {
  return children.map((child) => (typeof child === 'string' ? hString(child) : child));
}
function hFragment(children) {
  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(children)),
  };
}
function h(tag, props = {}, children = []) {
  return {
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type: DOM_TYPES.ELEMENT,
  };
}

function removeTextNode(vdom) {
  const { el } = vdom;
  el.remove();
}
function removeElementNode(vdom) {
  const { el, childres, listeners } = vdom;
  el.remove();
  childres.forEach(destroyDOM);
  if (listeners) {
    removeEventListeners(listeners, el);
    delete vdom.listeners;
  }
}
function removeFragmentNodes(vdom) {
  const { childres } = vdom;
  childres.forEach(destroyDOM);
}
function destroyDOM(vdom) {
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
  delete vdom.el;
}

class Dispatcher {
	#subs = new Map();
	#afterHandlers = [];
	subscribe(commandName, handler) {
		if (!this.#subs.has(commandName)) {
			this.#subs.set(commandName, []);
		}
		const handlers = this.#subs.get(commandName);
		if (handlers.includes(handler)) {
			return () => {};
		}
		handlers.push(handler);
		return () => {
			const idx = handlers.indexOf(handler);
			handlers.splice(idx, 1);
		}
	}
	afterEveryCommand(handler) {
		this.#afterHandlers.push(handler);
		return () => {
			const idx = this.#afterHandlers.indexOf(handler);
			this.#afterHandlers.splice(idx, 1);
		}
	}
	dispatch(commandName, payload) {
		if (this.#subs.has(commandName)) {
			this.#subs.get(commandName).forEach((handler) => {
				handler(payload);
			});
		} else {
			throw new Error(`No handler for command: ${commandName}`);
		}
		this.#afterHandlers.forEach((handler) => {
			handler();
		});
	}
}

function setClass(el, className) {
  el.className = '';
  if (typeof className === 'string') el.className = className;
  if (Array.isArray(className)) el.classLList.add(...className);
}
function setStyle(el, name, value) {
  el.style[name] = value;
}
function removeAttribute(el, name) {
  el[name] = null;
  el.removeAttribute(name);
}
function setAttribute(el, name, value) {
  if (value == null) removeAttribute(el, name);
  else if (name.startsWith('data-')) el.setAttribute(name, value);
  else el[name] = value;
}
function setAttributes(el, attrs) {
  const { class: className, style, ...otherAttrs } = attrs;
  if (className) setClass(el, className);
  if (style) {
    Object.entries(style).forEach(([prop, value]) => {
      setStyle(el, prop, value);
    });
  }
  for (const [name, value] of Object.entries(otherAttrs)) {
    setAttribute(el, name, value);
  }
}

function createTextNode(vdom, parentEl) {
  const { value } = vdom;
  const textNode = document.createTextNode(value);
  vdom.el = textNode;
  parentEl.append(textNode);
}
function createFragmentNode(vdom, parentEl) {
  const { children } = vdom;
  vdom.el = parentEl;
  children.forEach((child) => mountDOM(child, parentEl));
}
function addProps(el, props, vdom) {
  const { on: events, ...attrs } = props;
  vdom.listeners = addEventListeners(events, el);
  setAttributes(el, attrs);
}
function createElementNode(vdom, parentEl) {
  const { tag, props, children } = vdom;
  const element = document.createElement(tag);
  addProps(element, props, vdom);
  vdom.el = element;
  children.forEach((child) => {
    mountDOM(child, element);
  });
  parentEl.append(element);
}
function mountDOM(vdom, parentEl) {
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

function createApp({ state, view, reducers }) {
	let parentEl = null;
	let vdom = null;
	const dispatcher = new Dispatcher();
	const subscriptions = [dispatcher.afterEveryCommand(renderApp)];
	function emit(actionName, payload) {
		dispatcher.dispatch(actionName, payload);
	}
	for (const actionName in reducers) {
		const reducer = reducers[actionName];
		const subs = dispatcher.subscribe(actionName, (payload) => {
			state = reducer(state, payload);
		});
		subscriptions.push(subs);
	}
	function renderApp() {
		if (vdom) {
			destroyDOM(vdom);
		}
		vdom = view(state, emit);
		mountDOM(vdom, parentEl);
	}
	return {
		mount(_parentEl) {
			parentEl = _parentEl;
			renderApp();
		},
		unmount() {
			destroyDOM(vdom);
			vdom = null;
			subscriptions.forEach((unsubscribe) => unsubscribe());
		},
	}
}

export { createApp, h, hFragment, hString };
