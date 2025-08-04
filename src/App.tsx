import { Button, styled, Tab, Tabs } from "@mui/material";
import "./App.css";
import { InsertJsonModal } from "./modals/InsertJsonModal";
import { useEffect, useState } from "react";
import { SavedJson } from "./typings";
import { EntityView } from "./entity/EntityView";
import setupIndexedDB, { useIndexedDBStore } from "use-indexeddb";
import { UploadLbdFileModal } from "./modals/UploadLbdFileModal";
import { SurfacesView } from "./surfaces/SurfacesView";

import "react-json-view-lite/dist/index.css";

const Main = styled("main")`
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 5fr;
`;

const Sidebar = styled("aside")`
  width: 100%;
  height: 100%;
  background-color: black;
`;

const Content = styled("div")`
  width: 100%;
  height: 100%;
  background-color: black;
`;

const SavedJsonTab = styled(Tab)`
  color: white;
  &:hover {
    background-color: #021073;
  }
  &.Mui-selected {
    background-color: #021073;
    color: white;
  }
`;

const idbConfig = {
  databaseName: "saved-json-db",
  version: 1,
  stores: [
    {
      name: "savedJson",
      id: { keyPath: "id" },
      indices: [
        { name: "name", keyPath: "name", options: { unique: false } },
        { name: "json", keyPath: "json" },
        { name: "plan", keyPath: "plan" },
        { name: "parts", keyPath: "parts" },
        { name: "createdAt", keyPath: "createdAt" },
        { name: "updatedAt", keyPath: "updatedAt" },
      ],
    },
  ],
};

function App() {
  const [savedJson, setSavedJson] = useState<SavedJson[]>([]);
  const { getAll } = useIndexedDBStore<SavedJson>("savedJson");
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [categoryTabIndex, setCategoryTabIndex] = useState(0);
  const [savedJsonTabIndex, setSavedJsonTabIndex] = useState<number | null>(
    null
  );
  const [uploadLbdFileModalOpen, setUploadLbdFileModalOpen] = useState(false);

  useEffect(() => {
    setupIndexedDB(idbConfig)
      .then(async () => {
        const jsons = await getAll();
        setSavedJson(jsons);
      })
      .catch((e) => console.error("error / unsupported", e));
  }, []);

  console.log("categoryTabIndex", categoryTabIndex);

  return (
    <>
      <Main>
        <Sidebar>
          <h1 style={{ color: "white" }}>Entity Viewer</h1>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setJsonModalOpen(true)}
              size="small"
              style={{ marginBottom: "20px", marginRight: "10px" }}
            >
              Insert JSON
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => setUploadLbdFileModalOpen(true)}
              style={{ marginBottom: "20px" }}
              size="small"
            >
              Upload LBD File
            </Button>
          </div>
          <Tabs
            value={savedJsonTabIndex}
            variant="scrollable"
            orientation="vertical"
            scrollButtons={false}
            aria-label="scrollable prevent tabs example"
          >
            {savedJson.map((json, index) => (
              <SavedJsonTab
                key={json.id}
                label={json.name || json.id}
                onClick={() => setSavedJsonTabIndex(index)}
              />
            ))}
          </Tabs>
        </Sidebar>
        <Content>
          <Tabs
            value={categoryTabIndex}
            onChange={(e, newValue) => setCategoryTabIndex(newValue)}
            variant="fullWidth"
          >
            <SavedJsonTab label="Entities" value={0} />
            <SavedJsonTab label="Surfaces" value={1} />
          </Tabs>
          {
            [
              <EntityView
                json={
                  savedJsonTabIndex || savedJsonTabIndex === 0
                    ? savedJson[savedJsonTabIndex]
                    : null
                }
              />,
              <SurfacesView
                savedJson={
                  savedJsonTabIndex || savedJsonTabIndex === 0
                    ? savedJson[savedJsonTabIndex]
                    : null
                }
              />,
            ][categoryTabIndex]
          }
        </Content>
      </Main>
      <InsertJsonModal
        open={jsonModalOpen}
        onClose={() => {
          setJsonModalOpen(false);
        }}
      />

      <UploadLbdFileModal
        open={uploadLbdFileModalOpen}
        onClose={() => {
          setUploadLbdFileModalOpen(false);
        }}
      />
    </>
  );
}

export default App;
