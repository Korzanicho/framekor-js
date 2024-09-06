import { gameStore } from "./gameStore.js";
import { markReducer } from "./reducers.js";

export function createStore() {
	return {
		...gameStore
	}
}

export function storeReducers() {
	return {
		mark: markReducer
	}
}