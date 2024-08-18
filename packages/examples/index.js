// import {h} from '../runtime/src/h';
// import mountDOM from '../runtime/src/mount-dom';

const {h} = require('../runtime/src/h');
const mountDOM = require('../runtime/src/mount-dom');

const vdom = h('section', {}, [
	h('h1', {}, ['My Blog']),
	h('p', {}, ['Welcome to my blog'])
])

mountDOM(vdom);