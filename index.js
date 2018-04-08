const { Operations, Value } = require('slate');
const debug = require('debug')('ot-slatejs');
const textType = require('ot-text');

class Selection {
  constructor({
    anchorPath,
    anchorOffset,
    focusPath,
    focusOffset,
    isBackward,
    isFocused,
  }) {
    this.anchorPath = anchorPath.slice(0);
    this.anchorOffset = anchorOffset;
    this.focusPath = focusPath.slice(0);
    this.focusOffset = focusOffset;
    this.isBackward = isBackward;
    this.isFocused = isFocused;
  }

  get leftPath() {
    return this.isBackward ? this.focusPath : this.anchorPath;
  }
  withLeftPath(path) {
    return new Selection(Object.assign({}, this, { [this.isBackward ? 'focusPath' : 'anchorPath']: path }));
  }
  get leftOffset() {
    return this.isBackward ? this.focusOffset : this.anchorOffset;
  }
  withLeftOffset(offset) {
    return new Selection(Object.assign({}, this, { [this.isBackward ? 'focusOffset' : 'anchorOffset']: offset }));
  }
  get rightPath() {
    return this.isBackward ? this.anchorPath : this.focusPath;
  }
  withRightPath(path) {
    return new Selection(Object.assign({}, this, { [this.isBackward ? 'anchorPath' : 'focusPath']: path }));
  }
  get rightOffset() {
    return this.isBackward ? this.anchorOffset : this.focusOffset;
  }
  withRightOffset(offset) {
    return new Selection(Object.assign({}, this, { [this.isBackward ? 'anchorOffset' : 'focusOffset']: offset }));
  }
}

function arraysEqual(a1, a2) {
  return a1.length === a2.length && a1.every((value, index) => value === a2[index]);
}

function transformSelectionTextOperation(selection, op, otTextOp) {
  let result = selection;
  const otSelection = [selection.leftOffset, selection.rightOffset];
  const [left, right] = textType.type.transformSelection(otSelection, otTextOp, false);

  if (arraysEqual(op.path, selection.leftPath)) {
    result = result.withLeftOffset(left);
  }
  if (arraysEqual(op.path, selection.rightPath)) {
    result = result.withRightOffset(right);
  }
  return result;
}

function transformSelectionInsertText(selection, op) {
  return transformSelectionTextOperation(selection, op, [op.offset, op.text]);
}

function transformSelectionRemoveText(selection, op) {
  return transformSelectionTextOperation(selection, op, [op.offset, { d: op.text.length }]);
}

module.exports = {
  name: 'slate',
  uri: 'https://docs.slatejs.org/',

  create(initialData) {
    return initialData;
  },

  apply(snapshot, ops) {
    return ops.reduce((res, op) => Operations.apply(res, op), Value.fromJSON(snapshot)).toJSON();
  },

  transform(op1, op2, side) {
  },

  transformSelection(selection, ops) {
    const result = ops.reduce((sel, op) => {
      switch (op.type) {
        case 'insert_text':
          return transformSelectionInsertText(sel, op);
        case 'remove_text':
          return transformSelectionRemoveText(sel, op);
        default:
          debug(`Unsupported Slate operation type ${op.type}`);
      }
      return selection;
    }, new Selection(selection));
    return Object.assign({}, result);
  },
};
