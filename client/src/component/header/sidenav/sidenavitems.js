import React, { useContext } from 'react';
import { List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import {HomeContext, SideNavContext} from '../../../context/context'

export default function SideNavItems() {
    const context = useContext(HomeContext)
    const toggleSideNav = useContext(SideNavContext).toggler

    const items = [
        {
            text: 'Message Request',
            icon: 'fas fa-sign-in-alt',
            restricted: true,
            onClick: context.togglePageMessageReq
        },
        {
            text: 'Login',
            icon: 'fas fa-sign-in-alt',
            restricted: true
        },
        {
            text: 'Login',
            icon: 'fas fa-sign-in-alt',
            restricted: true
        }
    ]

    const loadItems =(items)=>{
        return items ? items.map((item, i) =>(
            <ListItem 
                button 
                key={i}
                onClick={item.onClick ? ()=> {
                    item.onClick() 
                    toggleSideNav()
                } : ()=>{}}
            >
                <ListItemIcon>
                    <i className={item.icon} style={{color: 'white'}}></i>
                </ListItemIcon>
                <ListItemText primary={item.text} />
            </ListItem>
        )) : null
    }

    return(
        <div>
            <List 
                style={{color: 'white', marginTop: '2rem'}}
            >
                {loadItems(items)}
            </List>
        </div>
    )
}