import useCanvas from '../hooks/useCanvas';

const Canvas = props => {
    const { draw, options, ...rest } = props;
    const { canvasRef, onKeyDown, onKeyUp } = useCanvas(draw, options);
    return (
    <canvas
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        ref={canvasRef}
        tabIndex="0"
        {...rest}
    />
    );
}

export default Canvas;
