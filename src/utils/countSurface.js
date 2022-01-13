export const countSurface = (h, w, move) => {
  const { l, r, u, d } = move;
  const width = w - l - r;
  const height = h - u - d;
  return width * height;
};
