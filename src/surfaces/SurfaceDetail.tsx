import { FunctionComponent } from "react";
import { Canvas } from "../components/Canvas";
import { JsonView } from "react-json-view-lite";

type SurfaceDetailProps = {
  surface: any;
};

export const SurfaceDetail: FunctionComponent<SurfaceDetailProps> = ({
  surface,
}) => {
  if (!surface) return null;
  return (
    <>
      <Canvas points={surface.draw.map((p: any) => p.to)} />
      <JsonView data={surface} />
    </>
  );
};
