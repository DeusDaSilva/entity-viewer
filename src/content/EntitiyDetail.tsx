import { Button } from "@mui/material";
import { FunctionComponent } from "react";
import { JsonView, darkStyles } from "react-json-view-lite";

type EntityDetailProps = {
  selectedEntity: any;
  setCommonRef: (key: string, value: string) => void;
};

export const EntityDetail: FunctionComponent<EntityDetailProps> = ({
  selectedEntity,
  setCommonRef,
}) => {
  const componentKeys = Object.keys(selectedEntity.components);

  const refKeys = componentKeys.filter((key) => key.endsWith("_REF"));

  return (
    <>
      <JsonView
        data={selectedEntity}
        shouldExpandNode={(level) => level < 3}
        style={darkStyles}
        clickToExpandNode={true}
      />
      <div style={{ marginTop: "20px" }}>
        {refKeys.map((refKey) => (
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setCommonRef(refKey, selectedEntity.components[refKey].value);
            }}
          >
            Show all items of {refKey}
          </Button>
        ))}
      </div>
    </>
  );
};
