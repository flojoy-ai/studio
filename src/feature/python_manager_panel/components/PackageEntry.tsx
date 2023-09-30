import { TableCell, TableRow } from "@src/components/ui/table";

type Props = {
  name: string;
  version: string;
};

const PackageEntry = ({ name, version }: Props) => {
  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>{version}</TableCell>
    </TableRow>
  );
};

export default PackageEntry;
