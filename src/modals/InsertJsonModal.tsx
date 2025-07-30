import { FunctionComponent, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
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

type InsertJsonModalProps = {
  open: boolean;
  handleClose: () => void;
};

export const InsertJsonModal: FunctionComponent<InsertJsonModalProps> = ({
  open,
  handleClose,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      add(newSavedJson);
      setName(null);
      setJson("");
      setErrorMessage(null);
      handleClose();
    } catch (error) {
      setErrorMessage("Invalid JSON format.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{ width: 400, bgcolor: "background.paper", p: 4, borderRadius: 2 }}
      >
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
      </Box>
    </Modal>
  );
};
