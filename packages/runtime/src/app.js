import { h } from './h';
import { mountDOM } from './mount-dom';
import { destroyDOM } from './destroy-dom';

export function createApp(rootComponent, props = {}) {
	let parentEl = null;
	let isMounted = false;
	let vdom = null;

	function reset() {
		vdom = null;
		parentEl = null;
		isMounted = false;
	}

	return {
		mount(_parentEl) {
			if (isMounted) {
				throw new Error('App has already been mounted.');
			}

			parentEl = _parentEl;
			vdom = h(rootComponent, props);
			mountDOM(vdom, parentEl);

			isMounted = true;
		},

		unmount() {
			if (!isMounted) {
				throw new Error('App has not been mounted.');
			}

			destroyDOM(vdom, parentEl);
			reset();
		}
	}
}