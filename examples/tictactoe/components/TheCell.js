import { h } from 'https://unpkg.com/framekor@1.0.2';

export default function TheCell({ cell, i, j }, emit) {
  const mark = cell
    ? h('span', { class: 'cell-text' }, [cell])
    : h(
        'div',
        {
          class: 'cell',
          on: { click: () => emit('mark', { row: i, col: j }) },
        },
        []
      )

  return h('td', {}, [mark])
}