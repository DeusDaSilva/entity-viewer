import { styled, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { FunctionComponent } from "react";

const StyledEntityItem = styled("div")`
  padding: 10px;
  border: 1px solid white;
  margin: 5px;
  margin-bottom: 12px;
  border-radius: 8px;
  background-color: black;
  overflow: visible;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  color: white;
  &:hover {
    background-color: black;
    cursor: pointer;
  }
`;

const StyledTable = styled(Table)`
  width: 100%;
  margin-bottom: 10px;
  color: white;
`;
const StyledTableRow = styled(TableRow)`
  display: grid;
  grid-template-columns: 1fr 3fr;

  &:last-child td,
  &:last-child th {
    border: 0;
  }
`;

const StyledTableCell = styled(TableCell)`
  color: white;
`;

function truncate(str: string, maxLength: number) {
  if (!str || typeof str !== "string") return "";
  if (str?.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

type EntityItemProps = {
  entityId: string;
  entity: any;
  onClick: (id: string) => void;
  index: number;
  isSelected: boolean;
};

export const EntityItem: FunctionComponent<EntityItemProps> = ({
  entity,
  onClick,
  index,
  entityId,
  isSelected,
}) => {
  const componentKeys = Object.keys(entity.components);

  return (
    <StyledEntityItem
      key={index}
      onClick={() => onClick(entityId)}
      style={{
        backgroundColor: isSelected ? "#021073" : "black",
      }}
    >
      <span style={{ marginBottom: "10px" }}>
        <strong>Entity ID:</strong> {entityId}
      </span>

      <StyledTable size="small">
        <TableBody>
          {componentKeys.map((componentKey) => {
            const value = entity.components[componentKey].value;

            return (
              <StyledTableRow key={componentKey}>
                <StyledTableCell>{componentKey}</StyledTableCell>
                <StyledTableCell>
                  {truncate(JSON.stringify(value, null, 2), 300)}
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </StyledTable>
    </StyledEntityItem>
  );
};
