import React from 'react';
import { Box, Slider, IconButton, Stack, Card } from '@mui/material';
import ColorPicker from './colorPicker';
import { Icon } from '@iconify/react';

const Toolbar = ({ setColor, setBrushSize, setIsErasing, isErasing, setClearCanvas, undo, redo, SelectedShape, setSelectedShape }) => {

  const selectBtn = (shape)=>{
    setSelectedShape(shape)
    localStorage.setItem('shape', shape)
  }
  return (
    <Box p={2} bgcolor="white" sx={{ display: 'flex', alignItems: 'flex-start', zIndex: '9' }}>
      {/* Stack the ColorPicker and Slider vertically */}
      <Stack direction="column" spacing={2} sx={{ mr: 2, }}>
        <ColorPicker setColor={setColor} />
        <Card sx={{ width: 190, mt:2, p:2 }}>
        <Slider
          defaultValue={5}
          min={1}
          max={50}
          step={1}
          onChange={(e, value) => setBrushSize(value)}
          
        />
        </Card>
      </Stack>

      {/* Icons arranged horizontally */}
      <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: 1, }}>
        <IconButton onClick={() => {setIsErasing(!isErasing), selectBtn('rubber')}} color="secondary" title='Rubber'  sx={{bgcolor:`${SelectedShape === 'rubber' && 'orange'}`}}>
          <Icon icon="solar:eraser-bold-duotone" />
        </IconButton>

        <IconButton onClick={() => selectBtn('line')} color="primary" title='Line coming soon' sx={{bgcolor:`${SelectedShape == 'line' && 'orange'}`}}>
          <Icon icon="mdi:line-scan" />
        </IconButton>

        <IconButton onClick={() => selectBtn('rectangle')} color="primary" title='Rectangle coming soon' sx={{bgcolor:`${SelectedShape === 'rectangle' && 'orange'}`}}>
          <Icon icon="mdi:rectangle-outline" />
        </IconButton>

        <IconButton onClick={() => selectBtn('circle')} color="primary" title='Circle coming soon' sx={{bgcolor:`${SelectedShape === 'circle' && 'orange'}`}}>
          <Icon icon="mdi:circle-outline" />
        </IconButton>

        <IconButton onClick={() => {setClearCanvas(true), selectBtn('clear')}} color="primary" title='Clear' sx={{bgcolor:`${SelectedShape === 'clear' && 'orange'}`}}>
          <Icon icon="emojione-v1:cancellation-x" />
        </IconButton>

        <IconButton onClick={()=>{undo,  selectBtn('undo')}} color="primary" title='Undo' sx={{bgcolor:`${SelectedShape === 'undo' && 'orange'}`}}>
          <Icon icon="mdi:undo" />
        </IconButton>

        <IconButton onClick={()=>{redo,  selectBtn('redo')}} color="primary" title='Redo' sx={{bgcolor:`${SelectedShape === 'redo' && 'orange'}`}}>
          <Icon icon="mdi:redo" />
        </IconButton>
      </Card>
    </Box>
  );
};

export default Toolbar;
