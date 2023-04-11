import React from 'react'
import Navbar from './Navbar'
import Search from './Search'
import SideBarUsers from './SideBarUsers'

const Sidebar = ({currentMessages, setSideBarUsers, sideBarUsers}) => {
  return (
    <div className='sidebar' >
        <Navbar/>
        <Search/>
        <SideBarUsers currentMessages={currentMessages} setSideBarUsers={setSideBarUsers} sideBarUsers={sideBarUsers}/>
    </div>
  )
}

export default Sidebar