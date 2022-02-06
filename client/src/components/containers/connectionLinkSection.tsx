import React from "react";

const ConnectionLinkSection: React.FC = () => {
  return (
    <div className='py-2'>
      <p>Это ссылка для подключения к Вам:</p>
      <div className='my-3 flex'>
        <span
          className='grow bg-slate-700 p-3 rounded-l whitespace-nowrap overflow-hidden overflow-ellipsis'
        >http://atata.server/23424-34524fsd-324234-d3223d-453534-dfsdfs-4353453-sdfs</span>
        <button className='grow-0 bg-violet-700 hover:bg-violet-400 hover:text-black transition-colors duration-200 rounded-r p-3'>Скопировать</button>
      </div>
      <p>Скопируйте её и отправьте своему собеседнику</p>
    </div>
  )
}

export default ConnectionLinkSection;