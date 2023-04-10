import React from 'react'
import Navbar from './Navbar'
import Chats from './Chats'
import Search from './Search'

const Sidebar = ({setMessagingUser, currentMessages}) => {
  return (
    <div className='sidebar' >
        <Navbar/>
        <Search setMessagingUser={setMessagingUser}/>
        <Chats setMessagingUser={setMessagingUser} currentMessages={currentMessages}/>
    </div>
  )
}

export default Sidebar