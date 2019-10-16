import React, {useState} from 'react';
import {AppBar, Toolbar, IconButton, Typography} from '@material-ui/core';
import SideNav from './sidenav/sidenav';
import {SideNavContext} from '../../context/context';

export default function Header() {
    const [toggleDrawer, setDrawer] = useState(false)

    const toggler = (event) =>{
        setDrawer(false)
    }

    return(
        <SideNavContext.Provider
            value={{
                toggleDrawer: toggleDrawer,
                toggler: toggler
            }}
        >
            <AppBar position="static">
                <Toolbar>
                    <IconButton 
                        edge="start" 
                        color="inherit"
                        onClick={()=>setDrawer(true)} 
                    >
                        <i className="fas fa-bars"></i>
                    </IconButton>
                    <SideNav />
                    <Typography variant="h6">
                        Chats
                    </Typography>
                </Toolbar>
            </AppBar>
        </SideNavContext.Provider>
    )
}