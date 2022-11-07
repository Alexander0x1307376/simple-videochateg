import React from "react";
import Videochat from "./components/pages/Videochat";

const App: React.FC = () => {

  return (
    <div className="relative object-cover h-screen w-screen bg-default bg-center bg-cover flex items-center justify-center text-white">
      <div className="absolute md:w-[40rem] md:h-auto h-full md:rounded-lg bg-slate-900/90 backdrop-blur text-white p-3">
        <Videochat title="Видеочятег" />
      </div>
    </div>
  );
}

export default App;
