import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Toolbar from './components/toolBar';
import Canvas from './components/canvas';
import { Box, Card, Typography } from '@mui/material';

const socket = io(
  window.location.hostname === 'localhost'
    ? import.meta.env.VITE_LOCAL_ORIGIN
    : import.meta.env.VITE_PROD_ORIGIN
);

// console.log(import.meta.env.VITE_LOCAL_ORIGIN)
// console.log(import.meta.env.VITE_PROD_ORIGIN)
console.log(socket)

function App() {
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isErasing, setIsErasing] = useState(false);
  const [clearCanvas, setClearCanvas] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize drawing data when connecting to the server
    socket.on('init-drawing-data', (storedDrawingData) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        storedDrawingData.forEach((data) => {
          context.lineWidth = data.brushSize;
          context.strokeStyle = data.color;
          context.lineJoin = 'round';
          context.lineCap = 'round';
          context.globalCompositeOperation = data.isErasing ? 'destination-out' : 'source-over';
          context.beginPath();
          context.moveTo(data.prevX, data.prevY);
          context.lineTo(data.currX, data.currY);
          context.stroke();
        });
      }
    });

    // Handle incoming drawing data
    socket.on('drawing-data', (data) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.lineWidth = data.brushSize;
          context.strokeStyle = data.color;
          context.lineJoin = 'round';
          context.lineCap = 'round';
          context.globalCompositeOperation = data.isErasing ? 'destination-out' : 'source-over';
          context.beginPath();
          context.moveTo(data.prevX, data.prevY);
          context.lineTo(data.currX, data.currY);
          context.stroke();
        }
      }
    });

    // Handle clear canvas event
    socket.on('clear-canvas', () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    });

    // Cleanup when component unmounts
    return () => {
      socket.off('init-drawing-data');
      socket.off('drawing-data');
      socket.off('clear-canvas');
    };
  }, []);

  useEffect(() => {
    if (clearCanvas) {
      socket.emit('clear-canvas');
      setClearCanvas(false); // Reset the clearCanvas state
    }
  }, [clearCanvas]);

  return (
    <Box sx={{ position: 'relative', }}>
      <Card sx={{ p: 2, mb: 2 }}>
        <Typography variant='h6'>My Drawing Pad</Typography>
      </Card>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row', } }} >
        <Toolbar setColor={setColor} setBrushSize={setBrushSize} setIsErasing={setIsErasing} isErasing={isErasing} setClearCanvas={setClearCanvas} />
        <Canvas ref={canvasRef} socket={socket} color={color} brushSize={brushSize} isErasing={isErasing} clearCanvas={clearCanvas} />
      </Box>
    </Box>
  );
}

export default App;
