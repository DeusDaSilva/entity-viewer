import { Box, Modal, styled, ModalProps } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

const ModalContainer = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled(Box)`
  width: 600px;
  height: 800px;
  background-color: white;
  padding: 20px;
  border-radius: 16px;
`;

type ModalComponentProps = {
  children: ReactNode;
} & ModalProps;

export const ModalComponent: FunctionComponent<ModalComponentProps> = ({
  children,
  ...props
}) => {
  return (
    <ModalContainer {...props}>
      <ModalBox>{children}</ModalBox>
    </ModalContainer>
  );
};
