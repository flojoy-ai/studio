import { TableCell, TableRow } from "@/renderer/components/ui/table";
import { Test } from "@/renderer/types/testSequencer";
import { Row, flexRender } from "@tanstack/react-table";
import { useDrag } from "react-dnd";
import {
  ItemTypes,
  TestSequenceDropResult,
} from "../../../models/drag_and_drop";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";

export const GeneratedTest = ({ row }: { row: Row<Test> }) => {
  const { setElems } = useTestSequencerState();
  const [, drag] = useDrag(() => ({
    type: ItemTypes.TestElementRow,
    item: { row: row },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<TestSequenceDropResult>();
      if (item && dropResult) {
        setElems((elems) => {
          const newElems = [...elems];
          newElems.splice(dropResult.targetIdx, 0, item.row.original);
          return newElems;
        });
      }
    },
  }));
  return (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && "selected"}
      ref={drag}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};
