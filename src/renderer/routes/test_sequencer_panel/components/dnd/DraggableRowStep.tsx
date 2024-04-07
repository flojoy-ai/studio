import { useDrag, useDrop } from "react-dnd";
import {
  Droppable,
  ItemTypes,
  TestSequenceDropResult,
} from "@/renderer/routes/test_sequencer_panel/models/drag_and_drop";
import { TableCell, TableRow } from "@/renderer/components/ui/table";
import { TestSequenceElement } from "@/renderer/types/test-sequencer";
import { Row, flexRender } from "@tanstack/react-table";
import { parseInt } from "lodash";
import { useSequencerTestState } from "@/renderer/hooks/useTestSequencerState";

export const DraggableRowStep = ({
  row,
  ...props
}: {
  row: Row<TestSequenceElement>;
}): React.ReactNode => {
  const { elems, setElems } = useSequencerTestState();

  const elementMover = (fromIdx: number, toIdx: number) => {
    setElems((elems) => {
      const new_elems = [...elems];
      new_elems.splice(toIdx, 0, elems[fromIdx]);
      fromIdx = toIdx < fromIdx ? fromIdx + 1 : fromIdx;
      new_elems.splice(fromIdx, 1);
      return new_elems;
    });
  };

  //define behaviour for drag
  //note: logic for drag and drop operations defined inside of useDrag
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.TestElementRow,
      item: { rowIdx: parseInt(row.id) },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<TestSequenceDropResult>();
        if (item && dropResult) {
          elementMover(item.rowIdx, dropResult.targetIdx);
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [elems],
  );

  //define behaviour for drop
  const useConfigureDropRef = (idx: number) => {
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

  //create drop below context
  const [{ isOver: isOverBelow, canDrop: canDropBelow }, dropBelow] =
    useConfigureDropRef(parseInt(row.id) + 1);
  const isActiveBelow = isOverBelow && canDropBelow;

  //create drop above context
  const [{ isOver: isOverAbove, canDrop: canDropAbove }, dropAbove] =
    useConfigureDropRef(parseInt(row.id));
  const isActiveAbove = isOverAbove && canDropAbove;

  return (
    <TableRow
      style={{ opacity: isDragging ? 0.2 : 1 }}
      className="relative"
      ref={drag}
      {...props}
    >
      {/* capture drag on above */}
      <div ref={dropAbove} className="absolute top-0 z-10 h-1/2 w-full" />

      {/* capture drag below */}
      <div ref={dropBelow} className="absolute bottom-0 z-10 h-1/2 w-full" />

      {isActiveBelow && (
        <div
          style={{ height: 2 }}
          className="absolute bottom-0 w-full bg-blue-700"
        />
      )}

      {isActiveAbove && (
        <div
          style={{ height: 2 }}
          className="absolute top-0 w-full bg-blue-700"
        />
      )}

      {row.getVisibleCells().map((cell) => (
        <TableCell isCompact={true} key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};
