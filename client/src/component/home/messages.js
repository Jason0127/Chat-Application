import React, { useContext } from 'react';
import { Paper, List } from '@material-ui/core';
import { Link } from 'react-router-dom';
import {HomeContext} from '../../context/context'
import ChatHeads from '../widgetUi/chat_heads';


export default function Messages() {

    const context = useContext(HomeContext)

    const renderMessages = (messages) =>{
        return messages.length > 0 ? messages.map((item, i) =>(
            <Link key={i} className="link" to={`/chat/${item._id}/${item.cid}`}>
                <ChatHeads 
                    src={item.profile}
                    fname={item.name.fname}
                    lname={item.name.lname}
                    message={item.message}
                />
            </Link>
        )) : null
    }

    return(
        <Paper square classes={{
            root: 'pt-2'
        }}
            elevation={0}
        >
            <List>
                {renderMessages(context.contact)}
            </List>
        </Paper>
    )

}