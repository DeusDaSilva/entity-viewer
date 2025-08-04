import { FunctionComponent, useState } from "react";
import { SavedJson } from "../typings";
import { Card, CardContent, styled } from "@mui/material";
import { darkStyles, JsonView } from "react-json-view-lite";
import { StyledDrawer } from "../components/Drawer";
import { SurfaceDetail } from "./SurfaceDetail";

type SurfacesViewProps = {
  savedJson: SavedJson | null;
};

const SurfacesContent = styled("div")`
  padding: 20px;
  color: white;
`;

export const SurfacesView: FunctionComponent<SurfacesViewProps> = ({
  savedJson,
}) => {
  const [selectedSurface, setSelectedSurface] = useState<any>(null);
  const parts = savedJson?.parts || [];

  const surfaces =
    parts.find((part) => part.type === "roof").data.surfaces || [];

  if (!savedJson) {
    return <div>No saved JSON data available.</div>;
  }

  if (!surfaces || surfaces.length === 0) {
    return <div>No surfaces available.</div>;
  }

  console.log(parts);

  return (
    <SurfacesContent>
      <JsonView data={surfaces} style={darkStyles} />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {surfaces.map((surface: any, index: number) => (
          <Card
            key={index}
            style={{
              margin: "10px",
              padding: "10px",
              backgroundColor: "#333",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedSurface(surface);
            }}
          >
            <CardContent>
              <h4>Surface ID {surface.id}</h4>
            </CardContent>
          </Card>
        ))}
      </div>

      <StyledDrawer
        open={!!selectedSurface}
        onClose={() => setSelectedSurface(null)}
        anchor="right"
      >
        <SurfaceDetail surface={selectedSurface} />
      </StyledDrawer>
    </SurfacesContent>
  );
};
