const slateType = require('.');

describe('transformSelection', () => {
  describe('text operations', () => {
    function insertText(offset, path = [0, 0]) {
      return {
        type: 'insert_text',
        path,
        offset,
        text: 'hello',
        marks: [],
      };
    }

    function removeText(offset, path = [0, 0]) {
      return {
        type: 'remove_text',
        path,
        offset,
        text: 'hello',
      };
    }

    function selection(anchorOffset, focusOffset, anchorPath = [0, 0], focusPath = [0, 0]) {
      const anchorNode = anchorPath[0];
      const focusNode = focusPath[0];
      const isBackward = anchorNode === focusNode ?
        focusOffset < anchorOffset :
        focusNode < anchorNode;
      return {
        anchorPath,
        anchorOffset,
        focusPath,
        focusOffset,
        isBackward,
      };
    }

    describe('insert_text', () => {
      test('insert before selection position', () => {
        expect(slateType.transformSelection(
          selection(10, 10),
          [insertText(5)],
        )).toEqual(selection(15, 15));
      });
      test('insert at selection position', () => {
        expect(slateType.transformSelection(
          selection(10, 10),
          [insertText(10)],
        )).toEqual(selection(10, 10));
      });
      test('insert after selection position', () => {
        expect(slateType.transformSelection(
          selection(10, 10),
          [insertText(15)],
        )).toEqual(selection(10, 10));
      });
      test('insert before selection range anchor', () => {
        expect(slateType.transformSelection(
          selection(10, 20),
          [insertText(5)],
        )).toEqual(selection(15, 25));
      });
      test('insert at selection range anchor', () => {
        expect(slateType.transformSelection(
          selection(10, 20),
          [insertText(10)],
        )).toEqual(selection(10, 25));
      });
      test('insert between selection range anchor and focus', () => {
        expect(slateType.transformSelection(
          selection(10, 20),
          [insertText(12)],
        )).toEqual(selection(10, 25));
      });
      test('insert at selection range focus', () => {
        expect(slateType.transformSelection(
          selection(10, 20),
          [insertText(20)],
        )).toEqual(selection(10, 20));
      });
      test('insert after selection range focus', () => {
        expect(slateType.transformSelection(
          selection(10, 20),
          [insertText(25)],
        )).toEqual(selection(10, 20));
      });
      test('insert before backwards selection range focus', () => {
        expect(slateType.transformSelection(
          selection(20, 10),
          [insertText(8)],
        )).toEqual(selection(25, 15));
      });
      test('insert at backwards selection range focus', () => {
        expect(slateType.transformSelection(
          selection(20, 10),
          [insertText(10)],
        )).toEqual(selection(25, 10));
      });
      test('insert between backwards selection range focus and anchor', () => {
        expect(slateType.transformSelection(
          selection(20, 10),
          [insertText(12)],
        )).toEqual(selection(25, 10));
      });
      test('insert at backwards selection range anchor', () => {
        expect(slateType.transformSelection(
          selection(20, 10),
          [insertText(20)],
        )).toEqual(selection(20, 10));
      });
      test('insert after backwards selection range anchor', () => {
        expect(slateType.transformSelection(
          selection(20, 10),
          [insertText(25)],
        )).toEqual(selection(20, 10));
      });
      test('insert before multinode selection range anchor', () => {
        expect(slateType.transformSelection(
          selection(10, 20, [1, 0], [4, 0]),
          [insertText(5, [1, 0])],
        )).toEqual(selection(15, 20, [1, 0], [4, 0]));
      });
      test('insert after multinode selection range anchor', () => {
        expect(slateType.transformSelection(
          selection(10, 20, [1, 0], [4, 0]),
          [insertText(15, [1, 0])],
        )).toEqual(selection(10, 20, [1, 0], [4, 0]));
      });
      test('insert before multinode selection range focus', () => {
        expect(slateType.transformSelection(
          selection(10, 20, [1, 0], [4, 0]),
          [insertText(15, [4, 0])],
        )).toEqual(selection(10, 25, [1, 0], [4, 0]));
      });
      test('insert after multinode selection range focus', () => {
        expect(slateType.transformSelection(
          selection(10, 20, [1, 0], [4, 0]),
          [insertText(25, [4, 0])],
        )).toEqual(selection(10, 20, [1, 0], [4, 0]));
      });
      test('insert before backwards multinode selection range focus', () => {
        expect(slateType.transformSelection(
          selection(10, 20, [4, 0], [1, 0]),
          [insertText(5, [4, 0])],
        )).toEqual(selection(15, 20, [4, 0], [1, 0]));
      });
      test('insert after backwards multinode selection range focus', () => {
        expect(slateType.transformSelection(
          selection(10, 20, [4, 0], [1, 0]),
          [insertText(15, [4, 0])],
        )).toEqual(selection(10, 20, [4, 0], [1, 0]));
      });
      test('insert before backwards multinode selection range anchor', () => {
        expect(slateType.transformSelection(
          selection(10, 20, [4, 0], [1, 0]),
          [insertText(15, [1, 0])],
        )).toEqual(selection(10, 25, [4, 0], [1, 0]));
      });
      test('insert after backwards multinode selection range anchor', () => {
        expect(slateType.transformSelection(
          selection(10, 20, [4, 0], [1, 0]),
          [insertText(25, [1, 0])],
        )).toEqual(selection(10, 20, [4, 0], [1, 0]));
      });
    });

    describe('remove_text', () => {
      test('remove before selection position', () => {
        expect(slateType.transformSelection(
          selection(10, 10),
          [removeText(5)],
        )).toEqual(selection(5, 5));
      });
      test('remove at selection position', () => {
        expect(slateType.transformSelection(
          selection(10, 10),
          [removeText(10)],
        )).toEqual(selection(10, 10));
      });
      test('remove after selection position', () => {
        expect(slateType.transformSelection(
          selection(10, 10),
          [removeText(15)],
        )).toEqual(selection(10, 10));
      });
      test('remove before selection range anchor', () => {
        expect(slateType.transformSelection(
          selection(10, 20),
          [removeText(5)],
        )).toEqual(selection(5, 15));
      });
      test('remove at selection range anchor', () => {
        expect(slateType.transformSelection(
          selection(10, 20),
          [removeText(10)],
        )).toEqual(selection(10, 15));
      });
      test('remove between selection range anchor and focus', () => {
        expect(slateType.transformSelection(
          selection(10, 20),
          [removeText(12)],
        )).toEqual(selection(10, 15));
      });
      test('remove at selection range focus', () => {
        expect(slateType.transformSelection(
          selection(10, 20),
          [removeText(20)],
        )).toEqual(selection(10, 20));
      });
      test('remove after selection range focus', () => {
        expect(slateType.transformSelection(
          selection(10, 20),
          [removeText(25)],
        )).toEqual(selection(10, 20));
      });
      test('remove text from the beginning of the range', () => {
        expect(slateType.transformSelection(
          selection(10, 20),
          [removeText(8)],
        )).toEqual(selection(8, 15));
      });
      test('remove text from the end of the range', () => {
        expect(slateType.transformSelection(
          selection(10, 20),
          [removeText(18)],
        )).toEqual(selection(10, 18));
      });
      test('remove before backwards selection range focus', () => {
        expect(slateType.transformSelection(
          selection(20, 10),
          [removeText(5)],
        )).toEqual(selection(15, 5));
      });
      test('remove at backwards selection range focus', () => {
        expect(slateType.transformSelection(
          selection(20, 10),
          [removeText(10)],
        )).toEqual(selection(15, 10));
      });
      test('remove between backwards selection range focus and anchor', () => {
        expect(slateType.transformSelection(
          selection(20, 10),
          [removeText(12)],
        )).toEqual(selection(15, 10));
      });
      test('remove at backwards selection range anchor', () => {
        expect(slateType.transformSelection(
          selection(20, 10),
          [removeText(20)],
        )).toEqual(selection(20, 10));
      });
      test('remove after backwards selection range anchor', () => {
        expect(slateType.transformSelection(
          selection(20, 10),
          [removeText(25)],
        )).toEqual(selection(20, 10));
      });
      test('remove before multinode selection range anchor', () => {
        expect(slateType.transformSelection(
          selection(10, 20, [1, 0], [4, 0]),
          [removeText(5, [1, 0])],
        )).toEqual(selection(5, 20, [1, 0], [4, 0]));
      });
      test('remove after multinode selection range anchor', () => {
        expect(slateType.transformSelection(
          selection(10, 20, [1, 0], [4, 0]),
          [removeText(15, [1, 0])],
        )).toEqual(selection(10, 20, [1, 0], [4, 0]));
      });
      test('remove before multinode selection range focus', () => {
        expect(slateType.transformSelection(
          selection(10, 20, [1, 0], [4, 0]),
          [removeText(15, [4, 0])],
        )).toEqual(selection(10, 15, [1, 0], [4, 0]));
      });
      test('remove after multinode selection range focus', () => {
        expect(slateType.transformSelection(
          selection(10, 20, [1, 0], [4, 0]),
          [removeText(25, [4, 0])],
        )).toEqual(selection(10, 20, [1, 0], [4, 0]));
      });
      test('remove before backwards multinode selection range focus', () => {
        expect(slateType.transformSelection(
          selection(10, 20, [4, 0], [1, 0]),
          [removeText(5, [4, 0])],
        )).toEqual(selection(5, 20, [4, 0], [1, 0]));
      });
      test('remove after backwards multinode selection range focus', () => {
        expect(slateType.transformSelection(
          selection(10, 20, [4, 0], [1, 0]),
          [removeText(15, [4, 0])],
        )).toEqual(selection(10, 20, [4, 0], [1, 0]));
      });
      test('remove before backwards multinode selection range anchor', () => {
        expect(slateType.transformSelection(
          selection(10, 20, [4, 0], [1, 0]),
          [removeText(15, [1, 0])],
        )).toEqual(selection(10, 15, [4, 0], [1, 0]));
      });
      test('remove after backwards multinode selection range anchor', () => {
        expect(slateType.transformSelection(
          selection(10, 20, [4, 0], [1, 0]),
          [removeText(25, [1, 0])],
        )).toEqual(selection(10, 20, [4, 0], [1, 0]));
      });
    });
  });

  describe('node operations', () => {
    describe('split_node', () => {

    });

    describe('insert_node', () => {

    });

    describe('remove_node', () => {

    });

    describe('merge_node', () => {

    });
  });
});
