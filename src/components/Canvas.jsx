import useCanvas from '../hooks/useCanvas';

const Canvas = props => {
    const { draw, options, ...rest } = props;
    const { canvasRef, onKeyDown } = useCanvas(draw, options);
    return (
    <canvas
        onKeyDown={onKeyDown}
        ref={canvasRef}
        tabIndex="0"
        {...rest}
    />
    );
}

export default Canvas;
