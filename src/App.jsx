import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Toolbar from './components/toolBar';
import Canvas from './components/canvas';
import { Box } from '@mui/material';

const socket = io('http://localhost:5000');

function App() {
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isErasing, setIsErasing] = useState(false);
  const [clearCanvas, setClearCanvas] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
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

    socket.on('clear-canvas', () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    });

    // Cleanup the data when component unmount
    return () => {
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
    <Box sx={{display:'flex', flexDirection:{xs:'column', md:'row'}}} >
      <Toolbar setColor={setColor} setBrushSize={setBrushSize} setIsErasing={setIsErasing} isErasing={isErasing} setClearCanvas={setClearCanvas} />
      <Canvas ref={canvasRef} socket={socket} color={color} brushSize={brushSize} isErasing={isErasing} clearCanvas={clearCanvas} />
    </Box>
  );
}

export default App;
