import { createApp } from 'framekor';
// import { createApp } from 'https://unpkg.com/framekor@1.0.2';
import TheGame from './views/TheGame.js';
import {createStore, storeReducers} from './store/index.js';

createApp({
  state: createStore(),
  reducers: storeReducers(),
  view: TheGame,
}).mount(document.body)