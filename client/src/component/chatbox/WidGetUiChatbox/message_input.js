import React, { useContext, useState } from 'react';
import {ChatBoxHomeContext} from '../../../context/context'
import ContenEditaBle from './mess_con_input';
import { IconButton, Grid, AppBar } from '@material-ui/core';



export default function MessageInput(){
    const context = useContext(ChatBoxHomeContext)
    const [messageInput, setMessageInput] = useState('')

    const handleInput = (e)=>{
        setMessageInput(e.currentTarget.textContent)
    }

    const handleClick = ()=>{
        context.scrollToBottom()
    }

    const handeSendMessage = ()=>{
        let dataToSend = {
            message: messageInput
        }
        context.sendMessage(dataToSend)
        setMessageInput('');
    }

    // console.log(messageInput)
    return(
        <AppBar position="fixed" className="bottom-appbar" color="default">
            <div className="row m-0">
                <Grid item xs={12} sm={12}>
                    <div className="parnt-message-box">
                        <IconButton
                            
                        >
                            <i className="far fa-image"></i>
                        </IconButton>
                        <ContenEditaBle 
                            ariaLabel="Type Message..."
                            onClick={handleClick} 
                            onChange={(e)=>handleInput(e)} 
                            value={messageInput}
                            handeSendMessage={handeSendMessage}  
                        />
                    </div>
                </Grid>
            </div>
        </AppBar>
    )
}
