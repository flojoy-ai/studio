import { useDrag, useDrop } from "react-dnd";
import {
  Droppable,
  ItemTypes,
  TestSequenceDropResult,
} from "@/renderer/routes/test_sequencer_panel/models/drag_and_drop";
import { TableCell, TableRow } from "@/renderer/components/ui/table";
import { Row, flexRender } from "@tanstack/react-table";
import { parseInt } from "lodash";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { Project } from "@/renderer/types/project";

export const DraggableRowSequence = ({
  row,
  ...props
}: {
  row: Row<any>;
}): React.ReactNode => {
  const { elems, setElems } = useTestSequencerState();

  // Only important part, could be pass from the table ----------------------------
  const elementMover = (fromIdx: number, toIdx: number) => {
  };
  // -------------------------------------------------------------------------------

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
        <TableCell isCompact={false} key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};
