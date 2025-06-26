import React from 'react'
import Search from './Search'
import Chats from './Chats'
// import Navbar from './'

const Sidebar = () => {
  return (
    <div className='sidebar'  >

      {/* <Navbar /> */}
      
      <Search />
      <Chats />

    </div>
  )
}

export default Sidebar