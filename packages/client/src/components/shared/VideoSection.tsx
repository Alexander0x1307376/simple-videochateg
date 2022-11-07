import { motion, AnimatePresence } from 'framer-motion';
import React, { useContext, useState } from 'react';
import { MdMicOff, MdPhoneDisabled, MdVideocam } from 'react-icons/md';
import { VideoConnectionContext } from '../../connection/videoConnectionContext';
import CircleButton from './CircleButton';

const VideoSection: React.FC = () => {

  const { 
    ourVideo, collocutorVideo, leaveCall, ourStream, collocutorStream
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
        <div className="h-full w-full bg-green-700">
          {collocutorStream 
          ? (
            <video
              className="h-full w-full"
              playsInline
              ref={collocutorVideo}
              autoPlay
            />
          ) : (
            <div className="h-full w-full">видео собеседника</div>
          )}
        </div>
        <div className="absolute z-10 bottom-4 right-4 bg-blue-200">
          {ourStream 
          ? (
            <video
              className="w-[12rem]"
              playsInline
              muted
              ref={ourVideo}
              autoPlay
            />
          ) : (
            <div className="w-[12rem]">наше видео</div>
          )}
        </div>
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
              flex-col items-center justify-end our-gradient
            "
          >
            <div className="py-4 flex space-x-4">
              <CircleButton
                icon={MdVideocam}
              />
              <CircleButton
                icon={MdMicOff}
              />
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