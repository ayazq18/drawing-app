import { useMediaQuery } from '@mui/material';
import React, { useRef, useEffect, useState, forwardRef } from 'react';

const Canvas = forwardRef(({ socket, color, brushSize, isErasing, clearCanvas }, ref) => {
  const [drawing, setDrawing] = useState(false);
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const startDrawing = (e) => {
    setDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    setPrevPos({ x: offsetX, y: offsetY });
  };

  const draw = (e) => {
    if (!drawing) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const context = ref.current.getContext('2d');
    
    // Scale the coordinates to match the canvas size
    const scaleX = ref.current.width / ref.current.offsetWidth;
    const scaleY = ref.current.height / ref.current.offsetHeight;
    
    const scaledPrevPos = {
      x: prevPos.x * scaleX,
      y: prevPos.y * scaleY,
    };
    const scaledCurrPos = {
      x: offsetX * scaleX,
      y: offsetY * scaleY,
    };

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
    context.moveTo(scaledPrevPos.x, scaledPrevPos.y);
    context.lineTo(scaledCurrPos.x, scaledCurrPos.y);
    context.stroke();

    socket.emit('drawing-data', {
      prevX: scaledPrevPos.x,
      prevY: scaledPrevPos.y,
      currX: scaledCurrPos.x,
      currY: scaledCurrPos.y,
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

  const resizeCanvas = () => {
    const canvas = ref.current;
    if (canvas) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      const context = canvas.getContext('2d');
      drawGrid(context);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial call to set up the canvas size

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    if (clearCanvas) {
      handleClear();
    }
  }, [clearCanvas]);

  return (
    <canvas
      ref={ref}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{
        // border: '0.5px solid #000',
        borderRadius: '8px',
        boxShadow: '1px 1px 4px #6965db',
        position: 'relative',
        width: `${isSmallScreen ? '90vw' : '70vw'}`,
      }}
    />
  );
});

export default Canvas;
