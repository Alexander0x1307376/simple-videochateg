import React from 'react';

export interface SmallVideoElementProps {
  refVideoElement: any;
}

const SmallVideoElement: React.FC<SmallVideoElementProps> = ({ refVideoElement }) => {
  return (
    <div className="absolute z-10 bottom-4 right-4 bg-blue-200 rounded-lg overflow-clip">
      {
        refVideoElement 
        ? 
        <video
          className="w-[12rem]"
          playsInline
          muted
          ref={refVideoElement}
          autoPlay
        />
        : 
        <div className='h-full w-full'>
          <span>Получение видео...</span>
        </div>
      }
    </div>
  )
}

export default SmallVideoElement;