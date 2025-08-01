export const resizeCanvas = canvas => {
  const { width, height } = canvas.getBoundingClientRect();
  if (canvas.width !== width || canvas.height !== height) {
    const { devicePixelRatio: ratio = 1 } = window;
    const context = canvas.getContext('2d');
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    if (context) {
      context.scale(ratio, ratio);
    }
    return { width, height }; // here you can return some usefull information like delta width and delta height instead of just true
  }
  return false;
};
