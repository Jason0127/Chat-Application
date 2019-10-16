import React, {useContext} from 'react';
import { Drawer } from '@material-ui/core';
import SideNavItems from './sidenavitems';
import {SideNavContext} from '../../../context/context'

export default function SideNav(props){
    const context = useContext(SideNavContext)
    console.log(context)
    return(
        <div>
            <Drawer
                // onKeyDown={context.toggler}
                onClose={context.toggler}
                open={context.toggleDrawer}
                style={{color: 'black'}}
                PaperProps={{
                    id: 'drawer',
                    style: {
                        backgroundColor: '#242424',
                        width: '220px'
                    }
                }}
            >
                <SideNavItems />
            </Drawer>
        </div>
    )
}