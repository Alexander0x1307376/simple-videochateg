import React, { useContext, useState } from "react";
import { VideoConnectionContext } from "../../connection/videoConnectionContext";
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { joinToCollocutorUrl } from "../../constants/server";

const ConnectionKeySection: React.FC = () => {

  const {
    thisSocketId
  } = useContext(VideoConnectionContext);

  // const link = joinToCollocutorUrl + thisSocketId;


  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyButtonClick = () => {
    setIsCopied(true);
    setTimeout(() => { setIsCopied(false); }, 2000);
  }


  return (
    <div className='py-2'>
      <p className="mb-1">Это ключ для подключения к Вам. Скопируйте и отправьте его собеседнику:</p>
      <div className='flex w-full'>
        <span
          className='grow bg-slate-700 p-3 rounded-l-lg whitespace-nowrap overflow-hidden'
        >
          {thisSocketId}
        </span>
        <CopyToClipboard text={thisSocketId}>
          <button 
            className='grow-0 w-32 basis-30 bg-violet-700 hover:bg-violet-800
            transition-colors duration-200 rounded-r-lg p-3'
            onClick={handleCopyButtonClick}
          >
            {!isCopied ? 'Скопировать' : 'Скопирована!'}
          </button>
        </CopyToClipboard>
      </div>
    </div>
  )
}

export default ConnectionKeySection;