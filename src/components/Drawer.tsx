import { Drawer, styled } from "@mui/material";

export const StyledDrawer = styled(Drawer)`
  width: 800px;
  flex-shrink: 0;
  border-left: 1px solid #fff4b7;
  & .MuiDrawer-paper {
    width: 800px;
    box-sizing: border-box;
    background-color: black;
    color: white;
  }
`;
