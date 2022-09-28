import React from 'react';
import VideochatLayout from './components/containers/mainLayout';

const App: React.FC = () => {

  return (
    <div className='relative h-screen w-screen bg-default bg-center bg-cover flex items-center justify-center text-white'>
      <div className='w-[40rem] absolute rounded-lg bg-slate-900/90 backdrop-blur text-white p-3'>
        <VideochatLayout title="Видеочятег" />
      </div>
    </div>
  );
}

export default App;
