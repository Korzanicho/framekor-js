import { hFragment } from 'https://unpkg.com/framekor@1.0.2';
import TheHeader from '../components/TheHeader.js';
import TheBoard from '../components/TheBoard.js';

export default function TheGame(state, emit) {
  return hFragment([TheHeader(state), TheBoard(state, emit)])
}