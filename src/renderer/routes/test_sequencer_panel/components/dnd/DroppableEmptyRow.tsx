import { TableCell, TableRow } from "@/renderer/components/ui/table";
import { useConfigureDropRef } from "./utils";

export const DroppableEmptyRow = ({ colSpan }: { colSpan: number }) => {
  //create drop below context
  const [{ isOver: isOverEmpty, canDrop: canDropEmpty }, dropEmpty] =
    useConfigureDropRef();
  const isActive = isOverEmpty && canDropEmpty;

  return (
    <TableRow className="relative">
      {/* capture drag below */}
      <div ref={dropEmpty} className="absolute z-10 h-full w-full" />

      {isActive && (
        <div
          style={{ height: 2 }}
          className="absolute top-0 w-full bg-blue-700"
        />
      )}

      <TableCell colSpan={colSpan} className="h-24 w-full text-center">
        Add tests to get started!
      </TableCell>
    </TableRow>
  );
};
