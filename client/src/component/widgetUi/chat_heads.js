import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core';

export default function ChatHeads(props){

    const setCapitalFW = (data)=>{
        return data.charAt(0).toUpperCase() + data.substr(1);
    }

    const setName = (fname, lname) =>{
        return setCapitalFW(lname) + ' ' + setCapitalFW(fname)
    }

    return(
        <ListItem button>
            <ListItemAvatar>
                <Avatar
                    src={props.src}
                    className={props.src ? '' : 'no-profile'}
                >
                    {props.src ? '' : props.lname.charAt(0).toUpperCase()}
                </Avatar>
            </ListItemAvatar>
            <ListItemText 
                primary={setName(props.fname, props.lname)}
                secondary={props.message}
            />
        </ListItem>
    )
}