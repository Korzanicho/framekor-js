import { h } from 'https://unpkg.com/framekor@1.0.2';

export default function TheHeader(state) {
  if (state.winner) {
    return h('h3', { class: 'win-title' }, [`Player ${state.winner} wins!`])
  }

  if (state.draw) {
    return h('h3', { class: 'draw-title' }, [`It's a draw!`])
  }

  return h('h3', {}, [`It's ${state.player}'s turn!`])
}