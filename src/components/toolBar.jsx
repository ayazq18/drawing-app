import React from 'react';
import { Box, Slider, IconButton, Button, Stack } from '@mui/material';
import ColorPicker from './colorPicker';
import { Icon } from '@iconify/react';

const Toolbar = ({ setColor, setBrushSize, setIsErasing, isErasing, setClearCanvas }) => {
  return (
    <Box p={2} bgcolor="white">
      <ColorPicker setColor={setColor} />
      <Stack direction='column' sx={{ml:2}}>
        <Slider
          defaultValue={5}
          min={1}
          max={50}
          step={1}
          onChange={(e, value) => setBrushSize(value)}
          sx={{ width: 200, mx: 2 }}
        />
        <IconButton
          variant={isErasing ? 'contained' : 'outlined'}
          onClick={() => setIsErasing(!isErasing)}
          color="secondary"
          sx={{ m: 2 }}
        >
          {isErasing ? <Icon icon="solar:eraser-bold-duotone"></Icon> : <Icon icon="vscode-icons:file-type-excalidraw"></Icon>}
        </IconButton>
        <IconButton
          variant="contained"
          color="primary"
          onClick={() => setClearCanvas(true)}
        >
          Clear
        </IconButton>
      </Stack>
    </Box>
  );
};

export default Toolbar;
