import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({ imageURL, box }) => {
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputImage' src={imageURL} alt='' width='500px' height='auto'/>
        <div className='bounding-box' style={{top: box.top_row, left: box.left_col, bottom: box.bottom_row, right: box.right_col}}></div>
      </div>
    </div>
  );
}

export default FaceRecognition;