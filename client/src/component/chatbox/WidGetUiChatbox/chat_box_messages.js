import React, { useContext } from 'react';
import { Avatar, Container } from '@material-ui/core';
import MessageInput from './message_input';
import {ChatBoxHomeContext} from '../../../context/context'

export default function ChatBoxMessages(props){
    const context = useContext(ChatBoxHomeContext)

    const [indexToSkip] = [[]]

    const messageAgain = (id)=>{
        let template = []

        for(let i = 0; i < context.messages.length; i++){
            let isInIndex = indexToSkip.find(index =>{
                if(index === i){
                    return true
                }
                return null
            })
            if(isInIndex >= 0){
                continue //PreventLoop
            }
            if(id !== context.messages[i].from._id){
                break;
            }
            indexToSkip.push(i)
            template.push(
                <div className="you mb-0-5" key={i}>
                    <div className="chat-container max-width-chat-container">
                        <div className="chat-message border-box"><span>{context.messages[i].message}</span></div>
                    </div>
                </div>
            )
        }
        return template
    }

    const yourMessage = (item, i)=>{
        return(
            <div className="you-container" key={i}>
                <Avatar className="mr-0-5 d-inline-block p-absolute-b-0" src="/profiles/avatar.jpg" alt="chatHeads" />
                <div className="you mb-0-5">
                    <div className="chat-container max-width-chat-container">
                        <div className="chat-message border-box"><span>{item.message}</span></div>
                    </div>
                </div>
                {messageAgain(item.from._id)}
            </div>
        )
    }

    const myMessage = (item)=>{
        return(
            <div className="me">
                <div className="chat-container max-width-chat-container mb-0-5">
                    {/* <Avatar className="ml-1 d-inline-block" src="/profiles/avatar.jpg" alt="chatHeads" /> */}
                    <div className="chat-message border-box"><span>{item.message}</span></div>
                </div>
            </div>
        )
    }

    const Messages = (messages) =>{
        return messages.length > 0 ? messages.map((item, key) =>{
            for(let i = 0; i < indexToSkip.length; i++){
                if(key === indexToSkip[i]){
                    return null
                }
            }
            
            if(item.from._id !== props.match.params.id){
                indexToSkip.push(key)
                return(
                    <React.Fragment key={key}>
                        {myMessage(item)}
                    </React.Fragment>
                )
            }
            indexToSkip.push(key)
            let messageTemplate = yourMessage(item, key)
            return messageTemplate
        }) : <div>Chat?</div>
    }



    return(
        <Container
            maxWidth="sm"
        >
            <div className="message-container mt-1-5">
                <div>
                    {Messages(context.messages)}
                </div>
            </div>
            <MessageInput />
        </Container>
    )
}