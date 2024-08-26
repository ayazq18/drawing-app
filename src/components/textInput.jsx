import React, { useState } from 'react';
import { Box, TextField, Slider, IconButton,  } from '@mui/material';
import ColorPicker from './colorPicker';

const TextInput = ({ setTextSettings, setSelectedShape }) => {
  const [fontSize, setFontSize] = useState(20);
  const [fontColor, setFontColor] = useState('#000000');
  const [text, setText] = useState('');

  const handleFontSizeChange = (event, newSize) => {
    setFontSize(newSize);
    setTextSettings({ text, fontSize: newSize, fontColor });
  };

  const handleFontColorChange = (color) => {
    setFontColor(color);
    setTextSettings({ text, fontSize, fontColor: color });
  };

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    setTextSettings({ text: newText, fontSize, fontColor });
  };

  return (
    <Box p={2} bgcolor="white" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <TextField
        label="Enter Text"
        variant="outlined"
        value={text}
        onChange={handleTextChange}
        fullWidth
      />
      <Slider
        value={fontSize}
        min={10}
        max={100}
        step={1}
        onChange={handleFontSizeChange}
        aria-labelledby="font-size-slider"
      />
      <ColorPicker setColor={handleFontColorChange} />
      <Box mt={2}>
        <IconButton onClick={() => setSelectedShape('freeDraw')}>Done</IconButton>
      </Box>
    </Box>
  );
};

export default TextInput;
