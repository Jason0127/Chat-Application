import React, { useState, useRef, useEffect, useContext } from 'react';
import ChatBoxHeader from './WidGetUiChatbox/chat_box_header';
import ChatBoxMessages from './WidGetUiChatbox/chat_box_messages';
import {ChatBoxHomeContext, HomeContext} from '../../context/context';
import {getChatMessages, sendReply} from '../../actions/action'
import {socket} from '../../config/configSocket'

export default function ChatBox(props){
    const messsageEndRef = useRef()
    const [messages, setMessages] = useState([
       
    ])

    const context = useContext(HomeContext)
    console.log(context)
    console.log(props)
    const cid = props.match.params.cid
    useEffect(()=>{
        getChatMessages(cid).then(res =>{
            setMessages([
                ...res.payload
            ])
        })
        return ()=>{
            socket.removeAllListeners()
        }
    }, [cid])

    function listenToReply(){
        socket.on('refreshMessageReciver', () =>{
            getChatMessages(cid, messages.length).then(res =>{
                setMessages([
                    ...messages,
                    ...res.payload
                ])
            })
        })
    }

    useEffect(listenToReply, [])

    const scrollToBottom = ()=>{
        messsageEndRef.current.scrollIntoView()
    }

    console.log(props)

    const sendMessage = (send)=>{
        const body = {
            converId: props.match.params.cid,
            senderId: props.userInfo.id,
            message: send.message,
            index: messages.length
        }
        setMessages([
            ...messages,
            {
                from: {
                    _id: body.senderId,
                },
                message: body.message
            }
        ])
        sendReply(body).then(res=>{
            // console.log(messages)
            setMessages([
                ...messages,
                res.payload.message
            ])
            socket.emit('refreshMessage', true)
        })
    }
    useEffect(()=>{
        scrollToBottom();
    });

    console.log(messages)

    return(
   
        <ChatBoxHomeContext.Provider
            value={{
                messages: messages,
                sendMessage: sendMessage,
                ref: messsageEndRef,
                scrollToBottom: scrollToBottom
            }}
        >
            <ChatBoxHeader />
            <ChatBoxMessages {...props} />
            <div id="end" ref={messsageEndRef}/>
        </ChatBoxHomeContext.Provider>
    )
}