import React from 'react';
import Navbar from './Navbar';
import Search from './Search';
import Chats from './Chats';

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <Navbar />
           <Chats />
           <Search />
            
        </div>
    );
};

export default Sidebar;