import {
  Icon,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { FunctionComponent } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const StyledEntityItem = styled("div")`
  padding: 10px;
  border: 1px solid #006a67;
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
  color: #00fff7;
  border-color: #006a67;
`;

const StyledIconButton = styled(IconButton)`
  color: #00fff7;
  &:hover {
    background-color: #021073;
    color: white;
  }
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
                <StyledTableCell
                  style={{ display: "grid", gridTemplateColumns: "auto 50px" }}
                >
                  <span>{truncate(JSON.stringify(value, null, 2), 300)}</span>
                  <StyledIconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      let valueToCopy = value;
                      if (typeof value === "object") {
                        valueToCopy = JSON.stringify(value);
                      }
                      navigator.clipboard.writeText(valueToCopy);
                    }}
                    size="small"
                  >
                    <ContentCopyIcon sx={{ fontSize: 12 }} />
                  </StyledIconButton>
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </StyledTable>
    </StyledEntityItem>
  );
};
