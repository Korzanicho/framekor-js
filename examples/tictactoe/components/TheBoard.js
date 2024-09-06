import { h } from 'https://unpkg.com/framekor@1.0.2';
import TheRow from './TheRow.js';

export default function TheBoard(state, emit) {
  const freezeBoard = state.winner || state.draw

  return h('table', { class: freezeBoard ? 'frozen' : '' }, [
    h(
      'tbody',
      {},
        state.board.map((row, i) => TheRow({ row, i }, emit))
    ),
  ])
}