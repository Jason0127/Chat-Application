import React, { useContext } from 'react'
import {HomeContext} from '../../context/context';
import {Link} from 'react-router-dom'
import { Paper, List,
    Typography } from '@material-ui/core';
import ChatHeads from '../widgetUi/chat_heads';

export default function MessageRequest(){
    const context = useContext(HomeContext)
    console.log(context.messageReq)
    const MessageRequestItem = ()=>{
        return context.messageReq ? context.messageReq.map((item, i) =>{
            return(
                <React.Fragment key={i}>
                    <Link to={{
                        pathname: `/chat/${item._id}/${item.cid}`,
                        acceptRequest: true
                    }}
                    >
                        <ChatHeads 
                            src={null}
                            fname={item.name.fname}
                            lname={item.name.lname}
                            message={item.message}
                        />
                    </Link>
                </React.Fragment>
            )
        }) : null
    }
    return(
        <Paper square classes={{
            root: 'pt-2'
        }}
            elevation={0}
        >
            <Typography gutterBottom variant="h5" align="center">
                Message Request
            </Typography>
            <List>
                <MessageRequestItem />
            </List>
        </Paper>
    )
}