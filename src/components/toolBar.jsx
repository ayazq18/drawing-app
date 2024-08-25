import React from 'react';
import { Box, Slider, IconButton, Stack, Card } from '@mui/material';
import ColorPicker from './colorPicker';
import { Icon } from '@iconify/react';

const Toolbar = ({ setColor, setBrushSize, setIsErasing, isErasing, setClearCanvas, undo, redo }) => {
  return (
    <Box p={2} bgcolor="white" sx={{ display: 'flex', alignItems: 'flex-start', zIndex: '9' }}>
      {/* Stack the ColorPicker and Slider vertically */}
      <Stack direction="column" spacing={2} sx={{ mr: 2 }}>
        <ColorPicker setColor={setColor} />
        <Slider
          defaultValue={5}
          min={1}
          max={50}
          step={1}
          onChange={(e, value) => setBrushSize(value)}
          sx={{ width: 150 }}
        />
      </Stack>

      {/* Icons arranged horizontally */}
      <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: 1 }}>
        <IconButton onClick={() => setIsErasing(!isErasing)} color="secondary">
          <Icon icon="solar:eraser-bold-duotone" />
        </IconButton>
        <IconButton onClick={() => setIsErasing(!isErasing)} color="secondary">
          <Icon icon="vscode-icons:file-type-excalidraw" />
        </IconButton>
        <IconButton onClick={() => setClearCanvas(true)} color="primary">
          <Icon icon="emojione-v1:cancellation-x" />
        </IconButton>
        <IconButton onClick={undo} color="primary">
          <Icon icon="mdi:undo" />
        </IconButton>
        <IconButton onClick={redo} color="primary">
          <Icon icon="mdi:redo" />
        </IconButton>
      </Card>
    </Box>
  );
};

export default Toolbar;
