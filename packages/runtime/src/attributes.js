/* eslint-disable no-param-reassign */
function setClass(el, className) {
  // eslint-disable-next-line no-param-reassign
  el.className = '';

  if (typeof className === 'string') el.className = className;

  if (Array.isArray(className)) el.classLList.add(...className);
}

export function setStyle(el, name, value) {
  el.style[name] = value;
}

export function removeStyle(el, name) {
  el.style[name] = null;
}

export function removeAttribute(el, name) {
  el[name] = null;
  el.removeAttribute(name);
}

export function setAttribute(el, name, value) {
  if (value == null) removeAttribute(el, name);
  else if (name.startsWith('data-')) el.setAttribute(name, value);
  else el[name] = value;
}

export default function setAttributes(el, attrs) {
  const { class: className, style, ...otherAttrs } = attrs;

  if (className) setClass(el, className);

  if (style) {
    Object.entries(style).forEach(([prop, value]) => {
      setStyle(el, prop, value);
    });
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const [name, value] of Object.entries(otherAttrs)) {
    setAttribute(el, name, value);
  }
}
