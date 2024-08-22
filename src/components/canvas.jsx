import React, { useRef, useEffect, useState, forwardRef } from 'react';

const Canvas = forwardRef(({ socket, color, brushSize, isErasing, clearCanvas }, ref) => {
  const [drawing, setDrawing] = useState(false);
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });

  const startDrawing = (e) => {
    setDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    setPrevPos({ x: offsetX, y: offsetY });
  };

  const draw = (e) => {
    if (!drawing) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const context = ref.current.getContext('2d');

    context.lineWidth = brushSize;
    context.lineJoin = 'round';
    context.lineCap = 'round';

    if (isErasing) {
      context.globalCompositeOperation = 'destination-out';
      context.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = color;
    }

    context.beginPath();
    context.moveTo(prevPos.x, prevPos.y);
    context.lineTo(offsetX, offsetY);
    context.stroke();

    socket.emit('drawing-data', {
      prevX: prevPos.x,
      prevY: prevPos.y,
      currX: offsetX,
      currY: offsetY,
      color,
      brushSize,
      isErasing,
    });

    setPrevPos({ x: offsetX, y: offsetY });
  };

  const stopDrawing = () => setDrawing(false);

  const handleClear = () => {
    const context = ref.current.getContext('2d');
    context.clearRect(0, 0, ref.current.width, ref.current.height);
    socket.emit('clear-canvas');
  };

  useEffect(() => {
    const canvas = ref?.current;
    if (canvas) {
      canvas.width = window.innerWidth * 0.5;
      canvas.height = window.innerHeight * 0.8;
      canvas.style.width = `${window.innerWidth * 0.5}px`;
      canvas.style.height = `${window.innerHeight * 0.8}px`;

      // Draw grid
      drawGrid(canvas.getContext('2d'));
    }
  }, [ref]);

  useEffect(() => {
    if (clearCanvas) {
      handleClear();
    }
  }, [clearCanvas]);

  const drawGrid = (context) => {
    const step = 20;
    context.strokeStyle = '#eee';
    context.lineWidth = 0.5;
    for (let x = step; x < ref.current.width; x += step) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, ref.current.height);
      context.stroke();
    }
    for (let y = step; y < ref.current.height; y += step) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(ref.current.width, y);
      context.stroke();
    }
  };

  return (
    <canvas
      ref={ref}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{
        border: '2px solid #000',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        position: 'relative',
      }}
    />
  );
});

export default Canvas;
