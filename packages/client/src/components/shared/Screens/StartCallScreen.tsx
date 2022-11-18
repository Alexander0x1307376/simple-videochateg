import React, { useContext } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { MdOutlineFileCopy } from 'react-icons/md';
import { VideoConnectionContext } from '../../../connection/videoConnectionContext';

const StartCallScreen: React.FC = () => {
  
  const { thisKey } = useContext(VideoConnectionContext);
  
  return (
    <div className="h-full w-full flex flex-col">
      <div className="grow flex items-center justify-center">
        <div className="w-2/3 flex flex-col md:flex-row items-stretch">
          <div className="flex items-center mr-2">
            <span>Ваш ключ:</span>
          </div>
          <div className="border-b-2 grow flex items-center">
            <span className="select-all grow">{thisKey}</span>
            <CopyToClipboard text={thisKey}>
              <button
                className="py-2 px-3 hover:bg-slate-600 transition-colors duration-75"
              >
                <MdOutlineFileCopy size={'1.4rem'} />
              </button>
            </CopyToClipboard>
          </div>
        </div>
      </div>
      <div className="relative grow-0 flex justify-center pb-4 px-4 h-28">
        <span className="text-center">
          Сообщите ваш ключ собеседнику и дождитесь вызова, либо позвоните ему по ключу, который он Вам сообщил
        </span>
      </div>
    </div>
  );
}

export default StartCallScreen;