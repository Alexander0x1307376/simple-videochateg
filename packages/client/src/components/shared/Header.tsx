import React from "react";



export interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({title}) => {
  return (
    <div>
      <span className='font-medium'>{title}</span>
    </div>
  )
}

export default Header;