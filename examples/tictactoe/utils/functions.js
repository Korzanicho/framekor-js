export function checkWinner(board, player) {
  for (let i = 0; i < 3; i++) {
    if (checkRow(board, i, player)) {
      return player
    }

    if (checkColumn(board, i, player)) {
      return player
    }
  }

  if (checkMainDiagonal(board, player)) {
    return player
  }

  if (checkSecondaryDiagonal(board, player)) {
    return player
  }

  return null
}

function checkRow(board, idx, player) {
  const row = board[idx]
  return row.every((cell) => cell === player)
}

function checkColumn(board, idx, player) {
  const column = [board[0][idx], board[1][idx], board[2][idx]]
  return column.every((cell) => cell === player)
}

function checkMainDiagonal(board, player) {
  const diagonal = [board[0][0], board[1][1], board[2][2]]
  return diagonal.every((cell) => cell === player)
}

function checkSecondaryDiagonal(board, player) {
  const diagonal = [board[0][2], board[1][1], board[2][0]]
  return diagonal.every((cell) => cell === player)
}