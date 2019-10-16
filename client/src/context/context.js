import React from 'react';

const SideNavContext = React.createContext({
    toggleDrawer: false,
    toggler: function(e){}
})

const ChatBoxHomeContext = React.createContext({
    messages: [],
    sendMessage: ()=>{
        console.log('asdasd')
    },
    scrollToBottom: ()=>{}
})

const HomeContext = React.createContext({
    contact: [],
    messageReq: [],
    togglePageMessageReq: ()=>{}
})

const MessageAcceptReq = React.createContext({
    accepted: false,
    accFunc: function(){
        this.accepted = true
    }
})

export{
    SideNavContext,
    ChatBoxHomeContext,
    HomeContext,
    MessageAcceptReq
}