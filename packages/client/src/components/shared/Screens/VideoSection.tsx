import { motion, AnimatePresence } from 'framer-motion';
import React, { useContext, useState } from 'react';
import { MdPhoneDisabled } from 'react-icons/md';
import { VideoConnectionContext } from '../../../connection/videoConnectionContext';
import CircleButton from '../CircleButton';
import SmallVideoElement from '../SmallVideoElement';

const VideoSection: React.FC = () => {

  const { 
    refOurVideoElement, refCollocutorVideoElement, leaveCall
  } = useContext(VideoConnectionContext);
  const [areControlsVisible, setAreControlsVisible] = useState<boolean>();
  
  const handleVideosectionHover = () => {
    setAreControlsVisible(true);
  }
  const handleVideosectionLeave = () => {
    setAreControlsVisible(false);
  }

  return (
    <div 
      className="h-full w-full relative"
      onMouseOver={handleVideosectionHover}
      onMouseLeave={handleVideosectionLeave}
    >
      {/* морды */}
      <div className="relative h-full w-full">
        <div className="h-full w-full">
          {refCollocutorVideoElement
          ? (
            <video
              className="h-full w-full"
              playsInline
              ref={refCollocutorVideoElement}
              autoPlay
            />
          )
          : (
            <div className='h-full w-full flex justify-center items-center'>
              <span>Получение видео собеседника...</span>
            </div>
          )}
        </div>

        <SmallVideoElement refVideoElement={refOurVideoElement} />
      </div>

      <AnimatePresence exitBeforeEnter>
        {areControlsVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .02 }}
            className="
              flex transition-all duration-150 absolute top-0 bottom-0 w-full 
              flex-col md:items-center items-start justify-end our-gradient
            "
          >
            <div className="p-4 flex space-x-4">
              <CircleButton
                type='danger'
                icon={MdPhoneDisabled}
                onClick={leaveCall}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default VideoSection;