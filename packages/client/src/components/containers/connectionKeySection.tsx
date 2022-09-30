import React, { useContext, useState } from "react";
import { VideoConnectionContext } from "../../connection/videoConnectionContext";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdOutlineFileCopy } from "react-icons/md";
import EndButton from "../shared/EndButton";


const ConnectionKeySection: React.FC = () => {

  const {
    thisSocketId
  } = useContext(VideoConnectionContext);

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyButtonClick = () => {
    setIsCopied(true);
    setTimeout(() => { setIsCopied(false); }, 2000);
  }


  return (
    <div className="py-2">
      <p className="mb-1">
        Это ключ для подключения к Вам. Скопируйте и отправьте его собеседнику:
      </p>
      <div className="flex w-full">
        <span
          className="grow bg-slate-700 p-3 rounded-l-lg whitespace-nowrap overflow-hidden select-all"
        >
          {thisSocketId}
        </span>
        <CopyToClipboard text={thisSocketId}>
          <EndButton 
            buttonType={!isCopied ? 'default' : 'success'}
            onClick={handleCopyButtonClick}
          >
            <div className="flex items-center space-x-2">
              <MdOutlineFileCopy size={'20px'} />
              <span>
                {!isCopied ? 'Скопировать' : 'Скопирована!'}
              </span>
            </div>
          </EndButton>
        </CopyToClipboard>
      </div>
    </div>
  )
}

export default ConnectionKeySection;