import React from 'react';
import { SketchPicker } from 'react-color';

const ColorPicker = ({ setColor }) => {
  const handleChangeComplete = (color) => {
    setColor(color.hex);
  };

  return <SketchPicker color="#000" onChangeComplete={handleChangeComplete} />;
};

export default ColorPicker;
