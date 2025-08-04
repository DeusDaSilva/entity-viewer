import { FunctionComponent } from "react";

type Point = {
  x: number;
  y: number;
};

type CanvasProps = {
  points: Point[];
};

const convertToPositiveCoordinates = (points: Point[]) => {
  return points.map((point) => ({
    x: point.x < 0 ? point.x * -1 : point.x,
    y: point.y < 0 ? point.y * -1 : point.y,
  }));
};
const scalingFactor = 50;

export const Canvas: FunctionComponent<CanvasProps> = ({ points }) => {
  const pointsToDraw = convertToPositiveCoordinates(points);
  const xs = pointsToDraw.map((p) => p.x * scalingFactor);
  const ys = pointsToDraw.map((p) => p.y * scalingFactor);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const width = maxX - minX || 1;
  const height = maxY - minY || 1;
  return (
    <svg
      width="100%"
      height="100%"
      style={{ backgroundColor: "lightgray" }}
      viewBox={`${minX - 20} ${minY - 20} ${width + 30} ${height + 30}`}
    >
      {pointsToDraw.map((point, index) => {
        const x = point.x * scalingFactor;
        const y = point.y * scalingFactor;

        return (
          <>
            {index < pointsToDraw.length - 1 && (
              <line
                x1={x}
                y1={y}
                x2={pointsToDraw[index + 1].x * scalingFactor}
                y2={pointsToDraw[index + 1].y * scalingFactor}
                stroke="black"
                strokeWidth="2"
              />
            )}
            <circle key={index} cx={x} cy={y} r="5" fill="blue" />
          </>
        );
      })}
      <line
        x1={pointsToDraw[pointsToDraw.length - 1].x * scalingFactor}
        y1={pointsToDraw[pointsToDraw.length - 1].y * scalingFactor}
        x2={pointsToDraw[0].x * scalingFactor}
        y2={pointsToDraw[0].y * scalingFactor}
        stroke="black"
        strokeWidth="2"
      />
      ;
    </svg>
  );
};
