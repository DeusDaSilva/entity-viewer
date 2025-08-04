import { FunctionComponent } from "react";
import { ModalComponent } from "./Modal";
import { useIndexedDBStore } from "use-indexeddb";

type UploadLbdFileModalProps = {
  open: boolean;
  onClose: () => void;
};

export const UploadLbdFileModal: FunctionComponent<UploadLbdFileModalProps> = ({
  open,
  onClose,
}) => {
  const { add } = useIndexedDBStore("savedJson");

  const findEntities = (json: any) => {
    return json.data.plan.parts.find((p: any) => p.type === "world").data
      .entities;
  };

  const handleFileUpload = (fileList: FileList | null) => {
    if (fileList && fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result;
          if (typeof content === "string") {
            try {
              const parsedContent = JSON.parse(content);
              const newSavedJson = {
                id: crypto.randomUUID(),
                name: parsedContent.data.plan.plan.title,
                json: findEntities(parsedContent),
                parts: parsedContent.data.plan.parts,
                plan: parsedContent.data.plan.plan,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              add(newSavedJson);
            } catch (error) {
              console.error("Invalid JSON format in file:", file.name, error);
            }
          }
        };
        reader.readAsText(file);
      }
    }
  };

  return (
    <ModalComponent open={open} onClose={onClose}>
      <>
        <h2>Upload LBD File</h2>
        <input
          type="file"
          accept=".lbd"
          style={{ width: "100%" }}
          onChange={(e) => {
            const files = e.target.files;
            handleFileUpload(files);
            onClose();
          }}
        />
      </>
    </ModalComponent>
  );
};
