import React from "react";
import ConnectionKeySection from "./connectionKeySection";
import Header from "./header";
import InputKeySection from "./inputKeySection";
import VideoConnection from "./videoConnection";


export interface VideochatLayoutProps {
  title: string;
}

const VideochatLayout: React.FC<VideochatLayoutProps> = ({title}) => {
  return (
    <div>
      <div className="border-b pb-2">
        <Header title={title} />
      </div>
      <div className='mt-2 border-b'>
        <VideoConnection />
      </div>
      <div>
        <ConnectionKeySection />
      </div>
      <div>
        <InputKeySection />
      </div>
    </div>
  )
}

export default VideochatLayout;