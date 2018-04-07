const { Operations, Value } = require('slate');

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
};
