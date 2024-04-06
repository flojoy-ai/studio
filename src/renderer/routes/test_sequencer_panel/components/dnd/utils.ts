import { useDrop } from "react-dnd";
import {
  Droppable,
  ItemTypes,
  TestSequenceDropResult,
} from "../../models/drag_and_drop";

//define behaviour for drop
export const useConfigureDropRef = (idx = 0) => {
  return useDrop(() => ({
    accept: [ItemTypes.TestElementRow],
    drop: (): TestSequenceDropResult => {
      return { type: Droppable.TestSequenceTable, targetIdx: idx };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
};
