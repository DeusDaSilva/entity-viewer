import { FunctionComponent, useState } from "react";
import { SavedJson } from "../typings";
import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  Typography,
} from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import { useIndexedDBStore } from "use-indexeddb";
import { ModalComponent } from "./Modal";

type InsertJsonModalProps = {
  open: boolean;
  onClose: () => void;
};

export const InsertJsonModal: FunctionComponent<InsertJsonModalProps> = ({
  open,
  onClose,
}) => {
  const { add } = useIndexedDBStore("savedJson");
  const [name, setName] = useState<string | null>(null);
  const [json, setJson] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const saveJson = () => {
    try {
      const parsedJson = JSON.parse(json);
      const newSavedJson: SavedJson = {
        id: crypto.randomUUID(),
        name,
        json: parsedJson,
        plan: null,
        parts: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      add(newSavedJson);
      setName(null);
      setJson("");
      setErrorMessage(null);
      onClose();
    } catch (error) {
      setErrorMessage("Invalid JSON format.");
    }
  };

  return (
    <ModalComponent open={open} onClose={onClose}>
      <>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Paste your JSON here
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Name of saved JSON:
          </Typography>
          <Input
            placeholder="Enter a name for your JSON"
            onChange={(e) => {
              const name = e.target.value;
              setName(name);
            }}
            sx={{ mt: 1 }}
          />
        </FormControl>
        <Textarea
          minRows={10}
          maxRows={20}
          placeholder="Paste your JSON here"
          sx={{ mt: 2, width: "100%" }}
          onChange={(e) => {
            const json = e.target.value;
            setJson(json);
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            saveJson();
          }}
        >
          Save JSON
        </Button>
        {errorMessage && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
      </>
    </ModalComponent>
  );
};
