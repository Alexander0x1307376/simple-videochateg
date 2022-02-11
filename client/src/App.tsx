import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './routes/routes';

const App: React.FC = () => {

  const pages = useRoutes(routes);

  return (
    <div className='relative h-screen w-screen bg-default bg-center bg-cover flex items-center justify-center text-white'>
      <div className='w-[40rem] absolute rounded-lg bg-slate-900/90 backdrop-blur text-white p-3'>
        {pages}
      </div>
    </div>
  );
}

export default App;
