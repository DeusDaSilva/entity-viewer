import { Chip, Divider, Drawer, Input, styled } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { SavedJson } from "../typings";
import { EntityItem } from "./EntityItem";
import { EntityDetail } from "./EntitiyDetail";

const Layout = styled("div")`
  color: white;
  display: grid;
`;

const EntityList = styled("div")`
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;
  background-color: black;
  border-right: 1px solid #006a67;
`;

const FilterToggle = styled(Chip)`
  color: white;
  cursor: pointer;
  border: 1px solid #006a67;

  &:hover {
    background-color: #021073;
    cursor: pointer;
  }
`;

const StyledDrawer = styled(Drawer)`
  width: 800px;
  flex-shrink: 0;
  border-left: 1px solid #fff4b7;
  & .MuiDrawer-paper {
    width: 400px;
    box-sizing: border-box;
    background-color: black;
    color: white;
  }
`;

const EntityHeader = styled("div")`
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #006a67;
  color: white;
  font-weight: bold;
  font-size: 16px;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  flex-direction: row;
  margin-bottom: 10px;
  & span {
    flex: 1;
    text-align: center;
  }
`;

const StyledInput = styled(Input)`
  color: white;
  border: 1px solid #006a67;
  padding: 5px;
  margin-bottom: 10px;
  background-color: black;
  width: 100%;
  &:focus {
    border-color: #fff4b7;
    outline: none;
  }
`;

type ContentPageProps = {
  json: SavedJson | null;
};

export const ContentPage: FunctionComponent<ContentPageProps> = ({ json }) => {
  const [selectedComponentFilters, setSelectedComponentFilters] = useState<
    Array<string>
  >([]);
  const [selectedEntityId, setSelectedEntitiyId] = useState<string | null>(
    null
  );
  const [selectedEntityCommonRefKey, setSelectedEntityCommonRefKey] = useState<
    string | null
  >(null);
  const [selectedEntityCommonRefId, setSelectedEntityCommonRefId] = useState<
    string | null
  >(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  if (!json) {
    return (
      <Layout>
        <h2>No JSON data available</h2>
        <p>Please insert JSON data to view entities.</p>
      </Layout>
    );
  }
  const { json: e } = json;

  const entities = e as Record<string, any>;

  const entityIds = Object.keys(entities);

  const handleFilterToggle = (component: string) => {
    setSelectedComponentFilters((prev) =>
      prev.includes(component)
        ? prev.filter((c) => c !== component)
        : [...prev, component]
    );
  };

  const getDistinctComponents = () => {
    const components: Set<string> = new Set();
    entityIds.forEach((entityId) => {
      Object.keys(entities[entityId].components).forEach((componentKey) => {
        components.add(componentKey);
      });
    });
    return Array.from(components);
  };

  const filteredEntityIds = entityIds
    .filter((id) => {
      if (searchTerm && searchTerm.trim() !== "") {
        return JSON.stringify(entities[id])
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .filter((id) => {
      if (selectedEntityCommonRefId && selectedEntityCommonRefKey) {
        return (
          entities[id].components[selectedEntityCommonRefKey]?.value ===
          selectedEntityCommonRefId
        );
      }
      return true;
    })
    .filter((id) => {
      if (selectedComponentFilters.length === 0) return true;
      return selectedComponentFilters.some((filter) =>
        Object.keys(entities[id].components).includes(filter)
      );
    });

  return (
    <Layout>
      <EntityList>
        <div style={{ padding: "10px" }}>
          <div>
            {getDistinctComponents().map((component) => (
              <FilterToggle
                label={component}
                onClick={() => handleFilterToggle(component)}
                key={component}
                style={{
                  backgroundColor: selectedComponentFilters.includes(component)
                    ? "#FFF4B7"
                    : "transparent",
                  color: selectedComponentFilters.includes(component)
                    ? "#000"
                    : "white",
                }}
              ></FilterToggle>
            ))}
            <FilterToggle
              label="Clear Filters"
              onClick={() => setSelectedComponentFilters([])}
            ></FilterToggle>
            {selectedEntityCommonRefId && (
              <FilterToggle
                label={`Reset Ref: ${selectedEntityCommonRefId}`}
                onClick={() => {
                  setSelectedEntityCommonRefId(null);
                  setSelectedEntityCommonRefKey(null);
                }}
                style={{ backgroundColor: "#FFF4B7", color: "#000" }}
              ></FilterToggle>
            )}
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <StyledInput
              placeholder="Search by Entity ID"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                setSearchTerm(searchTerm);
              }}
              style={{ marginBottom: "10px", width: "300px" }}
            />
            <h4>Showing {filteredEntityIds.length} items</h4>
          </div>
          <EntityHeader>
            <span style={{ flex: 1 }}>Entity ID</span>
            <span style={{ flex: 3 }}>Values</span>
          </EntityHeader>
          <div
            style={{
              overflowY: "auto",
              maxHeight: "85vh",
            }}
          >
            {filteredEntityIds.map((entityId: string, index: number) => (
              <>
                <EntityItem
                  key={entityId}
                  entityId={entityId}
                  entity={entities[entityId]}
                  onClick={(id) => setSelectedEntitiyId(id)}
                  index={index}
                  isSelected={selectedEntityId === entityId}
                />
                <Divider
                  style={{
                    backgroundColor: "white",
                    margin: "10px 0",
                  }}
                />
              </>
            ))}
          </div>
        </div>
      </EntityList>
      <StyledDrawer
        open={!!selectedEntityId}
        anchor="right"
        onClose={() => {
          setSelectedEntitiyId(null);
        }}
      >
        {selectedEntityId && (
          <EntityDetail
            selectedEntity={entities[selectedEntityId]}
            setCommonRef={(refKey, id) => {
              setSelectedEntityCommonRefKey(refKey);
              setSelectedEntityCommonRefId(id);
              setSelectedEntitiyId(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </StyledDrawer>
    </Layout>
  );
};
