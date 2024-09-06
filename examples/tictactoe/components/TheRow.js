import { h } from 'https://unpkg.com/framekor@1.0.2';
import TheCell from './TheCell.js';

export default function TheRow({ row, i }, emit) {
  return h(
    'tr',
    {},
    row.map((cell, j) => TheCell({ cell, i, j }, emit))
  )
}