import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default function ChatBoxHeader(){
    return(
        <AppBar position="fixed">
            <Toolbar>
                <Link to="/">
                    <IconButton  className="chat-box-header">
                        <i className="fas fa-arrow-left"></i>
                    </IconButton>
                </Link>
                <Avatar src="/profiles/avatar.jpg" alt="avatar"></Avatar>
                <Typography className="ml-1">
                    Flores Jason
                </Typography>
            </Toolbar>
        </AppBar>
    )
}