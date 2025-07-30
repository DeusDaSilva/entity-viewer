import { Button, styled, Tab, Tabs } from "@mui/material";
import "./App.css";
import { InsertJsonModal } from "./modals/InsertJsonModal";
import { useEffect, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { SavedJson } from "./typings";
import { ContentPage } from "./content/content";
import "react-json-view-lite/dist/index.css";
import setupIndexedDB, { useIndexedDBStore } from "use-indexeddb";

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
  const [savedJsonTabIndex, setSavedJsonTabIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    setupIndexedDB(idbConfig)
      .then(async () => {
        const jsons = await getAll();
        setSavedJson(jsons);
      })
      .catch((e) => console.error("error / unsupported", e));
  }, []);

  return (
    <>
      <Main>
        <Sidebar>
          <h1 style={{ color: "white" }}>Entity Viewer</h1>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setJsonModalOpen(true)}
            style={{ marginBottom: "20px" }}
          >
            Insert JSON
          </Button>
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
          <ContentPage
            json={
              savedJsonTabIndex || savedJsonTabIndex === 0
                ? savedJson[savedJsonTabIndex]
                : null
            }
          />
        </Content>
      </Main>
      <InsertJsonModal
        open={jsonModalOpen}
        handleClose={() => {
          setJsonModalOpen(false);
        }}
      />
    </>
  );
}

export default App;
