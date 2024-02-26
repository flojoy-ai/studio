export enum ItemTypes {
  TestElementRow = "TestElementRow",
}

export enum Droppable {
  TestSequenceTable = "TestSequenceTable",
}

export type TestSequenceDragResult = {
  type: ItemTypes.TestElementRow;
  rowIdx: number;
};

export type DropResult = {
  type: Droppable;
};

export type TestSequenceDropResult = DropResult & {
  type: Droppable.TestSequenceTable;
  targetIdx: number;
};
