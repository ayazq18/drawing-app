import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Canvas from './components/canvas';
import { Box, Card, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth } from './components/fireBase';
import NavBar from './components/navBar';
import DrawingToolbar from './components/toolBar';
import TextInput from './components/textInput';

let socket;

function App() {
  const [color, setColor] = useState('#000000');
  const [selectedShape, setSelectedShape] = useState('rubber');
  const [brushSize, setBrushSize] = useState(5);
  const [isErasing, setIsErasing] = useState(false);
  const [clearCanvas, setClearCanvas] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const canvasRef = useRef(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [textSettings, setTextSettings] = useState({});
console.log(undoStack)
  useEffect(() => {
    const initializeSocket = async () => {
      const user = auth.currentUser;
      if (user) {
        const token = await getIdToken(user);
         socket = io(
          window.location.hostname === 'localhost'
            ? import.meta.env.VITE_LOCAL_ORIGIN 
            : import.meta.env.VITE_PROD_ORIGIN, 
          {
            path: '/socket.io',
            query: { token },
            transports: ['websocket'], 
            withCredentials: true, 
          }
        );

        socket.on('init-drawing-data', (storedDrawingData) => {
          const canvas = canvasRef.current;
          if (canvas) {
            const context = canvas.getContext('2d');
            storedDrawingData.forEach((data) => {
              drawOnCanvas(context, data);
            });
          }
        });

        socket.on('drawing-data', (data) => {
          const canvas = canvasRef.current;
          if (canvas) {
            const context = canvas.getContext('2d');
            drawOnCanvas(context, data);
            setUndoStack((prev) => [...prev, data]);
          }
        });

        socket.on('clear-canvas', () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            setUndoStack([]);
            setRedoStack([]);
          }
        });

        socket.on('user-count', (count) => {
          setUserCount(count);
        });

        setSelectedShape(localStorage.getItem('shape') && localStorage.getItem('shape'));
      }
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (clearCanvas && socket) {
      socket.emit('clear-canvas');
      setClearCanvas(false);
    }
  }, [clearCanvas]);

  const drawOnCanvas = (context, data) => {
    context.lineWidth = data.brushSize;
    context.strokeStyle = data.color;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.globalCompositeOperation = data.isErasing ? 'destination-out' : 'source-over';
    context.beginPath();
    context.moveTo(data.prevX, data.prevY);
    context.lineTo(data.currX, data.currY);
    context.stroke();
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const lastAction = undoStack.pop();
    setRedoStack((prev) => [...prev, lastAction]);
    redrawCanvas(undoStack);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const lastUndone = redoStack.pop();
    setUndoStack((prev) => [...prev, lastUndone]);
    redrawCanvas([...undoStack, lastUndone]);
  };

  const redrawCanvas = (actions) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      actions.forEach((action) => drawOnCanvas(context, action));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
       <Box sx={{ position: 'relative' }}>
        <Routes>
          <Route
            path="/"
            element={!isLoggedIn ? <Navigate to="/login" /> : <Navigate to="/drawing-pad" />}
          />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/drawing-pad" />
              ) : (
                <Login onLoginSuccess={() => setIsLoggedIn(true)} />
              )
            }
          />
          <Route
            path="/drawing-pad"
            element={
              isLoggedIn ? (
                <>
                  <NavBar userCount={userCount}/>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, position:'relative' }}>
                    <DrawingToolbar
                      setColor={setColor}
                      setBrushSize={setBrushSize}
                      setIsErasing={setIsErasing}
                      isErasing={isErasing}
                      SelectedShape={selectedShape}
                      setSelectedShape={setSelectedShape}
                      setClearCanvas={setClearCanvas}
                      undo={undo}
                      redo={redo}
                    />
                    {selectedShape === 'text' && (
                      <TextInput
                        setTextSettings={setTextSettings}
                        setSelectedShape={setSelectedShape}
                      />
                    )}
                    <Canvas
                      ref={canvasRef}
                      socket={socket}
                      color={color}
                      brushSize={brushSize}
                      isErasing={isErasing}
                      clearCanvas={clearCanvas}
                    />
                  </Box>
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/register" element={<Register />} />
        </Routes>
        </Box>
    </Router>
  );
}

export default App;
