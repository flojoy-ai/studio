export const addRandomPositionOffset = (
  pos: { x: number; y: number },
  range: number,
) => {
  return {
    x: pos.x + (Math.random() - 0.5) * range,
    y: pos.y + (Math.random() - 0.5) * range,
  };
};
