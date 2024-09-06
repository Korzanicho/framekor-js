import { checkWinner } from '../utils/functions.js';

export function markReducer(state, { row, col }) {
  if (row > 3 || row < 0 || col > 3 || col < 0) {
    throw new Error('Invalid move')
  }

  if (state.board[row][col]) {
    throw new Error('Invalid move')
  }

  const newBoard = [
    [...state.board[0]],
    [...state.board[1]],
    [...state.board[2]],
  ]
  newBoard[row][col] = state.player

  const newPlayer = state.player === 'X' ? 'O' : 'X'
  const winner = checkWinner(newBoard, state.player)
  const draw = !winner && newBoard.every((row) => row.every((cell) => cell))

  return {
    board: newBoard,
    player: newPlayer,
    draw,
    winner,
  }
}