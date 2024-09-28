export function withoutNulls(arr) {
  return arr.filter((item) => item != null);
}

export function arraysDiff(oldArray, newArray) {
  return {
    added: newArray.filter((item) => !oldArray.includes(item)),
    removed: oldArray.filter((oldItem) => !newArray.includes(oldItem))
  }
}

export const ARRAY_DIFF_OP = {
  ADD: 'add',
  REMOVE: 'remove',
  MOVE: 'move',
  NOOP: 'noop'
}

export function arraysDiffSequence(oldArray, newArray, equalsFn = (a, b) => a === b) {
  const sequence = [];
  const array = new ArrayWithOriginalIndices(oldArray, equalsFn);

  for (let index = 0; index < newArray.length; index++) {
    // removal case
    if (array.isRemoval(index, newArray)) {
      sequence.push(array.removeItem(index));
      index--;
      continue;
    }

    // TODO: noop case
    if (array.isNoop(index, newArray)) {
      sequence.push(array.noopItem(index));
      continue;
    }

    const item = newArray[index];

    // TODO: adition case
    if (array.isAddition(item, index)) {
      sequence.push(array.addItem(item, index));
      continue
    }

    // TODO: move case
    sequence.push(array.moveItem(item, index));
  }
  // TODO: remove extra items
  sequence.push(...array.removeItemsAfter(newArray.length));

  return sequence;
}

class ArrayWithOriginalIndices {
  #array = [];
  #originalIndices = [];
  #equalsFn;

  constructor(array, equalsFn) {
    this.#array = array;
    this.#originalIndices = array.map((_, i) => i);
    this.#equalsFn = equalsFn;
  }

  originalIndexAt(index) {
    return this.#originalIndices[index];
  }

  findIndexFrom(item, fromIndex) {
    for (let i = fromIndex; i < this.length; i++) {
      if (this.#equalsFn(item, this.#array[i])) return i;
    }

    return -1;
  }

  get length() {
    return this.#array.length;
  }

  isRemoval(index, newArray) {
    if (index >= this.length) {
      return false;
    }

    const item = this.#array[index];
    const indexInNewArray = newArray.findIndex((newItem) => this.#equalsFn(item, newItem));

    return indexInNewArray === -1;
  }

  removeItem(index) {
    const operation = {
      op: ARRAY_DIFF_OP.REMOVE,
      index,
      item: this.#array[index],
    }

    this.#array.splice(index, 1);
    this.#originalIndices.splice(index, 1);

    return operation;
  }

  isNoop(index, newArray) {
    if (index >= this.length) {
      return false;
    }

    const item = this.#array[index];
    const newItem = newArray[index];

    return this.#equalsFn(item, newItem);
  }

  noopItem(index) {
    return {
      op: ARRAY_DIFF_OP.NOOP,
      originalIndex: this.originalIndexAt(index),
      index,
      item: this.#array[index]
    }
  }

  isAddition(item, fromIndex) {
    return this.findIndexFrom(item, fromIndex) === -1;
  }

  addItem(item, index) {
    const operation = {
      op: ARRAY_DIFF_OP.ADD,
      index,
      item
    }

    this.#array.splice(index, 0, item);
    this.#originalIndices.splice(index, 0, -1);

    return operation;
  }

  moveItem(item, toIndex) {
    const fromIndex = this.findIndexFrom(item, toIndex);

    const operation = {
      op: ARRAY_DIFF_OP.MOVE,
      originalIndex: this.originalIndexAt(fromIndex),
      from: fromIndex,
      index: toIndex,
      item: this.#array[fromIndex]
    }

    const [_item] = this.#array.splice(fromIndex, 1);
    this.#array.splice(toIndex, 0, _item);
    const [originalIndex] = this.#originalIndices.splice(fromIndex, 1);
    this.#originalIndices.splice(toIndex, 0, originalIndex);

    return operation;
  }

  removeItemsAfter(index) {
    const operations = [];

    while (this.length > index) {
      operations.push(this.removeItem(index));
    }

    return operations;
  }
}