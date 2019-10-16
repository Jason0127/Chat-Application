import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from './component/home/home';
// import Layout from './hoc/layout';
import ChatBox from './component/chatbox/chatboxhome';
import Auth from './hoc/auth';
import Login from './component/login/login';
import MessageRequest from './component/home/message_request';

export default function Routes(props){
    
    return(
        <Switch>
            <Route path="/" exact component={(re)=>Auth(Home, re, true)}/>
            <Route path="/chat/:id/:cid" exact component={(re)=>Auth(ChatBox, re, true)} />
            {/* <Route path="/message_req/:id/cid" exact component={(re)=>Auth(MessageRequest, re, truea)} /> */}
            <Route path="/login" exact component={(re)=>Auth(Login, re, false)} />
        </Switch>
    )

}