import React from 'react';
import ConnectionLinkSection from './components/containers/connectionLinkSection';
import Header from './components/containers/header';
import VideoConnection from './components/containers/videoConnection';


const App: React.FC = () => {
  return (
    <div className='relative h-screen w-screen bg-default bg-center bg-cover flex items-center justify-center text-white'>
      <div className='w-[40rem] h-[36rem] bg-slate-900 opacity-95 rounded-lg drop-shadow-xl'>
      </div>
      <div className='w-[40rem] h-[36rem] absolute text-white p-3'>
        <Header title="Простой видеочятег"/>
        <VideoConnection />
        <ConnectionLinkSection />
      </div>
    </div>
  );
}

export default App;
